// Ⅲ. 적분 전체 정리 — 가로 16:9 통합본 (오프닝 → CH.0~4 → 개념 지도)
// 화면 배치: 왼쪽(약 x 90~910)은 그래프·그림, 오른쪽(RX 중심)은 수식·설명, 아래는 자막.
const RX = 1420;
const CH = [];

function chapter(n, title, sub) {
  CH.push({ t: T.cursor, n });
  scene(3.4, (s, e) => {
    item(`<span class="chip" style="font-size:42px;padding:14px 40px">CH.${n}</span>`, { y: 380, t0: s + 0.1, t1: e, anim: 'pop', sfx: 'pop' });
    item(title, { y: 520, size: 116, weight: 900, t0: s + 0.3, t1: e, anim: 'pop' });
    item(sub, { y: 680, size: 44, color: C.dim, t0: s + 0.7, t1: e });
    draw(s, e, (c, a, lt) => {
      const p = prog(lt, 0.6, 0.8, ease.out);
      c.globalAlpha = a; c.fillStyle = C.pink;
      c.beginPath(); c.roundRect(W / 2 - 280 * p, 600, 560 * p, 12, 6); c.fill();
      c.strokeStyle = 'rgba(255,107,139,0.35)'; c.lineWidth = 4;
      for (let k = 0; k < 3; k++) {
        const q = clamp((lt - k * 0.35) / 2.4);
        c.globalAlpha = a * (1 - q) * 0.8;
        c.beginPath(); c.arc(W / 2, 520, 220 + 600 * ease.out(q), 0, Math.PI * 2); c.stroke();
      }
    });
  });
  return T.cursor;
}

function hdr(n, title, t0, t1) {
  item(`<span class="chip" style="font-size:28px">CH.${n}</span>&nbsp; ${title}`, { x: 60, y: 62, ax: 0, size: 36, weight: 800, t0, t1, anim: 'left', z: 40 });
  item('미적분Ⅰ · Ⅲ. 적분', { x: W - 60, y: 62, ax: 1, size: 28, weight: 700, color: C.dim, t0, t1, anim: 'right', z: 40 });
}

const nameTag = (html, t0, t1) => item(html, { x: RX, y: 210, size: 38, weight: 800, cls: 'card pk', t0, t1, anim: 'pop', sfx: 'pop' });
const plotL = (o) => new Plot({ x: 90, y: 150, w: 820, h: 760, ...o });
const sans = (o = {}) => ({ family: '"Pretendard Variable"', italic: false, ...o });

function numberLine(c, a, y, x0, x1, v0, v1, ticks, unit = '') {
  const X = (v) => lerp(x0, x1, (v - v0) / (v1 - v0));
  c.globalAlpha = a;
  arrow(c, x0 - 20, y, x1 + 30, y, { color: C.axis, width: 4, head: 20 });
  ticks.forEach((v) => {
    c.strokeStyle = C.axis; c.lineWidth = 3; c.beginPath(); c.moveTo(X(v), y - 10); c.lineTo(X(v), y + 10); c.stroke();
    ctext(c, String(v).replace('-', '−'), X(v), y + 36, { size: 30, family: 'KaTeX_Main', italic: false, color: C.dim });
  });
  if (unit) ctext(c, unit, x1 + 40, y + 36, sans({ size: 28, color: C.dim }));
  return X;
}

