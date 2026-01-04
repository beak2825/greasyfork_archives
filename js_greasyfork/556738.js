// ==UserScript==
// @name         放生鱼鱼小助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  基于页面源码数据的概率统计与收益分析，提供可视化的掉落概率与倍率展示。
// @author       kiwi4814
// @license      MIT
// @match        https://si-qi.xyz/free_fishes.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556738/%E6%94%BE%E7%94%9F%E9%B1%BC%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556738/%E6%94%BE%E7%94%9F%E9%B1%BC%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 配置常量
     */
    const CONFIG = {
        MULTIPLIERS: {
            'common': 1,
            'uncommon': 1,
            'rare': 1,
            'epic': 2,
            'legendary': 4
        },
        LABELS: {
            'mowan': '⚗️ 魔丸',
            'corn': '🌽 玉米',
            'carrot': '🥕 胡萝卜',
            'worm': '🪱 蚯蚓',
            'popularity': '🍽️ 受欢迎值',
            'tomato': '🍅 西红柿',
            'mushroom': '🍄 蘑菇',
            'eggplant': '🍆 茄子',
            'none': '无收益'
        },
        PRIORITY_KEYS: ['mowan', 'popularity'] // 优先展示的物品
    };

    /**
     * 核心逻辑类
     */
    class FishAnalytics {
        constructor() {
            this.data = this.fetchGameData();
            if (this.data) {
                this.initUI();
            }
        }

        /**
         * 从页面源码中提取 FREE_FISH_DATA
         */
        fetchGameData() {
            try {
                const regex = /const\s+FREE_FISH_DATA\s*=\s*(\{.*?\});/s;
                const match = document.documentElement.innerHTML.match(regex);
                if (match && match[1]) {
                    return JSON.parse(match[1]);
                }
            } catch (error) {
                console.error('[数据分析面板] 数据解析异常:', error);
            }
            console.error('[数据分析面板] 未检测到源数据');
            return null;
        }

        /**
         * 解析文本中的数值 (例如 "受欢迎 +20" -> "+20")
         */
        extractValue(label, key) {
            if (!label) return '';
            const plusMatch = label.match(/\+(\d+)/);
            if (plusMatch) return `+${plusMatch[1]}`;

            const quantityMatch = label.match(/(\d+)\s*个/);
            if (quantityMatch) return `x${quantityMatch[1]}`;

            if (key !== 'popularity' && key !== 'none') return 'x1';
            return '';
        }

        /**
         * 构建概率概览表格 HTML
         */
        renderOverviewTable() {
            const rarities = this.data.rarity_order || ['common', 'uncommon', 'rare', 'epic', 'legendary'];

            let rows = rarities.map(key => {
                const rewards = this.data.release_rewards[key] || [];
                const noneItem = rewards.find(r => r.key === 'none');
                // 假设总权重为1000，计算百分比
                const failRate = noneItem ? (noneItem.weight / 10) : 0;
                const successRate = (100 - failRate).toFixed(1);
                const multiplier = CONFIG.MULTIPLIERS[key];
                const meta = this.data.rarity_map[key];

                // 动态计算颜色，与原站稀有度颜色保持一致或使用通用警告色
                const rateColor = failRate > 50 ? '#d9534f' : '#2c9b61'; // Bootstrap danger/success colors matches theme

                return `
                    <tr>
                        <td class="text-left">
                            <div class="rarity-cell">
                                <img src="${meta.icon}" alt="${meta.label}">
                                <span class="rarity-name" data-rarity="${key}">${meta.label}</span>
                            </div>
                        </td>
                        <td><span class="badge-pill type-${multiplier}">x${multiplier}</span></td>
                        <td style="color: ${rateColor}; font-weight: bold;">${failRate}%</td>
                        <td>${successRate}%</td>
                    </tr>
                `;
            }).join('');

            return `
                <div class="analytics-section">
                    <div class="section-title">📊 概率概览</div>
                    <div class="table-responsive">
                        <table class="analytics-table">
                            <thead>
                                <tr>
                                    <th class="text-left">稀有度</th>
                                    <th>收益倍率</th>
                                    <th>无收益概率</th>
                                    <th>物品掉落率</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        /**
         * 构建详细掉落表格 HTML
         */
        renderDetailTable() {
            const rarities = this.data.rarity_order || [];
            const rewardsMap = this.data.release_rewards;

            // 收集所有可能的物品key
            const allKeys = new Set();
            Object.values(rewardsMap).forEach(list => {
                list.forEach(item => {
                    if (item.key !== 'none') allKeys.add(item.key);
                });
            });

            // 排序：高优先级 -> 其他
            const sortedKeys = Array.from(allKeys).sort((a, b) => {
                const pA = CONFIG.PRIORITY_KEYS.indexOf(a);
                const pB = CONFIG.PRIORITY_KEYS.indexOf(b);
                if (pA !== -1 && pB !== -1) return pA - pB;
                if (pA !== -1) return -1;
                if (pB !== -1) return 1;
                return a.localeCompare(b);
            });

            // 表头
            const headerCols = rarities.map(r => {
                const label = this.data.rarity_map[r].label.replace('鱼', '');
                return `<th>${label}</th>`;
            }).join('');

            // 表内容
            const rows = sortedKeys.map(itemKey => {
                const itemName = CONFIG.LABELS[itemKey] || itemKey;
                const isRare = CONFIG.PRIORITY_KEYS.includes(itemKey);

                const cols = rarities.map(rarityKey => {
                    const list = rewardsMap[rarityKey] || [];
                    const item = list.find(r => r.key === itemKey);
                    const prob = item ? (item.weight / 10) : 0;

                    if (prob === 0) return `<td class="muted">-</td>`;

                    const valueText = this.extractValue(item.label, itemKey);
                    // 高亮稀有物品的掉率
                    const style = isRare ? 'font-weight: bold; color: var(--free-primary-dark);' : '';

                    return `
                        <td style="${style}">
                            <div>${prob}%</div>
                            ${valueText ? `<div class="sub-text">${valueText}</div>` : ''}
                        </td>
                    `;
                }).join('');

                return `<tr class="${isRare ? 'highlight-row' : ''}"><td class="text-left item-name">${itemName}</td>${cols}</tr>`;
            }).join('');

            return `
                <div class="analytics-section">
                    <div class="section-title">🎁 物品掉落详情</div>
                    <div class="table-responsive">
                        <table class="analytics-table compact">
                            <thead>
                                <tr>
                                    <th class="text-left">物品名称</th>
                                    ${headerCols}
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        /**
         * 注入CSS样式
         */
        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                :root {
                    --analytics-border: rgba(247, 163, 37, 0.25);
                    --analytics-bg-header: rgba(247, 163, 37, 0.1);
                    --analytics-row-hover: rgba(255, 250, 240, 0.8);
                }
                .analytics-card {
                    margin-bottom: 24px;
                    transition: all 0.3s ease;
                }
                .analytics-header {
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    user-select: none;
                }
                .toggle-icon {
                    font-size: 14px;
                    color: var(--free-primary-dark);
                    transition: transform 0.3s ease;
                }
                .analytics-content {
                    margin-top: 20px;
                    border-top: 1px dashed var(--analytics-border);
                    padding-top: 20px;
                    display: none;
                    animation: fadeIn 0.3s ease-in-out;
                }
                .analytics-section {
                    margin-bottom: 24px;
                }
                .section-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--free-primary-dark);
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .table-responsive {
                    overflow-x: auto;
                    border-radius: 12px;
                    border: 1px solid var(--analytics-border);
                }
                .analytics-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                    text-align: center;
                    background: rgba(255, 255, 255, 0.5);
                }
                .analytics-table th {
                    background: var(--analytics-bg-header);
                    color: var(--free-text);
                    padding: 10px 12px;
                    font-weight: 600;
                    white-space: nowrap;
                }
                .analytics-table td {
                    padding: 8px 12px;
                    border-top: 1px solid rgba(0,0,0,0.04);
                    color: var(--free-text);
                    vertical-align: middle;
                }
                .analytics-table tr:hover {
                    background-color: var(--analytics-row-hover);
                }
                .analytics-table .text-left { text-align: left; }
                .analytics-table.compact td { padding: 6px 8px; font-size: 13px; }

                /* 单元格样式 */
                .rarity-cell { display: flex; align-items: center; gap: 8px; }
                .rarity-cell img { width: 22px; height: 22px; }
                .rarity-name { font-weight: 600; }

                /* 稀有度颜色适配 */
                .rarity-name[data-rarity="uncommon"] { color: #3c9d9b; }
                .rarity-name[data-rarity="rare"] { color: #4169e1; }
                .rarity-name[data-rarity="epic"] { color: #7b3fa1; }
                .rarity-name[data-rarity="legendary"] { color: #d79f00; }

                /* 徽章样式 */
                .badge-pill {
                    display: inline-block;
                    padding: 2px 10px;
                    border-radius: 99px;
                    font-size: 12px;
                    font-weight: bold;
                    color: #fff;
                    background: #a27a37;
                }
                .badge-pill.type-2 { background: #7b3fa1; }
                .badge-pill.type-4 { background: #d79f00; box-shadow: 0 0 5px rgba(215, 159, 0, 0.4); }

                .item-name { font-weight: 500; }
                .sub-text { font-size: 11px; color: #999; margin-top: 2px; }
                .muted { color: #ccc; }
                .highlight-row { background-color: rgba(255, 248, 220, 0.4); }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        /**
         * 初始化界面
         */
        initUI() {
            this.injectStyles();

            const container = document.createElement('div');
            container.className = 'card analytics-card';

            // 组合HTML
            container.innerHTML = `
                <div class="card-header analytics-header" id="analytics-toggle">
                    <div>
                        <div class="title">📈 放生数据统计面板</div>
                        <div class="subtitle">基于当前版本算法的收益模型分析</div>
                    </div>
                    <div class="toggle-icon">▼</div>
                </div>
                <div class="analytics-content" id="analytics-body">
                    ${this.renderOverviewTable()}
                    ${this.renderDetailTable()}
                    <div style="font-size: 12px; color: var(--free-muted); margin-top: 10px; text-align: right;">
                        * 数据来源于游戏源码实时计算，仅供参考
                    </div>
                </div>
            `;

            // 插入到页面合适位置 (在 freeFishApp 之前或之后)
            const app = document.getElementById('freeFishApp');
            if (app) {
                app.parentNode.insertBefore(container, app);
            } else {
                // 兜底插入
                const main = document.querySelector('.mainouter');
                if (main) main.appendChild(container);
            }

            // 绑定折叠事件
            this.bindEvents(container);
        }

        bindEvents(container) {
            const header = container.querySelector('#analytics-toggle');
            const body = container.querySelector('#analytics-body');
            const icon = container.querySelector('.toggle-icon');

            // 读取本地存储的状态
            const isExpanded = localStorage.getItem('siqi_analytics_expanded') === 'true';

            const updateState = (expanded) => {
                body.style.display = expanded ? 'block' : 'none';
                icon.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
            };

            // 初始化状态
            updateState(isExpanded);

            header.addEventListener('click', () => {
                const currentDisplay = body.style.display;
                const newState = currentDisplay === 'none';
                updateState(newState);
                localStorage.setItem('siqi_analytics_expanded', newState);
            });
        }
    }

    // 启动脚本
    new FishAnalytics();

})();