// ==UserScript==
// @name         X图片批量下载
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  可以抓取X页面图片,批量下载,添加了UI,且为图片添加了下载按钮,支持自定义命名,精确识别图片作者与发布时间,/media页支持预览大图
// @author       uylrcia
// @author       原作者: 基础版 (wsdxb)
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         https://abs.twimg.com/favicons/twitter.3.ico
// @connect      pbs.twimg.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/556505/X%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/556505/X%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
代码头部有更多参数可配置.
媒体页/media,因为脚本环境与X反爬限制,无法抓取多图推文,
但目前可以成功检测,链接会发送至消息框,为了配合此限制,多图推文添加了排除首图的功能按钮.
抓取是从已加载的内容中查找的,确保网络顺畅,可以手动滚动页面或加大滚动延迟.

!!! 并发数量与下载延迟不要太夸张,避免被封账号或IP,发生意外与本脚本无关 !!!

本脚本在原作者wsdxb的基础上修改,原链接 https://greasyfork.org/zh-CN/scripts/533499
*/


/*
MIT License

Copyright (c) 2024 基础版

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


const DEBUG_MODE = false;
//const DEBUG_MODE = true;
function debugLog(...args) {
    if (DEBUG_MODE) console.log('[X下载器]', ...args);
}

(function () {
    'use strict';

    // -------------------------- 配置与变量定义 --------------------------

    const CONFIG = {
        BATCH_SIZE: 1000,             // 批量抓取时的最大数量限制
        IMAGE_SCROLL_INTERVAL: 3000,  // 滚动间隔(ms)，增加到3秒以等待加载
        IMAGE_MAX_SCROLL_COUNT: 500,  // 最大自动滚动次数，防止无限滚动
        SCROLL_DELAY: 1000,           // 每次滚动完成后的额外等待时间(ms)
        DOWNLOAD_DELAY: 100,          // 下载每张图片之间的延迟(ms)
        MAX_CONCURRENT_DOWNLOADS: 3,  // 并发下载任务数
        MIN_DOWNLOAD_DELAY: 100,      // 最小下载延迟限制(ms)，防止封禁
        startDate: '19990101',        // 默认起始日期筛选 (YYYYMMDD)
        MAX_CONCURRENT_DOWNLOADS_LIMIT: 10, // 最大并发数的硬性上限
        SCROLL_STEP: 800,             // 每次滚动的像素距离
        NO_NEW_IMAGE_THRESHOLD: 5,    // 连续多少次滚动无新图片则停止
        DIRECT_DOWNLOAD_THRESHOLD: 3, // 当收集图片数量 <= 此值时，直接下载不打包ZIP
        // UI 紧凑度配置
        UI_SCALE: 1.2,            // 整体缩放比例 (0.7-1.0)
        FONT_SIZE_SCALE: 1.0,     // 字体大小缩放 (0.8-1.0)
        PADDING_SCALE: 0.8,       // 内边距缩放 (0.5-1.0)
        MARGIN_SCALE: 0.8,        // 外边距缩放 (0.5-1.0)
        SECTION_SPACING: 0.8,     // 区块间距缩放 (0.5-1.0)
        BUTTON_HEIGHT_SCALE: 0.8  // 按钮高度缩放 (0.7-1.0)
    };

    let cancelDownload = false;
    let isCollecting = false;
    let isPaused = false;
    let isUIOpen = false;

    // -------------------------- 状态变量 --------------------------
    let enableHoverPreview = false;
    let hoverTimeout = null;

    const imageLinksSet = new Set();
    const imageMetadataMap = new Map();
    const multiImageTweetUrls = new Set();

    // -------------------------- UI样式 --------------------------
    const styles = `
        .x-downloader-floating-btn {
            position: fixed;
            top: 80px;
            right: 20px;
            width: ${30 * CONFIG.UI_SCALE}px;
            height: ${30 * CONFIG.UI_SCALE}px;
            background: #1DA1F2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${16 * CONFIG.FONT_SIZE_SCALE}px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            border: 2px solid #2d3741;
            transition: all 0.3s ease;
        }

        .x-downloader-floating-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.6);
        }

        .x-downloader-ui {
            position: fixed;
            top: 80px;
            right: 80px;
            width: ${400 * CONFIG.UI_SCALE}px;
            max-height: 85vh;
            background: #15202b;
            border-radius: ${8 * CONFIG.UI_SCALE}px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            z-index: 10001;
            display: none;
            padding: ${10 * CONFIG.PADDING_SCALE}px;
            border: 1px solid #38444d;
            color: #e7e9ea;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: ${12 * CONFIG.FONT_SIZE_SCALE}px;
            overflow-y: auto;
        }

        .x-downloader-ui.open {
            display: block;
        }

        .x-downloader-section {
            margin-bottom: ${8 * CONFIG.SECTION_SPACING}px;
            padding-bottom: ${6 * CONFIG.PADDING_SCALE}px;
            border-bottom: 1px solid #38444d;
        }

        .x-downloader-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        .x-downloader-section-title {
            font-weight: 600;
            margin-bottom: ${4 * CONFIG.MARGIN_SCALE}px;
            color: #e7e9ea;
            font-size: ${12 * CONFIG.FONT_SIZE_SCALE}px;
            display: flex;
            align-items: center;
            gap: ${4 * CONFIG.MARGIN_SCALE}px;
        }

        .x-downloader-input-group {
            margin-bottom: ${4 * CONFIG.MARGIN_SCALE}px;
        }

        .x-downloader-label {
            display: block;
            margin-bottom: ${2 * CONFIG.MARGIN_SCALE}px;
            font-size: ${11 * CONFIG.FONT_SIZE_SCALE}px;
            color: #8b98a5;
        }

        .x-downloader-input, .x-downloader-select {
            width: 100%;
            padding: ${4 * CONFIG.PADDING_SCALE}px ${6 * CONFIG.PADDING_SCALE}px;
            background: #1e2732;
            border: 1px solid #38444d;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            font-size: ${11 * CONFIG.FONT_SIZE_SCALE}px;
            box-sizing: border-box;
            color: #e7e9ea;
        }

        .x-downloader-input:focus, .x-downloader-select:focus {
            outline: none;
            border-color: #1DA1F2;
        }

        .x-downloader-checkbox {
            margin-right: ${4 * CONFIG.MARGIN_SCALE}px;
            accent-color: #1DA1F2;
        }

        .x-downloader-row {
            display: flex;
            gap: ${6 * CONFIG.MARGIN_SCALE}px;
            margin-bottom: ${4 * CONFIG.MARGIN_SCALE}px;
        }

        .x-downloader-row .x-downloader-input {
            flex: 1;
        }

        .x-downloader-btn-group {
            display: flex;
            gap: ${4 * CONFIG.MARGIN_SCALE}px;
            margin-top: ${8 * CONFIG.MARGIN_SCALE}px;
        }

        .x-downloader-btn {
            flex: 1;
            padding: ${6 * CONFIG.PADDING_SCALE}px ${8 * CONFIG.PADDING_SCALE}px;
            background: #1DA1F2;
            color: white;
            border: none;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            cursor: pointer;
            font-size: ${11 * CONFIG.FONT_SIZE_SCALE}px;
            font-weight: 600;
            transition: background 0.2s;
            text-align: center;
            min-height: ${28 * CONFIG.BUTTON_HEIGHT_SCALE}px;
        }

        .x-downloader-btn:hover {
            background: #1a91da;
        }

        .x-downloader-btn:disabled {
            background: #253341;
            color: #6e767d;
            cursor: not-allowed;
        }

        .x-downloader-btn.secondary {
            background: #253341;
            color: #e7e9ea;
            text-align: center;
        }

        .x-downloader-btn.secondary:hover {
            background: #2d3741;
            color: #e7e9ea;
        }

        .x-downloader-btn.warning {
            background: #f91880;
            color: white;
            text-align: center;
        }

        .x-downloader-btn.warning:hover {
            background: #e01673;
        }

        .x-downloader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
        }

        /* 文件命名规则区域 */
        .naming-pattern-container {
            background: #1e2732;
            border: 1px solid #38444d;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            padding: ${4 * CONFIG.PADDING_SCALE}px;
            margin-bottom: ${4 * CONFIG.MARGIN_SCALE}px;
        }

        .pattern-tags {
            display: flex;
            flex-wrap: wrap;
            gap: ${7 * CONFIG.MARGIN_SCALE}px;
            min-height: ${18 * CONFIG.UI_SCALE}px;
        }

        .pattern-tag {
            background: #253341;
            color: #8b98a5;
            padding: ${4 * CONFIG.PADDING_SCALE}px ${6 * CONFIG.PADDING_SCALE}px;
            border-radius: ${8 * CONFIG.UI_SCALE}px;
            font-size: ${10 * CONFIG.FONT_SIZE_SCALE}px;
            cursor: pointer;
            user-select: none;
            border: 1px solid #38444d;
            transition: all 0.2s;
        }

        .pattern-tag.active {
            background: #1DA1F2;
            color: white;
            border-color: #1DA1F2;
        }

        .pattern-tag:hover {
            background: #2d3741;
            color: #e7e9ea;
        }

        .pattern-tag.active:hover {
            background: #1a91da;
        }

        .pattern-tag.dragging {
            opacity: 0.5;
        }

        /* 时间筛选布局 */
        .date-row {
            display: flex;
            gap: ${6 * CONFIG.MARGIN_SCALE}px;
            margin-bottom: ${4 * CONFIG.MARGIN_SCALE}px;
        }

        .date-item {
            flex: 1;
        }

        /* 抓取设置布局 */
        .settings-row {
            display: flex;
            gap: ${6 * CONFIG.MARGIN_SCALE}px;
            margin-bottom: ${4 * CONFIG.MARGIN_SCALE}px;
        }

        .settings-item {
            flex: 1;
        }

        /* 文件夹设置 */
        .folder-input {
            width: 100%;
            padding: ${4 * CONFIG.PADDING_SCALE}px ${6 * CONFIG.PADDING_SCALE}px;
            background: #1e2732;
            border: 1px solid #38444d;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            font-size: ${11 * CONFIG.FONT_SIZE_SCALE}px;
            box-sizing: border-box;
            color: #e7e9ea;
        }

        .folder-input:focus {
            outline: none;
            border-color: #1DA1F2;
        }

        /* 通知消息 */
        .x-downloader-notification {
            position: fixed;
            top: 140px;
            right: 20px;
            padding: ${6 * CONFIG.PADDING_SCALE}px ${10 * CONFIG.PADDING_SCALE}px;
            background: #15202b;
            color: #e7e9ea;
            border-radius: ${4 * CONFIG.UI_SCALE}px;
            border: 1px solid #38444d;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10003;
            font-size: ${11 * CONFIG.FONT_SIZE_SCALE}px;
            max-width: ${280 * CONFIG.UI_SCALE}px;
            display: none;
        }

        .notification-error {
            border-left: 3px solid #f91880;
        }

        .notification-success {
            border-left: 3px solid #00ba7c;
        }

        .notification-warning {
            border-left: 3px solid #f7931a;
        }

        .notification-info {
            border-left: 3px solid #1DA1F2;
        }

        /* 按钮组布局 */
        .action-buttons {
            display: flex;
            gap: ${4 * CONFIG.MARGIN_SCALE}px;
            margin-top: ${8 * CONFIG.MARGIN_SCALE}px;
        }

        .action-btn {
            flex: 1;
            padding: ${6 * CONFIG.PADDING_SCALE}px ${8 * CONFIG.PADDING_SCALE}px;
            border: none;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            cursor: pointer;
            font-size: ${11 * CONFIG.FONT_SIZE_SCALE}px;
            font-weight: 600;
            transition: background 0.2s;
            text-align: center;
            min-height: ${28 * CONFIG.BUTTON_HEIGHT_SCALE}px;
        }

        .action-btn.primary {
            background: #1DA1F2;
            color: white;
        }

        .action-btn.primary:hover {
            background: #1a91da;
        }

        .action-btn.secondary {
            background: #253341;
            color: #e7e9ea;
        }

        .action-btn.secondary:hover {
            background: #2d3741;
        }

        .action-btn.warning {
            background: #f91880;
            color: white;
        }

        .action-btn.warning:hover {
            background: #e01673;
        }

        .action-btn:disabled {
            background: #253341;
            color: #6e767d;
            cursor: not-allowed;
        }

        /* 暂停状态的按钮颜色 */
        .action-btn.paused-active {
            background: #d4a017;
            color: white;
        }
        .action-btn.paused-active:hover {
            background: #b8860b;
        }

        .action-btn.save-zip {
            background: #794bc4 !important;
            color: white !important;
        }
        .action-btn.save-zip:hover {
            background: #6c42af !important;
        }


        /* 进度条样式 */
        .progress-container {
            margin: ${8 * CONFIG.MARGIN_SCALE}px 0;
            background: #1e2732;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            padding: ${6 * CONFIG.PADDING_SCALE}px;
            display: none;
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: ${3 * CONFIG.MARGIN_SCALE}px;
            font-size: ${10 * CONFIG.FONT_SIZE_SCALE}px;
            color: #8b98a5;
        }

        .progress-info {
            display: flex;
            justify-content: space-between;
            font-size: ${10 * CONFIG.FONT_SIZE_SCALE}px;
            margin-bottom: ${3 * CONFIG.MARGIN_SCALE}px;
            color: #8b98a5;
        }

        .progress-bar {
            width: 100%;
            height: ${6 * CONFIG.UI_SCALE}px; /* 稍微加高 */
            background: #38444d;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            overflow: hidden;
            position: relative; /* 用于定位百分比 */
        }

        .progress-fill {
            height: 100%;
            background: #1DA1F2;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            transition: width 0.3s ease;
            width: 0%;
        }

        .progress-percentage {
            font-weight: bold;
            color: #e7e9ea;
        }

        /* 实时任务列表容器 */
        .active-downloads-panel {
            margin-top: ${4 * CONFIG.MARGIN_SCALE}px;
            background: #15202b;
            border: 1px solid #38444d;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            padding: ${4 * CONFIG.PADDING_SCALE}px;
            max-height: ${80 * CONFIG.UI_SCALE}px; /* 限制高度，约显示3-4行 */
            overflow-y: auto;
            display: none; /* 默认隐藏 */
        }

        /* 列表项样式 */
        .active-item {
            display: flex;
            justify-content: space-between;
            font-size: ${10 * CONFIG.FONT_SIZE_SCALE}px;
            color: #8b98a5;
            margin-bottom: 2px;
            font-family: monospace; /* 等宽字体对齐更好看 */
            white-space: nowrap;
        }

        .active-item-name {
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 70%;
        }

        .active-item-status {
            color: #1DA1F2;
        }

        /* 滚动条美化 */
        .active-downloads-panel::-webkit-scrollbar {
            width: 4px;
        }
        .active-downloads-panel::-webkit-scrollbar-track {
            background: #1e2732;
        }
        .active-downloads-panel::-webkit-scrollbar-thumb {
            background: #38444d;
            border-radius: 2px;
        }


        /* LOG对话框样式 */
        .log-section {
            margin-top: ${8 * CONFIG.MARGIN_SCALE}px;
            border-top: 1px solid #38444d;
            padding-top: ${8 * CONFIG.PADDING_SCALE}px;
        }

        .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: ${6 * CONFIG.MARGIN_SCALE}px;
        }

        .log-title {
            font-weight: 600;
            color: #e7e9ea;
            font-size: ${12 * CONFIG.FONT_SIZE_SCALE}px;
            display: flex;
            align-items: center;
            gap: ${4 * CONFIG.MARGIN_SCALE}px;
        }

        .log-controls {
            display: flex;
            gap: ${4 * CONFIG.MARGIN_SCALE}px;
        }

        .log-btn {
            padding: ${3 * CONFIG.PADDING_SCALE}px ${6 * CONFIG.PADDING_SCALE}px;
            background: #253341;
            color: #e7e9ea;
            border: none;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            cursor: pointer;
            font-size: ${10 * CONFIG.FONT_SIZE_SCALE}px;
            transition: background 0.2s;
        }

        .log-btn:hover {
            background: #2d3741;
        }

        .log-content {
            height: ${100 * CONFIG.UI_SCALE}px;
            background: #1e2732;
            border: 1px solid #38444d;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
            padding: ${6 * CONFIG.PADDING_SCALE}px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: ${10 * CONFIG.FONT_SIZE_SCALE}px;
            line-height: 1.3;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .log-content:empty::before {
            content: "暂无日志信息";
            color: #6e767d;
            font-style: italic;
        }

        .log-link {
            color: #1DA1F2;
            text-decoration: none;
            cursor: pointer;
            margin: ${1 * CONFIG.MARGIN_SCALE}px 0;
            display: block;
        }

        .log-link:hover {
            text-decoration: underline;
            color: #1a91da;
        }

        .log-warning {
            color: #f7931a;
            font-weight: 600;
            margin-bottom: ${4 * CONFIG.MARGIN_SCALE}px;
        }
        /* 新增：绿色成功按钮样式 */
        .action-btn.success {
            background: #00ba7c;
            color: white;
        }
        .action-btn.success:hover {
            background: #00a36d;
        }
        .action-btn.success:disabled {
            background: #253341;
            color: #6e767d;
            cursor: not-allowed;
        }

        /* 新增：增强功能开关区域样式 */
        .feature-toggle-section {
            margin-top: ${8 * CONFIG.MARGIN_SCALE}px;
            padding: ${8 * CONFIG.PADDING_SCALE}px;
            background: #192734;
            border: 1px solid #38444d;
            border-radius: ${3 * CONFIG.UI_SCALE}px;
        }

        .feature-toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: ${4 * CONFIG.MARGIN_SCALE}px;
        }
        .feature-toggle-row:last-child {
            margin-bottom: 0;
        }

        .feature-label {
            color: #e7e9ea;
            font-size: ${11 * CONFIG.FONT_SIZE_SCALE}px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .feature-hint {
            color: #8b98a5;
            font-size: ${10 * CONFIG.FONT_SIZE_SCALE}px;
        }

        /* 开关控件样式 */
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 20px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #38444d;
            transition: .4s;
            border-radius: 20px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #1DA1F2;
        }

        input:checked + .slider:before {
            transform: translateX(14px);
        }

        /* 悬浮预览容器样式 (优化版) */
        #x-media-preview-container {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 20000;
            pointer-events: none; /* 让鼠标事件穿透 */
            display: none;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8);
            border: 2px solid #333;
            background: black;
            border-radius: 4px;
            /* 关键修改：容器大小自适应内容 */
            width: fit-content;
            height: fit-content;
        }

        #x-media-preview-img {
            display: block;
            /* 保证图片本身按比例缩放 */
            object-fit: contain;
        }

        /* 垂直图片：限制最大高度，宽度自动 */
        .preview-vertical {
            height: auto;
            max-height: 95vh;
            width: auto;
        }

        /* 水平图片：限制最大宽度为60vw，但如果图片小，容器也会变小 */
        .preview-horizontal {
            width: auto;       /* 自身宽度自适应 */
            max-width: 60vw;   /* 上限限制 */
            height: auto;
            max-height: 95vh;  /* 防止超高 */
        }
    `;

    // -------------------------- 工具函数 --------------------------
    function getUsername() {
        const m = window.location.pathname.match(/^\/([^\/\?]+)/);
        return m ? m[1] : 'unknown_user';
    }

    // [修复核心] 强力清洗函数：使用正则同时匹配半角(@)和全角(＠)，移除其后所有内容
    function cleanNameStrict(text) {
        if (!text) return '';
        return text.replace(/[@＠].*$/g, '').trim();
    }

    function getDisplayName() {
        // 1. 尝试获取主页面的用户显示名称
        if (window.location.pathname === '/' || window.location.pathname === '/home') {
            return 'home';
        }

        try {
            // 获取头部用户信息区域
            const container = document.querySelector('[data-testid="User-Name"], [data-testid="UserName"], [data-testid="UserCell"]');

            // 如果没找到容器，返回URL中的用户名
            if (!container) return getUsername();

            // 遍历 span 寻找有效文本
            const spans = container.querySelectorAll('span');
            for (const span of spans) {
                const text = span.textContent?.trim();
                // 排除以 @ 开头的文本(通常是handle) 或 纯表情/过短文本
                if (!text || text.startsWith('@') || text.startsWith('＠') || text.length <= 1) continue;

                // 跳过认证图标 (svg)
                if (span.querySelector('svg')) continue;

                // 立即清洗
                const cleanText = cleanNameStrict(text);

                // 替换非法文件名字符
                if (cleanText) {
                    return cleanText.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
                }
            }
            return getUsername();
        } catch (e) {
            console.error('获取显示名称失败:', e);
            return getUsername();
        }
    }

    // 从图片元素直接提取精准的 推文ID 和 用户名
    function getTweetInfoFromElement(img) {
        const link = img.closest('a[href*="/status/"]');
        if (!link) return null;

        const href = link.getAttribute('href');
        // 匹配格式: /Username/status/TweetID
        const match = href.match(/^\/([^\/]+)\/status\/(\d+)/);

        if (match) {
            return {
                username: match[1],
                tweetId: match[2]
            };
        }
        return null;
    }

    // 查找一组元素的"最小公共祖先"容器 (用于多图 Grid 定位)
    function findCommonContainer(elements) {
        if (!elements || elements.length === 0) return null;
        if (elements.length === 1) {
            // 单图：返回 tweetPhoto 或 videoPlayer 容器
            return elements[0].closest('[data-testid="tweetPhoto"]') ||
                elements[0].closest('[data-testid="videoPlayer"]') ||
                elements[0].parentElement;
        }

        // 多图：向上查找直到找到包含所有图片的容器
        let container = elements[0].parentElement;
        while (container && container !== document.body) {
            const allContained = elements.every(el => container.contains(el));
            if (allContained) {
                return container;
            }
            container = container.parentElement;
        }
        return elements[0].parentElement; // 兜底
    }

    // -------------------------- 增强的日期获取函数 --------------------------

    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    function getDateFromTweetId(tweetId) {
        if (!tweetId) return null;
        try {
            const id = BigInt(tweetId);
            const TWITTER_EPOCH = 1288834974657n;
            const timestamp = (id >> 22n) + TWITTER_EPOCH;
            const utcDate = new Date(Number(timestamp));

            // 修复：正确转换为本地时间
            const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
            return localDate;
        } catch (e) {
            debugLog('解析Tweet ID失败:', e);
            return null;
        }
    }

    // -------------------------- LOG对话框功能 --------------------------

    function createLogSection() {
        const logSection = document.createElement('div');
        logSection.className = 'log-section';
        logSection.innerHTML = `
            <div class="log-header">
                <div class="log-title">📝 日志</div>
                <div class="log-controls">
                    <button class="log-btn" id="clearLog">清空</button>
                </div>
            </div>
            <div class="log-content" id="logContent"></div>
        `;
        return logSection;
    }

    function addToLog(message, linkTarget = false) {
        const logContent = document.getElementById('logContent');
        if (!logContent) return;

        const logEntry = document.createElement('div');
        const timestamp = new Date().toLocaleTimeString();

        // 情况1：linkTarget 是一个URL字符串 -> 渲染为 "时间 消息 链接(可点击)"
        if (typeof linkTarget === 'string' && linkTarget.startsWith('http')) {
            const textSpan = document.createElement('span');
            textSpan.textContent = `[${timestamp}] ${message} `;

            const link = document.createElement('a');
            link.className = 'log-link';
            link.href = linkTarget;
            link.target = '_blank';
            link.textContent = linkTarget; // 或者显示 "点击查看"
            link.title = '点击在新标签页打开';

            // 关键：覆盖原CSS的 display:block，使其在一行显示
            link.style.display = 'inline';
            link.style.marginLeft = '5px';
            link.style.textDecoration = 'underline';

            logEntry.appendChild(textSpan);
            logEntry.appendChild(link);
        }
        // 情况2：linkTarget 是 true (旧逻辑兼容) -> 整行都是链接
        else if (linkTarget === true) {
            const link = document.createElement('a');
            link.className = 'log-link';
            link.href = message;
            link.target = '_blank';
            link.textContent = `[${timestamp}] ${message}`;
            logEntry.appendChild(link);
        }
        // 情况3：纯文本
        else {
            logEntry.textContent = `[${timestamp}] ${message}`;
        }

        logContent.appendChild(logEntry);

        // 自动滚动
        logContent.scrollTop = logContent.scrollHeight;
        updateLogScrollbar();
    }

    function updateLogScrollbar() {
        const logContent = document.getElementById('logContent');
        if (!logContent) return;

        // 如果内容高度超过容器高度，显示滚动条
        if (logContent.scrollHeight > logContent.clientHeight) {
            logContent.style.overflowY = 'scroll';
        } else {
            logContent.style.overflowY = 'auto';
        }
    }

    function clearLog() {
        const logContent = document.getElementById('logContent');
        if (logContent) {
            logContent.innerHTML = '';
            multiImageTweetUrls.clear(); // 同时清空存储的链接
            updateLogScrollbar();
        }
    }

    function addMultiImageTweetToLog(tweetId) {
        if (!tweetId) return;

        const username = getUsername();
        const tweetUrl = `https://x.com/${username}/status/${tweetId}`;

        // 避免重复添加
        if (multiImageTweetUrls.has(tweetUrl)) {
            return;
        }

        multiImageTweetUrls.add(tweetUrl);

        // 如果是第一个多图推文，添加警告信息
        if (multiImageTweetUrls.size === 1) {
            addToLog('受脚本环境与X反爬限制,多图推文只能抓取首图,需手动打开详情页抓取:', false);
            addToLog('检测到多图推文:', false);
        }

        addToLog(tweetUrl, true);
    }

    // -------------------------- 图片收集和筛选逻辑 --------------------------

    // 提取显示名称的公共逻辑
    function extractDisplayName(element, username) {
        let displayName = username;

        // 1. 尝试从 DOM 中查找 User-Name
        try {
            // 扩大查找范围：可能是 article (推文主体)，或者是传入的 container
            const searchContainer = element.closest('article') ||
                  element.closest('[data-testid="tweet"]') ||
                  element;

            if (searchContainer) {
                const nameElements = searchContainer.querySelectorAll('[data-testid="User-Name"]');
                for (const el of nameElements) {
                    // 检查这个元素内部是否包含我们的精准用户名(handle)
                    // 只要包含 @handle (忽略大小写)，就说明这个节点包含了我们要找的显示名称
                    if (el.textContent.toLowerCase().includes(`@${username.toLowerCase()}`)) {
                        const text = el.textContent;

                        // [关键步骤] 只要匹配到了，立刻对整个字符串进行强力清洗
                        // 这会移除 "Name ＠ Event" 后面的所有部分，以及 textContent 里混入的 "@handle"
                        const cleaned = cleanNameStrict(text);

                        if (cleaned && cleaned.length > 0) {
                            displayName = cleaned;
                            break; // 找到并清洗成功，跳出循环
                        }
                    }
                }
            }
        } catch (e) {
            // 忽略 DOM 查找错误
        }

        // 2. 兜底策略：如果提取失败，或者是在用户主页下载该用户自己的图
        if (displayName === username && username.toLowerCase() === getUsername().toLowerCase()) {
            const globalName = getDisplayName(); // 这里现在会调用上面修复过的正则清洗函数
            if (globalName && globalName !== 'home' && globalName !== 'unknown_user') {
                displayName = globalName;
            }
        }

        // 3. 最后的安全锁：防止漏网之鱼，再次执行正则清洗
        // 检查是否包含半角或全角 @
        if (/[@＠]/.test(displayName)) {
            displayName = cleanNameStrict(displayName);
        }

        return displayName || username;
    }

    // 全局变量，记录已经处理过的推文ID
    const processedTweets = new Set();

    // 收集页面图片
    function getAllImages() {
        const maxBatch = parseInt(document.getElementById('batchSize')?.value) || CONFIG.BATCH_SIZE;
        let addedFromDOM = 0;
        const currentRound = window.collectionRound ? window.collectionRound + 1 : 1;
        window.collectionRound = currentRound;
        // tweetImageCountMap 相关代码已移除，因为不再使用

        const primaryColumn = document.querySelector('[data-testid="primaryColumn"]');
        if (!primaryColumn) {
            debugLog(`第${currentRound}轮: 未找到主内容列，跳过`);
            return 0;
        }

        const isMediaPage = window.location.pathname.includes('/media');
        const tweetImageIndexMap = new Map(); // 用于处理同一推文内的多图索引

        primaryColumn.querySelectorAll('img[src*="pbs.twimg.com/media/"]').forEach(img => {
            if (imageLinksSet.size >= maxBatch) return;

            const currentSrc = img.src;
            const formatMatch = currentSrc.match(/format=([a-zA-Z0-9]+)/);
            const ext = formatMatch ? formatMatch[1] : 'jpg';
            // 提取唯一媒体ID (新增)
            const mediaIdMatch = currentSrc.match(/\/media\/([^\/?]+)/);
            const mediaId = mediaIdMatch ? mediaIdMatch[1] : 'unknown';

            let url = currentSrc.split('?')[0] + `?format=${ext}&name=orig`;

            // 1. 图片级去重
            if (imageLinksSet.has(url)) return;

            // 2. 获取精准信息
            const info = getTweetInfoFromElement(img);
            if (!info) return;

            const tweetId = info.tweetId;
            const authorUsername = info.username;

            // =========== 实时多图检测 ===========
            // 只有当这是我们第一次遇到这个 TweetID，且在媒体页时，才检测
            if (isMediaPage && !processedTweets.has(tweetId)) {
                const linkElement = img.closest('a[href*="/status/"]');
                if (linkElement) {
                    const detectResult = detectMultiImageByListItem(linkElement, tweetId);
                    if (detectResult.detected) {
                        addMultiImageTweetToLog(tweetId);
                    }
                }
            }

            // 3. 时间筛选
            const postDate = getDateFromTweetId(tweetId)?.toISOString() || 'unknown';
            if (!applyFilters({ postDate })) return;

            // 4. 获取显示名称 (使用提取的公共函数)
            const authorDisplayName = extractDisplayName(img, authorUsername);

            // 5. 处理索引和元数据
            if (!tweetImageIndexMap.has(tweetId)) tweetImageIndexMap.set(tweetId, 0);
            const index = tweetImageIndexMap.get(tweetId);
            tweetImageIndexMap.set(tweetId, index + 1);

            imageLinksSet.add(url);
            // 更新元数据对象，加入 mediaId (修改)
            imageMetadataMap.set(url, {
                tweetId, postDate, url, index, authorUsername, authorDisplayName, mediaId
            });
            addedFromDOM++;

            // 记录推文ID
            processedTweets.add(tweetId);
        });

        debugLog(`第${currentRound}轮 DOM 抓取完成，共 ${addedFromDOM} 张`);
        return addedFromDOM;
    }

    // 更精确的多图检测函数 - 针对每个图片单独检测
    function detectMultiImageByListItem(linkElement, tweetId = 'unknown') {
        if (!linkElement) {
            return { detected: false, method: "无链接元素" };
        }
        let svgPaths = linkElement.querySelectorAll('svg path');

        // 备用方案：如果内部没找到，再尝试向上查找父容器
        if (svgPaths.length === 0) {
            const container = linkElement.closest('li[role="listitem"]') ||
                  linkElement.closest('div[data-testid="cellInnerDiv"]') ||
                  linkElement.closest('article');
            if (container) {
                svgPaths = container.querySelectorAll('svg path');
            }
        }
        for (const path of svgPaths) {
            const d = path.getAttribute('d');
            if (!d) continue;

            if (d.includes('M2 8.5') && d.includes('M19.5 4')) {
                debugLog(`[多图确认] ID: ${tweetId} - 匹配到标准多图图标`);
                return { detected: true, method: "精确SVG路径匹配" };
            }

            if (d.includes('M19.5 4') && d.includes('v13.45')) {
                debugLog(`[多图确认] ID: ${tweetId} - 匹配到特征值 v13.45`);
                return { detected: true, method: "SVG特征值匹配" };
            }
        }

        return { detected: false, method: "未匹配到特征" };
    }

    function applyFilters(metadata) {
        if (metadata.postDate && metadata.postDate !== 'unknown') {
            const postYMD = metadata.postDate.slice(0,10).replace(/-/g,'');
            const start = (document.getElementById('startDate')?.value || '').replace(/[^\d]/g,'') || '19990101';
            const end = (document.getElementById('endDate')?.value || '').replace(/[^\d]/g,'') || new Date().toISOString().slice(0,10).replace(/-/g,'');
            if (postYMD < start || postYMD > end) return false;
        }
        return true;
    }

    // ==================== 文件命名 ====================

    function generateFileName(url, customMeta = null, forceUnique = false) {
        const meta = customMeta || imageMetadataMap.get(url);
        const settings = JSON.parse(localStorage.getItem('xDownloaderSettings') || '{}');
        const pattern = settings.fileNamePattern || [];

        const formatMatch = url.match(/format=([a-zA-Z0-9]+)/);
        const ext = formatMatch ? formatMatch[1] : 'jpg';

        // 如果没有设置规则，使用默认
        if (pattern.length === 0 && !forceUnique) {
            const uniqueId = meta.tweetId || 'unknown';
            const index = meta.index !== undefined ? meta.index : 0;
            return `${uniqueId}_p${index}.${ext}`;
        }

        let parts = pattern.map(key => {
            switch (key) {
                case 'displayName':
                    return meta.authorDisplayName || getDisplayName();
                case 'username':
                    return meta.authorUsername || getUsername();
                case 'tweetId': return meta.tweetId || 'unknown';
                case 'postDate': return meta.postDate && meta.postDate !== 'unknown' ? meta.postDate.slice(2, 10).replace(/-/g, '') : '';
                case 'time': return meta.postDate && meta.postDate !== 'unknown' ? meta.postDate.slice(11, 16).replace(':', '') : '';
                case 'mediaId': return meta.mediaId || ''; // 新增标签支持
                default: return '';
            }
        }).filter(Boolean);

        // [要求2] 如果触发了强制唯一性(forceUnique)，且当前命名部分不包含mediaId，则强制插入
        // 确保插入在 parts 列表的最后，但在 _pIndex 之前
        if (forceUnique) {
            // 检查是否已经存在 mediaId 以避免重复添加
            if (!pattern.includes('mediaId') && meta.mediaId) {
                parts.push(meta.mediaId);
            }
        }

        let name = parts.length ? parts.join('_') : 'image';

        // [要求4] 保证 p0/1/2 始终在最后
        if (meta.index !== undefined && meta.index >= 0) {
            name += `_p${meta.index}`;
        }

        return name.replace(/[\\/:*?"<>|]/g, '_') + '.' + ext;
    }

    // ==================== 下载器 ====================

    const Downloader = (() => {
        // 核心状态
        let isDownloading = false;
        let isDownloadPaused = false;
        let stopSignal = false;
        let zipInstance = null;
        let isCompletionHandled = false;

        // 队列与并发管理
        let queue = [];
        let activeRequests = [];
        let currentWorkerCount = 0; // 当前正在运行的 worker 数量

        // 统计数据
        let completedBytes = 0;
        let activeFileProgress = new Map();
        let lastTotalBytes = 0;
        let lastUiUpdateTime = 0;
        let downloadedCount = 0;
        let totalCount = 0;

        let uiTimer = null;

        // ----------------- 内部工作线程 -----------------
        const startWorker = async () => {
            // 原子操作增加计数，确保并发控制准确
            currentWorkerCount++;

            try {
                while (queue.length > 0) {
                    // 1. 停止或暂停信号检查
                    // 如果暂停，worker 直接退出，不再空转占用资源
                    if (stopSignal || isDownloadPaused) break;

                    // 2. 领取任务
                    const url = queue.shift();
                    if (!url) break;

                    // 3. 执行下载
                    activeFileProgress.set(url, 0);
                    const startTime = Date.now();

                    try {
                        const blob = await new Promise((resolve, reject) => {
                            const req = GM_xmlhttpRequest({
                                method: "GET",
                                url: url,
                                responseType: "blob",
                                onprogress: (e) => {
                                    if (e.lengthComputable && !stopSignal) {
                                        activeFileProgress.set(url, e.loaded);
                                    }
                                },
                                onload: (r) => {
                                    if (r.status === 200) resolve(r.response);
                                    else reject(new Error(`Status ${r.status}`));
                                },
                                onerror: reject,
                                onabort: () => reject(new Error('Aborted'))
                            });
                            activeRequests.push(req);
                        });

                        if (stopSignal) break; // 下载过程中被停止

                        const size = blob.size;
                        completedBytes += size;
                        activeFileProgress.delete(url);
                        downloadedCount++;

                        // [要求2] 写入 ZIP 时的重名检测与处理
                        if (zipInstance) {
                            let fileName = generateFileName(url);

                            // 检查文件是否已存在于ZIP中
                            if (zipInstance.file(fileName)) {
                                debugLog(`检测到重名文件: ${fileName}，尝试添加唯一ID...`);
                                // 传递 true 开启强制唯一标识 (添加MediaID)
                                fileName = generateFileName(url, null, true);
                            }

                            zipInstance.file(fileName, blob);
                        }

                    } catch (e) {
                        activeFileProgress.delete(url);
                        // 如果是暂停导致的 abort，把 url 放回队列头部，下次继续下载
                        if (isDownloadPaused && !stopSignal) {
                            queue.unshift(url);
                            break;
                        }
                        if (!stopSignal && e.message !== 'Aborted') {
                            console.error('下载失败', url, e);

                            // [要求1] 详细的错误日志
                            const meta = imageMetadataMap.get(url);
                            if (meta) {
                                const tweetUrl = `https://x.com/i/status/${meta.tweetId}`;
                                // 消息部分仅保留描述，不再包含 URL
                                const errorMsg = `❌ 下载失败: ID ${meta.tweetId} (P${meta.index})`;

                                showNotification(`下载失败: ${meta.tweetId}_p${meta.index}`, 'error');

                                // [修改] 第二个参数传入 URL 字符串，触发新逻辑
                                // 结果显示为：[时间] ❌ 下载失败: ID... (P0) https://x.com/...
                                addToLog(errorMsg, tweetUrl);
                            } else {
                                addToLog(`下载失败: ${url}`, false);
                            }
                        }
                    }

                    // 4. 处理延迟 (每个线程独立延时)
                    if (!stopSignal && !isDownloadPaused && queue.length > 0) {
                        // 动态获取当前设置的延迟时间
                        const requestDelay = parseInt(document.getElementById('downloadDelay')?.value) || 100;
                        const duration = Date.now() - startTime;
                        // 如果下载耗时已经超过了设定的延迟，则不需要额外等待，直接进行下一个
                        // 否则等待剩余的时间
                        if (duration < requestDelay) {
                            await new Promise(r => setTimeout(r, requestDelay - duration));
                        }
                    }
                }
            } finally {
                // 无论如何退出（完成、暂停、出错），都减少计数
                currentWorkerCount--;
                // 检查是否所有任务都结束了
                Downloader.checkCompletion();
            }
        };

        // 启动指定数量的 worker
        const spawnWorkers = async () => {
            const settings = saveSettings(); // 获取最新设置
            const maxConcurrent = settings.maxConcurrent || 3;

            // 只要队列有任务，且当前 worker 数少于最大并发数，就启动新 worker
            while (queue.length > 0 && currentWorkerCount < maxConcurrent && !isDownloadPaused && !stopSignal) {
                startWorker();
                // 稍微错开启动时间，避免瞬间并发过高
                await new Promise(r => setTimeout(r, 1000));
            }
        };

        return {
            getCurrentActiveBytes() {
                let bytes = 0;
                for (let b of activeFileProgress.values()) bytes += b;
                return bytes;
            },

            async add(urls) {
                if (isDownloading) {
                    // 如果已经在下载，将新任务追加到队列
                    queue.push(...urls);
                    totalCount += urls.length;
                    showNotification(`已追加 ${urls.length} 个任务`, 'info');
                    spawnWorkers(); // 尝试扩容
                    return;
                }

                // 初始化状态
                isCompletionHandled = false;
                isDownloading = true;
                isDownloadPaused = false;
                stopSignal = false;
                activeRequests = [];
                queue = [...urls];

                // 如果是首次启动，初始化 ZIP 和统计
                if (!zipInstance) zipInstance = new JSZip();

                completedBytes = 0;
                activeFileProgress.clear();
                downloadedCount = 0;
                totalCount = urls.length;
                lastTotalBytes = 0;
                lastUiUpdateTime = Date.now();

                updateButtonState('downloading');

                if (uiTimer) clearInterval(uiTimer);
                uiTimer = setInterval(() => this.updateStats(), 500);

                const listEl = document.getElementById('activeDownloadsList');
                if (listEl) {
                    listEl.style.display = 'block';
                    listEl.innerHTML = '';
                }

                this.updateStats();

                // 启动 workers
                spawnWorkers();
            },

            async checkCompletion() {
                if (stopSignal) {
                    if (currentWorkerCount === 0) this.cleanupAndFinish('stopped');
                    return;
                }

                if (isDownloadPaused) {
                    // 暂停状态下不检查完成
                    return;
                }

                // 防止重复处理
                if (isCompletionHandled) return;

                if (queue.length === 0 && currentWorkerCount === 0) {
                    // 队列空了且没有 worker 在运行
                    isCompletionHandled = true;

                    if (downloadedCount >= totalCount) {
                        // 全部完成
                        if (totalCount <= CONFIG.DIRECT_DOWNLOAD_THRESHOLD) {
                            await this.directDownload();
                        } else {
                            await this.saveZip();
                        }
                    } else {
                        // 队列空了但数量不对（可能是下载失败被丢弃了）
                        // 也视为结束
                        if (totalCount <= CONFIG.DIRECT_DOWNLOAD_THRESHOLD) {
                            await this.directDownload();
                        } else {
                            await this.saveZip(); // 即使有失败的，已下载的也打包
                        }
                    }
                }
            },

            async directDownload() {
                const listEl = document.getElementById('activeDownloadsList');
                if (listEl) listEl.style.display = 'none';

                updateProgressBar(100, 100, '正在直接下载图片...', '100%');
                showNotification('图片数量较少，直接下载...', 'info');

                let successCount = 0;
                if (zipInstance) {
                    const files = Object.keys(zipInstance.files);
                    for (const filename of files) {
                        try {
                            const file = zipInstance.files[filename];
                            const blob = await file.async('blob');
                            GM_download({
                                url: URL.createObjectURL(blob),
                                name: filename,
                                saveAs: true
                            });
                            successCount++;
                        } catch (e) {
                            console.error('直接下载失败:', filename, e);
                        }
                    }
                }

                showNotification(`直接下载完成！共 ${successCount} 个文件`, 'success');
                addToLog(`直接下载完成，共 ${successCount} 个文件`, false);

                setTimeout(() => {
                    const progressContainer = document.getElementById('progressContainer');
                    if (progressContainer) progressContainer.style.display = 'none';
                }, 3000);
                updateButtonState('completed');

                zipInstance = null;
                stopSignal = false;
                isDownloadPaused = false;
                isDownloading = false;
                currentWorkerCount = 0;
                if (uiTimer) clearInterval(uiTimer);
            },

            updateStats() {
                const currentTotalBytes = completedBytes + this.getCurrentActiveBytes();
                const now = Date.now();
                const deltaTime = now - lastUiUpdateTime;

                let speed = 0;
                if (!isDownloadPaused && deltaTime > 0) {
                    const deltaBytes = currentTotalBytes - lastTotalBytes;
                    if (deltaBytes >= 0) speed = (deltaBytes / 1024 / 1024 / (deltaTime / 1000));
                }

                lastTotalBytes = currentTotalBytes;
                lastUiUpdateTime = now;

                const speedStr = speed.toFixed(2);
                const percentage = totalCount > 0 ? Math.round((downloadedCount / totalCount) * 100) : 0;
                const statusText = `下载中... ${speedStr} MB/s | 已完成 ${downloadedCount}/${totalCount}`;

                updateProgressBar(downloadedCount, totalCount, statusText, `${percentage}%`);
                this.updateActiveListUI();
            },

            updateActiveListUI() {
                const listEl = document.getElementById('activeDownloadsList');
                if (!listEl || listEl.style.display === 'none') return;
                let html = '';
                let count = 0;
                for (let [url, loaded] of activeFileProgress) {
                    if (count > 5) break;
                    const filename = generateFileName(url);
                    const loadedMB = (loaded / 1024 / 1024).toFixed(2);
                    html += `<div class="active-item"><span class="active-item-name" title="${filename}">${filename}</span><span class="active-item-status">⬇ ${loadedMB}MB</span></div>`;
                    count++;
                }
                if (activeFileProgress.size === 0) html = '<div class="active-item">等待任务分配...</div>';
                listEl.innerHTML = html;
            },

            pause() {
                if (isDownloading && !isDownloadPaused) {
                    isDownloadPaused = true;
                    // 终止所有当前请求，让它们回到队列头部
                    activeRequests.forEach(req => { try { req.abort(); } catch(e){} });
                    activeRequests = [];

                    showNotification('下载已暂停 (正在停止当前任务)', 'warning');
                    updateButtonState('downloadPaused');
                    this.updateStats();
                }
            },

            resume() {
                if (isDownloading && isDownloadPaused) {
                    isDownloadPaused = false;
                    lastUiUpdateTime = Date.now();
                    lastTotalBytes = completedBytes; // 重置测速基准

                    const settings = saveSettings();
                    showNotification(`继续下载 (并发: ${settings.maxConcurrent || 3})`, 'info');
                    updateButtonState('downloading');

                    // 重新根据并发数启动 worker
                    spawnWorkers();
                }
            },

            stop() {
                if (isDownloading) {
                    stopSignal = true;
                    activeRequests.forEach(req => { try { req.abort(); } catch(e){} });
                    activeRequests = [];
                }
            },

            cleanupAndFinish(type) {
                if (uiTimer) clearInterval(uiTimer);
                uiTimer = null;
                this.updateStats();
                isCompletionHandled = false;
                isDownloading = false;
                activeFileProgress.clear();

                const listEl = document.getElementById('activeDownloadsList');
                if (listEl) listEl.style.display = 'none';

                if (type === 'stopped') {
                    updateButtonState('downloadStoppedWaitSave', downloadedCount);
                    showNotification(`下载已暂停，已获取 ${downloadedCount} 张。请点击保存或放弃。`, 'warning');
                    addToLog(`下载中断，等待保存。已下载: ${downloadedCount}/${totalCount}`, false);
                } else if (type === 'error') {
                    updateButtonState('idle');
                    showNotification('下载结束，未获取到有效图片', 'warning');
                }
            },

            async saveZip() {
                // 此处代码与原版相同，不需要修改，直接保留即可
                // 为了完整性，这里简略写出，实际整合时请保留原 saveZip 逻辑
                if (!zipInstance || Object.keys(zipInstance.files).length === 0) {
                    showNotification('没有文件可保存', 'error');
                    updateButtonState('idle');
                    return;
                }
                const zipName = document.getElementById('folderName')?.value.trim() || getDisplayName();
                const listEl = document.getElementById('activeDownloadsList');
                if (listEl) listEl.style.display = 'none';

                updateProgressBar(100, 100, '正在打包 ZIP (请稍候)...', '100%');
                showNotification('正在打包 ZIP...', 'info');
                try {
                    const content = await zipInstance.generateAsync({ type: "blob" });
                    GM_download({
                        url: URL.createObjectURL(content),
                        name: `${zipName}_${getCurrentDate()}.zip`,
                        saveAs: true
                    });
                    showNotification('ZIP 下载完成！', 'success');
                    addToLog(`ZIP 打包下载完成，共 ${Object.keys(zipInstance.files).length} 个文件`, false);
                } catch (e) {
                    console.error('打包失败', e);
                    showNotification('打包失败', 'error');
                }
                setTimeout(() => {
                    const progressContainer = document.getElementById('progressContainer');
                    if (progressContainer) progressContainer.style.display = 'none';
                }, 3000);
                updateButtonState('completed');
                zipInstance = null;
                stopSignal = false;
                isDownloadPaused = false;
                isDownloading = false;
                currentWorkerCount = 0;
                if (uiTimer) clearInterval(uiTimer);
            }
        };
    })();

    // -------------------------- 核心功能函数 --------------------------

    async function autoScrollAndCollectImages() {
        cancelDownload = false;
        imageLinksSet.clear();
        imageMetadataMap.clear();
        processedTweets.clear();
        window.collectionRound = 0;

        // 初始保存一次设置
        saveSettings();
        // 初始化配置对象
        const config = {
            BATCH_SIZE: parseInt(document.getElementById('batchSize').value) || CONFIG.BATCH_SIZE,
            IMAGE_SCROLL_INTERVAL: parseInt(document.getElementById('scrollInterval').value) || CONFIG.IMAGE_SCROLL_INTERVAL,
            IMAGE_MAX_SCROLL_COUNT: CONFIG.IMAGE_MAX_SCROLL_COUNT,
            SCROLL_DELAY: 1000,
            NO_NEW_IMAGE_THRESHOLD: CONFIG.NO_NEW_IMAGE_THRESHOLD
        };
        debugLog('当前配置:', config);

        updateButtonState('collecting');
        isCollecting = true;
        isPaused = false;

        showNotification('开始收集图片...', 'info');
        addToLog('开始收集图片...', false);

        let scrollCount = 0;
        let noNewImagesCount = 0;
        let lastImageCount = 0;
        let lastScrollHeight = 0;

        // 初始收集
        getAllImages();
        let currentCount = imageLinksSet.size;
        showNotification(`已找到 ${currentCount} 张图片`, 'info');
        addToLog(`已找到 ${currentCount} 张图片`, false);

        // ==================== 循环逻辑 ====================
        while (scrollCount < config.IMAGE_MAX_SCROLL_COUNT &&
               !cancelDownload &&
               noNewImagesCount < config.NO_NEW_IMAGE_THRESHOLD) {

            // 1. 在每次滚动前检查是否达到数量限制
            if (imageLinksSet.size >= config.BATCH_SIZE) {
                showNotification(`已达到收集数量限制: ${config.BATCH_SIZE}，停止滚动`, 'warning');
                addToLog(`已达到收集数量限制: ${config.BATCH_SIZE}，停止滚动`, false);
                break;
            }

            // 2. 处理暂停
            if (isPaused) {
                while (isPaused && isCollecting) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                if (isCollecting) {
                    // 热重载配置
                    const newBatchSize = parseInt(document.getElementById('batchSize')?.value);
                    const newInterval = parseInt(document.getElementById('scrollInterval')?.value);
                    if (newBatchSize > 0) config.BATCH_SIZE = newBatchSize;
                    if (newInterval >= 100) config.IMAGE_SCROLL_INTERVAL = newInterval;
                    debugLog('抓取已恢复，配置已更新');
                    showNotification('抓取继续 (配置已更新)', 'info');
                }
                if (!isCollecting || cancelDownload) continue;
            }

            // 3. 渐进式滚动
            const currentScrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const targetScrollY = currentScrollY + CONFIG.SCROLL_STEP;

            window.scrollTo(0, targetScrollY);
            await new Promise(resolve => setTimeout(resolve, config.IMAGE_SCROLL_INTERVAL));

            // 4. 检查底部
            const currentScrollHeight = document.documentElement.scrollHeight;
            if (currentScrollHeight === lastScrollHeight &&
                targetScrollY + viewportHeight >= currentScrollHeight - 100) {
                noNewImagesCount++;
            } else {
                noNewImagesCount = 0;
                lastScrollHeight = currentScrollHeight;
            }

            // 5. 执行抓取
            getAllImages();
            currentCount = imageLinksSet.size;

            if (currentCount === lastImageCount) {
                noNewImagesCount++;
            } else {
                noNewImagesCount = 0;
                lastImageCount = currentCount;
            }

            scrollCount++;
            showNotification(`已收集 ${currentCount} 张图片 (滚动 ${scrollCount} 次)`, 'info');
        }

        const isMediaPage = window.location.pathname.includes('/media');
        debugLog(`当前页面: ${window.location.pathname}, 是否媒体页: ${isMediaPage}`);

        if (isMediaPage) {
            const multiImageCount = multiImageTweetUrls.size;
            debugLog(`多图检测完成，检测到 ${multiImageCount} 个多图推文`);
            addToLog(`多图检测完成，检测到 ${multiImageCount} 个多图推文`, false);
        } else {
            debugLog('非媒体页面，跳过多图检测');
        }

        isCollecting = false;

        // 退出时的状态处理
        const finalCount = imageLinksSet.size;

        if (cancelDownload) {
            // 即使是取消，也报告最终找到的数量
            showNotification(`收集已停止，共找到 ${finalCount} 张图片`, 'warning');
            addToLog(`收集已停止，共找到 ${finalCount} 张图片`, false);
            updateButtonState('idle');
        } else {
            // 正常完成
            showNotification(`收集完成! 共找到 ${finalCount} 张图片`, 'success');
            addToLog(`收集完成! 共找到 ${finalCount} 张图片`, false);
            updateButtonState('completed');
        }
    }


    async function downloadCollectedImages() {
        if (imageLinksSet.size === 0) {
            showNotification('没有可下载的图片', 'warning');
            addToLog('没有可下载的图片', false);
            return;
        }

        const imageList = Array.from(imageLinksSet);
        showNotification(`开始下载 ${imageList.length} 张图片...`, 'info');
        addToLog(`开始下载 ${imageList.length} 张图片...`, false);
        updateButtonState('downloading');

        cancelDownload = false;
        await Downloader.add(imageList);
    }

    // -------------------------- UI组件初始化 --------------------------
    function createUI() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // ... 省略常规UI元素创建 (悬浮球/通知/遮罩) ...
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'x-downloader-floating-btn';
        floatingBtn.innerHTML = '📷';
        floatingBtn.title = 'X图片下载器';
        document.body.appendChild(floatingBtn);

        const notification = document.createElement('div');
        notification.className = 'x-downloader-notification';
        document.body.appendChild(notification);

        const overlay = document.createElement('div');
        overlay.className = 'x-downloader-overlay';
        document.body.appendChild(overlay);

        const displayName = getDisplayName();

        const uiContainer = document.createElement('div');
        uiContainer.className = 'x-downloader-ui';
        uiContainer.innerHTML = `
        <div class="x-downloader-section">
            <div class="x-downloader-section-title">📁 压缩包名</div>
            <div class="x-downloader-input-group">
                <input type="text" class="folder-input" id="folderName" value="${displayName}">
            </div>
        </div>

        <div class="x-downloader-section">
            <div class="x-downloader-section-title">
                📝 文件命名
                <label class="x-downloader-label" style="margin-bottom: 0; margin-left: 0px; font-weight: normal;">单击激活,拖动排序</label>
            </div>
            <div class="naming-pattern-container">
                <div class="pattern-tags" id="patternTags"></div>
            </div>
        </div>

        <div class="x-downloader-section">
            <div class="x-downloader-section-title">📅 时间筛选</div>
            <div class="date-row">
                <div class="date-item">
                    <label class="x-downloader-label">开始日期</label>
                    <input type="text" class="x-downloader-input" id="startDate" placeholder="${CONFIG.startDate}" pattern="\\d{8}">
                </div>
                <div class="date-item">
                    <label class="x-downloader-label">结束日期</label>
                    <input type="text" class="x-downloader-input" id="endDate" placeholder="${getCurrentDate()}" pattern="\\d{8}">
                </div>
            </div>
        </div>

        <div class="x-downloader-section">
            <div class="x-downloader-section-title">⚙️ 抓取/下载设置</div>
            <div class="settings-row">
                <div class="settings-item">
                    <label class="x-downloader-label">最大抓取数量</label>
                    <input type="text" class="x-downloader-input" id="batchSize" value="1000" pattern="\\d*">
                </div>
                <div class="settings-item">
                    <label class="x-downloader-label">滚动延迟(ms)</label>
                    <input type="text" class="x-downloader-input" id="scrollInterval" value="1500" pattern="\\d*">
                </div>
            </div>
            <div class="settings-row">
                <div class="settings-item">
                    <label class="x-downloader-label">下载延迟(ms)</label>
                    <input type="text" class="x-downloader-input" id="downloadDelay" value="100" pattern="\\d*">
                </div>
                <div class="settings-item">
                    <label class="x-downloader-label">最大并发</label>
                    <input type="text" class="x-downloader-input" id="maxConcurrent" value="3" pattern="\\d*">
                </div>
            </div>
        </div>

        <div class="action-buttons">
            <button class="action-btn primary" id="startCollect">开始抓取</button>
            <button class="action-btn secondary" id="pauseCollect" disabled>暂停</button>
            <button class="action-btn warning" id="stopCollect" disabled>停止</button>
            <button class="action-btn success" id="startDownload" disabled>下载</button>
        </div>

        <div class="progress-container" id="progressContainer">
            <div class="progress-header">
                <span id="progressText">准备开始</span>
                <span id="progressStats">0%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="active-downloads-panel" id="activeDownloadsList"></div>
        </div>

        <div class="feature-toggle-section">
            <div class="x-downloader-section-title"> Media页增强</div>

            <div class="feature-toggle-row">
                <div class="feature-label">
                    <span>悬浮预览</span>
                    <span class="feature-hint">媒体页 鼠标悬停显示大图</span>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="toggleHoverPreview">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `;

        document.body.appendChild(uiContainer);

        // 创建LOG部分并添加到主UI
        const logSection = createLogSection();
        uiContainer.appendChild(logSection);

        // 初始化预览容器
        const previewContainer = document.createElement('div');
        previewContainer.id = 'x-media-preview-container';
        previewContainer.innerHTML = '<img id="x-media-preview-img" src="" />';
        document.body.appendChild(previewContainer);

        // 初始化文件命名规则
        initNamingPattern();

        // 绑定新功能的开关事件
        document.getElementById('toggleHoverPreview').addEventListener('change', (e) => {
            enableHoverPreview = e.target.checked;
            saveSettings();
        });

        // 绑定原有按钮事件
        floatingBtn.addEventListener('click', toggleUI);
        overlay.addEventListener('click', closeUI);
        document.getElementById('startCollect').onclick = startCollect;
        document.getElementById('pauseCollect').onclick = togglePauseCollect;
        document.getElementById('stopCollect').onclick = stopCollect;
        document.getElementById('startDownload').onclick = startDownload;
        document.getElementById('clearLog').addEventListener('click', clearLog);

        // 事件监听
        function addInputValidation() {
            const inputs = ['downloadDelay', 'maxConcurrent', 'batchSize', 'scrollInterval'];

            inputs.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    // 移除旧的监听器，避免重复绑定
                    input.removeEventListener('input', validateNumber);
                    input.removeEventListener('blur', correctNumberOnBlur);

                    // input事件只用于实时验证和提示
                    input.addEventListener('input', validateNumber);

                    // blur事件用于修正值
                    input.addEventListener('blur', correctNumberOnBlur);
                }
            });
        }

        floatingBtn.addEventListener('click', toggleUI);
        overlay.addEventListener('click', closeUI);

        const startCollectBtn = document.getElementById('startCollect');
        const pauseCollectBtn = document.getElementById('pauseCollect');
        const stopCollectBtn = document.getElementById('stopCollect');
        const startDownloadBtn = document.getElementById('startDownload');

        startCollectBtn.onclick = startCollect;
        pauseCollectBtn.onclick = togglePauseCollect;
        stopCollectBtn.onclick = stopCollect;
        startDownloadBtn.onclick = startDownload;

        // 清空日志按钮事件
        document.getElementById('clearLog').addEventListener('click', clearLog);

        // 日期验证
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        startDateInput.addEventListener('blur', validateDate);
        endDateInput.addEventListener('blur', validateDate);

        // 数字输入框验证
        const numberInputs = document.querySelectorAll('input[pattern="\\d*"]');
        numberInputs.forEach(input => {
            input.addEventListener('input', validateNumber);
        });

        setTimeout(() => {
            addInputValidation();
            // 初始化时验证所有输入框
            validateAllInputs();
        }, 100);
        // 加载保存的设置
        loadSettings();
        initMediaPageFeatures(); // 初始化媒体页功能
    }

    // 添加验证所有输入框的函数
    function validateAllInputs() {
        const inputs = ['downloadDelay', 'maxConcurrent', 'batchSize', 'scrollInterval'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                const event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
            }
        });
    }

    // 初始化文件命名规则
    function initNamingPattern() {
        const patternTags = document.getElementById('patternTags');
        if (!patternTags) return;

        const patternElements = [
            { id: 'displayName', name: '用户显示名' },
            { id: 'username', name: '用户名' },
            { id: 'tweetId', name: '推文ID' },
            { id: 'postDate', name: '发布日期' },
            { id: 'time', name: '发布时间' },
            { id: 'mediaId', name: '媒体ID' } // [新增]
        ];

        // 初始化所有标签
        patternElements.forEach(element => {
            const tag = document.createElement('div');
            tag.className = 'pattern-tag';
            tag.textContent = element.name;
            tag.dataset.id = element.id;
            tag.draggable = true;

            tag.addEventListener('click', () => {
                tag.classList.toggle('active');
                savePatternToConfig();
            });

            tag.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', element.id);
                tag.classList.add('dragging');
            });

            tag.addEventListener('dragend', () => {
                tag.classList.remove('dragging');
            });

            tag.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            tag.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/plain');
                const target = e.target.closest('.pattern-tag');

                if (!target || target.dataset.id === draggedId) return;

                const draggedElement = document.querySelector(`.pattern-tag[data-id="${draggedId}"]`);
                const allTags = Array.from(document.querySelectorAll('.pattern-tag'));
                const targetIndex = allTags.indexOf(target);
                const draggedIndex = allTags.indexOf(draggedElement);

                if (draggedIndex > targetIndex) {
                    patternTags.insertBefore(draggedElement, target);
                } else {
                    patternTags.insertBefore(draggedElement, target.nextSibling);
                }

                savePatternToConfig();
            });

            patternTags.appendChild(tag);
        });

        loadPatternFromConfig();
    }

    // ==================== 修改 loadPatternFromConfig 修复旧配置缺标签问题 ====================
    function loadPatternFromConfig() {
        const patternTags = document.getElementById('patternTags');
        const settings = JSON.parse(localStorage.getItem('xDownloaderSettings') || '{}');

        const savedOrder = settings.patternOrder || ['displayName', 'username', 'tweetId', 'postDate', 'time', 'mediaId'];
        const savedActive = settings.fileNamePattern || ['displayName', 'postDate'];

        const allTags = Array.from(patternTags.children);
        const tagMap = {};
        allTags.forEach(tag => {
            tagMap[tag.dataset.id] = tag;
            tag.classList.remove('active');
        });

        patternTags.innerHTML = '';

        // 1. 先按保存的顺序添加存在的标签
        savedOrder.forEach(id => {
            if (tagMap[id]) {
                patternTags.appendChild(tagMap[id]);
                if (savedActive.includes(id)) {
                    tagMap[id].classList.add('active');
                }
                // 标记已处理
                delete tagMap[id];
            }
        });

        // 2. [关键修复] 将新增加的但不在保存列表中的标签追加到末尾
        // 防止因为读取旧配置导致新标签无法显示
        for (const id in tagMap) {
            patternTags.appendChild(tagMap[id]);
        }
    }

    function savePatternToConfig() {
        const patternTags = document.getElementById('patternTags');
        const allTags = Array.from(patternTags.children);
        const patternOrder = allTags.map(tag => tag.dataset.id);
        const activeTags = patternTags.querySelectorAll('.pattern-tag.active');
        const fileNamePattern = Array.from(activeTags).map(tag => tag.dataset.id);

        // 获取当前设置
        const currentSettings = JSON.parse(localStorage.getItem('xDownloaderSettings') || '{}');

        // 更新设置
        currentSettings.patternOrder = patternOrder;
        currentSettings.fileNamePattern = fileNamePattern;

        localStorage.setItem('xDownloaderSettings', JSON.stringify(currentSettings));
    }

    function validateDate(e) {
        const input = e.target;
        const value = input.value.trim();
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const startDateValue = startDateInput.value.trim();
        const endDateValue = endDateInput.value.trim();

        // 验证日期格式
        if (value && !/^\d{8}$/.test(value)) {
            input.style.borderColor = '#f91880';
            showNotification('日期格式错误，请使用YYYYMMDD格式', 'error');
            return;
        }

        // 验证日期逻辑：结束日期不能早于开始日期
        if (startDateValue && endDateValue && startDateValue > endDateValue) {
            // 自动交换两个日期
            startDateInput.value = endDateValue;
            endDateInput.value = startDateValue;

            startDateInput.style.borderColor = '#f7931a';
            endDateInput.style.borderColor = '#f7931a';

            showNotification('开始日期晚于结束日期，已自动交换', 'warning');

            // 保存设置
            saveSettings();
        } else {
            // 清除错误样式
            input.style.borderColor = '#38444d';
            startDateInput.style.borderColor = '#38444d';
            endDateInput.style.borderColor = '#38444d';
        }
    }

    // 在日期输入框事件监听中添加验证
    function addDateValidation() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput && endDateInput) {
            // 移除旧的事件监听器，避免重复绑定
            startDateInput.removeEventListener('blur', validateDate);
            endDateInput.removeEventListener('blur', validateDate);

            // 添加新的事件监听器
            startDateInput.addEventListener('blur', validateDate);
            endDateInput.addEventListener('blur', validateDate);

            // 初始验证
            validateDate({ target: startDateInput });
        }
    }

    function validateNumber(e) {
        const input = e.target;
        const value = input.value.trim();
        const id = input.id;

        if (value && !/^\d+$/.test(value)) {
            input.style.borderColor = '#f91880';
            showNotification('请输入有效的数字', 'error');
            return;
        }

        const numValue = parseInt(value) || 0;

        // 只进行验证和提示，不立即修正值
        switch(id) {
            case 'downloadDelay':
                if (numValue > 0 && numValue < CONFIG.MIN_DOWNLOAD_DELAY) {
                    input.style.borderColor = '#f91880';
                    input.title = `最小延迟为${CONFIG.MIN_DOWNLOAD_DELAY}ms`;
                } else {
                    input.style.borderColor = '#38444d';
                    input.title = '';
                }
                break;

            case 'maxConcurrent':
                if (numValue > CONFIG.MAX_CONCURRENT_DOWNLOADS_LIMIT) {
                    input.style.borderColor = '#f91880';
                    input.title = `最大并发数为${CONFIG.MAX_CONCURRENT_DOWNLOADS_LIMIT}`;
                } else if (numValue < 1) {
                    input.style.borderColor = '#f91880';
                    input.title = '最小并发数为1';
                } else {
                    input.style.borderColor = '#38444d';
                    input.title = '';
                }
                break;

            case 'batchSize':
                if (numValue < 1) {
                    input.style.borderColor = '#f91880';
                    input.title = '最小抓取数量为1';
                } else {
                    input.style.borderColor = '#38444d';
                    input.title = '';
                }
                break;

            case 'scrollInterval':
                if (numValue < 100) {
                    input.style.borderColor = '#f91880';
                    input.title = '最小滚动间隔为100ms';
                } else {
                    input.style.borderColor = '#38444d';
                    input.title = '';
                }
                break;

            default:
                input.style.borderColor = '#38444d';
                input.title = '';
        }
    }

    function correctNumberOnBlur(e) {
        const input = e.target;
        const value = input.value.trim();
        const id = input.id;

        if (!value) return;

        const numValue = parseInt(value) || 0;
        let correctedValue = numValue;
        let showCorrectionNotification = false;

        // 验证并修正数值
        switch(id) {
            case 'downloadDelay':
                if (numValue < CONFIG.MIN_DOWNLOAD_DELAY) {
                    correctedValue = CONFIG.MIN_DOWNLOAD_DELAY;
                    showCorrectionNotification = true;
                }
                break;

            case 'maxConcurrent':
                if (numValue > CONFIG.MAX_CONCURRENT_DOWNLOADS_LIMIT) {
                    correctedValue = CONFIG.MAX_CONCURRENT_DOWNLOADS_LIMIT;
                    showCorrectionNotification = true;
                } else if (numValue < 1) {
                    correctedValue = 1;
                    showCorrectionNotification = true;
                }
                break;

            case 'batchSize':
                if (numValue < 1) {
                    correctedValue = 1;
                    showCorrectionNotification = true;
                }
                break;

            case 'scrollInterval':
                if (numValue < 100) {
                    correctedValue = 100;
                    showCorrectionNotification = true;
                }
                break;
        }

        // 如果值被修正，更新输入框并显示提示
        if (showCorrectionNotification && correctedValue !== numValue) {
            input.value = correctedValue;

            let message = '';
            switch(id) {
                case 'downloadDelay':
                    message = `下载延迟已自动调整为${correctedValue}ms`;
                    break;
                case 'maxConcurrent':
                    message = `并发下载数已自动调整为${correctedValue}`;
                    break;
                case 'batchSize':
                    message = `抓取数量已自动调整为${correctedValue}`;
                    break;
                case 'scrollInterval':
                    message = `滚动间隔已自动调整为${correctedValue}ms`;
                    break;
            }

            if (message) {
                showNotification(message, 'warning');
            }

            // 修正后保存设置
            saveSettings();
        }

        // 无论是否修正，都清除错误样式
        input.style.borderColor = '#38444d';
        input.title = '';
    }

    // -------------------------- UI相关函数 --------------------------

    function showNotification(message, type = 'info') {
        const notification = document.querySelector('.x-downloader-notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = 'x-downloader-notification';
        notification.classList.add(`notification-${type}`);
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function updateProgressBar(current, total, statusText = '', percentageText = '') {
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText'); // 左侧状态文字
        const progressStats = document.getElementById('progressStats'); // 这里我们复用作为右侧百分比显示

        if (!progressContainer || !progressFill) return;

        progressContainer.style.display = 'block';

        // 计算百分比
        const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

        // 更新样式
        progressFill.style.width = `${percentage}%`;

        // 更新左侧文字 (状态 + 速度)
        if (progressText) progressText.textContent = statusText || `处理中... ${current}/${total}`;

        // 更新右侧文字 (百分比)
        if (progressStats) {
            progressStats.className = 'progress-percentage';
            progressStats.textContent = percentageText || `${percentage}%`;
        }
    }

    function protectDownloaderInputs() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'placeholder') {
                    const target = mutation.target;
                    if (target.id === 'folderName') {
                        const displayName = getDisplayName();
                        if (target.placeholder !== displayName) {
                            setTimeout(() => {
                                target.placeholder = displayName;
                            }, 10);
                        }
                    }
                }
            });
        });

        const folderNameInput = document.getElementById('folderName');
        if (folderNameInput) {
            observer.observe(folderNameInput, {
                attributes: true,
                attributeFilter: ['placeholder']
            });
        }
    }

    function toggleUI() {
        const ui = document.querySelector('.x-downloader-ui');
        const overlay = document.querySelector('.x-downloader-overlay');

        if (isUIOpen) {
            closeUI();
        } else {
            // 每次打开UI时，重置文件夹名称为当前显示名称
            const currentDisplayName = getDisplayName();

            // 延迟设置以确保DOM已完全加载
            setTimeout(() => {
                const folderNameInput = document.getElementById('folderName');
                if (folderNameInput) {
                    folderNameInput.value = currentDisplayName;
                    folderNameInput.placeholder = currentDisplayName;
                }
            }, 100);

            ui.classList.add('open');
            overlay.style.display = 'block';
            isUIOpen = true;

            // 启动输入框保护
            setTimeout(protectDownloaderInputs, 200);
        }
    }

    function closeUI() {
        const ui = document.querySelector('.x-downloader-ui');
        const overlay = document.querySelector('.x-downloader-overlay');

        ui.classList.remove('open');
        overlay.style.display = 'none';
        isUIOpen = false;

        // 保存设置
        saveSettings();
    }

    // -------------------------- 设置管理 --------------------------
    function saveSettings() {
        const settings = {
            fileNamePattern: Array.from(document.querySelectorAll('.pattern-tag.active')).map(t => t.dataset.id),
            patternOrder: Array.from(document.querySelectorAll('.pattern-tag')).map(t => t.dataset.id),
            batchSize: parseInt(document.getElementById('batchSize').value) || 1000,
            scrollInterval: parseInt(document.getElementById('scrollInterval').value) || 1500,
            downloadDelay: Math.max(parseInt(document.getElementById('downloadDelay').value) || 100, 100),
            maxConcurrent: Math.min(parseInt(document.getElementById('maxConcurrent').value) || 3, 10),
            folderName: document.getElementById('folderName').value,
            // 新增配置
            enableHoverPreview: document.getElementById('toggleHoverPreview').checked,
        };
        localStorage.setItem('xDownloaderSettings', JSON.stringify(settings));
        return settings;
    }

    function loadSettings() {
        const s = JSON.parse(localStorage.getItem('xDownloaderSettings') || '{}');
        if (s.batchSize) document.getElementById('batchSize').value = s.batchSize;
        if (s.scrollInterval) document.getElementById('scrollInterval').value = s.scrollInterval;
        if (s.downloadDelay) document.getElementById('downloadDelay').value = s.downloadDelay;
        if (s.maxConcurrent) document.getElementById('maxConcurrent').value = s.maxConcurrent;
        if (s.folderName) document.getElementById('folderName').value = s.folderName;

        // 加载新配置
        if (s.enableHoverPreview !== undefined) {
            document.getElementById('toggleHoverPreview').checked = s.enableHoverPreview;
            enableHoverPreview = s.enableHoverPreview;
        }

        if (document.getElementById('patternTags')) loadPatternFromConfig();
    }


    // -------------------------- 新增：Media页面增强功能 --------------------------

    function initMediaPageFeatures() {
        const container = document.querySelector('body');

        // 悬浮预览逻辑 (事件委托)
        container.addEventListener('mouseover', (e) => {
            if (!window.location.pathname.includes('/media') || !enableHoverPreview) return;

            const target = e.target;
            // 查找 Grid 中的图片链接
            if (target.tagName === 'IMG' && target.src.includes('pbs.twimg.com/media')) {
                if (target.id === 'x-media-preview-img') return; // 忽略预览图本身
                // 忽略详情页大图 (详情页图片通常没有 link 父级或者结构不同，这里简单判断是否在 grid 中)
                if (target.closest('[data-testid="primaryColumn"]')) {
                    handleHoverIn(target);
                }
            }
        });

        container.addEventListener('mouseout', (e) => {
            if (!enableHoverPreview) return;
            const target = e.target;
            if (target.tagName === 'IMG' && target.id !== 'x-media-preview-img') {
                handleHoverOut();
            }
        });

    }

    function handleHoverIn(imgElement) {
        if (hoverTimeout) clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
            const previewContainer = document.getElementById('x-media-preview-container');
            const previewImg = document.getElementById('x-media-preview-img');

            // 获取较大分辨率
            const src = imgElement.src;
            const formatMatch = src.match(/format=([a-zA-Z0-9]+)/);
            const ext = formatMatch ? formatMatch[1] : 'jpg';
            const largeSrc = src.split('?')[0] + `?format=${ext}&name=medium`;

            previewImg.src = largeSrc;

            previewImg.onload = () => {
                const w = previewImg.naturalWidth;
                const h = previewImg.naturalHeight;

                previewImg.className = '';
                // 简单的横竖图判断，CSS中 width: auto 配合 max-width 会自动处理
                if (h > w) {
                    previewImg.classList.add('preview-vertical');
                } else {
                    previewImg.classList.add('preview-horizontal');
                }

                previewContainer.style.display = 'block';
            };
        }, 50);
    }

    function handleHoverOut() {
        if (hoverTimeout) clearTimeout(hoverTimeout);
        const previewContainer = document.getElementById('x-media-preview-container');
        if (previewContainer) {
            previewContainer.style.display = 'none';
            document.getElementById('x-media-preview-img').src = '';
        }
    }

    // -------------------------- UI事件处理 --------------------------

    function updateButtonState(state, count = 0) {
        const startBtn = document.getElementById('startCollect');
        const pauseBtn = document.getElementById('pauseCollect');
        const stopBtn = document.getElementById('stopCollect');
        const downloadBtn = document.getElementById('startDownload');
        if (!startBtn || !pauseBtn || !stopBtn || !downloadBtn) return;

        // 1. 清理所有特殊状态类
        [startBtn, pauseBtn, stopBtn, downloadBtn].forEach(btn => {
            btn.classList.remove('paused-active', 'save-zip', 'success', 'warning');
        });

        switch(state) {
            case 'idle':
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                stopBtn.disabled = true;
                downloadBtn.disabled = imageLinksSet.size === 0;

                pauseBtn.textContent = '暂停';
                pauseBtn.onclick = togglePauseCollect;

                startBtn.textContent = '开始抓取';
                downloadBtn.textContent = '下载';
                downloadBtn.onclick = startDownload;

                if (imageLinksSet.size > 0) downloadBtn.classList.add('success');
                // 闲置状态下，Stop 按钮是禁用的，颜色由 disabled CSS 控制，不需要 warning 类
                break;

            case 'collecting':
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                downloadBtn.disabled = true;
                pauseBtn.textContent = '暂停';
                stopBtn.classList.add('warning');
                break;

            case 'paused':
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                stopBtn.disabled = false;
                downloadBtn.disabled = true;
                pauseBtn.textContent = '继续';
                pauseBtn.classList.add('paused-active');
                stopBtn.classList.add('warning');
                break;

            case 'downloading':
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                pauseBtn.onclick = () => Downloader.pause();
                pauseBtn.textContent = '暂停';

                stopBtn.disabled = false;
                stopBtn.onclick = () => Downloader.stop();

                downloadBtn.disabled = true;
                downloadBtn.textContent = '下载中...';

                stopBtn.classList.add('warning');
                break;

            case 'downloadPaused':
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                pauseBtn.textContent = '继续';
                pauseBtn.classList.add('paused-active');
                pauseBtn.onclick = () => Downloader.resume();

                stopBtn.disabled = false;
                downloadBtn.disabled = true;

                stopBtn.classList.add('warning');
                break;

            case 'downloadStoppedWaitSave':
                startBtn.disabled = true;
                pauseBtn.disabled = true;
                stopBtn.disabled = false;
                stopBtn.textContent = '放弃';
                stopBtn.onclick = () => {
                    updateButtonState('completed');
                    showNotification('已放弃保存', 'info');
                };

                stopBtn.classList.add('warning');

                downloadBtn.disabled = false;
                downloadBtn.classList.add('save-zip');
                downloadBtn.textContent = `保存已下载 (${count})`;
                downloadBtn.onclick = () => Downloader.saveZip();
                break;

            case 'completed':
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                stopBtn.disabled = true;
                downloadBtn.disabled = false;

                pauseBtn.textContent = '暂停';
                pauseBtn.onclick = togglePauseCollect;
                stopBtn.textContent = '停止';
                stopBtn.onclick = stopCollect;
                downloadBtn.textContent = '下载';
                downloadBtn.onclick = startDownload;

                downloadBtn.classList.add('success');
                break;
        }
    }

    async function startCollect() {
        await autoScrollAndCollectImages();
    }

    function togglePauseCollect() {
        isPaused = !isPaused;
        if (isPaused) {
            updateButtonState('paused');
            showNotification('收集已暂停', 'warning');
            addToLog('收集已暂停', false);
        } else {
            updateButtonState('collecting');
            showNotification('继续收集...', 'info');
            addToLog('继续收集...', false);
        }
    }

    function stopCollect() {
        isCollecting = false;
        isPaused = false;
        cancelDownload = true;
        Downloader.cancel();
        updateButtonState('idle');
    }

    function startDownload() {
        downloadCollectedImages();
    }


    function addDownloadButtonsToTweets() {

        const images = Array.from(document.querySelectorAll('img[src*="pbs.twimg.com/media/"]'));

        // 1. 按推文ID分组图片
        const tweetGroups = new Map();

        images.forEach(img => {
            const info = getTweetInfoFromElement(img);
            if (!info) return;

            if (!tweetGroups.has(info.tweetId)) {
                tweetGroups.set(info.tweetId, []);
            }
            tweetGroups.get(info.tweetId).push(img);
        });

        // 2. 遍历每一组推文图片处理
        tweetGroups.forEach((imgList, tweetId) => {
            // 查找这一组图片的公共容器
            const targetContainer = findCommonContainer(imgList);
            if (!targetContainer) return;

            // 防止重复添加 (检查容器是否已有按钮)
            if (targetContainer.querySelector('.x-downloader-tweet-btns')) return;

            // 标记容器需要定位
            const computedStyle = window.getComputedStyle(targetContainer);
            if (computedStyle.position === 'static') {
                targetContainer.style.position = 'relative';
            }

            // 3. 创建按钮容器
            const btnContainer = document.createElement('div');
            btnContainer.className = 'x-downloader-tweet-btns';
            btnContainer.style.cssText = `
                position: absolute;
                top: 6px;
                right: 6px;
                z-index: 100;
                display: flex;
                gap: 4px;
                pointer-events: auto; /* 确保按钮可点击 */
            `;

            // 4. 根据数量添加按钮
            if (imgList.length === 1) {
                // 单图
                const downloadBtn = createDownloadButton('📥', '#1DA1F2', (e) => {
                    e.stopPropagation(); e.preventDefault();
                    downloadTweetImages(tweetId, targetContainer, false, false);
                });
                btnContainer.appendChild(downloadBtn);
            } else {
                // 多图
                const downloadAllBtn = createDownloadButton('📥全部', '#1DA1F2', (e) => {
                    e.stopPropagation(); e.preventDefault();
                    downloadTweetImages(tweetId, targetContainer, false, true);
                });
                const downloadExcludeFirstBtn = createDownloadButton('📥其他', '#f7931a', (e) => {
                    e.stopPropagation(); e.preventDefault();
                    downloadTweetImages(tweetId, targetContainer, true, true);
                });
                btnContainer.appendChild(downloadAllBtn);
                btnContainer.appendChild(downloadExcludeFirstBtn);
            }

            targetContainer.appendChild(btnContainer);
        });
    }

    // 创建下载按钮的辅助函数
    function createDownloadButton(text, color, onClick) {
        const btn = document.createElement('button');
        btn.className = 'x-downloader-tweet-btn';
        btn.textContent = text;
        btn.title = text === '📥' ? '下载原图' :
        text === '📥全部' ? '下载所有原图' :
        '下载排除首图';
        btn.style.cssText = `
            background: ${color};
            color: white;
            border: none;
            border-radius: 12px;
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.2s;
            width: auto; /* 避免填满容器 */
            display: inline-block; /* 确保宽度自适应内容 */
        `;
        btn.onmouseenter = () => btn.style.opacity = '0.8';
        btn.onmouseleave = () => btn.style.opacity = '0.3';
        btn.onclick = onClick;
        return btn;
    }

    // 下载单个推文的图片
    async function downloadTweetImages(tweetId, container, excludeFirst = false, useDelay = true) {
        try {
            // 1. 重新收集当前推文的所有图片链接（确保最新）
            const allMedia = Array.from(container.querySelectorAll('img[src*="pbs.twimg.com/media/"]'));
            const tweetImages = [];
            let accurateUsername = '';
            let authorDisplayName = '';

            allMedia.forEach(img => {
                const info = getTweetInfoFromElement(img);
                if (info && info.tweetId === tweetId) {
                    const formatMatch = img.src.match(/format=([a-zA-Z0-9]+)/);
                    const ext = formatMatch ? formatMatch[1] : 'jpg';
                    const url = img.src.split('?')[0] + `?format=${ext}&name=orig`;

                    if (!tweetImages.includes(url)) {
                        tweetImages.push(url);
                    }
                    if (!accurateUsername) accurateUsername = info.username;
                }
            });

            if (tweetImages.length === 0) {
                showNotification('未找到图片', 'warning');
                return;
            }

            let imagesToDownload = tweetImages;
            if (excludeFirst && tweetImages.length > 1) {
                imagesToDownload = tweetImages.slice(1);
            }

            // 关键：提前准备好每张图的完整 metadata
            const postDate = getDateFromTweetId(tweetId)?.toISOString() || 'unknown';
            const authorUsername = accurateUsername || getUsername();
            authorDisplayName = extractDisplayName(container, authorUsername);

            const finalUrlsWithMeta = imagesToDownload.map((url, idx) => {
                const realIndex = excludeFirst ? idx + 1 : idx;
                // 提取 Media ID (新增)
                const mediaIdMatch = url.match(/\/media\/([^\/?]+)/);
                const mediaId = mediaIdMatch ? mediaIdMatch[1] : 'unknown';

                imageMetadataMap.set(url, {
                    tweetId,
                    postDate,
                    index: realIndex,
                    authorUsername,
                    authorDisplayName,
                    mediaId // 新增
                });
                return url;
            });

            showNotification(`开始下载推文 ${tweetId} 的 ${finalUrlsWithMeta.length} 张图片...`, 'info');
            addToLog(`单推文下载 → ${tweetId}，共 ${finalUrlsWithMeta.length} 张`, false);

            // 直接复用主下载器
            await Downloader.add(finalUrlsWithMeta);

        } catch (err) {
            console.error('单推文下载异常:', err);
            showNotification('下载失败', 'error');
        }
    }

    // -------------------------- 初始化 --------------------------
    (function init() {
        console.log('X图片下载器初始化...');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
        // 在UI创建完成后初始化日期验证
        setTimeout(() => {
            addDateValidation();
        }, 100);

        // 添加推文下载按钮
        setTimeout(() => {
            addDownloadButtonsToTweets();

            // 优化MutationObserver逻辑
            let processTimeout = null;

            const observer = new MutationObserver((mutations) => {
                // 检查是否有新的推文或图片被添加
                const hasNewContent = mutations.some(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        return Array.from(mutation.addedNodes).some(node => {
                            if (node.nodeType === 1) {
                                // 只要有新的 article (推文) 或 img (图片) 出现，就触发检查
                                return node.matches('article') ||
                                    node.querySelector('article') ||
                                    node.matches('img') ||
                                    node.querySelector('img');
                            }
                            return false;
                        });
                    }
                    return false;
                });

                if (hasNewContent) {
                    if (processTimeout) clearTimeout(processTimeout);
                    // 防抖处理
                    processTimeout = setTimeout(() => {
                        addDownloadButtonsToTweets();
                        processTimeout = null;
                    }, 500);
                }
            });

            // 观察整个body的子节点变化和子树变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }, 2000);

        // 显示加载成功通知
        setTimeout(() => {
            showNotification('X图片下载器已加载', 'success');
        }, 1000);
    })();
})();