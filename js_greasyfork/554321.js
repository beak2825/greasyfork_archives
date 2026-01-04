// ==UserScript==
// @name         Torn — Larger Chain Timer + Random Lvl 1 Finder (Ctrl+Click) v1.5
// @namespace    [https://www.torn.com/](https://www.torn.com/)
// @version      1.62
// @description  Enlarges the chain timer and lets you Ctrl+Click it to find a random Level 1 target. Menu options: profile vs attack loader, new tab vs same tab.
// @author       Combined by ChatGPT (base scripts by Annosz & others)
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      api.torn.com
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554321/Torn%20%E2%80%94%20Larger%20Chain%20Timer%20%2B%20Random%20Lvl%201%20Finder%20%28Ctrl%2BClick%29%20v15.user.js
// @updateURL https://update.greasyfork.org/scripts/554321/Torn%20%E2%80%94%20Larger%20Chain%20Timer%20%2B%20Random%20Lvl%201%20Finder%20%28Ctrl%2BClick%29%20v15.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------- waitForKeyElements inline --------
    function waitForKeyElements(selector, callback, waitOnce = true, interval = 300) {
        const alreadyFound = new Set();
        const observer = new MutationObserver(() => {
            document.querySelectorAll(selector).forEach(el => {
                if (!alreadyFound.has(el)) {
                    alreadyFound.add(el);
                    callback(el);
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // also run initially in case elements already exist
        document.querySelectorAll(selector).forEach(el => {
            if (!alreadyFound.has(el)) {
                alreadyFound.add(el);
                callback(el);
            }
        });
    }

    // -------- storage keys & defaults --------
    const API_KEY_STORAGE = 'torn_random_api_key_v1';
    const CONFIG_STORAGE = 'torn_random_config_v1';
    const URL_MODE_STORAGE = 'torn_random_url_mode_v1';     // 'attack' or 'profile'
    const OPEN_MODE_STORAGE = 'torn_random_open_mode_v1';   // 'newtab' or 'sametab'
    const GLOW_DURATION_MS = 700;
    const BUTTON_VISIBILITY_STORAGE = 'torn_random_button_visible_v1'; // 'show' or 'hide'
    const DEFAULT_BUTTON_VISIBILITY = 'show';

    const DEFAULT_URL_MODE = 'attack';
    const DEFAULT_OPEN_MODE = 'newtab';

    function getApiKey() { return GM_getValue(API_KEY_STORAGE, null); }
    function setApiKey(k) { GM_setValue(API_KEY_STORAGE, k); }

    function getButtonVisibility() { return GM_getValue(BUTTON_VISIBILITY_STORAGE, DEFAULT_BUTTON_VISIBILITY); }
    function setButtonVisibility(v) { GM_setValue(BUTTON_VISIBILITY_STORAGE, v); }

    function getUrlMode() { return GM_getValue(URL_MODE_STORAGE, DEFAULT_URL_MODE); }
    function setUrlMode(m) { GM_setValue(URL_MODE_STORAGE, m); }
    function getOpenMode() { return GM_getValue(OPEN_MODE_STORAGE, DEFAULT_OPEN_MODE); }
    function setOpenMode(m) { GM_setValue(OPEN_MODE_STORAGE, m); }

    function getConfig() {
        const def = { maxId: 3972564, maxAttempts: 60, delayMs: 350 };
        try { return Object.assign(def, JSON.parse(GM_getValue(CONFIG_STORAGE, JSON.stringify(def)))); }
        catch { return def; }
    }
    function setConfig(cfg) { GM_setValue(CONFIG_STORAGE, JSON.stringify(cfg)); }

    // -------- menu commands --------
    GM_registerMenuCommand('Set Torn API Key', () => {
        const cur = getApiKey() || '';
        const k = prompt('Enter your Torn API key (16 chars):', cur);
        if (k !== null) setApiKey(k.trim());
    });

    GM_registerMenuCommand('Configure Finder (attempts/delay/maxId)', () => {
        const cfg = getConfig();
        const maxId = parseInt(prompt('Max user ID to sample (default ' + cfg.maxId + '):', cfg.maxId)) || cfg.maxId;
        const maxAttempts = parseInt(prompt('Max attempts per click (default ' + cfg.maxAttempts + '):', cfg.maxAttempts)) || cfg.maxAttempts;
        const delayMs = parseInt(prompt('Delay between API calls in ms (default ' + cfg.delayMs + '):', cfg.delayMs)) || cfg.delayMs;
        setConfig({ maxId, maxAttempts, delayMs });
        alert('Configuration saved.');
    });

    GM_registerMenuCommand('Set Target URL (profile / attack loader)', () => {
        const cur = getUrlMode();
        const choice = prompt(`Choose target URL mode (type exactly):\n- profile  -> profiles.php?XID=ID\n- attack   -> loader.php?sid=attack&user2ID=ID\n\nCurrent: ${cur}`, cur);
        if (choice === null) return;
        const normalized = choice.trim().toLowerCase();
        if (normalized === 'profile' || normalized === 'attack') {
            setUrlMode(normalized);
            alert('Saved. Now using: ' + (normalized === 'attack' ? 'attack loader' : 'profile'));
        } else {
            alert('Invalid choice. Enter "profile" or "attack".');
        }
    });

    GM_registerMenuCommand('Toggle Floating Button Visibility (show / hide) ', () => {
    const cur = getButtonVisibility();
    const choice = prompt(`Choose button visibility (type exactly):\n- show  -> display the button\n- hide  -> hide the button\n\nCurrent: ${cur}`, cur);
    if (choice === null) return;
    const normalized = choice.trim().toLowerCase();
    if (normalized === 'show' || normalized === 'hide') {
        setButtonVisibility(normalized);
        const btn = document.getElementById('torn-random-float-btn');
        if (btn) btn.style.display = (normalized === 'show') ? 'block' : 'none';
        alert('Saved. Please refresh page. Button is now: ' + normalized);
    } else {
        alert('Invalid choice. Enter "show" or "hide".');
    }
    });

    GM_registerMenuCommand('Set Open Mode (new tab / same tab)', () => {
        const cur = getOpenMode();
        const choice = prompt(`Choose how to open the target (type exactly):\n- newtab  -> opens in a new tab (GM_openInTab)\n- sametab -> opens in the current tab\n\nCurrent: ${cur}`, cur);
        if (choice === null) return;
        const normalized = choice.trim().toLowerCase();
        if (normalized === 'newtab' || normalized === 'sametab') {
            setOpenMode(normalized);
            alert('Saved. Now opening in: ' + (normalized === 'newtab' ? 'new tab' : 'same tab'));
        } else {
            alert('Invalid choice. Enter "newtab" or "sametab".');
        }
    });

    // -------- make sure glow CSS is available --------
    (function injectGlowStyles(){
        if (document.getElementById('torn-random-glow-styles')) return;
        const css = `
        @keyframes tornRandomPulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
          30% { box-shadow: 0 0 12px 6px rgba(255, 215, 0, 0.85); }
          100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
        }
        .torn-random-glow {
          animation: tornRandomPulse ${GLOW_DURATION_MS}ms ease-out;
          border-radius: 6px !important;
        }`;
        const s = document.createElement('style');
        s.id = 'torn-random-glow-styles';
        s.textContent = css;
        document.head.appendChild(s);
    })();

    // -------- API util --------
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

    // -------- open URL helpers --------
    function makeTargetUrl(id) {
        return getUrlMode() === 'profile'
            ? `https://www.torn.com/profiles.php?XID=${encodeURIComponent(id)}`
            : `https://www.torn.com/loader.php?sid=attack&user2ID=${encodeURIComponent(id)}`;
    }

    function openTargetUrl(url) {
        if (getOpenMode() === 'sametab') {
            window.location.href = url;
        } else {
            try { GM_openInTab(url, { active: true, insert: true }); }
            catch (e) { window.open(url, '_blank', 'noopener'); }
        }
    }

    // -------- Core: primary selector --------
    waitForKeyElements(".speed___dFP2B", primaryAction);

    function primaryAction(jNode) {
        try {
            const barStats = document.querySelector(".bar-stats___E_LqA") || document.querySelector("div[class*='bar-stats']");
            const timeLeft = document.querySelector(".bar-timeleft___B9RGV") || barStats?.querySelector("p[class*='bar-timeleft']") || null;
            const speed = document.querySelector(".speed___dFP2B") || null;
            const tickList = document.querySelector(".tick-list___McObN") || null;

            if (!barStats || !timeLeft) {
                const alt = Array.from(document.querySelectorAll("div[class*='bar-stats'], div.bar-stats"))
                                .find(n => n && n.textContent && n.textContent.includes("Chain:"));
                if (alt) attachToTimer(alt);
                return;
            }
            attachToTimer(barStats, timeLeft, speed, tickList);
        } catch (err) {
            console.error("[Torn Random Finder] primaryAction error:", err);
        }
    }

    waitForKeyElements("div[class*='bar-stats'], div.bar-stats", node => {
        if (node && node.textContent && node.textContent.includes("Chain:")) {
            const existing = node.querySelector("p[class*='bar-timeleft']");
            attachToTimer(node, existing);
        }
    });

    // Color update function for the timer text gradient green (#65A128) to red between 5:00 and 2:00
    function updateTimerColor(timeText, element) {
        const parts = timeText.split(':');
        if (parts.length !== 2) return;
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        if (isNaN(minutes) || isNaN(seconds)) return;

        const totalSeconds = minutes * 60 + seconds;
        const startGreen = 5 * 60;  // 300 seconds
        const startRed = 2 * 60;    // 120 seconds

        if (totalSeconds >= startGreen) {
            element.style.color = '#65A128';  // fixed green color
        } else if (totalSeconds <= startRed) {
            element.style.color = 'red';
        } else {
            // interpolate between #65A128 (101,161,40) and red (255,0,0)
            const ratio = (totalSeconds - startRed) / (startGreen - startRed); // 0..1
            const r = Math.round(255 * (1 - ratio) + 101 * ratio);
            const g = Math.round(0 * (1 - ratio) + 161 * ratio);
            const b = Math.round(0 * (1 - ratio) + 40 * ratio);
            element.style.color = `rgb(${r},${g},${b})`;
        }
    }

    // Start continuous color updating on the timer element
    function startColorGradientTimer(timeLeftElem) {
        updateTimerColor(timeLeftElem.textContent.trim(), timeLeftElem);
        const intervalId = setInterval(() => {
            if (!document.body.contains(timeLeftElem)) {
                clearInterval(intervalId);
                return;
            }
            updateTimerColor(timeLeftElem.textContent.trim(), timeLeftElem);
        }, 500);
    }

    function attachToTimer(barStats, timeLeftElem=null, speedElem=null, tickListElem=null) {
        try {
            if (!timeLeftElem) {
                timeLeftElem = barStats.querySelector("p[class*='bar-timeleft']") || barStats.querySelector("p");
            }
            if (!timeLeftElem) return;
            if (timeLeftElem.dataset.tornRandomAttached) return;
            timeLeftElem.dataset.tornRandomAttached = '1';

            barStats.style.display = "block";
            timeLeftElem.style.fontSize = "60px";
            timeLeftElem.style.height = "62px";
            if (speedElem) speedElem.style.top = "unset";
            if (tickListElem) tickListElem.style.height = "8px";

            timeLeftElem.style.cursor = "pointer";
            timeLeftElem.title = "Ctrl+Click to find a random Level 1 target (menu options available)";
            timeLeftElem.style.transition = 'color 0.5s ease-in-out'; // smooth fade for color change

            // Start the color gradient update loop
            startColorGradientTimer(timeLeftElem);

            timeLeftElem.addEventListener('click', async (e) => {
                if (!e.ctrlKey) {
                    console.log("Tip: Hold Ctrl and click the timer to find a random Level 1 target.");
                    return;
                }
                e.preventDefault();
                console.log("[Torn Random Finder] Ctrl+Click detected — starting search.");
                timeLeftElem.style.opacity = "0.5";
                setTimeout(() => (timeLeftElem.style.opacity = ""), 300);
                await findRandomLevel1(timeLeftElem);
            });

            console.log("[Torn Random Finder] Attached to chain timer successfully.");
        } catch (err) {
            console.error("[Torn Random Finder] attachToTimer error:", err);
        }
    }
// === Floating "!" button ===
function addFloatingButton() {
    if (document.getElementById('torn-random-float-btn')) return; // prevent duplicates

    const visibility = getButtonVisibility(); // 'show' or 'hide'
    if (visibility === 'hide') return; // respect stored preference

    const btn = document.createElement('button');
    btn.id = 'torn-random-float-btn';
    btn.innerHTML = '⚠️';
    btn.style.position = 'fixed';
    btn.style.top = '28%';
    btn.style.right = '0%';
    btn.style.zIndex = '9999';
    btn.style.backgroundColor = 'transparent';
    btn.style.color = 'rgba(255, 255, 255, 0.8)';
    btn.style.border = 'medium';
    btn.style.padding = '5px';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '20px';
    btn.title = 'Click to find a random Level 1 target';

    btn.addEventListener('click', async () => {
        if (typeof findRandomLevel1 !== 'function') {
            console.error("[Torn Random Finder] Finder function not ready yet!");
            return;
        }
        console.log('[Torn Random Finder] Button clicked — starting search.');
        btn.style.opacity = '0.5';
        setTimeout(() => (btn.style.opacity = ''), 300);
        await findRandomLevel1();
    });

    document.body.appendChild(btn);
}

// Wait for DOM, then add the button
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addFloatingButton);
} else {
    addFloatingButton();
}


    // -------- finder logic --------
    async function findRandomLevel1(timeLeftElement = null) {
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
                    console.log('Found match — opening target', id);

                    // Removed glow effect confirmation on Ctrl+click

                    const targetUrl = makeTargetUrl(id);
                    openTargetUrl(targetUrl);
                    return;
                }

            } catch (e) {
                console.warn('Request error for ID', id, e);
            }

            await sleep(cfg.delayMs);
        }

        alert(`No matching Level 1 profile found after ${cfg.maxAttempts} attempts. Try increasing attempts or maxId in the script menu.`);
    }

})();

