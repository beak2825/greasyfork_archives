// ==UserScript==
// @name         VRChatResoureSearch
// @namespace    http://vrcpirate.com/
// @version      2025-11-05
// @description  Search for download links in boothplorer.
// @author       VRChat Player
// @match        https://boothplorer.com/*
// @icon         https://boothplorer.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://unpkg.com/dexie/dist/dexie.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554884/VRChatResoureSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/554884/VRChatResoureSearch.meta.js
// ==/UserScript==

const $ = window.jQuery;
let divMap = {};
let searchSwitch = false;

/**
 * 从缓存读取数据
 * @param {string} bid Booth ID
 * @returns {Promise<any>}
 */
async function dbGetInfo(bid) {
    let db = new Dexie("VRCPirate-Temp");
    try {
        db.version(1).stores({
            resources: 'bid, pid, timestamp'
        });
        return await db.resources.get({ bid });
    } catch (e) {
        return null;
    } finally {
        db.close();
    }
}

/**
 * 
 * @param {string} bid Booth ID
 * @param {string | null} pid VRCOurate UUID
 */
async function dbUpdateInfo(bid, pid) {
    let db = new Dexie("VRCPirate-Temp");
    try {
        db.version(1).stores({
            resources: 'bid, pid, timestamp'
        });
        let info = await db.resources.get({ bid });
        if (info)
            await db.resources.update(bid, { bid, pid, time: Math.round(new Date().getTime() / 60000) });
        else
            await db.resources.add({ bid, pid, time: Math.round(new Date().getTime() / 60000) });
    } catch (e) {
        console.error(e);
    } finally {
        db.close();
    }
}

/**
 * 从VRCPirate搜索资源下载链接
 * @param {string} bid 
 * @returns {Promise<string>}
 */
async function searchResourceFromVRCPirate(bid) {
    let info = await dbGetInfo(bid);
    // 如果pid存在，直接返回链接
    if (info && info.pid)
        return `https://vrcpirate.com/iviewer/${info.pid}`;
    // 如果info存在，判断时间戳是否经过24小时
    if (info && (Math.round(new Date().getTime() / 60000) - info.time) < 24 * 60)
        throw "Resource not found in 24 hours"
    // 请求VRCPirate API获取资源信息
    console.log(`Search resource ${bid} from VRCPirate...`);
    let pid = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api-v2.vrcpirate.com/assets?search=${bid}`,
            onload: function (response) {
                let data = JSON.parse(response.responseText);
                if (data.data.length == 0) {
                    dbUpdateInfo(bid, null);
                    reject("Not found");
                    return;
                }
                resolve(data.data[0].id)
            },
            onerror: function (reason) {
                console.error(`Search resource ${bid} error:`, reason);
                resolve(reason);
            }
        })
    });
    dbUpdateInfo(bid, pid);
    return `https://vrcpirate.com/iviewer/${pid}`;
}

/**
 * 搜索资源下载链接
 * @param {string[]} queue 
 */
function searchResource(queue) {
    // console.log("Search resource:", queue);
    for (let i = 0; i < queue.length; i++) {
        let bid = queue[i];
        searchResourceFromVRCPirate(bid).then(url => {
            if (!searchSwitch) return;
            console.log(`Search resource ${bid} result:`, url);
            let a = divMap[bid].find("a");
            a.attr("href", url);
            a.attr("target", "_blank");
            divMap[bid][0].style.color = "green";
            divMap[bid][0].style.display = "";
        }, e => {
            if (!searchSwitch) return;
            console.log(`Search resource ${bid} failed: ${e}`);
            divMap[bid][0].style.color = "red";
            // divMap[bid][0].style.display = "none"; // 隐藏搜索失败的资源
        });
    }
}

/**
 * 页面资源加载完成，找出新增加的资源ID
 */
function onResourceFetchDone() {
    // console.log("Resource fetch done.")
    let aList = $("article a")
    let queue = [];
    for (let i = 0; i < aList.length; i++) {
        if (!aList[i].href.match(/\/\d+$/)) continue;
        let bid = aList[i].href.match(/\d+$/)[0];
        // console.log(`Get resource id: ${aList[i].href} => ${id}`);
        if (divMap[bid]) continue;
        divMap[bid] = $(aList[i].parentNode.parentNode.parentNode);
        queue.push(bid);
    }
    searchResource(queue);
}

/**
 * 恢复页面状态
 */
function restorePage() {
    for (let bid in divMap) {
        divMap[bid][0].style.color = "";
        divMap[bid][0].style.display = "";
        divMap[bid].find("a").attr("href", `https://boothplorer.com/avatar/${bid}`)
    }
    divMap = {};
}

/**
 * 在页面资源加载完成后，延迟执行搜索资源下载链接
 */
(function () {
    'use strict';

    const toggleBtn = $($("button")[0]).clone()
    toggleBtn.text("Search Download");
    toggleBtn.css("margin-left", ".5rem");
    toggleBtn.click(function () {
        searchSwitch = !searchSwitch;
        if (searchSwitch) {
            toggleBtn.text("Searching Links...");
            toggleBtn.css("background-color", "red");
            onResourceFetchDone();
        } else {
            toggleBtn.text("Search Download");
            toggleBtn.css("background-color", "");
            restorePage();
        }
    });
    toggleBtn.insertAfter($('#sort').parent());

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        // 监听列表请求
        if (searchSwitch && method == "POST" && url.match(/^https:\/\/boothplorer\.com\/(avatars?|items)\/(items\/)?fetch/)) {
            // 监听请求结束
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
                    // 延迟执行，等待数据加载完成
                    setTimeout(() => {
                        onResourceFetchDone();
                    }, 200);
                }
            });
        }
        // 调用原始open方法，确保请求正常发送（不修改任何行为）
        originalOpen.apply(this, arguments);
    };
})();