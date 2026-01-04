// ==UserScript==
// @name         挖矿兵团（Mining Crew）-助手
// @description  自动点击升级按钮
// @namespace    LemonNoCry
// @author       LemonNoCry
// @license      MIT
// @version      1.0.0
// @match        https://gltyx.github.io/mining-crew/*
// @downloadURL https://update.greasyfork.org/scripts/553457/%E6%8C%96%E7%9F%BF%E5%85%B5%E5%9B%A2%EF%BC%88Mining%20Crew%EF%BC%89-%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553457/%E6%8C%96%E7%9F%BF%E5%85%B5%E5%9B%A2%EF%BC%88Mining%20Crew%EF%BC%89-%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(() => {
        const panel = document.querySelector('#freeUpgradesPanel');
        if (!panel) return;

        // 在 panel 内找出所有显示的升级按钮
        const buttons = panel.querySelectorAll('.upgrade-button-outer');
        buttons.forEach(btn => {
            const style = getComputedStyle(btn);
            if (style.display !== 'none') {
                btn.click();
                console.log('自动单击升级:', btn.id);
            }
        });
    }, 1000);
})();
