// ==UserScript==
// @name         Travelling tooltip info adder
// @namespace    http://tampermonkey.net/
// @version      2026-01-15a
// @description  title
// @license      MIT
// @author       ski3r3n [3722717]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/562598/Travelling%20tooltip%20info%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/562598/Travelling%20tooltip%20info%20adder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function timeHMSFromNow(timestamp) {
        const diff = timestamp - Date.now();
        const abs = Math.abs(diff);

        let s = Math.floor(abs / 1000);
        const h = Math.floor(s / 3600);
        s %= 3600;
        const m = Math.floor(s / 60);
        const sec = s % 60;

        const parts = [];
        if (h > 0) parts.push(`${h} hour${h !== 1 ? "s" : ""}`);
        if (m > 0) parts.push(`${m} minute${m !== 1 ? "s" : ""}`);
        parts.push(`${sec} second${sec !== 1 ? "s" : ""}`);

        let text;
        if (parts.length === 1) {
            text = parts[0];
        } else if (parts.length === 2) {
            text = `${parts[0]}, ${parts[1]}`;
        } else {
            text = `${parts[0]}, ${parts[1]} and ${parts[2]}`;
        }
        return text;
    }
    var resp;
    var api = GM_registerMenuCommand("Enter minimal API key here", function (MouseEvent) {
        var val = prompt("Enter minimal API key here")
        if (val == null){ return; }
        GM_setValue("apiKey", val)
    })
    var found = false;
    setInterval(function (){
        if ((document.getElementsByClassName("icon71___oZ9rV")[0] != null) && (found == false)) {
            if (GM_getValue("cache") != null){
                console.log(GM_getValue("cache").travel.timestamp * 1000 - Date.now())
                if (GM_getValue("cache").travel.timestamp * 1000 < Date.now()){
                    GM_setValue("cache", null)
                }
            }
            if (GM_getValue("apiKey") != null && GM_getValue("cache") == null){
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.torn.com/user/?selections=travel&key=${GM_getValue("apiKey")}`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function(response) {
                        resp = JSON.parse(response.responseText);
                        console.log("noncachedata")
                        GM_setValue("cache", resp)
                    }
                });
            }
            if (GM_getValue("cache") != null) {
                console.log('cachedata')
                resp = GM_getValue("cache")
            }
        }
        found = true
    },100)
    // var tooltipOriginal = null
    setInterval(function (){
        var tooltips = document.getElementsByClassName("tooltip___aWICR")
        if (tooltips[0] != null){
            var tooltip = tooltips[0];
            if (tooltip.innerHTML.slice(0, 16) == "<b>Traveling</b>"){
                // if (tooltipOriginal == null) tooltipOriginal = tooltip.innerHTML;
                tooltip.innerHTML = `<b>Traveling</b><div class="arrow___yUDKb bottom___mz2Ax" style="left: 424.6px; position: fixed; top: 174px; transform: rotate(0deg);"><div class="arrowIcon___KHyjw"></div></div><p>${timeHMSFromNow(resp.travel.timestamp * 1000)}</p>`;
                var tooltipArrow = document.getElementsByClassName("arrow___yUDKb")[0]
                var icon = document.getElementsByClassName("icon71___oZ9rV")[0]
                const rect = icon.getBoundingClientRect();
                tooltipArrow.style.position = "fixed";
                var box = document.getElementsByClassName("tooltip___aWICR")[0];
                tooltipArrow.style.top = ((rect.top + window.scrollY) - 14) + 'px';
                tooltipArrow.style.transform = "rotate(180deg)"
                if (box.getBoundingClientRect().y > rect.y){
                    tooltipArrow.style.transform = "rotate(0deg)"
                    tooltipArrow.style.top = ((rect.top + window.scrollY) + 14 + 17) + 'px';
                }
                tooltipArrow.style.left = ((rect.left + window.scrollX) + 8) + 'px';
            }
        }
    }, 1)
})();