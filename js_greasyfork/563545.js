// ==UserScript==
// @name         弹窗弹层的样式
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  弹窗弹层的样式文件
// @author       lulu
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
        /* 控制面板样式 */
        .data-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-width: 300px;
            max-width: 350px;
            max-height: 85vh;
            overflow-y: auto;
        }

        .panel-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 12px 12px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }

        .panel-title {
            font-weight: 600;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .panel-controls {
            display: flex;
            gap: 8px;
        }

        .panel-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .panel-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .panel-content {
            padding: 20px;
        }

        /* 开关样式 */
        .switch-container {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .switch-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .switch-title {
            font-weight: 600;
            font-size: 14px;
            color: #333;
        }

        .switch-toggle {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }

        .switch-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .switch-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }

        .switch-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .switch-slider {
            background-color: #4cd964;
        }

        input:checked + .switch-slider:before {
            transform: translateX(26px);
        }

        .switch-status {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
        }

        /* 数据分类样式 */
        .data-category {
            margin-bottom: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            background: #fafafa;
        }

        .category-header {
            background: #f8f9fa;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            border-bottom: 1px solid transparent;
        }

        .category-header.expanded {
            border-bottom-color: #e0e0e0;
        }

        .category-title {
            font-weight: 600;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            color: #333;
        }

        .category-count {
            background: #667eea;
            color: white;
            border-radius: 10px;
            padding: 2px 8px;
            font-size: 11px;
            min-width: 20px;
            text-align: center;
        }

        .category-controls {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .category-controls button {
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }

        .category-controls button:hover {
            background: #5a6fd8;
            transform: translateY(-1px);
        }

        .category-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .category-content.expanded {
            max-height: 400px;
            overflow-y: auto;
        }

        /* 数据项样式 */
        .data-item {
            padding: 12px;
            border-bottom: 1px solid #f0f0f0;
            background: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .data-item:last-child {
            border-bottom: none;
        }

        .item-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }

        .item-title {
            font-size: 12px;
            color: #333;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .item-time {
            font-size: 11px;
            color: #666;
        }

        .item-actions {
            display: flex;
            gap: 6px;
            margin-left: 10px;
            flex-shrink: 0;
        }

        .item-btn {
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            min-height: 28px;
        }

        .item-btn:hover {
            background: #5a6fd8;
            transform: translateY(-1px);
        }

        .item-btn.small {
            padding: 4px 8px;
            font-size: 10px;
        }

        .item-btn.request {
            background: #f39c12;
        }

        .item-btn.request:hover {
            background: #e67e22;
        }

        .item-btn.save {
            background: #27ae60;
        }

        .item-btn.save:hover {
            background: #219653;
        }

        .empty-state {
            text-align: center;
            padding: 30px 20px;
            color: #999;
            font-size: 13px;
        }

        .empty-state-icon {
            font-size: 24px;
            margin-bottom: 10px;
            opacity: 0.5;
        }

        /* 清空按钮 */
        .clear-all-btn {
            width: 100%;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            margin-top: 20px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .clear-all-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        /* 请求参数查看器样式 */
        .request-info-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 100000;
            width: 800px;
            height: 600px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .viewer-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }

        .viewer-title {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .viewer-controls {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .viewer-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .viewer-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .viewer-content {
            flex: 1;
            overflow: auto;
            padding: 20px;
            background: #f8f9fa;
        }

        .viewer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
        }

        /* 请求参数查看器样式 */
        .request-tabs {
            display: flex;
            background: #f8f9fa;
            border-bottom: 1px solid #e0e0e0;
            padding: 0 20px;
            flex-shrink: 0;
        }

        .request-tab {
            padding: 12px 20px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            font-size: 13px;
            font-weight: 500;
            color: #666;
            transition: all 0.2s;
            white-space: nowrap;
        }

        .request-tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
            background: white;
        }

        .request-tab-content {
            flex: 1;
            overflow: auto;
            padding: 20px;
            background: white;
            display: none;
        }

        .request-tab-content.active {
            display: block;
        }

        .request-detail-item {
            margin-bottom: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .request-detail-label {
            font-weight: 600;
            font-size: 12px;
            color: #667eea;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .request-detail-value {
            font-size: 13px;
            color: #333;
            word-break: break-all;
            white-space: pre-wrap;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            padding: 10px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            margin-top: 5px;
            max-height: 400px;
            overflow-y: auto;
        }

        .request-form-data {
            background: white;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
            margin-top: 5px;
            max-height: 400px;
            overflow-y: auto;
        }

        .form-data-item {
            padding: 8px 10px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .form-data-item:last-child {
            border-bottom: none;
        }

        .form-data-key {
            font-weight: 600;
            font-size: 12px;
            color: #333;
            min-width: 120px;
            flex-shrink: 0;
        }

        .form-data-value {
            flex: 1;
            font-size: 12px;
            color: #666;
            word-break: break-all;
            margin-left: 10px;
        }

        /* JSON查看器容器 */
        .json-viewer-container {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
            max-height: 450px;
            overflow-y: auto;
        }

        /* Toast提示 */
        .toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 100001;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            font-size: 14px;
            pointer-events: none;
        }

        .toast.success {
            background: rgba(76, 217, 100, 0.9);
        }

        .toast.error {
            background: rgba(255, 68, 68, 0.9);
        }

        /* 响应式调整 */
        @media (max-width: 850px) {
            .request-info-modal {
                width: 95vw;
                height: 80vh;
            }

            .data-panel {
                max-width: 95vw;
                right: 10px;
                left: 10px;
            }
        }

        /* JSON查看器样式调整 */
        .jv-container {
            background: #fff !important;
            padding: 15px !important;
            border-radius: 8px !important;
            border: 1px solid #e0e0e0 !important;
            height: 100% !important;
            overflow: auto !important;
        }

        .jv-code {
            background: #f8f9fa !important;
            padding: 20px !important;
            border-radius: 8px !important;
        }
    `);