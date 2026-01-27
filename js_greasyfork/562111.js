// ==UserScript==
// @name        okav破解VIP视频免费看
// @namespace    okav
// @version      1.0.5
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
// @require      https://scriptcat.org/lib/5007/1.0.4/supabaseClientLibrary.js#sha384=UVgc6octvKJ1F7mziyZvq8As2JOFlBP67kH/AOywBSXFrlKuyXMJCViIiNfbAjgu
// @require      https://scriptcat.org/lib/5008/1.0.6/chatRoomLibrary.js#sha384=K75aUnIAOk8+4AgNJhFH/4Z5ouseZgL0DZxQjyMkXf8+ZLZdI2dsPWsQBEbwSptw
// @downloadURL https://update.greasyfork.org/scripts/562111/okav%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562111/okav%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // 初始化
    await SbCLi.init('okav');
    const chatRoom = await ChatRoomLibrary.initUI();

    var oldhref = null;
    var retrynum = 0; 
    function check_circle() {
        if (location.href != oldhref) {
            // 开始新一轮检查
            retrynum++;
            if (retrynum > 10) {
                retrynum = 0;
                oldhref = location.href;
                const videoInfo = { content: '📢 检测到长时间未破解成功，请刷新后重试，或者先访问其他可用资源！' };
                chatRoom.addMsgCard(videoInfo);// todo: tips消息类型
                SbCLi.sendMessage(videoInfo);
                return;
            }

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
                if (!videoInfo.content || !videoInfo.image_url) {
                    GM_log('等待图片src加载完毕...');
                    return;
                }
                retrynum = 0;
                oldhref = location.href;
                // 加载卡片，发送消息
                if (SbCLi.decreaseTrialCount() > 0){
                    chatRoom.addMsgCard(videoInfo);
                }
                else{
                    chatRoom.addMsgCard({ content: '设备未激活，今日试看次数已用完！' });
                }
                const res = SbCLi.sendMessage(videoInfo);
                GM_log('发送消息的响应:', res);
            }
        }
    }

    setInterval(check_circle, 2000);
})();