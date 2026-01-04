// ==UserScript==
// @name         Torn - Nobiz
// @namespace    http://tampermonkey.net/
// @version      2.2
// @author       Mersie
// @description  To monitor a certain Individual in Torn for Reviving Contracts
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549103/Torn%20-%20Nobiz.user.js
// @updateURL https://update.greasyfork.org/scripts/549103/Torn%20-%20Nobiz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tickerSelector = ".headline-content";
    let originalTickerContent = null;
    let overlay = null;
    let pulseInterval = null;
    let API_KEY, playersToWatch;

    // --- Floating popup ---
    function createFloatingPrompt() {
        if (document.querySelector(".torn-floating-prompt")) return;

        const promptDiv = document.createElement("div");
        promptDiv.className = "torn-floating-prompt";
        promptDiv.style.position = "fixed";
        promptDiv.style.top = "20px";
        promptDiv.style.left = "20px";
        promptDiv.style.background = "#191919";
        promptDiv.style.color = "white";
        promptDiv.style.padding = "10px";
        promptDiv.style.zIndex = "10000";
        promptDiv.style.border = "2px solid #333";
        promptDiv.style.borderRadius = "5px";
        promptDiv.style.fontFamily = "Arial, sans-serif";
        promptDiv.style.display = "flex";
        promptDiv.style.flexDirection = "column";
        promptDiv.style.gap = "5px";

        // API input
        const apiInput = document.createElement("input");
        apiInput.placeholder = "Public API Key";
        apiInput.style.width = "200px";
        apiInput.value = API_KEY || "";

        // Player IDs input
        const playersInput = document.createElement("input");
        playersInput.placeholder = "Player IDs (comma-separated)";
        playersInput.style.width = "200px";
        playersInput.value = playersToWatch ? playersToWatch.join(",") : "";

        // Monitoring toggle
        const monitoringToggle = document.createElement("label");
        monitoringToggle.style.display = "flex";
        monitoringToggle.style.alignItems = "center";
        monitoringToggle.style.gap = "5px";
        monitoringToggle.style.fontSize = "14px";
        monitoringToggle.style.cursor = "pointer";

        const toggleInput = document.createElement("input");
        toggleInput.type = "checkbox";
        toggleInput.checked = localStorage.getItem("torn_monitoring_on") === "false" ? false : true;

        toggleInput.addEventListener("change", () => {
            localStorage.setItem("torn_monitoring_on", toggleInput.checked);
        });

        const toggleText = document.createElement("span");
        toggleText.textContent = "Monitoring On";

        monitoringToggle.appendChild(toggleInput);
        monitoringToggle.appendChild(toggleText);

        // Submit button
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Save & Start";
        submitBtn.style.background = "#191919";
        submitBtn.style.color = "white";
        submitBtn.style.border = "1px solid #484848";
        submitBtn.style.padding = "5px";
        submitBtn.style.cursor = "pointer";
        submitBtn.style.fontWeight = "bold";

        submitBtn.addEventListener("click", () => {
            const key = apiInput.value.trim();
            const ids = playersInput.value.trim().split(",").map(i => i.trim()).filter(i => i).map(Number);
            if (!key || ids.length === 0) {
                alert("Enter a valid API key and at least one player ID!");
                return;
            }
            API_KEY = key;
            playersToWatch = ids;
            localStorage.setItem("torn_api_key", API_KEY);
            localStorage.setItem("torn_player_ids", JSON.stringify(playersToWatch));
            localStorage.setItem("torn_monitoring_on", toggleInput.checked);
            promptDiv.remove();
            startMonitoring();
        });

        promptDiv.appendChild(apiInput);
        promptDiv.appendChild(playersInput);
        promptDiv.appendChild(monitoringToggle);
        promptDiv.appendChild(submitBtn);
        document.body.appendChild(promptDiv);
    }

    // --- Red overlay ---
    function createOverlay() {
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "red";
            overlay.style.opacity = "0";
            overlay.style.zIndex = "9999";
            overlay.style.pointerEvents = "none";
            overlay.style.transition = "opacity 0.8s ease-in-out";
            document.body.appendChild(overlay);
        }
    }

    function startPulse() {
        if (pulseInterval) return;
        let visible = false;
        pulseInterval = setInterval(() => {
            overlay.style.opacity = visible ? "0" : "0.1";
            visible = !visible;
        }, 800);
    }

    function stopPulse() {
        if (pulseInterval) {
            clearInterval(pulseInterval);
            pulseInterval = null;
        }
        if (overlay) overlay.style.opacity = "0";
    }

    // --- Fetch player ---
    function fetchPlayer(id) {
        return new Promise(resolve => {
            const url = `https://api.torn.com/user/${id}?selections=&key=${API_KEY}`;
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const online = data.last_action && data.last_action.status === "Online";
                        resolve({ name: data.name, online });
                    } catch (err) {
                        console.error("Error parsing response for", id, err);
                        resolve({ name: `ID ${id}`, online: false });
                    }
                },
                onerror: function() {
                    console.error("Request failed for", id);
                    resolve({ name: `ID ${id}`, online: false });
                }
            });
        });
    }

    // --- Update ticker & overlay ---
    async function updateStatus() {
        const monitoringOn = localStorage.getItem("torn_monitoring_on") === "false" ? false : true;
        if (!monitoringOn) {
            stopPulse();
            return;
        }

        const ticker = document.querySelector(tickerSelector);
        if (!ticker) return;

        if (!originalTickerContent) originalTickerContent = ticker.innerHTML;

        const results = await Promise.all(playersToWatch.map(fetchPlayer));
        const onlinePlayers = results.filter(r => r.online).map(r => r.name);

        if (onlinePlayers.length > 0) {
            let message = "Give up Revving: ";
            message += onlinePlayers.length === 1
                ? `${onlinePlayers[0]} is online!`
                : `${onlinePlayers.join(", ")} are online!`;

            ticker.textContent = message;
            ticker.style.color = "red";
            ticker.style.fontWeight = "bold";
            startPulse();
        } else {
            ticker.innerHTML = originalTickerContent;
            ticker.style.color = "";
            ticker.style.fontWeight = "";
            stopPulse();
        }
    }

    // --- Edit button inside status icons ---
    function createEditButtonInStatusIcons() {
        const container = document.querySelector(".status-icons___gPkXF.big___DX94I");
        if (!container) {
            setTimeout(createEditButtonInStatusIcons, 500);
            return;
        }
        if (container.querySelector(".torn-edit-btn")) return;

        const btn = document.createElement("button");
        btn.textContent = "Edit";
        btn.className = "torn-edit-btn";
        btn.style.marginLeft = "5px";
        btn.style.padding = "2px 6px";
        btn.style.fontSize = "12px";
        btn.style.cursor = "pointer";
        btn.style.background = "#191919";
        btn.style.color = "white";
        btn.style.border = "1px solid #484848";
        btn.style.borderRadius = "3px";

        btn.addEventListener("click", () => {
            createFloatingPrompt();
        });

        container.appendChild(btn);
    }

    // --- Start monitoring ---
    function startMonitoring() {
        createOverlay();
        createEditButtonInStatusIcons();
        setInterval(updateStatus, 5000);
        updateStatus();
    }

    // --- Initialize ---
    function init() {
        const storedKey = localStorage.getItem("torn_api_key");
        const storedIds = localStorage.getItem("torn_player_ids");

        if (storedKey && storedIds) {
            API_KEY = storedKey;
            playersToWatch = JSON.parse(storedIds);
            startMonitoring();
        } else {
            createFloatingPrompt();
        }
    }

    init();
})();
