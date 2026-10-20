// EP.3 넓이 — 넓이는 언제나 양수!
boot(() => {
  intro(3, '넓이', '넓이는 언제나 양수!');
  header(3, '정적분의 활용 ① 넓이', T.cursor);

  // 1) 곡선과 x축 사이: ∫f = 0 이지만 넓이는 8 (교과서 문제: (x+1)(x-1)(x-3), [-1, 3])
  scene(15, (s, e) => {
    const P = new Plot({ x: 110, y: 380, w: 860, h: 760, xr: [-1.8, 3.8], yr: [-4.2, 4.4] });
    const f = (x) => (x + 1) * (x - 1) * (x - 3);
    const M = (lt) => prog(lt, 7.0, 1.6);
    draw(s, e, (c, al, lt) => {
      const m = M(lt);
      const g = (x) => (x > 1 && x < 3 ? lerp(f(x), -f(x), m) : f(x));
      P.axes(c, al, { ticks: [[-1, '−1'], [1, '1'], [3, '3']] });
      P.area(c, f, null, -1, 1, { p: prog(lt, 1.6, 0.9), a: al, color: 'rgba(167,139,250,0.55)' });
      const lowCol = `rgba(${Math.round(lerp(94, 255, m))},${Math.round(lerp(224, 107, m))},${Math.round(lerp(176, 139, m))},0.55)`;
      P.area(c, () => 0, f, 1, 3, { p: prog(lt, 2.6, 0.9) * (m > 0 ? 0 : 1), a: al, color: lowCol });
      if (m > 0) {
        // 아래쪽 부분이 x축을 기준으로 뒤집혀 올라온다
        P.area(c, (x) => Math.max(g(x), 0), (x) => Math.min(g(x), 0), 1, 3, { a: al, color: lowCol });
        P.curve(c, f, 1, 3, { a: al * 0.35, dash: [12, 12], glow: false, width: 4 });
        P.curve(c, g, 1, 3, { a: al, color: C.pink });
      }
      P.curve(c, f, -1.8, 3.8, { p: prog(lt, 0.2, 1.3), a: al * (m > 0 ? 0.999 : 1) });
      if (m > 0) P.curve(c, g, 1, 3, { a: al, color: C.pink });
      P.label(c, '4', 0, 1.4, { size: 64, family: 'KaTeX_Main', italic: false, a: prog(lt, 2.4, 0.4) });
      P.label(c, '4', 2, lerp(-1.4, 1.4, m), { size: 64, family: 'KaTeX_Main', italic: false, a: prog(lt, 3.4, 0.4) });
    });
    item('$y=(x+1)(x-1)(x-3)$', { x: 760, y: 1105, size: 42, color: C.cyan, t0: s + 0.8, t1: e });
    item('$\\displaystyle\\int_{-1}^{3} f(x)\\,dx = 4 - 4 = 0$', { y: 1270, size: 56, t0: s + 3.8, t1: s + 8.2, sfx: 'pop' });
    item('<em>넓이가 0 ?!</em> 🤔', { y: 1390, size: 54, weight: 800, t0: s + 4.8, t1: s + 8.2, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle S=\\int_{-1}^{3} \\left|f(x)\\right|dx = 4 + 4 = 8$', { y: 1290, size: 58, cls: 'card hl', t0: s + 8.6, t1: e, anim: 'pop', sfx: 'pop' });
    cap('정적분 값이 0이면 넓이도 0일까요?', s + 0.3, s + 6.8);
    cap('$x$축 아래 부분은 <b>뒤집어서(절댓값)</b> 더해요', s + 6.9, s + 10.8);
    cap('<b>① 교점 → ② 구간 나누기 → ③ |f(x)| 적분</b>', s + 10.9, e - 0.1);
  });

  // 2) 두 곡선 사이: 위 − 아래 (교과서 문제: -x²-x+3, 2x-1)
  scene(13, (s, e) => {
    const P = new Plot({ x: 110, y: 380, w: 860, h: 720, xr: [-5.4, 2.4], yr: [-10.5, 5], ystep: 2 });
    const f = (x) => -x * x - x + 3, g = (x) => 2 * x - 1;
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { ticks: [[-4, '−4'], [1, '1']] });
      const p = prog(lt, 3.0, 4.0, ease.inOut), xs = lerp(-4, 1, p);
      if (p > 0) P.area(c, f, g, -4, xs, { a: al, color: 'rgba(255,107,139,0.42)' });
      P.curve(c, f, -5.4, 2.4, { p: prog(lt, 0.2, 1.0), a: al });
      P.curve(c, g, -5.4, 2.4, { p: prog(lt, 0.8, 1.0), a: al, color: C.pink });
      if (p > 0 && p < 1) {
        P.seg(c, xs, g(xs), xs, f(xs), { a: al, color: C.yellow, width: 8 });
        P.label(c, '위 − 아래', xs + 0.15, (f(xs) + g(xs)) / 2, { family: '"Pretendard Variable"', italic: false, size: 38, color: C.yellow, align: 'left' });
      }
      const da = al * prog(lt, 2.0, 0.4);
      P.dot(c, -4, -9, { a: da }); P.dot(c, 1, 1, { a: da });
    });
    item('$y=-x^2-x+3$', { x: 300, y: 450, size: 40, color: C.cyan, t0: s + 1.0, t1: e });
    item('$y=2x-1$', { x: 840, y: 1060, size: 40, color: C.pink, t0: s + 1.4, t1: e });
    item('$\\displaystyle S=\\int_{-4}^{1}\\{(-x^2-x+3)-(2x-1)\\}\\,dx$', { y: 1215, size: 46, t0: s + 4.0, t1: e, sfx: 'pop' });
    item('$\\displaystyle =\\int_{-4}^{1}(-x^2-3x+4)\\,dx = \\frac{125}{6}$', { y: 1375, size: 50, cls: 'card hl', t0: s + 7.6, t1: e, anim: 'pop', sfx: 'pop' });
    cap('두 곡선의 <b>교점</b>이 적분 구간의 양 끝!', s + 0.3, s + 3.9);
    cap('(위 곡선) − (아래 곡선)을 차곡차곡 쌓으면 넓이', s + 4.0, e - 0.1);
  });

  // 3) 평행이동해도 넓이는 그대로
  scene(11, (s, e) => {
    const P = new Plot({ x: 110, y: 380, w: 860, h: 780, xr: [-1.2, 4.4], yr: [-7.5, 4.5], ystep: 2 });
    const f = (x) => -x * x + 4 * x - 1, g = (x) => x - 1;
    const K = (lt) => keyed(lt, [[0, 0], [1.5, 0], [4.0, -5], [6.0, -5], [8.5, 0]]);
    draw(s, e, (c, al, lt) => {
      const k = K(lt), F = (x) => f(x) + k, G = (x) => g(x) + k;
      P.axes(c, al, { ticks: [[3, '3']] });
      P.area(c, F, G, 0, 3, { a: al, color: 'rgba(167,139,250,0.5)' });
      P.curve(c, F, -1.2, 4.4, { a: al });
      P.curve(c, G, -1.2, 4.4, { a: al, color: C.pink });
      P.label(c, 'S = 9/2', 1.5, (F(1.5) + G(1.5)) / 2, { family: '"Pretendard Variable"', italic: false, size: 46, color: C.ink, shadow: true });
      ctext(c, `k = ${k.toFixed(1)}`, 860, 460, { size: 44, color: C.yellow });
    });
    item('$\\displaystyle S=\\int_0^3\\{(f+k)-(g+k)\\}\\,dx=\\int_0^3 (f-g)\\,dx$', { y: 1290, size: 44, t0: s + 4.5, t1: e, sfx: 'pop' });
    cap('두 곡선을 함께 <b>x축 아래</b>로 내려도…', s + 0.3, s + 5.5);
    cap('넓이는 그대로! 위치와 상관없이 <b>위 − 아래</b>', s + 5.6, e - 0.1);
  });

  // 4) 꿀팁 공식: |a|/6 (β-α)³
  scene(12, (s, e) => {
    const P = new Plot({ x: 110, y: 380, w: 860, h: 620, xr: [-3, 4], yr: [-2.6, 3] });
    const al_ = -1.5, be = 2.5, f = (x) => 0.5 * (x - al_) * (x - be);
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { grid: false, ticks: [[al_, 'α'], [be, 'β']] });
      P.area(c, () => 0, f, al_, be, { p: prog(lt, 1.0, 1.4), a: al, color: 'rgba(167,139,250,0.55)' });
      P.curve(c, f, -3, 4, { p: prog(lt, 0.2, 1.0), a: al });
      P.label(c, 'S', 0.5, -0.9, { size: 72, a: prog(lt, 2.2, 0.4) });
    });
    item('$y=a(x-\\alpha)(x-\\beta)$', { x: 540, y: 985, size: 42, color: C.cyan, t0: s + 0.8, t1: e });
    item('$S=\\dfrac{|a|}{6}(\\beta-\\alpha)^3$', { y: 1165, size: 66, cls: 'card hl', t0: s + 2.6, t1: e, anim: 'pop', sfx: 'pop' });
    item('앞의 예: $-x^2-3x+4=-(x+4)(x-1)$', { y: 1290, size: 42, t0: s + 6.0, t1: e });
    item('$\\dfrac{|-1|}{6}\\{1-(-4)\\}^3=\\dfrac{125}{6}$ ✅', { y: 1400, size: 50, t0: s + 7.2, t1: e, anim: 'pop', sfx: 'pop' });
    cap('포물선과 직선(x축) 사이 넓이 <b>꿀팁</b>!', s + 0.3, s + 5.9);
    cap('교점 α, β만 알면 끝! 앞의 <b>125/6</b>과 같죠?', s + 6.0, e - 0.1);
  });

  outro([
    '곡선과 $x$축: $S=\\int_a^b |f(x)|\\,dx$',
    '두 곡선: $S=\\int_a^b |f(x)-g(x)|\\,dx$',
    '교점 구하기 → 구간 나누기 → (위 − 아래)',
  ], '다음 편 ▶ <b>속도와 거리</b>');
});
