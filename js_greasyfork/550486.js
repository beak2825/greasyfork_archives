// ==UserScript==
// @name         Discord Torn Link Opener
// @namespace    https://greasyfork.org/users/1518628-marschel
// @version      1.4
// @description  Öffnet Torn-Links bei Ping
// @author       Marschel
// @match        https://discord.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550486/Discord%20Torn%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/550486/Discord%20Torn%20Link%20Opener.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const myName = "Doctor";

    // ======= Storage-Wrapper =======
    const _inMemoryStore = {};
    const storage = {
        get(key, def) {
            try {
                if (typeof localStorage !== 'undefined' && localStorage !== null) {
                    const v = localStorage.getItem(key);
                    if (v === null) return def;
                    return JSON.parse(v);
                }
            } catch (e) {}
            try {
                if (typeof GM_getValue === 'function') {
                    return GM_getValue(key, def);
                }
            } catch (e) {}
            return (_inMemoryStore.hasOwnProperty(key)) ? _inMemoryStore[key] : def;
        },
        set(key, val) {
            try {
                if (typeof localStorage !== 'undefined' && localStorage !== null) {
                    localStorage.setItem(key, JSON.stringify(val));
                    return true;
                }
            } catch (e) {}
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(key, val);
                    return true;
                }
            } catch (e) {}
            _inMemoryStore[key] = val;
            return false;
        }
    };

    // ======= Defaults =======
    let observerEnabled = storage.get("tm_observerEnabled", false);
    let allEnabled = storage.get("tm_allEnabled", false);

    let friendlyFactions = storage.get("tm_friendlyFactions", ["WTF","WTF Ducks"]);
    let enemyFactions = storage.get("tm_enemyFactions",[]);

    // ======= UI =======
    function createUI() {
        if (document.getElementById("tm-panel")) return; // schon vorhanden

        const panel = document.createElement("div");
        panel.id = "tm-panel";
        panel.style.position = "fixed";
        panel.style.bottom = "10px";
        panel.style.right = "10px";
        panel.style.background = "rgba(30,30,30,0.95)";
        panel.style.color = "white";
        panel.style.padding = "10px";
        panel.style.fontSize = "12px";
        panel.style.borderRadius = "6px";
        panel.style.zIndex = 999999;
        panel.style.fontFamily = "sans-serif";
        panel.style.width = "260px";
        panel.style.boxShadow = "0 6px 18px rgba(0,0,0,0.4)";

        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <strong>DTLO: Discord Torn Link Opener</strong>
              <button id="tm-hide" style="background:#444;border:none;color:#fff;border-radius:4px;cursor:pointer">x</button>
            </div>
            <label style="display:block;margin-bottom:6px"><input id="tm-observer" type="checkbox"> Observer</label>
            <label style="display:block;margin-bottom:6px"><input id="tm-all" type="checkbox"> Alle (ignoriere Whitelist)</label>
            <div style="font-size:11px;margin-top:8px;margin-bottom:4px">Whitelist (Komma getrennt)</div>
            <textarea id="tm-friendly" style="width:100%;height:48px;border-radius:4px;padding:6px"></textarea>
            <div style="font-size:11px;margin-top:8px;margin-bottom:4px">Blacklist-Factions (Komma getrennt)</div>
            <textarea id="tm-enemy" style="width:100%;height:48px;border-radius:4px;padding:6px"></textarea>
        `;

        document.body.appendChild(panel);

        const obsCheck = document.getElementById("tm-observer");
        const allCheck = document.getElementById("tm-all");
        const friendlyInput = document.getElementById("tm-friendly");
        const enemyInput = document.getElementById("tm-enemy");
        const hideBtn = document.getElementById("tm-hide");

        obsCheck.checked = !!observerEnabled;
        allCheck.checked = !!allEnabled;
        friendlyInput.value = (Array.isArray(friendlyFactions) ? friendlyFactions.join(", ") : String(friendlyFactions));
        enemyInput.value = (Array.isArray(enemyFactions) ? enemyFactions.join(", ") : String(enemyFactions));

        obsCheck.addEventListener('change', () => {
            observerEnabled = obsCheck.checked;
            storage.set("tm_observerEnabled", observerEnabled);
            console.log("[DTLO] Observer:", observerEnabled);
        });

        allCheck.addEventListener('change', () => {
            allEnabled = allCheck.checked;
            storage.set("tm_allEnabled", allEnabled);
            console.log("[DTLO] All:", allEnabled);
        });

        friendlyInput.addEventListener('change', () => {
            friendlyFactions = friendlyInput.value.split(",").map(s => s.trim()).filter(Boolean);
            storage.set("tm_friendlyFactions", friendlyFactions);
            console.log("[DTLO] FriendlyFactions:", friendlyFactions);
        });

        enemyInput.addEventListener('change', () => {
            enemyFactions = enemyInput.value.split(",").map(s => s.trim()).filter(Boolean);
            storage.set("tm_enemyFactions", enemyFactions);
            console.log("[DTLO] EnemyFactions:", enemyFactions);
        });

        hideBtn.addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    // ======= Fraktions-Logik =======
    function isFriendly(text) {
        if (!text) return false;
        return friendlyFactions.some(f => text.includes(`(${f})`) || text.includes(f));
    }

    function isEnemy(text) {
        if (!text) return false;
        return enemyFactions.some(f => text.includes(`(${f})`) || text.includes(f));
    }

    function shouldOpen(target, requestor) {
        if (allEnabled) return true;
        if (isEnemy(requestor)) return false;
        if (isFriendly(target) && isFriendly(requestor)) return true;
        if (isFriendly(requestor) && isEnemy(target)) return true;
        return false;
    }

    // ======= Nachrichten verarbeiten =======
    function processNode(node) {
        if (!observerEnabled) return;
        if (!(node instanceof HTMLElement)) return;

        const mention = node.querySelector(".roleMention__75297 span, .mention, .mention-2Cx0w3");
        if (mention && mention.textContent.includes(myName)) {
            const fields = node.querySelectorAll(".embedField__623de");
            let targetText = "";
            let requestorText = "";
            let linkUrl = "";

            for (const field of fields) {
                const nameEl = field.querySelector(".embedFieldName__623de span, .embedFieldName__623de");
                const valueEl = field.querySelector(".embedFieldValue__623de");
                if (!nameEl || !valueEl) continue;

                const fieldName = nameEl.textContent.trim();
                const fieldValue = valueEl.innerText.trim();

                if (fieldName === "Target") targetText = fieldValue;
                if (fieldName === "Requested By" || fieldName === "Requestor") requestorText = fieldValue;
                if (fieldName === "Target Link") {
                    const linkEl = valueEl.querySelector("a");
                    if (linkEl) linkUrl = linkEl.href;
                }
            }

            if (shouldOpen(targetText, requestorText) && linkUrl) {
                console.log("[DTLO] Öffne Torn-Link:", linkUrl);
                const win = window.open(linkUrl, "_blank");
                if (win) {
                    try { win.sessionStorage.setItem("openedByDiscord", "1"); }
                    catch (e) { console.warn("[DTLO] sessionStorage konnte nicht gesetzt werden:", e); }
                }
            } else {
                console.log("[DTLO] Kein Match: target=", targetText, "requestor=", requestorText);
            }
        }
    }

    // ======= Init (immer neu triggern) =======
    function init() {
        if (document.getElementById("tm-panel")) {
            return; // schon initialisiert
        }
        console.log("[DTLO] Init gestartet");
        createUI();

        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(processNode);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ======= Startlogik =======
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(init, 1000);
    } else {
        window.addEventListener("DOMContentLoaded", () => setTimeout(init, 1000));
    }

    // SPA-URL-Wechsel überwachen
    const origPush = history.pushState;
    history.pushState = function() {
        origPush.apply(this, arguments);
        setTimeout(init, 1000);
    };
    window.addEventListener("popstate", () => setTimeout(init, 1000));

})();
