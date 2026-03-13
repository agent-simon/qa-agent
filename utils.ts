import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

export async function callAgent({
  system,
  userMessage,
  screenshot,
  maxTokens,
}: {
  system: string;
  userMessage: string;
  maxTokens: number;
  screenshot?: string,
}): Promise<string> {
  const content = screenshot
      ? [
          { type: "text" as const, text: userMessage },
          {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: "image/png" as const,
              data: screenshot,
            },
          },
        ]
      : userMessage;

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content }],
  });

  let fullResponse = "";
  stream.on("text", (text) => {
    process.stdout.write(text);
    fullResponse += text;
  });

  await stream.finalMessage();
  return fullResponse;
}

// Helper function to extract files from generated content
export function extractFilesFromGenerated(
  content: string
): Array<{ filename: string; ext: string; code: string }> {
  const files: { filename: string; ext: string; code: string }[] = [];
  const segments = content.split(/(?=\*\*`[^`]+`\*\*)/);

  for (const segment of segments) {
    const filenameMatch = segment.match(/\*\*(?:File: )?`([^`]+\.\w+)`\*\*/);
    const codeMatch = segment.match(/```(?:typescript|javascript|gherkin)\n([\s\S]*?)```/);

    if (filenameMatch && codeMatch) {
      const filename = filenameMatch[1];
      files.push({
        filename,
        ext: filename.split(".").pop() || "",
        code: codeMatch[1],
      });
    }
  }

  return files;
}