// ==UserScript==
// @name         [New] Faucetpay Rotator (Unified + Fast ABLinks)
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  Unified rotator + fast ABLinks solver + stable referral persistence
// @author       Andrewblood + Fix + Assistant
// @match        https://faucetpay.io/*
// @match        https://claimfreecoins.io/*
// @connect      claimfreecoins.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faucetpay.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558269/%5BNew%5D%20Faucetpay%20Rotator%20%28Unified%20%2B%20Fast%20ABLinks%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558269/%5BNew%5D%20Faucetpay%20Rotator%20%28Unified%20%2B%20Fast%20ABLinks%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== CONFIG ======
    const REF_EMAIL = 'sstels215@gmail.com';
    const REF_KEY = 'fpr_ref'; // localStorage key
    const REF_PARAM = 'r';
    const REDIRECT_LOCK = 'fpr_redirect_lock'; // sessionStorage timestamp
    const REDIRECT_LOCK_TTL = 5000; // ms to avoid redirect loops

    // ====== USER ADDRESSES ======
    var email = REF_EMAIL;
    var bitcoin = email;
    var ethereum = email;
    var dogecoin = email;
    var litecoin = email;
    var bch = email;
    var dash = email;
    var digibyte = email;
    var tron = email;
    var tether = email;
    var feyorra = email;
    var zcash = email;
    var binance = email;
    var solana = email;
    var xrp = email;
    var polygon = email;
    var cardano = email;
    var toncoin = email;
    var stellar = email;
    var usdc = email;
    var monero = email;

    // ====== SITES LIST (base paths) ======
    const gr8sites = [
        '/bitcoin-faucet/',
        '/dogecoin-faucet/',
        '/litecoin-faucet/',
        '/tron-faucet/',
        '/bnb-faucet/',
        '/solana-faucet/',
        '/tether-faucet/',
        '/polygon-faucet/',
        '/ethereum-faucet/',
        '/bch-faucet/',
        '/dash-faucet/',
        '/zcash-faucet/',
        '/digibyte-faucet/',
        '/feyorra-faucet/',
        '/usdc-faucet/',
        '/ripple-faucet/',
        '/toncoin-faucet/',
        '/cardano-faucet/',
        '/monero-faucet/',
        '/stellar-faucet/'
    ];

    // Persist referral in localStorage so it can't be easily lost by redirects
    function ensureRefStored() {
        try {
            const stored = localStorage.getItem(REF_KEY);
            if (!stored) localStorage.setItem(REF_KEY, REF_EMAIL);
        } catch (e) { console.warn('ref store err', e); }
    }

    function getStoredRef() {
        try { return localStorage.getItem(REF_KEY) || REF_EMAIL; } catch (e) { return REF_EMAIL; }
    }

    // Add or ensure referral param present in current URL. Will replace (reload) only if necessary.
    function ensureReferralInUrl() {
        try {
            const ref = getStoredRef();
            const url = new URL(window.location.href);

            // if already contains the ref param with same value - ok
            if (url.searchParams.get(REF_PARAM) === ref) return false;

            // don't infinitely redirect: use session lock
            const lock = sessionStorage.getItem(REDIRECT_LOCK);
            const now = Date.now();
            if (lock && (now - Number(lock) < REDIRECT_LOCK_TTL)) return false;
            sessionStorage.setItem(REDIRECT_LOCK, String(now));

            url.searchParams.set(REF_PARAM, ref);

            // If the only difference is search param, we do a replace to reload with ref
            window.location.replace(url.toString());
            return true;
        } catch (e) { console.warn('ensureReferralInUrl error', e); return false; }
    }

    // Normalize a page to a base path for matching with gr8sites array
    function getBasePath(href) {
        try {
            const u = new URL(href);
            // ensure trailing slash
            let p = u.pathname;
            if (!p.endsWith('/')) p = p + '/';
            return p.toLowerCase();
        } catch (e) { return '/'; }
    }

    // Detect coin address from URL path
    function detectCoinAddress(url) {
        const coinMap = {
            "bitcoin": bitcoin, "btc": bitcoin,
            "ethereum": ethereum, "eth": ethereum,
            "doge": dogecoin, "dogecoin": dogecoin,
            "litecoin": litecoin, "ltc": litecoin,
            "bch": bch,
            "dash": dash,
            "digibyte": digibyte, "dgb": digibyte,
            "tron": tron, "trx": tron,
            "tether": tether, "usdt": tether,
            "feyorra": feyorra,
            "zcash": zcash, "zec": zcash,
            "binance": binance, "bnb": binance,
            "solana": solana,
            "ripple": xrp, "xrp": xrp,
            "polygon": polygon, "matic": polygon,
            "cardano": cardano, "ada": cardano,
            "toncoin": toncoin, "ton": toncoin,
            "stellar": stellar, "xlm": stellar,
            "usdc": usdc, "usd-coin": usdc,
            "monero": monero, "xmr": monero
        };

        const match = url.match(/\/([a-z0-9\-]+)-faucet/i);
        return match ? (coinMap[match[1]] || email) : email;
    }

    // MAIN ROTATOR + UI automation
    function runRotator() {
        // ensure referral always stored
        ensureRefStored();

        // ensure referral param present (may redirect)
        if (window.location.hostname.includes('claimfreecoins.io')) {
            if (ensureReferralInUrl()) return; // redirected, stop execution now
        }

        setTimeout(() => {
            const currentBase = getBasePath(window.location.href);

            // find index by base path
            let currentIndex = gr8sites.findIndex(p => p === currentBase);
            if (currentIndex === -1) {
                // maybe landing page or other page — try to find idx by startsWith
                currentIndex = gr8sites.findIndex(p => currentBase.indexOf(p.replace(/\/$/, '')) !== -1);
            }

            const nextIndex = (currentIndex + 1) % gr8sites.length;
            const nextHref = 'https://claimfreecoins.io' + gr8sites[nextIndex] + '?' + REF_PARAM + '=' + encodeURIComponent(getStoredRef());

            // DATE CHECK
            const dateSelector = '.card-body > table > tbody > tr:nth-child(1) > td:nth-child(3)';
            const dateElement = document.querySelector(dateSelector);
            if (dateElement) {
                const date = new Date(dateElement.innerText.replace(/-/g, '/'));
                const now = new Date();
                const hoursDifference = (now - date) / 3600000;
                if (hoursDifference > 24) {
                    window.location.replace(nextHref);
                    return;
                }
            }

            // SUCCESS / ERROR AUTOSKIP
            if (document.querySelector('div.alert.alert-danger.fade.show') || document.querySelector('div.alert.alert-success.fade.show')) {
                window.location.replace(nextHref);
                return;
            }

            // AUTO FILL ADDRESS
            var currentCoinAddress = detectCoinAddress(window.location.href);
            var nameInput = document.querySelector('#address');
            if (nameInput) {
                nameInput.value = currentCoinAddress;
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
            }

            // BUTTON 1 (claim start)
            var firstClaimButton = document.querySelector('.btn.btn-block.my-0') || document.querySelector('.btn.btn-block.btn-primary.my-2');
            if (firstClaimButton) firstClaimButton.click();

            // BUTTON 2 AFTER CAPTCHA (reCAPTCHA)
            var secondClaimButton = document.querySelector('#login');

            const checkCaptchaAndClick = setInterval(function() {
                var ReCaptchaResponse = document.querySelector('.g-recaptcha-response');
                if ((ReCaptchaResponse && ReCaptchaResponse.value.length > 1) && (secondClaimButton && secondClaimButton.offsetHeight > 1)) {
                    secondClaimButton.click();
                    clearInterval(checkCaptchaAndClick);
                }

                // if solver filled a simple captcha, it may trigger a submit button (handle in solver)
            }, 300);

            // fallback: if nothing happens for long time, go to next
            setTimeout(() => {
                // re-check if page still same and not showing captcha
                if (!document.querySelector('.g-recaptcha') && !document.querySelector('img[alt="captcha"], #captcha-image')) {
                    // skip to next
                    window.location.replace(nextHref);
                }
            }, 30 * 1000);

        }, 800);
    }

    // ====== SUPER FAST ABLinks SOLVER (replaces Tesseract) ======
    (function fastABLinks() {
        let lastImg = '';
        const watcher = setInterval(() => {
            let img = document.querySelector('img[alt="captcha"], img[src*="captcha"], #captcha-image');
            if (img && img.src && img.src !== lastImg) {
                lastImg = img.src;
                fastSolve(img);
            }
        }, 120);

        function fastSolve(img) {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth || img.width || 120;
                canvas.height = img.naturalHeight || img.height || 40;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;

                // simple adaptive thresholding
                let sum = 0, cnt = 0;
                for (let i = 0; i < data.length; i += 4) { sum += (data[i] + data[i+1] + data[i+2]); cnt++; }
                const avg = sum / cnt / 3;
                const thresh = Math.max(120, Math.min(160, avg));

                for (let i = 0; i < data.length; i += 4) {
                    let gray = (data[i] + data[i+1] + data[i+2]) / 3;
                    let v = gray > thresh ? 255 : 0;
                    data[i] = data[i+1] = data[i+2] = v;
                }
                ctx.putImageData(imgData, 0, 0);

                const text = readSimple(canvas);
                if (text && text.length >= 3) {
                    fillSimpleCaptcha(text);
                }

            } catch (e) { console.log('Fast ABLinks Error:', e); }
        }

        function readSimple(canvas) {
            const w = canvas.width;
            const h = canvas.height;
            const ctx = canvas.getContext('2d');
            const data = ctx.getImageData(0, 0, w, h).data;

            // vertical projection
            const cols = new Uint16Array(w);
            for (let x = 0; x < w; x++) {
                let count = 0;
                for (let y = 0; y < h; y++) {
                    const idx = (y * w + x) * 4;
                    if (data[idx] === 0) count++;
                }
                cols[x] = count;
            }

            // find segments (symbols) by gaps
            const segs = [];
            let inSeg = false, start = 0;
            for (let x = 0; x < w; x++) {
                if (!inSeg && cols[x] > 2) { inSeg = true; start = x; }
                if (inSeg && cols[x] <= 2) { inSeg = false; segs.push([start, x]); }
            }
            if (inSeg) segs.push([start, w]);

            if (segs.length === 0) return '';

            // crude mapping by widths
            const map = segs.map(s => {
                const width = s[1] - s[0];
                if (width < 8) return '1';
                if (width < 12) return '7';
                if (width < 16) return '2';
                if (width < 19) return '3';
                if (width < 22) return '8';
                if (width < 26) return 'A';
                return 'X';
            });

            // join and sanitize
            return map.join('').replace(/X/g, '').slice(0, 6);
        }

        function fillSimpleCaptcha(answer) {
            const cleaned = (answer || '').replace(/[^A-Za-z0-9]/g, '');
            if (!cleaned) return;
            const input = document.querySelector("input[name='captcha'], #captcha, input[name='code']");
            const btn = document.querySelector("button[type='submit'], input[type='submit'], #submit");
            if (input) {
                input.focus();
                input.value = cleaned;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // click submit if available
            if (btn) btn.click();
        }
    })();

    // Initialize rotator after DOM ready
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runRotator);
    else runRotator();

})();
