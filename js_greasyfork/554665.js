// ==UserScript==
// @name         Attack Loaders
// @namespace    jfk.portal
// @version      1.1.0
// @description  Allows you to cycle an entire factions attack loaders quickly
// @author       HuzGPT
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554665/Attack%20Loaders.user.js
// @updateURL https://update.greasyfork.org/scripts/554665/Attack%20Loaders.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY   = "torn_profile_member_list_v1";
  const IDX_KEY       = "torn_profile_member_idx_v1";
  const PANEL_ID      = "torn-cycler-panel";
  const FAB_ID        = "torn-cycler-fab";
  const PANEL_OPENKEY = "torn_cycler_panel_open"; // "1" open, "0" closed
  const FAB_POS_KEY   = "torn_cycler_fab_pos";    // JSON: {x,y}
  const PANEL_POS_KEY = "torn_cycler_panel_pos";  // JSON: {x,y}

  /* ---------- URL helpers ---------- */
  function getURLSearch() {
    try { return new URL(window.location.href).searchParams; } catch { return new URLSearchParams(location.search); }
  }
  function isYourFactionPage() {
    const p = getURLSearch();
    const step = (p.get("step") || "").toLowerCase();
    return step.startsWith("your");
  }

  /* ---------- tiny helpers ---------- */
  function onReady(cb) {
    if (document.readyState === "complete" || document.readyState === "interactive") cb();
    else document.addEventListener("DOMContentLoaded", cb, { once: true });
  }
  function saveList(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list || [])); }
  function loadList() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  }
  function setIndex(i) { localStorage.setItem(IDX_KEY, String(i)); }
  function getIndex() { const n = Number(localStorage.getItem(IDX_KEY) || "0"); return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0; }

  function updateIdxDisplay() {
    const list = loadList();
    const idxSpan = document.getElementById("tc-idx");
    if (!idxSpan) return;
    const i = getIndex();
    idxSpan.textContent = `${i + 1 > list.length ? list.length : i + 1} / ${list.length}`;
  }

  /* ---------- panel open/close ---------- */
  function showPanel() {
    const panel = document.getElementById(PANEL_ID);
    const fab   = document.getElementById(FAB_ID);
    if (panel) panel.style.display = "block";
    if (fab) fab.style.display = "none";
    localStorage.setItem(PANEL_OPENKEY, "1");
  }
  function hidePanel() {
    const panel = document.getElementById(PANEL_ID);
    const fab   = document.getElementById(FAB_ID);
    if (panel) panel.style.display = "none";
    if (fab) fab.style.display = "flex";
    localStorage.setItem(PANEL_OPENKEY, "0");
  }

  /* ---------- draggable gun button (FAB) ---------- */
  function createFab() {
    if (document.getElementById(FAB_ID)) return;
    if (!document.body) return setTimeout(createFab, 50);

    const fab = document.createElement("div");
    fab.id = FAB_ID;
    fab.textContent = "🔫";
    fab.title = "Open Loader Cycler";
    fab.style.cssText = `
      position: fixed;
      width: 40px; height: 40px;
      right: 14px; bottom: 20px;
      z-index: 999999;
      background: rgba(30,30,30,0.95);
      color: #fff; font-size: 20px;
      display: none; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 9px;
      box-shadow: 0 6px 22px rgba(0,0,0,0.45);
      cursor: grab;
      user-select: none;
    `;
    document.body.appendChild(fab);

    // restore saved position (if any)
    try {
      const saved = JSON.parse(localStorage.getItem(FAB_POS_KEY) || "null");
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        fab.style.left = saved.x + "px";
        fab.style.top  = saved.y + "px";
        fab.style.right = "auto";
        fab.style.bottom = "auto";
      }
    } catch {}

    // click opens the panel (unless just dragged)
    fab.addEventListener("click", () => {
      if (fab._dragging) return;
      showPanel();
    });

    // simple drag
    let startX, startY, startLeft, startTop, moved;
    const onMove = (e) => {
      const x = (e.touches?.[0]?.clientX ?? e.clientX);
      const y = (e.touches?.[0]?.clientY ?? e.clientY);
      const dx = x - startX;
      const dy = y - startY;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      const newLeft = startLeft + dx;
      const newTop  = startTop + dy;
      fab.style.left = newLeft + "px";
      fab.style.top  = newTop + "px";
      fab.style.right = "auto";
      fab.style.bottom = "auto";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
      fab.style.cursor = "grab";
      fab._dragging = false;

      const rect = fab.getBoundingClientRect();
      localStorage.setItem(FAB_POS_KEY, JSON.stringify({ x: rect.left, y: rect.top }));

      if (moved) {
        moved = false;
        fab._dragging = true;
        setTimeout(() => (fab._dragging = false), 50);
      }
    };
    const onDown = (e) => {
      if (e.button != null && e.button !== 0) return;
      fab.style.cursor = "grabbing";
      fab._dragging = false;
      moved = false;
      startX = (e.touches?.[0]?.clientX ?? e.clientX);
      startY = (e.touches?.[0]?.clientY ?? e.clientY);
      const rect = fab.getBoundingClientRect();
      startLeft = rect.left;
      startTop  = rect.top;

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
    };

    fab.addEventListener("mousedown", onDown);
    fab.addEventListener("touchstart", onDown, { passive: false });

    // respect saved open/closed state
    const open = localStorage.getItem(PANEL_OPENKEY);
    if (open === "0") fab.style.display = "flex";
  }

  /* ---------- panel UI (NOW DRAGGABLE) ---------- */
  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;
    if (!document.body) return setTimeout(createPanel, 50);

    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.style.cssText = `
      position: fixed; right: 12px; top: 90px; z-index: 999998;
      background: rgba(18,18,18,0.93); color: #fff;
      border: 1px solid rgba(255,255,255,0.06);
      padding: 10px; border-radius: 8px;
      font-family: system-ui, Arial; font-size: 13px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.6); min-width: 250px;
    `;
    panel.innerHTML = `
      <div id="tc-head" style="display:flex;align-items:center;gap:8px;margin-bottom:8px;cursor:move;-webkit-user-select:none;user-select:none">
        <strong style="font-size:14px">Loader Cycler</strong>
        <button id="tc-min" title="Close" style="margin-left:auto;background:transparent;border:1px solid rgba(255,255,255,0.06);color:#fff;padding:2px 7px;border-radius:6px;cursor:pointer;line-height:1">×</button>
        <button id="tc-reset" title="Clear saved list" style="background:transparent;border:1px solid rgba(255,255,255,0.06);color:#fff;padding:4px 6px;border-radius:6px;cursor:pointer">Reset</button>
      </div>
      <div id="tc-block" style="display:none;margin-bottom:8px;padding:8px;border-radius:6px;background:#3a1e1e;color:#ffdede;border:1px solid #5b2a2a;font-size:12px">
        Disabled on <b>your</b> faction pages (step=your). Go to a faction profile page to use this tool.
      </div>
      <div style="display:flex;gap:6px;margin-bottom:8px">
        <button id="tc-grab" style="flex:1;background:#242424;color:#fff;border:1px solid rgba(255,255,255,0.08);padding:6px 8px;border-radius:6px;cursor:pointer">Grab members</button>
        <button id="tc-list" title="Show saved list" style="width:44px;background:#242424;color:#fff;border:1px solid rgba(255,255,255,0.08);padding:6px 8px;border-radius:6px;cursor:pointer">List</button>
      </div>
      <div style="display:flex;gap:6px;align-items:center;margin-bottom:8px">
        <button id="tc-prev" style="flex:1;background:#242424;color:#fff;border:1px solid rgba(255,255,255,0.08);padding:6px 8px;border-radius:6px;cursor:pointer">Prev</button>
        <button id="tc-next" style="flex:1;background:#242424;color:#fff;border:1px solid rgba(255,255,255,0.08);padding:6px 8px;border-radius:6px;cursor:pointer">Next</button>
      </div>
      <div style="display:flex;align-items:center;justify-content:center;margin-bottom:6px">
        <span id="tc-idx" style="opacity:.9">0 / 0</span>
      </div>
      <div style="font-size:11px;color:#cfcfcf">
        On a faction <b>profile</b> page, click <b>Grab members</b> (reads only visible <i>members-list</i>).<br/>
        Use <b>Next/Prev</b> to open attack loaders manually.
      </div>
    `;
    document.body.appendChild(panel);

    // restore saved panel position
    try {
      const saved = JSON.parse(localStorage.getItem(PANEL_POS_KEY) || "null");
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        panel.style.left = saved.x + "px";
        panel.style.top  = saved.y + "px";
        panel.style.right = "auto"; // switch to left/top anchoring
      }
    } catch {}

    // Buttons
    panel.querySelector("#tc-min").addEventListener("click", hidePanel);
    panel.querySelector("#tc-reset").addEventListener("click", resetSaved);
    panel.querySelector("#tc-grab").addEventListener("click", grabMembersFromPage);
    panel.querySelector("#tc-list").addEventListener("click", showListPreview);
    panel.querySelector("#tc-next").addEventListener("click", gotoNext);
    panel.querySelector("#tc-prev").addEventListener("click", gotoPrev);

    // Draggable panel via header handle
    makePanelDraggable(panel);

    // Set initial UI state
    applyBlockState();
    const open = localStorage.getItem(PANEL_OPENKEY);
    if (open === "0") panel.style.display = "none";
    updateIdxDisplay();
  }

  function makePanelDraggable(panel) {
    const handle = panel.querySelector("#tc-head");
    if (!handle) return;

    let startX, startY, startLeft, startTop, moved;
    const onMove = (e) => {
      const x = (e.touches?.[0]?.clientX ?? e.clientX);
      const y = (e.touches?.[0]?.clientY ?? e.clientY);
      const dx = x - startX;
      const dy = y - startY;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;

      const newLeft = startLeft + dx;
      const newTop  = startTop + dy;

      // switch to left/top anchoring and apply
      panel.style.left = newLeft + "px";
      panel.style.top  = newTop + "px";
      panel.style.right = "auto";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);

      // persist final position
      const rect = panel.getBoundingClientRect();
      try {
        localStorage.setItem(PANEL_POS_KEY, JSON.stringify({ x: rect.left, y: rect.top }));
      } catch {}
    };
    const onDown = (e) => {
      if (e.button != null && e.button !== 0) return;
      startX = (e.touches?.[0]?.clientX ?? e.clientX);
      startY = (e.touches?.[0]?.clientY ?? e.clientY);
      const rect = panel.getBoundingClientRect();
      startLeft = rect.left;
      startTop  = rect.top;
      moved = false;

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
    };

    handle.addEventListener("mousedown", onDown);
    handle.addEventListener("touchstart", onDown, { passive: false });
  }

  function applyBlockState() {
    const blocked = isYourFactionPage();
    const blockEl = document.getElementById("tc-block");
    const btnGrab = document.getElementById("tc-grab");
    const btnPrev = document.getElementById("tc-prev");
    const btnNext = document.getElementById("tc-next");
    const btnList = document.getElementById("tc-list");

    if (blockEl) blockEl.style.display = blocked ? "block" : "none";
    [btnGrab, btnPrev, btnNext, btnList].forEach((b) => {
      if (!b) return;
      b.disabled = !!blocked;
      b.style.opacity = blocked ? "0.5" : "1";
      b.style.cursor = blocked ? "not-allowed" : "pointer";
      b.title = blocked ? "Disabled on step=your pages" : b.title || "";
    });
  }

  function resetSaved() {
    if (!confirm("Clear saved member list and index?")) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(IDX_KEY);
    updateIdxDisplay();
    alert("Cleared saved list.");
  }

  function showListPreview() {
    const list = loadList();
    if (!list || !list.length) return alert("No list saved.");
    const snippet = list.slice(0, 500).map((p, i) => `${i + 1}. ${p.name} [${p.id}]`).join("\n");
    const w = window.open("", "_blank", "noopener");
    if (!w) { alert(`List preview:\n\n${snippet}`); return; }
    w.document.title = "Torn Cycler — preview";
    w.document.body.style.background = "#111";
    w.document.body.style.color = "#fff";
    w.document.body.style.fontFamily = "system-ui, Arial";
    w.document.body.style.padding = "12px";
    const pre = w.document.createElement("pre");
    pre.textContent = snippet;
    pre.style.whiteSpace = "pre-wrap";
    w.document.body.appendChild(pre);
  }

  /* ---------- safe faction-grab logic ---------- */
  function extractIdFromAnchor(a) {
    if (!a) return null;
    const href = a.getAttribute("href") || "";
    const m1 = href.match(/[?&]XID=(\d+)/i);
    if (m1) return m1[1];
    const m2 = href.match(/[?&]user2ID=(\d+)/i);
    if (m2) return m2[1];
    return null;
  }

  function findMemberListsMatchingURL() {
    const params = getURLSearch();
    const urlID  = params.get("ID");
    const all    = Array.from(document.querySelectorAll(".members-list"));
    if (!all.length) return all;
    if (!urlID) return all;
    const matched = all.filter(list => {
      const wrap   = list.closest(".faction-info-wrap.restyle, .members-cont") || list;
      const anchor = wrap.querySelector("a[href*='step=profile&ID=']");
      if (!anchor) return false;
      const m = (anchor.getAttribute("href") || "").match(/ID=(\d+)/);
      return m && m[1] === urlID;
    });
    return matched.length ? matched : all;
  }

  function grabMembersFromPage() {
    if (isYourFactionPage()) {
      alert("Disabled on your faction pages (step=your). Go to a faction profile page.");
      return;
    }

    const lists = findMemberListsMatchingURL();
    if (!lists || !lists.length) {
      alert("No member lists found. Make sure you're on a faction profile member list.");
      return;
    }

    const seen = new Set();
    const out  = [];

    for (const list of lists) {
      const style = window.getComputedStyle(list);
      if (style && style.display === "none") continue;

      const rows = Array.from(list.querySelectorAll("li.table-row, .your, .enemy, div.table-row, ul > li"));
      for (const row of rows) {
        const anchor = row.querySelector('a[href*="XID="], a[href*="user2ID="]');
        if (!anchor) continue;
        const id = extractIdFromAnchor(anchor);
        if (!id || seen.has(id)) continue;

        let nameEl = row.querySelector(".honorName___JWG9U, .honorName, .ellipsis, .text___chra_, .name, a[href*='profiles.php']");
        let name   = nameEl ? (nameEl.textContent || "").trim() : (anchor.textContent || "").trim();
        if (!name) name = `Player ${id}`;

        seen.add(id);
        out.push({ id: Number(id), name });
      }

      const params = getURLSearch();
      if (params.get("ID") && out.length) break;
    }

    if (!out.length) {
      alert("No members found. Try scrolling the member list fully before grabbing.");
      return;
    }

    saveList(out);
    setIndex(0);
    updateIdxDisplay();
    alert(`Grabbed ${out.length} members.`);
    console.log("Torn Cycler — saved list:", out);
  }

  /* ---------- navigation ---------- */
  function openLoaderFor(id) {
    const url = `https://www.torn.com/loader.php?sid=attack&user2ID=${encodeURIComponent(id)}`;
    window.location.href = url;
  }

  function gotoNext() {
    const list = loadList();
    if (!list.length) return alert("Empty list. Use 'Grab members' first.");
    let idx = getIndex();
    if (idx + 1 >= list.length) {
      alert("Reached the end of the list.");
      return;
    }
    idx = idx + 1;
    setIndex(idx);
    updateIdxDisplay();
    openLoaderFor(list[idx].id);
  }

  function gotoPrev() {
    if (isYourFactionPage()) {
      alert("Disabled on your faction pages (step=your).");
      return;
    }
    const list = loadList();
    if (!list.length) return alert("Empty list. Use 'Grab members' first.");
    let idx = getIndex() - 1;
    if (idx < 0) idx = list.length - 1;
    setIndex(idx);
    updateIdxDisplay();
    openLoaderFor(list[idx].id);
  }

  /* ---------- init & SPA hooks ---------- */
  function ensureUI() {
    if (!document.body) return setTimeout(ensureUI, 50);
    createFab();
    createPanel();
    applyBlockState();
  }

  function hookRouting() {
    const _push = history.pushState;
    history.pushState = function () {
      const r = _push.apply(this, arguments);
      setTimeout(ensureUI, 50);
      return r;
    };
    window.addEventListener("popstate",  () => setTimeout(ensureUI, 50));
    window.addEventListener("hashchange",() => setTimeout(ensureUI, 50));
  }

  onReady(() => {
    hookRouting();
    let tries = 0;
    const t = setInterval(() => {
      ensureUI();
      tries++;
      if (tries > 40) clearInterval(t);
    }, 100);

    // quick console helpers
    try { window.Cycler = { open: showPanel, close: hidePanel, grab: grabMembersFromPage }; } catch {}
  });
})();
