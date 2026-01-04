// ==UserScript==
// @name         Torn Mug Checker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Test
// @author       Titanic_
// @match        https://www.torn.com/profiles.php?XID=*
// @connect      api.torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/551846/Torn%20Mug%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/551846/Torn%20Mug%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY_STORAGE = 'TORN_MUG_CHECKER_API_KEY';
    const TWENTY_FOUR_HOURS_IN_SECONDS = 24 * 60 * 60;
    const MUG_LOG_ID = 8155;

    function formatRelativeTime(seconds) {
        if (seconds < 60) return 'just now';

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

        const hours = Math.floor(seconds / 3600);
        if (hours < 2) return 'about an hour ago';

        return `${hours} hours ago`;
    }

    async function getApiKey() {
        let apiKey = await GM_getValue(API_KEY_STORAGE, null);
        if (!apiKey) {
            apiKey = prompt("Please enter a Full Acess API key for the Mug Checker");
            if (apiKey && apiKey.trim() !== '') {
                await GM_setValue(API_KEY_STORAGE, apiKey.trim());
            } else {
                alert("API key is required for the script to work.");
                return null;
            }
        }
        return apiKey;
    }

    function getPlayerIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('XID');
    }

    function showWarning(timeSinceMug, amountMugged) {
        const relativeTime = formatRelativeTime(timeSinceMug);

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
        overlay.style.zIndex = '99999';
        overlay.style.pointerEvents = 'none';

        const warningText = document.createElement('div');
        warningText.textContent = `MUGGED $${amountMugged.toLocaleString('en-US')} | ${relativeTime}`;
        warningText.style.position = 'fixed';
        warningText.style.top = '20px';
        warningText.style.left = '50%';
        warningText.style.transform = 'translateX(-50%)';
        warningText.style.padding = '15px 50px 15px 30px';
        warningText.style.backgroundColor = '#d32f2f';
        warningText.style.color = 'white';
        warningText.style.fontSize = '24px';
        warningText.style.border = '2px solid white';
        warningText.style.boxShadow = '0 0 15px black';
        warningText.style.zIndex = '100000';

        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '15px';
        closeButton.style.fontSize = '30px';
        closeButton.style.lineHeight = '1';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'white';

        closeButton.addEventListener('click', function () {
            overlay.remove();
            warningText.remove();
        });

        warningText.appendChild(closeButton);

        document.body.appendChild(overlay);
        document.body.appendChild(warningText);
    }

    function fetchAndCheckPage(apiUrl, apiKey, targetId) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: { 'Authorization': `ApiKey ${apiKey}` },
            onload: function (response) {
                if (response.status !== 200) {
                    console.error('Mug Checker: API request failed with status', response.status);
                    return;
                }

                const data = JSON.parse(response.responseText);

                if (data.error) {
                    alert(`Mug Checker Error: ${data.error.error}\nYour API key may be invalid or lacks permissions.`);
                    console.error('Mug Checker: API Error:', data.error);
                    return;
                }

                if (!data.log || data.log.length === 0) {
                    console.log(`Mug Checker: No mugs found for [${targetId}] in the last 24 hours.`);
                    return;
                }

                const now = Math.floor(Date.now() / 1000);
                let matchFound = false;

                for (const logEntry of data.log) {
                    if (logEntry.data && logEntry.data.defender == targetId) {
                        const timeSinceMug = now - logEntry.timestamp;
                        const moneyMugged = logEntry.data.money_mugged;

                        showWarning(timeSinceMug, moneyMugged);
                        matchFound = true;
                        console.log(`Mug Checker: Match found! Mugged [${targetId}] for $${moneyMugged} about ${Math.floor(timeSinceMug / 60)} minutes ago.`);
                        break;
                    }
                }

                if (!matchFound && data._metadata && data._metadata.links && data._metadata.links.prev) {
                    console.log("Mug Checker: No match on this page, fetching next page of logs...");
                    fetchAndCheckPage(data._metadata.links.prev, apiKey, targetId);
                }
            },
            onerror: function (error) {
                console.error('Mug Checker: Network request to Torn API failed.', error);
            }
        });
    }

    async function run() {
        const targetPlayerId = getPlayerIdFromUrl();
        if (!targetPlayerId) return;

        const apiKey = await getApiKey();
        if (!apiKey) return;

        const fromTimestamp = Math.floor(Date.now() / 1000) - TWENTY_FOUR_HOURS_IN_SECONDS;
        const initialApiUrl = `https://api.torn.com/v2/user/log?log=${MUG_LOG_ID}&from=${fromTimestamp}&limit=100`;

        console.log(`Mug Checker: Checking for mugs on player [${targetPlayerId}] since timestamp ${fromTimestamp}`);
        fetchAndCheckPage(initialApiUrl, apiKey, targetPlayerId);
    }

    run();

})();