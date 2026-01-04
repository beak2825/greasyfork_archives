// ==UserScript==
// @name         Little Doll Lite
// @namespace    Little Doll Lite
// @version      1.0
// @description  Автоматическая смена и установка часового пояса
// @author       Maesta_Nequitia
// @match        *://2ch.hk/*
// @match        *://2ch.su/*
// @match        *://2ch.life/*
// @match        *://dva4.ru/*
// @grant        GM_addStyle
// @icon         https://2ch.hk/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549355/Little%20Doll%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/549355/Little%20Doll%20Lite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Получаем текущее время пользователя
    const userTime = new Date();

    // Получаем московское время
    const moscowTime = new Date().toLocaleString('en-US', {timeZone: 'Europe/Moscow'});
    const moscowTimeObj = new Date(moscowTime);

    // Вычисляем разницу во времени между московским временем и временем пользователя в миллисекундах
    const timeDifference = userTime - moscowTimeObj;

    const daysOfWeek = ['Вск', 'Пнд', 'Втр', 'Срд', 'Чтв', 'Птн', 'Суб'];

    const formatDate = (date) => {
        const dayOfWeek = daysOfWeek[date.getDay()];
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)} ${dayOfWeek} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    const modifyTime = (element) => {
        const [datePart, , timePart] = element.textContent.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');

        const originalDateObject = new Date(`20${year}`, month - 1, day, hours, minutes, seconds);

        // Применяем разницу во времени к времени на форуме
        const newDateObject = new Date(originalDateObject.getTime() + timeDifference);

        element.textContent = formatDate(newDateObject);
    };

    const handleMutations = (mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                Array.from(mutation.addedNodes)
                    .filter(node => node instanceof Element)
                    .forEach(node => {
                        Array.from(node.getElementsByClassName('post__time')).forEach(modifyTime);
                    });
            }
        });
    };

    const timeElements = document.querySelectorAll('.post__time');
    timeElements.forEach(modifyTime);

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

})();
