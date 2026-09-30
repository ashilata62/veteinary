import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const RES_DIR = 'android/app/src/main/res';
const LOGO_SRC = 'public/kt-logo.png';

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 1. Generate Splash Screen
async function generateSplash(width, height, outputPath) {
  ensureDir(path.dirname(outputPath));

  const isPortrait = height >= width;
  
  let logoWidth;
  let titleScale = 1;
  
  if (isPortrait) {
    logoWidth = Math.min(Math.round(width * 0.65), 700);
    titleScale = Math.min(width / 1080, 1.2);
  } else {
    // Landscape
    logoWidth = Math.min(Math.round(height * 0.5), 550);
    titleScale = Math.min(height / 1080, 1.0);
  }

  const resizedLogo = await sharp(LOGO_SRC)
    .resize({ width: logoWidth, fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(resizedLogo).metadata();

  // Dynamic typography sizing based on scale
  const brandFontSize = Math.max(Math.round(52 * titleScale), 22);
  const subFontSize = Math.max(Math.round(20 * titleScale), 10);
  const letterSpacingBrand = Math.max(Math.round(3 * titleScale), 1);
  const letterSpacingSub = Math.max(Math.round(5 * titleScale), 2);
  const svgHeight = Math.max(Math.round(200 * titleScale), 90);

  const titleSvg = Buffer.from(`
    <svg width="${width}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .brand { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${brandFontSize}px; font-weight: 800; fill: #ffffff; letter-spacing: ${letterSpacingBrand}px; }
        .highlight { fill: #14b8a6; }
        .subtitle { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: ${subFontSize}px; font-weight: 600; fill: #94a3b8; letter-spacing: ${letterSpacingSub}px; }
      </style>
      <text x="50%" y="${Math.round(brandFontSize * 1.3)}" text-anchor="middle" class="brand">PetCare <tspan class="highlight">Pro</tspan></text>
      <text x="50%" y="${Math.round(brandFontSize * 1.3 + subFontSize * 2.2)}" text-anchor="middle" class="subtitle">VETERINARY CLINIC MANAGEMENT</text>
    </svg>
  `);

  const gap = Math.round(25 * titleScale);
  const totalContentHeight = logoMeta.height + gap + svgHeight;
  const startY = Math.max(Math.round((height - totalContentHeight) / 2), 10);
  const logoTop = startY;
  const textTop = startY + logoMeta.height + gap;

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
  .composite([
    {
      input: resizedLogo,
      top: logoTop,
      left: Math.round((width - logoMeta.width) / 2)
    },
    {
      input: titleSvg,
      top: textTop,
      left: 0
    }
  ])
  .png()
  .toFile(outputPath);

  console.log(`Generated Splash: ${width}x${height} -> ${outputPath}`);
}

// 2. Generate Square Icon
async function generateSquareIcon(size, outputPath) {
  ensureDir(path.dirname(outputPath));

  const logoSize = Math.round(size * 0.75);
  const resizedLogo = await sharp(LOGO_SRC)
    .resize({ width: logoSize, height: logoSize, fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(resizedLogo).metadata();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
  .composite([
    {
      input: resizedLogo,
      top: Math.round((size - logoMeta.height) / 2),
      left: Math.round((size - logoMeta.width) / 2)
    }
  ])
  .png()
  .toFile(outputPath);

  console.log(`Generated Icon: ${size}x${size} -> ${outputPath}`);
}

// 3. Generate Round Icon (clipped with circle)
async function generateRoundIcon(size, outputPath) {
  ensureDir(path.dirname(outputPath));

  const logoSize = Math.round(size * 0.70);
  const resizedLogo = await sharp(LOGO_SRC)
    .resize({ width: logoSize, height: logoSize, fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(resizedLogo).metadata();

  const squareBmp = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    }
  })
  .composite([
    {
      input: resizedLogo,
      top: Math.round((size - logoMeta.height) / 2),
      left: Math.round((size - logoMeta.width) / 2)
    }
  ])
  .png()
  .toBuffer();

  // Circular mask
  const radius = size / 2;
  const circleMask = Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="#ffffff" />
    </svg>
  `);

  await sharp(squareBmp)
    .composite([
      {
        input: circleMask,
        blend: 'dest-in'
      }
    ])
    .png()
    .toFile(outputPath);

  console.log(`Generated Round Icon: ${size}x${size} -> ${outputPath}`);
}

// 4. Generate Adaptive Foreground Icon (Transparent background with logo in safe zone)
async function generateForegroundIcon(size, outputPath) {
  ensureDir(path.dirname(outputPath));

  // Android adaptive safe zone is center 66% (or ~60% for safety)
  const safeZone = Math.round(size * 0.58);
  const resizedLogo = await sharp(LOGO_SRC)
    .resize({ width: safeZone, height: safeZone, fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(resizedLogo).metadata();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 } // transparent
    }
  })
  .composite([
    {
      input: resizedLogo,
      top: Math.round((size - logoMeta.height) / 2),
      left: Math.round((size - logoMeta.width) / 2)
    }
  ])
  .png()
  .toFile(outputPath);

  console.log(`Generated Foreground Icon: ${size}x${size} -> ${outputPath}`);
}

async function run() {
  console.log('--- Generating Splash Screens ---');
  // Fallback
  await generateSplash(480, 800, `${RES_DIR}/drawable/splash.png`);
  
  // Portrait
  await generateSplash(320, 480, `${RES_DIR}/drawable-port-mdpi/splash.png`);
  await generateSplash(480, 800, `${RES_DIR}/drawable-port-hdpi/splash.png`);
  await generateSplash(720, 1280, `${RES_DIR}/drawable-port-xhdpi/splash.png`);
  await generateSplash(960, 1600, `${RES_DIR}/drawable-port-xxhdpi/splash.png`);
  await generateSplash(1280, 1920, `${RES_DIR}/drawable-port-xxxhdpi/splash.png`);

  // Landscape
  await generateSplash(480, 320, `${RES_DIR}/drawable-land-mdpi/splash.png`);
  await generateSplash(800, 480, `${RES_DIR}/drawable-land-hdpi/splash.png`);
  await generateSplash(1280, 720, `${RES_DIR}/drawable-land-xhdpi/splash.png`);
  await generateSplash(1600, 960, `${RES_DIR}/drawable-land-xxhdpi/splash.png`);
  await generateSplash(1920, 1280, `${RES_DIR}/drawable-land-xxxhdpi/splash.png`);

  console.log('\n--- Generating Mipmap Icons ---');
  const iconSizes = [
    { dir: 'mipmap-mdpi', icon: 48, fg: 108 },
    { dir: 'mipmap-hdpi', icon: 72, fg: 162 },
    { dir: 'mipmap-xhdpi', icon: 96, fg: 216 },
    { dir: 'mipmap-xxhdpi', icon: 144, fg: 324 },
    { dir: 'mipmap-xxxhdpi', icon: 192, fg: 432 }
  ];

  for (const { dir, icon, fg } of iconSizes) {
    await generateSquareIcon(icon, `${RES_DIR}/${dir}/ic_launcher.png`);
    await generateRoundIcon(icon, `${RES_DIR}/${dir}/ic_launcher_round.png`);
    await generateForegroundIcon(fg, `${RES_DIR}/${dir}/ic_launcher_foreground.png`);
  }

  console.log('\n--- Updating PWA Icons & Favicon ---');
  await generateSquareIcon(512, 'public/pwa-512.png');
  await generateSquareIcon(192, 'public/pwa-192.png');
  await generateSquareIcon(64, 'public/favicon.ico');

  // Also sync to ../public if it exists
  if (fs.existsSync('../public')) {
    await generateSquareIcon(512, '../public/pwa-512.png');
    await generateSquareIcon(192, '../public/pwa-192.png');
    await generateSquareIcon(64, '../public/favicon.ico');
  }

  console.log('\nAll assets generated successfully!');
}

run().catch(console.error);
