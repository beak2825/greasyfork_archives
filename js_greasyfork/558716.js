// ==UserScript==
// @name         Complete Emo YouTube Theme (Fixed & Sleek) by clownz
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Full emo YouTube theme: dark purple-pink, small buttons, smooth hover, glowing home button, faster load, no Premium.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558716/Complete%20Emo%20YouTube%20Theme%20%28Fixed%20%20Sleek%29%20by%20clownz.user.js
// @updateURL https://update.greasyfork.org/scripts/558716/Complete%20Emo%20YouTube%20Theme%20%28Fixed%20%20Sleek%29%20by%20clownz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockLogoCSS = `
    ytd-topbar-logo-renderer.style-scope.ytd-masthead >
    .yt-simple-endpoint.style-scope.ytd-topbar-logo-renderer >
    div.style-scope.ytd-topbar-logo-renderer >
    .style-scope.ytd-topbar-logo-renderer >
    .style-scope.ytd-logo >
    .yt-icon-shape.style-scope.yt-icon.ytSpecIconShapeHost >
    div {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
    }
    `;

    const style1 = document.createElement("style");
    style1.textContent = blockLogoCSS;
    document.head.appendChild(style1);


    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    document.documentElement.style.fontFamily = "'Roboto', sans-serif";


    const css = `
    :root {
        --yt-bg-color: #1a1a28;
        --yt-bg-secondary: #2a2a3d;
        --yt-text-color: #c78aff;
        --yt-left-area-color: #9c4edd;
        --yt-sidebar-text-color: #b17ecf;
        --yt-hover-color: #7a2aa7;
        --yt-chips-bg: #2f2f47;
        --yt-button-bg: #3d2b5c;
        --yt-button-hover: #7c4ecf;
    }

    body, ytd-app {
        background-color: var(--yt-bg-color) !important;
        color: var(--yt-text-color) !important;
        transition: background 0.5s ease, color 0.5s ease;
    }


    ytd-rich-grid-media, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer {
        background-color: var(--yt-bg-secondary) !important;
        border-radius: 10px;
        margin-bottom: 10px;
        box-shadow: 0 3px 15px rgba(0,0,0,0.6);
        transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    }
    ytd-rich-grid-media:hover,
    ytd-video-renderer:hover,
    ytd-grid-video-renderer:hover,
    ytd-rich-item-renderer:hover {
        background-color: var(--yt-hover-color) !important;
        transform: scale(1.03);
        box-shadow: 0 8px 25px rgba(156,78,221,0.6);
    }


    ytd-mini-guide-renderer,
    ytd-guide-entry-renderer {
        background-color: var(--yt-bg-secondary) !important;
        color: var(--yt-sidebar-text-color) !important;
        border-radius: 8px;
        padding: 4px 8px;
        margin-bottom: 4px;
        box-shadow: 0 3px 12px rgba(0,0,0,0.5);
        transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    ytd-mini-guide-renderer:hover,
    ytd-guide-entry-renderer:hover {
        background-color: var(--yt-hover-color) !important;
        color: var(--yt-left-area-color) !important;
        transform: scale(1.02);
        box-shadow: 0 5px 18px rgba(156,78,221,0.6);
    }


    #chips-content {
        background-color: var(--yt-chips-bg) !important;
        padding: 6px 10px;
        border-radius: 10px;
        display: flex;
        gap: 4px;
        margin-bottom: 10px;
        box-shadow: 0 3px 12px rgba(0,0,0,0.5);
    }
    #chips-content ytd-chip-cloud-chip-renderer {
        background-color: var(--yt-button-bg) !important;
        color: var(--yt-text-color) !important;
        border-radius: 16px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 500;
        transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
        cursor: pointer;
    }
    #chips-content ytd-chip-cloud-chip-renderer:hover {
        background-color: var(--yt-button-hover) !important;
        color: var(--yt-left-area-color) !important;
        transform: scale(1.04);
        box-shadow: 0 4px 15px rgba(156,78,221,0.6);
    }


    yt-button-renderer, ytd-toggle-button-renderer, paper-button, tp-yt-paper-button, ytd-menu-renderer {
        background-color: var(--yt-button-bg) !important;
        color: var(--yt-text-color) !important;
        border-radius: 8px !important;
        padding: 4px 8px !important;
        margin-right: 4px !important;
        font-weight: 500 !important;
        font-size: 13px !important;
        text-transform: none !important;
        transition: background 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }
    yt-button-renderer:hover, ytd-toggle-button-renderer:hover, paper-button:hover, tp-yt-paper-button:hover, ytd-menu-renderer:hover {
        background-color: var(--yt-button-hover) !important;
        color: var(--yt-left-area-color) !important;
        transform: scale(1.03);
        box-shadow: 0 3px 12px rgba(156,78,221,0.6);
    }


    a {
        color: var(--yt-text-color) !important;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    a:hover {
        color: var(--yt-left-area-color) !important;
    }


    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-thumb {
        background: var(--yt-text-color);
        border-radius: 6px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: var(--yt-left-area-color);
    }
    ::-webkit-scrollbar-track { background: var(--yt-bg-color); }


    @keyframes pulse-glow {
        0% { box-shadow: 0 0 10px #9c4edd; }
        50% { box-shadow: 0 0 25px #c78aff; }
        100% { box-shadow: 0 0 10px #9c4edd; }
    }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);


    const homeButtonURL = 'https://imgs.search.brave.com/mFsaE1Yv6cqVapwYvfq3YaBAxuaPJAUlgS9LzIMdE-w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YTQuZ2lwaHkuY29t/L21lZGlhL3YxLlky/bGtQVGM1TUdJM05q/RXhhakF6TldScmVt/RXlibll5WjNFM2F6/VTVjMnd6Wm5rd09E/SnpNMjFzWnpoMWMy/OXdkbkJ6YXlabGNE/MTJNVjluYVdaelgz/TmxZWEpqYUNaamRE/MW4vbWhhZms1NDRF/OExDTTA2OEZULzIw/MC5naWY.gif';

    function applyHomeButton() {
        const home = document.querySelector('ytd-topbar-logo-renderer a#logo[href="/"]');
        if(home) {
            home.style.backgroundImage = `url(${homeButtonURL})`;
            home.style.backgroundSize = '90px 40px';
            home.style.backgroundPosition = 'center';
            home.style.backgroundRepeat = 'no-repeat';
            home.style.width = '90px';
            home.style.height = '40px';
            home.style.animation = 'pulse-glow 2s infinite';
        }
    }


    const observer = new MutationObserver(() => applyHomeButton());
    observer.observe(document.body, { childList: true, subtree: true });


    applyHomeButton();


    const removePremium = () => {
        const elems = document.querySelectorAll('ytd-banner-promo-renderer, tp-yt-paper-button#upgrade-button');
        elems.forEach(el => el.remove());
    }
    setInterval(removePremium, 10);
const watermark = document.createElement('div');
watermark.textContent = 'by clownz';
watermark.style.position = 'fixed';
watermark.style.bottom = '8px';
watermark.style.right = '8px';
watermark.style.fontSize = '10px';
watermark.style.color = 'var(--yt-text-color)';
watermark.style.opacity = '0.6';
watermark.style.pointerEvents = 'none';
watermark.style.zIndex = '9999';
watermark.style.fontFamily = "'Roboto', sans-serif";
document.body.appendChild(watermark);

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        watermark.style.display = 'none';
    } else {
        watermark.style.display = 'block';
    }
});
})();
