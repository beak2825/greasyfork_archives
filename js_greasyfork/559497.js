// ==UserScript==
// @name         OnlyFans User-Lists Link Collector
// @namespace    https://onlyfans.com/
// @version      1.2.0
// @description  Auto-scrolls and collects OnlyFans profile links. Features smart auto-stop, dynamic filename auto-download, and navigation auto-clear with SPA support.
// @author       Claude 4.5 Sonner, Gemini 3 Pro, ChatGPT-5.2 Thinking
// @icon         https://static2.onlyfans.com/static/prod/f/202512181451-75a62e2193/icons/favicon-32x32.png
// @match        https://onlyfans.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559497/OnlyFans%20User-Lists%20Link%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/559497/OnlyFans%20User-Lists%20Link%20Collector.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var TAB_W = 18;
    var TAB_H = 44;
    var TAB_TEXT_PAD = TAB_W + 9;
    var PANEL_W = 340;
    var USERS_GRID_SELECTORS = [
        'div.b-grid-users',
        'div.b-grid-users-list',
        'div.b-grid'
    ];
    var SCROLL_STEP_PX = 900;
    var SCROLL_INTERVAL_MS = 900;
    var NO_PROGRESS_LIMIT = 4;
    var BOTTOM_NOLOADER_LIMIT = 3;
    var LOADER_VISIBLE_MIN_TOP_RATIO = 0.55;
    var PANEL_TOP_OFFSET_Y = -6;
    var TITLE_MARGIN_BOTTOM = 6;
    var ACTIONS_MARGIN_BOTTOM = 8;

    var collected = new Set();
    var scrolling = false;
    var scrollTimer = null;
    var scrollEl = null;
    var hideTimer = null;
    var isShown = false;
    var pinnedUntil = 0;
    var noProgressTicks = 0;
    var bottomNoLoaderTicks = 0;

    var lastPath = window.location.pathname;
    var uiCreated = false;
    var tab, panel, arrowPath, headerWrap, output, counter, status;

    function nowMs() { return Date.now(); }
    function pinBriefly(ms) {
        pinnedUntil = nowMs() + (ms || 1500);
        showPanel(true);
    }
    function shouldBlockHide() {
        return nowMs() <= pinnedUntil;
    }
    function normalizeUrl(u) {
        if (!u) return '';
        return u.split('?')[0].split('#')[0].replace(/\/+$/, '');
    }
    function toAbsUrl(href) {
        try { return new URL(href, window.location.origin).href; }
        catch (e) { return ''; }
    }
    function isValidProfileLink(url) {
        if (!url || !url.startsWith('https://onlyfans.com/')) return false;
        if (
            url === 'https://onlyfans.com' ||
            url === 'https://onlyfans.com/' ||
            url.startsWith('https://onlyfans.com/help') ||
            url.startsWith('https://onlyfans.com/my/') ||
            url.startsWith('https://onlyfans.com/posts/')
        ) {
            return false;
        }
        var path = url.replace('https://onlyfans.com/', '');
        if (!path) return false;
        if (path.indexOf('/') !== -1) return false;
        return true;
    }
    function getGrid() {
        for (var i = 0; i < USERS_GRID_SELECTORS.length; i++) {
            var el = document.querySelector(USERS_GRID_SELECTORS[i]);
            if (el) return el;
        }
        return null;
    }
    function findScrollableForGrid(gridEl) {
        var el = gridEl;
        while (el && el !== document.body) {
            var cs = window.getComputedStyle(el);
            var oy = cs.overflowY;
            var canScroll = (oy === 'auto' || oy === 'scroll') && (el.scrollHeight > el.clientHeight + 5);
            if (canScroll) return el;
            el = el.parentElement;
        }
        return document.scrollingElement || document.documentElement || document.body;
    }
    function getGridLinks(gridEl) {
        var out = [];
        if (!gridEl) return out;
        var anchors = gridEl.querySelectorAll('a[href]');
        for (var i = 0; i < anchors.length; i++) {
            var raw = anchors[i].getAttribute('href') || '';
            if (!raw) continue;
            if (raw.indexOf('javascript:') === 0) continue;
            var abs = normalizeUrl(toAbsUrl(raw));
            if (abs) out.push(abs);
        }
        return out;
    }
    function updateOutput() {
        var list = Array.from(collected).sort();
        output.value = list.join('\n');
        counter.textContent = list.length + ' links';
        if (!scrolling && status.textContent === 'Scrolling...') status.textContent = 'Idle';
    }
    function collectLinks() {
        var grid = getGrid();
        if (!grid) {
            status.textContent = 'No grid';
            return;
        }
        var links = getGridLinks(grid);
        for (var i = 0; i < links.length; i++) {
            if (isValidProfileLink(links[i])) collected.add(links[i]);
        }
        updateOutput();
    }
    function isVisible(el) {
        if (!el) return false;
        var r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return false;
        if (r.bottom <= 0) return false;
        if (r.top >= window.innerHeight) return false;
        return true;
    }
    function hasVisibleLoader(gridEl, scrollElLocal) {
        var root = gridEl ? (gridEl.parentElement || gridEl) : (scrollElLocal || document.body);
        if (!root) return false;
        var selectors = [
            'svg.g-icon',
            '.g-icon',
            '.loader',
            '.loading',
            '[class*="spinner"]',
            '[class*="Loader"]',
            '[class*="loader"]'
        ];
        for (var s = 0; s < selectors.length; s++) {
            var nodes = root.querySelectorAll(selectors[s]);
            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i];
                if (!isVisible(el)) continue;
                var r = el.getBoundingClientRect();
                if (r.top < window.innerHeight * LOADER_VISIBLE_MIN_TOP_RATIO) continue;
                if (el.closest && el.closest('#of-link-panel')) continue;
                if (el.closest && el.closest('#of-hover-tab')) continue;
                return true;
            }
        }
        return false;
    }
    function atBottom(scrollElLocal) {
        if (!scrollElLocal) return false;
        return (scrollElLocal.scrollTop + scrollElLocal.clientHeight >= scrollElLocal.scrollHeight - 4);
    }
    function evaluateAutoStop(prevCount, prevScrollTop) {
        var grid = getGrid();
        var newCount = collected.size;
        var newScrollTop = scrollEl ? scrollEl.scrollTop : prevScrollTop;
        var progressed = (newCount > prevCount) || (newScrollTop !== prevScrollTop);
        if (!progressed) noProgressTicks += 1;
        else noProgressTicks = 0;
        var bottom = atBottom(scrollEl);
        var loader = hasVisibleLoader(grid, scrollEl);
        if (bottom && !loader && newCount === prevCount) bottomNoLoaderTicks += 1;
        else bottomNoLoaderTicks = 0;
        if (noProgressTicks >= 4 || bottomNoLoaderTicks >= 3) {
            stopScroll('Auto-stopped (end)', true);
        }
    }
    function startScroll() {
        if (scrolling) return;
        var grid = getGrid();
        if (!grid) {
            status.textContent = 'No grid';
            return;
        }
        scrollEl = findScrollableForGrid(grid);
        scrolling = true;
        status.textContent = 'Scrolling...';
        noProgressTicks = 0;
        bottomNoLoaderTicks = 0;
        collectLinks();
        scrollTimer = setInterval(function () {
            var prevCount = collected.size;
            var prevScrollTop = scrollEl ? scrollEl.scrollTop : 0;
            try {
                if (scrollEl) scrollEl.scrollTop = scrollEl.scrollTop + SCROLL_STEP_PX;
                else window.scrollBy(0, SCROLL_STEP_PX);
            } catch (e) {
                window.scrollBy(0, SCROLL_STEP_PX);
            }
            setTimeout(function () {
                collectLinks();
                evaluateAutoStop(prevCount, prevScrollTop);
            }, 180);
        }, SCROLL_INTERVAL_MS);
    }
    function stopScroll(reason, autoDownload) {
        scrolling = false;
        if (scrollTimer) clearInterval(scrollTimer);
        scrollTimer = null;
        status.textContent = reason || 'Stopped';
        if (autoDownload) {
            downloadTxt();
        }
    }
    function clearAll() {
        collected.clear();
        updateOutput();
        status.textContent = 'Cleared';
        setTimeout(function () {
            status.textContent = scrolling ? 'Scrolling...' : 'Idle';
        }, 900);
    }
    function copyAll() {
        GM_setClipboard(output.value || '');
        status.textContent = 'Copied';
        setTimeout(function () {
            status.textContent = scrolling ? 'Scrolling...' : 'Idle';
        }, 900);
    }
    function getCleanTitle() {
        var t = document.title || 'user-list';
        return t.replace(/\s*[—–-]\s*OnlyFans$/i, '').trim();
    }
    function getFormattedDate() {
        var d = new Date();
        var year = d.getFullYear();
        var month = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }
    function downloadTxt() {
        var blob = new Blob([output.value || ''], { type: 'text/plain' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'onlyfans-list_' + getCleanTitle() + '_' + getFormattedDate() + '.txt';
        a.click();
        URL.revokeObjectURL(a.href);
        status.textContent = 'Downloaded';
        setTimeout(function () {
            status.textContent = scrolling ? 'Scrolling...' : 'Idle';
        }, 900);
    }
    function setPanelTopToTab() {
        var tabRect = tab.getBoundingClientRect();
        var headerHeight = headerWrap.getBoundingClientRect().height;
        var top = Math.round(tabRect.top - headerHeight + PANEL_TOP_OFFSET_Y);
        panel.style.top = top + 'px';
    }
    function setArrow(open) {
        arrowPath.setAttribute('d', open ? 'M8 2 L4 6 L8 10 Z' : 'M4 2 L8 6 L4 10 Z');
    }
    function showPanel(force) {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        setPanelTopToTab();
        if (isShown && !force) return;
        isShown = true;
        panel.classList.add('tm-panel-show');
        setArrow(true);
    }
    function scheduleHide() {
        if (shouldBlockHide()) return;
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            if (shouldBlockHide()) return;
            isShown = false;
            panel.classList.remove('tm-panel-show');
            setArrow(false);
        }, 140);
    }

    function isOnUserListsPage() {
        return window.location.pathname.indexOf('/my/collections/user-lists') === 0;
    }

    function showUI() {
        if (tab && panel) {
            tab.style.display = 'flex';
            panel.style.display = 'block';
        }
    }

    function hideUI() {
        if (tab && panel) {
            tab.style.display = 'none';
            panel.style.display = 'none';
            if (isShown) {
                isShown = false;
                panel.classList.remove('tm-panel-show');
                setArrow(false);
            }
        }
    }

    function createUI() {
        if (uiCreated) return;

        GM_addStyle(`
            #of-hover-tab {
                position: fixed;
                left: 0;
                top: 50%;
                width: ${TAB_W}px;
                height: ${TAB_H}px;
                margin-top: -${Math.floor(TAB_H / 2)}px;
                z-index: 100000;
                cursor: pointer;
                opacity: 0.7;
                background-color: #bdc5c8;
                border: 1px solid #abb0b3;
                border-left: none;
                border-radius: 0 5px 5px 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #of-hover-tab:hover { opacity: 1; }
            #of-hover-tab svg { display: block; }
            #of-link-panel {
                position: fixed;
                left: 0;
                top: 50%;
                width: ${PANEL_W}px;
                z-index: 99999;
                transform: translateX(-100%);
                transition: transform 140ms linear, opacity 140ms linear;
                opacity: 0.92;
                background: rgba(0,0,0,0.75);
                color: #fff;
                padding: 10px 10px 10px ${TAB_TEXT_PAD}px;
                border-radius: 0 8px 8px 0;
                font-size: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.35);
            }
            #of-link-panel.tm-panel-show { transform: translateX(0); opacity: 1; }
            #of-header { margin-bottom: ${TITLE_MARGIN_BOTTOM}px; }
            #of-title { font-weight: 700; margin: 0 0 4px 0; }
            #of-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                margin: 0;
            }
            #of-status { opacity: 0.9; font-size: 11px; }
            #of-actions { margin-bottom: ${ACTIONS_MARGIN_BOTTOM}px; }
            #of-actions-row1 {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 6px;
            }
            #of-actions-row2 {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            #of-link-panel button {
                padding: 4px 10px;
                font-size: 12px;
                cursor: pointer;
                background: rgba(255,255,255,0.08);
                color: #fff;
                border: 1px solid rgba(255,255,255,0.25);
                border-radius: 999px;
                line-height: 1.2;
                user-select: none;
            }
            #of-link-panel button:hover { background: rgba(255,255,255,0.18); }
            #of-link-panel button:active { background: rgba(255,255,255,0.28); }
            #of-start { border: 1px solid #4CAF50 !important; box-shadow: 0 0 3px #4CAF50; }
            #of-stop  { border: 1px solid #F44336 !important; box-shadow: 0 0 3px #F44336; }
            #of-clear { border: 1px solid #FFEB3B !important; box-shadow: 0 0 3px #FFEB3B; color: #fff; }
            #of-link-panel textarea {
                width: 100%;
                height: 180px;
                margin-top: 6px;
                font-size: 11px;
                resize: vertical;
            }
        `);

        tab = document.createElement('div');
        tab.id = 'of-hover-tab';
        tab.innerHTML =
            '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">' +
            '<path id="of-arrow-path" d="M4 2 L8 6 L4 10 Z" fill="#2b2f33"></path>' +
            '</svg>';
        document.body.appendChild(tab);
        arrowPath = document.getElementById('of-arrow-path');

        panel = document.createElement('div');
        panel.id = 'of-link-panel';
        panel.innerHTML =
            '<div id="of-header">' +
                '<div id="of-title">OnlyFans Link Collector</div>' +
                '<div id="of-row">' +
                    '<div id="of-counter">0 links</div>' +
                    '<div id="of-status">Idle</div>' +
                '</div>' +
            '</div>' +
            '<div id="of-actions">' +
                '<div id="of-actions-row1">' +
                    '<button id="of-start" type="button">Start scroll</button>' +
                    '<button id="of-stop" type="button">Stop</button>' +
                    '<button id="of-copy" type="button">Copy</button>' +
                    '<button id="of-clear" type="button">Clear</button>' +
                '</div>' +
                '<div id="of-actions-row2">' +
                    '<button id="of-txt" type="button">Download .txt</button>' +
                '</div>' +
            '</div>' +
            '<textarea id="of-output" readonly></textarea>';
        document.body.appendChild(panel);

        headerWrap = document.getElementById('of-header');
        output = document.getElementById('of-output');
        counter = document.getElementById('of-counter');
        status = document.getElementById('of-status');

        document.getElementById('of-start').addEventListener('click', function (e) {
            e.preventDefault();
            pinBriefly(2500);
            startScroll();
        });
        document.getElementById('of-stop').addEventListener('click', function (e) {
            e.preventDefault();
            pinBriefly(2500);
            stopScroll('Stopped');
        });
        document.getElementById('of-copy').addEventListener('click', function (e) {
            e.preventDefault();
            pinBriefly(2500);
            copyAll();
        });
        document.getElementById('of-txt').addEventListener('click', function (e) {
            e.preventDefault();
            pinBriefly(2500);
            downloadTxt();
        });
        document.getElementById('of-clear').addEventListener('click', function (e) {
            e.preventDefault();
            pinBriefly(2500);
            clearAll();
        });

        window.addEventListener('resize', function () {
            if (isShown) setPanelTopToTab();
        }, { passive: true });

        tab.addEventListener('mouseenter', function () { showPanel(false); });
        tab.addEventListener('mouseleave', scheduleHide);
        panel.addEventListener('mouseenter', function () { showPanel(true); });
        panel.addEventListener('mouseleave', scheduleHide);

        setArrow(false);
        uiCreated = true;

        if (!isOnUserListsPage()) {
            hideUI();
        }
    }

    function initializeOnPage() {
        var tries = 0;
        var bootTimer = setInterval(function () {
            tries += 1;
            collectLinks();
            if (getGrid() || tries >= 30) clearInterval(bootTimer);
        }, 500);
    }

    setInterval(function() {
        var currentPath = window.location.pathname;
        if (currentPath !== lastPath) {
            var wasOnUserLists = lastPath.indexOf('/my/collections/user-lists') === 0;
            var isNowOnUserLists = currentPath.indexOf('/my/collections/user-lists') === 0;

            if (wasOnUserLists && !isNowOnUserLists) {
                clearAll();
                status.textContent = 'Left user-lists';
                if (scrolling) stopScroll('Navigated', false);
                hideUI();
            }

            if (!wasOnUserLists && isNowOnUserLists) {
                showUI();
                initializeOnPage();
            }

            lastPath = currentPath;
        }
    }, 500);

    createUI();
    if (isOnUserListsPage()) {
        initializeOnPage();
    }
})();
