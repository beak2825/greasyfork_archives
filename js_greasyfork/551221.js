// ==UserScript==
// @name         蓝白-2048论坛完美合并器
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description 智能合并+严格过滤+自动折叠
// @author       蓝白社野怪
// @match        https://hjd2048.com/2048/search.php*
// @grant        GM_addStyle
// @grant        GM_notification
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/551221/%E8%93%9D%E7%99%BD-2048%E8%AE%BA%E5%9D%9B%E5%AE%8C%E7%BE%8E%E5%90%88%E5%B9%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551221/%E8%93%9D%E7%99%BD-2048%E8%AE%BA%E5%9D%9B%E5%AE%8C%E7%BE%8E%E5%90%88%E5%B9%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================== 配置 ========================
    const CONFIG = {
        debug: false,
        // 强制过滤的站点
        BANNED_SITES: [
            "求片专版",
            "重金求片区（米粒悬赏）限侠客以上"
        ],
        // 标题过滤词
        FILTER_WORDS: [
            "[转载搬运]", "[百度盘]", "[自行打包]",
            "【达人组出品】", "【原版无水印】"
        ],
        // 角色库
        ROLES: new Set([
            "雷电将军", "阿狸", "菲谢尔", "约尔", "八重神子",
            "甘雨", "申鹤", "胡桃", "夜兰", "妮露"
        ]),
        // 选择器
        selectors: {
            table: 'table[id^="forum_"], table[width="100%"]',
            row: 'tr[id^="search_"]',
            titleLink: 'th a[target="_blank"]',
            siteCell: 'td:nth-child(2)'
        },
        // 规则
        rules: {
            minTitleLength: 5,
            mergeThreshold: 0.7
        }
    };

    // ======================== 工具函数 ========================
    function log(...args) {
        if (CONFIG.debug) console.log('[合并器]', ...args);
    }

    // 安全DOM操作
    function safeRemove(node) {
        try {
            if (node?.parentNode) {
                node.parentNode.removeChild(node);
                return true;
            }
        } catch (e) {
            log('移除节点失败:', e);
        }
        return false;
    }

    // ======================== 核心功能 ========================
    // 预处理标题
    function processTitle(title) {
        CONFIG.FILTER_WORDS.forEach(word => {
            const escaped = word.replace(/[\[\]\(\)]/g, '\\$&');
            title = title.replace(new RegExp(escaped, 'g'), '');
        });
        return title.trim().replace(/\s+/g, ' ');
    }

    // 检查是否需要过滤
    function shouldFilter(row) {
        const siteCell = row.querySelector(CONFIG.selectors.siteCell);
        return siteCell && CONFIG.BANNED_SITES.some(site =>
            siteCell.textContent.trim() === site
        );
    }

    // 获取有效行
    function getValidRows() {
        const rows = Array.from(document.querySelectorAll(CONFIG.selectors.row));
        return rows.filter(row => {
            if (shouldFilter(row)) {
                safeRemove(row);
                return false;
            }
            const title = getTitleText(row);
            return title && title.length >= CONFIG.rules.minTitleLength;
        });
    }

    // 获取标题文本
    function getTitleText(row) {
        const link = row.querySelector(CONFIG.selectors.titleLink);
        return link ? processTitle(link.textContent) : '';
    }

    // 计算相似度
    function calculateSimilarity(title1, title2) {
        // 1. 文件大小
        const size1 = title1.match(/\d+\.?\d*\s*[GMK]B?/i)?.[0];
        const size2 = title2.match(/\d+\.?\d*\s*[GMK]B?/i)?.[0];
        if (size1 && size2 && size1 === size2) return 1.0;

        // 2. 角色匹配
        const char1 = [...CONFIG.ROLES].find(c => title1.includes(c));
        const char2 = [...CONFIG.ROLES].find(c => title2.includes(c));
        if (char1 && char2 && char1 === char2) return 0.8;

        // 3. 文本相似度
        const set1 = new Set(title1.split(''));
        const set2 = new Set(title2.split(''));
        const intersection = new Set([...set1].filter(c => set2.has(c)));
        return intersection.size / Math.max(set1.size, set2.size);
    }

    // ======================== 主逻辑 ========================
    function mergeDuplicates() {
        try {
            const rows = getValidRows();
            log('有效帖子数:', rows.length);
            if (rows.length < 2) return;

            const groups = [];
            const processed = new WeakSet();

            rows.forEach(row => {
                if (processed.has(row)) return;

                const group = {
                    root: row,
                    duplicates: [],
                    reasons: new Set()
                };

                const title = getTitleText(row);
                rows.forEach(otherRow => {
                    if (!processed.has(otherRow) && otherRow !== row) {
                        const otherTitle = getTitleText(otherRow);
                        const similarity = calculateSimilarity(title, otherTitle);
                        if (similarity >= CONFIG.rules.mergeThreshold) {
                            group.duplicates.push(otherRow);
                            group.reasons.add(`匹配度${Math.round(similarity * 100)}%`);
                            processed.add(otherRow);
                        }
                    }
                });

                if (group.duplicates.length > 0) {
                    groups.push(group);
                }
            });

            log('生成合并组:', groups.length);
            if (groups.length === 0) return;

            // 重建DOM
            groups.forEach(group => {
                const newRow = group.root.cloneNode(true);
                newRow.classList.add('merged-row', 'collapsed');

                // 保持列宽
                Array.from(group.root.cells).forEach((cell, i) => {
                    newRow.cells[i].style.width = cell.style.width;
                });

                // 修改标题
                const titleCell = newRow.querySelector('th');
                if (titleCell) {
                    titleCell.innerHTML = `
                        <div class="header">
                            <button class="toggle-btn">▶</button>
                            <span class="main-title">${titleCell.innerHTML}</span>
                        </div>
                        <div class="duplicates-container">
                            ${group.duplicates.map(row => `
                                <div class="duplicate-item">
                                    ${row.querySelector('th').innerHTML}
                                </div>
                            `).join('')}
                        </div>
                    `;

                    // 折叠功能
                    titleCell.querySelector('.toggle-btn').addEventListener('click', function() {
                        newRow.classList.toggle('collapsed');
                        this.textContent = newRow.classList.contains('collapsed') ? '▶' : '▼';
                    });
                }

                // 替换原始行
                group.root.parentNode.insertBefore(newRow, group.root);
                safeRemove(group.root);
                group.duplicates.forEach(row => safeRemove(row));
            });

            GM_notification({
                title: '合并完成',
                text: `已合并 ${groups.length} 组内容`,
                timeout: 2000
            });

        } catch (e) {
            log('合并出错:', e);
            GM_notification({
                title: '脚本错误',
                text: e.message,
                timeout: 3000
            });
        }
    }

    // ======================== 样式 ========================
    GM_addStyle(`
        .merged-row {
            background: #f9f9f9 !important;
            border-left: 3px solid #e74c3c !important;
            margin: 5px 0;
        }
        .collapsed .duplicates-container {
            display: none;
        }
        .toggle-btn {
            background: none;
            border: none;
            padding: 0;
            margin-right: 5px;
            cursor: pointer;
            color: #e74c3c;
            font-size: 12px;
            min-width: 15px;
        }
        .main-title {
            font-weight: bold;
        }
        .duplicate-item {
            padding-left: 20px;
            margin: 3px 0;
            border-left: 2px dashed #95a5a6;
            opacity: 0.8;
        }
        .duplicate-item:hover {
            opacity: 1;
        }
    `);

    // ======================== 初始化 ========================
    function init() {
        const checkReady = () => {
            if (document.querySelector(CONFIG.selectors.row)) {
                setTimeout(mergeDuplicates, 800);
            } else {
                setTimeout(checkReady, 500);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkReady);
        } else {
            checkReady();
        }
    }

    // 启动脚本
    init();

    // 监听动态加载
    new MutationObserver(() => {
        if (document.querySelector(CONFIG.selectors.row)) {
            setTimeout(mergeDuplicates, 1500);
        }
    }).observe(document.body, { childList: true, subtree: true });
})();