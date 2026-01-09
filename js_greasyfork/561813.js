// ==UserScript==
// @name         備註放大鏡
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  高亮顯示 "買家備註"
// @author       ogoo
// @match        seller.shopee.tw/portal/sale/order/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561813/%E5%82%99%E8%A8%BB%E6%94%BE%E5%A4%A7%E9%8F%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/561813/%E5%82%99%E8%A8%BB%E6%94%BE%E5%A4%A7%E9%8F%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isBuyerNoteFound = false; // 標記是否已找到「買家備註」
    let checkCount = 0; // 檢查次數計數器
    const maxChecks = 3; // 最大檢查次數
    let intervalId = null; // 定時檢查的 ID
    let observer = null; // MutationObserver 實例

    // 函數：檢查「買家備註」標題並高亮、放大文字
    function checkForBuyerNotes() {
        if (isBuyerNoteFound || checkCount >= maxChecks) return; // 若已找到或檢查次數達上限，停止檢查

        console.log('開始檢查「買家備註」標題...');
        const titleElements = document.querySelectorAll('.name');
        console.log('找到', titleElements.length, '個 .name 元素');

        titleElements.forEach((titleElement, index) => {
            console.log(`檢查標題元素 #${index}:`, titleElement.textContent.trim());
            if (titleElement.textContent.trim().includes('買家備註')) {
                console.log(`找到「買家備註」標題在元素 #${index}`);

                // 高亮標題並放大文字
                titleElement.style.backgroundColor = 'yellow';
                titleElement.style.fontSize = '1.2em'; // 放大文字 20%

                // 查找並高亮、放大對應的描述
                const descriptionElement = titleElement.closest('.header')?.parentElement?.querySelector('.description.indent-more');
                if (descriptionElement) {
                    console.log('對應的描述內容：', descriptionElement.textContent.trim());
                    descriptionElement.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
                    descriptionElement.style.fontSize = '1.2em'; // 放大文字 20%
                    descriptionElement.style.padding = '10px 10px';
                    isBuyerNoteFound = true; // 標記已找到
                } else {
                    console.log('未找到對應的 .description.indent-more 元素');
                }
            } else {
                console.log(`標題元素 #${index} 不包含「買家備註」`);
            }
        });

        if (titleElements.length === 0) {
            console.log('未找到 .name 元素，可能內容尚未載入');
        }
    }

    // 使用 requestAnimationFrame 確保與渲染同步
    function runCheck() {
        if (checkCount >= maxChecks || isBuyerNoteFound) return;

        requestAnimationFrame(() => {
            checkForBuyerNotes();
        });
    }

    // 初次載入時執行
    window.addEventListener('load', () => {
        console.log('頁面載入完成，開始第一次檢查...');
        runCheck();

        // 延遲檢查，確保動態內容載入
        setTimeout(runCheck, 2000);
    });

    // 使用 MutationObserver 監聽特定區域的變化
    const targetNode = document.querySelector('.eds-card.card-style');
    if (targetNode) {
        console.log('監聽 .eds-card.card-style 區域變化...');
        observer = new MutationObserver((mutations) => {
            console.log('檢測到 DOM 變化，重新檢查...');
            if (!isBuyerNoteFound && checkCount < maxChecks) {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length || mutation.type === 'characterData') {
                        runCheck();
                    }
                });
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        console.log('未找到 .eds-card.card-style 元素');
    }

    // 定期檢查（以防動態載入）
    intervalId = setInterval(() => {
        checkCount++;
        console.log(`定時檢查（第 ${checkCount}/${maxChecks} 次）...`);

        if (!isBuyerNoteFound && checkCount < maxChecks) {
            runCheck();
        } else {
            clearInterval(intervalId); // 停止定時檢查
            if (isBuyerNoteFound) {
                console.log('「買家備註」已找到，停止檢查');
            } else {
                console.log('已檢查 3 次，未找到「買家備註」，停止檢查');
            }
            if (observer) observer.disconnect(); // 停止 MutationObserver
        }
    }, 2000);
})();