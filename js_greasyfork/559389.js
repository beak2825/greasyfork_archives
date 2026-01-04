// ==UserScript==
// @name          imgur Proxy
// @namespace     JD's userscripts
// @description   For all my fellow brits out there, I grant your biggest wish. Maybe not your BIGGEST, but a big one nontheless.
// @author        JD
// @version       1.1
// @match         *://*/*
// @exclude       *://imgur.fsky.io/*
// @grant         none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/559389/imgur%20Proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/559389/imgur%20Proxy.meta.js
// ==/UserScript==

const rimgoInstance = "imgur.fsky.io";

if (location.hostname.includes("imgur.com")) {
    let newUrl = location.href;
    newUrl = newUrl.replace(/^(https?:\/\/)(www\.|i\.)?imgur\.com/i, `$1${rimgoInstance}`);

    if (newUrl !== location.href) {
        location.replace(newUrl);
    }
}

function replaceImgurLinks(scope) {
    const imgElements = scope.querySelectorAll(`img[src*="imgur.com"]:not([src*="${rimgoInstance}"])`);

    imgElements.forEach(img => {
        img.src = img.src.replace(/^(https?:\/\/)(www\.|i\.)?imgur\.com/i, `$1${rimgoInstance}`);
    });

    const aElements = scope.querySelectorAll(`a[href*="imgur.com"]:not([href*="${rimgoInstance}"])`);

    aElements.forEach(a => {
        a.href = a.href.replace(/^(https?:\/\/)(www\.|i\.)?imgur\.com/i, `$1${rimgoInstance}`);
    });
}

replaceImgurLinks(document);

const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    replaceImgurLinks(node);
                }
            });
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });