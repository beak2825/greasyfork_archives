// ==UserScript==
// @name         自动移除水印工具（搞定设计、创客贴、比格设计、爱设计、易企秀、标小智、标智客等）
// @namespace    https://example.com
// @version      2.0.1
// @description  自动移除在线设计平台的水印，
// @author       chatxxsc_t
// @match        https://*.gaoding.com/*
// @match        https://*.eqxiu.com/*
// @match        https://*.chuangkit.com/*
// @match        https://bigesj.com/*
// @match        https://www.isheji.com/*
// @match        https://www.logosc.cn/*
// @match        https://www.focodesign.com/*
// @match        https://www.logomaker.com.cn/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553619/%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E6%B0%B4%E5%8D%B0%E5%B7%A5%E5%85%B7%EF%BC%88%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E3%80%81%E7%88%B1%E8%AE%BE%E8%AE%A1%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80%E3%80%81%E6%A0%87%E5%B0%8F%E6%99%BA%E3%80%81%E6%A0%87%E6%99%BA%E5%AE%A2%E7%AD%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553619/%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E6%B0%B4%E5%8D%B0%E5%B7%A5%E5%85%B7%EF%BC%88%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E3%80%81%E7%88%B1%E8%AE%BE%E8%AE%A1%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80%E3%80%81%E6%A0%87%E5%B0%8F%E6%99%BA%E3%80%81%E6%A0%87%E6%99%BA%E5%AE%A2%E7%AD%89%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建移除水印的按钮
    function createRemoveButton() {
        const button = document.createElement('button');
        button.innerHTML = '🚫 移除水印';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            background: #ff4757;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

        button.addEventListener('click', removeWatermarks);
        document.body.appendChild(button);
    }

    // 移除水印的主要函数
    function removeWatermarks() {
        const hostname = window.location.hostname;

        // 通用的水印选择器
        const commonWatermarkSelectors = [
            '.watermark',
            '.water-mark',
            '[class*="watermark"]',
            '[class*="water-mark"]',
            '.eqc-watermark',
            '.editor-watermask',
            '.watermarklayer',
            '#watermark'
        ];

        // 针对特定平台的额外选择器
        const platformSelectors = {
            'gaoding.com': [
                '.watermark',
                '[class*="watermark"]'
            ],
            'eqxiu.com': [
                '.eqc-watermark',
                '.eqc-wm-close'
            ],
            'chuangkit.com': [
                '.water-mark',
                '.canvas-watermark'
            ],
            'isheji.com': [
                '.editor-watermask',
                '.watermask'
            ],
            'logosc.cn': [
                '.watermarklayer',
                '#watermark'
            ],
            'focodesign.com': [
                '.watermark'
            ]
        };

        // 移除通用水印
        commonWatermarkSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });

        // 移除特定平台水印
        Object.keys(platformSelectors).forEach(domain => {
            if (hostname.includes(domain)) {
                platformSelectors[domain].forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        element.remove();
                    });
                });
            }
        });

        // 特殊处理：易企秀
        if (hostname.includes('eqxiu.com')) {
            const eqcWatermarks = document.querySelectorAll('div.eqc-watermark');
            eqcWatermarks.forEach(wm => {
                wm.style.cssText = 'display: none !important;';
            });
        }

        // 特殊处理：创客贴
        if (hostname.includes('chuangkit.com')) {
            const waterMarks = document.querySelectorAll('div.water-mark');
            waterMarks.forEach(wm => {
                wm.remove();
            });
            document.body.style.overflow = 'visible';
        }

        // 特殊处理：爱设计
        if (hostname.includes('isheji.com')) {
            const elementsToRemove = [
                '.editor-watermask',
                '.editor-header',
                '.editor-aside',
                '.editor-panel',
                '#rongqi',
                '#outbuttons',
                '.control-panel'
            ];

            elementsToRemove.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    element.remove();
                });
            });
        }

        console.log('水印移除完成');
    }

    // 自动移除水印
    function autoRemoveWatermarks() {
        // 延迟执行以确保页面加载完成
        setTimeout(removeWatermarks, 2000);

        // 监听DOM变化，持续移除新出现的水印
        const observer = new MutationObserver((mutations) => {
            let shouldRemove = false;
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    shouldRemove = true;
                }
            });
            if (shouldRemove) {
                setTimeout(removeWatermarks, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createRemoveButton();
            autoRemoveWatermarks();
        });
    } else {
        createRemoveButton();
        autoRemoveWatermarks();
    }

    // 添加键盘快捷键 (Ctrl+Shift+W)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'W') {
            e.preventDefault();
            removeWatermarks();
        }
    });

})();