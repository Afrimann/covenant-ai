"use node";

import pdf from "pdf-parse";

export async function extractTextFromPdf(buffer: ArrayBuffer | Uint8Array | Buffer): Promise<string> {
  const data = await pdf(Buffer.from(buffer as any));
  return (data.text ?? "").trim();
}
