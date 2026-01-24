// ==UserScript==
// @name         Scalelup Beta
// @namespace    https://scalelup.com/
// @version      0.1
// @description  Automatiza Scalelup: avança posts,, gerencia likes ocasionais, exibe estatísticas.
// @icon         https://scalelup.com/favicon.ico
// @match        https://scalelup.com/*
// @author       Miningbitcoin16/ChatGPTs Scripter
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563816/Scalelup%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/563816/Scalelup%20Beta.meta.js
// ==/UserScript==

// AVISO: O script não faz login automático.
// Certifique-se de estar logado na sua conta do Scalelup antes de iniciar o bot.

// NOTICE: This script does NOT perform automatic login.
// You must be logged in manually before using it.





(function () {
    'use strict';

    /* =====================
       FLAGS
    ====================== */
    let RUNNING = true;
    let lastActivity = Date.now();
    let reloadCount = 0;

    /* =====================
       LANG
    ====================== */
    const isPT = navigator.language.toLowerCase().startsWith('pt');

    const T = {
        title: 'Scalelup Bot',
        clicksTotal: isPT ? 'Cliques Totais (24h)' : 'Total Clicks (24h)',
        clicksLike: isPT ? 'Cliques p/ Like' : 'Clicks for Like',
        likesToday: isPT ? 'Likes Hoje' : 'Likes Today',
        coins: isPT ? 'Coletado' : 'Collected',
        status: isPT ? 'Status' : 'Status',
        active: isPT ? 'Ativo' : 'Active',
        stopped: isPT ? 'Parado' : 'Stopped'
    };

    /* =====================
       UTIL
    ====================== */
    const rand = (a, b) => Math.random() * (b - a) + a;
    const delay = (a, b) => new Promise(r => setTimeout(r, rand(a, b)));

    /* =====================
       STORAGE
    ====================== */
    const S = {
        g: (k, d) => JSON.parse(localStorage.getItem(k)) ?? d,
        s: (k, v) => localStorage.setItem(k, JSON.stringify(v))
    };

    /* =====================
       RESET 24H
    ====================== */
    const now = Date.now();
    if (now - S.g('dailyReset', 0) > 86400000) {
        S.s('dailyReset', now);
        S.s('totalClicks', 0);
        S.s('dailyLikes', 0);
    }

    let likeClicks = S.g('likeClicks', 0);
    let totalClicks = S.g('totalClicks', 0);
    let dailyLikes = S.g('dailyLikes', 0);
    let coins = S.g('coins', 0);
    let targetLike = S.g('targetLike', Math.floor(rand(15, 40)));
    let nextNavAt = S.g('nextNavAt', Math.floor(rand(60, 80)));

    /* =====================
       DISPLAY (TODAS AS PÁGINAS)
    ====================== */
    const panel = document.createElement('div');
    panel.style.cssText = `
        position:fixed;
        bottom:15px;
        right:15px;
        background:linear-gradient(135deg,#111,#333);
        color:#fff;
        padding:12px 14px;
        font:12px Arial;
        border-radius:10px;
        box-shadow:0 4px 15px rgba(0,0,0,.4);
        z-index:99999;
        min-width:180px;
    `;
    document.body.appendChild(panel);

    const updatePanel = (status) => {
        panel.innerHTML = `
            <div style="font-weight:bold;margin-bottom:6px;">${T.title}</div>
            ${T.clicksTotal}: ${totalClicks}<br>
            ${T.clicksLike}: ${likeClicks}<br>
            ${T.likesToday}: ${dailyLikes}<br>
            ${T.coins}: ${coins}<br>
            <span style="opacity:.8">${T.status}: ${status}</span>
        `;
    };

    /* =====================
       BOTÕES START / STOP
    ====================== */
    const createTopButton = (text, onClick) => {
        const btn = document.createElement('div');
        btn.style.cssText = `
            position:fixed;
            top:10px;
            left:50%;
            transform:translateX(-50%);
            cursor:pointer;
            z-index:99999;
        `;
        btn.innerHTML = `
            <div style="
                display:flex;
                align-items:center;
                gap:8px;
                background:rgba(0,0,0,.45);
                padding:8px 14px;
                border-radius:16px;
                color:#fff;
                font:bold 15px Arial;
            ">
                <img src="https://scalelup.com/static/media/scalelup.6291f43cadc59681754999b51bd91c62.svg"
                     style="height:22px">
                <span>${text}</span>
            </div>
        `;
        btn.onclick = onClick;
        document.body.appendChild(btn);
    };

    if (location.pathname === '/home') {
        createTopButton('Start Bot', () => location.href = '/discover');
    }

    if (location.pathname === '/discover') {
        createTopButton('Stop Bot', () => {
            RUNNING = false;
            updatePanel(T.stopped);
            location.href = '/home';
        });
    }

    if (location.pathname !== '/discover') {
        updatePanel(T.stopped);
        return;
    }
    /* =====================
    HELPERS
    ===================== */
    const progressEl = () => document.querySelector('div.sc-kpMTpV');
    const progress100 = el => el && el.getAttribute('width') === '100';
    const hasCoinsMsg = () =>
    [...document.querySelectorAll('div.sc-hSQXhq')]
    .some(e => e.textContent.includes('You found coins'));

    const hasLiked = () =>
    !!document.querySelector('img[src*="heart-red"]') ||
          !!document.querySelector('.sc-giBncV[disabled]');
    const isElementInViewport = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const visibleHeight = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        return visibleHeight / r.height >= 0.6;
    };

    const humanScrollAndWait = async (targetEl) => {
        if (!targetEl) return;
        if (isElementInViewport(targetEl)) {
            return;
        }
        targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        const rect = targetEl.getBoundingClientRect();
        const distance = Math.abs(rect.top - window.innerHeight * 0.5);
        const scrollTime = Math.min(3000, distance * 0.6);
        await delay(scrollTime + 800, scrollTime + 1600);
        await delay(450, 900);
    };

    /* =====================
       NEXT POST
    ====================== */
    const clickNext = async () => {
        const el =
            document.querySelector('#nextButton > div') ||
            [...document.querySelectorAll('div.sc-crjgfN')]
                .find(e => e.textContent.trim() === 'Show Next Post');

        if (!el) return false;

        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        await delay(400, 900);
        el.click();

        likeClicks++;
        totalClicks++;

        S.s('likeClicks', likeClicks);
        S.s('totalClicks', totalClicks);

        lastActivity = Date.now();
        updatePanel(T.active);
        return true;
    };

    /* =====================
       LIKE
    ====================== */
    const tryLike = () => {
        if (likeClicks < targetLike || hasLiked()) return;

        const btn = document.querySelector('img[src*="heart"]')?.closest('div');
        if (!btn) return;

        setTimeout(() => {
            btn.click();
            dailyLikes++;
            likeClicks = 0;
            targetLike = Math.floor(rand(25, 60));

            S.s('dailyLikes', dailyLikes);
            S.s('likeClicks', likeClicks);
            S.s('targetLike', targetLike);
        }, rand(2000, 5000));
    };

    /* =====================
       LOOP PRINCIPAL
    ====================== */
    (async function loop() {
        updatePanel(T.active);

        while (RUNNING) {
            const p = progressEl();

            if (p && progress100(p)) {
                await delay(2000, 5000);
                const nextBtn =
                      document.querySelector('#nextButton > div') ||
                      [...document.querySelectorAll('div.sc-crjgfN')]
                .find(e => e.textContent.trim() === 'Show Next Post');
                await humanScrollAndWait(nextBtn);

                await delay(600, 1400);
                await clickNext();
                tryLike();
            }

            else if (!p && hasCoinsMsg()) {
                coins++;
                S.s('coins', coins);
                await delay(3000, 12000);
                await clickNext();
                tryLike();
            }

            if (Date.now() - lastActivity > 70000) {
                reloadCount++;
                if (reloadCount >= 3) {
                    RUNNING = false;
                    location.href = '/home';
                } else {
                    location.reload();
                }
            }

            await delay(2500, 4200);
        }
    })();

})();
