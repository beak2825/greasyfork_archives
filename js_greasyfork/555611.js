// ==UserScript==
// @name         GT API get
// @version      0.7
// @description  get mp per minute
// @icon         https://galactictycoons.com/favicon.ico
// @include      https://g2.galactictycoons.com*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.g2.galactictycoons.com
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/555611/GT%20API%20get.user.js
// @updateURL https://update.greasyfork.org/scripts/555611/GT%20API%20get.meta.js
// ==/UserScript==

const FETCH_KEYS = {
    MATERIAL: "last_fetch_material",
    GAMEDATA: "last_fetch_gamedata",
    COMPANY:  "last_fetch_company"
};

const INTERVALS = {
    MATERIAL: 1 * 2 * 60 * 1000,//2m
    GAMEDATA: 12 * 60 * 60 * 1000,//12h
    COMPANY:  12 * 60 * 60 * 1000//12h
};

GM_registerMenuCommand("设置自定义Limit API", () => {
    const oldUrl = localStorage.getItem("custom_api") || "";
    const url = prompt("请输入自定义Limit API：", oldUrl);

    if (url !== null) {
        localStorage.setItem("custom_api", url);
        alert("自定义Limit API 已保存:\n" + url);
    }
});

GM_registerMenuCommand("清除自定义Limit API", () => {
    localStorage.removeItem("custom_api");
    alert("已清除自定义Limit API");
});

function fetchCompany() {
    if (!canFetch(FETCH_KEYS.COMPANY, INTERVALS.COMPANY)) {
        console.log("[Company] 未到刷新时间，跳过");
        return;
    }

    const apikey = localStorage.getItem("custom_api");
    if (!apikey) {
        console.warn("[Company] 未设置 API Key");
        return;
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.g2.galactictycoons.com/public/company?apikey=" + apikey,
        onload(res) {
            if (res.status !== 200) {
                console.warn(`[Company] 非200: ${res.status}`);
                return;
            }
            try {
                const data = JSON.parse(res.responseText);
                localStorage.setItem("company_info", JSON.stringify(data));
                markFetched(FETCH_KEYS.COMPANY);
                console.log("[Company] 更新成功", data);
            } catch (e) {
                console.error("[Company] JSON 解析失败", e);
            }
        }
    });
}

function fetchMaterialPrices() {
    if (!canFetch(FETCH_KEYS.MATERIAL, INTERVALS.MATERIAL)) {
        console.log("[MaterialPrice] 未到刷新时间，跳过");
        return;
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.g2.galactictycoons.com/public/exchange/mat-prices",
        onload(res) {
            if (res.status !== 200) {
                console.warn(`[MaterialPrice] 非200: ${res.status}`);
                return;
            }
            try {
                const data = JSON.parse(res.responseText);
                localStorage.setItem("material_price", JSON.stringify(data));
                markFetched(FETCH_KEYS.MATERIAL);
                console.log("[MaterialPrice] 更新成功", data);
            } catch (e) {
                console.error("[MaterialPrice] JSON 解析失败", e);
            }
        }
    });
}

function fetchGameData() {
    if (!canFetch(FETCH_KEYS.GAMEDATA, INTERVALS.GAMEDATA)) {
        console.log("[GameData] 未到刷新时间，跳过");
        return;
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.g2.galactictycoons.com/gamedata.json",
        onload(res) {
            if (res.status !== 200) {
                console.warn(`[GameData] 非200: ${res.status}`);
                return;
            }
            try {
                const data = JSON.parse(res.responseText);
                localStorage.setItem("game_data", JSON.stringify(data));
                markFetched(FETCH_KEYS.GAMEDATA);
                console.log("[GameData] 更新成功", data);
            } catch (e) {
                console.error("[GameData] JSON 解析失败", e);
            }
        }
    });
}

function canFetch(key, intervalMs) {
    const last = Number(localStorage.getItem(key) || 0);
    return Date.now() - last >= intervalMs;
}

function markFetched(key) {
    localStorage.setItem(key, Date.now());
}

fetchMaterialPrices();
setInterval(fetchMaterialPrices, INTERVALS.MATERIAL);

fetchGameData();
setInterval(fetchGameData, INTERVALS.GAMEDATA);

fetchCompany();
setInterval(fetchCompany, INTERVALS.COMPANY);
