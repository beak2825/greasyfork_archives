// ==UserScript==
// @name        hotkey key : for input search on YouTube Music
// @namespace   Violentmonkey Scripts
// @match      *://music.youtube.com/*
// @grant       none
// @version     20260120.16.53
// @author      thomaslinux
// @description A script to had the key : to focus the search on YouTube Music
// @downloadURL https://update.greasyfork.org/scripts/563371/hotkey%20key%20%3A%20for%20input%20search%20on%20YouTube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/563371/hotkey%20key%20%3A%20for%20input%20search%20on%20YouTube%20Music.meta.js
// ==/UserScript==
document.addEventListener('keydown', function(e) {
  if (e.key === ':') {
    const input = document.querySelector('input.ytmusic-search-box');
    if (input) {
      input.click();
      input.dispatchEvent(new Event('change')); // alternative to input.focus compatible with the site functions associated to a click
      e.preventDefault(); // stop listening to the key when focusing input
    }
  }
});