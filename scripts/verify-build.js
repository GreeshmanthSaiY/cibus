/**
 * CIBUS Production Build & Static Architecture Verification
 * Validates file integrity, route destinations, JSON datasets, branding assets, and Vercel configuration.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    errors++;
  } else {
    console.log(`  ✓ [PASS] ${message}`);
  }
}

console.log('====================================================');
console.log('🏛️  CIBUS PRODUCTION DEPLOYMENT & ARCHITECTURE AUDIT');
console.log('====================================================\n');

// 1. Root & Static Entry Points
console.log('1. Validating Core Entry Points & 404 Pages...');
assert(fs.existsSync(path.join(rootDir, 'index.html')), 'Root index.html exists');
assert(fs.existsSync(path.join(rootDir, '404.html')), 'Root 404.html exists for Vercel fallback');
assert(fs.existsSync(path.join(rootDir, 'pages', '404.html')), 'Pages 404.html exists');

// 2. All Defined Pages
console.log('\n2. Validating Page Routes...');
const requiredPages = [
  'pages/home.html',
  'pages/food-menu.html',
  'pages/recipe-cards.html',
  'pages/recipe-detail.html',
  'pages/cart.html',
  'pages/login.html',
  'pages/register.html',
  'pages/contact.html'
];
requiredPages.forEach(p => {
  const full = path.join(rootDir, p);
  assert(fs.existsSync(full) && fs.statSync(full).size > 100, `Page "${p}" exists and is non-empty`);
});

// 3. JSON Data Integrity
console.log('\n3. Validating JSON Datasets...');
const dataFiles = [
  'data/food-items.json',
  'data/recipes.json',
  'data/states.json'
];
dataFiles.forEach(df => {
  const full = path.join(rootDir, df);
  assert(fs.existsSync(full), `Dataset "${df}" exists`);
  try {
    const raw = fs.readFileSync(full, 'utf8');
    const parsed = JSON.parse(raw);
    assert(Array.isArray(parsed) && parsed.length > 0, `Dataset "${df}" is valid JSON array with ${parsed.length} items`);
  } catch (err) {
    assert(false, `Dataset "${df}" JSON parsing failed: ${err.message}`);
  }
});

// 4. Official Branding & Favicon System
console.log('\n4. Validating Official CIBUS Branding & Favicons...');
const brandingAssets = [
  'public/assets/images/cibus-logo.png',
  'public/assets/images/cibus-logo-header.png',
  'public/assets/images/favicon-16x16.png',
  'public/assets/images/favicon-32x32.png',
  'public/assets/images/favicon-48x48.png',
  'public/assets/images/apple-touch-icon.png',
  'public/assets/images/android-chrome-192x192.png',
  'public/assets/images/android-chrome-512x512.png',
  'public/favicon.ico',
  'favicon.ico',
  'public/favicon.svg',
  'favicon.svg',
  'public/site.webmanifest',
  'site.webmanifest'
];
brandingAssets.forEach(ba => {
  assert(fs.existsSync(path.join(rootDir, ba)), `Branding asset "${ba}" exists`);
});

// 5. Vercel Configuration Verification
console.log('\n5. Validating Vercel Deployment Configuration...');
const vercelPath = path.join(rootDir, 'vercel.json');
assert(fs.existsSync(vercelPath), 'vercel.json exists');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  assert(vercelConfig.outputDirectory === '.', 'vercel.json explicitly configures "outputDirectory": "."');
  assert(vercelConfig.cleanUrls === true, 'vercel.json enables cleanUrls');
  assert(Array.isArray(vercelConfig.rewrites) && vercelConfig.rewrites.length >= 8, 'vercel.json defines essential rewrites');
  assert(Array.isArray(vercelConfig.headers) && vercelConfig.headers.length >= 1, 'vercel.json defines security & caching headers');
} catch (err) {
  assert(false, `vercel.json parsing failed: ${err.message}`);
}

console.log('\n====================================================');
if (errors === 0) {
  console.log('✨ [SUCCESS] All CIBUS static production assets & configs verified!');
  console.log('   Ready for seamless Vercel deployment with 0 missing files.');
  console.log('====================================================\n');
  process.exit(0);
} else {
  console.error(`💥 [ERROR] Verification failed with ${errors} error(s)!`);
  console.log('====================================================\n');
  process.exit(1);
}
