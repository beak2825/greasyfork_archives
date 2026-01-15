// ==UserScript==
// @name        Prydwen.gg - Reverse: 1999 Owned Character Highlighter
// @namespace    https://greasyfork.org/users/1476331-jon78
// @match       https://www.prydwen.gg/*
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      jon78
// @icon        https://icons.duckduckgo.com/ip3/blog.prydwen.gg.ico
// @description Adds a panel to highlight owned characters, while unowned characters are greyed out.
// @license     CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/562664/Prydwengg%20-%20Reverse%3A%201999%20Owned%20Character%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/562664/Prydwengg%20-%20Reverse%3A%201999%20Owned%20Character%20Highlighter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 're1999_owned_chars';
  const PANEL_KEY = 'owned_chars_panel_hidden';
  const SITE_PREFIX = location.origin;

  // --- Utilities ---
  const loadOwned = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) {
      console.error('Failed to load owned list', e);
      return new Set();
    }
  };
  const saveOwned = (set) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch (e) {
      console.error('Failed to save owned list', e);
    }
  };
  const owned = loadOwned();

  const slugFromAnchor = (a) => {
    try {
      const url = new URL(a.href, SITE_PREFIX);
      const parts = url.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1];
    } catch {
      return null;
    }
  };

  // --- CSS ---
  const style = document.createElement('style');
  const ICONS = {
    up: `
    <svg viewBox="0 0 640 640" width="16" height="16" fill="currentColor">
      <path d="M297.4 201.4C309.9 188.9 330.2 188.9 342.7 201.4L502.7 361.4C515.2 373.9 515.2 394.2 502.7 406.7C490.2 419.2 469.9 419.2 457.4 406.7L320 269.3L182.6 406.6C170.1 419.1 149.8 419.1 137.3 406.6C124.8 394.1 124.8 373.8 137.3 361.3L297.3 201.3z"/>
    </svg>`,

    down: `
    <svg viewBox="0 0 640 640" width="16" height="16" fill="currentColor">
      <path d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"/>
    </svg>`
  };

  style.textContent = `
  /* Panel and controls */
  .prydwen-panel { overflow: auto; position:fixed; right:12px; top:12px; width:300px; max-height:60vh; background:rgb(28, 29, 33); color:rgb(240, 240, 242); font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; font-size:14px; z-index:999999; display:flex; flex-direction:column; gap:8px; border:2px solid rgb(51, 52, 58); }
  .prydwen-panel h4 { margin:0 0 6px 0; font-size:14px; }
  .prydwen-controls { display:flex; gap:6px; align-items:stretch; justify-content:center; background:rgb(44, 45, 51); height:40px; }
  .prydwen-btn { display:flex; align-items:center; justify-content:center; flex:1; height:100%; background:rgb(44, 45, 51); font-family: Tahoma, Geneva, sans-serif; font-size: 14px; border:transparent; color:inherit; gap:6px; cursor:pointer; }
  .prydwen-btn:hover { background:rgb(54, 55, 61); }
  .prydwen-btn.active { background:rgb(0, 158, 236); }
  .prydwen-collapse-btn svg {
    width: 16px;
    height: 16px;
    display: block;
  }
  .prydwen-panel.collapsed { height:auto; width:220px; }
  .prydwen-panel.collapsed .prydwen-controls, .prydwen-panel.collapsed #prydwen-import-area, .prydwen-panel.collapsed .prydwen-small { display:none !important; }
  .prydwen-collapse-btn { background:transparent; border:none; color:inherit; cursor:pointer; font-size:16px; line-height:1; padding:2px 6px; opacity:0.7; }
  .prydwen-collapse-btn:hover { opacity:1; }
  .prydwen-small { font-size:12px; opacity:0.9; }

  /* Unowned character greyed out */
  a[href*="/re1999/characters/"] .avatar.prydwen-unowned { filter:grayscale(1); opacity:0.8; }

  /* Preview hover when eyedrop active */
  .prydwen-hover-preview { outline:1px solid rgb(0, 158, 236); }

  /* Import / export text box */
  .prydwen-panel textarea,
  .prydwen-panel input[type="text"] {
    width: 100%;
    min-height: 90px;
    max-height: 40vh;
    font-size: 12px;
    background: rgba(255,255,255,0.02);
    color: inherit;
    border: 1px solid rgb(60, 65, 68);
    padding: 8px;
    box-sizing: border-box;
    outline: none;
    resize: none;
    overflow: auto;
  }

  /* Focus style */
  .prydwen-panel textarea:focus,
  .prydwen-panel input[type="text"]:focus {
    border: 1px solid rgb(1, 57, 137);
    box-shadow: 0 0 0 4px rgb(25, 45, 77);
  }

  /* Panel padding */
  .prydwen-panel {
    padding-bottom: 10px;
  }
  /* Remove bottom padding when collapsed */
  .prydwen-panel.collapsed {
    padding-bottom: 0;
  }
  `;
  document.head.appendChild(style);

  // --- Panel DOM ---
  const panel = document.createElement('div');
  panel.className = 'prydwen-panel';
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 10px 0 10px;">
      <h4>Owned Characters</h4>
      <div style="display:flex;gap:6px;align-items:center;">
        <div class="prydwen-small">Reverse: 1999</div>
        <button class="prydwen-collapse-btn" id="prydwen-collapse"></button>
      </div>
    </div>
    <div class="prydwen-controls">
      <button title="Enter character picker mode" class="prydwen-btn" id="prydwen-eyedrop">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20" fill="currentColor">
          <path d="M405.6 93.2L304 194.8L294.6 185.4C282.1 172.9 261.8 172.9 249.3 185.4C236.8 197.9 236.8 218.2 249.3 230.7L409.3 390.7C421.8 403.2 442.1 403.2 454.6 390.7C467.1 378.2 467.1 357.9 454.6 345.4L445.2 336L546.8 234.4C585.8 195.4 585.8 132.2 546.8 93.3C507.8 54.4 444.6 54.3 405.7 93.3zM119.4 387.3C104.4 402.3 96 422.7 96 443.9L96 486.3L69.4 526.2C60.9 538.9 62.6 555.8 73.4 566.6C84.2 577.4 101.1 579.1 113.8 570.6L153.7 544L196.1 544C217.3 544 237.7 535.6 252.7 520.6L362.1 411.2L316.8 365.9L207.4 475.3C204.4 478.3 200.3 480 196.1 480L160 480L160 443.9C160 439.7 161.7 435.6 164.7 432.6L274.1 323.2L228.8 277.9L119.4 387.3z"/>
        </svg>
      </button>
      <button class="prydwen-btn" id="prydwen-clear">Clear</button>
      <button class="prydwen-btn" id="prydwen-export-toggle">Export</button>
      <button class="prydwen-btn" id="prydwen-import-toggle">Import</button>
    </div>
    <div style="display:flex;gap:8px;align-items:center;padding:0 10px 0 10px;">
      <div style="flex:1;" class="prydwen-small">Click the eyedropper then a character to own.</div>
    </div>
    <div id="prydwen-import-area" style="display:none;flex-direction:column;gap:6px;padding:0 10px;">
      <div style="display:flex;gap:6px;">
        <button class="prydwen-btn" id="prydwen-import-btn">Import & Save</button>
        <button class="prydwen-btn" id="prydwen-import-cancel">Cancel</button>
      </div>
      <textarea id="prydwen-import-text" placeholder='Paste owned characters JSON'></textarea>
    </div>
    <div id="prydwen-export-area" style="display:none;padding:0 10px;">
      <textarea class="prydwen-export-area" readonly></textarea>
    </div>
  `;
  document.body.appendChild(panel);

  // --- Panel controls ---
  const eyedropBtn = panel.querySelector('#prydwen-eyedrop');
  const clearBtn = panel.querySelector('#prydwen-clear');
  const exportToggle = panel.querySelector('#prydwen-export-toggle');
  const importToggle = panel.querySelector('#prydwen-import-toggle');
  const importArea = panel.querySelector('#prydwen-import-area');
  const importText = panel.querySelector('#prydwen-import-text');
  const importBtn = panel.querySelector('#prydwen-import-btn');
  const importCancel = panel.querySelector('#prydwen-import-cancel');
  const exportAreaWrapper = panel.querySelector('#prydwen-export-area');
  const exportArea = exportAreaWrapper.querySelector('textarea');
  const collapseBtn = panel.querySelector('#prydwen-collapse');
  collapseBtn.innerHTML = ICONS.down;

  // --- Panel visibility ---
  const setPanelHidden = (hidden) => {
    panel.style.display = hidden ? 'none' : '';
    localStorage.setItem(PANEL_KEY, hidden ? '1' : '0');
  };
  setPanelHidden(localStorage.getItem(PANEL_KEY) === '1');

  // GM menu toggle
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Toggle Owned Characters Panel', () => {
      setPanelHidden(panel.style.display !== 'none');
    });
  }

  // --- Eyedropper logic ---
  let eyedropActive = false;
  let lastHoverEl = null;
  const activateEyedrop = (on) => {
    eyedropActive = on;
    eyedropBtn.classList.toggle('active', on);
    document.body.classList.toggle('prydwen-selecting', on);
    document.body.style.cursor = on ? 'crosshair' : '';
    if (!on && lastHoverEl) {
      lastHoverEl.classList.remove('prydwen-hover-preview');
      lastHoverEl = null;
    }
  };
  eyedropBtn.addEventListener('click', () => activateEyedrop(!eyedropActive));

  const findCharacterAnchorFromEvent = (target) => {
    const a = target.closest?.('a[href*="/re1999/characters/"]');
    if (a) return a;
    let el = target;
    for (let i = 0; i < 4 && el; i++) {
      if (el.tagName === 'A' && el.href?.includes('/re1999/characters/')) return el;
      el = el.parentElement;
    }
    return null;
  };

  document.addEventListener('click', (ev) => {
    if (!eyedropActive) return;
    if (panel.contains(ev.target)) return;
    const a = findCharacterAnchorFromEvent(ev.target);
    if (!a) {
      activateEyedrop(false);
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    const slug = slugFromAnchor(a);
    if (!slug) return;
    owned.has(slug) ? owned.delete(slug) : owned.add(slug);
    saveOwned(owned);
    updateHighlights();
    const avatar = a.querySelector('.avatar') || a;
    avatar.classList.add('prydwen-hover-preview');
    setTimeout(() => avatar.classList.remove('prydwen-hover-preview'), 250);
  }, true);

  document.addEventListener('mousemove', (ev) => {
    if (!eyedropActive) return;
    const a = findCharacterAnchorFromEvent(ev.target);
    if (lastHoverEl && lastHoverEl !== (a?.querySelector('.avatar') || a)) {
      lastHoverEl.classList.remove('prydwen-hover-preview');
      lastHoverEl = null;
    }
    if (a) {
      const avatar = a.querySelector('.avatar') || a;
      if (avatar && avatar !== lastHoverEl) {
        avatar.classList.add('prydwen-hover-preview');
        lastHoverEl = avatar;
      }
    }
  }, true);

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && eyedropActive) activateEyedrop(false);
  });

  // --- Panel buttons ---
  clearBtn.addEventListener('click', () => {
    if (!confirm('Remove all owned characters?')) return;
    owned.clear();
    saveOwned(owned);
    updateHighlights();
  });

  importToggle.addEventListener('click', () => {
    importArea.style.display = importArea.style.display === 'none' ? 'flex' : 'none';
  });
  importCancel.addEventListener('click', () => importArea.style.display = 'none');
  importBtn.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(importText.value);
      if (!Array.isArray(parsed)) throw new Error();
      owned.clear();
      parsed.forEach(x => typeof x === 'string' && owned.add(x));
      saveOwned(owned);
      updateHighlights();
      importArea.style.display = 'none';
      importText.value = '';
      alert(`Imported ${owned.size} characters.`);
    } catch {
      alert('Invalid JSON array. Example: ["lucy","medicine-pocket"]');
    }
  });

  exportToggle.addEventListener('click', async () => {
    const data = JSON.stringify([...owned], null, 0); // compact JSON

    try {
      await navigator.clipboard.writeText(data); // copy to clipboard
      alert('Owned characters JSON copied to clipboard!');
    } catch (err) {
      // fallback if Clipboard API fails
      prompt('Could not copy automatically. Copy manually:', data);
    }
  });

  let collapsed = false;
  collapseBtn.addEventListener('click', () => {
    collapsed = !collapsed;
    panel.classList.toggle('collapsed', collapsed);
    collapseBtn.innerHTML = collapsed ? ICONS.up : ICONS.down;
  });

  // --- Highlight logic ---
  const updateHighlights = () => {
    document.querySelectorAll('.avatar.prydwen-owned').forEach(el => el.classList.remove('prydwen-owned'));
    document.querySelectorAll('.avatar.prydwen-unowned').forEach(el => el.classList.remove('prydwen-unowned'));
    document.querySelectorAll('.box.rev-team.prydwen-team-owned').forEach(el => el.classList.remove('prydwen-team-owned'));

    const anchors = Array.from(document.querySelectorAll('a[href*="/re1999/characters/"]'));
    anchors.forEach(a => {
      const slug = slugFromAnchor(a);
      if (!slug) return;
      const avatar = a.querySelector('.avatar') || a;
      if (!avatar) return;
      if (owned.has(slug)) {
        avatar.classList.add('prydwen-owned');
        avatar.classList.remove('prydwen-unowned');
      } else {
        avatar.classList.remove('prydwen-owned');
        avatar.classList.add('prydwen-unowned');
      }
    });

    const teamBoxes = Array.from(document.querySelectorAll('.box.rev-team'));
    teamBoxes.forEach(box => {
      const anchorsInBox = Array.from(box.querySelectorAll('a[href*="/re1999/characters/"]'));
      const slugs = anchorsInBox.map(slugFromAnchor).filter(Boolean);
      const allOwned = slugs.length > 0 && slugs.every(s => owned.has(s));
      box.classList.toggle('prydwen-team-owned', allOwned);
    });
  };

  // --- Debounced MutationObserver ---
  let highlightTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(highlightTimeout);
    highlightTimeout = setTimeout(updateHighlights, 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // --- Initial update ---
  updateHighlights();

  // --- Cleanup on unload ---
  window.addEventListener('beforeunload', () => observer.disconnect());

})();
