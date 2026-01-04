// ==UserScript==
// @name         Dlsite音声引流狗
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Adds buttons to DLsite ASMR pages to link to ASMR.one and search on JapaneseASMR.
// @author       Moeary
// @match        https://www.dlsite.com/maniax/work/=/product_id/RJ*.html
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.asmr-200.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549722/Dlsite%E9%9F%B3%E5%A3%B0%E5%BC%95%E6%B5%81%E7%8B%97.user.js
// @updateURL https://update.greasyfork.org/scripts/549722/Dlsite%E9%9F%B3%E5%A3%B0%E5%BC%95%E6%B5%81%E7%8B%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 检查页面是否为 "音声・ASMR" 类型
    const genreElement = document.querySelector('#category_type .icon_SOU');
    if (!genreElement || !genreElement.title.includes('音声')) {
        console.log('This is not an ASMR/audio work. Script will not run.');
        return;
    }

    // 2. 查找语言选择区块并构建待检查的 RJ 号列表
    const languageLinks = document.querySelectorAll('.work_edition_linklist_item');
    let rjCodesToCheck = [];
    const priority = ['简体中文', '繁体中文', '日文'];

    if (languageLinks.length > 0) {
        console.log('Multiple language versions found. Building prioritized list...');
        const languageMap = {};
        languageLinks.forEach(link => {
            const lang = link.innerText.trim();
            const rjMatch = link.href.match(/(RJ\d+)/);
            if (rjMatch) {
                languageMap[lang] = rjMatch[1];
            }
        });

        priority.forEach(lang => {
            if (languageMap[lang]) {
                rjCodesToCheck.push({ lang, code: languageMap[lang] });
            }
        });
    }

    if (rjCodesToCheck.length === 0) {
        const rjMatch = window.location.href.match(/(RJ\d+)/);
        if (rjMatch) {
            console.log('Single language version found.');
            rjCodesToCheck.push({ lang: '当前', code: rjMatch[1] });
        }
    }

    if (rjCodesToCheck.length === 0) {
        console.error('Could not find any RJ code to check.');
        return;
    }

    const currentRjCode = rjCodesToCheck[0].code; // 使用最高优先级的RJ号用于JapaneseASMR
    console.log('RJ codes to check (in order of priority):', rjCodesToCheck);

    // 为 JapaneseASMR 添加直接跳转按钮 (因为Cloudflare无法预检)
    addJapaneseAsmrButton(`https://japaneseasmr.com/dlc.php?f=${currentRjCode}`);

    // 3. 检查 ASMR.one API
    checkNextRjCode(0);

    function checkNextRjCode(index) {
        if (index >= rjCodesToCheck.length) {
            console.log('All language versions checked. No corresponding work found via ASMR.one API.');
            return;
        }

        const item = rjCodesToCheck[index];
        const rjNumber = item.code.substring(2);
        const apiUrl = `https://api.asmr-200.com/api/work/${rjNumber}`;

        console.log(`[API Check] Checking for ${item.lang} (${item.code}) via API: ${apiUrl}`);

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: { "Referer": "https://www.asmr.one/" },
            onload: function(response) {
                if (response.status === 200) {
                    const asmrOneUrl = `https://www.asmr.one/work/${item.code}`;
                    console.log(`Success! Found valid work for ${item.lang} via API. URL: ${asmrOneUrl}`);
                    addAsmrOneButton(asmrOneUrl);
                } else {
                    checkNextRjCode(index + 1);
                }
            },
            onerror: function() {
                checkNextRjCode(index + 1);
            }
        });
    }

    function getButtonContainer() {
        let trialContainer = document.querySelector('.trial_download ul');
        if (trialContainer) return trialContainer;

        // 如果找不到，则在最后一个 banner 后面创建
        const banners = document.querySelectorAll('div[data-ga4-ref="work_banner"]');
        if (banners.length > 0) {
            const lastBanner = banners[banners.length - 1];
            let newContainer = document.querySelector('.rdl_button_container');
            if (!newContainer) {
                newContainer = document.createElement('ul');
                newContainer.className = 'rdl_button_container';
                newContainer.style.listStyle = 'none';
                newContainer.style.padding = '0';
                newContainer.style.margin = '0';
                lastBanner.parentNode.insertBefore(newContainer, lastBanner.nextSibling);
            }
            return newContainer;
        }
        return null;
    }

    function addButton(url, text, className, title) {
        const container = getButtonContainer();
        if (!container) {
            console.error('Could not find or create a container for the buttons.');
            return;
        }

        const newButtonLi = document.createElement('li');
        newButtonLi.style.marginTop = '10px';

        const newButtonA = document.createElement('a');
        newButtonA.href = url;
        newButtonA.target = '_blank';
        newButtonA.className = className;
        newButtonA.title = title;
        newButtonA.innerText = text;

        // 如果是 trial_download 容器，需要多包一层 <p>
        if (container.parentElement.classList.contains('trial_download')) {
            const newButtonP = document.createElement('p');
            newButtonP.className = 'trial_file';
            newButtonP.appendChild(newButtonA);
            newButtonLi.appendChild(newButtonP);
        } else {
            newButtonLi.appendChild(newButtonA);
        }

        container.appendChild(newButtonLi);
    }

    function addAsmrOneButton(url) {
        addButton(url, '去ASMR Online', 'btn_asmr_online', '去ASMR Online试听');
    }

    function addJapaneseAsmrButton(url) {
        addButton(url, '搜 JapaneseASMR', 'btn_japanese_asmr', '在JapaneseASMR上搜索此资源');
    }

    GM_addStyle(`
        .btn_asmr_online, .btn_japanese_asmr {
            display: inline-block; box-sizing: border-box; width: 100%; text-align: center;
            font-weight: bold; font-size: 16px; line-height: 40px; border-radius: 5px;
            color: #fff !important; text-decoration: none; padding: 0 15px;
        }
        .btn_asmr_online:hover, .btn_japanese_asmr:hover { color: #fff !important; }
        .btn_asmr_online::before, .btn_japanese_asmr::before { content: '\\f019'; font-family: FontAwesome; margin-right: 8px; }

        .btn_asmr_online { background: #f8c300 !important; border-bottom: 3px solid #d8a900 !important; }
        .btn_asmr_online:hover { background: #ffd42d !important; }

        .btn_japanese_asmr { background: #409eff !important; border-bottom: 3px solid #0073e0 !important; }
        .btn_japanese_asmr:hover { background: #66b1ff !important; }
    `);
})();