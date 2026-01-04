// ==UserScript==
// @name        Кнопки в уведомлениях | Картошка
// @namespace   Violentmonkey Scripts
// @match       *://a24.biz/my/notifications*
// @match       https://avtor24.ru/my/notifications*
// @match       https://avtor24.ru/my/orders*
// @match       https://a24.biz/my/orders*
// @grant       GM_addStyle
// @grant       window.close
// @author      Семён
// @version     13
// @description При нажатии на кнопку с аттрибутом data-tab="2" скопирует номер заказа
// @downloadURL https://update.greasyfork.org/scripts/551051/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B2%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D1%85%20%7C%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%88%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551051/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B2%20%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D1%85%20%7C%20%D0%9A%D0%B0%D1%80%D1%82%D0%BE%D1%88%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
    const body = document.body;
    if (body && body.classList.contains('is-author')) {
    } else {
        GM_addStyle(`
            .Clones:hover {
              background-color: rgba(255, 255, 255) !important;
            }

            .ClonesSpecial:hover {
              background-color: rgba(255, 255, 255) !important;
            }

            .ClonesSpecial {
              background-color: transparent !important;
              all: unset !important;
                -webkit-text-size-adjust: 100% !important;
                --swiper-theme-color: #007aff !important;
                --vh: 8.4px !important;
                --color-black: #0d1d4a !important;
                --color-gray: #93a1c8 !important;
                --color-gray-normal: #e3e8f2 !important;
                --color-gray-light: #f1f4f9 !important;
                --color-white: #ffffff !important;
                --color-purple: #7d2aeb !important;
                --color-purple-secondary: #9646ff !important;
                --color-purple-light: #f2eafd !important;
                --color-purple-dark: #6435a5 !important;
                --color-pink: #f75db8 !important;
                --color-pink-light: #feeff8 !important;
                --color-green: #73ee00 !important;
                --color-green-light: #f1fde6 !important;
                --color-yellow: #ffd304 !important;
                --color-yellow-light: #fff6c9 !important;
                --color-yellow-dark: #fdc607 !important;
                --font-family: Circe, Helvetica, sans-serif !important;
                --font-text-normal: 400 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
                --font-text-normal-bold: 700 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
                --font-text-medium: 400 1rem/1.25rem Circe, Helvetica, sans-serif !important;
                --font-text-medium-secondary: 400 1.25rem/1.5rem Circe, Helvetica, sans-serif !important;
                --font-text-medium-bold: 700 1rem/1.25rem Circe, Helvetica, sans-serif !important;
                --font-text-extra-small: 400 0.6875rem/0.875rem Circe, Helvetica, sans-serif !important;
                --font-text-extra-small-bold: 700 0.6875rem/0.875rem Circe, Helvetica, sans-serif !important;
                --font-text-small: 400 0.75rem/1rem Circe, Helvetica, sans-serif !important;
                --font-text-small-bold: 700 0.75rem/1rem Circe, Helvetica, sans-serif !important;
                --font-header-big: 700 2.5rem/3rem Circe, Helvetica, sans-serif !important;
                --font-header-medium: 700 1.5625rem/1.9375rem Circe, Helvetica, sans-serif !important;
                --font-header-small: 700 1.125rem/1.375rem Circe, Helvetica, sans-serif !important;
                --font-header-medium-mobile: 700 1.0625rem/1.5625rem Circe, Helvetica, sans-serif !important;
                --font-header-small-mobile: 700 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
                scrollbar-color: rgb(204, 204, 204) transparent !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                overflow: visible !important;
                text-transform: none !important;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
                outline: none !important;
                border: none !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                user-select: none !important;
                appearance: none !important;
                font: var(--font-header-medium) !important;
                border-radius: 0.625rem 0.625rem 0px 0px !important;
                position: relative !important;
                background-color: transparent !important;
                transition: color 0.17s ease-in-out 0s !important;
                color: var(--color-gray) !important;
                font-size: 2rem !important;
                line-height: 1.375rem !important;
                padding: 0px 1.125rem !important;
                margin-left: auto !important;
                max-width: 11rem !important;
                text-align: center !important;
            }

            .Clones {
              background-color: transparent !important;
              all: unset !important;
                -webkit-text-size-adjust: 100% !important;
                --swiper-theme-color: #007aff !important;
                --vh: 8.4px !important;
                --color-black: #0d1d4a !important;
                --color-gray: #93a1c8 !important;
                --color-gray-normal: #e3e8f2 !important;
                --color-gray-light: #f1f4f9 !important;
                --color-white: #ffffff !important;
                --color-purple: #7d2aeb !important;
                --color-purple-secondary: #9646ff !important;
                --color-purple-light: #f2eafd !important;
                --color-purple-dark: #6435a5 !important;
                --color-pink: #f75db8 !important;
                --color-pink-light: #feeff8 !important;
                --color-green: #73ee00 !important;
                --color-green-light: #f1fde6 !important;
                --color-yellow: #ffd304 !important;
                --color-yellow-light: #fff6c9 !important;
                --color-yellow-dark: #fdc607 !important;
                --font-family: Circe, Helvetica, sans-serif !important;
                --font-text-normal: 400 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
                --font-text-normal-bold: 700 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
                --font-text-medium: 400 1rem/1.25rem Circe, Helvetica, sans-serif !important;
                --font-text-medium-secondary: 400 1.25rem/1.5rem Circe, Helvetica, sans-serif !important;
                --font-text-medium-bold: 700 1rem/1.25rem Circe, Helvetica, sans-serif !important;
                --font-text-extra-small: 400 0.6875rem/0.875rem Circe, Helvetica, sans-serif !important;
                --font-text-extra-small-bold: 700 0.6875rem/0.875rem Circe, Helvetica, sans-serif !important;
                --font-text-small: 400 0.75rem/1rem Circe, Helvetica, sans-serif !important;
                --font-text-small-bold: 700 0.75rem/1rem Circe, Helvetica, sans-serif !important;
                --font-header-big: 700 2.5rem/3rem Circe, Helvetica, sans-serif !important;
                --font-header-medium: 700 1.5625rem/1.9375rem Circe, Helvetica, sans-serif !important;
                --font-header-small: 700 1.125rem/1.375rem Circe, Helvetica, sans-serif !important;
                --font-header-medium-mobile: 700 1.0625rem/1.5625rem Circe, Helvetica, sans-serif !important;
                --font-header-small-mobile: 700 0.875rem/1.125rem Circe, Helvetica, sans-serif !important;
                scrollbar-color: rgb(204, 204, 204) transparent !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                overflow: visible !important;
                text-transform: none !important;
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
                outline: none !important;
                border: none !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                user-select: none !important;
                appearance: none !important;
                font: var(--font-header-medium) !important;
                border-radius: 0.625rem 0.625rem 0px 0px !important;
                position: relative !important;
                background-color: transparent !important;
                transition: color 0.17s ease-in-out 0s !important;
                color: var(--color-gray) !important;
                font-size: 2rem !important;
                line-height: 1.375rem !important;
                padding: 0px 1.125rem !important;
                max-width: 11rem !important;
                text-align: center !important;
            }


      `);
      // Функция добавления кнопок
      function addCopyButton() {
        // Проверяем, есть ли уже добавленные кнопки
        if (document.querySelector('.ClonesSpecial')) return;

        let fight = 0;
        const buttonSelectors = [
          'button[data-tab="4"] span',
          'button[data-tab="3"] span',
          'button[data-tab="2"] span',
          'button[data-tab="1"] span',
        ];
        const button2Selectors = [
          'button[data-tab="in_work_reworks"] span',
          'button[data-tab="in_work_files"] span',
          'button[data-tab="in_work_details"] span',
        ];

        // Поиск кнопки
        let button = buttonSelectors
          .map((selector) => document.querySelector(selector))
          .find((btn) => btn);
        let button2 = button2Selectors
          .map((selector) => document.querySelector(selector))
          .find((btn) => btn);

        if (button || button2) {
          fight = 1;
          let parentButton = (button || button2).closest('button');

          // Функция для создания кнопки с заданными параметрами
          function createButton(className, title, textContent, clickHandler) {
            const clonedButton = parentButton.cloneNode(true);
            clonedButton.removeAttribute('data-tab');
            clonedButton.style.cssText = '';
            clonedButton.className = '';
            clonedButton.classList.add(className);

            const spans = clonedButton.querySelectorAll('span');
            spans.forEach((span) => span.remove());

            const newSpan = document.createElement('span');
            newSpan.textContent = textContent;
            clonedButton.title = title;
            clonedButton.appendChild(newSpan);
            clonedButton.addEventListener('click', clickHandler);

            return clonedButton;
          }

          // Создаем кнопки
          const copyButton = createButton(
            'ClonesSpecial',
            'Копировать номер заказа',
            '📋',
            () => {
              var currentUrl = window.location.href;
              var urlParts = currentUrl.split('/');
              const orderId = urlParts[4];
              navigator.clipboard.writeText(orderId).then(() => {
                console.log(`Номер заказа ${orderId} скопирован`);
              });
            }
          );

          const mirrorButton = createButton(
            'Clones',
            'Отразить заказ',
            '🪞',
            () => {
              unsafeWindow.bitrixApi.openOlyeca();
            }
          );

          const bitrixButton = createButton(
            'Clones',
            'Открыть заказ в Битрикс',
            '📰',
            () => {
              unsafeWindow.bitrixApi.OpenBitrix();
            }
          );



          // Добавляем кнопки в DOM
          parentButton.parentNode.insertBefore(copyButton, parentButton.nextSibling);
          parentButton.parentNode.insertBefore(mirrorButton, copyButton.nextSibling);
          parentButton.parentNode.insertBefore(bitrixButton, mirrorButton.nextSibling);

          console.log('Кнопки добавлены.');
        }
      }

      // Интервал для проверки и добавления кнопок
      setInterval(addCopyButton, 1000);
    }
})();