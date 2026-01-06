// ==UserScript==
// @name         Protagonist Dialog Collector
// @namespace    chb
// @version      1
// @description  Collect protagonist dialog lines in a dark floating panel with left copy buttons; highlight copied line for 50s, clearing previous; panel auto-expands (no scroll).
// @match        *://*.game8.co/*
// @match        *://game8.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561562/Protagonist%20Dialog%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/561562/Protagonist%20Dialog%20Collector.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // -------- CONFIG: adjust selectors if needed --------
  const protagonistImgSelector = 'img[alt*="Protagonist"], img[alt*="protagonist"]';
  const dialogTextSelector = 'b.a-bold'; // next sibling in the screenshot
  const copyHighlightMs = 50000;          // highlight duration (50 seconds)
  // ----------------------------------------------------

  const collected = new Set();
  let highlightedLi = null;
  let highlightTimeout = null;

  // Create floating panel
  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'dialog-panel';
    panel.innerHTML = `
      <div id="dialog-panel-header" style="
        cursor: move;
        background:#181818;
        color:#f5f5f5;
        padding:6px 10px;
        font-size:13px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        border-bottom:1px solid #333;
      ">
        <span>Protagonist Dialog</span>
        <div style="display:flex; gap:6px; align-items:center;">
          <button id="dialog-panel-clear" style="padding:2px 6px; font-size:12px; background:#333; color:#f5f5f5; border:1px solid #444; border-radius:4px;">Clear</button>
          <button id="dialog-panel-toggle" style="padding:2px 6px; font-size:12px; background:#333; color:#f5f5f5; border:1px solid #444; border-radius:4px;">–</button>
        </div>
      </div>
      <div id="dialog-panel-body" style="
        padding:8px;
        background:#0f0f0f;
        color:#e8e8e8;
        font-size:13px;
        min-width:260px;
        overflow:visible;   /* allow full height, no scrolling */
      ">
        <ol id="dialog-list" style="
          margin:0;
          padding-left:18px;
          display:flex;
          flex-direction:column;
          gap:8px;
          list-style-position: inside;
        "></ol>
      </div>
    `;
    Object.assign(panel.style, {
      position: 'fixed',
      top: '80px',
      right: '30px',
      zIndex: 99999,
      boxShadow: '0 6px 18px rgba(0,0,0,0.45)',
      border: '1px solid #333',
      background: '#111',
      minWidth: '280px',
      fontFamily: 'system-ui, sans-serif',
      color: '#e8e8e8'
    });
    document.body.appendChild(panel);

    // Dragging
    const header = panel.querySelector('#dialog-panel-header');
    let isDown = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
    header.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.clientX; startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      startLeft = rect.left; startTop = rect.top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = `${startLeft + dx}px`;
      panel.style.top = `${startTop + dy}px`;
      panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { isDown = false; });

    // Collapse
    const body = panel.querySelector('#dialog-panel-body');
    const toggleBtn = panel.querySelector('#dialog-panel-toggle');
    toggleBtn.onclick = () => {
      const hidden = body.style.display === 'none';
      body.style.display = hidden ? 'block' : 'none';
      toggleBtn.textContent = hidden ? '–' : '+';
    };

    // Clear
    panel.querySelector('#dialog-panel-clear').onclick = () => {
      collected.clear();
      const list = panel.querySelector('#dialog-list');
      list.innerHTML = '';
      clearHighlight();
    };

    return panel;
  }

  const panel = createPanel();
  const listEl = panel.querySelector('#dialog-list');

  function clearHighlight() {
    if (highlightedLi) {
      highlightedLi.style.border = '1px solid #333';
      highlightedLi = null;
    }
    if (highlightTimeout) {
      clearTimeout(highlightTimeout);
      highlightTimeout = null;
    }
  }

  function setHighlight(li, ok = true) {
    clearHighlight();
    highlightedLi = li;
    li.style.border = `1px solid ${ok ? '#4caf50' : '#c62828'}`;
    li.style.borderRadius = '6px';
    highlightTimeout = setTimeout(() => {
      if (highlightedLi === li) {
        li.style.border = '1px solid #333';
        highlightedLi = null;
      }
    }, copyHighlightMs);
  }

  function makeCopyButton(text, li) {
    const btn = document.createElement('button');
    btn.textContent = '⧉';
    btn.title = 'Copy';
    btn.style.cssText = `
      padding:2px 6px;
      font-size:12px;
      background:#222;
      color:#e8e8e8;
      border:1px solid #444;
      border-radius:4px;
      cursor:pointer;
      flex-shrink:0;
    `;
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '✓';
        setHighlight(li, true);
        setTimeout(() => { btn.textContent = '⧉'; }, 800);
      } catch (err) {
        btn.textContent = '!';
        setHighlight(li, false);
        setTimeout(() => { btn.textContent = '⧉'; }, 800);
      }
    });
    return btn;
  }

  function addLine(text) {
    const cleaned = text.trim();
    if (!cleaned || collected.has(cleaned)) return;
    collected.add(cleaned);
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'flex-start';
    li.style.gap = '8px';
    li.style.lineHeight = '1.4';
    li.style.padding = '6px';
    li.style.border = '1px solid #333';
    li.style.borderRadius = '6px';

    const copyBtn = makeCopyButton(cleaned, li);
    const span = document.createElement('span');
    span.textContent = cleaned;
    span.style.flex = '1';
    span.style.wordBreak = 'break-word';

    li.appendChild(copyBtn);  // Copy button on the left
    li.appendChild(span);
    listEl.appendChild(li);
  }

  function scrapeExisting(root = document) {
    // Find protagonist avatars
    const imgs = root.querySelectorAll(protagonistImgSelector);
    imgs.forEach(img => {
      // Try next sibling bold as shown in screenshot
      let candidate = img.nextElementSibling;
      if (candidate && candidate.matches(dialogTextSelector)) {
        addLine(candidate.textContent || '');
        return;
      }
      // Fallback: search nearby bolds
      const bolds = img.parentElement?.querySelectorAll(dialogTextSelector) || [];
      bolds.forEach(b => addLine(b.textContent || ''));
    });
  }

  // Observe for new dialog nodes
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches && (node.matches(protagonistImgSelector) || node.matches(dialogTextSelector))) {
          scrapeExisting(node.parentElement || node);
        } else {
          scrapeExisting(node);
        }
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Initial scrape
  scrapeExisting();

  // Optional: also scrape when user scrolls (infinite scroll pages)
  let scrollTimeout = null;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => scrapeExisting(), 300);
  });
})();