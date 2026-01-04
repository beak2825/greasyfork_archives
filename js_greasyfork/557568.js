// ==UserScript==
// @name        Cyberspace ASCII Art
// @match       https://cyberspace.online/*
// @namespace   https://cyberspace.online/*
// @grant       none
// @version     1.95
// @author      DrAg0r
// @description Optimise ASCII Art display on Cyberspace 01/12/2025 15:44:32
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/557568/Cyberspace%20ASCII%20Art.user.js
// @updateURL https://update.greasyfork.org/scripts/557568/Cyberspace%20ASCII%20Art.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeFontFamily(codeElements) {
        const font = getComputedStyle(document.documentElement).getPropertyValue('--code-font').trim();
        codeElements.forEach(el => {
            el.style.display = 'inline-block'
            el.style.fontFamily = font;
            el.style.setProperty('font-family', font, 'important');
            // If you have issues with the custom theme font, uncomment those two lines
            //el.style.fontFamily = '"JetBrains Mono", "Courier New", monaco';
            //el.style.setProperty('font-family', '"JetBrains Mono", "Courier New", monaco', 'important');
            el.style.lineHeight = '1.2em';
            el.style.letterSpacing = 'unset';
            el.style.whiteSpace = 'pre';
            el.parentNode.style.overflowX = 'auto';
            if (!isWidthOverflown(el.parentNode)) {
              return;
            }
            var parentDiv = document.createElement('div');
            el.parentNode.insertAdjacentElement('beforebegin', parentDiv);
            parentDiv.style.display = 'block';
            parentDiv.style.position = 'relative';
            parentDiv.style.width = '100%';
            parentDiv.style.height = '2em';
            var shrinkButton = document.createElement("button");
            parentDiv.insertAdjacentElement('afterbegin', shrinkButton);
            shrinkButton.style.display = 'block';
            shrinkButton.style.position = 'absolute';
            shrinkButton.style.right = '0';
            shrinkButton.style.height = '2em';
            shrinkButton.style.width = '2.5em';
            shrinkButton.style.borderWidth = '1px';
            shrinkButton.style.borderColor = 'var(--color-code)';
            shrinkButton.style.backgroundColor = 'var(--color-code-bg)';
            shrinkButton.innerText = '(o)';
            shrinkButton.addEventListener('click', (event) => {
                shrinkFont(event, el);
            });
        });
    }

    function isWidthOverflown(element) {
        return element.scrollWidth > element.clientWidth;
    }

    function shrinkFont(event, el) {
        if (event.target.innerText == '(o)') {
            el.style.fontSize = '4px';
            el.style.lineHeight = '5px';
            event.target.innerText = '(-)'
        } else {
            el.style.lineHeight = '1.2em';
            el.style.removeProperty('font-size');
            event.target.innerText = '(o)'
        }
    }

    changeFontFamily(document.querySelectorAll('code'));

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const codeElements = node.querySelectorAll('.markdown-content code');
                    if (codeElements.length > 0) {
                        changeFontFamily(codeElements);
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();