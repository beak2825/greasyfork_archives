// ==UserScript==
// @name        Steam历史最低价格查询
// @namespace   SteamHistoryLowestPrice
// @description 在steam商店页和愿望单页显示当前app历史最低价格及进包次数(此脚本需要勾选Steam商店加速才会生效)
// @include      https://store.steampowered.com/app/*
// @include      https://store.steampowered.com/bundle/*
// @include      https://store.steampowered.com/sub/*
// @include      https://store.steampowered.com/wishlist/*
// @author      软妹币玩家、byzod、StarRain
// @license     GPL version 3 or any later version
// @version     2.0
// @grant       GM_xmlhttpRequest
// @enable      true
// jshint esversion:6
// @downloadURL https://update.greasyfork.org/scripts/551104/Steam%E5%8E%86%E5%8F%B2%E6%9C%80%E4%BD%8E%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/551104/Steam%E5%8E%86%E5%8F%B2%E6%9C%80%E4%BD%8E%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

// 显示样式
// 0 = 显示在购买按钮上面
// 1 = 显示在购买信息框上面
const INFO_STYLE = 1;

// 货币区域覆盖，两个字母的国家代号,大小写均可
// 空字符（""）代表不覆盖，使用steam的cookie中steamCountry的值
// 见 https://zh.wikipedia.org/wiki/ISO_3166-1 或 https://en.wikipedia.org/wiki/ISO_3166-1
// 常用 美国USD:"us", 中国CNY: "cn", 英国GBP: "uk", 日本JPY: "jp", 俄国RUS: "ru"
const CC_OVERRIDE = "";

// 货币符号
const CURRENCY_SYMBOLS = {
    'AED': 'DH',
    'AUD': 'A$',
    'BRL': 'R$',
    'CAD': 'CDN$',
    'CHF': 'CHF',
    'CLP': 'CLP$',
    'CNY': '¥',  // Chines Yuan
    'COP': 'COL$',
    'CRC': '₡',    // Costa Rican Colón
    'EUR': '€',    // Euro
    'GBP': '£',    // British Pound Sterling
    'HKD': 'HK$',
    'IDR': 'Rp',
    'ILS': '₪',    // Israeli New Sheqel
    'INR': '₹',    // Indian Rupee
    'JPY': '¥',    // Japanese Yen
    'KRW': '₩',    // South Korean Won
    'MXN': 'Mex$',
    'MYR': 'RM',
    'NGN': '₦',    // Nigerian Naira
    'NOK': 'kr',
    'NZD': 'NZ$',
    'PEN': 'S/.',
    'PHP': '₱',    // Philippine Peso
    'PLN': 'zł',   // Polish Zloty
    'PYG': '₲',    // Paraguayan Guarani
    'RUB': 'pуб',
    'SAR': 'SR',
    'SGD': 'S$',
    'THB': '฿',    // Thai Baht
    'TRY': 'TL',
    'TWD': 'NT$',
    'UAH': '₴',    // Ukrainian Hryvnia
    'USD': '$',    // US Dollar
    'VND': '₫',    // Vietnamese Dong
    'ZAR': 'R ',
};

// 查询历史低价包括的商店
const STORES = [
    "steam",
    // "amazonus",
    // "impulse",
    // "gamersgate",
    // "direct2drive",
    // "origin",
    // "uplay",
    // "indiegalastore",
    // "gamesplanet",
    // "indiegamestand",
    // "gog",
    // "nuuvem",
    // "dlgamer",
    // "humblestore",
    // "squenix",
    // "bundlestars",
    // "fireflower",
    // "humblewidgets",
    // "newegg",
    // "coinplay",
    // "wingamestore",
    // "macgamestore",
    // "gamebillet",
    // "silagames",
    // "itchio",
    // "gamejolt",
    // "paradox"
];

// 检查是否是愿望单页面
const isWishlist = location.href.includes("/wishlist/");
console.log('[史低]: 是愿望单页面?', isWishlist);

// 在app页、bundle页、sub页和愿望单页显示史低价格
let urlMatch = location.href.match(/(app|sub|bundle)\/(\d+)/);
let appId = "";
let type = "";
let subIds = [];
let bundleIds = [];
let appIds = [];
if (urlMatch && urlMatch.length == 3) {
    type = urlMatch[1];
    appId = urlMatch[2];
}

console.log('[史低]: 页面类型:', type, 'appId:', appId);

