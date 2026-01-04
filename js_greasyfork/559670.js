// ==UserScript==
// @name         网页乱码精准屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  基于布局特征精准屏蔽网页中的乱码字符
// @author       精准乱码清理
// @match        *://monster-nest.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559670/%E7%BD%91%E9%A1%B5%E4%B9%B1%E7%A0%81%E7%B2%BE%E5%87%86%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559670/%E7%BD%91%E9%A1%B5%E4%B9%B1%E7%A0%81%E7%B2%BE%E5%87%86%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置参数
    const config = {
        // 清理模式
        mode: 'auto', // auto-自动, manual-手动
        // 是否显示清理通知
        showNotification: true,
        // 延迟执行时间(毫秒)
        delay: 1500
    };
    
    // 乱码特征模式
    const garbagePatterns = {
        // 隐藏的span标签（display:none）
        hiddenSpans: 'span[style*="display:none"], span[style*="display: none"]',
        
        // jammer类字体标签
        jammerFonts: 'font.jammer',
        
        // 特定的乱码文本模式
        textPatterns: [
            /^[;:%!@#\$%\^&\*\(\)_\+\-=\[\]\{\}\|,\.<>\/\?\\\s0-9a-zA-Z]{4,}$/, // 纯符号数字字母组合
            /^[;\s%\.\dA-Za-z]{6,}$/, // 分号开头的组合
            /^[\s\xa0]*[%\.\dA-Za-z]{2,}[\s\xa0]*$/ // 前后有空格的乱码
        ]
    };
    
    // 主清理函数
    function cleanGarbageElements() {
        let removedCount = 0;
        
        // 1. 删除隐藏的span标签
        const hiddenSpans = document.querySelectorAll(garbagePatterns.hiddenSpans);
        hiddenSpans.forEach(span => {
            // 检查内容是否符合乱码特征
            const text = span.textContent.trim();
            if (isGarbageText(text)) {
                span.remove();
                removedCount++;
            }
        });
        
        // 2. 删除jammer类字体标签
        const jammerFonts = document.querySelectorAll(garbagePatterns.jammerFonts);
        jammerFonts.forEach(font => {
            const text = font.textContent.trim();
            if (isGarbageText(text)) {
                font.remove();
                removedCount++;
            }
        });
        
        // 3. 清理文本节点中的行尾乱码
        cleanTextNodes();
        
        return removedCount;
    }
    
    // 判断是否为乱码文本
    function isGarbageText(text) {
        if (!text || text.length < 3) return false;
        
        // 检查是否符合乱码模式
        return garbagePatterns.textPatterns.some(pattern => 
            pattern.test(text)
        ) || (
            // 额外的判断条件：包含大量特殊字符和数字字母混合
            (text.match(/[;:%\s]/g) || []).length >= 2 &&
            text.length >= 4 &&
            !containsChinese(text)
        );
    }
    
    // 判断是否包含中文字符
    function containsChinese(text) {
        return /[\u4e00-\u9fa5]/.test(text);
    }
    
    // 清理文本节点中的行尾乱码
    function cleanTextNodes() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent;
            
            // 检查文本节点是否包含乱码特征
            if (text && text.length > 10) {
                // 匹配行尾的乱码模式
                const cleanedText = text.replace(/[\s]*[;:%][\s\S]{4,20}$/g, '');
                if (cleanedText !== text) {
                    node.textContent = cleanedText;
                }
            }
        }
    }
    
    // 优化页面布局（移除乱码后重新调整）
    function optimizeLayout() {
        // 合并相邻的font标签
        const fonts = document.querySelectorAll('font[size="4"]');
        fonts.forEach((font, index) => {
            if (index < fonts.length - 1) {
                const nextFont = fonts[index + 1];
                if (font.nextSibling === nextFont) {
                    font.innerHTML += nextFont.innerHTML;
                    nextFont.remove();
                }
            }
        });
        
        // 清理空行
        const brElements = document.querySelectorAll('br');
        brElements.forEach(br => {
            if (!br.nextSibling || (br.nextSibling.nodeType === Node.ELEMENT_NODE && 
                br.nextSibling.tagName === 'BR')) {
                br.remove();
            }
        });
    }
    
    // 显示清理结果
    function showResult(removedCount) {
        if (!config.showNotification || removedCount === 0) return;
        
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                border-left: 4px solid #2E7D32;
            ">
                <strong>✅ 乱码清理完成</strong><br>
                已移除 ${removedCount} 个乱码元素
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="
                            margin-left:10px; 
                            background:rgba(255,255,255,0.2); 
                            border:none; 
                            color:white; 
                            cursor:pointer;
                            border-radius: 50%;
                            width: 20px;
                            height: 20px;
                        ">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
    
    // 添加手动清理按钮
    function addCleanButton() {
        if (document.getElementById('gm-clean-button')) return;
        
        const button = document.createElement('button');
        button.id = 'gm-clean-button';
        button.innerHTML = '🧹 清理乱码';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: #FF6B35;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(255,107,53,0.3);
            transition: all 0.3s;
        `;
        
        button.onmouseover = function() {
            this.style.background = '#FF8A65';
            this.style.transform = 'translateY(-2px)';
        };
        
        button.onmouseout = function() {
            this.style.background = '#FF6B35';
            this.style.transform = 'translateY(0)';
        };
        
        button.onclick = function() {
            const count = cleanGarbageElements();
            optimizeLayout();
            showResult(count);
            button.innerHTML = '✅ 已清理';
            setTimeout(() => {
                button.innerHTML = '🧹 清理乱码';
            }, 2000);
        };
        
        document.body.appendChild(button);
    }
    
    // 初始化函数
    function init() {
        console.log('网页乱码精准屏蔽器已加载');
        
        addCleanButton();
        
        if (config.mode === 'auto') {
            setTimeout(() => {
                const removedCount = cleanGarbageElements();
                optimizeLayout();
                showResult(removedCount);
            }, config.delay);
        }
        
        // 监听动态内容
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(() => {
                        cleanGarbageElements();
                        optimizeLayout();
                    }, 100);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();