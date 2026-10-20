"""배경음악(직접 합성한 잔잔한 로파이 루프)과 장면 전환/등장 효과음을 만든다.

사용법: python3 music.py cues.json out.wav [seed]
cues.json = {"dur": 초, "cues": [{"t": 초, "type": "whoosh"|"pop"|"chime"}, ...]}
"""
import json
import sys
import wave

import numpy as np

SR = 44100
BPM = 92
BEAT = 60 / BPM


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, a=0.01, r=0.3):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.exp(-t / r)
    return e


def tone(freq, dur, kind="sine", a=0.01, r=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    if kind == "sine":
        w = np.sin(2 * np.pi * freq * t)
    else:  # 부드러운 삼각파 근사
        w = sum(np.sin(2 * np.pi * freq * k * t) / k**2 * (-1) ** ((k - 1) // 2) for k in (1, 3, 5))
    return w * env(n, a, r)


def add(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def music(dur, seed):
    rng = np.random.default_rng(seed)
    out = np.zeros(int(dur * SR) + SR)
    # Cmaj7 - Am7 - Fmaj7 - G6 (2마디씩이 아니라 1마디씩 순환)
    chords = [[48, 55, 59, 64], [45, 52, 55, 60], [41, 48, 52, 57], [43, 50, 55, 59]]
    bar = 4 * BEAT
    shift = int(rng.integers(0, 4))
    t = 0.0
    k = 0
    while t < dur:
        ch = chords[(k + shift) % 4]
        # 패드
        for n in ch:
            add(out, tone(midi(n + 12), bar + 0.4, "tri", a=0.5, r=1.6), t, 0.035)
        # 베이스
        add(out, tone(midi(ch[0] - 12), bar, "sine", a=0.02, r=0.9), t, 0.12)
        # 아르페지오 (8분음표)
        pat = [0, 1, 2, 3, 2, 1, 3, 2]
        for i, p in enumerate(pat):
            add(out, tone(midi(ch[p] + 24), 0.5, "sine", a=0.005, r=0.18), t + i * BEAT / 2, 0.045)
        # 킥(1, 3박)과 하이햇(엇박)
        for b in (0, 2):
            n = int(0.25 * SR)
            tt = np.arange(n) / SR
            kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12)
            add(out, kick, t + b * BEAT, 0.22)
        for b in range(4):
            n = int(0.05 * SR)
            hat = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 90)
            hat = np.diff(hat, prepend=0)
            add(out, hat, t + b * BEAT + BEAT / 2, 0.025)
        t += bar
        k += 1
    return out


def sfx(kind, rng):
    if kind == "whoosh":
        n = int(0.55 * SR)
        noise = rng.standard_normal(n)
        # 단순 저역통과(이동평균) 후 위로 휘는 진폭
        k = 18
        noise = np.convolve(noise, np.ones(k) / k, mode="same")
        tt = np.arange(n) / SR
        e = np.sin(np.pi * tt / tt[-1]) ** 2
        return noise * e * 0.9
    if kind == "pop":
        n = int(0.12 * SR)
        tt = np.arange(n) / SR
        f = 900 * np.exp(-tt * 18) + 380
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 35) * 0.35
    if kind == "chime":
        s = np.zeros(int(1.6 * SR))
        for i, n in enumerate((72, 76, 79, 84)):
            add(s, tone(midi(n), 1.2, "sine", a=0.005, r=0.5), i * 0.09, 0.18)
        return s
    return np.zeros(1)


def main():
    cue_path, out_path = sys.argv[1], sys.argv[2]
    seed = sum(map(ord, sys.argv[3])) if len(sys.argv) > 3 else 0
    data = json.load(open(cue_path))
    dur = data["dur"]
    rng = np.random.default_rng(seed)
    mix = music(dur, seed) * 0.8
    for c in data["cues"]:
        add(mix, sfx(c["type"], rng), max(0, c["t"] - (0.2 if c["type"] == "whoosh" else 0)), 0.5)
    mix = mix[: int(dur * SR)]
    # 앞뒤 페이드
    fi, fo = int(0.6 * SR), int(1.8 * SR)
    mix[:fi] *= np.linspace(0, 1, fi)
    mix[-fo:] *= np.linspace(1, 0, fo)
    mix = np.tanh(mix / (np.max(np.abs(mix)) + 1e-9) * 1.2) * 0.6
    pcm = (mix * 32767).astype(np.int16)
    stereo = np.stack([pcm, pcm], axis=1)
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo.tobytes())


if __name__ == "__main__":
    main()
