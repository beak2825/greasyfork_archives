// ==UserScript==
// @name            Remove Douyu Danmaku SFX - 屏蔽斗鱼高级弹幕特效
// @namespace       https://github.com/idxinf/Remove-Douyu-Danmaku-SFX
// @version         1.0.2
// @description     屏蔽斗鱼高级弹幕特效
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
// @downloadURL https://update.greasyfork.org/scripts/563697/Remove%20Douyu%20Danmaku%20SFX%20-%20%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E9%AB%98%E7%BA%A7%E5%BC%B9%E5%B9%95%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/563697/Remove%20Douyu%20Danmaku%20SFX%20-%20%E5%B1%8F%E8%94%BD%E6%96%97%E9%B1%BC%E9%AB%98%E7%BA%A7%E5%BC%B9%E5%B9%95%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`html body [class^=user-icon-],
html body [class^=super-tail-],
html body [class^=super-noble-icon-],
html body [class^=super-user-icon-],
html body [class^=vip-icon-],
html body [class^=right-dynamic-pic-],
html body [class^=rightDynamicPicImg-],
html body [class^=headpic-],
html body [class^=vipIcon-],
html body [class^=head-icon-],
html body [class^=tail-],
html body [class^=text-] > img,
html body [class^=super-text-] > img {
    display: none !important;
}

html body [class^=danmuItem-] div {
    background: none !important;
}

.highEnergySuperBarrageText {
    color: #ffff00 !important;
    font-size: 24px !important;
}

.barrage-gradient {
    border: none;
}
`);
})();