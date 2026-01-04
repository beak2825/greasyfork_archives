// ==UserScript==
// @name         GearGenerator Grab SVG
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to copy SVG gears
// @author       Exieros
// @match        https://geargenerator.com/*
// @grant        none
// @homepage     https://gist.github.com/Exieros/fcc3340fd773ca17eef3d0738b5e2874
// @downloadURL https://update.greasyfork.org/scripts/551155/GearGenerator%20Grab%20SVG.user.js
// @updateURL https://update.greasyfork.org/scripts/551155/GearGenerator%20Grab%20SVG.meta.js
// ==/UserScript==

//Telegram      @soreixe

(function() {
    'use strict';

    // Стили для кнопки копирования
    const buttonStyles = `
        .copy-svg-btn {
            position: fixed !important;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            transform: none !important;
            rotate: none !important;
            scale: none !important;
            translate: none !important;
            transform-origin: initial !important;
            transform-style: flat !important;
            perspective: none !important;
            backface-visibility: visible !important;
            writing-mode: horizontal-tb !important;
            direction: ltr !important;
            text-orientation: mixed !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: inline-block !important;
            vertical-align: baseline !important;
            text-align: center !important;
            line-height: normal !important;
        }

        .copy-svg-btn:hover {
            background: #0056b3;
        }

        .copy-svg-btn.visible {
            opacity: 1;
            pointer-events: auto;
        }

        .screen-child-container {
            position: relative;
        }

        .copy-success {
            background: #28a745 !important;
        }

        .copy-clear-btn {
            position: fixed !important;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            transform: none !important;
            rotate: none !important;
            scale: none !important;
            translate: none !important;
            transform-origin: initial !important;
            transform-style: flat !important;
            perspective: none !important;
            backface-visibility: visible !important;
            writing-mode: horizontal-tb !important;
            direction: ltr !important;
            text-orientation: mixed !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: inline-block !important;
            vertical-align: baseline !important;
            text-align: center !important;
            line-height: normal !important;
        }

        .copy-clear-btn:hover {
            background: #545b62;
        }

        .copy-clear-btn.visible {
            opacity: 1;
            pointer-events: auto;
        }
    `;

    // Добавляем стили на страницу
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = buttonStyles;
        document.head.appendChild(style);
    }

    // Универсальная функция для копирования SVG в буфер обмена
    async function copySVGToClipboard(svgElement, removeGeartext = false) {
        try {
            let svgCode;

            if (removeGeartext) {
                // Создаем копию SVG элемента и удаляем geartext, guides и firstmarker
                const svgClone = svgElement.cloneNode(true);
                const elementsToRemove = svgClone.querySelectorAll('.geartext, .guides, .firstmarker');
                elementsToRemove.forEach(element => element.remove());
                svgCode = svgClone.outerHTML;
            } else {
                // Получаем полный SVG код
                svgCode = svgElement.outerHTML;
            }

            // Копируем в буфер обмена
            await navigator.clipboard.writeText(svgCode);
            return true;
        } catch (error) {
            console.error('Ошибка при копировании SVG:', error);

            // Fallback метод для старых браузеров
            try {
                let svgCode;

                if (removeGeartext) {
                    const svgClone = svgElement.cloneNode(true);
                    const elementsToRemove = svgClone.querySelectorAll('.geartext, .guides, .firstmarker');
                    elementsToRemove.forEach(element => element.remove());
                    svgCode = svgClone.outerHTML;
                } else {
                    svgCode = svgElement.outerHTML;
                }

                const textArea = document.createElement('textarea');
                textArea.value = svgCode;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (fallbackError) {
                console.error('Fallback копирование также не удалось:', fallbackError);
                return false;
            }
        }
    }

    // Универсальная функция для создания кнопок копирования
    function createCopyButton(type = 'normal') {
        const isNormal = type === 'normal';
        const button = document.createElement('button');

        button.className = isNormal ? 'copy-svg-btn' : 'copy-clear-btn';
        button.textContent = isNormal ? 'Copy' : 'Copy Clear';
        button.title = isNormal ? 'Копировать SVG в буфер обмена' : 'Копировать SVG без текстовых элементов и направляющих';

        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            e.preventDefault();

            const container = this.containerElement;
            const svgElement = container.querySelector('svg');

            if (svgElement) {
                const success = await copySVGToClipboard(svgElement, !isNormal);
                const originalText = isNormal ? 'Copy' : 'Copy Clear';

                if (success) {
                    // Показываем успешное копирование
                    this.textContent = '✓';
                    this.classList.add('copy-success');

                    setTimeout(() => {
                        this.textContent = originalText;
                        this.classList.remove('copy-success');
                    }, 1000);
                } else {
                    // Показываем ошибку
                    this.textContent = '✗';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1000);
                }
            } else {
                console.warn('SVG элемент не найден в контейнере');
            }
        });

        return button;
    }

    // Функция для позиционирования кнопок
    function positionButtons(copyButton, copyClearButton, container) {
        const svgElement = container.querySelector('svg');
        if (svgElement) {
            const svgRect = svgElement.getBoundingClientRect();
            const buttonWidth = 52; // примерная ширина кнопки "Copy"
            const buttonClearWidth = 80; // примерная ширина кнопки "Copy Clear"
            const buttonHeight = 34; // примерная высота кнопки
            const gap = 8; // расстояние между кнопками

            // Позиционируем кнопки по центру SVG
            const totalWidth = buttonWidth + buttonClearWidth + gap;
            const startX = svgRect.left + (svgRect.width - totalWidth) / 2;
            const centerY = svgRect.top + (svgRect.height - buttonHeight) / 2;

            copyButton.style.left = startX + 'px';
            copyButton.style.top = centerY + 'px';

            copyClearButton.style.left = (startX + buttonWidth + gap) + 'px';
            copyClearButton.style.top = centerY + 'px';
        } else {
            // Fallback к контейнеру, если SVG не найден
            const rect = container.getBoundingClientRect();
            const totalWidth = 52 + 80 + 8;
            const startX = rect.left + (rect.width - totalWidth) / 2;
            const centerY = rect.top + (rect.height - 34) / 2;

            copyButton.style.left = startX + 'px';
            copyButton.style.top = centerY + 'px';

            copyClearButton.style.left = (startX + 52 + 8) + 'px';
            copyClearButton.style.top = centerY + 'px';
        }
    }

    // Универсальная функция для настройки кнопок и обработчиков для контейнера
    function setupButtonsForContainer(container) {
        container.classList.add('screen-child-container');

        // Создаем обе кнопки
        const copyButton = createCopyButton('normal');
        const copyClearButton = createCopyButton('clear');

        copyButton.containerElement = container;
        copyClearButton.containerElement = container;

        document.body.appendChild(copyButton);
        document.body.appendChild(copyClearButton);

        // Функции для показа/скрытия кнопок
        const showButtons = () => {
            positionButtons(copyButton, copyClearButton, container);
            copyButton.classList.add('visible');
            copyClearButton.classList.add('visible');
        };

        const hideButtons = () => {
            copyButton.classList.remove('visible');
            copyClearButton.classList.remove('visible');
        };

        const isMouseOnButtons = (target) => {
            return copyButton.contains(target) || copyClearButton.contains(target);
        };

        // Обработчики для контейнера
        container.addEventListener('mouseenter', showButtons);
        container.addEventListener('mouseleave', (e) => {
            if (!isMouseOnButtons(e.relatedTarget)) hideButtons();
        });

        // Обработчики для кнопок
        [copyButton, copyClearButton].forEach(button => {
            button.addEventListener('mouseenter', showButtons);
            button.addEventListener('mouseleave', (e) => {
                if (!container.contains(e.relatedTarget) && !isMouseOnButtons(e.relatedTarget)) {
                    hideButtons();
                }
            });
        });

        // Обработчик скролла
        window.addEventListener('scroll', () => {
            if (copyButton.classList.contains('visible')) {
                positionButtons(copyButton, copyClearButton, container);
            }
        });
    }

    // Добавляем обработчики событий для дочерних элементов контейнера screen
    function setupCopyButtons() {
        const screenContainer = document.getElementById('screen');

        if (!screenContainer) {
            console.warn('Контейнер с id="screen" не найден');
            return;
        }

        // Получаем все прямые дочерние элементы
        const children = Array.from(screenContainer.children);

        children.forEach(child => {
            // Проверяем, есть ли в дочернем элементе SVG
            const hasSVG = child.querySelector('svg');

            if (hasSVG) {
                // Добавляем класс для позиционирования
                child.classList.add('screen-child-container');

                setupButtonsForContainer(child);
            }
        });
    }

    // Наблюдатель за изменениями DOM для динамически добавляемых элементов
    function setupMutationObserver() {
        const screenContainer = document.getElementById('screen');

        if (!screenContainer) {
            return;
        }

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const hasSVG = node.querySelector && node.querySelector('svg');

                            if (hasSVG && !node.classList.contains('screen-child-container')) {
                                setupButtonsForContainer(node);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(screenContainer, {
            childList: true,
            subtree: true
        });
    }

    // Инициализация скрипта
    function init() {
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(init, 100);
            });
            return;
        }

        addStyles();
        setupCopyButtons();
        setupMutationObserver();

        console.log('GearGenerator SVG Copy скрипт инициализирован');
    }

    // Запускаем инициализацию
    init();

})();