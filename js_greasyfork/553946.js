// ==UserScript==
// @name         Скрытие admin_note уведомлений на Wevent
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Автоматически скрывает все уведомления с классом admin_note topmes
// @author       You
// @match        https://wevent.space/crm/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553946/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20admin_note%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BD%D0%B0%20Wevent.user.js
// @updateURL https://update.greasyfork.org/scripts/553946/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20admin_note%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BD%D0%B0%20Wevent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Скрипт скрытия уведомлений запущен');

    // Добавляем CSS для мгновенного скрытия
    const style = document.createElement('style');
    style.textContent = `
        div.admin_note.topmes {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // Функция для скрытия уведомлений
    function hideAdminNotes() {
        const notes = document.querySelectorAll('div.admin_note.topmes');
        if (notes.length > 0) {
            notes.forEach(note => {
                note.style.display = 'none';
                note.style.visibility = 'hidden';
                note.style.opacity = '0';
            });
            console.log('Скрыто уведомлений: ' + notes.length);
        }
    }

    // Запускаем сразу
    hideAdminNotes();

    // Запускаем через небольшие интервалы для надежности
    setTimeout(hideAdminNotes, 100);
    setTimeout(hideAdminNotes, 300);
    setTimeout(hideAdminNotes, 500);
    setTimeout(hideAdminNotes, 1000);

    // Наблюдаем за изменениями DOM
    const observer = new MutationObserver(function(mutations) {
        hideAdminNotes();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // Дополнительная проверка каждые 2 секунды
    setInterval(hideAdminNotes, 2000);

    console.log('Наблюдатель за уведомлениями активирован');
})();