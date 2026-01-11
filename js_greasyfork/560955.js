// ==UserScript==
// @name         SupabaseClientTest
// @namespace    SupabaseClientTest
// @version      1.3
// @description  和所有人在线交流，安全匿名，无需账号，无需客户端，保护隐私，在线网页聊天室
// @match        https://*/*
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
// @downloadURL https://update.greasyfork.org/scripts/560955/SupabaseClientTest.user.js
// @updateURL https://update.greasyfork.org/scripts/560955/SupabaseClientTest.meta.js
// ==/UserScript==

/**
 * 在线网页聊天室 - 使用库引入方式
 * 本脚本是一个简单的入口文件，通过引入外部库来实现聊天室功能
 */

(async () => {
    'use strict';

    // 初始化UI
    const chatRoom = await ChatRoomLibrary.initUI();
    chatRoom.setTitle('在线网页聊天室');

    // 初始化
    const user_id = await SbCLi.init();
    GM_log('用户ID:', user_id);
    
    /*// 发送消息
    const res = await SbCLi.sendMessage({
        url: window.location.href,
        content: '你好，Supabase！',
        video_url: 'https://www.youtube.com/watch?v=123456',
        image_url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
    });
    console.log('发送消息的响应:', res);*/

    // 设置实时通信
    await SbCLi.setupRealtime(messageCallback, presenceCallback);

    function messageCallback(payload) {
        console.log('收到消息:', payload);
        // 添加消息卡片
        chatRoom.addMsgCard(payload);
    }

    function presenceCallback(onlineCount) {
        console.log('当前在线用户数:', onlineCount);
        // 更新在线人数
        chatRoom.updateOnlineCount(onlineCount);    
    }

    // 加载历史消息
    let hisdata = await SbCLi.loadHistory(50, 'all');
    if (hisdata) {
        hisdata.reverse().forEach(msg => { chatRoom.addMsgCard(msg) });
    }
    
})();
