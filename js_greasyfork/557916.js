// ==UserScript==
// @name         超链接过滤器
// @description  鼠标悬停时自动过滤链接
// @namespace    http://tampermonkey.net/
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @version      2.1
// @author       wOxxOm & Gemini
// @license      GPLv3
// @icon      data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/557916/%E8%B6%85%E9%93%BE%E6%8E%A5%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557916/%E8%B6%85%E9%93%BE%E6%8E%A5%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

'use strict';

const ICON_BASE64 = 'data:image/png;base64,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';

const POPUP = document.createElement('a');
POPUP.id = GM_info.script.name;
POPUP.title = '原始链接';
let isPopupStyled;
let lastLink;
let hoverTimer;
let hoverStopTimer;

// --- Custom Rules Logic Start ---

// 初始化时加载规则
let cachedRules = [];
const urlCache = new Map();

loadRules();

// 注册菜单
GM_registerMenuCommand("设置面板", openSettings);

function getRules() {
    return GM_getValue('custom_rules', []);
}

// 加载并预编译规则 (优化性能的关键)
function loadRules() {
    const rawRules = getRules();
    cachedRules = rawRules.map(rule => {
        if (rule.enabled === undefined) rule.enabled = true;
        // 新增：默认关闭 Unicode 模式
        if (rule.useUnicode === undefined) rule.useUnicode = false;

        // 确定正则标志：如果有 Unicode 模式 添加 'u'
        const baseFlags = rule.useUnicode ? 'u' : '';

        // 预编译匹配正则
        let matchRegex = null;
        if (rule.useRegexMatch && rule.match) {
            try {
                // 注意：match 通常不需要全局 'g' 但需要支持 'u'
                matchRegex = new RegExp(rule.match, baseFlags);
            } catch(e) {
                console.warn('Invalid Match Regex:', e);
            }
        }

        // 预编译查找正则
        let findRegex = null;
        if (rule.find) {
            try {
                if (rule.useRegexFind) {
                    // 查找通常需要全局 'g'
                    findRegex = new RegExp(rule.find, 'g' + baseFlags);
                } else {
                    const escapedFind = rule.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    findRegex = new RegExp(escapedFind, 'g' + baseFlags);
                }
            } catch(e) {
                console.warn('Invalid Find Regex:', e);
            }
        }
        return { ...rule, _matchRegex: matchRegex, _findRegex: findRegex };
    });
}

function saveRules(rules) {
    GM_setValue('custom_rules', rules);
    loadRules();
    urlCache.clear();
}

