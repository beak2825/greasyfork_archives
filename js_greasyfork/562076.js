// ==UserScript==
// @name         Demo Greasy Fork Helper Script
// @name:en      Demo Greasy Fork Helper Script
// @namespace    https://greasyfork.org/users/000000-demo
// @version      1.0.0
// @description  This script adds a simple floating button to the page to demonstrate a valid Greasy Fork userscript.
// @description:en This script adds a simple floating button to the page to demonstrate a valid Greasy Fork userscript.
// @author       Demo Author
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562076/Demo%20Greasy%20Fork%20Helper%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/562076/Demo%20Greasy%20Fork%20Helper%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Create a floating button on the page
     */
    function createButton() {
        const button = document.createElement('button');
        button.textContent = 'Demo Button';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 16px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function () {
            alert('This is a valid Greasy Fork userscript.');
        });

        document.body.appendChild(button);
    }

    /**
     * Initialize script
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createButton);
        } else {
            createButton();
        }
    }

    init();
})();
