// ==UserScript==
// @name         🃏 SHIFTY ITEM PICK
// @namespace    http://tampermonkey.net/
// @version      6.3
// @description  Crew Equipment and Special Crime Items only. Filters out Kingpin Inc., Thünderstrück Tools, 777 Tools, 555-Kingpin, and Duffel Bag visually. Tooltip styled in soft pink with Bahnschrift font and peach border. Fuzzy matching ensures accurate missing tool detection even with name variations or truncations. Celebratory message if nothing is missing.
// @author       chk
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items/306584711
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/CrimeEquipmentLoadout/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560868/%F0%9F%83%8F%20SHIFTY%20ITEM%20PICK.user.js
// @updateURL https://update.greasyfork.org/scripts/560868/%F0%9F%83%8F%20SHIFTY%20ITEM%20PICK.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const characterUrl = window.location.href;
    const isLoadoutPage = characterUrl.includes('CrimeEquipmentLoadout');

    const expectedTools = [
        "Baseball Bat", "Bolt Cutter", "Crowbar", "Dental Floss", "Drill", "Grappling Hook",
        "Lock Pick", "Police Radio Scanner", "Rope", "Rugged Laptop", "Silk Gloves", "Sledgehammer",
        "Stethoscope", "Surveillance System Console", "Tabi Boots", "Wire Cutters", "Recon Hotline Connection"
    ];

    const getCharacterName = () => {
        if (isLoadoutPage) {
            const titleEl = document.querySelector('h1');
            const crewName = titleEl ? titleEl.textContent.trim() : 'The Crew';
            return `${crewName} Loadout`;
        }
        const nameEl = document.querySelector('h2');
        return nameEl ? nameEl.textContent.trim() : 'Unknown';
    };

    const isExcludedBrand = (brand) => /Kingpin Inc\.|Thünderstrück Tools|Excelsior Tools|777 Tools|555-Kingpin/i.test(brand);
    // This only excludes Duffel Bag, as "Recon Hotline Connection" is handled separately below
    const isExcludedItem = (name) => /Duffel Bag/i.test(name);

    // ------------------------------------------
    // Extraction logic for Artist/CrimeEquipmentLoadout/* page
    // ------------------------------------------
    const extractItemsFromLoadout = (applyFilter) => {
        const items = [];
        const equipmentTds = document.querySelectorAll('table.data tr.odd td:last-child, table.data tr.even td:last-child');

        equipmentTds.forEach(td => {
            const itemLinks = td.querySelectorAll('a[href*="ItemDetails"]');

            itemLinks.forEach(link => {
                const name = link.textContent.trim();
                const itemLineText = link.nextSibling ? link.nextSibling.textContent.trim() : '';

                if (applyFilter) {
                    // *** NEW EXCLUSION: Hide "Recon Hotline Connection" from the displayed list on Loadout page ***
                    if (name === "Recon Hotline Connection") return;

                    const brandMatch = itemLineText.match(/^\(([^)]+)\)/);
                    const brand = brandMatch ? brandMatch[1].trim() : '';

                    if (!isExcludedBrand(brand) && !isExcludedItem(name)) {
                        items.push(name);
                    }
                } else if (!isExcludedItem(name)) {
                    // Extract all non-Duffel Bag items for fuzzy matching purposes (including Kingpin brand items and Recon Hotline)
                    items.push(name);
                }
            });
        });

        return items;
    };

    // ------------------------------------------
    // Original extraction logic for Character/Items/* page
    // ------------------------------------------
    const extractItemsFromCharacterPage = (applyFilter) => {
        const items = [];
        let currentSection = '';
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            if (row.classList.contains('group')) {
                const label = Array.from(row.querySelectorAll('td'))
                    .map(td => td.textContent.trim())
                    .find(text => text.length > 0);
                currentSection = /^(Crew Equipment|Special Crime Items)$/i.test(label) ? label : '';
                return;
            }

            if (currentSection && row.classList.contains('hoverable')) {
                const tds = row.querySelectorAll('td.middle');
                const itemTd = tds.length === 2 ? tds[1] : tds[0];
                if (!itemTd) return;
                const nameEl = itemTd.querySelector('a[href*="ItemDetails"]');
                if (!nameEl) return;
                const name = nameEl.textContent.trim();

                // On Character page, 'Recon Hotline Connection' is never explicitly excluded.

                if (applyFilter) {
                    const brandEls = itemTd.querySelectorAll('div.cText_Light em');
                    if (!brandEls.length) return;
                    const brand = Array.from(brandEls).map(el => el.textContent.trim()).find(b => b);

                    if (brand && !isExcludedBrand(brand) && !isExcludedItem(name)) {
                        items.push(name);
                    }
                } else if (!isExcludedItem(name)) {
                    items.push(name);
                }
            }
        });

        return items;
    };

    // Unified functions to call the correct extractor
    const extractAllItems = () => {
        return isLoadoutPage ? extractItemsFromLoadout(false) : extractItemsFromCharacterPage(false);
    };

    const extractFilteredItems = () => {
        return isLoadoutPage ? extractItemsFromLoadout(true) : extractItemsFromCharacterPage(true);
    };

    // ------------------------------------------
    // Missing Tools Logic
    // ------------------------------------------
    const getMissingTools = (foundItems, expectedToolsList) => {
        const normalized = foundItems.map(name => name.toLowerCase());
        return expectedToolsList.filter(tool => {
            const toolLower = tool.toLowerCase();
            // Fuzzy match: check if any found item name includes the expected tool name (or vice-versa, for safety)
            return !normalized.some(found => found.includes(toolLower) || toolLower.includes(found));
        });
    };

    const daysUntilNextMonday = () => {
        const today = new Date();
        const day = today.getDay();
        return (8 - day) % 7 || 7;
    };

    // ------------------------------------------
    // Button and Styling Logic
    // ------------------------------------------
    const createButton = () => {
        if (document.querySelector('.gear-button')) return;

        const button = document.createElement('div');
        button.textContent = '🃏';
        button.title = 'Show Gear';
        button.className = 'gear-button';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            const existing = document.querySelector('.cute-tooltip');
            if (existing) {
                existing.remove();
                return;
            }

            const allItems = extractAllItems();
            const gearItems = extractFilteredItems();

            // *** NEW: Filter expected tools list if on Loadout page (to stop flagging it as missing) ***
            let toolsToCheck = expectedTools;
            if (isLoadoutPage) {
                toolsToCheck = expectedTools.filter(tool => tool !== "Recon Hotline Connection");
            }

            const missingItems = getMissingTools(allItems, toolsToCheck);

            const tooltip = document.createElement('div');
            tooltip.className = 'cute-tooltip';

            const characterName = getCharacterName();
            const headerLink = document.createElement('a');
            headerLink.href = characterUrl;
            headerLink.textContent = `${characterName}`;
            headerLink.target = '_blank';
            headerLink.className = 'tooltip-header';
            tooltip.appendChild(headerLink);

            if (!gearItems.length && !missingItems.length) {
                const message = document.createElement('div');
                message.textContent = `Congrats, you catched them all! Or they catched you!`;
                tooltip.appendChild(message);
                document.body.appendChild(tooltip);
                return;
            }

            if (gearItems.length) {
                const list = document.createElement('div');
                list.textContent = `• ${gearItems.join('\n• ')}`;
                tooltip.appendChild(list);
            }

            if (missingItems.length) {
                const missingList = document.createElement('div');
                missingList.style.marginTop = '12px';
                missingList.innerHTML = `<strong>🩻 Missing tools:</strong>\n• ${missingItems.join('\n• ')}`;
                tooltip.appendChild(missingList);
            }

            const countdown = document.createElement('div');
            countdown.className = 'shifty-note';
            countdown.textContent = `Shifty Underground: New items in ${daysUntilNextMonday()} day(s)`;
            tooltip.appendChild(countdown);

            document.body.appendChild(tooltip);
        });
    };

    const style = document.createElement('style');
    style.textContent = `
        .gear-button {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;

            background: #ed333e;
            border: 2px solid #ff5727;
            border-radius: 50%;
            font-size: 25px;
            text-align: center;
            line-height: 50px;
            color: #ffffff;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
        }
        .cute-tooltip {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #f6e4e4;
            border: 2px solid #d18b8b;
            padding: 16px;
            font-family: "Bahnschrift", sans-serif !important;
            font-size: 12px;
            color: #833d49;
            border-radius: 12px;
            box-shadow: 0 0 12px rgba(100, 100, 100, 0.3);
            white-space: pre-line;
            z-index: 9999;
            max-width: 300px;
        }
        .tooltip-header {
            font-size: 13px;
            font-weight: bold;
            color: #833d49;
            text-decoration: none;
            margin-bottom: 8px;
            display: block;
        }
        .tooltip-header:hover {
            text-decoration: underline;
        }
        .shifty-note {
            margin-top: 12px;
            font-size: 11px;
            color: #833d49;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);

    const waitForItems = () => {
        const selector = isLoadoutPage ? 'table.data' : 'td.middle';
        const observer = new MutationObserver((mutations, obs) => {
            const hasItems = document.querySelector(selector);
            if (hasItems) {
                obs.disconnect();
                createButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    waitForItems();
})();