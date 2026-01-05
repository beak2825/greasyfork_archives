// ==UserScript==
// @name         2ch MSPGothic16px
// @namespace    2chMSPGothic16px
// @version      0.1.5
// @description  Use MSPGothic16px in 2ch.net
// @author       kusotool
// @match        http://*.2ch.net/*
// @match        http://*.shitaraba.net/*
// @match        https://*.2ch.net/*
// @match        https://*.shitaraba.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9286/2ch%20MSPGothic16px.user.js
// @updateURL https://update.greasyfork.org/scripts/9286/2ch%20MSPGothic16px.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var e = document.getElementsByTagName('body');
    if(e){
        for(var i in e){
            var g = e[i];
            var s = g.getAttribute('style') || "";
            g.setAttribute('style', s + 'font-family:"ＭＳ Ｐゴシック"; font-size: 16px;');
        }
    }
})();
