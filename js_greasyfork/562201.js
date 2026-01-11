// ==UserScript==
// @name         Highlight External Links
// @namespace    https://greasyfork.org/users/your-id
// @version      1.0.0
// @description  Tô màu nền các liên kết dẫn ra ngoài domain hiện tại để người dùng dễ nhận biết trước khi click.
// @author       Your Name
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562201/Highlight%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/562201/Highlight%20External%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Lấy domain hiện tại
     */
    const currentHost = window.location.hostname;

    /**
     * Lấy tất cả thẻ <a> có href
     */
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        try {
            const url = new URL(link.href, window.location.href);

            // Nếu là link ngoài
            if (url.hostname !== currentHost) {
                link.style.backgroundColor = '#fff3cd';
                link.style.borderBottom = '2px dashed #ff9800';
                link.title = 'External link: ' + url.hostname;
            }
        } catch (e) {
            // Bỏ qua URL không hợp lệ
        }
    });
})();
