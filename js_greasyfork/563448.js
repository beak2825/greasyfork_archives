// ==UserScript==
// @name         Azure DevOps URL Base Toggle
// @namespace    https://tampermonkey.net/
// @version      1.1
// @author       Jatin Sharma
// @description  Toggle Azure DevOps URL between dev.azure.com/{org} and {org}.visualstudio.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visualstudio.com
// @match        https://dev.azure.com/*
// @match        https://*.visualstudio.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563448/Azure%20DevOps%20URL%20Base%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/563448/Azure%20DevOps%20URL%20Base%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'ado-url-toggle-btn';

    function toggleUrl() {
        const url = new URL(window.location.href);

        if (url.hostname === 'dev.azure.com') {
            const parts = url.pathname.split('/').filter(Boolean);
            if (!parts.length) return;

            const org = parts.shift();
            url.hostname = `${org}.visualstudio.com`;
            url.pathname = '/' + parts.join('/');
        } else if (url.hostname.endsWith('.visualstudio.com')) {
            const org = url.hostname.split('.')[0];
            url.hostname = 'dev.azure.com';
            url.pathname = `/${org}${url.pathname}`;
        } else {
            return;
        }

        window.location.href = url.toString();
    }

    function createButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const menuBar = document.querySelector('div.region-header-menubar');
        if (!menuBar) return;

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.textContent = 'URL';
        button.title = 'Toggle Azure DevOps URL base';
        button.className = 'bolt-button bolt-icon-button enabled subtle bolt-focus-treatment';
        button.style.marginRight = '8px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', toggleUrl);

        menuBar.prepend(button);
    }

    const observer = new MutationObserver(createButton);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    createButton();
})();
