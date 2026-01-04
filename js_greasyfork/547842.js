// ==UserScript==
// @name         快猫/含羞草/麻豆TV/艾薇社区/AvPron/9sex/小狐狸/91pron/91吃鸡破解VIP视频免费看
// @name:zh-TW   快貓/含羞草/麻荳TV/艾薇社区/AvPron/9sex/小狐貍/91pron/91喫鷄破解VIP眎頻免費看
// @namespace    18x_vip_video_free_see
// @version      0.56
// @description  来不及解释了，快上车！！！
// @description:zh-TW  來不及解釋了，快上車！！！
// @author       w2f

// @include      /^https://(www|h5).kmkk\d+\.com/videoContent/.*?$/

// @include      /^https://www.hx\w+\.com.+$/

// @match        https://www.fi11aa81.com/play/video/*
// @match        https://*/play/video/*
// @match        https://*/smallVideo/*
// @include      /^http(s)?:\/\/(www|h5)\.fi11\w+\.com\/play\/video/
// @include      /^http(s)?:\/\/(www|h5)\.\w+\.(com|cn|xyz)\/play\/video/
// @include      /^http(s)?:\/\/(www|h5)\.fi11\w+\.(com|cn|xyz)\/smallVideo\/.*?/

// @麻豆tv        https://d2s51b8ht.com/ err https://hmxxrzi.xyz/new  ok  @91TV https://kdt29.com/ err
// @match        https://madou.bet/*
// @match        https://*/index*
// @match        https://*/new*
// @match        https://*/channel/videoList*
// @match        https://*/tags*
// @match        https://*/rankList*
// @match        https://madou.tv/*

// @match        https://afkv28.com/*
// @match        https://afkv29.com/*
// @match        https://afkv30.com/*

// @match        https://*/videos/*

// @match        https://9sex.com/index/movie/play/id/*.html
// @match        https://*/index/movie/play/id/*
// @match        http://*/index/movie/play/id/*
// @include      /^http(s)?:\/\/(www|h5)\.\w+\.xyz\/movie\/play\/id/

// @ 猫咪
// @match        https://*/vip/index.html
// @match        https://*/vip/list-*.html
// @match        https://*/index/home.html
// @include      /https:\/\/www\.(\w+)\.com\/page\/vip/

// @include      /^http(s)?:\/\/(.*)\.xyz\/(pc|h5)\/index\.html/

// @match       https://alltv268.com/*
// @include      /^https://alltv\w+\.com.*$/

