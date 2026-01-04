// ==UserScript==
// @name                Feed Finder
// @name:zh-TW          RSS Feed 查找器
// @name:zh-CN          RSS Feed 查找器
// @namespace           https://github.com/Gholts
// @version             13.7
// @description         Detect the feed of the current website to facilitate subscription of RSS content.
// @description:zh-TW   偵測目前網站的feed，方便訂閱RSS內容。
// @description:zh-CN   检测当前网站的feed，方便订阅RSS内容。
// @author              Gholts
// @license             GNU Affero General Public License v3.0
// @match               *://*/*
// @grant               GM_xmlhttpRequest
// @grant               GM_setClipboard
// @run-at              document-idle
// @downloadURL https://update.greasyfork.org/scripts/551964/Feed%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/551964/Feed%20Finder.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (window.self !== window.top) return;

    const siteSpecificRules = {
        "github.com": (url) => {
            const siteFeeds = new Map();
            const pathParts = url.pathname.split("/").filter((p) => p);
            if (pathParts.length >= 2) {
                const [user, repo] = pathParts;
                siteFeeds.set(
                    `${url.origin}/${user}/${repo}/releases.atom`,
                    "Releases",
                );
                siteFeeds.set(
                    `${url.origin}/${user}/${repo}/commits.atom`,
                    "Commits",
                );
            } else if (pathParts.length === 1) {
                const [user] = pathParts;
                siteFeeds.set(`${url.origin}/${user}.atom`, `${user} Activity`);
            }
            return siteFeeds.size > 0 ? siteFeeds : null;
        },
        "example.com": (url) => {
            const siteFeeds = new Map();
            siteFeeds.set(`${url.origin}/feed.xml`, "Example.com Feed");
            return siteFeeds;
        },
        "medium.com": (url) => {
            const siteFeeds = new Map();
            const parts = url.pathname.split("/").filter(Boolean);
            if (parts.length >= 1) {
                const first = parts[0];
                if (first.startsWith("@"))
                    siteFeeds.set(
                        `${url.origin}/${first}/feed`,
                        `${first} (Medium)`,
                    );
                else siteFeeds.set(`${url.origin}/feed`, `Medium Feed`);
            } else siteFeeds.set(`${url.origin}/feed`, `Medium Feed`);
            return siteFeeds;
        },
    };

    const SCRIPT_CONSTANTS = {
        PROBE_PATHS: [
            "/feed",
            "/rss",
            "/atom.xml",
            "/rss.xml",
            "/feed.xml",
            "/feed.json",
        ],
        FEED_CONTENT_TYPES:
            /^(application\/(rss|atom|rdf)\+xml|application\/(json|xml)|text\/xml)/i,
        UNIFIED_SELECTOR:
            'link[type*="rss"], link[type*="atom"], link[type*="xml"], link[type*="json"], link[rel="alternate"], a[href*="rss"], a[href*="feed"], a[href*="atom"], a[href$=".xml"], a[href$=".json"]',
        HREF_INFERENCE_REGEX: /(\/feed|\/rss|\/atom|(\.(xml|rss|atom|json))$)/i,
    };

    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || "GET",
                url: url,
                headers: options.headers,
                responseType: "text",
                timeout: options.timeout || 5000,
                onload: (res) => {
                    const headerLines = (res.responseHeaders || "")
                        .trim()
                        .split(/[\r\n]+/);
                    const headers = new Map();
                    for (const line of headerLines) {
                        const parts = line.split(":");
                        const key = parts.shift();
                        const value = parts.join(":");
                        if (key && value) {
                            headers.set(key.trim().toLowerCase(), value.trim());
                        }
                    }
                    resolve({
                        ok: res.status >= 200 && res.status < 300,
                        status: res.status,
                        headers: {
                            get: (name) => headers.get(name.toLowerCase()),
                        },
                    });
                },
                onerror: (err) =>
                    reject(
                        new Error(
                            `[gmFetch] Network error for ${url}: ${JSON.stringify(err)}`,
                        ),
                    ),
                ontimeout: () =>
                    reject(new Error(`[gmFetch] Request timed out for ${url}`)),
            });
        });
    }

    function isInsideSVG(el) {
        if (!el) return false;
        let node = el;
        while (node) {
            if (node.nodeName && node.nodeName.toLowerCase() === "svg")
                return true;
            node = node.parentNode;
        }
        return false;
    }

    function safeURL(href) {
        try {
            const url = new URL(href, window.location.href);
            if (url.pathname.toLowerCase().endsWith(".svg")) return null;
            return url.href;
        } catch {
            return null;
        }
    }

    function titleForElement(el, fallback) {
        const t =
            (el.getAttribute &&
                (el.getAttribute("title") || el.getAttribute("aria-label"))) ||
            el.title ||
            "";
        const txt = t.trim() || (el.textContent ? el.textContent.trim() : "");
        return txt || fallback || null;
    }

    async function discoverFeeds(initialDocument, url) {
        const feeds = new Map();
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch (e) {
            console.warn("[FeedFinder] invalid url", url);
            return [];
        }

        const rule = siteSpecificRules[parsedUrl.hostname];
        if (rule) {
            try {
                const siteFeeds = rule(parsedUrl);
                if (siteFeeds) {
                    siteFeeds.forEach((title, href) => {
                        if (!feeds.has(href)) feeds.set(href, title);
                    });
                }
            } catch (e) {
                console.error(
                    "[FeedFinder] siteSpecific rule error for",
                    parsedUrl.hostname,
                    e,
                );
            }
        }

        function findFeedsInNode(node) {
            node.querySelectorAll(SCRIPT_CONSTANTS.UNIFIED_SELECTOR).forEach(
                (el) => {
                    if (isInsideSVG(el)) return;

                    let isFeed = false;
                    const nodeName = el.nodeName.toLowerCase();

                    if (nodeName === "link") {
                        const type = el.getAttribute("type");
                        const rel = el.getAttribute("rel");
                        if (
                            (type && /(rss|atom|xml|json)/.test(type)) ||
                            (rel === "alternate" && type)
                        ) {
                            isFeed = true;
                        }
                    } else if (nodeName === "a") {
                        const hrefAttr = el.getAttribute("href");
                        if (
                            hrefAttr &&
                            !/^(javascript|data):/i.test(hrefAttr)
                        ) {
                            if (
                                SCRIPT_CONSTANTS.HREF_INFERENCE_REGEX.test(
                                    hrefAttr,
                                )
                            ) {
                                isFeed = true;
                            } else {
                                const img = el.querySelector("img");
                                if (img) {
                                    const src = (
                                        img.getAttribute("src") || ""
                                    ).toLowerCase();
                                    const className = (
                                        img.className || ""
                                    ).toLowerCase();
                                    if (
                                        /(rss|feed|atom)/.test(src) ||
                                        /(rss|feed|atom)/.test(className)
                                    ) {
                                        isFeed = true;
                                    }
                                }
                                if (
                                    !isFeed &&
                                    /(rss|feed)/i.test(el.textContent.trim())
                                ) {
                                    isFeed = true;
                                }
                            }
                        }
                    }

                    if (isFeed) {
                        const feedUrl = safeURL(el.href);
                        if (feedUrl && !feeds.has(feedUrl)) {
                            const feedTitle = titleForElement(el, feedUrl);
                            feeds.set(feedUrl, feedTitle);
                        }
                    }
                },
            );
        }

        try {
            findFeedsInNode(initialDocument);
        } catch (e) {
            console.warn("[FeedFinder] findFeedsInNode failure", e);
        }

        const baseUrls = new Set([`${parsedUrl.protocol}//${parsedUrl.host}`]);
        if (parsedUrl.pathname && parsedUrl.pathname !== "/") {
            baseUrls.add(
                `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname.replace(/\/$/, "")}`,
            );
        }

        async function probeUrl(targetUrl) {
            if (feeds.has(targetUrl)) return;
            try {
                let res = await gmFetch(targetUrl, { method: "HEAD" });
                if (res.status === 405) {
                    res = await gmFetch(targetUrl, { method: "GET" });
                }

                const contentType = res.headers.get("content-type") || "";
                if (
                    res.ok &&
                    SCRIPT_CONSTANTS.FEED_CONTENT_TYPES.test(contentType)
                ) {
                    if (!feeds.has(targetUrl)) {
                        feeds.set(targetUrl, `Discovered Feed`);
                    }
                }
            } catch (err) {
            }
        }

        const probePromises = [];
        baseUrls.forEach((base) => {
            SCRIPT_CONSTANTS.PROBE_PATHS.forEach((path) => {
                const targetUrl = base + path;
                probePromises.push(probeUrl(targetUrl));
            });
        });

        await Promise.allSettled(probePromises);

        return Array.from(feeds, ([u, t]) => ({ url: u, title: t }));
    }

    const STYLE_ID = "ff-style-unique";
    const WIDGET_ID = "ff-widget-unique-id";

    const cssContent = `
    :root {
        --ff-expanded-width: 320px;
        
        --ff-accent: #5b6c7c;
        --ff-accent-rgb: 91, 108, 124;
        
        --ff-bg-light: rgba(255, 255, 255, 0.85);
        
        --ff-blur-val: 10px;
        --ff-blur-active-val: 20px;
        
        --ff-text-light: #1a1a1a;
        --ff-border: rgba(127, 127, 127, 0.2);
        --ff-shadow: -4px 8px 24px rgba(0, 0, 0, 0.12);
        
        --ff-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        --ff-ease-natural: cubic-bezier(0.16, 1, 0.3, 1);
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --ff-accent: #94a6b8;
            --ff-accent-rgb: 148, 166, 184;
            
            --ff-blur-val: 5px;
            --ff-blur-active-val: 10px;
            
            --ff-text-light: #eeeeee;
            --ff-bg-light: rgba(30, 30, 30, 0.85);
            --ff-border: rgba(255, 255, 255, 0.15);
            --ff-shadow: -4px 8px 24px rgba(0, 0, 0, 0.4);
        }
    }

    .ff-widget, .ff-widget * { box-sizing: border-box; outline: none; }

    .ff-widget {
        position: fixed;
        top: 65vh;
        right: 0;
        width: 36px;
        min-height: 36px;
        height: auto;       
        max-height: 36px;
        
        background: rgba(var(--ff-accent-rgb), 0.5);
        
        backdrop-filter: blur(var(--ff-blur-val));
        -webkit-backdrop-filter: blur(var(--ff-blur-val));
        
        box-shadow: var(--ff-shadow);
        z-index: 2147483647;
        cursor: pointer;
        font-family: var(--ff-font);
        border-radius: 12px 0 0 12px;
        overflow: hidden;
        opacity: 1; 
        transform: translateX(0);
        display: flex;
        flex-direction: column;

        transition: 
            width 0.4s var(--ff-ease-natural),
            max-height 0.4s var(--ff-ease-natural),
            background-color 0.3s ease,
            border-radius 0.4s var(--ff-ease-natural),
            transform 0.4s var(--ff-ease-natural),
            backdrop-filter 0.3s ease;
    }

    .ff-widget::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.3);
        opacity: 0;
        pointer-events: none;
        z-index: 1;
        transition: opacity 0.3s;
        border-radius: inherit; 
    }

    .ff-widget:not(.ff-active):hover {
        background: rgba(var(--ff-accent-rgb), 0.9);
        width: 42px;
        padding-right: 4px;
        transition-duration: 0.2s; 
    }

    .ff-widget.scanning:not(.ff-active) { 
        background: rgba(var(--ff-accent-rgb), 0.8);
    }
    .ff-widget.scanning:not(.ff-active)::after {
        animation: ff-breath 1.2s infinite ease-in-out alternate;
    }
    @keyframes ff-breath {
        0% { opacity: 0; }
        100% { opacity: 0.5; box-shadow: 0 0 15px rgba(255,255,255,0.3); }
    }

    .ff-widget.ff-active {
        right: 16px;
        width: var(--ff-expanded-width);
        max-height: 60vh;
        
        background: var(--ff-bg-light);
        
        backdrop-filter: blur(var(--ff-blur-active-val));
        -webkit-backdrop-filter: blur(var(--ff-blur-active-val));
        
        border: 1px solid var(--ff-border);
        cursor: default;
        transform: translateY(-50%);
        border-radius: 16px;
    }

    .ff-icon, .ff-counter {
        position: absolute;
        top: 0; left: 0; width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
        pointer-events: none;
        transition: opacity 0.3s, transform 0.3s;
    }
    .ff-icon { z-index: 2; opacity: 0.9; transform: scale(1); }
    .ff-icon svg { width: 18px; height: 18px; fill: #fff; }
    .ff-counter { z-index: 3; font-weight: 600; font-size: 13px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.2); opacity: 0; transform: scale(0.5); }
    
    .ff-widget.has-count .ff-icon { opacity: 0; transform: scale(0.5); }
    .ff-widget.has-count .ff-counter { opacity: 1; transform: scale(1); }
    
    .ff-widget.ff-active .ff-counter,
    .ff-widget.ff-active .ff-icon { opacity: 0 !important; visibility: hidden; transition: opacity 0.1s ease-out; }

    .ff-content {
        position: relative; 
        inset: auto;
        flex: 1;
        min-height: 0;
        display: none;
        padding: 20px 24px;
        opacity: 0; visibility: hidden;
        color: var(--ff-text-light);
        z-index: 4;
        width: var(--ff-expanded-width); 
        min-width: var(--ff-expanded-width);
        transition: opacity 0.2s ease-out;
    }
    
    .ff-widget.ff-active .ff-content {
        display: flex;
        flex-direction: column;
        opacity: 1; visibility: visible;
        transition: opacity 0.3s ease-out 0.1s;
    }
    .ff-content.hide { opacity: 0 !important; }

    .ff-content h4 {
        margin: 0 0 12px 0; 
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(127,127,127,0.15);
        font-size: 13px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;
        color: var(--ff-accent);
        flex-shrink: 0;
    }

    .ff-list {
        list-style: none; margin: 0; padding: 0; 
        overflow-y: auto; flex: 1;
        padding-right: 4px;
    }
    .ff-list li { margin-bottom: 12px; }
    .ff-list li:last-child { margin-bottom: 0; }

    .ff-item-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .ff-item-info { flex: 1; overflow: hidden; min-width: 0; }
    
    .ff-list a { display: block; text-decoration: none; color: inherit; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    .ff-list a.title { 
        font-weight: 600; 
        font-size: 14px; 
        margin-bottom: 3px; 
        transition: color 0.2s ease;
        cursor: pointer;
    }
    .ff-list a.title:hover { 
        color: var(--ff-accent); 
    }
    
    .ff-list a.url { font-size: 11px; color: #999; transition: color 0.2s; }
    .ff-list a.url:hover { opacity: 0.8; }
    
    @media (prefers-color-scheme: dark) { 
        .ff-list a.url { color: #888; }
        .ff-list a.url:hover { color: #bbb; }
    }
    
    .ff-copy-btn {
        background: rgba(127,127,127,0.1); 
        border: 1px solid transparent;
        color: var(--ff-accent); 
        cursor: pointer; 
        border-radius: 6px;
        width: 28px; height: 28px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    .ff-copy-btn:hover { 
        background: var(--ff-accent); 
        color: #fff; 
        box-shadow: 0 2px 8px rgba(var(--ff-accent-rgb), 0.4);
        transform: translateY(-1px);
    }
    .ff-copy-btn svg { width: 15px; height: 15px; fill: currentColor; }

    .ff-list::-webkit-scrollbar { width: 4px; }
    .ff-list::-webkit-scrollbar-track { background: transparent; }
    .ff-list::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.1); border-radius: 4px; }
    .ff-list::-webkit-scrollbar-thumb:hover { background-color: rgba(0, 0, 0, 0.2); }
    
    @media (prefers-color-scheme: dark) {
        .ff-list::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.15); }
        .ff-list::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.25); }
        
        .ff-copy-btn { background: rgba(255,255,255,0.08); }
        
        .ff-copy-btn:hover {
            background: var(--ff-accent);
            color: #1a1a1a; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.4); 
        }
    }
    `;

    function ensureCSS() {
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement("style");
            style.id = STYLE_ID;
            style.textContent = cssContent;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    let widget = null;
    let counter = null;
    let content = null;
    let listEl = null;
    let lastCount = 0;

    function buildWidgetUI() {
        if (widget && document.body.contains(widget)) return;
        if (document.getElementById(WIDGET_ID)) return;

        if (widget) {
            widget.remove();
        }

        widget = document.createElement("div");
        widget.id = WIDGET_ID;
        widget.className = "ff-widget";

        if (lastCount > 0) {
            widget.classList.add("has-count");
        }

        counter = document.createElement("div");
        counter.className = "ff-counter";
        if (lastCount > 0) {
            counter.textContent = lastCount;
        }

        const iconDiv = document.createElement("div");
        iconDiv.className = "ff-icon";
        iconDiv.innerHTML = `<svg viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>`;

        content = document.createElement("div");
        content.className = "ff-content";

        const header = document.createElement("h4");
        header.textContent = "Discovered Feeds";

        listEl = document.createElement("ul");
        listEl.className = "ff-list";

        content.appendChild(header);
        content.appendChild(listEl);
        
        widget.appendChild(counter);
        widget.appendChild(iconDiv);
        widget.appendChild(content);

        widget.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!widget.classList.contains("ff-active")) {
                if (!hasSearched) performDiscoveryInBackground();
                widget.classList.add("ff-active");
                document.addEventListener("click", handleClickOutside, true);
            }
        });

        document.documentElement.appendChild(widget);
    }

    // --- Core Logic ---
    let hasSearched = false;
    let currentUrl = window.location.href;
    function delay(ms) {
        return new Promise((r) => setTimeout(r, ms));
    }

    function handleClickOutside(e) {
        if (
            widget &&
            widget.classList.contains("ff-active") &&
            !widget.contains(e.target)
        ) {
            content.classList.add("hide");
            setTimeout(() => {
                if (widget) widget.classList.remove("ff-active");
                if (content) content.classList.remove("hide");
            }, 230);
            document.removeEventListener("click", handleClickOutside, true);
        }
    }

    function createFeedListItem(feed) {
        const li = document.createElement("li");
        li.className = "ff-item-row";

        const infoDiv = document.createElement("div");
        infoDiv.className = "ff-item-info";

        const titleLink = document.createElement("a");
        titleLink.href = feed.url;
        titleLink.target = "_blank";
        titleLink.className = "title";

        let titleText = feed.title || feed.url;
        if (feed.title === feed.url) {
            try {
                const parts = new URL(feed.url).pathname
                    .split("/")
                    .filter(Boolean);
                if (parts.length > 0) titleText = parts[parts.length - 1];
            } catch (e) {}
        }
        titleLink.textContent = titleText;

        const urlLink = document.createElement("a");
        urlLink.href = feed.url;
        urlLink.target = "_blank";
        urlLink.className = "url";
        urlLink.textContent = feed.url;

        infoDiv.appendChild(titleLink);
        infoDiv.appendChild(urlLink);

        const copyBtn = document.createElement("button");
        copyBtn.className = "ff-copy-btn";
        copyBtn.title = "Copy Feed URL";
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;

        copyBtn.onclick = (e) => {
            e.stopPropagation();
            GM_setClipboard(feed.url, "text");
            const originalHtml = copyBtn.innerHTML;
            copyBtn.style.borderColor = "#4CAF50";
            copyBtn.style.color = "#4CAF50";
            copyBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
            setTimeout(() => {
                copyBtn.style.borderColor = "";
                copyBtn.style.color = "";
                copyBtn.innerHTML = originalHtml;
            }, 1500);
        };

        li.appendChild(infoDiv);
        li.appendChild(copyBtn);
        return li;
    }

    function renderResults(feeds) {
        if (!listEl) return;
        listEl.textContent = "";
        if (!feeds || feeds.length === 0) return;
        const fragment = document.createDocumentFragment();
        feeds.forEach((feed) => fragment.appendChild(createFeedListItem(feed)));
        listEl.appendChild(fragment);
    }

    function setListMessage(msg) {
        if (!listEl) return;
        listEl.textContent = "";
        const li = document.createElement("li");
        li.style.padding = "4px";
        li.style.opacity = "0.7";
        li.textContent = msg;
        listEl.appendChild(li);
    }

    async function performDiscoveryInBackground() {
        if (hasSearched) return;
        hasSearched = true;

        if (widget) widget.classList.add("scanning");

        setListMessage("Finding Feeds...");

        try {
            await delay(800);
            const foundFeeds = await discoverFeeds(
                document,
                window.location.href,
            );
            renderResults(foundFeeds);

            const feedCount = foundFeeds.length;
            lastCount = feedCount;

            if (widget) {
                if (feedCount > 0) {
                    widget.classList.add("has-count");
                    if (counter) counter.textContent = feedCount;
                } else {
                    widget.classList.remove("has-count");
                    if (counter) counter.textContent = "";
                }
            }

            if (feedCount === 0) setListMessage("No Feeds Found.");
        } catch (e) {
            console.error("[FeedFinder] error", e);
            setListMessage("Error Scanning.");
        } finally {
            if (widget) widget.classList.remove("scanning");
        }
    }

    function debounce(fn, ms) {
        let t;
        return (...a) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...a), ms);
        };
    }
    const debouncedPerformDiscovery = debounce(
        performDiscoveryInBackground,
        500,
    );

    function mount() {
        ensureCSS();
        buildWidgetUI();

        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            hasSearched = false;
            if (widget) {
                widget.classList.remove("ff-active");
                content.classList.remove("hide");
            }
            debouncedPerformDiscovery();
        } else if (!hasSearched) {
            debouncedPerformDiscovery();
        }
    }

    if (document.readyState === "complete") {
        mount();
    } else {
        window.addEventListener("load", mount);
    }

    const pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(history, arguments);
        mount();
    };
    const replaceState = history.replaceState;
    history.replaceState = function () {
        replaceState.apply(history, arguments);
        mount();
    };
    window.addEventListener("popstate", mount);

    document.addEventListener("astro:page-load", mount);
    document.addEventListener("astro:after-swap", mount);

    // @ts-ignore
    if (window.navigation) {
        // @ts-ignore
        window.navigation.addEventListener("navigatesuccess", mount);
    }

    setInterval(() => {
        if (!document.getElementById(STYLE_ID)) ensureCSS();
        if (
            widget &&
            !document.body.contains(widget) &&
            !document.documentElement.contains(widget)
        ) {
            mount();
        }
    }, 2000);
})();
