// ==UserScript==
// @name         GGN 合集展开收起
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在GGN种子页面添加收起/展开所有种子按钮
// @author       27
// @match        https://gazellegames.net/torrents.php*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555839/GGN%20%E5%90%88%E9%9B%86%E5%B1%95%E5%BC%80%E6%94%B6%E8%B5%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555839/GGN%20%E5%90%88%E9%9B%86%E5%B1%95%E5%BC%80%E6%94%B6%E8%B5%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const BUTTON_STYLES = {
        base: `
            position: fixed;
            right: 20px;
            padding: 12px 20px;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 140px;
            height: 45px;
        `,
        position: 'top: 20px;',
        colors: {
            normal: '#2196F3',
            hover: '#1976D2'
        }
    };

    // 创建按钮函数
    function createButton(text, colors) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = BUTTON_STYLES.base + BUTTON_STYLES.position + `background-color: ${colors.normal};`;

        // 添加悬停效果
        button.addEventListener('mouseenter', () => button.style.backgroundColor = colors.hover);
        button.addEventListener('mouseleave', () => button.style.backgroundColor = colors.normal);

        return button;
    }


    // 添加收起/展开所有种子按钮的函数
    function addCollapseAllButton() {
        try {
            // 创建收起/展开按钮
            const collapseButton = createButton('收起全部', BUTTON_STYLES.colors);

            // 按钮点击事件
            let isCollapsed = false;
            collapseButton.addEventListener('click', () => {
                try {
                    // 查找所有group_torrent行
                    const groupTorrentRows = document.querySelectorAll('tr.group_torrent');

                    if (groupTorrentRows.length === 0) {
                        console.log('未找到种子行');
                        return;
                    }

                    if (!isCollapsed) {
                        // 收起所有种子 - 添加hidden类
                        groupTorrentRows.forEach(row => {
                            if (!row.classList.contains('hidden')) {
                                row.classList.add('hidden');
                            }
                        });

                        collapseButton.textContent = '展开全部';
                        isCollapsed = true;
                        console.log(`已收起 ${groupTorrentRows.length} 个种子行`);
                    } else {
                        // 展开所有种子 - 移除hidden类
                        groupTorrentRows.forEach(row => {
                            if (row.classList.contains('hidden')) {
                                row.classList.remove('hidden');
                            }
                        });

                        collapseButton.textContent = '收起全部';
                        isCollapsed = false;
                        console.log(`已展开 ${groupTorrentRows.length} 个种子行`);
                    }
                } catch (err) {
                    console.error('收起/展开种子时出错:', err);
                }
            });

            // 将按钮添加到页面
            document.body.appendChild(collapseButton);
            console.log('收起/展开按钮已添加到页面右上角');

        } catch (err) {
            console.error('添加收起/展开按钮时出错:', err);
        }
    }

    // 延迟执行，确保页面加载完成后再添加按钮
    const DELAYS = {
        TORRENT_TABLE: 1500
    };

    setTimeout(() => {
        try {
            // 查找种子表格
            const torrentTable = document.querySelector('table.torrent_table.grouping');
            if (!torrentTable) {
                console.log('未找到种子表格');
                return;
            }

            // 添加收起/展开所有种子的按钮
            addCollapseAllButton();

        } catch (err) {
            console.error('添加种子表格收起按钮时出错:', err);
        }
    }, DELAYS.TORRENT_TABLE);

})();
