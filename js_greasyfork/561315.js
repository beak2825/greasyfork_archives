// ==UserScript==
// @name         ChatGPT Quick Search
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  通过快捷键快速激活/退出 ChatGPT 搜索模式。使用 Cmd/Ctrl+Shift+I 切换搜索模式。
// @author       Lovecrafx
// @license      MIT
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561315/ChatGPT%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/561315/ChatGPT%20Quick%20Search.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 快捷键配置
    const SHORTCUT_KEY = "i";        // 快捷键字符
    const USE_META = true;           // 使用 Command 键 (Mac)
    const USE_SHIFT = true;          // 使用 Shift 键
    // 工具函数：获取搜索按钮元素
    function getSearchButton() {
        return document.querySelector("button.__composer-pill");
    }
    // 工具函数：获取编辑器元素
    function getEditor() {
        return document.querySelector("div.ProseMirror");
    }
    // 工具函数：模拟点击菜单项
    function clickSearchItem() {
        const item = document.querySelector('.__menu-item[data-highlighted]');
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const options = {
            bubbles: true,
            cancelable: true,
            view: window,
            pointerType: 'mouse',
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
        };
        item.dispatchEvent(new PointerEvent('pointerdown', options));
        item.dispatchEvent(new PointerEvent('pointerup', options));
        item.dispatchEvent(new MouseEvent('mousedown', options));
        item.dispatchEvent(new MouseEvent('mouseup', options));
        item.dispatchEvent(new MouseEvent('click', options));
    }
    // 工具函数：清空编辑器内容并返回原内容
    function clearContent(editor){
        const content = editor.innerText || editor.textContent || "";
        editor.focus();
        document.execCommand("selectAll", false, null);
        document.execCommand("delete", false, null);
        return content;
    }
    // 功能：取消搜索模式
    function cancelSearchMode() {
        console.log("[ChatGPT Shortcut] Cancelling search mode...");
        const button = getSearchButton();
        if (!button) return;
        const text = button.outerText;
        if (text === "搜索" || text === "Search") {
            console.log("[ChatGPT Shortcut] Search mode cancelled.");
            button.click();
        }
    }
    // 全局状态标记
    let isActivating = false;
    // 功能：激活搜索模式
    function activateSearchMode() {
        if (isActivating) return;
        const editor = getEditor();
        if (!editor) return;
        isActivating = true;
        const content = clearContent(editor);
        document.execCommand('insertText', false, '/search');
        setTimeout(() => {
            clickSearchItem();
            isActivating = false;
            document.execCommand('insertText', false, content);
        }, 0);
    }
    // 键盘事件监听
    window.addEventListener(
        "keydown",
        (e) => {
            if (
                e.key.toLowerCase() === SHORTCUT_KEY &&
                e.metaKey === USE_META &&
                e.shiftKey === USE_SHIFT
            ) {
                e.preventDefault();
                e.stopPropagation();
                if (getSearchButton()) {
                    cancelSearchMode();
                } else {
                    activateSearchMode();
                }
            }
        },
        true
    );
})();