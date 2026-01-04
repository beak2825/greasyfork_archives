// ==UserScript==
// @name         UP4EVER文件下载
// @namespace    http://tampermonkey.net/
// @version      2025-09-23
// @description  UP4EVER文件下载，只需点击网站紫色apk即可进行下载
// @author       looom
// @match        https://www.up-4ever.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=up-4ever.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550416/UP4EVER%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/550416/UP4EVER%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let filediv = document.querySelector("body > main > div:nth-child(1) > div.py-10.file-download-page > div > div.file-card.card.mb-4 > div > div > span");
    let filetext = filediv.innerText.trim().split('/');
    let filename = filetext[filetext.length - 1].trim();
    let safefilename = window.encodeURIComponent(filename);
    let fileurl = `https://s7.up4ever.download:8443/d/apobvgcrpqy52ag43blukwtghkywtki2lpfp5ncz2zyhbxlqag24vrp3uoqp7b2ybdlla7df/${safefilename}`
    filediv.style.cursor = "pointer";
    filediv.addEventListener('click', () => {
        window.location.href = fileurl;
    })
})();