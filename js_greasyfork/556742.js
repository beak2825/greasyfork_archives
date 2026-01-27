// ==UserScript==
// @name         GGN Enhanced Gallery with API & Sorting
// @version      2.3.0
// @namespace    https://github.com/midniteryder
// @match        https://gazellegames.net/torrents.php
// @match        https://gazellegames.net/torrents.php?*
// @exclude      /[?&](id|groupid)=/
// @exclude      /[?&]action=(notify|delete_notify)/
// @exclude      /[?&]type=(seeding|uploaded|leeching|snatched|snatched_not_seeding|extlink|downloaded|hitnrun|viewseed)/
// @description  Enhanced gallery view with cover art, sorting, adjustable columns, hover-zoom preview, and gallery bookmark SAVE toggle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @author       MidniteRyder
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/556742/GGN%20Enhanced%20Gallery%20with%20API%20%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/556742/GGN%20Enhanced%20Gallery%20with%20API%20%20Sorting.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // -----------------------------
    // Config / Settings
    // -----------------------------
    const config = {
        async get(key, defaultValue) { return await GM.getValue(key, defaultValue); },
        async set(key, value) { return await GM.setValue(key, value); }
    };

    const settings = {
        apikey: await config.get('ggn_apikey', ''),
        enabled: await config.get('ggn_enabled', false),
        columns: await config.get('ggn_columns', 6),
        sortBy: await config.get('ggn_sort_by', 'relevance'),
        sortDirection: await config.get('ggn_sort_direction', 'desc'),

        // NEW: Hover zoom + backdrop transparency controls
        hoverZoomPercent: await config.get('ggn_hover_zoom_percent', 180), // 100–350
        hoverDimPercent: await config.get('ggn_hover_dim_percent', 15)     // 0–80
    };

    // -----------------------------
    // Styles
    // -----------------------------
    const styles = `
        .gallery-hidden { display: none !important; }

        /* Control Panel - Match GGN's native styling */
        #ggn-controls {
            background: rgba(20, 30, 40, 0.15);
            padding: 12px 15px;
            margin: 0 0 10px 0;
            border: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
            font-family: Helvetica, Arial, sans-serif;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }

        .ggn-control-group { display: flex; align-items: center; gap: 8px; }
        .ggn-control-group label {
            color: #cccccc;
            font-weight: 600;
            font-size: 13px;
            margin-right: 5px;
            line-height: 1.4;
            display: inline-flex;
            align-items: center;
        }

        .ggn-btn {
            padding: 7px 14px;
            border: 1px solid #555;
            border-radius: 3px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            font-size: 12px;
            background: #2d2d2d;
            color: #e0e0e0;
            font-family: Helvetica, Arial, sans-serif;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
        }
        .ggn-btn:hover { background: #3d3d3d; border-color: #666; }
        .ggn-btn-active { background: #4a9eff !important; border-color: #4a9eff !important; color: #ffffff !important; }
        .ggn-btn-warning { background: #d9534f !important; border-color: #d9534f !important; color: #ffffff !important; }
        .ggn-btn-warning:hover { background: #c9302c !important; border-color: #c9302c !important; }
        .ggn-btn-success { background: #2d2d2d !important; border-color: #555 !important; color: #5cb85c !important; font-size: 16px; }
        .ggn-btn-success:hover { background: #3d3d3d !important; border-color: #666 !important; }

        .ggn-status-light {
            width: 12px; height: 12px; border-radius: 50%;
            display: inline-block; margin-left: 10px;
            box-shadow: 0 0 8px currentColor;
            vertical-align: middle;
            position: relative; top: -1px;
        }
        .ggn-status-light-green {
            background: #5cb85c; color: #5cb85c;
            box-shadow: 0 0 8px #5cb85c, inset 0 0 4px rgba(255,255,255,0.5);
        }
        .ggn-status-light-red {
            background: #d9534f; color: #d9534f;
            box-shadow: 0 0 8px #d9534f, inset 0 0 4px rgba(255,255,255,0.5);
        }

        .ggn-select {
            padding: 6px 10px;
            border: 1px solid #555;
            border-radius: 3px;
            background: #2d2d2d;
            color: #e0e0e0;
            font-size: 12px;
            cursor: pointer;
            font-family: Helvetica, Arial, sans-serif;
            min-width: 140px;
            line-height: 1.4;
            height: 30px;
        }
        .ggn-select:hover { border-color: #666; }
        .ggn-select:focus { outline: none; border-color: #4a9eff; }

        .ggn-input {
            padding: 6px 10px;
            border: 1px solid #555;
            border-radius: 3px;
            background: #2d2d2d;
            color: #e0e0e0;
            font-size: 12px;
            width: 70px;
            text-align: center;
            font-family: Helvetica, Arial, sans-serif;
            line-height: 1.4;
            height: 30px;
            box-sizing: border-box;
        }
        .ggn-input:focus { outline: none; border-color: #4a9eff; }

        /* Gallery Container */
        #gallery-container {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 20px;
            padding: 20px;
            max-width: 100%;
        }

        gallery-item { width: 100%; position: relative; cursor: pointer; max-width: 400px; margin: 0 auto; }

        .gallery-item-link {
            display: block;
            text-decoration: none;
            background: #2a2a2a;
            border-radius: 4px;
            overflow: hidden;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            border: 1px solid #3a3a3a;
        }
        .gallery-item-link:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.7);
            border-color: #4a9eff;
        }

        .gallery-item-image-container { position: relative; width: 100%; overflow: hidden; }
        .gallery-item-image {
            width: 100%;
            height: auto;
            display: block;
            aspect-ratio: 3/4;
            object-fit: cover;
        }

        .lazy { opacity: 0; transition: opacity 0.3s; }
        .lazy.lazy-loaded { opacity: 1; }

        .blur-image {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            filter: blur(10px);
            z-index: 1;
        }
        .blur-image.lazy-loaded { display: none; }

        .gallery-item-title {
            padding: 10px;
            text-align: center;
            color: #e0e0e0;
            font-weight: 600;
            font-size: 13px;
            line-height: 1.3;
            min-height: 40px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-family: Helvetica, Arial, sans-serif;
        }

        /* --- SAVE / Bookmark button (used on zoom overlay) --- */
        .ggn-save-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 9px;
            border-radius: 7px;
            border: 1px solid rgba(255,255,255,0.18);
            background: rgba(0,0,0,0.55);
            color: rgba(255,255,255,0.95);
            font-family: Helvetica, Arial, sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.6px;
            cursor: pointer;
            user-select: none;
            transition: border-color 0.18s ease, transform 0.12s ease;
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
        }
        .ggn-save-btn:hover { border-color: rgba(74, 158, 255, 0.7); transform: translateY(-1px); }
        .ggn-save-icon { width: 16px; height: 16px; display: inline-flex; }
        .ggn-save-svg {
            width: 16px; height: 16px;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
        }
        .ggn-save-btn.ggn-save-active { border-color: rgba(245, 208, 0, 0.55); }

        /* -----------------------------
           Hover Zoom Overlay (replaces right/left popup)
           ----------------------------- */
        #ggn-zoom-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0, var(--ggn-dim-alpha, 0.15));
            opacity: 0;
            pointer-events: none;
            transition: opacity 160ms ease;
            z-index: 999998;
        }
        #ggn-zoom-backdrop.active {
            opacity: 1;
            pointer-events: auto;
        }

        #ggn-zoom-overlay {
            position: fixed;
            display: none;
            z-index: 999999;
            border-radius: 8px;
            overflow: hidden;
            background: #111;
            box-shadow: 0 16px 40px rgba(0,0,0,0.75);
            border: 2px solid rgba(74,158,255,0.65);
            transition: left 200ms ease, top 200ms ease, width 200ms ease, height 200ms ease, opacity 120ms ease;
            opacity: 0;
        }
        #ggn-zoom-overlay.active {
            opacity: 1;
        }
        #ggn-zoom-overlay img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        /* API Key Input Modal */
        #ggn-api-modal {
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999999;
        }

        #ggn-api-modal-content {
            background: #2a2a2a;
            padding: 30px;
            border-radius: 4px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
            max-width: 500px;
            width: 90%;
            border: 1px solid #3a3a3a;
        }

        #ggn-api-modal h3 {
            color: #e0e0e0;
            margin-top: 0;
            margin-bottom: 15px;
            font-family: Helvetica, Arial, sans-serif;
        }

        #ggn-api-modal p {
            color: #b0b0b0;
            margin-bottom: 15px;
            line-height: 1.6;
            font-size: 13px;
            font-family: Helvetica, Arial, sans-serif;
        }

        #ggn-api-modal a { color: #4a9eff; text-decoration: none; }
        #ggn-api-modal a:hover { text-decoration: underline; }

        #ggn-api-modal input {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #555;
            border-radius: 3px;
            background: #1a1a1a;
            color: #e0e0e0;
            font-size: 13px;
            box-sizing: border-box;
            font-family: Helvetica, Arial, sans-serif;
        }

        #ggn-api-modal input:focus { outline: none; border-color: #4a9eff; }

        #ggn-api-modal-buttons { display: flex; gap: 10px; justify-content: flex-end; }
        #ggn-api-modal .ggn-btn { padding: 8px 16px; font-size: 13px; }

        /* Loading Indicator */
        .ggn-loading {
            text-align: center;
            padding: 40px;
            color: #cccccc;
            font-size: 16px;
            font-family: Helvetica, Arial, sans-serif;
        }
        .ggn-loading::after { content: '...'; animation: ellipsis 1.5s infinite; }
        @keyframes ellipsis { 0% { content: '.'; } 33% { content: '..'; } 66% { content: '...'; } }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // -----------------------------
    // Hover Zoom Overlay Elements
    // -----------------------------
    const zoomBackdrop = document.createElement('div');
    zoomBackdrop.id = 'ggn-zoom-backdrop';
    document.body.appendChild(zoomBackdrop);

    const zoomOverlay = document.createElement('div');
    zoomOverlay.id = 'ggn-zoom-overlay';
    zoomOverlay.innerHTML = `
        <img alt="">
        <button class="ggn-save-btn" type="button" aria-pressed="false" title="Add bookmark">
            <span class="ggn-save-icon"></span>
            <span class="ggn-save-text">SAVE</span>
        </button>
    `;
    document.body.appendChild(zoomOverlay);

    const zoomImg = zoomOverlay.querySelector('img');
    const zoomSaveBtn = zoomOverlay.querySelector('.ggn-save-btn');
    const zoomSaveIcon = zoomOverlay.querySelector('.ggn-save-icon');

    // Apply dim alpha CSS var
    function applyDimVar() {
        const a = Math.max(0, Math.min(80, Number(settings.hoverDimPercent))) / 100;
        document.documentElement.style.setProperty('--ggn-dim-alpha', String(a));
    }
    applyDimVar();

    function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

    // -----------------------------
    // Bookmark helpers (uses site's existing bookmark link in hidden table)
    // -----------------------------
    const bookmarkLinkCache = new Map(); // groupId -> <a id="bookmarklink_torrent_...">

    function findBookmarkLinkForGroupId(groupId) {
        const key = String(groupId);
        if (bookmarkLinkCache.has(key)) return bookmarkLinkCache.get(key);

        const table = document.getElementById('torrent_table');
        if (!table) return null;

        const groupHrefNeedle = `torrents.php?id=${encodeURIComponent(key)}`;

        let groupLink = table.querySelector(`a[href*="${CSS.escape(groupHrefNeedle)}"]`);
        if (!groupLink) {
            const anchors = table.querySelectorAll('a[href*="torrents.php?id="]');
            for (const a of anchors) {
                const href = a.getAttribute('href') || '';
                if (href.includes(`torrents.php?id=${key}`)) {
                    groupLink = a;
                    break;
                }
            }
        }

        if (!groupLink) {
            bookmarkLinkCache.set(key, null);
            return null;
        }

        const row = groupLink.closest('tr');
        if (!row) {
            bookmarkLinkCache.set(key, null);
            return null;
        }

        const bookmarkLink = row.querySelector(`a[id^="bookmarklink_torrent_"]`);
        bookmarkLinkCache.set(key, bookmarkLink || null);
        return bookmarkLink || null;
    }

    function isBookmarkedFromLink(bookmarkLinkEl) {
        if (!bookmarkLinkEl) return false;
        const title = (bookmarkLinkEl.getAttribute('title') || '').toLowerCase();
        const cls = bookmarkLinkEl.classList;
        if (title.includes('remove')) return true;
        if (cls.contains('removebookmark')) return true;
        return false;
    }

    // IMPORTANT FIX: use .click() first (many sites bind handlers expecting a real click),
    // fallback to dispatchEvent if needed.
    function clickSiteBookmarkLink(bookmarkLinkEl) {
        if (!bookmarkLinkEl) return;
        try {
            bookmarkLinkEl.click();
        } catch (_) {
            bookmarkLinkEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
    }

    const SAVE_SVG_EMPTY = `
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" class="ggn-save-svg" shape-rendering="crispEdges">
            <rect x="6" y="4" width="20" height="24" rx="0" ry="0" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2"/>
            <rect x="9" y="6" width="14" height="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
            <rect x="10" y="18" width="12" height="8" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.45)" stroke-width="1"/>
            <rect x="7" y="26" width="18" height="4" fill="rgba(0,0,0,0.55)"/>
        </svg>
    `;

    const SAVE_SVG_FILLED = `
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" class="ggn-save-svg" shape-rendering="crispEdges">
            <rect x="6" y="4" width="20" height="24" rx="0" ry="0" fill="#f5d000" stroke="rgba(0,0,0,0.55)" stroke-width="2"/>
            <rect x="9" y="6" width="14" height="8" fill="rgba(255,255,255,0.35)" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>
            <rect x="10" y="18" width="12" height="8" fill="rgba(0,0,0,0.20)" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>
            <rect x="7" y="26" width="18" height="4" fill="rgba(0,0,0,0.55)"/>
        </svg>
    `;

    function setSaveButtonState(btnEl, iconEl, bookmarked) {
        if (!btnEl || !iconEl) return;
        btnEl.classList.toggle('ggn-save-active', !!bookmarked);
        iconEl.innerHTML = bookmarked ? SAVE_SVG_FILLED : SAVE_SVG_EMPTY;
        btnEl.setAttribute('aria-pressed', bookmarked ? 'true' : 'false');
        btnEl.title = bookmarked ? 'Remove bookmark' : 'Add bookmark';
    }

    // -----------------------------
    // Hover Zoom Logic
    // -----------------------------
    let activeHover = null; // { groupId, link, imageSrc, sourceRect }
    let hideTimer = null;

    function clearHideTimer() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    function scheduleHide() {
        clearHideTimer();
        hideTimer = setTimeout(() => hideZoom(), 80);
    }

    function hideZoom() {
        activeHover = null;
        zoomOverlay.classList.remove('active');
        zoomBackdrop.classList.remove('active');
        // Let transition fade, then fully hide
        setTimeout(() => {
            if (!activeHover) zoomOverlay.style.display = 'none';
        }, 140);
    }

    function showZoomFor(linkEl, groupId, imageSrc, groupLinkHref) {
        clearHideTimer();

        const rect = linkEl.querySelector('.gallery-item-image-container').getBoundingClientRect();
        const scale = clamp(Number(settings.hoverZoomPercent) || 180, 100, 350) / 100;

        const baseW = rect.width;
        const baseH = rect.height;

        const targetW = baseW * scale;
        const targetH = baseH * scale;

        const centerX = rect.left + baseW / 2;
        const centerY = rect.top + baseH / 2;

        const margin = 16;
        const left = clamp(centerX - targetW / 2, margin, window.innerWidth - targetW - margin);
        const top  = clamp(centerY - targetH / 2, margin, window.innerHeight - targetH - margin);

        activeHover = { groupId: String(groupId), groupLinkHref };

        // Set initial position equal to source rect (so it "grows" smoothly)
        zoomOverlay.style.display = 'block';
        zoomOverlay.style.left = `${Math.round(rect.left)}px`;
        zoomOverlay.style.top = `${Math.round(rect.top)}px`;
        zoomOverlay.style.width = `${Math.round(baseW)}px`;
        zoomOverlay.style.height = `${Math.round(baseH)}px`;
        zoomOverlay.classList.remove('active');

        // Set image
        zoomImg.src = imageSrc;
        zoomImg.alt = `Preview`;

        // Backdrop
        zoomBackdrop.classList.add('active');

        // Set save icon state
        const bookmarkLinkEl = findBookmarkLinkForGroupId(groupId);
        const bookmarked = isBookmarkedFromLink(bookmarkLinkEl);
        setSaveButtonState(zoomSaveBtn, zoomSaveIcon, bookmarked);

        // Animate to target size/pos next frame
        requestAnimationFrame(() => {
            if (!activeHover || activeHover.groupId !== String(groupId)) return;
            zoomOverlay.classList.add('active');
            zoomOverlay.style.left = `${Math.round(left)}px`;
            zoomOverlay.style.top = `${Math.round(top)}px`;
            zoomOverlay.style.width = `${Math.round(targetW)}px`;
            zoomOverlay.style.height = `${Math.round(targetH)}px`;
        });
    }

    // Keep overlay open when hovering it
    zoomOverlay.addEventListener('mouseenter', () => clearHideTimer());
    zoomOverlay.addEventListener('mouseleave', () => scheduleHide());

    // Clicking backdrop closes
    zoomBackdrop.addEventListener('click', () => hideZoom());

    // Click on zoom image navigates to group page (not the save button)
    zoomImg.addEventListener('click', (e) => {
        if (!activeHover) return;
        window.location.href = activeHover.groupLinkHref;
    });

    // Save button click toggles bookmark
    zoomSaveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!activeHover) return;

        const bookmarkLinkEl = findBookmarkLinkForGroupId(activeHover.groupId);
        if (!bookmarkLinkEl) return;

        clickSiteBookmarkLink(bookmarkLinkEl);

        // Refresh state after site's JS updates
        setTimeout(() => {
            const updated = isBookmarkedFromLink(bookmarkLinkEl);
            setSaveButtonState(zoomSaveBtn, zoomSaveIcon, updated);
        }, 250);

        setTimeout(() => {
            const updated = isBookmarkedFromLink(bookmarkLinkEl);
            setSaveButtonState(zoomSaveBtn, zoomSaveIcon, updated);
        }, 900);
    });

    window.addEventListener('resize', () => {
        if (!activeHover) return;
        // On resize, just hide to avoid awkward positioning
        hideZoom();
    });

    // -----------------------------
    // API Key Modal
    // -----------------------------
    const showAPIKeyModal = () => {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.id = 'ggn-api-modal';
            modal.innerHTML = `
                <div id="ggn-api-modal-content">
                    <h3>🎮 GGN Gallery Setup</h3>
                    <p><strong>Step 1:</strong> Go to your <a href="https://gazellegames.net/user.php?action=edit" target="_blank">Profile → Access Settings</a></p>
                    <p><strong>Step 2:</strong> Find "API Keys" section</p>
                    <p><strong>Step 3:</strong> Create a new API key (no special permissions needed)</p>
                    <p><strong>Step 4:</strong> Copy and paste it below:</p>
                    <input type="text" id="ggn-api-input" placeholder="Paste your API key here..." value="${settings.apikey || ''}">
                    <div id="ggn-api-modal-buttons">
                        <button class="ggn-btn" id="ggn-api-cancel">Cancel</button>
                        <button class="ggn-btn ggn-btn-active" id="ggn-api-ok">Save & Enable Gallery</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            const input = modal.querySelector('#ggn-api-input');
            const okBtn = modal.querySelector('#ggn-api-ok');
            const cancelBtn = modal.querySelector('#ggn-api-cancel');

            setTimeout(() => input.focus(), 100);

            okBtn.addEventListener('click', async () => {
                const key = input.value.trim();
                if (key.length > 6) {
                    await config.set('ggn_apikey', key);
                    settings.apikey = key;
                    modal.remove();
                    resolve(true);
                } else {
                    alert('Please enter a valid API Key (at least 7 characters)');
                }
            });

            cancelBtn.addEventListener('click', () => { modal.remove(); resolve(false); });

            input.addEventListener('keypress', (e) => { if (e.key === 'Enter') okBtn.click(); });
        });
    };

    // -----------------------------
    // API Handler
    // -----------------------------
    class API {
        constructor(apiKey) { this.apiKey = apiKey; }

        async search(searchString) {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: `https://gazellegames.net/api.php?request=search&search_type=torrents${searchString ? '&' + searchString : ''}`,
                    headers: { 'X-API-Key': this.apiKey },
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const regex = /\s*['"](\d+)['"]\s*:/g;
                                const modifiedString = response.responseText.replace(regex, (match, digits) => {
                                    return match.replace(digits, `key${digits}`);
                                });
                                const apiResult = JSON.parse(modifiedString)?.response;
                                resolve(this.mapGroups(apiResult));
                            } catch (error) {
                                reject(error);
                            }
                        } else if (response.status === 401) {
                            alert('❌ Unauthorized API Key.\n\nYour API key is invalid or expired. Please enter a new one.');
                            config.set('ggn_apikey', '');
                            settings.apikey = '';
                            reject(new Error('Unauthorized'));
                        } else {
                            reject(new Error(`API Error: ${response.status}`));
                        }
                    },
                    onerror: (error) => reject(error)
                });
            });
        }

        mapGroups(objects) {
            return Object.values(objects).flatMap((obj) => {
                if (obj.ID !== undefined) {
                    return {
                        id: obj.ID,
                        name: this.unescapeHTML(obj.Name),
                        year: obj.Year,
                        image: (obj.WikiImage ?? '') || `${window.location.origin}/static/common/noartwork/games.png`,
                        platform: obj.Artists?.[0]?.name,
                        category: obj.categoryid
                    };
                }
                return [];
            });
        }

        unescapeHTML(escapedString) {
            return new DOMParser().parseFromString(escapedString, 'text/html').documentElement.textContent;
        }
    }

    // -----------------------------
    // Gallery Item Custom Element
    // -----------------------------
    class GalleryItem extends HTMLElement {
        connectedCallback() { this.render(); }

        render() {
            const groupName = this.getAttribute('groupName');
            const groupId = this.getAttribute('groupId');
            const image = this.getAttribute('image');
            const year = this.getAttribute('groupYear');

            const link = `torrents.php?id=${groupId}`;

            this.innerHTML = `
                <a href="${link}" class="gallery-item-link" data-group-id="${groupId}">
                    <div class="gallery-item-image-container">
                        <div class="blur-image"></div>
                        <img class="gallery-item-image lazy" data-src="${image}" alt="${groupName}">
                    </div>
                    <div class="gallery-item-title">${groupName}${year ? ` (${year})` : ''}</div>
                </a>
            `;

            const img = this.querySelector('.gallery-item-image');
            const blur = this.querySelector('.blur-image');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const src = img.dataset.src;
                        img.onload = () => {
                            img.classList.add('lazy-loaded');
                            blur.classList.add('lazy-loaded');
                        };
                        img.src = src;
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '300px' });

            observer.observe(img);

            const linkEl = this.querySelector('.gallery-item-link');

            // Hover in: show zoom overlay that "grows" from this cover
            linkEl.addEventListener('mouseenter', () => {
                // Ensure bookmark cache matches current table
                // (table is hidden, but still present; cache cleared on new gallery loads)
                showZoomFor(linkEl, groupId, image, link);
            });

            // Hover out: hide unless the user moved into the overlay
            linkEl.addEventListener('mouseleave', () => scheduleHide());
        }
    }
    customElements.define('gallery-item', GalleryItem);

    // -----------------------------
    // Main Gallery Class
    // -----------------------------
    class Gallery {
        constructor() {
            this.api = settings.apikey ? new API(settings.apikey) : null;
            this.container = null;
        }

        async init() {
            await this.waitForElements();
            this.createControls();

            if (settings.enabled && settings.apikey) {
                await this.loadGallery();
            }
        }

        async waitForElements() {
            return new Promise((resolve) => {
                const check = () => {
                    const table = document.getElementById('torrent_table');
                    if (table) resolve();
                    else setTimeout(check, 100);
                };
                check();
            });
        }

        createControls() {
            const controls = document.createElement('div');
            controls.id = 'ggn-controls';

            const apiButtonContent = settings.apikey ? '🔑' : '🔑 Setup API Key';
            const apiButtonClass = settings.apikey ? 'ggn-btn-success' : 'ggn-btn-warning';
            const apiButtonTitle = settings.apikey ? 'Change API Key' : 'Setup API Key';
            const statusLightClass = settings.apikey ? 'ggn-status-light-green' : 'ggn-status-light-red';

            controls.innerHTML = `
                <div class="ggn-control-group">
                    <label>View:</label>
                    <button id="ggn-view-toggle" class="ggn-btn ${settings.enabled ? 'ggn-btn-active' : ''}">
                        ${settings.enabled ? 'Gallery' : 'List'}
                    </button>
                </div>

                <div class="ggn-control-group">
                    <button id="ggn-api-setup" class="ggn-btn ${apiButtonClass}" title="${apiButtonTitle}">
                        ${apiButtonContent}
                    </button>
                    <span id="ggn-status-light" class="ggn-status-light ${statusLightClass}"></span>
                </div>

                <div class="ggn-control-group" id="ggn-column-control" style="${settings.enabled ? '' : 'display: none;'}">
                    <label>Columns:</label>
                    <input type="number" id="ggn-columns" class="ggn-input" min="2" max="12" value="${settings.columns}">
                </div>

                <div class="ggn-control-group" id="ggn-hover-control" style="${settings.enabled ? '' : 'display: none;'}">
                    <label>Hover Zoom %:</label>
                    <input type="number" id="ggn-hover-zoom" class="ggn-input" min="100" max="350" value="${settings.hoverZoomPercent}">
                </div>

                <div class="ggn-control-group" id="ggn-dim-control" style="${settings.enabled ? '' : 'display: none;'}">
                    <label>Backdrop %:</label>
                    <input type="number" id="ggn-hover-dim" class="ggn-input" min="0" max="80" value="${settings.hoverDimPercent}">
                </div>

                <div class="ggn-control-group">
                    <label>Sort:</label>
                    <select id="ggn-sort-by" class="ggn-select">
                        <option value="relevance">Relevance</option>
                        <option value="time">Time Added</option>
                        <option value="userrating">User Rating</option>
                        <option value="groupname">Title</option>
                        <option value="year">Year</option>
                        <option value="size">Size</option>
                        <option value="snatched">Snatched</option>
                        <option value="seeders">Seeders</option>
                        <option value="leechers">Leechers</option>
                        <option value="metarating">MetaCritic Score</option>
                        <option value="ignrating">IGN Score</option>
                        <option value="gsrating">GameSpot Score</option>
                    </select>
                    <select id="ggn-sort-direction" class="ggn-select" style="min-width: auto; width: 90px;">
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                    <button id="ggn-apply-sort" class="ggn-btn">Apply</button>
                </div>
            `;

            const table = document.getElementById('torrent_table');
            table.parentNode.insertBefore(controls, table);

            document.getElementById('ggn-sort-by').value = settings.sortBy;
            document.getElementById('ggn-sort-direction').value = settings.sortDirection;

            document.getElementById('ggn-view-toggle').addEventListener('click', () => this.toggleView());
            document.getElementById('ggn-api-setup').addEventListener('click', () => this.setupAPIKey());
            document.getElementById('ggn-columns').addEventListener('change', (e) => this.changeColumns(e.target.value));
            document.getElementById('ggn-apply-sort').addEventListener('click', () => this.applySort());

            document.getElementById('ggn-hover-zoom').addEventListener('change', async (e) => {
                const v = clamp(parseInt(e.target.value, 10) || 180, 100, 350);
                e.target.value = v;
                settings.hoverZoomPercent = v;
                await config.set('ggn_hover_zoom_percent', v);
            });

            document.getElementById('ggn-hover-dim').addEventListener('change', async (e) => {
                const v = clamp(parseInt(e.target.value, 10) || 15, 0, 80);
                e.target.value = v;
                settings.hoverDimPercent = v;
                await config.set('ggn_hover_dim_percent', v);
                applyDimVar();
            });
        }

        async setupAPIKey() {
            const hasKey = await showAPIKeyModal();
            if (hasKey && settings.apikey) {
                this.api = new API(settings.apikey);

                const btn = document.getElementById('ggn-api-setup');
                btn.textContent = '🔑';
                btn.className = 'ggn-btn ggn-btn-success';
                btn.title = 'Change API Key';

                const statusLight = document.getElementById('ggn-status-light');
                statusLight.className = 'ggn-status-light ggn-status-light-green';

                if (settings.enabled) await this.loadGallery();
            }
        }

        async toggleView() {
            if (!settings.apikey) {
                alert('⚠️ Please setup your API key first by clicking the "🔑 Setup API Key" button.');
                return;
            }

            settings.enabled = !settings.enabled;
            await config.set('ggn_enabled', settings.enabled);

            const btn = document.getElementById('ggn-view-toggle');
            const columnControl = document.getElementById('ggn-column-control');
            const hoverControl = document.getElementById('ggn-hover-control');
            const dimControl = document.getElementById('ggn-dim-control');
            const table = document.getElementById('torrent_table');

            if (settings.enabled) {
                btn.textContent = 'Gallery';
                btn.classList.add('ggn-btn-active');
                columnControl.style.display = 'flex';
                hoverControl.style.display = 'flex';
                dimControl.style.display = 'flex';
                table.classList.add('gallery-hidden');

                bookmarkLinkCache.clear();
                await this.loadGallery();
            } else {
                btn.textContent = 'List';
                btn.classList.remove('ggn-btn-active');
                columnControl.style.display = 'none';
                hoverControl.style.display = 'none';
                dimControl.style.display = 'none';
                table.classList.remove('gallery-hidden');

                hideZoom();

                if (this.container) {
                    this.container.remove();
                    this.container = null;
                }
            }
        }

        async changeColumns(value) {
            settings.columns = parseInt(value, 10);
            await config.set('ggn_columns', settings.columns);
            if (this.container) {
                this.container.style.gridTemplateColumns = `repeat(${settings.columns}, 1fr)`;
            }
        }

        async applySort() {
            settings.sortBy = document.getElementById('ggn-sort-by').value;
            settings.sortDirection = document.getElementById('ggn-sort-direction').value;
            await config.set('ggn_sort_by', settings.sortBy);
            await config.set('ggn_sort_direction', settings.sortDirection);

            const url = new URL(window.location.href);
            url.searchParams.set('order_by', settings.sortBy);
            url.searchParams.set('order_way', settings.sortDirection);
            window.location.href = url.toString();
        }

        async loadGallery() {
            if (!settings.apikey) {
                alert('⚠️ API key required. Please click "🔑 Setup API Key" button.');
                return;
            }

            if (this.container) this.container.remove();

            this.container = document.createElement('div');
            this.container.id = 'gallery-container';
            this.container.style.gridTemplateColumns = `repeat(${settings.columns}, 1fr)`;

            const table = document.getElementById('torrent_table');
            table.parentNode.insertBefore(this.container, table);

            this.container.innerHTML = '<div class="ggn-loading">Loading gallery</div>';

            try {
                const searchParams = new URLSearchParams(window.location.search);
                const games = await this.api.search(searchParams.toString());

                this.container.innerHTML = '';

                if (games.length === 0) {
                    this.container.innerHTML = '<div class="ggn-loading">No results found</div>';
                    return;
                }

                bookmarkLinkCache.clear();

                const fragment = document.createDocumentFragment();
                games.forEach(game => {
                    const item = document.createElement('gallery-item');
                    item.setAttribute('groupName', game.name);
                    item.setAttribute('groupYear', game.year);
                    item.setAttribute('groupId', game.id);
                    item.setAttribute('image', game.image);
                    fragment.appendChild(item);
                });

                this.container.appendChild(fragment);
            } catch (error) {
                console.error('Gallery load error:', error);
                this.container.innerHTML = `<div class="ggn-loading">Error loading gallery: ${error.message}<br>Check console for details.</div>`;

                const statusLight = document.getElementById('ggn-status-light');
                if (statusLight) statusLight.className = 'ggn-status-light ggn-status-light-red';
            }
        }
    }

    // -----------------------------
    // Init
    // -----------------------------
    const gallery = new Gallery();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => gallery.init());
    } else {
        gallery.init();
    }

})();
