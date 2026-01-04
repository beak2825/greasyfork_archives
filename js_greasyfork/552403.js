// ==UserScript==
// @name         Edit/Add: Increase Groups list height to fit four groups
// @namespace    https://github.com/nate-kean/
// @version      20251106
// @description  I want to be able to see four groups, because that is the usual number I add to new profiles.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552403/EditAdd%3A%20Increase%20Groups%20list%20height%20to%20fit%20four%20groups.user.js
// @updateURL https://update.greasyfork.org/scripts/552403/EditAdd%3A%20Increase%20Groups%20list%20height%20to%20fit%20four%20groups.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-extra-group-list-height">
            #memberEditGroupHolder {
                max-height: 30rem !important;
            }
        </style>
    `);
})();
