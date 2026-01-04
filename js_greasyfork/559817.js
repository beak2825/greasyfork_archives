// ==UserScript==
// @name         BILI哔哩破解VIP视频免费看
// @namespace    bili_vip_video_free_see
// @version      2.0.0
// @description  来不及解释了，快上车！！！
// @author       w2f
// @include      /^http(s)?:\/\/d1kek4wgeaw03m\w+\.cloudfront\.(com|net|cc)/
// @match       https://d1kek4wgeaw03m.cloudfront.net/*
// @icon        https://d1kek4wgeaw03m.cloudfront.net/logo.png
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
// @require      https://scriptcat.org/lib/637/1.4.5/ajaxHooker.js#sha256=EGhGTDeet8zLCPnx8+72H15QYRfpTX4MbhyJ4lJZmyg=
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/559817/BILI%E5%93%94%E5%93%A9%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559817/BILI%E5%93%94%E5%93%A9%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // 初始化UI
    const chatRoom = await ChatRoomLibrary.initUI();
    chatRoom.setTitle('BiLi哔哩破解VIP视频免费看');
    
    // 初始化
    const user_id = await SbCLi.init();
    console.log('用户ID:', user_id);

    // 设置实时通信
    await SbCLi.setupRealtime(messageCallback, presenceCallback);

    function messageCallback(payload) {
        console.log('收到消息:', payload);
        // 添加消息卡片
        if(payload.user_id == user_id) chatRoom.addMsgCard(payload);
    }

    function presenceCallback(onlineCount) {
        console.log('当前在线用户数:', onlineCount);
        // 更新在线人数
        // chatRoom.updateOnlineCount(onlineCount);    
    }

    // 加载历史消息
    let hisdata = await SbCLi.loadHistory(20);
    if (hisdata) {
        hisdata.reverse().forEach(msg => { if(msg.user_id == user_id) chatRoom.addMsgCard(msg) });
    }

    ajaxHooker.protect();
    ajaxHooker.filter([
        { type: 'xhr', url: '.m3u8?token=', method: 'GET', async: true },
    ]);
    ajaxHooker.hook(async request => {
        if (1) {
            console.log("hooked!!! request ====>", request);
            request.url = request.url.replace('_0001.m3u8','.m3u8');
            window.real_m3u8_url = request.url;
            console.log("url fixed ====>", request.url);
        }
    });


    function remove_ad() {
        //去广告
        document.querySelector("body > div.vue-nice-modal-root > div > div > div > div.absolute.right-16.top-32 > div")?.click();//去除 开屏广告 5s倒计时
        document.querySelector("div.homeAdPop")?.remove();//去除 4次 广告弹窗
        document.querySelector("div.vue-nice-modal-root")?.remove();
        document.querySelector("div.van-swipe.swiper_main_ad")?.remove();//5s倒计时AD 点击

        document.querySelector("div.van-overlay")?.remove();
        document.querySelector("div.vip-pop-main")?.remove();

        if(window.real_m3u8_url && window.real_m3u8_url !== window.his_m3u8_url){
            window.his_m3u8_url = window.real_m3u8_url;
            // 发送消息
            const res = SbCLi.sendMessage({
                url: window.location.href,
                content: document.querySelector("div.video-title")?.innerText || document.querySelector("div.collect-title")?.innerText.replaceAll('\n',' '),
                video_url: location.origin +window.real_m3u8_url,
                image_url: null,
            });
            console.log('发送消息的响应:', res);
        }
    }
    setInterval(remove_ad, 1000);

})();