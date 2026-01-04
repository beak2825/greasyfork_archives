// ==UserScript==
// @name         忘記切注音？按Tab直接轉中文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在網頁輸入文字時，按 Tab 鍵將自動把前面打出的英文版注音符號轉換為繁體中文字。
// @author       Microdust & Gemini 3 pro
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      inputtools.google.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559688/%E5%BF%98%E8%A8%98%E5%88%87%E6%B3%A8%E9%9F%B3%EF%BC%9F%E6%8C%89Tab%E7%9B%B4%E6%8E%A5%E8%BD%89%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/559688/%E5%BF%98%E8%A8%98%E5%88%87%E6%B3%A8%E9%9F%B3%EF%BC%9F%E6%8C%89Tab%E7%9B%B4%E6%8E%A5%E8%BD%89%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 排除不處理的輸入框類型
    function isExcluded(target) {
        if (target.tagName === 'INPUT') {
            const excludedTypes = ['password', 'email', 'number', 'tel', 'date', 'datetime-local', 'color', 'range'];
            if (excludedTypes.includes(target.type)) return true;
        }
        if (target.readOnly || target.disabled) return true;

        // 排除特定的程式碼編輯器 class
        const cls = (target.className || '').toString();
        if (cls.includes('monaco') || cls.includes('ace_')) return true;

        return false;
    }

    function handleKeydown(e) {
        if (e.key !== 'Tab') return;

        const target = e.target;

        // 判斷目標類型
        const isInput = (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
        const isEditable = target.isContentEditable;

        if (!isInput && !isEditable) return;
        if (isExcluded(target)) return;

        // 處理標準輸入框 (Input / Textarea)
        if (isInput) {
            processInputTag(e, target);
        }
        // 處理其他可編輯區域 (ContentEditable)
        else if (isEditable) {
            processContentEditable(e, target);
        }
    }

    // 處理標準輸入框邏輯
    function processInputTag(e, target) {
        const val = target.value;
        const selEnd = target.selectionEnd;
        const textBeforeCursor = val.slice(0, selEnd);
        const match = textBeforeCursor.match(/[\x20-\x7E]+$/);

        if (match) {
            const targetText = match[0];
            if (!targetText.trim()) return; // 縮排不處理

            e.preventDefault();
            e.stopPropagation();

            requestTranslation(targetText, (convertedText) => {
                const textAfterCursor = val.slice(selEnd);
                const newTextBeforeCursor = textBeforeCursor.slice(0, match.index) + convertedText;

                target.value = newTextBeforeCursor + textAfterCursor;
                target.selectionStart = target.selectionEnd = newTextBeforeCursor.length;

                // 觸發事件讓 React/Vue/Angular 偵測到
                target.dispatchEvent(new Event('input', { bubbles: true }));
                target.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }

    // 處理 ContentEditable
    function processContentEditable(e, target) {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;

        const node = sel.focusNode;

        // 確認是 Text Node
        if (node.nodeType !== Node.TEXT_NODE) return;

        const offset = sel.focusOffset;
        const textTotal = node.nodeValue;
        const textBeforeCursor = textTotal.slice(0, offset);
        const match = textBeforeCursor.match(/[\x20-\x7E]+$/);

        if (match) {
            const targetText = match[0];
            if (!targetText.trim()) return; // 縮排不處理
            e.preventDefault();
            e.stopPropagation();

            requestTranslation(targetText, (convertedText) => {
                // 修改 DOM 文字
                const textAfterCursor = textTotal.slice(offset);
                const newTextBeforeCursor = textBeforeCursor.slice(0, match.index) + convertedText;

                // 直接寫入節點值
                node.nodeValue = newTextBeforeCursor + textAfterCursor;

                // 修正游標位置到中文後面
                const newOffset = newTextBeforeCursor.length;
                try {
                    const newRange = document.createRange();
                    newRange.setStart(node, newOffset);
                    newRange.setEnd(node, newOffset);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                } catch (rangeErr) {
                    console.error("游標修正失敗:", rangeErr);
                }

                // 觸發 input event
                target.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }
    }

    function requestTranslation(text, callback) {
        const formattedText = text.replace(/ +/g, '=').replace(/,+/g, '%2C');
        console.log(encodeURIComponent(formattedText))
        const apiUrl = `https://inputtools.google.com/request?text=${encodeURIComponent(formattedText)}&itc=zh-hant-t-i0-und&num=1&ie=utf-8&oe=utf-8`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
                        const result = data[1][0][1][0];
                        if (result) callback(result);
                    }
                } catch (err) {
                    console.error("轉換解析失敗:", err);
                }
            }
        });
    }

    document.addEventListener('keydown', handleKeydown, true);
})();