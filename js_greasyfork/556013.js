// ==UserScript==
// @name         Markdown Image Renderer for Gemini,ChatGPT
// @license      MIT 
// @version      1.7
// @description  Gemini,ChatGPTのチャットでMarkdown画像を表示します。画像クリックで単一のサブウィンドウに表示（上書き）します。
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/c/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1527993
// @downloadURL https://update.greasyfork.org/scripts/556013/Markdown%20Image%20Renderer%20for%20Gemini%2CChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/556013/Markdown%20Image%20Renderer%20for%20Gemini%2CChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("🚀 Gemini Markdown Image Renderer v1.7 (Reverse fix, single window): Script loaded.");

    function fetchImageAsDataURL(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    callback(response.response); // blobを直接返す
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

        const altText = imageUrl.split('/').pop().split('.')[0] || 'image'; // URLからファイル名をaltに
        const uniqueId = 'img-placeholder-' + Date.now() + Math.random().toString(36).substring(2);

        const placeholder = document.createElement('img');
        placeholder.id = uniqueId;
        placeholder.alt = altText + ' (loading...)';
        placeholder.style.cssText = "max-width: 100%; height: auto; border-radius: 8px; display: block; background-color:#f0f0f0; min-height: 50px; cursor: pointer;";

        placeholder.addEventListener('click', () => {
            // ★変更点: 第二引数を '_blank' から固定の 'imagePreviewWindow' に変更
            // これにより、同じ名前のウィンドウが再利用（上書き）される
            window.open(imageUrl, 'imagePreviewWindow');
        });


        const preWrapper = document.createElement('pre');
        preWrapper.setAttribute('contenteditable', 'false');
        preWrapper.style.cssText = "margin: 0; padding: 0; background: transparent; border: none; font-family: inherit; white-space: pre-wrap; display: block;";
        preWrapper.appendChild(placeholder);

        // まずプレースホルダーに置き換える
        targetElement.parentNode.replaceChild(preWrapper, targetElement);

        // 非同期で画像を取得して表示
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
        const targetSelector = '.response-container-content .markdown, .model-response-text';

        document.querySelectorAll(targetSelector).forEach(container => {
            // --- ステージ1: Google検索リンクを逆変換 ---
            container.querySelectorAll('a[href*="google.com/search?q="]').forEach(link => {
                try {
                    const searchUrl = new URL(link.href);
                    const originalUrl = searchUrl.searchParams.get('q');
                    // URLが画像ファイルっぽいか簡易チェック
                    if (originalUrl && /\.(avif|webp|png|jpg|jpeg|gif)$/i.test(originalUrl)) {
                        console.log(`✅ [Reverse] Found Google search link. Reversing to image: ${originalUrl}`);
                        replaceElementWithImage(link, originalUrl);
                    }
                } catch (e) {
                    // URL解析エラーは無視
                }
            });

            // --- ステージ2: 残っているMarkdownテキストを処理 (フォールバック) ---
            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (!node.parentElement || node.parentElement.closest('[data-image-processed="true"]')) continue;

                const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/;
                const match = node.textContent.match(markdownImageRegex);

                if (match) {
                    const imageUrl = match[1];
                     // テキストノード全体を画像に置き換える（単純化のため）
                    console.log(`✅ [Markdown] Found raw markdown text. Converting to image: ${imageUrl}`);
                    replaceElementWithImage(node.parentElement, imageUrl);
                }
            }
        });
    };

    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        // Geminiの処理が終わった頃合いを狙う
        debounceTimer = setTimeout(debouncedProcessor, 250);
    });

    console.log("👀 DOM Observer started.");
    observer.observe(document.body, { childList: true, subtree: true });

})();