// ==UserScript==
// @name         GoBattle.io Shared Account
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Shared account | Join us! -> https://discord.gg/3xDbJ8QD8f
// @author       GoBattle Hacks Official
// @match        https://*.gobattle.io/*
// @match        https://gobattle.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556927/GoBattleio%20Shared%20Account.user.js
// @updateURL https://update.greasyfork.org/scripts/556927/GoBattleio%20Shared%20Account.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function handleKeyPress(event) {
        if (event.key === '`') {
            console.log('Setting tokens in localStorage and reloading page...');
            localStorage.setItem('gobattle_token', 'a7290335586a722f9968f1dd87d46139a789c5897abc31d5e59a6f8f88714e89');
            localStorage.setItem('device_token', 'c3483e80d6b8bfc2');
            window.location.reload();
        }
    }
 
    document.addEventListener('keydown', handleKeyPress);
 
})();