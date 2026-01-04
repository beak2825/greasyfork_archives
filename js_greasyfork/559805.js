// ==UserScript==
// @name         哔哩哔哩隐藏稿件退回信息
// @namespace    https://github.com/girl-dream
// @version      1.0.0
// @description  自动删除class为.bpx-player-dm-delivery-wrap的标签
// @author       girl-dream
// @license      The Unlicense
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559805/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%9A%90%E8%97%8F%E7%A8%BF%E4%BB%B6%E9%80%80%E5%9B%9E%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/559805/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%9A%90%E8%97%8F%E7%A8%BF%E4%BB%B6%E9%80%80%E5%9B%9E%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
 
(function () {
    'use strict'
    if (document.querySelector('.rec-list').children.length == 0) {
        document.querySelector('video').addEventListener('loadedmetadata', () => {
            let timer = setInterval(() => {
                const element = document.querySelector('.bpx-player-dm-delivery-wrap')
                if (element) {
                    clearInterval(timer)
                    element.remove()
                }
            }, 500)
        })
    }
})();
