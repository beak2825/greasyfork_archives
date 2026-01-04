// ==UserScript==
// @name         B站直播间快捷键点赞
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按下 CURL + SHIFT + ALT + Z + A + N 组合键点赞
// @author       Copilot
// @license      GPL-3.0
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548816/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/548816/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectCode() {
        if (!/^https?:\/\/live\.bilibili\.com\/\d+\??.*/.test(document.URL)) {
            return;
        }

        // 创建按钮
        const button = document.createElement('button');
        button.innerText = '点个赞';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#ff6699';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';

        document.body.appendChild(button);

        // 点赞函数
        function triggerLike() {
            const cookies = document.cookie.split(';');
            const csrf = cookies.find(x => x.trim().startsWith('bili_jct'))?.split('=')[1];
            const uid = window.BilibiliLive?.UID;
            const room_id = window.BilibiliLive?.ROOMID;
            const anchor_id = window.BilibiliLive?.ANCHOR_UID;

            if (!(csrf && uid && room_id && anchor_id)) {
                console.warn('缺少必要参数，无法点赞');
                return;
            }

            const click_time = 1;
            const bodyStr = `click_time=${click_time}&room_id=${room_id}&uid=${uid}&anchor_id=${anchor_id}&csrf_token=${csrf}&csrf=${csrf}&visit_id=`;

            console.log('点赞请求参数:', bodyStr);

            fetch("https://api.live.bilibili.com/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: bodyStr
            })
            .then(response => {
                if (!response.ok) throw new Error('网络请求失败');
                return response.json();
            })
            .then(data => {
                console.log('点赞成功:', data);
                button.innerText = '已点赞！';
                setTimeout(() => {
                    button.innerText = '点个赞';
                }, 2000);
            })
            .catch(error => {
                console.error('点赞失败:', error);
                button.innerText = '点赞失败';
                setTimeout(() => {
                    button.innerText = '点个赞';
                }, 2000);
            });
        }

        // 鼠标点击事件
        button.addEventListener('click', () => {
            triggerLike();
        });

        // 键盘组合键监听
        const pressedKeys = {};

        document.addEventListener('keydown', (event) => {
            pressedKeys[event.key.toLowerCase()] = true;

            if (
                event.ctrlKey &&
                event.shiftKey &&
                event.altKey &&
                pressedKeys['z'] &&
                pressedKeys['a'] &&
                pressedKeys['n']
            ) {
                triggerLike();
            }
        });

        document.addEventListener('keyup', (event) => {
            delete pressedKeys[event.key.toLowerCase()];
        });
    }

    // 注入脚本
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = `
        (${injectCode.toString()})();
    `;
    document.body.appendChild(script);
})();