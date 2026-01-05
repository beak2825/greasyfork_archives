// ==UserScript==
// @name         🃏 SHIFTY ITEM PICK
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Crew Equipment and Special Crime Items only. Supports English & Turkish. Filters out Kingpin Inc., Thünderstrück Tools, 777 Tools, 555-Kingpin, and Duffel Bag visually.
// @author       anon
// @match        https://*.popmundo.com/World/Popmundo.aspx/Artist/CrimeEquipmentLoadout/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559367/%F0%9F%83%8F%20SHIFTY%20ITEM%20PICK.user.js
// @updateURL https://update.greasyfork.org/scripts/559367/%F0%9F%83%8F%20SHIFTY%20ITEM%20PICK.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const characterUrl = window.location.href;
    const isLoadoutPage = characterUrl.includes('CrimeEquipmentLoadout');

    // Mapped tool pairs for cross-language detection
    const toolPairs = [
        { en: "Baseball Bat", tr: "Beyzbol Sopası" },
        { en: "Bolt Cutter", tr: "Cıvata Kesici" },
        { en: "Crowbar", tr: "Levye" },
        { en: "Dental Floss", tr: "Diş İpi" },
        { en: "Drill", tr: "Matkap" },
        { en: "Grappling Hook", tr: "Tırmanma Kancası" },
        { en: "Lock Pick", tr: "Maymuncuk" },
        { en: "Police Radio Scanner", tr: "Polis Telsizi Tarayıcı" },
        { en: "Rope", tr: "Halat" },
        { en: "Rugged Laptop", tr: "Dayanıklı Dizüstü Bilgisayar" },
        { en: "Silk Gloves", tr: "İpek Eldiven" },
        { en: "Sledgehammer", tr: "Balyoz" },
        { en: "Stethoscope", tr: "Stetoskop" },
        { en: "Surveillance System Console", tr: "Gözetleme Sistemi Kontrol Paneli" },
        { en: "Tabi Boots", tr: "Ninja Çizmesi" },
        { en: "Wire Cutters", tr: "Tel Makası" },
        { en: "Recon Hotline Connection", tr: "Keşif Danışma Hattı Bağlantısı" }
    ];

    const getCharacterName = () => {
        if (isLoadoutPage) {
            const titleEl = document.querySelector('h1');
            const crewName = titleEl ? titleEl.textContent.trim() : 'The Crew';
            return `Kingpin Listesi:`;
        }
        const nameEl = document.querySelector('h2');
        return nameEl ? nameEl.textContent.trim() : 'Unknown';
    };

    const isExcludedBrand = (brand) => /Kingpin Inc\.|Thünderstrück Tools|Excelsior Tools|777 Tools|555-Kingpin/i.test(brand);
    const isExcludedItem = (name) => /Duffel Bag|Silindir Spor Çantası/i.test(name);

    const extractItemsFromLoadout = (applyFilter) => {
        const items = [];
        const equipmentTds = document.querySelectorAll('table.data tr.odd td:last-child, table.data tr.even td:last-child');

        equipmentTds.forEach(td => {
            const itemLinks = td.querySelectorAll('a[href*="ItemDetails"]');

            itemLinks.forEach(link => {
                const name = link.textContent.trim();
                const itemLineText = link.nextSibling ? link.nextSibling.textContent.trim() : '';

                if (applyFilter) {
                    if (name === "Recon Hotline Connection" || name === "Keşif Danışma Hattı Bağlantısı") return;

                    const brandMatch = itemLineText.match(/^\(([^)]+)\)/);
                    const brand = brandMatch ? brandMatch[1].trim() : '';

                    if (!isExcludedBrand(brand) && !isExcludedItem(name)) {
                        items.push(name);
                    }
                } else if (!isExcludedItem(name)) {
                    items.push(name);
                }
            });
        });

        return items;
    };

    const extractItemsFromCharacterPage = (applyFilter) => {
        const items = [];
        let currentSection = '';
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            if (row.classList.contains('group')) {
                const label = Array.from(row.querySelectorAll('td'))
                    .map(td => td.textContent.trim())
                    .find(text => text.length > 0);
                currentSection = /^(Crew Equipment|Special Crime Items|Ekip Ekipmanları|Özel Suç Eşyaları)$/i.test(label) ? label : '';
                return;
            }

            if (currentSection && row.classList.contains('hoverable')) {
                const tds = row.querySelectorAll('td.middle');
                const itemTd = tds.length === 2 ? tds[1] : tds[0];
                if (!itemTd) return;
                const nameEl = itemTd.querySelector('a[href*="ItemDetails"]');
                if (!nameEl) return;
                const name = nameEl.textContent.trim();

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

    const extractAllItems = () => {
        return isLoadoutPage ? extractItemsFromLoadout(false) : extractItemsFromCharacterPage(false);
    };

    const extractFilteredItems = () => {
        return isLoadoutPage ? extractItemsFromLoadout(true) : extractItemsFromCharacterPage(true);
    };

    const getMissingTools = (foundItems) => {
        const normalizedFound = foundItems.map(name => name.toLowerCase());
        const missing = [];

        toolPairs.forEach(pair => {
            const hasTool = normalizedFound.some(found =>
                found.includes(pair.en.toLowerCase()) ||
                found.includes(pair.tr.toLowerCase()) ||
                pair.en.toLowerCase().includes(found) ||
                pair.tr.toLowerCase().includes(found)
            );

            if (!hasTool) {
                missing.push(pair.tr); // Using Turkish name as requested
            }
        });
        return missing;
    };

    const daysUntilNextMonday = () => {
        const today = new Date();
        const day = today.getDay();
        return (8 - day) % 7 || 7;
    };

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

            const missingItems = getMissingTools(allItems);
            const finalMissing = isLoadoutPage
                ? missingItems.filter(item => item !== "Keşif Danışma Hattı Bağlantısı")
                : missingItems;

            const tooltip = document.createElement('div');
            tooltip.className = 'cute-tooltip';

            const characterName = getCharacterName();
            const headerLink = document.createElement('a');
            headerLink.href = characterUrl;
            headerLink.textContent = `${characterName}`;
            headerLink.target = '_blank';
            headerLink.className = 'tooltip-header';
            tooltip.appendChild(headerLink);

            if (!gearItems.length && !finalMissing.length) {
                const message = document.createElement('div');
                message.textContent = `Tebrikler, hepsini yakaladın!`;
                tooltip.appendChild(message);
                document.body.appendChild(tooltip);
                return;
            }

            if (gearItems.length) {
                const list = document.createElement('div');
                list.textContent = `• ${gearItems.join('\n• ')}`;
                tooltip.appendChild(list);
            }

            if (finalMissing.length) {
                const missingList = document.createElement('div');
                missingList.style.marginTop = '12px';
                missingList.style.marginBottom = '8px';
                missingList.innerHTML = `<strong>🩻 Eksik Eşyalar:</strong>\n\n• ${finalMissing.join('\n• ')}`;
                tooltip.appendChild(missingList);
            }



            const countdown = document.createElement('div');
            countdown.className = 'shifty-note';
            countdown.textContent = `Shifty Underground: Yeni ürünlere ${daysUntilNextMonday()} gün kaldı.`;
            tooltip.appendChild(countdown);

            document.body.appendChild(tooltip);
        });
    };

    const style = document.createElement('style');
    style.textContent = `
        .gear-button {
            position: fixed;
            bottom: 20px;
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
            bottom: 100px;
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
            max-width: 320px;
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