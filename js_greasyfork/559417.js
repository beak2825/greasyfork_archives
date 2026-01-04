// ==UserScript==
// @name         BlockPulse Auto Login + Auto Start
// @namespace    https://tampermonkey.net/
// @version      1.8
// @description  Auto login + auto start with logout recovery and performance optimization
// @author       Rubystance
// @license      MIT
// @match        https://blockpulse.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559417/BlockPulse%20Auto%20Login%20%2B%20Auto%20Start.user.js
// @updateURL https://update.greasyfork.org/scripts/559417/BlockPulse%20Auto%20Login%20%2B%20Auto%20Start.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EMAIL = 'YOUR_FAUCETPAY_EMAIL_HERE'; // << YOUR_FAUCETPAY_EMAIL

    function optimizePerformance() {
        if (document.getElementById('bp-perf-style')) return;

        const style = document.createElement('style');
        style.id = 'bp-perf-style';
        style.textContent = `
            * {
                transition-duration: 0ms !important;
                animation-duration: 0ms !important;
                animation-delay: 0ms !important;
            }
            body {
                scroll-behavior: auto !important;
            }
            canvas, video, .particles, .background {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('[BlockPulse] Performance otimizada.');
    }

    const waitFor = (fn, timeout = 30000, interval = 300) =>
        new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const res = fn();
                if (res) {
                    clearInterval(timer);
                    resolve(res);
                }
                if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject();
                }
            }, interval);
        });

    async function handleLogin() {
        const emailInput = document.querySelector('input[type="email"][name="email"]');
        const submitBtn = document.querySelector('button[type="submit"].btn.btn-black');

        if (!emailInput || !submitBtn) return;

        if (emailInput.value !== EMAIL) {
            emailInput.focus();
            emailInput.value = EMAIL;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('[BlockPulse] Email preenchido.');
        }

        submitBtn.click();
        console.log('[BlockPulse] Login enviado.');
    }

    async function handleDashboard() {
        const startBtn = document.querySelector('button.btn-black.btn-sm-custom');

        if (!startBtn) return;

        if (startBtn.disabled) return;

        startBtn.click();
        console.log('[BlockPulse] Start clicado.');
    }

    function startWatcher() {
        optimizePerformance();

        setInterval(() => {
            if (location.pathname === '/' || location.pathname === '') {
                handleLogin();
            }

            if (location.pathname === '/dashboard') {
                handleDashboard();
            }
        }, 1500);
    }

    window.addEventListener('load', () => {
        startWatcher();
        console.log('[BlockPulse] Script ativo.');
    });

})();
