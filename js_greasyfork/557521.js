// ==UserScript==
// @name         +Кнопки
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Объединяет функционал сохранения баллов и комментария + добавляет навигацию по тестированиям
// @author       wryyshee
// @match        https://edu.mipt.ru/adm/testing/*/result/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557521/%2B%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/557521/%2B%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем стили для кнопки следующего тестирования
    GM_addStyle(`
        .next-testing-btn {
            margin: 10px;
            padding: 8px 8px;
            background-color: #1ab394;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: all 0.3s ease;
        }

        .next-testing-btn:active {
            transform: translateY(0);
        }
        .next-testing-btn:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
            opacity: 0.7;
            transform: none !important;
            box-shadow: none !important;
        }
        .next-testing-btn-container {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 10px;
        }
        .btn-with-icon {
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .combined-buttons-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            gap: 10px;
        }
        .left-buttons {
            padding: 8;
            margin: 10px;
            margin-bottom: 0;
            height: 43px;
            display: flex;
            gap: 10px;
        }
        .right-buttons {
            display: flex;
            gap: 10px;
        }
    `);

    // Основная функция очистки страницы
    function cleanupPage() {
        removeOldButtons();
        removeFinalScoreField();
        removeDeleteButton();
        addCombinedButton();
        addNextTestingButton();
    }

    // Добавляем комбинированную кнопку сохранения
    function addCombinedButton() {
        // Находим контейнер формы
        const form = document.querySelector('form.form-horizontal');
        if (!form) return;

        // Находим последний .form-group.row перед комментарием
        const formGroups = document.querySelectorAll('.form-group.row');
        if (formGroups.length < 3) return;

        // Берем предпоследний .form-group.row (где были кнопки)
        const buttonGroup = formGroups[formGroups.length - 2];

        // Проверяем, не добавлена ли уже наша кнопка
        if (buttonGroup.querySelector('.combined-buttons-container')) {
            return;
        }

        // Создаем контейнер для всех кнопок
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'combined-buttons-container col-sm-12';

        // Левая часть - кнопка сохранения
        const leftButtons = document.createElement('div');
        leftButtons.className = 'left-buttons';

        // Создаем кнопку "Записать результат"
        const combinedButton = document.createElement('button');
        combinedButton.type = 'button';
        combinedButton.className = 'btn btn-success';
        combinedButton.innerHTML = '<i class="fa fa-save"></i> Записать результат';
        combinedButton.onclick = handleCombinedSave;

        leftButtons.appendChild(combinedButton);
        buttonsContainer.appendChild(leftButtons);

        // Правая часть - будет заполнена позже кнопкой следующего тестирования
        const rightButtons = document.createElement('div');
        rightButtons.className = 'right-buttons';
        rightButtons.id = 'next-testing-buttons-container';
        buttonsContainer.appendChild(rightButtons);

        // Добавляем контейнер кнопок в группу
        buttonGroup.appendChild(buttonsContainer);
    }

    // Удаляем старые кнопки
    function removeOldButtons() {
        // Удаляем старые кнопки Сохранить баллы и Добавить комментарий
        document.querySelectorAll('button[type="submit"]').forEach(button => {
            if (button.name === 'updateBalli' || button.name === 'addComment') {
                const parentCol = button.closest('div[class*="col-sm"]');
                if (parentCol) {
                    parentCol.remove();
                }
            }
        });
    }

    // Удаляем поле итоговой оценки
    function removeFinalScoreField() {
        const formRows = document.querySelectorAll('.form-group.row');
        formRows.forEach(row => {
            const label = row.querySelector('label.control-label');
            if (label && label.textContent.includes('ИТОГОВАЯ')) {
                row.remove();
                return;
            }
        });
    }

    // Удаляем кнопку удаления тестирования
    function removeDeleteButton() {
        const deleteButton = document.querySelector('button[name="deleteTestirovanie"]');
        if (!deleteButton) return;

        const deleteButtonCol = deleteButton.closest('div[class*="col-sm"]');
        if (deleteButtonCol) {
            deleteButtonCol.remove();
        }
    }

    // Обработчик сохранения
    function handleCombinedSave() {
        const button = this;
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Сохранение...';

        const csrfToken = getCsrfToken();

        saveScores(csrfToken)
            .then(() => addComment(csrfToken))
            .then(() => {
            setTimeout(() => location.reload(), 500);
        })
            .catch(() => {
            button.disabled = false;
            button.innerHTML = originalText;
            alert('Ошибка сохранения. Попробуйте еще раз.');
        });
    }

    // Сохранение баллов
    function saveScores(csrfToken) {
        return new Promise((resolve, reject) => {
            const scoresData = new FormData();
            const ballInputs = document.querySelectorAll('input.countBallPrepod');
            ballInputs.forEach(input => {
                scoresData.append(input.name, input.value || '0');
            });
            scoresData.append('updateBalli', '1');

            if (csrfToken) {
                scoresData.append('csrf_token', csrfToken);
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: window.location.href,
                data: serializeFormData(scoresData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(response) {
                    if (response.status === 200 || response.status === 302) {
                        resolve();
                    } else {
                        reject();
                    }
                },
                onerror: reject
            });
        });
    }

    // Добавление комментария
    function addComment(csrfToken) {
        return new Promise((resolve, reject) => {
            const commentData = new FormData();
            const commentTextarea = document.querySelector('textarea[name="commentDliaStudenta"]');
            if (commentTextarea) {
                commentData.append('commentDliaStudenta', commentTextarea.value || '');
            }
            commentData.append('addComment', '1');

            if (csrfToken) {
                commentData.append('csrf_token', csrfToken);
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: window.location.href,
                data: serializeFormData(commentData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(response) {
                    if (response.status === 200 || response.status === 302) {
                        resolve();
                    } else {
                        reject();
                    }
                },
                onerror: reject
            });
        });
    }

    // Функция для получения ID из текущего URL
    function getCurrentTestingId() {
        const url = window.location.href;
        const match = url.match(/\/result\/(\d+)/);
        return match ? match[1] : null;
    }

    // Получение списка всех ID тестирований
    function fetchAllTestingIds() {
        return new Promise((resolve, reject) => {
            const currentUrl = window.location.href;
            const resultUrl = currentUrl.replace(/\/result\/\d+.*/, '/result/');

            GM_xmlhttpRequest({
                method: 'GET',
                url: resultUrl,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const idLinks = doc.querySelectorAll('table tbody tr td:nth-child(2) a');
                        const ids = Array.from(idLinks)
                        .map(link => {
                            const href = link.getAttribute('href');
                            const match = href.match(/\/result\/(\d+)/);
                            return match ? match[1] : null;
                        })
                        .filter(id => id !== null);
                        resolve(ids);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    // Добавление кнопки следующего тестирования
    async function addNextTestingButton() {
        const currentId = getCurrentTestingId();
        if (!currentId) return;

        try {
            const allIds = await fetchAllTestingIds();
            if (allIds.length === 0) return;

            const currentIndex = allIds.indexOf(currentId);
            let nextId = null;
            let isLast = false;
            let remaining = 0;

            if (currentIndex === -1) {
                nextId = allIds[0];
                remaining = allIds.length;
            } else if (currentIndex < allIds.length - 1) {
                nextId = allIds[currentIndex + 1];
                remaining = allIds.length - (currentIndex + 1);
            } else {
                isLast = true;
            }

            // Находим или создаем контейнер для кнопок справа
            let rightButtons = document.querySelector('#next-testing-buttons-container');
            if (!rightButtons) {
                rightButtons = document.createElement('div');
                rightButtons.className = 'right-buttons';
                rightButtons.id = 'next-testing-buttons-container';

                // Ищем контейнер для кнопок
                const buttonsContainer = document.querySelector('.combined-buttons-container');
                if (buttonsContainer) {
                    buttonsContainer.appendChild(rightButtons);
                }
            }

            // Удаляем старую кнопку, если есть
            const oldButton = rightButtons.querySelector('.next-testing-btn');
            if (oldButton) oldButton.remove();

            // Создаем новую кнопку
            const button = document.createElement('button');
            button.className = 'next-testing-btn btn-with-icon';
            button.type = 'button';

            if (isLast) {
                button.disabled = true;
                button.title = 'Тестирований для проверки не осталось';
                button.innerHTML = '<i class="fa fa-check"></i> Тестирований не осталось';
                button.style.backgroundColor = '#95a5a6';
            } else {
                button.addEventListener('click', function() {
                    if (nextId) {
                        const newUrl = window.location.href.replace(
                            /\/result\/\d+/,
                            `/result/${nextId}`
                        );
                        window.location.href = newUrl;
                    }
                });
                button.title = `Осталось тестирований: ${remaining}`;
                button.innerHTML = `<i class="fa fa-arrow-right"></i> Следующее тестирование`;
            }

            rightButtons.appendChild(button);

        } catch (error) {
            console.error('Ошибка при добавлении кнопки:', error);

            // Показываем кнопку с ошибкой
            const rightButtons = document.querySelector('#next-testing-buttons-container') ||
                  document.querySelector('.right-buttons');
            if (rightButtons) {
                const errorButton = document.createElement('button');
                errorButton.className = 'next-testing-btn btn-with-icon';
                errorButton.disabled = true;
                errorButton.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Ошибка';
                errorButton.title = 'Не удалось загрузить список тестирований';
                errorButton.style.backgroundColor = '#ed5565';
                rightButtons.appendChild(errorButton);
            }
        }
    }

    // Вспомогательные функции
    function getCsrfToken() {
        const tokenInput = document.querySelector('input[name="csrf_token"], input[name="_token"]');
        return tokenInput ? tokenInput.value : null;
    }

    function serializeFormData(formData) {
        const pairs = [];
        for (const [key, value] of formData.entries()) {
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
        return pairs.join('&');
    }

    // Инициализация
    function init() {
        // Сначала очищаем страницу и добавляем наши кнопки
        cleanupPage();

        // Затем добавляем кнопку следующего тестирования (она может загружаться дольше)
        setTimeout(() => {
            addNextTestingButton();
        }, 1500);
    }

    // Запускаем при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();