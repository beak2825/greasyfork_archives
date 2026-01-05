// ==UserScript==
// @name         VK Video Fix
// @icon         http://vk.com/images/safari_60.png
// @namespace    x4_vkvf
// @version      0.2.3
// @description  Makes “My Videos” link really leads to own videos 
// @author       You
// @match        https://vk.com/*
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/9495/VK%20Video%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/9495/VK%20Video%20Fix.meta.js
// ==/UserScript==

setInterval(function(){
    var el = document.querySelector('#l_vid');
    if (el){
        el = el.querySelector('a[href="/video"]');
        if (el){
            el.href = 'https://vk.com/video?section=all';
        }
    }
}, 200);