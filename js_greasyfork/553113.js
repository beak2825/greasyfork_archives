// ==UserScript==
// @name        AcFun文章区屏蔽
// @namespace   蒋晓楠
// @version     20251030
// @description 看到什么事都能往游戏上引和其它一些恶心的玩意，我想屏蔽但是网页不提供这个功能，所以只能自己动手
// @author      蒋晓楠
// @license     MIT
// @match       https://www.acfun.cn/
// @match       https://www.acfun.cn/a/ac*
// @match       https://www.acfun.cn/u/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=www.acfun.cn
// @require     https://update.greasyfork.org/scripts/553373/1682026/%E6%95%B0%E6%8D%AE%E7%AE%A1%E7%90%86.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/553113/AcFun%E6%96%87%E7%AB%A0%E5%8C%BA%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/553113/AcFun%E6%96%87%E7%AB%A0%E5%8C%BA%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
function 获取屏蔽作者名列表() {
    return Object.values(获取数据());
}

function 屏蔽用户(标识符, 名字) {
    if (confirm(`确认屏蔽【${名字}】吗？`)) {
        let 数据 = 获取数据();
        数据[标识符] = 名字;
        保存数据(数据);
        alert("完成");
    }
}

function 文章列表处理() {
    let 检测 = setInterval(() => {
        let 文章区 = document.querySelectorAll(".tab-main-content li");
        if (文章区 !== null) {
            clearInterval(检测);
            let 作者名字 = 获取屏蔽作者名列表();
            文章区.forEach((文章) => {
                let 信息块 = 文章.querySelector("[title]");
                let 作者 = 信息块.title.match(/UP:(.*)/)[1];
                if (作者名字.indexOf(作者) > -1) {
                    console.log("屏蔽【" + 信息块.textContent + "】作者：" + 作者);
                    文章.remove();
                }
            })
        }
    }, 1000);
}

function 文章处理() {
    setInterval(() => {
        let 数据 = 获取数据();
        document.querySelectorAll(".area-sec-list>div:not(.已处理)").forEach((元素) => {
            let 信息列 = 元素.querySelector(".name");
            let 标识符 = 信息列.dataset["userid"];
            let 名字 = 信息列.textContent;
            if (数据[标识符] === undefined) {
                let 按钮 = GM_addElement(元素.querySelector(".area-comment-title"), "button", {textContent: "屏蔽"});
                按钮.onclick = function () {
                    屏蔽用户(标识符, 名字);
                };
                元素.classList.add("已处理");
            } else {
                console.log(名字 + "（" + 标识符 + "）被屏蔽");
                元素.remove();
            }
        });
    }, 1000);
}

function 用户页处理() {
    let 标识符 = document.querySelector("#ac-space").dataset["uid"],
        名字 = document.querySelector(".name").dataset["username"];
    let 按钮 = GM_addElement(document.querySelector(".top"), "button", {textContent: "屏蔽"});
    按钮.onclick = function () {
        屏蔽用户(标识符, 名字);
    };
}

function 执行() {
    let 路径 = location.pathname;
    if (路径.startsWith("/a/")) {
        文章处理();
    } else if (路径 === "/") {
        文章列表处理();
    } else {
        用户页处理();
    }
    setTimeout(() => {
        初始化导出数据菜单();
        初始化导入数据菜单();
        console.log("屏蔽用户", 获取数据());
    }, 1000);
}

执行();