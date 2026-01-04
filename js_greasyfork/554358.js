// ==UserScript==
// @name         Chuyển Trang Kinh Thánh Online (WIP)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Thêm chức năng chuyển trang, sử dụng phím mũi tên Trái và Phải
// @author       Mirido
// @license      MIT
// @match        https://augustino.net/*chuong-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=augustino.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554358/Chuy%E1%BB%83n%20Trang%20Kinh%20Th%C3%A1nh%20Online%20%28WIP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554358/Chuy%E1%BB%83n%20Trang%20Kinh%20Th%C3%A1nh%20Online%20%28WIP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key == 'ArrowRight' || event.key == 'ArrowLeft') {

            event.preventDefault();
            
            const url = new URL(window.location.href)
            
            let oldChapter = parseInt(window.location.pathname.substring(window.location.pathname.lastIndexOf('-') + 1))
            let newChapter;
            if (event.key == 'ArrowRight') {
                newChapter = oldChapter + 1;
            } else {
                newChapter = oldChapter - 1;
            }
            window.location.href = url.toString().replace("chuong-" + oldChapter, "chuong-" + newChapter);
        }
    });
})();