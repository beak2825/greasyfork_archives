// ==UserScript==
// @name        Catwar - Cell
// @namespace   http://tampermonkey.net/
// @version     1.9
// @description Подсвечивает клетки в игровой с возможностью покраски цветом и созданием меток
// @author      Кто-то
// @match       https://catwar.su/cw3/*
// @match       https://catwar.net/cw3/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549598/Catwar%20-%20Cell.user.js
// @updateURL https://update.greasyfork.org/scripts/549598/Catwar%20-%20Cell.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .cw-highlight-ui {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            min-width: 280px;
            max-width: 350px;
            border: 1px solid #ddd;
            transition: all 0.3s ease;
        }

        .cw-ui-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
            cursor: move;
        }

        .cw-ui-title {
            font-weight: bold;
            color: #333;
            font-size: 14px;
        }

        .cw-ui-toggle {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 20px;
            height: 20px;
        }

        .cw-ui-content {
            display: block;
        }

        .cw-ui-collapsed .cw-ui-content {
            display: none;
        }

        .location-info {
            margin-bottom: 15px;
            padding: 10px;
            background: linear-gradient(135deg, #FFB300 0%, #FF6F00 100%);
            color: white;
            border-radius: 6px;
            font-size: 12px;
            text-align: center;
        }

        .add-cell-form {
            margin-bottom: 15px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }

        .form-group {
            margin-bottom: 10px;
        }

        .form-group label {
            display: block;
            margin-bottom: 3px;
            font-size: 11px;
            color: #666;
            font-weight: bold;
        }

        .form-input {
            width: 100%;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        }

        .form-textarea {
            min-height: 40px;
            resize: vertical;
            white-space: pre-wrap;
        }

        .color-picker {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .color-input {
            width: 30px;
            height: 30px;
            padding: 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .color-value {
            font-size: 11px;
            color: #666;
        }

        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #FFB300 0%, #FF6F00 100%);
            color: white;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .btn-danger {
            background: #dc3545;
            color: white;
        }

        .btn:hover {
            opacity: 0.9;
        }

        .highlighted-cell {
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .cell-label {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            color: #000;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            z-index: 10000;
            pointer-events: none;
            border: 1px solid rgba(0, 0, 0, 0.2);
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            text-align: center;
            line-height: 1.2;
            min-width: 50px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .settings-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            min-width: 300px;
        }

        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        }

        .import-export {
            margin-top: 15px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }

        .import-export-buttons {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }

        .import-textarea {
            min-height: 60px;
            resize: vertical;
            font-family: monospace;
            font-size: 11px;
        }

        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10002;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .notification.show {
            opacity: 1;
        }
    `);

    // Карта локаций и соответствующих клеток
    let locationCells = GM_getValue('locationCells', {
        'Локация 1': [],
        'Локация 2': []
    });

    let currentLocation = "";
    let highlightedCells = [];
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let currentEditingCell = null;
    let uiElement = null;
    let cellClickHandlers = new Map(); // Хранилище обработчиков

    function createUI() {
        const ui = document.createElement('div');
        ui.className = 'cw-highlight-ui';
        ui.innerHTML = `
            <div class="cw-ui-header">
                <div class="cw-ui-title">Подсветка клеток</div>
                <button class="cw-ui-toggle">−</button>
            </div>
            <div class="cw-ui-content">
                <div class="location-info" id="cw-current-location">Локация: ${currentLocation || "не определено"}</div>
                <div class="add-cell-form">
                    <div class="form-group">
                        <label>Строка:</label>
                        <input type="number" class="form-input" id="cw-row-input" min="1" max="10">
                    </div>
                    <div class="form-group">
                        <label>Столбец:</label>
                        <input type="number" class="form-input" id="cw-col-input" min="1" max="10">
                    </div>
                    <div class="form-group">
                        <label>Текст (Shift+Enter для новой строки):</label>
                        <textarea class="form-input form-textarea" id="cw-text-input"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Цвет подсветки:</label>
                        <div class="color-picker">
                            <input type="color" class="color-input" id="cw-color-input" value="#ffff00">
                            <span class="color-value" id="cw-color-value">#ffff00</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" id="cw-add-btn">Добавить клетку</button>
                </div>
                <div class="import-export">
                    <div class="form-group">
                        <label>Импорт/экспорт карты:</label>
                        <textarea class="form-input import-textarea" id="cw-import-data" placeholder="Вставьте JSON данные для импорта"></textarea>
                    </div>
                    <div class="import-export-buttons">
                        <button class="btn btn-secondary" id="cw-copy-btn">Копировать карту</button>
                        <button class="btn btn-secondary" id="cw-import-btn">Импортировать</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(ui);
        uiElement = ui; // Сохраняем ссылку на UI элемент
        createModal();
        createNotification();

        // Обработчики событий
        document.getElementById('cw-add-btn').addEventListener('click', addNewCell);
        document.getElementById('cw-color-input').addEventListener('input', updateColorValue);
        document.querySelector('.cw-ui-toggle').addEventListener('click', toggleUI);
        document.getElementById('cw-copy-btn').addEventListener('click', copyMapToClipboard);
        document.getElementById('cw-import-btn').addEventListener('click', importMapFromText);
        
        // Перетаскивание
        const header = ui.querySelector('.cw-ui-header');
        header.addEventListener('mousedown', startDrag);
    }

    function createNotification() {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.id = 'cw-notification';
        document.body.appendChild(notification);
    }

    function showNotification(message, isSuccess = true) {
        const notification = document.getElementById('cw-notification');
        notification.textContent = message;
        notification.style.background = isSuccess ? '#28a745' : '#dc3545';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Функция копирования карты в буфер обмена
    function copyMapToClipboard() {
        try {
            const mapData = JSON.stringify(locationCells, null, 2);
            navigator.clipboard.writeText(mapData).then(() => {
                showNotification('Карта скопирована в буфер обмена!');
            }).catch(err => {
                // Fallback для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = mapData;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Карта скопирована в буфер обмена!');
            });
        } catch (error) {
            showNotification('Ошибка при копировании: ' + error.message, false);
        }
    }

    // Функция импорта карты из текста
    function importMapFromText() {
        const importText = document.getElementById('cw-import-data').value.trim();
        
        if (!importText) {
            showNotification('Введите данные для импорта', false);
            return;
        }

        try {
            const parsedData = JSON.parse(importText);
            
            // Проверяем структуру данных
            if (typeof parsedData !== 'object' || parsedData === null) {
                throw new Error('Неверный формат данных');
            }

            // Проверяем, что все значения - массивы
            for (const location in parsedData) {
                if (!Array.isArray(parsedData[location])) {
                    throw new Error(`Локация "${location}" должна содержать массив клеток`);
                }
                
                // Проверяем структуру каждой клетки
                for (const cell of parsedData[location]) {
                    if (!cell.row || !cell.col || !cell.label) {
                        throw new Error('Неверный формат клетки: должны быть row, col и label');
                    }
                }
            }

            // Сохраняем новые данные
            locationCells = parsedData;
            GM_setValue('locationCells', locationCells);
            
            // Обновляем интерфейс
            highlightCellsByLocation();
            document.getElementById('cw-import-data').value = '';
            
            showNotification('Карта успешно импортирована!');
            
        } catch (error) {
            showNotification('Ошибка импорта: ' + error.message, false);
        }
    }

    function createModal() {
        const modalHTML = `
            <div class="modal-overlay" id="cw-modal-overlay"></div>
            <div class="settings-modal" id="cw-settings-modal">
                <h3 style="margin-top: 0;">Редактирование клетки</h3>
                <div class="form-group">
                    <label>Текст:</label>
                    <textarea class="form-input form-textarea" id="cw-edit-text"></textarea>
                </div>
                <div class="form-group">
                    <label>Цвет:</label>
                    <div class="color-picker">
                        <input type="color" class="color-input" id="cw-edit-color">
                        <span class="color-value" id="cw-edit-color-value"></span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" id="cw-save-btn">Сохранить</button>
                    <button class="btn btn-danger" id="cw-delete-btn">Удалить</button>
                    <button class="btn" id="cw-cancel-btn">Отмена</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Обработчики модального окна
        document.getElementById('cw-save-btn').addEventListener('click', saveCellSettings);
        document.getElementById('cw-delete-btn').addEventListener('click', deleteCell);
        document.getElementById('cw-cancel-btn').addEventListener('click', closeModal);
        document.getElementById('cw-modal-overlay').addEventListener('click', closeModal);
        document.getElementById('cw-edit-color').addEventListener('input', function() {
            document.getElementById('cw-edit-color-value').textContent = this.value;
        });
    }

    function updateColorValue() {
        const colorInput = document.getElementById('cw-color-input');
        document.getElementById('cw-color-value').textContent = colorInput.value;
    }

    function toggleUI() {
        const ui = document.querySelector('.cw-highlight-ui');
        const toggleBtn = document.querySelector('.cw-ui-toggle');
        ui.classList.toggle('cw-ui-collapsed');
        toggleBtn.textContent = ui.classList.contains('cw-ui-collapsed') ? '+' : '−';
    }

    function startDrag(e) {
        if (e.target.closest('.cw-ui-toggle')) return;
        isDragging = true;
        const rect = uiElement.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        uiElement.style.transition = 'none';
        
        // Добавляем обработчики на документ
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(e) {
        if (!isDragging) return;
        uiElement.style.left = (e.clientX - dragOffset.x) + 'px';
        uiElement.style.top = (e.clientY - dragOffset.y) + 'px';
        uiElement.style.right = 'auto';
    }

    function stopDrag() {
        isDragging = false;
        uiElement.style.transition = 'all 0.3s ease';
        
        // Убираем обработчики с документа
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    function addNewCell() {
        const rowInput = document.getElementById('cw-row-input');
        const colInput = document.getElementById('cw-col-input');
        const textInput = document.getElementById('cw-text-input');
        
        const row = parseInt(rowInput.value);
        const col = parseInt(colInput.value);
        const text = textInput.value.trim();
        const color = document.getElementById('cw-color-input').value;

        if (isNaN(row) || isNaN(col) || !text) {
            showNotification('Заполните все поля!', false);
            return;
        }

        if (row < 1 || row > 10 || col < 1 || col > 10) {
            showNotification('Строка и столбец должны быть от 1 до 10!', false);
            return;
        }

        if (!currentLocation) {
            showNotification('Сначала определите локацию!', false);
            return;
        }

        if (!locationCells[currentLocation]) {
            locationCells[currentLocation] = [];
        }

        // Проверяем, существует ли уже клетка с такими координатами
        const existingIndex = locationCells[currentLocation].findIndex(cell => 
            cell.row === row && cell.col === col
        );

        const newCell = {
            row: row,
            col: col,
            label: text,
            color: color
        };

        if (existingIndex >= 0) {
            locationCells[currentLocation][existingIndex] = newCell;
            showNotification('Клетка обновлена!');
        } else {
            locationCells[currentLocation].push(newCell);
            showNotification('Клетка добавлена!');
        }

        GM_setValue('locationCells', locationCells);
        highlightCellsByLocation();

        // Очищаем поля ввода
        rowInput.value = '';
        colInput.value = '';
        textInput.value = '';
    }

    function openSettingsModal(cellInfo, cellElement) {
        currentEditingCell = { cellInfo, cellElement };
        
        document.getElementById('cw-edit-text').value = cellInfo.label;
        document.getElementById('cw-edit-color').value = cellInfo.color || '#ffff00';
        document.getElementById('cw-edit-color-value').textContent = cellInfo.color || '#ffff00';
        
        document.getElementById('cw-modal-overlay').style.display = 'block';
        document.getElementById('cw-settings-modal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('cw-modal-overlay').style.display = 'none';
        document.getElementById('cw-settings-modal').style.display = 'none';
        currentEditingCell = null;
    }

    function saveCellSettings() {
        if (!currentEditingCell) return;

        const text = document.getElementById('cw-edit-text').value;
        const color = document.getElementById('cw-edit-color').value;

        // Обновляем данные в storage
        const locationData = locationCells[currentLocation];
        const cellIndex = locationData.findIndex(cell => 
            cell.row === currentEditingCell.cellInfo.row && 
            cell.col === currentEditingCell.cellInfo.col
        );

        if (cellIndex >= 0) {
            locationData[cellIndex].label = text;
            locationData[cellIndex].color = color;
            GM_setValue('locationCells', locationCells);
            
            // Обновляем подсветку
            highlightCellsByLocation();
            showNotification('Клетка обновлена!');
        }

        closeModal();
    }

    function deleteCell() {
        if (!currentEditingCell) return;

        const locationData = locationCells[currentLocation];
        const cellIndex = locationData.findIndex(cell => 
            cell.row === currentEditingCell.cellInfo.row && 
            cell.col === currentEditingCell.cellInfo.col
        );

        if (cellIndex >= 0) {
            locationData.splice(cellIndex, 1);
            GM_setValue('locationCells', locationCells);
            
            // Обновляем подсветку
            highlightCellsByLocation();
            showNotification('Клетка удалена!');
        }

        closeModal();
    }

    // Поиск текущего Локациянахождения кота
    function findCurrentLocation() {
        // Ищем элемент с информацией о Локациянахождении
        const locationElement = document.querySelector('span#location');
        if (locationElement) {
            const newLocation = locationElement.textContent.trim();
            if (newLocation !== currentLocation) {
                currentLocation = newLocation;
                return true;
            }
            return false;
        }

        // Альтернативный поиск в истории
        const historyElement = document.querySelector('span#ist');
        if (historyElement && historyElement.textContent.includes('Моё местонахождение:')) {
            const locationMatch = historyElement.textContent.match(/Моё местонахождение:\s*([^<]+)/);
            if (locationMatch && locationMatch[1]) {
                const newLocation = locationMatch[1].trim();
                if (newLocation !== currentLocation) {
                    currentLocation = newLocation;
                    return true;
                }
            }
        }

        return false;
    }

    // Подсветка клеток в зависимости от Локацияположения
    function highlightCellsByLocation() {
        // Очищаем предыдущие подсветки
        clearHighlights();

        if (!currentLocation || !locationCells[currentLocation]) {
            console.log(`Для локации "${currentLocation}" нет настроенных клеток`);
            return;
        }

        const table = document.getElementById('cages');
        if (!table) {
            console.log('Игровое поле не найдено!');
            return;
        }

        const cellsToHighlight = locationCells[currentLocation];
        cellsToHighlight.forEach(cellInfo => {
            try {
                // Проверяем существование строки и ячейки
                if (cellInfo.row - 1 >= table.rows.length) return;
                const row = table.rows[cellInfo.row - 1];
                if (!row || cellInfo.col - 1 >= row.cells.length) return;
                
                const targetCell = row.cells[cellInfo.col - 1];
                if (!targetCell) return;

                // Подсвечиваем клетку
                targetCell.style.backgroundColor = cellInfo.color ? 
                    cellInfo.color + '80' : 'rgba(255, 255, 0, 0.5)';
                targetCell.style.boxShadow = `0 0 10px 5px ${cellInfo.color || 'yellow'}`;
                targetCell.classList.add('highlighted-cell');

                // Добавляем надпись
                const label = document.createElement('div');
                label.className = 'cell-label';
                label.textContent = cellInfo.label;
                targetCell.appendChild(label);

                // Создаем обработчик клика для редактирования
                const clickHandler = function(e) {
                    if (e.target.classList.contains('cell-label')) return;
                    openSettingsModal(cellInfo, targetCell);
                };

                // Добавляем обработчик и сохраняем ссылку на него
                targetCell.addEventListener('click', clickHandler);
                cellClickHandlers.set(targetCell, clickHandler);

                // Сохраняем ссылку на подсвеченную ячейку
                highlightedCells.push({
                    cell: targetCell,
                    label: label
                });

            } catch (e) {
                console.error('Ошибка при подсветке клетки:', e);
            }
        });
    }

    // Очистка всех подсветок
    function clearHighlights() {
        highlightedCells.forEach(highlighted => {
            if (highlighted.cell && highlighted.cell.parentNode) {
                highlighted.cell.style.backgroundColor = "";
                highlighted.cell.style.boxShadow = "";
                highlighted.cell.classList.remove('highlighted-cell');
                
                // Удаляем обработчик клика
                const clickHandler = cellClickHandlers.get(highlighted.cell);
                if (clickHandler) {
                    highlighted.cell.removeEventListener('click', clickHandler);
                    cellClickHandlers.delete(highlighted.cell);
                }
                
                // Удаляем надпись
                if (highlighted.label && highlighted.label.parentNode) {
                    highlighted.label.parentNode.removeChild(highlighted.label);
                }
            }
        });
        highlightedCells = [];
    }

    // Обновление информации о Локацияположении в интерфейсе
    function updateLocationInfo() {
        const locationInfo = document.getElementById('cw-current-location');
        if (locationInfo) {
            locationInfo.textContent = `Локация: ${currentLocation || "не определено"}`;
        }
    }

    // Основная функция инициализации
    function init() {
        console.log('Инициализация скрипта подсветки куч...');

        // Создаем интерфейс
        createUI();

        // Начальное определение Локацияположения
        findCurrentLocation();
        updateLocationInfo();
        highlightCellsByLocation();

        // Запускаем периодическую проверку Локацияположения
        setInterval(() => {
            const locationChanged = findCurrentLocation();
            if (locationChanged) {
                console.log(`Местонахождение изменилось на: ${currentLocation}`);
                updateLocationInfo();
                highlightCellsByLocation();
            }
        }, 500);
    }

    // Ждем загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();