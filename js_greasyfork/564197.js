// ==UserScript==
// @name         Gemini LaTeX Auto-Converter
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  自动将 Gemini 的 $$...$$ 和 $...$ 都转换为 \(...\) 格式，支持全链路劫持
// @author       YourName
// @match        https://gemini.google.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/564197/Gemini%20LaTeX%20Auto-Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/564197/Gemini%20LaTeX%20Auto-Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置 ===
    const CONFIG_KEY = 'latex_convert_enabled';
    let isEnabled = GM_getValue(CONFIG_KEY, true);
    let menuId = null;

    // === 菜单管理 ===
    function updateMenu() {
        if (menuId !== null) GM_unregisterMenuCommand(menuId);
        menuId = GM_registerMenuCommand(
            isEnabled ? '🟢 LaTeX 转换已开启' : '🔴 LaTeX 转换已关闭',
            () => {
                isEnabled = !isEnabled;
                GM_setValue(CONFIG_KEY, isEnabled);
                updateMenu();
            }
        );
    }
    updateMenu();

    // === 核心文本处理逻辑 (更新部分) ===
    function processText(text) {
        if (!isEnabled || typeof text !== 'string') return text;

        // 步骤 1: 先替换块级公式 $$ ... $$ -> \( ... \)
        // 这一步会把所有的 $$ 变成 \( \)，所以剩下的 $ 就只可能是行内公式或普通货币符号
        let result = text.replace(/\$\$([\s\S]+?)\$\$/g, '\\($1\\)');

        // 步骤 2: 再替换行内公式 $ ... $ -> \( ... \)
        // 正则解释：
        // (?<!\$)      : 确保 $ 前面不是 $ (防止匹配到漏网的 $$)
        // \$(?!\$)     : 匹配 $ 本身，且后面不能紧跟着 $
        // ([^$]+?)     : 匹配中间内容，非贪婪，且内容里不能有 $
        // (?<!\$)\$(?!\$): 匹配结束的 $，同样前后不能是 $
        if (result.includes('$')) {
            result = result.replace(/(?<!\$)\$(?!\$)([^$]+?)(?<!\$)\$(?!\$)/g, '\\($1\\)');
        }

        return result;
    }

    // === 拦截层 1: Clipboard Item API (navigator.clipboard.write) ===
    if (unsafeWindow.navigator && unsafeWindow.navigator.clipboard && unsafeWindow.navigator.clipboard.write) {
        const originalWrite = unsafeWindow.navigator.clipboard.write;

        unsafeWindow.navigator.clipboard.write = async function(data) {
            if (!isEnabled || !data || data.length === 0) {
                return originalWrite.call(this, data);
            }
            try {
                const newItems = [];
                for (const item of data) {
                    const parts = {};
                    for (const type of item.types) {
                        const blob = await item.getType(type);
                        if (type === 'text/plain' || type === 'text/html') {
                            const text = await blob.text();
                            const processed = processText(text);
                            parts[type] = new Blob([processed], { type });
                        } else {
                            parts[type] = blob;
                        }
                    }
                    newItems.push(new ClipboardItem(parts));
                }
                return originalWrite.call(this, newItems);
            } catch (err) {
                return originalWrite.call(this, data);
            }
        };
    }

    // === 拦截层 2: navigator.clipboard.writeText ===
    if (unsafeWindow.navigator && unsafeWindow.navigator.clipboard) {
        const originalWriteText = unsafeWindow.navigator.clipboard.writeText;
        unsafeWindow.navigator.clipboard.writeText = function(text) {
            return originalWriteText.call(this, processText(text));
        };
    }

    // === 拦截层 3: DataTransfer.setData (传统 copy 事件) ===
    const originalSetData = unsafeWindow.DataTransfer.prototype.setData;
    unsafeWindow.DataTransfer.prototype.setData = function(format, data) {
        if (typeof data === 'string' && (format.includes('text') || format === 'text/plain')) {
            data = processText(data);
        }
        return originalSetData.call(this, format, data);
    };

})();