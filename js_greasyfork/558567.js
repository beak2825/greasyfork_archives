// ==UserScript==
// @name         南方教师在线答案标记
// @namespace    http://southteacher.goodbye.xxx/
// @license      WTFPL
// @version      2025-12-11
// @description  南方教师在线刷课页面自动标记答案的选项。
// @author       underbed
// @match        https://ycourse.ttcn.cn/study/studyWorkVideo*
// @match        https://ycourse.ttcn.cn/study/RateLearning*
// @match        https://ycourse.ttcn.cn/study/studyIndex*
// @match        https://ycourse.ttcn.cn/study/home*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ttcn.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558567/%E5%8D%97%E6%96%B9%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%AD%94%E6%A1%88%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/558567/%E5%8D%97%E6%96%B9%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%AD%94%E6%A1%88%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (url.includes("video-videoinfo/getVideoInfo")) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    const res = JSON.parse(this.responseText);
                    if (res && res.data && res.data.videoQas) {
                        res.data.videoQas.forEach((qas) => {
                            if (qas && qas.optionList) {
                                qas.optionList.forEach((option) => {
                                    if (option.isAnswer == "Y") {
                                        option.optionContent += " (答案)";
                                    }
                                });
                            }
                        });
                    }
                    console.log("挟持题目数据", res);
                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });
                    this.responseText = JSON.stringify(res);
                }
            });
        }
        originOpen.apply(this, arguments);
    };
})();
