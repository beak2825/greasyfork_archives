// ==UserScript==
// @name         bilibili_toy
// @namespace    https://github.com/netnr
// @icon         https://zme.ink/favicon.svg
// @version      2026.01.04.1119
// @description  toy
// @author       netnr
// @license      MIT
// @match        *://www.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/558560/bilibili_toy.user.js
// @updateURL https://update.greasyfork.org/scripts/558560/bilibili_toy.meta.js
// ==/UserScript==

let nrBilibili = {
    init: async () => {
        if (location.pathname != "/") return;

        // 等待就绪
        for (let i = 0; i < 5; i++) {
            nrBilibili.domCards = document.querySelectorAll(nrBilibili.tsCardSelector);
            if (nrBilibili.domCards.length) {
                nrBilibili.domContainer = document.querySelector(".container");
                await nrBilibili.sleep(500);
                break;
            }
            await nrBilibili.sleep();
        }

        for (let domCard of nrBilibili.domCards) {
            nrBilibili.handleRocket(domCard);
        }

        if (nrBilibili.domContainer && !nrBilibili.tsObServer) {
            nrBilibili.tsObServer = new MutationObserver(function (mutationsList) {
                for (const mutation of mutationsList) {
                    if (mutation.type !== 'childList') continue;

                    // 新增的节点
                    mutation.addedNodes.forEach(addedNode => {
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            nrBilibili.handleRocket(addedNode);
                        }
                    });

                    // 子节点内容变动
                    let targetCard = nrBilibili.findCard(mutation.target);
                    if (targetCard) {
                        nrBilibili.handleRocket(targetCard);
                    }
                }
            });

            nrBilibili.tsObServer.observe(nrBilibili.domContainer, nrBilibili.tsConfig);
            console.warn("\n\n===== nrBilibili mount \n\n\n");
        }
    },

    // 查找卡片容器
    findCard: (node) => {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return null;

        if (nrBilibili.isCard(node)) return node;

        let parent = node.closest?.(nrBilibili.tsCardSelector);
        if (parent) return parent;

        return node.querySelector?.(nrBilibili.tsCardSelector);
    },

    // 判断是否为卡片
    isCard: (node) => node.classList?.contains("bili-feed-card"),

    handleRocket: (domCard) => {
        if (!domCard || domCard.nodeType !== Node.ELEMENT_NODE || domCard.nodeName !== "DIV") {
            return;
        }

        let card = nrBilibili.findCard(domCard);
        if (!card) return;

        let isAd = false;

        // 1. 检查广告文字（优先检查，无需等待 SVG）
        card.querySelectorAll("span").forEach(domSpan => {
            if (domSpan.textContent.trim() === "广告") {
                isAd = true;
            }
        });

        // 2. 检查 SVG 特征
        if (!isAd) {
            let svgNodes = card.querySelectorAll(".bili-video-card__mask svg");
            let hasSvgContent = Array.from(svgNodes).some(svg => svg.innerHTML.length > 0);

            // 有 SVG 但内容未加载，等待下次 mutation
            if (svgNodes.length > 0 && !hasSvgContent) return;

            card.querySelectorAll("svg").forEach(domSvg => {
                let svgLength = domSvg.innerHTML.length;
                if (Math.abs(svgLength - 3438) < 9) {
                    isAd = true;
                    console.debug("SVG特征匹配, 长度:", svgLength);
                }
            });

            // 有 SVG 容器但未匹配到特征，可能还在加载
            if (!isAd && svgNodes.length > 0) return;
        }

        if (isAd) {
            card.style.visibility = "hidden";
            console.debug("隐藏广告卡片");
        } else {
            card.style.visibility = "";
        }
    },

    domContainer: null,
    domCards: null,
    tsCardSelector: ".feed-card, .bili-feed-card",
    tsObServer: null,
    tsConfig: {
        childList: true,
        attributes: false,
        subtree: true,
        characterData: false
    },

    destroy: () => {
        if (nrBilibili.tsObServer) {
            nrBilibili.tsObServer.disconnect();
        }
        console.warn("\n\n===== nrBilibili unmount \n\n\n");
    },

    sleep: (time) => new Promise(resolve => setTimeout(() => resolve(), time || 1000))
};

nrBilibili.init();