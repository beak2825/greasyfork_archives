// ==UserScript==
// @name NXLinks Turnstile Inert Verify + Show URL with Copy
// @namespace nxlinks-turnstile-final
// @version 5.0
// @description Load only Turnstile, submit token to backend, show URL with copy button (NO redirect)
// @match https://go.nxlinks.site/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/561141/NXLinks%20Turnstile%20Inert%20Verify%20%2B%20Show%20URL%20with%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/561141/NXLinks%20Turnstile%20Inert%20Verify%20%2B%20Show%20URL%20with%20Copy.meta.js
// ==/UserScript==
(function () {
    'use strict';
    /* ========= CONFIG ========= */
    const SITEKEY = "0x4AAAAAACJMB1_RfxHtOMMU";
    const API_URL = "https://backend.nxlinks.site/api";
    let token = null;
    /* ========= RESET BODY ========= */
    function resetBody() {
        document.body.innerHTML = `
            <style>
                body {
                    margin:0;
                    height:100vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#020617;
                    font-family:system-ui,monospace;
                    color:#e5e7eb;
                }
                .box {
                    background:#020617;
                    border:1px solid #334155;
                    padding:24px;
                    border-radius:8px;
                    text-align:center;
                    box-shadow:0 0 20px rgba(0,0,0,.5);
                    width:360px;
                }
                textarea, #url-display {
                    width:100%;
                    height:80px;
                    margin-top:10px;
                    background:#000;
                    color:#22c55e;
                    border:1px solid #334155;
                    font-size:11px;
                    resize:none;
                }
                #url-container {
                    margin-top:12px;
                    display:none;
                }
                button {
                    margin-top:8px;
                    padding:8px 16px;
                    background:#22c55e;
                    color:#000;
                    border:none;
                    border-radius:4px;
                    cursor:pointer;
                    font-weight:bold;
                }
                button:hover {
                    background:#16a34a;
                }
                .status {
                    margin-top:12px;
                    color:#94a3b8;
                }
            </style>
            <div class="box">
                <h3>Verify Access</h3>
                <div id="cf-box" style="margin:16px 0"></div>
                <textarea id="token" placeholder="Token will appear here" readonly></textarea>
                <div id="url-container">
                    <textarea id="url-display" readonly placeholder="Verified URL will appear here"></textarea>
                    <button id="copy-btn">Copy URL</button>
                </div>
                <div id="status" class="status">Waiting for verification…</div>
            </div>
        `;
    }
    /* ========= LOAD TURNSTILE ========= */
    function loadTurnstile() {
        if (document.querySelector("script[src*='turnstile']")) return;
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
    }
    /* ========= BACKEND VERIFY ========= */
    async function verifyWithBackend(token) {
        const statusEl = document.getElementById("status");
        if (statusEl) statusEl.textContent = "Verifying securely…";
        // HASH (site.com/abc → abc)
        const hash = location.pathname.replace(/^\/+|\/+$/g, "");
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    path: "/" + hash,
                    turnstile_token: token
                })
            });
            if (!res.ok) throw new Error("HTTP " + res.status);
            const data = await res.json();
            if (data?.success && data?.url) {
                if (statusEl) statusEl.textContent = "Verification successful!";
                const urlContainer = document.getElementById("url-container");
                const urlDisplay = document.getElementById("url-display");
                const copyBtn = document.getElementById("copy-btn");
                if (urlContainer && urlDisplay) {
                    urlDisplay.value = data.url;
                    urlContainer.style.display = "block";
                }
                if (copyBtn) {
                    copyBtn.onclick = function () {
                        navigator.clipboard.writeText(data.url).then(() => {
                            copyBtn.textContent = "Copied!";
                            setTimeout(() => { copyBtn.textContent = "Copy URL"; }, 2000);
                        });
                    };
                }
                return;
            }
            if (statusEl) statusEl.textContent = "Invalid or expired link";
        } catch (err) {
            console.error("[NXLinks Verify Error]", err);
            if (statusEl) statusEl.textContent = "Server error, try again";
        }
    }
    /* ========= RENDER TURNSTILE ========= */
    function renderTurnstile() {
        const box = document.getElementById("cf-box");
        if (!window.turnstile || box.dataset.rendered) return;
        box.dataset.rendered = "1";
        window.turnstile.render("#cf-box", {
            sitekey: SITEKEY,
            theme: "dark",
            callback: function (t) {
                token = t;
                document.getElementById("token").value = t;
                verifyWithBackend(t);
            }
        });
    }
    /* ========= START ========= */
    resetBody();
    loadTurnstile();
    const wait = setInterval(() => {
        if (window.turnstile) {
            renderTurnstile();
            clearInterval(wait);
        }
    }, 50);
})();