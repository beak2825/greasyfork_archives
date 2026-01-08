// ==UserScript==
// @name         Discord download validity fixer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unexpire any discord media download link
// @author       TTT
// @include *://*discordapp.com*/*
// @include *://*discordapp.net*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discordapp.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558177/Discord%20download%20validity%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/558177/Discord%20download%20validity%20fixer.meta.js
// ==/UserScript==
function unexpire() {
    if (!(document.body.innerText.trim() === 'This content is no longer available.')) return;
    var parts = window.location.href.split('/');
    var extracted = parts.slice(3).join('/');
    window.location.href = 'https://fixcdn.hyonsu.com/' + extracted;
}
unexpire();