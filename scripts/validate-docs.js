/**
 * CIBUS Documentation & Screenshot Integrity Validator
 * Audits all markdown image references across README.md and docs/
 * Ensures zero broken image paths, non-empty files (>10KB), and intact directory structures.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const REQUIRED_DIRS = [
  'docs/screenshots/desktop',
  'docs/screenshots/tablet',
  'docs/screenshots/mobile',
  'docs/screenshots/responsive'
];

function findMarkdownFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        files = files.concat(findMarkdownFiles(full));
      }
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function extractImageReferences(content, filePath) {
  const images = [];

  // Match markdown image syntax: ![alt](url)
  const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdImgRegex.exec(content)) !== null) {
    const rawUrl = match[2].trim();
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      images.push({ url: rawUrl, line: content.substring(0, match.index).split('\n').length, file: filePath });
    }
  }

  // Match HTML img syntax: <img src="url" ... />
  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((match = htmlImgRegex.exec(content)) !== null) {
    const rawUrl = match[1].trim();
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      images.push({ url: rawUrl, line: content.substring(0, match.index).split('\n').length, file: filePath });
    }
  }

  return images;
}

function validate() {
  console.log('🔍 Running CIBUS Documentation & Asset Integrity Audit...\n');
  let errors = 0;
  let totalChecked = 0;

  // 1. Verify required directories
  console.log('1. Checking required screenshot directories...');
  for (const dir of REQUIRED_DIRS) {
    const full = path.join(PROJECT_ROOT, dir);
    if (!fs.existsSync(full)) {
      console.error(`  ❌ Missing required directory: ${dir}`);
      errors++;
    } else {
      console.log(`  ✓ Directory verified: ${dir}`);
    }
  }

  // 2. Discover markdown files
  console.log('\n2. Scanning Markdown files for image references...');
  const mdFiles = [path.join(PROJECT_ROOT, 'README.md')];
  const docsDir = path.join(PROJECT_ROOT, 'docs');
  if (fs.existsSync(docsDir)) {
    mdFiles.push(...findMarkdownFiles(docsDir));
  }

  console.log(`  Found ${mdFiles.length} Markdown files to audit.`);

  const seenImages = new Set();

  for (const mdPath of mdFiles) {
    const relMd = path.relative(PROJECT_ROOT, mdPath).replace(/\\/g, '/');
    const content = fs.readFileSync(mdPath, 'utf8');
    const refs = extractImageReferences(content, mdPath);

    if (refs.length > 0) {
      console.log(`\n  Auditing ${relMd} (${refs.length} references)...`);
    }

    for (const ref of refs) {
      totalChecked++;
      // Clean query strings or anchors
      const cleanUrl = ref.url.split('?')[0].split('#')[0];
      const targetPath = path.resolve(path.dirname(ref.file), cleanUrl);
      const relTarget = path.relative(PROJECT_ROOT, targetPath).replace(/\\/g, '/');

      seenImages.add(targetPath);

      if (!fs.existsSync(targetPath)) {
        console.error(`  ❌ Broken image path at line ${ref.line}: "${ref.url}" -> ${relTarget} does not exist`);
        errors++;
      } else {
        const stats = fs.statSync(targetPath);
        const szKb = Math.round(stats.size / 1024);
        if (stats.size < 10240) { // < 10KB
          console.error(`  ⚠️ Warning: Image file suspiciously small (${szKb} KB < 10KB): ${relTarget}`);
          errors++;
        }
      }
    }
  }

  console.log(`\n📊 Documentation Audit Summary:`);
  console.log(`  - Total image references audited: ${totalChecked}`);
  console.log(`  - Unique image files verified: ${seenImages.size}`);
  console.log(`  - Total errors / warnings: ${errors}`);

  if (errors > 0) {
    console.error('\n❌ Documentation validation failed with ' + errors + ' issue(s).');
    process.exit(1);
  } else {
    console.log('\n✅ All documentation image paths, screenshot assets, and directories are verified!');
    process.exit(0);
  }
}

validate();
