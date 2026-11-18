import { deflateSync } from "node:zlib";
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}
export function barChart(values) {
  const width = 640,
    height = 360;
  const pixels = Buffer.alloc(height * (width * 3 + 1), 248);
  for (let y = 0; y < height; y++) pixels[y * (width * 3 + 1)] = 0;
  const max = Math.max(...values, 1);
  const barWidth = Math.floor(540 / values.length);
  values.forEach((value, index) => {
    const top = 320 - Math.round((value / max) * 270);
    for (let y = top; y < 320; y++)
      for (
        let x = 50 + index * barWidth;
        x < 50 + (index + 1) * barWidth - 8;
        x++
      ) {
        const offset = y * (width * 3 + 1) + 1 + x * 3;
        pixels[offset] = 24;
        pixels[offset + 1] = 99;
        pixels[offset + 2] = 210;
      }
  });
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(pixels)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
export function parseCsv(text) {
  if (typeof text !== "string" || text.length > 8000)
    throw new Error("CSV must contain at most 8,000 characters");
  const lines = text.trim().split(/\r?\n/);
  if (lines.shift()?.trim() !== "name,value")
    throw new Error("CSV header must be name,value");
  if (!lines.length || lines.length > 30)
    throw new Error("Supply 1 to 30 data rows");
  return lines.map((line) => {
    const match = /^(?:"((?:[^"]|"")+)"|([^",]+)),(\d+(?:\.\d+)?)$/.exec(line);
    if (!match)
      throw new Error(
        "Each CSV row needs a name and a nonnegative numeric value",
      );
    const value = Number(match[3]);
    if (!Number.isFinite(value) || value > 1000000)
      throw new Error("CSV value outside supported range");
    return {
      name: (match[1]?.replaceAll('""', '"') ?? match[2]).trim(),
      value,
    };
  });
}
