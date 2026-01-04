// ==UserScript==
// @name         Send to Telegram
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Send from web to telegram using script
// @match        *
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.telegram.org
// @sandbox      JavaScript
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549601/Send%20to%20Telegram.user.js
// @updateURL https://update.greasyfork.org/scripts/549601/Send%20to%20Telegram.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BOT_TOKEN = "enter_bot_token_here";
    const CHAT_ID = "enter_chat_id_here"; //https://gist.github.com/nafiesl/4ad622f344cd1dc3bb1ecbe468ff9f8a

    window.addEventListener("message", function(event) {
        if (event.data?.type === "<DEFINE-YOUR-TYPE-HERE>") {
            const a = event.data.payload;
            const content = a?.data?.msgs?.[0]?.content || "[No content]";
            const sender = a?.data?.msgs?.[0]?.dName || "Unknown";

            const text = `💬 Message from ${sender}:\n${content}`;

            GM_xmlhttpRequest({
                method: "POST",
                url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `chat_id=${CHAT_ID}&text=${encodeURIComponent(text)}`,
                onload: function(response) {
                    console.log("Send Telegram:", response.responseText);
                },
                onerror: function(err) {
                    console.error("Error :", err);
                }
            });

        }
    });
})();

/*
How to use: 
From another instance, you can use:
window.postMessage({
    type: "ZALO_DATA",
    payload: parsed
}, "*");
to send data to this handler
*/
