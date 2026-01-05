// ==UserScript==
// @name         网易云音乐|QQ音乐下载
// @namespace    junchanga1
// @version      1.1.1
// @description  可以下载网易云音乐|QQ音乐
// @author       junchanga1
// @match        https://music.163.com/*
// @match        https://y.qq.com/*


// @license      GPL License
// @grant        GM_addStyle


// @downloadURL https://update.greasyfork.org/scripts/561483/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%7CQQ%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/561483/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%7CQQ%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function () {


    GM_addStyle(
        '#myNewDiv11 {width:120px;height:40px; overflow:hidden;position:absolute; left:0; top:500px;z-index:100001;background-color:#FF34B3;border-radius:10px 10px 10px 10px;}' +
        '#myNewDiv11 #downloadMusic11{width:70px;height:40px;color:#000; text-decoration:none; font:bold 24px/30px arial, sans-serif; text-align:center;margin-left:10px; }'

    );
    // =========================================================================================
    // ============================= 网易云音乐|QQ音乐下载  =================================
    // =========================================================================================

    if (location.href.indexOf('music.163') != -1 ||
        location.href.indexOf('y.qq') != -1) {

        // myNewDiv  downloadMusicDiv  downloadMusic
        var bbmusicdiv = document.createElement("div");
        bbmusicdiv.innerHTML = '<div id="myNewDiv11">' +
            '<div id="downloadMusicDiv11">' +
            '<a id="downloadMusic11" href="http://47.101.38.188/gdownloadmusic.html?version=20260105"  target="_blank"  title="点击跳转到新页签">下载音乐</a>' +

            '</div>';

        document.body.appendChild(bbmusicdiv);
    }
})();