// @icon         https://sy3wmh.xyz/pc/favicon.ico
// @license      MIT
// @grant        none
// @require      https://scriptcat.org/lib/637/1.4.5/ajaxHooker.js#sha256=EGhGTDeet8zLCPnx8+72H15QYRfpTX4MbhyJ4lJZmyg=
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/456496/%E5%BF%AB%E7%8C%AB%E5%90%AB%E7%BE%9E%E8%8D%89%E9%BA%BB%E8%B1%86TV%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BAAvPron9sex%E5%B0%8F%E7%8B%90%E7%8B%B891pron91%E5%90%83%E9%B8%A1%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/456496/%E5%BF%AB%E7%8C%AB%E5%90%AB%E7%BE%9E%E8%8D%89%E9%BA%BB%E8%B1%86TV%E8%89%BE%E8%96%87%E7%A4%BE%E5%8C%BAAvPron9sex%E5%B0%8F%E7%8B%90%E7%8B%B891pron91%E5%90%83%E9%B8%A1%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* none 如果不使用 unsafeWindow ，快猫手机端，含羞草pc端会播放失败，原因未知。
    原因：通过 @require 加载的hls提示找不到，通过import_js导入ok */
    let err_cnt = 0;

    function import_js(src) {
        let script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }
    import_js("https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js");
    import_js("https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js");
    let not_need_dplayer = location.href.match("https://theav.*?.com/videos/") != null  //avporn
         || location.href.match("https://the.*?.fun/videos/") != null; //
        // || location.href.match("/play/video/") != null;//含羞草不再需要加载dplayer

    if (!not_need_dplayer) {
        import_js("https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.26.0/DPlayer.min.js");
    }


    ajaxHooker.protect();
    ajaxHooker.filter([
        //{type: 'xhr', url: '/videos/getPreUrl', method: 'POST', async: true},//含羞草预览
        {type: 'xhr', url: '/videos/getInfo', method: 'POST', async: true},//含羞草真实请求 https://ap638.daoshaort.com/videos/getInfo
        //https://a5p3.95agri.com/videos/getInfo
        //https://a5p3.95agri.com/videos/getList
        //https://a5p3.95agri.com/base/getConfigPub
        //https://a8n9.i4x2.com/analyse/online
    ]);
    ajaxHooker.hook(request => {
        if (request.url.indexOf('/videos/getInfo') > -1 ) {
            console.log("hooked!!! request ====>",request);
            //request.url = "https://a5p3.95agri.com/videos/v2/getUrl"; //限免api //rsp: {"code": 2002,"msg": "无权限获取","data": {},"traceId": "MLuEda"}
            //request.url = "https://api.qianyuewenhua.xyz/videos/getPreUrl";//含羞草预览api
            request.url = "https://a5p3.95agri.com/videos/getPreUrl";//含羞草预览api
            request.response = async res => {
                console.log("hooked!!! responseText ====>",JSON.parse(res.responseText));
                res.responseText = await modifyResponse(res.responseText);
            };
        }
    });

    async function modifyResponse(responseText){
        let rspjson = await JSON.parse(responseText);
        window.xxxadrfgaddsasd = rspjson.data.url.replace(/start=\d+\&end=\d+\&/,"start=0&end=9999&");
        //rspjson.data.url = realurl;
        console.log("fixed url====>",window.xxxadrfgaddsasd);
        //getPreUrl : {"code":0,"msg":"","data":{"id":55159,"url":"https://t189.ntgdct.com/20240812/KWkC44Jj/index.m3u8?start=600&end=630&sign=XXX&rSign=YYY"},"traceId":"b0GJvO"}
        //2025年12月10日： https://t01e.frist-art.com/play/m3u8/vc/23819/v_23819_nc4W.m3u8?start=900&end=930&sign=XXX&rSign=YYY
        //localStorage.setItem("real_video_url", rspjson.data.url);
        //if(window.navigator.appVersion.includes("Windows")){
        //    return await JSON.stringify(rspjson);
        //}
        let orirsp = {"code":0,"msg":"","data":{
            "canDownload":true,"canPlay":false,"canPrePlay":true,"discount":70,"discountPoint":0,"downloadPoint":2,
                                                "info":{"id":55159,"coverImgUrl":"",
                                                        "coverImgUrlVertical":"",
                                                        "name":"",
                                                        "addTime":"2024-08-17 19:25:31","uid":0,"length":782,"point":0,"isVip":1,"videoSort":1,"angleType":0,"disabled":0,"status":1,
                                                        "transcodingStatus":0,"preTranscodingStatus":0,"isTemporarilyFree":0,"isSetPre":0,"recommend":"","isCollect":0,"isLike":0,
                                                        "isBuy":0,"isAngle":11,"isSee":0,"isDownload":0,"isNeedLogin":1,"no":"1XGC4509XSF",
                                                        "tags":"身材,颜值,美女,性感,居家.","typeId":5,"isFeatured":0,"isVertical":0,"url":"",
                                                        "preUrl":"","urlId":0,"auditReason":"","description":"","width":0,"height":0,"release_type":0,"typeName":"自拍","typeParentId":4,
                                                        "buyCount":0,"collectionCount":2735,"hot":20736,"likeCount":3376,"seeCount":15591,"commentCount":0,
                                                        "userInfo":{"id":0,"avatar":"","avatar_thumb":"","user_nicename":"","sex":0,"newsVip":0,"coverImg":"","pcCoverImg":"",
                                                                    "isattention":0,"fans":0,"offset":0,"isUpdate":0}}},
                      "traceId":"Q57ad6"};
        return await JSON.stringify(orirsp);//如果不改回去，手机端缺少部分字段会报错，界面异常； PC可以不加；
    }

    let today = new Date().toLocaleDateString();
    let min = new Date().getMinutes();
    let chat = `脚本免费，更新维护不易，若脚本有帮助到你，请随缘打赏⚡，感谢支持！`;
    function show_support_author(msg = chat, secondsLeft = 5) {
        //var secondsLeft = 5;
        var mydiv = document.createElement('div');
        mydiv.innerHTML = `<div id="my_add_div_support_author" style="position: fixed;z-index: 10000;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.8);">
            <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);max-width: 90%;max-height: 90%;">
            <p style="color:red;font-size:14px">${msg}</p>
            </div></div>`;
        document.querySelector("head").after(mydiv);
        //navigator.clipboard.writeText(mydiv.innerText);//复制到剪贴板
        //console.log("以下报错信息已复制到剪贴板：",mydiv.innerText);
        if(secondsLeft == 0) return;
        var interval = setInterval(function() {
            secondsLeft--;
            var xxx = document.querySelector("#my_add_div_support_author p");if(xxx) xxx.innerText = `${msg}（${secondsLeft}s后自动关闭)`;
            if (secondsLeft <= 0) {
                var yyy = document.querySelector("#my_add_div_support_author"); if(yyy) yyy.parentNode.removeChild(yyy);
                clearInterval(interval);
            }
        }, 1000);
    }

    /* 函数功能：显示视频地址，及提示信息. 参数说明：videoUrl：视频地址  dizhi: 地址显示位置  flag:是否强制刷新 */
    function show_videoUrl(videoUrl,dizhi, flag = 0) {
        var xxx = document.querySelector("#my_add_dizhi");
        if(flag==0 && xxx){
            return 0;
        }
        if (xxx) xxx.parentNode.removeChild(xxx);
        var mydiv = document.createElement('div');
        mydiv.innerHTML = `<div id="my_add_dizhi" style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">
            <p style="">视频地址：<a href="${videoUrl}" target="_blank">✅点此访问</a></p>
            <p style="">问题反馈 or 支持作者请<a href="https://greasyfork.org/zh-CN/scripts/456496" target="_blank">【点击此处】</a>，使用愉快！</p>
            </div>`;
        dizhi?.after(mydiv);
        return 1;
    }

    /* 函数功能：加载Dplayer播放视频。 参数说明：videoUrl：视频地址 el：播放器加载位置 dizhi: 地址显示位置  flag:是否强制刷新 */
    function play_video(videoUrl, el, dizhi, flag = 0) {

        if (!videoUrl || !el || !dizhi) throw new Error(`部分参数无效，视频地址：${videoUrl}、播放器位置：${el}、提示位置：${dizhi}`);

        let ret = show_videoUrl(videoUrl,dizhi,flag);
        if(ret == 0){
            return 0;
        }

        if (window.dp) {
            window.dp.pause()
            window.dp.destroy()
            window.dp = null;
        }

        /* 2. 新增播放器 */
        window.dp = new DPlayer({
            element: el,
            autoplay: true,
            theme: '#FADFA3',
            loop: true,
            lang: 'zh',
            screenshot: true,
            hotkey: true,
            preload: 'auto',
            video: {
                url: videoUrl,
                type: 'hls'
            }
        });

        /* 3. 设置播放器浮动显示,并添加一个具有上边距的兄弟div避免覆盖下面的内容 */
        //el.classList.add("my_add_header");
        //el.style += "z-index: 999;top: 0;";
        el.style.position = 'sticky';
        el.style.zIndex = '999';
        el.style.top = '0';
        var xxx = document.querySelector("#my_add_sibling");
        if(!xxx){
            var sibling = document.createElement('div');
            sibling.id = "my_add_sibling";
            //sibling.style.marginTop = el.offsetHeight + 'px'; // 设置兄弟元素的顶部边距
            el.after(sibling);
        }
    }

    /* 函数功能：同上，可切换清晰度  */
    function play_video2(videoUrl, videoUrl2, videoUrl3, videoUrl4, el, dizhi) {
        /* 1. 显示地址 */
        var mydiv = document.createElement('div');
        mydiv.innerHTML = `<div id="my_add_dizhi" style="color:red;font-size:14px">注意：部分视频只360P，切换后无法播放说明不存在高清晰度版本！！！视频地址：
        <p style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">360P：<a href="${videoUrl}" target="_blank">${videoUrl}</a></p>
        <p style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">480P：<a href="${videoUrl2}" target="_blank">${videoUrl2}</a></p>
        <p style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">720P：<a href="${videoUrl3}" target="_blank">${videoUrl3}</a></p>
        <p style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">1080P：<a href="${videoUrl4}" target="_blank">${videoUrl4}</a></p>
        <p style="color:red;font-size:14px">问题反馈 or 支持作者请<a href="https://sleazyfork.org/zh-CN/scripts/456496" target="_blank">【点击此处】</a>，使用愉快！</p>
        </div>`;
        dizhi && dizhi.after(mydiv);

        /* 2. 新增播放器 */
        window.dp = new DPlayer({
            element: el,
            autoplay: true,
            theme: '#FADFA3',
            loop: true,
            lang: 'zh',
            screenshot: true,
            hotkey: true,
            preload: 'auto',
            video: {
                quality: [
                    {
                        name: '360P',
                        url: videoUrl,
                        type: 'hls',
                    },
                    {
                        name: '480P',
                        url: videoUrl2,
                        type: 'hls',
                    },
                    {
                        name: '720P',
                        url: videoUrl3,
                        type: 'hls',
                    },
                    {
                        name: '1080P',
                        url: videoUrl4,
                        type: 'hls',
                    },
                ],
                defaultQuality: 0,
            }
        });
    }

    /* 函数功能：在界面上显示程序错误，便于分析  */
    function show_err_log(err) {
        err && console.log(err);
        err_cnt++;
        if (err_cnt == 5) {
            //err_cnt = 0;
            var mydiv = document.createElement('div');
            //mydiv.innerHTML =
            let msg = `解析出错，复制以下内容到脚本评论区等候作者处理!
            当前地址：${location.href}
            错误信息：${err || "尝试多次仍然未获取到地址,可能是网站已更新..."}
            操作系统：${navigator.platform}
            浏览器：${navigator.userAgent}`;
            console.log(msg);
            //show_support_author(msg,0);
            //document.querySelector("head").after(mydiv);
            clearInterval(my_timer);
        }
    }

    function do_login(){
        let phone = JSON.parse(localStorage.getItem('move-client-user-info'))?.user?.user_info?.phone;
        let event = document.createEvent('HTMLEvents');
            event.initEvent("input", true, true);
        if(phone){
            /* 自动登录 */
            let account = document.querySelectorAll('input.van-field__control')[0];
            account.value = phone;
            account.dispatchEvent(event);
            let password = document.querySelectorAll('input.van-field__control')[1];
            password.value = "123456";
            password.dispatchEvent(event);
            document.querySelector('button[type=submit]').click();
        }else{
            /* 自动注册 */
            document.querySelector('div.login_1_2_1')?.click();
            let account = document.querySelectorAll('input.van-field__control')[0];
            account.value = ["130", "131", "132", "133", "135", "137", "138", "170", "187", "189"][ Math.floor(10 * Math.random())] + Math.floor(Math.random() * 100000000);
            account.dispatchEvent(event);
            let password = document.querySelectorAll('input.van-field__control')[1];
            password.value = "123456";
            password.dispatchEvent(event);
            let password2 = document.querySelectorAll('input.van-field__control')[2];
            password2.value = "123456";
            password2.dispatchEvent(event);
            document.querySelector('button[type=submit]').click();
        }
    }

    let flag = 0;
    let last_videoUrl = null;
    function get_videourl() {
        let videoUrl = null, videoUrl2 = null, videoUrl3 = null, videoUrl4 = null;
        let el = null;
        let dizhi = null;
        let player = null;
        let shikan = null;
        let ads = null;
        try {
            if (!not_need_dplayer && typeof(DPlayer)!= 'function' ) {
                /* DPlayer还未加载完毕时就解析完视频地址，会导致播放时报错ReferenceError: DPlayer is not defined */
                console.log("正在加载DPlayer...");
                return;
            }
            /* 猫咪vip */
            else if (location.href.match(/https:\/\/www\.(\w+)\.com\/page\/vip/) != null) {
                var nodelist = document.querySelectorAll("div.content-item");
                nodelist?.forEach(
                    (item,idx,arr) => {
                        var xxx = document.querySelector(`#my_add_dizhi${idx}`);
                        if (xxx) { xxx.parentNode.removeChild(xxx); }
                        var videourl = item.querySelector("a.video-pic")?.href?.replace("/vip/play-","/shipin/detail-");
                        if (videourl) {
                            var mydiv = document.createElement('div');
                            mydiv.innerHTML = `<div id="my_add_dizhi${idx}" style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">
                            <p><a href="${videourl}" target="_blank">✔点此访问</a></p></div>`;
                            item.after(mydiv);
                        }
                    }
                );
                //console.log("[猫咪]视频页面，未获取到地址，继续尝试...");
                //切换下一页网址不变，无法刷新，故不能停止定时器
            }
            // 快猫app pc （ok）
            else if (location.href.match("http.*?.xyz/pc/index.html*") != null) {
                var nodelist = document.querySelectorAll("#app div.box div.video_img");
                nodelist?.forEach(
                    (item,idx,arr) => {
                        var xxx = document.querySelector(`#my_add_dizhi${idx}`);
                        if (xxx) { xxx.parentNode.removeChild(xxx); }
                        var videourl = item.querySelector("div > img")?.src?.split('cover')[2]?.split('.')[0];
                        if (videourl) {
                            var mydiv = document.createElement('div');
                            //his: https://ghbdfgb3769dfda.zrtxt643w4.xyz/uploads/video${videourl}_wm.mp4/index.m3u8
                            //20250601：https://oafjdskpqwjnizlqwenmaqwkcxzpty.keyms2r.xyz/uploads/video/20250531/6294348/65b089210585f2b97bb64f992a4ffeac_wm.mp4/index.m3u8?auth_key=1748745132-mwz38xok441nk52dea30k32bkskrc9ap-0-b20b305089f8b3cc97e8796edf8868ac
                            mydiv.innerHTML = `<div id="my_add_dizhi${idx}" style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">
                            <p><a href="https://oafjdskpqwjnizlqwenmaqwkcxzpty.keyms2r.xyz/uploads/video${videourl}_wm.mp4/index.m3u8" target="_blank">✔点此访问</a></p></div>`;
                            item.after(mydiv);
                        }
                    }
                );
                //切换下一页网址不变，无法刷新，故不能停止定时器
            }
            // 快猫app h5 (全部ok)
            else if (location.href.match("http.*?.xyz/h5/index.html*") != null) {
                nodelist = document.querySelectorAll("div.imgbox div div.vue-waterfall-column>div");
                nodelist?.forEach(
                    (item,idx,arr) => {
                        var xxx = document.querySelector(`#my_add_dizhi${idx}`);
                        if (xxx) { xxx.parentNode.removeChild(xxx); }
                        var videourl = item.querySelector("img")?.src?.split('cover')[2]?.split('.')[0];
                        if (videourl) {
                            var mydiv = document.createElement('div');
                            mydiv.innerHTML = `<div id="my_add_dizhi${idx}" style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">
                            <p><a href="https://oafjdskpqwjnizlqwenmaqwkcxzpty.keyms2r.xyz/uploads/video${videourl}_wm.mp4/index.m3u8" target="_blank">✔点此访问</a></p></div>`;
                            item.after(mydiv);
                        }
                    }
                );
                //切换下一页网址不变，无法刷新，故不能停止定时器
            }
            // all av //todo
            else if (location.href.match("https://alltv.*?.com/") != null) {
                document.querySelectorAll("div.video-list-unit-media")?.forEach(
                    (item,idx,arr) => {
                        var xxx = document.querySelector(`#my_add_dizhi${idx}`);
                        if (xxx) { xxx.parentNode.removeChild(xxx); }
                        var videourl = item.querySelector("div > img")?.src?.split('cover')[2]?.split('.')[0];
                        if (videourl) {
                            var mydiv = document.createElement('div');
                            mydiv.innerHTML = `<div id="my_add_dizhi${idx}" style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">
                            <p><a href="https://wsdfamwasvbnmkijsdd.ue9n10.xyz/uploads/video${videourl}_wm.mp4/index.m3u8" target="_blank">✔点此访问</a></p></div>`;
                            item.after(mydiv);
                        }
                    }
                );
                //切换下一页网址不变，无法刷新，故不能停止定时器
            }
            /* 9sex */
            else if (location.href.match("https://.*?/index/movie/play/id/") != null) {
                player = document.querySelector("#dplayer");
                dizhi = document.body.innerHTML.match("movies/(.*?)_preview.jpg.txt")[1].split('/');/* $("script").text() */
                /* 1.点击试看（不需要） */
                if (player && dizhi && flag == 0) {
                    /* 2.解析真实地址 */
                    //https://img.jqotrwkiebik.com/aes/movies/20210824/4541/f87672bcddc4d5509683b12bd0eb36e3.webp.txt  err
                    //https://ms3.bca834d60257.com/20210824/4541/360P/f87672bcddc4d5509683b12bd0eb36e3_360P.m3u8 err
                    videoUrl = `https://ms3.bca834d60257.com/${dizhi[0]}/${dizhi[1]}/360P/${dizhi[2]}_360P.m3u8`; console.log("真实地址:", videoUrl);
                    videoUrl2 = `https://ms3.bca834d60257.com/${dizhi[0]}/${dizhi[1]}/480P/${dizhi[2]}_480P.m3u8`; console.log("真实地址2:", videoUrl2);
                    videoUrl3 = `https://ms3.bca834d60257.com/${dizhi[0]}/${dizhi[1]}/720P/${dizhi[2]}_720P.m3u8`; console.log("真实地址3:", videoUrl3);
                    videoUrl4 = `https://ms3.bca834d60257.com/${dizhi[0]}/${dizhi[1]}/1080P/${dizhi[2]}_1080P.m3u8`; console.log("真实地址4:", videoUrl4);
                    /* 3.vip视频需要移除登录框 */
                    ads = document.querySelector("#login-tip-modal"); if (ads) ads.parentNode.removeChild(ads);
                    ads = document.querySelector(".vip-tip-modal"); if (ads) ads.parentNode.removeChild(ads);
                    /* 4.播放正片 */
                    play_video2(videoUrl, videoUrl2, videoUrl3, videoUrl4, player, document.querySelector("div.notice"));
                    flag = 1;
                }
                else if (flag == 1) {
                    /* 3.1 免费视频需要加载播放后移除广告 */
                    ads = document.querySelector(".pause-ad-imgbox"); if (ads) ads.parentNode.removeChild(ads);
                    /* 5.停止定时器 */
                    clearInterval(my_timer);
                }
                else {
                    console.log("[9sex]视频页面，未获取到地址，继续尝试...");
                }
            }
            /* 皇家会所 */
            else if (location.href.match("https://www.hjhs.*?/videos/") != null) {
                player = document.querySelector("#dplayer");
                /* 1.点击试看（不需要） */
                if (player && window.api?.quality?.url) {
                    /* 2.解析真实地址 */
                    videoUrl = window.api.quality.url.replace("suo.", "").replace("_suo", ""); console.log("真实地址:", videoUrl);
                    /* 3.移除广告 */
                    /* 4.播放正片 */
                    play_video(videoUrl, player, document.querySelector("div.headline"));
                    /* 5.停止定时器 */
                    clearInterval(my_timer);
                }
                else {
                    console.log("[皇家会所]视频页面，未获取到地址，继续尝试...");
                }
            }
            // The AV Pron，兼容手机 + PC
            else if (location.href.match("https://theav.*?.com/videos/") != null || location.href.match("https://the.*?.fun/videos/") != null ) {
                // 2.解析真实地址
                //已知缺陷: 可能网站存在限制，控制台中player.api("hls")有值，但脚本获取为null 。只有使用 unsafeWindow.player.api("hls")能获取到 ，
                //但由于userscript不支持unsafeWindow，故safari浏览器+userscript无效。改为从<script/>内容查找m3u8地址
                videoUrl = window.player?.api("hls")?.url?.split('?')[0] || window.m3ky?.split('?')[0]; //该方案在safari浏览器+userscript下无效
                // videoUrl = document.body.innerHTML.match("https:(.*?).m3u8")[0];  // $("script").text()
                if (videoUrl && typeof(Playerjs)== 'function' ) {
                    console.log("真实地址:", videoUrl);
                    // 3.移除广告
                    ads = document.querySelector(".table"); if (ads) ads.style.display = "none";
                    ads = document.querySelector(".sponsor"); if (ads) ads.style.display = "none";
                    ads = document.querySelector(".rate_box"); if (ads) ads.style.display = "none";
                    ads = document.querySelector(".green"); if (ads) ads.style.display = "none";
                    // 4.播放正片
                    //已知缺陷: 若使用Dplayer, 则 chrome/safari 播放正常（无法新标签播放，可能有限制），kiwi m3u8地址获取成功，但播放失败！
                    // play_video(videoUrl, document.querySelector(".player"), document.querySelector("h2.title"));该方案在kiwi+tempermonkey下无效
                    Playerjs({ id: "layer", file: videoUrl, autoplay: 1 });//id: "player"
                    clearInterval(my_timer);
                }
                else {
                    console.log("[The AV Pron]视频页面，未获取到地址，继续尝试...");
                }
            }
            /* 快猫，兼容手机 + PC */
            else if (location.href.match("https://.*?km.*?.com/videoContent/") != null) {
                /* 1.点击试看（不需要） */
                /* 2.解析真实地址 */
                videoUrl = document.querySelector("#videoContent")?.__vue__?.formatUrl;
                if (videoUrl) {
                    console.log("真实地址:", videoUrl);
                    /* 3.移除广告 */
                    ads = document.querySelector(".exchangeBg"); if (ads != null) ads.style.display = "none";
                    /* 4.播放正片 */
                    play_video(videoUrl, document.querySelector("#videoContent > div.video")|| document.querySelector("div.backImg"), document.querySelector("div.videoTitle") || document.querySelector("div p.name"));
                    /* 5.停止定时器 */
                    clearInterval(my_timer);
                }
                else {
                    console.log("[快猫]视频页面，未获取到地址，继续尝试...");
                }
            }
            //红杏，兼容手机 + PC
            /* else if (location.href.match("https://.*?.hx.*?.com/#/moves/playvideo/") != null) {
                let login = document.querySelector("div.play_video_wdl_2_2");
                shikan = document.querySelector("div.shikan") || document.querySelector("div.on_play");
                player = document.querySelector(" div#mse") || document.querySelector("div.play_video_1 div");
                if(login){
                    // 0.登录 or 注册
                    login.click();
                    do_login();
                }
                else if (shikan) {
                    // 1.点击试看
                    shikan.click(); console.log("点击试看！");
                }
                else if (player?.__vue__?.playUrl) {
                    // 2.解析真实地址
                    let videoUrl = player.__vue__.playUrl.split('&time')[0];
                    let re = videoUrl.split("/")[2];
                    videoUrl = videoUrl.replace(re + '/shikanshipin', 'jscdn.kunkunhome.xyz');
                    console.log("真实地址:", videoUrl);
                    // 3.移除试看
                    player.__vue__.player?.hls?.destroy();
                    // 4.播放正片
                    play_video(videoUrl, document.querySelector(" div#mse") || document.querySelector("div.play_video_1 div.dplayer"), document.querySelector("div.move_name") || document.querySelector("div.play_main_1"));
                    // 5.停止定时器
                    clearInterval(my_timer); console.log("停止定时器！");
                }
                else {
                    console.log("[红杏]视频页面，未获取到地址，继续尝试...");
                }
            }*/
            //红杏，手机短视频
            /*else if (location.href.match("https://.*?/#/shotVideoList") != null) {
                player = document.querySelector("div.shout_list");
                if(!document.querySelector("button#pojie")){
                    // 1. 显示地址
                    var mydiv = document.createElement('div');
                    mydiv.innerHTML = `<p id="my_add_dizhi" style="color:red;font-size:14px"><button id="pojie">点此破解</button>后，视频标题前会出现“✔”字样，点击标题将打开新页面看视频！</p>`;
                    document.querySelector("div.van-nav-bar__content").after(mydiv);
                }
                else if(player && player.__vue__.playList1){
                    // 2.点解破解
                    document.querySelector("button#pojie").onclick = function(){
                        let videoUrl_list = player.__vue__.playList1; console.log("直播地址:", videoUrl_list);
                        let divlist = document.querySelectorAll("div.box_left div.box_public div.box_public_1_2 ");
                        let len = (videoUrl_list.length > divlist.length) ? divlist.length : videoUrl_list.length;
                        for (var i = 0; i < len; i++) {
                            divlist[i].innerHTML = `<p><a href="https://jscdn.lordzhang.xyz/${videoUrl_list[i].sn}/10000kb/hls/index.m3u8" target="_blank">✔${divlist[i].innerText}</a></p>`;
                        }
                        // 右边的
                        videoUrl_list = player.__vue__.playList2; console.log("直播地址:", videoUrl_list);
                        divlist = document.querySelectorAll("div.box_right div.box_public div.box_public_1_2 ");
                        len = (videoUrl_list.length > divlist.length) ? divlist.length : videoUrl_list.length;
                        for (i = 0; i < len; i++) {
                            divlist[i].innerHTML = `<p><a href="https://jscdn.lordzhang.xyz/${videoUrl_list[i].sn}/10000kb/hls/index.m3u8" target="_blank">✔${divlist[i].innerText}</a></p>`;
                        }
                    };
                    // 3.停止定时器
                    clearInterval(my_timer);
                }
            } */
            /* 含羞草视频 ，兼容手机 + PC */
            else if (location.href.match("/play/video/") != null) {
                /*// 2.解除试看限制
                var obj = JSON.parse(localStorage.getItem('preInfo'));//解除 pc 次数限制
                if(obj){
                    obj.preNum = 100;
                    obj.count = 0;
                    localStorage.setItem("preInfo",JSON.stringify(obj));
                }
                var obj2 = JSON.parse(localStorage.getItem('tryPlayNum'));//解除 h5 次数限制
                if(obj2){
                    obj2.num = -90;
                    localStorage.setItem("tryPlayNum",JSON.stringify(obj2));
                }
                var obj3 = JSON.parse(localStorage.getItem('visitorShortLimit'));//解除 h5 短视频 次数限制
                if(obj3){
                    obj3.count = -90;
                    localStorage.setItem("visitorShortLimit",JSON.stringify(obj3));
                }*/
                //shikan = document.querySelector("div.try div.g-flex-jcc") || document.querySelector("div.cursor-pointer.flex-center.space-x-1"); /* 前面为手机。后面为PC */
                let videoUrl = window.xxxadrfgaddsasd.replace(/start=\d+\&end=\d+\&/,"");//localStorage.getItem("real_video_url");
                if (videoUrl) {
                    //3.移除广告
                    ads = document.querySelector("div.vip-mask");
                    if (ads != null) ads.style.display = "none";
                    ads = document.querySelector("div.overflow-hidden");
                    if (ads != null) ads.style.display = "none";
                    //4.显示地址
                    console.log("videoUrl:",videoUrl);
                    show_videoUrl(videoUrl, document.querySelector("div.g-m-t-8.g-flex.title") || document.querySelector("h2.text-base.article-title"), 1);
                     //4.播放正片
                    let el = document.querySelector("#v_prism")|| document.querySelector("#video1");
                    let dizhi = document.querySelector("div.g-m-t-8.g-flex.title") || document.querySelector("h2.text-base.article-title");
                    //play_video(videoUrl, el, dizhi, 1); // 2025年12月10日：只要在当前页面加载这个dplayer就会导致返回异常,无法播放；应该是页面捕获了信息，做了反逆向限制
                    //5.停止定时器
                    //localStorage.removeItem("real_video_url");
                    console.log("停止定时器！");
                    clearInterval(my_timer);
                }
                //else if (shikan) {
                    ///* 1.点击试看 */
                    //shikan.click(); console.log("点击试看！"); shikan.parentNode.removeChild(shikan);
                //}
                else {
                    console.log("[含羞草]视频页面，未获取到地址，继续尝试...");
                }
            }
            //含羞草，PC端，直播
            /* else if (location.href.match("/live/") != null) {
                player = document.querySelector("div.VideoAuthAdminBg") || document.querySelector("div#livePlayer");
                videoUrl = player.__vue__.videoUrl || player.__vue__.videoContent.pull; console.log("直播地址:", videoUrl);
                play_video(videoUrl, player, document.querySelector("div.userInfo p.name"));
                clearInterval(my_timer);
            }*/
            //含羞草，手机端，直播
            /*else if (location.href.match("//h5.*?/live") != null) {
                player = document.querySelector("div#publicLiveListModule");
                let videoUrl_list = player.__vue__.list; console.log("直播地址:", videoUrl_list);
                let divlist = document.querySelectorAll("ul.liveListBg li .bottom");
                let len = (videoUrl_list.length > divlist.length) ? divlist.length : videoUrl_list.length;
                for (var i = 0; i < len; i++) {
                    divlist[i].innerHTML += '<p><a href="' + videoUrl_list[i].pull + '" target="_blank">' + videoUrl_list[i].pull + '</a></p>';
                }
                clearInterval(my_timer);
                // 1. 显示地址
                mydiv = document.createElement('div');
                mydiv.innerHTML = '<p id="my_add_dizhi" style="color:red;font-size:14px">提示：彦祖们，请点击图片下方的链接看破解后的直播视频！</p>';
                document.querySelector("div.topBannerBg").after(mydiv);
            }*/
            else {
                localStorage.setItem("vip_level", '1');// 麻豆TV、91TV
                //localStorage.setItem("free_plays", '99');// 福利姬系列
                //clearInterval(my_timer); //麻豆TV每次刷新后会将vip_level更新为0，不能停止定时器
            }
        }
        catch (err) {
            //console.log(`${err}`);
            show_err_log(err);
        }
    }

    let my_timer = setInterval(get_videourl, 2000);

    var oldhref = location.href;
    setInterval(function () {
        if (location.href != oldhref) {
            console.log("监听到地址变化,再次启动【获取视频定时器】!");
            oldhref = location.href;
            err_cnt = 0;
            clearInterval(my_timer);
            my_timer = setInterval(get_videourl, 2000);
        }
        if(today != localStorage.getItem('today_is_show') && Math.abs(new Date().getMinutes() - min) > 10 ){//今天在当前站点没弹过，且在当前页面停留10分钟以上时
            localStorage.setItem("today_is_show", today);
            console.log("支持作者弹窗!");
            //show_support_author();
        }
    }, 1000);

})();