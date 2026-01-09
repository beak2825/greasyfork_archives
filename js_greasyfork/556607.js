// ==UserScript==
// @name         Chat Enhancer — RogueShadow & Jason777 & MajoraLazur for TOS v2.0
// @version      2.0
// @description  Amélioration de la ChatBox
// @match        https://theoldschool.cc/*
// @grant        none
// @namespace    https://greasyfork.org/users/1534113
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556607/Chat%20Enhancer%20%E2%80%94%20RogueShadow%20%20Jason777%20%20MajoraLazur%20for%20TOS%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/556607/Chat%20Enhancer%20%E2%80%94%20RogueShadow%20%20Jason777%20%20MajoraLazur%20for%20TOS%20v20.meta.js
// ==/UserScript==


(() => {
  'use strict';

  const chatInputSel = '#chat-message';
  const msgWrapperSel = 'h4.list-group-item-heading.bot';
  const usernameSel = '.badge-user a';
  const msgTextSel = '.text-bright div';

  const MAX_IMAGE_WIDTH = 150;
  const MAX_IMAGE_HEIGHT = 150;

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  function isDarkMode() {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && mq.matches) return true;
    const bg = getComputedStyle(document.body).backgroundColor;
    const rgb = bg?.match(/\d+/g)?.map(Number);
    if (!rgb) return true;
    return ((rgb[0] + rgb[1] + rgb[2]) / 3) < 140;
  }

  function insertAtCursor(el, text) {
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.value = el.value.slice(0, start) + text + el.value.slice(end);
    const pos = start + text.length;
    el.setSelectionRange(pos, pos);
    el.focus();
  }

  function rgbToHex(rgb) {
    if (!rgb) return '#ecc846';
    const hexMatch = rgb.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) return rgb.toLowerCase();
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return '#ecc846';
    const [r, g, b] = m.map(Number);
    const toHex = v => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function readUserColor(el) {
    if (!el) return '#ecc846';
    const inline = el.getAttribute('style');
    if (inline && inline.includes('color')) {
      const val = inline.split(';').find(x => x.includes('color'))?.split(':')[1]?.trim();
      if (val) return rgbToHex(val);
    }
    return rgbToHex(getComputedStyle(el).color);
  }

  function makeBtn(text, title) {
    const dark = isDarkMode();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    if (title) btn.title = title;
    btn.style.cursor = 'pointer';
    btn.style.padding = '3px 8px';
    btn.style.fontSize = '14px';
    btn.style.borderRadius = '4px';
    btn.style.border = dark ? '1px solid #555' : '1px solid #aaa';
    btn.style.background = dark ? '#2a2a2a' : '#f2f2f2';
    btn.style.color = dark ? '#fff' : '#111';
    btn.style.transition = '0.15s';
    btn.addEventListener('mouseover', () => (btn.style.background = dark ? '#3c3c3c' : '#e1e1e1'));
    btn.addEventListener('mouseout',  () => (btn.style.background = dark ? '#2a2a2a' : '#f2f2f2'));
    return btn;
  }

  function findScrollableParent(startEl) {

    let cur = startEl;
    while (cur && cur !== document.body) {
      if ((cur.scrollHeight - cur.clientHeight) > 30) return cur;
      cur = cur.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

const BOTTOM_EPS = 12;

function isPageScroll(el) {
  return (
    el === document.documentElement ||
    el === document.body ||
    el === document.scrollingElement
  );
}

function remainingToBottom(el) {
  if (!el) return Infinity;

  if (isPageScroll(el)) {
    const doc = document.documentElement;
    return doc.scrollHeight - window.innerHeight - window.scrollY;
  }
  return el.scrollHeight - el.clientHeight - el.scrollTop;
}

function scrollToBottom(el, behavior = 'auto') {
  if (!el) return;

  if (isPageScroll(el)) {
    const doc = document.documentElement;
    window.scrollTo({ top: doc.scrollHeight, behavior });
    requestAnimationFrame(() => window.scrollTo(0, doc.scrollHeight));
    setTimeout(() => window.scrollTo(0, doc.scrollHeight), 120);
  } else {
    const top = el.scrollHeight - el.clientHeight + 2;
    el.scrollTo({ top, behavior });
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    setTimeout(() => { el.scrollTop = el.scrollHeight; }, 120);
  }
}

function setupAutoScrollOnce() {
  if (window.__ulcx_autoscroll_ready) return;

  const anchor = qs(msgWrapperSel) || qs(msgTextSel);
  if (!anchor) return;

  const scroller = findScrollableParent(anchor);
  if (!scroller) return;

  window.__ulcx_autoscroll_ready = true;
  window.__ulcx_scroller = scroller;

  let follow = true;

  const recomputeFollow = () => {
    follow = remainingToBottom(scroller) <= BOTTOM_EPS;
  };

  recomputeFollow();

  const onScroll = () => recomputeFollow();
  if (isPageScroll(scroller)) window.addEventListener('scroll', onScroll, { passive: true });
  else scroller.addEventListener('scroll', onScroll, { passive: true });

  const obs = new MutationObserver((mutations) => {
    const added = mutations.some(m => m.addedNodes && m.addedNodes.length);
    if (!added) return;

    recomputeFollow();
    if (!follow) return;

    requestAnimationFrame(() => {
      recomputeFollow();
      if (!follow) return;
      scrollToBottom(scroller, 'smooth');
    });
  });

  obs.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => {
    scrollToBottom(scroller, 'auto');
  }, 800);

  setupScrollDownButton(scroller);
}

function setupScrollDownButton(scroller) {
  if (!scroller || window.__ulcx_scrollBtn) return;
  window.__ulcx_scrollBtn = true;

  const btn = document.createElement('div');
  btn.id = 'ulcx-scroll-down';
  btn.title = 'Revenir en bas';

  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
         fill="none" stroke="currentColor" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5v12"></path>
      <path d="M7 13l5 5 5-5"></path>
    </svg>
  `;

  btn.tabIndex = -1;

  btn.style.position = 'fixed';
  btn.style.width = '36px';
  btn.style.height = '36px';
  btn.style.display = 'none';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.cursor = 'pointer';
  btn.style.borderRadius = '50%';
  btn.style.background = 'rgba(0,0,0,0.75)';
  btn.style.color = '#fff';
  btn.style.zIndex = '2147483647';
  btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.35)';
  btn.style.userSelect = 'none';
  btn.style.border = 'none';
  btn.style.outline = 'none';
  btn.style.webkitTapHighlightColor = 'transparent';
  btn.style.transition = 'opacity 0.2s, transform 0.2s';

  btn.addEventListener('mousedown', (e) => e.preventDefault());
  btn.addEventListener('click', () => btn.blur());
  btn.addEventListener('mouseup', () => btn.blur());
  btn.addEventListener('focus', () => btn.blur());

  if (!document.getElementById('ulcx-scroll-down-style')) {
    const st = document.createElement('style');
    st.id = 'ulcx-scroll-down-style';
    st.textContent = `
      #ulcx-scroll-down,
      #ulcx-scroll-down:focus,
      #ulcx-scroll-down:active,
      #ulcx-scroll-down:focus-visible {
        outline: none !important;
        border: none !important;
      }
      #ulcx-scroll-down svg { display:block; }
    `;
    document.head.appendChild(st);
  }

  document.body.appendChild(btn);

  const size = 36;
  const margin = 12;

  function getScrollerRect() {
    if (isPageScroll(scroller)) {
      return { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };
    }
    return scroller.getBoundingClientRect();
  }

  function positionButton() {
    const r = getScrollerRect();
    let left = r.right - margin - size;
    let top  = r.bottom - margin - size;

    left = Math.max(8, Math.min(left, window.innerWidth - size - 8));
    top  = Math.max(8, Math.min(top, window.innerHeight - size - 8));

    btn.style.left = `${left}px`;
    btn.style.top  = `${top}px`;
  }

  function show() {
    positionButton();
    btn.style.display = 'flex';
    btn.style.opacity = '1';
    btn.style.transform = 'scale(1)';
  }

  function hide() {
    btn.style.opacity = '0';
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => (btn.style.display = 'none'), 150);
  }

  function updateVisibility() {
    if (remainingToBottom(scroller) <= BOTTOM_EPS) hide();
    else show();
  }

  btn.addEventListener('click', () => {
    scrollToBottom(scroller, 'smooth');
    hide();
  });

  const onScroll = () => updateVisibility();
  if (isPageScroll(scroller)) window.addEventListener('scroll', onScroll, { passive: true });
  else scroller.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    positionButton();
    updateVisibility();
  }, { passive: true });

  const mo = new MutationObserver(() => updateVisibility());
  mo.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => {
    positionButton();
    updateVisibility();
  }, 800);
}

let __ulcx_currentUser = null;

function getCurrentUsername() {
  if (__ulcx_currentUser) return __ulcx_currentUser;

  const a = qs('a.top-nav__username--highresolution[href*="/users/"]');
  if (a) {
    const href = a.getAttribute('href') || '';
    const m = href.match(/\/users\/([^\/?#]+)/i);
    if (m && m[1]) {
      return (__ulcx_currentUser = decodeURIComponent(m[1]).trim());
    }

    const span = qs('span.text-bold', a);
    if (span) {
      const txt = (span.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
      if (txt) return (__ulcx_currentUser = txt);
    }
  }

  const span2 = qs('a.top-nav__username--highresolution span.text-bold');
  if (span2) {
    const txt2 = (span2.textContent || '').replace(/\s+/g, ' ').trim();
    if (txt2) return (__ulcx_currentUser = txt2);
  }

  return null;
}

function normName(s) {
  return (s || '')
    .toString()
    .trim()
    .replace(/^@+/, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function isMe(name) {
  const me = normName(getCurrentUsername());
  const u  = normName(name);
  return !!me && !!u && me === u;
}

  function quoteFromDOM(wrapper) {
    const box = qs(chatInputSel);
    if (!box) return;

    const uEl = qs(usernameSel, wrapper);
    const username = uEl?.innerText?.trim();
    const msg = wrapper.nextElementSibling?.querySelector(msgTextSel)?.innerText?.trim();
    if (!username || !msg) return;

	if (isMe(username)) return;


    const color = readUserColor(uEl);
    const depthMatch = msg.match(/^>+/);
    const currentDepth = depthMatch ? depthMatch[0].length : 0;
    const newDepth = Math.min(currentDepth + 1, 3);
    const cleanedMsg = msg.replace(/^>+\s*/, '');
    const prefix = '>'.repeat(newDepth) + ' ';
    const finalMsg = prefix + cleanedMsg;

    const quoteText = `[color=${color}]${username}[/color] : "[i][color=#2596be]${finalMsg}[/color][/i]"\n\n`;
    insertAtCursor(box, quoteText);
  }

function addIcons(wrapper) {
  if (!wrapper || wrapper.__ulcx_done) return;

  const uEl = qs(usernameSel, wrapper);
  if (!uEl) return;

  const author = uEl?.innerText?.trim();

  const meNow = getCurrentUsername();
  const knowMe = !!meNow;

  if (knowMe && isMe(author)) {
    const badge0 = uEl.closest('.badge-user');
    if (badge0) badge0.querySelectorAll('.ulcx-reply, .ulcx-mention').forEach(n => n.remove());
    wrapper.querySelectorAll('.ulcx-reply, .ulcx-mention').forEach(n => n.remove());
    wrapper.__ulcx_done = true;
    return;
  }

  const msgEl = wrapper.nextElementSibling?.querySelector(msgTextSel);
  if (!msgEl) return;

  const badge = uEl.closest('.badge-user');
  if (!badge) return;

  if (badge.querySelector('.ulcx-reply, .ulcx-mention') || wrapper.querySelector('.ulcx-reply, .ulcx-mention')) {
    wrapper.__ulcx_done = true;
    return;
  }

  if (wrapper.__ulcx_done) return;

  const reply = document.createElement('i');
  reply.className = 'ulcx-reply fas fa-reply';
  reply.title = 'Répondre';
  reply.style.cssText = 'cursor:pointer;color:#d82c20;';
  reply.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    quoteFromDOM(wrapper);
  });

  const mention = document.createElement('i');
  mention.className = 'ulcx-mention fas fa-at';
  mention.title = 'Mentionner';
  mention.style.cssText = 'cursor:pointer;color:#ffffff;';
  mention.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const targetName = uEl?.innerText?.trim();

    if (isMe(targetName)) return;

    const box = qs(chatInputSel);
    if (!box) return;

    const color = readUserColor(uEl);
    insertAtCursor(box, `@[color=${color}]${targetName}[/color] `);
  });

  badge.style.display = 'inline-flex';
  badge.style.alignItems = 'center';
  badge.style.gap = '6px';

  mention.style.marginLeft = '0';
  reply.style.marginLeft = '0';
  mention.style.verticalAlign = 'middle';
  reply.style.verticalAlign = 'middle';

  badge.prepend(mention);
  uEl.after(reply);

  wrapper.__ulcx_done = true;
}

function cleanupMyIcons() {
  const meNow = getCurrentUsername();
  if (!meNow) return;

  qsa(msgWrapperSel).forEach(wrapper => {
    const uEl = qs(usernameSel, wrapper);
    const author = uEl?.innerText?.trim();
    if (!author) return;

    if (isMe(author)) {
      const badge = uEl.closest('.badge-user');
      if (badge) badge.querySelectorAll('.ulcx-reply, .ulcx-mention').forEach(n => n.remove());
      wrapper.querySelectorAll('.ulcx-reply, .ulcx-mention').forEach(n => n.remove());
      wrapper.__ulcx_done = true;
    }
  });
}

function observeNewMessages() {
  const container = qs(msgWrapperSel)?.parentElement || document.body;
  if (window.__ulcx_msgObs) return;

  qsa(msgWrapperSel).forEach(addIcons);

  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (!(n instanceof Element)) continue;
        if (n.matches?.(msgWrapperSel)) addIcons(n);
        qsa(msgWrapperSel, n).forEach(addIcons);
      }
    }
    cleanupMyIcons();
  });

  obs.observe(container, { childList: true, subtree: true });
  window.__ulcx_msgObs = obs;

  cleanupMyIcons();

  if (!window.__ulcx_cleanup_timer) {
    window.__ulcx_cleanup_timer = setInterval(cleanupMyIcons, 2000);
  }
}

  function parseEmojiURL(str) {
    const parts = str.split('|');
    return { url: parts[0].trim(), width: parts[1]?.trim() || 'auto', height: parts[2]?.trim() || '50px' };
  }

  function validateImageSize(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        resolve({ ok: this.width <= MAX_IMAGE_WIDTH && this.height <= MAX_IMAGE_HEIGHT, w: this.width, h: this.height });
      };
      img.onerror = () => resolve({ ok: false, w: 0, h: 0, err: "Impossible de charger l'image" });
      img.src = url;
    });
  }

  const DB_NAME = 'TOSEmojisDB';
  const STORE = 'emojis';
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onerror = () => reject(req.error);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'url' });
      };
      req.onsuccess = () => resolve(req.result);
    });
    return dbPromise;
  }

  async function dbGetAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE], 'readonly');
      const store = tx.objectStore(STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function dbAdd(url) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE], 'readwrite');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.objectStore(STORE).put({ url });
    });
  }

  async function dbDel(url) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE], 'readwrite');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.objectStore(STORE).delete(url);
    });
  }

  function addBBPanelOnce() {
    const box = qs(chatInputSel);
    if (!box || window.__ulcx_panel) return;
    window.__ulcx_panel = true;

    const dark = isDarkMode();

    const wrap = document.createElement('div');
    wrap.style.marginTop = '8px';

    const panel = document.createElement('div');
    panel.style.display = 'flex';
    panel.style.gap = '8px';
    panel.style.alignItems = 'center';
    panel.style.padding = '6px 0';

    [
      { icon: '𝗕', tag: '[b][/b]' },
      { icon: '𝘐', tag: '[i][/i]' },
      { icon: 'U̲', tag: '[u][/u]' },
    ].forEach(({ icon, tag }) => {
      const btn = makeBtn(icon);
      btn.addEventListener('click', () => insertAtCursor(box, tag));
      panel.appendChild(btn);
    });

    const atBtn = makeBtn('@', 'Mentionner un utilisateur');
	atBtn.addEventListener('click', () => {
	  const username = prompt("Nom de l'utilisateur à mentionner :");
	  if (!username) return;

	if (isMe(username)) return;


	  const foundEl = qsa(usernameSel).find(u => u.innerText === username);
	  const bb = foundEl
		? `@[color=${readUserColor(foundEl)}]${username}[/color] `
		: `@${username} `;

	  insertAtCursor(box, bb);
	});

    panel.appendChild(atBtn);

    const popup = document.createElement('div');
    popup.style.display = 'none';
    popup.style.marginTop = '4px';
    popup.style.padding = '6px 8px';
    popup.style.borderRadius = '6px';
    popup.style.border = '1px solid ' + (dark ? '#555' : '#aaa');
    popup.style.background = dark ? '#1f1f1f' : '#fdfdfd';
    popup.style.alignItems = 'center';
    popup.style.gap = '6px';
    popup.style.flexWrap = 'wrap';

    const popupLabel = document.createElement('span');
    popupLabel.style.fontSize = '13px';
    const popupInput = document.createElement('input');
    popupInput.type = 'text';
    popupInput.style.flex = '1';
    popupInput.style.minWidth = '180px';
    popupInput.style.padding = '3px 6px';
    popupInput.style.borderRadius = '4px';
    popupInput.style.border = '1px solid ' + (dark ? '#555' : '#aaa');
    popupInput.style.background = dark ? '#111' : '#fff';
    popupInput.style.color = dark ? '#eee' : '#111';

    const okBtn = makeBtn('OK');
    const xBtn = makeBtn('X');
    xBtn.style.padding = '3px 6px';

    popup.append(popupLabel, popupInput, okBtn, xBtn);

    let popupMode = null;
    const openPopup = (mode) => {
      popupMode = mode;
      popupLabel.textContent = mode === 'img' ? 'Lien image :' : 'Lien :';
      popup.style.display = 'flex';
      popupInput.value = '';
      popupInput.focus();
    };
    const closePopup = () => {
      popup.style.display = 'none';
      popupMode = null;
      popupInput.value = '';
      box.focus();
    };
    const validatePopup = () => {
      const val = popupInput.value.trim();
      if (!val || !popupMode) return closePopup();
      insertAtCursor(box, popupMode === 'img' ? `[img]${val}[/img]` : `[url]${val}[/url]`);
      closePopup();
    };
    okBtn.addEventListener('click', validatePopup);
    xBtn.addEventListener('click', closePopup);
    popupInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); validatePopup(); }
      if (e.key === 'Escape') { e.preventDefault(); closePopup(); }
    });

    panel.appendChild(makeBtn('🖼', 'Insérer image')).addEventListener('click', () => openPopup('img'));
    panel.appendChild(makeBtn('🔗', 'Insérer lien')).addEventListener('click', () => openPopup('url'));

    const mkDrawer = () => {
      const d = document.createElement('div');
      d.style.display = 'none';
      d.style.flexWrap = 'wrap';
      d.style.gap = '8px';
      d.style.padding = '6px 8px';
      d.style.marginTop = '4px';
      d.style.background = dark ? '#1e1e1e' : '#ffffff';
      d.style.border = '1px solid #444';
      d.style.borderRadius = '6px';
      d.style.maxHeight = '260px';
      d.style.overflowY = 'auto';
      d.style.width = '100%';
      return d;
    };

const drawerBase = mkDrawer();
const drawerRetro = mkDrawer();

const toggleBase = makeBtn('🙂', 'Emojis de base');
toggleBase.style.fontSize = '16px';

const toggleRetro = makeBtn('🕹️', 'Emojis rétro + persos');
toggleRetro.style.fontSize = '16px';

const closeOthers = (keep) => {
  if (keep !== drawerBase) drawerBase.style.display = 'none';
  if (keep !== drawerRetro) drawerRetro.style.display = 'none';
};

toggleBase.addEventListener('click', () => {
  drawerBase.style.display = drawerBase.style.display === 'flex' ? 'none' : 'flex';
  closeOthers(drawerBase);
});

toggleRetro.addEventListener('click', () => {
  drawerRetro.style.display = drawerRetro.style.display === 'flex' ? 'none' : 'flex';
  closeOthers(drawerRetro);
});

panel.append(toggleBase, toggleRetro);

    const emojis = [

      '😀','😁','😂','🤣','😅','😊','🙂','🙃','😉','😌','😍','🥰','😘','😚','😙','😗',
      '😋','😛','😜','🤪','😝','🤨','🧐','🤔','🤫','🤭','🤗','🤐','😶','😮‍💨',
      '😏','😒','🙄','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥱','😴',
      '😵','🤯','😲','😳','🥺','😭','😢','😤','😠','😡','🤬','🤡','🥳','🤠','😇',
 

      '👍','👎','👏','🙌','🙏','🤝','🤞','✌️','🤟','👌','👋','✋','🤚','🖐️','🤙','💪',
 

      '❤️','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💖','💘','💝','❣️','💕','💞','💓','💗','💟',
 

      '🧠','💀','☠️','💩','👻','👽','🤖','😈','👺','🗿','🧲',
 

      '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵',
      '🐔','🐧','🐦','🐤','🐣','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🦋',
 

      '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🍒','🍑','🍍','🥭','🥑',
      '🥦','🥬','🍅','🍆','🌶️','🌽','🥕','🥔','🍠','🍞','🥐','🧀','🥓','🍗','🍖',
      '🍕','🍔','🌭','🥪','🌮','🌯','🥙','🍣','🍱','🍛','🍲','🍜','🍝',
      '🍩','🍪','🧁','🍰','🎂','🍫','🍿','🍺','🍻','🍷','🥂','🍸','🍹','🥃','☕','🍵',
 

      '💾','📀','💿','📁','📂','🗂️','🖥️','💻','⌨️','🖱️','🖲️','📡','📶','🔗','🧲',
      '⚙️','🛠️','🔧','🧰','📤','📥','📦','🧾',
 

      '🔥','⚡','✨','⭐','🌟','💫','⚠️','❗','❓','✅','❌','♻️','🔒','🔓','🔔','🔕',
      '🕹️','🎯','🏁','🚀','⏳','⌛','🔄','ℹ️','💯','🏆','🥇','🥈','🥉',
 

      '🎉','🎊','🎈','🎃','🎄','🎆','🎇','🎁','🕯️','🧨','🎭','🎀',
 

      '🌙','🌞','🌤️','🌧️','⛈️','🌩️','🌈','❄️','☃️','🍀','🧯','🛡️','🗝️'
    ];

    for (const e of emojis) {
      const span = document.createElement('span');
      span.textContent = e;
      span.style.cursor = 'pointer';
      span.style.fontSize = '20px';
      span.style.userSelect = 'none';
      span.style.margin = '4px';
      span.style.transition = '0.12s';
      span.addEventListener('mouseover', () => (span.style.transform = 'scale(1.25)'));
      span.addEventListener('mouseout',  () => (span.style.transform = 'scale(1)'));
      span.addEventListener('click', () => insertAtCursor(box, e));
      drawerBase.appendChild(span);
    }

    const retroEmojis = [];

    for (const urlStr of retroEmojis) {
      const em = parseEmojiURL(urlStr);
      const container = document.createElement('div');
      container.style.display = 'inline-flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.width = '100px';
      container.style.height = '60px';
      container.style.margin = '4px';

      const img = document.createElement('img');
      img.src = em.url;
      img.style.width = em.width;
      img.style.height = em.height;
      img.style.maxWidth = '100px';
      img.style.maxHeight = '60px';
      img.style.cursor = 'pointer';
      img.style.objectFit = 'contain';
      img.title = 'Clic pour insérer';
      img.addEventListener('click', () => insertAtCursor(box, `[img]${em.url}[/img]`));

      container.appendChild(img);
      drawerRetro.appendChild(container);
    }

const plus = document.createElement('span');
plus.textContent = '+';
plus.title = "Ajouter des emojis/GIFs (URLs)";
plus.style.cursor = 'pointer';
plus.style.fontSize = '22px';
plus.style.fontWeight = 'bold';
plus.style.padding = '6px 10px';
plus.style.margin = '4px';
plus.style.border = '2px dashed #888';
plus.style.borderRadius = '6px';
plus.style.display = 'inline-flex';
plus.style.alignItems = 'center';
plus.style.justifyContent = 'center';
plus.style.transition = '0.15s';
plus.addEventListener('mouseover', () => (plus.style.background = dark ? '#3c3c3c' : '#e1e1e1'));
plus.addEventListener('mouseout',  () => (plus.style.background = dark ? '#2a2a2a' : '#f9f9f9'));

const customSet = new Set();

function renderCustomInRetro(url) {
  if (customSet.has(url)) return;
  customSet.add(url);

  const img = document.createElement('img');
  img.src = url;
  img.style.maxWidth = MAX_IMAGE_WIDTH + 'px';
  img.style.maxHeight = MAX_IMAGE_HEIGHT + 'px';
  img.style.width = 'auto';
  img.style.height = 'auto';
  img.style.margin = '4px';
  img.style.cursor = 'pointer';
  img.style.objectFit = 'contain';
  img.title = 'Clic pour insérer | Clic droit pour supprimer';

  img.addEventListener('click', () => insertAtCursor(box, `[img]${url}[/img]`));

  img.addEventListener('contextmenu', async (e) => {
    e.preventDefault();
    if (!confirm('Supprimer cet emoji/GIF définitivement ?')) return;
    img.remove();
    customSet.delete(url);
    try { await dbDel(url); } catch (err) { console.error('Delete DB error:', err); }
  });

  drawerRetro.insertBefore(img, plus);
}

async function addCustomToRetro(url) {
  url = (url || '').trim();
  if (!url) return false;

  if (customSet.has(url)) return false;

  const check = await validateImageSize(url);
  if (!check.ok) {
    const msg = check.err || `Image trop grande (${check.w}x${check.h}). Max: ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT}px`;
    alert('❌ ' + msg);
    return false;
  }

  try {
    await dbAdd(url);
    renderCustomInRetro(url);
    return true;
  } catch (e) {
    console.error('DB add error', e);
    alert('❌ Erreur sauvegarde IndexedDB');
    return false;
  }
}

plus.addEventListener('click', async () => {
  const input = prompt(
    "Colle une ou plusieurs URLs (1 par ligne).\n" +
    "Séparateurs acceptés : retour ligne, espace, virgule."
  );
  if (!input) return;

  const urls = input
    .split(/[\n\r\s,]+/g)
    .map(s => s.trim())
    .filter(Boolean);

  if (!urls.length) return;

  let added = 0;
  const skipped = [];

  for (const url of urls) {
    const ok = await addCustomToRetro(url);
    if (ok) added++;
    else skipped.push(url);
  }

  if (skipped.length) {
    alert(
      `✅ Ajoutés: ${added}\n` +
      `⚠️ Ignorés: ${skipped.length} (invalides/trop grands/doublons)\n\n` +
      `- ${skipped.slice(0, 10).join("\n- ")}${skipped.length > 10 ? "\n- ..." : ""}`
    );
  } else {
    alert(`✅ ${added} emoji(s) ajouté(s) !`);
  }
});

drawerRetro.appendChild(plus);

(async () => {
  try {
    const all = await dbGetAll();
    for (const item of all) renderCustomInRetro(item.url);
    console.log(`✅ ${all.length} emoji(s) perso chargé(s) depuis IndexedDB (dans rétro)`);
  } catch (e) {
    console.error('❌ Erreur IndexedDB:', e);
  }
})();

    wrap.append(panel, popup, drawerBase, drawerRetro);
    box.parentNode.insertBefore(wrap, box.nextSibling);
  }

  function boot() {
    let tries = 0;
    const t = setInterval(() => {
      tries++;

      const box = qs(chatInputSel);
      if (box) addBBPanelOnce();

      setupAutoScrollOnce();
      observeNewMessages();

      if (window.__ulcx_panel && window.__ulcx_autoscroll_ready && window.__ulcx_msgObs) {
        clearInterval(t);
      }

      if (tries >= 120) clearInterval(t);
    }, 500);
  }
  boot();
})();