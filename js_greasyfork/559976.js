// ==UserScript==
// @name         小站托福(top.zhan.com) 新老TPO全解锁和去广告
// @namespace    https://github.com/liyuan4LY
// @version      2.1
// @description  解锁老托福TPO 71-75和新托福全部试题，屏蔽所有弹窗广告。
// @author       力元LY
// @match        *://top.zhan.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559976/%E5%B0%8F%E7%AB%99%E6%89%98%E7%A6%8F%28topzhancom%29%20%E6%96%B0%E8%80%81TPO%E5%85%A8%E8%A7%A3%E9%94%81%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/559976/%E5%B0%8F%E7%AB%99%E6%89%98%E7%A6%8F%28topzhancom%29%20%E6%96%B0%E8%80%81TPO%E5%85%A8%E8%A7%A3%E9%94%81%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 劫持网络请求
     * 针对后端返回的 10004 权限错误进行数据篡改
     */
    const hookXHR = () => {
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4 && (this.responseType === '' || this.responseType === 'text')) {
                    if (this.responseText && this.responseText.includes('"code":10004')) {
                        console.log('[小站托福解锁] 检测到权限限制，注入伪造数据');
                        // 强制覆盖只读的 responseText
                        Object.defineProperty(this, 'responseText', {
                            writable: true,
                            configurable: true,
                            value: this.responseText.replace(/"code":\s*10004/g, '"code":0')
                        });
                    }
                }
            });
            originalSend.apply(this, arguments);
        };
    };

    /**
     * 注入全局变量
     */
    const injectGlobalVars = () => {
        const props = ['is_vip', 'user_status', 'is_login'];
        props.forEach(prop => {
            try {
                unsafeWindow[prop] = 1;
            } catch(e) {}
        });
        // 屏蔽购买引导函数
        unsafeWindow.showBuyGuide = () => { console.log('[小站解锁] 拦截购买引导'); return false; };
    };

    /**
     * 移除广告与遮罩
     */
    const removeAds = () => {
        const selectors = [
            '.home_right_flat', '.home_page_bottom_ad', '#home_gift_fixed_icon',
            '#meiqia-container', '.model_mask', '.pop_wraper', '.buy-guide-mask'
        ];
        selectors.forEach(s => {
            const els = document.querySelectorAll(s);
            els.forEach(el => el.remove());
        });
        // 强制恢复滚动条
        if (document.body) {
            document.body.style.setProperty('overflow', 'auto', 'important');
        }
    };

    // 执行初始化
    hookXHR();
    injectGlobalVars();

    // 页面加载后的操作
    window.addEventListener('DOMContentLoaded', () => {
        removeAds();
        // 持续监控动态插入的广告
        const observer = new MutationObserver(removeAds);
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();