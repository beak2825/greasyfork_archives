// ==UserScript==
// @name         Markdown Image Renderer for Google AI Studio
// @namespace    https://greasyfork.org/ja/scripts/553022
// @license      MIT 
// @version      4.5
// @description  AI StudioでMarkdown画像が表示できるようになります
// @author       ForeverPWA
// @match        *://aistudio.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/553022/Markdown%20Image%20Renderer%20for%20Google%20AI%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/553022/Markdown%20Image%20Renderer%20for%20Google%20AI%20Studio.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const LOG_PREFIX = "🖼️ AI Studio Image Renderer:";
    console.log(LOG_PREFIX, "Script v4.5 (Stable Re-rendering Fix) started.");

    /**
     * 指定されたURLから画像をBlobとして非同期に取得します。
     */
    function fetchImageAsBlob(url, callback) {
        if (url.startsWith(window.location.origin) || url.startsWith('/')) {
             fetch(url)
                .then(response => {
                    if (response.ok) return response.blob();
                    throw new Error(`HTTP Error ${response.status}`);
                })
                .then(callback)
                .catch(error => {
                    console.error(LOG_PREFIX, `Fetch Error for: ${url}`, error);
                    callback(null);
                });
            return;
        }
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
        const text = preElement.textContent || '';
        const markdownRegex = /!\[(.*?)\]\((.*?)\)/;
        const match = text.match(markdownRegex);

        if (!match) return;

        const [fullMatch, altText, imageUrl] = match;
        const nextElement = preElement.nextSibling;

        // すぐ隣に、このURLから生成した画像が既にあるかチェック
        if (nextElement && nextElement.tagName === 'IMG' && nextElement.dataset.sourceUrl === imageUrl) {
            // 既にあれば、preタグが非表示になっていることを確認して終了
            if (preElement.style.display !== 'none') {
                preElement.style.display = 'none';
            }
            return; // これ以上何もしない
        }

        console.log(LOG_PREFIX, `Rendering image for: ${imageUrl}`);

        const img = document.createElement('img');
        img.alt = altText || 'Loading image...';
        img.style.cssText = "max-width: 100%; height: auto; display: block; margin: 10px 0; border-radius: 8px; background-color: #f0f0f0; min-height: 50px; cursor: pointer;";
        img.title = `Click to open image in new tab: ${imageUrl}`;
        img.addEventListener('click', () => window.open(imageUrl, 'imagePreviewWindow'));

        img.dataset.sourceUrl = imageUrl;

        preElement.style.display = 'none';
        const parent = preElement.parentNode;
        if (parent) {
            parent.insertBefore(img, preElement.nextSibling);
        }

        fetchImageAsBlob(imageUrl, (blob) => {
            if (blob) {
                try {
                    const objectURL = URL.createObjectURL(blob);
                    img.src = objectURL;
                    img.alt = altText;
                    img.onload = () => URL.revokeObjectURL(objectURL);
                } catch(e) {
                     console.error(LOG_PREFIX, "Error creating object URL", e);
                     img.alt = `[Failed to load image] ${altText}`;
                     img.style.border = "2px dashed #d93025";
                }
            } else {
                img.alt = `[Failed to load image] ${altText}`;
                img.style.border = "2px dashed #d93025";
            }
        });
    }

    /**
     * DOM内をスキャンして対象の<pre>要素を探すメイン関数
     */
    function scanForMarkdownImages() {
        // セレクタは元のシンプルなままでOK
        const TARGET_SELECTOR = 'ms-chat-turn pre, .prompt-textarea pre';
        const elements = document.querySelectorAll(TARGET_SELECTOR);
        elements.forEach(processPreElement);
    }

    const observer = new MutationObserver(() => {
        setTimeout(scanForMarkdownImages, 300);
    });

    console.log(LOG_PREFIX, "Observing DOM changes...");
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        setTimeout(scanForMarkdownImages, 1000);
    });

})();