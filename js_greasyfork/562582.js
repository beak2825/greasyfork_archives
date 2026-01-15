// ==UserScript==
// @name         TORN Travel Stock prices
// @namespace    torn.com
// @version      1.0.5
// @description  Travel watchlist panel (reads TornTools stock/price + weav3r MV)
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/page.php?sid=travel*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      weav3r.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562582/TORN%20Travel%20Stock%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/562582/TORN%20Travel%20Stock%20prices.meta.js
// ==/UserScript==

(() => {
  const LS = {
    apiKey: "sgtt_apiKey",
    itemsDB: "sgtt_itemsDB",
    watch: "sgtt_watchlist",
    mv: "sgtt_mvCache",
    pos: "sgtt_panelPos",
    hidden: "sgtt_panelHidden"
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const loadJson = (k, fallback) => {
    try {
      const v = localStorage.getItem(k);
      if (!v) return fallback;
      return JSON.parse(v);
    } catch {
      return fallback;
    }
  };

  const saveJson = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const fmtInt = (n) => {
    if (n === null || n === undefined || !Number.isFinite(Number(n))) return "N/A";
    return Number(n).toLocaleString("en-US");
  };

  const fmtMoney = (n) => {
    if (n === null || n === undefined || !Number.isFinite(Number(n))) return "N/A";
    return "$" + Number(n).toLocaleString("en-US");
  };

  const normalizeName = (s) => (s || "").trim().toLowerCase();

  const getApiKey = () => (localStorage.getItem(LS.apiKey) || "").trim();
  const setApiKey = (v) => localStorage.setItem(LS.apiKey, (v || "").trim());

  const getItemsDB = () => loadJson(LS.itemsDB, []);
  const setItemsDB = (arr) => saveJson(LS.itemsDB, Array.isArray(arr) ? arr : []);

  const getWatchlist = () => loadJson(LS.watch, []);
  const setWatchlist = (arr) => saveJson(LS.watch, Array.isArray(arr) ? arr : []);

  const getMvCache = () => loadJson(LS.mv, {});
  const setMvCache = (obj) => saveJson(LS.mv, obj && typeof obj === "object" ? obj : {});

  const getHidden = () => localStorage.getItem(LS.hidden) === "1";
  const setHidden = (v) => localStorage.setItem(LS.hidden, v ? "1" : "0");

  const defaultPos = { x: 24, y: 120 };
  const getPos = () => loadJson(LS.pos, defaultPos);
  const setPos = (p) => saveJson(LS.pos, { x: Math.round(p.x), y: Math.round(p.y) });

  const gmGetJson = (url) =>
    new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { accept: "application/json" },
        onload: (r) => {
          try {
            resolve(JSON.parse(r.responseText));
          } catch (e) {
            reject(e);
          }
        },
        onerror: (e) => reject(e),
        ontimeout: (e) => reject(e)
      });
    });

  let panel, headerEl, statusEl, apiInput, itemInput, dataListEl, listEl;
  let ttMap = new Map();
  let lastTTStamp = 0;

  GM_addStyle(`
    #sgtt-panel{
      position: fixed;
      z-index: 999999;
      width: 420px;
      max-width: calc(100vw - 16px);
      background: #1f1f1f;
      border: 2px solid #39ff14;
      border-radius: 10px;
      color: #eaeaea;
      box-shadow: 0 8px 28px rgba(0,0,0,.55);
      font-family: Arial, Helvetica, sans-serif;
      user-select: none;
    }
    #sgtt-header{
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding: 10px 10px 8px 12px;
      border-bottom: 1px solid rgba(57,255,20,.35);
      cursor: grab;
      gap: 10px;
    }
    #sgtt-title{
      font-weight: 700;
      font-size: 14px;
      letter-spacing: .2px;
      color: #caffc2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #sgtt-close{
      background: transparent;
      border: 1px solid rgba(57,255,20,.55);
      color: #39ff14;
      border-radius: 8px;
      width: 28px;
      height: 28px;
      cursor: pointer;
      font-weight: 800;
      line-height: 26px;
      text-align: center;
      padding: 0;
    }
    #sgtt-body{
      padding: 10px 12px 12px 12px;
    }
    .sgtt-row{
      display:flex;
      gap: 8px;
      align-items:center;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .sgtt-row label{
      font-size: 12px;
      opacity: .9;
      margin-right: 4px;
    }
    .sgtt-input{
      flex: 1 1 220px;
      min-width: 160px;
      background: #121212;
      border: 1px solid rgba(57,255,20,.35);
      color: #eaeaea;
      padding: 8px 10px;
      border-radius: 8px;
      outline: none;
      user-select: text;
    }
    .sgtt-btn{
      background: #121212;
      border: 1px solid rgba(57,255,20,.65);
      color: #39ff14;
      padding: 8px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
    }
    .sgtt-btn:disabled{
      opacity: .55;
      cursor: not-allowed;
    }
    #sgtt-status{
      font-size: 12px;
      opacity: .9;
      margin: 6px 0 10px 0;
      white-space: pre-wrap;
      user-select: text;
    }
    #sgtt-list{
      display:flex;
      flex-direction: column;
      gap: 8px;
      max-height: 46vh;
      overflow: auto;
      padding-right: 2px;
    }
    .sgtt-item{
      display:flex;
      gap: 10px;
      align-items:flex-start;
      padding: 8px 10px;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(57,255,20,.25);
      border-radius: 10px;
    }
    .sgtt-item-main{
      flex: 1 1 auto;
      min-width: 0;
      user-select: text;
      line-height: 1.35;
      font-size: 12px;
      word-break: break-word;
    }
    .sgtt-item-main .sgtt-name{
      font-weight: 800;
      color: #caffc2;
      font-size: 13px;
    }
    .sgtt-item-main .sgtt-sub{
      opacity: .92;
      margin-top: 3px;
    }
    .sgtt-x{
      background: transparent;
      border: 1px solid rgba(57,255,20,.65);
      color: #39ff14;
      border-radius: 8px;
      width: 28px;
      height: 28px;
      cursor: pointer;
      font-weight: 900;
      line-height: 26px;
      text-align: center;
      padding: 0;
      flex: 0 0 auto;
    }
  `);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const applyPos = () => {
    const p = getPos();
    const w = panel.offsetWidth || 420;
    const h = panel.offsetHeight || 240;
    const x = clamp(p.x, 8, Math.max(8, window.innerWidth - w - 8));
    const y = clamp(p.y, 8, Math.max(8, window.innerHeight - h - 8));
    panel.style.left = x + "px";
    panel.style.top = y + "px";
    setPos({ x, y });
  };

  const setStatus = (s) => {
    if (!statusEl) return;
    statusEl.textContent = s || "";
  };

  const ensurePanel = () => {
    if (panel) return;

    panel = document.createElement("div");
    panel.id = "sgtt-panel";

    headerEl = document.createElement("div");
    headerEl.id = "sgtt-header";

    const title = document.createElement("div");
    title.id = "sgtt-title";
    title.textContent = "TORN Travel Watchlist";

    const closeBtn = document.createElement("button");
    closeBtn.id = "sgtt-close";
    closeBtn.type = "button";
    closeBtn.textContent = "x";
    closeBtn.addEventListener("click", () => {
      setHidden(true);
      panel.style.display = "none";
    });

    headerEl.appendChild(title);
    headerEl.appendChild(closeBtn);

    const body = document.createElement("div");
    body.id = "sgtt-body";

    const apiRow = document.createElement("div");
    apiRow.className = "sgtt-row";

    const apiLbl = document.createElement("label");
    apiLbl.textContent = "API Key";

    apiInput = document.createElement("input");
    apiInput.className = "sgtt-input";
    apiInput.type = "password";
    apiInput.placeholder = "Enter Torn API key";
    apiInput.value = getApiKey();

    const saveBtn = document.createElement("button");
    saveBtn.className = "sgtt-btn";
    saveBtn.type = "button";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
      setApiKey(apiInput.value);
      setStatus("Saved API key.");
    });

    const fetchItemsBtn = document.createElement("button");
    fetchItemsBtn.className = "sgtt-btn";
    fetchItemsBtn.type = "button";
    fetchItemsBtn.textContent = "Fetch Torn items";
    fetchItemsBtn.addEventListener("click", async () => {
      const key = getApiKey();
      if (!key) {
        setStatus("Missing API key.");
        return;
      }
      fetchItemsBtn.disabled = true;
      setStatus("Fetching Torn items...");
      try {
        const url = "https://api.torn.com/v2/torn/items?sort=ASC&key=" + encodeURIComponent(key);
        const r = await fetch(url, { method: "GET", headers: { accept: "application/json" } });
        const j = await r.json();
        const items = j && j.items ? j.items : null;

        let arr = [];
        if (Array.isArray(items)) {
          arr = items
            .map((it) => ({ id: Number(it.id), name: String(it.name || "").trim() }))
            .filter((x) => Number.isFinite(x.id) && x.name);
        } else if (items && typeof items === "object") {
          arr = Object.values(items)
            .map((it) => ({ id: Number(it.id), name: String(it.name || "").trim() }))
            .filter((x) => Number.isFinite(x.id) && x.name);
        }

        arr.sort((a, b) => a.name.localeCompare(b.name));
        setItemsDB(arr);
        rebuildDatalist();
        setStatus("Saved items DB: " + fmtInt(arr.length));
      } catch (e) {
        setStatus("Failed fetching items DB.");
      } finally {
        fetchItemsBtn.disabled = false;
      }
    });

    apiRow.appendChild(apiLbl);
    apiRow.appendChild(apiInput);
    apiRow.appendChild(saveBtn);
    apiRow.appendChild(fetchItemsBtn);

    const itemRow = document.createElement("div");
    itemRow.className = "sgtt-row";

    const itemLbl = document.createElement("label");
    itemLbl.textContent = "Item";

    itemInput = document.createElement("input");
    itemInput.className = "sgtt-input";
    itemInput.type = "text";
    itemInput.placeholder = "Start typing item name...";
    itemInput.setAttribute("autocomplete", "off");

    dataListEl = document.createElement("datalist");
    dataListEl.id = "sgtt-datalist";
    itemInput.setAttribute("list", dataListEl.id);

    const addBtn = document.createElement("button");
    addBtn.className = "sgtt-btn";
    addBtn.type = "button";
    addBtn.textContent = "Add";
    addBtn.addEventListener("click", () => {
      const raw = (itemInput.value || "").trim();
      if (!raw) return;

      const itemsDB = getItemsDB();
      let id = null;
      let name = raw;

      if (/^\d+$/.test(raw)) {
        const n = Number(raw);
        if (Number.isFinite(n)) {
          id = n;
          const found = itemsDB.find((x) => x.id === id);
          if (found) name = found.name;
        }
      } else {
        const key = normalizeName(raw);
        const found = itemsDB.find((x) => normalizeName(x.name) === key);
        if (found) {
          id = found.id;
          name = found.name;
        }
      }

      const w = getWatchlist();
      const exists = w.some((it) => (id !== null ? it.id === id : normalizeName(it.name) === normalizeName(name)));
      if (!exists) {
        w.push({ id, name });
        setWatchlist(w);
        itemInput.value = "";
        renderWatchlist();
        setStatus("Added: " + name);
      }
    });

    itemRow.appendChild(itemLbl);
    itemRow.appendChild(itemInput);
    itemRow.appendChild(addBtn);

    statusEl = document.createElement("div");
    statusEl.id = "sgtt-status";

    const mvRow = document.createElement("div");
    mvRow.className = "sgtt-row";

    const fetchMvBtn = document.createElement("button");
    fetchMvBtn.className = "sgtt-btn";
    fetchMvBtn.type = "button";
    fetchMvBtn.textContent = "Fetch MV (weav3r)";
    fetchMvBtn.addEventListener("click", async () => {
      const w = getWatchlist().filter((x) => Number.isFinite(Number(x.id)));
      if (!w.length) {
        setStatus("Watchlist has no item IDs.");
        return;
      }
      fetchMvBtn.disabled = true;
      setStatus("Fetching MV for " + fmtInt(w.length) + " items...");
      const cache = getMvCache();

      for (let i = 0; i < w.length; i++) {
        const it = w[i];
        const id = Number(it.id);
        try {
          const j = await gmGetJson("https://weav3r.dev/api/marketplace/" + id);
          const listings = Array.isArray(j && j.listings) ? j.listings : [];
          let mv = null;
          if (listings.length) {
            let min = Infinity;
            for (const l of listings) {
              const p = Number(l && l.price);
              if (Number.isFinite(p) && p > 0 && p < min) min = p;
            }
            if (min !== Infinity) mv = min;
          }
          cache[String(id)] = mv;
          setMvCache(cache);
          setStatus("MV updated: " + (it.name || id) + " -> " + fmtMoney(mv) + "\n" + "Progress: " + fmtInt(i + 1) + "/" + fmtInt(w.length));
          renderWatchlist();
        } catch {
          setStatus("MV fetch failed: " + (it.name || id) + "\n" + "Progress: " + fmtInt(i + 1) + "/" + fmtInt(w.length));
        }
        await sleep(650);
      }

      fetchMvBtn.disabled = false;
      setStatus("MV fetch done.");
    });

    const refreshTTBtn = document.createElement("button");
    refreshTTBtn.className = "sgtt-btn";
    refreshTTBtn.type = "button";
    refreshTTBtn.textContent = "Refresh TornTools";
    refreshTTBtn.addEventListener("click", () => {
      refreshTornTools(true);
      renderWatchlist();
      setStatus("Refreshed TornTools data.");
    });

    mvRow.appendChild(fetchMvBtn);
    mvRow.appendChild(refreshTTBtn);

    listEl = document.createElement("div");
    listEl.id = "sgtt-list";

    body.appendChild(apiRow);
    body.appendChild(itemRow);
    body.appendChild(dataListEl);
    body.appendChild(statusEl);
    body.appendChild(mvRow);
    body.appendChild(listEl);

    panel.appendChild(headerEl);
    panel.appendChild(body);

    document.body.appendChild(panel);

    rebuildDatalist();
    enableDrag();
    applyPos();

    if (getHidden()) panel.style.display = "none";
    renderWatchlist();
  };

  const rebuildDatalist = () => {
    if (!dataListEl) return;
    const itemsDB = getItemsDB();
    dataListEl.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (const it of itemsDB) {
      const opt = document.createElement("option");
      opt.value = it.name;
      frag.appendChild(opt);
    }
    dataListEl.appendChild(frag);
  };

  const parseItemIdFromHref = (href) => {
    const m = String(href || "").match(/itemID=(\d+)/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : null;
  };

  const readTornToolsMap = () => {
    const table = $("#tt-travel-table");
    if (!table) return new Map();

    const rows = $$(".row", table).filter((r) => !r.classList.contains("header"));
    const map = new Map();

    for (const row of rows) {
      const a = $("a.item", row);
      if (!a) continue;

      const id = parseItemIdFromHref(a.getAttribute("href"));
      if (!Number.isFinite(id)) continue;

      const country = (($(".country .name", row) || {}).textContent || row.dataset.country || "").trim();
      const stockRaw = row.dataset.stock ?? (($(".stock", row) || {}).getAttribute ? $(".stock", row).getAttribute("value") : null);
      const buyRaw = row.dataset.cost ?? (($(".buy-price", row) || {}).getAttribute ? $(".buy-price", row).getAttribute("value") : null);

      const stock = Number(stockRaw);
      const buy = Number(buyRaw);

      const entry = {
        country: country || "Unknown",
        stock: Number.isFinite(stock) ? stock : null,
        buy: Number.isFinite(buy) ? buy : null
      };

      const arr = map.get(id) || [];
      const idx = arr.findIndex((x) => x.country === entry.country);
      if (idx >= 0) arr[idx] = entry;
      else arr.push(entry);

      map.set(id, arr);
    }

    for (const [id, arr] of map.entries()) {
      arr.sort((a, b) => String(a.country).localeCompare(String(b.country)));
      map.set(id, arr);
    }

    return map;
  };

  const refreshTornTools = (force) => {
    const now = Date.now();
    if (!force && now - lastTTStamp < 900) return;
    lastTTStamp = now;
    ttMap = readTornToolsMap();
  };

  const resolveName = (id, fallbackName) => {
    if (Number.isFinite(Number(id))) {
      const itemsDB = getItemsDB();
      const found = itemsDB.find((x) => x.id === Number(id));
      if (found && found.name) return found.name;
    }
    return (fallbackName || "").trim() || String(id || "").trim() || "Unknown";
  };

  const buildCountriesLine = (id) => {
    if (!Number.isFinite(Number(id))) return "S: N/A | Price: N/A";
    const arr = ttMap.get(Number(id)) || [];
    if (!arr.length) return "S: N/A | Price: N/A";
    return arr
      .map((e) => `${e.country} | S: ${fmtInt(e.stock)} | Price: ${fmtMoney(e.buy)}`)
      .join("\n");
  };

  const renderWatchlist = () => {
    ensurePanel();
    refreshTornTools(false);

    const w = getWatchlist();
    const mv = getMvCache();

    listEl.innerHTML = "";

    for (let i = 0; i < w.length; i++) {
      const it = w[i];
      const id = Number.isFinite(Number(it.id)) ? Number(it.id) : null;
      const name = resolveName(id, it.name);
      const mvVal = id !== null ? (Object.prototype.hasOwnProperty.call(mv, String(id)) ? mv[String(id)] : null) : null;

      const row = document.createElement("div");
      row.className = "sgtt-item";

      const main = document.createElement("div");
      main.className = "sgtt-item-main";

      const nameEl = document.createElement("div");
      nameEl.className = "sgtt-name";
      nameEl.textContent = name + (id !== null ? " (" + id + ")" : "");

      const sub1 = document.createElement("div");
      sub1.className = "sgtt-sub";
      sub1.textContent = "MV: " + fmtMoney(mvVal);

      const sub2 = document.createElement("div");
      sub2.className = "sgtt-sub";
      sub2.style.whiteSpace = "pre-wrap";
      sub2.textContent = buildCountriesLine(id);

      main.appendChild(nameEl);
      main.appendChild(sub1);
      main.appendChild(sub2);

      const x = document.createElement("button");
      x.className = "sgtt-x";
      x.type = "button";
      x.textContent = "X";
      x.addEventListener("click", () => {
        const nw = getWatchlist();
        nw.splice(i, 1);
        setWatchlist(nw);
        renderWatchlist();
      });

      row.appendChild(main);
      row.appendChild(x);
      listEl.appendChild(row);
    }

    if (!w.length) {
      const empty = document.createElement("div");
      empty.style.opacity = ".85";
      empty.style.fontSize = "12px";
      empty.textContent = "Watchlist is empty.";
      listEl.appendChild(empty);
    }
  };

  const enableDrag = () => {
    let dragging = false;
    let startX = 0, startY = 0, baseX = 0, baseY = 0;

    const onDown = (e) => {
      if (e.target && (e.target.id === "sgtt-close" || e.target.classList.contains("sgtt-btn") || e.target.classList.contains("sgtt-x") || e.target.classList.contains("sgtt-input"))) return;
      dragging = true;
      headerEl.style.cursor = "grabbing";
      const p = getPos();
      baseX = p.x;
      baseY = p.y;
      startX = e.clientX;
      startY = e.clientY;
      if (headerEl.setPointerCapture) headerEl.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setPos({ x: baseX + dx, y: baseY + dy });
      applyPos();
    };

    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      headerEl.style.cursor = "grab";
      if (headerEl.releasePointerCapture) {
        try { headerEl.releasePointerCapture(e.pointerId); } catch {}
      }
    };

    headerEl.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", () => applyPos());
  };

  GM_registerMenuCommand("show", () => {
    ensurePanel();
    setHidden(false);
    panel.style.display = "";
    applyPos();
  });

  GM_registerMenuCommand("close", () => {
    ensurePanel();
    setHidden(true);
    panel.style.display = "none";
  });

  GM_registerMenuCommand("reset_location", () => {
    ensurePanel();
    setPos(defaultPos);
    applyPos();
  });

  const attachTableObserver = () => {
    const tryAttach = () => {
      const table = $("#tt-travel-table");
      if (!table) return false;

      const obs = new MutationObserver(() => {
        refreshTornTools(true);
        renderWatchlist();
      });

      obs.observe(table, { childList: true, subtree: true, attributes: true });
      return true;
    };

    if (tryAttach()) return;

    const rootObs = new MutationObserver(() => {
      if (tryAttach()) rootObs.disconnect();
    });

    rootObs.observe(document.documentElement, { childList: true, subtree: true });
  };

  const boot = () => {
    ensurePanel();
    attachTableObserver();
    refreshTornTools(true);
    renderWatchlist();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
