// ==UserScript==
// @name         WowDB家宅本地化
// @namespace    https://greasyfork.org/zh-CN/users/1502715
// @version      1.7
// @description  为WowDB的家宅中心提供基于游戏内标准译名的简体中文本地化替换
// @author       电视卫士
// @license      MIT
// @match        https://housing.wowdb.com/*
// @exclude      https://housing.wowdb.com/embed/*
// @exclude      https://housing.wowdb.com/changelog/*
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/SGSwdzgr/wowdb-localization@98bd48a9b99f49865c664b16c49efc2699d3a3eb/dict.js
// @downloadURL https://update.greasyfork.org/scripts/551563/WowDB%E5%AE%B6%E5%AE%85%E6%9C%AC%E5%9C%B0%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/551563/WowDB%E5%AE%B6%E5%AE%85%E6%9C%AC%E5%9C%B0%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function localizeText(node) {
        if (!window.WowDBDict) return;
        if (node.nodeType === 3) {
            let text = node.nodeValue;
            for (const [en, zh] of Object.entries(window.WowDBDict)) {
                text = text.replace(new RegExp("\\b" + en + "\\b", "g"), zh);
            }
            node.nodeValue = text;
        } else {
            node.childNodes.forEach(localizeText);
        }
    }

    function runLocalization() {
        localizeText(document.body);
    }

    const observer = new MutationObserver(() => runLocalization());
    observer.observe(document.body, { childList: true, subtree: true });
    runLocalization();
})();
