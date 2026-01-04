// ==UserScript==
// @name         AO3 章节一键保存沉浸式翻译文本（TXT）
// @namespace    ao3-immersive-translate-save
// @version      1.2.0
// @description  在 AO3 章节页，将屏幕上“已被沉浸式翻译”的可见文本一键保存为 .txt，避免重复调用翻译API花钱
// @author       you
// @match        https://archiveofourown.org/works/*
// @match        https://archiveofourown.org/chapters/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550866/AO3%20%E7%AB%A0%E8%8A%82%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AF%91%E6%96%87%E6%9C%AC%EF%BC%88TXT%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550866/AO3%20%E7%AB%A0%E8%8A%82%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AF%91%E6%96%87%E6%9C%AC%EF%BC%88TXT%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ------- 样式与按钮 -------
  GM_addStyle(`
    #ao3-save-trans-btn {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 999999;
      padding: 10px 14px;
      border-radius: 10px;
      background: #cc0000;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 6px 20px rgba(0,0,0,.18);
      cursor: pointer;
      user-select: none;
    }
    #ao3-save-trans-btn:hover { filter: brightness(1.1); }
  `);

  function addButton() {
    if (document.getElementById('ao3-save-trans-btn')) return;
    const btn = document.createElement('div');
    btn.id = 'ao3-save-trans-btn';
    btn.textContent = '保存翻译为TXT（Alt+S）';
    btn.title = '保存当前章节的“可见文本”（建议在沉浸式翻译完成后再点）';
    btn.addEventListener('click', handleSaveClick);
    document.body.appendChild(btn);

    // 快捷键 Alt+S
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSaveClick();
      }
    });
  }

  // ------- 获取正文与元信息 -------
  function getWorkRoot() {
    // AO3 正文常见容器
    // 1) #workskin 是最稳的根
    let root = document.querySelector('#workskin');
    if (!root) root = document.querySelector('#chapters') || document.body;
    return root;
  }

  function getMeta() {
    const title =
      (document.querySelector('h2.title.heading')?.textContent ||
        document.querySelector('#workskin h2.title')?.textContent ||
        document.querySelector('h2.heading')?.textContent ||
        document.title ||
        'AO3')
        .trim()
        .replace(/\s+/g, ' ');

    const chapterTitle =
      (document.querySelector('#chapters h3.title')?.textContent ||
        document.querySelector('#workskin h3.title')?.textContent ||
        '')
        .trim()
        .replace(/\s+/g, ' ');

    const author =
      (document.querySelector('a[rel="author"]')?.textContent || '')
        .trim()
        .replace(/\s+/g, ' ');

    // 章节号
    const chapterIndicator =
      (document.querySelector('dd.chapter.index')?.textContent ||
        document.querySelector('.chapter .title')?.textContent ||
        '')
        .trim()
        .replace(/\s+/g, ' ');

    return { title, chapterTitle, author, chapterIndicator, url: location.href };
  }

  function sanitizeFilename(name) {
    return name
      .replace(/[\\\/:*?"<>|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 150);
  }

  // ------- 抽取文本（以“可见文本”为准）-------
  function extractVisibleText() {
    // 思路：沉浸式翻译会把可见层替换/覆盖，直接拿可见区域的 innerText 即可得到中文
    const root = getWorkRoot();

    // 尽量只截正文内容（避免侧栏/导航）
    // AO3 章节正文通常在 .userstuff 内
    let bodies = root.querySelectorAll('.userstuff');
    if (!bodies || bodies.length === 0) {
      // 兜底：拿 workskin 的全部可见文本
      return root.innerText.trim();
    }

    let parts = [];
    bodies.forEach((el) => {
      // 过滤出可见元素
      if (el.offsetParent !== null) {
        parts.push(el.innerText.trim());
      }
    });

    // 如果提不到，退回 root
    const text = parts.filter(Boolean).join('\n\n').trim();
    return text || root.innerText.trim();
  }

  // ------- 等待“像中文”的内容出现（可选）-------
  function waitForChineseText(timeoutMs = 8000) {
    return new Promise((resolve) => {
      const t0 = Date.now();
      const timer = setInterval(() => {
        const txt = extractVisibleText();
        // 判断含有一定数量的中日韩字符（主要看中文）
        const cjk = (txt.match(/[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g) || []).length;
        if (cjk > 100) {
          clearInterval(timer);
          resolve(true);
        }
        if (Date.now() - t0 > timeoutMs) {
          clearInterval(timer);
          resolve(false);
        }
      }, 500);
    });
  }

  // ------- 下载 -------
  function downloadTxt(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ------- 点击保存 -------
  async function handleSaveClick() {
    // 尝试等一等翻译完成（若已完成会很快通过）
    await waitForChineseText(6000);

    const meta = getMeta();
    const body = extractVisibleText();

    if (!body || body.length < 30) {
      alert('没有检测到正文文本。请确认：\n1) 当前页是 AO3 的章节正文页；\n2) 沉浸式翻译已把正文翻译出来；\n3) 页面滚动到文中，让翻译触发。');
      return;
    }

    const headerLines = [
      `标题：${meta.title}`,
      meta.chapterTitle ? `章节：${meta.chapterTitle}` : null,
      meta.author ? `作者：${meta.author}` : null,
      meta.chapterIndicator ? `进度：${meta.chapterIndicator}` : null,
      `来源：${meta.url}`,
      `保存时间：${new Date().toLocaleString()}`
    ].filter(Boolean);

    const finalText = `${headerLines.join('\n')}\n\n--------------------\n\n${body}\n`;

    const base =
      (meta.title || 'AO3')
        + (meta.chapterTitle ? ` - ${meta.chapterTitle}` : '');
    const filename = sanitizeFilename(base + '（中文翻译）') + '.txt';

    downloadTxt(filename, finalText);
  }

  // ------- 只在 AO3 作品/章节页生效 -------
  function shouldRunHere() {
    const u = location.pathname;
    return /\/works\/\d+/.test(u) || /\/chapters\/\d+/.test(u);
  }

  // ------- 初始化 -------
  function init() {
    if (!shouldRunHere()) return;
    addButton();
  }

  // DOMReady
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
