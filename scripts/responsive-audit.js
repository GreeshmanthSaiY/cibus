const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { name: 'Mobile 320x568 (iPhone SE)', width: 320, height: 568 },
  { name: 'Mobile 360x800 (Android)', width: 360, height: 800 },
  { name: 'Mobile 390x844 (iPhone 14)', width: 390, height: 844 },
  { name: 'Tablet 768x1024 (iPad)', width: 768, height: 1024 },
  { name: 'Desktop 1440x900 (Mac/Laptop)', width: 1440, height: 900 }
];

const PAGES = [
  'index.html',
  'pages/home.html',
  'pages/food-menu.html',
  'pages/recipe-cards.html',
  'pages/recipe-detail.html',
  'pages/cart.html',
  'pages/login.html',
  'pages/register.html',
  'pages/contact.html',
  '404.html'
];

async function runAudit() {
  console.log('====================================================');
  console.log('📱 CIBUS COMPREHENSIVE RESPONSIVE & LAYOUT AUDIT');
  console.log('====================================================\n');

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu',
    '--allow-file-access-from-files'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const versionData = await versionRes.json();
  const wsUrl = versionData.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let messageId = 0;
  function sendCommand(method, params = {}, sessionId = undefined) {
    return new Promise((resolve, reject) => {
      const id = ++messageId;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }

  // Create a new target page
  const newTarget = await sendCommand('Target.createTarget', { url: 'about:blank' });
  const pageSession = await sendCommand('Target.attachToTarget', { targetId: newTarget.targetId, flatten: true });
  const sessionId = pageSession.sessionId;

  function sendPageCommand(method, params = {}) {
    return sendCommand(method, params, sessionId);
  }

  await sendPageCommand('Page.enable');
  await sendPageCommand('DOM.enable');

  const auditResults = [];

  for (const pagePath of PAGES) {
    console.log(`\n📄 Auditing Page: ${pagePath}`);
    const fileUrl = 'file:///' + path.join(PROJECT_ROOT, pagePath).replace(/\\/g, '/');

    for (const vp of VIEWPORTS) {
      await sendPageCommand('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width < 992
      });

      await sendPageCommand('Page.navigate', { url: fileUrl });
      await new Promise(r => setTimeout(r, 600));

      // Evaluate layout metrics
      const evalRes = await sendPageCommand('Runtime.evaluate', {
        expression: `
          (() => {
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
            const overflowAmount = Math.max(0, scrollWidth - docWidth, bodyScrollWidth - docWidth);

            // Find overflowing elements
            const overflowingElements = [];
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > docWidth + 2) {
                const tag = el.tagName.toLowerCase();
                const cls = el.className ? '.' + String(el.className).trim().split(/\\s+/).join('.') : '';
                const id = el.id ? '#' + el.id : '';
                const desc = tag + id + cls;
                if (!overflowingElements.some(e => e.desc === desc)) {
                  overflowingElements.push({
                    desc: desc.slice(0, 50),
                    right: Math.round(rect.right),
                    overflowBy: Math.round(rect.right - docWidth)
                  });
                }
              }
            }

            // Check broken images
            const images = Array.from(document.querySelectorAll('img')).map(img => {
              const src = img.getAttribute('src') || '';
              const naturalWidth = img.naturalWidth;
              const naturalHeight = img.naturalHeight;
              const rect = img.getBoundingClientRect();
              return {
                src: src.slice(0, 40),
                naturalWidth,
                naturalHeight,
                renderedWidth: Math.round(rect.width),
                renderedHeight: Math.round(rect.height),
                isBroken: naturalWidth === 0 && !src.startsWith('data:')
              };
            });

            // Check header layout
            const siteNav = document.querySelector('.site-nav');
            const siteNavRect = siteNav ? siteNav.getBoundingClientRect() : null;
            const mobileToggle = document.querySelector('.mobile-nav-toggle');
            const mobileToggleVisible = mobileToggle ? window.getComputedStyle(mobileToggle).display !== 'none' : false;
            const navLinks = document.querySelector('.nav-links');
            const navLinksVisible = navLinks ? window.getComputedStyle(navLinks).display !== 'none' : false;
            const authContainer = document.getElementById('nav-auth-container');
            const authContainerVisible = authContainer ? window.getComputedStyle(authContainer).display !== 'none' : false;

            return {
              docWidth,
              scrollWidth,
              overflowAmount,
              overflowingElements: overflowingElements.slice(0, 6),
              brokenImages: images.filter(i => i.isBroken),
              mobileToggleVisible,
              navLinksVisible,
              authContainerVisible,
              siteNavRight: siteNavRect ? Math.round(siteNavRect.right) : null
            };
          })()
        `,
        returnByValue: true
      });

      if (evalRes.exceptionDetails) {
        console.error('JS Evaluation Exception:', evalRes.exceptionDetails);
      }

      const metrics = evalRes.result && evalRes.result.value ? evalRes.result.value : (evalRes.value || {
        docWidth: vp.width,
        scrollWidth: vp.width,
        overflowAmount: 0,
        overflowingElements: [],
        brokenImages: [],
        mobileToggleVisible: false,
        navLinksVisible: false,
        authContainerVisible: false,
        siteNavRight: null
      });
      const statusIcon = metrics.overflowAmount > 0 ? '❌' : '✅';
      console.log(`  ${statusIcon} [${vp.name}] - Viewport: ${metrics.docWidth}px | Scroll: ${metrics.scrollWidth}px | Overflow: ${metrics.overflowAmount}px`);
      if (metrics.overflowAmount > 0) {
        console.log(`     Overflowing elements:`, metrics.overflowingElements.map(e => `${e.desc} (+${e.overflowBy}px)`).join(', '));
      }
      if (metrics.brokenImages.length > 0) {
        console.log(`     Broken images:`, metrics.brokenImages.map(i => i.src).join(', '));
      }
      if (vp.width < 992) {
        if (metrics.authContainerVisible) {
          console.log(`     ⚠️ Header notice: nav-auth-container is visible in mobile header`);
        }
        if (metrics.navLinksVisible) {
          console.log(`     ⚠️ Header notice: desktop nav-links still visible on mobile`);
        }
      }

      auditResults.push({
        page: pagePath,
        viewport: vp.name,
        width: vp.width,
        overflow: metrics.overflowAmount,
        elements: metrics.overflowingElements,
        brokenImages: metrics.brokenImages
      });
    }
  }

  ws.close();
  chrome.kill();

  const totalOverflows = auditResults.filter(r => r.overflow > 0).length;
  console.log('\n====================================================');
  console.log(`AUDIT COMPLETE: ${totalOverflows} viewport configuration(s) showed horizontal overflow.`);
  console.log('====================================================\n');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
