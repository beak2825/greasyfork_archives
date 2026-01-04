// ==UserScript== 
// @name        PWA For iOS (Progressive Web App For Any Site)
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      LieFlatandSleep
// @description Turn any site into a PWA. 
// @downloadURL https://update.greasyfork.org/scripts/557184/PWA%20For%20iOS%20%28Progressive%20Web%20App%20For%20Any%20Site%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557184/PWA%20For%20iOS%20%28Progressive%20Web%20App%20For%20Any%20Site%29.meta.js
// ==/UserScript==

function getSiteName() {
    const title = document.title?.trim();
    if (title && title.length > 0) return title;

    const host = window.location.hostname
        .replace(/^www\./, '')
        .replace(/\.[^.]+$/, ''); 

    return host.charAt(0).toUpperCase() + host.slice(1);
}

const siteName = encodeURIComponent(getSiteName());


const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = `https://api.lowtechguys.com/manif?name=${siteName}`;


const head = document.head || document.getElementsByTagName('head')[0];


if (head) {
    head.appendChild(manifestLink);
    console.log('Manifest injected for:', siteName);
} else {
    // If head doesn't exist yet, wait for it
    new MutationObserver((mutations, observer) => {
        const h = document.head;
        if (h) {
            h.appendChild(manifestLink);
            console.log('Manifest injected (late) for:', siteName);
            observer.disconnect();
        }
    }).observe(document.documentElement, { childList: true, subtree: true });
}
