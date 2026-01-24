// ==UserScript==
// @name         UpsBounty
// @namespace    https://upsilon-cloud.uk/
// @version      1.0
// @description  Create a button to auto assign bounties.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/bounties.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/563801/UpsBounty.user.js
// @updateURL https://update.greasyfork.org/scripts/563801/UpsBounty.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const App = {
        // ---- constants / keys ----
        storeKeys: {
            factionId: "bh_faction_id",
            apiKey: "bh_api_key",
            lastActiveMinutes: "bh_last_active_minutes",
            rules: "bh_rules",
            stats: "bh_stats",
            detectionActive: "bh_detection_active",
        },

        // ---- runtime state ----
        state: {
            initialized: false,
        },

        // ---- cached DOM ----
        el: {
            root: null,

            refreshSummaryBtn: null,

            rulesRows: null,
            statsTableBody: null,
            statsInput: null,

            factionId: null,
            apiKey: null,
            lastActiveValue: null,
            lastActiveUnit: null,
            detectionActive: null,
            detectionLabel: null,

            targetCards: null,
        },

        // ---- utilities ----
        utils: {
            waitForElement(selector) {
                return new Promise((resolve) => {
                    const t = setInterval(() => {
                        const el = document.querySelector(selector);
                        if (el) {
                            clearInterval(t);
                            resolve(el);
                        }
                    }, 300);
                });
            },

            parseNumberLoose(input) {
                const cleaned = String(input || "")
                .replace(/\$/g, "")
                .replace(/\s/g, "")
                .replace(/,/g, "")
                .trim();
                if (!cleaned) return null;
                const n = Number(cleaned);
                return Number.isFinite(n) ? Math.floor(n) : null;
            },

            formatNumber(n) {
                if (n === null || n === undefined || !Number.isFinite(n)) return "";
                return n.toLocaleString("en-US");
            },

            parseLines(text) {
                return String(text || "")
                    .split(/\r?\n/)
                    .map((l) => l.trim())
                    .filter(Boolean);
            },

            unitToMinutes(unit) {
                if (unit === "hours") return 60;
                if (unit === "days") return 1440;
                return 1;
            },

            attachDnDRow(row, onDragEnd) {
                row.addEventListener("dragstart", (e) => {
                    row.classList.add("dragging");
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", "drag");
                });

                row.addEventListener("dragend", () => {
                    row.classList.remove("dragging");
                    if (typeof onDragEnd === "function") onDragEnd();
                });
            },

            attachDnDContainer(containerEl, rowSelector) {
                containerEl.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    const dragging =
                          containerEl.querySelector(`${rowSelector}.dragging`) ||
                          document.querySelector(`${rowSelector}.dragging`);
                    if (!dragging || !dragging.matches(rowSelector)) return;

                    const after = App.utils.getDragAfterElement(containerEl, rowSelector, e.clientY);
                    if (after == null) containerEl.appendChild(dragging);
                    else containerEl.insertBefore(dragging, after);
                });
            },

            getDragAfterElement(container, rowSelector, y) {
                const els = [...container.querySelectorAll(`${rowSelector}:not(.dragging)`)];

                let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
                for (const el of els) {
                    const box = el.getBoundingClientRect();
                    const offset = y - (box.top + box.height / 2);
                    if (offset < 0 && offset > closest.offset) closest = { offset, element: el };
                }
                return closest.element;
            },

            attachCommaNumberBehavior(inputEl) {
                inputEl.addEventListener("focus", () => {
                    const v = inputEl.dataset.value;
                    if (v !== undefined && v !== "") inputEl.value = String(v);
                });

                inputEl.addEventListener("blur", () => {
                    const n = App.utils.parseNumberLoose(inputEl.value);
                    if (n === null) {
                        inputEl.dataset.value = "";
                        inputEl.value = "";
                        return;
                    }
                    inputEl.dataset.value = String(n);
                    inputEl.value = App.utils.formatNumber(n);
                });

                // init
                if (inputEl.value) {
                    const n = App.utils.parseNumberLoose(inputEl.value);
                    if (n !== null) {
                        inputEl.dataset.value = String(n);
                        inputEl.value = App.utils.formatNumber(n);
                    }
                }
            },
        },

        // ---- storage wrapper ----
        storage: {
            get(key, fallback = "") {
                return GM_getValue(key, fallback);
            },
            set(key, value) {
                GM_setValue(key, value);
            },

            getJSON(key, fallback) {
                const raw = GM_getValue(key, "");
                if (!raw) return fallback;
                try {
                    return JSON.parse(raw);
                } catch {
                    return fallback;
                }
            },
            setJSON(key, obj) {
                GM_setValue(key, JSON.stringify(obj));
            },
        },

        // ---- UI base (mount, styles, tabs) ----
        ui: {
            mount(afterEl) {
                if (document.getElementById("torn-bounty-helper")) return;

                const root = document.createElement("div");
                root.id = "torn-bounty-helper";
                root.innerHTML = App.ui.template();
                afterEl.insertAdjacentElement("afterend", root);

                App.ui.injectStyles();
                App.el.root = root;
            },

            template() {
                return `
          <div class="bh-header">
            <div class="bh-title">Bounty Helper</div>
          </div>

          <div class="bh-tabs">
            <button class="bh-tab active" data-target="summary">Summary</button>
            <button class="bh-tab" data-target="stats">Stats</button>
            <button class="bh-tab" data-target="rules">Rules</button>
            <button class="bh-tab" data-target="settings">Settings</button>
          </div>

          <div class="bh-content active" id="bh-summary">
            <div class="bh-card">
              <div class="bh-card-title">Targets</div>
              <div class="bh-muted">Click a card to open the bounty page.</div>
              <div class="bh-actions" style="margin-top:10px;">
  <button class="bh-secondary" id="bh-refresh-summary">Refresh</button>
</div>
              <div class="bh-cards" id="bh-target-cards"></div>
            </div>
          </div>

          <div class="bh-content" id="bh-stats">
            <div class="bh-card">
              <div class="bh-card-title">Paste Player Stats</div>
              <div class="bh-muted">
                Formats (TAB):
                <br/><br/>
                <code>username[userid]		stats</code>
                <br/><br/>
                <code>username		userid		stats</code>
              </div>

              <textarea class="bh-textarea" id="bh-stats-input"
                placeholder="SomePlayer[123456]	3000000&#10;SomePlayer	123456	3000000"></textarea>

              <div class="bh-actions">
                <button class="bh-primary" id="bh-add-player-stats">Add to Table</button>
                <button class="bh-secondary" id="bh-clear-input">Clear Input</button>
              </div>

              <div class="bh-sep"></div>

              <div class="bh-table-actions">
                <div class="bh-card-title">Stats Table</div>
                <button class="bh-secondary" id="bh-clear-table">Clear All</button>
              </div>

              <table class="bh-table" id="bh-stats-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>User ID</th>
                    <th>Total Stats</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>

          <div class="bh-content" id="bh-rules">
            <div class="bh-card">
              <div class="bh-card-title">Rules List</div>
              <div class="bh-sep"></div>
              <div class="bh-actions">
                <button class="bh-secondary" id="bh-add-empty-rule">+ Add empty rule</button>
              </div>
              <div class="bh-sep"></div>
              <div class="bh-rows" id="bh-rules-rows"></div>
            </div>
          </div>

          <div class="bh-content" id="bh-settings">
            <div class="bh-card">
              <div class="bh-card-title">Settings</div>
              <div class="bh-muted">Saved locally in your browser (GM storage).</div>
<div class="bh-sep"></div>

<div class="bh-card-title">Bounty Detection Active</div>
<div class="bh-muted">Enable/disable automatic bounty target detection.</div>

<div class="bh-inline" style="justify-content:space-between;">
  <div class="bh-muted" id="bh-detection-label">Off</div>

  <label class="bh-switch" title="Toggle bounty detection">
    <input type="checkbox" id="bh-detection-active" />
    <span class="bh-slider"></span>
  </label>
</div>
              <div class="bh-sep"></div>

              <div class="bh-card-title">Faction ID</div>
              <div class="bh-inline">
                <input class="bh-input" id="bh-faction-id" placeholder="Faction ID (e.g. 12345)" />
                <button class="bh-primary" id="bh-save-faction">Save</button>
              </div>

              <div class="bh-sep"></div>

              <div class="bh-card-title">API Key (public)</div>
              <div class="bh-inline">
                <input class="bh-input" id="bh-api-key" type="password" placeholder="Your Torn API key" />
                <button class="bh-primary" id="bh-save-api">Save</button>
              </div>

              <div class="bh-sep"></div>

              <div class="bh-card-title">Last Active Trigger</div>
              <div class="bh-muted">Select bounty targets only if last action is within this duration.</div>

              <div class="bh-inline">
                <input class="bh-input" id="bh-last-active-value" type="number" min="1" step="1" placeholder="5" style="max-width:140px;" />
                <select class="bh-input" id="bh-last-active-unit" style="max-width:180px;">
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
                <button class="bh-primary" id="bh-save-last-active">Save</button>
              </div>
            </div>
          </div>
        `;
            },

            cacheElements() {
                const root = App.el.root;

                App.el.refreshSummaryBtn = root.querySelector("#bh-refresh-summary");

                App.el.rulesRows = root.querySelector("#bh-rules-rows");
                App.el.statsInput = root.querySelector("#bh-stats-input");
                App.el.statsTableBody = root.querySelector("#bh-stats-table tbody");

                App.el.factionId = root.querySelector("#bh-faction-id");
                App.el.apiKey = root.querySelector("#bh-api-key");
                App.el.lastActiveValue = root.querySelector("#bh-last-active-value");
                App.el.lastActiveUnit = root.querySelector("#bh-last-active-unit");
                App.el.detectionActive = root.querySelector("#bh-detection-active");
                App.el.detectionLabel = root.querySelector("#bh-detection-label");

                App.el.targetCards = root.querySelector("#bh-target-cards");
            },

            bindTabs() {
                const root = App.el.root;
                root.querySelectorAll(".bh-tab").forEach((tab) => {
                    tab.addEventListener("click", () => {
                        root.querySelectorAll(".bh-tab").forEach((t) => t.classList.remove("active"));
                        root.querySelectorAll(".bh-content").forEach((c) => c.classList.remove("active"));
                        tab.classList.add("active");
                        root.querySelector(`#bh-${tab.dataset.target}`).classList.add("active");
                    });
                });
            },

            injectStyles() {
                // Tu peux remettre ton CSS tel quel ici
                const style = document.createElement("style");
                style.textContent = `#torn-bounty-helper{
        margin-top:10px;
        border:1px solid #333;
        background:#1b1b1b;
        border-radius:8px;
        padding:12px;
      }

      .bh-header{ margin-bottom:10px; }
      .bh-title{ font-size:18px; font-weight:700; color:#fff; }
      .bh-subtitle{ font-size:12px; color:#aaa; margin-top:2px; }

      .bh-tabs{ display:flex; gap:6px; margin:10px 0 12px; }
      .bh-tab{
        background:#2a2a2a; border:1px solid #444; color:#ccc;
        padding:6px 12px; cursor:pointer; border-radius:6px;
      }
      .bh-tab.active{ background:#444; color:#fff; }

      .bh-content{ display:none; }
      .bh-content.active{ display:block; }

      .bh-card{
        border:1px solid #2f2f2f;
        background:#202020;
        border-radius:8px;
        padding:12px;
      }
      .bh-card-title{ color:#fff; font-weight:700; margin-bottom:6px; }
      .bh-muted{ color:#aaa; font-size:12px; }
      .bh-muted code{ background:#141414; border:1px solid #333; padding:1px 5px; border-radius:6px; color:#ddd; }

      .bh-sep{ height:1px; background:#333; margin:12px 0; }

      .bh-textarea{
        width:100%;
        min-height:110px;
        margin-top:8px;
        background:#121212;
        border:1px solid #3a3a3a;
        border-radius:8px;
        color:#ddd;
        padding:10px;
        resize:vertical;
        font-family: inherit;
      }

      .bh-actions{ display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
      .bh-primary, .bh-secondary{
        border-radius:8px; padding:7px 12px; cursor:pointer;
        border:1px solid #444;
      }
      .bh-primary{ background:#444; color:#fff; }
      .bh-primary:hover{ background:#555; }
      .bh-secondary{ background:#2a2a2a; color:#ccc; }
      .bh-secondary:hover{ background:#3a3a3a; color:#fff; }

      .bh-rows{
        margin-top:10px;
        display:flex;
        flex-direction:column;
        gap:8px;
        min-height:40px;
        padding:8px;
        border:1px dashed #3a3a3a;
        border-radius:8px;
        background:#171717;
      }

      .bh-row{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px;
  border:1px solid #2a2a2a;
  border-radius:10px;
  background:#1c1c1c;
  flex-wrap: wrap;
  justify-content: space-around;
}

      .bh-row.dragging{ opacity:.5; }

      .bh-grip{
        cursor:grab;
        color:#888;
        user-select:none;
        width:18px;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .bh-field{
  display:flex;
  flex-direction:column;
  gap:6px;
  min-width:0;
}
      .bh-label{ font-size:11px; color:#aaa; }

      .bh-input{
        width:95%;
        background:#121212;
        border:1px solid #3a3a3a;
        border-radius:8px;
        color:#ddd;
        padding:8px 10px;
        outline:none;
      }
      .bh-input:focus{ border-color:#555; }

      .bh-del{
  width:28px;
  height:28px;
  flex:0 0 28px;
  display:flex;
  align-items:center;
  justify-content:center;

  background:transparent;
  border:1px solid #3a3a3a;
  color:#9a9a9a;
  border-radius:8px;
  cursor:pointer;
  padding:0;
  line-height:1;
}

.bh-del:hover{
  border-color:#5a2a2a;
  color:#fff;
  background:rgba(220, 60, 60, 0.18);
}

.bh-table-actions{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:8px;
}

.bh-table{
  width:100%;
  border-collapse:collapse;
  background:#171717;
  border:1px solid #333;
  border-radius:8px;
  overflow:hidden;
}

.bh-table th{
  background:#222;
  color:#ddd;
  text-align:left;
  padding:8px 10px;
  font-size:12px;
  border-bottom:1px solid #333;
}

.bh-table td{
  padding:8px 10px;
  border-bottom:1px solid #2a2a2a;
  color:#ccc;
}

.bh-table tr:last-child td{
  border-bottom:none;
}

.bh-table td:last-child{
  width:40px;
  text-align:center;
}
.bh-inline{
  display:flex;
  align-items:center;
  gap:10px;
  margin-top:10px;
}

.bh-inline .bh-input{
  flex:1 1 auto;
}

.bh-cards{
  margin-top:10px;
  display:flex;
  flex-direction:column;
  gap:10px;
}

.bh-card-item{
  border:1px solid #2a2a2a;
  background:#1c1c1c;
  border-radius:12px;
  padding:10px 12px;
  cursor:pointer;
  transition: border-color 120ms ease, background 120ms ease, transform 80ms ease;
}

.bh-card-item:hover{
  border-color:#3a3a3a;
  background:#202020;
}

.bh-card-item:active{
  transform: translateY(1px);
}

.bh-card-line1{
  color:#fff;
  font-weight:700;
  font-size:13px;
  display:flex;
  justify-content:space-between;
  gap:10px;
}

.bh-card-line1 .bh-card-right{
  color:#bbb;
  font-weight:600;
  font-size:12px;
  white-space:nowrap;
}

.bh-card-line2{
  margin-top:6px;
  color:#bdbdbd;
  font-size:12px;
  line-height:1.35;
}

.bh-chip{
  display:inline-block;
  padding:2px 8px;
  border-radius:999px;
  border:1px solid #333;
  background:#151515;
  color:#cfcfcf;
  font-size:11px;
  margin-left:6px;
}

.bh-switch{
  position: relative;
  display: inline-block;
  width: 46px;
  height: 26px;
  flex: 0 0 auto;
}

.bh-switch input{
  opacity: 0;
  width: 0;
  height: 0;
}

.bh-slider{
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 999px;
  transition: 120ms ease;
}

.bh-slider:before{
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  top: 50%;
  transform: translateY(-50%);
  background: #cfcfcf;
  border-radius: 999px;
  transition: 120ms ease;
}

.bh-switch input:checked + .bh-slider{
  background: #444;
  border-color: #555;
}

.bh-switch input:checked + .bh-slider:before{
  transform: translateY(-50%) translateX(20px);
  background: #fff;
}`;
                document.head.appendChild(style);
            },
        },

        // ---- Rules module ----
        rules: {
            init() {
                App.utils.attachDnDContainer(App.el.rulesRows, ".bh-rule-row");

                const data = App.storage.getJSON(App.storeKeys.rules, null);
                if (!data || !Array.isArray(data) || data.length === 0) {
                    const defaults = [
                        { minStats: 0, maxStats: 199999, bountyValue: 100000 },
                        { minStats: 200000, maxStats: 7999999, bountyValue: 150000 },
                        { minStats: 800000, maxStats: 24999999, bountyValue: 250000 },
                        { minStats: 2500000, maxStats: 99999999, bountyValue: 350000 },
                        { minStats: 100000000, maxStats: null, bountyValue: 450000 },
                    ];
                    App.storage.setJSON(App.storeKeys.rules, defaults);
                }
                App.rules.render();

                App.el.root.querySelector("#bh-add-empty-rule").addEventListener("click", () => {
                    App.el.rulesRows.appendChild(App.rules.makeRow({}, App.rules.saveFromDOM));
                    App.rules.saveFromDOM();
                });
            },

            getRowData(row) {
                const inputs = row.querySelectorAll("input.bh-num");
                const minEl = inputs[0];
                const maxEl = inputs[1];
                const bountyEl = inputs[2];

                const minStats = App.utils.parseNumberLoose(minEl?.dataset.value ?? minEl?.value);
                const maxStats = App.utils.parseNumberLoose(maxEl?.dataset.value ?? maxEl?.value);
                const bountyValue = App.utils.parseNumberLoose(bountyEl?.dataset.value ?? bountyEl?.value);

                return {
                    minStats: minStats ?? 0,
                    maxStats: maxStats ?? null,
                    bountyValue: bountyValue ?? 0,
                };
            },

            saveFromDOM() {
                const rows = [...App.el.rulesRows.querySelectorAll(".bh-rule-row")];
                const data = rows.map(App.rules.getRowData);
                App.storage.setJSON(App.storeKeys.rules, data);
            },

            render() {
                const data = App.storage.getJSON(App.storeKeys.rules, []);
                App.el.rulesRows.innerHTML = "";
                for (const rule of data) {
                    App.el.rulesRows.appendChild(App.rules.makeRow(rule, App.rules.saveFromDOM));
                }
            },

            makeRow({ minStats = null, maxStats = null, bountyValue = null } = {}, onChange) {
                const row = document.createElement("div");
                row.className = "bh-row bh-rule-row";
                row.draggable = true;

                row.innerHTML = `
          <span class="bh-grip" title="Drag">⋮⋮</span>

          <div class="bh-field">
            <div class="bh-label">Min Stats</div>
            <input class="bh-input bh-num" placeholder="0" />
          </div>

          <div class="bh-field">
            <div class="bh-label">Max Stats (∞ if empty)</div>
            <input class="bh-input bh-num" placeholder="∞" />
          </div>

          <div class="bh-field">
            <div class="bh-label">Bounty Value</div>
            <input class="bh-input bh-num" placeholder="100,000" />
          </div>

          <button class="bh-del" title="Delete" aria-label="Delete">✕</button>
        `;

                const [minEl, maxEl, bountyEl] = row.querySelectorAll("input.bh-num");
                if (minStats !== null) minEl.value = App.utils.formatNumber(minStats);
                if (maxStats !== null) maxEl.value = App.utils.formatNumber(maxStats);
                if (bountyValue !== null) bountyEl.value = App.utils.formatNumber(bountyValue);

                [minEl, maxEl, bountyEl].forEach((el) => {
                    App.utils.attachCommaNumberBehavior(el);
                    el.addEventListener("blur", onChange);
                    el.addEventListener("change", onChange);
                });

                row.querySelector(".bh-del").addEventListener("click", () => {
                    row.remove();
                    onChange();
                });

                App.utils.attachDnDRow(row, onChange);
                return row;
            },
        },

        // ---- Stats module ----
        stats: {
            state: [],

            init() {
                App.stats.load();
                App.stats.render();

                App.el.root.querySelector("#bh-add-player-stats").addEventListener("click", () => {
                    const lines = App.utils.parseLines(App.el.statsInput.value);

                    for (const line of lines) {
                        const parsed = App.stats.parseStatLine(line);
                        if (parsed) App.stats.upsert(parsed); // add or replace by userId
                    }

                    App.el.statsInput.value = "";
                    App.stats.persist();
                    App.stats.render();
                });

                App.el.root.querySelector("#bh-clear-input").addEventListener("click", () => {
                    App.el.statsInput.value = "";
                });

                App.el.root.querySelector("#bh-clear-table").addEventListener("click", () => {
                    App.stats.state = [];
                    App.stats.persist();
                    App.stats.render();
                });
            },

            load() {
                const data = App.storage.getJSON(App.storeKeys.stats, []);
                App.stats.state = Array.isArray(data) ? data : [];
            },

            persist() {
                App.storage.setJSON(App.storeKeys.stats, App.stats.state);
            },

            upsert({ username, userId, stats }) {
                const id = String(userId).trim();
                if (!id) return;

                const idx = App.stats.state.findIndex((x) => String(x.userId) === id);
                const entry = { username: String(username).trim(), userId: id, stats: Number(stats) };

                if (idx >= 0) App.stats.state[idx] = entry;
                else App.stats.state.push(entry);
            },

            removeByUserId(userId) {
                const id = String(userId).trim();
                App.stats.state = App.stats.state.filter((x) => String(x.userId) !== id);
                App.stats.persist();
                App.stats.render();
            },

            render() {
                const tbody = App.el.statsTableBody;
                tbody.innerHTML = "";

                for (const row of App.stats.state) {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
        <td>${row.username}</td>
        <td>${row.userId}</td>
        <td>${App.utils.formatNumber(row.stats)}</td>
        <td><button class="bh-del" title="Delete">✕</button></td>
      `;

                    tr.querySelector(".bh-del").addEventListener("click", () => {
                        App.stats.removeByUserId(row.userId);
                    });

                    tbody.appendChild(tr);
                }
            },

            parseStatLine(line) {
                const parts = line.split("\t").map((p) => p.trim()).filter(Boolean);
                if (parts.length < 2) return null;

                let username = "";
                let userId = "";
                let stats = null;

                const bracketMatch = parts[0].match(/^(.+)\[(\d+)\]$/);
                if (bracketMatch && parts.length >= 2) {
                    username = bracketMatch[1].trim();
                    userId = bracketMatch[2].trim();
                    stats = App.utils.parseNumberLoose(parts[1]);
                }
                else if (parts.length >= 3) {
                    username = parts[0];
                    userId = parts[1];
                    stats = App.utils.parseNumberLoose(parts[2]);
                }

                if (!username || !userId || stats === null) return null;
                return { username, userId, stats };
            },
        },

        // ---- Settings module ----
        settings: {
            init() {
                App.el.factionId.value = App.storage.get(App.storeKeys.factionId, "");
                App.el.apiKey.value = App.storage.get(App.storeKeys.apiKey, "");

                const saved = App.storage.get(App.storeKeys.detectionActive, "true");
                App.el.detectionActive.checked = (saved !== "false");
                App.settings.updateDetectionLabel();

                App.el.detectionActive.addEventListener("change", () => {
                    App.storage.set(
                        App.storeKeys.detectionActive,
                        App.el.detectionActive.checked ? "true" : "false"
                    );
                    App.settings.updateDetectionLabel();
                });

                const savedMinutes = App.utils.parseNumberLoose(App.storage.get(App.storeKeys.lastActiveMinutes, ""));
                App.settings.setLastActiveUI(savedMinutes);

                App.el.root.querySelector("#bh-save-faction").addEventListener("click", () => {
                    App.storage.set(App.storeKeys.factionId, (App.el.factionId.value || "").trim());
                });

                App.el.root.querySelector("#bh-save-api").addEventListener("click", () => {
                    App.storage.set(App.storeKeys.apiKey, (App.el.apiKey.value || "").trim());
                });

                App.el.root.querySelector("#bh-save-last-active").addEventListener("click", () => {
                    const v = Math.max(1, Number(App.el.lastActiveValue.value || 0));
                    const minutes = Math.floor(v * App.utils.unitToMinutes(App.el.lastActiveUnit.value));
                    App.storage.set(App.storeKeys.lastActiveMinutes, String(minutes));
                });

                App.el.lastActiveValue.addEventListener("input", () => App.settings.previewFromUI());
                App.el.lastActiveUnit.addEventListener("change", () => App.settings.previewFromUI());
                App.settings.previewFromUI();
            },

            setLastActiveUI(savedMinutes) {
                if (Number.isFinite(savedMinutes) && savedMinutes > 0) {
                    if (savedMinutes % 1440 === 0) {
                        App.el.lastActiveUnit.value = "days";
                        App.el.lastActiveValue.value = String(savedMinutes / 1440);
                    } else if (savedMinutes % 60 === 0) {
                        App.el.lastActiveUnit.value = "hours";
                        App.el.lastActiveValue.value = String(savedMinutes / 60);
                    } else {
                        App.el.lastActiveUnit.value = "minutes";
                        App.el.lastActiveValue.value = String(savedMinutes);
                    }
                } else {
                    App.el.lastActiveUnit.value = "minutes";
                    App.el.lastActiveValue.value = "5";
                }
            },

            updateDetectionLabel() {
                if (!App.el.detectionLabel || !App.el.detectionActive) return;
                App.el.detectionLabel.textContent = App.el.detectionActive.checked ? "On" : "Off";
            },

            previewFromUI() {
                const v = Math.max(1, Number(App.el.lastActiveValue.value || 0));
                const minutes = Math.floor(v * App.utils.unitToMinutes(App.el.lastActiveUnit.value));
            },
        },

        // ---- Summary module ----
        summary: {
            TARGET_URL(userId) {
                return `https://www.torn.com/bounties.php?p=add&XID=${encodeURIComponent(userId)}`;
            },

            formatDuration(seconds) {
                seconds = Math.max(0, Math.floor(seconds || 0));
                const d = Math.floor(seconds / 86400); seconds %= 86400;
                const h = Math.floor(seconds / 3600); seconds %= 3600;
                const m = Math.floor(seconds / 60);
                const s = seconds % 60;

                const parts = [];
                if (d) parts.push(`${d}d`);
                if (h) parts.push(`${h}h`);
                if (m) parts.push(`${m}m`);
                parts.push(`${s}s`);
                return parts.join(" ");
            },

            addTargetCard({ username, userId, outOfHospSeconds, lastActionSeconds, totalStats }) {
                const wrap = App.el.targetCards;
                if (!wrap) return;

                const card = document.createElement("div");
                card.className = "bh-card-item";
                card.dataset.userid = String(userId);

                const outText =
                      outOfHospSeconds <= 60
                ? `Out of hosp in ${outOfHospSeconds}s`
                : `Out of hosp in ${Math.ceil(outOfHospSeconds / 60)}m`;

                card.innerHTML = `
      <div class="bh-card-line1">
        <div>${username}[${userId}]</div>
        <div class="bh-card-right">${outText}</div>
      </div>
      <div class="bh-card-line2">
        Last Action: ${App.summary.formatDuration(lastActionSeconds)} | Stats: ${App.utils.formatNumber(totalStats)}
      </div>
    `;

                card.addEventListener("click", () => {
                    window.location.href = App.summary.TARGET_URL(userId);
                });

                wrap.appendChild(card);
            },

            clear() {
                if (App.el.targetCards) App.el.targetCards.innerHTML = "";
            },

            async refreshFromApi() {
                // respect du toggle
                if (!App.engine.isDetectionActive()) {
                    App.summary.clear();
                    // petit placeholder utile
                    App.summary.addTargetCard({
                        username: "Detection disabled",
                        userId: "—",
                        outOfHospSeconds: 0,
                        lastActionSeconds: 0,
                        totalStats: 0,
                    });
                    return;
                }

                App.summary.clear();

                // petit feedback visuel simple
                App.summary.addTargetCard({
                    username: "Loading...",
                    userId: "—",
                    outOfHospSeconds: 0,
                    lastActionSeconds: 0,
                    totalStats: 0,
                });

                try {
                    const data = await App.api.fetchFactionBasic();

                    const members = App.engine.normalizeFactionMembers(data);
                    const targets = App.engine.sortForSummary(App.engine.filterForSummary(members));

                    App.summary.clear();

                    if (!targets.length) {
                        App.summary.addTargetCard({
                            username: "No targets",
                            userId: "—",
                            outOfHospSeconds: 0,
                            lastActionSeconds: 0,
                            totalStats: 0,
                        });
                        return;
                    }


                    const savedStats = (Array.isArray(App.stats?.state) && App.stats.state.length) ? App.stats.state : App.storage.getJSON(App.storeKeys.stats, []);
                    const statsById = new Map(
                        (Array.isArray(savedStats) ? savedStats : []).map((s) => [String(s.userId), Number(s.stats)])
                    );
                    // ⚠️ totalStats : pour l’instant on ne l’a pas via faction/basic
                    // Donc placeholder 0. Plus tard on joindra avec App.stats.state (table stats)
                    for (const t of targets) {
                        const totalStats = statsById.get(String(t.userId)) ?? 0;

                        App.summary.addTargetCard({
                            username: t.username,
                            userId: t.userId,
                            outOfHospSeconds: t.outOfHospSeconds || 0,
                            lastActionSeconds: t.lastActionSecondsAgo || 0,
                            totalStats,
                        });
                    }
                } catch (err) {
                    App.summary.clear();
                    App.summary.addTargetCard({
                        username: `Error: ${String(err?.message || err)}`,
                        userId: "—",
                        outOfHospSeconds: 0,
                        lastActionSeconds: 0,
                        totalStats: 0,
                    });
                }
            },

            init() {
                App.summary.clear();

                if (App.el.refreshSummaryBtn) {
                    App.el.refreshSummaryBtn.addEventListener("click", () => {
                        App.summary.refreshFromApi();
                    });
                }

                setInterval(() => {
                    if (App.engine.isDetectionActive()) App.summary.refreshFromApi();
                }, 20000);
            },
        },

        api: {
            baseUrl: "https://api.torn.com",

            buildFactionBasicUrl({ factionId, apiKey }) {
                const id = encodeURIComponent(String(factionId || "").trim());
                const key = encodeURIComponent(String(apiKey || "").trim());

                // comment=UpsBounty (comme demandé)
                return `${App.api.baseUrl}/faction/${id}?key=${key}&comment=UpsBounty&selections=basic`;
            },

            async fetchFactionBasic() {
                const factionId = App.storage.get(App.storeKeys.factionId, "");
                const apiKey = App.storage.get(App.storeKeys.apiKey, "");

                if (!factionId || !apiKey) {
                    throw new Error("Missing factionId or apiKey in settings.");
                }

                const url = App.api.buildFactionBasicUrl({ factionId, apiKey });

                const res = await fetch(url, { method: "GET" });
                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status} while calling Torn API.`);
                }

                // Torn API renvoie souvent { error: { code, error } }
                if (data && data.error) {
                    throw new Error(`Torn API error ${data.error.code}: ${data.error.error}`);
                }

                return data;
            },
        },

        engine: {
            nowSec() {
                return Math.floor(Date.now() / 1000);
            },

            getLastActiveMinutes() {
                const raw = App.storage.get(App.storeKeys.lastActiveMinutes, "5");
                const n = App.utils.parseNumberLoose(raw);
                return Number.isFinite(n) && n > 0 ? n : 5;
            },

            isDetectionActive() {
                // ton toggle “Bounty Detection Active”
                return App.storage.get(App.storeKeys.detectionActive, "true") !== "false";
            },

            // Convertit members -> tableau normalisé
            normalizeFactionMembers(apiData) {
                const now = App.engine.nowSec();
                const membersObj = apiData?.members || {};

                return Object.entries(membersObj).map(([userId, m]) => {
                    const lastTs = Number(m?.last_action?.timestamp || 0);
                    const lastActionSecondsAgo = lastTs > 0 ? (now - lastTs) : Number.POSITIVE_INFINITY;

                    const state = m?.status?.state || ""; // "Okay" / "Hospital" etc.
                    const hospUntil = Number(m?.status?.until || 0);
                    const outOfHospSeconds = state === "Hospital" && hospUntil > now ? (hospUntil - now) : 0;

                    return {
                        userId: String(userId),
                        username: String(m?.name || ""),
                        level: Number(m?.level || 0),

                        lastActionStatus: String(m?.last_action?.status || ""), // "Offline" / "Online" etc
                        lastActionSecondsAgo,

                        statusState: state,
                        hospUntil,
                        outOfHospSeconds,
                    };
                });
            },

            // Filtre selon tes règles actuelles :
            // - si last active <= delimiter minutes => summary
            // - et plus tard: si hospital soon + offline => summary (on prépare le hook)
            filterForSummary(members) {
                const lastActiveMin = App.engine.getLastActiveMinutes();
                const lastActiveSec = lastActiveMin * 60;

                // param futur : on le met en dur pour l’instant (tu m’as dit "plus tard")
                // quand tu voudras, on le sortira en setting: bh_hosp_window_minutes
                const hospWindowSec = null; // ex: 15 * 60 si tu veux activer maintenant

                return members.filter((m) => {
                    const recentlyActive = m.lastActionSecondsAgo >= lastActiveSec;

                    const hospSoonAndOffline =
                          hospWindowSec !== null &&
                          m.statusState === "Hospital" &&
                          m.outOfHospSeconds > 0 &&
                          m.outOfHospSeconds <= hospWindowSec &&
                          m.lastActionStatus === "Offline";

                    // Ta phrase : "si last active > delimiter ... on l'envoie"
                    // Interprétation standard : "dernier actif il y a moins que le seuil"
                    return recentlyActive || hospSoonAndOffline;
                });
            },

            // Tri utile pour l’affichage : ceux qui sortent de l’hosp bientôt d’abord,
            // sinon ceux qui sont le plus récemment actifs
            sortForSummary(targets) {
                return [...targets].sort((a, b) => {
                    const aHosp = a.statusState === "Hospital" && a.outOfHospSeconds > 0;
                    const bHosp = b.statusState === "Hospital" && b.outOfHospSeconds > 0;

                    if (aHosp && bHosp) return a.outOfHospSeconds - b.outOfHospSeconds;
                    if (aHosp && !bHosp) return -1;
                    if (!aHosp && bHosp) return 1;

                    return a.lastActionSecondsAgo - b.lastActionSecondsAgo;
                });
            },
        },

        autobounty: {
            step: 0, // 0->1->2->3

            isOnBountyAddPage() {
                const url = new URL(window.location.href);
                return url.pathname.endsWith("/bounties.php") && url.searchParams.get("p") === "add";
            },

            getTargetIdFromUrl() {
                const url = new URL(window.location.href);
                const xid = url.searchParams.get("XID");
                return xid ? String(xid).trim() : "";
            },

            getSavedStatsEntry(userId) {
                const list =
                      Array.isArray(App.stats?.state) && App.stats.state.length
                ? App.stats.state
                : App.storage.getJSON(App.storeKeys.stats, []);

                return list.find((x) => String(x.userId) === String(userId)) || null;
            },

            getRules() {
                const rules = App.storage.getJSON(App.storeKeys.rules, []);
                return Array.isArray(rules) ? rules : [];
            },

            pickBountyValue(totalStats, rules) {
                for (const r of rules) {
                    const min = Number.isFinite(r.minStats) ? r.minStats : 0;
                    const max = (r.maxStats === null || r.maxStats === undefined) ? null : r.maxStats;
                    const bounty = Number.isFinite(r.bountyValue) ? r.bountyValue : 0;

                    if (totalStats >= min && (max === null || totalStats <= max)) {
                        return bounty;
                    }
                }
                return null;
            },

            async typeIntoInput(el, text, delay = 35) {
                el.focus();
                el.value = "";
                el.dispatchEvent(new Event("focus", { bubbles: true }));

                for (const ch of String(text)) {
                    el.value += ch;

                    // événements typiques clavier / input
                    el.dispatchEvent(new Event("keydown", { bubbles: true }));
                    el.dispatchEvent(new Event("keypress", { bubbles: true }));
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("keyup", { bubbles: true }));

                    await new Promise((r) => setTimeout(r, delay));
                }

                el.dispatchEvent(new Event("change", { bubbles: true }));
            },

            setInputValue(el, value) {
                el.value = value;
                el.dispatchEvent(new Event("input", { bubbles: true }));
                el.dispatchEvent(new Event("change", { bubbles: true }));
            },

            getFormEls(wrap) {
                return {
                    moneyEl: wrap.querySelector("input.input-money"),
                    reasonEl: wrap.querySelector("input.reason-input"),
                    placeBtn: wrap.querySelector('input.torn-btn[type="submit"][value="PLACE"]'),
                };
            },

            updateButtonLabel(btn) {
                const labels = [
                    "AutoBounty: Set Amount",
                    "AutoBounty: Set Reason",
                    "AutoBounty: Place",
                    "AutoBounty: Confirm",
                    "AutoBounty: Reset",
                ];
                btn.textContent = labels[Math.min(this.step, labels.length - 1)];
            },

            createButton() {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "torn-btn";
                btn.id = "bh-auto-bounty";
                btn.style.marginLeft = "8px";
                return btn;
            },

            init() {
                if (!this.isOnBountyAddPage()) return;

                const wrap = document.querySelector(".add-bounties-wrap");
                if (!wrap) return;
                if (document.getElementById("bh-auto-bounty")) return;

                const targetId = this.getTargetIdFromUrl();
                if (!targetId) return;

                const btn = this.createButton();
                wrap.prepend(btn);
                this.step = 0;
                this.updateButtonLabel(btn);

                btn.addEventListener("click", () => {
                    const entry = this.getSavedStatsEntry(targetId);
                    const totalStats = entry ? Number(entry.stats) : null;

                    // --- STEP 0 => Step 1: amount ---
                    if (this.step === 0) {
                        const moneyEl = wrap.querySelector("input.input-money");
                        if (!moneyEl) {
                            alert("AutoBounty: could not find bounty money input.");
                            return;
                        }

                        if (totalStats === null) {
                            alert(`AutoBounty: no saved stats for user ${targetId}. Add them in the Stats tab first.`);
                            return;
                        }

                        const bountyValue = this.pickBountyValue(totalStats, this.getRules());
                        if (bountyValue === null) {
                            alert(`AutoBounty: no matching rule for stats=${totalStats}.`);
                            return;
                        }

                        this.typeIntoInput(moneyEl, String(bountyValue)).then(() => {
                            this.step = 1;
                            this.updateButtonLabel(btn);
                        });
                        return;
                    }

                    // --- STEP 1 => Step 2: reason ---
                    if (this.step === 1) {
                        const reasonEl = wrap.querySelector("input.reason-input");
                        if (!reasonEl) {
                            alert("AutoBounty: could not find bounty reason input.");
                            return;
                        }

                        this.setInputValue(reasonEl, "WAR");
                        this.step = 2;
                        this.updateButtonLabel(btn);
                        return;
                    }

                    // --- STEP 2 => Step 3: place ---
                    if (this.step === 2) {
                        const placeBtn = document.querySelector('div.confirm-bounties input.torn-btn[type="submit"]');
                        if (!placeBtn) {
                            alert("AutoBounty: could not find place button.");
                            return;
                        }
                        setTimeout(() => {
                            if (placeBtn.disabled) {
                                // “nudge” si Torn écoute keyup
                                moneyEl.dispatchEvent(new Event("keyup", { bubbles: true }));
                                reasonEl.dispatchEvent(new Event("keyup", { bubbles: true }));
                            }
                            placeBtn.click();
                        }, 50);

                        this.step = 3;
                        this.updateButtonLabel(btn);
                        return;
                    }

                    // --- STEP 3 => click YES ---
                    if (this.step === 3) {
                        const yesBtn = document.querySelector('div.confirm-buttons a.yes[role="button"]');
                        if (!yesBtn) {
                            alert("AutoBounty: could not find bounty yes button.");
                            return;
                        }

                        yesBtn.click();
                        this.step = 4;
                        this.updateButtonLabel(btn);
                        return;
                    }

                    // --- STEP 4 => reset ---
                    if (this.step === 4) {
                        this.step = 0;
                        this.updateButtonLabel(btn);
                        return;
                    }
                });
            },
        },

        route: {
            isFactionMembersControls() {
                const url = new URL(window.location.href);

                // Path + query stricts
                const okPath = url.pathname === "/factions.php";
                const okStep = url.searchParams.get("step") === "your";
                const okType = url.searchParams.get("type") === "1";

                // Hash strict: "#/tab=controls&option=members"
                // Torn peut parfois ajouter d'autres params -> on parse et on vérifie au moins ceux-là
                const hash = (url.hash || "").trim();
                if (!hash.startsWith("#/")) return false;

                const paramsStr = hash.slice(2); // remove "#/"
                const params = new URLSearchParams(paramsStr);

                const okTab = params.get("tab") === "controls";

                return okPath && okStep && okType && okTab;
            },

            // Observe les changements de hash/SPA
            watch(onChange) {
                const fire = () => onChange();

                window.addEventListener("hashchange", fire);

                // Torn peut modifier l’URL sans hashchange -> on observe aussi DOM + history
                const mo = new MutationObserver(() => fire());
                mo.observe(document.documentElement, { childList: true, subtree: true });

                // Hook history API (SPA)
                const _pushState = history.pushState;
                const _replaceState = history.replaceState;

                history.pushState = function (...args) {
                    _pushState.apply(this, args);
                    fire();
                };
                history.replaceState = function (...args) {
                    _replaceState.apply(this, args);
                    fire();
                };

                // first run
                fire();

                return () => {
                    window.removeEventListener("hashchange", fire);
                    mo.disconnect();
                    history.pushState = _pushState;
                    history.replaceState = _replaceState;
                };
            },
        },

        mountUI() {
            if (App.el.root) return; // déjà monté

            // ⚠️ choisis un anchor stable sur cette page
            // Tu utilisais hr.delimiter-999.m-top10. Si c’est stable sur factions members, OK.
            // Sinon remplace le selector par un élément présent sur cette page.
            App.utils.waitForElement("hr.delimiter-999.m-top10").then((anchor) => {
                // recheck route (on peut avoir changé entre-temps)
                if (!App.route.isFactionMembersControls()) return;
                if (App.el.root) return;

                App.ui.mount(anchor);
                App.ui.cacheElements();
                App.ui.bindTabs();

                App.rules.init();
                App.stats.init();
                App.settings.init();
                App.summary.init();

                // Accordion (voir section suivante)
                App.ui.initAccordion();
            });
        },

        unmountUI() {
            const root = App.el.root;
            if (!root) return;
            root.remove();
            App.el.root = null;

            // (Optionnel) si tu veux aussi reset certains caches :
            App.el.rulesRows = null;
            App.el.statsTableBody = null;
            App.el.statsInput = null;
            App.el.targetCards = null;
        },


        // ---- App bootstrap ----
        async init() {
            if (App.state.initialized) return;
            App.state.initialized = true;

            // AutoBounty doit rester indépendant de l’UI factions
            App.autobounty?.init?.();

            App.route.watch(() => {
                if (App.route.isFactionMembersControls()) App.mountUI();
                else App.unmountUI();
            });
        },
    };

    App.init();
})();
