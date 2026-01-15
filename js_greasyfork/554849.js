// ==UserScript==
// @name        BetterExercises
// @include     *://mec-itutor.jp/rpv/home/question/practice*
// @description mec-itutorの演習画面を修正
// @author      Nozom.u
// @run-at      document-end
// @version     2.2.0
// @namespace https://greasyfork.org/users/1534273
// @downloadURL https://update.greasyfork.org/scripts/554849/BetterExercises.user.js
// @updateURL https://update.greasyfork.org/scripts/554849/BetterExercises.meta.js
// ==/UserScript==

/* global $ */
/* global Sys */
(function () {
  "use strict";

  // ===== CSS追加（省略）=====
  const style = document.createElement("style");
  style.textContent = `
        /* カラー変数定義 */
    :root {
    --primary-color: #0a8c95;
    --success-color: #43a047;
    --success-color-border: #159A7F;
    --error-color: #d32f2f;
    --error-color-border: #3C757C;
    --icon-color: white;
    --button-text-color: white;
    --button-shadow: 0 5px 7px -5px rgba(0,0,0,0.3);
    }

    /******************************/
    /* 基本リセット */

    body {
    margin: 0 !important;
    position: relative !important;
    padding-bottom: 0 !important;
    box-sizing: border-box !important;
    }
    hr {
    display: none !important;
    }
    img {
    width: 100% !important;
    }
    div, p {
    margin: 0 !important;
    padding: 0 !important;
    }

    /******************************/
    /* ヘッダエリア */

    /* メインヘッダコンテナ */
    #aspnetForm > div.container-fluid.player-wrap {
    height: 6em !important;
    margin-top: -3.5em !important;
    padding: 3em 2em 0 2em !important;
    line-height: 3em !important;
    background-color: white !important;
    border-bottom: 0.2em solid var(--primary-color) !important;
    box-shadow: 0 0.4em 0.7em -0.5em rgba(0, 0, 0, 0.2) !important;
    }

    /* 正答時のヘッダ下線 */
    #aspnetForm > div.container-fluid.player-wrap:has(~ #ctl00_cplPageContent_upd1 p.h4.text-success) {
    border-bottom: 0.2em solid var(--success-color-border) !important;
    }

    /* 誤答時のヘッダ下線 */
    #aspnetForm > div.container-fluid.player-wrap:has(~ #ctl00_cplPageContent_upd1 p.h4.text-danger) {
    border-bottom: 0.2em solid var(--error-color) !important;
    }

    /* ヘッダナビゲーションエリア */
    #head_area {
    height: 3em !important;
    line-height: 3em !important;
    display: flex !important;
    }

    /* 左ヘッダ（問題タイトルエリア） */
    #head_area > div.col-xs-3.text-left {
    height: 3em !important;
    line-height: 3em !important;
    width: fit-content !important;
    }

    /* 問題タイトルテキスト */
    #head_area > div.col-xs-3.text-left > p {
    height: 3em !important;
    line-height: 3em !important;
    font-weight: bold !important;
    letter-spacing: 0.03em !important;
    color: #363636 !important;
    position: relative !important;
    bottom: 0.1em !important;
    text-wrap-mode: nowrap;
    }

    /* 中央ヘッダ（連問の問題番号表示） */
    #divTime {
    display: flex !important;
    justify-content: space-around !important;
    align-items: center !important;
    height: 1.6em !important;
    padding: 0.1em 1em 0 1em !important;
    margin-top: auto !important;
    margin-bottom: 0em !important;
    margin-left: 1em !important;
    font-size: 1.2em !important;
    font-weight: bold !important;
    width: fit-content !important;
    border-bottom: transparent 0.15em solid !important;
    border-radius: 0.5em 0.5em 0 0 !important;
    background-color: var(--primary-color) !important;
    color: white !important;
    letter-spacing: 0.05em !important;
    text-wrap-mode: nowrap;
    }
    #divTime:empty {
    display: none !important;
    }

    /* 右ヘッダ（タイマーエリア） */
    #head_area > div.col-xs-3.text-right {
    height: 3em !important;
    line-height: 3em !important;
    margin-left: auto !important;
    flex: 1 !important;
    }

    /* タイマー表示 */
    #timer {
    height: 3em !important;
    line-height: 3em !important;
    color: #363636 !important;
    margin: 0 !important;
    position: relative !important;
    bottom: -0.5em !important;
    text-wrap: nowrap;
    }

    /******************************/
    /* メインコンテンツエリア */

    /* メインコンテナ */
    #ctl00_cplPageContent_upd1 {
    display: flex !important;
    flex-direction: column !important;
    min-height: 100vh !important;
    }

    /* 問題・解答・確信度コンテナ */
    #ctl00_cplPageContent_upd1 > div.container.pb70 {
    margin: 0 2.5% 3em 2.5% !important;
    padding: 0 !important;
    width: 95% !important;
    }

    /* 問題表示エリア */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.well.mec-bg-none.mt40 {
    border: none !important;
    margin-top: 1em !important;
    margin-bottom: 0em !important;
    box-shadow: none !important;
    }

    /* 解答入力エリア */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 {
    width: 100% !important;
    min-height: 6em !important;
    margin: 2em 0 1em 0 !important;
    padding: 2em 1em 0 1em !important;
    border-top: var(--primary-color) dashed 0.2em !important;
    }

    /* 確信度入力エリア */
    #ctl00_cplPageContent_certaintyFactorArea {
    width: 90% !important;
    height: 4em !important;
    margin: 0 0 4em 0 !important;
    padding: 0 1em 0 1em !important;
    }

    /* 解答・確信度エリア共通コンテナ */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div,
    #ctl00_cplPageContent_certaintyFactorArea > div {
    display: flex !important;
    align-items: flex-start !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    min-height: 2em !important;
    }

    /* 隠し問題タイトル */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.well.mec-bg-none.mt40 > p.h4 {
    color: white !important;
    height: 0.1px !important;
    font-size: 0 !important;
    }

    /* 解答後の問題タイトル非表示 */
    p.h4.text-danger ~ div.well.mec-bg-none.mt40 > p.h4,
    p.h4.text-success ~ div.well.mec-bg-none.mt40 > p.h4 {
    display: none !important;
    }

    /* 解答後の問題エリア調整 */
    p.h4.text-danger ~ div.well.mec-bg-none.mt40,
    p.h4.text-success ~ div.well.mec-bg-none.mt40 {
    width: 100% !important;
    margin: 0 0% 0 0% !important;
    }

    /* 正解・不正解表示 */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p.h4.text-success,
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p.h4.text-danger {
    width: 100% !important;
    height: 3em !important;
    padding-left: 2em !important;
        margin: 0 0 -1em 0 !important;
    font-weight: bold !important;
    font-size: 1.5em !important;
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    }

    /* 正解表示の色 */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p.h4.text-success {
    color: var(--success-color) !important;
    }

    /* 不正解表示の色 */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p.h4.text-danger {
    color: var(--error-color) !important;
    }

    /* デフォルトアイコンサイズ調整 */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p.h4.text-success i.fa,
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p.h4.text-danger i.fa {
    font-size: 1.5em !important;
    margin-right: 0.5em !important;
    vertical-align: middle !important;
    }
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p.h4.text-success > i {
        margin-right: 0 !important;
    }

    /******************************/
    /* セクションラベル */

    /* 解答・確信度・解説ラベル共通スタイル */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > p,
    #ctl00_cplPageContent_certaintyFactorArea > div > p,
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p:nth-child(5) {
    margin: 0 1em 0 0 !important;
    padding: 0 !important;
    font-size: 1.2em !important;
    font-weight: bold !important;
    width: 5em !important;
    height: 2em !important;
    line-height: 2em !important;
    background-color: var(--primary-color) !important;
    color: white !important;
    border-radius: 0.2em !important;
    box-shadow: var(--button-shadow) !important;
    }

    /* 解答・解説ラベルの文字間隔 */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > p,
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p:nth-child(5) {
    padding: 0 0 0.3em 0.4em !important;
    letter-spacing: 0.5em !important;
    text-wrap-mode: nowrap;
    }

    /* 解説ラベルの下マージン */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p:nth-child(5) {
    margin-bottom: 0.5em !important;
    height: 1.8em !important;
    }

    /* 確信度ラベルの文字間隔 */
    #ctl00_cplPageContent_certaintyFactorArea > div > p {
    padding: 0 0 0 0.2em !important;
    letter-spacing: 0.05em !important;
    }

    /******************************/
    /* 計算問題UI */

    /* 計算結果表示エリア */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > div:nth-child(2):has(input#ctl00_cplPageContent_completeAnswer) {
    width: 12em !important;
    margin-right: -0.24em !important;
    height: 13.2em !important;
    background-color: #eee !important;
    border: var(--primary-color) 0.24em solid !important;
    border-radius: 0.2em 0 0 0.2em !important;
    text-align: center !important;
    line-height: 3.48em !important;
    }

    /* 計算結果表示ラベル */
    #ctl00_cplPageContent_completeAnswerLabel {
    width: 10em !important;
    margin: 0 !important;
    padding: 0 !important;
    font-size: 1.1em !important;
    background-color: #eee !important;
    color: black !important;
    }

    /* 数字ボタンエリア */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > div:nth-child(3):has(div.quiz-btn-wrap > #ctl00_cplPageContent_rptCompleteAnswer_ctl01_hplCompleteAnswer) {
    width: 8.3em !important;
    padding: 0.2em !important;
    margin: 0 !important;
    display: grid !important;
    grid-template-columns: repeat(3, 2.5em) !important;
    grid-template-rows: repeat(4, 2.5em) !important;
    gap: 0.2em !important;
    font-size: 1.2em !important;
    background-color: var(--primary-color) !important;
    border-radius: 0 0.24em 0.24em 0 !important;
    }

    /* 数字ボタンコンテナ */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > div:nth-child(3) > div:nth-child(1) {
    margin: 0 !important;
    display: contents !important;
    flex-wrap: wrap !important;
    }

    /* 数字ボタン */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > div:nth-child(3) > div:nth-child(1) > a.quiz-btn.btn-default {
    margin: 0 !important;
    padding: 0 !important;
    text-align: center !important;
    line-height: 2.7em !important;
    background-color: white !important;
    color: black !important;
    font-weight: bold !important;
    border-radius: 0.3em !important;
    }

    /* 計算クリアボタンコンテナ */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > div:nth-child(3) > div:nth-child(2) {
    margin: 0 !important;
    }

    /* 計算クリアボタン */
    #ctl00_cplPageContent_clearButton {
    margin: 0 !important;
    height: 3em !important;
    width: 6.2em !important;
    border-radius: 0.6em !important;
    }

    /******************************/
    /* 選択問題UI */

    /* 単一選択コンテナ */
    #divSingleSelection {
    margin: 0 !important;
    padding: 0 !important;
    display: flex !important;
    flex-wrap: wrap;
    }

    /* 選択肢ボタン共通スタイル */
    #divSingleSelection > .quiz-btn-radio.btn-default,
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > .quiz-btn-radio.btn-default {
    margin: 0 1em 0 0 !important;
    padding: 0 !important;
    font-size: 1.2em !important;
    font-weight: bold !important;
    height: 2em !important;
    line-height: 1.7em !important;
    text-align: center !important;
    width: 3.236em !important;
    border: 0.2em var(--primary-color) solid !important;
    border-radius: 0.5em !important;
    box-shadow: var(--button-shadow) !important;
    }

    /* 複数選択ボタンのパディング調整 */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > .quiz-btn-radio.btn-default {
    padding: 0 0.9em 0 0.3em !important;
    }

    /* ラジオボタン・チェックボックス非表示 */
    .quiz-btn-radio input[type="radio"],
    .quiz-btn-radio input[type="checkbox"] {
    display: none !important;
    }

    /* 選択済みボタンスタイル */
    .quiz-btn-radio input:checked + span,
    .quiz-btn-radio:has(input:checked) {
    background-color: var(--primary-color) !important;
    border: 0.2em #7d7d7d solid !important;
    color: white !important;
    }

    /* 選択クリアボタンコンテナ */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > div.quiz-btn-wrap {
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    height: auto !important;
    line-height: auto !important;
    box-shadow: var(--button-shadow) !important;
    }

    /* 選択クリアボタン */
    #ctl00_cplPageContent_singleClearButton {
    margin: 0 !important;
    padding: 0 !important;
    width: 3.236em !important;
    font-size: 1.2em !important;
    height: 2em !important;
    line-height: auto !important;
    border-radius: 0.2em !important;
    }
    /* 挿入した解説 */
    .injected-content-container {
        margin-top: 2em !important;
    }

    /******************************/
    /* 確信度UI */

    /* 確信度セレクトボックス */
    /* B-1-4-1-2 *//* 確信度セレクタ */
    #ctl00_cplPageContent_certaintyFactor {
        margin: 0 !important;
        padding: 0 !important;
        font-size: 1.2em !important;
        font-weight: bold !important;
        height: 2em !important;
        line-height: 1.6em !important;
        text-align: center !important;
        width: 6.472em !important;
        border: 0.2em var(--primary-color) solid !important;
        border-radius: 0.5em !important;
    }
    .toggle-buttons {
    display: flex;
    margin-top: 5px;
    }
    /* 確信度ボタン */
    #ctl00_cplPageContent_certaintyFactorArea > div > div > button {
        margin: 0 1em 0 0 !important;
        padding: 0.2em 1em 0.8em 1em !important;
        border: 0.2em solid #0c8891;
        border-radius: 0.5em !important;
        background-color: white;
        font-size: 1.2em !important;
        font-weight: bold !important;
        cursor: pointer;
        height: 2em !important;
        width: 3.236em !important;
        box-shadow: 0 5px 10px -5px rgba(0,0,0,0.5) !important;
    }
    /* 解答表示後は触れないようにする */
    body:has(#ctl00_cplPageContent_upd1 p.h4.text-success) #ctl00_cplPageContent_certaintyFactorArea > div > div > button ,
    body:has(#ctl00_cplPageContent_upd1 p.h4.text-danger) #ctl00_cplPageContent_certaintyFactorArea > div > div > button {
        cursor: not-allowed !important;
        opacity: 0.65 !important;
    }
    .toggle-buttons button.active {
    background-color: #0c8891 !important;
    color: white;
    }


    /******************************/
    /* フッターエリア */

    /* フッターコンテナ */
    #ctl00_cplPageContent_upd1 > div.navbar.navbar-fixed-bottom.navbar-default {
    margin-top: auto !important;
    padding: 0 !important;
    height: 4em !important;
    width: 100% !important;
    position: absolute !important; /* フッター固定ならコメントアウト */
    bottom: 0 !important; /* フッター固定ならコメントアウト */
    border: none !important;
    }

    /* フッターエリア */
    #foot_area {
    margin: 0 !important;
    padding: 0 !important;
    height: 4em !important;
    width: 100% !important;
    }

    /* フッターボタンコンテナ */
    #foot_area > div {
    margin: 0 !important;
    width: 100% !important;
    display: flex !important;
    }

    /* フッターボタン共通スタイル */
    #ctl00_cplPageContent_lbnSuspend,
    #ctl00_cplPageContent_lbnGrading,
    #ctl00_cplPageContent_lbnSkip,
    #ctl00_cplPageContent_lbnNext,
    #ctl00_cplPageContent_lbnFinish {
    width: 35% !important;
    font-size: 1.2em !important;
    font-weight: bold !important;
    border: 0.1em var(--primary-color) solid !important;
    border-radius: 1em !important;
    letter-spacing: 0.3em !important;
    height: 2.5em !important;
    }

    /* 中断ボタン（セカンダリスタイル） */
    #ctl00_cplPageContent_lbnSuspend {
    color: var(--primary-color) !important;
    background-color: var(--button-text-color) !important;
    box-shadow: var(--button-shadow) !important;
    margin: 0 3% 0 12% !important;
    }

    /* プライマリボタン共通（採点・次へ・終了） */
    #ctl00_cplPageContent_lbnGrading,
    #ctl00_cplPageContent_lbnSkip,
    #ctl00_cplPageContent_lbnNext,
    #ctl00_cplPageContent_lbnFinish {
    color: var(--button-text-color) !important;
    background-color: var(--primary-color) !important;
    box-shadow: var(--button-shadow) !important;
    margin: 0 12% 0 3% !important;
    }

    /******************************/
    /* アイコン追加 */

    /* 問題タイトルアイコン */
    #head_area > div.col-xs-3.text-left > p::before {
    font-family: 'Material Icons' !important;
    font-size: 1.2em !important;
    content: 'import_contacts' !important; /* import_contacts = \\e0e0*/
    color: var(--primary-color) !important;
    margin-right: 0.3em !important;
    position: relative !important;
    bottom: -0.1em !important;
    }

    /* 正答時の問題タイトルアイコン */
    body:has(#ctl00_cplPageContent_upd1 p.h4.text-success) #head_area > div.col-xs-3.text-left > p::before {
    content: 'favorite' !important; /* favorite = \\e87d */
    color: var(--success-color) !important;
    }

    /* 誤答時の問題タイトルアイコン */
    body:has(#ctl00_cplPageContent_upd1 p.h4.text-danger) #head_area > div.col-xs-3.text-left > p::before {
    content: 'thunderstorm' !important; /* thunderstorm = \\ebdb */
    color: var(--error-color) !important;
    }

    /* 択一選択アイコン */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > p:has(+ #divSingleSelection)::after {
    font-family: 'Material Icons' !important;
    content: "radio_button_checked" !important; /* radio_button_checked = \\e837 */
    color: var(--icon-color) !important;
    position: relative !important;
    top: 0.1em !important;
    }

    /* 複数選択アイコン */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20 > div > p:has(+ * input[type="checkbox"])::after {
    font-family: 'Material Icons' !important;
    content: "spoke" !important; /* spoke = \\e9a7 */
    color: var(--icon-color) !important;
    position: relative !important;
    top: 0.1em !important;
    }

    /* 計算問題アイコン */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > div.col-xs-12.col-md-6.mb20:has(#ctl00_cplPageContent_completeAnswerLabel) > div > p.h5::after {
    font-family: 'Material Icons' !important;
    content: "numbers" !important; /* numbers = \\eac7 */
    color: var(--icon-color) !important;
    position: relative !important;
    top: 0.1em !important;
    }

    /* 確信度アイコン */
    #ctl00_cplPageContent_certaintyFactorArea > div > p::after {
    font-family: 'Material Icons' !important;
    content: 'thumb_up' !important; /* thumb_up = \\e8dc */
    color: var(--icon-color) !important;
    margin-left: 0.2em !important;
    position: relative !important;
    top: 0.15em !important;
    }

    /* 解説アイコン */
    #ctl00_cplPageContent_upd1 > div.container.pb70 > p:nth-child(5)::after {
    font-family: 'Material Icons' !important;
    content: 'lightbulb_outline' !important; /* lightbulb_outline = \\e90f */
    color: var(--icon-color) !important;
    position: relative !important;
    top: 0.15em !important;
    }

    /* 中断ボタンアイコン */
    #ctl00_cplPageContent_lbnSuspend::after {
    font-family: 'Material Icons' !important;
    content: 'logout' !important; /* logout = \\e9ba */
    color: var(--primary-color) !important;
    position: relative !important;
    top: 0.15em !important;
    margin: 0 !important;
    }

    /* 採点ボタンアイコン */
    #ctl00_cplPageContent_lbnGrading::after {
    font-family: 'Material Icons' !important;
    content: 'subdirectory_arrow_right' !important; /* subdirectory_arrow_right = \\e5da */
    color: var(--icon-color) !important;
    position: relative !important;
    top: 0.15em !important;
    margin: 0 !important;
    }
    
    /* 次へボタン(まとめて演習)アイコン */
　　#ctl00_cplPageContent_lbnSkip::after {
    font-family: 'Material Icons' !important;
    content: 'subdirectory_arrow_right' !important; /* subdirectory_arrow_right = \\e5da */
    color: var(--icon-color) !important;
    position: relative !important;
    top: 0.15em !important;
    margin: 0 !important;
    }

    /* 次へボタンアイコン */
    #foot_area > div > a.btn.btn-primary::after {
    font-family: 'Material Icons' !important;
    content: 'arrow_forward' !important; /* arrow_forward = \\e5c8 */
    color: var(--icon-color) !important;
    position: relative !important;
    top: 0.2em !important;
    margin: 0 !important;
    }

    /* 終了ボタンアイコン */
    #ctl00_cplPageContent_lbnFinish::after {
    font-family: 'Material Icons' !important;
    content: 'sports_score' !important; /* sports_score = \\f06e */
    color: var(--icon-color) !important;
    position: relative !important;
    top: 0.2em !important;
    margin: 0 !important;
    }
  `;
  document.head.appendChild(style);

  // GoogleアイコンCSS追加
  if (!document.querySelector("link[href*='Material+Icons']")) {
    document.head.insertAdjacentHTML(
      "beforeend",
      '<link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Round|Material+Icons+Sharp|Material+Icons+Two+Tone" rel="stylesheet">'
    );
  }


  // ============================================== //
  // ========== ↓要素の移動・変更処理↓ ========== //
  // タイマー右移動
  function moveTimer() {
    const $targetArea = $("#head_area .col-xs-3.text-right");
    const $timer = $("#timer");
    if ($timer.length && !$targetArea.find("#timer").length) {
      $timer.appendTo($targetArea);
    }
  }

  // 「問題.下記の問いに答えなさい。」の移動
  function moveHeading() {
    const $heading = $(
      "#ctl00_cplPageContent_upd1 > div.container.pb70 > div.well.mec-bg-none.mt40 > p.h4"
    );
    const $targetArea = $("#head_area .col-xs-3.text-left");
    if ($heading.length) {
      $targetArea.find(".h4").remove();
      $heading.appendTo($targetArea);
    }
  }

  // 確信度ボタン化
  function convertSelectToButtons() {
    const select = document.getElementById(
      "ctl00_cplPageContent_certaintyFactor"
    );
    if (
      !select ||
      select.nextElementSibling?.classList.contains("toggle-buttons")
    )
      return;
    select.style.display = "none";
    const wrapper = document.createElement("div");
    wrapper.className = "toggle-buttons";
    for (const opt of select.options) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = opt.textContent;
      btn.dataset.value = opt.value;
      if (opt.selected) btn.classList.add("active");
      btn.addEventListener("click", () => {
        select.value = opt.value;
        wrapper
          .querySelectorAll("button")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      wrapper.appendChild(btn);
    }
    select.parentNode.insertBefore(wrapper, select.nextSibling);
    select.addEventListener("change", () => {
      const val = select.value;
      wrapper
        .querySelectorAll("button")
        .forEach((b) => b.classList.toggle("active", b.dataset.value === val));
    });
  }

  // 問題番号が含まれうる領域のテキストを非表示
  function hideOriginalProblemNumber() {
    const $bodyP = $(
      "#ctl00_cplPageContent_upd1 > div.container.pb70 > div.well.mec-bg-none.mt40 > p"
    );
    $bodyP.each((_, p) => {
      $(p)
        .contents()
        .filter(
          (_, node) => node.nodeType === 3 && $.trim(node.nodeValue) !== ""
        )
        .wrap('<span style="display:none;"></span>'); // テキストを非表示に
    });
    console.log("[iTutor] Original problem numbers are now hidden");
  }

  // 問題番号が含まれうる領域のテキストの移動（body内 → #divTime）
  function moveProblemNumber() {
    const $bodyP = $(
      "#ctl00_cplPageContent_upd1 > div.container.pb70 > div.well.mec-bg-none.mt40 > p > span"
    );
    const $divTime = $("#divTime");
    if (!$divTime.length) return;
    $divTime.empty(); // 前の問題番号をクリア
    $bodyP.each((_, p) => {
      $(p)
        .contents()
        .filter(
          (_, node) => node.nodeType === 3 && $.trim(node.nodeValue) !== ""
        )
        .each((_, node) => {
          $divTime[0].appendChild(node.cloneNode(true)); // cloneNode(true) でコピー追加
        });
    });
    console.log("[iTutor] Problem number moved to #divTime");
  }

  // カスタマイズをまとめて適用するもの
  function applyCustomizations() {
    moveTimer();
    moveHeading();
    convertSelectToButtons();
    hideOriginalProblemNumber();
    moveProblemNumber();
  }

  // DOM変化監視（連問・部分更新対応）
  function observeContentChanges() {
    const target = document.querySelector("#ctl00_cplPageContent_upd1");
    if (!target) return;

    const observer = new MutationObserver(() => {
      applyCustomizations();
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  // ASP.NET 部分更新後にも再適用
  if (window.Sys?.WebForms?.PageRequestManager) {
    const prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_endRequest(() => {
      console.log("[iTutor] ASP.NET postback → reapply customizations");
      setTimeout(applyCustomizations, 150); // 少し遅延してDOM安定後に適用
    });
  }
  // 初回適用＆監視開始
  applyCustomizations();
  observeContentChanges();
  // ============================================== //




  // ============================================== //
  // ======= ↓ページに直接スクリプト注入↓ ======= //
  const script = document.createElement("script");
  script.textContent = `
  function moveAndHideProblemNumber() {
    const bodyPs = document.querySelectorAll("#ctl00_cplPageContent_upd1 > div.container.pb70 > div.well.mec-bg-none.mt40 > p");
    const divTime = document.getElementById("divTime");
    if (!divTime) return;
    divTime.innerHTML = "";

    bodyPs.forEach(p => {
      [...p.childNodes].forEach(n => {
        if (n.nodeType === 3 && n.nodeValue.trim() !== "") {
          // ↓コピーして divTime に追加
          divTime.appendChild(n.cloneNode(true));
          // ↓元のテキストを非表示
          const span = document.createElement("span");
          span.style.display = "none";
          n.parentNode.replaceChild(span, n);
          span.appendChild(n);
        }
      });
    });
    console.log("[iTutor] Problem numbers copied and original hidden");
  }
`;
  document.head.appendChild(script);
})();

// 確認なしで演習を中断
(function() {
    'use strict';
    const btn = document.querySelector('#ctl00_cplPageContent_lbnSuspend');
    if (!btn) return;
    // confirm を消す
    btn.setAttribute("onclick", "updateStudySec(); return true;");
})();