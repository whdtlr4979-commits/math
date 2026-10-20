// EP.1 부정적분 — 미분을 거꾸로!
boot(() => {
  intro(1, '부정적분', '미분을 거꾸로 하면?');
  header(1, '부정적분', T.cursor);

  // 1) 미분해서 2x가 되는 함수는?
  scene(10.5, (s, e) => {
    item('미분하면 <b>$2x$</b>가 되는 함수는?', { y: 400, size: 66, weight: 800, t0: s + 0.2, t1: e, anim: 'pop', sfx: 'pop' });
    const rows = ['x^2', 'x^2+1', 'x^2-3'];
    rows.forEach((r, i) => {
      const y = 640 + i * 190, t0 = s + 1.3 + i * 0.9;
      item(`$${r}$`, { x: 270, y, size: 64, cls: 'card', t0, t1: e, anim: 'left', sfx: 'pop', style: { minWidth: '250px' } });
      item('$2x$', { x: 820, y, size: 64, cls: 'card hl', t0: t0 + 0.45, t1: e, anim: 'right' });
      draw(t0, e, (c, a, lt) => {
        c.globalAlpha = a;
        const p = prog(lt, 0.1, 0.4, ease.out);
        if (p > 0) arrow(c, 470, y, 470 + 200 * p, y, { color: C.yellow, width: 6 });
        ctext(c, '미분', 570, y - 40, { family: '"Pretendard Variable"', italic: false, size: 34, color: C.yellow });
      });
    });
    item('<em>모두 정답!</em> &nbsp;→ &nbsp;$x^2 + {\\color{#ff6b8b}C}$ 꼴', { y: 1240, size: 60, weight: 800, t0: s + 5.2, t1: e, anim: 'pop', sfx: 'pop' });
    item('상수는 미분하면 $0$이 되니까!', { y: 1345, size: 44, color: C.dim, t0: s + 5.8, t1: e });
    cap('미분해서 <b>2x</b>가 되는 함수를 찾아볼까요?', s + 0.3, s + 4.9);
    cap('답이 하나가 아니에요! 상수항은 미분하면 <b>0</b>이 되거든요.', s + 5.0, e - 0.1);
  });

  // 2) 적분상수 C의 기하적 의미: 평행이동해도 기울기는 그대로
  scene(11.5, (s, e) => {
    const P = new Plot({ x: 110, y: 330, w: 860, h: 860, xr: [-2.6, 2.6], yr: [-3.2, 6.6] });
    const Ck = (lt) => keyed(lt, [[0, 0], [2.2, 0], [3.6, 2], [5.4, -2], [7.0, 1], [8.2, 0]]);
    draw(s, e, (c, a, lt) => {
      P.axes(c, a, { ticks: [[1, '1']] });
      c.globalAlpha = a;
      // 남겨지는 잔상
      [-2, -1, 1, 2].forEach((k) => {
        const show = clamp((lt - 3.0) / 0.6) * (lt > 2.2 ? 1 : 0);
        P.curve(c, (x) => x * x + k, -2.6, 2.6, { color: C.purple, width: 4, a: a * 0.35 * show, glow: false });
      });
      const cc = Ck(lt), p = prog(lt, 0.2, 1.4);
      P.curve(c, (x) => x * x + cc, -2.6, 2.6, { color: C.cyan, p, a });
      // x=1 에서의 접선 (기울기 2)
      const ta = a * prog(lt, 1.4, 0.6);
      if (ta > 0) {
        const y1 = 1 + cc;
        P.curve(c, (x) => 2 * (x - 1) + y1, 0.1, 1.9, { color: C.yellow, width: 6, a: ta, glow: false });
        P.dot(c, 1, y1, { a: ta });
        P.seg(c, 1, 0, 1, y1, { dash: [10, 10], a: ta * 0.6 });
        P.label(c, '기울기 2', 1.95, 2 * 0.95 + y1, { family: '"Pretendard Variable"', italic: false, size: 36, color: C.yellow, align: 'left', dy: 10 });
      }
      // C 슬라이더
      const sa = a * prog(lt, 2.0, 0.5);
      if (sa > 0) {
        c.globalAlpha = sa;
        const x0 = 240, x1 = 840, yy = 1260;
        c.strokeStyle = 'rgba(255,255,255,0.3)'; c.lineWidth = 8; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x0, yy); c.lineTo(x1, yy); c.stroke();
        const kx = lerp(x0, x1, (cc + 2.5) / 5);
        c.fillStyle = C.pink; c.shadowColor = C.pink; c.shadowBlur = 20;
        c.beginPath(); c.arc(kx, yy, 22, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
        ctext(c, `C = ${cc.toFixed(1)}`, W / 2, yy - 60, { size: 48, color: C.pink });
      }
      c.globalAlpha = 1;
    });
    item('$y = x^2 + {\\color{#ff6b8b}C}$', { x: 760, y: 1110, size: 54, t0: s + 0.8, t1: e });
    item('$\\dfrac{d}{dx}\\left(x^2+{\\color{#ff6b8b}C}\\right)=2x$', { y: 1400, size: 52, cls: 'card', t0: s + 6.4, t1: e, anim: 'pop', sfx: 'pop' });
    cap('<em>C</em>만큼 위아래로 평행이동해도…', s + 0.3, s + 5.6);
    cap('접선의 기울기(도함수)는 그대로! 이 <em>C</em>가 바로 <b>적분상수</b>', s + 5.7, e - 0.1);
  });

  // 3) 정의 + 미분/적분 순환 다이어그램
  scene(10.5, (s, e) => {
    item('$F\'(x)=f(x)$ 일 때', { y: 400, size: 50, color: C.dim, t0: s + 0.2, t1: e });
    item('$\\displaystyle\\int f(x)\\,dx = F(x) + {\\color{#ff6b8b}C}$', { y: 540, size: 72, cls: 'card hl', t0: s + 0.7, t1: e, anim: 'pop', sfx: 'pop' });
    item('부정적분', { x: 330, y: 680, size: 38, color: C.yellow, t0: s + 1.6, t1: e });
    item('적분상수', { x: 800, y: 680, size: 38, color: C.pink, t0: s + 1.9, t1: e });
    // 순환 다이어그램
    const L = 260, R = 820, Y = 980;
    item('$F(x)+C$', { x: L, y: Y, size: 56, cls: 'card', t0: s + 2.6, t1: e, anim: 'pop' });
    item('$f(x)$', { x: R, y: Y, size: 56, cls: 'card', t0: s + 2.9, t1: e, anim: 'pop' });
    draw(s + 3.2, e, (c, a, lt) => {
      c.globalAlpha = a;
      curvedArrow(c, L + 40, Y - 85, W / 2, Y - 250, R - 40, Y - 85, prog(lt, 0, 0.9), { color: C.cyan });
      curvedArrow(c, R - 40, Y + 85, W / 2, Y + 250, L + 40, Y + 85, prog(lt, 1.0, 0.9), { color: C.pink });
      if (lt > 0.5) ctext(c, '미분', W / 2, Y - 205, { family: '"Pretendard Variable"', italic: false, size: 44, color: C.cyan });
      if (lt > 1.5) ctext(c, '적분', W / 2, Y + 205, { family: '"Pretendard Variable"', italic: false, size: 44, color: C.pink });
    });
    item('💡 $\\displaystyle\\int$ 은 합(<b>S</b>umma)의 S를 길게 늘인 기호 — 라이프니츠', { y: 1330, size: 38, w: 900, cls: 'card', t0: s + 6.0, t1: e, sfx: 'pop' });
    cap('미분의 <b>역연산</b>이 바로 부정적분!', s + 0.3, s + 3.6);
    cap('미분 ⇄ 적분은 서로 <b>거꾸로</b> 가는 관계예요', s + 3.7, s + 5.9);
    cap('∫f(x)dx 는 “f(x)를 적분한다”라고 읽어요', s + 6.0, e - 0.1);
  });

  // 4) x^n 의 부정적분
  scene(12, (s, e) => {
    item('거듭제곱의 부정적분', { y: 360, size: 58, weight: 800, t0: s + 0.1, t1: e });
    const rows = [
      '\\displaystyle\\int x\\,dx = \\frac{1}{2}x^{2} + C',
      '\\displaystyle\\int x^{2}\\,dx = \\frac{1}{3}x^{3} + C',
      '\\displaystyle\\int x^{3}\\,dx = \\frac{1}{4}x^{4} + C',
    ];
    rows.forEach((r, i) => item(`$${r}$`, { y: 520 + i * 170, size: 58, t0: s + 0.7 + i * 0.8, t1: e, anim: 'left', sfx: 'pop' }));
    item('지수 <b>+1</b> &nbsp;그리고 &nbsp;그 수로 <b>나누기</b>', { y: 1030, size: 50, cls: 'card', t0: s + 3.6, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle\\int x^{n}\\,dx = \\frac{1}{n+1}\\,x^{n+1} + C$', { y: 1215, size: 64, cls: 'card hl', t0: s + 5.6, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle\\int 1\\,dx = x + C$ &nbsp;<span class="ghost" style="font-size:36px">(n = 0일 때)</span>', { y: 1380, size: 50, t0: s + 7.2, t1: e });
    cap('$x$의 거듭제곱은 <b>공식 하나</b>로 끝!', s + 0.3, s + 3.5);
    cap('지수에 1을 더하고, 그 수로 나눠요', s + 3.6, s + 7.9);
    cap('검산: 미분하면 다시 $x^n$ ✓', s + 8.0, e - 0.1);
  });

  // 5) 실수배·합·차 — 항별로 적분
  scene(11, (s, e) => {
    item('$\\displaystyle\\int (x^{2} - 2x + 3)\\,dx$', { y: 420, size: 66, cls: 'card', t0: s + 0.2, t1: e, anim: 'pop', sfx: 'pop' });
    const cols = [
      [230, '\\displaystyle\\int x^{2}dx', '\\frac{1}{3}x^{3}', C.cyan],
      [540, '\\displaystyle -2\\!\\int x\\,dx', '-x^{2}', C.purple],
      [850, '\\displaystyle 3\\!\\int 1\\,dx', '+\\,3x', C.green],
    ];
    cols.forEach(([x, a, b, col], i) => {
      const t0 = s + 1.4 + i * 0.6;
      draw(t0, e, (c, al, lt) => {
        c.globalAlpha = al; const p = prog(lt, 0, 0.5);
        if (p > 0) arrow(c, 540, 500, lerp(540, x, p), lerp(500, 600, p), { color: col, width: 5 });
      });
      item(`$${a}$`, { x, y: 680, size: 46, t0: t0 + 0.3, t1: e, color: col, sfx: 'pop' });
      draw(t0 + 2.2, e, (c, al, lt) => { c.globalAlpha = al; const p = prog(lt, 0, 0.4); if (p > 0) arrow(c, x, 760, x, 760 + 80 * p, { color: col, width: 5 }); });
      item(`$${b}$`, { x, y: 900, size: 56, t0: t0 + 2.5, t1: e, color: col, anim: 'pop' });
    });
    item('$= \\dfrac{1}{3}x^{3} - x^{2} + 3x + {\\color{#ff6b8b}C}$', { y: 1100, size: 64, cls: 'card hl', t0: s + 5.6, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\int kf(x)\\,dx = k\\!\\int f(x)\\,dx$<br>$\\int\\{f(x)\\pm g(x)\\}dx = \\int f(x)dx \\pm \\int g(x)dx$', { y: 1320, size: 40, color: C.dim, t0: s + 7.0, t1: e });
    cap('실수배·합·차는 <b>항별로 따로따로</b> 적분!', s + 0.3, s + 5.4);
    cap('적분상수 <em>C</em>는 마지막에 <b>하나로</b> 모아 써요', s + 5.5, e - 0.1);
  });

  outro([
    '$F\'(x)=f(x)$ 이면 $\\int f(x)\\,dx = F(x)+C$',
    '$C$ : 적분상수 (그래프의 위아래 평행이동)',
    '$\\int x^n dx = \\frac{1}{n+1}x^{n+1}+C$ , 항별 적분',
  ], '다음 편 ▶ <b>정적분</b>');
});