let cc = "cn";
if (CC_OVERRIDE.length > 0) {
    // 使用覆盖的货币区域
    cc = CC_OVERRIDE;
} else {
    // 使用默认的的货币区域
    let ccMatch = document.cookie.match(/steamCountry=([a-z]{2})/i);
    if (ccMatch !== null && ccMatch.length == 2) {
        cc = ccMatch[1];
    }
}
console.log('[史低]: 货币区域:', cc);

if (!isWishlist) {
    // 获取subs
    document.querySelectorAll("input[name=subid]")
        .forEach(sub => subIds.push(sub.value));
    // 获取bundles
    document.querySelectorAll("input[name=bundleid]")
        .forEach(sub => bundleIds.push(sub.value));
    console.log('[史低]: 非愿望单 - subIds:', subIds, 'bundleIds:', bundleIds);
    AddLowestPriceTag(appId, type, appIds, subIds, bundleIds, STORES.join(","), cc, location.protocol);
} else {
    type = "wishlist";
    initWishlist();
}

function initWishlist() {
    const rows = document.querySelectorAll('div.Panel[data-index]');
    if (rows.length === 0) {
        console.log('[史低]: 等待愿望单加载...');
        setTimeout(initWishlist, 500);
        return;
    }
    console.log('[史低]: 愿望单加载，处理...');
    appIds = [];
    subIds = [];
    bundleIds = [];
    rows.forEach(row => {
        const link = row.querySelector('a[href*="store.steampowered.com"]');
        if (link) {
            const match = link.href.match(/(app|sub|bundle)\/(\d+)/);
            if (match) {
                const itemType = match[1];
                const id = match[2];
                console.log('[史低]: 找到愿望单项 - 类型:', itemType, 'ID:', id);
                if (itemType === 'app') {
                    appIds.push(id);
                } else if (itemType === 'sub') {
                    subIds.push(id);
                } else if (itemType === 'bundle') {
                    bundleIds.push(id);
                }
            } else {
                console.log('[史低]: 愿望单项链接无匹配:', link.href);
            }
        } else {
            console.log('[史低]: 愿望单项无链接');
        }
    });
    console.log('[史低]: 愿望单 - appIds:', appIds, 'subIds:', subIds, 'bundleIds:', bundleIds);
    AddLowestPriceTag(appId, type, appIds, subIds, bundleIds, STORES.join(","), cc, location.protocol);
}

