// ==UserScript==
// @name         安徽继续教育在线刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 安徽继续教育在线 的辅助看课，脚本功能如下：自动切换下一课、视频倍速播放(默认关闭)
// @author       脚本喵
// @match        https://main.ahjxjy.cn/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550540/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550540/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var beisuEnable = false // 开启倍速功能

var confirm = function () {
    return true;
};
window.confirm = function () {
    return true;
};
setInterval(function () {
    for (var i = 0; i < document.getElementsByTagName('video').length; i++) {
        var current_video = document.getElementsByTagName('video')[i]
        if (beisuEnable) {
            current_video.playbackRate = 8.0 // 最高16
        }
        if (current_video.ended) {
            if (document.querySelector('a.btn.btn-green')) {
                document.querySelector('a.btn.btn-green').click()
            }
        }
    }
    //判断当前是作业
    if (document.getElementsByClassName('e-save-b btn_save').length > 0) {
        var currentLi
        if (document.getElementsByClassName('e-save-b btn_save')[0].innerText == '提交作业') {
            for (let i = 0; i < document.getElementsByTagName('li').length; i) {
                if (document.getElementsByTagName('li')[i].className == 'current') {
                    currentLi = i
                }
            }
            document.getElementsByClassName('sectionlist btn_dropdown')[0].click();

            setTimeout(function () {
                document.getElementsByTagName('li')[currentLi].getElementsByTagName('a')[0].click();
            }, 1000)

        }
    }
}, 5*1000)