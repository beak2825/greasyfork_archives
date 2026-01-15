// ==UserScript==
// @name         vertical long name
// @namespace    http://tampermonkey.net/
// @version      1
// @description  longer name = less vertical length
// @author       jack
// @match        *://agma.io/*
// @icon         https://agma.io/agm3.ico
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562696/vertical%20long%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/562696/vertical%20long%20name.meta.js
// ==/UserScript==
addEventListener('load', () => {
    const _setNick = unsafeWindow.setNick;
    unsafeWindow.setNick = function(name, rsp) {
        let a = '';
        for(let i = 0; i < (24 - name.length >> 1); i++) a += String.fromCharCode(10);
        return _setNick.apply(this, [a + name + a, rsp]);
    }
});