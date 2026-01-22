// ==UserScript==
// @name         全网通用返回顶部按钮
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  美化界面：在所有页面增加一个返回顶部按钮，位于右下角，支持平滑滚动。智能逻辑：如果检测到页面自带返回顶部按钮，则自动隐藏。
// @author       Rcccccccc
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562659/%E5%85%A8%E7%BD%91%E9%80%9A%E7%94%A8%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/562659/%E5%85%A8%E7%BD%91%E9%80%9A%E7%94%A8%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 创建 CSS 样式 (使用字符串拼接格式)
    const style = document.createElement('style');
    style.innerHTML = '' +
        '#gm_back_to_top_btn {' +
            // 布局定位
        '    position: fixed;' +
        '    bottom: 40px;' +
        '    right: 40px;' +
        '    z-index: 2147483647;' + // 顶层
        '' +
            // 尺寸与形状
        '    width: 35px;' +
        '    height: 35px;' +
        '    border-radius: 50%;' +
        '' +
            // 视觉风格 (暗色毛玻璃)
        '    background: rgba(33, 33, 33, 0.85);' + // 深灰背景
        '    backdrop-filter: blur(4px);' + // 背景模糊效果
        '    border: 1px solid rgba(255, 255, 255, 0.1);' + // 极细微的亮边框
        '    box-shadow: 0 4px 12px rgba(0,0,0,0.3);' + // 柔和投影
        '' +
            // 内部对齐
        '    display: flex;' +
        '    align-items: center;' +
        '    justify-content: center;' +
        '' +
            // 交互属性
        '    cursor: pointer;' +
        '    opacity: 0;' + // 初始完全透明
        '    visibility: hidden;' + // 初始不可见
        '    transform: translateY(20px);' + // 初始位置稍微靠下，为了做弹出动画
        '    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);' + // 顺滑的缓动动画
        '' +
            // 禁止选中文本
        '    user-select: none;' +
        '    -webkit-tap-highlight-color: transparent;' +
        '}' +
        '' +
        // 激活状态 (显示)
        '#gm_back_to_top_btn.show {' +
        '    opacity: 1;' +
        '    visibility: visible;' +
        '    transform: translateY(0);' +
        '}' +
        '' +
        // 鼠标悬停
        '#gm_back_to_top_btn:hover {' +
        '    background: rgba(0, 0, 0, 0.95);' + // 变深
        '    box-shadow: 0 8px 24px rgba(0,0,0,0.4);' + // 投影变大
        '    transform: translateY(-4px);' + // 轻微上浮
        '}' +
        '' +
        // 鼠标点击瞬间
        '#gm_back_to_top_btn:active {' +
        '    transform: scale(0.9);' + // 缩小
        '}' +
        '' +
        // 内部 SVG 图标样式
        '#gm_back_to_top_btn svg {' +
        '    width: 17px;' +
        '    height: 17px;' +
        '    fill: #fff;' + // 白色图标
        '    transition: transform 0.3s;' +
        '}' +
        '' +
        // 悬停时图标微动
        '#gm_back_to_top_btn:hover svg {' +
        '    transform: translateY(-1px);' +
        '}' +
        '' +
        '@media print {' +
        '    #gm_back_to_top_btn { display: none !important; }' +
        '}';
    document.head.appendChild(style);

    // 2. 创建按钮元素
    const btn = document.createElement('div');
    btn.id = 'gm_back_to_top_btn';
    btn.title = '返回顶部';
    // 插入 SVG 实心箭头
    btn.innerHTML = '' +
        '<svg viewBox="0 0 24 24">' +
        '   <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" fill="white"></path>' +
        '</svg>';
    document.body.appendChild(btn);

    // 3. 辅助函数：检测页面是否已有原生的返回顶部按钮
    function hasNativeButton() {
        // 常见的返回顶部按钮选择器特征
        const selectors = [
            // 通用类名/ID
            '[class*="back-to-top"]', '[id*="back-to-top"]',
            '[class*="backToTop"]', '[id*="backToTop"]',
            '[class*="scrollToTop"]', '[id*="scrollToTop"]',
            '[class*="go-top"]', '[id*="go-top"]',
            '[class*="gotop"]', '[id*="gotop"]',
            '[class*="back_to_top"]',

            // 针对特定网站补充的规则：
            '[class*="ontop"]',             // 匹配 class="float-btn ontop..."
            '[class*="fbar_top"]',          // 匹配 class="tbui_aside_fbar_button tbui_fbar_top" (贴吧)
            '[data-original-title="返回顶部"]', // 匹配 Bootstrap 提示工具
            '[href*="scrollTo"]',           // 匹配 href="javascript:(scrollTo());"

            // 属性匹配
            '[title="返回顶部"]',
            '[aria-label="返回顶部"]',
            '[title="Top"]'
        ];

        // 查找 DOM 中是否有匹配元素
        const candidates = document.querySelectorAll(selectors.join(','));
        for (let i = 0; i < candidates.length; i++) {
            const el = candidates[i];
            // 排除我们自己创建的按钮
            if (el.id === 'gm_back_to_top_btn') continue;

            // 检查元素是否可见 (如果是隐藏的元素，不算数)
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                return true; // 发现原生按钮，返回 true
            }
        }
        return false;
    }

    // 4. 逻辑控制
    let isVisible = false;
    let ticking = false; // 节流锁
    let nativeBtnDetected = false; // 缓存检测结果

    // 页面刚加载时先检测一次
    setTimeout(() => {
        if (hasNativeButton()) {
            nativeBtnDetected = true;
        }
    }, 1000);

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                // 只有当需要显示的时候才去二次确认是否有原生按钮
                if (scrollTop > 300) {
                    // 如果之前没检测到，再动态检测一次（防止原生按钮是懒加载的）
                    if (!nativeBtnDetected) {
                         nativeBtnDetected = hasNativeButton();
                    }

                    // 如果没有原生按钮，且尚未显示，则显示
                    if (!nativeBtnDetected && !isVisible) {
                        btn.classList.add('show');
                        isVisible = true;
                    }
                    // 如果发现了原生按钮，强制隐藏我们的按钮
                    else if (nativeBtnDetected && isVisible) {
                        btn.classList.remove('show');
                        isVisible = false;
                    }
                } else {
                    // 滚回顶部时隐藏
                    if (isVisible) {
                        btn.classList.remove('show');
                        isVisible = false;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // 5. 点击回顶
    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

})();