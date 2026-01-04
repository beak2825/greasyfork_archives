// ==UserScript==
// @name        磁力/电驴/迅雷链接复制工具
// @namespace    https://leochan.me
// @version      v1.1.0
// @description  复制网页里所有磁力/电驴/迅雷链接
// @author       Leo
// @match        *://*/*
// @license      GPLv2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @require      https://update.greasyfork.org/scripts/470018/1214590/%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E7%AE%80%E5%8D%95%E7%9A%84%E6%8F%90%E9%86%92%E8%83%BD%E5%8A%9B.js
// @require      https://update.greasyfork.org/scripts/549000/1658058/%E7%BD%91%E9%A1%B5%E9%87%8C%E9%9D%A2%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549049/%E7%A3%81%E5%8A%9B%E7%94%B5%E9%A9%B4%E8%BF%85%E9%9B%B7%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549049/%E7%A3%81%E5%8A%9B%E7%94%B5%E9%A9%B4%E8%BF%85%E9%9B%B7%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractMagnetsFromWebPage(html) {
        const magnetRegex = /magnet:\?[^\s"'<>]+/gi;
        const magnets = html.match(magnetRegex) || [];
        const xtValues = [];
        magnets.forEach(magnet => {
            const xtRegex = /xt=(urn:btih:[a-fA-F0-9]{40})/i;
            const match = magnet.match(xtRegex);
            if (match && match[1] && !xtValues.includes("magnet:?xt=" + match[1])) {
                xtValues.push("magnet:?xt=" + match[1]);
            }
        });
        return xtValues;
    }

    function extractED2KFromHTML(html) {
        const ed2kRegex = /ed2k:\/\/\|file\|[^|]+\|\d+\|[A-Fa-f0-9]{32}\|\//g;
        const matches = html.match(ed2kRegex);
        if(matches && matches.length > 0){
            return [...new Set(matches)];
        }
        return [];
    }

    function extractThunderFromHTML(html) {
        const thunderRegex = /thunder:\/\/[A-Za-z0-9+/=]+/g;
        const matches = html.match(thunderRegex);
        if(matches && matches.length > 0){
            return [...new Set(matches)];
        }
        return [];
    }

    function addCopyButton(xtValues, appendData) {
        appendData = appendData || false;
        const clickBtn = document.createElement('a');
        clickBtn.style.cssText = "position:fixed;z-index:99999999;right:15px;color:#fff;padding:10px 15px;font-size:12px;border-radius:5px;overflow:hidden;cursor:pointer;text-decoration:none;" + (appendData ? "background-image:linear-gradient(to right,#b8cbb8 0%,#b8cbb8 0%,#b465da 0%,#cf6cc9 33%,#ee609c 66%,#ee609c 100%);bottom:20%;" : "background-image:linear-gradient(to right,#4facfe 0%,#00f2fe 100%);bottom:30%;");
        clickBtn.textContent = appendData ? "追加所有磁力/电驴/迅雷链接" : "复制所有磁力/电驴/迅雷链接";
        clickBtn.addEventListener('click', async() => {
            let oldXtValues = await navigator.clipboard.readText();
            if(appendData && oldXtValues.length > 0){
                xtValues = xtValues.concat(oldXtValues.split('\n'));
            }
            webPageCopyToClipboard(xtValues.join('\n')).then(() => {
                webPageShowMessage(appendData ? "追加成功了" : "复制成功了")
            });
        });
        document.body.appendChild(clickBtn);
    }

    function addCopyButtons() {
        const html = document.documentElement.outerHTML;
        let xtValues = extractMagnetsFromWebPage(html);
        console.log("xt", xtValues, extractED2KFromHTML(html), extractThunderFromHTML(html));
        xtValues = xtValues.concat(extractED2KFromHTML(html));
        xtValues = xtValues.concat(extractThunderFromHTML(html));
        console.log("ee", xtValues);
        if(xtValues.length === 0){
            return;
        }
        addCopyButton(xtValues);
        addCopyButton(xtValues, true);
    }

    addCopyButtons();
})();