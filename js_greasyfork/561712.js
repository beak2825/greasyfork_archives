// ==UserScript==
// @name         Smart Notes Pro v4.1
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Умные заметки с настраиваемыми генераторами
// @author       Вы
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561712/Smart%20Notes%20Pro%20v41.user.js
// @updateURL https://update.greasyfork.org/scripts/561712/Smart%20Notes%20Pro%20v41.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Загрузка сохраненных данных
    let savedData = GM_getValue('smart_notes_data');
    let userSettings = GM_getValue('user_settings');

    // Если это первый запуск - показываем настройку
    if (!userSettings || !savedData) {
        setupFirstRun();
        return;
    }

    // Получаем сохраненные пользовательские заметки
    const USER_NOTES = GM_getValue('user_smart_notes', 'Ваши заметки здесь...\nСохраняются автоматически.');

    // Функция форматирования даты рождения
    function formatBirthDate(dateStr) {
        if (dateStr.length === 8) {
            return dateStr.substring(0, 2) + '/' + dateStr.substring(2, 4) + '/' + dateStr.substring(4, 8);
        }
        return dateStr;
    }

    // Функция форматирования SSN
    function formatSSN(ssnStr) {
        if (ssnStr.length === 9) {
            return ssnStr.substring(0, 3) + '-' + ssnStr.substring(3, 5) + '-' + ssnStr.substring(5, 9);
        }
        return ssnStr;
    }

    // Функция для первого запуска - запрос всех данных
    function setupFirstRun() {
        // Создаем стили для модального окна
        GM_addStyle(`
            #setup-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 1000000;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'SF Pro Text', -apple-system, sans-serif;
                overflow-y: auto;
            }

            .setup-container {
                background: white;
                padding: 30px;
                border-radius: 12px;
                width: 450px;
                max-width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                margin: 20px;
            }

            .setup-title {
                font-size: 22px;
                font-weight: 600;
                color: #1976D2;
                margin-bottom: 25px;
                text-align: center;
            }

            .setup-input-group {
                margin-bottom: 18px;
            }

            .setup-label {
                display: block;
                font-size: 13px;
                font-weight: 500;
                margin-bottom: 6px;
                color: #333;
            }

            .setup-input {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 14px;
                font-family: 'SF Pro Text', -apple-system, sans-serif;
                box-sizing: border-box;
            }

            .setup-input:focus {
                outline: none;
                border-color: #2196F3;
                box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
            }

            .setup-info {
                font-size: 11px;
                color: #666;
                margin-top: 4px;
                font-style: italic;
            }

            .setup-example {
                background: #f5f5f5;
                padding: 8px 12px;
                border-radius: 4px;
                font-family: 'SF Mono', Monaco, monospace;
                font-size: 12px;
                margin: 5px 0;
                border: 1px solid #e0e0e0;
            }

            .setup-button {
                width: 100%;
                padding: 14px;
                background: linear-gradient(to right, #4CAF50, #45a049);
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
                margin-top: 20px;
            }

            .setup-button:hover {
                background: linear-gradient(to right, #45a049, #388E3C);
                transform: translateY(-1px);
            }

            .setup-hint {
                font-size: 12px;
                color: #2196F3;
                margin-top: 5px;
                padding: 5px;
                border-left: 3px solid #2196F3;
                background: #f0f7ff;
            }
        `);

        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.id = 'setup-modal';
        modal.innerHTML = `
            <div class="setup-container">
                <div class="setup-title">🚀 Настройка Smart Notes</div>

                <div class="setup-input-group">
                    <label class="setup-label">Введите RN (цифры любой длины):</label>
                    <input type="text" id="rn-input" class="setup-input" placeholder="253177049">
                    <div class="setup-info">RN - ваш фиксированный номер (только цифры)</div>
                    <div class="setup-example">Пример: 253177049 или 1234567</div>
                </div>

                <div class="setup-input-group">
                    <label class="setup-label">Введите шаблон для AN:</label>
                    <input type="text" id="an-input" class="setup-input" placeholder="9999XXX">
                    <div class="setup-info">Формат: фиксированные цифры + XXX для случайных</div>
                    <div class="setup-example">Пример: 9999XXX (фиксированная часть: 9999)</div>
                    <div class="setup-example">Пример: 448XXXXX (фиксированная часть: 448)</div>
                    <div class="setup-hint">X заменятся на случайные цифры</div>
                </div>

                <div class="setup-input-group">
                    <label class="setup-label">Введите Имя и Фамилию:</label>
                    <input type="text" id="name-input" class="setup-input" placeholder="John Doe">
                    <div class="setup-info">Имя и фамилия через пробел</div>
                    <div class="setup-example">Пример: John Doe, Иван Иванов</div>
                </div>

                <div class="setup-input-group">
                    <label class="setup-label">Год рождения:</label>
                    <input type="text" id="year-input" class="setup-input" placeholder="1990" maxlength="4">
                    <div class="setup-info">Год рождения (4 цифры)</div>
                    <div class="setup-example">Пример: 1990, 1985, 1975</div>
                </div>

                <div class="setup-input-group">
                    <label class="setup-label">Дата рождения (ДДММГГГГ):</label>
                    <input type="text" id="birthdate-input" class="setup-input" placeholder="01011999">
                    <div class="setup-info">8 цифр: день(2) + месяц(2) + год(4)</div>
                    <div class="setup-example">Пример: 01011999 → 01/01/1999</div>
                    <div class="setup-example">Пример: 15071985 → 15/07/1985</div>
                </div>

                <div class="setup-input-group">
                    <label class="setup-label">SSN (9 цифр):</label>
                    <input type="text" id="ssn-input" class="setup-input" placeholder="214395770">
                    <div class="setup-info">9 цифр: 214-39-5770</div>
                    <div class="setup-example">Пример: 214395770 → 214-39-5770</div>
                    <div class="setup-example">Пример: 123456789 → 123-45-6789</div>
                </div>

                <div class="setup-input-group">
                    <label class="setup-label">Адрес:</label>
                    <input type="text" id="address-input" class="setup-input" placeholder="123 Main St, New York">
                    <div class="setup-info">Ваш адрес (любой формат)</div>
                    <div class="setup-example">Пример: 123 Main St, New York, NY 10001</div>
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
            const nameInput = document.getElementById('name-input').value.trim();
            const yearInput = document.getElementById('year-input').value.trim();
            const birthdateInput = document.getElementById('birthdate-input').value.trim();
            const ssnInput = document.getElementById('ssn-input').value.trim();
            const addressInput = document.getElementById('address-input').value.trim();

            // Валидация данных
            const errors = [];

            // Проверка RN (только цифры)
            if (!/^\d+$/.test(rnInput)) {
                errors.push('❌ RN должен содержать только цифры!');
            }

            // Проверка шаблона AN
            if (!/^\d+X+$/.test(anInput)) {
                errors.push('❌ Шаблон AN должен содержать цифры и X (например: 9999XXX)');
            }

            // Проверка имени
            if (!nameInput || nameInput.length < 3) {
                errors.push('❌ Введите имя и фамилию');
            }

            // Проверка года рождения
            if (!/^\d{4}$/.test(yearInput) || parseInt(yearInput) < 1900 || parseInt(yearInput) > new Date().getFullYear()) {
                errors.push('❌ Введите корректный год рождения (4 цифры)');
            }

            // Проверка даты рождения
            if (!/^\d{8}$/.test(birthdateInput)) {
                errors.push('❌ Дата рождения должна содержать 8 цифр (ДДММГГГГ)');
            } else {
                const day = parseInt(birthdateInput.substring(0, 2));
                const month = parseInt(birthdateInput.substring(2, 4));
                const year = parseInt(birthdateInput.substring(4, 8));

                if (day < 1 || day > 31) errors.push('❌ Неверный день в дате рождения (1-31)');
                if (month < 1 || month > 12) errors.push('❌ Неверный месяц в дате рождения (1-12)');
                if (year < 1900 || year > new Date().getFullYear()) errors.push('❌ Неверный год в дате рождения');
            }

            // Проверка SSN
            if (!/^\d{9}$/.test(ssnInput)) {
                errors.push('❌ SSN должен содержать ровно 9 цифр');
            }

            // Проверка адреса
            if (!addressInput || addressInput.length < 5) {
                errors.push('❌ Введите корректный адрес');
            }

            // Если есть ошибки - показываем их
            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }

            // Сохраняем настройки пользователя
            userSettings = {
                rn: rnInput,
                anTemplate: anInput,
                fullName: nameInput,
                birthYear: yearInput,
                birthDate: birthdateInput,
                ssn: ssnInput,
                address: addressInput
            };

            // Генерируем AN на основе шаблона
            const generatedAN = generateANFromTemplate(anInput);

            // Генерируем email на основе имени и года рождения
            const email = generateEmailFromNameAndYear(nameInput, yearInput);

            // Генерируем пароль
            const password = generateRandomPassword(12);

            // Форматируем данные для отображения
            const formattedBirthDate = formatBirthDate(birthdateInput);
            const formattedSSN = formatSSN(ssnInput);

            // Сохраняем начальные данные
            savedData = {
                rn: rnInput,
                an: generatedAN,
                fullName: nameInput,
                birthYear: yearInput,
                birthDate: formattedBirthDate,
                ssn: formattedSSN,
                address: addressInput,
                email: email,
                password: password
            };

            // Сохраняем в хранилище
            GM_setValue('user_settings', userSettings);
            GM_setValue('smart_notes_data', savedData);

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
            if (char === 'X' || char === 'x') {
                result += Math.floor(Math.random() * 10);
            } else {
                result += char;
            }
        }
        return result;
    }

    // Генерация email на основе имени и года рождения
    function generateEmailFromNameAndYear(name, year) {
        // Убираем пробелы и приводим к нижнему регистру
        let namePart = name.toLowerCase().replace(/\s+/g, '');
        // Добавляем год рождения
        let email = namePart + year;
        // Обрезаем если слишком длинный
        if (email.length > 20) {
            email = email.substring(0, 20);
        }
        return email + '@yahoo.com';
    }

    // Генерация случайного пароля
    function generateRandomPassword(length = 12) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const specials = '!@#$%^&*';

        // Гарантируем хотя бы одну цифру, одну заглавную букву и один спецсимвол
        let password = '';
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        password += digits.charAt(Math.floor(Math.random() * digits.length));
        password += specials.charAt(Math.floor(Math.random() * specials.length));

        // Заполняем оставшиеся символы
        const allChars = lowercase + uppercase + digits + specials;
        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Перемешиваем символы
        return password.split('').sort(() => Math.random() - 0.5).join('');
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
            width: 450px;
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
            padding-bottom: 8px;
            border-bottom: 1px solid #e0e0e0;
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
            transition: all 0.2s;
        }

        .generator-row:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }

        .generator-label {
            font-weight: 600;
            font-size: 13px;
            min-width: 100px;
            color: #333;
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

        /* Цвета для разных типов данных */
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

        .generator-value.name {
            background: linear-gradient(135deg, #c8e6c9, #a5d6a7);
            color: #1b5e20;
            border-color: #81c784;
        }

        .generator-value.year {
            background: linear-gradient(135deg, #bbdefb, #90caf9);
            color: #0d47a1;
            border-color: #64b5f6;
        }

        .generator-value.birthdate {
            background: linear-gradient(135deg, #ffecb3, #ffd54f);
            color: #ff6f00;
            border-color: #ffb300;
        }

        .generator-value.ssn {
            background: linear-gradient(135deg, #d1c4e9, #b39ddb);
            color: #4527a0;
            border-color: #9575cd;
        }

        .generator-value.address {
            background: linear-gradient(135deg, #ffccbc, #ffab91);
            color: #bf360c;
            border-color: #ff8a65;
        }

        .generator-value.email {
            background: linear-gradient(135deg, #b3e5fc, #81d4fa);
            color: #01579b;
            border-color: #4fc3f7;
        }

        .generator-value.password {
            background: linear-gradient(135deg, #f8bbd0, #f48fb1);
            color: #880e4f;
            border-color: #ec407a;
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
            padding: 4px 8px;
            background: #f5f5f5;
            border-radius: 4px;
            border-left: 3px solid #4CAF50;
        }

        .data-info {
            font-size: 11px;
            color: #2196F3;
            margin-left: 10px;
            font-style: italic;
        }
    `);

    // Создаем кнопку
    function createButton() {
        const button = document.createElement('button');
        button.id = 'smart-notes-btn';
        button.innerHTML = '📝';
        button.title = 'Smart Notes - Ваши данные';

        button.addEventListener('click', toggleNotesWindow);
        document.body.appendChild(button);
    }

    // Создаем окно заметок
    function createNotesWindow() {
        const windowElement = document.createElement('div');
        windowElement.id = 'smart-notes-window';

        windowElement.innerHTML = `
            <div id="notes-header">
                <span>🚀 Smart Notes Pro</span>
                <span id="notes-minimize" style="cursor:pointer; font-size:20px;">−</span>
            </div>
            <div id="notes-content">
                <div class="section-title">
                    <span>📊 Основные данные</span>
                    <span class="data-info">Все поля можно копировать</span>
                </div>
                <div class="generators-section">
                    <!-- RN (фиксированный) -->
                    <div class="generator-row" id="rn-row">
                        <div class="generator-label">RN:</div>
                        <div class="generator-value rn">${savedData.rn}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- AN (генерируется по шаблону) -->
                    <div class="generator-row" id="an-row">
                        <div class="generator-label">AN:</div>
                        <div class="generator-value an">${savedData.an}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-refresh" title="Обновить AN">🔄</button>
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- Имя и Фамилия -->
                    <div class="generator-row" id="name-row">
                        <div class="generator-label">ФИО:</div>
                        <div class="generator-value name">${savedData.fullName}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- Год рождения -->
                    <div class="generator-row" id="year-row">
                        <div class="generator-label">Год рождения:</div>
                        <div class="generator-value year">${savedData.birthYear}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- Дата рождения -->
                    <div class="generator-row" id="birthdate-row">
                        <div class="generator-label">Дата рождения:</div>
                        <div class="generator-value birthdate">${savedData.birthDate}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- SSN -->
                    <div class="generator-row" id="ssn-row">
                        <div class="generator-label">SSN:</div>
                        <div class="generator-value ssn">${savedData.ssn}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- Адрес -->
                    <div class="generator-row" id="address-row">
                        <div class="generator-label">Адрес:</div>
                        <div class="generator-value address">${savedData.address}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <div class="template-info">
                        Шаблон AN: ${userSettings.anTemplate} | Email: ${userSettings.fullName.replace(/\s+/g, '').toLowerCase()}${userSettings.birthYear}@yahoo.com
                    </div>

                    <div class="section-title">
                        <span>🔐 Сгенерированные данные</span>
                    </div>

                    <!-- Email -->
                    <div class="generator-row" id="email-row">
                        <div class="generator-label">Email:</div>
                        <div class="generator-value email">${savedData.email}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-refresh" title="Обновить email">🔄</button>
                            <button class="gen-btn gen-copy" title="Копировать">📋</button>
                        </div>
                    </div>

                    <!-- Пароль -->
                    <div class="generator-row" id="password-row">
                        <div class="generator-label">Пароль:</div>
                        <div class="generator-value password">${savedData.password}</div>
                        <div class="generator-buttons">
                            <button class="gen-btn gen-refresh" title="Обновить пароль">🔄</button>
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
                <button id="refresh-all-btn" class="notes-btn notes-refresh-all" title="Обновить AN, email и пароль">
                    🔄 Обновить
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
        // Настройка кнопок копирования для всех полей
        setupCopyButton('rn', savedData.rn);
        setupCopyButton('an', savedData.an);
        setupCopyButton('name', savedData.fullName);
        setupCopyButton('year', savedData.birthYear);
        setupCopyButton('birthdate', savedData.birthDate);
        setupCopyButton('ssn', savedData.ssn);
        setupCopyButton('address', savedData.address);
        setupCopyButton('email', savedData.email);
        setupCopyButton('password', savedData.password);

        // Кнопки обновления
        document.querySelector('#an-row .gen-refresh').addEventListener('click', refreshAN);
        document.querySelector('#email-row .gen-refresh').addEventListener('click', refreshEmail);
        document.querySelector('#password-row .gen-refresh').addEventListener('click', refreshPassword);
    }

    // Настройка кнопки копирования
    function setupCopyButton(type, value) {
        const row = document.getElementById(`${type}-row`);
        if (!row) return;

        const valueElement = row.querySelector('.generator-value');
        const copyBtn = row.querySelector('.gen-copy');

        valueElement.addEventListener('click', () => copyToClipboard(value));
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(value);
        });
    }

    // Обновление AN
    function refreshAN() {
        const newAN = generateANFromTemplate(userSettings.anTemplate);
        savedData.an = newAN;
        GM_setValue('smart_notes_data', savedData);

        const valueElement = document.querySelector('.generator-value.an');
        valueElement.textContent = newAN;
        valueElement.onclick = () => copyToClipboard(newAN);

        showNotification(`🔄 AN обновлен: ${newAN}`);
    }

    // Обновление email
    function refreshEmail() {
        const newEmail = generateEmailFromNameAndYear(savedData.fullName, savedData.birthYear);
        savedData.email = newEmail;
        GM_setValue('smart_notes_data', savedData);

        const valueElement = document.querySelector('.generator-value.email');
        valueElement.textContent = newEmail;
        valueElement.onclick = () => copyToClipboard(newEmail);

        showNotification(`🔄 Email обновлен: ${newEmail}`);
    }

    // Обновление пароля
    function refreshPassword() {
        const newPassword = generateRandomPassword(12);
        savedData.password = newPassword;
        GM_setValue('smart_notes_data', savedData);

        const valueElement = document.querySelector('.generator-value.password');
        valueElement.textContent = newPassword;
        valueElement.onclick = () => copyToClipboard(newPassword);

        showNotification(`🔄 Пароль обновлен: ${newPassword}`);
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
        // Обновить все генераторы (AN, email, пароль)
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
        refreshAN();
        refreshEmail();
        refreshPassword();
        showNotification('🔄 Все генераторы обновлены!');
    }

    // Сохранить пользовательские заметки
    function saveUserNotes() {
        const textarea = document.getElementById('user-notes-textarea');
        if (textarea) {
            const text = textarea.value;
            GM_setValue('user_smart_notes', text);
            showNotification('💾 Заметки сохранены');
        }
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
            background: linear-gradient(to right, #2196F3, #1976D2);
            color: white;
            padding: 12px 18px;
            border-radius: 6px;
            z-index: 999997;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 13px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            max-width: 300px;
            font-weight: 500;
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