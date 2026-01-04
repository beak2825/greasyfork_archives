// ==UserScript==
// @name        Anti-Timeout nmknf.ru
// @name:ru     Анти-таймаут сессии для nmknf.ru
// @namespace   Violentmonkey Scripts
// @match       https://nmknf.ru/dist/*
// @grant       none
// @version     1.01
// @author      wisheddude
// @description prevent the site from updating the user's session state.
// @description:ru предотвращает обновление состояния сессии сайтом
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/556524/Anti-Timeout%20nmknfru.user.js
// @updateURL https://update.greasyfork.org/scripts/556524/Anti-Timeout%20nmknfru.meta.js
// ==/UserScript==
let _url = window.location.href;

fetch(_url, {
    method: 'POST', body: '', headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log("Useful message"));

const SESSIONLESS = setInterval(() => {
  fetch(_url, {
    method: 'POST', body: '', headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(""));
}, 60000);