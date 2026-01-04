// ==UserScript==
// @name           Tokimeki MediaView Fix Plus
// @icon           data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌈</text></svg>
// @version        3.6
// @description    Enables navigating to individual post pages by clicking on the body or quote source in TOKIMEKI's "Media" style. Also adds keyboard shortcuts for reactions.
// @description:ja TOKIMEKIの「メディア」スタイルで投稿の本文や引用元をクリックした際に、その投稿の個別ページに移動できるようにします。また、キーボードショートカットでリアクション操作ができるようになります。
// @author         ねおん
// @namespace      https://bsky.app/profile/neon-ai.art
// @homepage       https://neon-aiart.github.io/
// @match          https://tokimeki.blue/*
// @match          https://tokimekibluesky.vercel.app/*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @license        PolyForm Noncommercial 1.0.0; https://polyformproject.org/licenses/noncommercial/1.0.0/
// @downloadURL https://update.greasyfork.org/scripts/550775/Tokimeki%20MediaView%20Fix%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/550775/Tokimeki%20MediaView%20Fix%20Plus.meta.js
// ==/UserScript==

/**
 * ==============================================================================
 * IMPORTANT NOTICE / 重要事項
 * ==============================================================================
 * Copyright (c) 2025 ねおん (Neon)
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * * [JP] 本スクリプトは個人利用・非営利目的でのみ使用・改変が許可されます。
 * 無断転載、作者名の書き換え、およびクレジットの削除は固く禁じます。
 * 本スクリプトを改変・配布（フォーク）する場合は、必ず元の作者名（ねおん）
 * およびこのクレジット表記を維持してください。
 * * [EN] This script is licensed for personal and non-commercial use only.
 * Unauthorized re-uploading, modification of authorship, or removal of
 * author credits is strictly prohibited. If you fork this project, you MUST
 * retain the original credits and authorship.
 * ==============================================================================
 */

