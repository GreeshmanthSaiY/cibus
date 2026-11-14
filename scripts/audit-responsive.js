const path = require('path');
const { CdpClient } = require('./cdp-runner');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const VIEWPORTS = [
  { name: '320x700', w: 320, h: 700, mobile: true },
  { name: '360x800', w: 360, h: 800, mobile: true },
  { name: '375x812', w: 375, h: 812, mobile: true },
  { name: '390x844', w: 390, h: 844, mobile: true },
  { name: '414x896', w: 414, h: 896, mobile: true },
  { name: '430x932', w: 430, h: 932, mobile: true },
  { name: '768x1024', w: 768, h: 1024, mobile: true },
  { name: '1440x900', w: 1440, h: 900, mobile: false }
];

const PAGES = [
  'index.html',
  'pages/home.html',
  'pages/food-menu.html',
  'pages/recipe-cards.html',
  'pages/recipe-detail.html',
  'pages/cart.html',
  'pages/contact.html',
  'pages/login.html',
  'pages/register.html',
  'pages/404.html'
];

async function main() {
  const client = new CdpClient(9444);
  await client.start();

  console.log('📱 Running 80-point Responsive Layout & Horizontal Overflow Audit...\n');

  let passed = 0;
  let failed = 0;

  for (const page of PAGES) {
    const fileUrl = 'file:///' + path.join(PROJECT_ROOT, page).replace(/\\/g, '/');
    process.stdout.write(`Auditing ${page.padEnd(25)}... `);
    let pageOverflow = 0;

    for (const vp of VIEWPORTS) {
      await client.setDeviceMetrics(vp.w, vp.h, 1, vp.mobile);
      await client.navigate(fileUrl);
      await new Promise(r => setTimeout(r, 100));

      const result = await client.evaluate(`(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const overflow = docW - winW;
        return { docW, winW, overflow };
      })()`);

      if (result && result.overflow > 0) {
        console.error(`\n  ❌ [OVERFLOW @ ${vp.name}]: docW ${result.docW}px > winW ${result.winW}px (+${result.overflow}px)`);
        failed++;
        pageOverflow++;
      } else {
        passed++;
      }
    }
    if (pageOverflow === 0) {
      console.log('✓ All 8 viewports OK (0 overflow)');
    }
  }

  await client.close();

  console.log(`\n========================================`);
  console.log(`Audited ${passed + failed} responsive conditions across 10 pages & 8 viewports.`);
  if (failed === 0) {
    console.log(`✅ ALL RESPONSIVE VIEWPORT CHECKS PASSED: 0 horizontal overflow anywhere (${passed}/${passed})`);
  } else {
    console.error(`❌ FOUND ${failed} RESPONSIVE DEFECTS.`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
