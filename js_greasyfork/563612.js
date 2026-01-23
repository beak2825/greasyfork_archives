
// ==UserScript==
// @name         Cyberpunk Neon Style 2026
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Стилизация YouTube в неоновом стиле киберпанка
// @author       Ваше Имя
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563612/Cyberpunk%20Neon%20Style%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/563612/Cyberpunk%20Neon%20Style%202026.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ваш CSS код
    const css = `
        @-moz-document domain("youtube.com") {
            /* --- CYBERPUNK NEON STYLE 2026 --- */

            :root {
                --neon-pink: #ff00ff;
                --neon-blue: #00f2ff;
                --glass-dark: rgba(15, 2, 20, 0.85);
                --neon-glow: 0 0 10px rgba(255, 0, 255, 0.5);
            }

            /* Ваш стиль здесь ... (оставьте весь остальной CSS-код) ... */
        }
    `;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();
