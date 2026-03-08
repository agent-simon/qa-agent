import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { chromium } from "playwright";
import { runAgentChain } from "./orchestrator.ts";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${process.argv[3]}`);
// const pageContent = await page.content();
const pageData = await page.evaluate(() => {
  return {
    inputs: Array.from(document.querySelectorAll('input')).map(el => ({
      type: el.type,
      name: el.name,
      id: el.id,
      placeholder: el.placeholder
    })),
    buttons: Array.from(document.querySelectorAll('button, [type="submit"]')).map(el => ({
      text: el.textContent?.trim(),
      type: el.getAttribute('type'),
      id: el.id
    })),
    forms: Array.from(document.querySelectorAll('form')).map(el => ({
      id: el.id,
      action: el.action
    })),
    headings: Array.from(document.querySelectorAll('h1,h2,h3')).map(el => el.textContent?.trim())
  };
});

await browser.close()

const userMessage = `${process.argv[2]} - URL: ${process.argv[3]} 
Page structure: ${JSON.stringify(pageData, null, 2)}`;

console.log("User message:", process.argv[2]);
console.log("URL:", process.argv[3]);

process.env.BASE_URL = process.argv[3];

const { files, validation } = await runAgentChain(process.argv[2], pageData)
console.log("📦 Files to write:", JSON.stringify(files, null, 2));
files.forEach(({ filename, ext, code }) => {
  const fullPath = path.join(".", filename);
  console.log(`📄 ${filename} (${ext})`);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, code, "utf8");
  console.log(`✅ Written: ${fullPath}`);
});

console.log("🔍 Validation report:", JSON.stringify(validation, null, 2));


// const stream = await client.messages.stream({
//   model: "claude-sonnet-4-20250514",
//   max_tokens: 8192,
//   system,
//   messages: [{ role: "user", content: userMessage }],
//   // @ts-ignore
//   // mcp_servers: [
//   //   {
//   //     type: "url",
//   //     url: "http://localhost:3000",
//   //     name: "playwright-agent",
//   //   }
//   // ],
// });

// stream.on("text", (text) => {
//   process.stdout.write(text); // print each chunk as it arrives
// });

// const response = await stream.finalMessage();

// const content = (response.content[0] as { text: string }).text;
// console.log("Generated Content:\n", content);
// // Replace the regex pairing block with this:
// const files: { filename: string; ext: string; code: string }[] = [];

// // Split on filename markers, then grab the first code block from each chunk
// const segments = content.split(/(?=\*\*`[^`]+`\*\*)/);

// for (const segment of segments) {
//   const filenameMatch = segment.match(/\*\*(?:File: )?`([^`]+\.\w+)`\*\*/);  // must have extension
//   const codeMatch = segment.match(/```(?:typescript|javascript|gherkin)\n([\s\S]*?)```/);

//   if (filenameMatch && codeMatch) {
//     const filename = filenameMatch[1];
//     files.push({
//       filename,
//       ext: path.extname(filename),
//       code: codeMatch[1],
//     });
//   }
// }

