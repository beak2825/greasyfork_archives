// ==UserScript==
// @name         ChatFold
// @namespace    https://example.com
// @version      1.0.2
// @description  Provide collapse/expand controls for ChatGPT conversations along with a top toolbar, supporting dark mode and bilingual switching (Chinese and English).
// @author       Zhaoyang-Song
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552914/ChatFold.user.js
// @updateURL https://update.greasyfork.org/scripts/552914/ChatFold.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*************** i18n ***************/
  const I18N = {
    zh: {
      appName: 'ChatFold',
      toolbarHint: '提示：每条消息右上角可单独折叠/展开',
      collapseAssistant: '折叠助手',
      collapseUser: '折叠用户',
      collapseAll: '全部折叠',
      expandAll: '全部展开',
      threshold: '阈值',
      autoCollapseByLen: '按长度自动折叠',
      btnCollapse: '折叠',
      btnExpand: '展开',
      btnTitleToggle: '折叠/展开此消息',
      btnTitleCollapse: '折叠此消息',
      btnTitleExpand: '展开此消息',
      roleUser: '用户',
      roleAssistant: '助手',
      langLabel: '语言',
      langZh: '中文',
      langEn: 'English',
      compact: '折叠工具条',
      expandToolbar: '展开工具条',

      // NEW
      floatingToggleShow: '显示工具条',
      floatingToggleHide: '隐藏工具条',
    },
    en: {
      appName: 'ChatFold',
      toolbarHint: 'Tip: Use the per-message button to collapse/expand.',
      collapseAssistant: 'Collapse Assistant',
      collapseUser: 'Collapse User',
      collapseAll: 'Collapse All',
      expandAll: 'Expand All',
      threshold: 'Threshold',
      autoCollapseByLen: 'Auto-collapse by length',
      btnCollapse: 'Collapse',
      btnExpand: 'Expand',
      btnTitleToggle: 'Collapse/Expand this message',
      btnTitleCollapse: 'Collapse this message',
      btnTitleExpand: 'Expand this message',
      roleUser: 'user',
      roleAssistant: 'assistant',
      langLabel: 'Language',
      langZh: '中文',
      langEn: 'English',
      compact: 'Collapse Toolbar',
      expandToolbar: 'Expand Toolbar',

      // NEW
      floatingToggleShow: 'Show Toolbar',
      floatingToggleHide: 'Hide Toolbar',
    }
  };
  const LANG_KEY = 'cgpt_i18n_lang';
  const TOOLBAR_MINI_KEY = 'cgpt_toolbar_mini';
  const TOOLBAR_FLOAT_OPEN_KEY = 'cgpt_toolbar_float_open'; // NEW

  function detectDefaultLang(){
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) return saved;
    const nav = (navigator.language || '').toLowerCase();
    return nav.startsWith('zh') ? 'zh' : 'en';
  }
  let currentLang = detectDefaultLang();
  function setLang(lang){
    if (!I18N[lang]) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    refreshAllUILabels();
  }
  function t(key){
    const pack = I18N[currentLang] || I18N.en;
    return pack[key] ?? key;
  }

  /*************** 选择器与参数 ***************/
  const SELECTORS = {
    messageBlocks: '[data-message-author-role]',
    fallbackBlocks: 'main .group, main .text-base',
    topMounts: ['div[data-testid="conversation-turns"]', 'main', 'body'],
  };

  const UI = {
    toolbarId: 'cgpt-collapse-toolbar',
    toolbarCompactId: 'cgpt-collapse-toolbar-compact',
    toolbarFloatToggleId: 'cgpt-collapse-toolbar-float-toggle', // NEW（右下角第二个按钮）
    toolbarFloatingClass: 'cgpt-toolbar-floating',               // NEW（浮动工具条样式类）

    btnClass: 'cgpt-btn',
    iconClass: 'cgpt-icon',
    collapsedClass: 'cgpt-collapsed',
    controlBtnClass: 'cgpt-collapse-toggle',
    controlBtnBottomClass: 'cgpt-collapse-toggle-bottom',
    summaryClass: 'cgpt-summary-line',
    gradientClass: 'cgpt-fade-gradient',
    defaultPreviewLen: 60,
    autoCollapseThresholdDefault: 600,
  };

  /*************** 样式 ***************/
  GM_addStyle(`
    :root{
      --cg-blur: 10px;
      --cg-radius-xl: 14px;
      --cg-radius-lg: 10px;
      --cg-shadow: 0 8px 20px rgba(0,0,0,.08);
      --cg-shadow-strong: 0 10px 30px rgba(0,0,0,.12);

      --cg-bg: rgba(255,255,255,.85);
      --cg-border:#e5e7eb;
      --cg-btn-bg:#ffffff;
      --cg-btn-bg-hover:#f5f5f5;
      --cg-btn-bg-active:#efefef;
      --cg-text:#111827;
      --cg-muted:#6b7280;
      --cg-focus:#10a37f;
      --cg-chip:#f3f4f6;

      --cg-fade-from: rgba(255,255,255,0);
      --cg-fade-to: rgba(255,255,255,.92);
    }
    html.dark, [data-theme="dark"]{
      --cg-bg: rgba(26,26,26,.72);
      --cg-border:#2f2f2f;
      --cg-btn-bg:#1f1f1f;
      --cg-btn-bg-hover:#2a2a2a;
      --cg-btn-bg-active:#333333;
      --cg-text:#e5e7eb;
      --cg-muted:#a1a1aa;
      --cg-focus:#10a37f;
      --cg-chip:#232323;

      --cg-fade-from: rgba(31,31,31,0);
      --cg-fade-to: rgba(31,31,31,.92);
    }
    @media (prefers-color-scheme: dark){
      :root{
        --cg-bg: rgba(26,26,26,.72);
        --cg-border:#2f2f2f;
        --cg-btn-bg:#1f1f1f;
        --cg-btn-bg-hover:#2a2a2a;
        --cg-btn-bg-active:#333333;
        --cg-text:#e5e7eb;
        --cg-muted:#a1a1aa;
        --cg-focus:#10a37f;
        --cg-chip:#232323;

        --cg-fade-from: rgba(31,31,31,0);
        --cg-fade-to: rgba(31,31,31,.92);
      }
    }

    /* 顶部工具条：玻璃化卡片 */
    #${UI.toolbarId}{
      position: sticky; top: 0; z-index: 9999;
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 10px 12px; margin: 8px 0 10px;
      background: var(--cg-bg); backdrop-filter: blur(var(--cg-blur));
      border: 1px solid var(--cg-border); border-radius: var(--cg-radius-xl);
      box-shadow: var(--cg-shadow);
      color: var(--cg-text); font-size: 12px; line-height: 1.2;
    }

    /* NEW：浮动工具条（显示在当前位置：右下角上方） */
    #${UI.toolbarId}.${UI.toolbarFloatingClass}{
      position: fixed !important;
      right: 16px !important;
      bottom: 62px !important;  /* 给右下角按钮留空间 */
      top: auto !important;
      margin: 0 !important;
      max-width: min(92vw, 980px);
      z-index: 9999 !important;
    }

    /* 迷你胶囊（右下角：展开工具条） */
    #${UI.toolbarCompactId}{
      position: fixed; right: 16px; bottom: 16px; z-index: 9999;
      display: flex; align-items: center; gap: 8px;
      padding: 8px 10px;
      background: var(--cg-bg); backdrop-filter: blur(var(--cg-blur));
      border: 1px solid var(--cg-border); border-radius: 999px;
      box-shadow: var(--cg-shadow-strong);
      color: var(--cg-text); font-size: 12px; cursor: pointer;
      user-select: none;
    }
    #${UI.toolbarCompactId}:hover{ transform: translateY(-1px); }
    #${UI.toolbarCompactId}:active{ transform: translateY(0); }

    /* NEW：右下角“显示/隐藏工具条”按钮（与迷你胶囊外观一致） */
    #${UI.toolbarFloatToggleId}{
      position: fixed; right: 16px; bottom: 16px; z-index: 9999;
      display: none; align-items: center; gap: 8px;
      padding: 8px 10px;
      background: var(--cg-bg); backdrop-filter: blur(var(--cg-blur));
      border: 1px solid var(--cg-border); border-radius: 999px;
      box-shadow: var(--cg-shadow-strong);
      color: var(--cg-text); font-size: 12px; cursor: pointer;
      user-select: none;
    }
    #${UI.toolbarFloatToggleId}:hover{ transform: translateY(-1px); }
    #${UI.toolbarFloatToggleId}:active{ transform: translateY(0); }

    /* 统一控件高度与对齐 */
    :root{ --cg-control-h: 32px; }

    .${UI.btnClass}{
      border: 1px solid var(--cg-border);
      height: var(--cg-control-h);
      padding: 0 10px;
      border-radius: var(--cg-radius-lg);
      cursor: pointer; background: var(--cg-btn-bg);
      color: var(--cg-text);
      display: inline-flex; align-items: center; gap: 6px;
      line-height: 1;
      box-sizing: border-box;
      transition: background .15s ease, transform .05s ease, box-shadow .15s ease;
    }
    .${UI.btnClass}:hover{ background: var(--cg-btn-bg-hover); }
    .${UI.btnClass}:active{ background: var(--cg-btn-bg-active); transform: translateY(1px); }
    .${UI.btnClass}:focus-visible{
      outline: 2px solid var(--cg-focus);
      outline-offset: 2px;
    }

    .${UI.iconClass}{
      width: 14px; height: 14px; display: inline-block;
      line-height: 0; vertical-align: middle;
    }

    .cgpt-brand{
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 10px; border-radius: 999px;
      background: var(--cg-chip); border: 1px solid var(--cg-border);
      margin-right: 6px; user-select: none;
    }
    .cgpt-dot{
      width: 10px; height: 10px; border-radius: 999px; background: var(--cg-focus);
      box-shadow: 0 0 0 3px rgba(16,163,127,.15);
    }

    /* 消息按钮：移出内容区域，避免遮挡文字 */
    .${UI.controlBtnClass},
    .${UI.controlBtnBottomClass}{
      position: absolute;
      width: 26px; height: 26px; border-radius: 999px;
      border: 1px solid var(--cg-border);
      background: var(--cg-btn-bg); color: var(--cg-text);
      cursor: pointer; opacity: .92; z-index: 6;
      display: inline-flex; align-items: center; justify-content: center;
      transition: background .15s ease, transform .05s ease;
      box-shadow: var(--cg-shadow);
    }
    .${UI.controlBtnClass}{ right: -10px; top: -10px; }
    .${UI.controlBtnBottomClass}{ right: -10px; bottom: -10px; }

    .${UI.controlBtnClass}:hover,
    .${UI.controlBtnBottomClass}:hover{ background: var(--cg-btn-bg-hover); }
    .${UI.controlBtnClass}:active,
    .${UI.controlBtnBottomClass}:active{ background: var(--cg-btn-bg-active); transform: scale(.98); }
    .${UI.controlBtnClass}:focus-visible,
    .${UI.controlBtnBottomClass}:focus-visible{
      outline: 2px solid var(--cg-focus);
      outline-offset: 2px;
    }

    .${UI.collapsedClass}{
      position: relative;
      max-height: 48px !important; overflow: hidden !important;
      border-radius: 12px; border: 1px dashed var(--cg-border);
      padding-top: 26px;
    }
    .${UI.gradientClass}{
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 28px;
      background: linear-gradient(to bottom, var(--cg-fade-from), var(--cg-fade-to));
      pointer-events: none; z-index: 3;
    }
    .${UI.summaryClass}{
      position: absolute; left: 12px; top: 8px; right: 56px;
      color: var(--cg-muted); font-size: 12px; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
      pointer-events: none; z-index: 2;
    }

    .cgpt-input,
    #cgpt-lang-select{
      border: 1px solid var(--cg-border);
      background: var(--cg-btn-bg);
      color: var(--cg-text);
      border-radius: var(--cg-radius-lg);
      height: var(--cg-control-h);
      padding: 0 8px;
      line-height: 1;
      display: inline-flex; align-items: center;
      box-sizing: border-box;
    }
    #cgpt-lang-select { padding-right: 26px; }
    input[type="number"].cgpt-input{ text-align: left; }

    .cgpt-group{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: var(--cg-control-h);
    }

    .cgpt-input:focus-visible, #cgpt-lang-select:focus-visible{
      outline: 2px solid var(--cg-focus);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce){
      .${UI.btnClass}, .${UI.controlBtnClass}, .${UI.controlBtnBottomClass}, #${UI.toolbarCompactId}, #${UI.toolbarFloatToggleId}{
        transition: none !important;
      }
    }

    :root{ --cg-font-size: 14px; }
    #cgpt-toolbar, .cgpt-toolbar{
      font-size: var(--cg-font-size);
      line-height: 1;
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
    #cgpt-toolbar *, .cgpt-toolbar *{ font-size: inherit; }
    #cgpt-lang-select,
    #cgpt-lang-select option,
    .cgpt-input,
    input[type="number"].cgpt-input{
      font-size: inherit;
      line-height: 1;
    }
  `);

  /*************** 工具函数 ***************/
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  const throttle = (fn, wait)=>{
    let t=null, last=0;
    return (...args)=>{
      const now = Date.now();
      if (now-last >= wait){ last = now; fn(...args); }
      else { clearTimeout(t); t=setTimeout(()=>{ last=Date.now(); fn(...args); }, wait-(now-last)); }
    };
  };
  const hash = (str) => {
    let h = 5381; for (let i=0;i<str.length;i++){ h=((h<<5)+h)+str.charCodeAt(i); }
    return (h>>>0).toString(36);
  };

  const getRole = (el)=>{
    const role = el.getAttribute('data-message-author-role');
    if (role) return role;
    const text = el.textContent?.toLowerCase() || '';
    if (/user/.test(text)) return 'user';
    if (/assistant|gpt/.test(text)) return 'assistant';
    return 'unknown';
  };

  const getTextFromBlock = (el)=>{
    const t = el.querySelector('.markdown, .prose')?.innerText
      || el.querySelector('[data-message-author-role] div')?.innerText
      || el.innerText
      || '';
    return (t || '').trim();
  };

  const getMsgId = (el)=>{
    const exist = el.getAttribute('data-message-id') || el.id;
    if (exist) return exist;
    const text = getTextFromBlock(el);
    const role = getRole(el);
    const id = 'msg_' + role + '_' + hash(text).slice(0,8);
    el.setAttribute('data-message-id', id);
    return id;
  };

  const state = {
    getCollapsed(id){ return sessionStorage.getItem('cgpt_c_'+id)==='1'; },
    setCollapsed(id,v){ sessionStorage.setItem('cgpt_c_'+id, v?'1':'0'); },
    getThreshold(){
      const v = localStorage.getItem('cgpt_auto_thresh');
      return v ? parseInt(v,10) : UI.autoCollapseThresholdDefault;
    },
    setThreshold(n){ localStorage.setItem('cgpt_auto_thresh', String(n)); },
    getToolbarMini(){
      return localStorage.getItem(TOOLBAR_MINI_KEY) === '1';
    },
    setToolbarMini(v){
      localStorage.setItem(TOOLBAR_MINI_KEY, v?'1':'0');
    },

    // NEW：浮动工具条开关（右下角按钮控制）
    getToolbarFloatOpen(){
      return localStorage.getItem(TOOLBAR_FLOAT_OPEN_KEY) === '1';
    },
    setToolbarFloatOpen(v){
      localStorage.setItem(TOOLBAR_FLOAT_OPEN_KEY, v?'1':'0');
    }
  };

  /*************** SVG 图标 ***************/
  const icons = {
    bot: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M7 10a5 5 0 0110 0v2h1a2 2 0 012 2v3a3 3 0 01-3 3H7a3 3 0 01-3-3v-3a2 2 0 012-2h1v-2z" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM3 21a9 9 0 1118 0v1H3v-1z" stroke="currentColor" stroke-width="1.5"/></svg>`,
    collapseAll: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M7 15l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    expandAll: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M7 9l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    wand: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M4 20l9-9m3-6l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M12 21a9 9 0 100-18 9 9 0 000 18zM2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19" stroke="currentColor" stroke-width="1.2"/></svg>`,
    chip: `<span class="cgpt-dot"></span>`,
    chevronUp: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M7 14l5-5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    minus: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    panel: `<svg viewBox="0 0 24 24" fill="none" class="${UI.iconClass}" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 4v14" stroke="currentColor" stroke-width="1.5"/></svg>`,
  };

  /*************** 渲染与控制（消息） ***************/
  function renderMessage(el, forceCollapsed){
    if (!el.__cgpt_inited){
      el.__cgpt_inited = true;

      const toggle = ()=>{
        const id = getMsgId(el);
        const collapsed = !state.getCollapsed(id);
        state.setCollapsed(id, collapsed);
        updateMessageUI(el);
      };

      const btnTop = document.createElement('button');
      btnTop.className = UI.controlBtnClass;
      btnTop.setAttribute('aria-label', t('btnTitleToggle'));
      btnTop.innerHTML = icons.chevronUp;
      btnTop.addEventListener('click', toggle);

      const btnBottom = document.createElement('button');
      btnBottom.className = UI.controlBtnBottomClass;
      btnBottom.setAttribute('aria-label', t('btnTitleToggle'));
      btnBottom.innerHTML = icons.chevronUp;
      btnBottom.addEventListener('click', toggle);

      const summary = document.createElement('div');
      summary.className = UI.summaryClass;
      summary.style.display = 'none';

      const fade = document.createElement('div');
      fade.className = UI.gradientClass;
      fade.style.display = 'none';

      if (!el.style.position || el.style.position === 'static'){
        el.style.position = 'relative';
      }

      el.appendChild(btnTop);
      el.appendChild(btnBottom);
      el.appendChild(summary);
      el.appendChild(fade);

      el.__cgpt_btn = btnTop;
      el.__cgpt_btnBottom = btnBottom;
      el.__cgpt_summary = summary;
      el.__cgpt_fade = fade;
    }

    if (typeof forceCollapsed === 'boolean'){
      const id = getMsgId(el);
      state.setCollapsed(id, forceCollapsed);
    }
    updateMessageUI(el);
  }

  function localizedRole(role){
    if (role === 'user') return t('roleUser');
    if (role === 'assistant') return t('roleAssistant');
    return role;
  }

  function updateMessageUI(el){
    const id = getMsgId(el);
    const collapsed = state.getCollapsed(id);
    const roleRaw = getRole(el);
    const text = getTextFromBlock(el);
    const role = localizedRole(roleRaw);
    const preview = `${role}｜${text.replace(/\s+/g,' ').slice(0, UI.defaultPreviewLen)}${text.length>UI.defaultPreviewLen?'…':''}`;

    const btnTop = el.__cgpt_btn || el.querySelector(`.${UI.controlBtnClass}`);
    const btnBottom = el.__cgpt_btnBottom || el.querySelector(`.${UI.controlBtnBottomClass}`);
    const summary = el.__cgpt_summary || el.querySelector(`.${UI.summaryClass}`);
    const fade = el.__cgpt_fade || el.querySelector(`.${UI.gradientClass}`);

    if (summary) summary.textContent = preview;

    if (collapsed){
      el.classList.add(UI.collapsedClass);
      if (btnTop){ btnTop.innerHTML = icons.chevronDown; btnTop.setAttribute('title', t('btnTitleExpand')); }
      if (btnBottom){ btnBottom.style.display = 'none'; }
      if (summary) summary.style.display = 'block';
      if (fade) fade.style.display = 'block';
    }else{
      el.classList.remove(UI.collapsedClass);
      if (btnTop){ btnTop.innerHTML = icons.chevronUp; btnTop.setAttribute('title', t('btnTitleCollapse')); }
      if (btnBottom){
        btnBottom.style.display = 'inline-flex';
        btnBottom.innerHTML = icons.chevronUp;
        btnBottom.setAttribute('title', t('btnTitleCollapse'));
      }
      if (summary) summary.style.display = 'none';
      if (fade) fade.style.display = 'none';
    }
  }

  function setCollapsed(el, collapsed){
    const id = getMsgId(el);
    state.setCollapsed(id, collapsed);
    updateMessageUI(el);
  }

  function queryAllMessageBlocks(){
    const primary = Array.from(document.querySelectorAll(SELECTORS.messageBlocks));
    if (primary.length) return primary;
    const fallback = Array.from(document.querySelectorAll(SELECTORS.fallbackBlocks))
      .filter(el=>{
        const t = (el.innerText||'').trim();
        return t.length>0 && el.offsetHeight>20;
      });
    return fallback;
  }

  const initPerMessageControls = throttle(()=>{
    queryAllMessageBlocks().forEach(el=>renderMessage(el));
  }, 350);

  /*************** 顶栏工具条 ***************/
  let toolbarRefs = {
    bar: null,
    mini: null,
    floatToggle: null, // NEW
    brand: null,
    btnCollapseAssistant: null,
    btnCollapseUser: null,
    btnCollapseAll: null,
    btnExpandAll: null,
    thresholdLabelNode: null,
    thresholdInput: null,
    btnAuto: null,
    hint: null,
    langLabel: null,
    langSelect: null,
    compactBtn: null,
  };

  function mkBtn(text, iconSvg, onClick){
    const b = document.createElement('button');
    b.className = UI.btnClass;
    b.innerHTML = `${iconSvg || ''}<span>${text}</span>`;
    b.addEventListener('click', onClick);
    return b;
  }

  function autoCollapseByLength(threshold){
    queryAllMessageBlocks().forEach(el=>{
      const text = getTextFromBlock(el);
      if (text.length >= threshold) setCollapsed(el, true);
    });
  }

  function bulkCollapseAll(flag){
    queryAllMessageBlocks().forEach(el=>setCollapsed(el, flag));
  }

  function bulkCollapseByRole(role, flag){
    queryAllMessageBlocks().forEach(el=>{
      if (getRole(el)===role) setCollapsed(el, flag);
    });
  }

  // ===== NEW：检测顶部工具条是否可见 + 右下角按钮控制“当前位置显示/隐藏工具条” =====
  let barInView = true;

  function isElementInViewport(el){
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // 与视口有交集即认为可见（简单且稳健）
    return rect.bottom > 0 && rect.right > 0 && rect.left < vw && rect.top < vh;
  }

  const updateBarInView = throttle(()=>{
    const bar = toolbarRefs.bar;
    if (!bar) return;
    barInView = isElementInViewport(bar);
    refreshFloatingToggleVisibility();
  }, 120);

  function applyFloatingMode(open){
    const bar = toolbarRefs.bar;
    if (!bar) return;

    // mini 模式优先：如果已经 mini，就不允许浮动显示
    if (state.getToolbarMini()){
      state.setToolbarFloatOpen(false);
      bar.classList.remove(UI.toolbarFloatingClass);
      return;
    }

    if (open){
      bar.classList.add(UI.toolbarFloatingClass);
      bar.style.display = 'flex';
    } else {
      bar.classList.remove(UI.toolbarFloatingClass);
      bar.style.display = 'flex'; // 仍回到原位置显示（是否能看到取决于滚动）
    }
    refreshFloatingToggleText();
    refreshFloatingToggleVisibility();
  }

  function refreshFloatingToggleText(){
    const btn = toolbarRefs.floatToggle;
    if (!btn) return;
    const open = state.getToolbarFloatOpen();
    btn.innerHTML = `${icons.panel}<span>${open ? t('floatingToggleHide') : t('floatingToggleShow')}</span>`;
    btn.setAttribute('aria-label', open ? t('floatingToggleHide') : t('floatingToggleShow'));
  }

  function refreshFloatingToggleVisibility(){
    const btn = toolbarRefs.floatToggle;
    if (!btn) return;

    // 不干扰你原有“迷你胶囊”：mini 显示时，本按钮完全隐藏
    if (state.getToolbarMini()){
      btn.style.display = 'none';
      return;
    }

    // 规则：
    // - 顶部工具条在视口内：隐藏（因为不需要）
    // - 顶部工具条不在视口内：显示按钮
    // - 如果浮动工具条已打开：按钮也必须显示（用于关闭）
    const open = state.getToolbarFloatOpen();
    const shouldShow = open || !barInView;
    btn.style.display = shouldShow ? 'flex' : 'none';
  }
  // ===== NEW 结束 =====

  function mountToolbar(){
    if (document.getElementById(UI.toolbarId) || document.getElementById(UI.toolbarCompactId) || document.getElementById(UI.toolbarFloatToggleId)) return;

    let mount = null;
    for (const sel of SELECTORS.topMounts){
      const el = document.querySelector(sel);
      if (el){ mount = el; break; }
    }
    if (!mount) return;

    // 迷你泡泡（原有功能：用于“折叠工具条”后的展开）
    const mini = document.createElement('div');
    mini.id = UI.toolbarCompactId;
    mini.setAttribute('role', 'button');
    mini.setAttribute('aria-label', t('expandToolbar'));
    mini.innerHTML = `${icons.panel}<span>${t('expandToolbar')}</span>`;
    mini.style.display = state.getToolbarMini() ? 'flex' : 'none';
    mini.addEventListener('click', ()=>{
      state.setToolbarMini(false);
      refreshToolbarVisibility();
      updateBarInView(); // NEW：状态刷新
    });
    document.body.appendChild(mini);

    // NEW：右下角“显示/隐藏工具条”按钮（仅当顶部工具条滚出视口时出现）
    const floatToggle = document.createElement('div');
    floatToggle.id = UI.toolbarFloatToggleId;
    floatToggle.setAttribute('role', 'button');
    floatToggle.style.display = 'none';
    floatToggle.addEventListener('click', ()=>{
      const next = !state.getToolbarFloatOpen();
      state.setToolbarFloatOpen(next);
      applyFloatingMode(next);
    });
    document.body.appendChild(floatToggle);

    // 完整工具条
    const bar = document.createElement('div');
    bar.id = UI.toolbarId;

    const brand = document.createElement('div');
    brand.className = 'cgpt-brand';
    brand.innerHTML = `${icons.chip}<span class="cgpt-brand-name">${t('appName')}</span>`;

    const langLabel = document.createElement('span');
    langLabel.id = 'cgpt-lang-label';
    langLabel.style.margin = '0 2px 0 6px';
    langLabel.style.opacity = '.75';

    const langSelect = document.createElement('select');
    langSelect.id = 'cgpt-lang-select';
    const optZh = document.createElement('option');
    optZh.value = 'zh'; optZh.textContent = I18N.zh.langZh;
    const optEn = document.createElement('option');
    optEn.value = 'en'; optEn.textContent = I18N.en.langEn;
    langSelect.appendChild(optZh); langSelect.appendChild(optEn);
    langSelect.value = currentLang;
    langSelect.addEventListener('change', ()=>setLang(langSelect.value));

    const btnCollapseAssistant = mkBtn(t('collapseAssistant'), icons.bot, ()=>bulkCollapseByRole('assistant', true));
    const btnCollapseUser = mkBtn(t('collapseUser'), icons.user, ()=>bulkCollapseByRole('user', true));
    const btnCollapseAll = mkBtn(t('collapseAll'), icons.collapseAll, ()=>bulkCollapseAll(true));
    const btnExpandAll = mkBtn(t('expandAll'), icons.expandAll, ()=>bulkCollapseAll(false));

    const thresholdLabelNode = document.createElement('span');
    thresholdLabelNode.style.marginLeft = '8px';
    const thresholdInput = document.createElement('input');
    thresholdInput.type = 'number';
    thresholdInput.min = '50';
    thresholdInput.step = '50';
    thresholdInput.value = String(state.getThreshold());
    thresholdInput.className = 'cgpt-input';
    thresholdInput.style.width = '96px';
    thresholdInput.title = t('autoCollapseByLen');

    const btnAuto = mkBtn(t('autoCollapseByLen'), icons.wand, ()=>{
      const n = parseInt(thresholdInput.value,10) || UI.autoCollapseThresholdDefault;
      state.setThreshold(n);
      autoCollapseByLength(n);
    });

    const compactBtn = mkBtn(t('compact'), icons.minus, ()=>{
      state.setToolbarMini(true);
      // NEW：mini 时关闭浮动显示，避免冲突
      state.setToolbarFloatOpen(false);
      applyFloatingMode(false);
      refreshToolbarVisibility();
    });

    const hint = document.createElement('span');
    hint.style.marginLeft = '6px';
    hint.style.opacity = '.65';

    bar.appendChild(brand);

    const langWrap = document.createElement('span');
    langWrap.className = UI.btnClass;
    langWrap.style.display = 'inline-flex';
    langWrap.style.alignItems = 'center';
    langWrap.style.gap = '6px';
    langWrap.style.paddingRight = '8px';
    const globe = document.createElement('span');
    globe.innerHTML = icons.globe;
    globe.style.marginLeft = '8px';
    langWrap.appendChild(globe);
    langWrap.appendChild(langLabel);
    langWrap.appendChild(langSelect);
    bar.appendChild(langWrap);

    bar.appendChild(btnCollapseAssistant);
    bar.appendChild(btnCollapseUser);
    bar.appendChild(btnCollapseAll);
    bar.appendChild(btnExpandAll);

    const threshWrap = document.createElement('span');
    threshWrap.className = 'cgpt-group';

    const knobMinus = document.createElement('button');
    knobMinus.className = UI.btnClass;
    knobMinus.innerHTML = icons.minus;
    knobMinus.addEventListener('click', ()=>{
      const cur = parseInt(thresholdInput.value||'0',10);
      thresholdInput.value = String(Math.max(50, cur-50));
    });
    const knobPlus = document.createElement('button');
    knobPlus.className = UI.btnClass;
    knobPlus.innerHTML = icons.plus;
    knobPlus.addEventListener('click', ()=>{
      const cur = parseInt(thresholdInput.value||'0',10);
      thresholdInput.value = String(cur+50);
    });

    threshWrap.appendChild(thresholdLabelNode);
    threshWrap.appendChild(thresholdInput);
    threshWrap.appendChild(knobMinus);
    threshWrap.appendChild(knobPlus);
    bar.appendChild(threshWrap);

    bar.appendChild(btnAuto);
    bar.appendChild(compactBtn);
    bar.appendChild(hint);

    toolbarRefs = {
      bar, mini, floatToggle, brand,
      btnCollapseAssistant, btnCollapseUser, btnCollapseAll, btnExpandAll,
      thresholdLabelNode, thresholdInput, btnAuto, hint, langLabel, langSelect, compactBtn
    };
    refreshToolbarTexts();

    mount.insertBefore(bar, mount.firstChild);

    // NEW：根据持久化状态恢复浮动模式（不改变你原有功能，只是恢复新增功能的状态）
    applyFloatingMode(state.getToolbarFloatOpen());

    refreshToolbarVisibility();
    updateBarInView();
  }

  function refreshToolbarTexts(){
    if (!toolbarRefs.bar) return;
    const brandName = toolbarRefs.brand.querySelector('.cgpt-brand-name');
    if (brandName) brandName.textContent = t('appName');

    toolbarRefs.langLabel.textContent = `${t('langLabel')}:`;
    toolbarRefs.btnCollapseAssistant.innerHTML = `${icons.bot}<span>${t('collapseAssistant')}</span>`;
    toolbarRefs.btnCollapseUser.innerHTML = `${icons.user}<span>${t('collapseUser')}</span>`;
    toolbarRefs.btnCollapseAll.innerHTML = `${icons.collapseAll}<span>${t('collapseAll')}</span>`;
    toolbarRefs.btnExpandAll.innerHTML = `${icons.expandAll}<span>${t('expandAll')}</span>`;
    toolbarRefs.thresholdLabelNode.textContent = ` ${t('threshold')}:`;
    toolbarRefs.btnAuto.innerHTML = `${icons.wand}<span>${t('autoCollapseByLen')}</span>`;
    toolbarRefs.hint.textContent = t('toolbarHint');
    toolbarRefs.thresholdInput.title = t('autoCollapseByLen');
    toolbarRefs.compactBtn.innerHTML = `${icons.minus}<span>${t('compact')}</span>`;

    if (toolbarRefs.mini){
      toolbarRefs.mini.innerHTML = `${icons.panel}<span>${t('expandToolbar')}</span>`;
      toolbarRefs.mini.setAttribute('aria-label', t('expandToolbar'));
    }

    // NEW：右下角“显示/隐藏工具条”按钮文字随语言变化
    refreshFloatingToggleText();
  }

  function refreshToolbarVisibility(){
    const mini = state.getToolbarMini();

    // mini 模式：顶部工具条隐藏，右下角“展开工具条”显示
    if (toolbarRefs.bar) toolbarRefs.bar.style.display = mini ? 'none' : 'flex';
    if (toolbarRefs.mini) toolbarRefs.mini.style.display = mini ? 'flex' : 'none';

    // NEW：mini 模式下，隐藏“显示/隐藏工具条”按钮
    refreshFloatingToggleVisibility();
  }

  function refreshAllUILabels(){
    refreshToolbarTexts();
    queryAllMessageBlocks().forEach(el=>updateMessageUI(el));
  }

  /*************** 性能优化版 DOM 监听 ***************/
  const pendingNodes = new Set();
  let flushScheduled = false;

  function scheduleFlush(){
    if (flushScheduled) return;
    flushScheduled = true;

    const runner = ()=>{
      flushScheduled = false;

      mountToolbar();

      if (pendingNodes.size){
        for (const n of pendingNodes){
          if (!n || n.nodeType !== 1) continue;

          if (n.matches?.(SELECTORS.messageBlocks)) renderMessage(n);
          n.querySelectorAll?.(SELECTORS.messageBlocks)?.forEach(el=>renderMessage(el));

          if (!document.querySelector(SELECTORS.messageBlocks)){
            n.querySelectorAll?.(SELECTORS.fallbackBlocks)?.forEach(el=>{
              const tt = (el.innerText||'').trim();
              if (tt.length>0 && el.offsetHeight>20) renderMessage(el);
            });
          }
        }
        pendingNodes.clear();
      } else {
        initPerMessageControls();
      }

      // NEW：DOM 更新后刷新顶部工具条可见性判断
      updateBarInView();
    };

    if (window.requestIdleCallback){
      window.requestIdleCallback(runner, {timeout: 800});
    } else {
      setTimeout(runner, 120);
    }
  }

  function observe(){
    const obs = new MutationObserver((muts)=>{
      for (const m of muts){
        if (m.addedNodes && m.addedNodes.length){
          m.addedNodes.forEach(n=>pendingNodes.add(n));
        }
      }
      scheduleFlush();
    });
    obs.observe(document.documentElement, {childList:true, subtree:true});

    // NEW：捕获所有滚动（包括内部可滚动容器），让“顶部消失检测”稳定工作
    document.addEventListener('scroll', updateBarInView, {capture:true, passive:true});
    window.addEventListener('resize', updateBarInView, {passive:true});
  }

  /*************** 启动 ***************/
  (async function start(){
    for (let i=0;i<30;i++){
      mountToolbar();
      initPerMessageControls();
      updateBarInView(); // NEW
      if (document.querySelector('main')) break;
      await sleep(200);
    }
    observe();
  })();

})();