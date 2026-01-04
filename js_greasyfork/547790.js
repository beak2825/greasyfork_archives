// ==UserScript==
// @name         IMDBTorrent (userscript)
// @namespace    https://github.com/knobthree/IMDBTorrent
// @version      1.0.1
// @description  Adds a nice button to IMDB
// @match        https://www.imdb.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect      apibay.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547790/IMDBTorrent%20%28userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547790/IMDBTorrent%20%28userscript%29.meta.js
// ==/UserScript==

/* === Inject original styles.css verbatim === */
(function(){
  const css = `
/* Our block that sits at the top of the right CTA column */
#imdbh-rightcol-block.imdbh-rightcol-block{
  display: block;
  margin: 0 0 10px 0;
}

/* The injected button; neutral style that fits IMDb spacing */
#imdbh-open-btn.imdbh-btn{
  width: 100%;
  display: inline-block;
  padding: 10px 14px;
  font: inherit;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #f5f5f5;
  cursor: pointer;
}
#imdbh-open-btn.imdbh-btn:hover{
  background: #eee;
}

/* Popup */
#imdb-helper-popup{
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 780px;
  max-width: calc(100vw - 32px);
  max-height: 60vh;
  display: none;
  background: #111;
  color: #eee;
  border: 1px solid #333;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  overflow: hidden;
  z-index: 2147483000;
}

#imdb-helper-popup .imdbh-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #1a1a1a;
  border-bottom: 1px solid #222;
  font-weight: 600;
}

#imdb-helper-popup .imdbh-close{
  background: transparent;
  color: #aaa;
  border: none;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}
#imdb-helper-popup .imdbh-close:hover{ color: #fff; }

#imdb-helper-popup .imdbh-body{
  padding: 12px;
  overflow: auto;
  max-height: calc(60vh - 44px);
}
`;
  (typeof GM_addStyle === "function"
    ? GM_addStyle(css)
    : (function(){ const s=document.createElement("style"); s.textContent=css; document.head.appendChild(s); })());
})();

/* === Original content.js (unchanged except where strictly necessary) === */
(function () {
  const BLOCK_ID = "imdbh-rightcol-block";
  const BTN_ID   = "imdbh-open-btn";
  const PANEL_ID = "imdb-helper-popup";
  const CLOSE_ID = "imdb-helper-popup-close";

  function getTargetContainer(){
    const el = document.querySelector("[data-testid='reviewContent-all-reviews']");
    if(!el)return;
    return el.parentElement;
  }

  function ensureInjected(){
    if (document.getElementById(BLOCK_ID)) return;

    const container = getTargetContainer();
    if (!container) return;

    const block = document.createElement("div");
    block.id = BLOCK_ID;
    block.className = "imdbh-rightcol-block";

    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.className = "imdbh-btn";
    btn.textContent = "Torrent";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPopup();
    });

    block.appendChild(btn);

    // Insert as the FIRST child of the parent-parent container
    container.insertBefore(block, container.firstElementChild || null);
  }

  // ----- Popup (same as before) -----
  function ensurePopup() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="imdbh-header">
        <span>IMDBTorrent</span>
        <button id="${CLOSE_ID}" class="imdbh-close" aria-label="Close">×</button>
      </div>
      <div class="imdbh-body">

      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById(CLOSE_ID).addEventListener("click", () => panel.remove());
    return panel;
  }

  function getCurrentMovieName(){
    var el = document.querySelector("[data-testid='hero__primary-text']");
    if(!el)return;
    return el.innerText;
  }

  function openPopup() {
    const panel = ensurePopup();
    panel.style.display = "block";

    let movieName = getCurrentMovieName();
    if(!movieName){
      log("Error: Cannot get name of movie. Are you looking at page of one?");
      return;
    }

    TorrentSearch.search(movieName, "[class='imdbh-body']");
  }

  function boot(){
    ensureInjected();

    // Re-run when IMDb updates the DOM or navigates SPA-style
    const mo = new MutationObserver(() => ensureInjected());
    mo.observe(document.documentElement, { childList: true, subtree: true });

    const _push = history.pushState;
    history.pushState = function(){
      const r = _push.apply(this, arguments);
      setTimeout(ensureInjected, 300);
      return r;
    };
    window.addEventListener("popstate", () => setTimeout(ensureInjected, 300));

    // EXTENSION-ONLY MESSAGE HANDLER REMOVED (not applicable in userscript)
    // chrome.runtime.onMessage.addListener((msg) => {
    //   if (msg?.t === "torrentThisMovie") torrentThisMovie();
    // });
  }

  function torrentThisMovie() {
    openPopup();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  const log = (msg) => {
    const el = document.querySelector("[class='imdbh-body']");
    const line = document.createElement("div");
    line.textContent = msg;
    el.appendChild(line);
  };

})();

/* === The rest of original content.js (unchanged) === */

const currentPageImdbId = (window.location.href.match(/\/title\/(tt\d+)/) || [])[1];

