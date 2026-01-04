// ==UserScript==
// @name         国家药品安全专业技术人员培训网-评估自动选A考试去除切屏限制
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 国家药品安全专业技术人员培训网 的辅助学习，脚本功能如下：评估自动选A，考试去除3次切屏限制
// @author       脚本喵
// @match        https://www.nmpaied.com/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550917/%E5%9B%BD%E5%AE%B6%E8%8D%AF%E5%93%81%E5%AE%89%E5%85%A8%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%BD%91-%E8%AF%84%E4%BC%B0%E8%87%AA%E5%8A%A8%E9%80%89A%E8%80%83%E8%AF%95%E5%8E%BB%E9%99%A4%E5%88%87%E5%B1%8F%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/550917/%E5%9B%BD%E5%AE%B6%E8%8D%AF%E5%93%81%E5%AE%89%E5%85%A8%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%BD%91-%E8%AF%84%E4%BC%B0%E8%87%AA%E5%8A%A8%E9%80%89A%E8%80%83%E8%AF%95%E5%8E%BB%E9%99%A4%E5%88%87%E5%B1%8F%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let oldadd = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function (...args) {
        if (window.onblur !== null) {
            window.onblur = null;
        }
        if (args.length !== 0 && args[0] === 'visibilitychange') {
            console.log('劫持visibilitychange成功，奥利给！')
            return;
        }
        return oldadd.call(this, ...args)
    }

    if (location.href.indexOf("assess_list") != -1) {
        setTimeout(function () {
            pinggu()
        }, 1000)
    }

    async function pinggu() {
        let questionNums = document.querySelectorAll("dl").length
        for (let i = 0; i < questionNums; i++) {
            let question = document.querySelectorAll("dl")[i]
            question.querySelectorAll("label")[0].click()
            await delay(500);
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
