// ==UserScript==
// @name         Steam Showcase Perfect Sync
// @namespace    http://tampermonkey.net/
// @version      5.0
// @license MIT
// @description  Invisible sync: hides showcases until fully loaded, then fades them in perfectly synced. No buttons.
// @author       An0nX
// @match        https://steamcommunity.com/id/*/edit/showcases*
// @match        https://steamcommunity.com/profiles/*/edit/showcases*
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @exclude      https://steamcommunity.com/id/*/friends*
// @exclude      https://steamcommunity.com/profiles/*/friends*
// @exclude      https://steamcommunity.com/id/*/games*
// @exclude      https://steamcommunity.com/profiles/*/games*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556380/Steam%20Showcase%20Perfect%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/556380/Steam%20Showcase%20Perfect%20Sync.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Настройки задержки (в мс)
    // 500-1000мс достаточно, чтобы Steam отрисовал HTML, но пользователь еще не успел сфокусироваться
    const START_DELAY = 800;

    // --- Сбор изображений ---
    function getShowcaseImages() {
        const selectors = [
            '#showcase_0_previews .screenshot_showcase img',
            '#showcase_1_previews .workshop_showcase_item_image',
            '#showcase_2_previews .workshop_showcase_item_image',
            '#showcase_preview_22 .screenshot_showcase_primary img',
            '.profile_customization_block .screenshot_showcase .screenshot_showcase_primary img',
            '.profile_customization_block .screenshot_showcase .screenshot_showcase_smallscreenshot img',
            '.profile_customization_block .myworkshop_showcase .workshop_showcase_item_image',
            '.profile_customization_block .workshop_showcase .workshop_showcase_item_image',
            '.profile_customization_block .screenshot_showcase.single img',
            '.profile_customization_block .favorite_showcase .screenshot_showcase_primary img'
        ];

        const elements = new Set();
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(img => {
                if (img.src && !img.src.includes('trans.gif') && !img.closest('.openslot') && img.offsetParent !== null) {
                    elements.add(img);
                }
            });
        });
        return Array.from(elements);
    }

    // --- Логика скрытной синхронизации ---
    async function silentSync() {
        const images = getShowcaseImages();
        if (images.length === 0) return;

        // 1. МГНОВЕННО скрываем текущие изображения.
        // Без transition, чтобы не было "полупрозрачных прямоугольников". Просто исчезают.
        images.forEach(img => {
            img.style.opacity = '0';
            // Отключаем pointer-events, чтобы нельзя было кликнуть по пустому месту пока грузится
            img.style.pointerEvents = 'none';
        });

        const timestamp = Date.now();

        // 2. Подготавливаем новые версии в фоне
        const promises = images.map(originalImg => {
            return new Promise((resolve) => {
                const imgLoader = new Image();
                const cleanUrl = originalImg.src.split('?')[0];
                const newUrl = `${cleanUrl}?t=${timestamp}`;

                imgLoader.src = newUrl;

                // Ждем полного декодирования кадров
                imgLoader.decode()
                    .then(() => resolve({ element: originalImg, newSrc: newUrl }))
                    .catch(() => {
                        // Если ошибка декодирования, возвращаем как есть, чтобы не ломать лейаут
                        resolve({ element: originalImg, newSrc: newUrl });
                    });
            });
        });

        // 3. Ждем загрузки ВСЕХ изображений
        const results = await Promise.all(promises);

        // 4. Применяем и плавно показываем
        requestAnimationFrame(() => {
            results.forEach(item => {
                item.element.src = item.newSrc;
            });

            // Небольшая пауза (50мс), чтобы браузер точно подхватил новые SRC
            setTimeout(() => {
                images.forEach(img => {
                    // Включаем плавное появление (красиво)
                    img.style.transition = 'opacity 0.6s ease-in-out';
                    img.style.opacity = '1';
                    img.style.pointerEvents = 'auto'; // Возвращаем кликабельность
                });
            }, 50);
        });
    }

    // Запуск с небольшой задержкой для гарантии загрузки DOM
    setTimeout(silentSync, START_DELAY);

})();