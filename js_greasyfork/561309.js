// ==UserScript==
// @name         ArabP2P Scroll
// @namespace    https://arabp2p.net/
// @version      1.3.1
// @description  ArabP2P Infinite Scroll Extension By Hamza - Supports Listings & Torrents
// @author       Hamza
// @match        https://www.arabp2p.net/index.php*
// @match        https://arabp2p.net/index.php*
// @icon         https://www.arabp2p.net/favicon.ico
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561309/ArabP2P%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/561309/ArabP2P%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("ArabP2P Enhancer: Script loaded! (Userscript v1.3.1 - Fast Scroll Fix)");

    // --- Inject CSS ---
    GM_addStyle(`
        :root {
            --poster-width: 155px;
            --gap-size: 20px;
            --control-bar-bg: #f8f9fa;
            --resume-bg: #28a745;
            --resume-hover-bg: #218838;
            --stop-bg: #dc3545;
            --stop-hover-bg: #c82333;
            --disabled-bg: #e9ecef;
            --text-color: #212529;
            --border-color: #dee2e6;
            --poster-hover-border: #888;
            --poster-active-border: #007bff;
        }

        /* === Listing Pages Styles === */
        .enhancer-active .listing_div1,
        .enhancer-active form[name="change_pagepages"],
        .enhancer-active form[name="change_page1pages"] {
            display: none !important;
        }

        .enhancer-active .listing_div {
            min-height: 0 !important; height: auto !important;
            padding: 0 20px 20px 20px !important; margin: 0 !important;
            overflow: hidden !important; display: block !important;
            box-sizing: border-box !important;
        }

        #custom-poster-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(var(--poster-width), 1fr));
            gap: var(--gap-size);
            width: 100%;
        }

        .poster-card {
            display: block;
            border-radius: 6px;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 0 1px transparent;
            transition: box-shadow 0.2s ease;
        }

        .poster-card:hover {
            box-shadow: 0 3px 7px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--poster-hover-border);
        }

        .poster-card:active {
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--poster-active-border);
            transition-duration: 0.05s;
        }

        .poster-card img {
            width: 100%; height: auto; display: block;
            aspect-ratio: 2 / 3; object-fit: cover;
        }

        .poster-card-title {
            display: block;
            padding: 8px 6px;
            font-size: 0.85em;
            font-weight: 500;
            color: #333;
            text-align: center;
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: linear-gradient(to bottom, #fff, #f5f5f5);
            font-family: 'arabp2p', tahoma, arial, helvetica, sans-serif;
        }

        .poster-card:hover .poster-card-title {
            white-space: normal;
            word-wrap: break-word;
        }

        /* === Shared Control Styles === */
        #status-container {
            text-align: center; padding: 25px 0 10px 0;
            width: 100%; min-height: 2em;
            font-family: 'arabp2p', tahoma, arial, helvetica, sans-serif;
        }

        #status-container div {
            font-size: 1.1em; color: #6c757d; font-weight: 500;
        }

        #status-controls {
            display: flex; justify-content: center; align-items: center;
            gap: 15px; max-width: 550px;
            margin: 20px auto 30px auto;
            padding: 10px 15px;
            background-color: var(--control-bar-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
            box-sizing: border-box;
            font-family: 'arabp2p', tahoma, arial, helvetica, sans-serif;
        }

        #page-indicator {
            color: var(--text-color); font-size: 1.1em;
            font-weight: bold; text-align: center; flex-grow: 1;
        }

        .control-btn {
            color: white; border: none; padding: 8px 20px;
            border-radius: 6px; cursor: pointer; font-weight: bold;
            font-size: 1em; transition: all 0.2s ease-in-out;
            display: flex; align-items: center; gap: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); font-family: inherit;
        }

        .control-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        .control-btn:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .control-btn:disabled {
            background-color: var(--disabled-bg);
            color: #6c757d; cursor: not-allowed;
            box-shadow: none; transform: none;
        }

        .control-btn.resume { background-color: var(--resume-bg); }
        .control-btn.resume:hover:not(:disabled) { background-color: var(--resume-hover-bg); }
        .control-btn.stop { background-color: var(--stop-bg); }
        .control-btn.stop:hover:not(:disabled) { background-color: var(--stop-hover-bg); }

        /* === Torrents Page Styles === */
        .enhancer-torrents-active form[name="change_pagepages"],
        .enhancer-torrents-active form[name="change_page1pages"] {
            display: none !important;
        }

        #torrents-status-container {
            text-align: center; padding: 25px 0 10px 0;
            width: 100%; min-height: 2em;
            font-family: 'arabp2p', tahoma, arial, helvetica, sans-serif;
        }

        #torrents-status-container div {
            font-size: 1.1em; color: #6c757d; font-weight: 500;
        }

        .infinite-scroll-separator {
            background-color: #17a2b8 !important;
            color: #fff !important;
            text-align: center;
            padding: 8px;
            font-weight: bold;
        }
    `);

    // --- Settings & Variables ---
    let currentPage = 1;
    let isLoading = false;
    let hasMore = true;
    let lastPageNumber = Infinity;
    const BASE_URL = window.location.origin;
    let isPaused = false;
    let gridContainer, statusContainer, pageIndicator, stopBtn, resumeBtn;
    let pageMode = null; // 'listing' or 'torrents'
    let prefetchedData = null; // For prefetching next page
    let observer = null; // IntersectionObserver
    const LOAD_DELAY = 300; // Reduced from 750ms

    // --- Functions ---
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function showStatusMessage(text) {
        if (statusContainer) {
            statusContainer.innerHTML = text ? `<div>${text}</div>` : "";
        }
    }

    function updateControlsUI() {
        if (!pageIndicator) return;

        let statusText = `الصفحة الحالية: ${currentPage} / ${lastPageNumber === Infinity ? '??' : lastPageNumber}`;
        const isAtEnd = !hasMore || (lastPageNumber !== Infinity && currentPage >= lastPageNumber);

        if (isAtEnd) {
            statusText = `تم الوصول للنهاية عند الصفحة ${lastPageNumber}`;
        }
        pageIndicator.textContent = statusText;

        if (stopBtn && resumeBtn) {
            stopBtn.disabled = isPaused || isAtEnd;
            resumeBtn.disabled = !isPaused || isAtEnd;
        }
    }

    // === LISTING PAGES FUNCTIONS ===
    async function fetchListingData(pageNumber, pageParam, extraParams) {
        const url = `${BASE_URL}/index.php?page=${pageParam}${extraParams}&pages=${pageNumber}`;
        try {
            const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

            const htmlText = await response.text();
            const doc = new DOMParser().parseFromString(htmlText, "text/html");
            const items = doc.querySelectorAll('.listing_div1');

            if (items.length === 0) return [];

            const scrapedData = [];
            items.forEach(item => {
                const linkTag = item.querySelector('a');
                const imgTag = item.querySelector('img.listing_poster');
                if (linkTag && imgTag) {
                    scrapedData.push({
                        name: imgTag.getAttribute('alt').replace(/<br>/g, ' ').trim(),
                        link: `${BASE_URL}/${linkTag.getAttribute('href')}`,
                        imageUrl: imgTag.getAttribute('src')
                    });
                }
            });
            return scrapedData;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    async function fetchNextListingPage(pageNumber, pageParam, extraParams) {
        if (isPaused || (lastPageNumber !== Infinity && pageNumber > lastPageNumber)) {
            hasMore = false;
            showStatusMessage(`تم الوصول إلى نهاية القائمة عند الصفحة رقم ${lastPageNumber}`);
            updateControlsUI();
            return [];
        }

        isLoading = true;
        showStatusMessage("جاري التحميل...");

        let scrapedData;

        // Use prefetched data if available
        if (prefetchedData && prefetchedData.page === pageNumber) {
            scrapedData = prefetchedData.data;
            prefetchedData = null;
        } else {
            await delay(LOAD_DELAY);
            scrapedData = await fetchListingData(pageNumber, pageParam, extraParams);
        }

        if (scrapedData.length === 0) {
            hasMore = false;
            currentPage = pageNumber - 1;
            updateControlsUI();
            isLoading = false;
            return [];
        }

        isLoading = false;
        if (hasMore) showStatusMessage("");

        // Prefetch next page in background
        if (lastPageNumber === Infinity || pageNumber < lastPageNumber) {
            prefetchNextPage(pageNumber + 1, pageParam, extraParams);
        }

        return scrapedData;
    }

    // Prefetch next page in background
    async function prefetchNextPage(pageNumber, pageParam, extraParams) {
        if (lastPageNumber !== Infinity && pageNumber > lastPageNumber) return;
        const data = await fetchListingData(pageNumber, pageParam, extraParams);
        if (data.length > 0) {
            prefetchedData = { page: pageNumber, data: data };
            console.log(`Prefetched page ${pageNumber}`);
        }
    }

    function renderPosters(itemList, container) {
        // Batch DOM operations using DocumentFragment
        const fragment = document.createDocumentFragment();

        itemList.forEach(item => {
            const card = document.createElement('a');
            card.href = item.link;
            card.className = 'poster-card';
            card.title = item.name;
            card.target = '_blank';

            const img = document.createElement('img');
            img.src = item.imageUrl;
            img.alt = item.name;
            img.loading = 'lazy';

            const title = document.createElement('span');
            title.className = 'poster-card-title';
            title.textContent = item.name;

            card.appendChild(img);
            card.appendChild(title);
            fragment.appendChild(card);
        });

        container.appendChild(fragment);
    }

    // === TORRENTS PAGE FUNCTIONS ===
    async function fetchNextTorrentsPage(pageNumber, extraParams) {
        if (isPaused || (lastPageNumber !== Infinity && pageNumber > lastPageNumber)) {
            hasMore = false;
            showStatusMessage(`تم الوصول إلى نهاية القائمة عند الصفحة رقم ${lastPageNumber}`);
            updateControlsUI();
            return [];
        }

        isLoading = true;
        showStatusMessage("جاري التحميل...");
        await delay(LOAD_DELAY);

        const url = `${BASE_URL}/index.php?page=torrents${extraParams}&pages=${pageNumber}`;
        try {
            const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

            const htmlText = await response.text();
            const doc = new DOMParser().parseFromString(htmlText, "text/html");

            // Get torrent rows from the table
            const torrentTable = doc.querySelector('table#torrents_list_p tbody');
            if (!torrentTable) {
                hasMore = false;
                currentPage = pageNumber - 1;
                updateControlsUI();
                return [];
            }

            const rows = torrentTable.querySelectorAll('tr');
            if (rows.length === 0) {
                hasMore = false;
                currentPage = pageNumber - 1;
                updateControlsUI();
                return [];
            }

            // Return the HTML of the rows
            const rowsHTML = [];
            rows.forEach(row => {
                rowsHTML.push(row.outerHTML);
            });

            return rowsHTML;
        } catch (error) {
            console.error('Error fetching torrents:', error);
            hasMore = false;
            currentPage = pageNumber - 1;
            updateControlsUI();
            return [];
        } finally {
            isLoading = false;
            if (hasMore) showStatusMessage("");
        }
    }

    function renderTorrentRows(rowsHTML, container) {
        // Add a separator for the new page
        const separatorHTML = `<tr><td colspan="9" class="infinite-scroll-separator">═══ الصفحة ${currentPage + 1} ═══</td></tr>`;
        container.insertAdjacentHTML('beforeend', separatorHTML);

        rowsHTML.forEach(rowHTML => {
            container.insertAdjacentHTML('beforeend', rowHTML);
        });
    }

    // === SHARED FUNCTIONS ===
    async function fetchLastPageNumber(pageParam, extraParams) {
        try {
            const url = `${BASE_URL}/index.php?page=${pageParam}${extraParams}&pages=99999`;
            const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            if (!response.ok) throw new Error(`Prefetch failed with status: ${response.status}`);

            const htmlText = await response.text();
            const doc = new DOMParser().parseFromString(htmlText, "text/html");
            const paginationContainer = doc.querySelector('form[name="change_page1pages"]');

            if (!paginationContainer) return Infinity;

            const pageLinks = paginationContainer.querySelectorAll('a, .pagercurrent b');
            let maxPage = 0;
            pageLinks.forEach(link => {
                const pageNum = parseInt(link.textContent);
                if (!isNaN(pageNum) && pageNum > maxPage) maxPage = pageNum;
            });

            console.log(`Prefetch for "${pageParam}" successful. True last page:`, maxPage);
            return maxPage > 0 ? maxPage : Infinity;
        } catch (error) {
            console.error('Could not prefetch the last page number.', error);
            return Infinity;
        }
    }

    function setupIntersectionObserver(pageParam, extraParams) {
        // Create a sentinel element at the bottom
        const sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '10px';

        // Insert sentinel after the grid/table container
        if (pageMode === 'listing') {
            gridContainer.parentElement.insertBefore(sentinel, statusContainer);
        } else {
            gridContainer.closest('table').parentElement.appendChild(sentinel);
        }

        // Load function that can be called repeatedly
        async function loadMore() {
            const canLoadMore = !isLoading && hasMore && !isPaused && (lastPageNumber === Infinity || currentPage < lastPageNumber);
            if (!canLoadMore) return;

            const nextPage = currentPage + 1;

            if (pageMode === 'listing') {
                const newItems = await fetchNextListingPage(nextPage, pageParam, extraParams);
                if (newItems.length > 0) {
                    currentPage = nextPage;
                    renderPosters(newItems, gridContainer);
                }
            } else if (pageMode === 'torrents') {
                const newRows = await fetchNextTorrentsPage(nextPage, extraParams);
                if (newRows.length > 0) {
                    currentPage = nextPage;
                    renderTorrentRows(newRows, gridContainer);
                }
            }

            updateControlsUI();

            // Check if we need to load more (user scrolled fast)
            requestAnimationFrame(() => {
                const rect = sentinel.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight + 500;
                if (isVisible && hasMore && !isPaused && !isLoading) {
                    loadMore();
                }
            });
        }

        // Use IntersectionObserver for better performance
        observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                loadMore();
            }
        }, {
            root: null,
            rootMargin: '500px', // Load when 500px away from viewport
            threshold: 0
        });

        observer.observe(sentinel);
    }

    // Fallback scroll listener for older browsers
    function setupScrollListener(pageParam, extraParams) {
        if ('IntersectionObserver' in window) {
            setupIntersectionObserver(pageParam, extraParams);
            return;
        }

        // Throttled scroll handler for older browsers
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;

            scrollTimeout = setTimeout(async () => {
                scrollTimeout = null;

                const isNearBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 500;
                const canLoadMore = !isLoading && hasMore && !isPaused && (lastPageNumber === Infinity || currentPage < lastPageNumber);

                if (isNearBottom && canLoadMore) {
                    const nextPage = currentPage + 1;

                    if (pageMode === 'listing') {
                        const newItems = await fetchNextListingPage(nextPage, pageParam, extraParams);
                        if (newItems.length > 0) {
                            currentPage = nextPage;
                            renderPosters(newItems, gridContainer);
                        }
                    } else if (pageMode === 'torrents') {
                        const newRows = await fetchNextTorrentsPage(nextPage, extraParams);
                        if (newRows.length > 0) {
                            currentPage = nextPage;
                            renderTorrentRows(newRows, gridContainer);
                        }
                    }

                    updateControlsUI();
                }
            }, 100); // Throttle to 100ms
        });
    }

    function setupControlButtons() {
        stopBtn.addEventListener('click', () => {
            isPaused = true;
            showStatusMessage("التحميل التلقائي متوقف");
            updateControlsUI();
        });

        resumeBtn.addEventListener('click', () => {
            isPaused = false;
            showStatusMessage("");
            updateControlsUI();
            // Trigger check for loading more content
            const sentinel = document.getElementById('scroll-sentinel');
            if (sentinel && observer) {
                observer.unobserve(sentinel);
                observer.observe(sentinel);
            } else {
                window.dispatchEvent(new CustomEvent('scroll'));
            }
        });
    }

    // === LISTING PAGES INITIALIZER ===
    async function initializeListing() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        const ALLOWED_LISTING_PAGES = ['anime-listing', 'movies-listing', 'tv-listing', 'turkey-listing'];

        if (!pageParam || !ALLOWED_LISTING_PAGES.includes(pageParam)) return false;

        const allowedKeys = ['page', 'pages', 'play'];
        for (const key of urlParams.keys()) {
            if (!allowedKeys.includes(key)) return false;
        }

        pageMode = 'listing';
        document.body.classList.add('enhancer-active');

        const extraParams = urlParams.has('play') ? '&play' : '';
        lastPageNumber = await fetchLastPageNumber(pageParam, extraParams);

        const currentPageElement = document.querySelector('span.pagercurrent b');
        if (currentPageElement) {
            currentPage = parseInt(currentPageElement.textContent);
        } else {
            currentPage = 1;
        }
        console.log('Listing Mode - Current Page:', currentPage);

        const mainContainer = document.querySelector(".listing_div");
        const searchForm = mainContainer ? mainContainer.querySelector('form[name="anime_search"]') : null;
        if (!mainContainer || !searchForm) return false;

        const initialData = [];
        document.querySelectorAll('.listing_div1').forEach(item => {
            const linkTag = item.querySelector('a');
            const imgTag = item.querySelector('img.listing_poster');
            if (linkTag && imgTag) {
                initialData.push({
                    name: imgTag.getAttribute('alt').replace(/<br>/g, ' ').trim(),
                    link: `${BASE_URL}/${linkTag.getAttribute('href')}`,
                    imageUrl: imgTag.getAttribute('src')
                });
            }
        });

        mainContainer.innerHTML = `
            ${searchForm.outerHTML}
            <div id="custom-poster-grid"></div>
            <div id="status-container"></div>
            <div id="status-controls">
                <button id="resume-btn" class="control-btn resume" title="استئناف التحميل">▶ استئناف</button>
                <div id="page-indicator"></div>
                <button id="stop-btn" class="control-btn stop" title="إيقاف التحميل">❚❚ إيقاف</button>
            </div>
        `;

        gridContainer = document.getElementById('custom-poster-grid');
        statusContainer = document.getElementById('status-container');
        pageIndicator = document.getElementById('page-indicator');
        stopBtn = document.getElementById('stop-btn');
        resumeBtn = document.getElementById('resume-btn');

        renderPosters(initialData, gridContainer);
        updateControlsUI();
        setupControlButtons();
        setupScrollListener(pageParam, extraParams);

        return true;
    }

    // === TORRENTS PAGE INITIALIZER ===
    async function initializeTorrents() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');

        if (pageParam !== 'torrents') return false;

        pageMode = 'torrents';
        document.body.classList.add('enhancer-torrents-active');

        // Build extra params from URL (category, search, active, order, etc.)
        let extraParams = '';
        const preserveKeys = ['category', 'search', 'active', 'internel', 'order', 'by', 'uploader', 'id', 'tag'];
        for (const key of preserveKeys) {
            if (urlParams.has(key)) {
                extraParams += `&${key}=${encodeURIComponent(urlParams.get(key))}`;
            }
        }

        lastPageNumber = await fetchLastPageNumber('torrents', extraParams);

        const currentPageElement = document.querySelector('span.pagercurrent b');
        if (currentPageElement) {
            currentPage = parseInt(currentPageElement.textContent);
        } else {
            currentPage = 1;
        }
        console.log('Torrents Mode - Current Page:', currentPage);

        // Find the torrent table
        const torrentTable = document.querySelector('table#torrents_list_p tbody');
        if (!torrentTable) {
            console.log('Torrents table not found');
            return false;
        }

        // Find the parent container to add controls
        const tableParent = document.querySelector('table#torrents_list_p').parentElement;

        // Create status and control elements
        const controlsHTML = `
            <div id="status-container"></div>
            <div id="status-controls">
                <button id="resume-btn" class="control-btn resume" title="استئناف التحميل">▶ استئناف</button>
                <div id="page-indicator"></div>
                <button id="stop-btn" class="control-btn stop" title="إيقاف التحميل">❚❚ إيقاف</button>
            </div>
        `;

        tableParent.insertAdjacentHTML('beforeend', controlsHTML);

        gridContainer = torrentTable; // We'll append rows directly to tbody
        statusContainer = document.getElementById('status-container');
        pageIndicator = document.getElementById('page-indicator');
        stopBtn = document.getElementById('stop-btn');
        resumeBtn = document.getElementById('resume-btn');

        updateControlsUI();
        setupControlButtons();
        setupScrollListener('torrents', extraParams);

        return true;
    }

    // --- Main Initialize ---
    async function initialize() {
        // Try listing pages first
        if (await initializeListing()) {
            console.log('ArabP2P Enhancer: Listing mode activated');
            return;
        }

        // Try torrents page
        if (await initializeTorrents()) {
            console.log('ArabP2P Enhancer: Torrents mode activated');
            return;
        }

        console.log('ArabP2P Enhancer: No compatible page detected');
    }

    initialize();
})();
