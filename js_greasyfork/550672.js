// ==UserScript==
// @name         smry.ai Button for Spectator
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a smry.ai summary button to spectator.co.uk pages with a pill-shaped design, Alt+A shortcut, and in-tab redirecting behavior.
// @author       You
// @match        https://www.spectator.co.uk/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550672/smryai%20Button%20for%20Spectator.user.js
// @updateURL https://update.greasyfork.org/scripts/550672/smryai%20Button%20for%20Spectator.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function redirectToSmry() {
        const currentUrl = window.location.href;
        window.location.href = `https://smry.ai/${currentUrl}`;
    }
    function addButton() {
        if (document.getElementById('smry-ai-button')) return;
        const button = document.createElement('button');
        button.id = 'smry-ai-button';
        button.innerText = 'Remove paywall';
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '1000px', // Fully rounded pill shape
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            zIndex: '2147483647',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'background-color 0.2s ease-in-out'
        });
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#b71c1c';
        });
        button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#d32f2f';
        });


        button.addEventListener('click', redirectToSmry);
        document.body.appendChild(button);
    }
    // Keyboard shortcut: Alt + A
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'a') {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                return;
            }
            redirectToSmry();
        }
    });
    window.addEventListener('load', () => {
        const interval = setInterval(() => {
            if (document.body) {
                addButton();
                clearInterval(interval);
            }
        }, 500);
    });
})();