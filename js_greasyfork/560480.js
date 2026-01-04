// ==UserScript==
// @name         哔哩哔哩提醒
// @license      GNU General Public License v3.0
// @namespace    http://tampermonkey.net/
// @version      2025-12-28
// @description  通过对哔哩哔哩进行篡改，使用户沉迷哔哩哔哩的状态减轻。同时脚本内有白名单，如果需要，可以在油猴中进行增加白名单。
// @author       yukigamau
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/560480/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/560480/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

let lockTimerID = null;

(function ()
 {
    'use strict';

    if(changeHome())
    {
        return;
    }

    iniExcept();

    if(except())
    {
        return;
    }

    addExceptButton();
    lockTimerID = setTimeout(() => {
        document.open();
        document.write(`
            <html>
            <head>
                <meta charset="UTF-8">
                <title>学习！</title>
                <style>
                    body {
                        background: #000000;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-size: 80px;
                        font-weight: bold;
                        color: #ffffff;
                        user-select: none;
                        position: relative;
                    }

                    #backBtn {
                        position: fixed;
                        bottom: 40px;
                        right: 40px;
                        padding: 15px 30px;
                        font-size: 28px;
                        background: #ffffff;
                        color: #000000;
                        border-radius: 12px;
                        cursor: pointer;
                        border: none;
                        font-weight: bold;
                    }
                    #backBtn:hover {
                        background: #dddddd;
                    }
                </style>
            </head>
            <body>
                学习
                <button id="backBtn">返回原页面</button>
                <script>
                    document.getElementById("backBtn").onclick = () => {
                        location.reload();
                    };
                </script>
            </body>
            </html>
        `);
        document.close();
    }, 60 * 1000);

})();

function addExceptButton()
{
    const btn = document.createElement('button');
    btn.textContent = '允许此页面';

    btn.style.position = 'fixed';
    btn.style.right = '40px';
    btn.style.bottom = '40px';
    btn.style.zIndex = '99999';
    btn.style.padding = '12px 22px';
    btn.style.fontSize = '16px';
    btn.style.borderRadius = '12px';
    btn.style.border = 'none';
    btn.style.background = '#000000';
    btn.style.color = '#ffffff';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,.3)';

    btn.onclick = () =>
    {
        let url = window.location.href;
        url = url.split('?')[0];
        const queue = GM_getValue('exceptQueue', []);

        if (!queue.includes(url))
        {
            queue.push(url);
            GM_setValue('exceptQueue', queue);
        }

        btn.textContent = '已添加';
        clearTimeout(lockTimerID);
        setTimeout(()=>
                   {
            btn.remove();
        }, 300);
    };

    document.body.appendChild(btn);
}

function changeHome()
{
    const url=window.location.href;
    if(url=="https://www.bilibili.com/" || url == 'https://www.bilibili.com/?spm_id_from=333.337.0.0')
    {
        window.location.replace('https://search.bilibili.com/all');
        return true;
    }
    return false;
}

function iniExcept()
{
    if(!GM_getValue('exceptQueue'))
    {
        GM_setValue('exceptQueue',[
            'https://www.bilibili.com/video/BV1KY4y1J7eA/'
        ]);
    }
}

function except()
{
    /** @type {string[]} */
    let queue = GM_getValue('exceptQueue', []);
    // queue.push('https://www.bilibili.com/video/BV17kJ7zjE66/?spm_id_from=333.1391.0.0&vd_source=d7242f99caf52ddf46c12abbcbb5175f');
    // queue.push('https://www.bilibili.com/video/BV1qYSvBHELW/?spm_id_from=333.337.top_right_bar_window_default_collection.content.click&vd_source=d7242f99caf52ddf46c12abbcbb5175f');

    let url=window.location.href;
    url = url.split('?')[0];
    for(const s of queue)
    {
        if(url==s)
        {
            return true; // 表示这个网页是要放弃管理的
        }
    }
    return false; // 默认是要接管处理的
}