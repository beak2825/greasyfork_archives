// ==UserScript==
// @name           BetterTopMenu
// @author         Nozom.u
// @match          *://mec-itutor.jp/rpv/home/default.aspx
// @match          *://mec-itutor.jp/rpv/home/
// @version        2.0.7
// @run-at      window-load
// @description  mec-itutorのメニュー画面を修正
// @namespace https://greasyfork.org/users/1534273
// @downloadURL https://update.greasyfork.org/scripts/554859/BetterTopMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/554859/BetterTopMenu.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            /* ===== 単元タイトル部分の余白 ===== */
            .mec-unit-title-wrap,
            .mec-unit-title-wrap-small {
              padding: 8px 0 !important;
            }
            #ctl00_cplPageContent_infomationPanel > div.list-group-item,
            #scheduledDisplayListView > div.list-group-item,
            #scheduledRedisplayListView > div.list-group-item {
              padding: 0px 15px;
            }
            /* ===== デッキ・期限リンクの装飾 ===== */
            .list-group > .list-group-item > .mec-unit-title-wrap ul li.mec-list-title > a,
            .list-group > .list-group-item > .mec-unit-title-wrap ul li.mec-list-date > a {
              text-decoration: none; /* 通常はアンダーラインなし */
              line-height: 40px;
            }
            /* hover時にアンダーライン表示 */
            .list-group > .list-group-item:hover > .mec-unit-title-wrap ul li.mec-list-title > a,
            .list-group > .list-group-item:hover > .mec-unit-title-wrap ul li.mec-list-date > a {
              text-decoration: underline;
              display: block;
              line-height: 40px;
            }
            /* ヘッダーのスタイル */
            .mec-header-title.collapsible-header {
                cursor: pointer !important;
                user-select: none !important;
                transition: background-color 0.2s ease !important;
            }
            /* 矢印アイコン */
            .collapse-arrow {
                display: inline-block;
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 10px solid white;
                transition: transform 0.3s ease;
                margin-right: 8px;
                vertical-align: middle;
                position: relative;
                top: -2px;
            }
            .collapse-arrow.collapsed {
                transform: rotate(-90deg);
            }

            /* アイテムのアニメーション */
            .list-group-item.collapsible-item {
                overflow: hidden !important;
                transition: all 0.3s ease !important;
                transform-origin: top !important;
            }
            .list-group-item.collapsible-item.collapsed {
                max-height: 0 !important;
                opacity: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
                border: none !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // 初期化関数
    function initializeCollapsibleSections() {
        const sections = [
            {
                container: document.getElementById('ctl00_cplPageContent_infomationPanel'),
                name: 'お知らせ',
                storageKey: 'info'
            },
            {
                container: document.getElementById('scheduledRedisplayListView'),
                parentContainer: document.getElementById('ctl00_cplPageContent_scheduledRedisplayPanel'),
                name: '提出期限切れ',
                storageKey: 'expired'
            },
            {
                container: document.getElementById('scheduledDisplayListView'),
                parentContainer: document.getElementById('ctl00_cplPageContent_scheduledPanel'),
                name: '学習予定',
                storageKey: 'scheduled'
            }
        ];

        sections.forEach(section => {
            if (!section.container && !section.parentContainer) {
                return;
            }

            const targetContainer = section.container || section.parentContainer;
            const header = targetContainer.querySelector('.info-item-heading');

            if (!header) {
                return;
            }

            // ヘッダーに折りたたみ機能を追加
            setupCollapsibleSection(targetContainer, header, section.name, section.storageKey);
        });
    }

    // 個別セクションのセットアップ
    function setupCollapsibleSection(container, header, sectionName, storageKey) {
        // すでに設定済みの場合はスキップ
        if (header.classList.contains('collapsible-header')) {
            return;
        }

        // ヘッダーにクラスを追加とデータ属性を設定
        header.classList.add('collapsible-header');
        header.setAttribute('data-storage-key', storageKey);

        // h4.info-item-headingを探す
        const h4Element = header.querySelector('h4.info-item-heading');

        if (h4Element) {
            // 矢印アイコンを作成
            const arrow = document.createElement('span');
            arrow.className = 'collapse-arrow';

            // h4の最初に矢印を挿入（img.mec-header-iconの前）
            h4Element.insertBefore(arrow, h4Element.firstChild);
        } else {
            // h4が見つからない場合は、ヘッダーの最初に追加
            const arrow = document.createElement('span');
            arrow.className = 'collapse-arrow';
            header.insertBefore(arrow, header.firstChild);
        }

        // アイテムを取得（ヘッダー以外のlist-group-item）
        const items = Array.from(container.querySelectorAll('.list-group-item'))
            .filter(item => !item.classList.contains('mec-header-title'));

        // アイテムにクラスを追加
        items.forEach(item => {
            item.classList.add('collapsible-item');
        });

        // 状態を管理
        let isCollapsed = loadSectionState(storageKey);

        // 矢印要素を取得
        const arrow = header.querySelector('.collapse-arrow');

        // 初期状態を設定
        if (isCollapsed && arrow) {
            arrow.classList.add('collapsed');
            items.forEach(item => item.classList.add('collapsed'));
        }

        // クリックイベントを追加
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            isCollapsed = !isCollapsed;

            // アニメーション
            if (isCollapsed) {
                arrow?.classList.add('collapsed');
                items.forEach(item => item.classList.add('collapsed'));
            } else {
                arrow?.classList.remove('collapsed');
                items.forEach(item => item.classList.remove('collapsed'));
            }

            // 状態を保存
            saveSectionState(storageKey, isCollapsed);
        });
    }

    // 状態を保存
    function saveSectionState(storageKey, isCollapsed) {
        try {
            const key = `collapsible_section_${storageKey}`;
            localStorage.setItem(key, JSON.stringify(isCollapsed));
        } catch (e) {
            // ローカルストレージエラーを無視
        }
    }

    // 状態を読み込み
    function loadSectionState(storageKey) {
        try {
            const key = `collapsible_section_${storageKey}`;
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : false; // デフォルトは展開状態
        } catch (e) {
            // ローカルストレージエラーを無視
            return false;
        }
    }

    // キーボードショートカットのセットアップ（サイトに注入）
    function setupKeyboardShortcuts() {
        // サイトのグローバルスコープで実行するスクリプトを作成
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = `
        (function() {
            // セクションマップ
            const sectionMap = {
                '1': { storageKey: 'info', sectionName: 'お知らせ' },
                '2': { storageKey: 'expired', sectionName: '提出期限切れ' },
                '3': { storageKey: 'scheduled', sectionName: '学習予定' }
            };

            // キーボードイベントをリッスン
            document.addEventListener('keydown', function(e) {
                // 数字キー（1, 2, 3）を検出
                if (e.key in sectionMap) {
                    const { storageKey, sectionName } = sectionMap[e.key];
                    toggleSectionByKey(storageKey, sectionName);
                }
            });

            // セクションを切り替える関数
            function toggleSectionByKey(storageKey, sectionName) {
                const header = document.querySelector(\`.collapsible-header[data-storage-key="\${storageKey}"]\`);

                if (header) {
                    header.click();
                }
            }
        })();
        `;

        // スクリプトをDOCUMENT_START時点で実行するために、headに追加
        if (document.head) {
            document.head.appendChild(script);
        } else {
            document.documentElement.appendChild(script);
        }
    }

    // 初期化を実行
    function initialize() {
        // スタイルを追加
        addStyles();
        // キーボードショートカットをセットアップ
        setupKeyboardShortcuts();
        // DOMが完全に読み込まれるまで待つ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCollapsibleSections);
        } else {
            // 既に読み込まれている場合は直ちに実行
            initializeCollapsibleSections();
        }
    }

    // MutationObserverで動的なコンテンツ変更を監視
    function setupObserver() {
        let debounceTimer = null;
        const observer = new MutationObserver(function(mutations) {
            let shouldReinitialize = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 新しいノードが追加されたかチェック
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList &&
                            (node.classList.contains('list-group') ||
                             node.classList.contains('list-group-item'))) {
                            shouldReinitialize = true;
                        }
                    });
                }
            });

            if (shouldReinitialize) {
                // デバウンス処理：前のタイマーをクリア
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(initializeCollapsibleSections, 100);
            }
        });

        // main-gadget-areaの監視を開始
        const mainArea = document.getElementById('main-gadget-area');
        if (mainArea) {
            observer.observe(mainArea, {
                childList: true,
                subtree: true
            });
        }
    }

    // グローバル関数として公開（デバッグ用）
    window.collapsibleSections = {
        // すべてのセクションを折りたたむ
        collapseAll: function() {
            const headers = document.querySelectorAll('.mec-header-title.collapsible-header');
            headers.forEach(header => {
                const arrow = header.querySelector('.collapse-arrow');
                const items = header.parentElement.querySelectorAll('.list-group-item.collapsible-item');

                arrow?.classList.add('collapsed');
                items.forEach(item => item.classList.add('collapsed'));
            });
        },

        // すべてのセクションを展開
        expandAll: function() {
            const headers = document.querySelectorAll('.mec-header-title.collapsible-header');
            headers.forEach(header => {
                const arrow = header.querySelector('.collapse-arrow');
                const items = header.parentElement.querySelectorAll('.list-group-item.collapsible-item');

                arrow?.classList.remove('collapsed');
                items.forEach(item => item.classList.remove('collapsed'));
            });
        },

        // 状態をリセット
        resetStates: function() {
            ['info', 'expired', 'scheduled'].forEach(key => {
                localStorage.removeItem(`collapsible_section_${key}`);
            });
            location.reload();
        },

        // 再初期化
        reinitialize: function() {
            initializeCollapsibleSections();
        },

        // 現在の状態を確認
        getStates: function() {
            const states = {};
            ['info', 'expired', 'scheduled'].forEach(key => {
                const saved = localStorage.getItem(`collapsible_section_${key}`);
                states[key] = saved ? JSON.parse(saved) : false;
            });
            return states;
        }
    };

    // エラーハンドリング
    try {
        // 初期化実行
        initialize();

        // オブザーバーをセットアップ
        setupObserver();
    } catch (error) {
        // エラーを無視
    }
})();