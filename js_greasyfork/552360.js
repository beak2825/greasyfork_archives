// ==UserScript==
// @name         Torn — Random Level 1 Finder
// @namespace    https://www.torn.com/
// @version      1.7
// @description  Opens a random level 1 profile (not in hospital, jail, or federal jail)
// @match        *://*.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552360/Torn%20%E2%80%94%20Random%20Level%201%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/552360/Torn%20%E2%80%94%20Random%20Level%201%20Finder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY_STORAGE = 'torn_random_api_key_v1';
    const CONFIG_STORAGE = 'torn_random_config_v1';

    function getApiKey() { return GM_getValue(API_KEY_STORAGE, null); }
    function setApiKey(k) { GM_setValue(API_KEY_STORAGE, k); }

    function getConfig() {
        const def = { maxId: 3972564, maxAttempts: 60, delayMs: 350 };
        try { return Object.assign(def, JSON.parse(GM_getValue(CONFIG_STORAGE, JSON.stringify(def)))); }
        catch { return def; }
    }
    function setConfig(cfg) { GM_setValue(CONFIG_STORAGE, JSON.stringify(cfg)); }

    GM_registerMenuCommand('Set Torn API Key', () => {
        const cur = getApiKey() || '';
        const k = prompt('Enter your Torn API key (16 chars):', cur);
        if (k !== null) setApiKey(k.trim());
    });

    GM_registerMenuCommand('Configure Finder', () => {
        const cfg = getConfig();
        const maxId = parseInt(prompt('Max user ID to sample (default ' + cfg.maxId + '):', cfg.maxId)) || cfg.maxId;
        const maxAttempts = parseInt(prompt('Max attempts per click (default ' + cfg.maxAttempts + '):', cfg.maxAttempts)) || cfg.maxAttempts;
        const delayMs = parseInt(prompt('Delay between API calls in ms (default ' + cfg.delayMs + '):', cfg.delayMs)) || cfg.delayMs;
        setConfig({ maxId, maxAttempts, delayMs });
        alert('Configuration saved.');
    });

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function apiGetUser(id, apiKey) {
        return new Promise((resolve, reject) => {
            const url = `https://api.torn.com/user/${id}?selections=profile&key=${encodeURIComponent(apiKey)}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: res => {
                    try { resolve(JSON.parse(res.responseText)); }
                    catch (e) { reject(e); }
                },
                onerror: err => reject(err)
            });
        });
    }

    async function findRandomLevel1() {
        let apiKey = getApiKey();
        if (!apiKey) {
            const want = confirm('No Torn API key found. Would you like to enter it now?');
            if (!want) return;
            const k = prompt('Enter your Torn API key:');
            if (!k) return alert('API key required.');
            setApiKey(k.trim());
            apiKey = getApiKey();
        }

        const cfg = getConfig();

        for (let attempt = 1; attempt <= cfg.maxAttempts; attempt++) {
            const id = Math.floor(Math.random() * cfg.maxId) + 1;
            console.log(`Attempt ${attempt}/${cfg.maxAttempts} — sampling ID ${id}`);

            try {
                const info = await apiGetUser(id, apiKey);

                if (info && info.error) {
                    if (info.error.error === "Incorrect ID") {
                        console.log(`Skipped invalid ID ${id}`);
                        continue;
                    } else {
                        alert(`❌ API Error: ${info.error.error || JSON.stringify(info.error)}`);
                        return;
                    }
                }

                const level = (typeof info.level !== 'undefined') ? Number(info.level)
                              : (info.profile && typeof info.profile.level !== 'undefined') ? Number(info.profile.level)
                              : null;

                let statusText = '';
                if (info.profile && info.profile.status) {
                    if (typeof info.profile.status === 'string') statusText = info.profile.status;
                    else if (info.profile.status.state) statusText = info.profile.status.state;
                    else statusText = JSON.stringify(info.profile.status);
                } else if (info.status) {
                    statusText = (typeof info.status === 'string') ? info.status : JSON.stringify(info.status);
                }

                const blockedStatuses = /hospital|jail|federal jail/i;
                const inBlockedState = blockedStatuses.test(String(statusText || ''));

                if (level === 1 && !inBlockedState) {
                    console.log('Found match — opening profile', id);
                    window.open(`https://www.torn.com/profiles.php?XID=${id}`, '_blank', 'noopener');
                    return;
                }

            } catch (e) {
                console.warn('Request error for ID', id, e);
            }

            await sleep(cfg.delayMs);
        }

        alert(`No matching Level 1 profile found after ${cfg.maxAttempts} attempts. Try increasing attempts or maxId in the userscript menu.`);
    }

    // Single button above "Home" in navigation
    function createNavButton() {
        if (document.getElementById('nav-random-l1')) return;

        const homeNavItem = document.querySelector('#nav-home');
        if (!homeNavItem) return;

        const btn = document.createElement('a');
        btn.id = 'nav-random-l1';
        btn.href = '#';
        btn.textContent = '🎯 Random LVL1';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.height = '40px';
        btn.style.margin = '5px 0';
        btn.style.padding = '0 10px';
        btn.style.borderRadius = '6px';
        btn.style.backgroundColor = '#007bff';
        btn.style.color = 'white';
        btn.style.textDecoration = 'none';
        btn.style.fontFamily = 'inherit';
        btn.style.fontSize = '14px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background 0.2s';

        btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#0056b3');
        btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#007bff');

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await findRandomLevel1();
        });

        homeNavItem.parentNode.insertBefore(btn, homeNavItem);
    }

    // Try to insert button until it appears (for dynamic Torn UI)
    window.addEventListener('load', () => {
        let tries = 0;
        const maxTries = 10;

        const tryInit = () => {
            createNavButton();
            tries++;
            if (!document.getElementById('nav-random-l1') && tries < maxTries) {
                setTimeout(tryInit, 1000);
            }
        };

        tryInit();
    });

})();
