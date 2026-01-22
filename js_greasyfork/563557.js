// ==UserScript==
// @name        Open2ch ID Search Button
// @namespace   https://greasyfork.org/ja/users/864059
// @version     1.2.0
// @description おーぷん2chでIDの左側と本文を選択した右上に検索ボタン（虫眼鏡アイコン）を表示します。
// @author      七色の彩り
// @match       https://*.open2ch.net/test/read.cgi/*
// @icon          https://open2ch.net/favicon.ico
// @grant       none
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563557/Open2ch%20ID%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/563557/Open2ch%20ID%20Search%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URLからbbs名を取得する関数
    const getBbsName = () => {
        const path = window.location.pathname;
        const match = path.match(/\/read\.cgi\/([a-zA-Z0-9_-]+)\//);
        return match ? match[1] : '';
    };

    const bbsName = getBbsName();

    const $searchUrl = 'https://find.open2ch.net/?bbs=&t=f&q='; // ID: は searchQuery で付与する

    /**
     * 指定されたIDスパンに検索ボタンを追加する
     * @param {HTMLElement} idSpan - <span class="_id"> 要素
     * @param {string} searchUrlTemplate - 検索URLの雛形
     */
    const processIdSpan = (idSpan, searchUrlTemplate) => {

        // 1. ID情報の取得
        const idText = idSpan.getAttribute('val');
        if (!idText || idText === '???') return;

        // 2. ID整形ロジック (余計なピリオド問題を解決したもの)
        let fullId = '';
        const idLinks = idSpan.querySelectorAll('.id');

        if (idLinks.length > 0) {
            fullId = Array.from(idLinks).map(link => link.textContent).join('.');
        } else if (idText.length > 4) {
            fullId = idText.slice(0, 2) + '.' + idText.slice(2, 4) + '.' + idText.slice(4);
        } else {
            fullId = idText;
        }

        const searchQuery = 'ID:' + fullId;
        const encodedQuery = encodeURIComponent(searchQuery);
        const finalUrl = searchUrlTemplate + encodedQuery + '&wh=&d=';

        // 3. 重複チェックと既存ボタンの再利用
        const existingButton = idSpan.previousElementSibling;

        // 既に虫眼鏡アイコンを持つSPAN要素が存在する場合
        if (existingButton && existingButton.tagName === 'SPAN' && existingButton.querySelector('.fas.fa-search')) {
            // 既存のボタンに正しい機能を持つクリックイベントを追加/上書きする
            existingButton.addEventListener('click', function() {
                window.open(finalUrl, '_blank', 'noopener noreferrer');
            });
            return; // 既存要素を再利用したため、ここで終了
        }

        // 4. 新しいボタンの作成・挿入 (通常時の動作)
        const searchButton = document.createElement('span');
        searchButton.title = 'ID:' + fullId + 'を検索';
        searchButton.style.cssText = 'margin-left: 5px; cursor: pointer;';

        const icon = document.createElement('i');
        icon.className = 'fas fa-search';
        icon.style.cssText = 'color: #333;';

        searchButton.appendChild(icon);

        searchButton.addEventListener('click', function() {
            window.open(finalUrl, '_blank', 'noopener noreferrer');
        });

        // idSpanの直前に挿入 (時刻とID:の間)
        idSpan.insertAdjacentElement('beforebegin', searchButton);
    };

    // スタイルの追加（丸いボタンのデザイン）
    const style = document.createElement('style');
    style.textContent = `
        #floating-search-btn {
            position: absolute;
            z-index: 10001;
            background: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            display: none;
            transition: transform 0.1s;
        }
        #floating-search-btn:hover {
            transform: scale(1.1);
            background-color: #f0f0f0;
        }
        #floating-search-btn i {
            color: #333;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);

    // ボタン要素を作成
    const floatBtn = document.createElement('div');
    floatBtn.id = 'floating-search-btn';
    floatBtn.title = 'おーぷん全体検索';
    floatBtn.innerHTML = '<i class="fas fa-search"></i>';
    document.body.appendChild(floatBtn);

    // テキスト選択時のイベント
    document.addEventListener('mouseup', (e) => {
        // 少し遅らせて選択範囲を取得（クリック解除時のタイミング調整）
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            if (selectedText) {
                // ボタンの表示位置をマウス位置の少し右上に設定
                floatBtn.style.left = `${e.pageX + 10}px`;
                floatBtn.style.top = `${e.pageY - 40}px`;
                floatBtn.style.display = 'flex';

                // 検索実行イベント
                floatBtn.onclick = () => {
                    const url = $searchUrl + encodeURIComponent(selectedText) + '&wh=&d=';
                    window.open(url, '_blank', 'noopener noreferrer');
                    floatBtn.style.display = 'none';
                    selection.removeAllRanges(); // 選択解除
                };
            } else {
                // 何もないところをクリックしたらボタンを隠す
                if (e.target.closest('#floating-search-btn')) return;
                floatBtn.style.display = 'none';
            }
        }, 10);
    });

    // スクロール時にも隠す
    document.addEventListener('scroll', () => {
        floatBtn.style.display = 'none';
    }, { passive: true });

    // 初期実行: 既存の要素に対してボタンを追加
    // Mutation Observerで動的に追加される要素を監視
    // 監視対象を最も確実なコンテナである .thread に
    const threadContainer = document.querySelector('.thread'); // <div class="thread"> または <dl class="thread"> の両方に対応

    if (!threadContainer) {
        // コンテナが見つからなければ、処理を終了する
        //console.log('Open2ch ID Search Button: スレッドコンテナ (.thread) が見つかりません。終了します。');
        return;
    }
    // スレッドコンテナ内のみを検索対象とする
    const idSpansInitial = threadContainer.querySelectorAll('._id');
    idSpansInitial.forEach(idSpan => {
        processIdSpan(idSpan, $searchUrl);
    });

    // Mutation Observerで動的に追加される要素を監視
    // threadContainer が取得できた前提で、そのまま observer を設定
    setupObserver(threadContainer, $searchUrl);

    function setupObserver(targetNode, searchUrlTemplate) {
        const observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        // 要素ノードでない場合はスキップ
                        if (node.nodeType !== 1) return;

                        // 追加された要素（またはその子孫）から '_id' スパンを検索
                        // 新しい書き込み（<dl>）が追加された場合、その中の<dt>の._idを見つける
                        const idSpans = node.querySelectorAll('._id');
                        idSpans.forEach(idSpan => {
                            processIdSpan(idSpan, searchUrlTemplate);
                        });
                        // 追加されたノード自体が '_id' スパンの場合
                        if (node.classList && node.classList.contains('_id')) {
                            processIdSpan(node, searchUrlTemplate);
                        }
                    });
                }
            });
        });
        // スレッドコンテナとその子要素の変更を監視開始
        observer.observe(targetNode, { childList: true, subtree: true });
    }

})();