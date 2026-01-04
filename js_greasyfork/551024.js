// ==UserScript==
// @name         TMN Logged Out Alert
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  TMN Logged Out Alert Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/*act=out*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551024/TMN%20Logged%20Out%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/551024/TMN%20Logged%20Out%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fetch("https://67wol.duckdns.org:8443/api/webhook/checktmn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Logged Out",
                message: "You have been logged out!"
            })
        })
})();