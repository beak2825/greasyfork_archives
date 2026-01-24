// ==UserScript==
// @name         Force Autocomplete + OTP Fix (Safety Edition)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  智能识别 OTP，带有防误伤机制（排除邮编、优惠码等）
// @author       Dylan's Assistant
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563722/Force%20Autocomplete%20%2B%20OTP%20Fix%20%28Safety%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563722/Force%20Autocomplete%20%2B%20OTP%20Fix%20%28Safety%20Edition%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 正面清单：这些词极大概率是 OTP
    // 移除了单独的 "code"，要求必须组合出现，如 "vcode", "sms_code"
    const otpKeywords = /otp|2fa|totp|mfa|verification[-_ ]?code|auth[-_ ]?code|sms[-_ ]?code|验证码|动态密码|短信码/i;

    // 2. 负面清单：这些词绝对不是 OTP
    const excludeKeywords = /zip|postal|invite|coupon|promo|discount|search|query|old[-_ ]?pass|current[-_ ]?pass|邮编|邀请|优惠|搜索|旧密码/i;

    function fixInput(input) {
        // 已经处理过或者是本来就是 one-time-code 的，跳过
        if (input.getAttribute('autocomplete') === 'one-time-code') return;

        const name = input.name || '';
        const id = input.id || '';
        const placeholder = input.placeholder || '';
        const ariaLabel = input.getAttribute('aria-label') || '';
        
        // 组合检查字符串
        const checkStr = `${name} ${id} ${placeholder} ${ariaLabel}`;

        // === 核心判断逻辑 ===
        
        // A. 必须不包含“负面清单”里的词
        if (excludeKeywords.test(checkStr)) {
            // 是邮编或优惠码，放过它，只开启普通自动填充
            if (input.getAttribute('autocomplete') !== 'on') {
                input.setAttribute('autocomplete', 'on');
            }
            return;
        }

        // B. 长度特征辅助判断 (OTP 通常很短)
        // 获取 maxlength，如果没有则默认为 null
        const maxLen = parseInt(input.getAttribute('maxlength'));
        // 如果限制了长度，且长度大于 10，那肯定不是 OTP (通常 OTP 是 4-8 位)
        if (maxLen && maxLen > 10) {
             if (input.getAttribute('autocomplete') !== 'on') {
                input.setAttribute('autocomplete', 'on');
            }
            return;
        }

        // C. 正则匹配
        if (otpKeywords.test(checkStr)) {
            // 命中！标记为一次性密码
            input.setAttribute('autocomplete', 'one-time-code');
            
            // 针对 Element UI 等框架缺少 name 的补充
            if (!input.name) {
                input.name = 'auth-otp-fixed';
            }
            
            // console.log('[OTP Fix] 命中:', id || placeholder);
        } else {
            // 没命中 OTP，但确保普通填充开启
            if (input.getAttribute('autocomplete') !== 'on') {
                input.setAttribute('autocomplete', 'on');
            }
        }
    }

    // 监控器逻辑
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'INPUT') {
                    fixInput(node);
                } else if (node.nodeType === 1 && node.querySelectorAll) {
                    node.querySelectorAll('input').forEach(fixInput);
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('input').forEach(fixInput);
    });

})();