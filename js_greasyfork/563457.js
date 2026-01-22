// ==UserScript==
// @name        TL9 hotkey key ':' to focus the search input on alternativeto
// @namespace   Violentmonkey Scripts
// @match       *://alternativeto.net/*
// @grant       none
// @version     20260121.10.22
// @author      thomaslinux
// @description A script to had the hotkey key ':' to focus the search input on alternativeto.net
// @downloadURL https://update.greasyfork.org/scripts/563457/TL9%20hotkey%20key%20%27%3A%27%20to%20focus%20the%20search%20input%20on%20alternativeto.user.js
// @updateURL https://update.greasyfork.org/scripts/563457/TL9%20hotkey%20key%20%27%3A%27%20to%20focus%20the%20search%20input%20on%20alternativeto.meta.js
// ==/UserScript==
document.addEventListener('keydown', function(e) {
  if (e.key === ':') {
    const input = document.querySelector('input#search-input');
    if (input) {
      input.focus(); // .click didn't focus so .focus is used
      input.click(); // .click used in case it's necessary for the events
      input.dispatchEvent(new Event('change')); // alternative to input.focus compatible with the site functions associated to a click
      e.preventDefault(); // stop listening to the key when focusing input
    }
  }
});
