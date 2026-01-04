// ==UserScript==
// @name         Gemini 自动添加Prompt（光标修复版）
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动追加提示词，修复打字慢时光标跳动的问题
// @author       You
// @match        https://gemini.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548790/Gemini%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0Prompt%EF%BC%88%E5%85%89%E6%A0%87%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548790/Gemini%20%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0Prompt%EF%BC%88%E5%85%89%E6%A0%87%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置区域 ===
    const PROMPT_LINES = [
        "", // 空行
        "1. 所有回复内容必须有严格的出处，或已经经过严格的验证，未经过验证的内容要用鲜艳的红色进行标识",
        "2. 使用最简单的方案进行回复",
        "3. 回复要尽可能的详细，不要想当然，能详细的部分一定要详细，不要省略",
        "4. 必须给出完整的解决方案，不要省略任何文件中的相关内容",
        "5. 以简体中文输出"
    ];

    const CHECK_KEY = "以简体中文输出";
    let timer = null;

    // === 核心逻辑 ===
    function appendSuffixSafe(editor) {
        // --- 1. 关键修复：保存当前光标位置 ---
        const selection = window.getSelection();
        let savedRange = null;
        if (selection.rangeCount > 0) {
            // 克隆一个当前的光标范围对象
            savedRange = selection.getRangeAt(0).cloneRange();
        }

        // --- 2. 创建并追加内容（保持原有的安全逻辑） ---
        const fragment = document.createDocumentFragment();
        PROMPT_LINES.forEach(lineText => {
            const p = document.createElement('p');
            if (lineText === "") {
                p.appendChild(document.createElement('br'));
            } else {
                p.textContent = lineText;
            }
            fragment.appendChild(p);
        });

        // 追加到最后（这步操作通常不会移动光标，但在某些浏览器下可能会失去焦点）
        editor.appendChild(fragment);

        // --- 3. 关键修复：恢复光标位置 ---
        // 如果之前有光标，强行把它放回原来的位置，而不是让它跑到末尾
        if (savedRange) {
            selection.removeAllRanges();
            selection.addRange(savedRange);
        }

        // --- 4. 通知网页内容变了 ---
        editor.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // === 监控逻辑 ===
    const initInterval = setInterval(() => {
        const editor = document.querySelector('div.ql-editor');

        if (editor) {
            clearInterval(initInterval);
            console.log("Gemini 增强脚本：编辑器已就绪 (V3.1 光标修复版)");

            editor.addEventListener('input', () => {
                clearTimeout(timer);
                // 1.5秒无操作才触发（稍微延长一点时间，避免打字中途频繁检测）
                timer = setTimeout(() => {
                    const text = editor.innerText || "";

                    if (text.trim().length > 0 && !text.includes(CHECK_KEY)) {
                        appendSuffixSafe(editor);
                        console.log("Gemini 增强脚本：后缀已追加，光标位置已保护");
                    }
                }, 1500);
            });
        }
    }, 1000);

})();