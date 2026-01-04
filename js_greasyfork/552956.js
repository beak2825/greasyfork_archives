// ==UserScript==
// @name         Markdown Image Renderer for Google AI Studio (v4)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  AI Studioのプロンプト画面でMarkdown形式の画像リンクを実際の画像として表示します。
// @author       ForeverPWA
// @license      MIT
// @match        https://aistudio.google.com/prompts/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/552956/Markdown%20Image%20Renderer%20for%20Google%20AI%20Studio%20%28v4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552956/Markdown%20Image%20Renderer%20for%20Google%20AI%20Studio%20%28v4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = "🖼️ AI Studio Image Renderer:";
    console.log(LOG_PREFIX, "Script v4 started.");

    /**
     * 指定されたURLから画像をBlobとして非同期に取得します。
     * (この関数は変更ありません)
     */
    function fetchImageAsBlob(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    callback(response.response);
                } else {
                    console.error(LOG_PREFIX, `HTTP Error ${response.status} for: ${url}`);
                    callback(null);
                }
            },
            onerror: (error) => {
                console.error(LOG_PREFIX, `Network Error for: ${url}`, error);
                callback(null);
            }
        });
    }

    /**
     * 見つかった<pre>要素を画像に置き換える関数
     * @param {HTMLElement} preElement - 対象の<pre>要素
     */
    function processPreElement(preElement) {
        // すでに処理済みの場合は何もしない
        if (preElement.dataset.imageProcessed) {
            return;
        }

        const text = preElement.textContent || '';
        const markdownRegex = /!\[(.*?)\]\((.*?)\)/;
        const match = text.match(markdownRegex);

        // Markdown画像でなければ何もしない
        if (!match) {
            return;
        }

        console.log(LOG_PREFIX, `Found markdown in <pre>: ${match[0]}`);

        // 処理済みマークを元の要素に付けておく
        preElement.dataset.imageProcessed = 'true';

        const [fullMatch, altText, imageUrl] = match;

        const img = document.createElement('img');
        img.alt = altText || 'Loading image...';
        img.style.cssText = "max-width: 500px; height: auto; display: block; margin: 10px 0; border-radius: 8px; background-color: #f0f0f0; min-height: 50px; cursor: pointer;";
        img.addEventListener('click', () => window.open(imageUrl, 'imagePreviewWindow'));

        // <pre>タグを画像に置き換えるため、<pre>タグの親要素を取得
        const parent = preElement.parentNode;
        if (parent) {
            parent.replaceChild(img, preElement);
        }

        // 画像を非同期で読み込み
        fetchImageAsBlob(imageUrl, (blob) => {
            if (blob) {
                img.src = URL.createObjectURL(blob);
                img.alt = altText;
            } else {
                img.alt = `[Failed to load image] ${altText}`;
                img.style.border = "2px dashed #d93025";
                img.style.padding = "8px";
            }
        });
    }

    /**
     * DOM内をスキャンして対象の<pre>要素を探すメイン関数
     */
    function scanForMarkdownImages() {
        // ★★★★★ 変更点 ★★★★★
        // ご提供いただいたヒントに基づき、セレクタをAI応答内の'<pre>'タグに絞りました。
        const TARGET_SELECTOR = 'ms-chat-turn pre';
        // ★★★★★★★★★★★★★★

        const elements = document.querySelectorAll(TARGET_SELECTOR);
        elements.forEach(processPreElement);
    }

    // DOMの変更を監視して、新しいコンテンツが追加されたらスキャンを実行
    const observer = new MutationObserver(() => {
        // 連続で発生する変更に対応するため、少し待ってから実行
        setTimeout(scanForMarkdownImages, 300);
    });

    console.log(LOG_PREFIX, "Observing DOM changes.");
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ページ読み込み時にも一度実行
    scanForMarkdownImages();

})();