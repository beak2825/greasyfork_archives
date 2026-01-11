// ==UserScript==
// @name         麻豆破解VIP视频免费看
// @namespace    madou_vip_video_free_see
// @version      2.0.1
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://d3df6hjcjf7ng5.cloudfront.net/*
// @include      /^http(s)?:\/\/d3df6hjcjf7ng\w+\.cloudfront\.(com|net|cc)/
// @icon         https://d34vyrelvmcjzt.cloudfront.net/logo.png
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
    GM_log('用户ID:', user_id);

    // 加载历史消息
    let hisdata = await SbCLi.loadHistory(10);
    if (hisdata) {
        hisdata.reverse().forEach(msg => { chatRoom.addMsgCard(msg) });
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
            // 加载卡片
            chatRoom.addMsgCard(window.mediaInfo);
            // 发送消息
            const res = SbCLi.sendMessage(window.mediaInfo);
            console.log('发送消息的响应:', res);
        }
    }
    setInterval(remove_ad, 1000);

})();