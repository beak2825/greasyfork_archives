// ==UserScript==
// @name         linux.do 外链直达
// @namespace    https://github.com/umowomu/linuxdo-direct-link
// @version      1.0
// @description  linux.do 论坛外链 确认弹窗转为浮窗，直达链接，安全预览链接。减少多一次点击的负担，提高效率。
// @author       umowomu
// @match        https://linux.do/*
// @homepageURL  https://github.com/umowomu/linuxdo-direct-link
// @supportURL   https://github.com/umowomu/linuxdo-direct-link/issues
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563797/linuxdo%20%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/563797/linuxdo%20%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SecurityBar = {
    el: null,
    urlSpan: null,

    init() {
      this.el = document.createElement('div');

      this.el.style.cssText = `
        position: fixed;
        bottom: 25px; /* 稍微往下放一点，减少遮挡 */
        left: 50%;
        transform: translateX(-50%) translateY(30px);
        /* 限制宽度，不再铺那么开 */
        width: auto;
        min-width: 300px;
        max-width: 90%;
        background: rgba(0, 0, 0, 0.45);

        /* 模糊度从 16px 降到 6px，能隐约看清底下的字形了 */
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);

        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px; /* 圆角改小一点，更利落 */
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);

        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 12px; /* 字体整体调小 */
        line-height: 1.4;

        /* 极致紧凑的内边距 */
        padding: 10px 14px;

        z-index: 2147483647;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s ease-out;
        text-align: left;
        /* 给文字加一点点阴影，防止背景太透看不清字 */
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      `;

      this.el.innerHTML = `
        <!-- 第一行：警告语 -->
        <div style="color: #FFD54F; font-weight: 600; display:flex; align-items:center; gap:6px; margin-bottom: 4px;">
          <span>⚠️此链接指向本站以外的网站。我们不对外部网站的内容负责。</span>
        </div>

        <!-- 第二行：URL (整合了提示语，省空间) -->
        <div style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 6px;">
          <span style="opacity: 0.7; font-size: 11px;">即将前往：</span>
          <div class="url-highlight" style="
              color: #69F0AE;
              font-family: monospace;
              font-size: 12px;
              background: rgba(0, 0, 0, 0.25);
              padding: 2px 6px;
              border-radius: 4px;
              word-break: break-all;
              border: 1px solid rgba(105, 240, 174, 0.2);
          "></div>
        </div>

        <!-- 第三行：举报 (极小字号，紧贴底部) -->
        <div style="
            font-size: 11px;
            color: #bbb;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
        ">
          <span>🚩如果您发现可疑或有害链接，请使用举报图标举报该帖子！</span>
        </div>
      `;

      document.body.appendChild(this.el);
      this.urlSpan = this.el.querySelector('.url-highlight');
    },

    show(href) {
      if (!this.el) this.init();
      this.urlSpan.textContent = href;
      this.el.style.opacity = '1';
      this.el.style.transform = 'translateX(-50%) translateY(0)';
    },

    hide() {
      if (this.el) {
        this.el.style.opacity = '0';
        this.el.style.transform = 'translateX(-50%) translateY(30px)';
      }
    },

    activate() {
      if(this.el) {
         this.el.style.transform = 'translateX(-50%) scale(0.98)';
         this.el.style.background = 'rgba(0, 0, 0, 0.6)'; // 点击瞬间稍微变深一点作为反馈
         setTimeout(() => {
             this.el.style.transform = 'translateX(-50%) scale(1)';
             this.el.style.background = 'rgba(0, 0, 0, 0.45)';
         }, 150);
      }
    }
  };


  function isExternalHref(href) {
    try {
      const u = new URL(href, location.href);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
      const host = u.hostname.toLowerCase();
      return !host.endsWith('linux.do');
    } catch { return false; }
  }

  function findAnchor(e) {
    let el = e.target;
    while (el && el !== document.documentElement) {
      if (el.tagName === 'A' && el.href) return el;
      el = el.parentElement;
    }
    return null;
  }

  document.addEventListener('mouseover', (e) => {
    const a = findAnchor(e);
    if (!a) { SecurityBar.hide(); return; }
    const href = a.getAttribute('href') || a.href;
    if (isExternalHref(href)) { SecurityBar.show(href); }
    else { SecurityBar.hide(); }
  }, true);

  document.addEventListener('mouseout', (e) => {
    const a = findAnchor(e);
    if (a) SecurityBar.hide();
  }, true);

  function clickHandler(e) {
    if (e.type === 'click' && e.button !== 0) return;
    const a = findAnchor(e);
    if (!a) return;
    if (!isExternalHref(a.getAttribute('href') || a.href)) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    SecurityBar.activate();
    window.open(a.href, '_blank', 'noopener,noreferrer');
  }

  document.addEventListener('click', clickHandler, true);
  document.addEventListener('auxclick', clickHandler, true);

})();