// 숏츠용 미니 모션그래픽 엔진.
// 모든 애니메이션은 시간 t(초)의 순수 함수이므로 setTime(t)로 임의 프레임을 결정적으로 그릴 수 있다.
const W = 1080, H = 1920;
const C = {
  bg0: '#0e1124', bg1: '#1a1d3d', ink: '#f4f5fb', dim: '#a9aecb',
  pink: '#ff6b8b', purple: '#a78bfa', green: '#5ee0b0', yellow: '#ffd166', cyan: '#5ad1ff',
  orange: '#ff9f5a', grid: 'rgba(255,255,255,0.07)', axis: 'rgba(255,255,255,0.75)',
};

const cv = document.getElementById('cv');
cv.width = W; cv.height = H;
const ctx = cv.getContext('2d');
const layer = document.getElementById('layer');

const T = { dur: 0, cursor: 0, draws: [], items: [], cues: [], meta: {} };

// ---------- 수치 유틸 ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const ease = {
  lin: (x) => x,
  out: (x) => 1 - Math.pow(1 - x, 3),
  in: (x) => x * x * x,
  inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  back: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
};
const prog = (t, t0, d, e = ease.inOut) => e(clamp((t - t0) / d));
// 구간별 값: keys = [[t, v], ...] 사이를 부드럽게 보간
function keyed(t, keys, e = ease.inOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, e((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}

// ---------- KaTeX ----------
function tex(s, display = false) {
  return katex.renderToString(s, { throwOnError: false, displayMode: display, output: 'html' });
}
function rich(s) {
  return s.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => tex(m, true))
          .replace(/\$([\s\S]+?)\$/g, (_, m) => tex(m, false));
}

// ---------- 타임라인 ----------
// scene(길이, fn): fn(s)에서 s는 장면 시작 시각. 장면 경계마다 효과음 큐를 남긴다.
function scene(dur, fn) {
  const s = T.cursor;
  T.cues.push({ t: s, type: 'whoosh' });
  fn(s, s + dur);
  T.cursor += dur;
  T.dur = T.cursor;
}

// 캔버스 그리기 등록: fn(ctx, a, lt, t) — a는 페이드 알파, lt는 t0 기준 지역 시간
function draw(t0, t1, fn, o = {}) {
  T.draws.push({ t0, t1, fn, din: o.din ?? 0.45, dout: o.dout ?? 0.4, z: o.z ?? 0 });
}

// DOM 항목 등록. 위치(x, y)는 기준점(ax, ay; 기본 중앙)이 놓일 좌표.
function item(html, o = {}) {
  const el = document.createElement('div');
  el.className = 'it ' + (o.cls || '');
  el.innerHTML = rich(html);
  const st = el.style;
  st.left = (o.x ?? W / 2) + 'px';
  st.top = (o.y ?? H / 2) + 'px';
  if (o.w) { st.width = o.w + 'px'; st.whiteSpace = 'normal'; }
  st.fontSize = (o.size ?? 48) + 'px';
  if (o.color) st.color = o.color;
  st.fontWeight = o.weight ?? 600;
  st.textAlign = o.align ?? 'center';
  if (o.style) Object.assign(st, o.style);
  st.display = 'none';
  layer.appendChild(el);
  const it = {
    el, t0: o.t0 ?? 0, t1: o.t1 ?? 1e9, din: o.din ?? 0.5, dout: o.dout ?? 0.35,
    anim: o.anim ?? 'up', ax: o.ax ?? 0.5, ay: o.ay ?? 0.5, upd: o.upd, z: o.z ?? 0,
  };
  st.zIndex = it.z;
  if (o.sfx !== false && o.sfx !== undefined) T.cues.push({ t: it.t0, type: o.sfx });
  T.items.push(it);
  return it;
}

// 자막 (화면 하단 안전 영역)
function cap(html, t0, t1, o = {}) {
  return item(html, { x: W / 2, y: o.y ?? 1560, w: o.w ?? 960, size: o.size ?? 50, cls: 'cap', t0, t1, anim: 'up', din: 0.35, dout: 0.25, z: 50 });
}

function applyItem(it, t) {
  const { el } = it;
  if (t < it.t0 || t > it.t1) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  const pin = clamp((t - it.t0) / it.din);
  const pout = it.t1 > 1e8 ? 1 : clamp((it.t1 - t) / it.dout);
  const a = Math.min(ease.out(pin), ease.out(pout));
  let tf = `translate(${-it.ax * 100}%, ${-it.ay * 100}%)`;
  if (it.anim === 'up') tf += ` translateY(${(1 - ease.out(pin)) * 46 - (1 - ease.out(pout)) * 20}px)`;
  else if (it.anim === 'pop') tf += ` scale(${pin < 1 ? 0.5 + 0.5 * ease.back(pin) : 1})`;
  else if (it.anim === 'left') tf += ` translateX(${(1 - ease.out(pin)) * -70}px)`;
  else if (it.anim === 'right') tf += ` translateX(${(1 - ease.out(pin)) * 70}px)`;
  el.style.opacity = a;
  el.style.transform = tf;
  if (it.upd) it.upd(it, t - it.t0, t);
}

// ---------- 배경 / 공통 UI ----------
function drawBackground(t) {
  const g = ctx.createLinearGradient(0, 0, W * 0.4, H);
  g.addColorStop(0, C.bg1); g.addColorStop(1, C.bg0);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // 은은한 빛 번짐
  const r = ctx.createRadialGradient(W * 0.85, 260 + 40 * Math.sin(t * 0.3), 0, W * 0.85, 260, 700);
  r.addColorStop(0, 'rgba(255,107,139,0.16)'); r.addColorStop(1, 'rgba(255,107,139,0)');
  ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
  const r2 = ctx.createRadialGradient(W * 0.1, H * 0.78, 0, W * 0.1, H * 0.78, 800);
  r2.addColorStop(0, 'rgba(90,209,255,0.10)'); r2.addColorStop(1, 'rgba(90,209,255,0)');
  ctx.fillStyle = r2; ctx.fillRect(0, 0, W, H);
  // 천천히 흐르는 모눈
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 2;
  const off = (t * 12) % 72;
  ctx.beginPath();
  for (let x = -72 + off; x < W; x += 72) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = -72 + off; y < H; y += 72) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();
  // 떠다니는 적분 기호
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  ctx.font = 'italic 300px KaTeX_Size2';
  ctx.fillText('∫', 760 + 20 * Math.sin(t * 0.4), 1850 - ((t * 18) % 400));
  ctx.font = 'italic 220px KaTeX_Size2';
  ctx.fillText('∫', 40 + 15 * Math.cos(t * 0.5), 760 + 30 * Math.sin(t * 0.35));
  ctx.restore();
}

