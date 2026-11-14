/**
 * CIBUS - Development Server & Static Asset Live-Watch Engine
 * Provides a clean, modern CLI developer experience (similar to Vite & Angular CLI)
 * with zero external dependencies.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { exec } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname);
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

// ANSI Terminal Colors & Styling
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  brightGreen: '\x1b[92m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  white: '\x1b[37m'
};

// MIME Types Mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

// Clean URL Route Definitions (mirrors vercel.json)
const ROUTE_ALIASES = {
  '/': '/index.html',
  '/home': '/pages/home.html',
  '/food-menu': '/pages/food-menu.html',
  '/recipe-cards': '/pages/recipe-cards.html',
  '/recipe-detail': '/pages/recipe-detail.html',
  '/cart': '/pages/cart.html',
  '/login': '/pages/login.html',
  '/register': '/pages/register.html',
  '/contact': '/pages/contact.html',
  '/favicon.ico': '/public/favicon.ico',
  '/favicon.svg': '/public/favicon.svg',
  '/robots.txt': '/public/robots.txt',
  '/sitemap.xml': '/public/sitemap.xml',
  '/site.webmanifest': '/public/site.webmanifest'
};

// Active Server-Sent Event (SSE) clients for live reload
const sseClients = new Set();

// Production-Parity Security Headers (mirrors vercel.json)
const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://ka-f.fontawesome.com https://va.vercel-scripts.com https://speed-insights.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://use.fontawesome.com; font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com data:; img-src 'self' data: https:; connect-src 'self' https://ka-f.fontawesome.com https://vitals.vercel-insights.com https://va.vercel-scripts.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};

/**
 * Format bytes into human-readable string (kB / MB)
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Sum size of all matching files in a directory
 */
function getDirTotalSize(dirPath, extFilter) {
  let total = 0;
  if (!fs.existsSync(dirPath)) return 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      total += getDirTotalSize(full, extFilter);
    } else if (entry.isFile()) {
      if (!extFilter || full.endsWith(extFilter)) {
        try {
          total += fs.statSync(full).size;
        } catch (_) {}
      }
    }
  }
  return total;
}

/**
 * Gather initial chunk / asset inventory stats
 */
function getChunkInventory() {
  const chunks = [];
  let totalBytes = 0;

  // Main Script & JS modules
  const jsTotal = getDirTotalSize(path.join(PROJECT_ROOT, 'js'), '.js');
  if (jsTotal > 0) {
    chunks.push({ file: 'main.js', name: 'main', size: jsTotal });
    totalBytes += jsTotal;
  }

  // Styles & CSS components
  const cssTotal = getDirTotalSize(path.join(PROJECT_ROOT, 'css'), '.css');
  if (cssTotal > 0) {
    chunks.push({ file: 'styles.css', name: 'styles', size: cssTotal });
    totalBytes += cssTotal;
  }

  // Entry HTML
  const indexPath = path.join(PROJECT_ROOT, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexSize = fs.statSync(indexPath).size;
    chunks.push({ file: 'index.html', name: 'entry', size: indexSize });
    totalBytes += indexSize;
  }

  // Datasets
  const dataTotal = getDirTotalSize(path.join(PROJECT_ROOT, 'data'), '.json');
  if (dataTotal > 0) {
    chunks.push({ file: 'recipes.json', name: 'data', size: dataTotal });
    totalBytes += dataTotal;
  }

  return { chunks, totalBytes };
}

/**
 * Render clean chunk files table in Vite / Angular CLI format
 */
function renderChunkTable(inventory) {
  const col1Header = 'Initial chunk files';
  const col2Header = 'Names';
  const col3Header = 'Raw size';

  console.log(`${colors.gray}${col1Header.padEnd(20)}| ${col2Header.padEnd(14)}| ${col3Header.padStart(9)}${colors.reset}`);

  for (const chunk of inventory.chunks) {
    const fileStr = chunk.file.padEnd(20);
    const nameStr = chunk.name.padEnd(14);
    const sizeStr = formatSize(chunk.size).padStart(9);
    console.log(`${colors.bold}${fileStr}${colors.reset}| ${colors.cyan}${nameStr}${colors.reset}| ${colors.brightGreen}${sizeStr}${colors.reset} |`);
  }

  console.log('');
  const totalFormatted = formatSize(inventory.totalBytes).padStart(9);
  console.log(`${''.padEnd(20)}| ${colors.bold}${'Initial total'.padEnd(14)}${colors.reset}| ${colors.bold}${colors.brightGreen}${totalFormatted}${colors.reset}`);
  console.log('');
}

/**
 * Print dev server launch banner (Clean local development output)
 */
