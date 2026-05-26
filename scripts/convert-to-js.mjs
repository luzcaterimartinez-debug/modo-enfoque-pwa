import { transform } from "sucrase";
import fs from "fs";
import path from "path";

const root = path.resolve("src");
const skip = new Set(["routeTree.gen.ts"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.tsx?$/.test(entry.name)) files.push(full);
  }
  return files;
}

function convertFile(filePath) {
  if (skip.has(path.basename(filePath))) return;
  const code = fs.readFileSync(filePath, "utf8");
  const isTsx = filePath.endsWith(".tsx");
  const { code: out } = transform(code, {
    transforms: ["typescript", ...(isTsx ? ["jsx"] : [])],
    jsxRuntime: "automatic",
    production: false,
  });
  const newPath = filePath.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
  fs.writeFileSync(newPath, out);
  fs.unlinkSync(filePath);
  console.log(`${path.relative(process.cwd(), filePath)} -> ${path.relative(process.cwd(), newPath)}`);
}

function convertRouteTree() {
  const filePath = path.join(root, "routeTree.gen.ts");
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, "utf8");
  code = code
    .replace(/\/\* eslint-disable \*\/\n\n\/\/ @ts-nocheck\n\n[\s\S]*?automatically generated[\s\S]*?\n\n/, "")
    .replace(/ as any/g, "")
    .replace(/declare module[\s\S]*?\n}\n\n/g, "")
    .replace(/import type \{ getRouter \} from '\.\/router\.tsx'\nimport type \{ startInstance \} from '\.\/start\.ts'\n/g, "");
  const { code: out } = transform(code, {
    transforms: ["typescript"],
    jsxRuntime: "automatic",
  });
  fs.writeFileSync(path.join(root, "routeTree.gen.js"), out);
  fs.unlinkSync(filePath);
  console.log("routeTree.gen.ts -> routeTree.gen.js");
}

for (const file of walk(root)) convertFile(file);

const viteTs = path.resolve("vite.config.ts");
if (fs.existsSync(viteTs)) {
  const { code: out } = transform(fs.readFileSync(viteTs, "utf8"), {
    transforms: ["typescript"],
    jsxRuntime: "automatic",
  });
  fs.writeFileSync(path.resolve("vite.config.js"), out.replace(/\/\/ @lovable[\s\S]*?\n\n/, ""));
  fs.unlinkSync(viteTs);
  console.log("vite.config.ts -> vite.config.js");
}

convertRouteTree();
console.log("Done.");
