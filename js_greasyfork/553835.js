// ==UserScript==
// @name         Sportlogiq Auto-Confirm
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматично підтверджує всі діалогові вікна (confirm) на сайті Sportlogiq
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553835/Sportlogiq%20Auto-Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/553835/Sportlogiq%20Auto-Confirm.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    
    window.confirm = function(message) {
        console.log(`[Auto-Confirm] Automatically confirmed dialog with message: "${message}"`);
        return true;
    };
 
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.confirm = window.confirm;
    }
})();