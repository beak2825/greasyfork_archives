// ==UserScript==
// @name         Tokyofm ポッドキャスト ダウンロードボタン
// @namespace    https://greasyfork.org/ja/users/1328592-naoqv/
// @version      1.1
// @license      MIT
// @description  audioタグのsrc属性を保存するボタンを追加
// @match        https://www.tfm.co.jp/podcast/*
// @icon         https://www.tfm.co.jp//img/favicon.ico
// @grant        GM_setClipboard
// @compatible   Chrome
// @compatible   Firefox
// @downloadURL https://update.greasyfork.org/scripts/553265/Tokyofm%20%E3%83%9D%E3%83%83%E3%83%89%E3%82%AD%E3%83%A3%E3%82%B9%E3%83%88%20%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/553265/Tokyofm%20%E3%83%9D%E3%83%83%E3%83%89%E3%82%AD%E3%83%A3%E3%82%B9%E3%83%88%20%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // BrowserAPIでダウンロード (GM_download が Firefoxでうまく動作しなかったので)
    const downloadFile = async (url, filename) => {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const blob = await response.blob();

            // BlobURLを作成
            const blobUrl = URL.createObjectURL(blob);

            // a要素を作成してクリック
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // クリーンアップ
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            return true;
        } catch (error) {
            console.error('ダウンロードエラー:', error);
            throw error;
        }
    };

    // audioタグを検出して処理
    const processAudioTags = () => {
        const audioTags = document.querySelectorAll('audio[src]');

        audioTags.forEach((audio, index) => {
            // 既に処理済みの場合はスキップ
            if (audio.dataset.urlSaverProcessed) {
                return;
            }
            audio.dataset.urlSaverProcessed = 'true';

            const src = audio.getAttribute('src');
            if (!src) {return;}

            // 親要素を取得（.p-episode_audioがあればそれ、なければaudioタグの親）
            const container = audio.closest('.p-episode_audio') || audio.parentElement;

            // ボタンコンテナを作成
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                width: 430px;
                gap: 8px;
                margin-top: 8px;
                flex-wrap: wrap;
            `;

            // URLをコピーするボタン
            const copyButton = document.createElement('button');
            copyButton.textContent = '📋 URLをコピー';
            copyButton.style.cssText = `
                padding: 8px 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;
            copyButton.addEventListener('click', function() {
                GM_setClipboard(src);
                const originalText = copyButton.textContent;
                copyButton.textContent = '✓ コピーしました!';
                copyButton.style.backgroundColor = '#45a049';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.backgroundColor = '#4CAF50';
                }, 2000);
            });
            copyButton.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#45a049';
            });
            copyButton.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#4CAF50';
            });

            // ダウンロードボタン
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '⬇️ ダウンロード';
            downloadButton.style.cssText = `
                padding: 8px 12px;
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;
            downloadButton.addEventListener('click', function() {
              // URLからファイル名を抽出
              const urlParts = src.split('/');
              const filename = urlParts[urlParts.length - 1].split('.')[0] + '.mp3' || 'audio.mp3';
              downloadButton.textContent = '⬇️ ダウンロード中...';
              downloadButton.disabled = true;

              downloadFile(src, filename).then(() => {
                downloadButton.textContent = "ダウンロード";
                downloadButton.disabled = false
              });
            });
            downloadButton.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#0b7dda';
            });
            downloadButton.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#2196F3';
            });

            // URLを表示するボタン
            const showButton = document.createElement('button');
            showButton.textContent = '🔗 URLを表示';
            showButton.style.cssText = `
                padding: 8px 12px;
                background-color: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
            `;
            showButton.addEventListener('click', function() {
                // URLを表示するテキストボックスを作成
                const textBox = document.createElement('textarea');
                textBox.value = src;
                textBox.style.cssText = `
                    width: 100%;
                    max-width: 600px;
                    height: 60px;
                    margin-top: 8px;
                    padding: 8px;
                    font-family: monospace;
                    font-size: 12px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                `;
                textBox.readOnly = true;

                if (buttonContainer.querySelector('textarea')) {
                    buttonContainer.querySelector('textarea').remove();
                } else {
                    buttonContainer.appendChild(textBox);
                }
            });
            showButton.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#e68900';
            });
            showButton.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#FF9800';
            });

            buttonContainer.appendChild(copyButton);
            buttonContainer.appendChild(downloadButton);
            buttonContainer.appendChild(showButton);

            // コンテナに挿入
            container.appendChild(buttonContainer);
        });
    };

    // 初期実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAudioTags);
    } else {
        processAudioTags();
    }

    // 動的に追加されるaudioタグにも対応
    const observer = new MutationObserver(processAudioTags);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
