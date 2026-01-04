// ==UserScript==
// @name         网页列表数据提取器 (增强版 - 带预览功能)
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  在任何页面上通过一个可交互的、可拖动的界面，输入多个CSS选择器，预览提取的数据，并将匹配到的内容导出为CSV表格文件。
// @author       Kamjin3086
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548786/%E7%BD%91%E9%A1%B5%E5%88%97%E8%A1%A8%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%20-%20%E5%B8%A6%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548786/%E7%BD%91%E9%A1%B5%E5%88%97%E8%A1%A8%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8%20%28%E5%A2%9E%E5%BC%BA%E7%89%88%20-%20%E5%B8%A6%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注册一个菜单命令，用来打开提取器界面
    GM_registerMenuCommand('打开内容提取器', toggleExtractorPanel);

    // 2. 为界面添加CSS样式
    GM_addStyle(`
        #gm-extractor-panel {
            position: fixed;
            top: 60px;
            right: 15px;
            width: 450px;
            background-color: #ffffff;
            border: 2px solid #4A90E2;
            border-radius: 10px;
            z-index: 99999;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: none;
            flex-direction: column;
            max-height: 90vh;
            overflow: hidden;
        }
        
        #gm-extractor-panel .extractor-header {
            padding: 12px 16px;
            background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
            color: white;
            font-weight: 600;
            font-size: 15px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        }
        
        #gm-extractor-panel .header-buttons {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        #gm-extractor-panel .header-btn {
            background-color: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s ease;
        }
        
        #gm-extractor-panel .header-btn:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
        
        #gm-extractor-panel .extractor-body {
            padding: 12px 16px;
            flex: 1;
            overflow-y: auto;
            background-color: #fafafa;
        }
        
        #gm-extractor-panel details {
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            margin-bottom: 12px;
            background-color: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        #gm-extractor-panel summary {
            padding: 10px 12px;
            font-weight: 600;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            cursor: pointer;
            outline: none;
            border-radius: 6px;
            transition: all 0.2s ease;
            font-size: 14px;
        }
        
        #gm-extractor-panel summary:hover {
            background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        }
        
        #gm-extractor-panel .instructions {
            padding: 16px;
            font-size: 14px;
            line-height: 1.6;
            background: white;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        
        #gm-extractor-panel .instructions ul {
            padding-left: 20px;
            margin: 0;
        }
        
        #gm-extractor-panel .instructions code {
            background-color: #f1f3f4;
            padding: 3px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            color: #d63384;
        }
        
        #gm-extractor-panel .instructions li {
            margin-bottom: 10px;
        }
        
        #gm-extractor-panel .instructions .pro-tip {
            border-top: 1px dashed #dee2e6;
            margin-top: 15px;
            padding-top: 15px;
            font-size: 13px;
            color: #6c757d;
            background-color: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
        }
        
        #gm-extractor-panel .selector-optimize {
            margin-top: 8px;
            padding: 10px 12px;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            font-size: 12px;
            color: #856404;
        }
        
        #gm-extractor-panel .optimize-btn {
            background-color: #17a2b8;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 8px;
        }
        
        #gm-extractor-panel .optimize-btn:hover {
            background-color: #138496;
        }
        
        #gm-extractor-panel .optimize-options {
            margin-top: 8px;
            padding: 8px;
            background-color: #f8f9fa;
            border-radius: 4px;
            border: 1px solid #dee2e6;
        }
        
        #gm-extractor-panel .optimize-option {
            display: inline-block;
            margin: 2px 4px 2px 0;
            padding: 4px 8px;
            background-color: #e9ecef;
            border: 1px solid #ced4da;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
        }
        
        #gm-extractor-panel .optimize-option:hover {
            background-color: #17a2b8;
            color: white;
        }
        
        #gm-extractor-panel .optimize-option.selected {
            background-color: #007bff;
            color: white;
        }
        
        #gm-extractor-panel .validation-result {
            margin-top: 8px;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 12px;
        }
        
        #gm-extractor-panel .validation-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        #gm-extractor-panel .validation-warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
        #gm-extractor-panel .validation-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        #gm-extractor-panel .selector-row {
            margin-bottom: 10px;
            padding: 10px;
            background-color: white;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        
        #gm-extractor-panel .selector-input-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        #gm-extractor-panel .selector-input {
            flex-grow: 1;
            padding: 8px 10px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 13px;
            transition: border-color 0.2s ease;
            background-color: white;
        }
        
        #gm-extractor-panel .selector-input:focus {
            outline: none;
            border-color: #4A90E2;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }
        
        #gm-extractor-panel .add-btn {
            padding: 6px 8px;
            cursor: pointer;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            transition: background-color 0.2s ease;
            min-width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        #gm-extractor-panel .add-btn:hover {
            background-color: #218838;
        }
        
        #gm-extractor-panel .remove-btn {
            padding: 6px 8px;
            cursor: pointer;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            transition: background-color 0.2s ease;
            min-width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        #gm-extractor-panel .remove-btn:hover {
            background-color: #c82333;
        }
        
        #gm-extractor-panel .preview-section {
            margin-top: 12px;
            padding: 12px;
            background-color: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        #gm-extractor-panel .preview-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: #495057;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
        }
        
        #gm-extractor-panel .preview-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            background-color: white;
        }
        
        #gm-extractor-panel .preview-table th {
            background-color: #f8f9fa;
            padding: 6px 8px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #dee2e6;
            color: #495057;
            font-size: 11px;
        }
        
        #gm-extractor-panel .preview-table td {
            padding: 6px 8px;
            border: 1px solid #dee2e6;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 11px;
        }
        
        #gm-extractor-panel .preview-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        #gm-extractor-panel .preview-info {
            margin-top: 10px;
            padding: 8px 12px;
            background-color: #e3f2fd;
            border-radius: 4px;
            font-size: 12px;
            color: #1976d2;
        }
        
        #gm-extractor-panel .extractor-footer {
            padding: 12px 16px;
            border-top: 1px solid #e0e0e0;
            background-color: white;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        
        #gm-extractor-panel .footer-actions {
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        
        #gm-extractor-panel button {
            padding: 8px 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: all 0.2s ease;
            min-width: 90px;
        }
        
        #gm-extractor-panel .footer-actions button {
            min-width: 100px;
            padding: 10px 16px;
        }
        
        #gm-extractor-panel #add-selector-btn {
            background-color: #28a745;
            color: white;
        }
        
        #gm-extractor-panel #add-selector-btn:hover {
            background-color: #218838;
            transform: translateY(-1px);
        }
        
        #gm-extractor-panel #preview-btn {
            background-color: #ffc107;
            color: #212529;
        }
        
        #gm-extractor-panel #preview-btn:hover {
            background-color: #e0a800;
            transform: translateY(-1px);
        }
        
        #gm-extractor-panel #export-csv-btn {
            background-color: #007bff;
            color: white;
        }
        
        #gm-extractor-panel #export-csv-btn:hover {
            background-color: #0056b3;
            transform: translateY(-1px);
        }
        
        #gm-extractor-panel #close-panel-btn {
            cursor: pointer;
            font-size: 24px;
            font-weight: bold;
            opacity: 0.8;
            transition: opacity 0.2s ease;
            padding: 0;
            min-width: auto;
            background: none;
            color: white;
        }
        
        #gm-extractor-panel #close-panel-btn:hover {
            opacity: 1;
        }
        
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
        }
        
        .status-success { background-color: #28a745; }
        .status-warning { background-color: #ffc107; }
        .status-error { background-color: #dc3545; }
        
        #gm-extractor-panel .accumulation-controls {
            margin-bottom: 12px;
            padding: 10px;
            background-color: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        #gm-extractor-panel .accumulation-toggle {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #1976d2;
        }
        
        #gm-extractor-panel .toggle-switch {
            position: relative;
            width: 40px;
            height: 20px;
            background-color: #ccc;
            border-radius: 20px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        #gm-extractor-panel .toggle-switch.active {
            background-color: #4caf50;
        }
        
        #gm-extractor-panel .toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }
        
        #gm-extractor-panel .toggle-switch.active .toggle-slider {
            transform: translateX(20px);
        }
        
        #gm-extractor-panel .accumulation-info {
            flex: 1;
            font-size: 12px;
            color: #666;
        }
        
        #gm-extractor-panel .clear-btn {
            background-color: #ff9800;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
        }
        
        #gm-extractor-panel .clear-btn:hover {
            background-color: #f57c00;
        }
        
        #gm-extractor-panel .group-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        #gm-extractor-panel .group-modal.open {
            display: flex;
        }
        
        #gm-extractor-panel .group-modal-content {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        #gm-extractor-panel .group-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        #gm-extractor-panel .group-modal-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        
        #gm-extractor-panel .group-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #gm-extractor-panel .group-modal-close:hover {
            color: #333;
        }
        
        #gm-extractor-panel .group-form {
            margin-bottom: 20px;
        }
        
        #gm-extractor-panel .group-form input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        #gm-extractor-panel .group-form button {
            background-color: #4A90E2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        #gm-extractor-panel .group-form button:hover {
            background-color: #357ABD;
        }
        
        #gm-extractor-panel .group-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        #gm-extractor-panel .group-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            margin-bottom: 8px;
            background-color: #f9f9f9;
        }
        
        #gm-extractor-panel .group-item:hover {
            background-color: #f0f0f0;
        }
        
        #gm-extractor-panel .group-item-info {
            flex: 1;
        }
        
        #gm-extractor-panel .group-item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }
        
        #gm-extractor-panel .group-item-path {
            font-size: 12px;
            color: #666;
        }
        
        #gm-extractor-panel .group-item-actions {
            display: flex;
            gap: 8px;
        }
        
        #gm-extractor-panel .group-item-btn {
            padding: 4px 8px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        
        #gm-extractor-panel .group-load-btn {
            background-color: #28a745;
            color: white;
        }
        
        #gm-extractor-panel .group-load-btn:hover {
            background-color: #218838;
        }
        
        #gm-extractor-panel .group-delete-btn {
            background-color: #dc3545;
            color: white;
        }
        
        #gm-extractor-panel .group-delete-btn:hover {
            background-color: #c82333;
        }
        
        #gm-extractor-panel .groups-sidebar {
            position: absolute;
            left: -180px;
            top: 0;
            width: 180px;
            height: 100%;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px 0 0 8px;
            padding: 12px;
            overflow-y: auto;
            transition: left 0.3s ease;
            z-index: 1;
        }
        
        #gm-extractor-panel .groups-sidebar.open {
            left: 0;
        }
        
        #gm-extractor-panel .groups-toggle {
            position: absolute;
            left: -20px;
            top: 20px;
            width: 20px;
            height: 40px;
            background-color: #6c757d;
            border-radius: 4px 0 0 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            transition: background-color 0.3s;
        }
        
        #gm-extractor-panel .groups-toggle:hover {
            background-color: #5a6268;
        }
        
        #gm-extractor-panel .groups-header {
            font-weight: 600;
            margin-bottom: 10px;
            color: #495057;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        #gm-extractor-panel .group-item {
            background-color: white;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }
        
        #gm-extractor-panel .group-item:hover {
            background-color: #e3f2fd;
            border-color: #4A90E2;
        }
        
        #gm-extractor-panel .group-name {
            font-weight: 600;
            font-size: 12px;
            color: #495057;
            margin-bottom: 2px;
        }
        
        #gm-extractor-panel .group-path {
            font-size: 10px;
            color: #6c757d;
            margin-bottom: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        #gm-extractor-panel .group-info {
            font-size: 10px;
            color: #28a745;
        }
        
        #gm-extractor-panel .group-delete {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 16px;
            height: 16px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10px;
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        #gm-extractor-panel .group-item:hover .group-delete {
            display: flex;
        }
        
        #gm-extractor-panel .save-group-btn {
            background-color: #17a2b8;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 10px;
            width: 100%;
        }
        
        #gm-extractor-panel .save-group-btn:hover {
            background-color: #138496;
        }
        
        #gm-extractor-panel .group-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 100000;
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        #gm-extractor-panel .group-modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            max-width: 90%;
        }
        
        #gm-extractor-panel .group-modal h3 {
            margin: 0 0 15px 0;
            color: #495057;
            font-size: 16px;
        }
        
        #gm-extractor-panel .group-modal input {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        #gm-extractor-panel .group-modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        #gm-extractor-panel .group-modal button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
        }
        
        #gm-extractor-panel .group-modal .btn-primary {
            background-color: #007bff;
            color: white;
        }
        
        #gm-extractor-panel .group-modal .btn-secondary {
            background-color: #6c757d;
            color: white;
        }
    `);

    // 3. 定义所有函数（在HTML创建之前）
    
    // 智能选择器优化函数
    function optimizeSelector(button) {
        const row = button.closest('.selector-row');
        const input = row.querySelector('.selector-input');
        const originalSelector = input.value.trim();
        
        if (!originalSelector) return;
        
        // 显示优化选项
        showOptimizeOptions(row, originalSelector);
    }
    
    // 立即暴露到全局作用域
    window.optimizeSelector = optimizeSelector;
    
    // 显示优化选项
    function showOptimizeOptions(row, originalSelector) {
        const optimizeDiv = row.querySelector('.selector-optimize');
        
        // 分析选择器，生成多种优化策略
        const strategies = analyzeSelector(originalSelector);
        
        if (strategies.length === 0) {
            showValidationResult(row, 'error', '未检测到可优化的行号选择器');
            return;
        }
        
        // 创建优化选项界面
        const optionsHtml = `
            <div class="optimize-options">
                <div style="font-weight: 600; margin-bottom: 6px; color: #495057;">选择优化策略:</div>
                ${strategies.map((strategy, index) => `
                    <span class="optimize-option" data-strategy="${index}" data-original="${originalSelector.replace(/"/g, '&quot;')}">
                        ${strategy.name}
                    </span>
                `).join('')}
                <div style="margin-top: 6px; font-size: 10px; color: #6c757d;">
                    点击策略后会自动验证并显示结果
                </div>
            </div>
        `;
        
        optimizeDiv.innerHTML = optionsHtml;
        
        // 为每个策略按钮添加事件监听器
        optimizeDiv.querySelectorAll('.optimize-option').forEach(option => {
            option.addEventListener('click', () => {
                const strategyIndex = parseInt(option.dataset.strategy);
                const original = option.dataset.original;
                applyOptimization(strategyIndex, original, row);
            });
        });
    }
    
    // 分析选择器，生成优化策略
    function analyzeSelector(selector) {
        const strategies = [];
        
        // 策略1: 移除所有行号选择器（激进）
        if (selector.includes(':nth-child(') || selector.includes(':nth-of-type(') || 
            selector.includes(':first-child') || selector.includes(':last-child')) {
            strategies.push({
                name: '移除所有行号',
                description: '移除所有 :nth-child, :first-child 等选择器',
                transform: (sel) => {
                    return sel.replace(/:nth-child\(\d+\)/g, '')
                             .replace(/:nth-of-type\(\d+\)/g, '')
                             .replace(/:first-child/g, '')
                             .replace(/:last-child/g, '')
                             .replace(/:first-of-type/g, '')
                             .replace(/:last-of-type/g, '')
                             .replace(/\s*>\s*/g, ' > ')
                             .replace(/\s+/g, ' ')
                             .trim();
                }
            });
        }
        
        // 策略2: 只移除最后一个行号选择器（保守）
        if (selector.includes(':nth-child(') || selector.includes(':nth-of-type(')) {
            strategies.push({
                name: '移除最后行号',
                description: '只移除选择器末尾的行号选择器',
                transform: (sel) => {
                    return sel.replace(/:nth-child\(\d+\)$/, '')
                             .replace(/:nth-of-type\(\d+\)$/, '')
                             .replace(/:first-child$/, '')
                             .replace(/:last-child$/, '')
                             .trim();
                }
            });
        }
        
        // 策略3: 替换为通用选择器
        if (selector.includes(':nth-child(')) {
            strategies.push({
                name: '替换为通用',
                description: '将 :nth-child(n) 替换为通用选择器',
                transform: (sel) => {
                    return sel.replace(/:nth-child\(\d+\)/g, ':not(:empty)')
                             .trim();
                }
            });
        }
        
        // 策略4: 基于父元素优化
        if (selector.includes(' > ')) {
            strategies.push({
                name: '基于父元素',
                description: '保留父元素结构，移除子元素行号',
                transform: (sel) => {
                    const parts = sel.split(' > ');
                    if (parts.length > 1) {
                        const lastPart = parts[parts.length - 1];
                        const optimizedLast = lastPart.replace(/:nth-child\(\d+\)/g, '')
                                                     .replace(/:nth-of-type\(\d+\)/g, '');
                        parts[parts.length - 1] = optimizedLast;
                        return parts.join(' > ');
                    }
                    return sel;
                }
            });
        }
        
        return strategies;
    }
    
    // 应用优化策略
    function applyOptimization(strategyIndex, originalSelector, row) {
        const input = row.querySelector('.selector-input');
        
        // 获取策略
        const strategies = analyzeSelector(originalSelector);
        const strategy = strategies[strategyIndex];
        
        if (!strategy) return;
        
        // 应用优化
        const optimizedSelector = strategy.transform(originalSelector);
        
        // 验证优化结果
        const validation = validateOptimizedSelector(originalSelector, optimizedSelector);
        
        // 显示验证结果
        showValidationResult(row, validation.type, validation.message, optimizedSelector);
        
        // 如果验证成功，应用选择器
        if (validation.type === 'success') {
            input.value = optimizedSelector;
            input.style.backgroundColor = '#d4edda';
            setTimeout(() => {
                input.style.backgroundColor = '';
            }, 2000);
        }
    }
    
    // 验证优化后的选择器
    function validateOptimizedSelector(originalSelector, optimizedSelector) {
        try {
            // 测试原始选择器
            const originalElements = document.querySelectorAll(originalSelector);
            const originalCount = originalElements.length;
            
            // 测试优化后的选择器
            const optimizedElements = document.querySelectorAll(optimizedSelector);
            const optimizedCount = optimizedElements.length;
            
            if (optimizedCount === 0) {
                return {
                    type: 'error',
                    message: '优化后的选择器无法匹配任何元素'
                };
            }
            
            if (optimizedCount === originalCount) {
                return {
                    type: 'warning',
                    message: `优化后仍只匹配 ${originalCount} 个元素，可能没有扩展匹配范围`
                };
            }
            
            if (optimizedCount > originalCount) {
                return {
                    type: 'success',
                    message: `✅ 从 ${originalCount} 扩展到 ${optimizedCount} 个元素`
                };
            }
            
            return {
                type: 'warning',
                message: `优化后匹配 ${optimizedCount} 个元素，请检查是否为目标数据`
            };
            
        } catch (error) {
            return {
                type: 'error',
                message: `选择器语法错误: ${error.message}`
            };
        }
    }
    
    // 显示验证结果
    function showValidationResult(row, type, message, optimizedSelector = null) {
        // 移除现有的验证结果
        const existingResult = row.querySelector('.validation-result');
        if (existingResult) {
            existingResult.remove();
        }
        
        // 创建新的验证结果
        const resultDiv = document.createElement('div');
        resultDiv.className = `validation-result validation-${type}`;
        resultDiv.innerHTML = `
            <div>${message}</div>
            ${optimizedSelector ? `<div style="margin-top: 4px; font-family: monospace; font-size: 11px; opacity: 0.8;">${optimizedSelector}</div>` : ''}
        `;
        
        // 插入到选择器行中
        const optimizeDiv = row.querySelector('.selector-optimize');
        optimizeDiv.appendChild(resultDiv);
        
        // 如果是成功或错误，3秒后隐藏优化区域
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                optimizeDiv.style.display = 'none';
            }, 3000);
        }
    }

    // 4. 创建HTML界面
    const panel = document.createElement('div');
    panel.id = 'gm-extractor-panel';
    panel.innerHTML = `
        <div class="extractor-header">
            <span>🔍 内容提取器</span>
            <div class="header-buttons">
                <button id="save-group-btn" class="header-btn" title="保存当前选择器组">💾</button>
                <button id="load-group-btn" class="header-btn" title="加载选择器组">📂</button>
                <span id="close-panel-btn" title="关闭">&times;</span>
            </div>
        </div>
        <div class="extractor-body">
            <details>
                <summary>📖 如何获取选择器 (点击展开)</summary>
                <div class="instructions">
                    <ul>
                        <li><b>第1步:</b> 在您想提取的文字上 (例如标题或名字)，点击鼠标<b>右键</b>，在弹出的菜单中选择 <strong>检查 (Inspect)</strong>。</li>
                        <li><b>第2步:</b> 浏览器下方或右侧会弹出开发者工具，并且有一行代码是<b>高亮</b>状态。</li>
                        <li><b>第3步:</b> 在这行<b>高亮的代码上</b>，再次点击鼠标<b>右键</b>。</li>
                        <li><b>第4步:</b> 在弹出的新菜单中，依次选择 <strong>复制 (Copy)</strong> > <strong>复制选择器 (Copy selector)</strong>。</li>
                        <li><b>第5步:</b> 回到本面板，将刚刚复制的内容粘贴到下面的输入框里即可。</li>
                    </ul>
                    <div class="pro-tip">
                        <b>💡 小提示:</b> 
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li><b>提取单行数据:</b> 右键点击某一行 → 复制选择器</li>
                            <li><b>提取列表数据:</b> 右键点击某一行 → 复制选择器 → 点击"优化选择器"按钮，脚本会自动移除行号限制</li>
                            <li><b>手动优化:</b> 如果选择器包含 <code>:nth-child(1)</code> 等行号，删除这部分即可获取所有行</li>
                        </ul>
                    </div>
                </div>
            </details>
            <div class="accumulation-controls">
                <div class="accumulation-toggle">
                    <span>积累模式</span>
                    <div class="toggle-switch" id="accumulation-toggle">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div class="accumulation-info" id="accumulation-info">
                    关闭 - 点击"预览和积累"只显示当前页面数据
                </div>
                <button class="clear-btn" id="clear-accumulated-btn" style="display: none;">清空</button>
            </div>
            <div id="selectors-container">
            </div>
            <div class="preview-section" id="preview-section" style="display: none;">
                <div class="preview-title">
                    <span class="status-indicator status-success"></span>
                    数据预览 (前3行)
                </div>
                <div id="preview-content"></div>
                <div class="preview-info" id="preview-info"></div>
            </div>
        </div>
        <div class="extractor-footer">
            <div class="footer-actions">
                <button id="preview-btn">👁️ 预览和积累</button>
                <button id="export-csv-btn">📥 导出CSV</button>
            </div>
        </div>
        
        <!-- 组管理模态框 -->
        <div class="group-modal" id="group-modal">
            <div class="group-modal-content">
                <div class="group-modal-header">
                    <div class="group-modal-title">选择器组管理</div>
                    <button class="group-modal-close" id="group-modal-close">&times;</button>
                </div>
                
                <div class="group-form">
                    <input type="text" id="group-name-input" placeholder="输入组名称（例如：商品列表）" maxlength="50">
                    <button id="save-current-group-btn">💾 保存当前选择器组</button>
                </div>
                
                <div class="group-list" id="group-list">
                    <!-- 组列表将在这里动态生成 -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    const selectorsContainer = panel.querySelector('#selectors-container');
    const previewSection = panel.querySelector('#preview-section');
    const previewContent = panel.querySelector('#preview-content');
    const previewInfo = panel.querySelector('#preview-info');
    
    // 数据积累相关变量
    let accumulatedData = [];
    let isAccumulationMode = false;
    
    // 选择器组相关变量
    let savedGroups = [];
    const STORAGE_KEY = 'content_extractor_groups';

    // 4. 界面的交互逻辑
    
    // 选择器组管理函数
    function loadSavedGroups() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                savedGroups = JSON.parse(stored);
            }
        } catch (e) {
            console.error('加载保存的组失败:', e);
            savedGroups = [];
        }
        renderGroupsList();
    }
    
    function saveGroupsToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGroups));
        } catch (e) {
            console.error('保存组失败:', e);
            alert('保存失败，可能是存储空间不足');
        }
    }
    
    function renderGroupsList() {
        const groupsList = panel.querySelector('#groups-list');
        if (savedGroups.length === 0) {
            groupsList.innerHTML = '<div style="text-align: center; color: #6c757d; font-size: 12px; padding: 20px;">暂无保存的组</div>';
            return;
        }
        
        groupsList.innerHTML = savedGroups.map((group, index) => `
            <div class="group-item" data-index="${index}">
                <div class="group-name">${group.name || '未命名组'}</div>
                <div class="group-path" title="${group.path}">${group.path}</div>
                <div class="group-info">${group.selectors.length} 个选择器</div>
                <button class="group-delete" onclick="deleteGroup(${index})" title="删除此组">×</button>
            </div>
        `).join('');
        
        // 为每个组项添加点击事件
        groupsList.querySelectorAll('.group-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('group-delete')) return;
                const index = parseInt(item.dataset.index);
                loadGroup(index);
            });
        });
    }
    
    function showSaveGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'group-modal';
        modal.innerHTML = `
            <div class="group-modal-content">
                <h3>保存选择器组</h3>
                <input type="text" id="group-name-input" placeholder="组名称（可选）" maxlength="50">
                <div class="group-modal-buttons">
                    <button class="btn-secondary" onclick="closeSaveModal()">取消</button>
                    <button class="btn-primary" onclick="saveCurrentGroup()">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // 自动聚焦到输入框
        setTimeout(() => {
            modal.querySelector('#group-name-input').focus();
        }, 100);
        
        // 回车保存
        modal.querySelector('#group-name-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveCurrentGroup();
            }
        });
    }
    
    function closeSaveModal() {
        const modal = document.querySelector('.group-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    
    // 切换积累模式
    function toggleAccumulationMode() {
        isAccumulationMode = !isAccumulationMode;
        const toggle = panel.querySelector('#accumulation-toggle');
        const info = panel.querySelector('#accumulation-info');
        const clearBtn = panel.querySelector('#clear-accumulated-btn');
        
        if (isAccumulationMode) {
            toggle.classList.add('active');
            info.textContent = `开启 - 已积累 ${accumulatedData.length} 行数据，点击"预览和积累"会继续积累`;
            clearBtn.style.display = 'block';
        } else {
            toggle.classList.remove('active');
            info.textContent = '关闭 - 点击"预览和积累"只显示当前页面数据';
            clearBtn.style.display = 'none';
        }
    }
    
    // 清空积累的数据
    function clearAccumulatedData() {
        accumulatedData = [];
        const info = panel.querySelector('#accumulation-info');
        info.textContent = '开启 - 已积累 0 行数据，点击"预览和积累"会开始积累';
        
        // 如果预览区域显示的是积累数据，需要重新预览当前页面
        if (isAccumulationMode && previewSection.style.display !== 'none') {
            previewData();
        }
    }
    
    // 检查数据是否重复
    function isDuplicateData(newRow, existingData) {
        return existingData.some(existingRow => {
            return newRow.every((cell, index) => {
                return cell === (existingRow[index] || '');
            });
        });
    }
    
    // 添加数据到积累池
    function addToAccumulatedData(newData) {
        let addedCount = 0;
        newData.forEach(row => {
            if (!isDuplicateData(row, accumulatedData)) {
                accumulatedData.push(row);
                addedCount++;
            }
        });
        return addedCount;
    }

    function toggleExtractorPanel() {
        panel.style.display = (panel.style.display === 'flex') ? 'none' : 'flex';
        if (selectorsContainer.children.length === 0) {
            addSelectorRow();
        }
    }

    function addSelectorRow(initialValue = '') {
        const row = document.createElement('div');
        row.className = 'selector-row';
        row.innerHTML = `
            <div class="selector-input-row">
                <button class="add-btn" title="在此行前添加选择器">+</button>
                <input type="text" class="selector-input" placeholder="请从控制台复制选择器并粘贴" value="${initialValue}">
                <button class="remove-btn" title="移除此行">-</button>
            </div>
        `;
        selectorsContainer.appendChild(row);
        
        // 添加选择器优化提示
        const optimizeDiv = document.createElement('div');
        optimizeDiv.className = 'selector-optimize';
        optimizeDiv.style.display = 'none';
        optimizeDiv.innerHTML = `
            <span>检测到行号选择器，点击优化可获取所有行数据</span>
            <button class="optimize-btn">优化选择器</button>
        `;
        row.appendChild(optimizeDiv);
        
        // 为加号按钮添加事件监听器
        const addBtn = row.querySelector('.add-btn');
        addBtn.addEventListener('click', () => {
            const newRow = addSelectorRow();
            row.parentNode.insertBefore(newRow, row);
        });
        
        // 为优化按钮添加事件监听器
        const optimizeBtn = optimizeDiv.querySelector('.optimize-btn');
        optimizeBtn.addEventListener('click', () => {
            optimizeSelector(optimizeBtn);
        });
        
        // 监听输入变化，检测是否需要优化
        const input = row.querySelector('.selector-input');
        input.addEventListener('input', () => {
            const selector = input.value.trim();
            if (selector && (selector.includes(':nth-child(') || selector.includes(':nth-of-type('))) {
                optimizeDiv.style.display = 'block';
            } else {
                optimizeDiv.style.display = 'none';
            }
        });
        
        row.querySelector('.remove-btn').addEventListener('click', () => {
            row.remove();
            // 如果移除了所有选择器，隐藏预览区域
            if (selectorsContainer.children.length === 0) {
                previewSection.style.display = 'none';
            }
        });
        
        return row;
    }

    function previewData() {
        const selectorInputs = panel.querySelectorAll('.selector-input');
        const selectors = Array.from(selectorInputs).map(input => input.value.trim()).filter(Boolean);

        if (selectors.length === 0) {
            alert('请输入至少一个CSS选择器！');
            return;
        }

        const columnsData = [];
        const validSelectors = [];
        let hasError = false;

        selectors.forEach((selector, index) => {
            try {
                const elements = Array.from(document.querySelectorAll(selector));
                const data = elements.map(el => el.innerText.trim());
                columnsData.push(data);
                validSelectors.push(selector);
            } catch (e) {
                alert(`选择器 "${selector}" 无效，请检查语法！`);
                hasError = true;
            }
        });

        if (hasError) return;

        const maxRows = Math.max(0, ...columnsData.map(col => col.length));
        if (maxRows === 0) {
            previewContent.innerHTML = '<div style="text-align: center; color: #6c757d; padding: 20px;">没有找到任何数据</div>';
            previewInfo.innerHTML = '根据您提供的选择器，没有在页面上找到任何内容。';
            previewSection.style.display = 'block';
            return;
        }

        // 处理数据积累
        let displayData = [];
        let totalRows = maxRows;
        let addedCount = 0;

        if (isAccumulationMode) {
            // 将当前页面数据转换为行格式
            const currentPageData = [];
            for (let i = 0; i < maxRows; i++) {
                const row = columnsData.map(col => col[i] || '');
                currentPageData.push(row);
            }
            
            // 添加到积累池
            addedCount = addToAccumulatedData(currentPageData);
            
            // 使用积累的数据进行显示
            displayData = accumulatedData;
            totalRows = accumulatedData.length;
            
            // 更新积累信息
            const info = panel.querySelector('#accumulation-info');
            info.textContent = `开启 - 已积累 ${accumulatedData.length} 行数据 (本次新增 ${addedCount} 行)，点击"预览和积累"会继续积累`;
        } else {
            // 普通模式，直接使用当前页面数据
            for (let i = 0; i < maxRows; i++) {
                const row = columnsData.map(col => col[i] || '');
                displayData.push(row);
            }
        }

        // 创建预览表格
        let tableHTML = '<table class="preview-table"><thead><tr>';
        validSelectors.forEach(selector => {
            tableHTML += `<th>${selector.length > 20 ? selector.substring(0, 20) + '...' : selector}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        // 只显示前3行数据
        const previewRows = Math.min(3, totalRows);
        for (let i = 0; i < previewRows; i++) {
            tableHTML += '<tr>';
            displayData[i].forEach(cellData => {
                const displayData = cellData.length > 30 ? cellData.substring(0, 30) + '...' : cellData;
                tableHTML += `<td title="${cellData.replace(/"/g, '&quot;')}">${displayData}</td>`;
            });
            tableHTML += '</tr>';
        }
        tableHTML += '</tbody></table>';

        previewContent.innerHTML = tableHTML;
        
        // 更新预览信息
        let infoText = `共找到 ${totalRows} 行数据，显示前 ${previewRows} 行。列数: ${validSelectors.length}`;
        if (isAccumulationMode && addedCount > 0) {
            infoText += ` (本次新增 ${addedCount} 行)`;
        }
        previewInfo.innerHTML = infoText;
        previewSection.style.display = 'block';
    }

    function exportToCsv() {
        const selectorInputs = panel.querySelectorAll('.selector-input');
        const selectors = Array.from(selectorInputs).map(input => input.value.trim()).filter(Boolean);

        if (selectors.length === 0) {
            alert('请输入至少一个CSS选择器！');
            return;
        }

        let exportData = [];
        let fileName = 'content_export';

        if (isAccumulationMode && accumulatedData.length > 0) {
            // 导出积累的数据
            exportData = accumulatedData;
            fileName = `accumulated_export_${accumulatedData.length}rows`;
        } else {
            // 导出当前页面数据
            const columnsData = selectors.map(selector => {
                try {
                    const elements = Array.from(document.querySelectorAll(selector));
                    const data = elements.map(el => el.innerText.trim());
                    return data;
                } catch (e) {
                    alert('选择器 "' + selector + '" 无效，请检查语法！');
                    return null;
                }
            });

            if (columnsData.some(col => col === null)) return;

            const maxRows = Math.max(0, ...columnsData.map(col => col.length));
            if (maxRows === 0) {
                alert('根据您提供的选择器，没有在页面上找到任何内容。');
                return;
            }

            // 将列数据转换为行数据
            for (let i = 0; i < maxRows; i++) {
                const row = columnsData.map(col => col[i] || '');
                exportData.push(row);
            }
            fileName = 'current_page_export';
        }

        if (exportData.length === 0) {
            alert('没有数据可以导出！');
            return;
        }

        // 生成CSV内容
        let csvContent = '';
        const header = selectors.map(s => `"${s.replace(/"/g, '""')}"`).join(',');
        csvContent += header + '\r\n';

        exportData.forEach(row => {
            const rowData = row.map(cellData => `"${String(cellData).replace(/"/g, '""')}"`);
            csvContent += rowData.join(',') + '\r\n';
        });

        // 使用Blob方式导出，避免URL长度限制
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        
        try {
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `${fileName}_${new Date().toISOString().slice(0,10)}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                
                // 使用setTimeout避免同步点击问题
                setTimeout(() => {
                    try {
                        link.click();
                    } catch (e) {
                        console.warn('点击下载链接失败，尝试降级方案:', e);
                        // 降级方案
                        const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent('\ufeff' + csvContent);
                        window.open(dataUrl);
                    }
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);
            } else {
                // 降级方案：使用data URL
                const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent('\ufeff' + csvContent);
                window.open(dataUrl);
            }
        } catch (e) {
            console.error('导出CSV失败:', e);
            // 提供备用方案：复制到剪贴板
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(csvContent).then(() => {
                    alert('导出失败，但数据已复制到剪贴板，您可以粘贴到Excel或其他应用中');
                }).catch(() => {
                    alert('导出失败，请检查浏览器设置');
                });
            } else {
                alert('导出失败，请检查浏览器设置');
            }
        }

        // 显示成功提示
        const originalText = panel.querySelector('#export-csv-btn').textContent;
        const exportBtn = panel.querySelector('#export-csv-btn');
        exportBtn.textContent = `✅ 已导出 ${exportData.length} 行`;
        exportBtn.style.backgroundColor = '#28a745';
        setTimeout(() => {
            exportBtn.textContent = originalText;
            exportBtn.style.backgroundColor = '#007bff';
        }, 2000);
    }

    // 5. 绑定事件
    panel.querySelector('#preview-btn').addEventListener('click', previewData);
    panel.querySelector('#export-csv-btn').addEventListener('click', exportToCsv);
    panel.querySelector('#close-panel-btn').addEventListener('click', toggleExtractorPanel);
    
    // 绑定积累模式相关事件
    panel.querySelector('#accumulation-toggle').addEventListener('click', toggleAccumulationMode);
    panel.querySelector('#clear-accumulated-btn').addEventListener('click', clearAccumulatedData);
    
    // 绑定组管理相关事件
    panel.querySelector('#save-group-btn').addEventListener('click', showGroupModal);
    panel.querySelector('#load-group-btn').addEventListener('click', showGroupModal);
    panel.querySelector('#group-modal-close').addEventListener('click', closeGroupModal);
    panel.querySelector('#save-current-group-btn').addEventListener('click', saveCurrentGroup);
    
    // 使用事件委托处理动态生成的按钮
    panel.addEventListener('click', function(e) {
        if (e.target.classList.contains('group-item-btn')) {
            const action = e.target.getAttribute('data-action');
            const index = parseInt(e.target.getAttribute('data-index'));
            
            if (action === 'load') {
                loadGroup(index);
            } else if (action === 'delete') {
                deleteGroup(index);
            }
        } else if (e.target.classList.contains('add-btn')) {
            // 处理"+"按钮点击
            e.preventDefault();
            addSelectorRow();
        } else if (e.target.classList.contains('remove-btn')) {
            // 处理"-"按钮点击
            e.preventDefault();
            const row = e.target.closest('.selector-row');
            if (row) {
                row.remove();
            }
        }
    });
    
    // 初始化加载保存的组
    loadSavedGroups();
    
    // 组管理相关函数
    function showGroupModal() {
        const modal = panel.querySelector('#group-modal');
        modal.classList.add('open');
        renderGroupList();
    }
    
    function closeGroupModal() {
        const modal = panel.querySelector('#group-modal');
        modal.classList.remove('open');
    }
    
    function saveCurrentGroup() {
        const nameInput = panel.querySelector('#group-name-input');
        const groupName = nameInput.value.trim();
        
        if (!groupName) {
            alert('请输入组名称！');
            return;
        }
        
        const currentSelectors = Array.from(panel.querySelectorAll('.selector-input'))
            .map(input => input.value.trim())
            .filter(selector => selector);
        
        if (currentSelectors.length === 0) {
            alert('当前没有选择器可以保存！');
            return;
        }
        
        const groupData = {
            name: groupName,
            selectors: currentSelectors,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        
        const savedGroups = JSON.parse(localStorage.getItem('extractorGroups') || '[]');
        savedGroups.push(groupData);
        localStorage.setItem('extractorGroups', JSON.stringify(savedGroups));
        
        nameInput.value = '';
        renderGroupList();
        alert(`组 "${groupName}" 保存成功！`);
    }
    
    function renderGroupList() {
        const groupList = panel.querySelector('#group-list');
        const savedGroups = JSON.parse(localStorage.getItem('extractorGroups') || '[]');
        
        if (savedGroups.length === 0) {
            groupList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无保存的组</div>';
            return;
        }
        
        groupList.innerHTML = savedGroups.map((group, index) => `
            <div class="group-item">
                <div class="group-item-info">
                    <div class="group-item-name">${group.name}</div>
                    <div class="group-item-path">${new URL(group.url).pathname}</div>
                </div>
                <div class="group-item-actions">
                    <button class="group-item-btn group-load-btn" data-action="load" data-index="${index}">加载</button>
                    <button class="group-item-btn group-delete-btn" data-action="delete" data-index="${index}">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    function loadGroup(index) {
        const savedGroups = JSON.parse(localStorage.getItem('extractorGroups') || '[]');
        const group = savedGroups[index];
        
        if (!group) {
            alert('组不存在！');
            return;
        }
        
        // 清空当前选择器
        const selectorsContainer = panel.querySelector('#selectors-container');
        selectorsContainer.innerHTML = '';
        
        // 添加新的选择器
        group.selectors.forEach(selector => {
            addSelectorRow(selector);
        });
        
        closeGroupModal();
        alert(`已加载组 "${group.name}"，包含 ${group.selectors.length} 个选择器`);
    }
    
    function deleteGroup(index) {
        const savedGroups = JSON.parse(localStorage.getItem('extractorGroups') || '[]');
        const group = savedGroups[index];
        
        if (!group) {
            alert('组不存在！');
            return;
        }
        
        if (confirm(`确定要删除组 "${group.name}" 吗？`)) {
            savedGroups.splice(index, 1);
            localStorage.setItem('extractorGroups', JSON.stringify(savedGroups));
            renderGroupList();
            alert('组已删除！');
        }
    }
    
    // 6. 添加拖拽功能
    (function makeDraggable(panel) {
        const header = panel.querySelector('.extractor-header');
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target.id === 'close-panel-btn') return;

            isDragging = true;
            const panelRect = panel.getBoundingClientRect();
            offsetX = e.clientX - panelRect.left;
            offsetY = e.clientY - panelRect.top;

            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;

            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - panel.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - panel.offsetHeight));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = '';
        }

        function onMouseUp() {
            isDragging = false;
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    })(panel);

})();

