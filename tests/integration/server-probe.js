const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '../../');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(projectRoot, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  console.log(`📡 Local Test Server running on http://127.0.0.1:${port}`);

  const routesToProbe = [
    '/',
    '/index.html',
    '/pages/home.html',
    '/pages/food-menu.html',
    '/pages/recipe-cards.html',
    '/pages/recipe-detail.html',
    '/pages/cart.html',
    '/pages/login.html',
    '/pages/register.html',
    '/pages/contact.html',
    '/pages/404.html',
    '/data/states.json',
    '/data/food-items.json',
    '/data/recipes.json',
    '/css/main.css',
    '/js/main.js',
    '/favicon.ico',
    '/favicon.svg',
    '/public/favicon.svg',
    '/public/favicon.ico',
    '/public/assets/images/food-photo.jpeg',
    '/public/assets/gif/food-animation.gif'
  ];

  let probedCount = 0;

  for (const route of routesToProbe) {
    await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}${route}`, (res) => {
        let body = [];
        res.on('data', chunk => body.push(chunk));
        res.on('end', () => {
          assert.strictEqual(res.statusCode, 200, `Expected 200 for ${route}, got ${res.statusCode}`);
          const totalBytes = Buffer.concat(body).length;
          assert.ok(totalBytes > 0, `Expected non-empty response for ${route}`);
          console.log(`  ✓ Route ${route.padEnd(40)} -> HTTP 200 (${totalBytes} bytes)`);
          probedCount++;
          resolve();
        });
      }).on('error', reject);
    });
  }

  console.log(`\n🎉 PROBE COMPLETED: All ${probedCount} routes returned HTTP 200 OK!`);
  server.close(() => {
    process.exit(0);
  });
});

