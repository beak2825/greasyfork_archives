// ==UserScript==
// @name         成都职业培训网络学院刷课脚本
// @namespace    https://www.tuziang.com/jxjydx.html
// @version      1.1
// @description  这是一个关于 成都职业培训网络学院 自动刷课的小脚本，主要代码就几行
// @author       daiybh
// @match        https://www.wlxy.org.cn/*
// @match        *://basic.smartedu.cn/*
// @match        *://core.teacher.vocational.smartedu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548405/%E6%88%90%E9%83%BD%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548405/%E6%88%90%E9%83%BD%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function () {


    let courseList = document.getElementsByClassName("ci");

    let video = document.getElementsByTagName('video');

    function checkCurTitleIsFinished() {
        const curTitle = document.getElementsByClassName('title_paly')[0].textContent;

        for (const l of courseList) {
            const tc = l.textContent;
            if (tc.includes(curTitle)) {
                if (tc.includes('已完成')) {
                    return true;
                }
            }
        }
        return false;
    }
    function selectNext() {
        for (const l of courseList) {
            const tc = l.textContent;
            if (!tc.includes('已完成')) {
                console.log(l.textContent);
                l.click();
                return;
            }
        }
    }
    function getProgress() {
        var totalLen = document.querySelector("#video_container > div.vjs-control-bar > div.vjs-duration.vjs-time-control.vjs-control > div").textContent;;
        var curPlaying = document.querySelector("#video_container > div.vjs-control-bar > div.vjs-current-time.vjs-time-control.vjs-control > div").textContent;
        return totalLen == curPlaying;
    }
    function IsDlgShow() {
        try {
            const dlgShow = document.getElementsByClassName('el-message-box__wrapper')[0].style.display;
            if(dlgShow!=='none')
            {
                document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary").click()
            }
            return dlgShow != 'none';
        } catch (e) {
            console.log(e);
        }
        return false;
    }
    function MuteVideo(){
        try {
            const video = document.getElementsByTagName('video')[0];
            if (!video.muted) {
                video.muted = true;
            }
        } catch (e) {
            console.log(e);
        }
    }
    let isFirst = true;
    let iHeart = 0;
    setInterval(function () {
        console.log('running' + (iHeart++));
        if (!IsDlgShow()) {
            if (isFirst) {
                courseList = document.getElementsByClassName("ci");

                
                isFirst = false;
            }
            MuteVideo();
            if (checkCurTitleIsFinished())
                selectNext();
            else if (getProgress()) {
                selectNext();
            }

        }
    }, 2000);


})();