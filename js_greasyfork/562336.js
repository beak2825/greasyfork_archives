// ==UserScript==
// @name         GlobalMagic 常用 SDP 导航
// @namespace    http://tampermonkey.net/
// @version      2025-04-21
// @description  SDP 快捷按钮，在页面上插入半透明浮层，点击后复制相应指令。
// @author       chenzhenrui.me
// @match        https://ste-sys-i18n.tiktok-row.net/sdp/*
// @match        https://gpcp.tiktok-row.net/sdp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok-row.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562336/GlobalMagic%20%E5%B8%B8%E7%94%A8%20SDP%20%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/562336/GlobalMagic%20%E5%B8%B8%E7%94%A8%20SDP%20%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const data = [
        {text: 'PM2 STOP ALL', content: 'pm2 stop all'},
        {divider: true},
        {text: 'serverCommon 日志目录', content: '/opt/tiger/toutiao/log/run/'},
        {text: 'serverCommon Controller 目录 cd', content: 'cd /opt/tiger/tiktok/app/magic_eco_server_common/packages/apps/campaign/packages/magic/server_common/app/controller'},
        {text: 'serverCommon Reboot', content: 'bash /opt/tiger/tiktok/app/magic_eco_server_common/packages/apps/campaign/packages/magic/server_common/bootstrap.sh'},
        {divider: true},
        {text: 'Runtime 日志目录', content: '/opt/tiger/toutiao/log/run/'},
        {text: 'Runtime generate 目录 cd', content: 'cd /opt/tiger/ies/fe/magic-eco-runtime/packages/apps/campaign/packages/magic/plugin_common/app/service/generate'},
        {text: 'Runtime Controller 目录 cd', content: 'cd /opt/tiger/ies/fe/magic-eco-runtime/packages/apps/campaign/packages/magic/server_runtime/app/controller'},
        {text: 'Runtime Reboot', content: 'bash /opt/tiger/ies/fe/magic-eco-runtime/packages/apps/campaign/packages/magic/server_runtime/bootstrap.sh'},
    ];

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '10px';
    container.style.zIndex = '9999';
    container.style.background = 'rgba(0, 0, 0, .3)';

    data.forEach(item => {
        if (item.divider) {
            const br = document.createElement('br');
            container.appendChild(br);
        } else {
            const button = document.createElement('button');
            button.textContent = item.text;
            button.style.margin = '6px';
            button.style.padding = '6px';
            button.addEventListener('click', () => {
                const textArea = document.createElement('textarea');
                textArea.value = item.content;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                const toast = document.createElement('div');
                toast.textContent = '内容已复制到剪贴板';
                toast.style.position = 'fixed';
                toast.style.bottom = '20px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.backgroundColor = '#333';
                toast.style.color = 'white';
                toast.style.padding = '10px 20px';
                toast.style.borderRadius = '5px';
                toast.style.zIndex = '9999';
                document.body.appendChild(toast);

                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 2000);
            });
            container.appendChild(button);
        }
    });

    document.body.appendChild(container);
})();