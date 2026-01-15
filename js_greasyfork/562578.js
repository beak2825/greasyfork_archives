// ==UserScript==
// @name         Stake Bonus Claimer
// @namespace    stake-sniper
// @version      4.9
// @description  Automaticaly claims Stake bonus codes in real time
// @author       stuffman0/stuffman/guns.lol/stuffman/stuffman001/bonusclaimer.replit.app
// @match        https://stake.com/*
// @match        https://stake.games/*
// @match        https://stake.bet/*
// @connect      bonusclaimer.replit.app
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @noframes
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562578/Stake%20Bonus%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/562578/Stake%20Bonus%20Claimer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const MONITOR_URL = "https://bonusclaimer.replit.app";

    let eventSource = null;
    let isEnabled = true;
    let stats = {
        pushed: 0,
        successful: 0,
        failed: 0,
    };
    let redeemHistory = [];
    let needsAuth = false;

    function getApiKey() {
        return localStorage.getItem("stake_sniper_apikey") || null;
    }

    function setApiKey(key) {
        if (key) {
            localStorage.setItem("stake_sniper_apikey", key);
        } else {
            localStorage.removeItem("stake_sniper_apikey");
        }
    }

    function showLoginMode(errorMessage = "") {
        needsAuth = true;
        const panel = document.getElementById("sniper-panel");
        const loginSection = document.getElementById("loginSection");
        const mainContent = document.getElementById("mainContent");
        const statusDot = document.getElementById("statusDot");
        const statusText = document.getElementById("connectionStatus");
        const loginError = document.getElementById("loginError");
        const loginBtn = document.getElementById("loginBtn");
        const apiKeyInput = document.getElementById("apiKeyInput");

        if (!panel || !loginSection) return;

        mainContent.style.display = "none";
        loginSection.style.display = "block";

        // Re-enable the login button and clear input for fresh attempt
        if (loginBtn) loginBtn.disabled = false;
        if (apiKeyInput) apiKeyInput.value = "";

        if (errorMessage) {
            panel.style.borderColor = "#e74c3c";
            panel.style.boxShadow = "0 4px 20px rgba(231,76,60,0.4)";
            statusDot.className = "status-dot dot-disconnected";
            loginError.textContent = errorMessage;
            loginError.style.color = "#e74c3c";
        } else {
            panel.style.borderColor = "#f1c40f";
            panel.style.boxShadow = "0 4px 20px rgba(241,196,15,0.4)";
            statusDot.className = "status-dot dot-connecting";
            loginError.textContent = "Enter API key to connect";
            loginError.style.color = "#f1c40f";
        }
        statusText.textContent = "Not Authenticated";
    }

    function hideLoginMode() {
        needsAuth = false;
        const loginSection = document.getElementById("loginSection");
        const mainContent = document.getElementById("mainContent");

        if (loginSection) loginSection.style.display = "none";
        if (mainContent) mainContent.style.display = "block";
    }

    function setLoginPending() {
        const panel = document.getElementById("sniper-panel");
        const statusDot = document.getElementById("statusDot");
        const loginError = document.getElementById("loginError");

        if (panel) {
            panel.style.borderColor = "#f1c40f";
            panel.style.boxShadow = "0 4px 20px rgba(241,196,15,0.4)";
        }
        if (statusDot) statusDot.className = "status-dot dot-connecting";
        if (loginError) {
            loginError.textContent = "Validating...";
            loginError.style.color = "#f1c40f";
        }
    }

    function setLoginError(message) {
        const panel = document.getElementById("sniper-panel");
        const statusDot = document.getElementById("statusDot");
        const loginError = document.getElementById("loginError");

        if (panel) {
            panel.style.borderColor = "#e74c3c";
            panel.style.boxShadow = "0 4px 20px rgba(231,76,60,0.4)";
        }
        if (statusDot) statusDot.className = "status-dot dot-disconnected";
        if (loginError) {
            loginError.textContent = message;
            loginError.style.color = "#e74c3c";
        }
    }

    function getRedemptionLog() {
        try {
            return JSON.parse(
                localStorage.getItem("stake_sniper_redemptions") || "{}",
            );
        } catch (e) {
            return {};
        }
    }

    function saveRedemption(code, success, message) {
        const log = getRedemptionLog();
        log[code] = { success, message, timestamp: Date.now() };
        const keys = Object.keys(log);
        if (keys.length > 100) {
            const oldest = keys
                .sort((a, b) => log[a].timestamp - log[b].timestamp)
                .slice(0, keys.length - 100);
            oldest.forEach((k) => delete log[k]);
        }
        localStorage.setItem("stake_sniper_redemptions", JSON.stringify(log));
    }

    function wasCodeAttempted(code) {
        const log = getRedemptionLog();
        return log[code] || null;
    }

    function getHardwareId() {
        let hwid = localStorage.getItem("stake_sniper_hwid");
        if (!hwid) {
            hwid =
                "us_" +
                Math.random().toString(36).substring(2) +
                Date.now().toString(36);
            localStorage.setItem("stake_sniper_hwid", hwid);
        }
        return hwid;
    }

    function formatLocalTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    function createUI() {
        const panel = document.createElement("div");
        panel.id = "sniper-panel";
        panel.innerHTML = `
            <style>
                #sniper-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 280px;
                    background: linear-gradient(135deg, #1a0d0d 0%, #1a1a1a 50%, #1a0d0d 100%);
                    border: 2px solid #e74c3c;
                    border-radius: 12px;
                    padding: 15px;
                    z-index: 999999;
                    font-family: system-ui, -apple-system, sans-serif;
                    color: #eee;
                    box-shadow: 0 4px 20px rgba(231,76,60,0.4);
                    cursor: default;
                    transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
                }
                #sniper-panel .drag-handle {
                    cursor: move;
                    padding: 5px 0;
                    margin: -5px -5px 10px -5px;
                    border-bottom: 1px solid #ffffff22;
                }
                #sniper-panel h3 {
                    margin: 0;
                    color: #fff;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: move;
                }
                #sniper-panel .status-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 13px;
                }
                #sniper-panel .status-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 6px;
                }
                #sniper-panel .dot-connected { background: #2ecc71; box-shadow: 0 0 8px #2ecc71; }
                #sniper-panel .dot-disconnected { background: #e74c3c; box-shadow: 0 0 8px #e74c3c; }
                #sniper-panel .dot-connecting { background: #f1c40f; box-shadow: 0 0 8px #f1c40f; }
                #sniper-panel .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 8px;
                    margin: 12px 0;
                }
                #sniper-panel .stat-box {
                    background: #1a1a1a;
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #333;
                }
                #sniper-panel .stat-box:first-child {
                    border-color: #2ecc7144;
                }
                #sniper-panel .stat-box:last-child {
                    border-color: #e74c3c44;
                }
                #sniper-panel .stat-value {
                    font-size: 20px;
                    font-weight: bold;
                    color: #fff;
                }
                #sniper-panel .stat-label {
                    font-size: 10px;
                    color: #888;
                    text-transform: uppercase;
                }
                #sniper-panel .btn-row {
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                }
                #sniper-panel button {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                    transition: all 0.2s;
                }
                #sniper-panel .btn-toggle {
                    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                    color: #fff;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }
                #sniper-panel .btn-toggle:hover {
                    box-shadow: 0 0 15px rgba(46,204,113,0.5);
                }
                #sniper-panel .btn-toggle.off {
                    background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
                    color: white;
                }
                #sniper-panel .btn-reconnect {
                    background: #1a1a1a;
                    color: #e74c3c;
                    border: 1px solid #e74c3c;
                }
                #sniper-panel .btn-reconnect:hover {
                    background: #2a1515;
                }
                #sniper-panel .history {
                    max-height: 120px;
                    overflow-y: auto;
                    margin-top: 12px;
                    font-size: 11px;
                    border: 1px solid #333;
                    border-radius: 6px;
                    background: #111;
                }
                #sniper-panel .history-item {
                    padding: 6px 8px;
                    margin: 4px;
                    border-radius: 4px;
                    background: #1a1a1a;
                }
                #sniper-panel .history-item.success { border-left: 3px solid #2ecc71; }
                #sniper-panel .history-item.failed { border-left: 3px solid #e74c3c; }
                #sniper-panel .history-item.pending { border-left: 3px solid #f1c40f; color: #f1c40f; }
                #sniper-panel .minimize-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 0;
                    width: 20px;
                }
                #sniper-panel .minimize-btn:hover {
                    color: #fff;
                }
                #sniper-panel .login-section { display: none; }
                #sniper-panel .login-section input { width: 100%; padding: 10px; background: #1a1a1a; border: 1px solid #f1c40f; border-radius: 6px; color: #eee; font-size: 13px; font-family: monospace; box-sizing: border-box; margin: 10px 0; }
                #sniper-panel .login-section input:focus { outline: none; border-color: #2ecc71; }
                #sniper-panel .login-section button { width: 100%; padding: 10px; background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); border: none; border-radius: 6px; color: white; font-weight: bold; cursor: pointer; }
                #sniper-panel .login-error { font-size: 12px; text-align: center; margin-top: 8px; }
                #sniper-panel .btn-external {
                    display: block;
                    width: 100%;
                    padding: 8px;
                    margin-top: 10px;
                    background: #111;
                    color: #3498db;
                    text-decoration: none;
                    text-align: center;
                    border: 1px solid #3498db44;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: bold;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                #sniper-panel .btn-external:hover {
                    background: #3498db11;
                    border-color: #3498db;
                }
            </style>
            <div class="drag-handle" id="dragHandle">
                <button class="minimize-btn" id="minimizeBtn">-</button>
                <h3><span class="status-dot dot-disconnected" id="statusDot"></span> Stake Bonus Claimer <span id="uptime" style="font-size:11px;color:#888;font-weight:normal">0:00</span></h3>
            </div>
            <div id="panelContent">
                <div class="status-row">
                    <span>Status:</span>
                    <span id="connectionStatus">Disconnected</span>
                </div>
                
                <div id="loginSection" class="login-section">
                    <input type="text" id="apiKeyInput" placeholder="Enter API key (sk_...)">
                    <button id="loginBtn">Connect</button>
                    <div id="loginError" class="login-error" style="color:#f1c40f">Enter API key to connect</div>
                    <a href="https://t.me/claimstake" target="_blank" class="btn-external">Get a Trial or Purchase Key</a>
                </div>
                
                <div id="mainContent">
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-value" id="statPushed">0</div>
                            <div class="stat-label">Codes</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value" id="statSuccess" style="color:#2ecc71">0</div>
                            <div class="stat-label">Success</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value" id="statFailed" style="color:#e74c3c">0</div>
                            <div class="stat-label">Failed</div>
                        </div>
                    </div>
                    <div class="btn-row">
                        <button class="btn-toggle" id="toggleBtn">ON</button>
                        <button class="btn-reconnect" id="reconnectBtn">Reconnect</button>
                    </div>
                    <div class="history" id="history">
                        <div style="color:#666;text-align:center;padding:10px;">No codes yet</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        document
            .getElementById("minimizeBtn")
            .addEventListener("click", function () {
                const content = document.getElementById("panelContent");
                if (content.style.display === "none") {
                    content.style.display = "block";
                    this.textContent = "-";
                } else {
                    content.style.display = "none";
                    this.textContent = "+";
                }
            });

        document
            .getElementById("toggleBtn")
            .addEventListener("click", function () {
                isEnabled = !isEnabled;
                this.textContent = isEnabled ? "ON" : "OFF";
                this.className = isEnabled ? "btn-toggle" : "btn-toggle off";
                log(isEnabled ? "Redeeming enabled" : "Redeeming disabled");
            });

        document
            .getElementById("reconnectBtn")
            .addEventListener("click", function () {
                log("Manual reconnect...");
                if (eventSource) {
                    eventSource.close();
                }
                connect();
            });

        // Login functionality
        const loginBtn = document.getElementById("loginBtn");
        const apiKeyInput = document.getElementById("apiKeyInput");

        loginBtn.addEventListener("click", async function () {
            const key = apiKeyInput.value.trim();
            if (!key) {
                setLoginError("Please enter an API key");
                return;
            }
            if (!key.startsWith("sk_")) {
                setLoginError("Invalid format (must start with sk_)");
                return;
            }

            setLoginPending();
            loginBtn.disabled = true;

            try {
                const response = await fetch(
                    MONITOR_URL + "/api-keys/validate",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ apikey: key }),
                    },
                );
                const data = await response.json();

                if (data.valid) {
                    setApiKey(key);
                    hideLoginMode();
                    log("API key saved");
                    connect();
                } else {
                    setLoginError("Invalid API key");
                    loginBtn.disabled = false;
                }
            } catch (e) {
                setLoginError("Connection error");
                loginBtn.disabled = false;
            }
        });

        apiKeyInput.addEventListener("input", function () {
            if (needsAuth) {
                const panel = document.getElementById("sniper-panel");
                const loginError = document.getElementById("loginError");
                panel.style.borderColor = "#f1c40f";
                panel.style.boxShadow = "0 4px 20px rgba(241,196,15,0.4)";
                document.getElementById("statusDot").className =
                    "status-dot dot-connecting";
                if (loginError) loginError.style.color = "#f1c40f";
            }
        });

        apiKeyInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") loginBtn.click();
        });

        // Drag functionality with smooth tweening
        const dragHandle = document.getElementById("dragHandle");
        let isDragging = false;
        let offsetX, offsetY;
        let targetX, targetY;
        let currentX, currentY;
        let animating = false;

        function smoothDrag() {
            if (!animating) return;
            const ease = 0.15;
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;
            panel.style.left = currentX + "px";
            panel.style.top = currentY + "px";

            if (
                Math.abs(targetX - currentX) > 0.5 ||
                Math.abs(targetY - currentY) > 0.5 ||
                isDragging
            ) {
                requestAnimationFrame(smoothDrag);
            } else {
                animating = false;
            }
        }

        dragHandle.addEventListener("mousedown", function (e) {
            if (e.target.id === "minimizeBtn") return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            currentX = rect.left;
            currentY = rect.top;
            targetX = currentX;
            targetY = currentY;
            panel.style.right = "auto";
            panel.style.left = currentX + "px";
            panel.style.top = currentY + "px";
            if (!animating) {
                animating = true;
                smoothDrag();
            }
        });

        document.addEventListener("mousemove", function (e) {
            if (!isDragging) return;
            targetX = e.clientX - offsetX;
            targetY = e.clientY - offsetY;
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
        });

        // Uptime counter
        const startTime = Date.now();
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            const hours = Math.floor(mins / 60);
            const displayMins = mins % 60;
            const uptimeEl = document.getElementById("uptime");
            if (uptimeEl) {
                uptimeEl.textContent =
                    hours > 0
                        ? `${hours}:${displayMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
                        : `${mins}:${secs.toString().padStart(2, "0")}`;
            }
        }, 1000);
    }

    function updateUI() {
        document.getElementById("statPushed").textContent = stats.pushed;
        document.getElementById("statSuccess").textContent = stats.successful;
        document.getElementById("statFailed").textContent = stats.failed;
    }

    function setConnected(state) {
        const dot = document.getElementById("statusDot");
        const status = document.getElementById("connectionStatus");
        const panel = document.getElementById("sniper-panel");
        if (state === "connecting") {
            dot.className = "status-dot dot-connecting";
            status.textContent = "Connecting";
            status.style.color = "#f1c40f";
            panel.style.borderColor = "#f1c40f";
            panel.style.boxShadow = "0 4px 20px rgba(241,196,15,0.4)";
            panel.style.background =
                "linear-gradient(135deg, #1a1a0d 0%, #1a1a1a 50%, #1a1a0d 100%)";
        } else if (state === true || state === "connected") {
            dot.className = "status-dot dot-connected";
            status.textContent = "Connected";
            status.style.color = "#2ecc71";
            panel.style.borderColor = "#2ecc71";
            panel.style.boxShadow = "0 4px 20px rgba(46,204,113,0.4)";
            panel.style.background =
                "linear-gradient(135deg, #0d1a0d 0%, #1a1a1a 50%, #0d1a0d 100%)";
        } else {
            dot.className = "status-dot dot-disconnected";
            status.textContent = "Disconnected";
            status.style.color = "#e74c3c";
            panel.style.borderColor = "#e74c3c";
            panel.style.boxShadow = "0 4px 20px rgba(231,76,60,0.4)";
            panel.style.background =
                "linear-gradient(135deg, #1a0d0d 0%, #1a1a1a 50%, #1a0d0d 100%)";
        }
    }

    function addToHistory(code, success, message, timestamp = null) {
        const history = document.getElementById("history");
        const time = timestamp
            ? formatLocalTime(timestamp)
            : new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
              });

        saveRedemption(code, success, message);

        if (history.querySelector('div[style*="color:#666"]')) {
            history.innerHTML = "";
        }

        redeemHistory.push({ code, success, message, time });
        if (redeemHistory.length > 20) redeemHistory.shift();

        const existingItem = history.querySelector(`[data-code="${code}"]`);
        if (existingItem) {
            existingItem.className = `history-item ${success ? "success" : "failed"}`;
            existingItem.innerHTML = `<strong>${time}</strong> ${code}<br><span style="color:${success ? "#00d4aa" : "#ff4444"}">${message}</span>`;
            return;
        }

        const item = document.createElement("div");
        item.className = `history-item ${success ? "success" : "failed"}`;
        item.dataset.code = code;
        item.innerHTML = `<strong>${time}</strong> ${code}<br><span style="color:${success ? "#00d4aa" : "#ff4444"}">${message}</span>`;
        history.insertBefore(item, history.firstChild);

        if (history.children.length > 10) {
            history.removeChild(history.lastChild);
        }
    }

    function showPendingStatus(code, message) {
        const history = document.getElementById("history");
        const time = new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        if (history.querySelector('div[style*="color:#666"]')) {
            history.innerHTML = "";
        }

        const existingItem = history.querySelector(`[data-code="${code}"]`);
        if (existingItem) {
            existingItem.className = "history-item pending";
            existingItem.innerHTML = `<strong>${time}</strong> ${code}<br><span style="color:#ffcc00">${message}</span>`;
            return;
        }

        const item = document.createElement("div");
        item.className = "history-item pending";
        item.dataset.code = code;
        item.innerHTML = `<strong>${time}</strong> ${code}<br><span style="color:#ffcc00">${message}</span>`;
        history.insertBefore(item, history.firstChild);

        if (history.children.length > 10) {
            history.removeChild(history.lastChild);
        }
    }

    function loadPendingHistory(historyItems) {
        const history = document.getElementById("history");
        history.innerHTML = "";
        redeemHistory = [];

        if (!historyItems || historyItems.length === 0) {
            history.innerHTML =
                '<div style="color:#666;text-align:center;padding:10px;">No codes yet</div>';
            return;
        }

        const items = historyItems.slice(0, 10).reverse();
        for (const item of items) {
            const attempt = wasCodeAttempted(item.code);
            if (attempt) {
                addHistoryItem(
                    item.code,
                    attempt.message,
                    item.timestamp,
                    attempt.success ? "success" : "failed",
                );
            } else {
                addHistoryItem(
                    item.code,
                    "Not attempted",
                    item.timestamp,
                    "pending",
                );
            }
        }
    }

    function addHistoryItem(code, message, timestamp, status = "pending") {
        const history = document.getElementById("history");
        const time = timestamp
            ? formatLocalTime(timestamp)
            : new Date().toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
              });

        if (history.querySelector('div[style*="color:#666"]')) {
            history.innerHTML = "";
        }

        const item = document.createElement("div");
        item.className = `history-item ${status}`;
        item.dataset.code = code;

        let color = "#f1c40f";
        if (status === "success") color = "#00d4aa";
        else if (status === "failed") color = "#ff4444";

        item.innerHTML = `<strong>${time}</strong> ${code}<br><span style="color:${color}">${message}</span>`;
        history.insertBefore(item, history.firstChild);

        if (history.children.length > 10) {
            history.removeChild(history.lastChild);
        }
    }

    function log(msg) {
        console.log(`[SNIPER] ${msg}`);
    }

    async function getTurnstileToken() {
        try {
            log("Requesting captcha token from server...");
            const hwid = getHardwareId();
            const apiKey = getApiKey();

            const response = await fetch(`${MONITOR_URL}/captcha/solve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hwid, apikey: apiKey }),
            });

            const data = await response.json();

            if (data.error === "invalid_api_key") {
                setApiKey(null);
                showLoginMode(
                    "Your API key is invalid. Please enter a new key.",
                );
                throw new Error("Invalid API key");
            }

            if (data.error === "session_invalid") {
                setApiKey(null);
                showLoginMode(
                    "Your session was replaced by another device. Please re-enter your API key.",
                );
                throw new Error("Session invalid");
            }

            if (!response.ok) {
                log(`Captcha error: ${data.error || "Unknown error"}`);
                return null;
            }

            if (data.token) {
                log("Got captcha token from server");
                return data.token;
            }

            return null;
        } catch (e) {
            log("Captcha request error: " + e.message);
            return null;
        }
    }

    function getSessionToken() {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (name === "session") {
                return value.replace(/"/g, "");
            }
        }
        return null;
    }

    function getLocale() {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (name === "locale") {
                return value.replace(/"/g, "");
            }
        }
        return "en";
    }

    async function callStakeAPI(
        operationName,
        operationType,
        query,
        variables,
        retries = 2,
    ) {
        const sessionToken = getSessionToken();
        if (!sessionToken) {
            throw new Error("Not logged in");
        }

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch("https://stake.com/_api/graphql", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": sessionToken,
                        "x-language": getLocale(),
                        "x-operation-name": operationName,
                        "x-operation-type": operationType,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        operationName,
                        variables,
                        query,
                    }),
                });
                return response;
            } catch (e) {
                if (attempt < retries) {
                    log(`Network error, retrying (${attempt}/${retries})...`);
                    await new Promise((r) => setTimeout(r, 1000));
                } else {
                    throw e;
                }
            }
        }
    }

    async function checkCodeStatus(code, couponType) {
        const query = `query BonusCodeInformation($code: String!, $couponType: CouponType!) {
            bonusCodeInformation(code: $code, couponType: $couponType) {
                availabilityStatus
                bonusValue
                cryptoMultiplier
            }
        }`;

        const response = await callStakeAPI(
            "BonusCodeInformation",
            "query",
            query,
            {
                code,
                couponType: couponType || "drop",
            },
        );

        return response.json();
    }

    async function redeemCode(code, couponType) {
        couponType = couponType || "drop";

        if (wasCodeAttempted(code)) {
            log(`Already tried: ${code}`);
            return;
        }

        stats.pushed++;
        updateUI();

        if (!isEnabled) {
            log(`Redeeming disabled, skipping: ${code}`);
            addToHistory(code, false, "Skipped (disabled)");
            return;
        }

        const sessionToken = getSessionToken();
        if (!sessionToken) {
            log("No session token - please log in");
            addToHistory(code, false, "Not logged in");
            stats.failed++;
            updateUI();
            return;
        }

        log(`Checking ${couponType}: ${code}`);

        try {
            const checkResult = await checkCodeStatus(code, couponType);

            if (checkResult?.errors?.length > 0) {
                const errorMsg =
                    checkResult.errors[0]?.message || "Unknown error";
                const errorType = checkResult.errors[0]?.errorType || "";
                stats.failed++;

                if (
                    errorType === "notFound" ||
                    errorMsg.includes("cannot be found")
                ) {
                    log(`Code not found: ${code}`);
                    addToHistory(code, false, "Code not found");
                } else {
                    log(`Error: ${errorMsg}`);
                    addToHistory(code, false, errorMsg);
                }
                updateUI();
                return;
            }

            const status =
                checkResult?.data?.bonusCodeInformation?.availabilityStatus;
            const bonusValue =
                checkResult?.data?.bonusCodeInformation?.bonusValue;

            log(`Code status: ${status}, value: ${bonusValue}`);

            if (status === "bonusCodeAvailable") {
                const valueMsg = bonusValue ? ` ($${bonusValue})` : "";
                log(`Code found${valueMsg}! Claiming...`);
            } else if (status === "bonusCodeInactive") {
                stats.failed++;
                log(`Invalid code: ${code}`);
                addToHistory(code, false, "Invalid/Inactive code");
                updateUI();
                return;
            } else if (status === "bonusCodeAlreadyClaimed") {
                stats.failed++;
                log(`Already claimed: ${code}`);
                addToHistory(code, false, "You already claimed this");
                updateUI();
                return;
            } else if (status === "bonusCodeFullyClaimed") {
                stats.failed++;
                log(`Code fully claimed: ${code}`);
                addToHistory(code, false, "Code fully claimed (limit reached)");
                updateUI();
                return;
            } else if (status === "bonusCodeNotFound") {
                stats.failed++;
                log(`Code not found: ${code}`);
                addToHistory(code, false, "Code does not exist");
                updateUI();
                return;
            } else {
                stats.failed++;
                log(`Unknown status: ${status}`);
                addToHistory(code, false, status || "Unknown error");
                updateUI();
                return;
            }

            log(`Redeeming: ${code}`);

            showPendingStatus(code, "Solving captcha...");
            log("Solving captcha...");

            const turnstileToken = await getTurnstileToken();
            if (!turnstileToken) {
                stats.failed++;
                log("Failed to get captcha token");
                addToHistory(code, false, "Captcha failed");
                updateUI();
                return;
            }

            showPendingStatus(code, "Captcha solved! Claiming...");
            log("Captcha solved! Claiming...");

            const claimQuery = `mutation ClaimBonusCode($code: String!, $currency: CurrencyEnum!, $turnstileToken: String!) {
                claimBonusCode(code: $code, currency: $currency, turnstileToken: $turnstileToken) {
                    bonusCode { id code }
                    amount
                    currency
                    redeemed
                }
            }`;

            const response = await callStakeAPI(
                "ClaimBonusCode",
                "mutation",
                claimQuery,
                {
                    code,
                    currency: "eth",
                    turnstileToken,
                },
            );

            if (response.status === 429) {
                const retryAfter = response.headers.get("retry-after") || "60";
                const msg = `Rate limited! Wait ${retryAfter}s`;
                stats.failed++;
                log(msg);
                addToHistory(code, false, msg);
                updateUI();
                return;
            }

            if (!response.ok) {
                const msg = `HTTP ${response.status}`;
                stats.failed++;
                log(`Failed: ${msg}`);
                addToHistory(code, false, msg);
                updateUI();
                return;
            }

            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (parseErr) {
                const msg = text.includes("<!DOCTYPE")
                    ? "Cloudflare blocked"
                    : "Invalid response";
                stats.failed++;
                log(`Error: ${msg}`);
                addToHistory(code, false, msg);
                updateUI();
                return;
            }

            if (result.data?.claimBonusCode) {
                const { amount, currency, redeemed } =
                    result.data.claimBonusCode;
                const msg = amount
                    ? `+${amount} ${currency}`
                    : redeemed
                      ? "Claimed!"
                      : "Success";
                stats.successful++;
                log(`SUCCESS: ${msg}`);
                addToHistory(code, true, msg);
            } else if (result.errors) {
                const errorMsg = result.errors[0]?.message || "Unknown error";
                stats.failed++;
                log(`Failed: ${errorMsg}`);
                addToHistory(code, false, errorMsg);
            } else {
                stats.failed++;
                log(`Unknown response`);
                addToHistory(code, false, "Unknown response");
            }
            updateUI();
        } catch (e) {
            stats.failed++;
            log(`Error: ${e.message}`);
            addToHistory(code, false, e.message);
            updateUI();
        }
    }

    let reconnectAttempts = 0;
    let lastPing = Date.now();
    let pingCheckInterval = null;
    let myClientId = null;
    let isConnecting = false;
    let reconnectTimeout = null;

    async function sendPong(clientId) {
        try {
            const response = await fetch(`${MONITOR_URL}/pong`, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientId }),
            });
            const data = await response.json();
            if (data.error === "session_invalid") {
                log("Session invalidated by server");
                setApiKey(null);
                if (eventSource) eventSource.close();
                eventSource = null;
                isConnecting = false;
                setConnected(false);
                showLoginMode(
                    "Your session was replaced by another device. Please re-enter your API key.",
                );
            }
        } catch (e) {}
    }

    async function connect() {
        const apiKey = getApiKey();
        if (!apiKey) {
            showLoginMode("Please enter your API key to connect");
            return;
        }

        if (isConnecting) {
            return;
        }
        isConnecting = true;

        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = null;
        }

        log("Validating API key...");
        setConnected("connecting");

        try {
            const validateRes = await fetch(
                `${MONITOR_URL}/api-keys/validate`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ apikey: apiKey }),
                },
            );
            const validateData = await validateRes.json();

            if (!validateData.valid) {
                isConnecting = false;
                setApiKey(null);
                setConnected(false);
                showLoginMode("Your API key is invalid or has been revoked");
                return;
            }
        } catch (e) {
            isConnecting = false;
            log("Validation error: " + e.message);
            setConnected(false);
            reconnect();
            return;
        }

        log("Connecting to monitor...");

        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }

        if (pingCheckInterval) {
            clearInterval(pingCheckInterval);
            pingCheckInterval = null;
        }

        const hwid = getHardwareId();
        eventSource = new EventSource(
            `${MONITOR_URL}/events?hwid=${hwid}&type=userscript&apikey=${encodeURIComponent(apiKey)}`,
        );

        eventSource.onopen = () => {
            isConnecting = false;
            reconnectAttempts = 0;
            lastPing = Date.now();
            log("Connected!");
            setConnected(true);

            pingCheckInterval = setInterval(() => {
                const timeSincePing = Date.now() - lastPing;
                if (timeSincePing > 90000) {
                    log("No ping for 90s, reconnecting...");
                    if (eventSource) eventSource.close();
                    reconnect();
                }
            }, 15000);
        };

        eventSource.onmessage = (event) => {
            lastPing = Date.now();
            try {
                const data = JSON.parse(event.data);
                if (data.type === "connected") {
                    if (data.clientId) {
                        myClientId = data.clientId;
                        log(`Assigned client ID: ${myClientId}`);
                        sendPong(myClientId);
                    }
                    if (data.history && data.history.length > 0) {
                        loadPendingHistory(data.history);
                        log(`Loaded ${data.history.length} pending codes`);
                    }
                    return;
                }
                if (data.type === "invalid_api_key") {
                    log("API key invalid or revoked");
                    setApiKey(null);
                    if (eventSource) eventSource.close();
                    eventSource = null;
                    isConnecting = false;
                    setConnected(false);
                    showLoginMode(
                        "Your API key has been revoked. Please enter a new key.",
                    );
                    return;
                }
                if (data.type === "api_key_expired") {
                    log("API key expired");
                    setApiKey(null);
                    if (eventSource) eventSource.close();
                    eventSource = null;
                    isConnecting = false;
                    setConnected(false);
                    showLoginMode(
                        "Your API key has expired. Please enter a new key.",
                    );
                    return;
                }
                if (
                    data.type === "duplicate_session" ||
                    data.type === "kicked"
                ) {
                    log(
                        "Duplicate session: " +
                            (data.message || "Another device connected"),
                    );
                    setApiKey(null);
                    if (eventSource) eventSource.close();
                    eventSource = null;
                    isConnecting = false;
                    setConnected(false);
                    showLoginMode(
                        "Another device connected with your API key. Please re-enter to continue.",
                    );
                    return;
                }
                if (data.type === "ping" && data.clientId) {
                    sendPong(data.clientId);
                    return;
                }
                if (data.type === "stats") {
                    return;
                }
                if (data.code) {
                    const typeLabel =
                        data.couponType === "bonus" ? "[BONUS]" : "[DROP]";
                    log(`Received ${typeLabel}: ${data.code}`);
                    redeemCode(data.code, data.couponType);
                }
            } catch (e) {
                log(`Parse error: ${e.message}`);
            }
        };

        eventSource.onerror = (e) => {
            if (eventSource.readyState === EventSource.CLOSED) {
                isConnecting = false;
                setConnected(false);
                if (pingCheckInterval) {
                    clearInterval(pingCheckInterval);
                    pingCheckInterval = null;
                }
                eventSource = null;
                reconnect();
            }
        };
    }

    function reconnect() {
        if (isConnecting || reconnectTimeout || needsAuth || !getApiKey()) {
            return;
        }
        reconnectAttempts++;
        const delay = Math.min(5000 * reconnectAttempts, 30000);
        const statusEl = document.getElementById("connectionStatus");
        if (statusEl) {
            statusEl.textContent = `Reconnecting (${reconnectAttempts})...`;
        }
        log(
            `Reconnecting in ${delay / 1000}s (attempt ${reconnectAttempts})...`,
        );
        reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            if (!needsAuth && getApiKey()) {
                connect();
            }
        }, delay);
    }

    function init() {
        createUI();

        const apiKey = getApiKey();
        if (!apiKey) {
            showLoginMode("Please enter your API key to connect");
        } else {
            setTimeout(connect, 500);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
