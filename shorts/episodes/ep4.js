// EP.4 속도와 거리 — 위치의 변화량 vs 움직인 거리
boot(() => {
  intro(4, '속도와 거리', '위치의 변화량 vs 움직인 거리');
  header(4, '정적분의 활용 ② 속도와 거리', T.cursor);

  // 수직선 그리기 도우미
  function numberLine(c, a, y, x0, x1, v0, v1, ticks, unit = '') {
    const X = (v) => lerp(x0, x1, (v - v0) / (v1 - v0));
    c.globalAlpha = a;
    arrow(c, x0 - 20, y, x1 + 30, y, { color: C.axis, width: 4, head: 20 });
    ticks.forEach((v) => {
      c.strokeStyle = C.axis; c.lineWidth = 3; c.beginPath(); c.moveTo(X(v), y - 10); c.lineTo(X(v), y + 10); c.stroke();
      ctext(c, String(v).replace('-', '−'), X(v), y + 38, { size: 32, family: 'KaTeX_Main', italic: false, color: C.dim });
    });
    if (unit) ctext(c, unit, x1 + 40, y + 38, { size: 30, family: '"Pretendard Variable"', italic: false, color: C.dim });
    return X;
  }

  // 1) 위치 ⇄ 속도 ⇄ 가속도, 버스 예시 (교과서 생각열기: x = 12t − 3t²)
  scene(14, (s, e) => {
    const nodes = [[190, '위치 $x(t)$'], [540, '속도 $v(t)$'], [890, '가속도 $a(t)$']];
    const mid = s + 4.6;
    nodes.forEach(([x, h], i) => item(h, { x, y: 520, size: 40, cls: 'card', t0: s + 0.3 + i * 0.4, t1: mid, anim: 'pop', sfx: 'pop' }));
    draw(s + 1.4, mid, (c, a, lt) => {
      c.globalAlpha = a;
      [[190, 540], [540, 890]].forEach(([x0, x1], i) => {
        curvedArrow(c, x0 + 30, 450, (x0 + x1) / 2, 360, x1 - 30, 450, prog(lt, i * 0.3, 0.7), { color: C.cyan, width: 5 });
        curvedArrow(c, x1 - 30, 590, (x0 + x1) / 2, 680, x0 + 30, 590, prog(lt, 1.0 + i * 0.3, 0.7), { color: C.pink, width: 5 });
        if (lt > 0.5) ctext(c, '미분', (x0 + x1) / 2, 350, { family: '"Pretendard Variable"', italic: false, size: 36, color: C.cyan });
        if (lt > 1.5) ctext(c, '적분', (x0 + x1) / 2, 700, { family: '"Pretendard Variable"', italic: false, size: 36, color: C.pink });
      });
    });
    const tau = (lt) => 2 * prog(lt, 5.4, 4.2, ease.lin);
    const pos = (t) => 12 * t - 3 * t * t;
    const P = new Plot({ x: 110, y: 760, w: 860, h: 480, xr: [-0.3, 2.6], yr: [-1.5, 13.5], ystep: 2 });
    draw(mid, e, (c, a, lt) => {
      const X = numberLine(c, a, 560, 140, 940, 0, 12, [0, 3, 6, 9, 12], '(m)');
      const t = tau(lt + (mid - s));
      c.globalAlpha = a; c.strokeStyle = C.yellow; c.lineWidth = 8; c.lineCap = 'round';
      c.beginPath(); c.moveTo(X(0), 560); c.lineTo(X(pos(t)), 560); c.stroke();
      P.axes(c, a, { xl: 't', yl: 'v', ticks: [[1, '1'], [2, '2']], yticks: [[12, '12']] });
      P.area(c, (x) => 12 - 6 * x, null, 0, Math.max(t, 1e-3), { a, color: 'rgba(255,209,102,0.45)' });
      P.curve(c, (x) => 12 - 6 * x, -0.3, 2.6, { a });
      P.label(c, 'v = 12 − 6t', 1.5, 7.5, { size: 40, color: C.cyan, align: 'left' });
    });
    item('<span style="display:inline-block;transform:scaleX(-1)">🚌</span>', {
      x: 140, y: 490, size: 80, t0: mid + 0.2, t1: e, anim: 'pop', sfx: 'pop',
      upd: (it, lt) => { it.el.style.left = lerp(140, 940, pos(tau(lt + mid + 0.2 - s)) / 12) + 'px'; },
    });
    item('', {
      y: 1340, size: 52, t0: mid + 0.6, t1: e, sfx: 'pop',
      upd: (it, lt) => {
        const t = tau(lt + mid + 0.6 - s);
        it.el.innerHTML = rich(`$\\displaystyle\\int_0^{${t.toFixed(2)}} v(t)\\,dt = {\\color{#ffd166}${pos(t).toFixed(1)}}$ m`);
      },
    });
    cap('위치를 미분하면 속도, 속도를 <b>적분</b>하면 위치!', s + 0.3, mid - 0.1);
    cap('$v$ 그래프 아래 넓이 = 버스의 위치 변화 <b>12m</b>', mid, e - 0.1);
  });

  // 2) 위치의 변화량 vs 움직인 거리 (교과서 문제: v = 3t² − 12, 1 ≤ t ≤ 4)
  scene(16, (s, e) => {
    const v = (t) => 3 * t * t - 12, x = (t) => t * t * t - 12 * t + 11;
    const tau = (lt) => keyed(lt, [[1.5, 1], [8.5, 4]], ease.lin);
    const P = new Plot({ x: 110, y: 700, w: 860, h: 480, xr: [-0.2, 4.4], yr: [-12, 38], ystep: 6 });
    draw(s, e, (c, a, lt) => {
      const X = numberLine(c, a, 520, 110, 990, -8, 30, [-5, 0, 10, 20, 27]);
      const t = tau(lt);
      c.globalAlpha = a;
      // 이동 경로: 왼쪽으로 5 (초록), 오른쪽으로 32 (보라)
      const tl = Math.min(t, 2), xl = x(tl);
      c.lineCap = 'round'; c.lineWidth = 9;
      c.strokeStyle = C.green; c.beginPath(); c.moveTo(X(0), 600); c.lineTo(X(xl), 600); c.stroke();
      if (t > 2) { c.strokeStyle = C.purple; c.beginPath(); c.moveTo(X(-5), 635); c.lineTo(X(x(t)), 635); c.stroke(); }
      P.axes(c, a, { xl: 't', yl: 'v', ticks: [[1, '1'], [2, '2'], [4, '4']], yticks: [[36, '36']] });
      P.areaSigned(c, v, 1, Math.max(t, 1.0001), { a, pos: 'rgba(167,139,250,0.55)', neg: 'rgba(94,224,176,0.6)' });
      P.curve(c, v, -0.2, 4.4, { a });
      P.label(c, 'v = 3t² − 12', 2.3, 30, { size: 40, color: C.cyan });
      if (t >= 2) P.label(c, '5', 1.5, -2.6, { size: 50, family: 'KaTeX_Main', italic: false, color: C.green });
      if (t >= 4) P.label(c, '32', 3.4, 11, { size: 56, family: 'KaTeX_Main', italic: false });
    });
    item('🤖', { x: 110, y: 450, size: 76, t0: s + 0.6, t1: e, anim: 'pop', sfx: 'pop', upd: (it, lt) => { it.el.style.left = lerp(110, 990, (x(tau(lt + 0.6)) + 8) / 38) + 'px'; } });
    item('위치의 변화량 $=\\int_1^4 v\\,dt = -5+32 = {\\color{#ffd166}27}$', { y: 1270, size: 44, t0: s + 9.2, t1: e, sfx: 'pop' });
    item('움직인 거리 $=\\int_1^4 |v|\\,dt = 5+32 = {\\color{#ff6b8b}37}$', { y: 1400, size: 46, cls: 'card hl', t0: s + 11.2, t1: e, anim: 'pop', sfx: 'pop' });
    cap('점 P가 왼쪽으로 <i class="g">5</i>, 다시 오른쪽으로 <i class="p">32</i> 이동', s + 0.3, s + 9.0);
    cap('변화량은 <b>27</b>인데, 실제로 움직인 거리는 <em>37</em>!', s + 9.1, s + 12.6);
    cap('움직인 거리 = 속도의 <b>절댓값</b> |v(t)|를 적분', s + 12.7, e - 0.1);
  });

  // 3) 위로 던진 공 (교과서 예제: v = 20 − 10t)
  scene(15, (s, e) => {
    const v = (t) => 20 - 10 * t, h = (t) => 20 * t - 5 * t * t;
    const tau = (lt) => keyed(lt, [[1.0, 0], [7.5, 3]], ease.lin);
    const Hy = (m) => 1160 - m * 33;
    const P = new Plot({ x: 400, y: 380, w: 590, h: 780, xr: [-0.3, 3.4], yr: [-12, 22], ystep: 5 });
    draw(s, e, (c, a, lt) => {
      const t = tau(lt);
      c.globalAlpha = a;
      // 높이 눈금 기둥
      c.strokeStyle = C.axis; c.lineWidth = 4; c.beginPath(); c.moveTo(110, Hy(0)); c.lineTo(110, Hy(22)); c.stroke();
      [0, 5, 10, 15, 20].forEach((m) => {
        c.beginPath(); c.moveTo(100, Hy(m)); c.lineTo(120, Hy(m)); c.stroke();
        ctext(c, String(m), 85, Hy(m), { size: 30, family: 'KaTeX_Main', italic: false, color: C.dim, align: 'right' });
      });
      ctext(c, '(m)', 110, Hy(23.5), { size: 28, family: '"Pretendard Variable"', italic: false, color: C.dim });
      c.fillStyle = 'rgba(255,255,255,0.15)'; c.fillRect(140, Hy(0), 200, 8);
      if (t >= 2) { c.setLineDash([10, 10]); c.strokeStyle = C.yellow; c.lineWidth = 3; c.beginPath(); c.moveTo(120, Hy(20)); c.lineTo(350, Hy(20)); c.stroke(); c.setLineDash([]);
        ctext(c, '최고점', 300, Hy(20) - 28, { size: 30, family: '"Pretendard Variable"', italic: false, color: C.yellow }); }
      // 잔상과 공
      for (let k = 1; k <= 8; k++) { const tt = t - k * 0.09; if (tt < 0) break; c.globalAlpha = a * 0.25 * (1 - k / 9); c.fillStyle = C.orange; c.beginPath(); c.arc(240, Hy(h(tt)) - 22, 22, 0, 7); c.fill(); }
      c.globalAlpha = a; c.fillStyle = C.orange; c.shadowColor = C.orange; c.shadowBlur = 24;
      c.beginPath(); c.arc(240, Hy(h(t)) - 22, 26, 0, 7); c.fill(); c.shadowBlur = 0;
      // 속도 그래프
      P.axes(c, a, { xl: 't', yl: 'v', ticks: [[1, '1'], [2, '2'], [3, '3']], yticks: [[20, '20']] });
      P.areaSigned(c, v, 0, Math.max(t, 1e-3), { a, pos: 'rgba(167,139,250,0.55)', neg: 'rgba(94,224,176,0.6)' });
      P.curve(c, v, -0.3, 3.4, { a });
      P.dot(c, t, v(t), { a, r: 11 });
      if (t >= 2) P.label(c, '20', 0.75, 6.5, { size: 54, family: 'KaTeX_Main', italic: false });
      if (t >= 3) P.label(c, '5', 2.62, -3.2, { size: 48, family: 'KaTeX_Main', italic: false, color: C.green });
      ctext(c, `t = ${t.toFixed(1)}초   v = ${v(t).toFixed(0)} m/s`, 695, 430, { size: 36, family: '"Pretendard Variable"', italic: false, color: C.yellow });
    });
    item('최고 높이 $=\\int_0^2 (20-10t)\\,dt = 20$ m', { y: 1270, size: 44, t0: s + 8.0, t1: e, sfx: 'pop' });
    item('3초 동안 움직인 거리 $= 20 + 5 = {\\color{#ff6b8b}25}$ m', { y: 1395, size: 46, cls: 'card hl', t0: s + 9.8, t1: e, anim: 'pop', sfx: 'pop' });
    cap('위로 던진 공의 속도: $v(t)=20-10t$ (m/s)', s + 0.3, s + 4.8);
    cap('2초에 $v=0$ → <b>최고점 20m</b>, 그 뒤엔 내려와요', s + 4.9, s + 9.7);
    cap('3초 동안 움직인 거리 = 올라간 <i class="p">20</i> + 내려온 <i class="g">5</i>', s + 9.8, e - 0.1);
  });

  // 4) 그래프로 정리: S1 − S2 + S3 vs S1 + S2 + S3
  scene(10, (s, e) => {
    const P = new Plot({ x: 110, y: 380, w: 860, h: 600, xr: [-0.3, 5.2], yr: [-3.2, 6] });
    const v = (t) => 0.6 * t * (t - 2) * (t - 4);
    draw(s, e, (c, a, lt) => {
      P.axes(c, a, { xl: 't', yl: 'v', ticks: [[2, 'a'], [4, 'b'], [4.7, 'c']] });
      P.areaSigned(c, v, 0, 4.7, { p: prog(lt, 0.8, 2.0, ease.lin), a, pos: 'rgba(167,139,250,0.55)', neg: 'rgba(94,224,176,0.6)' });
      P.curve(c, v, -0.3, 5.2, { a });
      P.seg(c, 4.7, 0, 4.7, v(4.7), { a, dash: [10, 8] });
      const la = prog(lt, 2.8, 0.5);
      P.label(c, 'S₁', 1, 0.8, { size: 52, a: la, family: 'KaTeX_Main' });
      P.label(c, 'S₂', 3, -0.85, { size: 52, a: la, family: 'KaTeX_Main' });
      P.label(c, 'S₃', 5.0, 1.2, { size: 46, a: la, family: 'KaTeX_Main' });
    });
    item('${\\color{#a78bfa}S_1} - {\\color{#5ee0b0}S_2} + {\\color{#a78bfa}S_3}$ = <b>위치의 변화량</b>', { y: 1110, size: 50, t0: s + 3.4, t1: e, sfx: 'pop' });
    item('${\\color{#a78bfa}S_1} + {\\color{#5ee0b0}S_2} + {\\color{#a78bfa}S_3}$ = <em>움직인 거리</em>', { y: 1250, size: 50, cls: 'card hl', t0: s + 5.0, t1: e, anim: 'pop', sfx: 'pop' });
    cap('속도 그래프 하나로 두 가지를 모두 읽을 수 있어요', s + 0.3, s + 5.0);
    cap('아래쪽 넓이를 <b>빼면</b> 변화량, <b>더하면</b> 거리!', s + 5.1, e - 0.1);
  });

  outro([
    '위치: $x = x_0 + \\int_{t_0}^{t} v(t)\\,dt$',
    '위치의 변화량: $\\int_a^b v(t)\\,dt$',
    '움직인 거리: $\\int_a^b |v(t)|\\,dt$',
  ], '🎉 <b>Ⅲ. 적분</b> 완주! 수고했어요');
});
