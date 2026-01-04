// ==UserScript==
// @name         ChatFold
// @namespace    https://example.com
// @version      1.0.1
// @description  Provide collapse/expand controls for ChatGPT conversations along with a top toolbar, supporting dark mode and bilingual switching (Chinese and English). | 用于 ChatGPT 网页增强的 Tampermonkey 用户脚本。给每条消息添加折叠/展开按钮，提供顶部工具条/迷你浮窗用于批量折叠、按长度自动折叠。工具兼容多语言切换（中/英）、暗色模式自适配。
// @author       Marai
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
    }
  };
  const LANG_KEY = 'cgpt_i18n_lang';
  const TOOLBAR_MINI_KEY = 'cgpt_toolbar_mini';

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
    btnClass: 'cgpt-btn',
    iconClass: 'cgpt-icon',
    collapsedClass: 'cgpt-collapsed',
    controlBtnClass: 'cgpt-collapse-toggle',
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
      --cg-focus:#10a37f; /* OpenAI 绿 */
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
    /* 迷你胶囊（右下角） */
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

    /* 统一控件高度与对齐 */
    :root{
      --cg-control-h: 32px;   /* 所有控件统一高度 */
    }

    /* 标准按钮（统一高度） */
    .${UI.btnClass}{
      border: 1px solid var(--cg-border);
      height: var(--cg-control-h);
      padding: 0 10px;                /* 用固定高度，移除上下 padding 差异 */
      border-radius: var(--cg-radius-lg);
      cursor: pointer; background: var(--cg-btn-bg);
      color: var(--cg-text);
      display: inline-flex; align-items: center; gap: 6px;
      line-height: 1;                 /* 防止不同浏览器默认行高不一致 */
      box-sizing: border-box;
      transition: background .15s ease, transform .05s ease, box-shadow .15s ease;
    }
    .${UI.btnClass}:hover{ background: var(--cg-btn-bg-hover); }
    .${UI.btnClass}:active{ background: var(--cg-btn-bg-active); transform: translateY(1px); }
    .${UI.btnClass}:focus-visible{
      outline: 2px solid var(--cg-focus);
      outline-offset: 2px;
    }

    /* 图标（采用内联 SVG） */
    .${UI.iconClass}{
      width: 14px; height: 14px; display: inline-block;
      line-height: 0; vertical-align: middle;
    }

    /* logo 区域（应用名） */
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

    /* 每条消息右上角按钮（圆形） */
    .${UI.controlBtnClass}{
      position: absolute; right: 8px; top: 8px;
      width: 26px; height: 26px; border-radius: 999px;
      border: 1px solid var(--cg-border);
      background: var(--cg-btn-bg); color: var(--cg-text);
      cursor: pointer; opacity: .9; z-index: 5;
      display: inline-flex; align-items: center; justify-content: center;
      transition: background .15s ease, transform .05s ease;
    }
    .${UI.controlBtnClass}:hover{ background: var(--cg-btn-bg-hover); }
    .${UI.controlBtnClass}:active{ background: var(--cg-btn-bg-active); transform: scale(.98); }
    .${UI.controlBtnClass}:focus-visible{
      outline: 2px solid var(--cg-focus);
      outline-offset: 2px;
    }

    /* 折叠态容器样式 */
    .${UI.collapsedClass}{
      position: relative;
      max-height: 48px !important; overflow: hidden !important;
      border-radius: 12px; border: 1px dashed var(--cg-border);
      padding-top: 26px; /* 留出圆形按钮空间 */
    }
    /* 渐变遮罩（不拦截点击） */
    .${UI.gradientClass}{
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 28px;
      background: linear-gradient(to bottom, var(--cg-fade-from), var(--cg-fade-to));
      pointer-events: none; z-index: 3;
    }
    /* 摘要条（不拦截点击） */
    .${UI.summaryClass}{
      position: absolute; left: 12px; top: 8px; right: 56px;
      color: var(--cg-muted); font-size: 12px; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
      pointer-events: none; z-index: 2;
    }

    /* 输入与语言选择（统一高度） */
    .cgpt-input,
    #cgpt-lang-select{
      border: 1px solid var(--cg-border);
      background: var(--cg-btn-bg);
      color: var(--cg-text);
      border-radius: var(--cg-radius-lg);
      height: var(--cg-control-h);
      padding: 0 8px;                 /* 与按钮风格匹配 */
      line-height: 1;
      display: inline-flex; align-items: center;
      box-sizing: border-box;
    }

    /* 某些浏览器里的 number/select 元素对齐 */
    #cgpt-lang-select { padding-right: 26px; }  /* 为空间留出下拉箭头 */
    input[type="number"].cgpt-input{ text-align: left; }

    /* 工具条内通用水平对齐容器（新类） */
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

    /* 减少动效偏好 */
    @media (prefers-reduced-motion: reduce){
      .${UI.btnClass}, .${UI.controlBtnClass}, #${UI.toolbarCompactId}{
        transition: none !important;
      }
    }

    /* === 统一字体大小，避免 select / number 变大 === */
    :root{
      --cg-font-size: 14px;           /* 你想要的基准字号，可改 13/15 等 */
    }

    #cgpt-toolbar, .cgpt-toolbar{     /* 你的工具栏容器选择器，二选一/都保留更保险 */
      font-size: var(--cg-font-size);
      line-height: 1;                 /* 避免行高放大 */
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    /* 子元素继承容器字体 */
    #cgpt-toolbar *, .cgpt-toolbar *{
      font-size: inherit;
    }

    /* 表单控件显式继承字体，防止 UA 默认放大 */
    #cgpt-lang-select,
    #cgpt-lang-select option,
    .cgpt-input,                      /* 你的 number 输入已加这个类 */
    input[type="number"].cgpt-input{
      font-size: inherit;
      line-height: 1;                 /* 与 32px 高度的垂直对齐更稳 */
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

      const btn = document.createElement('button');
      btn.className = UI.controlBtnClass;
      btn.setAttribute('aria-label', t('btnTitleToggle'));
      btn.innerHTML = icons.chevronUp;

      btn.addEventListener('click', ()=>{
        const id = getMsgId(el);
        const collapsed = !state.getCollapsed(id);
        state.setCollapsed(id, collapsed);
        updateMessageUI(el);
      });

      const summary = document.createElement('div');
      summary.className = UI.summaryClass;
      summary.style.display = 'none';

      const fade = document.createElement('div');
      fade.className = UI.gradientClass;
      fade.style.display = 'none';

      if (getComputedStyle(el).position === 'static'){
        el.style.position = 'relative';
      }
      el.appendChild(btn);
      el.appendChild(summary);
      el.appendChild(fade);

      el.__cgpt_btn = btn;
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

    const btn = el.__cgpt_btn || el.querySelector(`.${UI.controlBtnClass}`);
    const summary = el.__cgpt_summary || el.querySelector(`.${UI.summaryClass}`);
    const fade = el.__cgpt_fade || el.querySelector(`.${UI.gradientClass}`);

    if (summary) summary.textContent = preview;

    if (collapsed){
      el.classList.add(UI.collapsedClass);
      if (btn){ btn.innerHTML = icons.chevronDown; btn.setAttribute('title', t('btnTitleExpand')); }
      if (summary) summary.style.display = 'block';
      if (fade) fade.style.display = 'block';
    }else{
      el.classList.remove(UI.collapsedClass);
      if (btn){ btn.innerHTML = icons.chevronUp; btn.setAttribute('title', t('btnTitleCollapse')); }
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
  }, 300);

  /*************** 顶栏工具条 ***************/
  let toolbarRefs = {
    bar: null,
    mini: null,
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

  function mountToolbar(){
    if (document.getElementById(UI.toolbarId) || document.getElementById(UI.toolbarCompactId)) return;

    // 主挂靠点
    let mount = null;
    for (const sel of SELECTORS.topMounts){
      const el = document.querySelector(sel);
      if (el){ mount = el; break; }
    }
    if (!mount) return;

    // 迷你泡泡（可切换回完整工具条）
    const mini = document.createElement('div');
    mini.id = UI.toolbarCompactId;
    mini.setAttribute('role', 'button');
    mini.setAttribute('aria-label', t('expandToolbar'));
    mini.innerHTML = `${icons.panel}<span>${t('expandToolbar')}</span>`;
    mini.style.display = state.getToolbarMini() ? 'flex' : 'none';
    mini.addEventListener('click', ()=>{
      state.setToolbarMini(false);
      refreshToolbarVisibility();
    });
    document.body.appendChild(mini);

    // 完整工具条
    const bar = document.createElement('div');
    bar.id = UI.toolbarId;

    // 品牌区
    const brand = document.createElement('div');
    brand.className = 'cgpt-brand';
    brand.innerHTML = `${icons.chip}<span class="cgpt-brand-name">${t('appName')}</span>`;

    // 语言选择
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

    // 功能按钮
    const btnCollapseAssistant = mkBtn(t('collapseAssistant'), icons.bot, ()=>bulkCollapseByRole('assistant', true));
    const btnCollapseUser = mkBtn(t('collapseUser'), icons.user, ()=>bulkCollapseByRole('user', true));
    const btnCollapseAll = mkBtn(t('collapseAll'), icons.collapseAll, ()=>bulkCollapseAll(true));
    const btnExpandAll = mkBtn(t('expandAll'), icons.expandAll, ()=>bulkCollapseAll(false));

    // 阈值与自动折叠
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

    // 折叠工具条按钮
    const compactBtn = mkBtn(t('compact'), icons.minus, ()=>{
      state.setToolbarMini(true);
      refreshToolbarVisibility();
    });

    // 提示
    const hint = document.createElement('span');
    hint.style.marginLeft = '6px';
    hint.style.opacity = '.65';

    // 组装
    bar.appendChild(brand);

    const langWrap = document.createElement('span');
    langWrap.className = UI.btnClass; // 让语言组也有同样背景与圆角
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
    // 用无样式容器，避免把整块当按钮导致高度/边距异常
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

    // 保存引用并写入文案
    toolbarRefs = {
      bar, mini, brand,
      btnCollapseAssistant, btnCollapseUser, btnCollapseAll, btnExpandAll,
      thresholdLabelNode, thresholdInput, btnAuto, hint, langLabel, langSelect, compactBtn
    };
    refreshToolbarTexts();

    // 插入
    mount.insertBefore(bar, mount.firstChild);
    refreshToolbarVisibility();
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
  }

  function refreshToolbarVisibility(){
    const mini = state.getToolbarMini();
    if (toolbarRefs.bar) toolbarRefs.bar.style.display = mini ? 'none' : 'flex';
    if (toolbarRefs.mini) toolbarRefs.mini.style.display = mini ? 'flex' : 'none';
  }

  function refreshAllUILabels(){
    refreshToolbarTexts();
    queryAllMessageBlocks().forEach(el=>updateMessageUI(el));
  }

  /*************** 监听 DOM 变动 ***************/
  function observe(){
    const obs = new MutationObserver(()=>{
      mountToolbar();
      initPerMessageControls();
    });
    obs.observe(document.documentElement, {childList:true, subtree:true});
  }

  /*************** 启动 ***************/
  (async function start(){
    for (let i=0;i<30;i++){
      mountToolbar();
      initPerMessageControls();
      if (document.querySelector('main')) break;
      await sleep(200);
    }
    observe();
  })();

})();