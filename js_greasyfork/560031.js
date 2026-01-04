// ==UserScript==
// @name         dos.zone/grand-theft-auto-vice-city
// @namespace    https://tampermonkey.net/
// @version      2.2
// @description  Successfully running dos.zone/grand-theft-auto-vice-city
// @author       bengang
// @match        https://dos.zone/grand-theft-auto-vice-city/*
// @match        https://cdn.dos.zone/vcsky/release/vc-sky-en-v5/game.js*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dos.zone
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560031/doszonegrand-theft-auto-vice-city.user.js
// @updateURL https://update.greasyfork.org/scripts/560031/doszonegrand-theft-auto-vice-city.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CDN_URL = "https://cdn.dos.zone/vcsky/release/vc-sky-en-v5/game.js";
    const GAME_URL = "https://dos.zone/grand-theft-auto-vice-city/";

    if (window.location.href.includes("cdn.dos.zone")) {
        localStorage.setItem('vcsky.haveOriginalGame', 'true');
        window.location.href = GAME_URL + "?auth=success";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('auth')) {
        window.location.href = CDN_URL;
        return;
    }

    if (window.__vcFullscreenInjected) return;
    window.__vcFullscreenInjected = true;

    function injectFavicon() {
        let link = document.querySelector('link[rel="icon"]') || document.createElement('link');
        link.rel = 'icon';
        link.href = 'https://www.google.com/s2/favicons?sz=64&domain=dos.zone';
        link.type = 'image/x-icon';
        document.head.appendChild(link);
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'vc-fullscreen-style';
        style.textContent = `
            html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: hidden !important;
                background: #000;
            }
            iframe#vc-fullscreen-iframe {
                position: fixed;
                inset: 0;
                width: 100%;
                height: 100%;
                border: none;
                display: block;
                background: #000;
            }
        `;
        document.head.appendChild(style);
    }

    function clearPage() {
        document.body.innerHTML = '';
    }

    function createIframe() {
        const iframe = document.createElement('iframe');
        iframe.id = 'vc-fullscreen-iframe';
        iframe.src = 'https://cdn.dos.zone/vcsky/release/vc-sky-en-v5/index.html?lang=en';
        iframe.allowFullscreen = true;
        return iframe;
    }

    function init() {
        injectFavicon();
        injectStyles();
        clearPage();
        document.body.appendChild(createIframe());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();