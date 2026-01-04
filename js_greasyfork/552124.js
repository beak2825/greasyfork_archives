// ==UserScript==
// @name         時間割改善スクリプト
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  大学の履修時間割ページにシラバスへのリンクを動的に追加します。初回にURL設定が必要です。
// @author       You
// @match        https://sass.adm.tottori-u.ac.jp/campusweb/campusportal.do*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/552124/%E6%99%82%E9%96%93%E5%89%B2%E6%94%B9%E5%96%84%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552124/%E6%99%82%E9%96%93%E5%89%B2%E6%94%B9%E5%96%84%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================================================
    // ▼▼▼ 設定メニュー ▼▼▼
    // ===============================================================
    GM_registerMenuCommand('シラバスURLを設定', setSyllabusUrl, 's');

    function setSyllabusUrl() {
        const currentUrl = GM_getValue('syllabusUrlTemplate', ''); // 現在の設定を読み込む
        const newUrl = prompt(
            'お使いの大学のシラバス検索URLを入力してください。\n' +
            '授業コードを入れたい部分を「%CODE%」に置き換えてください。\n\n' +
            '例: https://syllabus.daigaku.ac.jp/search?code=%CODE%',
            currentUrl
        );
        if (newUrl && newUrl.includes('%CODE%')) {
            GM_setValue('syllabusUrlTemplate', newUrl);
            alert('設定を保存しました。ページを再読み込みしてください。');
        } else if (newUrl !== null) {
            alert('入力が正しくありません。「%CODE%」を含めてください。');
        }
    }

    // ===============================================================
    // ▼▼▼ メインの実行部分 ▼▼▼
    // ===============================================================
    const iframeSelector = '#main-frame-if';

    // メインの処理を開始する関数
    async function initialize() {
        const syllabusUrlTemplate = await GM_getValue('syllabusUrlTemplate');
        if (!syllabusUrlTemplate) {
            console.log('[監視スクリプト] シラバスURLが未設定です。Tampermonkeyのメニューから設定してください。');
            alert('【初回設定】時間割改善スクリプトのシラバスURLが設定されていません。\nブラウザ右上のTampermonkeyアイコンから設定を行ってください。');
            return;
        }

        console.log('[監視スクリプト] 起動しました。iframeの出現を監視します。');

        // ページ内にiframeが出現するのを監視
        const observer = new MutationObserver((mutationsList, obs) => {
            const targetIframe = document.querySelector(iframeSelector);
            if (targetIframe) {
                console.log('[監視スクリプト] 目的のiframeを発見！', targetIframe);
                obs.disconnect(); // 監視を終了
                // iframeの読み込み完了を待ってから、中身の監視を開始
                targetIframe.addEventListener('load', () => waitForIframeContent(targetIframe, syllabusUrlTemplate));
                // すでに読み込みが終わっている場合も考慮
                if (targetIframe.contentWindow.document.readyState === 'complete') {
                    waitForIframeContent(targetIframe, syllabusUrlTemplate);
                }
            }
        });

        // 監視を開始
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // iframeの中身が準備できるまで定期的にチェックする関数
    function waitForIframeContent(iframe, syllabusUrlTemplate) {
        try {
            const iframeDoc = iframe.contentWindow.document;
            let attempts = 0;
            const maxAttempts = 20; // 最大10秒待つ

            const intervalId = setInterval(() => {
                console.log(`[監視スクリプト] iframeの中身をチェック中... (${attempts + 1}回目)`);
                if (addSyllabusLinks(iframeDoc, syllabusUrlTemplate) || attempts >= maxAttempts) {
                    clearInterval(intervalId);
                }
                attempts++;
            }, 500);
        } catch (e) {
            console.error('[監視スクリプト] iframeの処理中にエラーが発生しました。', e);
        }
    }

    // iframeの中身にシラバスリンクを追加する関数
    function addSyllabusLinks(iframeDoc, syllabusUrlTemplate) {
        const classBoxes = iframeDoc.querySelectorAll('div[onclick*="DeleteCall"]');
        if (classBoxes.length === 0) return false;

        console.log(`[監視スクリプト] iframe内で授業コマを ${classBoxes.length} 件発見！リンクを追加します。`);

        classBoxes.forEach(box => {
            if (box.parentElement.querySelector('.syllabus-link')) return;
            const onclickAttr = box.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('DeleteCall')) {
                const parts = onclickAttr.split("'");
                const courseCode = parts[5];
                if (courseCode && courseCode.trim() !== '') {
                    const syllabusUrl = syllabusUrlTemplate.replace('%CODE%', courseCode);
                    const syllabusLink = document.createElement('a');
                    syllabusLink.href = syllabusUrl;
                    syllabusLink.textContent = 'シラバス参照';
                    syllabusLink.target = '_blank';
                    syllabusLink.className = 'syllabus-link';
                    syllabusLink.style.cssText = 'display:block; margin-top:5px; font-weight:bold; text-align:center;';
                    box.parentElement.appendChild(syllabusLink);
                }
            }
        });
        return true;
    }

    // 実行開始
    initialize();

})();