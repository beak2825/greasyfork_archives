// ==UserScript==
// @name         vxBilibili 網址複製按鈕
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  將 Bilibili 連結改為vxbilibili並省略後續參數以簡潔網址，並提供帶標題和純網址兩種複製選項，按鈕固定在右下角，可自訂顏色
// @author       夙
// @match        *://www.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550908/vxBilibili%20%E7%B6%B2%E5%9D%80%E8%A4%87%E8%A3%BD%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/550908/vxBilibili%20%E7%B6%B2%E5%9D%80%E8%A4%87%E8%A3%BD%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 預設顏色
    const defaultColors = {
        titleBtn: '#E27B99',
        pureUrlBtn: '#00a1d6'
    };
    let currentColors = { ...defaultColors };

    // 這裡定義您要修改的連結規則
    function modifyLink(originalUrl) {
        if (!originalUrl) {
            return '';
        }

        // 1. 將網址中的 "bilibili" 修改為 "vxbilibili"
        let modifiedUrl = originalUrl.replace('bilibili.com', 'vxbilibili.com');

        // 2. 使用正規表示式來簡潔化連結，移除後面的參數
        const regex = /(https?:\/\/www\.vxbilibili\.com\/video\/(?:[aA][vV][0-9]+|[bB][vV][0-9a-zA-Z]+))(?:\/|\?.*)?/;
        const match = modifiedUrl.match(regex);

        if (match && match[1]) {
            return match[1] + '/';
        } else {
            return modifiedUrl;
        }
    }

    // 獲取並清理頁面標題
    function getCleanTitle() {
        let pageTitle = document.title;
        const suffix = '_哔哩哔哩_bilibili';
        if (pageTitle.endsWith(suffix)) {
            pageTitle = pageTitle.slice(0, -suffix.length);
        }
        return pageTitle;
    }

    // 複製內容到剪貼簿的通用函數
    function copyToClipboard(content, alertMessage) {
        const tempInput = document.createElement('textarea');
        tempInput.value = content;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert(alertMessage + '\n' + content);
    }

    // 創建一個按鈕並添加到頁面上
    function createButton(text, bottom, color, iconPath, id) {
        const button = document.createElement('button');
        button.innerText = text;
        button.id = id;
        button.classList.add('custom-copy-btn');
        button.style.position = 'fixed';
        button.style.bottom = bottom + 'px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // 創建並添加圖示
        const icon = document.createElement('div');
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" style="fill: currentColor;"><path d="${iconPath}"></path></svg>`;
        icon.style.display = 'inline-block';
        icon.style.verticalAlign = 'middle';
        icon.style.marginRight = '5px';
        button.prepend(icon);
        button.style.display = 'flex';
        button.style.alignItems = 'center';

        document.body.appendChild(button);
        return button;
    }

    // 創建顏色設定面板
    function createColorPanel() {
        const panel = document.createElement('div');
        panel.id = 'color-settings-panel';
        panel.style.position = 'fixed';
        panel.style.bottom = '120px'; // 調整位置，避免與按鈕重疊
        panel.style.right = '20px';
        panel.style.zIndex = '10000';
        panel.style.background = '#fff';
        panel.style.padding = '15px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        panel.style.border = '1px solid #ddd';
        panel.style.display = 'none';

        panel.innerHTML = `
            <div style="margin-bottom: 10px; color: black; font-family: sans-serif;">
                <label for="title-color-picker">帶標題按鈕顏色：</label>
                <input type="color" id="title-color-picker" value="${currentColors.titleBtn}">
            </div>
            <div style="margin-bottom: 15px; color: black; font-family: sans-serif;">
                <label for="url-color-picker">純網址按鈕顏色：</label>
                <input type="color" id="url-color-picker" value="${currentColors.pureUrlBtn}">
            </div>
            <button id="save-colors-btn" style="width: 100%; padding: 8px; background-color: #00a1d6; color: white; border: none; border-radius: 4px; cursor: pointer;">儲存設定</button>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // 執行腳本
    async function init() {
        const isVideoPage = window.location.href.includes('/video/');
        // 只在影片頁面執行
        if (!isVideoPage) {
            return;
        }

        // 避免重複創建按鈕
        if (document.querySelector('.custom-copy-btn-group')) {
            return;
        }

        // 從儲存中載入顏色設定
        currentColors.titleBtn = await GM_getValue('titleBtnColor', defaultColors.titleBtn);
        currentColors.pureUrlBtn = await GM_getValue('pureUrlBtnColor', defaultColors.pureUrlBtn);

        const cleanTitle = getCleanTitle();
        const modifiedUrl = modifyLink(window.location.href);

        // 創建帶標題的複製按鈕 (圖示為分享)
        const copyWithTitleButton = createButton(
            '複製帶標題鏈結',
            70,
            currentColors.titleBtn,
            'M12.6058 10.3326V5.44359C12.6058 4.64632 13.2718 4 14.0934 4C14.4423 4 14.78 4.11895 15.0476 4.33606L25.3847 12.7221C26.112 13.3121 26.2087 14.3626 25.6007 15.0684C25.5352 15.1443 25.463 15.2144 25.3847 15.2779L15.0476 23.6639C14.4173 24.1753 13.4791 24.094 12.9521 23.4823C12.7283 23.2226 12.6058 22.8949 12.6058 22.5564V18.053C7.59502 18.053 5.37116 19.9116 2.57197 23.5251C2.47607 23.6489 2.00031 23.7769 2.00031 16.2165 3.90102 10.3326 12.6058 10.3326Z',
            'copy-title-btn'
        );
        copyWithTitleButton.classList.add('custom-copy-btn-group');

        const copyPureUrlButton = createButton(
            '複製純網址',
            20,
            currentColors.pureUrlBtn,
            'M12.6058 10.3326V5.44359C12.6058 4.64632 13.2718 4 14.0934 4C14.4423 4 14.78 4.11895 15.0476 4.33606L25.3847 12.7221C26.112 13.3121 26.2087 14.3626 25.6007 15.0684C25.5352 15.1443 25.463 15.2144 25.3847 15.2779L15.0476 23.6639C14.4173 24.1753 13.4791 24.094 12.9521 23.4823C12.7283 23.2226 12.6058 22.8949 12.6058 22.5564V18.053C7.59502 18.053 5.37116 19.9116 2.57197 23.5251C2.47607 23.6489 2.00031 23.7769 2.00031 16.2165 3.90102 10.3326 12.6058 10.3326Z',
            'copy-url-btn'
        );
        copyPureUrlButton.classList.add('custom-copy-btn-group');

        // 添加事件監聽
        copyWithTitleButton.addEventListener('click', function() {
            const finalContent = `【${cleanTitle}】` + modifiedUrl;
            copyToClipboard(finalContent, '鏈結已複製：');
        });

        copyPureUrlButton.addEventListener('click', function() {
            copyToClipboard(modifiedUrl, '網址已複製：');
        });

        // 創建設定按鈕和面板
        const settingsButton = createButton(
            '設定',
            120,
            '#6c757d',
            'M20.25 15.4688H23.5C24.3284 15.4688 25 14.7972 25 13.9688C25 13.1404 24.3284 12.4688 23.5 12.4688H20.25C20.25 11.8393 20.0811 11.2366 19.7915 10.6974L22.1287 8.36029C22.7153 7.77366 22.7153 6.82914 22.1287 6.24251C21.542 5.65588 20.5975 5.65588 20.0109 6.24251L17.6737 8.57964C17.1345 8.29007 16.5318 8.12117 15.9023 8.12117V4.87117C15.9023 4.04275 15.2307 3.37117 14.4023 3.37117C13.5739 3.37117 12.9023 4.04275 12.9023 4.87117V8.12117C12.2728 8.12117 11.6701 8.29007 11.1309 8.57964L8.79374 6.24251C8.20711 5.65588 7.26259 5.65588 6.67596 6.24251C6.08933 6.82914 6.08933 7.77366 6.67596 8.36029L9.01309 10.6974C8.72352 11.2366 8.55461 11.8393 8.55461 12.4688H5.30461C4.47619 12.4688 3.80461 13.1404 3.80461 13.9688C3.80461 14.7972 4.47619 15.4688 5.30461 15.4688H8.55461C8.55461 16.0983 8.72352 16.701 9.01309 17.2402L6.67596 19.5773C6.08933 20.164 6.08933 21.1085 6.67596 21.6951C7.26259 22.2818 8.20711 22.2818 8.79374 21.6951L11.1309 19.358C11.6701 19.6476 12.2728 19.8165 12.9023 19.8165V23.0665C12.9023 23.8949 13.5739 24.5665 14.4023 24.5665C15.2307 24.5665 15.9023 23.8949 15.9023 23.0665V19.8165C16.5318 19.8165 17.1345 19.6476 17.6737 19.358L20.0109 21.6951C20.5975 22.2818 21.542 22.2818 22.1287 21.6951C22.7153 21.1085 22.7153 20.164 22.1287 19.5773L19.7915 17.2402C20.0811 16.701 20.25 16.0983 20.25 15.4688ZM14.4023 17.4688C12.4412 17.4688 10.8447 15.8723 10.8447 13.9112C10.8447 11.95 12.4412 10.3535 14.4023 10.3535C16.3634 10.3535 17.9599 11.95 17.9599 13.9112C17.9599 15.8723 16.3634 17.4688 14.4023 17.4688Z',
            'settings-btn'
        );
        const settingsPanel = createColorPanel();

        settingsButton.addEventListener('click', function(event) {
            event.stopPropagation();
            settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
        });

        // 儲存顏色設定
        document.getElementById('save-colors-btn').addEventListener('click', async function() {
            const newTitleColor = document.getElementById('title-color-picker').value;
            const newUrlColor = document.getElementById('url-color-picker').value;
            await GM_setValue('titleBtnColor', newTitleColor);
            await GM_setValue('pureUrlBtnColor', newUrlColor);
            alert('顏色設定已儲存！請重新整理頁面以查看變更。');
            settingsPanel.style.display = 'none';
        });

        // 點擊面板外部時隱藏
        document.addEventListener('click', function(event) {
            const target = event.target;
            const isClickInsidePanel = settingsPanel.contains(target) || settingsButton.contains(target);
            if (!isClickInsidePanel) {
                settingsPanel.style.display = 'none';
            }
        });
    }

    // 在頁面載入後延遲執行，確保所有元素都存在
    setTimeout(init, 1000);

})();