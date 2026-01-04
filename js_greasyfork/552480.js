// ==UserScript==
// @name         Zendesk Scroll fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Знаходить елементи з класом .cMpyNE і змінює overflow-y: clip на visible.
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552480/Zendesk%20Scroll%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/552480/Zendesk%20Scroll%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Клас, який ми шукаємо
    const problemClass = 'cMpyNE';

    // Запускаємо постійну перевірку кожні 300 мс
    setInterval(() => {
        // Знаходимо ВСІ елементи з цим класом на сторінці
        const elements = document.querySelectorAll('.' + problemClass);

        // Перебираємо кожен знайдений елемент
        elements.forEach(element => {
            // Перевіряємо, чи поточний стиль справді 'clip'
            if (window.getComputedStyle(element).overflowY === 'clip') {
                // Якщо так - примусово міняємо його на 'visible' з максимальним пріоритетом
                element.style.setProperty('overflow-y', 'visible', 'important');
            }
        });
    }, 300);
})();