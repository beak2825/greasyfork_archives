// ==UserScript==
// @name            Remove Douyu Gift - 隐藏斗鱼礼物栏
// @namespace       https://github.com/idxinf/Remove-Douyu-Gift
// @version         1.0.1
// @description     隐藏斗鱼礼物栏和优化工具栏
// @author          idxinf
// @license         MIT
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @icon            https://www.douyu.com/favicon.ico
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563628/Remove%20Douyu%20Gift%20-%20%E9%9A%90%E8%97%8F%E6%96%97%E9%B1%BC%E7%A4%BC%E7%89%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/563628/Remove%20Douyu%20Gift%20-%20%E9%9A%90%E8%97%8F%E6%96%97%E9%B1%BC%E7%A4%BC%E7%89%A9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`:root {
    --toolbar-height: 32px;
}

html body [class^=stream__] {
    bottom: var(--toolbar-height);
}

html body [class^=interactive__] {
    height: var(--toolbar-height);
    background-image: none !important;
    background-color: #000;
}

.PlayerToolbar {
    height: var(--toolbar-height);
}

.PlayerToolbar-ContentRow, .ToolbarGiftArea-container {
    height: 0;
}

#js-toolbar-interact, .ToolbarGiftArea-giftShowList, .ToolbarGiftArea-arrowMoreEnter {
    display: none;
}

.InteractABAd-valueInfo--item span {
    color: #fff !important;
}
`);
})();
