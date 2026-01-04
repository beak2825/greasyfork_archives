// ==UserScript==
// @name         Gixen Nag Screen - enable bypass
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enable the 'Continue to my account' button after Gixen login without waiting 20 seconds.
// @author       Originally Danny Smith <danny.j.smith@gmail.com>
// @match        https://www.gixen.com/home_2.php?sessionid=*
// @match        https://www.gixen.com/main/home_2.php?sessionid=*
// @match        https://www.gixen.com/main/home_2.php
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554178/Gixen%20Nag%20Screen%20-%20enable%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/554178/Gixen%20Nag%20Screen%20-%20enable%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('gbutton').disabled = false;
    document.getElementById("gbutton").dispatchEvent(new MouseEvent('click'));

})();