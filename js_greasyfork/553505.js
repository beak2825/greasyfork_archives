// ==UserScript==
// @name        geu-4: предупреждение о дате
// @namespace   Violentmonkey Scripts
// @match       https://cabinet.geu-4.ru/mycabinet/meters/*
// @grant       none
// @version     1.0
// @author      -
// @description Показывает предупреждение, что сегодня показания не будут приняты
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/553505/geu-4%3A%20%D0%BF%D1%80%D0%B5%D0%B4%D1%83%D0%BF%D1%80%D0%B5%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%20%D0%B4%D0%B0%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/553505/geu-4%3A%20%D0%BF%D1%80%D0%B5%D0%B4%D1%83%D0%BF%D1%80%D0%B5%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%20%D0%B4%D0%B0%D1%82%D0%B5.meta.js
// ==/UserScript==

const dayOfMonth = (new Date()).getDate();

if (dayOfMonth > 24) {
  console.log('date is right')
  const message = 'Сегодня ' + dayOfMonth + ' число, скорее всего показания не будут приняты.';
  let container = document.querySelector('#form');
  if (container) {
    console.log('container found', container)
    let warning = document.createElement('div');
    warning.innerHTML = '<br><h3 style="color: darkred">' + message + '</h3>';
    container.appendChild(warning);
  }
}