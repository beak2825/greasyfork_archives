// ==UserScript==
// @name    Open2ch アラビア文字規制避け (拡張版)
// @namespace    https://greasyfork.org/ja/users/864059
// @version    1.0.5
// @description    アラビア文字やAI回答の特殊空白文字等、書き込むと吸い込まれてしまう文字種を入力したとき投稿ボタンを無効化します
// @author    七色の彩り
// @match    https://*.open2ch.net/test/read.cgi/*
// @icon    https://avatars.githubusercontent.com/u/88383494
// @grant    none
// @license    GNU Affero General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/563483/Open2ch%20%E3%82%A2%E3%83%A9%E3%83%93%E3%82%A2%E6%96%87%E5%AD%97%E8%A6%8F%E5%88%B6%E9%81%BF%E3%81%91%20%28%E6%8B%A1%E5%BC%B5%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563483/Open2ch%20%E3%82%A2%E3%83%A9%E3%83%93%E3%82%A2%E6%96%87%E5%AD%97%E8%A6%8F%E5%88%B6%E9%81%BF%E3%81%91%20%28%E6%8B%A1%E5%BC%B5%E7%89%88%29.meta.js
// ==/UserScript==

/*
   注意：
   このスクリプトは、おんJ民氏による「Open2ch アラビア文字規制避け」
   (https://greasyfork.org/ja/scripts/526462-open2ch-アラビア文字規制避け)をベースに拡張したものです。
   元の作者であるおんJ民氏に感謝いたします。
*/

