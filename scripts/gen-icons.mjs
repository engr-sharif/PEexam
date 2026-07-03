// Generates public/icons/icon-192.png and public/icons/icon-512.png with no
// image dependencies: raw RGBA pixels -> PNG chunks (manual CRC) + zlib deflate.
// Design: rounded-square solid #1d5cf5 background, centered white "▲" triangle.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---- CRC32 (PNG polynomial) -------------------------------------------------
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ---- PNG chunk encoding -----------------------------------------------------
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, rgba) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw scanlines, filter type 0 per row.
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 4);
    raw[rowStart] = 0;
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- Icon rasterizer --------------------------------------------------------
const BG = [0x1d, 0x5c, 0xf5]; // #1d5cf5
const FG = [0xff, 0xff, 0xff];

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const radius = Math.round(size * 0.18); // rounded-corner radius

  // Triangle geometry (centered, upward-pointing).
  const triTop = Math.round(size * 0.26);
  const triBottom = Math.round(size * 0.72);
  const halfBase = Math.round(size * 0.26);
  const cx = (size - 1) / 2;
  const triHeight = triBottom - triTop;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      // Rounded-square mask: transparent outside the corner arcs.
      let inside = true;
      const nearL = x < radius, nearR = x >= size - radius;
      const nearT = y < radius, nearB = y >= size - radius;
      if ((nearL || nearR) && (nearT || nearB)) {
        const ccx = nearL ? radius - 0.5 : size - radius - 0.5;
        const ccy = nearT ? radius - 0.5 : size - radius - 0.5;
        const dx = x - ccx;
        const dy = y - ccy;
        inside = dx * dx + dy * dy <= (radius - 0.5) * (radius - 0.5);
      }
      if (!inside) continue; // leave fully transparent

      // Default: brand background.
      let [r, g, b] = BG;

      // White triangle: |x - cx| <= progress * halfBase.
      if (y >= triTop && y <= triBottom) {
        const progress = (y - triTop) / triHeight;
        if (Math.abs(x - cx) <= progress * halfBase) [r, g, b] = FG;
      }

      rgba[i] = r;
      rgba[i + 1] = g;
      rgba[i + 2] = b;
      rgba[i + 3] = 255;
    }
  }
  return encodePNG(size, size, rgba);
}

const outDir = join(root, 'public', 'icons');
mkdirSync(outDir, { recursive: true });
for (const size of [192, 512]) {
  const file = join(outDir, `icon-${size}.png`);
  writeFileSync(file, drawIcon(size));
  console.log(`wrote ${file}`);
}
