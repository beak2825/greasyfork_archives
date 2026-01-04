// ==UserScript==
// @name         Hide Portainer Business Upgrade Button (attribute based)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  本脚本仅隐藏界面中的“升级到商业版”提示，让界面更清爽。
//               感谢 Portainer CE 提供出色的容器管理工具。
//               对于个人用户，社区版已足够使用。
//               脚本简单，若随版本更新失效，可自行调整匹配规则。
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553918/Hide%20Portainer%20Business%20Upgrade%20Button%20%28attribute%20based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553918/Hide%20Portainer%20Business%20Upgrade%20Button%20%28attribute%20based%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断是否 Portainer 页面
    function isPortainerPage() {
        const html = document.documentElement;
        return (
            html.getAttribute('ng-app') === 'portainer' ||
            html.dataset.edition === 'CE'
        );
    }

    // 屏蔽按钮逻辑（彻底删除）
    function removeUpgradeButton() {
        const btns = document.querySelectorAll('button');
        btns.forEach(btn => {
            if (btn.textContent.includes('Upgrade to Business Edition') ||
                btn.textContent.includes('升级到商业版')) {
                btn.remove(); // 直接删除节点，而非隐藏
            }
        });
    }

    // 主逻辑
    function init() {
        if (!isPortainerPage()) return;

        console.log('[Tampermonkey] Portainer detected — removing Business Edition button');

        removeUpgradeButton();

        // 监听 DOM 变化，防止按钮重新渲染出来
        const observer = new MutationObserver(removeUpgradeButton);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 等待 DOM 加载完成
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();
