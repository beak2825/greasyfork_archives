// ==UserScript==
// @name         Submit on Enter
// @namespace    https://github.com/nate-kean/
// @version      2025-09-28
// @description  Go when you press Enter.
// @author       Nate Kean
// @match        https://tools.usps.com/zip-code-lookup.htm?byaddress
// @icon         https://www.google.com/s2/favicons?sz=64&domain=usps.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551289/Submit%20on%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/551289/Submit%20on%20Enter.meta.js
// ==/UserScript==

(function() {
    document.querySelector("#zip-code-address-form").addEventListener("keyup", (evt) => {
        if (evt.keyCode === 13) {
            document.querySelector("#zip-by-address").click()
        }
    });
})();