const TorrentSearch = (() => {
  const BASE_URL = "https://apibay.org/";
  const TRACKERS = [
    "udp://tracker.opentrackr.org:1337",
    "udp://open.stealth.si:80/announce",
    "udp://tracker.torrent.eu.org:451/announce",
    "udp://tracker.bittor.pw:1337/announce",
    "udp://public.popcorn-tracker.org:6969/announce",
    "udp://tracker.dler.org:6969/announce",
    "udp://exodus.desync.com:6969",
    "udp://open.demonii.com:1337/announce"
  ];

  const magnetFrom = (infoHash, name) => {
    const dn = encodeURIComponent(name || "");
    const tr = TRACKERS.map(t => "&tr=" + encodeURIComponent(t)).join("");
    return `magnet:?xt=urn:btih:${infoHash}&dn=${dn}${tr}`;
  };

  const getLogEl = (selector) => {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Log element not found for selector: ${selector}`);
    return el;
  };

  const log = (el, msg) => {
    const line = document.createElement("div");
    line.textContent = msg;
    el.appendChild(line);
  };

  const renderResults = (logEl, results) => {
    //sort so that results with matching IMDB id are first as long as results have over x seeds.
    //Below that treshold just don't care, to avoid situations where dead "more valid" torrents are only shown
    results.sort((a,b) => {
      const aPrio = (a.seeders > 10 && a.imdb == currentPageImdbId) ? 1 : 0;
      const bPrio = (b.seeders > 10 && b.imdb == currentPageImdbId) ? 1 : 0;

      if(aPrio !== bPrio) {
        return bPrio - aPrio;
      }

      return b.seeds - a.seeds;
    });


    results.slice(0, Math.min(5, results.length)).forEach(r => {
      const sizeGB = (Number(r.size) || 0) / (1024 ** 3);
      const seeds = r.seeders ?? 0;

      const a = document.createElement("a");
      a.href = r.MagnetLink;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.display = "grid";
      a.style.gridTemplateColumns = "7rem 7rem 1fr";
      a.style.gap = "0.75rem";
      a.style.alignItems = "baseline";
      a.style.padding = "4px 6px";
      a.style.textDecoration = "none";
      a.style.color = "inherit";

      a.onmouseover = () => a.style.background = "rgba(0,0,0,.06)";
      a.onmouseout  = () => a.style.background = "";

      const size = document.createElement("span");
      size.textContent = sizeGB.toFixed(1) + " GB";
      size.style.fontFamily = "monospace";

      const seedsEl = document.createElement("span");
      seedsEl.textContent = "Seeds: " + seeds;
      seedsEl.style.fontFamily = "monospace";

      const name = document.createElement("span");
      name.textContent = r.name;

      a.appendChild(size);
      a.appendChild(seedsEl);
      a.appendChild(name);

      logEl.appendChild(a);
    });
  };

  async function search(query, logSelector) {
    const logEl = getLogEl(logSelector);

    const openTPBLink = document.createElement("a");
    openTPBLink.href = `https://thepiratebay.org/search.php?q=${encodeURIComponent(query)}`;
    openTPBLink.target = "_blank";
    openTPBLink.textContent = 'Open search page';
    logEl.appendChild(openTPBLink);

    log(logEl, `[TorrentSearch] Query: "${query}"`);

    const fullUrl = `${BASE_URL}q.php?q=${encodeURIComponent(query)}`;
    log(logEl, `[TorrentSearch] GET ${fullUrl}`);

    let json;
    try {
      const res = await fetchExt(fullUrl, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.body;
      console.log(text);
      // apibay sometimes returns "null" for no results
      json = text && text.trim() !== "null" ? JSON.parse(text) : [];
    } catch (e) {
      log(logEl, `[TorrentSearch] ERROR: ${e.message}`);
      throw e;
    }

    log(logEl, `[TorrentSearch] Results: ${json.length}`);

    // Normalize types similar to your C# class + add magnet
    const results = json.map(r => ({
      id: parseInt(r.id, 10),
      name: r.name,
      info_hash: r.info_hash,
      leechers: parseInt(r.leechers, 10),
      seeders: parseInt(r.seeders, 10),
      num_files: parseInt(r.num_files, 10),
      size: parseInt(r.size, 10),
      username: r.username,
      added: parseInt(r.added, 10),
      status: r.status,
      category: parseInt(r.category, 10),
      imdb: r.imdb,
      get MagnetLink(){ return magnetFrom(this.info_hash, this.name); }
    }));

    renderResults(logEl,results);

    return results;
  }

  return { search, magnetFrom };
})();

/* === Minimal, required replacement for background fetch bridge === */
// const fetchExt = (url, opts) => chrome.runtime.sendMessage({ t: "fetch", url, opts });
// (Above is extension-only; replaced with GM.xmlHttpRequest below.)

const fetchExt = (url, opts = {}) => {
  const req = (typeof GM !== "undefined" && GM.xmlHttpRequest)
            || (typeof GM_xmlhttpRequest !== "undefined" && GM_xmlhttpRequest);
  if (!req) return Promise.reject(new Error("GM.xmlHttpRequest not available"));

  return new Promise((resolve, reject) => {
    req({
      url,
      method: (opts.method || "GET"),
      headers: opts.headers || {},
      data: opts.body,
      timeout: 30000,
      onload: (res) => {
        resolve({
          ok: (res.status >= 200 && res.status < 300),
          status: res.status,
          body: res.responseText
        });
      },
      onerror: (e) => reject(e?.error || e),
      ontimeout: () => reject(new Error("Request timed out"))
    });
  });
};
