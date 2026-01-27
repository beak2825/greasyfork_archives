// ==UserScript==
// @name         NHentai Flow
// @namespace    NEnhanced
// @version      1.8.3
// @description  Several Quality of Life features: Quick Preview, Queue System, Smart Scroll, Tag Selector, and more.
// @author       Testador
// @match        https://nhentai.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      nhentai.net
// @connect      i.nhentai.net
// @icon         https://external-content.duckduckgo.com/ip3/nhentai.net.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564035/NHentai%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/564035/NHentai%20Flow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================================================
    // 0. SETTINGS & CONFIGURATION MANAGER
    // ==========================================================================

    const DEFAULT_SETTINGS = {
        previewNav: true,
        highlightVisited: true,
        showTagOverlay: true,
        enableQueue: true,
        enableTagSelect: true,
        enableSavedSearch: true,
        smartNav: true,
        smartNavSensitivity: 1.5,
        paginationRight: false,
        enableContextMenu: true
    };

    let settings = { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('nhentai_flow_settings') || '{}') };

    function saveSettings() {
        localStorage.setItem('nhentai_flow_settings', JSON.stringify(settings));
        applySettings();
    }

    function applySettings() {
        const body = document.body;

        settings.highlightVisited ? body.classList.add('f-visited') : body.classList.remove('f-visited');
        settings.paginationRight ? body.classList.add('f-pag-right') : body.classList.remove('f-pag-right');
        settings.showTagOverlay ? body.classList.add('f-tags') : body.classList.remove('f-tags');
        settings.enableQueue ? body.classList.add('f-queue') : body.classList.remove('f-queue');
        settings.enableTagSelect ? body.classList.add('f-tag-select') : body.classList.remove('f-tag-select');
        settings.enableSavedSearch ? body.classList.add('f-saved-search') : body.classList.remove('f-saved-search');

        settings.previewNav ? body.classList.remove('disable-preview-nav') : body.classList.add('disable-preview-nav');
    }

    applySettings();

    // ==========================================================================
    // 1. SHARED UTILS & CSS
    // ==========================================================================
    const EXT_MAP = { 'j': 'jpg', 'p': 'png', 'g': 'gif', 'w': 'webp' };
    const CACHE_LIMIT = 5;
    const cache = new Map();
    const states = new Map();
    let hoveredGallery = null;
    let hoverTimeout = null;
    let readingQueue = JSON.parse(localStorage.getItem('nhentai_queue_v1') || '[]');
    const SMART_NAV_THRESHOLD = 600;

    const isReader = !!document.querySelector('#image-container');
    if (!isReader) document.body.classList.add('is-gallery-page');

    const css = `
        /* --- CORE PREVIEW STYLES --- */
        .gallery { position: relative; vertical-align: top; }
        .gallery.is-previewing .cover { padding-bottom: 0 !important; height: auto !important; display: flex; flex-direction: column; }
        .gallery.is-previewing .cover img { position: relative !important; height: auto !important; width: 100% !important; max-height: none !important; object-fit: contain; }
        .inline-preview-ui { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; }
        .gallery:hover .inline-preview-ui, .gallery.is-previewing .inline-preview-ui { display: block; }
        .gallery { vertical-align: bottom !important; }

        /* --- HIGHLIGHT VISITED --- */
        body.f-visited .gallery a:visited .caption { background: #900c2a !important; color: #ecc !important; }

        /* --- CONTEXT MENU --- */
        .nh-context-menu { position: fixed; z-index: 10000; width: 160px; background: #1f1f1f; border-radius: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.7); display: none; flex-direction: column; padding: 5px 0 0 0 ; font-size: 12px; }
        .nh-context-menu.is-visible { display: flex; }
        .nh-cm-item { padding: 8px 15px; cursor: pointer; display: flex; color: #ddd; }
        .nh-cm-item:hover { background: #4d4d4d; }
        .nh-cm-footer { margin-top: 5px; padding: 8px 0; border-top: 1px solid #333; color: #666; font-size: 0.7em; cursor: default; background: #1a1a1a; border-radius: 0 0 5px 5px; }
        .nh-cm-separator { height: 1px; background: #333; margin: 5px 5px}

        /* --- UI ELEMENTS (Hotzones/Seek) --- */
        .hotzone { position: absolute; top: 0; height: calc(100% - 15px); width: 40%; cursor: default; z-index: 20; }
        .hotzone-left { left: 0; } .hotzone-right { right: 0; }
        .seek-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 20px; z-index: 40; cursor: pointer; display: flex; align-items: flex-end; }
        .seek-bg { width: 100%; height: 3px; background: rgba(255,255,255,0.2); transition: height 0.1s; position: relative; backdrop-filter: blur(2px); }
        .seek-container:hover .seek-bg { height: 15px; background: rgba(255,255,255,0.3); }
        .seek-fill { height: 100%; background: #ed2553; width: 0%; transition: width 0.1s; }
        .seek-tooltip { position: absolute; bottom: 17px; transform: translateX(-50%); background: #ed2553; color: #fff; font-size: 10px; padding: 2px 4px; border-radius: .3em; opacity: 0; pointer-events: none; white-space: nowrap; font-weight: bold; transition: opacity 0.1s; }
        .seek-container:hover .seek-tooltip { opacity: 1; }

        /* --- PREVIEW NAV SETTINGS --- */
        body.disable-preview-nav .hotzone,
        body.disable-preview-nav .seek-container { display: none !important; }

        /* --- TAGS & QUEUE TRIGGERS --- */
        .tag-trigger, .queue-trigger { width: 20%; position: absolute; background: rgba(0,0,0,0.6); color: #fff; font-size: 10px; font-weight: 700; padding: 4px 0px; opacity: 0.6; }
        .tag-trigger { border-radius: .3em 0 .3em 0; z-index: 80; }
        .queue-trigger { right: 0; border-radius: 0 .3em 0 .3em; z-index: 50; cursor: pointer; }
        .tag-trigger:hover, .queue-trigger:hover { opacity: 1; background: #ed2553; }
        .tag-trigger:hover { width: 100%; border-radius: .3em .3em 0 0;  }
        .queue-trigger.in-queue { background: #ed2553; opacity: 1; }
        body:not(.f-tags) .tag-trigger { display: none !important; }
        body:not(.f-queue) .queue-trigger { display: none !important; }

        /* --- TAG POPUP --- */
        .tag-popup { display: none; position: absolute; top: 22px; left: 0px; width: 100%; max-height: 80%; overflow-y: auto; overscroll-behavior: contain; background: rgba(15,15,15,0.95); color: #ddd; border-radius: 0 0 .3em .3em; padding: 8px; font-size: 11px; z-index: 60; box-shadow: 0 4px 10px rgba(0,0,0,0.5); text-align: left; line-height: 1.4; }
        .tag-trigger:hover + .tag-popup, .tag-popup:hover { display: block; }
        .tag-category { color: #ed2553; font-weight: bold; margin-bottom: 2px; margin-top: 6px; font-size: 10px; text-transform: uppercase; }
        .tag-pill { display: inline-block; background: #333; padding: 1px 4px; margin: 1px; border-radius: .3em; color: #ccc; }
        .tag-pill.tier-mythic { border: 1px solid #b655f7; color: #d6a0fb; text-shadow: 0 0 5px rgba(168, 85, 247, 0.8); }
        .tag-pill.tier-rare { border: 1px solid #eab308; color: #fef08a; }
        .tag-pill.tier-uncommon { border: 1px solid #0740EB; }
        .tag-pill.style-lgbt { border: none !important; background-image: linear-gradient(144deg, rgba(231, 0, 0, 1) 0%, rgba(255, 140, 0, 1) 20%, rgba(255, 239, 0, 1) 40%, rgba(0, 129, 31, 1) 60%, rgba(0, 68, 255, 1) 80%, rgba(118, 0, 137, 1) 100%); color: #000000 !important; font-weight: 900; text-shadow: 0 0 2px rgba(255,255,255,0.8); }

        /* --- READER STYLES --- */
        #image-container { cursor: default; }
        .exit-fs-indicator { display: none; }
        :fullscreen .exit-fs-indicator { display: block; position: fixed; top: 0; left: 50%; transform: translateX(-50%); font-size: 40px; cursor: pointer; transition: all 0.2s; text-shadow: 0 2px 5px rgba(0,0,0,0.8); padding: 20px 65px; opacity: 0; }
        :fullscreen .exit-fs-indicator:hover { color: #ed2553; transform: translateX(-50%) scale(1.4); opacity: 1; }
        .reader-bar:last-of-type .reader-buttons-right .zoom-buttons, .reader-bar:last-of-type .reader-buttons-right .reader-settings { display: none !important; }
        @media (max-width: 600px) {
            .reader-bar:last-of-type { flex-wrap: wrap !important; height: auto !important; padding-bottom: 8px !important; gap: 5px; }
            .reader-bar:last-of-type .reader-buttons-right { width: 100% !important; justify-content: center !important; padding-top: 8px; }
            .reader-bar:last-of-type .reader-buttons-right .btn { background: #4d4d4d; border-radius: 5px; }
        }

        /* --- SMART NAVIGATION & PAGINATION --- */
        .smart-nav-bar { position: fixed; bottom: 0; left: 0; height: 5px; background: #ed2553; width: 0%; z-index: 9999; transition: width 0.1s linear; box-shadow: 0 -2px 10px rgba(237, 37, 83, 0.5); pointer-events: none; }
        body.is-gallery-page #content { padding-bottom: 200px !important; }
        @media (min-width: 1000px) {
            body.is-gallery-page .pagination { position: fixed !important; top: 50% !important; transform: translateY(-50%) !important; display: flex !important; flex-direction: column !important; z-index: 4; left: 8px !important; right: auto !important; }
            body.is-gallery-page a.first, body.is-gallery-page a.previous, body.is-gallery-page a.last, body.is-gallery-page a.next { transform: rotate(90deg); }
            body.f-pag-right.is-gallery-page .pagination { left: auto !important; right: 16px !important; }
        }

        /* --- TAG SELECTOR & QUEUE BTN --- */
        @media (min-width: 1000px) { #info { width: 580px; } }
        .btn-tag-selector.is-active, .btn-queue-add.in-queue { background: #ed2553 !important; }
        .btn-tag-selector.is-active:hover, .btn-queue-add.in-queue:hover { background: #f15478 !important; }
        .tag-container .tag.tag-selected .name { background: #ed2553 !important; opacity: 1 !important; color: #fff; }
        .tags-selecting-mode .tag:not(.tag-selected) { opacity: 0.6; }
        body:not(.f-queue) .btn-queue-add, body:not(.f-queue) .btn-next-queue { display: none !important; }
        body:not(.f-tag-select) .btn-tag-selector { display: none !important; }

        /* --- QUEUE DOCK --- */
        .queue-dock { position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; align-items: flex-end; z-index: 100; pointer-events: none; }
        body:not(.f-queue) .queue-dock { display: none !important; }
        .queue-toggle-btn { padding: .5em; border-radius: 5px; background: #1a1a1a; color: #fff; font-size: 20px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; position: relative; pointer-events: auto; }
        .queue-toggle-btn:hover { background: #333; }
        .queue-toggle-btn.active { background: #2e2e2e; }
        .queue-count { position: absolute; top: -5px; right: -5px; background: #ed2553; color: #fff; font-size: 10px; font-weight: bold; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ed2553; }
        .queue-panel { background: #1f1f1f; max-width: 90vw; width: 300px; border-radius: 5px; overflow: hidden; margin-bottom: 15px; box-shadow: 0 0 30px rgba(0,0,0,.5); display: block; visibility: hidden; opacity: 0; transform: translateY(20px); transition: transform 0.2s, opacity 0.1s ease; pointer-events: auto; }
        .queue-panel.is-visible { visibility: visible; opacity: 1; transform: translateY(0); }
        .queue-header { padding: 10px; background: #383838; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 13px; }
        .queue-clear, .queue-view-full {  cursor: pointer; font-size: 11px; background: #4d4d4d;padding: 4px 10px; border-radius: 5px; }
        .queue-clear:hover, .queue-view-full:hover {  background: #595959; }
        .queue-list { max-height: 350px; overflow-y: auto; overscroll-behavior: contain; padding: 0; margin: 0; list-style: none; }
        .queue-item { display: flex; padding: 8px; border-bottom: 1px solid #2e2e2e; position: relative; content-visibility: auto; contain-intrinsic-size: 62.5834px; }
        .queue-item:hover { background: #262626; }
        .queue-item img { width: 40px; height: 58px; object-fit: cover; border-radius: .3em; margin-right: 10px; }
        .queue-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
        .queue-title { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; margin-bottom: 4px; }
        .queue-title:hover { color: #fff; }
        .queue-id { font-size: 10px; color: #999; }
        .queue-remove { margin: 8px; color: #555; cursor: pointer; padding: 5px; display: flex; align-items: center; }
        .queue-remove:hover { color: #ed2553; }
        .queue-empty { padding: 20px; text-align: center; color: #666; font-size: 12px; font-style: italic; }
        .queue-toolbar { display: flex; gap: 10px; justify-content: center; }
        .btn-q-tool { background: #1a1a1a; color: #d9d9d9; border: none; padding: .5em; border-radius: 5px; font-size: 20px; font-weight: bold; cursor: pointer; display: flex; align-items: center; }
        .btn-q-tool:hover { background: #333; }
        .btn-q-tool.active { background: #2e2e2e; }
        .btn-q-tool i { margin-right: 6px; }
        @media (max-width: 600px) { .queue-toolbar { flex-wrap: wrap; } .btn-q-tool { font-size: 16px; } }

        /* --- SAVED SEARCHES STYLES  --- */
        .search-saved-trigger { position: absolute; right: 45px; top: 0; height: 100%; width: 35px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #888; z-index: 5; }
        .search-saved-trigger:hover, .search-saved-trigger.is-active { color: #ed2553; }
        .saved-search-extension { position: relative; width: 100%; padding: 0 20px; background: #1f1f1f; box-sizing: border-box; z-index: 5; display: block; overflow: hidden; max-height: 0; transition: max-height 0.5s;  }
        .saved-search-extension.is-visible { max-height: 500px; }
        .sse-header { display: flex; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #2e2e2e; padding: 8px 0; flex-wrap: wrap; }
        .sse-actions { margin-left: auto; }
        .btn-sse-save, .btn-sse-edit { background: #4d4d4d; color: #fff; border: none; padding: 0 12px; border-radius: 3px; line-height: 40px; cursor: pointer; font-weight: bold; }
        .btn-sse-save:hover, .btn-sse-edit:hover { background: #595959; }
        #btn-confirm-del { background: #ed2553; }
        #btn-confirm-del:hover { background: #f15478; }
        .sse-empty { color: #999; font-style: italic; }
        .sse-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; padding-right: 5px; overflow-y: auto; max-height: 40vh; }
        .ss-pill { font-weight: 700; display: inline-flex; align-items: stretch; border-radius: .3em; overflow: hidden; }
        .ss-pill.is-current .ss-text { background: #ed2553; color: #fff; }
        .ss-part { padding: .13em .39em; cursor: pointer; display: flex; align-items: center; background: #4d4d4d }
        .ss-add { padding: .13em .69em; background: #333; color: grey; box-shadow: inset 0 0 .4em #2b2b2b; }
        .ss-add:hover { background: #404040; color: #fff; }
        .ss-text:hover { background: #595959; }
        .sse-list.delete-mode .ss-add { pointer-events: none; opacity: 0.3; background: #000; }
        .ss-pill.to-delete .ss-text { background: #643d3d; color: #d9d9d9; text-decoration: line-through; }
        body:not(.f-saved-search) .search-saved-trigger,
        body:not(.f-saved-search) .saved-search-extension { display: none !important; }

        /* --- SEARCH SHORTCUT HINT --- */
        .search-slash-hint { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #999; font-size: 12px; pointer-events: none; font-family: Consolas, monospace; }
        form.search input:focus ~ .search-slash-hint, form.search input:not(:placeholder-shown) ~ .search-slash-hint { opacity: 0; }
        form.search { position: relative; }
         @media (max-width: 1000px) {
        .search-slash-hint { opacity: 0 }
        }

        /* --- SETTINGS PAGE STYLES --- */
        .settings-container { max-width: 800px; margin: 0 auto; padding: 20px; border-radius: 5px; border: 1px solid #2e2e2e; }
        .settings-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; text-align: left; }
        .settings-item:hover { background: #262626; }
        .settings-label { font-weight: bold; color: #d9d9d9; }
        .settings-desc { font-size: 0.8em; color: #888; margin-top: 4px; }
        .nh-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .nh-switch input { opacity: 0; width: 0; height: 0; }
        .nh-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .2s; border-radius: 24px; }
        .nh-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: #888; transition: .2s; border-radius: 50%; }
        input:checked + .nh-slider { background-color: #ed2553; }
        input:checked + .nh-slider:before { transform: translateX(20px); background-color: #fff; }
        .settings-actions { margin-top: 30px; display: flex; gap: 6px; border-top: 1px solid #2e2e2e; padding-top: 20px; justify-content: center; flex-wrap: wrap; }
        .btn-setting-action { padding: 0px 12px; border: none; border-radius: 3px; line-height: 40px; cursor: pointer; font-weight: bold; color: #fff; background: #4d4d4d; display: flex; align-items: center; gap: 8px; }
        .btn-setting-action:hover { background: #595959; }
        #btn-save-reload { background: #ed2553; }
        #btn-save-reload:hover { background: #f15478; }
        @media (max-width: 600px) {
        .settings-desc { max-width: 60vw; }
        .settings-container { max-width: 800px; margin: 0 auto; padding: 20px 0; border: none; }
        .settings-item { padding: 15px 5px; }
        }

    `;

    (typeof GM_addStyle !== "undefined") ? GM_addStyle(css) : document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

    // ==========================================================================
    // 2. QUEUE LOGIC
    // ==========================================================================

    let saveQueueTimeout;
    let currentSortMode = localStorage.getItem('nhentai_queue_sort') || 'newest';

    function saveQueue() {
        updateQueueWidget();
        updateAllQueueButtons();

        clearTimeout(saveQueueTimeout);
        saveQueueTimeout = setTimeout(() => {
            localStorage.setItem('nhentai_queue_v1', JSON.stringify(readingQueue));
        }, 1000);
    }

    function toggleQueueItem(id, title, coverUrl, galleryUrl) {
        const index = readingQueue.findIndex(i => i.id == id);

        if (index > -1) {
            readingQueue.splice(index, 1);
        } else {
            const newItem = { id, title, coverUrl, galleryUrl, addedAt: Date.now() };

            readingQueue.push(newItem);

            if (currentSortMode === 'newest') {
                readingQueue.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
            } else if (currentSortMode === 'oldest') {
                readingQueue.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
            }
        }

        saveQueue();
    }

    function isQueued(id) {
        return readingQueue.some(i => i.id == id);
    }

    function clearQueue() {
        if(confirm('Clear reading queue?')) {
            readingQueue = [];
            saveQueue();
            if (window.location.search.includes('view=queue')) renderQueuePage();
        }
    }

    function updateAllQueueButtons() {
        if (!settings.enableQueue) return;

        document.querySelectorAll('.gallery[data-gid]').forEach(gallery => {
            const id = gallery.dataset.gid;
            const btn = gallery.querySelector('.queue-trigger');
            if (btn) {
                if (isQueued(id)) {
                    btn.classList.add('in-queue');
                    btn.innerHTML = '<i class="fa fa-check"></i>';
                } else {
                    btn.classList.remove('in-queue');
                    btn.innerHTML = '<i class="fa fa-plus"></i>';
                }
            }
        });

        const pageBtn = document.querySelector('.btn-queue-add');
        if (pageBtn) {
            const id = window.location.href.match(/\/g\/(\d+)/)?.[1];
            if (id && isQueued(id)) {
                pageBtn.innerHTML = '<i class="fa fa-check"></i> Saved';
                pageBtn.classList.add('in-queue');
            } else {
                pageBtn.innerHTML = '<i class="fa fa-plus"></i> Queue';
                pageBtn.classList.remove('in-queue');
            }
        }
    }

    function updateQueueWidget() {
        if (!settings.enableQueue) return;

        const list = document.querySelector('.queue-list');
        const count = document.querySelector('.queue-count');
        if (!list || !count) return;

        count.textContent = readingQueue.length;
        count.style.display = readingQueue.length > 0 ? 'flex' : 'none';

        if (readingQueue.length === 0) {
            list.innerHTML = '<li class="queue-empty">Queue is empty.</li>';
        } else {
            list.innerHTML = readingQueue.map(item => `
                <li class="queue-item" data-id="${item.id}"> <a href="${item.galleryUrl}">
                        <img src="${item.coverUrl}" loading="lazy">
                    </a>
                    <div class="queue-info">
                        <a href="${item.galleryUrl}" class="queue-title" title="${item.title}">${item.title}</a>
                        <div class="queue-id">#${item.id}</div>
                    </div>
                    <div class="queue-remove" data-id="${item.id}" title="Remove"><i class="fa fa-times"></i></div>
                </li>
            `).join('');

            list.querySelectorAll('.queue-remove').forEach(btn => {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const item = readingQueue.find(i => i.id == btn.dataset.id);
                    if(item) toggleQueueItem(item.id, item.title, item.coverUrl, item.galleryUrl);
                };
            });
        }
    }

    function initQueueWidget() {
        if (!settings.enableQueue) return;
        if (isReader) return;
        if (document.querySelector('.queue-dock')) return;

        const dock = document.createElement('div');
        dock.className = 'queue-dock';

        dock.innerHTML = `
            <div class="queue-panel">
                <div class="queue-header">
                    <span><i class="fa fa-book"></i> Reading Queue</span>
                    <div>
                        <a href="/?view=queue" class="queue-view-full">View Page</a>
                        <span class="queue-clear">Clear All</span>
                    </div>
                </div>
                <ul class="queue-list"></ul>
            </div>
            <div class="queue-toggle-btn" title="Toggle Queue">
                <i class="fa fa-list-ul"></i>
                <div class="queue-count">0</div>
            </div>
        `;

        document.body.appendChild(dock);

        const toggle = dock.querySelector('.queue-toggle-btn');
        const panel = dock.querySelector('.queue-panel');
        const clearBtn = dock.querySelector('.queue-clear');
        const list = dock.querySelector('.queue-list');

        toggle.onclick = (e) => {
            const isVisible = panel.classList.toggle('is-visible');

            toggle.classList.toggle('active', isVisible);

            if (isVisible) {
                const currentId = window.location.pathname.match(/\/g\/(\d+)/)?.[1];

                if (currentId) {
                    const activeItem = list.querySelector(`.queue-item[data-id="${currentId}"]`);

                    if (activeItem) {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                activeItem.scrollIntoView({ behavior: 'auto', block: 'center' });

                                const originalBg = activeItem.style.background;
                                activeItem.style.background = '#262626';
                                activeItem.style.transition = 'background 0.5s';
                                setTimeout(() => { activeItem.style.background = originalBg; }, 1000);
                            });
                        });
                    }
                }
            }
        };

        clearBtn.onclick = clearQueue;
        updateQueueWidget();
    }

    function createPagination(totalItems, currentPage, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) return '';

        let html = '<section class="pagination">';

        if (currentPage > 1) {
            html += `<a href="/?view=queue&page=1" class="first"><i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i></a>`;
            html += `<a href="/?view=queue&page=${currentPage - 1}" class="previous"><i class="fa fa-chevron-left"></i></a>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || (i >= currentPage - 5 && i <= currentPage + 5)) {
                const isCurrent = i === currentPage ? 'current' : '';
                html += `<a href="/?view=queue&page=${i}" class="page ${isCurrent}">${i}</a>`;
            }
        }

        if (currentPage < totalPages) {
            html += `<a href="/?view=queue&page=${currentPage + 1}" class="next"><i class="fa fa-chevron-right"></i></a>`;
            html += `<a href="/?view=queue&page=${totalPages}" class="last"><i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i></a>`;
        }

        html += '</section>';
        return html;
    }

    function applyQueueSort(mode) {
        currentSortMode = mode;
        localStorage.setItem('nhentai_queue_sort', mode);

        if (mode === 'shuffle') {
            for (let i = readingQueue.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [readingQueue[i], readingQueue[j]] = [readingQueue[j], readingQueue[i]];
            }
        } else if (mode === 'newest') {
            readingQueue.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        } else if (mode === 'oldest') {
            readingQueue.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
        }

        saveQueue();

        const url = new URL(window.location);
        url.searchParams.set('page', '1');
        window.history.pushState({}, '', url);
        renderQueuePage();
    }

    function renderQueuePage() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') !== 'queue') return;

        document.title = "Reading Queue";
        const content = document.getElementById('content');
        if (!content) return;
        content.innerHTML = '';

        const ITEMS_PER_PAGE = 25;
        const currentPage = parseInt(params.get('page')) || 1;
        const totalItems = readingQueue.length;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentItems = readingQueue.slice(startIndex, endIndex);

        let queueSizeKB = "0.00";
        try {
            const jsonString = JSON.stringify(readingQueue);
            const bytes = new TextEncoder().encode(jsonString).length;
            queueSizeKB = (bytes / 1024).toFixed(2);
        } catch (e) { console.error("Error calc size", e); }

        const header = document.createElement('div');

        header.innerHTML = `
            <h1>
                <span>
                <i class="fa fa-book" style="margin: 2px;"></i> Reading Queue
                </span>
                <span class="count">(${totalItems})</span>
            </h1>
            <div style="margin-bottom: 20px; color: #888; font-size: 13px;">
                 <span style="margin-right: 15px;">
                    <i class="fa fa-database" style="margin: 2px;"></i> Storage Used: <b>${queueSizeKB} KB</b>
                 </span>
                 <span>
                    <i class="fa fa-check-circle"></i> Data is stored locally
                 </span>
            </div>
        `;
        content.appendChild(header);

        if (totalItems >= 0) {
            const toolbar = document.createElement('div');
            toolbar.className = 'queue-toolbar';
            toolbar.style.padding = '0 15px';

            const buttons = [
                { id: 'newest', icon: 'fa-sort-amount-down', label: 'Newest First' },
                { id: 'oldest', icon: 'fa-sort-amount-up', label: 'Oldest First' },
                { id: 'shuffle', icon: 'fa-random', label: 'Shuffle' }
            ];

            if (totalItems > 1) {
                buttons.forEach(btn => {
                    const buttonEl = document.createElement('button');
                    const isActive = currentSortMode === btn.id ? 'active' : '';
                    buttonEl.className = `btn-q-tool ${isActive}`;
                    buttonEl.innerHTML = `<i class="fa ${btn.icon}"></i> ${btn.label}`;
                    buttonEl.onclick = () => applyQueueSort(btn.id);
                    toolbar.appendChild(buttonEl);
                });
            }

            const discoverBtn = document.createElement('button');
            discoverBtn.className = 'btn-q-tool';
            discoverBtn.style.background = 'linear-gradient(45deg, #ed2553, #900c2a)';
            discoverBtn.innerHTML = '<i class="fa fa-magic"></i> Discover & Fill';
            discoverBtn.title = "Find new galleries based on your favorites.";

            discoverBtn.onclick = async (e) => {
                const originalText = '<i class="fa fa-magic"></i> Discover & Fill';

                const allButtons = toolbar.querySelectorAll('button');

                allButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.opacity = '0.6';
                    btn.style.cursor = 'not-allowed';
                });

                discoverBtn.style.opacity = '1';

                try {
                    await runDiscoverFlow((status) => {
                        discoverBtn.innerHTML = `<i class="fa fa-circle-notch fa-spin"></i> ${status}`;
                    });

                    discoverBtn.innerHTML = '<i class="fa fa-check"></i> Done!';
                    discoverBtn.style.background = '#3c763d';

                    setTimeout(() => {
                        renderQueuePage()
                    }, 1000);

                } catch (err) {
                    console.error(err);
                    discoverBtn.innerHTML = '<i class="fa fa-times"></i> Login required';
                    discoverBtn.style.background = '#643d3d';

                    setTimeout(() => {
                        discoverBtn.innerHTML = originalText;
                        discoverBtn.style.background = 'linear-gradient(45deg, #ed2553, #900c2a)';

                        allButtons.forEach(btn => {
                            btn.disabled = false;
                            btn.style.opacity = '1';
                            btn.style.cursor = 'pointer';
                        });
                    }, 3000);
                }
            };

            toolbar.appendChild(discoverBtn);
            content.appendChild(toolbar);
        }

        const grid = document.createElement('div');
        grid.className = 'container index-container';

        if (totalItems === 0) {
            grid.innerHTML = '<div style="padding: 50px; text-align: center; font-size: 18px; color: #666;">Your queue is empty.</div>';
        } else {
            currentItems.forEach(item => {
                const galleryDiv = document.createElement('div');
                galleryDiv.className = 'gallery';
                galleryDiv.setAttribute('data-gid', item.id);

                const defaultPadding = '145%';

                galleryDiv.innerHTML = `
                    <a href="${item.galleryUrl}" class="cover" style="padding:0 0 ${defaultPadding} 0; position: relative; display: block;">
                        <img class="lazyload"
                             alt="${item.title}"
                             src="${item.coverUrl}"
                             style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" />
                        <div class="caption">${item.title}</div>
                    </a>
                `;

                const img = galleryDiv.querySelector('img');
                const setRatio = function() {
                    if (this.naturalWidth && this.naturalHeight) {
                        const aspectRatio = (this.naturalHeight / this.naturalWidth) * 100;
                        const coverLink = galleryDiv.querySelector('.cover');
                        coverLink.style.padding = `0 0 ${aspectRatio}% 0`;
                    }
                };

                img.onload = setRatio;
                if (img.complete) setRatio.call(img);

                grid.appendChild(galleryDiv);
            });
        }

        content.appendChild(grid);

        if (totalItems > ITEMS_PER_PAGE) {
            const paginationHTML = createPagination(totalItems, currentPage, ITEMS_PER_PAGE);
            const pagContainer = document.createElement('div');
            pagContainer.innerHTML = paginationHTML;
            content.appendChild(pagContainer);
        }

        if (typeof initPreviewUI === 'function') {
            grid.querySelectorAll('.gallery').forEach(initPreviewUI);
        }
    }

    async function checkIfFavorited(url) {
        try {
            const res = await fetch(url);
            const html = await res.text();
            return html.includes('>Unfavorite<');
        } catch (e) {
            console.warn("Check fav failed", e);
            return false;
        }
    }

    function areTitlesSimilar(title1, title2) {
        const tokenize = (str) => {
            return new Set(
                str.toLowerCase()
                   .replace(/[\(\[\{].*?[\)\]\}]/g, '')
                   .replace(/[^\w\s]|_/g, "")
                   .split(/\s+/)
                   .filter(w => w.length > 2)
            );
        };

        const t1 = tokenize(title1);
        const t2 = tokenize(title2);

        if (t1.size < 2 || t2.size < 2) return false;

        let matches = 0;
        t1.forEach(word => {
            if (t2.has(word)) matches++;
        });

        const minSize = Math.min(t1.size, t2.size);
        const similarity = matches / minSize;

        return similarity >= 0.75;
    }

    async function runDiscoverFlow(updateStatus) {
        const IGNORE_TAGS = [
            'sole male', 'sole female', 'males only', 'big breasts', 'nakadashi', 'ahegao',
            'full color', 'full censorship', 'uncensored', 'mosaic censorship',
        ];

        updateStatus("Checking…");
        const p1Response = await fetch('/favorites/');
        const p1Html = await p1Response.text();

        if (p1Html.includes('login_form')) throw new Error("Not logged in");

        const parser = new DOMParser();
        const doc1 = parser.parseFromString(p1Html, 'text/html');

        let totalPages = 1;
        const lastPageBtn = doc1.querySelector('.pagination .last');

        if (lastPageBtn) {
            const match = lastPageBtn.href.match(/page=(\d+)/);
            if (match) totalPages = parseInt(match[1], 10);
        } else {
            const pages = doc1.querySelectorAll('.pagination .page');
            if (pages.length > 0) {
                const lastNum = pages[pages.length - 1].textContent;
                if (!isNaN(lastNum)) totalPages = parseInt(lastNum, 10);
            }
        }

        let targetHtml = p1Html;
        if (totalPages > 1) {
            const randomPage = Math.floor(Math.random() * totalPages) + 1;
            if (randomPage > 1) {
                updateStatus(`Fetching…`);
                const randomResp = await fetch(`/favorites/?page=${randomPage}`);
                targetHtml = await randomResp.text();
            }
        }

        const targetDoc = parser.parseFromString(targetHtml, 'text/html');
        const favGalleries = Array.from(targetDoc.querySelectorAll('.gallery a.cover'))
            .map(a => a.href.match(/\/g\/(\d+)/)?.[1])
            .filter(Boolean);

        if (favGalleries.length === 0) throw new Error("No favorites found on this page");

        updateStatus("Analyzing…");
        const sampleSize = Math.min(5, favGalleries.length);
        const shuffledFavs = favGalleries.sort(() => 0.5 - Math.random()).slice(0, sampleSize);

        const tagCounts = {};

        await Promise.all(shuffledFavs.map(async (id) => {
            const meta = await getMeta(id);
            if (meta && meta.tags) {
                meta.tags.forEach(t => {
                    if (t.type === 'tag' && !IGNORE_TAGS.includes(t.name)) {
                        tagCounts[t.name] = (tagCounts[t.name] || 0) + 1;
                    }
                });
            }
        }));

        const sortedTags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([tag]) => tag);

        if (sortedTags.length === 0) throw new Error("Not enough data");

        const topTags = sortedTags.slice(0, 2);
        const spiceTag = sortedTags.slice(2, 10)[Math.floor(Math.random() * Math.min(8, sortedTags.length - 2))];
        if (spiceTag) topTags.push(spiceTag);

        const queryStr = topTags.map(t => `tag:"${t}"`).join(' ');
        const encodedQuery = encodeURIComponent(queryStr);

        updateStatus(`Searching…`);

        const [resWeek, resAll] = await Promise.all([
            fetch(`/search/?q=${encodedQuery}+uploaded%3A%3E6d&sort=popular-week`),
            fetch(`/search/?q=${encodedQuery}&sort=popular`)
        ]);

        const htmlWeek = await resWeek.text();
        const htmlAll = await resAll.text();

        const parseGalleries = (html) => {
            const doc = parser.parseFromString(html, 'text/html');
            return Array.from(doc.querySelectorAll('.gallery')).map(gal => {
                const link = gal.querySelector('a.cover');
                const id = gal.dataset.id || (link.href.match(/\/g\/(\d+)/) || [])[1];
                const title = gal.querySelector('.caption').textContent;
                const img = gal.querySelector('img');
                const coverUrl = img.dataset.src || img.src;
                return { id, title, coverUrl, galleryUrl: link.href };
            });
        };

        const candidatesWeek = parseGalleries(htmlWeek);
        const candidatesAll = parseGalleries(htmlAll);

        const newItems = [];
        const processedIds = new Set();
        readingQueue.forEach(q => processedIds.add(String(q.id)));

        const tryAddCandidate = async (candidate) => {
            if (!candidate) return false;

            if (processedIds.has(String(candidate.id))) return false;

            const allTitles = [...readingQueue, ...newItems];

            const isTitleDup = allTitles.some(item => areTitlesSimilar(item.title, candidate.title));

            if (isTitleDup) {
                console.log(`Skipping ${candidate.id} (Similar Title: "${candidate.title}")`);
                return false;
            }

            processedIds.add(String(candidate.id));

            const isFav = await checkIfFavorited(candidate.galleryUrl);
            if (isFav) {
                console.log(`Skipping ${candidate.id} (Remote Favorite)`);
                return false;
            }

            newItems.push(candidate);
            return true;
        };

        let weekAdded = 0;
        let allTimeAdded = 0;
        let attempts = 0;

        while (newItems.length < 5 && attempts < 30) {
            attempts++;
            updateStatus(`Filtering (${newItems.length}/5)…`);

            let success = false;

            if (weekAdded < 3 && candidatesWeek.length > 0) {
                const cand = candidatesWeek.shift();
                success = await tryAddCandidate(cand);
                if (success) weekAdded++;
            } else if (candidatesAll.length > 0) {
                const cand = candidatesAll.shift();
                success = await tryAddCandidate(cand);
                if (success) allTimeAdded++;
            } else if (candidatesWeek.length > 0) {
                const cand = candidatesWeek.shift();
                success = await tryAddCandidate(cand);
                if (success) weekAdded++;
            } else {
                break;
            }
        }

        if (newItems.length === 0) throw new Error("No new galleries found");

        updateStatus(`Adding…`);
        newItems.forEach(item => {
            toggleQueueItem(item.id, item.title, item.coverUrl, item.galleryUrl);
        });

        await new Promise(r => setTimeout(r, 1000));
    }

    // ==========================================================================
    // 3. PREVIEW LOGIC
    // ==========================================================================

    function getMeta(id) {
        if (cache.has(id)) return Promise.resolve(cache.get(id));

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `/api/gallery/${id}`,
                timeout: 10000,
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            const data = JSON.parse(res.responseText);
                            const meta = {
                                id: data.media_id,
                                pages: data.images.pages,
                                total: data.num_pages,
                                tags: data.tags,
                                title: data.title.english || data.title.japanese || data.title.pretty,
                                cover_type: data.images.cover.t
                            };

                            if (cache.size >= CACHE_LIMIT) {
                                const oldestKey = cache.keys().next().value;
                                cache.delete(oldestKey);
                            }

                            cache.set(id, meta);
                            resolve(meta);
                        } catch(e) {
                            console.error("NH Flow: Error in suing JSON", e);
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null)
            });
        });
    }

    function buildTagList(tags) {
        const groups = { artist: [], parody: [], character: [], tag: [] };
        const fmt = (n) => n >= 1000 ? (n/1000).toFixed(1) + 'k' : n;
        const getTier = (c) => {
            if (c < 1000) return 'tier-mythic';
            if (c < 5000) return 'tier-rare';
            if (c < 20000) return 'tier-uncommon';
            return '';
        };
        const getGenreStyle = (name) => {
            if (['yaoi', 'males only', 'bara', 'yuri', 'females only', 'lesbian', 'futanari', 'tomgirl', 'otokonoko', 'dickgirl', 'shemale', 'bisexual'].includes(name)) return 'style-lgbt';
            return '';
        };

        tags.forEach(t => {
            const count = t.count || 0;
            let className = '';
            if (t.type === 'tag') {
                className = `${getTier(count)} ${getGenreStyle(t.name)}`;
            }
            const html = `<span class="tag-pill ${className}" title="${t.name} (${fmt(count)})">${t.name}</span>`;
            if (groups[t.type]) groups[t.type].push(html);
            else if (t.type === 'group') groups.artist.push(`<span class="tag-pill">[${t.name}]</span>`);
        });

        let html = '';
        const addGroup = (title, list) => { if (list.length) html += `<div class="tag-category">${title}</div>` + list.join(''); };
        addGroup('Artists', groups.artist); addGroup('Parodies', groups.parody); addGroup('Characters', groups.character); addGroup('Tags', groups.tag);
        return html || '<div style="padding:5px">No tags</div>';
    }

    function update(gallery, val, isJump = false) {
        const id = gallery.dataset.gid;
        const state = states.get(id) || { curr: 1, req: 0 };
        states.set(id, state);

        getMeta(id).then(meta => {
            if (!meta) return;

            let next = isJump ? val : state.curr + val;
            if (next < 1) next = 1; if (next > meta.total) next = meta.total;

            const popup = gallery.querySelector('.tag-popup');
            if (popup && !popup.innerHTML) popup.innerHTML = buildTagList(meta.tags);

            if (next === state.curr && !isJump && val !== 0) return;
            state.curr = next;
            const reqId = ++state.req;

            if (state.curr !== 1) gallery.classList.add('is-previewing');

            const barFill = gallery.querySelector('.seek-fill');
            if (barFill) barFill.style.width = `${(state.curr / meta.total) * 100}%`;

            const pageData = meta.pages[state.curr - 1];
            const src = `https://i.nhentai.net/galleries/${meta.id}/${state.curr}.${EXT_MAP[pageData.t]}`;
            const img = gallery.querySelector('a.cover img');
            const loader = new Image();
            loader.onload = () => { if (state.req === reqId) { img.style.aspectRatio = `${pageData.w}/${pageData.h}`; img.src = src; } };
            loader.src = src;
        });
    }

    function initPreviewUI(gallery) {
        const link = gallery.querySelector('a.cover');
        if (!link) return;
        const id = link.href.match(/\/g\/(\d+)\//)?.[1];
        if (!id) return;
        gallery.dataset.gid = id; gallery.dataset.init = '1';

        const ui = document.createElement('div');
        ui.className = 'inline-preview-ui';

        ui.innerHTML = `
            <div class="tag-trigger">TAGS</div>
            <div class="tag-popup"></div>
            <div class="queue-trigger" title="Add/Remove from Queue (Q)"><i class="fa fa-plus"></i></div>
            <div class="hotzone hotzone-left"></div>
            <div class="hotzone hotzone-right"></div>
            <div class="seek-container"><div class="seek-bg"><div class="seek-fill"></div></div><div class="seek-tooltip">Pg 1</div></div>
        `;

        // --- 1. CORREÇÃO MOBILE: BOTÃO DE TAGS ---
        const tagBtn = ui.querySelector('.tag-trigger');
        if (tagBtn) {
            // Impede que o toque no botão abra a galeria
            const stopEvent = (e) => {
                e.preventDefault();
                e.stopPropagation();
            };
            // Usamos ambos para garantir compatibilidade total no mobile
            tagBtn.addEventListener('click', stopEvent);
            tagBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        }

        // --- 2. CORREÇÃO MOBILE: POPUP DE TAGS ---
        const tagPopup = ui.querySelector('.tag-popup');
        if (tagPopup) {
            // Impede que clicar/rolar dentro do popup abra a galeria
            const stopPopupClick = (e) => {
                e.stopPropagation(); // Permite clicar em tags dentro, mas não sobe pro link
                e.preventDefault();// Não usamos preventDefault aqui para permitir seleção de texto ou scroll
            };
            tagPopup.addEventListener('click', stopPopupClick);
            tagPopup.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
        }

        const qBtn = ui.querySelector('.queue-trigger');
        if (isQueued(id)) {
            qBtn.classList.add('in-queue');
            qBtn.innerHTML = '<i class="fa fa-check"></i>';
        }

        qBtn.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            if (cache.has(id)) {
                const meta = cache.get(id);
                const coverUrl = gallery.querySelector('a.cover img').dataset.src || gallery.querySelector('a.cover img').src;
                toggleQueueItem(id, meta.title, coverUrl, link.href);
            } else {
                qBtn.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
                getMeta(id).then(meta => {
                    if (!meta) {
                        qBtn.innerHTML = '<i class="fa fa-exclamation"></i>';
                        return;
                    }
                    const coverUrl = gallery.querySelector('a.cover img').dataset.src || gallery.querySelector('a.cover img').src;
                    toggleQueueItem(id, meta.title, coverUrl, link.href);
                });
            }
        };

        ui.querySelector('.hotzone-left').onclick = (e) => { e.preventDefault(); e.stopPropagation(); update(gallery, -1); };
        ui.querySelector('.hotzone-right').onclick = (e) => { e.preventDefault(); e.stopPropagation(); update(gallery, 1); };

        const seek = ui.querySelector('.seek-container');
        const tip = ui.querySelector('.seek-tooltip');
        seek.onmousemove = (e) => {
            if (!cache.has(id)) return;
            const meta = cache.get(id); const rect = seek.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            tip.style.left = `${e.clientX - rect.left}px`; tip.textContent = Math.ceil(pct * meta.total) || 1;
        };

        seek.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            if (!cache.has(id)) {
                update(gallery, 0).then(() => {
                    const rect = seek.getBoundingClientRect();
                    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const meta = cache.get(id);
                    update(gallery, Math.ceil(pct * meta.total) || 1, true);
                });
                return;
            }
            const rect = seek.getBoundingClientRect();
            update(gallery, Math.ceil(((e.clientX - rect.left) / rect.width) * cache.get(id).total) || 1, true);
        };

        gallery.onmouseenter = () => {
            hoveredGallery = gallery;
            if (!cache.has(id)) {
                hoverTimeout = setTimeout(() => { update(gallery, 0); }, 300);
            } else { update(gallery, 0); }
        };

        gallery.onmouseleave = () => {
            hoveredGallery = null;
            if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
        };

        link.style.position = 'relative'; link.appendChild(ui);
    }

    // ==========================================================================
    // 4. READER LOGIC
    // ==========================================================================

    function initReaderMode() {
        const imageContainer = document.querySelector('#image-container');
        if (!imageContainer || imageContainer.dataset.readerInit) return;
        imageContainer.dataset.readerInit = '1';

        const exitIcon = document.createElement('div');
        exitIcon.className = 'exit-fs-indicator';
        exitIcon.innerHTML = '<i class="fa fa-times"></i>';
        exitIcon.onclick = (e) => {
            e.stopPropagation();
            if (document.fullscreenElement) document.exitFullscreen();
        };
        imageContainer.appendChild(exitIcon);

        imageContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' || e.target.tagName === 'A') return;
            const rect = imageContainer.getBoundingClientRect();
            if (e.clientX - rect.left > rect.width / 2) {
                const nextBtn = document.querySelector('.reader-pagination .next');
                if (nextBtn) nextBtn.click();
            } else {
                const prevBtn = document.querySelector('.reader-pagination .previous');
                if (prevBtn) prevBtn.click();
            }
        });

        const toolbars = document.querySelectorAll('.reader-bar');
        if (toolbars.length === 0) return;

        const bottomToolbar = toolbars[toolbars.length - 1];
        const containerRight = bottomToolbar.querySelector('.reader-buttons-right');

        if (!containerRight) return;

        // 1. Fullscreen
        if (!document.querySelector('.btn-fullscreen-custom')) {
            const fsBtn = document.createElement('button');
            fsBtn.className = 'btn btn-unstyled btn-fullscreen-custom';
            fsBtn.innerHTML = '<i class="fa fa-expand"></i> Fullscreen';
            fsBtn.title = "Toggle Fullscreen (T)";
            fsBtn.style.marginRight = '10px';

            const toggleFS = () => {
                if (!document.fullscreenElement) {
                    imageContainer.requestFullscreen().catch(err => console.log(err));
                } else {
                    document.exitFullscreen();
                }
            };
            fsBtn.onclick = toggleFS;

            containerRight.insertBefore(fsBtn, containerRight.firstChild);

            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleFS(); }
            });

            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    fsBtn.innerHTML = '<i class="fa fa-expand"></i> Fullscreen';
                    setTimeout(() => {
                        imageContainer.scrollIntoView({ behavior: 'auto', block: 'start' });
                    }, 50);
                } else {
                     fsBtn.innerHTML = '<i class="fa fa-compress"></i> Exit';
                }
            });
        }

        // 2. Next Queue
        if (settings.enableQueue) {
            const fsBtn = document.querySelector('.btn-fullscreen-custom');
            const currentId = window.location.pathname.match(/\/g\/(\d+)/)?.[1];

            if (currentId && readingQueue.length > 0) {
                const currentIndex = readingQueue.findIndex(i => i.id == currentId);
                if (currentIndex > -1 && currentIndex < readingQueue.length - 1) {
                    const nextItem = readingQueue[currentIndex + 1];

                    const nextQBtn = document.createElement('a');
                    nextQBtn.className = 'btn btn-unstyled btn-next-queue';
                    nextQBtn.innerHTML = `Next in queue <i class="fa fa-step-forward"></i>`;
                    nextQBtn.href = `/g/${nextItem.id}/1/`;
                    nextQBtn.title = `Read Next in Queue: ${nextItem.title}`;

                    if (fsBtn) {
                        fsBtn.parentNode.insertBefore(nextQBtn, fsBtn.nextSibling);
                    } else {
                        containerRight.appendChild(nextQBtn);
                    }
                }
            }
        }

        // 3. Random Favorite
        const hasFavorites = !!document.querySelector('nav a[href*="/favorites/"]');

        if (hasFavorites) {
            const randFavBtn = document.createElement('a');
            randFavBtn.className = 'btn btn-unstyled btn-random-fav';

            randFavBtn.innerHTML = '<i class="fa fa-circle-notch fa-spin"></i>';
            randFavBtn.style.marginRight = '10px';
            randFavBtn.style.cursor = 'wait';
            randFavBtn.style.opacity = '0.7';

            containerRight.insertBefore(randFavBtn, containerRight.firstChild);

            fetch('/favorites/random')
                .then(response => {
                    const finalUrl = response.url;

                    if (finalUrl && finalUrl.includes('/g/')) {
                        let cleanUrl = finalUrl.split('?')[0];
                        if (!cleanUrl.endsWith('/')) cleanUrl += '/';

                        randFavBtn.href = `${cleanUrl}1/`;
                        randFavBtn.innerHTML = '<i class="fa fa-random"></i> Fav';
                        randFavBtn.title = "Read Random Favorite";
                        randFavBtn.style.cursor = 'pointer';
                        randFavBtn.style.opacity = '1';
                    } else {
                        randFavBtn.remove();
                    }
                })
                .catch(err => {
                    console.error(err);
                    randFavBtn.remove();
                });
        }
    }

    // ==========================================================================
    // 5. RANDOM CONTEXTUAL
    // ==========================================================================

    function initRandomContextual() {
        const sortContainer = document.querySelector('.sort');
        if (!sortContainer || sortContainer.querySelector('.btn-random-ctx')) return;

        const btnContainer = document.createElement('div');
        btnContainer.className = 'sort-type';

        const btn = document.createElement('a');
        btn.className = 'btn-random-ctx';
        const ORIGINAL_HTML = '<i class="fa fa-random"></i>';
        btn.innerHTML = ORIGINAL_HTML;
        btn.style.cursor = 'pointer';
        btn.style.padding = '10px 12px';
        btn.title = "Roll a random gallery from these search results";

        const resetBtn = () => {
            btn.innerHTML = ORIGINAL_HTML;
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        };

        window.addEventListener('pageshow', (event) => {
            if (event.persisted) { resetBtn(); }
        });
        resetBtn();

        btn.onclick = async (e) => {
            e.preventDefault();
            btn.innerHTML = '<i class="fa fa-circle-notch fa-spin"></i>';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.7';

            try {
                const lastPageBtn = document.querySelector('.pagination .last');
                let totalPages = 1;
                if (lastPageBtn) {
                    const match = lastPageBtn.href.match(/page=(\d+)/);
                    if (match) totalPages = parseInt(match[1], 10);
                } else {
                    const pages = document.querySelectorAll('.pagination .page');
                    if (pages.length > 0) {
                        const lastNum = pages[pages.length - 1].textContent;
                        if (!isNaN(lastNum)) totalPages = parseInt(lastNum, 10);
                    }
                }
                if (totalPages === 1) {
                    const galleries = document.querySelectorAll('.gallery a.cover');
                    if (galleries.length === 0) throw new Error("No galleries found");
                    const randomGallery = galleries[Math.floor(Math.random() * galleries.length)];
                    window.location.href = randomGallery.href;
                    return;
                }

                const randomPage = Math.floor(Math.random() * totalPages) + 1;
                const targetUrl = new URL(window.location.href);
                targetUrl.searchParams.set('page', randomPage);

                const response = await fetch(targetUrl.href);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const galleries = doc.querySelectorAll('.gallery a.cover');
                if (galleries.length === 0) throw new Error("No galleries found");
                const randomGallery = galleries[Math.floor(Math.random() * galleries.length)];
                window.location.href = randomGallery.href;

            } catch (err) {
                btn.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
                setTimeout(() => { resetBtn(); }, 2000);
            }
        };

        btnContainer.appendChild(btn);
        sortContainer.appendChild(btnContainer);
    }

    // ==========================================================================
    // 6. POPULAR SHORTCUT BUTTON
    // ==========================================================================

    function initPopularShortcut() {
        const popularContainer = document.querySelector('.index-popular');
        if (!popularContainer || popularContainer.querySelector('.btn-view-all-popular')) return;

        const link = document.createElement('a');
        link.href = '/search/?q=pages%3A%3E0&sort=popular-today';
        link.className = 'btn btn-secondary btn-view-all-popular';
        link.style.display = 'block';
        link.style.marginTop = '15px';
        link.innerHTML = '<i class="fa fa-compass"></i> Explore Today’s Trending';
        popularContainer.appendChild(link);
    }

    // ==========================================================================
    // 7. SMART NAVIGATION
    // ==========================================================================

    function initSmartNavigation() {
        if (!settings.smartNav) return;
        if (isReader) return;

        if (document.body.dataset.smartNavInit) return;
        document.body.dataset.smartNavInit = '1';

        const navBar = document.createElement('div');
        navBar.className = 'smart-nav-bar';
        document.body.appendChild(navBar);

        let accumulatedDelta = 0;
        let pendingDelta = 0;
        let isNavigating = false;
        let isTicking = false;

        const updateVisuals = () => {
            if (isNavigating) return;

            const delta = pendingDelta;
            pendingDelta = 0;

            const nextLink = document.querySelector('.pagination .next');
            if (!nextLink) {
                isTicking = false;
                return;
            }

            const scrollBottom = window.scrollY + window.innerHeight;
            const docHeight = document.body.scrollHeight;
            const isAtBottom = (docHeight - scrollBottom) < 50;

            if (isAtBottom && delta > 0) {
                accumulatedDelta += delta;

                const percent = Math.min(100, (accumulatedDelta / SMART_NAV_THRESHOLD) * 100);
                navBar.style.width = `${percent}%`;

                if (accumulatedDelta > SMART_NAV_THRESHOLD) {
                    isNavigating = true;
                    navBar.style.background = "#fff";
                    navBar.style.boxShadow = "0 0 15px #fff";

                    if (navigator.vibrate) navigator.vibrate(100);

                    window.location.href = nextLink.href;
                    return;
                }
            } else {
                if (accumulatedDelta > 0) {
                    const reduce = delta < 0 ? Math.abs(delta * 3) : 50;
                    accumulatedDelta = Math.max(0, accumulatedDelta - reduce);
                    navBar.style.width = `${(accumulatedDelta / SMART_NAV_THRESHOLD) * 100}%`;
                }
            }

            isTicking = false;
        };

        const requestUpdate = (amount) => {
            pendingDelta += amount;

            if (!isTicking) {
                isTicking = true;
                window.requestAnimationFrame(updateVisuals);
            }
        };

        // --- 1. Desktop (Wheel) ---
        window.addEventListener('wheel', (e) => {
            if (isNavigating) return;
            requestUpdate(e.deltaY);
        }, { passive: true });

        // --- 2. Mobile (Touch) ---
        let touchStartY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (isNavigating) return;

            const touchCurrentY = e.touches[0].clientY;
            const diff = touchStartY - touchCurrentY;
            touchStartY = touchCurrentY;

            const multiplier = settings.smartNavSensitivity || 1.5;
            requestUpdate(diff * multiplier);

        }, { passive: true });

        window.addEventListener('touchend', () => {
             if (!isNavigating && accumulatedDelta > 0 && accumulatedDelta < SMART_NAV_THRESHOLD) {
                 const drainInterval = setInterval(() => {
                     if (isNavigating || accumulatedDelta <= 0) {
                         clearInterval(drainInterval);
                         if (!isNavigating) {
                             accumulatedDelta = 0;
                             navBar.style.width = '0%';
                         }
                     } else {
                         accumulatedDelta -= 60;
                         navBar.style.width = `${(accumulatedDelta / SMART_NAV_THRESHOLD) * 100}%`;
                     }
                 }, 16);
             }
        });
    }

    // ==========================================================================
    // 8. GALLERY PAGE FEATURES
    // ==========================================================================

    function initGalleryPageFeatures() {
        const btnContainer = document.querySelector('#info-block .buttons');
        const searchInput = document.querySelector('form.search input[name="q"]');
        if (!btnContainer) return;

        // --- 1. Queue Button ---
        if (settings.enableQueue && !document.querySelector('.btn-queue-add')) {
            const qBtn = document.createElement('button');
            qBtn.className = 'btn btn-secondary btn-queue-add';
            qBtn.innerHTML = '<i class="fa fa-plus"></i> Queue';

            const galleryId = window.location.href.match(/\/g\/(\d+)/)?.[1];

            if (galleryId) {
                if (isQueued(galleryId)) {
                    qBtn.innerHTML = '<i class="fa fa-check"></i> Saved';
                    qBtn.classList.add('in-queue');
                }

                qBtn.onclick = () => {
                    const title = document.querySelector('h1.title').textContent;
                    const coverImg = document.querySelector('#cover img');
                    const coverUrl = coverImg ? (coverImg.dataset.src || coverImg.src) : '';
                    toggleQueueItem(galleryId, title, coverUrl, window.location.href);
                };
                btnContainer.appendChild(qBtn);
            }
        }

        // --- 2. Tag Selector ---
        if (!searchInput || document.querySelector('.btn-tag-selector') || !settings.enableTagSelect) return;

        let isSelectionMode = false;
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn btn-secondary btn-tag-selector';
        toggleBtn.innerHTML = '<i class="fa fa-tags"></i> Tag Select';
        toggleBtn.type = 'button';
        btnContainer.appendChild(toggleBtn);

        const tagsContainer = document.querySelector('#tags');
        tagsContainer.addEventListener('click', (e) => {
            if (!isSelectionMode) return;
            const tagLink = e.target.closest('a.tag');
            if (tagLink) {
                e.preventDefault(); e.stopPropagation();
                if (!tagLink.href.includes('q=pages')) {
                    tagLink.classList.toggle('tag-selected');
                    updateSearchBar();
                }
            }
        }, true);

        toggleBtn.onclick = () => {
            isSelectionMode = !isSelectionMode;
            if (isSelectionMode) {
                toggleBtn.classList.add('is-active');
                tagsContainer.classList.add('tags-selecting-mode');
                toggleBtn.innerHTML = '<i class="fa fa-check"></i> Done';
            } else {
                toggleBtn.classList.remove('is-active');
                tagsContainer.classList.remove('tags-selecting-mode');
                toggleBtn.innerHTML = '<i class="fa fa-tags"></i> Tag Select';
            }
        };

        function updateSearchBar() {
            const selectedTags = tagsContainer.querySelectorAll('.tag.tag-selected');
            const queryTerms = Array.from(selectedTags).map(tag => {
                const nameSpan = tag.querySelector('.name');
                let tagName = nameSpan ? nameSpan.textContent.trim() : '';
                const href = tag.getAttribute('href');

                if (href.includes('/tag/')) return `tag:"${tagName}"`;
                if (href.includes('/artist/')) return `artist:"${tagName}"`;
                if (href.includes('/group/')) return `group:"${tagName}"`;
                if (href.includes('/parody/')) return `parody:"${tagName}"`;
                if (href.includes('/character/')) return `character:"${tagName}"`;
                if (href.includes('/language/')) return `language:"${tagName}"`;
                if (href.includes('/category/')) return `category:"${tagName}"`;
                return `"${tagName}"`;
            });
            searchInput.value = queryTerms.join(' ');
            searchInput.dispatchEvent(new Event('input'));
        }

    }

    // ==========================================================================
    // 9. SAVED SEARCHES
    // ==========================================================================

    function initSearchFlow() {
        if (!settings.enableSavedSearch) return;
        const form = document.querySelector('form.search');
        const nav = document.querySelector('nav[role="navigation"]');

        if (!form || !nav || form.dataset.savedInit) return;
        form.dataset.savedInit = '1';

        const input = form.querySelector('input[name="q"]');
        if (input) input.style.paddingRight = '40px';

        let searchData = JSON.parse(localStorage.getItem('nhentai_search_flow') || '{"saved":[]}');

        let isDeleteMode = false;
        let pendingDeletes = new Set();

        const saveSearch = () => localStorage.setItem('nhentai_search_flow', JSON.stringify(searchData));

        const toggleSavedItem = (query) => {
            if (!query) return;
            const idx = searchData.saved.indexOf(query);
            if (idx > -1) searchData.saved.splice(idx, 1);
            else searchData.saved.push(query);
            saveSearch();
            renderBar();
        };

        const trigger = document.createElement('div');
        trigger.className = 'search-saved-trigger';
        trigger.innerHTML = '<i class="fa fa-bookmark"></i>';
        trigger.title = "Saved Searches";
        form.appendChild(trigger);

        const barContainer = document.createElement('div');
        barContainer.className = 'saved-search-extension';
        nav.parentNode.insertBefore(barContainer, nav.nextSibling);

        const renderBar = () => {
            const currentQ = input ? input.value.trim() : '';
            const isCurrentSaved = currentQ && searchData.saved.includes(currentQ);

            const listClass = isDeleteMode ? 'sse-list delete-mode' : 'sse-list';

            let actionButtons = '';

            if (isDeleteMode) {
                actionButtons = `
                    <button class="btn-sse-save" id="btn-confirm-del" style="margin-right: 5px;">Confirm</button>
                    <button class="btn-sse-edit" id="btn-cancel-del">Cancel</button>
                `;
            } else {
                if (searchData.saved.length > 0) {
                    actionButtons = `<button class="btn-sse-edit" id="btn-toggle-edit"><i class="fas fa-eraser"></i> Delete</button>`;
                }
            }

            const saveCurrentBtn = (currentQ && !isCurrentSaved && !isDeleteMode) ?
                `<button class="btn-sse-save" id="btn-save-curr-bar"><i class="fa fa-plus"></i> Save</button>` : '';

            let html = `
                <div class="sse-header">
                    ${saveCurrentBtn}
                    <div class="sse-actions">
                        ${actionButtons}
                    </div>
                </div>
                <div class="${listClass}">
            `;

            if (searchData.saved.length === 0) {
                html += `<div class="sse-empty">No saved searches yet. Build a search and click Save to add it here.</div>`;
            } else {
                searchData.saved.forEach(q => {
                    const isCurrent = q === currentQ ? 'is-current' : '';
                    const isMarked = pendingDeletes.has(q);
                    const deleteStyle = isMarked ? 'to-delete' : '';
                    const safeQ = q.replace(/"/g, '&quot;');

                    const displayLabel = q.replace(/\b[a-z-]+:/g, '').trim();
                    const tooltip = isDeleteMode ? 'Select to delete' : safeQ;

                    html += `
                        <div class="ss-pill ${isCurrent} ${deleteStyle}">
                            <div class="ss-part ss-add" data-q="${safeQ}" title="Add to current input"><i class="fa fa-plus" style="font-size: 10px;"></i></div>
                            <div class="ss-part ss-text" data-full-query="${safeQ}" title="${tooltip}">${displayLabel}</div>
                        </div>
                    `;
                });
            }
            html += `</div>`;

            barContainer.innerHTML = html;

            const btnEdit = barContainer.querySelector('#btn-toggle-edit');
            if (btnEdit) {
                btnEdit.onclick = (e) => {
                    e.stopPropagation();
                    isDeleteMode = true;
                    pendingDeletes.clear();
                    renderBar();
                };
            }

            const btnConfirm = barContainer.querySelector('#btn-confirm-del');
            if (btnConfirm) {
                btnConfirm.onclick = (e) => {
                    e.stopPropagation();
                    if (pendingDeletes.size > 0) {
                        searchData.saved = searchData.saved.filter(item => !pendingDeletes.has(item));
                        saveSearch();
                    }
                    isDeleteMode = false;
                    pendingDeletes.clear();
                    renderBar();
                };
            }

            const btnCancel = barContainer.querySelector('#btn-cancel-del');
            if (btnCancel) {
                btnCancel.onclick = (e) => {
                    e.stopPropagation();
                    isDeleteMode = false;
                    pendingDeletes.clear();
                    renderBar();
                };
            }

            const btnSave = barContainer.querySelector('#btn-save-curr-bar');
            if (btnSave) {
                btnSave.onclick = (e) => {
                    e.stopPropagation();
                    toggleSavedItem(currentQ);
                };
            }

            barContainer.querySelectorAll('.ss-text').forEach(el => {
                const fullQuery = el.dataset.fullQuery;

                el.onclick = (e) => {
                    e.stopPropagation();
                    if (isDeleteMode) {
                        if (pendingDeletes.has(fullQuery)) {
                            pendingDeletes.delete(fullQuery);
                        } else {
                            pendingDeletes.add(fullQuery);
                        }
                        renderBar();
                    } else {
                        if(fullQuery) {
                            window.location.href = `/search/?q=${encodeURIComponent(fullQuery)}`;
                        }
                    }
                };
            });

            barContainer.querySelectorAll('.ss-add').forEach(el => {
                el.onclick = (e) => {
                    e.stopPropagation();
                    if (isDeleteMode) return;
                    const queryToAdd = el.dataset.q;
                    const currentVal = input.value.trim();
                    input.value = currentVal ? currentVal + ' ' + queryToAdd : queryToAdd;
                    input.focus();
                    input.dispatchEvent(new Event('input'));
                };
            });
        };

        trigger.onclick = (e) => {
            e.stopPropagation();
            const isVisible = barContainer.classList.contains('is-visible');

            if (!isVisible) {
                isDeleteMode = false;
                pendingDeletes.clear();
                renderBar();
                barContainer.classList.add('is-visible');
                trigger.classList.add('is-active');
            } else {
                barContainer.classList.remove('is-visible');
                trigger.classList.remove('is-active');
            }
        };
        if (input) {
            input.addEventListener('input', () => {
                if (barContainer.classList.contains('is-visible')) {
                    renderBar();
                }
            });
        }
    }

    // ==========================================================================
    // 10. DATA MANAGEMENT (BACKUP/RESTORE)
    // ==========================================================================

    function exportData() {
        const data = {
            settings: JSON.parse(localStorage.getItem('nhentai_flow_settings') || '{}'),
            queue: JSON.parse(localStorage.getItem('nhentai_queue_v1') || '[]'),
            savedSearches: JSON.parse(localStorage.getItem('nhentai_search_flow') || '{"saved":[]}')
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `nh-flow-backup-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);

                    if (data.settings) localStorage.setItem('nhentai_flow_settings', JSON.stringify(data.settings));
                    if (data.queue) localStorage.setItem('nhentai_queue_v1', JSON.stringify(data.queue));
                    if (data.savedSearches) localStorage.setItem('nhentai_search_flow', JSON.stringify(data.savedSearches));

                    alert('Imported data successfully! The page will reload.');
                    window.location.reload();
                } catch (err) {
                    alert('Failed to read file: invalid or corrupted JSON.');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    // ==========================================================================
    // 11. SETTINGS MENU UI
    // ==========================================================================

    function initSettingsMenu() {
        const navContainer = document.querySelector('nav.menu .right') || document.querySelector('ul.menu.right');
        if (!navContainer || document.querySelector('.nav-settings-btn')) return;

        const btnLi = document.createElement('li');
        btnLi.className = 'nav-settings-btn';

        btnLi.innerHTML = `
            <a href="/?view=settings">
                <i class="fa fa-cog"></i>
            </a>
        `;

        navContainer.insertBefore(btnLi, navContainer.firstChild);
    }

    function renderSettingsPage() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') !== 'settings') return;

        document.title = "NHentai Flow Settings";
        const content = document.getElementById('content');
        if (!content) return;
        content.innerHTML = '';

        const options = [
            { key: 'previewNav', label: 'Hover Preview (Thumbnails)', desc: 'Show gallery pages when hovering over covers.' },
            { key: 'highlightVisited', label: 'Highlight Read Galleries', desc: 'Change the color of galleries you’ve already visited.' },
            { key: 'showTagOverlay', label: 'Show Tags on Hover', desc: 'Display a popup with tags when hovering over covers.' },
            { key: 'enableQueue', label: 'Enable Reading Queue', desc: 'Save galleries to read later.' },
            { key: 'enableTagSelect', label: 'Enable Tag Selector', desc: 'Allow multi-tag selection on gallery pages.' },
            { key: 'enableSavedSearch', label: 'Enable Saved Searches', desc: 'Save your favorite search queries for quick access.' },
            { key: 'smartNav', label: 'Smart Navigation', desc: 'Automatically load the next page when scrolling to the bottom.' },
            { key: 'smartNavSensitivity', label: 'Smart Nav Sensitivity', desc: 'Adjust how easily the next page is triggered on touch devices.', type: 'range', min: 1.0, max: 5.0, step: 0.1 },
            { key: 'enableContextMenu', label: 'Custom Context Menu', desc: 'Replace the browser right-click menu with the NH Flow menu.' },
            { key: 'paginationRight', label: 'Right-Side Pagination', desc: 'Move pagination buttons to the right side (desktop only).' }
        ];

        const container = document.createElement('div');
        container.className = 'container';

        let html = `
            <span style="font-size: 12px; float: right; color: #666; font-weight: normal; margin-right: 10px;">v${GM_info.script.version}</span>
            <div class="settings-container">
                <h1>NHentai Flow Settings</h1>
                <div class="settings-group">
        `;

        options.forEach(opt => {
            if (opt.type === 'range') {
                const val = settings[opt.key];
                html += `
                    <div class="settings-item">
                        <div>
                            <div class="settings-label">${opt.label}</div>
                            <div class="settings-desc">${opt.desc}</div>
                        </div>
                        <div>
                            <input type="range" class="nh-range"
                                data-key="${opt.key}"
                                min="${opt.min}" max="${opt.max}" step="${opt.step}" value="${val}"
                                style="width: 100px; cursor: pointer;">
                        </div>
                    </div>
                `;
            } else {
                const isChecked = settings[opt.key] ? 'checked' : '';
                html += `
                    <div class="settings-item">
                        <div>
                            <div class="settings-label">${opt.label}</div>
                            <div class="settings-desc">${opt.desc}</div>
                        </div>
                        <label class="nh-switch">
                            <input type="checkbox" data-key="${opt.key}" ${isChecked}>
                            <span class="nh-slider"></span>
                        </label>
                    </div>
                `;
            }
        });

        html += `
                </div>
                <div class="settings-actions">
                    <button id="btn-save-reload" class="btn-setting-action"><i class="fa fa-save"></i> Save</button>
                    <button id="btn-export-data" class="btn-setting-action"><i class="fa fa-download"></i> Export Data</button>
                    <button id="btn-import-data" class="btn-setting-action"><i class="fa fa-upload"></i> Import Data</button>
                    <button id="btn-reset-settings" class="btn-setting-action"><i class="fa fa-undo-alt" style="margin-right: auto;"></i> Reset All</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
        content.appendChild(container);

        container.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.onchange = (e) => {
                settings[e.target.dataset.key] = e.target.checked;
                saveSettings();
            };
        });

        container.querySelectorAll('input[type="range"]').forEach(input => {
            input.onchange = (e) => {
                settings[e.target.dataset.key] = parseFloat(e.target.value);
                saveSettings();
            };
        });

        container.querySelector('#btn-save-reload').onclick = () => window.location.reload();
        container.querySelector('#btn-export-data').onclick = exportData;
        container.querySelector('#btn-import-data').onclick = importData;
        container.querySelector('#btn-reset-settings').onclick = () => {
            if (confirm('Reset all settings to default?')) {
                localStorage.removeItem('nhentai_flow_settings');
                location.reload();
            }
        };
    }

    // ==========================================================================
    // 12. CUSTOM CONTEXT MENU
    // ==========================================================================

    function initContextMenu() {
        if (document.body.dataset.contextMenuInit) return;
        document.body.dataset.contextMenuInit = '1';

        const menu = document.createElement('div');
        menu.className = 'nh-context-menu';
        document.body.appendChild(menu);

        let currentTargetId = null;
        let currentTargetUrl = null;

        document.addEventListener('contextmenu', (e) => {
            if (!settings.enableContextMenu) return;

            const gallery = e.target.closest('.gallery');
            if (!gallery) {
                closeMenu();
                return;
            }

            const link = gallery.querySelector('a.cover');
            if (!link) return;

            e.preventDefault();

            currentTargetId = gallery.dataset.gid;
            currentTargetUrl = link.href;

            renderMenuOptions(menu);
            positionMenu(e.clientX, e.clientY);
            menu.classList.add('is-visible');
        });

        window.addEventListener('click', (e) => {
            if (menu.contains(e.target)) return;
            closeMenu();
        }, true);

        ['scroll', 'resize'].forEach(evt => window.addEventListener(evt, closeMenu));

        function closeMenu() {
            menu.classList.remove('is-visible');
        }

        function positionMenu(x, y) {
            const w = 165, h = 173;
            if (x + w > window.innerWidth) x -= w;
            if (y + h > window.innerHeight) y -= h;
            menu.style.left = `${x}px`;
            menu.style.top = `${y}px`;
        }

        function renderMenuOptions(menuElement) {

            const galleryState = states.get(currentTargetId);

            const currentPage = galleryState ? galleryState.curr : 1;

            const readUrl = `/g/${currentTargetId}/${currentPage}/`;

            const readLabel = currentPage > 1 ? `Read from page ${currentPage}` : `Read now`;

            menuElement.innerHTML = `
            <div class="nh-cm-item" id="cm-new-tab">
                Open in new tab
            </div>
            <div class="nh-cm-item" id="cm-read-now">
                ${readLabel}
            </div>
            <div class="nh-cm-separator"></div>
            <div class="nh-cm-item" id="cm-copy-id">
                Copy ID: ${currentTargetId}
            </div>
            <div class="nh-cm-item" id="cm-favorite">
                Favorite
            </div>
            <div class="nh-cm-footer" id="cm-close-hint">
                Shift + right-click to open system menu
            </div>
        `;

            menuElement.querySelector('#cm-read-now').onclick = () => {
                window.location.href = readUrl;
                closeMenu();
            };

            menuElement.querySelector('#cm-new-tab').onclick = () => {
                if (typeof GM_openInTab !== 'undefined') {
                    GM_openInTab(currentTargetUrl, { active: false, insert: true });
                } else {
                    window.open(currentTargetUrl, '_blank');
                }
                closeMenu();
            };

            const favBtn = menuElement.querySelector('#cm-favorite');
            favBtn.onclick = (e) => {
                e.stopPropagation();
                handleApiFavorite(currentTargetId, favBtn);
            };

            menuElement.querySelector('#cm-copy-id').onclick = () => {
                navigator.clipboard.writeText(currentTargetId);
                closeMenu();
            };

            menuElement.querySelector('#cm-close-hint').onclick = () => {
                closeMenu();
            };
        }

        function handleApiFavorite(id, btnElement) {
            const originalText = btnElement.textContent;

            btnElement.textContent = 'Saving...';
            btnElement.style.pointerEvents = 'none';
            btnElement.style.opacity = '0.7';

            const apiUrl = `/api/gallery/${id}/favorite`;
            const csrfToken = getCookie('csrftoken') || document.querySelector('input[name="csrfmiddlewaretoken"]')?.value;

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({})
            })
                .then(response => {
                if (response.ok) return response.json();
                if (response.status === 403 || response.status === 401) throw new Error('Login required');
                throw new Error('Network error');
            })
                .then(data => {
                btnElement.textContent = 'Added to favorites!';
                btnElement.style.color = '#4caf50';
            })
                .catch(err => {
                console.error(err);
                btnElement.textContent = 'Login required';
                btnElement.style.color = '#ff4444';
                btnElement.style.pointerEvents = 'auto';

                setTimeout(() => {
                    btnElement.textContent = originalText;
                    btnElement.style.color = '';
                    btnElement.style.opacity = '1';
                }, 2000);
            });
        }

        function getCookie(name) {
            let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            return v ? v[2] : null;
        }
    }

    // ==========================================================================
    // 13. GLOBAL SHORTCUTS
    // ==========================================================================

    function initGlobalShortcuts() {
        if (document.body.dataset.shortcutsInit) return;
        document.body.dataset.shortcutsInit = '1';

        const searchForm = document.querySelector('form.search');
        const searchInput = document.querySelector('form.search input[name="q"]');

        if (searchForm && searchInput) {
            if (!searchForm.querySelector('.search-slash-hint')) {
                const hint = document.createElement('div');
                hint.className = 'search-slash-hint';
                hint.textContent = 'Type / to search';
                searchForm.insertBefore(hint, searchInput.nextSibling);
            }
        }

        document.addEventListener('keydown', (e) => {
            const target = e.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                if (e.key === 'Escape') target.blur();
                return;
            }
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            if (e.key === '/') {
                if (searchInput) {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });
    }

    // ==========================================================================
    // 14. INIT & OBSERVERS
    // ==========================================================================

    function scan() {
        const params = new URLSearchParams(window.location.search);

        if (params.get('view') === 'settings') return;

        initSearchFlow();
        document.querySelectorAll('.gallery:not([data-init])').forEach(initPreviewUI);
        initReaderMode();
        initGalleryPageFeatures();
        initGlobalShortcuts();
        initQueueWidget();
        initRandomContextual();

        if (typeof initContextMenu === 'function') initContextMenu();
    }

    document.addEventListener('keydown', (e) => {
        if (hoveredGallery && !document.fullscreenElement) {
            if (e.key === 'ArrowRight') { e.preventDefault(); update(hoveredGallery, 1); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); update(hoveredGallery, -1); }
            else if (e.key === 'q') {
                if (!settings.enableQueue) return;
                const btn = hoveredGallery.querySelector('.queue-trigger');
                if (btn) btn.click();
            }
        }
    });

    function boot() {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view');

        initSettingsMenu();

        if (view === 'settings') {
            renderSettingsPage();
            return;
        }

        if (view === 'queue') {
            renderQueuePage();
        }

        scan();

        initSmartNavigation();
        if (window.location.pathname === '/') initPopularShortcut();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    let observerTimeout;
    const observer = new MutationObserver(() => {
        if (observerTimeout) clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            scan();
        }, 150);
    });

    const contentNode = document.getElementById('content') || document.body;
    observer.observe(contentNode, { childList: true, subtree: true });

})();

/*
    ==========================================================================
    FUTURE IDEAS & DEV NOTES
    ==========================================================================

    [IDEA] Autocomplete API Integration
    Status: Research Complete / Implementation Pending UX decision
    Source: Network Analysis (api.txt)

    Details:
    - Endpoint: https://nhentai.net/api/autocomplete
    - Method: POST
    - Content-Type: application/x-www-form-urlencoded
    - Payload: name={query}&type={tag_type}

    // Draft Function for Future Use:
    async function fetchTagSuggestions(query, type = '') {
        // Minimum chars to avoid server spam
        if (!query || query.length < 2) return [];

        const formData = new URLSearchParams();
        formData.append('name', query);
        if (type) formData.append('type', type);

        try {
            const response = await fetch('/api/autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });

            if (!response.ok) throw new Error('Network err');
            const data = await response.json();
            return data.result || []; // Returns [{id, name, count, url}, ...]
        } catch (e) {
            console.warn("Autocomplete error", e);
            return [];
        }
    }
    */