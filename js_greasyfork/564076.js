// ==UserScript==
// @name         Open2ch Kome URL自動補完
// @namespace    https://greasyfork.org/ja/users/864059
// @version      1.3
// @description  komeでyoutubeのURLに含まれるはずの「=」が消えてしまうのを補完
// @author       七色の彩り
// @match        https://*.open2ch.net/test/read.cgi/*
// @icon         https://open2ch.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564076/Open2ch%20Kome%20URL%E8%87%AA%E5%8B%95%E8%A3%9C%E5%AE%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/564076/Open2ch%20Kome%20URL%E8%87%AA%E5%8B%95%E8%A3%9C%E5%AE%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROCESSED_ATTR = 'data-kome-fixed';

    /**
     * 動画IDと追加パラメータから正しいYouTube URLを生成します。
     */
    function reconstructYoutubeUrl(videoId, extraParams) {
        let finalUrl = `https://www.youtube.com/watch?v=${videoId}`;
        if (extraParams) {
            let extra = extraParams.replace(/&amp;/g, '&');
            // 2つ目の'?'が来た場合は'&'に置換して結合
            if (extra.startsWith('?')) {
                extra = '&' + extra.substring(1);
            }
            finalUrl += extra;
        }
        return finalUrl;
    }

    /**
     * 既に<a>タグになっているが不正なURLを修正します。
     */
    function fixYoutubeUrlsInNode(node) {
        if (!(node instanceof Element)) return;
        const links = node.querySelectorAll(`a[href]:not([${PROCESSED_ATTR}])`);

        links.forEach(link => {
            const href = link.href;
            let videoId = null;
            let extra = '';

            const watchMatch = href.match(/watch\?v(?:=)?([a-zA-Z0-9_-]{11})([&?#].*)?/);
            const shortMatch = href.match(/youtu\.be\/([a-zA-Z0-9_-]{11})([&?#].*)?/);

            if (watchMatch) {
                videoId = watchMatch[1];
                extra = watchMatch[2] || '';
            } else if (shortMatch) {
                videoId = shortMatch[1];
                extra = shortMatch[2] || '';
            }

            if (videoId) {
                const finalUrl = reconstructYoutubeUrl(videoId, extra);
                link.href = finalUrl;
                // テキストがURL形式だった場合のみ書き換える（アンカーテキストが動画タイトルの場合は保持）
                if (link.textContent.includes('youtube.com') || link.textContent.includes('youtu.be')) {
                    link.textContent = finalUrl;
                }
                link.setAttribute(PROCESSED_ATTR, 'true');
            }
        });
    }

    /**
     * テキストノード内のURLを検索し、リンクに変換します。
     */
    function parseAndReplaceUrl(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            // 途切れたURLをキャプチャ (watch?v 直後の = の有無を問わない)
            const youtuBeRegex = /https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\??v=?)([a-zA-Z0-9_-]{11})([&?#][^\s]*)?/g;
            const matches = [...text.matchAll(youtuBeRegex)];

            if (matches.length > 0) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                matches.forEach(match => {
                    if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                    }

                    const videoId = match[1];
                    const extra = match[2] || '';
                    const finalUrl = reconstructYoutubeUrl(videoId, extra);

                    const a = document.createElement('a');
                    a.href = finalUrl;
                    a.textContent = finalUrl;
                    a.style.color = '#3399ff';
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.setAttribute(PROCESSED_ATTR, 'true');
                    fragment.appendChild(a);

                    lastIndex = match.index + match[0].length;
                });

                if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                }

                node.parentNode.replaceChild(fragment, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 処理済み属性がある場合や特定のタグ内はスキップ
            if (node.hasAttribute(PROCESSED_ATTR)) return;
            const skipTags = ['A', 'BUTTON', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'];
            if (!skipTags.includes(node.tagName)) {
                Array.from(node.childNodes).forEach(parseAndReplaceUrl);
            }
        }
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    fixYoutubeUrlsInNode(node);
                    parseAndReplaceUrl(node);
                } else if (node.nodeType === Node.TEXT_NODE) {
                    parseAndReplaceUrl(node);
                }
            }
        }
    });

    const config = { childList: true, subtree: true };
    const klogView = document.getElementById('klog_view');

    if (klogView) {
        observer.observe(klogView, config);
    } else {
        observer.observe(document.body, config);
    }

    // 初期実行
    fixYoutubeUrlsInNode(document.body);
    parseAndReplaceUrl(document.body);

})();