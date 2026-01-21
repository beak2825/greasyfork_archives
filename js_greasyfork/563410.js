// ==UserScript==
// @name         不備未登録MOD
// @namespace    S2
// @license      Suruga-ya
// @version      1.0
// @author       S2
// @description  不備未登録画面改造
// @grant        GM_xmlhttpRequest
// @match        https://atoo-kaitori.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?domain=https://www.suruga-ya.jp/
// @downloadURL https://update.greasyfork.org/scripts/563410/%E4%B8%8D%E5%82%99%E6%9C%AA%E7%99%BB%E9%8C%B2MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/563410/%E4%B8%8D%E5%82%99%E6%9C%AA%E7%99%BB%E9%8C%B2MOD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).on('keydown', function(e) {
        if (e.altKey && (e.key === 'q' || e.key === 'Q')) {
            const $target = $('.input.ui-inputtext.ui-corner-all.ui-state-default.ui-widget.ng-invalid.ng-dirty').eq(0);
            $target.focus();
        }
    });

    let lastMainUrl = window.location.href;

    // 詳細表示用のエリアを用意
    const $container = $('<div>', { id: 'custom-detail-area' });

    const setupContainer = () => {
        const currentUrl = window.location.href;

        // コンテナがまだDOMにない場合は追加
        if ($('#custom-detail-area').length === 0) {
            const $root = $('kai-root').length ? $('kai-root') : $('body');
            $root.after($container);
        }

        // 表示・非表示の切り替え
        if (currentUrl.includes('#/ko018')) {
            if ($container.html() !== "") {
                $container.show();
            }
        } else {
            $container.hide();
        }
    };

    // URLの変化を監視
    const observeUrlChange = () => {
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;

            if (currentUrl !== lastMainUrl) {
                if (lastMainUrl.includes('#/ko018') && currentUrl.includes('#/ko009?id=')) {
                    const detailUrl = currentUrl;
                    // replaceStateはネイティブのAPIを使用
                    window.history.replaceState(null, '', lastMainUrl);
                    showDetail(detailUrl);
                    $('.notranslate').css('overflow', 'auto');
                } else {
                    lastMainUrl = currentUrl;
                    setupContainer();
                }
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    };

    // iframeの生成・更新
    const showDetail = (url) => {
        // CSSをまとめて設定
        $container.css({
            'margin-top': '50px',
            'border-top': '10px solid #444',
            'padding': '20px',
            'background': '#f9f9f9',
            'min-height': '500px'
        }).show();

        // 内部HTMLを構築
        $container.html(`
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <strong>表示中の詳細URL: ${url}</strong>
                <button id="refresh-frame" style="padding:5px 10px; cursor:pointer;">再読み込み</button>
            </div>
            <iframe id="detail-frame" src="${url}" style="width:100%; height:1000px; border:2px solid #ccc; background:#fff;"></iframe>
        `);

        // iframeの読み込み完了
        $('#detail-frame').on('load', function() {
            // jQueryのフィルタ機能で「戻る」ボタンを探してクリック
            $('.ui-button-text.ui-clickable').filter(function() {
                return $(this).text().trim() === '戻る';
            }).trigger('click');
        });

        // 再読み込みボタンの
        $('#refresh-frame').on('click', function() {
            $('#detail-frame').attr('src', url);
        });
    };

    // 初期化
    $(document).ready(function() {
        setupContainer();
        observeUrlChange();
        // 定期チェック
        //setInterval(setupContainer, 1000);
    });

})();