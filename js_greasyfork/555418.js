// ==UserScript==
// @name         B站视频布局：精简评论版
// @namespace    http://tampermonkey.net/
// @version      2.9.3
// @description  左侧视频+悬浮居中标题（支持复制），右侧简介+评论区（单滚动条），支持退出恢复原始布局（已加宽右侧界面）+ 弹幕开关+视频信息+关注UP动态（无限加载）+ 作者信息 + 私信功能 + 弹幕输入框开关 + 评论区无限滚动（原生移动版）+ 右侧视频标题 + 视频订阅合集（悬浮按钮版-优化版）- 自动检测合集并定位当前视频（文字提醒版）
// @author       自定义
// @match        *://*.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect        api.bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/555418/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%B8%83%E5%B1%80%EF%BC%9A%E7%B2%BE%E7%AE%80%E8%AF%84%E8%AE%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/555418/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%B8%83%E5%B1%80%EF%BC%9A%E7%B2%BE%E7%AE%80%E8%AF%84%E8%AE%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入样式时添加唯一ID，方便后续移除
    const styleId = 'custom-bilibili-layout-style';
    // 先移除可能存在的旧样式（防止冲突）
    const oldStyle = document.getElementById(styleId);
    if (oldStyle) oldStyle.remove();

    // 注入核心样式（新增弹幕输入框开关按钮样式和状态提示样式）
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* 隐藏顶部栏 */
        #biliMainHeader, #biliMainHeader * {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
        }

        body, html {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important; /* 禁止页面整体滚动 */
        }

        /* 左侧视频容器（65vw宽度，全屏高度）- 已调整宽度 */
        .player-container, .bpx-player-container {
            width: 65vw !important;
            height: 100vh !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            z-index: 9999 !important;
        }

        /* 隐藏所有弹幕输入和发送相关元素 - 通过类名控制 */
        .hide-danmaku-input .bpx-player-sending-area,
        .hide-danmaku-input .bpx-player-sending-bar,
        .hide-danmaku-input .bpx-player-video-inputbar,
        .hide-danmaku-input .bpx-player-dm-input,
        .hide-danmaku-input .bpx-player-dm-btn-send,
        .hide-danmaku-input .bilibili-player-video-inputbar,
        .hide-danmaku-input .bilibili-player-danmaku-input,
        .hide-danmaku-input .bilibili-player-danmaku-send {
            display: none !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            pointer-events: none !important;
        }

        /* 显示弹幕输入框时的样式 */
        .show-danmaku-input .bpx-player-sending-area,
        .show-danmaku-input .bpx-player-sending-bar,
        .show-danmaku-input .bpx-player-video-inputbar,
        .show-danmaku-input .bpx-player-dm-input,
        .show-danmaku-input .bpx-player-dm-btn-send,
        .show-danmaku-input .bilibili-player-video-inputbar,
        .show-danmaku-input .bilibili-player-danmaku-input,
        .show-danmaku-input .bilibili-player-danmaku-send {

            opacity: 1 !important;

            width: auto !important;
            overflow: visible !important;
            pointer-events: auto !important;
        }

        /* 隐藏原生弹幕开关按钮，但保留其功能逻辑 */
        .bpx-player-dm-switch,
        .bilibili-player-danmaku-switch {
            display: none !important;
        }

        /* 视频标题样式：居中+悬浮显示（已支持复制） */
        .video-top-title {
            position: absolute !important;
            top: 30px !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 10000 !important;
            color: white !important;
            font-size: 20px !important;
            font-weight: 600 !important;
            text-shadow: 0 2px 8px rgba(0,0,0,0.7) !important;
            transition: opacity 0.3s ease !important;
            opacity: 0 !important;
            margin: 0 !important;
            padding: 0 20px !important;
            text-align: center !important;
            user-select: text !important;
            cursor: text !important;
        }

        .player-container:hover .video-top-title,
        .bpx-player-container:hover .video-top-title {
            opacity: 1 !important;
        }

        /* 右侧面板（35vw宽度，全屏高度）- 已加宽 */
        .custom-right-panel {
            width: 35vw !important;
            height: 100vh !important;
            position: fixed !important;
            right: 0 !important;
            top: 0 !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            background: #fff !important;
            z-index: 9998 !important;
            padding: 15px !important;
            box-sizing: border-box !important;
            font-size: 14px !important;
            border-left: 1px solid #eee !important;
        }

        /* 右侧视频标题样式 */
        .custom-video-title-container {

            padding-bottom: 5px !important;
            position: relative !important;
        }

        .custom-video-title {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #18191c !important;
            line-height: 1.4 !important;
            margin: 0 !important;
            padding: 0 !important;
            word-break: break-word !important;
            user-select: text !important;
            cursor: text !important;
            position: relative !important;
            padding-right: 30px !important;
        }

        .custom-video-title:hover {
            color: #00a1d6 !important;
        }

        .copy-title-btn {
            position: absolute !important;
            right: 0 !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            background: none !important;
            border: none !important;
            color: #999 !important;
            cursor: pointer !important;
            padding: 4px !important;
            border-radius: 4px !important;
            transition: all 0.2s ease !important;
            opacity: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .custom-video-title-container:hover .copy-title-btn {
            opacity: 1 !important;
        }

        .copy-title-btn:hover {
            background: #f0f0f0 !important;
            color: #00a1d6 !important;
        }

        .copy-title-btn svg {
            width: 16px !important;
            height: 16px !important;
            fill: currentColor !important;
        }

        .copy-success-tooltip {
            position: absolute !important;
            right: 0 !important;
            top: -30px !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 6px 10px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            white-space: nowrap !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            pointer-events: none !important;
            z-index: 1000 !important;
        }

        .copy-success-tooltip.show {
            opacity: 1 !important;
        }

        /* 订阅合集悬浮按钮样式 */
        .subscription-float-btn {
            position: fixed !important;
            right: 20px !important;
            top: calc(50% + 140px) !important;
            transform: translateY(-50%) !important;
            z-index: 10001 !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background-color: #f5f5f5 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: none !important;
            outline: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        .subscription-float-btn:hover {
            transform: translateY(-50%) scale(1.05) !important;
            background-color: #eaeaea !important;
        }

        .subscription-float-btn.active {
            background-color: #e0e0e0 !important;
        }

        .subscription-float-btn svg {
            width: 28px !important;
            height: 28px !important;
            fill: #999 !important;
            pointer-events: none !important;
            display: block !important;
            opacity: 1 !important;
            transition: fill 0.3s ease !important;
        }

        .subscription-float-btn.active svg {
            fill: #00a1d6 !important;
        }

        /* 订阅合集面板样式 */
        .subscription-panel {
            position: fixed !important;
            right: 86px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 420px !important;
            max-height: 80vh !important;
            background: white !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
            z-index: 10002 !important;
            overflow: hidden !important;
            display: none !important;
            flex-direction: column !important;
        }

        .subscription-panel.active {
            display: flex !important;
        }

        .subscription-panel-header {
            padding: 16px 20px !important;
            border-bottom: 1px solid #eee !important;
            background: #fafafa !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }

        .subscription-panel-title {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #18191c !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .subscription-panel-title svg {
            width: 18px !important;
            height: 18px !important;
            fill: #00a1d6 !important;
        }

        .subscription-panel-close {
            background: none !important;
            border: none !important;
            color: #999 !important;
            cursor: pointer !important;
            padding: 4px !important;
            border-radius: 4px !important;
            transition: all 0.2s ease !important;
            font-size: 18px !important;
            line-height: 1 !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .subscription-panel-close:hover {
            background: #f0f0f0 !important;
            color: #666 !important;
        }

        .subscription-panel-content {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 0 !important;
            position: relative !important;
        }

        .subscription-panel-list {
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
        }

        .subscription-panel-item {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 12px 20px !important;
            border-bottom: 1px solid #f5f5f5 !important;
            transition: background 0.2s ease !important;
            cursor: pointer !important;
            text-decoration: none !important;
            position: relative !important;
        }

        .subscription-panel-item:hover {
            background: #f8f9fa !important;
        }

        .subscription-panel-item:last-child {
            border-bottom: none !important;
        }

        /* 当前视频项特殊样式 */
        .subscription-panel-item.current-video {
            background: rgba(0, 161, 214, 0.08) !important;
            border-left: 3px solid #00a1d6 !important;
            padding-left: 17px !important;
        }

        .subscription-panel-item.current-video::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 3px !important;
            height: 100% !important;
            background: #00a1d6 !important;
        }

        .subscription-panel-item.current-video .subscription-panel-item-title {
            color: #00a1d6 !important;
            font-weight: 600 !important;
        }

        .subscription-panel-item-cover {
            width: 120px !important;
            height: 75px !important;
            border-radius: 6px !important;
            overflow: hidden !important;
            flex-shrink: 0 !important;
            position: relative !important;
        }

        .subscription-panel-item-cover img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
        }

        .subscription-panel-item-info {
            flex: 1 !important;
            min-width: 0 !important;
        }

        .subscription-panel-item-title {
            font-size: 14px !important;
            color: #18191c !important;
            line-height: 1.4 !important;
            margin-bottom: 4px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            font-weight: 500 !important;
        }

        .subscription-panel-item-meta {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            font-size: 12px !important;
            color: #999 !important;
        }

        .subscription-panel-item-duration {
            display: flex !important;
            align-items: center !important;
            gap: 2px !important;
        }

        .subscription-panel-item-duration svg {
            width: 12px !important;
            height: 12px !important;
            fill: currentColor !important;
        }

        .subscription-panel-item-play {
            display: flex !important;
            align-items: center !important;
            gap: 2px !important;
        }

        .subscription-panel-item-play svg {
            width: 12px !important;
            height: 12px !important;
            fill: currentColor !important;
        }

        .subscription-panel-loading {
            text-align: center !important;
            padding: 40px 20px !important;
            color: #999 !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
        }

        .subscription-panel-loading-spinner {
            width: 16px !important;
            height: 16px !important;
            border: 2px solid #f3f3f3 !important;
            border-top: 2px solid #00a1d6 !important;
            border-radius: 50% !important;
            animation: spin 1s linear infinite !important;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .subscription-panel-empty {
            text-align: center !important;
            padding: 40px 20px !important;
            color: #999 !important;
            font-size: 14px !important;
        }

        .subscription-panel-error {
            text-align: center !important;
            padding: 40px 20px !important;
            color: #f44 !important;
            font-size: 14px !important;
        }

        /* 作者信息容器样式 */
        .custom-author-container {
            margin-bottom: 10px !important;
            padding-bottom: 15px !important;
            border-bottom: 1px solid #eee !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 12px !important;
        }

        .custom-author-avatar {
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            flex-shrink: 0 !important;
        }

        .custom-author-avatar img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
        }

        .custom-author-info {
            flex: 1 !important;
            min-width: 0 !important;
        }

        .custom-author-name {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #18191c !important;
            margin-bottom: 6px !important;
            line-height: 1.4 !important;
        }

        .custom-author-name a {
            color: inherit !important;
            text-decoration: none !important;
        }

        .custom-author-name a:hover {
            color: #00a1d6 !important;
        }

        .custom-author-description {
            font-size: 13px !important;
            color: #4e5969 !important;
            line-height: 1.5 !important;
            margin-bottom: 10px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
        }

        .custom-author-buttons {
            display: flex !important;
            gap: 8px !important;
            align-items: center !important;
        }

        /* 更新关注按钮样式 */
        .custom-follow-btn {
            background: #00a1d6 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
            font-size: 14px !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            font-weight: 500 !important;
            height: 32px !important;
            min-width: 80px !important;
            justify-content: center !important;
        }

        .custom-follow-btn:hover {
            background: #0092c4 !important;
        }

        .custom-follow-btn.followed {
            background: #f5f5f5 !important;
            color: #999 !important;
        }

        .custom-follow-btn.followed:hover {
            background: #e8e8e8 !important;
        }

        .custom-follow-btn:disabled {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
        }

        .follow-btn-icon {
            width: 16px !important;
            height: 16px !important;
            flex-shrink: 0 !important;
        }

        .custom-charge-btn {
            background: #ff9500 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 6px 12px !important;
            font-size: 12px !important;
            cursor: pointer !important;
            transition: background 0.2s !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
        }

        .custom-charge-btn:hover {
            background: #e68600 !important;
        }

        /* 新增私信按钮样式 */
        .custom-msg-btn {
            background: #42c02e !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 6px 12px !important;
            font-size: 12px !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            text-decoration: none !important;
        }

        .custom-msg-btn:hover {
            background: #37a326 !important;
            color: white !important;
        }

        /* 移除原来的关注数量显示 */
        .custom-follow-count {
            display: none !important;
        }

        /* 视频信息元数据样式适配（新增） */
        .custom-video-info-meta {
            margin-bottom: 10px !important;
            padding-bottom: 5px !important;
            border-bottom: 1px solid #eee !important;
        }

        .custom-video-info-meta .video-info-detail-list {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 16px !important;
            align-items: center !important;
        }

        .custom-video-info-meta .item {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            color: #4e5969 !important;
            font-size: 13px !important;
        }

        .custom-video-info-meta .view-icon,
        .custom-video-info-meta .dm-icon {
            width: 16px !important;
            height: 16px !important;
            fill: #999 !important;
        }

        .custom-video-info-meta .copyright-icon {
            width: 14px !important;
            height: 14px !important;
            fill: #999 !important;
        }

        .custom-video-info-meta .copyright-text {
            color: #999 !important;
            font-size: 12px !important;
        }

        /* 视频简介样式 */
        .video-description-container {
            margin-bottom: 10px !important;
            padding-bottom: 5px !important;
            border-bottom: 1px solid #eee !important;
        }

        .video-description-title {
            font-size: 16px !important;
            font-weight: 600 !important;
            margin-bottom: 10px !important;
            color: #18191c !important;
        }

        .video-description-content {
            color: #4e5969 !important;
            line-height: 1.6 !important;
            overflow: hidden !important;
            transition: max-height 0.3s ease !important;
        }

        .description-collapsed {
            max-height: 42px !important;
        }

        .description-expanded {
            max-height: 2000px !important;
        }

        .toggle-description {
            color: #00a1d6 !important;
            background: none !important;
            border: none !important;
            padding: 5px 0 !important;
            cursor: pointer !important;
            font-size: 14px !important;
            margin-top: 5px !important;
        }

        /* 评论区样式 - 保留原生结构 */
        .custom-right-panel #commentapp {
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            width: 100% !important;
            background: transparent !important;
        }

        .custom-right-panel .comment-list,
        .custom-right-panel .list-item,
        .custom-right-panel .reply-box {
            background: transparent !important;
            max-width: none !important;
        }

        .custom-right-panel .comment-list .list-item {
            margin-bottom: 0 !important;
            border-bottom: 1px solid #f0f0f0 !important;
        }

        /* 确保评论区在右侧面板中正常显示 */
        .custom-right-panel .bilibili-comment {
            width: 100% !important;
        }

        .custom-right-panel .comment-list {
            width: 100% !important;
        }

        /* 评论区加载提示 */
        .comment-scroll-hint {
            position: fixed !important;
            bottom: 100px !important;
            right: 90px !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            z-index: 10005 !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            pointer-events: none !important;
        }

        .comment-scroll-hint.show {
            opacity: 1 !important;
        }

        /* 收藏按钮 */
        .float-collect-btn {
            position: fixed !important;
            right: 20px !important;
            top: calc(50% - 140px) !important;
            transform: translateY(-50%) !important;
            z-index: 10001 !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background-color: #f5f5f5 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: none !important;
            outline: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        .float-collect-btn:hover {
            transform: translateY(-50%) scale(1.05) !important;
            background-color: #eaeaea !important;
        }

        .float-collect-btn svg {
            width: 28px !important;
            height: 28px !important;
            fill: #999 !important;
            pointer-events: none !important;
            display: block !important;
            opacity: 1 !important;
            transition: fill 0.3s ease !important;
        }

        .float-collect-btn.collected {
            background-color: #e0e0e0 !important;
        }

        .float-collect-btn.collected svg {
            fill: #666 !important;
        }

        /* 弹幕开关按钮 */
        .float-danmaku-btn {
            position: fixed !important;
            right: 20px !important;
            top: calc(50% - 70px) !important;
            transform: translateY(-50%) !important;
            z-index: 10001 !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background-color: #f5f5f5 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: none !important;
            outline: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        .float-danmaku-btn:hover {
            transform: translateY(-50%) scale(1.05) !important;
            background-color: #eaeaea !important;
        }

        .float-danmaku-btn svg {
            width: 28px !important;
            height: 28px !important;
            fill: #999 !important;
            pointer-events: none !important;
            display: block !important;
            opacity: 1 !important;
            transition: fill 0.3s ease !important;
        }

        .float-danmaku-btn.active {
            background-color: #e0e0e0 !important;
        }

        .float-danmaku-btn.active svg {
            fill: #00a1d6 !important;
        }

        /* 弹幕输入框开关按钮 */
        .float-danmaku-input-btn {
            position: fixed !important;
            right: 20px !important;
            top: calc(50% + 0px) !important;
            transform: translateY(-50%) !important;
            z-index: 10001 !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background-color: #f5f5f5 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: none !important;
            outline: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        .float-danmaku-input-btn:hover {
            transform: translateY(-50%) scale(1.05) !important;
            background-color: #eaeaea !important;
        }

        .float-danmaku-input-btn svg {
            width: 28px !important;
            height: 28px !important;
            fill: #999 !important;
            pointer-events: none !important;
            display: block !important;
            opacity: 1 !important;
            transition: fill 0.3s ease !important;
        }

        .float-danmaku-input-btn.active {
            background-color: #e0e0e0 !important;
        }

        .float-danmaku-input-btn.active svg {
            fill: #00a1d6 !important;
        }

        /* 退出布局按钮 */
        .exit-layout-btn {
            position: fixed !important;
            right: 20px !important;
            bottom: 30px !important;
            z-index: 10001 !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background-color: #f5f5f5 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: none !important;
            outline: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        .exit-layout-btn:hover {
            transform: scale(1.05) !important;
            background-color: #eaeaea !important;
        }

        .exit-layout-btn svg {
            width: 28px !important;
            height: 28px !important;
            fill: #999 !important;
            pointer-events: none !important;
            display: block !important;
        }

        .exit-layout-btn:hover svg {
            fill: #f44336 !important;
        }

        /* UP动态悬浮按钮 */
        .up-dynamic-btn {
            position: fixed !important;
            right: 20px !important;
            top: calc(50% + 70px) !important;
            transform: translateY(-50%) !important;
            z-index: 10001 !important;
            width: 56px !important;
            height: 56px !important;
            border-radius: 50% !important;
            background-color: #f5f5f5 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            border: none !important;
            outline: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        .up-dynamic-btn:hover {
            transform: translateY(-50%) scale(1.05) !important;
            background-color: #eaeaea !important;
        }

        .up-dynamic-btn svg {
            width: 28px !important;
            height: 28px !important;
            fill: #999 !important;
            pointer-events: none !important;
            display: block !important;
            opacity: 1 !important;
            transition: fill 0.3s ease !important;
        }

        .up-dynamic-btn.active {
            background-color: #e0e0e0 !important;
        }

        .up-dynamic-btn.active svg {
            fill: #00a1d6 !important;
        }

        /* UP动态面板 */
        .up-dynamic-panel {
            position: fixed !important;
            right: 86px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 380px !important;
            max-height: 70vh !important;
            background: white !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
            z-index: 10002 !important;
            overflow: hidden !important;
            display: none !important;
            flex-direction: column !important;
        }

        .up-dynamic-panel.active {
            display: flex !important;
        }

        .up-dynamic-header {
            padding: 16px !important;
            border-bottom: 1px solid #eee !important;
            background: #fafafa !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }

        .up-dynamic-title {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #18191c !important;
            margin: 0 !important;
        }

        .up-dynamic-refresh {
            background: none !important;
            border: none !important;
            color: #00a1d6 !important;
            cursor: pointer !important;
            font-size: 13px !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
            transition: background 0.2s !important;
        }

        .up-dynamic-refresh:hover {
            background: #f0f0f0 !important;
        }

        .up-dynamic-refresh.loading {
            color: #999 !important;
            cursor: not-allowed !important;
        }

        .up-dynamic-content {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 0 !important;
            position: relative !important;
        }

        .up-dynamic-item {
            padding: 12px 16px !important;
            border-bottom: 1px solid #f5f5f5 !important;
            cursor: pointer !important;
            transition: background 0.2s ease !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 12px !important;
        }

        .up-dynamic-item:hover {
            background: #f8f9fa !important;
        }

        .up-dynamic-item:last-child {
            border-bottom: none !important;
        }

        .up-dynamic-cover {
            width: 120px !important;
            height: 75px !important;
            border-radius: 6px !important;
            overflow: hidden !important;
            flex-shrink: 0 !important;
            position: relative !important;
        }

        .up-dynamic-cover img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 6px !important;
        }

        .up-dynamic-cover::after {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            border-radius: 6px !important;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1) !important;
            pointer-events: none !important;
        }

        .up-dynamic-info {
            flex: 1 !important;
            min-width: 0 !important;
        }

        .up-dynamic-header-info {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            margin-bottom: 6px !important;
        }

        .up-dynamic-avatar {
            width: 20px !important;
            height: 20px !important;
            border-radius: 50% !important;
            flex-shrink: 0 !important;
        }

        .up-dynamic-name {
            font-size: 13px !important;
            font-weight: 500 !important;
            color: #18191c !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        .up-dynamic-video-title {
            font-size: 14px !important;
            color: #18191c !important;
            line-height: 1.4 !important;
            margin-bottom: 6px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            font-weight: 500 !important;
        }

        .up-dynamic-meta {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            font-size: 12px !important;
            color: #999 !important;
            margin-bottom: 4px !important;
        }

        .up-dynamic-time {
            font-size: 12px !important;
            color: #999 !important;
        }

        .up-dynamic-empty {
            padding: 40px 20px !important;
            text-align: center !important;
            color: #999 !important;
            font-size: 14px !important;
        }

        .up-dynamic-loading {
            padding: 20px !important;
            text-align: center !important;
            color: #999 !important;
            font-size: 14px !important;
        }

        .up-dynamic-error {
            padding: 20px !important;
            text-align: center !important;
            color: #f44 !important;
            font-size: 14px !important;
        }

        .up-dynamic-load-more {
            padding: 16px !important;
            text-align: center !important;
            color: #999 !important;
            font-size: 13px !important;
            border-top: 1px solid #f5f5f5 !important;
        }

        .up-dynamic-load-more.loading {
            color: #00a1d6 !important;
        }

        .up-dynamic-load-more:hover:not(.loading) {
            background: #f8f9fa !important;
            cursor: pointer !important;
            color: #00a1d6 !important;
        }

        .up-dynamic-no-more {
            padding: 16px !important;
            text-align: center !important;
            color: #999 !important;
            font-size: 13px !important;
            border-top: 1px solid #f5f5f5 !important;
        }

        /* 隐藏原位置不需要的元素 */
        #viewbox_report, .up-panel-container, #v_desc,
        .video-info-title, .video-title, .video-data,
        .video-page-card, .tag-area, .relative-video,
        .video-like-button .collect, .operate-icon.fav,
        .video-info-meta { /* 隐藏原生位置的视频信息元数据 */
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }

        /* 新增：弹幕状态提示样式 */
        .danmaku-status-tooltip {
            position: fixed !important;
            z-index: 10003 !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            pointer-events: none !important;
            transition: opacity 0.3s ease !important;
            opacity: 0 !important;
            white-space: nowrap !important;
        }

        .danmaku-status-tooltip.show {
            opacity: 1 !important;
        }

        /* 确保评论区加载按钮可见 */
        .custom-right-panel .load-more,
        .custom-right-panel .view-more {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* 调试信息样式 */
        .debug-panel {
            position: fixed !important;
            bottom: 20px !important;
            left: 20px !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 10px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            max-width: 300px !important;
            z-index: 10006 !important;
            display: none !important;
        }

        .debug-panel.show {
            display: block !important;
        }

.subscription-hint {
    position: fixed !important;
    z-index: 10003 !important;
    background: rgba(0, 0, 0, 0.8) !important;
    color: white !important;
    padding: 8px 12px !important;
    border-radius: 6px !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    pointer-events: none !important;
    transition: opacity 0.6s ease !important;
    opacity: 0 !important;
    white-space: nowrap !important;

    /* 添加右侧箭头 */
    margin-left: 6px !important; /* 为箭头留出空间 */
}

.subscription-hint::after {
    content: '' !important;
    position: absolute !important;
    top: 50% !important;
    left: 100% !important; /* 定位到元素的右侧 */
    transform: translateY(-50%) !important;

    /* 创建三角形箭头 */
    width: 0 !important;
    height: 0 !important;
    border-top: 6px solid transparent !important;
    border-bottom: 6px solid transparent !important;
    border-left: 6px solid rgba(0, 0, 0, 0.8) !important; /* 箭头颜色与背景相同 */
}

        .subscription-hint.show {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    // 创建调试面板
    const debugPanel = document.createElement('div');
    debugPanel.className = 'debug-panel';
    document.body.appendChild(debugPanel);

    function logDebug(message) {
        console.log('[B站评论加载]', message);
        debugPanel.textContent = message;
        debugPanel.classList.add('show');
        setTimeout(() => {
            debugPanel.classList.remove('show');
        }, 3000);
    }

    // 创建滚动提示
    const scrollHint = document.createElement('div');
    scrollHint.className = 'comment-scroll-hint';
    scrollHint.textContent = '继续滚动加载更多评论';
    document.body.appendChild(scrollHint);

    // 关键修复：退出布局时恢复原始页面样式
    function restoreOriginalLayout() {
        // 1. 移除自定义样式
        const customStyle = document.getElementById(styleId);
        if (customStyle) customStyle.remove();

        // 2. 恢复body和html的默认滚动
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.margin = '';
        document.body.style.padding = '';
        document.documentElement.style.margin = '';
        document.documentElement.style.padding = '';

        // 3. 恢复被隐藏的原始元素
        const hiddenElements = [
            '#biliMainHeader', '#biliMainHeader *',
            '#viewbox_report', '.up-panel-container', '#v_desc',
            '.video-info-title', '.video-title', '.video-data',
            '.video-page-card', '.tag-area', '.relative-video',
            '.video-like-button .collect', '.operate-icon.fav',
            '.video-info-meta', // 恢复原生视频信息元数据
            // 恢复弹幕输入相关元素
            '.bpx-player-sending-area', '.bpx-player-sending-bar',
            '.bpx-player-video-inputbar', '.bpx-player-dm-input',
            '.bpx-player-dm-btn-send', '.bilibili-player-video-inputbar',
            '.bilibili-player-danmaku-input', '.bilibili-player-danmaku-send'
        ];
        hiddenElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = '';
                el.style.opacity = '';
                el.style.visibility = '';
                el.style.height = '';
                el.style.width = '';
                el.style.overflow = '';
                el.style.pointerEvents = '';
            });
        });

        // 4. 恢复视频容器默认样式
        const videoContainers = ['.player-container', '.bpx-player-container'];
        videoContainers.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.width = '';
                el.style.height = '';
                el.style.position = '';
                el.style.left = '';
                el.style.top = '';
                el.style.zIndex = '';
            });
        });

        // 5. 恢复原生评论区位置
        const originalCommentArea = document.querySelector('.original-comment-placeholder');
        if (originalCommentArea && originalCommentArea._commentApp) {
            const commentApp = originalCommentArea._commentApp;
            originalCommentArea.parentNode.insertBefore(commentApp, originalCommentArea);
            originalCommentArea.remove();
        }

        // 6. 移除自定义添加的元素
        document.querySelectorAll('.custom-right-panel, .video-top-title, .float-collect-btn, .exit-layout-btn, .float-danmaku-btn, .float-danmaku-input-btn, .up-dynamic-btn, .up-dynamic-panel, .custom-author-container, .danmaku-status-tooltip, .comment-scroll-hint, .debug-panel, .original-comment-placeholder, .subscription-float-btn, .subscription-panel, .subscription-hint').forEach(el => {
            el.remove();
        });

        // 7. 移除body上的控制类名
        document.body.classList.remove('hide-danmaku-input', 'show-danmaku-input');
    }

    // 检测是否需要退出布局
    function checkExitLayout() {
        const exitFlag = localStorage.getItem('bilibiliLayoutExit');
        if (exitFlag) {
            restoreOriginalLayout();
            localStorage.removeItem('bilibiliLayoutExit');
            return true;
        }
        return false;
    }

    // 获取页面元素（修改作者信息获取方式）
    function getElements() {
        return {
            videoContainer: document.querySelector('.player-container') || document.querySelector('.bpx-player-container'),
            videoTitle: document.querySelector('.video-title') || document.querySelector('h1.video-info-title'),
            commentArea: document.querySelector('#commentapp'),
            videoDescription: document.querySelector('#v_desc') || document.querySelector('.video-desc') || document.querySelector('.video-detail-description'),
            videoInfoMeta: document.querySelector('.video-info-meta'), // 新增：获取视频信息元数据
            authorInfo: document.querySelector('.up-panel-container'), // 修改：获取整个作者信息面板
            collectButton: document.querySelector('.operate-icon.fav') ||
                          document.querySelector('.video-like-button .collect') ||
                          document.querySelector('[data-e2e="video-collect-btn"]') ||
                          document.querySelector('.bpx-player-ops-fav') ||
                          (document.querySelector('.video-fav-icon') && document.querySelector('.video-fav-icon').parentElement),
            danmakuSwitch: document.querySelector('.bpx-player-dm-switch .bui-danmaku-switch-input') ||
                          document.querySelector('.bilibili-player-danmaku-switch input')
        };
    }

    // 等待原生元素加载
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element || Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                callback(element);
            }
        }, 300);
    }

    // 等待原生弹幕开关加载
    function waitForDanmakuSwitch(callback, timeout = 10000) {
        waitForElement('.bpx-player-dm-switch .bui-danmaku-switch-input, .bilibili-player-danmaku-switch input', callback, timeout);
    }

    // 创建右侧视频标题容器
    function createVideoTitleContainer() {
        const elements = getElements();
        let titleText = '未知标题';

        // 尝试从多个位置获取视频标题
        if (elements.videoTitle) {
            titleText = elements.videoTitle.textContent.trim();
        } else {
            // 备用方案：从页面标题获取
            const pageTitle = document.title;
            if (pageTitle && pageTitle.includes('_哔哩哔哩')) {
                titleText = pageTitle.replace('_哔哩哔哩', '').trim();
            }
        }

        // 创建标题容器
        const titleContainer = document.createElement('div');
        titleContainer.className = 'custom-video-title-container';

        // 创建标题元素
        const titleElement = document.createElement('h2');
        titleElement.className = 'custom-video-title';
        titleElement.textContent = titleText;
        titleElement.title = '点击复制标题';

        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-title-btn';
        copyBtn.title = '复制标题';
        copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V7H4V3H16V7H18V3C18 1.9 17.1 1 16 1Z" fill="currentColor"/>
                <path d="M20 9H8C6.9 9 6 9.9 6 11V21C6 22.1 6.9 23 8 23H20C21.1 23 22 22.1 22 21V11C22 9.9 21.1 9 20 9ZM20 21H8V11H20V21Z" fill="currentColor"/>
            </svg>
        `;

        // 创建复制成功提示
        const tooltip = document.createElement('div');
        tooltip.className = 'copy-success-tooltip';
        tooltip.textContent = '已复制到剪贴板';

        // 复制功能
        async function copyToClipboard(text) {
            try {
                // 尝试使用现代API
                await navigator.clipboard.writeText(text);
                showCopySuccess();
            } catch (err) {
                // 降级到传统方法
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showCopySuccess();
                } catch (err) {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                }
            }
        }

        // 显示复制成功提示
        function showCopySuccess() {
            tooltip.classList.add('show');
            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 2000);
        }

        // 绑定点击事件
        titleElement.addEventListener('click', () => {
            copyToClipboard(titleText);
        });

        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(titleText);
        });

        // 组装容器
        titleContainer.appendChild(titleElement);
        titleContainer.appendChild(copyBtn);
        titleContainer.appendChild(tooltip);

        return titleContainer;
    }

    // 获取当前视频的ID
    function getCurrentVideoId() {
        // 尝试从URL获取视频ID
        const urlMatch = window.location.href.match(/\/video\/(BV\w+|av\d+)/);
        if (urlMatch) {
            return urlMatch[1];
        }

        // 备用方案：从页面元素获取
        const videoElement = document.querySelector('.bpx-player-video-wrap video');
        if (videoElement && videoElement.src) {
            const srcMatch = videoElement.src.match(/\/video\/(BV\w+|av\d+)/);
            if (srcMatch) {
                return srcMatch[1];
            }
        }

        return null;
    }

    // 创建订阅合集悬浮按钮和面板
    function createSubscriptionFloatButton() {
        // 修改订阅合集悬浮按钮图标
        const floatBtn = document.createElement('button');
        floatBtn.className = 'subscription-float-btn';
        floatBtn.title = '订阅合集';

        floatBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" fill="#999"/>
                <path d="M20 6h-8l-2-2H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6z" fill="#999" opacity="0.3"/>
            </svg>
        `;

        // 创建面板
        const panel = document.createElement('div');
        panel.className = 'subscription-panel';

        panel.innerHTML = `
            <div class="subscription-panel-header">
                <div class="subscription-panel-title">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                    订阅合集
                </div>
                <button class="subscription-panel-close" title="关闭">×</button>
            </div>
            <div class="subscription-panel-content">
                <div class="subscription-panel-loading">
                    <div class="subscription-panel-loading-spinner"></div>
                    <span>加载中...</span>
                </div>
            </div>
        `;

        document.body.appendChild(floatBtn);
        document.body.appendChild(panel);

        const contentArea = panel.querySelector('.subscription-panel-content');
        const closeBtn = panel.querySelector('.subscription-panel-close');

        // 创建文字提示工具
        const hint = document.createElement('div');
        hint.className = 'subscription-hint';
        document.body.appendChild(hint);

        // 显示提示
        function showHint(text, element) {
            const rect = element.getBoundingClientRect();
            hint.textContent = text;
            hint.style.left = (rect.left + rect.width / 2) + 'px';
            hint.style.top = (rect.top - 10) + 'px';
            hint.style.transform = 'translateX(-135%) translateY(60%)';
            hint.classList.add('show');

            setTimeout(() => {
                hint.classList.remove('show');
            }, 6000);
        }

        // 从原页面复制订阅合集内容
        function copySubscriptionContent(autoShow = false) {
            // 显示加载状态
            contentArea.innerHTML = `
                <div class="subscription-panel-loading">
                    <div class="subscription-panel-loading-spinner"></div>
                    <span>加载中...</span>
                </div>
            `;

            // 获取当前视频ID
            const currentVideoId = getCurrentVideoId();
            console.log('[订阅合集] 当前视频ID:', currentVideoId);

            // 延迟执行，确保页面完全加载
            setTimeout(() => {
                try {
                    // 查找原页面的订阅合集元素 - 针对您提供的HTML结构
                    const selectors = [
                        '.video-pod.video-pod',
                        '.video-pod',
                        '.video-pod__body',
                        '.video-pod__list',
                        '.video-pod__list.section',
                        '.video-pod__item',
                        '.pod-item.video-pod__item.simple'
                    ];

                    let subscriptionContent = null;
                    let subscriptionTitle = '订阅合集';
                    let subscriptionInfo = null;

                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            // 如果是主要的容器元素，使用它
                            if (selector === '.video-pod.video-pod' || selector === '.video-pod') {
                                subscriptionContent = element.cloneNode(true);

                                // 获取标题
                                const titleElement = element.querySelector('.title.jumpable');
                                if (titleElement) {
                                    subscriptionTitle = titleElement.textContent.trim();
                                }

                                // 获取描述
                                const descElement = element.querySelector('.pod-description-dropdown');
                                if (descElement) {
                                    subscriptionInfo = descElement.textContent.trim();
                                }

                                break;
                            } else if (selector === '.video-pod__body' || selector === '.video-pod__list' || selector === '.video-pod__list.section') {
                                // 如果是列表容器，获取其父容器
                                const parentContainer = element.closest('.video-pod');
                                if (parentContainer) {
                                    subscriptionContent = parentContainer.cloneNode(true);

                                    // 获取标题
                                    const titleElement = parentContainer.querySelector('.title.jumpable');
                                    if (titleElement) {
                                        subscriptionTitle = titleElement.textContent.trim();
                                    }

                                    // 获取描述
                                    const descElement = parentContainer.querySelector('.pod-description-dropdown');
                                    if (descElement) {
                                        subscriptionInfo = descElement.textContent.trim();
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    if (subscriptionContent) {
                        // 清理样式
                        subscriptionContent.style.display = 'block';
                        subscriptionContent.style.visibility = 'visible';
                        subscriptionContent.style.opacity = '1';
                        subscriptionContent.style.position = 'static';
                        subscriptionContent.style.width = 'auto';
                        subscriptionContent.style.height = 'auto';
                        subscriptionContent.style.maxWidth = 'none';
                        subscriptionContent.style.maxHeight = 'none';
                        subscriptionContent.style.overflow = 'visible';
                        subscriptionContent.style.transform = 'none';
                        subscriptionContent.style.left = 'auto';
                        subscriptionContent.style.top = 'auto';
                        subscriptionContent.style.right = 'auto';
                        subscriptionContent.style.bottom = 'auto';
                        subscriptionContent.style.zIndex = 'auto';

                        // 清理所有子元素的样式
                        const allElements = subscriptionContent.querySelectorAll('*');
                        allElements.forEach(el => {
                            if (el.style) {
                                el.style.display = '';
                                el.style.visibility = '';
                                el.style.opacity = '';
                                el.style.position = '';
                                el.style.width = '';
                                el.style.height = '';
                                el.style.maxWidth = '';
                                el.style.maxHeight = '';
                                el.style.overflow = '';
                                el.style.transform = '';
                                el.style.left = '';
                                el.style.top = '';
                                el.style.right = '';
                                el.style.bottom = '';
                                el.style.zIndex = '';
                            }
                        });

                        // 创建列表容器
                        const listContainer = document.createElement('div');
                        listContainer.className = 'subscription-panel-list';

                        // 查找所有视频项 - 针对您提供的HTML结构
                        const videoItems = subscriptionContent.querySelectorAll('.pod-item.video-pod__item.simple, .video-pod__item, .pod-item');

                        if (videoItems.length > 0) {
                            // 添加合集信息头部
                            if (subscriptionTitle || subscriptionInfo) {
                                const headerDiv = document.createElement('div');
                                headerDiv.style.cssText = 'padding: 12px 20px; border-bottom: 1px solid #f5f5f5; background: #fafafa;';

                                if (subscriptionTitle) {
                                    const titleDiv = document.createElement('div');
                                    titleDiv.style.cssText = 'font-size: 14px; font-weight: 600; color: #18191c; margin-bottom: 4px;';
                                    titleDiv.textContent = subscriptionTitle;
                                    headerDiv.appendChild(titleDiv);
                                }

                                if (subscriptionInfo) {
                                    const infoDiv = document.createElement('div');
                                    infoDiv.style.cssText = 'font-size: 12px; color: #999; line-height: 1.4;';
                                    infoDiv.textContent = subscriptionInfo;
                                    headerDiv.appendChild(infoDiv);
                                }

                                listContainer.appendChild(headerDiv);
                            }

                            let currentVideoIndex = -1;
                            let currentVideoElement = null;

                            videoItems.forEach((item, index) => {
                                // 获取视频信息
                                const dataKey = item.getAttribute('data-key');
                                const link = dataKey ? `https://www.bilibili.com/video/${dataKey}` : '';

                                const titleElement = item.querySelector('.title-txt');
                                const title = titleElement ? titleElement.textContent.trim() :
                                           item.getAttribute('title') ||
                                           `视频 ${index + 1}`;

                                const durationElement = item.querySelector('.duration');
                                const duration = durationElement ? durationElement.textContent.trim() : '';

                                // 获取封面图
                                let cover = '//static.hdslb.com/images/akari.jpg';
                                const coverElement = item.querySelector('img');
                                if (coverElement) {
                                    cover = coverElement.src || coverElement.getAttribute('src') || cover;
                                }

                                // 检查是否是当前视频
                                const isCurrentVideo = currentVideoId && (
                                    (dataKey && dataKey === currentVideoId) ||
                                    (link && link.includes(currentVideoId))
                                );

                                if (isCurrentVideo) {
                                    currentVideoIndex = index;
                                    console.log('[订阅合集] 找到当前视频，索引:', index, 'ID:', currentVideoId);
                                }

                                // 创建面板项
                                const panelItem = document.createElement('a');
                                panelItem.className = 'subscription-panel-item';
                                if (isCurrentVideo) {
                                    panelItem.classList.add('current-video');
                                }
                                panelItem.href = link;
                                panelItem.target = '_blank';
                                panelItem.title = title;
                                panelItem.setAttribute('data-index', index);

                                panelItem.innerHTML = `

                                    <div class="subscription-panel-item-info">
                                        <div class="subscription-panel-item-title">${title}</div>
                                        <div class="subscription-panel-item-meta">
                                            ${duration ? `
                                                <span class="subscription-panel-item-duration">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
                                                    </svg>
                                                    ${duration}
                                                </span>
                                            ` : ''}
                                        </div>
                                    </div>
                                `;

                                listContainer.appendChild(panelItem);

                                if (isCurrentVideo) {
                                    currentVideoElement = panelItem;
                                }
                            });

                            // 显示内容
                            contentArea.innerHTML = '';
                            contentArea.appendChild(listContainer);

                            // 如果找到了当前视频，滚动到该位置
                            if (currentVideoElement && currentVideoIndex >= 0) {
                                setTimeout(() => {
                                    // 确保面板内容已完全渲染
                                    const panelRect = panel.getBoundingClientRect();
                                    const itemRect = currentVideoElement.getBoundingClientRect();
                                    const contentRect = contentArea.getBoundingClientRect();

                                    // 计算需要滚动的距离
                                    const scrollTop = currentVideoElement.offsetTop - (contentRect.height / 2) + (itemRect.height / 2);

                                    // 滚动到当前视频位置
                                    contentArea.scrollTo({
                                        top: scrollTop,
                                        behavior: 'smooth'
                                    });

                                    console.log('[订阅合集] 已滚动到当前视频位置，索引:', currentVideoIndex);
                                }, 300);
                            }

                            // 更新面板标题
                            const titleElement = panel.querySelector('.subscription-panel-title');
                            if (titleElement) {
                                titleElement.innerHTML = `
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                                    </svg>
                                    ${subscriptionTitle}
                                `;
                            }

                            // 修改：只做文字提醒，不自动弹出
                            if (autoShow && videoItems.length > 0) {
                                floatBtn.classList.add('active');
                                showHint('有合集，点击查看', floatBtn);
                                console.log('[订阅合集] 检测到合集内容，显示文字提醒');
                            }

                        } else {
                            // 如果没有找到视频项，显示空状态
                            listContainer.innerHTML = `
                                <div class="subscription-panel-empty">
                                    该合集暂无视频内容
                                </div>
                            `;
                            contentArea.innerHTML = '';
                            contentArea.appendChild(listContainer);
                        }

                    } else {
                        // 显示空状态
                        contentArea.innerHTML = `
                            <div class="subscription-panel-empty">
                                该视频不属于任何订阅合集
                            </div>
                        `;
                    }
                } catch (error) {
                    console.error('复制订阅合集内容失败:', error);
                    contentArea.innerHTML = `
                        <div class="subscription-panel-error">
                            获取订阅合集内容失败
                        </div>
                    `;
                }
            }, 500);
        }

        // 点击事件
        floatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = panel.classList.contains('active');

            if (!isActive) {
                copySubscriptionContent(false);
            }

            panel.classList.toggle('active');
            floatBtn.classList.toggle('active', panel.classList.contains('active'));
        });

        // 关闭按钮事件
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.remove('active');
            floatBtn.classList.remove('active');
        });

        // 点击面板外部关闭
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !floatBtn.contains(e.target)) {
                panel.classList.remove('active');
                floatBtn.classList.remove('active');
            }
        });

        // 阻止面板内部点击事件冒泡
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 自动检测并显示合集内容
        setTimeout(() => {
            copySubscriptionContent(true);
        }, 2000);

        return { floatBtn, panel };
    }

    // 创建作者信息容器 - 使用API调用和增强事件模拟
    function createAuthorContainer() {
        const authorContainer = document.createElement('div');
        authorContainer.className = 'custom-author-container';

        // 从页面中获取作者信息
        const elements = getElements();

        let avatarSrc = '//static.hdslb.com/images/member/noface.gif';
        let authorName = '未知作者';
        let authorSpaceUrl = '#';
        let authorDesc = '暂无简介';
        let followCount = '0';
        let isFollowing = false;
        let mid = ''; // 用户MID

        // 从作者面板中提取信息
        if (elements.authorInfo) {
            // 获取头像
            const avatarImg = elements.authorInfo.querySelector('.bili-avatar-img');
            if (avatarImg) {
                avatarSrc = avatarImg.src || avatarImg.getAttribute('data-src') || avatarSrc;
            }

            // 获取作者名称和个人空间链接
            const nameLink = elements.authorInfo.querySelector('.up-name');
            if (nameLink) {
                authorName = nameLink.textContent.trim();
                authorSpaceUrl = nameLink.href || authorSpaceUrl;

                // 从链接中提取MID
                const midMatch = authorSpaceUrl.match(/(\d+)/);
                if (midMatch) {
                    mid = midMatch[1];
                }

                // 确保链接是完整的URL
                if (authorSpaceUrl.startsWith('//')) {
                    authorSpaceUrl = 'https:' + authorSpaceUrl;
                }
            }

            // 获取作者描述
            const descElement = elements.authorInfo.querySelector('.up-description');
            if (descElement) {
                authorDesc = descElement.textContent.trim() || authorDesc;
            }

            // 获取关注状态和数量 - 使用更可靠的选择器
            const followBtn = elements.authorInfo.querySelector('.follow-btn') ||
                             elements.authorInfo.querySelector('.b-gz') ||
                             elements.authorInfo.querySelector('[data-v-3ff36384]');

            if (followBtn) {
                // 检查是否已关注 - 使用更可靠的判断方法
                isFollowing = followBtn.classList.contains('following') ||
                             followBtn.classList.contains('followed') ||
                             !followBtn.classList.contains('not-follow');

                // 提取关注数量
                const followText = followBtn.textContent.trim();
                const countMatch = followText.match(/(\d+\.?\d*)(万?)/) ||
                                  followText.match(/关注\s*(\d+\.?\d*)(万?)/) ||
                                  followText.match(/(\d+\.?\d*)(万?)\s*关注/);

                if (countMatch) {
                    followCount = countMatch[1] + (countMatch[2] || '');
                } else {
                    const numbers = followText.match(/\d+/g);
                    if (numbers && numbers.length > 0) {
                        followCount = numbers[0];
                    }
                }
            }
        }

        // 构建私信链接
        const msgUrl = mid ? `//message.bilibili.com/?spm_id_from=333.788.upinfo.detail.click#whisper/mid${mid}` : '#';

        // 构建作者信息HTML - 新增私信按钮
        authorContainer.innerHTML = `
            <div class="custom-author-avatar">
                <img src="${avatarSrc}" alt="${authorName}" onerror="this.src='//static.hdslb.com/images/member/noface.gif'">
            </div>
            <div class="custom-author-info">
                <div class="custom-author-name">
                    <a href="${authorSpaceUrl}" target="_blank" title="访问个人空间">${authorName}</a>
                </div>
                <div class="custom-author-description" title="${authorDesc}">${authorDesc}</div>
                <div class="custom-author-buttons">
                    <button class="custom-follow-btn ${isFollowing ? 'followed' : ''}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="follow-btn-icon">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M7.25098 8.75V13.25C7.25098 13.6642 7.58676 14 8.00098 14C8.41519 14 8.75098 13.6642 8.75098 13.25V8.75H13.251C13.6652 8.75 14.001 8.41421 14.001 8C14.001 7.58579 13.6652 7.25 13.251 7.25H8.75098V2.75C8.75098 2.33579 8.41519 2 8.00098 2C7.58676 2 7.25098 2.33579 7.25098 2.75V7.25H2.75098C2.33676 7.25 2.00098 7.58579 2.00098 8C2.00098 8.41421 2.33676 8.75 2.75098 8.75H7.25098Z"
                                  fill="currentColor"></path>
                        </svg>
                        ${isFollowing ? '已关注' : '关注'} ${followCount}
                    </button>
                    <button class="custom-charge-btn">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M6 1l1.5 3.5L11 6 7.5 7.5 6 11 4.5 7.5 1 6l3.5-1.5z"/>
                        </svg>
                        充电
                    </button>
                    <a href="${msgUrl}" target="_blank" class="custom-msg-btn" title="发送私信">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M10.5 1h-9C.67 1 0 1.67 0 2.5v7c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM10 4L6 6.5 2 4V3l4 2.5L10 3v1z"/>
                        </svg>
                        私信
                    </a>
                </div>
            </div>
        `;

        // === 全新的关注按钮点击处理逻辑 ===
        const followBtn = authorContainer.querySelector('.custom-follow-btn');
        followBtn.addEventListener('click', async function() {
            if (this.disabled) return;
            this.disabled = true; // 防止重复点击
            const originalText = this.innerHTML;

            try {
                // 显示加载状态
                this.innerHTML = `处理中...`;

                // 方法1: 优先尝试使用B站API直接操作
                const apiSuccess = await tryFollowByAPI(mid, this.classList.contains('followed'));
                if (apiSuccess) {
                    // API调用成功，切换按钮状态
                    toggleFollowButtonState(this, followCount);
                    console.log(`通过API${this.classList.contains('followed') ? '取消关注' : '关注'}用户 ${mid} 成功`);
                } else {
                    // 方法2: API失败，降级到增强型事件模拟
                    console.log('API调用失败，尝试事件模拟');
                    const eventSuccess = await tryFollowByEnhancedEvent(mid, this.classList.contains('followed'));
                    if (eventSuccess) {
                        await updateFollowButtonFromNative(this, elements.authorInfo, followCount);
                    } else {
                        // 方法3: 终极方案 - 直接状态切换
                        console.log('事件模拟失败，使用直接状态切换');
                        toggleFollowButtonState(this, followCount);
                    }
                }
            } catch (error) {
                console.error('关注操作完全失败:', error);
                this.innerHTML = originalText; // 恢复原始文本
            } finally {
                this.disabled = false;
            }
        });

        // 添加充电按钮功能
        const chargeBtn = authorContainer.querySelector('.custom-charge-btn');
        chargeBtn.addEventListener('click', function() {
            const elements = getElements();
            const nativeChargeBtn = elements.authorInfo ? elements.authorInfo.querySelector('.new-charge-btn') : null;

            if (nativeChargeBtn) {
                nativeChargeBtn.click();
            } else {
                alert(`即将为 ${authorName} 充电`);
            }
        });

        return authorContainer;
    }

    // 新增：通过B站API直接关注/取消关注
    async function tryFollowByAPI(mid, isCurrentlyFollowing) {
        // B站关注API端点
        const apiUrl = 'https://api.bilibili.com/x/relation/modify';
        // 从cookie中获取CSRF token (bili_jct)
        const csrfToken = document.cookie.match(/\bbili_jct=([^;]+)/)?.[1];

        if (!csrfToken) {
            console.warn('未找到CSRF token，用户可能未登录。');
            return false;
        }

        const formData = new URLSearchParams();
        formData.append('fid', mid); // 关注对象的UID
        formData.append('act', isCurrentlyFollowing ? '2' : '1'); // 1关注, 2取消关注
        formData.append('csrf', csrfToken);
        formData.append('re_src', '11'); // 来源：空间

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
                credentials: 'include' // 包含cookie
            });

            const data = await response.json();

            if (data.code === 0) {
                return true; // 操作成功
            } else {
                console.error('B站API返回错误:', data.message, data.code);
                return false;
            }
        } catch (error) {
            console.error('API请求失败:', error);
            return false;
        }
    }

    // 新增：增强型事件模拟
    async function tryFollowByEnhancedEvent(mid, isCurrentlyFollowing) {
        return new Promise((resolve) => {
            const elements = getElements();
            let nativeFollowBtn = null;

            // 尝试多种选择器
            const selectors = [
                '.follow-btn',
                '.b-gz',
                '[data-v-3ff36384]',
                '.header-info .follow',
                '.up-info .follow',
            ];

            for (const selector of selectors) {
                nativeFollowBtn = elements.authorInfo?.querySelector(selector);
                if (nativeFollowBtn) break;
            }

            if (!nativeFollowBtn) {
                console.warn('未找到原生关注按钮');
                resolve(false);
                return;
            }

            let attempts = 0;
            const maxAttempts = 2;

            function attemptClick() {
                attempts++;

                try {
                    // 1. 首先尝试触发React事件 (如果页面使用React)
                    if (triggerReactEvent(nativeFollowBtn, 'onClick')) {
                        console.log(`尝试 ${attempts}: 成功触发React事件`);
                        setTimeout(() => resolve(true), 1000);
                        return;
                    }

                    // 2. 完整的浏览器事件序列
                    const eventTypes = ['mousedown', 'mouseup', 'click'];
                    eventTypes.forEach(eventType => {
                        const event = new MouseEvent(eventType, {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            buttons: 1,
                            detail: 1
                        });
                        nativeFollowBtn.dispatchEvent(event);
                    });

                    console.log(`尝试 ${attempts}: 已派发完整鼠标事件序列`);
                    setTimeout(() => resolve(true), 1000);

                } catch (error) {
                    console.error(`尝试 ${attempts} 失败:`, error);
                    if (attempts < maxAttempts) {
                        setTimeout(attemptClick, 500);
                    } else {
                        resolve(false);
                    }
                }
            }

            attemptClick();
        });
    }

    // 更新：改进的React事件触发
    function triggerReactEvent(element, eventName) {
        // 尝试不同的React属性名称
        const reactKeys = Object.keys(element).filter(key =>
            key.startsWith('__reactEventHandlers') ||
            key.startsWith('__reactProps') ||
            key.startsWith('__reactFiber')
        );

        for (const key of reactKeys) {
            const props = element[key];
            if (props && typeof props[eventName] === 'function') {
                try {
                    props[eventName]();
                    return true;
                } catch (e) {
                    console.log('React事件触发异常:', e);
                }
            }
        }
        return false;
    }

    // 从原生按钮更新关注按钮状态
    async function updateFollowButtonFromNative(customBtn, authorInfo, originalCount) {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    let nativeFollowBtn = null;
                    const selectors = ['.follow-btn', '.b-gz', '[data-v-3ff36384]', '.default-btn'];

                    for (const selector of selectors) {
                        nativeFollowBtn = authorInfo ? authorInfo.querySelector(selector) : null;
                        if (nativeFollowBtn) break;
                    }

                    if (nativeFollowBtn) {
                        const isFollowing = nativeFollowBtn.classList.contains('following') ||
                                         nativeFollowBtn.classList.contains('followed') ||
                                         !nativeFollowBtn.classList.contains('not-follow');

                        let newCount = originalCount;
                        const followText = nativeFollowBtn.textContent.trim();
                        const countMatch = followText.match(/(\d+\.?\d*)(万?)/);
                        if (countMatch) {
                            newCount = countMatch[1] + (countMatch[2] || '');
                        }

                        updateFollowButtonUI(customBtn, isFollowing, newCount);
                    }
                } catch (error) {
                    console.error('更新关注状态失败:', error);
                }
                resolve();
            }, 1000);
        });
    }

    // 更新关注按钮UI
    function updateFollowButtonUI(button, isFollowing, count) {
        if (isFollowing) {
            button.classList.add('followed');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="follow-btn-icon">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M7.25098 8.75V13.25C7.25098 13.6642 7.58676 14 8.00098 14C8.41519 14 8.75098 13.6642 8.75098 13.25V8.75H13.251C13.6652 8.75 14.001 8.41421 14.001 8C14.001 7.58579 13.6652 7.25 13.251 7.25H8.75098V2.75C8.75098 2.33579 8.41519 2 8.00098 2C7.58676 2 7.25098 2.33579 7.25098 2.75V7.25H2.75098C2.33676 7.25 2.00098 7.58579 2.00098 8C2.00098 8.41421 2.33676 8.75 2.75098 8.75H7.25098Z"
                          fill="currentColor"></path>
                </svg>
                已关注 ${count}
            `;
            button.style.background = '#f5f5f5';
            button.style.color = '#999';
        } else {
            button.classList.remove('followed');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="follow-btn-icon">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M7.25098 8.75V13.25C7.25098 13.6642 7.58676 14 8.00098 14C8.41519 14 8.75098 13.6642 8.75098 13.25V8.75H13.251C13.6652 8.75 14.001 8.41421 14.001 8C14.001 7.58579 13.6652 7.25 13.251 7.25H8.75098V2.75C8.75098 2.33579 8.41519 2 8.00098 2C7.58676 2 7.25098 2.33579 7.25098 2.75V7.25H2.75098C2.33676 7.25 2.00098 7.58579 2.00098 8C2.00098 8.41421 2.33676 8.75 2.75098 8.75H7.25098Z"
                          fill="currentColor"></path>
                </svg>
                关注 ${count}
            `;
            button.style.background = '#00a1d6';
            button.style.color = 'white';
        }
    }

    // 切换关注按钮状态（直接切换）
    function toggleFollowButtonState(customBtn, count) {
        const isCurrentlyFollowing = customBtn.classList.contains('followed');
        updateFollowButtonUI(customBtn, !isCurrentlyFollowing, count);
    }

    // 创建描述展开/折叠按钮
    function createDescriptionToggle(descriptionContainer, contentElement) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-description';
        toggleBtn.textContent = '展开';

        toggleBtn.addEventListener('click', () => {
            if (contentElement.classList.contains('description-collapsed')) {
                contentElement.classList.remove('description-collapsed');
                contentElement.classList.add('description-expanded');
                toggleBtn.textContent = '收起';
            } else {
                contentElement.classList.remove('description-expanded');
                contentElement.classList.add('description-collapsed');
                toggleBtn.textContent = '展开';
            }
        });

        descriptionContainer.appendChild(toggleBtn);
    }

    // 创建收藏按钮
    function createFloatCollectButton() {
        const floatBtn = document.createElement('button');
        floatBtn.className = 'float-collect-btn';

        floatBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M19.807 9.262C18.744 9.1 17.762 8.368 17.353 7.394L15.472 3.497C14.899 2.198 13.1 2.198 12.446 3.497L10.647 7.394C10.156 8.368 9.256 9.1 8.193 9.262L3.94 9.911C2.632 10.073 2.059 11.697 3.04 12.671L6.23 15.919C6.966 16.65 7.293 17.705 7.13 18.76L6.394 23.307C6.148 24.687 7.621 25.661 8.847 25.012L12.446 23.063C13.428 22.495 14.654 22.495 15.636 23.063L19.235 25.012C20.461 25.661 21.852 24.687 21.688 23.307L20.87 18.76C20.705 17.705 21.034 16.65 21.77 15.919L24.96 12.671C25.941 11.697 25.369 10.073 24.06 9.911L19.807 9.262Z"
                      fill="#999" />
            </svg>
        `;

        floatBtn.addEventListener('click', async () => {
            const elements = getElements();
            if (elements.collectButton) {
                elements.collectButton.click();
                floatBtn.classList.toggle('collected');
                const svgPath = floatBtn.querySelector('svg path');
                svgPath.setAttribute('fill', floatBtn.classList.contains('collected') ? '#666' : '#999');
            } else {
                try {
                    const aidMatch = window.location.href.match(/av(\d+)/) || window.location.href.match(/video\/BV(\w+)/);
                    if (aidMatch) {
                        const id = aidMatch[1];
                        const type = aidMatch[0].startsWith('av') ? 'aid' : 'bvid';
                        const csrf = document.cookie.match(/bili_jct=([^;]+)/);
                        if (!csrf) {
                            alert('请先登录B站');
                            return;
                        }
                        const response = await fetch('https://api.bilibili.com/x/v3/fav/resource/deal', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'X-CSRF-Token': csrf[1]
                            },
                            body: `${type}=${id}&add_media_ids=&del_media_ids=&fid=&platform=web&jsonp=jsonp`
                        });
                        const data = await response.json();
                        if (data.code === 0) {
                            alert(data.message || '收藏成功！');
                            floatBtn.classList.add('collected');
                            floatBtn.querySelector('svg path').setAttribute('fill', '#666');
                        } else {
                            alert('收藏失败：' + (data.message || '请登录后重试'));
                        }
                    }
                } catch (e) {
                    console.error('收藏API调用失败', e);
                    alert('收藏功能需要登录，请确保已登录B站');
                }
            }
        });

        document.body.appendChild(floatBtn);
        return floatBtn;
    }

    // 创建弹幕开关按钮 - 新增文字提醒功能
    function createFloatDanmakuButton() {
        const danmakuBtn = document.createElement('button');
        danmakuBtn.className = 'float-danmaku-btn';

        danmakuBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                      fill="#999" />
            </svg>
        `;

        const svgPath = danmakuBtn.querySelector('svg path');

        // 创建状态提示工具
        const tooltip = document.createElement('div');
        tooltip.className = 'danmaku-status-tooltip';
        document.body.appendChild(tooltip);

        // 显示提示
        function showTooltip(text, element) {
            const rect = element.getBoundingClientRect();
            tooltip.textContent = text;
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - 10) + 'px';
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
            tooltip.classList.add('show');

            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 1500);
        }

        waitForDanmakuSwitch((nativeSwitch) => {
            if (!nativeSwitch) return;

            // 初始化按钮状态和提示
            let isActive = nativeSwitch.checked;
            if (isActive) {
                danmakuBtn.classList.add('active');
                svgPath.setAttribute('fill', '#00a1d6');
                danmakuBtn.title = '关闭弹幕';
            } else {
                danmakuBtn.classList.remove('active');
                svgPath.setAttribute('fill', '#999');
                danmakuBtn.title = '打开弹幕';
            }

            // 点击事件：触发原生开关
            danmakuBtn.addEventListener('click', () => {
                nativeSwitch.click();
                isActive = nativeSwitch.checked;
                danmakuBtn.classList.toggle('active', isActive);
                svgPath.setAttribute('fill', isActive ? '#00a1d6' : '#999');

                // 显示状态提示
                const statusText = isActive ? '弹幕已打开' : '弹幕已关闭';
                showTooltip(statusText, danmakuBtn);

                // 更新悬停提示
                danmakuBtn.title = isActive ? '关闭弹幕' : '打开弹幕';
            });

            // 监听原生开关变化
            nativeSwitch.addEventListener('change', () => {
                isActive = nativeSwitch.checked;
                danmakuBtn.classList.toggle('active', isActive);
                svgPath.setAttribute('fill', isActive ? '#00a1d6' : '#999');
                danmakuBtn.title = isActive ? '关闭弹幕' : '打开弹幕';
            });

            // 鼠标悬停时显示当前状态提示
            danmakuBtn.addEventListener('mouseenter', () => {
                const statusText = isActive ? '弹幕已打开' : '弹幕已关闭';
                showTooltip(statusText, danmakuBtn);
            });
        });

        document.body.appendChild(danmakuBtn);
        return danmakuBtn;
    }

    // 创建弹幕输入框开关按钮
    function createFloatDanmakuInputButton() {
        const inputBtn = document.createElement('button');
        inputBtn.className = 'float-danmaku-input-btn';
        inputBtn.title = '显示/隐藏弹幕输入框';

        inputBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h2v2H6v-2zm4 4h8v-2h-8v2zm4-4h4v-2h-4v2z"
                      fill="#999" />
            </svg>
        `;

        const svgPath = inputBtn.querySelector('svg path');

        // 初始化状态：默认隐藏弹幕输入框
        document.body.classList.add('hide-danmaku-input');
        inputBtn.classList.remove('active');
        svgPath.setAttribute('fill', '#999');
        inputBtn.title = '显示弹幕输入框';

        // 创建状态提示工具
        const tooltip = document.createElement('div');
        tooltip.className = 'danmaku-status-tooltip';
        document.body.appendChild(tooltip);

        // 显示提示
        function showTooltip(text, element) {
            const rect = element.getBoundingClientRect();
            tooltip.textContent = text;
            tooltip.style.left = (rect.left + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - 10) + 'px';
            tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
            tooltip.classList.add('show');

            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 1500);
        }

        // 点击事件：切换弹幕输入框显示/隐藏
        inputBtn.addEventListener('click', () => {
            const isHidden = document.body.classList.contains('hide-danmaku-input');

            if (isHidden) {
                // 切换到显示状态
                document.body.classList.remove('hide-danmaku-input');
                document.body.classList.add('show-danmaku-input');
                inputBtn.classList.add('active');
                svgPath.setAttribute('fill', '#00a1d6');
                inputBtn.title = '隐藏弹幕输入框';
                showTooltip('弹幕输入框已显示', inputBtn);
            } else {
                // 切换到隐藏状态
                document.body.classList.remove('show-danmaku-input');
                document.body.classList.add('hide-danmaku-input');
                inputBtn.classList.remove('active');
                svgPath.setAttribute('fill', '#999');
                inputBtn.title = '显示弹幕输入框';
                showTooltip('弹幕输入框已隐藏', inputBtn);
            }
        });

        // 鼠标悬停时显示当前状态提示
        inputBtn.addEventListener('mouseenter', () => {
            const isHidden = document.body.classList.contains('hide-danmaku-input');
            const statusText = isHidden ? '弹幕框已隐藏' : '弹幕框已显示';
            showTooltip(statusText, inputBtn);
        });

        document.body.appendChild(inputBtn);
        return inputBtn;
    }

    // 创建退出布局按钮
    function createExitLayoutButton() {
        const exitBtn = document.createElement('button');
        exitBtn.className = 'exit-layout-btn';

        exitBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 17.59 13.41 12 19 6.41z"
                      fill="#999" />
            </svg>
        `;

        exitBtn.addEventListener('click', () => {
            localStorage.setItem('bilibiliLayoutExit', 'true');
            window.location.reload();
        });

        document.body.appendChild(exitBtn);
        return exitBtn;
    }

    // 创建UP动态悬浮按钮和面板 - 使用修复后的动态功能
    function createUPDynamicButton() {
        // 修改UP动态悬浮按钮图标
        const dynamicBtn = document.createElement('button');
        dynamicBtn.className = 'up-dynamic-btn';
        dynamicBtn.title = '关注的UP最新动态';

        dynamicBtn.innerHTML = `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4zm5 4l5 3-5 3V10z" fill="#999"/>
                <path d="M21 4h-8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 10h-6V6h6v8z" fill="#999"/>
                <path d="M20 11h-2v2h2v-2zm-2-2h-2v2h2V9zm-2-2h-2v2h2V7zm-2-2h-2v2h2V5z" fill="#999"/>
            </svg>
        `;

        // 创建动态面板
        const dynamicPanel = document.createElement('div');
        dynamicPanel.className = 'up-dynamic-panel';

        dynamicPanel.innerHTML = `
            <div class="up-dynamic-header">
                <h3 class="up-dynamic-title">关注的UP动态</h3>
                <button class="up-dynamic-refresh" title="刷新">刷新</button>
            </div>
            <div class="up-dynamic-content">
                <div class="up-dynamic-loading">加载中...</div>
            </div>
        `;

        document.body.appendChild(dynamicBtn);
        document.body.appendChild(dynamicPanel);

        const refreshBtn = dynamicPanel.querySelector('.up-dynamic-refresh');
        const contentArea = dynamicPanel.querySelector('.up-dynamic-content');

        // 状态管理
        let currentPage = 1;
        let hasMore = true;
        let isLoading = false;
        let offset = '';

        // 获取关注的UP动态 - 使用修复后的API
        function fetchUPDynamics(isLoadMore = false) {
            if (isLoading) return;

            isLoading = true;

            if (!isLoadMore) {
                currentPage = 1;
                hasMore = true;
                offset = '';
                refreshBtn.classList.add('loading');
                refreshBtn.textContent = '刷新中...';
                contentArea.innerHTML = '<div class="up-dynamic-loading">加载中...</div>';
            } else {
                const loadMoreElement = document.createElement('div');
                loadMoreElement.className = 'up-dynamic-load-more loading';
                loadMoreElement.textContent = '加载中...';
                contentArea.appendChild(loadMoreElement);
            }

            // 使用修复后的API端点
            const apiUrl = offset ?
                `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&page=${currentPage}&offset=${offset}` :
                `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&page=${currentPage}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                responseType: 'json',
                onload: function(response) {
                    isLoading = false;
                    refreshBtn.classList.remove('loading');
                    refreshBtn.textContent = '刷新';

                    const loadMoreElement = contentArea.querySelector('.up-dynamic-load-more');
                    if (loadMoreElement) loadMoreElement.remove();

                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.data && data.data.items) {
                            if (isLoadMore) {
                                appendDynamicList(data.data.items);
                            } else {
                                renderDynamicList(data.data.items);
                            }

                            hasMore = data.data.has_more || false;
                            offset = data.data.offset || '';
                            currentPage++;

                            addLoadMoreFooter();
                        } else {
                            const errorMsg = data.message || '未知错误';
                            if (!isLoadMore) {
                                contentArea.innerHTML = `<div class="up-dynamic-error">加载失败: ${errorMsg}</div>`;
                            } else {
                                showLoadMoreError('加载失败');
                            }
                        }
                    } catch (e) {
                        console.error('数据解析失败', e);
                        if (!isLoadMore) {
                            contentArea.innerHTML = '<div class="up-dynamic-error">数据解析失败</div>';
                        } else {
                            showLoadMoreError('数据解析失败');
                        }
                    }
                },
                onerror: function() {
                    isLoading = false;
                    refreshBtn.classList.remove('loading');
                    refreshBtn.textContent = '刷新';

                    const loadMoreElement = contentArea.querySelector('.up-dynamic-load-more');
                    if (loadMoreElement) loadMoreElement.remove();

                    if (!isLoadMore) {
                        contentArea.innerHTML = '<div class="up-dynamic-error">网络请求失败，请检查网络连接</div>';
                    } else {
                        showLoadMoreError('网络请求失败');
                    }
                },
                ontimeout: function() {
                    isLoading = false;
                    refreshBtn.classList.remove('loading');
                    refreshBtn.textContent = '刷新';

                    const loadMoreElement = contentArea.querySelector('.up-dynamic-load-more');
                    if (loadMoreElement) loadMoreElement.remove();

                    if (!isLoadMore) {
                        contentArea.innerHTML = '<div class="up-dynamic-error">请求超时</div>';
                    } else {
                        showLoadMoreError('请求超时');
                    }
                }
            });
        }

        // 显示加载更多错误
        function showLoadMoreError(message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'up-dynamic-load-more';
            errorElement.innerHTML = `${message}，<span style="color: #00a1d6; cursor: pointer;">点击重试</span>`;
            errorElement.querySelector('span').addEventListener('click', () => {
                fetchUPDynamics(true);
            });
            contentArea.appendChild(errorElement);
        }

        // 渲染动态列表 - 使用修复后的数据结构解析
        function renderDynamicList(items) {
            if (!items || items.length === 0) {
                contentArea.innerHTML = '<div class="up-dynamic-empty">暂无关注的UP动态</div>';
                return;
            }

            // 修复：使用正确的数据结构筛选视频动态
            const videoItems = items.filter(item => {
                // 检查是否存在视频动态
                if (item.modules && item.modules.module_dynamic) {
                    const major = item.modules.module_dynamic.major;
                    // 检查是否是视频类型
                    if (major && major.archive) {
                        return true;
                    }
                }
                return false;
            });

            if (videoItems.length === 0) {
                contentArea.innerHTML = '<div class="up-dynamic-empty">暂无视频动态</div>';
                return;
            }

            contentArea.innerHTML = videoItems.map(item => createDynamicItemHTML(item)).join('');

            addItemClickEvents();
        }

        // 追加动态列表
        function appendDynamicList(items) {
            if (!items || items.length === 0) {
                hasMore = false;
                addLoadMoreFooter();
                return;
            }

            // 修复：使用正确的数据结构筛选视频动态
            const videoItems = items.filter(item => {
                if (item.modules && item.modules.module_dynamic) {
                    const major = item.modules.module_dynamic.major;
                    if (major && major.archive) {
                        return true;
                    }
                }
                return false;
            });

            if (videoItems.length === 0) {
                hasMore = false;
                addLoadMoreFooter();
                return;
            }

            const newItemsHTML = videoItems.map(item => createDynamicItemHTML(item)).join('');
            contentArea.insertAdjacentHTML('beforeend', newItemsHTML);

            const allItems = contentArea.querySelectorAll('.up-dynamic-item');
            const newItems = Array.from(allItems).slice(-videoItems.length);
            newItems.forEach(item => {
                item.addEventListener('click', handleItemClick);
            });
        }

        // 创建动态项HTML - 使用修复后的数据结构
        function createDynamicItemHTML(item) {
            const up = item.modules.module_author;
            const video = item.modules.module_dynamic.major.archive;
            const time = item.modules.module_author.pub_ts ? new Date(item.modules.module_author.pub_ts * 1000) : new Date();

            let coverUrl = video.cover || '';
            if (coverUrl && !coverUrl.startsWith('http')) {
                coverUrl = 'https:' + coverUrl;
            }

            const videoUrl = video.jump_url || `https://www.bilibili.com/video/${video.bvid}`;

            // 修复：使用正确的统计数据结构
            const playCount = video.stat ? video.stat.play : 0;
            const danmakuCount = video.stat ? video.stat.danmaku : 0;

            return `
                <div class="up-dynamic-item" data-url="${videoUrl}">
                    <div class="up-dynamic-cover">
                        <img src="${coverUrl}@120w_75h_1c" alt="封面" onerror="this.src='//static.hdslb.com/images/akari.jpg'">
                    </div>
                    <div class="up-dynamic-info">
                        <div class="up-dynamic-header-info">
                            <img class="up-dynamic-avatar" src="${up.face}?20x20" alt="${up.name}" onerror="this.src='//static.hdslb.com/images/member/noface.gif'">
                            <div class="up-dynamic-name">${up.name}</div>
                        </div>
                        <div class="up-dynamic-video-title">${video.title}</div>
                        <div class="up-dynamic-meta">
                            <span>${formatNumber(playCount)}播放</span>
                            <span>${formatNumber(danmakuCount)}弹幕</span>
                            <div class="up-dynamic-time">${formatTime(time)}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // 添加项目点击事件
        function addItemClickEvents() {
            contentArea.querySelectorAll('.up-dynamic-item').forEach(item => {
                item.addEventListener('click', handleItemClick);
            });
        }

        // 处理项目点击
        function handleItemClick() {
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        }

        // 添加加载更多底部
        function addLoadMoreFooter() {
            const existingFooter = contentArea.querySelector('.up-dynamic-load-more, .up-dynamic-no-more');
            if (existingFooter) existingFooter.remove();

            if (hasMore) {
                const loadMoreElement = document.createElement('div');
                loadMoreElement.className = 'up-dynamic-load-more';
                loadMoreElement.textContent = '加载更多';
                loadMoreElement.addEventListener('click', () => {
                    fetchUPDynamics(true);
                });
                contentArea.appendChild(loadMoreElement);
            } else {
                const noMoreElement = document.createElement('div');
                noMoreElement.className = 'up-dynamic-no-more';
                noMoreElement.textContent = '没有更多内容了';
                contentArea.appendChild(noMoreElement);
            }
        }

        // 无限滚动处理
        function setupInfiniteScroll() {
            contentArea.addEventListener('scroll', () => {
                if (isLoading || !hasMore) return;

                const scrollTop = contentArea.scrollTop;
                const scrollHeight = contentArea.scrollHeight;
                const clientHeight = contentArea.clientHeight;

                if (scrollTop + clientHeight >= scrollHeight - 100) {
                    fetchUPDynamics(true);
                }
            });
        }

        // 格式化数字
        function formatNumber(num) {
            if (!num) return '0';
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toString();
        }

        // 格式化时间
        function formatTime(date) {
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return '刚刚';
            if (minutes < 60) return `${minutes}分钟前`;
            if (hours < 24) return `${hours}小时前`;
            if (days < 7) return `${days}天前`;
            return date.toLocaleDateString();
        }

        // 按钮点击事件
        dynamicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = dynamicPanel.classList.contains('active');

            if (!isActive) {
                if (!contentArea.querySelector('.up-dynamic-item')) {
                    fetchUPDynamics(false);
                }
            }

            dynamicPanel.classList.toggle('active');
            dynamicBtn.classList.toggle('active', dynamicPanel.classList.contains('active'));
        });

        // 刷新按钮事件
        refreshBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!refreshBtn.classList.contains('loading')) {
                fetchUPDynamics(false);
            }
        });

        // 点击面板外部关闭
        document.addEventListener('click', (e) => {
            if (!dynamicPanel.contains(e.target) && !dynamicBtn.contains(e.target)) {
                dynamicPanel.classList.remove('active');
                dynamicBtn.classList.remove('active');
            }
        });

        // 阻止面板内部点击事件冒泡
        dynamicPanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 设置无限滚动
        setupInfiniteScroll();

        return { dynamicBtn, dynamicPanel };
    }

    // 原生评论区移动实现
    function moveNativeCommentToRightPanel(rightPanel) {
        const commentApp = document.querySelector('#commentapp');
        if (!commentApp) {
            logDebug('未找到原生评论区');
            return false;
        }

        logDebug('开始移动原生评论区');

        // 创建占位符，用于恢复
        const placeholder = document.createElement('div');
        placeholder.className = 'original-comment-placeholder';
        placeholder.style.display = 'none';
        placeholder._commentApp = commentApp;

        // 在原位置插入占位符
        commentApp.parentNode.insertBefore(placeholder, commentApp);

        // 将评论区移动到右侧面板
        rightPanel.appendChild(commentApp);

        // 设置评论区样式以适应右侧面板
        commentApp.style.width = '100%';
        commentApp.style.maxWidth = 'none';
        commentApp.style.background = 'transparent';

        // 查找评论区内的所有元素并调整样式
        const commentElements = commentApp.querySelectorAll('*');
        commentElements.forEach(el => {
            if (el.style) {
                el.style.maxWidth = 'none';
            }
        });

        // 设置Intersection Observer来检测滚动到底部
        let lastScrollTop = 0;
        let scrollEndTimer = null;
        let isLoadingMore = false;

        // 查找评论加载按钮
        function findLoadMoreButton() {
            const selectors = [
                '.load-more',
                '.view-more',
                '.list-item .load-more',
                '.list-item .view-more',
                '.reply-box .view-more',
                '#commentapp .load-more',
                '#commentapp .view-more'
            ];

            for (const selector of selectors) {
                const button = commentApp.querySelector(selector);
                if (button && button.offsetParent !== null) {
                    return button;
                }
            }
            return null;
        }

        // 检查是否需要加载更多评论
        function checkAndLoadMore() {
            if (isLoadingMore) return;

            const loadMoreBtn = findLoadMoreButton();
            if (loadMoreBtn) {
                const btnText = loadMoreBtn.textContent.trim();
                const noMoreTexts = ['没有更多了', '没有更多评论', '已显示全部评论', '到底了'];

                if (!noMoreTexts.some(text => btnText.includes(text)) &&
                    !loadMoreBtn.disabled &&
                    !loadMoreBtn.classList.contains('disabled')) {

                    logDebug('自动点击加载更多按钮');
                    isLoadingMore = true;

                    // 滚动到按钮位置
                    loadMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });

                    // 延迟点击，确保滚动完成
                    setTimeout(() => {
                        // 模拟真实点击
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        loadMoreBtn.dispatchEvent(clickEvent);

                        // 重置加载状态
                        setTimeout(() => {
                            isLoadingMore = false;
                        }, 2000);
                    }, 500);

                    return true;
                }
            }
            return false;
        }

        // 监听右侧面板滚动
        rightPanel.addEventListener('scroll', function() {
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight;
            const clientHeight = this.clientHeight;

            // 检测是否滚动到底部附近
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                // 显示滚动提示
                scrollHint.classList.add('show');

                // 清除之前的定时器
                if (scrollEndTimer) {
                    clearTimeout(scrollEndTimer);
                }

                // 设置新的定时器，在滚动停止后尝试加载更多
                scrollEndTimer = setTimeout(() => {
                    scrollHint.classList.remove('show');
                    checkAndLoadMore();
                }, 300);
            } else {
                scrollHint.classList.remove('show');
                if (scrollEndTimer) {
                    clearTimeout(scrollEndTimer);
                    scrollEndTimer = null;
                }
            }

            lastScrollTop = scrollTop;
        });

        // 监听评论区内容变化
        const observer = new MutationObserver((mutations) => {
            let hasNewComments = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是新的评论项
                            if (node.classList && (
                                node.classList.contains('reply-item') ||
                                node.classList.contains('list-item') ||
                                node.classList.contains('comment-item')
                            )) {
                                hasNewComments = true;
                            }

                            // 检查子元素中是否有评论项
                            const commentItems = node.querySelectorAll('.reply-item, .list-item, .comment-item');
                            if (commentItems.length > 0) {
                                hasNewComments = true;
                            }
                        }
                    });
                }
            });

            if (hasNewComments) {
                logDebug('检测到新评论加载');
                isLoadingMore = false;
            }
        });

        observer.observe(commentApp, {
            childList: true,
            subtree: true
        });

        // 定期检查评论区状态
        setInterval(() => {
            const loadMoreBtn = findLoadMoreButton();
            if (loadMoreBtn) {
                const btnText = loadMoreBtn.textContent.trim();
                const noMoreTexts = ['没有更多了', '没有更多评论', '已显示全部评论', '到底了'];

                if (noMoreTexts.some(text => btnText.includes(text))) {
                    logDebug('检测到已加载全部评论');
                }
            }
        }, 5000);

        logDebug('原生评论区移动完成');
        return true;
    }

    // 构建布局
    function buildLayout() {
        const elements = getElements();

        // 处理视频标题
        if (elements.videoContainer && elements.videoTitle) {
            const titleText = elements.videoTitle.textContent.trim();
            const titleElement = document.createElement('h1');
            titleElement.className = 'video-top-title';
            titleElement.textContent = titleText;
            elements.videoContainer.appendChild(titleElement);
        }

        // 构建右侧评论面板
        if (elements.commentArea) {
            const rightPanel = document.createElement('div');
            rightPanel.className = 'custom-right-panel';

            // 添加视频标题
            const videoTitleContainer = createVideoTitleContainer();
            rightPanel.appendChild(videoTitleContainer);

            // 添加视频信息元数据
            if (elements.videoInfoMeta) {
                const infoMetaClone = elements.videoInfoMeta.cloneNode(true);
                infoMetaClone.className = 'custom-video-info-meta';
                rightPanel.appendChild(infoMetaClone);
            } else {
                waitForElement('.video-info-meta', (metaElement) => {
                    if (metaElement && !document.querySelector('.custom-video-info-meta')) {
                        const infoMetaClone = metaElement.cloneNode(true);
                        infoMetaClone.className = 'custom-video-info-meta';
                        rightPanel.insertBefore(infoMetaClone, rightPanel.children[2]);
                    }
                });
            }

            // 添加作者信息
            const authorContainer = createAuthorContainer();
            rightPanel.appendChild(authorContainer);

            // 添加视频简介
            if (elements.videoDescription) {
                const descContainer = document.createElement('div');
                descContainer.className = 'video-description-container';

                const descTitle = document.createElement('div');
                descTitle.className = 'video-description-title';
                descTitle.textContent = '视频简介';

                const descContent = document.createElement('div');
                descContent.className = 'video-description-content description-collapsed';
                descContent.innerHTML = elements.videoDescription.innerHTML.replace(/<script.*?>.*?<\/script>/gi, '').replace(/<style.*?>.*?<\/style>/gi, '');
                descContainer.appendChild(descTitle);
                descContainer.appendChild(descContent);
                createDescriptionToggle(descContainer, descContent);

                rightPanel.appendChild(descContainer);
            }

            // 移动原生评论区到右侧面板
            const moveSuccess = moveNativeCommentToRightPanel(rightPanel);
            if (!moveSuccess) {
                // 如果移动失败，创建备用评论区
                const commentClone = elements.commentArea.cloneNode(true);
                rightPanel.appendChild(commentClone);
            }

            document.body.appendChild(rightPanel);
        } else {
            if (window.retryCount === undefined) window.retryCount = 0;
            if (window.retryCount < 30) {
                window.retryCount++;
                setTimeout(buildLayout, 1000);
            } else {
                const rightPanel = document.createElement('div');
                rightPanel.className = 'custom-right-panel';
                rightPanel.innerHTML = '<div style="padding:20px;text-align:center;color:#f44;">评论区加载失败<br>请按Ctrl+Shift+R强制刷新</div>';
                document.body.appendChild(rightPanel);
            }
        }

        // 创建功能按钮
        if (!document.querySelector('.float-collect-btn')) createFloatCollectButton();
        if (!document.querySelector('.float-danmaku-btn')) createFloatDanmakuButton();
        if (!document.querySelector('.float-danmaku-input-btn')) createFloatDanmakuInputButton();
        if (!document.querySelector('.exit-layout-btn')) createExitLayoutButton();
        if (!document.querySelector('.up-dynamic-btn')) createUPDynamicButton();
        if (!document.querySelector('.subscription-float-btn')) createSubscriptionFloatButton();
    }

    // 初始化
    function init() {
        if (checkExitLayout()) return;

        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', buildLayout);
        } else {
            buildLayout();
        }

        // 备用加载机制
        setTimeout(buildLayout, 3000);

        // 监听页面变化
        const observer = new MutationObserver(() => {
            if (!document.querySelector('.custom-right-panel')) {
                buildLayout();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 启动脚本
    init();
})();
