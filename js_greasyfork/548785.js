// ==UserScript==
// @name         清华大学选课助手
// @namespace    thu-classlist
// @version      1.0.3
// @description  为清华大学选课系统添加候选课程管理功能
// @author       travellerse
// @match        http://zhjwxk.cic.tsinghua.edu.cn/*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548785/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548785/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ============================================================================
    // 配置和常量
    // ============================================================================

    const CONFIG = {
        storage: {
            candidates: "candidates",
            settings: "settings",
        },
        ui: {
            toast: {
                duration: 3000,
                zIndex: 1000000,
            },
            panel: {
                zIndex: 999999,
                defaultPosition: { top: 20, right: 20 },
                minSize: { width: 200, height: 50 },
                maxSize: { width: 480, height: 600 },
            },
        },
        selectors: {
            courseTable: "table",
            courseRow: "tr",
            courseCell: "td",
        },
        urls: {
            searchPage: "JxjhBs",
            mainPage: "XkbBs",
        },
    };

    // ============================================================================
    // 样式系统
    // ============================================================================

    class StyleManager {
        static styles = `
            .thu-candidate-btn {
                background: #2196F3;
                color: white;
                border: none;
                padding: 6px 12px;
                margin: 2px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                min-width: 80px;
                font-weight: bold;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }
            
            .thu-candidate-btn:hover {
                background: #1976D2;
                transform: translateY(-1px);
            }
            
            .thu-candidate-btn.added {
                background: #f44336;
            }
            
            .thu-candidate-btn.added:hover {
                background: #da190b;
            }
            
            .thu-floating-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 480px;
                max-height: 600px;
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
            }
            
            .thu-floating-panel.minimized {
                width: 200px;
                height: 50px;
                max-height: 50px;
                cursor: pointer;
            }
            
            .thu-floating-panel.minimized .thu-panel-content {
                display: none;
            }
            
            .thu-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                border-radius: 10px 10px 0 0;
                cursor: move;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .thu-panel-title {
                font-weight: 600;
                font-size: 14px;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .thu-candidate-count {
                background: rgba(255,255,255,0.2);
                color: white;
                border-radius: 12px;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: bold;
            }
            
            .thu-panel-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            
            .thu-panel-control-btn {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            
            .thu-panel-control-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .thu-panel-content {
                padding: 16px;
                max-height: 500px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: #cbd5e0 transparent;
            }
            
            .thu-panel-content::-webkit-scrollbar {
                width: 6px;
            }
            
            .thu-panel-content::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .thu-panel-content::-webkit-scrollbar-thumb {
                background-color: #cbd5e0;
                border-radius: 3px;
            }
            
            .thu-course-item {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 12px;
                transition: all 0.2s ease;
                position: relative;
                cursor: grab;
            }
            
            .thu-course-item:hover {
                background: #f1f5f9;
                border-color: #cbd5e0;
                transform: translateY(-1px);
            }
            
            .thu-course-item.dragging {
                opacity: 0.7;
                transform: rotate(2deg) scale(1.02);
                cursor: grabbing;
                z-index: 1000;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            }
            
            .thu-course-item.drag-over {
                border-color: #667eea;
                background: #eef2ff;
            }
            
            .thu-course-item.placeholder {
                background: #e2e8f0;
                border: 2px dashed #cbd5e0;
                opacity: 0.5;
                height: 100px;
            }
            
            .thu-course-item.placeholder::before {
                content: "拖拽到此处";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #718096;
                font-size: 14px;
                pointer-events: none;
            }
            
            .thu-drag-handle {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 20px;
                height: 20px;
                background: rgba(102, 126, 234, 0.1);
                border-radius: 4px;
                cursor: grab;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .thu-course-item:hover .thu-drag-handle {
                opacity: 1;
            }
            
            .thu-drag-handle:hover {
                background: rgba(102, 126, 234, 0.2);
            }
            
            .thu-drag-handle::before {
                content: "⋮⋮";
                color: #667eea;
                font-size: 12px;
                line-height: 1;
                letter-spacing: -2px;
            }
            
            .thu-course-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }
            
            .thu-course-name {
                font-weight: 600;
                color: #1a202c;
                font-size: 14px;
                margin: 0;
                line-height: 1.4;
            }
            
            .thu-course-credits {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                white-space: nowrap;
            }
            
            .thu-course-info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px 16px;
                margin-bottom: 8px;
            }
            
            .thu-course-info {
                font-size: 12px;
                color: #4a5568;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .thu-course-info-label {
                font-weight: 500;
                color: #2d3748;
                min-width: fit-content;
            }
            
            .thu-capacity-section {
                background: linear-gradient(135deg, #ffeaa7, #fab1a0);
                border-radius: 6px;
                padding: 8px 12px;
                margin: 8px 0;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            
            .thu-capacity-title {
                font-size: 11px;
                font-weight: 600;
                color: #2d3748;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .thu-capacity-items {
                display: flex;
                gap: 16px;
                flex: 1;
            }
            
            .thu-capacity-item {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .thu-capacity-label {
                font-size: 11px;
                color: #4a5568;
                font-weight: 500;
            }
            
            .thu-capacity-value {
                font-size: 12px;
                font-weight: 600;
                padding: 2px 8px;
                border-radius: 12px;
                background: white;
                border: 1px solid #e2e8f0;
            }
            
            .thu-capacity-available {
                color: #38a169;
                background: #f0fff4 !important;
                border-color: #9ae6b4 !important;
            }
            
            .thu-capacity-full {
                color: #e53e3e;
                background: #fef5e7 !important;
                border-color: #feb2b2 !important;
            }
            
            .thu-course-details {
                font-size: 11px;
                color: #718096;
                margin: 8px 0;
                padding: 8px;
                background: #edf2f7;
                border-radius: 6px;
                border-left: 3px solid #667eea;
            }
            
            .thu-course-actions {
                display: flex;
                gap: 6px;
                margin-top: 12px;
                flex-wrap: wrap;
            }
            
            .thu-action-btn {
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 500;
                transition: all 0.2s ease;
                flex: 1;
                min-width: 80px;
            }
            
            .thu-copy-btn {
                background: #4299e1;
                color: white;
            }
            
            .thu-copy-btn:hover {
                background: #3182ce;
                transform: translateY(-1px);
            }
            
            .thu-remove-btn {
                background: #f56565;
                color: white;
            }
            
            .thu-remove-btn:hover {
                background: #e53e3e;
                transform: translateY(-1px);
            }
            
            .thu-empty-message {
                text-align: center;
                color: #718096;
                font-style: italic;
                padding: 40px 20px;
                background: #f7fafc;
                border-radius: 8px;
                border: 2px dashed #cbd5e0;
            }
            
            .thu-toast {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(-20px);
                background: #2d3748;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1000000;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
                backdrop-filter: blur(10px);
            }
            
            .thu-toast.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            
            .thu-toast.success {
                background: linear-gradient(135deg, #48bb78, #38a169);
            }
            
            .thu-toast.error {
                background: linear-gradient(135deg, #f56565, #e53e3e);
            }
            
            .thu-toast.info {
                background: linear-gradient(135deg, #4299e1, #3182ce);
            }
            
            .thu-loading {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: thu-spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes thu-spin {
                to { transform: rotate(360deg); }
            }
            
            .thu-fade-in {
                animation: thu-fade-in 0.3s ease-out;
            }
            
            @keyframes thu-fade-in {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* ========== 紧凑布局样式 ========== */
            
            .thu-course-item-compact {
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 8px;
                position: relative;
                transition: all 0.2s ease;
                cursor: grab;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                display: grid;
                grid-template-columns: 1fr auto auto;
                grid-template-rows: auto auto;
                gap: 8px 12px;
                align-items: start;
            }
            
            .thu-course-item-compact:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-color: #cbd5e0;
            }
            
            .thu-course-item-compact.dragging {
                opacity: 0.8;
                cursor: grabbing;
                transform: rotate(2deg);
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                z-index: 1000;
            }
            
            .thu-course-item-compact.drag-over {
                border-color: #4299e1;
                background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
            }
            
            .thu-course-item-compact.expanded {
                margin-bottom: 12px;
            }
            
            .thu-course-main-compact {
                grid-column: 1;
                grid-row: 1 / -1;
                min-width: 0;
            }
            
            .thu-course-header-compact {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 6px;
                gap: 8px;
            }
            
            .thu-course-title-compact {
                font-weight: 600;
                font-size: 14px;
                color: #2d3748;
                line-height: 1.3;
                flex: 1;
                min-width: 0;
                word-break: break-word;
            }
            
            .thu-course-title-compact.clickable {
                cursor: pointer;
                transition: all 0.2s ease;
                border-radius: 4px;
                padding: 2px 4px;
                margin: -2px -4px;
            }
            
            .thu-course-title-compact.clickable:hover {
                background: #e6fffa;
                color: #2c7a7b;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .thu-course-meta-compact {
                display: flex;
                gap: 6px;
                flex-shrink: 0;
            }
            
            .thu-credits-compact {
                background: #e6fffa;
                color: #319795;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 600;
                border: 1px solid #81e6d9;
            }
            
            .thu-course-codes-compact {
                display: flex;
                gap: 6px;
                margin-bottom: 6px;
                flex-wrap: wrap;
            }
            
            .thu-course-code-compact {
                background: #fed7d7;
                color: #c53030;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 600;
                border: 1px solid #feb2b2;
                font-family: monospace;
                transition: all 0.2s ease;
            }
            
            .thu-course-code-compact.clickable {
                cursor: pointer;
            }
            
            .thu-course-code-compact.clickable:hover {
                background: #fc8181;
                color: #9b2c2c;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .thu-sequence-code-compact {
                background: #feebc8;
                color: #dd6b20;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 600;
                border: 1px solid #f6ad55;
                font-family: monospace;
                transition: all 0.2s ease;
            }
            
            .thu-sequence-code-compact.clickable {
                cursor: pointer;
            }
            
            .thu-sequence-code-compact.clickable:hover {
                background: #f6ad55;
                color: #c05621;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .thu-course-info-compact {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            
            .thu-teacher-dept-compact {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            
            .thu-teacher-compact {
                font-size: 11px;
                color: #4a5568;
                font-weight: 500;
            }
            
            .thu-teacher-compact.clickable {
                cursor: pointer;
                transition: all 0.2s ease;
                border-radius: 4px;
                padding: 2px 4px;
                margin: -2px -4px;
            }
            
            .thu-teacher-compact.clickable:hover {
                background: #fff5f5;
                color: #c53030;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .thu-teacher-compact:before {
                content: "👨‍🏫 ";
                font-size: 10px;
            }
            
            .thu-department-compact {
                font-size: 11px;
                color: #718096;
            }
            
            .thu-department-compact:before {
                content: "🏛️ ";
                font-size: 10px;
            }
            
            .thu-time-place-compact {
                font-size: 11px;
                color: #2d3748;
                font-weight: 500;
                line-height: 1.3;
            }
            
            .thu-time-place-compact:before {
                content: "⏰ ";
                font-size: 10px;
            }
            
            .thu-capacity-compact {
                grid-column: 2;
                grid-row: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
                align-items: flex-end;
                min-width: 80px;
            }
            
            .thu-capacity-item-compact {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .thu-capacity-label-compact {
                font-size: 10px;
                color: #4a5568;
                font-weight: 500;
                min-width: 32px;
                text-align: right;
            }
            
            .thu-course-actions-compact {
                grid-column: 3;
                grid-row: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
                align-items: flex-end;
            }
            
            .thu-action-btn-compact {
                border: none;
                padding: 6px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
                min-width: 32px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .thu-action-btn-compact.thu-copy-btn {
                background: #3182ce;
                color: white;
            }
            
            .thu-action-btn-compact.thu-copy-btn:hover {
                background: #2c5aa0;
                transform: translateY(-1px);
            }
            
            .thu-action-btn-compact.thu-remove-btn {
                background: #e53e3e;
                color: white;
            }
            
            .thu-action-btn-compact.thu-remove-btn:hover {
                background: #c53030;
                transform: translateY(-1px);
            }
            
            .thu-action-btn-compact.thu-expand-btn {
                background: #667eea;
                color: white;
            }
            
            .thu-action-btn-compact.thu-expand-btn:hover {
                background: #5a67d8;
                transform: translateY(-1px);
            }
            
            .thu-course-details-expandable {
                grid-column: 1 / -1;
                grid-row: 2;
                background: #f7fafc;
                border-radius: 6px;
                padding: 8px;
                margin-top: 4px;
                border: 1px solid #e2e8f0;
                font-size: 11px;
                color: #4a5568;
                line-height: 1.4;
            }
            
            .thu-course-details-expandable > div {
                margin-bottom: 4px;
            }
            
            .thu-course-details-expandable > div:last-child {
                margin-bottom: 0;
            }
            
            /* 响应式调整 */
            @media (max-width: 400px) {
                .thu-course-item-compact {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto auto;
                }
                
                .thu-course-main-compact {
                    grid-column: 1;
                    grid-row: 1;
                }
                
                .thu-capacity-compact {
                    grid-column: 1;
                    grid-row: 2;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .thu-course-actions-compact {
                    grid-column: 1;
                    grid-row: 3;
                    flex-direction: row;
                    justify-content: flex-end;
                }
            }
        `;

        static inject(targetDocument = document) {
            if (targetDocument.querySelector("#thu-course-assistant-styles")) {
                return;
            }

            const styleElement = targetDocument.createElement("style");
            styleElement.id = "thu-course-assistant-styles";
            styleElement.textContent = this.styles;
            targetDocument.head.appendChild(styleElement);
        }
    }

    // ============================================================================
    // 通用工具类
    // ============================================================================

    class Utils {
        static escapeHtml(text) {
            if (!text) return "";
            return text
                .toString()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }

        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        static throttle(func, limit) {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => (inThrottle = false), limit);
                }
            };
        }

        static generateId() {
            return `thu-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        }

        static isValidUrl(url, patterns) {
            return patterns.some((pattern) => url.includes(pattern));
        }

        static async sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
    }

    // ============================================================================
    // 事件系统
    // ============================================================================

    class EventEmitter {
        constructor() {
            this.events = new Map();
        }

        on(event, callback) {
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }
            this.events.get(event).push(callback);
            return () => this.off(event, callback);
        }

        off(event, callback) {
            if (!this.events.has(event)) return;
            const callbacks = this.events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }

        emit(event, ...args) {
            if (!this.events.has(event)) return;
            this.events.get(event).forEach((callback) => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Event handler error for ${event}:`, error);
                }
            });
        }

        once(event, callback) {
            const wrapper = (...args) => {
                callback(...args);
                this.off(event, wrapper);
            };
            this.on(event, wrapper);
        }
    }

    // ============================================================================
    // 通知系统
    // ============================================================================

    class NotificationSystem {
        static instance = null;

        constructor() {
            if (NotificationSystem.instance) {
                return NotificationSystem.instance;
            }
            NotificationSystem.instance = this;
            return this;
        }

        showToast(message, type = "info", duration = CONFIG.ui.toast.duration) {
            const targetDocument = window.parent?.document || document;
            const targetBody = targetDocument.body;

            const toast = targetDocument.createElement("div");
            toast.className = `thu-toast ${type}`;
            toast.textContent = message;

            targetBody.appendChild(toast);

            // 触发显示动画
            requestAnimationFrame(() => {
                toast.classList.add("show");
            });

            // 自动隐藏
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, duration);
        }

        success(message) {
            this.showToast(message, "success");
        }

        error(message) {
            this.showToast(message, "error");
        }

        info(message) {
            this.showToast(message, "info");
        }

        static getInstance() {
            return new NotificationSystem();
        }
    }

    // ============================================================================
    // 数据存储系统
    // ============================================================================

    class StorageManager {
        static instance = null;

        constructor() {
            if (StorageManager.instance) {
                return StorageManager.instance;
            }
            StorageManager.instance = this;
            return this;
        }

        async save(key, data) {
            try {
                const serialized = JSON.stringify(data);
                GM_setValue(key, serialized);
                return true;
            } catch (error) {
                console.error(`Storage save error for key ${key}:`, error);
                return false;
            }
        }

        async load(key, defaultValue = null) {
            try {
                const data = GM_getValue(key);
                if (data === undefined) return defaultValue;
                return JSON.parse(data);
            } catch (error) {
                console.error(`Storage load error for key ${key}:`, error);
                return defaultValue;
            }
        }

        async remove(key) {
            try {
                GM_setValue(key, undefined);
                return true;
            } catch (error) {
                console.error(`Storage remove error for key ${key}:`, error);
                return false;
            }
        }

        static getInstance() {
            return new StorageManager();
        }
    }

    // ============================================================================
    // 课程数据模型
    // ============================================================================

    class CourseInfo {
        constructor(data) {
            this.id = Utils.generateId();
            this.department = data.department || "";
            this.courseNo = data.courseNo || "";
            this.sequenceNo = data.sequenceNo || "";
            this.courseName = data.courseName || "";
            this.credits = data.credits || "";
            this.teacher = data.teacher || "";
            this.undergradCapacity = parseInt(data.undergradCapacity) || 0;
            this.undergradAvailable = parseInt(data.undergradAvailable) || 0;
            this.gradCapacity = parseInt(data.gradCapacity) || 0;
            this.gradAvailable = parseInt(data.gradAvailable) || 0;
            this.timePlace = data.timePlace || "";
            this.note = data.note || "";
            this.courseFeature = data.courseFeature || "";
            this.grade = data.grade || "";
            this.addTime = data.addTime || new Date().toLocaleString();
            this.sortOrder = data.sortOrder !== undefined ? data.sortOrder : 0; // 使用索引而不是时间戳
        }

        getUniqueKey() {
            return `${this.courseNo}-${this.sequenceNo}`;
        }

        hasAvailableSeats() {
            return this.undergradAvailable > 0 || this.gradAvailable > 0;
        }

        getCapacityStatus() {
            return {
                undergrad: {
                    available: this.undergradAvailable,
                    total: this.undergradCapacity,
                    hasSeats: this.undergradAvailable > 0,
                },
                grad: {
                    available: this.gradAvailable,
                    total: this.gradCapacity,
                    hasSeats: this.gradAvailable > 0,
                },
            };
        }

        toJSON() {
            return {
                id: this.id,
                department: this.department,
                courseNo: this.courseNo,
                sequenceNo: this.sequenceNo,
                courseName: this.courseName,
                credits: this.credits,
                teacher: this.teacher,
                undergradCapacity: this.undergradCapacity,
                undergradAvailable: this.undergradAvailable,
                gradCapacity: this.gradCapacity,
                gradAvailable: this.gradAvailable,
                timePlace: this.timePlace,
                note: this.note,
                courseFeature: this.courseFeature,
                grade: this.grade,
                addTime: this.addTime,
                sortOrder: this.sortOrder,
            };
        }

        static fromJSON(data) {
            return new CourseInfo(data);
        }
    }

    // ============================================================================
    // 课程数据管理系统
    // ============================================================================

    class CandidateManager extends EventEmitter {
        constructor() {
            super();
            this.storage = StorageManager.getInstance();
            this.candidates = new Map();
            this.initialized = false;
        }

        async init() {
            if (this.initialized) return;

            await this.loadCandidates();
            this.initialized = true;
        }

        async loadCandidates() {
            try {
                const data = await this.storage.load(CONFIG.storage.candidates, []);
                this.candidates.clear();

                // 加载课程数据
                data.forEach((courseData) => {
                    const course = CourseInfo.fromJSON(courseData);
                    this.candidates.set(course.getUniqueKey(), course);
                });

                // 规范化sortOrder：如果发现有时间戳类型的sortOrder，重新分配索引
                const courses = Array.from(this.candidates.values());
                const hasTimestampSortOrder = courses.some(course => course.sortOrder > 1000000000); // 检查是否有时间戳

                if (hasTimestampSortOrder) {
                    console.log("检测到旧版本的sortOrder，正在重新规范化...");
                    // 按现有的sortOrder排序，然后重新分配连续的索引
                    courses.sort((a, b) => a.sortOrder - b.sortOrder);
                    courses.forEach((course, index) => {
                        course.sortOrder = index;
                    });
                    // 保存规范化后的数据
                    await this.saveCandidates();
                }

                this.emit("candidatesLoaded", this.getCandidatesArray());
            } catch (error) {
                console.error("加载候选课程失败:", error);
                this.emit("error", "加载候选课程失败");
            }
        }

        async saveCandidates() {
            try {
                const data = this.getCandidatesArray().map((course) => course.toJSON());
                await this.storage.save(CONFIG.storage.candidates, data);
                this.emit("candidatesSaved", this.getCandidatesArray());
                return true;
            } catch (error) {
                console.error("保存候选课程失败:", error);
                this.emit("error", "保存候选课程失败");
                return false;
            }
        }

        async addCandidate(courseData) {
            try {
                const course = new CourseInfo(courseData);
                const key = course.getUniqueKey();

                if (this.candidates.has(key)) {
                    this.emit("error", "课程已在候选列表中");
                    return false;
                }

                // 设置新课程的sortOrder为当前列表长度，这样它会被添加到末尾
                course.sortOrder = this.candidates.size;

                this.candidates.set(key, course);
                const success = await this.saveCandidates();

                if (success) {
                    this.emit("candidateAdded", course);
                    return true;
                }
                return false;
            } catch (error) {
                console.error("添加候选课程失败:", error);
                this.emit("error", "添加候选课程失败");
                return false;
            }
        }

        async removeCandidate(courseNo, sequenceNo) {
            try {
                const key = `${courseNo}-${sequenceNo}`;
                const course = this.candidates.get(key);

                if (!course) {
                    this.emit("error", "课程不在候选列表中");
                    return false;
                }

                this.candidates.delete(key);
                const success = await this.saveCandidates();

                if (success) {
                    this.emit("candidateRemoved", course);
                    return true;
                }
                return false;
            } catch (error) {
                console.error("移除候选课程失败:", error);
                this.emit("error", "移除候选课程失败");
                return false;
            }
        }

        isCandidate(courseNo, sequenceNo) {
            const key = `${courseNo}-${sequenceNo}`;
            return this.candidates.has(key);
        }

        getCandidate(courseNo, sequenceNo) {
            const key = `${courseNo}-${sequenceNo}`;
            return this.candidates.get(key);
        }

        getCandidatesArray() {
            return Array.from(this.candidates.values()).sort((a, b) => a.sortOrder - b.sortOrder);
        }

        getCandidatesCount() {
            return this.candidates.size;
        }

        async clearCandidates() {
            this.candidates.clear();
            const success = await this.saveCandidates();
            if (success) {
                this.emit("candidatesCleared");
            }
            return success;
        }

        getAvailableCandidates() {
            return this.getCandidatesArray().filter((course) => course.hasAvailableSeats());
        }

        async reorderCandidates(orderedKeys) {
            try {
                // 根据新的顺序更新sortOrder
                orderedKeys.forEach((key, index) => {
                    const course = this.candidates.get(key);
                    if (course) {
                        course.sortOrder = index;
                    }
                });

                const success = await this.saveCandidates();
                if (success) {
                    this.emit("candidatesReordered", this.getCandidatesArray());
                }
                return success;
            } catch (error) {
                console.error("重新排序候选课程失败:", error);
                this.emit("error", "重新排序失败");
                return false;
            }
        }
    }

    // ============================================================================
    // 课程信息提取器
    // ============================================================================

    class CourseExtractor {
        static extractFromRow(row) {
            try {
                const cells = row.querySelectorAll("td");
                if (cells.length < 14) return null;

                const getText = (cell) => cell?.textContent?.trim() || "";
                const getLinkText = (cell) => {
                    const link = cell?.querySelector("a");
                    return link ? link.textContent.trim() : getText(cell);
                };

                return {
                    department: getText(cells[0]),
                    courseNo: getText(cells[1]),
                    sequenceNo: getText(cells[2]),
                    courseName: getLinkText(cells[3]),
                    credits: getText(cells[4]),
                    teacher: getLinkText(cells[5]),
                    undergradCapacity: getText(cells[6]),
                    undergradAvailable: getText(cells[7]),
                    gradCapacity: getText(cells[8]),
                    gradAvailable: getText(cells[9]),
                    timePlace: getText(cells[10]),
                    note: getText(cells[11]),
                    courseFeature: getText(cells[12]),
                    grade: getText(cells[13]),
                };
            } catch (error) {
                console.error("提取课程信息失败:", error);
                return null;
            }
        }

        static validateCourseData(courseData) {
            if (!courseData) return false;

            const required = ["courseNo", "sequenceNo", "courseName"];
            return required.every((field) => courseData[field]?.trim?.());
        }
    }

    // ============================================================================
    // 用户界面组件基类
    // ============================================================================

    class BaseComponent extends EventEmitter {
        constructor(options = {}) {
            super();
            this.element = null;
            this.options = { ...this.getDefaultOptions(), ...options };
            this.isDestroyed = false;
        }

        getDefaultOptions() {
            return {};
        }

        createElement(tag, className = "", attributes = {}) {
            const element = document.createElement(tag);
            if (className) element.className = className;

            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });

            return element;
        }

        render() {
            throw new Error("render method must be implemented");
        }

        mount(parent) {
            if (this.isDestroyed) return;

            if (!this.element) {
                this.element = this.render();
            }

            if (parent && this.element) {
                parent.appendChild(this.element);
                this.emit("mounted");
            }
        }

        unmount() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
                this.emit("unmounted");
            }
        }

        destroy() {
            this.unmount();
            this.isDestroyed = true;
            this.emit("destroyed");
        }

        updateOptions(newOptions) {
            this.options = { ...this.options, ...newOptions };
            this.emit("optionsUpdated", this.options);
        }
    }

    // ============================================================================
    // 候选课程面板组件
    // ============================================================================

    class CandidatePanel extends BaseComponent {
        constructor(candidateManager, options = {}) {
            super(options);
            this.candidateManager = candidateManager;
            this.notification = NotificationSystem.getInstance();
            this.isMinimized = false;
            this.isDragging = false;
            this.position = { ...CONFIG.ui.panel.defaultPosition };

            this.bindEvents();
        }

        getDefaultOptions() {
            return {
                draggable: true,
                minimizable: true,
                closable: true,
            };
        }

        bindEvents() {
            this.candidateManager.on("candidateAdded", () => this.update());
            this.candidateManager.on("candidateRemoved", () => this.update());
            this.candidateManager.on("candidatesLoaded", () => this.update());
            this.candidateManager.on("candidatesCleared", () => this.update());
            this.candidateManager.on("candidatesReordered", () => this.update());
        }

        render() {
            const panel = this.createElement("div", "thu-floating-panel");
            panel.style.top = `${this.position.top}px`;
            panel.style.right = `${this.position.right}px`;

            panel.innerHTML = this.getPanelHTML();
            this.bindPanelEvents(panel);

            return panel;
        }

        getPanelHTML() {
            const count = this.candidateManager.getCandidatesCount();
            return `
                <div class="thu-panel-header">
                    <div class="thu-panel-title">
                        📚 候选课程
                        ${count > 0 ? `<span class="thu-candidate-count">${count}</span>` : ""}
                    </div>
                    <div class="thu-panel-controls">
                        ${this.options.minimizable
                    ? '<button class="thu-panel-control-btn minimize-btn" title="最小化">−</button>'
                    : ""
                }
                        ${this.options.closable
                    ? '<button class="thu-panel-control-btn close-btn" title="关闭">×</button>'
                    : ""
                }
                    </div>
                </div>
                <div class="thu-panel-content">
                    ${this.getContentHTML()}
                </div>
            `;
        }

        getContentHTML() {
            const candidates = this.candidateManager.getCandidatesArray();

            if (candidates.length === 0) {
                return '<div class="thu-empty-message">🎯 暂无候选课程<br><small>在课程列表中点击"添加为候选"来添加课程</small></div>';
            }

            const sortingHint =
                candidates.length > 1
                    ? '<div style="text-align: center; color: #718096; font-size: 11px; margin-bottom: 8px; padding: 4px;">💡 拖拽课程项目可以重新排序</div>'
                    : "";

            return sortingHint + candidates.map((course) => this.getCourseItemHTML(course)).join("");
        }

        getCourseItemHTML(course) {
            const capacity = course.getCapacityStatus();
            const undergradClass = capacity.undergrad.hasSeats ? "thu-capacity-available" : "thu-capacity-full";
            const gradClass = capacity.grad.hasSeats ? "thu-capacity-available" : "thu-capacity-full";

            return `
                <div class="thu-course-item-compact thu-fade-in" data-course-key="${Utils.escapeHtml(
                course.getUniqueKey()
            )}" draggable="true">
                    <div class="thu-drag-handle" title="拖拽以排序"></div>
                    
                    <!-- 主要信息区域 -->
                    <div class="thu-course-main-compact">
                        <div class="thu-course-header-compact">
                            <div class="thu-course-title-compact clickable" 
                                 data-copy="${Utils.escapeHtml(course.courseName)}" 
                                 title="点击复制课程名称: ${Utils.escapeHtml(course.courseName)}">${Utils.escapeHtml(course.courseName)}</div>
                            <div class="thu-time-place-compact">${Utils.escapeHtml(course.timePlace)}</div>
                            <div class="thu-course-meta-compact">
                                <span class="thu-credits-compact">${Utils.escapeHtml(course.credits)}学分</span>
                            </div>
                        </div>
                        
                        <div class="thu-course-codes-compact">
                            <span class="thu-course-code-compact clickable" 
                                  data-copy="${Utils.escapeHtml(course.courseNo)}" 
                                  title="点击复制课程号: ${Utils.escapeHtml(course.courseNo)}">
                                ${Utils.escapeHtml(course.courseNo)}
                            </span>
                            <span class="thu-sequence-code-compact clickable" 
                                  data-copy="${Utils.escapeHtml(course.sequenceNo)}" 
                                  title="点击复制课序号: ${Utils.escapeHtml(course.sequenceNo)}">
                                ${Utils.escapeHtml(course.sequenceNo)}
                            </span>
                            <span class="thu-teacher-compact clickable" 
                                  data-copy="${Utils.escapeHtml(course.teacher)}" 
                                  title="点击复制任课教师: ${Utils.escapeHtml(course.teacher)}">${Utils.escapeHtml(course.teacher)}</span>
                            <span class="thu-department-compact">${Utils.escapeHtml(course.department)}</span>
                        </div>
                    </div>

                    <!-- 容量信息区域 -->
                    <div class="thu-capacity-compact">
                        <div class="thu-capacity-item-compact">
                            <span class="thu-capacity-label-compact">本科</span>
                            <span class="thu-capacity-value ${undergradClass}">
                                ${capacity.undergrad.available}/${capacity.undergrad.total}
                            </span>
                        </div>
                        <div class="thu-capacity-item-compact">
                            <span class="thu-capacity-label-compact">研究生</span>
                            <span class="thu-capacity-value ${gradClass}">
                                ${capacity.grad.available}/${capacity.grad.total}
                            </span>
                        </div>
                    </div>

                    <!-- 操作按钮区域 -->
                    <div class="thu-course-actions-compact">
                        <button class="thu-action-btn-compact thu-remove-btn" 
                                data-course-no="${Utils.escapeHtml(course.courseNo)}" 
                                data-sequence-no="${Utils.escapeHtml(course.sequenceNo)}" 
                                title="移除课程">
                            🗑️
                        </button>
                        <button class="thu-action-btn-compact thu-expand-btn" 
                                title="展开详细信息">
                            📄
                        </button>
                    </div>

                    <!-- 详细信息区域（默认隐藏） -->
                    <div class="thu-course-details-expandable" style="display: none;">
                        ${course.courseFeature
                    ? `<div><strong>🏷️ 课程特色:</strong> ${Utils.escapeHtml(course.courseFeature)}</div>`
                    : ""
                }
                        ${course.note ? `<div><strong>📝 选课说明:</strong> ${Utils.escapeHtml(course.note)}</div>` : ""
                }
                        ${course.grade
                    ? `<div><strong>🎓 适用年级:</strong> ${Utils.escapeHtml(course.grade)}</div>`
                    : ""
                }
                        <div style="margin-top: 8px; color: #718096; font-size: 10px;">
                            添加时间: ${Utils.escapeHtml(course.addTime)}
                        </div>
                    </div>
                </div>
            `;
        }

        bindPanelEvents(panel) {
            // 最小化按钮
            const minimizeBtn = panel.querySelector(".minimize-btn");
            if (minimizeBtn) {
                minimizeBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.toggleMinimize();
                });
            }

            // 关闭按钮
            const closeBtn = panel.querySelector(".close-btn");
            if (closeBtn) {
                closeBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.hide();
                });
            }

            // 拖动功能
            if (this.options.draggable) {
                this.setupDragFunctionality(panel);
            }

            // 面板内容事件委托
            this.setupContentEvents(panel);

            // 最小化状态下的点击展开
            panel.addEventListener("click", (e) => {
                if (this.isMinimized && e.target === panel) {
                    this.toggleMinimize();
                }
            });
        }

        setupDragFunctionality(panel) {
            const header = panel.querySelector(".thu-panel-header");
            if (!header) return;

            let dragState = {
                isDragging: false,
                hasMoved: false,
                startPos: { x: 0, y: 0 },
                offset: { x: 0, y: 0 },
            };

            const onMouseDown = (e) => {
                // 忽略按钮点击
                if (e.target.classList.contains("thu-panel-control-btn")) return;

                dragState.isDragging = true;
                dragState.hasMoved = false;
                dragState.startPos = { x: e.clientX, y: e.clientY };

                const rect = panel.getBoundingClientRect();
                dragState.offset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                };

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);

                e.preventDefault();
                document.body.style.userSelect = "none";
            };

            const onMouseMove = Utils.throttle((e) => {
                if (!dragState.isDragging) return;

                const moveDistance = Math.sqrt(
                    Math.pow(e.clientX - dragState.startPos.x, 2) + Math.pow(e.clientY - dragState.startPos.y, 2)
                );

                if (moveDistance > 5 && !dragState.hasMoved) {
                    dragState.hasMoved = true;
                    panel.style.transition = "none";
                }

                if (dragState.hasMoved) {
                    this.updatePosition(e.clientX - dragState.offset.x, e.clientY - dragState.offset.y);
                }
            }, 16);

            const onMouseUp = () => {
                if (!dragState.isDragging) return;

                dragState.isDragging = false;
                panel.style.transition = "";
                document.body.style.userSelect = "";

                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            header.addEventListener("mousedown", onMouseDown);
        }

        setupContentEvents(panel) {
            const content = panel.querySelector(".thu-panel-content");
            if (!content) return;

            content.addEventListener("click", (e) => {
                const target = e.target;

                if (
                    (target.classList.contains("thu-course-code-compact") ||
                        target.classList.contains("thu-sequence-code-compact") ||
                        target.classList.contains("thu-course-title-compact") ||
                        target.classList.contains("thu-teacher-compact")) &&
                    target.classList.contains("clickable")
                ) {
                    const copyText = target.getAttribute("data-copy");
                    if (copyText) {
                        this.copyToClipboard(copyText);
                    }
                } else if (target.classList.contains("thu-remove-btn")) {
                    const courseNo = target.getAttribute("data-course-no");
                    const sequenceNo = target.getAttribute("data-sequence-no");
                    if (courseNo && sequenceNo) {
                        this.removeCandidate(courseNo, sequenceNo);
                    }
                } else if (target.classList.contains("thu-expand-btn")) {
                    // 处理展开/折叠详细信息
                    const courseItem = target.closest(".thu-course-item-compact");
                    if (courseItem) {
                        this.toggleCourseDetails(courseItem, target);
                    }
                }
            });

            // 设置拖拽排序功能
            this.setupDragSorting(content);
        }

        setupDragSorting(content) {
            let draggedElement = null;
            let placeholder = null;

            content.addEventListener("dragstart", (e) => {
                const courseItem = e.target.closest(".thu-course-item, .thu-course-item-compact");
                if (!courseItem) return;

                draggedElement = courseItem;

                // 创建占位符
                placeholder = this.createPlaceholder();

                // 设置拖拽样式
                courseItem.classList.add("dragging");
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/html", courseItem.outerHTML);

                // 延迟添加占位符，避免拖拽开始时的闪烁
                setTimeout(() => {
                    if (draggedElement?.parentNode) {
                        draggedElement.parentNode.insertBefore(placeholder, draggedElement.nextSibling);
                    }
                }, 0);
            });

            content.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";

                if (!draggedElement || !placeholder) return;

                const courseItem = e.target.closest(".thu-course-item, .thu-course-item-compact");
                if (!courseItem || courseItem === draggedElement || courseItem === placeholder) return;

                const rect = courseItem.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                if (e.clientY < midpoint) {
                    // 插入到当前元素之前
                    courseItem.parentNode.insertBefore(placeholder, courseItem);
                } else {
                    // 插入到当前元素之后
                    courseItem.parentNode.insertBefore(placeholder, courseItem.nextSibling);
                }
            });

            content.addEventListener("dragenter", (e) => {
                e.preventDefault();
                const courseItem = e.target.closest(".thu-course-item, .thu-course-item-compact");
                if (courseItem && courseItem !== draggedElement && courseItem !== placeholder) {
                    courseItem.classList.add("drag-over");
                }
            });

            content.addEventListener("dragleave", (e) => {
                const courseItem = e.target.closest(".thu-course-item, .thu-course-item-compact");
                if (courseItem) {
                    courseItem.classList.remove("drag-over");
                }
            });

            content.addEventListener("drop", (e) => {
                e.preventDefault();
                if (!draggedElement || !placeholder) return;

                // 移除所有拖拽相关的样式
                const allItems = content.querySelectorAll(".thu-course-item, .thu-course-item-compact");
                allItems.forEach((item) => {
                    item.classList.remove("drag-over", "dragging");
                });

                // 获取新的排序
                this.handleDragDrop(placeholder, draggedElement);
            });

            content.addEventListener("dragend", (e) => {
                // 清理拖拽状态
                if (draggedElement) {
                    draggedElement.classList.remove("dragging");
                }

                if (placeholder?.parentNode) {
                    placeholder.parentNode.removeChild(placeholder);
                }

                const allItems = content.querySelectorAll(".thu-course-item, .thu-course-item-compact");
                allItems.forEach((item) => {
                    item.classList.remove("drag-over");
                });

                draggedElement = null;
                placeholder = null;
            });
        }

        createPlaceholder() {
            const placeholder = document.createElement("div");
            placeholder.className = "thu-course-item-compact placeholder";
            placeholder.style.height = "80px";
            placeholder.style.background = "linear-gradient(135deg, #e2e8f0 0%, #f7fafc 100%)";
            placeholder.style.border = "2px dashed #cbd5e0";
            placeholder.style.borderRadius = "8px";
            placeholder.style.display = "flex";
            placeholder.style.alignItems = "center";
            placeholder.style.justifyContent = "center";
            placeholder.style.color = "#a0aec0";
            placeholder.style.fontWeight = "500";
            placeholder.innerHTML = "释放以放置课程";
            return placeholder;
        }

        async handleDragDrop(placeholder, draggedElement) {
            try {
                // 获取占位符的父容器
                const container = placeholder.parentNode;

                // 获取所有子元素（包括占位符，但排除被拖拽的元素）
                const allChildren = Array.from(container.children);

                // 构建新的排序数组
                const newOrder = [];

                // 遍历所有子元素，构建新的顺序
                allChildren.forEach((child) => {
                    if (child === placeholder) {
                        // 在占位符位置插入被拖拽的元素
                        newOrder.push(draggedElement.dataset.courseKey);
                    } else if (child !== draggedElement && child.dataset?.courseKey) {
                        // 添加其他课程元素（排除被拖拽的元素）
                        newOrder.push(child.dataset.courseKey);
                    }
                });

                console.log("排序前:", this.candidateManager.getCandidatesArray().map(c => c.getUniqueKey()));
                console.log("新排序:", newOrder);

                // 更新候选管理器中的排序
                const success = await this.candidateManager.reorderCandidates(newOrder);

                if (success) {
                    this.notification.success("课程排序已更新");
                    // 重新渲染内容以反映新的排序
                    this.update();
                } else {
                    this.notification.error("排序更新失败");
                }
            } catch (error) {
                console.error("处理拖拽排序失败:", error);
                this.notification.error("排序操作失败");
            }
        }

        async copyToClipboard(text) {
            try {
                if (typeof GM_setClipboard !== "undefined") {
                    GM_setClipboard(text);
                    this.notification.success(`已复制: ${text}`);
                    return;
                }

                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(text);
                    this.notification.success(`已复制: ${text}`);
                    return;
                }

                // 备用方法（已弃用但作为最后手段）
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    const success = document.execCommand("copy");
                    if (success) {
                        this.notification.success(`已复制: ${text}`);
                    } else {
                        throw new Error("execCommand failed");
                    }
                } catch (cmdError) {
                    console.warn("复制命令失败:", cmdError);
                    this.notification.error("复制失败，请手动复制");
                } finally {
                    document.body.removeChild(textarea);
                }
            } catch (error) {
                console.error("复制失败:", error);
                this.notification.error("复制失败");
            }
        }

        toggleCourseDetails(courseItem, button) {
            const detailsElement = courseItem.querySelector(".thu-course-details-expandable");
            if (!detailsElement) return;

            const isExpanded = detailsElement.style.display !== "none";

            if (isExpanded) {
                // 折叠
                detailsElement.style.display = "none";
                button.textContent = "📄";
                button.title = "展开详细信息";
                courseItem.classList.remove("expanded");
            } else {
                // 展开
                detailsElement.style.display = "block";
                button.textContent = "📖";
                button.title = "收起详细信息";
                courseItem.classList.add("expanded");

                // 添加展开动画
                detailsElement.style.opacity = "0";
                detailsElement.style.transform = "translateY(-10px)";

                // 使用 requestAnimationFrame 来确保样式被应用
                requestAnimationFrame(() => {
                    detailsElement.style.transition = "opacity 0.3s ease, transform 0.3s ease";
                    detailsElement.style.opacity = "1";
                    detailsElement.style.transform = "translateY(0)";
                });
            }
        }

        async removeCandidate(courseNo, sequenceNo) {
            const success = await this.candidateManager.removeCandidate(courseNo, sequenceNo);
            if (success) {
                this.notification.success("已从候选列表中移除");
                this.emit("candidateRemoved", { courseNo, sequenceNo });
            }
        }

        updatePosition(left, top) {
            const maxLeft = window.innerWidth - this.element.offsetWidth;
            const maxTop = window.innerHeight - this.element.offsetHeight;

            left = Math.max(0, Math.min(left, maxLeft));
            top = Math.max(0, Math.min(top, maxTop));

            this.element.style.left = `${left}px`;
            this.element.style.top = `${top}px`;
            this.element.style.right = "auto";

            this.position = { left, top };
        }

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;

            if (this.isMinimized) {
                this.element.classList.add("minimized");
            } else {
                this.element.classList.remove("minimized");
            }

            this.emit("minimizeToggled", this.isMinimized);
        }

        show() {
            if (this.element) {
                this.element.style.display = "block";
                this.emit("shown");
            }
        }

        hide() {
            if (this.element) {
                this.element.style.display = "none";
                this.emit("hidden");
            }
        }

        update() {
            if (!this.element) return;

            // 保存当前的最小化状态
            const wasMinimized = this.isMinimized;

            this.element.innerHTML = this.getPanelHTML();
            this.bindPanelEvents(this.element);

            // 恢复最小化状态
            if (wasMinimized) {
                this.element.classList.add("minimized");
            }

            this.emit("updated");
        }
    }

    // ============================================================================
    // 课程表格处理器
    // ============================================================================

    class CourseTableProcessor extends EventEmitter {
        constructor(candidateManager, options = {}) {
            super();
            this.candidateManager = candidateManager;
            this.notification = NotificationSystem.getInstance();
            this.options = { ...this.getDefaultOptions(), ...options };
            this.processedTables = new WeakSet();
            this.observer = null;

            this.bindEvents();
        }

        getDefaultOptions() {
            return {
                buttonText: {
                    add: "添加为候选",
                    remove: "移除候选",
                },
                autoUpdate: true,
                observeChanges: true,
            };
        }

        bindEvents() {
            this.candidateManager.on("candidateAdded", (course) => {
                this.updateButtonState(course.courseNo, course.sequenceNo, true);
            });

            this.candidateManager.on("candidateRemoved", (course) => {
                this.updateButtonState(course.courseNo, course.sequenceNo, false);
            });
        }

        async processTables(targetDocument = document) {
            try {
                const tables = this.findCourseTables(targetDocument);
                let processedCount = 0;

                for (const table of tables) {
                    if (this.processedTables.has(table)) continue;

                    const success = await this.processTable(table, targetDocument);
                    if (success) {
                        this.processedTables.add(table);
                        processedCount++;
                    }
                }

                if (processedCount > 0) {
                    this.emit("tablesProcessed", { count: processedCount, tables });
                }

                // 设置变更观察器
                if (this.options.observeChanges && !this.observer) {
                    this.setupObserver(targetDocument);
                }

                return processedCount > 0;
            } catch (error) {
                console.error("处理课程表格失败:", error);
                this.emit("error", error);
                return false;
            }
        }

        findCourseTables(targetDocument = document) {
            const tables = Array.from(targetDocument.querySelectorAll(CONFIG.selectors.courseTable));

            return tables.filter((table) => {
                const headerRow = table.querySelector("tr");
                if (!headerRow) return false;

                const headerText = headerRow.textContent;
                return headerText.includes("课程号") && headerText.includes("课序号") && headerText.includes("课程名");
            });
        }

        async processTable(table, targetDocument = document) {
            try {
                const rows = Array.from(table.querySelectorAll("tr"));
                if (rows.length < 2) return false;

                // 处理表头
                this.processTableHeader(rows[0], targetDocument);

                // 处理数据行
                let processedRows = 0;
                for (let i = 1; i < rows.length; i++) {
                    const success = await this.processTableRow(rows[i], targetDocument);
                    if (success) processedRows++;
                }

                this.emit("tableProcessed", { table, processedRows });
                return processedRows > 0;
            } catch (error) {
                console.error("处理表格失败:", error);
                return false;
            }
        }

        processTableHeader(headerRow, targetDocument = document) {
            // 检查是否已添加操作列
            if (headerRow.querySelector(".thu-candidate-header")) return;

            const headerCell = targetDocument.createElement("td");
            headerCell.className = "thu-candidate-header";
            headerCell.style.width = "80px";
            headerCell.style.textAlign = "center";
            headerCell.innerHTML = "<strong>操作</strong>";

            headerRow.appendChild(headerCell);
        }

        async processTableRow(row, targetDocument = document) {
            try {
                // 检查是否已处理
                if (row.querySelector(".thu-candidate-btn")) return false;

                const courseData = CourseExtractor.extractFromRow(row);
                if (!CourseExtractor.validateCourseData(courseData)) return false;

                const button = this.createCandidateButton(courseData, targetDocument);
                const cell = this.createButtonCell(button, targetDocument);

                row.appendChild(cell);
                this.emit("rowProcessed", { row, courseData });

                return true;
            } catch (error) {
                console.error("处理表格行失败:", error);
                return false;
            }
        }

        createCandidateButton(courseData, targetDocument = document) {
            const button = targetDocument.createElement("button");
            const isCandidate = this.candidateManager.isCandidate(courseData.courseNo, courseData.sequenceNo);

            button.className = `thu-candidate-btn ${isCandidate ? "added" : ""}`;
            button.textContent = isCandidate ? this.options.buttonText.remove : this.options.buttonText.add;
            button.title = isCandidate ? "从候选列表中移除" : "添加到候选列表";

            // 存储课程数据
            button.dataset.courseNo = courseData.courseNo;
            button.dataset.sequenceNo = courseData.sequenceNo;

            button.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleButtonClick(button, courseData);
            });

            return button;
        }

        createButtonCell(button, targetDocument = document) {
            const cell = targetDocument.createElement("td");
            cell.style.width = "80px";
            cell.style.textAlign = "center";
            cell.style.verticalAlign = "middle";
            cell.appendChild(button);
            return cell;
        }

        async handleButtonClick(button, courseData) {
            try {
                const isCurrentlyCandidate = button.classList.contains("added");

                // 添加加载状态
                const originalText = button.textContent;
                button.disabled = true;
                button.innerHTML = '<span class="thu-loading"></span>处理中...';

                let success;
                if (isCurrentlyCandidate) {
                    success = await this.candidateManager.removeCandidate(courseData.courseNo, courseData.sequenceNo);
                    if (success) {
                        this.notification.success("已从候选列表中移除");
                    }
                } else {
                    success = await this.candidateManager.addCandidate(courseData);
                    if (success) {
                        this.notification.success("已添加到候选列表");
                    }
                }

                // 恢复按钮状态
                button.disabled = false;
                if (success) {
                    this.updateSingleButton(button, !isCurrentlyCandidate);
                } else {
                    button.textContent = originalText;
                }

                this.emit("buttonClicked", { button, courseData, success, action: isCurrentlyCandidate ? "remove" : "add" });
            } catch (error) {
                console.error("按钮点击处理失败:", error);
                button.disabled = false;
                button.textContent = originalText;
                this.notification.error("操作失败，请重试");
            }
        }

        updateSingleButton(button, isCandidate) {
            if (isCandidate) {
                button.classList.add("added");
                button.textContent = this.options.buttonText.remove;
                button.title = "从候选列表中移除";
            } else {
                button.classList.remove("added");
                button.textContent = this.options.buttonText.add;
                button.title = "添加到候选列表";
            }
        }

        updateButtonState(courseNo, sequenceNo, isCandidate) {
            const buttons = document.querySelectorAll(".thu-candidate-btn");
            buttons.forEach((button) => {
                if (button.dataset.courseNo === courseNo && button.dataset.sequenceNo === sequenceNo) {
                    this.updateSingleButton(button, isCandidate);
                }
            });
        }

        setupObserver(targetDocument = document) {
            if (this.observer) this.observer.disconnect();

            const checkForNewTableContent = (addedNodes) => {
                return addedNodes.some(
                    (node) => node.nodeType === Node.ELEMENT_NODE && (node.tagName === "TR" || node.querySelector?.("tr"))
                );
            };

            const handleMutations = (mutations) => {
                let shouldProcess = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === "childList") {
                        const addedNodes = Array.from(mutation.addedNodes);
                        if (checkForNewTableContent(addedNodes)) {
                            shouldProcess = true;
                        }
                    }
                });

                if (shouldProcess) {
                    this.processTables(targetDocument);
                }
            };

            this.observer = new MutationObserver(Utils.debounce(handleMutations, 300));

            this.observer.observe(targetDocument.body, {
                childList: true,
                subtree: true,
            });
        }

        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            this.processedTables = new WeakSet();
            this.emit("destroyed");
        }
    }

    // ============================================================================
    // 页面检测器
    // ============================================================================

    class PageDetector {
        static detectPageType(url = window.location.href) {
            console.log("Thu Course Assistant: 开始检测页面类型，URL:", url);

            const detectionRules = [
                {
                    type: "courseSearch",
                    patterns: [CONFIG.urls.searchPage],
                    validate: () => this.hasCourseTables(),
                },
                {
                    type: "courseSelection",
                    patterns: [CONFIG.urls.mainPage],
                    validate: () => this.isValidSelectionPage(url),
                },
            ];

            for (const rule of detectionRules) {
                const urlMatches = Utils.isValidUrl(url, rule.patterns);
                const validationPassed = rule.validate();
                console.log(`Thu Course Assistant: 检测规则 ${rule.type}:`, {
                    urlMatches,
                    validationPassed,
                    patterns: rule.patterns
                });

                if (urlMatches && validationPassed) {
                    console.log(`Thu Course Assistant: 匹配到页面类型: ${rule.type}`);
                    return rule.type;
                }
            }

            console.log("Thu Course Assistant: 未匹配到任何页面类型");
            return "unknown";
        }

        static hasCourseTables() {
            const tables = document.querySelectorAll("table");
            console.log(`Thu Course Assistant: 找到 ${tables.length} 个表格`);

            const hasValidTable = Array.from(tables).some((table, index) => {
                const headerRow = table.querySelector("tr");
                if (!headerRow) {
                    console.log(`Thu Course Assistant: 表格 ${index} 没有找到行`);
                    return false;
                }

                const headerText = headerRow.textContent;
                // 更灵活的检测条件：只要包含"课程号"就认为是课程表格
                const hasRequired = headerText.includes("课程号") && (
                    headerText.includes("课序号") ||
                    headerText.includes("课程名") ||
                    headerText.includes("开课院系") ||
                    headerText.includes("学分")
                );
                console.log(`Thu Course Assistant: 表格 ${index} 标题文本:`, headerText.substring(0, 200));
                console.log(`Thu Course Assistant: 表格 ${index} 包含必需字段:`, hasRequired);

                return hasRequired;
            });

            console.log(`Thu Course Assistant: 是否有有效的课程表格:`, hasValidTable);
            return hasValidTable;
        }

        static isValidSelectionPage(url) {
            const invalidPatterns = ["/xk/top.html", "XkbBs.do?m=showTree", "XkbBs.do?m=main"];
            return !invalidPatterns.some((pattern) => url.includes(pattern)) && url.includes("XkbBs.do?m=");
        }
    }

    // ============================================================================
    // 主应用程序类
    // ============================================================================

    class CourseAssistantApplication extends EventEmitter {
        constructor() {
            super();
            this.candidateManager = null;
            this.candidatePanel = null;
            this.tableProcessor = null;
            this.notification = null;
            this.isInitialized = false;
        }

        async init() {
            try {
                console.log("Thu Course Assistant: 初始化应用程序...");

                // 等待页面加载
                await this.waitForPageReady();

                // 检测页面类型
                const pageType = PageDetector.detectPageType();
                console.log(`Thu Course Assistant: 检测到页面类型: ${pageType}`);

                if (pageType === "unknown") {
                    console.log("Thu Course Assistant: 不支持的页面，跳过初始化");
                    return;
                }

                // 初始化核心组件
                await this.initializeComponents();

                // 启动应用
                await this.start();

                this.isInitialized = true;
                this.emit("initialized", { pageType });

                console.log("Thu Course Assistant: 应用程序初始化完成");
            } catch (error) {
                console.error("Thu Course Assistant: 初始化失败:", error);
                this.emit("error", error);
            }
        }

        async waitForPageReady() {
            return new Promise((resolve) => {
                if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", resolve, { once: true });
                } else {
                    resolve();
                }
            });
        }

        async initializeComponents() {
            // 注入样式
            StyleManager.inject();

            // 初始化通知系统
            this.notification = NotificationSystem.getInstance();

            // 初始化候选管理器
            this.candidateManager = new CandidateManager();
            await this.candidateManager.init();

            // 初始化表格处理器
            this.tableProcessor = new CourseTableProcessor(this.candidateManager);

            // 初始化候选面板
            this.candidatePanel = new CandidatePanel(this.candidateManager);

            this.bindGlobalEvents();
        }

        bindGlobalEvents() {
            // 候选管理器事件
            this.candidateManager.on("error", (message) => {
                this.notification.error(message);
            });

            // 表格处理器事件
            this.tableProcessor.on("tablesProcessed", ({ count }) => {
                console.log(`Thu Course Assistant: 处理了 ${count} 个课程表格`);
            });

            this.tableProcessor.on("error", (error) => {
                console.error("Thu Course Assistant: 表格处理错误:", error);
            });

            // 候选面板事件
            this.candidatePanel.on("candidateRemoved", ({ courseNo, sequenceNo }) => {
                console.log(`Thu Course Assistant: 从面板移除候选课程: ${courseNo}-${sequenceNo}`);
            });

            // 全局错误处理
            window.addEventListener("error", (event) => {
                if (event.filename?.includes?.("thu-classlist")) {
                    console.error("Thu Course Assistant: 全局错误:", event.error);
                }
            });

            // 页面卸载时清理
            window.addEventListener("beforeunload", () => {
                this.destroy();
            });
        }

        async start() {
            try {
                // 处理现有表格
                await this.tableProcessor.processTables();

                // 挂载候选面板
                this.candidatePanel.mount(document.body);

                // 显示启动通知
                this.notification.success("清华选课助手已启动");

                this.emit("started");
            } catch (error) {
                console.error("Thu Course Assistant: 启动失败:", error);
                throw error;
            }
        }

        async refresh() {
            if (!this.isInitialized) return;

            try {
                await this.tableProcessor.processTables();
                this.candidatePanel.update();
                this.emit("refreshed");
            } catch (error) {
                console.error("Thu Course Assistant: 刷新失败:", error);
                this.notification.error("刷新失败");
            }
        }

        destroy() {
            try {
                if (this.tableProcessor) {
                    this.tableProcessor.destroy();
                }

                if (this.candidatePanel) {
                    this.candidatePanel.destroy();
                }

                this.isInitialized = false;
                this.emit("destroyed");

                console.log("Thu Course Assistant: 应用程序已销毁");
            } catch (error) {
                console.error("Thu Course Assistant: 销毁失败:", error);
            }
        }

        // 公共 API
        async addCandidate(courseData) {
            if (!this.candidateManager) return false;
            return await this.candidateManager.addCandidate(courseData);
        }

        async removeCandidate(courseNo, sequenceNo) {
            if (!this.candidateManager) return false;
            return await this.candidateManager.removeCandidate(courseNo, sequenceNo);
        }

        getCandidates() {
            if (!this.candidateManager) return [];
            return this.candidateManager.getCandidatesArray();
        }

        showPanel() {
            if (this.candidatePanel) {
                this.candidatePanel.show();
            }
        }

        hidePanel() {
            if (this.candidatePanel) {
                this.candidatePanel.hide();
            }
        }
    }

    // ============================================================================
    // 应用程序入口
    // ============================================================================

    // 全局实例
    let appInstance = null;

    // 启动应用程序
    async function startApplication() {
        if (appInstance) {
            console.log("Thu Course Assistant: 应用程序已经在运行");
            return appInstance;
        }

        appInstance = new CourseAssistantApplication();

        // 暴露到全局作用域以便调试
        if (typeof window !== "undefined") {
            window.thuCourseAssistant = appInstance;
        }

        // 异步初始化
        await appInstance.init();

        return appInstance;
    }

    // 自动启动
    startApplication().catch((error) => {
        console.error("Thu Course Assistant: 启动失败:", error);
    });

    // ============================================================================
    // 开发工具和调试支持
    // ============================================================================

    if (typeof window !== "undefined" && window.location.hostname.includes("localhost")) {
        // 开发模式下的额外功能
        console.log("Thu Course Assistant: 开发模式已激活");

        // 暴露更多调试接口
        Object.assign(window.thuCourseAssistant, {
            CONFIG,
            Utils,
            StyleManager,
            NotificationSystem,
            StorageManager,
            CourseInfo,
            CandidateManager,
            CourseExtractor,
            BaseComponent,
            CandidatePanel,
            CourseTableProcessor,
            PageDetector,
        });
    }
})();
