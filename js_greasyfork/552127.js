// ==UserScript==
// @name         Iwara 外部播放器
// @namespace    none
// @version      1.6.1
// @author       EvilSissi
// @description  支持外部播放器和视频播放链接代理(需自建服务)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iwara.tv
// @include      *://*/*iwara.tv/*
// @match        *://*.iwara.tv/*
// @connect      *
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/552127/Iwara%20%E5%A4%96%E9%83%A8%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552127/Iwara%20%E5%A4%96%E9%83%A8%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function injectGlobalStyles() {
    GM_addStyle(`
		:root {
			--iwara-bg: #282c34;
			--iwara-bg-2: #21252b;
			--iwara-panel: #1f2329;
			--iwara-border: rgba(171, 178, 191, 0.14);
			--iwara-border-strong: rgba(171, 178, 191, 0.22);
			--iwara-text: #abb2bf;
			--iwara-text-strong: #dcdfe4;
			--iwara-muted: #5c6370;
			--iwara-subtle: #7f848e;
			--iwara-accent: #61afef;
			--iwara-cyan: #56b6c2;
			--iwara-green: #98c379;
			--iwara-orange: #d19a66;
			--iwara-yellow: #e5c07b;
			--iwara-red: #e06c75;
		}

        /* ========== 浮动按钮样式 ========== */
        .iwara-mpv-fab {
            position: fixed;
            right: 30px;
            z-index: 999998;
            background: linear-gradient(135deg, var(--iwara-accent) 0%, var(--iwara-cyan) 100%);
            color: #fff;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 16px rgba(97, 175, 239, 0.35);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            user-select: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .iwara-mpv-fab:hover {
            background: linear-gradient(135deg, var(--iwara-cyan) 0%, var(--iwara-accent) 100%);
            box-shadow: 0 6px 20px rgba(97, 175, 239, 0.5);
            transform: translateY(-2px) scale(1.05);
        }
        .iwara-mpv-fab:active {
            transform: translateY(0) scale(0.98);
        }
        #iwara-mpv-settings-fab {
            bottom: 30px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            font-size: 24px;
        }
        #iwara-mpv-settings-fab svg {
            width: 28px;
            height: 28px;
            fill: #ffffff;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: block;
        }
        #iwara-mpv-settings-fab:hover {
            box-shadow: 0 8px 24px rgba(97, 175, 239, 0.6);
        }
        #iwara-mpv-settings-fab:hover svg {
            transform: rotate(90deg);
        }

        /* 视频播放页按钮组 - 1x4 垂直布局 */
        #iwara-mpv-button-group-detail {
            position: fixed;
            right: 30px;
            bottom: 100px;
            z-index: 999998;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        #iwara-mpv-button-group-detail button {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 16px rgba(97, 175, 239, 0.22);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid;
            backdrop-filter: blur(10px);
        }
        #iwara-mpv-button-group-detail button:hover {
            box-shadow: 0 6px 20px rgba(97, 175, 239, 0.3);
            transform: translateY(-2px) scale(1.05);
        }
        #iwara-mpv-button-group-detail button:active {
            transform: translateY(0) scale(0.98);
        }
        #iwara-mpv-button-group-detail button svg {
            width: 24px;
            height: 24px;
        }
        #iwara-mpv-button-group-detail .copy-btn {
            background: rgba(255, 255, 255, 0.95);
            color: var(--iwara-accent);
            border-color: var(--iwara-accent);
        }
        #iwara-mpv-button-group-detail .copy-btn:hover {
            background: var(--iwara-accent);
            color: #fff;
        }
        #iwara-mpv-button-group-detail .new-tab-btn {
            background: rgba(255, 255, 255, 0.95);
            color: var(--iwara-green);
            border-color: var(--iwara-green);
        }
        #iwara-mpv-button-group-detail .new-tab-btn:hover {
            background: var(--iwara-green);
            color: #fff;
        }
        #iwara-mpv-button-group-detail .quality-btn {
            background: rgba(255, 255, 255, 0.95);
            color: var(--iwara-orange);
            border-color: var(--iwara-orange);
            font-size: 14px;
            font-weight: bold;
        }
        #iwara-mpv-button-group-detail .quality-btn:hover {
            background: var(--iwara-orange);
            color: #fff;
        }
        #iwara-mpv-button-group-detail .play-btn {
            background: linear-gradient(135deg, var(--iwara-accent) 0%, var(--iwara-cyan) 100%);
            color: #fff;
            border-color: var(--iwara-accent);
        }
        #iwara-mpv-button-group-detail .play-btn:hover {
            box-shadow: 0 6px 16px rgba(97, 175, 239, 0.45);
        }

        /* 悬停按钮容器 - 2x2 网格布局 */
        .iwara-mpv-button-group {
            position: absolute;
            right: 10px;
            bottom: 10px;
            z-index: 100;
            display: none;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        /* 当按钮少于4个时，改为单列布局 */
        .iwara-mpv-button-group.single-column {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
        }
        .iwara-mpv-button-group.visible {
            opacity: 1;
        }

        /* 按钮组内所有按钮的统一基础样式 */
        .iwara-mpv-button-group button {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
            opacity: 0;
            transform: scale(0.8);
            border: 2px solid;
        }
        .iwara-mpv-button-group button:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .iwara-mpv-button-group button svg {
            width: 18px;
            height: 18px;
        }

        /* 复制按钮 */
        .iwara-mpv-action-btn.copy {
            background: rgba(255, 255, 255, 0.95);
            color: var(--iwara-accent);
            border-color: var(--iwara-accent);
        }
        .iwara-mpv-action-btn.copy:hover {
            background: var(--iwara-accent);
            color: #fff;
        }

        /* 新标签页播放按钮 */
        .iwara-mpv-action-btn.new-tab {
            background: rgba(255, 255, 255, 0.95);
            color: var(--iwara-green);
            border-color: var(--iwara-green);
        }
        .iwara-mpv-action-btn.new-tab:hover {
            background: var(--iwara-green);
            color: #fff;
        }

        /* 画质按钮 */
        .iwara-mpv-action-btn.quality {
            background: rgba(255, 255, 255, 0.95);
            color: var(--iwara-orange);
            border-color: var(--iwara-orange);
            font-size: 14px;
            font-weight: bold;
        }
        .iwara-mpv-action-btn.quality:hover {
            background: var(--iwara-orange);
            color: #fff;
        }

        /* 播放按钮 */
        .iwara-mpv-button-group .iwara-mpv-hover-button {
            background: linear-gradient(135deg, var(--iwara-accent) 0%, var(--iwara-cyan) 100%);
            color: #fff;
            border-color: var(--iwara-accent);
        }
        .iwara-mpv-button-group .iwara-mpv-hover-button:hover {
            box-shadow: 0 6px 16px rgba(97, 175, 239, 0.45);
        }
        .iwara-mpv-button-group .iwara-mpv-hover-button svg {
            width: 20px;
            height: 20px;
        }

        /* ========== 统一表单输入框样式 ========== */
        .iwara-form-input,
        .iwara-form-textarea {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--iwara-text);
            font-size: 14px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            transition: all 0.2s;
            box-sizing: border-box;
        }
        .iwara-form-input:focus,
        .iwara-form-textarea:focus {
            outline: none;
            border-color: var(--iwara-accent);
            background: rgba(255, 255, 255, 0.08);
        }
        .iwara-form-input::placeholder,
        .iwara-form-textarea::placeholder {
            color: var(--iwara-muted);
        }
        .iwara-form-textarea {
            resize: vertical;
            min-height: 80px;
            line-height: 1.5;
        }

        /* ========== 按钮设置复选框样式 ========== */
        .iwara-button-settings-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        .iwara-checkbox-label {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            user-select: none;
        }
        .iwara-checkbox-label:hover {
            background: rgba(97, 175, 239, 0.10);
            border-color: rgba(97, 175, 239, 0.28);
        }
        .iwara-checkbox-label input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.3);
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .iwara-checkbox-label input[type="checkbox"]:hover {
            border-color: var(--iwara-accent);
        }
        .iwara-checkbox-label input[type="checkbox"]:checked {
            background: linear-gradient(135deg, var(--iwara-accent) 0%, var(--iwara-cyan) 100%);
            border-color: var(--iwara-accent);
        }
        .iwara-checkbox-label input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        .iwara-checkbox-label span {
            color: var(--iwara-text);
            font-size: 13px;
            font-weight: 500;
            transition: color 0.2s;
        }
        .iwara-checkbox-label:hover span {
            color: var(--iwara-text-strong);
        }
        .iwara-checkbox-label input[type="checkbox"]:checked + span {
            color: var(--iwara-text-strong);
        }
        .iwara-settings-subsection {
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.04);
        }
        .iwara-settings-subsection:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        .iwara-settings-subsection h5 {
            color: var(--iwara-text-strong);
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .iwara-settings-section-title {
            color: var(--iwara-text-strong);
            margin: 0 0 20px 0;
            font-size: 17px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 0;
            border-bottom: none;
            position: relative;
            padding-left: 16px;
            letter-spacing: 0.3px;
        }
        .iwara-settings-section-title::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 20px;
            background: linear-gradient(to bottom, var(--iwara-accent), var(--iwara-cyan));
            border-radius: 2px;
        }
        .iwara-settings-section-title.no-indicator {
            padding-left: 0;
        }
        .iwara-settings-section-title.no-indicator::before {
            display: none;
        }
        .iwara-settings-section {
            padding: 24px 0;
            margin-bottom: 0;
            background: transparent;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid var(--iwara-border);
            position: relative;
        }
        .iwara-settings-section::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -1px;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(97, 175, 239, 0.28), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .iwara-settings-section:hover::before {
            opacity: 1;
        }
        .iwara-settings-section:last-child {
            margin-bottom: 0;
            border-bottom: none;
        }
        .iwara-settings-section:last-child::before {
            display: none;
        }
        .iwara-settings-section:first-child {
            padding-top: 0;
        }
        .iwara-settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: -4px 0 14px 0;
        }
        .iwara-settings-header h4 {
            color: var(--iwara-text-strong);
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }

        /* ========== 新设计的模态框样式 ========== */
        .iwara-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .iwara-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* 新设计：左右分栏容器 */
        .iwara-modal-content {
            background: var(--iwara-panel);
            border-radius: 10px;
            width: 900px;
            max-width: 1100px;
            height: 85vh;
            max-height: 750px;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.7);
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        @keyframes slideUp {
            from { transform: translateY(40px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }



        /* 主容器 */
        .iwara-modal-main {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        /* 左侧边栏 */
        .iwara-modal-sidebar {
            width: 200px;
            background: var(--iwara-bg-2);
            border-right: 1px solid var(--iwara-border);
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }


        /* 播放器列表 */
        .iwara-sidebar-players {
            flex: 1;
            padding: 16px 12px;
            overflow-y: auto;
        }
        .iwara-sidebar-player-item {
            display: flex;
            align-items: center;
            padding: 12px 14px;
            margin-bottom: 8px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid transparent;
            position: relative;
            overflow: hidden;
        }
        .iwara-sidebar-player-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(to bottom, var(--iwara-accent), var(--iwara-cyan));
            transform: scaleY(0);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 0 2px 2px 0;
        }
        .iwara-sidebar-player-item::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(97, 175, 239, 0.10), rgba(86, 182, 194, 0.08));
            opacity: 0;
            transition: opacity 0.3s;
            border-radius: 12px;
        }
        .iwara-sidebar-player-item:hover {
            border-color: rgba(97, 175, 239, 0.22);
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
        }
        .iwara-sidebar-player-item:hover::before {
            transform: scaleY(1);
        }
        .iwara-sidebar-player-item:hover::after {
            opacity: 1;
        }
        .iwara-sidebar-player-item.active {
            background: linear-gradient(135deg, rgba(97, 175, 239, 0.16), rgba(86, 182, 194, 0.10));
            border-color: rgba(97, 175, 239, 0.45);
            box-shadow: 0 4px 16px rgba(97, 175, 239, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform: translateX(4px);
        }
        .iwara-sidebar-player-item.active::before {
            transform: scaleY(1);
        }
        .iwara-sidebar-player-item.active::after {
            opacity: 0;
        }
        .iwara-sidebar-player-icon {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 22px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 11px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 1;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .iwara-sidebar-player-item:hover .iwara-sidebar-player-icon {
            background: linear-gradient(135deg, rgba(97, 175, 239, 0.14), rgba(86, 182, 194, 0.10));
            transform: scale(1.08) rotate(-5deg);
            box-shadow: 0 4px 12px rgba(97, 175, 239, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.1);
        }
        .iwara-sidebar-player-item.active .iwara-sidebar-player-icon {
            background: linear-gradient(135deg, rgba(97, 175, 239, 0.22), rgba(86, 182, 194, 0.14));
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(97, 175, 239, 0.24), inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }
        .iwara-sidebar-player-icon img {
            width: 30px;
            height: 30px;
            object-fit: contain;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .iwara-sidebar-player-item:hover .iwara-sidebar-player-icon img {
            transform: scale(1.1);
        }
        .iwara-sidebar-player-info {
            flex: 1;
            min-width: 0;
            position: relative;
            z-index: 1;
        }
        .iwara-sidebar-player-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--iwara-text);
            margin: 0 0 3px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: all 0.3s;
            letter-spacing: 0.2px;
        }
        .iwara-sidebar-player-item:hover .iwara-sidebar-player-name {
            color: var(--iwara-text-strong);
            transform: translateX(2px);
        }
        .iwara-sidebar-player-item.active .iwara-sidebar-player-name {
            color: var(--iwara-text-strong);
            font-weight: 700;
        }
        .iwara-sidebar-player-desc {
            font-size: 11px;
            color: var(--iwara-muted);
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: all 0.3s;
        }
        .iwara-sidebar-player-item:hover .iwara-sidebar-player-desc {
            color: var(--iwara-text);
            transform: translateX(2px);
        }
        .iwara-sidebar-player-item.active .iwara-sidebar-player-desc {
            color: var(--iwara-cyan);
            font-weight: 500;
        }

        /* 左侧底部 - 设置 */
        .iwara-sidebar-footer {
            padding: 16px;
            border-top: 1px solid var(--iwara-border);
            background: linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.15));
            height: 86px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            position: relative;
        }
        .iwara-sidebar-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(97, 175, 239, 0.28), transparent);
        }
        .iwara-sidebar-main-settings {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 14px 16px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .iwara-sidebar-main-settings::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(97, 175, 239, 0.10), rgba(86, 182, 194, 0.08));
            opacity: 0;
            transition: opacity 0.3s;
            border-radius: 12px;
        }
        .iwara-sidebar-main-settings:hover::before {
            opacity: 1;
        }
        .iwara-sidebar-main-settings:hover {
            border-color: rgba(97, 175, 239, 0.22);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(97, 175, 239, 0.14);
        }
        .iwara-sidebar-main-settings.active {
            background: linear-gradient(135deg, rgba(97, 175, 239, 0.16), rgba(86, 182, 194, 0.10));
            border-color: rgba(97, 175, 239, 0.45);
            box-shadow: 0 4px 16px rgba(97, 175, 239, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .iwara-sidebar-main-settings.active::before {
            opacity: 0;
        }
        .iwara-sidebar-main-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            color: var(--iwara-muted);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 1;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .iwara-sidebar-main-settings:hover .iwara-sidebar-main-icon {
            background: linear-gradient(135deg, rgba(97, 175, 239, 0.18), rgba(86, 182, 194, 0.12));
            color: var(--iwara-cyan);
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(97, 175, 239, 0.20), inset 0 1px 2px rgba(255, 255, 255, 0.1);
        }
        .iwara-sidebar-main-settings.active .iwara-sidebar-main-icon {
            background: linear-gradient(135deg, rgba(97, 175, 239, 0.24), rgba(86, 182, 194, 0.16));
            color: var(--iwara-text-strong);
            box-shadow: 0 4px 12px rgba(97, 175, 239, 0.26), inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }
        .iwara-sidebar-main-text {
            font-size: 14px;
            font-weight: 600;
            color: var(--iwara-muted);
            transition: all 0.3s;
            position: relative;
            z-index: 1;
            letter-spacing: 0.3px;
        }
        .iwara-sidebar-main-settings:hover .iwara-sidebar-main-text {
            color: var(--iwara-text-strong);
        }
        .iwara-sidebar-main-settings.active .iwara-sidebar-main-text {
            color: var(--iwara-text-strong);
        }

        /* 右侧内容区 */
        .iwara-modal-content-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* 内容顶部标题栏 */
        .iwara-content-header {
            padding: 20px 32px;
            border-bottom: 1px solid var(--iwara-border);
            background: rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 70px;
        }
        .iwara-content-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--iwara-text-strong);
            margin: 0;
            line-height: 1.4;
        }
        #header-action-buttons {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .iwara-btn-delete-player {
            padding: 8px 18px;
            background: rgba(224, 108, 117, 0.16);
            border: 1px solid rgba(224, 108, 117, 0.45);
            border-radius: 8px;
            color: var(--iwara-red);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        .iwara-btn-delete-player:hover {
            background: rgba(224, 108, 117, 0.26);
            border-color: rgba(224, 108, 117, 0.65);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(224, 108, 117, 0.28);
        }
        .iwara-btn-create-player {
            padding: 8px 18px;
            background: linear-gradient(135deg, var(--iwara-accent) 0%, var(--iwara-cyan) 100%);
            border: none;
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        .iwara-btn-create-player:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(97, 175, 239, 0.28);
        }

        /* 内容主体 */
        .iwara-content-body {
            flex: 1;
            padding: 24px 28px;
            overflow-y: auto;
        }

        /* 内容底部 - 按钮区 */
        .iwara-content-footer {
            padding: 16px 32px;
            border-top: 1px solid var(--iwara-border);
            background: rgba(0, 0, 0, 0.2);
            height: 86px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .iwara-footer-hint {
            flex: 1;
            display: flex;
            align-items: center;
        }
        .iwara-footer-buttons {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .iwara-btn {
            padding: 10px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .iwara-btn-cancel {
            background: rgba(255, 255, 255, 0.08);
            color: var(--iwara-text);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        .iwara-btn-cancel::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(224, 108, 117, 0.16), rgba(190, 80, 70, 0.10));
            opacity: 0;
            transition: opacity 0.3s;
        }
        .iwara-btn-cancel:hover {
            background: rgba(224, 108, 117, 0.16);
            border-color: rgba(224, 108, 117, 0.45);
            color: var(--iwara-text-strong);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(224, 108, 117, 0.22);
        }
        .iwara-btn-cancel:hover::before {
            opacity: 1;
        }
        .iwara-btn-cancel:active {
            transform: translateY(0);
        }
        .iwara-btn-secondary {
            background: rgba(97, 175, 239, 0.18);
            border: 2px solid rgba(97, 175, 239, 0.45);
            color: var(--iwara-accent);
        }
        .iwara-btn-secondary:hover {
            background: rgba(97, 175, 239, 0.26);
            border-color: rgba(97, 175, 239, 0.65);
            transform: translateY(-2px);
        }
        .iwara-btn-primary {
            background: linear-gradient(135deg, var(--iwara-accent) 0%, var(--iwara-cyan) 100%);
            color: #fff;
        }
        .iwara-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(97, 175, 239, 0.28);
        }
        .iwara-btn-small {
            padding: 6px 14px;
            background: rgba(97, 175, 239, 0.18);
            border: 1px solid rgba(97, 175, 239, 0.35);
            border-radius: 6px;
            color: var(--iwara-accent);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .iwara-btn-small:hover {
            background: rgba(97, 175, 239, 0.26);
            border-color: rgba(97, 175, 239, 0.55);
        }

        /* ========== 设置页面专用样式 ========== */
        .iwara-settings-section {
            margin-bottom: 28px;
        }
        .iwara-settings-section:last-child {
            margin-bottom: 0;
        }
        .iwara-settings-section h3 {
            margin: 0 0 20px 0;
            color: var(--iwara-text-strong);
            font-size: 17px;
            font-weight: 700;
            position: relative;
            padding-left: 16px;
            letter-spacing: 0.3px;
        }
        .iwara-settings-section h3::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 20px;
            background: linear-gradient(to bottom, var(--iwara-accent), var(--iwara-cyan));
            border-radius: 2px;
        }
        .iwara-hint {
            margin: 8px 0 0 0;
            color: var(--iwara-subtle);
            font-size: 12px;
        }

        /* 播放器选项 */
        .iwara-player-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .iwara-player-option {
            position: relative;
            display: flex;
            align-items: center;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .iwara-player-option:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(97, 175, 239, 0.45);
        }
        .iwara-player-option.active {
            background: rgba(97, 175, 239, 0.14);
            border-color: rgba(97, 175, 239, 0.65);
        }
        .iwara-player-option input[type="radio"] {
            margin-right: 12px;
            cursor: pointer;
        }
        .iwara-option-icon {
            font-size: 24px;
            margin-right: 12px;
        }
        .iwara-option-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .iwara-option-text strong {
            color: var(--iwara-text-strong);
            font-size: 14px;
        }
        .iwara-option-text small {
            color: var(--iwara-subtle);
            font-size: 12px;
        }
        .iwara-player-actions {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 8px;
            z-index: 10;
        }
        .iwara-edit-btn,
        .iwara-delete-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            opacity: 0.8;
        }
        .iwara-edit-btn:hover {
            background: rgba(97, 175, 239, 0.22);
            border-color: rgba(97, 175, 239, 0.55);
            opacity: 1;
            transform: scale(1.1);
        }
        .iwara-delete-btn {
            background: rgba(255, 59, 48, 0.15);
            border-color: rgba(255, 59, 48, 0.4);
        }
        .iwara-delete-btn:hover {
            background: rgba(255, 59, 48, 0.3);
            border-color: rgba(255, 59, 48, 0.6);
            opacity: 1;
            transform: scale(1.1);
        }

        /* 画质选项 */
        .iwara-quality-options {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .iwara-quality-option {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .iwara-quality-option:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(97, 175, 239, 0.45);
        }
        .iwara-quality-option.active {
            background: rgba(97, 175, 239, 0.14);
            border-color: rgba(97, 175, 239, 0.65);
        }
        .iwara-quality-option input[type="radio"] {
            margin-right: 12px;
            cursor: pointer;
        }

        /* 代理列表 */
        .iwara-proxy-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 200px;
            overflow-y: auto;
            padding: 4px;
        }
        .iwara-proxy-list::-webkit-scrollbar {
            width: 6px;
        }
        .iwara-proxy-list::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }
        .iwara-proxy-list::-webkit-scrollbar-thumb {
            background: rgba(97, 175, 239, 0.45);
            border-radius: 3px;
        }
        .iwara-proxy-list::-webkit-scrollbar-thumb:hover {
            background: rgba(97, 175, 239, 0.62);
        }

        /* ========== 统一滚动条样式 ========== */
        .iwara-modal-sidebar::-webkit-scrollbar,
        .iwara-sidebar-players::-webkit-scrollbar,
        .iwara-content-body::-webkit-scrollbar {
            width: 8px;
        }
        .iwara-modal-sidebar::-webkit-scrollbar-track,
        .iwara-sidebar-players::-webkit-scrollbar-track,
        .iwara-content-body::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 4px;
            margin: 4px 0;
        }
        .iwara-modal-sidebar::-webkit-scrollbar-thumb,
        .iwara-sidebar-players::-webkit-scrollbar-thumb,
        .iwara-content-body::-webkit-scrollbar-thumb {
            background: rgba(97, 175, 239, 0.32);
            border-radius: 4px;
            border: 2px solid transparent;
            background-clip: padding-box;
            transition: background 0.2s;
        }
        .iwara-modal-sidebar::-webkit-scrollbar-thumb:hover,
        .iwara-sidebar-players::-webkit-scrollbar-thumb:hover,
        .iwara-content-body::-webkit-scrollbar-thumb:hover {
            background: rgba(97, 175, 239, 0.48);
            background-clip: padding-box;
        }
        .iwara-modal-sidebar::-webkit-scrollbar-thumb:active,
        .iwara-sidebar-players::-webkit-scrollbar-thumb:active,
        .iwara-content-body::-webkit-scrollbar-thumb:active {
            background: rgba(97, 175, 239, 0.62);
            background-clip: padding-box;
        }

        .iwara-proxy-item {
            display: flex;
            align-items: center;
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            transition: all 0.2s;
            gap: 10px;
        }
        .iwara-proxy-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(97, 175, 239, 0.30);
        }
        .iwara-proxy-item.disabled {
            opacity: 0.5;
        }
        .iwara-proxy-item .proxy-url {
            flex: 1;
            color: var(--iwara-text);
            font-size: 13px;
            font-family: 'Consolas', 'Monaco', monospace;
            word-break: break-all;
        }
        .iwara-proxy-item.disabled .proxy-url {
            color: var(--iwara-subtle);
            text-decoration: line-through;
        }
        .iwara-proxy-status {
            padding: 4px 10px;
            border: 1px solid;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            min-width: 70px;
            text-align: center;
        }
        .iwara-proxy-status.checking {
            background: rgba(97, 175, 239, 0.16);
            border-color: rgba(97, 175, 239, 0.40);
            color: var(--iwara-accent);
        }
        .iwara-proxy-status.success {
            background: rgba(152, 195, 121, 0.16);
            border-color: rgba(152, 195, 121, 0.40);
            color: var(--iwara-green);
        }
        .iwara-proxy-status.failed {
            background: rgba(224, 108, 117, 0.16);
            border-color: rgba(224, 108, 117, 0.40);
            color: var(--iwara-red);
        }
        .iwara-proxy-status.slow {
            background: rgba(209, 154, 102, 0.16);
            border-color: rgba(209, 154, 102, 0.40);
            color: var(--iwara-orange);
        }
        .iwara-proxy-toggle {
            padding: 4px 12px;
            background: rgba(152, 195, 121, 0.16);
            border: 1px solid rgba(152, 195, 121, 0.40);
            border-radius: 6px;
            color: var(--iwara-green);
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .iwara-proxy-toggle:hover {
            background: rgba(152, 195, 121, 0.26);
            border-color: rgba(152, 195, 121, 0.65);
            transform: scale(1.05);
        }
        .iwara-proxy-toggle.disabled {
            background: rgba(224, 108, 117, 0.16);
            border-color: rgba(224, 108, 117, 0.40);
            color: var(--iwara-red);
        }
        .iwara-proxy-toggle.disabled:hover {
            background: rgba(224, 108, 117, 0.26);
            border-color: rgba(224, 108, 117, 0.65);
        }
        .iwara-proxy-delete {
            padding: 4px 8px;
            background: rgba(224, 108, 117, 0.16);
            border: 1px solid rgba(224, 108, 117, 0.45);
            border-radius: 6px;
            color: var(--iwara-red);
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            line-height: 1;
        }
        .iwara-proxy-delete:hover {
            background: rgba(224, 108, 117, 0.26);
            border-color: rgba(224, 108, 117, 0.65);
            transform: scale(1.1);
        }

        /* Select 下拉框样式 */
        select.iwara-form-input {
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2361afef' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 36px;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        }
        select.iwara-form-input:hover {
            border-color: rgba(97, 175, 239, 0.45);
        }
        select.iwara-form-input option {
            background: var(--iwara-bg-2);
            color: var(--iwara-text);
            padding: 10px;
        }
        select.iwara-form-input option:hover {
            background: var(--iwara-accent);
        }
    `);
  }
  const SVG_ICONS = {
    COPY: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
    NEW_TAB: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
    PLAY: '<polygon points="5 3 19 12 5 21 5 3"></polygon>'
  };
  let notificationContainer = null;
  const activeNotifications = /* @__PURE__ */ new Set();
  function createNotifier(getProxyList) {
    function withProxyHint(message, meta) {
      try {
        const hostname = typeof meta?.proxyHostname === "string" && meta.proxyHostname.trim() || typeof meta?.proxyUrl === "string" && meta.proxyUrl.trim() && new URL(meta.proxyUrl).hostname || typeof meta?.proxyPrefix === "string" && meta.proxyPrefix.trim() && new URL(meta.proxyPrefix).hostname;
        if (!hostname) return message;
        const enabledCount = (getProxyList?.() || []).filter((p) => p?.enabled).length;
        return `${message}
🔗 代理: ${hostname}`;
      } catch {
        return message;
      }
    }
    function notify2(message, type = "info", meta) {
      message = withProxyHint(message, meta);
      const styles = {
        error: {
          bg: "linear-gradient(135deg, #e06c75 0%, #be5046 100%)",
          glow: "rgba(224, 108, 117, 0.45)",
          glowStrong: "rgba(224, 108, 117, 0.75)"
        },
        success: {
          bg: "linear-gradient(135deg, #98c379 0%, #7bbd6a 100%)",
          glow: "rgba(152, 195, 121, 0.45)",
          glowStrong: "rgba(152, 195, 121, 0.75)"
        },
        info: {
          bg: "linear-gradient(135deg, #61afef 0%, #56b6c2 100%)",
          glow: "rgba(97, 175, 239, 0.45)",
          glowStrong: "rgba(97, 175, 239, 0.75)"
        }
      };
      if (!notificationContainer) {
        notificationContainer = document.createElement("div");
        notificationContainer.id = "iwara-notification-container";
        notificationContainer.style.cssText = [
          "position: fixed",
          "top: 20px",
          "right: 20px",
          "z-index: 9999999",
          "display: flex",
          "flex-direction: column",
          "gap: 12px",
          "pointer-events: none"
        ].join(";");
        document.body.appendChild(notificationContainer);
        if (!document.getElementById("iwara-notification-styles")) {
          const globalStyles = document.createElement("style");
          globalStyles.id = "iwara-notification-styles";
          globalStyles.textContent = `
          @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        `;
          document.head.appendChild(globalStyles);
        }
      }
      const style = styles[type] || styles.info;
      const notification = document.createElement("div");
      notification.className = "iwara-notification-item";
      notification.style.cssText = [
        "padding: 16px 24px",
        `background: ${style.bg}`,
        "color: white",
        "border-radius: 12px",
        `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px ${style.glow}`,
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        "font-size: 14px",
        "font-weight: 600",
        "border: 2px solid rgba(255, 255, 255, 0.3)",
        "animation: slideInRight 0.3s ease",
        "white-space: pre-line",
        "pointer-events: auto",
        "transition: transform 0.3s ease, opacity 0.3s ease"
      ].join(";");
      const pulseId = `pulse-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
      @keyframes ${pulseId} {
        0%, 100% { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px ${style.glow}; }
        50% { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 30px ${style.glowStrong}, 0 0 10px rgba(255, 255, 255, 0.5); }
      }
    `;
      notification.appendChild(styleSheet);
      notification.style.animation += `, ${pulseId} 1.5s ease-in-out infinite`;
      notification.textContent = message;
      notificationContainer.appendChild(notification);
      activeNotifications.add(notification);
      setTimeout(() => {
        notification.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => {
          activeNotifications.delete(notification);
          notification.remove();
          if (activeNotifications.size === 0 && notificationContainer) {
            notificationContainer.remove();
            notificationContainer = null;
          }
        }, 300);
      }, 3e3);
    }
    return notify2;
  }
  function createSettingsButton({ onClick }) {
    if (document.getElementById("iwara-mpv-settings-fab")) return;
    const settingsButton = document.createElement("button");
    settingsButton.id = "iwara-mpv-settings-fab";
    settingsButton.className = "iwara-mpv-fab";
    settingsButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/>
    </svg>
  `;
    settingsButton.title = "播放器设置";
    settingsButton.addEventListener("click", onClick);
    document.body.appendChild(settingsButton);
  }
  function createSettingsModal(deps) {
    const {
      getPlayers,
      setPlayers,
      getExternalPlayer: getExternalPlayer2,
      setExternalPlayer: setExternalPlayer2,
      getProxyList,
      setProxyList,
      getProxyTimeout,
      setProxyTimeout,
      getButtonSettings,
      setButtonSettings,
      resetToDefaultPlayers: resetToDefaultPlayers2,
      normalizeProxyUrl: normalizeProxyUrl2,
      notify: notify2,
      refreshAllButtons
    } = deps;
    const showNotification = notify2 || (() => {
    });
    return function openSettingsModal2() {
      const existingModal = document.getElementById("iwara-mpv-settings-modal");
      if (existingModal) existingModal.remove();
      let tempPlayers = JSON.parse(JSON.stringify(getPlayers() || []));
      let currentView = "main-settings";
      let currentDefaultPlayer = getExternalPlayer2();
      let tempProxyList = JSON.parse(JSON.stringify(getProxyList() || []));
      let tempButtonSettings = JSON.parse(JSON.stringify(getButtonSettings() || {}));
      let tempProxyTimeout = getProxyTimeout();
      const modal = document.createElement("div");
      modal.id = "iwara-mpv-settings-modal";
      modal.className = "iwara-modal";
      modal.innerHTML = `
      <div class="iwara-modal-overlay">
        <div class="iwara-modal-content">
          <div class="iwara-modal-main">
            <div class="iwara-modal-sidebar">
              <div class="iwara-sidebar-players" id="player-list"></div>
              <div class="iwara-sidebar-footer">
                <div class="iwara-sidebar-main-settings" data-view="main-settings">
                  <div class="iwara-sidebar-main-icon">🎛️</div>
                  <div class="iwara-sidebar-main-text">设置</div>
                </div>
              </div>
            </div>

            <div class="iwara-modal-content-area">
              <div class="iwara-content-header" id="content-header" style="display: none;">
                <h3 class="iwara-content-title" id="content-title"></h3>
                <div id="header-action-buttons">
                  <button class="iwara-btn-create-player" id="btn-create-player" style="display: none;">✓ 创建</button>
                  <button class="iwara-btn-delete-player" id="btn-delete-player" style="display: none;">🗑️ 删除</button>
                </div>
              </div>

              <div class="iwara-content-body" id="content-body">
                <p style="color: #64748b; text-align: center; margin-top: 100px;">👈 请从左侧选择一个播放器或设置</p>
              </div>

              <div class="iwara-content-footer">
                <div class="iwara-footer-hint">
                  <span style="color: #94a3b8; font-size: 13px;">💡 提示：若保存设置未生效，请手动刷新页面</span>
                </div>
                <div class="iwara-footer-buttons">
                  <button class="iwara-btn iwara-btn-cancel" id="btn-close">✕ 关闭</button>
                  <button class="iwara-btn iwara-btn-primary" id="btn-save">💾 保存</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
      document.body.appendChild(modal);
      function renderPlayerList() {
        const playerListContainer = modal.querySelector("#player-list");
        playerListContainer.innerHTML = "";
        tempPlayers.forEach((player) => {
          const item = document.createElement("div");
          item.className = "iwara-sidebar-player-item";
          item.dataset.playerName = player.name;
          if (currentView === player.name) item.classList.add("active");
          const iconHtml = player.icon && player.icon.startsWith("data:image") ? `<img src="${player.icon}" alt="${player.name}">` : player.icon || "🎮";
          item.innerHTML = `
          <div class="iwara-sidebar-player-icon">${iconHtml}</div>
          <div class="iwara-sidebar-player-info">
            <p class="iwara-sidebar-player-name">${player.name}</p>
          </div>
        `;
          item.addEventListener("click", () => {
            currentView = player.name;
            player.name;
            updateView();
          });
          playerListContainer.appendChild(item);
        });
        const addPlayerItem = document.createElement("div");
        addPlayerItem.className = "iwara-sidebar-player-item iwara-sidebar-add-player";
        if (currentView === "add-player") addPlayerItem.classList.add("active");
        addPlayerItem.innerHTML = `
        <div class="iwara-sidebar-player-icon"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiM2NjdlZWEiIHJ4PSI0Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE2IDhWMjRNOCAxNkgyNCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==" alt="添加"></div>
        <div class="iwara-sidebar-player-info">
          <p class="iwara-sidebar-player-name">添加</p>
        </div>
      `;
        addPlayerItem.addEventListener("click", () => {
          currentView = "add-player";
          updateView();
        });
        playerListContainer.appendChild(addPlayerItem);
      }
      function updateView() {
        modal.querySelectorAll(".iwara-sidebar-player-item").forEach((item) => {
          if (item.classList.contains("iwara-sidebar-add-player")) {
            item.classList.toggle("active", currentView === "add-player");
          } else {
            item.classList.toggle("active", item.dataset.playerName === currentView);
          }
        });
        modal.querySelector(".iwara-sidebar-main-settings").classList.toggle("active", currentView === "main-settings");
        const contentHeader = modal.querySelector("#content-header");
        const contentTitle = modal.querySelector("#content-title");
        const deleteButton = modal.querySelector("#btn-delete-player");
        const createButton = modal.querySelector("#btn-create-player");
        if (currentView === "main-settings") {
          contentHeader.style.display = "none";
          renderMainSettings();
          return;
        }
        if (currentView === "add-player") {
          contentHeader.style.display = "flex";
          contentTitle.textContent = "➕ 添加";
          deleteButton.style.display = "none";
          createButton.style.display = "block";
          renderAddPlayerForm();
          return;
        }
        const player = tempPlayers.find((p) => p.name === currentView);
        if (player) {
          contentHeader.style.display = "flex";
          contentTitle.textContent = `✏️ 编辑`;
          deleteButton.style.display = "block";
          createButton.style.display = "none";
          renderPlayerEditForm(player);
        }
      }
      function renderPlayerForm(isEditMode, player = null) {
        const isProtocol = player ? player.type === "protocol" : true;
        const protocolDisplay = isProtocol ? "block" : "none";
        const ushDisplay = isProtocol ? "none" : "block";
        const prefix = isEditMode ? "edit" : "new";
        return `
        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #94a3b8; font-size: 13px; margin-bottom: 8px;">播放器名称</label>
          <input type="text" id="${prefix}-player-name" value="${player ? player.name : ""}" class="iwara-form-input" placeholder="例如: PotPlayer">
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #94a3b8; font-size: 13px; margin-bottom: 8px;">协议类型</label>
          <select id="${prefix}-protocol-type" class="iwara-form-input">
            <option value="protocol" ${isProtocol ? "selected" : ""}>标准协议</option>
            <option value="ush" ${!isProtocol ? "selected" : ""}>USH协议</option>
          </select>
        </div>

        <div id="${prefix}-protocol-group" style="margin-bottom: 20px; display: ${protocolDisplay};">
          <label style="display: block; color: #94a3b8; font-size: 13px; margin-bottom: 8px;">协议链接参数</label>
          <input type="text" id="${prefix}-protocol" value="${player && player.protocol ? player.protocol : ""}" class="iwara-form-input" placeholder="例如: potplayer://\${url}">
          <p style="color: #64748b; font-size: 12px; margin: 6px 0 0 0;">可用参数: \${title} 标题 | \${url} 原始链接 | \${url:base64} base64编码 | \${url:encode} url编码</p>
        </div>

        <div id="${prefix}-ush-group" style="display: ${ushDisplay};">
          <div style="margin-bottom: 20px;">
            <label style="display: block; color: #94a3b8; font-size: 13px; margin-bottom: 8px;">应用名称</label>
            <input type="text" id="${prefix}-ush-app" value="${player && player.appName ? player.appName : ""}" class="iwara-form-input" placeholder="例如: MPV (和ush工具配置的名称要完全一致)">
            <p class="iwara-hint"><a href="https://github.com/LuckyPuppy514/url-scheme-handler" target="_blank" style="color: #667eea;">⭐ ush工具 - LuckyPuppy514/url-scheme-handler</a></p>
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; color: #94a3b8; font-size: 13px; margin-bottom: 8px;">启动参数 (可选)</label>
            <textarea id="${prefix}-ush-args" class="iwara-form-textarea" rows="4" placeholder="每行一个参数，例如:
--ontop
--fullscreen">${player && player.args ? player.args.join("\n") : ""}</textarea>
            <p style="color: #64748b; font-size: 12px; margin: 6px 0 0 0;">可用参数: \${title} 标题 | \${url} 原始链接 | \${url:base64} base64编码 | \${url:encode} url编码</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #94a3b8; font-size: 13px; margin-bottom: 8px;">图标 (Base64 Data URL)</label>
          <textarea id="${prefix}-player-icon" class="iwara-form-textarea" rows="3" placeholder="data:image/png;base64,iVBORw0KGgoAAAANS...">${player && player.icon ? player.icon : ""}</textarea>
          <p style="color: #64748b; font-size: 12px; margin: 6px 0 0 0;">支持 data:image/png、data:image/svg+xml 等格式</p>
        </div>
      `;
      }
      function setupProtocolTypeToggle(prefix) {
        const contentBody = modal.querySelector("#content-body");
        const protocolTypeSelect = contentBody.querySelector(`#${prefix}-protocol-type`);
        const protocolGroup = contentBody.querySelector(`#${prefix}-protocol-group`);
        const ushGroup = contentBody.querySelector(`#${prefix}-ush-group`);
        if (!protocolTypeSelect) return;
        protocolTypeSelect.addEventListener("change", () => {
          if (protocolTypeSelect.value === "protocol") {
            protocolGroup.style.display = "block";
            ushGroup.style.display = "none";
          } else {
            protocolGroup.style.display = "none";
            ushGroup.style.display = "block";
          }
        });
      }
      function renderPlayerEditForm(player) {
        const contentBody = modal.querySelector("#content-body");
        const originalName = player.name;
        contentBody.innerHTML = renderPlayerForm(true, player);
        setupProtocolTypeToggle("edit");
        const inputs = [
          contentBody.querySelector("#edit-player-name"),
          contentBody.querySelector("#edit-protocol-type"),
          contentBody.querySelector("#edit-protocol"),
          contentBody.querySelector("#edit-ush-app"),
          contentBody.querySelector("#edit-ush-args"),
          contentBody.querySelector("#edit-player-icon")
        ];
        inputs.forEach((input) => {
          if (!input) return;
          input.addEventListener("input", () => {
            const name = contentBody.querySelector("#edit-player-name").value.trim();
            const type = contentBody.querySelector("#edit-protocol-type").value;
            const icon = contentBody.querySelector("#edit-player-icon").value.trim();
            const playerIndex = tempPlayers.findIndex((p) => p.name === originalName);
            if (playerIndex !== -1) {
              tempPlayers[playerIndex].name = name;
              tempPlayers[playerIndex].type = type;
              tempPlayers[playerIndex].icon = icon;
              if (type === "protocol") {
                tempPlayers[playerIndex].protocol = contentBody.querySelector("#edit-protocol").value.trim();
                delete tempPlayers[playerIndex].appName;
                delete tempPlayers[playerIndex].args;
              } else {
                tempPlayers[playerIndex].appName = contentBody.querySelector("#edit-ush-app").value.trim();
                const args = contentBody.querySelector("#edit-ush-args").value.trim();
                tempPlayers[playerIndex].args = args ? args.split("\n").map((a) => a.trim()).filter((a) => a) : ["{url}"];
                delete tempPlayers[playerIndex].protocol;
              }
            }
            const contentTitle = modal.querySelector("#content-title");
            if (contentTitle && name) contentTitle.textContent = `✏️ 编辑播放器: ${name}`;
          });
        });
        const deleteButton = modal.querySelector("#btn-delete-player");
        const newDeleteButton = deleteButton.cloneNode(true);
        deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);
        newDeleteButton.addEventListener("click", () => {
          if (!confirm(`确定要删除"${player.name}"吗？`)) return;
          const index = tempPlayers.findIndex((p) => p.name === originalName);
          if (index !== -1) tempPlayers.splice(index, 1);
          if (currentDefaultPlayer === originalName) {
            currentDefaultPlayer = tempPlayers.length > 0 ? tempPlayers[0].name : "MPV";
          }
          currentView = "main-settings";
          renderPlayerList();
          updateView();
          showNotification(`✅ 已删除"${player.name}"`, "success");
        });
      }
      function renderAddPlayerForm() {
        const contentBody = modal.querySelector("#content-body");
        contentBody.innerHTML = renderPlayerForm(false);
        setupProtocolTypeToggle("new");
        const createButton = modal.querySelector("#btn-create-player");
        const newCreateButton = createButton.cloneNode(true);
        createButton.parentNode.replaceChild(newCreateButton, createButton);
        newCreateButton.addEventListener("click", () => {
          const name = contentBody.querySelector("#new-player-name").value.trim();
          const type = contentBody.querySelector("#new-protocol-type").value;
          const icon = contentBody.querySelector("#new-player-icon").value.trim();
          if (!name) {
            showNotification("❌ 请输入播放器名称", "error");
            return;
          }
          if (tempPlayers.some((p) => p.name === name)) {
            showNotification("❌ 播放器名称已存在", "error");
            return;
          }
          const playerConfig = {
            name,
            type,
            icon: icon || "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iIzY2N2VlYSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMyAxMWw4IDUtOCA1eiIvPjwvc3ZnPg=="
          };
          if (type === "protocol") {
            const protocol = contentBody.querySelector("#new-protocol").value.trim();
            if (!protocol) {
              showNotification("❌ 请输入协议链接参数", "error");
              return;
            }
            if (!protocol.includes("${url}")) {
              showNotification("❌ 协议链接必须包含 ${url} 占位符", "error");
              return;
            }
            playerConfig.protocol = protocol;
          } else {
            const appName = contentBody.querySelector("#new-ush-app").value.trim();
            if (!appName) {
              showNotification("❌ 请输入应用名称", "error");
              return;
            }
            const args = contentBody.querySelector("#new-ush-args").value.trim();
            playerConfig.appName = appName;
            playerConfig.args = args ? args.split("\n").map((a) => a.trim()).filter((a) => a) : ["{url}"];
          }
          tempPlayers.push(playerConfig);
          currentView = name;
          renderPlayerList();
          updateView();
          showNotification(`✅ 已添加"${name}"`, "success");
        });
      }
      function renderMainSettings() {
        const contentBody = modal.querySelector("#content-body");
        const currentProxy = tempProxyList.map((p) => {
          const prefix = p.enabled ? "" : "#";
          return `${prefix}${p.url}`;
        }).join("\n");
        contentBody.innerHTML = `
        <div class="iwara-settings-section">
          <div class="iwara-settings-header">
            <h4>🎬 默认播放器</h4>
            <button class="iwara-btn-small" id="reset-players">🔄 重置</button>
          </div>
          <select id="default-player-select" class="iwara-form-input">
            ${tempPlayers.map((p) => `<option value="${p.name}" ${p.name === currentDefaultPlayer ? "selected" : ""}>${p.name}</option>`).join("")}
          </select>
        </div>

        <div class="iwara-settings-section">
          <h4 class="iwara-settings-section-title no-indicator">⚪ 按钮显示设置</h4>

          <div class="iwara-settings-subsection">
            <h5>📄 详情页</h5>
            <div class="iwara-button-settings-grid">
              <label class="iwara-checkbox-label">
                <input type="checkbox" id="detail-copy" ${tempButtonSettings.detailPage.copy ? "checked" : ""}>
                <span>复制链接</span>
              </label>
              <label class="iwara-checkbox-label">
                <input type="checkbox" id="detail-newtab" ${tempButtonSettings.detailPage.newTab ? "checked" : ""}>
                <span>新标签页播放</span>
              </label>
              <label class="iwara-checkbox-label">
                <input type="checkbox" id="detail-quality" ${tempButtonSettings.detailPage.quality ? "checked" : ""}>
                <span>540画质播放</span>
              </label>
              <label class="iwara-checkbox-label">
                <input type="checkbox" id="detail-play" ${tempButtonSettings.detailPage.play ? "checked" : ""}>
                <span>Source画质播放</span>
              </label>
            </div>
          </div>

          <div class="iwara-settings-subsection">
            <h5>📋 列表页</h5>
            <div class="iwara-button-settings-grid">
              <label class="iwara-checkbox-label">
                <input type="checkbox" id="list-copy" ${tempButtonSettings.listPage.copy ? "checked" : ""}>
                <span>复制链接</span>
              </label>
              <label class="iwara-checkbox-label">
                <input type="checkbox" id="list-newtab" ${tempButtonSettings.listPage.newTab ? "checked" : ""}>
                <span>新标签页播放</span>
              </label>
              <label class="iwara-checkbox-label">
                <input type="checkbox" id="list-quality" ${tempButtonSettings.listPage.quality ? "checked" : ""}>
                <span>540画质播放</span>
              </label>
              <label class="iwara-checkbox-label">
                <input type="checkbox" id="list-play" ${tempButtonSettings.listPage.play ? "checked" : ""}>
                <span>Source画质播放</span>
              </label>
            </div>
          </div>
        </div>

        <div class="iwara-settings-section">
          <div class="iwara-settings-header">
            <h4>🔗 代理服务 (可选)</h4>
            <div style="display: flex; gap: 8px;">
              <button class="iwara-btn-small" id="save-multi-edit" style="display: none;">💾 保存</button>
              <button class="iwara-btn-small" id="toggle-edit-mode">📝 手动编辑</button>
            </div>
          </div>

          <div id="single-add-mode" style="display: block;">
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <input type="text" id="new-proxy-input" placeholder="多个将会随机选取, 代理地址 例: proxy.example.com 或 https://proxy.example.com/" class="iwara-form-input" style="flex: 1;">
              <button class="iwara-btn-small" id="add-proxy">➕ 添加</button>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; align-items: center;">
              <div style="display: flex; align-items: center; gap: 4px;">
                <label style="color: var(--iwara-muted); font-size: 13px; white-space: nowrap;">超时</label>
                <input type="number" id="proxy-timeout" value="${tempProxyTimeout}" min="1" max="100000" step="100" class="iwara-form-input" style="width: 80px; padding: 4px 8px; font-size: 13px;">
                <span style="color: var(--iwara-muted); font-size: 13px;">ms</span>
              </div>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; align-items: center;">
              <button class="iwara-btn-small" id="check-all-proxies">🔍 检测延迟</button>
              <button class="iwara-btn-small" id="enable-all-proxies" style="background: rgba(152, 195, 121, 0.18); border-color: rgba(152, 195, 121, 0.38); color: #98c379;">✓ 启用全部</button>
              <button class="iwara-btn-small" id="disable-all-proxies" style="background: rgba(92, 99, 112, 0.18); border-color: rgba(92, 99, 112, 0.38); color: #abb2bf;">✕ 禁用全部</button>
              <button class="iwara-btn-small" id="disable-failed-proxies" style="background: rgba(229, 192, 123, 0.16); border-color: rgba(229, 192, 123, 0.36); color: #e5c07b;">⚠️ 禁用超时</button>
              <button class="iwara-btn-small" id="delete-failed-proxies" style="background: rgba(224, 108, 117, 0.18); border-color: rgba(224, 108, 117, 0.38); color: #e06c75;">🗑️ 删除超时</button>
            </div>
            <div id="proxy-list-container" class="iwara-proxy-list" style="max-height: 200px;"></div>
          </div>

          <div id="multi-edit-mode" style="display: none;">
            <textarea id="proxy-input" class="iwara-form-textarea" style="min-height: 160px;" placeholder="每行一个代理，以#开头表示禁用:
proxy1.example.com
#proxy2.example.com (禁用)
https://proxy3.example.com/
&#10;💡 不指定协议会自动添加 https://">${currentProxy}</textarea>
            <p style="color: #64748b; font-size: 12px; margin: 8px 0 0 0;">💡 每行一个代理地址，以 # 开头的代理将被禁用。未指定协议的地址将自动补全为 https://</p>
          </div>

          <p style="color: var(--iwara-subtle); font-size: 12px; margin: 8px 0 0 0;">
            <a href="https://github.com/1234567Yang/cf-proxy-ex" target="_blank" style="color: var(--iwara-accent); text-decoration: none;">⭐ 代理项目(需自行部署): cf-proxy-ex</a>
          </p>
          <p style="color: var(--iwara-subtle); font-size: 12px; margin: 8px 0 0 0;">⏩ 获取视频链接与播放链接会使用同一代理</p>
        </div>
      `;
        contentBody.querySelector("#default-player-select").addEventListener("change", (e) => {
          currentDefaultPlayer = e.target.value;
        });
        contentBody.querySelector("#detail-copy").addEventListener("change", (e) => {
          tempButtonSettings.detailPage.copy = e.target.checked;
        });
        contentBody.querySelector("#detail-newtab").addEventListener("change", (e) => {
          tempButtonSettings.detailPage.newTab = e.target.checked;
        });
        contentBody.querySelector("#detail-quality").addEventListener("change", (e) => {
          tempButtonSettings.detailPage.quality = e.target.checked;
        });
        contentBody.querySelector("#detail-play").addEventListener("change", (e) => {
          tempButtonSettings.detailPage.play = e.target.checked;
        });
        contentBody.querySelector("#list-copy").addEventListener("change", (e) => {
          tempButtonSettings.listPage.copy = e.target.checked;
        });
        contentBody.querySelector("#list-newtab").addEventListener("change", (e) => {
          tempButtonSettings.listPage.newTab = e.target.checked;
        });
        contentBody.querySelector("#list-quality").addEventListener("change", (e) => {
          tempButtonSettings.listPage.quality = e.target.checked;
        });
        contentBody.querySelector("#list-play").addEventListener("change", (e) => {
          tempButtonSettings.listPage.play = e.target.checked;
        });
        contentBody.querySelector("#reset-players").addEventListener("click", () => {
          if (confirm("确定要恢复到默认播放器列表吗？\n\n这将删除所有自定义播放器。")) {
            modal.remove();
            resetToDefaultPlayers2();
          }
        });
        renderProxyList();
        setupProxyEditMode();
      }
      function renderProxyList() {
        const container = modal.querySelector("#proxy-list-container");
        if (!container) return;
        container.innerHTML = "";
        if (tempProxyList.length === 0) {
          container.innerHTML = '<p style="color: #64748b; text-align: center; padding: 20px 0; margin: 0;">暂无代理，请使用上方输入框添加</p>';
          return;
        }
        tempProxyList.forEach((proxy, index) => {
          const item = document.createElement("div");
          item.className = "iwara-proxy-item" + (proxy.enabled ? "" : " disabled");
          item.dataset.index = index;
          const urlSpan = document.createElement("span");
          urlSpan.className = "proxy-url";
          urlSpan.textContent = proxy.url;
          const statusSpan = document.createElement("span");
          statusSpan.className = "iwara-proxy-status";
          statusSpan.style.display = "none";
          statusSpan.textContent = "-";
          const toggleBtn = document.createElement("button");
          toggleBtn.className = "iwara-proxy-toggle" + (proxy.enabled ? "" : " disabled");
          toggleBtn.textContent = proxy.enabled ? "✓ 启用" : "✕ 禁用";
          toggleBtn.addEventListener("click", () => {
            proxy.enabled = !proxy.enabled;
            renderProxyList();
          });
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "iwara-proxy-delete";
          deleteBtn.textContent = "🗑️";
          deleteBtn.addEventListener("click", () => {
            if (confirm(`确定要删除代理 "${proxy.url}" 吗？`)) {
              tempProxyList.splice(index, 1);
              renderProxyList();
            }
          });
          item.appendChild(urlSpan);
          item.appendChild(statusSpan);
          item.appendChild(toggleBtn);
          item.appendChild(deleteBtn);
          container.appendChild(item);
        });
      }
      async function checkSingleProxy(proxyUrl, timeoutMs) {
        const startTime = performance.now();
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve({ success: false, latency: -1, error: "timeout" });
          }, timeoutMs);
          GM_xmlhttpRequest({
            method: "GET",
            url: proxyUrl,
            timeout: timeoutMs,
            onload: function(response) {
              clearTimeout(timeout);
              const endTime = performance.now();
              const latency = Math.round(endTime - startTime);
              resolve({ success: true, latency, status: response.status });
            },
            onerror: function() {
              clearTimeout(timeout);
              resolve({ success: false, latency: -1, error: "network" });
            },
            ontimeout: function() {
              clearTimeout(timeout);
              resolve({ success: false, latency: -1, error: "timeout" });
            }
          });
        });
      }
      async function checkAllProxies() {
        const container = modal.querySelector("#proxy-list-container");
        if (!container || tempProxyList.length === 0) {
          showNotification("❌ 没有可检测的代理", "error");
          return;
        }
        const timeoutInput = modal.querySelector("#proxy-timeout");
        let timeoutMs = parseInt(timeoutInput.value) || 1e4;
        if (timeoutMs < 100) timeoutMs = 100;
        if (timeoutMs > 1e5) timeoutMs = 1e5;
        timeoutInput.value = timeoutMs;
        const checkBtn = modal.querySelector("#check-all-proxies");
        const originalText = checkBtn.textContent;
        checkBtn.disabled = true;
        checkBtn.textContent = "🔍 检测中...";
        const items = container.querySelectorAll(".iwara-proxy-item");
        items.forEach((item) => {
          const statusSpan = item.querySelector(".iwara-proxy-status");
          if (statusSpan) {
            statusSpan.style.display = "inline-block";
            statusSpan.className = "iwara-proxy-status checking";
            statusSpan.textContent = "检测中...";
          }
          const proxy = tempProxyList[item.dataset.index];
          if (proxy) delete proxy.checkResult;
        });
        const results = new Array(tempProxyList.length);
        const BATCH_SIZE = 5;
        const applyResultToUI = (result, index) => {
          const item = container.querySelector(`[data-index="${index}"]`);
          if (!item) return;
          const statusSpan = item.querySelector(".iwara-proxy-status");
          if (!statusSpan) return;
          tempProxyList[index].checkResult = result;
          if (result.success) {
            const latency = result.latency;
            statusSpan.textContent = `${latency}ms`;
            if (latency < 200) {
              statusSpan.className = "iwara-proxy-status success";
            } else if (latency < 1e3) {
              statusSpan.className = "iwara-proxy-status slow";
            } else {
              statusSpan.className = "iwara-proxy-status slow";
            }
          } else {
            statusSpan.className = "iwara-proxy-status failed";
            statusSpan.textContent = result.error === "timeout" ? "超时" : "失败";
          }
        };
        for (let start = 0; start < tempProxyList.length; start += BATCH_SIZE) {
          const batch = tempProxyList.slice(start, start + BATCH_SIZE);
          const batchResults = await Promise.all(batch.map((proxy) => checkSingleProxy(proxy.url, timeoutMs)));
          batchResults.forEach((result, offset) => {
            const index = start + offset;
            results[index] = result;
            applyResultToUI(result, index);
          });
        }
        checkBtn.disabled = false;
        checkBtn.textContent = originalText;
        const successCount = results.filter((r) => r.success).length;
        const failCount = results.length - successCount;
        showNotification(`✅ 检测完成: ${successCount} 个可用, ${failCount} 个失败`, "success");
      }
      function enableAllProxies() {
        if (tempProxyList.length === 0) {
          showNotification("ℹ️ 没有可启用的代理", "info");
          return;
        }
        const disabledCount = tempProxyList.filter((p) => !p.enabled).length;
        if (disabledCount === 0) {
          showNotification("ℹ️ 所有代理都已启用", "info");
          return;
        }
        tempProxyList.forEach((proxy) => {
          proxy.enabled = true;
        });
        renderProxyList();
        showNotification(`✅ 已启用全部代理 (${disabledCount} 个)`, "success");
      }
      function disableAllProxies() {
        if (tempProxyList.length === 0) {
          showNotification("ℹ️ 没有可禁用的代理", "info");
          return;
        }
        const enabledCount = tempProxyList.filter((p) => p.enabled).length;
        if (enabledCount === 0) {
          showNotification("ℹ️ 所有代理都已禁用", "info");
          return;
        }
        tempProxyList.forEach((proxy) => {
          proxy.enabled = false;
        });
        renderProxyList();
        showNotification(`✅ 已禁用全部代理 (${enabledCount} 个)`, "success");
      }
      function disableFailedProxies() {
        const failedCount = tempProxyList.filter((p) => p.checkResult && !p.checkResult.success).length;
        if (failedCount === 0) {
          showNotification("ℹ️ 没有检测到超时的代理", "info");
          return;
        }
        if (confirm(`确定要禁用 ${failedCount} 个失败的代理吗？`)) {
          tempProxyList.forEach((proxy) => {
            if (proxy.checkResult && !proxy.checkResult.success) proxy.enabled = false;
          });
          renderProxyList();
          showNotification(`✅ 已禁用 ${failedCount} 个失败的代理`, "success");
        }
      }
      function deleteFailedProxies() {
        const failedCount = tempProxyList.filter((p) => p.checkResult && !p.checkResult.success).length;
        if (failedCount === 0) {
          showNotification("ℹ️ 没有检测到超时的代理", "info");
          return;
        }
        if (confirm(`确定要删除 ${failedCount} 个失败的代理吗？

此操作不可恢复！`)) {
          tempProxyList = tempProxyList.filter((p) => !p.checkResult || p.checkResult.success);
          renderProxyList();
          showNotification(`✅ 已删除 ${failedCount} 个失败的代理`, "success");
        }
      }
      function setupProxyEditMode() {
        let isMultiEditMode = false;
        const toggleModeBtn = modal.querySelector("#toggle-edit-mode");
        const singleAddMode = modal.querySelector("#single-add-mode");
        const multiEditMode = modal.querySelector("#multi-edit-mode");
        const addProxyBtn = modal.querySelector("#add-proxy");
        const newProxyInput = modal.querySelector("#new-proxy-input");
        if (!toggleModeBtn) return;
        const saveMultiEditBtn = modal.querySelector("#save-multi-edit");
        toggleModeBtn.addEventListener("click", () => {
          if (isMultiEditMode) {
            const textarea = modal.querySelector("#proxy-input");
            const lines = textarea.value.split("\n");
            tempProxyList = [];
            const urlSet = /* @__PURE__ */ new Set();
            let duplicateCount = 0;
            let invalidCount = 0;
            lines.forEach((line) => {
              line = line.trim();
              if (line === "") return;
              let enabled = true;
              let url = line;
              if (line.startsWith("#")) {
                enabled = false;
                url = line.substring(1).trim();
              }
              if (url !== "") {
                const normalized = normalizeProxyUrl2(url);
                if (normalized && !urlSet.has(normalized)) {
                  urlSet.add(normalized);
                  tempProxyList.push({ url: normalized, enabled });
                } else if (normalized && urlSet.has(normalized)) {
                  duplicateCount++;
                } else if (!normalized) {
                  invalidCount++;
                }
              }
            });
            isMultiEditMode = false;
            multiEditMode.style.display = "none";
            singleAddMode.style.display = "block";
            saveMultiEditBtn.style.display = "none";
            toggleModeBtn.textContent = "📝 手动编辑";
            renderProxyList();
            const messages2 = [];
            if (duplicateCount > 0) messages2.push(`已去重 ${duplicateCount} 个重复项`);
            if (invalidCount > 0) messages2.push(`已忽略 ${invalidCount} 个无效项`);
            if (messages2.length > 0) {
              showNotification(`✅ 已保存并切换到列表编辑（${messages2.join("，")}）`, "success");
            } else {
              showNotification("✅ 已保存并切换到列表编辑", "success");
            }
          } else {
            isMultiEditMode = true;
            const textarea = modal.querySelector("#proxy-input");
            const lines = tempProxyList.map((p) => {
              const prefix = p.enabled ? "" : "#";
              return `${prefix}${p.url}`;
            });
            textarea.value = lines.join("\n");
            singleAddMode.style.display = "none";
            multiEditMode.style.display = "block";
            saveMultiEditBtn.style.display = "block";
            toggleModeBtn.textContent = "📋 列表编辑";
          }
        });
        if (saveMultiEditBtn) {
          saveMultiEditBtn.addEventListener("click", () => {
            const textarea = modal.querySelector("#proxy-input");
            const lines = textarea.value.split("\n");
            tempProxyList = [];
            const urlSet = /* @__PURE__ */ new Set();
            let duplicateCount = 0;
            let invalidCount = 0;
            lines.forEach((line) => {
              line = line.trim();
              if (line === "") return;
              let enabled = true;
              let url = line;
              if (line.startsWith("#")) {
                enabled = false;
                url = line.substring(1).trim();
              }
              if (url !== "") {
                const normalized = normalizeProxyUrl2(url);
                if (normalized && !urlSet.has(normalized)) {
                  urlSet.add(normalized);
                  tempProxyList.push({ url: normalized, enabled });
                } else if (normalized && urlSet.has(normalized)) {
                  duplicateCount++;
                } else if (!normalized) {
                  invalidCount++;
                }
              }
            });
            isMultiEditMode = false;
            multiEditMode.style.display = "none";
            singleAddMode.style.display = "block";
            saveMultiEditBtn.style.display = "none";
            toggleModeBtn.textContent = "📝 手动编辑";
            renderProxyList();
            const messages2 = [];
            if (duplicateCount > 0) messages2.push(`已去重 ${duplicateCount} 个重复项`);
            if (invalidCount > 0) messages2.push(`已忽略 ${invalidCount} 个无效项`);
            if (messages2.length > 0) {
              showNotification(`✅ 已保存并切换到列表编辑（${messages2.join("，")}）`, "success");
            } else {
              showNotification("✅ 已保存并切换到列表编辑", "success");
            }
          });
        }
        addProxyBtn.addEventListener("click", () => {
          const url = newProxyInput.value.trim();
          if (!url) {
            showNotification("❌ 请输入代理地址", "error");
            return;
          }
          const normalized = normalizeProxyUrl2(url);
          if (normalized === null) {
            showNotification(`❌ 代理地址格式错误: ${url}`, "error");
            return;
          }
          if (tempProxyList.some((p) => p.url === normalized)) {
            showNotification("❌ 该代理已存在", "error");
            return;
          }
          tempProxyList.push({ url: normalized, enabled: true });
          newProxyInput.value = "";
          renderProxyList();
          showNotification("✅ 代理已添加", "success");
        });
        newProxyInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") addProxyBtn.click();
        });
        const timeoutInput = modal.querySelector("#proxy-timeout");
        if (timeoutInput) {
          timeoutInput.addEventListener("change", () => {
            let value = parseInt(timeoutInput.value) || 1e4;
            if (value < 100) value = 100;
            if (value > 1e5) value = 1e5;
            timeoutInput.value = value;
            tempProxyTimeout = value;
          });
        }
        const checkAllBtn = modal.querySelector("#check-all-proxies");
        if (checkAllBtn) checkAllBtn.addEventListener("click", checkAllProxies);
        const enableAllBtn = modal.querySelector("#enable-all-proxies");
        if (enableAllBtn) enableAllBtn.addEventListener("click", enableAllProxies);
        const disableAllBtn = modal.querySelector("#disable-all-proxies");
        if (disableAllBtn) disableAllBtn.addEventListener("click", disableAllProxies);
        const disableFailedBtn = modal.querySelector("#disable-failed-proxies");
        if (disableFailedBtn) disableFailedBtn.addEventListener("click", disableFailedProxies);
        const deleteFailedBtn = modal.querySelector("#delete-failed-proxies");
        if (deleteFailedBtn) deleteFailedBtn.addEventListener("click", deleteFailedProxies);
      }
      renderPlayerList();
      updateView();
      modal.querySelector('[data-view="main-settings"]').addEventListener("click", () => {
        currentView = "main-settings";
        updateView();
      });
      const closeModal = () => modal.remove();
      modal.querySelector("#btn-close").addEventListener("click", closeModal);
      function saveSettings(shouldReload = false) {
        let hasChanges = false;
        if (getExternalPlayer2() !== currentDefaultPlayer) {
          setExternalPlayer2(currentDefaultPlayer);
          hasChanges = true;
        }
        const oldPlayersStr = JSON.stringify(getPlayers() || []);
        const newPlayersStr = JSON.stringify(tempPlayers);
        if (oldPlayersStr !== newPlayersStr) {
          setPlayers(tempPlayers);
          hasChanges = true;
        }
        const oldButtonSettingsStr = JSON.stringify(getButtonSettings() || {});
        const newButtonSettingsStr = JSON.stringify(tempButtonSettings);
        if (oldButtonSettingsStr !== newButtonSettingsStr) {
          setButtonSettings(tempButtonSettings);
          hasChanges = true;
        }
        const validatedProxyList = [];
        for (const proxy of tempProxyList) {
          const normalized = normalizeProxyUrl2(proxy.url);
          if (normalized === null) {
            showNotification(`❌ 代理地址格式错误: ${proxy.url}`, "error");
            return;
          }
          validatedProxyList.push({ url: normalized, enabled: proxy.enabled });
        }
        const oldListStr = JSON.stringify(getProxyList() || []);
        const newListStr = JSON.stringify(validatedProxyList);
        if (oldListStr !== newListStr) {
          setProxyList(validatedProxyList);
          hasChanges = true;
        }
        if (getProxyTimeout() !== tempProxyTimeout) {
          setProxyTimeout(tempProxyTimeout);
          hasChanges = true;
        }
        closeModal();
        if (hasChanges) {
          if (shouldReload) {
            showNotification("✅ 设置已保存，正在刷新页面...", "success");
            setTimeout(() => location.reload(), 800);
          } else {
            showNotification("✅ 设置已保存，正在应用更改...", "success");
            setTimeout(() => {
              refreshAllButtons?.();
              showNotification("✅ 设置已生效", "success");
            }, 500);
          }
        } else {
          showNotification("ℹ️ 没有修改任何设置", "info");
        }
      }
      modal.querySelector("#btn-save").addEventListener("click", () => saveSettings(false));
    };
  }
  function normalizeProxyUrl(url) {
    if (!url || url.trim() === "") return "";
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      if (!/^[a-z0-9.-]+$/i.test(hostname)) {
        console.warn(`[Iwara Player] 无效的代理域名（包含非法字符）: ${hostname}`);
        return null;
      }
      if (!hostname.includes(".")) {
        console.warn(`[Iwara Player] 无效的代理域名（缺少顶级域名）: ${hostname}`);
        return null;
      }
      const parts = hostname.split(".");
      if (parts.some((part) => part === "")) {
        console.warn(`[Iwara Player] 无效的代理域名格式: ${hostname}`);
        return null;
      }
      const tld = parts[parts.length - 1];
      if (tld.length < 2) {
        console.warn(`[Iwara Player] 无效的顶级域名: ${tld}`);
        return null;
      }
      const protocol = urlObj.protocol.toLowerCase();
      const lowercaseHostname = hostname.toLowerCase();
      const port = urlObj.port ? `:${urlObj.port}` : "";
      const pathname = urlObj.pathname;
      const search = urlObj.search;
      const hash = urlObj.hash;
      let normalizedUrl = `${protocol}//${lowercaseHostname}${port}${pathname}${search}${hash}`;
      if (!search && !hash && !normalizedUrl.endsWith("/")) {
        normalizedUrl += "/";
      }
      return normalizedUrl;
    } catch (e) {
      console.warn(`[Iwara Player] URL格式错误: ${url}`, e);
      return null;
    }
  }
  function getCurrentProxyPrefix() {
    const currentHostname = window.location.hostname;
    const isIwaraDomain = currentHostname.endsWith(".iwara.tv");
    if (isIwaraDomain) return "";
    const currentUrl = window.location.href;
    const match = currentUrl.match(/^(https?:\/\/[^\/]+)\//);
    if (match) {
      const pureProxy = match[1] + "/";
      console.log(
        `%c[Iwara Player] API 代理`,
        "color: #ffa500; font-weight: bold;",
        `
当前域名: ${currentHostname}`,
        `
检测到代理访问，API 请求将使用代理: ${pureProxy}`
      );
      return pureProxy;
    }
    console.warn(
      `%c[Iwara Player] API 代理`,
      "color: #ff6b6b; font-weight: bold;",
      `
当前域名: ${currentHostname}`,
      "\n无法检测代理前缀，API 请求可能失败"
    );
    return "";
  }
  function createProxyApi({ getProxyList }) {
    function pickProxyPrefix() {
      const currentHostname = window.location.hostname;
      const isIwaraDomain = currentHostname === "iwara.tv" || currentHostname === "www.iwara.tv" || currentHostname.endsWith(".iwara.tv");
      if (!isIwaraDomain) return getCurrentProxyPrefix() || "";
      const proxyList2 = (typeof getProxyList === "function" ? getProxyList() : []) || [];
      const enabledProxies = proxyList2.filter((p) => p?.enabled);
      if (enabledProxies.length === 0) return "";
      const randomIndex = Math.floor(Math.random() * enabledProxies.length);
      const selectedProxy = enabledProxies[randomIndex];
      return selectedProxy?.url || "";
    }
    function proxifyWithPrefix(prefix, url) {
      if (!prefix) return url;
      return prefix + url;
    }
    function getProxiedUrl(videoUrl) {
      const currentHostname = window.location.hostname;
      const isIwaraDomain = currentHostname === "iwara.tv" || currentHostname === "www.iwara.tv" || currentHostname.endsWith(".iwara.tv");
      if (!isIwaraDomain) {
        const currentProxy = getCurrentProxyPrefix();
        if (currentProxy) {
          const proxiedUrl2 = currentProxy + videoUrl;
          console.log(
            `%c[Iwara Player] 代理信息`,
            "color: #ffa500; font-weight: bold;",
            `
当前域名: ${currentHostname}`,
            "\n使用当前代理前缀:",
            "\n代理地址:",
            currentProxy,
            "\n代理后URL:",
            proxiedUrl2
          );
          return proxiedUrl2;
        }
        console.log(
          `%c[Iwara Player] 代理信息`,
          "color: #ffa500; font-weight: bold;",
          `
当前域名: ${currentHostname}`,
          "\n非 iwara.tv 域名且无法检测代理，返回原始URL"
        );
        return videoUrl;
      }
      const proxyList2 = (typeof getProxyList === "function" ? getProxyList() : []) || [];
      const enabledProxies = proxyList2.filter((p) => p?.enabled);
      if (enabledProxies.length === 0) return videoUrl;
      const randomIndex = Math.floor(Math.random() * enabledProxies.length);
      const selectedProxy = enabledProxies[randomIndex];
      const proxiedUrl = selectedProxy.url + videoUrl;
      console.log(
        `%c[Iwara Player] 代理信息`,
        "color: #ffa500; font-weight: bold;",
        `
当前域名: ${currentHostname}`,
        `
已选择代理: (${randomIndex + 1}/${enabledProxies.length})`,
        "\n代理地址:",
        selectedProxy.url,
        "\n代理后URL:",
        proxiedUrl
      );
      return proxiedUrl;
    }
    return {
      normalizeProxyUrl,
      getCurrentProxyPrefix,
      pickProxyPrefix,
      proxifyWithPrefix,
      getProxiedUrl
    };
  }
  const KEY_PROXY_LIST = "proxyList";
  const KEY_PROXY_TIMEOUT = "proxyTimeout";
  function loadProxyList() {
    const list = GM_getValue(KEY_PROXY_LIST, []);
    return Array.isArray(list) ? list : [];
  }
  function saveProxyList(list) {
    GM_setValue(KEY_PROXY_LIST, Array.isArray(list) ? list : []);
  }
  function loadProxyTimeout() {
    const timeout = GM_getValue(KEY_PROXY_TIMEOUT, 1e4);
    return typeof timeout === "number" && Number.isFinite(timeout) ? timeout : 1e4;
  }
  function saveProxyTimeout(timeoutMs) {
    const n = Number(timeoutMs);
    GM_setValue(KEY_PROXY_TIMEOUT, Number.isFinite(n) ? n : 1e4);
  }
  const defaultPlayers = [
    {
      name: "MPV",
      icon: "data:image/png;base64,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",
      description: "MPV + ush",
      type: "ush",
      appName: "MPV",
      args: ["${url}", "--force-media-title=${title}", "--ontop"]
    },
    {
      name: "PotPlayer",
      icon: "data:image/png;base64,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",
      description: "PotPlayer 标准协议",
      type: "protocol",
      protocol: "potplayer://${url}"
    },
    {
      name: "VLC",
      icon: "data:image/png;base64,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",
      description: "VLC 标准协议",
      type: "protocol",
      protocol: "vlc://${url}"
    }
  ];
  const KEY_CUSTOM_PLAYERS = "customPlayers";
  const KEY_EXTERNAL_PLAYER = "externalPlayer";
  const KEY_HAS_INITIALIZED_DEFAULTS = "hasInitializedDefaults";
  function ensureDefaultPlayersInitialized() {
    const hasInitialized = GM_getValue(KEY_HAS_INITIALIZED_DEFAULTS, false);
    let players2 = GM_getValue(KEY_CUSTOM_PLAYERS, []);
    if (!hasInitialized && (!Array.isArray(players2) || players2.length === 0)) {
      players2 = [...defaultPlayers];
      GM_setValue(KEY_CUSTOM_PLAYERS, players2);
      GM_setValue(KEY_HAS_INITIALIZED_DEFAULTS, true);
    }
    return Array.isArray(players2) ? players2 : [];
  }
  function loadPlayers() {
    const players2 = GM_getValue(KEY_CUSTOM_PLAYERS, []);
    return Array.isArray(players2) ? players2 : [];
  }
  function savePlayers(players2) {
    GM_setValue(KEY_CUSTOM_PLAYERS, Array.isArray(players2) ? players2 : []);
  }
  function getExternalPlayer() {
    return GM_getValue(KEY_EXTERNAL_PLAYER, "MPV");
  }
  function setExternalPlayer(name) {
    GM_setValue(KEY_EXTERNAL_PLAYER, name || "MPV");
  }
  function resetToDefaultPlayers({
    confirmFn = (msg) => confirm(msg),
    notify: notify2 = () => {
    },
    reloadFn = () => location.reload()
  } = {}) {
    const ok = confirmFn(
      "确定要恢复默认播放器列表吗？\n这将清除所有自定义播放器并恢复为 MPV、PotPlayer、VLC。"
    );
    if (!ok) return false;
    savePlayers([...defaultPlayers]);
    setExternalPlayer("MPV");
    notify2("✅ 已恢复默认播放器列表", "success");
    setTimeout(() => reloadFn(), 1500);
    return true;
  }
  const KEY_BUTTON_SETTINGS = "buttonSettings";
  const defaultButtonSettings = {
    detailPage: { copy: true, newTab: true, quality: true, play: true },
    listPage: { copy: true, newTab: true, quality: true, play: true }
  };
  function loadButtonSettings() {
    const settings = GM_getValue(KEY_BUTTON_SETTINGS, defaultButtonSettings);
    return settings || defaultButtonSettings;
  }
  function saveButtonSettings(settings) {
    GM_setValue(KEY_BUTTON_SETTINGS, settings || defaultButtonSettings);
  }
  /*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
  const Z_FIXED$1 = 4;
  const Z_BINARY = 0;
  const Z_TEXT = 1;
  const Z_UNKNOWN$1 = 2;
  function zero$1(buf) {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  const STORED_BLOCK = 0;
  const STATIC_TREES = 1;
  const DYN_TREES = 2;
  const MIN_MATCH$1 = 3;
  const MAX_MATCH$1 = 258;
  const LENGTH_CODES$1 = 29;
  const LITERALS$1 = 256;
  const L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
  const D_CODES$1 = 30;
  const BL_CODES$1 = 19;
  const HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
  const MAX_BITS$1 = 15;
  const Buf_size = 16;
  const MAX_BL_BITS = 7;
  const END_BLOCK = 256;
  const REP_3_6 = 16;
  const REPZ_3_10 = 17;
  const REPZ_11_138 = 18;
  const extra_lbits = (
    /* extra bits for each length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
  );
  const extra_dbits = (
    /* extra bits for each distance code */
    new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
  );
  const extra_blbits = (
    /* extra bits for each bit length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
  );
  const bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  const DIST_CODE_LEN = 512;
  const static_ltree = new Array((L_CODES$1 + 2) * 2);
  zero$1(static_ltree);
  const static_dtree = new Array(D_CODES$1 * 2);
  zero$1(static_dtree);
  const _dist_code = new Array(DIST_CODE_LEN);
  zero$1(_dist_code);
  const _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
  zero$1(_length_code);
  const base_length = new Array(LENGTH_CODES$1);
  zero$1(base_length);
  const base_dist = new Array(D_CODES$1);
  zero$1(base_dist);
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  let static_l_desc;
  let static_d_desc;
  let static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  const d_code = (dist) => {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  };
  const put_short = (s, w) => {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  };
  const send_bits = (s, value, length) => {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  };
  const send_code = (s, c, tree) => {
    send_bits(
      s,
      tree[c * 2],
      tree[c * 2 + 1]
      /*.Len*/
    );
  };
  const bi_reverse = (code, len) => {
    let res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  };
  const bi_flush = (s) => {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  };
  const gen_bitlen = (s, desc) => {
    const tree = desc.dyn_tree;
    const max_code = desc.max_code;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const extra = desc.stat_desc.extra_bits;
    const base = desc.stat_desc.extra_base;
    const max_length = desc.stat_desc.max_length;
    let h;
    let n, m;
    let bits;
    let xbits;
    let f;
    let overflow = 0;
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) {
        continue;
      }
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base) {
        xbits = extra[n - base];
      }
      f = tree[n * 2];
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1] + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  };
  const gen_codes = (tree, max_code, bl_count) => {
    const next_code = new Array(MAX_BITS$1 + 1);
    let code = 0;
    let bits;
    let n;
    for (bits = 1; bits <= MAX_BITS$1; bits++) {
      code = code + bl_count[bits - 1] << 1;
      next_code[bits] = code;
    }
    for (n = 0; n <= max_code; n++) {
      let len = tree[n * 2 + 1];
      if (len === 0) {
        continue;
      }
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  };
  const tr_static_init = () => {
    let n;
    let bits;
    let length;
    let code;
    let dist;
    const bl_count = new Array(MAX_BITS$1 + 1);
    length = 0;
    for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
      base_length[code] = length;
      for (n = 0; n < 1 << extra_lbits[code]; n++) {
        _length_code[length++] = code;
      }
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0; code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0; n < 1 << extra_dbits[code]; n++) {
        _dist_code[dist++] = code;
      }
    }
    dist >>= 7;
    for (; code < D_CODES$1; code++) {
      base_dist[code] = dist << 7;
      for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES$1 + 1, bl_count);
    for (n = 0; n < D_CODES$1; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
  };
  const init_block = (s) => {
    let n;
    for (n = 0; n < L_CODES$1; n++) {
      s.dyn_ltree[n * 2] = 0;
    }
    for (n = 0; n < D_CODES$1; n++) {
      s.dyn_dtree[n * 2] = 0;
    }
    for (n = 0; n < BL_CODES$1; n++) {
      s.bl_tree[n * 2] = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.sym_next = s.matches = 0;
  };
  const bi_windup = (s) => {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  };
  const smaller = (tree, n, m, depth) => {
    const _n2 = n * 2;
    const _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  };
  const pqdownheap = (s, tree, k) => {
    const v = s.heap[k];
    let j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  };
  const compress_block = (s, ltree, dtree) => {
    let dist;
    let lc;
    let sx = 0;
    let code;
    let extra;
    if (s.sym_next !== 0) {
      do {
        dist = s.pending_buf[s.sym_buf + sx++] & 255;
        dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
        lc = s.pending_buf[s.sym_buf + sx++];
        if (dist === 0) {
          send_code(s, lc, ltree);
        } else {
          code = _length_code[lc];
          send_code(s, code + LITERALS$1 + 1, ltree);
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra);
          }
          dist--;
          code = d_code(dist);
          send_code(s, code, dtree);
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra);
          }
        }
      } while (sx < s.sym_next);
    }
    send_code(s, END_BLOCK, ltree);
  };
  const build_tree = (s, desc) => {
    const tree = desc.dyn_tree;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const elems = desc.stat_desc.elems;
    let n, m;
    let max_code = -1;
    let node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE$1;
    for (n = 0; n < elems; n++) {
      if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] = 0;
      }
    }
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1];
      }
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1; n >= 1; n--) {
      pqdownheap(s, tree, n);
    }
    node = elems;
    do {
      n = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[
        1
        /*SMALLEST*/
      ] = s.heap[s.heap_len--];
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
      m = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[
        1
        /*SMALLEST*/
      ] = node++;
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[
      1
      /*SMALLEST*/
    ];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  };
  const scan_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2]++;
        }
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]++;
      } else {
        s.bl_tree[REPZ_11_138 * 2]++;
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  const send_tree = (s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  };
  const build_bl_tree = (s) => {
    let max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
        break;
      }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  };
  const send_all_trees = (s, lcodes, dcodes, blcodes) => {
    let rank2;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank2 = 0; rank2 < blcodes; rank2++) {
      send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
    }
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  };
  const detect_data_type = (s) => {
    let block_mask = 4093624447;
    let n;
    for (n = 0; n <= 31; n++, block_mask >>>= 1) {
      if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
        return Z_BINARY;
      }
    }
    if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
      return Z_TEXT;
    }
    for (n = 32; n < LITERALS$1; n++) {
      if (s.dyn_ltree[n * 2] !== 0) {
        return Z_TEXT;
      }
    }
    return Z_BINARY;
  };
  let static_init_done = false;
  const _tr_init$1 = (s) => {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  };
  const _tr_stored_block$1 = (s, buf, stored_len, last) => {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    bi_windup(s);
    put_short(s, stored_len);
    put_short(s, ~stored_len);
    if (stored_len) {
      s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
    }
    s.pending += stored_len;
  };
  const _tr_align$1 = (s) => {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  };
  const _tr_flush_block$1 = (s, buf, stored_len, last) => {
    let opt_lenb, static_lenb;
    let max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN$1) {
        s.strm.data_type = detect_data_type(s);
      }
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      opt_lenb = static_lenb = stored_len + 5;
    }
    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      _tr_stored_block$1(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) {
      bi_windup(s);
    }
  };
  const _tr_tally$1 = (s, dist, lc) => {
    s.pending_buf[s.sym_buf + s.sym_next++] = dist;
    s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
    s.pending_buf[s.sym_buf + s.sym_next++] = lc;
    if (dist === 0) {
      s.dyn_ltree[lc * 2]++;
    } else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.sym_next === s.sym_end;
  };
  var _tr_init_1 = _tr_init$1;
  var _tr_stored_block_1 = _tr_stored_block$1;
  var _tr_flush_block_1 = _tr_flush_block$1;
  var _tr_tally_1 = _tr_tally$1;
  var _tr_align_1 = _tr_align$1;
  var trees = {
    _tr_init: _tr_init_1,
    _tr_stored_block: _tr_stored_block_1,
    _tr_flush_block: _tr_flush_block_1,
    _tr_tally: _tr_tally_1,
    _tr_align: _tr_align_1
  };
  const adler32 = (adler, buf, len, pos) => {
    let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2e3 ? 2e3 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  };
  var adler32_1 = adler32;
  const makeTable = () => {
    let c, table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  };
  const crcTable = new Uint32Array(makeTable());
  const crc32 = (crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;
    crc ^= -1;
    for (let i = pos; i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    }
    return crc ^ -1;
  };
  var crc32_1 = crc32;
  var messages = {
    2: "need dictionary",
    /* Z_NEED_DICT       2  */
    1: "stream end",
    /* Z_STREAM_END      1  */
    0: "",
    /* Z_OK              0  */
    "-1": "file error",
    /* Z_ERRNO         (-1) */
    "-2": "stream error",
    /* Z_STREAM_ERROR  (-2) */
    "-3": "data error",
    /* Z_DATA_ERROR    (-3) */
    "-4": "insufficient memory",
    /* Z_MEM_ERROR     (-4) */
    "-5": "buffer error",
    /* Z_BUF_ERROR     (-5) */
    "-6": "incompatible version"
    /* Z_VERSION_ERROR (-6) */
  };
  var constants$2 = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  };
  const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;
  const {
    Z_NO_FLUSH: Z_NO_FLUSH$2,
    Z_PARTIAL_FLUSH,
    Z_FULL_FLUSH: Z_FULL_FLUSH$1,
    Z_FINISH: Z_FINISH$3,
    Z_BLOCK: Z_BLOCK$1,
    Z_OK: Z_OK$3,
    Z_STREAM_END: Z_STREAM_END$3,
    Z_STREAM_ERROR: Z_STREAM_ERROR$2,
    Z_DATA_ERROR: Z_DATA_ERROR$2,
    Z_BUF_ERROR: Z_BUF_ERROR$1,
    Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
    Z_FILTERED,
    Z_HUFFMAN_ONLY,
    Z_RLE,
    Z_FIXED,
    Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
    Z_UNKNOWN,
    Z_DEFLATED: Z_DEFLATED$2
  } = constants$2;
  const MAX_MEM_LEVEL = 9;
  const MAX_WBITS$1 = 15;
  const DEF_MEM_LEVEL = 8;
  const LENGTH_CODES = 29;
  const LITERALS = 256;
  const L_CODES = LITERALS + 1 + LENGTH_CODES;
  const D_CODES = 30;
  const BL_CODES = 19;
  const HEAP_SIZE = 2 * L_CODES + 1;
  const MAX_BITS = 15;
  const MIN_MATCH = 3;
  const MAX_MATCH = 258;
  const MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  const PRESET_DICT = 32;
  const INIT_STATE = 42;
  const GZIP_STATE = 57;
  const EXTRA_STATE = 69;
  const NAME_STATE = 73;
  const COMMENT_STATE = 91;
  const HCRC_STATE = 103;
  const BUSY_STATE = 113;
  const FINISH_STATE = 666;
  const BS_NEED_MORE = 1;
  const BS_BLOCK_DONE = 2;
  const BS_FINISH_STARTED = 3;
  const BS_FINISH_DONE = 4;
  const OS_CODE = 3;
  const err = (strm, errorCode) => {
    strm.msg = messages[errorCode];
    return errorCode;
  };
  const rank = (f) => {
    return f * 2 - (f > 4 ? 9 : 0);
  };
  const zero = (buf) => {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  };
  const slide_hash = (s) => {
    let n, m;
    let p;
    let wsize = s.w_size;
    n = s.hash_size;
    p = n;
    do {
      m = s.head[--p];
      s.head[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
    n = wsize;
    p = n;
    do {
      m = s.prev[--p];
      s.prev[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
  };
  let HASH_ZLIB = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
  let HASH = HASH_ZLIB;
  const flush_pending = (strm) => {
    const s = strm.state;
    let len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  };
  const flush_block_only = (s, last) => {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  };
  const put_byte = (s, b) => {
    s.pending_buf[s.pending++] = b;
  };
  const putShortMSB = (s, b) => {
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
  };
  const read_buf = (strm, buf, start, size) => {
    let len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32_1(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = crc32_1(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  };
  const longest_match = (s, cur_match) => {
    let chain_length = s.max_chain_length;
    let scan = s.strstart;
    let match;
    let len;
    let best_len = s.prev_length;
    let nice_match = s.nice_match;
    const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    const _win = s.window;
    const wmask = s.w_mask;
    const prev = s.prev;
    const strend = s.strstart + MAX_MATCH;
    let scan_end1 = _win[scan + best_len - 1];
    let scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }
      scan += 2;
      match++;
      do {
      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  };
  const fill_window = (s) => {
    const _w_size = s.w_size;
    let n, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
        slide_hash(s);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
        while (s.insert) {
          s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) {
            break;
          }
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  };
  const deflate_stored = (s, flush) => {
    let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
    let len, left, have, last = 0;
    let used = s.strm.avail_in;
    do {
      len = 65535;
      have = s.bi_valid + 42 >> 3;
      if (s.strm.avail_out < have) {
        break;
      }
      have = s.strm.avail_out - have;
      left = s.strstart - s.block_start;
      if (len > left + s.strm.avail_in) {
        len = left + s.strm.avail_in;
      }
      if (len > have) {
        len = have;
      }
      if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
        break;
      }
      last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
      _tr_stored_block(s, 0, 0, last);
      s.pending_buf[s.pending - 4] = len;
      s.pending_buf[s.pending - 3] = len >> 8;
      s.pending_buf[s.pending - 2] = ~len;
      s.pending_buf[s.pending - 1] = ~len >> 8;
      flush_pending(s.strm);
      if (left) {
        if (left > len) {
          left = len;
        }
        s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
        s.strm.next_out += left;
        s.strm.avail_out -= left;
        s.strm.total_out += left;
        s.block_start += left;
        len -= left;
      }
      if (len) {
        read_buf(s.strm, s.strm.output, s.strm.next_out, len);
        s.strm.next_out += len;
        s.strm.avail_out -= len;
        s.strm.total_out += len;
      }
    } while (last === 0);
    used -= s.strm.avail_in;
    if (used) {
      if (used >= s.w_size) {
        s.matches = 2;
        s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
        s.strstart = s.w_size;
        s.insert = s.strstart;
      } else {
        if (s.window_size - s.strstart <= used) {
          s.strstart -= s.w_size;
          s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
          if (s.matches < 2) {
            s.matches++;
          }
          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
        }
        s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
        s.strstart += used;
        s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
      }
      s.block_start = s.strstart;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    if (last) {
      return BS_FINISH_DONE;
    }
    if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) {
      return BS_BLOCK_DONE;
    }
    have = s.window_size - s.strstart;
    if (s.strm.avail_in > have && s.block_start >= s.w_size) {
      s.block_start -= s.w_size;
      s.strstart -= s.w_size;
      s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
      if (s.matches < 2) {
        s.matches++;
      }
      have += s.w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
    }
    if (have > s.strm.avail_in) {
      have = s.strm.avail_in;
    }
    if (have) {
      read_buf(s.strm, s.window, s.strstart, have);
      s.strstart += have;
      s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    have = s.bi_valid + 42 >> 3;
    have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
    min_block = have > s.w_size ? s.w_size : have;
    left = s.strstart - s.block_start;
    if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
      len = left > have ? have : left;
      last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
      _tr_stored_block(s, s.block_start, len, last);
      s.block_start += len;
      flush_pending(s.strm);
    }
    return last ? BS_FINISH_STARTED : BS_NEED_MORE;
  };
  const deflate_fast = (s, flush) => {
    let hash_head;
    let bflush;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
          s.match_length--;
          do {
            s.strstart++;
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
        }
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  const deflate_slow = (s, flush) => {
    let hash_head;
    let bflush;
    let max_insert;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
          s.match_length = MIN_MATCH - 1;
        }
      }
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      } else if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          flush_block_only(s, false);
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  const deflate_rle = (s, flush) => {
    let bflush;
    let prev;
    let scan, strend;
    const _win = s.window;
    for (; ; ) {
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do {
          } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  const deflate_huff = (s, flush) => {
    let bflush;
    for (; ; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          break;
        }
      }
      s.match_length = 0;
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  };
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  const configuration_table = [
    /*      good lazy nice chain */
    new Config(0, 0, 0, 0, deflate_stored),
    /* 0 store only */
    new Config(4, 4, 8, 4, deflate_fast),
    /* 1 max speed, no lazy matches */
    new Config(4, 5, 16, 8, deflate_fast),
    /* 2 */
    new Config(4, 6, 32, 32, deflate_fast),
    /* 3 */
    new Config(4, 4, 16, 16, deflate_slow),
    /* 4 lazy matches */
    new Config(8, 16, 32, 32, deflate_slow),
    /* 5 */
    new Config(8, 16, 128, 128, deflate_slow),
    /* 6 */
    new Config(8, 32, 128, 256, deflate_slow),
    /* 7 */
    new Config(32, 128, 258, 1024, deflate_slow),
    /* 8 */
    new Config(32, 258, 258, 4096, deflate_slow)
    /* 9 max compression */
  ];
  const lm_init = (s) => {
    s.window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  };
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED$2;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
    this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
    this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new Uint16Array(MAX_BITS + 1);
    this.heap = new Uint16Array(2 * L_CODES + 1);
    zero(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new Uint16Array(2 * L_CODES + 1);
    zero(this.depth);
    this.sym_buf = 0;
    this.lit_bufsize = 0;
    this.sym_next = 0;
    this.sym_end = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  const deflateStateCheck = (strm) => {
    if (!strm) {
      return 1;
    }
    const s = strm.state;
    if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
    s.status !== GZIP_STATE && //#endif
    s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
      return 1;
    }
    return 0;
  };
  const deflateResetKeep = (strm) => {
    if (deflateStateCheck(strm)) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN;
    const s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
    }
    s.status = //#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE : (
      //#endif
      s.wrap ? INIT_STATE : BUSY_STATE
    );
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = -2;
    _tr_init(s);
    return Z_OK$3;
  };
  const deflateReset = (strm) => {
    const ret = deflateResetKeep(strm);
    if (ret === Z_OK$3) {
      lm_init(strm.state);
    }
    return ret;
  };
  const deflateSetHeader = (strm, head) => {
    if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
      return Z_STREAM_ERROR$2;
    }
    strm.state.gzhead = head;
    return Z_OK$3;
  };
  const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {
    if (!strm) {
      return Z_STREAM_ERROR$2;
    }
    let wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION$1) {
      level = 6;
    }
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    const s = new DeflateState();
    strm.state = s;
    s.strm = strm;
    s.status = INIT_STATE;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Uint8Array(s.pending_buf_size);
    s.sym_buf = s.lit_bufsize;
    s.sym_end = (s.lit_bufsize - 1) * 3;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  };
  const deflateInit = (strm, level) => {
    return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
  };
  const deflate$2 = (strm, flush) => {
    if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
    }
    const old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === INIT_STATE && s.wrap === 0) {
      s.status = BUSY_STATE;
    }
    if (s.status === INIT_STATE) {
      let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
      let level_flags = -1;
      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= level_flags << 6;
      if (s.strstart !== 0) {
        header |= PRESET_DICT;
      }
      header += 31 - header % 31;
      putShortMSB(s, header);
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      strm.adler = 1;
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (s.status === GZIP_STATE) {
      strm.adler = 0;
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      } else {
        put_byte(
          s,
          (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 255);
        put_byte(s, s.gzhead.time >> 8 & 255);
        put_byte(s, s.gzhead.time >> 16 & 255);
        put_byte(s, s.gzhead.time >> 24 & 255);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 255);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 255);
          put_byte(s, s.gzhead.extra.length >> 8 & 255);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        let beg = s.pending;
        let left = (s.gzhead.extra.length & 65535) - s.gzindex;
        while (s.pending + left > s.pending_buf_size) {
          let copy = s.pending_buf_size - s.pending;
          s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
          s.pending = s.pending_buf_size;
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex += copy;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
          left -= copy;
        }
        let gzhead_extra = new Uint8Array(s.gzhead.extra);
        s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
        s.pending += left;
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = NAME_STATE;
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = COMMENT_STATE;
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
      }
      s.status = HCRC_STATE;
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
        }
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        strm.adler = 0;
      }
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
      let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
        }
        return Z_OK$3;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          _tr_align(s);
        } else if (flush !== Z_BLOCK$1) {
          _tr_stored_block(s, 0, 0, false);
          if (flush === Z_FULL_FLUSH$1) {
            zero(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
    }
    if (flush !== Z_FINISH$3) {
      return Z_OK$3;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END$3;
    }
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
  };
  const deflateEnd = (strm) => {
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const status = strm.state.status;
    strm.state = null;
    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
  };
  const deflateSetDictionary = (strm, dictionary) => {
    let dictLength = dictionary.length;
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    const wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
      return Z_STREAM_ERROR$2;
    }
    if (wrap === 1) {
      strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
    }
    s.wrap = 0;
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        zero(s.head);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      let tmpDict = new Uint8Array(s.w_size);
      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    const avail = strm.avail_in;
    const next = strm.next_in;
    const input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      let str = s.strstart;
      let n = s.lookahead - (MIN_MATCH - 1);
      do {
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK$3;
  };
  var deflateInit_1 = deflateInit;
  var deflateInit2_1 = deflateInit2;
  var deflateReset_1 = deflateReset;
  var deflateResetKeep_1 = deflateResetKeep;
  var deflateSetHeader_1 = deflateSetHeader;
  var deflate_2$1 = deflate$2;
  var deflateEnd_1 = deflateEnd;
  var deflateSetDictionary_1 = deflateSetDictionary;
  var deflateInfo = "pako deflate (from Nodeca project)";
  var deflate_1$2 = {
    deflateInit: deflateInit_1,
    deflateInit2: deflateInit2_1,
    deflateReset: deflateReset_1,
    deflateResetKeep: deflateResetKeep_1,
    deflateSetHeader: deflateSetHeader_1,
    deflate: deflate_2$1,
    deflateEnd: deflateEnd_1,
    deflateSetDictionary: deflateSetDictionary_1,
    deflateInfo
  };
  const _has = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
  var assign = function(obj) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      const source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== "object") {
        throw new TypeError(source + "must be non-object");
      }
      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  };
  var flattenChunks = (chunks) => {
    let len = 0;
    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }
    const result = new Uint8Array(len);
    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  };
  var common = {
    assign,
    flattenChunks
  };
  let STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }
  const _utf8len = new Uint8Array(256);
  for (let q = 0; q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  _utf8len[254] = _utf8len[254] = 1;
  var string2buf = (str) => {
    if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
      return new TextEncoder().encode(str);
    }
    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    buf = new Uint8Array(buf_len);
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i++] = c;
      } else if (c < 2048) {
        buf[i++] = 192 | c >>> 6;
        buf[i++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i++] = 224 | c >>> 12;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      } else {
        buf[i++] = 240 | c >>> 18;
        buf[i++] = 128 | c >>> 12 & 63;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      }
    }
    return buf;
  };
  const buf2binstring = (buf, len) => {
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }
    let result = "";
    for (let i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  };
  var buf2string = (buf, max) => {
    const len = max || buf.length;
    if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
      return new TextDecoder().decode(buf.subarray(0, max));
    }
    let i, out;
    const utf16buf = new Array(len * 2);
    for (out = 0, i = 0; i < len; ) {
      let c = buf[i++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      let c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    return buf2binstring(utf16buf, out);
  };
  var utf8border = (buf, max) => {
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  };
  var strings = {
    string2buf,
    buf2string,
    utf8border
  };
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  var zstream = ZStream;
  const toString$1 = Object.prototype.toString;
  const {
    Z_NO_FLUSH: Z_NO_FLUSH$1,
    Z_SYNC_FLUSH,
    Z_FULL_FLUSH,
    Z_FINISH: Z_FINISH$2,
    Z_OK: Z_OK$2,
    Z_STREAM_END: Z_STREAM_END$2,
    Z_DEFAULT_COMPRESSION,
    Z_DEFAULT_STRATEGY,
    Z_DEFLATED: Z_DEFLATED$1
  } = constants$2;
  function Deflate$1(options) {
    this.options = common.assign({
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED$1,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY
    }, options || {});
    let opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = deflate_1$2.deflateInit2(
      this.strm,
      opt.level,
      opt.method,
      opt.windowBits,
      opt.memLevel,
      opt.strategy
    );
    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }
    if (opt.header) {
      deflate_1$2.deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      let dict;
      if (typeof opt.dictionary === "string") {
        dict = strings.string2buf(opt.dictionary);
      } else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = deflate_1$2.deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK$2) {
        throw new Error(messages[status]);
      }
      this._dict_set = true;
    }
  }
  Deflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    let status, _flush_mode;
    if (this.ended) {
      return false;
    }
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;
    if (typeof data === "string") {
      strm.input = strings.string2buf(data);
    } else if (toString$1.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      status = deflate_1$2.deflate(strm, _flush_mode);
      if (status === Z_STREAM_END$2) {
        if (strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
        }
        status = deflate_1$2.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK$2;
      }
      if (strm.avail_out === 0) {
        this.onData(strm.output);
        continue;
      }
      if (_flush_mode > 0 && strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      if (strm.avail_in === 0) break;
    }
    return true;
  };
  Deflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Deflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK$2) {
      this.result = common.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function deflate$1(input, options) {
    const deflator = new Deflate$1(options);
    deflator.push(input, true);
    if (deflator.err) {
      throw deflator.msg || messages[deflator.err];
    }
    return deflator.result;
  }
  function deflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return deflate$1(input, options);
  }
  function gzip$1(input, options) {
    options = options || {};
    options.gzip = true;
    return deflate$1(input, options);
  }
  var Deflate_1$1 = Deflate$1;
  var deflate_2 = deflate$1;
  var deflateRaw_1$1 = deflateRaw$1;
  var gzip_1$1 = gzip$1;
  var deflate_1$1 = {
    Deflate: Deflate_1$1,
    deflate: deflate_2,
    deflateRaw: deflateRaw_1$1,
    gzip: gzip_1$1
  };
  const BAD$1 = 16209;
  const TYPE$1 = 16191;
  var inffast = function inflate_fast(strm, start) {
    let _in;
    let last;
    let _out;
    let beg;
    let end;
    let dmax;
    let wsize;
    let whave;
    let wnext;
    let s_window;
    let hold;
    let bits;
    let lcode;
    let dcode;
    let lmask;
    let dmask;
    let here;
    let op;
    let len;
    let dist;
    let from;
    let from_source;
    let input, output;
    const state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = lcode[hold & lmask];
        dolen:
          for (; ; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op === 0) {
              output[_out++] = here & 65535;
            } else if (op & 16) {
              len = here & 65535;
              op &= 15;
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & (1 << op) - 1;
                hold >>>= op;
                bits -= op;
              }
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];
              dodist:
                for (; ; ) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = here >>> 16 & 255;
                  if (op & 16) {
                    dist = here & 65535;
                    op &= 15;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                    }
                    dist += hold & (1 << op) - 1;
                    if (dist > dmax) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD$1;
                      break top;
                    }
                    hold >>>= op;
                    bits -= op;
                    op = _out - beg;
                    if (dist > op) {
                      op = dist - op;
                      if (op > whave) {
                        if (state.sane) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD$1;
                          break top;
                        }
                      }
                      from = 0;
                      from_source = s_window;
                      if (wnext === 0) {
                        from += wsize - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      } else if (wnext < op) {
                        from += wsize + wnext - op;
                        op -= wnext;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = 0;
                          if (wnext < len) {
                            op = wnext;
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                      } else {
                        from += wnext - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                      while (len > 2) {
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        len -= 3;
                      }
                      if (len) {
                        output[_out++] = from_source[from++];
                        if (len > 1) {
                          output[_out++] = from_source[from++];
                        }
                      }
                    } else {
                      from = _out - dist;
                      do {
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        len -= 3;
                      } while (len > 2);
                      if (len) {
                        output[_out++] = output[from++];
                        if (len > 1) {
                          output[_out++] = output[from++];
                        }
                      }
                    }
                  } else if ((op & 64) === 0) {
                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                    continue dodist;
                  } else {
                    strm.msg = "invalid distance code";
                    state.mode = BAD$1;
                    break top;
                  }
                  break;
                }
            } else if ((op & 64) === 0) {
              here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dolen;
            } else if (op & 32) {
              state.mode = TYPE$1;
              break top;
            } else {
              strm.msg = "invalid literal/length code";
              state.mode = BAD$1;
              break top;
            }
            break;
          }
      } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  };
  const MAXBITS = 15;
  const ENOUGH_LENS$1 = 852;
  const ENOUGH_DISTS$1 = 592;
  const CODES$1 = 0;
  const LENS$1 = 1;
  const DISTS$1 = 2;
  const lbase = new Uint16Array([
    /* Length codes 257..285 base */
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ]);
  const lext = new Uint8Array([
    /* Length codes 257..285 extra */
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ]);
  const dbase = new Uint16Array([
    /* Distance codes 0..29 base */
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ]);
  const dext = new Uint8Array([
    /* Distance codes 0..29 extra */
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ]);
  const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
    const bits = opts.bits;
    let len = 0;
    let sym = 0;
    let min = 0, max = 0;
    let root = 0;
    let curr = 0;
    let drop = 0;
    let left = 0;
    let used = 0;
    let huff = 0;
    let incr;
    let fill;
    let low;
    let mask;
    let next;
    let base = null;
    let match;
    const count = new Uint16Array(MAXBITS + 1);
    const offs = new Uint16Array(MAXBITS + 1);
    let extra = null;
    let here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type === CODES$1 || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type === CODES$1) {
      base = extra = work;
      match = 20;
    } else if (type === LENS$1) {
      base = lbase;
      extra = lext;
      match = 257;
    } else {
      base = dbase;
      extra = dext;
      match = 0;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
      return 1;
    }
    for (; ; ) {
      here_bits = len - drop;
      if (work[sym] + 1 < match) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] >= match) {
        here_op = extra[work[sym] - match];
        here_val = base[work[sym] - match];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  };
  var inftrees = inflate_table;
  const CODES = 0;
  const LENS = 1;
  const DISTS = 2;
  const {
    Z_FINISH: Z_FINISH$1,
    Z_BLOCK,
    Z_TREES,
    Z_OK: Z_OK$1,
    Z_STREAM_END: Z_STREAM_END$1,
    Z_NEED_DICT: Z_NEED_DICT$1,
    Z_STREAM_ERROR: Z_STREAM_ERROR$1,
    Z_DATA_ERROR: Z_DATA_ERROR$1,
    Z_MEM_ERROR: Z_MEM_ERROR$1,
    Z_BUF_ERROR,
    Z_DEFLATED
  } = constants$2;
  const HEAD = 16180;
  const FLAGS = 16181;
  const TIME = 16182;
  const OS = 16183;
  const EXLEN = 16184;
  const EXTRA = 16185;
  const NAME = 16186;
  const COMMENT = 16187;
  const HCRC = 16188;
  const DICTID = 16189;
  const DICT = 16190;
  const TYPE = 16191;
  const TYPEDO = 16192;
  const STORED = 16193;
  const COPY_ = 16194;
  const COPY = 16195;
  const TABLE = 16196;
  const LENLENS = 16197;
  const CODELENS = 16198;
  const LEN_ = 16199;
  const LEN = 16200;
  const LENEXT = 16201;
  const DIST = 16202;
  const DISTEXT = 16203;
  const MATCH = 16204;
  const LIT = 16205;
  const CHECK = 16206;
  const LENGTH = 16207;
  const DONE = 16208;
  const BAD = 16209;
  const MEM = 16210;
  const SYNC = 16211;
  const ENOUGH_LENS = 852;
  const ENOUGH_DISTS = 592;
  const MAX_WBITS = 15;
  const DEF_WBITS = MAX_WBITS;
  const zswap32 = (q) => {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  };
  function InflateState() {
    this.strm = null;
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new Uint16Array(320);
    this.work = new Uint16Array(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  const inflateStateCheck = (strm) => {
    if (!strm) {
      return 1;
    }
    const state = strm.state;
    if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
      return 1;
    }
    return 0;
  };
  const inflateResetKeep = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = "";
    if (state.wrap) {
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.flags = -1;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    return Z_OK$1;
  };
  const inflateReset = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  };
  const inflateReset2 = (strm, windowBits) => {
    let wrap;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 5;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  };
  const inflateInit2 = (strm, windowBits) => {
    if (!strm) {
      return Z_STREAM_ERROR$1;
    }
    const state = new InflateState();
    strm.state = state;
    state.strm = strm;
    state.window = null;
    state.mode = HEAD;
    const ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$1) {
      strm.state = null;
    }
    return ret;
  };
  const inflateInit = (strm) => {
    return inflateInit2(strm, DEF_WBITS);
  };
  let virgin = true;
  let lenfix, distfix;
  const fixedtables = (state) => {
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);
      let sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  };
  const updatewindow = (strm, src, end, copy) => {
    let dist;
    const state = strm.state;
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new Uint8Array(state.wsize);
    }
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  };
  const inflate$2 = (strm, flush) => {
    let state;
    let input, output;
    let next;
    let put;
    let have, left;
    let hold;
    let bits;
    let _in, _out;
    let copy;
    let from;
    let from_source;
    let here = 0;
    let here_bits, here_op, here_val;
    let last_bits, last_op, last_val;
    let len;
    let ret;
    const hbuf = new Uint8Array(4);
    let opts;
    let n;
    const order = (
      /* permutation of code lengths */
      new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
    );
    if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.mode === TYPE) {
      state.mode = TYPEDO;
    }
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = Z_OK$1;
    inf_leave:
      for (; ; ) {
        switch (state.mode) {
          case HEAD:
            if (state.wrap === 0) {
              state.mode = TYPEDO;
              break;
            }
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 2 && hold === 35615) {
              if (state.wbits === 0) {
                state.wbits = 15;
              }
              state.check = 0;
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
              hold = 0;
              bits = 0;
              state.mode = FLAGS;
              break;
            }
            if (state.head) {
              state.head.done = false;
            }
            if (!(state.wrap & 1) || /* check if zlib header allowed */
            (((hold & 255) << 8) + (hold >> 8)) % 31) {
              strm.msg = "incorrect header check";
              state.mode = BAD;
              break;
            }
            if ((hold & 15) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            hold >>>= 4;
            bits -= 4;
            len = (hold & 15) + 8;
            if (state.wbits === 0) {
              state.wbits = len;
            }
            if (len > 15 || len > state.wbits) {
              strm.msg = "invalid window size";
              state.mode = BAD;
              break;
            }
            state.dmax = 1 << state.wbits;
            state.flags = 0;
            strm.adler = state.check = 1;
            state.mode = hold & 512 ? DICTID : TYPE;
            hold = 0;
            bits = 0;
            break;
          case FLAGS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.flags = hold;
            if ((state.flags & 255) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            if (state.flags & 57344) {
              strm.msg = "unknown header flags set";
              state.mode = BAD;
              break;
            }
            if (state.head) {
              state.head.text = hold >> 8 & 1;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = TIME;
          /* falls through */
          case TIME:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.time = hold;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              hbuf[2] = hold >>> 16 & 255;
              hbuf[3] = hold >>> 24 & 255;
              state.check = crc32_1(state.check, hbuf, 4, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = OS;
          /* falls through */
          case OS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.xflags = hold & 255;
              state.head.os = hold >> 8;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = EXLEN;
          /* falls through */
          case EXLEN:
            if (state.flags & 1024) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length = hold;
              if (state.head) {
                state.head.extra_len = hold;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_1(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
            } else if (state.head) {
              state.head.extra = null;
            }
            state.mode = EXTRA;
          /* falls through */
          case EXTRA:
            if (state.flags & 1024) {
              copy = state.length;
              if (copy > have) {
                copy = have;
              }
              if (copy) {
                if (state.head) {
                  len = state.head.extra_len - state.length;
                  if (!state.head.extra) {
                    state.head.extra = new Uint8Array(state.head.extra_len);
                  }
                  state.head.extra.set(
                    input.subarray(
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      next + copy
                    ),
                    /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                    len
                  );
                }
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32_1(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                state.length -= copy;
              }
              if (state.length) {
                break inf_leave;
              }
            }
            state.length = 0;
            state.mode = NAME;
          /* falls through */
          case NAME:
            if (state.flags & 2048) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.name += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.name = null;
            }
            state.length = 0;
            state.mode = COMMENT;
          /* falls through */
          case COMMENT:
            if (state.flags & 4096) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.comment += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.comment = null;
            }
            state.mode = HCRC;
          /* falls through */
          case HCRC:
            if (state.flags & 512) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 4 && hold !== (state.check & 65535)) {
                strm.msg = "header crc mismatch";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            if (state.head) {
              state.head.hcrc = state.flags >> 9 & 1;
              state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = TYPE;
            break;
          case DICTID:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            strm.adler = state.check = zswap32(hold);
            hold = 0;
            bits = 0;
            state.mode = DICT;
          /* falls through */
          case DICT:
            if (state.havedict === 0) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              return Z_NEED_DICT$1;
            }
            strm.adler = state.check = 1;
            state.mode = TYPE;
          /* falls through */
          case TYPE:
            if (flush === Z_BLOCK || flush === Z_TREES) {
              break inf_leave;
            }
          /* falls through */
          case TYPEDO:
            if (state.last) {
              hold >>>= bits & 7;
              bits -= bits & 7;
              state.mode = CHECK;
              break;
            }
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.last = hold & 1;
            hold >>>= 1;
            bits -= 1;
            switch (hold & 3) {
              case 0:
                state.mode = STORED;
                break;
              case 1:
                fixedtables(state);
                state.mode = LEN_;
                if (flush === Z_TREES) {
                  hold >>>= 2;
                  bits -= 2;
                  break inf_leave;
                }
                break;
              case 2:
                state.mode = TABLE;
                break;
              case 3:
                strm.msg = "invalid block type";
                state.mode = BAD;
            }
            hold >>>= 2;
            bits -= 2;
            break;
          case STORED:
            hold >>>= bits & 7;
            bits -= bits & 7;
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
              strm.msg = "invalid stored block lengths";
              state.mode = BAD;
              break;
            }
            state.length = hold & 65535;
            hold = 0;
            bits = 0;
            state.mode = COPY_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          /* falls through */
          case COPY_:
            state.mode = COPY;
          /* falls through */
          case COPY:
            copy = state.length;
            if (copy) {
              if (copy > have) {
                copy = have;
              }
              if (copy > left) {
                copy = left;
              }
              if (copy === 0) {
                break inf_leave;
              }
              output.set(input.subarray(next, next + copy), put);
              have -= copy;
              next += copy;
              left -= copy;
              put += copy;
              state.length -= copy;
              break;
            }
            state.mode = TYPE;
            break;
          case TABLE:
            while (bits < 14) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.nlen = (hold & 31) + 257;
            hold >>>= 5;
            bits -= 5;
            state.ndist = (hold & 31) + 1;
            hold >>>= 5;
            bits -= 5;
            state.ncode = (hold & 15) + 4;
            hold >>>= 4;
            bits -= 4;
            if (state.nlen > 286 || state.ndist > 30) {
              strm.msg = "too many length or distance symbols";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = LENLENS;
          /* falls through */
          case LENLENS:
            while (state.have < state.ncode) {
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.lens[order[state.have++]] = hold & 7;
              hold >>>= 3;
              bits -= 3;
            }
            while (state.have < 19) {
              state.lens[order[state.have++]] = 0;
            }
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = { bits: state.lenbits };
            ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid code lengths set";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = CODELENS;
          /* falls through */
          case CODELENS:
            while (state.have < state.nlen + state.ndist) {
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_val < 16) {
                hold >>>= here_bits;
                bits -= here_bits;
                state.lens[state.have++] = here_val;
              } else {
                if (here_val === 16) {
                  n = here_bits + 2;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  if (state.have === 0) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  len = state.lens[state.have - 1];
                  copy = 3 + (hold & 3);
                  hold >>>= 2;
                  bits -= 2;
                } else if (here_val === 17) {
                  n = here_bits + 3;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 3 + (hold & 7);
                  hold >>>= 3;
                  bits -= 3;
                } else {
                  n = here_bits + 7;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 11 + (hold & 127);
                  hold >>>= 7;
                  bits -= 7;
                }
                if (state.have + copy > state.nlen + state.ndist) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                while (copy--) {
                  state.lens[state.have++] = len;
                }
              }
            }
            if (state.mode === BAD) {
              break;
            }
            if (state.lens[256] === 0) {
              strm.msg = "invalid code -- missing end-of-block";
              state.mode = BAD;
              break;
            }
            state.lenbits = 9;
            opts = { bits: state.lenbits };
            ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid literal/lengths set";
              state.mode = BAD;
              break;
            }
            state.distbits = 6;
            state.distcode = state.distdyn;
            opts = { bits: state.distbits };
            ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            state.distbits = opts.bits;
            if (ret) {
              strm.msg = "invalid distances set";
              state.mode = BAD;
              break;
            }
            state.mode = LEN_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          /* falls through */
          case LEN_:
            state.mode = LEN;
          /* falls through */
          case LEN:
            if (have >= 6 && left >= 258) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              inffast(strm, _out);
              put = strm.next_out;
              output = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state.hold;
              bits = state.bits;
              if (state.mode === TYPE) {
                state.back = -1;
              }
              break;
            }
            state.back = 0;
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_op && (here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
              state.mode = LIT;
              break;
            }
            if (here_op & 32) {
              state.back = -1;
              state.mode = TYPE;
              break;
            }
            if (here_op & 64) {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break;
            }
            state.extra = here_op & 15;
            state.mode = LENEXT;
          /* falls through */
          case LENEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            state.was = state.length;
            state.mode = DIST;
          /* falls through */
          case DIST:
            for (; ; ) {
              here = state.distcode[hold & (1 << state.distbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            if (here_op & 64) {
              strm.msg = "invalid distance code";
              state.mode = BAD;
              break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = DISTEXT;
          /* falls through */
          case DISTEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.offset += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            if (state.offset > state.dmax) {
              strm.msg = "invalid distance too far back";
              state.mode = BAD;
              break;
            }
            state.mode = MATCH;
          /* falls through */
          case MATCH:
            if (left === 0) {
              break inf_leave;
            }
            copy = _out - left;
            if (state.offset > copy) {
              copy = state.offset - copy;
              if (copy > state.whave) {
                if (state.sane) {
                  strm.msg = "invalid distance too far back";
                  state.mode = BAD;
                  break;
                }
              }
              if (copy > state.wnext) {
                copy -= state.wnext;
                from = state.wsize - copy;
              } else {
                from = state.wnext - copy;
              }
              if (copy > state.length) {
                copy = state.length;
              }
              from_source = state.window;
            } else {
              from_source = output;
              from = put - state.offset;
              copy = state.length;
            }
            if (copy > left) {
              copy = left;
            }
            left -= copy;
            state.length -= copy;
            do {
              output[put++] = from_source[from++];
            } while (--copy);
            if (state.length === 0) {
              state.mode = LEN;
            }
            break;
          case LIT:
            if (left === 0) {
              break inf_leave;
            }
            output[put++] = state.length;
            left--;
            state.mode = LEN;
            break;
          case CHECK:
            if (state.wrap) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold |= input[next++] << bits;
                bits += 8;
              }
              _out -= left;
              strm.total_out += _out;
              state.total += _out;
              if (state.wrap & 4 && _out) {
                strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
                state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
              }
              _out = left;
              if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
                strm.msg = "incorrect data check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = LENGTH;
          /* falls through */
          case LENGTH:
            if (state.wrap && state.flags) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
                strm.msg = "incorrect length check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = DONE;
          /* falls through */
          case DONE:
            ret = Z_STREAM_END$1;
            break inf_leave;
          case BAD:
            ret = Z_DATA_ERROR$1;
            break inf_leave;
          case MEM:
            return Z_MEM_ERROR$1;
          case SYNC:
          /* falls through */
          default:
            return Z_STREAM_ERROR$1;
        }
      }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap & 4 && _out) {
      strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  };
  const inflateEnd = (strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    let state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK$1;
  };
  const inflateGetHeader = (strm, head) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if ((state.wrap & 2) === 0) {
      return Z_STREAM_ERROR$1;
    }
    state.head = head;
    head.done = false;
    return Z_OK$1;
  };
  const inflateSetDictionary = (strm, dictionary) => {
    const dictLength = dictionary.length;
    let state;
    let dictid;
    let ret;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }
    if (state.mode === DICT) {
      dictid = 1;
      dictid = adler32_1(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR$1;
      }
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR$1;
    }
    state.havedict = 1;
    return Z_OK$1;
  };
  var inflateReset_1 = inflateReset;
  var inflateReset2_1 = inflateReset2;
  var inflateResetKeep_1 = inflateResetKeep;
  var inflateInit_1 = inflateInit;
  var inflateInit2_1 = inflateInit2;
  var inflate_2$1 = inflate$2;
  var inflateEnd_1 = inflateEnd;
  var inflateGetHeader_1 = inflateGetHeader;
  var inflateSetDictionary_1 = inflateSetDictionary;
  var inflateInfo = "pako inflate (from Nodeca project)";
  var inflate_1$2 = {
    inflateReset: inflateReset_1,
    inflateReset2: inflateReset2_1,
    inflateResetKeep: inflateResetKeep_1,
    inflateInit: inflateInit_1,
    inflateInit2: inflateInit2_1,
    inflate: inflate_2$1,
    inflateEnd: inflateEnd_1,
    inflateGetHeader: inflateGetHeader_1,
    inflateSetDictionary: inflateSetDictionary_1,
    inflateInfo
  };
  function GZheader() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = "";
    this.comment = "";
    this.hcrc = 0;
    this.done = false;
  }
  var gzheader = GZheader;
  const toString = Object.prototype.toString;
  const {
    Z_NO_FLUSH,
    Z_FINISH,
    Z_OK,
    Z_STREAM_END,
    Z_NEED_DICT,
    Z_STREAM_ERROR,
    Z_DATA_ERROR,
    Z_MEM_ERROR
  } = constants$2;
  function Inflate$1(options) {
    this.options = common.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ""
    }, options || {});
    const opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = inflate_1$2.inflateInit2(
      this.strm,
      opt.windowBits
    );
    if (status !== Z_OK) {
      throw new Error(messages[status]);
    }
    this.header = new gzheader();
    inflate_1$2.inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === "string") {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(messages[status]);
        }
      }
    }
  }
  Inflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;
    if (this.ended) return false;
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
    if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = inflate_1$2.inflate(strm, _flush_mode);
      if (status === Z_NEED_DICT && dictionary) {
        status = inflate_1$2.inflateSetDictionary(strm, dictionary);
        if (status === Z_OK) {
          status = inflate_1$2.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR) {
          status = Z_NEED_DICT;
        }
      }
      while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
        inflate_1$2.inflateReset(strm);
        status = inflate_1$2.inflate(strm, _flush_mode);
      }
      switch (status) {
        case Z_STREAM_ERROR:
        case Z_DATA_ERROR:
        case Z_NEED_DICT:
        case Z_MEM_ERROR:
          this.onEnd(status);
          this.ended = true;
          return false;
      }
      last_avail_out = strm.avail_out;
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END) {
          if (this.options.to === "string") {
            let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            let tail = strm.next_out - next_out_utf8;
            let utf8str = strings.buf2string(strm.output, next_out_utf8);
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
            this.onData(utf8str);
          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }
      if (status === Z_OK && last_avail_out === 0) continue;
      if (status === Z_STREAM_END) {
        status = inflate_1$2.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }
      if (strm.avail_in === 0) break;
    }
    return true;
  };
  Inflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Inflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = common.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function inflate$1(input, options) {
    const inflator = new Inflate$1(options);
    inflator.push(input);
    if (inflator.err) throw inflator.msg || messages[inflator.err];
    return inflator.result;
  }
  function inflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return inflate$1(input, options);
  }
  var Inflate_1$1 = Inflate$1;
  var inflate_2 = inflate$1;
  var inflateRaw_1$1 = inflateRaw$1;
  var ungzip$1 = inflate$1;
  var inflate_1$1 = {
    Inflate: Inflate_1$1,
    inflate: inflate_2,
    inflateRaw: inflateRaw_1$1,
    ungzip: ungzip$1
  };
  const { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;
  const { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;
  var Deflate_1 = Deflate;
  var deflate_1 = deflate;
  var deflateRaw_1 = deflateRaw;
  var gzip_1 = gzip;
  var Inflate_1 = Inflate;
  var inflate_1 = inflate;
  var inflateRaw_1 = inflateRaw;
  var ungzip_1 = ungzip;
  var constants_1 = constants$2;
  var pako = {
    Deflate: Deflate_1,
    deflate: deflate_1,
    deflateRaw: deflateRaw_1,
    gzip: gzip_1,
    Inflate: Inflate_1,
    inflate: inflate_1,
    inflateRaw: inflateRaw_1,
    ungzip: ungzip_1,
    constants: constants_1
  };
  function compress(str) {
    return btoa(String.fromCharCode(...pako.gzip(str)));
  }
  async function hashStringSHA1(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function createVideoApi(deps) {
    const {
      pickProxyPrefix,
      proxifyWithPrefix,
      getProxiedUrl,
      getExternalPlayer: getExternalPlayer2,
      getPlayers,
      getVideoQuality,
      notify: notify2,
      svgIcons
    } = deps;
    const getActionProxyPrefix = () => typeof pickProxyPrefix === "function" ? pickProxyPrefix() : "";
    const proxify = (prefix, url) => {
      if (typeof proxifyWithPrefix === "function") return proxifyWithPrefix(prefix, url);
      return prefix ? prefix + url : url;
    };
    const createSVGIcon = (iconName) => {
      const pathData = svgIcons?.[iconName];
      if (!pathData) return "";
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${pathData}</svg>`;
    };
    const createButton = (className, title, content, onClick) => {
      const button = document.createElement("button");
      button.className = className;
      button.title = title;
      button.innerHTML = typeof content === "string" && svgIcons?.[content] ? createSVGIcon(content) : content;
      if (onClick) button.addEventListener("click", onClick);
      return button;
    };
    async function copyToClipboard(text) {
      const value = String(text ?? "");
      if (!value) throw new Error("复制内容为空");
      try {
        if (typeof GM_setClipboard === "function") {
          GM_setClipboard(value, { type: "text", mimetype: "text/plain" });
          return true;
        }
      } catch {
      }
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-1000px";
      textarea.style.left = "-1000px";
      document.body.appendChild(textarea);
      textarea.focus({ preventScroll: true });
      textarea.select();
      const ok = typeof document.execCommand === "function" ? document.execCommand("copy") : false;
      textarea.remove();
      if (!ok) throw new Error("复制失败");
      return true;
    }
    async function getVideoLinkById(videoId, quality = null, options = {}) {
      const proxyPrefix = typeof options?.proxyPrefix === "string" ? options.proxyPrefix : getActionProxyPrefix();
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const apiUrl = proxify(proxyPrefix, `https://api.iwara.tv/video/${videoId}`);
      const infoResponse = await fetch(apiUrl, { headers });
      if (!infoResponse.ok) throw new Error("获取视频信息失败");
      const info = await infoResponse.json();
      if (!info.file) throw new Error("视频文件不存在");
      const fileUrl = new URL(info.fileUrl);
      const fileId = info.file.id;
      const expires = fileUrl.searchParams.get("expires");
      const hash = fileUrl.searchParams.get("hash");
      const xVersion = await hashStringSHA1(`${fileId}_${expires}_5nFp9kmbNnHdAFhaqMvt`);
      const resourceUrl = proxify(
        proxyPrefix,
        `https://files.iwara.tv${fileUrl.pathname}?expires=${expires}&hash=${hash}`
      );
      const resourceHeaders = { "X-Version": xVersion };
      if (token) resourceHeaders["Authorization"] = `Bearer ${token}`;
      const resourceResponse = await fetch(resourceUrl, { headers: resourceHeaders });
      if (!resourceResponse.ok) throw new Error("获取视频资源失败");
      const resources = await resourceResponse.json();
      const targetQuality = quality || getVideoQuality();
      let video = resources.find((v) => v.name === targetQuality);
      if (!video && targetQuality) {
        video = resources.find((v) => v.name.includes(targetQuality) || targetQuality.includes(v.name));
      }
      if (!video) video = resources.find((v) => v.name === "Source") || resources[0];
      const finalUrl = "https:" + video.src.view;
      const proxiedUrl = proxify(proxyPrefix, finalUrl);
      return { url: finalUrl, proxiedUrl, title: info.title, quality: video.name, proxyPrefix };
    }
    function getVideoUrl() {
      const videoElement = document.querySelector(
        '#vjs_video_3_html5_api, [id^="vjs_video_"][id$="_html5_api"], video.vjs-tech, video[src]'
      );
      if (videoElement && videoElement.src) return videoElement.src;
      console.warn("%c[Iwara Player] 未找到视频源", "color: #e06c75; font-weight: bold;");
      return null;
    }
    function getVideoTitle() {
      const titleElement = document.querySelector('h1.text-xl, h1[class*="title"], .page-video__details h1, h1');
      return titleElement ? titleElement.innerText.trim() : document.title;
    }
    function getVideoIdFromUrl() {
      const match = window.location.pathname.match(/\/video\/([^\/]+)/);
      return match ? match[1] : null;
    }
    function getPlayerProtocolUrl(playerName, videoUrl, videoTitle) {
      const player = (getPlayers() || []).find((p) => p.name === playerName);
      const replaceParams = (text) => String(text).replace(/\$\{title\}/g, videoTitle).replace(/\$\{url\}/g, videoUrl).replace(/\$\{url:base64\}/g, btoa(videoUrl)).replace(/\$\{url:encode\}/g, encodeURIComponent(videoUrl));
      if (!player) {
        const defaultArgs2 = [`"${videoUrl}"`, `--force-media-title="${videoTitle}"`, "--ontop"];
        return `ush://MPV?${compress(defaultArgs2.join(" "))}`;
      }
      if (player.type === "protocol") {
        return replaceParams(player.protocol || "");
      }
      if (player.type === "ush") {
        let args = player.args || [`"${videoUrl}"`];
        args = args.map((a) => replaceParams(a));
        return `ush://${player.appName}?${compress(args.join(" "))}`;
      }
      const defaultArgs = [`"${videoUrl}"`, `--force-media-title="${videoTitle}"`, "--ontop"];
      return `ush://MPV?${compress(defaultArgs.join(" "))}`;
    }
    function playWithExternalPlayer() {
      const videoUrl = getVideoUrl();
      if (!videoUrl) {
        notify2("❌ 未找到视频源\n请确保视频已加载", "error");
        return;
      }
      const finalUrl = getProxiedUrl(videoUrl);
      const videoTitle = getVideoTitle();
      const externalPlayer2 = getExternalPlayer2();
      const protocolUrl = getPlayerProtocolUrl(externalPlayer2, finalUrl, videoTitle);
      try {
        console.log(
          "%c[Iwara Player] 播放信息",
          "color: #61afef; font-weight: bold;",
          "\n标题:",
          videoTitle,
          "\n播放器:",
          externalPlayer2,
          "\n画质: 当前网页画质",
          "\nURL:",
          finalUrl
        );
        notify2(`🎬 调用 ${externalPlayer2} 播放器
📸 画质: 当前网页画质`, "info");
        window.open(protocolUrl, "_self");
      } catch (error) {
        console.error("[Iwara Player] 调用失败:", error);
        notify2(`❌ 启动 ${externalPlayer2} 失败
请确保已安装并正确配置协议`, "error");
      }
    }
    async function playVideoById(videoId, videoTitle, quality = null) {
      try {
        const proxyPrefix = getActionProxyPrefix();
        notify2("🔄 正在获取视频链接...", "info", {
          proxyPrefix: proxyPrefix || ""
        });
        const { proxiedUrl, title, quality: actualQuality } = await getVideoLinkById(videoId, quality, { proxyPrefix });
        const finalUrl = proxiedUrl;
        const finalTitle = videoTitle || title;
        const externalPlayer2 = getExternalPlayer2();
        console.log(
          "%c[Iwara Player] 播放信息",
          "color: #61afef; font-weight: bold;",
          "\n视频ID:",
          videoId,
          "\n标题:",
          finalTitle,
          "\n播放器:",
          externalPlayer2,
          "\n画质:",
          actualQuality,
          "\nURL:",
          finalUrl
        );
        notify2(`🎬 调用 ${externalPlayer2} 播放器
📸 画质: ${actualQuality}`, "info", {
          proxyPrefix: proxyPrefix || ""
        });
        const protocolUrl = getPlayerProtocolUrl(externalPlayer2, finalUrl, finalTitle);
        window.open(protocolUrl, "_self");
      } catch (error) {
        console.error("[Iwara Player] 播放失败:", error);
        notify2(`❌ 获取视频链接失败
${error?.message || error}`, "error");
      }
    }
    return {
      createButton,
      copyToClipboard,
      notify: notify2,
      pickProxyPrefix: getActionProxyPrefix,
      getVideoLinkById,
      getVideoUrl,
      getVideoTitle,
      getVideoIdFromUrl,
      getPlayerProtocolUrl,
      playWithExternalPlayer,
      playVideoById
    };
  }
  function createButtonsFeature(deps) {
    const { videoApi: videoApi2, getButtonSettings, isVideoPage: isVideoPage2, isVideoListPage: isVideoListPage2 } = deps;
    function createDetailButtonGroup() {
      if (document.getElementById("iwara-mpv-button-group-detail")) return;
      const videoUrl = videoApi2.getVideoUrl();
      if (!videoUrl) {
        console.warn("[Iwara Player] 视频URL未找到，无法创建按钮");
        return;
      }
      const buttonSettings2 = getButtonSettings();
      const videoTitle = videoApi2.getVideoTitle();
      const buttonGroup = document.createElement("div");
      buttonGroup.id = "iwara-mpv-button-group-detail";
      if (buttonSettings2?.detailPage?.copy) {
        const copyButton = videoApi2.createButton("copy-btn", "复制视频链接", "COPY", async () => {
          try {
            const videoId = videoApi2.getVideoIdFromUrl();
            if (!videoId) {
              videoApi2.notify?.("❌ 无法获取视频 ID", "error");
              return;
            }
            const proxyPrefix = videoApi2.pickProxyPrefix?.() || "";
            videoApi2.notify?.("🔄 正在获取视频链接...", "info", {
              proxyPrefix
            });
            const { proxiedUrl, url } = await videoApi2.getVideoLinkById(videoId, null, { proxyPrefix });
            const finalUrl = proxiedUrl || (proxyPrefix ? proxyPrefix + url : url);
            await videoApi2.copyToClipboard(finalUrl);
            videoApi2.notify?.("✅ 链接已复制到剪贴板", "success", { proxyPrefix });
          } catch (error) {
            console.error("[Iwara Player] 复制失败:", error);
            videoApi2.notify?.("❌ 复制失败: " + (error?.message || error), "error");
          }
        });
        buttonGroup.appendChild(copyButton);
      }
      if (buttonSettings2?.detailPage?.newTab) {
        const downloadButton = videoApi2.createButton("new-tab-btn", "在新标签页播放", "NEW_TAB", async () => {
          try {
            const videoId = videoApi2.getVideoIdFromUrl();
            if (!videoId) {
              videoApi2.notify?.("❌ 无法获取视频 ID", "error");
              return;
            }
            const proxyPrefix = videoApi2.pickProxyPrefix?.() || "";
            videoApi2.notify?.("🔄 正在获取视频链接...", "info", {
              proxyPrefix
            });
            const { proxiedUrl, url } = await videoApi2.getVideoLinkById(videoId, null, { proxyPrefix });
            const finalUrl = proxiedUrl || (proxyPrefix ? proxyPrefix + url : url);
            const opened = window.open(finalUrl, "_blank", "noopener,noreferrer");
            if (!opened) {
              videoApi2.notify?.("❌ 打开失败: 浏览器拦截了新标签页/弹窗，请允许后重试", "error", { proxyPrefix });
              return;
            }
            videoApi2.notify?.("✅ 已在新标签页打开", "success", { proxyPrefix });
          } catch (error) {
            console.error("[Iwara Player] 打开失败:", error);
            videoApi2.notify?.("❌ 打开失败: " + (error?.message || error), "error");
          }
        });
        buttonGroup.appendChild(downloadButton);
      }
      if (buttonSettings2?.detailPage?.quality) {
        const qualityButton = videoApi2.createButton("quality-btn", "540 画质", "540", async () => {
          const videoId = videoApi2.getVideoIdFromUrl();
          if (!videoId) {
            videoApi2.notify?.("❌ 无法获取视频 ID", "error");
            return;
          }
          videoApi2.playVideoById(videoId, videoTitle, "540");
        });
        buttonGroup.appendChild(qualityButton);
      }
      if (buttonSettings2?.detailPage?.play) {
        const playButton = videoApi2.createButton("play-btn", "Source 画质", "PLAY", videoApi2.playWithExternalPlayer);
        buttonGroup.appendChild(playButton);
      }
      if (buttonGroup.children.length > 0) document.body.appendChild(buttonGroup);
    }
    function createHoverButton(videoTeaser, videoId, videoName) {
      if (videoTeaser.querySelector(".iwara-mpv-button-group")) return null;
      const buttonSettings2 = getButtonSettings();
      const buttonGroup = document.createElement("div");
      buttonGroup.className = "iwara-mpv-button-group";
      if (buttonSettings2?.listPage?.copy) {
        const copyButton = videoApi2.createButton("iwara-mpv-action-btn copy", "复制视频链接", "COPY", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            const proxyPrefix = videoApi2.pickProxyPrefix?.() || "";
            videoApi2.notify?.("🔄 正在获取视频链接...", "info", {
              proxyPrefix
            });
            const { proxiedUrl, url } = await videoApi2.getVideoLinkById(videoId, null, { proxyPrefix });
            const finalUrl = proxiedUrl || (proxyPrefix ? proxyPrefix + url : url);
            await videoApi2.copyToClipboard(finalUrl);
            videoApi2.notify?.("✅ 链接已复制到剪贴板", "success", { proxyPrefix });
          } catch (error) {
            console.error("[Iwara Player] 复制失败:", error);
            videoApi2.notify?.("❌ 复制失败: " + (error?.message || error), "error");
          }
        });
        buttonGroup.appendChild(copyButton);
      }
      if (buttonSettings2?.listPage?.newTab) {
        const newTabButton = videoApi2.createButton("iwara-mpv-action-btn new-tab", "在新标签页播放", "NEW_TAB", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            const proxyPrefix = videoApi2.pickProxyPrefix?.() || "";
            videoApi2.notify?.("🔄 正在获取视频链接...", "info", {
              proxyPrefix
            });
            const { proxiedUrl, url } = await videoApi2.getVideoLinkById(videoId, null, { proxyPrefix });
            const finalUrl = proxiedUrl || (proxyPrefix ? proxyPrefix + url : url);
            const opened = window.open(finalUrl, "_blank", "noopener,noreferrer");
            if (!opened) {
              videoApi2.notify?.("❌ 打开失败: 浏览器拦截了新标签页/弹窗，请允许后重试", "error", { proxyPrefix });
              return;
            }
            videoApi2.notify?.("✅ 已在新标签页打开", "success", { proxyPrefix });
          } catch (error) {
            console.error("[Iwara Player] 打开失败:", error);
            videoApi2.notify?.("❌ 打开失败: " + (error?.message || error), "error");
          }
        });
        buttonGroup.appendChild(newTabButton);
      }
      if (buttonSettings2?.listPage?.quality) {
        const qualityButton = videoApi2.createButton("iwara-mpv-action-btn quality", "540 画质", "540", (e) => {
          e.preventDefault();
          e.stopPropagation();
          videoApi2.playVideoById(videoId, videoName, "540");
        });
        buttonGroup.appendChild(qualityButton);
      }
      if (buttonSettings2?.listPage?.play) {
        const playButton = videoApi2.createButton("iwara-mpv-hover-button", "Source 画质", "PLAY", (e) => {
          e.preventDefault();
          e.stopPropagation();
          videoApi2.playVideoById(videoId, videoName);
        });
        buttonGroup.appendChild(playButton);
      }
      if (buttonGroup.children.length > 0) {
        if (buttonGroup.children.length < 4) buttonGroup.classList.add("single-column");
        videoTeaser.appendChild(buttonGroup);
        return buttonGroup;
      }
      return null;
    }
    function handleVideoTeaserHover() {
      const videoTeasers = document.querySelectorAll(".videoTeaser");
      videoTeasers.forEach((teaser) => {
        if (teaser.dataset.mpvProcessed) return;
        teaser.dataset.mpvProcessed = "true";
        const thumbnailLink = teaser.querySelector("a.videoTeaser__thumbnail");
        if (!thumbnailLink) return;
        const href = thumbnailLink.getAttribute("href");
        if (!href) return;
        const videoIdMatch = href.match(/\/video\/([^\/]+)/);
        if (!videoIdMatch) return;
        const videoId = videoIdMatch[1];
        const titleElement = teaser.querySelector(".videoTeaser__title, a[title]");
        const videoName = titleElement ? titleElement.getAttribute("title") || titleElement.textContent.trim() : "Video";
        if (!videoId) return;
        const buttonGroup = createHoverButton(teaser, videoId, videoName);
        teaser.addEventListener("mouseenter", () => {
          if (!buttonGroup) return;
          buttonGroup.style.display = "grid";
          setTimeout(() => {
            buttonGroup.classList.add("visible");
            buttonGroup.querySelectorAll("button").forEach((btn, index) => {
              setTimeout(() => {
                btn.style.transform = "scale(1)";
                btn.style.opacity = "1";
              }, index * 50);
            });
          }, 10);
        });
        teaser.addEventListener("mouseleave", () => {
          if (!buttonGroup) return;
          buttonGroup.classList.remove("visible");
          buttonGroup.querySelectorAll("button").forEach((btn) => {
            btn.style.opacity = "0";
            btn.style.transform = btn.classList.contains("iwara-mpv-hover-button") ? "scale(0.9)" : "scale(0.8)";
          });
          setTimeout(() => buttonGroup.style.display = "none", 200);
        });
      });
    }
    function removeDetailButtonGroup() {
      document.getElementById("iwara-mpv-button-group-detail")?.remove();
    }
    function refreshAllButtons() {
      removeDetailButtonGroup();
      if (isVideoPage2()) createDetailButtonGroup();
      if (isVideoListPage2()) {
        document.querySelectorAll(".iwara-mpv-button-group").forEach((group) => group.remove());
        document.querySelectorAll(".videoTeaser").forEach((teaser) => teaser.dataset.mpvProcessed = "");
        handleVideoTeaserHover();
      }
    }
    return {
      createDetailButtonGroup,
      handleVideoTeaserHover,
      removeDetailButtonGroup,
      refreshAllButtons
    };
  }
  function initApp(deps) {
    const { logInit: logInit2, createSettingsButton: createSettingsButton2, isVideoPage: isVideoPage2, isVideoListPage: isVideoListPage2, getVideoUrl, buttons: buttons2 } = deps;
    function init() {
      logInit2();
      createSettingsButton2();
      let lastUrl = location.href;
      new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
          lastUrl = currentUrl;
          buttons2.removeDetailButtonGroup();
          if (isVideoPage2()) {
            setTimeout(() => {
              if (getVideoUrl()) buttons2.createDetailButtonGroup();
            }, 1e3);
          }
          if (isVideoListPage2()) {
            setTimeout(buttons2.handleVideoTeaserHover, 500);
          }
        }
      }).observe(document, { subtree: true, childList: true });
      const videoObserver = new MutationObserver(() => {
        if (isVideoPage2() && getVideoUrl() && !document.getElementById("iwara-mpv-button-group-detail")) {
          buttons2.createDetailButtonGroup();
        }
      });
      videoObserver.observe(document.body, { childList: true, subtree: true });
      const listObserver = new MutationObserver(() => {
        if (isVideoListPage2()) buttons2.handleVideoTeaserHover();
      });
      listObserver.observe(document.body, { childList: true, subtree: true });
      if (isVideoPage2() && getVideoUrl()) buttons2.createDetailButtonGroup();
      if (isVideoListPage2()) {
        setTimeout(() => {
          buttons2.handleVideoTeaserHover();
        }, 1e3);
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
  function isVideoPage() {
    return /^\/video\//.test(location.pathname);
  }
  function isVideoListPage() {
    return document.querySelectorAll(".videoTeaser").length > 0;
  }
  function logInit() {
    console.log("[Iwara Player] 脚本已启动");
  }
  injectGlobalStyles();
  let proxyList = loadProxyList();
  let proxyTimeout = loadProxyTimeout();
  let buttonSettings = loadButtonSettings();
  const playersInit = ensureDefaultPlayersInitialized();
  let players = Array.isArray(playersInit) && playersInit.length ? playersInit : loadPlayers();
  let externalPlayer = getExternalPlayer();
  const notify = createNotifier(() => proxyList);
  const proxyApi = createProxyApi({ getProxyList: () => proxyList });
  const videoApi = createVideoApi({
    pickProxyPrefix: proxyApi.pickProxyPrefix,
    proxifyWithPrefix: proxyApi.proxifyWithPrefix,
    getProxiedUrl: proxyApi.getProxiedUrl,
    getExternalPlayer: () => externalPlayer,
    getPlayers: () => players,
    getVideoQuality: () => "Source",
    notify,
    svgIcons: SVG_ICONS
  });
  const buttons = createButtonsFeature({
    videoApi,
    getButtonSettings: () => buttonSettings,
    isVideoPage,
    isVideoListPage
  });
  const openSettingsModal = createSettingsModal({
    getPlayers: () => players,
    setPlayers: (nextPlayers) => {
      players = Array.isArray(nextPlayers) ? nextPlayers : [];
      savePlayers(players);
    },
    getExternalPlayer: () => externalPlayer,
    setExternalPlayer: (name) => {
      externalPlayer = name || "MPV";
      setExternalPlayer(externalPlayer);
    },
    getProxyList: () => proxyList,
    setProxyList: (list) => {
      proxyList = Array.isArray(list) ? list : [];
      saveProxyList(proxyList);
    },
    getProxyTimeout: () => proxyTimeout,
    setProxyTimeout: (ms) => {
      const n = Number(ms);
      proxyTimeout = Number.isFinite(n) ? n : 1e4;
      saveProxyTimeout(proxyTimeout);
    },
    getButtonSettings: () => buttonSettings,
    setButtonSettings: (s) => {
      buttonSettings = s || buttonSettings;
      saveButtonSettings(buttonSettings);
    },
    resetToDefaultPlayers: () => resetToDefaultPlayers({
      confirmFn: (msg) => confirm(msg),
      notify,
      reloadFn: () => location.reload()
    }),
    normalizeProxyUrl: proxyApi.normalizeProxyUrl,
    notify,
    refreshAllButtons: buttons.refreshAllButtons
  });
  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("播放器设置", openSettingsModal);
  }
  initApp({
    logInit,
    createSettingsButton: () => createSettingsButton({ onClick: openSettingsModal }),
    isVideoPage,
    isVideoListPage,
    getVideoUrl: () => videoApi.getVideoUrl(),
    buttons
  });

})();