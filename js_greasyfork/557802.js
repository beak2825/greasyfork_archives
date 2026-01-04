// ==UserScript==
// @name         豆包描述词
// @namespace    https://greasyfork.org/zh-CN/scripts/557802
// @version      6.6
// @description  豆包描述词助手 - 支持隐藏/显示界面
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZUAAAGQCAYAAABmlv2IAAAACXBIWXMAAC4jAAAuIwF4pT92AAAHvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA1LTE5VDE2OjUyOjA3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NDlhZWM5Zi0yZTljLWZkNDMtOGEwMS05NzAxYTM1ZjIxNWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2ZGM4ODUyNy1mOTQ4LWUwNDEtYmM3Mi1lZGQzYWU2YTEzMzYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYjM1YmFiMy01Yjc5LWU0NGItODg5Ny0yNjcwMzgxZTIyNjQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozYjM1YmFiMy01Yjc5LWU0NGItODg5Ny0yNjcwMzgxZTIyNjQiIHN0RXZ0OndoZW49IjIwMjAtMTItMDFUMjI6MjM6MDUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjg0OWFlYzlmLTJlOWMtZmQ0My04YTAxLTk3MDFhMzVmMjE1YiIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0wMVQyMjoyMzowNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9Inht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
// @author       YaHee,
// @match        *://*.doubao.com/*
// @match        *://*.volcengine.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @license      GPL License

