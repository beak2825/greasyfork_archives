// ==UserScript==
// @name         Kick.com Live Chat Link Opener
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Monitor Kick live chat for links and open them in new tabs automatically (use responsibly!) 🟢
// @author       You
// @match        https://kick.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/548187/Kickcom%20Live%20Chat%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/548187/Kickcom%20Live%20Chat%20Link%20Opener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const openedLinks = new Set();
    const urlRegex = /(bndid=)+/gi;
    const urlRegexBonsai = /bonsaifreespins+/gi;
    const urlRegexBonsai2 = /bonsaiyamagiveaway+/gi;
    let spinURL = '';
    let option = { active: true };
    const waitForChat = setInterval(() => {
        const chatContainer = document.querySelector('#channel-chatroom');
        if (chatContainer) {
            clearInterval(waitForChat);
            console.log('[Kick Link Opener] Chat detected. Monitoring for links...');
            observeChat(chatContainer);
        }
    }, 1000);

    function observeChat(container) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {

                        // Look for links in <a> tags
                        const links = node.querySelectorAll('a');
                        console.log(`Links ${links.length}`);
                        links.forEach(link => {
                            const href = link.href;
                            console.log(new Date().toISOString() + ` Found link ${href}`);
                            if ((urlRegex.test(href) || urlRegexBonsai.test(href) || urlRegexBonsai2.test(href)) && !openedLinks.has(href)) {
                                openedLinks.add(href);
                                console.log(`[OPENING LINK] ${href}`);
                                GM_openInTab(href, option);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(container, { childList: true, subtree: true });
    }
})();