function printLaunchBanner(port) {
  console.log(`\nCIBUS Development Server\n\nLocal: http://localhost:${port}/\n\nReady.\n`);
}

/**
 * Display keyboard shortcut help
 */
function showHelpMenu(port) {
  console.log(`\nCIBUS Server Shortcuts:`);
  console.log(`  r + enter  broadcast reload to browser`);
  console.log(`  u + enter  show local server URL`);
  console.log(`  o + enter  open local URL in default browser`);
  console.log(`  c + enter  clear terminal screen`);
  console.log(`  q + enter  quit server gracefully\n`);
}

/**
 * Open URL in the host's default web browser
 */
function openInBrowser(url) {
  const platform = process.platform;
  let command = '';
  if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    command = `open "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (err) => {
    if (err) {
      console.log(`  ${colors.red}Failed to open browser:${colors.reset} ${err.message}`);
    } else {
      console.log(`  ${colors.dim}Opened ${url} in default browser.${colors.reset}`);
    }
  });
}

/**
 * Inject live reload listener script into served HTML
 */
function injectLiveReload(html) {
  const snippet = `
<!-- Cibus Dev Live Reload -->
<script>
(() => {
  try {
    if (!window.EventSource) return;
    let es = null;
    let reconnectTimeout = null;

    function connect() {
      es = new EventSource('/__cibus_live_reload');
      es.onmessage = (e) => {
        if (!e.data || e.data.startsWith(':')) return;
        if (e.data === 'css') {
          document.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
            const href = l.getAttribute('href');
            if (href) {
              const u = new URL(href, location.href);
              u.searchParams.set('_cibus_t', Date.now());
              l.setAttribute('href', u.pathname + u.search);
            }
          });
        } else if (e.data === 'reload') {
          location.reload();
        }
      };
      es.onerror = () => {
        if (es) { es.close(); es = null; }
        if (!reconnectTimeout) {
          reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            connect();
          }, 3000);
        }
      };
    }

    connect();
  } catch (_) {}
})();
</script>
</body>`;

  if (html.includes('</body>')) {
    return html.replace('</body>', snippet);
  }
  return html + snippet;
}

/**
 * Resolve an incoming request path to a safe local file path
 */
function resolveFilePath(reqUrl) {
  let cleanPath = decodeURI(reqUrl.split('?')[0].split('#')[0]);

  // Check explicit route aliases
  if (ROUTE_ALIASES[cleanPath]) {
    cleanPath = ROUTE_ALIASES[cleanPath];
  } else if (cleanPath === '' || cleanPath === '/') {
    cleanPath = '/index.html';
  } else if (!path.extname(cleanPath)) {
    // Extensionless URLs - check if corresponding .html exists
    if (fs.existsSync(path.join(PROJECT_ROOT, cleanPath + '.html'))) {
      cleanPath = cleanPath + '.html';
    } else if (fs.existsSync(path.join(PROJECT_ROOT, 'pages', cleanPath + '.html'))) {
      cleanPath = '/pages' + cleanPath + '.html';
    }
  }

  const resolved = path.resolve(PROJECT_ROOT, '.' + cleanPath);
  // Ensure traversal cannot escape project root
  if (!resolved.startsWith(PROJECT_ROOT)) {
    return null;
  }
  return resolved;
}

/**
 * Notify connected SSE browser clients of changes
 */
function broadcastReload(type = 'reload') {
  for (const res of sseClients) {
    try {
      res.write(`data: ${type}\n\n`);
    } catch (_) {
      sseClients.delete(res);
    }
  }
}

/**
 * Setup debounced file watching on workspace folders
 */
function setupFileWatcher() {
  // Only watch code and content source folders (NEVER watch static image asset directories)
  const watchDirs = ['pages', 'css', 'js', 'data'];
  const mtimeCache = new Map();
  let debounceTimer = null;

  function onFileChange(baseDir, eventType, filename) {
    if (!filename) return;
    const ext = path.extname(filename).toLowerCase();
    // Only react to code & structured content changes
    if (!['.html', '.css', '.js', '.json'].includes(ext)) {
      return;
    }

    const fullPath = path.join(baseDir, filename);

    // Verify if the file actually exists and mtime truly changed (filtering out false-positive OS read events)
    try {
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        const lastMtime = mtimeCache.get(fullPath) || 0;
        if (stats.mtimeMs <= lastMtime + 300) {
          return; // Ignore access/read triggers
        }
        mtimeCache.set(fullPath, stats.mtimeMs);
      }
    } catch (_) {
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const startTime = Date.now();
      const isCss = ext === '.css';
      const timeStr = new Date().toLocaleTimeString();
      const relPath = path.relative(PROJECT_ROOT, fullPath).replace(/\\/g, '/');

      if (isCss) {
        console.log(`  ${colors.brightGreen}➜${colors.reset}  ${colors.dim}[${timeStr}]${colors.reset} ${colors.cyan}[hmr]${colors.reset} ${relPath} updated`);
        broadcastReload('css');
      } else {
        console.log(`  ${colors.brightGreen}➜${colors.reset}  ${colors.dim}[${timeStr}]${colors.reset} ${colors.yellow}[reload]${colors.reset} ${relPath} changed`);
        broadcastReload('reload');
      }
    }, 350);
  }

  // Watch code directories
  for (const dir of watchDirs) {
    const fullDir = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(fullDir)) {
      try {
        fs.watch(fullDir, { recursive: true }, (evt, fn) => onFileChange(fullDir, evt, fn));
      } catch (_) {}
    }
  }

  // Watch root index.html
  const rootIndex = path.join(PROJECT_ROOT, 'index.html');
  if (fs.existsSync(rootIndex)) {
    try {
      fs.watch(rootIndex, (evt, fn) => onFileChange(PROJECT_ROOT, evt, fn));
    } catch (_) {}
  }
}

/**
 * Setup interactive CLI keyboard listeners
 */
function setupKeyboardShortcuts(port) {
  if (!process.stdin.isTTY) return;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    const cmd = line.trim().toLowerCase();
    switch (cmd) {
      case 'h':
        showHelpMenu(port);
        break;
      case 'r':
        console.log(`  ${colors.brightGreen}➜${colors.reset}  ${colors.cyan}[reload]${colors.reset} manual refresh sent to browser`);
        broadcastReload('reload');
        break;
      case 'u':
        console.log(`\nLocal: http://localhost:${port}/\n`);
        break;
      case 'o':
        openInBrowser(`http://localhost:${port}/`);
        break;
      case 'c':
        console.clear();
        printLaunchBanner(port);
        break;
      case 'q':
        console.log(`\n${colors.yellow}Stopping CIBUS development server... Goodbye!${colors.reset}\n`);
        process.exit(0);
        break;
      default:
        break;
    }
  });
}

