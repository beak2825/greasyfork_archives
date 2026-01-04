// ==UserScript==
// @name        左右鍵翻頁
// @namespace   Violentmonkey Scripts
// @match       https://ttks.tw/novel/*
// @icon        https://ttks.tw/novel/imgs/apple-touch-icon-57x57.png
// @grant       none
// @version     1.02
// @author      qqqueen
// @license     MIT
// @description 2026/1/3 下午6:50:05
// @downloadURL https://update.greasyfork.org/scripts/561233/%E5%B7%A6%E5%8F%B3%E9%8D%B5%E7%BF%BB%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/561233/%E5%B7%A6%E5%8F%B3%E9%8D%B5%E7%BF%BB%E9%A0%81.meta.js
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
          const linkNext = document.querySelector('#linkNext');
          if (linkNext) {
              e.preventDefault(); // 防止頁面滾動
              linkNext.click();
          }
            
        }

        // 左箭頭 (←) - 觸發 #linkNext
        if (e.key === 'ArrowLeft' || e.keyCode === 37) {
          const linkPrev = document.querySelector('#linkPrev');
          if (linkPrev) {
              e.preventDefault(); // 防止頁面滾動
              linkPrev.click();
          }
        }
    });

})();