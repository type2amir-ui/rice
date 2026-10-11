import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Standard CRC32 implementation for PKZIP
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC32_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZipBuffer(entries) {
  const fileRecords = [];
  let totalLocalSize = 0;

  for (const entry of entries) {
    const nameBytes = Buffer.from(entry.path, 'utf8');
    const rawBytes = Buffer.isBuffer(entry.content)
      ? entry.content
      : Buffer.from(entry.content, 'utf8');
    const crc = crc32(rawBytes);
    // Use DEFLATE compression (method 8) for smaller, fast-uploading WordPress theme ZIP!
    const compressedBytes = zlib.deflateRawSync(rawBytes, { level: 6 });

    fileRecords.push({
      nameBytes,
      rawBytes,
      compressedBytes,
      crc,
      method: 8,
      offset: totalLocalSize
    });
    totalLocalSize += 30 + nameBytes.length + compressedBytes.length;
  }

  let centralDirSize = 0;
  for (const rec of fileRecords) {
    centralDirSize += 46 + rec.nameBytes.length;
  }

  const totalZipSize = totalLocalSize + centralDirSize + 22;
  const out = Buffer.alloc(totalZipSize);
  let ptr = 0;

  for (const rec of fileRecords) {
    out.writeUInt32LE(0x04034b50, ptr);
    out.writeUInt16LE(20, ptr + 4);
    out.writeUInt16LE(0x0800, ptr + 6);
    out.writeUInt16LE(rec.method, ptr + 8);
    out.writeUInt16LE(0x4800, ptr + 10);
    out.writeUInt16LE(0x593b, ptr + 12);
    out.writeUInt32LE(rec.crc, ptr + 14);
    out.writeUInt32LE(rec.compressedBytes.length, ptr + 18);
    out.writeUInt32LE(rec.rawBytes.length, ptr + 22);
    out.writeUInt16LE(rec.nameBytes.length, ptr + 26);
    out.writeUInt16LE(0, ptr + 28);
    ptr += 30;

    rec.nameBytes.copy(out, ptr);
    ptr += rec.nameBytes.length;

    rec.compressedBytes.copy(out, ptr);
    ptr += rec.compressedBytes.length;
  }

  const centralDirOffset = ptr;

  for (const rec of fileRecords) {
    out.writeUInt32LE(0x02014b50, ptr);
    out.writeUInt16LE(20, ptr + 4);
    out.writeUInt16LE(20, ptr + 6);
    out.writeUInt16LE(0x0800, ptr + 8);
    out.writeUInt16LE(rec.method, ptr + 10);
    out.writeUInt16LE(0x4800, ptr + 12);
    out.writeUInt16LE(0x593b, ptr + 14);
    out.writeUInt32LE(rec.crc, ptr + 16);
    out.writeUInt32LE(rec.compressedBytes.length, ptr + 20);
    out.writeUInt32LE(rec.rawBytes.length, ptr + 24);
    out.writeUInt16LE(rec.nameBytes.length, ptr + 28);
    out.writeUInt16LE(0, ptr + 30);
    out.writeUInt16LE(0, ptr + 32);
    out.writeUInt16LE(0, ptr + 34);
    out.writeUInt16LE(0, ptr + 36);
    out.writeUInt32LE(0, ptr + 38);
    out.writeUInt32LE(rec.offset, ptr + 42);
    ptr += 46;

    rec.nameBytes.copy(out, ptr);
    ptr += rec.nameBytes.length;
  }

  out.writeUInt32LE(0x06054b50, ptr);
  out.writeUInt16LE(0, ptr + 4);
  out.writeUInt16LE(0, ptr + 6);
  out.writeUInt16LE(fileRecords.length, ptr + 8);
  out.writeUInt16LE(fileRecords.length, ptr + 10);
  out.writeUInt32LE(centralDirSize, ptr + 12);
  out.writeUInt32LE(centralDirOffset, ptr + 16);
  out.writeUInt16LE(0, ptr + 20);

  return out;
}

const distAssetsDir = path.resolve('dist/assets');
const publicThemeBuildDir = path.resolve('public/wp-theme-build');
fs.mkdirSync(publicThemeBuildDir, { recursive: true });

const files = fs.readdirSync(distAssetsDir);
const cssFile = files.find((f) => f.endsWith('.css'));
const jsFile = files.find((f) => f.endsWith('.js'));
const imageFiles = files.filter((f) => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.svg'));

if (!cssFile || !jsFile) {
  throw new Error('Missing compiled CSS or JS in dist/assets');
}

const rawCss = fs.readFileSync(path.join(distAssetsDir, cssFile), 'utf8');
let rawJs = fs.readFileSync(path.join(distAssetsDir, jsFile), 'utf8');

// Rewrite "/assets/rice_" image paths so they resolve from either window.__WP_THEME_URI__ or /assets/
rawJs = rawJs.replace(
  /"\/assets\/(rice_[^"]+)"/g,
  '((window.__WP_THEME_URI__||"")+"/assets/$1")'
);

fs.writeFileSync(path.join(publicThemeBuildDir, 'app.css'), rawCss, 'utf8');
fs.writeFileSync(path.join(publicThemeBuildDir, 'app.js'), rawJs, 'utf8');

// Also copy all rice images into public/wp-theme-build/assetsManifest.json so browser builder can include them if needed
const imagesManifest = {};
for (const img of imageFiles) {
  const b64 = fs.readFileSync(path.join(distAssetsDir, img)).toString('base64');
  imagesManifest[img] = b64;
}
fs.writeFileSync(
  path.join(publicThemeBuildDir, 'images.json'),
  JSON.stringify(imagesManifest),
  'utf8'
);

console.log(
  `Prepared public/wp-theme-build/app.css (${rawCss.length} bytes), app.js (${rawJs.length} bytes), and ${imageFiles.length} product images.`
);
