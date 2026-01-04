// ==UserScript==
// @version      1.1.1
// @name         OldRedditPlus
// @name:en      OldRedditPlus
// @namespace    https://codeberg.org/Merlinsencho/oldredditplus
// @description  Old RedditのUIカスタマイズ、画面左側に登録サブレ一覧のサイドバーを追加します
// @description:en Old Reddit customization with overlay sidebar on the left of the screen and dark mode
// @author       Merlinsencho
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        https://old.reddit.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @noframes
// @copyright    2025, Merlinsencho
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559896/OldRedditPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/559896/OldRedditPlus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // CSS注入
    GM_addStyle(`
/* ===================================
   New Old Reddit Style - Overlay MVP
   =================================== */

:root {
    --bg-primary: #1a1a1b;
    --bg-secondary: #272729;
    --text-primary: #d7dadc;
    --text-secondary: #818384;
    --border-color: #343536;
    --link-color: #4fbcff;
    --hover-bg: #272729;
}

/* bodyへの干渉を最小化 - ダークモード時のみ背景色/文字色を適用 */
body.dark-mode {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
}

/* #headerへの干渉を削除 - サブレディット独自レイアウトを尊重 */

/* LEFTサイドバー - オーバーレイ */
#sr-header-area {
    position: fixed !important;
    left: -260px;
    top: 60px;  /* フォールバック値：JavaScriptで動的に更新 */
    width: 250px;
    height: calc(100vh - 60px);  /* フォールバック値：JavaScriptで動的に更新 */
    overflow-y: scroll !important;
    background: var(--bg-primary, #1a1a1b);
    border-right: 1px solid var(--border-color, #343536);
    z-index: 999;
    padding-top: 0;
    display: flex !important;
    flex-direction: column !important;
    transition: left 0.3s ease-in-out;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
}

body.show-left #sr-header-area {
    left: 0;
}

body.show-left::before {
    content: '';
    position: fixed;
    top: 0;
    left: 250px;  /* SUBSの幅分だけ右にずらして、SUBSエリアには背景を適用しない */
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    animation: fadeIn 0.3s ease-in-out;
    pointer-events: none;  /* 背景オーバーレイはクリック不可に（視覚効果のみ） */
}

/* 設定パネル表示時は半透明背景を無効化 */
#orp-settings-overlay.show ~ body.show-left::before,
body.show-left.settings-open::before {
    display: none;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* #header-bottom-left/right削除 - サブレディット依存要素への干渉回避 */

#sr-header-area .width-clip {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

#sr-header-area .sr-list {
    background: var(--bg-primary, #1a1a1b);
    padding: 0;
    margin: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
}

#sr-header-area .sr-bar {
    display: flex !important;
    flex-direction: column !important;
    padding: 0;
    list-style: none;
    margin: 0;
    order: 1;
    flex: 1;
}

#sr-header-area .sr-bar li {
    display: block;
    margin: 0;
    padding: 0;
}

#sr-header-area .sr-bar a {
    display: block !important;
    padding: 10px 15px !important;
    color: var(--text-primary, #d7dadc) !important;
    text-decoration: none !important;
    transition: background 0.2s;
    border-bottom: 1px solid var(--border-color, #343536);
    font-size: 14px;
}

#sr-header-area .sr-bar a:hover {
    background: var(--hover-bg, #272729) !important;
}

#sr-header-area .separator,
#sr-header-area .dropdown,
#sr-header-area .srdrop {
    display: none !important;
}

#sr-header-area #sr-more-link {
    display: block;
    padding: 10px 15px;
    color: var(--link-color, #4fbcff);
    text-decoration: none;
    font-size: 12px;
    text-align: center;
    border-top: 1px solid var(--border-color, #343536);
    order: 3;
    margin-top: auto;
}

/* スペーサー（区切り線） */
#sr-header-area .orp-separator {
    height: 1px;
    background: var(--border-color, #343536);
    margin: 8px 0;
    pointer-events: none;
}

/* .contentへの干渉を削除 - サブレディット独自レイアウトを尊重 */

/* .thingをダークモード限定に - サブレディット独自デザインを尊重 */
body.dark-mode .thing {
    background: var(--bg-primary, #1a1a1b);
    border: 1px solid var(--border-color, #343536);
    border-radius: 4px;
    margin-bottom: 10px;
}

body.dark-mode .thing .title a {
    color: var(--text-primary, #d7dadc) !important;
}

body.dark-mode .thing .title a:visited {
    color: var(--text-secondary, #818384) !important;
}

/* ===================================
   コメントページ（アーティクル）用ダークモード
   =================================== */

/* コメントエリア全般 */
body.dark-mode .commentarea {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
}

/* コメント本体 */
body.dark-mode .comment {
    background: transparent !important;
    border-left: 1px solid var(--border-color) !important;
}

body.dark-mode .comment .entry {
    color: var(--text-primary) !important;
}

/* タグライン（投稿者情報） */
body.dark-mode .tagline,
body.dark-mode .comment .tagline {
    color: var(--text-secondary) !important;
}

body.dark-mode .tagline .author,
body.dark-mode .comment .tagline .author {
    color: var(--link-color) !important;
}

/* コメント本文のテキスト */
body.dark-mode .usertext-body,
body.dark-mode .usertext-body .md,
body.dark-mode .comment .usertext-body,
body.dark-mode .comment .md {
    background: transparent !important;
    color: var(--text-primary) !important;
}

body.dark-mode .usertext-body .md p,
body.dark-mode .comment .md p {
    color: var(--text-primary) !important;
}

/* コメント内のリンク */
body.dark-mode .usertext-body a,
body.dark-mode .comment .md a {
    color: var(--link-color) !important;
}

body.dark-mode .usertext-body a:visited,
body.dark-mode .comment .md a:visited {
    color: var(--text-secondary) !important;
}

body.dark-mode .usertext-body a:hover,
body.dark-mode .comment .md a:hover {
    color: var(--text-primary) !important;
}

/* コメント投稿フォーム */
body.dark-mode .usertext-edit {
    background: var(--bg-secondary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode .usertext-edit textarea {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode .usertext-edit textarea:focus {
    background: var(--bg-secondary) !important;
    border-color: var(--link-color) !important;
}

/* フォーム下部エリア */
body.dark-mode .usertext-edit .bottom-area {
    background: var(--bg-secondary) !important;
    border-top-color: var(--border-color) !important;
}

body.dark-mode .usertext-edit .bottom-area a,
body.dark-mode .help-toggle a {
    color: var(--link-color) !important;
}

/* ボタン */
body.dark-mode .usertext-buttons button {
    background: var(--link-color) !important;
    color: #ffffff !important;
    border: none !important;
}

body.dark-mode .usertext-buttons button:hover {
    background: #3a9dd9 !important;
}

body.dark-mode .usertext-buttons .cancel {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
    border: 1px solid var(--border-color) !important;
}

body.dark-mode .usertext-buttons .cancel:hover {
    background: var(--hover-bg) !important;
}

/* フラットリストのボタン */
body.dark-mode .flat-list.buttons li a {
    color: var(--text-secondary) !important;
}

body.dark-mode .flat-list.buttons li a:hover {
    color: var(--link-color) !important;
}

/* エクスパンド領域 */
body.dark-mode .expando {
    background: transparent !important;
}

/* メニューエリア */
body.dark-mode .menuarea {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
}

/* ドロップダウン */
body.dark-mode .dropdown {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode .drop-choices {
    background: var(--bg-secondary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode .drop-choices a {
    color: var(--text-primary) !important;
    background: var(--bg-secondary) !important;
}

body.dark-mode .drop-choices a:hover {
    background: var(--hover-bg) !important;
}

/* マークダウンヘルプ */
body.dark-mode .markhelp {
    background: var(--bg-secondary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode .markhelp td {
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

/* パネルスタックタイトル */
body.dark-mode .panestack-title {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
}

body.dark-mode .panestack-title .title {
    color: var(--text-primary) !important;
}

/* siteTable */
body.dark-mode .sitetable {
    background: transparent !important;
}

/* エントリー */
body.dark-mode .entry {
    color: var(--text-primary) !important;
}

body.dark-mode .entry .title {
    color: var(--text-primary) !important;
}

/* ドメイン */
body.dark-mode .domain a {
    color: var(--text-secondary) !important;
}

/* スコア */
body.dark-mode .score {
    color: var(--text-primary) !important;
}

/* エラーメッセージ */
body.dark-mode .error {
    color: #ff6b6b !important;
}

/* ステータスメッセージ */
body.dark-mode .status {
    color: var(--text-primary) !important;
}

/* ===================================
   RIGHT側サイドバー用ダークモード（オプション）
   最小限の適用でサブレディット共通で使える安全策
   =================================== */

/* RIGHTサイドバー - 背景と基本テキスト色のみ（最小限） */
body.dark-mode.dark-mode-right .side {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
}

/* サイドバーの基本リンク色 */
body.dark-mode.dark-mode-right .side a {
    color: var(--link-color) !important;
}

/* 検索ボックス - 最小限の調整 */
body.dark-mode.dark-mode-right .side .search input[type="text"] {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode.dark-mode-right .side .search input[type="text"]:focus {
    border-color: var(--link-color) !important;
}

/* ===================================
   RIGHT側フルダークモード（警告：問題が起こりやすい）
   =================================== */

/* サイドボックス（各ウィジェット） */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .spacer {
    background: var(--bg-secondary) !important;
    border: 1px solid var(--border-color) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .spacer .titlebox {
    background: var(--bg-secondary) !important;
}

/* サイドバーのタイトル */
body.dark-mode.dark-mode-right.dark-mode-right-full .side h1,
body.dark-mode.dark-mode-right.dark-mode-right-full .side h2,
body.dark-mode.dark-mode-right.dark-mode-right-full .side h3,
body.dark-mode.dark-mode-right.dark-mode-right-full .side h4,
body.dark-mode.dark-mode-right.dark-mode-right-full .side h5,
body.dark-mode.dark-mode-right.dark-mode-right-full .side h6 {
    color: var(--text-primary) !important;
}

/* サイドバーのテキスト */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .usertext-body,
body.dark-mode.dark-mode-right.dark-mode-right-full .side .md {
    color: var(--text-primary) !important;
}

/* リンクホバー */
body.dark-mode.dark-mode-right.dark-mode-right-full .side a:hover {
    color: var(--text-primary) !important;
}

/* スポンサードリンク */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .sidecontentbox {
    background: var(--bg-secondary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .sidecontentbox .title h1 {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .sidecontentbox .content {
    background: var(--bg-primary) !important;
}

/* 検索ボックス（フル版） */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .search input[type="text"]:focus {
    background: var(--bg-secondary) !important;
}

/* ログインフォーム */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .login-form-side {
    background: var(--bg-secondary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .login-form-side input[type="text"],
body.dark-mode.dark-mode-right.dark-mode-right-full .side .login-form-side input[type="password"] {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

/* モデレーターリスト */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .sidecontentbox .morelink {
    background: var(--link-color) !important;
    border-color: var(--link-color) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .sidecontentbox .morelink:hover {
    background: #3a9dd9 !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .sidecontentbox .morelink a {
    color: #ffffff !important;
}

/* 購読ボタン */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .fancy-toggle-button {
    background: var(--bg-secondary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .fancy-toggle-button .active {
    background: var(--link-color) !important;
}

/* サイドバーの投稿作成ボタン */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .sidebox.submit {
    background: var(--bg-secondary) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .morelink {
    background: var(--link-color) !important;
    border: none !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .morelink:hover {
    background: #3a9dd9 !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .morelink a {
    color: #ffffff !important;
}

/* フレアセレクター */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .flairselector {
    background: var(--bg-primary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .flairselector li {
    background: var(--bg-secondary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .flairselector li:hover {
    background: var(--hover-bg) !important;
}

/* モデレーター情報 */
body.dark-mode.dark-mode-right.dark-mode-right-full .side .icon-menu a {
    background: var(--bg-secondary) !important;
    color: var(--text-primary) !important;
}

body.dark-mode.dark-mode-right.dark-mode-right-full .side .icon-menu a:hover {
    background: var(--hover-bg) !important;
}

/* ===================================
   投稿フォーム用ダークモードスタイル
   =================================== */

/* 投稿ページ全体 */
body.dark-mode.submit-page {
    background: var(--bg-primary) !important;
}

/* 投稿フォームのコンテナ */
body.dark-mode .content[role="main"] {
    background: var(--bg-primary);
}

/* roundfield（入力フィールドのコンテナ） */
body.dark-mode .roundfield {
    background: var(--bg-secondary);
    border-color: var(--border-color);
}

body.dark-mode .roundfield-content {
    background: var(--bg-secondary);
}

/* spacer要素 */
body.dark-mode .spacer {
    background: transparent;
}

/* タイトルラベル */
body.dark-mode .roundfield .title {
    color: var(--text-primary);
}

/* 必須フィールドマーク */
body.dark-mode .required-roundfield {
    color: var(--text-primary);
}

/* 小さい説明文 */
body.dark-mode .little,
body.dark-mode .roundfield-description {
    color: var(--text-secondary);
}

/* テキストエリア・インプット */
body.dark-mode textarea,
body.dark-mode input[type="text"],
body.dark-mode input[type="url"] {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
    border-color: var(--border-color) !important;
}

body.dark-mode textarea:focus,
body.dark-mode input[type="text"]:focus,
body.dark-mode input[type="url"]:focus {
    background: var(--bg-secondary) !important;
    border-color: var(--link-color) !important;
}

/* ユーザーテキスト編集エリア */
body.dark-mode .usertext-edit {
    background: var(--bg-secondary);
    border-color: var(--border-color);
}

body.dark-mode .usertext-edit .md {
    background: var(--bg-primary);
}

/* マークダウンヘルプエリア */
body.dark-mode .usertext-edit .bottom-area {
    background: var(--bg-secondary);
    border-top-color: var(--border-color);
}

/* ヘルプトグル */
body.dark-mode .help-toggle a,
body.dark-mode .bottom-area a {
    color: var(--link-color);
}

body.dark-mode .help-toggle a:hover,
body.dark-mode .bottom-area a:hover {
    color: var(--text-primary);
}

/* マークダウンヘルプテーブル */
body.dark-mode .markhelp {
    background: var(--bg-secondary);
    border-color: var(--border-color);
}

body.dark-mode .markhelp td {
    color: var(--text-primary);
    border-color: var(--border-color);
}

/* 情報バー */
body.dark-mode .infobar {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-color);
}

/* フォームタブ */
body.dark-mode .tabmenu.formtab {
    background: var(--bg-secondary);
}

body.dark-mode .tabmenu.formtab li a {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border-color: var(--border-color);
}

body.dark-mode .tabmenu.formtab li.selected a,
body.dark-mode .tabmenu.formtab li a:hover {
    background: var(--bg-primary);
    color: var(--text-primary);
}

/* フォームタブコンテンツ */
body.dark-mode .formtabs-content {
    background: var(--bg-primary);
}

/* ボタン類 */
body.dark-mode button,
body.dark-mode .c-btn {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-color);
}

body.dark-mode button:hover,
body.dark-mode .c-btn:hover {
    background: var(--hover-bg);
}

body.dark-mode .c-btn-primary {
    background: var(--link-color);
    color: #ffffff;
}

body.dark-mode .c-btn-primary:hover {
    background: #3a9dd9;
}

/* サブレディット提案リスト */
body.dark-mode .sr-suggestion {
    color: var(--link-color);
}

body.dark-mode .sr-suggestion:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
}

/* フレアプレビュー */
body.dark-mode .flair-preview {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border-color: var(--border-color);
}

/* コレクションプロモ */
body.dark-mode .roundfield--with-padding {
    background: var(--bg-secondary);
}

body.dark-mode .roundfield--with-padding .usertext {
    color: var(--text-primary);
}

/* 送信テキスト */
body.dark-mode .submit_text h1 {
    color: var(--text-primary);
}

body.dark-mode .submit_text .content {
    color: var(--text-primary);
}

/* 左サイドバートグル - 左側の縦バー */
#orp-left-sidebar-toggle {
    position: fixed !important;
    left: 0 !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 1001 !important;
    background: var(--bg-secondary, #272729) !important;
    border: 1px solid var(--border-color, #343536) !important;
    border-left: none !important;
    border-radius: 0 8px 8px 0 !important;
    padding: 15px 6px !important;
    cursor: pointer !important;
    font-size: 20px !important;
    color: var(--text-primary, #d7dadc) !important;
    transition: all 0.2s !important;
    writing-mode: vertical-rl !important;
    text-orientation: mixed !important;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3) !important;
    width: auto !important;
    max-width: 50px !important;
    height: auto !important;
    min-width: unset !important;
    min-height: unset !important;
    box-sizing: border-box !important;
}

#orp-left-sidebar-toggle:hover {
    background: var(--hover-bg, #343536) !important;
    padding-left: 10px !important;
}

/* 設定ボタン - 左サイドバー下部 */
#orp-settings-button {
    display: block;
    padding: 15px 15px;
    background: var(--link-color, #4fbcff);
    color: #ffffff;
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    border-top: 2px solid var(--border-color, #343536);
    cursor: pointer;
    transition: background 0.2s;
    order: 4;
    margin-top: 0;
}

#orp-settings-button:hover {
    background: #3a9dd9;
}

/* 設定画面オーバーレイ */
#orp-settings-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 10000;
    overflow-y: auto;
}

#orp-settings-overlay.show {
    display: flex;
    align-items: center;
    justify-content: center;
}

#orp-settings-panel {
    background: var(--bg-primary, #1a1a1b);
    border: 2px solid var(--border-color, #343536);
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

#orp-settings-header {
    background: var(--bg-secondary, #272729);
    padding: 20px;
    border-bottom: 2px solid var(--border-color, #343536);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#orp-settings-header h2 {
    margin: 0;
    color: var(--text-primary, #d7dadc);
    font-size: 20px;
}

#orp-settings-close {
    background: transparent;
    border: none;
    color: var(--text-primary, #d7dadc);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
}

#orp-settings-close:hover {
    color: var(--link-color, #4fbcff);
}

#orp-settings-content {
    padding: 20px;
}

/* タブUI */
.orp-tabs {
    display: flex;
    border-bottom: 2px solid var(--border-color, #343536);
    background: var(--bg-secondary, #272729);
    margin: 0;
    padding: 0;
}

.orp-tab {
    flex: 1;
    padding: 15px 20px;
    background: transparent;
    border: none;
    color: var(--text-secondary, #818384);
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
}

.orp-tab:hover {
    background: var(--hover-bg, #343536);
    color: var(--text-primary, #d7dadc);
}

.orp-tab.active {
    color: var(--link-color, #4fbcff);
    border-bottom-color: var(--link-color, #4fbcff);
}

.orp-tab-content {
    display: none;
    padding: 20px;
}

.orp-tab-content.active {
    display: block;
}

/* メニュータブのレイアウト */
#tab-menu {
    display: none;
    padding: 0;
}

#tab-menu.active {
    display: flex;
    gap: 20px;
}

.orp-menu-settings {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.orp-menu-preview {
    width: 250px;
    background: var(--bg-primary, #1a1a1b);
    border-left: 2px solid var(--border-color, #343536);
    padding: 20px 0;
    position: sticky;
    top: 0;
    align-self: flex-start;
    max-height: calc(80vh - 120px);
    overflow-y: auto;
}

.orp-preview-title {
    color: var(--text-secondary, #818384);
    font-size: 12px;
    font-weight: bold;
    padding: 0 15px 10px;
    border-bottom: 1px solid var(--border-color, #343536);
}

.orp-preview-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.orp-preview-item {
    display: block;
    padding: 10px 15px;
    color: var(--text-primary, #d7dadc);
    border-bottom: 1px solid var(--border-color, #343536);
    font-size: 14px;
}

.orp-preview-item:hover {
    background: var(--hover-bg, #272729);
}

#tab-sort {
    display: none;
}

#tab-sort.active {
    display: flex;
    flex-direction: column;
}

/* ソートタブコントロール */
#orp-sort-controls {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px 20px;
    border-bottom: 2px solid var(--border-color, #343536);
    background: var(--bg-secondary, #272729);
    position: sticky;
    top: 0;
    z-index: 10;
}

#orp-sort-save,
#orp-sort-cancel {
    padding: 8px 16px;
    border: 1px solid var(--border-color, #343536);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
}

#orp-sort-save {
    background: var(--link-color, #4fbcff);
    color: #ffffff;
}

#orp-sort-save:hover {
    background: #3a9dd9;
}

#orp-sort-cancel {
    background: var(--bg-secondary, #272729);
    color: var(--text-primary, #d7dadc);
}

#orp-sort-cancel:hover {
    background: var(--hover-bg, #343536);
}

#orp-sort-list {
    flex: 1;
    overflow-y: auto;
    padding: 0;
}

.orp-sort-item {
    display: grid;
    grid-template-columns: 40px 35px 35px 35px 35px 1fr;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid var(--border-color, #343536);
    gap: 5px;
}

.orp-sort-item:hover {
    background: var(--hover-bg, #272729);
}

.orp-sort-number {
    text-align: center;
    font-weight: bold;
    color: var(--text-secondary, #818384);
    font-size: 13px;
}

.orp-sort-btn {
    background: var(--bg-secondary, #272729);
    color: var(--text-primary, #d7dadc);
    border: 1px solid var(--border-color, #343536);
    padding: 5px 8px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 3px;
    text-align: center;
    transition: background 0.2s;
    width: 100%;
}

.orp-sort-btn:hover:not(:disabled) {
    background: var(--hover-bg, #343536);
}

.orp-sort-btn:disabled {
    opacity: 0;
    cursor: default;
    visibility: hidden;
}

.orp-sort-name {
    font-size: 14px;
    color: var(--text-primary, #d7dadc);
}

.orp-setting-item {
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px solid var(--border-color, #343536);
}

.orp-setting-item:last-child {
    border-bottom: none;
}

.orp-setting-label {
    display: block;
    color: var(--text-primary, #d7dadc);
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 16px;
}

.orp-setting-description {
    color: var(--text-secondary, #818384);
    font-size: 13px;
    margin-bottom: 10px;
}

.orp-toggle-switch {
    display: inline-block;
    width: 50px;
    height: 26px;
    background: var(--text-secondary, #818384);
    border-radius: 13px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
}

.orp-toggle-switch.active {
    background: var(--link-color, #4fbcff);
}

.orp-toggle-switch::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s;
}

.orp-toggle-switch.active::after {
    left: 27px;
}

.orp-rgb-control {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.orp-rgb-label {
    width: 30px;
    font-weight: bold;
    color: var(--text-primary, #d7dadc);
}

.orp-rgb-spinner {
    display: flex;
    align-items: center;
    gap: 5px;
}

.orp-spinner-btn {
    background: var(--bg-secondary, #272729);
    border: 1px solid var(--border-color, #343536);
    color: var(--text-primary, #d7dadc);
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
    transition: background 0.2s;
}

.orp-spinner-btn:hover {
    background: var(--hover-bg, #343536);
}

.orp-spinner-value {
    width: 50px;
    text-align: center;
    padding: 5px;
    background: var(--bg-secondary, #272729);
    border: 1px solid var(--border-color, #343536);
    border-radius: 4px;
    color: var(--text-primary, #d7dadc);
}

.orp-rgb-preview {
    width: 100px;
    height: 40px;
    border: 2px solid var(--border-color, #343536);
    border-radius: 4px;
    margin-top: 10px;
}

body.dark-mode {
    --bg-primary: #1a1a1b;
    --bg-secondary: #272729;
    --text-primary: #d7dadc;
    --text-secondary: #818384;
    --border-color: #343536;
}

body:not(.dark-mode) {
    --bg-primary: #ffffff;
    --bg-secondary: #f6f7f8;
    --text-primary: #1c1c1c;
    --text-secondary: #7c7c7c;
    --border-color: #ccc;
    --hover-bg: #e8e8e8;
}

#sr-header-area::-webkit-scrollbar {
    width: 12px;
}

#sr-header-area::-webkit-scrollbar-track {
    background: var(--bg-secondary, #272729);
}

#sr-header-area::-webkit-scrollbar-thumb {
    background: var(--text-secondary, #818384);
    border-radius: 6px;
    border: 2px solid var(--bg-primary, #1a1a1b);
}

#sr-header-area::-webkit-scrollbar-thumb:hover {
    background: var(--text-primary, #d7dadc);
}

#sr-header-area {
    scrollbar-width: thin;
    scrollbar-color: var(--text-secondary, #818384) var(--bg-secondary, #272729);
}
`);
    
    // JavaScript機能
    
    // ===================================
    // セキュリティユーティリティ関数
    // ===================================
    
    /**
     * HTMLエスケープ: XSS攻撃対策
     * @param {string} str - エスケープする文字列
     * @returns {string} エスケープ済み文字列
     */
    function sanitizeHTML(str) {
        if (typeof str !== 'string') return '';
        const escapeMap = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        return str.replace(/[<>&"']/g, char => escapeMap[char]);
    }
    
    /**
     * スクリプトタグ除去: XSS攻撃対策
     * @param {string} str - 処理する文字列
     * @returns {string} スクリプトタグを除去した文字列
     */
    function removeScriptTags(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/data:text\/html/gi, '');
    }
    
    /**
     * CSSサニタイズ: CSSインジェクション対策
     * @param {string} str - 処理する文字列
     * @returns {string} 危険なCSS構文を除去した文字列
     */
    function sanitizeCSS(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/url\s*\(\s*["']?javascript:/gi, 'url(about:blank')
            .replace(/url\s*\(\s*["']?data:/gi, 'url(about:blank')
            .replace(/expression\s*\(/gi, 'invalid(')
            .replace(/@import/gi, '@invalid')
            .replace(/behavior\s*:/gi, 'invalid:')
            .replace(/binding\s*:/gi, 'invalid:')
            .replace(/-moz-binding/gi, 'invalid')
            .replace(/vbscript:/gi, 'invalid:');
    }
    
    /**
     * 数値検証: 範囲チェックとNaN対策
     * @param {any} value - 検証する値
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     * @param {number} defaultValue - デフォルト値
     * @param {string} key - 設定キー名（警告用）
     * @returns {number} 検証済みの数値
     */
    function sanitizeNumericValue(value, min, max, defaultValue, key = '') {
        const parsed = parseInt(value, 10);
        
        if (isNaN(parsed)) {
            if (key && value !== null && value !== undefined && value !== '') {
                console.warn(`[NOR Security] NaN値を検出: ${key}="${value}" → デフォルト値${defaultValue}を使用`);
            }
            return defaultValue;
        }
        
        if (parsed < min || parsed > max) {
            if (key) {
                console.warn(`[NOR Security] 範囲外の値を検出: ${key}=${parsed} (範囲: ${min}-${max}) → ${Math.max(min, Math.min(max, parsed))}に修正`);
            }
            return Math.max(min, Math.min(max, parsed));
        }
        
        return parsed;
    }
    
    /**
     * 文字列サニタイズチェーン: HTML/Script/CSSの全サニタイズを適用
     * @param {string} str - 処理する文字列
     * @returns {string} サニタイズ済み文字列
     */
    function sanitizeString(str) {
        if (typeof str !== 'string') return '';
        let sanitized = sanitizeHTML(str);
        sanitized = removeScriptTags(sanitized);
        sanitized = sanitizeCSS(sanitized);
        return sanitized;
    }
    
    // ===================================
    // localStorage安全アクセス
    // ===================================
    
    const storage = {
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                if (value === null) return defaultValue;
                
                // Boolean値の場合
                if (defaultValue === true || defaultValue === false) {
                    return value === 'true';
                }
                
                // 文字列の場合はサニタイズ適用（二重防御）
                if (typeof defaultValue === 'string') {
                    const sanitized = sanitizeString(value);
                    if (sanitized !== value && sanitized.length < value.length) {
                        console.warn(`[NOR Security] 不正な値を検出してサニタイズ: ${key}`);
                    }
                    return sanitized;
                }
                
                // その他（数値検証は呼び出し側で実施）
                return value;
            } catch (error) {
                console.warn('[NOR] localStorage read failed:', error);
                return defaultValue;
            }
        },
        
        set(key, value, isJSON = false) {
            try {
                let sanitizedValue = String(value);
                
                // JSONの場合はサニタイズをスキップ
                if (isJSON) {
                    // JSONの場合はサイズチェックのみ実施
                    if (sanitizedValue.length > 50000) {
                        console.warn(`[NOR Security] JSON値が大きすぎます（${sanitizedValue.length}文字）: ${key} → 50000文字に切り捨て`);               sanitizedValue = sanitizedValue.substring(0, 50000);
                    }
                    localStorage.setItem(key, sanitizedValue);
                    return;
                }
                
                // サイズチェック
                if (sanitizedValue.length > 10000) {
                    console.warn(`[NOR Security] 値が大きすぎます（${sanitizedValue.length}文字）: ${key} → 10000文字に切り捨て`);
                    sanitizedValue = sanitizedValue.substring(0, 10000);
                }
                
                // Boolean以外の文字列の場合はサニタイズ
                if (value !== true && value !== false && value !== 'true' && value !== 'false') {
                    const originalLength = sanitizedValue.length;
                    sanitizedValue = sanitizeString(sanitizedValue);
                    if (sanitizedValue.length < originalLength) {
                        console.warn(`[NOR Security] 不正な内容を除去して保存: ${key}`);
                    }
                    
                    // サニタイズで空になった場合
                    if (sanitizedValue.trim() === '' && originalLength > 0) {
                        console.warn(`[NOR Security] サニタイズ後に空文字列になったため保存をスキップ: ${key}`);
                        return;
                    }
                }
                
                localStorage.setItem(key, sanitizedValue);
            } catch (error) {
                console.warn('[NOR] localStorage write failed:', error);
            }
        }
    };
    
    function createToggleButtons() {
        // 左サイドバートグルボタン（画面左側の縦バー）
        const leftToggleBtn = document.createElement('button');
        leftToggleBtn.id = 'orp-left-sidebar-toggle';
        leftToggleBtn.textContent = '☰';
        leftToggleBtn.title = t('buttons.leftToggle');
        leftToggleBtn.setAttribute('type', 'button');
        document.body.appendChild(leftToggleBtn);
        
        // 左サイドバーに設定ボタンを追加
        const sidebar = document.querySelector('#sr-header-area');
        if (sidebar) {
            const settingsBtn = document.createElement('button');
            settingsBtn.id = 'orp-settings-button';
            settingsBtn.textContent = t('buttons.settingsText');
            settingsBtn.title = t('buttons.settingsTitle');
            settingsBtn.setAttribute('type', 'button');
            
            const widthClip = sidebar.querySelector('.width-clip');
            if (widthClip) {
                widthClip.appendChild(settingsBtn);
            }
        }
        
        return { leftToggleBtn };
    }
    
    function createSettingsPanel() {
        const overlay = document.createElement('div');
        overlay.id = 'orp-settings-overlay';
        overlay.innerHTML = `
            <div id="orp-settings-panel">
                <div id="orp-settings-header">
                    <h2 data-i18n="settings.title">${t('settings.title')}</h2>
                    <button id="orp-settings-close" type="button">×</button>
                </div>
                <div style="padding: 15px 20px; border-bottom: 2px solid var(--border-color, #343536); background: var(--bg-secondary, #272729);">
                    <label style="display: flex; align-items: center; gap: 10px;">
                        <span data-i18n="language.label" style="color: var(--text-primary, #d7dadc); font-weight: bold;">${t('language.label')}:</span>
                        <select id="orp-language-select" style="padding: 5px 10px; background: var(--bg-primary, #1a1a1b); color: var(--text-primary, #d7dadc); border: 1px solid var(--border-color, #343536); border-radius: 4px; cursor: pointer;">
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                        </select>
                    </label>
                </div>
                <div class="orp-tabs">
                    <button class="orp-tab active" data-tab="menu-button" data-i18n="tabs.menuButton">${t('tabs.menuButton')}</button>
                    <button class="orp-tab" data-tab="menu" data-i18n="tabs.menu">${t('tabs.menu')}</button>
                    <button class="orp-tab" data-tab="sort" data-i18n="tabs.sort">${t('tabs.sort')}</button>
                </div>
                <div id="tab-menu-button" class="orp-tab-content active">
                    <div class="orp-setting-item">
                        <label class="orp-setting-label" data-i18n="darkMode.label">${t('darkMode.label')}</label>
                        <div class="orp-setting-description" data-i18n="darkMode.description">${t('darkMode.description')}</div>
                        <div id="orp-darkmode-toggle" class="orp-toggle-switch"></div>
                    </div>
                    <div class="orp-setting-item">
                        <label class="orp-setting-label" data-i18n="darkModeRight.label">${t('darkModeRight.label')}</label>
                        <div class="orp-setting-description" data-i18n="darkModeRight.description">${t('darkModeRight.description')}</div>
                        <div id="orp-darkmode-right-toggle" class="orp-toggle-switch"></div>
                    </div>
                    <div class="orp-setting-item" id="orp-darkmode-right-full-container" style="display: none;">
                        <label class="orp-setting-label" data-i18n="darkModeRightFull.label">${t('darkModeRightFull.label')}</label>
                        <div class="orp-setting-description" data-i18n="darkModeRightFull.description" style="color: #ff6b6b;">${t('darkModeRightFull.description')}</div>
                        <div id="orp-darkmode-right-full-toggle" class="orp-toggle-switch"></div>
                    </div>
                    <div class="orp-setting-item">
                        <label class="orp-setting-label" data-i18n="menuColor.label">${t('menuColor.label')}</label>
                        <div class="orp-setting-description" data-i18n="menuColor.description">${t('menuColor.description')}</div>
                        <div class="orp-rgb-control">
                            <span class="orp-rgb-label" style="color: #ff0000;">R:</span>
                            <div class="orp-rgb-spinner">
                                <button class="orp-spinner-btn" id="orp-r-minus" type="button">−</button>
                                <span class="orp-spinner-value" id="orp-r-value">0</span>
                                <button class="orp-spinner-btn" id="orp-r-plus" type="button">+</button>
                            </div>
                        </div>
                        <div class="orp-rgb-control">
                            <span class="orp-rgb-label" style="color: #00ff00;">G:</span>
                            <div class="orp-rgb-spinner">
                                <button class="orp-spinner-btn" id="orp-g-minus" type="button">−</button>
                                <span class="orp-spinner-value" id="orp-g-value">0</span>
                                <button class="orp-spinner-btn" id="orp-g-plus" type="button">+</button>
                            </div>
                        </div>
                        <div class="orp-rgb-control">
                            <span class="orp-rgb-label" style="color: #0088ff;">B:</span>
                            <div class="orp-rgb-spinner">
                                <button class="orp-spinner-btn" id="orp-b-minus" type="button">−</button>
                                <span class="orp-spinner-value" id="orp-b-value">0</span>
                                <button class="orp-spinner-btn" id="orp-b-plus" type="button">+</button>
                            </div>
                        </div>
                        <div class="orp-rgb-control">
                            <span class="orp-rgb-label" style="color: #ffffff;">A:</span>
                            <div class="orp-rgb-spinner">
                                <button class="orp-spinner-btn" id="orp-a-minus" type="button">−</button>
                                <span class="orp-spinner-value" id="orp-a-value">100</span>
                                <button class="orp-spinner-btn" id="orp-a-plus" type="button">+</button>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 12px; margin-left: 5px;">%</span>
                        </div>
                        <div class="orp-setting-description" data-i18n="menuColor.preview">${t('menuColor.preview')}</div>
                        <div id="orp-rgb-preview" class="orp-rgb-preview"></div>
                    </div>
                    <div class="orp-setting-item">
                        <label class="orp-setting-label" data-i18n="menuSize.label">${t('menuSize.label')}</label>
                        <div class="orp-setting-description" data-i18n="menuSize.description">${t('menuSize.description')}</div>
                        <div class="orp-rgb-control">
                            <span class="orp-rgb-label" data-i18n="menuSize.width">${t('menuSize.width')}</span>
                            <div class="orp-rgb-spinner">
                                <button class="orp-spinner-btn" id="orp-width-minus" type="button">−</button>
                                <span class="orp-spinner-value" id="orp-width-value">50</span>
                                <button class="orp-spinner-btn" id="orp-width-plus" type="button">+</button>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 12px; margin-left: 5px;">px</span>
                        </div>
                        <div class="orp-rgb-control">
                            <span class="orp-rgb-label" data-i18n="menuSize.height">${t('menuSize.height')}</span>
                            <div class="orp-rgb-spinner">
                                <button class="orp-spinner-btn" id="orp-height-minus" type="button">−</button>
                                <span class="orp-spinner-value" id="orp-height-value">200</span>
                                <button class="orp-spinner-btn" id="orp-height-plus" type="button">+</button>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 12px; margin-left: 5px;">px</span>
                        </div>
                        <button id="orp-size-reset" class="orp-spinner-btn" type="button" data-i18n="menuSize.reset" style="margin-top: 10px; width: auto; padding: 5px 15px;">${t('menuSize.reset')}</button>
                    </div>
                    <div class="orp-setting-item">
                        <label class="orp-setting-label" data-i18n="menuOffset.label">${t('menuOffset.label')}</label>
                        <div class="orp-setting-description" data-i18n="menuOffset.description">${t('menuOffset.description')}</div>
                        <div class="orp-rgb-control">
                            <span class="orp-rgb-label" data-i18n="menuOffset.position">${t('menuOffset.position')}</span>
                            <div class="orp-rgb-spinner">
                                <button class="orp-spinner-btn" id="orp-offset-minus" type="button">−</button>
                                <span class="orp-spinner-value" id="orp-offset-value">0</span>
                                <button class="orp-spinner-btn" id="orp-offset-plus" type="button">+</button>
                            </div>
                            <span style="color: var(--text-secondary); font-size: 12px; margin-left: 5px;">px</span>
                        </div>
                        <button id="orp-offset-reset" class="orp-spinner-btn" type="button" data-i18n="menuOffset.reset" style="margin-top: 10px; width: auto; padding: 5px 15px;">${t('menuOffset.reset')}</button>
                    </div>
                </div>
                <div id="tab-menu" class="orp-tab-content">
                    <div class="orp-menu-settings">
                        <div class="orp-setting-item">
                            <label class="orp-setting-label" data-i18n="subsSettings.fontSize.label">${t('subsSettings.fontSize.label')}</label>
                            <div class="orp-setting-description" data-i18n="subsSettings.fontSize.description">${t('subsSettings.fontSize.description')}</div>
                            <div class="orp-rgb-control">
                                <span class="orp-rgb-label" data-i18n="subsSettings.fontSize.size">${t('subsSettings.fontSize.size')}</span>
                                <div class="orp-rgb-spinner">
                                    <button class="orp-spinner-btn" id="orp-subs-font-size-minus" type="button">−</button>
                                    <span class="orp-spinner-value" id="orp-subs-font-size-value">14</span>
                                    <button class="orp-spinner-btn" id="orp-subs-font-size-plus" type="button">+</button>
                                </div>
                                <span style="color: var(--text-secondary); font-size: 12px; margin-left: 5px;">px</span>
                                <button id="orp-subs-font-size-reset" class="orp-spinner-btn" type="button" data-i18n="subsSettings.fontSize.reset" style="width: auto; padding: 5px 15px; margin-left: 10px;">${t('subsSettings.fontSize.reset')}</button>
                            </div>
                        </div>
                        <div class="orp-setting-item">
                            <label class="orp-setting-label" data-i18n="subsSettings.margin.label">${t('subsSettings.margin.label')}</label>
                            <div class="orp-setting-description" data-i18n="subsSettings.margin.description">${t('subsSettings.margin.description')}</div>
                            <div class="orp-rgb-control">
                                <span class="orp-rgb-label" data-i18n="subsSettings.margin.margin">${t('subsSettings.margin.margin')}</span>
                                <div class="orp-rgb-spinner">
                                    <button class="orp-spinner-btn" id="orp-subs-margin-minus" type="button">−</button>
                                    <span class="orp-spinner-value" id="orp-subs-margin-value">10</span>
                                    <button class="orp-spinner-btn" id="orp-subs-margin-plus" type="button">+</button>
                                </div>
                                <span style="color: var(--text-secondary); font-size: 12px; margin-left: 5px;">px</span>
                                <button id="orp-subs-margin-reset" class="orp-spinner-btn" type="button" data-i18n="subsSettings.margin.reset" style="width: auto; padding: 5px 15px; margin-left: 10px;">${t('subsSettings.margin.reset')}</button>
                            </div>
                        </div>
                        <div class="orp-setting-item">
                            <label class="orp-setting-label" data-i18n="subsSettings.topOffset.label">${t('subsSettings.topOffset.label')}</label>
                            <div class="orp-setting-description" data-i18n="subsSettings.topOffset.description">${t('subsSettings.topOffset.description')}</div>
                            <div class="orp-rgb-control">
                                <span class="orp-rgb-label" data-i18n="subsSettings.topOffset.offset">${t('subsSettings.topOffset.offset')}</span>
                                <div class="orp-rgb-spinner">
                                    <button class="orp-spinner-btn" id="orp-subs-top-offset-minus" type="button">−</button>
                                    <span class="orp-spinner-value" id="orp-subs-top-offset-value">0</span>
                                    <button class="orp-spinner-btn" id="orp-subs-top-offset-plus" type="button">+</button>
                                </div>
                                <span style="color: var(--text-secondary); font-size: 12px; margin-left: 5px;">px</span>
                                <button id="orp-subs-top-offset-reset" class="orp-spinner-btn" type="button" data-i18n="subsSettings.topOffset.reset" style="width: auto; padding: 5px 15px; margin-left: 10px;">${t('subsSettings.topOffset.reset')}</button>
                            </div>
                        </div>
                        <div class="orp-setting-item">
                            <label class="orp-setting-label" data-i18n="subsSettings.lrOffset.label">${t('subsSettings.lrOffset.label')}</label>
                            <div class="orp-setting-description" data-i18n="subsSettings.lrOffset.description">${t('subsSettings.lrOffset.description')}</div>
                            <div class="orp-rgb-control">
                                <span class="orp-rgb-label" data-i18n="subsSettings.lrOffset.offset">${t('subsSettings.lrOffset.offset')}</span>
                                <div class="orp-rgb-spinner">
                                    <button class="orp-spinner-btn" id="orp-subs-lr-offset-minus" type="button">−</button>
                                    <span class="orp-spinner-value" id="orp-subs-lr-offset-value">0</span>
                                    <button class="orp-spinner-btn" id="orp-subs-lr-offset-plus" type="button">+</button>
                                </div>
                                <span style="color: var(--text-secondary); font-size: 12px; margin-left: 5px;">px</span>
                                <button id="orp-subs-lr-offset-reset" class="orp-spinner-btn" type="button" data-i18n="subsSettings.lrOffset.reset" style="width: auto; padding: 5px 15px; margin-left: 10px;">${t('subsSettings.lrOffset.reset')}</button>
                            </div>
                        </div>
                    </div>
                    <div class="orp-menu-preview">
                        <div class="orp-preview-title" data-i18n="preview.title">${t('preview.title')}</div>
                        <ul class="orp-preview-list" id="orp-preview-list">
                            <li class="orp-preview-item">TEST1</li>
                            <li class="orp-preview-item">TEST2</li>
                            <li class="orp-preview-item">TEST3</li>
                            <li class="orp-preview-item">TEST4</li>
                            <li class="orp-preview-item">TEST5</li>
                        </ul>
                    </div>
                </div>
                <div id="tab-sort" class="orp-tab-content">
                    <div id="orp-sort-controls">
                        <button id="orp-sort-save" type="button" data-i18n="sort.save">${t('sort.save')}</button>
                        <button id="orp-sort-cancel" type="button" data-i18n="sort.cancel">${t('sort.cancel')}</button>
                    </div>
                    <div id="orp-sort-list"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }
    
    function initSettingsPanel() {
        const overlay = createSettingsPanel();
        const closeBtn = document.getElementById('orp-settings-close');
        const settingsBtn = document.getElementById('orp-settings-button');
        const darkModeToggle = document.getElementById('orp-darkmode-toggle');
        
        // ソート機能の初期化
        initSortFeature();
        
        // 言語選択の初期化
        const languageSelect = document.getElementById('orp-language-select');
        if (languageSelect) {
            languageSelect.value = currentLang;
            languageSelect.addEventListener('change', function() {
                updateLanguage(this.value);
            });
        }
        
        // タブ切り替え機能
        const tabs = document.querySelectorAll('.orp-tab');
        const tabContents = document.querySelectorAll('.orp-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // すべてのタブとコンテンツから active クラスを削除
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                // クリックされたタブとそのコンテンツに active クラスを追加
                this.classList.add('active');
                document.getElementById(`tab-${targetTab}`).classList.add('active');
                
                // ソートタブが開かれたらリストを描画
                if (targetTab === 'sort') {
                    renderSortList();
                }
            });
        });
        
        // ダークモードの初期状態を反映
        const isDarkMode = storage.get('darkMode') === 'true';
        if (isDarkMode) {
            darkModeToggle.classList.add('active');
        }
        
        // RIGHT側ダークモードの初期化
        const darkModeRightToggle = document.getElementById('orp-darkmode-right-toggle');
        const darkModeRightFullToggle = document.getElementById('orp-darkmode-right-full-toggle');
        const darkModeRightFullContainer = document.getElementById('orp-darkmode-right-full-container');
        
        const isDarkModeRight = storage.get('darkModeRight') === 'true';
        if (isDarkModeRight) {
            darkModeRightToggle.classList.add('active');
            document.body.classList.add('dark-mode-right');
            // RIGHT側ダークモードがONの場合、フルダークモード設定を表示
            darkModeRightFullContainer.style.display = '';
        }
        
        // RIGHT側フルダークモードの初期化
        const isDarkModeRightFull = storage.get('darkModeRightFull') === 'true';
        if (isDarkModeRightFull && isDarkModeRight) {
            darkModeRightFullToggle.classList.add('active');
            document.body.classList.add('dark-mode-right-full');
        }
        
        // 設定ボタンクリックで表示
        if (settingsBtn) {
            settingsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                overlay.classList.add('show');
                document.body.classList.add('settings-open');
                // 左サイドバーを閉じる
                document.body.classList.remove('show-left');
                storage.set('leftSidebarVisible', false);
                const leftToggle = document.getElementById('orp-left-sidebar-toggle');
                if (leftToggle) leftToggle.style.display = '';
            });
        }
        
        // 閉じるボタン
        closeBtn.addEventListener('click', function() {
            overlay.classList.remove('show');
            document.body.classList.remove('settings-open');
            // SUBSを閉じる
            document.body.classList.remove('show-left');
        });
        
        // オーバーレイの外側クリックで閉じる
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('show');
                document.body.classList.remove('settings-open');
                // SUBSを閉じる
                document.body.classList.remove('show-left');
            }
        });
        
        // ダークモードトグル
        darkModeToggle.addEventListener('click', function() {
            darkModeToggle.classList.toggle('active');
            const isNowDark = darkModeToggle.classList.contains('active');
            document.body.classList.toggle('dark-mode', isNowDark);
            storage.set('darkMode', isNowDark);
        });
        
        // RIGHT側ダークモードトグル
        darkModeRightToggle.addEventListener('click', function() {
            darkModeRightToggle.classList.toggle('active');
            const isNowDarkRight = darkModeRightToggle.classList.contains('active');
            document.body.classList.toggle('dark-mode-right', isNowDarkRight);
            storage.set('darkModeRight', isNowDarkRight);
            
            // フルダークモード設定の表示/非表示を切り替え
            if (isNowDarkRight) {
                darkModeRightFullContainer.style.display = '';
            } else {
                darkModeRightFullContainer.style.display = 'none';
                // RIGHT側ダークモードをOFFにした場合、フルダークモードも自動的にOFF
                if (darkModeRightFullToggle.classList.contains('active')) {
                    darkModeRightFullToggle.classList.remove('active');
                    document.body.classList.remove('dark-mode-right-full');
                    storage.set('darkModeRightFull', false);
                }
            }
        });
        
        // RIGHT側フルダークモードトグル
        darkModeRightFullToggle.addEventListener('click', function() {
            darkModeRightFullToggle.classList.toggle('active');
            const isNowDarkRightFull = darkModeRightFullToggle.classList.contains('active');
            document.body.classList.toggle('dark-mode-right-full', isNowDarkRightFull);
            storage.set('darkModeRightFull', isNowDarkRightFull);
        });
        
        // RGB設定の初期化
        initRGBSettings();
        
        // メニュー設定の初期化
        initMenuSettings();
    }
    
    function initRGBSettings() {
        const leftToggleBtn = document.getElementById('orp-left-sidebar-toggle');
        
        // RGB値を0-255の範囲で、5刻みで管理（セキュリティ検証付き）
        let rValue = sanitizeNumericValue(storage.get('menuColorR', '39'), 0, 255, 39, 'menuColorR');
        let gValue = sanitizeNumericValue(storage.get('menuColorG', '39'), 0, 255, 39, 'menuColorG');
        let bValue = sanitizeNumericValue(storage.get('menuColorB', '41'), 0, 255, 41, 'menuColorB');
        // アルファ値は10-100の範囲で、5刻みで管理（%表記）
        let aValue = sanitizeNumericValue(storage.get('menuColorA', '100'), 10, 100, 100, 'menuColorA');
        
        // サイズとオフセット設定（セキュリティ検証付き）
        let widthValue = sanitizeNumericValue(storage.get('menuWidth', '50'), 5, 100, 50, 'menuWidth');
        let heightValue = sanitizeNumericValue(storage.get('menuHeight', '200'), 5, 5000, 200, 'menuHeight');
        let offsetValue = sanitizeNumericValue(storage.get('menuOffset', '0'), -10000, 10000, 0, 'menuOffset');
        
        const rValueEl = document.getElementById('orp-r-value');
        const gValueEl = document.getElementById('orp-g-value');
        const bValueEl = document.getElementById('orp-b-value');
        const aValueEl = document.getElementById('orp-a-value');
        const widthValueEl = document.getElementById('orp-width-value');
        const heightValueEl = document.getElementById('orp-height-value');
        const offsetValueEl = document.getElementById('orp-offset-value');
        const previewEl = document.getElementById('orp-rgb-preview');
        
        const updateRGBA = () => {
            // 値を表示
            rValueEl.textContent = rValue;
            gValueEl.textContent = gValue;
            bValueEl.textContent = bValue;
            aValueEl.textContent = aValue;
            
            // アルファ値を0-1の範囲に変換
            const alpha = aValue / 100;
            
            // プレビュー更新（強制的に再描画）
            const color = `rgba(${rValue}, ${gValue}, ${bValue}, ${alpha})`;
            previewEl.style.background = '';
            setTimeout(() => {
                previewEl.style.background = color;
            }, 0);
            
            // メニューボタンに適用
            if (leftToggleBtn) {
                leftToggleBtn.style.setProperty('background', color, 'important');
            }
            
            // 保存
            storage.set('menuColorR', String(rValue));
            storage.set('menuColorG', String(gValue));
            storage.set('menuColorB', String(bValue));
            storage.set('menuColorA', String(aValue));
            
            console.log('[NOR] Color updated:', color);
        };
        
        const updateSize = () => {
            // 値を表示
            widthValueEl.textContent = widthValue;
            heightValueEl.textContent = heightValue;
            
            // メニューボタンに適用
            if (leftToggleBtn) {
                leftToggleBtn.style.setProperty('max-width', `${widthValue}px`, 'important');
                leftToggleBtn.style.setProperty('width', `${widthValue}px`, 'important');
                leftToggleBtn.style.setProperty('height', `${heightValue}px`, 'important');
            }
            
            // 保存
            storage.set('menuWidth', String(widthValue));
            storage.set('menuHeight', String(heightValue));
            
            console.log('[NOR] Size updated:', widthValue, heightValue);
        };
        
        const updateOffset = () => {
            // 値を表示
            offsetValueEl.textContent = offsetValue;
            
            // メニューボタンに適用
            if (leftToggleBtn) {
                const transform = `translateY(calc(-50% + ${offsetValue}px))`;
                leftToggleBtn.style.setProperty('transform', transform, 'important');
            }
            
            // 保存
            storage.set('menuOffset', String(offsetValue));
            
            console.log('[NOR] Offset updated:', offsetValue);
        };
        
        // 初期表示
        updateRGBA();
        updateSize();
        updateOffset();
        
        // RGB値更新のヘルパー関数
        const createHandler = (getValue, setValue, updateFunc, min = 0, max = 255, step = 5) => {
            return {
                increment: () => {
                    setValue(Math.min(max, getValue() + step));
                    updateFunc();
                },
                decrement: () => {
                    setValue(Math.max(min, getValue() - step));
                    updateFunc();
                }
            };
        };
        
        // R, G, B, Aのハンドラーを設定
        const colorHandlers = {
            r: createHandler(() => rValue, (v) => rValue = v, updateRGBA, 0, 255, 5),
            g: createHandler(() => gValue, (v) => gValue = v, updateRGBA, 0, 255, 5),
            b: createHandler(() => bValue, (v) => bValue = v, updateRGBA, 0, 255, 5),
            a: createHandler(() => aValue, (v) => aValue = v, updateRGBA, 10, 100, 5)
        };
        
        // サイズハンドラー
        const sizeHandlers = {
            width: createHandler(() => widthValue, (v) => widthValue = v, updateSize, 5, 100, 5),
            height: createHandler(() => heightValue, (v) => heightValue = v, updateSize, 5, 5000, 10)
        };
        
        // オフセットハンドラー
        const offsetHandlers = {
            offset: createHandler(() => offsetValue, (v) => offsetValue = v, updateOffset, -10000, 10000, 10)
        };
        
        // イベントリスナーを登録
        ['r', 'g', 'b', 'a'].forEach(color => {
            document.getElementById(`orp-${color}-minus`).addEventListener('click', colorHandlers[color].decrement);
            document.getElementById(`orp-${color}-plus`).addEventListener('click', colorHandlers[color].increment);
        });
        
        // サイズのイベントリスナー
        document.getElementById('orp-width-minus').addEventListener('click', sizeHandlers.width.decrement);
        document.getElementById('orp-width-plus').addEventListener('click', sizeHandlers.width.increment);
        document.getElementById('orp-height-minus').addEventListener('click', sizeHandlers.height.decrement);
        document.getElementById('orp-height-plus').addEventListener('click', sizeHandlers.height.increment);
        
        // オフセットのイベントリスナー
        document.getElementById('orp-offset-minus').addEventListener('click', offsetHandlers.offset.decrement);
        document.getElementById('orp-offset-plus').addEventListener('click', offsetHandlers.offset.increment);
        
        // リセットボタン
        document.getElementById('orp-size-reset').addEventListener('click', () => {
            widthValue = 50;
            heightValue = 200;
            updateSize();
        });
        
        document.getElementById('orp-offset-reset').addEventListener('click', () => {
            offsetValue = 0;
            updateOffset();
        });
    }
    
    function initMenuSettings() {
        // SUBS設定の初期化（セキュリティ検証付き）
        const subsSettings = {
            fontSize: {
                value: sanitizeNumericValue(storage.get('subsFontSize', '14'), 5, 50, 14, 'subsFontSize'),
                default: 14,
                min: 5,
                max: 50,
                step: 1
            },
            margin: {
                value: sanitizeNumericValue(storage.get('subsMargin', '10'), 0, 100, 10, 'subsMargin'),
                default: 10,
                min: 0,
                max: 100,
                step: 1
            },
            topOffset: {
                value: sanitizeNumericValue(storage.get('subsTopOffset', '0'), 0, 1000, 0, 'subsTopOffset'),
                default: 0,
                min: 0,
                max: 1000,
                step: 1
            },
            lrOffset: {
                value: sanitizeNumericValue(storage.get('subsLROffset', '0'), 0, 1000, 0, 'subsLROffset'),
                default: 0,
                min: 0,
                max: 1000,
                step: 1
            }
        };
        
        const updateSubsStyles = () => {
            const styleId = 'orp-subs-custom-style';
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }
            
            // CSSインジェクション対策: 値の再検証（多層防御）
            const fontSize = sanitizeNumericValue(subsSettings.fontSize.value, 5, 50, 14);
            const margin = sanitizeNumericValue(subsSettings.margin.value, 0, 100, 10);
            const topOffset = sanitizeNumericValue(subsSettings.topOffset.value, 0, 1000, 0);
            const lrOffset = sanitizeNumericValue(subsSettings.lrOffset.value, 0, 1000, 0);
            
            // 型チェック（数値であることを保証）
            if (typeof fontSize !== 'number' || typeof margin !== 'number' || 
                typeof topOffset !== 'number' || typeof lrOffset !== 'number') {
                console.error('[NOR Security] CSS値の型が不正です。スタイル更新をスキップします。');
                return;
            }
            
            styleEl.textContent = `
                #sr-header-area .sr-bar a {
                    font-size: ${fontSize}px !important;
                    padding-top: ${margin}px !important;
                    padding-bottom: ${margin}px !important;
                    padding-left: ${15 + lrOffset}px !important;
                    padding-right: ${15 + lrOffset}px !important;
                }
                #sr-header-area .sr-bar {
                    padding-top: ${topOffset}px !important;
                }
                /* プレビュー用 */
                .orp-preview-item {
                    font-size: ${fontSize}px !important;
                    padding-top: ${margin}px !important;
                    padding-bottom: ${margin}px !important;
                    padding-left: ${15 + lrOffset}px !important;
                    padding-right: ${15 + lrOffset}px !important;
                }
                .orp-preview-list {
                    padding-top: ${topOffset}px !important;
                }
            `;
        };
        
        // 各設定の更新関数
        const updateSetting = (key) => {
            const setting = subsSettings[key];
            const valueEl = document.getElementById(`orp-subs-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}-value`);
            valueEl.textContent = setting.value;
            
            const storageKey = 'subs' + key.charAt(0).toUpperCase() + key.slice(1);
            storage.set(storageKey, String(setting.value));
            
            updateSubsStyles();
        };
        
        // 初期表示
        Object.keys(subsSettings).forEach(key => {
            const setting = subsSettings[key];
            const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const valueEl = document.getElementById(`orp-subs-${kebabKey}-value`);
            valueEl.textContent = setting.value;
        });
        updateSubsStyles();
        
        // イベントリスナー
        Object.keys(subsSettings).forEach(key => {
            const setting = subsSettings[key];
            const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            
            // +ボタン
            document.getElementById(`orp-subs-${kebabKey}-plus`).addEventListener('click', () => {
                setting.value = Math.min(setting.max, setting.value + setting.step);
                updateSetting(key);
            });
            
            // -ボタン
            document.getElementById(`orp-subs-${kebabKey}-minus`).addEventListener('click', () => {
                setting.value = Math.max(setting.min, setting.value - setting.step);
                updateSetting(key);
            });
            
            // リセットボタン
            document.getElementById(`orp-subs-${kebabKey}-reset`).addEventListener('click', () => {
                setting.value = setting.default;
                updateSetting(key);
            });
        });
    }
    
    // ===================================
    // ソート機能
    // ===================================
    let currentSortOrder = [];
    let originalSortOrder = [];
    
    function getSortableItems() {
        // 2つの.sr-barが存在する：[0]はシステムメニュー、[1]は登録サブレディット
        const srBars = document.querySelectorAll('#sr-header-area .sr-bar');
        const srBar = srBars[1]; // 2つ目（登録サブレディット）を使用
        
        if (!srBar) {
            console.warn('[ORP Sort] Second .sr-bar (user subreddits) not found');
            return [];
        }
        
        const items = Array.from(srBar.querySelectorAll('li'));
        console.log('[ORP Sort] Total subreddit items found:', items.length);
        
        // 各li要素から情報を抽出（separatorを除外）
        return items.map(item => {
            const link = item.querySelector('a.choice');
            if (!link) return null;
            
            return {
                href: link.getAttribute('href') || '',
                name: link.textContent?.trim() || ''
            };
        }).filter(item => item && item.href && item.name);
    }
    
    function renderSortList() {
        console.log('[ORP Sort] renderSortList called');
        const listContainer = document.getElementById('orp-sort-list');
        if (!listContainer) {
            console.warn('[ORP Sort] List container not found');
            return;
        }
        
        const items = getSortableItems();
        currentSortOrder = [...items];
        originalSortOrder = [...items];
        
        listContainer.innerHTML = '';
        
        if (items.length === 0) {
            console.warn('[ORP Sort] No sortable subreddits found');
            listContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-secondary);">
                登録されたサブレディットが見つかりませんでした
            </div>`;
            return;
        }
        
        console.log('[ORP Sort] Rendering', items.length, 'subreddits');
        
        currentSortOrder.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'orp-sort-item';
            
            // 連番
            const numberEl = document.createElement('div');
            numberEl.className = 'orp-sort-number';
            numberEl.textContent = (index + 1).toString();
            
            // ↑↑ボタン（最上位に移動、最初の項目は作成しない）
            let upUpBtn;
            if (index > 0) {
                upUpBtn = document.createElement('button');
                upUpBtn.className = 'orp-sort-btn';
                upUpBtn.textContent = '↑↑';
                upUpBtn.type = 'button';
                upUpBtn.addEventListener('click', () => {
                    const movedItem = currentSortOrder.splice(index, 1)[0];
                    currentSortOrder.unshift(movedItem);
                    updateSortList();
                });
            }
            
            // ↑ボタン（1つ上に移動、最初の項目は作成しない）
            let upBtn;
            if (index > 0) {
                upBtn = document.createElement('button');
                upBtn.className = 'orp-sort-btn';
                upBtn.textContent = '↑';
                upBtn.type = 'button';
                upBtn.addEventListener('click', () => {
                    [currentSortOrder[index - 1], currentSortOrder[index]] = [currentSortOrder[index], currentSortOrder[index - 1]];
                    updateSortList();
                });
            }
            
            // ↓ボタン（1つ下に移動、最下段の項目は作成しない）
            let downBtn;
            if (index < currentSortOrder.length - 1) {
                downBtn = document.createElement('button');
                downBtn.className = 'orp-sort-btn';
                downBtn.textContent = '↓';
                downBtn.type = 'button';
                downBtn.addEventListener('click', () => {
                    [currentSortOrder[index], currentSortOrder[index + 1]] = [currentSortOrder[index + 1], currentSortOrder[index]];
                    updateSortList();
                });
            }
            
            // ↓↓ボタン（最下位に移動、最下段の項目は作成しない）
            let downDownBtn;
            if (index < currentSortOrder.length - 1) {
                downDownBtn = document.createElement('button');
                downDownBtn.className = 'orp-sort-btn';
                downDownBtn.textContent = '↓↓';
                downDownBtn.type = 'button';
                downDownBtn.addEventListener('click', () => {
                    const movedItem = currentSortOrder.splice(index, 1)[0];
                    currentSortOrder.push(movedItem);
                    updateSortList();
                });
            }
            
            // サブレディット名
            const nameEl = document.createElement('div');
            nameEl.className = 'orp-sort-name';
            nameEl.textContent = item.name;
            
            row.appendChild(numberEl);
            if (upUpBtn) row.appendChild(upUpBtn);
            else row.appendChild(document.createElement('div'));
            if (upBtn) row.appendChild(upBtn);
            else row.appendChild(document.createElement('div'));
            if (downBtn) row.appendChild(downBtn);
            else row.appendChild(document.createElement('div'));
            if (downDownBtn) row.appendChild(downDownBtn);
            else row.appendChild(document.createElement('div'));
            row.appendChild(nameEl);
            
            listContainer.appendChild(row);
        });
    }
    
    function updateSortList() {
        const listContainer = document.getElementById('orp-sort-list');
        if (!listContainer) return;
        
        listContainer.innerHTML = '';
        
        currentSortOrder.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'orp-sort-item';
            
            const numberEl = document.createElement('div');
            numberEl.className = 'orp-sort-number';
            numberEl.textContent = (index + 1).toString();
            
            // ↑↑ボタン（最上位に移動）
            let upUpBtn;
            if (index > 0) {
                upUpBtn = document.createElement('button');
                upUpBtn.className = 'orp-sort-btn';
                upUpBtn.textContent = '↑↑';
                upUpBtn.type = 'button';
                upUpBtn.addEventListener('click', () => {
                    const movedItem = currentSortOrder.splice(index, 1)[0];
                    currentSortOrder.unshift(movedItem);
                    updateSortList();
                });
            }
            
            // ↑ボタン（1つ上に移動）
            let upBtn;
            if (index > 0) {
                upBtn = document.createElement('button');
                upBtn.className = 'orp-sort-btn';
                upBtn.textContent = '↑';
                upBtn.type = 'button';
                upBtn.addEventListener('click', () => {
                    [currentSortOrder[index - 1], currentSortOrder[index]] = [currentSortOrder[index], currentSortOrder[index - 1]];
                    updateSortList();
                });
            }
            
            // ↓ボタン（1つ下に移動）
            let downBtn;
            if (index < currentSortOrder.length - 1) {
                downBtn = document.createElement('button');
                downBtn.className = 'orp-sort-btn';
                downBtn.textContent = '↓';
                downBtn.type = 'button';
                downBtn.addEventListener('click', () => {
                    [currentSortOrder[index], currentSortOrder[index + 1]] = [currentSortOrder[index + 1], currentSortOrder[index]];
                    updateSortList();
                });
            }
            
            // ↓↓ボタン（最下位に移動）
            let downDownBtn;
            if (index < currentSortOrder.length - 1) {
                downDownBtn = document.createElement('button');
                downDownBtn.className = 'orp-sort-btn';
                downDownBtn.textContent = '↓↓';
                downDownBtn.type = 'button';
                downDownBtn.addEventListener('click', () => {
                    const movedItem = currentSortOrder.splice(index, 1)[0];
                    currentSortOrder.push(movedItem);
                    updateSortList();
                });
            }
            
            const nameEl = document.createElement('div');
            nameEl.className = 'orp-sort-name';
            nameEl.textContent = item.name;
            
            row.appendChild(numberEl);
            if (upUpBtn) row.appendChild(upUpBtn);
            else row.appendChild(document.createElement('div'));
            if (upBtn) row.appendChild(upBtn);
            else row.appendChild(document.createElement('div'));
            if (downBtn) row.appendChild(downBtn);
            else row.appendChild(document.createElement('div'));
            if (downDownBtn) row.appendChild(downDownBtn);
            else row.appendChild(document.createElement('div'));
            row.appendChild(nameEl);
            
            listContainer.appendChild(row);
        });
    }
    
    function saveSortOrder() {
        const orderMap = {};
        currentSortOrder.forEach((item, index) => {
            orderMap[item.href] = index;
        });
        
        const jsonString = JSON.stringify(orderMap);
        console.log('[ORP] Saving sort order:', jsonString.substring(0, 100) + '...');
        storage.set('subredditOrder', jsonString, true); // isJSON=trueでサニタイズをスキップ
        
        // 保存後に確認
        const saved = localStorage.getItem('subredditOrder');
        console.log('[ORP] Verification - saved value:', saved?.substring(0, 100) + '...');
        
        // 実際のDOMにも反映（2つ目の.sr-bar = 登録サブレディット）
        const srBars = document.querySelectorAll('#sr-header-area .sr-bar');
        const srBar = srBars[1];
        if (!srBar) return;
        
        const items = Array.from(srBar.querySelectorAll('li'));
        
        // スペーサーを保持
        const separator = srBar.querySelector('.orp-separator');
        
        // 現在のソート順でDOMを並び替え
        currentSortOrder.forEach(sortItem => {
            const li = items.find(i => i.querySelector('a')?.getAttribute('href') === sortItem.href);
            if (li) srBar.appendChild(li);
        });
        
        // スペーサーを先頭に戻す
        if (separator && srBar.firstChild !== separator) {
            srBar.insertBefore(separator, srBar.firstChild);
        }
        
        originalSortOrder = [...currentSortOrder];
        console.log('[ORP] ✅ Sort order saved successfully');
    }
    
    // ローディング表示を追加
    function showSortLoading() {
        const srBars = document.querySelectorAll('#sr-header-area .sr-bar');
        const srBar = srBars[1];
        if (!srBar) return;
        
        // 既存のローディング表示があれば削除
        const existing = srBar.querySelector('.orp-sort-loading');
        if (existing) existing.remove();
        
        const loadingLi = document.createElement('li');
        loadingLi.className = 'orp-sort-loading';
        loadingLi.style.cssText = 'color: #888; font-style: italic; pointer-events: none;';
        const lang = document.documentElement.lang;
        loadingLi.textContent = lang === 'ja' ? 'サブレ順読み込み中...' : 'Loading subreddit order...';
        srBar.insertBefore(loadingLi, srBar.firstChild);
    }
    
    // ローディング表示を削除
    function hideSortLoading() {
        const loadingElements = document.querySelectorAll('.orp-sort-loading');
        loadingElements.forEach(el => el.remove());
    }
    
    // 再読み込みボタンを表示（設定ボタンの下）
    function showSortReloadButton() {
        const sidebar = document.querySelector('#sr-header-area');
        if (!sidebar) return;
        
        const widthClip = sidebar.querySelector('.width-clip');
        if (!widthClip) return;
        
        // 既存のボタンがあれば削除
        const existing = document.getElementById('orp-sort-reload-button');
        if (existing) existing.remove();
        
        const reloadBtn = document.createElement('button');
        reloadBtn.id = 'orp-sort-reload-button';
        reloadBtn.setAttribute('type', 'button');
        reloadBtn.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            padding: 8px 12px;
            background: #ff4500;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            z-index: 100;
        `;
        const lang = document.documentElement.lang;
        reloadBtn.textContent = lang === 'ja' ? '🔄 ソート順を再読み込み' : '🔄 Reload sort order';
        reloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            reloadBtn.remove();
            loadSortOrderWithRetry();
        });
        widthClip.appendChild(reloadBtn);
    }
    
    // ソート順を読み込む（実際の処理）
    function loadSortOrder() {
        console.log('[ORP] loadSortOrder() called');
        const savedOrder = storage.get('subredditOrder');
        if (!savedOrder) {
            console.log('[ORP] No saved sort order found in storage');
            return false;
        }
        
        console.log('[ORP] Saved order found:', savedOrder.substring(0, 100) + '...');
        
        try {
            const orderMap = JSON.parse(savedOrder);
            console.log('[ORP] Parsed order map:', Object.keys(orderMap).length, 'items');
            
            // 2つ目の.sr-bar（登録サブレディット）を取得
            const srBars = document.querySelectorAll('#sr-header-area .sr-bar');
            console.log('[ORP] Found .sr-bar elements:', srBars.length);
            
            const srBar = srBars[1];
            if (!srBar) {
                console.warn('[ORP] Subreddit bar not found (srBar[1] is undefined)');
                console.warn('[ORP] Available srBars:', srBars.length);
                return false;
            }
            
            const items = Array.from(srBar.querySelectorAll('li'));
            console.log('[ORP] Found <li> items in srBar[1]:', items.length);
            
            if (items.length === 0) {
                console.warn('[ORP] No subreddit items found in the bar');
                return false;
            }
            
            // 2つ目の.sr-barにはすべて登録サブレディットが入っているので、固定項目は不要
            // スペーサーもソート対象から除外
            const sortableItems = items.filter(item => 
                !item.classList.contains('orp-sort-loading') && 
                !item.classList.contains('orp-sort-reload') &&
                !item.classList.contains('orp-separator')
            );
            console.log('[ORP] Sortable items:', sortableItems.length);
            
            // ソート前の順序をログ出力
            console.log('[ORP] Before sort:', sortableItems.slice(0, 5).map(i => i.querySelector('a')?.textContent));
            
            sortableItems.sort((a, b) => {
                const aHref = a.querySelector('a')?.getAttribute('href') || '';
                const bHref = b.querySelector('a')?.getAttribute('href') || '';
                const aIndex = orderMap[aHref] !== undefined ? orderMap[aHref] : 999;
                const bIndex = orderMap[bHref] !== undefined ? orderMap[bHref] : 999;
                return aIndex - bIndex;
            });
            
            // ソート後の順序をログ出力
            console.log('[ORP] After sort:', sortableItems.slice(0, 5).map(i => i.querySelector('a')?.textContent));
            
            // スペーサーを保持
            const separator = srBar.querySelector('.orp-separator');
            
            // ソート済みアイテムをDOMに反映
            sortableItems.forEach(item => srBar.appendChild(item));
            
            // スペーサーを先頭に戻す
            if (separator && srBar.firstChild !== separator) {
                srBar.insertBefore(separator, srBar.firstChild);
            }
            
            console.log('[ORP] ✅ Sort order loaded and applied successfully');
            return true;
        } catch (e) {
            console.error('[ORP] ❌ Failed to load sort order:', e);
            return false;
        }
    }
    
    // リトライ機能付きでソート順を読み込む
    function loadSortOrderWithRetry(attempt = 0, maxAttempts = 3, delay = 150) {
        if (attempt === 0) {
            showSortLoading();
        }
        
        const success = loadSortOrder();
        
        if (success) {
            hideSortLoading();
            return;
        }
        
        if (attempt < maxAttempts - 1) {
            console.log(`[ORP] Retrying to load sort order (${attempt + 1}/${maxAttempts})...`);
            setTimeout(() => {
                loadSortOrderWithRetry(attempt + 1, maxAttempts, delay);
            }, delay);
        } else {
            console.warn('[ORP] Failed to load sort order after all retries');
            hideSortLoading();
            showSortReloadButton();
        }
    }
    
    function initSortFeature() {
        const saveBtn = document.getElementById('orp-sort-save');
        const cancelBtn = document.getElementById('orp-sort-cancel');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                saveSortOrder();
                const overlay = document.getElementById('orp-settings-overlay');
                if (overlay) {
                    overlay.classList.remove('show');
                    document.body.classList.remove('settings-open');
                }
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                currentSortOrder = [...originalSortOrder];
                updateSortList();
            });
        }
        
        // loadSortOrder()の呼び出しは削除（init()から遅延実行される）
    }
    
    function initDarkMode() {
        const isDarkMode = storage.get('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        const isDarkModeRight = storage.get('darkModeRight') === 'true';
        if (isDarkModeRight) {
            document.body.classList.add('dark-mode-right');
            
            // RIGHT側フルダークモード（RIGHT側ダークモードがONの場合のみ）
            const isDarkModeRightFull = storage.get('darkModeRightFull') === 'true';
            if (isDarkModeRightFull) {
                document.body.classList.add('dark-mode-right-full');
            }
        }
    }
    
    function insertSeparator() {
        const srBars = document.querySelectorAll('#sr-header-area .sr-bar');
        const userSubsBar = srBars[1]; // 登録サブレディット
        
        if (!userSubsBar) {
            console.warn('[ORP] User subreddits bar not found, separator not inserted');
            return;
        }
        
        // すでにスペーサーが存在する場合は追加しない
        if (userSubsBar.querySelector('.orp-separator')) {
            return;
        }
        
        // スペーサーを作成
        const separator = document.createElement('li');
        separator.className = 'orp-separator';
        
        // 登録サブレディットバーの最初に挿入
        if (userSubsBar.firstChild) {
            userSubsBar.insertBefore(separator, userSubsBar.firstChild);
        } else {
            userSubsBar.appendChild(separator);
        }
        
        console.log('[ORP] Separator inserted successfully');
    }
    
    function initLeftSidebar(button) {
        // スペーサー（区切り線）を挿入
        insertSeparator();
        
        // ページロード時は常にSUBSを閉じた状態で開始（ページ遷移時の暗転を防ぐ）
        document.body.classList.remove('show-left');
        storage.set('leftSidebarVisible', false);
        button.style.display = '';
        
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            document.body.classList.toggle('show-left');
            const isNowVisible = document.body.classList.contains('show-left');
            storage.set('leftSidebarVisible', isNowVisible);
            
            // SUBS表示時はフロートボタンを非表示
            if (isNowVisible) {
                button.style.display = 'none';
            }
        });
        
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('sr-header-area');
            const isOpen = document.body.classList.contains('show-left');
            
            if (isOpen && sidebar && !sidebar.contains(e.target) && e.target !== button) {
                document.body.classList.remove('show-left');
                storage.set('leftSidebarVisible', false);
                // SUBSがひっこんだらフロートボタンを表示
                button.style.display = '';
            }
        });
        
        const sidebar = document.getElementById('sr-header-area');
        if (sidebar) {
            sidebar.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // SUBSメニュー内のリンククリック時に即座にメニューを閉じる
                if (e.target.tagName === 'A') {
                    document.body.classList.remove('show-left');
                    storage.set('leftSidebarVisible', false);
                    // フロートボタンを表示
                    button.style.display = '';
                }
            });
        }
    }
    
    function updateSubsPosition() {
        // ヘッダーの実際の高さを取得してSUBSの位置を動的に調整
        const header = document.getElementById('header');
        const subs = document.getElementById('sr-header-area');
        
        if (header && subs) {
            const headerHeight = header.offsetHeight || 0;
            subs.style.top = `${headerHeight}px`;
            subs.style.height = `calc(100vh - ${headerHeight}px)`;
            console.log('[NOR] SUBS position updated: headerHeight =', headerHeight);
        }
    }
    
    // ===================================
    // 言語リソース（多言語対応）
    // ===================================
    const i18n = {
        en: {
            language: {
                label: 'Language'
            },
            buttons: {
                leftToggle: 'Toggle LEFT sidebar',
                settingsText: '⚙️ Settings',
                settingsTitle: 'Open settings panel'
            },
            settings: {
                title: 'OldRedditPlus Settings',
                close: '×'
            },
            tabs: {
                menuButton: 'Menu Button',
                menu: 'Menu',
                sort: 'Sort'
            },
            sort: {
                save: 'Save',
                cancel: 'Cancel'
            },
            darkMode: {
                label: 'Dark Mode',
                description: 'Toggle dark mode on/off (RIGHT side is excluded as much as possible)'
            },
            darkModeRight: {
                label: 'RIGHT Side Dark Mode',
                description: 'Apply minimal dark mode to the RIGHT sidebar (safe common styles only)'
            },
            darkModeRightFull: {
                label: '⚠️ Apply Full Dark Mode',
                description: 'WARNING: May break subreddit-specific designs'
            },
            menuColor: {
                label: 'Menu Button Color Settings',
                description: 'Set the background color of the left sidebar toggle button (adjust in 5-step increments)',
                preview: 'Preview:'
            },
            menuSize: {
                label: 'Menu Button Size Settings',
                description: 'Set the width and height of the left sidebar toggle button',
                width: 'Width:',
                height: 'Height:',
                reset: 'Reset to Default'
            },
            menuOffset: {
                label: 'Vertical Offset Settings',
                description: 'Adjust the vertical position of the menu button (negative = up, positive = down)',
                position: 'Position:',
                reset: 'Reset to Default'
            },
            subsSettings: {
                fontSize: {
                    label: 'SUBS Font Size',
                    description: 'Set the font size of subreddit names',
                    size: 'Size:',
                    reset: 'Default'
                },
                margin: {
                    label: 'SUBS Row Vertical Margin',
                    description: 'Set the vertical margin of subreddit rows',
                    margin: 'Margin:',
                    reset: 'Default'
                },
                topOffset: {
                    label: 'SUBS Top Offset',
                    description: 'Adjust the top position of the subreddit list',
                    offset: 'Offset:',
                    reset: 'Default'
                },
                lrOffset: {
                    label: 'SUBS Horizontal Offset',
                    description: 'Adjust the horizontal position of subreddit names',
                    offset: 'Offset:',
                    reset: 'Default'
                }
            },
            preview: {
                title: 'Preview'
            }
        },
        ja: {
            language: {
                label: '言語'
            },
            buttons: {
                leftToggle: 'LEFTサイドバーの表示/非表示',
                settingsText: '⚙️ 設定',
                settingsTitle: '設定画面を開く'
            },
            settings: {
                title: 'Oldredditplus設定画面',
                close: '×'
            },
            tabs: {
                menuButton: 'メニューボタン',
                menu: 'メニュー',
                sort: 'ソート'
            },
            sort: {
                save: '保存',
                cancel: 'キャンセル'
            },
            darkMode: {
                label: 'ダークモード',
                description: 'ダークモードのオン/オフを切り替えます（RIGHT側はなるべく除外）'
            },
            darkModeRight: {
                label: 'RIGHT側ダークモード',
                description: 'RIGHT側サイドバーにも最小限のダークモードを適用します（サブレディット共通で安全な範囲のみ）'
            },
            darkModeRightFull: {
                label: '⚠️ フルダークモードを適用',
                description: '問題が起こりやすいです：サブレディット固有のデザインが崩れる可能性があります'
            },
            menuColor: {
                label: 'メニューボタンの色設定',
                description: '左サイドバートグルボタンの背景色を設定します（5段階で調整）',
                preview: 'プレビュー:'
            },
            menuSize: {
                label: 'メニューボタンのサイズ設定',
                description: '左サイドバートグルボタンの幅と高さを設定します',
                width: '幅:',
                height: '高さ:',
                reset: '規定値にリセット'
            },
            menuOffset: {
                label: '上下オフセット設定',
                description: 'メニューボタンの上下位置を調整します（マイナスで上、プラスで下）',
                position: '位置:',
                reset: '規定値にリセット'
            },
            subsSettings: {
                fontSize: {
                    label: 'SUBS文字サイズ',
                    description: 'サブレディット名の文字サイズを設定します',
                    size: 'サイズ:',
                    reset: '規定値'
                },
                margin: {
                    label: 'SUBS行の上下マージン',
                    description: 'サブレディット行の上下マージンを設定します',
                    margin: 'マージン:',
                    reset: '規定値'
                },
                topOffset: {
                    label: 'SUBS上端オフセット',
                    description: 'サブレディットリストの上端位置を調整します',
                    offset: 'オフセット:',
                    reset: '規定値'
                },
                lrOffset: {
                    label: 'SUBS文字列の左右オフセット',
                    description: 'サブレディット名の左右位置を調整します',
                    offset: 'オフセット:',
                    reset: '規定値'
                }
            },
            preview: {
                title: 'プレビュー'
            }
        }
    };
    
    // 現在の言語を保持（デフォルトは英語）
    let currentLang = storage.get('language', 'en');
    if (currentLang !== 'en' && currentLang !== 'ja') {
        currentLang = 'en';
    }
    
    // 言語リソースを取得するヘルパー関数
    function t(path) {
        const keys = path.split('.');
        let result = i18n[currentLang];
        for (const key of keys) {
            result = result[key];
            if (!result) {
                console.warn(`[NOR] Missing translation: ${path} (${currentLang})`);
                return path;
            }
        }
        return result;
    }
    
    // 言語を変更してUIを更新
    function updateLanguage(lang) {
        if (lang !== 'en' && lang !== 'ja') {
            console.warn(`[NOR] Invalid language: ${lang}`);
            return;
        }
        currentLang = lang;
        storage.set('language', lang);
        
        // ボタンのテキストを更新
        const leftToggleBtn = document.getElementById('orp-left-sidebar-toggle');
        if (leftToggleBtn) {
            leftToggleBtn.title = t('buttons.leftToggle');
        }
        
        const settingsBtn = document.getElementById('orp-settings-button');
        if (settingsBtn) {
            settingsBtn.textContent = t('buttons.settingsText');
            settingsBtn.title = t('buttons.settingsTitle');
        }
        
        // 設定パネルが存在する場合は更新
        updateSettingsPanelLanguage();
    }
    
    // 設定パネルの言語を更新
    function updateSettingsPanelLanguage() {
        const panel = document.getElementById('orp-settings-panel');
        if (!panel) return;
        
        // タイトル
        const title = panel.querySelector('#orp-settings-header h2');
        if (title) title.textContent = t('settings.title');
        
        // タブ
        const tabMenuButton = panel.querySelector('[data-tab="menu-button"]');
        if (tabMenuButton) tabMenuButton.textContent = t('tabs.menuButton');
        
        const tabMenu = panel.querySelector('[data-tab="menu"]');
        if (tabMenu) tabMenu.textContent = t('tabs.menu');
        
        const tabSort = panel.querySelector('[data-tab="sort"]');
        if (tabSort) tabSort.textContent = t('tabs.sort');
        
        // ソートボタン
        const sortSaveBtn = document.getElementById('orp-sort-save');
        if (sortSaveBtn) sortSaveBtn.textContent = t('sort.save');
        
        const sortCancelBtn = document.getElementById('orp-sort-cancel');
        if (sortCancelBtn) sortCancelBtn.textContent = t('sort.cancel');
        
        // 各設定項目
        const updates = [
            { selector: '[data-i18n="language.label"]', text: t('language.label') },
            { selector: '[data-i18n="darkMode.label"]', text: t('darkMode.label') },
            { selector: '[data-i18n="darkMode.description"]', text: t('darkMode.description') },
            { selector: '[data-i18n="darkModeRight.label"]', text: t('darkModeRight.label') },
            { selector: '[data-i18n="darkModeRight.description"]', text: t('darkModeRight.description') },
            { selector: '[data-i18n="darkModeRightFull.label"]', text: t('darkModeRightFull.label') },
            { selector: '[data-i18n="darkModeRightFull.description"]', text: t('darkModeRightFull.description') },
            { selector: '[data-i18n="menuColor.label"]', text: t('menuColor.label') },
            { selector: '[data-i18n="menuColor.description"]', text: t('menuColor.description') },
            { selector: '[data-i18n="menuColor.preview"]', text: t('menuColor.preview') },
            { selector: '[data-i18n="menuSize.label"]', text: t('menuSize.label') },
            { selector: '[data-i18n="menuSize.description"]', text: t('menuSize.description') },
            { selector: '[data-i18n="menuSize.width"]', text: t('menuSize.width') },
            { selector: '[data-i18n="menuSize.height"]', text: t('menuSize.height') },
            { selector: '[data-i18n="menuSize.reset"]', text: t('menuSize.reset') },
            { selector: '[data-i18n="menuOffset.label"]', text: t('menuOffset.label') },
            { selector: '[data-i18n="menuOffset.description"]', text: t('menuOffset.description') },
            { selector: '[data-i18n="menuOffset.position"]', text: t('menuOffset.position') },
            { selector: '[data-i18n="menuOffset.reset"]', text: t('menuOffset.reset') },
            { selector: '[data-i18n="subsSettings.fontSize.label"]', text: t('subsSettings.fontSize.label') },
            { selector: '[data-i18n="subsSettings.fontSize.description"]', text: t('subsSettings.fontSize.description') },
            { selector: '[data-i18n="subsSettings.fontSize.size"]', text: t('subsSettings.fontSize.size') },
            { selector: '[data-i18n="subsSettings.fontSize.reset"]', text: t('subsSettings.fontSize.reset') },
            { selector: '[data-i18n="subsSettings.margin.label"]', text: t('subsSettings.margin.label') },
            { selector: '[data-i18n="subsSettings.margin.description"]', text: t('subsSettings.margin.description') },
            { selector: '[data-i18n="subsSettings.margin.margin"]', text: t('subsSettings.margin.margin') },
            { selector: '[data-i18n="subsSettings.margin.reset"]', text: t('subsSettings.margin.reset') },
            { selector: '[data-i18n="subsSettings.topOffset.label"]', text: t('subsSettings.topOffset.label') },
            { selector: '[data-i18n="subsSettings.topOffset.description"]', text: t('subsSettings.topOffset.description') },
            { selector: '[data-i18n="subsSettings.topOffset.offset"]', text: t('subsSettings.topOffset.offset') },
            { selector: '[data-i18n="subsSettings.topOffset.reset"]', text: t('subsSettings.topOffset.reset') },
            { selector: '[data-i18n="subsSettings.lrOffset.label"]', text: t('subsSettings.lrOffset.label') },
            { selector: '[data-i18n="subsSettings.lrOffset.description"]', text: t('subsSettings.lrOffset.description') },
            { selector: '[data-i18n="subsSettings.lrOffset.offset"]', text: t('subsSettings.lrOffset.offset') },
            { selector: '[data-i18n="subsSettings.lrOffset.reset"]', text: t('subsSettings.lrOffset.reset') },
            { selector: '[data-i18n="preview.title"]', text: t('preview.title') }
        ];
        
        updates.forEach(({ selector, text }) => {
            const el = panel.querySelector(selector);
            if (el) el.textContent = text;
        });
    }
    
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        const buttons = createToggleButtons();
        if (buttons) {
            initDarkMode();
            initLeftSidebar(buttons.leftToggleBtn);
            initSettingsPanel();
            
            // SUBS位置の初期設定と動的更新
            updateSubsPosition();
            // ウィンドウリサイズ時に再計算
            window.addEventListener('resize', updateSubsPosition);
            // ヘッダー変更を監視（MutationObserver）
            const header = document.getElementById('header');
            if (header) {
                const observer = new MutationObserver(updateSubsPosition);
                observer.observe(header, { attributes: true, childList: true, subtree: true });
            }
            
            // ソート順を遅延読み込み（Reddit側のDOM生成を待つ）
            setTimeout(() => {
                loadSortOrderWithRetry();
            }, 100);
            
            console.log('[NOR] Overlay MVP with Settings Panel initialized');
        }
    }
    
    init();
})();
