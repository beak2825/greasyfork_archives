// ==UserScript==
// @name         2libra 自定义表情收藏
// @namespace    https://2libra.com/
// @version      1.0.1
// @description  在 2libra 评论编辑器中添加自定义表情收藏与插入面板，支持粘贴链接、右键收藏、快捷键等能力。
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562599/2libra%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/562599/2libra%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 如注入失败，可调整 EDITOR_ROOT_SELECTORS 或 TOOLBAR_TARGET_SELECTOR 以适配站点 DOM。
  const STORAGE_KEY = 'emoji_favs_v1';
  const TOGGLE_HOTKEY = { altKey: true, key: 'e' };
  const INSERT_TEMPLATE = (url) => `![](<${url}>)`;
  const SITE_ENABLE_PREFIX = 'emoji_site_enable_';
  const PRIMARY_HOST = '2libra.com';
  const EDITOR_ROOT_SELECTORS = [
    '.md-editor.wmde-markdown-var.w-md-editor.w-md-editor-show-edit',
    '.md-editor.w-md-editor.w-md-editor-show-edit',
    '.md-editor.w-md-editor',
    '.w-md-editor.w-md-editor-show-edit',
    '.w-md-editor',
  ];
  const TOOLBAR_TARGET_SELECTOR = '.w-md-editor-toolbar > ul:first-of-type';
  const PANEL_SIZE = { width: 440, height: 420 };

  let favorites = loadFavorites();
  let panelVisible = false;
  let lastActiveEditorRoot = null;
  let lastActiveInput = null;
  let lastContextImageUrl = '';
  let toolbarIdCounter = 1;
  let mutationTimer = null;
  let activeItemMenuId = '';
  let currentSizeKey = 'origin';
  let dragImageUrl = '';

  const currentHost = location.host;
  const siteEnabled = isSiteEnabled(currentHost);

  if (!siteEnabled) {
    registerEnableMenu();
    return;
  }

  const ui = createUI();
  renderFavorites();
  setupGlobalListeners();
  observeEditors();
  registerMenu();
  setupStorageSync();

  function loadFavorites() {
    const stored = GM_getValue(STORAGE_KEY, []);
    return Array.isArray(stored) ? stored : [];
  }

  function isSiteEnabled(host) {
    if (host.includes(PRIMARY_HOST)) return true;
    return GM_getValue(SITE_ENABLE_PREFIX + host, false);
  }

  function registerEnableMenu() {
    if (typeof GM_registerMenuCommand !== 'function') return;
    GM_registerMenuCommand('在该站点启用收藏表情包脚本', () => {
      GM_setValue(SITE_ENABLE_PREFIX + currentHost, true);
      alert('已在该站点启用，页面将刷新以生效');
      location.reload();
    });
  }

  function saveFavorites(list) {
    favorites = list;
    GM_setValue(STORAGE_KEY, favorites);
    renderFavorites();
  }

  function shortHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36).slice(0, 6);
  }

  function deriveNameFromUrl(urlStr) {
    try {
      const u = new URL(urlStr);
      const segments = u.pathname.split('/').filter(Boolean);
      if (segments.length) {
        const raw = decodeURIComponent(segments[segments.length - 1]);
        const cleaned = raw.replace(/\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i, '').trim();
        if (cleaned) return cleaned;
      }
      return `${u.host}-${shortHash(urlStr)}`;
    } catch (e) {
      return `emoji-${shortHash(urlStr)}`;
    }
  }

  function extractUrl(input) {
    if (!input) return null;
    let str = input.trim();
    const mdMatch = str.match(/!\[[^\]]*]\(\s*<?([^)>]+)>?\s*\)/);
    if (mdMatch && mdMatch[1]) {
      str = mdMatch[1].trim();
    } else if (str.startsWith('<') && str.endsWith('>')) {
      str = str.slice(1, -1).trim();
    }
    try {
      // eslint-disable-next-line no-new
      new URL(str);
      return str;
    } catch (e) {
      return null;
    }
  }

  function sanitizeUrl(raw) {
    if (!raw) return null;
    let u;
    try {
      u = new URL(raw);
    } catch (e) {
      return null;
    }
    if (currentHost.includes(PRIMARY_HOST)) {
      const params = new URLSearchParams(u.search);
      if (params.has('size')) {
        params.delete('size');
        const nextSearch = params.toString();
        u.search = nextSearch ? `?${nextSearch}` : '';
      }
    }
    return u.toString();
  }

  function toast(message) {
    const toast = document.createElement('div');
    toast.className = 'my-emoji-toast';
    toast.textContent = message;
    ui.toastHost.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 200);
    }, 2200);
  }

  function createUI() {
    const host = document.createElement('div');
    host.id = 'my-emoji-root';
    host.style.position = 'fixed';
    host.style.zIndex = '999999';
    host.style.pointerEvents = 'none';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
      .toggle-btn {
        position: fixed;
        right: 16px;
        bottom: 16px;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: none;
        background: rgba(17,24,39,0.9);
        color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        font-weight: 700;
        pointer-events: auto;
      }
      .panel {
        position: fixed;
        right: 16px;
        bottom: 68px;
        width: ${PANEL_SIZE.width}px;
        height: ${PANEL_SIZE.height}px;
        background: rgba(11, 16, 33, 0.85);
        color: #f8fafc;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.35);
        display: none;
        flex-direction: column;
        overflow: hidden;
        pointer-events: auto;
        backdrop-filter: blur(8px);
      }
      .panel.visible { display: flex; }
      .panel-header {
        display: flex;
        gap: 8px;
        padding: 10px;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .size-row {
        display: flex;
        gap: 8px;
        padding: 10px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        align-items: center;
        flex-wrap: wrap;
      }
      .size-row .label {
        font-size: 12px;
        color: #cbd5e1;
      }
      .size-row button {
        background: rgba(255,255,255,0.08);
        color: #e2e8f0;
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 12px;
        cursor: pointer;
      }
      .size-row button.active {
        background: #2563eb;
        border-color: #2563eb;
        color: #fff;
      }
      .panel-header input {
        flex: 1;
        background: #111827;
        border: 1px solid rgba(255,255,255,0.12);
        color: #e2e8f0;
        border-radius: 6px;
        padding: 6px 8px;
        font-size: 12px;
      }
      .panel-header button {
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 12px;
        cursor: pointer;
      }
      .list {
        padding: 8px;
        display: grid;
        grid-template-columns: repeat(6, 60px);
        gap: 8px;
        overflow: auto;
        flex: 1;
        align-content: flex-start;
      }
      .item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        cursor: pointer;
      }
      .thumb {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
        background: #111827;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .caption {
        color: #e2e8f0;
        font-size: 12px;
        line-height: 1.3;
        text-align: center;
        padding: 0 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .toast-wrap {
        position: fixed;
        right: 16px;
        bottom: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      }
      .my-emoji-toast {
        background: #111827;
        color: #f8fafc;
        padding: 8px 12px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.25);
        transform: translateY(10px);
        opacity: 0;
        transition: all 0.2s ease;
      }
      .my-emoji-toast.show {
        transform: translateY(0);
        opacity: 1;
      }
      .ctx-menu {
        position: fixed;
        background: rgba(11, 16, 33, 0.92);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.35);
        padding: 6px;
        display: none;
        pointer-events: auto;
        backdrop-filter: blur(8px);
      }
      .ctx-menu button {
        background: none;
        border: none;
        color: #e2e8f0;
        padding: 6px 10px;
        width: 100%;
        text-align: left;
        cursor: pointer;
        border-radius: 6px;
      }
      .ctx-menu button:hover {
        background: rgba(255,255,255,0.08);
      }
      .item-menu {
        position: fixed;
        background: rgba(11, 16, 33, 0.92);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.35);
        padding: 6px;
        display: none;
        pointer-events: auto;
        backdrop-filter: blur(8px);
        min-width: 140px;
      }
      .item-menu button {
        background: none;
        border: none;
        color: #e2e8f0;
        padding: 6px 10px;
        width: 100%;
        text-align: left;
        cursor: pointer;
        border-radius: 6px;
      }
      .item-menu button:hover {
        background: rgba(255,255,255,0.08);
      }
      .tray {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 120px;
        background: rgba(11, 16, 33, 0.9);
        color: #e2e8f0;
        display: none;
        align-items: center;
        justify-content: center;
        border-top: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 -8px 20px rgba(0,0,0,0.25);
        pointer-events: auto;
        backdrop-filter: blur(8px);
        z-index: 1;
      }
      .tray.visible {
        display: flex;
      }
      .tray .inner {
        text-align: center;
        font-size: 14px;
        padding: 12px 18px;
        border: 1px dashed rgba(255,255,255,0.4);
        border-radius: 12px;
      }
    `;
    shadow.appendChild(style);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.title = '自定义表情 (Alt+E)';
    toggleBtn.textContent = '表情';
    toggleBtn.addEventListener('click', () => togglePanel());
    shadow.appendChild(toggleBtn);

    const panel = document.createElement('div');
    panel.className = 'panel';
    const sizeRow = document.createElement('div');
    sizeRow.className = 'size-row';
    const sizeLabel = document.createElement('span');
    sizeLabel.className = 'label';
    sizeLabel.textContent = '尺寸';
    sizeRow.appendChild(sizeLabel);
    const sizeOptions = [
      { key: 'sm', label: 'sm' },
      { key: 'md', label: 'md' },
      { key: 'lg', label: 'lg' },
      { key: 'origin', label: '原图' },
    ];
    sizeOptions.forEach((opt) => {
      const btn = document.createElement('button');
      btn.textContent = opt.label;
      btn.dataset.size = opt.key;
      if (opt.key === currentSizeKey) btn.classList.add('active');
      btn.addEventListener('click', () => {
        currentSizeKey = opt.key;
        Array.from(sizeRow.querySelectorAll('button')).forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      sizeRow.appendChild(btn);
    });
    panel.appendChild(sizeRow);

    const header = document.createElement('div');
    header.className = 'panel-header';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '粘贴图片链接';
    input.autocomplete = 'off';
    const addBtn = document.createElement('button');
    addBtn.textContent = '添加';
    addBtn.addEventListener('click', () => addByInput());
    header.appendChild(input);
    header.appendChild(addBtn);

    const list = document.createElement('div');
    list.className = 'list';
    list.addEventListener('click', onListClick);
    list.addEventListener('contextmenu', onListContextMenu);

    panel.appendChild(header);
    panel.appendChild(list);
    shadow.appendChild(panel);

    const toastWrap = document.createElement('div');
    toastWrap.className = 'toast-wrap';
    shadow.appendChild(toastWrap);

    const ctxMenu = document.createElement('div');
    ctxMenu.className = 'ctx-menu';
    const ctxBtn = document.createElement('button');
    ctxBtn.textContent = '添加到自定义表情';
    ctxBtn.addEventListener('click', () => {
      ctxMenu.style.display = 'none';
      if (lastContextImageUrl) {
        addFavorite(lastContextImageUrl);
      } else {
        toast('没有找到图片链接');
      }
    });
    ctxMenu.appendChild(ctxBtn);
    shadow.appendChild(ctxMenu);

    const itemMenu = document.createElement('div');
    itemMenu.className = 'item-menu';
    itemMenu.innerHTML = `
      <button data-action="copy">复制 Markdown</button>
      <button data-action="rename">重命名</button>
      <button data-action="editUrl">编辑链接</button>
      <button data-action="delete">删除</button>
    `;
    shadow.appendChild(itemMenu);

    const tray = document.createElement('div');
    tray.className = 'tray';
    tray.innerHTML = `<div class="inner">拖到这里收藏表情</div>`;
    shadow.appendChild(tray);

    return {
      host,
      shadow,
      toggleBtn,
      panel,
      input,
      addBtn,
      list,
      toastHost: toastWrap,
      ctxMenu,
      itemMenu,
      tray,
    };
  }

  function renderFavorites() {
    const listEl = ui.list;
    listEl.innerHTML = '';
    favorites.forEach((fav) => {
      const item = document.createElement('div');
      item.className = 'item';
      item.dataset.id = fav.id;

      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      const img = document.createElement('img');
      img.src = fav.url;
      img.alt = fav.name;

      thumb.appendChild(img);

      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.title = fav.name;
      caption.textContent = fav.name;

      item.appendChild(thumb);
      item.appendChild(caption);
      listEl.appendChild(item);
    });
  }

  function togglePanel(force) {
    const shouldShow = typeof force === 'boolean' ? force : !panelVisible;
    panelVisible = shouldShow;
    ui.panel.classList.toggle('visible', shouldShow);
    if (shouldShow) {
      ui.input.focus();
    } else {
      hideItemMenu();
    }
  }

  function addByInput() {
    const raw = ui.input.value.trim();
    if (!raw) {
      toast('请输入图片链接');
      return;
    }
    const parsed = extractUrl(raw);
    if (!parsed) {
      toast('无效的链接');
      return;
    }
    addFavorite(parsed);
    ui.input.value = '';
  }

  function addFavorite(url) {
    const cleanUrl = sanitizeUrl(url.trim());
    if (!cleanUrl) {
      toast('链接为空');
      return;
    }
    // Validate URL
    // eslint-disable-next-line no-new
    try { new URL(cleanUrl); } catch (e) { toast('无效的链接'); return; }
    if (favorites.some((f) => f.url === cleanUrl)) {
      toast('已收藏');
      return;
    }
    const now = Date.now();
    const entry = {
      id: `fav_${now}_${shortHash(cleanUrl)}`,
      name: deriveNameFromUrl(cleanUrl),
      url: cleanUrl,
      createdAt: now,
      sourcePageUrl: location.href,
    };
    const next = [entry, ...favorites];
    saveFavorites(next);
    toast('已添加到收藏');
  }

  function onListClick(e) {
    const item = e.target.closest('.item');
    if (!item) return;
    const fav = favorites.find((f) => f.id === item.dataset.id);
    if (!fav) return;
    insertFavorite(fav);
    hideItemMenu();
    togglePanel(false);
  }

  function onListContextMenu(e) {
    const item = e.target.closest('.item');
    if (!item) return;
    e.preventDefault();
    e.stopPropagation();
    if (!favorites.some((f) => f.id === item.dataset.id)) return;
    activeItemMenuId = item.dataset.id;
    showItemMenu(e.clientX, e.clientY);
  }

  function copyMarkdown(markdown) {
    if (typeof GM_setClipboard === 'function') {
      GM_setClipboard(markdown, { type: 'text', mimetype: 'text/plain' });
      toast('已复制 Markdown');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(markdown).then(() => toast('已复制 Markdown'), () => fallbackCopy(markdown));
      return;
    }
    fallbackCopy(markdown);
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-200px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    toast('已复制 Markdown');
  }

  function insertFavorite(fav) {
    const markdown = INSERT_TEMPLATE(applySizeToUrl(fav.url));
    const target = resolveTextareaTarget();
    if (target && target.textarea) {
      insertAtCursor(target.textarea, markdown);
      toast('已插入到编辑器');
    } else {
      copyMarkdown(markdown);
      toast('未找到编辑器，已复制');
    }
  }

  function applySizeToUrl(url) {
    if (!url) return url;
    if (currentSizeKey === 'origin') return url;
    return `${url}#inline-${currentSizeKey}`;
  }

  function insertAtCursor(textarea, text) {
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const value = textarea.value || '';
    const next = value.slice(0, start) + text + value.slice(end);
    textarea.value = next;
    const newPos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
  }

  function resolveTextareaTarget() {
    let root = null;
    if (lastActiveInput instanceof HTMLTextAreaElement && lastActiveInput.isConnected) {
      const maybeRoot = findEditorRootForNode(lastActiveInput);
      if (maybeRoot) {
        root = maybeRoot;
        lastActiveEditorRoot = root;
      }
    }
    if (!root || !root.isConnected) {
      if (lastActiveEditorRoot && lastActiveEditorRoot.isConnected) {
        root = lastActiveEditorRoot;
      } else {
        root = findLatestEditorRoot();
      }
    }
    if (!root) return null;
    const textarea = root.querySelector('textarea');
    if (textarea) {
      lastActiveInput = textarea;
      lastActiveEditorRoot = root;
      return { root, textarea };
    }
    return null;
  }

  function findLatestEditorRoot() {
    for (const selector of EDITOR_ROOT_SELECTORS) {
      const nodes = Array.from(document.querySelectorAll(selector));
      if (nodes.length) {
        return nodes[nodes.length - 1];
      }
    }
    return null;
  }

  function findEditorRootForNode(node) {
    if (!node) return null;
    let el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    while (el) {
      if (EDITOR_ROOT_SELECTORS.some((sel) => el.matches && el.matches(sel))) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  function ensureInjectedIntoToolbar(editorRoot) {
    if (!editorRoot || editorRoot.dataset.myEmojiInjected === '1') return;
    const target = editorRoot.querySelector(TOOLBAR_TARGET_SELECTOR);
    if (!target) return;
    const li = document.createElement('li');
    li.style.listStyle = 'none';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '表情';
    btn.className = 'my-emoji-toolbar-btn';
    btn.style.border = 'none';
    btn.style.background = 'none';
    btn.style.cursor = 'pointer';
    btn.style.padding = '6px 8px';
    btn.style.fontSize = '12px';
    btn.style.color = 'inherit';
    const id = `my-emoji-btn-${toolbarIdCounter++}`;
    btn.id = id;
    btn.addEventListener('click', () => {
      lastActiveEditorRoot = editorRoot;
      const ta = editorRoot.querySelector('textarea');
      if (ta) lastActiveInput = ta;
      togglePanel(true);
    });
    li.appendChild(btn);
    target.appendChild(li);
    editorRoot.dataset.myEmojiInjected = '1';
  }

  function observeEditors() {
    checkEditors();
    const observer = new MutationObserver(() => {
      if (mutationTimer) return;
      mutationTimer = setTimeout(() => {
        mutationTimer = null;
        checkEditors();
      }, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function checkEditors() {
    const roots = findAllEditorRoots();
    roots.forEach((root) => ensureInjectedIntoToolbar(root));
  }

  function findAllEditorRoots() {
    const set = new Set();
    EDITOR_ROOT_SELECTORS.forEach((sel) => {
      document.querySelectorAll(sel).forEach((node) => set.add(node));
    });
    return Array.from(set);
  }

  function setupGlobalListeners() {
    document.addEventListener('mousedown', (e) => {
      const path = e.composedPath();
      if (panelVisible) {
        if (!path.includes(ui.panel) && !path.includes(ui.toggleBtn) && !path.includes(ui.itemMenu)) {
          togglePanel(false);
        }
      }
      if (!path.includes(ui.ctxMenu)) {
        ui.ctxMenu.style.display = 'none';
      }
      if (!path.includes(ui.itemMenu)) {
        hideItemMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.altKey === TOGGLE_HOTKEY.altKey && e.key.toLowerCase() === TOGGLE_HOTKEY.key) {
        e.preventDefault();
        togglePanel();
      }
    });

    document.addEventListener('focusin', (e) => {
      const root = findEditorRootForNode(e.target);
      if (root) {
        lastActiveEditorRoot = root;
        if (e.target instanceof HTMLTextAreaElement) {
          lastActiveInput = e.target;
        }
        ensureInjectedIntoToolbar(root);
      }
    });

    document.addEventListener('contextmenu', (e) => {
      const img = e.target.closest ? e.target.closest('img') : null;
      if (!img) return;
      lastContextImageUrl = img.currentSrc || img.src || '';
      if (!lastContextImageUrl) return;
      showContextMenu(e.pageX, e.pageY);
    });

    document.addEventListener('click', (e) => {
      const path = e.composedPath();
      if (!path.includes(ui.ctxMenu)) {
        ui.ctxMenu.style.display = 'none';
      }
      if (!path.includes(ui.itemMenu)) {
        hideItemMenu();
      }
    });

    document.addEventListener('dragstart', (e) => {
      const img = e.target instanceof Element && e.target.closest ? e.target.closest('img') : null;
      if (!img) return;
      const url = img.currentSrc || img.src || '';
      if (!url) return;
      dragImageUrl = url;
      showTray(true);
    });

    document.addEventListener('dragend', () => {
      dragImageUrl = '';
      showTray(false);
    });

    ui.tray.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    ui.tray.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromData =
        e.dataTransfer?.getData('text/uri-list') ||
        e.dataTransfer?.getData('text/plain') ||
        '';
      const candidate = dragImageUrl || fromData.trim();
      const url = extractUrl(candidate);
      dragImageUrl = '';
      showTray(false);
      if (url) {
        addFavorite(url);
      } else {
        toast('未识别到图片链接');
      }
    });

    ui.itemMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const fav = favorites.find((f) => f.id === activeItemMenuId);
      hideItemMenu();
      if (!fav) return;
      const action = btn.dataset.action;
      if (action === 'copy') {
        copyMarkdown(INSERT_TEMPLATE(fav.url));
      } else if (action === 'rename') {
        const name = window.prompt('重命名表情', fav.name);
        if (name && name.trim()) {
          fav.name = name.trim();
          saveFavorites([...favorites]);
        }
      } else if (action === 'editUrl') {
        const urlInput = window.prompt('编辑表情链接', fav.url);
        if (!urlInput) return;
        const parsed = extractUrl(urlInput);
        const sanitized = parsed ? sanitizeUrl(parsed) : null;
        if (!sanitized) {
          toast('无效的链接');
          return;
        }
        if (favorites.some((f) => f.id !== fav.id && f.url === sanitized)) {
          toast('该链接已在收藏中');
          return;
        }
        fav.url = sanitized;
        saveFavorites([...favorites]);
      } else if (action === 'delete') {
        if (window.confirm('确认删除该表情吗？')) {
          saveFavorites(favorites.filter((f) => f.id !== fav.id));
        }
      }
    });
  }

  function showContextMenu(x, y) {
    const menu = ui.ctxMenu;
    menu.style.display = 'block';
    const rect = menu.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 8;
    const maxY = window.innerHeight - rect.height - 8;
    menu.style.left = `${Math.min(x, maxX)}px`;
    menu.style.top = `${Math.min(y, maxY)}px`;
  }

  function showItemMenu(x, y) {
    const menu = ui.itemMenu;
    if (!activeItemMenuId) return;
    menu.style.display = 'block';
    const rect = menu.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 8;
    const maxY = window.innerHeight - rect.height - 8;
    menu.style.left = `${Math.min(x, maxX)}px`;
    menu.style.top = `${Math.min(y, maxY)}px`;
  }

  function hideItemMenu() {
    ui.itemMenu.style.display = 'none';
    activeItemMenuId = '';
  }

  function showTray(show) {
    ui.tray.classList.toggle('visible', !!show);
  }

  function registerMenu() {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('添加到自定义表情（最近右键图片）', () => {
        if (lastContextImageUrl) {
          addFavorite(lastContextImageUrl);
        } else {
          toast('请先右键图片');
        }
      });
      GM_registerMenuCommand('在该站点禁用收藏表情包脚本', () => {
        GM_setValue(SITE_ENABLE_PREFIX + currentHost, false);
        alert('已禁用该站点，页面将刷新');
        location.reload();
      });
    }
  }

  function setupStorageSync() {
    if (typeof GM_addValueChangeListener !== 'function') return;
    GM_addValueChangeListener(STORAGE_KEY, (_key, _oldValue, newValue, remote) => {
      if (!remote) return;
      favorites = Array.isArray(newValue) ? newValue : [];
      renderFavorites();
    });
  }
})();
