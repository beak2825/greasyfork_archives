// ==UserScript==
// @name         Lifeline Revive Request Button
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license MIT
// @description  Requests a revive from Lifeline using a simple Torn button nested in the mini-icons.
// @author       Rosalinde [3252181]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      lifeline-revive-bot.rosalinde-torn.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/564209/Lifeline%20Revive%20Request%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/564209/Lifeline%20Revive%20Request%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes('register.php') || window.location.href.includes('login.php')) return;

    const PROXY_URL = "https://lifeline-revive-bot.rosalinde-torn.workers.dev/";

async function sendToDiscord(sidebarData) {
        let hpValue = 0;
        let maxHpValue = 100;

        const getLifeData = () => {
            const lifeAnchor = document.querySelector('a[class*="life___"]');
            if (lifeAnchor) {
                const hpElement = lifeAnchor.querySelector('p[class*="bar-value"]');
                if (hpElement) {
                    const rawText = hpElement.textContent.replace(/[^\d/]/g, '').trim();
                    const parts = rawText.split('/');
                    if (parts.length === 2) {
                        return { hp: parseInt(parts[0]), max: parseInt(parts[1]) };
                    }
                }
            }
            return null;
        };

        let data = getLifeData();

        if (!data || data.hp === 0) {
            await new Promise(resolve => setTimeout(resolve, 300));
            data = getLifeData();
        }

        if (data) {
            hpValue = data.hp;
            maxHpValue = data.max;
        }

        // Final Data Assembly
        const user = sidebarData.user || {};
        const finalHp = hpValue || user.hp || 0;
        const finalMaxHp = maxHpValue || user.maxHp || 100;

        const payload = {
            name: user.name || "Unknown",
            id: user.userID || "0",
            hp: finalHp,
            maxHp: finalMaxHp,
            location: user.locationName || "Hospital"
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: PROXY_URL,
            data: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" },
            onload: (res) => alert(`🚑 Request Sent! Life: ${finalHp}/${finalMaxHp}`),
            onerror: (err) => alert("❌ Connection Error.")
        });
    }

    function checkAndInject() {
        const storageKey = Object.keys(sessionStorage).find(k => /sidebarData\d+/.test(k));
        const storageRaw = sessionStorage.getItem(storageKey);
        if (!storageRaw) return;

        const sidebarData = JSON.parse(storageRaw);
        if (!sidebarData) return;

        const isInHospital = sidebarData.statusIcons?.icons?.hospital;
        const existingBtn = document.getElementById('status-lifeline-btn');

        // 2. Remove button if player is no longer in the hospital
        if (!isInHospital) {
            if (existingBtn) existingBtn.remove();
            return;
        }

        // 3. Inject button if in hospital and it doesn't already exist
        if (isInHospital && !existingBtn) {
            const statusTray = document.querySelector('ul[class*="status-icons"]');

            if (statusTray) {
                const li = document.createElement('li');
                li.id = 'status-lifeline-btn';

                li.innerHTML = `
                    <a href="#" style="
                        display: block;
                        height: 20px;
                        padding: 0 4px;
                        margin-right: 12px;
                        background: #fe9a1e;
                        color: #000000;
                        border-radius: 9px;
                        text-align: center;
                        line-height: 18px;
                        font-weight: 900;
                        font-size: 10px;
                        font-family: Arial, sans-serif;
                        text-transform: uppercase;
                        border: 1px solid #000;
                        box-shadow: 0 0 2px rgba(0,0,0,0.5);
                        text-decoration: none;
                    " title="Request a Lifeline Revive">L L</a>
                `;

                li.onclick = (e) => {
                    e.preventDefault();
                    if (confirm("Send a revive request to Lifeline?")) {
                        sendToDiscord(sidebarData);
                    }
                };

                statusTray.prepend(li);
            }
        }
    }

    setInterval(checkAndInject, 1000);
})();