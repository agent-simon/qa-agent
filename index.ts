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
