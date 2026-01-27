// ==UserScript==
// @name         NHentai Flow
// @namespace    NEnhanced
// @version      1.3.2
// @description  Several Quality of Life features: Quick Preview, Queue System, Smart Scroll, Tag Selector, and more.
// @author       Testador
// @match        https://nhentai.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      nhentai.net
// @connect      i.nhentai.net
// @icon         https://external-content.duckduckgo.com/ip3/nhentai.net.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557178/NHentai%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/557178/NHentai%20Flow.meta.js
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
        paginationRight: false
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

        /* --- UI ELEMENTS (Hotzones/Seek) --- */
        .hotzone { position: absolute; top: 0; height: calc(100% - 15px); width: 40%; cursor: default; z-index: 20; }
        .hotzone-left { left: 0; } .hotzone-right { right: 0; }
        .seek-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 20px; z-index: 40; cursor: pointer; display: flex; align-items: flex-end; }
        .seek-bg { width: 100%; height: 3px; background: rgba(255,255,255,0.2); transition: height 0.1s; position: relative; backdrop-filter: blur(2px); }
        .seek-container:hover .seek-bg { height: 15px; background: rgba(255,255,255,0.3); }
        .seek-fill { height: 100%; background: #ed2553; width: 0%; transition: width 0.1s; }
        .seek-tooltip { position: absolute; bottom: 17px; transform: translateX(-50%); background: #ed2553; color: #fff; font-size: 10px; padding: 2px 4px; border-radius: .3em; opacity: 0; pointer-events: none; white-space: nowrap; font-weight: bold; transition: opacity 0.1s; }
        .seek-container:hover .seek-tooltip { opacity: 1; }

        /* --- TAGS & QUEUE TRIGGERS --- */
        .tag-trigger, .queue-trigger { position: absolute; top: 5px; background: rgba(0,0,0,0.6); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: .3em; cursor: pointer; z-index: 50; font-family: sans-serif; opacity: 0.7; border: 1px solid rgba(255,255,255,0.2); }
        .tag-trigger { left: 5px; cursor: help; }
        .queue-trigger { right: 5px; }
        .tag-trigger:hover, .queue-trigger:hover { opacity: 1; background: #ed2553; border-color: #ed2553; }
        .tag-trigger:hover { width: 190px; }
        .queue-trigger.in-queue { background: #ed2553; border-color: #ed2553; opacity: 1; }

        body:not(.f-tags) .tag-trigger { display: none !important; }
        body:not(.f-queue) .queue-trigger { display: none !important; }

        /* --- TAG POPUP --- */
        .tag-popup { display: none; position: absolute; top: 24px; left: 5px; width: 215px; max-height: 250px; overflow-y: auto; background: rgba(15,15,15,0.95); color: #ddd; border: 1px solid #333; border-radius: .3em; padding: 8px; font-size: 11px; z-index: 60; box-shadow: 0 4px 10px rgba(0,0,0,0.5); text-align: left; line-height: 1.4; }
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

        /* --- SMART NAVIGATION & PAGINATION --- */
        .smart-nav-bar { position: fixed; bottom: 0; left: 0; height: 5px; background: #ed2553; width: 0%; z-index: 9999; transition: width 0.1s linear; box-shadow: 0 -2px 10px rgba(237, 37, 83, 0.5); pointer-events: none; }
        body.is-gallery-page #content { padding-bottom: 200px !important; }

        @media (min-width: 900px) {
            body.is-gallery-page .pagination { position: fixed !important; top: 50% !important; transform: translateY(-50%) !important; display: flex !important; flex-direction: column !important; z-index: 4; left: 8px !important; right: auto !important; }
            body.is-gallery-page a.first, body.is-gallery-page a.previous, body.is-gallery-page a.last, body.is-gallery-page a.next { transform: rotate(90deg); }
            body.f-pag-right.is-gallery-page .pagination { left: auto !important; right: 16px !important; }
        }

        /* --- TAG SELECTOR & QUEUE BTN --- */
        @media (min-width: 900px) { #info { width: 580px; } }
        .btn-tag-selector.is-active, .btn-queue-add.in-queue { background-color: #ed2553 !important; }
        .tag-container .tag.tag-selected .name { background: #ed2553 !important; opacity: 1 !important; }
        .tags-selecting-mode .tag:not(.tag-selected) { opacity: 0.6; }
        body:not(.f-queue) .btn-queue-add, body:not(.f-queue) .btn-next-queue { display: none !important; }
        body:not(.f-tag-select) .btn-tag-selector { display: none !important; }

        /* --- QUEUE DOCK --- */
        .queue-dock { position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; align-items: flex-end; z-index: 100; pointer-events: none; }
        body:not(.f-queue) .queue-dock { display: none !important; }

        .queue-toggle-btn { width: 40px; height: 40px; border-radius: 50%; background: #1f1f1f; border: 2px solid #333; color: #fff; font-size: 15px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; transition: all 0.2s; position: relative; pointer-events: auto; }
        .queue-toggle-btn:hover { background: #ed2553; border-color: #ed2553; transform: scale(1.3); }
        .queue-count { position: absolute; top: -5px; right: -5px; background: #ed2553; color: #fff; font-size: 10px; font-weight: bold; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #1f1f1f; }
        .queue-panel { background: #1f1f1f; width: 300px; border: 1px solid #333; border-radius: 5px; overflow: hidden; margin-bottom: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.6); display: block; visibility: hidden; opacity: 0; transform: translateY(20px); transition: transform 0.2s, opacity 0.1s ease; pointer-events: auto; }
        .queue-panel.is-visible { visibility: visible; opacity: 1; transform: translateY(0); }
        .queue-header { padding: 10px 15px; background: #222; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; font-weight: bold; color: #eee; font-size: 13px; }
        .queue-clear, .queue-view-full { cursor: pointer; color: #ccc; font-size: 12px; transition: color 0.2s; }
        .queue-clear:hover, .queue-view-full:hover { color: #fff; }
        .queue-view-full { margin-right: 15px; }
        .queue-list { max-height: 350px; overflow-y: auto; padding: 0; margin: 0; list-style: none; }
        .queue-item { display: flex; padding: 8px; border-bottom: 1px solid #2a2a2a; transition: background 0.2s; position: relative; content-visibility: auto; contain-intrinsic-size: 62.5834px; }
        .queue-item:hover { background: #2a2a2a; }
        .queue-item img { width: 40px; height: 58px; object-fit: cover; border-radius: .3em; margin-right: 10px; }
        .queue-info { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
        .queue-title { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; margin-bottom: 4px; }
        .queue-title:hover { color: #ed2553; }
        .queue-id { font-size: 10px; color: #666; }
        .queue-remove { margin: 8px; color: #555; cursor: pointer; padding: 5px; display: flex; align-items: center; }
        .queue-remove:hover { color: #ed2553; }
        .queue-empty { padding: 20px; text-align: center; color: #666; font-size: 12px; font-style: italic; }

        .queue-toolbar { display: flex; gap: 10px; }
        .btn-q-tool { background: #4d4d4d; color: #fff; border: none; padding: 6px 12px; border-radius: .3em; font-size: 12px; cursor: pointer; display: flex; align-items: center; font-weight: bold; }
        .btn-q-tool:hover { background: #595959;  }
        .btn-q-tool.active { background: #ed2553; }
        .btn-q-tool i { margin-right: 6px; }
        @media (max-width: 600px) { .queue-toolbar { flex-wrap: wrap; } }

        /* --- PREVIEW NAV SETTINGS --- */
        body.disable-preview-nav .hotzone,
        body.disable-preview-nav .seek-container { display: none !important; }

        /* --- SAVED SEARCHES STYLES  --- */
        .search-saved-trigger { position: absolute; right: 45px; top: 0; height: 100%; width: 35px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #888; z-index: 5; }
        .search-saved-trigger:hover, .search-saved-trigger.is-active { color: #ed2553; }
        .saved-search-extension { position: relative; width: 100%; background: #1f1f1f; padding: 15px 20px; box-sizing: border-box; z-index: 5; display: block; visibility: hidden; opacity: 0; transform: scale(0.95); position: absolute; transition: transform 0.2s, opacity 0.1s ease }
        .saved-search-extension.is-visible { visibility: visible; opacity: 1; transform: scale(1); position: relative; }
        .sse-header { display: flex; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 8px; }
        .sse-title { font-weight: bold; color: #eee; margin-right: 15px; }
        .sse-actions { margin-left: auto; }
        .btn-sse-save, .btn-sse-edit { background: #4d4d4d; color: #fff; border: none; padding: 4px 10px; border-radius: .3em; font-size: 11px; cursor: pointer; }
        .btn-sse-save:hover, .btn-sse-edit:hover { background: #595959; }
        .btn-sse-edit.is-active { background: #ed2553; animation: pulseRed 2s infinite; }
        @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(237, 37, 83, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(237, 37, 83, 0); } 100% { box-shadow: 0 0 0 0 rgba(237, 37, 83, 0); } }
        .sse-empty { color: #666; font-style: italic; font-size: 12px; }
        .sse-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .ss-pill { font-weight: 700; display: inline-flex; align-items: stretch; border-radius: .3em; overflow: hidden; }
        .ss-pill.is-current .ss-text { background: #ed2553; }
        .ss-part { padding: .13em .39em; cursor: pointer; display: flex; align-items: center; background: #4d4d4d }
        .ss-add { padding: .13em .69em; background: #333; color: grey; box-shadow: inset 0 0 .4em #2b2b2b; }
        .ss-add:hover { background: #404040; color: #fff; }
        .ss-text:hover { background: #595959; }
        .sse-list.delete-mode .ss-add { pointer-events: none; opacity: 0.3; background: #000; }
        .sse-list.delete-mode .ss-text { color: #f15478; cursor: alias; }
        .sse-list.delete-mode .ss-text:hover { background: #f15478; color: #fff; text-decoration: line-through; }
        body:not(.f-saved-search) .search-saved-trigger,
        body:not(.f-saved-search) .saved-search-extension { display: none !important; }

        /* --- SEARCH SHORTCUT HINT --- */
        .search-slash-hint { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #999; font-size: 12px; pointer-events: none; font-family: Consolas, monospace; }
        form.search input:focus ~ .search-slash-hint, form.search input:not(:placeholder-shown) ~ .search-slash-hint { opacity: 0; }
        form.search { position: relative; }

        /* --- SETTINGS MODAL STYLES --- */
        .nh-settings-modal { display: flex; visibility: hidden; opacity: 0; pointer-events: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 11000; align-items: center; justify-content: center; }
        .nh-settings-modal.is-open { visibility: visible; opacity: 1; pointer-events: auto; }
        .nh-settings-panel { background: #1f1f1f; width: 450px; padding: 10px 30px 15px; border-radius: 5px; box-shadow: 0 0 60px rgba(0,0,0,.5); display: flex; flex-direction: column; transform: scale(0.95) translateY(-20px); opacity: 0; transition: transform 0.2s, opacity 0.1s ease; }
        .nh-settings-modal.is-open .nh-settings-panel { transform: scale(1) translateY(0); opacity: 1; }
        .nh-settings-panel h2 { margin: .67em 0; color: #d9d9d9; font-size: 1.5em; font-weight: 700; text-align: center; }
        .nh-setting-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
        .nh-setting-label { color: #d9d9d9; font-size: 14px; font-weight: 700; }
        .nh-toggle { cursor: pointer; display: inline-block; position: relative; width: 44px; height: 24px; background: #333; border-radius: 12px; transition: .2s; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3); }
        .nh-toggle::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: #888; border-radius: 50%; transition: .2s; box-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        .nh-toggle.active { background: #ed2553; }
        .nh-toggle.active::after { left: 23px; background: #fff; }
        .nh-close-btn { width: 100%; background: #ed2553; color: #fff; border: none; padding: 12px; margin-top: 20px; cursor: pointer; border-radius: .3em; font-weight: bold; }
        .nh-close-btn:hover { background: #f15478; }
        .nav-settings-btn { cursor: pointer; padding-left: 10px; padding-right: 10px; line-height: 50px; display: block; }
        .nav-settings-btn:hover { background-color: #383838; }
        .nh-settings-actions { margin-top: 20px; display: flex; gap: 10px; }
        .btn-data { flex: 1; padding: 8px; border: none; background: #4d4d4d; color: #fff; cursor: pointer; border-radius: .3em; font-weight: bold }
        .btn-data:hover { background: #595959; }
        .btn-data i { margin-right: 5px; }

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

        toggle.onclick = () => {
            const isVisible = panel.classList.toggle('is-visible');

            if (isVisible) {
                const currentId = window.location.pathname.match(/\/g\/(\d+)/)?.[1];

                if (currentId) {
                    const activeItem = list.querySelector(`.queue-item[data-id="${currentId}"]`);

                    if (activeItem) {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                activeItem.scrollIntoView({ behavior: 'auto', block: 'center' });

                                const originalBg = activeItem.style.background;
                                activeItem.style.background = '#333';
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
            html += `<a href="/?view=queue&page=${currentPage - 1}" class="page previous"><i class="fa fa-chevron-left"></i></a>`;
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                const isCurrent = i === currentPage ? 'current' : '';
                html += `<a href="/?view=queue&page=${i}" class="page ${isCurrent}">${i}</a>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += `<span class="page">...</span>`;
            }
        }

        if (currentPage < totalPages) {
            html += `<a href="/?view=queue&page=${currentPage + 1}" class="page next"><i class="fa fa-chevron-right"></i></a>`;
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
        header.className = 'container';

        header.innerHTML = `
            <h1>
                <span class="name">Reading Queue</span>
                <span class="count">(${totalItems})</span>
            </h1>
            <div style="margin-bottom: 20px; color: #888; font-size: 13px;">
                 <span style="margin-right: 15px;">
                    <i class="fa fa-database"></i> Storage Used: <b>${queueSizeKB} KB</b>
                 </span>
                 <span>
                    <i class="fa fa-check-circle"></i> Data is stored locally
                 </span>
            </div>
        `;
        content.appendChild(header);

        if (totalItems > 1) {
            const toolbar = document.createElement('div');
            toolbar.className = 'container queue-toolbar';

            const buttons = [
                { id: 'newest', icon: 'fa-sort-amount-down', label: 'Newest First' },
                { id: 'oldest', icon: 'fa-sort-amount-up', label: 'Oldest First' },
                { id: 'shuffle', icon: 'fa-random', label: 'Shuffle' }
            ];

            buttons.forEach(btn => {
                const buttonEl = document.createElement('button');
                const isActive = currentSortMode === btn.id ? 'active' : '';
                buttonEl.className = `btn-q-tool ${isActive}`;
                buttonEl.innerHTML = `<i class="fa ${btn.icon}"></i> ${btn.label}`;

                buttonEl.onclick = () => applyQueueSort(btn.id);

                toolbar.appendChild(buttonEl);
            });

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
            if (document.fullscreenElement) { document.exitFullscreen(); }
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

        const toolbars = document.querySelectorAll('.reader-buttons-right');
        if (toolbars.length === 0) return;
        const toolbar = toolbars[toolbars.length - 1];

        // Fullscreen
        if (!document.querySelector('.btn-fullscreen-custom')) {
            const fsBtn = document.createElement('button');
            fsBtn.className = 'btn btn-unstyled btn-fullscreen-custom';
            fsBtn.innerHTML = '<i class="fa fa-expand"></i>';
            fsBtn.title = "Fullscreen (T)";

            const toggleFS = () => {
                if (!document.fullscreenElement) {
                    imageContainer.requestFullscreen().catch(err => console.log(err));
                } else {
                    document.exitFullscreen();
                }
            };
            fsBtn.onclick = toggleFS;

            toolbar.insertBefore(fsBtn, toolbar.firstChild);

            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleFS(); }
            });

            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    fsBtn.innerHTML = '<i class="fa fa-expand"></i>';
                    setTimeout(() => {
                        imageContainer.scrollIntoView({ behavior: 'auto', block: 'start' });
                    }, 50);
                }
            });
        }

        // Next Queue
        if (settings.enableQueue) {
            const fsBtn = document.querySelector('.btn-fullscreen-custom');
            const currentId = window.location.pathname.match(/\/g\/(\d+)/)?.[1];

            if (currentId && readingQueue.length > 0) {
                const currentIndex = readingQueue.findIndex(i => i.id == currentId);
                if (currentIndex > -1 && currentIndex < readingQueue.length - 1) {
                    const nextItem = readingQueue[currentIndex + 1];
                    const nextQBtn = document.createElement('a');
                    nextQBtn.className = 'btn btn-unstyled btn-next-queue';
                    nextQBtn.innerHTML = `<span style="font-weight:bold;">Next Queue <i class="fa fa-step-forward"></i></span>`;
                    nextQBtn.href = `/g/${nextItem.id}/1/`;
                    nextQBtn.title = `Read Next: ${nextItem.title}`;
                    nextQBtn.style.marginLeft = '10px';

                    if (fsBtn && fsBtn.nextSibling) {
                        toolbar.insertBefore(nextQBtn, fsBtn.nextSibling);
                    } else {
                        toolbar.appendChild(nextQBtn);
                    }
                }
            }
        }

        // Random Favorite
        const hasFavorites = !!document.querySelector('nav a[href*="/favorites/"]');
        if (hasFavorites) {
            const randFavBtn = document.createElement('a');
            randFavBtn.className = 'btn btn-unstyled btn-random-fav';
            randFavBtn.innerHTML = '<span><i class="fa fa-circle-notch fa-spin"></i></span>';
            randFavBtn.style.marginRight = '10px';
            randFavBtn.style.cursor = 'wait';
            randFavBtn.style.opacity = '0.7';

            toolbar.insertBefore(randFavBtn, toolbar.firstChild);

            fetch('/favorites/random')
                .then(response => {
                    const finalUrl = response.url;
                    if (finalUrl && finalUrl.includes('/g/')) {
                        let cleanUrl = finalUrl.split('?')[0];
                        if (!cleanUrl.endsWith('/')) cleanUrl += '/';
                        randFavBtn.href = `${cleanUrl}1/`;
                        randFavBtn.innerHTML = '<span style="font-weight:bold;"></i> Fav <i class="fa fa-random"></i></span>';
                        randFavBtn.title = "Read Random Favorite";
                        randFavBtn.style.cursor = 'pointer';
                        randFavBtn.style.opacity = '1';
                    } else {
                        randFavBtn.remove();
                    }
                })
                .catch(err => { randFavBtn.remove(); });
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
        let isNavigating = false;
        let isProcessingScroll = false;

        window.addEventListener('wheel', (e) => {
            if (isNavigating || isProcessingScroll) return;

            isProcessingScroll = true;

            window.requestAnimationFrame(() => {
                const nextLink = document.querySelector('.pagination .next');

                if (!nextLink) {
                    isProcessingScroll = false;
                    return;
                }

                const scrollBottom = window.scrollY + window.innerHeight;
                const docHeight = document.body.scrollHeight;
                const isAtBottom = (docHeight - scrollBottom) < 100;

                if (isAtBottom && e.deltaY > 0) {
                    accumulatedDelta += e.deltaY;
                    const percent = Math.min(100, (accumulatedDelta / SMART_NAV_THRESHOLD) * 100);
                    navBar.style.width = `${percent}%`;

                    if (accumulatedDelta > SMART_NAV_THRESHOLD) {
                        isNavigating = true;
                        navBar.style.background = "#fff";
                        navBar.style.boxShadow = "0 0 15px #fff";
                        window.location.href = nextLink.href;
                    }
                } else {
                    if (accumulatedDelta > 0) {
                        accumulatedDelta = 0;
                        navBar.style.width = '0%';
                    }
                }

                isProcessingScroll = false;
            });
        }, { passive: true });
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

                if (tagName.includes(' ')) tagName = `"${tagName}"`;
                if (href.includes('/artist/')) return `artist:${tagName}`;
                if (href.includes('/group/')) return `group:${tagName}`;
                if (href.includes('/parody/')) return `parody:${tagName}`;
                if (href.includes('/character/')) return `character:${tagName}`;
                return tagName;
            });
            searchInput.value = queryTerms.join(' ');
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
        const saveSearch = () => localStorage.setItem('nhentai_search_flow', JSON.stringify(searchData));

        const toggleSavedItem = (query) => {
            if (!query) return;
            const idx = searchData.saved.indexOf(query);
            if (idx > -1) searchData.saved.splice(idx, 1);
            else searchData.saved.push(query);
            saveSearch();

            if (searchData.saved.length === 0) isDeleteMode = false;
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
            const editBtnText = isDeleteMode ? '<i class="fa fa-times"></i> Done' : '<i class="fas fa-eraser"></i> Delete';
            const editBtnClass = isDeleteMode ? 'btn-sse-edit is-active' : 'btn-sse-edit';

            let html = `
                <div class="sse-header">
                    <span class="sse-title"><i class="fa fa-tags"></i> Saved Searches</span>
                        ${currentQ && !isCurrentSaved ?
                            `<button class="btn-sse-save" id="btn-save-curr-bar"><i class="fa fa-plus"></i> Save Current</button>` : ''}

                    <div class="sse-actions">
                        ${searchData.saved.length > 0 ?
                            `<button class="${editBtnClass}" id="btn-toggle-edit">${editBtnText}</button>` : ''}
                    </div>
                </div>
                <div class="${listClass}">
            `;

            if (searchData.saved.length === 0) {
                html += `<div class="sse-empty">No saved searches yet.</div>`;
            } else {
                searchData.saved.forEach(q => {
                    const isCurrent = q === currentQ ? 'is-current' : '';
                    const safeQ = q.replace(/"/g, '&quot;');
                    html += `
                        <div class="ss-pill ${isCurrent}">
                            <div class="ss-part ss-add" data-q="${safeQ}" title="Add to current input"><i class="fa fa-plus" style="font-size: 10px;"></i></div>
                            <div class="ss-part ss-text" title="${isDeleteMode ? 'Click to DELETE' : 'Click to Search'}">${q}</div>
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
                    isDeleteMode = !isDeleteMode;
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
                const text = el.textContent.trim();
                const fullQuery = searchData.saved.find(s => s.trim() === text) || text;

                el.onclick = (e) => {
                    e.stopPropagation();
                    if (isDeleteMode) {
                        toggleSavedItem(fullQuery);
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
                };
            });
        };

        trigger.onclick = (e) => {
            e.stopPropagation();
            const isVisible = barContainer.classList.contains('is-visible');

            if (!isVisible) {
                isDeleteMode = false;
                renderBar();
                barContainer.classList.add('is-visible');
                trigger.classList.add('is-active');
            } else {
                barContainer.classList.remove('is-visible');
                trigger.classList.remove('is-active');
            }
        };
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
        btnLi.innerHTML = '<span class="nav-settings-btn"><i class="fa fa-cog"></i></span>';
        btnLi.onclick = toggleModal;
        navContainer.insertBefore(btnLi, navContainer.firstChild);

        const modal = document.createElement('div');
        modal.className = 'nh-settings-modal';
        modal.innerHTML = `
            <div class="nh-settings-panel">
                <h2>NHentai Flow Settings</i></h2>
                <div id="settings-list"></div>
                <button class="nh-close-btn">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.nh-close-btn').onclick = toggleModal;
        modal.onclick = (e) => { if(e.target === modal) toggleModal(); };

        function toggleModal() {
            const isOpen = modal.classList.toggle('is-open');
            if (isOpen) renderSettingsList();
        }

        function renderSettingsList() {
            const list = modal.querySelector('#settings-list');
            list.innerHTML = '';

            const options = [
                { key: 'previewNav', label: 'Hover Preview (thumbnails)' },
                { key: 'highlightVisited', label: 'Highlight read galleries' },
                { key: 'showTagOverlay', label: 'Show tags on hover' },
                { key: 'enableTagSelect', label: 'Enable tag selector' },
                { key: 'enableSavedSearch', label: 'Enable saved searches' },
                { key: 'enableQueue', label: 'Enable reading queue' },
                { key: 'smartNav', label: 'Smart navigation (auto-scroll)' },
                { key: 'paginationRight', label: 'Show pagination on the right' }
            ];

            options.forEach(opt => {
                const div = document.createElement('div');
                div.className = 'nh-setting-item';
                div.innerHTML = `
                    <span class="nh-setting-label">${opt.label}</span>
                    <div class="nh-toggle ${settings[opt.key] ? 'active' : ''}"></div>
                `;

                div.querySelector('.nh-toggle').onclick = function() {
                    settings[opt.key] = !settings[opt.key];
                    this.classList.toggle('active');
                    saveSettings();
                };
                list.appendChild(div);
            });
            const actionDiv = document.createElement('div');
            actionDiv.className = 'nh-settings-actions';

            const btnExport = document.createElement('button');
            btnExport.className = 'btn-data';
            btnExport.innerHTML = '<i class="fa fa-download"></i> Export Data';
            btnExport.onclick = exportData;

            const btnImport = document.createElement('button');
            btnImport.className = 'btn-data';
            btnImport.innerHTML = '<i class="fa fa-upload"></i> Import Data';
            btnImport.onclick = importData;

            actionDiv.appendChild(btnExport);
            actionDiv.appendChild(btnImport);
            list.appendChild(actionDiv);
        }
    }

    // ==========================================================================
    // 12. GLOBAL SHORTCUTS
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
    // 13. INIT & OBSERVERS
    // ==========================================================================

    function scan() {
        initSettingsMenu();
        initSearchFlow();
        document.querySelectorAll('.gallery:not([data-init])').forEach(initPreviewUI);
        initReaderMode();
        initGalleryPageFeatures();
        initGlobalShortcuts();
        initQueueWidget();
        initRandomContextual();
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            scan();
            initSmartNavigation();
            if (window.location.pathname === '/') initPopularShortcut();
            renderQueuePage();
        });
    } else {
        scan();
        initSmartNavigation();
        if (window.location.pathname === '/') initPopularShortcut();
        renderQueuePage();
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