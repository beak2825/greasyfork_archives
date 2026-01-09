// ==UserScript==
// @name         Torn Chat Emote Picker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a functional emoji selector menu to Torn chat boxes
// @author       srsbsns
// @match        *.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561898/Torn%20Chat%20Emote%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/561898/Torn%20Chat%20Emote%20Picker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EMOJIS = ['🤬', '🥵', '😘', '😤', '💥', '👮', '😍', '🤯','😀', '❤️', '🤣', '👍', '🔥', '💀', '💯', '💸', '🔫', '💊', '😆', '⚔️', '✅', '✈️', '👌', '😢', '🥰', '🤑', '🤯', '😭', '🥳', '👀'];

    function injectEmojiSystem() {
        const chatContainers = document.querySelectorAll('.root___WUd1h:not(.emoji-enhanced)');

        chatContainers.forEach(container => {
            const textarea = container.querySelector('textarea.textarea___V8HsV');
            const sendBtn = container.querySelector('.iconWrapper___tyRRU');
            if (!textarea || !sendBtn) return;

            // Create Menu Container
            const menu = document.createElement('div');
            menu.style.cssText = `
                display: none;
                position: absolute;
                bottom: 40px;
                right: 0;
                background: #333;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 5px;
                grid-template-columns: repeat(10, 1fr);
                gap: 5px;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            `;

            // Populate Emojis
            EMOJIS.forEach(emoji => {
                const span = document.createElement('span');
                span.innerText = emoji;
                span.style.cssText = 'cursor: pointer; font-size: 18px; padding: 2px;';
                span.onclick = () => {
                    // Insert emoji at cursor or end
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    textarea.value = text.slice(0, start) + emoji + text.slice(end);

                    // Trigger React input update
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    menu.style.display = 'none';
                    textarea.focus();
                };
                menu.appendChild(span);
            });

            // Create Toggle Button
            const toggleBtn = document.createElement('button');
            toggleBtn.innerHTML = '🙂';
            toggleBtn.type = 'button';
            toggleBtn.style.cssText = 'background:transparent; border:none; cursor:pointer; font-size:16px; padding:0 5px; opacity:0.7;';

            toggleBtn.onclick = (e) => {
                e.preventDefault();
                menu.style.display = menu.style.display === 'none' ? 'grid' : 'none';
            };

            // Wrap and Inject
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'flex';

            container.insertBefore(wrapper, sendBtn);
            wrapper.appendChild(toggleBtn);
            wrapper.appendChild(menu);

            container.classList.add('emoji-enhanced');
        });
    }

    setInterval(injectEmojiSystem, 1000);
})();