// ==UserScript==
// @name         蓝白-2048搜索页面批量打开链接
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  一键在新标签页中打开所有标题，支持起始词、截止词、排除词和作者过滤，并显示最新的一条高亮记录
// @author       蓝白社野怪
// @match        https://hjd2048.com/2048/search.php?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/550442/%E8%93%9D%E7%99%BD-2048%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/550442/%E8%93%9D%E7%99%BD-2048%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从标题中提取时间戳
    function extractTimestamp(title) {
        const match = title.match(/\[(\d{4}\.\d{2}\.\d{2})\]/);
        if (match) {
            // 将 "2025.08.21" 转换为 "20250821" 便于比较
            return parseInt(match[1].replace(/\./g, ''), 10);
        }
        return 0; // 如果没有时间戳，返回0
    }

    // 获取最新的高亮记录
    function getLatestFirstTitle() {
        const firstTitles = GM_getValue('allFirstTitles', []);
        if (firstTitles.length === 0) return null;

        // 找到时间最新的标题
        let latestTitle = firstTitles[0];
        let latestTimestamp = extractTimestamp(latestTitle);

        for (let i = 1; i < firstTitles.length; i++) {
            const currentTimestamp = extractTimestamp(firstTitles[i]);
            if (currentTimestamp > latestTimestamp) {
                latestTitle = firstTitles[i];
                latestTimestamp = currentTimestamp;
            }
        }

        return latestTitle;
    }

    // 保存设置
    function saveSettings() {
        const startWord = document.getElementById('startWordInput').value;
        const stopWord = document.getElementById('stopWordInput').value;
        const excludeWords = document.getElementById('excludeWordsInput').value;
        const blockAuthors = document.getElementById('blockAuthorsInput').value;
        GM_setValue('startWord', startWord);
        GM_setValue('stopWord', stopWord);
        GM_setValue('excludeWords', excludeWords);
        GM_setValue('blockAuthors', blockAuthors);

        // 立即应用作者屏蔽
        setTimeout(applyAuthorBlocking, 0);
    }

    // 应用作者屏蔽
    function applyAuthorBlocking() {
        const blockAuthors = GM_getValue('blockAuthors', '');
        if (!blockAuthors.trim()) return;

        const authorList = blockAuthors.split(' ').filter(author => author.trim());
        const rows = document.querySelectorAll('tr.tr3.tac');

        let i = 0;
        const processBatch = () => {
            const batchSize = 20;
            const end = Math.min(i + batchSize, rows.length);

            for (; i < end; i++) {
                const row = rows[i];
                const authorCell = row.querySelector('.smalltxt.y-style a');
                if (authorCell) {
                    const authorName = authorCell.textContent.trim();
                    const shouldHide = authorList.some(author =>
                        authorName.includes(author.trim())
                    );

                    if (shouldHide) {
                        row.style.display = 'none';
                    } else {
                        row.style.display = '';
                    }
                }
            }

            if (i < rows.length) {
                requestAnimationFrame(processBatch);
            }
        };

        requestAnimationFrame(processBatch);
    }

    // 显示所有被隐藏的行
    function showAllHiddenRows() {
        const rows = document.querySelectorAll('tr.tr3.tac');
        let i = 0;
        const processBatch = () => {
            const batchSize = 30;
            const end = Math.min(i + batchSize, rows.length);

            for (; i < end; i++) {
                rows[i].style.display = '';
            }

            if (i < rows.length) {
                requestAnimationFrame(processBatch);
            }
        };

        requestAnimationFrame(processBatch);
    }

    // 高亮所有记录的第一个标题
    function highlightAllFirstTitles() {
        const firstTitles = GM_getValue('allFirstTitles', []);
        if (firstTitles.length === 0) return;

        // 清除之前的高亮
        const previousHighlighted = document.querySelectorAll('.highlighted-title');
        previousHighlighted.forEach(row => {
            row.classList.remove('highlighted-title');
            row.style.backgroundColor = '';
            row.style.border = '';
        });

        // 高亮所有记录的第一个标题
        const links = document.querySelectorAll('th.y-style.tal a[href^="read.php?tid="]');
        firstTitles.forEach(firstTitle => {
            const link = Array.from(links).find(link => link.textContent === firstTitle);
            if (link) {
                const row = link.closest('tr');
                if (row) {
                    row.classList.add('highlighted-title');
                    row.style.backgroundColor = '#fff3cd';
                    row.style.border = '2px solid #ffc107';
                }
            }
        });
    }

    // 清除所有高亮记录
    function clearAllHighlights() {
        // 清除页面高亮
        const highlighted = document.querySelectorAll('.highlighted-title');
        highlighted.forEach(row => {
            row.classList.remove('highlighted-title');
            row.style.backgroundColor = '';
            row.style.border = '';
        });

        // 清除存储的记录
        GM_setValue('allFirstTitles', []);
        updateHighlightsList();
        alert('已清除所有高亮记录');
    }

    // 更新高亮列表显示
    function updateHighlightsList() {
        const firstTitles = GM_getValue('allFirstTitles', []);
        const latestTitle = getLatestFirstTitle();
        const highlightsList = document.getElementById('highlightsList');

        if (highlightsList) {
            if (latestTitle) {
                highlightsList.innerHTML = `
                    <div style="margin-bottom: 3px; font-size: 10px; color: #666;">
                        <strong>最新记录:</strong>
                    </div>
                    <div style="font-size: 10px; color: #666; margin-bottom: 3px;">
                        ${latestTitle}
                    </div>
                    <div style="font-size: 9px; color: #999;">
                        共 ${firstTitles.length} 条记录
                    </div>
                `;
            } else {
                highlightsList.innerHTML = '<div style="font-size: 10px; color: #999;">无记录</div>';
            }
        }
    }

    // 检查是否包含排除词
    function containsExcludeWords(title, excludeWords) {
        if (!excludeWords.trim()) return false;

        const excludeList = excludeWords.split(',').map(word => word.trim()).filter(word => word);
        return excludeList.some(word => title.includes(word));
    }

    // 打开所有符合条件的链接
    function openAllLinks() {
        const startWord = document.getElementById('startWordInput').value;
        const stopWord = document.getElementById('stopWordInput').value;
        const excludeWords = document.getElementById('excludeWordsInput').value;
        GM_setValue('startWord', startWord);
        GM_setValue('stopWord', stopWord);
        GM_setValue('excludeWords', excludeWords);

        const links = document.querySelectorAll('th.y-style.tal a[href^="read.php?tid="]');
        let foundStartWord = !startWord;
        let foundStopWord = false;
        let openedCount = 0;
        let firstOpenedTitle = null;
        const openUrls = [];

        // 先收集所有要打开的URL
        for (let link of links) {
            const title = link.textContent;
            const row = link.closest('tr');

            // 跳过被隐藏的行
            if (row && row.style.display === 'none') {
                continue;
            }

            // 检查是否遇到起始词
            if (startWord && !foundStartWord && title.includes(startWord)) {
                foundStartWord = true;
            }

            // 如果还没找到起始词，跳过
            if (!foundStartWord) {
                continue;
            }

            // 检查是否遇到截止词
            if (stopWord && title.includes(stopWord)) {
                foundStopWord = true;
            }

            // 如果已经遇到截止词，停止处理
            if (foundStopWord) {
                break;
            }

            // 检查是否包含排除词
            if (containsExcludeWords(title, excludeWords)) {
                continue;
            }

            // 记录第一个打开的标题
            if (openedCount === 0 && !firstOpenedTitle) {
                firstOpenedTitle = title;
            }

            openUrls.push(link.href);
            openedCount++;
        }

        // 如果有第一个打开的标题，保存到记录中
        if (firstOpenedTitle) {
            const firstTitles = GM_getValue('allFirstTitles', []);
            // 避免重复记录
            if (!firstTitles.includes(firstOpenedTitle)) {
                firstTitles.push(firstOpenedTitle);
                GM_setValue('allFirstTitles', firstTitles);
            }
        }

        // 批量打开链接
        openUrls.forEach((url, index) => {
            //setTimeout(() => {
             //   window.open(url, '_blank');
            //}, index * 300);
            window.open(url, '_blank');
        });

        // 更新高亮显示
        setTimeout(() => {
            highlightAllFirstTitles();
            updateHighlightsList();
        }, 100);
    }

    // 创建UI界面
    function createUI() {
        if (document.getElementById('linkOpenerUI')) return;

        const ui = document.createElement('div');
        ui.id = 'linkOpenerUI';
        ui.style.position = 'fixed';
        ui.style.top = '10px';
        ui.style.right = '10px';
        ui.style.backgroundColor = '#f9f9f9';
        ui.style.border = '1px solid #ccc';
        ui.style.padding = '10px';
        ui.style.borderRadius = '5px';
        ui.style.zIndex = '9999';
        ui.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        ui.style.fontSize = '12px';
        ui.style.maxWidth = '320px';

        // 获取保存的设置
        const savedStartWord = GM_getValue('startWord', '');
        const savedStopWord = GM_getValue('stopWord', '');
        const savedExcludeWords = GM_getValue('excludeWords', '');
        const savedBlockAuthors = GM_getValue('blockAuthors', '');
        const firstTitles = GM_getValue('allFirstTitles', []);
        const latestTitle = getLatestFirstTitle();

        ui.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #2196F3;">蓝白-2048搜索页面批量打开链接</div>
            <div style="margin-bottom: 8px;">
                <label for="startWordInput" style="display: block; margin-bottom: 3px;">起始词:</label>
                <input type="text" id="startWordInput" value="${savedStartWord}" placeholder="从此词之后开始打开" style="width: 100%; padding: 4px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 8px;">
                <label for="stopWordInput" style="display: block; margin-bottom: 3px;">截止词:</label>
                <input type="text" id="stopWordInput" value="${savedStopWord}" placeholder="遇到此词停止打开" style="width: 100%; padding: 4px; box-sizing: border-box;">
            </div>
            <div style="margin-bottom: 8px;">
                <label for="excludeWordsInput" style="display: block; margin-bottom: 3px;">排除词:</label>
                <input type="text" id="excludeWordsInput" value="${savedExcludeWords}" placeholder="多个排除词用逗号隔开" style="width: 100%; padding: 4px; box-sizing: border-box;">
                <div style="font-size: 10px; color: #666; margin-top: 2px;">多个排除词用逗号隔开</div>
            </div>
            <div style="margin-bottom: 8px;">
                <label for="blockAuthorsInput" style="display: block; margin-bottom: 3px;">屏蔽作者:</label>
                <input type="text" id="blockAuthorsInput" value="${savedBlockAuthors}" placeholder="多个作者用空格隔开" style="width: 100%; padding: 4px; box-sizing: border-box;">
                <div style="font-size: 10px; color: #666; margin-top: 2px;">多个作者用空格隔开</div>
            </div>
            <div style="margin-bottom: 8px;">
                <div style="font-size: 11px; color: #666; margin-bottom: 3px;">高亮记录:</div>
                <div id="highlightsList" style="margin-bottom: 5px; padding: 5px; background: #f5f5f5; border-radius: 3px; min-height: 40px;">
                    ${latestTitle
                        ? `<div style="margin-bottom: 3px; font-size: 10px; color: #666;">
                              <strong>最新记录:</strong>
                           </div>
                           <div style="font-size: 10px; color: #666; margin-bottom: 3px;">
                              ${latestTitle}
                           </div>
                           <div style="font-size: 9px; color: #999;">
                              共 ${firstTitles.length} 条记录
                           </div>`
                        : '<div style="font-size: 10px; color: #999;">无记录</div>'}
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 5px;">
                <button id="saveSettingsBtn" style="padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">保存设置</button>
                <button id="applyBlockBtn" style="padding: 5px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer;">应用屏蔽</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 5px;">
                <button id="openLinksBtn" style="padding: 5px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">打开链接</button>
                <button id="resetViewBtn" style="padding: 5px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">重置视图</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 5px;">
                <button id="clearHighlightsBtn" style="padding: 5px; background: #9e9e9e; color: white; border: none; border-radius: 3px; cursor: pointer;">清除高亮记录</button>
            </div>
        `;

        document.body.appendChild(ui);

        // 添加事件监听器
        document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
        document.getElementById('openLinksBtn').addEventListener('click', openAllLinks);
        document.getElementById('applyBlockBtn').addEventListener('click', applyAuthorBlocking);
        document.getElementById('resetViewBtn').addEventListener('click', showAllHiddenRows);
        document.getElementById('clearHighlightsBtn').addEventListener('click', clearAllHighlights);

        // 自动应用作者屏蔽和高亮
        setTimeout(() => {
            applyAuthorBlocking();
            highlightAllFirstTitles();
        }, 500);
    }

    // 注册菜单命令
    GM_registerMenuCommand('显示/隐藏链接打开工具', function() {
        const existingUI = document.getElementById('linkOpenerUI');
        if (existingUI) {
            existingUI.remove();
        } else {
            createUI();
        }
    });

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(createUI, 100);
        });
    } else {
        setTimeout(createUI, 100);
    }
})();