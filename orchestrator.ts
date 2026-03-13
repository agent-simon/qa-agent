import fs from "fs";
import { callAgent, extractFilesFromGenerated } from "./utils";



export async function runAgentChain(userRequest: string, pageData: object) {
  // 1. ANALYZE - Extract page structure and capabilities
  const analyzeSystem = fs.readFileSync("./agents/analyze/system.md", "utf-8");
  const analyzeResponse = await callAgent({
    system: analyzeSystem,
    userMessage: `Analyze this page: ${JSON.stringify(pageData)}`,
    maxTokens: 2048,
  });

  const cleaned = analyzeResponse.replace(/```json\n?|\n?```/g, "").trim();
  const analysisResult = JSON.parse(cleaned);
  console.log("✅ Analysis complete");

  // 2. GENERATE - Create test files based on analysis + user request
  const generateSystem = fs.readFileSync("./agents/generate/system.md", "utf-8");
  const generatedContent = await callAgent({
    system: generateSystem,
    userMessage: `User request: ${userRequest}\n\nPage analysis: ${JSON.stringify(analysisResult)}`,
    maxTokens: 8192,
  });
  console.log("✅ Files generated");

  // 3. VALIDATE - Check generated files against syntax, imports, selectors, best practices
  const validateSystem = fs.readFileSync("./agents/validate/system.md", "utf-8");
  const validationReport = await callAgent({
    system: validateSystem,
    userMessage: `Validate these generated files:\n\n${generatedContent}\n\nAgainst this page analysis:\n${JSON.stringify(analysisResult)}`,
    maxTokens: 2048,
  });
  
  const validation = JSON.parse(validationReport);
console.log("📝 Raw generated content:", generatedContent.slice(0, 500));
  return {
    files: extractFilesFromGenerated(generatedContent),
    validation,
  };
}
