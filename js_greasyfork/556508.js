// ==UserScript==
// @name           Google Custom css  Gemeni AI     1.22.11.25
// @namespace      http://tampermonkey.net/
// @version        1.22.11.25
// @license        LLC
// @description    Custom css for Google GemeniChat
// @match          https://gemini.google.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @downloadURL https://update.greasyfork.org/scripts/556508/Google%20Custom%20css%20%20Gemeni%20AI%20%20%20%20%201221125.user.js
// @updateURL https://update.greasyfork.org/scripts/556508/Google%20Custom%20css%20%20Gemeni%20AI%20%20%20%20%201221125.meta.js
// ==/UserScript==

(function() {
    const css = `
 .monaco-editor .selection-anchor {
   background: #48b363 !important;
}
.input-gradient {
     position: relative !important;
     background: linear-gradient(180deg, rgb(83 47 97), rgb(128 0 128 / 0%) 60%) !important;
}
.input-gradient::after {
    content: "" !important;
    position: absolute !important;
    top: -50px !important;
    bottom: 0 !important;
    inset-inline-start: 0 !important;
    width: 100% !important;
    height: 100px !important;
    pointer-events: none !important;
    z-index: -1 !important;
    background: linear-gradient(180deg, rgb(22 59 56 / 0%), rgb(57 39 68) 60%) !important;
}
.text-input-field.with-toolbox-drawer.height-expanded-past-single-line.pre-fullscreen.fullscreen {
    height: 635px !important;
    max-height: 700px !important;
}



.text-input-field.with-toolbox-drawer.pre-fullscreen.height-expanded-past-single-line {
    max-height: 700px !important;
}
body.dark-theme {
    background: linear-gradient(180deg, rgb(33 25 41), rgb(10 29 31)) !important;
    border-radius: 22px !important;
    border: 2px solid #549e92 !important;
}
.text-input-field.with-toolbox-drawer.height-expanded-past-single-line {
    border: 2px solid #48cfa3 !important;
    background: linear-gradient(360deg, #241730, #12333f) !important;
    height: 130px !important;
}

.response-container-with-gpi.ng-star-inserted {
    border: 2px solid #48cfa3 !important;
    background: linear-gradient(360deg, #241730, #12333f) !important;
    width: 830px !important;
}


.conversation-container {
    width: 955px !important;
    max-width: 1100px !important;
}

model-response.ng-star-inserted {
    width: 955px !important;
    max-width: 1100px !important;
}

.response-container.response-container-with-gpi {
    width: 955px !important;
    max-width: 1200px !important;
}



.code-block-decoration.header-formatted.gds-title-s.ng-star-inserted {
    border: 2px solid #48cfa3 !important;
    background: linear-gradient(360deg, #38263d, #3f2344) !important;
    color: #fed15c !important;
}
.user-query-bubble-with-background {
    background: linear-gradient(180deg, #1c4344, 39%, #162c42) !important;
}

td {
     background: linear-gradient(180deg, #263e4b, 39%, #263e4b ) !important;

}

table {
    border: 2px solid #478f9b !important;
    color: #a1ccc1 !important;
}
.markdown {
    color: #c4c4a4 !important;
}


bard-sidenav.ng-trigger.ng-trigger-widthTransition.disable-onload-animations.ng-star-inserted {
    border: 2px solid rgb(72, 207, 163) !important;
    background: linear-gradient(360deg, rgb(36, 23, 48), rgb(18, 51, 63)) !important;
     border-radius: 35px !important;
}

button {
    background-color: rgb(60 44 80) !important;
    border: 2px solid #cdb4e2 !important;
    color: #cdb4e2 !important;
    border-radius: 25px !important;
}

.conversations-container .conversation {
    color: #64e682 !important;
}

.mat-mdc-menu-content {
    border: 2px solid rgb(72, 207, 163) !important;
    background: linear-gradient(360deg, rgb(36, 23, 48), rgb(18, 51, 63)) !important;
    border-radius: 25px !important;
}

div#mat-menu-panel-2 {
    border-radius: 25px !important;
}

div#chat-history {
    background: linear-gradient(180deg, rgb(33 25 41), rgb(10 29 31)) !important;
    border-radius: 22px !important;
    border: 2px solid #549e92 !important;
}

input-container.input-gradient.ui-improvements-phase-1.ng-star-inserted {
     background: linear-gradient(180deg, rgb(33 25 41), rgb(10 29 31)) !important;
    border-radius: 22px !important;
    border: 2px solid #549e92 !important;
}

 .immersives-mode {
     background: linear-gradient(180deg, rgb(53 38 68), rgb(13 45 48)) !important;
    border-radius: 22px !important;
    border: 2px solid #549e92 !important;
}


.margin-view-overlays {
    background: linear-gradient(180deg, rgb(30 41 25), rgb(10 29 31)) !important;
    border-radius: 0px 0px 22px 22px !important;
    border: 2px solid #549e92 !important;
}

.monaco-editor .line-numbers {
    color: #6bdd70 !important;
}

.toolbar.has-title {
    background: linear-gradient(180deg, rgb(44 63 16), rgb(17 62 43)) !important;
    border-radius: 22px 22px  0px 0px !important;
    border: 2px solid #549e92 !important;
}

/* .view-lines.monaco-mouse-cursor-text {
     background: linear-gradient(180deg, rgb(11 29 30), rgb(27 15 31)) !important;
} */
code {
    background: #ff980070 !important;
    color: #dbddc8 !important;
}
code.code-container {
    border: 2px solid #48cfa3 !important;
    background: linear-gradient(360deg, #212118, #29261d) !important;
}

.code-block[_ngcontent-ng-c2276304325]   code[_ngcontent-ng-c2276304325]     .hljs-comment {
    color: #c395de !important;
}
    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);


})();


//======= show-hide-code-btn ============//
(function() {
    'use strict';

    // Функция дебаунс для предотвращения слишком частых вызовов
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Целевые селекторы для стилизации
    const targetSelectors = {
        immersivePanel: 'immersive-panel.ng-trigger.ng-trigger-immersivePanelTransitions.ng-star-inserted',
        chatContainer: '.chat-container.ng-trigger.ng-trigger-chatHistoryImmersiveTransitions'
    };

    // Состояние показа/скрытия
    let isVisible = false;

    // Функция применения стилей с анимацией
    function applyStyles(visible) {
        const immersivePanel = document.querySelector(targetSelectors.immersivePanel);
        const chatContainer = document.querySelector(targetSelectors.chatContainer);

        if (immersivePanel) {
            immersivePanel.style.setProperty('transition', 'left 0.3s ease-in-out', 'important');
            immersivePanel.style.setProperty('left', visible ? '850px' : '', 'important');
        }

        if (chatContainer) {
            chatContainer.style.setProperty('transition', 'width 0.3s ease-in-out', 'important');
            chatContainer.style.setProperty('width', visible ? '1250px' : '', 'important');
            chatContainer.style.setProperty('position', visible ? 'relative' : '', 'important');
        }
    }

    // Дебаунс-версия applyStyles
    const debouncedApplyStyles = debounce(applyStyles, 150);

    // Функция создания и добавления кнопки (в последний buttons-container внутри top-bar-actions)
    function createAndAddButton() {
        const topBar = document.querySelector('.top-bar-actions');
        if (!topBar || document.querySelector('#showxu5eje5jjtf66kt-hide-code-t6lt7btn')) {
            return; // Кнопка уже добавлена или контейнер не найден
        }

        // Ищем последний buttons-container для добавления
        const buttonsContainers = topBar.querySelectorAll('.buttons-container');
        const targetContainer = buttonsContainers[buttonsContainers.length - 1];
        if (!targetContainer) return;

        const button = document.createElement('button');
        button.id = 'showxu5eje5jjtf66kt-hide-code-t6lt7btn';
        button.textContent = 'hide code';
        button.style.cssText = `
            margin-left: 10px;
            padding: 8px 12px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            isVisible = !isVisible;
            button.textContent = isVisible ? 'show code' : 'hide code';
            debouncedApplyStyles(isVisible);
        });

        targetContainer.appendChild(button);
    }

    // Отдельный наблюдатель для целевых элементов
    function observeTargets() {
        const observer = new MutationObserver(() => {
            if (isVisible) { // Применяем только если активно
                debouncedApplyStyles(isVisible);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // Отдельный наблюдатель для контейнера кнопки
    function observeContainer() {
        const containerObserver = new MutationObserver(() => {
            requestAnimationFrame(createAndAddButton); // Используем RAF для синхронизации с рендером
        });
        containerObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Инициализация
    function init() {
        requestAnimationFrame(() => {
            createAndAddButton();
            observeTargets();
            observeContainer();
        });
    }

    // Запуск при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Перезапуск при навигации (для SPA)
    let currentUrl = window.location.href;
    const navigationObserver = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            // Очищаем старую кнопку
            document.getElementById('showxu5eje5jjtf66kt-hide-code-t6lt7btn')?.remove();
            setTimeout(init, 1000); // Увеличена задержка для полной стабилизации
        }
    });
    navigationObserver.observe(document.body, { childList: true, subtree: true });

})();
































