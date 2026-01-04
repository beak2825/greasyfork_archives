// ==UserScript==
// @name         R34 Rewind Disable
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Блокировка перемотки по краям.
// @author       Gemini
// @match        https://rule34video.com/video/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34video.com
// @all-frames   true
// @downloadURL https://update.greasyfork.org/scripts/557936/R34%20Rewind%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/557936/R34%20Rewind%20Disable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const TARGET_CLASS = 'fp-player';
    const IGNORE_CLASS = 'fp-controls';
    const SEEK_ZONE_THRESHOLD = 0.33;
    let videoElement = null;

    /**
     * Вычисляет относительную координату X клика/тапа внутри элемента.
     */
    function getRelativeX(event, element) {
        const rect = element.getBoundingClientRect();
        
        // Получаем координату X либо из мыши, либо из первого касания
        const clientX = event.clientX || (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : null);
        
        if (clientX === null || !rect.width) {
            return null;
        }

        return (clientX - rect.left) / rect.width;
    }

    /**
     * Обработчик для блокировки перемотки на краях, с вызовом паузы/воспроизведения.
     */
    function handleSeekBlock(e) {
        // Пропускаем клики по элементам управления (.fp-controls).
        if (e.target.closest('.' + IGNORE_CLASS)) {
            return;
        }
        
        const relativeX = getRelativeX(e, this); 
        
        if (relativeX === null) {
            return;
        }

        // Если клик/тап в левой (0-33%) или правой (67-100%) трети, блокируем перемотку.
        if (relativeX <= SEEK_ZONE_THRESHOLD || relativeX >= (1 - SEEK_ZONE_THRESHOLD)) {
            
            // 1. 🛑 Блокируем оригинальное событие
            e.stopImmediatePropagation();
            e.preventDefault();
            
            // 2. 🟢 Принудительно вызываем нативную паузу/воспроизведение (используем кэш)
            if (videoElement) {
                if (videoElement.paused) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            }
        }
        
        // Если клик в центральной трети, позволяем событию пройти, чтобы плеер сам обработал паузу.
    }

    function applyFix(element) {
        if (element.hasAttribute('data-r34-final-fix')) return;

        // Поиск и кэширование элемента при первом применении фикса
        if (!videoElement) {
            videoElement = document.querySelector('video');
        }

        // Блокируем одиночный КЛИК (мышь) и ТАП (сенсор)
        element.addEventListener('click', handleSeekBlock, true);
        element.addEventListener('touchend', handleSeekBlock, true);

        element.setAttribute('data-r34-final-fix', 'true');
    }

    // Наблюдатель за появлением .fp-player
    const observer = new MutationObserver(function(mutations) {
        document.querySelectorAll('.' + TARGET_CLASS).forEach(applyFix);
    });

    function start() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            document.querySelectorAll('.' + TARGET_CLASS).forEach(applyFix);
        } else {
            window.addEventListener('DOMContentLoaded', start);
        }
    }
    
    start();
})();