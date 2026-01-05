// ==UserScript==
// @name         VK J/K
// @icon         http://vk.com/images/safari_60.png
// @namespace    x4_vkjk
// @version      0.4
// @description  Adds scrolling with J/K
// @author       x4fab
// @match        https://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9447/VK%20JK.user.js
// @updateURL https://update.greasyfork.org/scripts/9447/VK%20JK.meta.js
// ==/UserScript==

document.body.addEventListener('keydown', function (e){
    if (!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && e.target.contentEditable != 'true' && (e.keyCode == 74 || e.keyCode == 75)){
        document.body.scrollTop += [].map.call(document.querySelectorAll('body, .post'), function (a){
            return a.getBoundingClientRect().top;
        }).filter(function (a){ 
            return e.keyCode == 74 ? a > 10 : a < -10;
        }).sort(function (a, b){ 
            return e.keyCode == 74 ? a - b : b - a;
        })[0];
    }
}, false);
