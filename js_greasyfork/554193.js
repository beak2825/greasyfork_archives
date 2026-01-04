// ==UserScript==
// @name         Torn Random Attack (v2.0 - Production)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Randomly attacks "Okay" targets from a Google Sheet. Clean UI, No Debug.
// @author       John_Of_Mud [712511]
// @license Personal Use Only - Modifications Allowed, Redistribution Prohibited
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.codetabs.com
// @connect      api.allorigins.win
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/554193/Torn%20Random%20Attack%20%28v20%20-%20Production%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554193/Torn%20Random%20Attack%20%28v20%20-%20Production%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_ATTEMPTS = 30; 
    const CONCURRENCY = 5;  
    
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_NxnqPMZeOS9iSHTcqkcoP0Q1LsbilWghsaUjgPCUlx6Anmpg6pBxv0FHSsNmczENvMtNLE9lpSJN/pub?output=csv";

    const PROXIES = [
        `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(csvUrl)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(csvUrl)}`
    ];

    const STORAGE_KEY = "torn_api_key_v1";

    function getApiKey() { return localStorage.getItem(STORAGE_KEY) || ""; }
    function setApiKey(val) { 
        if (!val) localStorage.removeItem(STORAGE_KEY); 
        else localStorage.setItem(STORAGE_KEY, val.trim()); 
    }

    function promptForApiKey() {
        const k = window.prompt("Enter Torn API Key:", getApiKey());
        if (k !== null) { setApiKey(k); return k; }
        return null;
    }

    function setButtonState(loading) {
        const btn = document.getElementById("chain-attack-btn");
        if (!btn) return;
        btn.innerText = loading ? "Searching..." : "Chain Attack";
        btn.style.background = loading ? "#444" : "#ff5555";
        btn.disabled = loading;
    }

    function checkStatusOkay(userId, apiKey, cb) {
        const url = `https://api.torn.com/user/${userId}?selections=basic&key=${apiKey}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    cb(data?.status?.state === "Okay");
                } catch (e) { cb(false); }
            },
            onerror: () => cb(false)
        });
    }

    function findOkayUser(ids, apiKey, cb) {
        let tried = new Set(), found = false, attempts = 0, inFlight = 0;
        function next() {
            if (found || attempts >= MAX_ATTEMPTS) return;
            const remaining = ids.filter(id => !tried.has(id));
            if (!remaining.length) { if (inFlight === 0 && !found) cb(null); return; }
            const pick = remaining[Math.floor(Math.random() * remaining.length)];
            tried.add(pick); attempts++; inFlight++;
            checkStatusOkay(pick, apiKey, okay => {
                inFlight--;
                if (found) return;
                if (okay) { found = true; cb(pick); }
                else {
                    if (attempts < MAX_ATTEMPTS && inFlight < CONCURRENCY) next();
                    else if (!found && inFlight === 0) cb(null);
                }
            });
            if (inFlight < CONCURRENCY && attempts < MAX_ATTEMPTS) next();
        }
        for (let i = 0; i < CONCURRENCY; i++) next();
    }

    function tryFetch(proxyIndex = 0) {
        const apiKey = getApiKey();
        if (!apiKey) { alert("Please set your API key first."); setButtonState(false); return; }

        if (proxyIndex >= PROXIES.length) {
            setButtonState(false);
            alert("Error: Could not reach Google Sheet.");
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: PROXIES[proxyIndex],
            timeout: 10000,
            onload: function(response) {
                const ids = response.responseText.split(/\r?\n/)
                    .map(row => row.split(',')[0].replace(/\D/g, ''))
                    .filter(id => id.length >= 4 && id.length <= 10);

                if (ids.length > 0) {
                    document.getElementById("target-count").innerText = `Loaded ${ids.length} targets.`;
                    findOkayUser(ids, apiKey, id => {
                        setButtonState(false);
                        if (id) window.location.assign(`https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${id}`);
                        else alert(`Checked ${MAX_ATTEMPTS} random targets, but all are hospitalized.`);
                    });
                } else {
                    tryFetch(proxyIndex + 1);
                }
            },
            onerror: () => tryFetch(proxyIndex + 1),
            ontimeout: () => tryFetch(proxyIndex + 1)
        });
    }

    function addUI() {
        if (document.getElementById("chain-attack-btn")) return;
        const container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed", top: "80px", right: "20px", zIndex: "9999",
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px"
        });

        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "5px";

        const gear = document.createElement("button");
        gear.innerText = "⚙️";
        Object.assign(gear.style, {
            padding: "8px", backgroundColor: "#333", color: "#fff", border: "none", 
            borderRadius: "5px", cursor: "pointer", fontSize: "14px"
        });
        gear.onclick = () => promptForApiKey();

        const btn = document.createElement("button");
        btn.id = "chain-attack-btn";
        btn.innerText = "Chain Attack";
        Object.assign(btn.style, {
            padding: "10px 15px", backgroundColor: "#ff5555", color: "#fff", 
            border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
        });
        btn.onclick = () => {
            if (!getApiKey()) { if (!promptForApiKey()) return; }
            setButtonState(true);
            tryFetch(0);
        };

        const info = document.createElement("div");
        info.id = "target-count";
        info.innerText = "Ready";
        info.style.cssText = "font-size: 10px; color: #fff; background: rgba(0,0,0,0.6); padding: 3px 6px; border-radius: 3px;";

        row.appendChild(gear);
        row.appendChild(btn);
        container.appendChild(row);
        container.appendChild(info);
        document.body.appendChild(container);
    }

    window.addEventListener("load", () => setTimeout(addUI, 1200));
})();