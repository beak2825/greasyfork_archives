// ==UserScript==
// @name         Torn Item Market Bonus Search
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a button next to item name to search the item market for that item and its specific bonuses.
// @license      MIT License
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/factions.php*
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
            stroke: #0077b5; /* Torn blueish hover */
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
        // Select broadly to catch standard inventory, faction armoury, and react lists
        const selectors = '.item-info-wrap, .info-cont, .item-info, [class*="itemInfo_"], li.item-info-active, li';
        const containers = document.querySelectorAll(selectors);
        
        containers.forEach((itemInfoContainer) => {
            if (itemInfoContainer.classList.contains('wai-btn')) return;
            // Check if we already injected into this specific container
            if (itemInfoContainer.querySelector(`.${BUTTON_CLASS}`)) return;

            let itemName = '';
            let injectTarget = null;

            // --- 1. Identify Name & Injection Target ---
            // We want to inject EXACTLY where the name is found to keep it inline.

            // Priority A: Standard Inventory (.name-wrap)
            // It usually has a child .name
            const nameWrap = itemInfoContainer.querySelector('.name-wrap');
            if (nameWrap) {
                // If there's a .name inner element, prefer appending to wrapper (usually safer for alignment)
                // If not, append to nameWrap itself
                injectTarget = nameWrap;
                const nameEl = nameWrap.querySelector('.name');
                itemName = nameEl ? nameEl.innerText.trim() : nameWrap.innerText.trim();
            }

            // Priority B: Faction Armoury / Lists (.name.bold.t-overflow)
            // This element holds the text directly. We inject INSIDE it.
            if (!injectTarget) {
                const armouryName = itemInfoContainer.querySelector('.name.bold.t-overflow');
                if (armouryName) {
                    injectTarget = armouryName;
                    itemName = armouryName.innerText.trim();
                }
            }

            // Priority C: Ancestor Check (React / Fallback)
            if (!injectTarget && itemInfoContainer.parentElement) {
                const parentNameWrap = itemInfoContainer.parentElement.querySelector('.name-wrap');
                if (parentNameWrap) {
                    injectTarget = parentNameWrap;
                    const nameEl = parentNameWrap.querySelector('.name');
                    itemName = nameEl ? nameEl.innerText.trim() : parentNameWrap.innerText.trim();
                }
            }

            // Fallback: Generic Title
            if (!injectTarget) {
                const titleEl = itemInfoContainer.querySelector('.title, h4');
                if (titleEl) {
                    injectTarget = titleEl;
                    itemName = titleEl.innerText.trim();
                }
            }

            // Cleanup Name
            if (itemName) {
                itemName = itemName.replace(/x\d+$/, '').trim();
            }

            // --- 2. Extract Item ID ---
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

            if (!itemName && !itemId) return;
            if (!itemName) itemName = 'Item';


            // --- 3. Extract Bonuses ---
            const foundBonuses = [];
            // Look for bonuses in the container and its parent (to handle different DOM layouts)
            const scopes = [itemInfoContainer, itemInfoContainer.parentElement].filter(Boolean);
            
            for (const scope of scopes) {
                 const icons = Array.from(scope.querySelectorAll('i[class*="bonus-attachment-"]'));
                 if (icons.length > 0) {
                     icons.forEach(icon => {
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
                     break; // Stop after finding the first set of bonuses
                 }
            }
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

            // Stop click propagation to prevent opening the item details when clicking the search icon
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // --- 5. Inject into identified Target ---
            if (injectTarget && !injectTarget.querySelector(`.${BUTTON_CLASS}`)) {
                injectTarget.appendChild(link);
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