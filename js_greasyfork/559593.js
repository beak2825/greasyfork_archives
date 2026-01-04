// ==UserScript==
// @name         Gemini HTML Previewer
// @namespace    http://tampermonkey.net/
// @version      8.6
// @description  为 Gemini 代码块添加折叠、下载按钮，HTML/SVG 添加智能预览
// @author       Claude
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559593/Gemini%20HTML%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/559593/Gemini%20HTML%20Previewer.meta.js
// ==/UserScript==

/**
 * MIT License
 *
 * Copyright (c) 2025
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    Gemini HTML Previewer - 技术报告                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * 📋 项目概述
 * ──────────────────────────────────────────────────────────────────────────────
 * 本脚本为 Google Gemini (gemini.google.com) 网页版添加 HTML/SVG 代码块预览功能。
 * 由于 Gemini 原生不支持直接预览 HTML/SVG 代码的运行效果，用户需要手动复制代码到
 * 本地文件或在线工具中查看。本脚本解决了这一痛点，实现一键预览。
 *
 *
 * 🎯 功能特性
 * ──────────────────────────────────────────────────────────────────────────────
 * 1. 自动检测 HTML/SVG 代码块，在工具栏添加"预览"按钮（眼睛图标）
 * 2. 点击按钮后在屏幕右侧打开预览弹窗（占 50% 宽度）
 * 3. 弹窗完全独立于父页面，不受 CSP 限制
 * 4. 支持 ESC 键快速关闭弹窗（如果弹窗获得焦点）
 * 5. 深色主题 SVG 预览背景，与 Gemini 界面风格一致
 * 6. SVG 代码自动包装为完整 HTML 文档进行预览
 * 7. 弹窗被阻止时自动降级为新标签页打开
 *
 *
 * 🔧 技术实现
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * [DOM 结构分析]
 * Gemini 代码块的 DOM 结构如下：
 *
 *   .code-block
 *   ├── .code-block-decoration (头部工具栏)
 *   │   ├── span (语言标签，如 "HTML")
 *   │   └── .buttons (按钮容器)
 *   │       └── button[aria-label="复制代码"] (复制按钮)
 *   └── .formatted-code-block-internal-container
 *       └── pre
 *           └── code (代码内容)
 *
 * [按钮定位策略]
 * - 方法1: 通过 aria-label="复制代码" 定位复制按钮，向上查找 .code-block 容器
 * - 方法2: 直接查找 .code-block 容器，在其中定位 .code-block-decoration 头部
 * - 两种方法互为备用，确保在不同页面结构下都能正常工作
 *
 * [HTML/SVG 代码识别]
 * 通过以下特征判断代码块是否为 HTML：
 * - 包含 <!doctype html 声明
 * - 包含 <html 标签
 * - 同时包含 <head> 和 <body> 标签
 * - 同时包含 <style> 和 </div> 标签
 * - 同时包含 <div 和 class= 属性
 *
 * 通过以下特征判断代码块是否为 SVG：
 * - 包含 <svg 标签
 * - 包含 xmlns="http://www.w3.org/2000/svg" 命名空间声明
 *
 * [Trusted Types 安全策略]
 * Gemini 启用了 Trusted Types 安全策略，禁止直接使用 innerHTML。
 * 解决方案：使用 document.createElementNS() DOM API 创建 SVG 图标元素。
 *
 * [预览实现]
 * - 使用 window.open() 打开独立弹窗
 * - 弹窗位于屏幕右侧，宽度 50%，高度 100%
 * - 通过 document.write() 直接写入 HTML 内容
 * - 弹窗拥有完全独立的浏览上下文，不继承父页面 CSP
 * - 如果弹窗被阻止，降级使用 Blob URL 在新标签页打开
 *
 *
 * 📜 版本历史
 * ──────────────────────────────────────────────────────────────────────────────
 * v8.6 (2025-12-20)
 *   - 优化预览图标提示：当代码块包含 JS 脚本且强制显示侧边栏预览时，
 *     预览图标显示为柔和的红色 (#f28b82)，提示用户 JS 功能在侧边栏中受限。
 *
 * v7.6 (2025-12-20)
 *   - 彻底解决 CSP 限制：改用下载文件方式
 *   - 点击预览按钮后下载 HTML 文件到本地
 *   - 用户用浏览器打开下载的文件即可预览
 *   - 本地文件不受任何网站 CSP 限制，脚本和交互完全正常
 *
 * v7.5 (2025-12-20)
 *   - 彻底解决 CSP 限制问题
 *   - 改用 window.open() 弹出窗口方式，完全独立于父页面
 *   - 弹窗使用 document.write() 直接写入内容，不受任何 CSP 限制
 *   - 弹窗位于屏幕右侧，占 50% 宽度，模拟侧边栏效果
 *   - 移除不再需要的 iframe 相关代码和样式
 *
 * v7.4 (2025-12-20)
 *   - 使用 sandbox 属性（不含 allow-same-origin）让 iframe 获得独立源
 *   - 独立源不继承父页面 CSP，内联脚本和事件处理器可正常执行
 *   - 恢复使用 Blob URL（CSP frame-src 允许 blob:）
 *
 * v7.3 (2025-12-20)
 *   - 修复 Trusted Types 阻止 srcdoc 赋值的问题
 *   - 改用 data URL 方式加载 iframe，完全绕过安全限制
 *
 * v7.2 (2025-12-20)
 *   - 修复 CSP 策略导致 SVG/HTML 交互失效的问题
 *   - 改用 iframe.srcdoc 替代 Blob URL，绕过父页面 CSP 限制
 *   - 优化 Blob URL 内存管理
 *
 * v7.1 (2025-12-20)
 *   - 新增 SVG 代码预览支持
 *   - SVG 代码自动包装为完整 HTML 文档
 *   - 修正版本历史年份
 *
 * v7.0 (2025-12-20)
 *   - 新增右侧预览面板功能，替代新标签页打开
 *   - 面板支持拖拽调整宽度
 *   - 添加滑入/滑出动画效果
 *   - 支持 ESC 键关闭面板
 *   - 保留"在新标签页打开"选项
 *
 * v6.1 (2025-12-20)
 *   - 修复 Trusted Types 错误，改用 DOM API 创建 SVG
 *   - 优化按钮样式，与 Gemini 原生风格一致
 *
 * v6.0 (2025-12-20)
 *   - 修复按钮选择器，使用 aria-label 属性定位
 *   - 修复 DOM 结构遍历逻辑
 *
 * v5.0 (2025-12-20)
 *   - 初始版本，基于 Gemini 分享页面分析实现
 *   - 使用 MutationObserver 监听动态内容
 *
 *
 * 🐛 已解决的问题
 * ──────────────────────────────────────────────────────────────────────────────
 * 1. [按钮不显示] 原因：选择器使用 textContent 查找"复制代码"，但实际按钮使用
 *    aria-label 属性。解决：改用 button[aria-label="复制代码"] 选择器。
 *
 * 2. [DOM 结构错误] 原因：假设 pre.previousElementSibling 是工具栏，但实际
 *    pre 被多层容器包裹。解决：使用 closest('.code-block') 向上查找容器。
 *
 * 3. [Trusted Types 错误] 错误信息：Failed to set the 'innerHTML' property
 *    on 'Element': This document requires 'TrustedHTML' assignment.
 *    解决：使用 createElementNS() 创建 SVG 元素替代 innerHTML。
 *
 * 4. [样式不协调] 原因：按钮样式与 Gemini 原生风格不一致。
 *    解决：分析 Gemini 按钮样式，使用相同的颜色、圆角、过渡效果。
 *
 * 5. [CSP 阻止 iframe 内脚本执行] 原因：Gemini 的 CSP 策略非常严格，
 *    禁止 iframe 中执行内联脚本和事件处理器，即使使用 Blob URL、data URL
 *    或 sandbox 属性都无法绕过。
 *    解决：改用 window.open() 弹出窗口，创建完全独立的浏览上下文，
 *    不继承父页面的任何安全策略。
 *
 *
 * 📁 文件结构
 * ──────────────────────────────────────────────────────────────────────────────
 * gemini-html-previewer.user.js
 * ├── GM_addStyle()          - 注入 CSS 样式
 * ├── createEyeIcon()        - 创建预览按钮图标 (SVG)
 * ├── isHtmlCode()           - HTML 代码检测
 * ├── isSvgCode()            - SVG 代码检测
 * ├── wrapSvgAsHtml()        - 将 SVG 包装为完整 HTML 文档
 * ├── isPreviewableCode()    - 检查代码是否可预览
 * ├── getPreviewContent()    - 获取预览内容
 * ├── closePreviewWindow()   - 关闭预览弹窗
 * ├── previewHtml()          - 在弹窗中预览 HTML
 * ├── createPreviewButton()  - 创建预览按钮元素
 * ├── processCodeBlocks()    - 扫描并处理代码块
 * └── MutationObserver       - 监听 DOM 变化
 *
 *
 * 💡 使用说明
 * ──────────────────────────────────────────────────────────────────────────────
 * 1. 安装 Tampermonkey 浏览器扩展
 * 2. 创建新脚本，粘贴本代码并保存
 * 3. 访问 gemini.google.com，HTML/SVG 代码块右上角将显示预览按钮
 * 4. 点击按钮即可在右侧弹窗中预览效果
 * 5. 如果弹窗被阻止，请允许该网站弹窗或使用新标签页打开
 *
 *
 * ⚠️ 注意事项
 * ──────────────────────────────────────────────────────────────────────────────
 * - 本脚本仅在 gemini.google.com 域名下生效
 * - 预览使用 Blob URL，不会将代码上传到任何服务器
 * - 如果 Google 更新 Gemini 前端结构，可能需要更新脚本
 * - 部分复杂 HTML（如需要外部资源）可能无法完美渲染
 *
 *
 * 📊 兼容性
 * ──────────────────────────────────────────────────────────────────────────────
 * - Chrome 88+ ✓
 * - Firefox 85+ ✓
 * - Edge 88+ ✓
 * - Safari 14+ ✓ (需安装 Userscripts 扩展)
 *
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // 设置管理
    // ═══════════════════════════════════════════════════════════════════════

    const DEFAULT_SETTINGS = {
        // 按钮开关
        enablePreview: true,      // 启用预览按钮
        enableDownload: true,     // 启用下载按钮
        enableCollapse: true,     // 启用折叠按钮

        // 强制显示
        forcePreview: false       // 强制侧边栏预览（含 JS 时功能会缺失）
    };

    // 加载设置
    function loadSettings() {
        const saved = GM_getValue('settings', null);
        if (saved) {
            return { ...DEFAULT_SETTINGS, ...saved };
        }
        return { ...DEFAULT_SETTINGS };
    }

    // 保存设置
    function saveSettings(settings) {
        GM_setValue('settings', settings);
    }

    // 当前设置
    let settings = loadSettings();

    // 切换设置
    function toggleSetting(key) {
        settings[key] = !settings[key];
        saveSettings(settings);
        // 刷新页面以应用新设置
        location.reload();
    }

    // 注册菜单命令
    function registerMenuCommands() {
        const checkMark = '✓ ';
        const noMark = '✗ ';

        // 按钮开关
        GM_registerMenuCommand(
            (settings.enablePreview ? checkMark : noMark) + '预览按钮',
            () => toggleSetting('enablePreview')
        );
        GM_registerMenuCommand(
            (settings.enableDownload ? checkMark : noMark) + '下载按钮',
            () => toggleSetting('enableDownload')
        );
        GM_registerMenuCommand(
            (settings.enableCollapse ? checkMark : noMark) + '折叠按钮',
            () => toggleSetting('enableCollapse')
        );

        // 分隔线
        GM_registerMenuCommand('──────────', () => {});

        // 强制预览选项
        GM_registerMenuCommand(
            (settings.forcePreview ? checkMark : noMark) + '强制侧边栏预览（含JS时功能缺失）',
            () => toggleSetting('forcePreview')
        );
    }

    registerMenuCommands();

    // ═══════════════════════════════════════════════════════════════════════
    // 样式注入 - 预览按钮和面板样式
    // ═══════════════════════════════════════════════════════════════════════
    GM_addStyle(`
        .gm-preview-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: transparent;
            color: #8ab4f8;
            font-size: 13px;
            font-family: "Google Sans", Roboto, sans-serif;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-left: 4px;
        }
        .gm-preview-btn:hover {
            background-color: rgba(138, 180, 248, 0.15);
        }
        .gm-preview-btn svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        /* 预览面板样式 */
        .gm-preview-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            background: #202124;
            border-left: 1px solid #3c4043;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            box-shadow: -4px 0 20px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        .gm-preview-panel.open {
            transform: translateX(0);
        }
        .gm-preview-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px;
            background: #292a2d;
            border-bottom: 1px solid #3c4043;
        }
        .gm-preview-panel-title {
            color: #e8eaed;
            font-size: 14px;
            font-family: "Google Sans", Roboto, sans-serif;
        }
        .gm-preview-panel-actions {
            display: flex;
            gap: 8px;
        }
        .gm-preview-panel-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: transparent;
            color: #9aa0a6;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .gm-preview-panel-btn:hover {
            background: rgba(255,255,255,0.1);
            color: #e8eaed;
        }
        .gm-preview-panel-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }
        .gm-preview-panel iframe {
            flex: 1;
            border: none;
            background: #fff;
        }
        .gm-preview-panel-resizer {
            position: absolute;
            left: 0;
            top: 0;
            width: 6px;
            height: 100%;
            cursor: ew-resize;
            background: transparent;
        }
        .gm-preview-panel-resizer:hover {
            background: rgba(138, 180, 248, 0.3);
        }

        /* 折叠状态样式 */
        .code-block.gm-collapsed .formatted-code-block-internal-container {
            display: none !important;
        }
        .code-block.gm-collapsed pre {
            display: none !important;
        }
        .gm-collapse-btn svg {
            transition: transform 0.2s ease;
        }
        .code-block.gm-collapsed .gm-collapse-btn svg {
            transform: rotate(-90deg);
        }
    `);

    // ═══════════════════════════════════════════════════════════════════════
    // SVG 图标创建函数 - 使用 DOM API 避免 Trusted Types 问题
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * 创建预览按钮的眼睛图标
     * @returns {SVGElement} SVG 元素
     */
    function createEyeIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z');
        path.setAttribute('fill', 'currentColor');

        svg.appendChild(path);
        return svg;
    }

    /**
     * 创建新标签页图标
     * @returns {SVGElement} SVG 元素
     */
    function createNewTabIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z');
        path.setAttribute('fill', 'currentColor');

        svg.appendChild(path);
        return svg;
    }

    /**
     * 创建关闭图标
     * @returns {SVGElement} SVG 元素
     */
    function createCloseIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '18');
        svg.setAttribute('height', '18');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        path.setAttribute('fill', 'currentColor');

        svg.appendChild(path);
        return svg;
    }

    /**
     * 创建下载图标
     * @returns {SVGElement} SVG 元素
     */
    function createDownloadIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z');
        path.setAttribute('fill', 'currentColor');

        svg.appendChild(path);
        return svg;
    }

    /**
     * 创建折叠图标（向下箭头）
     * @returns {SVGElement} SVG 元素
     */
    function createCollapseIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z');
        path.setAttribute('fill', 'currentColor');

        svg.appendChild(path);
        return svg;
    }

    /**
     * 创建展开图标（向右箭头）
     * @returns {SVGElement} SVG 元素
     */
    function createExpandIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z');
        path.setAttribute('fill', 'currentColor');

        svg.appendChild(path);
        return svg;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HTML/SVG 代码检测
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * 检查文本内容是否为 HTML 代码
     * @param {string} text - 要检查的文本
     * @returns {boolean} 是否为 HTML 代码
     */
    function isHtmlCode(text) {
        if (!text) return false;
        const trimmed = text.trim();
        const lower = trimmed.toLowerCase();

        // 必须以 HTML 标签或 DOCTYPE 开头才算 HTML
        // 这样可以避免 JS 代码中的字符串被误识别
        const startsWithHtml = /^<!doctype\s+html/i.test(trimmed) ||
                               /^<html[\s>]/i.test(trimmed) ||
                               /^<head[\s>]/i.test(trimmed) ||
                               /^<body[\s>]/i.test(trimmed) ||
                               /^<div[\s>]/i.test(trimmed) ||
                               /^<span[\s>]/i.test(trimmed) ||
                               /^<p[\s>]/i.test(trimmed) ||
                               /^<h[1-6][\s>]/i.test(trimmed) ||
                               /^<style[\s>]/i.test(trimmed) ||
                               /^<link[\s>]/i.test(trimmed) ||
                               /^<meta[\s>]/i.test(trimmed) ||
                               /^<!--/i.test(trimmed);

        if (startsWithHtml) return true;

        // 包含完整的 HTML 结构
        if (lower.includes('<!doctype html') ||
            (lower.includes('<head>') && lower.includes('<body>'))) {
            return true;
        }

        return false;
    }

    /**
     * 检查文本内容是否为 SVG 代码
     * @param {string} text - 要检查的文本
     * @returns {boolean} 是否为 SVG 代码
     */
    function isSvgCode(text) {
        if (!text) return false;
        const trimmed = text.trim();

        // 必须以 <svg 或 <?xml 开头
        if (/^<svg[\s>]/i.test(trimmed) ||
            /^<\?xml/i.test(trimmed)) {
            return trimmed.toLowerCase().includes('</svg>');
        }

        return false;
    }

    /**
     * 将 SVG 代码包装为完整的 HTML 文档
     * @param {string} svgCode - SVG 代码
     * @returns {string} 完整的 HTML 文档
     */
    function wrapSvgAsHtml(svgCode) {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG 预览</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
            width: 100%;
            height: 100%;
        }
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #1a1a2e;
            background-image:
                linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
            background-size: 20px 20px;
            padding: 20px;
        }
        .svg-container {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: 100%;
            max-height: 90vh;
        }
        .svg-container > svg {
            max-width: 100%;
            max-height: 90vh;
            filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));
        }
    </style>
</head>
<body>
<div class="svg-container">
${svgCode}
</div>
<script>
// 确保 SVG 交互事件正常工作
document.querySelectorAll('svg').forEach(svg => {
    // 确保 SVG 可以接收指针事件
    svg.style.pointerEvents = 'auto';

    // 如果 SVG 没有设置尺寸，尝试自适应
    if (!svg.hasAttribute('width') && !svg.hasAttribute('height')) {
        const viewBox = svg.getAttribute('viewBox');
        if (viewBox) {
            const parts = viewBox.split(/[\\s,]+/);
            if (parts.length === 4) {
                const w = parseFloat(parts[2]);
                const h = parseFloat(parts[3]);
                if (w && h) {
                    svg.style.width = Math.min(w, window.innerWidth - 40) + 'px';
                    svg.style.aspectRatio = w + '/' + h;
                }
            }
        }
    }
});
</script>
</body>
</html>`;
    }

    /**
     * 检查代码是否可预览（HTML 或 SVG）
     * @param {string} text - 要检查的文本
     * @returns {boolean} 是否可预览
     */
    function isPreviewableCode(text) {
        return isHtmlCode(text) || isSvgCode(text);
    }

    /**
     * 检查代码是否包含 JavaScript（需要完整交互）
     * @param {string} text - 要检查的文本
     * @returns {boolean} 是否包含 JS
     */
    function hasJavaScript(text) {
        if (!text) return false;
        const lower = text.toLowerCase();

        // 检查 <script> 标签
        if (/<script[\s>]/i.test(text)) return true;

        // 检查内联事件处理器
        const eventHandlers = [
            'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover',
            'onmouseout', 'onmousemove', 'onmouseenter', 'onmouseleave',
            'onkeydown', 'onkeyup', 'onkeypress',
            'onfocus', 'onblur', 'onchange', 'oninput', 'onsubmit', 'onreset',
            'onload', 'onerror', 'onresize', 'onscroll',
            'ontouchstart', 'ontouchmove', 'ontouchend',
            'onanimationstart', 'onanimationend', 'ontransitionend'
        ];

        for (const handler of eventHandlers) {
            // 匹配 onclick="..." 或 onclick='...'
            if (new RegExp(handler + '\\s*=\\s*["\']', 'i').test(text)) {
                return true;
            }
        }

        // 检查 javascript: 协议
        if (/javascript\s*:/i.test(text)) return true;

        return false;
    }

    /**
     * 获取预览内容（SVG 需要包装，HTML 直接返回）
     * @param {string} text - 代码内容
     * @returns {string} 可预览的 HTML 内容
     */
    function getPreviewContent(text) {
        if (isSvgCode(text) && !isHtmlCode(text)) {
            return wrapSvgAsHtml(text);
        }
        return text;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 预览面板管理
    // ═══════════════════════════════════════════════════════════════════════

    let currentPanel = null;
    let currentBlobUrl = null;

    /**
     * 关闭预览面板
     */
    function closePanel() {
        if (currentPanel) {
            currentPanel.classList.remove('open');
            setTimeout(() => {
                if (currentPanel && currentPanel.parentNode) {
                    currentPanel.parentNode.removeChild(currentPanel);
                }
                currentPanel = null;
            }, 300);
        }
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
            currentBlobUrl = null;
        }
    }

    /**
     * 在侧边面板中预览（iframe，CSS 动画可用，JS 不可用）
     * @param {string} htmlContent - HTML 内容
     * @param {string} title - 标题
     */
    function previewInPanel(htmlContent, title) {
        closePanel();

        // 创建 Blob URL
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        currentBlobUrl = URL.createObjectURL(blob);

        // 创建面板
        const panel = document.createElement('div');
        panel.className = 'gm-preview-panel';

        // 创建头部
        const header = document.createElement('div');
        header.className = 'gm-preview-panel-header';

        const titleEl = document.createElement('span');
        titleEl.className = 'gm-preview-panel-title';
        titleEl.textContent = title + ' (CSS 预览)';

        const actions = document.createElement('div');
        actions.className = 'gm-preview-panel-actions';

        // 新标签页按钮
        const newTabBtn = document.createElement('button');
        newTabBtn.className = 'gm-preview-panel-btn';
        newTabBtn.title = '在新标签页打开（完整交互）';
        newTabBtn.appendChild(createNewTabIcon());
        newTabBtn.onclick = () => previewInNewTab(htmlContent);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'gm-preview-panel-btn';
        closeBtn.title = '关闭';
        closeBtn.appendChild(createCloseIcon());
        closeBtn.onclick = closePanel;

        actions.appendChild(newTabBtn);
        actions.appendChild(closeBtn);
        header.appendChild(titleEl);
        header.appendChild(actions);

        // 创建 iframe
        const iframe = document.createElement('iframe');
        iframe.src = currentBlobUrl;
        iframe.sandbox = 'allow-scripts allow-same-origin';

        // 创建拖拽调整器
        const resizer = document.createElement('div');
        resizer.className = 'gm-preview-panel-resizer';
        resizer.onmousedown = (e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = panel.offsetWidth;
            const onMove = (e) => {
                const newWidth = startWidth - (e.clientX - startX);
                panel.style.width = Math.max(300, Math.min(newWidth, window.innerWidth * 0.8)) + 'px';
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        };

        panel.appendChild(resizer);
        panel.appendChild(header);
        panel.appendChild(iframe);
        document.body.appendChild(panel);

        currentPanel = panel;

        // 动画打开
        requestAnimationFrame(() => {
            panel.classList.add('open');
        });
    }

    /**
     * 在新标签页预览（完整 JS 交互）
     * @param {string} htmlContent - HTML 内容
     */
    function previewInNewTab(htmlContent) {
        const base64 = btoa(unescape(encodeURIComponent(htmlContent)));
        const dataUrl = `data:text/html;base64,${base64}`;

        try {
            GM_openInTab(dataUrl, { active: true, insert: true, setParent: true });
        } catch (e) {
            window.open(dataUrl, '_blank');
        }
    }

    // ESC 键关闭面板
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentPanel) {
            closePanel();
        }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // 预览按钮创建
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * 创建侧边栏预览按钮
     * @param {string} codeContent - 代码内容
     * @param {boolean} hasJs - 是否包含 JS
     * @returns {HTMLElement} 按钮
     */
    function createSidebarPreviewButton(codeContent, hasJs) {
        const isSvg = isSvgCode(codeContent) && !isHtmlCode(codeContent);
        const typeText = isSvg ? 'SVG' : 'HTML';

        const btn = document.createElement('button');
        btn.className = 'gm-preview-btn mdc-icon-button';
        btn.appendChild(createEyeIcon());

        if (hasJs) {
            btn.title = `预览 ${typeText}（侧边栏，JS 功能将缺失）`;
            btn.style.color = '#f28b82'; // 红色提示 JS 受限
        } else {
            btn.title = `预览 ${typeText}（侧边栏）`;
        }
        btn.setAttribute('aria-label', `预览 ${typeText}`);
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const content = getPreviewContent(codeContent);
            previewInPanel(content, typeText + ' 预览');
        };

        return btn;
    }

    /**
     * 创建新标签页预览按钮
     * @param {string} codeContent - 代码内容
     * @returns {HTMLElement} 按钮
     */
    function createNewTabPreviewButton(codeContent) {
        const isSvg = isSvgCode(codeContent) && !isHtmlCode(codeContent);
        const typeText = isSvg ? 'SVG' : 'HTML';

        const btn = document.createElement('button');
        btn.className = 'gm-preview-btn mdc-icon-button';
        btn.appendChild(createNewTabIcon());
        btn.title = `预览 ${typeText}（新标签页，完整功能）`;
        btn.setAttribute('aria-label', `新标签页预览 ${typeText}`);
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const content = getPreviewContent(codeContent);
            previewInNewTab(content);
        };

        return btn;
    }

    /**
     * 创建预览按钮（根据设置和内容自动选择）
     * @param {string} codeContent - 代码内容
     * @returns {DocumentFragment} 按钮片段
     */
    function createPreviewButtons(codeContent) {
        const needsJs = hasJavaScript(codeContent);
        const fragment = document.createDocumentFragment();

        if (settings.forcePreview) {
            // 强制预览：总是显示侧边栏按钮
            fragment.appendChild(createSidebarPreviewButton(codeContent, needsJs));
            // 如果有 JS，额外显示新标签页按钮
            if (needsJs) {
                fragment.appendChild(createNewTabPreviewButton(codeContent));
            }
        } else {
            // 自动模式：有 JS 用新标签页，无 JS 用侧边栏
            if (needsJs) {
                fragment.appendChild(createNewTabPreviewButton(codeContent));
            } else {
                fragment.appendChild(createSidebarPreviewButton(codeContent, false));
            }
        }

        return fragment;
    }

    /**
     * 获取代码的文件扩展名
     * @param {string} codeContent - 代码内容
     * @param {string} langLabel - 语言标签
     * @returns {string} 文件扩展名
     */
    function getFileExtension(codeContent, langLabel) {
        const label = (langLabel || '').toLowerCase().trim();

        // 根据语言标签
        const extMap = {
            'html': 'html', 'htm': 'html',
            'css': 'css', 'scss': 'scss', 'sass': 'sass', 'less': 'less',
            'javascript': 'js', 'js': 'js', 'jsx': 'jsx',
            'typescript': 'ts', 'ts': 'ts', 'tsx': 'tsx',
            'json': 'json',
            'python': 'py', 'py': 'py',
            'java': 'java',
            'c': 'c', 'cpp': 'cpp', 'c++': 'cpp',
            'csharp': 'cs', 'c#': 'cs',
            'go': 'go', 'golang': 'go',
            'rust': 'rs',
            'ruby': 'rb',
            'php': 'php',
            'swift': 'swift',
            'kotlin': 'kt',
            'sql': 'sql',
            'shell': 'sh', 'bash': 'sh', 'sh': 'sh',
            'powershell': 'ps1',
            'yaml': 'yaml', 'yml': 'yaml',
            'xml': 'xml',
            'markdown': 'md', 'md': 'md',
            'svg': 'svg'
        };

        if (extMap[label]) return extMap[label];

        // 根据内容自动检测
        if (isHtmlCode(codeContent)) return 'html';
        if (isSvgCode(codeContent)) return 'svg';

        return 'txt';
    }

    /**
     * 下载代码文件
     * @param {string} content - 代码内容
     * @param {string} extension - 文件扩展名
     */
    function downloadCode(content, extension) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const fileName = `code-${timestamp}.${extension}`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /**
     * 创建下载按钮
     * @param {string} codeContent - 代码内容
     * @param {string} langLabel - 语言标签
     * @returns {HTMLElement} 按钮
     */
    function createDownloadButton(codeContent, langLabel) {
        const ext = getFileExtension(codeContent, langLabel);

        const btn = document.createElement('button');
        btn.className = 'gm-preview-btn mdc-icon-button';
        btn.appendChild(createDownloadIcon());
        btn.title = `下载代码 (.${ext})`;
        btn.setAttribute('aria-label', '下载代码');
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadCode(codeContent, ext);
        };

        return btn;
    }

    /**
     * 创建折叠按钮
     * @param {HTMLElement} codeBlock - 代码块元素
     * @returns {HTMLElement} 按钮
     */
    function createCollapseButton(codeBlock) {
        const btn = document.createElement('button');
        btn.className = 'gm-preview-btn gm-collapse-btn mdc-icon-button';
        btn.appendChild(createCollapseIcon());
        btn.title = '折叠/展开代码';
        btn.setAttribute('aria-label', '折叠代码');

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            codeBlock.classList.toggle('gm-collapsed');
            const isCollapsed = codeBlock.classList.contains('gm-collapsed');
            btn.title = isCollapsed ? '展开代码' : '折叠代码';
            btn.setAttribute('aria-label', isCollapsed ? '展开代码' : '折叠代码');
        };

        return btn;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 代码块处理 - 核心逻辑
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * 扫描页面中的代码块并添加按钮
     * - 所有代码块添加折叠和下载按钮
     * - HTML/SVG 代码块添加预览按钮
     */
    function processCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.code-block');

        codeBlocks.forEach(block => {
            if (block.dataset.buttonsAdded === 'true') return;

            const pre = block.querySelector('pre');
            if (!pre) {
                block.dataset.buttonsAdded = 'true';
                return;
            }

            const code = pre.querySelector('code') || pre;
            const codeContent = code.textContent;
            if (!codeContent || !codeContent.trim()) {
                block.dataset.buttonsAdded = 'true';
                return;
            }

            // 查找 header 区域和语言标签
            const header = block.querySelector('.code-block-decoration');
            if (!header) {
                block.dataset.buttonsAdded = 'true';
                return;
            }

            // 获取语言标签
            const langSpan = header.querySelector('span');
            const langLabel = langSpan ? langSpan.textContent : '';

            // 查找按钮容器
            let buttonsContainer = header.querySelector('.buttons');
            if (!buttonsContainer) {
                const existingBtn = header.querySelector('button');
                buttonsContainer = existingBtn ? existingBtn.parentElement : header;
            }

            // 检查是否已添加按钮
            if (buttonsContainer.querySelector('.gm-preview-btn')) {
                block.dataset.buttonsAdded = 'true';
                return;
            }

            const copyBtn = buttonsContainer.querySelector('button[aria-label="复制代码"]');

            // 根据设置决定显示哪些按钮
            const scriptLangs = ['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx', 'node', 'nodejs'];
            const isScriptLang = scriptLangs.includes(langLabel.toLowerCase().trim());

            // 预览按钮：启用 && (强制显示 || (非脚本语言 && 可预览内容))
            const showPreview = settings.enablePreview &&
                (settings.forcePreview || (!isScriptLang && isPreviewableCode(codeContent)));

            // 下载按钮：启用 && (强制显示 || 默认显示)
            const showDownload = settings.enableDownload;

            // 折叠按钮：启用 && (强制显示 || 默认显示)
            const showCollapse = settings.enableCollapse;

            if (copyBtn) {
                // 按顺序插入到复制按钮前面
                if (showCollapse) {
                    const collapseBtn = createCollapseButton(block);
                    buttonsContainer.insertBefore(collapseBtn, copyBtn);
                }
                if (showDownload) {
                    const downloadBtn = createDownloadButton(codeContent, langLabel);
                    const insertBefore = buttonsContainer.querySelector('.gm-collapse-btn') || copyBtn;
                    buttonsContainer.insertBefore(downloadBtn, insertBefore);
                }
                if (showPreview) {
                    const previewBtns = createPreviewButtons(codeContent);
                    const insertBefore = buttonsContainer.querySelector('.gm-collapse-btn') || copyBtn;
                    buttonsContainer.insertBefore(previewBtns, insertBefore);
                }
            } else {
                // 没有复制按钮，直接添加
                if (showPreview) {
                    const previewBtns = createPreviewButtons(codeContent);
                    buttonsContainer.appendChild(previewBtns);
                }
                if (showDownload) {
                    const downloadBtn = createDownloadButton(codeContent, langLabel);
                    buttonsContainer.appendChild(downloadBtn);
                }
                if (showCollapse) {
                    const collapseBtn = createCollapseButton(block);
                    buttonsContainer.appendChild(collapseBtn);
                }
            }

            block.dataset.buttonsAdded = 'true';
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DOM 监听与初始化
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * 使用 MutationObserver 监听页面变化
     * 当 Gemini 动态加载新内容时自动处理新的代码块
     */
    const observer = new MutationObserver(() => {
        requestAnimationFrame(processCodeBlocks);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    /**
     * 初始运行多次以确保捕获动态加载的内容
     * Gemini 使用流式输出，代码块可能在不同时间点渲染完成
     */
    setTimeout(processCodeBlocks, 500);   // 页面初始加载
    setTimeout(processCodeBlocks, 1500);  // 首次内容渲染
    setTimeout(processCodeBlocks, 3000);  // 延迟内容
    setTimeout(processCodeBlocks, 5000);  // 兜底检查

    // 脚本加载完成提示
    console.log('Gemini Code Tools v8.5: 脚本已加载');
})();
