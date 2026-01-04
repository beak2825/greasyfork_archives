// ==UserScript==
// @name         Rotate Letters Script
// @namespace    https://mordenstar.com
// @version      1.0
// @description  Rotates each letter on the page randomly from 0 to 360 degrees to reset passive reading habits by forcing attention
// @author       Shaun Pedicini
// @homepageURL  https://mordenstar.com
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551208/Rotate%20Letters%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/551208/Rotate%20Letters%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processTextNode(textNode) {
        const parentNode = textNode.parentNode;
        if (!parentNode) {
            return;
        }

        const text = textNode.textContent || '';
        const fragment = document.createDocumentFragment();

        for (const char of text) {
            if (/[A-Za-z]/.test(char)) {
                const span = document.createElement('span');
                span.textContent = char;
                // span.style.display = 'inline-block'; // Necessary for transform to work correctly
                // span.style.transform = `rotate(${sign * rotation}deg)`;
                // span.style.transition = 'transform 5.0s';

                const rotation = Math.floor(Math.random() * 25); // Random angle between 0 and 25
                const sign = Math.random() > 0.5 ? -1 : 1;
                const finalRotation = sign * rotation;

                span.style.display = 'inline-block'; // Necessary for transform to work correctly
                span.style.transform = `rotate(0deg)`; // Start from 0 degrees
                span.style.transition = 'transform 7.0s';
                span.style.transitionDelay = '1s'; // Delay animation by 1 second

                fragment.appendChild(span);

                // Use requestAnimationFrame to ensure the browser has rendered the initial state
                requestAnimationFrame(() => {
                    span.style.transform = `rotate(${finalRotation}deg)`; // Rotate to final angle
                });
            } else {
                fragment.appendChild(document.createTextNode(char));
            }
        }

        parentNode.replaceChild(fragment, textNode);
    }

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;

            // Skip script, style, textarea, and input elements
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'].includes(element.tagName)) {
                return;
            }

            // Process child nodes
            for (const child of Array.from(node.childNodes)) {
                processNode(child);
            }
        }
    }

    // Start processing from the body element
    if (document.body) {
        processNode(document.body);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            if (document.body) {
                processNode(document.body);
            }
        });
    }
})();
