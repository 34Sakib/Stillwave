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

  // ICO header (6 bytes) + 1 Dir Entry (16 bytes) + DIB Header + Pixel Data + Mask
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
  buffer.writeInt32LE(height * 2, offset + 8); // biHeight (doubled for ICO mask)
  buffer.writeUInt16LE(1, offset + 12); // biPlanes
  buffer.writeUInt16LE(32, offset + 14); // biBitCount
  buffer.writeUInt32LE(0, offset + 16); // biCompression = BI_RGB
  buffer.writeUInt32LE(imageSize + maskSize, offset + 20); // biSizeImage
  buffer.writeInt32LE(0, offset + 24);
  buffer.writeInt32LE(0, offset + 28);
  buffer.writeUInt32LE(0, offset + 32);
  buffer.writeUInt32LE(0, offset + 36);

  offset += 40;

  // Pixel data (bottom-up in BMP format)
  // Palette colors:
  // Deep forest background: #1C2825 -> R: 28, G: 40, B: 37
  // Sage mist wave: #91AFA9 -> R: 145, G: 175, B: 169
  // Light dot: #F1F3EF -> R: 241, G: 243, B: 239

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      // Rounded corner mask
      const rx = Math.min(x, width - 1 - x);
      const ry = Math.min(y, height - 1 - y);
      const isCorner = (rx < 4 && ry < 4 && Math.hypot(4 - rx, 4 - ry) > 4.5);

      if (isCorner) {
        // Transparent
        buffer.writeUInt8(0, offset);
        buffer.writeUInt8(0, offset + 1);
        buffer.writeUInt8(0, offset + 2);
        buffer.writeUInt8(0, offset + 3); // Alpha 0
      } else {
        // Check if inside center dot
        const distFromCenter = Math.hypot(x - 15.5, y - 15.5);
        // Check if on sine wave: y = 16 + sin((x - 6) * 0.35) * 4.5
        const waveY = 15.5 + Math.sin((x - 4) * 0.32) * 4.0;
        const distFromWave = Math.abs(y - waveY);

        if (distFromCenter <= 2.2) {
          // Center glowing node
          buffer.writeUInt8(239, offset); // B
          buffer.writeUInt8(243, offset + 1); // G
          buffer.writeUInt8(241, offset + 2); // R
          buffer.writeUInt8(255, offset + 3); // A
        } else if (distFromWave <= 1.4 && x >= 5 && x <= 26) {
          // Sage wave
          buffer.writeUInt8(169, offset); // B
          buffer.writeUInt8(175, offset + 1); // G
          buffer.writeUInt8(145, offset + 2); // R
          buffer.writeUInt8(255, offset + 3); // A
        } else {
          // Deep moss background
          buffer.writeUInt8(37, offset); // B
          buffer.writeUInt8(43, offset + 1); // G
          buffer.writeUInt8(28, offset + 2); // R
          buffer.writeUInt8(255, offset + 3); // A
        }
      }
      offset += 4;
    }
  }

  // AND mask (all 0 for 32-bit with alpha)
  for (let i = 0; i < maskSize; i++) {
    buffer.writeUInt8(0, offset + i);
  }

  return buffer;
}

const icoBuf = createStillwaveIco();
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), icoBuf);
console.log('✓ Successfully created Stillwave public/favicon.ico!');
