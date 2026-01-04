// ==UserScript==
// @name         SD WebUI: Generateボタンを移動
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generateボタンをギャラリーの上に移動します
// @author       Feldschlacht
// @match        http://127.0.0.1:7860/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559693/SD%20WebUI%3A%20Generate%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E7%A7%BB%E5%8B%95.user.js
// @updateURL https://update.greasyfork.org/scripts/559693/SD%20WebUI%3A%20Generate%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E7%A7%BB%E5%8B%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目的の要素がロードされるまで待機する関数
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback();
            return;
        }

        const observer = new MutationObserver((mutationsList, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect(); // 要素が見つかったら監視を終了
                callback();
            }
        });

        // body以下の要素の追加や属性変更を監視
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 指定されたアクション列をギャラリーの上に移動する共通処理
    function moveSection(actionsId, galleryId) {
        // 移動させたい要素 (Generateボタン列)
        const actionsColumn = document.getElementById(actionsId);
        // 移動先の基準となる要素 (ギャラリーコンテナ)
        const galleryContainer = document.getElementById(galleryId);

        if (actionsColumn && galleryContainer) {
            // 移動先の親要素を取得
            const parentElement = galleryContainer.parentElement;

            if (parentElement) {
                // actionsColumnをgalleryContainerの直前に挿入 (移動)
                // 既に移動されている場合は何もしません。
                parentElement.insertBefore(actionsColumn, galleryContainer);
                console.log(`[UI Custom] ${actionsId} を ${galleryId} の上に移動しました。`);
            }
        } else {
             // どちらかの要素が見つからない場合はログに出力（デバッグ用）
             // console.log(`[UI Custom] ${actionsId} または ${galleryId} が見つかりません。`);
        }
    }

    // メインの移動処理を実行する関数
    function runMoveActions() {
        // --- txt2imgタブの移動処理 ---
        moveSection('txt2img_actions_column', 'txt2img_gallery_container');

        // --- img2imgタブの移動処理 ---
        moveSection('img2img_actions_column', 'img2img_gallery_container');
    }

    // WebUIの初期ロード時に処理を実行
    // #tabs 要素がロードされたら、メイン処理を実行します。
    // #tabs は txt2img や img2img より早く確実にロードされる要素です。
    waitForElement('#tabs', runMoveActions);

})();