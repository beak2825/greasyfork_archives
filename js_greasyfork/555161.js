// ==UserScript==
// @name         NitroType Racer Info Tab (Deeper Polish)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Movable, resizable tab showing extra Nitro Type racer info with refined aesthetics and minimal fields
// @match        https://www.nitrotype.com/racer/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555161/NitroType%20Racer%20Info%20Tab%20%28Deeper%20Polish%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555161/NitroType%20Racer%20Info%20Tab%20%28Deeper%20Polish%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const LS_KEY = 'nt_racer_info_tab_prefs';
  const prefs = loadPrefs();

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || {
        x: null,
        y: null,
        width: 360,
        visible: true,
        theme: 'dark'
      };
    } catch {
      return { x: null, y: null, width: 360, visible: true, theme: 'dark' };
    }
  }
  function savePrefs() {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  }

  // Keyboard shortcut to toggle (Alt+R)
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'r') {
      prefs.visible = !prefs.visible;
      savePrefs();
      const panel = document.getElementById('nt-racer-panel');
      if (panel) panel.style.display = prefs.visible ? 'block' : 'none';
    }
  });

  // Toggle button (bottom-right)
  function createToggleButton() {
    if (document.getElementById('nt-racer-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'nt-racer-toggle';
    btn.textContent = 'Racer Info';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '14px',
      right: '14px',
      padding: '8px 12px',
      borderRadius: '10px',
      border: 'none',
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '13px',
      cursor: 'pointer',
      zIndex: '99999',
      boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
      transition: 'transform 120ms ease, box-shadow 150ms ease'
    });
    styleButtonTheme(btn);
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-1px)';
      btn.style.boxShadow = '0 14px 26px rgba(0,0,0,0.30)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.25)';
    });
    btn.addEventListener('click', () => {
      prefs.visible = !prefs.visible;
      savePrefs();
      const panel = document.getElementById('nt-racer-panel');
      if (panel) panel.style.display = prefs.visible ? 'block' : 'none';
    });
    document.body.appendChild(btn);
  }

  function stylePanelTheme(el) {
    const dark = prefs.theme === 'dark';
    el.style.background = dark
      ? 'linear-gradient(180deg, rgba(24,24,28,0.90), rgba(16,16,22,0.88))'
      : 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,248,250,0.94))';
    el.style.color = dark ? '#f2f2f2' : '#1a1a1a';
    el.style.border = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)';
    el.style.backdropFilter = 'blur(8px)';
  }
  function styleChip(el) {
    const dark = prefs.theme === 'dark';
    el.style.background = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    el.style.color = dark ? '#e8e8e8' : '#2a2a2a';
    el.style.border = dark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.10)';
    el.style.borderRadius = '10px';
    el.style.padding = '6px 8px';
    el.style.fontSize = '12px';
  }
  function styleButtonTheme(el) {
    const dark = prefs.theme === 'dark';
    el.style.background = dark
      ? 'linear-gradient(180deg,#2b2b31,#23232a)'
      : 'linear-gradient(180deg,#f3f3f7,#e9e9ee)';
    el.style.color = dark ? '#fafafa' : '#1e1e1e';
  }

  function whenReady(cb) {
    const ntg = window.NTGLOBALS;
    if (ntg && ntg.RACER_INFO && ntg.RACER_INFO.username) {
      return cb(ntg.RACER_INFO);
    }
    setTimeout(() => whenReady(cb), 150);
  }

  function buildPanel(info) {
    // Compute unique garage IDs count (no list shown)
    const uniqueCount = Array.isArray(info.garage) ? new Set(info.garage).size : 0;

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'nt-racer-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      top: prefs.y || '80px',
      right: prefs.x ? 'auto' : '40px',
      left: prefs.x || 'auto',
      width: (prefs.width || 360) + 'px',
      minWidth: '280px',
      borderRadius: '14px',
      boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '13px',
      lineHeight: '1.55em',
      zIndex: '99999',
      display: prefs.visible ? 'block' : 'none',
      transition: 'opacity 160ms ease, transform 160ms ease'
    });
    stylePanelTheme(panel);

    // Header (draggable)
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.padding = '12px 14px';
    header.style.cursor = 'move';
    header.style.userSelect = 'none';
    header.style.borderTopLeftRadius = '14px';
    header.style.borderTopRightRadius = '14px';
    header.style.background = 'rgba(255,255,255,0.06)';

    const title = document.createElement('div');
    title.textContent = 'Racer Info (Extras)';
    title.style.fontWeight = '800';
    title.style.letterSpacing = '0.2px';
    header.appendChild(title);

    // Actions: theme toggle + close
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '8px';

    const themeBtn = document.createElement('button');
    themeBtn.textContent = prefs.theme === 'dark' ? 'Light' : 'Dark';
    styleChip(themeBtn);
    themeBtn.title = 'Toggle theme';
    themeBtn.addEventListener('click', () => {
      prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark';
      themeBtn.textContent = prefs.theme === 'dark' ? 'Light' : 'Dark';
      savePrefs();
      stylePanelTheme(panel);
      [themeBtn, closeBtn].forEach(el => styleChip(el));
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Hide';
    styleChip(closeBtn);
    closeBtn.title = 'Hide panel';
    closeBtn.addEventListener('click', () => {
      prefs.visible = false;
      savePrefs();
      panel.style.display = 'none';
    });

    actions.appendChild(themeBtn);
    actions.appendChild(closeBtn);
    header.appendChild(actions);
    panel.appendChild(header);

    // Body table (only extra fields, minimal)
    const body = document.createElement('div');
    body.style.padding = '10px 14px 6px 14px';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    function addRow(label, value) {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      td1.textContent = label;
      td1.style.fontWeight = '700';
      td1.style.padding = '6px 8px 4px 0';
      td1.style.verticalAlign = 'top';
      td2.textContent = value;
      td2.style.padding = '6px 0 4px 0';
      tr.appendChild(td1);
      tr.appendChild(td2);
      table.appendChild(tr);
    }

    addRow('Username', safe(info.username));
    addRow('Cars owned (unique)', uniqueCount);
    addRow('Nitros', `${safe(info.nitros)} (Used: ${safe(info.nitrosUsed)})`);
    addRow('Longest session', safe(info.longestSession));
    addRow('Level', safe(info.level));
    addRow('Experience', safe(info.experience));
    addRow('Car ID (current)', safe(info.carID));
    addRow('Unique garage IDs', uniqueCount);

    body.appendChild(table);
    panel.appendChild(body);

    // Footer credit
    const footer = document.createElement('div');
    footer.innerHTML = `Made By <a href="https://www.youtube.com/@InternetTyper" target="_blank" rel="noopener noreferrer" style="color:#58a6ff; text-decoration:none; font-weight:700;">@InternetTyper On YouTube</a>`;
    Object.assign(footer.style, {
      textAlign: 'center',
      padding: '10px 12px',
      fontSize: '12px',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    });
    panel.appendChild(footer);

    // Resize handle (visual + functional)
    const handle = document.createElement('div');
    Object.assign(handle.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      right: '8px',
      bottom: '8px',
      borderRadius: '3px',
      cursor: 'nwse-resize'
    });
    styleChip(handle);
    panel.appendChild(handle);

    // Dragging logic
    let dragging = false, offsetX = 0, offsetY = 0;
    header.addEventListener('mousedown', (e) => {
      dragging = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', endDrag);
    });
    function onDrag(e) {
      if (!dragging) return;
      panel.style.left = (e.clientX - offsetX) + 'px';
      panel.style.top = (e.clientY - offsetY) + 'px';
      panel.style.right = 'auto';
      prefs.x = panel.style.left;
      prefs.y = panel.style.top;
      savePrefs();
    }
    function endDrag() {
      dragging = false;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', endDrag);
    }

    // Resizing logic
    let resizing = false, startX = 0, startWidth = 0;
    handle.addEventListener('mousedown', (e) => {
      resizing = true;
      startX = e.clientX;
      startWidth = panel.offsetWidth;
      document.addEventListener('mousemove', onResize);
      document.addEventListener('mouseup', endResize);
    });
    function onResize(e) {
      if (!resizing) return;
      const delta = e.clientX - startX;
      const newW = Math.max(300, Math.min(520, startWidth + delta));
      panel.style.width = newW + 'px';
      prefs.width = newW;
      savePrefs();
    }
    function endResize() {
      resizing = false;
      document.removeEventListener('mousemove', onResize);
      document.removeEventListener('mouseup', endResize);
    }

    document.body.appendChild(panel);
  }

  function safe(v) {
    if (v === undefined || v === null) return '—';
    return String(v);
  }

  function init() {
    whenReady((info) => {
      // Build once
      if (!document.getElementById('nt-racer-panel')) {
        buildPanel(info);
      }
      // Provide toggle button
      createToggleButton();
    });

    // SPA-aware: re-check on DOM mutations in case profile content changes
    const obs = new MutationObserver(() => {
      const ntg = window.NTGLOBALS;
      if (!document.getElementById('nt-racer-panel') && ntg?.RACER_INFO?.username) {
        buildPanel(ntg.RACER_INFO);
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  window.addEventListener('load', init);
})();
