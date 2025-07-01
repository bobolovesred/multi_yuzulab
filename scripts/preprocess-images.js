const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGE_DIRS = [
  'public/images/masterclasses',
  'public/images/photostudio', 
  'public/images/flowers/flowers_cards',
  'public/images/flowers/categories',
  'public/images/photobook'
];

async function processImage(inputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const baseName = inputPath.replace(ext, '');
    
    // Создаем WebP версию
    await sharp(inputPath)
      .webp({ 
        quality: 80, 
        effort: 6,
        nearLossless: false 
      })
      .toFile(`${baseName}.webp`);
    
    console.log(`✅ Created WebP: ${baseName}.webp`);
    
    // Оптимизируем оригинал
    if (ext === '.png') {
      await sharp(inputPath)
        .png({ 
          quality: 90, 
          compressionLevel: 9,
          adaptiveFiltering: true 
        })
        .toFile(`${inputPath}.optimized`);
      
      await fs.rename(`${inputPath}.optimized`, inputPath);
    } else if ([ '.jpg', '.jpeg' ].includes(ext)) {
      await sharp(inputPath)
        .jpeg({ 
          quality: 85, 
          mozjpeg: true,
          progressive: true 
        })
        .toFile(`${inputPath}.optimized`);
      
      await fs.rename(`${inputPath}.optimized`, inputPath);
    }
    
    console.log(`✅ Optimized: ${inputPath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        await processDirectory(fullPath);
      } else if (/\.(png|jpe?g)$/i.test(file) && !file.includes('.webp')) {
        await processImage(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...');
  
  for (const dir of IMAGE_DIRS) {
    console.log(`📂 Processing ${dir}...`);
    try {
      await fs.access(dir);
      await processDirectory(dir);
    } catch (error) {
      console.log(`⚠️  Directory ${dir} not found, skipping...`);
    }
  }
  
  console.log('🎉 Image optimization complete!');
}

main().catch(console.error); 