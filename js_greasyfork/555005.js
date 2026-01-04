// ==UserScript==
// @name         fixti.ru 助手
// @namespace    http://fixti.ru/
// @version      2025-11-06
// @description  它能让你免去打对号，再点按钮的这种麻烦，打开页面即可直接下载，从而节约时间.
// @author       suifengtec
// @match        fixti.ru/download.php?files=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license GPL V3
// @downloadURL https://update.greasyfork.org/scripts/555005/fixtiru%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555005/fixtiru%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var aEls = document.querySelector("a#downloadBtn");
    if (aEls){
        var theHref = aEls.href;
        if(theHref){ window.location.href=theHref;}
    }
})();