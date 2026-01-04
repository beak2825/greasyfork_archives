// ==UserScript==
// @name         Torn Poker Enhancer (v4.41 — chat links, inline filter, native-colored links)
// @namespace    http://tampermonkey.net/
// @version      4.41
// @description  Clickable seat names (native look) w/ per-player attack toggle, leave popups, min-stack filter next to “Poker”, chat-based stack updates, and chat attack links (native look).
// @match        https://www.torn.com/page.php?sid=holdem
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555230/Torn%20Poker%20Enhancer%20%28v441%20%E2%80%94%20chat%20links%2C%20inline%20filter%2C%20native-colored%20links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555230/Torn%20Poker%20Enhancer%20%28v441%20%E2%80%94%20chat%20links%2C%20inline%20filter%2C%20native-colored%20links%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------------- State ----------------
  const attackSettings = {};                 // playerId -> boolean (attack from popup click)
  let filterValue = 0;                       // min stack filter for popups & chat linkify
  let popupPosition = { x: 100, y: 100 };    // draggable popup position
  const shownPopups = new Set();             // prevent duplicate popups per playerId
  const activePlayers = new Map();           // name -> { playerId, name, stack, el }
  const playerBalances = new Map();          // name -> last stack
  let playersRoot = null;                    // container of [id^="player-"]
  let chatRoot = null;                       // container of chat messages
  let playersMO = null;                      // MutationObserver for players root
  let chatMO = null;                         // MutationObserver for chat root

  // ---------------- Utils ----------------
  function parseMoney(text) {
    if (!text) return 0;
    const n = String(text).replace(/[^0-9.]/g, '');
    return n ? parseFloat(n) : 0;
  }
  function $(root, sel) { return (root || document).querySelector(sel); }
  function $all(root, sel) { return Array.from((root || document).querySelectorAll(sel)); }

  function loadPopupPos() {
    try { const s = localStorage.getItem('pokerEnh_popupPos'); if (s) popupPosition = JSON.parse(s); } catch {}
  }
  function savePopupPos() {
    try { localStorage.setItem('pokerEnh_popupPos', JSON.stringify(popupPosition)); } catch {}
  }

  // Resilient selectors (prefix-match to ignore hash churn)
  const sel = {
    playerBox:  '[id^="player-"]',                            // seat box
    name:       '[class^="name___"]',                         // player name <p>
    addlBox:    '[class^="additionalBox___"]',
    potString:  '[class^="potString___"]',                    // per-player stack text
  };

  // Fixed chat container (your DOM example)
  const chatSelector = '[class^="messagesWrap___"]';          // e.g. .messagesWrap___tBx9u

  // ---------------- Player reading ----------------
  function getPlayerIdFromEl(playerEl) {
    const m = (playerEl.id || '').match(/player-(\d+)/);
    return m ? m[1] : null;
  }

  function readPlayerName(playerEl) {
    const nameEl = $(playerEl, sel.name);
    return (nameEl?.textContent || '').trim();
  }

  function readPlayerStack(playerEl) {
    const p = $(playerEl, `${sel.addlBox} ${sel.potString}`);
    if (p) return parseMoney(p.textContent || '');
    // fallback: any $N string in additional box
    const box = $(playerEl, sel.addlBox);
    if (box) {
      const m = (box.textContent || '').match(/\$[\d,]+(\.\d+)?/);
      if (m) return parseMoney(m[0]);
    }
    return 0;
  }

  // Make seat name clickable (profile) with native look; add per-player attack checkbox
  function ensureClickableName(playerEl) {
    const playerId = getPlayerIdFromEl(playerEl);
    if (!playerId) return;
    const nameEl = $(playerEl, sel.name);
    if (!nameEl) return;

    if (nameEl.querySelector('a') || nameEl.querySelector('input[type="checkbox"]')) return;

    const plainName = (nameEl.textContent || '').trim();
    nameEl.textContent = '';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.title = 'Enable/Disable Attack on Leave';
    cb.style.marginRight = '6px';
    cb.checked = attackSettings[playerId] !== false;
    cb.addEventListener('change', () => (attackSettings[playerId] = cb.checked));

    const a = document.createElement('a');
    a.href = `https://www.torn.com/profiles.php?XID=${playerId}`;
    a.target = '_blank';
    a.textContent = plainName;

    // 👇 Native look (keep default text color, no underline)
    a.style.color = 'inherit';
    a.style.textDecoration = 'none';

    nameEl.appendChild(cb);
    nameEl.appendChild(a);
  }

  function indexPlayers() {
    activePlayers.clear();
    $all(document, sel.playerBox).forEach((el) => {
      const id = getPlayerIdFromEl(el);
      const name = readPlayerName(el);
      if (!id || !name) return;
      const stack = readPlayerStack(el);
      activePlayers.set(name, { playerId: id, name, stack, el });
      if (!playerBalances.has(name)) playerBalances.set(name, stack);
      ensureClickableName(el);
    });
  }

  function updateAllStacks() {
    activePlayers.forEach((info, name) => {
      if (!info?.el) return;
      const stack = readPlayerStack(info.el);
      if (Number.isFinite(stack)) {
        info.stack = stack;
        playerBalances.set(name, stack);
      }
    });
  }

  // ---------------- UI: Filter (inline, right of “Poker”) ----------------
  function mountFilter() {
    const titleEl = document.querySelector('div.content-title h4.left');
    if (!titleEl) return;

    if (document.getElementById('pokerEnh_moneyFilterWrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'pokerEnh_moneyFilterWrap';
    Object.assign(wrap.style, {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginLeft: '12px',
      padding: '2px 6px',
      borderRadius: '6px',
      background: 'rgba(0,0,0,0.15)',
      fontSize: '12px',
      lineHeight: '1'
    });

    const label = document.createElement('label');
    label.textContent = 'Min stack ($): ';

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'pokerEnh_moneyFilter';
    input.placeholder = '0';
    Object.assign(input.style, {
      width: '120px',
      padding: '2px 4px',
      fontSize: '12px'
    });
    input.addEventListener('input', () => {
      filterValue = parseMoney(input.value) || 0;
    });

    wrap.appendChild(label);
    wrap.appendChild(input);

    // Insert directly after the <h4>Poker</h4>
    titleEl.insertAdjacentElement('afterend', wrap);
  }

  // ---------------- Popup on leave ----------------
  function showLeavePopup(name, stack, playerId) {
    if (shownPopups.has(playerId)) return;
    if (stack < (filterValue || 0)) return;

    shownPopups.add(playerId);

    const el = document.createElement('div');
    el.textContent = `${name} ($${(stack || 0).toLocaleString()}) left the table`;
    Object.assign(el.style, {
      position: 'fixed',
      left: `${popupPosition.x}px`,
      top: `${popupPosition.y}px`,
      padding: '10px 12px',
      backgroundColor: 'rgba(0,128,0,0.85)',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'move',
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
    });

    // Click → attack (if enabled for this player)
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (attackSettings[playerId] !== false) {
        window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${playerId}`, '_blank');
      }
    });

    // Drag handling
    let dragging = false, offX = 0, offY = 0;
    el.addEventListener('mousedown', (e) => {
      dragging = true;
      offX = e.clientX - el.offsetLeft;
      offY = e.clientY - el.offsetTop;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      popupPosition.x = Math.max(0, e.clientX - offX);
      popupPosition.y = Math.max(0, e.clientY - offY);
      el.style.left = `${popupPosition.x}px`;
      el.style.top = `${popupPosition.y}px`;
    });
    window.addEventListener('mouseup', () => {
      if (dragging) { dragging = false; savePopupPos(); }
    });

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }

  // ---------------- Players observer (joins/leaves) ----------------
  function startPlayersObserver() {
    if (!playersRoot) return;
    if (playersMO) playersMO.disconnect();

    playersMO = new MutationObserver((records) => {
      let seatsChanged = false;

      for (const r of records) {
        // Leaves
        r.removedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (!n.matches?.(sel.playerBox)) return;

          const id = getPlayerIdFromEl(n);
          const nm = readPlayerName(n) || [...activePlayers.values()].find(v => v.playerId === id)?.name;
          const stack = readPlayerStack(n) || (nm ? playerBalances.get(nm) : 0);

          if (id && nm) {
            showLeavePopup(nm, stack || 0, id);
            activePlayers.delete(nm);
            playerBalances.delete(nm);
          }
        });

        // Joins
        r.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (!n.matches?.(sel.playerBox)) return;

          const id = getPlayerIdFromEl(n);
          const name = readPlayerName(n);
          const stack = readPlayerStack(n);
          if (id && name) {
            activePlayers.set(name, { playerId: id, name, stack, el: n });
            playerBalances.set(name, stack);
            ensureClickableName(n);
          }
        });

        if (r.addedNodes.length || r.removedNodes.length) seatsChanged = true;
      }

      if (seatsChanged) {
        setTimeout(updateAllStacks, 60);
      }
    });

    playersMO.observe(playersRoot, { childList: true });
  }

  // ---------------- CHAT: parsing + linkify (scoped, safe) ----------------
  const actionRe = /(\S+)\s+(called|bet|raised|posted).*?\$([\d,]+)/i;

  function parseChatLineAndApply(text) {
    const line = (text || '').replace(/\s+/g, ' ').trim();
    if (!line) return;

    if (/game started/i.test(line)) {
      indexPlayers();
      updateAllStacks();
      return;
    }

    if (/\bleft the table\b/i.test(line)) {
      const m = line.match(/^(\S+)/);
      const name = m ? m[1] : null;
      if (name && activePlayers.has(name)) {
        const info = activePlayers.get(name);
        const last = playerBalances.get(name) ?? info?.stack ?? 0;
        showLeavePopup(name, last, info.playerId);
      }
      return;
    }

    const m = line.match(actionRe);
    if (m) {
      const name = m[1];
      const amt = parseMoney(m[3]);
      if (activePlayers.has(name) && amt > 0) {
        const cur = playerBalances.get(name) ?? activePlayers.get(name).stack ?? 0;
        const next = Math.max(cur - amt, 0);
        playerBalances.set(name, next);
        const info = activePlayers.get(name);
        if (info) info.stack = next;
      }
    }
  }

  // Turn <em>NAME</em> into attack link (native look) if seated & stack ≥ filter
  function linkifyChatUserInline(emEl) {
    if (!emEl || emEl.querySelector('a')) return;
    const name = (emEl.textContent || '').trim();
    const info = activePlayers.get(name);
    if (!info) return;
    const stack = playerBalances.get(name) ?? info.stack ?? 0;
    if (stack < (filterValue || 0)) return;

    const a = document.createElement('a');
    a.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${info.playerId}`;
    a.target = '_blank';
    a.textContent = name;

    // 👇 Native look in chat
    a.style.color = 'inherit';
    a.style.textDecoration = 'none';

    emEl.textContent = '';
    emEl.appendChild(a);
  }

  function processNewChatNode(node) {
    let textSeen = '';
    if (node.nodeType === 3) {
      textSeen = node.nodeValue || '';
    } else if (node.nodeType === 1) {
      textSeen = node.textContent || '';
      const ems = node.tagName === 'EM' ? [node] : Array.from(node.getElementsByTagName('em'));
      for (const em of ems) linkifyChatUserInline(em);
    }
    if (textSeen) parseChatLineAndApply(textSeen);
  }

  function linkifyAllExistingChat() {
    if (!chatRoot) return;
    const ems = chatRoot.querySelectorAll('div[class^="message___"] em');
    ems.forEach(linkifyChatUserInline);
  }

  function findChatRoot() {
    const el = document.querySelector(chatSelector);
    if (el) { chatRoot = el; return true; }
    return false;
  }

  function startChatObserverIfFound() {
    if (!chatRoot) return;
    if (chatMO) chatMO.disconnect();

    chatMO = new MutationObserver((records) => {
      let processed = 0, CAP = 50;
      for (const r of records) {
        if (processed >= CAP) break;
        r.addedNodes.forEach((n) => {
          if (processed >= CAP) return;
          if (n.nodeType === 1) {
            processNewChatNode(n);
            for (const kid of n.children) { processNewChatNode(kid); processed++; }
          } else if (n.nodeType === 3) {
            processNewChatNode(n);
            processed++;
          }
        });
      }
    });

    chatMO.observe(chatRoot, { childList: true, subtree: true });
    linkifyAllExistingChat(); // convert existing messages immediately
    console.log('[PokerEnh] chat observer attached');
  }

  // ---------------- Init / Boot ----------------
  function findPlayersRootAndBoot() {
    const trySet = () => {
      const playerEls = $all(document, sel.playerBox);
      if (!playerEls.length) return false;
      playersRoot = playerEls[0].parentElement || document.body;
      return true;
    };

    if (trySet()) return boot();
    const mo = new MutationObserver(() => {
      if (trySet()) {
        mo.disconnect();
        boot();
      }
    });
    mo.observe(document, { childList: true, subtree: true });
  }

  function boot() {
    loadPopupPos();
    mountFilter();
    indexPlayers();
    updateAllStacks();
    startPlayersObserver();

    // Keep stacks fresh even without chat messages
    setInterval(updateAllStacks, 2000);

    // Chat: attach when available
    if (findChatRoot()) startChatObserverIfFound();
    else {
      let tries = 0;
      const iv = setInterval(() => {
        tries++;
        if (findChatRoot()) { clearInterval(iv); startChatObserverIfFound(); }
        if (tries >= 10) clearInterval(iv);
      }, 800);
    }

    console.log('[PokerEnh] v4.41 ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', findPlayersRootAndBoot);
  } else {
    findPlayersRootAndBoot();
  }
})();
