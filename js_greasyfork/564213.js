// ==UserScript==
// @name         Block Discount Campaign Articles (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  「割引キャンペーン」タグのついた記事をURLベースで特定し、リストやサイドバーからも除去する
// @author       You
// @match        https://doonroom.blog.jp/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564213/Block%20Discount%20Campaign%20Articles%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564213/Block%20Discount%20Campaign%20Articles%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 非表示にしたいカテゴリ名
    const TARGET_CATEGORY = "割引キャンペーン";

    // 消すべき記事のURLを保存するリスト（セット）
    const bannedUrls = new Set();

    // ---------------------------------------------------------
    // 1. 内部データ (ld_blog_vars) から対象URLを特定する
    //    (リスト表示されているが本文がない場合などにも対応)
    // ---------------------------------------------------------
    function collectBannedUrlsFromVars() {
        // ページが持っている記事データ変数を参照
        const blogVars = (typeof unsafeWindow !== 'undefined' && unsafeWindow.ld_blog_vars)
                         ? unsafeWindow.ld_blog_vars
                         : window.ld_blog_vars;

        if (blogVars && blogVars.articles) {
            blogVars.articles.forEach(article => {
                // カテゴリ情報のチェック
                if (article.categories && Array.isArray(article.categories)) {
                    const isTarget = article.categories.some(cat => cat.name === TARGET_CATEGORY);
                    if (isTarget && article.permalink) {
                        bannedUrls.add(article.permalink);
                    }
                }
            });
        }
    }

    // ---------------------------------------------------------
    // 2. 画面上の記事要素 (articleタグ) から対象URLを特定＆非表示
    // ---------------------------------------------------------
    function hideMainArticlesAndCollectUrls() {
        const articles = document.querySelectorAll('article.article');
        articles.forEach(article => {
            // カテゴリリンクを確認
            const categoryLinks = article.querySelectorAll('.article-category a');
            let isMatch = false;

            categoryLinks.forEach(link => {
                if (link.textContent.trim() === TARGET_CATEGORY) {
                    isMatch = true;
                }
            });

            if (isMatch) {
                // 記事そのものを非表示
                article.style.display = 'none';

                // この記事のURLも禁止リストに追加（念のため）
                const titleLink = article.querySelector('.article-title a');
                if (titleLink && titleLink.href) {
                    bannedUrls.add(titleLink.href);
                }
            }
        });
    }

    // ---------------------------------------------------------
    // 3. 禁止リストに入ったURLを持つ「リンク」をすべて隠す
    //    (ご提示のリスト形式 "● リンク <br>" に対応)
    // ---------------------------------------------------------
    function hideLinksByUrl() {
        const allLinks = document.querySelectorAll('a');

        allLinks.forEach(link => {
            // 禁止リストにあるURLと一致するか確認
            if (bannedUrls.has(link.href)) {

                // リンク本体を非表示
                link.style.display = 'none';

                // --- リスト形式の整形処理 ---

                // 1. リンクの直前のテキスト（「● 」など）を消す
                const prev = link.previousSibling;
                if (prev && prev.nodeType === Node.TEXT_NODE) {
                    // "●" が含まれていたらその文字を空にする
                    // (または prev.textContent = ''; で強制的に消してもよい)
                    prev.textContent = prev.textContent.replace(/●/g, '').trim();
                }

                // 2. リンクの直後の改行（<br>）を消す
                // (これをしないと空白行が大量に残るため)
                const next = link.nextSibling;
                if (next && next.tagName === 'BR') {
                    next.style.display = 'none';
                }

                console.log(`除外対象のリンクを非表示: ${link.href}`);
            }
        });
    }

    // メイン処理の実行関数
    function executeBlocker() {
        collectBannedUrlsFromVars();      // 内部データからURL収集
        hideMainArticlesAndCollectUrls(); // 記事本文からURL収集＆非表示
        hideLinksByUrl();                 // 収集したURLを使ってリストリンクを非表示
    }

    // ページ読み込み完了時と、少し待ってから（動的読み込み対応）実行
    window.addEventListener('load', executeBlocker);
    setTimeout(executeBlocker, 1000); // 遅れて読み込まれる要素対策
    setTimeout(executeBlocker, 3000); // 念入りに再実行

})();