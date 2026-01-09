// ==UserScript==
// @name         Jsoso
// @namespace    Jsoso
// @version      1.0.2
// @description  通用搜索框架 - 用于多个网站的自动外部资源搜索
// @author       sexjpg
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license MIT
// @connect      *
// @noframes
// @match        *://*.fc2ppvdb.com/*
// @match        *://*.javdb.com/*
// @match        *://*.xiaojiadianmovie.be/*
// @match        *://*.javbus.com/*
// @downloadURL https://update.greasyfork.org/scripts/561981/Jsoso.user.js
// @updateURL https://update.greasyfork.org/scripts/561981/Jsoso.meta.js
// ==/UserScript==


// 创建样式元素并添加到页面
(function () {
    'use strict';
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

.bg-green-500\/50 {
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
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);
})();



// (function () {
'use strict';

// ==================== CSS样式 ====================





// ==================== 全局变量 ====================
let Glob_enableCharging;
let cache = {};
GM_registerMenuCommand('打开设置', () => { JsosoConfig() });



// ==================== FloatingMenu类 ====================
/**
 * 悬浮菜单类
 * 负责创建悬浮菜单，并实现拖拽、展开/收起功能
 */
class FloatingMenu {
    constructor(titleText) {
        this.menu = null;
        this.title = null;
        this.content = null;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.createMenu(titleText);
    }

    createMenu(titleText) {
        this.menu = document.createElement("div");
        this.menu.id = "floating-menu";
        this.menu.style.position = "fixed";
        this.menu.style.top = "50%";
        this.menu.style.left = "45%";
        this.menu.style.transform = "translateY(-50%)";
        this.menu.style.width = "200px";
        // this.menu.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
        this.menu.style.color = "white";
        this.menu.style.padding = "10px";
        this.menu.style.borderRadius = "0 10px 10px 0";
        this.menu.style.zIndex = "10000";
        this.menu.style.cursor = "grab";
        this.menu.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.3)";
        this.menu.style.transition = "all 0.3s ease";
        this.menu.style.backdropFilter = "blur(4px)";
        document.body.appendChild(this.menu);
        this.menu.style.display = "none";

        this.title = document.createElement("div");
        this.title.textContent = titleText;
        this.title.style.fontWeight = "bold";
        this.title.style.marginBottom = "10px";
        this.title.style.cursor = "pointer";
        this.title.style.textAlign = "center";
        this.menu.appendChild(this.title);

        this.content = document.createElement("div");
        this.content.style.display = "none";
        this.menu.appendChild(this.content);

        this.addEventListeners();
    }

    addEventListeners() {
        this.title.addEventListener("click", () => {
            const isHidden = this.content.style.display === "none";
            this.content.style.display = isHidden ? "block" : "none";
            const isHidden2 = this.menu.style.display === "none";
            this.menu.style.display = isHidden2 ? "block" : "none";
        });

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

    addContent(element) {
        this.content.appendChild(element);
    }
}

// ==================== Site类 ====================
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
        const cacheKey = `${this.name}_${id}`;
        const cachedResult = await Utils.getCachedResult(cacheKey);
        if (cachedResult) {
            if (cachedResult.url) {
                this.addButton(element, cachedResult.url);
            }
            return;
        }

        const searchUrl = this.searchUrlFunc(id);
        const loadingElement = Utils.showLoading(element, this.name);
        new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: searchUrl,
                onload: (response) => {
                    let previewData = {
                        url: ''
                    };
                    this.responseHandler(response, id, previewData);
                    if (previewData.url) {
                        this.addButton(element, previewData.url);
                    }
                    Utils.removeLoading(loadingElement);
                    Utils.cacheResult(cacheKey, previewData);
                },
                onerror: () => {
                    Utils.removeLoading(loadingElement);
                    console.error(`${this.name} ${id}搜索失败`);
                },
            });
        })
    }

    addButton(element, url) {
        const button = Utils.createButton(url, this.name, this.buttonColor);
        element.appendChild(button);
    }
}

// ==================== SearchManager类 ====================
/**
 * 管理所有网站的类
 */
