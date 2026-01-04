// ==UserScript==
// @name         Markdown Image Renderer for Gemini, ChatGPT, Grok
// @namespace    https://greasyfork.org/ja/scripts/556280
// @license      MIT 
// @version      2.0
// @description  Gemini,ChatGPT,GrokのチャットでMarkdown画像を表示します。画像クリックで単一のサブウィンドウに表示（上書き）します。
// @author       FoeverPWA
// @match        https://gemini.google.com/app/*
// @match        https://chatgpt.com/*
// @match        https://grok.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/556280/Markdown%20Image%20Renderer%20for%20Gemini%2C%20ChatGPT%2C%20Grok.user.js
// @updateURL https://update.greasyfork.org/scripts/556280/Markdown%20Image%20Renderer%20for%20Gemini%2C%20ChatGPT%2C%20Grok.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🚀 Markdown Image Renderer v1.9 (Grok対応): Script loaded.");

    function fetchImageAsDataURL(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    callback(response.response);
                } else {
                    console.error(`❌ [Fetch] HTTP Error ${response.status} for: ${url}`);
                    callback(null);
                }
            },
            onerror: (error) => {
                console.error(`❌ [Fetch] Network Error for: ${url}`, error);
                callback(null);
            }
        });
    }

    /**
     * 指定された要素を、指定されたURLの画像に置き換えます。
     * @param {HTMLElement} targetElement - 置き換え対象のDOM要素 (<a>タグなど)
     * @param {string} imageUrl - 表示する画像のURL
     */
    function replaceElementWithImage(targetElement, imageUrl) {
        if (!targetElement.parentNode || targetElement.dataset.imageProcessed) return;
        targetElement.dataset.imageProcessed = 'true';

        const altText = imageUrl.split('/').pop().split('.')[0] || 'image';
        const uniqueId = 'img-placeholder-' + Date.now() + Math.random().toString(36).substring(2);

        const placeholder = document.createElement('img');
        placeholder.id = uniqueId;
        placeholder.alt = altText + ' (loading...)';
        placeholder.style.cssText = "max-width: 100%; height: auto; border-radius: 8px; display: block; background-color:#f0f0f0; min-height: 50px; cursor: pointer;";

        placeholder.addEventListener('click', () => {
            window.open(imageUrl, 'imagePreviewWindow');
        });

        const preWrapper = document.createElement('pre');
        preWrapper.setAttribute('contenteditable', 'false');
        preWrapper.style.cssText = "margin: 0; padding: 0; background: transparent; border: none; font-family: inherit; white-space: pre-wrap; display: block;";
        preWrapper.appendChild(placeholder);

        // ReactなどのフレームワークがDOMを管理している場合、要素を完全に削除(replaceChild)すると
        // "The node to be removed is not a child of this node" エラーが発生することがあります。
        // そのため、元の要素は削除せずに非表示にし、その直後に画像プレビューを挿入します。
        targetElement.style.display = 'none';
        targetElement.parentNode.insertBefore(preWrapper, targetElement.nextSibling);

        fetchImageAsDataURL(imageUrl, (blob) => {
            const imgElement = document.getElementById(uniqueId);
            if (imgElement) {
                if (blob) {
                    imgElement.src = URL.createObjectURL(blob);
                    imgElement.alt = altText;
                } else {
                    imgElement.alt = `[画像読み込み失敗] ${altText}`;
                    imgElement.style.border = "1px dashed #ccc";
                    imgElement.style.padding = "10px";
                    imgElement.style.cursor = 'default';
                }
            }
        });
    }

    let debounceTimer;

    const debouncedProcessor = () => {
        // --- ステージ1: Gemini専用 - Google検索リンクを逆変換 ---
        // Geminiは特殊なので全体から検索
        document.querySelectorAll('a[href*="google.com/search?q="]').forEach(link => {
            if (link.dataset.imageProcessed) return;

            try {
                const searchUrl = new URL(link.href);
                const originalUrl = searchUrl.searchParams.get('q');
                if (originalUrl && /\.(avif|webp|png|jpg|jpeg|gif|svg)$/i.test(originalUrl)) {
                    console.log(`✅ [Gemini] Found Google search link. Reversing to image: ${originalUrl}`);
                    replaceElementWithImage(link, originalUrl);
                }
            } catch (e) {
                // URL解析エラーは無視
            }
        });

        // ChatGPT, Grok対応のセレクター
        const targetSelector = '.model-response-text, p.break-words';

        document.querySelectorAll(targetSelector).forEach(container => {

            // --- ステージ2: Grok形式の画像リンクを変換 ---
            container.querySelectorAll('a[href][target="_blank"]').forEach(link => {
                if (link.dataset.imageProcessed) return;

                const href = link.href;
                // 画像ファイル拡張子で判定
                if (/\.(avif|webp|png|jpg|jpeg|gif|svg)$/i.test(href)) {
                    console.log(`✅ [Grok] Found image link. Converting to image: ${href}`);
                    replaceElementWithImage(link, href);
                }
            });

            // --- ステージ3: 残っているMarkdownテキストを処理 (フォールバック) ---
            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (!node.parentElement || node.parentElement.closest('[data-image-processed="true"]')) continue;

                // 改善された正規表現: 閉じ括弧 ')' を含まない、またはエスケープされた括弧を許容する簡易的な対応
                // より厳密なパースが必要な場合はライブラリ推奨だが、UserScriptとしてはこれで十分
                const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/;
                const match = node.textContent.match(markdownImageRegex);

                if (match) {
                    const imageUrl = match[1];
                    console.log(`✅ [Markdown] Found raw markdown text. Converting to image: ${imageUrl}`);
                    replaceElementWithImage(node.parentElement, imageUrl);
                }
            }
        });
    };

    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(debouncedProcessor, 250);
    });

    console.log("👀 DOM Observer started.");
    observer.observe(document.body, { childList: true, subtree: true });

})();