// ==UserScript==
// @name         Vinted Dark Mode
// @namespace    https://greasyfork.org/en/users/1550823-nigel1992
// @version      0.30
// @description  Global Dark Mode for Vinted (buttons, inputs, chips, navigation, stars, titles, footer, SPA support, app store badges)
// @author       Nigel1992
// @match        *://*.vinted.at/*
// @match        *://*.vinted.be/*
// @match        *://*.vinted.co.uk/*
// @match        *://*.vinted.cz/*
// @match        *://*.vinted.de/*
// @match        *://*.vinted.dk/*
// @match        *://*.vinted.es/*
// @match        *://*.vinted.fr/*
// @match        *://*.vinted.hu/*
// @match        *://*.vinted.it/*
// @match        *://*.vinted.lt/*
// @match        *://*.vinted.lu/*
// @match        *://*.vinted.nl/*
// @match        *://*.vinted.pl/*
// @match        *://*.vinted.pt/*
// @match        *://*.vinted.ro/*
// @match        *://*.vinted.se/*
// @match        *://*.vinted.sk/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at      document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560002/Vinted%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/560002/Vinted%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const darkCSS = `
    /* ===== Base Dark Mode Colors ===== */
    html.dark-mode {
        --color-background-primary: #121212 !important;
        --color-background-secondary: #1a1a1a !important;
        --color-text-primary: #e0e0e0 !important;
        --color-text-secondary: #aaaaaa !important;
        --color-border-primary: #333333 !important;
        --color-button-primary-background: #007782 !important;
        --color-button-primary-text: #ffffff !important;
    }
    html.dark-mode, html.dark-mode body, html.dark-mode #content, html.dark-mode .viewport, html.dark-mode .web_ui__Page__page, html.dark-mode [class*="u-background-white"] {
        background-color: #121212 !important;
        color: #e0e0e0 !important;
        transition: background 0.3s ease, color 0.3s ease;
    }

    /* ===== Headers, Tabs ===== */
    html.dark-mode .l-header, html.dark-mode .l-header__main, html.dark-mode .l-header__navigation, html.dark-mode .web_ui__Tabs__tabs {
        background-color: #121212 !important;
        border-bottom: 1px solid #333 !important;
    }

    /* ===== Text, feeds ===== */
    html.dark-mode svg { fill: #ffffff !important; stroke: #ffffff !important; }
    html.dark-mode .feed-grid, html.dark-mode .catalog-container, html.dark-mode .u-bg-white { background-color: #121212 !important; }
    html.dark-mode .web_ui__Text__text, html.dark-mode p, html.dark-mode span, html.dark-mode h1, html.dark-mode h2, html.dark-mode h3 { color: #e0e0e0 !important; }

    /* ===== Inbox / Thread ===== */
    html.dark-mode .inbox-page__container, html.dark-mode .inbox-page__block, html.dark-mode .thread__wrapper, html.dark-mode .thread__messages-container, html.dark-mode .thread__content { background-color: #121212 !important; }
    html.dark-mode .inbox-page__block--sidebar, html.dark-mode .conversation-list-toolbar, html.dark-mode .u-fill-height.u-overflow-auto { background-color: #121212 !important; }
    html.dark-mode [data-testid^="inbox-list-item"], html.dark-mode .web_ui__Cell__cell { background-color: #121212 !important; border-bottom: 1px solid #2a2a2a !important; }
    html.dark-mode .u-background-gray { background-color: #1a1a1a !important; }
    html.dark-mode .web_ui__Cell__navigating:hover { background-color: #1e1e1e !important; }
    html.dark-mode .web_ui__Card__card, html.dark-mode .web_ui__Card__lifted { background-color: #1a1a1a !important; border: 1px solid #2a2a2a !important; }
    html.dark-mode .conversation-header { background-color: #121212 !important; border-bottom: 1px solid #333 !important; }
    html.dark-mode .web_ui__Bubble__bubble { background-color: #1e1e1e !important; color: #e0e0e0 !important; }
    html.dark-mode .web_ui__Bubble__inverse { background-color: #007782 !important; color: #ffffff !important; }
    html.dark-mode .web_ui__Text__caption { color: #999 !important; }
    html.dark-mode .web_ui__Divider__divider { background-color: #2a2a2a !important; }

    /* ===== Dark Mode Buttons: Toggle & Bug ===== */
    #vinted-dark-toggle, #vinted-bug-report {
        position: fixed;
        right: 20px;
        z-index: 9999;
        padding: 10px 18px;
        border-radius: 50px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.6);
        text-align: center;
        font-family: sans-serif;
    }
    #vinted-dark-toggle { bottom: 70px; background: #2a2a2a; color: #ffffff; border: 1px solid #555; }
    #vinted-bug-report { bottom: 20px; background: #ff5555; color: #fff; border: 1px solid #cc0000; }
    #vinted-dark-toggle:hover { background: #3a3a3a; }
    #vinted-bug-report:hover { background: #ff3333; }

    @media (max-width: 600px) {
        #vinted-dark-toggle, #vinted-bug-report { right: 10px; padding: 8px 14px; font-size: 14px; }
        #vinted-dark-toggle { bottom: 60px; }
        #vinted-bug-report { bottom: 10px; }
    }

    /* ===== Chips ===== */
    html.dark-mode .web_ui__Chip__chip {
        background-color: #007782 !important;
        color: #ffffff !important;
        border-color: #005f63 !important;
    }
    html.dark-mode .web_ui__Chip__chip .web_ui__Text__text { color: #ffffff !important; }
    html.dark-mode .web_ui__Chip__chip svg { fill: #ffffff !important; stroke: #ffffff !important; }
    html.dark-mode .web_ui__Chip__chip.web_ui__Chip__outlined { border-color: #ffffff !important; }

    /* ===== Inputs ===== */
    html.dark-mode .web_ui__Input__input { background-color: #1a1a1a !important; border: 1px solid #333 !important; color: #e0e0e0 !important; }
    html.dark-mode .web_ui__Input__title { color: #e0e0e0 !important; }
    html.dark-mode .web_ui__Input__value { background-color: #222 !important; color: #ffffff !important; border: none !important; caret-color: #ffffff !important; }

    /* ===== Navigation & Buttons ===== */
    html.dark-mode .web_ui__Button__button {
        background-color: #007782 !important;
        color: #ffffff !important;
        border: 1px solid #005f63 !important;
    }
    html.dark-mode .web_ui__Button__button .web_ui__Button__content,
    html.dark-mode .web_ui__Button__button .web_ui__Button__icon,
    html.dark-mode .web_ui__Button__button svg {
        color: #ffffff !important;
        fill: #ffffff !important;
        stroke: #ffffff !important;
    }

    /* ===== Star Ratings ===== */
    html.dark-mode .web_ui__Rating__star .web_ui__Icon__icon svg path {
        fill: #007782 !important;
    }

    /* ===== Cell Titles ===== */
    html.dark-mode .web_ui__Cell__title {
        color: #007782 !important;
    }

    /* ===== Footer Dark Mode ===== */
    html.dark-mode .main-footer__content {
        background-color: #121212 !important;
        color: #e0e0e0 !important;
    }
    html.dark-mode .main-footer__links-section-label {
        color: #007782 !important;
    }
    html.dark-mode .main-footer__links-section-link,
    html.dark-mode .main-footer__privacy-section-link,
    html.dark-mode .main-footer__privacy-section-link button {
        color: #007782 !important;
    }
    html.dark-mode .web_ui__Divider__divider {
        background-color: #2a2a2a !important;
    }

    /* ===== Footer Social Icons ===== */
    html.dark-mode .main-footer__social-media-link img {
        filter: brightness(0) invert(1);
    }

    /* ===== Footer App Store Badges ===== */
    html.dark-mode .main-footer__social-section-app-store {
        background-color: #121212 !important;
        padding: 10px 0;
    }
    html.dark-mode .main-footer__social-app-store-item {
        margin-right: 10px;
    }
    html.dark-mode .main-footer__social-app-store-item a {
        display: inline-block;
    }
    html.dark-mode .main-footer__social-app-store-item img {
        filter: none !important;
        background-color: #121212;
        border-radius: 5px;
        padding: 2px;
    }
    `;

    GM_addStyle(darkCSS);

    const htmlEl = document.documentElement;

    // Dark mode preference
    let isDark = GM_getValue('darkMode', null);
    if (isDark === null) {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        GM_setValue('darkMode', isDark);
    }
    if (isDark) htmlEl.classList.add('dark-mode');

    function onBodyReady(callback) {
        if (document.body) return callback();
        new MutationObserver((obs) => {
            if (document.body) {
                obs.disconnect();
                callback();
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    onBodyReady(() => {
        // ===== Create Toggle & Bug Buttons =====
        const darkBtn = document.createElement('button');
        darkBtn.id = 'vinted-dark-toggle';
        darkBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
        document.body.appendChild(darkBtn);

        const bugBtn = document.createElement('button');
        bugBtn.id = 'vinted-bug-report';
        bugBtn.textContent = '🐞 Report Issue';
        document.body.appendChild(bugBtn);

        bugBtn.addEventListener('click', () => {
            if (document.getElementById('vinted-bug-modal')) return;
            const overlay = document.createElement('div');
            overlay.id = 'vinted-bug-modal';
            Object.assign(overlay.style, {
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 9999
            });

            const modal = document.createElement('div');
            Object.assign(modal.style, {
                background: '#1a1a1a', color: '#e0e0e0', padding: '20px 25px', borderRadius: '10px',
                maxWidth: '400px', textAlign: 'center', fontFamily: 'sans-serif',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            });

            modal.innerHTML = `
                <p>⚠️ Please check the known issues first:</p>
                <p><a href="https://greasyfork.org/en/scripts/560002-vinted-dark-mode-toggle" target="_blank" style="color:#00bcd4; text-decoration:underline;">Vinted Dark Mode Known Issues</a></p>
                <button id="vinted-bug-ok" style="
                    margin-top: 15px;
                    padding: 8px 16px;
                    border:none;
                    border-radius:5px;
                    background:#007782;
                    color:#fff;
                    font-weight:bold;
                    cursor:pointer;
                ">Unknown issue? Click here to report</button>
            `;
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            document.getElementById('vinted-bug-ok').addEventListener('click', () => {
                document.body.removeChild(overlay);
                window.open('https://greasyfork.org/en/scripts/560002-vinted-dark-mode-toggle/feedback', '_blank');
            });
        });

        // ===== Dark Mode Toggle Event =====
        darkBtn.addEventListener('click', () => {
            isDark = !isDark;
            htmlEl.classList.toggle('dark-mode', isDark);
            darkBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
            GM_setValue('darkMode', isDark);
        });
    });

    // ===== SPA & URL Observer (throttled) =====
    let lastUrl = location.href;
    let throttleTimeout = null;
    new MutationObserver(() => {
        if (throttleTimeout) return;
        throttleTimeout = setTimeout(() => {
            throttleTimeout = null;
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (GM_getValue('darkMode', false)) htmlEl.classList.add('dark-mode');
            }
        }, 200);
    }).observe(document.body || document.documentElement, { childList: true, subtree: true });

})();
