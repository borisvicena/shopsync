const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectName = "shopsync-project";
const excludeDirs = ["node_modules", ".next", ".git", "out", ".vercel"];
const excludeFiles = [".env.local", ".DS_Store"];

console.log("🗜️  Zipping project for submission...\n");

// Build the exclude flags for zip command
const excludeFlags = [...excludeDirs.map((dir) => `-x "${dir}/*"`), ...excludeFiles.map((file) => `-x "${file}"`)].join(
  " "
);

try {
  // Create zip file
  const command = `zip -r ${projectName}.zip . ${excludeFlags}`;
  execSync(command, { stdio: "inherit" });

  console.log(`\n✅ Project zipped successfully: ${projectName}.zip`);
  console.log("\n📋 Contents included:");
  console.log("   ✓ Source code (app/, components/, lib/)");
  console.log("   ✓ Configuration files");
  console.log("   ✓ package.json");
  console.log("\n📋 Excluded (can be regenerated):");
  console.log("   ✗ node_modules/");
  console.log("   ✗ .next/");
  console.log("   ✗ .git/");
} catch (error) {
  console.error("❌ Error creating zip:", error.message);
}
