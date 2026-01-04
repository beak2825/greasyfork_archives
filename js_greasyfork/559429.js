// ==UserScript==
// @name         YouTube Tools - Auto HD & Adblock Support
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Hỗ trợ tối ưu hóa trải nghiệm YouTube và sửa lỗi giao diện.
// @match        *://thi.lms360.vn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559429/YouTube%20Tools%20-%20Auto%20HD%20%20Adblock%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/559429/YouTube%20Tools%20-%20Auto%20HD%20%20Adblock%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Cấu hình CSS cưỡng chế (Inject style ngay lập tức)
    const css = `
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
            -webkit-touch-callout: default !important;
            pointer-events: auto !important;
        }
        /* Ẩn các lớp phủ chặn click nếu có */
        .disable-class, [class*="overlay"], [style*="user-select: none"] {
            display: none !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }
    `;

    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) return;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'youtube-helper-css'; // ID ngụy trang
        style.innerHTML = css;
        head.appendChild(style);
    }

    // 2. Hàm xử lý sự kiện: Chặn website cấm cản, cho phép hành động gốc của trình duyệt
    function allowAction(e) {
        e.stopImmediatePropagation(); // Chặn các script khác của web chạy
        return true;
    }

    // Danh sách các sự kiện thường bị chặn
    const eventsToUnlock = [
        'copy', 'cut', 'paste',
        'contextmenu', 'selectstart',
        'mousedown', 'mouseup', 'mousemove',
        'keydown', 'keypress', 'keyup',
        'dragstart', 'drop'
    ];

    // Gắn listener ở chế độ CAPTURE (true) để chạy trước script của web
    eventsToUnlock.forEach(evt => {
        window.addEventListener(evt, allowAction, true);
        document.addEventListener(evt, allowAction, true);
    });

    // 3. Hàm dọn dẹp các thuộc tính chặn inline (như <body oncopy="return false">)
    function cleanInlineHandlers() {
        const forbiddenAttrs = ['oncopy', 'oncut', 'onpaste', 'oncontextmenu', 'onselectstart', 'ondragstart'];
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(el => {
            forbiddenAttrs.forEach(attr => {
                if (el.hasAttribute(attr)) {
                    el.removeAttribute(attr);
                }
                // Xóa cả property JS nếu có
                if (el[attr]) {
                    el[attr] = null;
                }
            });
            
            // Xóa class cấm nếu web dùng class để chặn
            if (el.classList.contains('disable-class') || el.classList.contains('no-copy')) {
                el.classList.remove('disable-class', 'no-copy');
            }
        });
    }

    // 4. Chạy vòng lặp để chống lại việc web render lại (React/Vue/Ajax)
    function mainLoop() {
        if (!document.getElementById('youtube-helper-css')) {
            addGlobalStyle(css);
        }
        cleanInlineHandlers();
    }

    // Khởi chạy ngay lập tức
    addGlobalStyle(css);
    
    // Chạy liên tục mỗi 500ms để đảm bảo không bị ghi đè khi chuyển trang/load câu hỏi mới
    setInterval(mainLoop, 500);

    // Observer phụ trợ cho các thay đổi DOM lớn
    const observer = new MutationObserver(mainLoop);
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();