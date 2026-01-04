// ==UserScript==
// @name         Cookie Based Auto Redirect (Multi-Site)
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Read site-specific cookie and redirect using host.includes
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559719/Cookie%20Based%20Auto%20Redirect%20%28Multi-Site%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559719/Cookie%20Based%20Auto%20Redirect%20%28Multi-Site%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const c of cookies) {
            if (c.startsWith(name + '=')) {
                return c.substring(name.length + 1);
            }
        }
        return null;
    }

    const host = location.hostname;

    if (host.includes('wblaxmibhandar')){
        const value = getCookie('alias');
        if (value) {
            location.href = "https://lksfy.com/" + value;
        }
    }
    if (host.includes('fastloanglobal.in')){
        const value = getCookie('sgutech');
        if (value) {
            location.href = "https://anyshorturl.com/" + value;
        }
    }
})();