// ==UserScript==
// @name         讓對話視窗跟編輯視窗重新獲得自由
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在擴充功能選單中點選「啟動懸浮視窗」後，解鎖程式區與對話區，使其可拖曳、縮放
// @author       Gemini
// @match        *120.125.80.91:8088/*
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @resource     jquery_ui_css https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557003/%E8%AE%93%E5%B0%8D%E8%A9%B1%E8%A6%96%E7%AA%97%E8%B7%9F%E7%B7%A8%E8%BC%AF%E8%A6%96%E7%AA%97%E9%87%8D%E6%96%B0%E7%8D%B2%E5%BE%97%E8%87%AA%E7%94%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/557003/%E8%AE%93%E5%B0%8D%E8%A9%B1%E8%A6%96%E7%AA%97%E8%B7%9F%E7%B7%A8%E8%BC%AF%E8%A6%96%E7%AA%97%E9%87%8D%E6%96%B0%E7%8D%B2%E5%BE%97%E8%87%AA%E7%94%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isActivated = false; // 用來防止重複點擊

    // 1. 注入 jQuery UI 樣式
    const css = GM_getResourceText("jquery_ui_css");
    GM_addStyle(css);

    // 2. 自定義樣式
    GM_addStyle(`
        .floating-window {
            position: absolute !important;
            background: #fff;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            border: 1px solid #ccc;
        }
        .bg-primary { cursor: move; }
        #chatContainer {
            height: calc(100% - 140px) !important;
        }
    `);

    // 3. 定義啟動功能的函式
    function activateFloatingMode() {
        if (isActivated) {
            alert("雙視窗模式已經啟動囉！");
            return;
        }

        // --- 設定 A：程式區 (左邊那個) ---
        var $codeArea = $(".col-lg-5").first();
        if ($codeArea.length) {
            $codeArea.addClass("floating-window");
            $codeArea.css({
                "z-index": "1000",
                "left": "50px",
                "top": "80px",
                "width": "800px",
                "height": "600px"
            });
            $codeArea.draggable({ handle: "h5", containment: "document" }).resizable();
        }

        // --- 設定 B：對話區 (右邊那個) ---
        var $chatArea = $("#chat_feedback_area");
        if ($chatArea.length) {
            $chatArea.addClass("floating-window");
            $chatArea.css({
                "z-index": "1001",
                "right": "50px",
                "top": "80px",
                "width": "450px",
                "height": "600px"
            });
            $chatArea.draggable({ handle: "h5", containment: "document" }).resizable();
        }

        isActivated = true;
        console.log("雙視窗優化已啟動：視窗已分離。");
    }

    // 4. 註冊腳本選單
    // 使用者點擊 Tampermonkey 圖示 -> 腳本名稱下方會出現這個選項
    GM_registerMenuCommand("🚀 啟動懸浮視窗模式", activateFloatingMode);

})();