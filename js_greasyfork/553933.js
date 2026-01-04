// ==UserScript==
// @name                Remove CSDN
// @name:zh-CN          移除CSDN
// @description         Remove CSDN from Google Search.
// @description:zh-CN   移除谷歌搜索中的CSDN。
// @namespace           https://github.com/yxzlwz/browser_scripts
// @author              yxzlwz
// @match               *://*.google.com/*
// @match               *://*.google.com.hk/*
// @run-at              document-end
// @version             1.0.0
// @downloadURL https://update.greasyfork.org/scripts/553933/Remove%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/553933/Remove%20CSDN.meta.js
// ==/UserScript==

(function () {
    let interval,
        times = 0;
    function main() {
        const list = window.document.getElementsByTagName("a");
        for (let i = 0; i < list.length; i++) {
            const a = list[i];
            if (a.href.startsWith("https://blog.csdn.net/")) {
                let parent = a;
                for (let j = 0; j < 8; j++) {
                    parent = parent.parentElement;
                }
                if (parent) {
                    parent.style.display = "none";
                }
            }
        }
        times++;
        if (times > 15) {
            clearInterval(interval);
        }
    }
    main();
    interval = setInterval(main, 200);
})();