// 在商店页或愿望单添加史低信息
async function AddLowestPriceTag(mainAppId, pageType = "app", appIds = [], subIds = [], bundleIds = [], stores = "steam", cc = "cn", protocol = "https") {
    console.log('[史低]: AddLowestPriceTag 调用 - pageType:', pageType, 'mainAppId:', mainAppId, 'appIds:', appIds, 'subIds:', subIds, 'bundleIds:', bundleIds);
    // 史低信息容器们
    let lowestPriceNodes = {};
    let rowMap = {};
    let appInfosMap = {}; // To store info for re-adding on mutations

    if (pageType !== "wishlist") {
        // 统计subid
        let findSubIds = [];
        if (pageType == "bundle") {
            // bundle就一个, 视作subid
            findSubIds.push(mainAppId);
        } else if (pageType == "app" || pageType == "sub") {
            // app/sub/bundle 可能有好多
            findSubIds = subIds.slice();
            if (bundleIds.length > 0) {
                findSubIds.push.apply(findSubIds, bundleIds);
            }
        }
        console.log('[史低]: 非愿望单 - findSubIds:', findSubIds);

        // 寻找每一个subid的购买按钮，生成史低信息容器们
        findSubIds.forEach(subId => {
            let gameWrapper = null;
            try {
                gameWrapper = document.querySelector('.game_area_purchase_game input[value="' + subId + '"]');
                switch (INFO_STYLE) {
                    case 0:
                        gameWrapper = gameWrapper.parentNode.parentNode.querySelector('.game_purchase_action');
                        break;
                    case 1:
                        gameWrapper = gameWrapper.parentNode.parentNode;
                        break;
                }
            } catch (ex) {
                gameWrapper = null;
                console.log('[史低]: 寻找gameWrapper错误:', ex);
            }
            if (gameWrapper) {
                let lowestInfo = document.createElement("div");
                lowestInfo.className = "game_lowest_price";
                lowestInfo.innerText = "正在读取历史最低价格...";
                switch (INFO_STYLE) {
                    case 0:
                        gameWrapper.prepend(lowestInfo);
                        break;
                    case 1:
                        gameWrapper.append(lowestInfo);
                        break;
                }
                lowestPriceNodes[subId] = lowestInfo;
                console.log('[史低]: 为subId创建容器:', subId);
            } else {
                console.log('[史低]: 未找到gameWrapper for subId:', subId);
            }
        });
    } else {
        // 对于愿望单，收集row
        document.querySelectorAll('div.Panel[data-index]').forEach(row => {
            const link = row.querySelector('a[href*="store.steampowered.com"]');
            let id = "0";
            let itemType = "";
            if (link) {
                const match = link.href.match(/(app|sub|bundle)\/(\d+)/);
                if (match) {
                    itemType = match[1];
                    id = match[2];
                }
            }
            if (id !== "0") {
                rowMap[id + "_" + itemType] = row;
                console.log('[史低]: 收集愿望单row - 类型:', itemType, 'ID:', id);
            } else {
                console.log('[史低]: 愿望单项ID无效');
            }
        });
    }
    console.log('[史低]: rowMap:', rowMap);

    // 获取数据
    let data = null;
    try {
        data = await GettingSteamDBAppInfo(mainAppId, pageType, appIds, subIds, bundleIds, stores, cc, protocol);
        if ((typeof data == 'string')) {
            data = JSON.parse(data);
        }
        console.log('[史低]: 数据获取成功:', data);
    } catch (err) {
        console.log('[史低]: 数据获取错误:', err);
    }

    // 解析data
    let appInfos = [];
    if (pageType == "bundle") {
        if (data && data["bundle/" + mainAppId]) {
            appInfos.push({ Id: mainAppId, Type: "bundle", Info: data["bundle/" + mainAppId] });
        }
    } else {
        if (data && data.prices) {
            data = data.prices;
            for (let key in data) {
                let [itemType, appid] = key.split("/");
                if (!isNaN(appid)) {
                    appInfos.push({ Id: appid, Type: itemType, Info: data[key] });
                }
            }
        }
    }
    console.log('[史低]: 解析appInfos:', appInfos);

    // 如果查到info，塞到对应位置
    if (appInfos.length > 0) {
        // 为每一个添加史低
        appInfos.forEach(app => {
            let key = app.Id;
            if (pageType !== "wishlist") {
                key = app.Id;
            } else {
                key = app.Id + "_" + app.Type;
            }
            appInfosMap[key] = app; // Store for re-adding
            if (pageType !== "wishlist") {
                let lowestInfo = lowestPriceNodes[key];
                if (lowestInfo && app.Info && app.Info.lowest && app.Info.lowest.price) {
                    console.log('[史低]: 更新史低信息 - 类型:', app.Type, 'ID:', app.Id);
                    // 原有详细显示
                    lowestInfo.innerHTML =
                        // 历史最低
                        '历史最低价是&nbsp;'
                        + '<span style="cursor:help;text-decoration:underline;" title="' + app.Info.lowest.recorded_formatted + '">'
                        + new Date(app.Info.lowest.timestamp).toLocaleDateString()
                        + '</span>&nbsp;时在&nbsp;'
                        + '<a target="_blank" href="' + app.Info.lowest.url + '"> '
                        + app.Info.lowest.shop.name
                        + '</a>&nbsp;中的&nbsp;'
                        + '<span class="discount_pct">-' + app.Info.lowest.cut + '%</span>'
                        + '<a target="_blank" title="查看价格历史" href="' + app.Info.urls.history + '"> '
                        + GETSymbol(app.Info.lowest.price.currency) + ' ' + app.Info.lowest.price.amount
                        + '</a>'

                        // 第二行
                        + '<br />'

                        // 当前最低
                        + (app.Info.current.price.amount <= app.Info.lowest.price.amount
                            ? '<span class="game_purchase_discount_countdown">当前为历史最低价</span>，'
                            : '<span>当前最低价是</span>')
                        + '在&nbsp;'
                        + '<a target="_blank" href="' + app.Info.current.url + '"> '
                        + app.Info.current.shop.name
                        + '</a>&nbsp;中的&nbsp;'
                        + '<span class="discount_pct">-' + app.Info.current.cut + '%</span>'
                        + '<a target="_blank" title="查看价格信息"  href="' + app.Info.urls.info + '"> '
                        + GETSymbol(app.Info.current.price.currency) + ' ' + app.Info.current.price.amount
                        + '</a>';
                } else if (lowestInfo) {
                    lowestInfo.innerHTML = "无史低数据";
                    console.log('[史低]: 无史低数据 - 类型:', app.Type, 'ID:', app.Id);
                }
            } else {
                addLowestToRow(key, appInfosMap);
            }
        });

        // For wishlist, set up MutationObserver to re-add on DOM changes
        if (pageType === "wishlist") {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'subtree') {
                        Object.keys(rowMap).forEach(key => {
                            addLowestToRow(key, appInfosMap);
                        });
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('[史低]: MutationObserver 已设置，用于处理React重新渲染');
        }
    } else {
        // metaInfo为空，或者appInfos无内容
        console.log('[史低]: get lowest price failed, data = %o', data);
        for (let id in lowestPriceNodes) {
            lowestPriceNodes[id].innerHTML = "";
        }
    }

    // 返回史低info
    return Promise.resolve(lowestPriceNodes);
}

