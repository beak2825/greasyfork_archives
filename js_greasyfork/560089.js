// ==UserScript==
// @name         YouTube作品列表查找
// @namespace    蒋晓楠
// @version      20251222
// @description  到指定作品位置
// @author       蒋晓楠
// @license      MIT
// @match        https://www.youtube.com/@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/560089/YouTube%E4%BD%9C%E5%93%81%E5%88%97%E8%A1%A8%E6%9F%A5%E6%89%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/560089/YouTube%E4%BD%9C%E5%93%81%E5%88%97%E8%A1%A8%E6%9F%A5%E6%89%BE.meta.js
// ==/UserScript==

function 读取运行间隔() {
    return GM_getValue("运行间隔", 3);
}

function 设置运行间隔(值) {
    GM_setValue("运行间隔", parseInt(值));
}

function 查找(目标作品名) {
    let 目标名字 = false;
    document.querySelectorAll("ytd-rich-item-renderer:not(.已处理)").forEach((项目) => {
        let 名字 = 项目.querySelector("#video-title").textContent;
        if (名字.indexOf(目标作品名) > -1) {
            目标名字 = 名字;
        } else {
            //用隐藏代替删除
            项目.style.display = "none";
            项目.classList.add("已处理");
        }
    });
    if (目标名字 === false) {
        window.scrollTo({top: document.documentElement.scrollHeight,});
        setTimeout(() => {
            查找(目标作品名);
        }, 读取运行间隔() * 1000);
    } else {
        alert("查找到目标作品：" + 目标作品名);
    }
}

function 执行() {
    GM_registerMenuCommand("输入作品名", () => {
        let 名字 = prompt("查找到含有这个的就会停止");
        if (名字 !== null && 名字 !== "") {
            查找(名字);
        }
    });
    GM_registerMenuCommand("设置运行间隔", () => {
        let 间隔 = prompt("太低可能会被YouTube拉黑，单位秒", 读取运行间隔());
        if (间隔 !== null && 间隔 !== "") {
            设置运行间隔(间隔);
        }
    });
}

执行();