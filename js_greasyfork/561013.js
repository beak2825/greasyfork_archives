// ==UserScript==
// @name        E-Hentai In-Library Checker
// @namespace   https://github.com/Putarku
// @match       https://exhentai.org/*
// @match       https://e-hentai.org/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     2.0
// @author      Putarku / Modified by rosystain
// @description Checks if galleries on ExHentai/E-Hentai are already in your Komga library using the URL index API.
// @license      MIT; 此协议仅适用于本人修改的部分，原代码版权归原作者所有
// @downloadURL https://update.greasyfork.org/scripts/561013/E-Hentai%20In-Library%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/561013/E-Hentai%20In-Library%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 用户配置 ---
    function getSetting(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    }

    function setSetting(key, value) {
        GM_setValue(key, value);
    }

    // 注册设置菜单
    GM_registerMenuCommand("设置 Komga 服务器", () => {
        const currentUrl = getSetting('komga_server_url', 'http://127.0.0.1:5001');
        const newUrl = prompt('请输入 Komga 服务器地址:', currentUrl);
        if (newUrl !== null && newUrl.trim() !== '') {
            setSetting('komga_server_url', newUrl.trim().replace(/\/$/, ''));
            alert('设置已保存！');
        }
    });

    const KOMGA_SERVER = getSetting('komga_server_url', 'http://127.0.0.1:5001');
    const API_URL = `${KOMGA_SERVER}/api/komga/index/query`;

    GM_addStyle(`
        .lrr-marker-span {
            font-weight: bold;
            border-radius: 3px;
            padding: 0px 3px;
            margin-right: 4px;
            font-size: 0.9em;
        }

        .lrr-marker-downloaded {
            color: #dddddd;
            background-color: #49995d;
        }

        .lrr-marker-error {
            color: #dc3545;
            background-color: #fbe9ea;
        }
    `);

    // --- 缓存逻辑 ---
    const CACHE_KEY = 'komgaCheckerCache';
    let komgaCache = JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};

    function saveCache() {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(komgaCache));
    }

    const currentUrl = window.location.href;
    const galleryPageRegex = /https:\/\/(ex|e-)hentai\.org\/g\/\d+\/[a-z0-9]+\/?$/;

    // --- 页面路由 ---
    if (galleryPageRegex.test(currentUrl)) {
        handleSingleGalleryPage();
    } else {
        handleGalleryListPage();
    }

    function handleSingleGalleryPage() {
        const titleElement = document.querySelector('#gn');
        if (!titleElement) return;

        const cachedStatus = komgaCache[currentUrl];
        if (cachedStatus !== undefined) {
            console.log(`[Komga Checker] Found in cache: ${currentUrl} (${cachedStatus ? 'downloaded' : 'not found'})`);
            if (cachedStatus) {
                addMarker(titleElement, 'downloaded');
            }
            return;
        }

        console.log(`[Komga Checker] Checking single gallery: ${currentUrl}`);
        checkGalleries([currentUrl], new Map([[currentUrl, titleElement]]));
    }

    function handleGalleryListPage() {
        const galleryLinks = document.querySelectorAll('.itg .gl1t a[href*="/g/"]');
        if (!galleryLinks.length) return;

        const galleriesToCheck = [];
        const elementMap = new Map();

        galleryLinks.forEach(linkElement => {
            const galleryUrl = linkElement.href;
            const titleElement = linkElement.querySelector('.glink');

            if (!galleryUrl || !titleElement || titleElement.querySelector('.lrr-marker-span')) {
                return;
            }

            const cachedStatus = komgaCache[galleryUrl];
            if (cachedStatus !== undefined) {
                if (cachedStatus) {
                    addMarker(titleElement, 'downloaded');
                }
            } else if (!elementMap.has(galleryUrl)) {
                galleriesToCheck.push(galleryUrl);
                elementMap.set(galleryUrl, titleElement);
            }
        });

        if (galleriesToCheck.length === 0) return;

        console.log(`[Komga Checker] Checking ${galleriesToCheck.length} galleries in a batch request.`);
        checkGalleries(galleriesToCheck, elementMap);
    }

    function checkGalleries(urls, elementMap) {
        const payload = { urls: urls };

        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(payload),
            onload: function (response) {
                try {
                    const result = JSON.parse(response.responseText);

                    if (result.results) {
                        for (const [url, data] of Object.entries(result.results)) {
                            const titleElement = elementMap.get(url);
                            if (titleElement) {
                                if (data.found) {
                                    console.log(`[Komga Checker] Found: ${url} -> Book ID: ${data.book_id}`);
                                    addMarker(titleElement, 'downloaded');
                                    komgaCache[url] = true;
                                } else {
                                    komgaCache[url] = false;
                                }
                            }
                        }
                        saveCache();
                        console.log(`[Komga Checker] Batch check complete. Found: ${result.summary.found}/${result.summary.total}`);
                    }
                } catch (e) {
                    console.error(`[Komga Checker] Error parsing JSON:`, e, response.responseText);
                    markUrlsAsError(elementMap, urls);
                }
            },
            onerror: function (error) {
                console.error(`[Komga Checker] Network error:`, error);
                markUrlsAsError(elementMap, urls);
            }
        });
    }

    function addMarker(titleElement, status) {
        if (!titleElement || titleElement.querySelector('.lrr-marker-span')) {
            return;
        }
        let markerSpan = document.createElement('span');
        markerSpan.classList.add('lrr-marker-span');

        switch (status) {
            case 'downloaded':
                markerSpan.classList.add('lrr-marker-downloaded');
                markerSpan.textContent = '✔';
                break;
            case 'error':
            default:
                markerSpan.classList.add('lrr-marker-error');
                markerSpan.textContent = '❓';
                break;
        }
        titleElement.prepend(markerSpan);
    }

    function markUrlsAsError(elementMap, urls) {
        urls.forEach(url => {
            const titleElement = elementMap.get(url);
            if (titleElement) {
                addMarker(titleElement, 'error');
            }
        });
    }
})();
