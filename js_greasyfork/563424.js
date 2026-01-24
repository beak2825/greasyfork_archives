// ==UserScript==
// @name         MilkyWayIdle Fullscreen Chat
// @namespace    tampermonkey.net
// @namespace    greasyfork.org/en/scripts/563424-milkywayidle-fullscreen-chat
// @version      0.0.49
// @description  Fullscreen chat overlay to focus on game chat. Useful for general users, but especially for admins, moderators, and the game owner.
// @author       KelleN
// @icon         https://www.milkywayidle.com/favicon.svg
// @match        https://milkywayidle.com/*
// @match        https://www.milkywayidle.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563424/MilkyWayIdle%20Fullscreen%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/563424/MilkyWayIdle%20Fullscreen%20Chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform) || navigator.userAgent.includes('Macintosh');

  const CFG = {
    overlayId: 'mw-ide-overlay',
    toggleBtnId: 'mw-ide-toggle',
    topbarId: 'mw-ide-topbar',
    layoutId: 'mw-ide-layout',
    sidebarId: 'mw-ide-sidebar',
    chanListId: 'mw-ide-chanlist',
    mainId: 'mw-ide-main',
    bodyId: 'mw-ide-body',
    footerId: 'mw-ide-footer',
    localInputId: 'mw-ide-local-input',
    sendBtnId: 'mw-ide-send',
    chatPanelSel: '[class*="GamePage_chatPanel"]',
    tabPanelSel: 'div[class*="TabPanel_tabPanel"]',
    tabHiddenClassPart: 'TabPanel_hidden',
    msgSel: 'div[class*="ChatMessage_chatMessage"]',
    hotkey: isMac ? { metaKey: true, key: 'i' } : { altKey: true, key: 'i' }
  };

  const settings = {
    fontSize: Number(GM_getValue('mw_chat_font_size', 14)),
    gameLinksOn: GM_getValue('mw_gamelinks_on', true),
    autoScroll: GM_getValue('mw_autoscroll', true)
  };

  GM_addStyle(`
    :root {
      --mw-chat-font-size: ${settings.fontSize}px;
      --mw-bg: #0b0e14;
      --mw-topbg: #0d1117;
      --mw-accent: #d7b7ff;
      --mw-text: #cfd6e6;
      --mw-muted: #8b949e;
      --pill-bg: rgba(255,255,255,0.03);
      --pill-active-bg: rgba(215,183,255,0.12);
      --mw-whisper: #3b82f6;
    }
    #${CFG.toggleBtnId} {
      position: fixed; right: 14px; bottom: 14px; z-index: 99999;
      padding: 8px 12px; border-radius: 10px;
      background: rgba(11,12,16,0.95); color: var(--mw-text); border: 1px solid rgba(255,255,255,0.08);
      font-size: 13px; cursor: pointer; user-select: none;
    }
    #${CFG.overlayId} {
      position: fixed; inset: 0; z-index: 100000;
      display: none; flex-direction: column; background: var(--mw-bg); color: var(--mw-text);
      font-family: Inter, system-ui, sans-serif; min-width:0;
    }
    #${CFG.topbarId} {
      display:flex; align-items:center; padding:10px 16px; border-bottom:1px solid rgba(255,255,255,0.06); background:var(--mw-topbg);
      gap:12px; height:56px; position: relative; z-index: 100001;
    }
    .mw-top-left { font-weight:700; color:var(--mw-text); }
    .mw-font-select {
      appearance: auto; background: #161b22 !important; color: #ffffff !important;
      border: 1px solid rgba(255,255,255,0.2); padding:6px 10px; border-radius:8px; font-size:13px; outline: none; cursor: pointer;
    }
    .mw-pill {
      padding:6px 10px; border-radius:999px; background:var(--pill-bg); border:1px solid rgba(255,255,255,0.04);
      color:var(--mw-text); font-size:12px; cursor:pointer; user-select:none;
    }
    .mw-pill.on { background: var(--pill-active-bg); color:var(--mw-accent); border-left: 3px solid var(--mw-accent); }
    .mw-pill.off { opacity:0.6; }
    .mw-top-controls { display:flex; gap:8px; align-items:center; margin-left:12px; }
    .mw-top-right { margin-left:auto; display:flex; align-items:center; gap:10px; color:var(--mw-muted); font-size:12px; margin-right: 60px; }
    #mw-exit-top {
      position: absolute; top: 10px; right: 10px; z-index: 100001;
      background: rgba(255,255,255,0.03); color: var(--mw-text); border: 1px solid rgba(255,255,255,0.06);
      padding:6px 12px; border-radius:8px; cursor:pointer; font-size:12px;
    }
    #${CFG.layoutId} { flex:1; display:grid; grid-template-columns: 220px 1fr; min-height:0; overflow: hidden; }
    #${CFG.sidebarId} { border-right:1px solid rgba(255,255,255,0.06); background:var(--mw-topbg); display:flex; flex-direction:column; overflow: hidden; padding:12px; }
    #channel-filter { width:100%; padding:8px 10px; border-radius:8px; background:#0b0e14; border:1px solid rgba(255,255,255,0.04); color:var(--mw-text); margin-bottom:10px; outline:none; }
    #${CFG.chanListId} { overflow-y:auto; padding-right:6px; flex: 1; }
    .mw-chan { padding:10px 12px; border-radius:6px; cursor:pointer; margin-bottom:6px; color:var(--mw-muted); font-weight:700; display:flex; justify-content:space-between; align-items:center; position: relative; }
    .mw-chan.active { background: rgba(215, 183, 255, 0.08); color:var(--mw-accent); border-left: 3px solid var(--mw-accent); }
    .mw-notification-dot { width: 8px; height: 8px; background: var(--mw-whisper); border-radius: 50%; box-shadow: 0 0 8px var(--mw-whisper); }
    #${CFG.mainId} { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--mw-bg); }
    #${CFG.bodyId} { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; font-size: var(--mw-chat-font-size); line-height: 1.4; }
    .mw-ide-line { padding: 4px 8px; border-radius: 4px; background: transparent; width: 100%; }
    #${CFG.footerId} { padding: 12px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 10px; background: var(--mw-topbg); align-items: center; }
    #${CFG.localInputId} { flex: 1; background: #0f1216; border: 1px solid #30363d; border-radius: 6px; padding: 10px; color: var(--mw-text); outline: none; resize: none; height: 44px; font-size: 14px; }
    #${CFG.sendBtnId} { background: #238636; color: white; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; }

    .MuiPopover-root, .MuiTooltip-popper, .MuiDialog-root, [class*="ChatMessage_nameActionMenu"] { z-index: 999999 !important; pointer-events: auto !important; }
    .MuiPaper-root { background-color: #161b22 !important; color: #cfd6e6 !important; border: 1px solid rgba(255,255,255,0.1) !important; }
    [data-name] { cursor: pointer !important; }
    [class*="ChatMessage_mention"] { color: var(--mw-accent) !important; font-weight: bold; }
  `);

  const state = { chatPanel: null, tabInfoByChannel: new Map(), activeChannel: null, activePanelObserver: null };

  function setPillState(pillEl, on) { pillEl.classList.toggle('on', on); pillEl.classList.toggle('off', !on); }

  function sanitizeClonedNode(clone) {
    const anchors = clone.querySelectorAll('a');
    anchors.forEach(a => {
      if (a.innerText && a.innerText.trim().startsWith('@')) {
        a.style.pointerEvents = 'none';
        return;
      }
      if (!settings.gameLinksOn) {
        const text = document.createTextNode(a.textContent || a.href || '');
        a.parentNode.replaceChild(text, a);
      } else {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
    return clone;
  }

  function renderMessages(nodes) {
    const bodyEl = document.getElementById(CFG.bodyId);
    if (!bodyEl) return;
    bodyEl.innerHTML = '';
    for (const n of nodes) {
      try {
        const clone = n.cloneNode(true);
        sanitizeClonedNode(clone);
        const wrapper = document.createElement('div');
        wrapper.className = 'mw-ide-line';
        wrapper.appendChild(clone);
        bodyEl.appendChild(wrapper);
      } catch (e) {}
    }
    if (settings.autoScroll) bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function ingestFromPanel(panelEl) {
    if (!panelEl) return;
    const msgs = panelEl.querySelectorAll(CFG.msgSel);
    if (msgs && msgs.length) { renderMessages(Array.from(msgs)); return; }
    const cand = Array.from(panelEl.children).filter(c => c.querySelector && (c.querySelector('[class*="username"]') || c.textContent.trim().length > 0));
    renderMessages(cand);
  }

  function getDisplayName(tabBtn) {
    if (!tabBtn) return 'Channel';
    const raw = (tabBtn.innerText || '').split('\n')[0].trim();
    return raw.replace(/\s*\(?\d+\)?\s*$/, '').trim() || raw || 'Channel';
  }

  function hasNotification(tabBtn) {
    if (!tabBtn) return false;
    const text = tabBtn.innerText || '';
    const match = text.match(/\((\d+)\)/) || text.match(/\n(\d+)$/);
    return !!(match && parseInt(match[1]) > 0);
  }

  async function waitForChatPanel() {
    return new Promise((resolve) => {
      const t = setInterval(() => {
        const p = document.querySelector(CFG.chatPanelSel);
        if (p) { clearInterval(t); resolve(p); }
      }, 300);
    });
  }

  function getTabButtons(chatPanel) { return chatPanel ? Array.from(chatPanel.querySelectorAll('button[role="tab"]')) : []; }

  function getTabPanelForTabButton(chatPanel, tabBtn) {
    if (!chatPanel || !tabBtn) return null;
    const id = tabBtn.getAttribute('aria-controls');
    if (id) {
      const el = document.getElementById(id) || chatPanel.querySelector('#' + CSS.escape(id));
      if (el) return el;
    }
    const tabs = getTabButtons(chatPanel);
    const idx = tabs.indexOf(tabBtn);
    const panels = Array.from(chatPanel.querySelectorAll(CFG.tabPanelSel));
    return panels[idx] || panels.find(p => !(p.className || '').includes(CFG.tabHiddenClassPart)) || panels[0];
  }

  function syncTabBindings(chatPanel) {
    if (!chatPanel) return;
    state.tabInfoByChannel.clear();
    const tabs = getTabButtons(chatPanel);
    tabs.forEach(t => {
      const name = getDisplayName(t);
      if (!state.tabInfoByChannel.has(name)) state.tabInfoByChannel.set(name, { tabBtn: t });
    });
    renderSidebar(document.getElementById('channel-filter')?.value || '');
  }

  function renderSidebar(filterText = '') {
    const chanList = document.getElementById(CFG.chanListId);
    if (!chanList) return;
    chanList.innerHTML = '';
    if (state.tabInfoByChannel.size === 0 && state.chatPanel) syncTabBindings(state.chatPanel);
    for (const [name, info] of state.tabInfoByChannel.entries()) {
      if (filterText && !name.toLowerCase().includes(filterText.toLowerCase())) continue;
      const row = document.createElement('div');
      row.className = 'mw-chan' + (name === state.activeChannel ? ' active' : '');
      const nameDiv = document.createElement('div');
      nameDiv.textContent = name;
      row.appendChild(nameDiv);
      if (hasNotification(info.tabBtn) && name !== state.activeChannel) {
        const dot = document.createElement('div');
        dot.className = 'mw-notification-dot';
        row.appendChild(dot);
      }
      row.addEventListener('click', () => {
        info.tabBtn?.click();
        setTimeout(() => {
          const panelEl = getTabPanelForTabButton(state.chatPanel, info.tabBtn);
          state.activeChannel = name;
          ingestFromPanel(panelEl);
          attachActivePanelObserver(panelEl);
          renderSidebar(document.getElementById('channel-filter')?.value || '');
        }, 80);
      });
      chanList.appendChild(row);
    }
  }

  function attachActivePanelObserver(panelEl) {
    if (state.activePanelObserver) { try { state.activePanelObserver.disconnect(); } catch {} }
    if (!panelEl) return;
    state.activePanelObserver = new MutationObserver((muts) => {
      if (document.getElementById(CFG.overlayId).style.display !== 'flex') return;
      if (muts.some(m => m.addedNodes.length)) ingestFromPanel(panelEl);
    });
    state.activePanelObserver.observe(panelEl, { childList: true, subtree: true });
  }

  async function sendToGame(msg) {
    if (!msg) return;
    const panel = state.chatPanel || await waitForChatPanel();
    const origInput = panel?.querySelector('textarea, input[type="text"], [contenteditable="true"]');
    const origBtn = Array.from(panel?.querySelectorAll('button') || []).find(b => {
        const t = (b.textContent || '').trim().toLowerCase();
        return t === 'send' || t === 'enviar' || (b.getAttribute('aria-label') || '').toLowerCase().includes('send');
    });
    if (origInput) {
      try {
        if (origInput.isContentEditable) { origInput.focus(); origInput.textContent = msg; }
        else {
          const proto = Object.getPrototypeOf(origInput);
          const desc = Object.getOwnPropertyDescriptor(proto, 'value');
          if (desc && desc.set) desc.set.call(origInput, msg);
          else origInput.value = msg;
        }
        origInput.dispatchEvent(new Event('input', { bubbles: true }));
        origInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      } catch (e) { origInput.value = msg; origInput.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    if (origBtn) origBtn.click();
    const local = document.getElementById(CFG.localInputId);
    if (local) { local.value = ''; local.focus(); }
  }

  // --- SINCRONIZADOR INTELIGENTE (WHISPER + MENTION + REPLY) ---
  function setupInputSync() {
    setInterval(() => {
      if (document.getElementById(CFG.overlayId).style.display !== 'flex') return;
      const panel = state.chatPanel;
      if (!panel) return;
      const origInput = panel.querySelector('textarea, input[type="text"]');
      const localInput = document.getElementById(CFG.localInputId);

      if (origInput && localInput && origInput.value.length > 0) {
        let val = origInput.value;

        // Se o valor no original for diferente do que temos no local, o jogo injetou algo
        if (val !== localInput.value) {
            // Limpa duplicações comuns do jogo (ex: "/w Nome @Nome")
            const parts = val.split(' ');
            if (parts.length >= 3 && parts[0] === '/w' && parts[2].startsWith('@')) {
                val = parts[0] + ' ' + parts[1] + ' ';
            }

            localInput.value = val;
            localInput.focus();

            // Move o cursor para o fim
            localInput.setSelectionRange(val.length, val.length);

            // Limpa o original para evitar conflitos
            origInput.value = '';
        }
      }
    }, 100);
  }

  function handleGlobalClick(e) {
    const nameEl = e.target.closest('[data-name]');
    if (!nameEl || !state.chatPanel) return;
    const username = nameEl.getAttribute('data-name');
    const realNameEl = Array.from(state.chatPanel.querySelectorAll(`[data-name="${username}"]`)).find(el => el.offsetParent !== null);
    if (realNameEl) {
      realNameEl.click();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      setTimeout(() => {
        const menus = document.querySelectorAll('.MuiPopover-root');
        menus.forEach(m => {
          m.style.zIndex = "999999";
          const paper = m.querySelector('.MuiPaper-root');
          if (paper) {
            paper.style.position = 'fixed';
            paper.style.top = Math.min(window.innerHeight - 200, mouseY + 10) + 'px';
            paper.style.left = Math.min(window.innerWidth - 200, mouseX - 50) + 'px';
          }
        });
      }, 20);
    }
  }

  async function openOverlay() {
    const overlay = document.getElementById(CFG.overlayId);
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById(CFG.toggleBtnId).textContent = `CHAT IDE [ON] (${isMac ? '⌘+I' : 'Alt+I'})`;
    document.getElementById(CFG.localInputId).focus();
    state.chatPanel = await waitForChatPanel();
    if (!state.chatPanel) return;
    syncTabBindings(state.chatPanel);
    const tabs = getTabButtons(state.chatPanel);
    const selected = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    if (selected) {
      state.activeChannel = getDisplayName(selected);
      const panelEl = getTabPanelForTabButton(state.chatPanel, selected);
      ingestFromPanel(panelEl);
      attachActivePanelObserver(panelEl);
    }
    renderSidebar();
  }

  function closeOverlay() {
    document.getElementById(CFG.overlayId).style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById(CFG.toggleBtnId).textContent = `CHAT IDE [OFF] (${isMac ? '⌘+I' : 'Alt+I'})`;
    if (state.activePanelObserver) state.activePanelObserver.disconnect();
  }

  document.body.insertAdjacentHTML('beforeend', `
    <div id="${CFG.toggleBtnId}">CHAT IDE [OFF] (${isMac ? '⌘+I' : 'Alt+I'})</div>
    <div id="${CFG.overlayId}">
      <div id="${CFG.topbarId}">
        <div class="mw-top-left">MilkyWayIdle • <span style="color:var(--mw-accent)">IDE Chat View</span></div>
        <select id="mw-font-select" class="mw-font-select">
          <option value="12">12px</option><option value="13">13px</option><option value="14">14px</option>
          <option value="15">15px</option><option value="16">16px</option><option value="18">18px</option>
          <option value="20">20px</option><option value="22">22px</option>
        </select>
        <div class="mw-top-controls">
          <div id="mw-pill-links" class="mw-pill">Game Links</div>
          <div id="mw-pill-autoscroll" class="mw-pill">AutoScroll</div>
        </div>
        <div class="mw-top-right">Press ${isMac ? '⌘+I' : 'Alt+I'} to toggle</div>
        <button id="mw-exit-top">Exit</button>
      </div>
      <div id="${CFG.layoutId}">
        <aside id="${CFG.sidebarId}">
          <div style="font-weight:700; color:var(--mw-text); margin-bottom:10px">Channels</div>
          <input id="channel-filter" placeholder="filter..." />
          <div id="${CFG.chanListId}"></div>
        </aside>
        <main id="${CFG.mainId}">
          <div id="${CFG.bodyId}"></div>
          <div id="${CFG.footerId}">
            <textarea id="${CFG.localInputId}" placeholder="Type a message..."></textarea>
            <button id="${CFG.sendBtnId}">SEND</button>
          </div>
        </main>
      </div>
    </div>
  `);

  const pillLinks = document.getElementById('mw-pill-links');
  const pillAuto = document.getElementById('mw-pill-autoscroll');
  const fontSelect = document.getElementById('mw-font-select');
  setPillState(pillLinks, settings.gameLinksOn); pillLinks.textContent = `Game Links: ${settings.gameLinksOn ? 'ON' : 'OFF'}`;
  setPillState(pillAuto, settings.autoScroll); pillAuto.textContent = `AutoScroll: ${settings.autoScroll ? 'ON' : 'OFF'}`;
  fontSelect.value = String(settings.fontSize);
  document.getElementById(CFG.toggleBtnId).addEventListener('click', () => document.getElementById(CFG.overlayId).style.display === 'flex' ? closeOverlay() : openOverlay());
  document.getElementById('mw-exit-top').addEventListener('click', closeOverlay);
  document.getElementById('channel-filter').addEventListener('input', (e) => renderSidebar(e.target.value));
  document.getElementById(CFG.localInputId).addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendToGame(e.target.value.trim()); } });
  document.getElementById(CFG.sendBtnId).addEventListener('click', () => sendToGame(document.getElementById(CFG.localInputId).value.trim()));
  document.getElementById(CFG.bodyId).addEventListener('click', handleGlobalClick);
  pillLinks.addEventListener('click', () => {
    settings.gameLinksOn = !settings.gameLinksOn; GM_setValue('mw_gamelinks_on', settings.gameLinksOn);
    setPillState(pillLinks, settings.gameLinksOn); pillLinks.textContent = `Game Links: ${settings.gameLinksOn ? 'ON' : 'OFF'}`;
    const panel = state.chatPanel && getTabPanelForTabButton(state.chatPanel, state.tabInfoByChannel.get(state.activeChannel)?.tabBtn);
    if (panel) ingestFromPanel(panel);
  });
  pillAuto.addEventListener('click', () => {
    settings.autoScroll = !settings.autoScroll; GM_setValue('mw_autoscroll', settings.autoScroll);
    setPillState(pillAuto, settings.autoScroll); pillAuto.textContent = `AutoScroll: ${settings.autoScroll ? 'ON' : 'OFF'}`;
  });
  fontSelect.addEventListener('change', (e) => {
    const n = Number(e.target.value); document.documentElement.style.setProperty('--mw-chat-font-size', n + 'px');
    GM_setValue('mw_chat_font_size', n); settings.fontSize = n;
  });
  window.addEventListener('keydown', (e) => {
    const hk = CFG.hotkey;
    const isHot = isMac ? (e.metaKey && e.key.toLowerCase() === hk.key) : (e.altKey && e.key.toLowerCase() === hk.key);
    if (isHot) { e.preventDefault(); document.getElementById(CFG.overlayId).style.display === 'flex' ? closeOverlay() : openOverlay(); }
    if (e.key === 'Escape' && document.getElementById(CFG.overlayId).style.display === 'flex') closeOverlay();
  });

  (async function bootstrap() {
    state.chatPanel = await waitForChatPanel();
    setupInputSync();
    if (state.chatPanel) {
      new MutationObserver(() => renderSidebar(document.getElementById('channel-filter')?.value || '')).observe(state.chatPanel, { childList: true, subtree: true, characterData: true });
      syncTabBindings(state.chatPanel);
    }
    document.documentElement.style.setProperty('--mw-chat-font-size', settings.fontSize + 'px');
  })();
})();