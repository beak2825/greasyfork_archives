// ==UserScript==
// @name         nodeseek和deepflood智能目录
// @namespace    https://github.com/renshengyoumeng
// @version      1.10
// @description  智能目录：PC端悬浮拖拽（不记录位置），移动端右侧呼出（自动收起），支持窗口尺寸实时切换与平滑滚动。
// @match        https://www.nodeseek.com/post-*-1
// @match        https://www.deepflood.com/post-*-1
// @grant        none
// @author       renshengyoumeng
// @author2      yzcjd, chatgpt5
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553493/nodeseek%E5%92%8Cdeepflood%E6%99%BA%E8%83%BD%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/553493/nodeseek%E5%92%8Cdeepflood%E6%99%BA%E8%83%BD%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== 通用平滑滚动函数 =====
  const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smoothScrollTo = (targetY, duration = 600) => {
    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;
    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);
      if (elapsed < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  // ===== 基础过滤逻辑 =====
  const hostname = location.hostname;
  const exclude = ['cloudflare', 'captcha', 'challenge', 'login', 'auth', 'verify'];
  if (exclude.some(k => hostname.includes(k) || location.pathname.includes(k))) return;

  // ===== 创建目录结构 =====
  const toc = document.createElement('div');
  toc.id = 'smart-toc';
  toc.innerHTML = `
    <div id="toc-header" style="background:#ccc;padding:5px;cursor:move;">📑 目录</div>
    <div id="toc-list" style="margin:0;padding:0 6px;overflow:auto;max-height:calc(80vh - 30px);"></div>
  `;
  document.body.appendChild(toc);

  const tocList = toc.querySelector('#toc-list');

  // ===== 提取标题 =====
  const ignore = ['header','footer','nav','aside','.navbar','.sidebar','.avatar','.logo','.banner','.desc','.tabs','.player','.playlist','.switch','.user','.meta'];
  const isVisible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const isValidHeading = el => isVisible(el) && !ignore.some(sel => el.closest(sel));

  let headings = [
    document.querySelector('.post-title h1 a.post-title-link'),
    ...document.querySelector('.post-content')?.querySelectorAll('main h1,h2,h3,h4,h5,h6, article h1,h2,h3,h4,h5,h6, .content h1,h2,h3,h4,h5,h6') || []
  ].filter(Boolean).filter(isValidHeading);

  if (headings.length <= 1) { toc.remove(); return; }

  const longest = Math.max(...headings.map(el => el.textContent.trim().length));
  if (longest >= 20) toc.style.width = '375px';

  headings.forEach((el, i) => { if (!el.id) el.id = 'smart-toc-' + i; });
  const getLevel = tag => parseInt(tag.replace('H', ''));
  headings.forEach(el => {
    const level = Math.min(getLevel(el.tagName), 3);
    const a = document.createElement('a');
    a.href = `#${el.id}`;
    a.textContent = el.textContent.trim();
    const indent = level === 1 ? 0 : (level - 1) * 1.5;
    a.style.cssText = `display:block;padding:3px 10px;padding-left:${indent}em;color:inherit;text-decoration:none;user-select:none;`;
    tocList.appendChild(a);
  });

  // ===== 点击目录跳转 =====
  tocList.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'a') {
      const id = e.target.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        smoothScrollTo(scrollTop + rect.top - 60, 600);
      }
    }
  });

  // ===== PC模式 =====
  function setupDesktopMode() {
    cleanupMode();

    toc.style.cssText = `
      position:fixed; top:50px; right:50px; width:250px; max-height:80vh;
      background:#fff; border:1px solid #ccc; border-radius:8px;
      box-shadow:0 2px 8px rgba(0,0,0,0.15); overflow:hidden;
      z-index:99999; font-family:sans-serif;
    `;

    const header = toc.querySelector('#toc-header');
    header.style.cursor = 'move';

    // 启用简单拖拽（不记忆）
    header.addEventListener('mousedown', e => {
      e.preventDefault();
      const rect = toc.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      const move = e => {
        toc.style.left = `${e.clientX - offsetX}px`;
        toc.style.top = `${e.clientY - offsetY}px`;
      };
      const stop = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', stop);
    });
  }

  // ===== 移动端模式 =====
  let toggleBtn = null, overlay = null;
  function setupMobileMode() {
    cleanupMode();

    toc.style.cssText = `
      position: fixed;
      top: 0;
      right: -80%;
      width: 75%;
      height: 100%;
      background: #fff;
      box-shadow: -2px 0 8px rgba(0,0,0,0.2);
      z-index: 99999;
      border-radius: 0;
      transition: right 0.4s ease;
      overflow-y: auto;
      visibility: hidden;
    `;

    toggleBtn = document.createElement('button');
    toggleBtn.textContent = '📑 目录';
    toggleBtn.style.cssText = `
      position: fixed;
      top: 65px;
      right: 15px;
      z-index: 100000;
      background: #0078d7;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    `;

    overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.4);
      z-index: 99998;
      display: none;
    `;
    document.body.appendChild(toggleBtn);
    document.body.appendChild(overlay);

    let isOpen = false;
    const openTOC = () => {
      toc.style.visibility = 'visible';
      toc.style.right = '0';
      overlay.style.display = 'block';
      isOpen = true;
    };
    const closeTOC = () => {
      toc.style.right = '-80%';
      overlay.style.display = 'none';
      isOpen = false;
    };
    toggleBtn.addEventListener('click', () => isOpen ? closeTOC() : openTOC());
    overlay.addEventListener('click', closeTOC);
    tocList.addEventListener('click', e => {
      if (e.target.tagName.toLowerCase() === 'a') closeTOC();
    });
    toc.querySelector('#toc-header').style.cursor = 'default';
  }

  // ===== 清理上一个模式 =====
  function cleanupMode() {
    toc.style.left = '';
    toc.style.top = '';
    toc.style.right = '';
    if (toggleBtn) { toggleBtn.remove(); toggleBtn = null; }
    if (overlay) { overlay.remove(); overlay = null; }
  }

  // ===== 初始化 & 自适应切换 =====
  let isMobileMode = window.innerWidth < 768;
  function updateMode() {
    const nowMobile = window.innerWidth < 768;
    if (nowMobile !== isMobileMode) {
      isMobileMode = nowMobile;
      nowMobile ? setupMobileMode() : setupDesktopMode();
    }
  }

  // 初始化
  isMobileMode ? setupMobileMode() : setupDesktopMode();

  // 窗口变化监听（防抖）
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateMode, 300);
  });

  console.log('✅ nodeseek/deepflood 智能目录 v1.10 自适应切换版 启用成功');
})();
