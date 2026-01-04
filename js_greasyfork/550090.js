// ==UserScript==
// @name         Blur Dop.Account
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  ...
// @author       вайб (lolz.live/development)
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550090/Blur%20DopAccount.user.js
// @updateURL https://update.greasyfork.org/scripts/550090/Blur%20DopAccount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyBlurEffect() {
        const css = '.profileContainer { filter: blur(5px); transition: .2s; } .profileContainer:hover { filter: blur(0); }';
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    applyBlurEffect();
})();