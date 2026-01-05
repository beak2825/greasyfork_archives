// ==UserScript==
// @name         Фарм молний/карт 1
// @description  Активация F4
// @version      1.3 (2дня работы)
// @author       Я
// @match        https://remanga.org/*
// @grant        none
// @license      GNU AGPLv3
// @namespace https://greasyfork.org/users/1516025
// @downloadURL https://update.greasyfork.org/scripts/558957/%D0%A4%D0%B0%D1%80%D0%BC%20%D0%BC%D0%BE%D0%BB%D0%BD%D0%B8%D0%B9%D0%BA%D0%B0%D1%80%D1%82%201.user.js
// @updateURL https://update.greasyfork.org/scripts/558957/%D0%A4%D0%B0%D1%80%D0%BC%20%D0%BC%D0%BE%D0%BB%D0%BD%D0%B8%D0%B9%D0%BA%D0%B0%D1%80%D1%82%201.meta.js
// ==/UserScript==

(() => {
  'use strict';

  let running = true;  // Флаг для отслеживания работы скрипта
  let timeoutId = null; // Таймер для завершения работы скрипта

  // Функция для клика по кнопке следующей главы
  function clickNextChapter() {
    const button = document.querySelector(
      'button.cs-button svg path[d="M7 12.166 10.333 8 7 3.833"]'  // Новый селектор для кнопки
    )?.closest('button'); // Ищем саму кнопку

    if (!button || button.disabled || button.offsetParent === null) {
      return false; // Кнопка не активна или скрыта
    }

    button.click(); // Кликаем по кнопке
    return true;
  }

  // Функция для ожидания, пока кнопка не станет активной
  function waitForNextChapterButton() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (clickNextChapter()) {
          clearInterval(interval); // Прерываем ожидание, если кнопка активна и кликнута
          resolve();
        }
      }, 10); // Проверяем каждые 10 миллисекунд

      // Устанавливаем таймер, чтобы завершить работу через 5 секунд
      timeoutId = setTimeout(() => {
        clearInterval(interval);
        reject('Не удалось нажать кнопку в течение 5 секунд. Скрипт завершает работу.'); // Выводим ошибку
      }, 5000); // 5000 миллисекунд = 5 секунд
    });
  }

  // Симуляция нажатия клавиши F3
  function simulateF3KeyPress() {
    const event = new KeyboardEvent('keydown', {
      key: 'F3',
      code: 'F3',
      keyCode: 114,
      which: 114,
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event); // Отправляем событие нажатия F3
  }

  // Асинхронная функция для клика по всем кнопкам, пока они доступны
  async function clickAllNextChapters() {
    let chaptersClicked = 0; // Счетчик успешных кликов

    while (running) {
      try {
        await waitForNextChapterButton(); // Ожидаем, пока кнопка станет доступной

        if (!clickNextChapter()) {
          // Если кнопка неактивна или не найдена
          if (chaptersClicked === 0) {
            console.log('Не осталось доступных глав. Завершаем работу.');
          } else {
            console.log('Все главы пройдены. Завершаем работу.');
          }
          running = false;  // Останавливаем работу скрипта
          break;
        } else {
          chaptersClicked++;
        }

        // Если был клик, делаем задержку между действиями
        await new Promise(r => setTimeout(r, 100)); // Задержка между кликами (0.1 сек)
      } catch (error) {
        console.error(error); // Логируем ошибку, если таймер истек
        running = false; // Останавливаем скрипт в случае ошибки

        // После сообщения об ошибке симулируем нажатие F3
        if (error === 'Не удалось нажать кнопку в течение 5 секунд. Скрипт завершает работу.') {
          simulateF3KeyPress(); // Нажимаем F3 для завершения
        }
      }
    }
  }

  // Обработчик события нажатия клавиши F4 или F3
  document.addEventListener('keydown', e => {
    if (e.code === 'F4') {
      if (running) {
        running = false;  // Выключаем скрипт при нажатии F4
        clearTimeout(timeoutId); // Останавливаем таймер, если он еще работает
        console.log('Скрипт выключен вручную');
      } else {
        running = true;  // Включаем скрипт обратно
        console.log('Скрипт включен');
        clickAllNextChapters(); // Запускаем кликание на кнопки
      }
    }
  });

})();
