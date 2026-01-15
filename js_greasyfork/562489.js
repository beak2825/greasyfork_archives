// ==UserScript==
// @name         ouo.io bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass ouo.io
// @author       AlfiDev
// @match        https://ouo.io/*
// @match        https://ouo.press/*
// @match        https://*.ouo.io/*
// @match        https://*.ouo.press/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562489/ouoio%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/562489/ouoio%20bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let running = true;
    let currentUrl = location.href;
    let submitCount = 0;
    let pageChangeDetected = false;

    console.log('🚀 ouo.io Bypass UI Modern');

    /* ================= UI ================= */

    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'ouo-modern-ui';
        ui.innerHTML = `
        <div style="
            position:fixed;
            top:20px;
            right:20px;
            width:300px;
            padding:16px;
            border-radius:14px;
            background:rgba(20,20,30,0.85);
            backdrop-filter: blur(12px);
            color:#fff;
            font-family: Inter, Arial, sans-serif;
            box-shadow:0 10px 30px rgba(0,0,0,.4);
            z-index:999999;
        ">
            <div style="font-size:16px;font-weight:600;margin-bottom:10px;">
                🚀 ouo.io Bypass
            </div>

            <div id="status-text" style="
                padding:10px;
                border-radius:10px;
                background:linear-gradient(135deg,#6366f1,#8b5cf6);
                font-size:13px;
                margin-bottom:8px;
            ">
                Initializing...
            </div>

            <div id="url-monitor" style="
                font-size:11px;
                opacity:.8;
                margin-bottom:6px;
                word-break:break-all;
            ">
                URL: ${currentUrl.slice(0, 60)}...
            </div>

            <div id="submit-counter" style="
                font-size:12px;
                font-weight:600;
                margin-bottom:10px;
            ">
                Attempts: 0
            </div>

            <div style="
                font-size:10px;
                text-align:center;
                opacity:.6;
                border-top:1px solid rgba(255,255,255,.1);
                padding-top:6px;
            ">
                Created by CloudkuImages v1.0
            </div>
        </div>`;
        document.body.appendChild(ui);
    }

    function updateUI(status, counter = null, success = false) {
        const statusEl = document.getElementById('status-text');
        const counterEl = document.getElementById('submit-counter');
        const urlEl = document.getElementById('url-monitor');

        if (statusEl) {
            statusEl.textContent = status;
            if (success) {
                statusEl.style.background =
                    'linear-gradient(135deg,#22c55e,#16a34a)';
            }
        }

        if (counter !== null && counterEl) {
            counterEl.textContent = `Attempts: ${counter}`;
        }

        if (urlEl) {
            urlEl.textContent = `URL: ${location.href.slice(0, 60)}...`;
        }

        console.log('📊', status);
    }

    /* ============= Page Change Detection ============= */

    function detectPageChange() {
        const watcher = setInterval(() => {
            if (!running) return clearInterval(watcher);

            if (location.href !== currentUrl) {
                running = false;
                pageChangeDetected = true;
                updateUI('Success! Page changed 🎉', submitCount, true);
                clearInterval(watcher);
            }
        }, 500);

        window.addEventListener('beforeunload', () => {
            if (running) updateUI('Redirecting...');
        });
    }

    /* ================= Actions ================= */

    function clickHuman() {
        const buttons = document.querySelectorAll(
            'button,input[type="submit"],div[role="button"]'
        );

        for (const btn of buttons) {
            const text = (btn.textContent || btn.value || '').toLowerCase();
            if (
                (text.includes('human') ||
                    text.includes('verify') ||
                    text.includes('robot')) &&
                btn.offsetParent !== null &&
                !btn.disabled
            ) {
                updateUI('Clicking human verification...');
                btn.click();
                return true;
            }
        }
        return false;
    }

    function submitFormGo() {
        if (!running || pageChangeDetected) return;

        submitCount++;
        updateUI(`Searching form-go...`, submitCount);

        const form = document.getElementById('form-go');
        if (form) {
            updateUI('Submitting form-go...', submitCount);
            try {
                form.submit();
                setTimeout(() => {
                    const btn = form.querySelector('button,input[type="submit"]');
                    if (btn && !btn.disabled) btn.click();
                }, 200);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /* ================= Main ================= */

    function start() {
        createUI();
        updateUI('Script started');
        detectPageChange();

        setTimeout(clickHuman, 2000);

        const loop = setInterval(() => {
            if (!running || submitCount >= 30) {
                clearInterval(loop);
                if (submitCount >= 30) {
                    updateUI('Stopped after 30 attempts');
                }
                return;
            }
            submitFormGo();
        }, 2000);
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', start)
        : start();
})();
