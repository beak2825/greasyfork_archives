// ==UserScript==
// @name         KeyLol SteamPY 价格及总价显示
// @version      1.7
// @description  在Keylol帖子显示Steam游戏的SteamPY CDKey价格，并计算每个引用块内的总价
// @author       bluebird
// @match        https://keylol.com/t*
// @match        https://keylol.com/forum.php?mod=viewthread*
// @match        https://steampy.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @connect      steampy.com
// @connect      keylol.com
// @connect      store.steampowered.com
// @run-at       document-end
// @icon         https://steampy.com/m_logo.ico
// @license      MIT
// @namespace    https://greasyfork.org/users/
// @downloadURL https://update.greasyfork.org/scripts/559256/KeyLol%20SteamPY%20%E4%BB%B7%E6%A0%BC%E5%8F%8A%E6%80%BB%E4%BB%B7%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/559256/KeyLol%20SteamPY%20%E4%BB%B7%E6%A0%BC%E5%8F%8A%E6%80%BB%E4%BB%B7%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BASE_CONFIG = {
        STEAMPY_BASE_URL: "https://steampy.com/",
        STEAM_STORE_URL: "https://store.steampowered.com",
        STEAM_APP_URL_REG: /https:\/\/store\.steampowered\.com\/app\/(\d+)\/?/i,
        TARGET_CONTAINERS: [
            '#postlist > [id^="post_"]:first-of-type .quote blockquote'
        ],
        CACHE: {
            KEY_PREFIX: 'steampy_key_price_cache_',
            EXPIRY_HOURS: 24,
            MAX_ITEMS: 100
        }
    };

    const API_ENDPOINTS = {
        getGamePrice: (subId, appId, type) =>
            `${BASE_CONFIG.STEAMPY_BASE_URL}xboot/common/plugIn/getGame?subId=${subId}&appId=${appId}&type=${type}`,
        getCdkDetailUrl: (gameId) =>
            `${BASE_CONFIG.STEAMPY_BASE_URL}cdkDetail?name=cn&gameId=${gameId}`,
        searchGameByUrl: "https://steampy.com/xboot/steamGame/saleKeyByUrl"
    };

    GM_registerMenuCommand(
        '清除 SteamPY Key 价格缓存',
        function clearSteamPyPriceCache() {
            try {
                CacheUtils.deleteMainCache();
                alert('✅ SteamPY Key 价格缓存已清除!');
            } catch (error) {
                console.error('[清除缓存失败]', error);
                alert(`❌ 清除失败：${error.message}`);
            }
        }
    );

    const quotePrices = new Map();

    const CacheUtils = {
        // 唯一总缓存Key（所有AppID数据都存在这里）
        MAIN_CACHE_KEY: "keyLol_steamPy_allGameCache",

        /**
         * 获取总缓存数据（统一管理所有AppID的缓存）
         * @returns {object} 格式：{ appId: { data: 价格数据, timestamp: 时间戳 }, ... }
         */
        getMainCache: () => {
            try {
                const rawData = GM_getValue(CacheUtils.MAIN_CACHE_KEY, "{}");
                const parsedData = JSON.parse(rawData);
                return typeof parsedData === "object" && parsedData !== null ? parsedData : {};
            } catch (err) {
                console.warn("读取总缓存失败，重置为空对象：", err);
                GM_setValue(CacheUtils.MAIN_CACHE_KEY, "{}");
                return {};
            }
        },

        deleteMainCache: () => {
            try {
                GM_deleteValue(CacheUtils.MAIN_CACHE_KEY);
            } catch (err) {
                console.error("删除总缓存失败：", err);
                throw err;
            }
        },

        /**
         * 保存总缓存数据
         * @param {object} cacheData 要保存的总缓存对象
         */
        saveMainCache: (cacheData) => {
            try {
                GM_setValue(CacheUtils.MAIN_CACHE_KEY, JSON.stringify(cacheData));
            } catch (err) {
                console.error("保存总缓存失败：", err);
            }
        },

        /**
         * 生成AppID对应的缓存标识（仅内部兼容用，无实际独立Key）
         * @param {string} appId Steam应用ID
         * @returns {string} AppID（直接返回，无前缀）
         */
        getCacheKey: (appId) => appId, // 简化，仅保留方法兼容调用

        /**
         * 获取所有缓存的AppID列表
         * @returns {string[]} AppID数组
         */
        getAllCacheKeys: () => {
            const mainCache = CacheUtils.getMainCache();
            return Object.keys(mainCache);
        },

        /**
         * 检查指定AppID的缓存是否有效
         * @param {string} appId Steam应用ID
         * @returns {boolean} 缓存是否有效
         */
        isCacheValid: (appId) => {
            const mainCache = CacheUtils.getMainCache();
            const cacheItem = mainCache[appId];

            // 无缓存项直接无效
            if (!cacheItem || !cacheItem.timestamp || !cacheItem.data) return false;

            try {
                const now = Date.now();
                const expiryMs = BASE_CONFIG.CACHE.EXPIRY_HOURS * 60 * 60 * 1000;
                return (now - cacheItem.timestamp) <= expiryMs;
            } catch (err) {
                console.warn(`缓存校验失败（AppID: ${appId}）：`, err);
                CacheUtils.deleteCache(appId);
                return false;
            }
        },

        /**
         * 获取指定AppID的缓存数据
         * @param {string} appId Steam应用ID
         * @returns {object|null} 缓存的价格数据，无效则返回null
         */
        getCache: (appId) => {
            if (!CacheUtils.isCacheValid(appId)) return null;

            const mainCache = CacheUtils.getMainCache();
            return mainCache[appId]?.data || null;
        },

        /**
         * 设置指定AppID的缓存数据
         * @param {string} appId Steam应用ID
         * @param {object} priceData 价格数据
         */
        setCache: (appId, priceData) => {
            // 数据无效则不存储
            if (!priceData || !priceData.success || !priceData.result) return;

            try {
                // 1. 获取当前总缓存
                const mainCache = CacheUtils.getMainCache();
                // 2. 更新当前AppID的缓存项
                mainCache[appId] = {
                    data: priceData,
                    timestamp: Date.now()
                };
                // 3. 清理过期缓存 + 限制缓存数量
                CacheUtils.cleanExpiredCache();
                CacheUtils.limitCacheSize();
                // 4. 保存更新后的总缓存
                CacheUtils.saveMainCache(mainCache);
            } catch (err) {
                console.error(`缓存存储失败（AppID: ${appId}）：`, err);
            }
        },

        /**
         * 删除指定AppID的缓存
         * @param {string} appId Steam应用ID
         */
        deleteCache: (appId) => {
            const mainCache = CacheUtils.getMainCache();
            // 删除指定AppID的缓存项
            delete mainCache[appId];
            // 保存更新后的总缓存
            CacheUtils.saveMainCache(mainCache);
        },

        /**
         * 清理所有过期的缓存项
         */
        cleanExpiredCache: () => {
            const now = Date.now();
            const expiryMs = BASE_CONFIG.CACHE.EXPIRY_HOURS * 60 * 60 * 1000;
            let deletedCount = 0;
            const mainCache = CacheUtils.getMainCache();

            // 遍历所有AppID缓存项，删除过期/无效的
            Object.keys(mainCache).forEach(appId => {
                const cacheItem = mainCache[appId];
                if (!cacheItem || !cacheItem.timestamp) {
                    delete mainCache[appId];
                    deletedCount++;
                    return;
                }

                try {
                    if ((now - cacheItem.timestamp) > expiryMs) {
                        delete mainCache[appId];
                        deletedCount++;
                    }
                } catch (err) {
                    delete mainCache[appId];
                    deletedCount++;
                }
            });

            // 保存清理后的缓存
            CacheUtils.saveMainCache(mainCache);
            if (deletedCount > 0) {
                console.log(`清理过期缓存：共删除 ${deletedCount} 条`);
            }
        },

        /**
         * 限制缓存总数量（超出则删除最旧的）
         */
        limitCacheSize: () => {
            const mainCache = CacheUtils.getMainCache();
            // 转换为 [{ appId, timestamp }, ...] 便于排序
            const cacheList = Object.keys(mainCache).map(appId => ({
                appId,
                timestamp: mainCache[appId].timestamp || 0
            }));

            // 缓存数量未超限则直接返回
            if (cacheList.length <= BASE_CONFIG.CACHE.MAX_ITEMS) return;

            // 按时间戳升序排序（最旧的在前）
            cacheList.sort((a, b) => a.timestamp - b.timestamp);
            const needDeleteCount = cacheList.length - BASE_CONFIG.CACHE.MAX_ITEMS;

            // 删除最旧的N个缓存项
            for (let i = 0; i < needDeleteCount; i++) {
                delete mainCache[cacheList[i].appId];
            }

            // 保存限制后的缓存
            CacheUtils.saveMainCache(mainCache);
            console.log(`缓存数量超限，删除最旧的 ${needDeleteCount} 条缓存`);
        }
    };

    /**
     * 获取SteamPY的AccessToken（优先从油猴存储获取，其次从localStorage）
     * @returns {string|null} AccessToken
     */
    function getAccessToken() {
        const token = GM_getValue('accessToken', null);
        return token;
    }

    /**
     * 显示错误信息（控制台+可选提示）
     * @param {string} message 错误信息
     * @param {boolean} showAlert 是否弹框提示
     */
    function showError(message, showAlert = false) {
        console.error(`[SteamPY价格脚本] ${message}`);
        throw new Error(message);
    }

    /**
     * 查找元素所属的引用块
     * @param {HTMLElement} element 目标元素
     * @returns {HTMLElement|null} 引用块元素
     */
    const findParentQuote = (element) => {
        return element.closest('.quote') || null;
    };

    /**
     * 从Steam链接中提取AppID
     * @param {string} url Steam商店链接
     * @returns {string|null} AppID
     */
    const extractAppIdFromUrl = (url) => {
        const match = url.match(BASE_CONFIG.STEAM_APP_URL_REG);
        return match && match[1] ? match[1] : null;
    };

    /**
     * 更新引用块的总价显示
     * @param {HTMLElement} quoteElement 引用块元素
     */
    const updateQuoteTotal = (quoteElement) => {
        if (!quoteElement) return;

        const priceObjects = quotePrices.get(quoteElement) || [];
        const validPrices = priceObjects
            .map(priceObj => priceObj.price)
            .filter(price => typeof price === 'number' && !isNaN(price) && price > 0);

        const total = validPrices.reduce((sum, price) => sum + price, 0);
        const originalCount = priceObjects.length;

        let totalElement = quoteElement.querySelector('.steampy-quote-total');
        if (!totalElement) {
            totalElement = document.createElement('div');
            totalElement.className = 'steampy-quote-total';
            quoteElement.appendChild(totalElement);
        }

        totalElement.innerHTML = `
            <hr style="margin: 8px 0; border: none; border-top: 1px dashed #ccc;">
            <div class="total-text">
                SteamPY Key 总价: <strong>￥${total.toFixed(2)}</strong>
                <span class="total-count">(${validPrices.length}/${originalCount} 个有效价格)</span>
            </div>
        `;
    };

    /**
     * 获取指定HTML格式下的Steam应用链接（去重）
     * 仅匹配：被strong包裹 + 前邻barter.vg的a标签 + 后邻br标签 的Steam链接
     * @returns {HTMLElement[]} 符合格式的Steam链接元素数组
     */
    const getAllSteamLinks = () => {
        const linkSet = new Set();
        // 遍历配置的目标容器
        const targetContainers = BASE_CONFIG.TARGET_CONTAINERS.flatMap(selector =>
            Array.from(document.querySelectorAll(selector))
        );

        targetContainers.forEach(container => {

            const allSteamLinks = container.querySelectorAll(
                'a[href*="store.steampowered.com/app/"]:not(.showhide a, .showhide *, .sff_collapse a, .sff_collapse *)'
            );
            // 清理链接 中?后面的参数
            allSteamLinks.forEach(link => {
                const url = new URL(link.href);
                url.search = '';
                link.href = url.toString();
            });
   
            console.log(allSteamLinks);
            

            allSteamLinks.forEach(link => {
                const href = link.href;
                const appId = extractAppIdFromUrl(href);
                const isValid = appId
                    && !href.includes('store.steampowered.com/sub/') // 排除订阅链接
                    && (
                        (link.previousElementSibling?.href ?? link.parentElement.previousElementSibling?.href)?.includes('barter.vg') ||
                        (link.previousElementSibling?.href ?? link.parentElement.previousElementSibling?.href)?.includes('104.236.232.190') ||
                        link.previousElementSibling?.textContent?.includes('无进包记录')
                    )
                if (isValid) {
                    link.dataset.appId = appId; // 挂载APP ID到元素属性
                    linkSet.add(link); // 去重存储
                }
            });
        });

        return Array.from(linkSet);
    };

    /**
     * 创建价格加载占位符
     * @returns {HTMLElement} 占位符元素
     */
    const createPricePlaceholder = () => {
        const placeholder = document.createElement('span');
        placeholder.className = 'steampy-key-price-placeholder';
        placeholder.innerHTML = ' | <span class="steampy-loading">SteamPY Key价加载中...</span>';
        return placeholder;
    };

    /**
     * 更新价格显示
     * @param {HTMLElement} placeholder 占位符元素
     * @param {object} priceData 价格数据
     * @param {string} errorMsg 错误信息
     * @param {HTMLElement} linkElement 链接元素
     */
    const updatePriceDisplay = (placeholder, priceData, errorMsg = 'SteamPY Key价加载失败', linkElement) => {
        placeholder.className = 'steampy-key-price-container';
        const quoteElement = findParentQuote(linkElement);

        if (quoteElement && quotePrices.has(quoteElement)) {
            const prices = quotePrices.get(quoteElement);
            const newPrices = prices.filter(p => p.link !== linkElement);
            quotePrices.set(quoteElement, newPrices);
        }

        if (!priceData || !priceData.success || !priceData.result || !priceData.result.content || priceData.result.content.length === 0) {
            placeholder.innerHTML = ` | <span class="steampy-error">${errorMsg}</span>`;

            if (quoteElement) {
                const prices = quotePrices.get(quoteElement) || [];
                prices.push({ link: linkElement, price: 0 });
                quotePrices.set(quoteElement, prices);
                updateQuoteTotal(quoteElement);
            }
            return;
        }
        const { keyPrice, keyTx, keySales, id: gameId } = priceData.result.content[0];
        const formattedPrice = keyPrice && keyPrice > 0 ? `￥${keyPrice.toFixed(2)}` : '￥--';
        const numericPrice = keyPrice && keyPrice > 0 ? parseFloat(keyPrice) : 0;
        const formattedTx = keyTx && keyTx > 0 ? `销量${keyTx} 件` : '-- 项';
        const formattedSales = keySales && keySales > 0 ? `销售人数${keySales} 人` : '-- 人';

        placeholder.innerHTML = ` | 
            <a 
                href="${API_ENDPOINTS.getCdkDetailUrl(gameId)}" 
                target="_blank" 
                class="steampy-key-price-link" 
                title="前往 SteamPY 查看 CDKey 详情"
            >
                SteamPY Key: ${formattedPrice} | ${formattedTx} | ${formattedSales}
            </a>
        `;

        if (quoteElement) {
            const prices = quotePrices.get(quoteElement) || [];
            prices.push({ link: linkElement, price: numericPrice });
            quotePrices.set(quoteElement, prices);
            updateQuoteTotal(quoteElement);
        }
    }

    /**
     * 根据Steam链接查询SteamPY价格
     * @param {string} gameUrl Steam商店链接
     * @returns {Promise<object>} 价格数据
     */
    async function fetchGamePrice(gameUrl) {
        const requestUrl = new URL(API_ENDPOINTS.searchGameByUrl);
        requestUrl.searchParams.set("pageNumber", 1);
        requestUrl.searchParams.set("pageSize", 10);
        requestUrl.searchParams.set("sort", "id");
        requestUrl.searchParams.set("order", "asc");
        requestUrl.searchParams.set("gameUrl", gameUrl);
        requestUrl.searchParams.set("gameName", "");

        try {
            console.log(`[SteamPY价格脚本] 请求价格数据：${requestUrl.toString()}`);

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: requestUrl.toString(),
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                        "accesstoken": getAccessToken() || "",
                        "app_token": "",
                        "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "sec-gpc": "1",
                        "referrer": "https://steampy.com/pyUserInfo/sellerCDKey"
                    },
                    withCredentials: true,
                    responseType: "json",

                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            resolve(res);
                        } else {
                            reject(new Error(`HTTP请求失败，状态码：${res.status}`));
                        }
                    },
                    onerror: (error) => reject(new Error(`网络请求错误：${error.message || "连接失败"}`)),
                    onabort: () => reject(new Error("请求被中止")),
                    ontimeout: () => reject(new Error("请求超时"))
                });
            });

            const resultData = response.response;
            if (!resultData.success || resultData.code !== 200) {
                const errMsg = `业务请求失败：${resultData.message || "未知错误"}`;
                if (resultData.message?.includes("token") || resultData.code === 401) {
                    showError(errMsg + "\n提示：AccessToken可能已过期，请先访问SteamPY网站登录后再试", true);
                }
                throw new Error(errMsg);
            }

            return {
                success: true,
                result: resultData.result
            };

        } catch (error) {
            showError(error.message);
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * 从缓存/接口获取价格并更新显示
     * @param {string} appId Steam应用ID
     * @param {HTMLElement} placeholder 占位符元素
     * @param {HTMLElement} linkElement 链接元素
     */
    const getPriceWithCacheAndSubId = async (appId, placeholder, linkElement) => {


        try {
            const cachedData = CacheUtils.getCache(appId);
            var priceData = null;
            if (cachedData) {
                console.log(`[SteamPY价格脚本] 使用缓存数据（AppID: ${appId}）`);

                priceData = cachedData;
            } else {
                updatePriceDisplay(placeholder, null, '获取价格中...', linkElement);
                console.log(`[SteamPY价格脚本] 获取价格（AppID: ${appId}）`);
                priceData = await fetchGamePrice(linkElement.href);
                if (priceData.success) {
                    CacheUtils.setCache(appId, priceData);
                }
            }
            updatePriceDisplay(placeholder, priceData, "", linkElement);
        } catch (err) {
            console.error(`[SteamPY价格脚本] 价格获取失败（AppID: ${appId}）：`, err);
            updatePriceDisplay(placeholder, null, `获取价格失败: ${err.message}`, linkElement);
        }
    };

    /**
     * 为Steam链接添加价格显示
     * @param {HTMLElement} link Steam链接元素
     */
    const addPriceToSteamLink = (link) => {
        const appId = link.dataset.appId;
        if (!appId) return;

        const nextSibling = link.nextElementSibling;
        if (nextSibling && (nextSibling.classList.contains('steampy-key-price-container') ||
            nextSibling.classList.contains('steampy-key-price-placeholder'))) {
            return;
        }

        const placeholder = createPricePlaceholder();
        link.parentNode.insertBefore(placeholder, link.nextSibling);

        getPriceWithCacheAndSubId(appId, placeholder, link);
    };

    /**
     * 注入样式
     */
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .steampy-key-price-container,
            .steampy-key-price-placeholder {
                margin-left: 4px;
                font-size: 13px;
                color: #666;
                line-height: 1.5;
            }
            .steampy-key-price-link {
                color: #2E86AB;
                text-decoration: none;
                padding: 0 2px;
            }
            .steampy-key-price-link:hover {
                color: #A23B72;
                text-decoration: underline;
            }
            .steampy-loading {
                color: #888;
                font-style: italic;
            }
            .steampy-error {
                color: #E74C3C;
            }
            .quote .steampy-key-price-container,
            .quote .steampy-key-price-placeholder {
                font-size: 12px;
            }
            /* 总价显示样式 */
            .steampy-quote-total {
                margin-top: 10px;
                padding-top: 5px;
                font-size: 14px;
            }
            .total-text {
                color: #333;
                font-weight: bold;
            }
            .total-count {
                font-size: 12px;
                color: #666;
                font-weight: normal;
                margin-left: 8px;
            }
        `;
        document.head.appendChild(style);
    };

    /**
     * 初始化引用块价格存储
     */
    const initQuoteTotals = () => {
        const quotes = document.querySelectorAll('.quote');
        quotes.forEach(quote => {
            if (!quotePrices.has(quote)) {
                quotePrices.set(quote, []);
            }
        });
    };

    /**
     * 主初始化函数
     */
    const init = () => {
        CacheUtils.cleanExpiredCache();
        injectStyles();
        initQuoteTotals();

        const steamLinks = getAllSteamLinks();
        if (steamLinks.length === 0) {
            console.log('[SteamPY价格脚本] 当前页面未找到 Steam 游戏链接');
            return;
        }

        console.log(`[SteamPY价格脚本] 找到 ${steamLinks.length} 个 Steam 游戏链接，开始加载价格...`);
        steamLinks.forEach(addPriceToSteamLink);
    };

    GM_registerMenuCommand('清除 SteamPY Key 价格缓存', () => {
        CacheUtils.updateCacheKeysList([]);
        CacheUtils.getAllCacheKeys().forEach(key => GM_deleteValue(key));
        alert('SteamPY Key 价格缓存已清除');
    });

    const currentUrl = document.location.href;
    if (currentUrl.includes('steampy.com/')) {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken) {
            GM_setValue('accessToken', accessToken);
            console.log('[SteamPY价格脚本] 已同步SteamPY的AccessToken');
        }
    }
    else if (currentUrl.includes('keylol.com/')) {
        // 在执行前确认 AccessToken 是否已获取
        const token = getAccessToken();
        if (!token) {
            console.warn('[SteamPY价格脚本] 未检测到 AccessToken，价格查询可能失败。请先访问 steampy.com 登录并同步 AccessToken 后刷新页面。');

            // 在页面顶部显示提示（非阻塞）
            try {
                const notice = document.createElement('div');
                notice.style.cssText = 'background:#fff3cd;border:1px solid #ffeeba;color:#856404;padding:8px;margin:8px;font-size:13px;';
                notice.textContent = '提示：未检测到 SteamPY AccessToken。请先访问 steampy.com 登录并同步 AccessToken 后刷新页面以查看价格。';
                document.body && document.body.insertBefore(notice, document.body.firstChild);
            } catch (e) {
                /* ignore */
            }

            // 不执行初始化，等待用户同步 token 后刷新页面
            return;
        }

        // 已获取到 AccessToken，正常初始化
        if (document.readyState === 'complete') {
            init();
        } else {
            window.addEventListener('load', init);
        }
    }

})();