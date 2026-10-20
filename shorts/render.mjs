// 사용법:
//   node render.mjs ep1                → out/ep1.mp4 (음악·효과음 포함)
//   node render.mjs ep1 --stills 5,12  → out/stills/ep1_5.jpg ... (확인용 정지 화면)
//   node render.mjs full --parts 6     → 프레임을 6구간으로 나눠 병렬 렌더링 후 이어 붙임
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const ep = process.argv[2] ?? 'ep1';
const si = process.argv.indexOf('--stills');
const stills = si > 0 ? process.argv[si + 1].split(',').map(Number) : null;
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const parts = Number(arg('--parts') ?? 1);
const range = arg('--range')?.split(',').map(Number); // 자식 프로세스: [시작 프레임, 끝 프레임)
const FPS = 30;
const out = path.join(root, 'out');
mkdirSync(path.join(out, 'stills'), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', (m) => { if (m.type() === 'error') console.error('[page]', m.text()); });
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
await page.goto(pathToFileURL(path.join(root, 'episodes', `${ep}.html`)).href);
await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
const { dur, cues, w, h } = await page.evaluate(() => ({ dur: T.dur, cues: T.cues, w: W, h: H }));
await page.setViewportSize({ width: w, height: h });
console.log(`${ep}: ${dur.toFixed(1)}s, ${cues.length} cues`);

if (stills) {
  for (const t of stills) {
    await page.evaluate((t) => setTime(t), t);
    await page.screenshot({ path: path.join(out, 'stills', `${ep}_${t}.jpg`), type: 'jpeg', quality: 80 });
  }
  await browser.close();
  process.exit(0);
}

const silent = path.join(out, range ? `${ep}_part${range[0]}.mp4` : `${ep}_silent.mp4`);
const n = Math.ceil(dur * FPS);

if (parts > 1 && !range) {
  // 구간별 자식 프로세스로 병렬 렌더링 → 무손실 이어 붙이기
  await browser.close();
  const bounds = Array.from({ length: parts + 1 }, (_, k) => Math.round((n * k) / parts));
  const files = [];
  await Promise.all(bounds.slice(0, -1).map((b0, k) => new Promise((res, rej) => {
    files[k] = path.join(out, `${ep}_part${b0}.mp4`);
    const ch = spawn('node', [fileURLToPath(import.meta.url), ep, '--range', `${b0},${bounds[k + 1]}`], { stdio: 'inherit' });
    ch.on('close', (c) => (c === 0 ? res() : rej(new Error(`part ${k} failed`))));
  })));
  const list = path.join(out, `${ep}_parts.txt`);
  writeFileSync(list, files.map((f) => `file '${f}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent], { stdio: 'inherit' });
  files.forEach((f) => unlinkSync(f)); unlinkSync(list);
} else {
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
const [f0, f1] = range ?? [0, n];
const t0 = Date.now();
for (let i = f0; i < f1; i++) {
  await page.evaluate((t) => setTime(t), i / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if ((i - f0) % 300 === 0) console.log(`  frame ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
if (range) process.exit(0);
}

// 배경음악 + 효과음 합성 후 합치기
const cueFile = path.join(out, `${ep}_cues.json`);
const wav = path.join(out, `${ep}.wav`);
writeFileSync(cueFile, JSON.stringify({ dur, cues }));
execFileSync('python3', ['-I', path.join(root, 'music.py'), cueFile, wav, ep], { stdio: 'inherit' });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest',
  '-movflags', '+faststart', path.join(out, `${ep}.mp4`)], { stdio: 'inherit' });
console.log(`done → out/${ep}.mp4`);
