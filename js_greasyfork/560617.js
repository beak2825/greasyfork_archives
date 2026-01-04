// ==UserScript==
// @name         Silent Reaper · 一键采集复制器
// @namespace    http://yuyehk.cn/
// @author       yuyehk
// @version      1.0.1
// @description  一个安静、高效的悬浮复制工具。
// @match        https://tvla-annotator.byte-test.com/reviewer/*
// @grant        GM_setClipboard
// @run-at       document-end
// @license Private; All rights reserved.
// @downloadURL https://update.greasyfork.org/scripts/560617/Silent%20Reaper%20%C2%B7%20%E4%B8%80%E9%94%AE%E9%87%87%E9%9B%86%E5%A4%8D%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560617/Silent%20Reaper%20%C2%B7%20%E4%B8%80%E9%94%AE%E9%87%87%E9%9B%86%E5%A4%8D%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ====== 配置区 ======
  const TARGET_SELECTOR = 'body > div.min-h-screen.bg-gray-50.text-gray-900.p-4 > div > div > div.col-span-1.space-y-4 > div:nth-child(6) > div.mt-4.pt-4.border-t.border-gray-200.space-y-2.text-xs > div:nth-child(2) > span.text-gray-700.font-medium';
  const TAB = '\t';

  // ====== 工具函数 ======
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function toast(msg, ok = true) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = `
      position: fixed;
      left: 50%;
      top: 16px;
      transform: translateX(-50%);
      z-index: 2147483647;
      padding: 10px 14px;
      border-radius: 999px;
      font-size: 13px;
      color: #fff;
      background: ${ok ? 'rgba(34,197,94,.95)' : 'rgba(239,68,68,.95)'};
      box-shadow: 0 10px 30px rgba(0,0,0,.25);
      backdrop-filter: blur(6px);
      letter-spacing: .2px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  async function copyText(text) {
    // 1) 优先 GM_setClipboard（油猴更稳定）
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
        return true;
      }
    } catch (_) {}

    // 2) 退化到 Clipboard API
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    // 3) 再退化到 execCommand
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (_) {}

    return false;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getTargetText() {
    const node = document.querySelector(TARGET_SELECTOR);
    return node ? (node.innerText ?? '').trim() : '';
  }

  // 某些页面是异步渲染的：给它一点等待重试
  async function waitForTarget(maxWaitMs = 6000) {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      const t = getTargetText();
      if (t) return t;
      await sleep(200);
    }
    return getTargetText(); // 最后再取一次，可能为空
  }

  // ====== 注入样式（更二次元一点：发光、描边、贴纸感） ======
  const style = document.createElement('style');
  style.textContent = `
    .acg-float-btn {
      position: fixed;
      right: 8px;
      top: 38%;
      width: 56px;
      height: 56px;
      border-radius: 999px;
      z-index: 2147483646;
      cursor: grab;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;

      /* 二次元贴纸感：渐变 + 高光 */
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), rgba(255,255,255,.35) 32%, rgba(255,105,180,.65) 60%, rgba(124,58,237,.75) 100%);
      border: 2px solid rgba(255,255,255,.75);
      box-shadow:
        0 10px 24px rgba(0,0,0,.25),
        0 0 22px rgba(236,72,153,.45),
        0 0 34px rgba(124,58,237,.35);
      backdrop-filter: blur(6px);
    }

    .acg-float-btn:active { cursor: grabbing; transform: scale(.98); }

    .acg-float-inner {
      width: 100%;
      height: 100%;
      border-radius: 999px;
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
    }

    /* 亮片扫光 */
    .acg-float-inner::before {
      content: "";
      position: absolute;
      left: -60%;
      top: -30%;
      width: 60%;
      height: 160%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,.65), transparent);
      transform: rotate(22deg);
      animation: acgSweep 2.8s ease-in-out infinite;
      opacity: .65;
    }

    @keyframes acgSweep {
      0%   { left: -70%; opacity: .0; }
      20%  { opacity: .55; }
      55%  { opacity: .65; }
      100% { left: 120%; opacity: .0; }
    }

    /* 简易二次元头像图标（纯CSS） */
    .acg-face {
      width: 30px;
      height: 30px;
      border-radius: 999px;
      background: rgba(255,255,255,.9);
      box-shadow: inset 0 -4px 10px rgba(0,0,0,.08);
      position: relative;
    }

    .acg-face::before, .acg-face::after{
      content:"";
      position:absolute;
      top: 12px;
      width: 5px;
      height: 7px;
      border-radius: 999px;
      background: rgba(17,24,39,.85);
      box-shadow: 0 0 0 2px rgba(59,130,246,.25);
    }
    .acg-face::before { left: 9px; }
    .acg-face::after  { right: 9px; }

    .acg-mouth{
      position:absolute;
      left: 50%;
      top: 20px;
      transform: translateX(-50%);
      width: 10px;
      height: 6px;
      border: 2px solid rgba(17,24,39,.7);
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0 0 999px 999px;
      opacity: .85;
    }

    .acg-badge {
      position: absolute;
      right: -2px;
      bottom: -2px;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: rgba(255,255,255,.85);
      border: 2px solid rgba(255,255,255,.75);
      display: grid;
      place-items: center;
      font-size: 12px;
      box-shadow: 0 6px 14px rgba(0,0,0,.18);
    }
  `;
  document.head.appendChild(style);

  // ====== 创建按钮 ======
  const btn = document.createElement('div');
  btn.className = 'acg-float-btn';
  btn.title = '点击复制：URL + TAB + 文本（可拖动）';

  const inner = document.createElement('div');
  inner.className = 'acg-float-inner';

  const face = document.createElement('div');
  face.className = 'acg-face';

  const mouth = document.createElement('div');
  mouth.className = 'acg-mouth';
  face.appendChild(mouth);

  const badge = document.createElement('div');
  badge.className = 'acg-badge';
  badge.textContent = '⎘'; // 复制符号

  inner.appendChild(face);
  inner.appendChild(badge);
  btn.appendChild(inner);
  document.body.appendChild(btn);

  // ====== 点击复制（区分拖动 vs 点击） ======
  let isDragging = false;
  let dragMoved = false;

  btn.addEventListener('click', async (e) => {
    // 如果刚刚发生拖动，就不当作点击
    if (dragMoved) return;

    const text = await waitForTarget();
    if (!text) {
      toast('没找到目标文本（selector匹配不到）', false);
      return;
    }

    const payload = `${location.href}${TAB}${text}`;
    const ok = await copyText(payload);
    toast(ok ? '已复制到剪贴板 ✨' : '复制失败（权限/环境限制）', ok);
  });

  // ====== 拖动逻辑（鼠标/触屏） ======
  function onPointerDown(e) {
    isDragging = true;
    dragMoved = false;
    btn.setPointerCapture?.(e.pointerId);

    const rect = btn.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const offsetX = startX - rect.left;
    const offsetY = startY - rect.top;

    function onMove(ev) {
      if (!isDragging) return;
      const dx = Math.abs(ev.clientX - startX);
      const dy = Math.abs(ev.clientY - startY);
      if (dx + dy > 4) dragMoved = true;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = ev.clientX - offsetX;
      let top = ev.clientY - offsetY;

      left = clamp(left, 6, vw - rect.width - 6);
      top = clamp(top, 6, vh - rect.height - 6);

      btn.style.left = `${left}px`;
      btn.style.top = `${top}px`;
      btn.style.right = 'auto';
    }

    function onUp() {
      isDragging = false;

      // 贴边：放手后自动吸附到右边
      const rect2 = btn.getBoundingClientRect();
      btn.style.left = 'auto';
      btn.style.right = '8px';
      btn.style.top = `${rect2.top}px`;

      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);

      // 防止“拖完立刻触发 click”
      setTimeout(() => { dragMoved = false; }, 0);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  btn.addEventListener('pointerdown', onPointerDown);
})();
