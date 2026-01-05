// ==UserScript==
// @name         Steam Video Overlay
// @version      0.3
// @description  让 Steam 游戏详情页面的视频悬浮起来~~~
// @author       NotaStudio
// @match        http://store.steampowered.com/app/*
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license      GPLv3
// @namespace    https://greasyfork.org/users/8882
// @downloadURL https://update.greasyfork.org/scripts/7901/Steam%20Video%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/7901/Steam%20Video%20Overlay.meta.js
// ==/UserScript==

/*
 * ChangeLog
 * 20150210 0.3
 * 更改隐藏视频浮窗方式，精简代码，把视频浮窗调大了一点（毕竟眼瞎），修复无法强制播放 HTML5 视频的 bug
 * 20150206 0.2
 * 重构代码，强制播放 HTML5 视频，更改播放地址获取方式，通过 HTML5 Media API 同步播放进度和音量，大幅优化性能
 * 20150205 0.1-alpha
 * 首次发布
 */

var fileUrl,currentNode,svoWindow;

console.log("土豪买买买！！！\n Steam Video Overlay 0.3\n Created by Nota\n 2015.02.10");

var dateExpires = new Date();
dateExpires.setTime( dateExpires.getTime() + 1000 * 60 * 60 * 24 * 365 * 10 );
document.cookie = 'bShouldUseHTML5=1; expires=' + dateExpires.toGMTString() + ';path=/';
// 强制播放 HTML5 视频，代码来自于 Enhanced Steam

var videoNode = document.body.getElementsByTagName("video");
if (videoNode[0] === undefined)
{
    location.reload(true);
}

window.collectionToArray = function(collection) {
    var ary = []; 
    for(var i = 0, len = collection.length; i < len; i++) { 
        ary.push(collection[i]); 
    } 
    return ary; 
};
// 此函数原作者为三水清(http://js8.in/)

window.getFileUrl = function() {
    if (event.srcElement.getAttribute("id") == "svoWindow")
    {
        ;
    }
    else
    {
        currentNode = event.srcElement;
        fileUrl = currentNode.currentSrc;
    }
};

window.scrollEvent = function() {
    if (window.pageYOffset > screen.availHeight)
    {
        if (svoWindow.style.opacity == "1")
        {
            ;
        }
        else
        {
            currentNode.pause();
            svoWindow.src = fileUrl;      
            svoWindow.currentTime = currentNode.currentTime;
            svoWindow.style.opacity = "1";
            svoWindow.volume = currentNode.volume;
            svoWindow.play();
        }
    }
    else
    {
        if (svoWindow.style.opacity == "0")
        {
            ;
        }
        else
        {
            svoWindow.pause();
            currentNode.currentTime = svoWindow.currentTime;
            currentNode.volume = svoWindow.volume;
            svoWindow.style.opacity = "0";
            currentNode.play();
        }
    }
    
};

window.createWindow = function() {   
    var videoNode = document.createElement("VIDEO");
    videoNode.setAttribute("src", "");
    videoNode.setAttribute("id", "svoWindow");
    videoNode.setAttribute("width", "33%");
    videoNode.setAttribute("height", "33%");
    videoNode.setAttribute("style", "position: fixed;bottom: 25px;right: 25px;top: auto;left: auto;");
    document.body.appendChild(videoNode);
    svoWindow = document.getElementById("svoWindow");
    svoWindow.style.opacity = "0";
    svoWindow.pause();
};

window.closeWindow = function() {
    document.body.setAttribute("onscroll","");
    document.body.removeChild(svoWindow);
    for(var i = 0;i < videoNode.length;i++){
        videoNode[i].setAttribute("onplay","");
    }
};

document.body.setAttribute("onscroll","scrollEvent()");
document.body.setAttribute("onload","createWindow()");
for(var i = 0;i < videoNode.length;i++){
    videoNode[i].setAttribute("onplay","getFileUrl()");
}

var svoOptions = document.createElement("DIV");
var optionText = document.createTextNode("Steam Video Overlay 选项：");
svoOptions.setAttribute("class", "glance_tags_label");
svoOptions.appendChild(optionText);
document.body.getElementsByClassName("rightcol")[0].appendChild(svoOptions);

var closeButton = document.createElement("A");
var closeButtonSpan = document.createElement("SPAN");
var closeSpanText = document.createTextNode("不再显示视频浮窗");
closeButton.setAttribute("onclick", "closeWindow()");
closeButton.setAttribute("class", "btnv6_blue_hoverfade btn_medium app_tag");
closeButtonSpan.appendChild(closeSpanText);
closeButton.appendChild(closeButtonSpan);
document.body.getElementsByClassName("rightcol")[0].appendChild(closeButton);
