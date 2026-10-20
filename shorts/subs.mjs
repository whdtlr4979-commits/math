// 자막 원고 추출: 각 편의 cap() 자막을 시간과 함께 뽑아 SRT와 Markdown 원고로 저장한다.
//   node subs.mjs            → scripts/epN.srt, scripts/integral_all.srt, scripts/full.srt, scripts/자막원고.md
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const EPS = [
  ['ep0', '적분의 탄생 (단원의 이론적 배경)'],
  ['ep1', '부정적분'],
  ['ep2', '정적분'],
  ['ep3', '정적분의 활용 ① 넓이'],
  ['ep4', '정적분의 활용 ② 속도와 거리'],
];

const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', n: 'ⁿ', '+': '⁺', '-': '⁻' };
function texToText(s) {
  s = s.replace(/\\color\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/\\d?frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
    .replace(/\\(displaystyle|left|right|,|!|;)/g, '')
    .replace(/\\int/g, '∫').replace(/\\to/g, '→').replace(/\\times/g, '×').replace(/\\pm/g, '±')
    .replace(/\\cdot/g, '·').replace(/\\Delta/g, 'Δ').replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β')
    .replace(/\\quad/g, ' ').replace(/\\le/g, '≤').replace(/\\ge/g, '≥');
  s = s.replace(/\^\{([^}]*)\}|\^(.)/g, (_, a, b) => {
    const v = a ?? b;
    return [...v].every((ch) => SUP[ch]) ? [...v].map((ch) => SUP[ch]).join('') : `^(${v})`;
  });
  return s.replace(/_\{([^}]*)\}/g, '$1').replace(/[{}]/g, '');
}
const plain = (html) => html
  .replace(/\$([^$]+)\$/g, (_, m) => texToText(m))
  .replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const ts = (t) => {
  const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const srt = (rows) => rows.map((r, i) => `${i + 1}\n${ts(r.t0)} --> ${ts(r.t1)}\n${r.text}\n`).join('\n');

const outDir = path.join(root, 'scripts');
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
let offset = 0;
const all = [];
let md = '# 미적분Ⅰ Ⅲ. 적분 — 숏츠 자막 원고\n\n각 편의 화면 하단 자막을 시간 순서대로 정리했습니다. 시간은 각 편 영상 기준이며, 합본 기준 시간은 `integral_all.srt`에 있습니다.\n';
async function extract(ep) {
  await page.goto(pathToFileURL(path.join(root, 'episodes', `${ep}.html`)).href);
  await page.waitForFunction(() => window.READY === true);
  const { dur, caps } = await page.evaluate(() => ({
    dur: T.dur,
    caps: T.items.filter((it) => it.cls.split(' ').includes('cap')).map((it) => ({ t0: it.t0, t1: it.t1, src: it.src })),
  }));
  return { dur, rows: caps.sort((a, b) => a.t0 - b.t0).map((c) => ({ t0: c.t0, t1: c.t1, text: plain(c.src) })) };
}
const table = (rows) => '| 시간 | 자막 |\n|---|---|\n' + rows.map((r) => `| ${mmss(r.t0)}–${mmss(r.t1)} | ${r.text.replace(/\|/g, '\\|')} |`).join('\n') + '\n';

for (const [ep, title] of EPS) {
  const { dur, rows } = await extract(ep);
  writeFileSync(path.join(outDir, `${ep}.srt`), srt(rows));
  rows.forEach((r) => all.push({ t0: r.t0 + offset, t1: r.t1 + offset, text: r.text }));
  md += `\n## EP.${ep.slice(2)} ${title} (${mmss(dur)})\n\n` + table(rows);
  console.log(`${ep}: ${rows.length} captions`);
  offset += dur;
}
writeFileSync(path.join(outDir, 'integral_all.srt'), srt(all));
const full = await extract('full');
writeFileSync(path.join(outDir, 'full.srt'), srt(full.rows));
md += `\n## 가로 16:9 통합본 (${mmss(full.dur)})\n\n` + table(full.rows);
console.log(`full: ${full.rows.length} captions`);
writeFileSync(path.join(outDir, '자막원고.md'), md);
await browser.close();
