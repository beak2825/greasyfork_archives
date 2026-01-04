// ==UserScript==
// @name         TMN • ULTIMATE BOT
// @namespace    https://tmn2010.net/
// @version      4.40
// @description  Crimes+GTA+Jail+DTM+Captcha+Auto-Login+Overlay
// @match        https://*.tmn2010.net/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand

// @connect      2captcha.com
// @connect      api.telegram.org
// @connect      tmn2010.net
// @connect      alexandres27.sg-host.com
// @downloadURL https://update.greasyfork.org/scripts/553739/TMN%20%E2%80%A2%20ULTIMATE%20BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/553739/TMN%20%E2%80%A2%20ULTIMATE%20BOT.meta.js
// ==/UserScript==

/* ============================================================
   [INLINE JS OVERRIDES] - Auto-confirm Dialogs
============================================================ */
(function() {
    const script = document.createElement('script');
    script.textContent = `
    window.confirm = function(msg) {
      console.log('[TMN Ultimate Bot][INLINE OVERRIDE] Auto-confirm:', msg);
      return true;
    };
  `;
    document.documentElement.appendChild(script);
})();

/* ============================================================
   [MAIN BOT]
============================================================ */
(() => {
    'use strict';

    /* ============================================================
   [USER CONFIG / CONSTANTS / TOGGLE MENUS]
============================================================ */
    // Add a menu command to clear credentials and DTM config
    GM_registerMenuCommand('Clear TMN Login Data', () => {
        GM_setValue('USERNAME', '');
        GM_setValue('PASSWORD', '');
        GM_setValue('DTM_POSITION', '');
        GM_setValue('DTM_LEADER', '');
        GM_setValue('DTM_DRIVER', '');
        alert('TMN login data & DTM info cleared! Please reload and enter your new credentials/config.');
    });

    // Login details (stored)
    const USERNAME = GM_getValue('USERNAME', '');
    const PASSWORD = GM_getValue('PASSWORD', '');

    if (!USERNAME || !PASSWORD) {
        let u = prompt('Enter your TMN username:', USERNAME);
        if (u) GM_setValue('USERNAME', u);
        let p = prompt('Enter your TMN password:', PASSWORD);
        if (p) GM_setValue('PASSWORD', p);
        window.location.reload();
    }

    // --- Main constants ---
    const API_KEY = 'ecc957993ddc9c856ebf68c643497f43';
    const BOT_VERSION = "4.30";
    const BANK_MIN_HAND = 70000000;
    const BANK_MAX_DEPOSIT = 49999999;
    const BANK_COOLDOWN_HOURS = 24;
    const BANK_NEXT_KEY = 'tmn_next_bank';
    const TRAVEL_NEXT_KEY = 'tmn_next_travel';
    const TRAVEL_CD = 45 * 60 * 1000; // 45 minutes in ms
    const HQ_LOCATION = 'paris';



    // ======== O.C. Settings Prompt (single input) ========
    let OC_POSITION = GM_getValue('OC_POSITION', '');
    let OC_LEADER   = GM_getValue('OC_LEADER', '');
    let OC_DRIVER   = GM_getValue('OC_DRIVER', '');
    let OC_WM       = GM_getValue('OC_WM', '');
    let OC_EE       = GM_getValue('OC_EE', '');

    if (!OC_POSITION || !OC_LEADER || !OC_DRIVER || !OC_WM || !OC_EE) {
        const defaults = [
            OC_POSITION || 'leader',
            OC_LEADER   || 'LeaderName',
            OC_DRIVER   || 'DriverName',
            OC_WM       || 'WMName',
            OC_EE       || 'EEName'
        ];

        const input = prompt(
            'Enter your OC details separated by commas:\n' +
            'Format: position, leader, driver, wm, ee\n\n' +
            'Example: leader, Alex, John, Mike, Sarah\n\n' +
            `Current: ${defaults.join(', ')}`,
            defaults.join(', ')
        );

        if (input) {
            const parts = input.split(',').map(v => v.trim());
            if (parts.length >= 1) GM_setValue('OC_POSITION', parts[0].toLowerCase());
            if (parts.length >= 2) GM_setValue('OC_LEADER',   parts[1]);
            if (parts.length >= 3) GM_setValue('OC_DRIVER',   parts[2]);
            if (parts.length >= 4) GM_setValue('OC_WM',       parts[3]);
            if (parts.length >= 5) GM_setValue('OC_EE',       parts[4]);

            alert('O.C. settings saved — reloading...');
            window.location.reload();
        }
    }

    // Prompt for DTM settings if not set
    let DTM_POSITION = GM_getValue('DTM_POSITION', '');
    let DTM_DRIVER = GM_getValue('DTM_DRIVER', '');
    let DTM_LEADER = GM_getValue('DTM_LEADER', '');



    if (!DTM_POSITION || !DTM_DRIVER || !DTM_LEADER) {
        let pos = prompt('Enter your DTM position (leader/driver):', DTM_POSITION || 'leader');
        if (pos) GM_setValue('DTM_POSITION', pos.trim().toLowerCase());

        let driver = prompt('Enter the DTM driver username:', DTM_DRIVER);
        if (driver) GM_setValue('DTM_DRIVER', driver.trim());

        let leader = prompt('Enter the DTM leader username:', DTM_LEADER);
        if (leader) GM_setValue('DTM_LEADER', leader.trim());

        window.location.reload();
    }

    // Refresh local vars in case they were set
    DTM_POSITION = GM_getValue('DTM_POSITION', '');
    DTM_DRIVER = GM_getValue('DTM_DRIVER', '');
    DTM_LEADER = GM_getValue('DTM_LEADER', '');



    // --- Page URLs ---
    const CRIME_URL = '/authenticated/crimes.aspx';
    const GTA_URL = '/authenticated/crimes.aspx?p=g';
    const JAIL_URL = '/authenticated/jail.aspx';
    const DTM_URL = '/authenticated/organizedcrime.aspx?p=dtm';
    const GARAGE_URL = '/authenticated/playerproperty.aspx?p=g';
    const BOOZE_URL = '/authenticated/crimes.aspx?p=b';
    const STORE_URL = '/authenticated/credits.aspx';
    const BANK_URL = 'https://www.tmn2010.net/authenticated/playerproperty.aspx?p=m';
    const TRAVEL_URL = '/authenticated/travel.aspx';
    const OC_URL = '/authenticated/organizedcrime.aspx';
    const url = location.pathname + location.search;
    const MAIL_URL = '/authenticated/mailbox.aspx';




    // --- Alerting ---
    const TELEGRAM_TOKEN = 'bot6707224508:AAEaB__9y3mUIEN35Jbu8T_EZ7BMH2oEiW8';
    const TELEGRAM_CHAT_ID = '-4844776529';
    let _tmn_telegram_alerted = false;

    // --- Cooldowns (in ms) ---
    const CRIME_CD = 120 * 1000;
    const GTA_CD = 240 * 1000;
    const DTM_CD = 120 * 60 * 1000;
    const OC_CD = 360 * 60 * 1000
    const BOOZE_CD = 120 * 1000;

    // --- Toggle: Break Only Targets in Jail ---
    const DEFAULT_BREAK_TARGETS = false;
    let ONLY_BREAK_TARGETS = GM_getValue('ONLY_BREAK_TARGETS', DEFAULT_BREAK_TARGETS);
    function updateJailToggleMenu() {
        GM_registerMenuCommand(
            `Jail: Break Only Targets (${ONLY_BREAK_TARGETS ? "ON" : "OFF"})`,
            () => {
                ONLY_BREAK_TARGETS = !ONLY_BREAK_TARGETS;
                GM_setValue('ONLY_BREAK_TARGETS', ONLY_BREAK_TARGETS);
                alert(`Jail: Break Only Targets is now ${ONLY_BREAK_TARGETS ? "ON" : "OFF"}.`);
                updateJailToggleMenu();
            }
        );
    }
    updateJailToggleMenu();

    // --- Toggle: Auto Buy Health ---
    const DEFAULT_AUTO_BUY_HEALTH = true;
    let AUTO_BUY_HEALTH = GM_getValue('AUTO_BUY_HEALTH', DEFAULT_AUTO_BUY_HEALTH);
    function updateHealthToggleMenu() {
        GM_registerMenuCommand(
            `Auto Buy Health (${AUTO_BUY_HEALTH ? "ON" : "OFF"})`,
            () => {
                AUTO_BUY_HEALTH = !AUTO_BUY_HEALTH;
                GM_setValue('AUTO_BUY_HEALTH', AUTO_BUY_HEALTH);
                alert(`Auto Buy Health is now ${AUTO_BUY_HEALTH ? "ON" : "OFF"}.`);
                updateHealthToggleMenu();
            }
        );
    }
    updateHealthToggleMenu();
    function isJailed() {
        let jailPanel = document.querySelector('#ctl00_main_pnlJailContainer');
        let jailedByText = (document.body.textContent.toLowerCase().includes('you are in jail'));
        if (jailPanel && jailPanel.innerText && jailPanel.innerText.toLowerCase().includes(USERNAME.toLowerCase())) return true;
        if (jailedByText) return true;
        return false;
    }

    if (handleAntiBotPause(60_000)) return; // pause 1 minute, then reload
    /* ============================================================
   [IF CAR STOLEN GO TO GARAGE]
============================================================ */
    let vipData = localStorage.getItem('tmn_pending_vip_push');
    if (vipData) {
        try {
            //pushVIPCarToDB(JSON.parse(vipData));
        } catch (e) {
            console.error('[VIPCar][DB] Error:', e, vipData);
        }
        localStorage.removeItem('tmn_pending_vip_push');
        setTimeout(() => {
            window.location.href = '/authenticated/playerproperty.aspx?p=g';
        }, 800);
        return;
    }

    if (localStorage.getItem('tmn_gta_waiting_result') === '1') {
        // Check if we are on the GTA result page
        const resPanel = document.querySelector('#ctl00_main_pnlResult');
        const lbl = document.querySelector('#ctl00_main_lblResult');
        if (resPanel && lbl && /you successfully stole/i.test(lbl.textContent)) {
            let match = lbl.textContent.match(/stole (a|an)?\s*([\w\s\-]+?)\s*(from|with)/i);
            let carName = match ? match[2].trim() : null;



            if (carName && /Bentley Continental|Dodge Challenger Hellcat|Bentley Arnage|Audi RS6 Avant/i.test(carName)) {
                let vipCarData = {
                    name: carName,
                    damage: 0, // Optionally parse from DOM if available
                    location: '', // Optionally parse from DOM if available
                    username: USERNAME,
                    gta_option: parseInt(localStorage.getItem('tmn_last_gta_option') || '0', 10)
                };
                //localStorage.setItem('tmn_pending_vip_push', JSON.stringify(vipCarData));
            }
            localStorage.removeItem('tmn_gta_waiting_result');
            localStorage.setItem('tmn_goto_garage', '1');
            setTimeout(() => {
                window.location.href = '/authenticated/playerproperty.aspx?p=g';
            }, 800);
            return;
        }
        // If we're NOT on the result page, or the panel isn't there yet,
        // don't clear the flag! It will retry next page load.
    }

    /* ============================================================
   [PAGE ERROR HANDLER]
============================================================ */
    function isErrorPage() {
        // Detect classic TMN errors, Chrome proxy errors, and blank loads
        let body = document.body;
        if (!body) return true; // extreme case: body not loaded at all
        let txt = (body.textContent || '').toLowerCase();

        // Common error triggers
        if (txt.length < 100) return true; // Page is likely empty or not loaded
        if (txt.includes('502 bad gateway') || txt.includes('cloudflare') || txt.includes('access denied')) return true;
        if (txt.includes('error 403') || txt.includes('forbidden')) return true;
        if (txt.includes('this site can’t be reached')) return true;
        if (document.title.toLowerCase().includes('error') || document.title.length < 5) return true;

        return false;
    }

    function autoRecoverError() {
        if (isErrorPage()) {
            document.body.innerHTML = `<div style="padding:60px;font-size:18px;color:#e66;background:#222;text-align:center;">TMN BOT: Proxy/Page Error Detected! Retrying in 10 seconds...</div>`;
            setTimeout(() => window.location.reload(), 10000);
            return true;
        }
        return false;
    }

    // Add at the TOP of your IIFE:
    if (autoRecoverError()) return;
    // === [REDIRECT ON INCORRECT VALIDATION] ===
    (function checkIncorrectValidation() {
        const errSpan = document.querySelector('#ctl00_main_lblMsg');
        if (errSpan && /incorrect validation/i.test(errSpan.textContent)) {
            window.location.href = "https://www.tmn2010.net/login.aspx";
        }
    })();



    /* ============================================================
   [UNIVERSAL AUTO-LOGIN]
============================================================ */
    if (onLoginPage()) {
        doLogin();
        return;
    }

    function onLoginPage() {
        const userBox = document.querySelector('#ctl00_main_txtUsername');
        const passBox = document.querySelector('#ctl00_main_txtPassword');
        const recDiv = document.querySelector('.g-recaptcha');
        const loginBtn = document.querySelector('#ctl00_main_btnLogin');
        return !!(userBox && passBox && recDiv && loginBtn);
    }

    function doLogin(retryNum = 0) {
        const userBox  = document.querySelector('#ctl00_main_txtUsername');
        const passBox  = document.querySelector('#ctl00_main_txtPassword');
        const recDiv   = document.querySelector('.g-recaptcha');
        const loginBtn = document.querySelector('#ctl00_main_btnLogin');
        const errMsg   = document.querySelector('#ctl00_main_lblMsg');
        const msg = errMsg?.textContent?.trim() || "";
        if (msg.toLowerCase().includes("incorrect validation")) {
            console.log(`[TMN-LoginBot] Login failed: Incorrect validation (attempt ${retryNum+1}). Retrying in 4 seconds...`);
            setTimeout(() => doLogin(retryNum + 1), 4000);
            return;
        }
        if (!(userBox && passBox && recDiv && loginBtn)) {
            console.log('[TMN-LoginBot] Login form not found, quitting auto-login logic.');
            return;
        }

        userBox.value = USERNAME;
        passBox.value = PASSWORD;

        const siteKey = recDiv.getAttribute('data-sitekey');
        if (!siteKey) { console.log('[TMN-LoginBot] No sitekey found.'); return; }

        loginBtn.disabled = false;
        loginBtn.removeAttribute('disabled');

        solveCaptcha(siteKey, location.href)
            .then(token => {
            console.log(`[TMN-LoginBot] Captcha solved, attempt ${retryNum+1}.`);
            const responseBox = document.getElementById('g-recaptcha-response');
            responseBox.value = token;
            responseBox.innerHTML = token;
            responseBox.style.display = 'block';
            setTimeout(() => {
                console.log('[TMN-LoginBot] Submitting login...');
                loginBtn.click();
            }, 1000);
        })
            .catch(err => {
            console.error('[TMN-LoginBot] Captcha solve failed, will reload in 4s:', err);
            setTimeout(() => location.reload(), 4000);
        });
    }

    function solveCaptcha(siteKey, pageUrl) {
        return new Promise((resolve, reject) => {
            console.log('[TMN-LoginBot] Sending captcha to 2Captcha...');
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://2captcha.com/in.php',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: `key=${API_KEY}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${encodeURIComponent(pageUrl)}&json=1`,
                onload: res => {
                    const resp = safeJSON(res.responseText);
                    if (!resp || resp.status !== 1) return reject(resp?.request || '2Captcha error');
                    const captchaId = resp.request;
                    const t0 = Date.now();
                    const poll = setInterval(() => {
                        if (Date.now() - t0 > 90000) {
                            clearInterval(poll);
                            reject('2Captcha timeout');
                            return;
                        }
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: `https://2captcha.com/res.php?key=${API_KEY}&action=get&id=${captchaId}&json=1`,
                            onload: r2 => {
                                const ans = safeJSON(r2.responseText);
                                if (!ans) {
                                    clearInterval(poll);
                                    reject('Bad JSON from 2Captcha');
                                }
                                if (ans.status === 1) {
                                    clearInterval(poll);
                                    resolve(ans.request);
                                } else if (ans.request !== 'CAPCHA_NOT_READY') {
                                    clearInterval(poll);
                                    reject('2Captcha error: ' + ans.request);
                                }
                            }
                        });
                    }, 4000);
                }
            });
        });
    }

    function safeJSON(txt) {
        try { return JSON.parse(txt); } catch { return null; }
    }

    /* ============================================================
   [AUTO-REDIRECT HOME TO CRIMES]
============================================================ */
    if (/\/authenticated\/default\.aspx$/i.test(location.pathname)) {
        location.href = CRIME_URL;
        return;
    }

    /* ============================================================
   [ANTI-BOT — simple: one alert, wait 1 min, reload]
   Usage (early in your script):  if (handleAntiBotPause(60_000)) return;
============================================================ */

    function detectImportantAntiBotMsg() {
        const el = document.querySelector('#ctl00_main_pnlMessage .NewGridTitle');
        if (el && /important message/i.test((el.textContent || '').trim())) return true;
        for (const t of document.querySelectorAll('.NewGridTitle')) {
            if (t && /important message/i.test((t.textContent || '').trim())) return true;
        }
        return false;
    }

    function sendNtfySimple(bodyText) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://ntfy.sh/tmn_5147956423',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            data: bodyText
        });
    }

    /**
 * If banner exists: send once, then reload after delay. Returns true if paused.
 * delayMs default: 60,000 (1 minute). Use 3000 for 3 seconds, etc.
 */
    function handleAntiBotPause(delayMs = 60_000) {
        if (!detectImportantAntiBotMsg()) return false;

        const USER = (typeof USERNAME !== 'undefined' && USERNAME) ? USERNAME : 'Unknown';
        const body = [
            '⚠️ TMN Bot Alert',
            'IMPORTANT: Script Check message appeared.',
            `User: ${USER}`,
            `URL: ${location.href}`,
            `Time: ${new Date().toLocaleString()}`
        ].join('\n');

        // 1) notify now
        //sendNtfySimple(body);

        // 2) wait, then hard-reload same URL (only once)
        setTimeout(() => {
            if (detectImportantAntiBotMsg()) {
                window.location.replace(location.href);
            }
        }, Math.max(1000, Number(delayMs) || 60000));

        // 3) block rest of script this load
        return true;
    }


    /* ============================================================
   [UNIVERSAL CAPTCHA HANDLER]
============================================================ */
    if (document.querySelector('#ctl00_main_pnlVerify')) {
        universalCaptchaSolve();
        return;
    }
    function universalCaptchaSolve() {
        const panel = document.querySelector('#ctl00_main_pnlVerify');
        const recDiv = panel ? panel.querySelector('.g-recaptcha') : null;
        const siteKey = recDiv ? recDiv.getAttribute('data-sitekey') : null;
        if (!siteKey) { return; }
        const pageUrl = location.href;
        if (window._tmn_solving_captcha) return;
        window._tmn_solving_captcha = true;
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://2captcha.com/in.php?key=${API_KEY}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${encodeURIComponent(pageUrl)}&json=1`,
            onload: function(response) {
                const json = JSON.parse(response.responseText);
                if (json.status === 1) pollUniversalCaptcha(json.request);
                else { window._tmn_solving_captcha = false; }
            }
        });
        function pollUniversalCaptcha(requestId) {
            const poll = setInterval(() => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://2captcha.com/res.php?key=${API_KEY}&action=get&id=${requestId}&json=1`,
                    onload: function(response) {
                        const json = JSON.parse(response.responseText);
                        if (json.status === 1) {
                            clearInterval(poll);
                            injectUniversalCaptcha(json.request);
                        } else if (json.request !== 'CAPCHA_NOT_READY') {
                            clearInterval(poll);
                            window._tmn_solving_captcha = false;
                        }
                    }
                });
            }, 5000);
        }
        function injectUniversalCaptcha(token) {
            const textarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            const submit = document.querySelector('#ctl00_main_MyScriptTest_btnSubmit');
            if (!textarea || !submit) {
                window._tmn_solving_captcha = false; return;
            }
            textarea.style.display = 'block';
            textarea.value = token;
            setTimeout(() => { submit.click(); window._tmn_solving_captcha = false; }, 1200);
        }
    }



    /* ============================================================
   [BOT ROUTER: SELECT PAGE/ACTION]
============================================================ */
    function jailPanelExists() {
        return document.querySelector('#ctl00_main_pnlJailContainer') ||
            document.querySelector('#ctl00_main_gvJail');
    }
    if (jailPanelExists()) {
        mainJail();
        return;
    }
    if (url.startsWith(CRIME_URL) && url.indexOf('p=g') === -1 && url.indexOf('p=b') === -1) mainCrime();
    if (url.startsWith(GTA_URL)) {
        mainGTA();
    } else if (url.startsWith(JAIL_URL)) {
        mainJail();
    } else if (url.startsWith(BOOZE_URL)) {
        mainBooze();
    } else if (url.startsWith(STORE_URL)) {
        checkAndFixHealth();
    } else if (OC_POSITION.toLowerCase() !== 'leader' && url.startsWith('/authenticated/mailbox.aspx')) {
        if (/\?p=m&id=/.test(location.search)) {
            mainOCNonLeaderMailView();
        } else {
            mainOCNonLeader();
        }
    } else if (OC_POSITION.toLowerCase() !== 'leader' && (url.startsWith(OC_URL) || url.includes('store.aspx?p=w')) && url.indexOf('p=dtm') === -1) {
        mainOCNonLeaderBuyEquipment();
    } else if (url.startsWith(DTM_URL) && DTM_POSITION === 'leader') {
        mainDTMLeader();
    } else if (DTM_POSITION === 'driver' && url.startsWith('/authenticated/mailbox.aspx')) {
        if (/\?p=m&id=/.test(location.search)) {
            mainDTMDriverMailView();
        } else {
            mainDTMDriver();
        }
    }
    else if (DTM_POSITION === 'driver' && url.startsWith(DTM_URL)) {
        mainDTMDriverBuyDrugs();
    }
    else if (OC_POSITION.toLowerCase() === 'leader' && url.startsWith(OC_URL) && url.indexOf('p=dtm') === -1) {
        mainOC();
    } else if (url.startsWith(GARAGE_URL)) {
        processGarage();
    } else {
        setTimeout(() => location.href = CRIME_URL, 1500);
    }





    /* ============================================================
   [OVERLAY UI, TIMERS, LOCALSTORAGE UTILS]
============================================================ */
    function overlayNow(msg) {
        let el = document.getElementById('tmn-overlay');
        if (!el) return;
        // Append or replace a "now" status message
        let inner = el.innerHTML.replace(/<div id="tmn-now">.*?<\/div>/, '');
        el.innerHTML = inner + `<div id="tmn-now" style="margin-top:8px;color:#ff9;font-size:12px;">${msg}</div>`;
    }
    function addOverlay() {
        if (!document.getElementById('tmn-overlay')) {
            let overlay = document.createElement('div');
            overlay.id = 'tmn-overlay';
            overlay.style = `
                position: fixed; top: 16px; right: 16px; z-index: 99999; background: rgba(20,28,40,0.96); color: #eee;
                font-family: monospace; font-size: 14px; line-height: 1.7; padding: 16px 22px; border-radius: 11px;
                box-shadow: 0 2px 14px #0008; pointer-events: none; min-width: 195px; text-align:left;
            `;
            overlay.innerHTML = `<b>TMN Bot v${BOT_VERSION}</b><br>Loading...`;
            document.body.appendChild(overlay);
        }
    }
    function updateOverlay(crimeNext, gtaNext, dtmNext, boozeNext, travelNext, ocNext, status='') {
        let el = document.getElementById('tmn-overlay');
        if (!el) return;
        let now = Date.now();
        let c = Math.max(0, Math.ceil((crimeNext-now)/1000));
        let g = Math.max(0, Math.ceil((gtaNext-now)/1000));
        let d = Math.max(0, Math.ceil((dtmNext-now)/1000));
        let b = Math.max(0, Math.ceil((boozeNext-now)/1000));
        let t = Math.max(0, Math.ceil((travelNext-now)/1000));
        let o = Math.max(0, Math.ceil((ocNext-now)/1000));
        function fmt(t) {
            if (t <= 0) return `<span style="color:#51ff69;font-weight:bold;">READY</span>`;
            if (t > 3600) return `<span style="color:#ffc040;">${Math.floor(t/3600)}h ${Math.floor((t%3600)/60)}m</span>`;
            if (t > 60) return `<span style="color:#ffc040;">${Math.floor(t/60)}m ${t%60}s</span>`;
            return `<span style="color:#ffc040;">${t}s</span>`;
        }
        function fmtBank(t) {
            if (t > 25*3600*1000) return `<span style="color:#ff5656;font-weight:bold;">???</span>`;
            if (t <= 0) return `<span style="color:#51ff69;font-weight:bold;">READY</span>`;
            if (t > 3600*1000) return `<span style="color:#ffc040;">${Math.floor(t/3600000)}h ${Math.floor((t%3600000)/60000)}m</span>`;
            if (t > 60000) return `<span style="color:#ffc040;">${Math.floor(t/60000)}m ${Math.floor((t%60000)/1000)}s</span>`;
            return `<span style="color:#ffc040;">${Math.floor(t/1000)}s</span>`;
        }
        el.innerHTML = `<b style="font-size:16px;">TMN Bot v${BOT_VERSION}</b><br>
            <span style="color:#aaf;font-size:13px;">User: ${USERNAME || '[not set]'}</span><br>
            Crimes: ${fmt(c)}<br>
            GTA: ${fmt(g)}<br>
            DTM: ${fmt(d)}<br>
            Booze: ${fmt(b)}<br>
            OC: ${fmt(o)}<br>
            Travel: ${fmt(t)}<br>
            Bank: ${fmtBank(getNext(BANK_NEXT_KEY, 0) - now)}<br>
            <span style="font-size:12px;color:#aac">Status: ${status}</span>`;
    }
    setInterval(() => {
        addOverlay();
        updateOverlay(getNext('tmn_next_crime', 0), getNext('tmn_next_gta', 0), getNext('tmn_next_dtm', 0), getNext('tmn_next_booze', 0),  getNext(TRAVEL_NEXT_KEY, 0), getNext('tmn_next_oc', 0),);
    }, 800);

    function getNext(key, def) { let v = +(localStorage.getItem(key)||0); return isNaN(v)||!v ? def : v; }
    function setNext(key, t) { localStorage.setItem(key, t); }

    /* ============================================================
   [DTM PAGE: DETECT COOLDOWN AND STORE]
============================================================ */

    if (url.startsWith(DTM_URL)) {
        addOverlay();
        const msg = document.querySelector('#ctl00_lblMsg');
        let dtmReadyAt = 0;
        if (msg && /you have to wait/i.test(msg.textContent)) {
            localStorage.removeItem('dtm_driver_accepted');
            let m = msg.textContent.match(/wait\s+(\d+)\s+hours?\s+(\d+)\s+minutes?\s+and\s+(\d+)\s+seconds?/i);
            let secondsLeft = 0;
            if (m) {
                let h = parseInt(m[1]), mn = parseInt(m[2]), s = parseInt(m[3]);
                secondsLeft = h*3600 + mn*60 + s;
            }
            if (!m) {
                let s2 = msg.textContent.match(/wait\s+(\d+)\s+seconds?/i);
                if (s2) secondsLeft = parseInt(s2[1]);
            }
            dtmReadyAt = Date.now() + (secondsLeft ? secondsLeft * 1000 : DTM_CD);
        } else {
            dtmReadyAt = Date.now();
        }
        setNext('tmn_next_dtm', dtmReadyAt);
        updateOverlay(
            getNext('tmn_next_crime', 0),
            getNext('tmn_next_gta', 0),
            dtmReadyAt,
            getNext('tmn_next_booze', 0),
            getNext(TRAVEL_NEXT_KEY, 0),
            'On DTM'
        );

        return;
    }

    function mainDTMLeader() {
        // --- 0. Preconditions: OC priority and city check ---

        const citySpan = document.getElementById('ctl00_userInfo_lblcity');
        const curCity = citySpan ? citySpan.textContent.trim().toLowerCase() : '';


        if (getNext(TRAVEL_NEXT_KEY, 0) > Date.now()) { setTimeout(() => { window.location.href = JAIL_URL; }, 600);}; // Wait until ready

        const OC_KEY = 'tmn_next_oc';
        const TWO_HOURS = 1 * 60 * 60 * 1000;

        const timeUntilOC = getNext(OC_KEY, 0) - Date.now();
        const ocReady = timeUntilOC <= 0;

        if (timeUntilOC <= TWO_HOURS) {
            console.log("[DTM] Not starting DTM: OC will be ready in less than 2 hours.");
            setTimeout(() => { window.location.href = JAIL_URL; }, 600);
            return;
        }


        // --- 1. If not on DTM page, go there ---
        if (!location.pathname.endsWith('organizedcrime.aspx') || location.search !== '?p=dtm') {
            console.log("[DTM] Not on DTM page. Redirecting to DTM URL.");
            setTimeout(() => { window.location.href = DTM_URL; }, 600);
            return;
        } else {
            console.log("[DTM] On DTM page. Continuing...");
        }

        // --- 2. Detect if we can "Start a DTM" ---
        const startPanel = document.getElementById('ctl00_main_pnlDTMStart');
        if (startPanel) {
            console.log("[DTM] Start DTM panel found.");
            // Pick your drug type (customize this as you like)
            const drugSelect = document.getElementById('ctl00_main_lstChooseDrug');
            if (drugSelect) {
                drugSelect.value = "1"; // 1=Ecstasy, 2=Marijuana, 3=Cocaine, 4=Heroin
                console.log(`[DTM] Drug type selected: ${drugSelect.options[drugSelect.selectedIndex].text}`);
            }

            // Uncheck Shoutbox Advertise (optional)
            const advertiseBox = document.getElementById('ctl00_main_chkAdvertiseDTM');
            if (advertiseBox && advertiseBox.checked) {
                advertiseBox.checked = false;
                console.log("[DTM] Unchecked 'Advertise in ShoutBox'");
            }

            // Start DTM!
            const startBtn = document.getElementById('ctl00_main_btnStartDTM');
            if (startBtn && !startBtn.disabled && !ocReady && /london/i.test(curCity)) {
                console.log("[DTM] Clicking Start DTM button.");
                setTimeout(() => startBtn.click(), 500);
                return;
            } else {
                console.log("[DTM] Start DTM button not found or not clickable.");
            }
        } else {
            console.log("[DTM] Start DTM panel NOT found.");
        }

        // --- 3. Detect if DTM was started and we're at status/invite screen ---
        const statusPanel = document.getElementById('ctl00_main_pnlStatus');
        if (statusPanel) {
            console.log("[DTM] DTM started as Leader! Ready to invite driver and buy drugs.");

            // === Invite the driver if not already invited ===
            const driverInput = document.getElementById('ctl00_main_tbParticipant');
            const inviteBtn = document.getElementById('ctl00_main_btnInviteMember');
            if (driverInput && inviteBtn && driverInput.value.trim() === "") {
                driverInput.value = DTM_DRIVER;
                setTimeout(() => {
                    inviteBtn.click();
                    console.log(`[DTM] Inviting driver: ${DTM_DRIVER}`);
                }, 400);
                return;
            }

            // === Buy drugs (only if not already bought) ===
            const unitsText = document.getElementById('ctl00_main_lbldCommanderRank')?.textContent || '';
            const maxUnits = parseInt((unitsText.match(/(\d+)\s*units/) || [0, '0'])[1]);
            const buyInput = document.getElementById('ctl00_main_tbDrugLAmount');
            const buyBtn = document.getElementById('ctl00_main_btnBuyLDrugs');
            const spending = document.getElementById('ctl00_main_lblCommanderSpending');
            if (buyInput && buyBtn && spending && spending.textContent.trim() === '$0') {
                buyInput.value = maxUnits;
                setTimeout(() => {
                    buyBtn.click();
                    console.log(`[DTM] Buying max drugs: ${maxUnits} units`);
                }, 500);
                return;
            }

            // === Optional: Check if both Leader/Driver ready, then commit DTM ===
            // DTM "Complete mission" logic
            const completeBtn = document.getElementById('ctl00_main_btnCompleteDTM');
            const commStatus = document.getElementById('ctl00_main_lbldCommanderStatus')?.textContent.trim() || '';
            const partStatus = document.getElementById('ctl00_main_lblParticipantStatus')?.textContent.trim() || '';
            const commSpend = document.getElementById('ctl00_main_lblCommanderSpending')?.textContent.replace(/[\$,]/g,'').trim() || '0';
            const partSpend = document.getElementById('ctl00_main_lblParticipantSpending')?.textContent.replace(/[\$,]/g,'').trim() || '0';

            console.log(`[DTM] Commander: status="${commStatus}", spend=$${commSpend}`);
            console.log(`[DTM] Participant: status="${partStatus}", spend=$${partSpend}`);

            if (
                completeBtn &&
                /Ready/i.test(commStatus) &&
                /Ready/i.test(partStatus) &&
                parseInt(commSpend) > 0 &&
                parseInt(partSpend) > 0
            ) {
                console.log("[DTM] Both leader and driver ready, completing mission!");
                setTimeout(() => completeBtn.click(), 800);
                return;
            } else {
                // If driver isn't ready, poll jail page while waiting
                if (!/Ready/i.test(partStatus) || parseInt(partSpend) === 0) {
                    console.log("[DTM] Driver/participant not ready yet. Going to jail page.");
                    setTimeout(() => window.location.href = '/authenticated/jail.aspx', 1200);
                    return;
                }
            }


            return;
        }else {
            console.log("[DTM] Not at DTM status/invite screen.");
        }

        // --- 4. If not in any DTM, nothing to do. Optionally go back to Crimes ---
        console.log("[DTM] Not in any DTM. Returning to Crimes page in 1.2s.");
        setTimeout(() => { window.location.href = '/authenticated/crimes.aspx'; }, 1200);
    }

    function mainDTMDriver() {





        if (getNext(TRAVEL_NEXT_KEY, 0) > Date.now()) { setTimeout(() => { window.location.href = JAIL_URL; }, 600);}; // Wait until ready
        if (localStorage.getItem('dtm_driver_accepted') === '1') {
            // Optionally, you can check if we're actually on DTM, else redirect
            if (!window.location.href.includes('organizedcrime.aspx?p=dtm')) {
                window.location.href = '/authenticated/organizedcrime.aspx?p=dtm';
            }
            return;
        }
        // 1. If not on the mailbox page, go there
        if (!/mailbox\.aspx/i.test(location.pathname)) {
            setTimeout(() => window.location.href = MAIL_URL, 400);
            return;
        }

        // 2. Scan mailbox table for a DTM invitation mail (ignore case, prefer unread but either works)
        let mailRows = Array.from(document.querySelectorAll('#ctl00_main_gridMail tr'))
        .filter(tr => tr.querySelector('a.BlackHyperLink') && /DTM invitation/i.test(tr.textContent));

        if (mailRows.length > 0) {
            // Click the first DTM invitation link
            let link = mailRows[0].querySelector('a.BlackHyperLink[href*="mailbox.aspx?p=m&id="]');
            if (link) {
                // Open the invitation mail
                setTimeout(() => { window.location.href = link.href; }, 500);
                return;
            }
        }

        // 3. If no invitation found, return to jail
        setTimeout(() => window.location.href = JAIL_URL, 900);
    }

    function mainDTMDriverMailView() {
        let acceptLink = document.querySelector('a.HyperLink[href*="organizedcrime.aspx?p=dtm"][href*="accept=1"]');
        if (acceptLink) {
            setTimeout(() => { window.location.href = acceptLink.href; }, 500);
            return;
        }
        setTimeout(() => window.location.href = JAIL_URL, 900);
    }

    function mainDTMDriverBuyDrugs() {
        // 1. Check if already bought drugs (no buy form visible)
        const buyInput = document.getElementById('ctl00_main_tbDrugAmount');
        const buyBtn = document.getElementById('ctl00_main_btnBuyDrugs');

        // Both buy elements are missing => drugs have already been bought
        if (!buyInput || !buyBtn) {
            // Optionally confirm both players are ready, but not needed for bot
            setTimeout(() => { window.location.href = '/authenticated/jail.aspx'; }, 600);
            return;
        }

        // 2. Buy max drugs if possible (one-time action)
        // Get max units (from status table)
        const rankSpan = document.getElementById('ctl00_main_lbldParticipantRank');
        let maxUnits = 1;
        if (rankSpan) {
            const m = rankSpan.textContent.match(/(\d+)\s*units/);
            if (m) maxUnits = parseInt(m[1]);
        }
        if (buyInput && buyBtn && buyInput.value != maxUnits) {
            localStorage.setItem('dtm_driver_accepted', '1');
            buyInput.value = maxUnits;
            setTimeout(() => buyBtn.click(), 500);
            return;
        }

        // Fallback: reload to jail if nothing else matches
        setTimeout(() => { window.location.href = '/authenticated/jail.aspx'; }, 900);
    }


    /* ============================================================
   [TRAVEL TO LONDON - ONLY WHEN TRAVEL TIMER IS READY]
============================================================ */
    (function travelToLondonAuto() {
        const citySpan = document.getElementById('ctl00_userInfo_lblcity');
        const curCity = citySpan ? citySpan.textContent.trim().toLowerCase() : '';
        if (!curCity || /london/i.test(curCity)) return; // Already in London or not found

        // Only attempt travel if Travel timer is ready (not on cooldown)
        if (getNext(TRAVEL_NEXT_KEY, 0) > Date.now()) return; // Wait until ready

        // If already at airport page, process the travel logic
        if (location.pathname === TRAVEL_URL) {
            let msgSpan = document.getElementById('ctl00_lblMsg');
            if (msgSpan && /before you can travel again/i.test(msgSpan.textContent)) {
                // Still on cooldown - parse time and set timer
                let m = msgSpan.textContent.match(/(\d+)\s*hours?\s+(\d+)\s*minutes?\s+and\s+(\d+)\s*seconds?/i);
                let secondsLeft = 0;
                if (m) {
                    let h = parseInt(m[1]), mn = parseInt(m[2]), s = parseInt(m[3]);
                    secondsLeft = h*3600 + mn*60 + s;
                }
                let s2 = msgSpan.textContent.match(/(\d+)\s*seconds?/i);
                if (!m && s2) secondsLeft = parseInt(s2[1]);
                let next = Date.now() + (secondsLeft ? secondsLeft*1000 : TRAVEL_CD);
                setNext(TRAVEL_NEXT_KEY, next);
                overlayNow('Travel cooldown: ' + msgSpan.textContent.replace(/<[^>]+>/g, ''));
                setTimeout(() => location.reload(), Math.max(1000, Math.min(secondsLeft*1000, 60*1000)));
                return;
            }
            // Not on cooldown, proceed to select London and travel!
            let cityList = document.querySelectorAll('input[name="ctl00$main$citieslist"]');
            let labels = document.querySelectorAll('label[for^="ctl00_main_citieslist_"]');
            let londonIdx = -1;
            labels.forEach((lbl, i) => {
                if (/london/i.test(lbl.textContent)) londonIdx = i;
            });
            if (londonIdx >= 0 && cityList[londonIdx]) {
                cityList[londonIdx].checked = true;
                let travelBtn = document.getElementById('ctl00_main_btntravel');
                setTimeout(() => {
                    if (travelBtn) travelBtn.click();
                    setNext(TRAVEL_NEXT_KEY, Date.now() + TRAVEL_CD); // Start travel cooldown
                    overlayNow('Traveling to London!');
                }, 500);
            }
            return;
        }

        // Not in London, travel is ready, not on airport page: go to airport
        setTimeout(() => {
            overlayNow('Going to airport...');
            window.location.href = TRAVEL_URL;
        }, 400);
    })();


    /* ============================================================
   [CRIME LOGIC]
============================================================ */
    function mainCrime() {
        addOverlay();
        updateOverlay(
            getNext('tmn_next_crime', 0),
            getNext('tmn_next_gta', 0),
            getNext('tmn_next_dtm', 0),
            getNext('tmn_next_booze', 0),
            getNext(TRAVEL_NEXT_KEY, 0),
            getNext('tmn_next_oc', 0),
            'On Crimes'
        );

        if (detectCaptcha()) { requestCaptchaSolve(getSiteKey()); return; }
        if (isJailed()) { setTimeout(()=>location.reload(),500); return; }
        let cd = detectCooldown();
        let nextCrime = Date.now() + (cd!==null?cd*1000:CRIME_CD);

        setNext('tmn_next_crime', nextCrime);
        let gtaReady = getNext('tmn_next_gta', 0) - Date.now() <= 0;
        let dtmReady = getNext('tmn_next_dtm', 0) - Date.now() <= 0;
        let ocReady = getNext('tmn_next_oc', 0) - Date.now() <= 0;
        if (cd !== null) {
            if (gtaReady) { setTimeout(()=>location.href=GTA_URL,300); }
            else if (ocReady && OC_POSITION != 'leader'){ setTimeout(()=>location.href=MAIL_URL,300); }
            else if (dtmReady && DTM_POSITION == 'leader'){ setTimeout(()=>location.href=DTM_URL,300); }
            else if (dtmReady && DTM_POSITION == 'driver'){ setTimeout(()=>location.href=MAIL_URL,300); }
            else { setTimeout(()=>location.href=JAIL_URL,400);}
            return;
        }
        if (handleResultPanelCrime()) return;
        commitCrime();
    }
    function detectCooldown() {
        let span = document.querySelector('#ctl00_main_lblResult');
        if (!span) return null;
        let m = span.textContent.match(/Still\s+(\d+)\s+seconds/i);
        return m ? Number(m[1]) : null;
    }
    function handleResultPanelCrime() {
        let pnl = document.querySelector('#ctl00_main_pnlResult');
        const OC_KEY = 'tmn_next_oc';
        const timeUntilOC = getNext(OC_KEY, 0) - Date.now();
        const ocReady = timeUntilOC <= 0;
        if (pnl && ocReady && OC_POSITION == 'leader'){ setTimeout(()=>location.href=OC_URL, 400); return; };
        if (!pnl) return false;
        if (/put to jail/i.test(pnl.textContent)) { setTimeout(()=>location.reload(),500); return true; }
        setTimeout(()=>location.href=JAIL_URL,400); return true;
    }
    function commitCrime() {
        let btn = document.querySelector('#ctl00_main_btnCrime1');
        if (!btn) { return false; }
        btn.click(); return true;
    }
    function detectCaptcha() { return !!document.querySelector('#ctl00_main_pnlVerify'); }
    function getSiteKey() { let el=document.querySelector('.g-recaptcha'); return el?el.getAttribute('data-sitekey'):null; }
    function requestCaptchaSolve(siteKey) {
        if (!siteKey) {return;}
        GM_xmlhttpRequest({
            method:'POST',url:`https://2captcha.com/in.php?key=${API_KEY}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${encodeURIComponent(location.href)}&json=1`,
            onload:function(r){let j=JSON.parse(r.responseText);if(j.status===1)pollForCaptchaResult(j.request);}
        });
        function pollForCaptchaResult(id) {
            let poll=setInterval(()=>{GM_xmlhttpRequest({
                method:'GET',url:`https://2captcha.com/res.php?key=${API_KEY}&action=get&id=${id}&json=1`,
                onload:function(r){let j=JSON.parse(r.responseText);if(j.status===1){clearInterval(poll);injectCaptchaToken(j.request);}}
            });},5000);
        }
        function injectCaptchaToken(token) {
            let textarea=document.querySelector('textarea[name="g-recaptcha-response"]');
            let submit=document.querySelector('#ctl00_main_MyScriptTest_btnSubmit');
            if(!textarea||!submit){return;}
            textarea.style.display='block';textarea.value=token;
            setTimeout(()=>submit.click(),1500);
        }
    }

    /* ============================================================
   [BOOZE LOGIC]
============================================================ */
    function mainBooze() {
        addOverlay();
        updateOverlay(getNext('tmn_next_crime', 0), getNext('tmn_next_gta', 0), getNext('tmn_next_dtm', 0), getNext('tmn_next_booze', 0), getNext(TRAVEL_NEXT_KEY, 0), getNext('tmn_next_oc', 0), 'On Booze');
        let cd = detectBoozeCooldown();
        let nextBooze = Date.now() + (cd !== null ? cd*1000 : BOOZE_CD);
        setNext('tmn_next_booze', nextBooze);
        if (cd !== null) {
            if (getNext('tmn_next_crime', 0) - Date.now() <= 0) { setTimeout(()=>location.href=CRIME_URL, 400); return; }
            if (getNext('tmn_next_gta', 0) - Date.now() <= 0) { setTimeout(()=>location.href=GTA_URL, 400); return; }
            setTimeout(()=>location.href=JAIL_URL, 400);
            return;
        }
        doBoozeAction();
    }
    function doBoozeAction() {
        let table = document.querySelector('#ctl00_main_gvBooze');
        const ranks = [ "Scum", "Wannabe", "Thug", "Criminal", "Gangster", "Hitman", "Hired Gunner", "Assassin", "Boss", "Don", "Enemy Of The State", "Global Threat", "Global Dominator", "Global Disaster", "Legend" ];
        const maxQuantity = 10 + (ranks.indexOf($('#ctl00_userInfo_lblrank').text()) + 1) * 10;
        if (!table) { setTimeout(()=>location.reload(), 800); return; }
        let rows = [...table.querySelectorAll('tr')].filter(tr => tr.children.length > 4 && !tr.classList.contains('NewGridTitle'));
        for (let row of rows) {
            let boozeType = row.children[0].textContent.trim();
            let holding = parseInt(row.children[2].textContent.trim(), 10) || 0;
            if (/Beer/i.test(boozeType)) {
                if (holding === 0) {
                    let buyBox = row.querySelector('input[type="text"][id*="tbAmtBuy"]');
                    let buyBtn = row.querySelector('input[type="submit"][id*="btnBuy"]');
                    if (buyBox && buyBtn) {
                        buyBox.value = maxQuantity;
                        setTimeout(()=>buyBtn.click(), 300);
                        return;
                    }
                } else if (holding > 0) {
                    let sellBox = row.querySelector('input[type="text"][id*="tbAmtSell"]');
                    let sellBtn = row.querySelector('input[type="submit"][id*="btnSell"]');
                    if (sellBox && sellBtn) {
                        sellBox.value = holding;
                        setTimeout(()=>sellBtn.click(), 300);
                        return;
                    }
                }
            }
        }
        setTimeout(()=>location.href=JAIL_URL, 800);
    }
    function detectBoozeCooldown() {
        let span = document.querySelector('#ctl00_main_lblResult');
        if (!span) return null;
        let m = span.textContent.match(/Still\s+(\d+)\s+seconds/i);
        return m ? Number(m[1]) : null;
    }

    /* ============================================================
   [GTA LOGIC]
============================================================ */
    function pushVIPCarToDB({ name, damage, location, username, gta_option }) {
        const url = 'https://alexandres27.sg-host.com/scripts/insert_vip_car.php';
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: JSON.stringify({ name, damage, location, username, gta_option }),
            headers: { 'Content-Type': 'application/json' },
            onload: function(res) {
                try {
                    const json = JSON.parse(res.responseText);
                    if (json.ok) {
                        console.log('[VIPCar][DB] Inserted:', name);
                    } else {
                        console.error('[VIPCar][DB] Failed:', json.msg);
                    }
                } catch(e) {
                    console.error('[VIPCar][DB] Invalid response', res.responseText);
                }
            }
        });
    }
    function mainGTA() {
        addOverlay();
        updateOverlay(
            getNext('tmn_next_crime', 0),
            getNext('tmn_next_gta', 0),
            getNext('tmn_next_dtm', 0),
            getNext('tmn_next_booze', 0),
            getNext(TRAVEL_NEXT_KEY, 0),
            getNext('tmn_next_oc', 0),
            'On GTA'
        );

        if (isJailed()) { setTimeout(() => location.reload(), 500); return; }

        const cd = detectCooldown();
        const nextGTA = Date.now() + (cd !== null ? cd * 1000 : GTA_CD);
        setNext('tmn_next_gta', nextGTA);

        const crimeReady = getNext('tmn_next_crime', 0) - Date.now() <= 0;
        if (cd !== null) {
            if (crimeReady) setTimeout(() => location.href = CRIME_URL, 300);
            else setTimeout(() => location.href = JAIL_URL, 400);
            return;
        }

        if (handleResultPanelGTA()) return;

        // ---- Commit GTA: pick OPTION #4 (index 3), with fallbacks ----
        const radios = document.querySelectorAll('input[name="ctl00$main$carslist"]');
        if (!radios.length) { setTimeout(() => location.reload(), 1000); return false; }

        let pickIdx = -1;
        const TARGET_IDX = 4; // option #4 (zero-based)

        // 1) Try the literal 4th radio if present & enabled
        if (radios.length > TARGET_IDX && !radios[TARGET_IDX].disabled) {
            pickIdx = TARGET_IDX;
        }

        // Select and proceed
        radios[pickIdx].checked = true;
        localStorage.setItem('tmn_last_gta_option', pickIdx);

        const btn = document.querySelector('#ctl00_main_btnStealACar');
        localStorage.setItem('tmn_gta_waiting_result', '1');
        if (!btn) { setTimeout(() => location.reload(), 1000); return false; }
        btn.click();
        return true;
    }

    function handleResultPanelGTA() {
        let pnl = document.querySelector('#ctl00_main_pnlResult');
        if (!pnl) return false;
        if (/put to jail/i.test(pnl.textContent)) { setTimeout(()=>location.reload(),500); return true; }
        setTimeout(()=>location.href=JAIL_URL,300); return true;
    }
    function commitGTA() {
        let radios = document.querySelectorAll('input[name="ctl00$main$carslist"]');
        if (!radios.length) { setTimeout(()=>location.reload(),1000); return false; }
        let bestIdx = -1, bestChance = 0;
        for (let i=0; i<radios.length-1; ++i) {
            let label = radios[i].parentElement.textContent;
            let match = label.match(/(\d+)% Chance/);
            let chance = match ? parseInt(match[1]) : 0;
            if (chance > bestChance) { bestChance = chance; bestIdx = i; }
        }
        if (bestIdx >= 0) {
            radios[bestIdx].checked = true;
            localStorage.setItem('tmn_last_gta_option', bestIdx);
        } else {
            radios[0].checked = true;
            localStorage.setItem('tmn_last_gta_option', 0);
        }
        let btn = document.querySelector('#ctl00_main_btnStealACar');
        if (!btn) { setTimeout(()=>location.reload(),1000); return false; }
        btn.click(); return true;
    }

    /* ============================================================
   [AUTO BUY HEALTH]
============================================================ */
    function checkAndFixHealth(next) {
        const credits = document.querySelector("#ctl00_userInfo_lblcredits").innerText;
        AUTO_BUY_HEALTH = GM_getValue('AUTO_BUY_HEALTH', DEFAULT_AUTO_BUY_HEALTH);
        if (!AUTO_BUY_HEALTH || credits < 10) { next && next(); return; }
        let healthSpan = document.querySelector('#ctl00_userInfo_lblhealth');
        if (!healthSpan) { next && next(); return; }
        let health = parseInt(healthSpan.textContent.replace('%','').trim(), 10);
        if (isNaN(health) || health >= 100) {
            localStorage.removeItem('tmn_buy_health');
            window._tmn_health_alarm_sent = false;
            next && next();
            return;
        }


        let msg = document.querySelector('#ctl00_lblMsg');
        if ((health >= 100) || (msg && /health is full/i.test(msg.textContent))) {
            localStorage.removeItem('tmn_buy_health');
            window._tmn_health_alarm_sent = false;
            setTimeout(() => location.href = CRIME_URL, 400);
            return;
        }
        if (!/\/authenticated\/credits\.aspx$/i.test(location.pathname)) {
            localStorage.setItem('tmn_buy_health', '1');
            setTimeout(() => location.href = '/authenticated/credits.aspx', 300);
            return;
        }
        if (localStorage.getItem('tmn_buy_health')) {
            let buyBtn = document.querySelector('#ctl00_main_btnBuyHealth');
            if (buyBtn) {
                buyBtn.click();
                setTimeout(() => location.reload(), 900);
                return;
            } else {
                localStorage.removeItem('tmn_buy_health');
                next && next();
                return;
            }
        }
    }
    /* ============================================================
   [JAIL LOGIC]
============================================================ */
    function mainJail() {
        addOverlay();
        updateOverlay(
            getNext('tmn_next_crime', 0),
            getNext('tmn_next_gta', 0),
            getNext('tmn_next_dtm', 0),
            getNext('tmn_next_booze', 0),
            getNext(TRAVEL_NEXT_KEY, 0),
            getNext('tmn_next_oc', 0),
            'JailBot running'
        );

        // ===== PRIORITY: TRAVEL TO LONDON IF READY =====
        const citySpan = document.getElementById('ctl00_userInfo_lblcity');
        const curCity = citySpan ? citySpan.textContent.trim().toLowerCase() : '';
        if (curCity && !/london/i.test(curCity) && getNext(TRAVEL_NEXT_KEY, 0) <= Date.now()) {
            overlayNow('Travel READY! Skipping jail, going to airport...');
            window.location.href = TRAVEL_URL;
            return;
        }

        checkAndFixHealth(runJailLogic);

        function runJailLogic() {
            let now = Date.now();
            let nc = getNext('tmn_next_crime', 0);
            let ng = getNext('tmn_next_gta', 0);
            let nd = getNext('tmn_next_dtm', 0);
            let boozeReady = (getNext('tmn_next_booze', 0) - now) <= 0;
            let crimeReady = (nc - now) <= 0;
            let gtaReady = (ng - now) <= 0;
            let dtmReady = getNext('tmn_next_dtm', 0) - Date.now() <= 0;


            // If a major action is ready, do that instead of jail
            if (crimeReady) {
                setTimeout(() => location.href = CRIME_URL, 120);
                return;
            }
            if (gtaReady) {
                setTimeout(() => location.href = GTA_URL, 120);
                return;
            }
            if (boozeReady) {
                setTimeout(() => location.href = BOOZE_URL, 120);
                return;
            }

            // DTM Leader: go to DTM page if ready
            if (dtmReady && DTM_POSITION == 'leader' ) {
                setTimeout(() => location.href = DTM_URL, 300);
                return;
            }

            // DTM Driver: only act on DTM if OC > 2h away
            if (dtmReady && DTM_POSITION === 'driver') {
                const OC_KEY = 'tmn_next_oc';
                const TWO_HOURS = 1 * 60 * 60 * 1000;
                const timeUntilOC = getNext(OC_KEY, 0) - Date.now();

                if (timeUntilOC > TWO_HOURS) {
                    if (localStorage.getItem('dtm_driver_accepted') === '1') {
                        setTimeout(() => location.href = DTM_URL, 300);
                    } else {
                        setTimeout(() => location.href = MAIL_URL, 300);
                    }
                    return;
                } else {
                    if (timeUntilOC <= 0) {
                        setTimeout(() => location.href = MAIL_URL, 300);
                    }
                    // OC <2h: skip DTM, continue to jail-break logic below!
                    console.log("[JAIL] Not doing DTM/mail (OC <2h), continuing jail-break loop.");
                    // DO NOT return; just continue jail-break logic!
                }
            }



            const SELF_NAME = USERNAME;
            const TARGETS = [
                'Catalystic', 'Ape', 'Maestro', 'GeniuSss', 'Predator',
                'LegendaryV2', 'Impulsive', 'Sonic', 'Bambi', 'Bombs',
                'Released', 'MegaWhale'
            ];
            const POLL_MS   = 500;
            const POST_WAIT = 500;

            function setRefresh(ms) {
                let tag = document.getElementById('jb-meta');
                if (!tag) {
                    tag = document.createElement('meta');
                    tag.id = 'jb-meta';
                    tag.httpEquiv = 'refresh';
                    document.head.appendChild(tag);
                }
                tag.content = String(ms / 1000);
            }

            const jailPanel = document.querySelector('#ctl00_main_pnlJailContainer');
            const jailTable = document.querySelector('#ctl00_main_gvJail');
            if (!jailTable) { setRefresh(POLL_MS); return; }
            const isSelfJailed = (
                (jailPanel && jailPanel.innerText && jailPanel.innerText.includes(SELF_NAME)) ||
                (jailTable && [...jailTable.querySelectorAll('tr')].some(tr => (tr.querySelector('td a')?.textContent || '').trim() === SELF_NAME))
            );
            if (isSelfJailed) { setRefresh(POLL_MS); return; }
            if (/no other players/i.test(jailTable.textContent)) { setRefresh(POLL_MS); return; }
            const inmates = [...jailTable.querySelectorAll('tr')]
            .filter(tr => tr.querySelector('a[id*="btnBreak"]'))
            .map(tr =>
                 ({
                name: (tr.querySelector('td a')?.textContent || '').trim(),
                link: tr.querySelector('a[id*="btnBreak"]')
            }));

            if (inmates.length === 0) { setRefresh(POLL_MS); return; }

            // Try to break out a TARGET first
            for (const t of TARGETS) {
                const hit = inmates.find(i => i.name === t);
                if (hit) {
                    hit.link.click();
                    setRefresh(POST_WAIT);
                    //return;
                }
            }

            ONLY_BREAK_TARGETS = GM_getValue('ONLY_BREAK_TARGETS', DEFAULT_BREAK_TARGETS);
            if (!ONLY_BREAK_TARGETS) {
                const last = inmates[inmates.length - 1];
                last.link.click();
                setRefresh(POST_WAIT);
            } else {
                setRefresh(POLL_MS);
            }
        }
    }



    /* ============================================================
   [GARAGE PAGE LOGIC]
============================================================ */
    function isVIPCar(name) {
        return /Bentley Continental|Dodge Challenger Hellcat|Bentley Arnage|Audi RS6 Avant/i.test(name);
    }

    function processGarage() {
        const table = document.querySelector('#ctl00_main_gvCars');
        if (!table) return;

        // All car rows (skip select-all header)
        const carRows = [...table.querySelectorAll('tr')].filter((tr, idx) =>
                                                                 idx !== 0 && tr.querySelector('input[type="checkbox"]')
                                                                );

        // 1. Sell all non-VIP cars
        let didSell = false;
        carRows.forEach(row => {
            const nameCell = row.children[1];
            const carName = nameCell.textContent.trim();
            const checkBox = row.querySelector('input[type="checkbox"]');
            if (checkBox && !isVIPCar(carName)) {
                checkBox.checked = true;
                didSell = true;
            }
        });
        if (didSell) {
            const btnSell = document.querySelector('#ctl00_main_btnSellSelected');
            if (btnSell) {
                setTimeout(() => btnSell.click(), 400);
            }
            return;
        }

        // 2. Repair VIP cars one at a time (if damaged)
        for (let row of carRows) {
            const nameCell = row.children[1];
            const carName = nameCell.textContent.trim();
            const damage = parseInt(row.children[4].textContent.trim().replace('%', ''));
            const checkBox = row.querySelector('input[type="checkbox"]');
            if (checkBox && isVIPCar(carName) && damage > 0) {
                checkBox.checked = true;
                const btnRepair = document.querySelector('#ctl00_main_btnRepair');
                if (btnRepair) {
                    setTimeout(() => btnRepair.click(), 400);
                }
                return;
            }
        }

        // 3. If a VIP car is fully repaired and NOT in London, transport it!
        for (let row of carRows) {
            const nameCell = row.children[1];
            const carName = nameCell.textContent.trim();
            const locationCell = row.children[5];
            const location = locationCell.textContent.trim();
            const damage = parseInt(row.children[4].textContent.trim().replace('%', ''));
            const checkBox = row.querySelector('input[type="checkbox"]');
            if (
                checkBox && isVIPCar(carName) && damage === 0 &&
                !/London - England/i.test(location)
            ) {
                checkBox.checked = true;
                // Select London as destination
                const select = document.querySelector('#ctl00_main_ddlCities');
                if (select) {
                    for (let opt of select.options) {
                        if (/London|England/i.test(opt.text)) {
                            select.value = opt.value;
                            break;
                        }
                    }
                }
                const btnTransport = document.querySelector('#ctl00_main_btnTransport');
                if (btnTransport) {
                    setTimeout(() => btnTransport.click(), 400);
                }
                return;
            }
        }

        // === At this point, nothing left to do ===
        // If we reach here, either:
        // - No checkboxes (just sold everything)
        // - Only non-actionable cars left
        // - Or we just completed an action and the page reloaded

        // So: redirect to Crimes page to continue main bot loop!
        setTimeout(() => { window.location.href = CRIME_URL; }, 600);
    }

    /* ============================================================
   [CHECK OC]
============================================================ */
    if (url.startsWith(OC_URL)) {
        addOverlay();
        const msg = document.querySelector('#ctl00_lblMsg');
        let ocReadyAt = 0;
        if (msg && /you have to wait/i.test(msg.textContent)) {
            localStorage.removeItem('dtm_driver_accepted');
            let m = msg.textContent.match(/wait\s+(\d+)\s+hours?\s+(\d+)\s+minutes?\s+and\s+(\d+)\s+seconds?/i);
            let secondsLeft = 0;
            if (m) {
                let h = parseInt(m[1]), mn = parseInt(m[2]), s = parseInt(m[3]);
                secondsLeft = h*3600 + mn*60 + s;
            }
            if (!m) {
                let s2 = msg.textContent.match(/wait\s+(\d+)\s+seconds?/i);
                if (s2) secondsLeft = parseInt(s2[1]);
            }
            ocReadyAt = Date.now() + (secondsLeft ? secondsLeft * 1000 : OC_CD);
        } else {
            ocReadyAt = Date.now();
        }
        setNext('tmn_next_oc', ocReadyAt);
        updateOverlay(
            getNext('tmn_next_crime', 0),
            getNext('tmn_next_gta', 0),
            getNext('tmn_next_dtm', 0),
            getNext('tmn_next_booze', 0),
            ocReadyAt,
            getNext(TRAVEL_NEXT_KEY, 0),
            'On OC'
        );

        return;
    }

    function mainOC() {
        addOverlay();
        updateOverlay(
            getNext('tmn_next_crime', 0),
            getNext('tmn_next_gta', 0),
            getNext('tmn_next_dtm', 0),
            getNext('tmn_next_booze', 0),
            getNext(TRAVEL_NEXT_KEY, 0),
            getNext('tmn_next_oc', 0),
            'On OC'
        );

        // Ensure we're on OC page
        if (!/\/authenticated\/organizedcrime\.aspx$/i.test(location.pathname)) {
            setTimeout(() => { window.location.href = OC_URL; }, 400);
            return;
        }

        // Store OC cooldown (if any)
        const msg = document.querySelector('#ctl00_lblMsg');
        let ocReadyAt = Date.now();
        if (msg && /you have to wait/i.test(msg.textContent)) {
            let sec = 0;
            const m = msg.textContent.match(/wait\s+(\d+)\s+hours?\s+(\d+)\s+minutes?\s+and\s+(\d+)\s+seconds?/i);
            if (m) {
                sec = (parseInt(m[1],10)||0)*3600 + (parseInt(m[2],10)||0)*60 + (parseInt(m[3],10)||0);
            } else {
                const s2 = msg.textContent.match(/wait\s+(\d+)\s+seconds?/i);
                if (s2) sec = parseInt(s2[1],10)||0;
            }
            ocReadyAt = Date.now() + (sec ? sec*1000 : 2*60*60*1000);
        }
        setNext('tmn_next_oc', ocReadyAt);

        // Only leaders start/buy/invite
        const pos = (GM_getValue('OC_POSITION','') || '').toLowerCase();
        if (pos !== 'leader') {
            setTimeout(() => { window.location.href = CRIME_URL; }, 800);
            return;
        }

        const $ = sel => document.querySelector(sel);
        const parseMoney = s => parseInt((s||'0').replace(/[^\d]/g,''),10) || 0;

        // 1) START OC if start panel exists
        const startPanel = $('#ctl00_main_pnlStartOC');
        if (startPanel) {
            const cash = parseMoney($('#ctl00_userInfo_lblcash')?.textContent);
            if (cash < 100000) {
                console.log('[OC Leader] Need $100,000 to start. Back to Crimes.');
                setTimeout(() => { window.location.href = CRIME_URL; }, 800);
                return;
            }
            const bankBtn = $('#ctl00_main_btnRobBank');
            if (bankBtn && !bankBtn.disabled) {
                console.log('[OC Leader] Starting OC → Rob the National Bank');
                setTimeout(() => bankBtn.click(), 300);
                return;
            }
            // If we can’t start, bail to Crimes
            setTimeout(() => { window.location.href = CRIME_URL; }, 800);
            return;
        }

        // From this point we should be on the OC info screen
        const ocInfo = $('#ctl00_main_pnlOCInfo');
        if (!ocInfo) {
            setTimeout(() => { window.location.href = CRIME_URL; }, 800);
            return;
        }

        // 2) BUY Laptop if not owned
        const commanderItem = ($('#ctl00_main_lblcommanderitem')?.textContent || '').trim().toLowerCase();
        if (commanderItem !== 'laptop') {
            const cash = parseMoney($('#ctl00_userInfo_lblcash')?.textContent);
            if (cash >= 750000) {
                const list  = $('#ctl00_main_securitydeviceslist');
                const buyBtn= $('#ctl00_main_btnBuySecurity');
                if (list && buyBtn) {
                    // pick by text or value 6
                    let laptopOpt = Array.from(list.options||[]).find(o => (o.textContent||'').toLowerCase().includes('laptop')) || list.querySelector('option[value="6"]');
                    if (laptopOpt) {
                        list.value = laptopOpt.value;
                        console.log('[OC Leader] Buying Laptop…');
                        setTimeout(() => buyBtn.click(), 300);
                        return;
                    }
                }
            } else {
                console.log('[OC Leader] Not enough cash for Laptop ($750,000).');
            }
        }

        // 3) INVITE Driver → WM → EE (only if slot "open")
        const nameBox   = $('#ctl00_main_txtinvitename');
        const roleList  = $('#ctl00_main_roleslist');
        const inviteBtn = $('#ctl00_main_btninvite');
        if (nameBox && roleList && inviteBtn) {
            const DRIVER = (GM_getValue('OC_DRIVER','') || '').trim();
            const WM     = (GM_getValue('OC_WM','')     || '').trim();
            const EE     = (GM_getValue('OC_EE','')     || '').trim();

            const isOpen = sel => (($(sel)?.textContent || '').toLowerCase().includes('open'));
            const tryInvite = (name, roleValue, statusSel) => {
                if (!name) return false;
                if (!isOpen(statusSel)) return false;
                roleList.value = roleValue;   // 'Transporter' | 'WeaponMaster' | 'ExplosiveExpert'
                nameBox.value  = name;
                console.log(`[OC Leader] Inviting ${name} as ${roleValue}…`);
                setTimeout(() => inviteBtn.click(), 300);
                return true;
            };

            if (tryInvite(DRIVER, 'Transporter',     '#ctl00_main_lbltransporterstatus')) return;
            if (tryInvite(WM,     'WeaponMaster',    '#ctl00_main_lblweaponmasterstatus')) return;
            if (tryInvite(EE,     'ExplosiveExpert', '#ctl00_main_lblexplosiveexpertstatus')) return;
        }

        // Nothing left to do
        console.log('[OC Leader] OC setup complete.');
        setTimeout(() => { window.location.href = CRIME_URL; }, 1500);
    }

    function mainOCNonLeader() {
        if (localStorage.getItem('oc_invite_accepted') === '1') {
            // Optionally, you can check if we're actually on DTM, else redirect
            if (!window.location.href.includes('organizedcrime.aspx')) {
                window.location.href = '/authenticated/organizedcrime.aspx';
            }
            return;
        }
        // 1. If not on the mailbox page, go there
        if (!/mailbox\.aspx/i.test(location.pathname)) {
            setTimeout(() => window.location.href = MAIL_URL, 400);
            return;
        }

        // 2. Scan mailbox table for an OC invitation mail (ignore case, prefer unread but either works)
        let mailRows = Array.from(document.querySelectorAll('#ctl00_main_gridMail tr'))
        .filter(tr => tr.querySelector('a.BlackHyperLink') && /Organized Crime Invitation/i.test(tr.textContent));

        if (mailRows.length > 0) {
            // Click the first OC invitation link
            let link = mailRows[0].querySelector('a.BlackHyperLink[href*="mailbox.aspx?p=m&id="]');
            if (link) {
                // Open the invitation mail
                setTimeout(() => { window.location.href = link.href; }, 500);
                return;
            }
        }

        // 3. If no invitation found, return to jail
        setTimeout(() => window.location.href = JAIL_URL, 900);
    }

    function mainOCNonLeaderMailView() {
        let acceptLink = document.querySelector('a.HyperLink[href*="organizedcrime.aspx"]');
        if (acceptLink) {
            setTimeout(() => { window.location.href = acceptLink.href; }, 500);
            return;
        }
        setTimeout(() => window.location.href = JAIL_URL, 900);
    }

    function mainOCNonLeaderBuyEquipment() {
        const lblMsg = $("#ctl00_lblMsg").text();
        if (location.href.includes("store")) {
            if (location.href.includes("?p=w&r=organizedcrime&cat=weapon")) {
                setTimeout(() => { document.querySelector("a[href='store.aspx?p=w&act=buy&cat=weapon&itemid=18&r=organizedcrime']").click() }, 3000);
            } else if (location.href.includes("?p=w&r=organizedcrime&cat=explosive")) {
                setTimeout(() => { document.querySelector("a[href='store.aspx?p=w&act=buy&cat=explosive&itemid=9&r=organizedcrime']").click() }, 3000);
            } else {
                setTimeout(() => { location.href = "organizedcrime.aspx" }, 3000);
            }
        } else if (!lblMsg[0] || lblMsg.includes("successfully accepted")) {
            const amReady = $(`tr:contains('${USERNAME}') > td`).eq(3).text().includes("Ready");
            const curCity = $("#ctl00_userInfo_lblcity").text().trim();
            const position = $(`tr:contains(${USERNAME})`).index();

            if (amReady) {
                setTimeout(() => { location.href = "jail.aspx"}, 3000);
            } else if (position == "2") {
                let carToUse;
                const carsList = $("#ctl00_main_carslist");
                carsList.children().map((n, e) => {
                    // Prioritise using RS6 > Continental > Arnage

                    // if (e.textContent.includes("Audi RS6")) {
                    //     carToUse = e.value;
                    //     return;
                    // } else if (e.textContent.includes("Bentley Continental")) {
                    //     carToUse = e.value;
                    // } else if (e.textContent.includes("Bentley Arnage") && !carToUse) {
                    //     carToUse = e.value;
                    // }
                    if (e.textContent.includes("Bentley Arnage")) {
                        carToUse = e.value;
                        return;
                    }
                });
                carsList.val(carToUse);
                setTimeout(() => { $("#ctl00_main_btnchoosecar").click(); }, 5000);
            } else if (position == "3") {
                //location.href = "https://www.tmn2010.net/authenticated/store.aspx?p=w&r=organizedcrime";
                const weaponList = $("#ctl00_main_weaponslist");
                if (!weaponList.val()) {
                    setTimeout(() => { location.href = "store.aspx?p=w&r=organizedcrime&cat=weapon" }, 3000);
                } else {
                    setTimeout(() => { $("#ctl00_main_btnChooseWeapon").click(); }, 5000);
                }
            } else if (position == "4") {
                const explosiveList = $("#ctl00_main_explosiveslist");
                if (!explosiveList.val()) {
                    setTimeout(() => { location.href = "store.aspx?p=w&r=organizedcrime&cat=explosive" }, 3000);
                } else {
                    setTimeout(() => { $("#ctl00_main_btnchooseexplosive").click(); }, 5000);
                }
            }
        } else if (lblMsg.includes("jail")) {
            setTimeout(() => { location.href = location.href }, 3000);
        } else if (lblMsg.includes("Invalid invitation") || lblMsg.includes("You cannot do")) {
            setTimeout(() => { location.href = "jail.aspx" }, 3000);
        }
    }

    /* ============================================================
   [BANKING LOGIC: 24H AUTOBANK]
============================================================ */
    (function() {
        let url = location.href;
        if (!url.startsWith(BANK_URL)) {
            if (Date.now() > getNext(BANK_NEXT_KEY, 0)) {
                setTimeout(() => { window.location.href = BANK_URL; }, 1000);
            }
            return;
        }
        let withdrawBtn = document.getElementById('ctl00_main_btnwithdraw');
        if (withdrawBtn) {
            let timeSpan = document.getElementById('ctl00_main_lblTimeLeft');
            let timeText = timeSpan ? timeSpan.textContent.trim() : "";
            let waitSeconds = 0;
            if (timeText && /hours?/i.test(timeText)) {
                let match = timeText.match(/(\d+)\s*hours?\s*(\d+)\s*minutes?\s*and\s*(\d+)\s*seconds?/i);
                if (match) {
                    let h = parseInt(match[1], 10) || 0;
                    let m = parseInt(match[2], 10) || 0;
                    let s = parseInt(match[3], 10) || 0;
                    waitSeconds = h * 3600 + m * 60 + s;
                }
            }
            if (waitSeconds < 10 || waitSeconds > 25*3600) {
                waitSeconds = 24 * 3600;
            }
            setNext(BANK_NEXT_KEY, Date.now() + waitSeconds * 1000);
            setTimeout(() => { window.location.href = CRIME_URL; }, 1500);
            return;
        }
        function parseCash(txt) {
            return parseInt(txt.replace(/[\$,]/g, ''), 10) || 0;
        }
        let cashSpan = document.getElementById('ctl00_userInfo_lblcash');
        if (!cashSpan) return;
        let cash = parseCash(cashSpan.textContent);
        let toBank = Math.max(0, Math.min(BANK_MAX_DEPOSIT, cash - BANK_MIN_HAND));
        let msg = document.getElementById('ctl00_lblMsg');
        if (msg && /successfully opened a new bank account/i.test(msg.textContent.toLowerCase())) {
            setNext(BANK_NEXT_KEY, Date.now() + BANK_COOLDOWN_HOURS * 60 * 60 * 1000);
            setTimeout(() => { window.location.href = CRIME_URL; }, 1200);
            return;
        }
        if (toBank >= 1) {
            let amtInput = document.getElementById('ctl00_main_txtbankamt');
            let btnDeposit = document.getElementById('ctl00_main_btndeposit');
            if (amtInput && btnDeposit) {
                amtInput.value = toBank;
                setTimeout(() => btnDeposit.click(), 600);
            }
            return;
        } else {
            setNext(BANK_NEXT_KEY, Date.now() + 1 * 60 * 60 * 1000); // retry in 1h
            setTimeout(() => { window.location.href = CRIME_URL; }, 1000);
            return;
        }
    })();

    /* ============================================================
   [PERIODIC PAGE RELOAD]
============================================================ */
    // At end of your script
    setInterval(() => {
        // Define your safe page patterns (add more if needed)
        const safePages = [
            '/authenticated/crimes.aspx',
            '/authenticated/crimes.aspx?p=g',
            '/authenticated/crimes.aspx?p=b',
            '/authenticated/jail.aspx',
            '/authenticated/organizedcrime.aspx?p=dtm',
            '/authenticated/playerproperty.aspx?p=g',
            '/authenticated/default.aspx',
        ];
        const pathname = location.pathname.toLowerCase() + location.search.toLowerCase();

        // Not safe if on login page
        if (/login\.aspx|default\.aspx$/i.test(pathname) && !document.querySelector('#ctl00_main_txtUsername')) return;

        // Not safe if handling a captcha panel
        if (document.querySelector('.g-recaptcha') || document.querySelector('#ctl00_main_pnlVerify')) return;

        // Only reload on safe pages
        if (safePages.some(url => pathname.startsWith(url))) {
            window.location.reload();
        }
    }, 10 * 60 * 1000); // 10 minutes


    /* ============================================================
   [END OF SCRIPT]
============================================================ */
})();