function header(ep, title, t0) {
  item(`<span class="chip" style="font-size:30px;background:rgba(255,255,255,0.12)">미적분Ⅰ · Ⅲ. 적분</span>`,
    { x: 60, y: 92, ax: 0, size: 30, t0, anim: 'left', z: 40 });
  item(`<span class="chip" style="font-size:30px">EP.${ep}</span>`, { x: W - 60, y: 92, ax: 1, size: 30, t0, anim: 'right', z: 40 });
  item(title, { x: 60, y: 178, ax: 0, size: 54, weight: 800, t0, anim: 'left', z: 40 });
}

function drawProgress(t) {
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(0, 0, W, 10);
  ctx.fillStyle = C.pink; ctx.fillRect(0, 0, W * clamp(t / T.dur), 10);
}

// 오프닝 타이틀 카드
function intro(ep, title, sub, dur = 3.6) {
  scene(dur, (s, e) => {
    item(`<span class="chip" style="font-size:44px;padding:14px 40px">EP.${ep}</span>`, { y: 700, t0: s + 0.1, t1: e, anim: 'pop', sfx: 'pop' });
    item(title, { y: 860, size: 132, weight: 900, t0: s + 0.35, t1: e, anim: 'pop' });
    item(sub, { y: 1020, size: 52, weight: 600, color: C.dim, t0: s + 0.8, t1: e });
    item('미적분Ⅰ · Ⅲ. 적분', { y: 580, size: 36, weight: 700, color: C.dim, t0: s + 0.1, t1: e });
    draw(s, e, (c, a, lt) => {
      const p = prog(lt, 0.6, 0.8, ease.out);
      c.globalAlpha = a; c.fillStyle = C.pink;
      const w = 520 * p; c.beginPath(); c.roundRect(W / 2 - w / 2, 930, w, 12, 6); c.fill();
      // 커지는 원
      c.strokeStyle = 'rgba(255,107,139,0.35)'; c.lineWidth = 4;
      for (let k = 0; k < 3; k++) {
        const q = clamp((lt - k * 0.35) / 2.4);
        c.globalAlpha = a * (1 - q) * 0.8;
        c.beginPath(); c.arc(W / 2, 860, 200 + 520 * ease.out(q), 0, Math.PI * 2); c.stroke();
      }
      c.globalAlpha = 1;
    });
  });
}

