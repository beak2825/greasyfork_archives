// ==UserScript==
// @name         漫画人现代阅读器（双页+垂直模式）
// @namespace    https://tampermonkey.net/
// @version      3.0.0
// @description  现代化漫画阅读器：支持双页分栏和垂直滚动模式，触控优化，缩放功能
// @author       you
// @match        https://www.manhuaren.com/m*/
// @match        https://www.manhuaren.com/m*/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553565/%E6%BC%AB%E7%94%BB%E4%BA%BA%E7%8E%B0%E4%BB%A3%E9%98%85%E8%AF%BB%E5%99%A8%EF%BC%88%E5%8F%8C%E9%A1%B5%2B%E5%9E%82%E7%9B%B4%E6%A8%A1%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553565/%E6%BC%AB%E7%94%BB%E4%BA%BA%E7%8E%B0%E4%BB%A3%E9%98%85%E8%AF%BB%E5%99%A8%EF%BC%88%E5%8F%8C%E9%A1%B5%2B%E5%9E%82%E7%9B%B4%E6%A8%A1%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== 工具函数 =====
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const store = {
    get(k, def) { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // ===== 状态管理 =====
  const state = {
    pages: [],
    currentIndex: 0,
    mode: store.get('mcr_mode', 'dual'),           // 'dual' | 'vertical'
    rtl: store.get('mcr_rtl', true),               // 右到左
    dualFit: store.get('mcr_dualFit', 'height'),   // 'height' | 'width'
    dualGap: store.get('mcr_dualGap', 16),
    firstSingle: store.get('mcr_firstSingle', true),
    verticalZoom: store.get('mcr_verticalZoom', 100), // 50-200%
    settingsOpen: false,
    
    save() {
      store.set('mcr_mode', this.mode);
      store.set('mcr_rtl', this.rtl);
      store.set('mcr_dualFit', this.dualFit);
      store.set('mcr_dualGap', this.dualGap);
      store.set('mcr_firstSingle', this.firstSingle);
      store.set('mcr_verticalZoom', this.verticalZoom);
    }
  };

  // ===== 图片收集 =====
  async function collectImages(maxWait = 15000) {
    const start = Date.now();
    while (Date.now() - start < maxWait) {
      if (window.newImgs?.length) return [...new Set(window.newImgs.map(s => s.replace(/^\/\//, location.protocol + '//')))];
      const domImgs = $$('#cp_img img').map(n => n.dataset.src || n.src).filter(Boolean);
      if (domImgs.length) {
        await new Promise(r => setTimeout(r, 200));
        if (window.newImgs?.length) return [...new Set(window.newImgs.map(s => s.replace(/^\/\//, location.protocol + '//')))];
        return [...new Set(domImgs.map(s => s.replace(/^\/\//, location.protocol + '//')))];
      }
      await new Promise(r => setTimeout(r, 150));
    }
    return [];
  }

  // ===== 样式 =====
  const CSS = `
    :root {
      --mcr-bg: #0a0a0a;
      --mcr-surface: rgba(20, 20, 20, 0.95);
      --mcr-border: rgba(255, 255, 255, 0.08);
      --mcr-text: #e8e8e8;
      --mcr-text-dim: #a0a0a0;
      --mcr-primary: #4a9eff;
      --mcr-primary-hover: #5dadff;
      --mcr-gap: 16px;
      --mcr-radius: 12px;
      --mcr-transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #mcr-root {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: var(--mcr-bg);
      color: var(--mcr-text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
      overflow: hidden;
      touch-action: none;
    }

    /* ===== 顶栏 ===== */
    #mcr-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 56px;
      background: var(--mcr-surface);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--mcr-border);
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      z-index: 100;
      transition: var(--mcr-transition);
    }

    #mcr-header.hidden { transform: translateY(-100%); }

    .mcr-btn {
      height: 38px;
      padding: 0 16px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--mcr-text);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: var(--mcr-transition);
      white-space: nowrap;
    }

    .mcr-btn:hover { background: rgba(255, 255, 255, 0.15); }
    .mcr-btn:active { transform: scale(0.96); }
    .mcr-btn.primary { background: var(--mcr-primary); color: #fff; }
    .mcr-btn.primary:hover { background: var(--mcr-primary-hover); }
    .mcr-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .mcr-icon-btn {
      width: 38px;
      height: 38px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .mcr-spacer { flex: 1; }

    .mcr-progress {
      font-size: 13px;
      color: var(--mcr-text-dim);
      padding: 0 8px;
    }

    /* ===== 双页模式 ===== */
    #mcr-dual-container {
      position: absolute;
      top: 56px;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--mcr-gap);
      overflow: hidden;
    }

    #mcr-dual-container.fit-height .mcr-page-img {
      max-height: calc(100vh - 56px);
      width: auto;
      height: auto;
    }

    #mcr-dual-container.fit-width {
      align-items: flex-start;
      overflow: auto;
    }

    #mcr-dual-container.fit-width .mcr-page-img {
      width: calc((100vw - var(--mcr-gap) - 32px) / 2);
      height: auto;
    }

    .mcr-page-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.3s;
    }

    .mcr-page-wrap.hidden { visibility: hidden; opacity: 0; }

    .mcr-page-img {
      display: block;
      max-width: 100%;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      user-select: none;
      -webkit-user-drag: none;
    }

    .mcr-page-num {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mcr-page-wrap.left .mcr-page-num { right: auto; left: 12px; }

    /* ===== 垂直模式 ===== */
    #mcr-vertical-container {
      position: absolute;
      top: 56px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      gap: 12px;
    }

    #mcr-vertical-container .mcr-page-img {
      max-width: 95vw;
      height: auto;
      transition: transform 0.2s;
    }

    /* ===== 点击区域 ===== */
    #mcr-click-overlay {
      position: absolute;
      inset: 56px 0 0 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      pointer-events: all;
      z-index: 50;
    }

    .mcr-click-zone {
      cursor: pointer;
      transition: background 0.2s;
    }

    .mcr-click-zone:active { background: rgba(255, 255, 255, 0.03); }

    /* ===== 设置面板 ===== */
    #mcr-settings {
      position: fixed;
      top: 56px;
      right: -360px;
      width: 340px;
      bottom: 0;
      background: var(--mcr-surface);
      backdrop-filter: blur(20px);
      border-left: 1px solid var(--mcr-border);
      padding: 24px;
      overflow-y: auto;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 101;
    }

    #mcr-settings.open { right: 0; }

    #mcr-settings h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .mcr-setting-group {
      margin-bottom: 24px;
    }

    .mcr-setting-label {
      display: block;
      font-size: 13px;
      color: var(--mcr-text-dim);
      margin-bottom: 8px;
      font-weight: 500;
    }

    .mcr-btn-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .mcr-btn-group .mcr-btn {
      flex: 1;
      min-width: 0;
    }

    .mcr-btn.active {
      background: var(--mcr-primary);
      color: #fff;
    }

    .mcr-slider-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mcr-slider {
      flex: 1;
      height: 32px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      outline: none;
    }

    .mcr-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--mcr-primary);
      cursor: pointer;
      transition: var(--mcr-transition);
    }

    .mcr-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
      background: var(--mcr-primary-hover);
    }

    .mcr-slider-value {
      min-width: 50px;
      text-align: right;
      font-size: 13px;
      font-weight: 600;
    }

    .mcr-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px 0;
    }

    .mcr-checkbox input {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    /* ===== 遮罩 ===== */
    #mcr-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(2px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
      z-index: 99;
    }

    #mcr-overlay.visible {
      opacity: 1;
      pointer-events: all;
    }

    /* ===== 隐藏原站 ===== */
    body.mcr-active > *:not(#mcr-root) { display: none !important; }
    html, body { overflow: hidden !important; }

    /* ===== 响应式 ===== */
    @media (max-width: 768px) {
      #mcr-header { padding: 0 8px; gap: 6px; height: 48px; }
      .mcr-btn { height: 36px; padding: 0 12px; font-size: 12px; }
      #mcr-settings { width: 100%; right: -100%; }
      .mcr-progress { display: none; }
    }
  `;

  // ===== HTML 结构 =====
  function createUI() {
    const root = document.createElement('div');
    root.id = 'mcr-root';
    root.innerHTML = `
      <div id="mcr-header">
        <button class="mcr-btn mcr-icon-btn" id="mcr-prev">←</button>
        <button class="mcr-btn mcr-icon-btn" id="mcr-next">→</button>
        <span class="mcr-progress" id="mcr-progress">1 / 1</span>
        <span class="mcr-spacer"></span>
        <button class="mcr-btn" id="mcr-mode-toggle">切换模式</button>
        <button class="mcr-btn" id="mcr-prev-ch">上一章</button>
        <button class="mcr-btn" id="mcr-next-ch">下一章</button>
        <button class="mcr-btn primary" id="mcr-settings-btn">⚙ 设置</button>
      </div>

      <div id="mcr-dual-container" class="fit-height" style="--mcr-gap: ${state.dualGap}px">
        <div class="mcr-page-wrap left">
          <img class="mcr-page-img" id="mcr-img-left" />
          <div class="mcr-page-num" id="mcr-num-left"></div>
        </div>
        <div class="mcr-page-wrap right">
          <img class="mcr-page-img" id="mcr-img-right" />
          <div class="mcr-page-num" id="mcr-num-right"></div>
        </div>
      </div>

      <div id="mcr-vertical-container" style="display: none;"></div>

      <div id="mcr-click-overlay">
        <div class="mcr-click-zone" id="mcr-zone-left"></div>
        <div class="mcr-click-zone" id="mcr-zone-right"></div>
      </div>

      <div id="mcr-overlay"></div>

      <div id="mcr-settings">
        <h3>阅读设置</h3>
        
        <div class="mcr-setting-group">
          <div class="mcr-setting-label">阅读模式</div>
          <div class="mcr-btn-group">
            <button class="mcr-btn" data-mode="dual">双页</button>
            <button class="mcr-btn" data-mode="vertical">垂直</button>
          </div>
        </div>

        <div class="mcr-setting-group" id="mcr-dual-settings">
          <div class="mcr-setting-label">双页方向</div>
          <div class="mcr-btn-group">
            <button class="mcr-btn" data-rtl="true">右→左</button>
            <button class="mcr-btn" data-rtl="false">左→右</button>
          </div>

          <div class="mcr-setting-label" style="margin-top: 16px;">双页适配</div>
          <div class="mcr-btn-group">
            <button class="mcr-btn" data-fit="height">按高度</button>
            <button class="mcr-btn" data-fit="width">按宽度</button>
          </div>

          <div class="mcr-setting-label" style="margin-top: 16px;">页面间距</div>
          <div class="mcr-slider-container">
            <input type="range" class="mcr-slider" id="mcr-gap-slider" min="0" max="48" step="4" value="${state.dualGap}">
            <span class="mcr-slider-value" id="mcr-gap-value">${state.dualGap}px</span>
          </div>

          <label class="mcr-checkbox">
            <input type="checkbox" id="mcr-first-single" ${state.firstSingle ? 'checked' : ''}>
            <span>首页单页显示</span>
          </label>
        </div>

        <div class="mcr-setting-group" id="mcr-vertical-settings" style="display: none;">
          <div class="mcr-setting-label">页面缩放</div>
          <div class="mcr-slider-container">
            <input type="range" class="mcr-slider" id="mcr-zoom-slider" min="50" max="200" step="5" value="${state.verticalZoom}">
            <span class="mcr-slider-value" id="mcr-zoom-value">${state.verticalZoom}%</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    document.body.classList.add('mcr-active');

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    return root;
  }

  // ===== 事件绑定 =====
  function bindEvents() {
    // 导航按钮
    $('#mcr-prev').onclick = () => navigate(-1);
    $('#mcr-next').onclick = () => navigate(1);

    // 点击区域
    $('#mcr-zone-left').onclick = () => navigate(state.rtl && state.mode === 'dual' ? 1 : -1);
    $('#mcr-zone-right').onclick = () => navigate(state.rtl && state.mode === 'dual' ? -1 : 1);

    // 模式切换
    $('#mcr-mode-toggle').onclick = () => {
      state.mode = state.mode === 'dual' ? 'vertical' : 'dual';
      state.currentIndex = 0;
      state.save();
      updateUI();
      render();
    };

    // 设置按钮
    $('#mcr-settings-btn').onclick = () => {
      state.settingsOpen = !state.settingsOpen;
      $('#mcr-settings').classList.toggle('open', state.settingsOpen);
      $('#mcr-overlay').classList.toggle('visible', state.settingsOpen);
    };

    $('#mcr-overlay').onclick = () => {
      state.settingsOpen = false;
      $('#mcr-settings').classList.remove('open');
      $('#mcr-overlay').classList.remove('visible');
    };

    // 设置面板
    $$('[data-mode]').forEach(btn => {
      btn.onclick = () => {
        state.mode = btn.dataset.mode;
        state.currentIndex = 0;
        state.save();
        updateUI();
        render();
      };
    });

    $$('[data-rtl]').forEach(btn => {
      btn.onclick = () => {
        state.rtl = btn.dataset.rtl === 'true';
        state.save();
        updateUI();
        render();
      };
    });

    $$('[data-fit]').forEach(btn => {
      btn.onclick = () => {
        state.dualFit = btn.dataset.fit;
        state.save();
        updateUI();
        render();
      };
    });

    $('#mcr-gap-slider').oninput = (e) => {
      state.dualGap = parseInt(e.target.value);
      $('#mcr-gap-value').textContent = state.dualGap + 'px';
      $('#mcr-dual-container').style.setProperty('--mcr-gap', state.dualGap + 'px');
      state.save();
    };

    $('#mcr-zoom-slider').oninput = (e) => {
      state.verticalZoom = parseInt(e.target.value);
      $('#mcr-zoom-value').textContent = state.verticalZoom + '%';
      updateVerticalZoom();
      state.save();
    };

    $('#mcr-first-single').onchange = (e) => {
      state.firstSingle = e.target.checked;
      state.currentIndex = 0;
      state.save();
      render();
    };

    // 键盘
    window.addEventListener('keydown', (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      
      switch (e.key) {
        case 'ArrowRight': case ' ': e.preventDefault(); navigate(1); break;
        case 'ArrowLeft': case 'Backspace': e.preventDefault(); navigate(-1); break;
        case 'm': case 'M': $('#mcr-mode-toggle').click(); break;
        case 's': case 'S': $('#mcr-settings-btn').click(); break;
        case 'r': case 'R': state.rtl = !state.rtl; state.save(); updateUI(); render(); break;
      }
    });

    // 触控滑动
    let touchStartX = 0;
    let touchStartY = 0;
    
    $('#mcr-root').addEventListener('touchstart', (e) => {
      if (e.target.closest('#mcr-settings')) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    $('#mcr-root').addEventListener('touchend', (e) => {
      if (e.target.closest('#mcr-settings')) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        navigate(dx > 0 ? -1 : 1);
      }
    }, { passive: true });

    // 章节导航
    const [prevUrl, nextUrl] = findChapterUrls();
    $('#mcr-prev-ch').disabled = !prevUrl;
    $('#mcr-next-ch').disabled = !nextUrl;
    if (prevUrl) $('#mcr-prev-ch').onclick = () => location.href = prevUrl;
    if (nextUrl) $('#mcr-next-ch').onclick = () => location.href = nextUrl;
  }

  function findChapterUrls() {
    const links = $$('a');
    const prev = links.find(a => a.textContent.trim() === '上一章');
    const next = links.find(a => a.textContent.trim() === '下一章');
    
    const getUrl = (a) => {
      if (!a) return '';
      const href = a.getAttribute('href') || '';
      const m = href.match(/pushHistory\('([^']+)'\)/);
      return m ? location.origin + m[1] : (href.startsWith('/') ? location.origin + href : '');
    };
    
    return [getUrl(prev), getUrl(next)];
  }

  // ===== 导航 =====
  function navigate(delta) {
    if (state.mode === 'dual') {
      const total = getDualPairCount();
      state.currentIndex = clamp(state.currentIndex + delta, 0, total - 1);
    } else {
      state.currentIndex = clamp(state.currentIndex + delta, 0, state.pages.length - 1);
    }
    render();
  }

  // ===== 双页逻辑 =====
  function getDualPairCount() {
    const n = state.pages.length;
    return state.firstSingle ? 1 + Math.ceil((n - 1) / 2) : Math.ceil(n / 2);
  }

  function getDualPair(idx) {
    const n = state.pages.length;
    
    if (state.firstSingle) {
      if (idx === 0) {
        return { left: null, right: state.pages[0], leftNum: null, rightNum: 1 };
      }
      const start = 1 + (idx - 1) * 2;
      let l = state.pages[start] || null;
      let r = state.pages[start + 1] || null;
      let ln = l ? start + 1 : null;
      let rn = r ? start + 2 : null;
      if (state.rtl) { [l, r, ln, rn] = [r, l, rn, ln]; }
      return { left: l, right: r, leftNum: ln, rightNum: rn };
    } else {
      const start = idx * 2;
      let l = state.pages[start] || null;
      let r = state.pages[start + 1] || null;
      let ln = l ? start + 1 : null;
      let rn = r ? start + 2 : null;
      if (state.rtl) { [l, r, ln, rn] = [r, l, rn, ln]; }
      return { left: l, right: r, leftNum: ln, rightNum: rn };
    }
  }

  // ===== 渲染 =====
  function render() {
    if (state.mode === 'dual') {
      renderDual();
    } else {
      renderVertical();
    }
    updateProgress();
  }

  function renderDual() {
    $('#mcr-dual-container').style.display = 'flex';
    $('#mcr-vertical-container').style.display = 'none';
    $('#mcr-click-overlay').style.display = 'grid';

    const { left, right, leftNum, rightNum } = getDualPair(state.currentIndex);

    const imgL = $('#mcr-img-left');
    const imgR = $('#mcr-img-right');
    const wrapL = imgL.closest('.mcr-page-wrap');
    const wrapR = imgR.closest('.mcr-page-wrap');

    if (left) {
      imgL.src = left;
      wrapL.classList.remove('hidden');
      $('#mcr-num-left').textContent = leftNum;
    } else {
      wrapL.classList.add('hidden');
    }

    if (right) {
      imgR.src = right;
      wrapR.classList.remove('hidden');
      $('#mcr-num-right').textContent = rightNum;
    } else {
      wrapR.classList.add('hidden');
    }

    // 预加载
    const nextIdx = state.currentIndex + 1;
    if (nextIdx < getDualPairCount()) {
      const next = getDualPair(nextIdx);
      [next.left, next.right].filter(Boolean).forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }

  function renderVertical() {
    $('#mcr-dual-container').style.display = 'none';
    $('#mcr-vertical-container').style.display = 'flex';
    $('#mcr-click-overlay').style.display = 'none';

    const container = $('#mcr-vertical-container');
    if (container.children.length === 0) {
      state.pages.forEach((src, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'mcr-page-wrap';
        const img = document.createElement('img');
        img.className = 'mcr-page-img';
        img.src = src;
        img.alt = `第 ${i + 1} 页`;
        wrap.appendChild(img);
        container.appendChild(wrap);
      });
      updateVerticalZoom();
    }
  }

  function updateVerticalZoom() {
    const imgs = $$('#mcr-vertical-container .mcr-page-img');
    imgs.forEach(img => {
      img.style.transform = `scale(${state.verticalZoom / 100})`;
    });
  }

  function updateProgress() {
    const total = state.mode === 'dual' ? getDualPairCount() : state.pages.length;
    const current = state.currentIndex + 1;
    $('#mcr-progress').textContent = `${current} / ${total}`;
  }

  // ===== UI 更新 =====
  function updateUI() {
    // 模式按钮
    $$('[data-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === state.mode);
    });

    // RTL按钮
    $$('[data-rtl]').forEach(btn => {
      btn.classList.toggle('active', (btn.dataset.rtl === 'true') === state.rtl);
    });

    // 适配按钮
    $$('[data-fit]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.fit === state.dualFit);
    });

    // 显示/隐藏设置组
    $('#mcr-dual-settings').style.display = state.mode === 'dual' ? 'block' : 'none';
    $('#mcr-vertical-settings').style.display = state.mode === 'vertical' ? 'block' : 'none';

    // 双页适配类
    const container = $('#mcr-dual-container');
    container.classList.toggle('fit-height', state.dualFit === 'height');
    container.classList.toggle('fit-width', state.dualFit === 'width');
  }

  // ===== 启动 =====
  async function boot() {
    if (!/\/m\d+\/?$/.test(location.pathname)) return;

    createUI();
    bindEvents();

    const imgs = await collectImages();
    if (!imgs.length) {
      alert('未能获取到章节图片，请刷新重试');
      return;
    }

    state.pages = imgs;
    updateUI();
    render();
  }

  setTimeout(boot, 0);
})();
