// ==UserScript==
// @name         屏蔽当图网/办公资源网视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽当图网/办公资源网自动播放的视频
// @author       Supcutie
// @match        *://www.99ppt.com/*
// @include      *://www.bangongziyuan.com*
// @icon         https://www.99ppt.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556640/%E5%B1%8F%E8%94%BD%E5%BD%93%E5%9B%BE%E7%BD%91%E5%8A%9E%E5%85%AC%E8%B5%84%E6%BA%90%E7%BD%91%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/556640/%E5%B1%8F%E8%94%BD%E5%BD%93%E5%9B%BE%E7%BD%91%E5%8A%9E%E5%85%AC%E8%B5%84%E6%BA%90%E7%BD%91%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==



var url = window.location.href;

if(url.indexOf("bangongziyuan") != -1){
    document.getElementById("file_video").remove();
}else{
    document.getElementById("videoe").remove();
}





