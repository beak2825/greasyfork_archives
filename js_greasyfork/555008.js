// ==UserScript==
// @name        rsload 下载助手
// @namespace    https://rsload.net/
// @version      2025-11-06
// @description  rsload 下载助手!
// @author       suifengtec
// @match        https://rsload.net/download?a*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rsload.net
// @grant        none
// @license GPL V3
// @downloadURL https://update.greasyfork.org/scripts/555008/rsload%20%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555008/rsload%20%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
var aBtns=document.querySelector("a.styled-link-btn");
    if(aBtns){
        var theUrl = aBtns.href;
        if(theUrl&& theUrl.indexOf("https://fixti.ru/download.php?files=")!=-1){
            window.location.href=theUrl.replaceAll("https://fixti.ru/download.php?files=","");
        }
    }
})();