// ==UserScript==
// @name         YouTube Speed Control (Persistent + Slider + Wheel)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Single-button menu with persistent speed memory, slider (0-10x), wheel adjust, and SPA-safe rebinding
// @author       Barthazar
// @match        https://www.youtube.com/*
// @match        https://www.yfsp.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561719/YouTube%20Speed%20Control%20%28Persistent%20%2B%20Slider%20%2B%20Wheel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561719/YouTube%20Speed%20Control%20%28Persistent%20%2B%20Slider%20%2B%20Wheel%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SPEED_KEY = 'yt_playback_rate';
  const QUICK_SPEEDS = [0.5, 1, 1.25, 1.75, 2];

  const STEP = 0.25;
  const MAX_SPEED = 10;

  // 你要求 0~10，但 0 倍速对 HTML5 video/YouTube 很不稳定
  // 这里做“显示允许到 0”，但实际应用时会钳到 0.25，避免视频卡死/异常。
  const MIN_APPLIED_SPEED = 0.25;
  const SLIDER_MIN = 0; // UI上允许到0

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const roundToStep = (v) => Math.round(v / STEP) * STEP;

  const loadSpeed = () => {
    const n = parseFloat(localStorage.getItem(SPEED_KEY));
    return Number.isFinite(n) ? n : 1;
  };
  const saveSpeed = (r) => localStorage.setItem(SPEED_KEY, String(r));

  const getVideo = () => document.querySelector('video.html5-main-video, .html5-main-video');
  const getPlayer = () => document.querySelector('.html5-video-player');

  // ===== UI refs =====
  let root, mainBtn, panel, slider, speedRow;
  let open = false;

  // ===== video binding refs =====
  let currentVideo = null;
  let onRateChangeBound = null;
  let pendingRefresh = false;

  function updateMainText(rate) {
    if (!mainBtn) return;
    mainBtn.textContent = `▶︎ ${rate.toFixed(2)}x`;
  }

  function updateUIFromRate(rate) {
    updateMainText(rate);
    if (slider) slider.value = rate;
  }

  // 设置速度（来自滑条/滚轮/快速按钮）
  function applyRate(rate, { persist = true } = {}) {
    const v = currentVideo || getVideo();
    if (!v) return;

    let r = roundToStep(rate);
    r = clamp(r, SLIDER_MIN, MAX_SPEED);

    // 实际应用速度：避免 0 倍速导致异常
    const applied = clamp(r, MIN_APPLIED_SPEED, MAX_SPEED);

    // 仅当确实变化时才设置，避免触发多余 ratechange
    if (Math.abs(v.playbackRate - applied) > 1e-6) {
      v.playbackRate = applied;
    }

    // UI显示用“应用后的速度”（更真实）
    updateUIFromRate(applied);

    if (persist) saveSpeed(applied);
  }

  // 当用户用 YouTube 原生菜单改速时：只更新UI+保存，不反向再 set playbackRate（避免循环）
  function handleRateChange() {
    const v = currentVideo;
    if (!v) return;
    const r = roundToStep(v.playbackRate);
    const applied = clamp(r, MIN_APPLIED_SPEED, MAX_SPEED);

    updateUIFromRate(applied);
    saveSpeed(applied);
  }

  function bindToVideo(v) {
    if (!v || v === currentVideo) return;

    // 清理旧绑定
    if (currentVideo && onRateChangeBound) {
      currentVideo.removeEventListener('ratechange', onRateChangeBound);
    }

    currentVideo = v;
    onRateChangeBound = handleRateChange;
    currentVideo.addEventListener('ratechange', onRateChangeBound);

    // 初始套用“记忆速度”
    const target = clamp(roundToStep(loadSpeed()), MIN_APPLIED_SPEED, MAX_SPEED);
    applyRate(target, { persist: false });

    // SPA/加载时 YouTube 可能会稍后覆盖 playbackRate：做一次轻量兜底
    const enforce = () => {
      if (currentVideo !== v) return;
      const t = clamp(roundToStep(loadSpeed()), MIN_APPLIED_SPEED, MAX_SPEED);
      if (Math.abs(v.playbackRate - t) > 1e-6) v.playbackRate = t;
      updateUIFromRate(t);
    };

    v.addEventListener('loadedmetadata', enforce, { once: true });
    setTimeout(enforce, 700);
  }

  function ensureUI() {
    // 如果UI已经存在且还在DOM里，直接复用
    root = document.getElementById('yt-speed-menu');
    if (root) {
      mainBtn = root.querySelector('[data-role="mainBtn"]');
      panel = root.querySelector('[data-role="panel"]');
      slider = root.querySelector('[data-role="slider"]');
      speedRow = root.querySelector('[data-role="speedRow"]');
      return;
    }

    const player = getPlayer();
    if (!player) return;

    root = document.createElement('div');
    root.id = 'yt-speed-menu';
    root.style.cssText = `
      position:absolute;
      top:20px;
      right:20px;
      z-index:1000;
      font-family:Arial,sans-serif;
      color:#fff;
      user-select:none;
    `;

    mainBtn = document.createElement('div');
    mainBtn.dataset.role = 'mainBtn';
    mainBtn.style.cssText = `
      background:rgba(0,0,0,0.7);
      padding:4px 8px;
      border-radius:6px;
      cursor:pointer;
      font-size:13px;
      opacity:0.35;
      transition:opacity .2s;
    `;

    panel = document.createElement('div');
    panel.dataset.role = 'panel';
    panel.style.cssText = `
      margin-top:6px;
      background:rgba(0,0,0,0.75);
      padding:8px;
      border-radius:6px;
      display:none;
      gap:6px;
      flex-direction:column;
      min-width:160px;
    `;

    root.addEventListener('mouseenter', () => (mainBtn.style.opacity = '1'));
    root.addEventListener('mouseleave', () => {
      if (panel.style.display === 'none') mainBtn.style.opacity = '0.35';
    });

    mainBtn.addEventListener('click', () => {
      open = !open;
      panel.style.display = open ? 'flex' : 'none';
      mainBtn.style.opacity = '1';
    });

    // Slider
    slider = document.createElement('input');
    slider.dataset.role = 'slider';
    slider.type = 'range';
    slider.min = SLIDER_MIN;
    slider.max = MAX_SPEED;
    slider.step = STEP;
    slider.value = 1;
    slider.style.cssText = `width:100%; cursor:pointer;`;

    slider.addEventListener('input', () => {
      applyRate(parseFloat(slider.value));
    });

    // Quick buttons
    speedRow = document.createElement('div');
    speedRow.dataset.role = 'speedRow';
    speedRow.style.cssText = `
      display:flex;
      gap:4px;
      flex-wrap:wrap;
      justify-content:center;
    `;

    QUICK_SPEEDS.forEach((rate) => {
      const b = document.createElement('div');
      b.textContent = `${rate}x`;
      b.style.cssText = `
        border:1px solid #fff;
        border-radius:4px;
        padding:2px 6px;
        font-size:12px;
        cursor:pointer;
      `;
      b.addEventListener('click', () => applyRate(rate));
      speedRow.appendChild(b);
    });

    // Wheel adjust (only on control area)
    root.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const v = currentVideo || getVideo();
        if (!v) return;
        const delta = e.deltaY < 0 ? STEP : -STEP;
        applyRate(v.playbackRate + delta);
      },
      { passive: false }
    );

    panel.appendChild(slider);
    panel.appendChild(speedRow);

    root.appendChild(mainBtn);
    root.appendChild(panel);

    player.appendChild(root);
  }

  function refresh() {
    ensureUI();

    // 确保控件挂在当前 player 上（YouTube SPA 会换 player 容器）
    const player = getPlayer();
    if (player && root && root.parentElement !== player) {
      player.appendChild(root);
    }

    const v = getVideo();
    if (v) bindToVideo(v);
  }

  // 节流刷新：避免 MutationObserver 高频触发造成性能问题
  function scheduleRefresh() {
    if (pendingRefresh) return;
    pendingRefresh = true;
    requestAnimationFrame(() => {
      pendingRefresh = false;
      refresh();
    });
  }

  // 初次加载
  window.addEventListener('load', () => scheduleRefresh());

  // YouTube SPA 导航事件（性能更好）
  document.addEventListener('yt-navigate-finish', () => setTimeout(scheduleRefresh, 150));
  document.addEventListener('yt-page-data-updated', () => setTimeout(scheduleRefresh, 150));

  // 兜底：轻量观察（节流）
  const obs = new MutationObserver(() => scheduleRefresh());
  obs.observe(document.documentElement, { childList: true, subtree: true });

  // 立即尝试一次（有些情况下 load 之前就能拿到 player）
  scheduleRefresh();
})();
