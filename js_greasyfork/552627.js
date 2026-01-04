// ==UserScript==
// @name         ItHome增强
// @namespace    http://tampermonkey.net/
// @version      2025-10-18
// @description  ithome去广告和烦人的提示 和修复暗色模式的一些适配问题
// @author       LangYa466
// @match        https://*.ithome.com/*
// @match        https://ithome.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ithome.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552627/ItHome%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552627/ItHome%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const menuAPP = document.querySelector('#menu-app');
    if (menuAPP) menuAPP.remove();

    const downTab = document.querySelector('#down');
    if (downTab) downTab.remove();

    const downAPPTab = document.querySelector('a.down_app');
    if (downAPPTab) downAPPTab.remove();

    const weixinLink = document.querySelector('a.sfa.sideweixin');
    if (weixinLink) weixinLink.remove();

    const appLink = document.querySelector('a.sfa.app');
    if (appLink) appLink.remove();

    // 底部一堆友情链接
    const flsLink = document.querySelector('#fls');
    if (flsLink) flsLink.remove();

    // 招聘新闻
    const ilikeitLink = document.querySelector('#ilikeit');
    if (ilikeitLink) ilikeitLink.remove();

    function removeLoginBox() {
        const el = document.getElementById('login-guide-box');
        if (el) el.remove();
    }

    removeLoginBox();

    const observer = new MutationObserver(removeLoginBox);
    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('a[href="https://www.zuihuimai.com"]').forEach(el => el.remove());

    const oldSrc = "//img.ithome.com/images/110.png?x-bce-process=image/format,f_auto";
    const newSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAACoFBMVEVHcEzAlzq5gQzJmi/ar1vOo1L9143/6JrcsV7Xq1jXq1i7kzynbgDjyZL//9iyfQ/EkRrZqE63hBi1fhO1fAnGjR/AiBPvw3Twyn7/8s/86cLz3rXZqUnKlTP//9mygB3CjCPqulvNnzb56MPmxH3x3rmxhBb2//zq7uPe7/fx8+X///n///3////Rz66fk1z4///LmCzo9ezq///w+ezwx4XUpEcoR1pTX1lcZlHH1cfU4tQwOkSpqHe0uJKrp3s5XHBmd2ZZb2rQy6+1tpSllnStmWnYpmzqry/Xq0O+iBT/ylT7xk2zeQDNkhC8gwfkpzPyuEDVmSvXnCzTliKydgq9iRnUlhzzuDjqszfLmxzNmSnIlBbdrTL/ykXXojbDgwfDhBDzxFLMkBXMmCj/ylD/11b/zEfjtkbZwlTgv1S2lDLNliXdqyzfqjP0yEHvzV7gxGTy2Wn62WCBgTuMgUXar07QzILlz1Dw0k27mkzmzEhwd2ctPToxQh9nYCh9ezOMeR7swkrpxWStolnhxmCUkFTar0zMxYB4bhDPt0smPEAhNzlSa3u0pThYRyQqPUQ4RzAiNDPBnlGCiXl6dlMAMUwcNk9makAqWnV0bj4kNzyHjZJAWXk/Phi6nXmcg0fo1IvbvoY+SDAaM0QQLUp+bzIuWHgkPUdnf5JndYLnWSnGqHfbok//rlP+uFL5rkz21Jv50JgAKUkTLTVmZklBSiApRmYwS2SxFwCxEQDSaTatJwDCQQD9vWrDsn3uhi6rmW3djUjXxI//36f/xpP/vY9LYn30NhLQcSjLXiXqXiyuIwD/Rh//Yj3/YzyrFwCyAQDMCADMFwDHAgCvDwC2GAD/xmT/sVHujivptFbJpnX/2pr/vZb/zKTwzJYBtmXIAAAAR3RSTlMAOIulJCQTJFlZc1mlOBPL54uly8vz86XLExMTy/MT5+eL5xMTE+c4WVkkEyQTWcsk5zg4EzjL8/PzpXPz88vz5+fnc+fz88ipOhEAAAEYSURBVBjTY2DAC7R1dNFEDKztbO1drNSRxYwct65xd7891VIDIWbstO3I7tWnT92ZZaEJEzNx2HL40M4TZ6+dvD/bXAsq6Lx5x9E9F69cunzh7vFpehAxU7fl24/t3XXu/NUz9+bO1FcBC5pNXrn04L4D627cvL5oem+VIkhM1bB9yorF+9duWH9r4YyemjIFaaCgslpTx8Qlq1w3bpo/p7uuPENeEigop5Tb2jZpwrxlC/ptaksyY2VA2qVkE3KaWxo6+7oa60uzovwFwRaJhybmFRRVVFcWF2bH+PKzgQX5JMKSU5LS8tNT46P9BNihjuf1DAwKjoyLCA8J8GCG+51bSFjUy8dbTISHiRE5nFg5uThYGEgGAFHkYdiP2lmnAAAAAElFTkSuQmCC";

    // 替换老的图片（暗色模式还有白底）
    document.querySelectorAll(`img[src="${oldSrc}"]`).forEach(img => {
        img.src = newSrc;
    });

    const observer2 = new MutationObserver(() => {
        document.querySelectorAll(`img[src="${oldSrc}"]`).forEach(img => {
            img.src = newSrc;
        });
    });

    observer2.observe(document.body, { childList: true, subtree: true });

})();