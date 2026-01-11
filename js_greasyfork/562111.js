// ==UserScript==
// @name        okav破解VIP视频免费看
// @namespace    okav
// @version      1.0.2
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://okav.2egkga7a.icu/
// @icon         https://okav.2egkga7a.icu/images/favicon.ico
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
    GM_log('用户ID:', user_id);

    // 加载历史消息
    let hisdata = await SbCLi.loadHistory(10);
    if (hisdata) {
        hisdata.reverse().forEach(msg => { chatRoom.addMsgCard(msg) });
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
                // 加载卡片
                chatRoom.addMsgCard(videoInfo);
                // 发送消息
                const res = SbCLi.sendMessage(videoInfo);
                GM_log('发送消息的响应:', res);
            }
        }
    }

    setInterval(check_circle, 2000);
})();