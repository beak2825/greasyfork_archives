// ==UserScript==
// @name         Torn Grats ekiM_ Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Quick button to input "Grats ekiM_!" in chat
// @author       kek
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553581/Torn%20Grats%20ekiM_%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/553581/Torn%20Grats%20ekiM_%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EMOJIS = ['🎉', '💕', '🎊', '✨', '🌟', '💖', '🔥', '👏', '🎈', '🏆', '💪', '⭐', '🌈', '💯', '🥳', '🎆', '💝', '🌺', '🎁', '🥇', '🍌'];

    function getRandomEmojis() {
        const shuffled = [...EMOJIS].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 2).join('');
    }

    function createGratsButton() {
        if (document.getElementById('gratsButton')) return;

        const button = document.createElement('button');
        button.id = 'gratsButton';
        button.textContent = `Grats ekiM_ ${getRandomEmojis()}`;
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
        });

        button.addEventListener('click', sendGrats);
        document.body.appendChild(button);
    }

    function sendGrats() {
        const textarea = document.querySelector('textarea.textarea___V8HsV, textarea[placeholder*="Type your message"]');
        if (!textarea) return;

        textarea.value = `Grats ekiM_ ${getRandomEmojis()}`;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();

        const button = document.getElementById('gratsButton');
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Sent!';
            button.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 1000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createGratsButton);
    } else {
        createGratsButton();
    }

    setTimeout(createGratsButton, 1000);
})();
