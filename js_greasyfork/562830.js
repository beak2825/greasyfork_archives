// ==UserScript==
// @name         learningBOXのPDFviewerにてツールバー右上にダウンロードボタンを常時表示
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  ツールバー右上のアコーディオンメニュー内にでダウンロード項目の行を常時表示します
// @author       You
// @match        https://lms.learningbox.online/pdf/*/web/viewer.html?file=/assets/*
// @match        https://lms.learningbox.online/assets/pdf.js/*/web/viewer.html?file=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learningbox.online
// @grant        none
// @license      public domain
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562830/learningBOX%E3%81%AEPDFviewer%E3%81%AB%E3%81%A6%E3%83%84%E3%83%BC%E3%83%AB%E3%83%90%E3%83%BC%E5%8F%B3%E4%B8%8A%E3%81%AB%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E5%B8%B8%E6%99%82%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/562830/learningBOX%E3%81%AEPDFviewer%E3%81%AB%E3%81%A6%E3%83%84%E3%83%BC%E3%83%AB%E3%83%90%E3%83%BC%E5%8F%B3%E4%B8%8A%E3%81%AB%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E5%B8%B8%E6%99%82%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(window.onload = function() {
    // iFrameの読み込みが完了してからアクセスするのが重要!
    // そうしないと、中身がまだ準備できていないのにアクセスしようとしてエラーになります

    // ダウンロードボタンを取得してstylesheetを表示状態に指定します
    const downloadButton = document.getElementById('secondaryDownload');
    downloadButton.style = 'display: block';

    // クラスのcss設定で非表示にされているので該当するクラスを取り除きます
    if (downloadButton.classList.contains('visibleLargeView')) {
        downloadButton = downloadButton.classList.remove('visibleLargeView');
    }
    if (downloadButton.classList.contains('visibleMediumView')) {
        console.log('クラスが含まれています');

        downloadButton = downloadButton.classList.remove('visibleMediumView');
    }
    console.log(downloadButton);

    downloadButton.click();

})();