// ==UserScript==
// @name            AnkiWeb_js
// @namespace  http://tampermonkey.net/
// @version         1.0.1
// @author          zom.u
// @description  メニュー画面に階層的な折りたたみを実装
// @match           https://ankiweb.net/decks
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/555044/AnkiWeb_js.user.js
// @updateURL https://update.greasyfork.org/scripts/555044/AnkiWeb_js.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isInitialized = false; // 二重初期化を防ぐフラグ

    // スタイルを追加
    const style = document.createElement('style');
    style.textContent = `
        .collapse-toggle {
            display: inline-block;
            width: 24px;
            cursor: pointer;
            user-select: none;
            margin-left: -28px;
            margin-right: 4px;
            text-align: center;
            padding: 2px 4px;
        }
        .collapse-toggle.no-children {
            cursor: default;
            opacity: 0.3;
        }
        .collapse-toggle:not(.no-children):hover {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 3px;
        }
        .collapsed-item {
            display: none !important;
        }
        .has-children {
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);

    // メイン処理
    function initializeCollapsible() {
        // 既に初期化済みの場合はスキップ（トグルボタンの存在で判定）
        const existingToggle = document.querySelector('.collapse-toggle');
        if (existingToggle) {
            return;
        }

        const rows = document.querySelectorAll('div.row.light-bottom-border.svelte-p9sq8d');
        if (rows.length === 0) {
            return;
        }

        console.log(`折りたたみ機能を初期化中... (${rows.length}個の項目を検出)`);

        // 各行のレベルを計算
        const items = Array.from(rows).map((row, index) => {
            const button = row.querySelector('button');
            if (!button) return null;

            // 既に処理済みの場合はスキップ
            if (button.querySelector('.collapse-toggle')) {
                return null;
            }

            // &nbsp;の数を数える
            const textContent = button.textContent;
            let nbspCount = 0;
            for (let i = 0; i < textContent.length; i++) {
                if (textContent[i] === '\u00A0') {
                    nbspCount++;
                }
            }

            // レベルを計算（3つが最上位レベル1、6つがレベル2...）
            const level = Math.floor(nbspCount / 3);

            return {
                element: row,
                button: button,
                level: level,
                index: index,
                isExpanded: false, // 初期状態を折りたたみ
                hasChildren: false,
                originalText: button.textContent // 元のテキストを保存
            };
        }).filter(item => item !== null);

        if (items.length === 0) {
            return;
        }

        // 子要素の有無を判定
        for (let i = 0; i < items.length; i++) {
            if (i < items.length - 1 && items[i + 1].level > items[i].level) {
                items[i].hasChildren = true;
            }
        }

        // トグルボタンを追加（全ての項目に）
        items.forEach((item, index) => {
            // ボタンの内容を再構築
            item.button.textContent = '';

            // nbsp部分を追加（トグル分のスペースを追加）
            const nbspSpan = document.createElement('span');
            let nbspText = '';
            for (let i = 0; i < item.level * 3; i++) {
                nbspText += '\u00A0';
            }
            // トグルボタン分のスペースを追加
            nbspText += '\u00A0\u00A0\u00A0\u00A0'; // 少し増やして調整
            nbspSpan.textContent = nbspText;
            item.button.appendChild(nbspSpan);

            // トグル要素を作成（全ての項目に追加）
            const toggle = document.createElement('span');
            toggle.className = 'collapse-toggle';

            if (item.hasChildren) {
                toggle.textContent = '▶'; // 初期状態は折りたたみ

                // クリックイベントを追加
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleChildren(items, index);
                });

                // 親要素にクラスを追加
                item.element.classList.add('has-children');
            } else {
                // 子要素がない場合は薄い表示
                toggle.textContent = '▶';
                toggle.classList.add('no-children');
            }

            item.button.appendChild(toggle);

            // 元のテキスト（nbspを除く）を追加
            const textSpan = document.createElement('span');
            textSpan.textContent = item.originalText.trim();
            item.button.appendChild(textSpan);
        });

        // 初期状態：レベル1（最上位）以外を非表示
        items.forEach(item => {
            if (item.level > 1) {  // レベル2以降を非表示
                item.element.classList.add('collapsed-item');
            }
        });

        isInitialized = true;
        console.log('折りたたみ機能の初期化完了');
    }

    // 子要素の表示/非表示を切り替え
    function toggleChildren(items, parentIndex) {
        const parent = items[parentIndex];
        parent.isExpanded = !parent.isExpanded;

        // トグルアイコンを更新
        const toggle = parent.button.querySelector('.collapse-toggle');
        if (toggle) {
            toggle.textContent = parent.isExpanded ? '▼' : '▶';
        }

        // 子要素を表示/非表示
        for (let i = parentIndex + 1; i < items.length; i++) {
            if (items[i].level <= parent.level) {
                // 同じレベルか上位レベルに達したら終了
                break;
            }

            if (items[i].level === parent.level + 1) {
                // 直接の子要素
                if (parent.isExpanded) {
                    items[i].element.classList.remove('collapsed-item');
                    // 子要素が折りたたまれていた場合、その配下も適切に処理
                    if (items[i].hasChildren && !items[i].isExpanded) {
                        // 子要素のトグルアイコンも更新
                        const childToggle = items[i].button.querySelector('.collapse-toggle');
                        if (childToggle && !childToggle.classList.contains('no-children')) {
                            childToggle.textContent = '▶';
                        }
                        collapseAllChildren(items, i);
                    }
                } else {
                    items[i].element.classList.add('collapsed-item');
                    // 子要素も折りたたみ状態にリセット
                    items[i].isExpanded = false;
                    const childToggle = items[i].button.querySelector('.collapse-toggle');
                    if (childToggle && !childToggle.classList.contains('no-children')) {
                        childToggle.textContent = '▶';
                    }
                }
            } else if (items[i].level > parent.level + 1) {
                // 孫要素以降
                if (!parent.isExpanded) {
                    items[i].element.classList.add('collapsed-item');
                }
            }
        }
    }

    // 指定した要素の全ての子要素を折りたたむ
    function collapseAllChildren(items, parentIndex) {
        const parent = items[parentIndex];
        for (let i = parentIndex + 1; i < items.length; i++) {
            if (items[i].level <= parent.level) {
                break;
            }
            items[i].element.classList.add('collapsed-item');
        }
    }

    // 初期化を試みる関数
    function tryInitialize() {
        const rows = document.querySelectorAll('div.row.light-bottom-border.svelte-p9sq8d');
        if (rows.length > 0 && !isInitialized) {
            initializeCollapsible();
        }
    }

    // 複数のタイミングで初期化を試みる
    // 1. DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInitialize);
    } else {
        tryInitialize();
    }

    // 2. window.onload
    window.addEventListener('load', tryInitialize);

    // 3. 遅延実行（SPAの場合に有効）
    setTimeout(tryInitialize, 500);
    setTimeout(tryInitialize, 1000);
    setTimeout(tryInitialize, 2000);

    // 4. MutationObserverで動的な要素追加を監視
    const observer = new MutationObserver((mutations) => {
        // 新しい要素が追加されたかチェック
        const hasNewRows = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => {
                return node.nodeType === 1 &&
                       (node.matches && (
                           node.matches('div.row.light-bottom-border.svelte-p9sq8d') ||
                           node.querySelector && node.querySelector('div.row.light-bottom-border.svelte-p9sq8d')
                       ));
            });
        });

        if (hasNewRows) {
            isInitialized = false; // リセットして再初期化を許可
            setTimeout(tryInitialize, 100);
        }
    });

    // 監視を開始
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        // bodyがまだない場合は、documentを監視
        const tempObserver = new MutationObserver(() => {
            if (document.body) {
                tempObserver.disconnect();
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                tryInitialize();
            }
        });
        tempObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

})();