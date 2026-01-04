// ==UserScript==
// @name         Bergziegen tag remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  mma script
// @author       BennoGHG
// @match        https://map-making.app/maps/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549038/Bergziegen%20tag%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/549038/Bergziegen%20tag%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const saveButtonSelector = 'button[data-qa="location-save"]';
    const tagSelector = 'button[data-tag-name="Einreichungen"]';
    const delay = 0;

    document.addEventListener('keydown', function(event) {
        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

        if (event.key.toLowerCase() === 'ü') {
            const tagButton = document.querySelector(tagSelector);
            if (tagButton) tagButton.click();

            setTimeout(() => {
                const saveButton = document.querySelector(saveButtonSelector);
                if (saveButton) saveButton.click();
            }, delay);
        }
    });
})();
