// ==UserScript==
// @name         CCFOLIA Snippet Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ココフォリア用スニペットツール。ルーム別保存、AND検索、全方位リサイズ対応。
// @author       User
// @match        https://ccfolia.com/rooms/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557240/CCFOLIA%20Snippet%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/557240/CCFOLIA%20Snippet%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * CCFOLIA Snippet Tool v1.0
     * Features:
     * - ルームごとのデータ保存 (ルームID依存)
     * - AND検索 (スペース区切り)
     * - 全方位(8方向)リサイズ
     * - React Input Hackによる確実な入力
     * - JSON Import/Export
     */

    // --- 定数・初期設定 ---
    const UI_ID = 'ccfolia-snippet-ui';
    const TOGGLE_BTN_ID = 'ccfolia-snippet-toggle-btn';
    const CONFIG_KEY_PREFIX = 'ccfolia_snippet_tool';

    // ルームID取得 (URLから抽出)
    const getRoomId = () => {
        const match = window.location.pathname.match(/\/rooms\/([^\/?#]+)/);
        return match ? match[1] : 'global';
    };
    const ROOM_ID = getRoomId();

    // ストレージキー
    const STORAGE_KEY_DATA = `${CONFIG_KEY_PREFIX}_data_${ROOM_ID}`;
    const STORAGE_KEY_CONFIG = `${CONFIG_KEY_PREFIX}_config`;

    // 初期データ (CoC向けサンプル)
    const DEFAULT_DATA = {
        sections: [
            {
                name: "探索・技能",
                collapsed: false,
                items: [
                    { label: "目星", text: "CC<= 【目星】", character: "", tags: ["技能", "探索"] },
                    { label: "聞き耳", text: "CC<= 【聞き耳】", character: "", tags: ["技能", "探索"] }
                ]
            },
            {
                name: "戦闘",
                collapsed: false,
                items: [
                    { label: "近接攻撃", text: "CC<= 【こぶし/パンチ】\n1d3+db ダメージ", character: "", tags: ["戦闘", "攻撃"] },
                    { label: "回避", text: "CC<= 【回避】", character: "", tags: ["戦闘", "防御"] }
                ]
            },
            {
                name: "SAN値",
                collapsed: false,
                items: [
                    { label: "SANチェック", text: "CC<= 【SAN値チェック】\n1/1d3", character: "", tags: ["SAN", "正気度"] }
                ]
            }
        ]
    };

    const DEFAULT_CONFIG = {
        fontSize: 13,
        opacity: 0.95
    };

    // --- ステート管理 ---
    let snippetData = DEFAULT_DATA;
    let configData = DEFAULT_CONFIG;
    let editMode = { active: false, sectionIdx: null, itemIdx: null };

    // --- スタイル定義 (CSS) ---
    const styles = `
        :root { --snip-font-size: 13px; --snip-opacity: 0.95; }

        /* メインパネル */
        #${UI_ID} {
            position: fixed; top: 80px; right: 20px;
            width: 320px; height: 450px;
            min-width: 250px; min-height: 150px;
            max-width: 95vw; max-height: 95vh;
            background: rgba(30, 30, 30, var(--snip-opacity));
            color: #eee;
            border: 1px solid #555;
            border-radius: 8px;
            z-index: 9000;
            display: flex; flex-direction: column;
            font-family: "Helvetica Neue", Arial, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6);
            transition: opacity 0.2s, background 0.2s;
            font-size: var(--snip-font-size);
        }
        #${UI_ID}.hidden { display: none !important; }
        #${UI_ID}.minimized {
            height: 40px !important; width: 240px !important;
            min-width: 0; min-height: 0; overflow: hidden; resize: none;
        }
        #${UI_ID}.minimized .resizer, #${UI_ID}.minimized .content { display: none; }

        /* ヘッダー */
        #${UI_ID} .header {
            padding: 8px 12px; background: #444; border-bottom: 1px solid #555;
            cursor: move; display: flex; justify-content: space-between;
            align-items: center; user-select: none; flex-shrink: 0;
            border-radius: 7px 7px 0 0; height: 40px; box-sizing: border-box;
        }
        #${UI_ID} .header .title { font-weight: bold; font-size: 14px; color: #fff; }
        #${UI_ID} .header .controls button {
            background: none; border: none; color: #ccc; cursor: pointer;
            font-size: 16px; font-weight: bold; padding: 0 5px; margin-left: 2px;
        }
        #${UI_ID} .header .controls button:hover { color: #fff; }

        /* コンテンツエリア */
        #${UI_ID} .content {
            flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 10px;
        }
        .snippet-search {
            width: 100%; padding: 6px; margin-bottom: 8px; background: #222;
            border: 1px solid #444; color: #fff; border-radius: 4px; box-sizing: border-box;
            font-size: var(--snip-font-size);
        }
        .snippet-search:focus { border-color: #88c0d0; outline: none; }
        .snippet-list { flex: 1; overflow-y: auto; margin-bottom: 8px; padding-right: 4px; scrollbar-width: thin; }

        /* リサイズハンドル (8方向) */
        .resizer { position: absolute; background: transparent; z-index: 9001; }
        .resizer-n  { top: 0; left: 0; right: 0; height: 6px; cursor: n-resize; }
        .resizer-e  { top: 0; right: 0; bottom: 0; width: 6px; cursor: e-resize; }
        .resizer-s  { bottom: 0; left: 0; right: 0; height: 6px; cursor: s-resize; }
        .resizer-w  { top: 0; left: 0; bottom: 0; width: 6px; cursor: w-resize; }
        .resizer-ne { top: 0; right: 0; width: 12px; height: 12px; cursor: ne-resize; z-index: 9002; }
        .resizer-nw { top: 0; left: 0; width: 12px; height: 12px; cursor: nw-resize; z-index: 9002; }
        .resizer-se { bottom: 0; right: 0; width: 12px; height: 12px; cursor: se-resize; z-index: 9002; }
        .resizer-sw { bottom: 0; left: 0; width: 12px; height: 12px; cursor: sw-resize; z-index: 9002; }

        /* セクション表示 */
        .snippet-section { margin-bottom: 8px; }
        .snippet-section-header {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #444; margin-bottom: 4px; padding: 4px 6px;
            cursor: pointer; user-select: none;
            background: rgba(255, 255, 255, 0.05); border-radius: 4px;
        }
        .snippet-section-header:hover { background: rgba(255, 255, 255, 0.1); }
        .snippet-section-title { font-size: 12px; color: #88c0d0; font-weight: bold; display: flex; align-items: center;}
        .snippet-section-title .icon { font-size: 10px; width: 16px; color: #aaa; }
        .section-controls button {
            background: none; border: 1px solid transparent; color: #666;
            cursor: pointer; font-size: 10px; padding: 0 4px; border-radius: 3px;
        }
        .section-controls button:hover { color: #fff; background: #555; }

        /* アイテム表示 */
        .snippet-items-container { display: block; }
        .snippet-items-container.collapsed { display: none; }
        .snippet-item {
            position: relative; padding: 8px; margin-bottom: 4px; background: #333;
            border-radius: 4px; cursor: pointer; border: 1px solid transparent; margin-left: 4px;
            transition: background 0.1s;
        }
        .snippet-item:hover { background: #444; border-color: #666; }
        .snippet-item .header-line { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
        .snippet-item .char-badge {
            font-size: 10px; background: #5e81ac; color: #eceff4;
            padding: 1px 4px; border-radius: 3px; font-weight: bold;
        }
        .snippet-item .label { font-weight: bold; color: #e5e9f0; }
        .snippet-item .preview {
            font-size: 0.9em; color: #aaa; white-space: nowrap; overflow: hidden;
            text-overflow: ellipsis; display: block;
        }
        .snippet-tags { margin-top: 4px; }
        .snippet-tag {
            display: inline-block; background: #2c3e50; color: #aeb6bf;
            font-size: 10px; padding: 1px 5px; border-radius: 3px; margin-right: 4px;
        }
        .item-actions { position: absolute; top: 6px; right: 6px; display: none; }
        .snippet-item:hover .item-actions { display: block; }
        .item-actions button {
            background: #222; border: 1px solid #555; color: #fff;
            border-radius: 3px; font-size: 10px; cursor: pointer; padding: 3px 8px;
        }
        .item-actions button:hover { background: #555; }

        /* フッターボタン */
        .snippet-toolbar { display: flex; gap: 6px; border-top: 1px solid #444; padding-top: 10px; flex-shrink: 0; }
        .snippet-btn {
            flex: 1; padding: 6px; background: #3b3b3b; border: 1px solid #555;
            color: #ddd; border-radius: 4px; cursor: pointer; font-size: 12px;
            text-align: center;
        }
        .snippet-btn:hover { background: #505050; color: #fff; }
        .snippet-btn.primary { background: #2e8b57; border-color: #2e8b57; color: #fff; }
        .snippet-btn.primary:hover { background: #3cb371; }
        .snippet-btn.danger { background: #a11; border-color: #a11; color: #fff; }
        .snippet-btn.danger:hover { background: #c33; }

        /* ヘッダーへのトグルボタン */
        #${TOGGLE_BTN_ID} {
            height: 32px; padding: 0 12px; margin-right: 8px;
            background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2);
            color: #fff; border-radius: 4px; cursor: pointer;
            font-size: 13px; font-weight: bold; display: flex; align-items: center;
        }
        #${TOGGLE_BTN_ID}:hover { background: rgba(0,0,0,0.6); border-color: rgba(255,255,255,0.4); }

        /* モーダル */
        .snip-modal {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.7); z-index: 9999; display: none;
            justify-content: center; align-items: center;
        }
        .modal-content {
            background: #252525; padding: 20px; width: 420px; max-width: 90%;
            border-radius: 8px; color: #fff; box-shadow: 0 0 25px rgba(0,0,0,0.8);
            display: flex; flex-direction: column; gap: 12px; border: 1px solid #444;
        }
        .modal-content h3 { margin: 0 0 8px 0; border-bottom: 1px solid #444; padding-bottom: 8px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-size: 12px; color: #aaa; margin-bottom: 4px; font-weight: bold; }
        .form-group input, .form-group textarea, .form-group select {
            background: #111; border: 1px solid #444; color: #fff;
            padding: 8px; border-radius: 4px; font-size: 13px;
        }
        .form-group input:focus, .form-group textarea:focus { border-color: #88c0d0; outline: none; }
        .form-group textarea { min-height: 80px; resize: vertical; font-family: monospace; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
        .config-section { border-top: 1px solid #444; margin-top: 10px; padding-top: 10px; }
    `;

    // --- データ保存・読込 ---
    function loadData() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY_DATA);
            snippetData = savedData ? JSON.parse(savedData) : JSON.parse(JSON.stringify(DEFAULT_DATA));
        } catch (e) {
            console.error("Data Load Error:", e);
            snippetData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        }

        try {
            const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
            configData = savedConfig ? { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) } : { ...DEFAULT_CONFIG };
        } catch (e) {
            console.error("Config Load Error:", e);
        }
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(snippetData));
    }

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(configData));
        applyConfig();
    }

    function applyConfig() {
        const panel = document.getElementById(UI_ID);
        if (panel) {
            panel.style.setProperty('--snip-font-size', `${configData.fontSize}px`);
            panel.style.setProperty('--snip-opacity', configData.opacity);
        }
    }

    // --- React Input Hack (重要) ---
    // React管理下のinput/textareaに値をセットしてイベントを発火させる
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // --- アクション: 貼り付け ---
    async function applySnippet(item) {
        // キャラクター名セット
        if (item.character && item.character.trim() !== "") {
            const charInput = document.querySelector('input[name="name"]');
            if (charInput) {
                setNativeValue(charInput, item.character);
                // Reactのステート更新待ち
                await new Promise(r => setTimeout(r, 50));
            }
        }
        // テキストセット
        const chatInput = document.querySelector('textarea[data-testid="chat-input"]') || document.querySelector('textarea[name="text"]');
        if (chatInput) {
            setNativeValue(chatInput, item.text);
            chatInput.focus();
        } else {
            alert("チャット入力欄が見つかりません。");
        }
    }

    // セクション移動
    function moveSection(index, direction) {
        if (direction === 'up' && index > 0) {
            [snippetData.sections[index], snippetData.sections[index - 1]] = [snippetData.sections[index - 1], snippetData.sections[index]];
        } else if (direction === 'down' && index < snippetData.sections.length - 1) {
            [snippetData.sections[index], snippetData.sections[index + 1]] = [snippetData.sections[index + 1], snippetData.sections[index]];
        }
        saveData(); renderList();
    }
    // グローバル公開 (HTML内のonclick用)
    window.moveSnippetSection = moveSection;

    // --- UI生成 ---
    function createUI() {
        // スタイル注入
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);

        // メインパネル
        const panel = document.createElement('div');
        panel.id = UI_ID;
        panel.classList.add('hidden');
        panel.innerHTML = `
            <div class="resizer resizer-n"></div><div class="resizer resizer-e"></div><div class="resizer resizer-s"></div><div class="resizer resizer-w"></div>
            <div class="resizer resizer-ne"></div><div class="resizer resizer-nw"></div><div class="resizer resizer-se"></div><div class="resizer resizer-sw"></div>
            <div class="header">
                <span class="title">Snippet Tool v1.0</span>
                <div class="controls">
                    <button id="snip-config-btn" title="設定">⚙</button>
                    <button id="snip-min-btn" title="最小化/復元">_</button>
                    <button id="snip-close-btn" title="閉じる">×</button>
                </div>
            </div>
            <div class="content">
                <input type="text" class="snippet-search" placeholder="検索 (スペースでAND検索)..." id="snip-search">
                <div class="snippet-list" id="snip-list"></div>
                <div class="snippet-toolbar">
                    <button class="snippet-btn primary" id="snip-add-btn">+ 追加</button>
                    <button class="snippet-btn" id="snip-import-btn">読込</button>
                    <button class="snippet-btn" id="snip-export-btn">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // アイテム編集モーダル
        const editModal = document.createElement('div');
        editModal.className = 'snip-modal';
        editModal.id = 'snip-edit-modal';
        editModal.innerHTML = `
            <div class="modal-content">
                <h3 id="snip-modal-title">アイテム編集</h3>
                <div class="form-group">
                    <label>セクション (新規入力可)</label>
                    <input type="text" list="snip-section-list" id="snip-in-section" placeholder="セクション名">
                    <datalist id="snip-section-list"></datalist>
                </div>
                <div class="form-group">
                    <label>キャラクター名 (任意・完全一致で切替)</label>
                    <input type="text" id="snip-in-char" placeholder="例: PC1">
                </div>
                <div class="form-group">
                    <label>ラベル</label>
                    <input type="text" id="snip-in-label" placeholder="リストに表示される名前">
                </div>
                <div class="form-group">
                    <label>テキスト (チャット本文)</label>
                    <textarea id="snip-in-text"></textarea>
                </div>
                <div class="form-group">
                    <label>タグ (カンマ区切り)</label>
                    <input type="text" id="snip-in-tags" placeholder="例: 戦闘, 攻撃">
                </div>
                <div class="modal-footer">
                    <button class="snippet-btn danger" id="snip-edit-delete" style="margin-right:auto;">削除</button>
                    <button class="snippet-btn" id="snip-edit-cancel">キャンセル</button>
                    <button class="snippet-btn primary" id="snip-edit-save">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(editModal);

        // 設定モーダル
        const configModal = document.createElement('div');
        configModal.className = 'snip-modal';
        configModal.id = 'snip-config-modal';
        configModal.innerHTML = `
            <div class="modal-content">
                <h3>設定</h3>
                <div class="form-group">
                    <label>フォントサイズ (px)</label>
                    <input type="number" id="cfg-font-size" min="10" max="24">
                </div>
                <div class="form-group">
                    <label>背景の不透明度 (0.1 ~ 1.0)</label>
                    <input type="number" id="cfg-opacity" min="0.1" max="1.0" step="0.05">
                </div>
                <div class="config-section">
                    <label style="color:#ff6b6b;">データ初期化</label>
                    <p style="font-size:11px; color:#aaa; margin:4px 0 8px;">このルームのスニペットをすべて削除し、初期状態に戻します。</p>
                    <button class="snippet-btn danger" id="cfg-reset-btn">初期化を実行</button>
                </div>
                <div class="modal-footer">
                    <button class="snippet-btn" id="cfg-close-btn">閉じる</button>
                    <button class="snippet-btn primary" id="cfg-save-btn">設定を保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(configModal);

        // ファイル入力用 (Hidden)
        const fileInput = document.createElement('input');
        fileInput.type = 'file'; fileInput.accept = '.json'; fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        applyConfig();

        // --- イベントリスナー設定 ---

        // 8方向リサイズ処理
        const resizers = panel.querySelectorAll('.resizer');
        const minW = 250, minH = 150;
        resizers.forEach(resizer => resizer.addEventListener('mousedown', initResize));

        function initResize(e) {
            e.preventDefault(); // テキスト選択防止
            const resizer = e.target;
            const direction = resizer.className.replace('resizer resizer-', '');
            const startX = e.clientX, startY = e.clientY;
            const startW = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
            const startH = parseInt(document.defaultView.getComputedStyle(panel).height, 10);
            const startLeft = panel.getBoundingClientRect().left;
            const startTop = panel.getBoundingClientRect().top;

            function doResize(e) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // 横方向
                if (direction.includes('e')) {
                    panel.style.width = Math.max(minW, startW + dx) + 'px';
                } else if (direction.includes('w')) {
                    const newW = Math.max(minW, startW - dx);
                    panel.style.width = newW + 'px';
                    if (newW > minW) panel.style.left = (startLeft + dx) + 'px';
                }

                // 縦方向
                if (direction.includes('s')) {
                    panel.style.height = Math.max(minH, startH + dy) + 'px';
                } else if (direction.includes('n')) {
                    const newH = Math.max(minH, startH - dy);
                    panel.style.height = newH + 'px';
                    if (newH > minH) panel.style.top = (startTop + dy) + 'px';
                }
            }
            function stopResize() {
                window.removeEventListener('mousemove', doResize);
                window.removeEventListener('mouseup', stopResize);
            }
            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);
        }

        // ドラッグ移動
        const header = panel.querySelector('.header');
        let isDragging = false, offX, offY;
        header.addEventListener('mousedown', e => {
            if(e.target.tagName === 'BUTTON') return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offX = e.clientX - rect.left;
            offY = e.clientY - rect.top;
        });
        document.addEventListener('mousemove', e => {
            if(!isDragging) return;
            panel.style.top = (e.clientY - offY) + 'px';
            panel.style.left = (e.clientX - offX) + 'px';
            panel.style.right = 'auto'; // Right固定解除
        });
        document.addEventListener('mouseup', () => isDragging = false);

        // パネル制御
        const toggleMin = () => panel.classList.toggle('minimized');
        const closePanel = () => {
            panel.classList.add('hidden');
            const btn = document.getElementById(TOGGLE_BTN_ID);
            if(btn) btn.style.display = 'flex';
        };
        panel.querySelector('#snip-min-btn').addEventListener('click', toggleMin);
        header.addEventListener('dblclick', toggleMin);
        panel.querySelector('#snip-close-btn').addEventListener('click', closePanel);

        // 設定ボタン
        panel.querySelector('#snip-config-btn').addEventListener('click', () => {
            document.getElementById('cfg-font-size').value = configData.fontSize;
            document.getElementById('cfg-opacity').value = configData.opacity;
            configModal.style.display = 'flex';
        });

        // 検索機能
        const searchInput = panel.querySelector('#snip-search');
        searchInput.addEventListener('input', () => renderList(searchInput.value));

        // インポート/エクスポート
        panel.querySelector('#snip-export-btn').addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(snippetData, null, 2)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url;
            a.download = `ccfolia_snippets_${ROOM_ID}.json`;
            a.click(); URL.revokeObjectURL(url);
        });
        panel.querySelector('#snip-import-btn').addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', e => {
            const file = e.target.files[0]; if(!file) return;
            const reader = new FileReader();
            reader.onload = evt => {
                try {
                    const d = JSON.parse(evt.target.result);
                    if(d.sections) {
                        snippetData = d; saveData(); renderList(searchInput.value);
                        alert("データを読み込みました。");
                    }
                } catch(err) { alert("ファイル形式が正しくありません: " + err); }
            };
            reader.readAsText(file); fileInput.value = '';
        });

        // 追加ボタン
        panel.querySelector('#snip-add-btn').addEventListener('click', () => openEditModal());

        // --- リスト内クリックイベント移譲 ---
        const listEl = panel.querySelector('#snip-list');
        listEl.addEventListener('click', e => {
            if(e.target.tagName === 'BUTTON') return;

            // セクション開閉
            const headerEl = e.target.closest('.snippet-section-header');
            if (headerEl && !e.target.closest('.section-controls')) {
                const sIdx = parseInt(headerEl.dataset.idx, 10);
                if (!isNaN(sIdx)) {
                    snippetData.sections[sIdx].collapsed = !snippetData.sections[sIdx].collapsed;
                    saveData();
                    renderList(searchInput.value);
                }
                return;
            }

            // アイテムクリック (貼り付け)
            const itemEl = e.target.closest('.snippet-item');
            if(itemEl) {
                const item = JSON.parse(decodeURIComponent(itemEl.dataset.json));
                applySnippet(item);
            }
        });

        // --- 編集モーダル関連 ---
        const inSection = document.getElementById('snip-in-section');
        const inChar = document.getElementById('snip-in-char');
        const inLabel = document.getElementById('snip-in-label');
        const inText = document.getElementById('snip-in-text');
        const inTags = document.getElementById('snip-in-tags');
        const dlSection = document.getElementById('snip-section-list');

        function openEditModal(secIdx = null, itmIdx = null) {
            editMode = { active: (secIdx !== null), secIdx, itmIdx };
            dlSection.innerHTML = '';
            snippetData.sections.forEach(s => {
                const opt = document.createElement('option'); opt.value = s.name; dlSection.appendChild(opt);
            });

            if (editMode.active) {
                const item = snippetData.sections[secIdx].items[itmIdx];
                document.getElementById('snip-modal-title').textContent = "アイテム編集";
                inSection.value = snippetData.sections[secIdx].name;
                inChar.value = item.character || "";
                inLabel.value = item.label;
                inText.value = item.text;
                inTags.value = (item.tags || []).join(', ');
                document.getElementById('snip-edit-delete').style.visibility = 'visible';
            } else {
                document.getElementById('snip-modal-title').textContent = "新規追加";
                inSection.value = snippetData.sections.length > 0 ? snippetData.sections[0].name : "";
                inChar.value = ""; inLabel.value = ""; inText.value = ""; inTags.value = "";
                document.getElementById('snip-edit-delete').style.visibility = 'hidden';
            }
            editModal.style.display = 'flex';
            inLabel.focus();
        }
        window.openSnippetEditor = openEditModal; // グローバル公開

        document.getElementById('snip-edit-cancel').addEventListener('click', () => editModal.style.display = 'none');

        document.getElementById('snip-edit-save').addEventListener('click', () => {
            const sName = inSection.value.trim() || "未分類";
            const newItem = {
                label: inLabel.value.trim() || "名称未設定",
                text: inText.value,
                character: inChar.value.trim(),
                tags: inTags.value.split(/[ ,、]+/).map(t=>t.trim()).filter(t=>t)
            };

            // 編集モードなら元のアイテムを削除
            if (editMode.active) {
                snippetData.sections[editMode.secIdx].items.splice(editMode.itmIdx, 1);
                // セクションが空になったらセクションごと消す
                if(snippetData.sections[editMode.secIdx].items.length === 0) {
                    snippetData.sections.splice(editMode.secIdx, 1);
                }
            }

            // 追加先のセクションを探す or 作る
            let targetSec = snippetData.sections.find(s => s.name === sName);
            if (!targetSec) {
                targetSec = { name: sName, collapsed: false, items: [] };
                snippetData.sections.push(targetSec);
            }
            targetSec.items.push(newItem);

            saveData(); renderList(searchInput.value); editModal.style.display = 'none';
        });

        document.getElementById('snip-edit-delete').addEventListener('click', () => {
            if(!confirm("本当に削除しますか？")) return;
            if (editMode.active) {
                snippetData.sections[editMode.secIdx].items.splice(editMode.itmIdx, 1);
                if(snippetData.sections[editMode.secIdx].items.length === 0) {
                    snippetData.sections.splice(editMode.secIdx, 1);
                }
                saveData(); renderList(searchInput.value); editModal.style.display = 'none';
            }
        });

        // --- 設定モーダル関連 ---
        document.getElementById('cfg-close-btn').addEventListener('click', () => configModal.style.display = 'none');
        document.getElementById('cfg-save-btn').addEventListener('click', () => {
            configData.fontSize = parseInt(document.getElementById('cfg-font-size').value, 10) || 13;
            configData.opacity = parseFloat(document.getElementById('cfg-opacity').value) || 0.95;
            saveConfig();
            configModal.style.display = 'none';
        });
        document.getElementById('cfg-reset-btn').addEventListener('click', () => {
            if(confirm("【警告】\n現在のルームのデータをすべて削除し、初期状態に戻します。\n本当によろしいですか？")) {
                snippetData = JSON.parse(JSON.stringify(DEFAULT_DATA));
                saveData(); renderList();
                configModal.style.display = 'none';
                alert("初期化しました。");
            }
        });
    }

    // --- リスト描画 ---
    function renderList(filterText = "") {
        const listEl = document.getElementById('snip-list');
        if (!listEl) return;
        listEl.innerHTML = '';

        // 空白区切りでAND検索
        const keywords = filterText.toLowerCase().split(/[\s　]+/).filter(k => k.trim() !== "");

        snippetData.sections.forEach((section, sIdx) => {
            const filteredItems = section.items.map((item, iIdx) => ({...item, origIdx: iIdx})).filter(item => {
                if (keywords.length === 0) return true;
                return keywords.every(kw => {
                    const inLabel = item.label.toLowerCase().includes(kw);
                    const inText = item.text.toLowerCase().includes(kw);
                    const inChar = (item.character || "").toLowerCase().includes(kw);
                    const inTags = (item.tags || []).some(t => t.toLowerCase().includes(kw));
                    return inLabel || inText || inChar || inTags;
                });
            });

            if (filteredItems.length === 0 && keywords.length > 0) return; // 検索ヒットなしならセクション非表示

            // セクションヘッダー
            const secHeader = document.createElement('div');
            secHeader.className = 'snippet-section-header';
            secHeader.dataset.idx = sIdx;

            const isOpen = keywords.length > 0 ? true : !section.collapsed; // 検索中は強制オープン
            const icon = isOpen ? '▼' : '▶';

            let controlsHtml = '';
            // 検索中以外は並び替えボタン表示
            if (keywords.length === 0) {
                const upBtn = sIdx > 0 ? `<button onclick="window.moveSnippetSection(${sIdx}, 'up')">▲</button>` : '';
                const downBtn = sIdx < snippetData.sections.length - 1 ? `<button onclick="window.moveSnippetSection(${sIdx}, 'down')">▼</button>` : '';
                controlsHtml = `<div class="section-controls">${upBtn}${downBtn}</div>`;
            }

            secHeader.innerHTML = `
                <span class="snippet-section-title"><span class="icon">${icon}</span>${section.name}</span>
                ${controlsHtml}
            `;
            listEl.appendChild(secHeader);

            // アイテム群
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'snippet-items-container' + (isOpen ? '' : ' collapsed');

            filteredItems.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'snippet-item';
                itemEl.dataset.json = encodeURIComponent(JSON.stringify(item));

                const tagsHtml = (item.tags || []).map(t => `<span class="snippet-tag">${t}</span>`).join('');
                const charHtml = item.character ? `<span class="char-badge">[${item.character}]</span>` : '';

                itemEl.innerHTML = `
                    <div class="item-actions"><button class="edit-btn">編集</button></div>
                    <div class="header-line">${charHtml}<span class="label">${item.label}</span></div>
                    <span class="preview">${item.text}</span>
                    <div class="snippet-tags">${tagsHtml}</div>
                `;
                itemEl.querySelector('.edit-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.openSnippetEditor(sIdx, item.origIdx);
                });
                itemsContainer.appendChild(itemEl);
            });
            listEl.appendChild(itemsContainer);
        });
    }

    // --- トグルボタン注入 ---
    function injectToggleBtn() {
        if (document.getElementById(TOGGLE_BTN_ID)) return;
        const header = document.querySelector('header') || document.querySelector('div[class*="MuiAppBar"]');
        if (!header) return;

        const btn = document.createElement('div');
        btn.id = TOGGLE_BTN_ID; btn.textContent = "Snippet"; btn.title = "スニペットツールを表示";

        // パネルが表示されていたらボタンは隠す
        const panel = document.getElementById(UI_ID);
        btn.style.display = (panel && !panel.classList.contains('hidden')) ? 'none' : 'flex';

        btn.addEventListener('click', () => {
            if (panel) { panel.classList.remove('hidden'); btn.style.display = 'none'; }
        });

        // 挿入位置: キャラクターボタン付近またはツールバー先頭
        const charBtn = Array.from(header.querySelectorAll('button')).find(b =>
            b.getAttribute('aria-label')?.includes('キャラクター') || b.title?.includes('キャラクター')
        );
        if (charBtn) {
            charBtn.parentNode.insertBefore(btn, charBtn);
        } else {
            const toolbar = header.querySelector('div[class*="Toolbar"]') || header.lastElementChild;
            if(toolbar) toolbar.insertBefore(btn, toolbar.firstChild);
        }
    }

    // --- 初期化 ---
    function init() {
        loadData();
        // ココフォリアのロード待ち
        const timer = setInterval(() => {
            // テキストエリアが存在すればロード完了とみなす
            if (document.querySelector('textarea')) {
                clearInterval(timer);
                createUI();
                injectToggleBtn();
                renderList();
            }
        }, 1000);
    }

    init();

})();