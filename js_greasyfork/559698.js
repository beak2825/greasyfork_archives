// ==UserScript==
// @name         Steam商店捆绑包页面修复
// @namespace    https://greasyfork.org/users/101223
// @version      2025-12-22
// @description  临时解决bundle页未完全加载的问题
// @author       Splash
// @match        https://store.steampowered.com/bundle/*
// @match        https://store.steampowered.com/sub/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559698/Steam%E5%95%86%E5%BA%97%E6%8D%86%E7%BB%91%E5%8C%85%E9%A1%B5%E9%9D%A2%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/559698/Steam%E5%95%86%E5%BA%97%E6%8D%86%E7%BB%91%E5%8C%85%E9%A1%B5%E9%9D%A2%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.ReparentPurchaseOptionsForTablet = function ReparentPurchaseOptionsForTablet( idPurchaseOptions )
    {
        // tablet mode has its own purchase options container (shown on right side of screen)
        if ( window.UseTabletScreenMode && window.UseTabletScreenMode() )
        {
            Responsive_ReparentItemsInTabletMode( idPurchaseOptions, $J('#purchaseOptionsContentTablet') );
            $J('#purchaseOptionsContentTablet').css('top', parseInt( GetResponsiveHeaderFixedOffsetAdjustment() ) + 'px' );
            $J('#purchaseOptionsContentTablet').css('scrollTop', 0);
            UpdateTabletPurchaseOptionsHeight();
        }
    };
})();