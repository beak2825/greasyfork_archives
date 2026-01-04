// ==UserScript==
// @name         HentaiNexus — Random Favorite Search
// @namespace    http://tampermonkey.net/
// @version      7.8
// @description  Random favorite + filtered favorites + site-wide tag search. Live tag/artist scraping (auto-update on load) + cached + manual refresh. Stylish autocomplete.
// @license MIT
// @match        https://hentainexus.com/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      hentainexus.com
// @downloadURL https://update.greasyfork.org/scripts/557838/HentaiNexus%20%E2%80%94%20Random%20Favorite%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/557838/HentaiNexus%20%E2%80%94%20Random%20Favorite%20Search.meta.js
// ==/UserScript==

(function () {
"use strict";

/* =============== STYLE =============== */
GM_addStyle(`
/* control */
#hnx_ctrl { position: fixed; left: 20px; bottom: 20px; z-index: 2147483647; display:flex; flex-direction:column; gap:8px; }
#hnx_ctrl button { background:#ff4081; color:white; border:none; padding:10px 14px; border-radius:10px; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,0.25); font-size:14px; }
#hnx_ctrl button:hover { background:#ff1f6b; }

/* modal */
#hnx_modal_back{ position:fixed; inset:0; display:none; align-items:center; justify-content:center; background:rgba(0,0,0,0.5); z-index:2147483650; }
#hnx_modal { background:#111; color:#fff; padding:16px; border-radius:8px; width:520px; max-width:92%; box-shadow:0 18px 40px rgba(0,0,0,0.6); }
#hnx_modal label { display:block; font-size:12px; color:#ddd; margin-top:8px; margin-bottom:4px; }
#hnx_modal input { width:100%; padding:8px; border-radius:6px; border:1px solid #333; background:#0f0f10; color:#fff; box-sizing:border-box; outline:none; }
#hnx_modal .actions { margin-top:12px; display:flex; gap:8px; justify-content:flex-end; }

/* Suggestion box - style C: stylish, hover highlight, shadow */
.hnx-suggest-box {
  position: absolute;
  background: #0f1113;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  border: 1px solid rgba(255,255,255,0.04);
  overflow: auto;
  max-height: 220px;
  min-width: 220px;
  z-index: 2147483700;
  padding: 6px 6px;
}
.hnx-suggest-item {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #e8eef6;
  font-size: 13px;
  margin: 2px 0;
}
.hnx-suggest-item:hover,
.hnx-suggest-item.hnx-selected {
  background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
  color: #ffffff;
}

/* small refresh status */
#hnx_refresh_status { font-size:12px; color:#9aa9b2; margin-right:auto; margin-top:6px; }
`);

/* =============== UI + Modal =============== */
const ctrl = document.createElement("div");
ctrl.id = "hnx_ctrl";
ctrl.innerHTML = `
  <button id="hnx_unfiltered">🎲 Unfiltered Favorite</button>
  <button id="hnx_filtered">🎛 Filtered Favorite</button>
  <button id="hnx_tagsearch">🎯 Random Tag Search</button>
`;
document.body.appendChild(ctrl);

const modalBack = document.createElement("div");
modalBack.id = "hnx_modal_back";
modalBack.innerHTML = `
<div id="hnx_modal" role="dialog" aria-modal="true">
  <div style="font-weight:600; font-size:15px;">Filtered Random Favorite / Tag Search</div>
  <div style="font-size:12px;color:#aaa;margin-top:6px;">Enter comma-separated values. Use the Refresh button to re-load tag/artist lists from the site.</div>

  <label>Include tags (tag:)</label>
  <div style="position:relative;"><input id="hnx_inc_tags" placeholder="vanilla, school" autocomplete="off" /></div>

  <label>Exclude tags (-tag:)</label>
  <div style="position:relative;"><input id="hnx_exc_tags" placeholder="ahegao, uglybastard" autocomplete="off" /></div>

  <label>Include artists (artist:)</label>
  <div style="position:relative;"><input id="hnx_inc_arts" placeholder="hisasi" autocomplete="off" /></div>

  <label>Exclude artists (-artist:)</label>
  <div style="position:relative;"><input id="hnx_exc_arts" placeholder="taguchi" autocomplete="off" /></div>

  <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
    <div id="hnx_refresh_status"></div>
    <div style="margin-left:auto; display:flex; gap:8px;">
      <button id="hnx_modal_refresh" style="background:#6b7280;color:#fff;border:none;padding:8px 10px;border-radius:6px;">Refresh lists</button>
      <button id="hnx_modal_cancel" style="background:#444;color:#fff;border:none;padding:8px 12px;border-radius:6px;">Cancel</button>
      <button id="hnx_modal_save" style="background:#0a84ff;color:#fff;border:none;padding:8px 12px;border-radius:6px;">OK</button>
    </div>
  </div>
</div>`;
document.body.appendChild(modalBack);

/* =============== CACHING KEYS & DATA =============== */
const TAGS_CACHE_KEY = "hnx_tags_cache_v1";
const ARTS_CACHE_KEY = "hnx_arts_cache_v1";

/* Data arrays (will be filled from cache or fetch) */
let hnxTags = [];
let hnxArtists = [];

/* store attach API references so we can refresh suggestion data */
let attachApis = [];

/* track which action will be performed when modal is saved:
   'filtered' => favorites + filters
   'tagsearch' => site-wide search with provided tags/artists
*/
let modalAction = "filtered";

/* =============== FETCH UTIL =============== */
function fetchHTML(url, cb) {
    GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: res => {
            try {
                const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                cb(null, doc);
            } catch (e) { cb(e); }
        },
        onerror: err => cb(err || new Error("Network error"))
    });
}

