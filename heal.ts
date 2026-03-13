import { healOrchestrator } from "./healOrchestrator.ts";

const testFile = process.argv[2];
if (!testFile) {
  console.error("Usage: npx ts-node --esm heal.ts <test-file>");
  process.exit(1);
}

healOrchestrator(testFile).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
