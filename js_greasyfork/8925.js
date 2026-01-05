// ==UserScript==
// @name        Test Script Cross Domain POST
// @description All tests are outputed to developer javascript console (try F12 hotkey)
// @namespace   Cross_Domain_POST
// @include     http://www.reddit.com/r/GreaseMonkey/comments/2wb05u/troubleshooting_dev_tampermonkey_gm/
// @version     2.01
// @grant       GM_xmlhttpRequest
// @noframes
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/8925/Test%20Script%20Cross%20Domain%20POST.user.js
// @updateURL https://update.greasyfork.org/scripts/8925/Test%20Script%20Cross%20Domain%20POST.meta.js
// ==/UserScript==
(function () {
    "use strict";

    if (document.usr_trig !== undefined) {
        return;
    }

    document.usr_trig = true;

    console.log('start');

    function init() {
        /* YOUR CODE BEGIN */
        console.log('init begin');
        
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://www.w3schools.com/php/welcome.php",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            data: "name=test&email=test",
            onload: function (response) {
                
                console.log ("========== response start ============");
                
                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl
                ].join("\n"));

                console.log ("========== response end ============");
                
                console.log ("finish");
            }
        });

        console.log('init end');
        /* YOUR CODE END */
    }

    document.addEventListener("DOMContentLoaded", init);

}());