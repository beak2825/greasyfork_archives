// ==UserScript==
// @name        Holotower X/BSKY Sauce
// @namespace   http://holotower.org/
// @version     1
// @author      KanashiiWolf
// @match       *://boards.holotower.org/*
// @match       *://holotower.org/*
// @description Adds saucelinks
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/554505/Holotower%20XBSKY%20Sauce.user.js
// @updateURL https://update.greasyfork.org/scripts/554505/Holotower%20XBSKY%20Sauce.meta.js
// ==/UserScript==

(() => {

    const config = {
        childList: true,
        subtree: true
    };

    const regexAll = /@(?:([a-zA-Z0-9-\.]+)-bsky|(\w+))-(\d{19}|\S{13})(-\d)?.*\.\w+$/i;
    /*
     * 0: full
     * 1: BSKY user.domain
     * 2: X user
     * 3: post ID
     * 4: content # in post
     */

    //const regexBSKY = /@([a-zA-Z0-9-\.]+)-bsky-(\S{13})(-\d)?.*\.\w+$/i; // 0: full, 1: user.domain, 2: post id, 3: content #
    //const regexX = /@(\w+)-(\d{19})(-\d)?.*\.\w+$/i; // 0: full, 1: user, 2: post id, 3: content #

    const waitForContent = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (let node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                const files = node.querySelectorAll('.fileinfo span.unimportant a')
                    .forEach((file) => {
                        if (file && !file.hasAttribute("sauced")) {
                            file.setAttribute('sauced', '');
                            let data = file.download.match(regexAll);
                            if (!!data)
                                addSauceButton(file, data);
                        }
                    });
            }
        }
    };

    const contentObserver = new MutationObserver(waitForContent);
    contentObserver.observe(document, config);

    function addSauceButton(el, data) {
        if (el == null) return;
        let SITE, URL;
        let sauceEl = document.createElement('span');
        if (!!data[1]) {
            SITE = "🦋";
            URL = `https://bsky.app/profile/${data[1]}/post/${data[3]}`;
        } else {
            SITE = "𝕏";
            URL = `https://x.com/${data[2]}/status/${data[3]}`;
        }
        sauceEl.innerHTML = `[<a href="${URL}" target="_blank">${SITE}</a>]`;
        el.parentElement.parentElement.appendChild(sauceEl);
    }
})();
