// ==UserScript==
// @name        skribbl.io auto focus
// @description Focus the chat input box when tabbing back to the window, and when typing a guess
// @version     2025.10.24
// @match       https://skribbl.io/*
// @license     MIT
// @namespace https://greasyfork.org/users/1530188
// @downloadURL https://update.greasyfork.org/scripts/553567/skribblio%20auto%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/553567/skribblio%20auto%20focus.meta.js
// ==/UserScript==

// make it more visually obvious when the chat input has focus
const ss = document.styleSheets[0];
ss.insertRule('#game-chat input[type=text]:focus{border: solid 3px #007fff}');

window.addEventListener('focus', (e) => {
  let input = document.querySelector('#game-chat input[type=text]');
  setTimeout(() => {
    input.focus();
  }, 10);
});

document.addEventListener('keydown', (e) => {
  let isLetter = (x) => (x >= 'a' && x <= 'z') || (x >= 'A' && x <= 'Z');
  let iAmDrawing = window.getComputedStyle(document.getElementById('game-toolbar')).visibility == 'visible';
  if (isLetter(e.key) && !iAmDrawing) {
    let input = document.querySelector('#game-chat input[type=text]');
    input.focus();
  }
});