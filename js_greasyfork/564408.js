// ==UserScript==
// @name         Medium to Freedium (Ultra Fast)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Instantly redirect Medium articles to Freedium before the page loads. High-speed bypass for medical and AI research.
// @author       Dr. Tran Quoc Hoai & AI Assistant
// @match        https://*.medium.com/*
// @match        https://generativeai.pub/*
// @match        https://towardsdatascience.com/*
// @match        https://betterprogramming.pub/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564408/Medium%20to%20Freedium%20%28Ultra%20Fast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564408/Medium%20to%20Freedium%20%28Ultra%20Fast%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Thực thi ngay lập tức ở mức độ engine trình duyệt
    const currentUrl = window.location.href;

    // Kiểm tra nếu là link bài viết (thường có hash ID hoặc độ dài path > 1)
    // Tránh redirect khi đang ở trang chủ hoặc trang setting
    const urlPath = window.location.pathname;
    const isArticle = urlPath.length > 1 && !['/', "@", '/me', '/m/signin'].includes(urlPath);

    if (isArticle) {
        // Chuyển hướng "cứng" ở mức window, chặn đứng việc tải tài nguyên Medium
        window.location.replace("https://freedium-mirror.cfd/" + currentUrl);
    }
})();