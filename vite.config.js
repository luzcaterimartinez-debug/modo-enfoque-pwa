import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

const isVercel = !!process.env.VERCEL;

const ROUTE_TREE = path.resolve("src/routeTree.gen.js");

function stripRouteTreeCode(code) {
  return code
    .replace(/ as any/g, "")
    .replace(/^import type .+\n/gm, "")
    .replace(/^export interface [\s\S]*?^}\n/gm, "")
    .replace(/^declare module [\s\S]*?^}\n/gm, "")
    .replace(/\._addFileTypes<[^>]+>\(\)/g, "")
    .replace(/: RootRouteChildren = /g, " = ")
    .replace(/\/\/ @ts-nocheck\n\n/g, "")
    .replace(/\/\/ noinspection JSUnusedGlobalSymbols\n\n/g, "")
    .trimEnd() + "\n";
}

function isRouteTreeId(id) {
  return id.replace(/\\/g, "/").endsWith("/src/routeTree.gen.js");
}

function stripRouteTreeTypes() {
  return {
    name: "strip-route-tree-types",
    enforce: "pre",
    load(id) {
      if (!isRouteTreeId(id)) return null;
      if (!fs.existsSync(ROUTE_TREE)) return null;
      return stripRouteTreeCode(fs.readFileSync(ROUTE_TREE, "utf8"));
    },
    transform(code, id) {
      if (!isRouteTreeId(id)) return null;
      return { code: stripRouteTreeCode(code), map: null };
    },
  };
}

function copyPublicToClient() {
  return {
    name: "copy-public-to-client",
    closeBundle: {
      order: "post",
      handler() {
        const publicDir = path.resolve("public");
        if (!fs.existsSync(publicDir)) return;

        const outDirs = [path.resolve("dist/client")];
        for (const dir of [".output/public", ".vercel/output/static"]) {
          const resolved = path.resolve(dir);
          if (fs.existsSync(resolved)) outDirs.push(resolved);
        }

        for (const outDir of outDirs) {
          if (!fs.existsSync(outDir)) continue;
          for (const file of fs.readdirSync(publicDir)) {
            fs.copyFileSync(path.join(publicDir, file), path.join(outDir, file));
          }
        }
      },
    },
  };
}

export default defineConfig({
  cloudflare: isVercel ? false : undefined,
  environments: {
    client: {
      build: {
        copyPublicDir: true,
      },
    },
  },
  plugins: [stripRouteTreeTypes(), copyPublicToClient(), ...(isVercel ? [nitro()] : [])],
  tanstackStart: {
    server: { entry: "server" },
    router: {
      generatedRouteTree: "routeTree.gen.js",
      disableTypes: true,
    },
  },
});
