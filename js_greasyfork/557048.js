// ==UserScript==
// @name        OnlyCrave Live Search Widget
// @namespace   https://onlycrave.com/
// @version     3.1.1
// @description OnlyCrave.com Live Search Widget, modernized with a search type selector and form-based creator search option. Live search as you type. Works on any site.
// @author      OCTeam
// @match       *://*/*
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @connect     onlycrave.com
// @connect     onlycrave.vercel.app
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/557048/OnlyCrave%20Live%20Search%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/557048/OnlyCrave%20Live%20Search%20Widget.meta.js
// ==/UserScript==

"use strict";

// --- Configuration ---
// Updated to use your Vercel URL for the CORS proxy base
const CORS_PROXY_BASE = "https://onlycrave.vercel.app/api/proxy?type=";
const API_TIMEOUT = 15000; // 15 seconds

// Direct RSS URLs (used when on onlycrave.com, no proxy needed)
const FEED_BLOG = "https://onlycrave.com/rss";
const FEED_CREATORS = "https://onlycrave.com/rss/creators/feed";
const CREATOR_SEARCH_URL = "https://onlycrave.com/creators";
const ICON_URL = "https://greasyfork.s3.us-east-2.amazonaws.com/ugu9ve3pagrv4w27q0rg2jqnv6kk";
const MAX_RESULTS = 50;

// Mapping for easy lookup (used for the non-CORS case)
const FEED_MAPPING = {
    'blog': FEED_BLOG,
    'creators': FEED_CREATORS
};

// --- Helper Functions ---

// Prevent duplicates
if (window.__ONLYCRAVE_WIDGET_ACTIVE__) {
    console.warn("OnlyCrave Search Widget already active.");
    return;
}
window.__ONLYCRAVE_WIDGET_ACTIVE__ = true;

// Only show if page mentions "onlycrave"
if (!location.hostname.includes("onlycrave") && !document.body.innerText.toLowerCase().includes("onlycrave")) {
    return;
}

const escapeHtml = s => s.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[m]));

const highlight = (text, rawQuery) => {
    if (!rawQuery) return text;
    const query = rawQuery.replace(/^(blog:|creator:)\s*/i, '').trim();
    if (!query) return text;

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
        const regex = new RegExp(safeQuery, 'ig');
        return text.replace(regex, m => `<mark style="background:#e100ff55;color:#fff;border-radius:3px;padding:1px 2px;">${m}</mark>`);
    } catch (e) {
        console.error("Invalid regex in highlight:", e);
        return text;
    }
};

const el = html => {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
};

// --- UI Components (The HTML structure remains the same as it was modernized earlier) ---
const panel = el(`
<div id="oc-panel" style="position:fixed;top:120px;left:40px;width:380px;background:#2e1a47;color:#fff;z-index:9999999;border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,0.4);font-family:system-ui,sans-serif;border:1px solid #3a245a;overflow:hidden;display:flex;flex-direction:column;backdrop-filter:blur(6px);">
    <div id="oc-header" style="padding:10px 18px;background:#1b112c;font-size:16px;font-weight:700;cursor:move;user-select:none;display:flex;justify-content:space-between;align-items:center;">
        <span>OnlyCrave Search</span>
        <button id="oc-min-btn" style="background:none;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;opacity:0.8;">&minus;</button>
    </div>
    <div style="padding:15px;background:#2e1a47;">
        <div id="oc-search-scope" style="display:flex;margin-bottom:10px;border-radius:8px;overflow:hidden;background:#1b112c;border:1px solid #4c2f7d;">
            ${['All', 'Blog', 'Creators'].map(type => `
                <input type="radio" id="oc-scope-${type.toLowerCase()}" name="oc-search-scope" value="${type.toLowerCase()}" ${type === 'All' ? 'checked' : ''} style="display:none;">
                <label for="oc-scope-${type.toLowerCase()}" style="flex-grow:1;text-align:center;padding:8px 0;font-size:13px;font-weight:500;cursor:pointer;transition:background-color 0.2s, color 0.2s;color:#ccc;border-right:1px solid #4c2f7d;">${type}</label>
            `).join('')}
        </div>

        <form id="oc-search-form" style="display:flex;gap:8px;">
            <input id="oc-input" placeholder="Start typing to search..." style="flex-grow:1;padding:10px;border-radius:8px;border:1px solid #4c2f7d;background:#1b112c;color:#fff;font-size:14px;">
            <button type="submit" id="oc-creator-btn" style="padding:10px 14px;border-radius:8px;border:0;background:#e100ff;color:white;font-weight:600;font-size:14px;cursor:pointer;transition:background 0.2s;display:none;">Search</button>
        </form>

        <div id="oc-info" style="font-size:12px;margin-top:8px;color:#bbb;min-height:14px;">Feeds: blog + creators (RSS)</div>
        <div id="oc-status" style="font-size:12px;margin-top:4px;color:#e100ff;min-height:14px;"></div>

        <div id="oc-results" style="margin-top:15px;max-height:60vh;overflow-y:auto;padding-right:4px;display:none;border-top:1px solid #412a60;padding-top:15px;"></div>
    </div>
</div>
`);

