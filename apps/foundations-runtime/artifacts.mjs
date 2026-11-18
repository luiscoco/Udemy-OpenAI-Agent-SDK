import { randomUUID, createHash } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";

const directory = new URL("../.runtime/lesson-artifacts/", import.meta.url);
const mimeTypes = {
  png: "image/png",
  webp: "image/webp",
  jpeg: "image/jpeg",
  csv: "text/csv",
  json: "application/json",
  txt: "text/plain",
  wav: "audio/wav",
};
export async function saveArtifact(bytes, extension, label) {
  if (!mimeTypes[extension]) throw new Error("Unsupported artifact format.");
  const buffer = Buffer.from(bytes);
  if (!buffer.length || buffer.length > 10 * 1024 * 1024)
    throw new Error("Artifact must contain between 1 byte and 10 MiB.");
  const filename = `${randomUUID()}.${extension}`;
  await mkdir(directory, { recursive: true });
  await writeFile(new URL(filename, directory), buffer, { flag: "wx" });
  return {
    url: `/api/artifacts/${filename}`,
    mime: mimeTypes[extension],
    label,
    bytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
  };
}
export async function readArtifact(filename) {
  if (!/^[a-f0-9-]{36}\.(png|webp|jpeg|csv|json|txt|wav)$/.test(filename))
    return null;
  try {
    return {
      bytes: await readFile(new URL(filename, directory)),
      mime: mimeTypes[filename.split(".").at(-1)],
    };
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
export function decodeGeneratedImage(result) {
  if (
    typeof result !== "string" ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(result) ||
    result.length > 14 * 1024 * 1024
  )
    throw new Error("Image generation returned no valid base64 image.");
  const bytes = Buffer.from(result, "base64");
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return { bytes, extension: "png" };
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    return { bytes, extension: "jpeg" };
  if (
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  )
    return { bytes, extension: "webp" };
  throw new Error("Generated image format could not be verified.");
}
