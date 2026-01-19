// ==UserScript==
// @name         HAGS - Survev ESP & Aimbot
// @namespace    https://github.com/HAGS-ESP
// @version      4.3.0
// @description  ESP + Aimbot userscript for Survev.io
// @author       HAGS
// @license      MIT
// @match        *://survev.io/*
// @match        *://*.survev.io/*
// @match        *://resurviv.biz/*
// @match        *://*.resurviv.biz/*
// @match        *://resurviv.pp.ua/*
// @match        *://*.resurviv.pp.ua/*
// @match        *://185.126.158.61/*
// @match        *://66.179.254.36/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563193/HAGS%20-%20Survev%20ESP%20%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/563193/HAGS%20-%20Survev%20ESP%20%20Aimbot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const scriptURL = 'https://raw.githubusercontent.com/HAGS-ESP/Survev-Cheat-HAGS/refs/heads/main/survev-cheat.js';
    fetch(scriptURL)
        .then(response => response.text())
        .then(code => {
            const script = document.createElement('script');
            script.textContent = code;
            document.head.appendChild(script);
            console.log('[HAGS] Script loaded successfully!');
        })
        .catch(error => {
            console.error('[HAGS] Failed to load script:', error);
        });
})();
