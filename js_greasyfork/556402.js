// ==UserScript==
// @name         Kleinanzeigen_02_Picture OnHover (Smart-Loader V4.1)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Strict $_86. Layout -400px. Smartes Laden: Sortiert Bilder von Oben nach Unten + Preconnect.
// @author       just bob & Refactor AI
// @match        https://www.kleinanzeigen.de/*
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556402/Kleinanzeigen_02_Picture%20OnHover%20%28Smart-Loader%20V41%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556402/Kleinanzeigen_02_Picture%20OnHover%20%28Smart-Loader%20V41%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🖼️ [KA OnHover V4.1] Gestartet - Smart Loading (Top-to-Bottom)');

    // --- 0. TURBO START (Preconnect) ---
    // Sagt dem Browser: "Verbinde dich schon mal mit dem Bilderserver!"
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://img.kleinanzeigen.de';
    (document.head || document.documentElement).appendChild(link);

    // --- KONFIGURATION ---
    const CONFIG = {
        candidates: [86, 57, 45, 32, 59, 35], 
        storageKey: 'ka_res_idx_strict_86_v4',
        defaultIdx: 86 // Strikt 86
    };

    let currentBestIdx = parseInt(localStorage.getItem(CONFIG.storageKey)) || CONFIG.defaultIdx;
    let isScanning = false;
    let previewImg = null;

    // --- 1. CSS: DEIN LAYOUT (-400px) ---
    const isSearchPage = window.location.pathname.startsWith('/s-');

    let styles = `
        /* 1. CONTAINER */
        #ka-profi-container {
            position: fixed;
            top: 50%;
            right: 2%;
            transform: translateY(-50%);
            width: 45vw; 
            height: 90vh;
            max-width: 1000px;
            max-height: 1000px;
            z-index: 2147483647;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            background: transparent;
        }

        /* 2. DAS BILD */
        #ka-profi-img {
            display: block;
            width: auto; height: auto;
            max-width: 100%; max-height: 100%;
            object-fit: contain;
            opacity: 0;
            transition: opacity 0.1s ease-out;
            filter: drop-shadow(0 0 25px rgba(0,0,0,0.5));
        }

        /* 3. INTERACTION FIX */
        .bg-blur, .aditem-image--badges, .aditem-image a::after {
            pointer-events: none !important;
        }

        /* 4. CLEANUP */
        #btf-billboard, .srp-skyscraper-btf, .flex-right { display: none !important; }
    `;

    if (isSearchPage) {
        styles += `
            /* DEIN LAYOUT-SHIFT */
            #site-content, #site-footer, .l-page-wrapper {
                 margin-left: -400px !important;
                 margin-right: auto !important;
                 float: none !important;
                 max-width: 1200px !important;
            }
        `;
    }
    
    // Style sofort injecten (run-at document-start)
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    (document.head || document.documentElement).appendChild(styleEl);

    // --- 2. DOM SETUP ---
    function setupDOM() {
        if (document.getElementById('ka-profi-container')) return;
        const c = document.createElement('div');
        c.id = 'ka-profi-container';
        previewImg = document.createElement('img');
        previewImg.id = 'ka-profi-img';
        c.appendChild(previewImg);
        // Warten bis Body da ist
        if(document.body) document.body.appendChild(c);
        else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(c));
    }

    // --- 3. URL LOGIK ---
    const getHighResUrl = (src, idx) => src.replace(/rule=\$_\d+\.[a-zA-Z]+/i, `rule=$_` + idx + `.AUTO`);

    function isValidProductImage(img) {
        const src = (img.getAttribute('src') || '').toLowerCase();
        return src.includes('kleinanzeigen.de') && 
               !src.includes('placeholder') && 
               !src.includes('fallback') &&
               !src.includes('static');
    }

    // --- 4. AUTO-REPAIR ---
    function testImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    async function findBestResolution(brokenUrl) {
        if (isScanning) return;
        isScanning = true;
        
        for (const idx of CONFIG.candidates) {
            if (idx === currentBestIdx) continue;
            const works = await testImage(getHighResUrl(brokenUrl, idx));
            
            if (works) {
                console.log(`✅ [KA] Fallback aktiv: Index ${idx}`);
                currentBestIdx = idx;
                localStorage.setItem(CONFIG.storageKey, idx);
                if (previewImg.dataset.origSrc) {
                     previewImg.src = getHighResUrl(previewImg.dataset.origSrc, idx);
                }
                break;
            }
        }
        isScanning = false;
    }

    // --- 5. SHOW / HIDE (Instant) ---
    
    // Preloader
    const viewportObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const hdUrl = getHighResUrl(img.src, currentBestIdx);
                
                // Preload in Cache
                const loader = new Image();
                loader.src = hdUrl;
                
                viewportObserver.unobserve(img);
            }
        });
    }, { rootMargin: "600px" }); // Etwas mehr Puffer für flüssiges Scrollen

    function showImage(thumbImg) {
        const hdUrl = getHighResUrl(thumbImg.src, currentBestIdx);
        
        // 1. SOFORT Thumbnail zeigen
        previewImg.src = thumbImg.src;
        previewImg.style.opacity = '1';
        previewImg.dataset.origSrc = thumbImg.src;

        // 2. HD nachladen
        const hdLoader = new Image();
        hdLoader.onload = function () {
            if (previewImg.dataset.origSrc === thumbImg.src) {
                previewImg.src = hdUrl;
            }
        };
        hdLoader.onerror = function () {
            findBestResolution(thumbImg.src);
        };
        hdLoader.src = hdUrl;
    }

    function hideImage() {
        previewImg.style.opacity = '0';
        setTimeout(() => {
            if (previewImg.style.opacity === '0') {
                previewImg.src = '';
                delete previewImg.dataset.origSrc;
            }
        }, 100);
    }

    // --- 6. INIT (Smart Sorting) ---
    function initItems() {
        const selectors = ['.imagebox', '.aditem-image', '.gallery-image'];
        // Wir holen ALLE Container
        let containers = Array.from(document.querySelectorAll(selectors.join(', ')));

        // SMART SORTING: Wir sortieren die Elemente nach ihrer Y-Position im Dokument.
        // Das stellt sicher, dass der Observer die oberen Bilder ZUERST registriert und lädt.
        containers.sort((a, b) => {
            const rectA = a.getBoundingClientRect().top;
            const rectB = b.getBoundingClientRect().top;
            return rectA - rectB;
        });

        containers.forEach(el => {
            if (el.dataset.kaBound) return;
            el.dataset.kaBound = "true";

            // Overlay Fix
            if (el.parentElement) el.parentElement.style.position = "relative";
            el.style.zIndex = "10";

            // Hover Events
            el.addEventListener('mouseenter', () => showImage(el.querySelector('img')));
            el.addEventListener('mouseleave', () => hideImage());

            // Preloader aktivieren (in der sortierten Reihenfolge)
            const img = el.querySelector('img');
            if (img && isValidProductImage(img)) viewportObserver.observe(img);
        });
    }

    // --- START ---
    setupDOM();

    // Observer für Nachladen (z.B. "Mehr laden" Button)
    const observer = new MutationObserver(() => requestAnimationFrame(initItems));

    // Sofort starten wenn möglich
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initItems();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    } else {
        initItems();
        if(document.body) observer.observe(document.body, { childList: true, subtree: true });
    }

})();