// ==UserScript==
// @name         Steam Points Shop Optimizer (Final Custom V4.3)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Чистка RAM + GPU Fix + Стабильная сетка + Микро-правки интерфейса
// @author       https://steamcommunity.com/id/SashaWaybright/
// @match        https://store.steampowered.com/points/shop/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557784/Steam%20Points%20Shop%20Optimizer%20%28Final%20Custom%20V43%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557784/Steam%20Points%20Shop%20Optimizer%20%28Final%20Custom%20V43%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === НАСТРОЙКИ ===
    const ITEM_CLASS_MEMORY = "_1hyVDUTu00_a_5XtwVOdU2";
    const ITEM_CLASS_VISUAL = "_2EUBPpuLIR8PTTb_d40Gv9";

    const DEBUG_MODE = true; // Рамки (outline)
    const SAFE_DISTANCE = 600;
    // =================

    // --- ЧАСТЬ 1: CSS ИНЪЕКЦИЯ ---
    function injectPerformanceCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* 1. Отключение тяжелых эффектов для карточек */
            .${ITEM_CLASS_VISUAL} {
                transform: none !important;
                transform-style: flat !important;
                perspective: none !important;
                backdrop-filter: none !important;
                box-shadow: none !important;
                transition: none !important;
            }

            .${ITEM_CLASS_VISUAL}:hover {
                transform: none !important;
                z-index: auto !important;
            }

            /* 2. Твои микро-правки (Masks Fix) */
            ._1zw0IYqnKh-6iLonZf9P-G,
            ._1vgF7y8x0h-yXyDW_zLgnG {
                -webkit-mask-image: unset !important;
                mask-image: unset !important;
                transform: unset !important;
            }

            /* 3. Твои микро-правки (Margin Fix) */
            ._1st6-XscoE6pAsGNvDoIje ._3LoKg78CNiXHr1KHmURkIE {
                margin-top: 36px !important;
            }
        `;
        document.head.appendChild(style);
        console.log("Steam Optimizer: Все стили применены успешно.");
    }

    // --- ЧАСТЬ 2: JS ЧИСТКА ---
    const memoryMap = new WeakMap();

    const setBorder = (el, color) => {
        if (DEBUG_MODE) {
            // Outline не ломает сетку!
            el.style.outline = `2px solid ${color}`;
            el.style.outlineOffset = "-2px";
        }
    };

    const unloadItem = (target) => {
        const images = target.querySelectorAll('img');
        const video = target.querySelector('video');

        images.forEach(img => {
            if (img.src && !img.src.includes('data:image')) {
                if (!memoryMap.has(img)) memoryMap.set(img, img.src);

                const isSmallIcon = img.clientHeight < 50;
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

                if (!isSmallIcon) img.style.minHeight = "100px";
            }
        });

        if (video && video.src) {
            if (!memoryMap.has(video)) memoryMap.set(video, video.src);
            video.pause();
            video.src = "";
            video.load();
        }

        setBorder(target, 'red');
    };

    const loadItem = (target) => {
        const images = target.querySelectorAll('img');
        const video = target.querySelector('video');

        images.forEach(img => {
            if (memoryMap.has(img)) {
                const saved = memoryMap.get(img);
                if (img.src !== saved) {
                    img.src = saved;
                    img.style.minHeight = "";
                    img.style.height = "";
                }
            }
        });

        if (video && memoryMap.has(video)) {
            const saved = memoryMap.get(video);
            if (video.src !== saved) video.src = saved;
        }

        setBorder(target, 'green');
    };

    const runGarbageCollector = () => {
        const items = document.querySelectorAll(`.${ITEM_CLASS_MEMORY}`);
        const viewportHeight = window.innerHeight;

        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isFarAbove = rect.bottom < -SAFE_DISTANCE;
            const isFarBelow = rect.top > viewportHeight + SAFE_DISTANCE;

            if (isFarAbove || isFarBelow) {
                unloadItem(item);
            } else if (rect.top < viewportHeight + 200 && rect.bottom > -200) {
                loadItem(item);
            }
        });
    };

    // === ЗАПУСК ===
    injectPerformanceCSS();

    setInterval(runGarbageCollector, 2000);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) loadItem(entry.target);
        });
    }, { rootMargin: "300px" });

    setInterval(() => {
        const items = document.querySelectorAll(`.${ITEM_CLASS_MEMORY}:not(.opt-active)`);
        items.forEach(item => {
            observer.observe(item);
            item.classList.add('opt-active');
        });
    }, 1000);

})();