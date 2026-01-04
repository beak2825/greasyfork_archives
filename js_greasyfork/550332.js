// ==UserScript==
// @name         YouTube UX Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提升 YouTube 观看体验：记忆播放速度/音量、快速倍速控制、展开描述等（不绕过广告或检测）。作者：little fool
// @author       little fool
// @match        *://www.youtube.com/*
// @match        *://www.youtube.com/watch*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550332/YouTube%20UX%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/550332/YouTube%20UX%20Enhancer.meta.js
// ==/UserScript==

/*
  功能说明（安全合规）：
  - 记忆并在视频页面自动设置上次使用的播放速度与音量（仅对时长 > MIN_VIDEO_SECONDS 的视频生效，避免影响短广告）
  - 添加键盘快捷键：Shift+> 加速 0.25x、Shift+< 减速 0.25x、Shift+0 恢复 1x
  - 自动展开视频描述（如果折叠）
  - 隐藏页面上非必要的小部件以干净观感（不触碰广告元素）
*/

(function () {
  'use strict';

  const MIN_VIDEO_SECONDS = 30;      // 只有当视频时长大于此阈值时才自动应用速度/音量（防止影响短广告或片段）
  const DEFAULT_SPEED = 1.0;         // 默认速度（若无历史记录）
  const DEFAULT_VOLUME = 0.6;        // 默认音量（0.0 - 1.0）
  const STORAGE_KEY = 'yt_ux_enhancer_state_v1';

  // 读取/写入简单状态（GM_* 或 localStorage 兼容）
  function saveState(state) {
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(STORAGE_KEY, JSON.stringify(state));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) { console.warn('保存状态失败', e); }
  }
  function loadState() {
    try {
      let raw = null;
      if (typeof GM_getValue === 'function') {
        raw = GM_getValue(STORAGE_KEY);
      } else {
        raw = localStorage.getItem(STORAGE_KEY);
      }
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  // 等待 selector 出现
  function waitForSelector(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const q = document.querySelector(selector);
        if (q) {
          obs.disconnect();
          resolve(q);
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => {
        obs.disconnect();
        reject(new Error('timeout waiting for ' + selector));
      }, timeout);
    });
  }

  // 应用播放速度与音量（仅在视频足够长时）
  async function applyPlaybackSettings() {
    try {
      const video = await waitForSelector('video');
      if (!video) return;

      // 等待 video 元素加载 metadata 以获取 duration
      if (isNaN(video.duration) || video.duration === Infinity) {
        await new Promise(res => {
          const onLoaded = () => { video.removeEventListener('loadedmetadata', onLoaded); res(); };
          video.addEventListener('loadedmetadata', onLoaded);
        });
      }

      const state = loadState();
      const prevSpeed = (state && state.speed) ? state.speed : DEFAULT_SPEED;
      const prevVolume = (state && typeof state.volume === 'number') ? state.volume : DEFAULT_VOLUME;

      // 仅当视频长度大于阈值时自动设置（以尽量避免影响广告）
      if (video.duration && video.duration >= MIN_VIDEO_SECONDS) {
        video.playbackRate = prevSpeed;
        video.volume = prevVolume;
      }

      // 监听用户手动改变 playbackRate / volume，保存到 storage
      video.addEventListener('ratechange', () => {
        const s = loadState();
        s.speed = video.playbackRate;
        saveState(s);
      });
      video.addEventListener('volumechange', () => {
        const s = loadState();
        s.volume = video.volume;
        saveState(s);
      });

      // 当页面导航时，尝试保持设置（SPA 导航需重新应用）
      const observer = new MutationObserver(() => {
        // 如果页面替换了 video 元素，re-apply（轻量检查）
        const newVideo = document.querySelector('video');
        if (newVideo && newVideo !== video) {
          observer.disconnect();
          applyPlaybackSettings().catch(()=>{});
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });

    } catch (e) {
      // 忽略超时等错误
    }
  }

  // 快捷键：Shift+> / Shift+< / Shift+0
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (!e.shiftKey) return;
      const video = document.querySelector('video');
      if (!video) return;

      if (e.key === '>' || e.key === '.') { // Shift+. 或 Shift+>
        video.playbackRate = Math.round((video.playbackRate + 0.25) * 100) / 100;
        showToast(`Speed: ${video.playbackRate}x`);
        e.preventDefault();
      } else if (e.key === '<' || e.key === ',') { // Shift+, 或 Shift+<
        video.playbackRate = Math.max(0.25, Math.round((video.playbackRate - 0.25) * 100) / 100);
        showToast(`Speed: ${video.playbackRate}x`);
        e.preventDefault();
      } else if (e.key === '0') {
        video.playbackRate = 1.0;
        showToast('Speed: 1.0x');
        e.preventDefault();
      }
    });
  }

  // 简单页面内提示（不侵入）
  function showToast(text, ms = 1200) {
    try {
      let el = document.getElementById('yt-ux-enhancer-toast');
      if (!el) {
        el = document.createElement('div');
        el.id = 'yt-ux-enhancer-toast';
        Object.assign(el.style, {
          position: 'fixed', right: '16px', bottom: '16px', padding: '8px 12px',
          background: 'rgba(0,0,0,0.7)', color: '#fff', borderRadius: '6px', zIndex: 999999,
          fontSize: '13px', pointerEvents: 'none'
        });
        document.body.appendChild(el);
      }
      el.textContent = text;
      el.style.opacity = '1';
      clearTimeout(el._hideTimer);
      el._hideTimer = setTimeout(() => {
        el.style.transition = 'opacity 300ms';
        el.style.opacity = '0';
      }, ms);
    } catch (e) { /* ignore */ }
  }

  // 自动展开视频描述（如果被折叠）
  function expandDescription() {
    try {
      const descButton = document.querySelector('#more a[aria-expanded="false"], #more yt-formatted-string[is-expandable] + tp-yt-paper-button');
      if (descButton) {
        descButton.click();
      } else {
        // 新版 YouTube：查找 '更多' 按钮
        const btn = Array.from(document.querySelectorAll('tp-yt-paper-button, ytm-expandable-video-description-renderer button'))
          .find(b => /更多|展开|Show more/i.test(b.textContent));
        if (btn) btn.click();
      }
    } catch (e) { /* ignore */ }
  }

  // 清理页面上明显的非必要小部件（不影响广告区域）
  function tidyUI() {
    try {
      // 仅隐藏一些非功能性推荐小部件（示例，保持保守）
      const selectors = [
        '#promo', // 可能的促销条（若不是广告）
        '.ytp-ce-element' // 结尾推荐小卡片（不移除视频内容）
      ];
      selectors.forEach(s => {
        const els = document.querySelectorAll(s);
        els.forEach(el => {
          // 不直接 remove，尽量隐藏以便回退
          el.style.transition = 'opacity .2s';
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        });
      });
    } catch (e) { /* ignore */ }
  }

  // 主初始化
  function init() {
    applyPlaybackSettings();
    setupKeyboardShortcuts();
    // 在页面变化时多次尝试这些 UI 改善（YouTube SPA）
    const urlObserver = new MutationObserver(() => {
      // small debounce
      clearTimeout(window._ytux_timer);
      window._ytux_timer = setTimeout(() => {
        applyPlaybackSettings().catch(()=>{});
        expandDescription();
        tidyUI();
      }, 300);
    });
    urlObserver.observe(document.documentElement, { childList: true, subtree: true });

    // 首次立即尝试
    setTimeout(() => {
      expandDescription();
      tidyUI();
    }, 1200);
  }

  // 运行
  init();

})();
