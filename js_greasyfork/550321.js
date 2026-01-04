// ==UserScript==
// @name         EX熊貓中文本顯眼
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  中文本背景變白
// @author       You
// @match        https://exhentai.org/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/550321/EX%E7%86%8A%E8%B2%93%E4%B8%AD%E6%96%87%E6%9C%AC%E9%A1%AF%E7%9C%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/550321/EX%E7%86%8A%E8%B2%93%E4%B8%AD%E6%96%87%E6%9C%AC%E9%A1%AF%E7%9C%BC.meta.js
// ==/UserScript==

(function() {
    const currentUrl = window.location.href; 
    if(currentUrl.includes("/g/"))return
    if (currentUrl.includes("favorites")) {
        $('span.glink').each(function() {
            checktext(this);
        });
        return
    }
    $('div.gl4t.glname.glink').each(function() {
        checktext(this);
    });

    function checktext(el) {
        const $this = $(el);
        const text = $this.text();
        if (text.includes('中国') || text.includes('中文') || text.includes('汉化') || text.includes('Chinese')) {
            $this.css('color', '#000000');
            $this.closest('div.gl1t').css('color', '#000000');
            $this.closest('div.gl1t').css('background-color', '#F0F0F0');
        }
    }

})();