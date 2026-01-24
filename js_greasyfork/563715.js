// ==UserScript==
// @name         Zhihu Emoji Replacer
// @name:zh-CN   知乎表情替换 恢复旧版惊喜嘲讽表情
// @namespace    https://github.com/yxzlwz/browser_scripts
// @description  恢复知乎旧版本惊喜表情。作者：知乎用户momo；原帖地址：https://zhuanlan.zhihu.com/p/1997308999595483524
// @match        https://*.zhihu.com/*
// @grant        none
// @version      1.0.0
// @downloadURL https://update.greasyfork.org/scripts/563715/Zhihu%20Emoji%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/563715/Zhihu%20Emoji%20Replacer.meta.js
// ==/UserScript==

/*
The code comes from Zhihu user: https://zhuanlan.zhihu.com/p/1997308999595483524.
*/

(function () {
    'use strict';

    const OLD_URL = 'https://pic1.zhimg.com/v2-5c9b7521eb16507c9d2f747f3a32a813.png';
    const NEW_URL = 'https://pic2.zhimg.com/v2-3846906ea3ded1fabbf1a98c891527fb.png';

    function replaceImages(root = document) {
        // Replace <img src="">
        const imgs = root.querySelectorAll(`img[src="${OLD_URL}"]`);
        imgs.forEach(img => {
            img.src = NEW_URL;
        });

        // Replace srcset (Zhihu often uses this)
        const srcsetImgs = root.querySelectorAll('img[srcset]');
        srcsetImgs.forEach(img => {
            if (img.srcset.includes(OLD_URL)) {
                img.srcset = img.srcset.replaceAll(OLD_URL, NEW_URL);
            }
        });

        // Replace background-image URLs
        const elements = root.querySelectorAll('*');
        elements.forEach(el => {
            const bg = getComputedStyle(el).backgroundImage;
            if (bg && bg.includes(OLD_URL)) {
                el.style.backgroundImage = bg.replaceAll(OLD_URL, NEW_URL);
            }
        });
    }

    // Initial run
    replaceImages();

    // Observe dynamically loaded content
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceImages(node);
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();