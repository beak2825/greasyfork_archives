// ==UserScript==
// @name         知学堂 - iTheo
// @namespace    http://tampermonkey.net/
// @version      2024-03-14
// @description  zhi学堂视频大屏美化
// @author       Theo·Chan
// @license      AGPL
// @match        *://zhihu.com/*
// @match        https://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552649/%E7%9F%A5%E5%AD%A6%E5%A0%82%20-%20iTheo.user.js
// @updateURL https://update.greasyfork.org/scripts/552649/%E7%9F%A5%E5%AD%A6%E5%A0%82%20-%20iTheo.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var playerWrapper_height = window.outerHeight - 200;
    var _style = document.createElement('style');
    _style.setAttribute('data-name', 'itheo-css')
    _style.innerHTML = `
.itheo-script {
    display:none
}
*{
    user-select: unset;
}
  /*直播课程*/
.PcContent-root-xuCjj {
    display:block !important;
    width: 100%;
}
.PcLive-liveWrapper-mWENP {
    width:auto !important;
}
.PcLive-player-bB4as {
    width:100% !important;
}
.PcPlayer-playerWrapper-2Wq7D {
    height: ${playerWrapper_height}px !important;
}
  /*视频回放*/
.App-content-4ebEV, .App-main-nxEm4 {
    width:100%;
}
.VideoPlayer-content-vydRd {
    width:100%;
    height:auto;
}
.VideoPlayer-video-juqPz {
    height: 100%;
    max-height: ${playerWrapper_height + 100}px !important;
}
.FloatingWindow-root-dtz4f {
    opacity: .70;
    right: 0px;
    top: 300px;
    height: fit-content;
}
    `;
    document.getElementsByTagName('head')[0].appendChild(_style);
    console.log('------ added itheo-css -------------------------------------------------')
})();