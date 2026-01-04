// ==UserScript==
// @name         Регулятор размера шрифта для SCP Foundation
// @namespace    http://tampermonkey.net/
// @license MI
// @version      1.0
// @description  Добавляет регулятор размера шрифта для #page-content на scpfoundation.net
// @author       Sivka
// @match        *://scpfoundation.net/*
// @match        *://www.scpfoundation.net/*
// @icon         https://www.google.com/s2/favicons?domain=scpfoundation.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559625/%D0%A0%D0%B5%D0%B3%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B0%20%D1%88%D1%80%D0%B8%D1%84%D1%82%D0%B0%20%D0%B4%D0%BB%D1%8F%20SCP%20Foundation.user.js
// @updateURL https://update.greasyfork.org/scripts/559625/%D0%A0%D0%B5%D0%B3%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B0%20%D1%88%D1%80%D0%B8%D1%84%D1%82%D0%B0%20%D0%B4%D0%BB%D1%8F%20SCP%20Foundation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ждём полной загрузки страницы, чтобы элементы были доступны
    window.addEventListener('load', function() {

        // Функция для создания элемента управления
        function createFontSizeControl() {
            // Находим контейнер, куда будем добавлять регулятор
            // Обычно это #page-content или рядом стоящий элемент
            let pageContent = document.querySelector("#page-content") || document.querySelector("#content");
            if (!pageContent) return;


            // Создаём контейнер для всех элементов управления
            const controlContainer = document.createElement("div");
            controlContainer.id = "font-size-control-container";
            controlContainer.style.cssText = `
                position: sticky;
                top: 10px;
                background: rgba(158, 158, 158, 0.9);
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 15px;
                wight:720px;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-self: center;
                gap: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                font-family: Arial, sans-serif;
                font-size: 14px;
            `;

            // Создаём заголовок
            const title = document.createElement("span");
            title.textContent = "Размер шрифта:";
            title.style.fontWeight = "bold";

            // Создаём кнопку для уменьшения значения (-)
            const decreaseBtn = document.createElement("button");
            decreaseBtn.textContent = "−"; // Знак минуса
            decreaseBtn.style.cssText = `
                width: 30px;
                height: 30px;
                font-size: 18px;
                border: 1px solid #ccc;
                border-radius: 3px;
                background: #f5f5f5;
                cursor: pointer;
            `;
            decreaseBtn.title = "Уменьшить размер шрифта";

            // Создаём поле ввода для числового значения
            const inputField = document.createElement("input");
            inputField.type = "number";
            inputField.id = "font-size-input";
            inputField.min = "10";
            inputField.max = "30";
            inputField.value = "16";
            inputField.style.cssText = `
                width: 60px;
                height: 30px;
                text-align: center;
                border: 1px solid #ccc;
                border-radius: 3px;
                font-size: 16px;
                padding: 0 5px;
            `;
            inputField.title = "Размер шрифта в пикселях (10-30)";

            // Создаём кнопку для увеличения значения (+)
            const increaseBtn = document.createElement("button");
            increaseBtn.textContent = "+";
            increaseBtn.style.cssText = `
                width: 30px;
                height: 30px;
                font-size: 18px;
                border: 1px solid #ccc;
                border-radius: 3px;
                background: #f5f5f5;
                cursor: pointer;
            `;
            increaseBtn.title = "Увеличить размер шрифта";

            // Создаём выпадающий список с размерами
            const selectLabel = document.createElement("span");
            selectLabel.textContent = "Предустановки:";
            selectLabel.style.marginLeft = "10px";

            const selectBox = document.createElement("select");
            selectBox.id = "font-preset-select";
            selectBox.style.cssText = `
                height: 30px;
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 0 5px;
                background: white;
                cursor: pointer;
            `;
            selectBox.title = "Выберите предустановленный размер шрифта";

            // Добавляем варианты в выпадающий список
            const presets = [
                { value: "xx-small", text: "Очень-очень маленький" },
                { value: "x-small", text: "Очень маленький" },
                { value: "small", text: "Маленький" },
                { value: "medium", text: "Средний" },
                { value: "large", text: "Большой" },
                { value: "x-large", text: "Очень большой" },
                { value: "xx-large", text: "Очень-очень большой" }
            ];

            presets.forEach(preset => {
                const option = document.createElement("option");
                option.value = preset.value;
                option.text = preset.text;
                selectBox.appendChild(option);
            });

            // Добавляем кнопку сброса
            const resetBtn = document.createElement("button");
            resetBtn.textContent = "Сброс";
            resetBtn.style.cssText = `
                height: 30px;
                padding: 0 15px;
                border: 1px solid #ccc;
                border-radius: 3px;
                background: #f5f5f5;
                cursor: pointer;
                margin-left: 10px;
            `;
            resetBtn.title = "Сбросить размер шрифта к стандартному";

            // Собираем все элементы в контейнер
            controlContainer.appendChild(title);
            controlContainer.appendChild(decreaseBtn);
            controlContainer.appendChild(inputField);
            controlContainer.appendChild(increaseBtn);
            controlContainer.appendChild(selectLabel);
            controlContainer.appendChild(selectBox);
            controlContainer.appendChild(resetBtn);

            // Вставляем контейнер управления перед #page-content
            pageContent.parentNode.insertBefore(controlContainer, pageContent);

            // Функция для изменения размера шрифта
            function changeFontSize(size) {
                // Применяем размер шрифта к #page-content и всем его дочерним элементам
                pageContent.classList.add('custom-font-size');
                document.documentElement.style.setProperty('--font-size-small', size);
                pageContent.style.fontSize = size;

                // Сохраняем выбранный размер в локальное хранилище браузера
                localStorage.setItem('scpFontSize', size);
            }

            // Функция для установки размера шрифта из поля ввода
            function setFontSizeFromInput() {
                let size = parseInt(inputField.value);

                // Проверяем, что значение в допустимых пределах
                if (size < 10) size = 10;
                if (size > 30) size = 30;

                inputField.value = size;
                changeFontSize(size + 'px');

                // Сбрасываем выпадающий список при ручном вводе
                selectBox.value = "";
            }

            // Функция для установки предустановленного размера
            function setPresetFontSize() {
                const presetValue = selectBox.value;
                if (presetValue) {
                    changeFontSize(presetValue);
                    // Очищаем поле ввода при выборе предустановки
                    inputField.value = "";
                }
            }

            // Функция для сброса размера шрифта
            function resetFontSize() {
                inputField.value = "16";
                selectBox.value = "";
                changeFontSize(""); // Сбрасываем к стандартному размеру
                localStorage.removeItem('scpFontSize');
            }

            // Добавляем обработчики событий

            // Кнопка уменьшения
            decreaseBtn.addEventListener('click', function() {
                let currentSize = parseInt(inputField.value) || 16;
                if (currentSize > 10) {
                    inputField.value = currentSize - 1;
                    setFontSizeFromInput();
                }
            });

            // Кнопка увеличения
            increaseBtn.addEventListener('click', function() {
                let currentSize = parseInt(inputField.value) || 16;
                if (currentSize < 30) {
                    inputField.value = currentSize + 1;
                    setFontSizeFromInput();
                }
            });

            // Поле ввода
            inputField.addEventListener('change', setFontSizeFromInput);
            inputField.addEventListener('input', setFontSizeFromInput);

            // Выпадающий список
            selectBox.addEventListener('change', setPresetFontSize);

            // Кнопка сброса
            resetBtn.addEventListener('click', resetFontSize);

            // Восстанавливаем сохранённый размер шрифта при загрузке
            const savedSize = localStorage.getItem('scpFontSize');
            if (savedSize) {
                if (savedSize.includes('px')) {
                    // Если сохранён размер в пикселях
                    const pixelValue = parseInt(savedSize);
                    inputField.value = pixelValue;
                    changeFontSize(savedSize);
                } else {
                    // Если сохранён предустановленный размер
                    selectBox.value = savedSize;
                    changeFontSize(savedSize);
                }
            }
        }

        // Запускаем создание элемента управления
        // Добавляем небольшую задержку для гарантии загрузки DOM
        setTimeout(createFontSizeControl, 2000);
    });

})();