// 应用自定义规则
function applyCustomRules(a) {
    const originalUrl = a.href;

    // 1. 查缓存
    if (urlCache.has(originalUrl)) {
        const cachedResult = urlCache.get(originalUrl);
        if (cachedResult === null) return false;

        if (cachedResult.url !== originalUrl) {
            a.href = cachedResult.url;
            a.rel = 'external noreferrer nofollow noopener';
            if (cachedResult.replaced) {
                a.hrefUndecloaked = originalUrl;
            }
        }
        return true;
    }

    const hostname = a.hostname || "";

    // 2. 筛选阶段
    const applicableRules = [];
    for (const rule of cachedRules) {
        if (rule.enabled === false) continue;

        let isMatch = false;
        if (rule.useRegexMatch) {
            if (rule._matchRegex) isMatch = rule._matchRegex.test(originalUrl);
        } else {
            if (rule.match && hostname.includes(rule.match)) isMatch = true;
        }

        if (isMatch) {
            applicableRules.push(rule);
        }
    }

    if (applicableRules.length === 0) {
        urlCache.set(originalUrl, null);
        return false;
    }

    // 3. 执行阶段
    let currentUrl = originalUrl;
    let hasRuleReplacement = false;

    for (const rule of applicableRules) {
        try {
            let tempUrl = currentUrl;
            let urlBeforeRule = tempUrl;

            if (rule._findRegex) {
                let replaceText = rule.replace || "";
                const upperReplace = replaceText.toUpperCase();

                // 通用处理函数
                const processMatch = (processor) => {
                    return (...args) => {
                        const match = args[0];
                        const captures = args.slice(1, -2);
                        const target = (captures.length > 0 && captures[0] !== undefined)
                                       ? captures[0]
                                       : match;
                        try {
                            return processor(target);
                        } catch (e) {
                            // 解码失败时返回原字符串 避免破坏链接
                            return match;
                        }
                    };
                };

                // --- 变量处理逻辑 ---
                if (upperReplace === '{BASE64}') {
                    tempUrl = tempUrl.replace(rule._findRegex, processMatch((target) => {
                        // 1. 清理非 Base64 字符 (容错) 并处理 URL 安全字符
                        let base64 = target.replace(/[^A-Za-z0-9+/=_-]/g, '')
                                           .replace(/-/g, '+')
                                           .replace(/_/g, '/');
                        // 2. 补全 Padding
                        while (base64.length % 4) base64 += '=';
                        // 3. 解码为二进制字符串
                        const binary = atob(base64);
                        // 4. 转换为字节数组并用 UTF-8 解码
                        const bytes = new Uint8Array(binary.length);
                        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                        return new TextDecoder('utf-8').decode(bytes);
                    }));
                } else if (upperReplace === '{URL}') {
                    tempUrl = tempUrl.replace(rule._findRegex, processMatch((target) => {
                        return decodeURIComponent(target);
                    }));
                } else if (upperReplace === '{HEX}') {
                    // --- 修复：支持 UTF-8 的 Hex 解码 ---
                    tempUrl = tempUrl.replace(rule._findRegex, processMatch((target) => {
                        // 1. 清理非 Hex 字符 (如空格)
                        const hex = target.replace(/[^0-9a-fA-F]/g, '');
                        if (hex.length % 2 !== 0) return target; // 长度不对则不处理

                        // 2. 转换为字节数组
                        const bytes = new Uint8Array(hex.length / 2);
                        for (let i = 0; i < hex.length; i += 2) {
                            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
                        }
                        // 3. UTF-8 解码
                        return new TextDecoder('utf-8').decode(bytes);
                    }));
                } else if (upperReplace === '{REVERSE}') {
                    // --- 修复：支持 Emoji 和代理对的反转 ---
                    tempUrl = tempUrl.replace(rule._findRegex, processMatch((target) => {
                        return [...target].reverse().join('');
                    }));
                } else if (upperReplace === '{ROT13}') {
                    tempUrl = tempUrl.replace(rule._findRegex, processMatch((target) => {
                        // ROT13 仅针对 ASCII 字母 无需 UTF-8 处理
                        return target.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
                    }));
                } else {
                    // 默认替换
                    if (!rule.useRegexReplace) replaceText = replaceText.replace(/\$/g, '$$$$');
                    tempUrl = tempUrl.replace(rule._findRegex, replaceText);
                }

                if (tempUrl !== urlBeforeRule) {
                    hasRuleReplacement = true;
                }
            }

            try { tempUrl = decodeURIComponent(tempUrl); } catch (e) {}

            if (tempUrl !== currentUrl) {
                currentUrl = tempUrl;
            }
        } catch (e) {
        }
    }

    // 4. 结果处理
    urlCache.set(originalUrl, { url: currentUrl, replaced: hasRuleReplacement });

    if (currentUrl !== originalUrl) {
        a.href = currentUrl;
        a.rel = 'external noreferrer nofollow noopener';
        if (hasRuleReplacement) {
            a.hrefUndecloaked = originalUrl;
        }
    }

    return true;
}

