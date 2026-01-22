// ==UserScript==
// @name         GitHub 提交时间高亮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据最后提交时间高亮 GitHub 目录行
// @author       You
// @match        https://github.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563504/GitHub%20%E6%8F%90%E4%BA%A4%E6%97%B6%E9%97%B4%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/563504/GitHub%20%E6%8F%90%E4%BA%A4%E6%97%B6%E9%97%B4%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        thresholds: {
            fresh: 3,      // 月
            stale: 12,
            old: 24
        },
        colors: {
            fresh: 'rgba(46, 160, 67, 0.15)',      // 绿色
            stale: 'rgba(210, 153, 34, 0.15)',     // 黄色
            old: 'rgba(218, 54, 51, 0.15)',        // 红色
            ancient: 'rgba(139, 0, 0, 0.25)'       // 深红色
        }
    };

    // 获取配置
    const getConfig = () => {
        const saved = GM_getValue('config');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    };

    // 保存配置
    const saveConfig = (config) => GM_setValue('config', JSON.stringify(config));

    // 计算月份差
    const getMonthsDiff = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    };

    // 获取颜色
    const getColor = (months, config) => {
        const { thresholds, colors } = config;
        if (months <= thresholds.fresh) return colors.fresh;
        if (months <= thresholds.stale) return colors.stale;
        if (months <= thresholds.old) return colors.old;
        return colors.ancient;
    };

    // 高亮行
    const highlightRows = () => {
        const config = getConfig();

        // 只选择 class 以 DirectoryContent-module__Box_3 开头的行（Latest commit 行）
        const rows = document.querySelectorAll('tbody > tr[class^="DirectoryContent-module__Box_3"]');

        rows.forEach(row => {
            // 如果已经处理过，跳过
            if (row.dataset.ageHighlighted === 'true') return;

            // 在当前行内查找 relative-time 元素
            const timeEl = row.querySelector('relative-time[datetime]');

            if (timeEl) {
                const datetime = timeEl.getAttribute('datetime');
                const months = getMonthsDiff(datetime);
                const color = getColor(months, config);

                // 给 tr 和内部的 td 都设置背景色
                row.style.setProperty('background-color', color, 'important');

                // 给所有 td 也设置背景色，覆盖 GitHub 的 bgColor-muted
                const tds = row.querySelectorAll('td');
                tds.forEach(td => {
                    td.style.setProperty('background-color', color, 'important');
                });

                // 标记已处理
                row.dataset.ageHighlighted = 'true';

                console.log(`[Age Highlighter] ${datetime} → ${months}月 → ${color}`);
            }
        });
    };

    // 防抖函数
    let debounceTimer;
    const debouncedHighlight = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(highlightRows, 300);
    };

    // 创建设置面板
    const createSettingsPanel = () => {
        const config = getConfig();

        const overlay = document.createElement('div');
        overlay.id = 'gh-age-overlay';
        overlay.innerHTML = `
            <style>
                #gh-age-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.5); z-index: 99999;
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(2px);
                }
                #gh-age-panel {
                    background: #ffffff;
                    color: #24292f; padding: 28px 32px;
                    border-radius: 16px; min-width: 480px; max-width: 560px;
                    border: 1px solid #d0d7de;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                }
                #gh-age-panel h2 {
                    margin: 0 0 24px; font-size: 20px; font-weight: 600;
                    color: #24292f; letter-spacing: -0.02em;
                }
                #gh-age-panel h3 {
                    font-size: 14px; font-weight: 600; margin: 24px 0 12px;
                    color: #57606a; text-transform: uppercase; letter-spacing: 0.05em;
                }
                #gh-age-panel label {
                    display: block; margin: 0 0 6px; font-size: 13px;
                    color: #57606a; font-weight: 500;
                }
                #gh-age-panel input[type="number"],
                #gh-age-panel input[type="text"] {
                    width: 100%; padding: 10px 12px; border-radius: 8px;
                    border: 1px solid #d0d7de; background: #f6f8fa; color: #24292f;
                    font-size: 14px; transition: all 0.2s ease;
                    font-family: ui-monospace, monospace;
                }
                #gh-age-panel input[type="number"]:focus,
                #gh-age-panel input[type="text"]:focus {
                    outline: none; border-color: #1f6feb;
                    box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.1);
                    background: #ffffff;
                }
                #gh-age-panel input[type="color"] {
                    width: 50px; height: 42px; cursor: pointer;
                    border-radius: 8px; border: 2px solid #d0d7de;
                    background: transparent; transition: all 0.2s ease;
                }
                #gh-age-panel input[type="color"]:hover {
                    border-color: #1f6feb;
                    transform: scale(1.05);
                }
                #gh-age-panel .row {
                    display: flex; gap: 16px; margin-bottom: 12px;
                }
                #gh-age-panel .row > div { flex: 1; }
                #gh-age-panel .color-input-group {
                    display: flex; gap: 10px; align-items: center;
                }
                #gh-age-panel .buttons {
                    margin-top: 32px; padding-top: 24px;
                    border-top: 1px solid #d0d7de;
                    display: flex; gap: 12px; justify-content: flex-end;
                }
                #gh-age-panel button {
                    padding: 10px 20px; border-radius: 8px; cursor: pointer;
                    border: none; font-size: 14px; font-weight: 600;
                    transition: all 0.2s ease;
                }
                #gh-age-panel button:hover { transform: translateY(-1px); }
                #gh-age-panel button:active { transform: translateY(0); }
                #gh-age-panel .btn-save {
                    background: #238636; color: #fff;
                    box-shadow: 0 2px 8px rgba(35, 134, 54, 0.25);
                }
                #gh-age-panel .btn-save:hover { background: #2ea043; }
                #gh-age-panel .btn-cancel {
                    background: #f6f8fa; color: #24292f;
                    border: 1px solid #d0d7de;
                }
                #gh-age-panel .btn-cancel:hover { background: #e9ecef; }
                #gh-age-panel .btn-reset {
                    background: #da3633; color: #fff;
                    box-shadow: 0 2px 8px rgba(218, 54, 51, 0.25);
                }
                #gh-age-panel .btn-reset:hover { background: #f85149; }
            </style>
            <div id="gh-age-panel">
                <h2>⏱️ GitHub 仓库提交高亮设置</h2>

                <h3 style="font-size:14px; margin-top:16px;">时间阈值（月）</h3>
                <div class="row">
                    <div>
                        <label>新鲜 (≤N月)</label>
                        <input type="number" id="th-fresh" value="${config.thresholds.fresh}" min="1">
                    </div>
                    <div>
                        <label>过期 (≤N月)</label>
                        <input type="number" id="th-stale" value="${config.thresholds.stale}" min="1">
                    </div>
                    <div>
                        <label>老旧 (≤N月)</label>
                        <input type="number" id="th-old" value="${config.thresholds.old}" min="1">
                    </div>
                </div>

                <h3 style="font-size:14px; margin-top:16px;">颜色设置</h3>
                <div class="row">
                    <div>
                        <label>🟢 新鲜</label>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <input type="color" id="color-fresh" value="${rgbaToHex(config.colors.fresh)}" style="width:50px; flex-shrink:0;">
                            <input type="text" id="hex-fresh" value="${rgbaToHex(config.colors.fresh)}" placeholder="#2ea043" style="flex:1; text-transform:uppercase;">
                        </div>
                    </div>
                    <div>
                        <label>🟡 过期</label>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <input type="color" id="color-stale" value="${rgbaToHex(config.colors.stale)}" style="width:50px; flex-shrink:0;">
                            <input type="text" id="hex-stale" value="${rgbaToHex(config.colors.stale)}" placeholder="#d29922" style="flex:1; text-transform:uppercase;">
                        </div>
                    </div>
                </div>
                <div class="row" style="margin-top:8px;">
                    <div>
                        <label>🔴 老旧</label>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <input type="color" id="color-old" value="${rgbaToHex(config.colors.old)}" style="width:50px; flex-shrink:0;">
                            <input type="text" id="hex-old" value="${rgbaToHex(config.colors.old)}" placeholder="#da3633" style="flex:1; text-transform:uppercase;">
                        </div>
                    </div>
                    <div>
                        <label>🟤 远古</label>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <input type="color" id="color-ancient" value="${rgbaToHex(config.colors.ancient)}" style="width:50px; flex-shrink:0;">
                            <input type="text" id="hex-ancient" value="${rgbaToHex(config.colors.ancient)}" placeholder="#8b0000" style="flex:1; text-transform:uppercase;">
                        </div>
                    </div>
                </div>

                <div class="buttons">
                    <button class="btn-reset" id="btn-reset">重置默认</button>
                    <button class="btn-cancel" id="btn-cancel">取消</button>
                    <button class="btn-save" id="btn-save">保存</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 双向绑定：颜色选择器 ↔ 文本框
        const syncColorInputs = (colorId, hexId) => {
            const colorInput = document.getElementById(colorId);
            const hexInput = document.getElementById(hexId);

            // 颜色选择器 → 文本框
            colorInput.addEventListener('input', () => {
                hexInput.value = colorInput.value.toUpperCase();
            });

            // 文本框 → 颜色选择器（带验证）
            hexInput.addEventListener('input', () => {
                const value = hexInput.value.trim();
                // 验证16进制格式
                if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    colorInput.value = value;
                    hexInput.style.borderColor = '#30363d'; // 恢复默认边框
                } else if (value.length >= 7) {
                    hexInput.style.borderColor = '#f85149'; // 红色边框提示错误
                }
            });
        };

        syncColorInputs('color-fresh', 'hex-fresh');
        syncColorInputs('color-stale', 'hex-stale');
        syncColorInputs('color-old', 'hex-old');
        syncColorInputs('color-ancient', 'hex-ancient');

        // 事件绑定
        overlay.querySelector('#btn-cancel').onclick = () => overlay.remove();
        overlay.querySelector('#btn-reset').onclick = () => {
            saveConfig(DEFAULT_CONFIG);
            overlay.remove();
            highlightRows();
        };
        overlay.querySelector('#btn-save').onclick = () => {
            const newConfig = {
                thresholds: {
                    fresh: parseInt(document.getElementById('th-fresh').value),
                    stale: parseInt(document.getElementById('th-stale').value),
                    old: parseInt(document.getElementById('th-old').value)
                },
                colors: {
                    fresh: hexToRgba(document.getElementById('color-fresh').value),
                    stale: hexToRgba(document.getElementById('color-stale').value),
                    old: hexToRgba(document.getElementById('color-old').value),
                    ancient: hexToRgba(document.getElementById('color-ancient').value)
                }
            };
            saveConfig(newConfig);
            overlay.remove();
            highlightRows();
        };

        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    };

    // 颜色转换工具
    const rgbaToHex = (rgba) => {
        const match = rgba.match(/[\d.]+/g);
        if (!match) return '#ffffff';
        const [r, g, b] = match.map(n => Math.round(parseFloat(n)));
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    const hexToRgba = (hex, alpha = 0.15) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // 注册菜单
    GM_registerMenuCommand('⚙️ 设置高亮规则', createSettingsPanel);

    // 监听页面变化（GitHub SPA）- 使用防抖函数避免重复触发
    const observer = new MutationObserver(debouncedHighlight);
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行
    setTimeout(highlightRows, 500);
})();
