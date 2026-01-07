// ==UserScript==
// @name         Постоянные заметки с дополнительной информацией
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Отображает заметки и позволяет добавлять свои на любом сайте
// @author       Вы
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561712/%D0%9F%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%BC%D0%B5%D1%82%D0%BA%D0%B8%20%D1%81%20%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/561712/%D0%9F%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B7%D0%B0%D0%BC%D0%B5%D1%82%D0%BA%D0%B8%20%D1%81%20%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%B5%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Генерация случайного номера (сохраняется для сессии)
    let randomNumber = GM_getValue('generated_random_number');
    if (!randomNumber) {
        randomNumber = Math.floor(Math.random() * 90000 + 10000);
        GM_setValue('generated_random_number', randomNumber);
    }

    // Константы с вашими заметками
    const FIXED_NOTES = `253177049 RN
431${randomNumber} AN
-------------------
Заметка сохраняется
до перезагрузки
браузера`;

    // Получаем сохраненные пользовательские заметки
    const USER_NOTES = GM_getValue('user_custom_notes', 'Введите здесь вашу информацию...\n\nМожно писать много текста,\nон будет сохраняться\nмежду сессиями.');

    // Стили для увеличенного окна заметок
    GM_addStyle(`
        /* Основное окно */
        #fixed-notes-container {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 350px;
            min-height: 200px;
            background: white;
            border: 2px solid #2196F3;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
            z-index: 999999;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 15px;
            overflow: hidden;
        }

        /* Окно пользовательских заметок */
        #user-notes-container {
            position: fixed;
            top: 400px;
            right: 20px;
            width: 350px;
            height: 400px;
            background: white;
            border: 2px solid #9C27B0;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);
            z-index: 999998;
            font-family: 'Segoe UI', Arial, sans-serif;
            overflow: hidden;
            display: none;
        }

        #fixed-notes-header, #user-notes-header {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 14px 18px;
            border-radius: 10px 10px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        #user-notes-header {
            background: linear-gradient(135deg, #9C27B0, #7B1FA2);
        }

        #fixed-notes-content, #user-notes-content {
            padding: 18px;
            max-height: 400px;
            overflow-y: auto;
            background: #f8fafc;
            line-height: 1.6;
            min-height: 150px;
        }

        #user-notes-content {
            padding: 15px;
            height: calc(100% - 130px);
        }

        .fixed-notes-text {
            background: #e8f4fe;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2196F3;
            margin: 10px 0;
            font-family: 'Consolas', 'Monaco', monospace;
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 16px;
            color: #1a237e;
        }

        #user-notes-textarea {
            width: 100%;
            height: 100%;
            min-height: 300px;
            padding: 12px;
            border: 1px solid #e1bee7;
            border-radius: 8px;
            background: #f9f0ff;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 13px;
            line-height: 1.5;
            resize: none;
            color: #4a148c;
            box-sizing: border-box;
        }

        #user-notes-textarea:focus {
            outline: none;
            border-color: #9C27B0;
            box-shadow: 0 0 0 2px rgba(156, 39, 176, 0.2);
        }

        .fixed-notes-controls {
            display: flex;
            gap: 10px;
            padding: 15px 18px;
            background: #f1f8ff;
            border-top: 1px solid #e1f5fe;
        }

        .user-notes-controls {
            display: flex;
            gap: 10px;
            padding: 15px 18px;
            background: #f3e5f5;
            border-top: 1px solid #e1bee7;
        }

        .fixed-notes-btn, .user-notes-btn {
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            flex-grow: 1;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 14px;
        }

        .fixed-notes-refresh {
            background: linear-gradient(to right, #4CAF50, #45a049);
            color: white;
        }

        .fixed-notes-refresh:hover {
            background: linear-gradient(to right, #45a049, #3d8b40);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
        }

        .fixed-notes-custom {
            background: linear-gradient(to right, #9C27B0, #7B1FA2);
            color: white;
        }

        .fixed-notes-custom:hover {
            background: linear-gradient(to right, #7B1FA2, #6A1B9A);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(156, 39, 176, 0.3);
        }

        .fixed-notes-hide {
            background: linear-gradient(to right, #ff9800, #f57c00);
            color: white;
        }

        .fixed-notes-hide:hover {
            background: linear-gradient(to right, #f57c00, #e65100);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(255, 152, 0, 0.3);
        }

        .fixed-notes-close {
            background: linear-gradient(to right, #f44336, #d32f2f);
            color: white;
        }

        .fixed-notes-close:hover {
            background: linear-gradient(to right, #d32f2f, #b71c1c);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(244, 67, 54, 0.3);
        }

        .user-notes-save {
            background: linear-gradient(to right, #009688, #00796B);
            color: white;
        }

        .user-notes-save:hover {
            background: linear-gradient(to right, #00796B, #00695C);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(0, 150, 136, 0.3);
        }

        .user-notes-close {
            background: linear-gradient(to right, #9C27B0, #7B1FA2);
            color: white;
        }

        .user-notes-close:hover {
            background: linear-gradient(to right, #7B1FA2, #6A1B9A);
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(156, 39, 176, 0.3);
        }

        .fixed-notes-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 999998;
            font-size: 28px;
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .custom-notes-toggle {
            position: fixed;
            top: 90px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #9C27B0, #7B1FA2);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 999997;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            display: none;
        }

        .fixed-notes-toggle:hover, .custom-notes-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 15px rgba(33, 150, 243, 0.6);
        }

        .custom-notes-toggle:hover {
            box-shadow: 0 6px 15px rgba(156, 39, 176, 0.6);
        }

        #fixed-notes-minimize, #user-notes-minimize {
            cursor: pointer;
            font-size: 20px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
        }

        #fixed-notes-minimize:hover, #user-notes-minimize:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .fixed-notes-info, .user-notes-info {
            font-size: 12px;
            color: #666;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px dashed #ddd;
            text-align: center;
        }

        .user-notes-info {
            font-size: 11px;
            margin-top: 10px;
            padding-top: 8px;
            color: #7B1FA2;
        }

        /* Стиль для выделенных цифр */
        .highlight-number {
            background: linear-gradient(135deg, #fff176, #ffd54f);
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            color: #5d4037;
            border: 1px solid #ffb300;
        }

        /* Счетчик символов */
        .char-counter {
            font-size: 11px;
            color: #666;
            text-align: right;
            margin-top: 5px;
        }

        .char-counter.warning {
            color: #ff9800;
            font-weight: bold;
        }

        .char-counter.error {
            color: #f44336;
            font-weight: bold;
        }
    `);

    // Создание кнопки для переключения видимости основного окна
    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'fixed-notes-toggle-btn';
        toggleBtn.innerHTML = '📋';
        toggleBtn.title = 'Показать/скрыть заметки';
        toggleBtn.className = 'fixed-notes-toggle';
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            const container = document.getElementById('fixed-notes-container');
            if (container.style.display === 'none') {
                container.style.display = 'block';
                toggleBtn.innerHTML = '📋';
                toggleBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            } else {
                container.style.display = 'none';
                toggleBtn.innerHTML = '📝';
                toggleBtn.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
            }
        });

        // Изначально показываем окно
        setTimeout(() => toggleBtn.click(), 100);
    }

    // Создание кнопки для переключения пользовательских заметок
    function createCustomToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'custom-notes-toggle-btn';
        toggleBtn.innerHTML = '📝';
        toggleBtn.title = 'Показать/скрыть пользовательские заметки';
        toggleBtn.className = 'custom-notes-toggle';
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            const container = document.getElementById('user-notes-container');
            if (container.style.display === 'none') {
                container.style.display = 'block';
                toggleBtn.innerHTML = '📘';
                toggleBtn.style.background = 'linear-gradient(135deg, #673AB7, #512DA8)';
            } else {
                container.style.display = 'none';
                toggleBtn.innerHTML = '📝';
                toggleBtn.style.background = 'linear-gradient(135deg, #9C27B0, #7B1FA2)';
            }
        });
    }

    // Создание основного окна заметок
    function createNotesWindow() {
        const container = document.createElement('div');
        container.id = 'fixed-notes-container';

        container.innerHTML = `
            <div id="fixed-notes-header">
                <span>📌 Мои заметки</span>
                <span id="fixed-notes-minimize" title="Свернуть">−</span>
            </div>
            <div id="fixed-notes-content">
                <div class="fixed-notes-text">
${FIXED_NOTES}
                </div>
                <div class="fixed-notes-info">
                    Окно можно перемещать и сворачивать<br>
                    Данные обновятся после перезагрузки
                </div>
            </div>
            <div class="fixed-notes-controls">
                <button id="fixed-notes-refresh-btn" class="fixed-notes-btn fixed-notes-refresh" title="Сгенерировать новый номер">
                    🔄 Новый номер
                </button>
                <button id="fixed-notes-custom-btn" class="fixed-notes-btn fixed-notes-custom" title="Открыть окно для своих заметок">
                    📝 Мои заметки
                </button>
                <button id="fixed-notes-hide-btn" class="fixed-notes-btn fixed-notes-hide" title="Скрыть окно">
                    👁 Скрыть
                </button>
            </div>
        `;

        document.body.appendChild(container);

        // Функционал перетаскивания
        makeDraggable(container, 'fixed-notes-header');

        // Обработчики событий
        document.getElementById('fixed-notes-refresh-btn').addEventListener('click', generateNewNumber);
        document.getElementById('fixed-notes-custom-btn').addEventListener('click', showCustomNotes);
        document.getElementById('fixed-notes-hide-btn').addEventListener('click', () => {
            document.getElementById('fixed-notes-toggle-btn').click();
        });

        document.getElementById('fixed-notes-minimize').addEventListener('click', () => {
            const content = document.getElementById('fixed-notes-content');
            const controls = document.querySelector('.fixed-notes-controls');
            const isHidden = content.style.display === 'none';

            content.style.display = isHidden ? 'block' : 'none';
            controls.style.display = isHidden ? 'flex' : 'none';
            document.getElementById('fixed-notes-minimize').innerHTML = isHidden ? '−' : '+';
            document.getElementById('fixed-notes-minimize').title = isHidden ? 'Свернуть' : 'Развернуть';
        });

        // Добавляем подсветку цифр
        highlightNumbers();
    }

    // Создание окна пользовательских заметок
    function createUserNotesWindow() {
        const container = document.createElement('div');
        container.id = 'user-notes-container';

        container.innerHTML = `
            <div id="user-notes-header">
                <span>📝 Мои пользовательские заметки</span>
                <span id="user-notes-minimize" title="Свернуть">−</span>
            </div>
            <div id="user-notes-content">
                <textarea id="user-notes-textarea" placeholder="Введите вашу информацию здесь...">${USER_NOTES}</textarea>
                <div class="char-counter" id="char-counter">Символов: 0</div>
                <div class="user-notes-info">
                    Текст сохраняется автоматически при закрытии<br>
                    Можно писать много текста
                </div>
            </div>
            <div class="user-notes-controls">
                <button id="user-notes-save-btn" class="user-notes-btn user-notes-save" title="Сохранить заметки">
                    💾 Сохранить
                </button>
                <button id="user-notes-close-btn" class="user-notes-btn user-notes-close" title="Закрыть окно">
                    ✕ Закрыть
                </button>
            </div>
        `;

        document.body.appendChild(container);

        // Функционал перетаскивания
        makeDraggable(container, 'user-notes-header');

        // Обработчики событий
        const textarea = document.getElementById('user-notes-textarea');
        const charCounter = document.getElementById('char-counter');

        // Обновляем счетчик символов
        function updateCharCounter() {
            const length = textarea.value.length;
            charCounter.textContent = `Символов: ${length}`;

            // Изменяем цвет при большом количестве символов
            if (length > 2000) {
                charCounter.className = 'char-counter error';
            } else if (length > 1000) {
                charCounter.className = 'char-counter warning';
            } else {
                charCounter.className = 'char-counter';
            }
        }

        textarea.addEventListener('input', updateCharCounter);
        updateCharCounter(); // Инициализируем счетчик

        // Сохранение заметок
        document.getElementById('user-notes-save-btn').addEventListener('click', saveUserNotes);

        // Автосохранение при закрытии
        document.getElementById('user-notes-close-btn').addEventListener('click', () => {
            saveUserNotes();
            container.style.display = 'none';
            document.getElementById('custom-notes-toggle-btn').innerHTML = '📝';
            document.getElementById('custom-notes-toggle-btn').style.background = 'linear-gradient(135deg, #9C27B0, #7B1FA2)';
        });

        document.getElementById('user-notes-minimize').addEventListener('click', () => {
            const content = document.getElementById('user-notes-content');
            const controls = document.querySelector('.user-notes-controls');
            const isHidden = content.style.display === 'none';

            content.style.display = isHidden ? 'block' : 'none';
            controls.style.display = isHidden ? 'flex' : 'none';
            document.getElementById('user-notes-minimize').innerHTML = isHidden ? '−' : '+';
            document.getElementById('user-notes-minimize').title = isHidden ? 'Свернуть' : 'Развернуть';
        });

        // Показываем кнопку переключения пользовательских заметок
        document.getElementById('custom-notes-toggle-btn').style.display = 'flex';
    }

    // Функция для подсветки цифр
    function highlightNumbers() {
        const content = document.getElementById('fixed-notes-content');
        const html = content.innerHTML;

        // Подсвечиваем все числа из 9 цифр
        content.innerHTML = html.replace(/(\d{9})/g, '<span class="highlight-number">$1</span>');
    }

    // Функция для генерации нового номера
    function generateNewNumber() {
        const newNumber = Math.floor(Math.random() * 90000 + 10000);
        GM_setValue('generated_random_number', newNumber);

        // Обновляем текст в окне
        const updatedNotes = `253177049 RN
431${newNumber} AN
-------------------
Заметка сохраняется
до перезагрузки
браузера`;

        document.querySelector('.fixed-notes-text').textContent = updatedNotes;

        // Визуальная обратная связь
        const btn = document.getElementById('fixed-notes-refresh-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Обновлено!';
        btn.style.background = 'linear-gradient(to right, #00bcd4, #0097a7)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'linear-gradient(to right, #4CAF50, #45a049)';
        }, 1500);
    }

    // Функция для показа пользовательских заметок
    function showCustomNotes() {
        const container = document.getElementById('user-notes-container');
        container.style.display = 'block';
        document.getElementById('custom-notes-toggle-btn').click();

        // Фокус на текстовое поле
        setTimeout(() => {
            document.getElementById('user-notes-textarea').focus();
        }, 100);
    }

    // Функция для сохранения пользовательских заметок
    function saveUserNotes() {
        const textarea = document.getElementById('user-notes-textarea');
        GM_setValue('user_custom_notes', textarea.value);

        // Визуальная обратная связь
        const btn = document.getElementById('user-notes-save-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Сохранено!';
        btn.style.background = 'linear-gradient(to right, #4CAF50, #45a049)';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'linear-gradient(to right, #009688, #00796B)';
        }, 1500);
    }

    // Функция для перетаскивания окна
    function makeDraggable(element, headerId) {
        const header = document.getElementById(headerId);
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            // Игнорируем клики по кнопке сворачивания
            if (e.target.id === headerId.replace('header', 'minimize')) return;

            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
            isDragging = true;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);

            // Визуальная обратная связь
            header.style.opacity = '0.9';
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Ограничение перемещения по экрану
                currentX = Math.max(10, Math.min(currentX, window.innerWidth - element.offsetWidth - 10));
                currentY = Math.max(10, Math.min(currentY, window.innerHeight - element.offsetHeight - 10));

                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
                element.style.right = 'auto';
            }
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);

            // Возвращаем нормальную прозрачность
            header.style.opacity = '1';
        }
    }

    // Инициализация
    setTimeout(() => {
        createNotesWindow();
        createToggleButton();
        createCustomToggleButton();
        createUserNotesWindow();
    }, 1000);
})();