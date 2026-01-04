// ==UserScript==
// @name         Qobuz Availability
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qobuz.com
// @namespace    https://example.com/
// @version      1.0.5
// @author       Zxcvr
// @description  Qobuz album/track availability across 26 storefront countries. Auto-start, compact, floating minimize.
// @match        https://qobuz.com/*
// @match        https://www.qobuz.com/*
// @match        https://open.qobuz.com/*
// @match        https://play.qobuz.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      qobuz.com
// @connect      www.qobuz.com
// @downloadURL https://update.greasyfork.org/scripts/559044/Qobuz%20Availability.user.js
// @updateURL https://update.greasyfork.org/scripts/559044/Qobuz%20Availability.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const MARKETS = [
    { cc: "AR", name: "Argentina", locales: ["ar-es", "ar-en"] },
    { cc: "AU", name: "Australia", locales: ["au-en"] },
    { cc: "AT", name: "Austria", locales: ["at-de", "at-en"] },
    { cc: "BE", name: "Belgium", locales: ["be-fr", "be-nl", "be-en"] },
    { cc: "BR", name: "Brazil", locales: ["br-pt", "br-en"] },
    { cc: "CA", name: "Canada", locales: ["ca-en", "ca-fr"] },
    { cc: "CL", name: "Chile", locales: ["cl-es", "cl-en"] },
    { cc: "CO", name: "Colombia", locales: ["co-es", "co-en"] },
    { cc: "DK", name: "Denmark", locales: ["dk-en", "dk-da"] },
    { cc: "FI", name: "Finland", locales: ["fi-en", "fi-fi"] },
    { cc: "FR", name: "France", locales: ["fr-fr", "fr-en"] },
    { cc: "DE", name: "Germany", locales: ["de-de", "de-en"] },
    { cc: "IE", name: "Ireland", locales: ["ie-en"] },
    { cc: "IT", name: "Italy", locales: ["it-it", "it-en"] },
    { cc: "JP", name: "Japan", locales: ["jp-ja", "jp-en"] },
    { cc: "LU", name: "Luxembourg", locales: ["lu-fr", "lu-de", "lu-en"] },
    { cc: "NL", name: "Netherlands", locales: ["nl-nl", "nl-en"] },
    { cc: "MX", name: "Mexico", locales: ["mx-es", "mx-en"] },
    { cc: "NZ", name: "New Zealand", locales: ["nz-en"] },
    { cc: "NO", name: "Norway", locales: ["no-en", "no-nb"] },
    { cc: "PT", name: "Portugal", locales: ["pt-pt", "pt-en"] },
    { cc: "ES", name: "Spain", locales: ["es-es", "es-en"] },
    { cc: "SE", name: "Sweden", locales: ["se-en", "se-sv"] },
    { cc: "CH", name: "Switzerland", locales: ["ch-de", "ch-fr", "ch-it", "ch-en"] },
    { cc: "GB", name: "United Kingdom", locales: ["gb-en"] },
    { cc: "US", name: "United States", locales: ["us-en"] },
  ];

  const STORE_BASES = ["https://qobuz.com", "https://www.qobuz.com"];

  const CONCURRENCY = 6;
  const LOCALE_DELAY_MS = 70;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  let cancelRequested = false;
  let autoRunTimer = null;
  let autoTries = 0;
  const AUTO_MAX_TRIES = 6;

  // Persist globally
  const STORE_KEY_FLOAT = "qz_av_floating_v1";
  const STORE_KEY_MIN   = "qz_av_minimized_v1";
  const STORE_KEY_PREF  = "qz_av_prefCountries_v1";

  const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  // ---- preferred countries (global) ----
  const PREF = {
    set: new Set(),
    load() {
      try {
        const raw = lsGet(STORE_KEY_PREF);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return;
        const allowed = new Set(MARKETS.map(m => m.cc));
        this.set = new Set(arr.map(x => String(x || "").toUpperCase()).filter(x => allowed.has(x)));
      } catch {}
    },
    save() {
      try { lsSet(STORE_KEY_PREF, JSON.stringify(Array.from(this.set).sort())); } catch {}
    },
    has(cc) { return this.set.has(String(cc || "").toUpperCase()); },
    toggle(cc) {
      cc = String(cc || "").toUpperCase();
      if (!cc) return;
      if (this.set.has(cc)) this.set.delete(cc);
      else this.set.add(cc);
      this.save();
    }
  };
  PREF.load();

  GM_addStyle(`
    .qz-av-wrap{
      margin:10px auto;
      padding:10px 10px 8px;
      max-width: 920px;
      width: calc(100% - 24px);
      border:1px solid rgba(255,255,255,.18);
      border-radius:14px;
      background:rgba(0,0,0,.35);
      color:#fff;
      font: 13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      backdrop-filter: blur(6px);
      box-shadow: 0 12px 34px rgba(0,0,0,.20);
      z-index:999999;
    }

    .qz-titlebar{
      display:flex; align-items:center; justify-content:space-between;
      gap:10px;
      margin-bottom:8px;
    }
    .qz-av-title{font-size:18px;font-weight:900;margin:0; display:flex; align-items:baseline; gap:10px;}
    .qz-credit{font-size:12px; font-weight:900; opacity:.7; letter-spacing:.2px;}

    .qz-titlebtns{display:flex;gap:8px;align-items:center}
    .qz-iconbtn{
      width:34px;height:34px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.08);
      color:#fff; cursor:pointer;
      display:inline-flex;align-items:center;justify-content:center;
      font-weight:900;
    }
    .qz-iconbtn:hover{background:rgba(255,255,255,.12)}
    .qz-av-wrap:not(.qz-av-floating) .qz-iconbtn.minbtn{display:none;}

    .qz-av-toprow{display:flex; gap:10px; flex-wrap:wrap; align-items:center}
    .qz-av-toprow input{
      width: 260px; max-width: 65vw;
      padding:7px 10px;
      border-radius:9999px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.06);
      color:#fff;
      outline:none;
      font-weight: 700;
    }
    .qz-av-btns{display:flex;gap:8px;flex-wrap:wrap}
    .qz-av-btns button{
      padding:7px 10px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.08);
      color:#fff; cursor:pointer; font-weight:700
    }
    .qz-av-btns button:hover{background:rgba(255,255,255,.12)}

    .qz-av-progress{
      font-size:12px;
      opacity:.9;
      margin:6px 0 6px;
      min-height: 14px;
    }

    /* scanning bar */
    #qz_bar{
      width: 100%;
      height: 8px;
      display: none;
      margin: 6px 0 0;
      border-radius: 9999px;
      overflow: hidden;
      accent-color: #18c1c1;
    }
    #qz_bar::-webkit-progress-bar{
      background: rgba(255,255,255,.14);
      border-radius: 9999px;
    }
    #qz_bar::-webkit-progress-value{
      background: rgba(24,193,193,.90);
      border-radius: 9999px;
    }
    #qz_bar::-moz-progress-bar{
      background: rgba(24,193,193,.90);
      border-radius: 9999px;
    }

    .qz-av-block{
      background:rgba(0,0,0,.30);
      border:1px solid rgba(255,255,255,.12);
      padding:10px;
      border-radius:12px;
      margin-top:10px;
    }
    .qz-av-h{font-weight:900;margin:0 0 8px;font-size:16px}

    .qz-section-head{
      display:flex; align-items:center; gap:8px;
      margin:10px 0 7px;
      font-weight:900;
      font-size:15px;
    }

    .qz-copybtn{
      width:34px; height:34px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.08);
      display:inline-flex; align-items:center; justify-content:center;
      cursor:pointer;
    }
    .qz-copybtn:hover{background:rgba(255,255,255,.12)}
    .qz-copybtn svg{width:18px;height:18px;opacity:.95}

    .qz-av-row{display:flex;flex-wrap:wrap;gap:8px}

    .qz-chip{
      display:inline-flex; align-items:center; gap:8px;
      padding:6px 10px;
      border-radius:9999px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.06);
      font-weight:900;
      text-decoration:none;
      color:#fff;
      user-select:none;
    }
    .qz-chip:hover{background:rgba(255,255,255,.10)}
    .qz-chip.unav{opacity:.55;background:rgba(255,255,255,.04)}
    .qz-chip.hidden{display:none}

    /* preferred highlight */
    .qz-chip.qz-pref{
      border-color: rgba(24,193,193,.75);
      box-shadow: 0 0 0 1px rgba(24,193,193,.35) inset;
      background: rgba(24,193,193,.10);
    }

    .qz-flag{
      width:18px; height:12px; border-radius:2px;
      object-fit:cover; display:block;
      box-shadow: 0 0 0 1px rgba(255,255,255,.12) inset;
    }

    .qz-av-floating{
      position:fixed;right:14px;bottom:14px;
      width:min(560px, calc(100vw - 28px));
      max-width:none;
      max-height:75vh;overflow:auto;
      margin:0;
    }

    .qz-av-floating.qz-minimized{
      width: 360px;
      max-height: none;
      overflow: hidden;
      padding:10px 10px 10px;
    }
    .qz-minimized .qz-av-toprow,
    .qz-minimized #qz_out,
    .qz-minimized #qz_progress,
    .qz-minimized #qz_bar,
    .qz-minimized #qz_adv { display:none; }

    /* advanced */
    #qz_adv{
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,.12);
    }
    #qz_adv summary{
      cursor:pointer;
      list-style:none;
      font-weight: 900;
      opacity: .9;
      user-select:none;
    }
    #qz_adv summary::-webkit-details-marker{ display:none; }
    #qz_adv .qz-adv-body{
      margin-top: 8px;
    }
    #qz_pref_list{
      display:flex; flex-wrap:wrap; gap:8px;
      margin-top: 6px;
    }
    .qz-prefopt{
      cursor:pointer;
    }
  `);

  function gmGet(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        timeout: 25000,
        anonymous: true,
        withCredentials: false,
        onload: (resp) => resolve(resp),
        onerror: () => resolve({ status: 0, responseText: "" }),
        ontimeout: () => resolve({ status: 0, responseText: "" }),
      });
    });
  }

  function stripLocalePrefix(pathname) {
    return pathname.replace(/^\/[a-z]{2}-[a-z]{2}\//, "/");
  }

  function findTypeIdAndStorePath() {
    const u = new URL(location.href);
    const parts = u.pathname.split("/").filter(Boolean);
    const hasLocale = parts[0] && /^[a-z]{2}-[a-z]{2}$/.test(parts[0]);
    const idx = hasLocale ? 1 : 0;
    const type = parts[idx];
    if (type !== "album" && type !== "track") return null;
    const id = parts[parts.length - 1] || "";
    const storePath = stripLocalePrefix(u.pathname);
    return { type, id, storePath };
  }

  function looksUnavailable(html) {
    const t = (html || "").toLowerCase();
    return (
      t.includes("page not found") ||
      t.includes("not found") ||
      t.includes("error 404") ||
      (t.includes("not available") && (t.includes("country") || t.includes("region"))) ||
      t.includes("n'est pas disponible") ||
      t.includes("nicht verfügbar") ||
      t.includes("non è disponibile") ||
      t.includes("no está disponible") ||
      t.includes("não está disponível")
    );
  }

  function looksLikeProductPage(html, type) {
    const t = (html || "");
    if (type === "album") return t.includes("MusicAlbum") || /og:type"\s+content="music\.album"/i.test(t);
    if (type === "track") return t.includes("MusicRecording") || /og:type"\s+content="music\.song"/i.test(t);
    return false;
  }

  async function checkCountry(country, storePath, type) {
    for (const base of STORE_BASES) {
      for (const locale of country.locales) {
        if (cancelRequested) return { ok: false, cancelled: true };
        const url = `${base}/${locale}${storePath}`;
        const resp = await gmGet(url);
        if (resp.status >= 200 && resp.status < 300) {
          const html = resp.responseText || "";
          if (!looksUnavailable(html) && looksLikeProductPage(html, type)) {
            return { ok: true, locale, url };
          }
        }
        await sleep(LOCALE_DELAY_MS);
      }
    }
    return { ok: false, locale: null, url: null };
  }

  async function promisePool(items, worker, concurrency) {
    let i = 0;
    const results = new Array(items.length);

    const runners = new Array(concurrency).fill(0).map(async () => {
      while (i < items.length && !cancelRequested) {
        const idx = i++;
        results[idx] = await worker(items[idx], idx);
      }
    });

    await Promise.all(runners);
    return results;
  }

  function flagImgUrl(cc) {
    return `https://flagcdn.com/h20/${cc.toLowerCase()}.png`;
  }

  const COPY_SVG = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 9h10v10H9V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  let box = null;
  let lastHref = location.href;

  function bestMount() {
    return document.querySelector("main") ||
           document.querySelector("#app") ||
           document.querySelector("#root") ||
           document.body;
  }

  function setProgress(msg) {
    const el = box?.querySelector("#qz_progress");
    if (el) el.textContent = msg || "";
  }

  function showBar(total) {
    const bar = box?.querySelector("#qz_bar");
    if (!bar) return;
    bar.max = total || 1;
    bar.value = 0;
    bar.style.display = "block";
  }
  function setBar(done, total) {
    const bar = box?.querySelector("#qz_bar");
    if (!bar) return;
    if (typeof total === "number") bar.max = total || 1;
    bar.value = done || 0;
  }
  function hideBar() {
    const bar = box?.querySelector("#qz_bar");
    if (!bar) return;
    bar.style.display = "none";
    bar.value = 0;
  }

  function applyFilter(q) {
    q = (q || "").trim().toLowerCase();
    const chips = box.querySelectorAll(".qz-chip");
    chips.forEach(ch => {
      const cc = (ch.dataset.cc || "").toLowerCase();
      const name = (ch.dataset.name || "").toLowerCase();
      const ok = !q || cc.includes(q) || name.includes(q);
      ch.classList.toggle("hidden", !ok);
    });
  }

  function applyPrefsToRendered() {
    if (!box) return;
    for (const el of box.querySelectorAll(".qz-chip[data-cc]")) {
      const cc = (el.dataset.cc || "").toUpperCase();
      el.classList.toggle("qz-pref", PREF.has(cc));
    }
    for (const el of box.querySelectorAll(".qz-prefopt[data-cc]")) {
      const cc = (el.dataset.cc || "").toUpperCase();
      el.classList.toggle("qz-pref", PREF.has(cc));
    }
  }

  function updateMinBtn() {
    const btn = box?.querySelector("#qz_min");
    if (!btn) return;
    const minimized = box.classList.contains("qz-minimized");
    btn.textContent = minimized ? "▢" : "—";
    btn.title = minimized ? "Expand" : "Minimize";
  }

  function applySavedFloatMinState() {
    const floatOn = lsGet(STORE_KEY_FLOAT) === "1";
    box.classList.toggle("qz-av-floating", floatOn);

    const minOn = lsGet(STORE_KEY_MIN) === "1";
    box.classList.toggle("qz-minimized", floatOn && minOn);

    updateMinBtn();
  }

  function setMinimized(on) {
    box.classList.toggle("qz-minimized", !!on);
    lsSet(STORE_KEY_MIN, on ? "1" : "0");
    updateMinBtn();
  }

  function renderPrefChooser() {
    const host = box?.querySelector("#qz_pref_list");
    if (!host) return;

    host.innerHTML = "";
    for (const m of MARKETS.slice().sort((a, b) => a.cc.localeCompare(b.cc))) {
      const el = document.createElement("span");
      el.className = "qz-chip qz-prefopt";
      el.dataset.cc = m.cc;
      el.dataset.name = m.name;
      el.title = m.name;

      const flag = document.createElement("img");
      flag.className = "qz-flag";
      flag.alt = "";
      flag.src = flagImgUrl(m.cc);
      flag.addEventListener("error", () => flag.remove(), { once: true });

      const label = document.createElement("span");
      label.textContent = m.cc;

      el.append(flag, label);

      el.addEventListener("click", () => {
        PREF.toggle(m.cc);
        applyPrefsToRendered();
      });

      host.appendChild(el);
    }

    applyPrefsToRendered();
  }

  function ensureBox() {
    if (box && document.contains(box)) return box;

    box = document.createElement("div");
    box.className = "qz-av-wrap";
    box.innerHTML = `
      <div class="qz-titlebar">
        <div class="qz-av-title">Qobuz Availability <span class="qz-credit">by Zxcvr</span></div>
        <div class="qz-titlebtns">
          <button class="qz-iconbtn minbtn" id="qz_min" title="Minimize">—</button>
        </div>
      </div>

      <div class="qz-av-toprow">
        <input id="qz_filter" placeholder="Search (JP / Japan / United...)" />
        <div class="qz-av-btns">
          <button id="qz_float">Toggle Floating</button>
        </div>
      </div>

      <div class="qz-av-progress" id="qz_progress"></div>
      <progress id="qz_bar" max="1" value="0"></progress>
      <div id="qz_out"></div>

      <details id="qz_adv">
        <summary>Advanced</summary>
        <div class="qz-adv-body">
          <div style="font-weight:900; opacity:.9;">Choose default country(s)</div>
          <div id="qz_pref_list"></div>
        </div>
      </details>
    `;

    bestMount().prepend(box);

    applySavedFloatMinState();

    box.querySelector("#qz_min").onclick = () => {
      setMinimized(!box.classList.contains("qz-minimized"));
    };

    box.querySelector("#qz_float").onclick = () => {
      const nowOn = !box.classList.contains("qz-av-floating");
      box.classList.toggle("qz-av-floating", nowOn);
      lsSet(STORE_KEY_FLOAT, nowOn ? "1" : "0");

      if (nowOn) {
        const savedMin = lsGet(STORE_KEY_MIN) === "1";
        box.classList.toggle("qz-minimized", savedMin);
      } else {
        box.classList.remove("qz-minimized");
      }
      updateMinBtn();
    };

    updateMinBtn();
    renderPrefChooser();
    return box;
  }

  function createChipEl(obj, cls) {
    const title = obj.locale ? `${obj.name} — ${obj.locale}` : obj.name;

    const flag = document.createElement("img");
    flag.className = "qz-flag";
    flag.alt = "";
    flag.src = flagImgUrl(obj.cc);
    flag.addEventListener("error", () => flag.remove(), { once: true });

    const label = document.createElement("span");
    label.textContent = obj.cc;

    let el;
    if (obj.url) {
      el = document.createElement("a");
      el.href = obj.url;
      el.target = "_blank";
      el.rel = "noreferrer";
    } else {
      el = document.createElement("span");
    }

    el.className = `qz-chip ${cls || ""} ${PREF.has(obj.cc) ? "qz-pref" : ""}`.trim();
    el.dataset.cc = obj.cc;
    el.dataset.name = obj.name;
    el.title = title;
    el.append(flag, label);
    return el;
  }

  function renderLiveShell(kind, availableArrRef, unavailableArrRef) {
    const out = box.querySelector("#qz_out");
    out.innerHTML = `
      <div class="qz-av-block">
        <div class="qz-av-h">${kind} Availability</div>

        <div class="qz-section-head">
          <span id="qz_av_count">Available in (0):</span>
          <button class="qz-copybtn" id="qz_copy_av" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="qz-av-row" id="qz_av_list"></div>

        <div class="qz-section-head" style="margin-top:12px;">
          <span id="qz_un_count">Unavailable in (0):</span>
          <button class="qz-copybtn" id="qz_copy_unav" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="qz-av-row" id="qz_un_list"></div>
      </div>
    `;

    out.querySelector("#qz_copy_av").onclick = () => GM_setClipboard(availableArrRef.map(x => x.cc).join(", "));
    out.querySelector("#qz_copy_unav").onclick = () => GM_setClipboard(unavailableArrRef.map(x => x.cc).join(", "));
  }

  function render(kind, availableObjs, unavailableObjs) {
    const out = box.querySelector("#qz_out");

    const chipHtml = (obj, cls) => {
      const title = obj.locale ? `${obj.name} — ${obj.locale}` : obj.name;
      const flag = `<img class="qz-flag" data-flag="1" alt="" src="${flagImgUrl(obj.cc)}">`;
      const label = `<span>${obj.cc}</span>`;
      const prefClass = PREF.has(obj.cc) ? " qz-pref" : "";

      if (obj.url) {
        return `<a class="qz-chip ${cls || ""}${prefClass}" data-cc="${obj.cc}" data-name="${obj.name}"
                  href="${obj.url}" target="_blank" rel="noreferrer" title="${title}">
                  ${flag}${label}
                </a>`;
      }
      return `<span class="qz-chip ${cls || ""}${prefClass}" data-cc="${obj.cc}" data-name="${obj.name}" title="${title}">
                ${flag}${label}
              </span>`;
    };

    out.innerHTML = `
      <div class="qz-av-block">
        <div class="qz-av-h">${kind} Availability</div>

        <div class="qz-section-head">
          <span>Available in (${availableObjs.length}):</span>
          <button class="qz-copybtn" id="qz_copy_av" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="qz-av-row">
          ${availableObjs.map(o => chipHtml(o, "")).join("")}
        </div>

        <div class="qz-section-head" style="margin-top:12px;">
          <span>Unavailable in (${unavailableObjs.length}):</span>
          <button class="qz-copybtn" id="qz_copy_unav" title="Copy">${COPY_SVG}</button>
        </div>
        <div class="qz-av-row">
          ${unavailableObjs.map(o => chipHtml(o, "unav")).join("")}
        </div>
      </div>
    `;

    out.querySelectorAll('img[data-flag="1"]').forEach(img => {
      img.addEventListener("error", () => img.remove(), { once: true });
    });

    out.querySelector("#qz_copy_av").onclick = () => GM_setClipboard(availableObjs.map(x => x.cc).join(", "));
    out.querySelector("#qz_copy_unav").onclick = () => GM_setClipboard(unavailableObjs.map(x => x.cc).join(", "));

    applyFilter(box.querySelector("#qz_filter").value);
    applyPrefsToRendered();
  }

  async function run(isAuto = false) {
    const info = findTypeIdAndStorePath();
    if (!info) {
      if (isAuto && autoTries < AUTO_MAX_TRIES) scheduleAutoRun(550, true);
      return;
    }

    autoTries = 0;
    cancelRequested = false;
    ensureBox();

    const total = MARKETS.length;
    const kind = info.type === "album" ? "Album" : "Track";

    const availableLive = [];
    const unavailableLive = [];

    renderLiveShell(kind, availableLive, unavailableLive);

    const avList = box.querySelector("#qz_av_list");
    const unList = box.querySelector("#qz_un_list");
    const avCount = box.querySelector("#qz_av_count");
    const unCount = box.querySelector("#qz_un_count");

    showBar(total);
    setBar(0, total);

    let done = 0;
    setProgress(`Scanning… ${done}/${total}`);

    let lastUi = 0;

    const worker = async (c) => {
      const r = await checkCountry(c, info.storePath, info.type);

      if (cancelRequested) return r;

      const obj = r?.ok
        ? { cc: c.cc, name: c.name, url: r.url, locale: r.locale }
        : { cc: c.cc, name: c.name, url: null, locale: null };

      if (r?.ok) {
        availableLive.push(obj);
        avList.appendChild(createChipEl(obj, ""));
        avCount.textContent = `Available in (${availableLive.length}):`;
      } else {
        unavailableLive.push(obj);
        unList.appendChild(createChipEl(obj, "unav"));
        unCount.textContent = `Unavailable in (${unavailableLive.length}):`;
      }

      done++;
      setBar(done, total);

      const now = performance.now();
      if (now - lastUi > 120 || done === total) {
        lastUi = now;
        setProgress(`Scanning… ${done}/${total}`);
        applyFilter(box.querySelector("#qz_filter").value);
      }

      return r;
    };

    await promisePool(MARKETS, worker, CONCURRENCY);

    if (cancelRequested) { setProgress(""); hideBar(); return; }

    const availableSorted = availableLive.slice().sort((a, b) => a.cc.localeCompare(b.cc));
    const unavailableSorted = unavailableLive.slice().sort((a, b) => a.cc.localeCompare(b.cc));

    render(kind, availableSorted, unavailableSorted);
    setProgress("");
    hideBar();
  }

  function scheduleAutoRun(delayMs = 550, isRetry = false) {
    clearTimeout(autoRunTimer);
    autoRunTimer = setTimeout(() => {
      if (cancelRequested) return;
      if (!isRetry) autoTries = 0;
      autoTries++;
      run(true).catch(() => {});
    }, delayMs);
  }

  function wire() {
    ensureBox();
    const filter = box.querySelector("#qz_filter");
    filter.oninput = () => applyFilter(filter.value);
    scheduleAutoRun(550, false);
  }

  function onNavMaybe() {
    if (location.href === lastHref) return;
    lastHref = location.href;

    clearTimeout(autoRunTimer);
    cancelRequested = true;

    if (box) box.remove();
    box = null;

    setTimeout(() => {
      cancelRequested = false;
      wire();
    }, 250);
  }

  function installNavHooks() {
    const trigger = () => setTimeout(onNavMaybe, 50);

    const ps = history.pushState;
    history.pushState = function () { ps.apply(this, arguments); trigger(); };

    const rs = history.replaceState;
    history.replaceState = function () { rs.apply(this, arguments); trigger(); };

    window.addEventListener("popstate", trigger);
    window.addEventListener("hashchange", trigger);
  }

  wire();
  installNavHooks();
})();
