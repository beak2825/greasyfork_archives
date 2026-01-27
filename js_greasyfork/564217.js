// ==UserScript==
// @name         dlsiteのまとめ買い対象作品を非表示に
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  DLsiteのサークルプロフィールページで「まとめ買い対象作品」セクション（見出し・バナー・作品リスト）を完全に非表示にします。
// @author       You
// @match        https://www.dlsite.com/*/circle/profile/*
// @match        https://www.dlsite.com/*/maker/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlsite.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/564217/dlsite%E3%81%AE%E3%81%BE%E3%81%A8%E3%82%81%E8%B2%B7%E3%81%84%E5%AF%BE%E8%B1%A1%E4%BD%9C%E5%93%81%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/564217/dlsite%E3%81%AE%E3%81%BE%E3%81%A8%E3%82%81%E8%B2%B7%E3%81%84%E5%AF%BE%E8%B1%A1%E4%BD%9C%E5%93%81%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideBulkBuySection() {
        // 全ての小見出しを取得
        const headings = document.querySelectorAll('h3.work_subheading');

        headings.forEach(h3 => {
            // 見出しのテキストに「まとめ買い」が含まれているか確認
            if (h3.textContent.includes('まとめ買い対象作品')) {

                // 1. 見出し自体を非表示
                h3.style.display = 'none';

                // 2. 見出しの後ろに続く要素を順番にチェックして非表示にする
                // (次の見出し「販売作品」などが来るまで、または兄弟要素がなくなるまで続ける)
                let nextElement = h3.nextElementSibling;

                while (nextElement) {
                    // もし次の要素が「別の見出し(h3)」だったら、そこで非表示処理を終了する
                    if (nextElement.tagName === 'H3' && nextElement.classList.contains('work_subheading')) {
                        break;
                    }

                    // バナーや作品リストなどを非表示にする
                    nextElement.style.display = 'none';

                    // さらに次の要素へ
                    nextElement = nextElement.nextElementSibling;
                }
            }
        });
    }

    // ページ読み込み時に実行
    hideBulkBuySection();

    // 動的な読み込みに対応するための監視設定
    const observer = new MutationObserver(function(mutations) {
        hideBulkBuySection();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();