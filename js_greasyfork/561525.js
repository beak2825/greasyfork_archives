// ==UserScript==
// @name         MAL Perfect History Syncer (Optimized)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Syncs Start/End dates. Aligns perfectly next to Unknown Date. RAM Optimized.
// @author       You
// @license      MIT
// @match        https://myanimelist.net/ownlist/anime/*/edit*
// @match        https://myanimelist.net/animelist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561525/MAL%20Perfect%20History%20Syncer%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561525/MAL%20Perfect%20History%20Syncer%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- HELPER FUNCTIONS ---

    function extractDate(text) {
        const dateRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
        const match = text.match(dateRegex);
        if (match) {
            return {
                month: parseInt(match[1], 10),
                day: parseInt(match[2], 10),
                year: parseInt(match[3], 10)
            };
        }
        return null;
    }

    function setDropdowns(type, dateObj) {
        if (!dateObj) return;
        const prefix = `add_anime_${type}_date`;
        const monthSelect = document.getElementById(`${prefix}_month`);
        const daySelect = document.getElementById(`${prefix}_day`);
        const yearSelect = document.getElementById(`${prefix}_year`);

        if (monthSelect && daySelect && yearSelect) {
            monthSelect.value = dateObj.month;
            daySelect.value = dateObj.day;
            yearSelect.value = dateObj.year;
        }
    }

    async function handleSyncClick(btn) {
        const originalIcon = btn.innerHTML;
        btn.style.opacity = "0.4";
        btn.style.cursor = "wait";

        const animeIdInput = document.getElementById('anime_id');
        if (!animeIdInput) return;

        const animeId = animeIdInput.value;
        const historyUrl = `/ajaxtb.php?detailedaid=${animeId}`;

        try {
            const response = await fetch(historyUrl);
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            const rows = doc.querySelectorAll('.spaceit_pad');
            if (rows.length === 0) {
                alert("No history found.");
                resetBtn(btn, originalIcon);
                return;
            }

            const newestText = rows[0].innerText;
            const oldestText = rows[rows.length - 1].innerText;

            const endDate = extractDate(newestText);
            const startDate = extractDate(oldestText);

            setDropdowns('start', startDate);
            setDropdowns('finish', endDate);

            btn.innerHTML = '&#10003;';
            btn.style.color = '#41a200';
            btn.style.opacity = "1";

            setTimeout(() => {
                resetBtn(btn, '&#10227;');
            }, 2000);

        } catch (error) {
            console.error(error);
            btn.innerHTML = '&#10007;';
            btn.style.color = 'red';
        }
    }

    function resetBtn(btn, icon) {
        btn.innerHTML = icon;
        btn.style.color = '#787878';
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
    }

    // --- UI INJECTION ---

    function createButton(idSuffix) {
        const btn = document.createElement('span');
        btn.id = `sync-btn-${idSuffix}`;
        btn.innerHTML = '&#10227;';
        btn.title = "Sync from History";
        btn.style.cursor = "pointer";
        btn.style.display = "inline-block";
        btn.style.marginRight = "8px";
        btn.style.marginLeft = "5px";
        btn.style.fontSize = "14px";
        btn.style.color = "#787878";
        btn.style.verticalAlign = "baseline";
        btn.style.lineHeight = "1";
        btn.onmouseover = () => { btn.style.color = "#1d439b"; };
        btn.onmouseout = () => {
            if(btn.innerHTML.charCodeAt(0) === 10227) btn.style.color = "#787878";
        };
        btn.onclick = () => handleSyncClick(btn);

        return btn;
    }

    function injectButtons() {
        if (document.getElementById('sync-btn-start')) return;

        const unknownStart = document.getElementById('unknown_start');
        if (unknownStart) {
            const btnStart = createButton('start');
            unknownStart.parentNode.parentNode.insertBefore(btnStart, unknownStart.parentNode);
        }

        const unknownEnd = document.getElementById('unknown_end');
        if (unknownEnd && !document.getElementById('sync-btn-end')) {
            const btnEnd = createButton('end');
            unknownEnd.parentNode.parentNode.insertBefore(btnEnd, unknownEnd.parentNode);
        }
    }

    // --- OPTIMIZED OBSERVER ---

    const observer = new MutationObserver(function(mutations) {
        let shouldInject = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.id === 'dialog' || node.querySelector('#dialog') || node.querySelector('#unknown_start')) {
                            shouldInject = true;
                            break;
                        }
                    }
                }
            }
            if (shouldInject) break;
        }

        if (shouldInject) {
            injectButtons();
        }
    });

    injectButtons();

    observer.observe(document.body, { childList: true, subtree: true });

})();