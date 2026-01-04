// ==UserScript==
// @name         Spotify: Исключить и Далее + Хоткей D/В (v8.1)
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  Добавляет кнопку "Исключить и Далее", а также горячую клавишу 'D' (включая русскую раскладку 'В') для выполнения этого действия.
// @author       Gemini
// @match        https://open.spotify.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551295/Spotify%3A%20%D0%98%D1%81%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%B8%20%D0%94%D0%B0%D0%BB%D0%B5%D0%B5%20%2B%20%D0%A5%D0%BE%D1%82%D0%BA%D0%B5%D0%B9%20D%D0%92%20%28v81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551295/Spotify%3A%20%D0%98%D1%81%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%B8%20%D0%94%D0%B0%D0%BB%D0%B5%D0%B5%20%2B%20%D0%A5%D0%BE%D1%82%D0%BA%D0%B5%D0%B9%20D%D0%92%20%28v81%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Spotify Dislike v8.1] Скрипт с горячей клавишей "D/В" запущен.');

    const SCRIPT_BUTTON_ID = 'gemini-dislike-button-v8-1';
    
    // Селекторы, подтвержденные нашей диагностикой
    const LIKE_BUTTON_SELECTOR = 'button[aria-label="Добавить в любимые треки"]';
    const MORE_OPTIONS_BUTTON_SELECTOR = 'button[data-testid="more-button"]';
    const NEXT_BUTTON_SELECTOR = 'button[data-testid="control-button-skip-forward"]';
    
    const DISLIKE_ICON_SVG = `<svg data-encore-id="icon" role="img" aria-hidden="true" class="e-91000-icon e-91000-baseline" style="--encore-icon-height: var(--encore-graphic-size-decorative-smaller); --encore-icon-width: var(--encore-graphic-size-decorative-smaller);" viewBox="0 0 16 16"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0 -13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path><path d="M11.005 4.995a.75.75 0 0 1 0 1.06L9.061 8l1.944 1.945a.75.75 0 1 1-1.06 1.06L8 9.061l-1.945 1.944a.75.75 0 1 1-1.06-1.06L6.939 8 4.995 6.055a.75.75 0 1 1 1.06-1.06L8 6.939l1.945-1.944a.75.75 0 0 1 1.06 0"></path></svg>`;

    /**
     * Основная функция: исключает трек и переключает на следующий.
     */
    function performDislikeAndSkipAction() {
        console.log('[v8.1] Активирована функция "Исключить и Далее".');
        const moreOptionsButton = document.querySelector(MORE_OPTIONS_BUTTON_SELECTOR);
        if (!moreOptionsButton) {
            console.error('[v8.1] КРИТИЧЕСКАЯ ОШИБКА: Не удалось найти кнопку "Больше опций" (...).');
            return;
        }

        moreOptionsButton.click();

        setTimeout(() => {
            const allMenuItems = document.querySelectorAll('div[id="context-menu"] button[role="menuitem"]');
            let foundButton = null;

            for (const button of allMenuItems) {
                const span = button.querySelector('span');
                if (span && span.textContent.trim() === 'Исключить из музыкальных предпочтений') {
                    foundButton = button;
                    break;
                }
            }

            if (foundButton) {
                foundButton.click();
                setTimeout(() => {
                    const nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
                    if (nextButton) {
                        nextButton.click();
                    }
                }, 150);

            } else {
                console.error('[v8.1] Ошибка: Меню открылось, но пункт "Исключить..." НЕ найден.');
                document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            }
        }, 300);
    }
    
    /**
     * Стандартная функция добавления кнопки на панель плеера.
     * @returns 
     */
    function addDislikeButton() {
        if (document.getElementById(SCRIPT_BUTTON_ID)) return;
        
        const likeButton = document.querySelector(LIKE_BUTTON_SELECTOR);
        if (likeButton) {
            const dislikeButton = document.createElement('button');
            dislikeButton.id = SCRIPT_BUTTON_ID;
            dislikeButton.className = likeButton.className;
            dislikeButton.setAttribute('aria-label', 'Исключить и переключить (D/В)');
            dislikeButton.style.marginLeft = '4px';
            const iconWrapper = document.createElement('span');
            iconWrapper.className = 'e-91000-button__icon-wrapper';
            iconWrapper.innerHTML = DISLIKE_ICON_SVG;
            dislikeButton.appendChild(iconWrapper);
            dislikeButton.onclick = performDislikeAndSkipAction;
            likeButton.insertAdjacentElement('afterend', dislikeButton);
        }
    }

    // Ищем место для вставки кнопки каждую секунду
    setInterval(addDislikeButton, 1000);

    // --- ОБРАБОТЧИК ГОРЯЧЕЙ КЛАВИШИ С УЧЕТОМ РАСКЛАДКИ ---
    document.addEventListener('keydown', function(event) {
        const target = event.target;
        const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

        // Проверяем код физической клавиши (независимо от раскладки)
        // 'KeyD' - это код для клавиши 'D' на стандартной QWERTY-клавиатуре
        if (event.code === 'KeyD' && !isTyping) {
            console.log('[v8.1] Нажата горячая клавиша D/В.');
            event.preventDefault();
            performDislikeAndSkipAction();
        }
    });

})();