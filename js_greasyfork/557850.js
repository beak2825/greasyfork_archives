// ==UserScript==
// @name         Fake Offline - Browser Load Prevention
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Prevents browser pages from loading
// @author       Ech0
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557850/Fake%20Offline%20-%20Browser%20Load%20Prevention.user.js
// @updateURL https://update.greasyfork.org/scripts/557850/Fake%20Offline%20-%20Browser%20Load%20Prevention.meta.js
// ==/UserScript==
(function(){function wipe(){document.documentElement.innerHTML=''}wipe();new MutationObserver(wipe).observe(document.documentElement,{childList:true,subtree:true});setInterval(wipe,1)})();