// @downloadURL https://update.greasyfork.org/scripts/557802/%E8%B1%86%E5%8C%85%E6%8F%8F%E8%BF%B0%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/557802/%E8%B1%86%E5%8C%85%E6%8F%8F%E8%BF%B0%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义CSS样式
    GM_addStyle(`
        /* 主容器样式 */
        .custom-desc-container {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 160px;
            background: linear-gradient(145deg, #ffffff, #f8f9ff);
            border-radius: 10px;
            z-index: 999999;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
            border: 2px solid #4c7bf6;
            box-shadow: 0 6px 20px rgba(76, 123, 246, 0.2);
            overflow: hidden;
            max-height: 600px;
            transition: all 0.3s ease;
        }

        /* 隐藏状态下的图标容器 */
        .mini-icon-container {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #4c7bf6 0%, #3a5fda 100%);
            border-radius: 50%;
            z-index: 999999;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(76, 123, 246, 0.3);
            transition: all 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .mini-icon-container:hover {
            background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
            transform: scale(1.1);
            box-shadow: 0 6px 18px rgba(255, 126, 95, 0.4);
        }

        .mini-icon {
            color: white;
            font-size: 20px;
            font-weight: bold;
            user-select: none;
        }

        /* 隐藏状态 */
        .custom-desc-container.hidden {
            transform: scale(0);
            opacity: 0;
            pointer-events: none;
        }

        /* 头部样式 */
        .desc-header {
            background: linear-gradient(135deg, #4c7bf6 0%, #3a5fda 100%);
            color: white;
            padding: 10px 12px;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            text-align: center;
            letter-spacing: 0.5px;
        }

        .desc-header span {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 700;
            justify-content: center;
            flex: 1;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .desc-header-actions {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* 内容区域 */
        .desc-content {
            padding: 8px;
            max-height: 500px;
            overflow-y: auto;
        }

        /* 描述词按钮容器 - 紧凑单列布局 */
        .desc-buttons-single {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        /* 描述词按钮样式 - 紧凑醒目版 */
        .desc-btn {
            background: linear-gradient(135deg, #4c7bf6 0%, #3a5fda 100%);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 6px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 700;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: center;
            display: block;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            box-shadow: 0 3px 8px rgba(76, 123, 246, 0.3);
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .desc-btn:hover {
            background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 5px 15px rgba(255, 126, 95, 0.4);
            z-index: 10;
        }

        .desc-btn:active {
            transform: translateY(0) scale(0.98);
        }

        /* 为不同描述词添加不同颜色标识 */
        .desc-btn:nth-child(1) { background: linear-gradient(135deg, #4c7bf6 0%, #3a5fda 100%); }
        .desc-btn:nth-child(2) { background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%); }
        .desc-btn:nth-child(3) { background: linear-gradient(135deg, #2ed573 0%, #1dc954 100%); }
        .desc-btn:nth-child(4) { background: linear-gradient(135deg, #ffa502 0%, #e59400 100%); }
        .desc-btn:nth-child(5) { background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); }
        .desc-btn:nth-child(6) { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); }
        .desc-btn:nth-child(7) { background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%); }
        .desc-btn:nth-child(8) { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); }
        .desc-btn:nth-child(9) { background: linear-gradient(135deg, #f39c12 0%, #d35400 100%); }
        .desc-btn:nth-child(10) { background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); }

        .desc-btn:nth-child(1):hover { background: linear-gradient(135deg, #3a6bf5 0%, #2a4fc9 100%); }
        .desc-btn:nth-child(2):hover { background: linear-gradient(135deg, #ff6b47 0%, #fea45c 100%); }
        .desc-btn:nth-child(3):hover { background: linear-gradient(135deg, #28c46a 0%, #1abe51 100%); }
        .desc-btn:nth-child(4):hover { background: linear-gradient(135deg, #ff9500 0%, #e88a00 100%); }
        .desc-btn:nth-child(5):hover { background: linear-gradient(135deg, #8e4aaf 0%, #7e3a9f 100%); }
        .desc-btn:nth-child(6):hover { background: linear-gradient(135deg, #2e8adc 0%, #2670b9 100%); }
        .desc-btn:nth-child(7):hover { background: linear-gradient(135deg, #18ab9a 0%, #149085 100%); }
        .desc-btn:nth-child(8):hover { background: linear-gradient(135deg, #e63c2c 0%, #b02a1b 100%); }
        .desc-btn:nth-child(9):hover { background: linear-gradient(135deg, #f28c00 0%, #c35400 100%); }
        .desc-btn:nth-child(10):hover { background: linear-gradient(135deg, #2c3e4e 0%, #1c2e40 100%); }

        /* 统计信息 */
        .stats {
            font-size: 14px;
            color: white;
            text-align: center;
            padding: 8px 0;
            border-top: 2px solid rgba(255, 255, 255, 0.3);
            background: linear-gradient(135deg, #4c7bf6 0%, #3a5fda 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            font-weight: 700;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        .stats-icon {
            font-size: 12px;
            color: white;
        }

        /* 设置按钮样式 */
        .settings-btn {
            background: rgba(255, 255, 255, 0.25);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            transition: all 0.2s ease;
            backdrop-filter: blur(5px);
            font-weight: bold;
        }

        .settings-btn:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        /* 隐藏/显示按钮样式 */
        .toggle-btn {
            background: rgba(255, 255, 255, 0.25);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            transition: all 0.2s ease;
            backdrop-filter: blur(5px);
            font-weight: bold;
        }

        .toggle-btn:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        /* 模态框样式 */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 999999;
            backdrop-filter: blur(5px);
        }

        .settings-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 0;
            border-radius: 12px;
            border: 2px solid #4c7bf6;
            z-index: 1000000;
            width: 500px;
            max-width: 90vw;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .settings-modal-header {
            background: linear-gradient(135deg, #4c7bf6 0%, #3a5fda 100%);
            color: white;
            padding: 16px 24px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 12px 12px 0 0;
            text-align: center;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .settings-modal-content {
            padding: 20px;
            max-height: calc(80vh - 70px);
            overflow-y: auto;
        }

        /* 数据操作按钮 */
        .data-actions {
            display: flex;
            gap: 8px;
            margin: 16px 0;
            flex-wrap: wrap;
            justify-content: center;
        }

        .data-action-btn {
            background: linear-gradient(135deg, var(--btn-bg-start), var(--btn-bg-end));
            color: white;
            border: none;
            padding: 10px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 700;
            flex: 1;
            min-width: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            text-align: center;
            transition: all 0.2s ease;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        .data-action-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }

        .export-btn {
            --btn-bg-start: #4c7bf6;
            --btn-bg-end: #3a5fda;
        }

        .import-btn {
            --btn-bg-start: #ffa502;
            --btn-bg-end: #e59400;
        }

        .reset-btn {
            --btn-bg-start: #ff4757;
            --btn-bg-end: #ff3742;
        }

        /* 描述词列表项 */
        .desc-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 16px;
        }

        .desc-item {
            background: linear-gradient(135deg, #f8f9ff 0%, #edf0ff 100%);
            border: 2px solid rgba(76, 123, 246, 0.3);
            border-radius: 8px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: all 0.2s ease;
        }

        .desc-item:hover {
            transform: translateX(3px);
            box-shadow: 0 5px 15px rgba(76, 123, 246, 0.2);
        }

        .desc-item-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        .desc-item-display {
            font-weight: 700;
            color: #4c7bf6;
            font-size: 14px;
            flex: 1;
            word-break: break-word;
            text-align: center;
            padding: 4px 8px;
            background: rgba(76, 123, 246, 0.1);
            border-radius: 6px;
            border: 1px solid rgba(76, 123, 246, 0.2);
        }

        .desc-item-content {
            color: #495057;
            font-size: 12px;
            line-height: 1.4;
            background: white;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid rgba(76, 123, 246, 0.1);
            max-height: 100px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-word;
            text-align: left;
        }

        .desc-item-actions {
            display: flex;
            gap: 6px;
            justify-content: center;
        }

        /* 按钮样式 */
        .btn {
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 12px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            transition: all 0.2s ease;
            text-align: center;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        .btn-sm {
            padding: 5px 10px;
            font-size: 11px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #4c7bf6 0%, #3a5fda 100%);
            color: white;
            box-shadow: 0 3px 8px rgba(76, 123, 246, 0.25);
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #3a6bf5 0%, #2a4fc9 100%);
            transform: translateY(-2px);
            box-shadow: 0 5px 12px rgba(76, 123, 246, 0.35);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            color: white;
        }

        .btn-secondary:hover {
            background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
            transform: translateY(-2px);
        }

        .btn-danger {
            background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
            color: white;
            box-shadow: 0 3px 8px rgba(255, 71, 87, 0.25);
        }

        .btn-danger:hover {
            background: linear-gradient(135deg, #ff3742 0%, #ff2631 100%);
            transform: translateY(-2px);
            box-shadow: 0 5px 12px rgba(255, 71, 87, 0.35);
        }

        .btn-success {
            background: linear-gradient(135deg, #2ed573 0%, #1dc954 100%);
            color: white;
        }

        /* 表单控件 */
        .form-group {
            margin-bottom: 12px;
        }

        .form-label {
            display: block;
            margin-bottom: 6px;
            color: #4c7bf6;
            font-weight: 700;
            font-size: 13px;
            text-align: center;
        }

        .form-control {
            width: 100%;
            padding: 8px 10px;
            border: 2px solid rgba(76, 123, 246, 0.3);
            border-radius: 6px;
            font-size: 13px;
            background: white;
            box-sizing: border-box;
            text-align: center;
            transition: all 0.2s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: #4c7bf6;
            box-shadow: 0 0 0 3px rgba(76, 123, 246, 0.1);
        }

        .form-control::placeholder {
            color: #adb5bd;
            text-align: center;
        }

        /* 添加按钮 */
        .add-btn {
            background: linear-gradient(135deg, #2ed573 0%, #1dc954 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 8px;
            transition: all 0.2s ease;
            box-shadow: 0 3px 8px rgba(46, 213, 115, 0.25);
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        .add-btn:hover {
            background: linear-gradient(135deg, #28c46a 0%, #1abe51 100%);
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(46, 213, 115, 0.35);
        }

        /* 文件导入区域 */
        .file-import-area {
            border: 2px dashed rgba(76, 123, 246, 0.4);
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            margin: 12px 0;
            cursor: pointer;
            background: linear-gradient(135deg, #f8f9ff 0%, #edf0ff 100%);
            transition: all 0.2s ease;
        }

        .file-import-area:hover {
            border-color: #4c7bf6;
            background: linear-gradient(135deg, #edf0ff 0%, #e2e8ff 100%);
            transform: translateY(-3px);
        }

        .file-import-icon {
            font-size: 28px;
            margin-bottom: 10px;
            color: #4c7bf6;
        }

        .file-import-text {
            color: #495057;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 6px;
        }

        .file-import-hint {
            font-size: 12px;
            color: #6c757d;
        }

        /* 预览区域 */
        .import-preview {
            margin-top: 12px;
            padding: 12px;
            background: linear-gradient(135deg, #f8f9ff 0%, #edf0ff 100%);
            border-radius: 8px;
            border: 2px solid rgba(76, 123, 246, 0.2);
            max-height: 120px;
            overflow-y: auto;
        }

        .import-preview-title {
            margin-top: 0;
            color: #4c7bf6;
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 10px;
            text-align: center;
        }

        .import-preview-item {
            font-size: 12px;
            padding: 6px 0;
            border-bottom: 1px solid rgba(76, 123, 246, 0.1);
            color: #495057;
            text-align: center;
        }

        .import-preview-item:last-child {
            border-bottom: none;
        }

        /* 导入选项 */
        .import-options {
            margin: 12px 0;
            padding: 12px;
            background: linear-gradient(135deg, #f8f9ff 0%, #edf0ff 100%);
            border-radius: 8px;
            border: 2px solid rgba(76, 123, 246, 0.2);
        }

        .import-option {
            margin: 8px 0;
        }

        .import-option label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 13px;
            color: #495057;
            justify-content: center;
            font-weight: 600;
        }

        .import-option input[type="radio"] {
            margin: 0;
            accent-color: #4c7bf6;
            transform: scale(1.2);
        }

        /* 操作按钮行 */
        .action-buttons-row {
            display: flex;
            gap: 8px;
            margin-top: 16px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .action-buttons-row .btn {
            flex: 1;
            min-width: 90px;
        }

        /* 确认对话框 */
        .confirm-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 16px;
            border-radius: 8px;
            border: 2px solid #4c7bf6;
            z-index: 1000001;
            width: 300px;
            max-width: 90vw;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            text-align: center;
        }

        .confirm-modal-title {
            margin-top: 0;
            color: #4c7bf6;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .confirm-modal-text {
            margin-bottom: 16px;
            color: #495057;
            line-height: 1.4;
            font-size: 13px;
        }

        .confirm-modal-actions {
            display: flex;
            gap: 8px;
            justify-content: center;
        }

        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(76, 123, 246, 0.05);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(76, 123, 246, 0.4);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(76, 123, 246, 0.6);
        }

        /* 通知样式 */
        .custom-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 18px;
            border-radius: 8px;
            z-index: 1000001;
            font-size: 13px;
            font-weight: 700;
            background: linear-gradient(135deg, #4c7bf6 0%, #3a5fda 100%);
            color: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            max-width: 280px;
            text-align: center;
            animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
        }

        .custom-notification.success {
            background: linear-gradient(135deg, #2ed573 0%, #1dc954 100%);
        }

        .custom-notification.warning {
            background: linear-gradient(135deg, #ffa502 0%, #e59400 100%);
        }

        .custom-notification.danger {
            background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
        }

        /* 空状态提示 */
        .empty-state {
            text-align: center;
            padding: 25px 12px;
            color: #6c757d;
        }

        .empty-state-icon {
            font-size: 32px;
            margin-bottom: 10px;
            opacity: 0.6;
            color: #4c7bf6;
        }

        .empty-state-text {
            font-size: 13px;
            line-height: 1.4;
            font-weight: 700;
        }

        /* 响应式调整 */
        @media (max-width: 600px) {
            .custom-desc-container {
                width: 140px;
            }

            .desc-btn {
                font-size: 12px;
                padding: 7px 5px;
                min-height: 32px;
            }

            .settings-modal {
                width: 90%;
            }
        }
    `);

    // 默认描述词
    const defaultDescriptions = [
        {
            display: "白底证件照",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准白底色值为 (255, 255, 255)，无杂色，构图为3:4竖版，最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "红底证件照",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准红底色值为 (255, 0, 0)，无杂色，构图为3:4竖版，最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "蓝底证件照",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准蓝底色值为 (67, 142, 219)，无杂色，构图为3:4竖版，最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "白底西装",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准白底色值为 (255, 255, 255)，构图为3:4竖版，换上深色和浅色的2套西装和白衬衫和领带。最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "红底西装",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准红底色值为 (255, 0, 0)，构图为3:4竖版，换上深色和浅色的2套西装和白衬衫和领带。最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "蓝底西装",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准蓝底色值为(67, 142, 219)，构图为3:4竖版，换上深色和浅色的2套西装和白衬衫和领带。最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "白底衬衫",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准白底色值为 (255, 255, 255)，无杂色，构图为3:4竖版，换上深色和浅色的2套正式衬衫。最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "红底衬衫",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准红底色值为 (255, 0, 0)，无杂色，构图为3:4竖版，换上深色和浅色的2套正式衬衫。最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "蓝底衬衫",
            insert: "参考图中的人物面部特征，依次为每张图片制作专业的一寸证件照。请将照片中的姿态调整为正面朝向镜头，头部居中、头部占比约70%，头顶上方预留适当空间。轻度美颜，肤色提亮，面部光线均匀。背景色修改为标准蓝底色值为(67, 142, 219)，无杂色，构图为3:4竖版，换上深色和浅色的2套正式衬衫。最终成片需要达到高质量棚拍证件照水准。"
        },
        {
            display: "YaHee",
            insert: "YaHee, Studio."
        },
    ];

    // 从存储加载或使用默认描述词
    let descriptions = GM_getValue('descriptions', defaultDescriptions);
    // 隐藏状态设置
    let isPanelHidden = GM_getValue('isPanelHidden', false);

    // 调试模式
    let debugMode = GM_getValue('debugMode', false);
    let lastInsertedText = '';

    // 创建隐藏状态图标
    function createMiniIcon() {
        // 移除现有的图标（如果存在）
        const existingIcon = document.querySelector('.mini-icon-container');
        if (existingIcon && existingIcon.parentNode) {
            existingIcon.parentNode.removeChild(existingIcon);
        }

        const iconContainer = document.createElement('div');
        iconContainer.className = 'mini-icon-container';

        iconContainer.innerHTML = `
            <div class="mini-icon">🚀</div>
        `;

        document.body.appendChild(iconContainer);

        // 添加点击事件，显示主面板
        iconContainer.addEventListener('click', () => {
            togglePanelVisibility();
        });

        // 使图标可拖拽
        makeIconDraggable(iconContainer);

        // 恢复保存的位置
        const savedPosition = GM_getValue('iconPosition');
        if (savedPosition && savedPosition.left && savedPosition.top) {
            iconContainer.style.left = savedPosition.left;
            iconContainer.style.top = savedPosition.top;
            iconContainer.style.right = 'auto';
        }

        return iconContainer;
    }

    // 切换面板可见性
    function togglePanelVisibility() {
        const panel = document.querySelector('.custom-desc-container');
        const icon = document.querySelector('.mini-icon-container');

        isPanelHidden = !isPanelHidden;
        GM_setValue('isPanelHidden', isPanelHidden);

        if (isPanelHidden) {
            // 隐藏面板，显示图标
            if (panel) panel.classList.add('hidden');
            if (icon) icon.style.display = 'flex';
            showNotification('界面已隐藏 🎯 (Ctrl+Shift+H 显示)');
        } else {
            // 显示面板，隐藏图标
            if (panel) panel.classList.remove('hidden');
            if (icon) icon.style.display = 'none';
            showNotification('界面已显示 🚀 (Ctrl+Shift+H 隐藏)');
        }
    }

    // 使图标可拖拽
    function makeIconDraggable(icon) {
        let isDragging = false;
        let offsetX, offsetY;

        icon.style.cursor = 'move';

        const startDrag = (e) => {
            isDragging = true;
            offsetX = e.clientX - icon.offsetLeft;
            offsetY = e.clientY - icon.offsetTop;

            icon.style.cursor = 'grabbing';
            icon.style.opacity = '0.9';
            icon.style.boxShadow = '0 6px 18px rgba(76, 123, 246, 0.4)';
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;

            const maxLeft = window.innerWidth - icon.offsetWidth - 10;
            const maxTop = window.innerHeight - icon.offsetHeight - 10;

            icon.style.left = Math.max(10, Math.min(newLeft, maxLeft)) + 'px';
            icon.style.top = Math.max(10, Math.min(newTop, maxTop)) + 'px';
            icon.style.right = 'auto';
        };

        const stopDrag = () => {
            if (!isDragging) return;

            isDragging = false;
            icon.style.cursor = 'pointer';
            icon.style.opacity = '';
            icon.style.boxShadow = '0 4px 12px rgba(76, 123, 246, 0.3)';

            // 保存位置
            GM_setValue('iconPosition', {
                left: icon.style.left,
                top: icon.style.top
            });
        };

        // 鼠标事件
        icon.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDrag);

        // 清理事件监听器
        icon.addEventListener('DOMNodeRemoved', () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', stopDrag);
        });
    }

    // 创建UI界面
    function createDescriptionPanel() {
        // 移除现有的面板（如果存在）
        const existingPanel = document.querySelector('.custom-desc-container');
        if (existingPanel && existingPanel.parentNode) {
            existingPanel.parentNode.removeChild(existingPanel);
        }

        const panel = document.createElement('div');
        panel.className = `custom-desc-container ${isPanelHidden ? 'hidden' : ''}`;

        panel.innerHTML = `
            <div class="desc-header">
                <span>YaHeex .</span>
                <div class="desc-header-actions">
                    <button class="toggle-btn" title="隐藏/显示 (Ctrl+Shift+H)">👁️</button>
                    <button class="settings-btn" title="滴滴">⚙️</button>
                </div>
            </div>
            <div class="desc-content">
                <div class="desc-buttons-single" id="desc-buttons-container"></div>
            </div>
            <div class="stats">
                <span class="stats-icon">📊</span>
                <span>${descriptions.length} 个</span>
            </div>
        `;

        document.body.appendChild(panel);

        // 渲染描述词按钮
        renderDescriptionButtons(panel.querySelector('#desc-buttons-container'));

        // 添加设置按钮事件
        const settingsBtn = panel.querySelector('.settings-btn');
        settingsBtn.addEventListener('click', showSettingsModal);

        // 添加隐藏/显示按钮事件
        const toggleBtn = panel.querySelector('.toggle-btn');
        toggleBtn.addEventListener('click', togglePanelVisibility);

        // 使面板可拖拽
        makePanelDraggable(panel);

        // 恢复保存的位置
        const savedPosition = GM_getValue('panelPosition');
        if (savedPosition && savedPosition.left && savedPosition.top) {
            panel.style.left = savedPosition.left;
            panel.style.top = savedPosition.top;
            panel.style.right = 'auto';
        }

        return panel;
    }

    // 渲染所有描述词按钮 - 删除title属性
    function renderDescriptionButtons(container) {
        container.innerHTML = '';

        if (descriptions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">暂无描述词</div>
                </div>
            `;
            return;
        }

        descriptions.forEach((desc, index) => {
            const btn = document.createElement('button');
            btn.className = 'desc-btn';
            btn.textContent = desc.display;

            // 添加点击事件
            btn.addEventListener('click', () => {
                insertAndSend(desc.insert);
            });
            container.appendChild(btn);
        });

        // 更新统计
        const stats = document.querySelector('.stats');
        if (stats) {
            stats.querySelector('span:last-child').textContent = `${descriptions.length} 个`;
        }
    }

    // 使面板可拖拽
    function makePanelDraggable(panel) {
        let isDragging = false;
        let offsetX, offsetY;

        const header = panel.querySelector('.desc-header');
        if (!header) return;

        header.style.cursor = 'move';

        const startDrag = (e) => {
            if (e.target.closest('.settings-btn') || e.target.closest('.toggle-btn')) {
                return;
            }

            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;

            panel.style.cursor = 'grabbing';
            panel.style.opacity = '0.9';
            panel.style.boxShadow = '0 10px 30px rgba(76, 123, 246, 0.3)';
            e.preventDefault();
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;

            const maxLeft = window.innerWidth - panel.offsetWidth - 10;
            const maxTop = window.innerHeight - panel.offsetHeight - 10;

            panel.style.left = Math.max(10, Math.min(newLeft, maxLeft)) + 'px';
            panel.style.top = Math.max(10, Math.min(newTop, maxTop)) + 'px';
            panel.style.right = 'auto';
        };

        const stopDrag = () => {
            if (!isDragging) return;

            isDragging = false;
            panel.style.cursor = '';
            panel.style.opacity = '';
            panel.style.boxShadow = '0 6px 20px rgba(76, 123, 246, 0.2)';

            // 保存位置
            GM_setValue('panelPosition', {
                left: panel.style.left,
                top: panel.style.top
            });
        };

        // 鼠标事件
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDrag);

        // 清理事件监听器
        panel.addEventListener('DOMNodeRemoved', () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', stopDrag);
        });
    }

    // 显示设置模态框
    function showSettingsModal() {
        // 移除现有的模态框
        const existingModal = document.querySelector('.settings-modal');
        const existingOverlay = document.querySelector('.modal-overlay');
        if (existingModal) existingModal.remove();
        if (existingOverlay) existingOverlay.remove();

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.className = 'settings-modal';

        modal.innerHTML = `
            <div class="settings-modal-header">描述词管理</div>
            <div class="settings-modal-content">
                <div class="data-actions">
                    <button class="data-action-btn export-btn" id="export-btn">
                        📤 导出
                    </button>
                    <button class="data-action-btn import-btn" id="import-btn">
                        📥 导入
                    </button>
                    <button class="data-action-btn reset-btn" id="reset-btn">
                        🔄 还原
                    </button>
                </div>

                <div style="margin: 16px 0 12px 0; font-weight: 700; color: #4c7bf6; font-size: 15px; text-align: center;">描述词列表</div>
                <div id="desc-list-container" class="desc-list"></div>

                <button class="add-btn" id="add-desc-btn">
                    <span>+</span>
                    <span>添加新描述词</span>
                </button>

                <div class="action-buttons-row">
                    <button class="btn btn-secondary" id="cancel-btn">取消</button>
                    <button class="btn btn-primary" id="save-btn">保存设置</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 渲染描述词列表
        renderDescriptionList(modal.querySelector('#desc-list-container'));

        // 添加描述词按钮事件
        modal.querySelector('#add-desc-btn').addEventListener('click', () => {
            addNewDescriptionItem(modal.querySelector('#desc-list-container'));
        });

        // 添加导出按钮事件
        modal.querySelector('#export-btn').addEventListener('click', exportDescriptions);

        // 添加导入按钮事件
        modal.querySelector('#import-btn').addEventListener('click', () => {
            showImportModal(modal, overlay);
        });

        // 添加还原默认按钮事件
        modal.querySelector('#reset-btn').addEventListener('click', () => {
            showResetConfirmModal(modal, overlay);
        });

        // 取消按钮事件
        modal.querySelector('#cancel-btn').addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        // 保存按钮事件
        modal.querySelector('#save-btn').addEventListener('click', () => {
            saveDescriptions();
            modal.remove();
            overlay.remove();
            showNotification('设置已保存 ✅');

            // 重新渲染按钮
            const container = document.querySelector('#desc-buttons-container');
            if (container) {
                renderDescriptionButtons(container);
            }
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        // ESC键关闭
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                overlay.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);

        // 清理事件监听器
        modal.addEventListener('DOMNodeRemoved', () => {
            document.removeEventListener('keydown', closeOnEscape);
        });
    }

    // 显示还原确认对话框
    function showResetConfirmModal(parentModal, parentOverlay) {
        const confirmModal = document.createElement('div');
        confirmModal.className = 'confirm-modal';

        confirmModal.innerHTML = `
            <div class="confirm-modal-title">确认还原默认描述词？</div>
            <div class="confirm-modal-text">
                这将删除所有自定义描述词，恢复为默认的 ${defaultDescriptions.length} 个描述词。
                此操作不可撤销，请确认是否继续？
            </div>
            <div class="confirm-modal-actions">
                <button class="btn btn-secondary" id="confirm-cancel-btn">取消</button>
                <button class="btn btn-danger" id="confirm-reset-btn">确认还原</button>
            </div>
        `;

        document.body.appendChild(confirmModal);

        // 取消按钮事件
        confirmModal.querySelector('#confirm-cancel-btn').addEventListener('click', () => {
            confirmModal.remove();
        });

        // 确认还原按钮事件
        confirmModal.querySelector('#confirm-reset-btn').addEventListener('click', () => {
            resetToDefault();
            confirmModal.remove();

            // 更新父模态框的列表
            const descListContainer = parentModal.querySelector('#desc-list-container');
            if (descListContainer) {
                renderDescriptionList(descListContainer);
            }

            // 显示成功消息
            showNotification(`已还原为 ${defaultDescriptions.length} 个默认描述词 ✅`);
        });

        // 点击遮罩层关闭
        parentOverlay.addEventListener('click', () => {
            confirmModal.remove();
        }, { once: true });
    }

    // 还原为默认描述词
    function resetToDefault() {
        // 重置为默认描述词
        descriptions = [...defaultDescriptions];

        // 保存到存储
        saveDescriptions();

        // 重新渲染主面板按钮
        const container = document.querySelector('#desc-buttons-container');
        if (container) {
            renderDescriptionButtons(container);
        }
    }

    // 显示导入模态框
    function showImportModal(parentModal, parentOverlay) {
        const importModal = document.createElement('div');
        importModal.className = 'settings-modal';
        importModal.style.width = '420px';

        importModal.innerHTML = `
            <div class="settings-modal-header">导入描述词</div>
            <div class="settings-modal-content">
                <div class="file-import-area" id="file-import-area">
                    <div class="file-import-icon">📁</div>
                    <div class="file-import-text">点击选择文件或拖拽文件到这里</div>
                    <div class="file-import-hint">支持JSON文件格式</div>
                    <input type="file" class="import-file-input" id="import-file-input" accept=".json,application/json">
                </div>

                <div class="import-options" style="display: none;" id="import-options">
                    <div class="import-preview-title">导入选项</div>
                    <div class="import-option">
                        <label>
                            <input type="radio" name="import-mode" value="replace" checked>
                            替换现有描述词
                        </label>
                    </div>
                    <div class="import-option">
                        <label>
                            <input type="radio" name="import-mode" value="merge">
                            合并到现有描述词
                        </label>
                    </div>
                </div>

                <div class="import-preview" style="display: none;" id="import-preview">
                    <div class="import-preview-title">预览 (共 <span id="preview-count">0</span> 个)</div>
                    <div id="preview-content"></div>
                </div>

                <div class="action-buttons-row">
                    <button class="btn btn-secondary" id="import-cancel-btn">取消</button>
                    <button class="btn btn-success" id="import-confirm-btn" disabled>确认导入</button>
                </div>
            </div>
        `;

        document.body.appendChild(importModal);

        const fileInput = importModal.querySelector('#import-file-input');
        const fileImportArea = importModal.querySelector('#file-import-area');
        const importOptions = importModal.querySelector('#import-options');
        const importPreview = importModal.querySelector('#import-preview');
        const previewContent = importModal.querySelector('#preview-content');
        const previewCount = importModal.querySelector('#preview-count');
        const importConfirmBtn = importModal.querySelector('#import-confirm-btn');
        let importData = null;

        // 点击导入区域触发文件选择
        fileImportArea.addEventListener('click', () => {
            fileInput.click();
        });

        // 文件选择变化
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                readImportFile(file);
            }
        });

        // 读取导入文件
        function readImportFile(file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    if (isValidDescriptionsData(data)) {
                        importData = data;
                        showImportPreview(data);
                        importOptions.style.display = 'block';
                        importConfirmBtn.disabled = false;
                    } else {
                        showNotification('文件格式不正确 ⚠️', 'warning');
                        importData = null;
                        importOptions.style.display = 'none';
                        importPreview.style.display = 'none';
                        importConfirmBtn.disabled = true;
                    }
                } catch (error) {
                    showNotification('解析文件失败 ⚠️', 'warning');
                    importData = null;
                    importOptions.style.display = 'none';
                    importPreview.style.display = 'none';
                    importConfirmBtn.disabled = true;
                }
            };

            reader.onerror = () => {
                showNotification('读取文件失败 ⚠️', 'warning');
                importData = null;
                importOptions.style.display = 'none';
                importPreview.style.display = 'none';
                importConfirmBtn.disabled = true;
            };

            reader.readAsText(file);
        }

        // 显示导入预览
        function showImportPreview(data) {
            previewContent.innerHTML = '';
            previewCount.textContent = data.length;

            const previewItems = data.slice(0, 5);
            previewItems.forEach(item => {
                const previewItem = document.createElement('div');
                previewItem.className = 'import-preview-item';
                previewItem.innerHTML = `
                    <div style="font-weight: 700; margin-bottom: 3px; color: #4c7bf6;">${item.display}</div>
                    <div style="font-size: 11px; color: #6c757d;">${item.insert.substring(0, 45)}${item.insert.length > 45 ? '...' : ''}</div>
                `;
                previewContent.appendChild(previewItem);
            });

            if (data.length > 5) {
                const moreItem = document.createElement('div');
                moreItem.className = 'import-preview-item';
                moreItem.innerHTML = `<div style="text-align: center; color: #adb5bd; font-weight: 600;">... 还有 ${data.length - 5} 个</div>`;
                previewContent.appendChild(moreItem);
            }

            importPreview.style.display = 'block';
        }

        // 确认导入
        importConfirmBtn.addEventListener('click', () => {
            if (!importData) return;

            const importMode = importModal.querySelector('input[name="import-mode"]:checked').value;

            if (importMode === 'replace') {
                descriptions = [...importData];
                showNotification(`已导入 ${importData.length} 个描述词 ✅`);
            } else if (importMode === 'merge') {
                const existingCount = descriptions.length;

                const existingMap = new Map();
                descriptions.forEach(desc => {
                    existingMap.set(desc.display, desc);
                });

                importData.forEach(desc => {
                    existingMap.set(desc.display, desc);
                });

                descriptions = Array.from(existingMap.values());
                const addedCount = descriptions.length - existingCount;
                showNotification(`已合并导入，新增 ${addedCount} 个，共 ${descriptions.length} 个 ✅`);
            }

            // 保存并更新
            saveDescriptions();

            // 关闭导入模态框
            importModal.remove();

            // 更新父模态框的列表
            const descListContainer = parentModal.querySelector('#desc-list-container');
            if (descListContainer) {
                renderDescriptionList(descListContainer);
            }
        });

        // 取消导入
        importModal.querySelector('#import-cancel-btn').addEventListener('click', () => {
            importModal.remove();
        });

        // ESC键关闭
        const closeImportOnEscape = (e) => {
            if (e.key === 'Escape') {
                importModal.remove();
                document.removeEventListener('keydown', closeImportOnEscape);
            }
        };
        document.addEventListener('keydown', closeImportOnEscape);
    }

    // 验证描述词数据格式
    function isValidDescriptionsData(data) {
        if (!Array.isArray(data)) return false;

        for (const item of data) {
            if (typeof item !== 'object' || item === null) return false;
            if (typeof item.display !== 'string' || item.display.trim() === '') return false;
            if (typeof item.insert !== 'string' || item.insert.trim() === '') return false;
        }

        return true;
    }

    // 导出描述词
    function exportDescriptions() {
        try {
            const exportData = JSON.stringify(descriptions, null, 2);
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const now = new Date();
            const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
            a.download = `豆包描述词_${timestamp}.json`;

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            showNotification(`已导出 ${descriptions.length} 个描述词 📤`);

        } catch (error) {
            console.error('导出失败:', error);
            showNotification('导出失败，请重试 ⚠️', 'warning');
        }
    }

    // 渲染描述词列表
    function renderDescriptionList(container) {
        container.innerHTML = '';

        if (descriptions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">暂无描述词</div>
                </div>
            `;
            return;
        }

        descriptions.forEach((desc, index) => {
            const item = document.createElement('div');
            item.className = 'desc-item';
            item.innerHTML = `
                <div class="desc-item-header">
                    <div class="desc-item-display">${desc.display}</div>
                    <div class="desc-item-actions">
                        <button class="btn btn-sm btn-danger" data-index="${index}">删除</button>
                    </div>
                </div>
                <div class="desc-item-content">${desc.insert}</div>
            `;

            container.appendChild(item);

            // 添加删除按钮事件
            const deleteBtn = item.querySelector('.btn-danger');
            deleteBtn.addEventListener('click', () => {
                descriptions.splice(index, 1);
                renderDescriptionList(container);
            });
        });
    }

    // 添加新描述词项
    function addNewDescriptionItem(container) {
        const item = document.createElement('div');
        item.className = 'desc-item';
        item.innerHTML = `
            <div class="form-group">
                <label class="form-label">显示名称</label>
                <input type="text" class="form-control new-display" placeholder="例如：白底证件照" />
            </div>
            <div class="form-group">
                <label class="form-label">插入内容</label>
                <textarea class="form-control new-insert" placeholder="请输入要插入的描述词内容..." rows="3"></textarea>
            </div>
            <div class="desc-item-actions">
                <button class="btn btn-secondary" id="cancel-add-btn">取消</button>
                <button class="btn btn-primary" id="save-add-btn">保存</button>
            </div>
        `;

        container.appendChild(item);

        // 取消添加按钮事件
        item.querySelector('#cancel-add-btn').addEventListener('click', () => {
            container.removeChild(item);
        });

        // 保存添加按钮事件
        item.querySelector('#save-add-btn').addEventListener('click', () => {
            saveNewDescription(item);
        });

        // 自动聚焦到第一个输入框
        item.querySelector('.new-display').focus();
    }

    // 保存新描述词
    function saveNewDescription(item) {
        const displayInput = item.querySelector('.new-display');
        const insertInput = item.querySelector('.new-insert');

        const display = displayInput.value.trim();
        const insert = insertInput.value.trim();

        if (!display) {
            showNotification('请输入显示名称 ⚠️', 'warning');
            displayInput.focus();
            return;
        }

        if (!insert) {
            showNotification('请输入插入内容 ⚠️', 'warning');
            insertInput.focus();
            return;
        }

        descriptions.push({ display, insert });
        showNotification('描述词已添加 ✅');

        // 重新渲染列表
        const container = document.querySelector('#desc-list-container');
        if (container) {
            renderDescriptionList(container);
        }
    }

    // 保存描述词到存储
    function saveDescriptions() {
        GM_setValue('descriptions', descriptions);
    }

    // 查找并返回可用的输入框 - 更新支持新的输入框结构
    function findActiveInput() {
        const activeElement = document.activeElement;

        const checkIfInput = (element) => {
            if (!element) return false;

            // 检查是否为新的豆包输入框结构
            if (element.hasAttribute('data-testid') &&
                element.getAttribute('data-testid') === 'chat_input_input' &&
                element.hasAttribute('data-slate-editor') &&
                element.getAttribute('data-slate-editor') === 'true') {
                return { type: 'slate', element: element };
            }

            // 检查旧的textarea输入框
            if (element.tagName === 'TEXTAREA' && element.getAttribute('data-testid') === 'chat_input_input') {
                return { type: 'textarea', element: element };
            }

            // 检查旧的Slate编辑器
            if (element.getAttribute && element.getAttribute('data-slate-editor') === 'true' && element.isContentEditable) {
                return { type: 'slate', element: element };
            }

            // 检查父元素是否为Slate编辑器
            if (element.closest && element.closest('[data-slate-editor="true"]')) {
                const parentInput = element.closest('[data-slate-editor="true"]');
                if (parentInput.isContentEditable) {
                    return { type: 'slate', element: parentInput };
                }
            }

            // 检查特定的豆包编辑器容器
            if (element.closest && element.closest('.editor-A1E_5W')) {
                const slateEditor = element.closest('.editor-A1E_5W').querySelector('[data-slate-editor="true"]');
                if (slateEditor && slateEditor.isContentEditable) {
                    return { type: 'slate', element: slateEditor };
                }
            }

            return false;
        };

        const activeInput = checkIfInput(activeElement);
        if (activeInput) {
            return activeInput;
        }

        // 搜索输入框选择器，优先级从新到旧
        const selectors = [
            // 新的豆包输入框
            { selector: '.editor-A1E_5W [data-slate-editor="true"][data-testid="chat_input_input"]', type: 'slate' },
            { selector: '[data-slate-editor="true"][data-testid="chat_input_input"]', type: 'slate' },
            // 旧的textarea输入框
            { selector: 'textarea[data-testid="chat_input_input"]', type: 'textarea' },
            // 旧的Slate编辑器
            { selector: '[data-slate-editor="true"]', type: 'slate' }
        ];

        for (const { selector, type } of selectors) {
            const element = document.querySelector(selector);
            if (element && element.offsetWidth > 0 && element.offsetHeight > 0) {
                return { type: type, element: element };
            }
        }

        // 最后尝试通过特定的容器查找
        const editorContainer = document.querySelector('.editor-A1E_5W');
        if (editorContainer) {
            const slateEditor = editorContainer.querySelector('[data-slate-editor="true"]');
            if (slateEditor && slateEditor.isContentEditable) {
                return { type: 'slate', element: slateEditor };
            }
        }

        return null;
    }

    // 插入文本到文本输入框
    function insertIntoTextarea(textarea, text) {
        lastInsertedText = text;

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, "value"
        ).set;
        nativeInputValueSetter.call(textarea, text);

        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: text,
            isComposing: false
        });
        textarea.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true });
        textarea.dispatchEvent(changeEvent);

        return true;
    }

    // 插入文本到Slate编辑器 - 增强版，支持多种输入方式
    async function insertIntoSlateEditor(slateEditor, text) {
        lastInsertedText = text;

        try {
            // 方法1: 使用paste事件（最可靠的方式）
            slateEditor.focus();

            // 清除现有内容
            const range = document.createRange();
            range.selectNodeContents(slateEditor);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('delete');

            // 创建粘贴事件
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/plain', text);

            const pasteEvent = new ClipboardEvent('paste', {
                clipboardData: dataTransfer,
                bubbles: true,
                cancelable: true
            });

            slateEditor.dispatchEvent(pasteEvent);

            await new Promise(resolve => setTimeout(resolve, 100));

            // 方法2: 如果粘贴失败，尝试直接设置文本内容并触发事件
            const insertedText = slateEditor.textContent || slateEditor.innerText || '';
            if (!insertedText.includes(text)) {
                console.log('粘贴方法可能失败，尝试直接设置文本');

                // 设置文本内容
                slateEditor.textContent = text;

                // 触发各种事件
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: text
                });
                slateEditor.dispatchEvent(inputEvent);

                const changeEvent = new Event('change', { bubbles: true });
                slateEditor.dispatchEvent(changeEvent);

                // 触发豆包可能监听的其他事件
                const compositionEndEvent = new CompositionEvent('compositionend', {
                    data: text,
                    bubbles: true
                });
                slateEditor.dispatchEvent(compositionEndEvent);

                // 触发键盘事件
                const keyupEvent = new KeyboardEvent('keyup', {
                    key: 'Enter',
                    bubbles: true
                });
                slateEditor.dispatchEvent(keyupEvent);
            }

            return true;

        } catch (error) {
            console.error('Slate编辑器插入失败:', error);

            // 方法3: 最后的备选方案，使用document.execCommand
            try {
                slateEditor.focus();
                slateEditor.textContent = text;

                // 选中所有文本
                const range = document.createRange();
                range.selectNodeContents(slateEditor);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                // 模拟输入
                document.execCommand('insertText', false, text);
                return true;
            } catch (fallbackError) {
                console.error('备选方案也失败:', fallbackError);
                return false;
            }
        }
    }

    // 插入描述词并自动发送
    async function insertAndSend(text) {
        const inputInfo = findActiveInput();

        if (!inputInfo) {
            showNotification('未找到输入框，请先点击输入框 ⚠️', 'warning');
            return;
        }

        const { type, element } = inputInfo;

        try {
            let insertSuccess = false;

            if (type === 'textarea') {
                insertSuccess = insertIntoTextarea(element, text);
            } else if (type === 'slate') {
                insertSuccess = await insertIntoSlateEditor(element, text);
            }

            if (!insertSuccess) {
                showNotification('文本插入失败 ⚠️', 'warning');
                return;
            }

            // 等待状态更新
            await new Promise(resolve => setTimeout(resolve, 300));

            // 强制触发一次焦点事件
            element.focus();
            element.click();

            // 等待一下再发送
            await new Promise(resolve => setTimeout(resolve, 200));

            // 点击发送按钮
            clickSendButtonOnce();

        } catch (error) {
            console.error('插入失败:', error);
            showNotification('插入失败，请手动输入 ⚠️', 'warning');
        }
    }

    // 点击发送按钮
    function clickSendButtonOnce() {
        const sendButton = findSendButton();

        if (sendButton && !sendButton.disabled) {
            sendButton.click();
            showNotification('哔哔 已发车，检查是否成功发送 🚀');
        } else {
            showNotification('发送按钮不可用，请手动发送 ⚠️', 'warning');
        }
    }

    // 查找发送按钮 - 更新支持新的豆包界面
    function findSendButton() {
        // 优先检查图像发送按钮
        const imageSendButton = document.querySelector('.image-send-msg-button button');
        if (imageSendButton && !imageSendButton.disabled) {
            return imageSendButton;
        }

        // 新的豆包发送按钮选择器
        const sendButtonSelectors = [
            // 新的豆包发送按钮
            'button[data-testid="send-button"]',
            'button[aria-label*="发送"]',
            '.send-button',
            // 通用选择器
            '[data-testid="chat_input_send_button"]',
            '#flow-end-msg-send',
            '.send-btn-mNNnTf',
            '.send-btn-wrapper button',
            'button:has(svg.send-icon)',
            // 通过文本内容查找
            'button:contains("发送")',
            'button:contains("Send")'
        ];

        for (const selector of sendButtonSelectors) {
            try {
                const btn = document.querySelector(selector);
                if (btn && !btn.disabled && btn.offsetWidth > 0 && btn.offsetHeight > 0) {
                    return btn;
                }
            } catch (e) {
                // 忽略选择器错误
            }
        }

        // 最后尝试通过父容器查找
        const inputContainer = document.querySelector('.editor-A1E_5W');
        if (inputContainer) {
            const sendBtn = inputContainer.closest('form')?.querySelector('button[type="submit"]') ||
                           inputContainer.parentElement?.querySelector('button');
            if (sendBtn && !sendBtn.disabled) {
                return sendBtn;
            }
        }

        return null;
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.custom-notification');
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }

        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // 添加全局快捷键监听
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+H 切换隐藏/显示
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                e.preventDefault();
                togglePanelVisibility();
            }
        });
    }

    // 初始化
    function init() {
        console.log('🎨 豆包描述词助手紧凑醒目版初始化...');

        // 添加快捷键
        setupKeyboardShortcuts();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(checkAndCreatePanel, 1500);
            });
        } else {
            setTimeout(checkAndCreatePanel, 1500);
        }

        // 观察DOM变化以检测输入框的出现
        const observer = new MutationObserver(() => {
            checkAndCreatePanel();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        console.log('✨ 豆包描述词助手紧凑醒目版初始化完成');
    }

    // 检查并创建面板 - 增强检测逻辑
    function checkAndCreatePanel() {
        // 检查各种可能的输入框
        const textInput = document.querySelector('textarea[data-testid="chat_input_input"]');
        const slateInput = document.querySelector('[data-slate-editor="true"][data-testid="chat_input_input"]');
        const editorContainer = document.querySelector('.editor-A1E_5W');

        const hasInput = textInput || slateInput || editorContainer;

        if (hasInput && !document.querySelector('.custom-desc-container')) {
            console.log('🎯 豆包输入框已找到，创建紧凑醒目面板');

            // 创建主面板
            createDescriptionPanel();

            // 创建隐藏图标
            const icon = createMiniIcon();

            // 根据保存的状态设置初始显示状态
            if (isPanelHidden) {
                const panel = document.querySelector('.custom-desc-container');
                if (panel) panel.classList.add('hidden');
                if (icon) icon.style.display = 'flex';
            } else {
                const panel = document.querySelector('.custom-desc-container');
                if (panel) panel.classList.remove('hidden');
                if (icon) icon.style.display = 'none';
            }
        }
    }

    // 启动脚本
    init();
})();