// 마무리 요약 카드
function outro(lines, next, dur = 7) {
  scene(dur, (s, e) => {
    item('<b>📌 한눈에 정리</b>', { y: 420, size: 64, weight: 800, t0: s + 0.1, t1: e, anim: 'pop', sfx: 'pop' });
    lines.forEach((ln, i) => {
      item(ln, { y: 600 + i * 200, size: 50, w: 900, cls: 'card', t0: s + 0.6 + i * 0.7, t1: e, anim: 'left', sfx: 'pop' });
    });
    if (next) item(next, { y: 600 + lines.length * 200 + 60, size: 44, color: C.dim, t0: s + 0.8 + lines.length * 0.7, t1: e });
    T.cues.push({ t: s + 0.6 + lines.length * 0.7, type: 'chime' });
  });
}

// ---------- 캔버스 도우미 ----------
function ctext(c, s, x, y, o = {}) {
  c.save();
  c.font = o.font ?? `${o.italic === false ? '' : 'italic '}${o.size ?? 40}px ${o.family ?? 'KaTeX_Math'}`;
  c.fillStyle = o.color ?? C.ink;
  if (o.a !== undefined) c.globalAlpha *= o.a;
  c.textAlign = o.align ?? 'center';
  c.textBaseline = o.base ?? 'middle';
  if (o.shadow) { c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 12; }
  c.fillText(s, x, y);
  c.restore();
}

function arrow(c, x0, y0, x1, y1, o = {}) {
  const col = o.color ?? C.ink, w = o.width ?? 5, hs = o.head ?? 22;
  const ang = Math.atan2(y1 - y0, x1 - x0);
  c.save(); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = w; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - Math.cos(ang) * hs * 0.6, y1 - Math.sin(ang) * hs * 0.6); c.stroke();
  c.beginPath(); c.moveTo(x1, y1);
  c.lineTo(x1 - hs * Math.cos(ang - 0.45), y1 - hs * Math.sin(ang - 0.45));
  c.lineTo(x1 - hs * Math.cos(ang + 0.45), y1 - hs * Math.sin(ang + 0.45));
  c.closePath(); c.fill(); c.restore();
}