const bubble = el(`
<div id="oc-bubble" style="position:fixed;top:120px;left:40px;width:54px;height:54px;border-radius:50%;background:#2e1a47;border:2px solid #e100ff;box-shadow:0 8px 25px rgba(0,0,0,0.4);cursor:pointer;z-index:9999999;display:none;overflow:hidden;">
    <img src="${ICON_URL}" style="width:100%;height:100%;object-fit:cover;">
</div>
`);

// Apply styles
document.head.appendChild(el(`
<style>
    #oc-search-scope label:last-child { border-right: none !important; }
    #oc-search-scope input:checked + label { background-color: #e100ff; color: #fff !important; font-weight: 600 !important; }
    #oc-search-scope input:not(:checked) + label:hover { background-color: #3a245a; }
    #oc-creator-btn:hover { background: #c500e5 !important; }
</style>
`));

document.body.appendChild(panel);
document.body.appendChild(bubble);

// --- Draggable ---
function makeDraggable(handle, element) {
    let dragging = false, offsetX = 0, offsetY = 0;
    handle.addEventListener("mousedown", e => {
        dragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.zIndex = "99999999"; 
        e.preventDefault();
    });
    document.addEventListener("mousemove", e => {
        if (!dragging) return;
        element.style.left = (e.clientX - offsetX) + "px";
        element.style.top = (e.clientY - offsetY) + "px";
    });
    document.addEventListener("mouseup", () => {
        dragging = false;
        element.style.zIndex = "9999999";
    });
}
makeDraggable(panel.querySelector("#oc-header"), panel);
makeDraggable(bubble, bubble);

// --- Minimize / Restore ---
panel.querySelector("#oc-min-btn").onclick = () => { panel.style.display = "none"; bubble.style.display = "block"; };
bubble.onclick = () => { bubble.style.display = "flex"; panel.style.display = "flex"; };

// --- Global State & Elements ---
const input = panel.querySelector("#oc-input");
const resultsDiv = panel.querySelector("#oc-results");
const infoDiv = panel.querySelector("#oc-info");
const statusDiv = panel.querySelector("#oc-status");
const searchForm = panel.querySelector("#oc-search-form");
const creatorBtn = panel.querySelector("#oc-creator-btn");
const scopeRadios = document.getElementsByName("oc-search-scope");

let cachedItems = {
    blog: null,
    creators: null
};

let currentScope = 'all';

// --- Fetch RSS (using GM_xmlhttpRequest for robust cross-origin) ---
function gmFetchFeed(feedType) {
    // Determine if we are on the same domain or a different domain
    const isCORS = !location.hostname.includes("onlycrave");

    let fetchUrl;
    if (isCORS) {
        // Use the Vercel proxy for cross-origin requests, appending the type parameter
        fetchUrl = CORS_PROXY_BASE + feedType; 
    } else {
        // Use the direct URL when on the onlycrave.com domain (no proxy needed)
        fetchUrl = FEED_MAPPING[feedType];
    }

    if (!fetchUrl) {
        console.error("Invalid feedType specified:", feedType);
        return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: fetchUrl,
            timeout: API_TIMEOUT,
            
            onload: function(response) {
                if (response.status !== 200) {
                    console.error("RSS Fetch failed. Status:", response.status, "URL:", fetchUrl);
                    statusDiv.textContent = `❌ Error: Could not load feed (${response.status} from proxy/server).`;
                    return resolve([]);
                }

                // Vercel proxy returns raw XML text directly, simplifying parsing.
                const xmlText = response.responseText; 

                try {
                    const doc = new DOMParser().parseFromString(xmlText, "application/xml");
                    // Check for XML parsing error indicators
                    if (doc.getElementsByTagName("parsererror").length) {
                        console.error("XML Parsing Error:", xmlText);
                        statusDiv.textContent = '❌ Parsing error: Received corrupted RSS data.';
                        return resolve([]);
                    }
                    
                    const items = [...doc.querySelectorAll("item")].map(it => {
                        const getText = tag => { const e = it.getElementsByTagName(tag)[0]; return e ? e.textContent.trim() : ""; };
                        const dc = it.getElementsByTagName("dc:creator")[0];
                        const author = dc ? dc.textContent.trim() : "OCTeam";
                        const link = getText("link") || getText("guid");
                        const title = getText("title");
                        const desc = getText("description");
                        const date = getText("pubDate");
                        return { title, link, desc, date, author };
                    });
                    resolve(items);
                } catch (e) {
                    console.error("Failed to parse XML:", e);
                    statusDiv.textContent = '❌ Parsing error: Could not process RSS structure.';
                    resolve([]);
                }
            },
            onerror: function(response) {
                console.error("GM_xmlhttpRequest error:", response);
                statusDiv.textContent = '❌ Connection Error: Request failed (Network or CORS issue).';
                resolve([]);
            },
            ontimeout: function() {
                console.error("GM_xmlhttpRequest timeout.");
                statusDiv.textContent = '⏱️ Request Timeout: Proxy/Server took too long to respond.';
                resolve([]);
            }
        });
    });
}

