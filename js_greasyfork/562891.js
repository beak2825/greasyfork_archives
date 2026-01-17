// ==UserScript==
// @name         Old Favicon for Fandom
// @name:ru      2020 Cтарый Favicon для Fandom 
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  An super small userscript, that are addon for my other userstyle
// @description:ru Супер маленький скрипт, возвращающий фавиконку fandom из 2020
// @author       sitDAUN
// @license      MIT
// @match        https://www.fandom.com/
// @icon         https://github.com/sitDAUN/All-my-themes-general-repository/blob/main/fandomfavicon-32x32.png?raw=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562891/Old%20Favicon%20for%20Fandom.user.js
// @updateURL https://update.greasyfork.org/scripts/562891/Old%20Favicon%20for%20Fandom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
link.rel = 'icon';
link.href = 'https://github.com/sitDAUN/All-my-themes-general-repository/blob/main/fandomfavicon-32x32.png?raw=true';
document.head.appendChild(link);

})();