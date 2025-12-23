// scripts/collect-trace.js
/**
 * Collect a Chrome performance trace for the app. Requires the dev server to be running:
 *
 *   npm run dev
 *   node scripts/collect-trace.js
 *
 * Optionally pass an output path or URL:
 *   node scripts/collect-trace.js --url=http://localhost:5173/?seed=true --out=docs/profiles/trace-seed-500.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { chromium } from '@playwright/test';

(async function main() {
  const args = process.argv.slice(2);
  const argMap = {};
  args.forEach(a => {
    if (a.includes('=')) {
      const [k, v] = a.split('=');
      argMap[k.replace(/^--/, '')] = v;
    }
  });

  const url = argMap.url || 'http://localhost:5173/?seed=true';
  const out = argMap.out || path.join(__dirname, '..', 'docs', 'profiles', `trace-${Date.now()}.json`);

  // Ensure output dir
  fs.mkdirSync(path.dirname(out), { recursive: true });

  console.log('🔍 Launching Chromium, connecting to:', url);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'load' });
    // Give the app a moment to hydrate and render
    await page.waitForTimeout(1000);

    // Create CDP session to use Tracing.* API directly
    const client = await context.newCDPSession(page);

    const categories = [
      'devtools.timeline',
      'v8',
      'blink.user_timing',
      'disabled-by-default-devtools.timeline',
      'disabled-by-default-devtools.timeline.frame',
      'toplevel'
    ].join(',');

    console.log('🟢 Starting trace recording...');
    await client.send('Tracing.start', {
      transferMode: 'ReturnAsStream',
      categories,
      options: 'sampling-frequency=1000',
    });

    // Interactions to exercise the UI: scroll horizontally and vertically
    console.log('➡️ Scrolling the board horizontally and vertically to exercise virtualization');

    // Scroll the main board horizontally back and forth
    await page.evaluate(async () => {
      const el = document.querySelector('.flex.gap-6.overflow-x-auto');
      if (!el) return;
      for (let i = 0; i < 3; i++) {
        el.scrollLeft = el.scrollWidth;
        await new Promise(r => setTimeout(r, 400));
        el.scrollLeft = 0;
        await new Promise(r => setTimeout(r, 400));
      }

      // Scroll each column vertically a bit to force virtualization updates
      document.querySelectorAll('.w-72').forEach((col) => {
        col.scrollTop = 100;
      });
    });

    await page.waitForTimeout(800);

    console.log('🔴 Stopping trace and saving to file...');
    const traceBufferResp = await client.send('Tracing.end');

    // Read resulting stream
    const streamHandle = traceBufferResp.stream;
    let traceJSON = '';
    while (true) {
      const chunk = await client.send('IO.read', { handle: streamHandle });
      traceJSON += chunk.data;
      if (chunk.eof) break;
    }
    await client.send('IO.close', { handle: streamHandle });

    fs.writeFileSync(out, traceJSON, 'utf8');
    console.log(`✅ Trace saved: ${out}`);
  } catch (e) {
    console.error('❌ Trace collection failed:', e);
  } finally {
    await browser.close();
  }
})();
