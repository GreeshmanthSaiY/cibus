/**
 * CIBUS Automated Genuine Browser Screenshot Capture
 * Uses Google Chrome headless to capture high-DPI desktop and mobile screenshots
 */

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const tasks = [
  // Desktop captures (1440x900)
  {
    name: 'welcome.png',
    file: 'index.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/welcome.png'),
    size: '1440,900'
  },
  {
    name: 'homepage.png',
    file: 'pages/home.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/homepage.png'),
    size: '1440,900'
  },
  {
    name: 'food-menu.png',
    file: 'pages/food-menu.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/food-menu.png'),
    size: '1440,900'
  },
  {
    name: 'recipe-cards.png',
    file: 'pages/recipe-cards.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/recipe-cards.png'),
    size: '1440,900'
  },
  {
    name: 'recipe-detail.png',
    file: 'pages/recipe-detail.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/recipe-detail.png'),
    size: '1440,900'
  },
  {
    name: 'shopping-cart.png',
    file: 'pages/cart.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/shopping-cart.png'),
    size: '1440,900'
  },
  {
    name: 'notifications.png',
    file: 'pages/home.html?openNotif=true',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/notifications.png'),
    size: '1440,900'
  },
  {
    name: 'contact.png',
    file: 'pages/contact.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/contact.png'),
    size: '1440,900'
  },
  {
    name: 'login.png',
    file: 'pages/login.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/login.png'),
    size: '1440,900'
  },
  {
    name: 'register.png',
    file: 'pages/register.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/register.png'),
    size: '1440,900'
  },

  // Mobile captures (390x844)
  {
    name: 'homepage-mobile.png',
    file: 'pages/home.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/homepage-mobile.png'),
    size: '390,844'
  },
  {
    name: 'food-menu-mobile.png',
    file: 'pages/food-menu.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/food-menu-mobile.png'),
    size: '390,844'
  },
  {
    name: 'recipe-detail-mobile.png',
    file: 'pages/recipe-detail.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/recipe-detail-mobile.png'),
    size: '390,844'
  },
  {
    name: 'cart-mobile.png',
    file: 'pages/cart.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/cart-mobile.png'),
    size: '390,844'
  }
];

fs.mkdirSync(path.join(PROJECT_ROOT, 'docs/screenshots/desktop'), { recursive: true });
fs.mkdirSync(path.join(PROJECT_ROOT, 'docs/screenshots/mobile'), { recursive: true });

for (const task of tasks) {
  const fileUrl = 'file:///' + path.join(PROJECT_ROOT, task.file).replace(/\\/g, '/');
  try {
    process.stdout.write(`📸 Capturing ${task.name}... `);
    execFileSync(CHROME_PATH, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--hide-scrollbars',
      `--window-size=${task.size}`,
      `--screenshot=${task.out}`,
      fileUrl
    ]);
    const sz = fs.statSync(task.out).size;
    console.log(`✓ OK (${Math.round(sz / 1024)} KB)`);
  } catch (err) {
    console.log(`X Error: ${err.message}`);
  }
}
console.log('\n🎉 Finished capturing all genuine screenshots!');