/**
 * Create and launch HTTP server
 */
function startServer(port = DEFAULT_PORT) {
  const startTime = Date.now();

  // Heartbeat to prevent browser EventSource timeout disconnections
  setInterval(() => {
    for (const client of sseClients) {
      try {
        client.write(': ping\n\n');
      } catch (_) {
        sseClients.delete(client);
      }
    }
  }, 20000).unref();

  const server = http.createServer((req, res) => {
    // 1. Live Reload EventSource Stream
    if (req.url === '/__cibus_live_reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      });
      res.write(': connected\n\n');
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    // 1b. Stub Vercel Analytics / Speed Insights endpoints for local development
    if (req.url.startsWith('/_vercel/')) {
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-cache',
        ...SECURITY_HEADERS
      });
      res.end('/* Vercel Web Analytics & Speed Insights local development stub */');
      return;
    }

    // 2. Resolve requested path
    const filePath = resolveFilePath(req.url);

    if (!filePath) {
      res.writeHead(403, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      // 3. Fallback to 404 page if file doesn't exist
      if (err || !stats.isFile()) {
        const notFoundPath = path.join(PROJECT_ROOT, 'pages', '404.html');
        fs.readFile(notFoundPath, 'utf8', (readErr, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS });
          if (!readErr && content) {
            res.end(injectLiveReload(content));
          } else {
            res.end('<h1>404 Not Found</h1>');
          }
        });
        return;
      }

      // 4. Serve file with proper Content-Type
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // HTML gets live-reload script injected
      if (ext === '.html') {
        fs.readFile(filePath, 'utf8', (readErr, content) => {
          if (readErr) {
            res.writeHead(500, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
            res.end('500 Internal Server Error');
            return;
          }
          res.writeHead(200, { 'Content-Type': contentType, ...SECURITY_HEADERS });
          res.end(injectLiveReload(content));
        });
        return;
      }

      // Static assets are streamed directly
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache',
        ...SECURITY_HEADERS
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`${colors.yellow}Port ${port} in use, trying port ${port + 1}...${colors.reset}`);
      startServer(port + 1);
    } else {
      console.error(`${colors.red}X [ERROR] Failed to start server:${colors.reset} ${err.message}`);
      process.exit(1);
    }
  });

  server.listen(port, '127.0.0.1', () => {
    printLaunchBanner(port);
    setupFileWatcher();
    setupKeyboardShortcuts(port);
  });
}

// Start development server
startServer();

