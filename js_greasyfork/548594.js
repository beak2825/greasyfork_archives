// ==UserScript==
// @name         Crossword Mini Unblocker
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  Unblocks Crossword mini
// @author       You
// @match        https://www.nytimes.com/crosswords/game/mini
// @match        https://www.nytimes.com/crosswords/game/mini/*
// @match        https://www.nytimes.com/crosswords/game/mini*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nytimes.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548594/Crossword%20Mini%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/548594/Crossword%20Mini%20Unblocker.meta.js
// ==/UserScript==

const css = `
.start-modal-container {
  display: none;
}

.xwd__clue-list--obscured li span:last-child {
  color: unset;
  background-color: unset;
}
`;

const style = document.createElement('style');
style.type = 'text/css';

style.appendChild(document.createTextNode(css));

document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
