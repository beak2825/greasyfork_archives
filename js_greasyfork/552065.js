// ==UserScript==
// @name         18comic轉址
// @namespace    http://tampermonkey.net/
// @version      1
// @include      *://18comic.*/*
// @description  保證18comic都在同一個網域
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=18comic.ink
// @downloadURL https://update.greasyfork.org/scripts/552065/18comic%E8%BD%89%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/552065/18comic%E8%BD%89%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    const URL = "https://18comic.ink"; //改我
    //18comic發布頁 https://jmcomicqa.cc/

    const currentUrl = window.location.href;
    
    if (currentUrl.startsWith("https://18comic.ink")) 
        return;
    
    const newUrl = currentUrl.replace(/^https:\/\/18comic\.[^/]+/, URL);
  
    window.location.replace(newUrl);
})();
