// ==UserScript==
// @name         Torn OC Weight Symbols
// @namespace    https://torn.com/
// @version      1.0.1
// @description  Adds symbols before OC progress icons to distinguish impact
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/organizedcrimes.php*
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @connect      tornprobability.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549047/Torn%20OC%20Weight%20Symbols.user.js
// @updateURL https://update.greasyfork.org/scripts/549047/Torn%20OC%20Weight%20Symbols.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const API_URL = "https://tornprobability.com:3000/api/GetRoleWeights";
    let weightData = {};

    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

    // Normalize names: lowercase + remove non-alphanumerics
    function normalize(str) {
        return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    function getOCName(ocRoot) {
        const el = q(".panelTitle___aoGuV", ocRoot);
        return el ? el.textContent.trim() : null;
    }

    function addWeights(ocRoot) {
        const ocNameRaw = getOCName(ocRoot);
        if (!ocNameRaw) return;

        const ocKey = normalize(ocNameRaw);
        const ocWeights = weightData[ocKey];
        if (!ocWeights) return;

        const roles = qa(".wrapper___Lpz_D", ocRoot);
        roles.forEach((role) => {
            const roleSpan = q(".title___UqFNy", role);
            if (!roleSpan || roleSpan.className.includes("weighted")) return;

            const roleNameRaw = (roleSpan.textContent || "").trim();
            const roleKey = normalize(roleNameRaw);

            const weight = ocWeights[roleKey];
            if (weight == null) return;

            roleSpan.className += " weighted";
            const icon = document.createElement("span");
            icon.className = "oc-weight-symbol";
            icon.textContent = getWeightSymbol(ocWeights, weight);
            role.firstChild.insertBefore(icon, q(".slotIcon___VVnQy", role));
        });
    }

    function getWeightSymbol(ocWeights, weight) {
        const avgWeight = 100 / Object.keys(ocWeights).length;

        if(weight>avgWeight*1.50) {
            return "🔑";
        }
        else if(weight>avgWeight*1.25) {
            return "🔼";
        }
        else if(weight<avgWeight*.50) {
            return "⏬";
        }
        else if(weight<avgWeight*.75) {
            return "🔽";
        }
        return "";
    }

    function scanPage() {
        const ocs = qa('div.wrapper___U2Ap7[data-oc-id]');
        ocs.forEach(addWeights);
    }

    const obs = new MutationObserver(() => scanPage());
    obs.observe(document.body, { childList: true, subtree: true });

    // Fetch weights using GM.xmlHttpRequest (CSP safe)
    GM.xmlHttpRequest({
        method: "GET",
        url: API_URL,
        onload: (response) => {
            try {
                const data = JSON.parse(response.responseText);
                weightData = {};
                for (const [ocName, roles] of Object.entries(data)) {
                    const ocKey = normalize(ocName);
                    weightData[ocKey] = {};
                    for (const [roleName, value] of Object.entries(roles)) {
                        weightData[ocKey][normalize(roleName)] = value;
                    }
                }
                scanPage();
            } catch (err) {
                console.error("[OC Weights] Failed to parse API response:", err);
            }
        },
        onerror: (err) => {
            console.error("[OC Weights] API request failed:", err);
        },
    });
})();
