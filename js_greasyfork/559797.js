// ==UserScript==
// @name         豆包网页性能优化脚本v1.2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  豆包网页版专属轻量化优化工具，聚焦滚动卡顿与渲染延迟，不干扰原生功能
// @author       豆包和我
// @match        https://www.doubao.com/*
// @match        https://doubao.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559797/%E8%B1%86%E5%8C%85%E7%BD%91%E9%A1%B5%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%ACv12.user.js
// @updateURL https://update.greasyfork.org/scripts/559797/%E8%B1%86%E5%8C%85%E7%BD%91%E9%A1%B5%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E8%84%9A%E6%9C%ACv12.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 仅保留渲染优化相关配置
    const OPTIMIZATION_CONFIG = {
        enableHardwareAcceleration: true, // GPU加速开关
        optimizeScroll: true // 滚动容器优化开关
    };

    class DoubaoOptimizer {
        constructor() {
            this.optimizationsApplied = false;
            this.init();
        }

        init() {
            console.log('🐰 豆包优化脚本启动中（仅保留渲染优化）...');
            // 等待DOM加载完成后执行渲染优化
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.applyOptimizations());
            } else {
                this.applyOptimizations();
            }
        }

        applyOptimizations() {
            if (this.optimizationsApplied) return;
            console.log('🔧 应用豆包渲染优化...');
            
            // 仅执行渲染优化，删除所有其他逻辑
            this.optimizeRendering();
            
            this.optimizationsApplied = true;
            console.log('✅ 渲染优化完成（仅保留核心渲染优化）');
        }

        // 核心：渲染优化（GPU加速 + 滚动容器优化）
        optimizeRendering() {
            // 1. GPU硬件加速（核心）
            if (OPTIMIZATION_CONFIG.enableHardwareAcceleration) {
                const style = document.createElement('style');
                style.textContent = `
                    .chat-container, .message-list, .scroll-container {
                        transform: translateZ(0); // 触发GPU加速
                        backface-visibility: hidden; // 减少重绘
                        perspective: 1000px; 
                        will-change: transform; // 浏览器提前优化
                    }
                    .message-item { contain: layout style paint; } // 隔离消息渲染
                    .fixed-element { position: fixed; z-index: 1000; } // 减少重绘区域
                `;
                document.head.appendChild(style);
            }

            // 2. 滚动容器优化（核心）
            if (OPTIMIZATION_CONFIG.optimizeScroll) {
                this.optimizeScrollContainers();
            }
        }

        // 滚动容器优化（渲染优化的子模块）
        optimizeScrollContainers() {
            const scrollSelectors = [
                '.scroll-container',
                '.message-list',
                '.chat-history',
                '[class*="scroll"]',
                '[class*="list"]'
            ];

            // 优化现有滚动容器
            const optimizeElement = (element) => {
                if (element) {
                    element.style.webkitOverflowScrolling = 'touch'; // 流畅滚动
                    element.style.overflowScrolling = 'touch';
                    element.style.transform = 'translateZ(0)'; // 滚动容器GPU加速
                }
            };

            // 立即优化已存在的滚动容器
            scrollSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(optimizeElement);
            });

            // 监听新增滚动容器（适配豆包动态生成的DOM）
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // 仅处理元素节点
                            scrollSelectors.forEach(selector => {
                                if (node.matches && node.matches(selector)) {
                                    optimizeElement(node);
                                }
                                if (node.querySelectorAll) {
                                    node.querySelectorAll(selector).forEach(optimizeElement);
                                }
                            });
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 初始化仅保留渲染优化的实例
    const optimizer = new DoubaoOptimizer();
    window.DoubaoOptimizer = optimizer;

    console.log('🐰 豆包性能优化脚本加载完成（仅保留渲染优化）！');
})();