// 设置界面 UI
function openSettings() {
    const existing = document.getElementById('decloak-settings-modal');
    if (existing) return;

    GM_addStyle(`
        #decloak-settings-modal {
            all: initial !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: transparent !important;
            z-index: 2147483647 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            font-family: sans-serif !important;
            font-size: 13px !important;
            color: #eee !important;
            pointer-events: none !important;
            line-height: normal !important;
            text-align: left !important;
        }
        #decloak-settings-modal * { box-sizing: border-box !important; }

        #decloak-settings-content {
            background: rgb(44, 44, 44) !important;
            padding: 15px !important;
            border: 1px solid rgb(80, 80, 80) !important;
            width: 900px !important;
            max-width: 98% !important;
            max-height: 90% !important;
            display: flex !important;
            flex-direction: column !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
            pointer-events: auto !important;
            border-radius: 0 !important;
        }

        /* 头部布局 */
        .decloak-header {
            display: flex !important;
            gap: 5px !important;
            align-items: center !important;
            position: relative !important;
            margin-bottom: 5px !important;
            height: 30px !important;
            padding: 0 14px 0 6px !important;
            flex-shrink: 0 !important;
        }
        .decloak-header-title {
            position: absolute !important;
            left: 0 !important;
            width: 100% !important;
            text-align: center !important;
            font-size: 16px !important;
            color: #fff !important;
            pointer-events: none !important;
            z-index: 0 !important;
        }
        #decloak-close {
            position: absolute !important;
            right: 0 !important;
            z-index: 10 !important;
            border: none !important;
            background: none !important;
            cursor: pointer !important;
            font-size: 20px !important;
            line-height: 1 !important;
            color: #ccc !important;
            padding: 0 !important;
        }

        /* 帮助按钮 */
        #decloak-help {
            width: 26px !important;
            height: 20px !important;
            border: none !important;
            background: none !important;
            cursor: pointer !important;
            font-size: 15px !important;
            font-weight: bold !important;
            line-height: 1 !important;
            color: #999 !important;
            padding: 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }
        #decloak-help:hover { color: #fff !important; }

        /* 帮助窗口 */
        #decloak-help-window {
            display: none !important;
            position: fixed !important;
            top: 50% !important; left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 320px !important;
            background: rgb(55, 55, 55) !important;
            border: 1px solid rgb(100, 100, 100) !important;
            box-shadow: 0 15px 40px rgba(0,0,0,0.8) !important;
            z-index: 2147483647 !important;
            flex-direction: column !important;
            padding: 15px !important;
            pointer-events: auto !important;
        }
        .decloak-help-header {
            display: flex !important; justify-content: space-between !important; align-items: center !important;
            margin-bottom: 15px !important;
        }
        .decloak-help-title { color: #fff !important; font-size: 14px !important; }
        #decloak-help-window-close {
            border: none !important; background: none !important; cursor: pointer !important;
            font-size: 18px !important; line-height: 1 !important; color: #ccc !important; padding: 0 !important;
        }
        #decloak-help-window-close:hover { color: #fff !important; }
        #decloak-help-grid {
            display: grid !important;
            grid-template-columns: 100px 1fr !important;
            gap: 8px 15px !important;
            align-items: center !important;
        }
        .decloak-help-col-header {
            color: #999 !important;
            font-size: 12px !important;
            border-bottom: 1px solid #666 !important;
            padding-bottom: 8px !important;
            margin-bottom: 5px !important;
        }
        .decloak-help-key {
            color: rgb(178, 139, 247) !important;
            user-select: none !important;
            cursor: pointer !important;
            transition: color 0.2s !important;
            font-size: 13px !important;
        }
        .decloak-help-key:active { transform: scale(0.98) !important; }
        .decloak-help-desc {
            color: #ccc !important;
            user-select: text !important;
            font-size: 13px !important;
            line-height: 1.4 !important;
        }

        /* 搜索框 */
        #decloak-search-input {
            background: #222 !important;
            border: 1px solid #555 !important;
            color: #eee !important;
            padding: 2px 5px !important;
            font-size: 13px !important;
            border-radius: 0 !important;
            margin: 0 !important;
            flex: 1 !important;
            height: 26px !important;
            z-index: 5 !important;
        }
        #decloak-search-input:focus {
            border-color: #888 !important;
            outline: none !important;
            background: #111 !important;
        }

        /* 表头样式 */
        .decloak-table-header {
            display: flex !important; gap: 5px !important;
            padding: 0 16px 5px 5px !important;
            font-size: 12px !important; color: #ccc !important;
            border-bottom: 1px solid #555 !important; margin-bottom: 0 !important;
            flex-shrink: 0 !important;
            align-items: flex-end !important;
        }

        .decloak-rules-container {
            flex: 1 !important;
            overflow-y: scroll !important;
            margin-bottom: 10px !important;
            border: 1px solid #555 !important;
            border-top: none !important;
            background: #2a2a2a !important;
        }

        /* 行样式 */
        .decloak-rule-row {
            display: flex !important;
            gap: 5px !important;
            align-items: center !important;
            background: #333 !important;
            padding: 4px 5px !important;
            border-bottom: 1px solid #444 !important;
            border-radius: 0 !important;
            margin: 0 !important;
        }
        .decloak-rule-row:nth-child(even) { background: #2e2e2e !important; }
        .decloak-rule-row:hover { background: #3a3a3a !important; }
        .decloak-rule-row.disabled { opacity: 0.5 !important; }
        .decloak-rule-row.disabled input { color: #999 !important; }

        .decloak-input-group {
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        .decloak-input-wrapper {
            display: flex !important;
            height: 26px !important;
            width: 100% !important;
        }
        .decloak-input {
            padding: 2px 5px !important;
            border: 1px solid #555 !important;
            background: #222 !important;
            flex: 1 !important;
            border-radius: 0 !important;
            height: 100% !important;
            width: 100% !important;
            font-size: 13px !important;
            font-family: sans-serif !important;
            margin: 0 !important;
            box-shadow: none !important;
        }
        .decloak-input:focus {
            border-color: #888 !important;
            outline: none !important;
            background: #111 !important;
        }

        .rule-match { color: rgb(77, 171, 247) !important; }
        .rule-find { color: rgb(246, 182, 78) !important; }
        .rule-replace { color: rgb(178, 139, 247) !important; }

        /* 按钮通用 */
        .decloak-btn {
            padding: 0 !important;
            cursor: pointer !important;
            border: 1px solid #555 !important;
            background: #444 !important;
            color: #ccc !important;
            border-radius: 0 !important;
            height: 26px !important;
            min-width: 26px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 11px !important;
            margin: 0 !important;
            line-height: 1 !important;
        }
        .decloak-btn:hover { background: #555 !important; color: #fff !important; }

        .decloak-btn.active {
            background: rgb(118, 202, 83) !important;
            color: white !important;
            border-color: rgb(118, 202, 83) !important;
        }

        /* Unicode 按钮激活 (紫色) */
        .decloak-btn-unicode.active {
            background: rgb(156, 39, 176) !important;
            color: white !important;
            border-color: rgb(156, 39, 176) !important;
        }

        .decloak-btn-toggle { margin-right: 0 !important; }

        .decloak-btn-danger {
            background: #333 !important;
            color: #ff6b6b !important;
            border: 1px solid #555 !important;
            width: 26px !important;
        }
        .decloak-btn-danger:hover {
            background: #d32f2f !important;
            color: white !important;
            border-color: #d32f2f !important;
        }
        .decloak-btn-primary {
            background: #1976D2 !important;
            color: white !important;
            border: none !important;
            padding: 0 15px !important;
            width: auto !important;
            height: 30px !important;
        }
        .decloak-btn-primary:hover { background: #1565C0 !important; }

        #decloak-add-rule {
            background: #333 !important;
            color: #ccc !important;
            border: 1px solid #555 !important;
            flex-shrink: 0 !important;
            width: auto !important;
            flex: 1 !important;
            margin-bottom: 0 !important;
            height: 30px !important;
            border-right: none !important;
        }
        #decloak-add-rule:hover {
            background: #3a3a3a !important;
            color: #fff !important;
            border-color: #777 !important;
        }

        .decloak-footer {
            display: flex !important;
            justify-content: flex-end !important;
            gap: 0 !important;
            padding: 4px 0px !important;
            flex-shrink: 0 !important;
        }
        #decloak-save {
            width: 104px !important;
            height: 30px !important;
            padding: 0 !important;
            font-size: 12px !important;
            border-left: 1px solid #555 !important;
            white-space: nowrap !important;
            border: 1px solid #555 !important;
        }

        .decloak-input-wrapper .decloak-input { border-right: none !important; }
        .decloak-input-wrapper .decloak-btn { border-left: 1px solid #555 !important; }

        .decloak-rules-container::-webkit-scrollbar { width: 10px !important; }
        .decloak-rules-container::-webkit-scrollbar-track { background: #222 !important; border-left: 1px solid #444 !important; }
        .decloak-rules-container::-webkit-scrollbar-thumb { background: #555 !important; }
        .decloak-rules-container::-webkit-scrollbar-thumb:hover { background: #777 !important; }
    `);

    const modal = document.createElement('div');
    modal.id = 'decloak-settings-modal';
    modal.innerHTML = `
        <div id="decloak-settings-content">
            <div class="decloak-header">
                <div class="decloak-header-title">链接过滤规则</div>
                <div style="width: 26px !important;"></div>
                <div style="flex: 1.2 !important; display: flex !important; gap: 0 !important;">
                    <input type="text" id="decloak-search-input" placeholder="搜索..." title="输入关键词">
                    <div style="width: 27px !important;"></div>
                </div>
                <div style="flex: 2 !important;"></div>
                <div style="width: 26px !important;"></div>
                <div style="width: 26px !important;"></div>
                <button id="decloak-close">&times;</button>
            </div>

            <div class="decloak-table-header">
                <div style="width: 26px !important;"></div>
                <div style="flex: 1.2 !important;">链接匹配</div>
                <div style="flex: 1 !important;">查找</div>
                <div style="flex: 1 !important;">替换</div>
                <!-- 占位符：对应下方的 Unicode 按钮 -->
                <div style="width: 26px !important;"></div>
                <!-- 帮助按钮：对应下方的删除按钮 -->
                <div style="width: 26px !important; display: flex !important; justify-content: center !important;">
                    <button id="decloak-help" title="帮助">?</button>
                </div>
            </div>

            <div class="decloak-rules-container" id="decloak-rules-list"></div>

            <div class="decloak-footer">
                <button id="decloak-add-rule" class="decloak-btn">+ 添加规则</button>
                <button id="decloak-save" class="decloak-btn decloak-btn-primary">保存</button>
            </div>
        </div>

        <div id="decloak-help-window">
            <div class="decloak-help-header">
                <span class="decloak-help-title">帮助</span>
                <button id="decloak-help-window-close">&times;</button>
            </div>
            <div id="decloak-help-grid">
                <div class="decloak-help-col-header">变量</div>
                <div class="decloak-help-col-header">说明</div>
                <div class="decloak-help-key">{URL}</div>
                <div class="decloak-help-desc">URL解码</div>
                <div class="decloak-help-key">{HEX}</div>
                <div class="decloak-help-desc">十六进制解码</div>
                <div class="decloak-help-key">{ROT13}</div>
                <div class="decloak-help-desc">ROT13解码</div>
                <div class="decloak-help-key">{BASE64}</div>
                <div class="decloak-help-desc">BASE64解码</div>
                <div class="decloak-help-key">{REVERSE}</div>
                <div class="decloak-help-desc">字符串反转</div>
                <div class="decloak-help-key" style="color: #aaa !important; cursor: default !important; text-decoration: none !important;">替换留空</div>
                <div class="decloak-help-desc">删除查找的字符</div>
                <div class="decloak-help-key" style="color: #aaa !important; cursor: default !important; text-decoration: none !important;">查找和替换留空</div>
                <div class="decloak-help-desc">不执行默认规则</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // --- 事件隔离逻辑 ---
    const settingsContent = modal.querySelector('#decloak-settings-content');
    const helpWindow = modal.querySelector('#decloak-help-window');
    const stopPropagation = (e) => e.stopPropagation();
    [settingsContent, helpWindow].forEach(el => {
        if (!el) return;
        ['click', 'mousedown', 'mouseup', 'dblclick', 'keydown', 'keyup', 'keypress', 'contextmenu', 'focus', 'focusin', 'wheel'].forEach(evtName => {
            el.addEventListener(evtName, stopPropagation, false);
        });
    });
    // ------------------

    const rulesList = modal.querySelector('#decloak-rules-list');
    const searchInput = modal.querySelector('#decloak-search-input');
    let currentRules = getRules();

    function renderRules() {
        rulesList.innerHTML = '';
        const filterText = searchInput.value.toLowerCase().trim();

        if (currentRules.length === 0) {
            rulesList.innerHTML = '<div style="text-align:center !important;color:#777 !important;padding:20px !important;">无规则</div>';
            return;
        }

        currentRules.forEach((rule, index) => {
            if (filterText && !rule.match.toLowerCase().includes(filterText)) {
                return;
            }

            const row = document.createElement('div');
            row.className = `decloak-rule-row ${rule.enabled === false ? 'disabled' : ''}`;

            if (rule.useRegexMatch === undefined) rule.useRegexMatch = false;
            if (rule.enabled === undefined) rule.enabled = true;
            if (rule.useUnicode === undefined) rule.useUnicode = false;

            row.innerHTML = `
                <button class="decloak-btn decloak-btn-toggle ${rule.enabled ? 'active' : ''}" title="启用/禁用">✔</button>

                <div class="decloak-input-group" style="flex: 1.2 !important;">
                    <div class="decloak-input-wrapper">
                        <input type="text" class="decloak-input rule-match" value="${escapeHtml(rule.match)}" title="${escapeHtml(rule.match)}">
                        <button class="decloak-btn rule-regex-match ${rule.useRegexMatch ? 'active' : ''}" title="正则匹配">.*</button>
                    </div>
                </div>
                <div class="decloak-input-group">
                    <div class="decloak-input-wrapper">
                        <input type="text" class="decloak-input rule-find" value="${escapeHtml(rule.find)}" title="${escapeHtml(rule.find)}">
                        <button class="decloak-btn rule-regex-find ${rule.useRegexFind ? 'active' : ''}" title="正则查找">.*</button>
                    </div>
                </div>
                <div class="decloak-input-group">
                    <div class="decloak-input-wrapper">
                        <input type="text" class="decloak-input rule-replace" value="${escapeHtml(rule.replace)}" title="${escapeHtml(rule.replace)}">
                        <button class="decloak-btn rule-regex-replace ${rule.useRegexReplace ? 'active' : ''}" title="正则替换">.*</button>
                    </div>
                </div>

                <button class="decloak-btn decloak-btn-unicode ${rule.useUnicode ? 'active' : ''}" title="启用 Unicode 模式">U</button>

                <button class="decloak-btn decloak-btn-danger rule-delete" title="删除规则">X</button>
            `;

            row.querySelector('.rule-match').oninput = (e) => {
                currentRules[index].match = e.target.value;
                e.target.title = e.target.value;
            };
            row.querySelector('.rule-find').oninput = (e) => {
                currentRules[index].find = e.target.value;
                e.target.title = e.target.value;
            };
            row.querySelector('.rule-replace').oninput = (e) => {
                currentRules[index].replace = e.target.value;
                e.target.title = e.target.value;
            };

            const btnToggle = row.querySelector('.decloak-btn-toggle');
            btnToggle.onclick = () => {
                currentRules[index].enabled = !currentRules[index].enabled;
                renderRules();
            };

            const btnMatchRegex = row.querySelector('.rule-regex-match');
            btnMatchRegex.onclick = () => {
                currentRules[index].useRegexMatch = !currentRules[index].useRegexMatch;
                renderRules();
            };

            const btnFindRegex = row.querySelector('.rule-regex-find');
            btnFindRegex.onclick = () => {
                currentRules[index].useRegexFind = !currentRules[index].useRegexFind;
                renderRules();
            };

            const btnReplaceRegex = row.querySelector('.rule-regex-replace');
            btnReplaceRegex.onclick = () => {
                currentRules[index].useRegexReplace = !currentRules[index].useRegexReplace;
                renderRules();
            };

            const btnUnicode = row.querySelector('.decloak-btn-unicode');
            btnUnicode.onclick = () => {
                currentRules[index].useUnicode = !currentRules[index].useUnicode;
                renderRules();
            };

            row.querySelector('.rule-delete').onclick = () => {
                currentRules.splice(index, 1);
                renderRules();
            };

            rulesList.appendChild(row);
        });
    }

    searchInput.oninput = () => {
        renderRules();
    };

    renderRules();

    document.getElementById('decloak-add-rule').onclick = () => {
        searchInput.value = '';
        currentRules.push({
            match: '', find: '', replace: '',
            useRegexMatch: false, useRegexFind: false, useRegexReplace: false,
            useUnicode: false,
            enabled: true
        });
        renderRules();
        setTimeout(() => rulesList.scrollTop = rulesList.scrollHeight, 0);
    };

    document.getElementById('decloak-save').onclick = () => {
        const validRules = currentRules.filter(r => r.match.trim() !== '');
        saveRules(validRules);
        modal.remove();
    };

    document.getElementById('decloak-close').onclick = () => modal.remove();

    const helpBtn = document.getElementById('decloak-help');
    const helpWindowEl = document.getElementById('decloak-help-window');
    const helpCloseBtn = document.getElementById('decloak-help-window-close');

    helpBtn.onclick = () => {
        helpWindowEl.style.setProperty('display', 'flex', 'important');
    };

    helpCloseBtn.onclick = () => {
        helpWindowEl.style.setProperty('display', 'none', 'important');
    };

    const helpKeys = modal.querySelectorAll('.decloak-help-key');
    helpKeys.forEach(key => {
        key.onclick = () => {
            const textToCopy = key.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalColor = key.style.color;
                const originalText = key.innerText;
                key.style.setProperty('color', '#4CAF50', 'important');
                key.innerText = '已复制';
                setTimeout(() => {
                    key.style.setProperty('color', 'rgb(178, 139, 247)', 'important');
                    key.innerText = originalText;
                }, 500);
            }).catch(err => {
            });
        };
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// --- Custom Rules Logic End ---

addEventListener('keypress', e => e.which === 13 && decloakLink(e), true);
addEventListener('mousedown', decloakLink, true);
addEventListener('mouseover', onHover, true);

function onHover(event) {
  const a = decloakLink(event);
  if (!a) return;
  if (lastLink)
    lastLink.removeEventListener('mouseout', cancelHover);
  lastLink = a;
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(showPopup, 0, a);
  a.addEventListener('mouseout', cancelHover);
}

function cancelHover(e) {
  this.removeEventListener('mouseout', cancelHover);
  clearTimeout(hoverStopTimer);
  hoverStopTimer = setTimeout(hidePopup, 0, this);
}

function showPopup(a) {
  if (!a.matches(':hover'))
    return;

  if (!a.hrefUndecloaked)
    return;

  if (!isPopupStyled) {
    isPopupStyled = true;
    POPUP.style.cssText = //'all: unset;' +
      'width: 18px;' +
      'height: 18px;' +
      'background: url("' + ICON_BASE64 + '") center no-repeat, white;' +
      'background-size: 16px;' +
      'border: 1px solid #888;' +
      'border-radius: 11px;' +
      'z-index: 2147483647;' +
      'margin-left: 0;' +
      'cursor: pointer;' +
      'position: absolute;'
        .replace(/;/g, '!important;');
  }
  const linkStyle = getComputedStyle(a);
  POPUP.href = a.hrefUndecloaked;
  POPUP.style.marginLeft = -(
    (parseFloat(linkStyle.paddingRight) || 0) +
    (parseFloat(linkStyle.marginRight) || 0) +
    (parseFloat(linkStyle.borderRightWidth) || 0) +
    Math.max(0, a.getBoundingClientRect().right + 32 - innerWidth)
  ) + 'px';
  a.parentElement.insertBefore(POPUP, a.nextSibling);
  POPUP.addEventListener('click', openOriginal);
}

function hidePopup(a) {
  if (POPUP.matches(':hover') || lastLink && lastLink.matches(':hover')) {
    cancelHover.call(a);
  } else {
    lastLink = null;
    POPUP.remove();
  }
}

function openOriginal(e) {
  this.href = '';
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  setTimeout(() => {
    lastLink.href = lastLink.hrefUndecloaked;
    lastLink.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
}

function decloakLink(event) {
  const a = getClosestLink(event);

  // 修改 1: 这里删除了 !/^https?:$/.test(a.protocol) 的检查
  // 允许所有类型的链接进入后续判断
  if (!a || a === POPUP)
    return;

  if (a.hrefUndecloaked)
    return a;

  // --- Check Custom Rules First (支持所有协议) ---
  // 自定义规则匹配成功后会返回 true 直接结束函数
  if (applyCustomRules(a)) {
      return a;
  }
  // ----------------------------------------

  // 修改 2: 默认规则的协议检查移动到这里
  // 如果自定义规则没匹配 且不是 HTTP/HTTPS 协议 则停止执行默认规则
  if (!/^https?:$/.test(a.protocol))
    return;

  // --- 以下是默认规则逻辑 (仅处理 HTTP/HTTPS) ---

  if (/\bthis\.href\s*=[^=]/.test(a.getAttribute('onmousedown')))
    a.onmousedown = null;
  if (/\bthis\.href\s*=[^=]/.test(a.getAttribute('onclick')))
    a.onclick = null;

  const href = a.href.baseVal || a.href;
  const m = href.match(/([?&][-\w]*referrer[-\w]*(?==))?[=?/]((ftps?|https?)((:|%3[Aa])\/\/[^+&]+|%3[Aa]%2[Ff]%2[Ff][^+&/]+))/);
  if (!m ||
      m[1] ||
      a.hostname === 'disqus.com' && a.pathname.startsWith('/embed/comments/')) {
    return;
  }

  let realUrl = decodeURIComponent(m[2]);
  if (a.hostname === 'disq.us' &&
      realUrl.lastIndexOf(':') !== realUrl.indexOf(':')) {
    realUrl = realUrl.substr(0, realUrl.lastIndexOf(':'));
  }

  if (new URL(realUrl).hostname === a.hostname ||
      href.match(/[?&=/]\w*([Ss]ign|[Ll]og)[io]n/)) {
    return;
  }

  a.hrefUndecloaked = href;
  a.setAttribute('href', realUrl);
  a.rel = 'external noreferrer nofollow noopener';
  return a;
}

function getClosestLink(event) {
  return event.composedPath
    ? event.composedPath().find(el => el.tagName === 'A')
    : event.target.closest('a');
}