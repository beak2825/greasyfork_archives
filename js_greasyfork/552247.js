// ==UserScript==
// @name         The Ugvs Auto Message V3
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  You Can Do Auto Message And Raid Server
// @match        *://discord.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/552247/The%20Ugvs%20Auto%20Message%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/552247/The%20Ugvs%20Auto%20Message%20V3.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const ENCRYPTION_KEY = "super_secret_internal_key_123";
    const html = `
    <div id="dms-wrapper" style="position:fixed;top:50px;right:50px;z-index:9999;background:#51fcf4;color:white;border-radius:8px;font-size:13px;width:300px;box-shadow:0 0 8px rgba(0,0,0,0.6);user-select:none;font-family:Arial,sans-serif;">
      <div id="dms-titlebar" style="cursor:move;background:#27b0cf;padding:6px 10px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center;user-select:none;">
        <span style="font-weight:bold;">The Ugvs Auto Message V3</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <span id="dms-status" style="font-weight:bold;color:#ff4d4d;">Stop</span>
          <button id="dms-toggle" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;line-height:1;">−</button>
        </div>
      </div>
      <div id="dms-body" style="padding:10px 12px;display:flex;flex-direction:column;gap:6px;user-select:text;">
        <div>
          <label style="font-weight:bold;">Discord Account Tokens:</label>
          <div id="dms-tokens-container" style="max-height:130px;overflow-y:auto;border:1px solid #7cfcf6;padding:4px;border-radius:4px;margin-top:3px;"></div>
          <button id="dms-add-token" style="margin-top:4px;width:100%;height:28px;font-weight:bold;cursor:pointer;">＋ Add Discord Account Token</button>
          <button id="dms-gettoken" style="margin-top:5px;width:100%;height:28px;">Get Discord Account Token</button>
        </div>
        <div>
          <label style="font-weight:bold;">Server Channel ID:</label><br>
          <input id="dms-channel" style="width:100%;height:26px;margin-top:3px;"/>
          <button id="dms-getchannelid" style="margin-top:5px;width:100%;height:28px;">Get Server Channel ID</button>
        </div>
        <div>
          <label style="font-weight:bold;">Message:</label><br>
          <textarea id="dms-message" style="width:100%;height:50px;resize:vertical;margin-top:3px;"></textarea>
        </div>
        <div>
          <label style="font-weight:bold;">Interval (ms):</label><br>
          <input type="number" id="dms-interval" style="width:100%;height:26px;margin-top:3px;"/>
        </div>
      </div>
      <div id="dms-sendstop-container" style="display:flex;gap:8px;justify-content:flex-start;align-items:center;padding:8px 12px;border-top:1px solid #444;">
        <button id="dms-send" style="flex:1;height:30px;">Send</button>
        <button id="dms-stop" disabled style="flex:1;height:30px;">Stop</button>
      </div>
      <div id="dms-bypass-container" style="display:flex;gap:8px;align-items:center;font-size:13px;user-select:none;padding:0 12px 8px 12px;">
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;margin:0;">
          <input type="checkbox" id="dms-bypass" style="margin:0;vertical-align:middle;">Bypass
        </label>
        <label style="display:flex;align-items:center;gap:4px;cursor:default;margin:0;">
          <span>txt num:</span>
          <input type="number" id="dms-bypass-length" value="8" min="1" max="64" style="width:48px;height:24px;padding:2px 4px;text-align:center;"/>
        </label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;margin:0 0 0 8px;">
          <input type="checkbox" id="dms-splitmsg" style="margin:0;vertical-align:middle;">Return it
        </label>
      </div>
      <div style="display:flex;gap:8px;justify-content:center;padding:8px 12px;">
        <button id="dms-load" style="flex:1;height:28px;"> Load</button>
        <button id="dms-save" style="flex:1;height:28px;"> Save</button>
      </div>
      <div id="dms-log" style="max-height:90px;overflow:auto;background:#85d6bb;padding:6px;border-radius:4px;font-size:11px;margin:10px 12px 10px 12px;line-height:1.2;"></div>
    </div>`;

    let intervalId = null, currentTokenIndex = 0, simpleMode = false;

    // 改行分割メッセージ管理用
    let splitMessages = [];
    let splitMessageIndex = 0;

    const storedTokens = (() => {
        let val = localStorage.getItem("token") || "";
        val = val.replace(/^"(.*)"$/, "$1");
        return val.split(",").map(s => s.trim()).filter(Boolean);
    })();

    function log(msg, isError = false) {
        const logBox = document.getElementById("dms-log");
        if (!logBox) return;
        const line = document.createElement("div");
        line.style.color = isError ? "#ff4d4d" : "#80ff80";
        line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
    }

    function setStatus(running) {
        const el = document.getElementById("dms-status");
        if (!el) return;
        if (running) {
            el.textContent = "Running";
            el.style.color = "#80ff80";
        } else {
            el.textContent = "Stop";
            el.style.color = "#ff4d4d";
        }
    }

    function encryptData(data, key) {
        const json = JSON.stringify(data);
        return CryptoJS.AES.encrypt(json, key).toString();
    }

    function decryptData(ciphertext, key) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        const json = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(json);
    }

    async function loadFromFile() {
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Discord Send Config File',
                    accept: { 'application/octet-stream': ['.dis'] }
                }],
                multiple: false
            });
            const file = await handle.getFile();
            const text = await file.text();
            const decrypted = decryptData(text, ENCRYPTION_KEY);
            const tokens = decrypted.tokens || (decrypted.token ? [decrypted.token] : []);
            const container = document.getElementById("dms-tokens-container");
            container.innerHTML = "";
            for (const t of tokens) addTokenInput(t);
            document.getElementById("dms-channel").value = decrypted.channel || "";
            document.getElementById("dms-message").value = decrypted.message || "";
            document.getElementById("dms-interval").value = decrypted.interval || "";
            log("Loaded settings in files");
        } catch (e) {
            log("Failed to load settings in files", true);
        }
    }

    function downloadToFile() {
        try {
            const tokens = Array.from(document.querySelectorAll(".dms-token-input")).map(input => input.value).filter(Boolean);
            const data = {
                tokens,
                channel: document.getElementById("dms-channel").value,
                message: document.getElementById("dms-message").value,
                interval: document.getElementById("dms-interval").value
            };
            const encrypted = encryptData(data, ENCRYPTION_KEY);
            const blob = new Blob([encrypted], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'dispam_config.dis';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            log("File download started");
        } catch (e) {
            log("Failed to download files: " + e.message, true);
        }
    }

    function generateRandomChars(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        return result;
    }

    async function sendMessage() {
        const channelId = document.getElementById("dms-channel").value;
        let message = document.getElementById("dms-message").value;
        const bypassChecked = document.getElementById("dms-bypass")?.checked || false;
        const bypassLength = parseInt(document.getElementById("dms-bypass-length").value) || 8;
        const splitChecked = document.getElementById("dms-splitmsg")?.checked || false;

        if (!channelId) return;

        if (splitChecked) {
            if (splitMessages.length === 0) {
                splitMessages = message.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
                splitMessageIndex = 0;
                if (splitMessages.length === 0) return;
            }
            message = splitMessages[splitMessageIndex];
            splitMessageIndex++;
            if (splitMessageIndex >= splitMessages.length) {
                splitMessageIndex = 0;
            }
        }

        if (!message) return;

        const tokens = Array.from(document.querySelectorAll(".dms-token-input")).map(input => input.value).filter(Boolean);
        if (tokens.length === 0) return;
        const token = tokens[currentTokenIndex];
        currentTokenIndex = (currentTokenIndex + 1) % tokens.length;

        let sendMsg = message;
        if (bypassChecked) sendMsg += ' ' + generateRandomChars(bypassLength);

        try {
            const response = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: sendMsg })
            });
            const json = await response.json().catch(() => ({}));
            if (response.status === 200) {
                log("✔Message Sended");
            } else if (response.status === 429) {
                log("⚠Rate Limit: retry_after=" + json.retry_after + "ms", true);
            } else {
                log(`❌️Failed to send: ${response.status}`, true);
            }
        } catch (err) {
            log("❌️Failed to send: " + err.message, true);
        }

        if (!splitChecked) {
            splitMessages = [];
            splitMessageIndex = 0;
        }
    }

    function startSending() {
        currentTokenIndex = 0;
        splitMessages = [];
        splitMessageIndex = 0;
        const interval = parseInt(document.getElementById("dms-interval").value) || 1000;
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(sendMessage, interval);
        document.getElementById("dms-send").disabled = true;
        document.getElementById("dms-stop").disabled = false;
        setStatus(true);
        log("Send starting...");
    }

    function stopSending() {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        document.getElementById("dms-send").disabled = false;
        document.getElementById("dms-stop").disabled = true;
        setStatus(false);
        log("Stop sending...");

        splitMessages = [];
        splitMessageIndex = 0;
    }

    function getChannelIdFromUrl() {
        const url = window.location.href;
        const match = url.match(/discord\.com\/channels\/\d+\/(\d+)/);
        return (match && match[1]) ? match[1] : null;
    }

    function addTokenInput(value = "") {
        const container = document.getElementById("dms-tokens-container");
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.gap = "4px";
        wrapper.style.marginBottom = "3px";
        const input = document.createElement("input");
        input.type = "text";
        input.className = "dms-token-input";
        input.style.flexGrow = "1";
        input.style.width = "100%";
        input.style.height = "24px";
        input.value = value;
        const delBtn = document.createElement("button");
        delBtn.textContent = "×";
        delBtn.style.width = "26px";
        delBtn.style.height = "24px";
        delBtn.style.cursor = "pointer";
        delBtn.title = "このtokenを削除";
        delBtn.onclick = () => container.removeChild(wrapper);
        wrapper.appendChild(input);
        wrapper.appendChild(delBtn);
        container.appendChild(wrapper);
    }

    function toggleSimpleMode() {
        const body = document.getElementById("dms-body");
        const sendStop = document.getElementById("dms-sendstop-container");
        const bypass = document.getElementById("dms-bypass-container");
        const loadSave = bypass.nextElementSibling; // 読み込み・保存ボタン
        const logBox = document.getElementById("dms-log");
        const toggleBtn = document.getElementById("dms-toggle");
        if (!simpleMode) {
            // シンプルモード：トークン・チャネル・メッセージ等は非表示
            body.style.display = "none";
            sendStop.style.display = "flex";
            bypass.style.display = "none";
            if (loadSave) loadSave.style.display = "none";
            logBox.style.display = "block";
            toggleBtn.textContent = "+";
            simpleMode = true;
        } else {
            // フル表示モード
            body.style.display = "flex";
            sendStop.style.display = "flex";
            bypass.style.display = "flex";
            if (loadSave) loadSave.style.display = "flex";
            logBox.style.display = "block";
            toggleBtn.textContent = "−";
            simpleMode = false;
        }
    }

    function createUI() {
        if (document.getElementById("dms-wrapper")) return;
        document.body.insertAdjacentHTML('beforeend', html);
        document.getElementById("dms-send").onclick = startSending;
        document.getElementById("dms-stop").onclick = stopSending;
        document.getElementById("dms-load").onclick = loadFromFile;
        document.getElementById("dms-save").onclick = downloadToFile;
        document.getElementById("dms-add-token").onclick = () => addTokenInput("");
        document.getElementById("dms-gettoken").onclick = () => {
            if (storedTokens.length > 0) {
                const container = document.getElementById("dms-tokens-container");
                const inputs = container.querySelectorAll(".dms-token-input");
                if (inputs.length === 0) addTokenInput(storedTokens[0]);
                else if (!inputs[0].value.trim()) inputs[0].value = storedTokens[0];
                log("Pasted Token");
            } else {
                log("Couldn't found Token", true);
            }
        };
        document.getElementById("dms-getchannelid").onclick = () => {
            const id = getChannelIdFromUrl();
            if (id) {
                document.getElementById("dms-channel").value = id;
                log("Pasted ChannelID");
            } else {
                log("Couldn't found ChannelID", true);
            }
        };
        document.getElementById("dms-toggle").onclick = toggleSimpleMode;

        const wrapper = document.getElementById("dms-wrapper");
        const title = document.getElementById("dms-titlebar");
        let isDragging = false, offsetX = 0, offsetY = 0;
        title.addEventListener("mousedown", e => {
            isDragging = true;
            offsetX = e.clientX - wrapper.offsetLeft;
            offsetY = e.clientY - wrapper.offsetTop;
            e.preventDefault();
        });
        document.addEventListener("mousemove", e => {
            if (!isDragging) return;
            wrapper.style.left = (e.clientX - offsetX) + "px";
            wrapper.style.top = (e.clientY - offsetY) + "px";
            wrapper.style.right = "auto";
        });
        document.addEventListener("mouseup", () => { isDragging = false; });

        setStatus(false);
        addTokenInput("");
    }

    if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(createUI, 100);
    else window.addEventListener("DOMContentLoaded", () => setTimeout(createUI, 100));
    setInterval(() => { if (!document.getElementById("dms-wrapper")) createUI(); }, 2000);
})();