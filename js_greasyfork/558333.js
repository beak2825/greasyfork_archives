// ==UserScript==
// @name         Fenbi Video Hider - Brutal Mode
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Brutally hide all video elements on Fenbi
// @author       You
// @match        *://*.fenbi.com/*
// @match        *://fenbi.com/*
// @match        *://m.fenbi.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558333/Fenbi%20Video%20Hider%20-%20Brutal%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/558333/Fenbi%20Video%20Hider%20-%20Brutal%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('🚀 暴力模式启动...');
    
    // 超级暴力 CSS
    const css = `
        *[class*="video"]:not(*[class*="text"]),
        *[class*="Video"]:not(*[class*="text"]),
        *[class*="play"]:not(*[class*="text"]),
        *[class*="Play"]:not(*[class*="text"]),
        *[class*="member"]:not(*[class*="text"]),
        *[class*="Member"]:not(*[class*="text"]),
        video,
        VIDEO,
        iframe[src*="video"],
        iframe[src*="player"],
        .video-item,
        .video-item-content,
        .question-video-member,
        .question-video,
        .play-video-btn {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
            left: -99999px !important;
            pointer-events: none !important;
            overflow: hidden !important;
        }
        
        /* 确保文字解析显示 */
        *[class*="text"],
        *[class*="Text"],
        *[class*="analysis"]:not(*[class*="video"]),
        *[class*="Analysis"]:not(*[class*="video"]) {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
    
    // 注入 CSS
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.id = 'fenbi-brutal-hide';
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }
    
    console.log('✅ CSS 已注入');
    
    // 暴力删除函数
    function remove() {
        let count = 0;
        
        // 删除所有视频相关元素
        const selectors = [
            'video',
            'VIDEO',
            'iframe[src*="video"]',
            'iframe[src*="player"]',
            '*[class*="video"]',
            '*[class*="Video"]',
            '*[class*="play"]',
            '*[class*="Play"]',
            '*[class*="member"]',
            '*[class*="Member"]',
            '.video-item',
            '.video-item-content',
            '.question-video-member',
            '.question-video',
            '.play-video-btn'
        ];
        
        selectors.forEach(sel => {
            try {
                document.querySelectorAll(sel).forEach(el => {
                    const cls = (el.className || '').toString().toLowerCase();
                    const text = (el.textContent || '').toLowerCase();
                    
                    // 不删除包含"文字"或"解析"的元素
                    if (!cls.includes('text') && 
                        !cls.includes('analysis') &&
                        !text.includes('文字') && 
                        !text.includes('解析')) {
                        el.remove();
                        count++;
                    }
                });
            } catch(e) {
                // 忽略错误
            }
        });
        
        if (count > 0) {
            console.log('🗑️ 删除', count, '个视频元素');
        }
        
        return count;
    }
    
    // 立即执行多次
    [0, 100, 300, 500, 1000, 2000].forEach(delay => {
        setTimeout(remove, delay);
    });
    
    // 页面加载事件
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', remove);
    } else {
        remove();
    }
    
    // 页面完全加载后
    window.addEventListener('load', () => {
        remove();
        
        // 持续监控（每 500ms）
        setInterval(remove, 500);
        
        // MutationObserver 监控 DOM 变化
        const observer = new MutationObserver(() => {
            remove();
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
            console.log('👀 DOM 监控已启动');
        }
    });
    
    // 拦截点击事件
    document.addEventListener('click', function(e) {
        const target = e.target;
        const cls = (target.className || '').toString().toLowerCase();
        const text = (target.textContent || '').toLowerCase();
        
        if (cls.includes('video') || 
            cls.includes('play') || 
            cls.includes('member') ||
            text.includes('视频') ||
            text.includes('播放')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('🚫 拦截点击:', target.tagName, cls);
            return false;
        }
    }, true);
    
    // 拦截触摸事件（手机专用）
    document.addEventListener('touchstart', function(e) {
        const target = e.target;
        const cls = (target.className || '').toString().toLowerCase();
        
        if (cls.includes('video') || 
            cls.includes('play') || 
            cls.includes('member')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚫 拦截触摸:', target.tagName);
            return false;
        }
    }, true);
    
    // 拦截视频播放
    if (typeof HTMLMediaElement !== 'undefined') {
        const originalPlay = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function() {
            console.log('🚫 拦截视频播放');
            this.pause();
            return Promise.resolve();
        };
    }
    
    console.log('✅ 暴力模式已激活！');
    console.log('💪 使用了多重拦截机制');
    
})();
