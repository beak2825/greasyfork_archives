// ==UserScript==
// @name         👻 Ghost Mode Max.ru
// @namespace    http://tampermonkey.net/
// @version      0.1 beta
// @description  Блокирует статусы "Прочитано" и "Набирает сообщение" в мессенджере Max (Макс).
// @author       Gemini
// @license MIT
// @match        https://web.max.ru/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559791/%F0%9F%91%BB%20Ghost%20Mode%20Maxru.user.js
// @updateURL https://update.greasyfork.org/scripts/559791/%F0%9F%91%BB%20Ghost%20Mode%20Maxru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLES = {
        title: "color: #ff0055; font-size: 16px; font-weight: bold;",
        block_read: "background: #222; color: #ff0055; font-size: 12px; padding: 4px; border-radius: 4px;",
        block_type: "background: #222; color: #00ffff; font-size: 12px; padding: 4px; border-radius: 4px;",
    };

    console.log("%c👻 Ghost Mode: Режим полной невидимости активирован...", STYLES.title);

    const OriginalWebSocket = window.WebSocket;
    const originalSend = OriginalWebSocket.prototype.send;

    OriginalWebSocket.prototype.send = function(data) {
        try {
            if (typeof data === 'string') {
                // 1. Блокируем "Прочитано" (Opcode 50)
                if (data.includes('"opcode":50')) {
                    console.log("%c🚫 БЛОК: Отчет о прочтении убит (Opcode 50).", STYLES.block_read);
                    return; // 🛑 Не отправляем!
                }

                // 2. Блокируем "Набирает сообщение..." (Opcode 65)
                if (data.includes('"opcode":65')) {
                    console.log("%c🤫 БЛОК: Статус 'Печатает...' скрыт (Opcode 65).", STYLES.block_type);
                    return; // 🛑 Не отправляем!
                }
            }
        } catch (err) {
            console.error("Pyrite Error:", err);
        }

        // Все остальные пакеты (вход, отправка самого сообщения и т.д.) пропускаем
        return originalSend.apply(this, arguments);
    };

})();