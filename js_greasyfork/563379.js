// ==UserScript==
// @name         wnacg一键下载修复版
// @grant        window.close
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  适配新版wnacg下载页面的修改版脚本，修复分页无法显示按钮问题
// @match        *://*.wnacg.com/photos-index-aid-*
// @match        *://*.wnacg.org/photos-index-aid-*
// @match        *://*.wnacg.com/photos-index-page-*
// @match        *://*.wnacg.org/photos-index-page-*
// @match        *://*.wnacg.com/download-index-aid-*
// @match        *://*.wnacg.org/download-index-aid-*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/563379/wnacg%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/563379/wnacg%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function Run() {
        const url = location.href;
        console.log("脚本已启动，当前地址:", url);

        // 路径 A：自动化点击逻辑
        if (url.includes('download-index-aid-') && url.includes('#auto_download')) {
            ExecuteAutoClick();
            return;
        }

        // 路径 B：详情页或分页列表页，注入按钮
        // 兼容 aid- 和 page- 两种 URL
        if (url.includes('photos-index-')) {
            SetupDirectDownloadButton();
        }
    }

    function SetupDirectDownloadButton() {
        // 尝试多个可能的挂载点
        const root = document.querySelector('.asTBcell.uwthumb') || document.querySelector('.uwuinfo');
        if (!root) {
            console.log("未找到挂载点 .asTBcell.uwthumb");
            return;
        }

        // 寻找原始下载按钮以提取链接
        const originalBtn = document.querySelector('a[href^="/download-index-aid-"]');
        if (!originalBtn) {
            console.log("未找到原始下载按钮");
            return;
        }

        // 检查是否已经注入过，防止重复
        if (document.querySelector('#YrAutoBtn')) return;

        const autoUrl = originalBtn.href + "#auto_download";

        const btnHtml = `
            <a id="YrAutoBtn" class="btn"
               style="width:130px; background-color: #ff8c00 !important; color: white !important; margin-top: 5px; display: inline-block; text-align: center; transition: all 0.3s;"
               href="${autoUrl}" target="_blank">
               自动下载 (新版适配)
            </a>`;

        root.insertAdjacentHTML('beforeend', btnHtml);

        const yrBtn = document.querySelector('#YrAutoBtn');
        yrBtn.addEventListener('click', function() {
            this.style.backgroundColor = "#555555";
            this.style.opacity = "0.7";
            this.innerText = "正在尝试下载...";
            this.style.cursor = "default";
            console.log("自动化指令已发出");
        });

        console.log("自动化跳转按钮已成功注入");
    }

    function ExecuteAutoClick() {
        let attempts = 0;
        const maxAttempts = 30;

        const checkInterval = setInterval(() => {
            const btn = document.querySelector('button[onclick^="directDownload"]') ||
                        document.querySelector('.download_btn'); // 备选类名

            if (btn) {
                clearInterval(checkInterval);
                console.log("已定位下载按钮，执行点击...");
                btn.click();

                setTimeout(() => {
                    window.close();
                }, 5000);
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.error("未能找到下载按钮");
                }
            }
        }, 500);
    }

    Run();
})();