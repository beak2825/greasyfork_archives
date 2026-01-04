// ==UserScript==
// @name        Steam史低价格查询
// @namespace   https://github.com/zhengyang3552
// @description  基于软妹币玩家、byzod的steam价格查询脚本的优化，删除了进包信息（需要与加速配合使用）
// @include      https://store.steampowered.com/app/*
// @include      https://store.steampowered.com/bundle/*
// @include      https://store.steampowered.com/sub/*
// @homepage     https://github.com/zhengyang3552/SteamHistoryLowestPriceQuery
// @homepageURL https://github.com/zhengyang3552/SteamHistoryLowestPriceQuery
// @author      正阳
// @license     GPL version 3 or any later version
// @version     1.7.1
// @grant       GM_xmlhttpRequest
// @enable      true
// jshint esversion:6
// @downloadURL https://update.greasyfork.org/scripts/550211/Steam%E5%8F%B2%E4%BD%8E%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/550211/Steam%E5%8F%B2%E4%BD%8E%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
// 显示样式
// 0 = 显示在购买按钮上面
// 1 = 显示在购买信息框上面
const INFO_STYLE = 1;
// 货币区域覆盖，两个字母的国家代号,大小写均可
// 空字符（""）代表不覆盖，使用steam的cookie中steamCountry的值
// 见 https://zh.wikipedia.org/wiki/ISO_3166-1 或 https://en.wikipedia.org/wiki/ISO_3166-1
// 常用
//美国USD:"us", 
//中国CNY: "cn", 
//英国GBP: "uk", 
//日本JPY: "jp", 
//俄国RUS: "ru"
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
// 在app页和愿望单页显示史低价格
let urlMatch = location.href.match(/(app|sub|bundle)\/(\d+)/);
let appId = "";
let type = "";
let subIds = [];
let bundleids = [];
if (urlMatch && urlMatch.length == 3) {
    type = urlMatch[1]
    appId = urlMatch[2];
}
// 获取subs
document.querySelectorAll("input[name=subid]")
    .forEach(sub => subIds.push(sub.value));
// 获取bundles，解决捆绑包详情页无法显示信息问题
document.querySelectorAll("input[name=bundleid]")
    .forEach(bundle => bundleids.push(bundle.value));

// 如果在捆绑包页面但没有找到bundleid，使用URL中的appId
if (type === "bundle" && bundleids.length === 0) {
    bundleids.push(appId);
}

