// ==UserScript==
// @name         YouTube 360° Spatial Audio (Physical Modeling + Late Reverb + Lite + Minimize)
// @namespace    https://github.com/spatial-audio-verified
// @version      4.2.7
// @description  严格M/S + Image Source早反(ITD) + Late Reverb网络(无零延迟环) + Lite仅早反 + crossfade旁路 + SPA自愈 + 最小化按钮（修复触控端UI无法点击）+ 预设参数重调
// @author       ?
// @license      CC-BY-4.0
// @match        https://m.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560903/YouTube%20360%C2%B0%20Spatial%20Audio%20%28Physical%20Modeling%20%2B%20Late%20Reverb%20%2B%20Lite%20%2B%20Minimize%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560903/YouTube%20360%C2%B0%20Spatial%20Audio%20%28Physical%20Modeling%20%2B%20Late%20Reverb%20%2B%20Lite%20%2B%20Minimize%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ============================================================
  // 0) 常量 & 工具
  // ============================================================

  const SPEED_OF_SOUND = 343;   // m/s
  const HEAD_RADIUS = 0.0875;   // 8.75cm
  const CFG_KEY = 'spatialAudioConfigV427';
  const CFG_FALLBACK_KEYS = [
    'spatialAudioConfigV423',
    'spatialAudioConfigV424',
    'spatialAudioConfigV425',
    'spatialAudioConfigV426'
  ];

  const FV = {
    clamp(v, min, max) {
      v = Number(v);
      if (!Number.isFinite(v)) v = min;
      return Math.min(max, Math.max(min, v));
    },

    sanitizeConfig(raw) {
      const c = raw || {};
      return {
        enabled: !!c.enabled,
        minimized: !!c.minimized,
        lite: !!c.lite,

        mode: ['sony360RA', 'dolbyAtmos', 'wideStereo'].includes(c.mode) ? c.mode : 'sony360RA',
        depth: this.clamp(c.depth ?? 0.60, 0, 1),
        width: this.clamp(c.width ?? 1.30, 0, 2),
        reverb: this.clamp(c.reverb ?? 0.40, 0, 1),
        virtualHeight: this.clamp(c.virtualHeight ?? 0.60, 0, 1),
        bass: this.clamp(c.bass ?? 0, -6, 6),
        treble: this.clamp(c.treble ?? 0, -6, 6)
      };
    },

    // ✅ 更稳：优先 cancelAndHoldAtTime（支持则“保持 now 的真实值”）
    ramp(param, value, now, dt) {
      try {
        if (typeof param.cancelAndHoldAtTime === 'function') {
          param.cancelAndHoldAtTime(now);
        } else {
          param.cancelScheduledValues(now);
          param.setValueAtTime(param.value, now);
        }
        param.linearRampToValueAtTime(value, now + dt);
      } catch (_) {
        try { param.value = value; } catch (_) {}
      }
    },

    // ✅ 更保守：把 FX 内 dry+wet 并联叠加算进去
    // ✅ 并且不会“越缩越小”：记住 base outputGain，安全时回弹
    ensureSafeGain(nodes, ctx) {
      if (!nodes || !nodes.outputGain || !ctx) return;

      const inG = nodes.inputGain?.gain?.value ?? 1;
      const byG = nodes.bypassGain?.gain?.value ?? 1;
      const fxG = nodes.fxGain?.gain?.value ?? 0;

      const dryG = nodes.dryGain?.gain?.value ?? 1;
      const wetG = nodes.reverbGain?.gain?.value ?? 0;
      const mixSum = dryG + wetG;

      const outNode = nodes.outputGain;
      if (outNode._baseGain == null) outNode._baseGain = outNode.gain.value ?? 1;

      const base = outNode._baseGain;
      const current = outNode.gain.value ?? base;

      const worst = inG * (byG + fxG * mixSum) * current;

      const LIMIT = 4.0;
      const RESTORE = 3.4; // 小回差，避免抖动

      let target = current;

      if (worst > LIMIT) {
        // 把 worst 拉回 LIMIT
        const s = LIMIT / worst;
        target = Math.max(0.05, current * s);
      } else if (worst < RESTORE) {
        // 安全区间：回到 base（但别突然跳）
        target = base;
      } else {
        // 介于两者之间：维持当前
        target = current;
      }

      if (Math.abs(target - current) > 1e-4) {
        this.ramp(outNode.gain, target, ctx.currentTime, 0.05);
      }
    }
  };

  // RT60 -> comb feedback gain: g = 10^(-3 * delay / rt60)
  function rt60ToFeedback(delaySec, rt60Sec) {
    const rt = Math.max(0.05, rt60Sec);
    return Math.pow(10, (-3 * delaySec) / rt);
  }

  // deterministic PRNG (Mulberry32)
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ============================================================
  // 1) EQ 预设（风格调色）
  // ============================================================

  const EQ_PRESETS = {
    sony360RA: [
      { freq: 60, gain: 2.0, Q: 0.8 },
      { freq: 250, gain: -1.0, Q: 1.4 },
      { freq: 1000, gain: 0.0, Q: 1.0 },
      { freq: 4000, gain: 1.5, Q: 2.0 },
      { freq: 10000, gain: 2.0, Q: 1.2 },
      { freq: 16000, gain: 1.0, Q: 0.7 }
    ],
    dolbyAtmos: [
      { freq: 80, gain: 3.0, Q: 0.7 },
      { freq: 200, gain: -0.5, Q: 1.2 },
      { freq: 2500, gain: 1.0, Q: 1.5 },
      { freq: 8000, gain: 2.5, Q: 1.0 },
      { freq: 14000, gain: 1.5, Q: 0.8 }
    ],
    wideStereo: [
      { freq: 100, gain: 1.0, Q: 1.0 },
      { freq: 500, gain: -0.5, Q: 2.0 },
      { freq: 3000, gain: 2.0, Q: 1.2 },
      { freq: 12000, gain: 1.5, Q: 0.9 }
    ]
  };

  // ============================================================
  // 2) 物理房间模型：Early IR（Image Source + ITD）
  // ============================================================

  const PhysicalRoomModel = {
    presets: {
      near:   { width: 6,  depth: 8,  height: 3,   rtLow: 0.45, rtMid: 0.34, rtHigh: 0.20, refl: 0.80 },
      studio: { width: 10, depth: 14, height: 4.5, rtLow: 0.80, rtMid: 0.60, rtHigh: 0.34, refl: 0.86 },
      hall:   { width: 22, depth: 32, height: 12,  rtLow: 1.60, rtMid: 1.30, rtHigh: 1.00, refl: 0.92 }
    },

    pickRoom(cfg) {
      let d = cfg.depth;
      if (cfg.mode === 'dolbyAtmos') d = Math.min(1, d + 0.10);
      if (cfg.mode === 'wideStereo') d = Math.max(0, d - 0.05);

      if (d < 0.35) return this.presets.near;
      if (d < 0.70) return this.presets.studio;
      return this.presets.hall;
    },

    calcITD(azimuth) {
      // Woodworth-ish
      return (HEAD_RADIUS / SPEED_OF_SOUND) * (azimuth + Math.sin(azimuth));
    },

    computeEarlyReflections(room, cfg) {
      const heightFactor = cfg.virtualHeight;

      const src = { x: room.width * 0.30, y: 1.5, z: room.depth * 0.20 };
      const lis = {
        x: room.width * 0.55,
        y: 1.5 + heightFactor * 0.40 * room.height,
        z: room.depth * 0.70
      };

      // deterministic seed：同一档位反复切换不会“纹理变来变去”
      const dQ = Math.round(cfg.depth * 100);
      const hQ = Math.round(cfg.virtualHeight * 100);
      const mQ = cfg.mode === 'dolbyAtmos' ? 2 : (cfg.mode === 'wideStereo' ? 3 : 1);
      const seed = (dQ * 73856093) ^ (hQ * 19349663) ^ (mQ * 83492791);
      const rand = mulberry32(seed >>> 0);

      const planes = [
        { p: { x: 0, y: 0, z: 0 }, n: { x: 1, y: 0, z: 0 } },
        { p: { x: room.width, y: 0, z: 0 }, n: { x: -1, y: 0, z: 0 } },
        { p: { x: 0, y: 0, z: 0 }, n: { x: 0, y: 0, z: 1 } },
        { p: { x: 0, y: 0, z: room.depth }, n: { x: 0, y: 0, z: -1 } },
        { p: { x: 0, y: 0, z: 0 }, n: { x: 0, y: 1, z: 0 } },
        { p: { x: 0, y: room.height, z: 0 }, n: { x: 0, y: -1, z: 0 } }
      ];

      function reflectPoint(pt, plane) {
        const vx = pt.x - plane.p.x;
        const vy = pt.y - plane.p.y;
        const vz = pt.z - plane.p.z;
        const dot = vx * plane.n.x + vy * plane.n.y + vz * plane.n.z;
        return {
          x: pt.x - 2 * dot * plane.n.x,
          y: pt.y - 2 * dot * plane.n.y,
          z: pt.z - 2 * dot * plane.n.z
        };
      }

      const early = [];
      const maxDelay = 0.090;

      function pushImage(img, listener, order) {
        const dx = listener.x - img.x;
        const dy = listener.y - img.y;
        const dz = listener.z - img.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (!dist) return;

        const delay = dist / SPEED_OF_SOUND;
        if (delay > maxDelay) return;

        const horiz = Math.sqrt(dx * dx + dz * dz);
        const az = Math.atan2(dx, dz);
        const el = Math.atan2(dy, horiz || 1e-6);

        const baseGain = Math.pow(room.refl, order) / (1 + 0.22 * dist);

        // energy panning (ILD-ish)
        const pan = Math.sin(az);
        const lBase = 0.5 * (1 - pan);
        const rBase = 0.5 * (1 + pan);

        const heightBoost = 1 + 0.30 * heightFactor * Math.sin(el);

        const itd = PhysicalRoomModel.calcITD(az);
        const delayL = Math.max(0, delay - itd * 0.5);
        const delayR = Math.max(0, delay + itd * 0.5);

        // deterministic jitter（2阶才抖一点）
        const jitter = order >= 2 ? (rand() - 0.5) * 0.00035 : 0;

        early.push({
          delayL: Math.max(0, delayL + jitter),
          delayR: Math.max(0, delayR + jitter),
          gL: baseGain * lBase * heightBoost,
          gR: baseGain * rBase * heightBoost
        });
      }

      // 1阶
      for (let i = 0; i < planes.length; i++) {
        const img = reflectPoint(src, planes[i]);
        pushImage(img, lis, 1);
      }
      // 2阶
      for (let i = 0; i < planes.length; i++) {
        for (let j = 0; j < planes.length; j++) {
          if (j === i) continue;
          let img = reflectPoint(src, planes[i]);
          img = reflectPoint(img, planes[j]);
          pushImage(img, lis, 2);
        }
      }

      return early;
    },

    buildEarlyIR(ctx, cfg) {
      const room = this.pickRoom(cfg);
      const sr = ctx.sampleRate;
      const length = Math.floor(0.11 * sr); // 110ms
      const buffer = ctx.createBuffer(2, length, sr);

      const early = this.computeEarlyReflections(room, cfg);

      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        data[0] = 0.0; // no direct

        early.forEach(ref => {
          const d = ch === 0 ? ref.delayL : ref.delayR;
          const i = Math.floor(d * sr);
          if (i > 0 && i < length) {
            const g = ch === 0 ? ref.gL : ref.gR;
            data[i] += g;
          }
        });
      }

      // normalize
      let maxAbs = 0;
      for (let ch = 0; ch < 2; ch++) {
        const d = buffer.getChannelData(ch);
        for (let i = 0; i < length; i++) maxAbs = Math.max(maxAbs, Math.abs(d[i]));
      }
      if (maxAbs > 1) {
        const s = 1 / maxAbs;
        for (let ch = 0; ch < 2; ch++) {
          const d = buffer.getChannelData(ch);
          for (let i = 0; i < length; i++) d[i] *= s;
        }
      }

      return buffer;
    }
  };

  // ============================================================
  // 3) Late Reverb 网络（SAFE：无零延迟环）
  // ============================================================

  function createAllpass(ctx, delayTime, g) {
    const inSum = ctx.createGain();
    const delay = ctx.createDelay(0.08);
    delay.delayTime.value = delayTime;

    const fb = ctx.createGain();
    fb.gain.value = g;

    const ff = ctx.createGain();
    ff.gain.value = -g;

    const outSum = ctx.createGain();

    inSum.connect(delay);
    delay.connect(fb);
    fb.connect(inSum);

    inSum.connect(ff);
    ff.connect(outSum);
    delay.connect(outSum);

    return { input: inSum, output: outSum, delay, fb, ff };
  }

  function createComb(ctx, delayTime, feedbackGain, dampHz) {
    const input = ctx.createGain();
    const delay = ctx.createDelay(0.12);
    delay.delayTime.value = delayTime;

    const damp = ctx.createBiquadFilter();
    damp.type = 'lowpass';
    damp.frequency.value = dampHz;

    const fb = ctx.createGain();
    fb.gain.value = feedbackGain;

    const output = ctx.createGain();

    input.connect(delay);
    delay.connect(output);

    delay.connect(damp);
    damp.connect(fb);
    fb.connect(delay);

    return { input, output, delay, damp, fb };
  }

  function createStereoLateReverb(ctx) {
    const input = ctx.createGain();
    const splitter = ctx.createChannelSplitter(2);
    const merger = ctx.createChannelMerger(2);
    const output = ctx.createGain();

    input.connect(splitter);

    const ch = [0, 1].map((idx) => {
      const pre = ctx.createGain();

      const ap1 = createAllpass(ctx, idx === 0 ? 0.0110 : 0.0127, 0.72);
      const ap2 = createAllpass(ctx, idx === 0 ? 0.0073 : 0.0081, 0.70);

      const combTimesL = [0.0297, 0.0371, 0.0411, 0.0537];
      const combTimesR = [0.0309, 0.0363, 0.0427, 0.0501];
      const times = idx === 0 ? combTimesL : combTimesR;

      const combs = times.map(t => createComb(ctx, t, 0.5, 6000));

      const combSum = ctx.createGain();
      combSum.gain.value = 0.5;

      pre.connect(ap1.input);
      ap1.output.connect(ap2.input);

      combs.forEach(c => {
        ap2.output.connect(c.input);
        c.output.connect(combSum);
      });

      return { pre, ap1, ap2, combs, combSum };
    });

    splitter.connect(ch[0].pre, 0);
    splitter.connect(ch[1].pre, 1);

    // main L/R
    ch[0].combSum.connect(merger, 0, 0);
    ch[1].combSum.connect(merger, 0, 1);

    // ✅ SAFE crossfeed（无环路）：combSum 层互送一点
    const xfLtoR = ctx.createGain();
    const xfRtoL = ctx.createGain();
    xfLtoR.gain.value = 0.12;
    xfRtoL.gain.value = 0.12;

    ch[0].combSum.connect(xfLtoR);
    xfLtoR.connect(merger, 0, 1);

    ch[1].combSum.connect(xfRtoL);
    xfRtoL.connect(merger, 0, 0);

    merger.connect(output);

    function setRoom(cfg) {
      const room = PhysicalRoomModel.pickRoom(cfg);

      // damp cutoff from ratio
      const ratio = room.rtHigh / Math.max(0.05, room.rtLow);
      const dampHzBase = 1600 + 9800 * FV.clamp(ratio, 0, 1);
      const heightTilt = 1 + cfg.virtualHeight * 0.15;
      const dampHz = FV.clamp(dampHzBase * heightTilt, 1200, 12000);

      const rtMidL = room.rtMid * (cfg.mode === 'dolbyAtmos' ? 1.08 : 1.0);
      const rtMidR = room.rtMid * (cfg.mode === 'dolbyAtmos' ? 1.05 : 0.98);

      ch[0].combs.forEach((c) => {
        const dt = c.delay.delayTime.value;
        c.fb.gain.value = FV.clamp(rt60ToFeedback(dt, rtMidL), 0.05, 0.92);
        c.damp.frequency.value = dampHz;
      });
      ch[1].combs.forEach((c) => {
        const dt = c.delay.delayTime.value;
        c.fb.gain.value = FV.clamp(rt60ToFeedback(dt, rtMidR), 0.05, 0.92);
        c.damp.frequency.value = dampHz;
      });

      const density = 0.42 + cfg.depth * 0.18;
      ch[0].combSum.gain.value = density;
      ch[1].combSum.gain.value = density;

      const xf = FV.clamp(0.10 + cfg.depth * 0.06 - Math.max(0, cfg.width - 1) * 0.03, 0.06, 0.16);
      xfLtoR.gain.value = xf;
      xfRtoL.gain.value = xf;
    }

    return { input, output, setRoom };
  }

  // ============================================================
  // 4) 核心引擎：M/S + Early + Late + Lite + crossfade bypass
  // ============================================================

  class Sony360Engine {
    constructor() {
      this.ctx = null;
      this.source = null;
      this.nodes = {};
      this.config = FV.sanitizeConfig({});
      this.enabled = false;

      this._irDepth = null;
      this._irHeight = null;
      this._irMode = null;
    }

    async init(mediaElement) {
      if (this.ctx) {
        try { await this.ctx.close(); } catch (_) {}
      }

      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.source = this.ctx.createMediaElementSource(mediaElement);

      this._buildGraph();

      // SPA/new graph：必须从“未启用”开始，避免卡旁路
      this.enabled = false;

      this.applyConfig(this.config, true);
      try { await this.ctx.resume(); } catch (_) {}
    }

    _buildGraph() {
      const ctx = this.ctx;
      const n = this.nodes = {};

      n.inputGain = ctx.createGain();
      n.inputGain.gain.value = 1.0;

      // bypass/fx crossfade
      n.bypassGain = ctx.createGain();
      n.fxGain = ctx.createGain();
      n.bypassGain.gain.value = 1.0;
      n.fxGain.gain.value = 0.0;

      // eq fixed 6
      n.eqFilters = Array.from({ length: 6 }, () => {
        const f = ctx.createBiquadFilter();
        f.type = 'peaking';
        f.frequency.value = 1000;
        f.gain.value = 0;
        f.Q.value = 1.0;
        return f;
      });

      // strict M/S
      n.splitter = ctx.createChannelSplitter(2);
      n.merger = ctx.createChannelMerger(2);

      n.LtoMid = ctx.createGain(); n.LtoMid.gain.value = 0.5;
      n.RtoMid = ctx.createGain(); n.RtoMid.gain.value = 0.5;
      n.mid = ctx.createGain();

      n.LtoSide = ctx.createGain(); n.LtoSide.gain.value = 0.5;
      n.RtoSideInv = ctx.createGain(); n.RtoSideInv.gain.value = -0.5;
      n.side = ctx.createGain();

      n.sideToL = ctx.createGain();
      n.sideToR = ctx.createGain();
      n.sumL = ctx.createGain();
      n.sumR = ctx.createGain();

      // micro Haas
      n.delayL = ctx.createDelay(0.02);
      n.delayR = ctx.createDelay(0.02);

      // tone
      n.lowShelf = ctx.createBiquadFilter();
      n.lowShelf.type = 'lowshelf';
      n.lowShelf.frequency.value = 200;

      n.highShelf = ctx.createBiquadFilter();
      n.highShelf.type = 'highshelf';
      n.highShelf.frequency.value = 8000;

      n.heightPeak = ctx.createBiquadFilter();
      n.heightPeak.type = 'peaking';
      n.heightPeak.frequency.value = 12000;
      n.heightPeak.Q.value = 1;

      // wet: predelay -> early IR
      n.wetPreDelay = ctx.createDelay(0.06);
      n.earlyConvolver = ctx.createConvolver();

      // Lite / Full 路由：不拆线，用 Gain 选择
      n.earlyDirectGain = ctx.createGain(); // early -> wetSum (lite)
      n.lateInGain = ctx.createGain();      // early -> lateNet (full)
      n.lateOutGain = ctx.createGain();     // lateNet -> wetSum (full)

      n.lateReverb = createStereoLateReverb(ctx);

      n.wetSum = ctx.createGain();
      n.reverbGain = ctx.createGain();
      n.dryGain = ctx.createGain();
      n.revMix = ctx.createGain();

      // limiter（稍柔，听感更自然）
      n.limiter = ctx.createDynamicsCompressor();
      n.limiter.threshold.value = -6;
      n.limiter.knee.value = 10;
      n.limiter.ratio.value = 12;
      n.limiter.attack.value = 0.003;
      n.limiter.release.value = 0.15;

      n.outputGain = ctx.createGain();
      n.outputGain.gain.value = 1.0;
      n.outputGain._baseGain = 1.0;

      // wiring
      this.source.connect(n.inputGain);

      // bypass
      n.inputGain.connect(n.bypassGain);
      n.bypassGain.connect(n.limiter);

      // fx chain
      let last = n.inputGain;
      n.eqFilters.forEach(f => { last.connect(f); last = f; });
      last.connect(n.splitter);

      // mid
      n.splitter.connect(n.LtoMid, 0); n.LtoMid.connect(n.mid);
      n.splitter.connect(n.RtoMid, 1); n.RtoMid.connect(n.mid);

      // side
      n.splitter.connect(n.LtoSide, 0); n.LtoSide.connect(n.side);
      n.splitter.connect(n.RtoSideInv, 1); n.RtoSideInv.connect(n.side);

      // reconstruct
      n.mid.connect(n.sumL);
      n.mid.connect(n.sumR);
      n.side.connect(n.sideToL); n.sideToL.connect(n.sumL);
      n.side.connect(n.sideToR); n.sideToR.connect(n.sumR);

      n.sumL.connect(n.delayL);
      n.sumR.connect(n.delayR);
      n.delayL.connect(n.merger, 0, 0);
      n.delayR.connect(n.merger, 0, 1);

      n.merger.connect(n.lowShelf);
      n.lowShelf.connect(n.highShelf);
      n.highShelf.connect(n.heightPeak);

      // dry
      n.heightPeak.connect(n.dryGain);
      n.dryGain.connect(n.revMix);

      // wet driver
      n.heightPeak.connect(n.wetPreDelay);
      n.wetPreDelay.connect(n.earlyConvolver);

      // lite branch: early -> wetSum
      n.earlyConvolver.connect(n.earlyDirectGain);
      n.earlyDirectGain.connect(n.wetSum);

      // full branch: early -> late -> wetSum
      n.earlyConvolver.connect(n.lateInGain);
      n.lateInGain.connect(n.lateReverb.input);
      n.lateReverb.output.connect(n.lateOutGain);
      n.lateOutGain.connect(n.wetSum);

      // wet level & sum
      n.wetSum.connect(n.reverbGain);
      n.reverbGain.connect(n.revMix);

      // fx gain -> limiter
      n.revMix.connect(n.fxGain);
      n.fxGain.connect(n.limiter);

      // output
      n.limiter.connect(n.outputGain);
      n.outputGain.connect(ctx.destination);

      // ✅ 关键：给 Lite/Full 三个 Gain 一个确定初值（避免首次启用瞬间双路叠加）
      const lite = !!this.config?.lite;
      n.earlyDirectGain.gain.value = lite ? 1 : 0;
      n.lateInGain.gain.value = lite ? 0 : 1;
      n.lateOutGain.gain.value = lite ? 0 : 1;

      FV.ensureSafeGain(n, ctx);
    }

    _updateEQ(mode) {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const preset = EQ_PRESETS[mode] || [];
      const filters = this.nodes.eqFilters;

      for (let i = 0; i < filters.length; i++) {
        const f = filters[i];
        const b = preset[i];
        if (b) {
          FV.ramp(f.frequency, b.freq, now, 0.08);
          FV.ramp(f.gain, b.gain, now, 0.08);
          FV.ramp(f.Q, b.Q, now, 0.08);
        } else {
          FV.ramp(f.frequency, 1000, now, 0.08);
          FV.ramp(f.gain, 0, now, 0.08);
          FV.ramp(f.Q, 1.0, now, 0.08);
        }
      }
    }

    applyConfig(raw, forceIR = false) {
      if (!this.ctx) return;
      const cfg = FV.sanitizeConfig(raw);
      this.config = cfg;

      const n = this.nodes;
      const ctx = this.ctx;
      const now = ctx.currentTime;

      const t = 0.06;
      const tLite = 0.30;

      // dry/wet in FX
      const wet = cfg.reverb;
      const dry = 1 - wet * 0.60;
      FV.ramp(n.dryGain.gain, dry, now, t);
      FV.ramp(n.reverbGain.gain, wet * 0.92, now, t);

      // width
      FV.ramp(n.sideToL.gain, cfg.width, now, t);
      FV.ramp(n.sideToR.gain, -cfg.width, now, t);

      // micro delays
      const baseDelay = 0.00020;
      const extra = (cfg.width - 1) * 0.00055;
      const dL = Math.max(0, baseDelay + extra);
      const dR = Math.max(0, baseDelay - extra);
      FV.ramp(n.delayL.delayTime, dL, now, t);
      FV.ramp(n.delayR.delayTime, dR, now, t);

      // predelay 6~18ms
      const pre = 0.006 + cfg.depth * 0.012;
      FV.ramp(n.wetPreDelay.delayTime, pre, now, t);

      // tone
      const depthGain = cfg.depth * 3 + cfg.bass;
      const trebleGain = cfg.virtualHeight * 4 + cfg.treble;
      FV.ramp(n.lowShelf.gain, depthGain, now, t);
      FV.ramp(n.highShelf.gain, trebleGain, now, t);
      FV.ramp(n.heightPeak.gain, cfg.virtualHeight * 3, now, t);

      this._updateEQ(cfg.mode);

      // Lite routing（长 fade）
      const rampLite = (param, value) => FV.ramp(param, value, now, tLite);
      if (cfg.lite) {
        rampLite(n.lateInGain.gain, 0);
        rampLite(n.lateOutGain.gain, 0);
        rampLite(n.earlyDirectGain.gain, 1);
      } else {
        rampLite(n.lateInGain.gain, 1);
        rampLite(n.lateOutGain.gain, 1);
        rampLite(n.earlyDirectGain.gain, 0);
      }

      // ✅ IR rebuild condition（更严谨）
      const needIR =
        forceIR ||
        this._irDepth === null ||
        this._irHeight === null ||
        this._irMode === null ||
        Math.abs(cfg.depth - this._irDepth) > 0.06 ||
        Math.abs(cfg.virtualHeight - this._irHeight) > 0.09 ||
        cfg.mode !== this._irMode;

      if (needIR) {
        n.earlyConvolver.buffer = PhysicalRoomModel.buildEarlyIR(ctx, cfg);
        n.lateReverb.setRoom(cfg);
        this._irDepth = cfg.depth;
        this._irHeight = cfg.virtualHeight;
        this._irMode = cfg.mode;
      } else {
        n.lateReverb.setRoom(cfg);
      }

      FV.ensureSafeGain(n, ctx);
    }

    // 幂等 crossfade：每次都写 ramp
    setEnabled(on) {
      if (!this.ctx) return;

      const n = this.nodes;
      const now = this.ctx.currentTime;
      const fade = 0.06;

      FV.ramp(n.bypassGain.gain, on ? 0.0 : 1.0, now, fade);
      FV.ramp(n.fxGain.gain, on ? 1.0 : 0.0, now, fade);

      this.enabled = !!on;

      FV.ensureSafeGain(n, this.ctx);
    }
  }

  // ============================================================
  // 5) UI（含最小化按钮 + Lite 开关 + 预设按钮）
  // ============================================================

  const UI = {
    engine: null,
    video: null,
    panel: null,

    defaultConfig() {
      return {
        enabled: false,
        minimized: false,
        lite: false,

        mode: 'sony360RA',
        depth: 0.6,
        width: 1.3,
        reverb: 0.4,
        virtualHeight: 0.6,
        bass: 0,
        treble: 0
      };
    },

    // ✅ 我重调的预设（你不用动）
    presets() {
      return {
        // 更贴合“听演唱会”：大一点、宽一点、尾巴更明显但不糊
        concert: {
          mode: 'sony360RA',
          depth: 0.82,
          width: 1.65,
          reverb: 0.58,
          virtualHeight: 0.78,
          bass: 2.5,
          treble: 1.0,
          lite: false
        },
        // 更贴合“影院”：Atmos 风格，大空间，低频更稳
        cinema: {
          mode: 'dolbyAtmos',
          depth: 0.93,
          width: 1.75,
          reverb: 0.50,
          virtualHeight: 0.88,
          bass: 4.5,
          treble: 1.5,
          lite: false
        },
        // 人声：清晰优先，Lite 仅早反，尾巴不糊字
        vocal: {
          mode: 'wideStereo',
          depth: 0.38,
          width: 1.18,
          reverb: 0.18,
          virtualHeight: 0.42,
          bass: -1.5,
          treble: 2.5,
          lite: true
        },
        reset: this.defaultConfig()
      };
    },

    loadConfig() {
      try {
        // 先读新 key
        const sNew = typeof GM_getValue === 'function'
          ? GM_getValue(CFG_KEY, null)
          : localStorage.getItem(CFG_KEY);

        if (sNew) return FV.sanitizeConfig(JSON.parse(sNew));

        // 迁移旧 key（有就拿来并保存到新 key）
        for (const k of CFG_FALLBACK_KEYS) {
          const sOld = typeof GM_getValue === 'function'
            ? GM_getValue(k, null)
            : localStorage.getItem(k);
          if (sOld) {
            const cfg = FV.sanitizeConfig(JSON.parse(sOld));
            this.saveConfig(cfg);
            return cfg;
          }
        }

        return this.defaultConfig();
      } catch {
        return this.defaultConfig();
      }
    },

    saveConfig(cfg) {
      try {
        const s = JSON.stringify(cfg);
        if (typeof GM_setValue === 'function') GM_setValue(CFG_KEY, s);
        else localStorage.setItem(CFG_KEY, s);
      } catch (e) {
        console.warn('[Spatial Audio] saveConfig failed:', e);
      }
    },

    createPanel() {
      if (document.getElementById('sa-phys-panel')) return;
      const cfg = this.loadConfig();

      const div = document.createElement('div');
      div.id = 'sa-phys-panel';
      div.className = cfg.minimized ? 'minimized' : '';
      div.innerHTML = `
        <div class="sap-header">
          <span class="sap-title">🎧 360° Physical</span>
          <div class="sap-actions">
            <button class="sap-min" id="sap-minbtn" title="最小化/展开">${cfg.minimized ? '+' : '−'}</button>
            <label class="sap-switch" title="启用/禁用">
              <input type="checkbox" id="sap-toggle">
              <span class="sap-slider"></span>
            </label>
          </div>
        </div>

        <div class="sap-body" id="sap-body">
          <div class="sap-row sap-lite">
            <label>Lite（仅早反）</label>
            <label class="sap-switch small" title="Lite 模式">
              <input type="checkbox" id="sap-lite">
              <span class="sap-slider"></span>
            </label>
          </div>

          <div class="sap-row">
            <label>模式</label>
            <select id="sap-mode">
              <option value="sony360RA">Sony 360RA</option>
              <option value="dolbyAtmos">Dolby 风格</option>
              <option value="wideStereo">宽立体声</option>
            </select>
          </div>

          <div class="sap-row">
            <label>深度 <span id="sap-depth-v"></span></label>
            <input type="range" id="sap-depth" min="0" max="100">
          </div>

          <div class="sap-row">
            <label>宽度 <span id="sap-width-v"></span></label>
            <input type="range" id="sap-width" min="0" max="200">
          </div>

          <div class="sap-row">
            <label>混响 <span id="sap-reverb-v"></span></label>
            <input type="range" id="sap-reverb" min="0" max="100">
          </div>

          <div class="sap-row">
            <label>高度 <span id="sap-height-v"></span></label>
            <input type="range" id="sap-height" min="0" max="100">
          </div>

          <div class="sap-row sap-dual">
            <div>
              <label>低音(dB)</label>
              <input type="range" id="sap-bass" min="-6" max="6" step="0.5">
            </div>
            <div>
              <label>高音(dB)</label>
              <input type="range" id="sap-treble" min="-6" max="6" step="0.5">
            </div>
          </div>

          <div class="sap-row sap-presets">
            <button data-p="concert">🎵 Concert</button>
            <button data-p="cinema">🎬 Cinema</button>
            <button data-p="vocal">🎤 Vocal</button>
            <button data-p="reset">↺ Reset</button>
          </div>

          <div class="sap-status" id="sap-status">● 待机</div>
        </div>
      `;
      document.body.appendChild(div);
      this.panel = div;

      this._injectStyle();
      this._bindEvents(cfg);
      this._applyConfigToUI(cfg);
    },

    _injectStyle() {
      if (document.getElementById('sa-phys-style')) return;
      const s = document.createElement('style');
      s.id = 'sa-phys-style';
      s.textContent = `
        #sa-phys-panel{
          position:fixed;top:70px;right:12px;width:252px;
          background:rgba(10,10,25,0.96);color:#eee;
          font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          font-size:12px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.4);
          z-index:2147483647;overflow:hidden;
          pointer-events:auto;
          touch-action:manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        #sa-phys-panel.minimized{width:190px;}
        #sa-phys-panel.minimized .sap-body{display:none;}

        .sap-header{
          display:flex;align-items:center;justify-content:space-between;
          padding:8px 10px;background:rgba(255,255,255,0.06);
          cursor:move;
          touch-action:none; /* ✅ 只在标题栏禁用滚动，让拖拽在手机可用 */
        }
        .sap-title{font-weight:600;font-size:13px;}
        .sap-actions{display:flex;align-items:center;gap:8px;}

        .sap-min{
          width:22px;height:22px;line-height:20px;
          border-radius:6px;
          border:1px solid rgba(255,255,255,0.22);
          background:rgba(255,255,255,0.06);
          color:#eee;cursor:pointer;font-size:16px;
        }
        .sap-min:active{transform:scale(0.98);}

        .sap-body{padding:8px 10px 10px;}
        .sap-row{margin-bottom:8px;}
        .sap-row label{display:flex;justify-content:space-between;margin-bottom:2px;}
        .sap-dual{display:flex;gap:8px;}
        .sap-dual>div{flex:1;}
        .sap-row input[type=range]{
          width:100%;
          touch-action:none; /* ✅ 手机端滑条不被页面滚动抢走 */
        }
        .sap-row select{
          width:100%;padding:4px;border-radius:6px;
          border:1px solid rgba(255,255,255,0.2);
          background:rgba(0,0,0,0.4);color:#eee;font-size:12px;
        }
        .sap-presets{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;}
        .sap-presets button{
          border-radius:8px;border:1px solid rgba(255,255,255,0.2);
          background:rgba(255,255,255,0.05);color:#eee;cursor:pointer;
          font-size:12px;padding:6px;
          touch-action:manipulation;
        }
        .sap-presets button:active{transform:scale(0.98);}

        .sap-status{margin-top:4px;text-align:center;font-size:11px;color:#999;}
        .sap-status.active{color:#00ff9d;}
        .sap-status.error{color:#ff5f5f;}

        .sap-switch{position:relative;display:inline-block;width:36px;height:18px;}
        .sap-switch.small{width:34px;height:16px;}
        .sap-switch input{opacity:0;width:0;height:0;}
        .sap-slider{
          position:absolute;cursor:pointer;inset:0;background:#555;border-radius:18px;transition:.2s;
        }
        .sap-slider:before{
          position:absolute;content:"";height:14px;width:14px;left:2px;bottom:2px;
          background:white;border-radius:50%;transition:.2s;
        }
        .sap-switch.small .sap-slider:before{height:12px;width:12px;bottom:2px;}
        .sap-switch input:checked + .sap-slider{background:linear-gradient(90deg,#00d4ff,#7b2ff7);}
        .sap-switch input:checked + .sap-slider:before{transform:translateX(18px);}
        .sap-switch.small input:checked + .sap-slider:before{transform:translateX(16px);}

        .sap-lite{display:flex;align-items:center;justify-content:space-between;}
        .sap-lite label{margin-bottom:0;}
      `;
      document.head.appendChild(s);
    },

    _bindEvents(cfg) {
      const p = this.panel;
      const statusEl = p.querySelector('#sap-status');

      // ✅ 触控/鼠标统一：Pointer Events 拖拽（只在标题栏）
      (function makeDraggable(box) {
        const header = box.querySelector('.sap-header');
        let dragging = false;
        let startX = 0, startY = 0, startL = 0, startT = 0;

        header.addEventListener('pointerdown', (e) => {
          // 点按钮/开关就不触发拖拽
          if (e.target.closest('button') || e.target.closest('.sap-switch')) return;
          dragging = true;
          header.setPointerCapture(e.pointerId);
          const r = box.getBoundingClientRect();
          startL = r.left;
          startT = r.top;
          startX = e.clientX;
          startY = e.clientY;
          e.preventDefault();
        });

        header.addEventListener('pointermove', (e) => {
          if (!dragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          box.style.left = (startL + dx) + 'px';
          box.style.top = (startT + dy) + 'px';
          box.style.right = 'auto';
          e.preventDefault();
        });

        header.addEventListener('pointerup', () => { dragging = false; });
        header.addEventListener('pointercancel', () => { dragging = false; });
      })(p);

      // minimize
      p.querySelector('#sap-minbtn').addEventListener('click', () => {
        const isMin = p.classList.toggle('minimized');
        cfg.minimized = isMin;
        p.querySelector('#sap-minbtn').textContent = isMin ? '+' : '−';
        this.saveConfig(cfg);
      });

      // toggle enable
      const toggleEl = p.querySelector('#sap-toggle');
      toggleEl.checked = cfg.enabled;
      toggleEl.addEventListener('change', async (e) => {
        const on = e.target.checked;
        await this._toggle(on, cfg, statusEl);
      });

      // lite
      const liteEl = p.querySelector('#sap-lite');
      liteEl.checked = cfg.lite;
      liteEl.addEventListener('change', () => {
        cfg.lite = !!liteEl.checked;
        this._apply(cfg);
        if (cfg.enabled) {
          statusEl.textContent = cfg.lite ? '● 运行中（Lite：仅早反）' : '● 运行中（Full：含尾声）';
          statusEl.className = 'sap-status active';
        }
      });

      // mode
      p.querySelector('#sap-mode').addEventListener('change', e => {
        cfg.mode = e.target.value;
        this._apply(cfg);
      });

      // sliders
      const sliders = [
        { id: 'sap-depth',  key: 'depth',         mult: 0.01, disp: 'sap-depth-v',  fmt: (x)=> `${Math.round(x*100)}%` },
        { id: 'sap-width',  key: 'width',         mult: 0.01, disp: 'sap-width-v',  fmt: (x)=> `${x.toFixed(2)}x` },
        { id: 'sap-reverb', key: 'reverb',        mult: 0.01, disp: 'sap-reverb-v', fmt: (x)=> `${Math.round(x*100)}%` },
        { id: 'sap-height', key: 'virtualHeight', mult: 0.01, disp: 'sap-height-v', fmt: (x)=> `${Math.round(x*100)}%` },
        { id: 'sap-bass',   key: 'bass',          mult: 1,    disp: null },
        { id: 'sap-treble', key: 'treble',        mult: 1,    disp: null }
      ];

      sliders.forEach(s => {
        const el = p.querySelector('#' + s.id);
        el.addEventListener('input', e => {
          const v = parseFloat(e.target.value) * s.mult;
          cfg[s.key] = v;
          if (s.disp) p.querySelector('#' + s.disp).textContent = s.fmt(v);
          this._apply(cfg);
        }, { passive: true });
      });

      // presets (我已重调)
      const presets = this.presets();
      p.querySelectorAll('.sap-presets button').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.p;
          Object.assign(cfg, presets[key] || presets.reset);
          this._applyConfigToUI(cfg);
          this._apply(cfg);

          // 如果已启用，立即更新状态文案
          if (cfg.enabled) {
            statusEl.textContent = cfg.lite ? '● 运行中（Lite：仅早反）' : '● 运行中（Full：含尾声）';
            statusEl.className = 'sap-status active';
          }
        });
      });
    },

    _applyConfigToUI(cfg) {
      const p = this.panel;
      p.querySelector('#sap-mode').value = cfg.mode;

      p.querySelector('#sap-depth').value = Math.round(cfg.depth * 100);
      p.querySelector('#sap-width').value = Math.round(cfg.width * 100);
      p.querySelector('#sap-reverb').value = Math.round(cfg.reverb * 100);
      p.querySelector('#sap-height').value = Math.round(cfg.virtualHeight * 100);
      p.querySelector('#sap-bass').value = cfg.bass;
      p.querySelector('#sap-treble').value = cfg.treble;

      p.querySelector('#sap-depth-v').textContent = `${Math.round(cfg.depth * 100)}%`;
      p.querySelector('#sap-width-v').textContent = `${cfg.width.toFixed(2)}x`;
      p.querySelector('#sap-reverb-v').textContent = `${Math.round(cfg.reverb * 100)}%`;
      p.querySelector('#sap-height-v').textContent = `${Math.round(cfg.virtualHeight * 100)}%`;

      p.querySelector('#sap-toggle').checked = cfg.enabled;
      p.querySelector('#sap-lite').checked = cfg.lite;

      // minimized button text
      p.querySelector('#sap-minbtn').textContent = p.classList.contains('minimized') ? '+' : '−';
    },

    async _toggle(on, cfg, statusEl) {
      if (on) {
        const v = document.querySelector('video');
        if (!v) {
          statusEl.textContent = '● 未找到视频';
          statusEl.className = 'sap-status error';
          this.panel.querySelector('#sap-toggle').checked = false;
          return;
        }
        this.video = v;

        if (!this.engine) this.engine = new Sony360Engine();
        await this.engine.init(v);

        this.engine.applyConfig(cfg, true);
        this.engine.setEnabled(true);

        cfg.enabled = true;
        this.saveConfig(cfg);

        statusEl.textContent = cfg.lite ? '● 运行中（Lite：仅早反）' : '● 运行中（Full：含尾声）';
        statusEl.className = 'sap-status active';
      } else {
        if (this.engine) this.engine.setEnabled(false);
        cfg.enabled = false;
        this.saveConfig(cfg);
        statusEl.textContent = '● 已禁用';
        statusEl.className = 'sap-status';
      }
    },

    _apply(cfg) {
      if (this.engine) this.engine.applyConfig(cfg);
      this.saveConfig(cfg);
    }
  };

  // ============================================================
  // 6) 初始化 + YouTube SPA 自愈（URL变化 + video元素变化）
  // ============================================================

  function init() {
    const run = () => setTimeout(() => UI.createPanel(), 800);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();

    let lastUrl = location.href;
    let lastVideo = null;

    const maybeReinit = () => {
      if (!UI.panel) return;

      const toggle = UI.panel.querySelector('#sap-toggle');
      const shouldBeOn = !!toggle?.checked;
      if (!shouldBeOn || !UI.engine) return;

      const v = document.querySelector('video');
      if (!v) return;

      const urlChanged = location.href !== lastUrl;
      const videoChanged = v !== lastVideo;

      if (!urlChanged && !videoChanged) return;

      lastUrl = location.href;
      lastVideo = v;

      setTimeout(async () => {
        const vv = document.querySelector('video');
        if (!vv) return;
        if (vv !== UI.video) UI.video = vv;

        const cfg = UI.loadConfig();
        cfg.enabled = true;

        await UI.engine.init(vv);
        UI.engine.applyConfig(cfg, true);
        UI.engine.setEnabled(true);

        const statusEl = UI.panel?.querySelector('#sap-status');
        if (statusEl) {
          statusEl.textContent = cfg.lite ? '● 运行中（Lite：仅早反）' : '● 运行中（Full：含尾声）';
          statusEl.className = 'sap-status active';
        }
      }, 900);
    };

    // 监听 DOM 变化（兼容不同页面切换形态）
    new MutationObserver(() => {
      // 做轻量判定，避免每次都重建
      maybeReinit();
    }).observe(document, { childList: true, subtree: true });

    console.log('[Spatial Audio] 4.2.7 loaded');
  }

  init();
})();
