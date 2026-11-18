import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

export async function mediaFixtures() {
  const root = new URL("../../public/assets/", import.meta.url);
  const image = await readFile(new URL("classroom-shapes.png", root));
  const pdf = await readFile(new URL("classroom-workshop.pdf", root));
  const text = await readFile(new URL("classroom-workshop.txt", root), "utf8");
  return {
    image,
    pdf,
    text,
    imageData: `data:image/png;base64,${image.toString("base64")}`,
    pdfData: `data:application/pdf;base64,${pdf.toString("base64")}`,
    imageHash: createHash("sha256").update(image).digest("hex"),
    pdfHash: createHash("sha256").update(pdf).digest("hex"),
  };
}

export function imageQuestion(fixtures, question) {
  return [
    {
      role: "user",
      content: [
        { type: "input_text", text: question },
        { type: "input_image", image: fixtures.imageData, detail: "high" },
      ],
    },
  ];
}

export function documentQuestion(fixtures, format, question) {
  return [
    {
      role: "user",
      content: [
        { type: "input_text", text: question },
        format === "pdf"
          ? {
              type: "input_file",
              file: fixtures.pdfData,
              filename: "classroom-workshop.pdf",
            }
          : { type: "input_text", text: fixtures.text },
      ],
    },
  ];
}

export function summarizePayload(value) {
  return JSON.parse(
    JSON.stringify(value, (key, item) => {
      if (typeof item === "string" && item.startsWith("data:"))
        return `[${item.slice(0, item.indexOf(";"))}; ${item.length} encoded characters]`;
      return item;
    }),
  );
}

export function createMediaTool({ sdk, z, fixtures, modality, observed }) {
  return sdk.tool({
    name: "read_classroom_fixture",
    description: "Return the requested classroom teaching fixture.",
    parameters: z.object({}),
    errorFunction: null,
    execute: async () => {
      observed.push(modality);
      if (modality === "text") return { type: "text", text: fixtures.text };
      if (modality === "image")
        return {
          type: "image",
          image: {
            data: fixtures.image.toString("base64"),
            mediaType: "image/png",
          },
        };
      return {
        type: "file",
        file: {
          data: fixtures.pdf.toString("base64"),
          mediaType: "application/pdf",
          filename: "classroom-workshop.pdf",
        },
      };
    },
  });
}
