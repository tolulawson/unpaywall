import { $ } from "bun";
import { existsSync } from "fs";

console.log("🚀 Building extension...");

// Clean and create dist directory
if (existsSync("dist")) {
  await $`rm -rf dist`;
}
await $`mkdir -p dist/scripts`;

// Build TypeScript files
console.log("📦 Compiling TypeScript...");
await $`bun build scripts/background.ts --outdir dist/scripts --target browser`;

// Copy static files
console.log("📋 Copying static files...");
await $`cp manifest.json dist/`;
await $`cp logo.png dist/`;

console.log("✅ Build complete! Extension ready in dist/ folder"); 