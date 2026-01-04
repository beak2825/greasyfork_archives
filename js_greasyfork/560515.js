// ==UserScript==
// @name         reCAPTCHA Token Viewer (v2 + v3 FINAL SYNC)
// @namespace    recaptcha-token-viewer-combined
// @version      13
// @description  View reCAPTCHA v2 checkbox or v3 invisible token (NO BYPASS)
// @match        https://dd-protect.vercel.app/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560515/reCAPTCHA%20Token%20Viewer%20%28v2%20%2B%20v3%20FINAL%20SYNC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560515/reCAPTCHA%20Token%20Viewer%20%28v2%20%2B%20v3%20FINAL%20SYNC%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SITE_KEY_V2 = '6LfLxrErAAAAANjGM_Mk4KJbXxozIp8QgkScB40I';
    const SITE_KEY_V3 = '6LfbKLMrAAAAALeMYoCThijXb1zcn_OhwegRPhHt';

    const V3_REFRESH_INTERVAL = 5000;
    let v3Timer = null;

    /* ---------- UI ---------- */
    document.body.innerHTML = `
    <div style="max-width:620px;margin:60px auto;background:#0f172a;color:#e5e7eb;
        padding:25px;border-radius:12px;font-family:Arial,sans-serif">

        <h2>reCAPTCHA Token Viewer</h2>

        <select id="type" style="width:100%;padding:8px">
            <option value="">-- Select reCAPTCHA --</option>
            <option value="v2">reCAPTCHA v2 (Checkbox)</option>
            <option value="v3">reCAPTCHA v3 (Invisible)</option>
        </select>

        <p id="info" style="font-size:12px;opacity:.8;margin-top:8px"></p>

        <div id="captcha" style="margin-top:12px"></div>

        <textarea id="token" readonly
            style="width:100%;height:150px;font-size:11px;margin-top:12px"
            placeholder="Token will appear here..."></textarea>

        <button id="copy" disabled style="margin-top:10px">Copy Token</button>
    </div>
    `;

    const selector = document.getElementById('type');
    const info = document.getElementById('info');
    const captcha = document.getElementById('captcha');
    const tokenBox = document.getElementById('token');
    const copyBtn = document.getElementById('copy');

    /* ---------- COPY ---------- */
    copyBtn.onclick = () => {
        tokenBox.select();
        navigator.clipboard.writeText(tokenBox.value);
    };

    /* ---------- CLEANUP ---------- */
    function clearRecaptcha() {
        document.querySelectorAll('script[src*="recaptcha"]').forEach(s => s.remove());
        delete window.grecaptcha;
        delete window.___grecaptcha_cfg;

        captcha.innerHTML = '';
        tokenBox.value = '';
        copyBtn.disabled = true;

        if (v3Timer) {
            clearInterval(v3Timer);
            v3Timer = null;
        }
    }

    /* ---------- V2 ---------- */
    window.onSolved = token => {
        tokenBox.value = token;
        copyBtn.disabled = false;
    };

    window.loadV2 = () => {
        grecaptcha.render('captcha', {
            sitekey: SITE_KEY_V2,
            callback: onSolved
        });
    };

    /* ---------- V3 ---------- */
    function executeV3() {
        grecaptcha.execute(SITE_KEY_V3, { action: 'submit' })
            .then(token => {
                tokenBox.value = token;
                copyBtn.disabled = false;
            });
    }

    /* ---------- MODE SWITCH ---------- */
    selector.onchange = () => {
        const mode = selector.value;
        if (!mode) return;

        clearRecaptcha();

        location.replace(
            location.origin +
            location.pathname +
            '?mode=' + mode
        );
    };

    /* ---------- READ MODE FROM URL (CRITICAL FIX) ---------- */
    const mode = new URLSearchParams(location.search).get('mode');

    if (mode === 'v2' || mode === 'v3') {
        selector.value = mode;   // ✅ FORCE dropdown value
    }

    if (!mode) return;

    clearRecaptcha();

    /* ---------- LOAD V2 ---------- */
    if (mode === 'v2') {
        info.textContent = 'Solve the checkbox to get token.';

        const s = document.createElement('script');
        s.src =
            'https://www.google.com/recaptcha/api.js' +
            '?onload=loadV2&render=explicit';
        s.async = true;
        document.head.appendChild(s);
    }

    /* ---------- LOAD V3 ---------- */
    if (mode === 'v3') {
        info.textContent =
            'v3 has NO UI. Token auto-refreshes every 5 seconds.';

        const s = document.createElement('script');
        s.src =
            'https://www.google.com/recaptcha/api.js?render=' + SITE_KEY_V3;
        s.async = true;

        s.onload = () => {
            grecaptcha.ready(() => {
                executeV3();
                v3Timer = setInterval(executeV3, V3_REFRESH_INTERVAL);
            });
        };

        document.head.appendChild(s);
    }
})();