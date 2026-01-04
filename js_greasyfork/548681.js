// ==UserScript==
// @name         yt-dlp Video Command
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add yt-dlp copy command option to download videos
// @author       tris
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/548681/yt-dlp%20Video%20Command.user.js
// @updateURL https://update.greasyfork.org/scripts/548681/yt-dlp%20Video%20Command.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_registerMenuCommand("🔥 Copy yt-dlp Command", showDownloadPopup);

    function showDownloadPopup() {
        const existingPopup = document.getElementById('ytdlp-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.id = 'ytdlp-popup';
        popup.innerHTML = `
            <div class="ytdlp-overlay">
                <div class="ytdlp-modal">
                    <div class="ytdlp-header">
                        <div class="ytdlp-header-content">
                            <h3>Copy command</h3>
                            <p>Generate yt-dlp download commands</p>
                        </div>
                        <button class="ytdlp-close">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="ytdlp-content">
                        <div class="ytdlp-field">
                            <label for="video-url">Video URL</label>
                            <input type="text" id="video-url" placeholder="Paste your video URL here..." value="">
                            <div class="ytdlp-hint">Supports YouTube, Twitch, TikTok, and 1000+ sites</div>
                        </div>

                        <div class="ytdlp-field-row">
                            <div class="ytdlp-field">
                                <label for="quality-select">Quality</label>
                                <select id="quality-select">
                                    <option value="best">Best Quality</option>
                                    <option value="worst">Worst Quality</option>
                                    <option value="best[height<=720]">720p or lower</option>
                                    <option value="best[height<=480]">480p or lower</option>
                                    <option value="best[height<=360]">360p or lower</option>
                                    <option value="bestvideo+bestaudio">Best Video + Best Audio</option>
                                    <option value="bestaudio">Audio Only</option>
                                </select>
                            </div>

                            <div class="ytdlp-field">
                                <label for="output-format">Format</label>
                                <select id="output-format">
                                    <option value="mp4">MP4</option>
                                    <option value="mkv">MKV</option>
                                    <option value="webm">WebM</option>
                                    <option value="avi">AVI</option>
                                    <option value="mp3">MP3 (Audio)</option>
                                    <option value="m4a">M4A (Audio)</option>
                                </select>
                            </div>
                        </div>

                        <div class="ytdlp-field">
                            <label for="output-path">Output Directory <span class="ytdlp-optional">(optional)</span></label>
                            <input type="text" id="output-path" placeholder="e.g., ~/Downloads/Videos">
                        </div>

                        <button class="ytdlp-generate-btn" id="copy-command">
                            Generate Command
                        </button>

                        <div class="ytdlp-output" id="command-output" style="display: none;">
                            <div class="ytdlp-output-header">
                                <span>Generated Command</span>
                                <button class="ytdlp-copy-btn" id="copy-again-btn">Copy</button>
                            </div>
                            <div class="ytdlp-code-block">
                                <code id="command-text"></code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .ytdlp-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
                animation: ytdlp-fadeIn 0.15s ease-out;
            }

            @keyframes ytdlp-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes ytdlp-slideIn {
                from {
                    opacity: 0;
                    transform: scale(0.96) translateY(8px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .ytdlp-modal {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 12px;
                width: 90%;
                max-width: 480px;
                max-height: 90vh;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                animation: ytdlp-slideIn 0.2s ease-out;
                color: #e5e5e5;
            }

            .ytdlp-header {
                padding: 20px 20px 16px 20px;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }

            .ytdlp-header-content h3 {
                margin: 0 0 4px 0;
                font-size: 18px;
                font-weight: 600;
                color: #f5f5f5;
                line-height: 1.2;
            }

            .ytdlp-header-content p {
                margin: 0;
                font-size: 14px;
                color: #a3a3a3;
                font-weight: 400;
            }

            .ytdlp-close {
                background: none;
                border: none;
                color: #a3a3a3;
                cursor: pointer;
                padding: 4px;
                border-radius: 6px;
                transition: all 0.15s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ytdlp-close:hover {
                background: #2a2a2a;
                color: #e5e5e5;
            }

            .ytdlp-content {
                padding: 20px;
            }

            .ytdlp-field {
                margin-bottom: 20px;
            }

            .ytdlp-field-row {
                display: flex;
                gap: 16px;
                margin-bottom: 20px;
            }

            .ytdlp-field-row .ytdlp-field {
                flex: 1;
                margin-bottom: 0;
            }

            .ytdlp-field label {
                display: block;
                margin-bottom: 6px;
                font-size: 14px;
                font-weight: 500;
                color: #e5e5e5;
            }

            .ytdlp-optional {
                color: #737373;
                font-weight: 400;
                font-size: 14px;
            }

            .ytdlp-field input,
            .ytdlp-field select {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #404040;
                border-radius: 8px;
                background: #262626;
                color: #e5e5e5;
                font-size: 14px;
                font-family: inherit;
                box-sizing: border-box;
                transition: border-color 0.15s ease;
            }

            .ytdlp-field input:focus,
            .ytdlp-field select:focus {
                outline: none;
                border-color: #d97706;
            }

            .ytdlp-field input::placeholder {
                color: #737373;
            }

            .ytdlp-hint {
                font-size: 13px;
                color: #737373;
                margin-top: 6px;
            }

            .ytdlp-generate-btn {
                width: 100%;
                padding: 12px;
                background: #d97706;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s ease;
                font-family: inherit;
                margin-bottom: 20px;
            }

            .ytdlp-generate-btn:hover {
                background: #b45309;
            }

            .ytdlp-generate-btn:active {
                transform: translateY(1px);
            }

            .ytdlp-output {
                animation: ytdlp-slideDown 0.2s ease-out;
            }

            @keyframes ytdlp-slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-8px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .ytdlp-output-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }

            .ytdlp-output-header span {
                font-size: 14px;
                font-weight: 500;
                color: #e5e5e5;
            }

            .ytdlp-copy-btn {
                background: #404040;
                color: #e5e5e5;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.15s ease;
                font-family: inherit;
            }

            .ytdlp-copy-btn:hover {
                background: #525252;
            }

            .ytdlp-code-block {
                background: #0f0f0f;
                border: 1px solid #333;
                border-radius: 8px;
                padding: 12px;
            }

            .ytdlp-code-block code {
                display: block;
                color: #22c55e;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.4;
                word-break: break-all;
                white-space: pre-wrap;
                cursor: pointer;
            }

            .ytdlp-code-block:hover {
                background: #171717;
            }

            .ytdlp-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #0f0f0f;
                border: 1px solid #333;
                color: #e5e5e5;
                padding: 10px 16px;
                border-radius: 8px;
                font-family: inherit;
                font-size: 14px;
                z-index: 10002;
                animation: ytdlp-notificationSlide 0.2s ease-out;
            }

            .ytdlp-notification.error {
                background: #450a0a;
                border-color: #dc2626;
                color: #fecaca;
            }

            @keyframes ytdlp-notificationSlide {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            @media (max-width: 640px) {
                .ytdlp-modal {
                    width: 95%;
                    margin: 16px;
                }

                .ytdlp-field-row {
                    flex-direction: column;
                    gap: 20px;
                }

                .ytdlp-field-row .ytdlp-field {
                    margin-bottom: 0;
                }
            }
        `;

        popup.appendChild(style);
        document.body.appendChild(popup);

        const closeBtn = popup.querySelector('.ytdlp-close');
        const overlay = popup.querySelector('.ytdlp-overlay');
        const copyBtn = popup.querySelector('#copy-command');
        const copyAgainBtn = popup.querySelector('#copy-again-btn');

        closeBtn.addEventListener('click', () => popup.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) popup.remove();
        });

        copyBtn.addEventListener('click', generateAndCopyCommand);
        copyAgainBtn.addEventListener('click', () => {
            const commandText = document.getElementById('command-text').textContent;
            if (commandText) {
                copyToClipboard(commandText);
                showNotification('Command copied to clipboard!');
            }
        });

        const commandCode = popup.querySelector('#command-text');
        commandCode.addEventListener('click', () => {
            if (commandCode.textContent) {
                copyToClipboard(commandCode.textContent);
                showNotification('Command copied to clipboard!');
            }
        });

        const urlInput = popup.querySelector('#video-url');
        urlInput.focus();
    }

    function generateAndCopyCommand() {
        const url = document.getElementById('video-url').value.trim();
        const quality = document.getElementById('quality-select').value;
        const format = document.getElementById('output-format').value;
        const outputPath = document.getElementById('output-path').value.trim();

        if (!url) {
            showNotification('Please enter a video URL', 'error');
            return;
        }

        let command = 'yt-dlp';

        if (quality !== 'best') {
            command += ` -f "${quality}"`;
        }

        if (['mp3', 'm4a'].includes(format)) {
            command += ` --extract-audio --audio-format ${format}`;
        } else if (format !== 'mp4') {
            command += ` --merge-output-format ${format}`;
        }

        if (outputPath) {
            command += ` -o "${outputPath}/%(title)s.%(ext)s"`;
        }

        command += ` "${url}"`;

        const commandOutput = document.getElementById('command-output');
        const commandText = document.getElementById('command-text');
        commandText.textContent = command;
        commandOutput.style.display = 'block';

        copyToClipboard(command);
        showNotification('yt-dlp command copied to clipboard!');
    }

    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text);
            return;
        }

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.ytdlp-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `ytdlp-notification ${type === 'error' ? 'error' : ''}`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-10px)';
            notification.style.transition = 'all 0.2s ease-out';
            setTimeout(() => notification.remove(), 200);
        }, 3000);
    }
})();