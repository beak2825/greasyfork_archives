// ==UserScript==
// @name         Chat Enhancer — RogueShadow & Jason777 & MajoraLazur for TOS v2.1
// @version      2.1
// @description  Amélioration de la ChatBox
// @match        https://theoldschool.cc/*
// @grant        none
// @namespace    https://greasyfork.org/users/1534113
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562925/Chat%20Enhancer%20%E2%80%94%20RogueShadow%20%20Jason777%20%20MajoraLazur%20for%20TOS%20v21.user.js
// @updateURL https://update.greasyfork.org/scripts/562925/Chat%20Enhancer%20%E2%80%94%20RogueShadow%20%20Jason777%20%20MajoraLazur%20for%20TOS%20v21.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SELECTORS = {
    chatInput: '#chat-message',
    msgHeader: 'h4.list-group-item-heading.bot',
    usernameLink: '.badge-user a',
    msgText: '.text-bright div',
    tab: '.panel__tab',
    tabLink: '.panel__tab a[role="tab"]',
  };

  const LIMITS = { maxW: 150, maxH: 150 };
  const BOTTOM_EPS = 12;
  const DB = { name: 'TOSEmojisDB', store: 'emojis' };

  const AUTO_SCROLL_ONLY_WHEN_CHAT_INPUT_VISIBLE = true;

  const BASE_EMOJIS = `
😀 😁 😂 🤣 😅 😊 🙂 🙃 😉 😌 😍 🥰 😘 😚 😙 😗
😋 😛 😜 🤪 😝 🤨 🧐 🤔 🤫 🤭 🤗 🤐 😶 😮‍💨
😏 😒 🙄 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥱 😴
😵 🤯 😲 😳 🥺 😭 😢 😤 😠 😡 🤬 🤡 🥳 🤠 😇
👍 👎 👏 🙌 🙏 🤝 🤞 ✌️ 🤟 👌 👋 ✋ 🤚 🖐️ 🤙 💪
❤️ 🧡 💛 💚 💙 💜 🤎 🖤 🤍 💖 💘 💝 ❣️ 💕 💞 💓 💗 💟
🧠 💀 ☠️ 💩 👻 👽 🤖 😈 👺 🗿 🧲
🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵
🐔 🐧 🐦 🐤 🐣 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🦋
🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🍒 🍑 🍍 🥭 🥑
🥦 🥬 🍅 🍆 🌶️ 🌽 🥕 🥔 🍠 🍞 🥐 🧀 🥓 🍗 🍖
🍕 🍔 🌭 🥪 🌮 🌯 🥙 🍣 🍱 🍛 🍲 🍜 🍝
🍩 🍪 🧁 🍰 🎂 🍫 🍿 🍺 🍻 🍷 🥂 🍸 🍹 🥃 ☕ 🍵
💾 📀 💿 📁 📂 🗂️ 🖥️ 💻 ⌨️ 🖱️ 🖲️ 📡 📶 🔗 🧲
⚙️ 🛠️ 🔧 🧰 📤 📥 📦 🧾
🔥 ⚡ ✨ ⭐ 🌟 💫 ⚠️ ❗ ❓ ✅ ❌ ♻️ 🔒 🔓 🔔 🔕
🕹️ 🎯 🏁 🚀 ⏳ ⌛ 🔄 ℹ️ 💯 🏆 🥇 🥈 🥉
🎉 🎊 🎈 🎃 🎄 🎆 🎇 🎁 🕯️ 🧨 🎭 🎀
🌙 🌞 🌤️ 🌧️ ⛈️ 🌩️ 🌈 ❄️ ☃️ 🍀 🧯 🛡️ 🗝️
`.trim().split(/\s+/);

  const retroEmojis = [];

  const state = {
    dark: null,
    myName: null,

    panelReady: false,
    tabHooksReady: false,

    msgObserver: null,
    listObserverTarget: null,
    cleanupTimer: null,

    autoscrollReady: false,
    listForAutoscroll: null,
    scroller: null,
    scrollBtnReady: false,

    badgeObservers: new WeakMap(),
    dbPromise: null,

    drawerBase: null,
    drawerRetro: null,
    retroGrid: null,
    retroPlus: null,
    retroCustomSet: null,

    draggingUrl: null,

    jobs: new Map(),
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const isVisible = (el) => !!el && el.offsetParent !== null;

  function debounceRaf(key, fn) {
    const prev = state.jobs.get(key);
    if (prev) cancelAnimationFrame(prev);
    const id = requestAnimationFrame(() => {
      state.jobs.delete(key);
      fn();
    });
    state.jobs.set(key, id);
  }

  function debounceMs(key, ms, fn) {
    const prev = state.jobs.get(key);
    if (prev) clearTimeout(prev);
    const id = setTimeout(() => {
      state.jobs.delete(key);
      fn();
    }, ms);
    state.jobs.set(key, id);
  }

  const isPageScroll = (el) =>
    el === document.documentElement || el === document.body || el === document.scrollingElement;

  const remainingToBottom = (el) => {
    if (!el) return Infinity;
    if (isPageScroll(el)) {
      const doc = document.documentElement;
      return doc.scrollHeight - window.innerHeight - window.scrollY;
    }
    return el.scrollHeight - el.clientHeight - el.scrollTop;
  };

  function scrollToBottom(el, behavior = 'auto') {
    if (!el) return;
    if (isPageScroll(el)) {
      const doc = document.documentElement;
      const top = doc.scrollHeight;
      window.scrollTo({ top, behavior });
      requestAnimationFrame(() => window.scrollTo(0, top));
      setTimeout(() => window.scrollTo(0, top), 120);
      return;
    }
    const top = el.scrollHeight - el.clientHeight + 2;
    el.scrollTo({ top, behavior });
    requestAnimationFrame(() => (el.scrollTop = el.scrollHeight));
    setTimeout(() => (el.scrollTop = el.scrollHeight), 120);
  }

  function stickToBottomWhileGrowing(scroller, durationMs = 900) {
    const start = performance.now();
    let lastH = -1;
    const tick = () => {
      if (performance.now() - start > durationMs) return;
      const h = scroller.scrollHeight;
      if (h !== lastH) {
        lastH = h;
        scrollToBottom(scroller, 'auto');
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function isScrollableEl(el) {
    if (!el) return false;
    const cs = getComputedStyle(el);
    const canScrollY = /(auto|scroll)/.test(cs.overflowY);
    return canScrollY && el.scrollHeight - el.clientHeight > 30;
  }

  function findScrollableParent(startEl, stopAt) {
    let cur = startEl;
    while (cur && cur !== stopAt && cur !== document.body) {
      if (isScrollableEl(cur)) return cur;
      cur = cur.parentElement;
    }
    if (stopAt && isScrollableEl(stopAt)) return stopAt;
    return document.scrollingElement || document.documentElement;
  }

  function getVisibleMessageList() {
    const lists = $$('ul.list-group');
    return lists.find((ul) => ul.offsetParent !== null) || null;
  }

  function isChatActive() {
    const input = $(SELECTORS.chatInput);
    if (!input) return false;
    if (!AUTO_SCROLL_ONLY_WHEN_CHAT_INPUT_VISIBLE) return true;
    return isVisible(input);
  }

  function injectStylesOnce() {
    if (document.getElementById('ulcx-style')) return;
    const st = document.createElement('style');
    st.id = 'ulcx-style';
    st.textContent = `
      .ulcx-btn{cursor:pointer;padding:3px 8px;font-size:14px;border-radius:4px;transition:.15s;user-select:none}
      .ulcx-btn.d{border:1px solid #555;background:#2a2a2a;color:#fff}
      .ulcx-btn.l{border:1px solid #aaa;background:#f2f2f2;color:#111}
      .ulcx-btn.d:hover{background:#3c3c3c}
      .ulcx-btn.l:hover{background:#e1e1e1}

      #ulcx-scroll-down,
      #ulcx-scroll-down:focus,
      #ulcx-scroll-down:active,
      #ulcx-scroll-down:focus-visible{outline:none!important;border:none!important}
      #ulcx-scroll-down{
        position:absolute;width:36px;height:36px;display:none;align-items:center;justify-content:center;
        cursor:pointer;border-radius:50%;background:rgba(0,0,0,.75);color:#fff;z-index:2147483647;
        box-shadow:0 4px 10px rgba(0,0,0,.35);user-select:none;transition:opacity .2s,transform .2s;
        -webkit-tap-highlight-color:transparent
      }
      #ulcx-scroll-down svg{display:block}
      .ulcx-emoji{cursor:pointer;font-size:20px;user-select:none;margin:4px;transition:.12s}
      .ulcx-emoji:hover{transform:scale(1.25)}
    `;
    document.head.appendChild(st);
  }

  function computeDarkMode() {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (mq?.matches) return true;
    const bg = getComputedStyle(document.body).backgroundColor;
    const rgb = bg?.match(/\d+/g)?.map(Number);
    if (!rgb) return true;
    return (rgb[0] + rgb[1] + rgb[2]) / 3 < 140;
  }

  function ensureTheme() {
    if (state.dark === null) state.dark = computeDarkMode();
    return state.dark;
  }

  function makeButton(label, title) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    if (title) btn.title = title;
    btn.className = `ulcx-btn ${ensureTheme() ? 'd' : 'l'}`;
    return btn;
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
    const fallback = '#ecc846';
    if (!rgb) return fallback;

    const hexMatch = rgb.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) return rgb.toLowerCase();

    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return fallback;

    const [r, g, b] = m.map(Number);
    const toHex = (v) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function readUserColor(el) {
    const fallback = '#ecc846';
    if (!el) return fallback;

    const inline = el.getAttribute('style');
    if (inline?.includes('color')) {
      const val = inline
        .split(';')
        .find((x) => x.includes('color'))
        ?.split(':')[1]
        ?.trim();
      if (val) return rgbToHex(val);
    }
    return rgbToHex(getComputedStyle(el).color);
  }

  function normalizeName(s) {
    return (s || '')
      .toString()
      .trim()
      .replace(/^@+/, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  function getCurrentUsername() {
    if (state.myName) return state.myName;

    const a = $('a.top-nav__username--highresolution[href*="/users/"]');
    if (a) {
      const href = a.getAttribute('href') || '';
      const m = href.match(/\/users\/([^\/?#]+)/i);
      if (m?.[1]) return (state.myName = decodeURIComponent(m[1]).trim());

      const s = $('span.text-bold', a);
      const txt = (s?.textContent || '').replace(/\s+/g, ' ').trim();
      if (txt) return (state.myName = txt);
    }

    const s2 = $('a.top-nav__username--highresolution span.text-bold');
    const txt2 = (s2?.textContent || '').replace(/\s+/g, ' ').trim();
    if (txt2) return (state.myName = txt2);

    return null;
  }

  function isMe(name) {
    const me = normalizeName(getCurrentUsername());
    const u = normalizeName(name);
    return !!me && !!u && me === u;
  }

  function quoteFromMessage(wrapper) {
    const box = $(SELECTORS.chatInput);
    if (!box) return;

    const uEl = $(SELECTORS.usernameLink, wrapper);
    const username = uEl?.innerText?.trim();
    const msg = wrapper.nextElementSibling?.querySelector(SELECTORS.msgText)?.innerText?.trim();
    if (!username || !msg) return;
    if (isMe(username)) return;

    const color = readUserColor(uEl);
    const depth = (msg.match(/^>+/)?.[0] || '').length;
    const newDepth = Math.min(depth + 1, 3);
    const cleaned = msg.replace(/^>+\s*/, '');
    const finalMsg = `${'>'.repeat(newDepth)} ${cleaned}`;

    insertAtCursor(
      box,
      `[color=${color}]${username}[/color] : "[i][color=#2596be]${finalMsg}[/color][/i]"\n\n`
    );
  }

  function watchBadge(badge, wrapper) {
    if (!badge || state.badgeObservers.has(badge)) return;
    let t = null;
    const obs = new MutationObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        const hasMention = !!badge.querySelector('.ulcx-mention');
        const hasReply = !!badge.querySelector('.ulcx-reply') || !!wrapper?.querySelector('.ulcx-reply');
        if (!hasMention || !hasReply) addIcons(wrapper);
      }, 30);
    });
    obs.observe(badge, { childList: true, subtree: true });
    state.badgeObservers.set(badge, obs);
  }

  function cleanupMyIcons() {
    const meNow = getCurrentUsername();
    if (!meNow) return;

    for (const wrapper of $$(SELECTORS.msgHeader)) {
      const uEl = $(SELECTORS.usernameLink, wrapper);
      const author = uEl?.innerText?.trim();
      if (!author) continue;

      if (isMe(author)) {
        const badge = uEl.closest('.badge-user');
        badge?.querySelectorAll('.ulcx-reply, .ulcx-mention').forEach((n) => n.remove());
        wrapper.querySelectorAll('.ulcx-reply, .ulcx-mention').forEach((n) => n.remove());
        wrapper.__ulcx_done = true;
      }
    }
  }

  function addIcons(wrapper) {
    if (!wrapper) return;

    const uEl = $(SELECTORS.usernameLink, wrapper);
    if (!uEl) return;

    const badge = uEl.closest('.badge-user');
    if (!badge) return;

    watchBadge(badge, wrapper);

    const author = uEl.innerText?.trim();
    if (getCurrentUsername() && isMe(author)) {
      badge.querySelectorAll('.ulcx-reply, .ulcx-mention').forEach((n) => n.remove());
      wrapper.querySelectorAll('.ulcx-reply, .ulcx-mention').forEach((n) => n.remove());
      wrapper.__ulcx_done = true;
      return;
    }

    const msgEl = wrapper.nextElementSibling?.querySelector(SELECTORS.msgText);
    if (!msgEl) return;

    badge.querySelectorAll('.ulcx-mention, .ulcx-reply').forEach((n) => n.remove());
    wrapper.querySelectorAll('.ulcx-mention, .ulcx-reply').forEach((n) => n.remove());

    const reply = document.createElement('i');
    reply.className = 'ulcx-reply fas fa-reply';
    reply.title = 'Répondre';
    reply.style.cssText = 'cursor:pointer;color:#d82c20;vertical-align:middle;';
    reply.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      quoteFromMessage(wrapper);
    });

    const mention = document.createElement('i');
    mention.className = 'ulcx-mention fas fa-at';
    mention.title = 'Mentionner';
    mention.style.cssText = 'cursor:pointer;vertical-align:middle;';
    mention.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = uEl.innerText?.trim();
      if (isMe(target)) return;

      const box = $(SELECTORS.chatInput);
      if (!box) return;

      const color = readUserColor(uEl);
      insertAtCursor(box, `[color=${color}]@${target}[/color] `);
    });

    badge.style.display = 'inline-flex';
    badge.style.alignItems = 'center';
    badge.style.gap = '6px';

    badge.prepend(mention);
    uEl.after(reply);

    wrapper.__ulcx_done = true;
  }

  function bindMessageObserver() {
    const list = getVisibleMessageList();
    const container = list || document.body;

    if (state.listObserverTarget === container && state.msgObserver) return;

    if (state.msgObserver) {
      try { state.msgObserver.disconnect(); } catch {}
      state.msgObserver = null;
    }

    state.listObserverTarget = container;

    debounceRaf('icons-scan', () => {
      $$(SELECTORS.msgHeader).forEach(addIcons);
      cleanupMyIcons();
    });

    const obs = new MutationObserver((mutations) => {
      let needsScan = false;
      for (const m of mutations) {
        for (const n of m.addedNodes || []) {
          if (!(n instanceof Element)) continue;
          if (n.matches?.(SELECTORS.msgHeader)) { addIcons(n); continue; }
          const headers = n.querySelectorAll?.(SELECTORS.msgHeader);
          if (headers?.length) headers.forEach(addIcons);
          needsScan = true;
        }
      }
      if (needsScan) debounceRaf('icons-scan', cleanupMyIcons);
    });

    obs.observe(container, { childList: true, subtree: true });
    state.msgObserver = obs;

    if (!state.cleanupTimer) state.cleanupTimer = setInterval(cleanupMyIcons, 2500);
  }

  function setupScrollDownButton(scroller) {
    if (!scroller || state.scrollBtnReady) return;
    state.scrollBtnReady = true;

    injectStylesOnce();

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

    btn.addEventListener('mousedown', (e) => e.preventDefault());
    ['click', 'mouseup', 'focus'].forEach((ev) => btn.addEventListener(ev, () => btn.blur()));
    document.body.appendChild(btn);

    const size = 36;
    const margin = 12;

    const getScrollerRect = () => {
      if (isPageScroll(scroller)) return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
      return scroller.getBoundingClientRect();
    };

    const positionButton = () => {
      const r = getScrollerRect();
      let left = r.right - margin - size;
      let top = r.bottom - margin - size;
      left = Math.max(8, Math.min(left, window.innerWidth - size - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - size - 8));
      btn.style.left = `${left}px`;
      btn.style.top = `${top}px`;
    };

    const show = () => {
      positionButton();
      btn.style.display = 'flex';
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1)';
    };

    const hide = () => {
      btn.style.opacity = '0';
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => (btn.style.display = 'none'), 150);
    };

    const updateVisibility = () => {
      if (!isChatActive()) return hide();
      if (remainingToBottom(scroller) <= BOTTOM_EPS) hide();
      else show();
    };

    btn.addEventListener('click', () => {
      scrollToBottom(scroller, 'smooth');
      hide();
    });

    const onScroll = () => debounceRaf('scrollbtn-vis', updateVisibility);
    if (isPageScroll(scroller)) window.addEventListener('scroll', onScroll, { passive: true });
    else scroller.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('resize', () => debounceRaf('scrollbtn-pos', () => {
      positionButton();
      updateVisibility();
    }), { passive: true });

    const mo = new MutationObserver(() => debounceRaf('scrollbtn-vis', updateVisibility));
    mo.observe(isPageScroll(scroller) ? document.body : scroller, { childList: true, subtree: true });

    setTimeout(() => {
      positionButton();
      updateVisibility();
    }, 800);
  }

  function attachResizeFollow(scroller, getFollow) {
    if (!scroller || scroller.__ulcx_resizeFollow) return;
    scroller.__ulcx_resizeFollow = true;

    const ro = new ResizeObserver(() => {
      if (!getFollow()) return;
      scrollToBottom(scroller, 'auto');
      stickToBottomWhileGrowing(scroller, 600);
    });

    ro.observe(scroller);
    scroller.__ulcx_resizeObs = ro;
  }

  function bindAutoscroll() {
    if (state.autoscrollReady && state.listForAutoscroll && state.scroller) return;
    if (!isChatActive()) return;

    const list = getVisibleMessageList();
    if (!list) return;

    const anchor = list.querySelector(SELECTORS.msgHeader) || list.querySelector(SELECTORS.msgText);
    if (!anchor) return;

    const scroller = findScrollableParent(anchor, list);
    if (!scroller) return;

    state.autoscrollReady = true;
    state.listForAutoscroll = list;
    state.scroller = scroller;

    let follow = remainingToBottom(scroller) <= BOTTOM_EPS;
    const recomputeFollow = () => (follow = remainingToBottom(scroller) <= BOTTOM_EPS);

    attachResizeFollow(scroller, () => follow);

    const onScroll = () => debounceRaf('follow-recalc', recomputeFollow);
    if (isPageScroll(scroller)) window.addEventListener('scroll', onScroll, { passive: true });
    else scroller.addEventListener('scroll', onScroll, { passive: true });

    const obs = new MutationObserver((mutations) => {
      if (!isChatActive()) return;

      let addedSomething = false;

      for (const m of mutations) {
        if (m.addedNodes?.length) addedSomething = true;

        for (const n of m.addedNodes || []) {
          if (!(n instanceof Element)) continue;
          const imgs = n.matches?.('img') ? [n] : Array.from(n.querySelectorAll?.('img') || []);
          imgs.forEach((img) => {
            img.addEventListener('load', () => {
              recomputeFollow();
              if (!follow) return;
              scrollToBottom(scroller, 'auto');
              stickToBottomWhileGrowing(scroller, 600);
            }, { once: true });
          });
        }
      }

      if (!addedSomething) return;

      recomputeFollow();
      if (!follow) return;

      debounceRaf('autoscroll', () => {
        recomputeFollow();
        if (!follow) return;
        scrollToBottom(scroller, 'auto');
        stickToBottomWhileGrowing(scroller, 900);
      });
    });

    obs.observe(list, { childList: true, subtree: true });

    setTimeout(() => isChatActive() && scrollToBottom(scroller, 'auto'), 800);
    setupScrollDownButton(scroller);
  }

  function rescanEverything(shouldFollow) {
    debounceMs('rescan-all', 60, () => {
      $$(SELECTORS.msgHeader).forEach((w) => {
        const uEl = $(SELECTORS.usernameLink, w);
        const badge = uEl?.closest('.badge-user');
        if (badge) watchBadge(badge, w);
        addIcons(w);
      });
      cleanupMyIcons();

      bindMessageObserver();

      state.autoscrollReady = false;
      state.listForAutoscroll = null;
      state.scroller = null;
      state.scrollBtnReady = false;

      bindAutoscroll();
      if (shouldFollow && state.scroller && isChatActive()) {
        scrollToBottom(state.scroller, 'smooth');
      }
    });
  }

  function setupTabHooks() {
    if (state.tabHooksReady) return;
    state.tabHooksReady = true;

    document.addEventListener('click', (e) => {
      const hit = e.target.closest(`${SELECTORS.tabLink}, ${SELECTORS.tab}`);
      if (!hit) return;

      const sc = state.scroller;
      const shouldFollow = !sc || remainingToBottom(sc) <= BOTTOM_EPS;
      rescanEverything(shouldFollow);
    }, true);

    const tabObs = new MutationObserver((muts) => {
      const changed = muts.some((m) => m.type === 'attributes' && m.attributeName === 'class');
      if (!changed) return;

      const sc = state.scroller;
      const shouldFollow = !sc || remainingToBottom(sc) <= BOTTOM_EPS;
      rescanEverything(shouldFollow);
    });

    setTimeout(() => {
      $$(SELECTORS.tab).forEach((t) => tabObs.observe(t, { attributes: true }));
    }, 500);
  }

  function openDB() {
    if (state.dbPromise) return state.dbPromise;

    state.dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB.name, 1);
      req.onerror = () => reject(req.error);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DB.store)) {
          db.createObjectStore(DB.store, { keyPath: 'url' });
        }
      };

      req.onsuccess = () => resolve(req.result);
    });

    return state.dbPromise;
  }

  async function withStore(mode, fn) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([DB.store], mode);
      const store = tx.objectStore(DB.store);

      let result;
      try { result = fn(store); }
      catch (e) { reject(e); return; }

      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function dbGetAll() {
    const arr = await withStore('readonly', (store) => new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    }));

    const hasAnyOrder = arr.some((x) => typeof x.order === 'number');
    if (hasAnyOrder) arr.sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999));
    return arr;
  }

  const dbAdd = (url, order) => withStore('readwrite', (store) => store.put(
    typeof order === 'number' ? { url, order } : { url }
  ));

  const dbDel = (url) => withStore('readwrite', (store) => store.delete(url));
  const dbClearAll = () => withStore('readwrite', (store) => store.clear());

  const dbBulkUpsert = (items) => withStore('readwrite', (store) => {
    items.forEach((it) => {
      if (!it?.url) return;
      store.put(typeof it.order === 'number' ? { url: it.url, order: it.order } : { url: it.url });
    });
    return true;
  });

  async function saveCustomOrderFromDOM(grid) {
    const imgs = Array.from(grid.querySelectorAll('img[data-ulcx-custom="1"]:not([data-ulcx-static="1"])'));
    await withStore('readwrite', (store) => {
      imgs.forEach((img, idx) => {
        const url = img.dataset.url;
        if (!url) return;
        store.put({ url, order: idx });
      });
      return true;
    });
  }

  function validateImageSize(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        resolve({ ok: this.width <= LIMITS.maxW && this.height <= LIMITS.maxH, w: this.width, h: this.height });
      };
      img.onerror = () => resolve({ ok: false, w: 0, h: 0, err: "Impossible de charger l'image" });
      img.src = url;
    });
  }

  function downloadText(filename, text, mime = 'application/json') {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function parseImportContent(text) {
    const t = (text || '').trim();
    if (!t) return [];

    if (t.startsWith('{') || t.startsWith('[')) {
      const obj = JSON.parse(t);
      const arr = Array.isArray(obj) ? obj : obj.items || [];
      return arr
        .map((x, idx) => {
          if (typeof x === 'string') return { url: x.trim(), order: idx };
          if (x && typeof x.url === 'string') return { url: x.url.trim(), order: typeof x.order === 'number' ? x.order : idx };
          return null;
        })
        .filter(Boolean)
        .filter((x) => x.url);
    }

    return t
      .split(/[\n\r\s,]+/g)
      .map((u) => u.trim())
      .filter(Boolean)
      .map((url, idx) => ({ url, order: idx }));
  }

  function cssEscapeSafe(str) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(str);
    return String(str).replace(/["\\]/g, '\\$&');
  }

  function renderBaseEmojis(drawer) {
    const frag = document.createDocumentFragment();
    for (const e of BASE_EMOJIS) {
      const span = document.createElement('span');
      span.className = 'ulcx-emoji';
      span.textContent = e;
      span.dataset.emoji = e;
      frag.appendChild(span);
    }
    drawer.appendChild(frag);
  }

  function mkDrawerBase(dark) {
    const d = document.createElement('div');
    d.style.display = 'none';
    d.style.width = '100%';
    d.style.marginTop = '4px';
    d.style.borderRadius = '6px';
    d.style.border = `1px solid ${dark ? '#444' : '#aaa'}`;
    d.style.background = dark ? '#1e1e1e' : '#fff';
    d.style.boxSizing = 'border-box';
    d.style.maxHeight = '260px';
    d.style.padding = '6px 8px';
    d.style.display = 'none';
    d.style.flexWrap = 'wrap';
    d.style.gap = '8px';
    d.style.overflowY = 'auto';
    return d;
  }

  function mkDrawerRetro(dark) {
    const d = document.createElement('div');
    d.style.display = 'none';
    d.style.width = '100%';
    d.style.marginTop = '4px';
    d.style.borderRadius = '6px';
    d.style.border = `1px solid ${dark ? '#444' : '#aaa'}`;
    d.style.background = dark ? '#1e1e1e' : '#fff';
    d.style.boxSizing = 'border-box';
    d.style.maxHeight = '260px';
    d.style.overflow = 'hidden';
    d.style.display = 'none';
    d.style.flexDirection = 'column';
    return d;
  }

  function renderRetroStatic(url) {
    if (state.retroCustomSet.has(url)) return;
    state.retroCustomSet.add(url);

    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = `${LIMITS.maxW}px`;
    img.style.maxHeight = `${LIMITS.maxH}px`;
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.margin = '4px';
    img.style.cursor = 'pointer';
    img.style.objectFit = 'contain';
    img.title = 'Emoji (script)';
    img.dataset.url = url;
    img.dataset.ulcxStatic = '1';
    img.draggable = false;

    state.retroGrid.insertBefore(img, state.retroPlus);
    keepPlusAtEnd();
  }

  function renderRetroCustom(url) {
    if (state.retroCustomSet.has(url)) return;
    state.retroCustomSet.add(url);

    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = `${LIMITS.maxW}px`;
    img.style.maxHeight = `${LIMITS.maxH}px`;
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.margin = '4px';
    img.style.cursor = 'pointer';
    img.style.objectFit = 'contain';
    img.title = 'Clic pour insérer | Clic droit pour supprimer | Glisser-déposer pour réordonner';
    img.dataset.url = url;
    img.dataset.ulcxCustom = '1';
    img.draggable = true;

    state.retroGrid.insertBefore(img, state.retroPlus);
    keepPlusAtEnd();
  }

  function keepPlusAtEnd() {
    if (state.retroPlus && state.retroPlus.parentNode === state.retroGrid) {
      state.retroGrid.appendChild(state.retroPlus);
    }
  }

  function clearRetroUI() {
    state.retroGrid.querySelectorAll('img[data-ulcx-custom="1"], img[data-ulcx-static="1"]').forEach((n) => n.remove());
    state.retroCustomSet.clear();
    keepPlusAtEnd();
  }

  async function reloadRetroFromDB() {
    clearRetroUI();

    for (const url of retroEmojis) {
      if (typeof url === 'string' && url.trim()) renderRetroStatic(url.trim());
    }

    const all = await dbGetAll();
    for (const item of all) renderRetroCustom(item.url);

    try { await saveCustomOrderFromDOM(state.retroGrid); } catch {}
    keepPlusAtEnd();
  }

  async function addCustomToRetro(url) {
    url = (url || '').trim();
    if (!url) return false;
    if (state.retroCustomSet.has(url)) return false;

    const check = await validateImageSize(url);
    if (!check.ok) {
      const msg = check.err || `Image trop grande (${check.w}x${check.h}). Max: ${LIMITS.maxW}x${LIMITS.maxH}px`;
      alert('❌ ' + msg);
      return false;
    }

    try {
      await dbAdd(url);
      renderRetroCustom(url);
      await saveCustomOrderFromDOM(state.retroGrid);
      return true;
    } catch (e) {
      console.error('DB add error', e);
      alert('❌ Erreur sauvegarde IndexedDB');
      return false;
    }
  }

  async function exportRetroList() {
    try {
      const all = await dbGetAll();
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        items: all.map((x, idx) => ({ url: x.url, order: typeof x.order === 'number' ? x.order : idx })),
      };
      downloadText('tos_retro_emojis.json', JSON.stringify(payload, null, 2));
    } catch (e) {
      console.error(e);
      alert('❌ Export impossible (voir console).');
    }
  }

  async function importRetroListFromText(text) {
    let items;
    try {
      items = parseImportContent(text);
    } catch {
      alert('❌ Fichier invalide (JSON/TXT).');
      return;
    }

    const seen = new Set();
    items = items.filter((it) => {
      const u = (it.url || '').trim();
      if (!u || seen.has(u)) return false;
      seen.add(u);
      return true;
    });

    if (!items.length) {
      alert('⚠️ Rien à importer.');
      return;
    }

    const replace = confirm(
      `Importer ${items.length} URL(s).\n\nOK = remplacer complètement ta liste actuelle\nAnnuler = ajouter à la liste existante`
    );

    try {
      if (replace) await dbClearAll();

      let baseOrder = 0;
      if (!replace) baseOrder = (await dbGetAll()).length;

      const valid = [];
      const skipped = [];

      for (let i = 0; i < items.length; i++) {
        const url = items[i].url;
        const check = await validateImageSize(url);
        if (!check.ok) { skipped.push(url); continue; }
        valid.push({ url, order: baseOrder + i });
      }

      await dbBulkUpsert(valid);
      await reloadRetroFromDB();

      alert(
        `✅ Import terminé.\n` +
        `Ajoutés: ${valid.length}\n` +
        (skipped.length ? `Ignorés (invalides/trop grands): ${skipped.length}` : '')
      );
    } catch (e) {
      console.error(e);
      alert('❌ Import impossible (voir console).');
    }
  }

  function addBBPanelOnce() {
    const box = $(SELECTORS.chatInput);
    if (!box || state.panelReady) return;
    state.panelReady = true;

    injectStylesOnce();
    const dark = ensureTheme();

    const wrap = document.createElement('div');
    wrap.style.marginTop = '8px';

    const panel = document.createElement('div');
    panel.style.display = 'flex';
    panel.style.gap = '8px';
    panel.style.alignItems = 'center';
    panel.style.padding = '6px 0';
    panel.style.flexWrap = 'wrap';

    const bBtn = makeButton('𝗕');
    const iBtn = makeButton('𝘐');
    const uBtn = makeButton('U̲');
    bBtn.addEventListener('click', () => insertAtCursor(box, '[b][/b]'));
    iBtn.addEventListener('click', () => insertAtCursor(box, '[i][/i]'));
    uBtn.addEventListener('click', () => insertAtCursor(box, '[u][/u]'));
    panel.append(bBtn, iBtn, uBtn);

    const atBtn = makeButton('@', 'Mentionner un utilisateur');
    atBtn.addEventListener('click', () => {
      const username = prompt("Nom de l'utilisateur à mentionner :");
      if (!username) return;
      if (isMe(username)) return;

      const foundEl = $$(SELECTORS.usernameLink).find((u) => u.innerText === username);
      const bb = foundEl ? `@[color=${readUserColor(foundEl)}]${username}[/color] ` : `@${username} `;
      insertAtCursor(box, bb);
    });
    panel.append(atBtn);

    const popup = document.createElement('div');
    popup.style.display = 'none';
    popup.style.marginTop = '4px';
    popup.style.padding = '6px 8px';
    popup.style.borderRadius = '6px';
    popup.style.border = `1px solid ${dark ? '#555' : '#aaa'}`;
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
    popupInput.style.border = `1px solid ${dark ? '#555' : '#aaa'}`;
    popupInput.style.background = dark ? '#111' : '#fff';
    popupInput.style.color = dark ? '#eee' : '#111';

    const okBtn = makeButton('OK');
    const xBtn = makeButton('X');
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
      else if (e.key === 'Escape') { e.preventDefault(); closePopup(); }
    });

    const imgBtn = makeButton('🖼', 'Insérer image');
    const linkBtn = makeButton('🔗', 'Insérer lien');
    imgBtn.addEventListener('click', () => openPopup('img'));
    linkBtn.addEventListener('click', () => openPopup('url'));
    panel.append(imgBtn, linkBtn);

    const toggleBase = makeButton('🙂', 'Emojis de base'); toggleBase.style.fontSize = '16px';
    const toggleRetro = makeButton('🕹️', 'Emojis rétro + persos'); toggleRetro.style.fontSize = '16px';
    panel.append(toggleBase, toggleRetro);

    const drawerBase = mkDrawerBase(dark);
    const drawerRetro = mkDrawerRetro(dark);
    state.drawerBase = drawerBase;
    state.drawerRetro = drawerRetro;

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

    drawerBase.style.display = 'none';
    drawerBase.style.flexDirection = 'row';
    renderBaseEmojis(drawerBase);

    drawerBase.addEventListener('click', (e) => {
      const hit = e.target.closest('[data-emoji]');
      if (!hit) return;
      insertAtCursor(box, hit.dataset.emoji || '');
    });

    const retroActions = document.createElement('div');
    retroActions.style.display = 'flex';
    retroActions.style.gap = '8px';
    retroActions.style.alignItems = 'center';
    retroActions.style.padding = '6px 6px';
    retroActions.style.borderBottom = `1px solid ${dark ? '#333' : '#ddd'}`;
    retroActions.style.background = dark ? '#1e1e1e' : '#fff';
    retroActions.style.position = 'sticky';
    retroActions.style.top = '0';
    retroActions.style.zIndex = '10';
    retroActions.style.boxShadow = dark ? '0 6px 12px rgba(0,0,0,.35)' : '0 6px 12px rgba(0,0,0,.12)';

    const retroGrid = document.createElement('div');
    retroGrid.style.display = 'flex';
    retroGrid.style.flexWrap = 'wrap';
    retroGrid.style.gap = '8px';
    retroGrid.style.padding = '6px 8px';
    retroGrid.style.boxSizing = 'border-box';
    retroGrid.style.overflowY = 'auto';
    retroGrid.style.overflowX = 'hidden';
    retroGrid.style.maxHeight = '220px';

    state.retroGrid = retroGrid;
    state.retroCustomSet = new Set();

    const plus = document.createElement('span');
    plus.textContent = '+';
    plus.title = 'Ajouter des emojis/GIFs (URLs)';
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
    plus.addEventListener('mouseout', () => (plus.style.background = dark ? '#2a2a2a' : '#f9f9f9'));

    state.retroPlus = plus;

    const exportBtn = makeButton('💾 Export', 'Exporter la liste rétro (JSON)');
    exportBtn.addEventListener('click', exportRetroList);

    const importBtn = makeButton('📥 Import', 'Importer une liste (JSON/TXT)');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.txt,application/json,text/plain';
    fileInput.style.display = 'none';

    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files && fileInput.files[0];
      fileInput.value = '';
      if (!f) return;
      const text = await f.text();
      await importRetroListFromText(text);
    });

    retroActions.append(exportBtn, importBtn, fileInput);

    plus.addEventListener('click', async () => {
      const input = prompt(
        'Colle une ou plusieurs URLs (1 par ligne).\n' +
        'Séparateurs acceptés : retour ligne, espace, virgule.'
      );
      if (!input) return;

      const urls = input
        .split(/[\n\r\s,]+/g)
        .map((s) => s.trim())
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
          `- ${skipped.slice(0, 10).join('\n- ')}${skipped.length > 10 ? '\n- ...' : ''}`
        );
      } else {
        alert(`✅ ${added} emoji(s) ajouté(s) !`);
      }
    });

    retroGrid.appendChild(plus);
    drawerRetro.append(retroActions, retroGrid);

    retroGrid.addEventListener('click', (e) => {
      const img = e.target.closest('img[data-url]');
      if (!img) return;
      const url = img.dataset.url;
      if (!url) return;
      insertAtCursor(box, `[img]${url}[/img]`);
    });

    retroGrid.addEventListener('contextmenu', async (e) => {
      const img = e.target.closest('img[data-ulcx-custom="1"][data-url]');
      if (!img) return;
      e.preventDefault();

      const url = img.dataset.url;
      if (!url) return;
      if (!confirm('Supprimer cet emoji/GIF définitivement ?')) return;

      img.remove();
      state.retroCustomSet.delete(url);

      try {
        await dbDel(url);
        await saveCustomOrderFromDOM(retroGrid);
        keepPlusAtEnd();
      } catch (err) {
        console.error('Delete/Order DB error:', err);
      }
    });

    retroGrid.addEventListener('dragstart', (e) => {
      const img = e.target.closest('img[data-ulcx-custom="1"][data-url]');
      if (!img) return;
      state.draggingUrl = img.dataset.url || null;
      img.style.opacity = '0.6';
      try {
        e.dataTransfer.setData('text/plain', state.draggingUrl || '');
        e.dataTransfer.effectAllowed = 'move';
      } catch {}
    });

    retroGrid.addEventListener('dragend', (e) => {
      const img = e.target.closest('img[data-ulcx-custom="1"][data-url]');
      if (!img) return;
      img.style.opacity = '1';
      state.draggingUrl = null;
    });

    retroGrid.addEventListener('dragover', (e) => {
      if (!state.draggingUrl) return;
      e.preventDefault();
      try { e.dataTransfer.dropEffect = 'move'; } catch {}
    });

    retroGrid.addEventListener('drop', async (e) => {
      if (!state.draggingUrl) return;
      e.preventDefault();

      const targetImg = e.target.closest('img[data-ulcx-custom="1"][data-url]');
      if (!targetImg) return;

      const draggedUrl = state.draggingUrl;
      const targetUrl = targetImg.dataset.url;
      if (!draggedUrl || !targetUrl || draggedUrl === targetUrl) return;

      const draggedEl = retroGrid.querySelector(`img[data-url="${cssEscapeSafe(draggedUrl)}"][data-ulcx-custom="1"]`);
      if (!draggedEl) return;

      const aNext = draggedEl.nextSibling;
      const bNext = targetImg.nextSibling;

      retroGrid.insertBefore(draggedEl, bNext);
      retroGrid.insertBefore(targetImg, aNext);

      keepPlusAtEnd();

      try {
        await saveCustomOrderFromDOM(retroGrid);
      } catch (err) {
        console.error('save order error:', err);
      }
    });

    wrap.append(panel, popup, drawerBase, drawerRetro);
    box.parentNode.insertBefore(wrap, box.nextSibling);

    (async () => {
      try { await reloadRetroFromDB(); }
      catch (e) { console.error('❌ Erreur IndexedDB:', e); }
    })();
  }

  function tick() {
    if ($(SELECTORS.chatInput)) addBBPanelOnce();

    bindMessageObserver();

    if (isChatActive()) bindAutoscroll();

    setupTabHooks();
  }

  function boot() {
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      tick();

      if (state.panelReady && state.msgObserver && (state.autoscrollReady || !AUTO_SCROLL_ONLY_WHEN_CHAT_INPUT_VISIBLE)) {
        clearInterval(timer);
      }
      if (tries >= 120) clearInterval(timer);
    }, 500);
  }

  boot();
})();