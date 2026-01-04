// ==UserScript==
// @name         Bilibili Purify
// @name:zh-CN   Bilibili纯粹化
// @namespace    https://github.com/RevenLiu
// @version      1.4.7
// @description  一个用于Bilibili平台的篡改猴脚本。以一种直接的方式抵抗商业化平台对人类大脑的利用。包含重定向首页、隐藏广告、隐藏推荐视频、评论区反成瘾/情绪控制锁等功能，削弱平台/媒体对你心理的操控，恢复你对自己注意力和思考的主导权。
// @author       RevenLiu
// @license      MIT
// @icon         https://raw.githubusercontent.com/RevenLiu/BilibiliPurify/main/Icon.png
// @homepage     https://github.com/RevenLiu/BilibiliPurify
// @supportURL   https://github.com/RevenLiu/BilibiliPurify/issues 
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://message.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://live.bilibili.com/*
// @match        https://link.bilibili.com/*
// @match        https://account.bilibili.com/*
// @match        https://passport.bilibili.com/*
// @match        https://pay.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.bilibili.com
// @connect      live.bilibili.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554780/Bilibili%20Purify.user.js
// @updateURL https://update.greasyfork.org/scripts/554780/Bilibili%20Purify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 首页重定向逻辑
    if (window.location.hostname === 'www.bilibili.com' && window.location.pathname === '/') {
        window.location.replace('https://search.bilibili.com/');
        return;
    }

    // 使用 CSS 隐藏元素
    const hideSelectors = [
        //左上入口栏广告
        'li.v-popover-wrap.left-loc-entry',
        //视频页右侧小广告
        'div.video-card-ad-small',
        //视频页右侧广告
        'div.slide-ad-exp',
        //视频页视频推荐列表
        'div.recommend-list-v1',
        //视频页右侧底部广告
        'div.ad-report.ad-floor-exp.right-bottom-banner',
        //视频页荣誉标识
        'a.honor.item',
        //视频页活动
        'div.activity-m-v1.act-end',
        //视频页左侧条形广告
        'div.ad-report.strip-ad.left-banner',
        //视频页合集列表 (开启会同时导致分p消失)
        //'div.video-pod.video-pod',
        //热搜
        'div.trending',
        //搜索页封面播放器
        'div.v-inline-player',
        //右上入口栏大会员
        'a.right-entry__outside.right-entry--vip',
        //右上入口栏头像下拉菜单会员中心
        'div.vip-entry-containter',
        //左上入口栏杂项
        'a.default-entry',
        //左上入口栏下载客户端按钮
        'a.download-entry.download-client-trigger',
        //左上入口栏首页下拉菜单
        'div.v-popover.is-bottom-start',
        //左上入口栏首页箭头图标
        'svg.mini-header__arrow',
        //视频结束推荐
        'div.bpx-player-ending-related',
        //投票弹幕 (视频内)
        'div.bili-danmaku-x-vote.bili-danmaku-x-show',
        //互动引导 (视频内)
        'div.bili-danmaku-x-guide-all.bili-danmaku-x-guide.bili-danmaku-x-show',
        //关联视频 (视频内)
        'div.bili-danmaku-x-link.bili-danmaku-x-show',
        //评分弹幕及小图片 (视频内)
        'div.bili-danmaku-x-score.bili-danmaku-x-show',
        'div.bili-danmaku-x-cmd-shrink.bili-danmaku-x-show',
        //动态页面热搜
        'div.bili-dyn-search-trendings',
        //剧播放页推荐列表
        'div.recommend_wrap__PccwM',
        //剧播放页大会员广告
        'div.paybar_container__WApBR',
        //剧播放页右侧大会员购买广告
        '#pc-cashier-wrapper-normal',
        'div.paybar_container__WApBR',
        //剧播放页播放器大会员购买广告
        '#pc-cashier-wrapper-video',
        //剧播放页播放器大会员广告弹窗
        'div.bpx-player-toast-wrap',
        //剧播放页播放器试看结束购买引导
        'div.paywall_vipRightWrap__U6Tw3',
        'div.paywall_btnItemWrap__s351D.paywall_bigBtn__6S6pz',
        'div.paywall_rightBox__pFhO_',
        //直播首页顶部播放器
        'div.player-area-ctnr.border-box.p-relative.t-center',
        //直播首页广告/公告/推荐
        'div.grid-col-1.grid-col.v-top.dp-i-block',
        'div.grid-col-3,grid-col,v-top,dp-i-block',
        'div.flip-view p-relative.over-hidden.w-100',
        //直播首页推荐直播
        'div.recommend-area-ctnr',
        'div.area-detail-ctnr.m-auto',
        //直播页左上入口栏
        'div.nav-items-ctnr.dp-i-block.v-middle',
        //直播页左上入口栏更多按钮
        'div.showmore-link.p-relative.f-left',
        //直播页右上入口栏
        'div.shortcuts-ctnr.h-100.f-left',
        //直播页右上入口栏头像菜单
        'div.user-panel.p-relative.border-box.none-select.panel-shadow',
        //直播页横向礼物栏
        'div.gift-panel.base-panel.live-skin-coloration-area.gift-corner-mark-ui',
        //直播页电池立即充值文字
        'div.recharge-ent-info',
        //直播页大航海立即上船文字
        'div.guard-ent-info',
        //直播页超能理事会图标
        'div.left-part-ctnr.vertical-middle.dp-table.section.p-relative.adaptive',
        //直播页横向活动栏
        'div.activity-gather-entry.activity-entry.s-activity-entry',
        'div.rank-entry-play.rank-entries.hot-normal-area',
        'div.gift-planet-entry',
        //直播页观众列表排名图标
        'div.rank',
        //直播页观众列表贡献值
        'div.score.live-skin-normal-text',
        //直播页观众列表送礼引导文字'
        'div.need.live-skin-normal-text.opacity6',
        'div.switch-box',
        //直播页观众列表排行榜按钮
        'div.tab-box',
        //直播页观众列表粉丝勋章
        'div.fans-medal.fans-medal-item',
        //直播页观众列表等级勋章
        'div.wealth-medal.wealth',
        //直播页观众列表大航海头像框
        'div.guard-frame',
        //直播页观众列表榜前三显示
        'div.top3.top3-3',
        'i.rank-icon.rank-icon-1.v-middle',
        'i.rank-icon.rank-icon-2.v-middle',
        'i.rank-icon.rank-icon-3.v-middle',
        'i.top1-rank-icon',
        'i.top2-rank-icon',
        'i.top3-rank-icon',
        //直播页大航海
        'div.item.live-skin-normal-text.dp-i-block.live-skin-separate-border.border-box.t-center.pointer.tab-item.opacity6',
        //直播页粉丝团\大航海购买页购买引导
        'div.right-list.flex.small-right',
        'div.subtitle.m-b-30.text-12.font-bold.lh-14',
        'div.h-54.w-full.flex.items-center',
        'div.right-list.flex',
        'div.medal',
        'div.fans-equity',
        'div.m-b-50.m-t-30.h-22.flex.flex-row.items-center.border-rd-11.p-l-4.p-r-6',
        'div.relation-rights-wrapper.relative.m-auto.box-border.max-w-423.border-rd-12.bg-white.p-12.p-t-20.relative.z-2.m-b-10',
        'div.guard-bonus-wrapper.m-auto.m-b-12.box-border.max-w-423.border-rd-12.bg-white.p-12.p-t-20',
        'div.platform-rights-wrapper.m-auto.box-border.max-w-423.border-rd-12.bg-white.p-12.p-b-0.p-t-20',
        //直播页粉丝团\大航海购买页粉丝团成员榜大航海勋章
        'div.rights',
        //直播页粉丝团\大航海购买页粉丝团成员榜排名名次
        'div.rank-icon',
        //直播页粉丝团\大航海购买页舰队权益购买引导
        'div.m-t-16.flex.items-center.justify-center.text-14',
        //直播页粉丝团\大航海购买页舰队权益大航海图标
        'div.m-r-5.h-26.w-26.bg-cover',
        //直播页等级勋章
        'div.wealth-medal-ctnr.fans-medal-item-target.dp-i-block.p-relative.v-middle',
        //直播页粉丝勋章
        'div.fans-medal-item-ctnr.fans-medal-item-target.dp-i-block.p-relative.v-middle',
        //直播页聊天框装扮
        'div.title-label.dp-i-block.p-relative.v-middle',
        //直播页聊天框信息提示/互动引导
        'div.chat-item.common-danmuku-msg.border-box',
        'div.chat-item.convention-msg.border-box',
        'div.chat-item.misc-msg.guard-buy',
        '#combo-card',
        'div.super-gift-item animation',
        'div.welcome-section-bottom',
        //直播页聊天框礼物提示
        'div.content-ctnr.border-box.p-relative',
        'div.base-bubble-wrapper.super-gift-bubbles',
        'div.gift-anim-setting',
        'div.gift-bubble-setting',
        'div.chat-item.gift-item',
        //直播页聊天框SC
        'div.pay-note-setting',
        'div.msg-bubble-setting',
        'div.chat-item.danmaku-item.superChat-card-detail',
        'div.pay-note-panel',
        //直播页主播头像框
        'div.blive-avatar-pendant',
        //直播页播放器顶部移动式横幅广告
        'div.announcement-wrapper.clearfix.no-select',
        //直播页播放器左上小橙车提示
        'div.shop-popover',
        //直播页抽奖提示
        'div.participation-box.bg-100.lottery-start',
        'div.participation-box.bg-100.lottery-end',
        //直播页播放器结束推荐
        'div.web-player-ending-panel-recommendList',
        //直播页播放器上贴纸
        'div.sticker-item',
        //直播页弹幕图标
        'img.bili-danmaku-x-icon',
        //直播页弹幕连击
        'div.combo-danmaku',
        //直播页中心横向广告
        'div.flip-view.p-relative.over-hidden.w-100',
        //直播页主播心愿提示
        'div.gift-wish-card-root',
        //直播页互动指令窗口
        '#game-id',
        //观赛直播页轮播广告
        'div._root_bhaoj_2',
        //直播分区页大型横向广告
        'div.banner-ctn',
        //直播分区页横幅广告
        'div.index_flip-view-image-ctnr_ueRWr.index_ts-dot-4_afXVm',
        'div.index_flip-view-titles_ILDY7',
        //直播站点粉丝勋章页面顶部导航栏
        'div.mini-vip.van-popover__reference',
        'a.link.download-client-trigger.van-popover__reference',
        '[href="//manga.bilibili.com?from=bill_top_mnav"]',
        '[href="//www.bilibili.com/match/home/"]',
        '[href="//show.bilibili.com/platform/home.html?msource=pc_web"]',
        '[href="//live.bilibili.com"]',
        '[href="https://game.bilibili.com/platform/"]',
        '[href="//www.bilibili.com/anime/"]',
        'div.channel-menu-mini',
        'svg.navbar_pullup'
    ];

    const cssRules = hideSelectors.map(selector =>
        `${selector} {
         display: none !important; 
         }`
    ).join('\n');

    // 评论区相关样式
    const commentStyles = `
        /* 评论区容器相对定位 */
        #comment-lock-container {
            position: relative;
        }

        /* 遮罩层 - 覆盖在评论区上方 */
        #comment-lock-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            z-index: 999;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding-top: 40px;
            align-items: center;
            min-height: 400px;
        }

        /* 解锁按钮 */
        #unlock-comment-btn {
            padding: 16px 32px;
            background: linear-gradient(135deg, #00aeec 0%, #0098D1 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(0, 152, 209, 0.4);
            transition: all 0.3s ease;
        }

        #unlock-comment-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0, 152, 209, 0.4);
        }

        /* 提示文字 */
        #lock-hint {
            color: #999;
            font-size: 14px;
            margin-top: 20px;
            text-align: center;
        }

        /* 对话框遮罩 */
        #comment-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(8px);
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* 对话框 */
        #comment-dialog {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 24px;
            padding: 50px 45px;
            max-width: 520px;
            width: 90%;
            box-shadow: 0 30px 90px rgba(0, 0, 0, 0.25);
            text-align: center;
            position: relative;
            overflow: hidden;
            animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        #comment-dialog h2 {
            color: #1a1a1a;
            font-size: 22px;
            margin-bottom: 30px;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            letter-spacing: 0.5px;
            opacity: 0;
            animation: fadeInText 0.6s ease 0.2s forwards;
        }
        
        @keyframes fadeInText {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #comment-dialog p {
            color: #666;
            font-size: 15px;
            line-height: 2;
            margin: 12px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            opacity: 0;
        }
        
        #comment-dialog p:nth-of-type(1) {
            animation: fadeInText 0.6s ease 0.4s forwards;
        }
        
        #comment-dialog p:nth-of-type(2) {
            animation: fadeInText 0.6s ease 0.6s forwards;
        }

        #comment-dialog p:last-of-type {
            color: #00AEEC;
            font-weight: 600;
            margin-top: 25px;
            font-size: 16px;
            animation: fadeInText 0.6s ease 0.8s forwards;
        }

        /* 倒计时 */
        #countdown {
            font-size: 72px;
            font-weight: 300;
            color: #00AEEC;
            margin: 40px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1;
            animation: pulse 1s ease infinite;
            text-shadow: 0 2px 10px rgba(0, 174, 236, 0.2);
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.05);
                opacity: 0.9;
            }
        }
        
        #countdown.completed {
            animation: none;
            color: #52c41a;
            font-size: 64px;
        }

        /* 输入区域 */
        #input-area {
            margin-top: 35px;
            opacity: 0.3;
            pointer-events: none;
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform: translateY(10px);
        }

        #input-area.unlocked {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }

        #reflection-input {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e8e8e8;
            border-radius: 12px;
            font-size: 15px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
            background: #fafafa;
        }

        #reflection-input:focus {
            outline: none;
            border-color: #00AEEC;
            background: white;
            box-shadow: 0 0 0 3px rgba(0, 174, 236, 0.1);
        }

        #confirm-btn {
            margin-top: 18px;
            padding: 14px 36px;
            background: linear-gradient(135deg, #00AEEC 0%, #0098D1 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 174, 236, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
        }

        #confirm-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 174, 236, 0.4);
        }
        
        #confirm-btn:active:not(:disabled) {
            transform: translateY(0);
        }

        #confirm-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        #error-msg {
            color: #ff4d4f;
            font-size: 13px;
            margin-top: 12px;
            min-height: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
            animation: shake 0.5s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        /* 搜索页视频封面遮罩层 */
        .search-cover__mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.01);
            /* ↓修改这个来调节模糊度↓ */
            backdrop-filter: blur(10px);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            transition: opacity 0.2s;
            will-change: transform;
        }

        /* 搜索页视频封面显示按钮 */
        .search-cover__button {
            padding: 8px 16px;
            background: #00aeec;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.2s, background 0.2s;
            pointer-events: auto;
        }

        .search-cover__button.visible {
            opacity: 1;
        }

        .search-cover__button.mouse-in {
            background: #40c5f1;
        }
        
        /* 封面模糊切换按钮样式 */
        .blur-toggle-container {
            display: flex;
            align-items: center;
            margin-left: auto;
            padding: 0 16px;
        }

        .blur-toggle-button {
            display: flex;
            align-items: center;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 20px;
            transition: background-color 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        }

        .blur-toggle-button:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .blur-toggle-inner {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .blur-toggle-label {
            font-size: 14px;
            color: #61666d;
            user-select: none;
        }

        .blur-toggle-switch {
            position: relative;
            width: 40px;
            height: 22px;
            background-color: #c9ccd0;
            border-radius: 11px;
            transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blur-toggle-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .blur-toggle-switch.active {
            background-color: #00aeec;
        }

        .blur-toggle-switch.active::after {
            transform: translateX(18px);
        }

        /* 确认对话框样式 */
        .blur-toggle-dialog-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background-color: rgba(0, 0, 0, 0);
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 10000 !important;
            transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            margin: 0 !important;
            padding: 0 !important;
        }

        .blur-toggle-dialog-overlay.show {
            background-color: rgba(0, 0, 0, 0.6);
        }

        .blur-toggle-dialog-overlay.closing {
            background-color: rgba(0, 0, 0, 0);
        }

        .blur-toggle-dialog-overlay.closing .blur-toggle-dialog {
            transform: scale(0.9);
            opacity: 0;
        }

        .blur-toggle-dialog {
            background: white;
            border-radius: 6px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 450px;
            width: 90%;
            transform: scale(0.9);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        }

        .blur-toggle-dialog-overlay.show .blur-toggle-dialog {
            transform: scale(1);
            opacity: 1;
        }

        .blur-toggle-dialog-content {
            padding: 32px 24px 24px;
        }

        .blur-toggle-dialog-title {
            margin: 0 0 12px;
            font-size: 20px;
            font-weight: 600;
            color: #18191c;
            opacity: 0;
            animation: fadeInText 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
        }

        .blur-toggle-dialog-message {
            margin: 0 0 24px;
            font-size: 15px;
            color: #61666d;
            line-height: 1.6;
            opacity: 0;
            animation: fadeInText 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
        }

        .blur-toggle-dialog-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            opacity: 0;
            animation: fadeInText 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }

        .blur-toggle-dialog-btn {
            padding: 10px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        }

        .blur-toggle-dialog-btn-cancel {
            background-color: #f1f2f3;
            color: #61666d;
        }

        .blur-toggle-dialog-btn-cancel:hover {
            background-color: #e3e5e7;
        }

        .blur-toggle-dialog-btn-confirm {
            background-color: #00aeec;
            color: white;
        }

        .blur-toggle-dialog-btn-confirm:hover {
            background-color: #40c5f1;
        }

        .blur-toggle-dialog-btn:active {
            transform: scale(0.96);
        }

        @keyframes fadeInText {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    
    // 注入所有 CSS
    GM_addStyle(cssRules + commentStyles);

    console.log('[Bilibili纯粹化] 样式已注入');

    // 辅助函数 - 获取范围内随机整数
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 辅助函数 - 标准化字符格式
    function normalizeText(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFKC')                   // 统一全角半角
        .replace(/[\s\-_]+/g, '')            // 去掉空格/下划线/横线等分隔符
}



// 评论区净化功能 - 移除超链接、点赞数、UP主点赞标识、用户装饰
function purifyComments() {
    //console.log('[Bilibili纯粹化-调试] purifyComments 函数被调用');
    
    let processedCount = {
        searchLinks: 0,
        likeCounts: 0,
        upTags: 0,
        userStyles: 0,
        userLevels: 0,
        sailingCards: 0,
        avatarLayers: 0
    };
    
    // 存储所有观察器
    const observers = new Set();
    
    // 处理评论中的搜索关键词超链接
    function processSearchLinks(richText) {
        if (!richText || !richText.shadowRoot) return;
        
        const contents = richText.shadowRoot.querySelector('#contents');
        if (!contents) return;
        
        const searchLinks = contents.querySelectorAll('a[data-type="search"]');
        
        searchLinks.forEach(link => {
            const span = document.createElement('span');
            span.textContent = link.textContent;
            span.className = link.className;
            link.parentNode.replaceChild(span, link);
            //processedCount.searchLinks++;
            
            const img = span.querySelector('img');
            if (img) {
                img.style.display = 'none';
            }
        });
    }
    
    // 隐藏点赞数量
    function hideLikeCount(actionButtons) {
        if (!actionButtons || !actionButtons.shadowRoot) return;
        
        const likeDiv = actionButtons.shadowRoot.querySelector('#like');
        if (!likeDiv) return;
        
        const countSpan = likeDiv.querySelector('button #count');
        if (countSpan) {
            countSpan.style.display = 'none';
            //processedCount.likeCounts++;
        }
    }
    
    // 隐藏UP主点赞标识
    function hideUpLikeTags(mainDiv) {
        if (!mainDiv) return;
        
        const tagsDiv = mainDiv.querySelector('#tags');
        if (tagsDiv) {
            tagsDiv.style.display = 'none';
            //processedCount.upTags++;
        }
    }
    
    // 净化用户信息（移除用户名样式、隐藏等级）
    function purifyUserInfo(userInfo) {
        if (!userInfo || !userInfo.shadowRoot) return;
        
        const infoDiv = userInfo.shadowRoot.querySelector('#info');
        if (!infoDiv) return;
        
        // 移除用户名的 style 属性
        const userNameDiv = infoDiv.querySelector('#user-name');
        if (userNameDiv) {
            const userNameLink = userNameDiv.querySelector('a');
            if (userNameLink && userNameLink.hasAttribute('style')) {
                userNameLink.removeAttribute('style');
                //processedCount.userStyles++;
            }
        }
        
        // 隐藏用户等级
        const userLevelDiv = infoDiv.querySelector('#user-level');
        if (userLevelDiv && userLevelDiv.style.display !== 'none') {
            userLevelDiv.style.display = 'none';
            //processedCount.userLevels++;
        }

        // 隐藏用户勋章
        const userMedalDiv = infoDiv.querySelector('#user-medal');
        if (userMedalDiv && userMedalDiv.style.display !== 'none') {
            userMedalDiv.style.display = 'none';
        }
    }
    
    // 隐藏用户装扮卡片
    function removeSailingCard(header) {
        if (!header) return;
        const sailingCard = header.querySelector('bili-comment-user-sailing-card');
        if (sailingCard) {
            sailingCard.style.display = 'none';
            //processedCount.sailingCards++;
        }
    }
    
    // 隐藏头像装饰层
    function hideAvatarLayers(avatar) {
        if (!avatar || !avatar.shadowRoot) return;
        
        const canvasDiv = avatar.shadowRoot.querySelector('#canvas');
        if (!canvasDiv) return;
        
        // 隐藏 class="layer" 的 div (大会员标志)
        const layers = canvasDiv.querySelectorAll('.layer');
        layers.forEach(layer => {
            if(!layer.classList.contains('center')){
                if (layer.style.display !== 'none') {
                layer.style.display = 'none';
                //processedCount.avatarLayers++;
            }
            }
        });
        
        // 隐藏 class="layer-res" 且没有 style 属性的 div，并隐藏其他layer-res的style (头像框)
        const layerRes = canvasDiv.querySelectorAll('.layer-res');
        layerRes.forEach(res => {
            if (!res.hasAttribute('style') && res.style.display !== 'none') {
                res.style.display = 'none';
                //processedCount.avatarLayers++;
            }
        });

        //另一种头像框 在隐藏头像框的同时统一头像大小 (可能是动态头像框?)
        const layerCenter = canvasDiv.querySelectorAll('.layer.center');
        layerCenter.forEach(layer => {
            if(layer.style.width == '66px'){
                layer.style.display = 'none';
            }else if(layer.style.width !== '48px'){
                layer.style.width = '48px';
                layer.style.height = '48px';
            }
        })

    }
    
    // 处理用户头像
    function processUserAvatar(bodyDiv) {
        if (!bodyDiv) return;
        
        const avatarLink = bodyDiv.querySelector('#user-avatar');
        if (!avatarLink) return;
        
        const avatar = avatarLink.querySelector('bili-avatar');
        if (avatar) {
            hideAvatarLayers(avatar);
            
            // 监听 avatar 的 shadowRoot
            if (avatar.shadowRoot) {
                observeShadowRoot(avatar.shadowRoot, () => {
                    hideAvatarLayers(avatar);
                });
            }
        }
    }
    
    // 为 Shadow Root 设置观察器
    function observeShadowRoot(shadowRoot, callback) {
        if (!shadowRoot) return null;
        
        const observer = new MutationObserver(callback);
        observer.observe(shadowRoot, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        observers.add(observer);
        return observer;
    }
    
    // 处理单个评论
    function processComment(commentRenderer) {
        if (!commentRenderer || !commentRenderer.shadowRoot) return;
        
        // 监听 commentRenderer 的 shadowRoot
        observeShadowRoot(commentRenderer.shadowRoot, () => {
            const body = commentRenderer.shadowRoot.querySelector('#body');
            if (!body) return;
            
            const main = body.querySelector('#main');
            if (!main) return;
            
            // 处理评论内容
            const content = main.querySelector('#content');
            if (content) {
                const richText = content.querySelector('bili-rich-text');
                processSearchLinks(richText);
                
                // 监听 richText 的 shadowRoot
                if (richText && richText.shadowRoot) {
                    observeShadowRoot(richText.shadowRoot, () => {
                        processSearchLinks(richText);
                    });
                }
            }
            
            // 处理用户信息
            const header = main.querySelector('#header');
            if (header) {
                const userInfo = header.querySelector('bili-comment-user-info');
                if (userInfo) {
                    purifyUserInfo(userInfo);
                    removeSailingCard(header);
                    
                    // 监听 userInfo 的 shadowRoot
                    if (userInfo.shadowRoot) {
                        observeShadowRoot(userInfo.shadowRoot, () => {
                            purifyUserInfo(userInfo);
                        });
                    }
                }
            }
            
            // 处理用户头像
            processUserAvatar(body);
            
            const footer = main.querySelector('#footer');
            if (footer) {
                const actionButtons = footer.querySelector('bili-comment-action-buttons-renderer');
                hideLikeCount(actionButtons);
                
                // 监听 actionButtons 的 shadowRoot
                if (actionButtons && actionButtons.shadowRoot) {
                    observeShadowRoot(actionButtons.shadowRoot, () => {
                        hideLikeCount(actionButtons);
                    });
                }
            }
            
            hideUpLikeTags(main);
        });
        
        // 立即执行一次处理
        const body = commentRenderer.shadowRoot.querySelector('#body');
        if (!body) return;
        
        const main = body.querySelector('#main');
        if (!main) return;
        
        const content = main.querySelector('#content');
        if (content) {
            const richText = content.querySelector('bili-rich-text');
            processSearchLinks(richText);
            
            if (richText && richText.shadowRoot) {
                observeShadowRoot(richText.shadowRoot, () => {
                    processSearchLinks(richText);
                });
            }
        }
        
        const header = main.querySelector('#header');
        if (header) {
            const userInfo = header.querySelector('bili-comment-user-info');
            if (userInfo) {
                purifyUserInfo(userInfo);
                removeSailingCard(header);
                
                if (userInfo.shadowRoot) {
                    observeShadowRoot(userInfo.shadowRoot, () => {
                        purifyUserInfo(userInfo);
                    });
                }
            }
        }
        
        processUserAvatar(body);
        
        const footer = main.querySelector('#footer');
        if (footer) {
            const actionButtons = footer.querySelector('bili-comment-action-buttons-renderer');
            hideLikeCount(actionButtons);
            
            if (actionButtons && actionButtons.shadowRoot) {
                observeShadowRoot(actionButtons.shadowRoot, () => {
                    hideLikeCount(actionButtons);
                });
            }
        }
        
        hideUpLikeTags(main);
    }
    
    // 处理楼中楼回复
    function processReplies(repliesRenderer) {
        if (!repliesRenderer || !repliesRenderer.shadowRoot) return;
        
        // 监听 repliesRenderer 的 shadowRoot
        observeShadowRoot(repliesRenderer.shadowRoot, () => {
            const expander = repliesRenderer.shadowRoot.querySelector('#expander');
            if (!expander) return;
            
            const expanderContents = expander.querySelector('#expander-contents');
            if (!expanderContents) return;
            
            const replyRenderers = expanderContents.querySelectorAll('bili-comment-reply-renderer');
            
            replyRenderers.forEach(replyRenderer => {
                if (!replyRenderer.shadowRoot) return;
                
                // 监听每个 replyRenderer 的 shadowRoot
                observeShadowRoot(replyRenderer.shadowRoot, () => {
                    const body = replyRenderer.shadowRoot.querySelector('#body');
                    if (!body) return;
                    
                    const main = body.querySelector('#main');
                    if (!main) return;
                    
                    const richText = main.querySelector('bili-rich-text');
                    processSearchLinks(richText);
                    
                    if (richText && richText.shadowRoot) {
                        observeShadowRoot(richText.shadowRoot, () => {
                            processSearchLinks(richText);
                        });
                    }
                    
                    // 处理楼中楼的用户信息
                    const userInfo = main.querySelector('bili-comment-user-info');
                    if (userInfo) {
                        purifyUserInfo(userInfo);
                        
                        if (userInfo.shadowRoot) {
                            observeShadowRoot(userInfo.shadowRoot, () => {
                                purifyUserInfo(userInfo);
                            });
                        }
                    }
                    
                    const footer = body.querySelector('#footer');
                    if (footer) {
                        const actionButtons = footer.querySelector('bili-comment-action-buttons-renderer');
                        hideLikeCount(actionButtons);
                        
                        if (actionButtons && actionButtons.shadowRoot) {
                            observeShadowRoot(actionButtons.shadowRoot, () => {
                                hideLikeCount(actionButtons);
                            });
                        }
                    }
                });
                
                // 立即执行一次处理
                const body = replyRenderer.shadowRoot.querySelector('#body');
                if (!body) return;
                
                const main = body.querySelector('#main');
                if (!main) return;
                
                const richText = main.querySelector('bili-rich-text');
                processSearchLinks(richText);
                
                if (richText && richText.shadowRoot) {
                    observeShadowRoot(richText.shadowRoot, () => {
                        processSearchLinks(richText);
                    });
                }
                
                const userInfo = main.querySelector('bili-comment-user-info');
                if (userInfo) {
                    purifyUserInfo(userInfo);
                    
                    if (userInfo.shadowRoot) {
                        observeShadowRoot(userInfo.shadowRoot, () => {
                            purifyUserInfo(userInfo);
                        });
                    }
                }
                
                const footer = body.querySelector('#footer');
                if (footer) {
                    const actionButtons = footer.querySelector('bili-comment-action-buttons-renderer');
                    hideLikeCount(actionButtons);
                    
                    if (actionButtons && actionButtons.shadowRoot) {
                        observeShadowRoot(actionButtons.shadowRoot, () => {
                            hideLikeCount(actionButtons);
                        });
                    }
                }
            });
        });
        
        // 立即执行一次处理
        const expander = repliesRenderer.shadowRoot.querySelector('#expander');
        if (!expander) return;
        
        const expanderContents = expander.querySelector('#expander-contents');
        if (!expanderContents) return;
        
        const replyRenderers = expanderContents.querySelectorAll('bili-comment-reply-renderer');
        
        replyRenderers.forEach(replyRenderer => {
            if (!replyRenderer.shadowRoot) return;
            
            observeShadowRoot(replyRenderer.shadowRoot, () => {
                const body = replyRenderer.shadowRoot.querySelector('#body');
                if (!body) return;
                
                const main = body.querySelector('#main');
                if (!main) return;
                
                const richText = main.querySelector('bili-rich-text');
                processSearchLinks(richText);
                
                if (richText && richText.shadowRoot) {
                    observeShadowRoot(richText.shadowRoot, () => {
                        processSearchLinks(richText);
                    });
                }
                
                const userInfo = main.querySelector('bili-comment-user-info');
                if (userInfo) {
                    purifyUserInfo(userInfo);
                    
                    if (userInfo.shadowRoot) {
                        observeShadowRoot(userInfo.shadowRoot, () => {
                            purifyUserInfo(userInfo);
                        });
                    }
                }
                
                const footer = body.querySelector('#footer');
                if (footer) {
                    const actionButtons = footer.querySelector('bili-comment-action-buttons-renderer');
                    hideLikeCount(actionButtons);
                    
                    if (actionButtons && actionButtons.shadowRoot) {
                        observeShadowRoot(actionButtons.shadowRoot, () => {
                            hideLikeCount(actionButtons);
                        });
                    }
                }
            });
            
            const body = replyRenderer.shadowRoot.querySelector('#body');
            if (!body) return;
            
            const main = body.querySelector('#main');
            if (!main) return;
            
            const richText = main.querySelector('bili-rich-text');
            processSearchLinks(richText);
            
            if (richText && richText.shadowRoot) {
                observeShadowRoot(richText.shadowRoot, () => {
                    processSearchLinks(richText);
                });
            }
            
            const userInfo = main.querySelector('bili-comment-user-info');
            if (userInfo) {
                purifyUserInfo(userInfo);
                
                if (userInfo.shadowRoot) {
                    observeShadowRoot(userInfo.shadowRoot, () => {
                        purifyUserInfo(userInfo);
                    });
                }
            }
            
            const footer = body.querySelector('#footer');
            if (footer) {
                const actionButtons = footer.querySelector('bili-comment-action-buttons-renderer');
                hideLikeCount(actionButtons);
                
                if (actionButtons && actionButtons.shadowRoot) {
                    observeShadowRoot(actionButtons.shadowRoot, () => {
                        hideLikeCount(actionButtons);
                    });
                }
            }
        });
    }
    
    // 处理所有评论线程
    function processAllComments() {
        const biliComments = document.querySelector('bili-comments');
        if (!biliComments || !biliComments.shadowRoot) return false;
        
        const contents = biliComments.shadowRoot.querySelector('#contents');
        if (!contents) return false;
        
        const feed = contents.querySelector('#feed');
        if (!feed) return false;
        
        const threads = feed.querySelectorAll('bili-comment-thread-renderer');
        
        threads.forEach((thread, index) => {
            if (!thread.shadowRoot) return;
            
            // 监听每个 thread 的 shadowRoot
            observeShadowRoot(thread.shadowRoot, () => {
                const commentRenderer = thread.shadowRoot.querySelector('bili-comment-renderer');
                if (commentRenderer) {
                    processComment(commentRenderer);
                }
                
                const replies = thread.shadowRoot.querySelector('#replies');
                if (replies) {
                    const repliesRenderer = replies.querySelector('bili-comment-replies-renderer');
                    if (repliesRenderer) {
                        processReplies(repliesRenderer);
                    }
                }
            });
            
            // 立即执行一次处理
            const commentRenderer = thread.shadowRoot.querySelector('bili-comment-renderer');
            if (commentRenderer) {
                processComment(commentRenderer);
            }
            
            const replies = thread.shadowRoot.querySelector('#replies');
            if (replies) {
                const repliesRenderer = replies.querySelector('bili-comment-replies-renderer');
                if (repliesRenderer) {
                    processReplies(repliesRenderer);
                }
            }
        });
        
        // if (processedCount.searchLinks > 0 || processedCount.likeCounts > 0 || processedCount.upTags > 0 || 
        //     processedCount.userStyles > 0 || processedCount.userLevels > 0 || processedCount.sailingCards > 0 || 
        //     processedCount.avatarLayers > 0) {
        //     console.log(`[Bilibili纯粹化-调试] 本次处理完成 - 搜索链接: ${processedCount.searchLinks}, 点赞数: ${processedCount.likeCounts}, UP标识: ${processedCount.upTags}, 用户名样式: ${processedCount.userStyles}, 用户等级: ${processedCount.userLevels}, 装扮卡片: ${processedCount.sailingCards}, 头像装饰: ${processedCount.avatarLayers}`);
        // }
        
        // processedCount = {
        //     searchLinks: 0,
        //     likeCounts: 0,
        //     upTags: 0,
        //     userStyles: 0,
        //     userLevels: 0,
        //     sailingCards: 0,
        //     avatarLayers: 0
        // };
        
        return true;
    }
    
    // 监听评论区变化
    function observeComments(retryCount = 0) {
        const maxRetries = 20;
        
        const biliComments = document.querySelector('bili-comments');
        if (!biliComments) {
            if (retryCount < maxRetries) {
                setTimeout(() => observeComments(retryCount + 1), 500);
            }
            return;
        }
        
        if (!biliComments.shadowRoot) {
            if (retryCount < maxRetries) {
                setTimeout(() => observeComments(retryCount + 1), 500);
            }
            return;
        }
        
        // 监听 biliComments 的 shadowRoot
        observeShadowRoot(biliComments.shadowRoot, () => {
            processAllComments();
        });
        
        function waitForContents(contentRetryCount = 0) {
            const maxContentRetries = 20;
            
            const contents = biliComments.shadowRoot.querySelector('#contents');
            if (!contents) {
                if (contentRetryCount < maxContentRetries) {
                    setTimeout(() => waitForContents(contentRetryCount + 1), 500);
                }
                return;
            }
            
            // 监听 contents
            observeShadowRoot(contents, () => {
                processAllComments();
            });
            
            function waitForFeed(feedRetryCount = 0) {
                const maxFeedRetries = 20;
                
                const feed = contents.querySelector('#feed');
                if (!feed) {
                    if (feedRetryCount < maxFeedRetries) {
                        setTimeout(() => waitForFeed(feedRetryCount + 1), 500);
                    }
                    return;
                }
                
                //console.log('[Bilibili纯粹化-调试] #feed 已找到,开始初始处理和监听');
                
                // 监听 feed
                observeShadowRoot(feed, () => {
                    processAllComments();
                });
                
                // 初始处理
                processAllComments();
                
                console.log('[Bilibili纯粹化] 评论区净化功能已启用');
            }
            
            waitForFeed();
        }
        
        waitForContents();
    }
    
    observeComments();
}


    // 评论区锁定功能
    function initCommentLock(pageType) {
        var commentApp;
        switch (pageType) {
            case "video":
                commentApp = document.querySelector('#commentapp');
                break;
            case "bangumi":
                commentApp = document.querySelector('#comment-body');
                break;
            default:
                return;
        }
        if (!commentApp || document.querySelector('#comment-lock-container')) {
            return;
        }

        // 创建遮罩容器
        const container = document.createElement('div');
        container.id = 'comment-lock-container';

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'comment-lock-overlay';
        overlay.innerHTML = `
            <button id="unlock-comment-btn">🔒 解锁评论区</button>
            <div id="lock-hint">在查看评论前，请先思考一下</div>
        `;

        // 以容器包裹评论区
        commentApp.parentNode.insertBefore(container, commentApp);
        container.appendChild(commentApp);
        container.appendChild(overlay);

        // 点击解锁按钮
        const unlockBtn = overlay.querySelector('#unlock-comment-btn');
        unlockBtn.addEventListener('click', showDialog);

        console.log('[Bilibili纯粹化] 评论区锁定已启用');
    }

    function showDialog() {
        // 创建对话框
        const dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'comment-dialog-overlay';

        dialogOverlay.innerHTML = `
            <div id="comment-dialog">
                <h2>请确认你真的想进入这个评论区。</h2>
                <p>保持清醒，不要被平台/媒体操控。</p>
                <p>思考：你现在希望从评论中获得什么？</p>

                <div id="countdown">3</div>

                <div id="input-area">
                    <input type="text" autocomplete="off" id="reflection-input" placeholder="请输入：我保持思考" />
                    <button id="confirm-btn">确认解锁</button>
                    <div id="error-msg"></div>
                </div>
            </div>
        `;

        document.body.appendChild(dialogOverlay);

        // 倒计时逻辑
        let count = 3;
        const countdownEl = document.getElementById('countdown');
        const inputArea = document.getElementById('input-area');
        const confirmBtn = document.getElementById('confirm-btn');
        const input = document.getElementById('reflection-input');
        const errorMsg = document.getElementById('error-msg');

        const timer = setInterval(() => {
            count--;
            countdownEl.textContent = count;

            if (count === 0) {
                clearInterval(timer);
                countdownEl.textContent = '✓';
                countdownEl.classList.add('completed');
                inputArea.classList.add('unlocked');
                input.focus();
            }
        }, 1000);

        // 确认按钮逻辑
        confirmBtn.addEventListener('click', () => {
            if (input.value.trim() === '我保持思考') {
                // 解锁评论区 - 直接移除遮罩层
                const lockOverlay = document.querySelector('#comment-lock-overlay');
                if (lockOverlay) {
                    lockOverlay.remove();
                }
                dialogOverlay.remove();

                console.log('[Bilibili纯粹化] 评论区已解锁');
            } else {
                errorMsg.textContent = '请输入正确的文字';
                input.style.borderColor = '#e74c3c';

                setTimeout(() => {
                    errorMsg.textContent = '';
                    input.style.borderColor = '#ddd';
                }, 2000);
            }
        });

        // 支持回车键确认
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });

        // 点击遮罩关闭
        dialogOverlay.addEventListener('click', (e) => {
            if (e.target === dialogOverlay) {
                dialogOverlay.remove();
            }
        });
    }

    // 评论区锁定初始化
    function waitForComment(pageType) {
        const observer = new MutationObserver(() => {
            const biliComments = document.querySelector('bili-comments')
            if (biliComments && !document.querySelector('#comment-lock-container')) {
                initCommentLock(pageType);
            }
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(() => waitForComment(pageType), 100);
        }
    }

    //取消自动连播
    function autoContinuousOff(){
        let hasClicked = false; // 防止重复点击

        const observer = new MutationObserver(() => {
            // 查找自动连播容器
            const continuousBtn = document.querySelector('.continuous-btn');

            if (continuousBtn) {
                // 查找开启状态的按钮
                const switchBtnOn = continuousBtn.querySelector('.switch-btn.on');

                if (switchBtnOn && !hasClicked) {
                    hasClicked = true;
                    switchBtnOn.click();
                    console.log('[Bilibili纯粹化] 尝试关闭自动连播');

                    // 等待 500ms 后检查是否真的关闭了
                    setTimeout(() => {
                        const checkBtn = document.querySelector('.continuous-btn .switch-btn');
                        if (checkBtn && !checkBtn.classList.contains('on')) {
                            console.log('[Bilibili纯粹化] 自动连播已关闭');
                            observer.disconnect();
                        } else {
                            console.log('[Bilibili纯粹化] 自动连播关闭失败，继续尝试');
                            hasClicked = false; // 允许再次点击
                        }
                    }, 500);
                } else {
                    // 检查是否已经是关闭状态
                    const switchBtn = continuousBtn.querySelector('.switch-btn');
                    if (switchBtn && !switchBtn.classList.contains('on')) {
                        console.log('[Bilibili纯粹化] 已经是关闭状态');
                        observer.disconnect();
                    }
                }
            }
        });

        // 开始监听 DOM 变化
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 10秒后停止检查
        setTimeout(() => observer.disconnect(), 10000);
    }

    // 视频页相关功能
    if (window.location.pathname.includes('/video/')) {
        //评论区锁定
        waitForComment("video");
        //关闭自动连播
        autoContinuousOff();
        //评论区净化
        purifyComments();
    }

    //剧播放页相关功能
    if (window.location.pathname.includes('/bangumi/')) {
        //评论区锁定
        waitForComment("bangumi");
        //评论区净化
        purifyComments();
    }

    
    // 直播间聊天框彩色背景/彩色名字/彩色名字/特殊弹幕移除功能
    function removeChatColors() {
        // 查找所有带彩色背景的聊天项
        const colorfulChats = document.querySelectorAll('.chat-item.danmaku-item.has-bubble');
        
        colorfulChats.forEach(chat => {
            // 移除 style 属性以去掉背景颜色
            if (chat.hasAttribute('style')) {
                chat.removeAttribute('style');
            }
        });

        //移除用户名字颜色
        const userNames = document.querySelectorAll('span.user-name.v-middle.pointer.open-menu');
        userNames.forEach(name => {
            if(name.style.color !== '#ffffff'){
                name.setAttribute('style', '');
            }
        })



        //修改特殊弹幕
        const regularDanmakuClassname = 'bili-danmaku-x-dm bili-danmaku-x-roll bili-danmaku-x-show';
        // 标准弹幕style
        const regularDanmakuStyle = `--opacity: 1; --fontSize: 25px; --fontFamily: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif; --fontWeight: bold; --color: #ffffff; --textShadow: 1px 0 1px #000000,0 1px 1px #000000,0 -1px 1px #000000,-1px 0 1px #000000; --display: none; --offset: 1275px; --translateX: -1387px; --duration: 9.5s; --top: 0px;`;
        const whiteColorHex = '#ffffff';
        const MAX_TOP_PIXELS = 200; // 特殊弹幕替换滚动顶部随机距离范围上限
        const MIN_TOP_PIXELS = 0;   // 特殊弹幕替换滚动顶部随机距离范围下限
        // 所有不需要处理（非特殊弹幕）的类名集合
        const standardClassnames = new Set([
            regularDanmakuClassname,
            'bili-danmaku-x-dm bili-danmaku-x-roll',    // preparingDanmakuClassname
            'bili-danmaku-x-dm',                       // offScreenDanmakuClassname
            'bili-danmaku-x-dm-rotate',                // danmakuRotateClassname
            'bilibili-combo-danmaku-container'         // comboDanmakucontainerClassname
        ]);

        const danmakuContainer = document.querySelector('.danmaku-item-container');
        if (!danmakuContainer) return;

        const danmakus = danmakuContainer.childNodes;

        danmakus.forEach(danmaku => {
            if (danmaku.nodeType !== 1 || !danmaku.style) return; 

            const currentClassName = danmaku.className;
            const isStandardClass = standardClassnames.has(currentClassName);
            const currentColor = danmaku.style.getPropertyValue('--color').trim();

            //修改非白色弹幕的颜色
            if (isStandardClass && currentColor !== whiteColorHex) {
                //console.log(`[Bilibili纯粹化-调试] [滚动非白色弹幕] ${danmaku.textContent}, 类名:${currentClassName}, 颜色:${currentColor}`);
                // 修改颜色
                danmaku.style.setProperty('--color', whiteColorHex);
            }

            //修改非滚动弹幕的类型
            if (!isStandardClass) {
                //console.log(`[Bilibili纯粹化-调试] [非滚动弹幕] ${danmaku.textContent}, 原始类名:${currentClassName}, 颜色:${currentColor}`);
                // 修改类名并给予随机顶部距离
                danmaku.className = regularDanmakuClassname;
                danmaku.setAttribute('style',regularDanmakuStyle);
            const randomTop = getRandomInt(MIN_TOP_PIXELS, MAX_TOP_PIXELS);
                danmaku.style.setProperty('--top', `${randomTop}px`);
            }
        });
    }

    // 监听直播间聊天框的动态变化
    function initLiveChatObserver() {
        // 等待聊天框容器加载
        const checkChatContainer = setInterval(() => {
            const chatContainer = document.querySelector('#chat-items');
            
            if (chatContainer) {
                clearInterval(checkChatContainer);
                
                // 处理已存在的彩色背景/彩色名字/彩色名字/特殊弹幕
                removeChatColors();
                
                // 监听新增的聊天消息
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            removeChatColors();
                        }
                    });
                });
                
                observer.observe(chatContainer, {
                    childList: true,
                    subtree: true
                });
                
                console.log('[Bilibili纯粹化] 直播间聊天净化已启用');
            }
        }, 500);
        
        // 10秒后停止检查（避免无限循环）
        setTimeout(() => clearInterval(checkChatContainer), 10000);
    }

    // 直播页启用聊天净化
    if (window.location.hostname === 'live.bilibili.com') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initLiveChatObserver);
        } else {
            initLiveChatObserver();
        }
    }

    //直播间首页播放器删除
    function removeVideoOnly() {
        const observer = new MutationObserver(() => {
            const playerCtnr = document.querySelector('.player-ctnr.p-relative.over-hidden.dp-i-block.v-top.t-left');
         if (playerCtnr) {
              const video = playerCtnr.querySelector('video');
             if (video) {
                 video.remove();
                    console.log('[Bilibili纯粹化] 已删除 video');
                    observer.disconnect(); // 删除后停止监控
            }
        }
    });
    
     observer.observe(document.documentElement, {
          childList: true,
          subtree: true
    });
    }

    if (window.location.hostname === 'live.bilibili.com' && 
       window.location.pathname === '/') {
       removeVideoOnly();
    }

    // 直播分区页横幅样式修改
    function modifyBannerClass() {
        const observer = new MutationObserver(() => {
            const banners = document.querySelectorAll('div.index_flip-view_R276P.index_banner_bPw9q');
            
            banners.forEach(banner => {
                // 检查是否已经添加了目标 class
                if (!banner.classList.contains('index_no_pic_TF1Ph') || 
                    !banner.classList.contains('bg-bright-filter')) {
                    banner.className = 'index_flip-view_R276P index_banner_bPw9q index_no_pic_TF1Ph bg-bright-filter';
                    console.log('[Bilibili纯粹化] 已修改横幅 class');
                }
            });
        });
        
        // 开始监听
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
        
        console.log('[Bilibili纯粹化] 直播横幅样式修改已启用');
    }

    // 在直播分区页面启用横幅样式修改
    if (window.location.hostname === 'live.bilibili.com'  &&  
        (window.location.pathname.includes('/p/')   ||
        //谁设计的这分区规范？？？
        //英雄联盟分区
         window.location.pathname.includes('/lol/') ||
        //吃鸡行动分区
         window.location.pathname.includes('/area/'))) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', modifyBannerClass);
        } else {
            modifyBannerClass();
        }
    }

    // 搜索框推荐关键字修改
    function modifySearchInput() {
        // 配置：
        const searchConfig = {
            //包含<input>的div
            containerClasses: [
                'nav-search-content',
                'search-input-wrap.flex_between',
                'p-relative.search-bar.over-hidden.border-box.t-nowrap',
                'nav-search'
            ],
            placeholder: '输入关键字搜索',
            removeTitle: true
        };

        // 构建选择器字符串
        const selectors = searchConfig.containerClasses.map(cls => {
            const selector = cls.split('.').join('.');
            return `.${selector} input`;
        }).join(', ');

        const observer = new MutationObserver(() => {
            const inputs = document.querySelectorAll(selectors);
            
            inputs.forEach(input => {
                // 修改 placeholder
                if (input.placeholder !== searchConfig.placeholder) {
                    input.placeholder = searchConfig.placeholder;
                    //console.log('[Bilibili纯粹化] 已修改搜索框 placeholder');
                }
                
                // 删除 title 属性
                if (searchConfig.removeTitle && input.hasAttribute('title')) {
                    input.removeAttribute('title');
                    //console.log('[Bilibili纯粹化] 已删除搜索框 title 属性');
                }
            });
        });
        
        // 开始监听
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['placeholder', 'title']
        });
        
        console.log('[Bilibili纯粹化] 搜索框修改功能已启用');
    }

    // 启用搜索框推荐关键字修改功能
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifySearchInput);
    } else {
        modifySearchInput();
    }


    // 隐藏搜索页广告视频 + 模糊视频封面功能
    function removeSearchPageAdVideo() {
        const hiddenVideos = new Set(); // 记录已隐藏的视频
        const blurredCovers = new Set(); // 记录已添加模糊遮罩的封面
        const unblurredCovers = new Set(); // 记录用户已手动显示的封面
        let isCoversBLurred = true; // 封面模糊开关，默认开启
        const pendingVideos = new Set(); // 可能的算法推荐视频
        const allRequestInstances = new Set(); // 发起的网络请求
        let currentSearchKeyword = "";
        const URL_CHANGE_EVENT = 'bp-url-change'; // 自定义的url更新事件
        let lastHref = location.href; // 变更前url存储

        // 包裹原生 pushState / replaceState 调用后手动派发事件
        function wrapHistoryMethod(type) {
            const orig = history[type];
            return function () {
                const ret = orig.apply(this, arguments);
                // 派发事件
                window.dispatchEvent(new Event(URL_CHANGE_EVENT));
                return ret;
            };
        }
        history.pushState = wrapHistoryMethod('pushState');
        history.replaceState = wrapHistoryMethod('replaceState');

        // 监听浏览器前进/后退
        window.addEventListener('popstate', function () {
            window.dispatchEvent(new Event(URL_CHANGE_EVENT));
        });

        // url变更后行为
        function handleUrlChange() {
        if (location.href === lastHref) return; // 防止重复处理
        lastHref = location.href;
        //console.log("url变啦!")
        if(allRequestInstances.size>=1){
            allRequestInstances.forEach(requestInstance => {
                requestInstance.abort();
                console.log("[Bilibili纯粹化] 已停止之前的网络请求");
            })
        }
        pendingVideos.clear();
        allRequestInstances.clear();
    }

        // 当视频被添加到 pendingVideos 时，触发 pendingVideoAdded 事件
        function addPendingVideo(video) {
            if (!pendingVideos.has(video)) {
                pendingVideos.add(video);
                document.dispatchEvent(new Event('pendingVideoAdded')); // 触发事件
            }
        }

        //根据视频元素构建视频URL
        function buildUrlForTags(video){
            const videoLinkTag = video.querySelector('a')
            if(!videoLinkTag) return;
            let videoUrl = videoLinkTag.href;
            if(videoUrl.includes("m.bilibili.com")){
                videoUrl.replace("m.bilibili.com","www.bilibili.com");
            }
            return videoUrl;
        }

        //智能提取关键词
        function smartTokenize(keyword) {
            keyword = keyword.trim();
            if (!keyword) return [];

            // 如果用户自己打了空格，那我们就尊重空格拆法
            if (/\s/.test(keyword)) {
                return keyword.split(/\s+/).filter(Boolean);
            }

            const hasChinese = /[\u4e00-\u9fa5]/.test(keyword);
            const hasLatinDigit = /[a-zA-Z0-9]/.test(keyword);

            // 只英文/数字：整体作为一个token
            if (!hasChinese && hasLatinDigit) {
                return [keyword];
            }

            // 只中文：用整串 + 二字滑窗做token
            if (hasChinese && !hasLatinDigit) {
                const s = keyword.replace(/\s+/g, '');
                if (s.length <= 2) return [s]; // 太短就不拆
                const tokens = [s];
                for (let i = 0; i < s.length - 1; i++) {
                    tokens.push(s.slice(i, i + 2));
                }
                return tokens;
            }

            // 混合中文 + 英文/数字：按字符类型分段
            const tokens = [];
            let current = '';
            let currentType = null;

            const getType = ch => {
                if (/[\u4e00-\u9fa5]/.test(ch)) return 'C';          // Chinese
                if (/[a-zA-Z0-9]/.test(ch)) return 'L';              // Latin/digit
                return 'O';                                          // other符号
            };

            for (const ch of keyword) {
                const t = getType(ch);
                if (t === 'O') {
                    // 符号：当作分隔
                    if (current) {
                        tokens.push(current);
                        current = '';
                        currentType = null;
                    }
                    continue;
                }
                if (!currentType || t === currentType) {
                    current += ch;
                    currentType = t;
                } else {
                    tokens.push(current);
                    current = ch;
                    currentType = t;
                }
            }
            if (current) tokens.push(current);

            return tokens.filter(Boolean);
        }

        // 隐藏广告视频/推送视频
        function hideAdVideos(container) {
            if (!container) return;
            
            const videos = container.querySelectorAll(':scope > *');
            videos.forEach(video => {
                // 隐藏广告视频
                if (hiddenVideos.has(video)) return;
                
                const adFeedbackEntry = video.querySelector('.ad-feedback-entry');
                if (adFeedbackEntry) {
                    video.style.display = 'none';
                    hiddenVideos.add(video);
                    console.log('[Bilibili纯粹化] 已隐藏一个广告视频');
                    return;
                }

                if(pendingVideos.has(video))return;
                // 隐藏推送视频
                const currentUrl = new URL(window.location.href);
                const rawKeyword = currentUrl.searchParams.get('keyword');
                if (!rawKeyword) return;

                currentSearchKeyword = rawKeyword;

                const videoTitle = video.querySelector('.bili-video-card__info--tit');
                const videoAuthor = video.querySelector('.bili-video-card__info--author');
                if (!videoTitle || !videoAuthor) return;

                const videoTitleText  = videoTitle.textContent || '';
                const videoAuthorText = videoAuthor.textContent || '';

                const normTitle  = normalizeText(videoTitleText);
                const normAuthor = normalizeText(videoAuthorText);

                // 智能拆词
                let tokens = smartTokenize(rawKeyword);
                // 把整串原keyword也当作一个token，增加命中机会：
                if (!tokens.includes(rawKeyword.trim())) {
                    tokens.unshift(rawKeyword.trim());
                }

                // 规范化每个token
                const normTokens = tokens
                    .map(t => normalizeText(t))
                    .filter(t => t.length > 0);

                if (!normTokens.length) return;

                // 统计命中token的数量
                let matchTokenCount = 0;
                for (const token of normTokens) {
                    if (normTitle.includes(token) || normAuthor.includes(token)) {
                        matchTokenCount++;
                    }
                }

                let keepVideo = false;

                if (normTokens.length === 1) {
                    // 单一关键词（大概率是ID），必须命中才保留
                    keepVideo = matchTokenCount === 1;
                } else {
                    // 多token情况：至少命中一个就保留
                    // 可以改成比例形式：
                    // const ratio = matchTokenCount / normTokens.length;
                    // keepVideo = ratio >= 0.3; // 举例
                    keepVideo = matchTokenCount >= 1;
                }

                if (keepVideo) {
                    return; // 不隐藏
                }

                // 否则视为推荐视频，隐藏
                video.style.display = 'none';
                hiddenVideos.add(video);
                addPendingVideo(video);
                //console.log(`[Bilibili纯粹化-调试] 已隐藏一个可能的分析算法推荐视频:【${video.querySelector('.bili-video-card__info--tit')?.textContent}】，目前的检查视频set大小为:【${pendingVideos.size}】`);
                console.log('[Bilibili纯粹化] 已隐藏一个可能的分析算法推荐视频');
            });

        }

        // 为视频封面添加模糊遮罩
        function addBlurMask(container) {
            if (!container || !isCoversBLurred) return; // 检查开关状态

            const imageWraps = container.querySelectorAll('.bili-video-card__image--wrap');
            imageWraps.forEach(wrap => {
                if (blurredCovers.has(wrap) || unblurredCovers.has(wrap)) return;

                const picture = wrap.querySelector('.v-img.bili-video-card__cover');
                if (!picture) return;

                const searchPageCoverBlurMask = document.createElement('div');
                searchPageCoverBlurMask.className = 'search-cover__mask';

                const searchPageCoverShowButton = document.createElement('button');
                searchPageCoverShowButton.textContent = '显示封面';
                searchPageCoverShowButton.className = 'search-cover__button';

                searchPageCoverBlurMask.addEventListener('mouseenter', () => {
                    searchPageCoverShowButton.classList.add('visible');
                });

                searchPageCoverBlurMask.addEventListener('mouseleave', () => {
                    searchPageCoverShowButton.classList.remove('visible');
                });

                searchPageCoverShowButton.addEventListener('mouseenter', () => {
                    searchPageCoverShowButton.classList.add('mouse-in');
                });

                searchPageCoverShowButton.addEventListener('mouseleave', () => {
                    searchPageCoverShowButton.classList.remove('mouse-in');
                });

                searchPageCoverShowButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    searchPageCoverBlurMask.remove();
                    blurredCovers.delete(wrap);
                    unblurredCovers.add(wrap);
                });

                searchPageCoverBlurMask.appendChild(searchPageCoverShowButton);

                if (getComputedStyle(wrap).position === 'static') {
                    wrap.style.position = 'relative';
                }

                wrap.appendChild(searchPageCoverBlurMask);
                blurredCovers.add(wrap);
            });
        }

        // 移除所有模糊遮罩
        function removeAllBlurMasks() {
            const allMasks = document.querySelectorAll('.search-cover__mask');
            allMasks.forEach(mask => {
                const wrap = mask.parentElement;
                mask.remove();
                blurredCovers.delete(wrap);
                unblurredCovers.add(wrap);
            });
            //console.log('[Bilibili纯粹化] 已移除所有模糊遮罩');
        }

        // 创建确认对话框
        function showConfirmDialog(onConfirm, onCancel) {
            // 创建对话框容器
            const dialogOverlay = document.createElement('div');
            dialogOverlay.className = 'blur-toggle-dialog-overlay';
            // 添加内联样式确保居中显示
            dialogOverlay.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 10000 !important;';
        
            const dialogBox = document.createElement('div');
            dialogBox.className = 'blur-toggle-dialog';
            
            // 对话框内容
            const dialogContent = document.createElement('div');
            dialogContent.className = 'blur-toggle-dialog-content';
            
            const title = document.createElement('h3');
            title.className = 'blur-toggle-dialog-title';
            title.textContent = '关闭视觉防护后，你将直接看到所有封面。';
            
            const message = document.createElement('p');
            message.className = 'blur-toggle-dialog-message';
            message.textContent = '你此刻的观看意图是什么？';
            
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'blur-toggle-dialog-buttons';
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'blur-toggle-dialog-btn blur-toggle-dialog-btn-cancel';
            cancelBtn.textContent = '返回';
            
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'blur-toggle-dialog-btn blur-toggle-dialog-btn-confirm';
            confirmBtn.textContent = '我已确认';
            
            // 关闭对话框的函数
            const closeDialog = () => {
                dialogContent.remove();
                dialogOverlay.classList.add('closing');
                setTimeout(() => {
                    dialogOverlay.remove();
                }, 200);
            };
            
            // 按钮事件
            cancelBtn.addEventListener('click', () => {
                closeDialog();
                if (onCancel) onCancel();
            });
            
            confirmBtn.addEventListener('click', () => {
                closeDialog();
                if (onConfirm) onConfirm();
            });
            
            // 点击遮罩层关闭
            dialogOverlay.addEventListener('click', (e) => {
                if (e.target === dialogOverlay) {
                    closeDialog();
                    if (onCancel) onCancel();
                }
            });
            
            // 组装对话框
            buttonGroup.appendChild(cancelBtn);
            buttonGroup.appendChild(confirmBtn);
            dialogContent.appendChild(title);
            dialogContent.appendChild(message);
            dialogContent.appendChild(buttonGroup);
            dialogBox.appendChild(dialogContent);
            dialogOverlay.appendChild(dialogBox);
            
            // 添加到页面
            document.body.appendChild(dialogOverlay);
            
            // 触发动画
            requestAnimationFrame(() => {
                dialogOverlay.classList.add('show');
            });
        }

        // 创建封面模糊切换按钮
        function createBlurToggleButton() {
            // 查找导航栏
            const navBar = document.querySelector('.vui_tabs--nav.vui_tabs--nav-pl0');
            if (!navBar) {
                setTimeout(createBlurToggleButton, 500);
                return;
            }

            // 检查是否已经添加过按钮
            if (document.querySelector('.blur-toggle-container')) return;

            // 创建按钮容器
            const toggleContainer = document.createElement('li');
            toggleContainer.className = 'blur-toggle-container';
            
            const toggleButton = document.createElement('button');
            toggleButton.className = 'blur-toggle-button';
            toggleButton.setAttribute('aria-label', '封面模糊开关');
            
            const toggleInner = document.createElement('span');
            toggleInner.className = 'blur-toggle-inner';
            
            const toggleLabel = document.createElement('span');
            toggleLabel.className = 'blur-toggle-label';
            toggleLabel.textContent = '视觉防护';
            
            const toggleSwitch = document.createElement('span');
            toggleSwitch.className = 'blur-toggle-switch active';
            
            toggleInner.appendChild(toggleLabel);
            toggleInner.appendChild(toggleSwitch);
            toggleButton.appendChild(toggleInner);
            toggleContainer.appendChild(toggleButton);
            
            // 按钮点击事件
            toggleButton.addEventListener('click', () => {
                if (isCoversBLurred) {
                    // 当前是开启状态，点击后显示确认对话框
                    showConfirmDialog(
                        // 确认回调
                        () => {
                            isCoversBLurred = false;
                            toggleSwitch.classList.remove('active');
                            removeAllBlurMasks();
                            console.log('[Bilibili纯粹化] 视觉防护已关闭');
                        },
                        // 取消回调
                        () => {
                            // 保持开启状态，不做任何操作
                            console.log('[Bilibili纯粹化] 取消关闭视觉防护');
                        }
                    );
                } else {
                    // 当前是关闭状态，直接开启
                    isCoversBLurred = true;
                    toggleSwitch.classList.add('active');
                    // 清空已显示记录，允许重新添加遮罩
                    unblurredCovers.clear();
                    // 重新处理所有视频列表
                    const videoLists = document.querySelectorAll('.video-list');
                    videoLists.forEach(videoList => {
                        addBlurMask(videoList);
                    });
                    console.log('[Bilibili纯粹化] 视觉防护已开启');
                }
            });
            
            // 添加到导航栏末尾
            navBar.appendChild(toggleContainer);
            console.log('[Bilibili纯粹化] 封面模糊开关按钮已添加');
        }

        // 监听页面变化
        function setupObserver() {
            const observer = new MutationObserver(() => {
                const videoLists = document.querySelectorAll('.video-list');
                videoLists.forEach(videoList => {
                    hideAdVideos(videoList);
                    addBlurMask(videoList);
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            console.log('[Bilibili纯粹化] 搜索页功能已启用');
        }

        // 监听 pendingVideoAdded 事件，重新检查视频
        document.addEventListener('pendingVideoAdded', () => {
            pendingVideos.forEach(video => {
                // 如果未被检查过，进行检查流程
                if (!video.dataset.checked) {
                    //console.log(`[Bilibili纯粹化-调试] 视频【${video.querySelector('.bili-video-card__info--tit')?.textContent}】成功进入检查流程`)
                    video.dataset.checked = 'true'; // 设置标记已检查
                    const url = buildUrlForTags(video);
                    const keyword = currentSearchKeyword;
                    //console.log(`[Bilibili纯粹化-调试] 即将开始针对视频【${video.querySelector('.bili-video-card__info--tit')?.textContent}】的网络请求`)
                    const requestInstances = GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                        "Connection": "close",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0"
                        },
                        onload: function(response) {
                            //console.log(`[Bilibili纯粹化-调试] 视频【${video.querySelector('.bili-video-card__info--tit')?.textContent}】的网络请求成功`)
                            if (!video.isConnected) {
                                requestInstances.abort();
                                //console.log(`[Bilibili纯粹化-调试] 视频【${video.querySelector('.bili-video-card__info--tit')?.textContent}】被判定为废弃节点`)
                                console.log("[Bilibili纯粹化] 检测到废弃节点，已停止对应的请求。");
                                return;
                            }

                            const html = response.responseText;
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, "text/html");

                            const metaKeywords = doc.querySelector('meta[itemprop="keywords"]');
                            const metaTitle = doc.querySelector('meta[itemprop="name"]');
                            const descriptionElement = doc.querySelector('span.desc-info-text');
                            const authorDescriptionElement = doc.querySelector('.up-description.up-detail-bottom');

                            //console.log(`[Bilibili纯粹化-调试] 视频【${video.querySelector('.bili-video-card__info--tit')?.textContent}】的各项元素为【${metaKeywords}】【${metaTitle}】【${descriptionElement}】【${authorDescriptionElement}】`)

                            const keywordsText = metaKeywords ? normalizeText(metaKeywords.getAttribute("content")) : normalizeText(" ");
                            const titleText = metaTitle ? normalizeText(metaTitle.getAttribute("content")) : normalizeText(" ");
                            const descriptionText = descriptionElement ? normalizeText(descriptionElement.textContent) : normalizeText(" ");
                            const authorDescText = authorDescriptionElement ? normalizeText(authorDescriptionElement.getAttribute('title')) : normalizeText(" ");

                            const rawKeyword = currentSearchKeyword || keyword;
                            let tokens = smartTokenize(rawKeyword);

                            // 把原搜索词整体也作为一个 token
                            if (!tokens.includes(rawKeyword.trim())) {
                                tokens.unshift(rawKeyword.trim());
                            }

                            // 规范化 tokens
                            const normTokens = tokens
                                .map(t => normalizeText(t))
                                .filter(t => t.length > 0);


                            let matchTokenCount = 0;

                            //console.log(`[Bilibili纯粹化-调试] 即将检查视频【${video.querySelector('.bili-video-card__info--tit')?.textContent}】中的【${keywordsText}】【${titleText}】【${descriptionText}】【${authorDescText}】中是否含有【${normTokens}】`)

                            for (const token of normTokens) {
                                if (
                                    keywordsText.includes(token) ||
                                    titleText.includes(token) ||
                                    descriptionText.includes(token) ||
                                    authorDescText.includes(token)
                                ) {
                                    matchTokenCount++;
                                }
                            }

                            // 判断是否命中 
                            let keepVideo = false;

                            if (normTokens.length === 1) {
                                // 单一关键词:
                                keepVideo = matchTokenCount === 1;
                            } else {
                                // 多词：
                                keepVideo = matchTokenCount >= 1;
                            }

                            //console.log(`[Bilibili纯粹化-调试] 视频【${video.querySelector('.bili-video-card__info--tit')?.textContent}】，关键词命中【${matchTokenCount}】次`)

                            // 恢复视频 
                            if (keepVideo) {
                                video.style.display = '';
                                const title = video.querySelector('.bili-video-card__info--tit')?.textContent || '';
                                console.log(`[Bilibili纯粹化] 在视频【${title}】的标签/简介/作者简介中命中关键词，已恢复该视频显示`);
                            }
                        },
                        onerror: function(error) {
                            console.error('请求视频数据失败:', error);
                        },
                        onprogress: function(response) {
                            if(!video.isConnected){
                                requestInstances.abort();
                                console.log("[Bilibili纯粹化] 检测到废弃节点，已停止对应的请求。");
                            }
                        },
                        onreadystatechange: function(respons){
                            if(!video.isConnected){
                                requestInstances.abort();
                                console.log("[Bilibili纯粹化] 检测到废弃节点，已停止对应的请求。");
                            }
                        }
                        });
                    allRequestInstances.add(requestInstances);
                }
            });
        });

        // 监听url变动
        window.addEventListener(URL_CHANGE_EVENT, handleUrlChange);
        
        // 初始化
        function init() {
            const videoLists = document.querySelectorAll('.video-list');
            
            if (videoLists.length > 0) {
                videoLists.forEach(videoList => {
                    hideAdVideos(videoList);
                    addBlurMask(videoList);
                });
                setupObserver();
                createBlurToggleButton(); // 创建开关按钮
            } else {
                setTimeout(init, 500);
            }
        }
        
        init();
    }

    // 启用搜索页功能
    if (window.location.hostname === 'search.bilibili.com') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', removeSearchPageAdVideo);
        } else {
            removeSearchPageAdVideo();
        }
    }

})();