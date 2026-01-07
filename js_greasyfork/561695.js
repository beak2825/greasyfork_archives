// ==UserScript==
// @name         HighLighter_Modern_Final
// @namespace    http://tampermonkey.net/
// @version      0.9.0
// @description  使用浏览器原生 Highlight API。不修改 DOM，不丢文字。Ctrl+左键高亮，Ctrl+右键取消。
// @author       Gemini
// @match        *://*/*
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/561695/HighLighter_Modern_Final.user.js
// @updateURL https://update.greasyfork.org/scripts/561695/HighLighter_Modern_Final.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 创建 CSS 样式（定义高亮外观）
    // ::highlight(my-custom-highlight) 是虚拟的，不改变 HTML 结构
    const style = document.createElement('style');
    style.textContent = `
        ::highlight(my-custom-highlight) {
            background-color: yellow;
            color: black;
        }
    `;
    document.head.appendChild(style);

    // 2. 初始化高亮集合
    let highlightRanges = new Set();

    function updateRegistry() {
        // 更新浏览器渲染的高亮范围
        CSS.highlights.set("my-custom-highlight", new Highlight(...highlightRanges));
    }

    // --- 高亮逻辑 ---
    function applyHighlight() {
        const selection = window.getSelection();
        if (selection.isCollapsed || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0).cloneRange();
        highlightRanges.add(range);
        
        updateRegistry();
        selection.removeAllRanges();
    }

    // --- 取消高亮逻辑 ---
    function removeHighlight() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const selRange = selection.getRangeAt(0);

        // 检查当前选区是否重叠了已有的高亮范围
        highlightRanges.forEach(range => {
            // 如果两个范围有重叠，就移除旧的高亮
            if (isOverlapping(range, selRange) || selection.containsNode(range.startContainer, true)) {
                highlightRanges.delete(range);
            }
        });

        updateRegistry();
        selection.removeAllRanges();
    }

    // 判断两个 Range 是否重叠
    function isOverlapping(range1, range2) {
        return range1.compareBoundaryPoints(Range.END_TO_START, range2) < 0 &&
               range2.compareBoundaryPoints(Range.END_TO_START, range1) < 0;
    }

    // --- 事件监听 ---

    // 禁用右键菜单 (按下 Ctrl 时)
    document.addEventListener('contextmenu', (e) => {
        if (e.ctrlKey) e.preventDefault();
    });

    document.addEventListener('mouseup', (e) => {
        if (!e.ctrlKey) return;

        if (e.button === 0) { // 左键高亮
            setTimeout(applyHighlight, 10);
        } else if (e.button === 2) { // 右键取消
            setTimeout(removeHighlight, 10);
        }
    });

})();