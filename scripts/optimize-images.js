const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIRS = [
  'public/images/masterclasses',
  'public/images/photostudio',
  'public/images/flowers/flowers_cards',
  'public/images/flowers/categories',
];

const exts = ['.png', '.jpg', '.jpeg'];

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const base = filePath.slice(0, -ext.length);
  const webpPath = base + '.webp';
  const blurPath = base + '_blur.jpg';

  // WebP
  await sharp(filePath)
    .webp({ quality: 80 })
    .toFile(webpPath);

  // Blur-up preview (very small JPEG)
  await sharp(filePath)
    .resize(32)
    .jpeg({ quality: 40 })
    .toFile(blurPath);

  // Lossless compression (overwrite original)
  if (ext === '.png') {
    await sharp(filePath)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(filePath + '.tmp');
    fs.renameSync(filePath + '.tmp', filePath);
  } else if (ext === '.jpg' || ext === '.jpeg') {
    await sharp(filePath)
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(filePath + '.tmp');
    fs.renameSync(filePath + '.tmp', filePath);
  }
}

async function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      await walk(full);
    } else if (exts.includes(path.extname(full).toLowerCase())) {
      console.log('Optimizing', full);
      await optimizeImage(full);
    }
  }
}

(async () => {
  for (const dir of IMAGE_DIRS) {
    if (fs.existsSync(dir)) {
      await walk(dir);
    }
  }
  console.log('All images optimized and WebP/blur-up generated!');
})(); 