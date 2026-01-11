// ==UserScript==
// @name         divisare popup remover
// @namespace    http://tampermonkey.net/
// @version      2026-01-11
// @description  Removing registration popup
// @author       izzqz v@izzqz.me
// @match        https://divisare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=divisare.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562214/divisare%20popup%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/562214/divisare%20popup%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent Turbolinks load_book_slideshow call (override if exists)
    const originalOn = jQuery.fn.on;
    jQuery.fn.on = function(event, handler) {
        if (event === 'turbolinks:load' && typeof handler === 'function') {
            // Skip if it's load_book_slideshow
            if (handler.toString().includes('load_book_slideshow')) return this;
        }
        return originalOn.apply(this, arguments);
    };

    // Override modal entirely
    if (window.jQuery) {
        window.jQuery.modal = function() { return null; };
        window.jQuery.fn.modal = function() { return this; };
        window.$.modal = window.jQuery.modal;
    }

    // MutationObserver: Watch and nuke modals/blockers
    const observer = new MutationObserver((mutations) => {
        let unlockScroll = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Remove modal elements
                    if (node.classList?.contains('modal') || node.classList?.contains('jquery-modal') || node.classList?.contains('blocker')) {
                        console.log('popup remmoved')
                        node.remove();
                        unlockScroll = true;
                    }
                    // Descendants too
                    node.querySelectorAll('.modal, .jquery-modal, .blocker, .close-modal').forEach(el => {
                        el.remove();
                        unlockScroll = true;
                    });
                }
            });
        });
        if (unlockScroll) {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial cleanup and persistent CSS
    const style = document.createElement('style');
    style.textContent = `
        body, html { overflow: auto !important; }
        .modal, .jquery-modal, .blocker, .close-modal { display: none !important; }
    `;
    document.head.appendChild(style);

    // Clean existing on load
    setTimeout(() => {
        document.querySelectorAll('.modal, .jquery-modal, .blocker').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
    }, 1000);

})();