// 暴露函数到全局作用域
window.loadGroup = function(index) {
    const savedGroups = JSON.parse(localStorage.getItem('extractorGroups') || '[]');
    const group = savedGroups[index];
    
    if (!group) {
        alert('组不存在！');
        return;
    }
    
    // 清空当前选择器
    const selectorsContainer = document.querySelector('#selectors-container');
    if (selectorsContainer) {
        selectorsContainer.innerHTML = '';
        
        // 添加新的选择器
        group.selectors.forEach(selector => {
            // 创建新的选择器行
            const row = document.createElement('div');
            row.className = 'selector-row';
            row.innerHTML = `
                <div class="selector-input-row">
                    <button class="add-btn" onclick="addSelectorRow()">+</button>
                    <input type="text" class="selector-input" placeholder="请从控制台复制选择器并粘贴" value="${selector}">
                    <button class="remove-btn" onclick="this.parentElement.parentElement.remove()">-</button>
                </div>
                <div class="selector-optimize" style="display: none;">
                    <button class="optimize-btn" onclick="optimizeSelector(this)">🔧 优化选择器</button>
                </div>
            `;
            selectorsContainer.appendChild(row);
        });
        
        // 关闭模态框
        const modal = document.querySelector('#group-modal');
        if (modal) {
            modal.classList.remove('open');
        }
        
        alert(`已加载组 "${group.name}"，包含 ${group.selectors.length} 个选择器`);
    }
};