// --- Render results ---
function renderResults(items, rawQuery) {
    if (!items.length) {
        resultsDiv.innerHTML = '<div style="padding:10px;color:#eee;text-align:center;">No RSS results found.</div>';
        resultsDiv.style.display = "block";
        return;
    }

    resultsDiv.innerHTML = items.slice(0, MAX_RESULTS).map(it => `
        <a href="${it.link}" target="_blank" style="display:block;padding:12px;border-radius:10px;border:1px solid #3a245a;background:#1b112c;text-decoration:none;color:#fff;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
            <div style="font-weight:700;font-size:15px;margin-bottom:4px;">${highlight(escapeHtml(it.title), rawQuery)}</div>
            <div style="font-size:12px;color:#bbb;margin-bottom:6px;">${it.source} • ${it.author} • ${it.date ? new Date(it.date).toLocaleDateString() : "Unknown"}</div>
            <div style="font-size:13px;color:#ccc;max-height:3.5em;overflow:hidden;line-height:1.4;">${highlight(escapeHtml(it.desc), rawQuery)}</div>
        </a>
    `).join("");
    resultsDiv.style.display = "block";
}

// --- Live search (RSS) ---
async function doRssSearch(rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    statusDiv.textContent = 'Loading RSS feeds...';

    // 1. Determine feeds to use
    let useBlog = currentScope === 'all' || currentScope === 'blog';
    let useCreators = currentScope === 'all' || currentScope === 'creators';

    // 2. Fetch/Cache Feeds. Pass the feed type string ('blog' or 'creators').
    const fetchPromises = [];
    if (useBlog && !cachedItems.blog) {
        fetchPromises.push(gmFetchFeed('blog').then(items => { cachedItems.blog = items.map(i => ({ ...i, source: 'blog' })); }));
    }
    if (useCreators && !cachedItems.creators) {
        fetchPromises.push(gmFetchFeed('creators').then(items => { cachedItems.creators = items.map(i => ({ ...i, source: 'creators' })); }));
    }

    if (fetchPromises.length > 0) {
        await Promise.all(fetchPromises);
    }

    // 3. Combine and Filter
    let items = [];
    if (useBlog && cachedItems.blog) items.push(...cachedItems.blog);
    if (useCreators && cachedItems.creators) items.push(...cachedItems.creators);

    const filtered = items.filter(it => {
        if (!query) return true;
        const hay = (it.title + " " + it.desc + " " + it.author).toLowerCase();
        return hay.includes(query);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    // 4. Render
    statusDiv.textContent = filtered.length > 0 ? `${filtered.length} results found.` : 'No results found.';
    renderResults(filtered, rawQuery);
}

// --- Scope Change Handler ---
function handleScopeChange(event) {
    currentScope = event.target.value;
    input.value = '';
    resultsDiv.style.display = 'none';
    statusDiv.textContent = '';

    const isRssSearch = currentScope === 'all' || currentScope === 'blog';
    
    // Update UI based on scope
    if (isRssSearch) {
        infoDiv.textContent = currentScope === 'all' ? "Feeds: blog + creators (RSS)" : "Feeds: blog (RSS)";
        creatorBtn.style.display = 'none';
        input.placeholder = 'Start typing to search...';
    } else { // 'creators'
        infoDiv.textContent = "Search: creators (Form Submission)";
        creatorBtn.style.display = 'block';
        input.placeholder = 'Enter creator name (min 3 chars)...';
    }
}

// --- Event Listeners ---
for (const radio of scopeRadios) {
    radio.addEventListener('change', handleScopeChange);
}

// Initial scope setup
document.getElementById('oc-scope-all').dispatchEvent(new Event('change'));

// Form Submit Handler
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();

    if (currentScope === 'creators') {
        if (query.length < 3) {
            statusDiv.textContent = 'Creator search requires at least 3 characters.';
            return;
        }
        // Creator Search (Form Submission)
        const formUrl = `${CREATOR_SEARCH_URL}?q=${encodeURIComponent(query)}`;
        window.open(formUrl, '_blank');
        statusDiv.textContent = `Searching for "${query}" on OnlyCrave...`;
        resultsDiv.style.display = 'none';
    } else {
        // RSS Search
        doRssSearch(input.value);
    }
});


// Input Event (Debounced for Live RSS Search)
let searchTimeout;
input.addEventListener("input", () => {
    // Only live search for RSS scopes
    if (currentScope === 'all' || currentScope === 'blog') {
        clearTimeout(searchTimeout);
        if (input.value.trim().length === 0) {
            statusDiv.textContent = '';
            resultsDiv.style.display = 'none';
            return;
        }
        statusDiv.textContent = 'Searching...';
        searchTimeout = setTimeout(() => doRssSearch(input.value), 300);
    } else {
        // Clear RSS results/status if user starts typing in creator mode
        resultsDiv.style.display = 'none';
        statusDiv.textContent = '';
    }
});