// ==UserScript==
// @name         AI Studio 背景カスタマイザー
// @name:en      [Menu Config] Background Customizer
// @namespace    http://tampermonkey.net/
// @version      2.5.1
// @description  Tampermonkeyのメニューから、背景画像・透明度・ぼかしを設定できます。
// @description:en Change the background image, opacity, and blur from the Tampermonkey menu.
// @author       krg
// @match        https://aistudio.google.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555992/AI%20Studio%20%E8%83%8C%E6%99%AF%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%B6%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/555992/AI%20Studio%20%E8%83%8C%E6%99%AF%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%B6%E3%83%BC.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    if (window.self !== window.top) {
        return;
    }

    if (window._backgroundCustomizerInitialized) {
        return; // 既に実行済みの場合はここで処理を終了
    }
    // 実行フラグを立てる
    window._backgroundCustomizerInitialized = true;
    // -------------------------

    // --- 設定キーとデフォルト値 (編集不要) ---
    const CONFIG_KEYS = {
        IMAGE_DATA: 'bg_image_data',
        OPACITY: 'bg_opacity',
        BLUR: 'bg_blur'
    };
    const DEFAULTS = {
        OPACITY: 0.3,
        BLUR: 8,
        IMAGE_DATA: null // デフォルト画像なし
    };

    /**
     * 保存された設定を読み込み、背景に適用します
     */
    async function applyBackground() {
        // 設定値を非同期で取得
        const imageData = await GM_getValue(CONFIG_KEYS.IMAGE_DATA, DEFAULTS.IMAGE_DATA);
        const opacity = await GM_getValue(CONFIG_KEYS.OPACITY, DEFAULTS.OPACITY);
        const blur = await GM_getValue(CONFIG_KEYS.BLUR, DEFAULTS.BLUR);

        // ページ本体の背景を透明にし、各UIパーツにすりガラス効果を適用するCSS
        GM_addStyle(`
            /* 1. 基本レイアウト要素の背景を完全に透明にする */
            body, .banner-and-app-container, ms-app,
            ms-chunk-editor > section.chunk-editor-main,
            .chat-view-container, ms-chat-session,
            .makersuite-layout, .layout-wrapper, .layout-main {
                background: transparent !important;
                background-color: transparent !important;
                backdrop-filter: none !important;
            }

            /* 2. 左ナビゲーションと右の設定パネルにすりガラス効果を適用 */
            .nav-content, ms-right-side-panel > div, ms-run-settings, ms-sliding-right-panel .content {
                background-color: rgba(30, 30, 30, 0.5) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }

            /* 3. 上部のツールバー */
            ms-toolbar > .toolbar-container {
                background: rgba(20, 20, 20, 0.4) !important;
                backdrop-filter: blur(8px) !important;
                -webkit-backdrop-filter: blur(8px) !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
            }

            /* 4. 下部のプロンプト入力欄 */
            .prompt-input-wrapper {
                background: rgba(30, 30, 30, 0.6) !important;
                border-color: rgba(255, 255, 255, 0.2) !important;
            }

            /* 5. チャット内の各要素（コードブロック、思考プロセスなど） */
            ms-chat-turn > .chat-turn-container,
            ms-code-block > .container,
            .mat-expansion-panel,
            .mat-expansion-panel-header,
            ms-thought-chunk .mat-expansion-panel-body {
                background-color: rgba(40, 40, 40, 0.3) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
            }

            /* 6. ホバー/フォーカス時のスタイルを強調 */
            ms-chat-turn > .chat-turn-container:hover,
            ms-chat-turn > .chat-turn-container.cdk-keyboard-focused {
                background-color: rgba(50, 50, 50, 0.5) !important;
                border-color: rgba(255, 255, 255, 0.2) !important;
            }

            /* 7. ポップアップメニューやダイアログ */
            .mat-mdc-menu-panel, .mat-mdc-dialog-container .mdc-dialog__surface {
                background-color: rgba(45, 45, 45, 0.8) !important;
                backdrop-filter: blur(15px) !important;
                -webkit-backdrop-filter: blur(15px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }

            /* --- Run settingsパネル内の詳細な修正 --- */

            /* 8. Run settings内の各種コンポーネントの背景を半透明に */
            ms-run-settings .model-selector-card,
            ms-run-settings .system-instructions-card,
            ms-run-settings .mat-mdc-text-field-wrapper,
            ms-run-settings .mdc-slider__track--inactive,
            ms-run-settings .mdc-switch:not(.mdc-switch--selected) .mdc-switch__track::before,
            ms-run-settings .mat-mdc-chip-set .mdc-evolution-chip,
            ms-sliding-right-panel .panel-header
            {
                background-color: rgba(255, 255, 255, 0.08) !important;
            }

            /* 9. Run settings 内のトグルスイッチON時の色調整 */
            ms-run-settings .mdc-switch--selected .mdc-switch__track::after {
                 background-color: rgba(135, 169, 255, 0.6) !important;
            }

            /* 10. Run settings 内の区切り線 */
            ms-run-settings mat-divider {
                border-top-color: rgba(255, 255, 255, 0.15) !important;
            }

            /* 11. 「思考プロセス」内の"Auto"チップなど */
            ms-thought-chunk .label-chip {
                 background-color: rgba(255, 255, 255, 0.1) !important;
                 border-color: rgba(255, 255, 255, 0.2) !important;
            }
        `);

        // 背景レイヤーが存在しなければ作成
        let bgLayer = document.getElementById('custom-background-layer');
        if (!bgLayer) {
            bgLayer = document.createElement('div');
            bgLayer.id = 'custom-background-layer';
            document.body.appendChild(bgLayer);
        }

        // 背景レイヤーにスタイルを適用
        Object.assign(bgLayer.style, {
            position: 'fixed', top: '0', left: '0',
            width: '100vw', height: '100vh',
            zIndex: '-9999',
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            transition: 'opacity 0.5s, filter 0.5s',
            backgroundImage: imageData ? `url(${imageData})` : 'none',
            opacity: String(opacity),
            filter: `blur(${blur}px)`
        });
    }

    /**
     * ファイル選択ダイアログを開き、選択された画像をDataURLとして保存します
     */
    function selectAndSaveImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = readerEvent => {
                const imageData = readerEvent.target.result;
                GM_setValue(CONFIG_KEYS.IMAGE_DATA, imageData)
                    .then(() => {
                        alert('背景画像が設定されました。ページを更新します。');
                        location.reload();
                    });
            };
            reader.readAsDataURL(file);
            document.body.removeChild(input);
        };

        document.body.appendChild(input);
        input.click();
    }

    /**
     * 数値設定をpromptで入力させ、保存します
     * @param {string} key - 保存する設定のキー
     * @param {string} promptMessage - ユーザーに表示するメッセージ
     * @param {number} defaultValue - デフォルト値
     * @param {function} validationFn - 入力値を検証する関数
     */
    async function promptAndSaveSetting(key, promptMessage, defaultValue, validationFn) {
        const currentValue = await GM_getValue(key, defaultValue);
        const newValueStr = prompt(promptMessage, currentValue);

        if (newValueStr === null) return; // キャンセルされた場合

        const newValue = parseFloat(newValueStr);
        if (validationFn(newValue)) {
            await GM_setValue(key, newValue);
            alert('設定を保存しました。ページを更新します。');
            location.reload();
        } else {
            alert('無効な値です。入力し直してください。');
        }
    }

    /**
     * すべての設定をリセットします
     */
    function resetSettings() {
        if (confirm('すべての背景設定をリセットしますか？')) {
            Promise.all([
                GM_deleteValue(CONFIG_KEYS.IMAGE_DATA),
                GM_deleteValue(CONFIG_KEYS.OPACITY),
                GM_deleteValue(CONFIG_KEYS.BLUR)
            ]).then(() => {
                alert('設定をリセットしました。ページを更新します。');
                location.reload();
            });
        }
    }

    // --- メイン処理 ---

    // 1. Tampermonkeyメニューにコマンドを登録
    GM_registerMenuCommand('🖼️ 背景画像を選択...', selectAndSaveImage);
    GM_registerMenuCommand('💧 透明度を設定...', () =>
        promptAndSaveSetting(
            CONFIG_KEYS.OPACITY,
            '透明度を入力してください (0.0 ～ 1.0)',
            DEFAULTS.OPACITY,
            (v) => !isNaN(v) && v >= 0.0 && v <= 1.0
        )
    );
    GM_registerMenuCommand('🌫️ ぼかし強度を設定...', () =>
        promptAndSaveSetting(
            CONFIG_KEYS.BLUR,
            'ぼかしの強度(px)を数値で入力してください (0以上)',
            DEFAULTS.BLUR,
            (v) => !isNaN(v) && v >= 0
        )
    );
    GM_registerMenuCommand('🗑️ 設定をリセット', resetSettings);

    // 2. ページ読み込み時に背景を適用
    applyBackground();

})();