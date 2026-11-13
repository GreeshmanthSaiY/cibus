/**
 * CIBUS Automated Genuine Browser Screenshot Capture
 * Uses Google Chrome headless to capture high-DPI desktop, tablet, and mobile screenshots
 */

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const tasks = [
  // 1. Desktop captures (1440x900)
  {
    name: 'desktop/welcome.png',
    file: 'index.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/welcome.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/homepage.png',
    file: 'pages/home.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/homepage.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/food-menu.png',
    file: 'pages/food-menu.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/food-menu.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/recipe-cards.png',
    file: 'pages/recipe-cards.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/recipe-cards.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/recipe-detail.png',
    file: 'pages/recipe-detail.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/recipe-detail.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/shopping-cart.png',
    file: 'pages/cart.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/shopping-cart.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/notifications.png',
    file: 'pages/home.html?openNotif=true',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/notifications.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/contact.png',
    file: 'pages/contact.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/contact.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/login.png',
    file: 'pages/login.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/login.png'),
    size: '1440,900'
  },
  {
    name: 'desktop/register.png',
    file: 'pages/register.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/desktop/register.png'),
    size: '1440,900'
  },

  // 2. Tablet captures (768x1024)
  {
    name: 'tablet/welcome-tablet.png',
    file: 'index.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/welcome-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/homepage-tablet.png',
    file: 'pages/home.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/homepage-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/food-menu-tablet.png',
    file: 'pages/food-menu.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/food-menu-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/recipe-cards-tablet.png',
    file: 'pages/recipe-cards.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/recipe-cards-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/recipe-detail-tablet.png',
    file: 'pages/recipe-detail.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/recipe-detail-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/cart-tablet.png',
    file: 'pages/cart.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/cart-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/notifications-tablet.png',
    file: 'pages/home.html?openNotif=true',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/notifications-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/contact-tablet.png',
    file: 'pages/contact.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/contact-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/login-tablet.png',
    file: 'pages/login.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/login-tablet.png'),
    size: '768,1024'
  },
  {
    name: 'tablet/register-tablet.png',
    file: 'pages/register.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/tablet/register-tablet.png'),
    size: '768,1024'
  },

  // 3. Mobile captures (390x844)
  {
    name: 'mobile/welcome-mobile.png',
    file: 'index.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/welcome-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/homepage-mobile.png',
    file: 'pages/home.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/homepage-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/food-menu-mobile.png',
    file: 'pages/food-menu.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/food-menu-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/recipe-cards-mobile.png',
    file: 'pages/recipe-cards.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/recipe-cards-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/recipe-detail-mobile.png',
    file: 'pages/recipe-detail.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/recipe-detail-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/cart-mobile.png',
    file: 'pages/cart.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/cart-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/notifications-mobile.png',
    file: 'pages/home.html?openNotif=true',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/notifications-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/contact-mobile.png',
    file: 'pages/contact.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/contact-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/login-mobile.png',
    file: 'pages/login.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/login-mobile.png'),
    size: '390,844'
  },
  {
    name: 'mobile/register-mobile.png',
    file: 'pages/register.html',
    out: path.join(PROJECT_ROOT, 'docs/screenshots/mobile/register-mobile.png'),
    size: '390,844'
  }
];

fs.mkdirSync(path.join(PROJECT_ROOT, 'docs/screenshots/desktop'), { recursive: true });
fs.mkdirSync(path.join(PROJECT_ROOT, 'docs/screenshots/tablet'), { recursive: true });
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
console.log('\n🎉 Finished capturing all genuine desktop, tablet, and mobile screenshots!');
