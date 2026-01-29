// ==UserScript==
// @name        粉笔隐藏视频VIP广告
// @namespace   粉笔隐藏视频VIP广告
// @match       *://spa.fenbi.com/ti/exam/*
// @grant       none
// @version     1.11
// @author      KaMmySuma
// @license MIT
// @description 粉笔考公网页版按“Q”键 去除/恢复 VIP看视频的模块。基于作者@CHOSEN_1的脚本“粉笔去视频VIP”修改，因粉笔网页布局变化导致原脚本失效，此为新适配的版本
// @downloadURL https://update.greasyfork.org/scripts/564333/%E7%B2%89%E7%AC%94%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91VIP%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/564333/%E7%B2%89%E7%AC%94%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91VIP%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


(function() {
    let isHidden = false;
    document.addEventListener('keyup', function(event) {
        if (event.key === 'q' || event.key === 'Q') {
            hide_video();
        }
    });

    // 隐藏视频模块
    function hide_video() {
        if(!isHidden){
        document.querySelectorAll('section[id^="section-video-"]').forEach(function(element) {
            element.style.display = 'none';
        });
        isHidden = true;
        }else{
        document.querySelectorAll('section[id^="section-video-"]').forEach(function(element) {
        element.style.display = '';
        });
        isHidden = false;}
    }
})();