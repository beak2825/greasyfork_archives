// ==UserScript==
// @name         VK Video Timestamps (Deep Search v3)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Делает таймкоды кликабельными (Deep Shadow DOM support)
// @author       torch
// @match        https://vk.com/*
// @match        https://vkvideo.ru/*
// @match        https://m.vk.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553756/VK%20Video%20Timestamps%20%28Deep%20Search%20v3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553756/VK%20Video%20Timestamps%20%28Deep%20Search%20v3%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. СТИЛИ ===
    GM_addStyle(`
        .vk-time-link {
            background: rgba(75, 179, 75, 0.15);
            color: #4bb34b !important;
            font-weight: 700;
            cursor: pointer;
            border-bottom: 1px solid rgba(75, 179, 75, 0.5);
            padding: 0 2px;
            border-radius: 3px;
            transition: all 0.2s;
            text-decoration: none !important;
            display: inline-block;
        }
        .vk-time-link:hover {
            background: #4bb34b;
            color: white !important;
        }
        /* Контейнер маркеров */
        #custom-timeline-layer {
            position: absolute;
            bottom: 45px;
            left: 10px;
            right: 10px;
            height: 15px;
            z-index: 99999;
            pointer-events: none;
            display: flex;
        }
        /* Маркеры */
        .timeline-marker {
            position: absolute;
            bottom: 0;
            width: 5px;
            height: 8px;
            background-color: #ffd700;
            border: 1px solid #000;
            transform: translateX(-50%);
            cursor: pointer;
            pointer-events: auto;
            opacity: 0.8;
            transition: all 0.1s;
        }
        .timeline-marker:hover {
            height: 16px;
            width: 8px;
            z-index: 100000;
            background-color: #fff;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        /* Тултип */
        .marker-tooltip {
            position: absolute;
            bottom: 22px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 5px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s;
            font-family: sans-serif;
            z-index: 100001;
        }
        .timeline-marker:hover .marker-tooltip {
            opacity: 1;
            visibility: visible;
        }
    `);

    let markersData = [];

    // === 2. ФУНКЦИЯ ГЛУБОКОГО ПОИСКА ВИДЕО (РЕКУРСИЯ) ===
    function findVideoElement(root = document) {
        // 1. Проверяем прямой поиск
        let video = root.querySelector('video');
        if (video) return video;

        // 2. Если это VK плеер (веб-компонент), лезем в его Shadow Root
        const vkPlayer = root.querySelector('vk-video-player');
        if (vkPlayer && vkPlayer.shadowRoot) {
            video = vkPlayer.shadowRoot.querySelector('video');
            if (video) return video;
        }

        // 3. Рекурсивный обход всех элементов с Shadow DOM
        // Это тяжелая операция, поэтому делаем её только если простые методы не сработали
        const allNodes = root.querySelectorAll('*');
        for (let node of allNodes) {
            if (node.shadowRoot) {
                video = findVideoElement(node.shadowRoot);
                if (video) return video;
            }
        }

        return null;
    }

    // === 3. УПРАВЛЕНИЕ ВРЕМЕНЕМ ===
    function parseTime(timeStr) {
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    }

    function seekVideo(seconds) {
        const vid = findVideoElement(); // Ищем видео в момент клика

        if (!vid) {
            console.error('[VK Time] Video element not found inside Shadow DOM.');
            // Не показываем alert каждый раз, чтобы не бесить, если скрипт ошибся
            // Но попробуем визуально мигнуть, что не вышло
            return;
        }

        // Проверка: видео может быть не готово
        if (vid.readyState === 0) {
            console.warn('[VK Time] Video found but not ready.');
            vid.load(); // Пытаемся пнуть его
        }

        vid.currentTime = seconds;
        if (vid.paused) {
            vid.play().then(() => {}).catch(err => console.log('Autoplay blocked:', err));
        }

        // Скролл к видео, если оно уехало вверх
        vid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // === 4. ПЕРЕХВАТ КЛИКОВ (Capture Phase) ===
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.vk-time-link');
        if (target) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const seconds = parseFloat(target.dataset.sec);
            console.log('[VK Time] Clicked timestamp:', seconds);
            seekVideo(seconds);
        }
    }, true);

    // === 5. ОБРАБОТКА КОММЕНТАРИЕВ ===
    function processComments() {
        // Расширенный список селекторов для текста комментариев
        const selectors = [
            '.vkitComment__formattedText--dIeRB:not([data-processed])',
            '.wall_reply_text:not([data-processed])',
            '.ReplyItem__text:not([data-processed])',
            '.mv_comment_text:not([data-processed])' // Старый дизайн
        ];

        const commentBlocks = document.querySelectorAll(selectors.join(', '));
        if (commentBlocks.length === 0) return;

        let newMarkersFound = false;
        const regex = /(\d{1,2}:\d{2}(?::\d{2})?)/g;

        commentBlocks.forEach(block => {
            block.setAttribute('data-processed', 'true');
            const html = block.innerHTML;

            if (!regex.test(html)) return;

            // Парсинг текста для маркеров
            const lines = block.innerText.split('\n');
            lines.forEach(line => {
                const match = line.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
                if (match) {
                    const timeStr = match[1];
                    const seconds = parseTime(timeStr);
                    let label = line.replace(timeStr, '').replace(/^[\s\-\—\.\)]+/, '').trim();
                    if (label.length > 60) label = label.substring(0, 60) + '...';
                    if (!label) label = "Таймкод";

                    markersData.push({ seconds, label, timeStr });
                    newMarkersFound = true;
                }
            });

            // Замена HTML
            block.innerHTML = html.replace(regex, (match) => {
                const seconds = parseTime(match);
                return `<span class="vk-time-link" data-sec="${seconds}">${match}</span>`;
            });
        });

        if (newMarkersFound) updateTimelineMarkers();
    }

    // === 6. ОТРИСОВКА МАРКЕРОВ ===
    function updateTimelineMarkers() {
        const vid = findVideoElement();
        if (!vid || !vid.duration) return;

        // Поиск обертки для вставки слоя
        // Пытаемся найти shadowRoot хост или ближайшего родителя
        let wrapper = null;

        // Специфично для нового дизайна VK (из вашего HTML)
        const customPlayer = document.querySelector('vk-video-player');
        if (customPlayer) {
             // Вставляем внутрь веб-компонента если возможно, или сразу после него
             wrapper = customPlayer.parentElement;
        } else {
             wrapper = vid.parentElement?.parentElement || document.querySelector('.videoplayer_media');
        }

        if (!wrapper) return;

        // Проверяем, есть ли уже слой
        let layer = document.getElementById('custom-timeline-layer');
        if (layer) layer.remove(); // Пересоздаем, чтобы позиция обновилась

        layer = document.createElement('div');
        layer.id = 'custom-timeline-layer';

        // Делаем wrapper relative, чтобы layer позиционировался внутри него
        const style = window.getComputedStyle(wrapper);
        if (style.position === 'static') wrapper.style.position = 'relative';

        wrapper.appendChild(layer);

        // Очищаем дубликаты
        const uniqueMarkers = markersData.filter((v,i,a)=>a.findIndex(t=>(t.seconds===v.seconds))===i);

        uniqueMarkers.forEach(marker => {
            if (marker.seconds > vid.duration) return;

            const leftPercent = (marker.seconds / vid.duration) * 100;
            const pin = document.createElement('div');
            pin.className = 'timeline-marker';
            pin.style.left = `${leftPercent}%`;
            pin.title = marker.label; // Системная подсказка тоже полезна

            // Своя подсказка
            const tooltip = document.createElement('div');
            tooltip.className = 'marker-tooltip';
            tooltip.innerText = `${marker.timeStr} ${marker.label}`;
            pin.appendChild(tooltip);

            pin.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                seekVideo(marker.seconds);
            });

            layer.appendChild(pin);
        });
    }

    // === 7. ЗАПУСК ===
    // Наблюдаем за изменениями DOM
    const observer = new MutationObserver(() => {
        processComments();
        // Пытаемся обновить маркеры (вдруг видео загрузилось)
        const vid = findVideoElement();
        if (vid && !vid.dataset.hasMarkerListener) {
            vid.dataset.hasMarkerListener = 'true';
            vid.addEventListener('loadedmetadata', updateTimelineMarkers);
            vid.addEventListener('durationchange', updateTimelineMarkers);
            // Если уже готово
            if (vid.duration) updateTimelineMarkers();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Стартовый пинок
    setTimeout(() => {
        processComments();
        updateTimelineMarkers();
    }, 1000);
    setTimeout(updateTimelineMarkers, 3000); // Повторная попытка через 3 сек

})();