// ==UserScript==
// @name         Claude Floating Control Panel
// @name:en         Claude Floating Control Panel
// @namespace    usage-and-quick-settings-of-claude
// @author       Yalums
// @version      1.2
// @description 浮动面板显示Claude的Usage和功能开关
// @description:en  Floating panel to display Claude usage and feature toggles
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/552139/Claude%20Floating%20Control%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/552139/Claude%20Floating%20Control%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FEATURES = [
        { key: 'enabled_monkeys_in_a_barrel', name: 'Code execution', desc: 'Virtual code environment (supports archives)', exclusive: 'enabled_artifacts_attachments' },
        { key: 'enabled_artifacts_attachments', name: 'Repl Tool', desc: 'Additional features for Artifacts', exclusive: 'enabled_monkeys_in_a_barrel' },
        { key: 'enabled_saffron', name: 'Memory', desc: 'Cross-window memory' },
        { key: 'enabled_saffron_search', name: 'Search chats', desc: 'Chat search' },
        { key: 'enabled_sourdough', name: 'Projects', desc: 'Project memory' },
    ];

    let panelState = {
        isExpanded: localStorage.getItem('claudePanel_expanded') !== 'false',
        position: JSON.parse(localStorage.getItem('claudePanel_position') || '{"right":"20px","bottom":"20px"}')
    };

    async function getUserSettings() {
        try {
            const response = await fetch('/api/account', {
                credentials: 'include'
            });
            const data = await response.json();
            return data.settings;
        } catch (err) {
            console.error('[Claude Panel] Failed to fetch settings:', err);
            return null;
        }
    }

    async function toggleFeature(key, currentValue, exclusiveKey = null) {
        try {
            const body = { [key]: !currentValue };

            if (exclusiveKey && !currentValue) {
                body[exclusiveKey] = false;
            }

            const response = await fetch('/api/account/settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                console.error('[Claude Panel] HTTP error:', response.status);
                return { success: false };
            }

            const result = await response.json();
            return { success: true, data: result };
        } catch (err) {
            console.error('[Claude Panel] Toggle failed:', err);
            return { success: false };
        }
    }

    async function getUsageData() {
        try {
            const orgsResponse = await fetch('/api/organizations', {
                credentials: 'include'
            });
            const orgs = await orgsResponse.json();
            const orgId = orgs[0]?.uuid;
            if (!orgId) return null;

            const usageResponse = await fetch(`/api/organizations/${orgId}/usage`, {
                credentials: 'include'
            });
            return await usageResponse.json();
        } catch (err) {
            console.error('[Claude Panel] Failed to fetch usage:', err);
            return null;
        }
    }

    function formatResetTime(isoTime) {
        if (!isoTime) return 'N/A';
        const date = new Date(isoTime);
        const now = new Date();
        const diff = date - now;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Resetting soon';
        if (minutes < 60) return `In ${minutes} min`;
        if (hours < 24) return `In ${hours} hr`;
        return `In ${days} days`;
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #claude-control-panel {
                position: fixed;
                z-index: 9999;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border: 1px solid #404040;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #ffffff;
                max-width: 400px;
                max-height: 90vh;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            #claude-control-panel.collapsed {
                width: 60px !important;
                height: 60px !important;
            }

            .panel-header {
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-bottom: 1px solid #404040;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: move;
                user-select: none;
            }

            .panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .panel-controls {
                display: flex;
                gap: 8px;
            }

            .panel-btn {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 6px;
                width: 28px;
                height: 28px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .panel-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .panel-content {
                max-height: calc(90vh - 60px);
                overflow-y: auto;
                padding: 16px;
            }

            .collapsed .panel-content,
            .collapsed .panel-header h3 span {
                display: none;
            }

            .usage-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
            }

            .usage-item {
                margin-bottom: 16px;
            }

            .usage-item:last-child {
                margin-bottom: 0;
            }

            .usage-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 13px;
            }

            .usage-label-text {
                font-weight: 500;
                color: #e0e0e0;
            }

            .usage-label-time {
                color: #909090;
                font-size: 12px;
            }

            .usage-bar {
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 4px;
            }

            .usage-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
                transition: width 0.3s ease;
            }

            .usage-bar-fill.warning {
                background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
            }

            .usage-bar-fill.danger {
                background: linear-gradient(90deg, #f87171 0%, #ef4444 100%);
            }

            .usage-percent {
                text-align: right;
                font-size: 12px;
                color: #b0b0b0;
            }

            .features-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 16px;
            }

            .section-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
                color: #e0e0e0;
            }

            .feature-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                gap: 24px;
            }

            .feature-item:last-child {
                border-bottom: none;
            }

            .feature-info {
                flex: 1;
                min-width: 0;
            }

            .feature-name {
                font-size: 13px;
                font-weight: 500;
                color: #e0e0e0;
                margin-bottom: 4px;
            }

            .feature-desc {
                font-size: 11px;
                color: #909090;
                line-height: 1.3;
            }

            .feature-toggle {
                padding: 6px 12px;
                border-radius: 6px;
                border: none;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 50px;
                flex-shrink: 0;
            }

            .feature-toggle.on {
                background: #22c55e;
                color: white;
            }

            .feature-toggle.off {
                background: rgba(255, 255, 255, 0.1);
                color: #909090;
            }

            .feature-toggle:hover:not(:disabled) {
                transform: scale(1.05);
            }

            .feature-toggle:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .refresh-btn {
                width: 100%;
                padding: 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: #e0e0e0;
                font-size: 13px;
                cursor: pointer;
                margin-top: 16px;
                transition: all 0.2s;
            }

            .refresh-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .loading {
                text-align: center;
                padding: 20px;
                color: #909090;
                font-size: 13px;
            }

            .panel-content::-webkit-scrollbar {
                width: 6px;
            }

            .panel-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
            }

            .panel-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }

            .panel-content::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'claude-control-panel';
        panel.style.right = panelState.position.right || '20px';
        panel.style.bottom = panelState.position.bottom || '20px';

        if (!panelState.isExpanded) {
            panel.classList.add('collapsed');
        }

        panel.innerHTML = `
            <div class="panel-header">
                <h3>
                    <span>⚡</span>
                    <span>Claude Control Panel</span>
                </h3>
                <div class="panel-controls">
                    <button class="panel-btn" id="toggle-panel" title="Collapse/Expand">
                        ${panelState.isExpanded ? '−' : '+'}
                    </button>
                </div>
            </div>
            <div class="panel-content">
                <div class="loading">Loading...</div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);

        panel.querySelector('#toggle-panel').addEventListener('click', () => {
            panelState.isExpanded = !panelState.isExpanded;
            localStorage.setItem('claudePanel_expanded', panelState.isExpanded);
            panel.classList.toggle('collapsed');
            panel.querySelector('#toggle-panel').textContent = panelState.isExpanded ? '−' : '+';
        });

        return panel;
    }

    async function updatePanelContent(panel) {
        const content = panel.querySelector('.panel-content');

        const [usageData, settings] = await Promise.all([
            getUsageData(),
            getUserSettings()
        ]);

        if (!usageData && !settings) {
            content.innerHTML = '<div class="loading">❌ Failed to load</div>';
            return;
        }

        let html = '';

        if (usageData) {
            html += '<div class="usage-section"><div class="section-title">📊 Usage</div>';

            if (usageData.five_hour) {
                const percent = usageData.five_hour.utilization || 0;
                const barClass = percent > 80 ? 'danger' : percent > 60 ? 'warning' : '';
                html += `
                    <div class="usage-item">
                        <div class="usage-label">
                            <span class="usage-label-text">Current Session</span>
                            <span class="usage-label-time">${formatResetTime(usageData.five_hour.resets_at)}</span>
                        </div>
                        <div class="usage-bar">
                            <div class="usage-bar-fill ${barClass}" style="width: ${percent}%"></div>
                        </div>
                        <div class="usage-percent">${percent}% used</div>
                    </div>
                `;
            }

            if (usageData.seven_day) {
                const percent = usageData.seven_day.utilization || 0;
                const barClass = percent > 80 ? 'danger' : percent > 60 ? 'warning' : '';
                html += `
                    <div class="usage-item">
                        <div class="usage-label">
                            <span class="usage-label-text">Weekly Limit (All Models)</span>
                            <span class="usage-label-time">${formatResetTime(usageData.seven_day.resets_at)}</span>
                        </div>
                        <div class="usage-bar">
                            <div class="usage-bar-fill ${barClass}" style="width: ${percent}%"></div>
                        </div>
                        <div class="usage-percent">${percent}% used</div>
                    </div>
                `;
            }

            if (usageData.seven_day_opus) {
                const percent = usageData.seven_day_opus.utilization || 0;
                const barClass = percent > 80 ? 'danger' : percent > 60 ? 'warning' : '';
                html += `
                    <div class="usage-item">
                        <div class="usage-label">
                            <span class="usage-label-text">Weekly Limit (Opus Only)</span>
                            <span class="usage-label-time">${formatResetTime(usageData.seven_day_opus.resets_at)}</span>
                        </div>
                        <div class="usage-bar">
                            <div class="usage-bar-fill ${barClass}" style="width: ${percent}%"></div>
                        </div>
                        <div class="usage-percent">${percent}% used</div>
                    </div>
                `;
            }

            html += '</div>';
        }

        if (settings) {
            html += '<div class="features-section"><div class="section-title">🔧 Feature Toggles</div>';

            FEATURES.forEach(feature => {
                const isEnabled = settings[feature.key] === true;
                html += `
                    <div class="feature-item">
                        <div class="feature-info">
                            <div class="feature-name">${feature.name}</div>
                            <div class="feature-desc">${feature.desc}</div>
                        </div>
                        <button class="feature-toggle ${isEnabled ? 'on' : 'off'}"
                                data-key="${feature.key}"
                                data-value="${isEnabled}"
                                data-exclusive="${feature.exclusive || ''}">
                            ${isEnabled ? '✓ ON' : 'OFF'}
                        </button>
                    </div>
                `;
            });

            html += '</div>';
        }

        html += '<button class="refresh-btn" id="refresh-panel">🔄 Refresh Data</button>';

        content.innerHTML = html;

        content.querySelectorAll('.feature-toggle').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target;
                const key = button.dataset.key;
                const currentValue = button.dataset.value === 'true';
                const exclusiveKey = button.dataset.exclusive || null;

                button.disabled = true;
                button.textContent = '...';

                const result = await toggleFeature(key, currentValue, exclusiveKey);

                setTimeout(() => updatePanelContent(panel), 300);
            });
        });

        content.querySelector('#refresh-panel')?.addEventListener('click', () => {
            content.querySelector('.loading')?.remove();
            const loading = document.createElement('div');
            loading.className = 'loading';
            loading.textContent = 'Refreshing...';
            content.insertBefore(loading, content.firstChild);

            setTimeout(() => {
                loading.remove();
                updatePanelContent(panel);
            }, 300);
        });
    }

    function makeDraggable(element) {
        const header = element.querySelector('.panel-header');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.panel-btn')) return;

            isDragging = true;
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            element.style.left = currentX + 'px';
            element.style.top = currentY + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                panelState.position = {
                    left: element.style.left,
                    top: element.style.top
                };
                localStorage.setItem('claudePanel_position', JSON.stringify(panelState.position));
            }
        });
    }

    function init() {
        injectStyles();
        const panel = createPanel();
        updatePanelContent(panel);

        setInterval(() => updatePanelContent(panel), 60000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();