boot(() => {
  // ───────── 오프닝 ─────────
  scene(7, (s, e) => {
    item('미적분Ⅰ', { y: 200, size: 40, weight: 700, color: C.dim, t0: s + 0.1, t1: e });
    item('Ⅲ. 적분', { y: 330, size: 150, weight: 900, t0: s + 0.3, t1: e, anim: 'pop', sfx: 'pop' });
    item('부정적분 · 정적분 · 넓이 · 속도와 거리 — 한 번에 정리', { y: 470, size: 44, color: C.dim, t0: s + 0.8, t1: e });
    const chs = ['이론적 배경', '부정적분', '정적분', '넓이', '속도와 거리'];
    chs.forEach((nm, i) => item(`<span style="color:#ff6b8b;font-weight:800">CH.${i}</span><br>${nm}`,
      { x: 960 + (i - 2) * 340, y: 660, size: 38, cls: 'card', t0: s + 1.4 + i * 0.35, t1: e, anim: 'pop', sfx: 'pop', style: { minWidth: '230px' } }));
    draw(s, e, (c, a, lt) => {
      c.strokeStyle = 'rgba(255,107,139,0.35)'; c.lineWidth = 4;
      for (let k = 0; k < 3; k++) {
        const q = clamp((lt - k * 0.4) / 3);
        c.globalAlpha = a * (1 - q) * 0.8;
        c.beginPath(); c.arc(W / 2, 330, 200 + 700 * ease.out(q), 0, Math.PI * 2); c.stroke();
      }
    });
    cap('적분 단원 전체를 한 번에 정리해 볼까요?', s + 2.8, e - 0.1);
  });

  // ───────── CH.0 단원의 이론적 배경 ─────────
  let h0 = chapter(0, '적분의 탄생', '넓이를 구하려는 2000년의 여정');

  scene(11, (s, e) => {
    nameTag('🏛️ 아르키메데스 <span class="ghost">· B.C. 287?~212</span>', s + 0.2, e);
    const P = plotL({ y: 170, h: 720, xr: [-1.25, 1.25], yr: [-0.2, 1.2] });
    const f = (x) => 1 - x * x;
    const cols = ['255,209,102', '255,107,139', '167,139,250', '90,209,255', '94,224,176', '255,159,90'];
    const starts = [1.4, 3.2, 4.4, 5.2, 5.8, 6.3];
    draw(s, e, (c, al, lt) => {
      P.seg(c, -1, 0, 1, 0, { color: C.axis, width: 4, a: al });
      starts.forEach((st, k) => {
        const a = al * prog(lt, st, 0.5);
        if (a <= 0) return;
        const n = 2 ** k, w = 2 / n;
        for (let i = 0; i < n; i++) {
          const p = -1 + i * w, q = p + w, m = (p + q) / 2;
          c.save(); P.clip(c); c.globalAlpha = a;
          c.beginPath(); c.moveTo(P.X(p), P.Y(f(p))); c.lineTo(P.X(m), P.Y(f(m))); c.lineTo(P.X(q), P.Y(f(q))); c.closePath();
          c.fillStyle = `rgba(${cols[k]},0.55)`; c.fill(); c.strokeStyle = `rgb(${cols[k]})`; c.lineWidth = 3; c.stroke(); c.restore();
        }
      });
      P.curve(c, f, -1.15, 1.15, { p: prog(lt, 0.3, 1.0), a: al });
      const la = al * prog(lt, 1.8, 0.4);
      P.label(c, 'A', -1, 0, { dx: -30, dy: 28, size: 42, a: la });
      P.label(c, 'B', 1, 0, { dx: 30, dy: 28, size: 42, a: la });
      P.label(c, 'C', 0, 1, { dy: -36, size: 42, a: la });
    });
    item('고대 이집트: 나일강 범람 뒤 땅 넓이를 다각형으로 어림', { x: RX, y: 330, size: 32, color: C.dim, t0: s + 0.8, t1: e });
    item('△ADC + △BCE $=\\dfrac{1}{4}$△ABC', { x: RX, y: 470, size: 46, t0: s + 3.6, t1: e, sfx: 'pop' });
    item('$S\\left(1+\\dfrac{1}{4}+\\dfrac{1}{4^2}+\\cdots\\right)=\\dfrac{4}{3}S$', { x: RX, y: 650, size: 54, cls: 'card hl', t0: s + 7.0, t1: e, anim: 'pop', sfx: 'pop' });
    cap('아르키메데스는 포물선 안을 <b>삼각형</b>으로 계속 채웠어요', s + 0.3, s + 3.5);
    cap('새로 생기는 두 삼각형의 합은 직전 삼각형의 <b>1/4</b>', s + 3.6, s + 6.9);
    cap('포물선 넓이 = 처음 삼각형 S의 <b>4/3</b> — 실진법', s + 7.0, e - 0.1);
  });

  scene(10, (s, e) => {
    nameTag('🔭 케플러 <span class="ghost">· 1571~1630</span>', s + 0.2, e);
    const cx = 500, cy = 540, A = 370, B = 270, ec = Math.sqrt(A * A - B * B) / A, fx = cx + A * ec;
    const pos = (M) => { let E = M; for (let i = 0; i < 8; i++) E = M + ec * Math.sin(E); return [cx + A * Math.cos(E), cy - B * Math.sin(E)]; };
    const sector = (c, M0, M1, col, a, p) => {
      const n = 12;
      for (let i = 0; i < n * p; i++) {
        const [x0, y0] = pos(M0 + (M1 - M0) * i / n), [x1, y1] = pos(M0 + (M1 - M0) * (i + 1) / n);
        c.globalAlpha = a; c.beginPath(); c.moveTo(fx, cy); c.lineTo(x0, y0); c.lineTo(x1, y1); c.closePath();
        c.fillStyle = i % 2 ? `rgba(${col},0.55)` : `rgba(${col},0.35)`; c.fill();
        c.strokeStyle = `rgba(${col},0.9)`; c.lineWidth = 1.5; c.stroke();
      }
    };
    draw(s, e, (c, al, lt) => {
      c.globalAlpha = al; c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 3; c.setLineDash([12, 10]);
      c.beginPath(); c.ellipse(cx, cy, A, B, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      sector(c, -0.45, 0.45, '255,107,139', al, prog(lt, 2.0, 1.4, ease.lin));
      sector(c, Math.PI - 0.45, Math.PI + 0.45, '90,209,255', al, prog(lt, 3.6, 1.4, ease.lin));
      c.globalAlpha = al; c.fillStyle = C.yellow; c.shadowColor = C.orange; c.shadowBlur = 40;
      c.beginPath(); c.arc(fx, cy, 32, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
      const [px, py] = pos(lt * 1.1);
      c.fillStyle = C.cyan; c.shadowColor = C.cyan; c.shadowBlur = 20;
      c.beginPath(); c.arc(px, py, 17, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
      ctext(c, '태양', fx, cy + 58, sans({ size: 30, color: C.yellow }));
    });
    item('같은 시간 동안 쓸고 간 넓이는 <b>같다</b>', { x: RX, y: 470, size: 42, t0: s + 5.0, t1: e, sfx: 'pop' });
    item('넓이 = 아주 가는 <b>삼각형 조각</b>들의 합', { x: RX, y: 640, size: 46, cls: 'card hl', t0: s + 6.4, t1: e, anim: 'pop', sfx: 'pop' });
    cap('케플러(1615): 행성이 쓸고 간 <b>넓이</b>는 얼마?', s + 0.3, s + 3.5);
    cap('부채꼴을 가느다란 <b>삼각형</b>으로 잘라 더했죠', s + 3.6, s + 6.3);
    cap('조각이 작을수록 참값에 가까워진다 → <b>극한</b>의 싹!', s + 6.4, e - 0.1);
  });

  scene(10, (s, e) => {
    nameTag('📐 카발리에리 <span class="ghost">· 1598~1647</span>', s + 0.2, e);
    const N = 26, top = 200, hgt = 640, sh = hgt / N, wid = 260, hl = 17;
    draw(s, e, (c, al, lt) => {
      const p = keyed(lt, [[2.0, 0], [3.8, 1], [5.6, 1], [6.4, 0.4], [7.6, 1]]);
      [[110, 0], [520, 1]].forEach(([x0, bend]) => {
        for (let i = 0; i < N; i++) {
          const off = bend * p * 100 * Math.sin(Math.PI * 2 * (i + 0.5) / N);
          c.globalAlpha = al * prog(lt, 0.4 + i * 0.04, 0.3);
          c.fillStyle = i % 2 ? 'rgba(167,139,250,0.75)' : 'rgba(167,139,250,0.5)';
          c.fillRect(x0 + 40 + off, top + i * sh, wid, sh - 2);
          if (i === hl && lt > 4.0) {
            c.globalAlpha = al * prog(lt, 4.0, 0.4);
            c.strokeStyle = C.yellow; c.lineWidth = 5; c.strokeRect(x0 + 40 + off, top + i * sh, wid, sh - 2);
          }
        }
      });
      c.globalAlpha = al * prog(lt, 4.2, 0.4);
      arrow(c, 420, top + hl * sh + sh / 2, 545, top + hl * sh + sh / 2, { color: C.yellow, width: 5 });
      ctext(c, '같은 길이', 482, top + hl * sh - 28, sans({ size: 32, color: C.yellow }));
    });
    item('➡ 넓이도 <b>같다!</b>', { x: RX, y: 470, size: 54, weight: 800, t0: s + 4.6, t1: e, anim: 'pop', sfx: 'pop' });
    item('입체 = 두께 없는 <b>면</b>의 모임 → 부피', { x: RX, y: 640, size: 42, cls: 'card', t0: s + 6.2, t1: e, sfx: 'pop' });
    cap('도형을 폭이 없는 <b>선(단면)</b>들의 모임으로 봤어요', s + 0.3, s + 4.0);
    cap('선을 옆으로 밀어도 길이가 같으면 넓이는 그대로', s + 4.1, s + 6.1);
    cap('‘불가분량의 방법’ — 넓이·부피 계산에 쓰였죠', s + 6.2, e - 0.1);
  });

  scene(13, (s, e) => {
    const mid = s + 5.6;
    // 뉴턴: 넓이의 변화율 = 높이
    nameTag('🍎 뉴턴 <span class="ghost">· 1642~1727</span>', s + 0.2, mid);
    const P = plotL({ y: 170, h: 720, xr: [-0.4, 5.4], yr: [-0.6, 4.2] });
    const f = (t) => 1.6 + 0.5 * Math.sin(1.3 * t) + 0.25 * t;
    draw(s, mid, (c, al, lt) => {
      const x = keyed(lt, [[0.8, 1.2], [3.6, 4.2], [5, 3.2]]);
      P.axes(c, al, { xl: 't', ticks: [[0.6, 'a'], [x, 'x']] });
      P.area(c, f, null, 0.6, x, { a: al, color: 'rgba(167,139,250,0.5)' });
      P.curve(c, f, -0.4, 5.4, { a: al });
      P.seg(c, x, 0, x, f(x), { a: al, color: C.yellow, width: 7 });
      P.label(c, 'f(x)', x + 0.15, f(x) / 2, { size: 40, color: C.yellow, align: 'left' });
      P.label(c, 'S(x)', (0.6 + x) / 2, 0.9, { size: 48, a: al * clamp(x - 1.0) });
    });
    item('곡선 아래 넓이 $S(x)$의 <b>변화율</b>은', { x: RX, y: 340, size: 42, t0: s + 0.8, t1: mid });
    item('$\\dfrac{dS(x)}{dx}=f(x)$', { x: RX, y: 500, size: 70, cls: 'card hl', t0: s + 1.6, t1: mid, anim: 'pop', sfx: 'pop' });
    item('그 점에서의 높이(세로 길이)!', { x: RX, y: 650, size: 40, t0: s + 2.4, t1: mid });
    item('예) $y=ax^{\\frac{m}{n}}$ 아래 넓이 $\\;S(x)=\\dfrac{n}{m+n}\\,ax^{\\frac{m+n}{n}}$', { x: RX, y: 790, size: 34, color: C.dim, t0: s + 3.2, t1: mid });
    // 라이프니츠: S → ∫
    nameTag('✒️ 라이프니츠 <span class="ghost">· 1646~1716</span>', mid + 0.1, e);
    draw(mid + 0.3, e, (c, al, lt) => {
      const p = prog(lt, 1.0, 1.4), q = prog(lt, 2.1, 0.8);
      c.save(); c.translate(500, 500);
      c.globalAlpha = al * (1 - q);
      c.scale(lerp(1, 0.55, p), lerp(1, 1.7, p)); c.transform(1, 0, -0.25 * p, 1, 0, 0);
      ctext(c, 'S', 0, 0, { family: 'KaTeX_Main', italic: false, size: 260, color: C.pink });
      c.restore();
      c.globalAlpha = al * q;
      ctext(c, '∫', 500, 500, { family: 'KaTeX_Size2', italic: false, size: 215, color: C.pink, shadow: true });
      c.globalAlpha = al * (1 - p);
      ctext(c, 'Summa (합)', 500, 760, sans({ size: 46, color: C.dim }));
    });
    item('합(Summa)의 S를 길게 늘인 기호 <b>∫</b> <span class="ghost">(1686년 논문)</span>', { x: RX, y: 450, size: 38, t0: mid + 3.0, t1: e, sfx: 'pop' });
    item('미분 ⇄ 적분은 <b>역연산</b> — 미적분의 기본정리', { x: RX, y: 620, size: 40, cls: 'card hl', t0: mid + 4.4, t1: e, anim: 'pop', sfx: 'pop' });
    cap('뉴턴: 넓이의 변화율 = 높이 → 넓이 문제는 <b>부정적분</b> 문제', s + 0.3, mid - 0.1);
    cap('라이프니츠: 오늘날 쓰는 적분 기호 ∫ 를 만들었어요', mid, mid + 4.3);
    cap('두 천재는 <b>우선권 논쟁</b>까지 벌였답니다', mid + 4.4, e - 0.1);
  });

  scene(11, (s, e) => {
    nameTag('📏 리만 <span class="ghost">· 1826~1866</span>', s + 0.2, e);
    const P = plotL({ y: 170, h: 720, xr: [-0.3, 3.4], yr: [-0.4, 3.6] });
    const f = (x) => 0.3 * x * x + 0.5;
    const nOf = (lt) => (lt < 3.0 ? 4 : lt < 4.8 ? 8 : lt < 6.6 ? 16 : 48);
    const sums = (n) => { const h = 3 / n; let lo = 0, up = 0; for (let i = 0; i < n; i++) { lo += f(i * h) * h; up += f((i + 1) * h) * h; } return [lo, up]; };
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { ticks: [[3, '3']] });
      const n = nOf(lt), h = 3 / n;
      c.save(); c.globalAlpha = al * prog(lt, 1.2, 0.5);
      for (let i = 0; i < n; i++) {
        const x0 = P.X(i * h), wpx = P.X((i + 1) * h) - x0, yu = P.Y(f((i + 1) * h)), yl = P.Y(f(i * h)), y0 = P.Y(0);
        c.fillStyle = 'rgba(255,107,139,0.28)'; c.fillRect(x0, yu, wpx, y0 - yu);
        c.fillStyle = 'rgba(167,139,250,0.6)'; c.fillRect(x0, yl, wpx, y0 - yl);
        if (n <= 16) { c.strokeStyle = 'rgba(255,107,139,0.9)'; c.lineWidth = 2; c.strokeRect(x0, yu, wpx, y0 - yu); }
      }
      c.restore();
      P.curve(c, f, -0.3, 3.4, { p: prog(lt, 0.3, 1.0), a: al });
      ctext(c, `n = ${n}`, 260, 230, { size: 46, color: C.yellow, a: al });
    });
    item('', {
      x: RX, y: 450, size: 44, t0: s + 1.4, t1: e,
      upd: (it, lt) => {
        const [lo, up] = sums(nOf(lt + 1.4));
        it.el.innerHTML = rich(`<i class="p">하합 $${lo.toFixed(2)}$</i> &nbsp;≤&nbsp; 넓이 &nbsp;≤&nbsp; <em>상합 $${up.toFixed(2)}$</em>`);
      },
    });
    item('상합 = 하합이 되는 값<br>$\\displaystyle\\int_0^3 f(x)\\,dx = 4.2$', { x: RX, y: 640, size: 44, cls: 'card hl', t0: s + 7.4, t1: e, anim: 'pop', sfx: 'pop' });
    cap('리만(1854): 구간을 잘게 잘라 <b>직사각형</b>으로!', s + 0.3, s + 3.9);
    cap('조각을 늘릴수록 상합과 하합이 가까워져요', s + 4.0, s + 7.3);
    cap('둘이 일치하는 값이 정적분 — <b>리만 적분</b>', s + 7.4, e - 0.1);
  });
  hdr(0, '단원의 이론적 배경', h0, T.cursor);

  // ───────── CH.1 부정적분 ─────────
  h0 = chapter(1, '부정적분', '미분을 거꾸로 하면?');

  scene(9, (s, e) => {
    item('미분하면 <b>$2x$</b>가 되는 함수는?', { x: RX, y: 280, size: 54, weight: 800, t0: s + 0.2, t1: e, anim: 'pop', sfx: 'pop' });
    ['x^2', 'x^2+1', 'x^2-3'].forEach((r, i) => {
      const y = 330 + i * 180, t0 = s + 1.0 + i * 0.8;
      item(`$${r}$`, { x: 220, y, size: 60, cls: 'card', t0, t1: e, anim: 'left', sfx: 'pop', style: { minWidth: '240px' } });
      item('$2x$', { x: 700, y, size: 60, cls: 'card hl', t0: t0 + 0.45, t1: e, anim: 'right' });
      draw(t0, e, (c, a, lt) => {
        c.globalAlpha = a;
        const p = prog(lt, 0.1, 0.4, ease.out);
        if (p > 0) arrow(c, 390, y, 390 + 180 * p, y, { color: C.yellow, width: 6 });
        ctext(c, '미분', 480, y - 38, sans({ size: 32, color: C.yellow }));
      });
    });
    item('<em>모두 정답!</em> &nbsp;→ &nbsp;$x^2 + {\\color{#ff6b8b}C}$ 꼴', { x: RX, y: 520, size: 54, weight: 800, t0: s + 4.6, t1: e, anim: 'pop', sfx: 'pop' });
    item('상수는 미분하면 $0$이 되니까!', { x: RX, y: 640, size: 40, color: C.dim, t0: s + 5.2, t1: e });
    cap('미분해서 <b>2x</b>가 되는 함수를 찾아볼까요?', s + 0.3, s + 4.4);
    cap('답이 하나가 아니에요! 상수항은 미분하면 <b>0</b>이 되거든요', s + 4.5, e - 0.1);
  });

  scene(11, (s, e) => {
    const P = plotL({ xr: [-2.6, 2.6], yr: [-3.2, 6.6] });
    const Ck = (lt) => keyed(lt, [[0, 0], [2.2, 0], [3.6, 2], [5.4, -2], [7.0, 1], [8.2, 0]]);
    draw(s, e, (c, a, lt) => {
      P.axes(c, a, { ticks: [[1, '1']] });
      [-2, -1, 1, 2].forEach((k) => P.curve(c, (x) => x * x + k, -2.6, 2.6, { color: C.purple, width: 4, a: a * 0.35 * clamp((lt - 3.0) / 0.6), glow: false }));
      const cc = Ck(lt);
      P.curve(c, (x) => x * x + cc, -2.6, 2.6, { p: prog(lt, 0.2, 1.4), a });
      const ta = a * prog(lt, 1.4, 0.6);
      if (ta > 0) {
        const y1 = 1 + cc;
        P.curve(c, (x) => 2 * (x - 1) + y1, 0.1, 1.9, { color: C.yellow, width: 6, a: ta, glow: false });
        P.dot(c, 1, y1, { a: ta });
        P.seg(c, 1, 0, 1, y1, { dash: [10, 10], a: ta * 0.6 });
        P.label(c, '기울기 2', 1.95, 1.9 + y1, sans({ size: 34, color: C.yellow, align: 'left', dy: 10, a: ta }));
      }
      const sa = a * prog(lt, 2.0, 0.5);
      if (sa > 0) {
        c.globalAlpha = sa;
        const x0 = 1100, x1 = 1740, yy = 480;
        c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 8; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x0, yy); c.lineTo(x1, yy); c.stroke();
        const kx = lerp(x0, x1, (cc + 2.5) / 5);
        c.fillStyle = C.pink; c.shadowColor = C.pink; c.shadowBlur = 20;
        c.beginPath(); c.arc(kx, yy, 22, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
        ctext(c, `C = ${cc.toFixed(1)}`, RX, yy - 70, { size: 50, color: C.pink });
      }
    });
    item('$y = x^2 + {\\color{#ff6b8b}C}$', { x: RX, y: 260, size: 52, t0: s + 0.8, t1: e });
    item('$\\dfrac{d}{dx}\\left(x^2+{\\color{#ff6b8b}C}\\right)=2x$', { x: RX, y: 680, size: 52, cls: 'card', t0: s + 6.4, t1: e, anim: 'pop', sfx: 'pop' });
    cap('<em>C</em>만큼 위아래로 평행이동해도…', s + 0.3, s + 5.6);
    cap('접선의 기울기(도함수)는 그대로! 이 <em>C</em>가 바로 <b>적분상수</b>', s + 5.7, e - 0.1);
  });

  scene(10, (s, e) => {
    item('$F\'(x)=f(x)$ 일 때', { x: RX, y: 240, size: 44, color: C.dim, t0: s + 0.2, t1: e });
    item('$\\displaystyle\\int f(x)\\,dx = F(x) + {\\color{#ff6b8b}C}$', { x: RX, y: 380, size: 60, cls: 'card hl', t0: s + 0.7, t1: e, anim: 'pop', sfx: 'pop' });
    item('부정적분', { x: RX - 175, y: 515, size: 34, color: C.yellow, t0: s + 1.6, t1: e });
    item('적분상수', { x: RX + 215, y: 515, size: 34, color: C.pink, t0: s + 1.9, t1: e });
    const L = 230, R = 770, Y = 530;
    item('$F(x)+C$', { x: L, y: Y, size: 52, cls: 'card', t0: s + 2.6, t1: e, anim: 'pop' });
    item('$f(x)$', { x: R, y: Y, size: 52, cls: 'card', t0: s + 2.9, t1: e, anim: 'pop' });
    draw(s + 3.2, e, (c, a, lt) => {
      c.globalAlpha = a;
      curvedArrow(c, L + 40, Y - 80, 500, Y - 250, R - 40, Y - 80, prog(lt, 0, 0.9), { color: C.cyan });
      curvedArrow(c, R - 40, Y + 80, 500, Y + 250, L + 40, Y + 80, prog(lt, 1.0, 0.9), { color: C.pink });
      if (lt > 0.5) ctext(c, '미분', 500, Y - 205, sans({ size: 42, color: C.cyan }));
      if (lt > 1.5) ctext(c, '적분', 500, Y + 205, sans({ size: 42, color: C.pink }));
    });
    item('💡 $\\displaystyle\\int$ 은 합(<b>S</b>umma)의 S를 길게 늘인 기호', { x: RX, y: 700, size: 36, cls: 'card', t0: s + 6.0, t1: e, sfx: 'pop' });
    cap('미분의 <b>역연산</b>이 바로 부정적분!', s + 0.3, s + 3.6);
    cap('미분 ⇄ 적분은 서로 <b>거꾸로</b> 가는 관계예요', s + 3.7, s + 5.9);
    cap('∫f(x)dx 는 “f(x)를 적분한다”라고 읽어요', s + 6.0, e - 0.1);
  });

  scene(11, (s, e) => {
    item('거듭제곱의 부정적분', { x: 500, y: 200, size: 50, weight: 800, t0: s + 0.1, t1: e });
    ['\\displaystyle\\int x\\,dx = \\frac{1}{2}x^{2} + C', '\\displaystyle\\int x^{2}\\,dx = \\frac{1}{3}x^{3} + C', '\\displaystyle\\int x^{3}\\,dx = \\frac{1}{4}x^{4} + C']
      .forEach((r, i) => item(`$${r}$`, { x: 500, y: 340 + i * 150, size: 52, t0: s + 0.7 + i * 0.8, t1: e, anim: 'left', sfx: 'pop' }));
    item('지수 <b>+1</b> &nbsp;그리고 &nbsp;그 수로 <b>나누기</b>', { x: 500, y: 810, size: 44, cls: 'card', t0: s + 3.4, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle\\int x^{n}\\,dx = \\frac{1}{n+1}\\,x^{n+1} + C$', { x: RX, y: 380, size: 58, cls: 'card hl', t0: s + 5.2, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle\\int 1\\,dx = x + C$ &nbsp;<span class="ghost" style="font-size:32px">(n = 0일 때)</span>', { x: RX, y: 560, size: 46, t0: s + 6.6, t1: e });
    item('검산: $\\left(\\dfrac{1}{n+1}x^{n+1}\\right)\'=x^n$ ✓', { x: RX, y: 720, size: 42, color: C.dim, t0: s + 8.0, t1: e });
    cap('$x$의 거듭제곱은 <b>공식 하나</b>로 끝!', s + 0.3, s + 3.3);
    cap('지수에 1을 더하고, 그 수로 나눠요', s + 3.4, s + 7.9);
    cap('검산: 미분하면 다시 $x^n$ ✓', s + 8.0, e - 0.1);
  });

  scene(10, (s, e) => {
    item('$\\displaystyle\\int (x^{2} - 2x + 3)\\,dx$', { x: 500, y: 220, size: 58, cls: 'card', t0: s + 0.2, t1: e, anim: 'pop', sfx: 'pop' });
    [[180, '\\displaystyle\\int x^{2}dx', '\\frac{1}{3}x^{3}', C.cyan], [500, '\\displaystyle -2\\!\\int x\\,dx', '-x^{2}', C.purple], [820, '\\displaystyle 3\\!\\int 1\\,dx', '+\\,3x', C.green]]
      .forEach(([x, a, b, col], i) => {
        const t0 = s + 1.3 + i * 0.5;
        draw(t0, e, (c, al, lt) => { c.globalAlpha = al; const p = prog(lt, 0, 0.5); if (p > 0) arrow(c, 500, 290, lerp(500, x, p), lerp(290, 380, p), { color: col, width: 5 }); });
        item(`$${a}$`, { x, y: 450, size: 40, t0: t0 + 0.3, t1: e, color: col, sfx: 'pop' });
        draw(t0 + 2.0, e, (c, al, lt) => { c.globalAlpha = al; const p = prog(lt, 0, 0.4); if (p > 0) arrow(c, x, 520, x, 520 + 70 * p, { color: col, width: 5 }); });
        item(`$${b}$`, { x, y: 660, size: 52, t0: t0 + 2.3, t1: e, color: col, anim: 'pop' });
      });
    item('$= \\dfrac{1}{3}x^{3} - x^{2} + 3x + {\\color{#ff6b8b}C}$', { x: RX, y: 400, size: 56, cls: 'card hl', t0: s + 5.2, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\int kf(x)\\,dx = k\\!\\int f(x)\\,dx$<br>$\\int\\{f(x)\\pm g(x)\\}dx = \\int f(x)dx \\pm \\int g(x)dx$', { x: RX, y: 630, size: 36, color: C.dim, t0: s + 6.4, t1: e });
    cap('실수배·합·차는 <b>항별로 따로따로</b> 적분!', s + 0.3, s + 5.1);
    cap('적분상수 <em>C</em>는 마지막에 <b>하나로</b> 모아 써요', s + 5.2, e - 0.1);
  });
  hdr(1, '부정적분', h0, T.cursor);

  // ───────── CH.2 정적분 ─────────
  h0 = chapter(2, '정적분', '넓이로 만나는 적분');

  scene(9, (s, e) => {
    const P = plotL({ xr: [-0.6, 5.4], yr: [-0.8, 4.2] });
    const f = (x) => 2 + 0.9 * Math.sin(1.1 * x - 0.6) + 0.12 * x, a = 1, b = 4.5;
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { ticks: [[a, 'a'], [b, 'b']] });
      P.area(c, f, null, a, b, { p: prog(lt, 1.4, 2.0), a: al, color: 'rgba(167,139,250,0.5)' });
      P.curve(c, f, -0.6, 5.4, { p: prog(lt, 0.2, 1.2), a: al });
      P.seg(c, a, 0, a, f(a), { a: al * prog(lt, 1.2, 0.4), dash: [10, 10] });
      P.seg(c, b, 0, b, f(b), { a: al * prog(lt, 3.2, 0.4), dash: [10, 10] });
      P.label(c, 'S', 2.75, 1.1, { size: 80, a: al * prog(lt, 3.0, 0.5) });
      P.label(c, 'y = f(x)', 4.6, f(4.6) + 0.55, { size: 40, color: C.cyan, a: al });
    });
    item('$\\displaystyle\\int_{a}^{b} f(x)\\,dx = S$', { x: RX, y: 400, size: 70, cls: 'card hl', t0: s + 4.0, t1: e, anim: 'pop', sfx: 'pop' });
    item('$a$ : 아래끝 &nbsp;&nbsp; $b$ : 위끝', { x: RX, y: 560, size: 40, color: C.dim, t0: s + 4.8, t1: e });
    cap('곡선 $y=f(x)$와 $x$축 사이의 넓이 $S$', s + 0.3, s + 3.9);
    cap('이 넓이를 <b>a에서 b까지의 정적분</b>이라고 해요', s + 4.0, e - 0.1);
  });

  scene(11, (s, e) => {
    const P = plotL({ xr: [-3, 2.2], yr: [-1.8, 3.2] });
    const f = (x) => x + 1;
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { ticks: [[-2, '−2'], [-1, '−1'], [1, '1']], yticks: [[2, '2']] });
      P.area(c, () => 0, f, -2, -1, { p: prog(lt, 1.2, 1.0), a: al, color: 'rgba(94,224,176,0.55)' });
      P.area(c, f, null, -1, 1, { p: prog(lt, 3.2, 1.2), a: al, color: 'rgba(167,139,250,0.55)' });
      P.curve(c, f, -3, 2.2, { p: prog(lt, 0.2, 1.0), a: al });
      P.seg(c, -2, 0, -2, -1, { a: al, dash: [10, 10] });
      P.seg(c, 1, 0, 1, 2, { a: al, dash: [10, 10] });
      P.label(c, 'y = x + 1', 1.2, 2.75, { size: 40, color: C.cyan, a: al });
    });
    item('<i class="g">$S_2=\\frac{1}{2}$</i>', { x: P.X(-2.15), y: P.Y(0.55), size: 46, t0: s + 2.2, t1: e, anim: 'pop', sfx: 'pop' });
    item('<i class="p">$S_1=2$</i>', { x: P.X(0.42), y: P.Y(0.37), size: 46, t0: s + 4.4, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle\\int_{-2}^{1}(x+1)\\,dx = {\\color{#a78bfa}S_1} - {\\color{#5ee0b0}S_2}$', { x: RX, y: 380, size: 52, t0: s + 5.6, t1: e, sfx: 'pop' });
    item('$= 2 - \\dfrac{1}{2} = \\dfrac{3}{2}$', { x: RX, y: 560, size: 58, cls: 'card hl', t0: s + 7.2, t1: e, anim: 'pop', sfx: 'pop' });
    cap('$x$축 <b>아래</b>쪽 넓이는 빼기(−)로 계산해요', s + 0.3, s + 5.5);
    cap('정적분 = (위쪽 넓이) − (아래쪽 넓이)', s + 5.6, e - 0.1);
  });

  scene(13, (s, e) => {
    const P = plotL({ xr: [-0.4, 5.4], yr: [-0.6, 4.2] });
    const f = (t) => 1.6 + 0.5 * Math.sin(1.3 * t) + 0.25 * t, a = 0.6;
    const X = (lt) => keyed(lt, [[0, 1.2], [1.3, 1.2], [3.0, 4.4], [4.3, 3.0]]);
    const DX = (lt) => keyed(lt, [[5.6, 0.9], [7.0, 0.9], [9.0, 0.12]]);
    draw(s, e, (c, al, lt) => {
      const x = X(lt);
      P.axes(c, al, { xl: 't', ticks: [[a, 'a'], [x, 'x']] });
      P.area(c, f, null, a, x, { a: al, color: 'rgba(167,139,250,0.5)' });
      P.curve(c, f, -0.4, 5.4, { a: al });
      P.seg(c, x, 0, x, f(x), { a: al, color: C.ink, width: 4 });
      P.label(c, 'S(x)', (a + x) / 2, 0.9, { size: 52, a: al * clamp(x - a - 0.4) });
      P.label(c, 'y = f(t)', 4.7, f(4.7) + 0.5, { size: 40, color: C.cyan, a: al });
      const sa = al * prog(lt, 4.8, 0.6);
      if (sa > 0) {
        const dx = DX(lt);
        c.globalAlpha = sa;
        P.area(c, f, null, x, x + dx, { color: 'rgba(255,209,102,0.85)' });
        c.globalAlpha = sa; c.strokeStyle = C.yellow; c.lineWidth = 4;
        c.strokeRect(P.X(x), P.Y(f(x)), P.X(x + dx) - P.X(x), P.Y(0) - P.Y(f(x)));
        P.label(c, 'ΔS', x + dx + 0.12, f(x) * 0.5, { size: 44, color: C.yellow, align: 'left' });
        P.label(c, 'Δx', x + dx / 2, -0.38, { size: 36, color: C.yellow });
      }
    });
    item('$S(x)=\\displaystyle\\int_{a}^{x} f(t)\\,dt$', { x: RX, y: 400, size: 60, t0: s + 0.5, t1: s + 5.0 });
    item('$\\Delta S \\approx f(x)\\times\\Delta x \\;\\Rightarrow\\; \\dfrac{\\Delta S}{\\Delta x}\\approx f(x)$', { x: RX, y: 400, size: 50, t0: s + 5.1, t1: s + 9.0, sfx: 'pop' });
    item('$\\dfrac{d}{dx}\\displaystyle\\int_{a}^{x} f(t)\\,dt = f(x)$', { x: RX, y: 400, size: 62, cls: 'card hl', t0: s + 9.1, t1: e, anim: 'pop', sfx: 'pop' });
    item('⭐ 미적분의 기본정리', { x: RX, y: 570, size: 44, weight: 800, color: C.yellow, t0: s + 9.6, t1: e });
    cap('$x$를 움직이면 넓이 $S(x)$도 따라 변해요', s + 0.3, s + 5.0);
    cap('늘어난 넓이 ≈ 높이 <b>f(x)</b> × 폭 <b>Δx</b>', s + 5.1, s + 9.0);
    cap('넓이를 미분하면 <b>원래 함수</b>! 적분은 미분의 역연산', s + 9.1, e - 0.1);
  });

  scene(11, (s, e) => {
    item('$S(x)$도 $f(x)$의 부정적분 → $S(x)=F(x)+C$', { x: 500, y: 250, size: 36, t0: s + 0.2, t1: e });
    item('$S(a)=0$ 이므로 $C=-F(a)$', { x: 500, y: 340, size: 36, color: C.dim, t0: s + 1.0, t1: e });
    item('$\\displaystyle\\int_{a}^{b} f(x)\\,dx = \\Big[F(x)\\Big]_{a}^{b} = F(b)-F(a)$', { x: 500, y: 500, size: 42, cls: 'card hl', t0: s + 2.0, t1: e, anim: 'pop', sfx: 'pop' });
    item('<b>예제</b> &nbsp;$\\displaystyle\\int_{2}^{4} (3x+2)\\,dx$', { x: RX, y: 250, size: 50, t0: s + 4.2, t1: e, anim: 'left', sfx: 'pop' });
    item('$=\\Big[\\tfrac{3}{2}x^{2}+2x\\Big]_{2}^{4}$', { x: RX, y: 390, size: 50, t0: s + 5.4, t1: e, anim: 'left' });
    item('$=({\\color{#5ad1ff}24+8})-({\\color{#ff6b8b}6+4})$', { x: RX, y: 520, size: 50, t0: s + 6.6, t1: e, anim: 'left' });
    item('$=22$', { x: RX, y: 670, size: 76, weight: 800, color: C.yellow, t0: s + 7.8, t1: e, anim: 'pop', sfx: 'pop' });
    cap('그래서 정적분은 <b>부정적분</b>으로 계산해요', s + 0.3, s + 4.1);
    cap('<b>F(위끝) − F(아래끝)</b>, 적분상수 C는 사라져요', s + 4.2, e - 0.1);
  });

  scene(13, (s, e) => {
    const P = plotL({ xr: [-0.4, 5.4], yr: [-0.6, 3.6] });
    const f = (x) => 1.5 + 0.6 * Math.sin(1.2 * x) + 0.2 * x, a = 0.6, cc = 2.6, b = 4.6, mid = s + 6.0;
    draw(s, mid, (c, al, lt) => {
      P.axes(c, al, { ticks: [[a, 'a'], [cc, 'c'], [b, 'b']] });
      P.area(c, f, null, a, cc, { p: prog(lt, 0.8, 1.0), a: al, color: 'rgba(167,139,250,0.55)' });
      P.area(c, f, null, cc, b, { p: prog(lt, 1.9, 1.0), a: al, color: 'rgba(90,209,255,0.45)' });
      P.curve(c, f, -0.4, 5.4, { a: al });
      P.seg(c, cc, 0, cc, f(cc), { a: al, color: C.ink, width: 4, dash: [10, 8] });
    });
    item('$\\displaystyle{\\color{#a78bfa}\\int_{a}^{c}} f\\,dx + {\\color{#5ad1ff}\\int_{c}^{b}} f\\,dx = \\int_{a}^{b} f\\,dx$', { x: RX, y: 380, size: 46, t0: s + 2.8, t1: mid, sfx: 'pop' });
    item('$\\displaystyle\\int_{a}^{a} f\\,dx = 0, \\quad \\int_{b}^{a} f\\,dx = -\\int_{a}^{b} f\\,dx$', { x: RX, y: 560, size: 38, cls: 'card', t0: s + 3.8, t1: mid, sfx: 'pop' });
    const L = new Plot({ x: 90, y: 280, w: 380, h: 440, xr: [-2.5, 2.5], yr: [-1.6, 2.6] });
    const R = new Plot({ x: 530, y: 280, w: 380, h: 440, xr: [-2.5, 2.5], yr: [-2.1, 2.1] });
    const ev = (x) => 0.4 * x * x + 0.25, od = (x) => 0.5 * x * x * x - 1.5 * x;
    draw(mid, e, (c, al, lt) => {
      L.axes(c, al, { grid: false, origin: false, ticks: [[-2, '−a'], [2, 'a']] });
      L.area(c, ev, null, 0, 2, { p: prog(lt, 0.6, 0.8), a: al, color: 'rgba(167,139,250,0.55)' });
      const m = prog(lt, 1.6, 1.0);
      if (m > 0) L.area(c, ev, null, -2 * m, 0, { a: al, color: 'rgba(167,139,250,0.55)' });
      L.curve(c, ev, -2.5, 2.5, { a: al, width: 6 });
      R.axes(c, al, { grid: false, origin: false, ticks: [[-2, '−a'], [2, 'a']] });
      R.areaSigned(c, od, -2, 2, { p: prog(lt, 2.8, 1.4), a: al, pos: 'rgba(167,139,250,0.55)', neg: 'rgba(94,224,176,0.55)' });
      R.curve(c, od, -2.5, 2.5, { a: al, width: 6, color: C.pink });
    });
    item('<b>y축 대칭</b> (우함수)', { x: 280, y: 220, size: 36, t0: mid + 0.2, t1: e });
    item('<b>원점 대칭</b> (기함수)', { x: 720, y: 220, size: 36, t0: mid + 0.2, t1: e });
    item('<b>y축 대칭</b> &nbsp;$\\displaystyle\\int_{-a}^{a} f\\,dx = 2\\!\\int_{0}^{a} f\\,dx$', { x: RX, y: 360, size: 40, cls: 'card', t0: mid + 2.4, t1: e, anim: 'pop', sfx: 'pop' });
    item('<b>원점 대칭</b> &nbsp;$\\displaystyle\\int_{-a}^{a} f\\,dx = 0$', { x: RX, y: 530, size: 40, cls: 'card', t0: mid + 4.0, t1: e, anim: 'pop', sfx: 'pop' });
    item('예) $\\displaystyle\\int_{-1}^{1}(x^5+5x^4)\\,dx = 0 + 2\\!\\int_0^1 5x^4dx = 2$', { x: RX, y: 700, size: 36, color: C.dim, t0: mid + 5.0, t1: e });
    cap('구간은 쪼개도, 이어 붙이면 그대로!', s + 0.3, mid - 0.2);
    cap('대칭이면 계산이 쉬워져요: <b>2배</b> 또는 <b>0</b>', mid, e - 0.1);
  });
  hdr(2, '정적분', h0, T.cursor);

  // ───────── CH.3 넓이 ─────────
  h0 = chapter(3, '넓이', '넓이는 언제나 양수!');

  scene(14, (s, e) => {
    const P = plotL({ xr: [-1.8, 3.8], yr: [-4.2, 4.4] });
    const f = (x) => (x + 1) * (x - 1) * (x - 3);
    draw(s, e, (c, al, lt) => {
      const m = prog(lt, 6.6, 1.6);
      const g = (x) => (x > 1 && x < 3 ? lerp(f(x), -f(x), m) : f(x));
      P.axes(c, al, { ticks: [[-1, '−1'], [1, '1'], [3, '3']] });
      P.area(c, f, null, -1, 1, { p: prog(lt, 1.4, 0.9), a: al, color: 'rgba(167,139,250,0.55)' });
      const lowCol = `rgba(${Math.round(lerp(94, 255, m))},${Math.round(lerp(224, 107, m))},${Math.round(lerp(176, 139, m))},0.55)`;
      if (m <= 0) P.area(c, () => 0, f, 1, 3, { p: prog(lt, 2.4, 0.9), a: al, color: lowCol });
      else {
        P.area(c, (x) => Math.max(g(x), 0), (x) => Math.min(g(x), 0), 1, 3, { a: al, color: lowCol });
        P.curve(c, f, 1, 3, { a: al * 0.35, dash: [12, 12], glow: false, width: 4 });
      }
      P.curve(c, f, -1.8, 3.8, { p: prog(lt, 0.2, 1.2), a: al });
      if (m > 0) P.curve(c, g, 1, 3, { a: al, color: C.pink });
      P.label(c, '4', 0, 1.4, { size: 62, family: 'KaTeX_Main', italic: false, a: al * prog(lt, 2.2, 0.4) });
      P.label(c, '4', 2, lerp(-1.4, 1.4, m), { size: 62, family: 'KaTeX_Main', italic: false, a: al * prog(lt, 3.2, 0.4) });
    });
    item('$y=(x+1)(x-1)(x-3)$', { x: RX, y: 230, size: 42, color: C.cyan, t0: s + 0.8, t1: e });
    item('$\\displaystyle\\int_{-1}^{3} f(x)\\,dx = 4 - 4 = 0$', { x: RX, y: 400, size: 52, t0: s + 3.6, t1: s + 7.8, sfx: 'pop' });
    item('<em>넓이가 0 ?!</em> 🤔', { x: RX, y: 540, size: 52, weight: 800, t0: s + 4.6, t1: s + 7.8, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle S=\\int_{-1}^{3} \\left|f(x)\\right|dx = 4 + 4 = 8$', { x: RX, y: 450, size: 54, cls: 'card hl', t0: s + 8.2, t1: e, anim: 'pop', sfx: 'pop' });
    cap('정적분 값이 0이면 넓이도 0일까요?', s + 0.3, s + 6.4);
    cap('$x$축 아래 부분은 <b>뒤집어서(절댓값)</b> 더해요', s + 6.5, s + 10.2);
    cap('<b>① 교점 → ② 구간 나누기 → ③ |f(x)| 적분</b>', s + 10.3, e - 0.1);
  });

  scene(12, (s, e) => {
    const P = plotL({ xr: [-5.4, 2.4], yr: [-10.5, 5], ystep: 2 });
    const f = (x) => -x * x - x + 3, g = (x) => 2 * x - 1;
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { ticks: [[-4, '−4'], [1, '1']] });
      const p = prog(lt, 2.8, 3.8), xs = lerp(-4, 1, p);
      if (p > 0) P.area(c, f, g, -4, xs, { a: al, color: 'rgba(255,107,139,0.42)' });
      P.curve(c, f, -5.4, 2.4, { p: prog(lt, 0.2, 1.0), a: al });
      P.curve(c, g, -5.4, 2.4, { p: prog(lt, 0.8, 1.0), a: al, color: C.pink });
      if (p > 0 && p < 1) {
        P.seg(c, xs, g(xs), xs, f(xs), { a: al, color: C.yellow, width: 8 });
        P.label(c, '위 − 아래', xs + 0.15, (f(xs) + g(xs)) / 2, sans({ size: 36, color: C.yellow, align: 'left' }));
      }
      const da = al * prog(lt, 1.9, 0.4);
      P.dot(c, -4, -9, { a: da }); P.dot(c, 1, 1, { a: da });
    });
    item('<span style="color:#5ad1ff">$y=-x^2-x+3$</span> &nbsp;&nbsp; <span style="color:#ff6b8b">$y=2x-1$</span>', { x: RX, y: 230, size: 40, t0: s + 1.0, t1: e });
    item('$\\displaystyle S=\\int_{-4}^{1}\\{(-x^2-x+3)-(2x-1)\\}\\,dx$', { x: RX, y: 400, size: 42, t0: s + 3.8, t1: e, sfx: 'pop' });
    item('$\\displaystyle =\\int_{-4}^{1}(-x^2-3x+4)\\,dx = \\frac{125}{6}$', { x: RX, y: 570, size: 46, cls: 'card hl', t0: s + 7.2, t1: e, anim: 'pop', sfx: 'pop' });
    cap('두 곡선의 <b>교점</b>이 적분 구간의 양 끝!', s + 0.3, s + 3.7);
    cap('(위 곡선) − (아래 곡선)을 차곡차곡 쌓으면 넓이', s + 3.8, e - 0.1);
  });

  scene(10, (s, e) => {
    const P = plotL({ xr: [-1.2, 4.4], yr: [-7.5, 4.5], ystep: 2 });
    const f = (x) => -x * x + 4 * x - 1, g = (x) => x - 1;
    const K = (lt) => keyed(lt, [[0, 0], [1.4, 0], [3.8, -5], [5.6, -5], [8.0, 0]]);
    draw(s, e, (c, al, lt) => {
      const k = K(lt), F = (x) => f(x) + k, G = (x) => g(x) + k;
      P.axes(c, al, { ticks: [[3, '3']] });
      P.area(c, F, G, 0, 3, { a: al, color: 'rgba(167,139,250,0.5)' });
      P.curve(c, F, -1.2, 4.4, { a: al });
      P.curve(c, G, -1.2, 4.4, { a: al, color: C.pink });
      P.label(c, 'S = 9/2', 1.5, (F(1.5) + G(1.5)) / 2, sans({ size: 44, shadow: true, a: al }));
      ctext(c, `k = ${k.toFixed(1)}`, RX, 300, { size: 56, color: C.yellow, a: al });
    });
    item('$\\displaystyle S=\\int_0^3\\{(f+k)-(g+k)\\}\\,dx=\\int_0^3 (f-g)\\,dx$', { x: RX, y: 500, size: 40, t0: s + 4.4, t1: e, sfx: 'pop' });
    cap('두 곡선을 함께 <b>x축 아래</b>로 내려도…', s + 0.3, s + 5.3);
    cap('넓이는 그대로! 위치와 상관없이 <b>위 − 아래</b>', s + 5.4, e - 0.1);
  });

  scene(11, (s, e) => {
    const P = plotL({ y: 200, h: 640, xr: [-3, 4], yr: [-2.6, 3] });
    const al_ = -1.5, be = 2.5, f = (x) => 0.5 * (x - al_) * (x - be);
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { grid: false, ticks: [[al_, 'α'], [be, 'β']] });
      P.area(c, () => 0, f, al_, be, { p: prog(lt, 1.0, 1.4), a: al, color: 'rgba(167,139,250,0.55)' });
      P.curve(c, f, -3, 4, { p: prog(lt, 0.2, 1.0), a: al });
      P.label(c, 'S', 0.5, -0.9, { size: 72, a: al * prog(lt, 2.2, 0.4) });
    });
    item('$y=a(x-\\alpha)(x-\\beta)$', { x: 500, y: 890, size: 40, color: C.cyan, t0: s + 0.8, t1: e });
    item('$S=\\dfrac{|a|}{6}(\\beta-\\alpha)^3$', { x: RX, y: 320, size: 66, cls: 'card hl', t0: s + 2.6, t1: e, anim: 'pop', sfx: 'pop' });
    item('앞의 예: $-x^2-3x+4=-(x+4)(x-1)$', { x: RX, y: 520, size: 40, t0: s + 6.0, t1: e });
    item('$\\dfrac{\\lvert -1\\rvert}{6}\\{1-(-4)\\}^3=\\dfrac{125}{6}$ ✅', { x: RX, y: 660, size: 48, t0: s + 7.2, t1: e, anim: 'pop', sfx: 'pop' });
    cap('포물선과 직선(x축) 사이 넓이 <b>꿀팁</b>!', s + 0.3, s + 5.9);
    cap('교점 α, β만 알면 끝! 앞의 <b>125/6</b>과 같죠?', s + 6.0, e - 0.1);
  });
  hdr(3, '정적분의 활용 ① 넓이', h0, T.cursor);

  // ───────── CH.4 속도와 거리 ─────────
  h0 = chapter(4, '속도와 거리', '위치의 변화량 vs 움직인 거리');

  scene(13, (s, e) => {
    const mid = s + 4.4;
    [[560, '위치 $x(t)$'], [960, '속도 $v(t)$'], [1360, '가속도 $a(t)$']].forEach(([x, h], i) =>
      item(h, { x, y: 460, size: 42, cls: 'card', t0: s + 0.3 + i * 0.4, t1: mid, anim: 'pop', sfx: 'pop' }));
    draw(s + 1.4, mid, (c, a, lt) => {
      c.globalAlpha = a;
      [[560, 960], [960, 1360]].forEach(([x0, x1], i) => {
        curvedArrow(c, x0 + 40, 395, (x0 + x1) / 2, 300, x1 - 40, 395, prog(lt, i * 0.3, 0.7), { color: C.cyan, width: 5 });
        curvedArrow(c, x1 - 40, 525, (x0 + x1) / 2, 620, x0 + 40, 525, prog(lt, 1.0 + i * 0.3, 0.7), { color: C.pink, width: 5 });
        if (lt > 0.5) ctext(c, '미분', (x0 + x1) / 2, 300, sans({ size: 36, color: C.cyan }));
        if (lt > 1.5) ctext(c, '적분', (x0 + x1) / 2, 630, sans({ size: 36, color: C.pink }));
      });
    });
    const tau = (lt) => 2 * prog(lt, 5.0, 4.0, ease.lin);
    const pos = (t) => 12 * t - 3 * t * t;
    const P = plotL({ y: 360, h: 560, xr: [-0.3, 2.6], yr: [-1.5, 13.5], ystep: 2 });
    draw(mid, e, (c, a, lt) => {
      const X = numberLine(c, a, 260, 140, 860, 0, 12, [0, 3, 6, 9, 12], '(m)');
      const t = tau(lt + (mid - s));
      c.globalAlpha = a; c.strokeStyle = C.yellow; c.lineWidth = 8; c.lineCap = 'round';
      c.beginPath(); c.moveTo(X(0), 260); c.lineTo(X(pos(t)), 260); c.stroke();
      P.axes(c, a, { xl: 't', yl: 'v', ticks: [[1, '1'], [2, '2']], yticks: [[12, '12']] });
      P.area(c, (x) => 12 - 6 * x, null, 0, Math.max(t, 1e-3), { a, color: 'rgba(255,209,102,0.45)' });
      P.curve(c, (x) => 12 - 6 * x, -0.3, 2.6, { a });
      P.label(c, 'v = 12 − 6t', 1.5, 7.5, { size: 38, color: C.cyan, align: 'left', a });
    });
    item('<span style="display:inline-block;transform:scaleX(-1)">🚌</span>', {
      x: 140, y: 195, size: 72, t0: mid + 0.2, t1: e, anim: 'pop', sfx: 'pop',
      upd: (it, lt) => { it.el.style.left = lerp(140, 860, pos(tau(lt + mid + 0.2 - s)) / 12) + 'px'; },
    });
    item('버스: $x(t)=12t-3t^2$, &nbsp;$v(t)=12-6t$', { x: RX, y: 300, size: 38, color: C.dim, t0: mid + 0.4, t1: e });
    item('', {
      x: RX, y: 470, size: 50, t0: mid + 0.6, t1: e, sfx: 'pop',
      upd: (it, lt) => {
        const t = tau(lt + mid + 0.6 - s);
        it.el.innerHTML = rich(`$\\displaystyle\\int_0^{${t.toFixed(2)}} v(t)\\,dt = {\\color{#ffd166}${pos(t).toFixed(1)}}$ m`);
      },
    });
    cap('위치를 미분하면 속도, 속도를 <b>적분</b>하면 위치!', s + 0.3, mid - 0.1);
    cap('$v$ 그래프 아래 넓이 = 버스의 위치 변화 <b>12m</b>', mid, e - 0.1);
  });

  scene(15, (s, e) => {
    const v = (t) => 3 * t * t - 12, x = (t) => t * t * t - 12 * t + 11;
    const tau = (lt) => keyed(lt, [[1.5, 1], [8.5, 4]], ease.lin);
    const P = plotL({ y: 380, h: 540, xr: [-0.2, 4.4], yr: [-12, 38], ystep: 6 });
    draw(s, e, (c, a, lt) => {
      const X = numberLine(c, a, 220, 110, 890, -8, 30, [-5, 0, 10, 20, 27]);
      const t = tau(lt);
      c.globalAlpha = a; c.lineCap = 'round'; c.lineWidth = 9;
      c.strokeStyle = C.green; c.beginPath(); c.moveTo(X(0), 295); c.lineTo(X(x(Math.min(t, 2))), 295); c.stroke();
      if (t > 2) { c.strokeStyle = C.purple; c.beginPath(); c.moveTo(X(-5), 325); c.lineTo(X(x(t)), 325); c.stroke(); }
      P.axes(c, a, { xl: 't', yl: 'v', ticks: [[1, '1'], [2, '2'], [4, '4']], yticks: [[36, '36']] });
      P.areaSigned(c, v, 1, Math.max(t, 1.0001), { a, pos: 'rgba(167,139,250,0.55)', neg: 'rgba(94,224,176,0.6)' });
      P.curve(c, v, -0.2, 4.4, { a });
      P.label(c, 'v = 3t² − 12', 2.3, 30, { size: 38, color: C.cyan, a });
      if (t >= 2) P.label(c, '5', 1.5, -2.6, { size: 46, family: 'KaTeX_Main', italic: false, color: C.green, a });
      if (t >= 4) P.label(c, '32', 3.4, 11, { size: 54, family: 'KaTeX_Main', italic: false, a });
    });
    item('🤖', { x: 110, y: 160, size: 64, t0: s + 0.6, t1: e, anim: 'pop', sfx: 'pop', upd: (it, lt) => { it.el.style.left = lerp(110, 890, (x(tau(lt + 0.6)) + 8) / 38) + 'px'; } });
    item('위치의 변화량 $=\\int_1^4 v\\,dt = -5+32 = {\\color{#ffd166}27}$', { x: RX, y: 400, size: 44, t0: s + 9.2, t1: e, sfx: 'pop' });
    item('움직인 거리 $=\\int_1^4 |v|\\,dt = 5+32 = {\\color{#ff6b8b}37}$', { x: RX, y: 560, size: 46, cls: 'card hl', t0: s + 11.2, t1: e, anim: 'pop', sfx: 'pop' });
    cap('점 P가 왼쪽으로 <i class="g">5</i>, 다시 오른쪽으로 <i class="p">32</i> 이동 &nbsp;($v=3t^2-12$, $1\\le t\\le4$)', s + 0.3, s + 9.0);
    cap('변화량은 <b>27</b>인데, 실제로 움직인 거리는 <em>37</em>!', s + 9.1, s + 12.6);
    cap('움직인 거리 = 속도의 <b>절댓값</b> |v(t)|를 적분', s + 12.7, e - 0.1);
  });

  scene(14, (s, e) => {
    const v = (t) => 20 - 10 * t, h = (t) => 20 * t - 5 * t * t;
    const tau = (lt) => keyed(lt, [[1.0, 0], [7.5, 3]], ease.lin);
    const Hy = (m) => 870 - m * 30;
    const P = new Plot({ x: 400, y: 170, w: 510, h: 720, xr: [-0.3, 3.4], yr: [-12, 22], ystep: 5 });
    draw(s, e, (c, a, lt) => {
      const t = tau(lt);
      c.globalAlpha = a; c.strokeStyle = C.axis; c.lineWidth = 4;
      c.beginPath(); c.moveTo(110, Hy(0)); c.lineTo(110, Hy(22)); c.stroke();
      [0, 5, 10, 15, 20].forEach((m) => {
        c.beginPath(); c.moveTo(100, Hy(m)); c.lineTo(120, Hy(m)); c.stroke();
        ctext(c, String(m), 85, Hy(m), { size: 28, family: 'KaTeX_Main', italic: false, color: C.dim, align: 'right' });
      });
      ctext(c, '(m)', 110, Hy(23.5), sans({ size: 26, color: C.dim }));
      c.fillStyle = 'rgba(255,255,255,0.15)'; c.fillRect(140, Hy(0), 200, 8);
      if (t >= 2) {
        c.setLineDash([10, 10]); c.strokeStyle = C.yellow; c.lineWidth = 3; c.beginPath(); c.moveTo(120, Hy(20)); c.lineTo(350, Hy(20)); c.stroke(); c.setLineDash([]);
        ctext(c, '최고점', 300, Hy(20) - 26, sans({ size: 28, color: C.yellow }));
      }
      for (let k = 1; k <= 8; k++) { const tt = t - k * 0.09; if (tt < 0) break; c.globalAlpha = a * 0.25 * (1 - k / 9); c.fillStyle = C.orange; c.beginPath(); c.arc(240, Hy(h(tt)) - 22, 22, 0, 7); c.fill(); }
      c.globalAlpha = a; c.fillStyle = C.orange; c.shadowColor = C.orange; c.shadowBlur = 24;
      c.beginPath(); c.arc(240, Hy(h(t)) - 22, 24, 0, 7); c.fill(); c.shadowBlur = 0;
      P.axes(c, a, { xl: 't', yl: 'v', ticks: [[1, '1'], [2, '2'], [3, '3']], yticks: [[20, '20']] });
      P.areaSigned(c, v, 0, Math.max(t, 1e-3), { a, pos: 'rgba(167,139,250,0.55)', neg: 'rgba(94,224,176,0.6)' });
      P.curve(c, v, -0.3, 3.4, { a });
      P.dot(c, t, v(t), { a, r: 11 });
      if (t >= 2) P.label(c, '20', 0.75, 6.5, { size: 52, family: 'KaTeX_Main', italic: false, a });
      if (t >= 3) P.label(c, '5', 2.62, -3.2, { size: 46, family: 'KaTeX_Main', italic: false, color: C.green, a });
      ctext(c, `t = ${t.toFixed(1)}초   v = ${v(t).toFixed(0)} m/s`, RX, 260, sans({ size: 40, color: C.yellow, a }));
    });
    item('최고 높이 $=\\int_0^2 (20-10t)\\,dt = 20$ m', { x: RX, y: 420, size: 44, t0: s + 8.0, t1: e, sfx: 'pop' });
    item('3초 동안 움직인 거리 $= 20 + 5 = {\\color{#ff6b8b}25}$ m', { x: RX, y: 580, size: 46, cls: 'card hl', t0: s + 9.8, t1: e, anim: 'pop', sfx: 'pop' });
    cap('위로 던진 공의 속도: $v(t)=20-10t$ (m/s)', s + 0.3, s + 4.8);
    cap('2초에 $v=0$ → <b>최고점 20m</b>, 그 뒤엔 내려와요', s + 4.9, s + 9.7);
    cap('3초 동안 움직인 거리 = 올라간 <i class="p">20</i> + 내려온 <i class="g">5</i>', s + 9.8, e - 0.1);
  });

  scene(9, (s, e) => {
    const P = plotL({ y: 170, h: 700, xr: [-0.3, 5.2], yr: [-3.2, 6] });
    const v = (t) => 0.6 * t * (t - 2) * (t - 4);
    draw(s, e, (c, a, lt) => {
      P.axes(c, a, { xl: 't', yl: 'v', ticks: [[2, 'a'], [4, 'b'], [4.7, 'c']] });
      P.areaSigned(c, v, 0, 4.7, { p: prog(lt, 0.8, 2.0, ease.lin), a, pos: 'rgba(167,139,250,0.55)', neg: 'rgba(94,224,176,0.6)' });
      P.curve(c, v, -0.3, 5.2, { a });
      P.seg(c, 4.7, 0, 4.7, v(4.7), { a, dash: [10, 8] });
      const la = a * prog(lt, 2.8, 0.5);
      P.label(c, 'S₁', 1, 0.8, { size: 50, a: la, family: 'KaTeX_Main' });
      P.label(c, 'S₂', 3, -0.85, { size: 50, a: la, family: 'KaTeX_Main' });
      P.label(c, 'S₃', 5.0, 1.2, { size: 44, a: la, family: 'KaTeX_Main' });
    });
    item('${\\color{#a78bfa}S_1} - {\\color{#5ee0b0}S_2} + {\\color{#a78bfa}S_3}$ = <b>위치의 변화량</b>', { x: RX, y: 400, size: 48, t0: s + 3.4, t1: e, sfx: 'pop' });
    item('${\\color{#a78bfa}S_1} + {\\color{#5ee0b0}S_2} + {\\color{#a78bfa}S_3}$ = <em>움직인 거리</em>', { x: RX, y: 560, size: 48, cls: 'card hl', t0: s + 5.0, t1: e, anim: 'pop', sfx: 'pop' });
    cap('속도 그래프 하나로 두 가지를 모두 읽을 수 있어요', s + 0.3, s + 5.0);
    cap('아래쪽 넓이를 <b>빼면</b> 변화량, <b>더하면</b> 거리!', s + 5.1, e - 0.1);
  });
  hdr(4, '정적분의 활용 ② 속도와 거리', h0, T.cursor);

  // ───────── 개념 지도 ─────────
  scene(20, (s, e) => {
    item('<b>🗺️ Ⅲ. 적분 — 한눈에 보기</b>', { y: 90, size: 52, weight: 800, t0: s + 0.1, t1: e, anim: 'pop', sfx: 'pop' });
    item('아르키메데스 → 케플러 → 카발리에리 → 뉴턴 · 라이프니츠 → 리만', { y: 180, size: 32, color: C.dim, t0: s + 0.6, t1: e });
    const nodes = {
      A: [300, 380, '<b>미분</b><br>$F\'(x)=f(x)$', s + 1.2, ''],
      B: [300, 740, '<b>부정적분</b><br>$\\int f(x)\\,dx=F(x)+C$', s + 2.0, ''],
      K: [900, 560, '<b>⭐ 미적분의 기본정리</b><br>$\\frac{d}{dx}\\int_a^x f(t)\\,dt=f(x)$', s + 4.2, 'hl'],
      D: [1500, 380, '<b>정적분</b><br>$\\int_a^b f(x)\\,dx=F(b)-F(a)$', s + 6.2, ''],
      E: [1290, 760, '<b>넓이</b><br>$\\int_a^b|f(x)-g(x)|\\,dx$', s + 8.4, ''],
      F: [1700, 760, '<b>속도와 거리</b><br>$\\int_a^b|v(t)|\\,dt$', s + 9.0, ''],
    };
    Object.values(nodes).forEach(([x, y, html, t0, cls]) => item(html, { x, y, size: 40, cls: `card ${cls}`, t0, t1: e, anim: 'pop', sfx: 'pop' }));
    draw(s + 2.6, e, (c, a, lt) => {
      c.globalAlpha = a;
      curvedArrow(c, 200, 460, 120, 560, 200, 660, prog(lt, 0, 0.7), { color: C.pink, width: 5 });
      curvedArrow(c, 400, 660, 480, 560, 400, 460, prog(lt, 0.5, 0.7), { color: C.cyan, width: 5 });
      if (lt > 0.4) ctext(c, '적분', 90, 560, sans({ size: 32, color: C.pink, align: 'right' }));
      if (lt > 0.9) ctext(c, '미분', 510, 560, sans({ size: 32, color: C.cyan, align: 'left' }));
      arrow(c, 500, 720, lerp(500, 690, prog(lt, 1.2, 0.6)), lerp(720, 630, prog(lt, 1.2, 0.6)), { color: C.yellow, width: 5 });
      if (lt > 3.2) arrow(c, 1110, 500, lerp(1110, 1300, prog(lt, 3.2, 0.6)), lerp(500, 440, prog(lt, 3.2, 0.6)), { color: C.yellow, width: 5 });
      if (lt > 5.4) {
        arrow(c, 1440, 460, lerp(1440, 1320, prog(lt, 5.4, 0.5)), lerp(460, 680, prog(lt, 5.4, 0.5)), { color: C.purple, width: 5 });
        arrow(c, 1560, 460, lerp(1560, 1670, prog(lt, 5.6, 0.5)), lerp(460, 680, prog(lt, 5.6, 0.5)), { color: C.purple, width: 5 });
      }
    });
    T.cues.push({ t: s + 14, type: 'chime' });
    cap('미분과 부정적분은 서로 <b>역연산</b>', s + 0.3, s + 4.1);
    cap('기본정리가 부정적분과 <b>정적분</b>을 이어 줘요', s + 4.2, s + 8.2);
    cap('정적분으로 <b>넓이</b>와 <b>움직인 거리</b>를 구해요', s + 8.3, s + 13.9);
    cap('🎉 <b>Ⅲ. 적분</b> 완주! 수고했어요', s + 14.0, e - 0.1);
  });

  // 진행 막대 위 챕터 표시
  draw(0, T.dur, (c) => {
    CH.forEach(({ t }) => { c.fillStyle = 'rgba(255,255,255,0.7)'; c.fillRect(W * t / T.dur - 2, 10, 4, 10); });
  }, { din: 0.01, dout: 0.01 });
});
