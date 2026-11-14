/**
 * CIBUS CDP Driver
 * Zero-dependency Chrome DevTools Protocol automation using native WebSocket and fetch.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

class CdpClient {
  constructor(port = 9222) {
    this.port = port;
    this.proc = null;
    this.ws = null;
    this.msgId = 1;
    this.pending = new Map();
  }

  async start() {
    const tmpDir = path.join(os.tmpdir(), `cibus-cdp-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    this.proc = spawn(CHROME_PATH, [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--disable-web-security',
      '--allow-file-access-from-files',
      '--hide-scrollbars',
      `--user-data-dir=${tmpDir}`,
      'about:blank'
    ], { stdio: 'ignore' });

    // Poll for CDP page target
    let retries = 25;
    let pageWsUrl = null;
    while (retries > 0) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch(`http://127.0.0.1:${this.port}/json/list`);
        if (res.ok) {
          const list = await res.json();
          const page = list.find(t => t.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            pageWsUrl = page.webSocketDebuggerUrl;
            break;
          }
        }
      } catch (_) {}
      retries--;
    }

    if (!pageWsUrl) throw new Error('Could not find active CDP page target.');

    // Connect WebSocket to page target
    this.ws = new WebSocket(pageWsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    };

    // Enable domains
    await this.send('Page.enable');
    await this.send('DOM.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async setDeviceMetrics(width, height, deviceScaleFactor = 2, mobile = true) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width: Math.round(width),
      height: Math.round(height),
      deviceScaleFactor,
      mobile,
      screenOrientation: { angle: 0, type: 'portraitPrimary' }
    });
    await this.send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 400));
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  async captureScreenshot(clip = null) {
    const params = { format: 'png', captureBeyondViewport: false };
    if (clip) params.clip = clip;
    const res = await this.send('Page.captureScreenshot', params);
    return Buffer.from(res.data, 'base64');
  }

  async close() {
    if (this.ws) {
      try { this.ws.close(); } catch (_) {}
    }
    if (this.proc) {
      try { this.proc.kill(); } catch (_) {}
    }
  }
}

module.exports = { CdpClient };