//========= CHAT_INPUT Show Hide =======//
//========= CHAT_INPUT Show Hide =======//

(function () {
    'use strict';

    // Функция debounce для задержки выполнения (оставим для надежности)
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Добавляем агрессивные стили для скрытия (CSS-класс)
    function addGlobalStyles() {
        if (document.getElementById('input-toggle-simple-styles')) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'input-toggle-simple-styles';
        style.textContent = `
            /* АГРЕССИВНОЕ СКРЫТИЕ: Используем display: none !important */
            .input-force-hidden-simple {
                display: none !important;
                pointer-events: none !important; /* Блокируем взаимодействие */
            }
            /* Стиль для поворота иконки */
            .toggle-icon-up {
                transform: rotate(0deg);
                transition: transform 0.3s ease;
            }
            .toggle-icon-down {
                transform: rotate(180deg);
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        console.log('(_CHAT_INPUT_)Глобальные стили добавлены.');
    }

    // Функция для инициализации кнопки
    function initializeToggle() {
        console.log('(_CHAT_INPUT_)Попытка найти контейнеры');

        addGlobalStyles();

        // --- СЕЛЕКТОРЫ ---
        const inputContainer = document.querySelector('input-container.input-gradient.ui-improvements-phase-1.ng-star-inserted');
        // Используем родителя в качестве контейнера для кнопки
        const buttonContainer = inputContainer ? inputContainer.parentNode : null;

        if (!inputContainer) {
            console.error('(_CHAT_INPUT_)inputContainer не найден');
            return false;
        }
        if (!buttonContainer) {
            console.error('(_CHAT_INPUT_)buttonContainer не найден');
            return false;
        }

        console.log('(_CHAT_INPUT_)Контейнеры найдены.');

        // Проверяем, добавлена ли уже кнопка
        if (buttonContainer.querySelector('.chatinputGemeni-xu5eje5jr56-toggle-button')) {
            console.log('(_CHAT_INPUT_)Кнопка уже добавлена');
            return true;
        }

        // --- СОЗДАНИЕ КНОПКИ ---
        const toggleButton = document.createElement('button');

        // Классы для стилей кнопки
         toggleButton.id = 'chatinputGemeni-xu5eje5jr56-button'
        toggleButton.className = 'chatinputGemeni-xu5eje5jr56-toggle-button inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 h-10 px-3 rounded-md';
        toggleButton.setAttribute('aria-label', 'Свернуть ввод');
        // Фиксированные стили для позиционирования
        toggleButton.style.cssText = `
    border-width: 2px;
    border-style: solid;
    border-image: initial;
    background-color: rgb(17, 62, 38) !important;
    color: rgb(69, 221, 184) !important;
    border-color: rgb(53, 236, 191) !important;
    top: 86% !important;
    height: 40px !important;
    position: fixed !important;
    left: 11% !important;
    border-radius: 35px !important;
    z-index: 555555 !important;
        `;

        // Создание SVG элемента (стрелка)
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.classList.add('stroke-[2]', 'toggle-icon-up'); // Изначально смотрит вверх (т.е. инпут виден)

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M6 9L12 15L18 9');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-linecap', 'square');
        svg.appendChild(path);

        const textSpan = document.createElement('span');
        textSpan.classList.add('toggle-text');
        textSpan.textContent = 'Свернуть Input chat';

        toggleButton.appendChild(svg);
        toggleButton.appendChild(textSpan);

        buttonContainer.prepend(toggleButton);
        console.log('(_CHAT_INPUT_)Кнопка добавлена.');

        // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ---
        let isVisible = true;

        toggleButton.addEventListener('click', () => {
            isVisible = !isVisible;

            if (isVisible) {
                // ПОКАЗАТЬ: Убираем класс скрытия и поворачиваем стрелку вверх
                inputContainer.classList.remove('input-force-hidden-simple');
                svg.classList.add('toggle-icon-up');
                svg.classList.remove('toggle-icon-down');
                textSpan.textContent = 'Свернуть Input chat';
            } else {
                // СКРЫТЬ: Добавляем класс скрытия и поворачиваем стрелку вниз
                inputContainer.classList.add('input-force-hidden-simple');
                svg.classList.add('toggle-icon-down');
                svg.classList.remove('toggle-icon-up');
                textSpan.textContent = 'Развернуть Input chat';
            }

            toggleButton.setAttribute('aria-label', isVisible ? 'Свернуть ввод' : 'Развернуть ввод');
            console.log('(_CHAT_INPUT_)Состояние изменено:', isVisible ? 'Виден' : 'Скрыт');
        });

        console.log('(_CHAT_INPUT_)Инициализация завершена');
        return true;
    }

    // --- ОБЕСПЕЧЕНИЕ ЗАПУСКА СКРИПТА ---
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeToggle();
    } else {
        document.addEventListener('DOMContentLoaded', initializeToggle);
    }

    // MutationObserver для динамических изменений (упрощенный, ищет контейнер)
    function setupObserver() {
        const targetSelector = 'input-container.input-gradient';
        const observer = new MutationObserver((mutations) => {
            let found = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches && (node.matches(targetSelector) || node.querySelector(targetSelector))) {
                                found = true;
                            }
                        }
                    });
                }
            });
            if (found) {
                console.log('(_CHAT_INPUT_)Обнаружены изменения в DOM, переинициализируем');
                initializeToggle();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        console.log('(_CHAT_INPUT_)MutationObserver запущен');
    }

    setupObserver();

    // Debounced резервная проверка
    const debouncedInit = debounce(initializeToggle, 500);
    setInterval(debouncedInit, 2000);
})();