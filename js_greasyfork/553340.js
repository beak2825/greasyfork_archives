// ==UserScript==
// @name         Triet Long Nach Gia Bao Nhieu
// @namespace    https://google.com/
// @version      0.1
// @match        *://*/*
// @license      MIT
// @description  Triệt lông nách giá bao nhiêu
// @downloadURL https://update.greasyfork.org/scripts/553340/Triet%20Long%20Nach%20Gia%20Bao%20Nhieu.user.js
// @updateURL https://update.greasyfork.org/scripts/553340/Triet%20Long%20Nach%20Gia%20Bao%20Nhieu.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Cấu hình
    const CONFIG = {
        position: 'bottom-left', // Vị trí hiển thị: 'bottom-left', 'bottom-right', 'top-left', 'top-right'
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Màu nền
        textColor: 'white', // Màu chữ
        fontSize: '12px', // Kích thước chữ
        padding: '5px', // Khoảng cách đệm
        zIndex: 9999, // Độ ưu tiên hiển thị
        updateInterval: 1000, // Thời gian cập nhật (ms)
    };
 
})();