let cc = "cn";
if (CC_OVERRIDE.length > 0) {
    // 使用覆盖的货币区域
    cc = CC_OVERRIDE;
} else {
    // 使用默认的货币区域
    let ccMatch = document.cookie.match(/steamCountry=([a-z]{2})/i);
    if (ccMatch !== null && ccMatch.length == 2) {
        cc = ccMatch[1];
    }
}
AddLowestPriceTag(appId, type, subIds, bundleids, STORES.join(","), cc, location.protocol);
// 在商店页添加史低信息
async function AddLowestPriceTag(appId, type = "app", subIds = [], bundleids = [], stores = "steam", cc = "cn", protocol = "https") {
    // 史低信息容器们
    let lowestPriceNodes = {};
    // 统计subid
    let findSubIds = [];
    if (type == "bundle") {
        // bundle就一个, 视作subid
        findSubIds.push(appId);
    } else if (type == "app" || type == "sub") {
        // app/sub/bundle 可能有好多
        findSubIds = subIds.slice();
        if (bundleids.length > 0) {
            findSubIds.push.apply(findSubIds, bundleids);
        }
    }
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
        }
        if (gameWrapper) {
            let lowestInfo = document.createElement("div");
            lowestInfo.className = "game_lowest_price";
            lowestInfo.innerText = "正在读取价格信息...";
            switch (INFO_STYLE) {
                case 0:
                    gameWrapper.prepend(lowestInfo);
                    break;
                case 1:
                    gameWrapper.append(lowestInfo);
                    break;
            }
            lowestPriceNodes[subId] = lowestInfo;
        }
    });
    // 获取sub们的数据
    let data = null;
    try {
        data = await GettingSteamDBAppInfo(appId, type, subIds, bundleids, stores, cc, protocol);
        if ((typeof data == 'string'))
            data = JSON.parse(data);
    } catch (err) {
        console.log('[史低]: ' + err);
    }
    // 解析data
    let appInfos = [];
    // 如果是bundle，除了.meta外只有一个bundle/xxx，否则是一大堆xxx
    if (type == "bundle") {
        // 从data.prices中获取捆绑包信息
        if (data && data.prices && data.prices["bundle/" + appId]) {
            appInfos.push({ Id: appId, Info: data.prices["bundle/" + appId] });
        }
    } else if (type == "app" || type == "sub") {
        data = data.prices;
        for (let key in data) {
            let appid = key.replace(new RegExp('(app|sub|bundle)/'), "");
            if (!isNaN(appid)) {
                appInfos.push({ Id: appid, Info: data[key] });
            }
        }
    }
    // 如果查到info，塞到购买按钮上面去
    if (appInfos.length > 0) {
        // 为每一个sub或bundle添加史低
        appInfos.forEach(app => {
            let lowestInfo = lowestPriceNodes[app.Id];
            if (lowestInfo) {
                // 删除原始计算方式，直接使用API返回的app.Info.lowest app.Info.current lowestCut currentCut
                // 为价格设置toFixed(2)浮点，确保与steam价格浮点显示一致
                const lowestOriginalPrice = app.Info.lowest.regular.amount.toFixed(2);
                const currentOriginalPrice = app.Info.current.regular.amount.toFixed(2);
                const lowestCut = app.Info.lowest.cut;
                const currentCut = app.Info.current.cut;
                // 新增处理折扣到期时间（转换为本地时区的日期+时间）
                const currentExpiry = app.Info.current.expiry;
                const expiryText = currentExpiry 
                    ? new Date(currentExpiry).toLocaleString() 
                    : "无到期时间";

                lowestInfo.innerHTML =
                    // 历史最低价信息HTML
                    `历史最低价 | ${new Date(app.Info.lowest.timestamp).toLocaleDateString()} `
                    + (lowestCut > 0 ? 
                        `<span class="discount_pct">-${lowestCut}%</span> 
                        <span class="discount_original_price">${GETSymbol(app.Info.lowest.price.currency)}${lowestOriginalPrice}</span>
                        ` : '')
                    + `${GETSymbol(app.Info.lowest.price.currency)}${app.Info.lowest.price.amount.toFixed(2)}`
                    + ' | '
                    + '<a target="_blank" title="查看价格历史" href="' + app.Info.urls.history + '">查看价格历史</a>'
                    + '<br />'
                    // 当前价格信息
                    + (app.Info.current.price.amount <= app.Info.lowest.price.amount
                        ? `<span class="game_purchase_discount_countdown">当前为历史最低价</span>` + (currentCut > 0 ? ` | 优惠到期${expiryText}` : '')
                        : (currentCut > 0 ? 
                            `当前最低价 |
                            <span class="discount_pct">-${currentCut}%</span> 
                            <span class="discount_original_price">${GETSymbol(app.Info.current.price.currency)}${currentOriginalPrice}</span>
                            ${GETSymbol(app.Info.current.price.currency)}${app.Info.current.price.amount.toFixed(2)} | 优惠到期${expiryText}`
                            : `当前最低价 | ${GETSymbol(app.Info.current.price.currency)}${app.Info.current.price.amount.toFixed(2)}`))
                    + ' | '
                    + '<a target="_blank" title="查看价格信息" href="' + app.Info.urls.info + '">查看价格信息</a>';
            }
        });
    } else {
        // metaInfo为空，或者appInfos无内容
        console.log('[史低]: get lowest price failed, data = %o', data);
        for (let id in lowestPriceNodes) {
            lowestPriceNodes[id].innerHTML = "无法获取价格信息";
        }
    }
    // 返回史低info
    return Promise.resolve(lowestPriceNodes);
}
// 获取货币符号
function GETSymbol(currency) {
    return currency in CURRENCY_SYMBOLS ? CURRENCY_SYMBOLS[currency] : currency;
}
// 获取史低信息
async function GettingSteamDBAppInfo(appId, type = "app", subIds = [], bundleids = [], stores = "steam", cc = "cn", protocol = "https") {
    let requestPromise = null;
    let bundleId = [];
    if (type == "bundle") {
        //在捆绑包详情页面使用appId作为bundleId
        bundleId = [parseInt(appId)].filter(x => !isNaN(x));
    } else if (type == "app" || type == "sub") {
        bundleId = bundleids?.map(x => parseInt(x)).filter(x => !isNaN(x));
    }
    if (!isNaN(appId) && parseInt(appId) > 0) {
        let requestUrl = protocol + "//api.augmentedsteam.com/prices/v2";
        requestPromise = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                url: requestUrl,
                data: JSON.stringify({ 
                    "country": cc, 
                    "apps": [], 
                    "subs": subIds.map(x => parseInt(x)).filter(x => !isNaN(x)), 
                    "bundles": bundleId, 
                    "voucher": true, 
                    "shops": [61] 
                }),
                onload: function (response) {
                    resolve(response.response);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    } else {
        requestPromise = Promise.reject("Invalid appid");
    }
    return requestPromise;
}