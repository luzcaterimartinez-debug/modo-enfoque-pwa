import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

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
        const outDir = path.resolve("dist/client");
        if (!fs.existsSync(publicDir) || !fs.existsSync(outDir)) return;
        for (const file of fs.readdirSync(publicDir)) {
          fs.copyFileSync(path.join(publicDir, file), path.join(outDir, file));
        }
      },
    },
  };
}

export default defineConfig({
  environments: {
    client: {
      build: {
        copyPublicDir: true,
      },
    },
  },
  plugins: [stripRouteTreeTypes(), copyPublicToClient()],
  tanstackStart: {
    server: { entry: "server" },
    router: {
      generatedRouteTree: "routeTree.gen.js",
      disableTypes: true,
    },
  },
});
