// ==UserScript==
// @name         机核有声书时长统计
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  计算机核网有声书的总时长
// @author       ChrisTitan
// @license      GNU GPLv3
// @match        https://www.gcores.com/albums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gcores.com
// @require      https://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547823/%E6%9C%BA%E6%A0%B8%E6%9C%89%E5%A3%B0%E4%B9%A6%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/547823/%E6%9C%BA%E6%A0%B8%E6%9C%89%E5%A3%B0%E4%B9%A6%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

waitForKeyElements (".mutedInfo", sumDuration);

function sumDuration (jNode) {
    'use strict';

    // 开始获取页面单集时长
    const radios = document.querySelectorAll('span.u_color-gray-info:nth-of-type(1)');
    const times = Array.from(radios, (radio) => radio.textContent);

    // 计算总秒数
    let totalSeconds = 0;

    times.forEach(time => {
        // 分割分钟和秒
        const [minutes, seconds] = time.split(':').map(Number);
        // 转换为秒并累加
        totalSeconds += minutes * 60 + seconds;
    });

    // 计算小时、分钟和秒
    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    // 格式化为时间字符串
    const formattedTime = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

    const author = document.querySelector('p.u_color-gray-info');
    author.textContent = `总时长: ${formattedTime} · ` + author.textContent;

}