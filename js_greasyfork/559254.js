// ==UserScript==
// @name         Chatterfy Цвет непрочитки 
// @description  Изменение цвета непрочитки
// @namespace ЫЫЫЫЫЫ
// @version      1.0
// @match        https://app.chatterfy.ai/bots/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559254/Chatterfy%20%D0%A6%D0%B2%D0%B5%D1%82%20%D0%BD%D0%B5%D0%BF%D1%80%D0%BE%D1%87%D0%B8%D1%82%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/559254/Chatterfy%20%D0%A6%D0%B2%D0%B5%D1%82%20%D0%BD%D0%B5%D0%BF%D1%80%D0%BE%D1%87%D0%B8%D1%82%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEY = 'cf_highlight_color';
  const DEFAULT = '#d89614';
  let color = localStorage.getItem(KEY) || DEFAULT;

  const updateStyle = (c) => {
    GM_addStyle(`
      .chats-list-item_attention__vhusN {
        color: ${c} !important;
        font-weight: 700 !important;
      }
    `);
    localStorage.setItem(KEY, c);
  };
  updateStyle(color);

  const injectSettings = () => {
    const menu = document.querySelector('.header_desktopMenu__yg2IV .app-menu-header_menuWrapper__1lEu6');
    if (!menu || menu.querySelector('#cf-color-menu')) return;

    const item = document.createElement('div');
    item.id = 'cf-color-menu';
    item.className = 'app-menu-header_menuItemWrapper__IZxzR';
    item.style.position = 'relative';

    const icon = document.createElement('div');
    icon.className = 'app-menu-header_menuItem__dInQS app-menu-header_menuItemSvg__st1BU';
    icon.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/512/67/67745.png" 
           alt="Palette" 
           style="width: 16px; height: 16px; filter: brightness(0) invert(1);"> <!-- Белый цвет -->
    `;

    const text = document.createElement('div');
    text.className = 'app-menu-header_menuItemText__9GOqR';
    text.textContent = 'Color';

    const picker = document.createElement('input');
    picker.type = 'color';
    picker.value = color;
    picker.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      z-index: 1;
    `;
    picker.addEventListener('input', (e) => {
      color = e.target.value;
      updateStyle(color);
    });

    item.appendChild(icon);
    item.appendChild(text);
    item.appendChild(picker);

    menu.appendChild(item);
  };

  const tryInject = () => {
    if (!injectSettings()) setTimeout(tryInject, 500);
  };
  tryInject();
})();