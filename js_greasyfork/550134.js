// ==UserScript==
// @name         B站音频下载命令生成器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 B站视频页生成 yt-dlp 下载音频命令
// @author       Ethan
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      GPL-3.0
// @icon         https://bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/550134/B%E7%AB%99%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%91%BD%E4%BB%A4%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550134/B%E7%AB%99%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%91%BD%E4%BB%A4%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

(function() {
    'use strict';

    // 创建按钮
    let btn = document.createElement('button');
    btn.innerText = '复制下载命令';
    btn.style.position = 'fixed';
    btn.style.top = '100px';
    btn.style.right = '20px';
    btn.style.zIndex = 9999;
    btn.style.padding = '10px';
    btn.style.background = '#ff4b00';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);

    // 点击按钮复制命令
    btn.addEventListener('click', () => {
        let url = window.location.href;
        if(!url.includes("bilibili.com/video")) {
            alert("请打开B站视频页面");
            return;
        }
        let command = `yt-dlp -f ba "${url}"`;
        navigator.clipboard.writeText(command)
            .then(()=>alert("命令已复制到剪贴板，终端执行即可下载音频(需提前下载python+python3 -m pip install -U yt-dlp)"))
            .catch(()=>alert("复制失败，请手动复制命令"));
    });
})();