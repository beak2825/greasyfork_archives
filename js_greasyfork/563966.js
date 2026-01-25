// ==UserScript==
// @name         Find random games from KoGaMa
// @namespace    https://kogama.com/
// @version      13.2
// @description  Find random games in KoGaMa
// @match        https://www.kogama.com/*
// @grant        none
// @license      unlicense
// @author       Haden
// @downloadURL https://update.greasyfork.org/scripts/563966/Find%20random%20games%20from%20KoGaMa.user.js
// @updateURL https://update.greasyfork.org/scripts/563966/Find%20random%20games%20from%20KoGaMa.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY_FOUND = "kgm_found_ids_v10";
  const STORAGE_KEY_CONFIG = "kgm_scanner_config_v10";

  const PRIMARY_COLOR = "#404040";
  const DANGER_COLOR = "#7f1d1d";
  const BG_COLOR = "#0a0a0a";
  const PANEL_BG = "#171717";
  const TEXT_COLOR = "#d4d4d4";
  const BORDER_COLOR = "#262626";
  const DEFAULT_PANEL_WIDTH = 600;

  let running = false;
  let stopFlag = false;
  let isPanelVisible = false;

  let found = JSON.parse(localStorage.getItem(STORAGE_KEY_FOUND) || "[]");

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function saveConfig() {
    const config = {
      mode: panel.querySelector("#mode").value,
      maxId: +panel.querySelector("#max").value,
      count: +panel.querySelector("#count").value,
      delay: +panel.querySelector("#delay").value,
      resultsPaneWidth: panel.querySelector("#results-pane").style.width
    };
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }

  function loadConfig() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_CONFIG) || "{}");
    if (saved.mode) panel.querySelector("#mode").value = saved.mode;
    if (saved.maxId) panel.querySelector("#max").value = saved.maxId;
    if (saved.count !== undefined) panel.querySelector("#count").value = saved.count;
    if (saved.delay !== undefined) panel.querySelector("#delay").value = saved.delay;
    if (saved.resultsPaneWidth) panel.querySelector("#results-pane").style.width = saved.resultsPaneWidth;
  }

  function formatDate(rawDate) {
    if (!rawDate) return "unknown date";
    try {
      const d = new Date(rawDate);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return rawDate;
    }
  }

  function fetchMetadataViaIframe(id) {
    return new Promise((resolve) => {
      const url = `/games/play/${id}/`;
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);

      let attempts = 0;
      const maxAttempts = 50;

      const check = setInterval(() => {
        attempts++;
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;
          if (doc) {
            const titleEl = doc.querySelector('h1.game-title');
            const dateMeta = doc.querySelector('meta[itemprop="datePublished"]');

            if (titleEl && titleEl.textContent.trim() !== "" || attempts >= maxAttempts) {
              const data = {
                id: id,
                title: titleEl ? titleEl.textContent.trim() : "Untitled Game",
                date: dateMeta ? dateMeta.getAttribute('content') : null
              };
              clearInterval(check);
              document.body.removeChild(iframe);
              resolve(data);
            }
          }
        } catch (e) {
          clearInterval(check);
          document.body.removeChild(iframe);
          resolve({ id, title: "Untitled Game", date: null });
        }
      }, 100);
    });
  }

  async function validateID(id) {
    try {
      const res = await fetch(`/games/play/${id}/`, { method: "HEAD" });

      if (res.ok && !found.some(g => g.id === id)) {
        const gameData = await fetchMetadataViaIframe(id);
        found.push(gameData);
        persistFound();
        addLog(gameData);
        updateCounter();
      }
    } catch (e) {}
  }

  async function scan(cfg) {
    running = true;
    stopFlag = false;

    let i = 0;
    const isInfinite = cfg.count <= 0;

    while (isInfinite || i < cfg.count) {
      if (stopFlag) break;

      const id = cfg.mode === "sequential"
          ? cfg.startId + i
          : Math.floor(Math.random() * (cfg.maxId - cfg.startId + 1)) + cfg.startId;

      counter.textContent = `(${id}) ` + found.length;

      await validateID(id);
      if (cfg.delay > 0) await sleep(cfg.delay);
      i++;
    }

    running = false;
    btn.textContent = "start";
    btn.style.background = PRIMARY_COLOR;
    counter.textContent = found.length;
  }

  // --- UI COMPONENTS ---

  const panel = document.createElement("div");
  panel.id = "kgm-scanner-v10";
  panel.style.cssText = `
    position: fixed;
    top: 40px;
    max-height: 80vh;
    right: 40px;
    width: ${DEFAULT_PANEL_WIDTH}px;
    min-width: 450px;
    min-height: 350px;
    background: ${BG_COLOR};
    color: ${TEXT_COLOR};
    border: 1px solid ${BORDER_COLOR};
    border-radius: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 13px;
    z-index: 999999;
    display: none;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);
    user-select: none;
    overflow: hidden;
    resize: both;
  `;

  panel.innerHTML = `
    <div id="drag-handle" style="padding: 10px 16px; background: ${PANEL_BG}; border-bottom: 1px solid ${BORDER_COLOR}; display: flex; justify-content: space-between; align-items: center; height: 38px; cursor: default;">
      <span style="font-size: 13px; font-weight: 500; color: #737373;">random game generator v11.0</span>
      <button id="close-btn" style="background: none; border: none; color: #525252; cursor: pointer; font-size: 22px; padding: 0 5px; line-height: 1;">&times;</button>
    </div>

    <div style="display: flex; height: calc(100% - 38px); position: relative;">
      <div id="config-pane" style="flex: 1; min-width: 200px; padding: 20px; display: flex; flex-direction: column; gap: 14px; overflow: hidden;">
        <div style="font-size: 11px; color: #525252; font-weight: 600; text-transform: lowercase; margin-bottom: -5px;">configuration</div>

        <div class="row">
          <label>search mode</label>
          <select id="mode" class="ui-input">
            <option value="sequential">sequential</option>
            <option value="random">random</option>
          </select>
        </div>

        <div class="row">
          <label>id range</label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input id="start" class="ui-input" type="number" value="1" />
            <span style="color: #404040;">—</span>
            <input id="max" class="ui-input" type="number" value="11120000" />
          </div>
        </div>

        <div class="row">
          <label>amount (0 = ∞)</label>
          <input id="count" class="ui-input" type="number" min="0" value="0" />
        </div>

        <div class="row">
          <label>delay (ms)</label>
          <input id="delay" class="ui-input" type="number" min="0" value="1" />
        </div>

        <div style="display: flex; gap: 8px; margin-top: auto;">
          <button id="btn" class="ui-btn primary">start</button>
          <button id="clear" class="ui-btn secondary">clear</button>
        </div>
      </div>

      <div id="v-resizer" class="v-resizer" style="width: 2px; cursor: col-resize; background: ${BORDER_COLOR}; z-index: 10;"></div>

      <div id="results-pane" style="width: 280px; min-width: 200px; background: #000000; display: flex; flex-direction: column; overflow: hidden;">
        <div style="padding: 10px 16px; background: ${PANEL_BG}; border-bottom: 1px solid ${BORDER_COLOR}; display: flex; flex-direction: column; gap: 8px;">
           <div style="display: flex; justify-content: space-between; align-items: center;">
             <span style="font-size: 11px; color: #525252; font-weight: 600; text-transform: lowercase;">results</span>
             <span id="counter" style="color: #a3a3a3; font-weight: 700; font-size: 14px;">0</span>
           </div>
           <input id="log-filter" class="ui-input" placeholder="filter by date..." style="height: 24px; font-size: 10px; padding: 0 8px; background: #050505; border-color: #262626;" />
        </div>
        <div id="log" style="flex: 1; overflow-y: auto; font-family: inherit; position: relative;"></div>
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #kgm-scanner-v10 * { box-sizing: border-box; }
    .row { display: flex; flex-direction: column; gap: 4px; }
    .row label { font-size: 10px; color: #737373; font-weight: 500; text-transform: lowercase; }
    .ui-input {
      background: #171717; border: 1px solid #404040; border-radius: 6px; padding: 6px 10px;
      color: ${TEXT_COLOR}; font-size: 13px; width: 100%; outline: none; transition: border-color 0.2s; font-family: inherit;
    }
    .ui-input:focus { border-color: #737373; }
    .v-resizer:hover { background: #525252 !important; width: 4px !important; }
    input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
    .ui-btn {
      border: none; border-radius: 6px; padding: 10px; font-weight: 600;
      cursor: pointer; font-size: 12px; transition: all 0.2s; font-family: inherit; text-transform: lowercase;
    }
    .ui-btn.primary { background: ${PRIMARY_COLOR}; color: #fff; flex: 1; }
    .ui-btn.primary:hover { background: #525252; }
    .ui-btn.secondary { background: #262626; color: #a3a3a3; }
    .ui-btn.secondary:hover { color: ${DANGER_COLOR}; background: #171717; }
    .log-entry {
      display: block; padding: 10px 16px; color: #737373; text-decoration: none;
      border-bottom: 1px solid #171717; font-size: 12px; transition: all 0.2s;
    }
    .log-entry:hover { background: #171717; color: #ffffff; }
    .empty-log {
      display: flex; align-items: center; justify-content: center; height: 100%;
      color: #404040; font-size: 11px; text-transform: lowercase; padding: 20px; text-align: center;
    }
    #log::-webkit-scrollbar { width: 4px; }
    #log::-webkit-scrollbar-thumb { background: #404040; border-radius: 10px; }
    #kgm-scanner-v10::-webkit-resizer { background: linear-gradient(135deg, transparent 50%, #404040 50%); width: 12px; height: 12px; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(panel);

  const logBox = panel.querySelector("#log");
  const logFilter = panel.querySelector("#log-filter");
  const counter = panel.querySelector("#counter");
  const btn = panel.querySelector("#btn");
  const closeBtn = panel.querySelector("#close-btn");

  loadConfig();

  function togglePanel(force) {
    isPanelVisible = force !== undefined ? force : !isPanelVisible;
    panel.style.display = isPanelVisible ? "block" : "none";
  }

  panel.querySelectorAll('.ui-input').forEach(input => {
    if (input.id !== 'start' && input.id !== 'log-filter') {
      input.addEventListener('input', saveConfig);
    }
  });

  logFilter.addEventListener('input', () => refreshLogs());
  closeBtn.onclick = () => togglePanel(false);

  function renderGameItem(game) {
    const a = document.createElement("a");
    a.href = `/games/play/${game.id}/`;
    a.target = "_blank";
    a.className = "log-entry";
    a.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-weight: 500;">${game.title}</div>
        <span style="font-size: 9px; color: #404040; white-space: nowrap;">${formatDate(game.date)}</span>
      </div>
    `;
    return a;
  }

  function addLog(game) {
    const filterText = logFilter.value.toLowerCase();
    if (filterText && !formatDate(game.date).toLowerCase().includes(filterText)) return;
    const emptyMsg = logBox.querySelector(".empty-log");
    if (emptyMsg) emptyMsg.remove();
    logBox.prepend(renderGameItem(game));
  }

  function refreshLogs() {
    logBox.innerHTML = "";
    const filterText = logFilter.value.toLowerCase();
    const filtered = found.filter(g => formatDate(g.date).toLowerCase().includes(filterText));
    if (filtered.length === 0) {
        logBox.innerHTML = `<div class="empty-log">no games found</div>`;
    } else {
        filtered.slice(-100).reverse().forEach(g => logBox.appendChild(renderGameItem(g)));
    }
  }

  function updateCounter() { counter.textContent = found.length; }
  function persistFound() { localStorage.setItem(STORAGE_KEY_FOUND, JSON.stringify(found)); }

  refreshLogs();
  updateCounter();

  btn.onclick = () => {
    if (running) { stopFlag = true; btn.textContent = "waiting..."; return; }
    const cfg = {
      mode: panel.querySelector("#mode").value,
      startId: +panel.querySelector("#start").value,
      maxId: +panel.querySelector("#max").value,
      count: +panel.querySelector("#count").value,
      delay: +panel.querySelector("#delay").value
    };
    btn.textContent = "stop";
    btn.style.background = DANGER_COLOR;
    scan(cfg).finally(() => {
        btn.style.background = PRIMARY_COLOR;
        btn.textContent = "start";
    });
  };

  panel.querySelector("#clear").onclick = () => {
    if (!confirm("Clear detected games history?")) return;
    found = []; persistFound(); refreshLogs(); updateCounter();
  };

  // Splitter logic
  (() => {
    const resizer = panel.querySelector("#v-resizer");
    const resultsPane = panel.querySelector("#results-pane");
    let isResizing = false;
    resizer.onmousedown = (e) => { isResizing = true; document.body.style.cursor = 'col-resize'; e.preventDefault(); };
    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      const rect = panel.getBoundingClientRect();
      const offsetRight = rect.right - e.clientX;
      if (offsetRight > 150 && offsetRight < rect.width - 150) resultsPane.style.width = offsetRight + "px";
    });
    document.addEventListener("mouseup", () => { if (isResizing) { isResizing = false; document.body.style.cursor = ''; saveConfig(); } });
  })();

  // Panel drag logic
  (() => {
    const d = panel.querySelector("#drag-handle");
    let x = 0, y = 0, drag = false;
    d.onmousedown = e => { if(e.target === closeBtn) return; drag = true; x = e.clientX - panel.offsetLeft; y = e.clientY - panel.offsetTop; };
    document.addEventListener("mousemove", e => { if (!drag) return; panel.style.left = e.clientX - x + "px"; panel.style.top = e.clientY - y + "px"; panel.style.right = "auto"; });
    document.addEventListener("mouseup", () => drag = false);
  })();

  // Robust Key Listener (Capture Phase)
  window.addEventListener('keydown', e => {
    if (e.key === "F9") {
      e.preventDefault();
      e.stopImmediatePropagation();
      togglePanel();
    }
  }, true);

  console.log("random game generator v11.0 loaded. Hotkey: F9");
})();