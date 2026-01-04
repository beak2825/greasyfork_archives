// ==UserScript==
// @name         Monitoring Problems with Google Sheets CSV
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Automatically create problems with schedule from Google Sheets CSV
// @author       evseevk17
// @include      *://dispatcher.dostavista.ru/dispatcher/orders/view/*
// @include      *://dispatcher.dostavista.ru/dispatcher/problems/add/0/order_id*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557667/Monitoring%20Problems%20with%20Google%20Sheets%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/557667/Monitoring%20Problems%20with%20Google%20Sheets%20CSV.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let assigneeId = parseInt(localStorage.getItem('assignee_id'));

  // Настройки Google Sheets CSV
  const CSV_CONFIG = {
    csvUrl: localStorage.getItem('csv_url') || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTuzOhjhDXhCkRJsjxm2qJBCUzQfxjmNudIuOoZtBCNijcFRVUGdhXWuQg271TCsW2_mjLvVSZGd8A/pub?gid=0&single=true&output=csv',
    dateColumnName: localStorage.getItem('date_column_name') || 'Дата', // Название колонки с датой
    assigneeColumnName: localStorage.getItem('assignee_column_name') || 'Ответственный', // Название колонки с ответственным
    fallbackAssigneeId: localStorage.getItem('fallback_assignee_id') || 0 // ID на случай, если не найдено в расписании
  };

  // Кэш для расписания
  let scheduleCache = {
    data: null,
    lastUpdate: 0,
    ttl: 30 * 60 * 1000 // 30 минут
  };

  // Список проблем
  const problems = [
    // Для категории Monitoring - проблемы с графиком
    {
      id: 508,
      name: 'Проблемы с приложением',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 509,
      name: 'Пробки/ждал транспорт',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 510,
      name: 'Долгая выдача заказа',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 511,
      name: 'У клиента тех.сбой',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 512,
      name: 'Ожидание клиента',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 513,
      name: 'Получателя нет на месте',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 514,
      name: 'Заказ поступил с опозданием',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 515,
      name: 'Нет кнопки редактировать, время согласовано',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 516,
      name: 'Поломка транспорта',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 517,
      name: 'Некорректный интервал времени в заказе',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 518,
      name: 'Курьер не ответил на звонок',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 519,
      name: 'Выполняет несколько заказов',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 520,
      name: 'Задержали по другому заказу',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 521,
      name: 'Передумал выполнять заказ',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 522,
      name: 'Некорректное время в слоте',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 523,
      name: 'Игнорировал время в заказе',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 524,
      name: 'Форс-мажор/Погода',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    {
      id: 525,
      name: 'Забыл про заказ',
      category: 'Monitoring',
      assignee: 0,
      status: 10,
    },
    // Для категории Порча/утрата отправления
    {
      id: 229,
      name: 'Курьер повредил отправление',
      category: 'Порча/утрата отправления',
      assignee: 1810087,
      status: 1
    },
    {
      id: 243,
      name: 'Курьер утратил отправление',
      category: 'Порча/утрата отправления',
      assignee: 1810087,
      status: 1
    },
    {
      id: 259,
      name: 'Курьер пропал с отправлением',
      category: 'Порча/утрата отправления',
      assignee: 1810087,
      status: 1
    },
    // Для категории Поведение/общение
    {
      id: 257,
      name: 'Курьер грубил/хамил/спорил с диспетчером',
      category: 'Поведение/общение',
      status: 1,
      schedule2_2: true,
    },
    {
      id: 301,
      name: 'Курьер дезинформировал диспетчера',
      category: 'Поведение/общение',
      status: 1,
      schedule2_2: true,
    },
    {
      id: 268,
      name: 'Курьер пьян/неадекватен',
      category: 'Поведение/общение',
      status: 1,
      schedule2_2: true,
    },
    // Для категории Мошенничество/обман
    {
      id: 502,
      name: 'Фиктивное прибытие на адрес',
      category: 'Мошенничество/обман',
      assignee: 0,
      status: 1
    },
    {
      id: 285,
      name: 'Курьер передал свой аккаунт третьему лицу',
      category: 'Мошенничество/обман',
      status: 1,
      schedule2_2: true,
    },
    // Для категории Отдел безопасности
    {
      id: 346,
      name: 'Забрал заказ неустановленный курьер',
      category: 'Отдел безопасности',
      assignee: 1810087,
      status: 1
    },
    // Для категории Прочее
    {
      id: 505,
      name: 'Блокировка до актуализации номера телефона',
      category: 'Прочее',
      status: 1,
      schedule2_2: true,
    },
  ];

  // Функция для получения данных из Google Sheets CSV
  async function fetchScheduleFromCSV() {
    const now = Date.now();

    if (scheduleCache.data && (now - scheduleCache.lastUpdate) < scheduleCache.ttl) {
      return scheduleCache.data;
    }

    try {
      const { csvUrl } = CSV_CONFIG;

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: csvUrl,
          onload: function(response) {
            if (response.status === 200) {
              try {
                const data = parseCSVData(response.responseText);
                scheduleCache.data = data;
                scheduleCache.lastUpdate = now;
                resolve(data);
              } catch (error) {
                console.error('Ошибка парсинга CSV:', error);
                reject(error);
              }
            } else {
              console.error('Ошибка загрузки CSV:', response.status, response.statusText);
              reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
            }
          },
          onerror: function(error) {
            console.error('Ошибка сети при загрузке CSV:', error);
            reject(error);
          },
          timeout: 10000
        });
      });
    } catch (error) {
      console.error('Ошибка при загрузке расписания:', error);
      return null;
    }
  }

  // Функция для парсинга CSV данных
  function parseCSVData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      console.warn('CSV файл пуст или содержит только заголовки');
      return {};
    }

    const headers = lines[0].split(',').map(h => h.trim());

    const dateColumnIndex = headers.findIndex(h =>
      h.toLowerCase().includes(CSV_CONFIG.dateColumnName.toLowerCase())
    );

    const assigneeColumnIndex = headers.findIndex(h =>
      h.toLowerCase().includes(CSV_CONFIG.assigneeColumnName.toLowerCase())
    );

    if (dateColumnIndex === -1 || assigneeColumnIndex === -1) {
      console.error('Не найдены нужные колонки в CSV');
      return {};
    }

    const schedule = {};

    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(',').map(cell => cell.trim());
      if (cells.length > Math.max(dateColumnIndex, assigneeColumnIndex)) {
        const dateStr = cells[dateColumnIndex];
        const assigneeStr = cells[assigneeColumnIndex];

        if (dateStr && assigneeStr) {
          try {
            const parsedDate = parseDate(dateStr);
            if (parsedDate) {
              const assigneeId = parseAssigneeId(assigneeStr);
              if (assigneeId) {
                const dateKey = formatDateForSchedule(parsedDate);
                schedule[dateKey] = assigneeId;
              }
            }
          } catch (error) {
            console.warn(`Ошибка парсинга строки ${i}:`, error);
          }
        }
      }
    }

    return schedule;
  }

  // Функция для парсинга даты из разных форматов
  function parseDate(dateStr) {
    if (!dateStr) return null;

    dateStr = dateStr.replace(/['"]/g, '').trim();

    const formats = [
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/,
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{4})-(\d{1,2})-(\d{1,2})/,
      /(\d{1,2})\.(\d{1,2})\.(\d{2})/,
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        let day, month, year;

        if (format === formats[3]) {
          day = parseInt(match[1], 10);
          month = parseInt(match[2], 10) - 1;
          year = 2000 + parseInt(match[3], 10);
        } else if (format === formats[2]) {
          year = parseInt(match[1], 10);
          month = parseInt(match[2], 10) - 1;
          day = parseInt(match[3], 10);
        } else {
          day = parseInt(match[1], 10);
          month = parseInt(match[2], 10) - 1;
          year = parseInt(match[3], 10);
        }

        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }

    return null;
  }

  // Функция для форматирования даты для расписания (YYYY-MM-DD)
  function formatDateForSchedule(date) {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Функция для парсинга ID ответственного
  function parseAssigneeId(assigneeStr) {
    if (!assigneeStr) return null;

    assigneeStr = assigneeStr.replace(/['"]/g, '').trim();

    const match = assigneeStr.match(/\d+/);
    if (match) {
      return parseInt(match[0], 10);
    }

    return null;
  }

  // Функция для получения ответственного на сегодня из расписания
  async function getAssigneeForToday() {
    try {
      const schedule = await fetchScheduleFromCSV();
      if (!schedule || Object.keys(schedule).length === 0) {
        return CSV_CONFIG.fallbackAssigneeId || null;
      }

      const today = new Date();
      const todayStr = formatDateForSchedule(today);

      let assignee = schedule[todayStr];

      if (assignee) {
        return assignee;
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDateForSchedule(yesterday);
      assignee = schedule[yesterdayStr];

      if (assignee) {
        return assignee;
      }

      return CSV_CONFIG.fallbackAssigneeId || null;
    } catch (error) {
      console.error('Ошибка при получении ответственного:', error);
      return CSV_CONFIG.fallbackAssigneeId || null;
    }
  }

  // Функция для обновления Chosen select'а
  function updateChosenSelect(selectElement) {
    setTimeout(() => {
      if (typeof jQuery !== 'undefined' && jQuery.fn.chosen) {
        jQuery(selectElement).trigger('chosen:updated');
      }
      if (selectElement._chosen) {
        selectElement._chosen.update();
      }
    }, 100);
  }

  // Функция для получения ID текущего пользователя
  function getCurrentUserId() {
    const userNameElement = document.querySelector('.user-full-name a');
    if (userNameElement) {
      const userName = userNameElement.textContent.trim();
      const dispatcherSelect = document.querySelector('#dispatcher_id');
      if (dispatcherSelect) {
        const options = dispatcherSelect.querySelectorAll('option');
        for (let option of options) {
          if (option.textContent.includes(userName)) {
            return parseInt(option.value);
          }
        }
      }
    }
    return null;
  }

  // Функция для создания интерфейса выбора проблемы
  async function createProblemUI() {
    let order_id;

    const match = /\d+/.exec(document.URL);
    if (match) {
      order_id = +match[0];
    } else {
      console.error('Order ID not found in URL');
      return;
    }

    let courier_id;

    try {
      const courier = document.querySelector('.courier-block');
      const courier_block = courier.getElementsByTagName('div')[0];
      courier_id = courier_block.getElementsByTagName('a')[0].href;
      courier_id = +/\d+/.exec(courier_id);
    } catch (err) {
      courier_id = null;
      console.error('Courier ID extraction error:', err.message);
    }

    localStorage.setItem('courier_id', courier_id);

    const generalView = document.querySelector(
      '.heading-section > .additional > .autocomplete'
    );
    if (!generalView) return;

    const container = document.createElement('div');
    container.style.cssText =
      'margin-top: 20px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;';

    const title = document.createElement('h3');
    title.textContent = 'Проблемы Мониторинга';
    title.style.cssText = 'margin-bottom: 10px; font-size: 16px;';

    // Минимальный статус загрузки расписания
    const statusDiv = document.createElement('div');
    statusDiv.id = 'schedule-status';
    statusDiv.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 10px; font-style: italic;';
    statusDiv.textContent = 'Загрузка расписания...';

    container.appendChild(title);
    container.appendChild(statusDiv);

    // Фоновая загрузка расписания
    setTimeout(async () => {
      try {
        const schedule = await fetchScheduleFromCSV();
        if (schedule && Object.keys(schedule).length > 0) {
          statusDiv.textContent = '✓ Расписание загружено';
          statusDiv.style.color = '#4CAF50';
        } else {
          statusDiv.textContent = 'Расписание не загружено';
          statusDiv.style.color = '#FF9800';
        }
      } catch (error) {
        statusDiv.textContent = 'Ошибка загрузки расписания';
        statusDiv.style.color = '#f44336';
      }
    }, 100);

    const problemSelectContainer = document.createElement('div');
    problemSelectContainer.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';

    const problemSelect = document.createElement('select');
    problemSelect.style.cssText =
      'width: 70%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px;';

    const groupedOptions = problems.reduce((acc, problem) => {
      if (!acc[problem.category]) acc[problem.category] = [];
      acc[problem.category].push(problem);
      return acc;
    }, {});

    let optionsHTML = `<option value="">Выберите тип проблемы</option>`;
    for (const category in groupedOptions) {
      optionsHTML += `<optgroup label="${category}">`;
      groupedOptions[category].forEach((problem) => {
        optionsHTML += `<option value="${problem.id}">${problem.name}</option>`;
      });
      optionsHTML += `</optgroup>`;
    }

    problemSelect.innerHTML = optionsHTML;

    const settingsButton = document.createElement('button');
    settingsButton.textContent = '⚙️';
    settingsButton.style.cssText =
      'padding: 8px 12px; background: #ddd; color: black; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;';

    settingsButton.addEventListener('click', function () {
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999;';

      const settingsMenu = document.createElement('div');
      settingsMenu.style.cssText = 'position: fixed; background: white; border: 1px solid #ddd; padding: 15px; z-index: 1000; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 350px; max-height: 80vh; overflow-y: auto;';

      settingsMenu.style.top = '50%';
      settingsMenu.style.left = '50%';
      settingsMenu.style.transform = 'translate(-50%, -50%)';

      settingsMenu.innerHTML = `
        <h4 style="margin-top: 0;">Настройки CSV расписания</h4>
        <div style="margin-bottom: 10px;">
          <label>URL CSV таблицы:</label>
          <input type="text" id="csvUrl" value="${CSV_CONFIG.csvUrl}" style="width: 100%; margin-top: 5px; padding: 5px;">
        </div>
        <div style="margin-bottom: 10px;">
          <label>Название колонки с датой:</label>
          <input type="text" id="dateColumnName" value="${CSV_CONFIG.dateColumnName}" style="width: 100%; margin-top: 5px; padding: 5px;">
        </div>
        <div style="margin-bottom: 10px;">
          <label>Название колонки с ответственным:</label>
          <input type="text" id="assigneeColumnName" value="${CSV_CONFIG.assigneeColumnName}" style="width: 100%; margin-top: 5px; padding: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
          <label>ID ответственного по умолчанию (если нет в расписании):</label>
          <input type="number" id="fallbackAssigneeId" value="${CSV_CONFIG.fallbackAssigneeId}" style="width: 100%; margin-top: 5px; padding: 5px;">
        </div>
        <div style="margin-bottom: 15px;">
          <label>Общий ответственный (для проблем без графика):</label>
          <input type="number" id="generalAssignee" value="${assigneeId || ''}" style="width: 100%; margin-top: 5px; padding: 5px;">
        </div>
        <div style="display: flex; justify-content: space-between;">
          <button id="testConnection" style="padding: 5px 15px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">Тест подключения</button>
          <button id="saveSettings" style="padding: 5px 15px; background: #4caf50; color: white; border: none; border-radius: 3px; cursor: pointer;">Сохранить</button>
          <button id="closeSettings" style="padding: 5px 15px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">Закрыть</button>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(settingsMenu);

      document.getElementById('csvUrl').focus();

      document.getElementById('testConnection').addEventListener('click', async function() {
        const testUrl = document.getElementById('csvUrl').value;
        const testDateColumn = document.getElementById('dateColumnName').value;
        const testAssigneeColumn = document.getElementById('assigneeColumnName').value;

        try {
          GM_xmlhttpRequest({
            method: 'GET',
            url: testUrl,
            onload: function(response) {
              if (response.status === 200) {
                const lines = response.responseText.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());

                const dateIndex = headers.findIndex(h =>
                  h.toLowerCase().includes(testDateColumn.toLowerCase())
                );
                const assigneeIndex = headers.findIndex(h =>
                  h.toLowerCase().includes(testAssigneeColumn.toLowerCase())
                );

                if (dateIndex === -1 || assigneeIndex === -1) {
                  alert(`❌ Не найдены колонки!\nИщем: "${testDateColumn}" и "${testAssigneeColumn}"\nЗаголовки: ${headers.join(', ')}`);
                } else {
                  const recordCount = lines.length - 1;
                  alert(`✅ Подключение успешно!\n\nНайдено записей: ${recordCount}\n\nКолонка даты: ${headers[dateIndex]}\nКолонка ответственного: ${headers[assigneeIndex]}`);
                }
              } else {
                alert(`❌ Ошибка: ${response.status} ${response.statusText}`);
              }
            },
            onerror: function() {
              alert('❌ Ошибка сети при подключении');
            }
          });
        } catch (error) {
          alert('❌ Ошибка: ' + error.message);
        }
      });

      document.getElementById('saveSettings').addEventListener('click', function() {
        const newCsvUrl = document.getElementById('csvUrl').value;
        const newDateColumnName = document.getElementById('dateColumnName').value;
        const newAssigneeColumnName = document.getElementById('assigneeColumnName').value;
        const newFallbackAssigneeId = parseInt(document.getElementById('fallbackAssigneeId').value) || 0;
        const newGeneralAssignee = parseInt(document.getElementById('generalAssignee').value) || 0;

        CSV_CONFIG.csvUrl = newCsvUrl;
        CSV_CONFIG.dateColumnName = newDateColumnName;
        CSV_CONFIG.assigneeColumnName = newAssigneeColumnName;
        CSV_CONFIG.fallbackAssigneeId = newFallbackAssigneeId;

        localStorage.setItem('csv_url', newCsvUrl);
        localStorage.setItem('date_column_name', newDateColumnName);
        localStorage.setItem('assignee_column_name', newAssigneeColumnName);
        localStorage.setItem('fallback_assignee_id', newFallbackAssigneeId);

        if (newGeneralAssignee) {
          assigneeId = newGeneralAssignee;
          localStorage.setItem('assignee_id', assigneeId);
        }

        scheduleCache.data = null;
        scheduleCache.lastUpdate = 0;

        alert('Настройки сохранены! Расписание будет обновлено.');
        document.body.removeChild(settingsMenu);
        document.body.removeChild(overlay);
        location.reload();
      });

      document.getElementById('closeSettings').addEventListener('click', function() {
        document.body.removeChild(settingsMenu);
        document.body.removeChild(overlay);
      });

      overlay.addEventListener('click', function() {
        document.body.removeChild(settingsMenu);
        document.body.removeChild(overlay);
      });
    });

    const createProblemButton = document.createElement('button');
    createProblemButton.textContent = 'Создать';
    createProblemButton.style.cssText =
      'padding: 8px 12px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;';

    createProblemButton.addEventListener('click', async function () {
      const selectedProblemId = problemSelect.value;
      if (!selectedProblemId) {
        alert('Выберите тип проблемы.');
        return;
      }

      const problem = problems.find((p) => p.id == selectedProblemId);
      if (!problem) {
        console.error('Не удалось найти выбранную проблему');
        return;
      }

      let problemAssignee = problem.assignee;

      if (problem.schedule2_2) {
        const todayAssignee = await getAssigneeForToday();

        if (todayAssignee) {
          problemAssignee = todayAssignee;
        } else {
          problemAssignee = problem.assignee || 0;
        }
      }

      localStorage.setItem(
        'selectedProblem',
        JSON.stringify({
          id: problem.id,
          name: problem.name,
          assignee: problemAssignee,
          comment: problem.comment,
          status: problem.status,
          schedule2_2: problem.schedule2_2 || false
        })
      );

      const returl = encodeURIComponent(
        `/dispatcher/orders/problems/${order_id}`
      );

      const newUrl = `/dispatcher/problems/add/0/order_id/${order_id}/returl/${returl}`;
      window.location.href = newUrl;
    });

    problemSelectContainer.appendChild(problemSelect);
    problemSelectContainer.appendChild(settingsButton);
    problemSelectContainer.appendChild(createProblemButton);

    container.appendChild(problemSelectContainer);
    generalView.appendChild(container);
  }

  // Функция для предзаполнения формы на странице создания проблемы
  function prefillProblemForm() {
    const problemData = localStorage.getItem('selectedProblem');
    if (!problemData) {
      console.warn('Нет данных о проблеме в localStorage.');
      return;
    }

    const problem = JSON.parse(problemData);
    if (!problem || typeof problem !== 'object') {
      console.error('Некорректные данные проблемы в localStorage.');
      return;
    }

    const problemTypeInput = document.querySelector('select[name="type_id"]');
    const commentInput = document.querySelector('textarea[name="comment"]');
    const courierIdSelect = document.querySelector('#courier_id');
    const statusIdSelect = document.querySelector('#status_id');
    const dispatcherIdSelect = document.querySelector('#dispatcher_id');
    const causerIdSelect = document.querySelector('#causer_id-optgroup-courier');

    const courierId = parseInt(localStorage.getItem('courier_id'));

    if (isNaN(courierId)) {
      console.warn('Courier ID не найден или некорректен.');
    } else {
      const courierOption = courierIdSelect.querySelector(
        `option[value='${courierId}']`
      );
      if (courierOption) {
        courierOption.setAttribute('selected', 'selected');
        updateChosenSelect(courierIdSelect);
      } else {
        console.warn(`Опция с Courier ID ${courierId} не найдена.`);
      }
    }

    const statusOption = statusIdSelect.querySelector(
      `option[value='${problem.status}']`
    );
    if (statusOption) {
      statusOption.setAttribute('selected', 'selected');
      updateChosenSelect(statusIdSelect);
    } else {
      console.warn(`Опция с Status ID ${problem.status} не найдена.`);
    }

    if (problemTypeInput) {
      problemTypeInput.value = problem.id;
      problemTypeInput.dispatchEvent(new Event('change'));
      updateChosenSelect(problemTypeInput);
    } else {
      console.warn('Селект type_id не найден.');
    }

    if (commentInput) {
      commentInput.value = problem.comment || '';
    } else {
      console.error('Поле ввода комментария не найдено.');
    }

    if (dispatcherIdSelect) {
      let assigneeIdToSet = null;

      if (problem.schedule2_2) {
        assigneeIdToSet = problem.assignee;
      }
      else if (problem.assignee === 0) {
        const currentUserId = getCurrentUserId();
        if (currentUserId) {
          assigneeIdToSet = currentUserId;
        } else {
          console.warn('Не удалось определить ID текущего пользователя');
        }
      }
      else if (!isNaN(problem.assignee) && problem.assignee !== 0) {
        assigneeIdToSet = problem.assignee;
      }

      if (assigneeIdToSet !== null) {
        dispatcherIdSelect.value = assigneeIdToSet;
        dispatcherIdSelect.dispatchEvent(new Event('change', { bubbles: true }));
        updateChosenSelect(dispatcherIdSelect);

        setTimeout(() => {
          updateChosenSelect(dispatcherIdSelect);
        }, 1000);
      }
    } else {
      console.warn('Селект dispatcher_id не найден.');
    }

    const causerOption = causerIdSelect.querySelector(
      `option[value='${courierId}']`
    );
    if (causerOption) {
      causerOption.setAttribute('selected', 'selected');
    } else {
      console.warn(`Опция с Causer ID ${courierId} не найдена.`);
    }

    localStorage.removeItem('selectedProblem');
    localStorage.removeItem('courier_id');
  }

  const currentUrl = window.location.href;

  if (currentUrl.includes('dispatcher/orders/view')) {
    createProblemUI();
  } else if (currentUrl.includes('dispatcher/problems/add/0/order_id/')) {
    prefillProblemForm();
  }
})();