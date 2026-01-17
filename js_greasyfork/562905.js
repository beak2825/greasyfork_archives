// ==UserScript==
// @name         Old bonk.io UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Use this script in enable old UI in bonk.io!
// @author       kitaesq
// @match        https://bonk.io/gameframe-release.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562905/Old%20bonkio%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/562905/Old%20bonkio%20UI.meta.js
// ==/UserScript==
if (!window.bonkCodeInjectors) window.bonkCodeInjectors = []
window.bonkCodeInjectors.push((code) => code.slice(0, code.length-4) + "t$e[61].disableClassic()" + code.slice(code.length-4))