// ==UserScript==
// @name         P9 游戏时长助手
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  显示游戏时常，首次使用要先去https://psnsgame.com/psnData同步数据。
// @author       听风，狂热KuusouMenreiki
// @match        https://psnine.com/psngame/*
// @match        https://www.psnine.com/psngame/*
// @match        https://psnine.com/psnid/*
// @match        https://www.psnine.com/psnid/*
// @grant        GM.xmlHttpRequest
// @connect      api.psnsgame.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561939/P9%20%E6%B8%B8%E6%88%8F%E6%97%B6%E9%95%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561939/P9%20%E6%B8%B8%E6%88%8F%E6%97%B6%E9%95%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const USERNAME_COOKIE_NAME = '__Psnine_psnid';
    const API_BASE_URL = 'https://api.psnsgame.com/api/psn/PSN/getoneusergametime';

    function getCookieValue(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for(let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null;
    }

    function inferNpIdFromP9Id(p9Id) {
        if (!p9Id) return null;
        const paddedId = p9Id.padStart(5, '0');
        return `NPWR${paddedId}_00`;
    }

    function parseNpCommunicationId() {
        const trophyLink = document.querySelector('a[href*="trophy?title=NPWR"]');
        if (trophyLink) {
            const href = trophyLink.getAttribute('href');
            const match = href.match(/NPWR\d{5}_\d{2}/);
            if (match && match[0]) {
                return match[0];
            }
        }
        const urlMatch = window.location.pathname.match(/\/psngame\/(\d+)/);
        if (urlMatch && urlMatch[1]) {
            return inferNpIdFromP9Id(urlMatch[1]);
        }
        return null;
    }

    function formatPlayDuration(isoDuration) {
        if (!isoDuration || !isoDuration.startsWith('PT')) {
             return "数据错误";
        }
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = isoDuration.match(regex);
        if (!matches) {
            return "未知";
        }
        const hours = matches[1] ? parseInt(matches[1], 10) : 0;
        const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
        const seconds = matches[3] ? parseInt(matches[3], 10) : 0;
        let result = [];
        if (hours > 0) {
            result.push(`${hours}小时`);
        }
        if (minutes > 0) {
            result.push(`${minutes}分钟`);
        }
        if (seconds > 0) {
            result.push(`${seconds}秒`);
        }
        if (result.length === 0) {
            return "0秒";
        }
        return result.join(' ');
    }

    function formatPlayDurationAsHours(isoDuration) {
        if (!isoDuration || !isoDuration.startsWith('PT')) {
             return "--";
        }
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = isoDuration.match(regex);
        if (!matches) {
            return "--";
        }
        const hours = matches[1] ? parseInt(matches[1], 10) : 0;
        const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
        const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

        const totalHours = hours + (minutes / 60) + (seconds / 3600);

        if (totalHours === 0) {
            return "0.0 小时";
        }

        return totalHours.toFixed(1) + " 小时";
    }

    function renderPlaytimeOnGamePage(contentHtml) {
        const targetElement = document.querySelector('.main .box h1');
        if (!targetElement) {
            return;
        }
        let playtimeElement = document.getElementById('p9-playtime-helper');
        if (!playtimeElement) {
            playtimeElement = document.createElement('div');
            playtimeElement.id = 'p9-playtime-helper';
            playtimeElement.style.fontSize = '1.1rem';
            playtimeElement.style.color = '#555';
            playtimeElement.style.marginTop = '10px';
            playtimeElement.style.marginBottom = '10px';
            targetElement.insertAdjacentElement('afterend', playtimeElement);
        }
        playtimeElement.innerHTML = contentHtml;
    }

    // == 修改：个人主页注入逻辑 (V2.2) ==
    // 此函数现在将内容注入到新创建的 <td> (targetCell) 中
    async function fetchAndInjectTimeInProfile(targetCell, psnId, npId) {

        // 1. 创建徽章和时间文本的 HTML 字符串
        const badgeHtml = `<span style="background-color: #007bff; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">游玩时长</span>`;
        let timeHtml = `<span style="display: block; margin-top: 4px; font-size: 14px; font-weight: bold; color: #999; font-style: italic;">加载中...</span>`;

        // 2. 注入加载状态
        targetCell.innerHTML = badgeHtml + timeHtml;
        targetCell.style.verticalAlign = 'middle';
        targetCell.style.textAlign = 'center';

        const requestUrl = `${API_BASE_URL}?PSNID=${psnId}&npid=${npId}`;

        try {
            const response = await GM.xmlHttpRequest({
                method: "GET",
                url: requestUrl,
                responseType: "json",
                timeout: 15000
            });

            // 3. 根据结果更新时间文本
            if (response.status === 200 && response.response && response.response.time) {
                const formattedTime = formatPlayDurationAsHours(response.response.time);
                timeHtml = `<span style="display: block; margin-top: 4px; font-size: 14px; font-weight: bold; color: #333; font-style: normal;">${formattedTime}</span>`;
            } else {
                timeHtml = `<span style="display: block; margin-top: 4px; font-size: 14px; font-weight: bold; color: #777; font-style: normal;">--</span>`;
            }
        } catch (error) {
            timeHtml = `<span style="display: block; margin-top: 4px; font-size: 14px; font-weight: bold; color: #dc3545; font-style: normal;">加载失败</span>`;
        }

        // 4. 注入最终内容
        targetCell.innerHTML = badgeHtml + timeHtml;
    }

    async function runOnGameDetailPage(username) {
        const npCommId = parseNpCommunicationId();
        if (!npCommId) {
            return;
        }

        renderPlaytimeOnGamePage('<strong>我的游玩时长:</strong> <em style="color: #999; font-style: italic;">正在加载...</em>');

        const requestUrl = `${API_BASE_URL}?PSNID=${username}&npid=${npCommId}`;

        try {
            const response = await GM.xmlHttpRequest({
                method: "GET",
                url: requestUrl,
                responseType: "json",
                timeout: 15000
            });

            if (response.status === 200 && response.response) {
                const data = response.response;

                if (data.time) {
                    const formattedTime = formatPlayDuration(data.time);
                    renderPlaytimeOnGamePage(`<strong>我的游玩时长:</strong> <em style="color: #3890ff; font-weight: bold; font-style: normal;">${formattedTime}</em>`);
                } else {
                    renderPlaytimeOnGamePage('<strong>我的游玩时长:</strong> <em style="color: #777; font-style: normal;">--</em>');
                }
            } else {
                renderPlaytimeOnGamePage('<strong>我的游玩时长:</strong> <em style="color: #dc3545; font-style: normal;">加载失败</em>');
            }

        } catch (error) {
            renderPlaytimeOnGamePage('<strong>我的游玩时长:</strong> <em style="color: #dc3545; font-style: normal;">请求出错</em>');
        }
    }

    // == 修改：个人主页注入逻辑 (V2.2) ==
    async function runOnProfilePage(psnIdFromUrl) {
        const gameTable = document.querySelector('table.list');
        if (!gameTable) return;

        const rows = gameTable.querySelectorAll('tbody > tr');

        for (const tr of rows) {
            const gameLink = tr.querySelector('a[href*="/psngame/"]');
            if (!gameLink) continue;

            // 1. 严格按要求：创建全新的单元格 <td>
            const newCell = document.createElement('td');
            newCell.className = 'twoge h-p'; // 使用 P9 的样式
            newCell.style.width = '12%'; // 尝试设置一个宽度

            // 2. 严格按要求：将新单元格添加到行(tr)的末尾
            tr.appendChild(newCell);

            const href = gameLink.getAttribute('href');
            const match = href.match(/\/psngame\/(\d+)/);

            if (match && match[1]) {
                const p9Id = match[1];
                const npId = inferNpIdFromP9Id(p9Id);
                if (npId) {
                    // 3. 将新创建的 <td> 传递给函数
                    fetchAndInjectTimeInProfile(newCell, psnIdFromUrl, npId);
                } else {
                    newCell.innerHTML = '--';
                }
            } else {
                newCell.innerHTML = '--';
            }
        }
    }

    async function main() {
        const pathname = window.location.pathname;

        if (pathname.startsWith('/psngame/')) {
            const username = getCookieValue(USERNAME_COOKIE_NAME);
            if (!username) {
                return;
            }
            await runOnGameDetailPage(username);

        } else if (pathname.startsWith('/psnid/')) {
            const urlMatch = pathname.match(/\/psnid\/([^\/?]+)/);
            if (!urlMatch || !urlMatch[1]) {
                return;
            }
            const psnIdFromUrl = urlMatch[1];
            await runOnProfilePage(psnIdFromUrl);
        }
    }

    window.addEventListener('load', main);

})();