/* Extract list from container /html/body/div[1]/div/div selecting <a class="button is-fullwidth"> */
function extractFromDoc(doc) {
    const container = doc.evaluate("/html/body/div[1]/div/div", doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const results = [];
    if (!container) return results;
    const links = container.querySelectorAll("a.button.is-fullwidth, a.button");
    links.forEach(a => {
        const txt = a.textContent.trim();
        const cleaned = txt.replace(/\s*\(used.*$/i, "").trim();
        if (cleaned) results.push(cleaned);
    });
    return results;
}

/* =============== LOAD (Option A: update on every page load) =============== */
function loadListsFromServerAndCache(showStatus = false, cb = ()=>{}) {
    if (showStatus) setRefreshStatus("Fetching tags...");
    fetchHTML("https://hentainexus.com/explore/categories/tag", (err, doc) => {
        let list = [];
        if (!err && doc) list = extractFromDoc(doc);
        hnxTags = Array.from(new Set(list)).sort((a,b)=>a.localeCompare(b));
        try { localStorage.setItem(TAGS_CACHE_KEY, JSON.stringify(hnxTags)); } catch(e){}
        if (showStatus) setRefreshStatus("Tags updated");
        // notify attached autocomplete to refresh
        attachApis.forEach(api => { try{ api.updateSuggestions(); }catch(e){} });
        // next fetch artists
        if (showStatus) setRefreshStatus("Fetching artists...");
        fetchHTML("https://hentainexus.com/explore/categories/artist", (err2, doc2) => {
            let list2 = [];
            if (!err2 && doc2) list2 = extractFromDoc(doc2);
            hnxArtists = Array.from(new Set(list2)).sort((a,b)=>a.localeCompare(b));
            try { localStorage.setItem(ARTS_CACHE_KEY, JSON.stringify(hnxArtists)); } catch(e){}
            if (showStatus) setRefreshStatus("Artists updated");
            setTimeout(()=> setRefreshStatus(""), 1200);
            cb();
        });
    });
}

/* load cached if any so suggestions exist immediately, then update from server (Option A) */
(function initialLoad() {
    const cachedTags = localStorage.getItem(TAGS_CACHE_KEY);
    const cachedArts = localStorage.getItem(ARTS_CACHE_KEY);
    if (cachedTags) {
        try { hnxTags = JSON.parse(cachedTags); } catch(e){ hnxTags = []; }
    }
    if (cachedArts) {
        try { hnxArtists = JSON.parse(cachedArts); } catch(e){ hnxArtists = []; }
    }
    // Now fetch fresh lists (Option A = update on every page load)
    loadListsFromServerAndCache(false);
})();

/* small status text for refresh button area */
function setRefreshStatus(s) {
    const el = document.getElementById("hnx_refresh_status");
    if (el) el.textContent = s || "";
}

/* =============== SUGGESTION ENGINE =============== */
function getSuggestions(list, prefix, limit=12) {
    if (!prefix || prefix.length < 1) return [];
    prefix = prefix.toLowerCase();
    const starts = [], contains = [];
    for (let i=0;i<list.length;i++){
        const it = list[i];
        const low = it.toLowerCase();
        if (low.startsWith(prefix)) starts.push(it);
        else if (low.includes(prefix)) contains.push(it);
        if (starts.length + contains.length >= limit) break;
    }
    return starts.concat(contains).slice(0, limit);
}

/* =============== AUTOCOMPLETE UI LOGIC =============== */
function createSuggestBox() {
    const box = document.createElement("div");
    box.className = "hnx-suggest-box";
    box.style.display = "none";
    return box;
}

function attachAutocomplete(inputEl, dataSourceFn) {
    const wrapper = inputEl.parentElement;
    wrapper.style.position = wrapper.style.position || "relative";
    const box = createSuggestBox();
    wrapper.appendChild(box);

    let suggestions = [];
    let selectedIndex = -1;

    function render() {
        if (!suggestions.length) {
            box.style.display = "none";
            return;
        }
        box.innerHTML = suggestions.map((s, idx) => {
            const cls = (idx === selectedIndex) ? "hnx-suggest-item hnx-selected" : "hnx-suggest-item";
            return `<div data-idx="${idx}" class="${cls}">${escapeHtml(s)}</div>`;
        }).join("");
        const rect = inputEl.getBoundingClientRect();
        box.style.minWidth = rect.width + "px";
        // position under input - rely on absolute inside wrapper
        box.style.display = "block";
    }

    function updateSuggestions() {
        const token = inputEl.value.split(",").pop().trim();
        const list = dataSourceFn();
        if (!token || token.length < 1) {
            suggestions = [];
            selectedIndex = -1;
            render();
            return;
        }
        suggestions = getSuggestions(list, token, 12);
        selectedIndex = 0;
        render();
    }

    inputEl.addEventListener("input", updateSuggestions);

    inputEl.addEventListener("keydown", (ev) => {
        if (box.style.display === "none") {
            if (ev.key === "Enter") return;
            return;
        }
        if (ev.key === "ArrowDown") {
            ev.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
            render();
        } else if (ev.key === "ArrowUp") {
            ev.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            render();
        } else if (ev.key === "Enter") {
            ev.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) acceptSuggestion(suggestions[selectedIndex]);
        } else if (ev.key === "Escape") {
            box.style.display = "none";
        }
    });

    box.addEventListener("mousedown", (ev) => {
        const target = ev.target.closest(".hnx-suggest-item");
        if (!target) return;
        const idx = Number(target.dataset.idx);
        if (!Number.isNaN(idx) && suggestions[idx]) {
            acceptSuggestion(suggestions[idx]);
        }
    });

    inputEl.addEventListener("blur", () => {
        setTimeout(()=>{ box.style.display = "none"; }, 150);
    });

    function acceptSuggestion(val) {
        const parts = inputEl.value.split(",");
        parts.pop();
        parts.push(" " + val);
        inputEl.value = parts.join(",").trim() + ", ";
        box.style.display = "none";
        inputEl.focus();
        suggestions = [];
        selectedIndex = -1;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    const api = { updateSuggestions };
    attachApis.push(api);
    return api;
}

/* Hook inputs to correct datasources */
function tagDataSource() { return hnxTags; }
function artistDataSource() { return hnxArtists; }

setTimeout(() => {
    const incTags = document.getElementById("hnx_inc_tags");
    const excTags = document.getElementById("hnx_exc_tags");
    const incArts = document.getElementById("hnx_inc_arts");
    const excArts = document.getElementById("hnx_exc_arts");

    if (incTags) attachAutocomplete(incTags, tagDataSource);
    if (excTags) attachAutocomplete(excTags, tagDataSource);
    if (incArts) attachAutocomplete(incArts, artistDataSource);
    if (excArts) attachAutocomplete(excArts, artistDataSource);
}, 300);

/* =============== HELPERS =============== */
function parseCSV(s) {
    return s ? s.split(",").map(v => v.trim()).filter(Boolean) : [];
}

/* format tag or artist for query:
   - tags: if contains space, wrap in quotes tag:"beauty mark"
           otherwise tag:ahegao
   - artists: we always wrap in quotes in buildQuery (artist:"Name")
*/
function formatTagForQuery(t) {
    return (t.includes(' ') ? `tag:"${t}"` : `tag:${t}`);
}
function formatTagForQueryNeg(t) {
    return (t.includes(' ') ? `-tag:"${t}"` : `-tag:${t}`);
}

function buildQuery(incT, excT, incA, excA, includeFavorited = true) {
    const parts = [];
    if (includeFavorited) parts.push("favorited:true");
    incT.forEach(t => parts.push(formatTagForQuery(t)));
    excT.forEach(t => parts.push(formatTagForQueryNeg(t)));
    incA.forEach(a => parts.push(`artist:"${a}"`));
    excA.forEach(a => parts.push(`-artist:"${a}"`));
    return encodeURIComponent(parts.join(" "));
}

function openBG(url) {
    try {
        GM_openInTab(url, { active: false, insert: true });
    } catch {
        const a = document.createElement("a");
        a.href = url; a.target = "_blank"; a.rel = "noopener";
        document.body.appendChild(a); a.click(); a.remove();
    }
}

function fetchHTMLforPage(url, callback) {
    GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: res => {
            try {
                const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                callback(null, doc);
            } catch (e) { callback(e); }
        },
        onerror: err => callback(err || new Error("Network error"))
    });
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* =============== TRUE PAGINATION (FILTERED) =============== */
function getFilteredPageMax(query, callback) {
    const url = `https://hentainexus.com/page/1?q=${query}&_=${Date.now()}`;
    fetchHTMLforPage(url, (err, doc) => {
        if (err || !doc) return callback(1);
        const last = doc.querySelector("section div:nth-of-type(2) nav ul li:last-child a");
        let max = 1;
        if (last) {
            const n = parseInt(last.textContent.trim());
            if (!isNaN(n)) max = n;
        }
        callback(max);
    });
}

/* =============== RANDOM FAVORITE / PAGE CHOOSE =============== */
function fetchPageAndChoose(url) {
    fetchHTMLforPage(url, (err, doc) => {
        if (err || !doc) { alert("Failed to fetch page for random selection."); return; }

        let tiles = Array.from(doc.querySelectorAll("section div:nth-of-type(2) > div > div > a")).filter(a => a.href);

        if (!tiles.length) tiles = Array.from(doc.querySelectorAll("a[href*='/g/']")).filter(a => a.href);

        if (!tiles.length) {
            const fb = [];
            for (let i = 1; i <= 30; i++) {
                const xp = `/html/body/section/div[2]/div/div[${i}]/a`;
                const node = doc.evaluate(xp, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (node && node.href) fb.push(node);
            }
            tiles = fb;
        }

        if (!tiles.length) {
            alert("No items found on that page (maybe filters too strict).");
            return;
        }

        openBG(getRandomItem(tiles).href);
    });
}

/* =============== UNFILTERED BUTTON =============== */
function getMaxFavoritePageFromDom() {
    const pages = document.querySelectorAll("section div:nth-of-type(2) nav ul li a.pagination-link");
    if (!pages.length) return 1;
    const last = pages[pages.length - 1];
    const n = parseInt(last.textContent.trim());
    return isNaN(n) ? 1 : n;
}

document.getElementById("hnx_unfiltered").onclick = () => {
    const max = getMaxFavoritePageFromDom();
    const p = Math.floor(Math.random() * max) + 1;
    const url = `https://hentainexus.com/page/${p}?q=${encodeURIComponent("favorited:true")}&_=${Date.now()}`;
    fetchPageAndChoose(url);
};

/* =============== FILTERED + TAGSEARCH HANDLERS =============== */
document.getElementById("hnx_filtered").onclick = () => {
    modalAction = "filtered";
    document.getElementById("hnx_inc_tags").value = localStorage.getItem("hnx_inc_tags") || "";
    document.getElementById("hnx_exc_tags").value = localStorage.getItem("hnx_exc_tags") || "";
    document.getElementById("hnx_inc_arts").value = localStorage.getItem("hnx_inc_arts") || "";
    document.getElementById("hnx_exc_arts").value = localStorage.getItem("hnx_exc_arts") || "";
    modalBack.style.display = "flex";
};

document.getElementById("hnx_tagsearch").onclick = () => {
    modalAction = "tagsearch";
    document.getElementById("hnx_inc_tags").value = localStorage.getItem("hnx_inc_tags") || "";
    document.getElementById("hnx_exc_tags").value = localStorage.getItem("hnx_exc_tags") || "";
    document.getElementById("hnx_inc_arts").value = localStorage.getItem("hnx_inc_arts") || "";
    document.getElementById("hnx_exc_arts").value = localStorage.getItem("hnx_exc_arts") || "";
    modalBack.style.display = "flex";
};

document.getElementById("hnx_modal_cancel").onclick = () => {
    modalBack.style.display = "none";
};

/* manual refresh button inside modal - re-fetch lists, overwrite cache */
document.getElementById("hnx_modal_refresh").onclick = () => {
    setRefreshStatus("Refreshing lists...");
    loadListsFromServerAndCache(true, () => {
        setRefreshStatus("Lists refreshed");
        setTimeout(()=> setRefreshStatus(""), 1200);
    });
};

document.getElementById("hnx_modal_save").onclick = () => {
    const incT = document.getElementById("hnx_inc_tags").value.trim();
    const excT = document.getElementById("hnx_exc_tags").value.trim();
    const incA = document.getElementById("hnx_inc_arts").value.trim();
    const excA = document.getElementById("hnx_exc_arts").value.trim();

    localStorage.setItem("hnx_inc_tags", incT);
    localStorage.setItem("hnx_exc_tags", excT);
    localStorage.setItem("hnx_inc_arts", incA);
    localStorage.setItem("hnx_exc_arts", excA);

    modalBack.style.display = "none";

    // If no filters: for filtered -> fallback to unfiltered favorites; for tagsearch -> open a random page of site favorites (we'll fallback to favorites)
    if (!incT && !excT && !incA && !excA) {
        if (modalAction === "filtered") {
            document.getElementById("hnx_unfiltered").click();
            return;
        } else if (modalAction === "tagsearch") {
            // fallback to unfiltered behavior (safe)
            document.getElementById("hnx_unfiltered").click();
            return;
        }
    }

    const incTagsArr = parseCSV(incT);
    const excTagsArr = parseCSV(excT);
    const incArtsArr = parseCSV(incA);
    const excArtsArr = parseCSV(excA);

    const includeFavorited = (modalAction === "filtered");
    const q = buildQuery(incTagsArr, excTagsArr, incArtsArr, excArtsArr, includeFavorited);

    getFilteredPageMax(q, max => {
        const p = Math.floor(Math.random() * max) + 1;
        // For tagsearch we still use /page/N?q=... (site uses same pagination for search results)
        const url = `https://hentainexus.com/page/${p}?q=${q}&_=${Date.now()}`;
        fetchPageAndChoose(url);
    });
};

})();
