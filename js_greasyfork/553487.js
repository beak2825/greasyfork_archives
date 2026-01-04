// ==UserScript==
// @name         Javdb自动搜索外部资源
// @namespace    Javdb
// @version      3.6.1
// @description  根据番号搜索外部资源,自动搜索影片的外部资源,包括BT下载,字幕,在线播放等等
// @author       sexjpg
// @match        *://*.javdb.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @connect      123av.com
// @connect      missav.ws
// @connect      7mmtv.sx
// @connect      javfc2.xyz
// @connect      sukebei.nyaa.si
// @connect      supjav.com
// @connect      3xplanet.com
// @connect      bt4gprx.com
// @connect      subtitlecat.com
// @downloadURL https://update.greasyfork.org/scripts/553487/Javdb%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/553487/Javdb%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%A4%96%E9%83%A8%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==
//

(function () {
    'use strict';

    // 注入自定义CSS样式
    const customCSS = `
/* 浮动菜单样式 */
#floating-menu {
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 200px;
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px;
    border-radius: 0 10px 10px 0;
    z-index: 10000;
    cursor: grab;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
}

/* 按钮颜色类 */
.bg-blue-500 {
    background-color: rgb(59 130 246) !important;
}

.bg-green-500 {
    background-color: rgb(34 197 94) !important;
}

.bg-red-500 {
    background-color: rgb(239 68 68) !important;
}

.bg-purple-500 {
    background-color: rgb(168 85 247) !important;
}

.bg-yellow-500 {
    background-color: rgb(234 179 8) !important;
}

.bg-orange-500 {
    background-color: rgb(249 115 22) !important;
}

.bg-gray-500 {
    background-color: rgb(107 114 128) !important;
}

/* 加载动画样式 */
.loading-container {
    display: inline-flex;
    align-items: center;
    margin-left: 0.5rem;
}

.loading-spinner {
    width: 1.2rem;
    height: 1.2rem;
    border: 3px solid rgba(243, 243, 243, 0.2);
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

.loading-progress {
    width: 100px;
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
    margin-left: 0.5rem;
    overflow: hidden;
}

.text-gray-500 {
    color: rgb(107 114 128);
}

.ml-2 {
    margin-left: 0.5rem;
}

/* 结果容器样式 */
.resultContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

/* 通用样式 */
.inline-block {
    display: inline-block;
}

.text-white {
    color: white;
}

.px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
}

.rounded {
    border-radius: 0.25rem;
}

.mt-2 {
    margin-top: 0.5rem;
}

.ml-2 {
    margin-left: 0.5rem;
}

/* 充能按钮样式 */
.relative {
    position: relative;
}

.overflow-hidden {
    overflow: hidden;
}

.rounded-lg {
    border-radius: 0.5rem;
}

.absolute {
    position: absolute;
}

.inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.bg-green-500\\/50 {
    background-color: rgba(34, 197, 94, 0.5);
}

.bg-transparent {
    background-color: transparent;
}

.px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
}

.py-1\\.5 {
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.duration-200 {
    transition-duration: 200ms;
}

.hover\\:scale-105:hover {
    transform: scale(1.05);
}

.hover\\:shadow-lg:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.active\\:scale-95:active {
    transform: scale(0.95);
}

/* 动画关键帧 */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

    // 创建样式元素并添加到页面
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);
    var Glob_enableCharging;
    var cache = {}
    async function setCache(key, value) {
        cache = await GM.getValue('cache', {});
        cache[key] = value;
        await GM.setValue('cache', cache);
    }
    async function getCache(key, value = null) {
        cache = await GM.getValue('cache', {});
        // console.log(key,cache[key],(!cache[key]));
        if (!cache[key]) { return value }
        return cache[key];
    }
    /**
     * 浮動選單類
     * 負責創建、拖動、展開/收起功能
     */
    class FloatingMenu {
        constructor(titleText) {
            this.menu = null; // 主選單容器
            this.title = null; // 選單標題
            this.content = null; // 選單內容
            this.isDragging = false; // 是否正在拖動
            this.offsetX = 0; // 拖動的水平偏移
            this.offsetY = 0; // 拖動的垂直偏移

            this.createMenu(titleText);
        }

        /**
         * 創建選單
         * @param {string} titleText - 選單標題文字
         */
        createMenu(titleText) {
            // 主容器
            this.menu = document.createElement("div");
            this.menu.id = "floating-menu";
            this.menu.style.position = "fixed";
            this.menu.style.top = "50%";
            this.menu.style.left = "0";
            this.menu.style.transform = "translateY(-50%)";
            this.menu.style.width = "200px";
            this.menu.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
            this.menu.style.color = "white";
            this.menu.style.padding = "10px";
            this.menu.style.borderRadius = "0 10px 10px 0";
            this.menu.style.zIndex = "10000";
            this.menu.style.cursor = "grab";
            this.menu.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.3)";
            this.menu.style.transition = "all 0.3s ease";
            this.menu.style.backdropFilter = "blur(4px)";
            document.body.appendChild(this.menu);
            //让菜单不显示
            this.menu.style.display = "none";

            // 標題
            this.title = document.createElement("div");
            this.title.textContent = titleText;
            this.title.style.fontWeight = "bold";
            this.title.style.marginBottom = "10px";
            this.title.style.cursor = "pointer";
            this.title.style.textAlign = "center";
            this.menu.appendChild(this.title);

            // 內容區域
            this.content = document.createElement("div");
            this.content.style.display = "none"; // 默認隱藏
            this.menu.appendChild(this.content);

            // 綁定事件
            this.addEventListeners();
        }

        /**
         * 綁定選單事件
         */
        addEventListeners() {
            // 點擊標題展開/收起內容
            this.title.addEventListener("click", () => {
                const isHidden = this.content.style.display === "none";
                this.content.style.display = isHidden ? "block" : "none";
            });

            // 拖動事件
            this.menu.addEventListener("mousedown", (e) => {
                this.isDragging = true;
                this.offsetX = e.clientX - this.menu.getBoundingClientRect().left;
                this.offsetY = e.clientY - this.menu.getBoundingClientRect().top;
                this.menu.style.cursor = "grabbing";
            });

            document.addEventListener("mousemove", (e) => {
                if (this.isDragging) {
                    this.menu.style.left = `${e.clientX - this.offsetX}px`;
                    this.menu.style.top = `${e.clientY - this.offsetY}px`;
                    this.menu.style.transform = "none";
                }
            });

            document.addEventListener("mouseup", () => {
                this.isDragging = false;
                this.menu.style.cursor = "grab";
            });
        }

        /**
         * 添加內容到選單
         * @param {HTMLElement} element - 要添加的內容
         */
        addContent(element) {
            this.content.appendChild(element);
        }
    }

    /**
     * 单个网址类
     */
    class Site {
        constructor(name, searchUrlFunc, responseHandler, buttonColor, queryInterval = 1, maxConcurrentSearches = 3) {
            this.name = name;
            this.searchUrlFunc = searchUrlFunc;
            this.responseHandler = responseHandler;
            this.buttonColor = buttonColor;
            this.queryInterval = queryInterval;
            this.maxConcurrentSearches = maxConcurrentSearches;
            this.queue = [];
            this.isSearching = 0;
        }

        addToQueue(id, element) {
            this.queue.push({
                id,
                element
            });
            if (this.isSearching < this.maxConcurrentSearches) {
                this.processQueue();
            }
        }

        async processQueue() {
            while (this.queue.length > 0 && this.isSearching < this.maxConcurrentSearches) {
                const {
                    id,
                    element
                } = this.queue.shift();
                this.isSearching++;
                try {
                    await this.search(id, element);
                } finally {
                    this.isSearching--;
                    await new Promise(resolve => setTimeout(resolve, this.queryInterval));
                }
            }
        }

        async search(id, element) {
            const cacheKey = `${this.name}_${id}`; // 緩存鍵
            const cachedResult = await Utils.getCachedResult(cacheKey); // 嘗試從緩存攞數據
            if (cachedResult) {
                if (cachedResult.url) {
                    this.addButton(element, cachedResult.url); // 如果緩存有 URL，直接生成按鈕
                }
                return;
            }

            const searchUrl = this.searchUrlFunc(id); // 生成搜索 URL
            const loadingElement = Utils.showLoading(element, this.name); // 顯示加載提示
            new Promise((resolve, reject) => {
                // 用 GM_xmlhttpRequest 發送搜索請求
                GM_xmlhttpRequest({
                    method: "GET",
                    url: searchUrl,
                    onload: (response) => {
                        let previewData = {
                            url: ''
                        }; // 初始化結果數據
                        this.responseHandler(response, id, previewData); // 調用響應處理函數
                        if (previewData.url) {
                            this.addButton(element, previewData.url); // 如果有搜索結果，生成按鈕
                        }
                        Utils.removeLoading(loadingElement); // 移除加載提示
                        Utils.cacheResult(cacheKey, previewData); // 緩存搜索結果
                    },
                    onerror: () => {
                        Utils.removeLoading(loadingElement); // 如果出錯，移除加載提示
                        console.error(`${this.name} 搜尋失敗`); // 打印錯誤信息
                    },
                });
            })
        }

        addButton(element, url) {
            const button = Utils.createButton(url, this.name, this.buttonColor);
            // element.parentElement.parentElement.appendChild(button);
            element.appendChild(button);
        }
    }

    /**
     * 管理所有网站的类
     */
    class SearchManager {
        constructor() {
            this.sites = [];
        }

        addSite(site) {
            this.sites.push(site);
        }


        async initializeSearch() {
            this.videopageSearch()
            this.wallSearch()
        }


        //单独页面搜索
        async videopageSearch() {

            //修改这里是获取番号
            const item = document.querySelector('div.panel-block.first-block')
            if (!item) return
            const activeSites = await this.getActiveSites();
            const id = item.querySelector("a.button.is-white").getAttribute('data-clipboard-text')
            const container = Utils.createDiv();
            const element = item.parentElement.parentElement
            element.appendChild(container)
            this.sites.forEach(site => {
                if (activeSites[site.name]) {
                    //不知道这里为什么不能用container,加入后没显示
                    site.addToQueue(id, element);
                }
            });
            // console.log('container',item,element,container)
        }


        async wallSearch() {
            const activeSites = await this.getActiveSites();
            const items = document.querySelectorAll('div.item')
            if (!items) return
            Utils.removeDivs()

            items.forEach(item => {
                if (!item.querySelector("div.video-title strong")) return
                let id = item.querySelector("div.video-title strong").textContent.trim();
                id = Utils.formatID(id)
                const container = Utils.createDiv();
                const element = item
                element.appendChild(container)
                this.sites.forEach(site => {
                    if (activeSites[site.name]) {
                        site.addToQueue(id, container);
                    }
                });
            });
        }

        async getActiveSites() {
            const activeSites = {};
            for (const site of this.sites) {
                activeSites[site.name] = await GM.getValue(`site_${site.name}`, true);
            }
            return activeSites;
        }
    }

    /**
     * 通用工具
     */
    class Utils {
        // 顯示加載提示
        static showLoading(element, siteName) {
            // 創建加載容器
            const loadingContainer = document.createElement("div");
            loadingContainer.className = "loading-container";
            loadingContainer.style.display = "inline-flex";
            loadingContainer.style.alignItems = "center";
            loadingContainer.style.marginLeft = "0.5rem";

            // 創建旋轉動畫
            const spinner = document.createElement("div");
            spinner.className = "loading-spinner";
            spinner.style.width = "1.2rem";
            spinner.style.height = "1.2rem";
            spinner.style.border = "3px solid rgba(243, 243, 243, 0.2)";
            spinner.style.borderTop = "3px solid #3498db";
            spinner.style.borderRadius = "50%";
            spinner.style.animation = "spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite";

            // 建立進度條
            const progressBar = document.createElement("div");
            progressBar.className = "loading-progress";
            progressBar.style.width = "100px";
            progressBar.style.height = "4px";
            progressBar.style.backgroundColor = "#e0e0e0";
            progressBar.style.borderRadius = "2px";
            progressBar.style.marginLeft = "0.5rem";
            progressBar.style.overflow = "hidden";

            const progressInner = document.createElement("div");
            progressInner.style.width = "0%";
            progressInner.style.height = "100%";
            progressInner.style.backgroundColor = "#3498db";
            progressInner.style.transition = "width 0.3s ease";
            progressBar.appendChild(progressInner);

            // 創建加載文本
            const loadingText = document.createElement("span");
            loadingText.textContent = `搜索 ${siteName}...`;
            loadingText.className = "text-gray-500 ml-2";

            // 新增樣式
            const style = document.createElement("style");
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .loading-spinner {
                    animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
                }
            `;
            document.head.appendChild(style);

            // 組裝組件
            loadingContainer.appendChild(spinner);
            loadingContainer.appendChild(progressBar);
            loadingContainer.appendChild(loadingText);
            element.appendChild(loadingContainer);

            // 更新進度條
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressInner.style.width = `${progress}%`;
                if (progress >= 100) progress = 0;
            }, 300);

            return {
                container: loadingContainer,
                interval: interval
            };
        }

        // 移除加載提示
        static removeLoading(loadingElement) {
            if (loadingElement) {
                clearInterval(loadingElement.interval);
                loadingElement.container.remove();
            }
        }
        static createChargingButton(url, text, bgColorClass) {
            const buttonContainer = document.createElement("div");
            buttonContainer.className = `relative inline-block mt-2 ml-2 overflow-hidden rounded-lg ${bgColorClass}`;
            buttonContainer.style.cursor = "pointer";

            // 充能背景
            const chargeBg = document.createElement("div");
            chargeBg.className = "absolute inset-0 bg-green-500/50";
            chargeBg.style = "width: 0%; transition: width 0.2s; background-color: rgba(0, 255, 0, 0.5); opacity: 1;"
            chargeBg.style.transition = "width 1s cubic-bezier(0.4, 0, 0.2, 1)";

            // 按鈕主體
            const linkButton = document.createElement("a");
            linkButton.textContent = text;
            linkButton.className = "relative block bg-transparent text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95";
            linkButton.style.pointerEvents = "none";

            let isCharging = false;
            let isCharged = false;

            // 開始充能
            buttonContainer.addEventListener("mousedown", () => {

                isCharging = true;
                isCharged = false;
                chargeBg.style.transition = "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
                chargeBg.style.width = "100%";
            });

            // 中斷充能
            const resetCharge = () => {
                if (!isCharged) {
                    chargeBg.style.transition = "width 0.2s ease";
                    chargeBg.style.width = "0%";
                    isCharging = false;
                }
            };

            buttonContainer.addEventListener("mouseup", resetCharge);
            buttonContainer.addEventListener("mouseleave", resetCharge);

            // 充能完成事件
            chargeBg.addEventListener("transitionend", (e) => {
                if (e.propertyName === 'width' && chargeBg.style.width === "100%" && isCharging) {
                    isCharged = true;
                    isCharging = false;

                    // 添加完成動畫
                    chargeBg.style.transition = "opacity 0.3s ease";
                    chargeBg.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
                    chargeBg.style.opacity = "0";

                    // 打開鏈接
                    setTimeout(() => {
                        if (isCharged) {
                            window.open(url, "_blank");
                        }
                        // 重置按鈕狀態
                        setTimeout(() => {
                            chargeBg.style.transition = "width 1s cubic-bezier(0.4, 0, 0.2, 1)";
                            chargeBg.style.width = "0%";
                            chargeBg.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
                            chargeBg.style.opacity = "1";
                            isCharged = false;
                        }, 300);
                    }, 100);
                }
            });

            buttonContainer.appendChild(chargeBg);
            buttonContainer.appendChild(linkButton);
            return buttonContainer;
        }


        // 創建按鈕
        static createButton(url, text, bgColorClass) {
            if (Glob_enableCharging) {
                return this.createChargingButton(url, text, bgColorClass);
            } else {
                const linkButton = document.createElement("a"); // 創建一個<a>標籤
                linkButton.href = url; // 設置按鈕嘅鏈接
                linkButton.textContent = text; // 設置按鈕嘅文字
                linkButton.className = `inline-block ${bgColorClass} text-white px-2 py-1 rounded mt-2 ml-2`; // 添加樣式
                linkButton.target = "_blank"; // 新標籤頁打開
                return linkButton;
            }
        }

        // 緩存搜尋結果（非同步）
        static async cacheResult(key, data, expiryDay = 10) {
            const timestamp = new Date().getTime(); // 獲取當前時間
            const expiry = timestamp + expiryDay * 24 * 60 * 60 * 1000; // 設置過期時間（12小時後）
            const cacheData = {
                data,
                expiry
            }; // 包裝數據同過期時間
            // await GM.setValue(key, cacheData); // 用 GM.setValue 儲存數據（非同步操作）
            await setCache(key, cacheData);
        }

        // 攞緩存結果（非同步）
        static async getCachedResult(key) {
            // const cacheData = await GM.getValue(key, null); // 用 GM.getValue 攞緩存數據（非同步操作）
            const cacheData = await getCache(key);
            if (!cacheData) return null; // 如果无缓存，返 null

            const timestamp = new Date().getTime(); // 獲取當前時間
            if (cacheData.expiry < timestamp) {
                // await GM.setValue(key, null); // 如果過期，清空緩存
                await setCache(key, null);
                return null;
            }
            return cacheData.data; // 如果未過期，返返數據
        }

        static createDiv(className = `resultContainer`) {
            const div = document.createElement('div');
            div.className = className;
            // 设置容器为flex布局，允许换行，每行最多2个子元素
            // div.style.display = "flex";
            div.style.flexWrap = "wrap";
            div.style.gap = "0.5rem";
            return div;
        }

        static removeDivs(className = `resultContainer`) {
            const divs = document.querySelectorAll(`.${className}`);
            divs.forEach(div => div.remove());
            const atags = document.querySelectorAll('a.inline-block');
            atags.forEach(a => a.remove());
        }

        static formatID(id) {
            // 如果id以'fc2-'开头，且后面全是数字，则去除'fc2-'前缀
            if (id.toLowerCase().startsWith('fc2-') && /^\d+$/.test(id.substring(4))) {
                id = id.substring(4);
            }
            return id;
        }
    }

    // 創建 SearchManager 實例
    const manager = new SearchManager();

    // 添加网站和解析结果
    manager.addSite(new Site(
        'i23av',
        id => `https://123av.com/zh/search?keyword=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const itemlinks = doc.querySelectorAll("#page-list .box-item a")
            for (let i = 0; i < itemlinks.length; i++) {
                const innertext = itemlinks[i].textContent.trim();
                if (innertext.includes(id)) {
                    previewData.url = `https://123av.com/zh/search?keyword=${id}`;
                    // previewData.url = itemlinks[i].href;
                    break;
                }
            }
        },
        'bg-blue-500'
    ));

    manager.addSite(new Site(
        'MissAV',
        id => `https://missav.ws/search/${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const matchingLink = Array.from(doc.querySelectorAll('a[alt]')).find(a => {
                const altText = a.getAttribute('alt').toLowerCase();
                const linkText = a.textContent.toLowerCase();
                return altText.includes(id.toLowerCase()) && linkText.includes(id.toLowerCase());
            });
            if (matchingLink) {
                previewData.url = `https://missav.ws/search/${id}`;
            }
        },
        'bg-green-500'
    ));

    manager.addSite(new Site(
        '7MMTV',
        id => `https://7mmtv.sx/zh/searchform_search/all/index.html?search_keyword=${encodeURIComponent(id)}&search_type=searchall&op=search`,
        (response, id, previewData) => {
            const responseText = response.responseText;
            const matchResult = responseText.match(new RegExp(`搜索 "${id}" \\((\\d+)\\)`));
            if (matchResult && parseInt(matchResult[1]) > 0) {
                previewData.url = `https://7mmtv.sx/zh/searchform_search/all/index.html?search_keyword=${encodeURIComponent(id)}`;
            }
        },
        'bg-red-500'
    ));

    manager.addSite(new Site(
        'JAVFC2',
        id => `https://javfc2.xyz/search?q=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const somethingFound = doc.querySelector("div.movie-container")
            if (somethingFound) {
                previewData.url = `https://javfc2.xyz/search?q=${id}`;
            }
        },
        'bg-purple-500'
    ));

    manager.addSite(new Site(
        'Sukebei',
        id => `https://sukebei.nyaa.si/?page=rss&q=${encodeURIComponent(id)}&c=0_0&f=0`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/xml");
            const items = doc.querySelectorAll("item");
            if (items.length > 0) {
                previewData.url = `https://sukebei.nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(id)}&s=seeders&o=desc`;
            }
        },
        'bg-yellow-500',
        1000
    ));

    manager.addSite(new Site(
        'SupJav',
        id => `https://supjav.com/?s=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const h1Element = doc.querySelector("h1");
            if (h1Element && h1Element.textContent.includes(`Search Result For: ${id}`)) {
                const resultCount = h1Element.textContent.match(/\((\d+)\)/);
                if (resultCount && parseInt(resultCount[1]) > 0) {
                    previewData.url = `https://supjav.com/?s=${id}`;
                }
            }
        },
        'bg-orange-500'
    ));

    manager.addSite(new Site(
        '3xplanet',
        id => `https://3xplanet.com/?s=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const itemlinks = doc.querySelectorAll("h3 a")
            for (let i = 0; i < itemlinks.length; i++) {
                const innertext = itemlinks[i].title.trim();
                if (innertext.includes(id)) {
                    previewData.url = `https://3xplanet.com/?s=${id}`;
                    break;
                }
            }
        },
        'bg-gray-500'
    ));

    manager.addSite(new Site(
        'bt4gprx',
        id => `https://bt4gprx.com/search?q=${id}&category=movie`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const items = doc.querySelectorAll("div.list-group div.list-group-item.result-item");
            if (items.length > 0) {
                previewData.url = `https://bt4gprx.com/search?q=${id}&category=movie`;
            }
        },
        'bg-gray-500',
        100
    ));

    manager.addSite(new Site(
        '字幕猫',
        id => `https://subtitlecat.com/index.php?search=${id}`,
        (response, id, previewData) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const itemlinks = doc.querySelectorAll('table.table.sub-table a')
            for (let i = 0; i < itemlinks.length; i++) {
                const innertext = itemlinks[i].textContent.trim();
                if (innertext.includes(id)) {
                    previewData.url = `https://subtitlecat.com/index.php?search=${id}`;
                    // previewData.url = itemlinks[i].href;
                    break;
                }
            }
        },
        'bg-blue-500'
    ));


    // 創建浮動選單
    const floatingMenu = new FloatingMenu("搜尋開關");
    // 添加充能開關
    (async () => {
        const enableCharging = await GM.getValue("enableCharging", false);
        Glob_enableCharging = await GM.getValue("enableCharging", false);
        const chargingSwitch = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = enableCharging;
        checkbox.id = "charging-switch";
        checkbox.style.marginRight = "5px";

        checkbox.addEventListener("change", async () => {
            await GM.setValue("enableCharging", checkbox.checked);
            Glob_enableCharging = checkbox.checked;
            location.reload();
        });

        const label = document.createElement("label");
        label.textContent = "啟用充能";
        label.htmlFor = "charging-switch";

        chargingSwitch.appendChild(checkbox);
        chargingSwitch.appendChild(label);
        floatingMenu.addContent(chargingSwitch);
    })();

    // 添加網站開關
    (async () => {
        const activeSites = await manager.getActiveSites();
        for (const site of manager.sites) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `checkbox_${site.name}`;
            checkbox.checked = activeSites[site.name];
            checkbox.style.marginRight = "5px";

            checkbox.addEventListener("change", async () => {
                await GM.setValue(`site_${site.name}`, checkbox.checked);
                location.reload();
            });

            const label = document.createElement("label");
            label.textContent = site.name;
            label.htmlFor = `checkbox_${site.name}`;
            label.style.cursor = "pointer";

            const container = document.createElement("div");
            container.appendChild(checkbox);
            container.appendChild(label);
            floatingMenu.addContent(container);
        }
    })();

    // 開始搜索
    setTimeout(() => { manager.initializeSearch(); }, 2000);

    document.addEventListener('keydown', (event) => { // 建议使用 keydown 事件来监听组合键
        // 检查 Alt 键是否被按下以及按下的键是否是 'q' 或 'Q'
        if (event.altKey && (event.key === 'q' || event.key === 'Q')) {
            event.preventDefault(); // 可选：阻止浏览器的默认行为，例如某些浏览器可能有 Alt+Q 的快捷键
            setTimeout(() => { manager.initializeSearch(); }, 100);
        }
    });

})();