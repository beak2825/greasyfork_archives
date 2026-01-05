// ==UserScript==
// @name    InoReader Full Feed
// @description    Read the full article in Inoreader. / Inoreaderで記事の全文を表示します。
// @description:en    Read the full article in Inoreader.
// @description:ja    Inoreaderで記事の全文を表示します。
// @namespace    https://userscripts.org/scripts/show/172238
// @homepage    https://greasyfork.org/scripts/897-inoreader-full-feed
// @match    https://www.inoreader.com/*
// @match    https://jp.inoreader.com/*
// @match    https://us.inoreader.com/*
// @exclude    *inoreader.com/stream*
// @exclude    *inoreader.com/m/*
// @connect    *
// @grant    GM_openInTab
// @grant    GM_registerMenuCommand
// @grant    GM_xmlhttpRequest
// @noframes
// @version    1.12
// @downloadURL https://update.greasyfork.org/scripts/897/InoReader%20Full%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/897/InoReader%20Full%20Feed.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const version = 1.1;

  // == [CSS] =====================================
  const CSS = `
#subscriptions_articles {
  .article_content {
    a {
      color: #0069d6;
      &:hover {
        color: #0064cd;
        text-decoration: underline;
      }
      &:visited {
        color: #0069d6;
      }
    }
    .clear {
      font-size: inherit !important;
      height: auto !important;
      width: auto !important;
    }
  }
  .article_title {
    img {
      border: none;
      vertical-align: text-top;
    }
    span a {
      margin: 0 3px;
    }
  }
}
.irff_loading {
  border-color: limegreen !important;
}
.irff_loaded * {
  position: static !important;
}
.irff_opened {
  border-color: gold !important;
}
.irff_ap_on {
  color: #009900;
}
.irff_ap_off {
  color: #990000;
}
.irff_pager {
  margin: 3em 0;
}
.irff_pager hr {
  margin-bottom: 5px;
}
.irff_pager_differenthost {
  margin-left: 2em;
  font-weight: bold;
}
.irff_entry_url a {
  padding-left: 12px;
}
.irff_hidden {
  display: none;
}
#irff_message {
  background-color: #ffeeaa;
  box-shadow: 1px 1px 2px #cccccc;
  color: black;
  padding: 4px 8px;
  position: fixed;
  right: 250px;
  top: 4px;
  z-index: 90900;
}
.irff_warning {
  background-color: #ff9999 !important;
}
.irff_checked {
  margin-right: 4px;
}
.irff_checked_icon {
  border-radius: 3px;
  box-shadow: 1px 1px 2px #cccccc;
  color: white;
  cursor: pointer;
  font-size: 0.8em;
  margin-left: 0.5em;
  padding: 0 4px;
  position: relative;
  text-decoration: none;
  top: 0.3em;
  vertical-align: top;
  &:active {
    box-shadow: none;
  }
}
.irff_checked_icon_info {
  background: #ffcc00;
  background: linear-gradient(top, #ffcc00, #ff9900);
  border: 1px solid #ee8800;
  &:hover {
    background: #ffee00;
    background: linear-gradient(top, #ffee00, #ffbb00);
    border: 1px solid #eeaa00;
  }
}
.irff_checked_icon_noinfo {
  background: #cccccc;
  background: linear-gradient(top, #cccccc, #999999);
  border: 1px solid #888888;
  &:hover {
    background: #eeeeee;
    background: linear-gradient(top, #eeeeee, #bbbbbb);
    border: 1px solid #aaaaaa;
  }
}
.irff_checked_icon_next {
  background: #77cc77;
  background: linear-gradient(top, #77cc77, #55aa55);
  border: 1px solid #449944;
  &:hover {
    background: #99ee99;
    background: linear-gradient(top, #99ee99, #77cc77);
    border: 1px solid #66bb66;
  }
}
.irff_checked_icon_nonext {
  background: #bbeebb;
  background: linear-gradient(top, #bbeebb, #99cc99);
  border: 1px solid #88bb88;
  &:hover {
    background: #ddffdd;
    background: linear-gradient(top, #ddffdd, #bbeebb);
    border: 1px solid #aaddaa;
  }
}

.irff_checked_icon_as_next {
  background: #7777cc;
  background: linear-gradient(top, #7777cc, #5555aa);
  border: 1px solid #444499;
  &:hover {
    background: #9999ee;
    background: linear-gradient(top, #9999ee, #7777cc);
    border: 1px solid #6666bb;
  }
}
.irff_checked_icon_as_nonext {
  background: #bbbbee;
  background: linear-gradient(top, #bbbbee, #9999cc);
  border: 1px solid #8888bb;
  &:hover {
    background: #ddddff;
    background: linear-gradient(top, #ddddff, #bbbbee);
    border: 1px solid #aaaadd;
  }
}
.irff_socialicon {
  font-size: 12px;
  vertical-align: middle;
}
#irff_s {
  background-color: var(--bs-body-bg, white);
  border-radius: 4px;
  border: 1px solid #999999;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  color: var(--bs-body-color, black);
  font-size: 13px;
  left: 8px;
  line-height: normal;
  min-width: 20em;
  padding: 0;
  position: fixed;
  top: 8px;
  user-select: none;
  z-index: 90000;
  button {
    background-color: var(--primary-color, #3d6399);
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 90%;
  }
  button, input {
    line-height: 1.5em;
  }
  input[type='checkbox'] {
    opacity: 1 !important;
    position: static !important;
  }
  select {
    font-size: 100%;
    padding: 1px 2px;
  }
  fieldset {
    background: none !important;
    border: 1px solid #999999;
    margin: 4px 2px;
    padding: 0.35em 0.75em 0.625em;
  }
  fieldset > fieldset {
    margin: 0;
  }
  legend {
    font-size: unset;
    float: unset;
    line-height: normal;
    margin-bottom: unset;
    padding: 0 2px;
    width: unset;
  }
  fieldset,
  input[type='number'],
  input[type='text'],
  textarea,
  select {
    color: var(--bs-body-color, black);
    background-color: var(--bs-body-bg, white);
  }
  &:has(.irff_s-hide) {
    opacity: 0.8;
  }
  @media screen and (min-width: 800px) {
    left: 72px;
  }
}
#irff_s input[type='text'],
#irff_s textarea,
input[type='number'] {
  border-style: solid;
  border-width: 1px;
  padding: 0 2px;
}
#irff_s-header {
  background-color: #666666;
  padding: 0 4px 8px 4px;
}
.theme_aqua #irff_s-header {
  background-color: #134b91;
}
.theme_light #irff_s-header {
  background-color: #e5e8eb;
}
.theme_sepia #irff_s-header {
  background-color: #46423b;
}
.theme_dark #irff_s-header {
  background-color: #000000;
}
#irff_s-header_title {
  position: relative;
  top: 3px;
  a {
    color: white;
    font-weight: bold;
    text-decoration: none;
  }
}
.theme_light #irff_s-header_title a {
  color: black;
}
#irff_s-tab {
  margin-top: 1em;
  padding: 0 0.5em;
  span {
    background-color: #e9e9e9;
    background-image: linear-gradient(#f9f9f9, #e9e9e9);
    border-radius: 4px 4px 0 0;
    border: 1px solid #999999;
    cursor: pointer;
    padding: 3px 16px;
    &:hover {
      background-color: #f3f3f3;
    }
  }
  .select,
  .select:hover {
    background-color: #ffffff;
    background-image: none;
    border-bottom-color: #ffffff;
  }
}
.theme_dark #irff_s-tab {
  span {
    background-color: #16191C;
    background-image: linear-gradient(#26292C, #16191C);
  }
  .select,
  .select:hover {
    background-color: #16191C;
    background-image: none;
    border-bottom-color: #16191C;
  }
}
.irff_s-title {
  color: #224488;
  cursor: pointer;
  float: left;
  font-size: 100%;
  margin: 0;
  padding: 4px 8px;
  text-decoration: underline;
}
#irff_s-list {
  border-top: 1px solid #999999;
  margin: 3px 0 0 0;
  min-width: 590px;
  padding: 8px 4px 4px 4px;
  input[type='checkbox'],
  input[type='radio'] {
    margin: 5px 4px;
    vertical-align: middle;
  }
}
#irff_s-footer {
  padding: 4px;
  text-align: right;
  button {
    margin: 0 4px;
    width: 8em;
  }
}
#irff_s-footer_button {
  margin: 2px;
}
#irff_s-ok {
  padding: 1px 2em;
}
.irff_s-addbutton {
  margin-left: 8px;
  width: 6em;
}
.irff_s-hide {
  display: none;
}
.irff_s-r + .irff_s-r {
  margin-left: 1.5em;
}
.irff_s-f_column2 {
  float: left;
  width: 271px;
}
.irff_s-clearfix:after {
  clear: both;
  content: '';
  display: block;
}
.irff_s-table {
  display: table;
  width: 100%;
  & > *:not(datalist) {
    display: table-cell;
  }
}
#irff_s-etc_timeout,
#irff_s-general_apheight, 
#irff_s-general_key {
  ime-mode: disabled;
  margin-right: 1ex;
  text-align: center;
  width: 5em;
}
#irff_s-general_cantdisplay {
  margin-bottom: 0.5em;
}
#irff_s-general_notread {
  margin-bottom: 0.8em;
  width: 536px;
}
#irff_s-autoload_navi,
#irff_s-siteinfo_navi {
  margin: 0.5em 0 1em 1em;
}
.irff_s-navi {
  span {
    background-color: #f6f6f6;
    background-image: linear-gradient(#ffffff, #f0f0f0);
    border-color: #cfcfcf #c9c9c9 #c3c3c3;
    border-style: solid;
    border-width: 2px 1px;
    padding: 0.25em 0.75em;
  }
  span:hover {
    border-bottom-color: var(--primary-color, #ffe0a2);
  }
  span:first-of-type,
  #irff_s-siteinfo_navi > .irff_hidden + span:not(.irff_hidden) {
    border-radius: 4px 0 0 4px;
    border-width: 2px 1px 2px 2px;
  }
  span:last-of-type,
  #irff_s-siteinfo_navi > .irff_hidden + span:not(.irff_hidden) + span {
    border-radius: 0 4px 4px 0;
    border-width: 2px 2px 2px 1px;
  }
  .select {
    background-color: white;
    background-image: linear-gradient(#f6f6f6, #ffffff);
    border-color: #c3c3c3 #c9c9c9 var(--primary-color, #ffcc66);
  }
}
.theme_dark .irff_s-navi {
  span {
    background-color: #16191C;
    background-image: linear-gradient(#26292C, #16191C);
    border-color: #676b70;
  }
  .select {
    background-color: #16191C;
    background-image: linear-gradient(#26292C, #16191C);
    border-color: #676b70 #676b70 var(--primary-color, #ffcc66);
  }
}
.irff_s-siteinfo_navi,
.irff_s-autoload_navi {
  color: #224488;
  cursor: pointer;
  padding: 0 0.5em;
}
.theme_dark .irff_s-siteinfo_navi,
.theme_dark .irff_s-autoload_navi {
  color: var(--bs-body-color, white);
}
#irff_s-autoload,
#irff_s-siteinfo {
  fieldset {
    display: none;
    &.select {
      display: block;
    }
  }
}
#irff_s-siteinfo textarea {
  height: 8em;
  min-height: 4em;
  min-width: 560px;
  width: 560px;
}
.irff_s-siteinfo_form > div {
  margin-bottom: 4px;
}
.irff_s-siteinfo_text {
  box-sizing: border-box;
  width: 100%;
}
#irff_s-siteinfo_uff_type_label {
  width: 18em;
}
.irff_s-addbutton_span {
  width: 6em;
}
.irff_s-siteinfo_user_label > span {
  margin-top: 4px;
}
.irff_s-siteinfo_user_label:not(.irff_s-table) > span {
  display: inline-block;
}
#irff_s-siteinfo_f_uff .irff_s-siteinfo_user_label > span,
#irff_s-siteinfo_uff_enc_span {
  width: 3.5em;
}
#irff_s-siteinfo_f_uap .irff_s-siteinfo_user_label > span,
#irff_s-siteinfo_uap_pageelement_span {
  width: 7em;
}
#irff_s-siteinfo_user_label_enc {
  margin-left: 24px;
  & > span {
    margin-right: 8px;
  }
}
#irff_s-autoload fieldset,
#irff_s-autoload input[type='radio'] {
  margin-bottom: 0.5em;
}
.irff_s-autoload_form {
  display: none;
  &.select {
    display: block;
  }
}
.irff_s-autoload_title {
  width: 100%;
}
.irff_s-autoload_list {
  height: 8em;
  margin-top: 8px;
  min-height: 4em;
  min-width: 560px;
  width: 560px;
}
#irff_s-siteinfo_disableitemlist {
  overflow: hidden;
  white-space: nowrap;
  width: 560px;
}
#irff_s-etc button {
  letter-spacing: 1px;
  margin: 0 4px;
}
.irff_siteinfourl_list fieldset {
  background-color: #fff7d7;
}
#irff_s-security input[type='text'],
#irff_s-etc input[type='text'] {
  width: 560px;
}
#irff_temp {
  background-color: gray;
  border-radius: 4px;
  border: 2px solid gray;
  left: 100px;
  position: fixed;
  top: 190px;
  visibility: hidden;
  width: 400px;
  z-index: 91000;
}
#irff_temp-bar_title {
  color: white;
  font-weight: bold;
  padding: 0 4px;
  position: relative;
  top: 3px;
}
#irff_temp-bar_button {
  position: absolute;
  right: 0;
  top: 0;
}
#irff_temp-body {
  margin-top: 9px;
}
#irff_temp-close {
  text-align: center;
  width: 100px;
}
#irff_temp-textarea {
  height: 200px;
  width: 395px;
}
.irff_hatena {
  padding: 2px 4px;
  position: relative;
  top: -2px;
  img {
    width: 16px;
    height: 16px;
  }
  span {
    padding: 0px 3px;
  }
}
.irff_hatena1 span {
  color: #ff6563 !important;
  background-color: #fff0f0 !important;
}
.irff_hatena2 span {
  color: #ff4444 !important;
  background-color: #ffeeee !important;
}
.irff_hatena3 span {
  color: #ff2222 !important;
  background-color: #ffdddd !important;
}
.irff_hatena4 span {
  color: #ff0000 !important;
  background-color: #ffcccc !important;
}
  `;

  // == [Locale] ==================================
  const LOCALE_JA = {
    t0: '全文を読み込み中..',
    t1: '全文を読み込み中  Auto Search..',
    t2: '全文を読み込み中..... 完了',
    t3: 'SITEINFOが古いか間違っているので代わりにInoreaderの機能で読み込みます',
    t4: '次のページを読み込み中..',
    t5: '次のページを読み込み中..... 完了',
    t6: '最後のページを読み込み中..... 完了',
    t7: '次のページは見つかりません',
    t8: '読み込みをブロックしました',
    t9: 'すでに全文を読み込みました',
    t10: 'SITEINFOが見つからないので新しいタブで開きました',
    t11: 'キャッシュをリセットしています..',
    t12: 'キャッシュをリセットしています..... 完了',
    t13: 'ポップアップできません',
    t14: 'エラー：サーバーからキャッシュを読み込めませんでした',
    t15: 'キャッシュをリセットしますか？',
    t16: 'キャッシュを消去しますか？',
    t17: 'エラー：JSONPはサポートしていません',
    t18: '全文読み込み',
    t19: '正規表現',
    t20: '追加',
    t21: '設定',
    t22: 'キャンセル',
    t23: 'ショートカットキー',
    t24: 'キー',
    t25: '',
    t26: 'Auto Load 切替',
    t27: 'AutoPagerize 切替',
    t28: '設定欄を表示',
    t29: 'キャッシュリセット',
    t30: 'Full Feed URL',
    t31: 'AutoPagerize URL',
    t32: 'Full Feed ユーザー SITEINFO',
    t33: 'AutoPagerize ユーザー SITEINFO',
    t34: '次のページを読み込み中  Auto Search..... 完了',
    t35: '最後のページを読み込み中  Auto Search..... 完了',
    t36: 'すべて',
    t37: 'フィードタイトル',
    t38: '記事タイトル',
    t39: '許可リスト/拒否リストに追加',
    t40: 'クリック',
    t41: '次のページを読み込む',
    t42: 'noscriptタグ内のコンテンツを表示',
    t43: '自動的に全文を読み込むアイテム',
    t44: '許可リスト',
    t45: '許可リストのみ',
    t46: 'なし',
    t47: '全文を読み込まないアイテム',
    t48: '読み込まない代わりに新しいタブで開く',
    t49: '新しいタブで開きました',
    t50: 'デバッグログをコンソールに出力',
    t51: '全文を読み込み中  Auto Search..... 完了',
    t52: 'インラインフレームを取り除く',
    t53: 'エラー：dom.storage.enabledをtrueに設定してください',
    t54: 'お待ちください',
    t55: 'ソーシャルアイコンを表示',
    t56: 'エラー：ブラウザの設定でHTTPS-Onlyモードを一時的に無効化してください',
    t57: 'その他',
    t58: 'はてなブックマーク',
    t59: '警告：次ページを継ぎ足してもよろしいですか？\n\n今のページ：',
    t60: '\n次のページ：',
    t61: '次ページを継ぎ足しません',
    t62: '次ページの継ぎ足しを許可するURL',
    t63: '次ページの継ぎ足しを禁止するURL',
    t64: 'SITEINFOがなくても全文の読み込みを試みる',
    t65: '表示を許可するインラインフレームのソースURL',
    t66: '設定をエクスポートしてクリップボードへコピーしますか？',
    t67: 'クリップボードへコピーしました',
    t68: '設定をエクスポートしました。\n以下の文字列をコピーしてください\n\n',
    t69: 'エクスポートした文字列を入力してください',
    t70: '設定をインポートしました',
    t71: 'インポートできません',
    t72: '設定をリセットしますか？',
    t73: '設定をリセットしました',
    t74: 'SITEINFOが見つからないので代わりにInoreaderの機能で読み込みます',
    t75: '全文を表示できないとき',
    t76: '拒否リスト',
    t77: '拒否リスト以外',
    t78: '設定モード',
    t79: 'シンプル',
    t80: 'アドバンス',
    t81: '秒',
    t82: 'リクエストを中断しました',
    t83: 'Inoreaderの機能で読み込む',
    t84: '新しいタブで開く',
    t85: '何もしない',
    t86: 'SITEINFOが見つからないため全文を表示できませんでした',
    t87: 'インラインフレームで表示する',
    t88: 'SITEINFOが見つからないのでインラインフレームで表示します',
    t89: '埋め込みツイートを表示する',
    t90: 'タイムアウト',
    t300: '',
    t301: '読み込んだ全文に次のページがある場合、ショートカットキーを押すかFアイコンをクリックしたときに次のページを読み込みます。',
    t302: 'サイト情報がない（Fアイコンが灰色で表示されている）ときでも全文の読み込みを試みます。&#13;&#10;サイト情報がないため、何も表示されなかったり、全文以外の部分が表示される場合があります。&#13;&#10;元記事ページの文字エンコーディングが判別できなかった場合は表示しません。',
    t303: '全文内にある埋め込みツイートを表示します。&#13;&#10;ただし、全文の配信サイトが独自の方法でツイートを埋め込んでいる場合は表示できません。',
    t304: '何らかの理由で全文が表示できないときの動作を選択できます。&#13;&#10;インラインフレームで表示する: 元記事ページをインラインフレームで表示します。（動作未確認）&#13;&#10;Inoreaderの機能で読み込む: Inoreaderが用意している機能で全文を読み込みます。&#13;&#10;新しいタブで開く: 元記事ページを新しいタブで開きます。&#13;&#10;何もしない: 全文を表示しません。',
    t305: 'ショートカットキーを押したりFアイコンをクリックしても、全文を読み込まないようにします。&#13;&#10;「アイテム名/アイテムURL/フィード名」のいずれかを正規表現で指定してください。',
    t306: '上記設定に該当するアイテムで全文を読み込もうとしたとき、全文を読み込まずに元記事ページを新しいタブで開きます。',
    t307: '全文読み込みを行うためのサイト情報が記述されているデータベースを指定します。&#13;&#10;LDRFullFeedデータベースと互換性があり、JSON形式でなければなりません。&#13;&#10;必要な場合を除き、初期値から変更する必要はありません。',
    t308: '次ページの継ぎ足し表示を行うためのサイト情報が記述されているデータベースを指定します。&#13;&#10;AutoPagerizeデータベースと互換性があり、JSON形式でなければなりません。&#13;&#10;必要な場合を除き、初期値から変更する必要はありません。',
    t309: '全文を読み込むためのサイト情報を指定できます。&#13;&#10;「Full Feed URL」設定で読み込んだサイト情報よりも優先されます。&#13;&#10;wedataへ登録する前のテストなどで使用してください。&#13;&#10;SITEINFOの詳細は下記URLを参照してください&#13;&#10;http://wedata.net/databases/LDRFullFeed/',
    t310: '次ページの継ぎ足し表示を行うためのサイト情報を指定できます。&#13;&#10;「AutoPagerize URL」設定で読み込んだサイト情報よりも優先されます。&#13;&#10;wedataへ登録する前のテストなどで使用してください。&#13;&#10;SITEINFOの詳細は下記URLを参照してください&#13;&#10;http://wedata.net/databases/AutoPagerize/',
    t311: 'アイテムのサイト情報がLDRFullFeedデータベースに複数登録されている場合、無効にするサイト情報を指定できます。&#13;&#10;全文を読み込んだ状態で設定欄を開くと、そのアイテムのサイト情報のXPathが表示されます。すべてを無効にすることはできません。',
    t312: 'フィードタイトルもしくは記事タイトルを正規表現で登録してください。&#13;&#10;アイテムのタイトルの右隣にあるFアイコンを中クリックもしくはCtrl+クリックするとフィードタイトル/記事タイトルが入力された状態で設定欄が表示されます。フィードタイトルと記事タイトルのどちらかを選択してから追加ボタンをクリックすると下のテキストエリアに追加されます。',
    t313: '自動的に全文を読み込む動作を制御できます。&#13;&#10;すべて: 一覧表示モードでアイテムを開いたり、全文表示モードでアイテムを選択したとき、すべてのアイテムで自動的に全文を読み込みます。&#13;&#10;拒否リスト以外: 拒否リストに該当しないアイテムで自動的に全文を読み込みます。&#13;&#10;許可リストのみ: 許可リストに該当するアイテムのみ自動的に全文を読み込みます。&#13;&#10;なし: 自動的には全文を読み込みません。',
    t314: '読み込んだ全文内にあるHTMLのnoscriptタグの内容を表示します。',
    t315: '読み込んだ全文内にあるインラインフレーム（iframeタグ）を削除します。',
    t316: '「インラインフレームを取り除く」設定がONの場合でも、インラインフレームのソースURL（iframeタグ内のsrc属性値）の一部を正規表現で指定することで、該当するインラインフレームは全文内に表示します。',
    t317: '「次のページを読み込む」がONの場合でも、次ページのURLの一部を正規表現で指定することで次ページの読み込みをブロックします。',
    t318: '読み込んだ全文の元記事のホスト名と、その全文内にある次ページのリンク先のホスト名が異なる場合、次ページのURLの一部を正規表現で指定することで次ページの読み込みを許可します。',
    t319: '選択したソーシャルサービスのアイコンと元記事の被登録数/被参照数をアイテムのタイトルの右端に表示します。',
    t320: '設定欄の表示を切り替えます。&#13;&#10;シンプル: 必要な項目だけ表示します。&#13;&#10;アドバンス: すべての項目を表示します。',
    t321: 'サイト情報などが記録されているキャッシュを再取得します。&#13;&#10;ショートカットキー（初期設定ではAlt+Ctrl+Shift+Zキー）からでも実行できます。&#13;&#10;サイトがリニューアルするなどして全文がうまく表示できなくなった場合や、wedataに自分で登録したサイト情報を反映させたい場合に実行してください。',
    t322: 'サイト情報などが記録されているキャッシュを破棄します。&#13;&#10;破棄したあとはページを再読み込みしてキャッシュを取得してください。&#13;&#10;サイト情報が正しいのに全文がうまく表示できなくなった場合に実行してみてください。',
    t323: '全文を読み込むときの待ち時間を設定します。初期値は15秒です。',
    t324: '「Settings Data - Export」で書き出した文字列を入力することで、Inoreader Full Feedの設定を取り込みます。',
    t325: 'Inoreader Full Feedの設定をJSON形式の文字列として書き出します。',
    t326: 'Inoreader Full Feedの設定をすべてリセットします。',
    t327: '置き換え前のURL（正規表現）と置き換え後のURLを半角スペース区切りで指定することで、読み込む全文のURLを変更できます。&#13;&#10;置き換え後の文字列をURLではなく「Link」と指定することで、アイテムの文章にリンクがある場合、リンク先URLに置き換えます。&#13;&#10;リンクが複数ある場合は最初のリンクのURLに置き換えます。&#13;&#10;リンク先URLがPunycode（日本語ドメイン）の場合、そのリンクは対象にしません。&#13;&#10;&#13;&#10;例1: 「^https?://example\\.com/(.+) https://www.example.com/$1」&#13;&#10;→「http://example.com/&&&/statuses/000」のような全文のURLを「https://www.example.com/&&&/statuses/000」に置き換えます。&#13;&#10;&#13;&#10;例2: 「^https?://twitter\\.com/ Link」&#13;&#10;→全文を読み込む前のアイテムの文章が「○○○ http://bit.ly/$$$ http://bit.ly/%%%」のような場合、全文のURLを「http://bit.ly/$$$」に置き換えます。',
    t328: '記事URLの一部を正規表現で指定しておくことで、それに該当する記事の全文を読み込んだときにLazy Loadを用いた画像を表示します。',
    t329: '「Lazy Load URL」にURLを追加しても全文に画像が表示されない場合、その元記事ページで該当する画像の要素を調べて、imgタグ内の画像URLが値になっている属性名（src属性は除く）を追加してください。&#13;&#10;書式は属性名をダブルクオーテーションで囲み、カンマで区切ってください。&#13;&#10;Lazy Loadでよく使われる属性名は初期値に含まれています。&#13;&#10;&#13;&#10;例: 該当する画像の要素のHTMLが「&lt;img class=&quot;lazyload&quot; src=&quot;dummy.jpg&quot; data-src=&quot;image.jpg&quot;&gt;」の場合は「&quot;data-src&quot;」を追加してください。',
    t330: 'アイテムの全文を読み込むとき、使用するサイト情報などをログに出力します。&#13;&#10;ブラウザの開発ツール（F12キー）のコンソールで確認できます。',
    t331: 'ページをスクロールしてブラウザの表示領域の下端と全文の下端までの距離がこの項目の数値を下回ったとき、自動的に次ページを読み込みます。&#13;&#10;ブラウザのウィンドウの高さに近い数値を推奨します。',
  };
  const LOCALE_EN = {
    t0: 'Loading Full Feed..',
    t1: 'Loading Full Feed  Auto Search.....',
    t2: 'Loading Full Feed..... Done',
    t3: 'SITEINFO is unmatched to this entry, Load article from Inoreader function',
    t4: 'Loading next page..',
    t5: 'Loading next page..... Done',
    t6: 'Loading last page..... Done',
    t7: 'Next page is not found',
    t8: 'Blocked loading full article',
    t9: 'This entry has been already loaded',
    t10: 'SITEINFO is not found, Opened in new tab',
    t11: 'Resetting cache. Please wait..',
    t12: 'Resetting cache. Please wait..... Done',
    t13: 'Cannot popup',
    t14: 'Cache Request Error',
    t15: 'Reset cache?',
    t16: 'Delete cache?',
    t17: 'Error: not support JSONP',
    t18: 'read the full article',
    t19: 'regular expression',
    t20: 'Add',
    t21: 'Settings',
    t22: 'Cancel',
    t23: 'shortcut key',
    t24: 'key',
    t25: '',
    t26: 'change Auto Load',
    t27: 'change AutoPagerize',
    t28: 'view settings',
    t29: 'reset cache',
    t30: 'Full Feed URL',
    t31: 'AutoPagerize URL',
    t32: 'Full Feed user SITEINFO',
    t33: 'AutoPagerize user SITEINFO',
    t34: 'Loading next page  Auto Search..... Done',
    t35: 'Loading last page  Auto Search..... Done',
    t36: 'All',
    t37: 'Feed title',
    t38: 'Article title',
    t39: 'Add allowlist/denylist',
    t40: 'Click',
    t41: 'Loading next page',
    t42: 'Display content in noscript tags',
    t43: 'Read the full article automatically',
    t44: 'Allowlist',
    t45: 'Allowlist only',
    t46: 'None',
    t47: 'Item which does not read the full article',
    t48: 'Instead of not reading, open article in new tab',
    t49: 'Opened article in new tab',
    t50: 'Debug log to the browser console',
    t51: 'Loading Full Feed  Auto Search..... Done',
    t52: 'Remove iframe',
    t53: 'Error: Please set "dom.storage.enabled" in "true".',
    t54: 'Wait',
    t55: 'Display social icon',
    t56: 'Error: Please temporarily disable HTTPS-Only mode in your browser settings.',
    t57: 'Others',
    t58: 'Hatena Bookmark',
    t59: 'Warning: Add the next page?\n\nreading page: ',
    t60: '\nnext page: ',
    t61: 'Do not add the next page',
    t62: 'URL to allow the addition of the next page',
    t63: 'URL to deny the addition of the next page',
    t64: 'Try loading the full article without SITEINFO',
    t65: 'The source URL of the inline frame to display',
    t66: 'Export settings and copy it to clipboard?',
    t67: 'Copied it to clipboard',
    t68: 'Exported settings.\nPlease copy the following character string\n\n',
    t69: 'Please input the character string that exported',
    t70: 'Imported settings',
    t71: 'Cannot import',
    t72: 'Reset settings?',
    t73: 'Reset settings',
    t74: 'SITEINFO is not found, Load article from Inoreader function',
    t75: 'If cannot display the full article',
    t76: 'Denylist',
    t77: 'Except denylist',
    t78: 'Settings mode',
    t79: 'Simple',
    t80: 'Advanced',
    t81: 'seconds',
    t82: 'Aborted request',
    t83: 'load article from Inoreader function',
    t84: 'open article in new tab',
    t85: 'do nothing',
    t86: 'Site info to display the full article is not found',
    t87: 'display article in iframe',
    t88: 'SITEINFO is not found, Display article in iframe',
    t89: 'Display embedded tweets',
    t90: 'Timeout',
    t300: '',
    t301: 'If the loaded full article has a next page, the next page will be loaded when you press the shortcut key or click the F icon.',
    t302: 'Even when site information is unavailable (the F icon is grayed out), the system will attempt to load the full article.&#13;&#10;Due to the lack of site information, the article may not be displayed at all, or a portion other than the full article may be displayed.&#13;&#10;If the character encoding of the original article page cannot be determined, it will not be displayed.',
    t303: 'Display embedded tweets within the full article.&#13;&#10;However, if the full article delivery site embeds tweets in its own way, they may not be displayed.',
    t304: 'You can choose the action to take when the full article cannot be displayed for any reason.&#13;&#10;Display in inline frame: Displays the original article page in an inline frame. (Operation unconfirmed)&#13;&#10;Load with Inoreader function: Loads the full article with the function provided by Inoreader.&#13;&#10;Open in a new tab: Opens the original article page in a new tab.&#13;&#10;Do nothing: Does not display the full article.',
    t305: 'Prevent the full article from being loaded even when pressing the shortcut key or clicking the F icon.&#13;&#10;Specify any of &quot;item name/item URL/feed name&quot; with regular expressions.',
    t306: 'When attempting to load the full article of an item that matches the above settings, the full article will not be loaded and the original article page will be opened in a new tab.',
    t307: 'Specify a database that describes site information for full article loading.&#13;&#10;It should be compatible with the LDRFullFeed database and must be in JSON format.&#13;&#10;It does not need to be changed from the default value unless necessary.',
    t308: 'Specify a database that describes site information for loading the next page.&#13;&#10;It should be compatible with the AutoPagerize database and must be in JSON format.&#13;&#10;It does not need to be changed from the default value unless necessary.',
    t309: 'You can specify site information for loading the full article.&#13;&#10;This will take precedence over the site information loaded in the &quot;Full Feed URL&quot; setting.&#13;&#10;Please use it for testing before registering with wedata.&#13;&#10;Refer to the following URL for details on SITEINFO&#13;&#10;http://wedata.net/databases/LDRFullFeed/',
    t310: 'You can specify site information for loading the next page.&#13;&#10;This will take precedence over the site information loaded in the &quot;AutoPagerize URL&quot; setting.&#13;&#10;Please use it for testing before registering with wedata.&#13;&#10;Refer to the following URL for details on SITEINFO&#13;&#10;http://wedata.net/databases/AutoPagerize/',
    t311: 'If multiple site information for an item is registered in the LDRFullFeed database, you can specify the site information to be disabled.&#13;&#10;When you open the setting field with the full article loaded, the XPath of the site information for that item will be displayed. You cannot disable all of them.',
    t312: 'Register the feed title or article title with regular expressions.&#13;&#10;Middle-clicking or Ctrl-clicking the F icon to the right of the item title will open the settings pane with the feed title/article title entered. Select either the feed title or the article title and click the Add button to add it to the text area below.',
    t313: 'You can control the behavior of automatic full article loading.&#13;&#10;All: Automatically load full articles for all items when opening an item in list view or selecting it in full article view.&#13;&#10;Except denylist: Automatically load full articles for items not on the denylist.&#13;&#10;Allowlist only: Automatically load full articles only for items on the allowlist.&#13;&#10;None: Do not automatically load full articles.',
    t314: 'Display the content of the HTML noscript tag in the loaded full article.',
    t315: 'Remove inline frames (iframe tags) in the loaded full article.',
    t316: 'Even when the &quot;Remove Inline Frames&quot; setting is ON, by specifying a part of the source URL of the inline frame (src attribute value in the iframe tag) with a regular expression, the corresponding inline frame will be displayed in the full article.',
    t317: 'Even when &quot;Load next page&quot; is ON, you can block the next page from loading by specifying part of the URL of the next page with a regular expression.',
    t318: 'Even when the hostname of the original article loaded in the full article and the hostname of the link to the next page within that full article are different, you can allow the next page to load by specifying part of the URL of the next page with a regular expression.',
    t319: 'Display icons of the selected social services and the number of subscribers/references of the original article to the right of the item title.',
    t320: 'Switch the display of the settings screen.&#13;&#10;Simple: Displays only the necessary items.&#13;&#10;Advanced: Displays all items.',
    t321: 'Reacquire the cache that stores site information, etc.&#13;&#10;It can also be executed from the shortcut key (Alt+Ctrl+Shift+Z key by default).&#13;&#10;Execute this when the full article cannot be displayed correctly due to site renewal, etc., or when you want to reflect site information you have registered yourself in wedata.',
    t322: 'Discards the cache that stores site information, etc.&#13;&#10;After discarding, reload the page to acquire the cache.&#13;&#10;Try executing this when the full article cannot be displayed correctly even though the site information is correct.',
    t323: 'Set the waiting time for loading the full article. The default value is 15 seconds.',
    t324: 'Import Inoreader Full Feed settings by entering the character string exported with &quot;Settings Data - Export&quot;.',
    t325: 'Exports Inoreader Full Feed settings as a JSON formatted string.',
    t326: 'Reset all Inoreader Full Feed settings.',
    t327: 'You can change the URL of the full article to be loaded by specifying the URL before replacement (regular expression) and the URL after replacement separated by a single-byte space.&#13;&#10;By specifying &quot;Link&quot; instead of a URL as the replacement string, if the item text has a link, it will be replaced with the link destination URL.&#13;&#10;If there are multiple links, it will be replaced with the URL of the first link.&#13;&#10;If the link destination URL is Punycode (Japanese domain), that link will not be targeted.&#13;&#10;&#13;&#10;Example 1: &quot;^https?://example\\.com/(.+) https://www.example.com/$1&quot;&#13;&#10;→ This will replace a full article URL like &quot;http://example.com/&&&/statuses/000&quot; with &quot;https://www.example.com/&&&/statuses/000&quot;.&#13;&#10;&#13;&#10;Example 2: &quot;^https?://twitter\\.com/ Link&quot;&#13;&#10;→ If the item text before loading the full article is like &quot;○○○ http://bit.ly/$$$ http://bit.ly/%%%&quot;, the URL of the full article will be replaced with &quot;http://bit.ly/$$$&quot;.',
    t328: 'By specifying part of the article URL with a regular expression, images using Lazy Load will be displayed when the full article of the corresponding article is loaded.',
    t329: 'If the image is not displayed in the full article even after adding the URL to &quot;Lazy Load URL&quot;, check the corresponding image element on the original article page and add the attribute name (excluding the src attribute) whose image URL is set in the img tag.&#13;&#10;The format should be the attribute name enclosed in double quotes and separated by commas.&#13;&#10;Attribute names often used in Lazy Load are included in the initial value.&#13;&#10;&#13;&#10;Example: If the HTML of the corresponding image element is &lt;img class=&quot;lazyload&quot; src=&quot;dummy.jpg&quot; data-src=&quot;image.jpg&quot;&gt;, add &quot;data-src&quot;.',
    t330: "When loading the full article of an item, the site information used, etc. will be output to the log.&#13;&#10;You can check it in the console of your browser's developer tools (F12 key).",
    t331: "When you scroll the page and the distance between the bottom of the browser's display area and the bottom of the full article falls below the value in this field, the next page will be loaded automatically.&#13;&#10;A value close to the height of the browser window is recommended.",
  };
  const LOC = /^ja$|^ja-jp$/i.test(window.navigator.language)
    ? LOCALE_JA
    : LOCALE_EN;
  LOC.t300 = /^ja$|^ja-jp$/i.test(window.navigator.language)
    ? `全文の読み込みなどを行うショートカットキーを変更できます。初期値はZキーです。&#13;&#10;${LOC.t26}: Ctrl+ (${LOC.t18}) ${LOC.t24}&#13;&#10;${LOC.t27}: Shift+ (${LOC.t18}) ${LOC.t24}&#13;&#10;${LOC.t28}: Ctrl+Shift+ (${LOC.t18}) ${LOC.t24}&#13;&#10;${LOC.t29}: Alt+Ctrl+Shift+ (${LOC.t18}) ${LOC.t24}`
    : `You can change the shortcut key for loading the full article, etc. The default is the Z key.&#13;&#10;${LOC.t26}: Ctrl+ (${LOC.t18}) ${LOC.t24}&#13;&#10;${LOC.t27}: Shift+ (${LOC.t18}) ${LOC.t24}&#13;&#10;${LOC.t28}: Ctrl+Shift+ (${LOC.t18}) ${LOC.t24}&#13;&#10;${LOC.t29}: Alt+Ctrl+Shift+ (${LOC.t18}) ${LOC.t24}`;

  // == [Application] =============================
  try {
    if (typeof localStorage !== 'object') return window.alert(LOC.t53);
  } catch (e) {
    console.log(LOC.t53, e);
    return window.alert(LOC.t53);
  }
  const $s1 = 'irff_',
    $s2 = 'irff_s',
    $s3 = 'InoReaderFullFeed_',
    $id = (id) => document.getElementById(id),
    $ids = (id) => $id(`${$s2}-${id}`);
  let st = {};

  class FullFeed {
    static appVersion = 0;
    static state = '';
    static debugLog = false;
    static itemSiteInfo = [];
    static xhr = [];
    static nextPageLink = null;
    static readingPageUrl = null;
    static messageInterval;
    static scrollInterval;
    static siteInfo;
    static siteInfoAP;
    static userSiteInfo;
    static userSiteInfoAP;
    static cacheInfo;
    static cacheAPInfo;
    static userCache;
    static userCacheAP;
    static userCacheList;
    static userCacheListAP;
    constructor(info, c, flag) {
      this.state = 'ready';
      this.itemInfo = c;
      this.info = info;
      this.requestURL = this.itemInfo.itemURL;
      const u = this.requestURL;
      if (/^http:\/\/rd\.yahoo\.co\.jp\/rss\/l\/.+/.test(u)) {
        if (/\/\*-http/.test(u)) {
          this.requestURL = decodeURIComponent(
            u.slice(u.indexOf('*-http') + 2)
          );
        } else if (/\/\*http/.test(u)) {
          this.requestURL = decodeURIComponent(u.slice(u.indexOf('*http') + 1));
        }
      }
      this.itemInfo.itemBody = document.querySelector(
        `${currentEntry()} .article_content`
      );
      let encode = this.info.enc || document.characterSet;
      if (flag === 'next' && this.itemInfo.innerContents) {
        this.itemInfo.innerContents.className.split(/\s+/).some((i) => {
          if (!/^entry|^gm_|^http/.test(i)) {
            encode = i;
            return true;
          }
        });
      }
      this.mime = `text/html; charset=${encode}`;
      log(new Date());
      log('Item Title: ', c.item.title);
      log('Item URL: ', c.item.url);
      log('Feed URL: ', c.feed.url);
      log('FullFeed URL: ', info.url);
      log('FullFeed XPath: ', info.xpath);
      log('FullFeed Encode: ', info.enc);
      log(this.info);
    }
    static checkScroll() {
      if (
        !FullFeed.nextPageLink ||
        (FullFeed.state && !/^loaded$|^wait$/.test(FullFeed.state))
      ) {
        return;
      }
      window.clearTimeout(FullFeed.scrollInterval);
      FullFeed.scrollInterval = window.setTimeout(() => {
        requestAnimationFrame(() => {
          if (FullFeed.nextPageLink) {
            const ce = document.querySelector(currentEntry());
            if (ce) {
              const rect = ce.getBoundingClientRect(),
                distance = rect.bottom - window.innerHeight;
              if (distance < st.apheight) {
                FullFeed.nextPageLink = null;
                initFullFeed();
              }
            }
          }
        });
      }, 100);
    }
    static checkNextPage(con) {
      const con2 = con.cloneNode(true),
        aClass = con.className.split(/\s+/),
        finalUrl = aClass[aClass.length - 1],
        c = new GetCurrentItem();
      let bMatch = false,
        nextEl;
      const check = (data, flag) => {
        let nextEl2;
        data.some((info) => {
          if (info?.url?.length <= 12 && !/^\^?https?/i.test(info.url)) {
            if (new RegExp('^://', 'i').test(info.url)) {
              info.url = `^https?${info.url}`;
            } else if (new RegExp('^//', 'i').test(info.url)) {
              info.url = `^https?:${info.url}`;
            } else {
              info.url = `^https?://${info.url}`;
            }
          }
          if (
            !bMatch &&
            new RegExp(info.url).test(finalUrl) &&
            info.url.length > 12
          ) {
            let nextLink = info.nextLink,
              elms,
              elms2,
              bCache,
              bList;
            if (nextLink) {
              nextLink = nextLink.replace(/id\(([^)]+)\)/g, '//*[@id=$1]');
            }
            if (nextLink) {
              elms2 = getElementsByXPath(nextLink, con2);
              elms = getElementsByXPath(nextLink, con);
            }
            if (!elms2) elms2 = getElementsByXPath('//a[@rel="next"]', con2);
            if (!elms) elms = getElementsByXPath('//a[@rel="next"]', con);
            if (elms2 && elms2.length > 0) nextEl2 = elms2[elms2.length - 1];
            if (elms && elms.length > 0 && nextEl2?.href) {
              const arr = [];
              for (let i = 0, j = elms.length; i < j; i++) {
                if (nextEl2.href === elms[i].href) arr.push(elms[i]);
              }
              nextEl = arr.length ? arr[arr.length - 1] : elms[elms.length - 1];
            }
            if (nextEl2 && finalUrl !== nextEl2.href) {
              if (flag === 'cache') {
                if (
                  FullFeed.userCacheListAP.some((u) => {
                    if (u === c.feed.url) return true;
                  })
                ) {
                  FullFeed.userCacheAP.some((u) => {
                    if (u === info) {
                      bMatch = true;
                      return true;
                    }
                  });
                }
              } else bMatch = true;
              if (flag === 'full') {
                if (
                  FullFeed.userCacheListAP.some((u) => {
                    if (u === c.feed.url) {
                      bList = true;
                      return true;
                    }
                  })
                ) {
                  FullFeed.userCacheAP.some((u) => {
                    if (u === info) {
                      bCache = true;
                      return true;
                    }
                  });
                }
                if (!bCache) {
                  delete info.exampleUrl;
                  delete info.insertBefore;
                  FullFeed.userCacheAP.push(info);
                  try {
                    localStorage.setItem(
                      `${$s3}userCacheAP`,
                      JSON.stringify(FullFeed.userCacheAP)
                    );
                    if (!bList) {
                      FullFeed.userCacheListAP.push(c.feed.url);
                      localStorage.setItem(
                        `${$s3}userCacheListAP`,
                        JSON.stringify(FullFeed.userCacheListAP)
                      );
                    }
                  } catch (er) {
                    log('check', er);
                  }
                }
              }
              if (bMatch) {
                FullFeed.nextPageLink = nextEl;
                FullFeed.checkScroll();
                return true;
              }
              return true;
            }
            return false;
          }
          return false;
        });
      };
      check(FullFeed.userSiteInfoAP, 'set');
      if (!bMatch) check(FullFeed.userCacheAP, 'cache');
      if (!bMatch) {
        FullFeed.siteInfoAP.some((ctx) => {
          if (FullFeed.cacheAPInfo[ctx.url]) {
            check(FullFeed.cacheAPInfo[ctx.url].info, 'full');
            if (bMatch) return true;
          }
        });
      }
      if (bMatch && FullFeed.nextPageLink && st.denynexturl) {
        const re = new RegExp(st.denynexturl, 'i');
        /** @type {HTMLAnchorElement} */
        const nextPageLink = FullFeed.nextPageLink;
        if (re.test(nextPageLink.href)) FullFeed.nextPageLink = null;
      }
      if (bMatch) {
        FullFeed.checkScroll();
        return;
      }
    }
    static resetCache() {
      message(LOC.t11, -1);
      const getSiteinfo = (data, flag) => {
        let nCache = 0;
        const nCaches = flag
          ? FullFeed.siteInfo.length
          : FullFeed.siteInfoAP.length;
        data.forEach((ctx) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: ctx.url,
            nocache: true,
            onload: (res) => {
              nCache += 1;
              if (res.status === 200) {
                if (flag) {
                  FullFeed.setCache(res, ctx, 'cache');
                  if (nCache === nCaches) getSiteinfo(FullFeed.siteInfoAP);
                } else {
                  if (nCache === nCaches) {
                    FullFeed.setCache(res, ctx, 'cacheAP', true);
                  } else FullFeed.setCache(res, ctx, 'cacheAP');
                }
              } else if (flag && nCache === nCaches) {
                getSiteinfo(FullFeed.siteInfoAP);
              }
            },
            /** @param {object} res */
            onerror: (res) => {
              nCache += 1;
              log('resetCache error', res, flag, nCache);
              if (
                ctx.url.startsWith('http://') &&
                res.finalUrl.startsWith('https://') &&
                ctx.url.substring(7) === res.finalUrl.substring(8)
              ) {
                message(LOC.t56, -1);
              } else if (flag && nCache === nCaches) {
                getSiteinfo(FullFeed.siteInfoAP);
              }
            },
          });
        });
      };
      getSiteinfo(FullFeed.siteInfo, true);
    }
    static removeCache() {
      if (window.confirm(LOC.t16)) {
        localStorage.removeItem(`${$s3}cache`);
        localStorage.removeItem(`${$s3}cacheAP`);
        localStorage.removeItem(`${$s3}userCache`);
        localStorage.removeItem(`${$s3}userCacheAP`);
        localStorage.removeItem(`${$s3}userCacheList`);
        localStorage.removeItem(`${$s3}userCacheListAP`);
        FullFeed.cacheInfo = {};
        FullFeed.cacheAPInfo = {};
        FullFeed.userCache.length = 0;
        FullFeed.userCacheAP.length = 0;
        FullFeed.userCacheList.length = 0;
        FullFeed.userCacheListAP.length = 0;
      }
    }
    static setCache(res, ctx, item, flag) {
      let info = [];
      const setJson = (t) => {
        try {
          info = JSON.parse(t)
            .sort((a, b) => {
              a = new Date(a.updated_at).getTime();
              b = new Date(b.updated_at).getTime();
              if (!isNaN(a) && !isNaN(b)) {
                return new Date(b).getTime() - new Date(a).getTime();
              }
              return b;
            })
            .map((i) => i.data);
        } catch (er1) {
          log('setJson', er1);
        }
      };
      switch (ctx.format.toUpperCase()) {
        case 'JSON':
          setJson(res.responseText);
          break;
        case 'JSONP':
          if (ctx.callback) {
            try {
              let txt = res.responseText;
              txt = txt
                .replace(
                  new RegExp(`${ctx.callback}\\s*\\(\\s*\\[\\s*\\{`, 'gm'),
                  `${ctx.callback}([{`
                )
                .replace(/\}\s*\]\s*\)/gm, '}])');
              txt = txt.slice(
                txt.indexOf(`${ctx.callback}([{`) + ctx.callback.length + 1
              );
              txt = txt.slice(0, txt.lastIndexOf('}])') + 2);
              setJson(txt);
            } catch (er2) {
              log('setCache 1', er2);
            }
          } else message(LOC.t17, 5000, 'warning');
          break;
      }
      if (info.length > 0) {
        if (item === 'cache') {
          FullFeed.cacheInfo[ctx.url] = {
            url: ctx.url,
            info: info,
          };
          try {
            localStorage.setItem(
              `${$s3}cache`,
              JSON.stringify(FullFeed.cacheInfo)
            );
          } catch (er3) {
            log('setCache 2', er3);
            if (er3?.name && er3?.message) {
              window.alert(`${er3.name}\n${er3.message}`);
            }
          }
          localStorage.removeItem(`${$s3}userCache`);
          localStorage.removeItem(`${$s3}userCacheList`);
          FullFeed.userCache.length = 0;
          FullFeed.userCacheList.length = 0;
        } else if (item === 'cacheAP') {
          FullFeed.cacheAPInfo[ctx.url] = {
            url: ctx.url,
            info: info,
          };
          try {
            localStorage.setItem(
              `${$s3}cacheAP`,
              JSON.stringify(FullFeed.cacheAPInfo)
            );
          } catch (er4) {
            log('setCache 3', er4);
            if (er4?.name && er4?.message) {
              window.alert(`${er4.name}\n${er4.message}`);
            }
          }
          localStorage.removeItem(`${$s3}userCacheAP`);
          localStorage.removeItem(`${$s3}userCacheListAP`);
          FullFeed.userCacheAP.length = 0;
          FullFeed.userCacheListAP.length = 0;
        }
        if (flag) {
          const hasFF = localStorage.getItem(`${$s3}cache`) ? true : false,
            hasAP = localStorage.getItem(`${$s3}cacheAP`) ? true : false;
          if (hasFF && hasAP) message(LOC.t12, 5000);
          else message(LOC.t14, 5000, 'warning');
        }
      }
    }
    static getCache(key) {
      let js = '{}';
      if (localStorage.getItem(`${$s3}${key}`)) {
        js = localStorage.getItem(`${$s3}${key}`) ?? '';
      } else if (/^cache.+/.test(key)) FullFeed.resetCache();
      else if (/^user.+/.test(key)) js = '[]';
      try {
        return JSON.parse(js);
      } catch (er) {
        log('getCache', er);
        if (/^user.+/.test(key)) return [];
        return {};
      }
    }
    static saveSettings() {
      delete st.socialbuzzurl;
      delete st.socialdelicious;
      delete st.socialfc2;
      delete st.sociallivedoor;
      delete st.socialtwitter;
      delete st.socialyahoo;
      try {
        localStorage.setItem(`${$s3}settings`, JSON.stringify(st));
      } catch (er) {
        log('saveSettings', er);
        window.alert('Error: Save Settings');
      }
    }
    static loadSettings(data) {
      if (data === 'reset') st = {};
      else if (data) st = data;
      else {
        st = {};
        try {
          if (localStorage.getItem(`${$s3}settings`)) {
            st = JSON.parse(localStorage.getItem(`${$s3}settings`) ?? '');
          }
        } catch (er1) {
          log('loadSettings', er1);
        }
      }
      const notType = (t, a) =>
        Object.prototype.toString.call(a).slice(8, 11) !== t ? true : false;
      if (notType('Str', st.allowiframeurl)) st.allowiframeurl = '';
      if (notType('Str', st.allownexturl)) st.allownexturl = '';
      if (
        notType('Num', st.apheight) ||
        st.apheight < 200 ||
        st.apheight > 2000
      ) {
        st.apheight = 500;
      }
      if (notType('Num', st.autoload) || st.autoload < 0 || st.autoload > 3) {
        st.autoload = 2;
      }
      if (notType('Arr', st.autoloadarticle)) st.autoloadarticle = [];
      if (notType('Arr', st.autoloadfeed)) st.autoloadfeed = [];
      if (notType('Boo', st.autopagerize)) st.autopagerize = true;
      if (notType('Boo', st.autosearch)) st.autosearch = true;
      if (notType('Str', st.basekey) || st.basekey.length !== 1) {
        st.basekey = 'Z';
      }
      if (
        notType('Num', st.cantdisplay) ||
        st.cantdisplay < 0 ||
        st.cantdisplay > 3
      ) {
        st.cantdisplay = 0;
      }
      if (!st.version) st.cantdisplay += 1;
      if (notType('Str', st.denynexturl)) st.denynexturl = '';
      if (notType('Arr', st.disableitem)) st.disableitem = [];
      if (notType('Boo', st.embeddedtweets)) st.embeddedtweets = true;
      if (notType('Boo', st.iframetag)) st.iframetag = true;
      if (notType('Str', st.lazyloadurl)) st.lazyloadurl = '';
      if (notType('Str', st.lazyloadattr)) {
        st.lazyloadattr = '"ajax","data-lazy-src","data-original","data-src"';
      }
      if (notType('Str', st.mode)) st.mode = 'simple';
      if (notType('Boo', st.noscripttag)) st.noscripttag = true;
      if (notType('Arr', st.notloadarticle)) st.notloadarticle = [];
      if (notType('Arr', st.notloadfeed)) st.notloadfeed = [];
      if (notType('Str', st.notread)) st.notread = '';
      if (notType('Boo', st.openitem)) st.openitem = false;
      if (notType('Str', st.replacefullfeedurl)) st.replacefullfeedurl = '';
      if (notType('Boo', st.socialicon)) st.socialicon = true;
      if (notType('Boo', st.socialhatena)) st.socialhatena = false;
      if (notType('Num', st.timeout) || st.timeout < 5 || st.timeout > 99) {
        st.timeout = 15;
      }
      try {
        FullFeed.siteInfo = JSON.parse(st.siteinfo);
      } catch (er) {
        log('loadSettings 1', er);
        FullFeed.siteInfo = [
          {
            format: 'JSON',
            url: 'http://wedata.net/databases/LDRFullFeed/items.json',
          },
        ];
        st.siteinfo = JSON.stringify(FullFeed.siteInfo);
      }
      try {
        FullFeed.siteInfoAP = JSON.parse(st.siteinfoap);
      } catch (er) {
        log('loadSettings 2', er);
        FullFeed.siteInfoAP = [
          {
            format: 'JSON',
            url: 'http://wedata.net/databases/AutoPagerize/items.json',
          },
        ];
        st.siteinfoap = JSON.stringify(FullFeed.siteInfoAP);
      }
      try {
        FullFeed.userSiteInfo = JSON.parse(st.usersiteinfo);
      } catch (er) {
        log('loadSettings 3', er);
        FullFeed.userSiteInfo = [
          {
            url: '',
            xpath: '',
            type: '',
            enc: '',
          },
        ];
        st.usersiteinfo = JSON.stringify(FullFeed.userSiteInfo);
      }
      try {
        FullFeed.userSiteInfoAP = JSON.parse(st.usersiteinfoap);
      } catch (er) {
        log('loadSettings 4', er);
        FullFeed.userSiteInfoAP = [
          {
            url: '',
            nextLink: '',
            pageElement: '',
          },
        ];
        st.usersiteinfoap = JSON.stringify(FullFeed.userSiteInfoAP);
      }
    }
    static createSettings() {
      const div = document.createElement('div');
      div.id = `${$s2}`;
      div.style.display = 'none';
      div.innerHTML = `
<div id="${$s2}-header">
  <div id="${$s2}-header_title">
    <a href="https://greasyfork.org/scripts/897-inoreader-full-feed" target="_blank">InoReader Full Feed ${LOC.t21}</a>
  </div>
</div>
<div id="${$s2}-tab"></div>
<ul id="${$s2}-list"></ul>
<div id="${$s2}-footer">
  <div id="${$s2}-footer_button">
    <button type="button" id="${$s2}-ok">OK</button>
    <button type="button" id="${$s2}-cancel">${LOC.t22}</button>
  </div>
</div>
      `;
      document.body.appendChild(div);
      const list = [
        {
          tab: 'General',
          id: 'general',
          body: `
<fieldset>
  <legend>${LOC.t23}</legend>
  <label title="${LOC.t300}">${LOC.t18} : 
    <input type="text" id="${$s2}-general_key" maxlength="1" pattern="[a-zA-Z]">
    <span id="${$s2}-general_keydesc"></span>
  </label>
</fieldset>
<fieldset>
  <legend>${LOC.t18}</legend>
  <label title="${LOC.t301}">
    <input type="checkbox" id="${$s2}-general_ap">${LOC.t41}
  </label>
  <label class="${$s2}-advance" title="${LOC.t331}">( 
    <input type="number" min="200" max="2000" id="${$s2}-general_apheight">px )
  </label>
  <br>
  <label title="${LOC.t302}">
    <input type="checkbox" id="${$s2}-general_autosearch">${LOC.t64}
  </label>
  <br>
  <label title="${LOC.t303}">
    <input type="checkbox" id="${$s2}-general_embeddedtweets">${LOC.t89}
  </label>
  <br>
  <label title="${LOC.t304}">${LOC.t75} : 
    <select id="${$s2}-general_cantdisplay">
      <option>${LOC.t87}</option>
      <option>${LOC.t83}</option>
      <option>${LOC.t84}</option>
      <option>${LOC.t85}</option>
    </select>
  </label>
  <fieldset class="${$s2}-advance" title="${LOC.t305}">
    <legend>${LOC.t47} (${LOC.t19}) : </legend>
    <input type="text" id="${$s2}-general_notread">
    <br>
    <label title="${LOC.t306}">
      <input type="checkbox" id="${$s2}-general_openitem">${LOC.t48}
    </label>
  </fieldset>
</fieldset>
          `,
        },
        {
          tab: 'Site Info',
          id: 'siteinfo',
          body: `
<div id="${$s2}-siteinfo_navi" class="${$s2}-navi">
  <span id="${$s2}-siteinfo_navi_ff" class="${$s2}-siteinfo_navi ${$s2}-advance">FF URL</span>
  <span id="${$s2}-siteinfo_navi_ap" class="${$s2}-siteinfo_navi ${$s2}-advance">AP URL</span>
  <span id="${$s2}-siteinfo_navi_uff" class="${$s2}-siteinfo_navi select">FF SITEINFO</span>
  <span id="${$s2}-siteinfo_navi_uap" class="${$s2}-siteinfo_navi">AP SITEINFO</span>
  <span id="${$s2}-siteinfo_navi_disableitem" class="${$s2}-siteinfo_navi ${$s2}-advance">disable Item</span>
</div>
<fieldset id="${$s2}-siteinfo_f_ff" class="${$s2}-advance" title="${LOC.t307}">
  <legend>${LOC.t30}</legend>
  <textarea id="${$s2}-siteinfo_ff"></textarea>
</fieldset>
<fieldset id="${$s2}-siteinfo_f_ap" class="${$s2}-advance" title="${LOC.t308}">
  <legend>${LOC.t31}</legend>
  <textarea id="${$s2}-siteinfo_ap"></textarea>
</fieldset>
<fieldset id="${$s2}-siteinfo_f_uff" class="select" title="${LOC.t309}">
  <legend>${LOC.t32}</legend>
  <div class="${$s2}-siteinfo_form">
    <div>
      <label class="${$s2}-siteinfo_user_label ${$s2}-table">
        <span>url:</span>
        <input type="text" id="${$s2}-siteinfo_uff_url" class="${$s2}-siteinfo_text">
      </label>
    </div>
    <div>
      <label class="${$s2}-siteinfo_user_label ${$s2}-table">
        <span>xpath:</span>
        <input type="text" id="${$s2}-siteinfo_uff_xpath" class="${$s2}-siteinfo_text">
      </label>
    </div>
    <div class="${$s2}-table">
      <label id="${$s2}-siteinfo_uff_type_label" class="${$s2}-siteinfo_user_label">
        <span>type:</span>
        <select id="${$s2}-siteinfo_uff_type">
          <option value="IND">INDIVIDUAL
          </option>
          <option value="SUB">SUBGENERAL
          </option>
          <option value="GEN">GENERAL
          </option>
        </select>
      </label>
      <label id="${$s2}-siteinfo_user_label_enc">
        <div class="${$s2}-table">
          <span id="${$s2}-siteinfo_uff_enc_span">enc:</span>
          <input type="text" id="${$s2}-siteinfo_uff_enc" class="${$s2}-siteinfo_text" list="${$s2}-siteinfo_enc">
        </div>
      </label>
      <datalist id="${$s2}-siteinfo_enc">
        <option value="UTF-8">
        <option value="EUC-JP">
        <option value="Shift_JIS">
      </datalist>
      <span class="${$s2}-addbutton_span">
        <button type="button" id="${$s2}-siteinfo_uff_add" class="${$s2}-addbutton">${LOC.t20}</button>
      </span>
    </div>
  </div>
  <textarea id="${$s2}-siteinfo_uff"></textarea>
</fieldset>
<fieldset id="${$s2}-siteinfo_f_uap" title="${LOC.t310}">
  <legend>${LOC.t33}</legend>
  <div class="${$s2}-siteinfo_form">
    <div>
      <label class="${$s2}-siteinfo_user_label ${$s2}-table">
        <span>url:</span>
        <input type="text" id="${$s2}-siteinfo_uap_url" class="${$s2}-siteinfo_text">
      </label>
    </div>
    <div>
      <label class="${$s2}-siteinfo_user_label ${$s2}-table">
        <span>nextLink:</span>
        <input type="text" id="${$s2}-siteinfo_uap_nextlink" class="${$s2}-siteinfo_text">
      </label>
    </div>
    <div class="${$s2}-table">
      <label id="${$s2}-siteinfo_uap_pageelement_label" class="${$s2}-siteinfo_user_label">
        <div class="${$s2}-table">
          <span id="${$s2}-siteinfo_uap_pageelement_span">pageElement:</span>
          <input type="text" id="${$s2}-siteinfo_uap_pageelement" class="${$s2}-siteinfo_text">
        </div>
      </label>
      <span class="${$s2}-addbutton_span">
        <button type="button" id="${$s2}-siteinfo_uap_add" class="${$s2}-addbutton">${LOC.t20}</button>
      </span>
    </div>
  </div>
  <textarea id="${$s2}-siteinfo_uap"></textarea>
</fieldset>
<fieldset id="${$s2}-siteinfo_f_disableitem" class="${$s2}-advance" title="${LOC.t311}">
  <legend>disable SITEINFO Item</legend>
  <div id="${$s2}-siteinfo_disableitemlist"></div>
  <textarea id="${$s2}-siteinfo_disableitem"></textarea>
</fieldset>
          `,
        },
        {
          tab: 'Auto Load',
          id: 'autoload',
          body: `
<div id="${$s2}-autoload_navi" class="${$s2}-navi">
  <span id="${$s2}-autoload_navi_allowlist" class="${$s2}-autoload_navi select">${LOC.t44}</span>
  <span id="${$s2}-autoload_navi_denylist" class="${$s2}-autoload_navi">${LOC.t76}</span>
</div>
<fieldset id="${$s2}-autoload_f_allowlist" class="select" title="${LOC.t312}">
  <legend>${LOC.t44} (${LOC.t19})</legend>
  <label class="${$s2}-r">
    <input type="radio" name="${$s2}-autoload_allowlist_r" value="wf" id="${$s2}-autoload_allowlist_r_feed">${LOC.t37}
  </label>
  <label class="${$s2}-r">
    <input type="radio" name="${$s2}-autoload_allowlist_r" value="wa" id="${$s2}-autoload_allowlist_r_article">${LOC.t38}
  </label>
  <div id="${$s2}-autoload_allowlist_feed" class="${$s2}-autoload_form select">
    <div class="${$s2}-table">
      <input type="text" id="${$s2}-autoload_allowlist_feed_title" class="${$s2}-autoload_title">
      <span class="${$s2}-addbutton_span">
        <button type="button" id="${$s2}-autoload_allowlist_feed_add" class="${$s2}-addbutton">${LOC.t20}</button>
      </span>
    </div>
    <textarea id="${$s2}-autoload_allowlist_feed_list" class="${$s2}-autoload_list"></textarea>
  </div>
  <div id="${$s2}-autoload_allowlist_article" class="${$s2}-autoload_form">
    <div class="${$s2}-table">
      <input type="text" id="${$s2}-autoload_allowlist_article_title" class="${$s2}-autoload_title">
      <span class="${$s2}-addbutton_span">
        <button type="button" id="${$s2}-autoload_allowlist_article_add" class="${$s2}-addbutton">${LOC.t20}</button>
      </span>
    </div>
    <textarea id="${$s2}-autoload_allowlist_article_list" class="${$s2}-autoload_list"></textarea>
  </div>
</fieldset>
<fieldset id="${$s2}-autoload_f_denylist" title="${LOC.t312}">
  <legend>${LOC.t76} (${LOC.t19})</legend>
  <label class="${$s2}-r">
    <input type="radio" name="${$s2}-autoload_denylist_r" value="bf" id="${$s2}-autoload_denylist_r_feed">${LOC.t37}
  </label>
  <label class="${$s2}-r">
    <input type="radio" name="${$s2}-autoload_denylist_r" value="ba" id="${$s2}-autoload_denylist_r_article">${LOC.t38}
  </label>
  <div id="${$s2}-autoload_denylist_feed" class="${$s2}-autoload_form select">
    <div class="${$s2}-table">
      <input type="text" id="${$s2}-autoload_denylist_feed_title" class="${$s2}-autoload_title">
      <span class="${$s2}-addbutton_span">
        <button type="button" id="${$s2}-autoload_denylist_feed_add" class="${$s2}-addbutton">${LOC.t20}</button>
      </span>
    </div>
    <textarea id="${$s2}-autoload_denylist_feed_list" class="${$s2}-autoload_list"></textarea>
  </div>
  <div id="${$s2}-autoload_denylist_article" class="${$s2}-autoload_form">
    <div class="${$s2}-table">
      <input type="text" id="${$s2}-autoload_denylist_article_title" class="${$s2}-autoload_title">
      <span class="${$s2}-addbutton_span">
        <button type="button" id="${$s2}-autoload_denylist_article_add" class="${$s2}-addbutton">${LOC.t20}</button>
      </span>
    </div>
    <textarea id="${$s2}-autoload_denylist_article_list" class="${$s2}-autoload_list"></textarea>
  </div>
</fieldset>
<div>
  <label title="${LOC.t313}">${LOC.t43} : 
    <select id="${$s2}-autoload_mode">
      <option>${LOC.t36}</option>
      <option>${LOC.t77}</option>
      <option>${LOC.t45}</option>
      <option>${LOC.t46}</option>
    </select>
  </label>
</div>
          `,
        },
        {
          tab: 'Security',
          id: 'security',
          body: `
<label title="${LOC.t314}">
  <input type="checkbox" id="${$s2}-security_noscripttag">${LOC.t42}
</label>
<br>
<label title="${LOC.t315}">
  <input type="checkbox" id="${$s2}-security_iframetag">${LOC.t52}
</label>
<fieldset title="${LOC.t316}">
  <legend>${LOC.t65} (${LOC.t19}) : </legend>
  <input type="text" id="${$s2}-security_allowiframeurl">
</fieldset>
<fieldset title="${LOC.t317}">
  <legend>${LOC.t63} (${LOC.t19}) : </legend>
  <input type="text" id="${$s2}-security_denynexturl">
</fieldset>
<fieldset title="${LOC.t318}">
  <legend>${LOC.t62} (${LOC.t19}) : </legend>
  <input type="text" id="${$s2}-security_allownexturl">
</fieldset>
          `,
        },
        {
          tab: 'Social',
          id: 'social',
          body: `
<fieldset title="${LOC.t319}">
  <legend>
    <label>
      <input type="checkbox" id="${$s2}-social_socialicon">${LOC.t55}
    </label>
  </legend>
  <label>
    <input type="checkbox" id="${$s2}-social_hatena">${LOC.t58}
  </label>
</fieldset>
          `,
        },
        {
          tab: 'Etc',
          id: 'etc',
          body: `
<div class="${$s2}-clearfix">
  <fieldset id="${$s2}-etc_mode" class="${$s2}-f_column2" title="${LOC.t320}">
    <legend>${LOC.t78}</legend>
    <label class="${$s2}-r">
      <input id="${$s2}-etc_mode-simple" name="${$s2}-etc_mode_r" type="radio" value="simple" />${LOC.t79}
    </label>
    <label class="${$s2}-r">
      <input id="${$s2}-etc_mode-advance" name="${$s2}-etc_mode_r" type="radio" value="advance" />${LOC.t80}
    </label>
  </fieldset>
  <fieldset class="${$s2}-f_column2">
    <legend>Cache Data</legend>
    <button type="button" id="${$s2}-etc_cachereset" title="${LOC.t321}">Reset Cache</button>
    <button type="button" id="${$s2}-etc_cachedelete" class="${$s2}-advance" title="${LOC.t322}">Delete Cache</button>
  </fieldset>
</div>
<div class="${$s2}-clearfix">
  <fieldset class="${$s2}-advance ${$s2}-f_column2" title="${LOC.t323}">
    <legend>${LOC.t90}</legend>
    <input type="number" min="10" max="99" id="${$s2}-etc_timeout">${LOC.t81}
  </fieldset>
  <fieldset class="${$s2}-advance ${$s2}-f_column2">
    <legend>Settings Data</legend>
    <button type="button" id="${$s2}-etc_settingsimport" title="${LOC.t324}">Import</button>
    <button type="button" id="${$s2}-etc_settingsexport" title="${LOC.t325}">Export</button>
    <button type="button" id="${$s2}-etc_settingsreset" title="${LOC.t326}">Reset</button>
  </fieldset>
</div>
<fieldset class="${$s2}-advance" title="${LOC.t327}">
  <legend>Replace Full Feed URL : </legend>
  <input type="text" id="${$s2}-etc_replacefullfeedurl">
</fieldset>
<fieldset class="${$s2}-advance" title="${LOC.t328}">
  <legend>Lazy Load URL (${LOC.t19}) : </legend>
  <input type="text" id="${$s2}-etc_lazyloadurl">
</fieldset>
<fieldset class="${$s2}-advance" title="${LOC.t329}">
  <legend>Lazy Load Attribute : </legend>
  <input type="text" id="${$s2}-etc_lazyloadattr">
</fieldset>
<fieldset class="${$s2}-advance">
  <legend>${LOC.t57}</legend>
  <label class="${$s2}-advance" title="${LOC.t330}">
    <input type="checkbox" id="${$s2}-etc_debuglog">${LOC.t50}
  </label>
</fieldset>
          `,
        },
      ];
      list.forEach((i) => {
        const span = document.createElement('span'),
          div2 = document.createElement('div');
        span.id = `${$s2}-tab_${i.id}`;
        span.innerHTML = i.tab;
        div2.id = `${$s2}-${i.id}`;
        div2.style.display = 'none';
        div2.innerHTML = i.body;
        if (/security|social/.test(i.id)) {
          span.className = `${$s2}--advance`;
          div2.className = `${$s2}--advance`;
        }
        $ids('tab')?.appendChild(span);
        $ids('list')?.appendChild(div2);
      });
      const sAarf = $ids('autoload_allowlist_r_feed'),
        sAdrf = $ids('autoload_denylist_r_feed');
      if (sAarf instanceof HTMLInputElement) sAarf.checked = true;
      if (sAdrf instanceof HTMLInputElement) sAdrf.checked = true;
      if (st.mode === 'simple') toggleSettingsMode();
      const menu = $id('sb_rp_settings_menu'),
        pqm = $id('preferences_quick_main'),
        item = document.createElement('div');
      item.id = `${$s2}-menu`;
      item.innerHTML = `Full Feed ${LOC.t21}`;
      if (menu) {
        item.className = 'inno_toolbar_button_menu_item';
        const menuList = menu.children;
        if (!menuList[menuList.length - 1].id) {
          const line = document.createElement('div');
          line.className = 'inno_toolbar_button_menu_line';
          if (menu.lastChild) {
            menu.insertBefore(line, menu.lastChild.nextSibling);
          }
        }
        if (menu.lastChild) menu.insertBefore(item, menu.lastChild.nextSibling);
      } else if ($id('quick_options') && pqm) {
        item.className = 'quick_options_link';
        if (pqm.lastChild) pqm.insertBefore(item, pqm.lastChild.nextSibling);
      }
      $id(`${$s2}`)?.addEventListener(
        'keydown',
        (e) => {
          if (
            e.target instanceof HTMLElement &&
            /^input|^textarea/i.test(e.target.tagName)
          ) {
            e.stopPropagation();
          }
        },
        false
      );
      $ids('general_key')?.addEventListener(
        'keypress',
        (e) => e.preventDefault(),
        false
      );
    }
    static viewSettings(id, eIcon) {
      const s2 = $id(`${$s2}`);
      if (s2?.style.display === 'block') {
        s2.style.display = 'none';
        return;
      }
      const tab = $ids('tab')?.children,
        list = $ids('list')?.children,
        gk = $ids('general_key'),
        ga = $ids('general_ap'),
        gah = $ids('general_apheight'),
        gas = $ids('general_autosearch'),
        gcd = $ids('general_cantdisplay'),
        get = $ids('general_embeddedtweets'),
        gnr = $ids('general_notread'),
        goi = $ids('general_openitem'),
        siff = $ids('siteinfo_ff'),
        siap = $ids('siteinfo_ap'),
        siuff = $ids('siteinfo_uff'),
        siuap = $ids('siteinfo_uap'),
        sidil = $ids('siteinfo_disableitemlist'),
        sidi = $ids('siteinfo_disableitem'),
        alm = $ids('autoload_mode');
      if (gk instanceof HTMLInputElement) gk.value = st.basekey;
      if (ga instanceof HTMLInputElement) {
        ga.checked = st.autopagerize ? true : false;
      }
      if (gah instanceof HTMLInputElement) gah.value = st.apheight;
      if (gas instanceof HTMLInputElement) {
        gas.checked = st.autosearch ? true : false;
      }
      if (gcd instanceof HTMLSelectElement) gcd.selectedIndex = st.cantdisplay;
      if (get instanceof HTMLInputElement) {
        get.checked = st.embeddedtweets ? true : false;
      }
      if (gnr instanceof HTMLInputElement) gnr.value = st.notread;
      if (goi instanceof HTMLInputElement) {
        goi.checked = st.openitem ? true : false;
      }
      let chklist = '';
      const beautifier = (str) => {
        try {
          return JSON.stringify(str)
            .replace(/^\[/g, '[\n')
            .replace(/\{"/g, '  {\n    "')
            .replace(/"\}/g, '"\n  }')
            .replace(/\},/g, '},\n')
            .replace(/",/g, '",\n    ')
            .replace(/\{"/g, '{\n    "')
            .replace(/\]$/g, '\n]');
        } catch (er) {
          log('viewSettings beautifier', er);
          return '';
        }
      };
      if (siff instanceof HTMLTextAreaElement) {
        siff.value = beautifier(FullFeed.siteInfo);
      }
      if (siap instanceof HTMLTextAreaElement) {
        siap.value = beautifier(FullFeed.siteInfoAP);
      }
      if (siuff instanceof HTMLTextAreaElement) {
        siuff.value = beautifier(FullFeed.userSiteInfo);
      }
      if (siuap instanceof HTMLTextAreaElement) {
        siuap.value = beautifier(FullFeed.userSiteInfoAP);
      }
      FullFeed.itemSiteInfo.forEach((a) => {
        chklist += `<label title="${a.url}"><input type="checkbox"`;
        if (FullFeed.itemSiteInfo.length === 1) {
          chklist += ' disabled="disabled"';
        } else {
          st.disableitem.forEach((b) => {
            if (a.url === b) chklist += ' checked';
          });
        }
        chklist += `>${a.url}</label><br>`;
      });
      if (sidil) sidil.innerHTML = chklist;
      if (st.disableitem && sidi instanceof HTMLTextAreaElement) {
        sidi.value = st.disableitem.join('\n');
      }
      if (alm instanceof HTMLSelectElement) alm.selectedIndex = st.autoload;
      const eCurrent = document.querySelector(currentEntry());
      let feedTitle = '',
        articleTitle = '';
      if (eCurrent?.id) {
        let sId, eTitleLink;
        if (eIcon) {
          eTitleLink =
            eIcon.parentNode.getElementsByClassName('article_title_link')[0];
          if (eTitleLink) {
            sId = eTitleLink.id.slice(eTitleLink.id.lastIndexOf('_') + 1);
          } else sId = eCurrent.id.slice(eCurrent.id.lastIndexOf('_') + 1);
        } else sId = eCurrent.id.slice(eCurrent.id.lastIndexOf('_') + 1);
        const eFeed =
            $id(`article_feed_info_link_${sId}`) ||
            eCurrent.getElementsByClassName('article_feed_title')[0] ||
            eCurrent.querySelector('.article_tile_footer_feed_title > a'),
          eTitle =
            $id(`at_${sId}`) ||
            eCurrent.getElementsByClassName('article_header_title')[0] ||
            eCurrent.getElementsByClassName('article_title_link')[0],
          tree = $id('tree');
        if (eFeed) {
          feedTitle = eFeed.textContent ? eFeed.textContent : '';
        } else if (tree) {
          const tlf = tree.getElementsByClassName('selected')[0];
          if (tlf?.textContent) feedTitle = tlf.textContent;
        }
        if (eTitle?.textContent) articleTitle = eTitle.textContent;
      }
      if (feedTitle) {
        const aaft = $ids('autoload_allowlist_feed_title'),
          adft = $ids('autoload_denylist_feed_title');
        feedTitle = feedTitle
          .replace(/([*+?.()[\]\\|^$])/g, '\\$1')
          .replace(/^\s*(.*?)/, '$1');
        if (aaft instanceof HTMLInputElement) aaft.value = `^${feedTitle}$`;
        if (adft instanceof HTMLInputElement) adft.value = `^${feedTitle}$`;
      }
      if (articleTitle) {
        const aaat = $ids('autoload_allowlist_article_title'),
          adat = $ids('autoload_denylist_article_title');
        if (aaat instanceof HTMLInputElement) aaat.value = `^${articleTitle}$`;
        if (adat instanceof HTMLInputElement) adat.value = `^${articleTitle}$`;
      }
      if (st.autoloadfeed) {
        const aafl = $ids('autoload_allowlist_feed_list');
        if (aafl instanceof HTMLTextAreaElement) {
          aafl.value = st.autoloadfeed.join('\n');
        }
      }
      if (st.autoloadarticle) {
        const aaal = $ids('autoload_allowlist_article_list');
        if (aaal instanceof HTMLTextAreaElement) {
          aaal.value = st.autoloadarticle.join('\n');
        }
      }
      if (st.notloadfeed) {
        const adfl = $ids('autoload_denylist_feed_list');
        if (adfl instanceof HTMLTextAreaElement) {
          adfl.value = st.notloadfeed.join('\n');
        }
      }
      if (st.notloadarticle) {
        const adal = $ids('autoload_denylist_article_list');
        if (adal instanceof HTMLTextAreaElement) {
          adal.value = st.notloadarticle.join('\n');
        }
      }
      const snt = $ids('security_noscripttag'),
        sit = $ids('security_iframetag'),
        saiu = $ids('security_allowiframeurl'),
        sdnu = $ids('security_denynexturl'),
        sanu = $ids('security_allownexturl');
      if (snt instanceof HTMLInputElement) {
        snt.checked = st.noscripttag ? true : false;
      }
      if (sit instanceof HTMLInputElement) {
        sit.checked = st.iframetag ? true : false;
      }
      if (saiu instanceof HTMLInputElement) saiu.value = st.allowiframeurl;
      if (sdnu instanceof HTMLInputElement) sdnu.value = st.denynexturl;
      if (sanu instanceof HTMLInputElement) sanu.value = st.allownexturl;
      if (saiu instanceof HTMLInputElement) {
        if (sit instanceof HTMLInputElement && sit.checked) {
          saiu.disabled = false;
          if (saiu.parentNode instanceof HTMLElement) {
            saiu.parentNode.style.color = 'inherit';
          }
        } else {
          saiu.disabled = true;
          if (saiu.parentNode instanceof HTMLElement) {
            saiu.parentNode.style.color = 'gray';
          }
        }
      }
      const ssi = $ids('social_socialicon'),
        sh = $ids('social_hatena');
      if (ssi instanceof HTMLInputElement) {
        ssi.checked = st.socialicon ? true : false;
      }
      if (sh instanceof HTMLInputElement) {
        sh.checked = st.socialhatena ? true : false;
      }
      ['hatena'].forEach((a) => {
        const social = $ids(`social_${a}`);
        if (social instanceof HTMLInputElement) {
          if (ssi instanceof HTMLInputElement && ssi.checked) {
            social.disabled = false;
            if (social.parentNode instanceof HTMLElement) {
              social.parentNode.style.color = 'inherit';
            }
          } else {
            social.disabled = true;
            if (social.parentNode instanceof HTMLElement) {
              social.parentNode.style.color = 'gray';
            }
          }
        }
      });
      const bSimple = $id(`${$s2}-list`)?.getElementsByClassName(`${$s1}hidden`)
        .length
        ? true
        : false;
      if (st.mode === 'simple') {
        const ems = $ids('etc_mode-simple');
        if (ems instanceof HTMLInputElement) ems.checked = true;
        if (!bSimple) toggleSettingsMode();
      } else if (st.mode === 'advance') {
        const ema = $ids('etc_mode-advance');
        if (ema instanceof HTMLInputElement) ema.checked = true;
        if (bSimple) toggleSettingsMode();
      }
      const et = $ids('etc_timeout'),
        erffu = $ids('etc_replacefullfeedurl'),
        ellu = $ids('etc_lazyloadurl'),
        ella = $ids('etc_lazyloadattr'),
        eedl = $ids('etc_debuglog');
      if (et instanceof HTMLInputElement) et.value = st.timeout;
      if (erffu instanceof HTMLInputElement) {
        erffu.value = st.replacefullfeedurl;
      }
      if (ellu instanceof HTMLInputElement) ellu.value = st.lazyloadurl;
      if (ella instanceof HTMLInputElement) ella.value = st.lazyloadattr;
      if (eedl instanceof HTMLInputElement) {
        eedl.checked = st.debuglog ? true : false;
      }
      if (tab && list) {
        for (let i = 0; i < tab.length; i++) {
          if (tab[i].classList.contains('select')) {
            const eList = list[i];
            tab[i].classList.remove('select');
            if (eList instanceof HTMLElement) eList.style.display = 'none';
          }
        }
        if (id) {
          //※ createSettings()のlistと並び順を合わせること
          const idlist = [
            'general',
            'siteinfo',
            'autoload',
            'security',
            'social',
            'etc',
          ];
          idlist.find((s, j) => {
            if (id === s) {
              tab[j].classList.add('select');
              if (list[j] instanceof HTMLElement) {
                list[j].style.display = 'block';
              }
            }
          });
        } else {
          tab[0].classList.add('select');
          if (list[0] instanceof HTMLElement) list[0].style.display = 'block';
        }
        if (s2) s2.style.display = 'block';
      }
    }
    static checkRegister() {
      window.setTimeout(() => {
        const currentItem = getActiveItem();
        if (currentItem?.url) {
          FullFeed.registerWidgets();
          FullFeed.registerSocialIcons();
        }
      }, 10);
    }
    static registerWidgets() {
      const c = new GetCurrentItem();
      let flag = false;
      if (!c.innerContents) return;
      if (
        /^https?:\/\/(?:www\.)?inoreader\.com\/?$|^javascript:|\.pdf$/i.test(
          c.itemURL
        )
      ) {
        return;
      }
      const el = document.querySelectorAll(
        `${currentEntry()} .article_title > span`
      );
      for (let i = 0, j = el.length; i < j; i++) {
        if (el[i].classList.contains(`${$s1}checked`)) {
          flag = true;
          break;
        }
      }
      if (flag) return;
      const container = document.querySelector(
          `${currentEntry()} .article_title`
        ),
        description = `${LOC.t40} : ${LOC.t18} / Ctrl+${LOC.t40} : ${LOC.t39}`,
        feed = c.feed,
        title = c.item.title;
      let bFound = false;
      if (!container) return;
      FullFeed.itemSiteInfo.length = 0;
      const check = (b) => {
        bFound = true;
        const icon = document.createElement('span');
        icon.title = description;
        icon.innerHTML = 'F';
        icon.classList.add(`${$s1}checked`);
        icon.classList.add(`${$s1}checked_icon`);
        if (b) icon.classList.add(`${$s1}checked_icon_info`);
        else icon.classList.add(`${$s1}checked_icon_noinfo`);
        container.appendChild(icon);
        if (st.autoload === 0) initFullFeed();
        else if (st.autoload === 1) {
          const notloadfeed = st.notloadfeed.find((k) => {
            if (!k) return false;
            if (new RegExp(k, 'i').test(feed.title)) return true;
          });
          const notloadarticle = st.notloadarticle.find((k) => {
            if (!k) return false;
            if (new RegExp(k, 'i').test(title)) return true;
          });
          if (notloadfeed || notloadarticle) {
            flag = true;
          }
          if (!flag) initFullFeed();
        } else if (st.autoload === 2) {
          const notloadfeed = st.notloadfeed.find((k) => {
            if (!k) return false;
            if (new RegExp(k, 'i').test(feed.title)) return true;
          });
          const notloadarticle = st.notloadarticle.find((k) => {
            if (!k) return false;
            if (new RegExp(k, 'i').test(title)) return true;
          });
          if (notloadfeed || notloadarticle) {
            flag = true;
          }
          const autoloadfeed = st.autoloadfeed.find((k) => {
            if (!k) return false;
            if (new RegExp(k, 'i').test(feed.title)) return true;
          });
          const autoloadarticle = st.autoloadarticle.find((k) => {
            if (!k) return false;
            if (new RegExp(k, 'i').test(title)) return true;
          });
          if (!flag && (autoloadfeed || autoloadarticle)) {
            initFullFeed();
          }
        }
      };
      FullFeed.userSiteInfo.some((k) => {
        try {
          const reg = new RegExp(k.url);
          if (k.url && (reg.test(c.itemURL) || reg.test(feed.url))) {
            check(true);
            return true;
          }
        } catch (er) {
          log('registerWidgets 1', er, k.url);
        }
      });
      if (!bFound) {
        if (
          FullFeed.userCacheList.some((k) => {
            if (k === feed.url) {
              return true;
            }
          })
        ) {
          FullFeed.userCache.some((k) => {
            try {
              const reg = new RegExp(k.url);
              if (k.url && (reg.test(c.itemURL) || reg.test(feed.url))) {
                check(true);
                return true;
              }
            } catch (er) {
              log('registerWidgets 2', er, k.url);
            }
          });
        }
      }
      if (!bFound) {
        FullFeed.siteInfo.some((ctx) => {
          if (FullFeed.cacheInfo[ctx.url]) {
            FullFeed.cacheInfo[ctx.url].info.some((k) => {
              try {
                const reg = new RegExp(k.url);
                if (k.url && (reg.test(c.itemURL) || reg.test(feed.url))) {
                  check(true);
                  return true;
                }
              } catch (er) {
                log('registerWidgets 3', er, k.url);
              }
            });
          }
        });
      }
      if (!bFound) check();
    }
    static registerSocialIcons() {
      if (!st.socialicon) return;
      const c = new GetCurrentItem();
      if (!c.innerContents) return;
      if (
        document.querySelector(
          `${currentEntry()} .article_title > .${$s1}socialicon`
        )
      ) {
        return;
      }
      const container = document.querySelector(
          `${currentEntry()} .article_title`
        ),
        itemScheme = c.itemURL.slice(0, c.itemURL.indexOf('://') + 3),
        itemUrl2 = c.itemURL
          .slice(c.itemURL.indexOf('://') + 3)
          .replace(/#/g, '%23');
      if (!container) return;
      const hatena = {
        method: 'GET',
        url: `http://api.b.st-hatena.com/entry.count?url=${itemScheme}${itemUrl2}`,
        onload: (res) => {
          if (res.status === 200) {
            const total = Number(res.responseText);
            if (isNaN(total) || total <= 0) return;
            const style =
                total < 10 ? '1' : total < 100 ? '2' : total < 1000 ? '3' : '4',
              str = total > 1 ? ' users' : ' user',
              ssl = itemScheme === 'https://' ? 's/' : '';
            sH.innerHTML = `
<a href="http://b.hatena.ne.jp/entry/${ssl}${itemUrl2}" target="_blank" title="${LOC.t58}: ${total}${str}" class="${$s1}hatena ${$s1}hatena${style}">
  <img src="http://b.hatena.ne.jp/favicon.ico">
  <span>${total}</span>
</a>
            `;
          }
        },
      };
      const ce = () => document.createElement('span');
      const sF = ce(),
        sH = ce();
      [sF, sH].forEach((i) => (i.className = `${$s1}socialicon`));
      const ac1 = (s, f) => {
        container.appendChild(s);
        GM_xmlhttpRequest(f);
      };
      if (st.socialhatena) ac1(sH, hatena);
      let repeat = 0,
        inter;
      const check = () => {
        const e = document.querySelectorAll(
          `${currentEntry()} .article_title > .${$s1}socialicon > a > img`
        );
        let f = true;
        repeat += 1;
        for (let i = 0, j = e.length; i < j; i++) {
          if (e[i].clientHeight === 1) {
            const pn1 = e[i].parentNode,
              pn2 = pn1?.parentNode;
            if (pn1 instanceof HTMLElement) pn2?.removeChild(pn1);
          } else if (e[i].clientHeight === 0 && repeat < 10) f = false;
        }
        if (f) window.clearInterval(inter);
      };
      inter = window.setInterval(() => check(), 1000);
    }
    static getAppVersion() {
      const extractNumber = (str) => {
        if (typeof str !== 'string' || str === '') return 0;
        const [first, second] = str.split('.');
        return first && second ? parseFloat(`${first}.${second}`) : 0;
      };
      try {
        /* global application_version */
        /* @ts-expect-error */
        FullFeed.appVersion = extractNumber(application_version);
      } catch (e) {
        log('getAppVersion', e);
      }
    }
    request(m, c) {
      if (!this.requestURL) return;
      FullFeed.state = 'request';
      const self = this;
      let retry = 0,
        mes = '',
        xhrID;
      const message2 = (s, d, t) => {
        mes = s;
        message(s, d, t);
      };
      const gmRequest = () => {
        FullFeed.xhr.push(GM_xmlhttpRequest(opt));
        xhrID = window.setTimeout(() => {
          window.clearTimeout(xhrID);
          for (let x1 = 0, x2 = FullFeed.xhr.length; x1 < x2; x1++) {
            if (FullFeed.xhr[x1]) FullFeed.xhr[x1].abort();
          }
          FullFeed.xhr.length = 0;
          FullFeed.state = '';
          message(LOC.t82, 3000, 'warning');
        }, st.timeout * 1000);
      };
      const opt = {
        method: m,
        url: this.requestURL,
        overrideMimeType: this.mime,
        timeout: st.timeout * 1000,
        onreadystatechange: (res) => {
          if (res.readyState >= 1 && res.readyState <= 3) {
            let dot = '';
            for (let i = 0; i < res.readyState; i++) dot += '.';
            message(mes + dot, -1);
          }
        },
        onerror: () => {
          window.clearTimeout(xhrID);
          FullFeed.state = '';
          self.requestError.apply(self, ['Request Error']);
        },
        onload: (res) => {
          window.clearTimeout(xhrID);
          if ((res.status >= 301 && res.status <= 303) || res.status === 307) {
            try {
              const location = res.responseHeaders.match(/\sLocation:\s+(\S+)/);
              if (location) opt.url = location[1];
              gmRequest();
              return;
            } catch (er) {
              log('request', er);
              FullFeed.state = '';
              self.requestError.apply(self, [`Request Error : ${res.status}`]);
              return;
            }
          } else if (res.status === 200) {
            if (res.finalUrl) opt.url = this.requestURL = res.finalUrl;
            FullFeed.readingPageUrl = c.innerContents.className
              .split(/\s+/)
              .filter((i) => /^http/.test(i))
              .slice(-1);
            if (FullFeed.readingPageUrl) {
              /** @type {string} */
              const readingPageUrl = FullFeed.readingPageUrl ?? '';
              FullFeed.readingPageUrl = readingPageUrl.length
                ? readingPageUrl.toString()
                : opt.url;
            }
            const charset = /content-type:\s?\S+\s?charset=\S+/i.exec(
                res.responseHeaders
              ),
              enc = self.info.enc || '',
              cset = charset
                ? charset[0].slice(charset[0].lastIndexOf('=') + 1)
                : '';
            if (opt.method === 'GET') {
              if (cset && !new RegExp(cset, 'i').test(enc) && retry < 2) {
                self.info.enc = cset;
                opt.overrideMimeType = `text/html; charset=${cset}`;
                gmRequest();
                retry += 1;
              } else {
                const readingPageUrl = FullFeed.readingPageUrl ?? '',
                  h1 = readingPageUrl.split('/')[2],
                  h2 = opt.url.split('/')[2],
                  re = new RegExp(st.allownexturl, 'i');
                if (h1 === h2 || (st.allownexturl && re.test(readingPageUrl))) {
                  self.requestLoad.call(self, res, c);
                } else if (
                  window.confirm(
                    LOC.t59 + FullFeed.readingPageUrl + LOC.t60 + opt.url
                  )
                ) {
                  self.requestLoad.call(self, res, c);
                } else self.requestEnd(c, false, true);
              }
            } else if (opt.method === 'HEAD') {
              if (cset && st.autosearch) {
                self.info.enc = cset;
                opt.method = 'GET';
                opt.overrideMimeType = `text/html; charset=${cset}`;
                message2(LOC.t1, -1);
                loadingStyle('add', c.articleContainer);
                gmRequest();
              } else {
                FullFeed.state = '';
                if (st.cantdisplay === 0) {
                  const eb = $id(`embed_button_${c.item.id}`);
                  if (eb?.classList.contains('article_title_buttons_active')) {
                    message();
                  } else message2(LOC.t88);
                  contentScriptInjection(
                    `embed_article("${c.item.id}","${opt.url}");`
                  );
                } else if (st.cantdisplay === 1) {
                  const mb = $id(`mobilize_button_${c.item.id}`);
                  if (mb?.classList.contains('article_title_buttons_active')) {
                    message();
                  } else message2(LOC.t74);
                  contentScriptInjection(`mobilize("${c.item.id}");`);
                } else if (st.cantdisplay === 2) {
                  message2(LOC.t10);
                  loadingStyle('open', c.articleContainer);
                  GM_openInTab(opt.url, true);
                  window.setTimeout(
                    () => loadingStyle('remove', c.articleContainer),
                    1000
                  );
                } else {
                  message2(LOC.t86);
                }
              }
            }
          } else {
            FullFeed.state = '';
            const stat = res.status ? ` : ${res.status}` : '';
            self.requestError.apply(self, [`Request Error${stat}`]);
          }
        },
      };
      if (opt.method === 'HEAD') message2(LOC.t54, -1);
      else if (opt.method === 'GET') {
        message2(LOC.t0, -1);
        loadingStyle('add', c.articleContainer);
      }
      if (opt.url.indexOf('http:') !== 0 && this.info.base) {
        opt.url = pathToURL(this.info.base, opt.url);
      }
      gmRequest();
    }
    requestLoad(res, c) {
      FullFeed.state = 'loading';
      let text = res.responseText;
      const html = createHTMLDocumentByString(text),
        tmpElm = this.info.xpath
          ? getElementsByXPath(this.info.xpath, html)
          : null;
      if (tmpElm) {
        let tmpNode = document
            .createDocumentFragment()
            .appendChild(document.createElement('div')),
          doc;
        try {
          doc = document.cloneNode(false);
          if (doc instanceof Document) {
            doc.appendChild(doc.importNode(document.documentElement, false));
          }
        } catch (e) {
          log('requestLoad 1', e);
          doc = document.implementation.createDocument(
            'http://www.w3.org/1999/xhtml',
            'html',
            null
          );
        }
        try {
          if (doc instanceof Document) tmpNode = doc.adoptNode(tmpNode);
        } catch (e) {
          log('requestLoad 2', e);
          if (doc instanceof Document) tmpNode = doc.importNode(tmpNode, true);
        }
        tmpElm.forEach((elm) => tmpNode.appendChild(elm));
        if (tmpNode.innerHTML) text = tmpNode.innerHTML;
      }
      ['head', 'isindex', 'link', 'script', 'style', 'title'].forEach((t) => {
        const r = new RegExp(
          `<(?:!--\\s*)?${t}(?:\\s[^>]+?)?>[\\S\\s]*?<\\/${t}\\s*>`,
          'gi'
        );
        text = text.replace(r, '');
      });
      const re =
        /(<[^>]+?[\s"'])(?:on(?:(?:un)?load|(?:dbl)?click|mouse(?:down|up|over|move|out)|key(?:press|down|up)|focus|blur|submit|reset|select|change|error)|submit|target|usemap|formaction)\s*=\s*(?:"(?:\\"|[^"])*"?|'(\\'|[^'])*'?|[^\s>]+(?=[\s>]|<\w))(?=[^>]*?>|<\w|\s*$)/gi;
      while (re.test(text)) {
        text = text.replace(re, '$1');
      }
      if (st.noscripttag) {
        text = text.replace(
          /<noscript(?:\s[^>]+?)?>([\S\s]*?)<\/noscript\s*>/gi,
          '<div>$1</div>'
        );
      } else {
        text = text.replace(
          /<noscript(?:\s[^>]+?)?>([\S\s]*?)<\/noscript\s*>/gi,
          ''
        );
      }
      const htmldoc = createHTMLDocumentByString(text);
      if (st.iframetag && htmldoc instanceof Document) {
        const iframe = htmldoc.getElementsByTagName('iframe');
        for (let i = 0, j = iframe.length; i < j; i++) {
          if (
            iframe[i] &&
            (!st.allowiframeurl ||
              (iframe[i].src &&
                !new RegExp(st.allowiframeurl).test(iframe[i].src)))
          ) {
            iframe[i].parentNode?.removeChild(iframe[i]);
          }
        }
      }
      removeXSSRisks(htmldoc);
      if (res.finalUrl) this.requestURL = res.finalUrl;
      if (st.lazyloadurl && new RegExp(st.lazyloadurl, 'i').test(c.item.url)) {
        replaceSrcOriginal(htmldoc);
      }
      relativeToAbsolutePath(htmldoc, this.requestURL);
      const self = this;
      let entry;
      FullFeed.documentFilters.forEach((filter) => filter(htmldoc));
      try {
        entry = getElementsByXPath('//html/child::node()', htmldoc);
      } catch (er1) {
        log('requestLoad', er1);
        message(er1, 5000, 'warning');
        return;
      }
      if (!tmpElm) {
        if (st.autosearch) {
          log('Auto Search');
          message(LOC.t1, -1);
          entry = searchEntry(htmldoc);
        } else {
          FullFeed.state = '';
          GM_openInTab(self.requestURL, true);
          window.setTimeout(
            () => loadingStyle('remove', c.articleContainer),
            1000
          );
          return message(LOC.t10, 2000);
        }
      }
      if (entry) {
        if (
          c.innerContents &&
          !c.innerContents.classList.contains(`${$s1}loaded`)
        ) {
          this.removeEntry();
        }
        entry = this.addEntry(entry, c);
        if (!tmpElm && st.autosearch) this.requestEnd(c, true);
        else this.requestEnd(c);
      } else {
        FullFeed.state = '';
        message(LOC.t3);
        contentScriptInjection(`mobilize(${c.item.id});`);
      }
    }
    requestEnd(c, as, halt) {
      FullFeed.state = 'loaded';
      FullFeed.xhr.length = 0;
      window.setTimeout(() => (FullFeed.state = 'wait'), 1000);
      loadingStyle('remove', c.articleContainer);
      c.innerContents.classList.add(this.info.enc || document.characterSet);
      c.innerContents.classList.remove('entry-body-empty');
      c.innerContents.classList.add(`${$s1}loaded`);
      c.innerContents.classList.toggle(this.requestURL);
      const el = document.querySelector(
        `${currentEntry()} .${$s1}checked_icon`
      );
      FullFeed.checkNextPage(c.innerContents);
      if (
        c.innerContents.className.split(/\s+/).filter((i) => /^http/.test(i))
          .length > 1
      ) {
        if (FullFeed.nextPageLink) {
          if (as) message(LOC.t34, 3000);
          else message(LOC.t5);
        } else {
          if (as) message(LOC.t35, 3000);
          else message(LOC.t6);
          if (el instanceof HTMLElement) {
            el.classList.remove(`${$s1}checked_icon_next`);
            el.classList.remove(`${$s1}checked_icon_as_next`);
            if (as) el.classList.add(`${$s1}checked_icon_as_nonext`);
            else el.classList.add(`${$s1}checked_icon_nonext`);
            el.title = `Ctrl+${LOC.t40} : ${LOC.t39}`;
          }
        }
      } else {
        if (as) message(LOC.t51, 3000);
        else message(LOC.t2);
        if (el instanceof HTMLElement) {
          el.classList.remove(`${$s1}checked_icon_info`);
          el.classList.remove(`${$s1}checked_icon_noinfo`);
          if (FullFeed.nextPageLink) {
            if (as) el.classList.add(`${$s1}checked_icon_as_next`);
            else el.classList.add(`${$s1}checked_icon_next`);
            el.title = `${LOC.t40} : ${LOC.t41} / Ctrl+${LOC.t40} : ${LOC.t39}`;
            if (st.autopagerize) {
              window.setTimeout(() => FullFeed.checkScroll(), 2000);
            }
          } else {
            if (as) el.classList.add(`${$s1}checked_icon_as_nonext`);
            else el.classList.add(`${$s1}checked_icon_nonext`);
            el.title = `Ctrl+${LOC.t40} : ${LOC.t39}`;
          }
        }
      }
      if (halt) message(LOC.t61, 3000);
      try {
        /* @ts-expect-error */
        if (st.embeddedtweets && twttr?.widgets?.load) {
          /* @ts-expect-error */
          twttr.widgets.load(c.innerContents);
        }
      } catch (e) {
        log('requestEnd', e);
      }
      Object.keys(this).forEach((key) => {
        if (Object.hasOwn(this, key)) this[key] = undefined;
      });
    }
    requestError(e) {
      FullFeed.state = '';
      message(`Error: ${e}`, 5000, 'warning');
      loadingStyle('remove', this.itemInfo.articleContainer);
      this.itemInfo.innerContents.classList.add(`${$s1}error`);
    }
    removeEntry() {
      if (this?.itemInfo?.itemBody) {
        while (this.itemInfo.itemBody.firstChild) {
          this.itemInfo.itemBody.removeChild(this.itemInfo.itemBody.firstChild);
        }
      }
    }
    addEntry(entry, c) {
      const url = this.requestURL || c.itemURL,
        ic = c.innerContents.id ? $id(c.innerContents.id) : c.innerContents,
        div = document.createElement('div');
      if (ic?.hasChildNodes()) {
        div.className = `${$s1}pager`;
        const readingPageUrl = FullFeed.readingPageUrl ?? '',
          http = c.innerContents.className
            .split(/\s+/)
            .filter((i) => /^http/.test(i)),
          host =
            readingPageUrl.split('/')[2] !== url.split('/')[2]
              ? `<span class="${$s1}pager_differenthost">( ${
                  readingPageUrl.split('/')[2]
                } &rarr; ${url.split('/')[2]} )</span>`
              : '';
        div.innerHTML = `<hr />page: <a href="${url}" target="_blank">${
          http.length + 1
        }</a>${host}`;
        ic.appendChild(div);
      } else {
        div.className = `${$s1}entry_url`;
        div.innerHTML = `<a href="${url}" class="bluelink" target="_blank">${url}</a>`;
        try {
          if (ic) ic.parentNode.insertBefore(div, ic);
        } catch (er) {
          log('addEntry', er);
          message(`Error: ${er}`, 5000, 'warning');
        }
      }
      return entry.map((i) => {
        const pe = document.importNode(i, true);
        if (ic) ic.appendChild(pe);
        return pe;
      });
    }
    load(flag) {
      if (flag === 'search') this.request('HEAD', this.itemInfo);
      else this.request('GET', this.itemInfo);
    }
  }

  FullFeed.documentFilters = [
    (doc) => {
      const a = doc.getElementsByTagName('a');
      for (let i = 0, j = a.length; i < j; i++) {
        if (a[i]?.hasAttribute('href')) {
          a[i].setAttribute('target', '_blank');
          a[i].setAttribute('rel', 'noopener noreferrer');
        }
      }
    },
  ];

  const getActiveItem = () => {
    const item = {},
      exp = document.querySelector(`${currentEntry()} .article_title_link`);
    if (exp instanceof HTMLAnchorElement) {
      item.url =
        exp.href && /^(https?|ftp):\/\/.+$/.test(exp.href) ? exp.href : '';
      item.title = exp.textContent ? exp.textContent : '';
      item.id = exp.id ? exp.id.slice(exp.id.lastIndexOf('_') + 1) : '';
    }
    return item;
  };

  const getActiveFeed = () => {
    const eCurrent = document.querySelector(currentEntry()),
      feed = {};
    feed.url = '';
    feed.title = '';
    if (eCurrent?.id) {
      const eFeed =
          $id(
            `article_feed_info_link_${eCurrent.id.slice(
              eCurrent.id.lastIndexOf('_') + 1
            )}`
          ) ||
          eCurrent.getElementsByClassName('article_feed_title')[0] ||
          document.evaluate(
            '//div[@class="article_tile_footer_feed_title"]/a',
            eCurrent.cloneNode(true),
            null,
            9,
            null
          ).singleNodeValue,
        tree = $id('tree');
      if (eFeed) {
        if (eFeed.textContent) feed.title = eFeed.textContent;
      } else if (tree) {
        const tlf = tree.getElementsByClassName('selected')[0];
        if (tlf?.textContent) feed.title = tlf.textContent;
      }
    }
    if (feed.title) feed.title = feed.title.replace(/^\s*(.*?)\s*$/, '$1');
    return feed;
  };

  class GetCurrentItem {
    constructor() {
      this.item = getActiveItem();
      this.feed = getActiveFeed();
      this.itemURL = this.item.url;
      this.articleContainer = document.querySelector(currentEntry());
      this.innerContents = document.querySelector(
        `${currentEntry()} .article_content`
      );
      this.found = false;
      this.itemInfo = undefined;
    }
  }

  const launchFullFeed = (list, c, flag) => {
    if (typeof list.some !== 'function') return;
    FullFeed.state = 'launch';
    FullFeed.itemSiteInfo.length = 0;
    const type = ['^IND', '^SUB', '^GEN'];
    let bCache, bList;
    const check = (lis) => {
      lis.forEach((i) => {
        try {
          const reg = new RegExp(i.url);
          if (i.url?.length <= 12 || !/^\^?https?/i.test(i.url)) {
            if (new RegExp('^://', 'i').test(i.url)) i.url = `^https?${i.url}`;
            else if (new RegExp('^//', 'i').test(i.url)) {
              i.url = `^https?:${i.url}`;
            } else i.url = `^https?://${i.url}`;
          }
          if (reg.test(c.itemURL) && i.url.length > 12) {
            if (flag === 'cache') {
              if (
                FullFeed.userCacheList.some((u) => {
                  if (u === c.feed.url) return true;
                })
              ) {
                c.found = true;
                FullFeed.itemSiteInfo.push(i);
              }
            } else {
              c.found = true;
              FullFeed.itemSiteInfo.push(i);
            }
          }
        } catch (er) {
          log('launchFullFeed check', er, i.url);
        }
      });
    };
    check(list);
    if (/^next|^search/.test(flag)) {
      if (!c.found) {
        FullFeed.siteInfoAP.some((ctx) => {
          if (FullFeed.cacheAPInfo[ctx.url]) {
            check(FullFeed.cacheAPInfo[ctx.url].info);
            return c.found;
          }
        });
      }
      if (!c.found && FullFeed.nextPageLink) {
        /** @type {HTMLAnchorElement} */
        const nextPageLink = FullFeed.nextPageLink;
        check([
          {
            url: nextPageLink.href,
            xpath: '',
          },
        ]);
      }
    }
    FullFeed.nextPageLink = null;
    FullFeed.itemSiteInfo.sort((a, b) => {
      const reA = new RegExp(a.url),
        reB = new RegExp(b.url),
        a1 = reA.test(c.itemURL) ? reA.source.length : 0,
        b1 = reB.test(c.itemURL) ? reB.source.length : 0,
        a2 = reA.test(c.feed.url) ? reA.source.length : 0,
        b2 = reB.test(c.feed.url) ? reB.source.length : 0;
      if (a.url.search(/\\w|\.\+|\.\*|\[\^\.?\/?\]\+/) !== -1) return 1;
      else if (b.url.search(/\\w|\.\+|\.\*|\[\^\.?\/?\]\+/) !== -1) return -1;
      return (b1 >= b2 ? b1 : b2) - (a1 >= a2 ? a1 : a2);
    });
    FullFeed.itemSiteInfo.sort((a, b) => {
      let n1 = 0,
        n2 = 0;
      type.forEach((d, i) => {
        if (new RegExp(d).test(a.type)) n1 = i;
        if (new RegExp(d).test(b.type)) n2 = i;
      });
      return n1 - n2;
    });
    if (flag === 'full') {
      if (!bCache && FullFeed.itemSiteInfo.length > 0) {
        FullFeed.userCache.some((u) => {
          if (u === FullFeed.itemSiteInfo[0]) {
            bCache = true;
            return true;
          }
        });
        FullFeed.userCacheList.some((u) => {
          if (u === c.feed.url) {
            bList = true;
            return true;
          }
        });
        if (!bCache) {
          delete FullFeed.itemSiteInfo[0].base;
          delete FullFeed.itemSiteInfo[0].microformats;
          delete FullFeed.itemSiteInfo[0].priority;
          FullFeed.userCache.push(FullFeed.itemSiteInfo[0]);
          try {
            localStorage.setItem(
              `${$s3}userCache`,
              JSON.stringify(FullFeed.userCache)
            );
          } catch (er2) {
            log('launchFullFeed 1', er2);
          }
        }
        if (!bList) {
          FullFeed.userCacheList.push(c.feed.url);
          try {
            localStorage.setItem(
              `${$s3}userCacheList`,
              JSON.stringify(FullFeed.userCacheList)
            );
          } catch (er3) {
            log('launchFullFeed 2', er3);
          }
        }
      }
    }
    if (c.found && FullFeed.itemSiteInfo.length > 0) {
      let data, bool, info;
      if (
        FullFeed.itemSiteInfo.some((a) => {
          data = a;
          bool = true;
          st.disableitem.forEach((b) => {
            if (a.url === b) bool = false;
          });
          if (bool) return true;
        })
      ) {
        info = data;
      } else info = FullFeed.itemSiteInfo[0];
      const fullfeed = new FullFeed(info, c, flag);
      fullfeed.load(flag);
    } else FullFeed.state = '';
  };

  const initFullFeed = (scroll) => {
    const c = new GetCurrentItem();
    if (
      /^https?:\/\/(?:www\.)?inoreader\.com\/?$|^javascript:|\.pdf$/i.test(
        c.itemURL
      )
    ) {
      return;
    }
    if (FullFeed.state && !/^loaded$|^wait$/.test(FullFeed.state)) {
      for (let x1 = 0, x2 = FullFeed.xhr.length; x1 < x2; x1++) {
        if (FullFeed.xhr[x1]) FullFeed.xhr[x1].abort();
      }
      FullFeed.xhr.length = 0;
      FullFeed.state = '';
      message(LOC.t82, 3000, 'warning');
      if (c.itemInfo) {
        loadingStyle('remove', c.itemInfo.articleContainer);
        c.itemInfo.innerContents.classList.add(`${$s1}error`);
      }
      return;
    }
    if (
      (FullFeed.state && !/^loaded$|^wait$/.test(FullFeed.state)) ||
      !c.item.title ||
      !c.item.url ||
      !c.innerContents
    ) {
      return;
    }
    message(LOC.t54, -1);
    if (st.notread) {
      const re = new RegExp(st.notread);
      if (
        re.test(c.item.title) ||
        re.test(c.item.url) ||
        re.test(c.feed.title)
      ) {
        if (st.openitem) {
          loadingStyle('open', c.articleContainer);
          GM_openInTab(c.itemURL, true);
          window.setTimeout(
            () => loadingStyle('remove', c.articleContainer),
            1000
          );
          return message(LOC.t49, 2000);
        }
        return message(LOC.t8);
      }
    }
    const launch = () => {
      if (c?.innerContents?.classList.contains(`${$s1}loaded`)) {
        if (st.autopagerize) {
          FullFeed.checkNextPage(c.innerContents);
          if (FullFeed.nextPageLink) {
            /** @type {HTMLAnchorElement} */
            const nextPageLink = FullFeed.nextPageLink;
            c.itemURL = nextPageLink.href;
            launchFullFeed(FullFeed.userSiteInfo, c, 'set');
            if (!c.found) launchFullFeed(FullFeed.userCache, c, 'cache');
            if (!c.found) {
              FullFeed.siteInfo.some((ctx) => {
                if (FullFeed.cacheInfo[ctx.url]) {
                  launchFullFeed(FullFeed.cacheInfo[ctx.url].info, c, 'next');
                  return c.found;
                }
              });
            }
            if (!c.found) launchFullFeed([], c, 'search');
            loadingStyle('add', c.articleContainer);
            return message(LOC.t4, -1);
          } else if (!scroll) {
            if (
              c.innerContents.className
                .split(/\s+/)
                .filter((i) => /^http/.test(i)).length > 1
            ) {
              return message(LOC.t7);
            }
            return message(LOC.t9);
          }
        } else if (!scroll) return message(LOC.t9);
      } else {
        if (scroll) return;
        launchFullFeed(FullFeed.userSiteInfo, c, 'set');
        if (!c.found) launchFullFeed(FullFeed.userCache, c, 'cache');
        if (
          !c.found &&
          !FullFeed.siteInfo.some((ctx) => {
            if (FullFeed.cacheInfo[ctx.url]) {
              launchFullFeed(FullFeed.cacheInfo[ctx.url].info, c, 'full');
              return c.found;
            }
          })
        ) {
          const fullfeed = new FullFeed({}, c, 'search');
          fullfeed.load('search');
        }
      }
    };

    const checkShortUrl = (resolvedUrls = new Set()) => {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'HEAD',
          url: c.itemURL,
          onload: (res) => {
            if (res.status === 200 && res.finalUrl) {
              if (/^https?:\/\/t.co\/.+/.test(res.finalUrl)) {
                if (!resolvedUrls.has(res.finalUrl)) {
                  resolvedUrls.add(res.finalUrl);
                  checkShortUrl(resolvedUrls).then((url) => resolve(url));
                } else {
                  resolve(c.itemURL);
                }
              } else {
                c.itemURL = c.feed.url = res.finalUrl;
                resolve(res.finalUrl);
              }
            } else if (
              ((res.status >= 301 && res.status <= 303) ||
                res.status === 307) &&
              res.finalUrl
            ) {
              if (!resolvedUrls.has(res.finalUrl)) {
                resolvedUrls.add(res.finalUrl);
                checkShortUrl(resolvedUrls).then((url) => resolve(url));
              } else {
                resolve(c.itemURL);
              }
            } else {
              resolve(c.itemURL);
            }
          },
        });
      });
    };

    if (!st.replacefullfeedurl) {
      launch();
      return;
    }
    const rep = st.replacefullfeedurl.replace(/\s+/g, ' ').split(' ');
    if (rep.length >= 2) {
      const excludeUrl = (e) => {
        e.some((a) => {
          if (
            a.href.split('/')[2].indexOf('xn--') === -1 &&
            /^https?:\/\/.+/.test(a.textContent)
          ) {
            c.itemURL = c.feed.url = a.href;
          }
        });
      };
      for (let i = 0, j = rep.length - 1; i < j; i = i + 2) {
        if (rep[i] && new RegExp(rep[i]).test(c.itemURL)) {
          if (rep[i + 1] && /^http/.test(rep[i + 1])) {
            c.itemURL = c.itemURL.replace(new RegExp(rep[i]), rep[i + 1]);
            c.feed.url = c.itemURL;
          } else if (rep[i + 1] === 'Link') {
            try {
              const u = document.querySelectorAll(
                `${currentEntry()} .article_content a`
              );
              if (u) excludeUrl(u);
            } catch (er) {
              log('excludeUrl', er);
            }
          }
          break;
        }
      }
    } else launch();
    checkShortUrl().then((url) => {
      c.itemURL = url;
      launch();
    });
  };

  const loadingStyle = (flag, elm) => {
    if (!elm) return;
    const s1 = `${$s1}loading`,
      s2 = `${$s1}opened`;
    if (flag === 'add') elm.classList.add(s1);
    else if (flag === 'open') elm.classList.add(s2);
    else if (flag === 'remove') {
      elm.classList.remove(s1);
      elm.classList.remove(s2);
    }
  };

  const createMessageBox = () => {
    const div = document.createElement('div');
    div.id = `${$s1}message`;
    div.className = `ui-state-highlight ${$s1}hidden`;
    div.innerHTML = '';
    document.body.appendChild(div);
  };

  const currentEntry = () => {
    if ($id('article_dialog')) {
      return '#article_dialog > .article_full_contents';
    }
    const twc = $id('three_way_contents'),
      rp = $id('reader_pane');
    if (
      twc?.style.display !== 'none' &&
      rp?.getElementsByClassName('article_current article_current_3way')[0]
    ) {
      return '#three_way_contents > .article_full_contents:last-child';
    }
    if ($id('subscriptions_articles')) {
      return '#subscriptions_articles > .article_current';
    }
    return '#reader_pane .article_current';
  };

  const toggleSettingsMode = () => {
    const s2 = $id(`${$s2}`),
      adv = s2?.querySelectorAll(`.${$s2}-advance`),
      sinuff = $ids('siteinfo_navi_uff'),
      sinuap = $ids('siteinfo_navi_uap');
    if (adv) {
      for (let i = 0, j = adv.length; i < j; i++) {
        if (adv[i]) adv[i].classList.toggle(`${$s1}hidden`);
      }
    }
    if (
      st.mode === 'simple' &&
      !sinuff?.classList.contains('select') &&
      !sinuap?.classList.contains('select')
    ) {
      const si = $ids('siteinfo'),
        el1 = si?.getElementsByTagName('fieldset'),
        sifuff = $ids('siteinfo_f_uff');
      if (el1) {
        for (let i1 = 0, j1 = el1.length; i1 < j1; i1++) {
          el1[i1].classList.remove('select');
        }
      }
      const el2 = document.getElementsByClassName(`${$s2}-siteinfo_navi`);
      for (let i2 = 0, j2 = el2.length; i2 < j2; i2++) {
        el2[i2].classList.remove('select');
      }
      sinuff?.classList.add('select');
      sifuff?.classList.add('select');
    }
  };

  const loadTwitterWidgetsScript = () => {
    if (st.embeddedtweets) {
      const scripts = document.head.querySelectorAll(
        'script[src="https://platform.twitter.com/widgets.js"]'
      );
      if (scripts.length > 0) return;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://platform.twitter.com/widgets.js';
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  };

  const exportSettings = async () => {
    const settings = localStorage.getItem(`${$s3}settings`);
    if (settings && window.confirm(LOC.t66)) {
      try {
        await navigator.clipboard.writeText(settings);
        message(LOC.t67, 3000);
      } catch (e) {
        log('exportSettings', e);
        const eTemp = document.createElement('div'),
          tta = $id(`${$s1}temp-textarea`);
        eTemp.id = `${$s1}temp`;
        eTemp.innerHTML = `
<div id="${$s1}temp-bar">
  <div id="${$s1}temp-bar_title">Export Data</div>
  <div id="${$s1}temp-bar_button">
    <button id="${$s1}temp-close" type="button">Close</button>
  </div>
</div>
<div id="${$s1}temp-body">
  <textarea id="${$s1}temp-textarea">
</div>
        `;
        document.body.appendChild(eTemp);
        $id(`${$s1}temp-close`)?.addEventListener(
          'click',
          () => {
            const t = $id(`${$s1}temp`);
            if (t) document.body.removeChild(t);
          },
          false
        );
        if (tta) {
          tta.textContent = settings;
          document.getSelection()?.selectAllChildren(tta);
        }
        if (document.execCommand('copy')) {
          document.body.removeChild(eTemp);
          message(LOC.t67, 3000);
        } else {
          eTemp.style.visibility = 'visible';
          message(LOC.t68, 3000);
        }
      }
    }
  };

  const addStyle = () => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
  };

  const init = () => {
    let exSpaceKey;
    const exKey = () => {
      const space = $id('irkc_key-space');
      if (space instanceof HTMLInputElement) {
        exSpaceKey = space.value;
      }
    };
    const observer = new MutationObserver(() => {
      if ($id('irkc_setting')) {
        observer.disconnect();
        $id('irkc_ok')?.addEventListener(
          'click',
          (e) => {
            exKey();
            e.stopPropagation();
          },
          false
        );
        exKey();
      }
    });
    const addEvent = (ele) => {
      document.addEventListener(
        'keydown',
        (e) => {
          if (
            FullFeed.state &&
            !/^loaded$|^wait$/.test(FullFeed.state) &&
            e.target instanceof HTMLElement &&
            !/^input|^textarea/i.test(e.target.tagName) &&
            ((exSpaceKey !== '&' && e.code === 'Space') ||
              (exSpaceKey && e.key === exSpaceKey))
          ) {
            const ce = document.querySelector(currentEntry());
            if (ce) {
              const rect = ce.getBoundingClientRect(),
                distance = rect.bottom - window.innerHeight;
              if (distance < st.apheight) {
                e.preventDefault();
                e.stopPropagation();
              }
            }
          }
        },
        true
      );
      document.addEventListener(
        'keyup',
        (e) => {
          const basekey = st.basekey,
            el1 = $ids('general_key');
          if (
            e.target instanceof HTMLElement &&
            e.target.id === `${$s2}-general_key`
          ) {
            const el2 = $ids('general_keydesc');
            const cha = e.key ? e.key.toUpperCase() : '';
            if (/^[A-Z]$/.test(cha)) {
              if (el1 instanceof HTMLInputElement) el1.value = cha;
              if (el2) el2.textContent = LOC.t24;
            }
          } else if (
            e.key.toUpperCase() === basekey &&
            e.target instanceof HTMLElement &&
            !/^input|^textarea/i.test(e.target.tagName)
          ) {
            if (e.altKey && e.ctrlKey && e.shiftKey) {
              if (window.confirm(LOC.t15)) FullFeed.resetCache();
            } else if (e.ctrlKey && e.shiftKey) {
              const el3 = document.querySelector(currentEntry());
              if (
                el3?.classList.contains('article_full_contents') ||
                (el3?.classList.contains('ar') &&
                  el3?.classList.contains('article_current'))
              ) {
                FullFeed.viewSettings('autoload');
              } else FullFeed.viewSettings();
            } else if (e.ctrlKey) {
              if (st.autoload === 0) st.autoload = 1;
              else if (st.autoload === 1) st.autoload = 2;
              else if (st.autoload === 2) st.autoload = 3;
              else st.autoload = 0;
              FullFeed.saveSettings();
              message(
                `Auto Load : ${
                  st.autoload === 0
                    ? LOC.t36
                    : st.autoload === 1
                    ? LOC.t77
                    : st.autoload === 2
                    ? LOC.t45
                    : LOC.t46
                }`
              );
            } else if (e.shiftKey) {
              st.autopagerize = !st.autopagerize;
              FullFeed.saveSettings();
              message(
                `AutoPagerize : ${
                  st.autopagerize
                    ? `<span class="${$s1}ap_on">ON</span>`
                    : `<span class="${$s1}ap_off">OFF</span>`
                }`
              );
            } else initFullFeed();
          }
          FullFeed.checkRegister();
        },
        false
      );
      document.addEventListener(
        'click',
        (e) => {
          if (e.button >= 2) return;
          const tId = e.target instanceof HTMLElement ? e.target.id : '';
          if (
            e.button === 0 &&
            e.target instanceof HTMLElement &&
            tId &&
            /^irff_s-/.test(tId)
          ) {
            const settings = $id(`${$s2}`),
              alFeedTitle = $ids('autoload_allowlist_feed_title'),
              alFeedList = $ids('autoload_allowlist_feed_list'),
              alArticleTitle = $ids('autoload_allowlist_article_title'),
              alArticleList = $ids('autoload_allowlist_article_list'),
              dlFeedTitle = $ids('autoload_denylist_feed_title'),
              dlFeedList = $ids('autoload_denylist_feed_list'),
              dlArticleTitle = $ids('autoload_denylist_article_title'),
              dlArticleList = $ids('autoload_denylist_article_list');
            if (tId === `${$s2}-menu`) {
              FullFeed.viewSettings();
            } else if (tId === `${$s2}-menu2` || tId === `${$s2}-menu2child`) {
              $id('settings-button')?.blur();
              FullFeed.viewSettings();
            } else if (/^irff_s-tab_/.test(tId)) {
              const tab = $ids('tab')?.children,
                list = $ids('list')?.children;
              if (tab && list) {
                for (let i = 0; i < tab.length; i++) {
                  const eList = list[i];
                  if (tab[i].classList.contains('select')) {
                    tab[i].classList.remove('select');
                    if (eList instanceof HTMLElement) {
                      eList.style.display = 'none';
                    }
                  }
                  if (tab[i].textContent === e.target.textContent) {
                    tab[i].classList.add('select');
                    if (eList instanceof HTMLElement) {
                      eList.style.display = 'block';
                    }
                  }
                }
              }
            } else if (e.target.classList.contains(`${$s2}-siteinfo_navi`)) {
              const el3 = $ids('siteinfo')?.getElementsByTagName('fieldset');
              if (el3) {
                for (let i1 = 0, j1 = el3.length; i1 < j1; i1++) {
                  el3[i1].classList.remove('select');
                }
              }
              const el4 = document.getElementsByClassName(
                `${$s2}-siteinfo_navi`
              );
              for (let i2 = 0, j2 = el4.length; i2 < j2; i2++) {
                el4[i2].classList.remove('select');
              }
              e.target.classList.add('select');
              $ids(
                `siteinfo_f${tId.slice(tId.lastIndexOf('_'))}`
              )?.classList.add('select');
            } else if (tId === `${$s2}-siteinfo_uff_add`) {
              const uff = $ids('siteinfo_uff'),
                uffurl = $ids('siteinfo_uff_url'),
                uffxpath = $ids('siteinfo_uff_xpath'),
                ufftype = $ids('siteinfo_uff_type'),
                uffenc = $ids('siteinfo_uff_enc'),
                fTa =
                  uff instanceof HTMLTextAreaElement
                    ? uff.value
                        .trim()
                        .replace(/(.+)\}\s*,?\s*\n\s*\]\s*$/, '$1}\n]')
                    : '',
                fUrl =
                  uffurl instanceof HTMLInputElement
                    ? uffurl.value.trim().replace(/"/g, "'")
                    : '',
                fXpath =
                  uffxpath instanceof HTMLInputElement
                    ? uffxpath.value.trim().replace(/"/g, "'")
                    : '',
                fType =
                  ufftype instanceof HTMLSelectElement
                    ? ufftype.value.trim().replace(/"/g, "'")
                    : '',
                fEnc =
                  uffenc instanceof HTMLInputElement
                    ? uffenc.value.trim().replace(/"/g, "'")
                    : '';
              let fForm = `\n  {\n    "url":"${fUrl}",\n    "xpath":"${fXpath}",\n    "type":"${fType}"`;
              if (fEnc) fForm += `,\n    "enc":"${fEnc}"`;
              fForm += '\n  }';
              if (uff instanceof HTMLTextAreaElement) {
                if (!fTa) uff.value = `[${fForm}\n]`;
                else if (fTa.slice(-3) === '}\n]') {
                  uff.value = `${fTa.slice(0, -2)},${fForm}\n]`;
                }
                uff.scrollTop = uff?.scrollHeight;
              }
            } else if (tId === `${$s2}-siteinfo_uap_add`) {
              const uap = $ids('siteinfo_uap'),
                uapurl = $ids('siteinfo_uap_url'),
                uapnext = $ids('siteinfo_uap_nextlink'),
                uappage = $ids('siteinfo_uap_pageelement'),
                aTa =
                  uap instanceof HTMLTextAreaElement
                    ? uap.value
                        .trim()
                        .replace(/(.+)\}\s*,?\s*\n\s*\]\s*$/, '$1}\n]')
                    : '',
                aUrl =
                  uapurl instanceof HTMLInputElement
                    ? uapurl.value.trim().replace(/"/g, "'")
                    : '',
                aNext =
                  uapnext instanceof HTMLInputElement
                    ? uapnext.value.trim().replace(/"/g, "'")
                    : '',
                aPage =
                  uappage instanceof HTMLInputElement
                    ? uappage.value.trim().replace(/"/g, "'")
                    : '',
                aForm = `\n  {\n    "url":"${aUrl}",\n    "nextLink":"${aNext}",\n    "pageElement":"${aPage}"\n  }`;
              if (uap instanceof HTMLTextAreaElement) {
                if (!aTa) uap.value = `[${aForm}\n]`;
                else if (aTa.slice(-3) === '}\n]') {
                  uap.value = `${aTa.slice(0, -2)},${aForm}\n]`;
                }
                uap.scrollTop = uap?.scrollHeight;
              }
            } else if (e.target?.classList?.contains(`${$s2}-autoload_navi`)) {
              const el5 = $ids('autoload')?.getElementsByTagName('fieldset');
              if (el5) {
                for (let i3 = 0, j3 = el5.length; i3 < j3; i3++) {
                  el5[i3].classList.remove('select');
                }
              }
              const el6 = document.getElementsByClassName(
                `${$s2}-autoload_navi`
              );
              for (let i4 = 0, j4 = el6.length; i4 < j4; i4++) {
                el6[i4].classList.remove('select');
              }
              e.target.classList.add('select');
              $ids(
                `autoload_f${tId.slice(tId.lastIndexOf('_'))}`
              )?.classList.add('select');
            } else if (tId === `${$s2}-autoload_allowlist_feed_add`) {
              if (
                alFeedTitle instanceof HTMLInputElement &&
                alFeedTitle.value &&
                alFeedList instanceof HTMLTextAreaElement
              ) {
                if (alFeedList.value) {
                  alFeedList.value += `\n${alFeedTitle.value}`;
                } else alFeedList.value = alFeedTitle.value;
                alFeedTitle.value = '';
              }
            } else if (tId === `${$s2}-autoload_allowlist_article_add`) {
              if (
                alArticleTitle instanceof HTMLInputElement &&
                alArticleTitle.value &&
                alArticleList instanceof HTMLTextAreaElement
              ) {
                if (alArticleList.value) {
                  alArticleList.value += `\n${alArticleTitle.value}`;
                } else alArticleList.value = alArticleTitle.value;
                alArticleTitle.value = '';
              }
            } else if (tId === `${$s2}-autoload_denylist_feed_add`) {
              if (
                dlFeedTitle instanceof HTMLInputElement &&
                dlFeedTitle.value &&
                dlFeedList instanceof HTMLTextAreaElement
              ) {
                if (dlFeedList.value) {
                  dlFeedList.value += `\n${dlFeedTitle.value}`;
                } else dlFeedList.value = dlFeedTitle.value;
                dlFeedTitle.value = '';
              }
            } else if (tId === `${$s2}-autoload_denylist_article_add`) {
              if (
                dlArticleTitle instanceof HTMLInputElement &&
                dlArticleTitle?.value &&
                dlArticleList instanceof HTMLTextAreaElement
              ) {
                if (dlArticleList.value) {
                  dlArticleList.value += `\n${dlArticleTitle.value}`;
                } else dlArticleList.value = dlArticleTitle.value;
                dlArticleTitle.value = '';
              }
            } else if (tId === `${$s2}-security_iframetag`) {
              const saif = $ids('security_allowiframeurl');
              if (saif instanceof HTMLInputElement) {
                const sit = $ids('security_iframetag');
                if (sit instanceof HTMLInputElement && sit.checked) {
                  saif.disabled = false;
                  if (saif.parentNode instanceof HTMLElement) {
                    saif.parentNode.style.color = 'inherit';
                  }
                } else {
                  saif.disabled = true;
                  if (saif.parentNode instanceof HTMLElement) {
                    saif.parentNode.style.color = 'gray';
                  }
                }
              }
            } else if (tId === `${$s2}-social_socialicon`) {
              ['hatena'].forEach((a) => {
                const social = $ids(`social_${a}`);
                if (social instanceof HTMLInputElement) {
                  const ssi = $ids('social_socialicon');
                  if (ssi instanceof HTMLInputElement && ssi.checked) {
                    social.disabled = false;
                    if (social.parentNode instanceof HTMLElement) {
                      social.parentNode.style.color = 'inherit';
                    }
                  } else {
                    social.disabled = true;
                    if (social.parentNode instanceof HTMLElement) {
                      social.parentNode.style.color = 'gray';
                    }
                  }
                }
              });
            } else if (tId === `${$s2}-etc_settingsexport`) {
              exportSettings();
            } else if (tId === `${$s2}-etc_settingsimport`) {
              const imp = window.prompt(LOC.t69);
              try {
                if (imp && imp.length > 100 && JSON.parse(imp)) {
                  FullFeed.loadSettings(JSON.parse(imp));
                  FullFeed.saveSettings();
                  if (settings) settings.style.display = 'none';
                  message(LOC.t70, 3000);
                }
              } catch (er1) {
                log('init 1', er1);
                message(LOC.t71, 3000, 'warning');
              }
            } else if (tId === `${$s2}-etc_settingsreset`) {
              if (window.confirm(LOC.t72)) {
                FullFeed.loadSettings('reset');
                FullFeed.saveSettings();
                if (settings) settings.style.display = 'none';
                message(LOC.t73, 3000);
              }
            } else if (tId === `${$s2}-etc_cachereset`) {
              if (window.confirm(LOC.t15)) FullFeed.resetCache();
            } else if (tId === `${$s2}-etc_cachedelete`) {
              FullFeed.removeCache();
            } else if (tId === `${$s2}-ok`) {
              const key = $ids('general_key'),
                hei = $ids('general_apheight'),
                v = key instanceof HTMLInputElement ? key.value : 'Z',
                h = hei instanceof HTMLInputElement ? Number(hei.value) : 500,
                ga = $ids('general_ap'),
                gas = $ids('general_autosearch'),
                gcd = $ids('general_cantdisplay'),
                getw = $ids('general_embeddedtweets'),
                gnr = $ids('general_notread'),
                goi = $ids('general_openitem');
              let problem = false;
              if (v && /^[A-Z]$/.test(v)) {
                st.basekey = v;
              } else if (key instanceof HTMLInputElement) {
                key.value = st.basekey;
              }
              if (ga instanceof HTMLInputElement) {
                st.autopagerize = ga.checked;
              }
              if (h && !isNaN(h)) {
                st.apheight = h < 200 ? 200 : h > 2000 ? 2000 : h;
              }
              if (gas instanceof HTMLInputElement) {
                st.autosearch = gas.checked;
              }
              if (gcd instanceof HTMLSelectElement) {
                st.cantdisplay = gcd.selectedIndex;
              }
              if (getw instanceof HTMLInputElement) {
                st.embeddedtweets = getw.checked;
              }
              if (gnr instanceof HTMLInputElement) {
                st.notread = gnr.value;
              }
              if (goi instanceof HTMLInputElement) {
                st.openitem = goi.checked;
              }
              const rep = (str) =>
                str
                  .replace(/^(\s*\{)/, '[$1')
                  .replace(/(\}),?(\s*)$/, '$1$2]')
                  .replace(/\\\\/g, '\\')
                  .replace(/\\/g, '\\\\')
                  .replace(/\\\\\/\\\\\//g, '\\/\\/')
                  .replace(/"/g, "'")
                  .replace(/(\{\s*|:\s*|'\s*,\s*|\}\s*,\s*)'/g, '$1"')
                  .replace(/'(\s*:|\s*,\s*"|\s*,?\s*\})/g, '"$1')
                  .replace(/("\s*),(\s*\})/g, '$1$2')
                  .replace(/\}(\s*)\{/g, '},$1{')
                  .replace(/\}\s*,?\s*\n\s*\]\s*$/, '}\n]')
                  .trim();
              const siff = $ids('siteinfo_ff'),
                siap = $ids('siteinfo_ap'),
                siuff = $ids('siteinfo_uff'),
                siuap = $ids('siteinfo_uap'),
                sidu = $ids('siteinfo_disableitem');
              if (
                siff instanceof HTMLTextAreaElement &&
                siap instanceof HTMLTextAreaElement &&
                siuff instanceof HTMLTextAreaElement &&
                siuap instanceof HTMLTextAreaElement &&
                sidu instanceof HTMLTextAreaElement
              ) {
                if (!siff.value) {
                  siff.value =
                    '[{"format": "JSON", "url": "http://wedata.net/databases/LDRFullFeed/items.json"}]';
                }
                if (!siap.value) {
                  siap.value =
                    '[{"format": "JSON", "url": "http://wedata.net/databases/AutoPagerize/items.json"}]';
                }
                if (!siuff.value) {
                  siuff.value =
                    '[{"url": "", "xpath": "", "type": "", "enc": ""}]';
                }
                if (!siuap.value) {
                  siuap.value =
                    '[{"url": "", "nextLink": "", "pageElement": ""}]';
                }
                try {
                  FullFeed.siteInfo = JSON.parse(rep(siff?.value));
                  st.siteinfo = JSON.stringify(FullFeed.siteInfo);
                  if (siff.parentNode instanceof HTMLElement) {
                    siff.parentNode.style.backgroundColor = 'unset';
                  }
                } catch (er2) {
                  log('init 2', er2);
                  problem = true;
                  if (siff.parentNode instanceof HTMLElement) {
                    siff.parentNode.style.backgroundColor = '#FCC';
                  }
                }
                try {
                  FullFeed.siteInfoAP = JSON.parse(rep(siap?.value));
                  st.siteinfoap = JSON.stringify(FullFeed.siteInfoAP);
                  if (siap.parentNode instanceof HTMLElement) {
                    siap.parentNode.style.backgroundColor = 'unset';
                  }
                } catch (er3) {
                  log('init 3', er3);
                  problem = true;
                  if (siap.parentNode instanceof HTMLElement) {
                    siap.parentNode.style.backgroundColor = '#FCC';
                  }
                }
                try {
                  FullFeed.userSiteInfo = JSON.parse(rep(siuff?.value));
                  st.usersiteinfo = JSON.stringify(FullFeed.userSiteInfo);
                  if (siuff.parentNode instanceof HTMLElement) {
                    siuff.parentNode.style.backgroundColor = 'unset';
                  }
                } catch (er4) {
                  log('init 4', er4);
                  problem = true;
                  if (siuff.parentNode instanceof HTMLElement) {
                    siuff.parentNode.style.backgroundColor = '#FCC';
                  }
                }
                try {
                  FullFeed.userSiteInfoAP = JSON.parse(rep(siuap?.value));
                  st.usersiteinfoap = JSON.stringify(FullFeed.userSiteInfoAP);
                  if (siuap.parentNode instanceof HTMLElement) {
                    siuap.parentNode.style.backgroundColor = 'unset';
                  }
                } catch (er5) {
                  log('init 5', er5);
                  problem = true;
                  if (siuap.parentNode instanceof HTMLElement) {
                    siuap.parentNode.style.backgroundColor = '#FCC';
                  }
                }
                if (sidu) {
                  st.disableitem = sidu.value.split('\n').filter((k) => {
                    if (k) return k;
                  });
                }
              }
              const alm = $ids('autoload_mode');
              st.autoload =
                alm instanceof HTMLSelectElement ? alm.selectedIndex : -1;
              if (alFeedList instanceof HTMLTextAreaElement) {
                st.autoloadfeed = alFeedList.value.split('\n').filter((k) => {
                  if (k) return k;
                });
              }
              if (alArticleList instanceof HTMLTextAreaElement) {
                st.autoloadarticle = alArticleList.value
                  .split('\n')
                  .filter((k) => {
                    if (k) return k;
                  });
              }
              if (dlFeedList instanceof HTMLTextAreaElement) {
                st.notloadfeed = dlFeedList.value.split('\n').filter((k) => {
                  if (k) return k;
                });
              }
              if (dlArticleList instanceof HTMLTextAreaElement) {
                st.notloadarticle = dlArticleList.value
                  .split('\n')
                  .filter((k) => {
                    if (k) return k;
                  });
              }
              if (alFeedTitle instanceof HTMLInputElement) {
                alFeedTitle.value = '';
              }
              if (alArticleTitle instanceof HTMLInputElement) {
                alArticleTitle.value = '';
              }
              if (dlFeedTitle instanceof HTMLInputElement) {
                dlFeedTitle.value = '';
              }
              if (dlArticleTitle instanceof HTMLInputElement) {
                dlArticleTitle.value = '';
              }
              const snt = $ids('security_noscripttag'),
                sit = $ids('security_iframetag'),
                saiu = $ids('security_allowiframeurl'),
                sdnu = $ids('security_denynexturl'),
                sanu = $ids('security_allownexturl'),
                ssi = $ids('social_socialicon'),
                sh = $ids('social_hatena');
              if (snt instanceof HTMLInputElement) {
                st.noscripttag = snt.checked;
              }
              if (sit instanceof HTMLInputElement) {
                st.iframetag = sit.checked;
              }
              if (saiu instanceof HTMLInputElement) {
                st.allowiframeurl = saiu.value;
              }
              if (sdnu instanceof HTMLInputElement) {
                st.denynexturl = sdnu.value;
              }
              if (sanu instanceof HTMLInputElement) {
                st.allownexturl = sanu.value;
              }
              if (ssi instanceof HTMLInputElement) {
                st.socialicon = ssi.checked;
              }
              if (sh instanceof HTMLInputElement) {
                st.socialhatena = sh.checked;
              }
              const lla = $ids('etc_lazyloadattr'),
                et = $ids('etc_timeout'),
                erffu = $ids('etc_replacefullfeedurl'),
                ellu = $ids('etc_lazyloadurl'),
                edl = $ids('etc_debuglog'),
                ms = $ids('etc_mode-simple'),
                ma = $ids('etc_mode-advance');
              if (ms instanceof HTMLInputElement && ms.checked) {
                st.mode = 'simple';
              } else if (ma instanceof HTMLInputElement && ma.checked) {
                st.mode = 'advance';
              }
              if (lla instanceof HTMLInputElement) {
                if (lla.value) {
                  lla.value = lla.value.trim().replace(/^(.+),+$/, '$1');
                } else {
                  lla.value =
                    '"ajax","data-lazy-src","data-original","data-src"';
                }
              }
              if (et instanceof HTMLInputElement) {
                st.timeout = et.value;
              }
              if (erffu instanceof HTMLInputElement) {
                st.replacefullfeedurl = erffu.value;
              }
              if (ellu instanceof HTMLInputElement) {
                st.lazyloadurl = ellu.value;
              }
              if (lla instanceof HTMLInputElement) {
                st.lazyloadattr = lla.value;
              }
              if (edl instanceof HTMLInputElement) {
                st.debuglog = edl.checked;
                FullFeed.debugLog = edl.checked;
              }
              if (!problem) {
                $ids('ok')?.blur();
                if (settings) settings.style.display = 'none';
                FullFeed.saveSettings();
                loadTwitterWidgetsScript();
              }
            } else if (tId === `${$s2}-cancel`) {
              $ids('cancel')?.blur();
              if (settings) settings.style.display = 'none';
            }
          } else if (
            e.target instanceof HTMLElement &&
            e.target?.classList.contains(`${$s1}checked_icon`)
          ) {
            if ((e.button === 0 && e.ctrlKey) || e.button === 1) {
              FullFeed.viewSettings('autoload', e.target);
            } else if (e.button === 0) initFullFeed();
          } else if (
            e.button === 0 &&
            e.target instanceof HTMLInputElement &&
            e.target.parentNode?.parentNode instanceof HTMLElement &&
            e.target.parentNode.parentNode.id ===
              `${$s2}-siteinfo_disableitemlist` &&
            e.target.nodeName === 'INPUT'
          ) {
            const di = $ids('siteinfo_disableitem');
            if (di instanceof HTMLTextAreaElement) {
              let temp = di.value.split('\n');
              if (e.target.checked) {
                const chkbox = getElementsByXPath(
                  '//input',
                  e.target.parentNode.parentNode.cloneNode(true)
                );
                if (
                  chkbox &&
                  !chkbox.some((a) => {
                    if (!a.checked) return true;
                  })
                ) {
                  e.target.checked = false;
                  return;
                }
                if (e.target.nextSibling?.textContent) {
                  temp.push(e.target.nextSibling.textContent);
                }
              } else {
                const next = e.target.nextSibling;
                if (next) temp = temp.filter((a) => a !== next.textContent);
              }
              temp = temp.filter((a) => !/^\s*$/.test(a));
              di.value = temp.join('\n');
            }
          } else if (e.button === 0) FullFeed.checkRegister();
        },
        true
      );
      $ids('titlebar')?.addEventListener(
        'dblclick',
        (e) => {
          if (e.target instanceof HTMLDivElement) {
            $ids('tab')?.classList.toggle(`${$s2}-hide`);
            $ids('list')?.classList.toggle(`${$s2}-hide`);
            $ids('titlebar_button')?.classList.toggle(`${$s2}-hide`);
          }
        },
        false
      );
      ele?.addEventListener(
        'scroll',
        (e) => {
          const rp = $id('reader_pane'),
            s = 'reader_pane_view_style_';
          let eAc, eFl;
          if (document.getElementsByClassName(`${s}0`)[0]) {
            eAc = rp?.getElementsByClassName('article_current')[0];
            if (eAc) eFl = eAc.getElementsByClassName(`${$s1}loaded`)[0];
            if (eFl) FullFeed.checkScroll();
          } else if (document.getElementsByClassName(`${s}1`)[0]) {
            if (st.autopagerize) FullFeed.checkScroll();
            FullFeed.checkRegister();
          }
          e.stopPropagation();
        },
        { passive: true }
      );
      $id('three_way_contents')?.addEventListener(
        'scroll',
        (e) => {
          if (st.autopagerize) {
            FullFeed.checkScroll();
          }
          e.stopPropagation();
        },
        { passive: true }
      );
      document.addEventListener(
        'scroll',
        (e) => {
          const ad = $id('article_dialog');
          if (st.autopagerize && ad) {
            if (ad.getElementsByClassName('article_full_contents')[0]) {
              FullFeed.checkScroll();
              e.stopPropagation();
            }
          }
        },
        { capture: true, passive: true }
      );
      $id(`${$s2}`)?.addEventListener(
        'change',
        (e) => {
          const id = e.target instanceof HTMLElement ? e.target.id : '';
          if (!id) return;
          if (/allowlist_r/.test(id)) {
            $ids('autoload_allowlist_feed')?.classList.toggle('select');
            $ids('autoload_allowlist_article')?.classList.toggle('select');
          } else if (/denylist_r/.test(id)) {
            $ids('autoload_denylist_feed')?.classList.toggle('select');
            $ids('autoload_denylist_article')?.classList.toggle('select');
          } else if (/etc_mode-/.test(id)) toggleSettingsMode();
        },
        false
      );
    };
    FullFeed.loadSettings();
    FullFeed.cacheInfo = FullFeed.getCache('cache');
    FullFeed.cacheAPInfo = FullFeed.getCache('cacheAP');
    FullFeed.userCache = FullFeed.getCache('userCache');
    FullFeed.userCacheAP = FullFeed.getCache('userCacheAP');
    FullFeed.userCacheList = FullFeed.getCache('userCacheList');
    FullFeed.userCacheListAP = FullFeed.getCache('userCacheListAP');
    FullFeed.createSettings();
    FullFeed.getAppVersion();
    observer.observe(document.body, { childList: true });
    createMessageBox();
    addStyle();
    addEvent(FullFeed.appVersion < 14 ? $id('reader_pane') : document);
    st.version = version;
    FullFeed.saveSettings();
    try {
      GM_registerMenuCommand(`${LOC.t21}`, () => FullFeed.viewSettings());
    } catch (e) {
      log('GM_registerMenuCommand', e);
    }
    loadTwitterWidgetsScript();
  };

  const loadFailure = (e) => {
    if (
      !/^input|^textarea/i.test(e.target.tagName) &&
      e.code === 'KeyE' &&
      e.altKey &&
      e.ctrlKey &&
      e.shiftKey
    ) {
      exportSettings();
    }
  };
  document.addEventListener('keydown', loadFailure, true);

  const initInterval = window.setInterval(() => {
    const tree = $id('tree');
    if (/ino\s?reader/i.test(document.title) && tree?.innerHTML) {
      window.clearInterval(initInterval);
      window.setTimeout(() => init(), 1000);
      document.removeEventListener('keydown', loadFailure, true);
    }
  }, 500);

  const log = (...a) => {
    if (FullFeed.debugLog) {
      console.log($s3.slice(0, -1), ...a);
    }
  };

  // == [Utility] =================================
  function removeXSSRisks(htmldoc) {
    const embed = htmldoc.getElementsByTagName('embed'),
      iframe = htmldoc.getElementsByTagName('iframe'),
      param = htmldoc.getElementsByTagName('param');
    for (let i1 = 0, j1 = embed.length; i1 < j1; i1++) {
      if (embed[i1]) {
        embed[i1].setAttribute('sandbox', '');
      }
    }
    for (let i2 = 0, j2 = iframe.length; i2 < j2; i2++) {
      if (iframe[i2]) {
        iframe[i2].setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-presentation');
      }
    }
    for (let i3 = 0, j3 = param.length; i3 < j3; i3++) {
      if (
        param[i3]?.hasAttribute('name') &&
        param[i3]?.getAttribute('name') === 'allowScriptAccess'
      ) {
        param[i3].removeAttribute('name');
      }
    }
  }

  function searchEntry(htmldoc) {
    const arM = ['hentry', 'xfolkentry', 'autopagerize_page_element'],
      ar1 = [
        'articlebody',
        'articlebox',
        'articlemain',
        'articlesection',
        'articletable',
        'articlesbody',
        'articlesbox',
        'articlessection',
        'articlestable',
        'blockstory',
        'blogbody',
        'center',
        'entlybody',
        'entlytext',
        'entrybody',
        'entrycontent',
        'entrytable',
        'entrytext',
        'mainarticle',
        'maintext',
        'maintxt',
        'singlecontent',
        'storycontent',
        'yjmt',
      ],
      ar2 = [
        'blockleaf',
        'boxcontent',
        'contentbody',
        'contentbox',
        'contentinner',
        'contenttext',
        'contentsbody',
        'contentsbox',
        'contentsinner',
        'contentstext',
        'maincontent',
        'mainframe',
        'middlecontent',
        'middlecontainer',
        'newsbody',
        'postbody',
        'postcontent',
        'textbody',
        'kiji',
        'newart',
      ],
      ar3 = [
        'article',
        'blog',
        'body',
        'column',
        'content',
        'entry',
        'main',
        'middle',
        'page',
        'post',
        'section',
        'story',
        'text',
        'entries',
      ],
      s1 = '//*[contains(translate(concat(',
      s2 = '@id, " ", @class',
      s3 =
        '), "ABCDEFGHIJKLMNOPQRSTUVWXYZ-_ ", "abcdefghijklmnopqrstuvwxyz"), "',
      s4 = '")]',
      nM = arM.length,
      n1 = ar1.length,
      n2 = ar2.length,
      n3 = ar3.length;
    const makeXpath = (ar, len, sp) => {
      const x = [];
      ar.forEach((a, i) => {
        if (sp) x.push(`${s1}" ", ${s2}, " "${s3} ${a} ${s4}`);
        else x.push(s1 + s2 + s3 + a + s4);
        if (len > i + 1) x.push('|');
      });
      return x.join('');
    };
    const xpath = () => {
      const ar = [
          'date',
          'foot',
          'head',
          'media',
          'menu',
          'navbar',
          'navi',
          'side',
          'tool',
          'widget',
        ],
        s5 =
          '[not((.|.//*|ancestor-or-self::*)[contains(translate(concat(@id, " ", @class), "ABCDEFGHIJKLMNOPQRSTUVWXYZ-_", "abcdefghijklmnopqrstuvwxyz"), "',
        s6 = '")])]',
        x = [
          '//*[not(.//head|ancestor-or-self::head)][not(.//link|ancestor-or-self::link)][not(.//style|ancestor-or-self::style)]',
        ];
      ar.forEach((a) => x.push(s5 + a + s6));
      return x.join('');
    };
    try {
      let elms = getElementsByXPath(makeXpath(arM, nM, true), htmldoc),
        max = 0,
        data;
      if (!elms) elms = getElementsByXPath(makeXpath(ar1, n1, true), htmldoc);
      if (!elms) elms = getElementsByXPath(makeXpath(ar1, n1, false), htmldoc);
      if (!elms) elms = getElementsByXPath(makeXpath(ar2, n2, true), htmldoc);
      if (!elms) elms = getElementsByXPath(makeXpath(ar2, n2, false), htmldoc);
      if (!elms) elms = getElementsByXPath(makeXpath(ar3, n3, true), htmldoc);
      if (!elms) elms = getElementsByXPath(makeXpath(ar3, n3, false), htmldoc);
      if (!elms) elms = getElementsByXPath(xpath(), htmldoc);
      if (!elms) return null;
      elms.forEach((e) => {
        if (typeof e.textContent !== 'string') return;
        const n = e.textContent.replace(
          /^\s+|\s+$|(?:\r?\n|\r){2,}/g,
          ''
        ).length;
        if (max < n) {
          max = n;
          data = e;
        }
      });
      return data ? [data] : null;
    } catch (e) {
      log('searchEntry', e);
      return null;
    }
  }

  function relativeToAbsolutePath(htmldoc, base) {
    const hre = htmldoc.querySelectorAll('*[href]'),
      src = htmldoc.querySelectorAll('*[src]'),
      sty = htmldoc.querySelectorAll('*[style*="url"]'),
      domain = /^https?:\/\/[^/]+/.exec(base),
      top = domain ? domain[0] : '',
      current = base.replace(/\/[^/]+$/, '/');
    let url, abs;
    for (let i1 = 0, j1 = hre.length; i1 < j1; i1++) {
      url = hre[i1].getAttribute('href').trim();
      abs = '';
      if (url && !/^(?:https?|ftp|file|mailto):/.test(url)) {
        abs = _rel2abs(url, top, current, base);
      }
      if (abs) {
        try {
          hre[i1].href = abs;
        } catch (er1) {
          log('relativeToAbsolutePath 1', er1);
        }
      }
    }
    for (let i2 = 0, j2 = src.length; i2 < j2; i2++) {
      url = src[i2].getAttribute('src').trim();
      abs = '';
      if (url && !/^(?:https?|ftp|file|mailto):/.test(url)) {
        abs = _rel2abs(url, top, current, base);
      }
      if (abs) {
        try {
          src[i2].src = abs;
        } catch (er2) {
          log('relativeToAbsolutePath 2', er2);
        }
      }
    }
    for (let i3 = 0, j3 = sty.length, m, s; i3 < j3; i3++) {
      s = sty[i3].getAttribute('style').trim();
      m = s.match(/url\s*\([^)]+?\)/g);
      url = /url\s*\([^)]+?\)/.exec(s);
      if (!url) continue;
      url = url.toString();
      url = url.slice(url.indexOf('(') + 1, url.lastIndexOf(')'));
      for (let i4 = 0, j4 = m.length; i4 < j4; i4++) {
        abs = '';
        if (url && !/^(?:https?|ftp|file|mailto):/.test(url)) {
          abs = s.replace(m[i4], `url("${_rel2abs(url, top, current, base)}")`);
        }
        if (abs) {
          try {
            sty[i3].setAttribute('style', abs);
          } catch (er3) {
            log('relativeToAbsolutePath 3', er3);
          }
        }
      }
    }
  }

  function _rel2abs(url, top, current, base) {
    if (/^\/\//.test(url)) return top.slice(0, top.indexOf('//')) + url;
    if (/\/$/.test(current)) current = current.slice(0, -1);
    const uPath = url.split('/'),
      cPath = current.split('/');
    for (let i = 0, j = uPath.length; i < j; i++) {
      if (!uPath[i]) continue;
      if (uPath[i] === '.') {
        uPath.splice(i, 1);
        i -= 1;
      } else if (uPath[i] === '..') {
        uPath.splice(i, 1);
        if (/^\//.test(url)) uPath.splice(i - 1, 1);
        cPath.pop();
        i -= 1;
      }
    }
    current = `${cPath.join('/')}/`;
    url = uPath.join('/');
    if (/^\?/.test(url)) return base.slice(0, base.indexOf('?')) + url;
    if (/^#/.test(url)) return base + url;
    if (/^\//.test(url)) return top + url;
    return current + url;
  }

  function replaceSrcOriginal(htmldoc) {
    const attr = st.lazyloadattr.split(','),
      img = htmldoc.getElementsByTagName('img');
    for (let i = 0, j = img.length; i < j; i++) {
      for (let k = 0, l = attr.length, s; k < l; k++) {
        s = img[i].hasAttribute(attr[k]) ? img[i].getAttribute(attr[k]) : null;
        if (s && /^https?:\/\/|^\.?\//.test(s)) img[i].setAttribute('src', s);
      }
    }
  }

  function message(mes, dur, typ) {
    const box = $id(`${$s1}message`);
    if (!box) return;
    const dura = dur < 0 ? 300000 : !dur ? 1500 : dur,
      type = typ;
    if (mes) {
      box.innerHTML = mes;
      box.classList.remove(`${$s1}warning`);
      if (type) box.classList.add(`${$s1}${type}`);
      box.classList.remove(`${$s1}hidden`);
      window.clearTimeout(FullFeed.messageInterval);
      FullFeed.messageInterval = window.setTimeout(() => {
        box.classList.add(`${$s1}hidden`);
        if (type) box.classList.remove(`${$s1}${type}`);
        box.innerHTML = '';
      }, dura);
    } else {
      box.classList.add(`${$s1}hidden`);
      box.innerHTML = '';
    }
  }

  function createHTMLDocumentByString(str) {
    try {
      const htmlDoc = new DOMParser().parseFromString(str, 'text/html');
      return htmlDoc;
    } catch (e) {
      log('createHTMLDocumentByString', e);
      const htmlDoc = document.implementation.createHTMLDocument('');
      const doc = document.createElement('html');
      doc.innerHTML = str;
      htmlDoc.appendChild(doc);
      return htmlDoc;
    }
  }

  // AutoPagerize (c) id:swdyh
  function getElementsByXPath(xpath, node) {
    const ss = getXPathResult(xpath, node, 7),
      data = [];
    for (let i = 0; i < ss.snapshotLength; i++) data.push(ss.snapshotItem(i));
    return data.length > 0 ? data : null;
  }

  // AutoPagerize (c) id:swdyh
  function getXPathResult(xpath, node, resultType) {
    const doc = node.ownerDocument || node;
    let defaultNS = null;
    try {
      if (node.nodeType === node.DOCUMENT_NODE) {
        defaultNS = node.documentElement.lookupNamespaceURI(null);
      } else {
        defaultNS = node.lookupNamespaceURI(null);
      }
    } catch (e) {
      log('getXPathResult', e);
    }
    if (defaultNS) {
      const defaultPrefix = '__default__';
      xpath = addDefaultPrefix(xpath, defaultPrefix);
      return doc.evaluate(
        xpath,
        node,
        (prefix) =>
          prefix === defaultPrefix
            ? defaultNS
            : node.lookupNamespaceURI(prefix),
        resultType,
        null
      );
    }
    return doc.evaluate(xpath, node, null, resultType, null);
  }

  // AutoPagerize (c) id:swdyh
  function addDefaultPrefix(xpath, prefix) {
    const tokenPattern =
        /([A-Za-z_\u00c0-\ufffd][\w\-.\u00b7-\ufffd]*|\*)\s*(::?|\()?|(".*?"|'.*?'|\d+(?:\.\d*)?|\.(?:\.|\d+)?|[)\]])|(\/\/?|!=|[<>]=?|[([|,=+-])|([@$])/g,
      TERM = 1,
      OPERATOR = 2,
      MODIFIER = 3;
    let tokenType = OPERATOR;
    prefix += ':';

    function replacer(token, identifier, suffix, term, operator) {
      if (suffix) {
        tokenType =
          suffix === ':' ||
          (suffix === '::' &&
            (identifier === 'attribute' || identifier === 'namespace'))
            ? MODIFIER
            : OPERATOR;
      } else if (identifier) {
        if (tokenType === OPERATOR && identifier !== '*') {
          token = prefix + token;
        }
        tokenType = tokenType === TERM ? OPERATOR : TERM;
      } else tokenType = term ? TERM : operator ? OPERATOR : MODIFIER;
      return token;
    }
    return xpath.replace(tokenPattern, replacer);
  }

  function pathToURL(url, path) {
    const re =
      path.indexOf('/') === 0 ? /^([a-zA-Z]+:\/\/[^/]+)\/.*$/ : /^(.*\/).*$/;
    return url.replace(re, `$1${path}`);
  }

  function contentScriptInjection(source) {
    const script = document.createElement('script');
    log('contentScriptInjection', source);
    if (typeof source === 'function') source = `(${source})();`;
    script.setAttribute('type', 'application/javascript');
    script.textContent = source;
    document.body.appendChild(script);
    document.body.removeChild(script);
  }
})();
