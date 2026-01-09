// ==UserScript==
// @name         Smart Notes Pro
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Умные заметки с настраиваемыми генераторами
// @author       Вы
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561712/Smart%20Notes%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/561712/Smart%20Notes%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Загрузка сохраненных данных
    let savedData = GM_getValue('smart_notes_data');
    let userRN = GM_getValue('user_rn');
    let userANTemplate = GM_getValue('user_an_template');

    // Если это первый запуск или нет данных - запрашиваем у пользователя
    if (!userRN || !userANTemplate || !savedData) {
        setupFirstRun();
        return; // Прерываем выполнение, setupFirstRun сам перезагрузит скрипт
    }

    // Инициализация сохраненных значений
    if (!savedData) {
        savedData = {
            an: generateANFromTemplate(userANTemplate),
            email: generateRandomEmail(16),
            password: generateRandomPassword(8),
            phone: generateUSAPhoneNumber()
        };
        GM_setValue('smart_notes_data', savedData);
    }

    // Получаем сохраненные пользовательские заметки
    const USER_NOTES = GM_getValue('user_smart_notes', 'Ваши заметки здесь...\nСохраняются автоматически.');

    // Функция для первого запуска - запрос RN и шаблона AN
    function setupFirstRun() {
        // Создаем стили для модального окна
        GM_addStyle(`
            #setup-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 1000000;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'SF Pro Text', -apple-system, sans-serif;
            }

            .setup-container {
                background: white;
                padding: 30px;
                border-radius: 12px;
                width: 400px;
                max-width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .setup-title {
                font-size: 20px;
                font-weight: 600;
                color: #1976D2;
                margin-bottom: 20px;
                text-align: center;
            }

            .setup-input-group {
                margin-bottom: 20px;
            }

            .setup-label {
                display: block;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 8px;
                color: #333;
            }

            .setup-input {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 14px;
                font-family: 'SF Mono', Monaco, monospace;
                box-sizing: border-box;
            }

            .setup-input:focus {
                outline: none;
                border-color: #2196F3;
                box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
            }

            .setup-info {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
            }

            .setup-example {
                background: #f5f5f5;
                padding: 8px 12px;
                border-radius: 4px;
                font-family: 'SF Mono', Monaco, monospace;
                font-size: 13px;
                margin: 5px 0;
                border: 1px solid #e0e0e0;
            }

            .setup-button {
                width: 100%;
                padding: 12px;
                background: linear-gradient(to right, #4CAF50, #45a049);
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                margin-top: 10px;
            }

            .setup-button:hover {
                background: linear-gradient(to right, #45a049, #388E3C);
                transform: translateY(-1px);
            }
        `);

        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.id = 'setup-modal';
        modal.innerHTML = `
            <div class="setup-container">
                <div class="setup-title">🚀 Настройка Smart Notes</div>

                <div class="setup-input-group">
                    <label class="setup-label">Введите RN (9 цифр):</label>
                    <input type="text" id="rn-input" class="setup-input" placeholder="253177049" maxlength="9">
                    <div class="setup-info">RN не изменяется, это фиксированный номер</div>
                    <div class="setup-example">Пример: 253177049</div>
                </div>

                <div class="setup-input-group">
                    <label class="setup-label">Введите шаблон для AN:</label>
                    <input type="text" id="an-input" class="setup-input" placeholder="448XXXXX" maxlength="8">
                    <div class="setup-info">Первые цифры - фиксированные, X - случайные цифры</div>
                    <div class="setup-example">Пример: 448XXXXX (8 цифр: 448 + 5 случайных)</div>
                    <div class="setup-example">Пример: 44XXXXXX (8 цифр: 44 + 6 случайных)</div>
                </div>

                <button id="save-setup" class="setup-button">💾 Сохранить и продолжить</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Фокус на первом поле
        setTimeout(() => {
            document.getElementById('rn-input').focus();
        }, 100);

        // Обработчик сохранения
        document.getElementById('save-setup').addEventListener('click', function() {
            const rnInput = document.getElementById('rn-input').value.trim();
            const anInput = document.getElementById('an-input').value.trim();

            // Проверка RN
            if (!/^\d{9}$/.test(rnInput)) {
                alert('❌ RN должен содержать ровно 9 цифр!');
                document.getElementById('rn-input').focus();
                return;
            }

            // Проверка шаблона AN
            if (!/^\d{1,7}X{1,7}$/.test(anInput) || anInput.length !== 8) {
                alert('❌ Шаблон AN должен содержать 8 символов: цифры и буквы X\nПример: 448XXXXX');
                document.getElementById('an-input').focus();
                return;
            }

            // Сохраняем данные
            GM_setValue('user_rn', rnInput);
            GM_setValue('user_an_template', anInput);

            // Создаем начальные данные
            const initialData = {
                an: generateANFromTemplate(anInput),
                email: generateRandomEmail(16),
                password: generateRandomPassword(8),
                phone: generateUSAPhoneNumber()
            };
            GM_setValue('smart_notes_data', initialData);

            // Удаляем модальное окно
            modal.remove();

            // Перезагружаем страницу для применения настроек
            showNotification('✅ Настройки сохранены! Перезагружаем...');
            setTimeout(() => {
                location.reload();
            }, 1000);
        });

        // Поддержка Enter для сохранения
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('save-setup').click();
            }
        });
    }

    // Генерация AN по шаблону
    function generateANFromTemplate(template) {
        let result = '';
        for (let char of template) {
            if (char === 'X') {
                result += Math.floor(Math.random() * 10);
            } else {
                result += char;
            }
        }
        return result;
    }

    // Функция для генерации случайных цифр
    function generateRandomDigits(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    // Функция для генерации случайных букв
    function generateRandomLetters(length, uppercase = false) {
        let result = '';
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < length; i++) {
            let char = chars.charAt(Math.floor(Math.random() * chars.length));
            result += uppercase ? char.toUpperCase() : char;
        }
        return result;
    }

    // Генерация случайной почты
    function generateRandomEmail(length = 16) {
        const prefix = generateRandomLetters(length - 10) + generateRandomDigits(3);
        return prefix.toLowerCase() + '@yahoo.com';
    }

    // Генерация случайного пароля
    function generateRandomPassword(length = 8) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const specials = '!@#$%^&*';

        // Гарантируем хотя бы одну цифру, одну заглавную букву и один спецсимвол
        let password = '';
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length)); // Заглавная буква
        password += digits.charAt(Math.floor(Math.random() * digits.length)); // Цифра
        password += specials.charAt(Math.floor(Math.random() * specials.length)); // Спецсимвол

        // Заполняем оставшиеся символы
        const allChars = lowercase + uppercase + digits + specials;
        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Перемешиваем символы
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    // Генерация USA номера телефона (10 цифр без форматирования)
    function generateUSAPhoneNumber() {
        return generateRandomDigits(10);
    }

    // Функция копирования в буфер обмена
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('✅ Скопировано: ' + (text.length > 20 ? text.substring(0, 20) + '...' : text));
        }).catch(err => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('✅ Скопировано');
        });
    }

    // Функция обновления генератора
    function refreshGenerator(type) {
        let newValue;

        switch(type) {
            case 'an':
                newValue = generateANFromTemplate(userANTemplate);
                savedData.an = newValue;
                break;
            case 'email':
                newValue = generateRandomEmail(16);
                savedData.email = newValue;
                break;
            case 'password':
                newValue = generateRandomPassword(8);
                savedData.password = newValue;
                break;
            case 'phone':
                newValue = generateUSAPhoneNumber();
                savedData.phone = newValue;
                break;
        }

        // Обновляем отображение
        const valueElement = document.querySelector(`.generator-value.${type}`);
        const row = valueElement.closest('.generator-row');
        const copyBtn = row.querySelector('.gen-copy');

        valueElement.textContent = newValue;
        valueElement.onclick = () => copyToClipboard(newValue);
        copyBtn.onclick = () => copyToClipboard(newValue);

        // Сохраняем
        GM_setValue('smart_notes_data', savedData);

        showNotification(`🔄 Обновлен ${type}: ${newValue}`);
    }

    // Стили для основного окна
    GM_addStyle(`
        #smart-notes-btn {
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
            z-index: 999999;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        #smart-notes-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 15px rgba(33, 150, 243, 0.6);
        }

        #smart-notes-window {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 380px;
            background: white;
            border: 2px solid #2196F3;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
            z-index: 999998;
            font-family: 'SF Pro Text', -apple-system, sans-serif;
            display: none;
            overflow: hidden;
        }

        #notes-header {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 16px 20px;
            border-radius: 10px 10px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        #notes-content {
            padding: 20px;
            max-height: 500px;
            overflow-y: auto;
            background: #f8fafc;
        }

        .generators-section {
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #1976D2;
            margin: 20px 0 10px 0;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .section-title:first-child {
            margin-top: 0;
        }

        .generator-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
            background: white;
            border: 1px solid #e0e0e0;
        }

        .generator-label {
            font-weight: 600;
            font-size: 13px;
            min-width: 80px;
        }

        .generator-value {
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 13px;
            flex: 1;
            margin: 0 10px;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            word-break: break-all;
            user-select: all;
            border: 1px solid transparent;
        }

        .generator-value:hover {
            transform: scale(1.02);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .generator-value.rn {
            background: linear-gradient(135deg, #fff9c4, #fff176);
            color: #5d4037;
            border-color: #ffd54f;
        }

        .generator-value.an {
            background: linear-gradient(135deg, #e1bee7, #ce93d8);
            color: #4a148c;
            border-color: #ba68c8;
        }

        .generator-value.email {
            background: linear-gradient(135deg, #b3e5fc, #81d4fa);
            color: #01579b;
            border-color: #4fc3f7;
        }

        .generator-value.password {
            background: linear-gradient(135deg, #c8e6c9, #a5d6a7);
            color: #1b5e20;
            border-color: #81c784;
        }

        .generator-value.phone {
            background: linear-gradient(135deg, #ffccbc, #ffab91);
            color: #bf360c;
            border-color: #ff8a65;
        }

        .generator-buttons {
            display: flex;
            gap: 5px;
            min-width: 70px;
        }

        .gen-btn {
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 32px;
        }

        .gen-refresh {
            background: #4CAF50;
            color: white;
        }

        .gen-refresh:hover {
            background: #388E3C;
            transform: scale(1.1);
        }

        .gen-copy {
            background: #2196F3;
            color: white;
        }

        .gen-copy:hover {
            background: #1976D2;
            transform: scale(1.1);
        }

        .user-notes-section {
            margin-top: 20px;
        }

        #user-notes-textarea {
            width: 100%;
            min-height: 100px;
            padding: 12px;
            border: 1px solid #bbdefb;
            border-radius: 8px;
            background: white;
            font-family: 'SF Pro Text', -apple-system, sans-serif;
            font-size: 13px;
            line-height: 1.4;
            resize: vertical;
            color: #333;
            box-sizing: border-box;
            margin-bottom: 12px;
        }

        #user-notes-textarea:focus {
            outline: none;
            border-color: #2196F3;
            box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
        }

        .notes-controls {
            display: flex;
            gap: 8px;
            padding: 15px 20px;
            background: #f1f8ff;
            border-top: 1px solid #e3f2fd;
        }

        .notes-btn {
            padding: 10px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            flex: 1;
            font-weight: 500;
            font-size: 12px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }

        .notes-refresh-all {
            background: linear-gradient(to right, #FF9800, #F57C00);
            color: white;
        }

        .notes-refresh-all:hover {
            background: linear-gradient(to right, #F57C00, #E65100);
            transform: translateY(-1px);
        }

        .notes-save {
            background: linear-gradient(to right, #4CAF50, #45a049);
            color: white;
        }

        .notes-save:hover {
            background: linear-gradient(to right, #45a049, #388E3C);
            transform: translateY(-1px);
        }

        .notes-close {
            background: linear-gradient(to right, #9E9E9E, #757575);
            color: white;
        }

        .notes-close:hover {
            background: linear-gradient(to right, #757575, #616161);
            transform: translateY(-1px);
        }

        .notes-info {
            font-size: 11px;
            color: #666;
            text-align: center;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #ddd;
        }

        .template-info {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
            font-style: italic;
        }
    `);

    // Создаем кнопку
    function createButton() {
        const button = document.createElement('button');
        button.id = 'smart-notes-btn';
        button.innerHTML = '📝';
        button.title = 'Smart Notes - Генераторы данных';

        button.addEventListener('click', toggleNotesWindow);
        document.body.appendChild(button);
    }

    // Создаем окно заметок
    function createNotesWindow() {
        const windowElement = document.createElement('div');
        windowElement.id = 'smart-notes-window';

        windowElement.innerHTML = `
            <div id="notes-header">
                <span>🚀 Smart Notes</span>
                <span id="notes-minimize" style="cursor:pointer; font-size:20px;">−</span>
            </div>
            <div id="notes-content">
                <div class="section-title">
                    <span>🎯 Генераторы данных</span>
                </div>
                <div class="generators-section">
                    <!-- RN (введен пользователем) -->
                    <div class="generator-row" id="rn-row">
                        <div class="generator-label">RN:</div>
                        <div class="generator-value rn">${userRN}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>
                    <div class="template-info">Шаблон AN: ${userANTemplate}</div>

                    <!-- AN (генерируется по шаблону) -->
                    <div class="generator-row" id="an-row">
                        <div class="generator-label">AN:</div>
                        <div class="generator-value an">${savedData.an}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-refresh" title="Обновить">🔄</button>
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="generator-row" id="email-row">
                        <div class="generator-label">Email:</div>
                        <div class="generator-value email">${savedData.email}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-refresh" title="Обновить">🔄</button>
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="generator-row" id="password-row">
                        <div class="generator-label">Password:</div>
                        <div class="generator-value password">${savedData.password}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-refresh" title="Обновить">🔄</button>
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- USA Phone -->
                    <div class="generator-row" id="phone-row">
                        <div class="generator-label">USA Phone:</div>
                        <div class="generator-value phone">${savedData.phone}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-refresh" title="Обновить">🔄</button>
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>
                </div>

                <div class="section-title">
                    <span>📝 Мои заметки</span>
                </div>
                <div class="user-notes-section">
                    <textarea id="user-notes-textarea" placeholder="Введите ваши заметки здесь...">${USER_NOTES}</textarea>
                    <div class="notes-info">
                        Сохраняются автоматически при закрытии
                    </div>
                </div>
            </div>
            <div class="notes-controls">
                <button id="refresh-all-btn" class="notes-btn notes-refresh-all" title="Обновить все генераторы">
                    🔄 Все
                </button>
                <button id="save-btn" class="notes-btn notes-save" title="Сохранить заметки">
                    💾 Сохранить
                </button>
                <button id="close-btn" class="notes-btn notes-close" title="Закрыть окно">
                    ✕ Закрыть
                </button>
            </div>
        `;

        document.body.appendChild(windowElement);
        makeDraggable(windowElement);
        setupNotesListeners();
        setupGeneratorListeners();
    }

    // Настройка слушателей для генераторов
    function setupGeneratorListeners() {
        // RN - копирование
        const rnRow = document.getElementById('rn-row');
        const rnCopyBtn = rnRow.querySelector('.gen-copy');
        const rnValueElement = rnRow.querySelector('.generator-value');

        rnValueElement.addEventListener('click', () => copyToClipboard(userRN));
        rnCopyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(userRN);
        });

        // AN
        setupGeneratorRow('an');

        // Email
        setupGeneratorRow('email');

        // Password
        setupGeneratorRow('password');

        // Phone
        setupGeneratorRow('phone');
    }

    // Настройка строки генератора
    function setupGeneratorRow(type) {
        const row = document.getElementById(`${type}-row`);
        const valueElement = row.querySelector('.generator-value');
        const refreshBtn = row.querySelector('.gen-refresh');
        const copyBtn = row.querySelector('.gen-copy');

        // Клик по значению - копирование
        valueElement.addEventListener('click', () => copyToClipboard(savedData[type]));

        // Кнопка обновления
        refreshBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            refreshGenerator(type);
        });

        // Кнопка копирования
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(savedData[type]);
        });
    }

    // Переключение окна
    function toggleNotesWindow() {
        const windowElement = document.getElementById('smart-notes-window');
        const button = document.getElementById('smart-notes-btn');

        if (windowElement.style.display === 'block') {
            windowElement.style.display = 'none';
            button.innerHTML = '📝';
            button.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
            saveUserNotes(); // Автосохранение при закрытии
        } else {
            windowElement.style.display = 'block';
            button.innerHTML = '📘';
            button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        }
    }

    // Настройка обработчиков
    function setupNotesListeners() {
        // Обновить все генераторы
        document.getElementById('refresh-all-btn').addEventListener('click', refreshAllGenerators);

        // Сохранить заметки
        document.getElementById('save-btn').addEventListener('click', saveUserNotes);

        // Закрыть окно
        document.getElementById('close-btn').addEventListener('click', toggleNotesWindow);

        // Сворачивание
        document.getElementById('notes-minimize').addEventListener('click', function(e) {
            e.stopPropagation();
            const content = document.getElementById('notes-content');
            const controls = document.querySelector('.notes-controls');
            const isHidden = content.style.display === 'none';

            content.style.display = isHidden ? 'block' : 'none';
            controls.style.display = isHidden ? 'flex' : 'none';
            this.innerHTML = isHidden ? '−' : '+';
        });
    }

    // Обновить все генераторы
    function refreshAllGenerators() {
        savedData = {
            an: generateANFromTemplate(userANTemplate),
            email: generateRandomEmail(16),
            password: generateRandomPassword(8),
            phone: generateUSAPhoneNumber()
        };

        // Обновляем отображение и слушатели
        const types = ['an', 'email', 'password', 'phone'];
        types.forEach(type => {
            const row = document.getElementById(`${type}-row`);
            const valueElement = row.querySelector('.generator-value');

            valueElement.textContent = savedData[type];

            // Обновляем слушатели
            valueElement.onclick = () => copyToClipboard(savedData[type]);

            const copyBtn = row.querySelector('.gen-copy');
            copyBtn.onclick = (e) => {
                e.stopPropagation();
                copyToClipboard(savedData[type]);
            };
        });

        // Сохраняем
        GM_setValue('smart_notes_data', savedData);

        showNotification('🔄 Все генераторы обновлены!');
    }

    // Сохранить пользовательские заметки
    function saveUserNotes() {
        const textarea = document.getElementById('user-notes-textarea');
        const text = textarea.value;

        GM_setValue('user_smart_notes', text);
        showNotification('💾 Заметки сохранены');
    }

    // Перетаскивание окна
    function makeDraggable(element) {
        const header = document.getElementById('notes-header');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        header.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.id === 'notes-minimize') return;

            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
            isDragging = true;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            header.style.opacity = '0.9';
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Ограничение перемещения
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
            header.style.opacity = '1';
        }
    }

    // Уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            z-index: 999997;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 13px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);

        // Стили анимации
        if (!document.querySelector('#notes-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notes-notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Инициализация
    setTimeout(() => {
        createButton();
        createNotesWindow();

        showNotification('🚀 Smart Notes загружен. Нажмите кнопку 📝');
    }, 1000);
})();