// ==UserScript==
// @name         全国互联网安全管理服务平台-自动点击确认、跳过登录倒计时
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动点击确认、跳过登录倒计时
// @author       Fxy29
// @icon         https://beian.mps.gov.cn/favicon.ico
// @match        https://beian.mps.gov.cn/
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/562620/%E5%85%A8%E5%9B%BD%E4%BA%92%E8%81%94%E7%BD%91%E5%AE%89%E5%85%A8%E7%AE%A1%E7%90%86%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4%E3%80%81%E8%B7%B3%E8%BF%87%E7%99%BB%E5%BD%95%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/562620/%E5%85%A8%E5%9B%BD%E4%BA%92%E8%81%94%E7%BD%91%E5%AE%89%E5%85%A8%E7%AE%A1%E7%90%86%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4%E3%80%81%E8%B7%B3%E8%BF%87%E7%99%BB%E5%BD%95%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时任务：每1000毫秒（1秒）检查一次
    const checkInterval = setInterval(() => {
        const buttons = document.querySelectorAll('button.el-button');
        buttons.forEach(button => {
            if (button.textContent.includes('跳转')) {
                if (button.disabled || button.classList.contains('is-disabled')) {
                    button.removeAttribute('disabled');
                    button.setAttribute('aria-disabled', 'false');
                    button.classList.remove('is-disabled');
                    button.click();
                    //只点击一次
                    //clearInterval(checkInterval);
                }
            }
            // 跳过公告
            if (button.textContent.includes('确认')) {
                button.click();
            }
        });
    }, 1000);
})();