// EP.0 적분의 탄생 — 넓이를 구하려는 2000년의 여정 (단원의 이론적 배경)
boot(() => {
  intro(0, '적분의 탄생', '넓이를 구하려는 2000년의 여정');
  header(0, '단원의 이론적 배경', T.cursor);

  const nameTag = (html, t0, t1) => item(html, { y: 300, size: 40, weight: 800, cls: 'card pk', t0, t1, anim: 'pop', sfx: 'pop' });

  // 1) 아르키메데스의 실진법: 포물선 안을 삼각형으로 채우기
  scene(13, (s, e) => {
    nameTag('🏛️ 아르키메데스 <span class="ghost">· B.C. 287?~212</span>', s + 0.2, e);
    const P = new Plot({ x: 110, y: 420, w: 860, h: 700, xr: [-1.25, 1.25], yr: [-0.2, 1.2] });
    const f = (x) => 1 - x * x;
    const cols = ['255,209,102', '255,107,139', '167,139,250', '90,209,255', '94,224,176', '255,159,90'];
    const starts = [1.6, 3.6, 5.0, 6.0, 6.7, 7.2];
    const tri = (c, p, q, col, a) => {
      const m = (p + q) / 2;
      c.save(); P.clip(c); c.globalAlpha = a;
      c.beginPath(); c.moveTo(P.X(p), P.Y(f(p))); c.lineTo(P.X(m), P.Y(f(m))); c.lineTo(P.X(q), P.Y(f(q))); c.closePath();
      c.fillStyle = `rgba(${col},0.55)`; c.fill(); c.strokeStyle = `rgb(${col})`; c.lineWidth = 3; c.stroke(); c.restore();
    };
    draw(s, e, (c, al, lt) => {
      c.globalAlpha = al;
      P.seg(c, -1, 0, 1, 0, { color: C.axis, width: 4, a: al });
      starts.forEach((st, k) => {
        const a = al * prog(lt, st, 0.5);
        if (a <= 0) return;
        const n = 2 ** k, w = 2 / n;
        for (let i = 0; i < n; i++) tri(c, -1 + i * w, -1 + (i + 1) * w, cols[k], a);
      });
      P.curve(c, f, -1.15, 1.15, { p: prog(lt, 0.3, 1.2), a: al });
      const la = al * prog(lt, 2.0, 0.4);
      P.label(c, 'A', -1, 0, { dx: -30, dy: 28, size: 42, a: la });
      P.label(c, 'B', 1, 0, { dx: 30, dy: 28, size: 42, a: la });
      P.label(c, 'C', 0, 1, { dy: -36, size: 42, a: la });
    });
    item('△ADC + △BCE $=\\dfrac{1}{4}$△ABC', { y: 1210, size: 46, t0: s + 4.2, t1: e, sfx: 'pop' });
    item('$S\\left(1+\\dfrac{1}{4}+\\dfrac{1}{4^2}+\\cdots\\right)=\\dfrac{4}{3}S$', { y: 1360, size: 54, cls: 'card hl', t0: s + 8.2, t1: e, anim: 'pop', sfx: 'pop' });
    cap('고대 이집트에선 땅 넓이를 <b>다각형</b>으로 어림했어요', s + 0.3, s + 3.9);
    cap('아르키메데스는 포물선 안을 <b>삼각형</b>으로 계속 채웠죠', s + 4.0, s + 8.1);
    cap('포물선 넓이 = 처음 삼각형 S의 <b>4/3</b> — 실진법', s + 8.2, e - 0.1);
  });

  // 2) 케플러: 부채꼴을 가느다란 삼각형으로 잘라 더하기 (면적 속도 일정 법칙)
  scene(12, (s, e) => {
    nameTag('🔭 케플러 <span class="ghost">· 1571~1630</span>', s + 0.2, e);
    const cx = 540, cy = 760, A = 400, B = 290, ec = Math.sqrt(A * A - B * B) / A, fx = cx + A * ec;
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
      sector(c, -0.45, 0.45, '255,107,139', al, prog(lt, 2.6, 1.6, ease.lin));
      sector(c, Math.PI - 0.45, Math.PI + 0.45, '90,209,255', al, prog(lt, 4.4, 1.6, ease.lin));
      // 태양
      c.globalAlpha = al; c.fillStyle = C.yellow; c.shadowColor = C.orange; c.shadowBlur = 40;
      c.beginPath(); c.arc(fx, cy, 34, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
      // 행성 (면적 속도 일정 → 평균 근점 이각이 시간에 비례)
      const [px, py] = pos(lt * 1.1);
      c.fillStyle = C.cyan; c.shadowColor = C.cyan; c.shadowBlur = 20;
      c.beginPath(); c.arc(px, py, 18, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
      ctext(c, '태양', fx, cy + 62, { family: '"Pretendard Variable"', italic: false, size: 32, color: C.yellow });
    });
    item('같은 시간 동안 쓸고 간 넓이는 <b>같다</b>', { y: 1140, size: 44, t0: s + 6.0, t1: e, sfx: 'pop' });
    item('넓이 = 아주 가는 <b>삼각형 조각</b>들의 합', { y: 1290, size: 48, cls: 'card hl', t0: s + 7.6, t1: e, anim: 'pop', sfx: 'pop' });
    cap('케플러(1615): 행성이 쓸고 간 <b>넓이</b>는 얼마?', s + 0.3, s + 4.3);
    cap('부채꼴을 가느다란 <b>삼각형</b>으로 잘라 더했죠', s + 4.4, s + 7.5);
    cap('조각이 작을수록 참값에 가까워진다 → <b>극한</b>의 싹!', s + 7.6, e - 0.1);
  });

  // 3) 카발리에리: 불가분량의 방법 — 도형은 선(단면)의 모임
  scene(11, (s, e) => {
    nameTag('📐 카발리에리 <span class="ghost">· 1598~1647</span>', s + 0.2, e);
    const N = 26, top = 440, hgt = 640, sh = hgt / N, wid = 300, hl = 17;
    draw(s, e, (c, al, lt) => {
      const p = keyed(lt, [[2.2, 0], [4.2, 1], [6.2, 1], [7.2, 0.4], [8.6, 1]]);
      [[110, 0], [640, 1]].forEach(([x0, bend]) => {
        for (let i = 0; i < N; i++) {
          const off = bend * p * 110 * Math.sin(Math.PI * 2 * (i + 0.5) / N);
          c.globalAlpha = al * prog(lt, 0.4 + i * 0.04, 0.3);
          c.fillStyle = i % 2 ? 'rgba(167,139,250,0.75)' : 'rgba(167,139,250,0.5)';
          c.fillRect(x0 + 40 + off, top + i * sh, wid, sh - 2);
          if (i === hl && lt > 4.4) {
            c.globalAlpha = al * prog(lt, 4.4, 0.4);
            c.strokeStyle = C.yellow; c.lineWidth = 5; c.strokeRect(x0 + 40 + off, top + i * sh, wid, sh - 2);
          }
        }
      });
      c.globalAlpha = al * prog(lt, 4.6, 0.4);
      arrow(c, 470, top + hl * sh + sh / 2, 630, top + hl * sh + sh / 2, { color: C.yellow, width: 5 });
      ctext(c, '같은 길이', 550, top + hl * sh - 30, { family: '"Pretendard Variable"', italic: false, size: 34, color: C.yellow });
    });
    item('➡ 넓이도 <b>같다!</b>', { y: 1170, size: 54, weight: 800, t0: s + 5.2, t1: e, anim: 'pop', sfx: 'pop' });
    item('입체 = 두께 없는 <b>면</b>의 모임 → 부피', { y: 1300, size: 44, cls: 'card', t0: s + 7.0, t1: e, sfx: 'pop' });
    cap('도형을 폭이 없는 <b>선(단면)</b>들의 모임으로 봤어요', s + 0.3, s + 4.3);
    cap('선을 옆으로 밀어도 길이가 같으면 넓이는 그대로', s + 4.4, s + 6.9);
    cap('‘불가분량의 방법’ — 넓이·부피 계산에 쓰였죠', s + 7.0, e - 0.1);
  });

  // 4) 뉴턴과 라이프니츠: 미적분의 기본정리, ∫ 기호
  scene(14, (s, e) => {
    const mid = s + 6.2;
    nameTag('🍎 뉴턴 <span class="ghost">· 1642~1727</span>', s + 0.2, mid);
    item('곡선 아래 넓이 $S(x)$의 <b>변화율</b>은', { y: 520, size: 46, t0: s + 0.8, t1: mid });
    item('$\\dfrac{dS(x)}{dx}=f(x)$', { y: 680, size: 84, cls: 'card hl', t0: s + 1.6, t1: mid, anim: 'pop', sfx: 'pop' });
    item('그 점에서의 높이(세로 길이)!', { y: 850, size: 46, t0: s + 2.4, t1: mid });
    item('예) $y=ax^{\\frac{m}{n}}$ 아래 넓이 $\\;S(x)=\\dfrac{n}{m+n}\\,ax^{\\frac{m+n}{n}}$', { y: 1040, size: 42, color: C.dim, t0: s + 3.4, t1: mid });
    nameTag('✒️ 라이프니츠 <span class="ghost">· 1646~1716</span>', mid + 0.1, e);
    draw(mid + 0.3, e, (c, al, lt) => {
      const p = prog(lt, 1.2, 1.6), q = prog(lt, 2.4, 0.8);
      c.save(); c.translate(540, 700);
      c.globalAlpha = al * (1 - q);
      c.scale(lerp(1, 0.55, p), lerp(1, 1.7, p)); c.transform(1, 0, -0.25 * p, 1, 0, 0);
      ctext(c, 'S', 0, 0, { family: 'KaTeX_Main', italic: false, size: 280, color: C.pink });
      c.restore();
      c.globalAlpha = al * q;
      ctext(c, '∫', 540, 700, { family: 'KaTeX_Size2', italic: false, size: 230, color: C.pink, shadow: true });
      c.globalAlpha = al * (1 - p);
      ctext(c, 'Summa (합)', 540, 960, { family: '"Pretendard Variable"', italic: false, size: 48, color: C.dim });
    });
    item('합(Summa)의 S를 길게 늘인 기호 <b>∫</b> <span class="ghost">(1686년 논문)</span>', { y: 1100, size: 44, t0: mid + 3.2, t1: e, sfx: 'pop' });
    item('미분 ⇄ 적분은 <b>역연산</b> — 미적분의 기본정리', { y: 1250, size: 46, cls: 'card hl', t0: mid + 4.6, t1: e, anim: 'pop', sfx: 'pop' });
    cap('뉴턴: 넓이 문제 = <b>부정적분</b> 구하는 문제', s + 0.3, mid - 0.1);
    cap('라이프니츠: 오늘날 쓰는 적분 기호 ∫ 를 만들었어요', mid, mid + 4.5);
    cap('두 천재는 <b>우선권 논쟁</b>까지 벌였답니다', mid + 4.6, e - 0.1);
  });

  // 5) 리만: 상합과 하합이 일치하는 값 = 정적분
  scene(13, (s, e) => {
    nameTag('📏 리만 <span class="ghost">· 1826~1866</span>', s + 0.2, e);
    const P = new Plot({ x: 110, y: 400, w: 860, h: 700, xr: [-0.3, 3.4], yr: [-0.4, 3.6] });
    const f = (x) => 0.3 * x * x + 0.5;
    const nOf = (lt) => (lt < 3.4 ? 4 : lt < 5.6 ? 8 : lt < 7.6 ? 16 : 48);
    const sums = (n) => { const h = 3 / n; let lo = 0, up = 0; for (let i = 0; i < n; i++) { lo += f(i * h) * h; up += f((i + 1) * h) * h; } return [lo, up]; };
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { ticks: [[3, '3']] });
      const n = nOf(lt), h = 3 / n, ra = al * prog(lt, 1.4, 0.5);
      c.save(); c.globalAlpha = ra;
      for (let i = 0; i < n; i++) {
        const x0 = P.X(i * h), x1 = P.X((i + 1) * h), wpx = x1 - x0;
        c.fillStyle = 'rgba(255,107,139,0.28)'; c.fillRect(x0, P.Y(f((i + 1) * h)), wpx, P.Y(0) - P.Y(f((i + 1) * h)));
        c.fillStyle = 'rgba(167,139,250,0.6)'; c.fillRect(x0, P.Y(f(i * h)), wpx, P.Y(0) - P.Y(f(i * h)));
        if (n <= 16) { c.strokeStyle = 'rgba(255,107,139,0.9)'; c.lineWidth = 2; c.strokeRect(x0, P.Y(f((i + 1) * h)), wpx, P.Y(0) - P.Y(f((i + 1) * h))); }
      }
      c.restore();
      P.curve(c, f, -0.3, 3.4, { p: prog(lt, 0.3, 1.0), a: al });
      ctext(c, `n = ${n}`, 280, 470, { size: 48, color: C.yellow });
    });
    item('', {
      y: 1200, size: 46, t0: s + 1.6, t1: e,
      upd: (it, lt) => {
        const [lo, up] = sums(nOf(lt + 1.6));
        it.el.innerHTML = rich(`<i class="p">하합 $${lo.toFixed(2)}$</i> &nbsp;≤&nbsp; 넓이 &nbsp;≤&nbsp; <em>상합 $${up.toFixed(2)}$</em>`);
      },
    });
    item('상합 = 하합이 되는 값 $=\\displaystyle\\int_0^3 f(x)\\,dx = 4.2$', { y: 1350, size: 46, cls: 'card hl', t0: s + 8.6, t1: e, anim: 'pop', sfx: 'pop' });
    cap('리만(1854): 구간을 잘게 잘라 <b>직사각형</b>으로!', s + 0.3, s + 4.4);
    cap('조각을 늘릴수록 상합과 하합이 가까워져요', s + 4.5, s + 8.5);
    cap('둘이 일치하는 값이 정적분 — <b>리만 적분</b>', s + 8.6, e - 0.1);
  });

  // 6) 연표로 정리
  scene(10.5, (s, e) => {
    item('<b>📜 적분 2000년 연표</b>', { y: 330, size: 58, weight: 800, t0: s + 0.1, t1: e, anim: 'pop', sfx: 'pop' });
    const ev = [
      ['B.C. 3세기', '아르키메데스 — 실진법'],
      ['1615', '케플러 — 무한히 작은 조각의 합'],
      ['1635', '카발리에리 — 불가분량의 방법'],
      ['1686', '뉴턴 · 라이프니츠 — 기본정리, ∫ 기호'],
      ['1854', '리만 — 리만 적분 (엄밀한 정의)'],
      ['지금', '우리 교과서 — 넓이로 정적분을 정의'],
    ];
    const y0 = 480, dy = 160;
    draw(s + 0.4, e, (c, al, lt) => {
      const p = prog(lt, 0, ev.length * 0.75, ease.lin);
      c.globalAlpha = al; c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 6;
      c.beginPath(); c.moveTo(150, y0); c.lineTo(150, y0 + dy * (ev.length - 1)); c.stroke();
      c.strokeStyle = C.pink; c.beginPath(); c.moveTo(150, y0); c.lineTo(150, y0 + dy * (ev.length - 1) * p); c.stroke();
      ev.forEach((_, i) => {
        const on = prog(lt, i * 0.75, 0.3);
        c.globalAlpha = al * (0.3 + 0.7 * on); c.fillStyle = i === ev.length - 1 ? C.yellow : C.pink;
        c.shadowColor = c.fillStyle; c.shadowBlur = 18 * on;
        c.beginPath(); c.arc(150, y0 + dy * i, 16, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
      });
    });
    ev.forEach(([yr, txt], i) => {
      item(`<b>${yr}</b><br><span style="font-size:40px">${txt}</span>`, { x: 200, y: y0 + dy * i, ax: 0, size: 36, align: 'left', t0: s + 0.4 + i * 0.75, t1: e, anim: 'left', sfx: 'pop' });
    });
    T.cues.push({ t: s + 0.4 + ev.length * 0.75, type: 'chime' });
    cap('넓이를 구하려는 생각이 모여 <b>적분</b>이 되었어요', s + 0.3, s + 5.4);
    cap('이제 직접 적분해 볼까요? ▶ <b>EP.1 부정적분</b>', s + 5.5, e - 0.1);
  });
});
