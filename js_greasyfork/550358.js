// ==UserScript==
// @name         Catwar - Карта для 7ДЛ 
// @namespace    http://tampermonkey.net
// @version      2.11
// @description  Подсвечивает клетки и управляет маршрутами. 
// @author       MyName
// @match        https://catwar.net/cw3*
// @match        https://catwar.net/*
// @match        https://catwar.su/cw3*
// @match        https://catwar.su/*
// @icon         https://catwar.net/i/favicon.ico
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @resource     bellSound https://actions.google.com/sounds/v1/alarms/beep_short.ogg
// @require      https://cdnjs.cloudflare.com/ajax/libs/i18next/21.6.10/i18next.min.js
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/550358/Catwar%20-%20%D0%9A%D0%B0%D1%80%D1%82%D0%B0%20%D0%B4%D0%BB%D1%8F%207%D0%94%D0%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/550358/Catwar%20-%20%D0%9A%D0%B0%D1%80%D1%82%D0%B0%20%D0%B4%D0%BB%D1%8F%207%D0%94%D0%9B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =========================
  // ----- Константы ----------
  // =========================
  // Ожидаемый формат JSON:
  // {
  //   "labyrinthMaps": { main: { sub: { labyrinthName: { [id]: {row,col}|[{row,col},...] } } } },
  //   "labyrinthStructure": { main: { sub: [labyrinthName, ...] } }
  // }
  const MAPS_URL = 'https://raw.githubusercontent.com/tolayy/catwar-maps/main/labyrinth-maps.json';

  // Маршруты, где порядок ID — по возрастанию (вперёд = +1)
  const ASCENDING_PATHS = [
    'Верхний ЛабиринтОт старой деревни до нейтральной территории',
    'Нижний ЛабиринтОт старой деревни до ВВ'
  ];

  // Ключ для совместимости с AutoTimer — храним «время окончания» в localStorage,
  // чтобы после перезагрузки восстановить отсчёт.
  const LS_AUTOTIMER_END_KEY = 'cw_autotimer_end';

  // =========================
  // ----- Состояние ----------
  // =========================
  let labyrinthMaps = {};
  let labyrinthStructure = {};
  let mapsLoaded = false;

  let highlightRules = {}; // текущие правила подсветки: id -> coords / [coords]
  let selectedLabyrinthPath = GM_getValue('selectedLabyrinthPath', null);

  // Текущий ID локации (по карте)
  let currentLocationId = (() => {
    const v = GM_getValue('currentLocationId', null);
    if (v === null || v === undefined) return 0;
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  })();

  let locationOrder = 'asc'; // 'asc' | 'desc'
  let locationIds = [];      // упорядоченный список id для текущей карты

  // Подсветка
  let highlightedCells = [];
  let highlightedCellCoords = GM_getValue('highlightedCellCoords', []) || [];
  let currentHighlightColor = GM_getValue('highlightColor', '#FFFF00');

  // UI состояние
  let isUIMinimized = GM_getValue('isUIMinimized', false) || false;
  let isSettingsMinimized = GM_getValue('isSettingsMinimized', true) || true;
  let uiPosition = GM_getValue('uiPosition', { top: '20px', right: '20px' }) || { top: '20px', right: '20px' };
  let expandedSections = GM_getValue('expandedSections', {}) || {};
  let currentPageUrl = window.location.href;

  // Звук
  let notificationSound = GM_getValue('notificationSound', null);
  let bellSound = null;

  // Таймер (объединённая логика)
  let timerInterval = null;                    // setInterval handler
  let timerEndTime = GM_getValue('timerEndTime', 0) || 0; // дублируем для UI, но приоритет у localStorage
  let timerRunning = GM_getValue('timerRunning', false) || false;
  let timerSeconds = GM_getValue('timerSeconds', 0) || 0;
  let notificationShown = GM_getValue('notificationShown', false) || false;

  // Переключатели
  let timerEnabled = GM_getValue('timerEnabled', false) || false;           // ручной таймер
  let autoTimerEnabled = GM_getValue('autoTimerEnabled', true) || true;     // авто-таймер по #block_mess
  let autoCheckInterval = null; // опрос #block_mess, когда включён авто-таймер

  // =========================
  // ----- Стили UI ----------
  // =========================
  GM_addStyle(`
    .cw-highlight-ui {
      color: #5E5E5E !important;
      position: fixed;
      background: rgba(255, 255, 255, 0.95);
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 0 15px rgba(0,0,0,0.4);
      z-index: 9999;
      font-family: Arial, sans-serif;
      width: 300px;
      min-width: 300px;
      max-width: 300px;
      max-height: 90vh;
      border: 1px solid #ccc;
      user-select: none;
      resize: none;
      overflow-y: auto;
      overflow-x: hidden;
      overflow: hidden;
      box-sizing: border-box;
    }
    .cw-ui-header {
      color: #5E5E5E !important;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
      cursor: move;
    }
    .cw-ui-title { font-weight: bold; font-size: 14px; }
    .cw-ui-controls { display: flex; gap: 5px; }
    .cw-ui-controls button { background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px 5px; }

    .cw-highlight-ui button {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 5px 10px;
      margin: 2px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .cw-highlight-ui button:hover { background: #45a049; }
    .cw-highlight-ui select, .cw-highlight-ui input {
      padding: 5px; margin: 2px 0; border-radius: 4px; border: 1px solid #ddd; width: calc(100% - 12px);
    }

    .cw-location-controls { display: flex; align-items: center; margin-bottom: 10px; }
    .cw-location-id { font-weight: bold; margin: 0 10px; flex-grow: 1; text-align: center; }

    .cw-input-container { margin-top: 10px; }
    .cw-input-container input { width: 80px; padding: 5px; margin-right: 5px; }

    .cw-timer-container { margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; }
    .cw-timer-display { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 5px; text-align: center; }
    .cw-timer-setup { margin-top: 10px; display: flex; align-items: center; gap: 6px; }
    .cw-timer-setup input { flex: 1; }
    .cw-timer-setup .cw-stop { background: #d9534f; }
    .cw-timer-setup .cw-stop:hover { background: #c9302c; }

    .cw-color-picker { display: flex; align-items: center; margin-top: 10px; gap: 6px; }
    .cw-color-picker input { width: 60px; height: 30px; padding: 0; }

    .cw-sound-settings { margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; }
    .cw-sound-instruction { margin-top: 5px; font-size: 11px; color: #666; cursor: pointer; text-decoration: underline; }

    .cw-minimized { padding: 5px; min-width: auto; width: auto; }
    .cw-minimized .cw-ui-content { display: none; }

    .cw-settings-content { display: none; }
    .cw-settings-visible .cw-settings-content { display: block; }

    .highlighted-cell { cursor: pointer; transition: all 0.2s ease; }

    .instruction-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #fff; padding: 20px; border-radius: 8px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5); z-index: 10000; max-width: 80%; max-height: 80%; overflow: auto;
    }
    .instruction-modal h3 { margin-top: 0; }
    .instruction-modal pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; }
    .instruction-modal button { margin-top: 15px; padding: 8px 15px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; }

    .cw-timer-toggle, .cw-auto-timer-toggle { display: flex; align-items: center; margin-top: 10px; gap: 6px; }
    .cw-timer-hidden { display: none !important; }

    .cw-labyrinth-selector { margin-top: 10px; max-height: 220px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 5px; }
    .cw-labyrinth-section { margin-bottom: 5px; }
    .cw-labyrinth-header { font-weight: bold; cursor: pointer; padding: 5px; background: #f0f0f0; border-radius: 3px; margin-bottom: 3px; }
    .cw-labyrinth-subsection { margin-bottom: 4px; }
    .cw-labyrinth-subheader { font-weight: bold; cursor: pointer; padding: 5px 5px 5px 15px; background: #f8f8f8; border-radius: 3px; margin-bottom: 2px; }
    .cw-labyrinth-item { cursor: pointer; padding: 5px 5px 5px 25px; border-radius: 3px; margin-bottom: 1px; }
    .cw-labyrinth-item:hover { background: #e9e9e9; }
    .cw-labyrinth-content { display: none; padding-left: 5px; }
    .cw-labyrinth-expanded > .cw-labyrinth-content { display: block; }
    .cw-labyrinth-selected { background-color: #d4edda !important; border: 1px solid #c3e6cb; }

    .cw-loading { color: #666; font-style: italic; text-align: center; padding: 10px; }
    .cw-error { color: #d32f2f; text-align: center; padding: 10px; }
    .cw-refresh-btn { background: #2196F3 !important; margin-top: 5px; }

    .cw-order-indicator { font-size: 10px; margin-left: 5px; color: #666; }
    .cw-page-indicator { font-size: 11px; margin-top: 5px; color: #333; text-align: center; font-weight: bold; }
  `);

  // =========================
  // ----- Загрузка карт -----
  // =========================
  function loadMapsFromGitHub() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: MAPS_URL,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            labyrinthMaps = data.labyrinthMaps || {};
            labyrinthStructure = data.labyrinthStructure || {};
            mapsLoaded = true;
            resolve();
          } catch (e) {
            console.error('Ошибка парсинга карт лабиринтов', e);
            reject(e);
          }
        },
        onerror: function (error) {
          console.error('Ошибка загрузки карт лабиринтов', error);
          reject(error);
        }
      });
    });
  }

  // =========================
  // ----- Звук --------------
  // =========================
  function playNotificationSound() {
    try {
      if (notificationSound) {
        const audio = new Audio('data:audio/mp3;base64,' + notificationSound);
        audio.volume = 0.8;
        audio.play().catch(() => {});
      } else {
        if (!bellSound) {
          const soundUrl = GM_getResourceURL('bellSound');
          bellSound = new Audio(soundUrl);
        }
        bellSound.volume = 0.8;
        bellSound.play().catch(() => {});
      }
    } catch (e) {
      console.log('Не удалось воспроизвести звук', e);
    }
  }

  // =========================
  // ----- UI ----------------
  // =========================
  function createUI() {
    const existing = document.querySelector('.cw-highlight-ui');
    if (existing) existing.remove();

    const ui = document.createElement('div');
    ui.className = `cw-highlight-ui ${isUIMinimized ? 'cw-minimized' : ''} ${isSettingsMinimized ? '' : 'cw-settings-visible'}`;

    if (uiPosition.right && !uiPosition.left) {
      ui.style.right = uiPosition.right;
      ui.style.top = uiPosition.top || '20px';
    } else {
      ui.style.left = uiPosition.left || '20px';
      ui.style.top = uiPosition.top || '20px';
    }

    ui.innerHTML = `
      <div class="cw-ui-header">
        <div class="cw-ui-title">Catwar Maps</div>
        <div class="cw-ui-controls">
          <button id="cw-toggle-settings" title="Настройки">⚙️</button>
          <button id="cw-toggle-ui" title="Свернуть">−</button>
        </div>
      </div>

      <div class="cw-ui-content" style="${isUIMinimized ? 'display:none;' : ''}">
        <div class="cw-location-controls">
          <button id="cw-prev" title="Предыдущая локация">←</button>
          <span class="cw-location-id" id="cw-location-id">ID ${currentLocationId}</span>
          <button id="cw-next" title="Следующая локация">→</button>
        </div>

        <div class="cw-input-container">
          <input type="number" id="cw-location-input" min="1" placeholder="ID локации" />
          <button id="cw-go">Перейти</button>
        </div>

        <div class="cw-labyrinth-selector" id="cw-labyrinth-selector">
          <div class="cw-loading">Загрузка карт лабиринтов...</div>
        </div>

        <div class="cw-timer-container ${timerEnabled ? '' : 'cw-timer-hidden'}">
          <div class="cw-timer-display" id="cw-timer-display">${formatTime(timerSeconds)}</div>
          <div class="cw-timer-setup">
            <input type="number" id="cw-timer-input" min="1" placeholder="Секунды (ручной режим)" />
            <button id="cw-timer-set">Установить</button>
            <button class="cw-stop" id="cw-timer-stop">Стоп</button>
          </div>
        </div>

        <div class="cw-settings-content">
          <div class="cw-color-picker">
            <input type="color" id="cw-color-input" value="${currentHighlightColor}" />
            <span>Цвет подсветки</span>
          </div>

          <div class="cw-timer-toggle">
            <input type="checkbox" id="cw-timer-enabled" ${timerEnabled ? 'checked' : ''} />
            <label for="cw-timer-enabled">Включить таймер (ручной)</label>
          </div>

          <div class="cw-auto-timer-toggle">
            <input type="checkbox" id="cw-auto-timer-enabled" ${autoTimerEnabled ? 'checked' : ''} />
            <label for="cw-auto-timer-enabled">Авто-таймер по сообщению перехода</label>
          </div>

          <div class="cw-sound-settings">
            <input type="text" id="cw-sound-input" placeholder="Base64 код звука (опционально)" />
            <button id="cw-sound-set">Установить звук</button>
            <div class="cw-sound-instruction" id="cw-sound-instruction">Инструкция по добавлению звука</div>
          </div>
        </div>

        <div class="cw-page-indicator" id="cw-page-indicator"></div>
      </div>
    `;
    document.body.appendChild(ui);

    makeDraggable(ui);

    // Навигация по ID
    document.getElementById('cw-prev').addEventListener('click', navigateToPreviousLocation);
    document.getElementById('cw-next').addEventListener('click', navigateToNextLocation);

    document.getElementById('cw-go').addEventListener('click', () => {
      const input = document.getElementById('cw-location-input');
      const newId = parseInt(input.value, 10);
      if (!isNaN(newId)) {
        navigateToLocation(newId);
        input.value = '';
      } else {
        alert('Пожалуйста, введите число');
      }
    });
    document.getElementById('cw-location-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') document.getElementById('cw-go').click();
    });

    // Цвет подсветки
    document.getElementById('cw-color-input').addEventListener('change', (e) => {
      currentHighlightColor = e.target.value;
      GM_setValue('highlightColor', currentHighlightColor);
      highlightCurrentCells();
    });

    // Таймер — ручной сетап
    document.getElementById('cw-timer-set').addEventListener('click', setTimer);
    document.getElementById('cw-timer-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') document.getElementById('cw-timer-set').click();
    });

    // Кнопка Стоп — общая для любого запущенного таймера
    document.getElementById('cw-timer-stop').addEventListener('click', stopTimer);

    // Переключатели
    document.getElementById('cw-timer-enabled').addEventListener('change', (e) => {
      timerEnabled = e.target.checked;
      GM_setValue('timerEnabled', timerEnabled);
      const timerContainer = document.querySelector('.cw-timer-container');
      if (timerContainer) {
        if (timerEnabled) timerContainer.classList.remove('cw-timer-hidden');
        else timerContainer.classList.add('cw-timer-hidden');
      }
      if (!timerEnabled && timerRunning && !autoTimerEnabled) {
        // если оба режима выключены — остановим
        stopTimer();
      }
    });

    document.getElementById('cw-auto-timer-enabled').addEventListener('change', (e) => {
      autoTimerEnabled = e.target.checked;
      GM_setValue('autoTimerEnabled', autoTimerEnabled);
      manageAutoChecker();
    });

    // Звук
    document.getElementById('cw-sound-set').addEventListener('click', setCustomSound);
    document.getElementById('cw-sound-instruction').addEventListener('click', showSoundInstruction);

    // Панель: свернуть/настройки
    document.getElementById('cw-toggle-ui').addEventListener('click', toggleUI);
    document.getElementById('cw-toggle-settings').addEventListener('click', toggleSettings);

    // Таймеры — восстановление
    initTimer();

    // Загрузка карт
    loadMapsFromGitHub()
      .then(() => {
        updateLabyrinthSelector();
        if (selectedLabyrinthPath) {
          tryRestoreSelectedLabyrinthAndId();
        }
      })
      .catch((error) => {
        const selector = document.getElementById('cw-labyrinth-selector');
        if (selector) {
          selector.innerHTML = `
            <div class="cw-error">
              Ошибка загрузки карт: ${error?.statusText || error?.message || error}
              <button class="cw-refresh-btn" id="cw-refresh-maps">Обновить</button>
            </div>`;
          document.getElementById('cw-refresh-maps')?.addEventListener('click', () => location.reload());
        }
      });

    updatePageIndicator();
    manageAutoChecker(); // старт/стоп опроса по авто-таймеру
  }

  function updateLabyrinthSelector() {
    const selector = document.getElementById('cw-labyrinth-selector');
    if (!selector) return;
    if (mapsLoaded) {
      selector.innerHTML = createLabyrinthSelector();
      initLabyrinthSelector();
      highlightSelectedLabyrinth();
    }
  }

  function createLabyrinthSelector() {
    let html = '';
    for (const [mainTitle, subsections] of Object.entries(labyrinthStructure || {})) {
      const mainExpanded = !!expandedSections[mainTitle];
      html += `
        <div class="cw-labyrinth-section ${mainExpanded ? 'cw-labyrinth-expanded' : ''}" data-main="${escapeHtml(mainTitle)}">
          <div class="cw-labyrinth-header" data-section="${escapeHtml(mainTitle)}">${escapeHtml(mainTitle)}</div>
          <div class="cw-labyrinth-content">
      `;
      for (const [subTitle, labyrinths] of Object.entries(subsections || {})) {
        const subKey = `${mainTitle}${subTitle}`;
        const subExpanded = !!expandedSections[subKey];
        html += `
          <div class="cw-labyrinth-subsection ${subExpanded ? 'cw-labyrinth-expanded' : ''}" data-sub="${escapeHtml(subTitle)}">
            <div class="cw-labyrinth-subheader" data-subsection="${escapeHtml(mainTitle)}${escapeHtml(subTitle)}">${escapeHtml(subTitle)}</div>
            <div class="cw-labyrinth-content">
        `;
        for (const labyrinth of (labyrinths || [])) {
          const attr = `${mainTitle}${subTitle}${labyrinth}`;
          html += `<div class="cw-labyrinth-item" data-labyrinth="${escapeHtml(attr)}">${escapeHtml(labyrinth)}</div>`;
        }
        html += `
            </div>
          </div>
        `;
      }
      html += `
          </div>
        </div>
      `;
    }
    return html;
  }

  function initLabyrinthSelector() {
    // Главные заголовки
    document.querySelectorAll('.cw-labyrinth-header').forEach((header) => {
      const mainKey = header.getAttribute('data-section');
      header._cw_click && header.removeEventListener('click', header._cw_click);
      header._cw_click = function () {
        const sectionDiv = this.parentElement;
        sectionDiv.classList.toggle('cw-labyrinth-expanded');
        const isExpanded = sectionDiv.classList.contains('cw-labyrinth-expanded');
        expandedSections[mainKey] = isExpanded;
        GM_setValue('expandedSections', expandedSections);
      };
      header.addEventListener('click', header._cw_click);
    });

    // Подзаголовки
    document.querySelectorAll('.cw-labyrinth-subheader').forEach((subHeader) => {
      const subKey = subHeader.getAttribute('data-subsection');
      subHeader._cw_click && subHeader.removeEventListener('click', subHeader._cw_click);
      subHeader._cw_click = function () {
        const parent = this.parentElement;
        parent.classList.toggle('cw-labyrinth-expanded');
        const isExpanded = parent.classList.contains('cw-labyrinth-expanded');
        expandedSections[subKey] = isExpanded;
        GM_setValue('expandedSections', expandedSections);
      };
      subHeader.addEventListener('click', subHeader._cw_click);
    });

    // Элементы (конечные карты)
    document.querySelectorAll('.cw-labyrinth-item').forEach((item) => {
      item._cw_click && item.removeEventListener('click', item._cw_click);
      item._cw_click = function () {
        document.querySelectorAll('.cw-labyrinth-item').forEach((i) => i.classList.remove('cw-labyrinth-selected'));
        this.classList.add('cw-labyrinth-selected');

        const pathStr = this.getAttribute('data-labyrinth'); // main+sub+labyrinthName
        const found = findPathInStructure(pathStr);
        if (!found) {
          console.warn('Не удалось найти путь лабиринта в структуре:', pathStr);
          return;
        }

        // раскрываем родительские секции
        expandedSections[found.mainLab] = true;
        expandedSections[`${found.mainLab}${found.subLab}`] = true;
        GM_setValue('expandedSections', expandedSections);

        loadLabyrinthMap(found.mainLab, found.subLab, found.labyrinthName);
        highlightSelectedLabyrinth();
      };
      item.addEventListener('click', item._cw_click);
    });
  }

  function findPathInStructure(concatPath) {
    for (const [mainTitle, subsections] of Object.entries(labyrinthStructure || {})) {
      for (const [subTitle, labs] of Object.entries(subsections || {})) {
        for (const lab of labs || []) {
          const concat = `${mainTitle}${subTitle}${lab}`;
          if (concat === concatPath) return { mainLab: mainTitle, subLab: subTitle, labyrinthName: lab };
        }
      }
    }
    return null;
  }

  function highlightSelectedLabyrinth() {
    if (!selectedLabyrinthPath) return;
    const items = document.querySelectorAll('.cw-labyrinth-item');
    items.forEach((item) => item.classList.remove('cw-labyrinth-selected'));
    const targetPath = `${selectedLabyrinthPath.mainLab}${selectedLabyrinthPath.subLab}${selectedLabyrinthPath.labyrinthName}`;
    const targetItem = Array.from(items).find((el) => el.getAttribute('data-labyrinth') === targetPath);
    if (targetItem) targetItem.classList.add('cw-labyrinth-selected');
    updatePageIndicator();
  }

  function tryRestoreSelectedLabyrinthAndId() {
    const { mainLab, subLab, labyrinthName } = selectedLabyrinthPath;
    if (
      labyrinthMaps &&
      labyrinthMaps[mainLab] &&
      labyrinthMaps[mainLab][subLab] &&
      labyrinthMaps[mainLab][subLab][labyrinthName]
    ) {
      highlightRules = labyrinthMaps[mainLab][subLab][labyrinthName];
      locationIds = Object.keys(highlightRules)
        .map((id) => parseInt(id, 10))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const currentPath = `${mainLab}${subLab}`;
      locationOrder = ASCENDING_PATHS.includes(currentPath) ? 'asc' : 'desc';
      if (locationOrder === 'desc') locationIds.reverse();

      if (!locationIds.includes(currentLocationId)) {
        currentLocationId = locationIds.length ? locationIds[0] : 0;
        GM_setValue('currentLocationId', currentLocationId);
      }
      updateUI();
      highlightCurrentCells();
    }
  }

  function loadLabyrinthMap(mainLab, subLab, labyrinthName) {
    selectedLabyrinthPath = { mainLab, subLab, labyrinthName };
    GM_setValue('selectedLabyrinthPath', selectedLabyrinthPath);

    if (
      labyrinthMaps &&
      labyrinthMaps[mainLab] &&
      labyrinthMaps[mainLab][subLab] &&
      labyrinthMaps[mainLab][subLab][labyrinthName]
    ) {
      highlightRules = labyrinthMaps[mainLab][subLab][labyrinthName];

      locationIds = Object.keys(highlightRules)
        .map((id) => parseInt(id, 10))
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b);

      const currentPath = `${mainLab}${subLab}`;
      locationOrder = ASCENDING_PATHS.includes(currentPath) ? 'asc' : 'desc';
      if (locationOrder === 'desc') locationIds.reverse();

      // Всегда начинаем с первого в выбранном порядке
      currentLocationId = locationIds.length ? locationIds[0] : 0;
      GM_setValue('currentLocationId', currentLocationId);

      saveAndUpdate();
      highlightCurrentCells();
    } else {
      console.log('Карта для выбранного лабиринта не найдена.');
    }
  }

  // =========================
  // ----- Навигация по ID ---
  // =========================
  function navigateToLocation(locationId) {
    locationId = parseInt(locationId, 10);
    if (locationIds.includes(locationId)) {
      currentLocationId = locationId;
      GM_setValue('currentLocationId', currentLocationId);
      saveAndUpdate();
      highlightCurrentCells();
    } else {
      console.log(`Локация с ID ${locationId} не найдена в текущей карте!`);
    }
  }

  function navigateToNextLocation() {
    const currentIndex = locationIds.indexOf(currentLocationId);
    if (currentIndex < 0) {
      alert('Текущая локация не найдена в карте.');
      return;
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex < locationIds.length) {
      navigateToLocation(locationIds[nextIndex]);
    } else {
      alert('Вы достигли последней локации!');
    }
  }

  function navigateToPreviousLocation() {
    const currentIndex = locationIds.indexOf(currentLocationId);
    if (currentIndex < 0) {
      alert('Текущая локация не найдена в карте.');
      return;
    }
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      navigateToLocation(locationIds[prevIndex]);
    } else {
      alert('Это первая локация!');
    }
  }

  function saveAndUpdate() {
    GM_setValue('currentLocationId', currentLocationId);
    updateUI();
  }

  function updateUI() {
    const locationElement = document.getElementById('cw-location-id');
    if (locationElement) {
      const orderIndicator = locationOrder === 'asc' ? '↗' : '↘';
      locationElement.innerHTML = `ID ${currentLocationId} <span class="cw-order-indicator">${orderIndicator}</span>`;
    }
    updatePageIndicator();
  }

  // Индикатор страницы/маршрута
  function updatePageIndicator() {
    const pageIndicator = document.getElementById('cw-page-indicator');
    if (!pageIndicator) return;
    if (selectedLabyrinthPath && selectedLabyrinthPath.mainLab) {
      pageIndicator.textContent = `${selectedLabyrinthPath.mainLab} — ${selectedLabyrinthPath.subLab} — ${selectedLabyrinthPath.labyrinthName}`;
    } else {
      const pageName = getCurrentPageName();
      pageIndicator.textContent = pageName || 'Игровая';
    }
  }

  function getCurrentPageName() {
    const url = window.location.href;
    if (url.includes('/cw3')) return 'Игровая';
    if (url.includes('/cat')) return 'Кот';
    if (url.includes('/chat')) return 'Чат';
    if (url.includes('/ls')) return 'ЛС';
    return '';
  }

  // =========================
  // ----- Подсветка клеток --
  // =========================
  function getCellByCoord(row, col) {
    const table = document.getElementById('cages');
    if (!table) return null;
    const r = table.rows[row - 1];
    if (!r) return null;
    return r.cells[col - 1] || null;
  }

  function hexWithAlpha(hex, alpha) {
    if (!hex || hex[0] !== '#' || (hex.length !== 7 && hex.length !== 4)) return hex;
    try {
      if (hex.length === 7) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
      } else {
        const r = parseInt(hex[1] + hex[1], 16);
        const g = parseInt(hex[2] + hex[2], 16);
        const b = parseInt(hex[3] + hex[3], 16);
        return `rgba(${r},${g},${b},${alpha})`;
      }
    } catch (e) {
      return hex;
    }
  }

  function styleCell(cell) {
    cell.style.backgroundColor = hexWithAlpha(currentHighlightColor, 0.5);
    cell.style.boxShadow = `0 0 10px 5px ${currentHighlightColor}`;
    cell.classList.add('highlighted-cell');
  }

  function removeHighlightsByCoords() {
    try {
      highlightedCells.forEach((cell) => {
        cell.style.backgroundColor = '';
        cell.style.boxShadow = '';
        cell.classList.remove('highlighted-cell');
        cell.removeEventListener('click', handleCellClick);
      });
    } catch (_) {}

    if (Array.isArray(highlightedCellCoords) && highlightedCellCoords.length) {
      highlightedCellCoords.forEach((coord) => {
        const cell = getCellByCoord(coord.row, coord.col);
        if (cell) {
          cell.style.backgroundColor = '';
          cell.style.boxShadow = '';
          cell.classList.remove('highlighted-cell');
          cell.removeEventListener('click', handleCellClick);
        }
      });
    }
    highlightedCells = [];
    highlightedCellCoords = [];
    GM_setValue('highlightedCellCoords', highlightedCellCoords);
  }

  function highlightCurrentCells() {
    removeHighlightsByCoords();

    const rule = highlightRules && highlightRules[currentLocationId];
    if (!rule) {
      console.log(`Локация с ID ${currentLocationId} не найдена в данных подсветки!`);
      highlightedCellCoords = [];
      GM_setValue('highlightedCellCoords', highlightedCellCoords);
      return;
    }

    const table = document.getElementById('cages');
    if (!table) {
      console.log('Таблица клеток не найдена на этой странице');
      return;
    }

    try {
      const coordsToHighlight = [];
      const cellsToHighlight = [];

      if (Array.isArray(rule)) {
        rule.forEach((cell) => {
          const targetCell = getCellByCoord(cell.row, cell.col);
          if (targetCell) {
            styleCell(targetCell);
            cellsToHighlight.push(targetCell);
            coordsToHighlight.push({ row: parseInt(cell.row, 10), col: parseInt(cell.col, 10) });
          }
        });
      } else if (rule && rule.row && rule.col) {
        const targetCell = getCellByCoord(rule.row, rule.col);
        if (targetCell) {
          styleCell(targetCell);
          cellsToHighlight.push(targetCell);
          coordsToHighlight.push({ row: parseInt(rule.row, 10), col: parseInt(rule.col, 10) });
        }
      }

      highlightedCells = cellsToHighlight;
      highlightedCellCoords = coordsToHighlight;
      GM_setValue('highlightedCellCoords', highlightedCellCoords);

      highlightedCells.forEach((cell) => {
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick);
      });
    } catch (e) {
      console.log(`Не удалось подсветить клетки для локации ${currentLocationId}`, e);
    }
  }

  // При клике по подсвеченной клетке: двигаемся дальше по маршруту.
  // Старт таймера:
  // - если включён авто-таймер — НЕ запускаем руками (ждём #block_mess, как в AutoTimer);
  // - если авто-таймер выключен, но включён ручной — запускаем на заданные секунды.
  function handleCellClick() {
    navigateToNextLocation();

    if (autoTimerEnabled) {
      // Ничего не делаем: checkBlockMess сам подхватит сообщение «Переход закончится через ...»
      // и запустит отсчёт, сохранив конец в localStorage.
      return;
    }

    if (timerEnabled && timerSeconds > 0) {
      startTimer(timerSeconds);
    }
  }

  // =========================
  // ----- Таймер ------------
  // =========================

  // Удобное форматирование mm:ss
  function formatTime(totalSeconds) {
    const m = Math.floor((totalSeconds || 0) / 60);
    const s = (totalSeconds || 0) % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Универсальный старт таймера:
  // - сохраняем время конца в localStorage (как в AutoTimer),
  // - зеркалим в GM_* для UI,
  // - запускаем 1-секундный тикер.
  function startTimer(seconds) {
    if (timerInterval) clearInterval(timerInterval);

    const secs = Math.max(0, parseInt(seconds || 0, 10) || 0);
    const end = Date.now() + secs * 1000;

    // Ключевой момент AutoTimer — хранить в localStorage
    localStorage.setItem(LS_AUTOTIMER_END_KEY, String(end));

    // Дублируем в GM_* ради UI/состояния «Карты»
    timerEndTime = end;
    timerRunning = secs > 0;
    notificationShown = false;
    timerSeconds = secs;

    GM_setValue('timerEndTime', timerEndTime);
    GM_setValue('timerRunning', timerRunning);
    GM_setValue('notificationShown', notificationShown);
    GM_setValue('timerSeconds', timerSeconds);

    updateTimerDisplay();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
    timerSeconds = 0;
    notificationShown = false;

    // убираем ключ AutoTimer
    localStorage.removeItem(LS_AUTOTIMER_END_KEY);

    GM_setValue('timerRunning', timerRunning);
    GM_setValue('timerSeconds', timerSeconds);
    GM_setValue('notificationShown', notificationShown);

    updateTimerDisplay();
  }

  // Ручная установка времени (без запуска)
  function setTimer() {
    const input = document.getElementById('cw-timer-input');
    const seconds = parseInt(input.value, 10);
    if (isNaN(seconds) || seconds <= 0) {
      alert('Пожалуйста, введите положительное число секунд');
      return;
    }
    timerSeconds = seconds;
    timerRunning = false; // не запускаем
    GM_setValue('timerSeconds', timerSeconds);
    GM_setValue('timerRunning', timerRunning);
    updateTimerDisplay();
  }

  // Восстановление: при загрузке читаем localStorage('cw_autotimer_end') и, если он в будущем, продолжаем отсчёт
  function initTimer() {
    const savedEndLS = localStorage.getItem(LS_AUTOTIMER_END_KEY);
    const savedEndGM = +GM_getValue('timerEndTime', 0);

    let effectiveEnd = 0;
    if (savedEndLS && +savedEndLS > Date.now()) {
      effectiveEnd = +savedEndLS;
    } else if (savedEndGM && savedEndGM > Date.now()) {
      effectiveEnd = savedEndGM;
      // синхронизируем с localStorage на всякий случай
      localStorage.setItem(LS_AUTOTIMER_END_KEY, String(savedEndGM));
    }

    if (effectiveEnd > Date.now()) {
      timerEndTime = effectiveEnd;
      timerRunning = true;
      notificationShown = false;
      timerSeconds = Math.ceil((effectiveEnd - Date.now()) / 1000);
      GM_setValue('timerEndTime', timerEndTime);
      GM_setValue('timerRunning', timerRunning);
      GM_setValue('notificationShown', notificationShown);
      GM_setValue('timerSeconds', timerSeconds);
      updateTimerDisplay();
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, 1000);
    } else {
      // нет активного таймера
      stopTimer();
    }
  }

  function updateTimer() {
    const savedEnd = localStorage.getItem(LS_AUTOTIMER_END_KEY);
    const target = savedEnd ? +savedEnd : timerEndTime;
    const left = Math.max(0, Math.ceil((target - Date.now()) / 1000));

    if (left <= 0) {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = null;
      timerRunning = false;
      timerSeconds = 0;

      // AutoTimer — без алертов. В «Карте» — звук (по желанию).
      if (!notificationShown) {
        playNotificationSound();
        notificationShown = true;
      }

      localStorage.removeItem(LS_AUTOTIMER_END_KEY);
      GM_setValue('timerRunning', timerRunning);
      GM_setValue('timerSeconds', timerSeconds);
      GM_setValue('notificationShown', notificationShown);
      updateTimerDisplay();
    } else {
      timerRunning = true;
      timerSeconds = left;
      GM_setValue('timerRunning', timerRunning);
      GM_setValue('timerSeconds', timerSeconds);
      updateTimerDisplay();
    }
  }

  function updateTimerDisplay() {
    const display = document.getElementById('cw-timer-display');
    if (display) display.textContent = formatTime(timerSeconds);
  }

  // Парсер времени как в AutoTimer: «X ч Y мин Z с», «Y мин Z с», «Z с»
  function parseTimeToSeconds(text) {
    if (!text) return 0;
    text = text.replace(/\u00A0/g, ' ').trim();
    let m;
    if ((m = text.match(/(\d+)\s*ч\s*(\d+)\s*мин\s*(\d+)\s*с/))) {
      return (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]);
    }
    if ((m = text.match(/(\d+)\s*мин\s*(\d+)\s*с/))) {
      return (+m[1]) * 60 + (+m[2]);
    }
    if ((m = text.match(/(\d+)\s*с/))) {
      return +m[1];
    }
    return 0;
  }

  // =========================
  // ----- Авто-таймер -------
  // =========================
  // Периодически проверяем появление #block_mess и, если там есть время, стартуем таймер.
  function checkBlockMess() {
    if (!autoTimerEnabled) return;

    // если таймер уже активен — новый не запускаем
    const lsEnd = localStorage.getItem(LS_AUTOTIMER_END_KEY);
    if (lsEnd && +lsEnd > Date.now()) return;

    const block = document.querySelector('#block_mess') || document.querySelector('.blockMess');
    if (block) {
      const text = block.textContent || block.innerText || '';
      // ищем любой из форматов «... ч ... мин ... с» | «... мин ... с» | «... с»
      const match = text.match(/(\d+\s*ч\s*\d+\s*мин\s*\d+\s*с|\d+\s*мин\s*\d+\s*с|\d+\s*с)/);
      if (match) {
        const secs = parseTimeToSeconds(match[0]);
        if (secs > 0) startTimer(secs);
      }
    }
  }

  function manageAutoChecker() {
    // запускаем/останавливаем setInterval опроса по авто-таймеру
    if (autoTimerEnabled) {
      if (autoCheckInterval) clearInterval(autoCheckInterval);
      autoCheckInterval = setInterval(checkBlockMess, 1000);
    } else {
      if (autoCheckInterval) {
        clearInterval(autoCheckInterval);
        autoCheckInterval = null;
      }
    }
  }

  // =========================
  // ----- Прочее ------------
  // =========================
  function setCustomSound() {
    const input = document.getElementById('cw-sound-input');
    const base64 = (input.value || '').trim();
    if (!base64) {
      alert('Пожалуйста, введите base64 код звука');
      return;
    }
    try {
      atob(base64); // проверка формата
      notificationSound = base64;
      GM_setValue('notificationSound', notificationSound);
      alert('Звук успешно установлен!');
    } catch (e) {
      alert('Ошибка: введенная строка не является валидным base64');
    }
  }

  function showSoundInstruction() {
    const modal = document.createElement('div');
    modal.className = 'instruction-modal';
    modal.innerHTML = `
      <h3>Как добавить свой звук</h3>
      <p>1. Найдите звуковой файл (mp3, wav, ogg) и конвертируйте его в base64.</p>
      <p>2. Можно использовать онлайн-конвертеры, например <a href="https://base64.guru/converter/encode/audio" target="_blank">base64.guru</a>.</p>
      <p>3. Скопируйте полученный base64 код и вставьте в поле выше.</p>
      <p>4. Нажмите «Установить звук».</p>
      <button id="cw-close-instruction">Закрыть</button>
    `;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    document.getElementById('cw-close-instruction').addEventListener('click', () => {
      modal.remove();
      overlay.remove();
    });
  }

  function toggleUI() {
    isUIMinimized = !isUIMinimized;
    GM_setValue('isUIMinimized', isUIMinimized);
    const ui = document.querySelector('.cw-highlight-ui');
    if (ui) {
      if (isUIMinimized) ui.classList.add('cw-minimized');
      else ui.classList.remove('cw-minimized');
    }
  }

  function toggleSettings() {
    isSettingsMinimized = !isSettingsMinimized;
    GM_setValue('isSettingsMinimized', isSettingsMinimized);
    const ui = document.querySelector('.cw-highlight-ui');
    if (ui) {
      if (isSettingsMinimized) ui.classList.remove('cw-settings-visible');
      else ui.classList.add('cw-settings-visible');
    }
  }

  function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.cw-ui-header');
    if (!header) return;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      const newTop = (element.offsetTop - pos2) + 'px';
      const newLeft = (element.offsetLeft - pos1) + 'px';
      element.style.top = newTop;
      element.style.left = newLeft;
      element.style.right = 'auto';
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      uiPosition = { top: element.style.top, left: element.style.left };
      GM_setValue('uiPosition', uiPosition);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // =========================
  // ----- Инициализация -----
  // =========================
  window.addEventListener('load', function () {
    createUI();
  });

  // Отслеживание SPA-навигации
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      currentPageUrl = url;
      updatePageIndicator();
      setTimeout(() => {
        highlightCurrentCells();
      }, 500);
    }
  }).observe(document, { subtree: true, childList: true });

})();
