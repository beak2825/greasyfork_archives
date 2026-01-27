// ==UserScript==
// @name         Seznam Email - Default to account switcher submenu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Seznam decided that account switching should be hidden in a submenu and requires an extra click every time you want to switch accounts. This extension automatically opens the account switcher submenu when you click on your avatar.
// @match        https://email.seznam.cz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564165/Seznam%20Email%20-%20Default%20to%20account%20switcher%20submenu.user.js
// @updateURL https://update.greasyfork.org/scripts/564165/Seznam%20Email%20-%20Default%20to%20account%20switcher%20submenu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const widget = document.querySelector('szn-login-widget');
        if (!widget || !widget.shadowRoot) {
            setTimeout(init, 500);
            return;
        }
        const shadow = widget.shadowRoot;
        const mainButton = shadow.querySelector('button[data-dot="button-main"]');
        if (!mainButton) {
            setTimeout(init, 500);
            return;
        }
        const observer = new MutationObserver(() => {
            if (mainButton.getAttribute('aria-expanded') === 'true') {
                const link = [...shadow.querySelectorAll('a[data-icon="group"]')]
                    .find(el => el.textContent.includes('Další účty'));
                if (link) {
                    link.click();
                }
            }
        });
        observer.observe(mainButton, {
            attributes: true,
            attributeFilter: ['aria-expanded']
        });
    }
    init();
})();