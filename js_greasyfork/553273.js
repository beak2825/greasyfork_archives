// ==UserScript==
// @name         UESTC 实验室安全知识·随机阅读
// @namespace    https://labsafetest.uestc.edu.cn/
// @version      1.3
// @description  自动随机浏览实验室安全文章，带可视化控制面板
// @match        *://labsafetest.uestc.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553273/UESTC%20%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E7%9F%A5%E8%AF%86%C2%B7%E9%9A%8F%E6%9C%BA%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/553273/UESTC%20%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E7%9F%A5%E8%AF%86%C2%B7%E9%9A%8F%E6%9C%BA%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 避免嵌套 iframe 中运行
  if (window.top !== window.self) return;

  const LS_KEY = 'uestc_safe_reader_cfg';
  const defaultCfg = {
    running: false,
    intervalMs: 60000,
    jitterPct: 0.15,
    autoScroll: true
  };
  let cfg = loadCfg();

  const CATALOG_RANGE = { min: 121, max: 129 };
  const BASE = 'https://labsafetest.uestc.edu.cn/redir.php';
  let timers = [];
  let scrollTimer = null;

  init();

  function init() {
    console.log('[SafeReader] 初始化脚本...');
    createPanel();
    if (cfg.running) scheduleNext();
  }

  function loadCfg() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      return { ...defaultCfg, ...saved };
    } catch (e) {
      console.warn('[SafeReader] 配置解析失败，使用默认配置', e);
      return { ...defaultCfg };
    }
  }

  function saveCfg() {
    localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function withJitter(ms) {
    const d = cfg.jitterPct * ms;
    return Math.max(1000, Math.floor(ms + (Math.random() * 2 - 1) * d));
  }

  function pageType() {
    const u = new URL(location.href);
    if (u.searchParams.has('object_id')) return 'article';
    if (u.searchParams.has('catalog_id')) return 'category';
    return 'other';
  }

  function randomCategoryUrl() {
    const id = randInt(CATALOG_RANGE.min, CATALOG_RANGE.max);
    const u = new URL(BASE);
    u.searchParams.set('catalog_id', String(id));
    return u.toString();
  }

  function openRandomCategory() {
    const url = randomCategoryUrl();
    log(`跳转随机分类: ${url}`);
    location.href = url;
  }

  function findArticleLinksInDoc(root = document) {
    return Array.from(root.querySelectorAll('a[href*="redir.php"]'))
      .map(a => [a, new URL(a.href, location.origin)])
      .filter(([a, u]) => u.searchParams.has('object_id'))
      .map(([a]) => a);
  }

  function openRandomArticle() {
    const links = findArticleLinksInDoc();
    if (links.length === 0) {
      log('未找到文章链接，跳转分类页');
      openRandomCategory();
      return;
    }
    const a = links[Math.floor(Math.random() * links.length)];
    log(`跳转随机文章: ${a.href}`);
    location.href = a.href;
  }

  function scheduleNext() {
    clearTimers();
    if (!cfg.running) return;
    const typ = pageType();
    if (typ === 'category') {
      timers.push(setTimeout(() => openRandomArticle(), withJitter(4000)));
    } else if (typ === 'article') {
      if (cfg.autoScroll) startAutoScroll();
      timers.push(setTimeout(() => openRandomCategory(), withJitter(cfg.intervalMs)));
    } else {
      timers.push(setTimeout(() => openRandomCategory(), withJitter(3000)));
    }
  }

  function clearTimers() {
    timers.forEach(t => clearTimeout(t));
    timers = [];
    stopAutoScroll();
  }

  function startAutoScroll() {
    stopAutoScroll();
    let dir = 1;
    scrollTimer = setInterval(() => {
      window.scrollBy(0, 200 * dir);
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      const atTop = window.scrollY <= 0;
      if (atBottom || atTop) dir *= -1;
    }, 1200 + Math.floor(Math.random() * 600));
  }

  function stopAutoScroll() {
    if (scrollTimer) {
      clearInterval(scrollTimer);
      scrollTimer = null;
    }
  }

  function log(...args) {
    console.log('[SafeReader]', ...args);
    updateStatus(args.join(' '));
  }

  function updateStatus(text) {
    const el = document.getElementById('usp-status');
    if (el) el.textContent = `${new Date().toLocaleTimeString()} | ${text}`;
  }

  function toast(msg) {
    updateStatus(msg);
  }

  function createPanel() {
    const box = document.createElement('div');
    box.id = 'uestc-safe-panel';
    box.innerHTML = `
      <div style="
        position:fixed;right:16px;bottom:16px;z-index:999999;
        background:#0f172a;color:#e5e7eb;border:1px solid #334155;
        padding:12px 12px 10px;border-radius:10px;font:14px/1.4 system-ui,Segoe UI,Arial;">
        <div style="font-weight:700;margin-bottom:6px;">安全知识·随机阅读</div>
        <div style="display:flex;gap:6px;align-items:center;margin:6px 0;">
          <label>周期(ms)：</label>
          <input id="usp-interval" type="number" min="5000" step="1000"
                 style="width:110px;padding:4px;border-radius:6px;border:1px solid #475569;background:#111827;color:#e5e7eb;">
          <button id="usp-save" style="padding:4px 8px;border:1px solid #475569;border-radius:6px;background:#1f2937;color:#e5e7eb;">保存</button>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin:6px 0;">
          <label style="display:flex;align-items:center;gap:6px;"><input id="usp-scroll" type="checkbox">自动滚动</label>
          <label style="display:flex;align-items:center;gap:6px;"><input id="usp-jitter" type="checkbox">时间抖动±15%</label>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0;">
          <button id="usp-start" style="padding:6px 10px;border:1px solid #22c55e;color:#16a34a;background:#052e16;border-radius:8px;">开始</button>
          <button id="usp-stop"  style="padding:6px 10px;border:1px solid #ef4444;color:#ef4444;background:#2a0b0b;border-radius:8px;">停止</button>
          <button id="usp-test-cat" style="padding:6px 10px;border:1px solid #475569;background:#111827;color:#e5e7eb;border-radius:8px;">测试：开分类</button>
          <button id="usp-test-article" style="padding:6px 10px;border:1px solid #475569;background:#111827;color:#e5e7eb;border-radius:8px;">测试：开文章</button>
          <button id="usp-count" style="padding:6px 10px;border:1px solid #475569;background:#111827;color:#e5e7eb;border-radius:8px;">统计本页文章</button>
        </div>
        <div id="usp-status" style="font-size:12px;color:#a3a3a3;">已加载脚本</div>
      </div>`;
    document.body.appendChild(box);

    document.getElementById('usp-interval').value = cfg.intervalMs;
    document.getElementById('usp-scroll').checked = !!cfg.autoScroll;
    document.getElementById('usp-jitter').checked = !!cfg.jitterPct;

    document.getElementById('usp-save').onclick = () => {
      const val = Number(document.getElementById('usp-interval').value);
      if (isNaN(val) || val < 5000) { alert('间隔不得小于 5000ms'); return; }
      cfg.intervalMs = val;
      cfg.autoScroll = document.getElementById('usp-scroll').checked;
      cfg.jitterPct = document.getElementById('usp-jitter').checked ? 0.15 : 0;
      saveCfg(); toast(`保存成功：${cfg.intervalMs}ms`);
      scheduleNext();
    };
    document.getElementById('usp-start').onclick = () => {
      cfg.running = true; saveCfg(); toast('已启动'); scheduleNext();
    };
    document.getElementById('usp-stop').onclick = () => {
      cfg.running = false; saveCfg(); toast('已停止'); clearTimers();
    };
    document.getElementById('usp-test-cat').onclick = () => openRandomCategory();
    document.getElementById('usp-test-article').onclick = () => openRandomArticle();
    document.getElementById('usp-count').onclick = () => {
      const n = findArticleLinksInDoc().length;
      toast(`本页找到 ${n} 个文章链接`);
    };
  }
})();
