// ==UserScript==
// @name         Crowdin CSRF Interceptor
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Intercept Crowdin backend requests and display cookie and CSRF token
// @match        https://crowdin.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556222/Crowdin%20CSRF%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/556222/Crowdin%20CSRF%20Interceptor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PREFIX = "/backend/";
    let cookie = '', csrf = '';
    let triggerBtn = null, popup = null;

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log("%c[Crowdin] Copied to clipboard", "color: #10b981");
        });
    }

    function createTriggerButton() {
        if (triggerBtn) return;
        
        triggerBtn = document.createElement("button");
        Object.assign(triggerBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999998',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontSize: '20px',
            display: 'none',
            transition: 'transform 0.2s, background 0.2s',
            fontFamily: 'monospace'
        });
        triggerBtn.textContent = '🔑';
        triggerBtn.title = 'Show Tokens';
        
        triggerBtn.onmouseover = () => triggerBtn.style.transform = 'scale(1.1)';
        triggerBtn.onmouseout = () => triggerBtn.style.transform = 'scale(1)';
        triggerBtn.onclick = showPopup;
        
        document.body.appendChild(triggerBtn);
    }

    function showPopup() {
        if (!cookie || !csrf || popup) return;

        popup = document.createElement("div");
        Object.assign(popup.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.9)',
            opacity: '0',
            zIndex: '999999',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            width: '420px',
            maxWidth: '90vw',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            color: '#111827',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });

        const escape = s => s.replace(/"/g, '&quot;');
        const inputStyle = 'flex:1;padding:8px 12px;margin-top:6px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;font-family:monospace;background:#f9fafb;color:#111827';
        const btnStyle = 'padding:8px 12px;margin-top:6px;margin-left:8px;background:#111827;color:#ffffff;border:none;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;transition:background 0.2s;white-space:nowrap';

        popup.innerHTML = `
            <div style="font-size:18px;font-weight:600;margin-bottom:20px;color:#111827">Token Captured</div>
            <div style="margin-bottom:20px">
                <label style="display:block;font-weight:500;margin-bottom:6px;color:#374151">Cookie</label>
                <div style="display:flex;align-items:flex-start">
                    <input readonly value="${escape(cookie)}" style="${inputStyle}">
                    <button class="copy-cookie" style="${btnStyle}" onmouseover="this.style.background='#1f2937'" onmouseout="this.style.background='#111827'">Copy</button>
                </div>
            </div>
            <div style="margin-bottom:24px">
                <label style="display:block;font-weight:500;margin-bottom:6px;color:#374151">CSRF Token</label>
                <div style="display:flex;align-items:flex-start">
                    <input readonly value="${escape(csrf)}" style="${inputStyle}">
                    <button class="copy-csrf" style="${btnStyle}" onmouseover="this.style.background='#1f2937'" onmouseout="this.style.background='#111827'">Copy</button>
                </div>
            </div>
            <button class="close-btn" style="width:100%;padding:10px 16px;background:#f3f4f6;color:#111827;border:none;border-radius:6px;font-weight:500;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">Close</button>
        `;

        popup.querySelector('.copy-cookie').onclick = () => copyToClipboard(cookie);
        popup.querySelector('.copy-csrf').onclick = () => copyToClipboard(csrf);
        popup.querySelector('.close-btn').onclick = hidePopup;

        document.body.appendChild(popup);
        
        requestAnimationFrame(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    function hidePopup() {
        if (!popup) return;
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            popup?.remove();
            popup = null;
        }, 300);
    }

    function handleCapture(newCookie, newCsrf) {
        cookie = newCookie;
        csrf = newCsrf;
        console.log("%c[Crowdin] Cookie:", "color: #3b82f6", cookie);
        console.log("%c[Crowdin] CSRF:", "color: #10b981", csrf);
        
        if (!triggerBtn) {
            const checkBody = setInterval(() => {
                if (document.body) {
                    clearInterval(checkBody);
                    createTriggerButton();
                    triggerBtn.style.display = 'block';
                }
            }, 100);
        } else {
            triggerBtn.style.display = 'block';
        }
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(_, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener("load", () => {
            if (this._url?.startsWith(PREFIX)) {
                const token = this.__sentry_xhr_v2__?.request_headers?.["x-csrf-token"];
                if (token) handleCapture(document.cookie, token);
            }
        });
        return originalSend.apply(this, arguments);
    };
})();
