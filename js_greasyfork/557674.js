// ==UserScript==
// @name         snowflakes add-on !!!
// @namespace    https://albumoftheyear.org
// @version      idk2
// @description  add the snowflakes back to the aoty logo!!!
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
// @downloadURL https://update.greasyfork.org/scripts/557674/snowflakes%20add-on%20%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/557674/snowflakes%20add-on%20%21%21%21.meta.js
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
        id: "snowflakes-yay",
        title: "snowflakes yay",
        'events': {
            'init': function () {
                let topbar = document.querySelectorAll("#content")[0];
                let snowflake1 = document.createElement("button");
                snowflake1.id = "snowflake-button";
                let snowflake1inner = document.createElement("i");
                snowflake1inner.className = "fa-light fa-snowflake fa-flip";
                snowflake1inner.style = "color:#4A70A9; font-size: 18px; vertical-align: middle; ";
                snowflake1.appendChild(snowflake1inner);
                topbar.insertBefore(snowflake1, topbar.firstChild);
                let snowflake2 = document.createElement("button");
                snowflake2.id = "snowflake-button-2";
                let snowflake2inner = document.createElement("i");
                snowflake2inner.className = "fa-light fa-snowflake fa-flip";
                snowflake2inner.style = "color:#4A70A9; font-size: 18px; vertical-align: middle; ";
                snowflake2.appendChild(snowflake2inner);
                topbar.insertBefore(snowflake2, topbar.childNodes[7]);
                document.getElementById('snowflake-button').addEventListener('click', createFallingSnowflake);
                document.getElementById('snowflake-button-2').addEventListener('click', createFallingSnowflake);
                snowflake1inner.animate(
                    [
                        { color: "red" },
                        { color: "orange" },
                        { color: "yellow" },
                        { color: "green" },
                        { color: "blue" },
                        { color: "magenta" },
                        { color: "red" },
                    ],
                    { duration: 1000, iterations: Infinity },
                );
                snowflake2inner.animate(
                    [
                        { color: "red" },
                        { color: "orange" },
                        { color: "yellow" },
                        { color: "green" },
                        { color: "blue" },
                        { color: "magenta" },
                        { color: "red" },
                    ],
                    { duration: 1000, iterations: Infinity },
                );
            }
        }
    });
})();