const fs = require('fs');
const path = require('path');

// Generate 32x32 32-bit BMP ICO format
function createStillwaveIco() {
  const width = 32;
  const height = 32;
  const bpp = 32;
  const imageSize = width * height * 4;
  const maskSize = Math.ceil((width * height) / 8);
  const dibHeaderSize = 40;
  const totalImageData = dibHeaderSize + imageSize + maskSize;

  const buffer = Buffer.alloc(6 + 16 + totalImageData);

  // ICONDIR
  buffer.writeUInt16LE(0, 0); // Reserved
  buffer.writeUInt16LE(1, 2); // Type 1 = ICO
  buffer.writeUInt16LE(1, 4); // Count = 1

  // ICONDIRENTRY
  buffer.writeUInt8(width, 6);
  buffer.writeUInt8(height, 7);
  buffer.writeUInt8(0, 8); // Color count
  buffer.writeUInt8(0, 9); // Reserved
  buffer.writeUInt16LE(1, 10); // Color planes
  buffer.writeUInt16LE(bpp, 12); // Bits per pixel
  buffer.writeUInt32LE(totalImageData, 14); // Bytes in res
  buffer.writeUInt32LE(22, 18); // Image offset (6 + 16 = 22)

  // BITMAPINFOHEADER (offset 22)
  let offset = 22;
  buffer.writeUInt32LE(40, offset); // biSize
  buffer.writeInt32LE(width, offset + 4); // biWidth
  buffer.writeInt32LE(height * 2, offset + 8); // biHeight
  buffer.writeUInt16LE(1, offset + 12); // biPlanes
  buffer.writeUInt16LE(32, offset + 14); // biBitCount
  buffer.writeUInt32LE(0, offset + 16); // biCompression
  buffer.writeUInt32LE(imageSize + maskSize, offset + 20); // biSizeImage
  buffer.writeInt32LE(0, offset + 24);
  buffer.writeInt32LE(0, offset + 28);
  buffer.writeUInt32LE(0, offset + 32);
  buffer.writeUInt32LE(0, offset + 36);

  offset += 40;

  // Pixel data (bottom-up in BMP format)
  // Palette:
  // Dark jade sanctuary background: #0A2B2A -> R: 10, G: 43, B: 42
  // Emerald wave: #B4EBCB -> R: 180, G: 235, B: 203
  // Border: #123F3B -> R: 18, G: 63, B: 59

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const rx = Math.min(x, width - 1 - x);
      const ry = Math.min(y, height - 1 - y);
      const isCorner = (rx < 4 && ry < 4 && Math.hypot(4 - rx, 4 - ry) > 4.2);

      if (isCorner) {
        // Transparent
        buffer.writeUInt8(0, offset);
        buffer.writeUInt8(0, offset + 1);
        buffer.writeUInt8(0, offset + 2);
        buffer.writeUInt8(0, offset + 3);
      } else {
        // Sine wave matching the top nav logo: y = 15.5 + sin((x - 4) * 0.38) * 5.5
        const waveY = 15.5 + Math.sin((x - 3) * 0.38) * 5.2;
        const distFromWave = Math.abs(y - waveY);

        if (distFromWave <= 1.35 && x >= 4 && x <= 27) {
          // Emerald Wave (#B4EBCB)
          buffer.writeUInt8(203, offset); // B
          buffer.writeUInt8(235, offset + 1); // G
          buffer.writeUInt8(180, offset + 2); // R
          buffer.writeUInt8(255, offset + 3); // A
        } else if (distFromWave <= 2.2 && x >= 4 && x <= 27) {
          // Wave glow edge
          buffer.writeUInt8(140, offset); // B
          buffer.writeUInt8(180, offset + 1); // G
          buffer.writeUInt8(90, offset + 2); // R
          buffer.writeUInt8(255, offset + 3); // A
        } else if (rx === 0 || ry === 0 || (rx === 1 && ry === 1)) {
          // Border edge (#123F3B)
          buffer.writeUInt8(59, offset);
          buffer.writeUInt8(63, offset + 1);
          buffer.writeUInt8(18, offset + 2);
          buffer.writeUInt8(255, offset + 3);
        } else {
          // Deep obsidian background (#0A2B2A)
          buffer.writeUInt8(42, offset); // B
          buffer.writeUInt8(43, offset + 1); // G
          buffer.writeUInt8(10, offset + 2); // R
          buffer.writeUInt8(255, offset + 3); // A
        }
      }
      offset += 4;
    }
  }

  // AND mask
  for (let i = 0; i < maskSize; i++) {
    buffer.writeUInt8(0, offset + i);
  }

  return buffer;
}

const icoBuf = createStillwaveIco();
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), icoBuf);
console.log('✓ Successfully created Stillwave public/favicon.ico!');
