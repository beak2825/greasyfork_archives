// ==UserScript==
// @name         萝莉窝破解VIP视频免费看
// @namespace    luoliwo_vip_video_free_see
// @version      1.2
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://daga88n.com/*
// @include      /^http(s)?:\/\/daga88n\d+\.(com|xyz)/
// @icon         https://daga88n.com/favicon.ico
// @license      MIT
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @connect      supabase.co
// @require      https://unpkg.com/@supabase/supabase-js@2.49.3/dist/umd/supabase.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @require      https://scriptcat.org/lib/5007/1.0.1/supabaseClientLibrary.js#sha384=An/EKSp9xaz4YGHGLWUZYfW1950+SEeQhsmfjbbAfh8GOY8dHA7ZMuwEhnEq4gVJ
// @require      https://scriptcat.org/lib/5008/1.0.3/chatRoomLibrary.js#sha384=Rot5TRczD6A15DdM28xrwncuNdle1gd2ChGSanpvMRNQZiF62lgbqhdVI9bRYOMz
// @downloadURL https://update.greasyfork.org/scripts/547842/%E8%90%9D%E8%8E%89%E7%AA%9D%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547842/%E8%90%9D%E8%8E%89%E7%AA%9D%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 初始化UI
    const chatRoom = await ChatRoomLibrary.initUI();
    chatRoom.setTitle('萝莉喔破解VIP视频免费看');

    // 初始化
    const user_id = await SbCLi.init();
    GM_log('用户ID:', user_id);

    // 加载历史消息
    let hisdata = await SbCLi.loadHistory(10);
    if (hisdata) {
        hisdata.reverse().forEach(msg => { chatRoom.addMsgCard(msg) });
    }

    function check_circle() {

        const el = document.querySelector('.video-before-ad.noVip') || document.querySelector('.img-bg.openVip');
        const bgUrl = el?.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)[1];
        //console.log('🎯 背景图链接:', bgUrl);
        window.m3u8_url = bgUrl?.replace('1.jpg', 'index.m3u8');

        if (window.m3u8_url) {
            const videoInfo = {
                url: window.location.href,
                content: document.title,
                video_url: window.m3u8_url,
                image_url: bgUrl,
            };
            // 加载卡片
            chatRoom.addMsgCard(videoInfo);
            // 发送消息
            const res = SbCLi.sendMessage(videoInfo);
            GM_log('发送消息的响应:', res);

            clearInterval(my_timer);
        }
    }

    let my_timer = setInterval(check_circle, 2000);
})();