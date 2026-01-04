// ==UserScript==
// @name         蜜柑计划增强整合版 (快速切换季度 + 强制桌面版 + Bangumi 评分 + 按评分排序)
// @namespace    https://mikanani.me/
// @version      1.2
// @description  蜜柑计划整合脚本：快速切换季度、强制桌面版、首页显示 Bangumi 评分 / 标签 / 链接、按评分排序。
// @author       多人脚本合并
// @match        https://mikanani.me/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548040/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E5%A2%9E%E5%BC%BA%E6%95%B4%E5%90%88%E7%89%88%20%28%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E5%AD%A3%E5%BA%A6%20%2B%20%E5%BC%BA%E5%88%B6%E6%A1%8C%E9%9D%A2%E7%89%88%20%2B%20Bangumi%20%E8%AF%84%E5%88%86%20%2B%20%E6%8C%89%E8%AF%84%E5%88%86%E6%8E%92%E5%BA%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548040/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E5%A2%9E%E5%BC%BA%E6%95%B4%E5%90%88%E7%89%88%20%28%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E5%AD%A3%E5%BA%A6%20%2B%20%E5%BC%BA%E5%88%B6%E6%A1%8C%E9%9D%A2%E7%89%88%20%2B%20Bangumi%20%E8%AF%84%E5%88%86%20%2B%20%E6%8C%89%E8%AF%84%E5%88%86%E6%8E%92%E5%BA%8F%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /***************** 功能 1: 快速切换季度 *****************/
    var prevBtn = createButton("上一季", "fixed", "10px", "80px");
    var nextBtn = createButton("下一季", "fixed", "10px", "10px");

    document.body.appendChild(prevBtn);
    document.body.appendChild(nextBtn);

    prevBtn.addEventListener("click", function () {
        updateSeason(getLast());
    });

    nextBtn.addEventListener("click", function () {
        updateSeason(getNext());
    });

    function createButton(text, position, bottom, right) {
        var button = document.createElement("button");
        button.textContent = text;
        button.style.position = "fixed";
        button.style.bottom = bottom;
        button.style.right = right;
        button.style.zIndex = 9999;
        return button;
    }

    function getNow() {
        var nowInfo = document.querySelector("#sk-data-nav > div > ul.navbar-nav.date-select > li > div > div.sk-col.date-text").textContent.trim();
        return extractYearAndSeason(nowInfo);
    }
    function getNext() {
        var current = getNow();
        var order = ['冬', '春', '夏', '秋'];
        var index = order.indexOf(current.season);
        return (index !== order.length - 1)
            ? { year: current.year, season: order[index + 1] }
            : { year: parseInt(current.year, 10) + 1, season: order[0] };
    }
    function getLast() {
        var current = getNow();
        var order = ['冬', '春', '夏', '秋'];
        var index = order.indexOf(current.season);
        return (index !== 0)
            ? { year: current.year, season: order[index - 1] }
            : { year: parseInt(current.year, 10) - 1, season: order[order.length - 1] };
    }

    function extractYearAndSeason(inputString) {
        var match = inputString.match(/(\d{4})\s*([春夏秋冬]+)/);
        return match ? { year: match[1], season: match[2] } : null;
    }

    function updateSeason(result) {
        var element = document.createElement("div");
        element.setAttribute("data-year", result.year);
        element.setAttribute("data-season", result.season);
        UpdateBangumiCoverFlow(element, true);
    }

    /***************** 功能 2: 强制桌面版 *****************/
    var ts = document.createElement('style');
    ts.textContent = '.hidden-sm.hidden-sm{display:block !important;}'
        + '.hidden-xs.hidden-xs{display:block !important;}'
        + '.hidden-md.hidden-md{display:none !important;}'
        + '.hidden-lg.hidden-lg{display:none !important;}';
    document.head.append(ts);

    /***************** 功能 3: 显示 Bangumi 评分 *****************/
    let config = {
        sortByScore: true, // ← 默认开启按评分排序
        logLevel: 2,
        minScore: 0,
        tagsRegex: /\d{4}|TV|动画|小说|漫|轻改|游戏改|原创|[a-zA-Z]/,
        tagsNum: 3,
        bgmToken: '',
    };

    let logger = {
        error: function (...args) { if (config.logLevel >= 1) console.log('%cerror', 'color: yellow; font-style: italic; background-color: blue;', ...args); },
        info: function (...args) { if (config.logLevel >= 2) console.log('%cinfo', 'color: yellow; font-style: italic; background-color: blue;', ...args); },
        debug: function (...args) { if (config.logLevel >= 3) console.log('%cdebug', 'color: yellow; font-style: italic; background-color: blue;', ...args); },
    };

    function createElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstElementChild;
    }
    async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function getJSON(url) {
        try {
            let headers = {
                'Authorization': `Bearer ${config.bgmToken}`,
                'User-Agent': 'mikanBgm/0.1 (https://github.com/kjtsune/UserScripts)'
            }
            let options = (config.bgmToken) ? { headers: headers } : null;
            const response = await fetch(url, options);
            logger.info(`fetch ${url}`)
            if (response.status >= 200 && response.status < 400)
                return await response.json();
            console.error(`Error fetching ${url}:`, response.status, response.statusText, await response.text());
        }
        catch (e) {
            console.error(`Error fetching ${url}:`, e);
        }
    }
    async function getBgmJson(bgmId) { return await getJSON(`https://api.bgm.tv/v0/subjects/${bgmId}`); }
    async function cleanBgmTags(tags) { tags = tags.filter(item => item.count >= 10 && !(config.tagsRegex.test(item.name))); return tags.map(item => item.name); }
    async function getParsedBgmInfo(bgmId, stringify = false) {
        let bgmJson = await getBgmJson(bgmId);
        let score = (bgmJson) ? bgmJson.rating.score : 0.1;
        let summary = (bgmJson) ? bgmJson.summary : "18x or network error";
        let date = (bgmJson) ? bgmJson.date : new Date();
        let tags = (bgmJson) ? await cleanBgmTags(bgmJson.tags) : [];
        let res = { score: score, summary: summary, date: date, tags: tags };
        return (stringify) ? JSON.stringify(res) : res;
    }
    function queryAllForArray(seletor, elementArray) {
        let result = [];
        for (const element of elementArray) {
            let res = element.querySelectorAll(seletor);
            if (!res) logger.error("queryAllForArray not result", seletor, element);
            result.push(...res);
        }
        return result
    }
    function multiTimesSeletor(storage = null, seletorAll = false, ...cssSeletor) {
        const seletor = cssSeletor[0]
        const restSeletor = cssSeletor.slice(1)
        if (!seletor) return storage;
        if (seletorAll) {
            storage = storage || [document]
            let res = queryAllForArray(seletor, storage);
            if (res) storage = res;
            storage && logger.debug('storage', storage.length, seletor, restSeletor);
            return (!restSeletor) ? storage : multiTimesSeletor(storage, true, ...restSeletor);
        } else {
            storage = storage || document;
            const lastRes = storage;
            storage = storage.querySelector(seletor);
            storage && logger.debug('storage', storage, seletor);
            if (!storage) logger.error("not result", seletor, lastRes);
            return (!restSeletor) ? storage : multiTimesSeletor(storage, false, ...restSeletor);
        }
    }
    async function myFetch(url, selector = null, selectAll = false) {
        let response = await fetch(url);
        let text = await response.text();
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(text, "text/html");
        const element = htmlDocument.documentElement;
        if (!selector) return element;
        return selectAll ? element.querySelectorAll(selector) : element.querySelector(selector);
    }
    async function getBgmId(mikanUrl) {
        let selector = "p.bangumi-info > a[href*='tv/subject']";
        let bgm = await myFetch(mikanUrl, selector);
        if (bgm) bgm = bgm.href.split("/").slice(-1)[0];
        return bgm
    }

    class MyStorage {
        constructor(prefix, splitStr = '|', expireDay = 0, useGM = false) {
            this.prefix = prefix;
            this.splitStr = splitStr;
            this.expireDay = expireDay;
            this.expireMs = expireDay * 864E5;
            this._getItem = (useGM) ? GM_getValue : localStorage.getItem.bind(localStorage);
            this._setItem = (useGM) ? GM_setValue : localStorage.setItem.bind(localStorage);
            this._removeItem = (useGM) ? GM_deleteValue : localStorage.removeItem.bind(localStorage);
        }
        _msToDay(ms) { return ms / 864E5; }
        _keyGenerator(key) { return `${this.prefix}${this.splitStr}${key}` }
        get(key, defalut = null) {
            key = this._keyGenerator(key);
            let res = this._getItem(key);
            if (this.expireMs && res) res = JSON.parse(this._getItem(key)).value;
            return res || defalut;
        }
        set(key, value) {
            key = this._keyGenerator(key);
            if (this.expireMs) value = JSON.stringify({ timestamp: Date.now(), value: value })
            this._setItem(key, value)
        }
        del(key) {
            key = this._keyGenerator(key);
            try { this._removeItem(key); } catch (error) { }
        }
        checkIsExpire(key, expireDay = null) {
            key = this._keyGenerator(key);
            let exists = key in localStorage;
            if (!exists) return true;
            if (!this.expireMs && exists) return false;
            let data = JSON.parse(this._getItem(key))
            let timestamp = data.timestamp;
            expireDay = (expireDay !== null) ? expireDay : this.expireDay;
            let expireMs = expireDay * 864E5;
            return (timestamp + expireMs < Date.now());
        }
    }

    class BgmStorage extends MyStorage {
        bgmIsExpire(key) {
            let airDate = this.get(key, Object).date;
            if (!airDate) return true;
            let airedDay = this._msToDay(new Date().getTime() - new Date(airDate).getTime());
            let expireDay = 15;
            if (airedDay < 10) expireDay = 1;
            else if (airedDay < 20) expireDay = 2;
            else if (airedDay < 180) expireDay = 5;
            return this.checkIsExpire(key, expireDay);
        }
    }

    async function addScoreSummaryToHtml(mikanElementList) {
        for (const element of mikanElementList) {
            let scoreElement = element.nextElementSibling;
            if (scoreElement) continue;
            let mikanUrl = element.href;
            let mikanId = mikanUrl.split('/').slice(-1)[0];
            let bgmId = mikanBgmStorage.get(mikanId);
            let bgmInfo = bgmInfoStorage.get(bgmId);
            if (!bgmId || !bgmInfo) continue;
            let bgmUrl = `https://bgm.tv/subject/${bgmId}`
            let score = bgmInfo.score;
            let summary = bgmInfo.summary;
            let tags = bgmInfo.tags;
            let tagsHtml = '';
            if (tags && tags.length > 0 && config.tagsNum > 0) {
                tags = tags.filter(name => !config.tagsRegex.test(name));
                tagsHtml = `<br>${tags.slice(0, config.tagsNum)}`;
                element.insertAdjacentHTML("afterend", tagsHtml);
            }
            let bgmHtml = `<a href="${bgmUrl}" target="_blank" title="${summary}" id="bgmScore">⭐ ${score}</a>`
            element.insertAdjacentHTML("afterend", bgmHtml);
        }
    }

    let mikanBgmStorage = new MyStorage("mikan");
    let bgmInfoStorage = new BgmStorage("bgm", undefined, 7);

    async function storeMikanBgm(mikanElementList, storeBgmInfo = false) {
        for (const element of mikanElementList) {
            let mikanUrl = element.href;
            let mikanId = mikanUrl.split('/').slice(-1)[0];
            let bgmId = mikanBgmStorage.get(mikanId)
            if (!bgmId) {
                bgmId = await getBgmId(mikanUrl);
                mikanBgmStorage.set(mikanId, bgmId);
                await sleep(1000);
            }
            if (storeBgmInfo && bgmId && bgmInfoStorage.bgmIsExpire(bgmId)) {
                bgmInfoStorage.set(bgmId, await getParsedBgmInfo(bgmId));
            }
            await addScoreSummaryToHtml([element]);
        }
    }

    /***************** 功能 4: 按评分排序 *****************/
    function swapElements(element1, element2) {
        const parent1 = element1.parentNode;
        const parent2 = element2.parentNode;
        const temp = document.createElement('li');
        parent1.insertBefore(temp, element1);
        parent2.insertBefore(element1, element2);
        parent1.insertBefore(element2, temp);
        parent1.removeChild(temp);
    }

    function sortBangumi() {
        for (const day_group of document.querySelectorAll('div.sk-bangumi')) {
            if (day_group.querySelector('.sorted-marker')) return;
            let ls = Array.from(day_group.querySelectorAll('.an-ul > li'));
            let sorted_ls = Array.from(ls);
            sorted_ls.sort((a, b) => {
                const score_node_a = a.querySelector('#bgmScore');
                const score_node_b = b.querySelector('#bgmScore');
                if (!score_node_a || !score_node_b) return 0;
                const scoreA = parseFloat(score_node_a.textContent.replace('⭐', '').trim());
                const scoreB = parseFloat(score_node_b.textContent.replace('⭐', '').trim());
                return scoreB - scoreA; // 从大到小排序
            });
            for (const sorted_ele of sorted_ls) {
                let current_ls = Array.from(day_group.querySelectorAll('.an-ul > li'));
                let correct_idx = sorted_ls.indexOf(sorted_ele);
                let current_ele = current_ls[correct_idx];
                swapElements(sorted_ele, current_ele);
            }
            const marker = document.createElement('div');
            marker.className = 'sorted-marker';
            day_group.appendChild(marker);
        }
        logger.info('sortBangumi Done')
    }

    /***************** 主循环 *****************/
    async function main() {
        let animeList = multiTimesSeletor(null, true, "div.sk-bangumi", "a[href^='/Home/Bangumi']");
        await storeMikanBgm(animeList, true);
        await addScoreSummaryToHtml(animeList);
        if (config.sortByScore) sortBangumi();
    }

    (function loop() {
        setTimeout(async function () {
            await main();
            loop();
        }, 2000);
    })();

})();
