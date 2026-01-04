// ==UserScript==
// @name        PH Mobile Ultimate (Landscape Grid 2-Col Fixed + Max Width) v6.1
// @namespace   http://tampermonkey.net/
// @version     6.1
// @description Optimizes mobile landscape: Force 2-Column Grid Edge-to-Edge. Removes side margins.
// @author      You
// @match       *://*.pornhub.com/*
// @match       *://*.pornhubpremium.com/*
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/559273/PH%20Mobile%20Ultimate%20%28Landscape%20Grid%202-Col%20Fixed%20%2B%20Max%20Width%29%20v61.user.js
// @updateURL https://update.greasyfork.org/scripts/559273/PH%20Mobile%20Ultimate%20%28Landscape%20Grid%202-Col%20Fixed%20%2B%20Max%20Width%29%20v61.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- PART 1: CSS OPTIMIZATIONS ---
    const css = `
        /* A. HEADERS & TABS - SCROLL AWAY */
        header, #header, .header-container, .top-container, #headerMenuContainer {
            position: absolute !important;
            top: 0 !important;
            width: 100%;
            z-index: 900;
        }

        .videosFiltersWrapper, .relatedSearchTermsWrapper, .stickyTooltipWrapper,
        .abovePlayerButtonsWrapper, .ctasActionMenuWrap, .abovePlayerButtons,
        .ctasActionMenu, .tabFilterWrapper, #tabFilters {
            position: relative !important;
            top: auto !important;
            bottom: auto !important;
            z-index: 850;
            width: 100%;
            display: block !important;
        }

        ul.tabs, .tabs-container { position: static !important; z-index: 10; }

        .js-filterMenu, .filtersMenu, .expandableDrawer, .js-drawer-scrollable {
            position: fixed !important;
            z-index: 99999 !important;
        }

        .videoFiltersBtnsWrap, .videosSortingOptions {
            position: sticky !important;
            bottom: 0 !important;
            z-index: 100 !important;
        }

        body { padding-top: 110px !important; }

        /* B. LANDSCAPE GRID - 2 COLUMNS FULL WIDTH */
        @media screen and (orientation: landscape) {
            
            /* 1. NUCLEAR CONTAINER EXPANSION */
            /* Force every major layout element to span the full screen width */
            html, body, 
            #mobileContainer, 
            .container, 
            .wrapper, 
            .main-container, 
            .section-content, 
            div[class*="wrapper"], 
            div[class*="container"] {
                width: 100% !important;
                max-width: 100vw !important;
                min-width: 100vw !important;
                margin: 0 !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                left: 0 !important;
                right: 0 !important;
                overflow-x: hidden !important; 
            }

            /* 2. GRID LAYOUT - MAXIMIZED */
            ul.videoList, 
            ul#relatedVideos, 
            ul#recommendedVideos,
            .section-content > ul {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                /* Reduced gap slightly to maximize thumbnail size */
                gap: 8px !important; 
                width: 100vw !important; /* Force list to touch edges */
                margin: 0 !important;
                padding: 4px !important; /* Minimal padding */
                box-sizing: border-box !important;
                float: none !important;
                border: none !important;
            }

            /* 3. GRID ITEMS */
            ul.videoList > li,
            ul#relatedVideos > li,
            ul#recommendedVideos > li,
            .section-content > ul > li {
                width: 100% !important; /* Fill the grid cell */
                max-width: none !important;
                float: none !important;
                margin: 0 !important;
                background: transparent !important;
                border: none !important;
                display: flex !important;
                flex-direction: column !important;
                min-width: 0 !important;
            }

            /* 4. FORCE IMAGE TO FILL CELL */
            ul.videoList > li .videoWrapper,
            ul#relatedVideos > li .videoWrapper,
            ul#recommendedVideos > li .videoWrapper,
            ul.videoList > li img {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                aspect-ratio: 16/9 !important;
                object-fit: cover;
                margin: 0 !important;
            }

            /* 5. FORCE ADS TO SPAN FULL WIDTH */
            li.js-nativeTjMob, li[class*="ad-"], li.ad-tabSplit {
                grid-column: 1 / -1 !important;
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
                margin-bottom: 15px !important;
            }

            /* 6. CLEANUP ELEMENTS */
            ul.videoList::before, ul.videoList::after,
            #relatedVideos::before, #relatedVideos::after,
            .underThumb::before, .underThumb::after {
                content: none !important;
                display: none !important;
            }
            
            .underThumb {
                width: 100% !important;
                display: block !important;
                float: none !important;
            }

            #viewMoreWrap {
                grid-column: 1 / -1 !important;
                width: 100% !important;
            }
        }
    `;
    GM_addStyle(css);

    // --- PART 2: JS ENFORCER ---
    function forceLandscapeWidth() {
        if (window.innerWidth > window.innerHeight) { 
            // Added more selectors to catch stubborn wrappers
            const containers = document.querySelectorAll(
                '#mobileContainer, .container, .wrapper, .main-container, .section-content, ul.videoList, #relatedVideos'
            );
            containers.forEach(el => {
                // Remove hardcoded pixel widths and margins
                if (el.style.width || el.style.maxWidth) {
                    el.style.width = '100vw';
                    el.style.maxWidth = '100vw';
                    el.style.marginLeft = '0';
                    el.style.marginRight = '0';
                }
            });
        }
    }

    setInterval(forceLandscapeWidth, 500);

    // --- PART 3: 4-CATEGORY BYPASS LOGIC ---
    const MAX_CATS = 4;

    function handleCategoryClick(e) {
        const item = e.target.closest('li[data-value]');
        if (!item) return;
        const parentUl = item.closest('ul');
        if (!parentUl || parentUl.classList.contains('js-production')) return;

        setTimeout(() => {
            const isActive = item.classList.contains('active');
            const allActive = parentUl.querySelectorAll('li.active').length;

            if (!isActive && allActive < MAX_CATS) {
                item.classList.add('active');
                const chk = item.querySelector('input[type="checkbox"]');
                if (chk) chk.checked = true;

                const btn = document.getElementById('saveFiltersBtn');
                if (btn) btn.innerHTML = `Show Custom (${allActive + 1} Cats)`;
            }
        }, 50);
    }

    function hijackSubmitButton() {
        const btn = document.getElementById('saveFiltersBtn');
        if (!btn || btn.dataset.hijacked === "true") return;

        const newBtn = btn.cloneNode(true);
        newBtn.dataset.hijacked = "true";
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const activeItems = document.querySelectorAll('.videoFilterOptions li.active');
            const catIds = [];
            let prodVal = '';

            activeItems.forEach(el => {
                const val = el.getAttribute('data-value');
                const filterType = el.getAttribute('data-filter');
                if (filterType === 'p' || el.closest('.js-production')) {
                    prodVal = val;
                } else if (val) {
                    catIds.push(val);
                }
            });

            const params = new URLSearchParams();
            if (catIds.length > 0) params.set('c', catIds.join(','));
            if (prodVal) params.set('p', prodVal);

            const currentParams = new URLSearchParams(window.location.search);
            if (currentParams.has('o')) params.set('o', currentParams.get('o'));

            window.location.href = '/video?' + params.toString();
        });
    }

    document.addEventListener('click', function(e) {
        handleCategoryClick(e);
        if (e.target.closest('.js-filter-toggle') || e.target.closest('.videoBrowseFilters')) {
            setTimeout(hijackSubmitButton, 500);
        }
    }, true);

})();