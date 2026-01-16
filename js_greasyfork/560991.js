// ==UserScript==
// @name           MangaPlaza Ripper
// @namespace      https://greasyfork.org/en/users/1553223-ozler365
// @version        11.1.0
// @description    Targets pages by ID (content-p1, p2...) to guarantee perfect order. Merges split parts automatically.
// @author         ozler365
// @license        MIT
// @match          https://reader.mangaplaza.com/*
// @icon           https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxPhS0MYkfiZ0LGfDQaF7jedEY76T9dZybag&s
// @require        https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/560991/MangaPlaza%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/560991/MangaPlaza%20Ripper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Configuration ---
  const CONFIG = {
      // We look for canvases/images INSIDE the specific page container
      PART_SELECTOR: 'canvas, img', 
      MIN_WIDTH: 50 // Ignore tiny tracking pixels
  };

  // --- State ---
  const state = {
      capturedPages: new Set(), // Set of page IDs (e.g. 1, 2, 3)
      zipFiles: new Map(),      // Map<PageNum, Blob>
      isRunning: false,
      speedDelay: 1000,
      totalExpected: 0
  };

  // --- 1. UI Construction ---
  const injectUI = () => {
    if (document.getElementById('mangaplaza-ui')) return;
    
    const style = document.createElement('style');
    style.textContent = `
      #mangaplaza-ui {
        position: fixed; top: 100px; left: 20px; z-index: 2147483647;
        font-family: sans-serif; display: flex; flex-direction: column; gap: 8px;
        background: #121212; padding: 14px; border-radius: 8px;
        cursor: move; width: 240px; border: 1px solid #333; color: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.8);
      }
      .ui-group { margin-bottom: 5px; }
      .ui-label { font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 2px; display:block; }
      input[type="text"] { 
        background: #2a2a2a; border: 1px solid #444; color: #fff; 
        padding: 6px; border-radius: 4px; font-size: 12px; width: 100%; box-sizing: border-box;
      }
      input[type=range] { width: 100%; cursor: pointer; margin: 5px 0; accent-color: #e60012; }
      #ripper-btn {
        padding: 12px; background: #e60012; color: white; border: none; border-radius: 4px;
        font-weight: bold; cursor: pointer; font-size: 13px; margin-top: 5px; width: 100%;
      }
      #ripper-btn:hover { background: #ff1a1a; }
      #ripper-status {
        font-size: 11px; color: #00e676; text-align: center; margin-top: 5px; 
        font-family: monospace; min-height: 15px;
      }
      .drag-handle { text-align: center; font-size: 10px; color: #555; margin-bottom: 8px; letter-spacing: 2px; }
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = 'mangaplaza-ui';
    
    // Auto-Detect Title
    let defSeries = document.title.split('|')[0].trim();
    let defChap = "";
    const m = document.title.match(/(Chapter|Ep)\s*([\d.-]+)/i);
    if (m) defChap = m[2];

    div.innerHTML = `
      <div class="drag-handle">RIPPER V11 (ID-TARGET)</div>
      
      <div class="ui-group">
        <label class="ui-label">Series</label>
        <input type="text" id="mp-series" value="${defSeries}">
      </div>

      <div class="ui-group">
        <label class="ui-label">Chapter</label>
        <input type="text" id="mp-chapter" value="${defChap}" placeholder="e.g. 15">
      </div>

      <div class="ui-group">
         <label class="ui-label" id="mp-speed-lbl">Speed: Normal</label>
         <input type="range" id="mp-speed" min="0" max="1500" value="1000">
      </div>

      <div id="ripper-status">Ready.</div>
      <button id="ripper-btn">Start ID-Scan</button>
    `;

    document.body.appendChild(div);

    // Events
    const slider = document.getElementById('mp-speed');
    const lbl = document.getElementById('mp-speed-lbl');
    slider.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        const delay = 2000 - val; 
        state.speedDelay = delay;
        lbl.innerText = `Speed: ${delay}ms`;
    };
    state.speedDelay = 2000 - parseInt(slider.value, 10);

    const btn = document.getElementById('ripper-btn');
    btn.onclick = () => startEngine(btn, document.getElementById('ripper-status'));

    // Drag
    let isDown = false, offset = [0, 0];
    div.addEventListener('mousedown', (e) => {
        if (e.target.tagName.match(/INPUT|BUTTON/)) return;
        isDown = true;
        offset = [div.offsetLeft - e.clientX, div.offsetTop - e.clientY];
    });
    document.addEventListener('mouseup', () => isDown = false);
    document.addEventListener('mousemove', (e) => {
        if (isDown) {
            e.preventDefault();
            div.style.left = (e.clientX + offset[0]) + 'px';
            div.style.top  = (e.clientY + offset[1]) + 'px';
        }
    });
  };

  // --- 2. Core Logic: Process Specific Page ID ---

  async function processPage(pageNum) {
      const id = `content-p${pageNum}`;
      const pageDiv = document.getElementById(id);
      
      if (!pageDiv) return false; // Page DOM doesn't exist yet

      // Scroll to it to force load
      pageDiv.scrollIntoView({ block: 'center' });

      // Look for parts inside THIS div
      const parts = Array.from(pageDiv.querySelectorAll(CONFIG.PART_SELECTOR));
      
      // Filter visible/loaded parts
      const validParts = parts.filter(el => {
          return el.width > CONFIG.MIN_WIDTH && el.height > 10;
      });

      if (validParts.length === 0) return false; // Not loaded yet

      // Convert parts to bitmaps
      const blobs = [];
      for (const el of validParts) {
          const blob = await new Promise(r => {
             try {
                 if(el.tagName === 'CANVAS') el.toBlob(r, 'image/jpeg', 0.95);
                 else {
                     // Draw img to canvas
                     const c = document.createElement('canvas');
                     c.width = el.naturalWidth; c.height = el.naturalHeight;
                     c.getContext('2d').drawImage(el,0,0);
                     c.toBlob(r, 'image/jpeg', 0.95);
                 }
             } catch(e) { r(null); }
          });
          if (blob) blobs.push({ blob, el });
      }

      if (blobs.length === 0) return false;

      // SORT parts (Vertical order inside the page)
      // This fixes the split image order issue
      blobs.sort((a, b) => {
          const rectA = a.el.getBoundingClientRect();
          const rectB = b.el.getBoundingClientRect();
          return rectA.top - rectB.top;
      });

      // MERGE parts
      const mergedBlob = await mergeBlobs(blobs.map(b => b.blob));
      
      return mergedBlob;
  }

  async function mergeBlobs(blobList) {
      if (blobList.length === 1) return blobList[0];

      const bitmaps = await Promise.all(blobList.map(b => createImageBitmap(b)));
      const width = Math.max(...bitmaps.map(b => b.width));
      const height = bitmaps.reduce((acc, b) => acc + b.height, 0);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      let y = 0;
      for (const bmp of bitmaps) {
          ctx.drawImage(bmp, 0, y);
          y += bmp.height;
          bmp.close();
      }

      return new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.95));
  }

  // --- 3. Progress Reader ---
  function getProgress() {
      // "38/38" text
      const allDivs = document.querySelectorAll('div, span, p, b, strong');
      for (const el of allDivs) {
          if (el.offsetParent === null) continue;
          const text = el.innerText.trim();
          const match = text.match(/^(\d+)\s*\/\s*(\d+)$/);
          if (match) {
              return { current: parseInt(match[1], 10), total: parseInt(match[2], 10) };
          }
      }
      return null;
  }

  // --- 4. Main Engine ---
  async function startEngine(btn, statusLabel) {
      if (state.isRunning) {
          state.isRunning = false;
          btn.innerText = "Stop";
          return;
      }

      state.isRunning = true;
      state.capturedPages.clear();
      state.zipFiles.clear();
      btn.innerText = "Stop";

      let currentPage = 1;
      let consecutiveFails = 0;

      while (state.isRunning) {
          // A. Check Progress
          const prog = getProgress();
          const totalStr = prog ? `/${prog.total}` : "";
          
          statusLabel.innerText = `Processing Page ${currentPage}${totalStr}...`;

          // B. Try to Capture current Page ID
          const blob = await processPage(currentPage);

          if (blob) {
              // SUCCESS
              state.zipFiles.set(currentPage, blob);
              state.capturedPages.add(currentPage);
              statusLabel.innerText = `Captured Page ${currentPage}!`;
              consecutiveFails = 0;
              currentPage++; // Move to next
          } else {
              // FAIL (Not loaded yet)
              consecutiveFails++;
              
              // Scroll Down / Next Force
              window.scrollBy(0, 500);
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true }));
              
              // Stuck check
              if (consecutiveFails > 15) { 
                  // If we are stuck on Page X, maybe it doesn't exist?
                  // If Progress says Total is 38 and we are at 39, we are done.
                  if (prog && currentPage > prog.total) {
                      break; // DONE
                  }
                  // If we are stuck in middle
                  if (confirm(`Stuck on Page ${currentPage}. Stop and Save?`)) break;
                  consecutiveFails = 0;
              }
          }

          // C. Global Stop Condition
          if (prog && state.capturedPages.size >= prog.total) {
              statusLabel.innerText = "All Pages Captured!";
              break;
          }

          // Delay
          await new Promise(r => setTimeout(r, state.speedDelay));
      }

      finish(btn, statusLabel);
  }

  // --- 5. Save ---
  function getFilename() {
      const clean = (s) => s.replace(/[\\/:*?"<>|]+/g, ' ').trim();
      const sName = document.getElementById('mp-series').value.trim() || "Manga";
      const sChap = document.getElementById('mp-chapter').value.trim();
      if (sChap) return `${clean(sName)} - Chapter ${clean(sChap)}.zip`;
      return `${clean(sName)}.zip`;
  }

  async function finish(btn, statusLabel) {
      state.isRunning = false;
      
      if (state.zipFiles.size === 0) {
          btn.innerText = "Start ID-Scan";
          statusLabel.innerText = "No pages saved.";
          return;
      }

      statusLabel.innerText = "Generating ZIP...";
      const zip = new JSZip();

      // Iterate 1 to Max
      const maxPage = Math.max(...state.zipFiles.keys());
      for (let i = 1; i <= maxPage; i++) {
          if (state.zipFiles.has(i)) {
              const name = `${String(i).padStart(3, '0')}.jpg`;
              zip.file(name, state.zipFiles.get(i));
          }
      }

      const fname = getFilename();
      try {
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, fname);
          statusLabel.innerText = "Done!";
      } catch (e) {
          statusLabel.innerText = "Error: " + e;
      }

      setTimeout(() => {
          btn.innerText = "Start ID-Scan";
      }, 4000);
  }

  setInterval(injectUI, 1000);
  injectUI();

})();
