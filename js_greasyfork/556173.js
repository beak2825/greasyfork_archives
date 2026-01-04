// ==UserScript==
// @name             duckduckgo mobile google search shortcut
// @description      replace duck.ai button with google search shortcut
// @match            https://duckduckgo.com/*
// @version          1.0
// @license          WTFPL
// @namespace https://greasyfork.org/users/1538977
// @downloadURL https://update.greasyfork.org/scripts/556173/duckduckgo%20mobile%20google%20search%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/556173/duckduckgo%20mobile%20google%20search%20shortcut.meta.js
// ==/UserScript==

const original = document.querySelector("#react-ai-button-slot a");
const new_ = document.createElement("a");
new_.className = original.className;
new_.href = "https://google.com/search?q=" + encodeURIComponent(new URLSearchParams(location.search).get("q"));
new_.innerHTML = "Search Google";
original.replaceWith(new_);