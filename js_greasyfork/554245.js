// ==UserScript==
// @name         无差别模糊效果优化器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将所有backdrop-filter模糊效果替换为opacity半透明，提升网页性能
// @author       Your Name
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554245/%E6%97%A0%E5%B7%AE%E5%88%AB%E6%A8%A1%E7%B3%8A%E6%95%88%E6%9E%9C%E4%BC%98%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554245/%E6%97%A0%E5%B7%AE%E5%88%AB%E6%A8%A1%E7%B3%8A%E6%95%88%E6%9E%9C%E4%BC%98%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 处理backdrop-filter相关样式
    function optimizeBlurEffects() {
        // 处理内联样式
        document.querySelectorAll('*').forEach(element => {
            const style = element.style;
            if (style.backdropFilter || style.webkitBackdropFilter) {
                // 将模糊效果转换为半透明
                let opacityValue = 0.8; // 默认透明度

                // 根据模糊程度调整透明度
                const blurMatch = (style.backdropFilter || style.webkitBackdropFilter).match(/blur\(([^)]+)\)/);
                if (blurMatch) {
                    const blurValue = blurMatch[1];
                    if (blurValue.includes('px')) {
                        const pxValue = parseFloat(blurValue);
                        // 模糊值越大，透明度越低（越不透明）
                        opacityValue = Math.max(0.3, 1 - (pxValue / 50));
                    }
                }

                // 彻底移除模糊效果
                style.backdropFilter = 'none';
                style.webkitBackdropFilter = 'none';
                
                // 设置背景色和透明度
                if (!style.backgroundColor || style.backgroundColor === 'transparent') {
                    style.backgroundColor = `rgba(255, 255, 255, ${opacityValue})`;
                } else {
                    // 如果已有背景色，调整其透明度
                    const bgColor = style.backgroundColor;
                    if (bgColor.startsWith('rgba')) {
                        const rgbaMatch = bgColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                        if (rgbaMatch) {
                            style.backgroundColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacityValue})`;
                        }
                    } else if (bgColor.startsWith('rgb')) {
                        const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                        if (rgbMatch) {
                            style.backgroundColor = `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacityValue})`;
                        }
                    } else if (bgColor.startsWith('#')) {
                        // 处理十六进制颜色
                        const hex = bgColor.replace('#', '');
                        let r, g, b;
                        if (hex.length === 3) {
                            r = parseInt(hex[0] + hex[0], 16);
                            g = parseInt(hex[1] + hex[1], 16);
                            b = parseInt(hex[2] + hex[2], 16);
                        } else {
                            r = parseInt(hex.substring(0, 2), 16);
                            g = parseInt(hex.substring(2, 4), 16);
                            b = parseInt(hex.substring(4, 6), 16);
                        }
                        style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
                    }
                }
            }
        });

        // 处理CSS样式表 - 更激进的方式
        const stylesheets = document.styleSheets;
        for (let i = 0; i < stylesheets.length; i++) {
            try {
                const rules = stylesheets[i].cssRules || stylesheets[i].rules;
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    if (rule.style && (rule.style.backdropFilter || rule.style.webkitBackdropFilter)) {
                        // 直接修改规则
                        if (rule.style.backdropFilter) {
                            rule.style.backdropFilter = 'none';
                        }
                        if (rule.style.webkitBackdropFilter) {
                            rule.style.webkitBackdropFilter = 'none';
                        }
                        
                        // 添加半透明背景
                        if (!rule.style.backgroundColor || rule.style.backgroundColor === 'transparent') {
                            rule.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                        }
                    }
                }
            } catch (e) {
                // 跨域样式表可能会抛出安全错误，忽略即可
            }
        }
    }

    // 创建全局样式覆盖所有backdrop-filter
    function createGlobalOverride() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }
            
            [style*="backdrop-filter"], 
            [style*="-webkit-backdrop-filter"] {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 监听DOM变化，处理动态添加的元素
    const observer = new MutationObserver(function(mutations) {
        let shouldOptimize = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                shouldOptimize = true;
            }
        });
        if (shouldOptimize) {
            setTimeout(optimizeBlurEffects, 50);
        }
    });

    // 初始化优化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            createGlobalOverride();
            optimizeBlurEffects();
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else {
        createGlobalOverride();
        optimizeBlurEffects();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 定期检查，确保没有漏网之鱼
    setInterval(optimizeBlurEffects, 1000);

    console.log('无差别模糊效果优化脚本已加载 - 所有模糊效果已被替换');
})();