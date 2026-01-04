// ==UserScript==
// @name         Better NFLSOJ
// @namespace    http://tampermonkey.net/
// @version      2025-12-20
// @description  在 nflsoi.cc:20035 中自动去除 ban_copy，添加回复功能
// @author       You
// @match        http://nflsoi.cc:20035/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nflsoi.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559563/Better%20NFLSOJ.user.js
// @updateURL https://update.greasyfork.org/scripts/559563/Better%20NFLSOJ.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.pathname.includes("article")) {
       var number = window.location.pathname.slice(9);
       document.querySelector('div.padding').innerHTML += '<form class="ui reply form" method="post" action="/article/' + number + '/comment"><div class="field"><textarea name="comment" class="markdown-edit"></textarea></div><div style="text-align: center; "><button id="submit_button" type="submit" class="ui labeled submit icon button"><i class="icon edit"></i> 回复</button></div></form>';
    }
    (function changeCode() {
        var codes = document.querySelectorAll('div.ban_copy');
        for(var code of codes) {
            code.setAttribute('class', '');
        }
        // setInterval(changeCode, 5000);
    })();
})();