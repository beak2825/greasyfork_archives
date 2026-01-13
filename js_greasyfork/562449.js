// ==UserScript==
// @name         Google Minimalist Ultra (Zen Mode)
// @namespace    https://greasyfork.org
// @version      0.1.0
// @description  极致净化的 Google 体验：隐藏头部、底部及多余元素。点击 Logo 中的第一个 'o' 切换模式。
// @author       zjw
// @match        *://www.google.com/*
// @match        *://www.google.com.hk/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562449/Google%20Minimalist%20Ultra%20%28Zen%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562449/Google%20Minimalist%20Ultra%20%28Zen%20Mode%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 选择器配置 ---
  const HEADER_SELECTOR = 'div[role="navigation"]';
  const FOOTER_SELECTOR = '.c93Gbe';
  const BUTTONS_WRAPPER = '.FPdoLc'; // 页面中心搜索按钮
  const LANG_BAR_SELECTOR = '#SIvCob'; // 语言切换栏

  // 搜索框内部图标：语音/图片搜索容器 + AI 模式按钮
  const SEARCH_INPUT_ICONS = '.fM33ce, .plR5qb';

  const STORAGE_KEY = 'google_auto_hide_active';

  const CONFIG = {
    triggerHeightTop: 60,
    triggerHeightBottom: 40,
    zIndex: 1000
  };

  // --- 修改处：改用 GM_getValue，默认值为 true ---
  let isEnabled = GM_getValue(STORAGE_KEY, true);

  function applySystem() {
    const header = document.querySelector(HEADER_SELECTOR);
    const footer = document.querySelector(FOOTER_SELECTOR);
    const footerTarget = footer?.parentElement || footer;
    const buttons = document.querySelector(BUTTONS_WRAPPER);
    const langBar = document.querySelector(LANG_BAR_SELECTOR)?.closest('.vcVZ7d') || document.querySelector(LANG_BAR_SELECTOR);
    const innerIcons = document.querySelectorAll(SEARCH_INPUT_ICONS);

    if (!header || !footerTarget) return;

    if (isEnabled) {
      // --- 开启隐藏模式 ---
      document.body.style.paddingTop = header.offsetHeight + 'px';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // 1. 隐藏 Header/Footer
      Object.assign(header.style, {
        position: 'absolute', top: '0', left: '0', right: '0', zIndex: CONFIG.zIndex,
        transition: 'transform 0.4s, opacity 0.4s', transform: 'translateY(-100%)', opacity: '0'
      });
      Object.assign(footerTarget.style, {
        position: 'absolute', bottom: '0', left: '0', right: '0', zIndex: CONFIG.zIndex,
        transition: 'transform 0.2s, opacity 0.2s', transform: 'translateY(100%)', opacity: '0'
      });

      // 2. 隐藏外部按钮和语言栏
      if (buttons) buttons.style.visibility = 'hidden';
      if (langBar) langBar.style.display = 'none';

      // 3. 隐藏搜索框内部图标 (语音、图片、AI模式)
      innerIcons.forEach(icon => {
        icon.style.opacity = '0';
        icon.style.pointerEvents = 'none';
      });

    } else {
      // --- 关闭隐藏模式 (恢复原生) ---
      document.body.style.paddingTop = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      [header, footerTarget].forEach(el => {
        el.style.position = el.style.transform = el.style.opacity = el.style.transition = '';
      });

      if (buttons) buttons.style.visibility = 'visible';
      if (langBar) langBar.style.display = 'block';

      innerIcons.forEach(icon => {
        icon.style.opacity = '1';
        icon.style.pointerEvents = 'auto';
      });
    }
  }

  function setupToggle() {
    // 这里的选择器保持你原有的逻辑
    const firstO = document.querySelector('svg.lnXdpd path');
    if (!firstO) return;

    firstO.style.pointerEvents = 'fill';
    firstO.style.cursor = 'pointer';

    firstO.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isEnabled = !isEnabled;
      // --- 修改处：改用 GM_setValue ---
      GM_setValue(STORAGE_KEY, isEnabled);
      applySystem();
    };
  }

  document.addEventListener('mousemove', (e) => {
    if (!isEnabled) return;
    const header = document.querySelector(HEADER_SELECTOR);
    const footer = document.querySelector(FOOTER_SELECTOR);
    const footerTarget = footer?.parentElement || footer;
    if (!header || !footerTarget) return;

    const mouseY = e.clientY;
    const isHeaderExpanded = header.querySelector('[aria-expanded="true"]') !== null;

    const showHeader = mouseY <= CONFIG.triggerHeightTop || isHeaderExpanded;
    header.style.transform = showHeader ? 'translateY(0)' : 'translateY(-100%)';
    header.style.opacity = showHeader ? '1' : '0';

    const showFooter = (window.innerHeight - mouseY) <= CONFIG.triggerHeightBottom;
    footerTarget.style.transform = showFooter ? 'translateY(0)' : 'translateY(100%)';
    footerTarget.style.opacity = showFooter ? '1' : '0';
  });

  window.addEventListener('load', () => {
    applySystem();
    setupToggle();
  });
})();