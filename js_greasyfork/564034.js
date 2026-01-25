// ==UserScript==
// @name         B站倍速&字幕热键 (Z/X/C/B) + 记忆倍速
// @namespace    https://tampermonkey.net/
// @version      0.6
// @description  Z减速、X复位、C加速（0.25步进），B开/关字幕。优先匹配简体中文/双语字幕，支持自动。
// @author       zybin
// @license      GPL-2.0
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/festival/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564034/B%E7%AB%99%E5%80%8D%E9%80%9F%E5%AD%97%E5%B9%95%E7%83%AD%E9%94%AE%20%28ZXCB%29%20%2B%20%E8%AE%B0%E5%BF%86%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/564034/B%E7%AB%99%E5%80%8D%E9%80%9F%E5%AD%97%E5%B9%95%E7%83%AD%E9%94%AE%20%28ZXCB%29%20%2B%20%E8%AE%B0%E5%BF%86%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 配置区域 ---
  const STEP = 0.25;
  const MIN_RATE = 0.25;
  const MAX_RATE = 5;
  const DEFAULT_RATE = 1.0;
  const STORAGE_KEY = 'tm_bili_saved_rate';

  // 字幕按钮选择器
  const SUBTITLE_BUTTON_SELECTORS = [
    '.bpx-player-ctrl-subtitle>button',
    '.bpx-player-ctrl-btn[aria-label*="字幕"]',
    '.bpx-player-ctrl-btn[aria-label*="CC"]',
    '.squirtle-subtitle-wrap>button',
    '.bpui-btn[title*="字幕"]'
  ];

  // 字幕语言优先级 (根据需求调整：简体中文 > 双语 > AI中文 > 英文)
  const SUBTITLE_PRIORITY = [
    // 1. 标准简体中文 (人工)
    { name: 'chinese', type: 'button', openSelector: '.bpx-player-ctrl-subtitle-language-item[data-lan="zh-CN"]' },
    // 2. 双语字幕 (通常包含中文)
    { name: 'shuangyu', type: 'switch', openSelector: '.bui-switch-input[aria-label="双语字幕"]' },
    // 3. AI 生成中文 (兜底中文)
    { name: 'aichinese', type: 'button', openSelector: '.bpx-player-ctrl-subtitle-language-item[data-lan="ai-zh"]' },
    // 4. 英文
    { name: 'english', type: 'button', openSelector: '.bpx-player-ctrl-subtitle-language-item[data-lan="en-US"]' }
  ];

  const CLOSE_SELECTOR = '.bpx-player-ctrl-subtitle-close-switch';
  
  // --- 全局变量 ---
  let lastSubtitleOn = null;
  let speedToast = null;
  let speedToastTimer = null;
  
  // 读取记忆的倍速
  let currentTargetRate = parseFloat(localStorage.getItem(STORAGE_KEY)) || DEFAULT_RATE;
  let lastVideoSrc = ''; 

  // --------- UI 提示 ---------
  function ensureSpeedToast() {
    if (speedToast && document.body.contains(speedToast)) return speedToast;
    const div = document.createElement('div');
    div.id = 'tm-bili-speed-toast';
    div.style.cssText = `
      position: fixed;
      left: 50%;
      top: 20%;
      transform: translateX(-50%);
      padding: 8px 16px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      z-index: 2147483647;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease-out;
      user-select: none;
      font-family: sans-serif;
    `;
    document.body.appendChild(div);
    speedToast = div;
    return div;
  }

  function showSpeedToast(rate) {
    const toast = ensureSpeedToast();
    toast.textContent = rate + 'x';
    if (speedToastTimer) {
      clearTimeout(speedToastTimer);
      speedToastTimer = null;
    }
    toast.style.opacity = '1';
    speedToastTimer = setTimeout(() => {
      toast.style.opacity = '0';
    }, 700);
  }

  // --------- 视频元素获取 ---------
  function getMainVideo() {
    const videos = Array.from(document.querySelectorAll('video'));
    if (!videos.length) return null;
    let best = videos[0];
    let maxArea = 0;
    for (const v of videos) {
      if (v.readyState > 0 || v.src) {
        const area = (v.clientWidth || 0) * (v.clientHeight || 0);
        if (area > maxArea) {
          maxArea = area;
          best = v;
        }
      }
    }
    return best;
  }

  // --------- 倍速逻辑 (含记忆) ---------
  function setAndSaveRate(rate) {
    rate = Math.max(MIN_RATE, Math.min(MAX_RATE, rate));
    rate = Math.round(rate / STEP) * STEP;
    rate = Number(rate.toFixed(2));
    
    currentTargetRate = rate;
    localStorage.setItem(STORAGE_KEY, rate);

    const video = getMainVideo();
    if (video) {
      video.playbackRate = rate;
      console.log('[Bilibili Hotkey] Rate set:', rate);
      showSpeedToast(rate);
    }
  }

  function applySavedRate(video) {
    if (!video) return;
    if (Math.abs(video.playbackRate - currentTargetRate) > 0.01) {
       video.playbackRate = currentTargetRate;
    }
  }

  function changeRate(delta) {
    const video = getMainVideo();
    const baseRate = video ? video.playbackRate : currentTargetRate;
    setAndSaveRate(baseRate + delta);
  }

  function resetRate() {
    setAndSaveRate(DEFAULT_RATE);
  }

  // --------- 字幕逻辑 (含优先级) ---------
  function querySubtitleMenuButton() {
    const selector = SUBTITLE_BUTTON_SELECTORS.join(',');
    return document.querySelector(selector);
  }

  function openSubtitleMenu() {
    const btn = querySubtitleMenuButton();
    if (!btn) return null;
    btn.click();
    return btn;
  }

  function detectSubtitleOnFromDom() {
    const closeSwitch = document.querySelector(CLOSE_SELECTOR);
    if (!closeSwitch) return null;
    const input = closeSwitch.querySelector('.bui-switch-input') || closeSwitch.querySelector('input[type="checkbox"]');
    if (input) {
      if (typeof input.checked === 'boolean') return input.checked;
      const ariaChecked = input.getAttribute('aria-checked') || input.getAttribute('aria-pressed');
      if (ariaChecked != null) return ariaChecked === 'true';
    }
    const ariaPressed = closeSwitch.getAttribute('aria-pressed');
    if (ariaPressed != null) return ariaPressed === 'true';
    return null;
  }

  function pickSubtitleToOpen() {
    // 遍历优先级列表
    for (const cfg of SUBTITLE_PRIORITY) {
      const el = document.querySelector(cfg.openSelector);
      if (el) return { cfg, el };
    }
    // 如果列表都没找到，尝试找任意一个含“中”字的选项
    const allItems = document.querySelectorAll('.bpx-player-ctrl-subtitle-language-item');
    for (const item of allItems) {
        if (item.textContent && item.textContent.includes('中')) {
            return { cfg: { name: 'fuzzy-chinese', type: 'button' }, el: item };
        }
    }
    // 最后的兜底
    const any = document.querySelector('.bpx-player-ctrl-subtitle-language-item[data-lan]');
    if (any) return { cfg: { type: 'button' }, el: any };
    return null;
  }

  function toggleSubtitle() {
    const menuBtn = openSubtitleMenu();
    if (!menuBtn) return;
    setTimeout(() => {
      let isOn = detectSubtitleOnFromDom();
      if (isOn == null && lastSubtitleOn != null) isOn = lastSubtitleOn;

      if (isOn) {
        const closeSwitch = document.querySelector(CLOSE_SELECTOR);
        if (closeSwitch) {
          closeSwitch.click();
          lastSubtitleOn = false;
          console.log('[Bilibili Hotkey] Subtitle OFF');
        }
      } else {
        const target = pickSubtitleToOpen();
        if (target && target.el) {
          target.el.click();
          lastSubtitleOn = true;
          console.log('[Bilibili Hotkey] Subtitle ON:', target.cfg?.name || 'unknown');
        } else {
            // 如果没找到字幕选项，但菜单打开了，尝试直接根据 UI 状态判断是否需要点"关闭"
            console.log('[Bilibili Hotkey] No subtitle option found.');
        }
      }
      try { menuBtn.click(); } catch (e) {}
    }, 180); // 菜单动画延迟
  }

  // --------- 守卫进程 ---------
  function startSpeedGuardian() {
    setInterval(() => {
      const video = getMainVideo();
      if (!video) return;

      if (video.src !== lastVideoSrc) {
        lastVideoSrc = video.src;
        setTimeout(() => applySavedRate(video), 200);
        video.addEventListener('loadedmetadata', () => applySavedRate(video), { once: true });
        video.addEventListener('canplay', () => applySavedRate(video), { once: true });
      }
    }, 1000);
  }

  // --------- 键盘事件 ---------
  function isTypingInInput(e) {
    const t = e.target;
    if (!t) return false;
    if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return true;
    if (t.classList && (t.classList.contains('ipt-txt') || t.classList.contains('textarea'))) return true;
    return false;
  }

  window.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (isTypingInInput(e)) return;

    const key = e.key.toLowerCase();
    let handled = false;

    switch (key) {
      case 'z':
        changeRate(-STEP);
        handled = true;
        break;
      case 'x':
        resetRate();
        handled = true;
        break;
      case 'c':
        changeRate(STEP);
        handled = true;
        break;
      case 'b':
        toggleSubtitle();
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, { capture: true });

  startSpeedGuardian();
})();