// EP.2 정적분 — 넓이로 만나는 적분
boot(() => {
  intro(2, '정적분', '넓이로 만나는 적분');
  header(2, '정적분', T.cursor);

  // 1) f(x) ≥ 0 일 때: 넓이 = 정적분
  scene(10, (s, e) => {
    const P = new Plot({ x: 110, y: 360, w: 860, h: 760, xr: [-0.6, 5.4], yr: [-0.8, 4.2] });
    const f = (x) => 2 + 0.9 * Math.sin(1.1 * x - 0.6) + 0.12 * x;
    const a = 1, b = 4.5;
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { ticks: [[a, 'a'], [b, 'b']] });
      P.area(c, f, null, a, b, { p: prog(lt, 1.6, 2.2), a: al, color: 'rgba(167,139,250,0.5)' });
      P.curve(c, f, -0.6, 5.4, { p: prog(lt, 0.2, 1.3), a: al });
      P.seg(c, a, 0, a, f(a), { a: al * prog(lt, 1.4, 0.4), dash: [10, 10] });
      P.seg(c, b, 0, b, f(b), { a: al * prog(lt, 3.6, 0.4), dash: [10, 10] });
      P.label(c, 'S', 2.75, 1.1, { size: 80, color: C.ink, a: prog(lt, 3.4, 0.5) });
      P.label(c, 'y = f(x)', 4.6, f(4.6) + 0.55, { size: 40, color: C.cyan });
    });
    item('$\\displaystyle\\int_{a}^{b} f(x)\\,dx = S$', { y: 1290, size: 70, cls: 'card hl', t0: s + 4.3, t1: e, anim: 'pop', sfx: 'pop' });
    item('$a$ : 아래끝 &nbsp;&nbsp; $b$ : 위끝', { y: 1430, size: 40, color: C.dim, t0: s + 5.2, t1: e });
    cap('곡선 $y=f(x)$와 $x$축 사이의 넓이 $S$', s + 0.3, s + 4.2);
    cap('이 넓이를 <b>a에서 b까지의 정적분</b>이라고 해요', s + 4.3, e - 0.1);
  });

  // 2) 부호가 바뀌는 경우: 위 넓이 − 아래 넓이 (교과서 예: x+1, [-2, 1])
  scene(12, (s, e) => {
    const P = new Plot({ x: 110, y: 360, w: 860, h: 760, xr: [-3, 2.2], yr: [-1.8, 3.2] });
    const f = (x) => x + 1;
    draw(s, e, (c, al, lt) => {
      P.axes(c, al, { ticks: [[-2, '−2'], [-1, '−1'], [1, '1']], yticks: [[2, '2']] });
      P.area(c, () => 0, f, -2, -1, { p: prog(lt, 1.4, 1.0), a: al, color: 'rgba(94,224,176,0.55)' });
      P.area(c, f, null, -1, 1, { p: prog(lt, 3.6, 1.2), a: al, color: 'rgba(167,139,250,0.55)' });
      P.curve(c, f, -3, 2.2, { p: prog(lt, 0.2, 1.0), a: al });
      P.seg(c, -2, 0, -2, -1, { a: al, dash: [10, 10] });
      P.seg(c, 1, 0, 1, 2, { a: al, dash: [10, 10] });
      P.label(c, 'y = x + 1', 1.2, 2.75, { size: 40, color: C.cyan });
    });
    item('<i class="g">$S_2=\\frac{1}{2}$</i>', { x: P_X(-3, 2.2, -2.15), y: 770, size: 48, t0: s + 2.4, t1: e, anim: 'pop', sfx: 'pop' });
    item('<i class="p">$S_1=2$</i>', { x: P_X(-3, 2.2, 0.6), y: 790, size: 48, t0: s + 4.8, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle\\int_{-2}^{1}(x+1)\\,dx = {\\color{#a78bfa}S_1} - {\\color{#5ee0b0}S_2}$', { y: 1270, size: 58, t0: s + 6.0, t1: e, sfx: 'pop' });
    item('$= 2 - \\dfrac{1}{2} = \\dfrac{3}{2}$', { y: 1410, size: 60, cls: 'card hl', t0: s + 7.6, t1: e, anim: 'pop', sfx: 'pop' });
    cap('$x$축 <b>아래</b>쪽 넓이는 빼기(−)로 계산해요', s + 0.3, s + 5.9);
    cap('정적분 = (위쪽 넓이) − (아래쪽 넓이)', s + 6.0, e - 0.1);
  });

  // 3) 미적분의 기본정리: 넓이 함수를 미분하면 f
  scene(14, (s, e) => {
    const P = new Plot({ x: 110, y: 360, w: 860, h: 760, xr: [-0.4, 5.4], yr: [-0.6, 4.2] });
    const f = (t) => 1.6 + 0.5 * Math.sin(1.3 * t) + 0.25 * t;
    const a = 0.6;
    const X = (lt) => keyed(lt, [[0, 1.2], [1.5, 1.2], [3.2, 4.4], [4.6, 3.0]]);
    const DX = (lt) => keyed(lt, [[6, 0.9], [7.5, 0.9], [9.5, 0.12]]);
    draw(s, e, (c, al, lt) => {
      const x = X(lt);
      P.axes(c, al, { xl: 't', ticks: [[a, 'a'], [x, 'x']] });
      P.area(c, f, null, a, x, { a: al, color: 'rgba(167,139,250,0.5)' });
      P.curve(c, f, -0.4, 5.4, { a: al });
      P.seg(c, x, 0, x, f(x), { a: al, color: C.ink, width: 4 });
      P.label(c, 'S(x)', (a + x) / 2, 0.9, { size: 54, a: al * clamp(x - a - 0.4) });
      P.label(c, 'y = f(t)', 4.7, f(4.7) + 0.5, { size: 40, color: C.cyan });
      // 얇은 띠 ΔS ≈ f(x)Δx
      const sa = al * prog(lt, 5.2, 0.6);
      if (sa > 0) {
        const dx = DX(lt);
        c.globalAlpha = sa;
        P.area(c, f, null, x, x + dx, { color: 'rgba(255,209,102,0.85)' });
        c.globalAlpha = sa;
        c.strokeStyle = C.yellow; c.lineWidth = 4;
        c.strokeRect(P.X(x), P.Y(f(x)), P.X(x + dx) - P.X(x), P.Y(0) - P.Y(f(x)));
        P.label(c, 'ΔS', x + dx + 0.12, f(x) * 0.5, { size: 44, color: C.yellow, align: 'left' });
        P.label(c, 'Δx', x + dx / 2, -0.38, { size: 36, color: C.yellow });
        c.globalAlpha = 1;
      }
    });
    item('$S(x)=\\displaystyle\\int_{a}^{x} f(t)\\,dt$', { y: 1270, size: 60, t0: s + 0.5, t1: s + 5.4 });
    item('$\\Delta S \\approx f(x)\\times\\Delta x \\;\\Rightarrow\\; \\dfrac{\\Delta S}{\\Delta x}\\approx f(x)$', { y: 1270, size: 52, t0: s + 5.5, t1: s + 9.6, sfx: 'pop' });
    item('$\\dfrac{d}{dx}\\displaystyle\\int_{a}^{x} f(t)\\,dt = f(x)$', { y: 1270, size: 64, cls: 'card hl', t0: s + 9.7, t1: e, anim: 'pop', sfx: 'pop' });
    item('⭐ 미적분의 기본정리', { y: 1410, size: 44, weight: 800, color: C.yellow, t0: s + 10.2, t1: e });
    cap('$x$를 움직이면 넓이 $S(x)$도 따라 변해요', s + 0.3, s + 5.4);
    cap('늘어난 넓이 ≈ 높이 <b>f(x)</b> × 폭 <b>Δx</b>', s + 5.5, s + 9.6);
    cap('넓이를 미분하면 <b>원래 함수</b>! 적분은 미분의 역연산', s + 9.7, e - 0.1);
  });

  // 4) 정적분 계산: F(b) − F(a)
  scene(12, (s, e) => {
    item('$S(x)$도 $f(x)$의 부정적분이니까 $S(x)=F(x)+C$', { y: 400, size: 42, t0: s + 0.2, t1: e });
    item('$S(a)=0$ 이므로 $C=-F(a)$', { y: 490, size: 42, color: C.dim, t0: s + 1.0, t1: e });
    item('$\\displaystyle\\int_{a}^{b} f(x)\\,dx = \\Big[F(x)\\Big]_{a}^{b} = F(b)-F(a)$', { y: 650, size: 50, cls: 'card hl', t0: s + 2.0, t1: e, anim: 'pop', sfx: 'pop' });
    item('<b>예제</b> &nbsp;$\\displaystyle\\int_{2}^{4} (3x+2)\\,dx$', { y: 850, size: 54, t0: s + 4.2, t1: e, anim: 'left', sfx: 'pop' });
    item('$=\\Big[\\tfrac{3}{2}x^{2}+2x\\Big]_{2}^{4}$', { y: 990, size: 54, t0: s + 5.4, t1: e, anim: 'left' });
    item('$=({\\color{#5ad1ff}24+8})-({\\color{#ff6b8b}6+4})$', { y: 1120, size: 54, t0: s + 6.6, t1: e, anim: 'left' });
    item('$=22$', { y: 1260, size: 80, weight: 800, color: C.yellow, t0: s + 7.8, t1: e, anim: 'pop', sfx: 'pop' });
    cap('그래서 정적분은 <b>부정적분</b>으로 계산해요', s + 0.3, s + 4.1);
    cap('<b>F(위끝) − F(아래끝)</b>, 적분상수 C는 사라져요', s + 4.2, e - 0.1);
  });

  // 5) 정적분의 성질: 구간 나누기, 대칭
  scene(14, (s, e) => {
    const P = new Plot({ x: 110, y: 340, w: 860, h: 600, xr: [-0.4, 5.4], yr: [-0.6, 3.6] });
    const f = (x) => 1.5 + 0.6 * Math.sin(1.2 * x) + 0.2 * x;
    const a = 0.6, cc = 2.6, b = 4.6, mid = s + 6.2;
    draw(s, mid, (c, al, lt) => {
      P.axes(c, al, { ticks: [[a, 'a'], [cc, 'c'], [b, 'b']] });
      P.area(c, f, null, a, cc, { p: prog(lt, 0.8, 1.0), a: al, color: 'rgba(167,139,250,0.55)' });
      P.area(c, f, null, cc, b, { p: prog(lt, 1.9, 1.0), a: al, color: 'rgba(90,209,255,0.45)' });
      P.curve(c, f, -0.4, 5.4, { a: al });
      P.seg(c, cc, 0, cc, f(cc), { a: al, color: C.ink, width: 4, dash: [10, 8] });
    });
    item('$\\displaystyle{\\color{#a78bfa}\\int_{a}^{c}} f\\,dx + {\\color{#5ad1ff}\\int_{c}^{b}} f\\,dx = \\int_{a}^{b} f\\,dx$', { y: 1040, size: 54, t0: s + 2.8, t1: mid, sfx: 'pop' });
    item('$\\displaystyle\\int_{a}^{a} f\\,dx = 0, \\quad \\int_{b}^{a} f\\,dx = -\\int_{a}^{b} f\\,dx$', { y: 1220, size: 44, cls: 'card', t0: s + 3.8, t1: mid, sfx: 'pop' });
    // 대칭
    const L = new Plot({ x: 70, y: 420, w: 440, h: 440, xr: [-2.5, 2.5], yr: [-1.6, 2.6] });
    const R = new Plot({ x: 570, y: 420, w: 440, h: 440, xr: [-2.5, 2.5], yr: [-2.1, 2.1] });
    const ev = (x) => 0.4 * x * x + 0.25, od = (x) => 0.5 * x * x * x - 1.5 * x;
    draw(mid, e, (c, al, lt) => {
      L.axes(c, al, { grid: false, origin: false, ticks: [[-2, '−a'], [2, 'a']] });
      L.area(c, ev, null, 0, 2, { p: prog(lt, 0.6, 0.8), a: al, color: 'rgba(167,139,250,0.55)' });
      // 오른쪽 넓이가 거울처럼 왼쪽으로
      const m = prog(lt, 1.6, 1.0);
      if (m > 0) L.area(c, ev, null, -2 * m, 0, { a: al, color: 'rgba(167,139,250,0.55)' });
      L.curve(c, ev, -2.5, 2.5, { a: al, width: 6 });
      R.axes(c, al, { grid: false, origin: false, ticks: [[-2, '−a'], [2, 'a']] });
      R.areaSigned(c, od, -2, 2, { p: prog(lt, 2.8, 1.4), a: al, pos: 'rgba(167,139,250,0.55)', neg: 'rgba(94,224,176,0.55)' });
      R.curve(c, od, -2.5, 2.5, { a: al, width: 6, color: C.pink });
    });
    item('<b>y축 대칭</b> (우함수)', { x: 290, y: 370, size: 38, t0: mid + 0.2, t1: e });
    item('<b>원점 대칭</b> (기함수)', { x: 790, y: 370, size: 38, t0: mid + 0.2, t1: e });
    item('$\\displaystyle\\int_{-a}^{a} f\\,dx = 2\\!\\int_{0}^{a} f\\,dx$', { x: 290, y: 980, size: 40, cls: 'card', t0: mid + 2.4, t1: e, anim: 'pop', sfx: 'pop' });
    item('$\\displaystyle\\int_{-a}^{a} f\\,dx = 0$', { x: 790, y: 980, size: 40, cls: 'card', t0: mid + 4.0, t1: e, anim: 'pop', sfx: 'pop' });
    item('예) $\\displaystyle\\int_{-1}^{1}(x^5+5x^4)\\,dx = 0 + 2\\!\\int_0^1 5x^4dx = 2$', { y: 1200, size: 40, color: C.dim, t0: mid + 5.0, t1: e });
    cap('구간은 쪼개도, 이어 붙이면 그대로!', s + 0.3, mid - 0.2);
    cap('대칭이면 계산이 쉬워져요: <b>2배</b> 또는 <b>0</b>', mid, e - 0.1);
  });

  outro([
    '$\\int_a^b f(x)\\,dx$ = (위 넓이) − (아래 넓이)',
    '기본정리: $\\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)$',
    '계산: $\\int_a^b f(x)\\,dx = F(b)-F(a)$',
  ], '다음 편 ▶ <b>넓이</b>');
});

// 플롯 상자(x:110, w:860) 기준 x좌표 → 화면 x
function P_X(x0, x1, x) { return 110 + (x - x0) / (x1 - x0) * 860; }
