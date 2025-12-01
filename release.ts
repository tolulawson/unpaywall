import { $ } from "bun";
import { existsSync } from "fs";

console.log("🎯 Creating release...");

// Run build first
console.log("🔨 Building extension...");
await $`bun run build.ts`;

// Remove existing zip if it exists
if (existsSync("unpaywall.zip")) {
  await $`rm unpaywall.zip`;
}

// Create zip archive from dist folder contents
console.log("📦 Creating zip archive...");
await $`cd dist && zip -r ../unpaywall.zip . -x "*.DS_Store" "._*" ".Spotlight-V100" ".Trashes" "__MACOSX"`;

console.log("🚀 Release complete! unpaywall.zip ready for distribution"); 