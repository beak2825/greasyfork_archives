// ==UserScript==
// @name         CSDN 极致优化：Mac 代码块 + 丝滑复制 + 暖黄沉浸
// @namespace    https://tampermonkey.net/
// @version      3.4
// @description  1. Mac 风格代码块(红黄绿三点)；2. 一键快速复制；3. 暖黄背景物理锁定；4. 零延迟导航。
// @author       Gemini & User
// @license      MIT
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://editor.csdn.net/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563791/CSDN%20%E6%9E%81%E8%87%B4%E4%BC%98%E5%8C%96%EF%BC%9AMac%20%E4%BB%A3%E7%A0%81%E5%9D%97%20%2B%20%E4%B8%9D%E6%BB%91%E5%A4%8D%E5%88%B6%20%2B%20%E6%9A%96%E9%BB%84%E6%B2%89%E6%B5%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/563791/CSDN%20%E6%9E%81%E8%87%B4%E4%BC%98%E5%8C%96%EF%BC%9AMac%20%E4%BB%A3%E7%A0%81%E5%9D%97%20%2B%20%E4%B8%9D%E6%BB%91%E5%A4%8D%E5%88%B6%20%2B%20%E6%9A%96%E9%BB%84%E6%B2%89%E6%B5%B8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 1. 视觉配置 ---
  const READER_BG = '#f6f1e7';
  const READER_TEXT = '#5b4636';
  const CLAUDE_ACCENT = '#D97757';
  const CODE_DARK_BG = '#282c34'; // Mac 风格深色背景

  // --- 2. 物理层锁定 ---
  const initialCSS = `
    html, body {
      background-color: ${READER_BG} !important;
      background-image: none !important;
      color: ${READER_TEXT} !important;
      height: auto !important;
      min-height: 100vh !important;
    }
    body:not(.simplified-done) #app,
    body:not(.simplified-done) #mainBox,
    body:not(.simplified-done) .csdn-side-toolbar,
    body:not(.simplified-done) header {
      display: none !important;
      opacity: 0 !important;
    }
  `;
  if (typeof GM_addStyle !== 'undefined') GM_addStyle(initialCSS);
  else document.documentElement.appendChild(Object.assign(document.createElement('style'), { textContent: initialCSS }));

  // --- 3. 核心样式表 (含 Mac 代码块样式) ---
  const readerCSS = `
    html { scroll-behavior: smooth; }
    .simplified-body {
      background: ${READER_BG} !important;
      color: ${READER_TEXT} !important;
      font-family: "Source Han Serif SC", "Noto Serif CJK SC", "Songti SC", serif !important;
    }
    .article-wrapper {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      max-width: 1400px;
      margin: 0 auto;
      padding: 50px 20px;
    }

    .custom-toc {
      width: 220px;
      position: sticky;
      top: 50px;
      margin-right: 30px;
      padding-right: 15px;
      border-right: 1px solid rgba(91, 70, 54, 0.1);
      max-height: 85vh;
      overflow-y: auto;
      text-align: right;
      flex-shrink: 0;
    }
    .custom-toc h3 {
      font-size: 0.8em;
      opacity: 0.5;
      margin-bottom: 25px;
      letter-spacing: 4px;
    }
    .toc-item {
      display: block;
      color: ${READER_TEXT};
      cursor: pointer;
      margin-bottom: 12px;
      font-size: 14px;
      opacity: 0.6;
      transition: 0.2s;
      user-select: none;
    }
    .toc-item:hover {
      color: ${CLAUDE_ACCENT};
      opacity: 1;
      transform: translateX(-5px);
    }

    .article-main { flex: 0 1 850px; min-width: 0; }
    .article-main h1 {
      font-size: 2.5em;
      font-weight: 700;
      margin-bottom: 40px;
      color: #4a3b2f;
      line-height: 1.25;
    }
    .article-content {
      line-height: 1.9;
      font-size: 18px;
      text-align: justify;
    }

    /* Mac 风格代码块容器 */
    .code-block-wrapper {
      background: ${CODE_DARK_BG};
      border-radius: 12px;
      margin: 2em 0;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(0,0,0,0.2);
      position: relative;
    }

    /* Mac 顶部三点栏 */
    .code-header {
      height: 32px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      background: rgba(0,0,0,0.1);
    }
    .code-dots { display: flex; gap: 8px; }
    .code-dots span { width: 12px; height: 12px; border-radius: 50%; display: block; }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }

    /* 复制按钮 */
    .copy-btn {
      position: absolute;
      top: 6px;
      right: 15px;
      color: rgba(255,255,255,0.4);
      font-size: 12px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition: 0.2s;
      user-select: none;
      font-family: sans-serif;
    }
    .copy-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }

    pre {
      background: transparent !important;
      border: none !important;
      margin: 0 !important;
      padding: 1.5em !important;
      overflow-x: auto;
      color: #abb2bf !important;
    }
    code {
      font-family: "JetBrains Mono", "Fira Code", Consolas, monospace !important;
      font-size: 15px !important;
    }

    img { max-width: 100%; border-radius: 8px; margin: 20px 0; }

    #simplify-toggle-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 8px 16px;
      background: ${READER_TEXT};
      color: ${READER_BG};
      border: none;
      border-radius: 20px;
      cursor: pointer;
      opacity: 0.2;
    }
  `;

  function autoSimplify() {
    const article = document.querySelector('#article_content') || document.querySelector('article');
    if (!article || document.body.classList.contains('simplified-done')) return;

    const title = document.title.split('_')[0] || document.title;
    const contentClone = article.cloneNode(true);

    // --- 特殊处理：将代码块包装成 Mac 风格 ---
    contentClone.querySelectorAll('pre').forEach((pre) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      wrapper.innerHTML = `
        <div class="code-header">
          <div class="code-dots">
            <span class="dot-red"></span>
            <span class="dot-yellow"></span>
            <span class="dot-green"></span>
          </div>
          <div class="copy-btn">Copy</div>
        </div>
      `;

      // 注意：直接移动原 pre 进 wrapper
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    });

    const headers = contentClone.querySelectorAll('h1, h2, h3');
    let tocHtml = '<div class="custom-toc"><h3>INDEX</h3>';
    headers.forEach((h, i) => {
      const targetId = `section-${i}`;
      h.setAttribute('id', targetId);
      tocHtml += `<div class="toc-item toc-${h.tagName.toLowerCase()}" data-target="${targetId}">${h.innerText}</div>`;
    });
    tocHtml += '</div>';

    document.body.innerHTML = `
      <div class="article-wrapper">
        ${tocHtml}
        <div class="article-main">
          <h1>${title}</h1>
          <div class="article-content">${contentClone.innerHTML}</div>
        </div>
      </div>
      <button id="simplify-toggle-btn">RESTORE</button>
    `;

    document.body.className = 'simplified-body simplified-done';
    if (typeof GM_addStyle !== 'undefined') GM_addStyle(readerCSS);

    // RESTORE
    const restoreBtn = document.getElementById('simplify-toggle-btn');
    if (restoreBtn) restoreBtn.addEventListener('click', () => location.reload());

    // 绑定目录极速跳转
    document.querySelectorAll('.toc-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          window.scrollTo({
            top: targetEl.getBoundingClientRect().top + window.pageYOffset - 20,
            behavior: 'smooth',
          });
        }
      });
    });

    // 绑定复制按钮功能
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const pre = btn.closest('.code-block-wrapper')?.querySelector('pre');
        const codeText = pre ? pre.innerText : '';
        if (!codeText) return;

        try {
          await navigator.clipboard.writeText(codeText);
          const oldText = btn.innerText;
          btn.innerText = 'Copied!';
          btn.style.color = '#27c93f';
          setTimeout(() => {
            btn.innerText = oldText;
            btn.style.color = '';
          }, 2000);
        } catch (err) {
          // 某些环境可能禁用 clipboard，给个降级提示
          const oldText = btn.innerText;
          btn.innerText = 'Copy failed';
          btn.style.color = '#ff5f56';
          setTimeout(() => {
            btn.innerText = oldText;
            btn.style.color = '';
          }, 2000);
        }
      });
    });

    window.scrollTo(0, 0);
  }

  // --- 5. 巡检 ---
  if (window.location.hostname === 'blog.csdn.net') {
    const obs = new MutationObserver(() => {
      if (document.querySelector('#article_content') || document.querySelector('article')) {
        autoSimplify();
        obs.disconnect();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (window.location.hostname === 'editor.csdn.net') {
    setInterval(() => {
      document.querySelectorAll('[class*="ai-chat"], .ai-header-box').forEach((el) => el.remove());
    }, 1000);
  }
})();
