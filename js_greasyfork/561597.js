// ==UserScript==
// @name         ChatGPT 公式点击复制
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  复刻 gemini-voyager 逻辑：点击公式复制。支持 LaTeX/UnicodeMath 切换。适配 ChatGPT 深色模式 UI，提示框跟随鼠标。
// @author       Gemini & yueyang
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561597/ChatGPT%20%E5%85%AC%E5%BC%8F%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/561597/ChatGPT%20%E5%85%AC%E5%BC%8F%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. UnicodeMath 转换逻辑 (核心复刻)
    // ==========================================
    function latexToUnicodeMath(latex) {
        if (!latex) return '';
        let result = latex;
        // 简化的符号映射，确保常用公式转换正常
        const symbolMap = { '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\theta': 'θ', '\\infty': '∞', '\\sum': '∑', '\\int': '∫', '\\approx': '≈', '\\neq': '≠', '\\leq': '≤', '\\geq': '≥' };
        for (const [key, val] of Object.entries(symbolMap)) { result = result.split(key).join(val); }
        result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)'); // 分数
        result = result.replace(/\\sqrt\{([^}]+)\}/g, '√($1)'); // 根号
        result = result.replace(/\\left|\\right/g, ''); // 移除修饰符
        return result.replace(/\s+/g, ' ').trim();
    }

    // ==========================================
    // 2. 样式注入 (适配深色模式 & 鼠标跟随)
    // ==========================================
    GM_addStyle(`
        /* 1. 公式交互样式 */
        .katex { cursor: pointer !important; transition: opacity 0.2s; }
        .katex:hover { opacity: 0.7; }

        /* 2. Toast 提示框 (仿 ChatGPT 原生黑色 Tooltip) */
        .gv-copy-toast {
            position: fixed;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-family: Söhne, ui-sans-serif, system-ui, -apple-system, sans-serif;
            font-weight: 400;
            color: #ffffff;
            background-color: rgba(0, 0, 0, 0.8); /* 深色背景 */
            backdrop-filter: blur(4px);
            z-index: 99999;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, -10px); /* 默认向上偏移一点 */
            transition: opacity 0.2s ease, transform 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            white-space: nowrap;
        }

        /* 显示状态 */
        .gv-copy-toast-show {
            opacity: 1;
            transform: translate(-50%, -30px); /* 浮起动画 */
        }

        /* 3. 设置面板 (适配 Light/Dark Mode) */
        #gv-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 10000; display: none;
        }

        #gv-config-panel {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 320px; padding: 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            display: none;
            font-family: Söhne, ui-sans-serif, system-ui, sans-serif;
            /* 默认浅色模式颜色 */
            background: #ffffff;
            color: #202123;
            border: 1px solid #e5e5e5;
        }

        /* 深色模式适配 (ChatGPT 网页通常会在 html 或 body 加 .dark 类) */
        .dark #gv-config-panel {
            background: #202123;
            color: #ececf1;
            border: 1px solid #565869;
        }

        .gv-config-header { font-size: 18px; font-weight: 600; margin-bottom: 20px; }

        .gv-config-item { margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }

        .gv-config-label { font-size: 14px; font-weight: 500; opacity: 0.9; }

        .gv-config-select {
            padding: 8px 12px; border-radius: 6px; outline: none; appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23888%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat; background-position: right 10px center; background-size: 10px;
            border: 1px solid #ccc;
            background-color: #fff;
            color: #333;
        }

        /* 深色模式下拉框 */
        .dark .gv-config-select {
            background-color: #40414f;
            border-color: #565869;
            color: #ececf1;
        }

        .gv-config-btn {
            width: 100%; padding: 10px; margin-top: 10px;
            background: #10a37f; color: white; border: none; border-radius: 6px;
            cursor: pointer; font-weight: 500; transition: background 0.2s;
        }
        .gv-config-btn:hover { background: #0d8a6b; }
    `);

    // ==========================================
    // 3. 配置管理
    // ==========================================
    const Settings = {
        get format() { return GM_getValue('formula_format', 'latex'); },
        set format(val) { GM_setValue('formula_format', val); },
        toastDuration: 1500, // 提示框停留时间
        toastOffsetY: 40     // 提示框距离鼠标的高度 (gemini-voyager 默认 40)
    };

    // ==========================================
    // 4. FormulaCopyService 类
    // ==========================================
    class FormulaCopyService {
        constructor() {
            this.toast = this.createToast();
            this.panel = this.createConfigPanel();
            this.init();
        }

        init() {
            // 全局点击监听
            document.addEventListener('click', (e) => {
                // 查找最近的 KaTeX 节点
                const mathEl = e.target.closest('.katex');
                if (mathEl) {
                    this.handleMathClick(e, mathEl);
                }
            }, true);

            // 注册菜单
            GM_registerMenuCommand("⚙️ 公式复制设置", () => this.togglePanel(true));
        }

        handleMathClick(e, el) {
            // 提取公式源码
            const annotation = el.querySelector('annotation');
            const rawSource = annotation ? annotation.textContent : "";

            if (!rawSource) return;

            const isBlock = el.classList.contains('katex-display');
            const format = Settings.format;
            let finalOutput = rawSource;

            // 格式处理
            if (format === 'unicodemath') {
                finalOutput = latexToUnicodeMath(rawSource);
            } else if (format === 'latex') {
                finalOutput = isBlock ? `$$${rawSource}$$` : `$${rawSource}$`;
            }

            // 执行复制
            GM_setClipboard(finalOutput);

            // 显示 Toast (传入鼠标坐标 e.clientX, e.clientY)
            this.showToast("已复制", e.clientX, e.clientY);

            // 阻止冒泡
            e.stopPropagation();
            e.preventDefault();
        }

        createToast() {
            const div = document.createElement('div');
            div.className = 'gv-copy-toast';
            document.body.appendChild(div);
            return div;
        }

        /**
         * 显示 Toast
         * @param {string} msg 消息内容
         * @param {number} x 鼠标 X 坐标
         * @param {number} y 鼠标 Y 坐标
         */
        showToast(msg, x, y) {
            this.toast.textContent = msg;

            // 设置位置跟随鼠标 (gemini-voyager 逻辑)
            this.toast.style.left = `${x}px`;
            this.toast.style.top = `${y}px`; // 具体偏移由 CSS transform 控制

            // 显示动画
            this.toast.classList.add('gv-copy-toast-show');

            // 清除旧定时器
            if (this.timer) clearTimeout(this.timer);

            // 定时隐藏
            this.timer = setTimeout(() => {
                this.toast.classList.remove('gv-copy-toast-show');
            }, Settings.toastDuration);
        }

        createConfigPanel() {
            const overlay = document.createElement('div');
            overlay.id = 'gv-overlay';

            const panel = document.createElement('div');
            panel.id = 'gv-config-panel';
            panel.innerHTML = `
                <div class="gv-config-header">公式复制设置</div>
                <div class="gv-config-item">
                    <label class="gv-config-label">复制格式</label>
                    <select id="gv-format-select" class="gv-config-select">
                        <option value="latex">LaTeX (Standard)</option>
                        <option value="unicodemath">UnicodeMath (Word)</option>
                        <option value="no-dollar">纯文本 (No $)</option>
                    </select>
                </div>
                <button class="gv-config-btn" id="gv-save-btn">保存设置</button>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(panel);

            // 绑定事件
            const saveBtn = document.getElementById('gv-save-btn');
            const select = document.getElementById('gv-format-select');

            saveBtn.onclick = () => {
                Settings.format = select.value;
                this.togglePanel(false);
                // 保存后在按钮中心显示一个反馈
                const rect = saveBtn.getBoundingClientRect();
                this.showToast("设置已保存", rect.left + rect.width/2, rect.top);
            };

            overlay.onclick = () => this.togglePanel(false);

            return { panel, overlay, select };
        }

        togglePanel(show) {
            if (show) {
                // 打开时同步当前设置到 UI
                this.panel.select.value = Settings.format;
                this.panel.panel.style.display = 'block';
                this.panel.overlay.style.display = 'block';
            } else {
                this.panel.panel.style.display = 'none';
                this.panel.overlay.style.display = 'none';
            }
        }
    }

    // 启动
    new FormulaCopyService();
})();