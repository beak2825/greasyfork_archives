    // ==UserScript==
    // @name         Кураторы форума by A.Rodin 
    // @namespace    https://forum.blackrussia.online/
    // @version      2.5.3.5
    // @description  Скрипт для Кураторов форума на ответы на жалобы игроков | , Лучше чтоб вы выбрали именно этот скрипт
    // @author       A.Rodin
    // @match        https://forum.blackrussia.online/threads/*
    // @include      https://forum.blackrussia.online/threads/
    // @grant        none
    // @license      MIT
    // @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/551684/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20ARodin.user.js
// @updateURL https://update.greasyfork.org/scripts/551684/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20ARodin.meta.js
    // ==/UserScript==
(function() {
    'use strict';

    const UNACCEPT_PREFIX = 4; // префикс отказано
    const ACCEPT_PREFIX = 8; // префикс одобрено
    const PIN_PREFIX = 2; // префикс закрепить
    const COMMAND_PREFIX = 10; // команде проекта
    const CLOSE_PREFIX = 7; // префикс закрыто
    const DECIDED_PREFIX = 6; // префикс решено
    const WATCHED_PREFIX = 9; // рассмотрено
    const TEX_PREFIX = 13; // техническому специалисту
    const NO_PREFIX = 0;
    const statusMenu = createStatusMenu();
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');



    // Функция создания выпадающего меню
function createStatusMenu() {
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('status-menu');
    
    // Основная кнопка меню
    const mainButton = document.createElement('button');
    mainButton.classList.add('menu-button');
    mainButton.innerHTML = 'Управление темой <i class="fa fa-angle-down"></i>';
    
    // Контейнер для подменю
    const subMenu = document.createElement('div');
    subMenu.classList.add('sub-menu');
    
    // Определяем все пункты меню
    const menuItems = [
        {
                    name: 'Статусы темы',
            type: 'group',
            items: [
                { name: 'На рассмотрении', id: 'pin', color: 'rgb(203, 40, 33, 0.5)' },
                { name: 'Отказано', id: 'unaccept', color: 'rgb(255, 36, 0, 0.5)' },
                { name: 'Одобрено', id: 'accepted', color: 'rgb(152, 251, 152, 0.5)' },
                { name: 'Закрыто', id: 'closed', color: 'rgb(138, 43, 226, 0.5)' }
            ]
        },
        { name: 'Команда проекта', id: 'teamProject', color: 'rgb(255, 165, 0, 0.5)' },
        { name: 'Рассмотрено', id: 'watched', color: 'rgb(255, 255, 0, 0.5)' },
        { name: 'Решено', id: 'decided', color: 'rgb(0, 128, 0, 0.5)' },
        { name: 'Тех.специалист', id: 'techspec', color: 'rgb(0, 0, 255, 0.5)' }
    ];
    // Создаем структуру меню
    menuItems.forEach(item => {
        const itemContainer = document.createElement('div');
        
        if (item.type === 'group') {
            const groupHeader = document.createElement('div');
            groupHeader.classList.add('group-header');
            groupHeader.textContent = item.name;
            
            const groupItems = document.createElement('div');
            groupItems.classList.add('group-items');
            
            item.items.forEach(subItem => {
                const btn = createMenuItem(subItem);
                groupItems.appendChild(btn);
            });
            
            itemContainer.appendChild(groupHeader);
            itemContainer.appendChild(groupItems);
        } else {
            const btn = createMenuItem(item);
            itemContainer.appendChild(btn);
        }
        
        subMenu.appendChild(itemContainer);
    });
    
    // Обработчик открытия меню
    mainButton.addEventListener('click', () => {
        menuContainer.classList.toggle('open');
    });
    
    // Добавляем элементы в контейнер
    menuContainer.appendChild(mainButton);
    menuContainer.appendChild(subMenu);
    
    return menuContainer;
}
// Функция создания отдельной кнопки меню
function createMenuItem(item) {
    const btn = document.createElement('button');
    btn.classList.add('menu-item');
    btn.id = item.id;
    btn.style.borderColor = item.color;
    btn.style.border = '2px solid';
    btn.textContent = item.name;
    
    btn.addEventListener('click', () => {
        switch(btn.id) {
            case 'pin':
                editThreadData(PIN_PREFIX, true);
                break;
            case 'unaccept':
                editThreadData(UNACCEPT_PREFIX, false);
                break;
            case 'accepted':
                editThreadData(ACCEPT_PREFIX, false);
                break;
            case 'closed':
                editThreadData(CLOSE_PREFIX, false);
                break;
            case 'teamProject':
                editThreadData(COMMAND_PREFIX, true);
                break;
            case 'watched':
                editThreadData(WATCHED_PREFIX, false);
                break;
            case 'decided':
                editThreadData(DECIDED_PREFIX, false);
                break;
            case 'techspec':
                editThreadData(TEX_PREFIX, false);
                break;
        }
        // Закрываем меню после выбора
        menuContainer.classList.remove('open');
    });
    
    return btn;
}
// Добавляем стили для меню
document.head.insertAdjacentHTML('beforeend', `
<style>
.status-menu {
    position: relative;
    display: inline-block;
}

.menu-button {
    padding: 10px 15px;
    border: none;
    background: #f0f0f0;
    cursor: pointer;
    border-radius: 5px;
}

.sub-menu {
    display: none;
    position: absolute;
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    border-radius: 5px;
    z-index: 999;
}

.status-menu.open .sub-menu {
    display: block;
}
.menu-item {
    padding: 10px 15px;
    display: block;
    width: 100%;
    border: none;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    border-radius: 5px;
}

.menu-item:hover {
    background: #e0e0e0;
}
</style>
`);

// Инициализация меню
$(document).ready(() => {
    const menuContainer = createStatusMenu();
    $('.button--icon--reply').before(menuContainer);
    
    // Обработчик закрытия меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!menuContainer.contains(e.target)) {
            menuContainer.classList.remove('open');
        }
    });
  });
}); // Закрывающая скобка document.ready