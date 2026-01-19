// ==UserScript==
// @name         Torn Company ID Harvester
// @namespace    grimsnecrosis.company.id.harvester
// @version      1.2.2
// @description  Middle Click the 👁 on job listings to save company IDs (blocks new tab)
// @author       Grimsnecrosis
// @match        https://www.torn.com/joblist.php*
// @run-at       document-start
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/563175/Torn%20Company%20ID%20Harvester.user.js
// @updateURL https://update.greasyfork.org/scripts/563175/Torn%20Company%20ID%20Harvester.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const STORE_KEY = "grims_company_ids_v3";
  const POS_KEY   = "grims_company_ids_panel_pos_v2";

  // Middle-click behavior
  const SAVE_ON_MIDDLE_CLICK = true;     // middle click the 👁 link to save
  const BLOCK_NAV_ON_MIDDLE  = true;     // prevent opening a new tab on middle click

  /**
   * Optional: save even if the user clicks on the row (not just the 👁).
   * Leave false for least interference.
   */
  const SAVE_ON_ROW_CLICK = false;

  /**
   * Auto-tagging rules (edit these to your taste).
   * We tag based on nearby row text: company name/type/stars/pay text if visible.
   */
  const AUTO_TAG_RULES = [
    { re: /\boil\s*rig\b/i, tag: "oil rig" },
    { re: /\bmin(e|ing)\b/i, tag: "mining" },
    { re: /\b10\*|\b10\s*star/i, tag: "10*" },
    { re: /\b9\*|\b9\s*star/i, tag: "9*" },
    { re: /\b8\*|\b8\s*star/i, tag: "8*" },
    { re: /\bhigh\s*pay\b/i, tag: "high-pay" },
    { re: /\bpayroll\b/i, tag: "payroll" },
  ];

  // --- Utils
  const isoNow = () => new Date().toISOString();

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const obj = raw ? JSON.parse(raw) : null;
      if (!obj || typeof obj !== "object") return { ids: {} };
      if (!obj.ids || typeof obj.ids !== "object") obj.ids = {};
      return obj;
    } catch {
      return { ids: {} };
    }
  }
  function saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }
  function allIdsSorted(store) {
    return Object.keys(store.ids).map(n => Number(n)).filter(Boolean).sort((a,b)=>a-b);
  }
  function upsertRecord(id, tagsToAdd = []) {
    const store = loadStore();
    const key = String(id);
    const now = isoNow();

    if (!store.ids[key]) store.ids[key] = { id, firstSeen: now, lastSeen: now, tags: [] };
    else store.ids[key].lastSeen = now;

    const rec = store.ids[key];
    const set = new Set([...(rec.tags || []), ...tagsToAdd.filter(Boolean)]);
    rec.tags = Array.from(set).sort();

    saveStore(store);
    return { store, rec, isNew: rec.firstSeen === now };
  }
  function clearAll() { localStorage.removeItem(STORE_KEY); }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // --- Toast
  GM_addStyle(`
    #grimToast{
      position:fixed;bottom:20px;left:20px;z-index:999999;
      background:rgba(0,0,0,.85);color:#fff;padding:10px 12px;border-radius:10px;
      border:1px solid rgba(255,255,255,.15);
      font-family:Arial,sans-serif;font-size:13px;display:none;max-width:70vw;
    }
  `);
  let toastTimer = null;
  function toast(msg) {
    let el = document.getElementById("grimToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "grimToast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.style.display = "none"), 2200);
  }

  // --- Panel
  GM_addStyle(`
    #grimHarvesterPanel{
      position:fixed;top:90px;left:8px;width:330px;z-index:99999;
      background:rgba(10,10,10,.92);
      border:1px solid rgba(255,255,255,.15);
      border-radius:10px;
      box-shadow:0 10px 30px rgba(0,0,0,.35);
      color:#eaeaea;font-family:Arial,sans-serif;overflow:hidden;
    }
    #grimHarvesterPanel header{
      padding:10px 12px;display:flex;align-items:center;justify-content:space-between;
      border-bottom:1px solid rgba(255,255,255,.1);
      cursor:move;user-select:none;gap:8px;
    }
    #grimHarvesterPanel header .title{font-weight:800;font-size:13px;}
    #grimHarvesterPanel header .sub{font-size:11px;opacity:.75;margin-top:2px;}
    #grimHarvesterPanel .btnRow{
      display:flex;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.08);
      flex-wrap:wrap;
    }
    #grimHarvesterPanel button,#grimHarvesterPanel input{
      background:rgba(255,255,255,.08);
      border:1px solid rgba(255,255,255,.12);
      color:#eaeaea;padding:7px 8px;border-radius:8px;cursor:pointer;font-size:12px;outline:none;
    }
    #grimHarvesterPanel button:hover{background:rgba(255,255,255,.12);}
    #grimHarvesterPanel input{cursor:text;width:100%;box-sizing:border-box;}
    #grimHarvesterPanel .body{padding:10px 12px;font-size:12px;max-height:320px;overflow:auto;line-height:1.35;}
    #grimHarvesterPanel .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;}
    #grimHarvesterPanel .muted{opacity:.75;}
    #grimHarvesterPanel .pill{
      display:inline-block;padding:2px 6px;border-radius:999px;
      background:rgba(255,255,255,.10);
      border:1px solid rgba(255,255,255,.12);
      margin:2px 4px 0 0;font-size:11px;
    }
    .minBtn{font-size:12px;padding:5px 10px;white-space:nowrap;}
    .danger{background:rgba(255,80,80,.15)!important;border-color:rgba(255,80,80,.25)!important;}
    .ok{background:rgba(80,255,140,.12)!important;border-color:rgba(80,255,140,.22)!important;}
  `);

  function loadPanelPos(panel) {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return;
      const pos = JSON.parse(raw);
      if (pos && typeof pos === "object") {
        if (typeof pos.left === "number") panel.style.left = `${Math.max(0, pos.left)}px`;
        if (typeof pos.top === "number") panel.style.top = `${Math.max(0, pos.top)}px`;
      }
    } catch {}
  }
  function savePanelPos(panel) {
    const r = panel.getBoundingClientRect();
    localStorage.setItem(POS_KEY, JSON.stringify({ left: r.left, top: r.top }));
  }

  let minimized = false;

  function renderPanel() {
    const body = document.getElementById("grimBody");
    if (!body) return;

    const store = loadStore();
    const ids = allIdsSorted(store);

    body.innerHTML = `
      <div class="muted">Saved companies: <b>${ids.length}</b></div>
      <div class="muted">Middle-click 👁 to save ${BLOCK_NAV_ON_MIDDLE ? "(stays on page)" : ""}</div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:10px 0;">
      ${
        ids.length
          ? ids.slice(-140).reverse().map(id => {
              const r = store.ids[String(id)];
              const tags = (r?.tags || []);
              return `
                <div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <div class="mono"><b>${id}</b></div>
                  <div class="muted">first: ${r?.firstSeen?.slice(0,19).replace("T"," ")} | last: ${r?.lastSeen?.slice(0,19).replace("T"," ")}</div>
                  <div>${tags.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("") || '<span class="muted">(no tags)</span>'}</div>
                </div>
              `;
            }).join("")
          : `<div class="mono muted">(none yet)</div>`
      }
    `;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => toast("Copied to clipboard"),
        () => toast("Clipboard blocked — use Export .txt")
      );
    } else {
      toast("No clipboard API — use Export .txt");
    }
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(`Downloaded ${filename}`);
  }

  function downloadJson(filename, obj) {
    const text = JSON.stringify(obj, null, 2);
    const blob = new Blob([text], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(`Downloaded ${filename}`);
  }

  function buildPanel() {
    if (document.getElementById("grimHarvesterPanel")) return;

    const panel = document.createElement("div");
    panel.id = "grimHarvesterPanel";
    panel.innerHTML = `
      <header>
        <div>
          <div class="title">🏢 Company ID Harvester</div>
          <div class="sub muted">Middle-click 👁 to save</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="minBtn" id="grimMinBtn">–</button>
        </div>
      </header>

      <div class="btnRow" id="grimBtnRow">
        <button id="grimCopyCsv" class="ok">Copy CSV</button>
        <button id="grimCopyEnv">Copy .env</button>
        <button id="grimExportTxt">Export .txt</button>
        <button id="grimExportJson">Export JSON</button>
        <button id="grimClear" class="danger">Clear</button>
      </div>

      <div class="btnRow" id="grimTagRow">
        <input id="grimTagInput" placeholder="Quick tag for next save (e.g., oil rig)" />
      </div>

      <div class="body" id="grimBody"></div>
    `;

    document.body.appendChild(panel);
    loadPanelPos(panel);

    document.getElementById("grimMinBtn").addEventListener("click", () => {
      minimized = !minimized;
      document.getElementById("grimBtnRow").style.display = minimized ? "none" : "flex";
      document.getElementById("grimTagRow").style.display = minimized ? "none" : "flex";
      document.getElementById("grimBody").style.display = minimized ? "none" : "block";
      document.getElementById("grimMinBtn").textContent = minimized ? "+" : "–";
      savePanelPos(panel);
    });

    document.getElementById("grimCopyCsv").addEventListener("click", () => {
      copyToClipboard(allIdsSorted(loadStore()).join(","));
    });

    document.getElementById("grimCopyEnv").addEventListener("click", () => {
      copyToClipboard(`COMPANY_IDS=${allIdsSorted(loadStore()).join(",")}`);
    });

    document.getElementById("grimExportTxt").addEventListener("click", () => {
      const store = loadStore();
      const ids = allIdsSorted(store);
      const lines = ids.map(id => {
        const r = store.ids[String(id)];
        const tags = (r?.tags || []).join(", ");
        return `${id}${tags ? `\t${tags}` : ""}`;
      });
      downloadText(`company_ids_${new Date().toISOString().slice(0,10)}.txt`, lines.join("\n"));
    });

    document.getElementById("grimExportJson").addEventListener("click", () => {
      const store = loadStore();
      downloadJson(`company_ids_${new Date().toISOString().slice(0,10)}.json`, store);
    });

    document.getElementById("grimClear").addEventListener("click", () => {
      if (!confirm("Clear ALL saved company IDs + tags?")) return;
      clearAll();
      renderPanel();
      toast("Cleared.");
    });

    // drag
    const header = panel.querySelector("header");
    let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;

    header.addEventListener("mousedown", (e) => {
      if (e.target && e.target.id === "grimMinBtn") return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const r = panel.getBoundingClientRect();
      startLeft = r.left;
      startTop = r.top;
      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = `${Math.max(0, startLeft + dx)}px`;
      panel.style.top = `${Math.max(0, startTop + dy)}px`;
    });

    window.addEventListener("mouseup", () => {
      if (dragging) savePanelPos(panel);
      dragging = false;
    });

    renderPanel();
    toast("Harvester ready");
  }

  buildPanel();

  /**********************
   * CORPINFO LINK PARSING
   **********************/
  function companyIdFromUrl(href) {
    try {
      const url = new URL(href, location.origin);

      // A) Standard querystring: ?ID=123
      const qid = url.searchParams.get("ID") || url.searchParams.get("id");
      if (qid && /^\d+$/.test(qid)) return Number(qid);

      // B) Hash / hashbang: #/p=corp&ID=16  or  #!p=corpinfo&ID=76299
      const rawHash = (url.hash || "").replace(/^#\!?\/?/, "");
      if (rawHash) {
        const hp = new URLSearchParams(rawHash.replace(/\?/g, "&"));
        const hid = hp.get("ID") || hp.get("id");
        if (hid && /^\d+$/.test(hid)) return Number(hid);
      }

      return null;
    } catch {
      return null;
    }
  }

  function isCorpInfoHref(href) {
    if (!href) return false;
    const s = String(href);
    return s.includes("corpinfo") || s.includes("p=corpinfo") || s.includes("!p=corpinfo");
  }

  function findCorpInfoAnchor(el) {
    if (!el) return null;

    const a0 = el.closest?.("a");
    if (a0) {
      const href0 =
        a0.getAttribute("href") ||
        a0.getAttribute("data-href") ||
        a0.href ||
        "";
      if (isCorpInfoHref(href0)) return a0;
    }

    const row = el.closest?.("tr") || el.closest?.("table") || null;
    if (row) {
      const a1 = row.querySelector?.("a[href*='corpinfo'], a[href*='p=corpinfo'], a[href*='!p=corpinfo']");
      if (a1) return a1;
    }

    return null;
  }

  function computeAutoTags(rowText) {
    const tags = [];
    const text = String(rowText || "");
    for (const r of AUTO_TAG_RULES) {
      if (r.re.test(text)) tags.push(r.tag);
    }
    return tags;
  }

  function harvestFromEvent(e) {
    const a = findCorpInfoAnchor(e.target);
    if (!a) return false;

    const href = a.getAttribute("href") || a.getAttribute("data-href") || a.href || "";
    const id = companyIdFromUrl(href);
    if (!id) return false;

    const row =
      e.target?.closest?.("tr") ||
      e.target?.closest?.(".job") ||
      e.target?.closest?.("table") ||
      null;

    const rowText = (row?.innerText || "").trim();

    const quickTag = (document.getElementById("grimTagInput")?.value || "").trim();
    const tags = [
      ...(quickTag ? [quickTag] : []),
      ...computeAutoTags(rowText),
    ];

    const { isNew } = upsertRecord(id, tags);
    renderPanel();
    toast(`${isNew ? "Saved" : "Updated"} company ID ${id}${tags.length ? ` (${tags.join(", ")})` : ""}`);

    if (quickTag) document.getElementById("grimTagInput").value = "";

    return true;
  }

  // -----------------------------------
  // MIDDLE-CLICK INTERCEPTION
  // -----------------------------------
  function isMiddleClickEvent(e) {
    return typeof e.button === "number" && e.button === 1;
  }

  for (const evt of ["pointerdown", "mousedown", "auxclick"]) {
    document.addEventListener(evt, (e) => {
      if (!SAVE_ON_MIDDLE_CLICK) return;

      // Only handle middle clicks
      const isMiddle =
        (evt === "pointerdown" && (e.buttons & 4) === 4) ||
        (evt !== "pointerdown" && isMiddleClickEvent(e));

      if (!isMiddle) return;

      // Optional: require the click to be on a corpinfo link unless SAVE_ON_ROW_CLICK
      if (!SAVE_ON_ROW_CLICK) {
        const a = e.target?.closest?.("a");
        const href = a?.getAttribute?.("href") || a?.href || "";
        if (!isCorpInfoHref(href)) return;
      }

      const saved = harvestFromEvent(e);
      if (!saved) return;

      if (BLOCK_NAV_ON_MIDDLE) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
      }
    }, true);
  }

})();
