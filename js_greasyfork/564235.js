// ==UserScript==
// @name         Alex Curtis's Freedium Redirect
// @namespace    https://github.com/alexcurtis/freedium-redirect
// @version      0.1
// @description  Redirects Medium articles to freedium-mirror.cfd. Use at your own risk.
// @author       Alex Curtis
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freedium-mirror.cfd
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564235/Alex%20Curtis%27s%20Freedium%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/564235/Alex%20Curtis%27s%20Freedium%20Redirect.meta.js
// ==/UserScript==

const isMediumArticle = () => !!document.querySelector(`meta[property="al:android:url"][content^="medium://p/"]`)?.content;
new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (!node?.matches?.(`head > *`)) continue;
            if (isMediumArticle()) {
                window.location.href = `https://freedium-mirror.cfd/` + window.location.href;
                observer.disconnect();
                return;
            }
        }
    }
}).observe(document, { subtree: true, childList: true });