// ==UserScript==
// @name         91porn破解VIP视频免费看
// @namespace    91porn_vip_video_free_see
// @version      0.5
// @description  来不及解释了，快上车！！！功能:自动替换VIP线路 + VIP下载 + HD跳转
// @author       w2f
// @match        https://w823.a2507app.com/*
// @include      /^https://\w+.9p58b.com/.*?$/
// @match        https://w1226.9p58b.com/*
// @icon         https://w1226.9p58b.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/476730-ajaxhooker-2/code/ajaxHooker_2.js?version=1259979
// @downloadURL https://update.greasyfork.org/scripts/483600/91porn%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483600/91porn%E7%A0%B4%E8%A7%A3VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

/*
正版91pron地址：https://www.91dizhi8.com

功能:
1.高清HD视频可跳转观看
2.自动替换VIP线路播放
3.VIP下载功能
*/

(function () {
    'use strict';

    function get_videourl() {
        try {
            if (location.href.match("https://.*?/index.php") != null || location.href.match("https://.*?/v.php") != null) {
                var nodelist = document.querySelectorAll("div.videos-text-align");
                nodelist?.forEach(
                    (item,idx,arr) => {
                        /*
                        var xxx = document.querySelector(`#my_add_dizhi${idx}`);
                        if (xxx) { xxx.parentNode.removeChild(xxx); }
                        var videourl = item.querySelector("div > img")?.src?.split('thumb/')[1]?.split('.')[0];
                        if (videourl) {
                            var mydiv = document.createElement('div');
                            mydiv.innerHTML = `<div id="my_add_dizhi${idx}" style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">
                            <p>✅点此访问:<a href="https://la.btc620.com/m3u8/${videourl}/${videourl}.m3u8" target="_blank">线路A</a>
                            <a href="http://1470423830.rsc.cdn77.org/m3u8/${videourl}/${videourl}.m3u8" target="_blank">线路H</a>
                            <a href="https://cns.killcovid2021.com/m3u8/${videourl}/${videourl}.m3u8" target="_blank">VIP线路I</a></p></div>`;
                            item.after(mydiv);
                        }*/
                        var link = item.querySelector("a");if(link) link.href = link.href.replace("view_video_hd","view_video");
                    }
                );
                clearInterval(my_timer);
            }
            else if (location.href.match("view_video_hd.php") != null) {location.href = location.href.replace("view_video_hd","view_video") }
            else if (location.href.match("view_video.php") != null) {
                var url = document.querySelector("video source").src;
                var fixurl = "https://cns.killcovid2021.com/mp43/" + url.split("mp43/")[1];
                //console.log(fixurl);
                document.querySelector("video").src = fixurl;
                document.querySelector("video source").src = fixurl;

                var item = document.querySelector("div.video-container");
                var mydiv = document.createElement('div');
                mydiv.innerHTML = `<div id="my_add_dizhi" style="color:red;font-size:14px;word-wrap: break-word;word-break: break-all;">
                            <p>已替换为vip线路！直接播放即可，也可<a href="${fixurl}" target="_blank">【点此下载⏬】</a>，若提示盗版，登录后多刷新几次即可</p></div>`;
                item.after(mydiv);
                clearInterval(my_timer);
                //切换下一页网址不变，无法刷新，故不能停止定时器
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    let my_timer = setInterval(get_videourl, 2000);

    var oldhref = location.href;
    setInterval(function () {
        if (location.href != oldhref) {
            console.log("监听到地址变化,再次启动【获取视频定时器】!");
            oldhref = location.href;
            my_timer = setInterval(get_videourl, 2000);
        }
    }, 1000);

})();