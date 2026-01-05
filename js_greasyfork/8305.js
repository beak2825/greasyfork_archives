// ==UserScript==
// @name         琉璃神社老司机
// @namespace    https://greasyfork.org/users/8650
// @version      0.450.12
// @description  Don't panic.
// @author       红领巾
// @include      http://www.hacg.me/wordpress/*
// @include      http://hacg.riwee.com/wordpress/*
// @include      http://www.hacg.in/wordpress/*
// @icon         http://www.hacg.me/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8305/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E8%80%81%E5%8F%B8%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/8305/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E8%80%81%E5%8F%B8%E6%9C%BA.meta.js
// ==/UserScript==

(function(){
    var oldDriver = document.getElementsByClassName('entry-content')[0];
    var childDriver = oldDriver.childNodes;
    for(var i = childDriver.length - 1; i >= 0; i--) // 复杂度提升至 O(n)
        if(takeMe = childDriver[i].textContent.match(/(\w{40})|(([A-Za-z0-9]{2,39})( ?)[\u4e00-\u9fa5 ]{2,}( ?)+(\w{2,37})\b)/g))
            for(j = 0;j < takeMe.length;++j) { // O(1)
                var fuel = "<a href='magnet:?xt=urn:btih:" + takeMe[j].toString().replace(/(\s|[\u4e00-\u9fa5])+/g,'') + "'>老司机链接</a>";
                childDriver[i].innerHTML = childDriver[i].innerHTML.toString().replace(takeMe[j], fuel);
            }
})();