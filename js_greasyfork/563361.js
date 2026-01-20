// ==UserScript==
// @name         Mystavaria Webclient Ultimate Fix: ANSI Protector (Made by Gemini)
// @namespace    http://tampermonkey.net
// @version      7.4.3
// @description  Protects game data and ANSI codes from auto-translation while allowing descriptions to be translated. Optimized for Mystavaria. (게임 데이터 번역 방지 및 에러 수정)
// @author       User & Gemini
// @include      /^https?:\/\/www\.mystavaria\.com\/webclient\/.*$/
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563361/Mystavaria%20Webclient%20Ultimate%20Fix%3A%20ANSI%20Protector%20%28Made%20by%20Gemini%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563361/Mystavaria%20Webclient%20Ultimate%20Fix%3A%20ANSI%20Protector%20%28Made%20by%20Gemini%29.meta.js
// ==/UserScript==

/* 
 * [EN] Try this script for a better gaming experience! 
 * It protects critical game data and layouts while enabling auto-translation for story descriptions.
 * [KR] 더 나은 게임 경험을 위해 이 스크립트를 사용해 보세요!
 * 중요한 게임 데이터와 레이아웃은 보호하고, 스토리 묘사는 자동 번역이 가능하게 합니다.
 */

(function() {
    'use strict';

    // Access the actual page window object to bypass sandbox restrictions
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // 1. Plugin Error Prevention: Intercepts and fixes the Evennia 'plugin_handler' undefined error
    if (!targetWindow.plugin_handler) {
        targetWindow.plugin_handler = {
            add: function(name, inst) {
                if (!this.plugins) this.plugins = {};
                this.plugins[name] = inst;
            }
        };
    }

    const init = () => {
        // 2. CSS Injection: Hiding text from engine while displaying via CSS content
        const style = document.createElement('style');
        style.textContent = `
            .no-translate-css::before {
                content: attr(data-original) !important;
                display: inline !important;
                color: inherit !important;
                font-family: 'Courier New', Courier, monospace !important;
                white-space: pre !important; 
            }
        `;
        (document.head || document.documentElement).appendChild(style);

        // Protection patterns (ANSI, Map icons [o], Symbols, Short words, Key phrases)
        const protectionRegex = /[\x1B\[[0-9;]*[mK]|\[.{1,2}\]|[\{\}\>\|\-\_=]|^\s*[a-zA-Z]{1,3}\s*|you perceive/i;

        const doProtect = () => {
            const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                const p = node.parentElement;

                if (!p || p.tagName === 'SCRIPT' || p.tagName !== 'SPAN' || p.hasAttribute('data-original')) continue;

                const text = node.nodeValue;
                const color = window.getComputedStyle(p).color;

                // Identifies "Descriptions" (Gray/White color scales & length > 15)
                const isDescription = text.length > 15 && (color.includes('128') || color.includes('150') || color.includes('192') || color.includes('255'));

                if (protectionRegex.test(text) || !isDescription) {
                    if (!p.classList.contains('no-translate-css')) {
                        p.setAttribute('data-original', text);
                        p.classList.add('notranslate', 'no-translate-css');
                        p.setAttribute('translate', 'no'); 
                        node.nodeValue = ''; 
                    }
                }
            }
        };

        setInterval(doProtect, 300);
        const obs = new MutationObserver(doProtect);
        obs.observe(document.documentElement, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', init);
    else init();
})();
