// ==UserScript==
// @name         自定义快捷键快捷操作
// @namespace    http://leizingyiu.net/
// @version      2026-01-15
// @description  目前已腾讯文档表格为例：按 Alt+B 填充，Alt+C 清理背景色（仅在匹配页面生效）
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @author       leizingyiu
// @license      GNU AGPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562716/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/562716/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 页面级配置 ==========
    const config = {
        host: [
            {
                pageReg: /.*docs\.qq\.com\/sheet\/.*/,
                bindings: {
                    'Alt+B': function color() {
                        const el = document.querySelector('.icon-svg-toolbar_fill_color');
                        if (el) el.click();
                    },
                    'Alt+C': function clean() {
                        const arrow = document.querySelector('#toolbar-button-background-color [class*="toolbar-button_arrow-container"]');
                        if (arrow) {
                            arrow.click();
                            setTimeout(() => {
                                const reset = document.querySelector('.dui-colorpicker-action-top');
                                if (reset) reset.click();
                            }, 500);
                        }
                    }
                }
            }
            // 可继续添加其他站点规则，例如：
            // {
            //     pageReg: /photopea\.com/,
            //     bindings: { 'Alt+X': () => { /* ... */ } }
            // }
        ]
    };

    // 当前页面 URL
    const currentUrl = window.location.href;

    // 查找第一个匹配的规则
    let activeBindings = null;
    for (const rule of config.host) {
        if (rule.pageReg.test(currentUrl)) {
            activeBindings = rule.bindings;
            break;
        }
    }

    // ❗无匹配配置？直接退出，不解析、不绑定事件
    if (!activeBindings || Object.keys(activeBindings).length === 0) {
        return;
    }

    // ========== 工具函数：解析 'Alt+B' 为 code + 修饰键 ==========
    function parseKeyCombo(comboStr) {
        const parts = comboStr.split('+').map(p => p.trim());
        const result = {
            alt: false,
            ctrl: false,
            shift: false,
            meta: false,
            mainKey: null
        };

        for (const part of parts) {
            if (part === 'Alt') result.alt = true;
            else if (part === 'Ctrl') result.ctrl = true;
            else if (part === 'Shift') result.shift = true;
            else if (part === 'Meta') result.meta = true;
            else result.mainKey = part.toUpperCase();
        }

        if (result.mainKey) {
            if (/[A-Z]/.test(result.mainKey)) {
                result.code = 'Key' + result.mainKey;
            } else if (/[0-9]/.test(result.mainKey)) {
                result.code = 'Digit' + result.mainKey;
            } else if (result.mainKey.startsWith('F') && !isNaN(result.mainKey.slice(1))) {
                result.code = result.mainKey;
            } else {
                console.warn(`Unsupported key in combo: ${comboStr}`);
                result.code = null;
            }
        }

        return result;
    }

    // 预解析快捷键映射
    const parsedBindings = new Map();
    for (const [combo, handler] of Object.entries(activeBindings)) {
        const parsed = parseKeyCombo(combo);
        if (parsed && parsed.code) {
            const key = JSON.stringify({
                code: parsed.code,
                alt: parsed.alt,
                ctrl: parsed.ctrl,
                shift: parsed.shift,
                meta: parsed.meta
            });
            parsedBindings.set(key, handler);
        }
    }

    // 键盘事件处理器
    function handleKeyDown(event) {
        const key = JSON.stringify({
            code: event.code,
            alt: event.altKey,
            ctrl: event.ctrlKey,
            shift: event.shiftKey,
            meta: event.metaKey
        });

        const handler = parsedBindings.get(key);
        if (handler) {
            event.preventDefault();
            event.stopImmediatePropagation();
            handler();
        }
    }

    // ✅ 仅当有有效配置时才绑定事件，并确保 DOM 安全
    function bindKeyEvent() {
        window.addEventListener('keydown', handleKeyDown, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindKeyEvent);
    } else {
        bindKeyEvent();
    }

})();