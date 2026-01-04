// ==UserScript==
// @name         NPO Friendly Fire
// @namespace    https://www.torn.com/profiles.php?XID=3833584
// @version      3001
// @description  Friendly Fire Protection in Browser and PDA
// @author       -Thelemite [3833584]
// @match        https://www.torn.com/profiles.php*
// @match        https://torn.com/profiles.php*
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @match        https://torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550691/NPO%20Friendly%20Fire.user.js
// @updateURL https://update.greasyfork.org/scripts/550691/NPO%20Friendly%20Fire.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const Allies = [
        { id: "10610", name: "NPO - Strength" },        // -- INDEX 0
        { id: "44758", name: "NPO - Prosperity" },      // -- INDEX 1
        { id: "12645", name: "NPO - Endurance" },       // -- INDEX 2
        { id: "14052", name: "NPO - Serenity" },        // -- INDEX 3
        { id: "18714", name: "NPO - Peace" },           // -- INDEX 4
        { id: "26885", name: "NPO - Valour" },          // -- INDEX 5

        { id: "19", name: "39th Street Killers" },      // -- INDEX 6
        { id: "16312", name: "39th Street Killers X" }, // -- INDEX 7
        { id: "7049", name: "39th Street Healers" },    // -- INDEX 8
        { id: "22680", name: "39th Street Reapers" },   // -- INDEX 9
        { id: "31764", name: "39th Street Warriors" },  // -- INDEX 10
        { id: "36691", name: "Rabid Chihuahuas" },      // -- INDEX 11
        { id: "11162", name: "InQuest" },               // -- INDEX 12
        { id: "7197", name: "HeLa" },                   // -- INDEX 13
        { id: "30009", name: "White Rabbits" }          // -- INDEX 14
    ];

    var rD_xmlhttpRequest;
    var rD_setValue;
    var rD_getValue;
    var rD_listValues;
    var rD_deleteValue;
    var rD_registerMenuCommand;

    // DO NOT CHANGE THIS
    // DO NOT CHANGE THIS
    var apikey = "###PDA-APIKEY###";
    // DO NOT CHANGE THIS
    // DO NOT CHANGE THIS
    if (apikey[0] != "#") {
        console.log("[NPO FF] Adding modifications to support TornPDA");
        rD_xmlhttpRequest = function (details) {
            console.log("[NPO FF] Attempt to make http request");
            if (details.method.toLowerCase() == "get") {
                return PDA_httpGet(details.url, details.headers ?? {})
                    .then(details.onload)
                    .catch(
                        details.onerror ??
                        ((e) =>
                            console.error("[NPO FF] Generic error handler: ", e)),
                    );
            } else if (details.method.toLowerCase() == "post") {
                return PDA_httpPost(
                    details.url,
                    details.headers ?? {},
                    details.body ?? details.data ?? "",
                )
                    .then(details.onload)
                    .catch(
                        details.onerror ??
                        ((e) =>
                            console.error("[NPO FF] Generic error handler: ", e)),
                    );
            } else {
                console.log("[NPO FF] What is this? " + details.method);
            }
        };
        rD_setValue = function (name, value) {
            console.log("[NPO FF] Attempted to set " + name);
            return localStorage.setItem(name, value);
        };
        rD_getValue = function (name, defaultValue) {
            var value = localStorage.getItem(name) ?? defaultValue;
            return value;
        };
        rD_listValues = function () {
            const keys = [];
            for (const key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
        rD_deleteValue = function (name) {
            console.log("[NPO FF] Attempted to delete " + name);
            return localStorage.removeItem(name);
        };
        rD_registerMenuCommand = function () {
            console.log("[NPO FF] Disabling GM_registerMenuCommand");
        };
        rD_setValue("limited_key", apikey);
    } else {
        rD_xmlhttpRequest = GM_xmlhttpRequest;
        rD_setValue = GM_setValue;
        rD_getValue = GM_getValue;
        rD_listValues = GM_listValues;
        rD_deleteValue = GM_deleteValue;
        rD_registerMenuCommand = GM_registerMenuCommand;
    }

    var key = rD_getValue("limited_key", null);
    var info_line = null;

    rD_registerMenuCommand("Enter Limited API Key", () => {
        let userInput = prompt(
            "[NPO FF]: Enter Limited API Key",
            rD_getValue("limited_key", ""),
        );
        if (userInput !== null) {
            rD_setValue("limited_key", userInput);
            // Reload page
            window.location.reload();
        }
    });

    // Utility: wait for a selector to appear (handles PDA late DOM)
    function waitForSelector(selector, { root = document, timeout = 10000 } = {}) {
        return new Promise((resolve) => {
            const el = root.querySelector(selector);
            if (el) return resolve(el);

            const obs = new MutationObserver(() => {
                const found = root.querySelector(selector);
                if (found) { obs.disconnect(); resolve(found); }
            });

            obs.observe(root.documentElement || root, { childList: true, subtree: true });

            if (timeout > 0) {
                setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
            }
        });
    }

    // Extract factionId from /factions.php?step=profile&ID=... links
    function getFactionId() {
        const anchors = document.querySelectorAll('a[href*="/factions.php?step=profile&ID="]');
        for (const a of anchors) {
            try {
                const url = new URL(a.getAttribute('href'), location.href);
                if (url.pathname.endsWith('/factions.php') && url.searchParams.get('step') === 'profile') {
                    const id = url.searchParams.get('ID');
                    if (id) return String(id).trim();
                }
            } catch { /* ignore malformed hrefs */ }
        }
        return null;
    }

    // (Optional) userId, if you need it later
    function getUserIdFromAttackBtn(btn) {
        const id = btn?.id ?? '';
        const parts = id.split('-');
        return parts.length ? parts[parts.length - 1] : null;
    }

    // Update decorateAndIntercept to accept allyName
    function decorateAndIntercept(attackBtn, factionId, allyName) {
        if (!attackBtn) return;
        if (attackBtn.dataset.allyDecorated === '1') return;
        attackBtn.dataset.allyDecorated = '1';

        // Positioning for overlay
        const cs = getComputedStyle(attackBtn);
        if (cs.position === 'static') attackBtn.style.position = 'relative';

        // Green X overlay (slightly smaller for mobile)
        const x = document.createElement('span');
        x.textContent = '✕';
        x.setAttribute('aria-hidden', 'true');
        x.style.position = 'absolute';
        x.style.top = '0';
        x.style.left = '0';
        x.style.width = '100%';
        x.style.height = '100%';
        x.style.display = 'flex';
        x.style.alignItems = 'center';
        x.style.justifyContent = 'center';
        x.style.fontWeight = '900';
        x.style.fontSize = '36px';
        x.style.lineHeight = '1';
        x.style.borderRadius = '4px';
        x.style.background = 'rgba(0, 128, 0, 0.15)';
        x.style.color = '#0f0';
        x.style.pointerEvents = 'none';
        x.title = `Ally faction (${allyName}) – confirm before attacking`;
        attackBtn.appendChild(x);

        // Confirm dialog allowing proceed
        const onAttemptAttack = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const proceed = confirm(
                `This player is in an allied faction (${allyName}).\n\nAre you sure you want to attack?`
            );
            if (!proceed) return;

            const href = attackBtn.getAttribute('href');
            if (!href) return;

            // Respect modifier keys / middle click
            if (e.metaKey || e.ctrlKey || e.button === 1) {
                window.open(href, '_blank');
            } else {
                window.location.href = href;
            }
        };

        attackBtn.addEventListener('click', onAttemptAttack, { capture: true });
    }

    async function handleProfilePage() {
        // Wait for either: faction link appears OR just proceed after a beat
        await waitForSelector('a[href*="/factions.php?step=profile&ID="]', { timeout: 5000 });
        const factionId = getFactionId();

        const allyObj = Allies.find(a => String(a.id) === String(factionId));
        const isAlly = !!allyObj;

        // Log for debugging
        const attackBtnNow = document.querySelector('a.profile-button-attack');
        const userId = getUserIdFromAttackBtn(attackBtnNow);
        console.log(`NPO FF: User:${userId} Faction:${factionId} IsAlly:${isAlly}`);

        if (!isAlly) return;

        // Ensure we catch the attack button even if it renders later
        const attackBtn = await waitForSelector('a.profile-button-attack', { timeout: 8000 });
        if (!attackBtn) return;

        decorateAndIntercept(attackBtn, factionId, allyObj.name);
    }

    function showToast(message) {
        console.log("[NPO FF] Toast: " + message);
    }

    async function handleLoaderAttackPage() {
        // get user id from URL
        const urlParams = new URLSearchParams(location.search);
        const userId = urlParams.get('user2ID');
        if (!userId) return;

        console.log(`[NPO FF]: User:${userId} - Checking attack button...`);

        // find a button that is type="submit" nested in a div of class containing "defender__"
        const attackBtn = await waitForSelector('div[class*="defender__"] button[type="submit"]', { timeout: 10000 });

        console.log(`[NPO FF]: User:${userId} - Attack button found: ${!!attackBtn}`);
        if (!attackBtn) return;

        console.log(`[NPO FF]: User:${userId} - Attack Button: ${attackBtn.innerText}`);

        // use API key and do GET request to fetch faction ID of user being attacked
        const url = `https://api.torn.com/v2/user/${userId}/faction`;
        rD_xmlhttpRequest({
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `ApiKey ${key}`
            },
            url: url,
            onload: function (response) {
                if (!response) {
                    // If the same request happens in under a second, Torn PDA will return nothing
                    return;
                }
                if (response.status == 200) {
                    var ff_response = JSON.parse(response.responseText);
                    var factionId = ff_response.faction.id;
                    var allyObj = Allies.find((a) => String(a.id) === String(factionId));
                    var isAlly = !!allyObj;

                    decorateAndIntercept(attackBtn, factionId, allyObj.name);

                    showToast(
                        `API request successful. Faction ID: ${factionId}. Is Ally: ${isAlly}`,
                    );
                } else {
                    try {
                        var err = JSON.parse(response.responseText);
                        if (err && err.error) {
                            showToast(
                                "API request failed. Error: " +
                                err.error +
                                "; Code: " +
                                err.code,
                            );
                        } else {
                            showToast(
                                "API request failed. HTTP status code: " + response.status,
                            );
                        }
                    } catch {
                        showToast(
                            "API request failed. HTTP status code: " + response.status,
                        );
                    }
                }
            },
            onerror: function (e) {
                console.error("[NPO FF] **** error ", e, "; Stack:", e.stack);
            },
            onabort: function (e) {
                console.error("[NPO FF] **** abort ", e, "; Stack:", e.stack);
            },
            ontimeout: function (e) {
                console.error(
                    "[NPO FF] **** timeout ",
                    e,
                    "; Stack:",
                    e.stack,
                );
            },
        });
    }

    async function init() {

        const isProfilePage = location.pathname.endsWith('/profiles.php');
        const isLoaderAttackPage = location.pathname.endsWith('/loader.php') &&
            location.search.includes('sid=attack') &&
            location.search.includes('user2ID=');

        if (isProfilePage) {
            await handleProfilePage();
        } else if (isLoaderAttackPage) {
            await handleLoaderAttackPage();
        }
    }

    // Run at document-end, plus handle full load as a fallback
    init();
    window.addEventListener('load', init, { once: true });
})();