// Helper to add/re-add lowest price to a wishlist row
function addLowestToRow(key, appInfosMap) {
    const app = appInfosMap[key];
    if (!app || !app.Info || !app.Info.lowest || !app.Info.lowest.price) return;

    const row = document.querySelector(`div.Panel[data-index] a[href*="/${app.Type}/${app.Id}"]`)?.closest('div.Panel[data-index]');
    if (!row) return;

    // Check if already added to avoid duplicates
    if (row.querySelector('.game_lowest_price')) return;

    console.log('[史低]: (Re)添加史低信息 - 类型:', app.Type, 'ID:', app.Id);
    let lowestInfo = document.createElement("div");
    lowestInfo.className = "game_lowest_price";
    lowestInfo.style = "font-size: 12px; color: #acf; margin-top: 5px; display: block; width: 100%;";
    // 愿望单简洁显示
    lowestInfo.innerHTML =
        '史低: ' + GETSymbol(app.Info.lowest.price.currency) + app.Info.lowest.price.amount +
        ' (-' + app.Info.lowest.cut + '%) 于 ' + new Date(app.Info.lowest.timestamp).toLocaleDateString();

    const container = row.querySelector('div._7zQ9up20PmA-');
    if (container) {
        container.appendChild(lowestInfo);
        console.log('[史低]: 附加到容器 class: _7zQ9up20PmA-');
    } else {
        row.appendChild(lowestInfo);
        console.log('[史低]: 附加到row');
    }
}

function GETSymbol(currency) {
    return currency in CURRENCY_SYMBOLS ? CURRENCY_SYMBOLS[currency] : currency;
}
// 获取史低信息
async function GettingSteamDBAppInfo(mainAppId, pageType = "app", appIds = [], subIds = [], bundleIds = [], stores = "steam", cc = "cn", protocol = "https") {
    console.log('[史低]: GettingSteamDBAppInfo 调用 - pageType:', pageType, 'mainAppId:', mainAppId, 'appIds:', appIds, 'subIds:', subIds, 'bundleIds:', bundleIds);
    let requestPromise = null;

    if (pageType !== "wishlist" && !isNaN(mainAppId) && parseInt(mainAppId) > 0) {
        if (pageType == "bundle") {
            bundleIds = [mainAppId];
            appIds = [];
            subIds = [];
        } else if (pageType == "app") {
            appIds = [mainAppId];
            // subIds and bundleIds already collected
        } else if (pageType == "sub") {
            subIds = [mainAppId];
            // bundleIds already collected
            appIds = [];
        }
    }

    let requestUrl = protocol + "//api.augmentedsteam.com/prices/v2";
    console.log('[史低]: 请求URL:', requestUrl);
    const requestData = {
        "country": cc,
        "apps": appIds.map(x => parseInt(x)).filter(x => !isNaN(x)),
        "subs": subIds.map(x => parseInt(x)).filter(x => !isNaN(x)),
        "bundles": bundleIds.map(x => parseInt(x)).filter(x => !isNaN(x)),
        "voucher": true,
        "shops": [61]
    };
    console.log('[史低]: 请求数据:', requestData);
    //shops  61 = steam
    requestPromise = new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            url: requestUrl,
            data: JSON.stringify(requestData),
            onload: function (response) {
                console.log('[史低]: 请求成功 - 响应:', response.response);
                resolve(response.response);
            },
            onerror: function (error) {
                console.log('[史低]: 请求错误:', error);
                reject(error);
            }
        });
    });

    return requestPromise;
}