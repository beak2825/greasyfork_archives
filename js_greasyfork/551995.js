// ==UserScript==
// @name         WarframeMarketTranslationPlus
// @version      1.1
// @description  WarframeMarket Translation 增强版,翻译 WarframeMarket 的商品对照中英文，英文游戏购买可以直接快速看见商品名，不需要开两个网页对照了,改自Boomer的WarframeMarket Translation https://greasyfork.org/users/1327824
// @author       Kaboy
// @match        https://warframe.market/zh-hans/profile/*
// @icon         https://warframe.market/favicon.ico
// @grant        unsafeWindow
// @license      MIT
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/551995/WarframeMarketTranslationPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/551995/WarframeMarketTranslationPlus.meta.js
// ==/UserScript==

// 定义一个空数组来记录值,记录该商品的行是否被生成过出售语句中
const recordedValues = ["想要卖"];
// 创建一个标志来跟踪是否已经插入
let isInserted = false;

// 创建允许快速复制的快速出售裂罅武器文本框
function createPurpleCardSellsStatementTextBox() {
    // 如果已经插入过，则不再执行
    if (isInserted) {
        return;
    }

    // 查找目标元素位置
    var targetElement = document.querySelector('#panel > section.flex--root.ad__line--je1R0 > div.container');

    // 创建一个新的 div 元素
    var purpleCardSellsStatementTextBox = document.createElement('div');

    // 使用正确的方法设置类名
    purpleCardSellsStatementTextBox.classList.add('row', 'auction-entry__body', 'no-gutters');

    // 组装武器名称
    const outputString = recordedValues.join(" ");
    // purpleCardSellsStatementTextBox.textContent = outputString;

    // 创建一个 span 元素
    var purpleCardSellsStatementSpan = document.createElement('span');
    purpleCardSellsStatementSpan.textContent = outputString;

    // 将 span 元素添加到 div 中
    purpleCardSellsStatementTextBox.appendChild(purpleCardSellsStatementSpan);
    // 将新的 div 元素插入到目标元素中
    targetElement.appendChild(purpleCardSellsStatementTextBox);

    // 设置标志为 true，表示已经插入过
    isInserted = true;



}
function handleTrans1() {

            var commonProductPath = document.querySelector("#panel > section.user__profile.content--UwhYJ.grow--Q24fj > div.content__header--mFlr5.flex-root > div.container > div > ul > li:nth-child(1) > a");
            var crackTheCommodityPath = document.querySelector("#panel > section.user__profile.content--UwhYJ.grow--Q24fj > div.content__header--mFlr5.flex-root > div.container > div > ul > li:nth-child(2) > a");

            // 判断当前是否在普通 "订单" 页面
            if (commonProductPath.className == "link smartLink--bBcyL active") {
                // 商品内容
                let ProductContents = document.querySelectorAll("div.orders--uU9cA > div > div")
                // let ProductContents = document.getElementsByClassName("infinite-translate");
                let WarframeMarketWantToSell = ProductContents[0];
                let re =`div.orders--uU9cA > div > div >`
                let WarframeMarketWantToSellNode = Array.from(document.querySelectorAll( `${re} div`));
                // 测试使用
                // console.log("WarframeMarketWantToSellNode 长度为 ：" + WarframeMarketWantToSellNode.length);

                // 加宽显示
                document.querySelector("div.content__body--qkyqR.flex--root > div.skin.flex--left")?.classList?.remove('flex--left')
                document.querySelector("div.content__body--qkyqR.flex--root > div:nth-child(1) > div").style.width = '280px'
                document.querySelector(`div.order__content--ORU7n`).style.width='1300px'

                // 使用 for 循环遍历WarframeMarketWantToSellNode并修改匹配的元素
                for (let i = 0; i < WarframeMarketWantToSellNode.length; i++) {

                    // 选择 商品的超链接 从中截取英文名称
                    let selector =  `${re} div:nth-child(${i+1}) > div > div.order-own__item-name--K7IDS > a`;
                    // let selector = `#panel > section.user__profile.content--UwhYJ.grow--Q24fj > div.content__body--qkyqR.flex--root > div.container > div.order__content--ORU7n > div.sellOrders--nsRSO.listingSell > div.infinite-scroll > div > div:nth-child(${i + 1}) > div.order-own__item-name--K7IDS > a`;

                    //减少宽度
                    document.querySelectorAll(`${re} div:nth-child(${i+1}) > div`).forEach(x=>x.style.width='580px');

                    let selectorElement = document.querySelector(selector);
                    // 给超链接标签添加些缩进，方便更好的复制
                    // 处理 英文名称
                    if (!selectorElement)
                        continue
                    let SelectorTheEnglishNameOfTheProduct = selectorElement.getAttribute("href").replace("/zh-hans/items/", "").replace(/\?.+/g, "");
                    // 选择 商品名称
                    let elementToModify = selector + ` > span`;
                    let elementToModifyElement = document.querySelector(elementToModify);

                    let formattedName = SelectorTheEnglishNameOfTheProduct.replace(/(?:^|_)(\w)/g, (match, p1) => p1.toUpperCase()).replace(/_/g, '').replace(/(\w)([A-Z])/g, '$1 $2');
                    formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
                    // 将首字母大写


                    let selectorElement2 = document.querySelectorAll(selector)[1];
                    let SelectorTheEnglishNameOfTheProduct2;
                    let formattedName2;
                    if (selectorElement2){
                        SelectorTheEnglishNameOfTheProduct2 = selectorElement2.getAttribute("href").replace("/zh-hans/items/", "").replace(/\?.+/g, "");
                        formattedName2 = SelectorTheEnglishNameOfTheProduct2.replace(/(?:^|_)(\w)/g, (match, p1) => p1.toUpperCase()).replace(/_/g, '').replace(/(\w)([A-Z])/g, '$1 $2');
                        formattedName2 = formattedName2.charAt(0).toUpperCase() + formattedName2.slice(1);
                        let elementToModifyElement2 = document.querySelectorAll(elementToModify)[1];
                        if (!elementToModifyElement2.innerHTML.includes("|"))
                            elementToModifyElement2.innerHTML = elementToModifyElement2.innerHTML + " | " + "( " + formattedName2 + " )";
                    }

                    // 如果该行已经插入过内容则跳过,判断条件为 被插入了 " | "
                    if (elementToModifyElement.innerHTML.includes("|")) {
                        continue; // 包含 "|"
                    } else {
                        // 执行插入语句
                        (function (index) {
                            // 在这里执行你想要的修改操作，例如：
                            elementToModifyElement.innerHTML = elementToModifyElement.innerHTML + " | " + "( " + formattedName + " )";

                            // 从图片alt里面获取中文


                            let imgPath =  `${re} div:nth-child(${i + 1}) > div > div.order-own__item-icon--aCi6u > a > img`; // 需要确保选择的是 img 元素
                            let generalMerchandisePictureElements = document.querySelector(imgPath);

                            console.log('图片元素:', generalMerchandisePictureElements);

                            let imgAlt = generalMerchandisePictureElements ? generalMerchandisePictureElements.alt : null;

                            // 调试输出
                            console.log('图片alt:', imgAlt);

                            // 写个复制按钮。方便复制名称
                            const button = document.createElement('button');
                            button.className = "btn btn__light--c9XBJ";
                            button.tabIndex = 0;
                            button.type = "button";
                            button.innerHTML = `
                            <div>
                                <svg class="wfm-icon icon-check" viewBox="0 0 512 512">
                                    <use xlink:href="/static/build/resources/wfm-icons-ef054e.svg#icon-check"></use>
                                </svg>
                                <span>` + "复制" + `</span>
                            </div>
                        `;
                            button.imgAlt = imgAlt;

                            // 添加点击事件监听器
                            button.addEventListener('click', function () {
                                if (imgAlt) {
                                    navigator.clipboard.writeText(imgAlt).then(() => {
                                        console.log('复制成功:', imgAlt);
                                    }).catch(err => {
                                        console.error('复制失败:', err);
                                    });
                                } else {
                                    console.log('没有内容可以复制');
                                }
                            });

                            // 将按钮插入到合适的位置
                            let buttonContainer = document.querySelector( `${re} div:nth-child(${index + 1}) > div > div.order-own__buttons--E1wap > div:nth-child(1)`); // 更新为你的按钮容器选择器
                            // let buttonContainer = document.querySelector(`#panel > section.user__profile.content--UwhYJ.grow--Q24fj > div.content__body--qkyqR.flex--root > div.container > div.order__content--ORU7n > div.sellOrders--nsRSO.listingSell > div.infinite-scroll > div > div:nth-child(${index + 1}) >  div.order-own__buttons--E1wap > div:nth-child(1)`); // 更新为你的按钮容器选择器

                            if (buttonContainer) {
                                buttonContainer.appendChild(button);
                            }
                        })(i);
                    }
                }

            }




            // 判断当前是否在裂罅 "拍卖" 页面
            if (crackTheCommodityPath.className == "link smartLink--bBcyL active") {

                // 商品内容
                let ProductContents = document.getElementsByClassName("infinite-translate");
                let WarframeMarketWantToSell = ProductContents[0];
                let WarframeMarketWantToSellNode = Array.from(WarframeMarketWantToSell.childNodes);
                // console.log("WarframeMarketWantToSellNode 长度为 ：" + WarframeMarketWantToSellNode.length);

                // 使用 for 循环遍历WarframeMarketWantToSellNode并修改匹配的元素
                for (let i = 0; i < WarframeMarketWantToSellNode.length; i++) {

                    // 裂罅商品路径
                    let crackTheCommodityPath = `#panel > section.user__profile.content--UwhYJ.grow--Q24fj > div.content__body--qkyqR.flex--root > div.container > div.infinite-scroll > div > section:nth-child(${i + 1}) > div.row.auction-entry__header.no-gutters > div:nth-child(1) > div > a`;
                    // 图片路径
                    var crackProductImagePath = crackTheCommodityPath + " > img";
                    // 名称路径
                    var crackTradeNamePath = crackTheCommodityPath + " > span";

                    // 选择商品的超链接从中截取英文名称
                    // 裂罅商品图片元素
                    let crackedProductImageElements = document.querySelector(crackProductImagePath);
                    // 获取到当前图片src里面的文字文本
                    var attribute = crackedProductImageElements.getAttribute("src");
                    // 处理文字文本取出英文武器名称
                    var theEnglishCrackNameObtained = attribute.substring(attribute.indexOf("/thumbs/") + "/thumbs/".length, attribute.indexOf(".", attribute.indexOf("/thumbs/")));
                    // 一行代码实现找到/thumbs/和第一个.之间的内容

                    let elementToModifyElement = document.querySelector(crackTradeNamePath);
                    // 如果该行已经插入过内容则跳过,判断条件为 被插入了 " | "



                    if (elementToModifyElement.innerHTML.includes("|")) {
                        continue; // 包含 "|"
                    } else {
                        // 执行插入语句
                        (function (index) {


                            // 在这里执行你想要的修改操作，例如：
                            theEnglishCrackNameObtained.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            var name = elementToModifyElement.innerHTML.substring(elementToModifyElement.innerHTML.indexOf(" ") + 1);
                            // 转驼峰
                            theEnglishCrackNameObtained = theEnglishCrackNameObtained.charAt(0).toUpperCase() + theEnglishCrackNameObtained.slice(1);
                            // 将原本的武器名称保留
                            var theOriginalNameOfTheWeapon = elementToModifyElement.innerHTML.trim();
                            // 组装处理好的文本语句
                            elementToModifyElement.style.paddingLeft = "20px"; // 添加缩进
                            elementToModifyElement.innerHTML = elementToModifyElement.innerHTML + " |  武器名称:( " + theEnglishCrackNameObtained + " ) 裂罅编号:( " + name + " )";


                            // 以下是快速裂罅紫卡出售语句组装
                            // 价格路径和价格处理
                            let pricePath = `#panel > section.user__profile.content--UwhYJ.grow--Q24fj > div.content__body--qkyqR.flex--root > div.container > div.infinite-scroll > div > section:nth-child(${i + 1}) > div.row.auction-entry__body.no-gutters > div.auction-entry__bids.col-12.col-sm-6.col-md-5.col-lg-4 > div > div > div > div > b`;
                            var platinumPrice = document.querySelector(pricePath).innerHTML;
                            // 检查数组中是否包含 当前商品行数
                            // 将 商品 添加到出售语句中 将 商品行数 添加到数组中
                            // 遍历 recordedValues 数组
                            let alreadyExists = false;

                            // 遍历 recordedValues 数组，检查是否包含 theOriginalNameOfTheWeapon
                            for (let item of recordedValues) {
                                if (item.includes(theOriginalNameOfTheWeapon)) {
                                    alreadyExists = true; // 找到匹配项
                                    break; // 找到后退出循环
                                }
                            }

                            if (!alreadyExists) {
                                recordedValues.push("[" + theOriginalNameOfTheWeapon + "] " + platinumPrice + "P");
                                console.log(theOriginalNameOfTheWeapon);
                            }

                        })(i);
                    }
                }

                // 执行裂罅快速语句插入文本框
                // 鼠标轮滚滚到最下面了
                if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
                    createPurpleCardSellsStatementTextBox();
                }

            }

            function addIndent(crackTheCommodityPath) {
                let selectorElement = document.querySelector(crackTheCommodityPath);
                if (!selectorElement) return;
            }

        }

function handleTrans0() {
    (function () {
        "use strict";

        // todo: 方法二
        // 监听滚轮事件
        window.addEventListener("wheel", handleTrans1);

    })()
}

window.addEventListener("wheel", handleTrans0);
setTimeout(handleTrans1,500)
setInterval(handleTrans1,800)