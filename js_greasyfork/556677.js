// ==UserScript==
// @name         哔哩哔哩个性字幕
// @version      1.0.0
// @description  设置哔哩哔哩个性字幕
// @author       dianclar
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @license      GPL
// @grant        none
// @namespace https://greasyfork.org/users/1538433
// @downloadURL https://update.greasyfork.org/scripts/556677/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%AA%E6%80%A7%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/556677/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%AA%E6%80%A7%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //可以设置颜色
    const color = 'white'
    //可以设置粗细
    const fontWeight = '900'
    //可以设置大小
    const fontSize = '16px'

    const mo = new MutationObserver((molist) => {
        molist.forEach((moi) => {
            if (moi.target.className === 'bili-subtitle-x-subtitle-panel-major-group') {
                mo.disconnect()
                document.querySelectorAll('.bili-subtitle-x-subtitle-panel-major-group').forEach(item => {
                    item.style.color = color
                    item.style.fontWeight = fontWeight
                    item.style.fontSize = fontSize
                })
            }
        })
    })
    mo.observe(document.documentElement, { childList: true, subtree: true });
})();