// ==UserScript==
// @name         三菱UFJ銀行 ご契約番号自動入力（最終版）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  三菱UFJ銀行のログインページでご契約番号を自動入力し、複数のイベントを発生させます。
// @author       Your Name
// @license MIT
// @match        https://directg.s.bk.mufg.jp/APL/LGP_P_01/PU/LG_0001/LG_0001_PC01
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548680/%E4%B8%89%E8%8F%B1UFJ%E9%8A%80%E8%A1%8C%20%E3%81%94%E5%A5%91%E7%B4%84%E7%95%AA%E5%8F%B7%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B%EF%BC%88%E6%9C%80%E7%B5%82%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548680/%E4%B8%89%E8%8F%B1UFJ%E9%8A%80%E8%A1%8C%20%E3%81%94%E5%A5%91%E7%B4%84%E7%95%AA%E5%8F%B7%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B%EF%BC%88%E6%9C%80%E7%B5%82%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const myContractNumber = 'この文章を消してここに10桁の契約番号を入力';

    // ページ読み込み完了後、少し待ってから実行
    window.addEventListener('load', function() {
        setTimeout(function() {
            const contractField = document.getElementById('tx-contract-number');
            if (contractField) {
                // 値をセットする
                contractField.value = myContractNumber;

                // 入力イベントを発生させる (入力内容が変更されたことを通知)
                contractField.dispatchEvent(new Event('input', { bubbles: true }));

                // キーボードの入力をシミュレートするイベントを発生させる
                contractField.dispatchEvent(new Event('keyup', { bubbles: true }));

                console.log('ご契約番号を自動入力しました。');
            } else {
                console.log('入力欄が見つかりませんでした。');
            }
        }, 500); // 遅延時間：500ミリ秒 (0.5秒)
    });
})();