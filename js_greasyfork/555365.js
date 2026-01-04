// ==UserScript==
// @name         Torn Missions Indicator
// @namespace    https://github.com/Silverdark/TornScripts
// @version      2025-11-09.1
// @description  Adds a status icon when configured number of missions are pending
// @author       Silverdark [3503183]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      api.torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555365/Torn%20Missions%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/555365/Torn%20Missions%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration

    const desktopApiKey = ''; // Set with minimal API key on desktop
    const showIconOnMissionsPending = 3;
    const dataCacheExpirationMinutes = 3 * 60; // 3 hours

    // Configuration end - DO NOT TOUCH

    const apiKey = desktopApiKey === '' ? '###PDA-APIKEY###' : desktopApiKey;
    const dataKey_Missions = 'missionData';
    const supportedDataVersion = "1.0";

    init();

    // Helper functions

    async function init() {
        if (apiKey === '' || apiKey.startsWith('###')) {
            console.error('No API key for mission update found - exit');
            return;
        }

        const missonsData = await getMissionsData();
        const missionsPending = countMissionsPending(missonsData);

        if (missionsPending >= showIconOnMissionsPending) {
            addPendingMissionsIcon();
        }
    }

    async function getMissionsData() {
        // Read data from storage
        let data = await GM.getValue(dataKey_Missions, null);
        if (data && data.version !== supportedDataVersion) {
            await GM.deleteValue(dataKey_Missions);
            data = null;
        }

        // Load data, if required
        const currentTimestamp = new Date().getTime();
        if (!data || currentTimestamp > data.lastUpdate + dataCacheExpirationMinutes * 60 * 1000) {
            console.debug('Mission data cache update required');
            await GM.deleteValue(dataKey_Missions);

            const missionsData = await fetchMissionsData();

            data = {
                version: supportedDataVersion,
                lastUpdate: currentTimestamp,
                response: missionsData
            };

            await GM.setValue(dataKey_Missions, data);
        }

        return data.response;
    }

    async function fetchMissionsData() {
        const missionUrl = `https://api.torn.com/v2/user/missions?comment=MissionCheck&key=${apiKey}`;
        const response = await gmFetch(missionUrl, 'GET');
        return JSON.parse(response.responseText);
    }

    function countMissionsPending(data) {
        let count = 0;

        for (const giver of data.missions.givers) {
            for (const contract of giver.contracts) {
                if (contract.status === "Available" || contract.status === "Accepted") {
                    count++;
                }
            }
        }

        return count;
    }

    function addPendingMissionsIcon() {
        const statusContainer = document.querySelector('ul[class*="status-icons"]');

        if (!statusContainer) return;

        const icon = createPendingMissionsIcon();
        statusContainer.appendChild(icon);
    }

    function createPendingMissionsIcon() {
        const listItem = document.createElement('li');
        listItem.classList.add('custom-mission-icon');
        listItem.innerHTML = `
            <a href="/loader.php?sid=missions">
                <svg xmlns="http://www.w3.org/2000/svg" stroke="transparent" stroke-width="0" width="17" height="17" viewBox="0 .5 16 14.5"><path d="M4,7.67a2.66,2.66,0,0,0,5.18.84l1.49-.86v0a4,4,0,1,1-4-4,3.91,3.91,0,0,1,2,.53l-1.47.85a2.94,2.94,0,0,0-.51,0A2.68,2.68,0,0,0,4,7.67M6.67,6.33A1.34,1.34,0,1,0,8,7.67H8l2.24-1.3a3,3,0,0,1,2.47.1L16,4.55l-2.11-1L14,1.09,10.71,3A3.07,3.07,0,0,1,9.58,5.2L7.32,6.51a1.29,1.29,0,0,0-.65-.18m6.64,1.91A1.42,1.42,0,0,0,12,7.61v.06a5.36,5.36,0,1,1-2.64-4.6,1.79,1.79,0,0,0,.1-1.45A6.55,6.55,0,0,0,6.67,1,6.66,6.66,0,0,0,2.22,12.63l-.87,2.7a.26.26,0,0,0,.43.26l2-1.92a6.66,6.66,0,0,0,5.78,0l2,1.92a.25.25,0,0,0,.42-.26l-.87-2.7a6.65,6.65,0,0,0,2.2-4.39"></path></svg>
            </a>
        `;

        return listItem;
    }

    function gmFetch(url, method, headers = {}, data = '') {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: headers,
                data: data,
                onload: resolve,
                onerror: reject,
            })
        })
    }

    GM_addStyle(`
        .custom-mission-icon {
            background-image: none !important;
        }
        .custom-mission-icon svg {
            fill: url(#sidebar_svg_gradient_regular_mobile_active);
            filter: drop-shadow(0 0 1px rgba(255, 255, 255, .5019607843));
        }
    `);

})();