class SearchManager {
    constructor() {
        this.sites = [];
        this.SearchItems = []
    }

    addSite(site) {
        this.sites.push(site);
    }

    // 初始化搜索 - 需要根据具体网站实现
    async initializeSearch() {

        this.SearchItems = this.SearchItems.filter(item => item.id !== "");
        const uniqueItems = [];
        const seenIds = new Set();
        for (const item of this.SearchItems) {
            if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                uniqueItems.push(item);
            }
        }

        this.SearchItems = uniqueItems;
        this.SearchSomething()
    }

    // 单个页面搜索 - 需要根据具体网站实现
    async fc2ppvdb_singlePage() {
        const items = document.querySelectorAll('div#article-info')
        const activeSites = await this.getActiveSites();
        Utils.removeDivs()
        items.forEach(item => {
            const id = item.getAttribute("data-videoid")
            const container = Utils.createDiv();
            const element = item.querySelector('h2').parentElement
            element.appendChild(container);
            this.sites.forEach(site => {
                if (activeSites[site.name]) {
                    site.addToQueue(id, container);
                }
            });

        })
    }

    // 墙面搜索 - 需要根据具体网站实现
    async fc2ppvdb_wall() {
        const items = document.querySelectorAll("span.absolute.top-0.left-0")
        const activeSites = await this.getActiveSites();
        if (!items) return
        Utils.removeDivs()

        items.forEach(item => {
            if (!item) return
            let id = item.textContent.trim();
            id = Utils.formatID(id)
            const container = Utils.createDiv();
            const element = item.parentElement.parentElement
            element.appendChild(container)
            this.sites.forEach(site => {
                if (activeSites[site.name]) {
                    site.addToQueue(id, container);
                }
            });
        });
    }


    // 获取ID和作用容器的模板函数,以FC2PPVDB为例,需返回{id,element},id是要搜索的关键字,element是存放结果容器的父容器
    getitems() {
        const items = []
        const items_ = document.querySelectorAll("span.absolute.top-0.left-0")
        items_.forEach(item => {
            const id = Utils.formatID(item.textContent.trim());
            const element = item.parentElement.parentElement
            items.push({
                id,
                element
            })
        })
        return items
    }


    async SearchSomething() {
        const items = this.SearchItems
        const activeSites = await this.getActiveSites();
        Utils.removeDivs()
        items.forEach(item => {
            const id = item.id;
            const element = item.element
            const container = Utils.createDiv();
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

// ==================== Utils类 ====================
/**
 * 通用工具类
 */
class Utils {

    static async setCache(key, value) {
        cache = await GM.getValue('cache', {});
        cache[key] = value;
        await GM.setValue('cache', cache);
    }

    static async getCache(key, value = null) {
        cache = await GM.getValue('cache', {});
        if (!cache[key]) { return value }
        return cache[key];
    }
    static showLoading(element, siteName) {
        const loadingContainer = document.createElement("div");
        loadingContainer.className = "loading-container";
        loadingContainer.style.display = "inline-flex";
        loadingContainer.style.alignItems = "center";
        loadingContainer.style.marginLeft = "0.5rem";

        const spinner = document.createElement("div");
        spinner.className = "loading-spinner";
        spinner.style.width = "1.2rem";
        spinner.style.height = "1.2rem";
        spinner.style.border = "3px solid rgba(243, 243, 243, 0.2)";
        spinner.style.borderTop = "3px solid #3498db";
        spinner.style.borderRadius = "50%";
        spinner.style.animation = "spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite";

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

        const loadingText = document.createElement("span");
        loadingText.textContent = `搜索 ${siteName}...`;
        loadingText.className = "text-gray-500 ml-2";

        loadingContainer.appendChild(spinner);
        loadingContainer.appendChild(progressBar);
        loadingContainer.appendChild(loadingText);
        element.appendChild(loadingContainer);

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

        const chargeBg = document.createElement("div");
        chargeBg.className = "absolute inset-0 bg-green-500/50";
        chargeBg.style = "width: 0%; transition: width 0.2s; background-color: rgba(0, 255, 0, 0.5); opacity: 1;"
        chargeBg.style.transition = "width 1s cubic-bezier(0.4, 0, 0.2, 1)";

        const linkButton = document.createElement("a");
        linkButton.textContent = text;
        linkButton.className = "relative block bg-transparent text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95";
        linkButton.style.pointerEvents = "none";

        let isCharging = false;
        let isCharged = false;

        buttonContainer.addEventListener("mousedown", () => {
            isCharging = true;
            isCharged = false;
            chargeBg.style.transition = "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
            chargeBg.style.width = "100%";
        });

        const resetCharge = () => {
            if (!isCharged) {
                chargeBg.style.transition = "width 0.2s ease";
                chargeBg.style.width = "0%";
                isCharging = false;
            }
        };

        buttonContainer.addEventListener("mouseup", resetCharge);
        buttonContainer.addEventListener("mouseleave", resetCharge);

        chargeBg.addEventListener("transitionend", (e) => {
            if (e.propertyName === 'width' && chargeBg.style.width === "100%" && isCharging) {
                isCharged = true;
                isCharging = false;

                chargeBg.style.transition = "opacity 0.3s ease";
                chargeBg.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
                chargeBg.style.opacity = "0";

                setTimeout(() => {
                    if (isCharged) {
                        window.open(url, "_blank");
                    }
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

    static createButton(url, text, bgColorClass) {
        if (Glob_enableCharging) {
            return this.createChargingButton(url, text, bgColorClass);
        } else {
            const linkButton = document.createElement("a");
            linkButton.href = url;
            linkButton.textContent = text;
            linkButton.className = `inline-block ${bgColorClass} text-white px-2 py-1 rounded mt-2 ml-2`;
            linkButton.target = "_blank";
            return linkButton;
        }
    }

    static async cacheResult(key, data, expiryDay = 10) {
        const timestamp = new Date().getTime();
        const expiry = timestamp + expiryDay * 24 * 60 * 60 * 1000;
        const cacheData = {
            data,
            expiry
        };
        await Utils.setCache(key, cacheData);
    }

    static async getCachedResult(key) {
        const cacheData = await Utils.getCache(key);
        if (!cacheData) return null;

        const timestamp = new Date().getTime();
        if (cacheData.expiry < timestamp) {
            await Utils.setCache(key, null);
            return null;
        }
        return cacheData.data;
    }

    static createDiv(className = `resultContainer`) {
        const div = document.createElement('div');
        div.className = className;
        div.style.flexWrap = "wrap";
        div.style.gap = "0.5rem";
        return div;
    }

    static removeDivs(className = `resultContainer`) {
        const divs = document.querySelectorAll(`.${className}`);
        divs.forEach(div => div.remove());
    }

    static formatID(id) {
        if (id.toLowerCase().startsWith('fc2-') && /^\d+$/.test(id.substring(4))) {
            id = id.substring(4);
        }
        return id;
    }

}



const manager = new SearchManager();
// 添加网站和解析结果
manager.addSite(new Site(
    '123av',
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
    'bg-purple-500'
));



// 创建悬浮菜单
const floatingMenu = new FloatingMenu("Jsoso");
// 添加充能按钮
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
    label.textContent = "启动充能";
    label.htmlFor = "charging-switch";

    chargingSwitch.appendChild(checkbox);
    chargingSwitch.appendChild(label);
    floatingMenu.addContent(chargingSwitch);
})();

// 添加网站开关
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


function JsosoConfig(){
    floatingMenu.menu.style.display = "block";
    floatingMenu.content.style.display = "block";
}

// 替换掉FC2PPVDB中无图片的图片
function FC2DB_removeNoImage() {
    if(!window.location.href.includes("fc2ppvdb.com"))return
    const ArticleImage = document.querySelectorAll("#ArticleImage");
    for (let i = 0; i < ArticleImage.length; i++) {
        ArticleImage[i].classList.remove("hidden");
    }
    const NoImage = document.querySelectorAll("img#NoImage");
    for (let i = 0; i < NoImage.length; i++) {
        NoImage[i].display = "none";
    }
}

// 获取ID和作用容器的模板函数
function FC2PPVDB_wall() {
    const items = []
    const items_ = document.querySelectorAll("span.absolute.top-0.left-0")
    items_.forEach(item => {
        const id = Utils.formatID(item.textContent.trim());
        const element = item.parentElement.parentElement
        items.push({
            id,
            element
        })
    })
    return items
}

function FC2PPVDB_singlepage() {
    const items = []
    const items_ = document.querySelectorAll('div#article-info')
    items_.forEach(item => {
        const id = item.getAttribute("data-videoid")
        const element = item.querySelector('h2').parentElement
        items.push({
            id,
            element
        })
    })
    return items
}

function javdb_wall() {
    const items = []
    const items_ = document.querySelectorAll('div.container div.item')
    items_.forEach(item => {
        const id = Utils.formatID(item.querySelector("div.video-title strong")?.textContent.trim() ?? "");
        const element = item
        items.push({
            id,
            element
        })
    })
    return items
}

function javdb_singlepage() {
    const items = []
    const items_ = document.querySelectorAll('div.panel-block.first-block')
    items_.forEach(item => {
        const id = Utils.formatID(item.querySelector("a.button.is-white").getAttribute('data-clipboard-text'));
        const element = item.parentElement
        items.push({
            id,
            element
        })
    })
    return items
}

function FC2_wall() {
    const items = []
    const items_ = document.querySelectorAll('a[href*="/article/"][id*="mui"]')
    items_.forEach(item => {
        const href = item.getAttribute('href');
        const match = href.match(/\/article\/(\d+)/);
        const id = match ? match[1] : "";
        const element = item.parentElement.parentElement
        items.push({
            id,
            element
        })
    })
    return items
}

function FC2_singlepage() {
    const items = []
    const items_ = document.querySelectorAll('.items_article_headerInfo')
    items_.forEach(item => {
        const Ptag = item.querySelectorAll("p")[2]
        const match = Ptag.textContent.trim().match(/\d+$/);
        const id = match ? match[0] : "";
        const element = item
        items.push({
            id,
            element
        })
    })
    return items
}

function FC2_ranking() {
    const items = []
    const items_ = document.querySelectorAll(`h3 a[href*="article_search.php?id="]`);
    items_.forEach(item => {
        const href = item.getAttribute('href');
        const url = new URL(href, window.location.origin);
        const id = url.searchParams.get('id');
        const element = item.parentElement.parentElement
        items.push({
            id,
            element
        })
    })
    return items
}

function javbus_wall() {
    const items = []
    const items_ = document.querySelectorAll('div.container-fluid div.item')
    items_.forEach(item => {
        const id = Utils.formatID(item.querySelector("span date")?.textContent.trim() ?? "");
        const element = item.querySelector('a.movie-box')
        items.push({
            id,
            element
        })
    })
    return items
}



function startSearch() {
    manager.SearchItems = [];
    manager.SearchItems.push(...FC2PPVDB_wall());
    manager.SearchItems.push(...FC2PPVDB_singlepage());
    manager.SearchItems.push(...javdb_wall());
    manager.SearchItems.push(...javdb_singlepage());
    manager.SearchItems.push(...FC2_wall());
    manager.SearchItems.push(...FC2_singlepage());
    manager.SearchItems.push(...FC2_ranking());
    manager.SearchItems.push(...javbus_wall());
    console.log('准备开始搜索', manager.SearchItems);
    manager.initializeSearch();
    FC2DB_removeNoImage()
}


// 2秒后開始搜索
setTimeout(() => {
    startSearch()
}, 2000);

document.addEventListener('keydown', (event) => { // 建议使用 keydown 事件来监听组合键
    // 检查 Alt 键是否被按下以及按下的键是否是 'q' 或 'Q'
    if (event.altKey && (event.key === 'q' || event.key === 'Q')) {
        event.preventDefault(); // 可选：阻止浏览器的默认行为，例如某些浏览器可能有 Alt+Q 的快捷键
        setTimeout(() => {
            startSearch()
        }, 100);

    }
});





// })();