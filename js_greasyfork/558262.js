// ==UserScript==
// @name         Ghost Trade Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a Ghost Trade option in toolbar profile menu
// @author       Neon0404 [3772610]
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/558262/Ghost%20Trade%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558262/Ghost%20Trade%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_ID = "3772610";
    const DEFAULT_TEXT = "meow";

    function addGhostMenuItem() {
        if (document.getElementById('ghost-trade-menu-item')) return;

        const menuContainer = document.querySelector('ul.settings-menu');
        if (!menuContainer) return;

        const viewProfileItem = menuContainer.querySelector('li.link');
        if (!viewProfileItem) return;

        const ghostItem = viewProfileItem.cloneNode(true);
        ghostItem.id = 'ghost-trade-menu-item';

        const anchor = ghostItem.querySelector('a');
        if (anchor) {
            const uid = DEFAULT_ID;
            anchor.href = `https://www.torn.com/trade.php#step=start&userID=${uid}`;

            const textSpan = anchor.querySelector('.link-text');
            if (textSpan) textSpan.textContent = 'Ghost Trade';

            const iconWrapper = anchor.querySelector('.icon-wrapper');
            if (iconWrapper) {
                iconWrapper.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="-6 -4 28 28">
                    <path d="M0,16 V6 C0,1.5 3,0 8,0 S16,1.5 16,6 V16 L12,13 L8,16 L4,13 L0,16 Z M5,5 A1.5,1.5 0 1,0 5,8 A1.5,1.5 0 1,0 5,5 Z M11,5 A1.5,1.5 0 1,0 11,8 A1.5,1.5 0 1,0 11,5 Z"></path>
                    </svg>
                `;
            }
        }

        viewProfileItem.before(ghostItem);
    }

    function handleTradePage() {
        if (!window.location.href.includes('trade.php')) return;

        const textArea = document.querySelector('textarea[name="description"]');

        if (textArea && !textArea.classList.contains('ghost-filled')) {
            const desiredText = DEFAULT_TEXT;

            textArea.focus();

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(textArea, desiredText);

            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.dispatchEvent(new Event('keyup', { bubbles: true }));

            textArea.blur();

            textArea.classList.add('ghost-filled');
        }
    }

    setInterval(() => {
        addGhostMenuItem();
        handleTradePage();
    }, 500);

})();