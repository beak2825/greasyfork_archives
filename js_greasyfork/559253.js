// ==UserScript==
// @name         FB Reel Auto View + Like (Auto Start)
// @namespace    fb-reel-auto
// @version      1.1
// @description  Auto view FB Reel dengan delay random + like random (auto start)
// @author       Behesty
// @match        https://www.facebook.com/reel/*
// @match        https://web.facebook.com/reel/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559253/FB%20Reel%20Auto%20View%20%2B%20Like%20%28Auto%20Start%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559253/FB%20Reel%20Auto%20View%20%2B%20Like%20%28Auto%20Start%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let running = false;
    let currentStep = 0;
    let likeTargets = [];
    let timeoutId = null;

    /* ===================== UI ===================== */
    const panel = document.createElement('div');
    panel.style = `
        position: fixed;
        top: 80px;
        right: 20px;
        width: 260px;
        background: #111;
        color: #0f0;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        z-index: 999999;
        border-radius: 8px;
    `;

    panel.innerHTML = `
        <div style="font-weight:bold;margin-bottom:6px">FB Reel Bot</div>
        <button id="toggleBtn" style="width:100%;margin-bottom:6px">STOP</button>
        <div id="logBox" style="
            height:140px;
            overflow-y:auto;
            background:#000;
            padding:5px;
            border:1px solid #333;"></div>
    `;

    document.body.appendChild(panel);

    const logBox = panel.querySelector('#logBox');
    const toggleBtn = panel.querySelector('#toggleBtn');

    function log(msg) {
        const t = new Date().toLocaleTimeString();
        logBox.innerHTML += `[${t}] ${msg}<br>`;
        logBox.scrollTop = logBox.scrollHeight;
    }

    /* ===================== UTIL ===================== */
    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    }

    function findNextButton() {
        return document.querySelector('div[aria-label="Kartu Berikutnya"][role="button"]');
    }

    function findLikeButton() {
        return document.querySelector('div[aria-label="Suka"][role="button"]');
    }

    function click(el) {
        if (!el) return false;
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        return true;
    }

    /* ===================== CORE ===================== */
    function prepareLikes() {
        likeTargets = [];
        const totalLikes = Math.floor(Math.random() * 2) + 1; // 1–2 like
        while (likeTargets.length < totalLikes) {
            const r = Math.floor(Math.random() * 6);
            if (!likeTargets.includes(r)) likeTargets.push(r);
        }
        log(`Like di video: ${likeTargets.join(', ')}`);
    }

    function processStep() {
        if (!running) return;

        if (currentStep > 5) {
            log('Selesai 6 video. Stop otomatis.');
            stopBot();
            return;
        }

        const delay = currentStep === 0 ? 10000 : randomDelay(7, 30);
        log(`Menunggu ${delay / 1000}s (next${currentStep})`);

        timeoutId = setTimeout(() => {
            if (!running) return;

            const nextBtn = findNextButton();
            if (nextBtn) {
                click(nextBtn);
                log(`Klik NEXT ${currentStep}`);
            } else {
                log('Tombol NEXT tidak ditemukan');
            }

            if (likeTargets.includes(currentStep)) {
                setTimeout(() => {
                    const likeBtn = findLikeButton();
                    if (likeBtn) {
                        click(likeBtn);
                        log(`LIKE video ${currentStep}`);
                    } else {
                        log('Tombol LIKE tidak ditemukan');
                    }
                }, 3000);
            }

            currentStep++;
            processStep();

        }, delay);
    }

    /* ===================== CONTROL ===================== */
    function startBot() {
        if (running) return;
        running = true;
        currentStep = 0;
        logBox.innerHTML = '';
        toggleBtn.textContent = 'STOP';
        log('Bot auto start');
        prepareLikes();
        processStep();
    }

    function stopBot() {
        running = false;
        clearTimeout(timeoutId);
        toggleBtn.textContent = 'START';
        log('Bot dihentikan ⛔⛔⛔');
    }

    toggleBtn.onclick = () => {
        running ? stopBot() : startBot();
    };

    /* ===================== AUTO START ===================== */
    window.addEventListener('load', () => {
        setTimeout(startBot, 3000); // tunggu halaman benar-benar siap
    });

})();
