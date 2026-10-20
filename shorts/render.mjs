// 사용법:
//   node render.mjs ep1                → out/ep1.mp4 (음악·효과음 포함)
//   node render.mjs ep1 --stills 5,12  → out/stills/ep1_5.jpg ... (확인용 정지 화면)
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const ep = process.argv[2] ?? 'ep1';
const si = process.argv.indexOf('--stills');
const stills = si > 0 ? process.argv[si + 1].split(',').map(Number) : null;
const FPS = 30;
const out = path.join(root, 'out');
mkdirSync(path.join(out, 'stills'), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
await page.goto(pathToFileURL(path.join(root, 'episodes', `${ep}.html`)).href);
await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
const { dur, cues } = await page.evaluate(() => ({ dur: T.dur, cues: T.cues }));
console.log(`${ep}: ${dur.toFixed(1)}s, ${cues.length} cues`);

if (stills) {
  for (const t of stills) {
    await page.evaluate((t) => setTime(t), t);
    await page.screenshot({ path: path.join(out, 'stills', `${ep}_${t}.jpg`), type: 'jpeg', quality: 80 });
  }
  await browser.close();
  process.exit(0);
}

const silent = path.join(out, `${ep}_silent.mp4`);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
const n = Math.ceil(dur * FPS);
const t0 = Date.now();
for (let i = 0; i < n; i++) {
  await page.evaluate((t) => setTime(t), i / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % 150 === 0) console.log(`  frame ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();

// 배경음악 + 효과음 합성 후 합치기
const cueFile = path.join(out, `${ep}_cues.json`);
const wav = path.join(out, `${ep}.wav`);
writeFileSync(cueFile, JSON.stringify({ dur, cues }));
execFileSync('python3', ['-I', path.join(root, 'music.py'), cueFile, wav, ep], { stdio: 'inherit' });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest',
  '-movflags', '+faststart', path.join(out, `${ep}.mp4`)], { stdio: 'inherit' });
console.log(`done → out/${ep}.mp4`);
