// ==UserScript==
// @name         YouTube Live Chat Link Monitor (via href)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Monitor YouTube live chat and extract actual links by href attribute.
// @author       You
// @match        https://www.youtube.com/live_chat*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/548189/YouTube%20Live%20Chat%20Link%20Monitor%20%28via%20href%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548189/YouTube%20Live%20Chat%20Link%20Monitor%20%28via%20href%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const urlRegex = /(bndid\%3D)+/gi;
    const urlRegexBonsai = /bonsaifreespins+/gi;
    const urlRegexBonsai2 = /bonsaiyamagiveaway+/gi;
    let spinURL = '';
    let option = { active: true };
    // Wait until the chat container is loaded
    const waitForChat = setInterval(() => {
        const chatContainer = document.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');
        if (chatContainer) {
            clearInterval(waitForChat);
            observeChat(chatContainer);
            console.log('[YouTube Link Monitor] Chat detected. Monitoring for <a href> links...');
        }
    }, 1000);

    function observeChat(container) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const author = node.querySelector('#author-name')?.innerText || 'Unknown';

                        // Look for all anchor tags inside the message
                        const links = node.querySelectorAll('a');
                        links.forEach(link => {
                            const href = link.href;
                            console.log(`Link found ${href}, checking if this is freespin link`);
                            if (urlRegex.test(href) || urlRegexBonsai.test(href) || urlRegexBonsai2.test(href)) {
                                if (href.slice(-15) != spinURL.slice(-15)) {
                                    spinURL = href;
                                    console.log(`Attempting to open link`);
                                    GM_openInTab(href, option);
                                }
                            }
                        });
                    }
                });
            });
        });

        observer.observe(container, { childList: true, subtree: true });
    }
})();

// (function () {
//     'use strict';

//     // Regex to detect URLs
//     // const urlRegex = /https?:\/\/[^\s]+/gi;
//     const urlRegex = /(bndid\%3D)+/gi
//     // https://lonestarcasino.com/?af=2598&b
//     // https://www.youtube.com/redirect?event=live_chat&amp;redir_token=QUFFLUhqa0wyQklUMmhzTUFBZXpFZzRPSk9pZWxFalM2UXxBQ3Jtc0trU0JPNjJWYV9aQmc5RnpVVkNBX3pGYXIxbVNyc2hYdlNRX1VEYTBMbVJWUjhVcV9mS3gwU0NTTWJTN0VCLUdIZW1RbWpueXlxd0hqNEc5bHZPbmI4c24ybm1OWGhHMXRFaU9HVGZ2dmdSTmo3LWtFbw&amp;q=https%3A%2F%2Flonestarcasino.com%2F%3Faf%3D2598%26bndid%3D68887077c298c
//     // https://lonestarcasino.com/?af=2598&bndid=68887077c298c

//     // Wait for the chat container to appear
//     const waitForChat = setInterval(() => {
//         const chatContainer = document.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');
//         if (chatContainer) {
//             clearInterval(waitForChat);
//             observeChat(chatContainer);
//             console.log('[YouTube Link Monitor] Chat detected. Monitoring for links...');
//         }
//     }, 1000);

//     function observeChat(container) {
//         const observer = new MutationObserver((mutations) => {
//             mutations.forEach(mutation => {
//                 mutation.addedNodes.forEach(node => {
//                     if (node.nodeType === Node.ELEMENT_NODE) {
//                         const messageText = node.innerText;
//                         const author = node.querySelector('#author-name')?.innerText || 'Unknown';

//                         if (urlRegex.test(messageText)) {
//                             console.log(`[LINK DETECTED] ${author}: ${messageText}`);
//                         }
//                     }
//                 });
//             });
//         });

//         observer.observe(container, { childList: true, subtree: true });
//     }
// })();