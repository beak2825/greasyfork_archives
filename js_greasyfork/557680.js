// ==UserScript==
// @name         remove year end banner
// @namespace    https://albumoftheyear.org
// @version      idk
// @description  removes the banner from everywhere except home page
// @author       ddlcfan39 n Rice ig
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js?version=1134973
// @match        https://www.albumoftheyear.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=albumoftheyear.org
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/557680/remove%20year%20end%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/557680/remove%20year%20end%20banner.meta.js
// ==/UserScript==

(function() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const sleepUntil = async (f, timeoutMs) => {
        return new Promise((resolve, reject) => {
            const timeWas = new Date();
            const wait = setInterval(function() {
                if (f()) {
                    console.log("resolved after", new Date() - timeWas, "ms");
                    clearInterval(wait);
                    resolve();
                } else if (new Date() - timeWas > timeoutMs) { // Timeout
                    console.log("rejected after", new Date() - timeWas, "ms");
                    clearInterval(wait);
                    reject();
                }
            }, 20);
        });
    }

    GM_config.init({
        id: "bye-banner",
        title: "piss off banner",
        'events': {
            'init': function () {
                let url = document.URL;
                let headerYearEnd = document.getElementsByClassName("headerYearEnd")[0];
                if (!url.endsWith("https://www.albumoftheyear.org/")) {
                    headerYearEnd.style.display = "none";
                }
            }
        }
    });
})();