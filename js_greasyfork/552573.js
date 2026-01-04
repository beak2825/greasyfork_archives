// ==UserScript==
// @name         Bilibili收藏夹自动分类
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  B站收藏夹视频自动分类，统一玻璃美学设计，原脚本来源于 https://github.com/jqwgt
// @author       RSYHN
// @license      GPL-3.0-or-later
// @match        *://space.bilibili.com/*/favlist*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.bilibili.com
// @note         原脚本来源于 https://github.com/jqwgt
// @downloadURL https://update.greasyfork.org/scripts/552573/Bilibili%E6%94%B6%E8%97%8F%E5%A4%B9%E8%87%AA%E5%8A%A8%E5%88%86%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/552573/Bilibili%E6%94%B6%E8%97%8F%E5%A4%B9%E8%87%AA%E5%8A%A8%E5%88%86%E7%B1%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * @file Bilibili Favorites Auto-Classifier
     * @author RSYHN
     * This script provides functionality to automatically classify videos in a Bilibili favorites folder
     * based on their official video partitions. It features a configurable glassmorphism UI,
     * allowing users to move or copy videos into new or existing folders.
     */

    // --- Configuration Constants ---

    /**
     * Global configuration for API requests and processing.
     * @property {number} RATE_LIMIT_DELAY - Delay in milliseconds between write operations (add/remove video).
     * @property {number} INFO_FETCH_DELAY - Delay in milliseconds between fetching video details.
     * @property {number} BATCH_SIZE - Number of videos to fetch per API request to a favorites folder.
     * @property {number} MAX_RETRY_ATTEMPTS - Maximum number of retry attempts for a failed API request.
     */
    const CONFIG = {
        RATE_LIMIT_DELAY: 300,
        INFO_FETCH_DELAY: 300,
        BATCH_SIZE: 20,
        MAX_RETRY_ATTEMPTS: 3
    };

    // --- Error Messages ---
    const ERROR_MESSAGES = {
        NETWORK_ERROR: '网络请求失败，请检查网络连接',
        API_LIMIT: 'API调用频率限制，请稍后重试',
        INVALID_RESPONSE: '服务器返回无效响应',
        CSRF_MISSING: '缺少CSRF令牌，请重新登录',
        FOLDER_NOT_FOUND: '收藏夹ID未找到，请在具体的收藏夹页面运行脚本',
        USER_CANCELLED: '用户取消操作',
        VIDEO_INFO_FAILED: '视频信息获取失败'
    };

    // --- Unified Glass Style System ---
    GM_addStyle(`
        :root {
            --glass-bg: rgba(255, 255, 255, 0.08);
            --glass-border: rgba(255, 255, 255, 0.12);
            --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            --glass-inset-light: inset 0 1px 0 rgba(255, 255, 255, 0.15);
            --glass-inset-dark: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
            --text-primary: rgba(255, 255, 255, 0.95);
            --text-secondary: rgba(255, 255, 255, 0.7);
            --text-muted: rgba(255, 255, 255, 0.5);
            --primary-color: #00a1d6;
            --primary-gradient: linear-gradient(135deg, #00a1d6, #00c4ff);
            --blur-intensity: 35px;
            --saturation: 180%;
            --border-radius: 16px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --primary-opacity: 0.4;
            --secondary-opacity: 0.1;
            --danger-opacity: 0.4;
            --glass-opacity: 0.05;
            --glass-border-opacity: 0.1;
        }
        .bili-classifier-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
            color: var(--text-primary);
        }
        /* 统一玻璃基础样式 */
        .bili-classifier-glass {
            background: rgba(255, 255, 255, var(--glass-opacity)) !important;
            backdrop-filter: blur(var(--blur-intensity)) saturate(var(--saturation));
            -webkit-backdrop-filter: blur(var(--blur-intensity)) saturate(var(--saturation));
            border: 1px solid rgba(255, 255, 255, var(--glass-border-opacity));
            border-radius: var(--border-radius);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                       var(--glass-inset-light),
                       var(--glass-inset-dark);
        }
        /* 卡片专用玻璃效果 */
        .bili-classifier-card {
            background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.6)) !important;
            backdrop-filter: blur(40px) saturate(160%);
            -webkit-backdrop-filter: blur(40px) saturate(160%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: var(--border-radius);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08),
                       inset 0 1px 0 rgba(255, 255, 255, 0.1),
                       inset 0 -1px 0 rgba(0, 0, 0, 0.02);
        }
        /* 模态框 */
        .bili-classifier-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, calc(var(--glass-opacity) * 1.2)) !important;
            backdrop-filter: blur(50px) saturate(180%);
            -webkit-backdrop-filter: blur(50px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: var(--border-radius);
            padding: 30px 25px 25px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
                       var(--glass-inset-light),
                       var(--glass-inset-dark);
            z-index: 10000;
            max-height: 80vh;
            overflow-y: auto;
            width: 700px;
            max-width: 90vw;
            display: flex;
            flex-direction: column;
        }
        /* 进度条 */
        .bili-classifier-progress {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.8)) !important;
            backdrop-filter: blur(35px) saturate(170%);
            -webkit-backdrop-filter: blur(35px) saturate(170%);
            padding: 15px 20px;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12),
                       var(--glass-inset-light);
            z-index: 10000;
            min-width: 250px;
            color: var(--text-primary);
        }
        /* 统一按钮系统 */
        .bili-classifier-btn {
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: var(--border-radius);
            color: var(--text-primary);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            height: 32px;
            min-width: auto;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), var(--glass-inset-light);
            white-space: nowrap;
            border: none;
            outline: none;
        }
        .bili-classifier-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2), var(--glass-inset-light);
        }
        .bili-classifier-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), var(--glass-inset-light);
        }
        /* 主要按钮样式 */
        .bili-classifier-btn.primary {
            background: linear-gradient(135deg,
                rgba(var(--primary-rgb, 0, 161, 214), var(--primary-opacity)),
                rgba(var(--primary-dark-rgb, 0, 140, 190), calc(var(--primary-opacity) - 0.1)));
            border: 1px solid rgba(var(--primary-rgb, 0, 161, 214), 0.5);
            box-shadow: 0 4px 20px rgba(var(--primary-rgb, 0, 161, 214), 0.3), var(--glass-inset-light);
        }
        .bili-classifier-btn.primary:hover {
            background: linear-gradient(135deg,
                rgba(var(--primary-rgb, 0, 161, 214), calc(var(--primary-opacity) + 0.1)),
                rgba(var(--primary-dark-rgb, 0, 140, 190), var(--primary-opacity)));
            border-color: rgba(var(--primary-rgb, 0, 161, 214), 0.7);
            box-shadow: 0 6px 28px rgba(var(--primary-rgb, 0, 161, 214), 0.4), var(--glass-inset-light);
        }
        .bili-classifier-btn.secondary {
            background: rgba(var(--secondary-rgb, 255, 255, 255), var(--secondary-opacity));
            border: 1px solid rgba(var(--secondary-rgb, 255, 255, 255), 0.2);
        }
        .bili-classifier-btn.danger {
            background: linear-gradient(135deg,
                rgba(var(--danger-rgb, 255, 77, 79), var(--danger-opacity)),
                rgba(var(--danger-dark-rgb, 220, 60, 60), calc(var(--danger-opacity) - 0.1)));
            border: 1px solid rgba(var(--danger-rgb, 255, 77, 79), 0.5);
            box-shadow: 0 4px 20px rgba(var(--danger-rgb, 255, 77, 79), 0.3), var(--glass-inset-light);
        }
        .bili-classifier-btn.danger:hover {
            background: linear-gradient(135deg,
                rgba(var(--danger-rgb, 255, 77, 79), calc(var(--danger-opacity) + 0.1)),
                rgba(var(--danger-dark-rgb, 220, 60, 60), var(--danger-opacity)));
            border-color: rgba(var(--danger-rgb, 255, 77, 79), 0.7);
        }
        .bili-classifier-btn.icon {
            padding: 6px;
            width: 32px;
            height: 32px;
            min-width: 32px;
        }
        .bili-classifier-btn.icon:hover {
            transform: scale(1.05);
        }
        .bili-classifier-modal > h3:first-child {
            font-size: 24px;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 20px;
            font-weight: 600;
            line-height: 1.4;
            padding: 8px 0 5px;
            min-height: 40px;
            display: flex;
            align-items: center;
        }
        /* 主按钮区域 */
        .bili-classifier-main-buttons {
            display: flex;
            gap: 8px;
            align-items: center;
            padding: 0;
            background: transparent;
            backdrop-filter: none;
            border-radius: 16px;
            border: none;
            margin-bottom: 0;
        }
        /* 分组容器 */
        .bili-classifier-group {
            margin: 15px 0;
            padding: 15px;
            background: rgba(255, 255, 255, calc(var(--glass-opacity) * 0.625));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06),
                       inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        /* 输入框和选择框 */
        .bili-classifier-input,
        .bili-classifier-select {
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 16px;
            color: var(--text-primary);
            font-size: 13px;
            transition: var(--transition);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1),
                       inset 0 1px 0 rgba(255, 255, 255, 0.05);
            width: 200px;
            height: 32px;
            box-sizing: border-box;
            border: none;
            outline: none;
        }
        .bili-classifier-select {
            color: var(--select-text-color, #000000);
        }
        .bili-classifier-input:focus,
        .bili-classifier-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(0, 161, 214, 0.2),
                       0 2px 8px rgba(0, 0, 0, 0.1);
            background: rgba(255, 255, 255, 0.15);
        }
        .bili-classifier-input::placeholder {
            color: var(--text-muted);
        }
        /* 复选框组 */
        .bili-classifier-checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 8px;
            margin-top: 10px;
        }
        .bili-classifier-checkbox-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 16px;
            transition: var(--transition);
            border: 1px solid transparent;
            color: var(--text-primary);
        }
        .bili-classifier-checkbox-label:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.1);
        }
        .bili-classifier-checkbox {
            margin-right: 8px;
            accent-color: var(--primary-color);
        }
        /* 进度条 */
        .bili-classifier-progress-bar {
            width: 100%;
            height: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            margin: 8px 0;
            overflow: hidden;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .bili-classifier-progress-fill {
            height: 100%;
            background: var(--primary-gradient);
            border-radius: 16px;
            transition: width 0.3s;
            box-shadow: 0 0 10px rgba(0, 196, 255, 0.4);
        }
        /* 浮动按钮容器 */
        .bili-classifier-float-btn {
            position: fixed;
            right: 30px;
            bottom: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
        }
        /* 链接按钮 */
        .bili-classifier-link-btn {
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: var(--transition);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            height: 32px;
        }
        .bili-classifier-link-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.15);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            color: var(--text-primary);
        }
        /* 设置模态框 */
        .bili-classifier-settings-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, calc(var(--glass-opacity) * 1.2)) !important;
            backdrop-filter: blur(50px) saturate(180%);
            -webkit-backdrop-filter: blur(50px) saturate(180%);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12),
                       var(--glass-inset-light);
            z-index: 10001;
            width: 320px;
        }
        /* 单选按钮组 */
        .bili-classifier-radio-group {
            display: flex;
            gap: 15px;
            margin: 15px 0;
        }
        .bili-classifier-radio-label {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 16px;
            transition: var(--transition);
            border: 1px solid transparent;
            color: var(--text-primary);
        }
        .bili-classifier-radio-label:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.1);
        }
        /* 页脚 */
        .bili-classifier-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            margin-top: auto;
        }
        /* 标题样式 */
        h3, h4 {
            color: var(--text-primary);
            margin: 0 0 20px;
            font-weight: 600;
        }
        h3 {
            font-size: 24px;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        h4 {
            font-size: 18px;
            color: var(--text-secondary);
        }
        /* 选项组 */
        .bili-classifier-option-group {
            margin: 15px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
        }
        /* 内容区域 */
        .bili-classifier-content {
            flex: 1;
            overflow-y: auto;
            padding-right: 10px;
            margin-top: 5px;
        }
        /* 自定义滚动条 */
        .bili-classifier-content::-webkit-scrollbar {
            width: 6px;
        }
        .bili-classifier-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }
        .bili-classifier-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }
        .bili-classifier-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        /* 设置组样式 */
        .bili-classifier-settings-group {
            margin: 15px 0;
        }
        .bili-classifier-settings-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-primary);
        }
        .bili-classifier-settings-input {
            width: 100%;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 24px;
            color: var(--text-primary);
            box-sizing: border-box;
            border: none;
            outline: none;
        }
        .bili-classifier-settings-hint {
            margin-top: 4px;
            font-size: 12px;
            color: var(--text-muted);
        }
        .bili-classifier-settings-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        /* 主题切换按钮 */
        .bili-classifier-theme-toggle {
            position: relative;
            width: 48px;
            height: 24px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            cursor: pointer;
            transition: var(--transition);
        }
        .bili-classifier-theme-toggle::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            transition: transform 0.3s ease;
        }
        .bili-classifier-theme-toggle.active {
            background: rgba(0, 161, 214, 0.3);
        }
        .bili-classifier-theme-toggle.active::before {
            transform: translateX(24px);
        }
        /* 链接组 */
        .bili-classifier-links {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        /* 按钮组 */
        .bili-classifier-footer-buttons {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .bili-classifier-float-links {
            display: flex;
            gap: 10px;
        }
        .bili-classifier-group-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            gap: 10px;
        }
       /* 二级菜单样式 */
        .bili-classifier-submenu {
            margin-top: 10px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            width: 100%;
            box-sizing: border-box;
        }
        .bili-classifier-submenu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 4px 0;
            font-size: 13px;
        }
        .bili-classifier-submenu-content {
            margin-top: 8px;
            display: none;
        }
        .bili-classifier-submenu-content.expanded {
            display: block;
        }
        .bili-classifier-submenu-arrow {
            transition: transform 0.3s ease;
        }
        .bili-classifier-submenu-arrow.expanded {
            transform: rotate(180deg);
        }
        /* 全局界面透明度选择框 */
        .bili-classifier-settings-group .bili-classifier-opacity-slider {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            outline: none;
            -webkit-appearance: none;
            max-width: none;
        }
        .bili-classifier-settings-group .bili-classifier-opacity-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: var(--primary-color);
            border-radius: 50%;
            cursor: pointer;
        }
        .bili-classifier-settings-group .bili-classifier-opacity-value {
            min-width: 40px;
            font-size: 13px;
            text-align: center;
            color: var(--text-muted);
        }
        /* 紧凑颜色设置样式 */
        .bili-classifier-color-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 10px;
        }
        .bili-classifier-color-item {
            display: flex;
            align-items: center;
            gap: 6px;
            width: 100%;
            max-width: 260px;
        }
        .bili-classifier-color-label {
            min-width: 70px;
            font-size: 11px;
            color: var(--text-secondary);
            font-weight: 500;
        }
        .bili-classifier-color-input {
            width: 24px;
            height: 24px;
            padding: 0;
            border: none;
            border-radius: 0px;
            cursor: pointer;
            flex-shrink: 0;
        }
        /* 颜色设置内的紧凑滑块样式 */
        .bili-classifier-color-item .bili-classifier-opacity-slider {
            flex: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            outline: none;
            -webkit-appearance: none;
            max-width: 100px;
            margin: 0 4px;
        }
        .bili-classifier-color-item .bili-classifier-opacity-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: var(--primary-color);
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .bili-classifier-color-item .bili-classifier-opacity-value {
            min-width: 35px;
            font-size: 10px;
            text-align: center;
            color: var(--text-muted);
            font-weight: 500;
            white-space: nowrap;
            flex-shrink: 0;
        }
        /* 高级玻璃效果设置 */
        .bili-classifier-advanced-item {
            display: flex;
            align-items: center;
            gap: 6px;
            width: 100%;
            max-width: 260px;
            margin-bottom: 8px;
        }
        .bili-classifier-advanced-label {
            min-width: 80px;
            font-size: 11px;
            color: var(--text-secondary);
            font-weight: 500;
        }
        .bili-classifier-advanced-slider {
            flex: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            outline: none;
            -webkit-appearance: none;
            max-width: 120px;
            margin: 0 4px;
        }
        .bili-classifier-advanced-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: var(--primary-color);
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .bili-classifier-advanced-value {
            min-width: 40px;
            font-size: 10px;
            text-align: center;
            color: var(--text-muted);
            font-weight: 500;
            white-space: nowrap;
            flex-shrink: 0;
        }
        /* 当前收藏夹名称显示 */
        .current-folder-name {
            color: var(--text-secondary);
            font-size: 13px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    `);

    // --- Utility Functions ---

    /**
     * A collection of utility functions for common tasks.
     * @namespace utils
     */
    const utils = {
        /**
         * Retrieves the Bilibili CSRF token from cookies.
         * @returns {string} The CSRF token (bili_jct).
         */
        getCsrf() {
            const match = document.cookie.match(/bili_jct=([^;]+)/);
            return match ? match[1] : '';
        },

        /**
         * Logs a message to the console with custom styling.
         * @param {string} message - The message to log.
         * @param {'info'|'error'|'success'|'warning'} [type='info'] - The type of log message.
         */
        log(message, type = 'info') {
            const styles = {
                info: 'color: #00a1d6',
                error: 'color: #ff4d4f',
                success: 'color: #52c41a',
                warning: 'color: #faad14'
            };
            console.log(`%c[收藏夹分类] ${message}`, styles[type] || styles.info);
        },

        /**
         * A robust wrapper for GM_xmlhttpRequest that includes automatic retries.
         * @param {object} options - The options for GM_xmlhttpRequest.
         * @returns {Promise<object|string>} A promise that resolves with the parsed JSON response or response text.
         * @throws {Error} Throws an error if the request fails after all retry attempts.
         */
        async apiRequest(options) {
            let lastError;
            for (let attempt = 1; attempt <= CONFIG.MAX_RETRY_ATTEMPTS; attempt++) {
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            ...options,
                            timeout: 30000,
                            onload: resolve,
                            onerror: reject,
                            ontimeout: reject
                        });
                    });

                    const status = response.status;
                    if (status >= 200 && status < 300) {
                        try {
                            return typeof response.response === 'string' ?
                                JSON.parse(response.response) :
                                response.response;
                        } catch (parseError) {
                            return response.responseText || response.response;
                        }
                    } else if (status === 429 && attempt < CONFIG.MAX_RETRY_ATTEMPTS) {
                        // Rate limited, wait and retry
                        await this.delay(1000 * attempt);
                        continue;
                    } else {
                        throw new Error(`${ERROR_MESSAGES.INVALID_RESPONSE}: ${status} ${response.statusText}`);
                    }
                } catch (error) {
                    lastError = error;
                    if (attempt < CONFIG.MAX_RETRY_ATTEMPTS) {
                        await this.delay(1000 * attempt);
                    }
                }
            }

            throw lastError || new Error(ERROR_MESSAGES.NETWORK_ERROR);
        },

        /**
         * Creates a delay for a specified number of milliseconds.
         * @param {number} ms - The delay duration in milliseconds.
         * @returns {Promise<void>} A promise that resolves after the delay.
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        /**
         * Safely queries for a single DOM element.
         * @param {string} selector - The CSS selector.
         * @param {Document|Element} [context=document] - The context to search within.
         * @returns {Element|null} The found element or null.
         */
        querySafe(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (error) {
                utils.log(`DOM查询失败: ${error.message}`, 'warning');
                return null;
            }
        },

        /**
         * Safely queries for all matching DOM elements.
         * @param {string} selector - The CSS selector.
         * @param {Document|Element} [context=document] - The context to search within.
         * @returns {Element[]} An array of found elements.
         */
        queryAllSafe(selector, context = document) {
            try {
                return Array.from(context.querySelectorAll(selector));
            } catch (error) {
                utils.log(`DOM查询失败: ${error.message}`, 'warning');
                return [];
            }
        },

        /**
         * Converts a HEX color string to an RGB array.
         * @param {string} hex - The hex color string (e.g., '#00a1d6').
         * @returns {number[]} An array of [r, g, b] values, or a default blue if conversion fails.
         */
        hexToRgb(hex) {
            if (!hex || typeof hex !== 'string') {
                return [0, 161, 214]; // Default Bilibili blue
            }

            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : [0, 161, 214];
        },

        /**
         * Adjusts the brightness of an RGB color.
         * @param {number[]} rgb - An array of [r, g, b] values.
         * @param {number} amount - The amount to adjust brightness by (positive for lighter, negative for darker).
         * @returns {number[]} The new, clamped [r, g, b] array.
         */
        adjustColor(rgb, amount) {
            if (!Array.isArray(rgb) || rgb.length !== 3) {
                return [0, 161, 214];
            }

            return rgb.map(value => Math.max(0, Math.min(255, value + amount)));
        },

        /**
         * Validates if a value is a valid number.
         * @param {any} value - The value to validate.
         * @param {number} min - Minimum allowed value.
         * @param {number} max - Maximum allowed value.
         * @returns {boolean} True if valid, false otherwise.
         */
        isValidNumber(value, min = -Infinity, max = Infinity) {
            return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
        }
    };

    // --- Settings Manager ---

    /**
     * Manages user settings, including loading, saving, and applying them to the UI.
     * @class
     */
    class SettingsManager {
        constructor() {
            this.settings = {
                recognitionMode: 'all',
                customCount: 100,
                theme: 'light',
                // Color settings
                primaryColor: '#00a1d6',
                primaryOpacity: 0.4,
                secondaryColor: '#ffffff',
                secondaryOpacity: 0.1,
                dangerColor: '#ff4d4f',
                dangerOpacity: 0.4,
                // Global opacity
                glassOpacity: 0.05,
                // Advanced glass effects
                blurIntensity: 35,
                saturation: 180
            };
            this.isModalOpen = false; // 新增：跟踪模态框状态
            this.currentModal = null; // 新增：当前打开的模态框引用
            this.loadSettings();
            this.applyAllSettings();
        }

        /**
         * Loads settings from localStorage.
         */
        loadSettings() {
            try {
                const saved = localStorage.getItem('bili_classifier_settings');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    this.settings = {
                        ...this.settings,
                        ...parsed
                    };
                }
            } catch (error) {
                utils.log('加载设置失败，使用默认设置', 'warning');
            }
        }

        /**
         * Saves the current settings to localStorage.
         * @returns {boolean} True if saving was successful, false otherwise.
         */
        saveSettings() {
            try {
                localStorage.setItem('bili_classifier_settings', JSON.stringify(this.settings));
                return true;
            } catch (error) {
                utils.log('保存设置失败', 'warning');
                return false;
            }
        }

        /**
         * Applies all current settings to the document.
         */
        applyAllSettings() {
            this.applyTheme();
            this.applyColorSettings();
            this.applyGlassOpacity();
            this.applyAdvancedGlassEffects();
        }

        /**
         * Applies the light/dark theme by setting CSS variables.
         */
        applyTheme() {
            const root = document.documentElement;
            if (this.settings.theme === 'light') {
                root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.15)');
                root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.2)');
                root.style.setProperty('--text-primary', 'rgba(0, 0, 0, 0.9)');
                root.style.setProperty('--text-secondary', 'rgba(0, 0, 0, 0.7)');
                root.style.setProperty('--text-muted', 'rgba(0, 0, 0, 0.5)');
                root.style.setProperty('--select-text-color', 'rgba(0, 0, 0, 0.9)');
            } else {
                root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.08)');
                root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.12)');
                root.style.setProperty('--text-primary', 'rgba(255, 255, 255, 0.95)');
                root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
                root.style.setProperty('--text-muted', 'rgba(255, 255, 255, 0.5)');
                root.style.setProperty('--select-text-color', '#000000');
            }
        }

        /**
         * Applies custom color settings by setting CSS variables.
         */
        applyColorSettings() {
            const root = document.documentElement;
            // Primary color
            const primaryRgb = utils.hexToRgb(this.settings.primaryColor);
            const primaryDarkRgb = utils.adjustColor(primaryRgb, -20);
            root.style.setProperty('--primary-color', this.settings.primaryColor);
            root.style.setProperty('--primary-rgb', primaryRgb.join(', '));
            root.style.setProperty('--primary-dark-rgb', primaryDarkRgb.join(', '));
            root.style.setProperty('--primary-gradient',
                `linear-gradient(135deg, ${this.settings.primaryColor}, ${this.getAdjustedColor(this.settings.primaryColor, 20)})`);
            // Button opacities
            root.style.setProperty('--primary-opacity', this.settings.primaryOpacity);
            root.style.setProperty('--secondary-opacity', this.settings.secondaryOpacity);
            root.style.setProperty('--danger-opacity', this.settings.dangerOpacity);
            // Secondary color
            const secondaryRgb = utils.hexToRgb(this.settings.secondaryColor);
            root.style.setProperty('--secondary-rgb', secondaryRgb.join(', '));
            // Danger color
            const dangerRgb = utils.hexToRgb(this.settings.dangerColor);
            const dangerDarkRgb = utils.adjustColor(dangerRgb, -20);
            root.style.setProperty('--danger-rgb', dangerRgb.join(', '));
            root.style.setProperty('--danger-dark-rgb', dangerDarkRgb.join(', '));
            // Update styles that depend on these colors
            this.updateDynamicStyles();
        }

        /**
         * Applies the global glass opacity setting.
         */
        applyGlassOpacity() {
            const root = document.documentElement;
            root.style.setProperty('--glass-opacity', this.settings.glassOpacity);
            root.style.setProperty('--glass-border-opacity', Math.max(0.05, this.settings.glassOpacity * 2));
        }

        /**
         * Applies advanced glass effect settings (blur and saturation).
         */
        applyAdvancedGlassEffects() {
            const root = document.documentElement;
            root.style.setProperty('--blur-intensity', `${this.settings.blurIntensity}px`);
            root.style.setProperty('--saturation', `${this.settings.saturation}%`);
        }

        /**
         * Adjusts a hex color's brightness and returns the new hex string.
         * @param {string} color - The base hex color.
         * @param {number} amount - The amount to adjust brightness by.
         * @returns {string} The new hex color string.
         */
        getAdjustedColor(color, amount) {
            const rgb = utils.hexToRgb(color);
            const adjusted = utils.adjustColor(rgb, amount);
            return `#${adjusted.map(v => v.toString(16).padStart(2, '0')).join('')}`;
        }

        /**
         * Injects or updates a <style> element for CSS that depends dynamically on settings.
         */
        updateDynamicStyles() {
            const styleId = 'bili-classifier-dynamic-styles';
            let styleElement = document.getElementById(styleId);

            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }

            styleElement.textContent = `
                .bili-classifier-progress-fill {
                    background: linear-gradient(135deg, ${this.settings.primaryColor}, ${this.getAdjustedColor(this.settings.primaryColor, 20)});
                }
                h3 {
                    background: linear-gradient(135deg, ${this.settings.primaryColor}, ${this.getAdjustedColor(this.settings.primaryColor, 20)});
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .bili-classifier-theme-toggle::before {
                    background: ${this.settings.primaryColor};
                }
                .bili-classifier-theme-toggle.active {
                    background: rgba(${utils.hexToRgb(this.settings.primaryColor).join(', ')}, 0.3);
                }
            `;
        }

        /**
         * Toggles the theme between 'dark' and 'light'.
         * @returns {string} The new theme name.
         */
        toggleTheme() {
            this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
            this.applyAllSettings();
            return this.settings.theme;
        }

        /**
         * Displays the settings modal dialog with toggle behavior.
         * @returns {Promise<boolean>} A promise that resolves with `true` if settings were saved, `false` otherwise.
         */
        async showSettingsModal() {
            // 如果模态框已经打开，则关闭它
            if (this.isModalOpen && this.currentModal) {
                this.closeSettingsModal();
                return Promise.resolve(false);
            }

            return new Promise((resolve) => {
                // 设置状态为打开
                this.isModalOpen = true;

                const originalSettings = JSON.parse(JSON.stringify(this.settings));

                const modal = document.createElement('div');
                modal.className = 'bili-classifier-settings-modal bili-classifier-glass';
                modal.innerHTML = this.generateSettingsHTML();
                document.body.appendChild(modal);

                this.currentModal = modal;

                // 修改绑定事件，传递关闭函数
                this.bindSettingsEvents(modal, resolve, originalSettings);
            });
        }

        /**
         * 直接关闭设置模态框
         */
        closeSettingsModal() {
            if (this.currentModal) {
                this.currentModal.remove();
                this.currentModal = null;
            }
            this.isModalOpen = false;
        }

        /**
         * Generates the HTML content for the settings modal.
         * @returns {string} The HTML string.
         */
        generateSettingsHTML() {
            return `
                <h3 style="margin-top: 0;">界面设置</h3>
                <div class="bili-classifier-settings-group">
                    <label class="bili-classifier-settings-label">主题模式</label>
                    <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
                        <span style="color: var(--text-secondary);">深色</span>
                        <div class="bili-classifier-theme-toggle ${this.settings.theme === 'light' ? 'active' : ''}" id="themeToggle"></div>
                        <span style="color: var(--text-secondary);">浅色</span>
                    </div>
                </div>
                <div class="bili-classifier-settings-group">
                    <label class="bili-classifier-settings-label">识别模式</label>
                    <div class="bili-classifier-radio-group">
                        <label class="bili-classifier-radio-label">
                            <input type="radio" name="recognitionMode" value="all" ${this.settings.recognitionMode === 'all' ? 'checked' : ''}>
                            全部识别
                        </label>
                        <label class="bili-classifier-radio-label">
                            <input type="radio" name="recognitionMode" value="custom" ${this.settings.recognitionMode === 'custom' ? 'checked' : ''}>
                            自定义识别
                        </label>
                    </div>
                </div>
                <div class="bili-classifier-settings-group" id="customCountGroup" style="${this.settings.recognitionMode === 'custom' ? '' : 'display: none;'}">
                    <label class="bili-classifier-settings-label">最大识别数量</label>
                    <input type="number" class="bili-classifier-settings-input" id="customCountInput"
                           value="${this.settings.customCount}" min="1" max="1000">
                    <div class="bili-classifier-settings-hint">设置每次分类最多处理的视频数量 (1-1000)</div>
                </div>
                <div class="bili-classifier-settings-group">
                    <label class="bili-classifier-settings-label">全局界面透明度</label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="range" class="bili-classifier-opacity-slider" id="glassOpacityInput"
                               value="${this.settings.glassOpacity * 100}" min="0" max="100" step="1" style="flex: 1;">
                        <span class="bili-classifier-opacity-value" id="glassOpacityValue">
                            ${Math.round(this.settings.glassOpacity * 100)}%
                        </span>
                    </div>
                    <div class="bili-classifier-settings-hint">调整所有玻璃UI元素的透明度 (0%-100%)</div>
                </div>
                <div class="bili-classifier-submenu">
                    <div class="bili-classifier-submenu-header" id="colorSettingsToggle">
                        <span style="font-weight: 500; color: var(--text-primary);">颜色设置</span>
                        <svg class="bili-classifier-submenu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 8.84L12 13.42l4.59-4.58L18 10.25l-6 6-6-6z"/>
                        </svg>
                    </div>
                    <div class="bili-classifier-submenu-content" id="colorSettingsContent">
                        <div class="bili-classifier-color-grid">
                            <div class="bili-classifier-color-item">
                                <span class="bili-classifier-color-label">主按钮</span>
                                <input type="color" class="bili-classifier-color-input" id="primaryColorInput" value="${this.settings.primaryColor}">
                                <input type="range" class="bili-classifier-opacity-slider" id="primaryOpacityInput"
                                       value="${this.settings.primaryOpacity * 100}" min="0" max="100" step="5">
                                <span class="bili-classifier-opacity-value" id="primaryOpacityValue">
                                    ${Math.round(this.settings.primaryOpacity * 100)}%
                                </span>
                            </div>
                            <div class="bili-classifier-color-item">
                                <span class="bili-classifier-color-label">次要按钮</span>
                                <input type="color" class="bili-classifier-color-input" id="secondaryColorInput" value="${this.settings.secondaryColor}">
                                <input type="range" class="bili-classifier-opacity-slider" id="secondaryOpacityInput"
                                       value="${this.settings.secondaryOpacity * 100}" min="0" max="100" step="5">
                                <span class="bili-classifier-opacity-value" id="secondaryOpacityValue">
                                    ${Math.round(this.settings.secondaryOpacity * 100)}%
                                </span>
                            </div>
                            <div class="bili-classifier-color-item">
                                <span class="bili-classifier-color-label">危险按钮</span>
                                <input type="color" class="bili-classifier-color-input" id="dangerColorInput" value="${this.settings.dangerColor}">
                                <input type="range" class="bili-classifier-opacity-slider" id="dangerOpacityInput"
                                       value="${this.settings.dangerOpacity * 100}" min="0" max="100" step="5">
                                <span class="bili-classifier-opacity-value" id="dangerOpacityValue">
                                    ${Math.round(this.settings.dangerOpacity * 100)}%
                                </span>
                            </div>
                        </div>
                        <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                            <button class="bili-classifier-btn secondary" id="resetColors" style="font-size: 12px; padding: 4px 8px; height: 24px;">重置颜色</button>
                        </div>
                    </div>
                </div>
                <div class="bili-classifier-submenu">
                    <div class="bili-classifier-submenu-header" id="advancedGlassToggle">
                        <span style="font-weight: 500; color: var(--text-primary);">高级玻璃效果</span>
                        <svg class="bili-classifier-submenu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 8.84L12 13.42l4.59-4.58L18 10.25l-6 6-6-6z"/>
                        </svg>
                    </div>
                    <div class="bili-classifier-submenu-content" id="advancedGlassContent">
                        <div style="margin: 10px 0; font-size: 12px; color: var(--text-muted);">
                            调整这些参数可以获得更接近玻璃的效果
                        </div>
                        <div class="bili-classifier-advanced-item">
                            <span class="bili-classifier-advanced-label">模糊强度</span>
                            <input type="range" class="bili-classifier-advanced-slider" id="blurIntensityInput"
                                   value="${this.settings.blurIntensity}" min="20" max="60" step="5">
                            <span class="bili-classifier-advanced-value" id="blurIntensityValue">
                                ${this.settings.blurIntensity}px
                            </span>
                        </div>
                        <div class="bili-classifier-advanced-item">
                            <span class="bili-classifier-advanced-label">颜色饱和度</span>
                            <input type="range" class="bili-classifier-advanced-slider" id="saturationInput"
                                   value="${this.settings.saturation}" min="120" max="220" step="10">
                            <span class="bili-classifier-advanced-value" id="saturationValue">
                                ${this.settings.saturation}%
                            </span>
                        </div>
                    </div>
                </div>
                <div class="bili-classifier-settings-footer">
                    <button class="bili-classifier-btn secondary" id="cancelSettings">取消</button>
                    <button class="bili-classifier-btn primary" id="saveSettings">保存设置</button>
                </div>
            `;
        }

        /**
         * Binds event listeners to the elements within the settings modal.
         * @param {Element} modal - The modal element.
         * @param {function} resolve - The resolve function of the parent promise.
         * @param {object} originalSettings - The settings object before any changes were made.
         */
        bindSettingsEvents(modal, resolve, originalSettings) {
            const modeRadios = utils.queryAllSafe('input[name="recognitionMode"]', modal);
            const customCountGroup = utils.querySafe('#customCountGroup', modal);
            const customCountInput = utils.querySafe('#customCountInput', modal);
            const cancelBtn = utils.querySafe('#cancelSettings', modal);
            const saveBtn = utils.querySafe('#saveSettings', modal);
            const themeToggle = utils.querySafe('#themeToggle', modal);
            const colorSettingsToggle = utils.querySafe('#colorSettingsToggle', modal);
            const colorSettingsContent = utils.querySafe('#colorSettingsContent', modal);
            const colorSettingsArrow = utils.querySafe('#colorSettingsToggle .bili-classifier-submenu-arrow', modal);
            const primaryColorInput = utils.querySafe('#primaryColorInput', modal);
            const primaryOpacityInput = utils.querySafe('#primaryOpacityInput', modal);
            const primaryOpacityValue = utils.querySafe('#primaryOpacityValue', modal);
            const secondaryColorInput = utils.querySafe('#secondaryColorInput', modal);
            const secondaryOpacityInput = utils.querySafe('#secondaryOpacityInput', modal);
            const secondaryOpacityValue = utils.querySafe('#secondaryOpacityValue', modal);
            const dangerColorInput = utils.querySafe('#dangerColorInput', modal);
            const dangerOpacityInput = utils.querySafe('#dangerOpacityInput', modal);
            const dangerOpacityValue = utils.querySafe('#dangerOpacityValue', modal);
            const resetColorsBtn = utils.querySafe('#resetColors', modal);
            const glassOpacityInput = utils.querySafe('#glassOpacityInput', modal);
            const glassOpacityValue = utils.querySafe('#glassOpacityValue', modal);
            const advancedGlassToggle = utils.querySafe('#advancedGlassToggle', modal);
            const advancedGlassContent = utils.querySafe('#advancedGlassContent', modal);
            const blurIntensityInput = utils.querySafe('#blurIntensityInput', modal);
            const blurIntensityValue = utils.querySafe('#blurIntensityValue', modal);
            const saturationInput = utils.querySafe('#saturationInput', modal);
            const saturationValue = utils.querySafe('#saturationValue', modal);

            if (!themeToggle || !cancelBtn || !saveBtn) {
                this.closeSettingsModal();
                resolve(false);
                return;
            }

            const applyPreview = () => this.applyAllSettings();
            const updateOpacityDisplay = (input, display) => {
                if (input && display) display.textContent = `${input.value}%`;
            };

            // 新增：关闭模态框并解析Promise
            const closeModal = (result) => {
                this.closeSettingsModal();
                resolve(result);
            };

            themeToggle.addEventListener('click', () => {
                this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
                themeToggle.classList.toggle('active', this.settings.theme === 'light');
                applyPreview();
            });

            modeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (customCountGroup) {
                        customCountGroup.style.display = radio.value === 'custom' ? 'block' : 'none';
                    }
                });
            });

            if (colorSettingsToggle && colorSettingsContent && colorSettingsArrow) {
                colorSettingsToggle.addEventListener('click', () => {
                    colorSettingsContent.classList.toggle('expanded');
                    colorSettingsArrow.classList.toggle('expanded');
                });
            }

            if (advancedGlassToggle && advancedGlassContent) {
                advancedGlassToggle.addEventListener('click', () => {
                    advancedGlassContent.classList.toggle('expanded');
                    advancedGlassToggle.querySelector('.bili-classifier-submenu-arrow').classList.toggle('expanded');
                });
            }

            // Bind events for live preview of settings
            [
                { input: primaryColorInput,   key: 'primaryColor',       isColor: true },
                { input: primaryOpacityInput, key: 'primaryOpacity',     display: primaryOpacityValue },
                { input: secondaryColorInput, key: 'secondaryColor',     isColor: true },
                { input: secondaryOpacityInput, key: 'secondaryOpacity', display: secondaryOpacityValue },
                { input: dangerColorInput,    key: 'dangerColor',        isColor: true },
                { input: dangerOpacityInput,  key: 'dangerOpacity',      display: dangerOpacityValue },
                { input: glassOpacityInput,   key: 'glassOpacity',       display: glassOpacityValue },
                { input: blurIntensityInput,  key: 'blurIntensity',      display: blurIntensityValue,  suffix: 'px' },
                { input: saturationInput,     key: 'saturation',         display: saturationValue,     suffix: '%' }
            ].forEach(({ input, key, display, isColor, suffix }) => {
                if (input) {
                    input.addEventListener('input', () => {
                        const value = isColor ? input.value : parseInt(input.value);
                        this.settings[key] = isColor ? value : (key.includes('Opacity') ? value / 100 : value);
                        if (display) {
                           display.textContent = `${value}${suffix || ''}`;
                        }
                        if (key.includes('Opacity') && !isColor) {
                           updateOpacityDisplay(input, display);
                        }
                        applyPreview();
                    });
                }
            });

            if (resetColorsBtn) {
                resetColorsBtn.addEventListener('click', () => {
                    this.settings.primaryColor = '#00a1d6';
                    this.settings.primaryOpacity = 0.4;
                    this.settings.secondaryColor = '#ffffff';
                    this.settings.secondaryOpacity = 0.1;
                    this.settings.dangerColor = '#ff4d4f';
                    this.settings.dangerOpacity = 0.4;

                    if (primaryColorInput) primaryColorInput.value = this.settings.primaryColor;
                    if (primaryOpacityInput) primaryOpacityInput.value = this.settings.primaryOpacity * 100;
                    if (secondaryColorInput) secondaryColorInput.value = this.settings.secondaryColor;
                    if (secondaryOpacityInput) secondaryOpacityInput.value = this.settings.secondaryOpacity * 100;
                    if (dangerColorInput) dangerColorInput.value = this.settings.dangerColor;
                    if (dangerOpacityInput) dangerOpacityInput.value = this.settings.dangerOpacity * 100;

                    updateOpacityDisplay(primaryOpacityInput, primaryOpacityValue);
                    updateOpacityDisplay(secondaryOpacityInput, secondaryOpacityValue);
                    updateOpacityDisplay(dangerOpacityInput, dangerOpacityValue);
                    applyPreview();
                });
            }

            cancelBtn.addEventListener('click', () => {
                this.settings = originalSettings;
                applyPreview();
                closeModal(false);
            });

            saveBtn.addEventListener('click', () => {
                const selectedMode = utils.querySafe('input[name="recognitionMode"]:checked', modal);
                if (!selectedMode || !customCountInput) {
                    closeModal(false);
                    return;
                }
                this.settings.recognitionMode = selectedMode.value;

                // 验证自定义数量输入
                const customCount = parseInt(customCountInput.value);
                if (utils.isValidNumber(customCount, 1, 1000)) {
                    this.settings.customCount = customCount;
                } else {
                    alert('请输入有效的数字 (1-1000)');
                    return;
                }

                if (this.saveSettings()) {
                    closeModal(true);
                } else {
                    alert('保存设置失败，请检查控制台');
                }
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.settings = originalSettings;
                    applyPreview();
                    closeModal(false);
                }
            });
        }

        /**
         * Gets the maximum number of videos to process based on current settings.
         * @returns {number} The limit, or Infinity if set to 'all'.
         */
        getRecognitionLimit() {
            return this.settings.recognitionMode === 'all' ?
                Infinity : this.settings.customCount;
        }
    }

    // --- API Service ---

    /**
     * A collection of functions for interacting with the Bilibili API.
     * @namespace apiService
     */
    const apiService = {
        /**
         * Fetches all favorites folders created by a user.
         * @returns {Promise<Array<object>>} A promise that resolves with the list of folders.
         */
        async getUserFavLists() {
            let mid = '';
            try {
                const pathParts = window.location.pathname.split('/').filter(Boolean);
                mid = pathParts[0] || '';
                if (!mid) {
                    const metaMid = document.querySelector('meta[name="mid"]')?.content;
                    if (metaMid) mid = metaMid;
                }
            } catch (error) {
                utils.log('解析mid失败', 'warning');
            }

            if (!mid) {
                throw new Error('无法获取用户UID(mid)，请在用户收藏夹页面运行脚本。');
            }

            const response = await utils.apiRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${mid}`
            });

            if (!response?.data?.list) {
                throw new Error('获取收藏夹列表失败: 服务器返回数据格式异常');
            }

            return response.data.list;
        },

        /**
         * Fetches detailed information for a single video.
         * @param {number|string} aid - The video's AID.
         * @returns {Promise<object>} A promise that resolves with the video's data.
         */
        async getVideoInfo(aid) {
            if (!aid) {
                throw new Error('视频AID不能为空');
            }

            const response = await utils.apiRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/web-interface/view?aid=${aid}`
            });

            if (!response || !response.data) {
                throw new Error(`${ERROR_MESSAGES.VIDEO_INFO_FAILED}: ${response?.message || '未知错误'}`);
            }

            const data = response.data;
            if (!data || !data.title) {
                throw new Error(`${ERROR_MESSAGES.VIDEO_INFO_FAILED}: 视频数据不完整`);
            }

            utils.log(`获取视频 ${aid} 信息: ${data.title}`, 'info');
            return data;
        },

        /**
         * Fetches the list of videos from a specific favorites folder, with pagination.
         * @param {number|string} mediaId - The ID of the favorites folder.
         * @param {number} [maxCount=Infinity] - The maximum number of videos to fetch.
         * @param {number} [ps=CONFIG.BATCH_SIZE] - Page size.
         * @param {number} [pn=1] - Page number.
         * @param {Array<object>} [videos=[]] - An accumulator for the video list.
         * @param {function(number)|null} [progressCb=null] - A callback function for progress updates.
         * @returns {Promise<Array<object>>} A promise that resolves with the list of videos.
         */
        async getFavVideos(mediaId, maxCount = Infinity, ps = CONFIG.BATCH_SIZE, pn = 1, videos = [], progressCb = null) {
            // 参数验证
            if (!mediaId || (typeof mediaId !== 'string' && typeof mediaId !== 'number')) {
                throw new Error('mediaId 参数无效');
            }

            if (!utils.isValidNumber(ps, 1, 100)) {
                throw new Error('分页大小必须在 1-100 之间');
            }

            if (videos.length >= maxCount) {
                return videos.slice(0, maxCount);
            }

            const response = await utils.apiRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${mediaId}&pn=${pn}&ps=${ps}&order=mtime&type=0&platform=web`
            });

            const data = response?.data;
            if (!data?.medias) {
                throw new Error('获取视频列表失败或接口返回异常');
            }

            for (const video of data.medias) {
                if (videos.length >= maxCount) break;
                try {
                    const vid = video.id || video.rid || video.aid;
                    if (!vid) {
                        utils.log('跳过无效视频条目', 'warning');
                        continue;
                    }
                    const videoInfo = await this.getVideoInfo(vid);
                    videos.push({
                        aid: vid,
                        title: video.title || videoInfo.title || '未知标题',
                        tid: videoInfo.tid || videoInfo.typeid || 0,
                        tname: videoInfo.tname || videoInfo.typename || '未知',
                        play: (videoInfo.stat && videoInfo.stat.view) || video.play || 0
                    });
                } catch (error) {
                    utils.log(`跳过视频 ${video.id || '未知'}: ${error.message}`, 'warning');
                }

                try {
                    if (typeof progressCb === 'function') {
                        progressCb(videos.length);
                    }
                } catch (error) {
                    utils.log('进度回调执行失败', 'warning');
                }

                await utils.delay(CONFIG.INFO_FETCH_DELAY);
            }

            if (data.has_more && videos.length < maxCount) {
                return await this.getFavVideos(mediaId, maxCount, ps, pn + 1, videos, progressCb);
            }

            return videos.slice(0, maxCount);
        },

        /**
         * Creates a new favorites folder.
         * @param {string} title - The title for the new folder.
         * @returns {Promise<number>} A promise that resolves with the ID of the new folder.
         */
        async createFolder(title) {
            if (!title || typeof title !== 'string' || title.trim().length === 0) {
                throw new Error('收藏夹名称不能为空');
            }

            const csrf = utils.getCsrf();
            if (!csrf) {
                throw new Error(ERROR_MESSAGES.CSRF_MISSING);
            }

            const response = await utils.apiRequest({
                method: 'POST',
                url: 'https://api.bilibili.com/x/v3/fav/folder/add',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: `csrf=${csrf}&title=${encodeURIComponent(title)}&jsonp=jsonp`
            });

            if (response?.code === 0) {
                return response.data.id;
            } else {
                throw new Error(response?.message || '创建收藏夹失败');
            }
        },

        /**
         * Adds a video to a favorites folder.
         * @param {number|string} aid - The video's AID.
         * @param {number|string} fid - The target folder's ID.
         * @returns {Promise<object>} A promise that resolves with the API response.
         */
        async addToFav(aid, fid) {
            if (!aid || !fid) {
                throw new Error('视频AID和收藏夹ID不能为空');
            }

            const csrf = utils.getCsrf();
            if (!csrf) {
                throw new Error(ERROR_MESSAGES.CSRF_MISSING);
            }

            const response = await utils.apiRequest({
                method: 'POST',
                url: 'https://api.bilibili.com/x/v3/fav/resource/deal',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: `csrf=${csrf}&rid=${aid}&type=2&add_media_ids=${fid}&jsonp=jsonp`
            });

            if (response?.code !== 0) {
                throw new Error(response?.message || '添加视频失败');
            }
            return response;
        },

        /**
         * Removes a video from a favorites folder.
         * @param {number|string} aid - The video's AID.
         * @param {number|string} fid - The source folder's ID.
         * @returns {Promise<object>} A promise that resolves with the API response.
         */
        async removeFromFav(aid, fid) {
            if (!aid || !fid) {
                throw new Error('视频AID和收藏夹ID不能为空');
            }

            const csrf = utils.getCsrf();
            if (!csrf) {
                throw new Error(ERROR_MESSAGES.CSRF_MISSING);
            }

            const response = await utils.apiRequest({
                method: 'POST',
                url: 'https://api.bilibili.com/x/v3/fav/resource/deal',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: `csrf=${csrf}&rid=${aid}&type=2&del_media_ids=${fid}&jsonp=jsonp`
            });

            if (response?.code !== 0) {
                throw new Error(response?.message || '移除视频失败');
            }
            return response;
        },

        /**
         * Gets the current folder info by media_id
         * @param {number|string} mediaId - The folder ID
         * @returns {Promise<object>} A promise that resolves with folder info
         */
        async getFolderInfo(mediaId) {
            if (!mediaId) {
                throw new Error('收藏夹ID不能为空');
            }

            const response = await utils.apiRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/v3/fav/folder/info?media_id=${mediaId}`
            });

            if (!response?.data) {
                throw new Error('获取收藏夹信息失败');
            }

            return response.data;
        }
    };

    // --- UI Manager ---

    /**
     * Handles creation, updating, and removal of UI elements like progress bars.
     * @namespace uiManager
     */
    const uiManager = {
        /**
         * Creates and displays a progress bar element.
         * @param {string} id - The ID for the new element.
         * @param {string} [initialMessage='正在处理...'] - The initial message to display.
         * @returns {Element} The created progress bar element.
         */
        createProgressDiv(id, initialMessage = '正在处理...') {
            const existing = document.getElementById(id);
            if (existing) existing.remove();

            const div = document.createElement('div');
            div.id = id;
            div.className = 'bili-classifier-progress bili-classifier-glass';
            div.innerHTML = `
                <div style="font-weight: 500;">${initialMessage}</div>
                <div class="bili-classifier-progress-bar">
                    <div class="bili-classifier-progress-fill" style="width: 0%"></div>
                </div>
                <div style="font-size: 13px; color: var(--text-secondary);">0/0</div>
            `;
            document.body.appendChild(div);
            return div;
        },

        /**
         * Updates the state of a progress bar.
         * @param {string} id - The ID of the progress bar element.
         * @param {string} message - The new message to display.
         * @param {number} current - The current progress value.
         * @param {number} total - The total value for the progress.
         * @param {number} [skipped=0] - The number of skipped items.
         */
        updateProgress(id, message, current, total, skipped = 0) {
            let progressDiv = document.getElementById(id);
            if (!progressDiv) {
                progressDiv = this.createProgressDiv(id, message);
            }

            const firstDiv = progressDiv.querySelector('div:first-child');
            const progressFill = progressDiv.querySelector('.bili-classifier-progress-fill');
            const lastDiv = progressDiv.querySelector('div:last-child');

            if (firstDiv) firstDiv.textContent = message;
            if (progressFill) {
                const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : (current > 0 ? 100 : 0);
                progressFill.style.width = `${percentage}%`;
            }
            if (lastDiv) {
                lastDiv.textContent = `${current}/${total}${skipped > 0 ? ` (跳过${skipped}个)` : ''}`;
            }
        },

        /**
         * Removes a progress bar from the DOM.
         * @param {string} id - The ID of the element to remove.
         */
        removeProgress(id) {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        }
    };

    // --- Configuration Modal ---

    /**
     * Manages the main configuration modal where users choose how to classify videos.
     * @class
     */
    class ConfigModal {
        /**
         * @param {object} tidGroups - An object grouping videos by their type ID (tid).
         * @param {string} sourceFid - The source folder ID.
         * @param {string} sourceFolderName - The source folder name.
         */
        constructor(tidGroups, sourceFid, sourceFolderName) {
            this.tidGroups = tidGroups || {};
            this.sourceFid = sourceFid;
            this.sourceFolderName = sourceFolderName;
            this.existingFolders = [];
            this.modal = null;
            this.resolve = null;
            this.reject = null;
        }

        /**
         * Creates and displays the modal, returning a promise that resolves with the user's configuration.
         * @returns {Promise<object>} A promise that resolves with the config or rejects if canceled.
         */
        create() {
            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
                this.modal = document.createElement('div');
                this.modal.className = 'bili-classifier-container bili-classifier-modal bili-classifier-glass';
                this.modal.innerHTML = this.generateHTML();
                document.body.appendChild(this.modal);

                this.loadExistingFolders().catch(error => {
                    utils.log('加载现有收藏夹失败: ' + error.message, 'warning');
                }).finally(() => {
                    this.bindEvents();
                });
            });
        }

        /**
         * Generates the complete HTML for the modal.
         * @returns {string} The modal's inner HTML.
         */
        generateHTML() {
            const groupCount = Object.keys(this.tidGroups).length;
            return `
                <h3>收藏夹自动分类</h3>
                <div class="bili-classifier-content">
                    ${this.generateOperationMode()}
                    ${this.generateAutoClassifyOption()}
                    ${this.generateCustomGroupsSection()}
                    <div id="defaultGroups">
                        <h4>视频分区列表 (${groupCount}个分区)</h4>
                        ${Object.entries(this.tidGroups).map(([tid, videos]) => `
                            <div class="bili-classifier-group tid-group" data-tid="${tid}">
                                <div class="bili-classifier-group-header">
                                    <span>${videos[0]?.tname || '未知分区'} (${videos.length}个视频)</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${this.generateFooter()}
            `;
        }

        /** Generates HTML for the operation mode selection (copy/move). */
        generateOperationMode() {
            return `
                <div class="bili-classifier-radio-group">
                    <label class="bili-classifier-radio-label">
                        <input type="radio" name="operationMode" value="copy" checked>
                        复制模式
                    </label>
                    <label class="bili-classifier-radio-label">
                        <input type="radio" name="operationMode" value="move">
                        移动模式 (将视频移出原收藏夹)
                    </label>
                </div>
            `;
        }

        /** Generates HTML for the auto-classification checkbox. */
        generateAutoClassifyOption() {
            return `
                <div class="bili-classifier-option-group">
                    <label class="bili-classifier-checkbox-label">
                        <input type="checkbox" id="autoClassifyUnassigned" checked>
                        对未自定义分组的视频自动按分区分类 (推荐)
                    </label>
                </div>
            `;
        }

        /** Generates HTML for the custom grouping section. */
        generateCustomGroupsSection() {
            return `
                <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <button class="bili-classifier-btn primary" id="addCustomGroup" type="button">添加自定义分组</button>
                    <span class="current-folder-name">当前收藏夹: ${this.sourceFolderName}</span>
                </div>
                <div id="customGroups"></div>
            `;
        }

        /** Generates the modal's footer HTML with links and action buttons. */
        generateFooter() {
            return `
                <div class="bili-classifier-footer">
                    <div class="bili-classifier-links">
                        <a href="https://space.bilibili.com/484456494" target="_blank" class="bili-classifier-link-btn">我的B站主页</a>
                        <a href="https://github.com/RSLN-creator/T-UserScript" target="_blank" class="bili-classifier-link-btn">GitHub项目</a>
                          <a href="https://github.com/jqwgt" target="_blank" class="bili-classifier-link-btn">原作者Github</a>
                    </div>
                    <div class="bili-classifier-footer-buttons">
                        <button class="bili-classifier-btn secondary" id="cancelClassify" type="button">取消</button>
                        <button class="bili-classifier-btn primary" id="startClassify" type="button">开始分类</button>
                    </div>
                </div>
            `;
        }

        /** Fetches and stores the user's existing favorites folders. */
        async loadExistingFolders() {
            try {
                this.existingFolders = await apiService.getUserFavLists();
                // 过滤掉当前收藏夹
                this.existingFolders = this.existingFolders.filter(folder => folder.id != this.sourceFid);
            } catch (error) {
                utils.log('获取收藏夹列表失败: ' + error.message, 'warning');
                this.existingFolders = [];
            }
        }

        /** Binds all necessary event listeners for the modal. */
        bindEvents() {
            if (!this.modal) return;
            const addBtn = utils.querySafe('#addCustomGroup', this.modal);
            const startBtn = utils.querySafe('#startClassify', this.modal);
            const cancelBtn = utils.querySafe('#cancelClassify', this.modal);

            if (addBtn) addBtn.addEventListener('click', () => this.addCustomGroup());
            if (startBtn) startBtn.addEventListener('click', () => this.startClassify());
            if (cancelBtn) cancelBtn.addEventListener('click', () => this.cancel());

            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.cancel();
            });
        }

        /** Adds a new UI block for creating a custom group. */
        addCustomGroup() {
            const container = utils.querySafe('#customGroups', this.modal);
            if (!container) return;

            const groupDiv = document.createElement('div');
            groupDiv.className = 'bili-classifier-group custom-group';
            groupDiv.innerHTML = this.generateCustomGroupHTML();
            container.appendChild(groupDiv);
            this.bindCustomGroupEvents(groupDiv);
        }

        /**
         * Generates the HTML for a single custom group block.
         * @returns {string} The HTML string.
         */
        generateCustomGroupHTML() {
            const tidOptions = Object.entries(this.tidGroups)
                .map(([tid, videos]) => `
                    <label class="bili-classifier-checkbox-label">
                        <input type="checkbox" class="bili-classifier-checkbox" value="${tid}">
                        ${videos[0]?.tname || '未知分区'} (${videos.length}个视频)
                    </label>
                `).join('');
            return `
                <div class="bili-classifier-group-header">
                    <input type="text" class="bili-classifier-input folder-name" placeholder="新收藏夹名称">
                    <button class="bili-classifier-btn secondary use-existing" type="button">使用现有收藏夹</button>
                    <button class="bili-classifier-btn danger remove-group" type="button">删除分组</button>
                </div>
                <div class="bili-classifier-checkbox-group tid-options">
                    ${tidOptions}
                </div>
            `;
        }

        /**
         * Binds events for a newly created custom group block.
         * @param {Element} groupDiv - The element for the custom group.
         */
        bindCustomGroupEvents(groupDiv) {
            const useBtn = utils.querySafe('.use-existing', groupDiv);
            const removeBtn = utils.querySafe('.remove-group', groupDiv);

            if (useBtn) useBtn.addEventListener('click', (e) => this.toggleFolderInput(e.target));
            if (removeBtn) removeBtn.addEventListener('click', () => groupDiv.remove());
        }

        /**
         * Toggles the folder name input between a text field (new folder) and a select dropdown (existing folder).
         * @param {Element} button - The button that was clicked.
         */

        toggleFolderInput(button) {
            const group = button.closest('.custom-group');
            if (!group) return;

            const currentElement = group.querySelector('.folder-name');
            if (!currentElement) return;

            const isInput = currentElement.tagName === 'INPUT';

            // 保存当前值，以便切换时恢复
            const currentValue = currentElement.value || '';

            if (isInput) {
                // 切换到选择已有收藏夹模式
                const newSelect = document.createElement('select');
                newSelect.className = 'bili-classifier-select folder-name';
                newSelect.innerHTML = `
            <option value="">选择现有收藏夹</option>
            ${this.existingFolders.map(f => `<option value="${f.id}" ${f.title === currentValue ? 'selected' : ''}>${f.title}</option>`).join('')}
        `;
                currentElement.parentNode.replaceChild(newSelect, currentElement);
                button.textContent = '创建新收藏夹';
            } else {
                // 切换到创建新收藏夹模式
                const newInput = document.createElement('input');
                newInput.type = 'text';
                newInput.className = 'bili-classifier-input folder-name';
                newInput.placeholder = '新收藏夹名称';
                newInput.value = this.getFolderNameFromSelect(currentElement) || '';
                currentElement.parentNode.replaceChild(newInput, currentElement);
                button.textContent = '使用现有收藏夹';
            }
        }

        /**
        * 从选择框中获取选中的收藏夹名称
        * @param {Element} selectElement - 选择框元素
        * @returns {string} 收藏夹名称
        */
        getFolderNameFromSelect(selectElement) {
            if (selectElement.selectedIndex > 0) {
                return selectElement.options[selectElement.selectedIndex].text;
            }
            return '';
        }

        /** Gathers the configuration and resolves the promise. */
        startClassify() {
            if (!this.modal) return;
            const config = this.collectConfig();
            this.modal.remove();
            this.modal = null;
            if (this.resolve) this.resolve(config);
        }

        /**
         * Collects all user settings from the modal into a configuration object.
         * @returns {object|null} The final configuration object, or null if modal is not present.
         */
        collectConfig() {
            if (!this.modal) return null;
            const operationModeEl = utils.querySafe('input[name="operationMode"]:checked', this.modal);
            const autoClassifyEl = utils.querySafe('#autoClassifyUnassigned', this.modal);

            const config = {
                custom: [],
                default: {},
                operationMode: operationModeEl ? operationModeEl.value : 'copy',
                autoClassifyUnassigned: autoClassifyEl ? autoClassifyEl.checked : true
            };

            // Collect custom group configurations
            const customGroups = utils.queryAllSafe('.custom-group', this.modal);
            customGroups.forEach(group => {
                const nameInput = utils.querySafe('.folder-name', group);
                const selectedTids = utils.queryAllSafe('input[type="checkbox"]:checked', group).map(cb => cb.value).filter(Boolean);

                if (selectedTids.length > 0 && nameInput) {
                    const isSelect = nameInput.tagName === 'SELECT';
                    const name = isSelect ? nameInput.options[nameInput.selectedIndex]?.text : nameInput.value;
                    const fid = isSelect ? nameInput.value : null;

                    if (name && name.trim()) {
                        config.custom.push({
                            name: name.trim(),
                            isExisting: isSelect && !!fid,
                            fid: fid,
                            tids: selectedTids
                        });
                    }
                }
            });

            // Determine default groups for auto-classification
            if (config.autoClassifyUnassigned) {
                Object.keys(this.tidGroups).forEach(tid => {
                    const isAssigned = config.custom.some(g => g.tids.includes(tid));
                    if (!isAssigned) {
                        config.default[tid] = this.tidGroups[tid][0]?.tname || '未知分区';
                    }
                });
            }
            return config;
        }

        /** Cancels the operation and rejects the promise. */
        cancel() {
            this.destroy();
            if (this.reject) {
                this.reject(new Error(ERROR_MESSAGES.USER_CANCELLED));
            }
        }

        /**
         * Cleans up the modal and releases resources.
         */
        destroy() {
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
            // 清理所有绑定的事件
            this.resolve = null;
            this.reject = null;
        }
    }

    // --- Classification Processor ---

    /**
     * Orchestrates the entire classification process from start to finish.
     * @class
     */
    class ClassifyProcessor {
        /**
         * @param {SettingsManager} settingsManager - An instance of the SettingsManager.
         */
        constructor(settingsManager) {
            this.settingsManager = settingsManager;
            this.sourceFid = this.getSourceFid();
            this.sourceFolderName = '';
            this.totalProcessed = 0;
            this.skippedVideos = 0;
            this.currentOperationMode = 'copy';
        }

        /**
         * Extracts the source favorites folder ID from the current URL.
         * @returns {string|null} The folder ID (fid).
         */
        getSourceFid() {
            try {
                return new URL(window.location.href).searchParams.get('fid');
            } catch (error) {
                utils.log('解析URL参数失败', 'warning');
                return null;
            }
        }

        /**
         * Executes the main classification workflow.
         */
        async process() {
            if (!this.sourceFid) {
                throw new Error(ERROR_MESSAGES.FOLDER_NOT_FOUND);
            }

            try {
                // 获取当前收藏夹名称
                try {
                    const folderInfo = await apiService.getFolderInfo(this.sourceFid);
                    this.sourceFolderName = folderInfo.title || '当前收藏夹';
                } catch (error) {
                    utils.log('获取收藏夹名称失败: ' + error.message, 'warning');
                    this.sourceFolderName = '当前收藏夹';
                }

                const maxCount = this.settingsManager.getRecognitionLimit();
                const countText = maxCount === Infinity ? '全部' : `前${maxCount}个`;

                utils.log(`步骤 1/3: 开始获取收藏夹${countText}视频详情...`);
                const videos = await this.getVideosWithProgress(maxCount);
                if (!videos.length) {
                    alert('该收藏夹内没有找到有效视频。');
                    return;
                }

                utils.log(`步骤 2/3: 获取完成，共找到${videos.length}个有效视频`);
                const tidGroups = this.groupVideosByTid(videos);
                const userConfig = await this.showConfigModal(tidGroups);
                if (!userConfig) {
                    utils.log('用户取消配置', 'info');
                    return;
                }

                utils.log('步骤 3/3: 开始执行分类操作...');
                await this.executeClassification(userConfig, tidGroups, videos.length);
                this.showCompletionMessage();

            } catch (error) {
                this.handleError(error);
            } finally {
                this.cleanup();
            }
        }

        /**
         * Fetches videos from the API while displaying a progress indicator.
         * @param {number} maxCount - The maximum number of videos to fetch.
         * @returns {Promise<Array<object>>} A promise resolving with the list of videos.
         */
        async getVideosWithProgress(maxCount) {
            const countText = maxCount === Infinity ? '全部' : `前${maxCount}个`;
            uiManager.createProgressDiv('reading-progress', `正在读取${countText}视频 · 已获取 0 个视频`);

            try {
                const videos = await apiService.getFavVideos(
                    this.sourceFid,
                    maxCount,
                    CONFIG.BATCH_SIZE,
                    1,
                    [],
                    (count) => {
                        uiManager.updateProgress('reading-progress', `正在读取${countText}视频 · 已获取 ${count} 个视频`, count, 0);
                    }
                );
                uiManager.removeProgress('reading-progress');
                return videos;
            } catch (error) {
                uiManager.removeProgress('reading-progress');
                throw error;
            }
        }

        /**
         * Groups an array of videos by their type ID (tid).
         * @param {Array<object>} videos - The list of videos.
         * @returns {object} An object where keys are tids and values are arrays of videos.
         */
        groupVideosByTid(videos) {
            const groups = {};
            videos.forEach(video => {
                if (!groups[video.tid]) {
                    groups[video.tid] = [];
                }
                groups[video.tid].push(video);
            });
            return groups;
        }

        /**
         * Displays the configuration modal to the user.
         * @param {object} tidGroups - Videos grouped by tid.
         * @returns {Promise<object|null>} The user's configuration, or null if canceled.
         */
        async showConfigModal(tidGroups) {
            try {
                const modal = new ConfigModal(tidGroups, this.sourceFid, this.sourceFolderName);
                return await modal.create();
            } catch (error) {
                if (error.message !== ERROR_MESSAGES.USER_CANCELLED) {
                    utils.log('配置模态框错误: ' + error.message, 'error');
                }
                return null;
            }
        }

        /**
         * Executes the classification based on the user's configuration.
         * @param {object} userConfig - The configuration from the modal.
         * @param {object} tidGroups - Videos grouped by tid.
         * @param {number} totalVideos - The total number of videos to process.
         */
        async executeClassification(userConfig, tidGroups, totalVideos) {
            this.currentOperationMode = userConfig.operationMode;
            uiManager.createProgressDiv('fav-progress', '正在准备分组和创建收藏夹...');

            // Process user-defined custom groups
            for (const group of userConfig.custom) {
                await this.processGroup(group, tidGroups, userConfig.operationMode, totalVideos);
            }

            // Process remaining default groups if auto-classify is enabled
            if (userConfig.autoClassifyUnassigned) {
                for (const [tid, folderName] of Object.entries(userConfig.default)) {
                    // 检查该默认分组是否有视频
                    if (tidGroups[tid] && tidGroups[tid].length > 0) {
                        const groupConfig = { name: folderName, tids: [tid] };
                        await this.processGroup(groupConfig, tidGroups, userConfig.operationMode, totalVideos);
                    }
                }
            }
        }

        /**
         * Processes a single group of videos (either custom or default).
         * @param {object} group - The group configuration.
         * @param {object} tidGroups - All videos grouped by tid.
         * @param {string} operationMode - 'copy' or 'move'.
         * @param {number} totalVideos - The total number of videos.
         */
        async processGroup(group, tidGroups, operationMode, totalVideos) {
            // 检查该分组是否有视频
            let hasVideos = false;
            for (const tid of group.tids) {
                if (tidGroups[tid] && tidGroups[tid].length > 0) {
                    hasVideos = true;
                    break;
                }
            }

            // 如果没有视频，跳过创建收藏夹
            if (!hasVideos){
                utils.log(`分组 "${group.name}" 没有视频，跳过创建收藏夹`, 'info');
                return;
            }
            const { targetFid, folderName } = await this.getOrCreateFolder(group);
            for (const tid of group.tids) {
                if (tidGroups[tid]) {
                    await this.processVideosInGroup(tidGroups[tid], targetFid, folderName, operationMode, totalVideos);
                }
            }
        }

        /**
         * Gets the target folder ID, creating the folder if it doesn't exist.
         * @param {object} group - The group configuration containing folder name and type.
         * @returns {Promise<{targetFid: string, folderName: string}>} The folder ID and name.
         */
        async getOrCreateFolder(group) {
            let targetFid;
            let folderName = group.name;

            if (group.isExisting && group.fid) {
                targetFid = group.fid;
                utils.log(`使用现有收藏夹: "${folderName}"`, 'info');
            } else {
                targetFid = await this.findOrCreateFolder(folderName);
            }
            return { targetFid, folderName };
        }

        /**
         * Finds a folder by name, or creates it if not found.
         * @param {string} folderName - The name of the folder.
         * @returns {Promise<string>} The folder ID.
         */
        async findOrCreateFolder(folderName) {
            const existingFolders = await apiService.getUserFavLists();
            // 过滤掉当前收藏夹
            const filteredFolders = existingFolders.filter(folder => folder.id != this.sourceFid);
            const existingFolder = filteredFolders.find(f => f.title && f.title.trim() === folderName.trim());
            if (existingFolder) {
                utils.log(`使用现有收藏夹: "${folderName}"`, 'info');
                return existingFolder.id;
            } else {
                const newFid = await apiService.createFolder(folderName);
                utils.log(`创建新收藏夹: "${folderName}"`, 'success');
                await utils.delay(500); // Wait for creation to propagate
                return newFid;
            }
        }

        /**
         * Adds/moves a list of videos to a target folder.
         * @param {Array<object>} videos - The videos to process.
         * @param {string} targetFid - The ID of the target folder.
         * @param {string} folderName - The name of the target folder for logging.
         * @param {string} operationMode - 'copy' or 'move'.
         * @param {number} totalVideos - The total number of videos for progress calculation.
         */
        async processVideosInGroup(videos, targetFid, folderName, operationMode, totalVideos) {
            // 在移动模式下，先收集所有要移动的视频，最后统一从源收藏夹删除
            const videosToRemove = [];

            for (const video of videos) {
                try {
                    await apiService.addToFav(video.aid, targetFid);
                    if (operationMode === 'move') {
                        // 记录要删除的视频，但不立即删除
                        videosToRemove.push(video.aid);
                    }
                    this.totalProcessed++;
                    utils.log(`处理视频成功: ${video.title} → "${folderName}"`, 'success');
                } catch (error) {
                    utils.log(`处理视频失败: ${video.title} - ${error.message}`, 'error');
                    this.skippedVideos++;
                }

                uiManager.updateProgress(
                    'fav-progress',
                    `正在处理视频到"${folderName}"`,
                    this.totalProcessed,
                    totalVideos,
                    this.skippedVideos
                );
                await utils.delay(CONFIG.RATE_LIMIT_DELAY);
            }

            // 在移动模式下，所有视频都添加到目标收藏夹后，再统一从源收藏夹删除
            if (operationMode === 'move' && videosToRemove.length > 0) {
                utils.log(`开始从源收藏夹移除 ${videosToRemove.length} 个视频`, 'info');

                for (const aid of videosToRemove) {
                    try {
                        await apiService.removeFromFav(aid, this.sourceFid);
                        utils.log(`从源收藏夹移除视频成功: ${aid}`, 'success');
                    } catch (error) {
                        utils.log(`从源收藏夹移除视频失败: ${aid} - ${error.message}`, 'error');
                        // 不增加跳过计数，因为视频已经成功添加到目标收藏夹
                    }
                    await utils.delay(CONFIG.RATE_LIMIT_DELAY);
                }
            }
        }

        /**
         * Displays a final completion message to the user.
         */
        showCompletionMessage() {
            const message = `分类完成！处理了 ${this.totalProcessed} 个视频，跳过了 ${this.skippedVideos} 个视频`;
            utils.log(message, 'success');

            // 只有在移动模式下才刷新页面
        if (this.currentOperationMode === 'move') {
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }

            alert(message);
        }

        /**
         * Handles any critical errors during the process.
         * @param {Error} error - The error object.
         */
        handleError(error) {
            if (error.message !== ERROR_MESSAGES.USER_CANCELLED) {
                utils.log(`操作失败: ${error.message}`, 'error');
                alert('操作失败：' + error.message);
            }
        }

        /**
         * Cleans up any UI elements created by the script.
         */
        cleanup() {
            uiManager.removeProgress('fav-progress');
            uiManager.removeProgress('reading-progress');
        }

        /**
         * Releases all resources and references.
         */
        destroy() {
            this.settingsManager = null;
            this.sourceFid = null;
            this.sourceFolderName = '';
            this.totalProcessed = 0;
            this.skippedVideos = 0;
            this.currentOperationMode = 'copy';
        }
    }

    // --- Initialization ---

    /**
     * Initializes the script by creating UI elements and attaching event listeners.
     */
    function init() {
        if (window.biliClassifierInitialized) {
            utils.log('脚本已经初始化', 'info');
            return;
        }
        window.biliClassifierInitialized = true;

        const settingsManager = new SettingsManager();

        const btnContainer = document.createElement('div');
        btnContainer.className = 'bili-classifier-float-btn';

        const mainButtons = document.createElement('div');
        mainButtons.className = 'bili-classifier-main-buttons';

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'bili-classifier-btn icon';
        settingsBtn.title = '界面设置';
        settingsBtn.type = 'button';
        settingsBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04.32.07.64.07.97 0 .33-.03.65-.07.97l2.11 1.65c.19.15.24.42.12.64l-2 3.46c-.12.22-.39.3-.61.22l-2.49-1c-.52.39-1.08.73-1.69.98l-.38 2.65c-.03.24-.24.42-.49.42h-4c-.25 0-.46-.18-.49-.42l-.38-2.65c-.61-.25-1.17-.59-1.69-.98l-2.49 1c-.23.09-.49 0-.61-.22l-2-3.46c-.13-.22-.07-.49.12-.64l2.11-1.65c-.04-.32-.07-.65-.07-.97 0-.32.03-.65.07-.97L2.54 11.2c-.19-.15-.24-.42-.12-.64l2-3.46c.12-.22.39-.3.61-.22l2.49 1c.52-.39 1.08-.73 1.69-.98l.38-2.65c.03-.24.24-.42.49-.42h4c.25 0 .46.18.49-.42l.38 2.65c.61.25 1.17.59 1.69.98l2.49-1c.23-.09.49 0 .61-.22l2 3.46c.12.22.07.49-.12.64l-2.11 1.65Z"/>
            </svg>
        `;

        const classifyBtn = document.createElement('button');
        classifyBtn.className = 'bili-classifier-btn primary';
        classifyBtn.textContent = '按分区分类';
        classifyBtn.type = 'button';

        mainButtons.appendChild(settingsBtn);
        mainButtons.appendChild(classifyBtn);
        btnContainer.appendChild(mainButtons);

        const links = document.createElement('div');
        links.className = 'bili-classifier-float-links';
        links.innerHTML = `
            <a href="https://space.bilibili.com/484456494" target="_blank" class="bili-classifier-link-btn">我的B站</a>
            <a href="https://github.com/RSLN-creator/T-UserScript" target="_blank" class="bili-classifier-link-btn">GitHub</a>
            <a href="https://github.com/jqwgt" target="_blank" class="bili-classifier-link-btn">原作者Github</a>
        `;
        btnContainer.appendChild(links);
        document.body.appendChild(btnContainer);

        settingsBtn.addEventListener('click', async () => {
            try {
                const saved = await settingsManager.showSettingsModal();
                if (saved) {
                    const limit = settingsManager.getRecognitionLimit();
                    const modeText = settingsManager.settings.recognitionMode === 'all' ? '全部识别' : `自定义识别 (最多${limit}个)`;
                    const themeText = settingsManager.settings.theme === 'dark' ? '深色' : '浅色';
                    utils.log(`界面设置已更新: ${modeText}, ${themeText}主题`, 'success');
                }
            } catch (error) {
                utils.log('设置模态框错误: ' + error.message, 'error');
            }
        });

        classifyBtn.addEventListener('click', () => {
            new ClassifyProcessor(settingsManager).process().catch(error => {
                utils.log('分类处理器错误: ' + error.message, 'error');
            });
        });

        utils.log('Bilibili收藏夹自动分类脚本已加载', 'success');
    }

    // --- Script Entry Point ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100); // Delay to ensure page scripts have loaded
    }
})();