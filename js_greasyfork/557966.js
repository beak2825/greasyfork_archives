// ==UserScript==
// @name         Открытие приложений App Store через iTunes
// @namespace    https://4pda.to/forum/index.php?showtopic=554020
// @version      1.2
// @description  Добавляет через айтюнс кнопку на apps.apple.com
// @author       4pda_users
// @match        https://apps.apple.com/*/app/*
// @grant        none
// @run-at       document-end
// @license MIT
// @name:en      Open AppStore apps via iTunes
// @description:en Adds open via itunes button in apps.apple.com
// @downloadURL https://update.greasyfork.org/scripts/557966/%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9%20App%20Store%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20iTunes.user.js
// @updateURL https://update.greasyfork.org/scripts/557966/%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9%20App%20Store%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20iTunes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addItunesButton() {
        let buttonsContainer = document.querySelector('div.buttons-container');

        if (!buttonsContainer) {
            const contentContainer = document.querySelector('div.content-container');
            if (!contentContainer) return;

            const section = contentContainer.querySelector('section');
            if (!section) return;

            const sectionClass = section.className;

            buttonsContainer = document.createElement('div');
            buttonsContainer.className = `buttons-container ${sectionClass}`;

            section.appendChild(buttonsContainer);
        }

        if (buttonsContainer.querySelector('.itunes-button')) return;

        const existingButton = buttonsContainer.querySelector('button') ||
                               document.querySelector('button[aria-label*="Поделиться"], button[aria-label*="Share"]');

        const itunesButton = document.createElement('button');
        itunesButton.setAttribute('aria-label', 'iTunes');

        if (existingButton) {
            itunesButton.className = existingButton.className + ' itunes-button';
        } else {
            itunesButton.className = 'svelte-1hg02ca with-label itunes-button';
        }

        itunesButton.innerHTML = `
            <svg width="35.000000pt" height="35.000000pt" viewBox="0 0 35.000000 35.000000">
<g transform="translate(0.000000,45.000000) scale(0.100000,-0.100000)" fill="#FFFFFF" stroke="none">
<path d="M170 427 c-78 -25 -140 -129 -127 -212 14 -87 65 -144 150 -166 147 -40 279 98 237 248 -31 107 -147 166 -260 130z m150 -40 c51 -27 90 -90 90 -147 0 -87 -83 -170 -170 -170 -87 0 -170 83 -170 170 0 20 10 56 23 80 27 51 90 90 147 90 20 0 56 -10 80 -23z"></path>
<path d="M235 347 l-50 -12 -3 -66 c-3 -59 -5 -67 -27 -77 -27 -13 -32 -31 -13 -50 35 -35 68 3 68 78 0 32 3 61 8 63 4 2 24 7 45 11 37 7 37 7 37 -27 0 -26 -6 -36 -25 -45 -28 -13 -32 -34 -10 -52 20 -16 54 -3 60 23 4 12 5 54 3 92 -3 80 -6 82 -93 62z"></path>
</g>
</svg>
            iTunes
        `;

        itunesButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();

            const currentUrl = window.location.href;
            const itunesUrl = currentUrl.replace('https://', 'itms://');

            window.location.href = itunesUrl;
            setTimeout(() => {
                if (window.location.protocol !== 'itms:') {
                    window.open(itunesUrl, '_blank');
                }
            }, 1000);
        };

        buttonsContainer.appendChild(itunesButton);
    }

    setTimeout(addItunesButton, 1000);

    const observer = new MutationObserver(() => {
        if (!document.querySelector('.itunes-button')) {
            setTimeout(addItunesButton, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();