// ==UserScript==
// @name         淘寶(含天貓)京東手機版網頁轉電腦版
// @name:en      Taobao (including Tmall) & JD Mobile to PC Redirect
// @name:zh-CN   淘宝(含天猫)京东手机版网页转桌面端
// @namespace    none
// @version      1.0
// @description       自動將京東、淘寶、天貓手機版網頁轉換為PC版網頁
// @description:en    Automatically redirects mobile links (Taobao, TMall, JD) to their PC version.
// @description:zh-CN 自动将京东、淘宝、天猫手机版网页转换为PC端网页
// @author       Alius
// @license      MIT
// @match        *://item.m.jd.com/*
// @match        *://shop.m.jd.com/*
// @match        *://detail.m.tmall.com/*
// @match        *://h5.m.taobao.com/*
// @match        *://m.intl.taobao.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564241/%E6%B7%98%E5%AF%B6%28%E5%90%AB%E5%A4%A9%E8%B2%93%29%E4%BA%AC%E6%9D%B1%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%E8%BD%89%E9%9B%BB%E8%85%A6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/564241/%E6%B7%98%E5%AF%B6%28%E5%90%AB%E5%A4%A9%E8%B2%93%29%E4%BA%AC%E6%9D%B1%E6%89%8B%E6%A9%9F%E7%89%88%E7%B6%B2%E9%A0%81%E8%BD%89%E9%9B%BB%E8%85%A6%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryParam(urlObj, param) {
        return urlObj.searchParams.get(param);
    }

    try {
        const currentUrl = window.location.href;
        const urlObj = new URL(currentUrl);
        let newUrl = null;

        if (/(?:h5\.m|m\.intl)\.taobao\.com/.test(urlObj.hostname)) {
            const id = getQueryParam(urlObj, 'id');
            const skuId = getQueryParam(urlObj, 'skuId');
            
            if (id && /^\d+$/.test(id)) {
                newUrl = `https://item.taobao.com/item.htm?id=${id}`;
                if (skuId) newUrl += `&skuId=${skuId}`;
            }
        }
        else if (/detail\.m\.tmall\.com/.test(urlObj.hostname)) {
            const id = getQueryParam(urlObj, 'id');
            const skuId = getQueryParam(urlObj, 'skuId');
            
            if (id && /^\d+$/.test(id)) {
                newUrl = `https://detail.tmall.com/item.htm?id=${id}`;
                if (skuId) newUrl += `&skuId=${skuId}`;
            }
        }
        else if (/item\.m\.jd\.com/.test(urlObj.hostname)) {
            const matchPath = currentUrl.match(/(?:product|detail)\/(\d+)\.html/);
            const wareId = getQueryParam(urlObj, 'wareId');
            
            if (matchPath) {
                newUrl = `https://item.jd.com/${matchPath[1]}.html`;
            } else if (wareId && /^\d+$/.test(wareId)) {
                newUrl = `https://item.jd.com/${wareId}.html`;
            }
        }
        else if (/shop\.m\.jd\.com/.test(urlObj.hostname)) {
             const matchShop = currentUrl.match(/shop\/home\/(\w+)\.html/);
             if (matchShop) {
                 newUrl = `https://shop.jd.com/home/popup/shopHome.html?id=${matchShop[1]}`;
             }
        }

        if (newUrl) {
            window.location.replace(newUrl);
        }

    } catch (e) {
        // Silent fail
    }

})();