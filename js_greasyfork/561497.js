// ==UserScript==
// @name         白p斗鱼
// @author       s_____________
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  彻底删除紫色背景画，解锁视频高度，强制画面向下延伸。整合了大量广告、互动挂件和干扰元素屏蔽规则。2025.01.Final.Enhanced
// @match       *://*.douyu.com/0*
// @match       *://*.douyu.com/1*
// @match       *://*.douyu.com/2*
// @match       *://*.douyu.com/3*
// @match       *://*.douyu.com/4*
// @match       *://*.douyu.com/5*
// @match       *://*.douyu.com/6*
// @match       *://*.douyu.com/7*
// @match       *://*.douyu.com/8*
// @match       *://*.douyu.com/9*
// @match       *://*.douyu.com/topic/*
// @icon        https://www.douyu.com/favicon.ico
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561497/%E7%99%BDp%E6%96%97%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/561497/%E7%99%BDp%E6%96%97%E9%B1%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var current_url = window.location.href;
    console.log('[ Simple Douyu ] url --> ' + current_url);

    window.onload = function () {
        loadStyle();
    }

    auto_switch_quality();
    auto_full_screen();
    mod_follow_page();
    hide_danmu();
    hide_ad();
    hide_ad2();

})();

function loadStyle() {
    // === 1. 核心拉伸与布局优化 ===
    var css = '[class*="title__"], [class*="info__"], [class*="anchorInfo__"] { display: none !important; height: 0 !important; }';

    css += '[class*="player__"], [class*="stream__"], [class*="video__"], .layout-Player-video { ';
    css += '    width: 100% !important; ';
    css += '    height: 100vh !important; ';
    css += '    max-width: none !important; ';
    css += '    max-height: none !important; ';
    css += '    position: absolute !important; ';
    css += '    top: 0 !important; ';
    css += '    left: 0 !important; ';
    css += '    flex: 1 !important; ';
    css += '    bottom: 0px !important; ';
    css += '}';

    css += 'video { object-fit: contain !important; width: 100% !important; height: 100% !important; }';
    css += '.layout-Player-barrage { top: 0px !important; }';

    // === 2. 增强屏蔽列表 (包含新增的 interactive 和 buff 元素) ===
    css += '.layout-Player-rank, .layout-Bottom, .layout-Aside, .Header-download-wrap, .layout-Player-toolbar { display: none !important; }';
    css += '.guessGameContainer.is-normalRoom, .DropPane-ad, .SignBaseComponent-sign-ad, .Header-broadcast-wrap { display: none !important; }';
    css += '#js-header > div > div > div.Header-left > div > ul > li:nth-child(5), .ChatNobleBarrage, .ChatFansBarrage, .Horn4Category { display: none !important; }';
    css += '.FirePower, .TreasureDetail, .SignChatAd-chat-ad-cls, .Promotion-nobleRights, .Task, .UPlayerLotteryEnter.is-active { display: none !important; }';

    // 这里加入了你要求的新元素
    css += 'div.interactive__8Ht4-, #js-layout-fixed-buff-content,#js-barrage-extendList, .LotteryContainer, .layout-Module-head.FollowList-head.is-fixed { display: none !important; }';

    css += '.layout-Banner-item, .layout-Module-extra, .Title-anchorPic, .Title-roomOtherBottom, .Act129684Bar-view1 { display: none !important; }';
    css += '.Act129684Bar-content, .Act129684-logo, .ActBase-switch, .HeaderNav, .HeaderGif-left, .HeaderGif-right { display: none !important; }';
    css += '.Prompt-container, .SysSign-Ad, .ActDayPay-toast, .code_box-5cdf5a, .normalDiv-8b686d, .closeBg-998534 { display: none !important; }';
    css += '.bg-d4758b, .vsFestival1908, .ActSuperFansGroup-component, .ActSuperFansGroup-logo, .ActSuperFansGroup-switch { display: none !important; }';
    css += '.TitleSuperFansIcon, .Act156581Bar, .Act159742Bar-main--pre, .Act159742-logo, .Act159742Bar-wrap { display: none !important; }';
    css += '.Title-columnTag, .Title-impress.clearFix, #js-room-activity, .TBarrage-hiIcon, span.UserLevel, .FansMedal { display: none !important; }';
    css += 'span.Motor, span.Barrage-hiIcon, span.RoomLevel, span.Barrage-icon, a.ChatAchievement, section.layout-Customize { display: none !important; }';
    css += '.GuessGameMiniPanelB-wrapper, .InteractPlayWithPendant, .LiveRoomLoopVideo-thumb, .PostReward-videoPendant, .FansMedalWrap { display: none !important; }';

    css += '.layout-Player-toolbar { visibility: hidden !important; }';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    console.log('[ Simple Douyu ] 已加载更新：包含 interactive 和 buff 屏蔽规则');
}

function auto_full_screen() {
    let dom_selector = 'path[d*="20 25h6v-6"]';
    wait_element_loading(dom_selector, function () {
        let btn = document.querySelector(dom_selector).closest('i, div, span');
        if (btn) {
            btn.click();
            setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 800);
        }
    });
}

function mod_follow_page() {
    if (window.location.pathname == "/directory/myFollow") {
        wait_element_loading("li.layout-Cover-item", function () {
            let cover_list = document.querySelectorAll("li.layout-Cover-item");
            document.querySelectorAll('.layout-Cover-card').forEach((card, i) => {
                if (card.querySelector('.AthenaBoothPanel-wrapper')) {
                    if(cover_list[i]) cover_list[i].remove();
                }
            });
            let css_stream = ".DyLiveCover-user {display: block; color: #888; font-size: 10px;}";
            let s = document.createElement('style'); s.innerText = css_stream; document.head.appendChild(s);
            document.querySelectorAll("div.DyLiveCover").forEach(cover => {
                let timeText = timeStampTurnTime(cover.getAttribute("showtime"));
                let title = cover.querySelector("h2.DyLiveCover-user");
                if (timeText && title) title.innerText = timeText;
            });
        });
    }
}

function auto_switch_quality() {
    wait_element_loading('[class*="tipItem"] li', function () {
        let items = document.querySelectorAll('[class*="tipItem"] li');
        if (items.length > 0) {
            items[0].click();
        }
    });
}

function hide_ad() {
    wait_element_loading('.IconCardAdCard-close', function () {
        document.querySelector('.IconCardAdCard-close').click();
    });
}

function hide_ad2() {
    wait_element_loading('.IconCardAd-close', function () {
        document.querySelector('.IconCardAd-close').click();
    });
}

function hide_danmu() {}

function wait_element_loading(dom_selector, func) {
    let is_DomExist = false;
    let interval = 200;
    var int_checkDom = setInterval(() => {
        if (document.querySelector(dom_selector)) {
            is_DomExist = true;
            func();
        }
        if (is_DomExist) clearInterval(int_checkDom);
    }, interval);
}

function timeStampTurnTime(timeStamp) {
    if (timeStamp > 0) {
        let date = new Date(timeStamp * 1000);
        return (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    }
    return "";
}