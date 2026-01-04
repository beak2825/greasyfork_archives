// ==UserScript==
// @name         Edit: Fix home phone and cell phone tab order
// @namespace    https://github.com/nate-kean/
// @version      202510102
// @description  Put their tab indexes in the order that they are on the screen.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @match        https://jamesriver.fellowshiponego.com/members/add*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552087/Edit%3A%20Fix%20home%20phone%20and%20cell%20phone%20tab%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/552087/Edit%3A%20Fix%20home%20phone%20and%20cell%20phone%20tab%20order.meta.js
// ==/UserScript==

(function() {
    document.querySelector("#phoneCell").tabIndex = 5;
    document.querySelector("#phoneHome").tabIndex = 6;
})();
