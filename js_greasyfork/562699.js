// ==UserScript==
// @name         Scribd PDF Printer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add PrintPDF button for Scribd documents with auto-scroll
// @author       You
// @match        https://www.scribd.com/document/*
// @match        https://www.scribd.com/embeds/*
// @grant        none
// @license thaieibvn@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/562699/Scribd%20PDF%20Printer.user.js
// @updateURL https://update.greasyfork.org/scripts/562699/Scribd%20PDF%20Printer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tạo nút button với styling
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 24px;
            background-color: #1a73e8;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        button.onmouseover = () => button.style.backgroundColor = '#1557b0';
        button.onmouseout = () => button.style.backgroundColor = '#1a73e8';
        button.onclick = onClick;
        document.body.appendChild(button);
        return button;
    }

    // Lấy document ID từ URL
    function getDocumentId(url) {
        const match = url.match(/\/(?:document|embeds)\/(\d+)/);
        return match ? match[1] : null;
    }

    // Hàm auto-scroll cho đến khi load đầy đủ
    function autoScrollUntilLoaded(callback) {
        let lastHeight = document.documentElement.scrollHeight;
        let sameHeightCount = 0;

        const scrollInterval = setInterval(() => {
            // Scroll xuống
            window.scrollBy(0, window.innerHeight);

            // Kiểm tra xem đã load hết chưa
            setTimeout(() => {
                const currentHeight = document.documentElement.scrollHeight;

                if (currentHeight === lastHeight) {
                    sameHeightCount++;
                    // Nếu chiều cao không đổi 3 lần liên tiếp (1.5 giây) => đã load xong
                    if (sameHeightCount >= 3) {
                        clearInterval(scrollInterval);
                        // Scroll về đầu trang
                        window.scrollTo(0, 0);
                        callback();
                    }
                } else {
                    sameHeightCount = 0;
                    lastHeight = currentHeight;
                }
            }, 100);
        }, 500);
    }

    // Xử lý trang document
    if (window.location.href.includes('/document/')) {
        createButton('GetContent', function() {
            const docId = getDocumentId(window.location.href);
            if (docId) {
                const newUrl = `https://www.scribd.com/embeds/${docId}/content`;
                window.location.href = newUrl;
            } else {
                alert('Không thể tìm thấy document ID');
            }
        });
    }

    // Xử lý trang embeds
    if (window.location.href.includes('/embeds/')) {
        // Tự động scroll khi vào trang embeds
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 10000;
            padding: 10px 20px;
            background-color: #ff9800;
            color: white;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        statusDiv.textContent = 'Đang tải nội dung...';
        document.body.appendChild(statusDiv);

        autoScrollUntilLoaded(() => {
            statusDiv.remove();

            // Tạo nút Print PDF sau khi load xong
            createButton('Print PDF', function() {
                // Tìm và thay thế class của document_scroller
                const scroller = document.querySelector('.document_scroller');
                if (scroller) {
                    scroller.className = '=';
                }

                // Remove toolbar_drop
                const toolbarDrop = document.querySelector('.toolbar_drop');
                if (toolbarDrop) {
                    toolbarDrop.remove();
                }

                // Remove mobile_overlay
                const mobileOverlay = document.querySelector('.mobile_overlay');
                if (mobileOverlay) {
                    mobileOverlay.remove();
                }

                // Trigger Ctrl+P tự động
                setTimeout(() => {
                    window.print();
                }, 300);
            });
        });
    }
})();