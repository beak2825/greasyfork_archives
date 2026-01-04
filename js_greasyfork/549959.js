// ==UserScript==
// @name         new 3 min
// @namespace    http://tampermonkey.net/
// @version      2025-09-16
// @description  таймер обратного отсчета
// @author       Danik Odze
// @match        https://claimclicks.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claimclicks.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549959/new%203%20min.user.js
// @updateURL https://update.greasyfork.org/scripts/549959/new%203%20min.meta.js
// ==/UserScript==

(function() {
    'use strict';

let countdown = 60*3;

var startButton = document.createElement('captcha');
startButton.style.position = 'fixed';
startButton.style.top = '100px';
startButton.style.right = '0px';
startButton.style.color = 'red';
document.body.appendChild(startButton);

// скрипт для обработки интервала 1 секунда
const workerScript = `
 setInterval(() => {
 self.postMessage('tick');
 }, 1000);
`;

// Создание нового веб-воркера
const blob = new Blob([workerScript], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));

// Прослушивание сообщений от воркера
worker.onmessage = function (event) {
	countdown--;
    let countdownText = document.createTextNode(` Wait for ${toCustomTimeString(countdown)} seconds`);
    startButton.innerHTML = '';
    startButton.appendChild(countdownText);
	document.title = toCustomTimeString(countdown);
};
const toCustomTimeString = (seconds) => {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const secondsPart = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secondsPart}`;
};
})();