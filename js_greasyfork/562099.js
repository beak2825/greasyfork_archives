// ==UserScript==
// @name         Claude 威软监控面板 (WeiRuan Refined)
// @namespace    usage-and-quick-settings-of-claude-weiruan
// @author       Yalums (Modified by Gemini)
// @version      2.0.0
// @description  仿威软监控风格的Claude用量显示与功能开关面板，修复百分比显示错误
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/562099/Claude%20%E5%A8%81%E8%BD%AF%E7%9B%91%E6%8E%A7%E9%9D%A2%E6%9D%BF%20%28WeiRuan%20Refined%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562099/Claude%20%E5%A8%81%E8%BD%AF%E7%9B%91%E6%8E%A7%E9%9D%A2%E6%9D%BF%20%28WeiRuan%20Refined%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const FEATURES = [
        { key: 'enabled_monkeys_in_a_barrel', name: '代码执行 (Code Execution)', desc: '虚拟代码环境', exclusive: 'enabled_artifacts_attachments' },
        { key: 'enabled_artifacts_attachments', name: 'Artifacts 工具', desc: '增强预览功能', exclusive: 'enabled_monkeys_in_a_barrel' },
        { key: 'enabled_saffron', name: '跨对话记忆 (Memory)', desc: '全局记忆功能' },
        { key: 'enabled_saffron_search', name: '搜索历史对话', desc: '聊天记录搜索' },
        { key: 'enabled_sourdough', name: '项目 (Projects)', desc: '项目级上下文' },
    ];

    let panelState = {
        isExpanded: localStorage.getItem('claudePanel_expanded') !== 'false',
        position: JSON.parse(localStorage.getItem('claudePanel_position') || '{"right":"20px","bottom":"20px"}')
    };

    // --- API 交互函数 ---

    async function getUserSettings() {
        try {
            const response = await fetch('/api/account', { credentials: 'include' });
            const data = await response.json();
            return data.settings;
        } catch (err) {
            console.error('[Claude Panel] Get Settings Error:', err);
            return null;
        }
    }

    async function toggleFeature(key, currentValue, exclusiveKey = null) {
        try {
            const body = { [key]: !currentValue };
            if (exclusiveKey && !currentValue) body[exclusiveKey] = false;

            const response = await fetch('/api/account/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)
            });
            return { success: response.ok, data: await response.json() };
        } catch (err) {
            return { success: false };
        }
    }

    async function getUsageData() {
        try {
            const orgsResponse = await fetch('/api/organizations', { credentials: 'include' });
            const orgs = await orgsResponse.json();
            const orgId = orgs[0]?.uuid;
            if (!orgId) return null;

            const usageResponse = await fetch(`/api/organizations/${orgId}/usage`, { credentials: 'include' });
            return await usageResponse.json();
        } catch (err) {
            console.error('[Claude Panel] Get Usage Error:', err);
            return null;
        }
    }

    // --- 工具函数 ---

    function formatTimeRemaining(isoTime) {
        if (!isoTime) return 'N/A';
        const date = new Date(isoTime);
        const now = new Date();
        const diff = date - now;

        if (diff <= 0) return '已重置';

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '即将重置';
        if (minutes < 60) return `${minutes} 分钟后`;
        if (hours < 24) {
             const leftMins = minutes % 60;
             return `${hours}小时 ${leftMins}分`;
        }
        return `${days} 天后`;
    }

    // 核心修复：百分比标准化
    function normalizePercent(val) {
        if (val === undefined || val === null) return 0;
        let p = parseFloat(val);
        // 如果 API 返回的是 0.77 这种小数，转换为 77
        // 如果 API 返回的是 77 这种整数，保持 77
        if (p <= 1 && p > 0) p = p * 100;

        // 强制限制在 0-100 之间，防止 7700% 的情况
        return Math.min(100, Math.max(0, Math.round(p)));
    }

    // --- 样式注入 (复刻截图风格) ---

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #weiruan-panel {
                position: fixed;
                z-index: 9999;
                /* 深色背景 */
                background-color: #161726;
                border: 1px solid #2e324a;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                font-family: "PingFang SC", "Microsoft YaHei", -apple-system, sans-serif;
                color: #ffffff;
                width: 300px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }

            #weiruan-panel.collapsed {
                width: 50px !important;
                height: 50px !important;
                border-radius: 25px;
                overflow: hidden;
            }

            /* 头部风格：紫色渐变 */
            .wr-header {
                padding: 12px 16px;
                background: linear-gradient(90deg, #7c73e6 0%, #a29bfe 100%);
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: move;
                user-select: none;
                height: 50px;
                box-sizing: border-box;
            }

            .wr-header-title {
                font-size: 15px;
                font-weight: 700;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .wr-controls button {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                transition: background 0.2s;
            }

            .wr-controls button:hover {
                background: rgba(255, 255, 255, 0.4);
            }

            .wr-content {
                padding: 12px;
                max-height: 80vh;
                overflow-y: auto;
                background-color: #161726;
            }

            .collapsed .wr-content { display: none; }
            .collapsed .wr-header-title span { display: none; }
            .collapsed .wr-header {
                padding: 0;
                justify-content: center;
                background: #7c73e6;
            }

            /* 卡片通用样式 */
            .wr-card {
                background-color: #1e212b;
                border-radius: 10px;
                padding: 12px;
                margin-bottom: 12px;
                border: 1px solid #2a2e3d;
            }

            .wr-card-title {
                font-size: 13px;
                color: #a0a0b0;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            /* 用量条样式 - 仿截图中的红色条 */
            .usage-item {
                margin-bottom: 12px;
            }
            .usage-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                font-size: 13px;
            }
            .usage-name { color: #e0e0e0; font-weight: 500; }
            .usage-time { color: #757a94; font-size: 12px; }

            .progress-track {
                height: 8px;
                background: #2a2e3d;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
            }

            .progress-fill {
                height: 100%;
                /* 截图中的珊瑚红渐变 */
                background: linear-gradient(90deg, #ff8fa3 0%, #ff6b6b 100%);
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .usage-footer {
                text-align: right;
                font-size: 12px;
                color: #757a94;
                margin-top: 4px;
            }

            /* 开关样式 */
            .feature-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #2a2e3d;
            }
            .feature-row:last-child { border-bottom: none; }

            .feature-text { flex: 1; margin-right: 10px; }
            .feature-name { font-size: 13px; color: #ddd; }
            .feature-desc { font-size: 11px; color: #666; display: block; }

            .switch-btn {
                padding: 4px 10px;
                border-radius: 4px;
                border: none;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 600;
            }
            .switch-on { background: #4ade80; color: #003300; }
            .switch-off { background: #333; color: #888; }

            .refresh-btn {
                width: 100%;
                padding: 8px;
                background: transparent;
                border: 1px dashed #404040;
                color: #666;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: 0.2s;
            }
            .refresh-btn:hover { border-color: #666; color: #888; }

            /* 滚动条 */
            .wr-content::-webkit-scrollbar { width: 4px; }
            .wr-content::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        `;
        document.head.appendChild(style);
    }

    // --- DOM 构建 ---

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'weiruan-panel';
        panel.style.right = panelState.position.right || '20px';
        panel.style.bottom = panelState.position.bottom || '20px';

        // 如果位置是 top/left 模式，修正它
        if(panelState.position.left) {
            panel.style.left = panelState.position.left;
            panel.style.right = 'auto';
        }
        if(panelState.position.top) {
            panel.style.top = panelState.position.top;
            panel.style.bottom = 'auto';
        }

        if (!panelState.isExpanded) panel.classList.add('collapsed');

        panel.innerHTML = `
            <div class="wr-header">
                <div class="wr-header-title">
                    <span>📊</span>
                    <span>威软监控</span>
                </div>
                <div class="wr-controls">
                    <button id="wr-toggle">${panelState.isExpanded ? '–' : '+'}</button>
                </div>
            </div>
            <div class="wr-content">
                <div style="text-align:center; color:#666; padding:20px;">数据加载中...</div>
            </div>
        `;

        document.body.appendChild(panel);

        // 拖拽逻辑
        const header = panel.querySelector('.wr-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            // 转换为 left/top 定位以支持拖拽
            const rect = panel.getBoundingClientRect();
            panel.style.left = rect.left + 'px';
            panel.style.top = rect.top + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';

            startX = e.clientX;
            startY = e.clientY;
            initialLeft = rect.left;
            initialTop = rect.top;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel.style.left = `${initialLeft + dx}px`;
            panel.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
                panelState.position = { left: panel.style.left, top: panel.style.top };
                localStorage.setItem('claudePanel_position', JSON.stringify(panelState.position));
            }
        });

        // 折叠逻辑
        panel.querySelector('#wr-toggle').addEventListener('click', () => {
            panelState.isExpanded = !panelState.isExpanded;
            localStorage.setItem('claudePanel_expanded', panelState.isExpanded);
            panel.classList.toggle('collapsed');
            panel.querySelector('#wr-toggle').textContent = panelState.isExpanded ? '–' : '+';
        });

        return panel;
    }

    async function updatePanelContent(panel) {
        const content = panel.querySelector('.wr-content');
        const [usageData, settings] = await Promise.all([getUsageData(), getUserSettings()]);

        if (!usageData && !settings) {
            content.innerHTML = '<div style="text-align:center; color:#f56c6c;">获取数据失败</div>';
            return;
        }

        let html = '';

        // 1. 实时用量卡片
        if (usageData) {
            html += `<div class="wr-card">
                <div class="wr-card-title">📈 实时用量 (Real-time)</div>`;

            const renderBar = (title, dataObj) => {
                if (!dataObj) return '';
                const percent = normalizePercent(dataObj.utilization);
                const remaining = formatTimeRemaining(dataObj.resets_at);
                // 颜色逻辑：超过80%变红，否则保持珊瑚红
                const fillColor = percent > 90 ? '#ef4444' : 'linear-gradient(90deg, #ff8fa3 0%, #ff6b6b 100%)';

                return `
                <div class="usage-item">
                    <div class="usage-row">
                        <span class="usage-name">${title}</span>
                        <span class="usage-time">${remaining} 重置</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${percent}%; background: ${fillColor}"></div>
                    </div>
                    <div class="usage-footer">${percent}% 已使用</div>
                </div>`;
            };

            html += renderBar('当前会话 (5小时)', usageData.five_hour);
            html += renderBar('周用量 (全模型)', usageData.seven_day);
            if (usageData.seven_day_opus) {
                html += renderBar('Opus 模型限制', usageData.seven_day_opus);
            }
            html += `</div>`;
        }

        // 2. 功能开关卡片
        if (settings) {
            html += `<div class="wr-card">
                <div class="wr-card-title">🛠️ 实验室功能</div>`;

            FEATURES.forEach(f => {
                const isOn = settings[f.key] === true;
                html += `
                <div class="feature-row">
                    <div class="feature-text">
                        <div class="feature-name">${f.name}</div>
                    </div>
                    <button class="switch-btn ${isOn ? 'switch-on' : 'switch-off'}"
                        data-key="${f.key}" data-val="${isOn}" data-ex="${f.exclusive || ''}">
                        ${isOn ? 'ON' : 'OFF'}
                    </button>
                </div>`;
            });
            html += `</div>`;
        }

        // 刷新按钮
        html += `<button class="refresh-btn">点击刷新数据</button>`;

        content.innerHTML = html;

        // 绑定事件
        content.querySelectorAll('.switch-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const el = e.target;
                el.textContent = '...';
                el.disabled = true;
                await toggleFeature(el.dataset.key, el.dataset.val === 'true', el.dataset.ex);
                updatePanelContent(panel);
            });
        });

        content.querySelector('.refresh-btn').addEventListener('click', () => {
            content.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">正在刷新...</div>';
            setTimeout(() => updatePanelContent(panel), 500);
        });
    }

    function init() {
        injectStyles();
        const panel = createPanel();
        updatePanelContent(panel);
        // 每分钟自动刷新一次
        setInterval(() => updatePanelContent(panel), 60000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();