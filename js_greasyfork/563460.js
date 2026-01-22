// ==UserScript==
// @name         TornPDA – Faction Respect Tracker
// @namespace    tornpda-respect-tracker
// @version      1.0.0
// @description  Tracks and displays historical faction respect (weekly/monthly/war) inside Torn, optimized for TornPDA. Uses Torn API v2.
// @author       JohnNash
// @match        https://www.torn.com/*
// @icon         https://www.torn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563460/TornPDA%20%E2%80%93%20Faction%20Respect%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/563460/TornPDA%20%E2%80%93%20Faction%20Respect%20Tracker.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /*************************
   * Config
   *************************/
  const LS_KEY = "tornpda_faction_respect_tracker_clean";

  const LIMITS = {
    weekly: 5,
    monthly: 12,
    war: 10
  };

  const MS_HOUR = 60 * 60 * 1000;
  const FETCH_INTERVAL_NORMAL = 24 * MS_HOUR;
  const FETCH_INTERVAL_WAR = 12 * MS_HOUR;
  const WEEKLY_MIN_GAP = 7 * 24 * MS_HOUR;
  const WAR_PURGE_AFTER = 5 * 24 * MS_HOUR;

  const DEFAULTS = {
    v: 2,
    apiKey: "",
    ui: { settingsOpen: false },
    faction: { id: null, name: null, tag: null },
    last: { ts: 0, respect: null },
    weekly: [],
    monthly: [],
    war: {
      active: false,
      warId: null,
      endTsMs: 0,
      lastActiveTsMs: 0,
      rows: []
    }
  };

  /*************************
   * Storage
   *************************/
  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return structuredClone(DEFAULTS);
      return deepMerge(structuredClone(DEFAULTS), JSON.parse(raw));
    } catch {
      return structuredClone(DEFAULTS);
    }
  }

  function saveState(s) {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  }

  function deepMerge(base, extra) {
    if (!extra || typeof extra !== "object") return base;
    for (const k of Object.keys(extra)) {
      if (Array.isArray(extra[k])) base[k] = extra[k];
      else if (extra[k] && typeof extra[k] === "object") base[k] = deepMerge(base[k] || {}, extra[k]);
      else base[k] = extra[k];
    }
    return base;
  }

  function pushWithLimit(arr, item, limit) {
    arr.push(item);
    while (arr.length > limit) arr.shift();
  }

  /*************************
   * Utils
   *************************/
  function pad2(n) { return String(n).padStart(2, "0"); }

  function formatDate(tsMs) {
    const d = new Date(tsMs);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  function ymKey(tsMs) {
    const d = new Date(tsMs);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
  }

  function nowSec() {
    return Math.floor(Date.now() / 1000);
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText = `
      position: fixed; left: 12px; bottom: 12px; z-index: 999999;
      background: #111; color: #fff; border: 1px solid rgba(255,255,255,.18);
      padding: 10px 12px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.45);
      font-weight: 700; max-width: 90vw;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  /*************************
   * API (Torn v2)
   *************************/
  async function tornFetchJson(url) {
    const res = await fetch(url, { credentials: "omit" });
    const data = await res.json();
    if (data?.error) throw new Error(`API error ${data.error.code}: ${data.error.error}`);
    return data;
  }

  async function fetchFactionBasicV2(apiKey) {
    const url = `https://api.torn.com/v2/faction/basic?key=${encodeURIComponent(apiKey)}`;
    const data = await tornFetchJson(url);

    const basic = data?.basic;
    if (!basic) throw new Error("Missing 'basic' in v2 response.");

    return {
      id: basic.id ?? null,
      name: basic.name ?? null,
      tag: basic.tag ?? null,
      respect: Number(basic.respect)
    };
  }

  async function fetchRankedWarsV2(apiKey, factionId) {
    const url = `https://api.torn.com/v2/faction/${encodeURIComponent(String(factionId))}/rankedwars?key=${encodeURIComponent(apiKey)}`;
    return tornFetchJson(url);
  }

  function isRankedWarOngoing(rw) {
    const start = Number(rw?.start ?? 0);
    const end = Number(rw?.end ?? 0);
    return !!start && end === 0 && start <= nowSec();
  }

  function detectOngoingRankedWar(rankedwarsPayload) {
    const list = rankedwarsPayload?.rankedwars;
    if (!Array.isArray(list) || list.length === 0) return { active: false, warId: null };

    // Prefer first record (as you noted), fallback to any ongoing
    if (isRankedWarOngoing(list[0])) return { active: true, warId: String(list[0].id ?? "current") };

    const any = list.find(isRankedWarOngoing);
    if (any) return { active: true, warId: String(any.id ?? "current") };

    return { active: false, warId: null };
  }

  /*************************
   * Snapshot Logic
   *************************/
  function shouldFetch(state) {
    const interval = state.war.active ? FETCH_INTERVAL_WAR : FETCH_INTERVAL_NORMAL;
    return !state.last.ts || (Date.now() - state.last.ts) >= interval;
  }

  function addWeekly(state, tsMs, respect) {
    const last = state.weekly.length ? state.weekly[state.weekly.length - 1] : null;
    if (!last || (tsMs - last.ts) >= WEEKLY_MIN_GAP) {
      pushWithLimit(state.weekly, { ts: tsMs, respect }, LIMITS.weekly);
    }
  }

  function addMonthly(state, tsMs, respect) {
    const key = ymKey(tsMs);
    const last = state.monthly.length ? state.monthly[state.monthly.length - 1] : null;
    if (!last || last.ym !== key) {
      pushWithLimit(state.monthly, { ym: key, ts: tsMs, respect }, LIMITS.monthly);
    }
  }

  function addWar(state, tsMs, respect, warId) {
    const last = state.war.rows.length ? state.war.rows[state.war.rows.length - 1] : null;
    if (!last || (tsMs - last.ts) >= FETCH_INTERVAL_WAR) {
      pushWithLimit(state.war.rows, { ts: tsMs, respect, warId }, LIMITS.war);
    }
  }

  function purgeOldWar(state) {
    if (state.war.active) return;
    const ref = state.war.endTsMs || state.war.lastActiveTsMs || 0;
    if (ref && (Date.now() - ref) > WAR_PURGE_AFTER) {
      state.war.rows = [];
      state.war.warId = null;
      state.war.endTsMs = 0;
      state.war.lastActiveTsMs = 0;
    }
  }

  /*************************
   * UI
   *************************/
  function ensureStyles() {
    if (document.getElementById("frt-style")) return;
    const style = document.createElement("style");
    style.id = "frt-style";
    style.textContent = `
      .frt-backdrop{
        position:fixed; inset:0; z-index:999998; background:rgba(0,0,0,.55);
        display:flex; align-items:center; justify-content:center; padding:12px;
      }
      .frt-modal{
        width:min(980px, 98vw);
        max-height:94vh;
        overflow:auto;
        background:#0f0f10;
        border:1px solid rgba(255,255,255,.14);
        border-radius:16px;
        box-shadow:0 18px 60px rgba(0,0,0,.55);
        font-family:inherit;
      }
      .frt-head{
        position:sticky; top:0; background:#0f0f10;
        padding:16px 16px;
        border-bottom:1px solid rgba(255,255,255,.08);
        display:flex; flex-wrap:wrap; gap:12px;
        align-items:center; justify-content:space-between;
      }
      .frt-title{ margin:0; font-size:16px; font-weight:900; }
      .frt-sub{ font-size:13px; opacity:.9; line-height:1.45; margin-top:4px; }

      .frt-actions{ display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
      .frt-btn{
        background:rgba(255,255,255,.08);
        border:1px solid rgba(255,255,255,.12);
        padding:10px 12px;
        border-radius:12px;
        cursor:pointer;
        font-weight:800;
        font-size:13px;
        white-space:nowrap;
      }
      .frt-btn:hover{ background:rgba(255,255,255,.14); }

      .frt-input{
        width:260px; max-width:80vw;
        background:rgba(255,255,255,.06);
        border:1px solid rgba(255,255,255,.16);
        padding:10px 12px;
        border-radius:12px;
        font-size:13px;
      }

      .frt-body{ padding:18px 16px 20px; display:grid; gap:16px; }
      .frt-card{
        border:1px solid rgba(255,255,255,.10);
        border-radius:14px;
        background:rgba(255,255,255,.03);
        padding:18px 16px;
        margin-bottom:6px;
      }
      .frt-card h3{ margin:0 0 12px 0; font-size:14px; font-weight:900; }

      .frt-table{ width:100%; border-collapse:collapse; font-size:13px; }
      .frt-table th, .frt-table td{
        padding:12px 12px;
        text-align:left;
        line-height:1.5;
        border-bottom:1px solid rgba(255,255,255,.10);
      }
      .frt-table th{ font-size:12px; opacity:.9; }
      .frt-table td{ white-space:normal; word-break:break-word; }

      .frt-tabs{ display:flex; gap:10px; flex-wrap:wrap; margin-bottom:6px; }
      .frt-tab[aria-selected="true"]{ background:rgba(255,255,255,.18); }
      .frt-hidden{ display:none !important; }

      /* Force readable colors inside modal (Torn/TornPDA overrides) */
      .frt-modal, .frt-modal *{ color:#f2f2f2 !important; }

      @media (max-width: 420px) {
        .frt-table th, .frt-table td{ padding:10px 8px; font-size:12px; }
        .frt-card{ padding:14px 12px; }
        .frt-body{ padding:14px 12px 16px; }
      }
      
      #frt-inline-btn{
          padding: 6px 10px;
          font-size: 12px;
          line-height: 1.2;
      }

    `;
    document.head.appendChild(style);
  }

  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const c of children) e.appendChild(c);
    return e;
  }

  function renderTable(rows, cols) {
    const table = el("table", { class: "frt-table" });
    const thead = el("thead");
    const trh = el("tr");
    cols.forEach(c => trh.appendChild(el("th", { text: c.label })));
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = el("tbody");
    if (!rows.length) {
      const tr = el("tr");
      const td = el("td", { text: "No data yet." });
      td.colSpan = cols.length;
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      rows.slice().reverse().forEach(r => {
        const tr = el("tr");
        cols.forEach(c => tr.appendChild(el("td", { text: String(c.value(r) ?? "") })));
        tbody.appendChild(tr);
      });
    }
    table.appendChild(tbody);
    return table;
  }

  function openModal() {
    ensureStyles();

    const backdrop = el("div", { class: "frt-backdrop" });
    const modal = el("div", { class: "frt-modal" });

    const left = el("div", {}, [
      el("h2", { class: "frt-title", text: "Respect Tracker" }),
      el("div", {
        class: "frt-sub",
        text:
          `${state.faction.name || "Faction"}${state.faction.id ? ` [${state.faction.id}]` : ""}${state.faction.tag ? ` (${state.faction.tag})` : ""} • ` +
          `Respect: ${state.last.respect ?? "—"} • ` +
          `Last update: ${state.last.ts ? formatDate(state.last.ts) : "never"} • ` +
          `War: ${state.war.active ? "YES" : "no"}`
      })
    ]);

    // Settings button (always visible)
    const btnSettings = el("button", {
      class: "frt-btn",
      text: "⚙ Settings",
      onclick: () => {
        state.ui.settingsOpen = !state.ui.settingsOpen;
        saveState(state);
        document.querySelector(".frt-backdrop")?.remove();
        openModal();
      }
    });

    const btnClose = el("button", {
      class: "frt-btn",
      text: "Close",
      onclick: () => backdrop.remove()
    });

    // Settings panel (hidden when apiKey exists AND settingsOpen is false)
    const settingsPanel = el("div", { class: "frt-actions" });

    const keyInput = el("input", {
      class: "frt-input",
      placeholder: "API key (Public/Custom)",
      value: state.apiKey || ""
    });

    const btnSaveKey = el("button", {
      class: "frt-btn",
      text: "Save key",
      onclick: () => {
        const k = keyInput.value.trim();
        state.apiKey = k;
        saveState(state);
        toast(k ? "API key saved." : "API key cleared.");
        // Auto-hide settings after saving a key
        if (k) state.ui.settingsOpen = false;
        saveState(state);
        document.querySelector(".frt-backdrop")?.remove();
        openModal();
      }
    });

    const btnRefresh = el("button", {
      class: "frt-btn",
      text: "Refresh now",
      onclick: async () => {
        try {
          await refresh(true);
          toast("Refreshed.");
        } catch (e) {
          toast(String(e.message || e));
        }
        document.querySelector(".frt-backdrop")?.remove();
        openModal();
      }
    });

    const btnClearWar = el("button", {
      class: "frt-btn",
      text: "Clear war data",
      onclick: () => {
        clearWar();
        toast("War data cleared.");
        document.querySelector(".frt-backdrop")?.remove();
        openModal();
      }
    });

    const btnReset = el("button", {
      class: "frt-btn",
      text: "Full reset",
      onclick: () => {
        fullReset();
        toast("Full reset completed.");
        document.querySelector(".frt-backdrop")?.remove();
        openModal();
      }
    });

    const showSettingsPanel = state.ui.settingsOpen || !state.apiKey;

    if (showSettingsPanel) {
      settingsPanel.appendChild(keyInput);
      settingsPanel.appendChild(btnSaveKey);
      // Only show these when a key exists
      if (state.apiKey) {
        settingsPanel.appendChild(btnRefresh);
        settingsPanel.appendChild(btnClearWar);
        settingsPanel.appendChild(btnReset);
      }
    }

    const right = el("div", { class: "frt-actions" }, [btnSettings, btnClose]);

    const head = el("div", { class: "frt-head" }, [
      el("div", {}, [left, showSettingsPanel ? settingsPanel : el("div")]),
      right
    ]);

    // Tabs
    const tabBar = el("div", { class: "frt-tabs" });
    const tabWeekly = el("button", { class: "frt-btn frt-tab", text: "Weekly" });
    const tabMonthly = el("button", { class: "frt-btn frt-tab", text: "Monthly" });
    const tabWar = el("button", { class: "frt-btn frt-tab", text: "War" });

    const weeklyCard = el("div", { class: "frt-card" }, [
      el("h3", { text: "Weekly" }),
      renderTable(state.weekly, [
        { label: "Date", value: r => formatDate(r.ts) },
        { label: "Respect", value: r => r.respect }
      ])
    ]);

    const monthlyCard = el("div", { class: "frt-card frt-hidden" }, [
      el("h3", { text: "Monthly" }),
      renderTable(state.monthly, [
        { label: "Month", value: r => r.ym },
        { label: "Date", value: r => formatDate(r.ts) },
        { label: "Respect", value: r => r.respect }
      ])
    ]);

    const warCard = el("div", { class: "frt-card frt-hidden" }, [
      el("h3", { text: "War" }),
      renderTable(state.war.rows, [
        { label: "Date", value: r => formatDate(r.ts) },
        { label: "Respect", value: r => r.respect },
        { label: "War ID", value: r => r.warId }
      ])
    ]);

    function selectTab(which) {
      const setSel = (b, on) => b.setAttribute("aria-selected", on ? "true" : "false");
      setSel(tabWeekly, which === "weekly");
      setSel(tabMonthly, which === "monthly");
      setSel(tabWar, which === "war");
      weeklyCard.classList.toggle("frt-hidden", which !== "weekly");
      monthlyCard.classList.toggle("frt-hidden", which !== "monthly");
      warCard.classList.toggle("frt-hidden", which !== "war");
    }

    tabWeekly.addEventListener("click", () => selectTab("weekly"));
    tabMonthly.addEventListener("click", () => selectTab("monthly"));
    tabWar.addEventListener("click", () => selectTab("war"));

    tabBar.appendChild(tabWeekly);
    tabBar.appendChild(tabMonthly);
    tabBar.appendChild(tabWar);

    const body = el("div", { class: "frt-body" }, [tabBar, weeklyCard, monthlyCard, warCard]);

    modal.appendChild(head);
    modal.appendChild(body);
    backdrop.appendChild(modal);

    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) backdrop.remove(); });
    document.body.appendChild(backdrop);

    selectTab("weekly");
  }

  /*************************
   * Main actions
   *************************/
  let state = loadState();

  function fullReset() {
    state = structuredClone(DEFAULTS);
    saveState(state);
  }

  function clearWar() {
    state.war.rows = [];
    state.war.active = false;
    state.war.warId = null;
    state.war.endTsMs = 0;
    state.war.lastActiveTsMs = 0;
    saveState(state);
  }

  async function refresh(force = false) {
    if (!state.apiKey) {
      // If no key, just open UI to set it
      return;
    }
    if (!force && !shouldFetch(state)) return;

    const now = Date.now();

    // 1) basic v2
    const basic = await fetchFactionBasicV2(state.apiKey);
    state.faction.id = basic.id;
    state.faction.name = basic.name;
    state.faction.tag = basic.tag;

    state.last.ts = now;
    state.last.respect = basic.respect;

    // 2) ranked wars v2 (best-effort)
    const wasActive = state.war.active;
    try {
      const rankedwarsPayload = await fetchRankedWarsV2(state.apiKey, basic.id);
      const rw = detectOngoingRankedWar(rankedwarsPayload);

      if (rw.active) {
        state.war.active = true;
        state.war.warId = rw.warId;
        state.war.lastActiveTsMs = now;
        addWar(state, now, basic.respect, rw.warId);
      } else {
        state.war.active = false;
        if (wasActive) state.war.endTsMs = now;
        purgeOldWar(state);
      }
    } catch {
      // If ranked wars fetch fails, we still keep weekly/monthly working
      if (!state.war.active) purgeOldWar(state);
    }

    // 3) weekly/monthly snapshots
    addWeekly(state, now, basic.respect);
    addMonthly(state, now, basic.respect);

    saveState(state);
  }

  /*************************
   * Button injection next to .respect-icon.right
   *************************/