(function() {
    'use strict';

    const VERSION = '3.6';
    const STORE_KEY = 'tokimeki_media_fix_shortcuts';

    // ========= 設定 =========
    let shortcuts = GM_getValue(STORE_KEY, {
        reply: 'Numpad1',
        repost: 'Numpad2',
        like: 'Numpad3',
        quote: 'Numpad4',
        bookmark: 'Numpad5',
        moderation: 'Numpad6'
    });

    // ========= クリックでポストを開く処理 (v1.4ベース) =========
    document.body.addEventListener('click', function(e) {
        // --- Step 0: 設定UIが開いている場合は何もしない ---
        if (document.querySelector('.tmf-overlay')) {
            return;
        }

        // --- Step 1: リンクやボタンなど、明確に除外する要素をクリックした場合は、即座に処理を終了する ---
        if (e.target.closest('a, button, .timeline-reaction, .timeline-image, .timeline-video-wrap')) {
            return;
        }

        // --- Step 2: テキストを選択中の場合は何もしない ---
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            return;
        }

        // --- Step 3: クリックが投稿のコンテンツエリア内で行われたかを確認 ---
        const postContent = e.target.closest('.timeline__content');
        if (!postContent) {
            return;
        }

        // --- Step 4: その投稿が対象のコンテナ（メディアビュー or 引用一覧）内にあることを確認 ---
        if (!postContent.closest('div.media-content, div.v2-modal-contents')) {
            return;
        }

        // --- Step 5: 全てのチェックを通過した場合、atURIを取得してページを遷移させる ---
        const atUri = postContent.dataset.aturi;

        if (atUri && atUri.startsWith('at://') && atUri.includes('/app.bsky.feed.post/')) {
            const parts = atUri.replace('at://', '').split('/');
            const did = parts[0];
            const rkey = parts[2];
            const postUrl = `/profile/${did}/post/${rkey}`;

            // TOKIMEKI本体のイベントをキャンセルし、ページ移動を実行
            e.preventDefault();
            e.stopPropagation();
            window.location.href = postUrl;
        }
    }, true); // イベントキャプチャリングを使い、TOKIMEKIの処理より先にこのリスナーを実行

    // ========= キーボード操作 =========
    document.body.addEventListener('keydown', function(e) {
        // メディアビューが開いていない、または入力欄にフォーカスがある、設定画面が開いている場合は何もしない
        const dialog = document.querySelector('dialog.media-content-wrap[open]');
        const activeEl = document.activeElement;
        if (!dialog || (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) || document.querySelector('.tmf-overlay')) {
            return;
        }

        // 保存時と同じルールで「今押されたキー文字列」を作成
        const modifiers = [];
        if (e.ctrlKey) modifiers.push('Ctrl');
        if (e.shiftKey) modifiers.push('Shift');
        if (e.altKey) modifiers.push('Alt');

        if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

        // キー名の正規化（矢印キー以外は左右の区別を消す）
        let keyName = e.code;
        if (!keyName.startsWith('Arrow')) {
            keyName = keyName.replace('Left', '').replace('Right', '');
        }
        keyName = keyName.replace('Key', '').replace('Digit', '');
        if (keyName === 'Escape') keyName = 'Esc';
        if (keyName === 'Backspace') keyName = 'BS';

        const finalKeys = [...new Set([...modifiers, keyName])];
        const currentPressedKey = finalKeys.join('+');

        // 押されたキーに一致するアクションを探す
        let action = Object.keys(shortcuts).find(key => currentPressedKey === shortcuts[key]);
        let isParentOperation = false;

        // Ctrl+押されたキーで設定があるか探し直す
        if (!action && currentPressedKey.startsWith('Ctrl+')) {
            const baseKey = currentPressedKey.replace('Ctrl+', '');
            action = Object.keys(shortcuts).find(key => shortcuts[key] === baseKey);
            if (action) isParentOperation = true;
        }

        // 複数画像操作（Shift + ArrowLeft/Right）
        if (currentPressedKey === 'Shift+ArrowLeft' || currentPressedKey === 'Shift+ArrowRight') {
            e.preventDefault();
            e.stopPropagation();

            // emblaコンポーネント（画像スライドショー全体）をダイアログ内から探す
            const emblaContainer = dialog.querySelector('.embla');
            if (emblaContainer) {
                let targetButton = null;

                if (currentPressedKey === 'Shift+ArrowLeft') {
                    targetButton = emblaContainer.querySelector('.embla__prev');
                } else if (currentPressedKey === 'Shift+ArrowRight') {
                    targetButton = emblaContainer.querySelector('.embla__next');
                }

                if (targetButton) {
                    targetButton.click();
                    targetButton.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        targetButton.style.transform = '';
                    }, 150);
                    return;
                }
            }
        }

        // 本文のスクロール操作（ArrowUp/Down）
        if (currentPressedKey === 'ArrowUp' || currentPressedKey === 'ArrowDown') {
            // .media-contentを探す
            const scrollTarget = dialog.querySelector('.media-content');

            if (scrollTarget) {
                // はみ出している（スクロールバーがある）場合のみ独自処理
                if (scrollTarget.scrollHeight > scrollTarget.clientHeight) {
                    e.preventDefault();
                    e.stopPropagation();

                    const scrollAmount = 40; // 1回のスクロール量（px）
                    const direction = (currentPressedKey === 'ArrowUp') ? -1 : 1;

                    scrollTarget.scrollBy({
                        top: scrollAmount * direction,
                        behavior: 'smooth'
                    });
                    return;
                }
            }
        }

        if (!action) return;

        // イベントのデフォルト動作をキャンセル
        e.preventDefault();
        e.stopPropagation();

        // ダイアログ内の対応するボタンを探してクリック！
        const contentArea = dialog.querySelector('.media-content__content');
        if (!contentArea) return;

        // モデレーション操作
        if (action === 'moderation') {
            // 投稿全体（.media-content）を取得
            const postContainer = contentArea.closest('.media-content');
            if (!postContainer) return;

            // 警告コンテナ（「表示する」ボタンの親）と非表示化コンテナ（「隠す」ボタンの親）
            const warnContainer = postContainer.querySelector('.media-content__image .timeline-warn');
            const hidingContainer = postContainer.querySelector('.media-content__image .timeline-warn-hiding');

            let targetButton = null;

            // どちらのコンテナが現在「表示」されているかを判別する
            // TOKINMEKIの構造では、非表示のコンテナに 'display: none' などがつくため、
            // どちらのコンテナがアクティブ（表示されている）かを判定する。
            if (warnContainer && warnContainer.style.display !== 'none' && warnContainer.offsetParent !== null) {
                // 警告が表示されている状態（画像が隠されている状態）
                // warnContainer の中にあるボタン（「表示する」ボタン）を探す
                targetButton = warnContainer.querySelector('.timeline-warn-button button');
            } else if (hidingContainer && hidingContainer.style.display !== 'none' && hidingContainer.offsetParent !== null) {
                // 画像が表示されている状態（警告が隠されている状態）
                // hidingContainer の中にあるボタン（「隠す」ボタン）を探す
                targetButton = hidingContainer.querySelector('.timeline-warn-button button');
            }

            if (targetButton) {
                targetButton.click();
                // エフェクト
                targetButton.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    targetButton.style.transform = '';
                }, 150);
            }
            return;
        }

        // リアクション操作
        const reactionAreas = contentArea.querySelectorAll('.timeline-reaction');
        if (reactionAreas.length === 0) return;

        // --- ターゲットにするAreaを決定 ---
        const reactionArea = (isParentOperation && reactionAreas.length > 1)
            ? reactionAreas[0]                         // 親ポスト
            : reactionAreas[reactionAreas.length - 1]; // 通常（子ポスト）

        let button;
        switch (action) {
            case 'reply':
                button = reactionArea.querySelector('.timeline-reaction__item--reply');
                break;
            case 'repost':
                button = reactionArea.querySelector('.timeline-reaction__item--repost');
                break;
            case 'like':
                button = reactionArea.querySelector('.timeline-reaction__item--like');
                break;
            case 'quote':
                button = reactionArea.querySelector('.timeline-reaction__item--quote');
                break;
            case 'bookmark':
                // ブックマークはボタンが入れ子になってるので注意です！
                button = reactionArea.querySelector('.timeline-reaction__item--bookmark');
                break;
        }

        if (button) {
            button.click();
            // いいねボタンとかは色がすぐ変わらないので、見た目でわかるようにちょっとエフェクトをつけます✨
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
    }, true);

    // ========= 設定UI =========
    function ensureStyle() {
        if (document.getElementById('tmf-style')) return;
        const style = document.createElement('style');
        style.id = 'tmf-style';
        style.textContent = `
        :root { --tmf-bg-color: #1a1a1a; --tmf-text-color: #f0f0f0; --tmf-border-color: #333; --tmf-primary-color: #00a8ff; --tmf-primary-hover: #007bff; --tmf-secondary-color: #343a40; --tmf-modal-bg: #212529; --tmf-shadow: 0 8px 16px rgba(0, 0, 0, 0.5); --tmf-border-radius: 12px; }
        .tmf-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; }
        .tmf-panel { background-color: var(--tmf-modal-bg); color: var(--tmf-text-color); width: 90%; max-width: 480px; border-radius: var(--tmf-border-radius); box-shadow: var(--tmf-shadow); border: 1px solid var(--tmf-border-color); font-family: 'Inter', sans-serif; overflow: hidden; }
        .tmf-title { padding: 15px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--tmf-border-color); font-size: 1.25rem; font-weight: 600; margin: 0; }
        .tmf-close { background: none; border: none; cursor: pointer; font-size: 24px; color: var(--tmf-text-color); opacity: 0.7; padding: 0; }
        .tmf-close:hover { opacity: 1; }
        .tmf-section { padding: 20px; }
        .tmf-shortcut-grid { display: grid; grid-template-columns: max-content 1fr; gap: 15px; align-items: center; }
        .tmf-label { font-size: 1rem; font-weight: 500; color: #e0e0e0; display: flex; align-items: center; gap: 8px; }
        .tmf-label svg { width: 20px; height: 20px; stroke: var(--tmf-text-color); }
        .tmf-input { width: 100%; padding: 8px 12px; background-color: var(--tmf-secondary-color); color: var(--tmf-text-color); border: 1px solid var(--tmf-border-color); border-radius: 6px; cursor: text; box-sizing: border-box; text-align: center; }
        .tmf-input.recording { border-color: var(--tmf-primary-color); box-shadow: 0 0 5px var(--tmf-primary-color); }
        .tmf-input.error { border-color: #e34959; }
        .tmf-bottom { padding: 15px 20px; border-top: 1px solid var(--tmf-border-color); display: flex; justify-content: space-between; align-items: center; }
        .tmf-bottom .tmf-version { font-size: 0.8rem; font-weight: 400; color: #aaa; }
        .tmf-button { padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: all 0.2s ease; background-color: var(--tmf-primary-color); color: white; }
        .tmf-button:hover { background-color: var(--tmf-primary-hover); }
        /* 説明ボックスのスタイル */
        .tmf-info-box {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px dashed var(--tmf-border-color);
            font-size: 0.85rem;
            line-height: 1.5;
            color: #bbb;
        }
        .tmf-info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        .tmf-info-key {
            background: var(--tmf-secondary-color);
            padding: 2px 6px;
            border-radius: 4px;
            color: var(--tmf-primary-color);
            font-family: monospace;
            font-weight: bold;
        }
        `;
        document.head.appendChild(style);
    }

    function showToast(msg, isError = false) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = `
          position: fixed; bottom: 20px; left: 50%;
          transform: translateX(-50%);
          background: ${isError ? '#e34959' : 'var(--tmf-primary-color)'};
          color: white; padding: 10px 20px;
          border-radius: 6px;
          z-index: 100001;
          font-size: 14px;
          box-shadow: var(--tmf-shadow);
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function openSettings() {
        ensureStyle();
        if (document.querySelector('.tmf-overlay')) return;

        // メディアビューのダイアログが開いているか確認
        const activeDialog = document.querySelector('dialog.media-content-wrap[open]');

        const targetParent = activeDialog ? activeDialog : document.body;

        const overlay = document.createElement('div');
        overlay.className = 'tmf-overlay';
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

        const panel = document.createElement('div');
        panel.className = 'tmf-panel';

        panel.innerHTML = `
            <div class="tmf-title"><span>キー設定 (Shortcut Settings)</span><button class="tmf-close">&times;</button></div>
            <div class="tmf-section">
                <div class="tmf-shortcut-grid">
                    <label class="tmf-label" for="tmf-reply"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path></svg><span>コメント (Reply)</span></label><input type="text" id="tmf-reply" class="tmf-input" readonly>
                    <label class="tmf-label" for="tmf-repost"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></svg><span>リポスト (Repost)</span></label><input type="text" id="tmf-repost" class="tmf-input" readonly>
                    <label class="tmf-label" for="tmf-like"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg><span>いいね (Like)</span></label><input type="text" id="tmf-like" class="tmf-input" readonly>
                    <label class="tmf-label" for="tmf-quote"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path></svg><span>引用 (Quote)</span></label><input type="text" id="tmf-quote" class="tmf-input" readonly>
                    <label class="tmf-label" for="tmf-bookmark"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg><span>ブックマーク (Bookmark)</span></label><input type="text" id="tmf-bookmark" class="tmf-input" readonly>
                    <label class="tmf-label" for="tmf-moderation"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg><span>モデレーション (Moderation)</span></label><input type="text" id="tmf-moderation" class="tmf-input" readonly>
                </div>

                <div class="tmf-info-box">
                    <div class="tmf-info-item">
                        <span>親ポストへの操作 / Parent Post</span>
                        <span class="tmf-info-key">Ctrl + Key</span>
                    </div>
                    <div class="tmf-info-item">
                        <span>画像切り替え / Next-Prev Image</span>
                        <span class="tmf-info-key">Shift + ← / →</span>
                    </div>
                    <div class="tmf-info-item">
                        <span>本文のスクロール / Scroll Text</span>
                        <span class="tmf-info-key">↑ / ↓</span>
                    </div>
                </div>
            </div>
            <div class="tmf-bottom">
                <span class="tmf-version">(v${VERSION})</span>
                <button class="tmf-button">保存 (Save)</button>
            </div>
        `;
        overlay.appendChild(panel);
        targetParent.appendChild(overlay);

        const inputs = Object.fromEntries(
            Array.from(panel.querySelectorAll('.tmf-input')).map(input => [input.id.replace('tmf-', ''), input])
        );

        // 現在の設定値を表示
        for (const action in inputs) {
            inputs[action].value = shortcuts[action] || '';
        }

        let activeInput = null;

        const recordKey = (e, action) => {
            e.preventDefault();
            e.stopPropagation();

            // 1. 修飾キー（Ctrl, Shift, Alt）の状態を配列に集める
            const modifiers = [];
            if (e.ctrlKey) modifiers.push('Ctrl');
            if (e.shiftKey) modifiers.push('Shift');
            if (e.altKey) modifiers.push('Alt');

            // 2. 現在押されたメインのキーを特定する
            // 修飾キーそのものが押されたときは、まだ確定させない
            if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
                // 修飾キー単体での表示更新（任意ですが、入力中っぽく見せるなら）
                inputs[action].value = modifiers.join('+');
                return;
            }

            // 3. メインキーの名前を整形（左右の区別を消し、1文字なら大文字に）
            let keyName = e.code;
            keyName = keyName.replace('Key', '');    // KeyA -> A
            keyName = keyName.replace('Digit', '');  // Digit1 -> 1
            keyName = keyName.replace('Left', '');   // AltLeft -> Alt
            keyName = keyName.replace('Right', '');  // ShiftRight -> Shift

            // 特殊なキーの微調整（お好みで）
            if (keyName === 'Escape') keyName = 'Esc';
            if (keyName === 'Backspace') keyName = 'BS';

            // 4. 修飾キーとメインキーを合体させる
            // すでに modifiers に含まれているキー（Altなど）がメインキーとして来た場合は重複させない
            if (!modifiers.includes(keyName)) {
                modifiers.push(keyName);
            }

            const fullKeyString = modifiers.join('+');

            // 5. 重複チェック
            const otherInputs = Object.entries(inputs).filter(([act,]) => act !== action);
            if (otherInputs.some(([, inp]) => inp.value === fullKeyString && !inp.classList.contains('recording'))) {
                inputs[action].classList.add('error');
                showToast('既に使われています (Already in use)', true);
                return;
            }

            // 6. 確定
            inputs[action].value = fullKeyString;
            inputs[action].classList.remove('recording', 'error');
            activeInput = null;
        };

        const handleInputClick = (e) => {
            const input = e.currentTarget; // クリックされた要素を取得
            if (activeInput === input) {
                input.classList.remove('recording');
                activeInput = null;
                return;
            }
            if (activeInput) activeInput.classList.remove('recording', 'error');

            activeInput = input;
            // input.value = 'キーを押してください... (Press a key...)';
            input.classList.add('recording');
            input.classList.remove('error');
        };

        for (const action in inputs) {
            const input = inputs[action];
            input.addEventListener('click', handleInputClick); // ここで関数を使い回す
            input.addEventListener('keydown', (e) => recordKey(e, action));
        }

        panel.querySelector('.tmf-close').addEventListener('click', () => overlay.remove());
        panel.querySelector('.tmf-button').addEventListener('click', () => {
            const newShortcuts = {};
            let hasError = false;

            // 予約済み（設定不可）キーのリスト
            const reservedKeys = [
                'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                'Shift+ArrowLeft', 'Shift+ArrowRight'
            ];

            for (const action in inputs) {
                const val = inputs[action].value;

                // 1. 不完全なキー（末尾が+、または装飾キーのみ）
                const isIncomplete = !val || val.endsWith('+') || /^(Ctrl|Shift|Alt)(\+(Ctrl|Shift|Alt))*$/.test(val);

                // 2. 予約済みキーかどうか
                const isReserved = reservedKeys.includes(val);

                if (isIncomplete) {
                    showToast(`キー設定が不完全です ( Incomplete key): ${action}`, true);
                    inputs[action].classList.add('error'); // エラー箇所を赤くする
                    hasError = true;
                    break;
                }

                if (isReserved) {
                    showToast(`このキーは予約済みで設定できません (Reserved key): ${val}`, true);
                    inputs[action].classList.add('error');
                    hasError = true;
                    break;
                }

                newShortcuts[action] = val;
            }

            if (!hasError) {
                shortcuts = newShortcuts;
                GM_setValue(STORE_KEY, shortcuts);
                showToast('設定を保存しました (Settings saved)');
                overlay.remove();
            }
        });
    }

    // 拡大表示用のモーダル
    function showFullSizeImage(url) {
        const overlay = document.createElement('div');
        overlay.className = 'neon-image-modal';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            cursor: zoom-out;
        `;
        const fullImg = document.createElement('img');
        fullImg.src = url;
        fullImg.style.cssText = 'max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 4px;';
        overlay.onclick = () => overlay.remove();
        overlay.appendChild(fullImg);
        document.body.appendChild(overlay);
    }

    // 画像やGIF、動画を網羅的に探す関数
    function findMedia(obj) {
        if (!obj) return null;

        // 画像
        if (obj.images && Array.isArray(obj.images)) {
            return { type: 'images', data: obj.images };
        }

        // 動画
        if (obj.$type === 'app.bsky.embed.video#view' || obj.video) {
            const videoData = obj.video || obj;
            return {
                type: 'video',
                data: [{ thumb: videoData.thumbnail, video: videoData.playlist }]
            };
        }

        // GIFステッカーと外部リンク
        const external = obj.external || (obj.media && obj.media.external);
        if (external) {
            // Tenor (GIF)
            if (external.uri?.includes('tenor.com')) {
                return {
                    type: 'gif',
                    data: [{ thumb: external.thumb, video: external.uri.replace('.gif', '.mp4') }]
                };
            }
            return { type: 'external', data: [external] }; // 一般的なリンクカード
        }

        // 再帰探索
        if (obj.media) return findMedia(obj.media);
        if (obj.record) {
            if (obj.record.embed) return findMedia(obj.record.embed);
            if (obj.record.value && obj.record.value.embed) return findMedia(obj.record.value.embed);
        }
        return null;
    }

    async function fetchAndInjectImage(item) {
        if (item.querySelector('.neon-fixed') || item.dataset.imageFixed) return;

        // Tokimekiが自前でメディアを表示しているならスキップ
        if (item.querySelector('.timeline-images') || item.querySelector('.gif-video-wrap')) return;

        item.dataset.imageFixed = "true";
        item.classList.add('neon-fixed');

        const contentArea = item.querySelector('.notification-column__content');
        if (!contentArea) return;

        const postLink = contentArea.querySelector('a[href*="/post/"]');
        if (!postLink) return;

        const match = postLink.getAttribute('href').match(/\/profile\/([^/]+)\/post\/([^/]+)/);
        if (!match) return;

        const [_, handle, postId] = match;

        try {
            const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${handle}/app.bsky.feed.post/${postId}&depth=0`;
            const res = await fetch(apiUrl);
            if (!res.ok) return;

            const data = await res.json();
            const post = data.thread?.post;
            if (!post || !post.embed) return;
            // console.log('[Debug] post.embed full structure:', JSON.stringify(post.embed, null, 2));

            // ALTテキスト
            const altText = post.embed?.external?.title ||
                            post.embed?.media?.external?.title ||
                            post.embed?.video?.alt ||
                            post.embed?.alt || "";

            // 探索開始
            const result = findMedia(post.embed);
            if (!result || !result.data || result.data.length === 0) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'notifications-item-images svelte-68xwnf';
            wrapper.style.marginTop = '10px';

            // --- 分岐処理 ---

            if (result.type === 'images') {
                // 通常の画像レイアウト
                const container = document.createElement('div');
                container.className = 'timeline-images timeline-images--nocrop';

                result.data.forEach(img => {
                    const imgBox = document.createElement('div');
                    imgBox.className = 'timeline-image svelte-1mo90jh';

                    const btn = document.createElement('button');
                    btn.className = 'svelte-1mo90jh';
                    btn.setAttribute('aria-label', img.alt || 'Open image.');
                    btn.style.cursor = 'zoom-in';
                    btn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showFullSizeImage(img.fullsize || img.thumb);
                    };

                    const imgEl = document.createElement('img');
                    imgEl.src = img.thumb;
                    imgEl.alt = img.alt || "";
                    imgEl.className = 'svelte-1mo90jh';
                    imgEl.style.cssText = 'width: 100%; height: auto; max-height: 300px; object-fit: contain; border-radius: 8px;';

                    btn.appendChild(imgEl);
                    imgBox.appendChild(btn);
                    container.appendChild(imgBox);
                });
                wrapper.appendChild(container);
            } else if (result.type === 'external') {
                //  外部リンクカード
                const ext = result.data[0];

                // URLの処理：bsky.app なら tokimeki.blue に変換し、ターゲットを切り替え
                const isBsky = ext.uri.includes('bsky.app');
                const targetUrl = isBsky ? ext.uri.replace('bsky.app', 'tokimeki.blue') : ext.uri;
                const targetAttr = isBsky ? '_self' : '_blank';

                const container = document.createElement('div');
                container.style.cssText = 'display: flex; flex-direction: column; border: 1px solid var(--border-color-1); border-radius: 8px; overflow: hidden; background: var(--bg-color-2); width: 100%; box-sizing: border-box;';

                // 1. サムネイル部分
                if (ext.thumb) {
                    const thumbDiv = document.createElement('div');
                    thumbDiv.style.cssText = 'width: 100%; aspect-ratio: 16 / 9; overflow: hidden; background: #000; cursor: pointer;';
                    // クリックでURLを開く
                    thumbDiv.onclick = () => window.open(targetUrl, targetAttr);

                    const img = document.createElement('img');
                    img.src = ext.thumb;
                    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;';
                    thumbDiv.appendChild(img);
                    container.appendChild(thumbDiv);
                }

                // 2. テキスト部分
                const textDiv = document.createElement('div');
                textDiv.style.cssText = 'padding: 10px; font-size: 13px; border-top: 1px solid var(--border-color-1);';

                // タイトルリンクの作成
                const titleWrapper = document.createElement('div');
                titleWrapper.style.cssText = 'font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';

                const titleLink = document.createElement('a');
                titleLink.href = targetUrl;
                titleLink.target = targetAttr;
                titleLink.textContent = ext.title || 'Link';
                titleLink.style.cssText = 'text-decoration: none; color: var(--text-color-1); transition: text-decoration 0.2s;';

                // 本家風：マウスが乗ったらアンダーライン
                titleLink.onmouseover = () => {
                    titleLink.style.textDecoration = 'underline';
                }
                titleLink.onmouseout = () => {
                    titleLink.style.textDecoration = 'none';
                }

                titleWrapper.appendChild(titleLink);
                textDiv.appendChild(titleWrapper);

                // 説明文
                if (ext.description) {
                    const descDiv = document.createElement('div');
                    descDiv.style.cssText = 'color: var(--text-color-3); font-size: 12px; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;';
                    descDiv.textContent = ext.description;
                    textDiv.appendChild(descDiv);
                }

                container.appendChild(textDiv);
                wrapper.appendChild(container);
            } else {
                wrapper.className = 'notifications-item-images svelte-68xwnf timeline-external--normal svelte-1mlxd9t timeline-external--tenor';

                const mediaData = result.data[0] || {};
                const rawUrl = mediaData.url || mediaData.video || "";

                // 動画(m3u8)かどうかの判定
                const isVideo = rawUrl.includes('playlist.m3u8');

                // URL置換（GIFの場合のみ）
                let videoUrl = rawUrl;
                if (!isVideo) {
                    videoUrl = rawUrl.replace(/AAA[A-Z0-9]{2}/, 'AAAP1').replace('.gif', '.mp4');
                }

                wrapper.innerHTML = `
                    <div class="timeline-external__image">
                        <div class="timeline-tenor-external">
                            <div class="gif-video-wrap svelte-or3n9u">
                                ${!isVideo ? `
                                    <div class="gif-pause-icon svelte-or3n9u" style="display: none;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24" class="svelte-or3n9u">
                                            <path id="多角形_1" data-name="多角形 1" d="M10.264,3.039a2,2,0,0,1,3.473,0L22.29,18.008A2,2,0,0,1,20.554,21H3.446A2,2,0,0,1,1.71,18.008Z" transform="translate(21) rotate(90)" fill="#fff"></path>
                                        </svg>
                                    </div>
                                ` : ''}
                                <video class="gif-video svelte-or3n9u"
                                       playsinline
                                       ${isVideo ? 'controls' : 'loop autoplay muted'}
                                       src="${videoUrl}"
                                       style="width: 100%; border-radius: 8px; display: block; cursor: pointer;"></video>
                                ${!isVideo ? '<button class="gif-toggle svelte-or3n9u"></button>' : ''}
                            </div>
                        </div>
                    </div>
                    ${altText ? `
                    <div class="timeline-external__content svelte-1mlxd9t">
                        <p class="timeline-external__title">
                            <a target="_blank" rel="noopener nofollow noreferrer" class="svelte-1mlxd9t" href="${rawUrl}">${altText}</a>
                        </p>
                        <p class="timeline-external__description">ALT: ${altText}</p>
                    </div>
                    ` : ''}
                `;

                // 動画でない（GIFの）時だけ、クリック制御を有効にする
                if (!isVideo) {
                    const videoEl = wrapper.querySelector('video');
                    const toggleBtn = wrapper.querySelector('.gif-toggle');
                    const pauseIcon = wrapper.querySelector('.gif-pause-icon');

                    const togglePlay = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (videoEl.paused) {
                            videoEl.play();
                            pauseIcon.style.display = 'none';
                        } else {
                            videoEl.pause();
                            pauseIcon.style.display = '';
                        }
                    };
                    videoEl.onclick = togglePlay;
                    if (toggleBtn) toggleBtn.onclick = togglePlay;
                }
            }

            // 挿入
            const textContent = item.querySelector('.notifications-item__content');
            if (textContent) {
                textContent.after(wrapper);
            } else {
                item.querySelector('.notification-column__content')?.appendChild(wrapper);
            }

        } catch (e) {
            console.error("Notif Media Fix Error:", e);
        }
    }

    // 監視設定
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;

                // リポスト通知のarticleのみを抽出
                const targetItems = node.matches('article.notifications-item')
                    ? [node]
                    : node.querySelectorAll('article.notifications-item');

                targetItems.forEach(item => fetchAndInjectImage(item));
            });
        }
    });

    // 実行開始（既存の処理の最後に追加）
    observer.observe(document.body, { childList: true, subtree: true });

    GM_registerMenuCommand('キー設定 (Shortcut Settings)', openSettings);

})();
