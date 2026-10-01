import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import http from 'http';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const UTILS_DIST = path.resolve('node_modules/@excalidraw/utils/dist/prod/index.js');

fs.mkdirSync('public/images/diagrams', { recursive: true });

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
      <html>
        <head>
          <script type="module">
            try {
              const mod = await import('/utils.js');
              window.excalidrawUtils = mod;
              window.__READY__ = true;
            } catch(e) {
              window.__ERROR__ = e.message;
            }
          </script>
        </head>
        <body style="background: #000; color: #fff;">
          <div id="container"></div>
        </body>
      </html>`);
  } else if (req.url === '/utils.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(fs.readFileSync(UTILS_DIST));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(49201, async () => {
  console.log('Export server running on 49201...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERR:', err));

  await page.goto('http://localhost:49201/');
  await page.waitForFunction(() => window.__READY__ || window.__ERROR__, { timeout: 10000 });

  async function exportDiagram(data, outName, filterFn = null) {
    let elements = data.elements.filter(e => !e.isDeleted);
    if (filterFn) {
      elements = elements.filter(filterFn);
    }
    console.log(`Processing ${outName} (${elements.length} elements)...`);

    const result = await page.evaluate(async (elements, appState, files) => {
      try {
        // Dark version
        const svgDark = await window.excalidrawUtils.exportToSvg({
          data: {
            elements,
            appState: {
              ...(appState || {}),
              exportWithDarkMode: true,
              exportBackground: true,
              viewBackgroundColor: "#121215"
            },
            files: files || null
          },
          config: {
            theme: "dark",
            padding: 30
          }
        });

        // Light version
        const svgLight = await window.excalidrawUtils.exportToSvg({
          data: {
            elements,
            appState: {
              ...(appState || {}),
              exportWithDarkMode: false,
              exportBackground: true,
              viewBackgroundColor: "#ffffff"
            },
            files: files || null
          },
          config: {
            theme: "light",
            padding: 30
          }
        });

        return {
          dark: svgDark.outerHTML,
          light: svgLight.outerHTML
        };
      } catch (err) {
        return { error: err.message + '\n' + err.stack };
      }
    }, elements, data.appState, data.files);

    if (result.error) {
      console.error(`Error in ${outName}:`, result.error);
      return;
    }

    fs.writeFileSync(`public/images/diagrams/${outName}-dark.svg`, result.dark);
    fs.writeFileSync(`public/images/diagrams/${outName}.svg`, result.light);
    console.log(`Saved: public/images/diagrams/${outName}.svg and ${outName}-dark.svg (length: ${result.dark.length})`);
  }

  // 1. Lois
  if (fs.existsSync('public/lois.excalidraw')) {
    const loisData = JSON.parse(fs.readFileSync('public/lois.excalidraw', 'utf8'));
    await exportDiagram(loisData, 'lois-architecture');
  }

  // 2. Classify AI and Cash Underwriting
  if (fs.existsSync('public/classify_ai_cash_underwriting.excalidraw')) {
    const data = JSON.parse(fs.readFileSync('public/classify_ai_cash_underwriting.excalidraw', 'utf8'));
    
    // Cash Underwriting: x < 97000
    await exportDiagram(data, 'cash-underwriting-architecture', (e) => e.x < 97000);

    // Classify AI: x >= 97000
    await exportDiagram(data, 'classify-ai-architecture', (e) => e.x >= 97000);

    // Full system diagram
    await exportDiagram(data, 'finally-systems-architecture');
  }

  await browser.close();
  server.close();
  console.log('Done export!');
});
