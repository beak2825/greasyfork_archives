// ==UserScript==
// @name         Kornet Panel
// @namespace    kornet.panel.ui
// @version      5.1
// @description  Kornet panel with Apple-style controls, pages, animated minimize, and Goruda V2 theme
// @match        https://kornet.lat/*
// @match        https://www.kornet.lat/*
// @match        https://www.kornet.lat/games*
// @match        https://www.kornet.lat/catalog*
// @match        https://www.kornet.lat/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562798/Kornet%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/562798/Kornet%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Загружаем CSS ресурсы
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
        }
    `);

    // Основные CSS стили для GUI с темой Goruda V2
    GM_addStyle(`
        :root {
            --goruda-primary: #1a1a2e;
            --goruda-secondary: #16213e;
            --goruda-accent: #00adb5;
            --goruda-accent-hover: #009199;
            --goruda-accent-light: rgba(0, 173, 181, 0.1);
            --goruda-danger: #ff2e63;
            --goruda-success: #00b894;
            --goruda-warning: #fdcb6e;
            --goruda-info: #0984e3;
            
            --goruda-surface: rgba(255, 255, 255, 0.08);
            --goruda-surface-hover: rgba(255, 255, 255, 0.12);
            --goruda-border: rgba(255, 255, 255, 0.15);
            --goruda-border-hover: rgba(255, 255, 255, 0.25);
            
            --goruda-text-primary: #ffffff;
            --goruda-text-secondary: rgba(255, 255, 255, 0.7);
            --goruda-text-tertiary: rgba(255, 255, 255, 0.5);
            
            --goruda-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            --goruda-accent-gradient: linear-gradient(135deg, #00adb5 0%, #0097a7 100%);
            --goruda-glass: rgba(26, 26, 46, 0.85);
            --goruda-glass-border: rgba(255, 255, 255, 0.08);
            
            --goruda-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.15);
            --goruda-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.25);
            --goruda-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.35);
            --goruda-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            
            --goruda-border-radius-sm: 8px;
            --goruda-border-radius: 12px;
            --goruda-border-radius-lg: 16px;
            --goruda-border-radius-xl: 24px;
            
            --goruda-transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            --goruda-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --goruda-transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            
            --goruda-blur: blur(20px);
            --goruda-blur-heavy: blur(30px);
        }
        
        /* Apple-style controls */
        .goruda-apple-controls {
            display: flex;
            gap: 8px;
            margin-left: auto;
        }
        
        .goruda-control-btn {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .goruda-control-btn:hover {
            transform: scale(1.1);
        }
        
        .goruda-control-btn.close {
            background: #ff5f57;
        }
        
        .goruda-control-btn.close:hover {
            background: #ff3b30;
            box-shadow: 0 0 8px rgba(255, 59, 48, 0.4);
        }
        
        .goruda-control-btn.minimize {
            background: #ffbd2e;
        }
        
        .goruda-control-btn.minimize:hover {
            background: #ffa800;
            box-shadow: 0 0 8px rgba(255, 168, 0, 0.4);
        }
        
        .goruda-control-btn.maximize {
            background: #28ca42;
        }
        
        .goruda-control-btn.maximize:hover {
            background: #00b300;
            box-shadow: 0 0 8px rgba(0, 179, 0, 0.4);
        }
        
        .goruda-control-btn.close::before {
            content: "×";
            font-size: 9px;
            color: rgba(0, 0, 0, 0.7);
            font-weight: bold;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .goruda-control-btn.close:hover::before {
            opacity: 1;
        }
        
        .goruda-control-btn.minimize::before {
            content: "—";
            font-size: 9px;
            color: rgba(0, 0, 0, 0.7);
            font-weight: bold;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .goruda-control-btn.minimize:hover::before {
            opacity: 1;
        }
        
        /* Основной контейнер */
        .kornet-goruda-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000000;
            width: 380px;
            min-height: 500px;
            background: var(--goruda-glass);
            backdrop-filter: var(--goruda-blur);
            -webkit-backdrop-filter: var(--goruda-blur);
            border: 1px solid var(--goruda-glass-border);
            border-radius: var(--goruda-border-radius-lg);
            box-shadow: var(--goruda-shadow-xl);
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
            transition: all var(--goruda-transition);
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
            animation: gorudaEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes gorudaEntrance {
            0% {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .kornet-goruda-panel.goruda-minimized {
            width: 200px;
            min-height: 60px;
            height: 60px;
            animation: gorudaMinimize 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes gorudaMinimize {
            0% {
                width: 380px;
                min-height: 500px;
                height: auto;
            }
            100% {
                width: 200px;
                min-height: 60px;
                height: 60px;
            }
        }
        
        @keyframes gorudaExpand {
            0% {
                width: 200px;
                min-height: 60px;
                height: 60px;
            }
            100% {
                width: 380px;
                min-height: 500px;
                height: auto;
            }
        }
        
        .kornet-goruda-panel:hover {
            box-shadow: var(--goruda-shadow-xl), 0 0 60px rgba(0, 173, 181, 0.15);
            border-color: rgba(255, 255, 255, 0.12);
        }
        
        /* Header */
        .goruda-header {
            padding: 18px 24px;
            background: linear-gradient(180deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.7) 100%);
            border-bottom: 1px solid var(--goruda-border);
            cursor: move;
            user-select: none;
            display: flex;
            align-items: center;
            transition: all var(--goruda-transition);
        }
        
        .kornet-goruda-panel.goruda-minimized .goruda-header {
            border-bottom: none;
        }
        
        .goruda-header:hover {
            background: linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.8) 100%);
        }
        
        .goruda-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--goruda-text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: -0.01em;
        }
        
        .goruda-title-icon {
            width: 24px;
            height: 24px;
            background: var(--goruda-accent-gradient);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
        
        .goruda-subtitle {
            font-size: 12px;
            color: var(--goruda-text-tertiary);
            margin-left: 8px;
            font-weight: 400;
        }
        
        /* Body */
        .goruda-body {
            padding: 0;
            max-height: 600px;
            overflow-y: auto;
            transition: all var(--goruda-transition);
        }
        
        .kornet-goruda-panel.goruda-minimized .goruda-body {
            display: none;
        }
        
        .goruda-body::-webkit-scrollbar {
            width: 8px;
        }
        
        .goruda-body::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
        }
        
        .goruda-body::-webkit-scrollbar-thumb {
            background: var(--goruda-surface);
            border-radius: 4px;
            border: 2px solid transparent;
            background-clip: padding-box;
        }
        
        .goruda-body::-webkit-scrollbar-thumb:hover {
            background: var(--goruda-surface-hover);
        }
        
        /* Navigation Tabs */
        .goruda-nav-tabs {
            display: flex;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid var(--goruda-border);
            padding: 0 16px;
        }
        
        .goruda-nav-tab {
            padding: 14px 20px;
            font-size: 13px;
            font-weight: 500;
            color: var(--goruda-text-secondary);
            cursor: pointer;
            position: relative;
            transition: all var(--goruda-transition-fast);
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 2px solid transparent;
        }
        
        .goruda-nav-tab:hover {
            color: var(--goruda-text-primary);
            background: rgba(255, 255, 255, 0.03);
        }
        
        .goruda-nav-tab.active {
            color: var(--goruda-accent);
            border-bottom-color: var(--goruda-accent);
        }
        
        .goruda-nav-tab i {
            font-size: 14px;
            width: 16px;
            text-align: center;
        }
        
        /* Tab Content */
        .goruda-tab-content {
            display: none;
            padding: 24px;
            animation: gorudaFadeIn 0.3s ease;
        }
        
        @keyframes gorudaFadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .goruda-tab-content.active {
            display: block;
        }
        
        /* Sections */
        .goruda-section {
            background: var(--goruda-surface);
            border: 1px solid var(--goruda-border);
            border-radius: var(--goruda-border-radius);
            padding: 20px;
            margin-bottom: 20px;
            transition: all var(--goruda-transition);
        }
        
        .goruda-section:hover {
            border-color: var(--goruda-border-hover);
            box-shadow: var(--goruda-shadow-md);
            transform: translateY(-1px);
        }
        
        .goruda-section-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--goruda-text-primary);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: -0.01em;
        }
        
        .goruda-section-title i {
            color: var(--goruda-accent);
            width: 16px;
            text-align: center;
        }
        
        /* Widgets Grid */
        .goruda-widgets-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .goruda-widget {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--goruda-border);
            border-radius: var(--goruda-border-radius);
            padding: 16px;
            cursor: move;
            transition: all var(--goruda-transition);
            position: relative;
            overflow: hidden;
        }
        
        .goruda-widget::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--goruda-accent);
            transform: scaleX(0);
            transition: transform var(--goruda-transition);
        }
        
        .goruda-widget:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--goruda-border-hover);
            transform: translateY(-2px);
            box-shadow: var(--goruda-shadow-md);
        }
        
        .goruda-widget:hover::before {
            transform: scaleX(1);
        }
        
        .goruda-widget.dragging {
            opacity: 0.6;
            transform: rotate(2deg) scale(0.98);
            box-shadow: var(--goruda-shadow-lg);
        }
        
        .goruda-widget-icon {
            width: 32px;
            height: 32px;
            background: var(--goruda-accent-gradient);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            color: white;
            font-size: 14px;
        }
        
        .goruda-widget-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--goruda-text-primary);
            margin-bottom: 6px;
        }
        
        .goruda-widget-desc {
            font-size: 11px;
            color: var(--goruda-text-tertiary);
            line-height: 1.4;
        }
        
        /* Dashboard */
        .goruda-dashboard {
            min-height: 300px;
            background: rgba(0, 0, 0, 0.15);
            border: 2px dashed var(--goruda-border);
            border-radius: var(--goruda-border-radius);
            padding: 20px;
            transition: all var(--goruda-transition);
            position: relative;
        }
        
        .goruda-dashboard.active-drop {
            border-color: var(--goruda-accent);
            background: rgba(0, 173, 181, 0.05);
            border-style: solid;
        }
        
        .goruda-dashboard::before {
            content: 'Перетащите виджеты сюда';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--goruda-text-tertiary);
            font-size: 14px;
            pointer-events: none;
            opacity: 0.5;
        }
        
        .goruda-dashboard:not(:empty)::before {
            display: none;
        }
        
        /* Dashboard Widget Items */
        .goruda-dashboard-widget {
            background: var(--goruda-surface);
            border: 1px solid var(--goruda-border);
            border-radius: var(--goruda-border-radius);
            padding: 16px;
            margin-bottom: 12px;
            cursor: move;
            transition: all var(--goruda-transition);
        }
        
        .goruda-dashboard-widget:hover {
            border-color: var(--goruda-border-hover);
            box-shadow: var(--goruda-shadow-sm);
            transform: translateY(-1px);
        }
        
        .goruda-dashboard-widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .goruda-dashboard-widget-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--goruda-text-primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .goruda-dashboard-widget-remove {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: rgba(255, 46, 99, 0.1);
            border: 1px solid rgba(255, 46, 99, 0.2);
            color: var(--goruda-danger);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            transition: all var(--goruda-transition-fast);
        }
        
        .goruda-dashboard-widget-remove:hover {
            background: var(--goruda-danger);
            color: white;
            transform: rotate(90deg);
        }
        
        /* Settings */
        .goruda-setting {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        
        .goruda-setting:last-child {
            border-bottom: none;
        }
        
        .goruda-setting-label {
            font-size: 13px;
            color: var(--goruda-text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .goruda-setting-label i {
            color: var(--goruda-accent);
            width: 16px;
            text-align: center;
        }
        
        /* Goruda Toggle Switch */
        .goruda-toggle {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }
        
        .goruda-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .goruda-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.1);
            transition: .4s;
            border-radius: 34px;
        }
        
        .goruda-toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        input:checked + .goruda-toggle-slider {
            background-color: var(--goruda-accent);
        }
        
        input:checked + .goruda-toggle-slider:before {
            transform: translateX(20px);
        }
        
        /* Buttons */
        .goruda-btn {
            background: var(--goruda-accent-gradient);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--goruda-border-radius);
            font-weight: 500;
            font-size: 13px;
            cursor: pointer;
            transition: all var(--goruda-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            letter-spacing: 0.01em;
        }
        
        .goruda-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 173, 181, 0.3);
        }
        
        .goruda-btn:active {
            transform: translateY(0);
        }
        
        .goruda-btn-secondary {
            background: var(--goruda-surface);
            color: var(--goruda-text-primary);
            border: 1px solid var(--goruda-border);
        }
        
        .goruda-btn-secondary:hover {
            background: var(--goruda-surface-hover);
            border-color: var(--goruda-border-hover);
            box-shadow: var(--goruda-shadow-md);
        }
        
        /* Search */
        .goruda-search-container {
            position: relative;
            margin-bottom: 20px;
        }
        
        .goruda-search {
            width: 100%;
            padding: 12px 16px 12px 44px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--goruda-border);
            border-radius: var(--goruda-border-radius);
            color: var(--goruda-text-primary);
            font-size: 13px;
            transition: all var(--goruda-transition-fast);
        }
        
        .goruda-search:focus {
            outline: none;
            border-color: var(--goruda-accent);
            box-shadow: 0 0 0 3px rgba(0, 173, 181, 0.1);
            background: rgba(255, 255, 255, 0.08);
        }
        
        .goruda-search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--goruda-text-tertiary);
            font-size: 14px;
        }
        
        /* Stats Cards */
        .goruda-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .goruda-stat-card {
            background: var(--goruda-surface);
            border: 1px solid var(--goruda-border);
            border-radius: var(--goruda-border-radius);
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all var(--goruda-transition);
        }
        
        .goruda-stat-card:hover {
            border-color: var(--goruda-border-hover);
            transform: translateY(-2px);
        }
        
        .goruda-stat-icon {
            width: 40px;
            height: 40px;
            background: var(--goruda-accent-gradient);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
        }
        
        .goruda-stat-info h3 {
            font-size: 18px;
            font-weight: 700;
            color: var(--goruda-text-primary);
            margin: 0;
            letter-spacing: -0.02em;
        }
        
        .goruda-stat-info p {
            font-size: 11px;
            color: var(--goruda-text-tertiary);
            margin: 4px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        /* Color Picker */
        .goruda-color-picker {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }
        
        .goruda-color-option {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all var(--goruda-transition-fast);
        }
        
        .goruda-color-option.active {
            border-color: white;
            transform: scale(1.1);
            box-shadow: 0 0 0 2px var(--goruda-accent);
        }
        
        /* Notification */
        .goruda-notification {
            position: fixed;
            top: 24px;
            right: 420px;
            z-index: 1000001;
            background: var(--goruda-glass);
            backdrop-filter: var(--goruda-blur);
            -webkit-backdrop-filter: var(--goruda-blur);
            border-left: 4px solid var(--goruda-accent);
            padding: 16px 20px;
            border-radius: var(--goruda-border-radius);
            box-shadow: var(--goruda-shadow-xl);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(calc(100% + 20px));
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 320px;
        }
        
        .goruda-notification.show {
            transform: translateX(0);
        }
        
        .goruda-notification-icon {
            width: 28px;
            height: 28px;
            background: var(--goruda-accent-gradient);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
        
        .goruda-notification-content {
            flex: 1;
        }
        
        .goruda-notification-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--goruda-text-primary);
            margin-bottom: 2px;
        }
        
        .goruda-notification-message {
            font-size: 12px;
            color: var(--goruda-text-secondary);
        }
        
        /* Minimized State */
        .goruda-minimized-content {
            display: none;
            padding: 0 24px;
            align-items: center;
            height: 60px;
        }
        
        .kornet-goruda-panel.goruda-minimized .goruda-minimized-content {
            display: flex;
        }
        
        .goruda-minimized-stats {
            display: flex;
            gap: 20px;
            align-items: center;
            width: 100%;
        }
        
        .goruda-minimized-stat {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .goruda-minimized-stat i {
            color: var(--goruda-accent);
            font-size: 12px;
        }
        
        .goruda-minimized-stat span {
            font-size: 12px;
            color: var(--goruda-text-secondary);
        }
        
        .goruda-minimized-stat strong {
            font-size: 14px;
            color: var(--goruda-text-primary);
            font-weight: 600;
        }
    `);

    // Основной класс для управления панелью
    class KornetGorudaPanel {
        constructor() {
            this.widgets = [];
            this.dashboardWidgets = [];
            this.settings = {};
            this.isMinimized = false;
            this.position = { x: 20, y: 20 };
            this.dragOffset = { x: 0, y: 0 };
            this.isDragging = false;
            this.init();
        }

        init() {
            this.loadSettings();
            this.createPanel();
            this.setupDragAndDrop();
            this.setupEventListeners();
            this.loadDashboardWidgets();
            this.injectEnhancements();
        }

        createPanel() {
            this.panel = document.createElement('div');
            this.panel.className = 'kornet-goruda-panel';
            this.panel.style.left = `${this.position.x}px`;
            this.panel.style.top = `${this.position.y}px`;

            this.panel.innerHTML = `
                <div class="goruda-header" id="goruda-drag-handle">
                    <div class="goruda-title">
                        <div class="goruda-title-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <div>
                            Kornet Panel
                            <span class="goruda-subtitle">Goruda V2 Theme</span>
                        </div>
                    </div>
                    <div class="goruda-apple-controls">
                        <button class="goruda-control-btn close" title="Close">
                            <i class="fas fa-times"></i>
                        </button>
                        <button class="goruda-control-btn minimize" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="goruda-control-btn maximize" title="Expand">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
                
                <div class="goruda-minimized-content">
                    <div class="goruda-minimized-stats">
                        <div class="goruda-minimized-stat">
                            <i class="fas fa-wifi"></i>
                            <span>Status: <strong>Online</strong></span>
                        </div>
                        <div class="goruda-minimized-stat">
                            <i class="fas fa-clock"></i>
                            <span>Active: <strong>24/7</strong></span>
                        </div>
                        <div class="goruda-minimized-stat">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secured</span>
                        </div>
                    </div>
                </div>
                
                <div class="goruda-body">
                    <div class="goruda-nav-tabs">
                        <div class="goruda-nav-tab active" data-tab="dashboard">
                            <i class="fas fa-th-large"></i>
                            Dashboard
                        </div>
                        <div class="goruda-nav-tab" data-tab="widgets">
                            <i class="fas fa-cube"></i>
                            Widgets
                        </div>
                        <div class="goruda-nav-tab" data-tab="settings">
                            <i class="fas fa-sliders-h"></i>
                            Settings
                        </div>
                        <div class="goruda-nav-tab" data-tab="stats">
                            <i class="fas fa-chart-bar"></i>
                            Stats
                        </div>
                    </div>
                    
                    <div class="goruda-tab-content active" id="tab-dashboard">
                        <div class="goruda-search-container">
                            <i class="fas fa-search goruda-search-icon"></i>
                            <input type="text" class="goruda-search" placeholder="Search widgets..." id="goruda-search">
                        </div>
                        
                        <div class="goruda-section">
                            <div class="goruda-section-title">
                                <i class="fas fa-tachometer-alt"></i>
                                Quick Stats
                            </div>
                            <div class="goruda-stats-grid">
                                <div class="goruda-stat-card">
                                    <div class="goruda-stat-icon">
                                        <i class="fas fa-eye"></i>
                                    </div>
                                    <div class="goruda-stat-info">
                                        <h3 id="views-count">1,247</h3>
                                        <p>Views Today</p>
                                    </div>
                                </div>
                                <div class="goruda-stat-card">
                                    <div class="goruda-stat-icon">
                                        <i class="fas fa-user-clock"></i>
                                    </div>
                                    <div class="goruda-stat-info">
                                        <h3 id="online-count">84</h3>
                                        <p>Online Now</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="goruda-section">
                            <div class="goruda-section-title">
                                <i class="fas fa-layer-group"></i>
                                Dashboard
                            </div>
                            <div class="goruda-dashboard" id="goruda-dashboard"></div>
                        </div>
                    </div>
                    
                    <div class="goruda-tab-content" id="tab-widgets">
                        <div class="goruda-section">
                            <div class="goruda-section-title">
                                <i class="fas fa-star"></i>
                                Available Widgets
                            </div>
                            <div class="goruda-widgets-grid" id="widget-library">
                                ${this.getWidgetsHTML()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="goruda-tab-content" id="tab-settings">
                        <div class="goruda-section">
                            <div class="goruda-section-title">
                                <i class="fas fa-palette"></i>
                                Appearance
                            </div>
                            <div class="goruda-setting">
                                <div class="goruda-setting-label">
                                    <i class="fas fa-moon"></i>
                                    Dark Mode
                                </div>
                                <label class="goruda-toggle">
                                    <input type="checkbox" id="dark-mode" checked>
                                    <span class="goruda-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="goruda-setting">
                                <div class="goruda-setting-label">
                                    <i class="fas fa-bolt"></i>
                                    Animations
                                </div>
                                <label class="goruda-toggle">
                                    <input type="checkbox" id="animations" checked>
                                    <span class="goruda-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="goruda-setting">
                                <div class="goruda-setting-label">
                                    <i class="fas fa-paint-brush"></i>
                                    Theme Color
                                </div>
                                <div class="goruda-color-picker">
                                    <div class="goruda-color-option active" style="background: #00adb5;" data-color="#00adb5"></div>
                                    <div class="goruda-color-option" style="background: #ff2e63;" data-color="#ff2e63"></div>
                                    <div class="goruda-color-option" style="background: #00b894;" data-color="#00b894"></div>
                                    <div class="goruda-color-option" style="background: #0984e3;" data-color="#0984e3"></div>
                                    <div class="goruda-color-option" style="background: #fdcb6e;" data-color="#fdcb6e"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="goruda-section">
                            <div class="goruda-section-title">
                                <i class="fas fa-cogs"></i>
                                Features
                            </div>
                            <div class="goruda-setting">
                                <div class="goruda-setting-label">
                                    <i class="fas fa-shield-alt"></i>
                                    Ad Blocker
                                </div>
                                <label class="goruda-toggle">
                                    <input type="checkbox" id="ad-blocker" checked>
                                    <span class="goruda-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="goruda-setting">
                                <div class="goruda-setting-label">
                                    <i class="fas fa-rocket"></i>
                                    Turbo Mode
                                </div>
                                <label class="goruda-toggle">
                                    <input type="checkbox" id="turbo-mode">
                                    <span class="goruda-toggle-slider"></span>
                                </label>
                            </div>
                            <div class="goruda-setting">
                                <div class="goruda-setting-label">
                                    <i class="fas fa-bell"></i>
                                    Notifications
                                </div>
                                <label class="goruda-toggle">
                                    <input type="checkbox" id="notifications" checked>
                                    <span class="goruda-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <button class="goruda-btn" id="save-settings">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                        <button class="goruda-btn goruda-btn-secondary" id="reset-settings">
                            <i class="fas fa-redo"></i> Reset to Defaults
                        </button>
                    </div>
                    
                    <div class="goruda-tab-content" id="tab-stats">
                        <div class="goruda-section">
                            <div class="goruda-section-title">
                                <i class="fas fa-chart-line"></i>
                                Performance
                            </div>
                            <div class="goruda-stats-grid">
                                <div class="goruda-stat-card">
                                    <div class="goruda-stat-icon">
                                        <i class="fas fa-microchip"></i>
                                    </div>
                                    <div class="goruda-stat-info">
                                        <h3 id="cpu-usage">12%</h3>
                                        <p>CPU Usage</p>
                                    </div>
                                </div>
                                <div class="goruda-stat-card">
                                    <div class="goruda-stat-icon">
                                        <i class="fas fa-memory"></i>
                                    </div>
                                    <div class="goruda-stat-info">
                                        <h3 id="memory-usage">245MB</h3>
                                        <p>Memory</p>
                                    </div>
                                </div>
                                <div class="goruda-stat-card">
                                    <div class="goruda-stat-icon">
                                        <i class="fas fa-network-wired"></i>
                                    </div>
                                    <div class="goruda-stat-info">
                                        <h3 id="network-speed">54ms</h3>
                                        <p>Ping</p>
                                    </div>
                                </div>
                                <div class="goruda-stat-card">
                                    <div class="goruda-stat-icon">
                                        <i class="fas fa-database"></i>
                                    </div>
                                    <div class="goruda-stat-info">
                                        <h3 id="storage-used">1.2GB</h3>
                                        <p>Storage</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="goruda-section">
                            <div class="goruda-section-title">
                                <i class="fas fa-history"></i>
                                Activity Log
                            </div>
                            <div style="color: var(--goruda-text-secondary); font-size: 13px; line-height: 1.6;">
                                <p>✓ Panel initialized successfully</p>
                                <p>✓ Goruda V2 theme applied</p>
                                <p>✓ Widget system ready</p>
                                <p>✓ All systems operational</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.panel);
            this.setupTabs();
            this.updateStats();
        }

        getWidgetsHTML() {
            const widgets = [
                { id: 'analytics', icon: 'fas fa-chart-pie', title: 'Analytics', desc: 'Real-time analytics dashboard' },
                { id: 'monitor', icon: 'fas fa-desktop', title: 'Monitor', desc: 'System performance monitor' },
                { id: 'security', icon: 'fas fa-shield-alt', title: 'Security', desc: 'Security status and alerts' },
                { id: 'network', icon: 'fas fa-wifi', title: 'Network', desc: 'Network traffic monitor' },
                { id: 'storage', icon: 'fas fa-hdd', title: 'Storage', desc: 'Storage usage statistics' },
                { id: 'users', icon: 'fas fa-users', title: 'Users', desc: 'Active users and sessions' },
                { id: 'tasks', icon: 'fas fa-tasks', title: 'Tasks', desc: 'Task scheduler and manager' },
                { id: 'logs', icon: 'fas fa-clipboard-list', title: 'Logs', desc: 'System logs viewer' }
            ];

            return widgets.map(widget => `
                <div class="goruda-widget" data-widget-id="${widget.id}" draggable="true">
                    <div class="goruda-widget-icon">
                        <i class="${widget.icon}"></i>
                    </div>
                    <div class="goruda-widget-title">${widget.title}</div>
                    <div class="goruda-widget-desc">${widget.desc}</div>
                </div>
            `).join('');
        }

        setupDragAndDrop() {
            const dashboard = document.getElementById('goruda-dashboard');
            const widgets = document.querySelectorAll('.goruda-widget');

            // Используем Sortable.js для плавного drag & drop
            if (typeof Sortable !== 'undefined') {
                Sortable.create(dashboard, {
                    group: {
                        name: 'widgets',
                        pull: false,
                        put: true
                    },
                    animation: 200,
                    ghostClass: 'dragging',
                    onAdd: (evt) => {
                        this.addWidgetToDashboard(evt.item.dataset.widgetId);
                    }
                });

                Sortable.create(document.getElementById('widget-library'), {
                    group: {
                        name: 'widgets',
                        pull: 'clone',
                        put: false
                    },
                    sort: false,
                    animation: 200
                });
            }

            // Fallback нативный drag & drop
            widgets.forEach(widget => {
                widget.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.dataset.widgetId);
                    e.target.classList.add('dragging');
                });

                widget.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                });
            });

            dashboard.addEventListener('dragover', (e) => {
                e.preventDefault();
                dashboard.classList.add('active-drop');
            });

            dashboard.addEventListener('dragleave', () => {
                dashboard.classList.remove('active-drop');
            });

            dashboard.addEventListener('drop', (e) => {
                e.preventDefault();
                dashboard.classList.remove('active-drop');
                const widgetId = e.dataTransfer.getData('text/plain');
                if (widgetId) {
                    this.addWidgetToDashboard(widgetId);
                }
            });

            // Перетаскивание панели
            const dragHandle = document.getElementById('goruda-drag-handle');
            
            dragHandle.addEventListener('mousedown', (e) => {
                if (e.target.closest('.goruda-control-btn')) return;
                
                this.isDragging = true;
                const rect = this.panel.getBoundingClientRect();
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
                this.panel.style.cursor = 'grabbing';
                this.panel.style.transition = 'none';
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                
                this.position.x = e.clientX - this.dragOffset.x;
                this.position.y = e.clientY - this.dragOffset.y;
                
                this.panel.style.left = `${this.position.x}px`;
                this.panel.style.top = `${this.position.y}px`;
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.panel.style.cursor = '';
                    this.panel.style.transition = '';
                    this.saveSettings();
                }
            });
        }

        addWidgetToDashboard(widgetId) {
            const widgetData = {
                'analytics': { icon: 'fas fa-chart-pie', title: 'Analytics', content: 'Loading analytics data...' },
                'monitor': { icon: 'fas fa-desktop', title: 'Monitor', content: 'System monitoring active' },
                'security': { icon: 'fas fa-shield-alt', title: 'Security', content: 'All systems secure ✓' },
                'network': { icon: 'fas fa-wifi', title: 'Network', content: 'Network: 54 Mbps ↓ 12 Mbps ↑' },
                'storage': { icon: 'fas fa-hdd', title: 'Storage', content: 'Storage: 1.2GB / 5GB used' },
                'users': { icon: 'fas fa-users', title: 'Users', content: '84 users online' },
                'tasks': { icon: 'fas fa-tasks', title: 'Tasks', content: '5 active tasks running' },
                'logs': { icon: 'fas fa-clipboard-list', title: 'Logs', content: 'Logs up to date' }
            };

            const data = widgetData[widgetId];
            if (!data) return;

            const widgetElement = document.createElement('div');
            widgetElement.className = 'goruda-dashboard-widget';
            widgetElement.dataset.widgetId = widgetId;
            widgetElement.innerHTML = `
                <div class="goruda-dashboard-widget-header">
                    <div class="goruda-dashboard-widget-title">
                        <i class="${data.icon}"></i> ${data.title}
                    </div>
                    <button class="goruda-dashboard-widget-remove" title="Remove widget">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="goruda-dashboard-widget-content">
                    ${data.content}
                </div>
            `;

            const dashboard = document.getElementById('goruda-dashboard');
            dashboard.appendChild(widgetElement);
            
            this.dashboardWidgets.push(widgetId);
            this.saveDashboard();

            // Обработчик удаления виджета
            widgetElement.querySelector('.goruda-dashboard-widget-remove').addEventListener('click', () => {
                widgetElement.remove();
                this.dashboardWidgets = this.dashboardWidgets.filter(id => id !== widgetId);
                this.saveDashboard();
                this.showNotification('Widget removed', 'info');
            });

            this.showNotification(`${data.title} widget added to dashboard`, 'success');
        }

        setupTabs() {
            const tabs = this.panel.querySelectorAll('.goruda-nav-tab');
            const contents = this.panel.querySelectorAll('.goruda-tab-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.dataset.tab;
                    
                    // Обновляем активные вкладки
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    
                    tab.classList.add('active');
                    document.getElementById(`tab-${tabId}`).classList.add('active');
                });
            });
        }

        setupEventListeners() {
            // Apple-style controls
            this.panel.querySelector('.goruda-control-btn.close').addEventListener('click', () => {
                this.panel.style.display = 'none';
                this.showNotification('Panel closed. Refresh page to reopen.', 'warning');
            });

            this.panel.querySelector('.goruda-control-btn.minimize').addEventListener('click', () => {
                this.toggleMinimize();
            });

            this.panel.querySelector('.goruda-control-btn.maximize').addEventListener('click', () => {
                this.panel.style.width = '500px';
                this.showNotification('Panel expanded', 'info');
            });

            // Поиск виджетов
            const searchInput = document.getElementById('goruda-search');
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const widgets = document.querySelectorAll('.goruda-widget');
                
                widgets.forEach(widget => {
                    const title = widget.querySelector('.goruda-widget-title').textContent.toLowerCase();
                    const desc = widget.querySelector('.goruda-widget-desc').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                        widget.style.display = 'block';
                    } else {
                        widget.style.display = 'none';
                    }
                });
            });

            // Сохранение настроек
            document.getElementById('save-settings').addEventListener('click', () => {
                this.saveSettingsFromUI();
                this.showNotification('Settings saved successfully', 'success');
            });

            // Сброс настроек
            document.getElementById('reset-settings').addEventListener('click', () => {
                if (confirm('Reset all settings to defaults?')) {
                    GM_setValue('goruda_settings', JSON.stringify({}));
                    GM_setValue('goruda_dashboard', JSON.stringify([]));
                    location.reload();
                }
            });

            // Выбор цвета темы
            const colorOptions = this.panel.querySelectorAll('.goruda-color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', () => {
                    colorOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    
                    const color = option.dataset.color;
                    document.documentElement.style.setProperty('--goruda-accent', color);
                    document.documentElement.style.setProperty('--goruda-accent-hover', this.adjustColor(color, -20));
                    
                    this.showNotification('Theme color updated', 'info');
                });
            });

            // Переключение настроек
            const toggles = this.panel.querySelectorAll('.goruda-toggle input');
            toggles.forEach(toggle => {
                toggle.addEventListener('change', () => {
                    this.saveSettingsFromUI();
                });
            });
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            
            if (this.isMinimized) {
                this.panel.classList.add('goruda-minimized');
                this.panel.querySelector('.minimize i').className = 'fas fa-expand';
                this.panel.querySelector('.minimize').title = 'Expand';
                this.panel.style.animation = 'gorudaMinimize 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            } else {
                this.panel.classList.remove('goruda-minimized');
                this.panel.querySelector('.minimize i').className = 'fas fa-minus';
                this.panel.querySelector('.minimize').title = 'Minimize';
                this.panel.style.animation = 'gorudaExpand 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            }
            
            this.saveSettings();
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = 'goruda-notification';
            
            const icons = {
                'success': 'fas fa-check-circle',
                'error': 'fas fa-exclamation-circle',
                'warning': 'fas fa-exclamation-triangle',
                'info': 'fas fa-info-circle'
            };

            const titles = {
                'success': 'Success',
                'error': 'Error',
                'warning': 'Warning',
                'info': 'Information'
            };

            notification.innerHTML = `
                <div class="goruda-notification-icon">
                    <i class="${icons[type] || icons.info}"></i>
                </div>
                <div class="goruda-notification-content">
                    <div class="goruda-notification-title">${titles[type] || 'Notification'}</div>
                    <div class="goruda-notification-message">${message}</div>
                </div>
            `;

            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 400);
            }, 3000);
        }

        updateStats() {
            // Обновляем статистику каждые 30 секунд
            setInterval(() => {
                const viewsCount = document.getElementById('views-count');
                const onlineCount = document.getElementById('online-count');
                
                if (viewsCount) {
                    const current = parseInt(viewsCount.textContent.replace(/,/g, ''));
                    const change = Math.floor(Math.random() * 10) - 2;
                    viewsCount.textContent = (current + Math.max(change, 0)).toLocaleString();
                }
                
                if (onlineCount) {
                    const current = parseInt(onlineCount.textContent);
                    const change = Math.floor(Math.random() * 5) - 2;
                    onlineCount.textContent = Math.max(current + change, 1);
                }
            }, 30000);
        }

        loadSettings() {
            try {
                const savedSettings = GM_getValue('goruda_settings', '{}');
                const savedPosition = GM_getValue('goruda_position', '{"x":20,"y":20}');
                const savedMinimized = GM_getValue('goruda_minimized', 'false');
                
                this.settings = JSON.parse(savedSettings);
                this.position = JSON.parse(savedPosition);
                this.isMinimized = JSON.parse(savedMinimized);
            } catch (e) {
                this.settings = {};
                this.position = { x: 20, y: 20 };
                this.isMinimized = false;
            }
        }

        saveSettings() {
            GM_setValue('goruda_settings', JSON.stringify(this.settings));
            GM_setValue('goruda_position', JSON.stringify(this.position));
            GM_setValue('goruda_minimized', JSON.stringify(this.isMinimized));
        }

        saveSettingsFromUI() {
            this.settings.darkMode = document.getElementById('dark-mode').checked;
            this.settings.animations = document.getElementById('animations').checked;
            this.settings.adBlocker = document.getElementById('ad-blocker').checked;
            this.settings.turboMode = document.getElementById('turbo-mode').checked;
            this.settings.notifications = document.getElementById('notifications').checked;
            
            this.saveSettings();
        }

        saveDashboard() {
            GM_setValue('goruda_dashboard', JSON.stringify(this.dashboardWidgets));
        }

        loadDashboardWidgets() {
            try {
                const savedWidgets = GM_getValue('goruda_dashboard', '[]');
                this.dashboardWidgets = JSON.parse(savedWidgets);
                
                // Загружаем сохраненные виджеты
                setTimeout(() => {
                    this.dashboardWidgets.forEach(widgetId => {
                        this.addWidgetToDashboard(widgetId);
                    });
                }, 500);
            } catch (e) {
                this.dashboardWidgets = [];
            }
        }

        adjustColor(color, amount) {
            let usePound = false;
            if (color[0] === "#") {
                color = color.slice(1);
                usePound = true;
            }
            const num = parseInt(color, 16);
            let r = (num >> 16) + amount;
            if (r > 255) r = 255;
            else if (r < 0) r = 0;
            let b = ((num >> 8) & 0x00FF) + amount;
            if (b > 255) b = 255;
            else if (b < 0) b = 0;
            let g = (num & 0x0000FF) + amount;
            if (g > 255) g = 255;
            else if (g < 0) g = 0;
            return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
        }

        injectEnhancements() {
            // Добавляем эффекты для сайта kornet.lat
            this.enhanceKornetSite();
            
            // Создаем плавающую кнопку для быстрого доступа
            this.createQuickAccessButton();
        }

        enhanceKornetSite() {
            // Пример улучшений для kornet.lat
            document.querySelectorAll('a').forEach(link => {
                link.style.transition = 'color 0.2s ease';
                link.addEventListener('mouseenter', () => {
                    link.style.color = 'var(--goruda-accent)';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.color = '';
                });
            });
        }

        createQuickAccessButton() {
            const quickBtn = document.createElement('button');
            quickBtn.innerHTML = '<i class="fas fa-rocket"></i>';
            quickBtn.title = 'Quick Access';
            quickBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 30px;
                width: 56px;
                height: 56px;
                background: var(--goruda-accent-gradient);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                z-index: 99999;
                box-shadow: var(--goruda-shadow-xl);
                transition: all var(--goruda-transition);
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            quickBtn.addEventListener('mouseenter', () => {
                quickBtn.style.transform = 'scale(1.1) rotate(15deg)';
                quickBtn.style.boxShadow = '0 15px 35px rgba(0, 173, 181, 0.4)';
            });

            quickBtn.addEventListener('mouseleave', () => {
                quickBtn.style.transform = 'scale(1) rotate(0deg)';
                quickBtn.style.boxShadow = 'var(--goruda-shadow-xl)';
            });

            quickBtn.addEventListener('click', () => {
                this.toggleMinimize();
                this.showNotification('Quick access activated', 'success');
            });

            document.body.appendChild(quickBtn);
        }
    }

    // Запускаем панель после загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => new KornetGorudaPanel(), 800);
        });
    } else {
        setTimeout(() => new KornetGorudaPanel(), 800);
    }

})();