// ==UserScript==
// @name         湖南开放大学事业单位工作人员培训网
// @namespace    https://greasyfork.org/users/878514
// @version      20251211
// @description  自动进入学习页面，点击验证、切换课程，支持后台挂机（非最小化）
// @author       Velens
// @match        https://www.hnsydwpx.cn/*
// @icon         https://www.hnsydwpx.cn/favicon1.ico
// @grant        none
// @require    https://code.jquery.com/jquery-3.6.0.min.js
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/558377/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/558377/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%BD%91.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

var timerId,time,progress,flagBot = true;

async function sleep (delay){
    return new Promise((resolve, reject)=> setTimeout(resolve, delay));}

async function Enter(){
    await sleep(3000);
    if (document.getElementsByClassName('login_buts')[0]?.innerText == "登     录                   "){flagBot = false;console.log("学员您好，请先前往“湖南省人力资源和社会保障厅服务平台”，通过个人网厅登录后，选择事管培训平台--继续教育基地网络平台--湖南开放大学进入。")}
    else {
        document.getElementsByClassName('el-breadcrumb__inner')[6].click();
        await sleep(3000);
        document.getElementsByClassName('el-badge item')[2].click();
        await sleep(3000);
        if (document.getElementsByClassName('basic-list-item-tool')[0]?.innerText == "继续学习"){
            if (document.getElementsByClassName('el-button')[2].innerText == "继续学习"){document.getElementsByClassName('el-button')[2].click();}
            else {document.getElementsByClassName('el-button')[3].click();}}
        else {flagBot = false;console.log(new Date() + "，暂无课程学习")}}}

async function Bot(){
    await sleep(3000);
    progress = document.getElementsByClassName('progress');

    if (document.getElementsByTagName("video").length > 0){
        if (document.getElementsByClassName("el-button el-button--primary")[0]?.innerText == "继续播放"){
            document.getElementsByClassName("el-button el-button--primary")[0].click();}
        else if (document.getElementsByClassName('el-dialog__title')[0]?.innerText == "防作弊问答" && document.getElementsByClassName('el-radio__input is-checked').length == 0){
            document.getElementsByClassName('el-radio__input')[0].click();}
        else if (document.getElementsByTagName("video")[0].paused){
            document.getElementsByTagName("video")[0].muted = true;
            document.getElementsByTagName("video")[0].play();}}

    if (progress[progress.length -1]?.innerText == "100%"){
        console.log(new Date() + "，已完成当前课程学习");
        document.getElementById('tab-second').click();
        await sleep(3000);
        if (document.getElementsByClassName('mycourse_list').length > 1){document.getElementsByClassName('mycourse_list')[1].click();}
        else {
            flagBot = false;
            console.log(new Date() + "，已完成全部课程学习");
            if (document.getElementsByTagName("video").length > 0){
                document.getElementsByTagName("video")[0].pause();}}}}

(async function Play(){
    clearTimeout(timerId);
    time = Math.random()*15000;

    if (location.href.match("www.hnsydwpx.cn/videoPlayback")){await Bot();}
    else {await Enter();}

    if (flagBot){timerId = setTimeout(Play, time);}
    else {console.log(new Date() + "，脚本停止运行");}})();






