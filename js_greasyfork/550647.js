// ==UserScript==
// @name         E-Hentai 功能增强
// @name:en      E-Hentai Functions Enhancement
// @namespace    https://greasyfork.org/zh-CN/users/1508871-vesper233
// @version      5.2.0
// @description  让 E-Hentai 拥有 ExHentai 风格的功能增强 (悬浮按钮、快捷键、主题切换)
// @description:en Make E-Hentai work like ExHentai with enhanced functions (floating buttons, shortcuts, theme switching)
// @author       Vesper233
// @match        *://e-hentai.org/*
// @match        *://*.e-hentai.org/*
// @match        *://upld.e-hentai.org/*
// @match        *://upload.e-hentai.org/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550647/E-Hentai%20%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550647/E-Hentai%20%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
   *    ExHentai 风格主题管理
   * ========================= */
  const EH_DOMAIN = '.e-hentai.org';
  const LS_KEY = 'eh-dark-mode-enabled';
  const CK_KEY = 'eh_dark';
  const MODE_KEY = 'eh-dark-mode-pref';
  const MODE_AUTO = 'auto';
  const MODE_DARK = 'dark';
  const MODE_LIGHT = 'light';
  const MODE_SEQUENCE = [MODE_AUTO, MODE_DARK, MODE_LIGHT];
  const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  
  // 按钮位置存储
  const POSITIONS_KEY = 'eh-button-positions';
  
  let currentMode;
  let systemListenerAttached = false;
  let darkToggleBtn;
  let toTopBtn;
  let toBottomBtn;

  const readCookie = (k) =>
    document.cookie.split('; ').find(s => s.startsWith(k + '='))?.split('=')[1];

  const writeCookie = (k, v, days = 365, domain = EH_DOMAIN) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = `${k}=${v}; expires=${d.toUTCString()}; path=/; domain=${domain}`;
  };

  const setPref = (on) => {
    localStorage.setItem(LS_KEY, on ? '1' : '0');
    writeCookie(CK_KEY, on ? '1' : '0');
  };

  const getPref = () => {
    const ls = localStorage.getItem(LS_KEY);
    if (ls !== null) return ls === '1';
    const ck = readCookie(CK_KEY);
    if (ck !== undefined && ck !== null) return ck === '1';
    return null;
  };

  const resolveSystemDark = () => mediaQuery ? mediaQuery.matches : true;

  const resolveEffectiveMode = (mode) => {
    if (mode === MODE_AUTO) return resolveSystemDark() ? MODE_DARK : MODE_LIGHT;
    return mode === MODE_LIGHT ? MODE_LIGHT : MODE_DARK;
  };

  // 立即应用主题属性（供 Stylus 使用）
  const applyThemeToDOM = (mode) => {
    const effective = resolveEffectiveMode(mode);
    const isDark = effective === MODE_DARK;
    
    // 设置主题属性供 Stylus 使用
    document.documentElement.setAttribute('data-eh-theme', mode);
    document.documentElement.setAttribute('data-system-dark', resolveSystemDark().toString());
    
    // 保存偏好
    setPref(isDark);
    
    // 调试信息
    console.log(`[ExHentai Theme] Applied mode: ${mode}, effective: ${effective}, isDark: ${isDark}`);
  };

  const updateSystemListener = () => {
    if (!mediaQuery) return;
    const handler = (event) => {
      console.log(`[ExHentai Theme] System theme changed: ${event.matches ? 'dark' : 'light'}`);
      if (currentMode === MODE_AUTO) {
        document.documentElement.setAttribute('data-system-dark', event.matches.toString());
        applyMode(MODE_AUTO, { persist: false });
      }
    };
    if (currentMode === MODE_AUTO && !systemListenerAttached) {
      if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handler);
      else mediaQuery.addListener(handler);
      systemListenerAttached = handler;
    }
    if (currentMode !== MODE_AUTO && systemListenerAttached) {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', systemListenerAttached);
      else mediaQuery.removeListener(systemListenerAttached);
      systemListenerAttached = false;
    }
  };

  const updateToggleVisual = (mode, effective) => {
    if (!darkToggleBtn) return;
    
    // ExHentai 风格的按钮颜色
    const LIGHT_BG = '#E2E0D2';
    const LIGHT_TEXT = '#1f1f1f';
    const DARK_BG = '#34353b';
    const DARK_TEXT = '#f1f1f1';
    const EXHENTAI_ACCENT = '#9e2720';
    
    darkToggleBtn.style.border = 'none';
    let shadow = '0 0 0 1px rgba(241,241,241,0.3)';
    
    if (mode === MODE_AUTO) {
      darkToggleBtn.style.background = `linear-gradient(90deg, ${LIGHT_BG} 0 50%, ${DARK_BG} 50% 100%)`;
      darkToggleBtn.style.color = DARK_TEXT;
      shadow = '0 0 0 1px rgba(241,241,241,0.2)';
      darkToggleBtn.style.textShadow = '0 0 4px rgba(0,0,0,0.5)';
    } else if (mode === MODE_LIGHT) {
      darkToggleBtn.style.background = LIGHT_BG;
      darkToggleBtn.style.color = LIGHT_TEXT;
      darkToggleBtn.style.textShadow = 'none';
      shadow = '0 0 0 1px rgba(0,0,0,0.3)';
    } else {
      darkToggleBtn.style.background = DARK_BG;
      darkToggleBtn.style.color = DARK_TEXT;
      darkToggleBtn.style.textShadow = 'none';
      shadow = '0 0 0 1px rgba(241,241,241,0.3)';
    }
    darkToggleBtn.style.boxShadow = shadow;
  };

  const updateToggleTooltip = (mode, effective) => {
    if (!darkToggleBtn) return;
    const labels = {
      [MODE_AUTO]: '系统偏好 (ExHentai风格)',
      [MODE_DARK]: '固定暗色 (ExHentai风格)',
      [MODE_LIGHT]: '固定亮色 (E-Hentai原生)'
    };
    const effectiveLabel = effective === MODE_DARK ? 'ExHentai暗色' : 'E-Hentai亮色';
    darkToggleBtn.title = `当前：${labels[mode]}\n实际：${effectiveLabel}\n点击切换模式\n长按拖拽移动`;
  };

  const applyMode = (mode, { persist = true } = {}) => {
    currentMode = mode;
    const effective = resolveEffectiveMode(mode);
    
    applyThemeToDOM(mode);
    if (persist) localStorage.setItem(MODE_KEY, mode);
    updateSystemListener();
    updateToggleTooltip(mode, effective);
    updateToggleVisual(mode, effective);
    fixMonsterBox();
    fixFavoritesUI();
  };

  const readInitialMode = () => {
    const stored = localStorage.getItem(MODE_KEY);
    if (stored === MODE_AUTO || stored === MODE_DARK || stored === MODE_LIGHT) return stored;
    
    // 如果没有存储的偏好，检查旧的偏好设置
    const oldPref = getPref();
    if (oldPref !== null) {
      return oldPref ? MODE_DARK : MODE_LIGHT;
    }
    
    // 默认使用暗色模式 (ExHentai 风格)
    return MODE_DARK;
  };

  // 立即初始化主题（在脚本开始就执行）
  const initThemeImmediate = () => {
    const initialMode = readInitialMode();
    console.log(`[ExHentai Theme] Initializing with mode: ${initialMode}`);
    
    // 立即设置DOM属性，不等待任何事件
    applyThemeToDOM(initialMode);
    currentMode = initialMode;
    
    // 保存到localStorage
    localStorage.setItem(MODE_KEY, initialMode);
  };

  // 立即执行主题初始化
  initThemeImmediate();

  /* =========================
   *      按钮位置管理
   * ========================= */
  const getStoredPositions = () => {
    try {
      const stored = localStorage.getItem(POSITIONS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  const saveButtonPosition = (buttonId, position) => {
    try {
      const positions = getStoredPositions();
      positions[buttonId] = position;
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
    } catch (e) {
      console.warn('Failed to save button position:', e);
    }
  };

  const applyStoredPosition = (button, buttonId, defaultPos) => {
    const positions = getStoredPositions();
    const stored = positions[buttonId];
    if (stored) {
      Object.assign(button.style, stored);
    } else {
      Object.assign(button.style, defaultPos);
    }
  };

  /* =========================
   *      拖拽功能实现
   * ========================= */
  const makeDraggable = (element, buttonId) => {
    let isDragging = false;
    let dragStartTime = 0;
    let startX, startY, startLeft, startTop;
    let hasMoved = false;

    const onMouseDown = (e) => {
      if (e.button !== 0) return; // 只响应左键
      
      dragStartTime = Date.now();
      hasMoved = false;
      
      const rect = element.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      
      // 添加全局事件监听
      document.addEventListener('mousemove', onMouseMove, { passive: false });
      document.addEventListener('mouseup', onMouseUp, { passive: false });
      
      // 防止文本选择
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // 检测是否开始拖拽（移动距离超过阈值或按住时间超过阈值）
      if (!isDragging) {
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const holdTime = Date.now() - dragStartTime;
        
        if (distance > 5 || holdTime > 200) {
          isDragging = true;
          element.style.cursor = 'grabbing';
          element.style.opacity = '0.8';
          element.style.transform = 'scale(1.05)';
          element.style.zIndex = '10000';
        }
      }
      
      if (isDragging) {
        hasMoved = true;
        
        // 计算新位置
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        // 边界检测
        const buttonRect = element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        newLeft = Math.max(0, Math.min(newLeft, viewportWidth - buttonRect.width));
        newTop = Math.max(0, Math.min(newTop, viewportHeight - buttonRect.height));
        
        // 应用新位置
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        
        e.preventDefault();
      }
    };

    const onMouseUp = (e) => {
      // 移除全局事件监听
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      if (isDragging) {
        isDragging = false;
        
        // 恢复样式
        element.style.cursor = 'pointer';
        element.style.opacity = '';
        element.style.transform = '';
        element.style.zIndex = '9999';
        
        // 保存位置
        const rect = element.getBoundingClientRect();
        saveButtonPosition(buttonId, {
          left: rect.left + 'px',
          top: rect.top + 'px',
          right: 'auto',
          bottom: 'auto'
        });
        
        // 如果发生了拖拽，阻止点击事件
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    // 添加鼠标按下事件
    element.addEventListener('mousedown', onMouseDown, { passive: false });
    
    // 更新提示文本
    const originalTitle = element.title;
    element.title = originalTitle + (originalTitle ? '\n' : '') + '长按拖拽移动';
  };

  /* =========================
   *    ExHentai 风格悬浮按钮样式
   * ========================= */
  const injectButtonStyles = () => {
    const styles = `
      .exh-scroll-btn {
        position: fixed;
        width: 45px;
        height: 45px;
        background-color: #34353b;
        color: #f1f1f1;
        border: 1px solid rgba(241,241,241,0.3);
        border-radius: 50%;
        cursor: pointer;
        display: none;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
        z-index: 9999;
        opacity: .9;
        transition: all .2s ease;
        user-select: none;
        backdrop-filter: blur(3px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-family: arial, helvetica, sans-serif;
      }
      .exh-scroll-btn:hover {
        opacity: 1;
        background-color: #363940;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
      .exh-scroll-btn:active {
        transform: translateY(0px);
      }
      #exh-to-top-btn {
        right: 25px;
        bottom: 130px;
      }
      #exh-to-bottom-btn {
        right: 25px;
        bottom: 75px;
      }
      #exh-dark-toggle-btn {
        right: 25px;
        top: 20px;
        display: flex !important;
        font-size: 18px;
        background-color: #34353b;
      }
      
      /* 亮色模式下的按钮样式 */
      html[data-eh-theme="light"] .exh-scroll-btn {
        background-color: #E2E0D2;
        color: #1f1f1f;
        border-color: rgba(0,0,0,0.3);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      html[data-eh-theme="light"] .exh-scroll-btn:hover {
        background-color: #f5f4e8;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
    `;

    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
  };

  /* =========================
   *   ExHentai 风格悬浮按钮
   * ========================= */
  const makeBtn = (id, text, title, defaultPos) => {
    const el = document.createElement('div');
    el.id = id; 
    el.className = 'exh-scroll-btn';
    el.textContent = text; 
    el.title = title;
    
    // 应用存储的位置或默认位置
    applyStoredPosition(el, id, defaultPos);
    
    document.body.appendChild(el);
    
    // 添加拖拽功能
    makeDraggable(el, id);
    
    return el;
  };

  const initButtons = () => {
    toTopBtn = makeBtn('exh-to-top-btn', '▲', '回到顶部 (ExHentai风格)', { right: '25px', bottom: '130px' });
    toBottomBtn = makeBtn('exh-to-bottom-btn', '▼', '直达底部 (ExHentai风格)', { right: '25px', bottom: '75px' });
    darkToggleBtn = makeBtn('exh-dark-toggle-btn', '🌓', 'ExHentai风格主题切换（快捷键：d）', { right: '25px', top: '20px', display: 'flex' });

    toTopBtn.addEventListener('click', (e) => {
      // 如果刚刚拖拽过，不执行点击
      if (e.defaultPrevented) return;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    toBottomBtn.addEventListener('click', (e) => {
      // 如果刚刚拖拽过，不执行点击
      if (e.defaultPrevented) return;
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });

    darkToggleBtn.addEventListener('click', (e) => {
      // 如果刚刚拖拽过，不执行点击
      if (e.defaultPrevented) return;
      cycleMode();
    });
    
    // 初始化按钮视觉状态
    const effective = resolveEffectiveMode(currentMode);
    updateToggleVisual(currentMode, effective);
    updateToggleTooltip(currentMode, effective);
  };

  const onScroll = () => {
    if (!toTopBtn || !toBottomBtn) return;
    const h = document.documentElement.scrollHeight;
    const ch = document.documentElement.clientHeight;
    const t = window.scrollY || document.documentElement.scrollTop;
    toTopBtn.style.display = t > 200 ? 'flex' : 'none';
    toBottomBtn.style.display = (t + ch >= h - 5) ? 'none' : 'flex';
  };

  /* =========================
   *     ExHentai 风格主题切换
   * ========================= */
  const cycleMode = (direction = 1) => {
    const step = typeof direction === 'number' ? direction : 1;
    const idx = MODE_SEQUENCE.indexOf(currentMode);
    const base = idx === -1 ? 0 : idx;
    const nextMode = MODE_SEQUENCE[(base + step + MODE_SEQUENCE.length) % MODE_SEQUENCE.length];
    console.log(`[ExHentai Theme] Cycling from ${currentMode} to ${nextMode}`);
    applyMode(nextMode);
  };

  /* =========================
   *   Monster Encounter 适配
   * ========================= */
  const MONSTER_RE = /You have encountered a monster!/i;

  function markAsMonsterBox(el){
    el.classList.add('eh-dark-monbox');
    const parentBox = el.closest('div, table, td, center, p');
    if (parentBox) parentBox.classList.add('eh-dark-monbox');
  }

  function scanMonsterBox(root=document){
    const currentTheme = document.documentElement.getAttribute('data-eh-theme');
    const systemDark = document.documentElement.getAttribute('data-system-dark') === 'true';
    const isDark = currentTheme === MODE_DARK || (currentTheme === MODE_AUTO && systemDark);
    
    if (!isDark) return;
    
    const nodes = root.querySelectorAll('div, td, p, center');
    for (const n of nodes){
      const t = (n.textContent || '').trim();
      if (!t) continue;
      if (MONSTER_RE.test(t)){
        markAsMonsterBox(n);
        const link = n.querySelector('a[href*="hentaiverse"]') || n.nextElementSibling?.querySelector?.('a[href*="hentaiverse"]');
        if (link) markAsMonsterBox(link.closest('div, td, p, center') || n);
        break;
      }
    }
  }

  function fixMonsterBox(){ scanMonsterBox(); }

  /* =========================
   *   Favorites 页面适配
   * ========================= */
  function fixFavoritesUI(root = document){
    const currentTheme = document.documentElement.getAttribute('data-eh-theme');
    const systemDark = document.documentElement.getAttribute('data-system-dark') === 'true';
    const isDark = currentTheme === MODE_DARK || (currentTheme === MODE_AUTO && systemDark);
    
    if (!isDark) return;
    if (!/\/favorites\.php(?:\?|$)/.test(location.pathname + location.search)) return;

    // 收藏夹分类 pill 适配
    const pills = root.querySelectorAll('div.fp');
    pills.forEach(el => el.classList.add('eh-dark-favpill'));

    // "Show All Favorites" 适配
    const showAllCandidates = root.querySelectorAll('a[href$="favorites.php"]:not([href*="favcat="])');
    showAllCandidates.forEach(a => {
      const box = a.closest('div, span, td, button, a') || a;
      box.classList.add('eh-dark-favpill');
    });
  }

  /* =========================
   *     ExHentai 风格快捷键
   * ========================= */
  const isTyping = (el) =>
    !!el && (['INPUT','TEXTAREA','SELECT'].includes(el.tagName) || el.isContentEditable);

  const triggerArrow = (key) => {
    const ev = new KeyboardEvent('keydown', {
      key,
      code: key,
      keyCode: key === 'ArrowLeft' ? 37 : 39,
      which:   key === 'ArrowLeft' ? 37 : 39,
      bubbles:true, cancelable:true
    });
    document.dispatchEvent(ev); window.dispatchEvent(ev);
  };

  const followNavElement = (el) => {
    if (!el) return false;

    if (el.matches?.('td[onclick*="document.location"]')) {
      const anchor = el.querySelector?.('a[href]');
      if (anchor?.href) {
        location.href = anchor.href;
      } else if (typeof el.click === 'function') {
        el.click();
      }
      return true;
    }

    if (el.matches?.('a[href]')) {
      const href = el.getAttribute('href');
      if (!href) return false;
      const onclickAttr = el.getAttribute('onclick');
      if (onclickAttr && /return\s+false/i.test(onclickAttr)) {
        location.href = href;
        return true;
      }
      el.click();
      return true;
    }

    const anchorChild = el.querySelector?.('a[href]');
    if (anchorChild) return followNavElement(anchorChild);

    const href = el.getAttribute?.('href');
    if (href) {
      location.href = href;
      return true;
    }

    return false;
  };

  const gotoPrevNextPage = (isNext) => {
    const followFirst = (selectors) => {
      for (const selector of selectors) {
        const candidate = document.querySelector(selector);
        if (candidate && followNavElement(candidate)) return true;
      }
      return false;
    };

    const directSelectors = isNext
      ? ['#dnext', '.searchnav #dnext', '.searchnav .dnext', '.dnext']
      : ['#dprev', '.searchnav #dprev', '.searchnav .dprev', '.dprev'];

    if (followFirst(directSelectors)) return true;

    const pagers = Array.from(document.querySelectorAll('table.ptt, table.ptb, .searchnav, #dprev, #dnext, .dprev, .dnext, td.ptdd'));

    const wantNext = isNext;
    const nextRegex = /(next|>>|»|>)/i;
    const prevRegex = /(prev|<<|«|<)/i;

    for (const pager of pagers) {
      const links = [];
      if (pager.matches?.('a[href], span[id^="u"], td[onclick*="document.location"]')) links.push(pager);
      links.push(...pager.querySelectorAll?.('a[href], span[id^="u"], td[onclick*="document.location"]') || []);
      if (!links.length) continue;

      const primary = links.find(a => (wantNext ? /next/i.test(a.textContent) : /prev/i.test(a.textContent)));
      if (primary) {
        if (followNavElement(primary)) return true;
      }

      if (!primary) {
        const alt = pager.querySelector(wantNext ? '#unext' : '#uprev');
        if (alt && alt.getAttribute('href')) { location.href = alt.getAttribute('href'); return true; }
      }

      const fallback = links.find(a => (wantNext ? nextRegex.test(a.textContent) : prevRegex.test(a.textContent)));
      if (fallback) {
        if (followNavElement(fallback)) return true;
      }
    }

    const direct = document.querySelector(isNext ? '#dnext a[href], #dnext' : '#dprev a[href], #dprev');
    if (direct && followNavElement(direct)) return true;
    return false;
  };

  const KEYDOWN_MARK = '__exhKeyHandled';
  const keyListenerOptions = { capture:true, passive:false };

  const onKeyDown = (e) => {
    if (e[KEYDOWN_MARK]) return;
    e[KEYDOWN_MARK] = true;

    if (isTyping(document.activeElement)) return;

    // d 键：ExHentai 风格主题切换
    const keyLower = typeof e.key === 'string' ? e.key.toLowerCase() : '';
    if (keyLower === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      cycleMode();
      return;
    }

    // [ 与 ]：ExHentai 风格翻页
    const isBracketLeft  = (e.key === '[') || (e.code === 'BracketLeft');
    const isBracketRight = (e.key === ']') || (e.code === 'BracketRight');

    if ((isBracketLeft || isBracketRight) && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      const isImageView = /\/s\//.test(location.pathname) || /\/mpv\//.test(location.pathname);
      if (isImageView) {
        if (isBracketLeft) triggerArrow('ArrowLeft'); else triggerArrow('ArrowRight');
      } else {
        const ok = gotoPrevNextPage(isBracketRight);
        if (!ok) triggerArrow(isBracketRight ? 'ArrowRight' : 'ArrowLeft');
      }
    }
  };

  // 完整的初始化函数
  const initComplete = () => {
    // 完成主题初始化（更新监听器等）
    updateSystemListener();
    fixMonsterBox();
    fixFavoritesUI();
    
    console.log(`[ExHentai Theme] Complete initialization finished with mode: ${currentMode}`);
  };

  // 初始化函数
  const init = () => {
    // 注入 ExHentai 风格按钮样式
    injectButtonStyles();
    
    // 等待body存在后初始化按钮
    if (document.body) {
      initButtons();
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        initButtons();
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      });
    }
    
    // 初始化其他功能
    document.addEventListener('DOMContentLoaded', initComplete);
    window.addEventListener('load', initComplete);
    
    // 添加MutationObserver
    const moMonster = new MutationObserver((muts)=>{
      for (const m of muts){ if (m.addedNodes?.length) fixMonsterBox(); }
    });
    moMonster.observe(document.documentElement, { childList:true, subtree:true });
    
    const moFav = new MutationObserver((muts)=>{
      for (const m of muts){ if (m.addedNodes?.length) fixFavoritesUI(m.target instanceof Document ? m.target : document); }
    });
    moFav.observe(document.documentElement, { childList:true, subtree:true });
    
    // 添加 ExHentai 风格键盘事件监听
    window.addEventListener('keydown', onKeyDown, keyListenerOptions);
    document.addEventListener('keydown', onKeyDown, keyListenerOptions);
  };

  // 根据DOM状态决定何时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();