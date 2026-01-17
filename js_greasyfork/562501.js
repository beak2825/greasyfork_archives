// ==UserScript==
// @name         YouTube Screenshot Shortcut
// @name:ja      YouTube スクリーンショット・ショートカット
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A function that only takes screenshots. Press the **[S]** key on the paused screen.
// @description:ja スクリーンショットを撮るだけの機能。停止画面でキーボードの[S]を押します。
// @author       81standard
// @match        https://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/562501/YouTube%20Screenshot%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/562501/YouTube%20Screenshot%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEY_STORAGE = 'YouTubeScreenshotKey';
    const DEFAULT_KEY = 's';
    let triggerKey = DEFAULT_KEY;

    /**
     * 再生時間（秒）を hh-mm-ss 形式の文字列にフォーマットする
     * @param {number} seconds - 秒数
     * @returns {string} フォーマットされた時間文字列
     */
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '00-00-00';
        const date = new Date(0);
        date.setSeconds(seconds);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const secs = date.getUTCSeconds().toString().padStart(2, '0');
        return `${hours}-${minutes}-${secs}`;
    };

    /**
     * スクリーンショットを撮影してダウンロードする
     */
    const takeScreenshot = () => {
        const video = document.querySelector('.html5-main-video');

        // 動画が一時停止中でも撮影できるように条件を変更しました
        if (!video || video.ended || video.readyState < 2) {
            GM_notification({
                title: 'スクリーンショット失敗',
                text: '動画の準備ができていません。',
                timeout: 3000
            });
            console.log('Screenshot failed: Video element not found or not ready.');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const videoTitle = document.title.replace(' - YouTube', '').replace(/[\\/:*?"<>|]/g, '_');
        const currentTime = formatTime(video.currentTime);
        const filename = `${videoTitle} - [${currentTime}].png`;

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        link.click();

        GM_notification({
            title: 'スクリーンショット',
            text: `保存しました: ${filename}`,
            timeout: 3000,
            image: canvas.toDataURL('image/jpeg', 0.5) // 通知用の軽量なプレビュー
        });
    };

    /**
     * ショートカットキーを設定するメニューを作成する
     */
    const setupMenu = () => {
        GM_registerMenuCommand(`スクリーンショットのキーを変更 (現在: '${triggerKey}')`, () => {
            const newKey = prompt('スクリーンショットを撮影するための新しいキーを入力してください (例: p)', triggerKey);
            if (newKey && newKey.trim().length > 0) {
                triggerKey = newKey.trim()[0]; // 最初の1文字のみを使用
                GM_setValue(CONFIG_KEY_STORAGE, triggerKey);
                alert(`ショートカットキーを '${triggerKey}' に変更しました。`);
                // ページをリロードしなくてもイベントリスナーが新しいキーで動作するように再設定
                setupKeyListener();
            }
        });
    };

    /**
     * キーボードイベントリスナーを設定する
     */
    let keydownListener = null;
    const setupKeyListener = () => {
        // 既存のリスナーがあれば削除
        if (keydownListener) {
            document.removeEventListener('keydown', keydownListener);
        }

        keydownListener = (e) => {
            // 入力フィールドやテキストエリアにフォーカスがある場合は動作しない
            const activeElement = document.activeElement;
            const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

            if (e.key === triggerKey && !isTyping) {
                e.preventDefault();
                e.stopPropagation();
                takeScreenshot();
            }
        };

        document.addEventListener('keydown', keydownListener);
    };

    /**
     * スクリプトの初期化
     */
    const init = async () => {
        // 保存されたキー設定を読み込む（なければデフォルト値を使用）
        triggerKey = await GM_getValue(CONFIG_KEY_STORAGE, DEFAULT_KEY);
        setupKeyListener();
        setupMenu();
    };

    init();
})();