// ==UserScript==
// @name         SupabaseClientTest
// @namespace    SupabaseClientTest
// @version      1.2
// @description  和所有人在线交流，安全匿名，无需账号，无需客户端，保护隐私，在线网页聊天室
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @connect      supabase.co
// @require      https://unpkg.com/@supabase/supabase-js@2.49.3/dist/umd/supabase.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @require      https://scriptcat.org/lib/5007/1.0.0/supabaseClientLibrary.js#sha256=6c8d52294e43c5f69f05b666f387328a540951d2d7adb80de68fa793fba567dd
// @require      https://scriptcat.org/lib/5008/1.0.0/chatRoomLibrary.js#sha256=bb9051b859303bec9d390d184ec8989f3f2728b2dd067205f358ff48cd1201fc
// @downloadURL https://update.greasyfork.org/scripts/560955/SupabaseClientTest.user.js
// @updateURL https://update.greasyfork.org/scripts/560955/SupabaseClientTest.meta.js
// ==/UserScript==

/**
 * 在线网页聊天室 - 使用库引入方式
 * 本脚本是一个简单的入口文件，通过引入外部库来实现聊天室功能
 */

(async () => {
    'use strict';
    console.log(`正在初始化...`);

    // 初始化UI
    const chatRoom = await ChatRoomLibrary.initUI();
    chatRoom.setTitle('在线匿名网页聊天室');
    
    // 初始化
    const user_id = await SbCLi.init();
    console.log('用户ID:', user_id);
    
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
    let hisdata = await SbCLi.loadHistory(20);
    if (hisdata) {
        hisdata.reverse().forEach(msg => { chatRoom.addMsgCard(msg) });
    }
    
})();
