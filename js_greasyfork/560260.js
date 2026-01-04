// ==UserScript==
// @name         ニコニコ動画 - watchリンクのrefパラメータ除去
// @namespace    web.nextbyte.ai
// @version      0.1
// @description  watchリンクから?ref=pc_userpage_video等の不要パラメータを除去
// @author       Smo920
// @match        *://www.nicovideo.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560260/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20-%20watch%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%AEref%E3%83%91%E3%83%A9%E3%83%A1%E3%83%BC%E3%82%BF%E9%99%A4%E5%8E%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/560260/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20-%20watch%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%AEref%E3%83%91%E3%83%A9%E3%83%A1%E3%83%BC%E3%82%BF%E9%99%A4%E5%8E%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('ニコニコ動画 - watchリンクのrefパラメータ除去スクリプト起動');

    // watchリンクからrefパラメータを除去する関数
    function cleanWatchLinks() {
        // /watch/ を含むすべてのリンクを取得
        const links = document.querySelectorAll('a[href*="/watch/"]');

        let cleanedCount = 0;

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            try {
                // 相対URLと絶対URLの両方に対応
                let url;
                if (href.startsWith('http')) {
                    url = new URL(href);
                } else {
                    url = new URL(href, window.location.origin);
                }

                // /watch/ を含むURLのみ処理
                if (url.pathname.includes('/watch/')) {
                    // URLSearchParamsを使用してクエリパラメータを処理
                    const params = url.searchParams;

                    // refパラメータが存在する場合
                    if (params.has('ref')) {
                        // すべてのパラメータを削除（refのみを削除する場合は params.delete('ref') を使用）
                        // 要件に応じて、ref以外のパラメータも削除するか、refのみ削除するか選択可能

                        // refパラメータのみを削除
                        params.delete('ref');

                        // 他の不要なパラメータも削除（必要に応じて追加）
                        params.delete('ref_from');
                        params.delete('ref_type');

                        // 新しいURLを構築
                        let newHref;
                        const queryString = params.toString();

                        if (href.startsWith('http')) {
                            // 絶対URL
                            newHref = url.origin + url.pathname + (queryString ? '?' + queryString : '') + url.hash;
                        } else {
                            // 相対URL
                            newHref = url.pathname + (queryString ? '?' + queryString : '') + url.hash;
                        }

                        // hrefを更新
                        link.setAttribute('href', newHref);
                        cleanedCount++;
                    }
                }
            } catch (e) {
                // URL解析エラーは無視
                console.debug('URL解析エラー:', href, e);
            }
        });

        if (cleanedCount > 0) {
            console.log(`${cleanedCount}個のwatchリンクからrefパラメータを除去しました`);
        }
    }

    // 初回実行
    cleanWatchLinks();

    // DOM変更を監視して動的に追加されるリンクにも対応
    const observer = new MutationObserver((mutations) => {
        let shouldClean = false;

        for (const mutation of mutations) {
            // 新しいノードが追加された場合
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    // 要素ノードの場合
                    if (node.nodeType === 1) {
                        // watchリンクを含む可能性がある場合
                        if (node.tagName === 'A' && node.getAttribute('href')?.includes('/watch/')) {
                            shouldClean = true;
                            break;
                        }
                        // 子要素にwatchリンクが含まれる可能性がある場合
                        if (node.querySelector && node.querySelector('a[href*="/watch/"]')) {
                            shouldClean = true;
                            break;
                        }
                    }
                }
            }

            // 属性が変更された場合（hrefの変更など）
            if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                const target = mutation.target;
                if (target.tagName === 'A' && target.getAttribute('href')?.includes('/watch/')) {
                    shouldClean = true;
                }
            }

            if (shouldClean) break;
        }

        if (shouldClean) {
            cleanWatchLinks();
        }
    });

    // body全体を監視
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
    });

    console.log('watchリンク監視を開始しました');

})();
