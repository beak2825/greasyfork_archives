// ==UserScript==
// @name         复制助手
// @namespace   
// @version      1.0.0
// @description  正文复制。
// @license MIT
// @author       wenmoux
// @match        https://www.qidian.com/book/*
// @match        https://chuangshi.qq.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555299/%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555299/%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== 配置区域 ==========
  const SITE_CONFIG = [
    {
      test: (host) => host.includes('qidian.com'),
      chapterSelectors: ['.title', '.crumbs-nav .j_chapterName', '.text-head h3'],
      contentSelectors: [
        '.content > p',
        '#chapter-content > p',
        '.read-content > p',
      ],
      removeSelectors: ['.review', '.ad', '.adsbygoogle', 'script', 'style']
    },
    {
      test: (host) => host.includes('chuangshi.qq.com'),
      chapterSelectors: ['.chapter-title', '.titlebar h1'],
      contentSelectors: ['#article p', '.read-content p', '.content p'],
      removeSelectors: ['.review', '.ad', '.adsbygoogle', 'script', 'style']
    },
    {
      test: () => true,
      chapterSelectors: [
        'h1.title', 'h1.article-title', '.article-title', '.chapter-title', 'h1'
      ],
      contentSelectors: [
        'article p',
        '.article p',
        '#content p',
        '.content p',
        '.read-content p',
        '.entry-content p',
        '.post-content p'
      ],
      removeSelectors: ['.review', '.ad', '.adsbygoogle', 'script', 'style', 'noscript']
    }
  ];

  const MAX_HISTORY = 1000;
  const LS_KEYS = {
    HISTORY: 'copyHistoryV2',
    FAB_POS: 'copyFabPos'
  };

  // ========== 样式 ==========
  GM_addStyle(`
    /* 悬浮按钮（可拖拽） */
    #copy-fab {
      position: fixed;
      right: 20px;
      bottom: 80px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #6200ea, #03dac6);
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 10px 24px rgba(0,0,0,0.18);
      cursor: pointer;
      z-index: 999999;
      user-select: none;
      transition: transform 0.1s ease-out, box-shadow 0.2s ease;
    }
    #copy-fab:active { transform: scale(0.98); box-shadow: 0 6px 16px rgba(0,0,0,0.18); }

    /* 历史面板入口按钮 */
    #history-toggle {
      position: fixed;
      right: 20px;
      bottom: 20px;
      padding: 10px 14px;
      background: #ffffff;
      border-radius: 999px;
      color: #6200ea;
      box-shadow: 0 8px 20px rgba(0,0,0,0.10);
      border: 1px solid rgba(98,0,234,0.15);
      font-weight: 700;
      cursor: pointer;
      z-index: 999999;
    }
    #history-toggle:hover { background: #f8f6ff; }

    /* 历史面板 */
    #copy-panel {
      position: fixed;
      right: 20px;
      bottom: 120px;
      width: 360px;
      max-height: 60vh;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 16px 32px rgba(0,0,0,0.12);
      z-index: 999999;
      display: none;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.06);
      backdrop-filter: saturate(1.2);
    }
    #copy-panel.show { display: flex; flex-direction: column; }

    #panel-header {
      padding: 12px 14px;
      background: linear-gradient(180deg, rgba(98,0,234,0.08), rgba(98,0,234,0.02));
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }
    #panel-title {
      font-weight: 800;
      color: #3a2e7e;
      margin-right: auto;
    }
    #panel-actions { display: flex; gap: 8px; }
    .panel-btn {
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.08);
      background: #fff;
      color: #4b4b4b;
      cursor: pointer;
      font-size: 12px;
    }
    .panel-btn:hover { background: #f8f8ff; color: #6200ea; }

    #panel-search {
      padding: 10px 12px;
      border: none;
      border-top: 1px solid rgba(0,0,0,0.06);
      border-bottom: 1px solid rgba(0,0,0,0.06);
      outline: none;
      font-size: 14px;
    }

    #history-list {
      list-style: none;
      padding: 12px;
      margin: 0;
      overflow: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .history-item {
      display: flex;
      gap: 10px;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 12px;
      padding: 10px;
      align-items: center;
      background: #fcfbff;
      transition: box-shadow 0.2s ease, transform 0.1s ease;
    }
    .history-item:hover {
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      transform: translateY(-1px);
    }
    .history-favicon {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      flex: 0 0 auto;
    }
    .history-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .history-title {
      font-weight: 700;
      color: #2c2c2c;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .history-meta {
      font-size: 12px;
      color: #7a7a7a;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Toast */
    #copy-toast {
      position: fixed;
      right: 20px;
      bottom: 190px;
      padding: 10px 14px;
      background: #6200ea;
      color: #fff;
      border-radius: 999px;
      font-weight: 700;
      box-shadow: 0 10px 24px rgba(98,0,234,0.3);
      z-index: 1000000;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: none;
    }
    #copy-toast.show { opacity: 1; transform: translateY(0); }
  `);

  // ========== DOM 构建 ==========
  const fab = document.createElement('div');
  fab.id = 'copy-fab';
  fab.title = '一键复制章节（Alt + C）';
  fab.textContent = '复制';
  document.body.appendChild(fab);

  const toggleBtn = document.createElement('div');
  toggleBtn.id = 'history-toggle';
  toggleBtn.textContent = '历史记录';
  document.body.appendChild(toggleBtn);

  const panel = document.createElement('div');
  panel.id = 'copy-panel';
  panel.innerHTML = `
    <div id="panel-header">
      <div id="panel-title">复制历史记录</div>
      <div id="panel-actions">
        <button id="btn-refresh" class="panel-btn">刷新</button>
        <button id="btn-clear" class="panel-btn">清空</button>
      </div>
    </div>
    <input id="panel-search" type="search" placeholder="搜索标题/域名/URL..."/>
    <ul id="history-list"></ul>
  `;
  document.body.appendChild(panel);

  const toast = document.createElement('div');
  toast.id = 'copy-toast';
  toast.textContent = '复制成功！';
  document.body.appendChild(toast);

  // ========== 工具函数 ==========
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return false;
    if (rect.width === 0 || rect.height === 0) return false;
    return true;
  }

  function sanitizeText(txt) {
    if (!txt) return '';
    return txt
      .replace(/\u200B/g, '')       // 零宽空格
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')   // 行尾空格
      .replace(/\n{3,}/g, '\n\n')   // 多空行变双空行
      .trim();
  }

  function uniqueByText(arr) {
    const set = new Set();
    return arr.filter(t => {
      const key = t.replace(/\s+/g, ' ').trim();
      if (!key) return false;
      if (set.has(key)) return false;
      set.add(key);
      return true;
    });
  }

  function showToast(msg = '复制成功！') {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function getDomain(u) {
    try { return new URL(u).hostname; } catch { return location.hostname; }
  }

  function timeFormat(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function getFaviconUrl(url) {
    const host = getDomain(url);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
  }

  // ========== 正文提取 ==========
  function getActiveConfig() {
    const host = location.hostname;
    return SITE_CONFIG.find(c => c.test(host));
  }

  function pickFirstVisibleText(selectors) {
    for (const sel of selectors) {
      const el = $(sel);
      if (el && isVisible(el) && sanitizeText(el.textContent)) {
        return sanitizeText(el.textContent);
      }
    }
    return '';
  }

  function pickParagraphs(selectors, removeSelectors = []) {
    for (const sel of selectors) {
      const nodes = $$(sel);
      if (nodes && nodes.length) {
        // 内部去噪
        if (removeSelectors.length) {
          nodes.forEach(p => removeSelectors.forEach(rs => $$(rs, p).forEach(n => n.remove())));
        }
        const texts = nodes
          .filter(isVisible)
          .map(p => sanitizeText(p.innerText || p.textContent || ''))
          .filter(Boolean);

        if (texts.length > 2) { // 至少有点像正文
          return texts;
        }
      }
    }
    return [];
  }

  // 标题标准化：尽量生成“第xx章 标题”
  function normalizeTitle(titleRaw) {
    const t = sanitizeText(titleRaw);
    if (!t) return '未知章节';

    // 识别：第xx章/回/节：标题
    const reFull = /第\s*([零一二三四五六七八九十百千0-9]+)\s*[章节回]\s*[：:\-\s]*([\s\S]*)/i;
    const m1 = t.match(reFull);
    if (m1) {
      const num = m1[1];
      const name = sanitizeText(m1[2] || '');
      return `第${num}章 ${name}`.trim();
    }

    // 识别：xx 标题 / xx. 标题 / xx-标题
    const reNumTitle = /^\s*([0-9]+)\s*[\.\-：:\s]\s*([\s\S]+)/;
    const m2 = t.match(reNumTitle);
    if (m2) {
      return `第${m2[1]}章 ${sanitizeText(m2[2])}`.trim();
    }

    // 识别：仅数字，如“12”
    const reOnlyNum = /^\s*([0-9]+)\s*$/;
    const m3 = t.match(reOnlyNum);
    if (m3) return `第${m3[1]}章`.trim();

    // 含“章/回/节”但无“第”
    const reLoose = /([零一二三四五六七八九十百千0-9]+)\s*[章节回]\s*([\s\S]*)/;
    const m4 = t.match(reLoose);
    if (m4) {
      return `第${m4[1]}章 ${sanitizeText(m4[2] || '')}`.trim();
    }

    // 保底返回原标题
    return t;
  }

  function extractContent() {
    const cfg = getActiveConfig();
    const title = pickFirstVisibleText(cfg.chapterSelectors) || document.title || '未知章节';
    const paragraphs = pickParagraphs(cfg.contentSelectors, cfg.removeSelectors);

    // 去水印、去广告关键词
    const noiseKeywords = [
      '本章未完', '请移步', '收藏本站', '加书签', '手机阅读', '微信', '公众号',
      '喜欢本书', '求推荐', '广告', '未完待续', '阅读器', '全订', '订阅', '打赏'
    ];
    const filtered = paragraphs.filter(p => {
      const short = p.replace(/\s/g, '');
      if (short.length < 2) return false;
      // 避免免责声明类
      const lower = p.toLowerCase();
      if (lower.startsWith('copyright') || lower.includes('all rights reserved')) return false;
      // 关键词过滤
      if (noiseKeywords.some(k => p.includes(k))) return false;
      return true;
    });

    const unique = uniqueByText(filtered);
    return { title: normalizeTitle(title), paragraphs: unique };
  }

  function buildCopyText({ title, paragraphs }) {
    const content = paragraphs.join('\n\n');
    return `${title}\n\n${content}`.trim();
  }

  // ========== 历史记录 ==========
  function readHistory() {
    try {
      const h = JSON.parse(localStorage.getItem(LS_KEYS.HISTORY));
      return Array.isArray(h) ? h : [];
    } catch { return []; }
  }
  function writeHistory(arr) {
    localStorage.setItem(LS_KEYS.HISTORY, JSON.stringify(arr.slice(0, MAX_HISTORY)));
  }
  function addHistory(title, url) {
    const list = readHistory();
    // 去重：同 URL 仅保留最新
    const filtered = list.filter(item => item.url !== url);
    filtered.unshift({ title, url, time: Date.now() });
    writeHistory(filtered);
    renderHistory();
  }

  // ========== 面板渲染 ==========
  const historyListEl = $('#history-list');
  const searchEl = $('#panel-search');

  function renderHistory() {
    const list = readHistory();
    const q = (searchEl.value || '').trim().toLowerCase();
    historyListEl.innerHTML = '';

    list
      .filter(item => {
        if (!q) return true;
        return (
          (item.title || '').toLowerCase().includes(q) ||
          (item.url || '').toLowerCase().includes(q) ||
          getDomain(item.url || '').toLowerCase().includes(q)
        );
      })
      .forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';

        const ico = document.createElement('img');
        ico.className = 'history-favicon';
        ico.src = getFaviconUrl(item.url);
        ico.alt = '';

        const wrap = document.createElement('div');
        wrap.className = 'history-content';

        const a = document.createElement('a');
        a.className = 'history-title';
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = item.title || '(无标题)';

        const meta = document.createElement('div');
        meta.className = 'history-meta';
        meta.textContent = `${getDomain(item.url)} · ${timeFormat(item.time)}`;

        wrap.appendChild(a);
        wrap.appendChild(meta);

        li.appendChild(ico);
        li.appendChild(wrap);
        historyListEl.appendChild(li);
      });
  }

  // ========== 悬浮按钮拖拽 ==========
  function loadFabPos() {
    try {
      const pos = JSON.parse(localStorage.getItem(LS_KEYS.FAB_POS));
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        fab.style.right = 'auto';
        fab.style.bottom = 'auto';
        fab.style.left = `${pos.x}px`;
        fab.style.top = `${pos.y}px`;
      }
    } catch { /* ignore */ }
  }
  function saveFabPos(x, y) {
    localStorage.setItem(LS_KEYS.FAB_POS, JSON.stringify({ x, y }));
  }
  (function enableDrag() {
    let dragging = false;
    let offsetX = 0, offsetY = 0;

    const onDown = (e) => {
      dragging = true;
      const rect = fab.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      let x = clientX - offsetX;
      let y = clientY - offsetY;

      // 视口边界约束
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = fab.offsetWidth;
      const h = fab.offsetHeight;
      x = Math.min(Math.max(4, x), vw - w - 4);
      y = Math.min(Math.max(4, y), vh - h - 4);

      fab.style.left = x + 'px';
      fab.style.top = y + 'px';
      fab.style.right = 'auto';
      fab.style.bottom = 'auto';
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      const rect = fab.getBoundingClientRect();
      saveFabPos(rect.left, rect.top);
    };

    fab.addEventListener('mousedown', onDown);
    fab.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
  })();
  loadFabPos();

  // ========== 复制动作 ==========
  async function doCopy() {
    // 尝试即取即用；若页面动态加载，短暂等待
    let result = extractContent();
    if ((!result.paragraphs || result.paragraphs.length < 3) && document.readyState !== 'complete') {
      await new Promise(r => setTimeout(r, 500));
      result = extractContent();
    }

    if (!result.paragraphs || result.paragraphs.length === 0) {
      showToast('当前页面未检测到正文内容');
      return;
    }

    const text = buildCopyText(result);

    try {
      GM_setClipboard(text, { type: 'text/plain' });
      showToast('复制成功！');
      addHistory(result.title, location.href);
    } catch (e) {
      console.warn('GM_setClipboard 失败，尝试浏览器剪贴板', e);
      try {
        await navigator.clipboard.writeText(text);
        showToast('复制成功！');
        addHistory(result.title, location.href);
      } catch (err) {
        console.error('剪贴板写入失败', err);
        showToast('复制失败，请查看控制台');
      }
    }
  }

  // ========== 事件绑定 ==========
  fab.addEventListener('click', (e) => {
    doCopy();
  });

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('show');
    if (panel.classList.contains('show')) renderHistory();
  });

  $('#btn-clear').addEventListener('click', () => {
    if (confirm('确认清空复制历史记录？')) {
      writeHistory([]);
      renderHistory();
    }
  });

  $('#btn-refresh').addEventListener('click', () => renderHistory());
  searchEl.addEventListener('input', () => renderHistory());

  // 快捷键 Alt + C 复制
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      doCopy();
    }
  });

  // 监听内容区动态变化
  const mo = new MutationObserver((muts) => {
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // 初始渲染一次历史
  renderHistory();
})();