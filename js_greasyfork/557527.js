// ==UserScript==
// @name         Clients Problems
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  Automatically create problems in the panel
// @author       evseevk17
// @include      *://dispatcher.dostavista.ru/dispatcher/orders/view/*
// @include      *://dispatcher.dostavista.ru/dispatcher/problems/add/0/order_id*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557527/Clients%20Problems.user.js
// @updateURL https://update.greasyfork.org/scripts/557527/Clients%20Problems.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // КОНФИГУРАЦИЯ
  const CONFIG = {
    // ID по умолчанию (используется при ошибках)
    DEFAULT_ASSIGNEE: 3840492, // Евсеев Константин
  };

  let assigneeId = parseInt(localStorage.getItem('assignee_id'));

  // Список проблем - ТЕПЕРЬ assignee МОЖЕТ БЫТЬ ЛЮБЫМ ID
  const problems = [
    // Для категории Опоздание на адрес
    {
      id: 292,
      name: 'Курьер опоздал на адрес',
      category: 'Опоздание на адрес',
      assignee: '0',
      status: 10
    },

    // Для категории Контроль заказов
    {
      id: 390,
      name: 'Контроль/Заказ на контроле',
      category: 'Контроль заказов',
      assignee: '0',
      status: 1
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

    // Для категории Оплата заказа
    {
      id: 334,
      name: 'Клиент отказался от оплаты ложного вызова',
      category: 'Оплата заказа',
      assignee: 2960740,
      status: 1
    },
    {
      id: 335,
      name: 'Клиент отказался от оплаты заказа',
      category: 'Оплата заказа',
      assignee: 2960740,
      status: 1
    },
    {
      id: 336,
      name: 'Клиент отказался от оплаты платного ожидания',
      category: 'Оплата заказа',
      assignee: 2960740,
      status: 1
    },

    // Для категории Поведение/общение
    {
      id: 234,
      name: 'Курьер грубил/хамил/спорил с клиентом',
      category: 'Поведение/общение',
      assignee: 2960740,
      status: 1
    },
    {
      id: 257,
      name: 'Курьер грубил/хамил/спорил с диспетчером',
      category: 'Поведение/общение',
      assignee: 2960740,
      status: 1
    },
    {
      id: 301,
      name: 'Курьер дезинформировал диспетчера',
      category: 'Поведение/общение',
      assignee: 2960740,
      status: 1
    },
    {
      id: 268,
      name: 'Курьер пьян/неадекватен',
      category: 'Поведение/общение',
      assignee: 2960740,
      status: 1
    },

    // Для категории Курьер изменил условия заказа
    {
      id: 439,
      name: 'Курьер не выполнил условия заказа',
      category: 'Курьер не выполнил условия заказа',
      assignee: 0,
      status: 1
    },
    // Для категории Мошенничество/обман
    {
      id: 283,
      name: 'AF. Курьер подозревается в мошенничестве',
      category: 'Мошенничество/обман',
      assignee: 1810087,
      status: 1
    },
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
      assignee: 2960740,
      status: 1
    },

    // Для категории Отдел безопасности
    {
      id: 346,
      name: 'Забрал заказ неустановленный курьер',
      category: 'Отдел безопасности',
      assignee: 1810087,
      status: 1
    },
    // Для категории Работа с оценками
    {
      id: 391,
      name: 'Исправление оценки',
      category: 'Работа с оценками',
      assignee: 2960740,
      status: 1
    },

    // Для категории Прочее
    {
      id: 385,
      name: 'Курьер закрыл адрес, не посетив его',
      category: 'Прочее',
      assignee: 2960740,
      status: 1
    },
    {
      id: 505,
      name: 'Блокировка до актуализации номера телефона',
      category: 'Прочее',
      assignee: 2960740,
      status: 1
    },
    {
      id: 258,
      name: 'Прочее (если ни один из типов не подходит)',
      category: 'Прочее',
      assignee: 0,
      status: 1
    },

    // Для категории Enterprise
    {
      id: 461,
      name: 'Клиент попросил отключить курьера от сервиса',
      category: 'Enterprise',
      assignee: 2960740,
      status: 1
    },
    {
      id: 455,
      name: 'Жалоба на поведение/внешний вид курьера',
      category: 'Enterprise',
      assignee: 0,
      status: 1
    },
    {
      id: 460,
      name: 'Прочее',
      category: 'Enterprise',
      assignee: 0,
      status: 1
    },
  ];

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

  // Улучшенная функция для получения ID текущего пользователя (оставляем, но больше не используем для assignee=0)
  function getCurrentUserId() {
    console.log('Пытаемся определить ID текущего пользователя...');

    // 1. Проверяем, есть ли у нас уже сохраненный ID пользователя
    const savedUserId = localStorage.getItem('current_user_id');
    if (savedUserId) {
      console.log('Используем сохраненный ID пользователя из localStorage:', savedUserId);
      return parseInt(savedUserId);
    }

    // 2. Ищем на странице информацию о пользователе

    // a) Проверяем URL профиля в шапке
    const userLink = document.querySelector('.user-full-name a');
    if (userLink && userLink.href) {
      const match = userLink.href.match(/\/users\/view\/(\d+)/);
      if (match && match[1]) {
        const userId = parseInt(match[1]);
        console.log('Найден ID пользователя из URL профиля:', userId);
        localStorage.setItem('current_user_id', userId);
        return userId;
      }
    }

    // b) Ищем в скриптах на странице
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      if (script.textContent) {
        const patterns = [
          /user_id\s*:\s*['"]?(\d+)['"]?/i,
          /userId\s*:\s*['"]?(\d+)['"]?/i,
          /current_user_id\s*:\s*['"]?(\d+)['"]?/i,
          /"user_id"\s*:\s*"(\d+)"/i,
          /'user_id'\s*:\s*'(\d+)'/i
        ];

        for (const pattern of patterns) {
          const match = script.textContent.match(pattern);
          if (match && match[1]) {
            const userId = parseInt(match[1]);
            console.log('Найден ID пользователя в скрипте:', userId);
            localStorage.setItem('current_user_id', userId);
            return userId;
          }
        }
      }
    }

    // c) Ищем в данных на странице (data-атрибуты)
    const userElements = document.querySelectorAll('[data-user-id], [data-user]');
    for (let element of userElements) {
      const userId = element.getAttribute('data-user-id') || element.getAttribute('data-user');
      if (userId && !isNaN(userId)) {
        const id = parseInt(userId);
        console.log('Найден ID пользователя в data-атрибуте:', id);
        localStorage.setItem('current_user_id', id);
        return id;
      }
    }

    console.warn('Не удалось определить ID текущего пользователя');

    return null;
  }

  // Функция для создания интерфейса выбора проблемы
  function createProblemUI() {
    let order_id;

    // Извлечение order_id из URL
    const match = /\d+/.exec(document.URL);
    if (match) {
      order_id = +match[0];
    } else {
      console.error('Order ID not found in URL');
      return;
    }

    let courier_id;

    // Попытка извлечь courier_id
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

    // Создание интерфейса
    const container = document.createElement('div');
    container.style.cssText =
      'margin-top: 20px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;';

    const title = document.createElement('h3');
    title.textContent = 'Клиентские проблемы';
    title.style.cssText = 'margin-bottom: 10px; font-size: 16px;';

    const problemSelectContainer = document.createElement('div');
    problemSelectContainer.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';

    const problemSelect = document.createElement('select');
    problemSelect.style.cssText =
      'width: 70%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px;';

    // Группируем проблемы по категориям
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
      const newAssigneeId = prompt('Введите ID ответственного:', assigneeId);
      if (newAssigneeId) {
        assigneeId = newAssigneeId;
        localStorage.setItem('assignee_id', assigneeId);
        alert(`Ответственный установлен на ID: ${assigneeId}`);
      }
    });

    const createProblemButton = document.createElement('button');
    createProblemButton.textContent = 'Создать';
    createProblemButton.style.cssText =
      'padding: 8px 12px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px;';

    createProblemButton.addEventListener('click', function () {
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

      // Сохранение данных в LocalStorage
      localStorage.setItem(
        'selectedProblem',
        JSON.stringify({
          id: problem.id,
          name: problem.name,
          assignee: problem.assignee,
          comment: problem.comment,
          status: problem.status
        })
      );

      // Переход на страницу создания проблемы
      const returl = encodeURIComponent(
        `/dispatcher/orders/problems/${order_id}`
      );

      const newUrl = `/dispatcher/problems/add/0/order_id/${order_id}/returl/${returl}`;
      window.location.href = newUrl;
    });

    problemSelectContainer.appendChild(problemSelect);
    problemSelectContainer.appendChild(settingsButton);
    problemSelectContainer.appendChild(createProblemButton);

    container.appendChild(title);
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

    // Элементы формы
    const problemTypeInput = document.querySelector('select[name="type_id"]');
    const commentInput = document.querySelector('textarea[name="comment"]');
    const courierIdSelect = document.querySelector('#courier_id');
    const statusIdSelect = document.querySelector('#status_id');
    const dispatcherIdSelect = document.querySelector('#dispatcher_id');
    const causerIdSelect = document.querySelector('#causer_id-optgroup-courier');

    // Значения из localStorage
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

    // ОСНОВНОЕ: Устанавливаем ответственного
    if (dispatcherIdSelect) {
      let assigneeIdToSet = null;

      const assigneeRaw = problem.assignee;

      let assigneeValue;
      if (assigneeRaw === '0' || assigneeRaw === 0) {
        assigneeValue = 0;
      } else if (assigneeRaw === '' || assigneeRaw === null || typeof assigneeRaw === 'undefined') {
        assigneeValue = NaN;
      } else {
        assigneeValue = Number(assigneeRaw);
      }

      // assignee = 0 -> НЕ ТРОГАЕМ dispatcher_id, оставляем как страница подставила (обычно текущий пользователь)
      if (assigneeValue === 0) {
        console.log('assignee=0: оставляем текущего выбранного диспетчера:', dispatcherIdSelect.value);
        assigneeIdToSet = null; // намеренно не меняем
      }
      // Если assignee - число (ID), используем его (кроме 0)
      else if (!isNaN(assigneeValue)) {
        assigneeIdToSet = assigneeValue;
      }
      // Если assignee пустая строка - очищаем поле (не назначаем никого)
      else {
        assigneeIdToSet = '';
      }

      if (assigneeIdToSet !== null) {
        // Проверяем, существует ли такая опция в селекте
        const optionExists = dispatcherIdSelect.querySelector(`option[value="${assigneeIdToSet}"]`);

        if (optionExists) {
          dispatcherIdSelect.value = assigneeIdToSet;
          dispatcherIdSelect.dispatchEvent(new Event('change', { bubbles: true }));
          updateChosenSelect(dispatcherIdSelect);
          console.log('Установлен диспетчер с ID:', assigneeIdToSet || '(не назначен)');
        } else {
          console.warn('Опция с ID', assigneeIdToSet, 'не найдена в селекте диспетчеров');
          // Если опции нет, создаём её
          if (assigneeIdToSet !== '') {
            const newOption = document.createElement('option');
            newOption.value = assigneeIdToSet;
            newOption.textContent = `Пользователь ${assigneeIdToSet}`;
            dispatcherIdSelect.appendChild(newOption);
            dispatcherIdSelect.value = assigneeIdToSet;
            dispatcherIdSelect.dispatchEvent(new Event('change', { bubbles: true }));
            updateChosenSelect(dispatcherIdSelect);
            console.log('Создана и выбрана новая опция для ID:', assigneeIdToSet);
          }
        }
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

    // Удаление данных из localStorage
    localStorage.removeItem('selectedProblem');
    localStorage.removeItem('courier_id');
  }

  // Проверка текущего URL для выполнения нужных действий
  const currentUrl = window.location.href;

  if (currentUrl.includes('dispatcher/orders/view')) {
    // Страница заказа — создание UI для выбора проблемы
    createProblemUI();

    // При загрузке страницы заказа пробуем определить ID пользователя и сохранить его
    setTimeout(() => {
      const userId = getCurrentUserId();
      if (userId) {
        console.log('ID пользователя определен и сохранен:', userId);
        // Сохраняем в GM для использования на других страницах
        GM_setValue('current_user_id', userId);
      }
    }, 1000);
  } else if (currentUrl.includes('dispatcher/problems/add/0/order_id/')) {
    // Страница создания проблемы — предзаполнение данных
    prefillProblemForm();
  }
})();
