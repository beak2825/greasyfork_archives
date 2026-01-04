// ==UserScript==
// @name         北京科技大学（USTB）党课刷课助手
// @version      1.0.0
// @description  自动恢复视频播放，包括每五分钟的暂停弹窗和切出视频的暂停
// @match        https://dxpx.ustb.edu.cn/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @author       Nelson Boss
// @namespace https://greasyfork.org/users/1530549
// @downloadURL https://update.greasyfork.org/scripts/553653/%E5%8C%97%E4%BA%AC%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%EF%BC%88USTB%EF%BC%89%E5%85%9A%E8%AF%BE%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553653/%E5%8C%97%E4%BA%AC%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%EF%BC%88USTB%EF%BC%89%E5%85%9A%E8%AF%BE%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**************** 配置区域 ****************/
  const CONFIG = {
    modalSel: '.el-message-box',
    okBtnSel: '.el-message-box__btns .el-button.el-button--primary',
    closeBtnSel: '.el-message-box__headerbtn',
    textHintRegex: /(视频已暂停|点击确定按钮继续学习|确定|继续)/,
    scanIntervalMs: 1200,
    clickCooldownMs: 1500,
    videoSelectors: ['video'],
  };

  /**************** 功能变量 ****************/
  let enabled = true;
  let lastClick = 0;

  /**************** 工具函数 ****************/
  const isVisible = (el) => {
    if (!el || !(el instanceof Element)) return false;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0;
  };

  const findEligibleModals = () => {
    return Array.from(document.querySelectorAll(CONFIG.modalSel)).filter((el) => {
      if (!isVisible(el)) return false;
      const txt = (el.textContent || '').trim();
      return CONFIG.textHintRegex.test(txt);
    });
  };

  const tryClickAny = () => {
    const now = Date.now();
    if (now - lastClick < CONFIG.clickCooldownMs) return false;

    const modals = findEligibleModals();
    for (const m of modals) {
      const ok = m.querySelector(CONFIG.okBtnSel);
      if (ok && isVisible(ok)) {
        ok.click();
        lastClick = Date.now();
        setTimeout(resumeVideos, 400);
        return true;
      }
      const close = m.querySelector(CONFIG.closeBtnSel);
      if (close && isVisible(close)) {
        close.click();
        lastClick = Date.now();
        setTimeout(resumeVideos, 400);
        return true;
      }
    }
    return false;
  };

  function resumeVideos() {
    if (!enabled) return;
    for (const sel of CONFIG.videoSelectors) {
      document.querySelectorAll(sel).forEach(async (v) => {
        if (!(v instanceof HTMLMediaElement)) return;
        if (v.paused) {
          try {
            if (!v.muted) v.muted = true;
            await v.play();
          } catch (_) {}
        }
      });
    }
  }

  function scan() {
    if (!enabled) return;
    const clicked = tryClickAny();
    if (!clicked) resumeVideos();
  }

  /**************** 自动扫描机制 ****************/
  const intervalId = setInterval(scan, CONFIG.scanIntervalMs);
  const mo = new MutationObserver(() => requestAnimationFrame(scan));
  mo.observe(document.documentElement, { childList: true, subtree: true });

  /**************** UI 控制面板 ****************/
  const panel = document.createElement('div');
  panel.id = 'autoclick-control-panel';
  panel.innerHTML = `
    <div class="ac-header">🎬 USTB党课刷课助手</div>
    <div class="ac-body">
      <label class="switch">
        <input type="checkbox" id="ac-toggle" checked />
        <span class="slider"></span>
      </label>
      <span id="ac-status">已启用</span>
    </div>
  `;
  const style = document.createElement('style');
  style.textContent = `
    #autoclick-control-panel {
      position: fixed;
      bottom: 15px;
      right: 15px;
      background: rgba(20,20,20,0.8);
      color: #fff;
      font-family: "Microsoft YaHei", sans-serif;
      font-size: 13px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      z-index: 999999;
      width: 220px;
      user-select: none;
      transition: all 0.3s ease;
    }
    #autoclick-control-panel:hover {
      background: rgba(30,30,30,0.9);
    }
    .ac-header {
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      text-align: center;
      font-weight: bold;
    }
    .ac-body {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    /* 开关按钮样式 */
    .switch {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 22px;
    }
    .switch input { display: none; }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #ccc;
      border-radius: 22px;
      transition: 0.3s;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: 0.3s;
    }
    input:checked + .slider {
      background-color: #4caf50;
    }
    input:checked + .slider:before {
      transform: translateX(24px);
    }
  `;
  document.body.appendChild(style);
  document.body.appendChild(panel);

  const toggle = panel.querySelector('#ac-toggle');
  const statusText = panel.querySelector('#ac-status');
  toggle.addEventListener('change', () => {
    enabled = toggle.checked;
    statusText.textContent = enabled ? '已启用' : '已关闭';
    statusText.style.color = enabled ? '#4caf50' : '#ff5555';
  });

  /**************** 热键快速切换 ****************/
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyX') {
      enabled = !enabled;
      toggle.checked = enabled;
      statusText.textContent = enabled ? '已启用' : '已关闭';
      statusText.style.color = enabled ? '#4caf50' : '#ff5555';
    }
  });

  console.log('%c[USTB党课刷课助手] 已加载', 'color: #4caf50');
})();