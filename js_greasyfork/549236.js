// ==UserScript==
// @name         Open in Spotify
// @version      2025-09-11
// @description  Replaces download button with link to open in app current album/playlist/track/artist
// @author       p-sam
// @namespace    http://github.com/p-sam
// @license      MIT
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/549236/Open%20in%20Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/549236/Open%20in%20Spotify.meta.js
// ==/UserScript==

const ctx = {};

unsafeWindow.history.pushState = new Proxy(unsafeWindow.history.pushState, {
    apply: (target, thisArg, argArray) => {
        const [state, unused, url] = argArray || [];
        try {
            if(url) {
                refreshOpenInSpotify(new URL(url, unsafeWindow.location.href));
            }
        } catch(error) {
            console.error(error);
        }
        return target.apply(thisArg, argArray);
    },
});

unsafeWindow.addEventListener('popstate', () => setTimeout(() => refreshOpenInSpotify(unsafeWindow.location.href), 1));

function refreshOpenInSpotify(url) {
    console.log('refreshOpenInSpotify', url);

    if(!ctx.linkEl) {
        return;
    }

    url = new URL(url);
    if(url.host !== 'open.spotify.com') {
        return;
    }

    const matches = url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?(album|playlist|track|artist)\/(\w{22})$/);
    if(!matches) {
        ctx.linkEl.style.display = 'none';
        return;
    }

    const appUrl = `spotify:${matches[1]}:${matches[2]}`;
    ctx.linkEl.href = appUrl;
    ctx.spanEl.textContent = 'Open In App';
}

function boot() {
    let linkEl = unsafeWindow.document.querySelector('a[href="/download"]');
    if(!linkEl) {
        setTimeout(boot, 200);
        return;
    }

    ctx.linkEl = linkEl.cloneNode(true);
    linkEl.parentNode.replaceChild(ctx.linkEl, linkEl);

    ctx.spanEl = ctx.linkEl;
    for(const childEl of ctx.linkEl.querySelectorAll('*')) {
        if(childEl.textContent === ctx.linkEl.textContent) {
            ctx.spanEl = childEl;
            break;
        }
    }
    refreshOpenInSpotify(unsafeWindow.location.href);
}

boot();