(function() {
    'use strict';

    // 規制対象とする文字の正規表現
    // --- アラビア文字 ---
    // \u0600-\u06FF: 基本的なアラビア文字
    // \u0750-\u077F: アラビア文字補助
    // \u08A0-\u08FF: アラビア文字拡張A
    // \uFB50-\uFDFF: アラビア文字表現形式A
    // \uFE70-\uFEFF: アラビア文字表現形式B
    // --- タイ文字 ---
    // \u0E00-\u0E7F
    // --- チベット文字 ---
    // \u0F00-\u0FFF
    // --- ヘブライ文字 ---
    // \u0590-\u05FF
    // --- デーヴァナーガリー (インド文字) ---
    // \u0900-\u097F
    // --- 結合文字 (Combining Diacritical Marks) ---
    // \u0300-\u036F: 顔文字に用いられる記号など
    // --- AI回答等に使われる特殊スペース文字 ---
    // \u00A0: NO-BREAK SPACE (改行なし半角スペース)
    // \u200B: ZERO WIDTH SPACE (ゼロ幅スペース)  // リテラルに移動
    // \u202F: NARROW NO-BREAK SPACE (狭い改行なしスペース) // リテラルに移動
    // \uFEFF: ZERO WIDTH NO-BREAK SPACE / BOM (幅ゼロ改行なしスペース)
    // --- 特殊記号を用いた顔文字に採用されている文字種  ---
    // \u0590-\u05FF: ヘブライ文字ブロック
    // \u1DC0-\u1DFF: 結合用ダイアクリティカルマーク拡張
    // \u0D00-\u0D7F: マラヤーラム文字
    // \u0C80-\u0CFF: カンナダ文字
    // \u0250-\u02AF: 発音記号
    // \u1D00-\u1D7F: 発音記号拡張
    // \u0980-\u09FF: ベンガル文字
    // --- 規制対象文字の定義 ---
    const arabicRange = '\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF'; // アラビア
    const asianRange = '\u0E00-\u0E7F\u0F00-\u0FFF\u0900-\u097F\u0980-\u09FF'; // タイ・チベット・インド
    const specialRange = '\u0590-\u05FF\u0300-\u036F\u1DC0-\u1DFF\u0D00-\u0D7F\u0C80-\u0CFF\u0250-\u02AF\u1D00-\u1D7F'; // ヘブライ・結合・マラヤーラム等
    const spaceRange = '\u00A0\uFEFF'; // 特殊スペース
    const literals = '૮ܸ˶ෆ੭ͽ꧁꧂\u200B\u202F‪꩜\u206D'; // 個別リテラル

    // 全てを統合して一つの正規表現にする
    const ARABIC_CHAR_REGEX = new RegExp('[' + arabicRange + asianRange + specialRange + spaceRange + literals + ']');

    // --- 日本語NGワード ---
    const jpNgWords = [
        'アフィ',
        '大麻',
        '唐沢恒心教',
        '(^|[。\\s、！？\\u3000])(安倍晋三)([。\\s、！？\\u3000]|$)' // 単体マッチ用の正規表現
    ].join('|');
    const JAPANESE_NG_WORD_REGEX = new RegExp(jpNgWords);
    // 現在のテキストエリアの状態を監視するためのタイマーID
    let inputCheckTimeout = null;

    /**
     * 全てのテキストエリアの状態をチェックし、投稿ボタンの有効/無効を決定する
     */
    function updateSubmitButtonStatus() {
        // 一つでもNG文字またはNGワードを含むテキストエリアがあるかチェック
        const isAnyTextareaInvalid = [...document.querySelectorAll('textarea')]
            .some(ta => ARABIC_CHAR_REGEX.test(ta.value) || JAPANESE_NG_WORD_REGEX.test(ta.value)); // 日本語NGワードチェックを追加

        [...document.querySelectorAll('[type="submit"]')].forEach(button => {
            // NG文字/NGワードがあれば無効化、なければ有効化
            button.disabled = isAnyTextareaInvalid;

            // 投稿ボタン無効化の理由をタイトル属性でユーザーに提示
            if (isAnyTextareaInvalid) {
                button.title = '規制対象の特殊文字またはNGワードが含まれているため、投稿できません。';
            } else {
                button.removeAttribute('title');
            }
        });
    }

    /**
     * テキストエリアの内容をチェックし、アラビア文字が含まれていれば警告表示を行う
     * @param {HTMLTextAreaElement} textareaElement - チェック対象のtextarea要素
     */
    function checkTextareaForArabic(textareaElement) {
        const textContent = textareaElement.value;

        // 1. 特殊文字のチェック
        const hasArabic = ARABIC_CHAR_REGEX.test(textContent);

        // 2. 日本語NGワードのチェック (大文字小文字・全角半角を区別したい場合は調整が必要です)
        // hasJapaneseNgWordは、hasArabicがfalseの場合でもチェックを実行します。
        const hasJapaneseNgWord = JAPANESE_NG_WORD_REGEX.test(textContent);

        // どちらか一方でもNGであればtrue
        const isInvalid = hasArabic || hasJapaneseNgWord;

        // 背景色の設定
        textareaElement.style.backgroundColor = isInvalid ? 'pink' : '';

        // 全体の投稿ボタンの状態を更新
        updateSubmitButtonStatus();
    }

    // pasteイベントリスナー (既存の機能を維持)
    window.document.addEventListener('paste', (e) => {
        if (e.target.tagName !== 'TEXTAREA') return;

        const textareaElement = e.target;
        const pasteData = (e.clipboardData || window.clipboardData).getData('text');

        // ペーストデータに特殊文字または日本語NGワードが含まれるかチェック
        if (ARABIC_CHAR_REGEX.test(pasteData) || JAPANESE_NG_WORD_REGEX.test(pasteData)) {
            // ペースト後のテキストエリアの背景色を即座に変更
            // (inputイベントが発火するまでの間、即座に視覚的フィードバックを与えるため)
            textareaElement.style.backgroundColor = 'pink';
        }

        // pasteの直後、または短い遅延後に全体チェックを強制的に実行
        // (textarea.valueが更新されるのを待ってからチェックするため)
        if (inputCheckTimeout) {
            clearTimeout(inputCheckTimeout);
        }
        inputCheckTimeout = setTimeout(() => {
            checkTextareaForArabic(textareaElement);
        }, 10); // ごく短い遅延

    });

    // inputイベントリスナー (直接入力やテキストエリアの内容変更を監視)
    window.document.addEventListener('input', (e) => {
        if (e.target.tagName !== 'TEXTAREA') return;

        // 遅延させてチェックすることで、連続した入力でのパフォーマンス負荷を軽減
        if (inputCheckTimeout) {
            clearTimeout(inputCheckTimeout);
        }
        inputCheckTimeout = setTimeout(() => {
            checkTextareaForArabic(e.target);
        }, 300); // 300msの遅延
    });

    // ページロード時に既存のテキストエリアをチェック
    window.addEventListener('load', () => {
        document.querySelectorAll('textarea').forEach(textarea => {
            checkTextareaForArabic(textarea);
        });
    });

})();