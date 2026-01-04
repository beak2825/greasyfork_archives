// ==UserScript==
// @name         UI Tweaks 2
// @namespace    aravvn.tools
// @version      2.3.9
// @description  Timestamps + [SUM] next to username, per-user totals, only count tips after join, original per-notice show/hide UI restored (non-tip notices), no double counts, no recount on reload, robust tip detection via chat-message ancestor TS.
// @author       aravvn
// @match        https://chaturbate.com/*
// @grant        none
// @run-at       document-end
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/551442/UI%20Tweaks%202.user.js
// @updateURL https://update.greasyfork.org/scripts/551442/UI%20Tweaks%202.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('load', () => {
    // ---- Session gate: count only tips after join -----------------------
    const SESSION_START_TS = Date.now(); // absolute cutoff for counting
    const WEAK_TTL_MS = 1500;

    // ---- Per-Room Storage ----------------------------------------------
    const ROOM_SLUG = location.pathname.split('/').filter(Boolean)[0] || 'home';
    const STORAGE_ROOM_KEY = `cb_tokens:${ROOM_SLUG}`;
    const STORAGE_HIDE_NOTICES = 'cb_hide_notices';

    const MAX_ENTRIES = 1000;
    const MAX_SEEN_STRONG = 1000;

    const loadRoomState = () => {
      try {
        const raw = localStorage.getItem(STORAGE_ROOM_KEY);
        if (!raw) return { room: ROOM_SLUG, total: 0, entries: [], updatedAt: 0, seenStrong: [], userTotals: {} };
        const p = JSON.parse(raw);
        return {
          room: p.room || ROOM_SLUG,
          total: Number(p.total) || 0,
          entries: Array.isArray(p.entries) ? p.entries : [],
          updatedAt: Number(p.updatedAt) || 0,
          // Back-compat
          seenStrong: Array.isArray(p.seenStrong) ? p.seenStrong : (Array.isArray(p.seen) ? p.seen : []),
          userTotals: p.userTotals && typeof p.userTotals === 'object' ? p.userTotals : {}
        };
      } catch {
        return { room: ROOM_SLUG, total: 0, entries: [], updatedAt: 0, seenStrong: [], userTotals: {} };
      }
    };

    const saveRoomState = (st) => {
      try {
        st.updatedAt = Date.now();
        localStorage.setItem(STORAGE_ROOM_KEY, JSON.stringify(st));
      } catch {}
    };

    const state = loadRoomState();
    let totalTokens = state.total;

    // Dedupe / tracking
    const seenStrongSet = new Set(state.seenStrong); // for events with real ts
    const weakSeenMap = new Map();                   // weak dedupe for no-ts scenarios (sig -> perf time)
    const countedNodes = new WeakSet();              // per-node dedupe

    // ---- Styles ---------------------------------------------------------
    const style = document.createElement('style');
    style.textContent = `
      .msg-text .emoticonImage { vertical-align: bottom !important; }
      .msg-text.split-mode { display: inline; white-space: normal; }
      .msg-text.split-mode img { vertical-align: bottom; }
      .roomNotice.isTip { background: rgba(255,255,51,0.2) !important; }
      .cbLogo { display: none !important; }
      [data-testid="chat-message-username"] { display: inline; white-space: nowrap; vertical-align: bottom; }
      #cb-token-tab {
        padding: 3px 8px; margin: 2px 2px 0; border-radius: 4px 4px 0 0;
        min-width: 16px; font-size: 12px; cursor: pointer; float: left; line-height: 1.2;
        font-family: UbuntuMedium, Helvetica, Arial, sans-serif; background: #444; color: #fff;
      }
      #cbNoticeToggleBtn {
        font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 3px 8px 2px;
        margin-left: 5px; height: 15px; border-radius: 3px; cursor: pointer; line-height: 1.4; top: -4px;
        position: relative; background: #202C39; color: #fff; border: none;
      }
      #social-media-icons { display: none !important; }
    `;
    document.head.appendChild(style);

    // ---- Notices Toggle (original per-notice UI) ------------------------
    let noticesHidden = localStorage.getItem(STORAGE_HIDE_NOTICES) === 'true';

    const applyNoticeVisibility = () => {
      // Re-inject per-notice show/hide UI like the original code
      document.querySelectorAll('div.roomNotice:not(.isTip)').forEach((noticeEl) => {
        // Avoid re-inject
        if (noticeEl.dataset.toggleInjected) {
          // Just ensure display matches current toggle
          noticeEl.style.display = noticesHidden ? 'none' : '';
          const wrapper = noticeEl.previousElementSibling;
          const showBtn = wrapper?.querySelector?.('button[data-cb-role="show"]');
          const hideBtn = wrapper?.querySelector?.('button[data-cb-role="hide"]');
          if (showBtn && hideBtn) {
            showBtn.style.display = noticesHidden ? 'inline-block' : 'none';
            hideBtn.style.display = 'none';
          }
          return;
        }

        const previewLine = (noticeEl.innerText || '').split('\n')[0].slice(0, 100);

        const showBtn = document.createElement('button');
        showBtn.setAttribute('data-cb-role', 'show');
        showBtn.textContent = previewLine || 'Show';
        showBtn.style.cssText = `
          font-size: 12px; padding: 2px 6px; margin: 4px 0;
          border-radius: 4px; cursor: pointer; border: 1px solid #555;
          background: rgba(32, 44, 57, 0.6); color: #ccc;
          display: ${noticesHidden ? 'inline-block' : 'none'};
          opacity: 0.2; transition: opacity 0.2s ease;
        `;
        showBtn.onmouseover = () => (showBtn.style.opacity = '1');
        showBtn.onmouseout  = () => (showBtn.style.opacity = '0.2');

        const hideBtn = document.createElement('button');
        hideBtn.setAttribute('data-cb-role', 'hide');
        hideBtn.textContent = 'Hide Again';
        hideBtn.style.cssText = `
          font-size: 11px; margin: 2px 0 4px 0; padding: 1px 6px;
          border-radius: 4px; border: 1px solid #444;
          background: rgba(32, 44, 57, 0.5); color: #aaa;
          display: none; cursor: pointer;
        `;

        showBtn.onclick = () => {
          noticeEl.style.display = '';
          showBtn.style.display = 'none';
          hideBtn.style.display = 'inline-block';
        };
        hideBtn.onclick = () => {
          noticeEl.style.display = 'none';
          showBtn.style.display = 'inline-block';
          hideBtn.style.display = 'none';
        };

        const wrapper = document.createElement('div');
        wrapper.appendChild(showBtn);
        wrapper.appendChild(hideBtn);
        noticeEl.before(wrapper);

        noticeEl.style.display = noticesHidden ? 'none' : '';
        noticeEl.dataset.toggleInjected = 'true';
      });
    };

    const addToggleButton = () => {
      if (document.getElementById('cbNoticeToggleBtn')) return;

      const btn = document.createElement('button');
      btn.id = 'cbNoticeToggleBtn';
      btn.textContent = noticesHidden ? 'Show Notices' : 'Hide Notices';
      btn.onclick = () => {
        noticesHidden = !noticesHidden;
        localStorage.setItem(STORAGE_HIDE_NOTICES, noticesHidden);
        applyNoticeVisibility(); // update per-notice UIs
        btn.textContent = noticesHidden ? 'Show Notices' : 'Hide Notices';
      };

      // Prefer follow button container; fallback to token tab area
      const followButton = document.querySelector('div[data-testid="follow-button"]');
      if (followButton?.parentElement) {
        followButton.parentElement.insertBefore(btn, followButton.nextSibling);
        return;
      }
      const tokenTab = document.getElementById('cb-token-tab');
      if (tokenTab?.parentElement) {
        tokenTab.parentElement.appendChild(btn);
        return;
      }
      const usersTab = document.getElementById('users-tab-default');
      if (usersTab?.parentElement) {
        usersTab.parentElement.appendChild(btn);
      } else {
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '99999';
        document.body.appendChild(btn);
      }
    };

    // ---- Token Tab ------------------------------------------------------
    const addTokenTab = () => {
      const usersTab = document.getElementById('users-tab-default');
      if (!usersTab || document.getElementById('cb-token-tab')) return;
      const tokenTab = document.createElement('div');
      tokenTab.id = 'cb-token-tab';
      tokenTab.className = usersTab.className;
      tokenTab.dataset.testid = 'tokens-tab';
      tokenTab.innerHTML = `<span>Total: <span id="cb-token-tab-count">${totalTokens}</span></span>`;
      tokenTab.title = 'Click to reset room token counter';
      tokenTab.addEventListener('click', () => resetCurrentRoom());
      usersTab.parentElement.appendChild(tokenTab);
    };

    const setTabCounter = () => {
      const el = document.getElementById('cb-token-tab-count');
      if (el) el.textContent = String(totalTokens);
    };

    function resetCurrentRoom() {
      state.total = 0;
      state.entries = [];
      state.seenStrong = [];
      state.userTotals = {};
      seenStrongSet.clear();
      weakSeenMap.clear();
      totalTokens = 0;
      saveRoomState(state);
      setTabCounter();
      const tab = document.getElementById('cb-token-tab');
      if (tab) {
        const oldBg = tab.style.backgroundColor;
        tab.style.backgroundColor = '#2d7';
        setTimeout(() => { tab.style.backgroundColor = oldBg || '#444'; }, 200);
      }
    }

    // ---- Helpers --------------------------------------------------------
    const normalizeSpaces = (s) => s.replace(/\s+/g, ' ').trim();

    const crc32 = (str) => {
      let crc = 0 ^ (-1);
      for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ str.charCodeAt(i)) & 0xFF];
      }
      return (crc ^ (-1)) >>> 0;
    };
    const CRC32_TABLE = (() => {
      const table = new Array(256);
      for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
          c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[n] = c >>> 0;
      }
      return table;
    })();

    // Find the closest chat-message ancestor and take its data-ts
    const getEventTsFromContext = (el) => {
      let cur = el;
      while (cur && cur !== document.body) {
        if (cur.nodeType === 1 && cur.getAttribute && cur.getAttribute('data-testid') === 'chat-message') {
          const ts = cur.getAttribute('data-ts');
          if (ts && !isNaN(ts)) return Number(ts);
          break;
        }
        cur = cur.parentElement;
      }
      return null;
    };

    const buildStrongKey = (ts, user, amount) => `ts:${ts}|amt:${amount}|usr:${user.toLowerCase()}`;

    const buildWeakSig = (el, user, amount) => {
      const textNorm = normalizeSpaces(el.innerText || '');
      const h = crc32(textNorm);
      return `h:${h}|amt:${amount}|usr:${user.toLowerCase()}`;
    };

    const parseTipNotice = (el) => {
      const text = normalizeSpaces(el.innerText || '');
      let m = text.match(/^(\S+)\s+tipped\s+(\d+)\s+tokens?\b/i);
      if (!m) m = text.match(/(\S+)\s+tipped\s+(\d+)\s+tokens?\b/i);
      if (m) return { user: m[1], amount: parseInt(m[2], 10) };

      const nameNode =
        el.querySelector('[data-testid="username"]') ||
        el.querySelector('a[href^="/profile/"], a[href^="/"]');
      const fallbackUser = (nameNode?.textContent || '').trim() || 'unknown';
      const amtMatch = text.match(/\b(\d+)\s+tokens?\b/i);
      const amt = amtMatch ? parseInt(m[1], 10) : NaN;
      return { user: fallbackUser, amount: amt };
    };

    const addTokens = (amount, tipUser) => {
      totalTokens += amount;
      state.total = totalTokens;

      const key = tipUser.toLowerCase();
      const now = Date.now();
      const existing = state.userTotals[key] || { total: 0, name: tipUser, lastTs: 0 };
      existing.total += amount;
      existing.name = tipUser;
      existing.lastTs = now;
      state.userTotals[key] = existing;

      state.entries.push({ ts: now, user: tipUser, amount });
      if (state.entries.length > MAX_ENTRIES) {
        state.entries.splice(0, state.entries.length - MAX_ENTRIES);
      }

      saveRoomState(state);
      setTabCounter();
      refreshUserTotalsInChat(tipUser);
    };

    const pruneWeakSeen = () => {
      const now = performance.now();
      for (const [k, t] of weakSeenMap) {
        if (now - t > WEAK_TTL_MS * 4) weakSeenMap.delete(k);
      }
    };

    // Count only notices in chat that belong to messages with ts >= join
    const detectTokenTips = (el) => {
      if (countedNodes.has(el)) return;

      const eventTs = getEventTsFromContext(el);
      if (eventTs !== null && eventTs < SESSION_START_TS) return; // old message -> ignore

      const { user, amount } = parseTipNotice(el);
      if (!Number.isFinite(amount)) return;

      if (eventTs !== null) {
        const strongKey = buildStrongKey(eventTs, user, amount);
        if (seenStrongSet.has(strongKey)) return;
        seenStrongSet.add(strongKey);
        state.seenStrong.push(strongKey);
        if (state.seenStrong.length > MAX_SEEN_STRONG) {
          const overflow = state.seenStrong.length - MAX_SEEN_STRONG;
          state.seenStrong.splice(0, overflow);
          seenStrongSet.clear();
          for (const k of state.seenStrong) seenStrongSet.add(k);
        }
        addTokens(amount, user);
        countedNodes.add(el);
        return;
      }

      // Rare fallback (no ancestor ts): weak dedupe
      const sig = buildWeakSig(el, user, amount);
      const nowPerf = performance.now();
      const last = weakSeenMap.get(sig) || 0;
      if (nowPerf - last <= WEAK_TTL_MS) return;

      weakSeenMap.set(sig, nowPerf);
      pruneWeakSeen();
      addTokens(amount, user);
      countedNodes.add(el);
    };

    // ---- Render: add [SUM] after old [hh:mm] prefix ---------------------
    const formatTime = (ts) => {
      const d = new Date(ts);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    };

    const getMessageTs = (rootEl) => {
      const ts = getEventTsFromContext(rootEl) ?? (rootEl?.dataset?.ts && !isNaN(rootEl.dataset.ts) ? Number(rootEl.dataset.ts) : null);
      return ts ?? Date.now();
    };

    // Normal chat username
    const findStandardUsernameSpan = (el) => {
      const wrap = el.querySelector?.('[data-testid="chat-message-username"]');
      if (!wrap) return null;
      return wrap.querySelector('[data-testid="username"]') || wrap.querySelector('a[href^="/"]');
    };

    // Tip notice username (when notice is inside chat message)
    const findTipNoticeUsernameSpan = (el) => {
      return el.querySelector?.('div.roomNotice.isTip [data-testid="username"]') || null;
    };

    const getOriginalName = (nameSpan) => {
      if (nameSpan.dataset.originalName) return nameSpan.dataset.originalName;
      const raw = (nameSpan.textContent || '').trim();
      const cleaned = raw.replace(/^\s*\[\d{2}:\d{2}\]\s*(\[\d+\]\s*)?/, '').trim();
      nameSpan.dataset.originalName = cleaned;
      return cleaned;
    };

    const renderWithPrefix = (nameSpan, tsMs, total) => {
      const original = getOriginalName(nameSpan);
      nameSpan.textContent = `[${formatTime(tsMs)}] [${total}] ${original}`;
    };

    const addTimestamps = (chatMsgEl) => {
      let nameSpan = findStandardUsernameSpan(chatMsgEl);
      if (!nameSpan) nameSpan = findTipNoticeUsernameSpan(chatMsgEl);
      if (!nameSpan) return;

      const original = getOriginalName(nameSpan);
      if (!original) return;

      const ts = getMessageTs(chatMsgEl);
      const perUserTotal = state.userTotals[original.toLowerCase()]?.total || 0;
      renderWithPrefix(nameSpan, ts, perUserTotal);
    };

    function refreshUserTotalsInChat(updatedUser) {
      const key = updatedUser.toLowerCase();
      const total = state.userTotals[key]?.total || 0;

      document.querySelectorAll('div[data-testid="chat-message"]').forEach((msg) => {
        let nameSpan = findStandardUsernameSpan(msg) || findTipNoticeUsernameSpan(msg);
        if (!nameSpan) return;
        const original = getOriginalName(nameSpan);
        if (!original || original.toLowerCase() !== key) return;
        const ts = getMessageTs(msg);
        renderWithPrefix(nameSpan, ts, total);
      });
    }

    // ---- Observer -------------------------------------------------------
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;

          // Tips
          if (node.matches?.('div.roomNotice.isTip')) {
            detectTokenTips(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('div.roomNotice.isTip').forEach(detectTokenTips);
          }

          // Non-tip notices: keep original per-notice UI behavior
          if (node.matches?.('div.roomNotice:not(.isTip)')) applyNoticeVisibility();
          if (node.querySelectorAll) {
            node.querySelectorAll('div.roomNotice:not(.isTip)').forEach(() => applyNoticeVisibility());
          }

          // Chat messages
          if (node.matches?.('div[data-testid="chat-message"]')) addTimestamps(node);
          if (node.querySelectorAll) {
            node.querySelectorAll('div[data-testid="chat-message"]').forEach(addTimestamps);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ---- Init order -----------------------------------------------------
    addTokenTab();
    addToggleButton();
    applyNoticeVisibility(); // restore per-notice wrappers immediately

    // IMPORTANT: do NOT scan old tip notices -> prevents recount
    // document.querySelectorAll('div.roomNotice.isTip').forEach(detectTokenTips);

    // Visual stamp of current messages (totals update as tips come in)
    document.querySelectorAll('div[data-testid="chat-message"]').forEach(addTimestamps);

    // Debug helpers
    if (!window.cbTokenState) window.cbTokenState = () => JSON.parse(localStorage.getItem(STORAGE_ROOM_KEY) || '{}');
    if (!window.cbResetTokens) window.cbResetTokens = () => resetCurrentRoom();
  });
})();