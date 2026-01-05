// ==UserScript==
// @name         Disable TamperMonkey Update Tab
// @namespace    org.jixun.tamper.no.window
// @version      1.0.1
// @description  Close Tamper Monkey update window
// @author       Jixun
// @match        http://tampermonkey.net/changelog.*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/6040/Disable%20TamperMonkey%20Update%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/6040/Disable%20TamperMonkey%20Update%20Tab.meta.js
// ==/UserScript==

if (history.length == 1 && !document.referrer) {
    unsafeWindow.close ();
}