// ==UserScript==
// @name         Disable Vertical Scrolling on NYT Games
// @version      1.3
// @description  Adds a manual button to disable vertical scrolling on NYT Games pages.
// @author       jb123
// @match        *://www.nytimes.com/games/*
// @icon         https://www.nytimes.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/1531329
// @downloadURL https://update.greasyfork.org/scripts/553883/Disable%20Vertical%20Scrolling%20on%20NYT%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/553883/Disable%20Vertical%20Scrolling%20on%20NYT%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to disable vertical scrolling
    function disableVerticalScroll() {
        document.documentElement.style.setProperty('overflow-y', 'hidden', 'important');
        document.documentElement.style.setProperty('height', '100%', 'important');
        document.body.style.setProperty('overflow-y', 'hidden', 'important');
        document.body.style.setProperty('position', 'relative', 'important');
        document.body.style.setProperty('height', '100%', 'important');
        console.log('[NYT Scroll Disabler] Vertical scrolling disabled.');
    }

    // Function to create the control button
    function createDisableScrollButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Disable Scrolling';
        btn.id = 'nyt-scroll-disable-btn';

        // Basic styling
        Object.assign(btn.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: '999999',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'sans-serif'
        });

        btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(0, 0, 0, 0.9)');
        btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(0, 0, 0, 0.7)');

        btn.addEventListener('click', disableVerticalScroll);

        document.body.appendChild(btn);
    }

    // Wait for the DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(() => {
        createDisableScrollButton();

        // Optional: Prevent touch-based vertical scroll (mobile)
        window.addEventListener('touchmove', e => {
            if (Math.abs(e.touches[0].clientY - (window.lastTouchY || 0)) > 0) {
                e.preventDefault();
            }
            window.lastTouchY = e.touches[0].clientY;
        }, { passive: false });
    });
})();
