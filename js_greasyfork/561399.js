// ==UserScript==
// @name         Old Reddit state saver [old.reddit.com]
// @namespace    http://tampermonkey.net/
// @version      2026-01-04
// @description  Save state when going back from posts
// @author       dimden
// @match        https://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561399/Old%20Reddit%20state%20saver%20%5Boldredditcom%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/561399/Old%20Reddit%20state%20saver%20%5Boldredditcom%5D.meta.js
// ==/UserScript==

function getFrameDepth(winToID) {
    if (winToID === window.top) {
        return 0;
    }
    else if (winToID.parent === window.top) {
        return 1;
    }

    return 1 + getFrameDepth(winToID.parent);
}

if(!window.top.windows) window.top.windows = [];
if(!window.top.windows.includes(window)) window.top.windows.push(window);
if(!window._realPath) window._realPath = location.pathname;

window.addEventListener('unload', () => {
    window.top.windows = window.top.windows.filter(w => w !== window);
});

function useIframeNavigation(e) {
    if(e.defaultPrevented) return;

    let a = e.target.closest('a');
    if(!a || !a.href || a.href.startsWith('#') || a.href.startsWith('javascript:') || a.href.startsWith('blob:')) return;
    if(a.href.startsWith('http') && !a.href.startsWith(location.origin)) return;

    let depth = getFrameDepth(window);
    if(depth > 3) return;

    let parsedURL = new URL(a.href);
    let windowExists = window.top.windows.findIndex(w => w._realPath === parsedURL.pathname);

    if(windowExists !== -1) {
        let we = window.top.windows[windowExists];
        let iframe = we.document.getElementsByClassName('iframe-navigation')[0];
        window.top.windows = window.top.windows.slice(0, windowExists + 1);
        we.document.body.style.overflow = we.previousOverflow && we.previousOverflow !== 'hidden' ? we.previousOverflow : 'auto';
        we.focus();

        window.top.history.pushState(null, null, a.href);
        if(iframe) iframe.remove();
        return;
    };

    e.preventDefault();
    e.stopImmediatePropagation();

    window.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.top.history.pushState(null, null, a.href);

    let iframe = document.createElement('iframe');
    iframe.classList.add('iframe-navigation');
    iframe.src = a.href;
    iframe.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        border: none;
        z-index: 99999;
    `;
    document.body.appendChild(iframe);
    iframe.focus();

    window.addEventListener('popstate', () => {
        let windowExists = window.top.windows.findIndex(w => w._realPath === location.pathname);

        if(windowExists !== -1) {
            let we = window.top.windows[windowExists];
            let iframe = we.document.getElementsByClassName('iframe-navigation')[0];
            window.top.windows = window.top.windows.slice(0, windowExists + 1);
            we.document.body.style.overflow = we.previousOverflow && we.previousOverflow !== 'hidden' ? we.previousOverflow : 'auto';
            we.focus();

            if(iframe) iframe.remove();
        } else {
            useIframeNavigation({
                target: { closest: () => ({ href: location.href }) },
                preventDefault: () => {},
                stopImmediatePropagation: () => {}
            });
        }
    });
}

document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if(a.href.includes('/comments/')) useIframeNavigation(e);
    if(a.dataset.eventAction === 'title') a.target = '_blank';
});