// 곡선 화살표(이차 베지어), p: 그려진 비율
function curvedArrow(c, x0, y0, cx, cy, x1, y1, p, o = {}) {
  if (p <= 0) return;
  const pt = (u) => [(1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1, (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * y1];
  c.save(); c.strokeStyle = o.color ?? C.ink; c.lineWidth = o.width ?? 6; c.lineCap = 'round';
  c.beginPath();
  for (let i = 0; i <= 60; i++) { const [x, y] = pt((i / 60) * p); i ? c.lineTo(x, y) : c.moveTo(x, y); }
  c.stroke(); c.restore();
  const [xa, ya] = pt(Math.max(0, p - 0.04)), [xb, yb] = pt(p);
  arrow(c, xa, ya, xb, yb, { color: o.color, width: o.width ?? 6, head: 28 });
}

class Plot {
  // x, y, w, h: 화면상 상자, xr/yr: 좌표 범위
  constructor(o) { Object.assign(this, { step: 1, ystep: 1 }, o); }
  X(x) { return this.x + (x - this.xr[0]) / (this.xr[1] - this.xr[0]) * this.w; }
  Y(y) { return this.y + this.h - (y - this.yr[0]) / (this.yr[1] - this.yr[0]) * this.h; }
  clip(c) { c.beginPath(); c.rect(this.x - 4, this.y - 4, this.w + 8, this.h + 8); c.clip(); }

  axes(c, a = 1, o = {}) {
    c.save(); c.globalAlpha = a;
    if (o.grid !== false) {
      c.strokeStyle = C.grid; c.lineWidth = 2; c.beginPath();
      for (let x = Math.ceil(this.xr[0] / this.step) * this.step; x <= this.xr[1]; x += this.step) { c.moveTo(this.X(x), this.y); c.lineTo(this.X(x), this.y + this.h); }
      for (let y = Math.ceil(this.yr[0] / this.ystep) * this.ystep; y <= this.yr[1]; y += this.ystep) { c.moveTo(this.x, this.Y(y)); c.lineTo(this.x + this.w, this.Y(y)); }
      c.stroke();
    }
    const ox = this.X(0), oy = this.Y(0);
    arrow(c, this.x, oy, this.x + this.w + 10, oy, { color: C.axis, width: 4, head: 20 });
    const yin = o.yaxis !== false && ox >= this.x && ox <= this.x + this.w;
    if (yin) arrow(c, ox, this.y + this.h, ox, this.y - 10, { color: C.axis, width: 4, head: 20 });
    ctext(c, o.xl ?? 'x', this.x + this.w + 6, oy + 38, { size: 42, color: C.dim });
    if (yin) ctext(c, o.yl ?? 'y', ox - 30, this.y - 6, { size: 42, color: C.dim });
    if (o.origin !== false && yin) ctext(c, 'O', ox - 26, oy + 30, { size: 34, color: C.dim });
    (o.ticks ?? []).forEach((tk) => {
      const [v, lab] = Array.isArray(tk) ? tk : [tk, String(tk)];
      c.strokeStyle = C.axis; c.lineWidth = 3; c.beginPath(); c.moveTo(this.X(v), oy - 9); c.lineTo(this.X(v), oy + 9); c.stroke();
      ctext(c, lab, this.X(v), oy + 38, { size: 34, color: C.dim, italic: /^[a-zαβ]/.test(lab) });
    });
    (o.yticks ?? []).forEach((tk) => {
      const [v, lab] = Array.isArray(tk) ? tk : [tk, String(tk)];
      c.strokeStyle = C.axis; c.lineWidth = 3; c.beginPath(); c.moveTo(ox - 9, this.Y(v)); c.lineTo(ox + 9, this.Y(v)); c.stroke();
      ctext(c, lab, ox - 18, this.Y(v), { size: 32, color: C.dim, align: 'right', italic: false, family: 'KaTeX_Main' });
    });
    c.restore();
  }

  path(c, f, x0, x1, n = 300) {
    c.beginPath();
    for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; const X = this.X(x), Y = this.Y(f(x)); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }
  }

  curve(c, f, x0, x1, o = {}) {
    const p = o.p ?? 1; if (p <= 0) return;
    c.save(); this.clip(c);
    c.globalAlpha = o.a ?? 1; c.strokeStyle = o.color ?? C.cyan; c.lineWidth = o.width ?? 7; c.lineJoin = 'round'; c.lineCap = 'round';
    if (o.dash) c.setLineDash(o.dash);
    if (o.glow !== false) { c.shadowColor = o.color ?? C.cyan; c.shadowBlur = 18; }
    this.path(c, f, x0, x0 + (x1 - x0) * p); c.stroke(); c.restore();
  }

  // f(위)와 g(아래) 사이를 채움. g 생략 시 x축.
  area(c, f, g, x0, x1, o = {}) {
    const p = o.p ?? 1; if (p <= 0 || x1 <= x0) return;
    g = g ?? (() => 0);
    const xe = x0 + (x1 - x0) * p, n = 200;
    c.save(); this.clip(c); c.globalAlpha = o.a ?? 1; c.fillStyle = o.color ?? 'rgba(167,139,250,0.45)';
    c.beginPath();
    for (let i = 0; i <= n; i++) { const x = x0 + (xe - x0) * i / n; i ? c.lineTo(this.X(x), this.Y(f(x))) : c.moveTo(this.X(x), this.Y(f(x))); }
    for (let i = n; i >= 0; i--) { const x = x0 + (xe - x0) * i / n; c.lineTo(this.X(x), this.Y(g(x))); }
    c.closePath(); c.fill(); c.restore();
  }

  // x축 위는 pos, 아래는 neg 색으로 채움
  areaSigned(c, f, x0, x1, o = {}) {
    const oy = this.Y(0);
    c.save(); c.beginPath(); c.rect(0, 0, W, oy); c.clip();
    this.area(c, f, null, x0, x1, { ...o, color: o.pos ?? 'rgba(167,139,250,0.5)' }); c.restore();
    c.save(); c.beginPath(); c.rect(0, oy, W, H); c.clip();
    this.area(c, f, null, x0, x1, { ...o, color: o.neg ?? 'rgba(94,224,176,0.5)' }); c.restore();
  }

  dot(c, x, y, o = {}) {
    c.save(); c.globalAlpha = o.a ?? 1; c.fillStyle = o.color ?? C.yellow;
    c.shadowColor = o.color ?? C.yellow; c.shadowBlur = 16;
    c.beginPath(); c.arc(this.X(x), this.Y(y), o.r ?? 12, 0, Math.PI * 2); c.fill(); c.restore();
  }

  seg(c, x0, y0, x1, y1, o = {}) {
    c.save(); c.globalAlpha = o.a ?? 1; c.strokeStyle = o.color ?? C.dim; c.lineWidth = o.width ?? 3;
    if (o.dash) c.setLineDash(o.dash);
    c.beginPath(); c.moveTo(this.X(x0), this.Y(y0)); c.lineTo(this.X(x1), this.Y(y1)); c.stroke(); c.restore();
  }

  label(c, s, x, y, o = {}) { ctext(c, s, this.X(x) + (o.dx ?? 0), this.Y(y) + (o.dy ?? 0), o); }
}

// ---------- 프레임 렌더 ----------
function setTime(t) {
  ctx.clearRect(0, 0, W, H);
  drawBackground(t);
  const ds = T.draws.filter((d) => t >= d.t0 && t <= d.t1).sort((p, q) => p.z - q.z);
  for (const d of ds) {
    const a = Math.min(ease.out(clamp((t - d.t0) / d.din)), ease.out(clamp((d.t1 - t) / d.dout)));
    ctx.save(); d.fn(ctx, a, t - d.t0, t); ctx.restore();
  }
  drawProgress(t);
  for (const it of T.items) applyItem(it, t);
}

async function boot(build) {
  await Promise.all([
    document.fonts.load('600 40px "Pretendard Variable"'), document.fonts.load('800 40px "Pretendard Variable"'),
    document.fonts.load('italic 40px KaTeX_Math'), document.fonts.load('40px KaTeX_Main'),
    document.fonts.load('40px KaTeX_Size2'), document.fonts.load('40px KaTeX_Size1'),
    document.fonts.load('40px "Noto Color Emoji"'),
  ]);
  build();
  T.cues.sort((a, b) => a.t - b.t);
  await document.fonts.ready;
  setTime(0);
  window.READY = true;
  // 브라우저로 직접 열었을 때 미리보기 재생
  if (!navigator.webdriver) {
    const st = performance.now();
    const loop = () => { setTime(((performance.now() - st) / 1000) % T.dur); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
}
