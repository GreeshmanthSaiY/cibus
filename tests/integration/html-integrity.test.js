const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../');

const htmlFiles = [
  path.join(projectRoot, 'index.html'),
  path.join(projectRoot, '404.html'),
  path.join(projectRoot, 'pages/home.html'),
  path.join(projectRoot, 'pages/food-menu.html'),
  path.join(projectRoot, 'pages/recipe-cards.html'),
  path.join(projectRoot, 'pages/recipe-detail.html'),
  path.join(projectRoot, 'pages/cart.html'),
  path.join(projectRoot, 'pages/login.html'),
  path.join(projectRoot, 'pages/register.html'),
  path.join(projectRoot, 'pages/contact.html'),
  path.join(projectRoot, 'pages/404.html')
];

let totalErrors = 0;

console.log('🔍 Starting CIBUS HTML & Asset Integrity Audit...\n');

htmlFiles.forEach((filePath) => {
  const relName = path.relative(projectRoot, filePath);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${relName}`);
    totalErrors++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fileDir = path.dirname(filePath);

  console.log(`📄 Auditing: ${relName}`);

  // 1. DOCTYPE and title check
  if (!content.includes('<!DOCTYPE html>')) {
    console.error(`  ❌ Missing <!DOCTYPE html>`);
    totalErrors++;
  }
  if (!/<title>[\s\S]+<\/title>/.test(content)) {
    console.error(`  ❌ Missing or empty <title> tag`);
    totalErrors++;
  }

  // 2. Disallow localhost / 127.0.0.1
  if (content.includes('127.0.0.1') || content.includes('localhost:5500')) {
    console.error(`  ❌ Hardcoded localhost address found!`);
    totalErrors++;
  }

  // 3. Check for stylesheet links
  const cssMatches = content.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi);
  for (const m of cssMatches) {
    const href = m[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      continue;
    }
    const resolvedPath = href.startsWith('/')
      ? path.join(projectRoot, href.slice(1))
      : path.resolve(fileDir, href);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ Broken stylesheet link: "${href}" (resolved: ${resolvedPath})`);
      totalErrors++;
    }
  }

  // 4. Check for local script references
  const scriptMatches = content.matchAll(/<script[^>]+src=["']([^"']+)["']/gi);
  for (const m of scriptMatches) {
    const src = m[1];
    if (
      src.startsWith('http://') ||
      src.startsWith('https://') ||
      src.startsWith('//') ||
      src.startsWith('/_vercel/')
    ) {
      continue;
    }
    const resolvedPath = src.startsWith('/')
      ? path.join(projectRoot, src.slice(1))
      : path.resolve(fileDir, src);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ Broken script src: "${src}" (resolved: ${resolvedPath})`);
      totalErrors++;
    }
  }

  // 5. Check for icon & manifest links
  const linkMatches = content.matchAll(/<link[^>]+(?:rel=["'](?:icon|alternate icon|apple-touch-icon|manifest)["'])[^>]+href=["']([^"']+)["']/gi);
  for (const m of linkMatches) {
    const href = m[1];
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('data:')) {
      continue;
    }
    const resolvedPath = href.startsWith('/')
      ? path.join(projectRoot, href.slice(1))
      : path.resolve(fileDir, href);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ Broken icon/manifest link: "${href}" (resolved: ${resolvedPath})`);
      totalErrors++;
    }
  }

  // 6. Check for local image references
  const imgMatches = content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  for (const m of imgMatches) {
    const src = m[1];
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//') || src.startsWith('data:')) {
      continue;
    }
    const resolvedPath = src.startsWith('/')
      ? path.join(projectRoot, src.slice(1))
      : path.resolve(fileDir, src);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ Broken image src: "${src}" (resolved: ${resolvedPath})`);
      totalErrors++;
    }
  }

  // 5. Check for local page hyperlinks
  const hrefMatches = content.matchAll(/<a[^>]+href=["']([^"']+)["']/gi);
  for (const m of hrefMatches) {
    const href = m[1];
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      href === ''
    ) {
      continue;
    }
    // Remove query params or hash
    const cleanHref = href.split('?')[0].split('#')[0];
    if (!cleanHref) continue;

    const resolvedPath = cleanHref === '/'
      ? path.join(projectRoot, 'index.html')
      : cleanHref.startsWith('/')
        ? path.join(projectRoot, cleanHref.slice(1))
        : path.resolve(fileDir, cleanHref);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`  ❌ Broken anchor link: "${href}" (resolved: ${resolvedPath})`);
      totalErrors++;
    }
  }

  // 6. Check for duplicate IDs
  const idMatches = [...content.matchAll(/\sid=["']([^"']+)["']/gi)];
  const seenIds = new Set();
  idMatches.forEach((m) => {
    const id = m[1];
    if (seenIds.has(id)) {
      console.error(`  ❌ Duplicate element ID: "${id}"`);
      totalErrors++;
    }
    seenIds.add(id);
  });
});

console.log('\n========================================');
if (totalErrors === 0) {
  console.log('✅ ALL HTML INTEGRITY CHECKS PASSED (0 ERRORS)');
  process.exit(0);
} else {
  console.error(`❌ HTML INTEGRITY FAILED: ${totalErrors} issue(s) detected.`);
  process.exit(1);
}
