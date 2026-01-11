// ==UserScript==
// @name         汤头条破解VIP视频免费看🥣
// @namespace    tangtoutiao_vip_video_free_see
// @version      2.0.0
// @description  来不及解释了，快上车！！！
// @author       w2f
// @match        https://p1.xpyortno.cc/*
// @match        https://p2.xpyortno.cc/*
// @match        https://p3.xpyortno.cc/*
// @match        https://p2.xpyortno.cc/*
// @match        https://p5.xpyortno.cc/*
// @include      /^http(s)?:\/\/p\w+\.xpyortno\.(com|net|cc)/
// @icon         https://p2.xpyortno.cc/favicon.ico
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
// @downloadURL https://update.greasyfork.org/scripts/559718/%E6%B1%A4%E5%A4%B4%E6%9D%A1%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%F0%9F%A5%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/559718/%E6%B1%A4%E5%A4%B4%E6%9D%A1%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%F0%9F%A5%A3.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // 初始化UI
    const chatRoom = await ChatRoomLibrary.initUI();
    chatRoom.setTitle('汤头条破解VIP视频免费看');

    // 初始化
    const user_id = await SbCLi.init();
    GM_log('用户ID:', user_id);

    // 加载历史消息
    let hisdata = await SbCLi.loadHistory(10);
    if (hisdata) {
        hisdata.reverse().forEach(msg => {
            interceptedRequests.push(msg.video_url); //防止加载历史视频时被拦截导致再次发送
            chatRoom.addMsgCard(msg);
        });
    }

    // 调试开关
    const DEBUG = true;

    // 存储拦截的请求
    let interceptedRequests = [];

    // 拦截媒体资源请求（media类型）
    function interceptMediaRequests() {
        try {
            // 监控DOM中媒体元素的创建和变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 处理新添加的节点
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // 元素节点
                            // 检查是否是媒体元素
                            if (node.tagName === 'VIDEO' || node.tagName === 'AUDIO') {
                                processMediaElement(node);
                            }
                            // 检查子元素中的媒体元素
                            node.querySelectorAll('video, audio').forEach(processMediaElement);
                        }
                    });

                    // 处理属性变化
                    if (mutation.type === 'attributes' && mutation.target.tagName) {
                        const tagName = mutation.target.tagName.toLowerCase();
                        if ((tagName === 'video' || tagName === 'audio') && mutation.attributeName === 'src') {
                            processMediaElement(mutation.target);
                        }
                    }
                });
            });

            // 配置观察者
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src']
            });

            // 处理现有媒体元素
            document.querySelectorAll('video, audio').forEach(processMediaElement);

            // 拦截HTMLMediaElement的src和srcObject属性
            const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src').set;
            Object.defineProperty(HTMLMediaElement.prototype, 'src', {
                set: function (value) {
                    if (value && value.includes('.m3u8')) {
                        logMediaRequest(value);
                    }
                    return originalSetSrc.call(this, value);
                }
            });

            if (DEBUG) {
                GM_log('[m3u8拦截器] 媒体请求拦截器已安装');
            }
        } catch (e) {
            GM_log('[m3u8拦截器] 安装媒体请求拦截器失败: ' + e.message);
        }
    }

    function fix_m3u8url(m3u8url) {
        let url = new URL(m3u8url);
        let seg = url.host.split('.');
        seg[0] = 'long';
        url.host = seg.join('.');
        GM_log('url fixed ====> ' + url.href);
        return url.href;
    }

    // 处理媒体元素
    function processMediaElement(element) {
        try {
            // 检查src属性
            if (element.src && element.src.includes('.m3u8')) {
                if (!element.src.startsWith('https://long')) element.src = fix_m3u8url(element.src);
                logMediaRequest(element.src, element.tagName.toLowerCase());
            }

            // 监听loadstart事件，捕获动态设置的媒体源
            element.addEventListener('loadstart', (e) => {
                const target = e.target;
                if (target.currentSrc && target.currentSrc.includes('.m3u8')) {
                    //if (!target.currentSrc.startsWith('https://long')) target.currentSrc = fix_m3u8url(target.currentSrc);
                    //logMediaRequest(target.currentSrc, target.tagName.toLowerCase()+'loadstart');
                }
            });
        } catch (e) {
            GM_log('[m3u8拦截器] 处理媒体元素失败: ' + e.message);
        }
    }

    // 记录媒体请求
    function logMediaRequest(url, mediaType = 'no-media-type') {
        try {
            if (0) {
                GM_log(`[m3u8拦截器] 拦截到${mediaType}媒体请求: ${url}`);
            }

            // 避免重复记录相同URL的请求
            const isDuplicate = interceptedRequests.some(item => item === url);
            if (!isDuplicate && url.startsWith('https://long')) {
                interceptedRequests.push(url);
                const videoInfo = {
                    url: window.location.href,
                    content: document.querySelector("div.swiper-slide-active h2")?.innerText || document.querySelector("div.info-top p.info-title")?.innerText,
                    video_url: url,
                    image_url: null,
                };
                // 加载卡片
                chatRoom.addMsgCard(videoInfo);
                // 发送消息
                const res = SbCLi.sendMessage(videoInfo);
                GM_log('发送消息的响应:', res);
            }
        } catch (e) {
            GM_log('[m3u8拦截器] 记录媒体请求失败: ' + e.message);
        }
    }

    // 初始化
    interceptMediaRequests();

    function remove_ad() {
        //微密圈去广告
        document.querySelector("welcome-ad")?.remove();//去除 开屏广告 5s倒计时
        document.querySelector("div.active-dialog")?.remove();//去除 4次 广告弹窗
        document.querySelector("div.van-overlay")?.remove();//去除 遮罩
        document.querySelector("div.shadow-lg")?.remove();//去除 汤头条app内打开
        document.querySelector("div.preview-tip")?.remove();
        //document.querySelector("div.notice-header-02")?.click();
        //let ad = document.querySelector("div.notice_scaleLayer");
        //if (ad) ad.style.display = 'none';//去除 应用中心 弹窗
        //短视频去广告
        document.querySelector("div.dx-mask")?.remove();//热点
        let previewTip = document.querySelector("div.preview-tip");
        if (previewTip) previewTip.innerText = previewTip.innerText.replace('开通VIP', '已');
    }
    setInterval(remove_ad, 1000);

})();