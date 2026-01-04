// ==UserScript==
// @name         ChatGPT Logo 换成 DeepSeek
// @namespace    https://gist.doracoin.cc/doracoin/39fd3ec77d3044fc95b408bdf6c0ac13
// @version      2025.09.12
// @license      MIT
// @description  替换 ChatGPT 左上角 sidebar-header 的 SVG logo 为 DeepSeek logo，并实现 #page-header 向上收缩（垂直折叠），支持 SPA 重绘、状态记忆，并增加可配置项与主题适配按钮。
// @author       Doracoin
// @match        https://chatgpt.com/*
// @icon         https://deepseek.com/favicon.ico
// @run-at       document-body
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549573/ChatGPT%20Logo%20%E6%8D%A2%E6%88%90%20DeepSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/549573/ChatGPT%20Logo%20%E6%8D%A2%E6%88%90%20DeepSeek.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====== 配置区 ======
    const CONFIG = {
        deepseekLogoUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/DeepSeek_logo.svg',
        storageKey: 'deepseek_header_collapsed_v2',
        headerMaxHeight: 82, // header 默认高度
        buttonSize: 36, // 按钮尺寸(px)
        buttonPosition: { top: 10, right: 12 }, // 按钮固定位置
        enableLogs: false // 是否启用 console.log 调试
    };
    // ====================

    // 动态样式，支持深色/浅色主题自动适配
    GM_addStyle(`
    #page-header {
      --ds-header-max-height: ${CONFIG.headerMaxHeight}px;
      max-height: var(--ds-header-max-height);
      overflow: hidden;
      transition: max-height 260ms ease, padding 260ms ease;
    }
    #page-header.collapsed {
      max-height: 0 !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
    #page-header.collapsed * {
      visibility: hidden;
      pointer-events: none;
    }

    #ds-page-header-toggle {
      position: fixed;
      top: ${CONFIG.buttonPosition.top}px;
      right: ${CONFIG.buttonPosition.right}px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: ${CONFIG.buttonSize}px;
      height: ${CONFIG.buttonSize}px;
      border-radius: 6px;
      font-size: 16px;
      line-height: 1;
      background: var(--ds-btn-bg, rgba(0,0,0,0.6));
      color: var(--ds-btn-fg, #fff);
      cursor: pointer;
      user-select: none;
      transition: transform 140ms ease, opacity 140ms ease, background 200ms ease;
      box-shadow: 0 6px 18px rgba(0,0,0,0.35);
      margin-top: 38px;
    }
    #ds-page-header-toggle:hover {
      transform: translateY(-2px);
    }

    @media (prefers-color-scheme: light) {
      #ds-page-header-toggle {
        --ds-btn-bg: rgba(255,255,255,0.85);
        --ds-btn-fg: #000;
      }
    }
    @media (prefers-color-scheme: dark) {
      #ds-page-header-toggle {
        --ds-btn-bg: rgba(0,0,0,0.6);
        --ds-btn-fg: #fff;
      }
    }
  `);

    function log(...args) {
        if (CONFIG.enableLogs) console.log('[DeepSeek]', ...args);
    }

    // 替换 sidebar header logo（保留用户调整的宽高逻辑）
    function replaceLogo() {
        try {
            const sidebarHeader = document.querySelector('.sidebar-header') || document.querySelector('.sidebar .header') || document.querySelector('nav[aria-label]');
            if (!sidebarHeader) return;

            const origSvg = sidebarHeader.querySelector('svg');
            const origImg = sidebarHeader.querySelector('img');

            if (sidebarHeader.querySelector('img[data-deepseek-logo]')) return;

            const img = document.createElement('img');
            img.setAttribute('src', CONFIG.deepseekLogoUrl);
            img.setAttribute('alt', 'DeepSeek');
            img.setAttribute('data-deepseek-logo', '1');
            img.style.height = '56px'; // 用户修改的高度
            img.style.width = 'auto';
            img.style.objectFit = 'contain';
            img.style.verticalAlign = 'middle';

            const parent = origSvg?.parentNode || origImg?.parentNode || sidebarHeader.querySelector('a') || sidebarHeader;
            parent.innerHTML = '';
            parent.appendChild(img);

            // 调整父容器以适配新 logo 宽高
            if (parent.classList.contains("w-9")) {
                parent.classList.remove("w-9");
                parent.classList.add("w-21");
            }

            log('logo replaced');
        } catch (e) {
            log('replaceLogo error', e);
        }
    }

    function ensureToggle() {
        let btn = document.getElementById('ds-page-header-toggle');
        if (btn) return btn;

        btn = document.createElement('div');
        btn.id = 'ds-page-header-toggle';
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('title', '折叠/展开页眉 (DeepSeek)');
        btn.innerText = '▲';
        btn.addEventListener('click', () => toggleHeader());
        document.body.appendChild(btn);
        return btn;
    }

    function getHeader() {
        return document.querySelector('#page-header') || document.querySelector('header') || document.querySelector('.page-header');
    }

    function toggleHeader(forceState) {
        const header = getHeader();
        if (!header) return;

        const shouldCollapse = typeof forceState === 'boolean' ? forceState : !header.classList.contains('collapsed');
        header.classList.toggle('collapsed', shouldCollapse);

        try { localStorage.setItem(CONFIG.storageKey, shouldCollapse ? '1' : '0'); } catch (e) {}

        const btn = ensureToggle();
        btn.innerText = shouldCollapse ? '▼' : '▲';
        btn.setAttribute('aria-pressed', shouldCollapse ? 'true' : 'false');
    }

    function restoreState() {
        try {
            const v = localStorage.getItem(CONFIG.storageKey);
            if (v === '1') toggleHeader(true);
        } catch (e) {}
    }

    let debounceTimer = null;
    function onDomChanged() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            replaceLogo();
            ensureToggle();
            restoreState();
        }, 250);
    }

    const observer = new MutationObserver(onDomChanged);
    observer.observe(document.body, { childList: true, subtree: true });

    replaceLogo();
    ensureToggle();
    restoreState();
    window.addEventListener('load', () => setTimeout(onDomChanged, 300));
})();
