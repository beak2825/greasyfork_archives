// ==UserScript==
// @name         B站倍速&字幕热键 (Z/X/C/B) + 倍速提示
// @namespace    https://tampermonkey.net/
// @version      0.3
// @description  Z减速、X复位、C加速（0.25步进，0.25~5x），B开/关字幕，并在屏幕上显示当前倍速提示
// @author       zybin
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557488/B%E7%AB%99%E5%80%8D%E9%80%9F%E5%AD%97%E5%B9%95%E7%83%AD%E9%94%AE%20%28ZXCB%29%20%2B%20%E5%80%8D%E9%80%9F%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557488/B%E7%AB%99%E5%80%8D%E9%80%9F%E5%AD%97%E5%B9%95%E7%83%AD%E9%94%AE%20%28ZXCB%29%20%2B%20%E5%80%8D%E9%80%9F%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 倍速配置
  const STEP = 0.25;
  const MIN_RATE = 0.25;
  const MAX_RATE = 5;
  const DEFAULT_RATE = 1.0;

  // 字幕按钮（打开菜单）
  const SUBTITLE_BUTTON_SELECTORS = [
    '.bpx-player-ctrl-subtitle>button',                // 新版 bpx 主字幕按钮
    '.bpx-player-ctrl-btn[aria-label*="字幕"]',
    '.bpx-player-ctrl-btn[aria-label*="CC"]',
    '.squirtle-subtitle-wrap>button',                  // 番剧播放器
    '.bpui-btn[title*="字幕"]'                         // 老播放器
  ];

  // 字幕优先级（按顺序尝试）
  const SUBTITLE_PRIORITY = [
    {
      name: 'shuangyu',             // 双语字幕
      type: 'switch',
      openSelector: '.bui-switch-input[aria-label="双语字幕"]'
    },
    {
      name: 'aichinese',            // AI中文
      type: 'button',
      openSelector: '.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]'
    },
    {
      name: 'chinese',              // 普通中文字幕
      type: 'button',
      openSelector: '.bpx-player-ctrl-subtitle-language-item[data-lan="zh-CN"]'
    },
    {
      name: 'english',              // 英文字幕
      type: 'button',
      openSelector: '.bpx-player-ctrl-subtitle-language-item[data-lan="en-US"]'
    }
  ];

  // 菜单里的“关闭字幕”开关
  const CLOSE_SELECTOR = '.bpx-player-ctrl-subtitle-close-switch';

  // 本页内记住一次状态
  let lastSubtitleOn = null;

  // --------- 倍速提示浮层 ---------
  let speedToast = null;
  let speedToastTimer = null;

  function ensureSpeedToast() {
    if (speedToast && document.body.contains(speedToast)) return speedToast;

    const div = document.createElement('div');
    div.id = 'tm-bili-speed-toast';
    div.style.position = 'fixed';
    div.style.left = '50%';
    div.style.top = '20%';
    div.style.transform = 'translateX(-50%)';
    div.style.padding = '8px 16px';
    div.style.borderRadius = '999px';
    div.style.background = 'rgba(0, 0, 0, 0.75)';
    div.style.color = '#fff';
    div.style.fontSize = '20px';
    div.style.fontWeight = '600';
    div.style.zIndex = '999999';
    div.style.pointerEvents = 'none';
    div.style.opacity = '0';
    div.style.transition = 'opacity 0.15s ease-out';
    div.style.userSelect = 'none';

    document.body.appendChild(div);
    speedToast = div;
    return div;
  }

  function showSpeedToast(rate) {
    const toast = ensureSpeedToast();
    toast.textContent = rate + 'x';

    // 先清掉之前的隐藏计时器
    if (speedToastTimer) {
      clearTimeout(speedToastTimer);
      speedToastTimer = null;
    }

    // 立刻显示
    toast.style.opacity = '1';

    // 一段时间后淡出
    speedToastTimer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 700); // 可自行调节显示时间
  }

  // --------- 倍速相关 ---------

  function getMainVideo() {
    const videos = Array.from(document.querySelectorAll('video'));
    if (!videos.length) return null;

    let best = videos[0];
    for (const v of videos) {
      if (v.readyState > 0 &&
          v.clientWidth * v.clientHeight >= best.clientWidth * best.clientHeight) {
        best = v;
      }
    }
    return best;
  }

  function applyRate(video, targetRate) {
    let rate = targetRate;
    rate = Math.max(MIN_RATE, Math.min(MAX_RATE, rate)); // 限制区间
    rate = Math.round(rate / STEP) * STEP;               // 对齐 0.25
    rate = Number(rate.toFixed(2));
    video.playbackRate = rate;
    console.log('[Bilibili Hotkey] playbackRate =', rate);

    // 显示倍速提示
    showSpeedToast(rate);
  }

  function changeRate(delta) {
    const video = getMainVideo();
    if (!video) return;
    const current = video.playbackRate || DEFAULT_RATE;
    applyRate(video, current + delta);
  }

  function resetRate() {
    const video = getMainVideo();
    if (!video) return;
    applyRate(video, DEFAULT_RATE);
  }

  // --------- 字幕相关 ---------

  function querySubtitleMenuButton() {
    const selector = SUBTITLE_BUTTON_SELECTORS.join(',');
    return document.querySelector(selector);
  }

  function openSubtitleMenu() {
    const btn = querySubtitleMenuButton();
    if (!btn) return null;
    btn.click();                       // 打开菜单
    return btn;
  }

  // 尝试从 DOM 判断字幕当前是否开启
  function detectSubtitleOnFromDom() {
    const closeSwitch = document.querySelector(CLOSE_SELECTOR);
    if (!closeSwitch) return null;

    const input =
      closeSwitch.querySelector('.bui-switch-input') ||
      closeSwitch.querySelector('input[type="checkbox"]');

    if (input) {
      if (typeof input.checked === 'boolean') {
        return input.checked;
      }
      const ariaChecked = input.getAttribute('aria-checked') || input.getAttribute('aria-pressed');
      if (ariaChecked != null) {
        return ariaChecked === 'true';
      }
    }

    const ariaPressed = closeSwitch.getAttribute('aria-pressed');
    if (ariaPressed != null) {
      return ariaPressed === 'true';
    }

    return null;
  }

  // 从优先级里挑一个可以点的字幕选项
  function pickSubtitleToOpen() {
    for (const cfg of SUBTITLE_PRIORITY) {
      const el = document.querySelector(cfg.openSelector);
      if (el) return { cfg, el };
    }
    const any = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan]');
    if (any) return { cfg: { type: 'button' }, el: any };
    return null;
  }

  function toggleSubtitle() {
    const menuBtn = openSubtitleMenu();
    if (!menuBtn) {
      console.warn('[Bilibili Hotkey] 未找到字幕菜单按钮');
      return;
    }

    setTimeout(() => {
      let isOn = detectSubtitleOnFromDom();
      if (isOn == null && lastSubtitleOn != null) {
        isOn = lastSubtitleOn;
      }

      if (isOn) {
        const closeSwitch = document.querySelector(CLOSE_SELECTOR);
        if (closeSwitch) {
          closeSwitch.click();
          lastSubtitleOn = false;
          console.log('[Bilibili Hotkey] 关闭字幕');
        } else {
          console.warn('[Bilibili Hotkey] 找不到关闭字幕开关');
        }
      } else {
        const target = pickSubtitleToOpen();
        if (target && target.el) {
          target.el.click();
          lastSubtitleOn = true;
          console.log('[Bilibili Hotkey] 开启字幕:', target.cfg?.name || 'unknown');
        } else {
          console.warn('[Bilibili Hotkey] 未找到可用字幕选项');
        }
      }

      try {
        menuBtn.click(); // 收起菜单
      } catch (e) {}
    }, 180);
  }

  // --------- 通用：避免跟输入框冲突 ---------

  function isTypingInInput(e) {
    const t = e.target;
    if (!t) return false;
    if (t.isContentEditable) return true;
    const tag = t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    return false;
  }

  // --------- 键盘监听 ---------

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (isTypingInInput(e)) return;

    const key = e.key.toLowerCase();
    let handled = false;

    switch (key) {
      case 'z':   // 减速
        changeRate(-STEP);
        handled = true;
        break;
      case 'x':   // 复位 1.0x
        resetRate();
        handled = true;
        break;
      case 'c':   // 加速
        changeRate(STEP);
        handled = true;
        break;
      case 'b':   // 字幕 开/关
        toggleSubtitle();
        handled = true;
        break;
      default:
        break;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  console.log('[Bilibili Hotkey] Z-/X1/C+，B字幕开关 + 倍速提示 已加载');
})();
