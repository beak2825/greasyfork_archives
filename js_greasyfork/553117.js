// ==UserScript==
// @name         B站评论自动展开 v1
// @namespace    qlt-auto-expand-bili-comments
// @version      0.2.1
// @description  自动持续点击“查看全部/查看更多回复”，一键展开楼中楼；支持 Alt+E 开关（持久化）、SPA 导航自适应、右下角状态徽章。
// @author       qiletian
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/opus/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553117/B%E7%AB%99%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/553117/B%E7%AB%99%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%20v1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const Config = {
    scanInterval: 700,            // 扫描周期(ms)
    jitter: [100, 250],           // 每次点击的随机抖动(ms)
    maxClicksPerTick: 8,          // 单轮最多点击几个“查看更多”
    maxTotalClicks: 5000,         // 安全阈值，避免过度请求
    autoStart: true,              // 首次无持久化记录时的默认值
  };

  // —— 状态持久化 —— //
  const STORE_KEY = 'biliAutoExpand.enabled.v1';
  const saveEnabled = (v) => {
    try { localStorage.setItem(STORE_KEY, v ? '1' : '0'); } catch (_) {}
  };
  const loadEnabled = (fallback = Config.autoStart) => {
    try {
      const v = localStorage.getItem(STORE_KEY);
      if (v === null) return fallback;
      return v === '1';
    } catch (_) { return fallback; }
  };

  let enabled      = loadEnabled();       // 关键：初始化时从 localStorage 读取
  let totalClicks  = 0;
  let clickedButtons = new WeakSet();     // 记忆已点过按钮，避免重复
  let timer        = null;                // setInterval 句柄
  let currentApp   = null;                // 缓存当前评论 App 节点
  let appObserver  = null;                // 监听评论区内部变化的观察器
  let bootTimer    = null;                // 防抖重引导

  const log  = (...args) => console.debug('[Bili-AutoExpand]', ...args);
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function waitForCommentApp(timeout = 30000) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function check() {
        const app = document.querySelector('#commentapp > bili-comments');
        if (app?.shadowRoot) return resolve(app);
        if (Date.now() - t0 > timeout) return reject(new Error('commentapp not found'));
        requestAnimationFrame(check);
      })();
    });
  }

  function findViewMoreButtons(app) {
    const out = [];
    try {
      const threads = app.shadowRoot.querySelectorAll('#feed > bili-comment-thread-renderer');
      threads.forEach(thread => {
        const tsr = thread.shadowRoot;
        if (!tsr) return;
        const replies = tsr.querySelector('#replies > bili-comment-replies-renderer');
        if (!replies?.shadowRoot) return;

        // 标准容器：#view-more > bili-text-button > button
        const textBtn = replies.shadowRoot.querySelector('#view-more > bili-text-button');
        const btn = textBtn?.shadowRoot?.querySelector('button');
        if (btn && !btn.disabled && btn.offsetParent !== null && !clickedButtons.has(btn)) {
          out.push(btn);
        }

        // 兜底：标题文案有时会变化
        replies.shadowRoot.querySelectorAll('button').forEach(b => {
          const t = (b.textContent || '').trim();
          if (!clickedButtons.has(b) && /查看更多|查看全部|展开更多|更多回复|View More/i.test(t)) {
            out.push(b);
          }
        });
      });
    } catch (_) { /* ignore */ }
    return Array.from(new Set(out));
  }

  function clickWithJitter(btn) {
    return new Promise(res => {
      setTimeout(() => {
        try {
          btn.click();
          clickedButtons.add(btn);
          totalClicks++;
        } catch (_) { /* ignore */ }
        res();
      }, rand(Config.jitter[0], Config.jitter[1]));
    });
  }

  async function tick(app) {
    if (!enabled) return;
    const list = findViewMoreButtons(app);
    if (list.length === 0) return;
    const n = Math.min(list.length, Config.maxClicksPerTick);
    for (let i = 0; i < n; i++) {
      if (totalClicks >= Config.maxTotalClicks) { enabled = false; saveEnabled(enabled); paintBadge(); stopLoop(); break; }
      await clickWithJitter(list[i]);
    }
  }

  function startLoop(app) {
    stopLoop();
    if (!enabled) return; // 关键：尊重开关状态
    timer = setInterval(() => tick(app), Config.scanInterval);
  }

  function stopLoop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function paintBadge() {
    let el = document.getElementById('bili-autoexpand-badge');
    if (!el) {
      el = document.createElement('div');
      el.id = 'bili-autoexpand-badge';
      Object.assign(el.style, {
        position: 'fixed', right: '10px', bottom: '10px', zIndex: 2147483647,
        background: '#00a1d6', color: '#fff', padding: '6px 10px',
        borderRadius: '8px', fontSize: '12px', boxShadow: '0 2px 6px rgba(0,0,0,.2)',
        userSelect: 'none', cursor: 'pointer'
      });
      el.addEventListener('click', toggle);
      document.body.appendChild(el);
    }
    el.textContent = `评论自动展开：${enabled ? '开' : '关'}（Alt+E）`;
    el.style.background = enabled ? '#00a1d6' : '#666';
  }

  function toggle() {
    enabled = !enabled;
    saveEnabled(enabled);     // 关键：持久化到 localStorage
    paintBadge();
    if (currentApp) {
      enabled ? startLoop(currentApp) : stopLoop();
    }
  }

  function onKeydown(e) {
    // 兼容性：忽略组合输入与重复触发
    if (e.repeat) return;
    const key = (e.key || '').toLowerCase();
    if (e.altKey && key === 'e') toggle();
  }

  function observeUrlChange() {
    // 监听 URL 变化：B 站常用 history.pushState
    let last = location.href;
    const scheduleBoot = () => {
      clearTimeout(bootTimer);
      bootTimer = setTimeout(boot, 150); // 防抖，避免频繁重启
    };
    const obs = new MutationObserver(() => {
      if (location.href !== last) {
        last = location.href;
        scheduleBoot();
      }
    });
    obs.observe(document, { subtree: true, childList: true });
  }

  function resetAppObserver() {
    if (appObserver) {
      try { appObserver.disconnect(); } catch (_) {}
      appObserver = null;
    }
  }

  async function boot() {
    stopLoop();
    totalClicks = 0;
    clickedButtons = new WeakSet();
    resetAppObserver();

    try {
      currentApp = await waitForCommentApp();
      paintBadge();

      // 仅在开启状态下启动扫描循环
      if (enabled) startLoop(currentApp);
      // 监听评论区内部异步加载
      appObserver = new MutationObserver(() => {
        if (enabled) startLoop(currentApp);
        else stopLoop();
      });
      appObserver.observe(currentApp.shadowRoot, { childList: true, subtree: true });

      document.removeEventListener('keydown', onKeydown);
      document.addEventListener('keydown', onKeydown);

      log('ready, enabled=', enabled);
    } catch (e) {
      log('comment app not found in time', e);
    }
  }

  // 启动
  boot();
  observeUrlChange();
})();
