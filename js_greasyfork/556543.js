// ==UserScript==
// @name         YouTube Ad Muter + Auto Skip Button (VoidMuser Mod)
// @namespace    
// @version      2.1.0
// @description  不隐藏广告：播放广告时自动静音；出现“跳过广告”按钮时自动点击；广告结束自动恢复静音状态。
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @exclude      https://studio.youtube.com/*
// @grant        none
// @license      MIT
// @noframes
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556543/YouTube%20Ad%20Muter%20%2B%20Auto%20Skip%20Button%20%28VoidMuser%20Mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556543/YouTube%20Ad%20Muter%20%2B%20Auto%20Skip%20Button%20%28VoidMuser%20Mod%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*********************
   * Quick Switches（开关配置，改 true/false 即可）
   *********************/
  const MASTER_ENABLE = true;              // ✅ 总开关：false 时脚本不做任何事
  const ENABLE_AD_MUTE = true;             // ✅ 广告自动静音 + 结束后自动恢复
  const ENABLE_AUTO_SKIP_BUTTON = true;    // ✅ 自动点击“跳过广告”按钮
  const ENABLE_CHAIN_SKIP = true;          // ✅ 连环多广告时多次检测跳过

  /*********************
   * Adjustable Parameters（一般不用动）
   *********************/
  const DEBUG = false;                     // 调试日志
  const CSS_HIDE_SELECTORS = [];           // 不隐藏广告
  const REMOVE_PAIRS = [];                 // 不移除广告 DOM
  const CHECK_DEBOUNCE_MS = 150;           // 去抖延时
  const INTERVAL_CHECK_MS = 2000;          // 兜底检测间隔
  const INTERVAL_CLEAN_MS = 4000;          // 兜底清理间隔（现在几乎无作用）
  const SEEK_EPSILON = 0.25;               // 占位（不再用于跳广告）

  // 连环多广告检测参数
  const CHAIN_SKIP_MAX = 4;
  const CHAIN_SKIP_DELAY_MS = 800;

  /*********************
   * Internal State
   *********************/
  const state = {
    skipping: false,        // 防重入
    scheduled: false,       // 去抖标记

    // 广告静音相关状态
    adMuted: false,
    prevMuted: null,
    prevVolume: null
  };

  /*********************
   * Helper Methods
   *********************/
  const log = (...args) => { if (DEBUG) console.log('[ASYA]', ...args); };

  const isMobile = location.hostname === 'm.youtube.com';
  const isMusic  = location.hostname === 'music.youtube.com';
  const isShorts = () => location.pathname.startsWith('/shorts/');

  function addCss() {
    const sel = CSS_HIDE_SELECTORS.join(',');
    if (!sel) return;
    const style = document.createElement('style');
    style.textContent = `${sel}{display:none !important;}`;
    (document.head || document.documentElement).appendChild(style);
  }

  function removeAdElements() {
    if (isShorts()) return;
    for (const [outerSel, innerSel] of REMOVE_PAIRS) {
      const outer = document.querySelector(outerSel);
      if (!outer) continue;
      const inner = outer.querySelector(innerSel);
      if (!inner) continue;
      outer.remove();
      log('Removed ad block / 移除广告块：', outerSel, 'contains / 包含', innerSel);
    }
  }

  // 查询“跳过广告”按钮
  function querySkipButton() {
    const byClass = document.querySelector(
      '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-container button'
    );
    if (byClass) return byClass;

    // 兜底：用 aria-label 或 文本匹配
    const btn = [...document.querySelectorAll('button')].find(b => {
      const t = (b.getAttribute('aria-label') || b.textContent || '').trim();
      return /skip ad|skip ads|跳过广告/i.test(t);
    });
    return btn || null;
  }

  // 广告上下文探测
  function detectAdContext() {
    const adShowing    = !!document.querySelector('.ad-showing');
    const pieCountdown = !!document.querySelector('.ytp-ad-timed-pie-countdown-container');
    const survey       = !!document.querySelector('.ytp-ad-survey-questions');
    const skipBtn      = querySkipButton();
    const adLikely     = adShowing || pieCountdown || survey || !!skipBtn;
    return { adShowing, pieCountdown, survey, skipBtn, adLikely };
  }

  /*********************
   * 广告静音逻辑
   * - ENABLE_AD_MUTE = true 时：
   *   · 广告出现：记录原静音 & 音量 -> 强制静音
   *   · 广告结束：恢复到原来的静音 & 音量
   *********************/
  function ensureAdMute(ctx) {
    if (!ENABLE_AD_MUTE) return;

    const video = document.querySelector('video.html5-main-video');
    if (!video) return;

    if (ctx.adLikely) {
      // 进入广告：只在首次进入时记录原状态
      if (!state.adMuted) {
        state.adMuted = true;
        state.prevMuted = video.muted;
        state.prevVolume = video.volume;
        if (DEBUG) log('Ad detected, muting video / 检测到广告，开始静音');
      }
      video.muted = true;
      try { video.volume = 0; } catch (_) {}
    } else {
      // 广告结束：自动恢复进入广告前的声音状态
      if (state.adMuted) {
        if (DEBUG) log('Ad ended, restore volume / 广告结束，还原音量');
        if (state.prevMuted !== null) {
          video.muted = state.prevMuted;
        }
        if (typeof state.prevVolume === 'number') {
          try { video.volume = state.prevVolume; } catch (_) {}
        }
        state.adMuted = false;
        state.prevMuted = null;
        state.prevVolume = null;
      }
    }
  }

  /*********************
   * “软跳过”：只点官方“跳过广告”按钮
   * - 这里完全符合你说的：
   *   · 不再做 currentTime = duration - SEEK_EPSILON 的快进穿广告
   *   · 不再用 player.seekTo 绕过广告
   *   · 只要按钮出现就帮你点一下
   *********************/
  function trySoftSkip(ctx) {
    if (!ENABLE_AUTO_SKIP_BUTTON) return false;
    if (ctx.skipBtn) {
      try {
        ctx.skipBtn.click();
        log('Clicked Skip Button / 点击跳过按钮');
        return true;
      } catch (_) {
        // ignore
      }
    }
    return false;
  }

  /*********************
   * 连环多广告检测：成功跳过后，再检测几轮
   * - 继续保留你原脚本的“连环多广告”思路
   *********************/
  function chainSkipIfNeeded() {
    if (!ENABLE_CHAIN_SKIP) return;

    let count = 0;

    const loop = () => {
      if (!MASTER_ENABLE) return;
      if (count >= CHAIN_SKIP_MAX) return;
      count++;

      const ctx = detectAdContext();
      if (!ctx.adLikely) return;

      if (!state.skipping) {
        skipAd(true);  // fromChain = true，避免再次开启连环
      }

      if (count < CHAIN_SKIP_MAX) {
        setTimeout(loop, CHAIN_SKIP_DELAY_MS);
      }
    };

    setTimeout(loop, CHAIN_SKIP_DELAY_MS);
  }

  /*********************
   * 主流程
   * - 广告一出现：skipAd() → 静音 + 有按钮就点
   * - 广告结束：下一轮 skipAd() 检测到“非广告” → 自动恢复声音
   *********************/
  function skipAd(fromChain) {
    if (!MASTER_ENABLE) return;  // 总开关
    if (isShorts()) return;      // 不处理 Shorts，避免误伤
    if (state.skipping) return;
    state.skipping = true;

    let acted = false;

    try {
      const ctx = detectAdContext();

      // 1. 先处理广告静音 / 非广告时恢复声音
      ensureAdMute(ctx);

      // 2. 不是广告就结束（只负责静音恢复）
      if (!ctx.adLikely) return;

      // 3. 是广告：如果开启了自动跳过，就只点官方“跳过广告”按钮
      const softOK = trySoftSkip(ctx);
      if (softOK) {
        acted = true;
      }

      // 4. 不再做：
      //    - currentTime = duration - SEEK_EPSILON 的快进穿广告
      //    - player.seekTo 的时间线绕过
      //    - tryHeavyReload 的重载穿广告
      //    所以不可跳过广告会“正常播完”
      //    且在 ENABLE_AD_MUTE = true 时，全程静音
    } finally {
      state.skipping = false;

      // 如果刚刚确实点过“跳过广告”，且不是连环调用，则再跑一轮连环检测
      if (acted && !fromChain) {
        chainSkipIfNeeded();
      }
    }
  }

  /*********************
   * 去抖调度
   *********************/
  function scheduleCheck(delay = CHECK_DEBOUNCE_MS) {
    if (state.scheduled) return;
    state.scheduled = true;
    setTimeout(() => {
      state.scheduled = false;
      skipAd();
    }, delay);
  }

  /*********************
   * 观察 DOM 变化：广告出现/消失都会动 DOM
   *********************/
  function setupObserver() {
    const target = document.body || document.documentElement;
    if (!target) return;

    const mo = new MutationObserver(() => {
      scheduleCheck(50);
    });
    mo.observe(target, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  /*********************
   * 启动
   *********************/
  addCss();                 // 现在不会隐藏任何广告元素（数组为空）
  removeAdElements();       // 现在也不会移除广告 DOM（数组为空）

  setupObserver();
  scheduleCheck(0);         // 载入页面时先检测一次

  // 兜底定时器：防止 MutationObserver 漏掉某些情况
  setInterval(() => scheduleCheck(), INTERVAL_CHECK_MS);
  setInterval(() => removeAdElements(), INTERVAL_CLEAN_MS);
})();
