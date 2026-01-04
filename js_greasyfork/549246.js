// ==UserScript==
// @name         VNDB Character Count
// @namespace    https://vndb.org/
// @version      1.1
// @description  Fetch and display character count, difficulty, and more from jiten.moe API on VNDB pages
// @author       Sirus
// @match        https://vndb.org/v*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.jiten.moe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549246/VNDB%20Character%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/549246/VNDB%20Character%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    const DEFAULT_SETTINGS = {
        readingSpeed: 14000,
        showPlaytime: true,
        showDifficulty: false,
        showUniqueWords: false,
        showUniqueKanji: false
    };

    // Load settings
    function getSettings() {
        return {
            readingSpeed: GM_getValue('readingSpeed', DEFAULT_SETTINGS.readingSpeed),
            showPlaytime: GM_getValue('showPlaytime', DEFAULT_SETTINGS.showPlaytime),
            showDifficulty: GM_getValue('showDifficulty', DEFAULT_SETTINGS.showDifficulty),
            showUniqueWords: GM_getValue('showUniqueWords', DEFAULT_SETTINGS.showUniqueWords),
            showUniqueKanji: GM_getValue('showUniqueKanji', DEFAULT_SETTINGS.showUniqueKanji)
        };
    }

    // Save a setting
    function saveSetting(key, value) {
        GM_setValue(key, value);
    }

    // Extract VN ID
    const pathMatch = window.location.pathname.match(/\/(v\d+)/);
    if (!pathMatch) return;
    const vnId = pathMatch[1];

    // Helper to fetch JSON with GM_xmlhttpRequest (CORS-safe)
    function fetchJson(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: res => {
                    try {
                        resolve(JSON.parse(res.responseText));
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    // Format numbers with commas
    function formatNumber(num) {
        return num.toLocaleString();
    }

    // Format hours to readable time
    function formatTime(hours) {
        if (hours < 1) {
            const minutes = Math.round(hours * 60);
            return `${minutes}m`;
        }
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    }

    // Create and inject styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .jiten-settings-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 2px 6px;
                opacity: 0.6;
                font-size: 12px;
                vertical-align: middle;
                margin-left: 8px;
            }
            .jiten-settings-btn:hover {
                opacity: 1;
            }
            .jiten-popup {
                position: absolute;
                background: #1a1a1a;
                border: 1px solid #444;
                border-radius: 6px;
                padding: 12px 16px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                min-width: 220px;
                font-size: 13px;
                color: #ccc;
            }
            .jiten-popup h4 {
                margin: 0 0 12px 0;
                padding-bottom: 8px;
                border-bottom: 1px solid #444;
                font-size: 14px;
                color: #fff;
            }
            .jiten-popup-row {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            .jiten-popup-row:last-child {
                margin-bottom: 0;
            }
            .jiten-popup-row label {
                flex: 1;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            .jiten-popup-row input[type="checkbox"] {
                margin-right: 8px;
                cursor: pointer;
            }
            .jiten-popup-row input[type="number"] {
                width: 80px;
                padding: 4px 6px;
                border: 1px solid #444;
                border-radius: 4px;
                background: #2a2a2a;
                color: #fff;
                text-align: right;
            }
            .jiten-popup-row .label-text {
                margin-right: 8px;
            }
            .jiten-popup-row .unit {
                margin-left: 6px;
                color: #888;
                font-size: 12px;
            }
            .jiten-tooltip {
                cursor: help;
                border-bottom: 1px dotted #888;
            }
            .jiten-value-cell {
                display: inline-flex;
                align-items: center;
            }
        `;
        document.head.appendChild(style);
    }

    // Main function
    async function main() {
        try {
            injectStyles();
            let settings = getSettings();

            // Get IDs linked to this VN
            const idsResp = await fetchJson(`https://api.jiten.moe/api/media-deck/by-link-id/2/${vnId}`);
            if (!Array.isArray(idsResp) || idsResp.length === 0) return;

            let characterCounts = [];
            let difficulties = [];
            let uniqueWordCounts = [];
            let uniqueKanjiCounts = [];

            // Fetch each detail
            for (const id of idsResp) {
                const detailResp = await fetchJson(`https://api.jiten.moe/api/media-deck/${id}/detail`);
                if (detailResp?.data?.mainDeck) {
                    const deck = detailResp.data.mainDeck;
                    characterCounts.push(deck.characterCount);
                    difficulties.push(deck.difficultyRaw);
                    uniqueWordCounts.push(deck.uniqueWordCount);
                    uniqueKanjiCounts.push(deck.uniqueKanjiCount);
                }
            }

            if (characterCounts.length === 0) return;

            // Format values - use / separator for multiple releases
            const charCountStr = characterCounts.length > 1
                ? characterCounts.map(formatNumber).join(" / ")
                : formatNumber(characterCounts[0]);

            const wordCountStr = uniqueWordCounts.length > 1
                ? uniqueWordCounts.map(formatNumber).join(" / ")
                : formatNumber(uniqueWordCounts[0]);

            const kanjiCountStr = uniqueKanjiCounts.length > 1
                ? uniqueKanjiCounts.map(formatNumber).join(" / ")
                : formatNumber(uniqueKanjiCounts[0]);

            const difficultyStr = difficulties.length > 1
                ? difficulties.map(d => `${d.toFixed(1)}/5`).join(" / ")
                : `${difficulties[0].toFixed(1)}/5`;

            // For playtime calculation, use the first release's character count
            const primaryCharCount = characterCounts[0];

            // Locate the Play time row
            const playTimeRow = [...document.querySelectorAll("tr")]
                .find(tr => tr.querySelector("td")?.innerText.trim() === "Play time");

            if (!playTimeRow) return;
            const table = playTimeRow.parentElement;

            // Track inserted rows for updates
            let insertedRows = {};
            let popup = null;

            // Function to calculate and format playtime
            function getPlaytimeStr() {
                const hours = primaryCharCount / settings.readingSpeed;
                return formatTime(hours);
            }

            // Function to get playtime string for multiple releases
            function getPlaytimeDisplay() {
                if (characterCounts.length > 1) {
                    return characterCounts.map(cc => {
                        const hours = cc / settings.readingSpeed;
                        return formatTime(hours);
                    }).join(" / ");
                }
                return getPlaytimeStr();
            }

            // Function to render/update rows
            function renderRows() {
                // Remove existing custom rows
                Object.values(insertedRows).forEach(row => row?.remove());
                insertedRows = {};

                let lastRow = document.getElementById('jiten-charcount-row');

                // Your Playtime row
                if (settings.showPlaytime) {
                    const ptRow = document.createElement("tr");
                    ptRow.id = 'jiten-playtime-row';
                    ptRow.innerHTML = `
                        <td>
                            <span class="jiten-tooltip" title="Estimated based on ${formatNumber(settings.readingSpeed)} characters/hour reading speed. Adjust in settings (gear icon).">
                                Playtime (est.)
                            </span>
                        </td>
                        <td>${getPlaytimeDisplay()}</td>
                    `;
                    table.insertBefore(ptRow, lastRow.nextSibling);
                    insertedRows.playtime = ptRow;
                    lastRow = ptRow;
                }

                // Difficulty row
                if (settings.showDifficulty) {
                    const diffRow = document.createElement("tr");
                    diffRow.id = 'jiten-difficulty-row';
                    diffRow.innerHTML = `<td>Difficulty</td><td>${difficultyStr}</td>`;
                    table.insertBefore(diffRow, lastRow.nextSibling);
                    insertedRows.difficulty = diffRow;
                    lastRow = diffRow;
                }

                // Unique words row
                if (settings.showUniqueWords) {
                    const wordRow = document.createElement("tr");
                    wordRow.id = 'jiten-words-row';
                    wordRow.innerHTML = `<td>Unique Words</td><td>${wordCountStr}</td>`;
                    table.insertBefore(wordRow, lastRow.nextSibling);
                    insertedRows.words = wordRow;
                    lastRow = wordRow;
                }

                // Unique kanji row
                if (settings.showUniqueKanji) {
                    const kanjiRow = document.createElement("tr");
                    kanjiRow.id = 'jiten-kanji-row';
                    kanjiRow.innerHTML = `<td>Unique Kanji</td><td>${kanjiCountStr}</td>`;
                    table.insertBefore(kanjiRow, lastRow.nextSibling);
                    insertedRows.kanji = kanjiRow;
                    lastRow = kanjiRow;
                }
            }

            // Create popup element
            function createPopup() {
                const popupEl = document.createElement('div');
                popupEl.className = 'jiten-popup';
                popupEl.id = 'jiten-settings-popup';

                popupEl.innerHTML = `
                    <h4>Jiten Settings</h4>
                    <div class="jiten-popup-row">
                        <span class="label-text">Reading speed</span>
                        <input type="number" id="jiten-reading-speed" value="${settings.readingSpeed}" min="1000" max="50000" step="500">
                        <span class="unit">ch/h</span>
                    </div>
                    <div class="jiten-popup-row">
                        <label>
                            <input type="checkbox" id="jiten-show-playtime" ${settings.showPlaytime ? 'checked' : ''}>
                            Show Your Playtime
                        </label>
                    </div>
                    <div class="jiten-popup-row">
                        <label>
                            <input type="checkbox" id="jiten-show-difficulty" ${settings.showDifficulty ? 'checked' : ''}>
                            Show Difficulty
                        </label>
                    </div>
                    <div class="jiten-popup-row">
                        <label>
                            <input type="checkbox" id="jiten-show-words" ${settings.showUniqueWords ? 'checked' : ''}>
                            Show Unique Words
                        </label>
                    </div>
                    <div class="jiten-popup-row">
                        <label>
                            <input type="checkbox" id="jiten-show-kanji" ${settings.showUniqueKanji ? 'checked' : ''}>
                            Show Unique Kanji
                        </label>
                    </div>
                `;

                return popupEl;
            }

            // Insert main Character count row with gear button in the value cell
            const ccRow = document.createElement("tr");
            ccRow.id = 'jiten-charcount-row';
            ccRow.innerHTML = `
                <td>
                    <a href="https://jiten.moe/decks/media/${idsResp[0]}/detail" target="_blank">Char. count</a>
                </td>
                <td>
                    <span class="jiten-value-cell">
                        ${charCountStr}
                        <button class="jiten-settings-btn" id="jiten-settings-btn" title="Jiten Settings">⚙️</button>
                    </span>
                </td>
            `;
            table.insertBefore(ccRow, playTimeRow.nextSibling);

            // Settings button click handler
            const settingsBtn = document.getElementById('jiten-settings-btn');

            settingsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Check if popup already exists
                const existingPopup = document.getElementById('jiten-settings-popup');
                if (existingPopup) {
                    existingPopup.remove();
                    popup = null;
                    return;
                }

                popup = createPopup();
                document.body.appendChild(popup);

                // Position popup to the right of the button
                const rect = settingsBtn.getBoundingClientRect();
                popup.style.top = (rect.top + window.scrollY - 10) + 'px';
                popup.style.left = (rect.right + window.scrollX + 10) + 'px';

                // Attach event listeners after popup is in DOM
                const speedInput = document.getElementById('jiten-reading-speed');
                speedInput.addEventListener('input', function() {
                    const val = parseInt(this.value) || DEFAULT_SETTINGS.readingSpeed;
                    settings.readingSpeed = val;
                    saveSetting('readingSpeed', val);
                    renderRows();
                });

                document.getElementById('jiten-show-playtime').addEventListener('change', function() {
                    settings.showPlaytime = this.checked;
                    saveSetting('showPlaytime', this.checked);
                    renderRows();
                });

                document.getElementById('jiten-show-difficulty').addEventListener('change', function() {
                    settings.showDifficulty = this.checked;
                    saveSetting('showDifficulty', this.checked);
                    renderRows();
                });

                document.getElementById('jiten-show-words').addEventListener('change', function() {
                    settings.showUniqueWords = this.checked;
                    saveSetting('showUniqueWords', this.checked);
                    renderRows();
                });

                document.getElementById('jiten-show-kanji').addEventListener('change', function() {
                    settings.showUniqueKanji = this.checked;
                    saveSetting('showUniqueKanji', this.checked);
                    renderRows();
                });
            });

            // Close popup when clicking outside
            document.addEventListener('click', function(e) {
                const existingPopup = document.getElementById('jiten-settings-popup');
                if (existingPopup && !existingPopup.contains(e.target) && e.target.id !== 'jiten-settings-btn') {
                    existingPopup.remove();
                    popup = null;
                }
            });

            // Initial render
            renderRows();

        } catch (err) {
            console.error("VNDB userscript error:", err);
        }
    }

    main();
})();