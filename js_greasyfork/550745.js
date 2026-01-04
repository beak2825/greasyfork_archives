// ==UserScript==
// @name         Codeforces Username Alias Column
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Adds a new column before "Who" to display custom aliases for Codeforces usernames.
// @author       Sam5440
// @match        https://codeforces.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550745/Codeforces%20Username%20Alias%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/550745/Codeforces%20Username%20Alias%20Column.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // 默认的用户名映射，如果 localStorage 中没有数据，将使用这个
    const DEFAULT_USERNAME_MAP = {};
    let USERNAME_MAP = GM_getValue('cf_username_map', DEFAULT_USERNAME_MAP);

    // ================== UI 界面部分 ==================

    // 1. 添加设置按钮
    function addSettingsButton() {
        const settingsButton = $('<button class="cf-rename-settings-button">📝Alias</button>');
        settingsButton.css({
            'position': 'fixed',
            'right': '15px',
            'top': '50%', // 垂直居中
            'transform': 'translateY(-50%)', // 精确垂直居中
            'background-color': '#4CAF50',
            'color': 'white',
            'padding': '8px 12px',
            'border': 'none',
            'border-radius': '5px',
            'cursor': 'pointer',
            'font-size': '14px',
            'z-index': '9999',
            'box-shadow': '0 2px 5px rgba(0,0,0,0.2)',
            'opacity': '0.8',
            'transition': 'opacity 0.3s',
        });

        settingsButton.hover(
            function() { $(this).css('opacity', '1'); },
            function() { $(this).css('opacity', '0.8'); }
        );

        $('body').append(settingsButton);

        settingsButton.on('click', showSettingsModal);
    }

    // 2. 显示设置模态框
    function showSettingsModal() {
        // 创建模态框容器
        const modalOverlay = $('<div id="cf-rename-modal-overlay"></div>').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0, 0, 0, 0.6)',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'z-index': '10000',
        });

        // 创建模态框内容框
        const modalContent = $('<div id="cf-rename-modal-content"></div>').css({
            'background-color': 'white',
            'padding': '25px',
            'border-radius': '8px',
            'box-shadow': '0 4px 10px rgba(0, 0, 0, 0.3)',
            'width': '500px',
            'max-width': '90%',
            'display': 'flex',
            'flex-direction': 'column',
            'gap': '15px',
            'position': 'relative',
        });

        // 关闭按钮
        const closeButton = $('<span style="position: absolute; top: 10px; right: 15px; font-size: 28px; cursor: pointer; color: #555;">&times;</span>');
        closeButton.on('click', () => modalOverlay.remove());

        // 标题
        const modalTitle = $('<h3>Codeforces 用户名别名设置</h3>').css({
            'margin': '0',
            'color': '#333',
            'text-align': 'center',
            'font-size': '1.5em',
        });

        // 提示信息
        const modalHint = $('<p>输入 JSON 格式的字典。要求严格json格式，最后一个k-v没有逗号结尾，例如: <br> {"sam5440": "萝卜","yyf": "🐖", "old_name3": "alias3"}</p>').css('font-size', '0.9em; color: #666; margin-bottom: 10px;');

        // 输入框
        const textarea = $('<textarea id="cf-rename-username-dict"></textarea>').css({
            'width': 'calc(100% - 20px)',
            'height': '200px',
            'padding': '10px',
            'border': '1px solid #ccc',
            'border-radius': '4px',
            'font-family': 'monospace',
            'font-size': '14px',
            'resize': 'vertical',
        });
        try {
            textarea.val(JSON.stringify(USERNAME_MAP, null, 2)); // 格式化显示已保存的字典
        } catch (e) {
            textarea.val(JSON.stringify(DEFAULT_USERNAME_MAP, null, 2));
            console.error("Error parsing existing username map from localStorage:", e);
        }

        // 保存按钮
        const saveButton = $('<button>保存设置</button>').css({
            'background-color': '#007bff',
            'color': 'white',
            'padding': '10px 15px',
            'border': 'none',
            'border-radius': '5px',
            'cursor': 'pointer',
            'font-size': '16px',
            'align-self': 'flex-end', // 按钮靠右对齐
            'transition': 'background-color 0.3s',
        });
        saveButton.hover(
            function() { $(this).css('background-color', '#0056b3'); },
            function() { $(this).css('background-color', '#007bff'); }
        );

        saveButton.on('click', () => {
            try {
                const newMap = JSON.parse(textarea.val());
                USERNAME_MAP = newMap;
                GM_setValue('cf_username_map', USERNAME_MAP);
                alert('用户名别名映射已保存！页面将自动刷新以应用更改。');
                modalOverlay.remove();
                location.reload(); // 保存后刷新页面以应用更改
            } catch (e) {
                alert('无效的 JSON 格式！请检查输入。');
                console.error('JSON parse error:', e);
            }
        });

        // 组合模态框内容
        modalContent.append(closeButton, modalTitle, modalHint, textarea, saveButton);
        modalOverlay.append(modalContent);
        $('body').append(modalOverlay);
    }

    // ================== 核心功能部分 ==================

    // 添加新的列头
    function addAliasColumnHeader() {
        // 查找 standings 表格的表头
        let $standingsTable = $('.standings');
        if ($standingsTable.length === 0) return;

        let $whoHeader = $standingsTable.find('th:contains("Who")');
        if ($whoHeader.length > 0 && $whoHeader.prevAll('th.cf-alias-header').length === 0) { // 防止重复添加
            let $aliasHeader = $('<th class="top cf-alias-header" style="text-align:left;width:8em;">Alias</th>');
            $whoHeader.before($aliasHeader);

            // 同时处理统计行（如果有的话）
            let $statsWhoCell = $standingsTable.find('tr.standingsStatisticsRow td:contains("Accepted")').first();
            if ($statsWhoCell.length > 0 && $statsWhoCell.prevAll('td.cf-alias-stats-cell').length === 0) {
                let $aliasStatsCell = $('<td class="smaller bottom cf-alias-stats-cell" style="text-align:left;padding-left:1em;">Alias</td>');
                $statsWhoCell.before($aliasStatsCell);
            }
        }
    }

    // 在每一行添加别名
    function addAliasToRows() {
        // 确保列头已存在
        addAliasColumnHeader();

        $('.standings tr').not('.standingsStatisticsRow, .cf-alias-processed').each(function() {
            let $row = $(this);
            let $whoCell = $row.find('.contestant-cell'); // "Who" 列的 td 元素
            if ($whoCell.length > 0 && $whoCell.prevAll('td.cf-alias-cell').length === 0) { // 检查是否已添加过别名列
                let originalUsernameElement = $whoCell.find('a.rated-user, span.participant').first();
                if (originalUsernameElement.length === 0) {
                    // 对于没有 rated-user 或 participant 的行（可能不是选手行）
                    // 插入一个空的td以保持表格结构
                    $whoCell.before('<td class="cf-alias-cell"></td>');
                    $row.addClass('cf-alias-processed');
                    return;
                }

                let originalUsername = originalUsernameElement.text().trim();
                let alias = USERNAME_MAP[originalUsername] || '';

                let $aliasCell = $('<td class="cf-alias-cell" style="text-align:left;padding-left:1em;"></td>');
                if (alias) {
                    $aliasCell.text(alias);
                } else {
                    $aliasCell.html('&nbsp;'); // 保持高度
                }

                // 复制背景颜色和黑暗类
                if ($whoCell.hasClass('dark')) {
                    $aliasCell.addClass('dark');
                }

                $whoCell.before($aliasCell);
                $row.addClass('cf-alias-processed'); // 标记为已处理，防止重复添加
            }
        });

        // 刷新 datatable 的样式，确保新列的样式正确
        $('.datatable').each(function () {
            // 重新应用交替背景色和边角样式
            $(this).find("th, td")
                .removeClass("top").removeClass("bottom")
                .removeClass("left").removeClass("right")
                .removeClass("dark");
            $(this).find("tr:first th").addClass("top");
            $(this).find("tr:last td").addClass("bottom");
            $(this).find("tr:odd td").addClass("dark");
            $(this).find("tr td:first-child, tr th:first-child").addClass("left");
            $(this).find("tr td:last-child, tr th:last-child").addClass("right");
        });
    }

    // 使用 MutationObserver 监听 DOM 变化
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            let columnAdded = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // 仅当表格内容有变化时才尝试重新添加列头和行别名
                    if ($(mutation.target).closest('.standings').length || $('.standings').length > 0) {
                        addAliasColumnHeader(); // 确保列头始终存在
                        addAliasToRows();
                        columnAdded = true;
                    }
                }
            });
            // if(columnAdded) {
            //     // 触发datatable的样式更新（如果需要）
            //     if (typeof window.updateDatatableFilter === 'function') {
            //         // Codeforces的datatable更新函数可能需要一个参数，通常是触发筛选的input
            //         // 这里我们只是想触发样式更新，可以尝试传入一个空的或不相关的元素
            //         $('.datatable .filter input').each(function() {
            //             window.updateDatatableFilter(this);
            //         });
            //     }
            // }
        });

        // 监听 body 元素及其子元素的任何变化，特别是对 '.standings' 表格
        // 适当调整监听范围以提高性能，避免过度触发
        const standingsTable = $('.standings')[0]; // 仅监听 standings 表格
        if (standingsTable) {
            observer.observe(standingsTable, {
                childList: true,    // 监听子节点的添加或移除 (例如新行)
                subtree: true,      // 监听所有后代节点的添加、移除或内容修改
            });
        } else {
            // 如果一开始没有 standings 表格，监听 body
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }


    // ================== 脚本初始化 ==================

    // 等待页面完全加载 (使用 jQuery ready 确保 DOM 准备好)
    $(document).ready(function() {
        addSettingsButton();
        addAliasColumnHeader(); // 首次加载时添加列头
        addAliasToRows(); // 首次加载时添加别名到现有行
        observeDOMChanges(); // 监听后续的 DOM 变化
    });

})(jQuery);
