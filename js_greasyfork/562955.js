// ==UserScript==
// @name        左右鍵翻頁69shuba.tw
// @namespace   Violentmonkey Scripts
// @match       *://69shuba.tw/*
// @icon        https://p.69shuba.tw/js/favicon.ico
// @grant       none
// @version     1.03
// @author      qqqueen
// @license     MIT
// @author      qqqueen
// @description 2026/1/17上午11:14:45
// @downloadURL https://update.greasyfork.org/scripts/562955/%E5%B7%A6%E5%8F%B3%E9%8D%B5%E7%BF%BB%E9%A0%8169shubatw.user.js
// @updateURL https://update.greasyfork.org/scripts/562955/%E5%B7%A6%E5%8F%B3%E9%8D%B5%E7%BF%BB%E9%A0%8169shubatw.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 監聽鍵盤按鍵事件
    document.addEventListener('keydown', function(e) {
        // 檢查是否在輸入框中，如果是則不執行
        const activeElement = document.activeElement;
        const isInputField = activeElement.tagName === 'INPUT' ||
                           activeElement.tagName === 'TEXTAREA' ||
                           activeElement.isContentEditable;

        if (isInputField) {
            return;
        }

        // 右箭頭 (→) - 觸發 #linkPrev
        if (e.key === 'ArrowRight' || e.keyCode === 39) {
          const linkNext = document.querySelector('#pb_next');
          if (linkNext) {
              e.preventDefault(); // 防止頁面滾動
              linkNext.click();
          }
            
        }

        // 左箭頭 (←) - 觸發 #linkNext
        if (e.key === 'ArrowLeft' || e.keyCode === 37) {
          const linkPrev = document.querySelector('#pb_prev');
          if (linkPrev) {
              e.preventDefault(); // 防止頁面滾動
              linkPrev.click();
          }
        }
    });

})();