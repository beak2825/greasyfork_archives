// ==UserScript==
// @name         Torn Item Market Bonus Search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button next to item name to search the item market for that item and its specific bonuses.
// @license      MIT License
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561195/Torn%20Item%20Market%20Bonus%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/561195/Torn%20Item%20Market%20Bonus%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_CLASS = 'tmbs-search-icon';

    // Inject CSS for the icon style
    const style = document.createElement('style');
    style.innerHTML = `
        /* Icon Style */
        .${BUTTON_CLASS} {
            display: inline-block;
            margin-left: 8px;
            vertical-align: middle;
            line-height: 0;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
        }
        .${BUTTON_CLASS}:hover {
            opacity: 1;
        }
        .${BUTTON_CLASS} svg {
            width: 14px;
            height: 14px;
            stroke: #999; /* Grey color */
        }
        .${BUTTON_CLASS}:hover svg {
            stroke: #0077b5; /* Optional hover color (Torn blueish) or keep grey */
            stroke: #666;
        }
    `;
    document.head.appendChild(style);
    
    // Static Bonus ID List
    const BONUS_IDS = {
        "achilles": 50, "any bonuses": 2, "assassinate": 72, "backstab": 52, "berserk": 54, "bleed": 57,
        "blindfire": 33, "blindside": 51, "bloodlust": 85, "bonus filter off": 0, "burn": 30, "comeback": 67,
        "conserve": 55, "cripple": 45, "crusher": 49, "cupid": 47, "deadeye": 63, "deadly": 62,
        "demoralize": 36, "disarm": 86, "double bonuses": 1, "double tap": 105, "double-edged": 74,
        "empower": 87, "eviscerate": 56, "evicerate": 56, "execute": 75, "expose": 1, "finale": 82, "focus": 79,
        "freeze": 38, "frenzy": 80, "fury": 64, "grace": 53, "hazardous": 34, "home run": 83,
        "irradiate": 102, "lacerate": 89, "motivation": 61, "paralyze": 59, "parry": 84, "penetrate": 101,
        "plunder": 21, "poison": 32, "powerful": 68, "proficience": 14, "puncture": 66, "quicken": 88,
        "rage": 65, "revitalize": 41, "roshambo": 43, "shock": 120, "slow": 44, "smash": 104,
        "smurf": 73, "specialist": 71, "spray": 35, "stricken": 20, "stun": 58, "suppress": 60,
        "sure shot": 78, "throttle": 48, "toxin": 103, "warlord": 81, "weaken": 46, "wind-up": 76, "wither": 42
    };

    function injectSearchButton() {
        const selectors = '.item-info-wrap, .info-cont, .item-info, [class*="itemInfo_"], li.item-info-active, li';
        // We select broadly (LI) to catch items even if closed
        const containers = document.querySelectorAll(selectors);
        
        containers.forEach((itemInfoContainer) => {
            if (itemInfoContainer.classList.contains('wai-btn')) return;
            
            // Check if we already injected into this specific container or its header
            if (itemInfoContainer.querySelector(`.${BUTTON_CLASS}`)) return;

            // --- 1. Extract Item ID ---
            let itemId = '';
            const actionDiv = itemInfoContainer.querySelector('[itemid]');
            if (actionDiv) itemId = actionDiv.getAttribute('itemid');
            if (!itemId) {
                if (itemInfoContainer.getAttribute('data-item')) itemId = itemInfoContainer.getAttribute('data-item');
                else {
                    const parentLi = itemInfoContainer.closest('li[data-item]');
                    if (parentLi) itemId = parentLi.getAttribute('data-item');
                }
            }
            if (!itemId) { 
                const findIdInScope = (scope) => {
                    if (!scope) return null;
                    const idRegex = /\/items\/(\d+)/; 
                    const img = scope.querySelector('img[src*="/images/items/"]');
                    if (img) {
                        const match = img.src.match(idRegex);
                        if (match) return match[1];
                    }
                    const divWithBg = scope.querySelector('div[style*="/images/items/"]');
                    if (divWithBg) {
                        const match = divWithBg.style.backgroundImage.match(idRegex);
                        if (match) return match[1];
                    }
                    return null;
                };
                itemId = findIdInScope(itemInfoContainer) || 
                         findIdInScope(itemInfoContainer.parentElement) || 
                         (itemInfoContainer.parentElement ? findIdInScope(itemInfoContainer.parentElement.parentElement) : null);
            }

            // --- 2. Extract Item Name ---
            // Look for name-wrap specifically as that's where we want to inject
            let nameWrap = itemInfoContainer.querySelector('.name-wrap');
            if (!nameWrap && itemInfoContainer.parentElement) nameWrap = itemInfoContainer.parentElement.querySelector('.name-wrap');
            
            let itemName = '';
            if (nameWrap) {
                const nameEl = nameWrap.querySelector('.name');
                if (nameEl) itemName = nameEl.innerText.trim();
                else itemName = nameWrap.innerText.trim(); // Fallback
            } else {
                // Fallback for React views
                const rawEl = itemInfoContainer.querySelector('.name-wrap .name, [class*="nameWrap_"] .name, h4');
                if (rawEl) {
                    itemName = rawEl.innerText.trim();
                    // Try to find the wrapper again if we found the name element
                    if (rawEl.parentElement) nameWrap = rawEl.parentElement;
                }
            }

            // Clean up name (remove quantity x1 etc)
            if (itemName) {
                itemName = itemName.replace(/x\d+$/, '').trim();
            }

            if (!itemName && !itemId) return;
            if (!itemName) itemName = 'Item';

            // --- 3. Extract Bonuses ---
            const foundBonuses = [];
            // Look deeply for bonuses, even if hidden
            const ancestors = [itemInfoContainer, itemInfoContainer.parentElement].filter(Boolean);
            let allIcons = [];
            for (const scope of ancestors) {
                 const icons = Array.from(scope.querySelectorAll('i[class*="bonus-attachment-"]'));
                 if (icons.length > 0) { allIcons = icons; break; }
            }
            allIcons.forEach(icon => {
                let matchFound = false;
                const cls = Array.from(icon.classList).find(c => c.startsWith('bonus-attachment-'));
                if (cls) {
                    const slug = cls.replace('bonus-attachment-', '').toLowerCase();
                    if (BONUS_IDS.hasOwnProperty(slug)) { foundBonuses.push(BONUS_IDS[slug]); matchFound = true; }
                }
                if (!matchFound && icon.title) {
                    const titleMatch = icon.title.match(/<b>(.*?)<\/b>/i) || [null, icon.title];
                    const cleanTitle = (titleMatch[1] || icon.title).toLowerCase().trim();
                    if (BONUS_IDS.hasOwnProperty(cleanTitle)) foundBonuses.push(BONUS_IDS[cleanTitle]);
                }
            });
            const uniqueBonusIds = [...new Set(foundBonuses)];

            // --- 4. Create Icon Button ---
            const link = document.createElement('a');
            link.className = BUTTON_CLASS;
            link.title = `Search Market for ${itemName} ${uniqueBonusIds.length ? 'with bonuses' : ''}`;
            
            // Magnifying Glass SVG
            link.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            `;

            let targetUrl = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search`;
            if (itemId) targetUrl += `&itemID=${itemId}`;
            else targetUrl += `&searchname=${encodeURIComponent(itemName)}`;
            targetUrl += `&sortField=price&sortOrder=ASC`;
            uniqueBonusIds.forEach((id, index) => { targetUrl += `&bonuses[${index}]=${id}`; });

            link.href = targetUrl;

            // Stop click propagation to prevent item description toggle
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // --- 5. Inject into Header (.name-wrap) ---
            if (nameWrap) {
                // Ensure we don't inject multiple times in the same header (since we iterate LIs and containers)
                if (!nameWrap.querySelector(`.${BUTTON_CLASS}`)) {
                    nameWrap.appendChild(link);
                }
            } else {
                // Last resort fallback (React views might not have .name-wrap structured the same)
                // Appending to the title container
                const titleEl = itemInfoContainer.querySelector('.title');
                if (titleEl && !titleEl.querySelector(`.${BUTTON_CLASS}`)) {
                    titleEl.appendChild(link);
                }
            }
        });
    }

    // --- INIT ---

    const observer = new MutationObserver((mutations) => {
        let shouldInject = false;
        for (const m of mutations) {
            if (m.addedNodes.length > 0) { shouldInject = true; break; }
        }
        if (shouldInject) injectSearchButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial run
    setTimeout(injectSearchButton, 500);

})();