function installButtonNextToRespect() {
  ensureStyles();

  // Evitar duplicados
  if (document.getElementById("frt-inline-btn")) return;

  const titleSpan = document.querySelector(".respect-icon.right + .title, .title.respect");
  if (!titleSpan) return;

  // Criar wrapper div
  const wrapper = document.createElement("div");
  wrapper.style.display = "inline-flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "8px";

  // Criar nova span apenas com o texto
  const textSpan = document.createElement("span");
  textSpan.textContent = titleSpan.textContent;

  // Criar botão
  const btn = document.createElement("button");
  btn.id = "frt-inline-btn";
  btn.className = "frt-btn";
  btn.textContent = "Tracker";
  btn.style.padding = "6px 10px";
  btn.style.fontSize = "12px";
  btn.style.lineHeight = "1.2";

  btn.addEventListener("click", async () => {
    try {
      await refresh(false);
    } catch (e) {
      toast(String(e.message || e));
    }
    document.querySelector(".frt-backdrop")?.remove();
    openModal();
  });

  // Montar estrutura
  wrapper.appendChild(textSpan);
  wrapper.appendChild(btn);

  // Substituir a span original
  titleSpan.replaceWith(wrapper);
}



  (async function boot() {
    installButtonNextToRespect();

    // Try a light refresh on load (only if key exists and interval passed)
    try { await refresh(false); } catch { /* silent */ }

    // TornPDA/Torn is dynamic; re-try placing the button when DOM changes
    const mo = new MutationObserver(() => installButtonNextToRespect());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  })();

})();