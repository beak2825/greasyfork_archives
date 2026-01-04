// ==UserScript==
// @name         阿里云-2FA密码管理器自动填充优化
// @namespace    http://www.xarr.cn/
// @version      2025-09-25
// @description  通过DOM操作启用阿里云2FA验证码的密码管理器自动填充功能，支持Bitwarden、1Password等主流工具
// @author       包子
// @match        https://passport.alibabacloud.com/ac/iv/mini/identity_verify.htm*
// @icon         https://account.alibabacloud.com/images/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550412/%E9%98%BF%E9%87%8C%E4%BA%91-2FA%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/550412/%E9%98%BF%E9%87%8C%E4%BA%91-2FA%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    // 配置常量
    const CONFIG = {
        SELECTOR: '#J_Tp_Checkcode',
        AUTOCOMPLETE_VALUE: 'one-time-code',
        POLL_INTERVAL: 200,
        MAX_ATTEMPTS: 300,
        DEBUG: false
    };
    
    let attempts = 0;
    
    /**
     * 调试日志函数
     * @param {string} message - 日志消息
     */
    function debugLog(message) {
        if (CONFIG.DEBUG) {
            console.log(`[阿里云2FA脚本] ${message}`);
        }
    }
    
    /**
     * 设置输入框自动完成属性
     * @param {HTMLElement} element - 目标输入框元素
     */
    function setAutocompleteAttribute(element) {
        try {
            element.setAttribute('autocomplete', CONFIG.AUTOCOMPLETE_VALUE);
            element.setAttribute('data-lpignore', 'false'); // LastPass兼容性
            element.setAttribute('data-form-type', 'other'); // 通用兼容性
            
            debugLog('2FA输入框优化成功');
            console.log('✅ 阿里云2FA密码管理器自动填充已启用');
            
            // 触发input事件，通知密码管理器
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('focus', { bubbles: true }));
            
            return true;
        } catch (error) {
            console.error('❌ 设置autocomplete属性失败:', error);
            return false;
        }
    }
    
    /**
     * 主要的轮询函数
     */
    function pollForElement() {
        const element = document.querySelector(CONFIG.SELECTOR);
        attempts++;
        
        if (element) {
            // 检查是否已经设置过autocomplete属性
            if (!element.getAttribute('autocomplete')) {
                const success = setAutocompleteAttribute(element);
                if (success) {
                    clearInterval(pollTimer);
                    return;
                }
            } else {
                debugLog('输入框已经具有autocomplete属性');
                clearInterval(pollTimer);
                return;
            }
        }
        
        // 达到最大尝试次数后停止
        if (attempts >= CONFIG.MAX_ATTEMPTS) {
            console.warn('⚠️ 阿里云2FA脚本：达到最大尝试次数，停止搜索');
            clearInterval(pollTimer);
        } else {
            debugLog(`搜索中... (${attempts}/${CONFIG.MAX_ATTEMPTS})`);
        }
    }
    
    // 启动轮询
    const pollTimer = setInterval(pollForElement, CONFIG.POLL_INTERVAL);
    
    // 页面可见性变化时重新启动脚本（处理SPA应用）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && attempts >= CONFIG.MAX_ATTEMPTS) {
            attempts = 0;
            pollTimer = setInterval(pollForElement, CONFIG.POLL_INTERVAL);
        }
    });
    
    debugLog('脚本已启动');

    })();