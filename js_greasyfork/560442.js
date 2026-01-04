// ==UserScript==
// @name           Manga-UP Ripper
// @namespace      https://greasyfork.org/en/users/1553223-ozler365
// @version        13.4.0
// @description    Manga-UP Ripper with Moveable UI, Series/Chapter renaming, and Red Speed Slider.
// @author         ozler365 (Modified)
// @license        MIT
// @match          https://global.manga-up.com/*
// @require        https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/560442/Manga-UP%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/560442/Manga-UP%20Ripper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Configuration ---
  const CONFIG = {
      IMG_SELECTOR: 'img[src^="blob:"]', // Look for blob images
      SLIDE_TIME: 1000,                  // Default time for slide animation
      MAX_WAIT_LOAD: 8000                // Max time to wait for loading
  };

  // --- State ---
  const state = {
      captured: new Map(),
      isRunning: false
  };

  // --- 1. Metadata Detection ---
  function detectMetadata() {
      // Series Name
      let series = "";
      const metaTitle = document.querySelector('meta[property="og:title"]');
      if (metaTitle) {
          series = metaTitle.content.split('|')[0].trim();
      } else {
          series = document.title.split('|')[0].trim();
      }

      // Chapter Number
      let chapter = "";
      const candidates = document.querySelectorAll('div, span, h1, h2');
      for (const el of candidates) {
          const txt = el.innerText ? el.innerText.trim() : "";
          if (/^(Chapter|Ep)\s+[\d.-]+/.test(txt) && txt.length < 50) {
              const rect = el.getBoundingClientRect();
              if (rect.top < 200) { 
                  chapter = txt;
                  break;
              }
          }
      }
      if (!chapter) {
          const match = document.title.match(/(Chapter\s*[\d.-]+)/i);
          if (match) chapter = match[1];
      }

      return { series, chapter };
  }

  // --- 2. Filename Logic ---
  function getFilename() {
      const clean = (str) => str.replace(/[\\/:*?"<>|]+/g, ' ').trim();
      
      const uiSeries = document.getElementById('mp-series');
      const uiChapter = document.getElementById('mp-chapter');
      
      const series = uiSeries ? uiSeries.value.trim() : "Manga";
      const chapter = uiChapter ? uiChapter.value.trim() : "";

      if (series.includes(chapter) || !chapter) return `${clean(series)}.zip`;
      return `${clean(series)} - ${clean(chapter)}.zip`;
  }

  // --- 3. UI Construction ---
  const createUI = () => {
    if (document.getElementById('mangaup-ui')) return;

    // A. Styles
    const style = document.createElement('style');
    style.textContent = `
      #mangaup-ui {
        position: fixed; top: 100px; left: 20px; z-index: 2147483647;
        font-family: sans-serif; display: flex; flex-direction: column; gap: 8px;
        background: #121212; padding: 14px; border-radius: 8px;
        cursor: move; width: 240px; border: 1px solid #333; color: white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.8);
      }
      .ui-group { margin-bottom: 5px; }
      .ui-label { font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 2px; display:block; }
      
      /* Inputs */
      #mangaup-ui input[type="text"] {
        background: #2a2a2a; border: 1px solid #444; color: #fff;
        padding: 6px; border-radius: 4px; font-size: 12px; width: 100%; box-sizing: border-box;
      }

      /* RED SLIDER STYLING */
      #mangaup-ui input[type=range] {
        -webkit-appearance: none; /* Remove default styling */
        width: 100%;
        background: transparent;
        margin: 8px 0;
        cursor: pointer;
      }
      /* Webkit (Chrome/Edge/Safari) Track */
      #mangaup-ui input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 6px;
        background: #ff0000; /* RED BAR */
        border-radius: 3px;
        border: none;
      }
      /* Webkit Thumb (Knob) */
      #mangaup-ui input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #ffffff;
        margin-top: -5px; /* Center thumb on track */
        box-shadow: 0 0 2px rgba(0,0,0,0.5);
      }
      /* Firefox Track */
      #mangaup-ui input[type=range]::-moz-range-track {
        width: 100%;
        height: 6px;
        background: #ff0000; /* RED BAR */
        border-radius: 3px;
        border: none;
      }
      /* Firefox Thumb */
      #mangaup-ui input[type=range]::-moz-range-thumb {
        height: 16px;
        width: 16px;
        border: none;
        border-radius: 50%;
        background: #ffffff;
      }

      /* Button */
      #ripper-btn {
        padding: 12px; background: #e60012; color: white; border: none; border-radius: 4px;
        font-weight: bold; cursor: pointer; font-size: 13px; margin-top: 5px; width: 100%;
      }
      #ripper-btn:hover { background: #ff1a1a; }
      #ripper-btn.waiting { background: #f0ad4e; } 
      
      /* Status */
      #ripper-status {
        font-size: 11px; color: #00e676; text-align: center; margin-top: 5px;
        font-family: monospace; min-height: 15px;
      }
      .drag-handle { text-align: center; font-size: 10px; color: #555; margin-bottom: 8px; letter-spacing: 2px; }
    `;
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = 'mangaup-ui';

    // B. Detect Defaults
    const defaults = detectMetadata();

    // C. HTML
    div.innerHTML = `
      <div class="drag-handle">MANGA-UP RIPPER</div>

      <div class="ui-group">
        <label class="ui-label">Series</label>
        <input type="text" id="mp-series" value="${defaults.series}">
      </div>

      <div class="ui-group">
        <label class="ui-label">Chapter</label>
        <input type="text" id="mp-chapter" value="${defaults.chapter}" placeholder="Chapter">
      </div>

      <div class="ui-group">
         <label class="ui-label" id="mp-speed-lbl">Speed: Normal (1000ms)</label>
         <input type="range" id="mp-speed" min="0" max="1500" value="1000">
      </div>

      <div id="ripper-status">Ready.</div>
      <button id="ripper-btn">Start Rip</button>
    `;

    document.body.appendChild(div);

    // D. Event Listeners
    
    // 1. Speed Slider
    const slider = document.getElementById('mp-speed');
    const lbl = document.getElementById('mp-speed-lbl');
    slider.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        const delay = 2000 - val; 
        CONFIG.SLIDE_TIME = delay;
        lbl.innerText = `Speed: ${delay}ms`;
    };
    CONFIG.SLIDE_TIME = 2000 - parseInt(slider.value, 10);

    // 2. Start Button
    const btn = document.getElementById('ripper-btn');
    const status = document.getElementById('ripper-status');
    btn.onclick = () => startEngine(btn, status);

    // 3. Drag Logic
    let isDown = false, offset = [0, 0];
    div.addEventListener('mousedown', (e) => {
        if (e.target.tagName.match(/INPUT|BUTTON/)) return;
        isDown = true;
        offset = [div.offsetLeft - e.clientX, div.offsetTop - e.clientY];
        div.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', () => {
        isDown = false;
        if(div) div.style.cursor = 'move';
    });
    document.addEventListener('mousemove', (e) => {
        if (isDown) {
            e.preventDefault();
            div.style.left = (e.clientX + offset[0]) + 'px';
            div.style.top  = (e.clientY + offset[1]) + 'px';
        }
    });
  };

  // --- 4. Logic Core (Manga-UP) ---

  function getProgress() {
      const allDivs = document.querySelectorAll('div, span, p');
      for (const el of allDivs) {
          if (el.offsetParent === null) continue;
          const text = el.innerText.trim();
          const match = text.match(/^(\d+)\s*\/\s*(\d+)$/);
          if (match) {
              return {
                  current: parseInt(match[1], 10),
                  total: parseInt(match[2], 10)
              };
          }
      }
      return null;
  }

  function copyImageToBlob(img) {
      return new Promise((resolve) => {
          if (!img.complete || img.naturalWidth < 50) {
              resolve(null);
              return;
          }
          try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
          } catch (e) {
              resolve(null);
          }
      });
  }

  async function scanPages() {
      const images = document.querySelectorAll(CONFIG.IMG_SELECTOR);
      let newCount = 0;
      
      for (const img of images) {
          if (img.naturalWidth < 200) continue; 
          const id = img.src;
          
          if (!state.captured.has(id)) {
              const blob = await copyImageToBlob(img);
              if (blob) {
                  let pageNum = state.captured.size + 1;
                  const m = (img.alt || "").match(/page_(\d+)/);
                  if (m) pageNum = parseInt(m[1], 10);
                  
                  state.captured.set(id, { blob, pageNum });
                  newCount++;
              }
          }
      }
      return newCount;
  }

  function triggerNext() {
      document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'ArrowLeft', keyCode: 37, bubbles: true
      }));
  }

  async function startEngine(btn, statusLabel) {
      if (state.isRunning) {
          state.isRunning = false;
          btn.innerText = "Stopping...";
          return;
      }

      state.isRunning = true;
      state.captured.clear();
      btn.innerText = "Stop (Saving...)";
      statusLabel.style.display = 'block';
      statusLabel.innerText = "Starting...";
      
      while (state.isRunning) {
          const progress = getProgress();
          
          // Wait Load
          let waitTime = 0;
          btn.classList.add('waiting'); 
          
          while (waitTime < CONFIG.MAX_WAIT_LOAD) {
              const count = await scanPages();
              if (count > 0) break;
              await new Promise(r => setTimeout(r, 200));
              waitTime += 200;
          }
          
          btn.classList.remove('waiting'); 
          
          const capturedCount = state.captured.size;
          if (progress) {
              statusLabel.innerText = `Read: ${progress.current}/${progress.total} (Saved: ${capturedCount})`;
              if (progress.current >= progress.total) {
                  await scanPages();
                  break; 
              }
          } else {
              statusLabel.innerText = `Scanning... (${capturedCount})`;
          }

          triggerNext();
          await new Promise(r => setTimeout(r, CONFIG.SLIDE_TIME));
      }

      finish(btn, statusLabel);
  }

  async function finish(btn, statusLabel) {
      state.isRunning = false;
      const pages = Array.from(state.captured.values());

      if (pages.length === 0) {
          btn.innerText = "Start Rip";
          statusLabel.innerText = "No pages saved.";
          return;
      }

      btn.innerText = "Zipping...";
      statusLabel.innerText = "Generating ZIP...";

      pages.sort((a, b) => a.pageNum - b.pageNum);

      const zip = new JSZip();
      pages.forEach((p, i) => {
          const name = `${String(i + 1).padStart(3, '0')}.jpg`;
          zip.file(name, p.blob);
      });

      const filename = getFilename(); 
      
      try {
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, filename);
          statusLabel.innerText = "Done!";
      } catch (e) {
          statusLabel.innerText = "Error: " + e;
      }

      setTimeout(() => {
          btn.innerText = "Start Rip";
          statusLabel.innerText = "Ready.";
      }, 4000);
  }

  // --- Init ---
  setInterval(() => {
      if (!document.getElementById('mangaup-ui')) createUI();
  }, 1000);

})();
