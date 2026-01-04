// ==UserScript==
// @name                                                                    douyu_live_simplify
// @namespace                                                                   crestfall
// @author            	                                                       crestfallmax
// @version           	                                                        2025.09.22
// @description                                                                 斗鱼直播精简
// @match            	                                                    *://www.douyu.com/*
// @run-at document-body
// @license                                                                         MIT
// @downloadURL https://update.greasyfork.org/scripts/550356/douyu_live_simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/550356/douyu_live_simplify.meta.js
// ==/UserScript==

// 该脚本依据"https://greasyfork.org/zh-CN/scripts/431426-%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80"修改而来，原脚本由于长时间未更新，很多功能已经失效

(function () {
    var videoWidth = window.innerHeight*16/9
    var css = '{display:none !important;height:0 !important}';

    //视频区
    css += '.PlayerToolbar-ContentRow{display:none !important;}';//视频底部"工具栏"
    css += '.interactive__8Ht4-{height:0 !important;}';//视频底部"工具栏"
    css += '.PlayerToolbar{height:0 !important;}';//视频底部"工具栏"
    css += '.stream__T55I3{bottom:0 !important;}';//视频
    css += '#ex-camera{display:none !important;}';//截图

    ////强制视频16:9
    // css += `.main__a3F0Y{min-width:${videoWidth}px !important;}`;//视频
    // css += `.stage__D8VhO{overflow:hidden !important;}`;//视频
    // css += `.sidebar__1GmLR{width:${window.innerWidth-videoWidth}px !important;}`;//侧栏

    //侧栏弹幕
    css += '.YBCommunity-iconBox{display:none !important}';//弹幕区右侧停靠广告
    css += '.SignBaseComponent-sign-ad,.BarrageSuspendedBallAd-chat-ad-cls{display:none !important}';//弹幕区悬浮广告
    css += '.TreasureDetail{display:none !important;}';//弹幕区右下角掉落倒计时宝箱
    css += '.SysSign-Ad{display:none !important;}';//弹幕区右下角弹出广告
    css += '.FirePowerChatModal-Notice{display:none !important;}';//弹幕区火力全开弹窗
    css += '.YBCommunity-iconBox{display:none !important;}';//弹幕区"斗嘴"
    css += '.shark-webp .PubgInfo-icon{display:none !important;}';//弹幕区右下"战绩统计"
    css += '.Baby{display:none !important;}';//弹幕区"英雄掌门"动画
    css += '.Barrage-userEnter,.Barrage-userEnter--default{display:none !important;}';//弹幕区自己进入直播间欢迎消息
    css += '#js-room-activity{display:none !important;}';//超粉浮窗
    css += '.ChatTabContainer{display:none !important;}';//用户列表
    css += '.ChatTabContainer-conWraper{display:none !important;}';//用户列表
    css += '.ChatTabContainer-titleWraper--tabLi{color:var(--sub-text-color) !important;}';//用户列表
    css += '.ChatRank{height:100% !important;}';//用户列表

    //弹幕输入区
    css += '.EnergyBarrageIcon{display:none !important;}';//高能弹幕
    css += '.ChatNobleBarrage{display:none !important;}';//贵族弹幕
    css += '.Horn4Category{display:none !important;}';//喇叭弹幕
    css += '.ChatEmotion{display:none !important;}';//表情弹幕
    css += '.PopularBarrage{display:none !important;}';//梗弹幕
    css += '.FansMedalPanel-container{display:none !important;}';//粉丝勋章

    loadStyle(css)
    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
})();

window.onload = (function () {
    'use strict';
    var hasClickedFullScreen = false;

    var fullsrceen_ele_timer = setInterval(function () {
        var all_right_control_bar_eles = document.querySelectorAll('.right-17e251 > .icon-c8be96');
        if (all_right_control_bar_eles.length >= 2 && !hasClickedFullScreen) {
            var fullsrceen_ele = all_right_control_bar_eles[all_right_control_bar_eles.length - 2];
            if (fullsrceen_ele) {
                fullsrceen_ele.click();
                hasClickedFullScreen = true;
            }
        }

        if (hasClickedFullScreen) {
            var tipItem = document.querySelector('div.tipItem-e17801 > ul > li');
            if (tipItem) {
                tipItem.click();
                clearInterval(fullsrceen_ele_timer);
            }
        }
    }, 1000);
}
)();