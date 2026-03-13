import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { callAgent } from "./utils.ts";

async function healOrchestrator(testFile: string) {
  const MAX_RETRIES = 3;
  let attempt = 0;

  // run test first to get initial error
  let result = await runTests(testFile);
  if (result.passed) return;

  while (attempt < MAX_RETRIES) {
    attempt++;
    const source = fs.readFileSync(path.resolve(testFile), "utf-8");
    const diagnoses = await diagnose(testFile, result.output, source);

    for (const diagnosis of diagnoses) {
      const fileSource = fs.readFileSync(path.resolve(diagnosis.file), "utf-8");
      const fixed = await applyFix(diagnosis, fileSource);
      fs.writeFileSync(path.resolve(diagnosis.file), fixed, "utf-8");
      console.log("🔍 Diagnoses:", JSON.stringify(diagnoses, null, 2));
      console.log("📝 Fixed content preview:", fixed.slice(0, 200));
    }

    result = await runTests(testFile);
    if (result.passed) return;
    
  }

  
  console.log("❌ Max retries reached — could not heal test");
}

async function runTests(testFile: string): Promise<{ passed: boolean; output: string }> {
  const execAsync = promisify(exec);
  try {
    const { stdout, stderr } = await execAsync(`npx playwright test ${testFile}`);
    return { passed: true, output: stdout };
  } catch (err: any) {
    return { passed: false, output: err.stdout + err.stderr };
  }
}

function findScreenshot(testResultsDir: string): string | null {
    const entries = fs.readdirSync(testResultsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const found = findScreenshot(path.join(testResultsDir, entry.name));
        if (found) return found;
      }
        if (entry.name.endsWith(".png")) {
          return path.join(testResultsDir, entry.name);
        }
      }
    return null;
  }


async function diagnose(testFile: string, errorOutput: string, source: string): Promise<Array<{ file: string; [key: string]: any }>> {
  // TODO: Implement diagnosis logic to analyze test failures and return fixes needed
  const diagnoseSystem = fs.readFileSync("./agents/diagnose/system.md", "utf-8");
  const userMessage = `Test file failed with error: ${errorOutput} Test source code: ${source}`

  const screenshotPath = findScreenshot("./test-results");
  const screenshotBase64 = screenshotPath ? fs.readFileSync(screenshotPath).toString("base64") 
  : undefined;

  const response = await callAgent({
    system: diagnoseSystem,
    userMessage,
    screenshot: screenshotBase64,
    maxTokens: 2048,
  });
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
} catch (err) {
  console.error("Failed to parse diagnosis response:", err);
}
return [];
}



async function applyFix(diagnosis: { file: string; [key: string]: any }, fileSource: string): Promise<string> {
  const fixSystem = fs.readFileSync("./agents/fix/system.md", "utf-8");
  const userMessage = `Diagnosis: ${JSON.stringify(diagnosis, null, 2)}\n\nSource file:\n${fileSource}`;

  const response = await callAgent({
    system: fixSystem,
    userMessage,
    maxTokens: 8192,
  });

  return response;
}

export { healOrchestrator };