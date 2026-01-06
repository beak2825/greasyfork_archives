// ==UserScript==
// @name         麻豆破解VIP视频免费看
// @namespace    madou_vip_video_free_see
// @version      2.0.0
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://d3df6hjcjf7ng5.cloudfront.net/*
// @include      /^http(s)?:\/\/d3df6hjcjf7ng\w+\.cloudfront\.(com|net|cc)/
// @icon         https://d34vyrelvmcjzt.cloudfront.net/logo.png
// @license      MIT
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      supabase.co
// @require      https://unpkg.com/@supabase/supabase-js@2.49.3/dist/umd/supabase.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @require      https://scriptcat.org/lib/5007/1.0.0/supabaseClientLibrary.js#sha256=6c8d52294e43c5f69f05b666f387328a540951d2d7adb80de68fa793fba567dd
// @require      https://scriptcat.org/lib/5008/1.0.0/chatRoomLibrary.js#sha256=bb9051b859303bec9d390d184ec8989f3f2728b2dd067205f358ff48cd1201fc
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/561506/%E9%BA%BB%E8%B1%86%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561506/%E9%BA%BB%E8%B1%86%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // 初始化UI
    const chatRoom = await ChatRoomLibrary.initUI();
    chatRoom.setTitle('麻豆破解VIP视频免费看');

    // 初始化
    const user_id = await SbCLi.init();
    console.log('用户ID:', user_id);

    // 设置实时通信
    await SbCLi.setupRealtime(messageCallback, presenceCallback);

    function messageCallback(payload) {
        console.log('收到消息:', payload);
        // 添加消息卡片
        if (payload.user_id == user_id) chatRoom.addMsgCard(payload);
    }

    function presenceCallback(onlineCount) {
        console.log('当前在线用户数:', onlineCount);
        // 更新在线人数
        // chatRoom.updateOnlineCount(onlineCount);
    }

    // 加载历史消息
    let hisdata = await SbCLi.loadHistory(20);
    if (hisdata) {
        hisdata.reverse().forEach(msg => { if (msg.user_id == user_id) chatRoom.addMsgCard(msg) });
    }

    // json劫持
    var my_parse = JSON.parse;//解析 JSON 字符串
    JSON.parse = function (params) {
        //这里可以添加其他逻辑比如 debugger
        let json_obj = my_parse(params);

        if (json_obj?.mediaInfo) {
            console.log("[tools]🚧劫持json:", json_obj);
            window.mediaInfo = {
                url: window.location.href,
                //id: json_obj.mediaInfo.id,
                content: json_obj.mediaInfo.desc,
                video_url: location.origin + '/api/app/media/m3u8ex/' + json_obj.mediaInfo.videoUrl + '?token=' + localStorage.getItem('token'),
                image_url: null,
            };
        }
        return json_obj;
    };


    function remove_ad() {
        document.querySelector("div.launchSwiperContent > button")?.click();
        document.querySelector("div.close_btn > i")?.click();
        document.querySelector("div.md-play-box > div > div.wh-full")?.click();
        document.querySelector("div.popAD")?.remove();
        document.querySelector("div.van-overlay")?.remove();
        document.querySelector("img.close")?.click();
        document.querySelector("div.PayPop")?.remove();
        document.querySelector("div.justify-center div")?.click();
        //document.querySelector("div.swiper_main_ad")?.nextSibling?.click();

        if (window.mediaInfo && window.mediaInfo.video_url !== window.his_m3u8_url) {
            window.his_m3u8_url = window.mediaInfo.video_url;
            // 发送消息
            const res = SbCLi.sendMessage(window.mediaInfo);
            console.log('发送消息的响应:', res);
        }
    }
    setInterval(remove_ad, 1000);

})();