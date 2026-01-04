// ==UserScript==
// @name         fc2db
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  fc2db search
// @author       You
// @match        https://fc2db.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc2db.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560311/fc2db.user.js
// @updateURL https://update.greasyfork.org/scripts/560311/fc2db.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id=document.querySelector("#add > div.product__details-add > ul > li:nth-child(1) > span:nth-child(2)").innerText;
    document.querySelector('.breadcrumb-item').innerHTML= document.querySelector('.breadcrumb-item').innerHTML+'<p><a style="font-size: 4rem;color:green" href="https://www.btmulu.live/search.html?name='+id+'"  target="_blank">下载1</a><br><br><a style="font-size: 4rem;color:green" href="https://btsow.pics/#/search/'+id+'"  target="_blank">下载2</a>';
    setInterval(document.querySelector('iframe').remove(), 1000);

    // Your code here...
})();