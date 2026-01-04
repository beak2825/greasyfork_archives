// ==UserScript==
// @name         扫文小院移动端美化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  将扫文小院网站改造成现代化设计语言风格
// @author       GLM4.7
// @match        http://m.saowen.net/*
// @match        https://m.saowen.net/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561130/%E6%89%AB%E6%96%87%E5%B0%8F%E9%99%A2%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561130/%E6%89%AB%E6%96%87%E5%B0%8F%E9%99%A2%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // iOS 风格 CSS
    GM_addStyle(`
        /* Viewport 设置 - 确保移动端正确缩放 */
        @viewport {
            width: device-width;
            initial-scale: 1;
            maximum-scale: 1;
            user-scalable: no;
        }

        /* 全局样式重置 */
        * {
            -webkit-tap-highlight-color: transparent !important;
            box-sizing: border-box !important;
        }

        html, body {
            font-size: 16px !important;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif !important;
            background-color: #F2F2F7 !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100vh !important;
            -webkit-text-size-adjust: 100% !important;
            text-size-adjust: 100% !important;
        }

        body {
            padding-top: 60px !important; /* 为顶栏留出空间 */
        }

        /* 隐藏原有元素 */
        #header > span:first-child,
        #footer,
        #bottom-nav,
        .bshare-custom,
        .edit-link,
        #tag_admin,
        #my-status,
        .pagination,
        .paging,
        #backtotop,
        #pages,
        #boards {
            display: none !important;
        }

        /* iOS 风格顶栏 */
        .ios-header {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 60px !important;
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-bottom: 0.5px solid rgba(0, 0, 0, 0.1) !important;
            z-index: 9999 !important;
            transition: transform 0.3s ease !important;
            display: flex !important;
            flex-direction: column !important;
            padding-top: 16px !important; /* 减少状态栏高度 */
        }

        .ios-header.hidden {
            transform: translateY(-100%) !important;
        }

        .ios-header-content {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 16px !important;
            height: 44px !important;
        }

        .ios-header-title {
            font-size: 17px !important;
            font-weight: 600 !important;
            color: #000000 !important;
        }

        .ios-header-actions {
            display: flex !important;
            gap: 8px !important;
        }

        .ios-btn {
            background: none !important;
            border: none !important;
            padding: 8px 12px !important;
            color: #007AFF !important;
            cursor: pointer !important;
            transition: opacity 0.2s, transform 0.2s !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .ios-btn:active {
            opacity: 0.5 !important;
            transform: scale(0.95) !important;
        }

        .ios-btn svg {
            width: 24px !important;
            height: 24px !important;
            fill: currentColor !important;
        }

        /* 主容器 */
        .ios-container {
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 16px !important;
        }

        /* iOS 风格卡片 */
        .ios-card {
            background: #FFFFFF !important;
            border-radius: 16px !important;
            padding: 20px !important;
            margin-bottom: 16px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
        }

        /* 首页 - 筛选器卡片 */
        .ios-filter-card {
            background: #FFFFFF !important;
            border-radius: 16px !important;
            padding: 0 !important;
            margin-bottom: 16px !important;
            overflow: hidden !important;
        }

        .ios-filter-tabs {
            display: flex !important;
            overflow-x: auto !important;
            padding: 12px 16px !important;
            gap: 12px !important;
            scrollbar-width: none !important;
        }

        .ios-filter-tabs::-webkit-scrollbar {
            display: none !important;
        }

        .ios-filter-tab {
            padding: 10px 20px !important;
            border-radius: 24px !important;
            font-size: 16px !important;
            white-space: nowrap !important;
            background: #F2F2F7 !important;
            color: #8E8E93 !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        .ios-filter-tab.active,
        .ios-filter-tab:hover {
            background: #007AFF !important;
            color: #FFFFFF !important;
        }

        /* 首页 - 状态卡片 */
        .ios-status-card {
            background: #FFFFFF !important;
            border-radius: 16px !important;
            padding: 20px !important;
            margin-bottom: 16px !important;
        }

        .ios-status-header {
            display: flex !important;
            align-items: flex-start !important;
            margin-bottom: 16px !important;
        }

        .ios-status-user {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #007AFF !important;
            margin-right: 8px !important;
            text-decoration: none !important;
        }

        .ios-status-user:hover {
            text-decoration: underline !important;
        }

        .ios-status-action {
            font-size: 16px !important;
            color: #8E8E93 !important;
            margin-right: 8px !important;
        }

        .ios-status-novel {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #000000 !important;
            margin: 0 0 6px 0 !important;
            padding: 0 !important;
            text-decoration: none !important;
            display: block !important;
            line-height: 1.4 !important;
        }

        .ios-status-novel:hover {
            color: #007AFF !important;
        }

        .ios-status-novel:active {
            opacity: 0.7 !important;
        }

        .ios-status-author {
            font-size: 15px !important;
            color: #8E8E93 !important;
        }

        .ios-status-rating {
            display: flex !important;
            align-items: center !important;
            margin-top: 6px !important;
        }

        .ios-status-stars {
            color: #FF9500 !important;
            font-size: 16px !important;
            margin-right: 6px !important;
        }

        .ios-status-time {
            font-size: 14px !important;
            color: #8E8E93 !important;
        }

        .ios-status-content {
            background: #F2F2F7 !important;
            border-radius: 12px !important;
            padding: 16px !important;
            font-size: 16px !important;
            line-height: 1.6 !important;
            color: #3C3C43 !important;
        }

        .ios-status-tags {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            margin-top: 12px !important;
        }

        .ios-tag {
            background: #E5E5EA !important;
            color: #8E8E93 !important;
            padding: 6px 14px !important;
            border-radius: 16px !important;
            font-size: 14px !important;
        }

        /* 排序按钮样式 */
        .ios-sort-toggle {
            width: 100% !important;
            padding: 14px 16px !important;
            background: #F2F2F7 !important;
            border: none !important;
            border-radius: 12px !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            color: #000000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .ios-sort-toggle:active {
            background: #E5E5EA !important;
            transform: scale(0.98) !important;
        }

        .ios-sort-toggle-small {
            padding: 8px 12px !important;
            background: transparent !important;
            border: none !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #007AFF !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .ios-sort-toggle-small:active {
            background: #F2F2F7 !important;
            transform: scale(0.98) !important;
        }

        .ios-sort-options {
            display: none !important;
            flex-direction: column !important;
            gap: 8px !important;
            margin-top: 12px !important;
            max-height: 0 !important;
            overflow: hidden !important;
            transition: max-height 0.3s ease, opacity 0.3s ease !important;
            opacity: 0 !important;
        }

        .ios-sort-options.show {
            display: flex !important;
            max-height: 300px !important;
            opacity: 1 !important;
        }

        .ios-sort-btn {
            background: #FFFFFF !important;
            color: #007AFF !important;
            padding: 12px 16px !important;
            border-radius: 8px !important;
            font-size: 15px !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
            border: 1px solid #E5E5EA !important;
        }

        .ios-sort-btn:active {
            background: #F2F2F7 !important;
            transform: scale(0.98) !important;
        }

        /* 作品详情页 */
        .ios-novel-header {
            background: #FFFFFF !important;
            border-radius: 16px !important;
            padding: 24px !important;
            margin-bottom: 16px !important;
        }

        .ios-novel-title {
            font-size: 32px !important;
            font-weight: 800 !important;
            color: #000000 !important;
            margin: 0 0 16px 0 !important;
            padding: 0 !important;
            line-height: 1.2 !important;
            letter-spacing: -0.5px !important;
            text-align: left !important;
        }

        .ios-novel-author-line {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 24px !important;
        }

        .ios-novel-author-label {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #8E8E93 !important;
            margin-right: 4px !important;
        }

        .ios-novel-author {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #007AFF !important;
            text-decoration: none !important;
            display: inline-block !important;
        }

        .ios-novel-author:hover {
            text-decoration: underline !important;
        }

        .ios-novel-stats {
            display: flex !important;
            gap: 12px !important;
            margin-bottom: 20px !important;
        }

        .ios-stat-item {
            flex: 1 !important;
            text-align: center !important;
            background: #F2F2F7 !important;
            border-radius: 12px !important;
            padding: 16px !important;
        }

        .ios-stat-value {
            font-size: 22px !important;
            font-weight: 600 !important;
            color: #000000 !important;
        }

        .ios-stat-label {
            font-size: 14px !important;
            color: #8E8E93 !important;
            margin-top: 6px !important;
        }

        .ios-novel-rating {
            display: flex !important;
            align-items: center !important;
            background: #F2F2F7 !important;
            border-radius: 12px !important;
            padding: 16px !important;
        }

        .ios-rating-stars {
            color: #FF9500 !important;
            font-size: 28px !important;
            margin-right: 10px !important;
        }

        .ios-rating-score {
            font-size: 32px !important;
            font-weight: 700 !important;
            color: #000000 !important;
            margin-right: 10px !important;
        }

        .ios-rating-count {
            font-size: 14px !important;
            color: #8E8E93 !important;
        }

        /* 作品信息卡片 */
        .ios-info-card {
            background: #FFFFFF !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            margin-bottom: 16px !important;
        }

        .ios-info-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 20px !important;
            border-bottom: 0.5px solid rgba(0, 0, 0, 0.1) !important;
        }

        .ios-info-title {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #000000 !important;
        }

        .ios-info-toggle {
            font-size: 16px !important;
            color: #007AFF !important;
            background: none !important;
            border: none !important;
            cursor: pointer !important;
        }

        .ios-info-content {
            padding: 20px !important;
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
            max-height: 1000px !important;
            opacity: 1 !important;
            overflow: hidden !important;
            transition: max-height 0.3s ease, opacity 0.3s ease !important;
        }

        .ios-info-content.collapsed {
            max-height: 0 !important;
            opacity: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }

        .ios-info-item {
            font-size: 15px !important;
            color: #3C3C43 !important;
        }

        .ios-info-label {
            color: #8E8E93 !important;
            margin-right: 4px !important;
        }

        /* 标签卡片 */
        .ios-tags-card {
            background: #FFFFFF !important;
            border-radius: 16px !important;
            padding: 20px !important;
            margin-bottom: 16px !important;
        }

        .ios-tags-title {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: #000000 !important;
            margin-bottom: 16px !important;
        }

        .ios-tags-list {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
        }

        .ios-tag-item {
            background: #E5E5EA !important;
            color: #3C3C43 !important;
            padding: 10px 18px !important;
            border-radius: 20px !important;
            font-size: 15px !important;
            text-decoration: none !important;
            display: inline-block !important;
            transition: all 0.2s !important;
        }

        .ios-tag-item:hover {
            background: #D1D1D6 !important;
        }

        .ios-tag-item:active {
            background: #C7C7CC !important;
        }

        /* 搜索栏 */
        .ios-search-bar {
            background: #FFFFFF !important;
            border-radius: 12px !important;
            padding: 12px 16px !important;
            margin: 0 16px 16px 16px !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }

        .ios-search-bar svg {
            flex-shrink: 0 !important;
        }

        .ios-search-input {
            flex: 1 !important;
            border: none !important;
            outline: none !important;
            font-size: 17px !important;
            background: none !important;
            padding: 4px 0 !important;
        }

        .ios-search-input::placeholder {
            color: #8E8E93 !important;
        }

        /* 导航菜单 */
        .ios-nav-menu {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 75% !important;
            max-width: 320px !important;
            background: #FFFFFF !important;
            box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15) !important;
            z-index: 9998 !important;
            padding-top: 60px !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
            visibility: hidden !important;
        }

        .ios-nav-menu.show {
            transform: translateX(0) !important;
            visibility: visible !important;
        }

        .ios-nav-item {
            padding: 16px 24px !important;
            font-size: 17px !important;
            color: #007AFF !important;
            text-decoration: none !important;
            display: block !important;
            border-bottom: 0.5px solid rgba(0, 0, 0, 0.05) !important;
        }

        .ios-nav-item:last-child {
            border-bottom: none !important;
        }

        /* 遮罩层 */
        .ios-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.4) !important;
            z-index: 9997 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: opacity 0.3s ease, visibility 0.3s ease !important;
        }

        .ios-overlay.show {
            opacity: 1 !important;
            visibility: visible !important;
        }

        /* 动画 */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .ios-fade-in {
            animation: fadeIn 0.3s ease-out !important;
        }

        .ios-slide-in-up {
            animation: slideInUp 0.4s ease-out !important;
        }

        .ios-scale-in {
            animation: scaleIn 0.3s ease-out !important;
        }

        /* 卡片交互动画 */
        .ios-card,
        .ios-status-card,
        .ios-novel-header,
        .ios-info-card,
        .ios-tags-card {
            transition: box-shadow 0.2s ease, transform 0.2s ease !important;
        }

        .ios-card:hover,
        .ios-status-card:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
        }

        /* 按钮动画 */
        .ios-btn,
        .ios-filter-tab,
        .ios-pagination-btn,
        .ios-review-btn,
        .ios-info-toggle {
            transition: opacity 0.15s ease, transform 0.15s ease !important;
        }

        .ios-btn:active,
        .ios-filter-tab:active,
        .ios-pagination-btn:active,
        .ios-review-btn:active,
        .ios-info-toggle:active {
            opacity: 0.8 !important;
            transform: scale(0.97) !important;
        }

        /* 链接动画 */
        .ios-status-novel,
        .ios-status-user,
        .ios-novel-author,
        .ios-tag-item {
            transition: color 0.15s ease !important;
        }

        /* 搜索框动画 */
        .ios-search-bar,
        .ios-search-modal-input {
            transition: box-shadow 0.2s ease !important;
        }

        .ios-search-bar:focus-within,
        .ios-search-modal-input:focus {
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3) !important;
        }

        /* 菜单动画 */
        .ios-nav-menu {
            transition: transform 0.3s ease !important;
        }

        .ios-nav-menu.show {
            transform: translateX(0) !important;
        }

        .ios-nav-item {
            transition: background-color 0.15s ease !important;
        }

        .ios-nav-item:active {
            background-color: #F2F2F7 !important;
        }

        /* 遮罩层动画 */
        .ios-overlay {
            transition: opacity 0.25s ease !important;
        }

        /* 评论容器动画 */
        #iosReviewContainer {
            transition: max-height 0.3s ease, opacity 0.3s ease !important;
            overflow: hidden !important;
        }

        /* 隐藏原有样式 */
        #top,
        #top-nav,
        #second-nav,
        #filter,
        #homepage-tab,
        #status-list,
        #info,
        #novel-info,
        #status-count,
        #rate-info,
        #noveltags,
        #reviews,
        #boards,
        #author,
        #creator,
        #author-info,
        #novel-list {
            display: none !important;
        }

        /* 通用页面样式 */
        .ios-generic-container {
            padding: 16px !important;
        }

        .ios-generic-container a {
            color: #007AFF !important;
            text-decoration: none !important;
        }

        .ios-generic-container a:hover {
            text-decoration: underline !important;
        }

        /* 翻页按钮样式 */
        .ios-pagination {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 16px !important;
            margin-top: 12px !important;
        }

        .ios-pagination-btn {
            padding: 10px 20px !important;
            background: #FFFFFF !important;
            border: 1px solid #E5E5EA !important;
            border-radius: 8px !important;
            font-size: 15px !important;
            color: #007AFF !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        .ios-pagination-btn:active {
            background: #F2F2F7 !important;
        }

        .ios-pagination-btn:disabled {
            opacity: 0.5 !important;
            cursor: not-allowed !important;
        }

        .ios-pagination-info {
            font-size: 14px !important;
            color: #8E8E93 !important;
        }

        /* 评论查看按钮 */
        .ios-review-btn {
            display: block !important;
            width: 100% !important;
            padding: 14px !important;
            background: #F2F2F7 !important;
            border: none !important;
            border-radius: 12px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #007AFF !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
            text-align: center !important;
        }

        .ios-review-btn:active {
            background: #E5E5EA !important;
        }

        /* 搜索弹出层 */
        .ios-search-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.5) !important;
            z-index: 10000 !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: opacity 0.3s ease, visibility 0.3s ease !important;
        }

        .ios-search-modal.show {
            opacity: 1 !important;
            visibility: visible !important;
        }

        .ios-search-modal-content {
            width: 100% !important;
            max-width: 600px !important;
            background: #FFFFFF !important;
            border-radius: 0 0 12px 12px !important;
            padding: 16px !important;
            padding-top: 76px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            transform: translateY(-100%) !important;
            transition: transform 0.3s ease !important;
        }

        .ios-search-modal.show .ios-search-modal-content {
            transform: translateY(0) !important;
        }

        .ios-search-modal-input {
            width: 100% !important;
            padding: 12px !important;
            font-size: 17px !important;
            border: 1px solid #E5E5EA !important;
            border-radius: 8px !important;
            outline: none !important;
            background: #F2F2F7 !important;
        }

        .ios-search-modal-input:focus {
            border-color: #007AFF !important;
            background: #FFFFFF !important;
        }

        .ios-search-modal-buttons {
            display: flex !important;
            gap: 8px !important;
            margin-top: 12px !important;
        }

        .ios-search-modal-btn {
            flex: 1 !important;
            padding: 12px !important;
            border: none !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }

        .ios-search-modal-btn.primary {
            background: #007AFF !important;
            color: #FFFFFF !important;
        }

        .ios-search-modal-btn.primary:active {
            background: #0062CC !important;
        }

        .ios-search-modal-btn.secondary {
            background: #F2F2F7 !important;
            color: #007AFF !important;
        }

        .ios-search-modal-btn.secondary:active {
            background: #E5E5EA !important;
        }
    `);

    // 设置viewport
    function setViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
            document.head.appendChild(meta);
        }
    }

    // 等待页面加载完成
    function init() {
        // 设置viewport
        setViewport();
        
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            transformPage();
        } else {
            document.addEventListener('DOMContentLoaded', transformPage);
        }
    }

    // 页面转换
    function transformPage() {
        // 创建 iOS 顶栏
        createIOSHeader();

        // 根据页面类型进行转换
        const path = window.location.pathname;

        if (path === '/' || path === '/index.php') {
            transformHomePage();
        } else if (path.includes('/readstatuses/index/')) {
            transformHomePage();
        } else if (path.includes('/novels/view/')) {
            transformNovelPage();
        } else if (path.includes('/novels/search')) {
            transformSearchPage();
        } else if (path.includes('/noveltags/search')) {
            transformTagsSearchPage();
        } else if (path.includes('/readstatuses/novelReviews')) {
            transformReviewPage();
        } else if (path.includes('/authors/view/')) {
            transformAuthorPage();
        } else {
            transformGenericPage();
        }

        // 添加滚动监听
        addScrollListener();
    }

    // 创建 iOS 顶栏
    function createIOSHeader() {
        const header = document.createElement('div');
        header.className = 'ios-header';
        header.id = 'iosHeader';

        const title = document.title.replace(' | 扫文小院', '').trim() || '扫文小院';

        header.innerHTML = `
            <div class="ios-header-content">
                <button class="ios-btn" id="menuBtn">
                    <svg viewBox="0 0 24 24">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                    </svg>
                </button>
                <span class="ios-header-title">${title}</span>
                <div class="ios-header-actions">
                    <button class="ios-btn" id="searchBtn">
                        <svg viewBox="0 0 24 24">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.insertBefore(header, document.body.firstChild);

        // 创建导航菜单
        const navMenu = document.createElement('div');
        navMenu.className = 'ios-nav-menu';
        navMenu.id = 'iosNavMenu';
        navMenu.innerHTML = `
            <a href="http://m.saowen.net/" class="ios-nav-item">首页</a>
            <a href="http://m.saowen.net/novels" class="ios-nav-item">作品目录</a>
            <a href="http://m.saowen.net/authors" class="ios-nav-item">作者目录</a>
            <a href="http://m.saowen.net/novellists" class="ios-nav-item">扫文单</a>
            <a href="http://m.saowen.net/Novels/edit_new" class="ios-nav-item">添加作品</a>
            <a href="http://m.saowen.net/posts" class="ios-nav-item">网站公告</a>
            <a href="http://m.saowen.net/novels/advSearch" class="ios-nav-item">高级搜索</a>
        `;
        document.body.appendChild(navMenu);

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'ios-overlay';
        overlay.id = 'iosOverlay';
        document.body.appendChild(overlay);

        // 绑定事件
        document.getElementById('menuBtn').addEventListener('click', toggleMenu);
        document.getElementById('iosOverlay').addEventListener('click', toggleMenu);
        document.getElementById('searchBtn').addEventListener('click', showSearch);
    }

    // 切换菜单
    function toggleMenu() {
        const menu = document.getElementById('iosNavMenu');
        const overlay = document.getElementById('iosOverlay');
        menu.classList.toggle('show');
        overlay.classList.toggle('show');
    }

    // 显示搜索
    function showSearch() {
        // 检查是否已经有搜索弹出框
        let searchModal = document.getElementById('iosSearchModal');

        if (!searchModal) {
            // 创建搜索弹出框
            searchModal = document.createElement('div');
            searchModal.id = 'iosSearchModal';
            searchModal.className = 'ios-search-modal';
            searchModal.innerHTML = `
                <div class="ios-search-modal-content">
                    <input type="search" class="ios-search-modal-input" placeholder="搜索作品标题或作者" id="iosModalSearchInput">
                    <div class="ios-search-modal-buttons">
                        <button class="ios-search-modal-btn secondary" id="closeSearchModal">取消</button>
                        <button class="ios-search-modal-btn primary" id="doSearch">搜索</button>
                    </div>
                </div>
            `;
            document.body.appendChild(searchModal);

            // 绑定事件
            document.getElementById('closeSearchModal').addEventListener('click', () => {
                searchModal.classList.remove('show');
            });

            document.getElementById('doSearch').addEventListener('click', () => {
                const input = document.getElementById('iosModalSearchInput');
                const query = input.value.trim();
                if (query) {
                    window.location.href = `http://m.saowen.net/novels/search?q=${encodeURIComponent(query)}`;
                }
            });

            // 回车搜索
            document.getElementById('iosModalSearchInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        window.location.href = `http://m.saowen.net/novels/search?q=${encodeURIComponent(query)}`;
                    }
                }
            });

            // 点击遮罩层关闭
            searchModal.addEventListener('click', (e) => {
                if (e.target === searchModal) {
                    searchModal.classList.remove('show');
                }
            });

            // 延迟显示，确保初始样式已应用
            setTimeout(() => {
                searchModal.classList.add('show');
            }, 10);
        } else {
            // 如果已存在，直接显示
            searchModal.classList.add('show');
        }

        const input = document.getElementById('iosModalSearchInput');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }

    // 转换首页
    function transformHomePage() {
        const mainContent = document.querySelector('#main') || document.querySelector('#content');
        if (!mainContent) return;

        // 创建搜索栏
        const searchBar = document.createElement('div');
        searchBar.className = 'ios-search-bar ios-scale-in';
        searchBar.innerHTML = `
            <svg style="width: 20px; height: 20px; fill: #8E8E93;" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input type="search" class="ios-search-input" placeholder="搜索作品标题或作者" id="iosSearchInput">
        `;
        mainContent.insertBefore(searchBar, mainContent.firstChild);

        // 绑定搜索事件
        const searchInput = document.getElementById('iosSearchInput');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `http://m.saowen.net/novels/search?q=${encodeURIComponent(query)}`;
                }
            }
        });

        // 创建筛选器
        const filterCard = document.createElement('div');
        filterCard.className = 'ios-filter-card ios-slide-in-up';
        filterCard.innerHTML = `
            <div class="ios-filter-tabs">
                <button class="ios-filter-tab" data-filter="all">全部</button>
                <button class="ios-filter-tab" data-filter="original">原创文</button>
                <button class="ios-filter-tab" data-filter="finished">完结文</button>
                <button class="ios-filter-tab" data-filter="highrate">高分评论</button>
                <button class="ios-filter-tab" data-filter="long">长评</button>
                <button class="ios-filter-tab" data-filter="useful">有用评论</button>
            </div>
        `;
        mainContent.appendChild(filterCard);

        // 根据当前URL设置active tab
        const path = window.location.pathname;
        const currentFilter = path.match(/\/readstatuses\/index\/(\w+)/);
        if (currentFilter) {
            const filterType = currentFilter[1];
            const tabs = filterCard.querySelectorAll('.ios-filter-tab');
            tabs.forEach(tab => {
                if (tab.dataset.filter === filterType) {
                    tab.classList.add('active');
                }
            });
        } else {
            // 默认选中全部
            filterCard.querySelector('[data-filter="all"]').classList.add('active');
        }

        // 绑定筛选器事件
        const filterTabs = filterCard.querySelectorAll('.ios-filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;
                if (filter === 'all') {
                    window.location.href = 'http://m.saowen.net/readstatuses/index/all';
                } else if (filter === 'original') {
                    window.location.href = 'http://m.saowen.net/readstatuses/index/original';
                } else if (filter === 'finished') {
                    window.location.href = 'http://m.saowen.net/readstatuses/index/finished';
                } else if (filter === 'highrate') {
                    window.location.href = 'http://m.saowen.net/readstatuses/index/highrate';
                } else if (filter === 'long') {
                    window.location.href = 'http://m.saowen.net/readstatuses/index/long';
                } else if (filter === 'useful') {
                    window.location.href = 'http://m.saowen.net/readstatuses/index/useful';
                }
            });
        });

        // 转换状态列表
        const statusItems = document.querySelectorAll('.statusitem');
        statusItems.forEach(item => {
            const card = transformStatusItem(item);
            mainContent.appendChild(card);
        });

        // 添加翻页功能
        addPagination(mainContent);
    }

    // 添加翻页功能
    function addPagination(container) {
        // 获取当前页面信息
        const currentPage = getCurrentPage();

        // 创建翻页容器
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'ios-pagination';

        // 上一页按钮
        const prevBtn = document.createElement('button');
        prevBtn.className = 'ios-pagination-btn';
        prevBtn.textContent = '上一页';
        prevBtn.disabled = currentPage <= 1;
        prevBtn.addEventListener('click', () => {
            goToPage(currentPage - 1);
        });
        paginationContainer.appendChild(prevBtn);

        // 页码信息（只显示当前页码）
        const pageInfo = document.createElement('span');
        pageInfo.className = 'ios-pagination-info';
        pageInfo.textContent = `第 ${currentPage} 页`;
        paginationContainer.appendChild(pageInfo);

        // 下一页按钮
        const nextBtn = document.createElement('button');
        nextBtn.className = 'ios-pagination-btn';
        nextBtn.textContent = '下一页';
        nextBtn.disabled = false; // 不禁用，因为我们不知道总页数
        nextBtn.addEventListener('click', () => {
            goToPage(currentPage + 1);
        });
        paginationContainer.appendChild(nextBtn);

        container.appendChild(paginationContainer);
    }

    // 获取当前页码
    function getCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        if (page) return parseInt(page);

        // 尝试从路径中提取页码
        const pathMatch = window.location.pathname.match(/\/page:(\d+)/);
        if (pathMatch) return parseInt(pathMatch[1]);

        return 1;
    }

    // 跳转到指定页
    function goToPage(page) {
        if (page < 1) return;

        const currentUrl = new URL(window.location.href);
        const path = currentUrl.pathname;
        const search = currentUrl.search;

        // 检查是否已经有page参数
        if (path.includes('/page:')) {
            const newPath = path.replace(/\/page:\d+/, `/page:${page}`);
            window.location.href = newPath + search;
        } else {
            // 在路径末尾添加 /page:页码
            const newPath = path + `/page:${page}`;
            window.location.href = newPath + search;
        }
    }

    // 转换状态项
    function transformStatusItem(item) {
        const card = document.createElement('div');
        card.className = 'ios-status-card ios-slide-in-up';

        const title = item.querySelector('.statustitle');
        const content = item.querySelector('.statuscontent');

        // 提取用户信息
        const userLink = title.querySelector('.userlink');
        const userText = userLink ? userLink.textContent.trim() : '匿名用户';
        const userHref = userLink ? userLink.getAttribute('href') : '#';

        // 提取状态动作
        const actionMatch = title.textContent.match(/(想看|在看|看过|力弃)/);
        const action = actionMatch ? actionMatch[1] : '看过';

        // 提取作品信息
        const novelLink = title.querySelector('.novellink');
        const novelTitle = novelLink ? novelLink.textContent.trim() : '未知作品';
        const novelHref = novelLink ? novelLink.getAttribute('href') : '#';

        // 提取作者信息
        const authorLink = title.querySelector('.authorlink');
        const authorName = authorLink ? authorLink.textContent.trim() : '未知作者';

        // 提取评分
        const rateSpan = title.querySelector('.rate');
        let stars = '';
        if (rateSpan) {
            const starSpan = rateSpan.querySelector('.ratestar');
            stars = starSpan ? starSpan.textContent : '';
        }

        // 提取时间
        const timeSpan = title.querySelector('.timestamp');
        const time = timeSpan ? timeSpan.textContent.trim() : '';

        // 提取标签
        const tags = [];
        const tagElements = content.querySelectorAll('.tag');
        tagElements.forEach(tag => {
            tags.push(tag.textContent.trim());
        });

        // 提取评论内容
        const blockquote = content.querySelector('blockquote');
        let reviewText = '';
        if (blockquote) {
            const clone = blockquote.cloneNode(true);
            const editLink = clone.querySelector('.edit-link');
            if (editLink) editLink.remove();
            reviewText = clone.textContent.trim();
        }

        card.innerHTML = `
            <div class="ios-status-header">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; flex-wrap: wrap;">
                        <a href="${userHref}" class="ios-status-user">${userText}</a>
                        <span class="ios-status-action">${action}</span>
                    </div>
                    <a href="${novelHref}" class="ios-status-novel">${novelTitle}</a>
                    <div class="ios-status-author">作者：${authorName}</div>
                    ${stars ? `<div class="ios-status-rating"><span class="ios-status-stars">${stars}</span><span class="ios-status-time">${time}</span></div>` : ''}
                </div>
            </div>
            ${reviewText ? `<div class="ios-status-content">${reviewText}</div>` : ''}
            ${tags.length > 0 ? `<div class="ios-status-tags">${tags.map(tag => `<span class="ios-tag">${tag}</span>`).join('')}</div>` : ''}
        `;

        // 添加卡片点击跳转功能
        card.addEventListener('click', (e) => {
            // 如果点击的是链接，不触发卡片跳转
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            // 跳转到书名链接
            if (novelHref && novelHref !== '#') {
                window.location.href = novelHref;
            }
        });

        return card;
    }

    // 转换作品详情页
    function transformNovelPage() {
        const mainContent = document.querySelector('#main') || document.querySelector('#content');
        if (!mainContent) return;

        // 提取作品信息
        const title = document.querySelector('h1');
        const novelTitle = title ? title.textContent.trim() : '未知作品';
        // 隐藏原始的h1标题
        if (title) {
            title.style.display = 'none';
        }

        const author = document.querySelector('#author');
        const authorName = author ? author.textContent.replace('作者：', '').trim() : '未知作者';
        const authorHref = author ? author.querySelector('a')?.getAttribute('href') : '#';

        // 提取统计信息
        const statusCount = document.querySelector('#status-count');
        let wantCount = 0, ingCount = 0, haveCount = 0, dropCount = 0;
        if (statusCount) {
            const text = statusCount.textContent;
            const wantMatch = text.match(/想看\s*(\d+)/);
            const ingMatch = text.match(/在看\s*(\d+)/);
            const haveMatch = text.match(/看过\s*(\d+)/);
            const dropMatch = text.match(/力弃\s*(\d+)/);
            wantCount = wantMatch ? parseInt(wantMatch[1]) : 0;
            ingCount = ingMatch ? parseInt(ingMatch[1]) : 0;
            haveCount = haveMatch ? parseInt(haveMatch[1]) : 0;
            dropCount = dropMatch ? parseInt(dropMatch[1]) : 0;
        }

        // 提取评分信息
        const rateInfo = document.querySelector('#rate-info');
        let rating = '0.0';
        let ratingCount = 0;
        if (rateInfo) {
            const rateNumber = rateInfo.querySelector('.ratenumber');
            rating = rateNumber ? rateNumber.textContent.trim() : '0.0';
            const countText = rateInfo.textContent.match(/共\s*(\d+)\s*人/);
            ratingCount = countText ? parseInt(countText[1]) : 0;
        }

        // 生成星级Emoji
        function getStarEmoji(rating) {
            const rate = parseFloat(rating);
            if (rate >= 9) return '★★★★★';
            if (rate >= 7) return '★★★★☆';
            if (rate >= 5) return '★★★☆☆';
            if (rate >= 3) return '★★☆☆☆';
            return '★☆☆☆☆';
        }

        // 创建作品头部卡片
        const headerCard = document.createElement('div');
        headerCard.className = 'ios-novel-card ios-scale-in';

        headerCard.innerHTML = `
            <div class="ios-novel-header">
                <h1 class="ios-novel-title">${novelTitle}</h1>
                <div class="ios-novel-author-line">
                    <span class="ios-novel-author-label">作者：</span>
                    <a href="${authorHref}" class="ios-novel-author">${authorName}</a>
                </div>
                <div class="ios-novel-stats">
                    <div class="ios-stat-item">
                        <div class="ios-stat-value">${wantCount}</div>
                        <div class="ios-stat-label">想看</div>
                    </div>
                    <div class="ios-stat-item">
                        <div class="ios-stat-value">${ingCount}</div>
                        <div class="ios-stat-label">在看</div>
                    </div>
                    <div class="ios-stat-item">
                        <div class="ios-stat-value">${haveCount}</div>
                        <div class="ios-stat-label">看过</div>
                    </div>
                    <div class="ios-stat-item">
                        <div class="ios-stat-value">${dropCount}</div>
                        <div class="ios-stat-label">力弃</div>
                    </div>
                </div>
                <div class="ios-novel-rating">
                    <span class="ios-rating-stars">${getStarEmoji(rating)}</span>
                    <span class="ios-rating-score">${rating}</span>
                    <span class="ios-rating-count">${ratingCount}人评价</span>
                </div>
            </div>
        `;
        mainContent.appendChild(headerCard);

        // 创建作品信息卡片
        const infoCard = document.createElement('div');
        infoCard.className = 'ios-info-card ios-slide-in-up';
        infoCard.innerHTML = `
            <div class="ios-info-header">
                <span class="ios-info-title">作品信息</span>
                <button class="ios-info-toggle" id="infoToggle">展开</button>
            </div>
            <div class="ios-info-content collapsed" id="infoContent">
                ${extractNovelInfo()}
            </div>
        `;
        mainContent.appendChild(infoCard);

        // 绑定展开/收起事件
        const infoToggle = document.getElementById('infoToggle');
        const infoContent = document.getElementById('infoContent');
        infoToggle.addEventListener('click', () => {
            infoContent.classList.toggle('collapsed');
            infoToggle.textContent = infoContent.classList.contains('collapsed') ? '展开' : '收起';
        });

        // 创建标签卡片
        const tagsCard = document.createElement('div');
        tagsCard.className = 'ios-tags-card ios-slide-in-up';

        tagsCard.innerHTML = `
            <div class="ios-tags-title">常用标签</div>
            <div class="ios-tags-list">
                ${extractTags()}
            </div>
        `;
        mainContent.appendChild(tagsCard);

        // 创建评论查看按钮
        const reviewBtn = document.createElement('button');
        reviewBtn.className = 'ios-review-btn ios-scale-in';
        reviewBtn.textContent = '查看评论';
        reviewBtn.id = 'iosReviewBtn';

        // 创建评论内容容器
        const reviewContainer = document.createElement('div');
        reviewContainer.id = 'iosReviewContainer';
        reviewContainer.style.cssText = 'display: none;';

        reviewBtn.addEventListener('click', async () => {
            // 获取评论页面链接
            const novelId = window.location.pathname.match(/\/novels\/view\/(\d+)/);
            if (novelId) {
                const reviewUrl = `http://m.saowen.net/readstatuses/novelReviews/${novelId[1]}`;

                // 检查是否已经加载过评论
                if (reviewContainer.style.display === 'none') {
                    reviewContainer.style.display = 'block';
                    reviewBtn.textContent = '收起评论';

                    // 如果还没有加载过评论内容
                    if (!reviewContainer.hasChildNodes()) {
                        reviewContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #8E8E93;">加载中...</div>';

                        try {
                            // 获取评论页面
                            const response = await fetch(reviewUrl);
                            const html = await response.text();

                            // 解析HTML
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');

                            // 提取评论列表
                            const statusItems = doc.querySelectorAll('.statusitem');

                            if (statusItems.length > 0) {
                                reviewContainer.innerHTML = '';

                                statusItems.forEach(item => {
                                    const card = document.createElement('div');
                                    card.className = 'ios-card';

                                    const title = item.querySelector('.statustitle');
                                    const userLink = title.querySelector('.userlink');
                                    const userName = userLink ? userLink.textContent.trim() : '匿名用户';
                                    const userHref = userLink ? userLink.getAttribute('href') : '#';

                                    const actionMatch = title.textContent.match(/(想看|在看|看过|力弃)/);
                                    const action = actionMatch ? actionMatch[1] : '看过';

                                    const rateSpan = title.querySelector('.rate');
                                    let rating = '';
                                    if (rateSpan) {
                                        const starSpan = rateSpan.querySelector('.ratestar');
                                        if (starSpan) {
                                            rating = `<div style="display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                                                <span style="color: #FF9500; font-size: 14px;">${starSpan.textContent.trim()}</span>
                                            </div>`;
                                        }
                                    }

                                    const timeLink = title.querySelector('.timestamp a');
                                    const time = timeLink ? timeLink.textContent.trim() : '';

                                    const content = item.querySelector('.statuscontent');
                                    const blockquote = content.querySelector('blockquote');
                                    let reviewText = '';
                                    if (blockquote) {
                                        const clone = blockquote.cloneNode(true);
                                        const voter = clone.querySelector('.voter');
                                        if (voter) voter.remove();
                                        reviewText = clone.textContent.trim();
                                    }

                                    card.innerHTML = `
                                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                            <a href="${userHref}" style="color: #007AFF; font-weight: 600; text-decoration: none; font-size: 15px;">${userName}</a>
                                            <span style="color: #8E8E93; font-size: 14px; margin-left: 8px;">${action}</span>
                                            <span style="color: #8E8E93; font-size: 13px; margin-left: auto;">${time}</span>
                                        </div>
                                        ${rating}
                                        ${reviewText ? `<div style="background: #F2F2F7; border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 15px; line-height: 1.5;">${reviewText}</div>` : ''}
                                    `;

                                    reviewContainer.appendChild(card);
                                });

                                // 添加评论翻页按钮
                                const paginationContainer = document.createElement('div');
                                paginationContainer.className = 'ios-pagination';
                                paginationContainer.innerHTML = `
                                    <a href="${reviewUrl}" class="ios-pagination-btn" target="_blank">查看全部评论</a>
                                `;
                                reviewContainer.appendChild(paginationContainer);
                            } else {
                                reviewContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #8E8E93;">暂无评论</div>';
                            }
                        } catch (error) {
                            reviewContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #8E8E93;">加载失败，请稍后重试</div>';
                            console.error('加载评论失败:', error);
                        }
                    }
                } else {
                    reviewContainer.style.display = 'none';
                    reviewBtn.textContent = '查看评论';
                }
            }
        });

        mainContent.appendChild(reviewBtn);
        mainContent.appendChild(reviewContainer);

        // 隐藏原有评论区域
        const reviews = document.querySelector('#reviews');
        if (reviews) {
            reviews.style.display = 'none';
            mainContent.appendChild(reviews);
        }
    }

    // 提取作品信息
    function extractNovelInfo() {
        const novelInfo = document.querySelector('#novel-info ul');
        if (!novelInfo) return '';

        const items = [];
        novelInfo.querySelectorAll('li').forEach(li => {
            const text = li.textContent.trim();
            const [label, value] = text.split(' : ');

            // 检查是否有链接
            const link = li.querySelector('a');
            let valueHtml = value || '';

            if (link && value) {
                const linkText = link.textContent.trim();
                const linkHref = link.getAttribute('href');
                valueHtml = `<a href="${linkHref}" style="color: #007AFF; text-decoration: none;">${linkText}</a>`;
            }

            if (label && valueHtml) {
                items.push(`<div class="ios-info-item"><span class="ios-info-label">${label}:</span>${valueHtml}</div>`);
            }
        });

        return items.join('');
    }

    // 提取标签
    function extractTags() {
        const tags = [];
        const tagElements = document.querySelectorAll('.noveltag');
        tagElements.forEach(tag => {
            const link = tag.querySelector('a');
            if (link) {
                tags.push(`<a href="${link.getAttribute('href')}" class="ios-tag-item">${link.textContent.trim()}</a>`);
            }
        });
        return tags.join('');
    }

    // 转换通用页面
    function transformGenericPage() {
        const mainContent = document.querySelector('#main') || document.querySelector('#content');
        if (!mainContent) return;

        // 提取所有内容
        const contentHTML = mainContent.innerHTML;

        // 清空原有内容
        mainContent.innerHTML = '';

        // 创建主容器
        const container = document.createElement('div');
        container.className = 'ios-generic-container';

        // 提取并美化标题
        const h1 = mainContent.querySelector('h1');
        const h2 = mainContent.querySelector('h2');
        const h3 = mainContent.querySelector('h3');

        if (h1 || h2 || h3) {
            const titleCard = document.createElement('div');
            titleCard.className = 'ios-card ios-scale-in';
            let titleHTML = '';
            if (h1) titleHTML += `<h1 style="font-size: 28px; font-weight: 700; margin: 0 0 12px 0; color: #000000;">${h1.textContent.trim()}</h1>`;
            if (h2) titleHTML += `<h2 style="font-size: 22px; font-weight: 600; margin: 0 0 12px 0; color: #000000;">${h2.textContent.trim()}</h2>`;
            if (h3) titleHTML += `<h3 style="font-size: 18px; font-weight: 600; margin: 0; color: #000000;">${h3.textContent.trim()}</h3>`;
            titleCard.innerHTML = titleHTML;
            container.appendChild(titleCard);
        }

        // 提取并美化段落和列表
        const paragraphs = mainContent.querySelectorAll('p');
        const lists = mainContent.querySelectorAll('ul, ol');
        const tables = mainContent.querySelectorAll('table');

        if (paragraphs.length > 0 || lists.length > 0 || tables.length > 0) {
            const contentCard = document.createElement('div');
            contentCard.className = 'ios-card ios-slide-in-up';

            let contentHTML = '';

            // 添加段落
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    contentHTML += `<p style="font-size: 16px; line-height: 1.6; color: #3C3C43; margin: 0 0 16px 0;">${p.innerHTML}</p>`;
                }
            });

            // 添加列表
            lists.forEach(list => {
                const listItems = list.querySelectorAll('li');
                if (listItems.length > 0) {
                    contentHTML += `<ul style="margin: 0 0 16px 0; padding-left: 20px;">`;
                    listItems.forEach(li => {
                        contentHTML += `<li style="font-size: 16px; line-height: 1.6; color: #3C3C43; margin: 0 0 8px 0;">${li.innerHTML}</li>`;
                    });
                    contentHTML += `</ul>`;
                }
            });

            // 添加表格
            tables.forEach(table => {
                const rows = table.querySelectorAll('tr');
                if (rows.length > 0) {
                    contentHTML += `<table style="width: 100%; border-collapse: collapse; margin: 0 0 16px 0;">`;
                    rows.forEach((row, index) => {
                        contentHTML += `<tr style="border-bottom: 1px solid #E5E5EA;">`;
                        const cells = row.querySelectorAll('td, th');
                        cells.forEach(cell => {
                            const isHeader = cell.tagName === 'TH';
                            contentHTML += `<td style="padding: 12px; font-size: 15px; color: ${isHeader ? '#000000' : '#3C3C43'}; font-weight: ${isHeader ? '600' : '400'};">${cell.innerHTML}</td>`;
                        });
                        contentHTML += `</tr>`;
                    });
                    contentHTML += `</table>`;
                }
            });

            contentCard.innerHTML = contentHTML;
            container.appendChild(contentCard);
        }

        // 如果没有提取到任何内容，就简单包装原有内容
        if (container.children.length === 0) {
            const contentCard = document.createElement('div');
            contentCard.className = 'ios-card';
            contentCard.innerHTML = contentHTML;
            container.appendChild(contentCard);
        }

        mainContent.appendChild(container);
    }

    // 转换搜索页
    function transformSearchPage() {
        const mainContent = document.querySelector('#main') || document.querySelector('#content');
        if (!mainContent) return;

        // 先获取需要的数据
        const notice = document.querySelector('#notice');
        const noticeHTML = notice ? notice.innerHTML : '';
        
        const searchInfo = document.querySelector('#searchinfo');
        const searchInfoText = searchInfo ? searchInfo.textContent.trim() : '';
        
        const novelList = document.querySelector('#novel-list');
        const items = novelList ? Array.from(novelList.querySelectorAll('.item')) : [];

        // 清空原有内容（只针对搜索页）
        mainContent.innerHTML = '';

        // 创建搜索栏（保持与首页一致）
        const searchBar = document.createElement('div');
        searchBar.className = 'ios-search-bar ios-scale-in';
        searchBar.innerHTML = `
            <svg style="width: 20px; height: 20px; fill: #8E8E93;" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input type="search" class="ios-search-input" placeholder="搜索作品标题或作者" id="iosSearchInput">
        `;
        mainContent.appendChild(searchBar);

        // 设置当前搜索词
        const urlParams = new URLSearchParams(window.location.search);
        const currentQuery = urlParams.get('q');
        if (currentQuery) {
            const searchInput = document.getElementById('iosSearchInput');
            if (searchInput) {
                searchInput.value = currentQuery;
            }
        }

        // 绑定搜索事件
        const searchInput = document.getElementById('iosSearchInput');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `http://m.saowen.net/novels/search?q=${encodeURIComponent(query)}`;
                }
            }
        });

        // 获取提示信息并整合排序功能
        if (noticeHTML || searchInfoText) {
            const noticeCard = document.createElement('div');
            noticeCard.className = 'ios-card ios-slide-in-up';
            
            let cardContent = '';
            
            if (noticeHTML) {
                cardContent += `<div style="font-size: 14px; color: #8E8E93; line-height: 1.5; margin-bottom: 12px;">${noticeHTML}</div>`;
            }
            
            if (searchInfoText) {
                cardContent += `
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 15px; color: #8E8E93;">${searchInfoText}</span>
                        <button class="ios-sort-toggle-small" id="sortToggle">
                            <span>排序</span>
                            <svg style="width: 14px; height: 14px; fill: #8E8E93; transition: transform 0.3s ease;" id="sortArrow" viewBox="0 0 24 24">
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="ios-sort-options" id="sortOptions">
                        <a href="#" class="ios-sort-btn" data-sort="Novel.gbk_title" data-direction="asc">按标题</a>
                        <a href="#" class="ios-sort-btn" data-sort="Novel.gbk_author" data-direction="asc">按作者笔名</a>
                        <a href="#" class="ios-sort-btn" data-sort="Novel.pseudo_avg" data-direction="desc">按平均分</a>
                        <a href="#" class="ios-sort-btn" data-sort="Novel.rTotal" data-direction="desc">按评价人数</a>
                        <a href="#" class="ios-sort-btn" data-sort="Novel.created" data-direction="desc">按添加时间</a>
                        <a href="#" class="ios-sort-btn" data-sort="Novel.modified" data-direction="desc">按修改时间</a>
                    </div>
                `;
            }
            
            noticeCard.innerHTML = cardContent;
            mainContent.appendChild(noticeCard);

            // 如果有搜索信息，绑定排序事件
            if (searchInfoText) {
                const sortToggle = document.getElementById('sortToggle');
                const sortOptions = document.getElementById('sortOptions');
                const sortArrow = document.getElementById('sortArrow');
                sortToggle.addEventListener('click', () => {
                    sortOptions.classList.toggle('show');
                    sortArrow.style.transform = sortOptions.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
                });

                const sortBtns = sortOptions.querySelectorAll('.ios-sort-btn');
                sortBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const sort = btn.dataset.sort;
                        const direction = btn.dataset.direction;
                        const query = currentQuery || '';
                        window.location.href = `http://m.saowen.net/novels/search/sort:${sort}/direction:${direction}?q=${encodeURIComponent(query)}`;
                    });
                });
            }
        }

        // 转换搜索结果列表
        if (items.length === 0) return;

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'ios-status-card ios-slide-in-up';

            const basicInfo = item.querySelector('.basic-info');
            const novelLink = basicInfo.querySelector('.novellink');
            const novelTitle = novelLink ? novelLink.textContent.trim() : '未知作品';
            const novelHref = novelLink ? novelLink.getAttribute('href') : '#';

            const authorLink = basicInfo.querySelector('.authorlink');
            const authorName = authorLink ? authorLink.textContent.trim() : '未知作者';

            const rateInfo = item.querySelector('.rate-info');
            let rating = '';
            if (rateInfo) {
                const rateStar = rateInfo.querySelector('.ratestar');
                const rateNumber = rateInfo.querySelector('.ratenumber');
                if (rateStar && rateNumber) {
                    rating = `<div style="display: flex; align-items: center; margin-top: 4px;">
                        <span style="color: #FF9500; font-size: 14px; margin-right: 4px;">${rateStar.textContent.trim()}</span>
                        <span style="font-size: 15px; font-weight: 600; color: #000000;">${rateNumber.textContent.trim()}</span>
                    </div>`;
                }
            }

            const extendInfo = item.querySelector('.extend-info');
            let tags = [];
            if (extendInfo) {
                const infoText = extendInfo.textContent.trim();
                // 分割extend-info中的信息
                const parts = infoText.split('/');
                parts.forEach(part => {
                    if (part.trim()) {
                        tags.push(`<span class="ios-tag">${part.trim()}</span>`);
                    }
                });
            }

            const tagInfo = item.querySelector('.tag-info');
            if (tagInfo) {
                const tagLinks = tagInfo.querySelectorAll('.taglink');
                tagLinks.forEach(tag => {
                    tags.push(`<span class="ios-tag">${tag.textContent.trim()}</span>`);
                });
            }

            card.innerHTML = `
                <div class="ios-status-header">
                    <div style="flex: 1;">
                        <a href="${novelHref}" class="ios-status-novel">${novelTitle}</a>
                        <div class="ios-status-author">作者：${authorName}</div>
                        ${rating}
                    </div>
                </div>
                ${tags.length > 0 ? `<div class="ios-status-tags">${tags.join('')}</div>` : ''}
            `;

            // 添加卡片点击跳转功能
            card.addEventListener('click', (e) => {
                // 如果点击的是链接，不触发卡片跳转
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                // 跳转到书名链接
                if (novelHref && novelHref !== '#') {
                    window.location.href = novelHref;
                }
            });

            mainContent.appendChild(card);
        });

        // 添加翻页功能
        addPagination(mainContent);
    }

    // 转换标签搜索页
    function transformTagsSearchPage() {
        const mainContent = document.querySelector('#main') || document.querySelector('#content');
        if (!mainContent) return;

        // 先获取需要的数据
        const searchInfo = document.querySelector('#searchinfo');
        const searchInfoText = searchInfo ? searchInfo.textContent.trim() : '';
        
        const novelList = document.querySelector('#novel-list');
        const items = novelList ? Array.from(novelList.querySelectorAll('.item')) : [];

        // 清空原有内容
        mainContent.innerHTML = '';

        // 创建搜索栏
        const searchBar = document.createElement('div');
        searchBar.className = 'ios-search-bar ios-scale-in';
        searchBar.innerHTML = `
            <svg style="width: 20px; height: 20px; fill: #8E8E93;" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input type="search" class="ios-search-input" placeholder="搜索标签" id="iosSearchInput">
        `;
        mainContent.appendChild(searchBar);

        // 设置当前搜索词
        const urlParams = new URLSearchParams(window.location.search);
        const currentQuery = urlParams.get('search');
        if (currentQuery) {
            const searchInput = document.getElementById('iosSearchInput');
            if (searchInput) {
                searchInput.value = currentQuery;
            }
        }

        // 绑定搜索事件
        const searchInput = document.getElementById('iosSearchInput');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `http://m.saowen.net/noveltags/search?search=${encodeURIComponent(query)}`;
                }
            }
        });

        // 获取搜索信息
        if (searchInfoText) {
            const infoCard = document.createElement('div');
            infoCard.className = 'ios-card';
            infoCard.innerHTML = `<div style="font-size: 15px; color: #8E8E93; text-align: center;">${searchInfoText}</div>`;
            mainContent.appendChild(infoCard);
        }

        // 转换搜索结果列表
        if (items.length === 0) return;

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'ios-status-card ios-slide-in-up';

            const basicInfo = item.querySelector('.basic-info');
            const novelLink = basicInfo.querySelector('.novellink');
            const novelTitle = novelLink ? novelLink.textContent.trim() : '未知作品';
            const novelHref = novelLink ? novelLink.getAttribute('href') : '#';

            const authorLink = basicInfo.querySelector('.authorlink');
            const authorName = authorLink ? authorLink.textContent.trim() : '未知作者';

            const rateInfo = item.querySelector('.rate-info');
            let rating = '';
            if (rateInfo) {
                const rateStar = rateInfo.querySelector('.ratestar');
                const rateNumber = rateInfo.querySelector('.ratenumber');
                if (rateStar && rateNumber) {
                    rating = `<div style="display: flex; align-items: center; margin-top: 4px;">
                        <span style="color: #FF9500; font-size: 14px; margin-right: 4px;">${rateStar.textContent.trim()}</span>
                        <span style="font-size: 15px; font-weight: 600; color: #000000;">${rateNumber.textContent.trim()}</span>
                    </div>`;
                }
            }

            const extendInfo = item.querySelector('.extend-info');
            let tags = [];
            if (extendInfo) {
                const infoText = extendInfo.textContent.trim();
                const parts = infoText.split('/');
                parts.forEach(part => {
                    if (part.trim()) {
                        tags.push(`<span class="ios-tag">${part.trim()}</span>`);
                    }
                });
            }

            const tagInfo = item.querySelector('.tag-info');
            if (tagInfo) {
                const tagLinks = tagInfo.querySelectorAll('.taglink');
                tagLinks.forEach(tag => {
                    tags.push(`<span class="ios-tag">${tag.textContent.trim()}</span>`);
                });
            }

            card.innerHTML = `
                <div class="ios-status-header">
                    <div style="flex: 1;">
                        <a href="${novelHref}" class="ios-status-novel">${novelTitle}</a>
                        <div class="ios-status-author">作者：${authorName}</div>
                        ${rating}
                    </div>
                </div>
                ${tags.length > 0 ? `<div class="ios-status-tags">${tags.join('')}</div>` : ''}
            `;

            // 添加卡片点击跳转功能
            card.addEventListener('click', (e) => {
                // 如果点击的是链接，不触发卡片跳转
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                // 跳转到书名链接
                if (novelHref && novelHref !== '#') {
                    window.location.href = novelHref;
                }
            });

            mainContent.appendChild(card);
        });

        // 添加翻页功能
        addPagination(mainContent);
    }

    // 转换评论页
    function transformReviewPage() {
        const mainContent = document.querySelector('#main') || document.querySelector('#content');
        if (!mainContent) return;

        // 先获取所有需要的数据
        const h1 = mainContent.querySelector('h1');
        const titleText = h1 ? h1.textContent.trim() : '';

        const statusList = document.querySelector('#status-list');
        const commentCount = statusList && statusList.previousElementSibling;
        const countText = commentCount ? commentCount.textContent.trim() : '';

        // 转换评论列表
        const statusItems = Array.from(document.querySelectorAll('.statusitem'));
        const reviewsData = statusItems.map(item => {
            const title = item.querySelector('.statustitle');
            const userLink = title.querySelector('.userlink');
            const userName = userLink ? userLink.textContent.trim() : '匿名用户';
            const userHref = userLink ? userLink.getAttribute('href') : '#';

            const actionMatch = title.textContent.match(/(想看|在看|看过|力弃)/);
            const action = actionMatch ? actionMatch[1] : '看过';

            const rateSpan = title.querySelector('.rate');
            let rating = '';
            if (rateSpan) {
                const starSpan = rateSpan.querySelector('.ratestar');
                if (starSpan) {
                    rating = `<div style="display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                        <span style="color: #FF9500; font-size: 14px;">${starSpan.textContent.trim()}</span>
                    </div>`;
                }
            }

            const timeLink = title.querySelector('.timestamp a');
            const time = timeLink ? timeLink.textContent.trim() : '';

            const content = item.querySelector('.statuscontent');
            const blockquote = content.querySelector('blockquote');
            let reviewText = '';
            if (blockquote) {
                const clone = blockquote.cloneNode(true);
                const voter = clone.querySelector('.voter');
                if (voter) voter.remove();
                reviewText = clone.textContent.trim();
            }

            const voter = content.querySelector('.voter');
            let voteButtons = '';
            if (voter) {
                const posVote = voter.querySelector('.vote.pos');
                const negVote = voter.querySelector('.vote.neg');
                voteButtons = `<div style="display: flex; gap: 12px; margin-top: 12px;">
                    <a href="${posVote ? posVote.getAttribute('href') : '#'}" style="color: #007AFF; font-size: 14px; text-decoration: none;">有用</a>
                    <a href="${negVote ? negVote.getAttribute('href') : '#'}" style="color: #8E8E93; font-size: 14px; text-decoration: none;">无用</a>
                </div>`;
            }

            return {
                cardHTML: `
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <a href="${userHref}" style="color: #007AFF; font-weight: 600; text-decoration: none; font-size: 15px;">${userName}</a>
                        <span style="color: #8E8E93; font-size: 14px; margin-left: 8px;">${action}</span>
                        <span style="color: #8E8E93; font-size: 13px; margin-left: auto;">${time}</span>
                    </div>
                    ${rating}
                    ${reviewText ? `<div style="background: #F2F2F7; border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 15px; line-height: 1.5;">${reviewText}</div>` : ''}
                    ${voteButtons}
                `
            };
        });

        // 清空原有内容
        mainContent.innerHTML = '';

        // 添加标题卡片
        if (titleText) {
            const titleCard = document.createElement('div');
            titleCard.className = 'ios-card ios-scale-in';
            titleCard.innerHTML = `<div style="font-size: 20px; font-weight: 700;">${titleText}</div>`;
            mainContent.appendChild(titleCard);
        }

        // 添加评论数卡片
        if (countText) {
            const countCard = document.createElement('div');
            countCard.className = 'ios-card ios-slide-in-up';
            countCard.innerHTML = `<div style="font-size: 15px; color: #8E8E93;">${countText}</div>`;
            mainContent.appendChild(countCard);
        }

        // 添加评论列表
        reviewsData.forEach(review => {
            const card = document.createElement('div');
            card.className = 'ios-card ios-slide-in-up';
            card.innerHTML = review.cardHTML;
            mainContent.appendChild(card);
        });

        // 添加翻页功能
        addPagination(mainContent);
    }

    // 转换作者信息页
    function transformAuthorPage() {
        const mainContent = document.querySelector('#main') || document.querySelector('#content');
        if (!mainContent) return;

        // 先获取需要的数据
        const authorInfo = document.querySelector('#author-info');
        const intro = authorInfo ? authorInfo.querySelector('#intro') : null;
        const introHTML = intro ? intro.innerHTML : '';

        const novelList = document.querySelector('#novel-list');
        const items = novelList ? Array.from(novelList.querySelectorAll('.item')) : [];

        // 清空原有内容
        mainContent.innerHTML = '';

        // 创建作者信息卡片
        if (introHTML) {
            const infoCard = document.createElement('div');
            infoCard.className = 'ios-card ios-scale-in';
            infoCard.innerHTML = `<div style="font-size: 15px; line-height: 1.6; color: #3C3C43;">${introHTML}</div>`;
            mainContent.appendChild(infoCard);
        }

        // 转换作品列表
        if (items.length > 0) {
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'ios-status-card ios-slide-in-up';

                const basicInfo = item.querySelector('.basic-info');
                const novelLink = basicInfo.querySelector('.novellink');
                const novelTitle = novelLink ? novelLink.textContent.trim() : '未知作品';
                const novelHref = novelLink ? novelLink.getAttribute('href') : '#';

                const rateInfo = item.querySelector('.rate-info');
                let rating = '';
                if (rateInfo) {
                    const rateStar = rateInfo.querySelector('.ratestar');
                    const rateNumber = rateInfo.querySelector('.ratenumber');
                    if (rateStar && rateNumber) {
                        rating = `<div style="display: flex; align-items: center; margin-top: 4px;">
                            <span style="color: #FF9500; font-size: 14px; margin-right: 4px;">${rateStar.textContent.trim()}</span>
                            <span style="font-size: 15px; font-weight: 600; color: #000000;">${rateNumber.textContent.trim()}</span>
                        </div>`;
                    }
                }

                const extendInfo = item.querySelector('.extend-info');
                let tags = [];
                if (extendInfo) {
                    const infoText = extendInfo.textContent.trim();
                    const parts = infoText.split('/');
                    parts.forEach(part => {
                        if (part.trim()) {
                            tags.push(`<span class="ios-tag">${part.trim()}</span>`);
                        }
                    });
                }

                const tagInfo = item.querySelector('.tag-info');
                if (tagInfo) {
                    const tagLinks = tagInfo.querySelectorAll('.taglink');
                    tagLinks.forEach(tag => {
                        tags.push(`<span class="ios-tag">${tag.textContent.trim()}</span>`);
                    });
                }

                card.innerHTML = `
                    <div class="ios-status-header">
                        <div style="flex: 1;">
                            <a href="${novelHref}" class="ios-status-novel">${novelTitle}</a>
                            ${rating}
                        </div>
                    </div>
                    ${tags.length > 0 ? `<div class="ios-status-tags">${tags.join('')}</div>` : ''}
                `;

                // 添加卡片点击跳转功能
                card.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A' || e.target.closest('a')) {
                        return;
                    }
                    if (novelHref && novelHref !== '#') {
                        window.location.href = novelHref;
                    }
                });

                mainContent.appendChild(card);
            });
        }

        // 添加翻页功能
        addPagination(mainContent);
    }

    // 添加滚动监听
    function addScrollListener() {
        let lastScrollTop = 0;
        const header = document.getElementById('iosHeader');
        const scrollThreshold = 10;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
                if (scrollTop > lastScrollTop && scrollTop > 88) {
                    // 向下滚动，隐藏顶栏
                    header.classList.add('hidden');
                } else {
                    // 向上滚动，显示顶栏
                    header.classList.remove('hidden');
                }
                lastScrollTop = scrollTop;
            }
        }, { passive: true });
    }

    // 初始化
    init();
})();