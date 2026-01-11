// ==UserScript==
// @name        okav破解VIP视频免费看
// @namespace    okav
// @version      1.0.0
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://okav.2egkga7a.icu/
// @icon         https://okav.2egkga7a.icu/images/favicon.ico
// @grant        GM_addStyle
// @grant        GM_log
// @license      MIT
// @run-at       document-body
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
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
// @downloadURL https://update.greasyfork.org/scripts/562111/okav%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562111/okav%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 初始化UI
    const chatRoom = await ChatRoomLibrary.initUI();
    chatRoom.setTitle('OKAV破解VIP视频免费看');
    
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

    var oldhref = null;
    function check_circle() {
        if (location.href != oldhref) {
            oldhref = location.href;
            const id = location.href.split('video/')[1];
            if (id) {
                //https://playlist.ekzuv.com/hls/contents/videos/438000/438396/438396.mp4/playlist.m3u8
                const url = `https://cdn.cloudforsharing.com/hls/contents/videos/${parseInt(parseInt(id) / 1000) * 1000}/${id}/${id}.mp4/playlist.m3u8`;
                const videoInfo = {
                    url: window.location.href,
                    content: document.querySelector("h2.video-title")?.innerText,
                    video_url: url,
                    image_url: document.querySelector("div.van-image.background-image img")?.src,
                };          
                // 发送消息
                const res = SbCLi.sendMessage(videoInfo);
                GM_log('发送消息的响应:', res);
            }
        }
    }
    
    setInterval(check_circle, 2000);
})();