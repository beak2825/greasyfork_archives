// ==UserScript==
// @name         R34 Scroll rewind
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Перемотка колесом мыши в видео: вниз = +1 сек, вверх = -1 сек. Работает только в контейнере видео.
// @author       Gemini
// @match        https://rule34video.com/video/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34video.com
// @downloadURL https://update.greasyfork.org/scripts/557937/R34%20Scroll%20rewind.user.js
// @updateURL https://update.greasyfork.org/scripts/557937/R34%20Scroll%20rewind.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Константа, определяющая шаг перемотки в секундах
    const SEEK_STEP = 1;

    /**
     * Инициализирует функциональность перемотки видео по скроллу.
     */
    function setupVideoScrubbing() {
        // Поиск основного контейнера видеоплеера (#kt_player), как указано пользователем
        const videoContainer = document.querySelector('#kt_player');

        if (!videoContainer) {
            console.warn('Tampermonkey: Контейнер видео (#kt_player) не найден.');
            return;
        }

        // Находим сам элемент <video> внутри контейнера для управления временем
        const videoElement = videoContainer.querySelector('video');

        if (!videoElement) {
            console.warn('Tampermonkey: Элемент <video> внутри контейнера (#kt_player) не найден.');
            return;
        }

        console.log('Tampermonkey: Скрипт запущен. Настраиваем перемотку...');

        // Добавляем обработчик события 'wheel' (прокрутка мышью) к контейнеру.
        // Это гарантирует, что перемотка работает над всей областью плеера.
        videoContainer.addEventListener('wheel', function(e) {
            // 1. Отменяем стандартное поведение прокрутки страницы,
            //    чтобы скролл не работал, когда курсор находится над видео.
            e.preventDefault();

            // Получаем текущее время видео
            let currentTime = videoElement.currentTime;
            // Получаем общую продолжительность видео
            const duration = videoElement.duration;

            // Определяем направление скролла
            if (e.deltaY > 0) {
                // Скролл вниз (e.deltaY > 0) -> Перемотка вперед (+SEEK_STEP)
                currentTime += SEEK_STEP;
            } else if (e.deltaY < 0) {
                // Скролл вверх (e.deltaY < 0) -> Перемотка назад (-SEEK_STEP)
                currentTime -= SEEK_STEP;
            }

            // Ограничиваем новое время в пределах [0, duration]
            // Math.max(0, ...) гарантирует, что время не уйдет в отрицательную область.
            // Math.min(duration, ...) гарантирует, что время не превысит продолжительность.
            const newTime = Math.min(duration, Math.max(0, currentTime));

            // Устанавливаем новое время воспроизведения
            videoElement.currentTime = newTime;
        });

        console.log('Tampermonkey: Перемотка по скроллу активирована на контейнере #kt_player.');
    }

    // Запускаем настройку перемотки после загрузки документа
    // Используем document-idle, чтобы плеер точно успел загрузиться.
    setupVideoScrubbing();
})();