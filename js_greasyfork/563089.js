// ==UserScript==
// @name         External Link Highlighter
// @namespace    https://greasyfork.org/users/your-username
// @version      1.0
// @description  Tô sáng các liên kết ngoài (external links) trên trang web để bạn dễ nhận biết khi click.
// @author       YourName
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563089/External%20Link%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/563089/External%20Link%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lấy domain hiện tại
    const currentDomain = location.hostname;

    // Chọn tất cả thẻ <a> có thuộc tính href
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        try {
            const url = new URL(link.href);

            // Nếu domain khác domain hiện tại -> là link ngoài
            if (url.hostname !== currentDomain) {
                link.style.backgroundColor = '#fff3cd';
                link.style.border = '1px solid #ffcc00';
                link.style.padding = '2px 4px';
                link.title = 'External link: ' + url.hostname;
            }
        } catch (e) {
            // Bỏ qua các href không hợp lệ
        }
    });
})();
