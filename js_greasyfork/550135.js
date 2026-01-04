// ==UserScript==
// @name         Bilibili Audio Download Command Generator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Generates a yt-dlp command to download audio from Bilibili video pages
// @author       Ethan
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      GPL-3.0
// @icon         https://bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/550135/Bilibili%20Audio%20Download%20Command%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/550135/Bilibili%20Audio%20Download%20Command%20Generator.meta.js
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

    // Create a button
    let btn = document.createElement('button');
    btn.innerText = 'Copy Download Command';
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

    // Copy yt-dlp command when clicked
    btn.addEventListener('click', () => {
        let url = window.location.href;
        if(!url.includes("bilibili.com/video")) {
            alert("Please open a Bilibili video page");
            return;
        }
        let command = `yt-dlp -f ba "${url}"`;
        navigator.clipboard.writeText(command)
            .then(()=>alert("Command copied to clipboard! Execute in terminal to download audio.(before run command you need install python+run command python3 -m pip install -U yt-dlp)"))
            .catch(()=>alert("Copy failed, please copy the command manually."));
    });
})();