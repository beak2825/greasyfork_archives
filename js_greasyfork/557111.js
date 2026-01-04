// ==UserScript==
// @name        あいもげ添付ファイル保存ちゃん
// @namespace   Violentmonkey Scripts
// @version     1.3
// @description 添付ファイルの右に保存ボタンを追加
// @match       https://nijiurachan.net/pc/index.php*
// @match       https://nijiurachan.net/pc/thread.php?id=*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557111/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E6%B7%BB%E4%BB%98%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E4%BF%9D%E5%AD%98%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557111/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E6%B7%BB%E4%BB%98%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E4%BF%9D%E5%AD%98%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const attachDLButton = (a) => {
        if (a.dataset.dlButtonAdded) return;
        a.dataset.dlButtonAdded = "true";

        // ボタンのスタイル
        const dlBtn = document.createElement("button");
        dlBtn.textContent = "保存";
        dlBtn.style.marginLeft = "4px";
        dlBtn.style.borderRadius = "4px";
        dlBtn.style.cursor = "pointer";

        // ボタンクリック時の処理
        dlBtn.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();

            // 保存するファイルのURLの取得
            const url = new URL(a.href, location.origin).href;
            const filename = url.split("/").pop().split("?")[0];

            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
        });

        // <a> の次に来る <br> を探す
        let next = a.nextSibling;
        while (next && !(next.tagName && next.tagName.toLowerCase() === "br")) {
            next = next.nextSibling;
        }

        if (next) {
            // <br> の前にボタンを追加
            next.parentNode.insertBefore(dlBtn, next);
        } else {
            // <br> がなければ <a> の後ろにボタンを追加
            a.insertAdjacentElement("afterend", dlBtn);
        }
    };

    const processLinks = () => {
        // あいもげにアップロードされたファイルのみを対象とする
        document.querySelectorAll("a[href^='/uploads/']").forEach(a => {
            // 子要素を持たない <a> タグを対象とする
            if (a.children.length === 0) attachDLButton(a);
        });
    };

    // 実行
    processLinks();

    // 動的に追加されるものに対応する
    new MutationObserver(processLinks).observe(document.body, {
        childList: true,
        subtree: true
    });
})();