// ==UserScript==
// @name         Gemini 解除字数限制锁死 + 智能清空版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解决Gemini自拦截限制字数问题，支持纯回车清空
// @author       Human & Gemini AI
// @match        *://gemini.google.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561665/Gemini%20%E8%A7%A3%E9%99%A4%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6%E9%94%81%E6%AD%BB%20%2B%20%E6%99%BA%E8%83%BD%E6%B8%85%E7%A9%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561665/Gemini%20%E8%A7%A3%E9%99%A4%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6%E9%94%81%E6%AD%BB%20%2B%20%E6%99%BA%E8%83%BD%E6%B8%85%E7%A9%BA%E7%89%88.meta.js
// ==/UserScript==

/*
  ==========================================================================
  COLLABORATION STATEMENT:
  This script was co-authored by a human user and Gemini (AI). Please review the code before using it.
  ==========================================================================
  MIT License

  Copyright (c) 2024 Gemini Helper

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

(function() {
    'use strict';

    // 增加一个全局状态，标记当前是否处于“故意清空”状态
    let isManualClearing = false;

    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
        if (prop === 'insertAt' && descriptor.value && typeof descriptor.value === 'function') {
            const originalInsert = descriptor.value;
            descriptor.value = function(pos, text, range) {
                if (typeof text === 'string') {
                    this.text = (this.text || "").slice(0, pos) + text + (this.text || "").slice(pos);
                }
                return originalInsert.apply(this, arguments);
            };
        }

        if (prop === 'deleteAt' && descriptor.value && typeof descriptor.value === 'function') {
            const originalDelete = descriptor.value;
            descriptor.value = function(t, e) {
                // 修改拦截逻辑：
                // 如果是手动清空状态 (isManualClearing 为 true)，或者是正常的单字删除 (e <= 1)，则放行
                if (isManualClearing || e <= 1) {
                    return originalDelete.apply(this, arguments);
                }

                // 否则，拦截系统自动截断
                if (e > 1 && (t + e) >= (this.text?.length || 0)) {
                    console.warn(`🛡️ 拦截了系统的自动截断动作`);
                    return;
                }
                return originalDelete.apply(this, arguments);
            };
        }
        return originalDefineProperty.apply(this, arguments);
    };

    window.addEventListener('keydown', function(event) {
        const editor = document.querySelector('.ql-editor');
        if (!editor || !editor.contains(event.target)) return;

        if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            setTimeout(() => {
                const container = document.querySelector('.ql-container');
                if (container && container.__quill) {
                    console.log("🧹 正在执行合法的清空...");

                    // --- 开启通行证 ---
                    isManualClearing = true;

                    try {
                        container.__quill.setText('');
                    } finally {
                        // --- 动作完成后立即关闭通行证，恢复防御状态 ---
                        // 使用 setTimeout 确保在 Quill 内部异步逻辑执行完后再关闭
                        setTimeout(() => { isManualClearing = false; }, 50);
                    }
                }
            }, 150);
        }
    }, true);

    console.log("🛠️ 智能拦截模式已激活（已解决自拦截问题）");
})();