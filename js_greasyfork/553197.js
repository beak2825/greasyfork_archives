// ==UserScript==
// @name         cvat_shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CVAT Shortcuts
// @author       av1k
// @match        http://cvat:8080/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553197/cvat_shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/553197/cvat_shortcuts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Change mode Standart and Review
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.code === 'KeyW') {
            e.preventDefault();
            const selectorDiv = document.querySelector('.ant-select-selector');
            if (!selectorDiv) return;

            selectorDiv.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

            setTimeout(() => {
                const currentOption = (selectorDiv.innerText || '').trim();
                const targetText = currentOption === 'Review' ? 'Standard' : 'Review';
                const targetOption = [...document.querySelectorAll('.ant-select-item-option')]
                .find(o => (o.innerText || '').trim() === targetText);

                // клік по гілках (тільки якщо існують)
                setTimeout(() => {
                    document.querySelector('[data-node-key="issues"]')?.click();
                    setTimeout(() => {
                        document.querySelector('[data-node-key="objects"]')?.click();
                        console.log('Клік виконано');
                    }, 50);
                }, 50);

                targetOption?.click();
            }, 50);
        }
    });

})();