window.deleteGroup = function(index) {
    const savedGroups = JSON.parse(localStorage.getItem('extractorGroups') || '[]');
    const group = savedGroups[index];
    
    if (!group) {
        alert('组不存在！');
        return;
    }
    
    if (confirm(`确定要删除组 "${group.name}" 吗？`)) {
        savedGroups.splice(index, 1);
        localStorage.setItem('extractorGroups', JSON.stringify(savedGroups));
        
        // 重新渲染组列表
        const groupList = document.querySelector('#group-list');
        if (groupList) {
            if (savedGroups.length === 0) {
                groupList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无保存的组</div>';
            } else {
                groupList.innerHTML = savedGroups.map((group, index) => `
                    <div class="group-item">
                        <div class="group-item-info">
                            <div class="group-item-name">${group.name}</div>
                            <div class="group-item-path">${new URL(group.url).pathname}</div>
                        </div>
                        <div class="group-item-actions">
                            <button class="group-item-btn group-load-btn" data-action="load" data-index="${index}">加载</button>
                            <button class="group-item-btn group-delete-btn" data-action="delete" data-index="${index}">删除</button>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        alert('组已删除！');
    }
};

// 暴露其他必要的函数到全局作用域
window.addSelectorRow = function(value = '') {
    const selectorsContainer = document.querySelector('#selectors-container');
    if (selectorsContainer) {
        const row = document.createElement('div');
        row.className = 'selector-row';
        row.innerHTML = `
            <div class="selector-input-row">
                <button class="add-btn" onclick="addSelectorRow()">+</button>
                <input type="text" class="selector-input" placeholder="请从控制台复制选择器并粘贴" value="${value}">
                <button class="remove-btn" onclick="this.parentElement.parentElement.remove()">-</button>
            </div>
            <div class="selector-optimize" style="display: none;">
                <button class="optimize-btn" onclick="optimizeSelector(this)">🔧 优化选择器</button>
            </div>
        `;
        selectorsContainer.appendChild(row);
        return row;
    }
};

window.optimizeSelector = function(button) {
    const row = button.closest('.selector-row');
    const input = row.querySelector('.selector-input');
    const optimizeDiv = row.querySelector('.selector-optimize');
    
    if (!input.value.trim()) {
        alert('请先输入选择器！');
        return;
    }
    
    // 显示优化选项
    optimizeDiv.style.display = 'block';
    optimizeDiv.innerHTML = `
        <div class="optimize-options">
            <button class="optimize-option" onclick="applyOptimization(this, 'remove-nth')">移除行号限制</button>
            <button class="optimize-option" onclick="applyOptimization(this, 'generalize')">通用化选择器</button>
            <button class="optimize-option" onclick="applyOptimization(this, 'parent')">使用父级选择器</button>
            <button class="optimize-option" onclick="applyOptimization(this, 'class-only')">仅保留类名</button>
        </div>
    `;
};

window.applyOptimization = function(button, type) {
    const row = button.closest('.selector-row');
    const input = row.querySelector('.selector-input');
    const originalSelector = input.value.trim();
    
    let optimizedSelector = originalSelector;
    
    switch (type) {
        case 'remove-nth':
            optimizedSelector = originalSelector.replace(/:nth-child\(\d+\)/g, '');
            optimizedSelector = optimizedSelector.replace(/:nth-of-type\(\d+\)/g, '');
            break;
        case 'generalize':
            optimizedSelector = originalSelector.replace(/\d+/g, '');
            break;
        case 'parent': {
            const parts = originalSelector.split(' > ');
            if (parts.length > 1) {
                optimizedSelector = parts.slice(0, -1).join(' > ');
            }
            break;
        }
        case 'class-only': {
            const classMatch = originalSelector.match(/\.[\w-]+/g);
            if (classMatch) {
                optimizedSelector = classMatch.join('');
            }
            break;
        }
    }
    
    input.value = optimizedSelector;
    
    // 验证优化结果
    try {
        const elements = document.querySelectorAll(optimizedSelector);
        const originalElements = document.querySelectorAll(originalSelector);
        
        if (elements.length > originalElements.length) {
            alert(`✅ 优化成功！从 ${originalElements.length} 个元素扩展到 ${elements.length} 个元素`);
        } else if (elements.length === originalElements.length) {
            alert(`⚠️ 优化后仍匹配 ${elements.length} 个元素，可能没有扩展匹配范围`);
        } else {
            alert(`❌ 优化后只匹配 ${elements.length} 个元素，请检查选择器`);
        }
    } catch (e) {
        alert(`❌ 选择器语法错误: ${e.message}`);
    }
    
    // 隐藏优化选项
    const optimizeDiv = row.querySelector('.selector-optimize');
    optimizeDiv.style.display = 'none';
};
