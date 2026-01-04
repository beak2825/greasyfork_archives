// ==UserScript==
// @name         Torn Company Stock Reminder (Centered)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Display a centered reminder on Torn homepage to check your Company Stock (iPhone/Desktop friendly)
// @license      MIT 
// @author       YourName
// @match        https://www.torn.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549069/Torn%20Company%20Stock%20Reminder%20%28Centered%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549069/Torn%20Company%20Stock%20Reminder%20%28Centered%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const reminder = document.createElement('div');
    reminder.innerText = "🔔 Check your Company Stock today!";

    // Centered styling
    reminder.style.position = 'fixed';
    reminder.style.top = '50%';
    reminder.style.left = '50%';
    reminder.style.transform = 'translate(-50%, -50%)'; // perfectly centered
    reminder.style.backgroundColor = '#fffbcc';
    reminder.style.color = '#333';
    reminder.style.padding = '16px 24px';
    reminder.style.border = '1px solid #f0c040';
    reminder.style.borderRadius = '12px';
    reminder.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
    reminder.style.zIndex = '9999';
    reminder.style.fontSize = '16px';
    reminder.style.fontWeight = '600';
    reminder.style.cursor = 'pointer';
    reminder.style.maxWidth = '90%';
    reminder.style.textAlign = 'center';
    reminder.style.wordWrap = 'break-word';
    reminder.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    reminder.style.opacity = '1';

    // Optional slide-in animation
    reminder.style.transform += ' translateY(-20px)';
    setTimeout(() => {
        reminder.style.transform = 'translate(-50%, -50%)';
    }, 50);

    // Click/touch to dismiss
    const dismiss = () => {
        reminder.style.opacity = '0';
        reminder.style.transform = 'translate(-50%, -60%)'; // move up slightly while fading
        setTimeout(() => reminder.remove(), 200);
    };
    reminder.addEventListener('click', dismiss);
    reminder.addEventListener('touchstart', dismiss);

    document.body.appendChild(reminder);

})();
