// ==UserScript==
// @name         教 Timmy 安靜
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Timmy 學會安靜了
// @author       Piau
// @match        *120.125.80.91:8088/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553991/%E6%95%99%20Timmy%20%E5%AE%89%E9%9D%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/553991/%E6%95%99%20Timmy%20%E5%AE%89%E9%9D%9C.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() { window.switchTimmyCall(); }, false);
})();