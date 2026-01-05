// ==UserScript==
// @name        bilibili toothbrush
// @namespace   http://www.icycat.com
// @description 牙刷科技
// @author      冻猫
// @include     *www.bilibili.tv/*
// @include     *www.bilibili.com/*
// @include     *bangumi.bilibili.com/*
// @include     *bilibili.kankanews.com/*
// @version     6.6
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/786/bilibili%20toothbrush.user.js
// @updateURL https://update.greasyfork.org/scripts/786/bilibili%20toothbrush.meta.js
// ==/UserScript==

(function() {

    if (window.top !== window.self) {
        return;
    }

    function init() {
        console.log('bilibili toothbrush 初始化');
        setTimeout(function() {
            var playerArea = document.getElementsByClassName('player-wrapper')[0];
            if (playerArea) {
                window.scrollTo(0, getRect(playerArea).pageY);
            }
        }, 500);
    }

    function getRect(element) {
        var rect = element.getBoundingClientRect();
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return {
            pageX: rect.left + scrollLeft,
            pageY: rect.top + scrollTop
        };
    }

    init();

})();