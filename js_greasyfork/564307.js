// ==UserScript==
// @name         ZK Course Auto Player (V2.3.1 Ultimate)
// @namespace    https://zkpingtai.com/
// @version      2.3.1
// @description  整合诱导播放逻辑 + 真实模拟点击 + 严格流程控制
// @match        *://*.zkpingtai.com/*
// @license      MIT  
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564307/ZK%20Course%20Auto%20Player%20%28V231%20Ultimate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564307/ZK%20Course%20Auto%20Player%20%28V231%20Ultimate%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const log = (...args) => console.log('%c[AutoCourse]', 'color:#4caf50;font-weight:bold', ...args);
  const warn = (...args) => console.warn('%c[AutoCourse]', 'color:#ff9800;font-weight:bold', ...args);

  let currentVideo = null;
  let authInProgress = false; // 认证状态锁
  let lastStartClickTime = 0;

  const CONFIG = {
    CHECK_INTERVAL: 1500,
    STEP1_DELAY: 2000,          // 开始认证延迟
    STEP2_DELAY: 5000,          // 进行认证延迟（给够倒计时稳定时间）
    CLICK_COOLDOWN: 8000,       // 延长冷却防止重复触发
    NEXT_COURSE_DELAY: 3000
  };

  /* ================== 工具函数 (全套事件模拟) ================== */

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function isVisible(el) {
    if (!el) return false;
    try {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
    } catch (e) { return false; }
  }

  // 模拟真实人工点击（整合自 V2.2.1）
  async function realUserClick(el, name) {
    if (!el) return false;
    try {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };

      el.dispatchEvent(new MouseEvent('mouseenter', opts));
      await sleep(50);
      el.dispatchEvent(new MouseEvent('mousedown', opts));
      if (el.focus) el.focus();
      await sleep(100);
      el.dispatchEvent(new MouseEvent('mouseup', opts));
      el.click(); // 触发原生点击
      log(`✓ 真实点击执行成功: ${name}`);
      return true;
    } catch (e) {
      warn(`点击 ${name} 异常`, e);
      return false;
    }
  }

  /* ================== 核心认证逻辑 (流程优化) ================== */

  async function checkAndClickAuth() {
    if (authInProgress) return;

    // 获取按钮并即时检查可见性
    const step2BtnRaw = document.querySelector('#switchCamera') ||
                        Array.from(document.querySelectorAll('.dialog_botton')).find(el => el.innerText.includes('进行认证'));
    const step1BtnRaw = Array.from(document.querySelectorAll('button.el-button')).find(el => el.innerText.includes('开始认证'));

    const step2Btn = isVisible(step2BtnRaw) ? step2BtnRaw : null;
    const step1Btn = isVisible(step1BtnRaw) ? step1BtnRaw : null;

    if (!step2Btn && !step1Btn) return;

    // 暂停视频，准备处理弹窗
    if (currentVideo && !currentVideo.paused) {
      currentVideo.pause();
      log('⏸ 发现弹窗，暂停视频');
    }

    authInProgress = true;

    try {
      // 优先级 1: 处理可见的第二步
      if (step2Btn) {
        log(`🚀 发现【进行认证】，等待 ${CONFIG.STEP2_DELAY}ms (倒计时稳定)...`);
        await sleep(CONFIG.STEP2_DELAY);
        if (isVisible(step2Btn)) {
          await realUserClick(step2Btn, '进行认证 (Step 2)');
          await sleep(2000);
        }
      }
      // 优先级 2: 处理可见的第一步
      else if (step1Btn) {
        const now = Date.now();
        if (now - lastStartClickTime > CONFIG.CLICK_COOLDOWN) {
          log(`⚠️ 发现【开始认证】，${CONFIG.STEP1_DELAY}ms 后点击...`);
          await sleep(CONFIG.STEP1_DELAY);
          if (isVisible(step1Btn)) {
            if (await realUserClick(step1Btn, '开始认证 (Step 1)')) {
              lastStartClickTime = Date.now();
            }
          }
        }
      }
    } catch (e) {
      console.error('认证异常:', e);
    } finally {
      authInProgress = false;
    }
  }

  /* ================== 播放逻辑 (UI 诱导增强版) ================== */

  async function videoLoop() {
    try {
      const video = document.querySelector('video');
      if (!video) return;

      if (currentVideo !== video) {
        currentVideo = video;
        log('✓ 绑定视频元素');
        video.addEventListener('ended', () => {
          setTimeout(playNextCourse, CONFIG.NEXT_COURSE_DELAY);
        }, { once: true });
      }

      // 如果正在处理认证，或者视频在播，就跳过
      if (authInProgress || !video.paused || video.ended) return;

      // 诱导播放：点击覆盖层
      const playUI = document.querySelector('.fist_face') || document.querySelector('.outter');
      if (playUI && isVisible(playUI)) {
        log('👆 尝试点击 UI 播放按钮以诱导弹窗');
        playUI.click();
        await sleep(1000);
      }

      // API 强制播放
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } catch (err) {
      warn('播放循环异常:', err.message);
    }
  }

  /* ================== 切课逻辑 ================== */

  function playNextCourse() {
    const list = Array.from(document.querySelectorAll('.list_item'));
    const activeIdx = list.findIndex(i => i.classList.contains('list_item_active'));
    if (activeIdx !== -1 && activeIdx < list.length - 1) {
      const next = list[activeIdx + 1];
      if (next && next.classList.contains('list_item_nolearn')) {
        log('⏭ 切换到下一课');
        next.click();
      }
    }
  }

  /* ================== 初始化 ================== */

  function init() {
    log('🚀 ZK 整合增强版 V2.3.1 启动');
    log('策略: UI诱导播放 + 全序列点击模拟 + 严格可见性过滤');

    setInterval(checkAndClickAuth, 1000); // 认证高频检测
    setInterval(videoLoop, 2500);         // 视频诱导播放
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();