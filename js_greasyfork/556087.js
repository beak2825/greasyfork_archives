// ==UserScript==
// @name         Kleinanzeigen_01_Navigation Upgrade (Stable V4.5 Sort Fix)
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Entfernt Pro-Ads & Werbung. Sortiert Pros nach oben. Dashboard inkl.
// @author       moritz & Gemini Architect
// @match        https://www.kleinanzeigen.de/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556087/Kleinanzeigen_01_Navigation%20Upgrade%20%28Stable%20V45%20Sort%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556087/Kleinanzeigen_01_Navigation%20Upgrade%20%28Stable%20V45%20Sort%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Startseite ignorieren
    if (window.location.pathname === '/' || window.location.pathname === '') {
        return;
    }

    // =================================================================
    // KONFIGURATION
    // =================================================================
    const CONFIG = {
        btnHeight: '38px',
        btnWidth: '200px',
        colorHex: '#5932ad',       // Standard-Lila (Dunkel)
        colorHexHover: '#7f5bc4',  // Helleres Lila für Hover
        colorRgb: '89, 50, 173',
        ghostOpacity: '0.2'
    };

    const log = (msg) => console.log(`[KA-Upgrade]: ${msg}`);

    // =================================================================
    // TEIL 0: Gedächtnis
    // =================================================================
    const storageKey = 'ka_show_pros_state';
    const savedState = localStorage.getItem(storageKey) === 'true';

    if (savedState) {
        document.documentElement.classList.add('ka-show-pro');
    }

    // =================================================================
    // TEIL 1: CSS (Smart Hover Design)
    // =================================================================
    const cssStyles = `
        /* 1. Müllabfuhr (Basierend auf DOM-Report IDs) */
        .j-liberty-wrapper, #brws_banner-supersize, #btf-billboard,
        #viewad-sidebar-banner, .site-base--left-banner, .site-base--right-banner,
        #srpb-sky-btf-left, #srpb-middle, #srpb-sky-atf-right, #srpb-btf-billboard {
            display: none !important;
        }

        /* 2. Listen-Logik */
        li.ad-listitem.ka-pro-hidden { display: none !important; }

        html.ka-show-pro li.ad-listitem.ka-pro-hidden {
            display: list-item !important;
            border: none !important;
            margin-bottom: 10px !important;
            padding: 0 !important;
        }

        html.ka-show-pro li.ad-listitem.ka-pro-hidden article.aditem {
            opacity: 1 !important;
            background-color: rgba(${CONFIG.colorRgb}, ${CONFIG.ghostOpacity}) !important;
            border: 1px solid ${CONFIG.colorHex} !important;
            box-shadow: none !important;
            border-radius: 4px !important;
        }

        /* 3. Dashboard Layout */
        #ka-dashboard-container {
            margin: 0 0 15px 0;
            background: #fff;
            border: 1px solid #d5d5d5;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: "Martel Sans", sans-serif;
            border-radius: 4px;
        }

        #ka-dashboard-text {
            font-size: 14px;
            color: #333;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* Badge Style */
        .ka-dashboard-badge {
            background-color: ${CONFIG.colorHex};
            color: #fff;
            padding: 2px 6px;
            font-size: 11px;
            font-weight: bold;
            border-radius: 3px;
            line-height: 1;
            display: inline-block;
            flex-shrink: 0;
            transition: background-color 0.2s ease;
        }

        /* === BUTTON DESIGN === */
        #ka-dashboard-btn {
            position: relative;
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: ${CONFIG.btnWidth};
            height: ${CONFIG.btnHeight};
            padding: 0;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            border-radius: 999px;
            background-color: #ffffff !important;
            color: ${CONFIG.colorHex} !important;
            border: 2px solid ${CONFIG.colorHex} !important;
            transition: all 0.2s ease;
            user-select: none;
        }

        #ka-dashboard-btn > * { pointer-events: none; }
        #ka-dashboard-btn .ka-dashboard-badge { margin-right: 8px; }
        .ka-btn-label { min-width: 85px; text-align: left; }

        /* ZUSTAND 1: NICHT GEDRÜCKT (Profis sichtbar) */
        html.ka-show-pro #ka-dashboard-btn {
            box-shadow: 0 6px 14px rgba(0,0,0,0.25) !important;
            transform: translateY(0) !important;
        }
        html.ka-show-pro #ka-dashboard-btn:hover {
            background-color: #ffffff !important;
            border-color: ${CONFIG.colorHexHover} !important;
            color: ${CONFIG.colorHexHover} !important;
            box-shadow: 0 6px 14px rgba(0,0,0,0.25) !important;
        }
        html.ka-show-pro #ka-dashboard-btn:hover .ka-dashboard-badge {
            background-color: ${CONFIG.colorHexHover} !important;
        }

        /* ZUSTAND 2: GEDRÜCKT (Filter AN) */
        html:not(.ka-show-pro) #ka-dashboard-btn {
            background-color: #eeeeee !important;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.2) !important;
            transform: translateY(2px) !important; 
            border-color: #7c6eb0 !important;
            color: ${CONFIG.colorHex} !important;
        }
        html:not(.ka-show-pro) #ka-dashboard-btn .ka-dashboard-badge {
            opacity: 0.8;
            background-color: ${CONFIG.colorHex};
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(cssStyles));
    (document.head || document.documentElement).appendChild(styleElement);

    // =================================================================
    // TEIL 2: Logik (Aggressive Sorting Fix)
    // =================================================================
    let validAdsCount = 0;
    let proAdsCount = 0;
    let isProcessing = false;

    function cleanUp() {
        if (isProcessing) return;
        isProcessing = true;

        // 1. Banner Hard-Removal
        ['srpb-sky-btf-left', 'srpb-middle', 'srpb-btf-billboard'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // 2. Listen-Handling
        const listItems = document.querySelectorAll('li.ad-listitem');
        const resultList = document.getElementById('srchrslt-adtable');

        let currentValid = 0;
        let currentPro = 0;
        const proRows = [];

        listItems.forEach(li => {
            // Filler / Werbung filtern
            if (li.querySelector('div[id^="srpb-result-list"]') || 
                li.querySelector('.liberty-hide-unfilled') || 
                li.querySelector('div[id^="google_ads_iframe"]')) {
                li.remove();
                return;
            }

            const ad = li.querySelector('article.aditem');
            if (!ad) return;

            // TopAds entfernen
            const isTopBadge = ad.querySelector('.aditem-image--badges--badge-topad') !== null;
            const isTopClass = ad.classList.contains('is-topad');
            // Datum prüfen
            const dateBox = ad.querySelector('.aditem-main--top--right');
            const hasDate = dateBox && dateBox.innerText.trim().length > 0;

            if (!hasDate || isTopBadge || isTopClass) {
                li.remove();
                return;
            }

            // PRO Erkennung
            const isProBadge = ad.querySelector('.badge-hint-pro-small-srp') !== null;
            const isProLink = ad.querySelector('a[href^="/pro/"]') !== null;

            if (isProBadge || isProLink) {
                li.classList.add('ka-pro-hidden');
                currentPro++;
                proRows.push(li);
            } else {
                li.classList.remove('ka-pro-hidden');
            }
            currentValid++;
        });

        // 3. Pro-Ads neu sortieren (AGRESSIV NACH OBEN)
        if (resultList && proRows.length > 0) {
            // Wir sammeln alle Pro-Elemente in einem Fragment und setzen sie an den Anfang.
            // Das "prepend" verschiebt sie automatisch von ihrer alten Position an die neue.
            const fragment = document.createDocumentFragment();
            proRows.forEach(row => fragment.appendChild(row));
            resultList.prepend(fragment);
        }

        if (currentValid !== validAdsCount || currentPro !== proAdsCount) {
            validAdsCount = currentValid;
            proAdsCount = currentPro;
            // Nur loggen wenn sich was ändert, spart Spam
            // log(`Update: ${currentValid} Anzeigen, davon ${currentPro} Profi.`);
            updateDashboard();
        }

        setTimeout(() => { isProcessing = false; }, 50);
    }

    // =================================================================
    // TEIL 3: Dashboard
    // =================================================================
    function initDashboard() {
        const targetHeader = document.querySelector('.srp-header');
        if (!targetHeader) return;

        if (!document.getElementById('ka-dashboard-container')) {
            const dashboard = document.createElement('div');
            dashboard.id = 'ka-dashboard-container';
            dashboard.innerHTML = `
                <span id="ka-dashboard-text">Lade Daten...</span>
                <button id="ka-dashboard-btn">
                    <span class="ka-dashboard-badge">PRO</span>
                    <span class="ka-btn-label">initialisieren</span>
                </button>
            `;
            
            targetHeader.parentNode.insertBefore(dashboard, targetHeader.nextSibling);

            document.getElementById('ka-dashboard-btn').addEventListener('click', () => {
                const html = document.documentElement;
                const isActive = html.classList.toggle('ka-show-pro');
                localStorage.setItem(storageKey, isActive);
                updateDashboard();
            });
        }
        updateDashboard();
    }

    function updateDashboard() {
        const textSpan = document.getElementById('ka-dashboard-text');
        const btn = document.getElementById('ka-dashboard-btn');
        if (!textSpan || !btn) return;

        const isShowingPro = document.documentElement.classList.contains('ka-show-pro');
        const badgeHtml = `<span class="ka-dashboard-badge">PRO</span>`;

        if (isShowingPro) {
            textSpan.innerHTML = `${validAdsCount} Anzeigen davon ${proAdsCount} ${badgeHtml}`;
            btn.innerHTML = `${badgeHtml} <span class="ka-btn-label">ausblenden</span>`;
        } else {
            if (proAdsCount > 0) {
                textSpan.innerHTML = `${validAdsCount} Anzeigen davon ${proAdsCount} ${badgeHtml} ausgeblendet`;
                btn.innerHTML = `${badgeHtml} <span class="ka-btn-label">anzeigen</span>`;
            } else {
                textSpan.innerHTML = `${validAdsCount} Anzeigen (Keine ${badgeHtml} gefunden)`;
                btn.innerHTML = `${badgeHtml} <span class="ka-btn-label">anzeigen</span>`;
            }
        }
    }

    // =================================================================
    // TEIL 4: Init
    // =================================================================
    window.addEventListener('DOMContentLoaded', () => {
        const observer = new MutationObserver(() => {
            requestAnimationFrame(() => {
                cleanUp();
                initDashboard();
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // Navigation
    document.addEventListener('keydown', function(e) {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
        
        if (e.key === 'ArrowLeft' || e.key === 'a') clickNav('.pagination-prev');
        else if (e.key === 'ArrowRight' || e.key === 'd') clickNav('.pagination-next');
    });

    function clickNav(selector) {
        const el = document.querySelector(selector);
        if (el) {
            if (el.href) el.click();
            else if (el.getAttribute('data-url')) window.location.href = el.getAttribute('data-url');
        }
    }

})();