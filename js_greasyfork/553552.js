// ==UserScript==
// @name         PTT Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script to download PTT beauty image
// @license MIT
// @author       scbmark
// @match        https://www.ptt.cc/bbs/Beauty/M*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/553552/PTT%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/553552/PTT%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const configCss = `
        #gm_config {
            background: #fff;
            color: #000;
        }
        .config_header {
            background: #444;
            color: #fff;
            padding: 6px;
        }
    `;

    const iconCss = `
        #comic-downloader-icon {
            position: fixed;
            top: 50px;
            right: 20px;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 9999;
            transition: transform 0.3s ease;
        }
        #comic-downloader-icon:hover {
            transform: scale(1.1);
        }
        #comic-downloader-icon:active {
            transform: scale(0.9);
        }
    `;

    GM_addStyle(configCss);
    GM_addStyle(iconCss);

    const GM_config = {
        fields: {
            downloader_host: {
                label: "Downloader 位置 (例: http://192.168.1.100:8000)",
                type: "text",
                default: "http://192.168.1.100:8000"
            }
        },
        open: function () {
            const html = `
                <div id="gm_config">
                    <div class="config_header">設定 Downloader 位置</div>
                    <label>${this.fields.downloader_host.label}<br>
                        <input id="gm_host" type="text" value="${GM_getValue('downloader_host', this.fields.downloader_host.default)}">
                    </label>
                    <button id="gm_save">儲存</button>
                    <button id="gm_cancel">取消</button>
                </div>
            `;
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            Object.assign(wrapper.style, {
                position: 'fixed',
                top: '20%',
                left: '30%',
                padding: '20px',
                border: '2px solid #333',
                zIndex: 9999,
                background: '#fff'
            });
            document.body.appendChild(wrapper);

            wrapper.querySelector('#gm_save').onclick = () => {
                GM_setValue('downloader_host', document.getElementById('gm_host').value);
                document.body.removeChild(wrapper);
                alert('已儲存設定');
                window.location.reload();
            };

            wrapper.querySelector('#gm_cancel').onclick = () => {
                document.body.removeChild(wrapper);
            };
        }
    };

    GM_registerMenuCommand("⚙ 設定 downloader", () => GM_config.open());

    const DOWNLOADER_HOST = GM_getValue('downloader_host', 'http://192.168.1.100:8000');


    const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    `;

    // 建立包含 SVG 的 div 元素
    const iconContainer = document.createElement('div');
    iconContainer.id = 'comic-downloader-icon';
    iconContainer.innerHTML = svgIcon;
    iconContainer.style.color = '#4a90e2'; // 設置 icon 顏色

    // 新增點擊事件
    iconContainer.addEventListener('click', function () {
        sendUrlToApi(window.location.href);
    });

    // 將 icon 新增至頁面
    document.body.appendChild(iconContainer);

    function sendUrlToApi(url) {
        console.log("Sending URL:", url);
        GM_xmlhttpRequest({
            method: "POST",
            url: `${DOWNLOADER_HOST}/add-url/`,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ "url": url }),
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log("URL sent successfully!");
                    alert("URL sent successfully!");
                } else {
                    console.error("Error sending URL.");
                    alert("Error sending URL.");
                }
            },
            onerror: function (error) {
                console.error("Error:", error);
                alert("Error: " + error);
            }
        });
    }
})();
