// ==UserScript==
// @name         NovelAI 生成失败自动重试
// @namespace    novelai-auto-retry-atseiunsky
// @version      2.0.0
// @description  当“Generate 1 Image”失败时自动重试
// @author       atSeiunSky
// @match        https://novelai.net/image*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://novelai.net/icons/novelai-round.png
// @downloadURL https://update.greasyfork.org/scripts/554838/NovelAI%20%E7%94%9F%E6%88%90%E5%A4%B1%E8%B4%A5%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/554838/NovelAI%20%E7%94%9F%E6%88%90%E5%A4%B1%E8%B4%A5%E8%87%AA%E5%8A%A8%E9%87%8D%E8%AF%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /************** 配置区 **************/
  const GENERATE_BUTTON_TEXTS = [
    'Generate 1 Image', 'Generate',
    '生成 1 张', '生成', '开始生成'
  ];
  const GENERATE_BUTTON_SELECTOR = 'button';

  const ERROR_KEYWORDS = [
    'fail', 'failed', 'error', 'network', 'timeout',
    '失败', '错误', '超时', '网络', '额度', '配额', '队列'
  ];

  const GALLERY_ROOT_SELECTOR = null;
  const IMAGE_NODE_SELECTOR = 'img, canvas';

  // 默认配置
  const DEFAULT_MIN_DELAY = 3000;  // 默认最小 3秒
  const DEFAULT_MAX_DELAY = 5000;  // 默认最大 5秒

  /************** 工具函数 **************/
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function textIncludesAny(el, keywords) {
    if (!el) return false;
    const txt = (el.innerText || el.textContent || '').toLowerCase();
    return keywords.some(k => txt.includes(String(k).toLowerCase()));
  }

  function findGenerateButton() {
    const buttons = Array.from(document.querySelectorAll(GENERATE_BUTTON_SELECTOR));
    for (const btn of buttons) {
      const t = (btn.innerText || btn.textContent || '').trim();
      if (!t) continue;
      for (const key of GENERATE_BUTTON_TEXTS) {
        if (t.toLowerCase().includes(key.toLowerCase())) return btn;
      }
    }
    const anyButtons = Array.from(document.querySelectorAll('[role="button"], button'));
    for (const btn of anyButtons) {
      const label = (btn.getAttribute('aria-label') || '').trim();
      if (!label) continue;
      for (const key of GENERATE_BUTTON_TEXTS) {
        if (label.toLowerCase().includes(key.toLowerCase())) return btn;
      }
    }
    return null;
  }

  function getGalleryRoot() {
    if (GALLERY_ROOT_SELECTOR) {
      const root = document.querySelector(GALLERY_ROOT_SELECTOR);
      if (root) return root;
    }
    return document.body;
  }

  function countRenderedImages() {
    const root = getGalleryRoot();
    return root ? root.querySelectorAll(IMAGE_NODE_SELECTOR).length : 0;
  }

  function isButtonBusy(btn) {
    if (!btn) return false;
    if (btn.disabled) return true;
    if (btn.getAttribute('aria-busy') === 'true') return true;
    const spinner = btn.querySelector('[role="status"], [data-loading], svg[aria-hidden="true"]');
    return !!spinner;
  }

  function installErrorWatcher(onError) {
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of Array.from(m.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue;
          if (textIncludesAny(node, ERROR_KEYWORDS)) {
            onError('error-keyword-detected');
            return;
          }
          const maybeParent = node.closest?.('[role="alert"], [data-state="open"], .toast, .Snackbar, .Alert') || null;
          if (maybeParent && textIncludesAny(maybeParent, ERROR_KEYWORDS)) {
            onError('alert-detected');
            return;
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }

  /************** 配置存取 **************/
  const LS_KEY = 'nai-auto-retry-settings-simple';
  const defaultSettings = Object.freeze({
    minDelayMs: DEFAULT_MIN_DELAY,
    maxDelayMs: DEFAULT_MAX_DELAY,
    clickCooldownMs: 1000,  // 防止过快重复点击
  });

  function loadSettings() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { ...defaultSettings };
      const obj = JSON.parse(raw);
      return sanitizeSettings({ ...defaultSettings, ...obj });
    } catch {
      return { ...defaultSettings };
    }
  }

  function saveSettings(s) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(sanitizeSettings(s)));
    } catch {}
  }

  function toNumber(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function sanitizeSettings(s) {
    const x = { ...defaultSettings, ...s };
    x.minDelayMs = Math.max(0, toNumber(x.minDelayMs, 0));
    x.maxDelayMs = Math.max(0, toNumber(x.maxDelayMs, 0));
    // 确保 Max >= Min
    if (x.maxDelayMs < x.minDelayMs) {
      x.maxDelayMs = x.minDelayMs;
    }
    x.clickCooldownMs = Math.max(0, toNumber(x.clickCooldownMs, 500));
    return x;
  }

  let settings = loadSettings();

  /************** 右下角控制面板 **************/
  function createPanel() {
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.right = '14px';
    box.style.bottom = '14px';
    box.style.zIndex = '2147483647';
    box.style.background = 'rgba(0,0,0,0.7)';
    box.style.color = '#fff';
    box.style.padding = '10px 12px';
    box.style.borderRadius = '10px';
    box.style.fontSize = '12px';
    box.style.userSelect = 'none';
    box.style.backdropFilter = 'blur(4px)';
    box.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)';
    box.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;">
        <button id="nai-auto-retry-toggle" style="all:unset;background:#10b981;padding:6px 10px;border-radius:8px;cursor:pointer;">自动重试：关</button>
        <button id="nai-auto-retry-settings-toggle" style="all:unset;background:#6b7280;padding:6px 10px;border-radius:8px;cursor:pointer;">设置</button>
      </div>
      <div id="nai-auto-retry-status" style="margin-top:8px;opacity:.9;max-width:36ch;white-space:pre-wrap;line-height:1.35;">
        等待操作…
      </div>
      <div id="nai-auto-retry-settings" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.15)">
        <div style="display:grid;grid-template-columns:1fr;gap:8px;">
           
          <label style="display:flex;flex-direction:column;gap:4px;">
            <span>随机延迟范围 (ms)</span>
            <div style="display:flex;align-items:center;gap:5px;">
               <input id="set-min" type="number" min="0" step="100" placeholder="Min" style="width:100%;padding:4px;border-radius:6px;border:none;outline:none;background:rgba(255,255,255,.1);color:#fff;">
               <span>-</span>
               <input id="set-max" type="number" min="0" step="100" placeholder="Max" style="width:100%;padding:4px;border-radius:6px;border:none;outline:none;background:rgba(255,255,255,.1);color:#fff;">
            </div>
            <span style="font-size:10px;opacity:0.6;">在两个数值之间随机等待</span>
          </label>

          <label style="display:flex;flex-direction:column;gap:4px;">
            <span>点击冷却 (ms)</span>
            <input id="set-click-cooldown" type="number" min="0" step="50" style="padding:4px;border-radius:6px;border:none;outline:none;background:rgba(255,255,255,.1);color:#fff;">
          </label>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <button id="nai-auto-retry-save" style="all:unset;background:#0ea5e9;padding:6px 10px;border-radius:8px;cursor:pointer;flex:1;text-align:center;">保存</button>
          <button id="nai-auto-retry-reset" style="all:unset;background:#ef4444;padding:6px 10px;border-radius:8px;cursor:pointer;">重置</button>
        </div>
        <div id="nai-auto-retry-preview" style="margin-top:8px;font-size:10px;opacity:.7;text-align:center;"></div>
      </div>
    `;
    document.documentElement.appendChild(box);

    // DOM refs
    const toggleBtn = box.querySelector('#nai-auto-retry-toggle');
    const setToggle = box.querySelector('#nai-auto-retry-settings-toggle');
    const settingsView = box.querySelector('#nai-auto-retry-settings');
    const setMin = box.querySelector('#set-min');
    const setMax = box.querySelector('#set-max');
    const setClickCooldown = box.querySelector('#set-click-cooldown');
    const saveBtn = box.querySelector('#nai-auto-retry-save');
    const resetBtn = box.querySelector('#nai-auto-retry-reset');
    const previewSpan = box.querySelector('#nai-auto-retry-preview');

    function fillFormFromSettings() {
      setMin.value = String(settings.minDelayMs);
      setMax.value = String(settings.maxDelayMs);
      setClickCooldown.value = String(settings.clickCooldownMs);
      updatePreview();
    }

    function readFormToSettings() {
      const next = {
        ...settings,
        minDelayMs: toNumber(setMin.value, 0),
        maxDelayMs: toNumber(setMax.value, 0),
        clickCooldownMs: toNumber(setClickCooldown.value, 500),
      };
      settings = sanitizeSettings(next);
      // 回写修正后的值（例如 max < min 的情况）
      setMin.value = String(settings.minDelayMs);
      setMax.value = String(settings.maxDelayMs);
    }

    function updatePreview() {
      const mn = toNumber(setMin.value, 0);
      const mx = toNumber(setMax.value, 0);
      // 简单显示范围
      previewSpan.textContent = `当前策略: 失败后将在 ${mn}ms 到 ${Math.max(mn, mx)}ms 之间随机等待`;
    }

    [setMin, setMax, setClickCooldown].forEach(el => {
      el.addEventListener('input', updatePreview);
      el.addEventListener('change', updatePreview);
    });
    saveBtn.addEventListener('click', () => {
      readFormToSettings();
      saveSettings(settings);
      ui.log('设置已保存');
      updatePreview();
    });
    resetBtn.addEventListener('click', () => {
      settings = { ...defaultSettings };
      saveSettings(settings);
      fillFormFromSettings();
      ui.log('已恢复默认设置');
    });
    setToggle.addEventListener('click', () => {
      settingsView.style.display = settingsView.style.display === 'none' ? 'block' : 'none';
      if (settingsView.style.display === 'block') {
        fillFormFromSettings();
      }
    });

    // 初次填充表单
    fillFormFromSettings();

    return {
      box,
      toggleBtn,
      settingsBtn: setToggle,
      settingsView,
      status: box.querySelector('#nai-auto-retry-status'),
      setEnabled(flag) {
        this.toggleBtn.textContent = `自动重试：${flag ? '开' : '关'}`;
        this.toggleBtn.style.background = flag ? '#0ea5e9' : '#10b981';
      },
      log(text) {
        this.status.textContent = text;
        console.log('[NAI-AutoRetry]', text);
      },
      updatePreview,
    };
  }

  /************** 核心逻辑 **************/
  let enabled = false;
  let attempts = 0;
  let lastClickTs = 0;
  let stopErrorWatcher = null;
  let baseImageCount = 0;
  let retryTimer = null;

  const ui = createPanel();
  ui.setEnabled(false);

  // 计算延迟：仅在 Min 和 Max 之间随机
  function computeDelay() {
    const s = settings;
    const min = s.minDelayMs;
    const max = Math.max(min, s.maxDelayMs);

    // 生成 [min, max] 之间的随机整数
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return delay;
  }

  async function clickGenerate() {
    const btn = findGenerateButton();
    if (!btn) {
      ui.log('找不到“生成”按钮，稍后再试…');
      return false;
    }
    if (isButtonBusy(btn)) {
      ui.log('生成按钮忙碌中…');
      return false;
    }
    const now = Date.now();
    if (now - lastClickTs < settings.clickCooldownMs) {
      return false;
    }
    lastClickTs = now;
    btn.click();
    ui.log('已尝试点击“生成”');
    return true;
  }

  function startErrorWatcher() {
    if (stopErrorWatcher) return;
    stopErrorWatcher = installErrorWatcher((reason) => {
      if (!enabled) return;
      if (!retryTimer) {
        baseImageCount = countRenderedImages();
        attempts = 0;
      }
      scheduleRetry(`检测到失败：${reason}`);
    });
  }

  function stopErrorWatcherIfAny() {
    if (stopErrorWatcher) {
      stopErrorWatcher();
      stopErrorWatcher = null;
    }
  }

  function hasNewImageRendered() {
    const current = countRenderedImages();
    return current > baseImageCount;
  }

  function clearRetryTimer() {
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  }

  function scheduleRetry(reason = '') {
    if (!enabled) return;
    attempts++;
    
    const delay = computeDelay();
    const human = `${delay}ms`;
    ui.log(`${reason || '失败/未成功'} → 第 ${attempts} 次重试，等待 ${human} 后再试`);
    clearRetryTimer();
    // 即使 0ms 也走 setTimeout，避免阻塞主线程
    retryTimer = setTimeout(loopOnce, delay);
  }

  async function loopOnce() {
    if (!enabled) return;

    if (hasNewImageRendered()) {
      ui.log('检测到新图片渲染 ✅ 停止重试，待机中…');
      baseImageCount = countRenderedImages(); 
      attempts = 0;
      clearRetryTimer();
      return;
    }

    const didClick = await clickGenerate();
    if (!didClick) {
      scheduleRetry('按钮不可点或忙碌');
      return;
    }

    // 点击后仍需给页面一点最小反应时间
    const T0 = Date.now();
    const TIME_CAP = 9000;  // 单次点击最多等 9s 看是否成功/报错
    const POLL = 0;         // 轮询间隔

    while (Date.now() - T0 < TIME_CAP) {
      if (hasNewImageRendered()) {
        ui.log('检测到新图片渲染 ✅ 停止重试，待机中…');
        baseImageCount = countRenderedImages();
        attempts = 0;
        clearRetryTimer();
        // 同样，不关闭 enabled
        return;
      }
      await sleep(POLL);
      if (retryTimer) return; // 若期间已判定失败并安排了下一轮，这里退出
    }

    scheduleRetry('等待超时');
  }

  function start() {
    // 仅用于初次启动
    if (enabled) return;
    enabled = true;
    ui.setEnabled(true);
    baseImageCount = countRenderedImages();
    attempts = 0;
    ui.log('自动重试：已开启 (常驻)');
    startErrorWatcher();
  }

  function stopAll() {
    enabled = false;
    ui.setEnabled(false);
    stopErrorWatcherIfAny();
    clearRetryTimer();
    ui.log('已完全停止');
  }

  ui.toggleBtn.addEventListener('click', () => {
    if (!enabled) {
      start();
    } else {
      stopAll();
    }
  });

  window.addEventListener('beforeunload', stopAll);
})();