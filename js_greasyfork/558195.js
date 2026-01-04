// ==UserScript==
// @name         剪贴板过滤器
// @description  根据自定义规则过滤复制内容
// @namespace    http://tampermonkey.net/
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @version      1.3
// @author       Gemini
// @license      GPLv3
// @icon      data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+PHBhdGggZmlsbD0iI0MxNjk0RiIgZD0iTTMyIDM0YTIgMiAwIDAgMS0yIDJINmEyIDIgMCAwIDEtMi0yVjdhMiAyIDAgMCAxIDItMmgyNGEyIDIgMCAwIDEgMiAyeiIvPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0yOSAzMmExIDEgMCAwIDEtMSAxSDhhMSAxIDAgMCAxLTEtMVY5YTEgMSAwIDAgMSAxLTFoMjBhMSAxIDAgMCAxIDEgMXoiLz48cGF0aCBmaWxsPSIjQ0NENkREIiBkPSJNMjUgM2gtNGEzIDMgMCAxIDAtNiAwaC00YTIgMiAwIDAgMC0yIDJ2NWgxOFY1YTIgMiAwIDAgMC0yLTIiLz48Y2lyY2xlIGN4PSIxOCIgY3k9IjMiIHI9IjIiIGZpbGw9IiMyOTJGMzMiLz48cGF0aCBmaWxsPSIjOTlBQUI1IiBkPSJNMjAgMTRhMSAxIDAgMCAxLTEgMWgtOWExIDEgMCAwIDEgMC0yaDlhMSAxIDAgMCAxIDEgMW03IDRhMSAxIDAgMCAxLTEgMUgxMGExIDEgMCAwIDEgMC0yaDE2YTEgMSAwIDAgMSAxIDFtMCA0YTEgMSAwIDAgMS0xIDFIMTBhMSAxIDAgMSAxIDAtMmgxNmExIDEgMCAwIDEgMSAxbTAgNGExIDEgMCAwIDEtMSAxSDEwYTEgMSAwIDEgMSAwLTJoMTZhMSAxIDAgMCAxIDEgMW0wIDRhMSAxIDAgMCAxLTEgMWgtOWExIDEgMCAxIDEgMC0yaDlhMSAxIDAgMCAxIDEgMSIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/558195/%E5%89%AA%E8%B4%B4%E6%9D%BF%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558195/%E5%89%AA%E8%B4%B4%E6%9D%BF%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 性能优化：全局缓存变量
    // ==========================================
    let cachedRules = [];
    const textDecoder = new TextDecoder('utf-8');

    // ==========================================
    // 核心逻辑：规则预处理 (构建缓存)
    // ==========================================
    function refreshRulesCache() {
        const rawRules = GM_getValue('cf_rules', []);
        cachedRules = rawRules
            .filter(r => r.enabled !== false && r.find) // 过滤掉禁用的和无效的
            .map(rule => {
                // 新增：Unicode 标志处理
                const baseFlags = rule.useUnicode ? 'u' : '';

                // 1. 预编译 URL 匹配正则
                let siteRegex = null;
                let siteString = null;
                if (rule.match && rule.match.trim() !== "") {
                    if (rule.useRegexMatch) {
                        try {
                            // 匹配 URL 通常不需要 g 但如果开启 Unicode 需要 u
                            siteRegex = new RegExp(rule.match, baseFlags);
                        } catch (e) { console.error('Invalid Site Regex', e); }
                    } else {
                        siteString = rule.match;
                    }
                }

                // 2. 预编译 查找 正则
                let findRegex = null;
                try {
                    if (rule.useRegexFind) {
                        // 查找需要全局 g 如果开启 Unicode 则为 gu
                        findRegex = new RegExp(rule.find, 'g' + baseFlags);
                    } else {
                        // 自动转义特殊字符
                        const escapedFind = rule.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        findRegex = new RegExp(escapedFind, 'g' + baseFlags);
                    }
                } catch (e) {
                    console.error('Invalid Find Regex', e);
                    return null; // 规则无效 跳过
                }

                // 3. 预处理替换逻辑 (闭包优化)
                let replaceHandler = null;
                const replaceText = rule.replace || "";
                const upperReplace = replaceText.toUpperCase();

                if (upperReplace === '{BASE64}') {
                    replaceHandler = (match, ...args) => {
                        const target = (args.length > 2 && args[0] !== undefined) ? args[0] : match;
                        try {
                            let base64 = target.replace(/[^A-Za-z0-9+/=_-]/g, '').replace(/-/g, '+').replace(/_/g, '/');
                            while (base64.length % 4) base64 += '=';
                            const binary = atob(base64);
                            const bytes = new Uint8Array(binary.length);
                            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                            return textDecoder.decode(bytes);
                        } catch (e) { return match; }
                    };
                } else if (upperReplace === '{URL}') {
                    replaceHandler = (match, ...args) => {
                        const target = (args.length > 2 && args[0] !== undefined) ? args[0] : match;
                        try { return decodeURIComponent(target); } catch(e) { return match; }
                    };
                } else if (upperReplace === '{HEX}') {
                    replaceHandler = (match, ...args) => {
                        const target = (args.length > 2 && args[0] !== undefined) ? args[0] : match;
                        try {
                            const hex = target.replace(/[^0-9a-fA-F]/g, '');
                            if (hex.length % 2 !== 0) return target;
                            const bytes = new Uint8Array(hex.length / 2);
                            for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
                            return textDecoder.decode(bytes);
                        } catch(e) { return match; }
                    };
                } else if (upperReplace === '{REVERSE}') {
                    replaceHandler = (match, ...args) => {
                        const target = (args.length > 2 && args[0] !== undefined) ? args[0] : match;
                        return [...target].reverse().join('');
                    };
                } else if (upperReplace === '{ROT13}') {
                    replaceHandler = (match, ...args) => {
                        const target = (args.length > 2 && args[0] !== undefined) ? args[0] : match;
                        return target.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
                    };
                } else {
                    // 普通文本替换 处理 $ 符号
                    const finalReplaceText = rule.useRegexReplace ? replaceText : replaceText.replace(/\$/g, '$$$$');
                    replaceHandler = finalReplaceText;
                }

                return {
                    siteRegex,
                    siteString,
                    findRegex,
                    replaceHandler
                };
            })
            .filter(r => r !== null); // 过滤掉编译失败的规则
    }

    // 初始化时加载一次
    refreshRulesCache();

    // ==========================================
    // 核心逻辑：规则处理函数 (优化版)
    // ==========================================

    function applyRulesToText(text) {
        if (!text) return text;

        let processedText = text;
        const currentUrl = window.location.href;

        // 直接遍历内存中的预编译规则
        for (const rule of cachedRules) {
            // 1. 快速检查生效网站
            if (rule.siteRegex) {
                if (!rule.siteRegex.test(currentUrl)) continue;
            } else if (rule.siteString) {
                if (!currentUrl.includes(rule.siteString)) continue;
            }

            // 2. 执行替换
            rule.findRegex.lastIndex = 0;
            processedText = processedText.replace(rule.findRegex, rule.replaceHandler);
        }

        return processedText;
    }

    // ==========================================
    // 核心逻辑：API 劫持 (针对点击复制按钮)
    // ==========================================

    function hijackClipboardApi() {
        const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        if (targetWindow.navigator && targetWindow.navigator.clipboard) {
            const originalWriteText = targetWindow.navigator.clipboard.writeText;
            targetWindow.navigator.clipboard.writeText = function(text) {
                const processed = applyRulesToText(text);
                return originalWriteText.call(this, processed);
            };
        }
    }

    hijackClipboardApi();

    // ==========================================
    // 核心逻辑：DOM 事件监听 (针对 Ctrl+C)
    // ==========================================

    document.addEventListener('copy', function(e) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const plainText = selection.toString();
        if (!plainText) return;

        const processedPlainText = applyRulesToText(plainText);

        if (processedPlainText === plainText) {
            return;
        }

        let htmlText = "";
        if (e.clipboardData) {
            const container = document.createElement('div');
            for (let i = 0; i < selection.rangeCount; i++) {
                container.appendChild(selection.getRangeAt(i).cloneContents());
            }
            htmlText = container.innerHTML;
        }

        const processedHtmlText = applyRulesToText(htmlText);

        e.preventDefault();
        e.clipboardData.setData('text/plain', processedPlainText);
        if (htmlText) {
            e.clipboardData.setData('text/html', processedHtmlText);
        }
        e.stopImmediatePropagation();
    }, true);

    // ==========================================
    // 数据存储与默认值
    // ==========================================

    GM_registerMenuCommand("设置面板", openSettings);

    function getRules() {
        return GM_getValue('cf_rules', []);
    }

    function saveRules(rules) {
        GM_setValue('cf_rules', rules);
        refreshRulesCache();
    }

    // ==========================================
    // UI 界面逻辑
    // ==========================================

    function openSettings() {
        const existing = document.getElementById('cf-settings-modal');
        if (existing) return;

        GM_addStyle(`
            #cf-settings-modal {
                all: initial !important; position: fixed !important; top: 0 !important; left: 0 !important;
                width: 100% !important; height: 100% !important; background: transparent !important;
                z-index: 2147483647 !important; display: flex !important; justify-content: center !important;
                align-items: center !important; font-family: sans-serif !important; font-size: 13px !important;
                color: #eee !important; pointer-events: none !important; line-height: normal !important; text-align: left !important;
            }
            #cf-settings-modal * { box-sizing: border-box !important; }
            #cf-settings-content {
                background: rgb(44, 44, 44) !important; padding: 15px !important; border: 1px solid rgb(80, 80, 80) !important;
                width: 900px !important; max-width: 98% !important; max-height: 90% !important;
                display: flex !important; flex-direction: column !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
                pointer-events: auto !important; border-radius: 0 !important;
            }
            .cf-header {
                display: flex !important; gap: 5px !important; align-items: center !important; position: relative !important;
                margin-bottom: 5px !important; height: 30px !important; padding: 0 14px 0 6px !important; flex-shrink: 0 !important;
            }
            .cf-header-title {
                position: absolute !important; left: 0 !important; width: 100% !important; text-align: center !important;
                font-size: 16px !important; color: #fff !important; pointer-events: none !important; z-index: 0 !important;
            }
            #cf-close {
                position: absolute !important; right: 0 !important; z-index: 10 !important; border: none !important;
                background: none !important; cursor: pointer !important; font-size: 20px !important; line-height: 1 !important;
                color: #ccc !important; padding: 0 !important;
            }
            #cf-help {
                width: 26px !important; height: 20px !important; border: none !important; background: none !important;
                cursor: pointer !important; font-size: 15px !important; font-weight: bold !important; line-height: 1 !important;
                color: #999 !important; padding: 0 !important; display: flex !important; justify-content: center !important;
                align-items: center !important;
            }
            #cf-help:hover { color: #fff !important; }

            /* 独立帮助窗口 */
            #cf-help-window {
                display: none !important; position: fixed !important; top: 50% !important; left: 50% !important;
                transform: translate(-50%, -50%) !important; width: 320px !important; background: rgb(55, 55, 55) !important;
                border: 1px solid rgb(100, 100, 100) !important; box-shadow: 0 15px 40px rgba(0,0,0,0.8) !important;
                z-index: 2147483647 !important; flex-direction: column !important; padding: 15px !important; pointer-events: auto !important;
            }
            .cf-help-header { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 15px !important; }
            .cf-help-title { color: #fff !important; font-size: 14px !important; }
            #cf-help-window-close { border: none !important; background: none !important; cursor: pointer !important; font-size: 18px !important; color: #ccc !important; padding: 0 !important; }
            #cf-help-grid { display: grid !important; grid-template-columns: 100px 1fr !important; gap: 8px 15px !important; align-items: center !important; }
            .cf-help-col-header { color: #999 !important; font-size: 12px !important; border-bottom: 1px solid #666 !important; padding-bottom: 8px !important; margin-bottom: 5px !important; }
            .cf-help-key { color: rgb(178, 139, 247) !important; font-size: 13px !important; cursor: pointer !important; user-select: none !important; transition: color 0.2s !important; }
            .cf-help-key:active { transform: scale(0.98) !important; }
            .cf-help-desc { color: #ccc !important; font-size: 13px !important; line-height: 1.4 !important; }

            /* 搜索框 */
            #cf-search-input {
                background: #222 !important; border: 1px solid #555 !important; color: #eee !important; padding: 2px 5px !important;
                font-size: 13px !important; border-radius: 0 !important; margin: 0 !important; flex: 1 !important; height: 26px !important; z-index: 5 !important;
            }
            #cf-search-input:focus { border-color: #888 !important; outline: none !important; background: #111 !important; }

            /* 表头 */
            .cf-table-header {
                display: flex !important; gap: 5px !important; padding: 0 16px 5px 5px !important; font-size: 12px !important;
                color: #ccc !important; border-bottom: 1px solid #555 !important; margin-bottom: 0 !important; flex-shrink: 0 !important; align-items: flex-end !important;
            }
            .cf-rules-container {
                flex: 1 !important; margin-bottom: 10px !important; border: 1px solid #555 !important; border-top: none !important;
                background: #2a2a2a !important; overflow-y: scroll !important;
            }
            .cf-rules-container::-webkit-scrollbar { width: 10px !important; }
            .cf-rules-container::-webkit-scrollbar-track { background: #222 !important; border-left: 1px solid #444 !important; }
            .cf-rules-container::-webkit-scrollbar-thumb { background: #555 !important; }
            .cf-rules-container::-webkit-scrollbar-thumb:hover { background: #777 !important; }

            .cf-rule-row {
                display: flex !important; gap: 5px !important; align-items: center !important; background: #333 !important;
                padding: 4px 5px !important; border-bottom: 1px solid #444 !important; border-radius: 0 !important; margin: 0 !important;
            }
            .cf-rule-row:nth-child(even) { background: #2e2e2e !important; }
            .cf-rule-row:hover { background: #3a3a3a !important; }
            .cf-rule-row.disabled { opacity: 0.5 !important; }
            .cf-input-group { display: flex !important; flex-direction: column !important; flex: 1 !important; margin: 0 !important; padding: 0 !important; }
            .cf-input-wrapper { display: flex !important; height: 26px !important; width: 100% !important; }
            .cf-input {
                padding: 2px 5px !important; border: 1px solid #555 !important; background: #222 !important; flex: 1 !important;
                border-radius: 0 !important; height: 100% !important; width: 100% !important; font-size: 13px !important;
                margin: 0 !important; box-shadow: none !important; border-right: none !important;
            }
            .cf-input:focus { border-color: #888 !important; outline: none !important; background: #111 !important; }

            .rule-match { color: rgb(77, 171, 247) !important; }
            .rule-find { color: rgb(246, 182, 78) !important; }
            .rule-replace { color: rgb(178, 139, 247) !important; }

            .cf-btn {
                padding: 0 !important; cursor: pointer !important; border: 1px solid #555 !important; background: #444 !important;
                color: #ccc !important; border-radius: 0 !important; height: 26px !important; min-width: 26px !important;
                display: flex !important; align-items: center !important; justify-content: center !important; font-size: 11px !important;
                margin: 0 !important; line-height: 1 !important;
            }
            .cf-btn:hover { background: #555 !important; color: #fff !important; }
            .cf-btn.active { background: rgb(118, 202, 83) !important; color: white !important; border-color: rgb(118, 202, 83) !important; }
            .cf-btn-unicode.active { background: rgb(156, 39, 176) !important; color: white !important; border-color: rgb(156, 39, 176) !important; }

            .cf-btn-toggle { margin-right: 0 !important; }
            .cf-btn-danger { background: #333 !important; color: #ff6b6b !important; border: 1px solid #555 !important; width: 26px !important; }
            .cf-btn-danger:hover { background: #d32f2f !important; color: white !important; border-color: #d32f2f !important; }
            .cf-btn-primary { background: #1976D2 !important; color: white !important; border: none !important; padding: 0 15px !important; width: auto !important; height: 30px !important; }
            .cf-btn-primary:hover { background: #1565C0 !important; }
            .cf-input-wrapper .cf-btn { border-left: 1px solid #555 !important; }

            .cf-footer { display: flex !important; justify-content: flex-end !important; gap: 0 !important; padding: 4px 0px !important; flex-shrink: 0 !important; }
            #cf-add-rule { background: #333 !important; color: #ccc !important; border: 1px solid #555 !important; flex-shrink: 0 !important; width: auto !important; flex: 1 !important; margin-bottom: 0 !important; height: 30px !important; border-right: none !important; }
            #cf-add-rule:hover { background: #3a3a3a !important; color: #fff !important; border-color: #777 !important; }
            #cf-save { width: 104px !important; height: 30px !important; padding: 0 !important; font-size: 12px !important; border-left: 1px solid #555 !important; white-space: nowrap !important; border: 1px solid #555 !important; }
        `);

        const modal = document.createElement('div');
        modal.id = 'cf-settings-modal';
        modal.innerHTML = `
            <div id="cf-settings-content">
                <div class="cf-header">
                    <div class="cf-header-title">剪贴板过滤器</div>
                    <div style="width: 26px !important;"></div>
                    <div style="flex: 1.2 !important; display: flex !important; gap: 0 !important;">
                        <input type="text" id="cf-search-input" placeholder="搜索..." title="输入关键词\n* 筛选适用于所有网站的规则">
                        <div style="width: 27px !important;"></div>
                    </div>
                    <div style="flex: 2 !important;"></div>
                    <div style="width: 26px !important;"></div>
                    <div style="width: 26px !important;"></div>
                    <button id="cf-close">&times;</button>
                </div>

                <div class="cf-table-header">
                    <div style="width: 26px !important;"></div>
                    <div style="flex: 1.2 !important;">生效网站</div>
                    <div style="flex: 1 !important;">查找</div>
                    <div style="flex: 1 !important;">替换</div>
                    <div style="width: 26px !important;"></div>
                    <div style="width: 26px !important; display: flex !important; justify-content: center !important;">
                        <button id="cf-help" title="帮助">?</button>
                    </div>
                </div>

                <div class="cf-rules-container" id="cf-rules-list"></div>

                <div class="cf-footer">
                    <button id="cf-add-rule" class="cf-btn">+ 添加规则</button>
                    <button id="cf-save" class="cf-btn cf-btn-primary">保存</button>
                </div>

                <!-- 独立帮助窗口 -->
                <div id="cf-help-window">
                    <div class="cf-help-header">
                        <span class="cf-help-title">帮助</span>
                        <button id="cf-help-window-close">&times;</button>
                    </div>
                    <div id="cf-help-grid">
                        <div class="cf-help-col-header">变量</div>
                        <div class="cf-help-col-header">说明</div>

                        <div class="cf-help-key">{URL}</div>
                        <div class="cf-help-desc">URL解码</div>

                        <div class="cf-help-key">{HEX}</div>
                        <div class="cf-help-desc">十六进制解码</div>

                        <div class="cf-help-key">{ROT13}</div>
                        <div class="cf-help-desc">ROT13解码</div>

                        <div class="cf-help-key">{BASE64}</div>
                        <div class="cf-help-desc">BASE64解码</div>

                        <div class="cf-help-key">{REVERSE}</div>
                        <div class="cf-help-desc">字符串反转</div>

                        <div class="cf-help-key" style="color: #aaa !important; cursor: default !important; text-decoration: none !important;">替换留空</div>
                        <div class="cf-help-desc">删除查找的字符</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 事件隔离
        const settingsContent = modal.querySelector('#cf-settings-content');
        const helpWindow = modal.querySelector('#cf-help-window');
        const stopPropagation = (e) => e.stopPropagation();
        [settingsContent, helpWindow].forEach(el => {
            if (!el) return;
            ['click', 'mousedown', 'mouseup', 'dblclick', 'keydown', 'keyup', 'keypress', 'contextmenu', 'focus', 'focusin', 'wheel'].forEach(evtName => {
                el.addEventListener(evtName, stopPropagation, false);
            });
        });

        const rulesList = modal.querySelector('#cf-rules-list');
        const searchInput = modal.querySelector('#cf-search-input');
        let currentRules = getRules();

        function renderRules() {
            rulesList.innerHTML = '';
            const filterText = searchInput.value.toLowerCase().trim();

            if (currentRules.length === 0) {
                rulesList.innerHTML = '<div style="text-align:center !important;color:#777 !important;padding:20px !important;">无规则</div>';
                return;
            }

            currentRules.forEach((rule, index) => {
                // 搜索逻辑
                if (filterText) {
                    if (filterText === '*') {
                        if (rule.match && rule.match.trim() !== "") return;
                    } else {
                        const matchText = (rule.match || '').toLowerCase();
                        const findText = (rule.find || '').toLowerCase();
                        const replaceText = (rule.replace || '').toLowerCase();
                        if (!matchText.includes(filterText) && !findText.includes(filterText) && !replaceText.includes(filterText)) {
                            return;
                        }
                    }
                }

                // 默认值初始化
                if (rule.enabled === undefined) rule.enabled = true;
                if (rule.useRegexMatch === undefined) rule.useRegexMatch = false;
                if (rule.useRegexFind === undefined) rule.useRegexFind = false;
                if (rule.useRegexReplace === undefined) rule.useRegexReplace = false;
                if (rule.useUnicode === undefined) rule.useUnicode = false;

                const row = document.createElement('div');
                row.className = `cf-rule-row ${rule.enabled ? '' : 'disabled'}`;

                row.innerHTML = `
                    <button class="cf-btn cf-btn-toggle ${rule.enabled ? 'active' : ''}" title="启用/禁用">✔</button>

                    <div class="cf-input-group" style="flex: 1.2 !important;">
                        <div class="cf-input-wrapper">
                            <input type="text" class="cf-input rule-match" value="${escapeHtml(rule.match)}" placeholder="所有网站" title="${escapeHtml(rule.match)}">
                            <button class="cf-btn rule-regex-match ${rule.useRegexMatch ? 'active' : ''}" title="正则匹配">.*</button>
                        </div>
                    </div>
                    <div class="cf-input-group">
                        <div class="cf-input-wrapper">
                            <input type="text" class="cf-input rule-find" value="${escapeHtml(rule.find)}" title="${escapeHtml(rule.find)}">
                            <button class="cf-btn rule-regex-find ${rule.useRegexFind ? 'active' : ''}" title="正则查找">.*</button>
                        </div>
                    </div>
                    <div class="cf-input-group">
                        <div class="cf-input-wrapper">
                            <input type="text" class="cf-input rule-replace" value="${escapeHtml(rule.replace)}" title="${escapeHtml(rule.replace)}">
                            <button class="cf-btn rule-regex-replace ${rule.useRegexReplace ? 'active' : ''}" title="正则替换">.*</button>
                        </div>
                    </div>

                    <button class="cf-btn cf-btn-unicode ${rule.useUnicode ? 'active' : ''}" title="启用 Unicode 模式">U</button>

                    <button class="cf-btn cf-btn-danger rule-delete" title="删除规则">X</button>
                `;

                // 绑定事件
                const inputs = row.querySelectorAll('input');
                inputs[0].oninput = (e) => { currentRules[index].match = e.target.value; e.target.title = e.target.value; };
                inputs[1].oninput = (e) => { currentRules[index].find = e.target.value; e.target.title = e.target.value; };
                inputs[2].oninput = (e) => { currentRules[index].replace = e.target.value; e.target.title = e.target.value; };

                row.querySelector('.cf-btn-toggle').onclick = () => { currentRules[index].enabled = !currentRules[index].enabled; renderRules(); };
                row.querySelector('.rule-regex-match').onclick = () => { currentRules[index].useRegexMatch = !currentRules[index].useRegexMatch; renderRules(); };
                row.querySelector('.rule-regex-find').onclick = () => { currentRules[index].useRegexFind = !currentRules[index].useRegexFind; renderRules(); };
                row.querySelector('.rule-regex-replace').onclick = () => { currentRules[index].useRegexReplace = !currentRules[index].useRegexReplace; renderRules(); };
                row.querySelector('.cf-btn-unicode').onclick = () => { currentRules[index].useUnicode = !currentRules[index].useUnicode; renderRules(); };
                row.querySelector('.rule-delete').onclick = () => { currentRules.splice(index, 1); renderRules(); };

                rulesList.appendChild(row);
            });
        }

        searchInput.oninput = renderRules;
        renderRules();

        document.getElementById('cf-add-rule').onclick = () => {
            searchInput.value = '';
            currentRules.push({
                match: '', find: '', replace: '',
                enabled: true,
                useRegexMatch: false, useRegexFind: false, useRegexReplace: false,
                useUnicode: false
            });
            renderRules();
            setTimeout(() => rulesList.scrollTop = rulesList.scrollHeight, 0);
        };

        document.getElementById('cf-save').onclick = () => {
            const validRules = currentRules.filter(r => r.find && r.find.trim() !== '');
            saveRules(validRules);
            modal.remove();
        };

        document.getElementById('cf-close').onclick = () => modal.remove();

        // 帮助窗口逻辑
        const helpBtn = document.getElementById('cf-help');
        const helpWindowEl = document.getElementById('cf-help-window');
        const helpCloseBtn = document.getElementById('cf-help-window-close');

        helpBtn.onclick = () => helpWindowEl.style.setProperty('display', 'flex', 'important');
        helpCloseBtn.onclick = () => helpWindowEl.style.setProperty('display', 'none', 'important');

        const helpKeys = modal.querySelectorAll('.cf-help-key');
        helpKeys.forEach(key => {
            key.onclick = () => {
                const textToCopy = key.innerText;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = key.innerText;
                    key.style.setProperty('color', '#4CAF50', 'important');
                    key.innerText = '已复制';
                    setTimeout(() => {
                        key.style.setProperty('color', 'rgb(178, 139, 247)', 'important');
                        key.innerText = originalText;
                    }, 500);
                }).catch(err => {});
            };
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
})();