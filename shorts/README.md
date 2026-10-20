# 미적분Ⅰ Ⅲ. 적분 — 단원별 개념 숏츠

교사용 지도서(Ⅲ 단원의 이론적 배경, Ⅲ-1 부정적분과 정적분, Ⅲ-2 정적분의 활용)를 바탕으로 만든 세로형(1080×1920, 30fps) 모션그래픽 숏츠입니다.

| 편 | 단원 | 영상 | 다루는 개념 |
|---|---|---|---|
| EP.0 | 이론적 배경 | `out/ep0.mp4` | 아르키메데스 실진법(포물선 = 삼각형의 4/3), 케플러의 부채꼴 조각, 카발리에리 불가분량, 뉴턴 $dS/dx=f(x)$·라이프니츠 ∫ 기호, 리만 상합·하합, 연표 |
| EP.1 | 부정적분 | `out/ep1.mp4` | 미분의 역연산, 적분상수 C의 기하적 의미(평행이동), $\int x^n dx$ 공식, 실수배·합·차 |
| EP.2 | 정적분 | `out/ep2.mp4` | 넓이로 정의한 정적분, $S_1-S_2$, 미적분의 기본정리, $F(b)-F(a)$, 구간 분할·대칭 |
| EP.3 | 넓이 | `out/ep3.mp4` | $\int\lvert f\rvert dx$, 두 곡선 사이의 넓이(위−아래), 평행이동 불변, $\frac{\lvert a\rvert}{6}(\beta-\alpha)^3$ |
| EP.4 | 속도와 거리 | `out/ep4.mp4` | 위치·속도·가속도 관계, 위치의 변화량 vs 움직인 거리, 연직 위로 던진 공 |

**가로 16:9 통합본** `out/full.mp4` (1920×1080, 약 5분): 오프닝 → CH.0~4 → 단원 전체 개념 지도까지 한 흐름으로 이어지는 수업·유튜브용 버전입니다 (`episodes/full.js`).

**자막 원고** `scripts/`: 편별 SRT(`ep0~4.srt`), 세로 합본용 `integral_all.srt`, 가로 통합본용 `full.srt`, 읽기용 `자막원고.md` (`node subs.mjs`로 다시 뽑을 수 있음).

세로 합본(`out/integral_all.mp4`)은 용량 때문에 저장소에 넣지 않았습니다. ffmpeg concat으로 0~4편을 이어 붙이면 됩니다.
예제 수치는 지도서의 문제(예: $\int_{-2}^{1}(x+1)dx=\frac32$, $v=3t^2-12$일 때 움직인 거리 37, $v=20-10t$ 공의 최고 높이 20m)를 그대로 사용했습니다.

## 다시 만들기

```bash
npm install                 # katex, pretendard, playwright
node render.mjs ep1         # → out/ep1.mp4 (ep0~ep4)
node render.mjs ep1 --stills 5,12   # 확인용 정지 화면 → out/stills/
node render.mjs full --parts 6      # 가로 통합본, 6구간 병렬 렌더링
node subs.mjs                       # 자막 원고(SRT, Markdown) 추출
```

- 화면: `episodes/epN.js` (장면 스크립트) + `lib/engine.js` (시간 t의 함수로 그리는 미니 엔진, KaTeX 수식)
- 브라우저에서 `episodes/epN.html`을 열면 미리보기가 반복 재생됩니다.
- 소리: `music.py`가 배경음악과 효과음을 직접 합성합니다(외부 음원 없음).
- 글꼴: Pretendard (SIL OFL), KaTeX 글꼴 (MIT)
