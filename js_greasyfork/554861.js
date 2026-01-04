// ==UserScript==
// @name        BetterTable
// @author      Nozom.u
// @description mec-itutorのテーブル表示を修正
// @include     *://mec-itutor.jp/rpv/home/check.aspx*
// @include     *://mec-itutor.jp/rpv/home/analysis_check.aspx*
// @include     *://mec-itutor.jp/rpv/home/knowledge.aspx*
// @include     *://mec-itutor.jp/rpv/home/task.aspx*
// @include     *://mec-itutor.jp/rpv/home/arbitrary_learning_check.aspx*
// @version     2.0.1
// @namespace https://greasyfork.org/users/1534273
// @downloadURL https://update.greasyfork.org/scripts/554861/BetterTable.user.js
// @updateURL https://update.greasyfork.org/scripts/554861/BetterTable.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    /* ページ全体のレイアウト最適化 */
    nav > .container {
        margin-left: 5%;
    }
    div.main-contents > div.container {
        margin: 0;
        width: auto;
        padding: 0 5%;
    }
    /* ヘッダとタイトル */
    div.ctrl-wrap {
        margin: 0;
    }
    /* メイン要素 */
    #main-gadget-area {
    width: 100%;
    }
    #main-gadget-area > div.list-group {
        width: 80%;
        margin-right: 20%;
        margin-left: auto;
    }
    /* 右のリンク集(全体) */
    #right-gadget-area {
        width: 35%;
    }
    /* 右のリンク集(上) */
    #ctl00_cplPageContent_cntAsideRight {
        margin-bottom: -1px;
    }
    /* 右のリンク集(下) */
    #ctl00_cplPageContent_cntAsideRightBottom {
        margin-bottom: 0;
    }
    /* 枠線の削除 */
    #local-menu-wrap-right > div > a {
        border: none;
    }
    /* テーブルとボタン */
    div.ctrl-wrap > div.text-right {
    text-align: left;
    margin: 0 0 30vh 0;
    }

    /* ==== テーブルデザイン ==== */
    /* カラム名改行させない */
    th {
    white-space: nowrap;
    height: 3em;
    }
    /* <a>を含む<td> */
    td:has(a) {
    width: fit-content;
    white-space: nowrap;
    max-width: 30em;
    overflow-x: auto;
    }
    /* <a>を含まない<td> */
    td:not(:has(a)) {
    white-space: nowrap;
    max-width: 25em;
    overflow-x: auto;
    }
    /* スクロールバー非表示 */
    td::-webkit-scrollbar{
    display:none;
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('table > tbody').forEach(tbody => {
    tbody.querySelectorAll('br').forEach(br => {
      br.replaceWith(','); // <br> → カンマ
    });
  });

  const table = document.querySelector('table');
  if (table) {
    const themeIndex = 3; // 出題テーマ列
    const diseaseIndex = 5; // 疾患名列

    table.querySelectorAll('tbody tr').forEach(tr => {
      const historyBtn = Array.from(tr.querySelectorAll('a, button')).find(el =>
        el.textContent.trim().includes('履歴')
      );
      if (!historyBtn) return;

      // 未演習のみ処理
      if (historyBtn.hasAttribute('disabled')) {
        // 出題テーマ
        const tdTheme = tr.children[themeIndex];
        if (tdTheme) {
          const a = tdTheme.querySelector('a');
          if (a) {
            a.dataset.originalText = a.textContent.trim();
//          a.textContent = '？？？？？';
            a.style.textDecoration = 'none';
            a.style.cursor = 'pointer';
            a.style.textDecoration = 'underline';
          }
        }

        // 疾患名（リンクでない場合も）
        const tdDisease = tr.children[diseaseIndex];
        if (tdDisease) {
          tdDisease.dataset.originalText = tdDisease.textContent.trim();
//        tdDisease.textContent = '？？？？？';
        }
      }
    });
  }
})();