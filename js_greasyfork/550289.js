// ==UserScript==
// @name         指定输入框自动补全
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  实时记录指定文本框输入内容，点击指定按钮保存，下次输入时可自动匹配补全，支持右键补全及上下键切换匹配内容;匹配到内容时文本框内右上角会出现×号，点击可删除该匹配项;
// @author       damu
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550289/%E6%8C%87%E5%AE%9A%E8%BE%93%E5%85%A5%E6%A1%86%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550289/%E6%8C%87%E5%AE%9A%E8%BE%93%E5%85%A5%E6%A1%86%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8.meta.js
// ==/UserScript==

/* global $ */

(function () {
    'use strict';

    // -------------------------------
    // 常量定义：存储 key 和默认选择器
    // -------------------------------
    const CONTENT_SELECTOR_KEY = 'content_selector';
    const BUTTON_SELECTOR_KEY = 'button_selector';
    const RECORDED_CONTENT_KEY = 'recorded_content';
    const HISTORY_KEY = 'history_list';

    const DEFAULT_CONTENT_SELECTOR = 'body > div.v-transfer-dom > div.ivu-modal-wrap.ivu-modal-no-mask > div.ivu-modal > div.ivu-modal-content.ivu-modal-content-no-mask > div.ivu-modal-body > div.modal-content > form.ivu-form.ivu-form-label-top > div.ivu-form-item.ivu-form-item-required > div.ivu-form-item-content > div.customLayoutInput > div.customInput.horizontalLtr[contenteditable="false"]';
    const DEFAULT_BUTTON_SELECTOR = 'body > div.v-transfer-dom > div.ivu-modal-wrap.ivu-modal-no-mask > div.ivu-modal > div.ivu-modal-content.ivu-modal-content-no-mask > div.ivu-modal-footer > button.ivu-btn.ivu-btn-default[type="button"]';

    // -------------------------------
    // 全局变量
    // -------------------------------
    let contentSelector = GM_getValue(CONTENT_SELECTOR_KEY, DEFAULT_CONTENT_SELECTOR); // 当前输入框选择器
    let buttonSelector = GM_getValue(BUTTON_SELECTOR_KEY, DEFAULT_BUTTON_SELECTOR);   // 当前按钮选择器
    let recordedContent = GM_getValue(RECORDED_CONTENT_KEY, '');                        // 当前输入内容
    let historyList = GM_getValue(HISTORY_KEY, []);                                     // 历史记录列表

    let isSelectingContent = false; // 是否正在选择内容区域
    let isSelectingButton = false;  // 是否正在选择按钮
    let highlightElement = null;    // 鼠标悬停高亮元素
    let ghostEl = null;             // 自动补全提示元素
    let activeInput = null;         // 当前激活输入框
    let matches = [], matchIndex = -1; // 匹配内容数组及当前索引

    // -------------------------------
    // 注册菜单命令
    // -------------------------------
    GM_registerMenuCommand('点击选择内容区域', startContentSelection);
    GM_registerMenuCommand('点击选择按钮', startButtonSelection);
    GM_registerMenuCommand('显示当前配置', showCurrentConfig);
    GM_registerMenuCommand('刷新数据', refreshData);
    GM_registerMenuCommand('导入历史记录', importHistory);
    GM_registerMenuCommand('导出历史记录', exportHistory);
    GM_registerMenuCommand('清除记录的内容', clearRecordedContent);


    // -------------------------------
    // 内容区域选择功能
    // -------------------------------
    function startContentSelection() {
        if (isSelectingContent || isSelectingButton) return;
        isSelectingContent = true;
        notify('请点击页面上的内容区域来选择它');
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleContentSelection, true);
        setTimeout(cancelContentSelection, 10000); // 10秒超时取消选择
    }

    function handleMouseMove(e) {
        if (!isSelectingContent && !isSelectingButton) return;
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (highlightElement === element) return;
        if (highlightElement) highlightElement.style.outline = '';
        if (element) {
            element.style.outline = '2px solid red';
            highlightElement = element;
        }
    }

    function handleContentSelection(e) {
        e.preventDefault();
        e.stopPropagation();
        const selector = generateSelector(e.target);
        if (selector) {
            contentSelector = selector;
            GM_setValue(CONTENT_SELECTOR_KEY, contentSelector);
            removeContentEventListeners();
            setupContentEventListeners();
            notify('内容区域选择成功');
        }
        cancelContentSelection();
    }

    function cancelContentSelection() {
        if (!isSelectingContent) return;
        isSelectingContent = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', handleContentSelection, true);
        if (highlightElement) highlightElement.style.outline = '';
        highlightElement = null;
    }

    // -------------------------------
    // 按钮选择功能
    // -------------------------------
    function startButtonSelection() {
        if (isSelectingContent || isSelectingButton) return;
        isSelectingButton = true;
        notify('请点击页面上的按钮来选择它');
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('click', handleButtonSelection, true);
        setTimeout(cancelButtonSelection, 10000);
    }

    function handleButtonSelection(e) {
        e.preventDefault();
        e.stopPropagation();
        const selector = generateSelector(e.target);
        if (selector) {
            buttonSelector = selector;
            GM_setValue(BUTTON_SELECTOR_KEY, buttonSelector);
            removeButtonEventListeners();
            setupButtonEventListeners();
            notify('按钮选择成功');
        }
        cancelButtonSelection();
    }

    function cancelButtonSelection() {
        if (!isSelectingButton) return;
        isSelectingButton = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', handleButtonSelection, true);
        if (highlightElement) highlightElement.style.outline = '';
        highlightElement = null;
    }

    // -------------------------------
    // 输入框事件监听
    // -------------------------------
    function setupContentEventListeners() {
        // 输入事件：记录当前内容并显示提示（在新输入时重置为最新索引 0）
        $(document).on('input', contentSelector, function (e) {
            recordedContent = getElementContent(e.target);
            GM_setValue(RECORDED_CONTENT_KEY, recordedContent);
            activeInput = e.target;
            matchIndex = 0; // 关键：新输入时默认显示最新的一条
            showGhost(activeInput, recordedContent);
        });

        // 键盘事件：↑ 向更旧（index++），↓ 向更新（index--），不循环；→ 确认补全
        $(document).on('keydown', contentSelector, function (e) {
            if (!matches.length) return;

            const key = e.key;

            if (key === 'ArrowDown') {
                // 已经是最新（0）时不变；否则向更新方向移动（index--）
                if (matchIndex > 0) {
                    matchIndex = matchIndex - 1;
                    showGhost(this, this.value || this.innerText);
                }
                e.preventDefault();
            } else if (key === 'ArrowUp') {
                // 向更旧的记录走（index++），到头就停（不循环）
                if (matchIndex < matches.length - 1) {
                    matchIndex = matchIndex + 1;
                    showGhost(this, this.value || this.innerText);
                }
                e.preventDefault();
            } else if (key === 'ArrowRight' && matchIndex >= 0 && matches[matchIndex]) {
                applyMatch(this, matches[matchIndex]);
                e.preventDefault();
            }
        });

        // 失去焦点时隐藏提示
        $(document).on('blur', contentSelector, hideGhost);
    }

    function removeContentEventListeners() {
        $(document).off('input', contentSelector)
            .off('keydown', contentSelector)
            .off('blur', contentSelector);
    }

    // -------------------------------
    // 按钮点击事件监听
    // -------------------------------
    function setupButtonEventListeners() {
        $(document).on('click', buttonSelector, function () {
            console.log("文本框内容：", recordedContent);
            if (recordedContent && recordedContent.length >= 5) {
                const existingIndex = historyList.indexOf(recordedContent);
                if (existingIndex !== -1) {
                    // 已存在，把它移到数组末尾
                    historyList.splice(existingIndex, 1);
                    historyList.push(recordedContent);
                    console.log("已存在，移动到末尾=>", recordedContent);
                } else {
                    // 不存在，直接添加
                    historyList.push(recordedContent);
                    console.log("不存在，添加=>", recordedContent);
                }
                // 限制最大记录数为 1000
                if (historyList.length > 1000) {
                    historyList = historyList.slice(historyList.length - 1000);
                }
                GM_setValue(HISTORY_KEY, historyList);
            }
        });
    }

    function removeButtonEventListeners() {
        $(document).off('click', buttonSelector);
    }

    // -------------------------------
    // 生成元素选择器
    // 优先使用 id，如果没有 id，则使用 class，并沿父元素层级拼接
    // -------------------------------
    function generateSelector(element) {
        if (!element || !element.tagName) return null;

        // 如果有 ID，直接返回唯一选择器
        if (element.id) return `#${element.id}`;

        // 初始化数组存储每一层的选择器
        let path = [];

        let el = element;
        while (el && el.nodeType === 1 && el.tagName.toLowerCase() !== 'html') {
            let selector = el.tagName.toLowerCase();

            // 使用 class 名，如果有多个，只取前两个避免过长
            if (el.className && typeof el.className === 'string') {
                const classes = el.className.trim().split(/\s+/).slice(0, 2);
                if (classes.length > 0) {
                    selector += '.' + classes.join('.');
                }
            }

            // 如果有关键属性可以进一步增强选择器唯一性
            const attrs = ['name', 'type', 'data-id', 'role', 'contenteditable'];
            for (const attr of attrs) {
                if (el.hasAttribute(attr)) {
                    selector += `[${attr}="${el.getAttribute(attr)}"]`;
                }
            }

            path.unshift(selector); // 插入数组开头
            el = el.parentElement;
        }

        // 用 > 拼接每一层，形成完整路径
        return path.join(' > ');
    }


    // -------------------------------
    // 获取元素内容
    // -------------------------------
    function getElementContent(element) {
        const $el = $(element);
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') return $el.val() || '';
        if (element.hasAttribute('contenteditable')) return $el.text() || $el.html() || '';
        return $el.text() || $el.val() || $el.html() || '';
    }

    // -------------------------------
    // 通知
    // -------------------------------
    function notify(msg) {
        if (typeof GM_notification !== 'undefined') {
            GM_notification({ text: msg, timeout: 1500, title: '内容记录工具' });
        }
    }

    // -------------------------------
    // 显示当前配置
    // -------------------------------
    function showCurrentConfig() {
        alert('内容区域选择器：' + contentSelector +
            '\n按钮选择器：' + buttonSelector +
            '\n已保存条目数：' + historyList.length);
        console.log('内容区域选择器：' + contentSelector +
            '\n按钮选择器：' + buttonSelector +
            '\n已保存条目数：' + historyList.length);
    }


    // -------------------------------
    // 刷新记录
    // -------------------------------
    function refreshData() {
        historyList = GM_getValue(HISTORY_KEY, []);
        notify(`已刷新，当前记录数: ${historyList.length}`);
    }

    // -------------------------------
    // 导入历史记录
    // -------------------------------
    function importHistory() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const importedData = JSON.parse(event.target.result);

                    if (!Array.isArray(importedData)) {
                        notify('文件格式错误：必须是一个数组');
                        return;
                    }

                    // 验证每个条目都是字符串
                    const validData = importedData.filter(item =>
                        typeof item === 'string' && item.trim().length > 0
                    );

                    if (validData.length === 0) {
                        notify('文件中没有有效的文本数据');
                        return;
                    }

                    // 合并现有数据，去重
                    const currentHistory = GM_getValue(HISTORY_KEY, []);
                    const mergedHistory = [...currentHistory];

                    validData.forEach(item => {
                        if (!mergedHistory.includes(item)) {
                            mergedHistory.push(item);
                        }
                    });

                    // 限制总数
                    if (mergedHistory.length > 1000) {
                        mergedHistory = mergedHistory.slice(mergedHistory.length - 1000);
                    }

                    GM_setValue(HISTORY_KEY, mergedHistory);
                    historyList = mergedHistory;

                    notify(`成功导入 ${validData.length} 条记录，当前总数: ${mergedHistory.length}`);

                } catch (error) {
                    notify('导入失败：文件格式错误');
                    console.error('导入错误:', error);
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }


    // -------------------------------
    // 导出历史记录
    // -------------------------------
    function exportHistory() {
        const currentHistory = GM_getValue(HISTORY_KEY, []);

        if (currentHistory.length === 0) {
            notify('没有历史记录可以导出');
            return;
        }

        const dataStr = JSON.stringify(currentHistory, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
        a.download = `历史记录备份_${timestamp}.json`;
        a.href = url;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        notify(`已导出 ${currentHistory.length} 条记录`);
    }


    // -------------------------------
    // 清除记录
    // -------------------------------
    function clearRecordedContent() {
        // 总是从存储实时读取
        const currentHistory = GM_getValue(HISTORY_KEY, []);
        const currentContent = GM_getValue(RECORDED_CONTENT_KEY, '');

        if (currentHistory.length === 0 && !currentContent) {
            notify('没有可清除的记录');
            return;
        }

        if (!confirm(`确定要清除吗？\n- 历史记录: ${currentHistory.length} 条`)) {
            return;
        }

        // 执行清除
        GM_setValue(RECORDED_CONTENT_KEY, '');
        GM_setValue(HISTORY_KEY, []);

        // 同步更新当前页面状态
        recordedContent = '';
        historyList = [];

        notify(`已清除 ${currentHistory.length} 条历史记录`);

        // 可选：刷新补全提示
        if (ghostEl) {
            hideGhost();
        }
    }


    // -------------------------------
    // 自动补全提示功能
    // -------------------------------
    function showGhost(el, text) {
        matches = historyList.slice().reverse().filter(item => item.includes(text) && item !== text);

        if (!matches.length) {
            matchIndex = -1; // 没有匹配时重置索引
            hideGhost();
            return;
        }

        if (matchIndex < 0 || matchIndex >= matches.length) matchIndex = 0;

        const full = matches[matchIndex];
        if (!full) {
            hideGhost();
            return;
        }

        const idx = full.indexOf(text);
        if (idx === -1) {
            hideGhost();
            return;
        }

        const prefix = full.slice(0, idx);
        const middle = text;
        const suffix = full.slice(idx + text.length);

        hideGhost();
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        // canvas 计算 prefix 宽度
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = style.font;
        const prefixWidth = ctx.measureText(prefix).width;

        const ghost = document.createElement('div');
        ghost.innerHTML =
            `<span style="color:#aaa;white-space:pre;">${prefix}</span>` +
            `<span style="color:transparent;white-space:pre;">${middle}</span>` +
            `<span style="color:#aaa;white-space:pre; position: relative;">${suffix}</span>`;

        Object.assign(ghost.style, {
            position: 'absolute',
            top: rect.top + window.scrollY + 'px',
            left: (rect.left + window.scrollX - prefixWidth) + 'px',
            width: rect.width + prefixWidth + 'px',
            height: rect.height + 'px',
            font: style.font,
            lineHeight: style.lineHeight,
            padding: style.padding,
            margin: style.margin,
            border: 'none',
            background: 'transparent',
            pointerEvents: 'auto',
            whiteSpace: 'pre',
            overflow: 'hidden',
            zIndex: 9999
        });

        document.body.appendChild(ghost);
        ghostEl = ghost;

        // === 新增：单独创建叉号按钮 ===
        const closeBtn = document.createElement('button');
        closeBtn.className = 'ghost-close-btn';
        closeBtn.type = 'button';
        closeBtn.textContent = '✖';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '0px',
            right: '0px',
            cursor: 'pointer',
            color: '#aaa',
            fontWeight: 'bold',
            fontSize: '0.9em',
            border: 'none',
            background: 'transparent',
            padding: '0 4px',
            lineHeight: '1',
            pointerEvents: 'auto',
            zIndex: 10000
        });
        ghost.appendChild(closeBtn);

        // 事件：mousedown 保证在 blur 前触发
        closeBtn.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const toDelete = matches[matchIndex];
            if (toDelete) {
                historyList = historyList.filter(item => item !== toDelete);
                GM_setValue(HISTORY_KEY, historyList);
                matches.splice(matchIndex, 1);
                if (matches.length === 0) {
                    hideGhost();
                } else {
                    if (matchIndex >= matches.length) matchIndex = matches.length - 1;
                    showGhost(activeInput, getElementContent(activeInput));
                }
                console.log("已删除：", toDelete);
            }
        });
    }


    function hideGhost() { if (ghostEl) { ghostEl.remove(); ghostEl = null; } }

    function applyMatch(el, text) {
        if (!el) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.value = text;
        else el.innerText = text;
        ['input', 'change'].forEach(e => el.dispatchEvent(new Event(e, { bubbles: true })));
        recordedContent = text;
        GM_setValue(RECORDED_CONTENT_KEY, text);
        hideGhost();
    }


    // -------------------------------
    // 初始化
    // -------------------------------
    function init() {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attachListeners);
        else attachListeners();
    }

    function attachListeners() {
        setupContentEventListeners();
        setupButtonEventListeners();
    }

    init();

})();