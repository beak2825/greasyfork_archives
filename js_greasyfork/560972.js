// ==UserScript==
// @name         YOUTUBE MOBILE + Video Background Play Fix (Perf-Optimized)
// @namespace    https://greasyfork.org/en/users/50-couchy
// @version      20260101
// @description  Prevents YouTube and Vimeo from pausing videos when minimizing or switching tabs. Optimized for minimal overhead.
// @author       ?
// @license      CC-BY-4.0
// @match        *://*.youtube.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://*.vimeo.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560972/YOUTUBE%20MOBILE%20%2B%20Video%20Background%20Play%20Fix%20%28Perf-Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560972/YOUTUBE%20MOBILE%20%2B%20Video%20Background%20Play%20Fix%20%28Perf-Optimized%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * ===== 形式化“规约/不变式”（Coq风格）=====
   * Spec:
   *  - 页面切到后台/最小化时，站点不应因可见性变化而自动暂停视频。
   * Invariants:
   *  - (I1) visibilitychange / webkitvisibilitychange 不传播到站点监听器。
   *  - (I2) 在需要的平台上，document.hidden / visibilityState 始终表现为“可见”。
   *  - (I3) YouTube 的 keep-alive 仅在“主视频播放 && 处于后台(桌面)/或移动端环境”时触发。
   * Performance:
   *  - 仅在检测到 video play 后才启用 keep-alive 定时器；空闲时长间隔唤醒。
   */

  const host = location.hostname;
  const IS_YOUTUBE =
    /(^|\.)youtube\.com$/.test(host) || /(^|\.)youtube-nocookie\.com$/.test(host);
  const IS_MOBILE_YOUTUBE = host === 'm.youtube.com';
  const IS_DESKTOP_YOUTUBE = IS_YOUTUBE && !IS_MOBILE_YOUTUBE;
  const IS_VIMEO = /(^|\.)vimeo\.com$/.test(host);

  if (!IS_YOUTUBE && !IS_VIMEO) return;

  const IS_ANDROID = /Android/i.test(navigator.userAgent);

  // ---------------------------
  // 1) Page Visibility：必要时“伪装始终可见”
  // 原脚本逻辑：Android 或 非桌面 YouTube 才伪装
  // ---------------------------
  if (IS_ANDROID || !IS_DESKTOP_YOUTUBE) {
    const safeDefine = (prop, getterValue) => {
      try {
        Object.defineProperty(document, prop, {
          configurable: true,
          get: () => getterValue,
        });
      } catch (_) { /* ignore if non-configurable */ }
    };

    safeDefine('hidden', false);
    safeDefine('visibilityState', 'visible');
    // 兼容一些旧实现（几乎零成本）
    safeDefine('webkitHidden', false);
    safeDefine('webkitVisibilityState', 'visible');
  }

  // 截断可见性事件（捕获阶段最早拦截，开销极小）
  const stopEvt = (e) => { e.stopImmediatePropagation(); e.stopPropagation(); };
  window.addEventListener('visibilitychange', stopEvt, true);
  window.addEventListener('webkitvisibilitychange', stopEvt, true);

  // ---------------------------
  // 2) Fullscreen：Vimeo 拦截 fullscreenchange
  // ---------------------------
  if (IS_VIMEO) {
    window.addEventListener('fullscreenchange', stopEvt, true);
    window.addEventListener('webkitfullscreenchange', stopEvt, true);
  }

  // ---------------------------
  // 3) YouTube：仅在需要时做 keep-alive（极致性能版）
  // ---------------------------
  if (!IS_YOUTUBE) return;

  // 可调参数（保守默认：性能优先）
  const KEEP = {
    enabled: true,
    baseMs: 60_000,       // 需要时：约每 60 秒
    jitterMs: 10_000,     // 抖动，避免太“机械”
    idleMs: 300_000,      // 不需要时：5 分钟才醒一次
    keyCode: 18           // 保持与原脚本一致（Alt）
  };

  // 优先锁定主播放器 video（减少误触发“缩略图预览 video”）
  const MAIN_VIDEO_SELECTOR = [
    '#movie_player video',
    'ytd-player video',
    'ytd-watch-flexy video',
    'ytm-player video',
    'ytm-watch video'
  ].join(',');

  const randJitter = () => (Math.random() - 0.5) * KEEP.jitterMs;

  const getMainVideoPlaying = () => {
    const v = document.querySelector(MAIN_VIDEO_SELECTOR) || document.querySelector('video');
    if (!v) return null;
    if (v.paused || v.ended) return null;
    // readyState >= 2 更像“真正在播”
    if (v.readyState < 2) return null;
    return v;
  };

  const shouldPing = () => {
    if (!KEEP.enabled) return false;
    const v = getMainVideoPlaying();
    if (!v) return false;

    // 桌面 YouTube：只在后台/失焦时 ping（性能最省）
    if (IS_DESKTOP_YOUTUBE && !IS_ANDROID) {
      // 不伪装 hidden 的情况下，hasFocus/hidden 可用
      return !document.hasFocus() || document.hidden === true;
    }

    // 移动端/Android：为了“后台不暂停”，播放时就 ping（这里已伪装 hidden/state，靠 hasFocus 未必可靠）
    return true;
  };

  const sendKeyEvent = (type, code) => {
    // 构造事件对象成本很小（且 Event 不能复用），只在需要时才构造
    document.dispatchEvent(new KeyboardEvent(type, {
      bubbles: true,
      cancelable: true,
      key: 'Alt',
      code: 'AltLeft',
      keyCode: code,
      which: code,
      altKey: true
    }));
  };

  const ping = () => {
    // 与原脚本保持一致：keydown + keyup
    sendKeyEvent('keydown', KEEP.keyCode);
    sendKeyEvent('keyup', KEEP.keyCode);
  };

  let timer = 0;
  let started = false;

  const schedule = (ms) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(tick, ms);
  };

  const tick = () => {
    const need = shouldPing();
    if (need) ping();
    schedule(need ? Math.max(0, KEEP.baseMs + randJitter()) : KEEP.idleMs);
  };

  const startIfNeeded = () => {
    if (started) return;
    started = true;
    // 先短延迟一次，让页面播放器初始化更稳
    schedule(1500);
  };

  // 只有当 video 真正开始播放才启动（空页面/不播放=0 开销）
  document.addEventListener('play', (e) => {
    const t = e.target;
    if (t && t.tagName === 'VIDEO') startIfNeeded();
  }, true);

  // 离开页面就别跑了（省资源）
  window.addEventListener('pagehide', () => {
    if (timer) clearTimeout(timer);
    timer = 0;
    started = false;
  }, true);

})();
