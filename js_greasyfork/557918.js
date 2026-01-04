// ==UserScript==
// @name         Telegram Private Downloader 1.0
// @namespace    slon
// @license      MIT
// @version      1.0
// @description  Download.
// @author       slon (modified)
// @match        https://web.telegram.org/*
// @match        https://webk.telegram.org/*
// @match        https://webz.telegram.org/*
// @match        https://web.telegram.org/a/*
// @icon         https://img.icons8.com/ios_filled/1200/elephant.jpg
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557918/Telegram%20Private%20Downloader%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/557918/Telegram%20Private%20Downloader%2010.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 1. ПРОВЕРКА ВЕРСИИ TELEGRAM ===
    // Скрипт работает корректно только на версии WebK (https://webk.telegram.org или https://web.telegram.org/k/)
    const isWebK = window.location.href.includes('webk.telegram.org') || window.location.pathname.includes('/k/');

    if (!isWebK) {
        // Если это версия A, Z или другая, выдаем предупреждение
        alert("Перейди на страницу https://webk.telegram.org Скрипт работает только там\nGo to the page https://webk.telegram.org The script only works there");
        return; // Останавливаем выполнение скрипта
    }

    GM_addStyle(`
        #tg-saver-panel {
            position: absolute;
            top: 10px;
            right: 20px;
            z-index: 99999;
            background: rgba(33, 33, 33, 0.95);
            padding: 8px;
            border-radius: 12px;
            display: flex;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.1);
            transition: opacity 0.3s;
            align-items: center;
            flex-wrap: wrap;
        }
        #tg-saver-panel:hover {
            opacity: 1;
        }
        .saver-btn {
            background: #3390ec;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: transform 0.1s, background 0.2s;
            white-space: nowrap;
        }
        .saver-btn:hover {
            background: #409ced;
            transform: scale(1.05);
        }
        .saver-btn:active {
            transform: scale(0.95);
        }
        .saver-btn.full-mode {
            background: #4caf50;
        }
        .saver-btn.full-mode:hover {
            background: #66bb6a;
        }
        .saver-btn.one-mode {
            background: #ff9800;
        }
        .saver-btn.one-mode:hover {
            background: #ffa726;
        }
        .saver-btn:disabled {
            background: #555;
            cursor: not-allowed;
            opacity: 0.7;
        }
        #saver-progress-container {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            height: 20px;
            position: relative;
            overflow: hidden;
            margin-top: 5px;
            display: none;
        }
        #saver-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #3390ec, #409ced);
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 8px;
        }
        #saver-progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 11px;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        body.tg-safe-mode a,
        body.tg-safe-mode video,
        body.tg-safe-mode .media-container {
            pointer-events: none !important;
        }
        body.tg-safe-mode .time,
        body.tg-safe-mode .message-time {
            border: 1px solid rgba(0, 255, 0, 0.3);
        }
    `);

    function log(msg) {
        console.log(`%c[TG-SAVER] ${msg}`, 'color: #00ff00; background: #000; padding: 2px 5px; border-radius: 3px;');
    }

    function playCompletionSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    function getChatTitle() {
        const el = document.querySelector('.chat-info .peer-title') ||
                   document.querySelector('.top-header .peer-title') ||
                   document.querySelector('.chat-title') ||
                   document.querySelector('.person .peer-title');

        if (el) {
            let title = el.textContent.trim();
            return title.replace(/[\\/:*?"<>|]+/g, '_');
        }
        return 'telegram_export';
    }

    let isRunning = false;
    let isFullMode = false;
    let scrollInterval;
    let processedMessages = new Set();
    let stuckCounter = 0;
    let messageBuffer = new Map();
    let downloadedFilesMap = new Map();

    function createPanel() {
        if (document.getElementById('tg-saver-panel')) return;

        const colCenter = document.querySelector('#column-center');
        if (!colCenter) return;

        const panel = document.createElement('div');
        panel.id = 'tg-saver-panel';
        panel.innerHTML = `
            <button id="saver-full-btn" class="saver-btn full-mode" title="Auto: Scroll → Download → TXT">
                <span>💬</span> FULL CHAT
            </button>
            <button id="saver-one-btn" class="saver-btn one-mode" title="Download single selected file">
                <span>📥</span> ONE MSG
            </button>
            <div id="saver-status" style="color:#aaa; font-size:11px; margin-left:5px;">Ready</div>
            <div id="saver-progress-container">
                <div id="saver-progress-bar"></div>
                <div id="saver-progress-text">0%</div>
            </div>
        `;

        colCenter.appendChild(panel);

        document.getElementById('saver-full-btn').addEventListener('click', runFullMode);
        document.getElementById('saver-one-btn').addEventListener('click', downloadOne);
    }

    function updateProgress(current, total, label = '') {
        const progressContainer = document.getElementById('saver-progress-container');
        const progressBar = document.getElementById('saver-progress-bar');
        const progressText = document.getElementById('saver-progress-text');

        if (!progressContainer || !progressBar || !progressText) return;

        const percentage = Math.round((current / total) * 100);

        progressContainer.style.display = 'block';
        progressBar.style.width = percentage + '%';
        progressText.textContent = label ? `${percentage}% ${label}` : `${percentage}%`;
    }

    function hideProgress() {
        const progressContainer = document.getElementById('saver-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    function simulateClick(element) {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const x = rect.left + (rect.width / 2);
        const y = rect.top + (rect.height / 2);

        const eventOptions = {
            bubbles: true,
            cancelable: true,
            detail: 1,
            screenX: x,
            screenY: y,
            clientX: x,
            clientY: y,
            buttons: 1,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true
        };

        [
            new PointerEvent('pointerdown', eventOptions),
            new MouseEvent('mousedown', eventOptions),
            new PointerEvent('pointerup', eventOptions),
            new MouseEvent('mouseup', eventOptions),
            new MouseEvent('click', eventOptions)
        ].forEach(evt => {
            evt.preventDefault = function() {};
            evt.stopPropagation = function() {};
            element.dispatchEvent(evt);
        });
    }

    function cleanTextLines(text) {
        if (!text) return '';
        let lines = text.split('\n');

        lines = lines.filter(line => {
            let l = line.trim();
            if (!l) return false;

            // Удаляем только расширения
            if (/^(zip|rar|7z|txt|doc|docx|xls|xlsx|pdf|mp3|ogg|mp4|mov|avi|mkv|jpg|png|jpeg|gif|webp)$/i.test(l)) return false;

            // Удаляем заглушки
            if (/^(🖼️ Фото|🎤 Голосовое сообщение|🎬 Видео|📎 Файл)$/.test(l)) return false;

            // Удаляем тайминги
            if (/^\d{1,2}:\d{2}$/.test(l)) return false;

            // === УДАЛЕНИЕ "Channel created" ===
            if (/^(Channel created|Канал создан|Group created|Группа создана)$/i.test(l)) return false;

            return true;
        });

        return lines.join(' ').trim();
    }

    function extractMessageText(bubble) {
        let author = '';
        const authorEl = bubble.querySelector('.peer-title') || bubble.querySelector('.from-name');
        if (authorEl) {
            author = authorEl.textContent.trim();
        }

        let timeStr = '';
        const timeEl = bubble.querySelector('.time') ||
                       bubble.querySelector('.message-time') ||
                       bubble.querySelector('.bubble-time');
        if (timeEl) {
            timeStr = timeEl.textContent.trim();
            const timeMatch = timeStr.match(/\d{1,2}:\d{2}/);
            if (timeMatch) {
                timeStr = timeMatch[0];
            }
        }

        let text = '';
        const mid = bubble.dataset.mid;
        const midNumber = mid ? parseInt(mid) : 0;

        const fileNamesSet = new Set();

        if (mid && downloadedFilesMap.has(mid)) {
            const storedFiles = downloadedFilesMap.get(mid);
            if (Array.isArray(storedFiles)) {
                storedFiles.forEach(f => fileNamesSet.add(f));
            } else {
                fileNamesSet.add(storedFiles);
            }
        }

        const nameSelectors = ['.document-name', '.file-name', '.audio-title', '.audio-subtitle'];
        nameSelectors.forEach(selector => {
            bubble.querySelectorAll(selector).forEach(el => {
                const name = el.textContent.trim();
                if (name) fileNamesSet.add(name);
            });
        });

        const bubbleClone = bubble.cloneNode(true);
        const elementsToRemove = bubbleClone.querySelectorAll(
            '.time, .message-time, .bubble-time, .peer-title, .from-name, .reply-wrapper, ' +
            '.download-progress, .document-size, .message-transfer-progress, .file-status, ' +
            '.audio-duration, .audio-author, .download-button, .document-ext, .status, .svg-icon, ' +
            '.video-duration, .media-duration'
        );
        elementsToRemove.forEach(el => el.remove());

        text = (bubbleClone.innerText || bubbleClone.textContent || '').trim();

        const links = bubble.querySelectorAll('a');
        let linkTexts = [];
        links.forEach(link => {
            const linkText = link.textContent.trim();
            const href = link.href;
            if (href && href !== linkText && !text.includes(href)) {
                linkTexts.push(`${linkText} => ${href}`);
            }
        });
        if (linkTexts.length > 0) {
            text += ' ' + linkTexts.join(' ');
        }

        if (timeStr) {
            const escapedTime = timeStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            text = text.replace(new RegExp(`(${escapedTime})+`, 'g'), '').trim();
        }

        text = text.replace(/[\uE000-\uF8FF]/g, '');
        text = text.replace(/^\d{1,2}:\d{2}/gm, '');

        const fileNamesArray = Array.from(fileNamesSet);

        if (fileNamesArray.length > 0) {
            fileNamesArray.forEach(fname => {
                text = text.replace(fname, '').trim();
            });
        }

        text = cleanTextLines(text);

        if (fileNamesArray.length > 0) {
            const filesBlock = fileNamesArray.map(f => `📎 ${f}`).join(' /');
            if (text) {
                 text = text + ' /' + filesBlock;
            } else {
                 text = filesBlock;
            }
        }

        const hasMedia = bubble.querySelector('.media-container, .document, .audio, video, img.thumbnail, .photo, .audio-element, .voice-message');
        if (!text && hasMedia && fileNamesSet.size === 0) {
             const isVoice = bubble.querySelector('.audio-element.voice, .audio.voice, .media-round, .is-voice, .voice-message');
             if (isVoice) text = '🎤 Голосовое сообщение';
             else text = '📎 Файл';
        }

        if (text) {
            text = text.replace(/file_(\d+)\.bin/gi, 'photo_$1_y.jpg');
            text = text.replace(/(voice_\d{2}-\d{2}-\d{4}_\d{2}-\d{2}-\d{2})(?!\.)/gi, '$1.ogg');
        }

        if (!text && !hasMedia) return null;

        let line = '';
        if (author) line += author + ': ';
        line += text;

        return { line, timeStr, mid, midNumber };
    }

    function selectLastMessage() {
        const status = document.getElementById('saver-status');
        const bubbles = document.querySelectorAll('.bubble');

        if (!bubbles || bubbles.length === 0) {
            if (!isFullMode) alert('Сообщения не найдены.');
            return;
        }

        document.body.classList.add('tg-safe-mode');

        let found = false;
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const bubble = bubbles[i];

            if (bubble.classList.contains('service-msg') || bubble.classList.contains('is-date')) continue;
            if (bubble.classList.contains('is-selected')) {
                status.innerText = 'Last selected.';
                found = true;
                break;
            }

            let target = bubble.querySelector('.time') ||
                         bubble.querySelector('.message-time') ||
                         bubble.querySelector('.bubble-time') ||
                         bubble.querySelector('.select-checkbox');

            if (target && target.offsetParent !== null) {
                simulateClick(target);
                if (bubble.dataset.mid) processedMessages.add(bubble.dataset.mid);
                status.innerText = 'Last selected.';
                found = true;
                break;
            }
        }

        if (!found) status.innerText = 'Not found.';

        setTimeout(() => {
            if (!isRunning) document.body.classList.remove('tg-safe-mode');
        }, 500);
    }

    function toggleScroll() {
        const status = document.getElementById('saver-status');
        const container = findScrollableElement();

        if (!container) {
            if (!isFullMode) alert('Чат не найден! Откройте чат.');
            return;
        }

        isRunning = true;
        stuckCounter = 0;
        processedMessages.clear();
        messageBuffer.clear();

        document.querySelectorAll('.is-selected').forEach(b => {
            if (b.dataset.mid) processedMessages.add(b.dataset.mid);
        });

        document.body.classList.add('tg-safe-mode');

        status.innerText = 'Scrolling...';

        scrollInterval = setInterval(() => {
            if (!isRunning) return;

            const bubbles = document.querySelectorAll('.bubble');

            bubbles.forEach(bubble => {
                if (bubble.classList.contains('service-msg') || bubble.classList.contains('is-date')) return;

                const mid = bubble.dataset.mid;
                if (!mid) return;

                if (!messageBuffer.has(mid)) {
                    const messageData = extractMessageText(bubble);
                    if (messageData) {
                        messageBuffer.set(mid, messageData);
                    }
                }

                if (processedMessages.has(mid)) return;

                if (bubble.classList.contains('is-selected')) {
                    processedMessages.add(mid);
                    return;
                }

                let target = bubble.querySelector('.time') ||
                             bubble.querySelector('.message-time') ||
                             bubble.querySelector('.bubble-time') ||
                             bubble.querySelector('.select-checkbox');

                if (target && target.offsetParent !== null) {
                    simulateClick(target);
                    processedMessages.add(mid);
                }
            });

            if (container) {
                container.scrollBy({ top: -300, behavior: 'auto' });

                if (container.scrollTop <= 50) {
                    stuckCounter++;
                    status.innerText = `Top? ${stuckCounter}/5`;
                    updateProgress(messageBuffer.size, messageBuffer.size + 10, `(${messageBuffer.size})`);
                    if (stuckCounter >= 5) {
                        stopScroller(true);
                    }
                } else {
                    stuckCounter = 0;
                    status.innerText = `Scrolling...`;
                    updateProgress(processedMessages.size, processedMessages.size + 50, `(${messageBuffer.size})`);
                }
            }
        }, 700);
    }

    function stopScroller(finished = false) {
        isRunning = false;
        clearInterval(scrollInterval);
        document.body.classList.remove('tg-safe-mode');

        const status = document.getElementById('saver-status');

        if (finished) {
            updateProgress(100, 100, '✅ Done!');
            status.innerText = `✅ Buffered: ${messageBuffer.size}`;
            log(`Скролл завершен. В буфере ${messageBuffer.size} сообщений.`);

            if (!isFullMode) {
                setTimeout(hideProgress, 3000);
            } else {
                setTimeout(hideProgress, 1000);
            }
        } else {
            hideProgress();
            status.innerText = `Stopped. Buffered: ${messageBuffer.size}`;
        }
    }

    function findScrollableElement() {
        const colCenter = document.querySelector('#column-center');
        if (!colCenter) return null;
        let el = colCenter.querySelector('.bubbles-container') || colCenter.querySelector('.scrollable-y');
        if (el) return el;
        const anyBubble = colCenter.querySelector('.bubble');
        if (anyBubble) {
            let parent = anyBubble.parentElement;
            while (parent && parent !== colCenter) {
                if (parent.scrollHeight > parent.clientHeight) return parent;
                parent = parent.parentElement;
            }
        }
        return null;
    }

    function getFilePriority(media) {
        const fileName = (media.file_name || '').toLowerCase();
        const mimeType = (media.mime_type || '').toLowerCase();

        if (fileName.endsWith('.txt') || mimeType.includes('text/plain')) return 1;
        if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || mimeType.includes('msword')) return 2;
        if (mimeType.includes('audio') || fileName.endsWith('.ogg') || fileName.endsWith('.mp3')) return 3;
        if (mimeType.includes('zip') || mimeType.includes('rar') || fileName.endsWith('.zip')) return 4;
        if (fileName.endsWith('.pdf')) return 5;
        if (mimeType.includes('image')) return 6;
        if (mimeType.includes('video')) return 7;

        return 8;
    }

    async function downloadOne() {
        const status = document.getElementById('saver-status');
        status.innerText = 'ONE MSG...';
        await new Promise(r => setTimeout(r, 500));
        try {
            const msgs = await unsafeWindow.appImManager.chat.selection.getSelectedMessages();
            if (!msgs || msgs.length === 0) { alert('Нет выделения!'); return; }
            if (msgs.length > 1) { alert('Выделено > 1'); return; }
            const msg = msgs[0];
            if (!msg.media || (!msg.media.document && !msg.media.photo)) { alert('Нет файла.'); return; }
            const media = msg.media.document || msg.media.photo;
            log(`Downloading single: ${media.file_name || media.id}`);
            unsafeWindow.appDownloadManager.downloadToDisc({ media: media });
            status.innerText = '✅ OK';
        } catch (e) {
            console.error(e);
            alert('Ошибка API.');
        }
    }

    async function downloadSelected() {
        const status = document.getElementById('saver-status');
        status.innerText = 'Downloading...';

        await new Promise(r => setTimeout(r, 500));

        try {
            const msgs = await unsafeWindow.appImManager.chat.selection.getSelectedMessages();

            if (!msgs || msgs.length === 0) {
                if (!isFullMode) alert('Нет выделенных сообщений!');
                status.innerText = 'No selection.';
                return;
            }

            msgs.reverse();
            downloadedFilesMap.clear();

            let filesWithMedia = [];
            let groupedFiles = new Map();

            msgs.forEach((msg, originalIndex) => {
                if (msg.media && (msg.media.document || msg.media.photo)) {
                    const media = msg.media.document || msg.media.photo;

                    let ext = 'bin';
                    const mime = (media.mime_type || '').toLowerCase();
                    if (mime.includes('image') || mime.includes('jpg') || mime.includes('jpeg')) ext = 'jpg';
                    else if (mime.includes('audio/ogg')) ext = 'ogg';
                    else if (mime.includes('text/plain')) ext = 'txt';
                    else if (mime === 'application/pdf') ext = 'pdf';
                    else if (mime.includes('/')) ext = mime.split('/')[1];

                    if (media.file_name) {
                        const parts = media.file_name.split('.');
                        if (parts.length > 1) ext = parts.pop();
                    }
                    if (ext === 'jpeg') ext = 'jpg';
                    if (ext === 'quicktime') ext = 'mov';
                    if (ext === 'bin' && mime.includes('image')) ext = 'jpg';

                    let finalName = media.file_name;
                    if (!finalName) {
                        if (ext === 'jpg') finalName = `photo_${media.id}_y.jpg`;
                        else if (ext === 'ogg' || (mime.includes('audio'))) finalName = `voice_${media.id}.ogg`;
                        else finalName = `file_${media.id}.${ext}`;
                    }

                    if (msg.grouped_id) {
                        const gid = msg.grouped_id.toString();
                        if (!groupedFiles.has(gid)) groupedFiles.set(gid, []);
                        groupedFiles.get(gid).push(finalName);
                    }

                    filesWithMedia.push({
                        msg: msg,
                        media: media,
                        originalIndex: originalIndex,
                        priority: getFilePriority(media),
                        mid: msg.mid,
                        finalName: finalName,
                        grouped_id: msg.grouped_id
                    });
                }
            });

            filesWithMedia.sort((a, b) => a.priority - b.priority);

            log(`📋 Download order: ${filesWithMedia.length} files`);
            let count = 0;

            filesWithMedia.forEach((item, downloadIndex) => {
                setTimeout(() => {
                    const media = item.media;
                    const oldFileName = item.finalName;

                    let filesToStore = [oldFileName];
                    if (item.grouped_id) {
                        const gid = item.grouped_id.toString();
                        if (groupedFiles.has(gid)) {
                            filesToStore = [...new Set(groupedFiles.get(gid))];
                        }
                    }

                    if (item.mid) {
                        const mKey = item.mid.toString();
                        downloadedFilesMap.set(mKey, filesToStore);
                    }

                    unsafeWindow.appDownloadManager.downloadToDisc({ media: media });

                    updateProgress(downloadIndex + 1, filesWithMedia.length, `(${downloadIndex + 1}/${filesWithMedia.length})`);
                    status.innerText = `D/L ${downloadIndex + 1}/${filesWithMedia.length}`;

                }, downloadIndex * 250);
                count++;
            });

            setTimeout(() => {
                status.innerText = `Downloaded ${count}`;
                log(`✅ Download finished. Map size: ${downloadedFilesMap.size}`);
                setTimeout(hideProgress, 2000);
            }, filesWithMedia.length * 250 + 1000);

        } catch (e) {
            console.error(e);
            hideProgress();
        }
    }

    function exportTXT() {
        const status = document.getElementById('saver-status');

        if (messageBuffer.size === 0) {
            if (!isFullMode) alert('Буфер пуст! Сначала скролл.');
            return;
        }

        status.innerText = 'Exporting TXT...';
        updateProgress(0, 100, 'Re-processing...');

        const messages = [];

        messageBuffer.forEach((oldMsg, mid) => {
            const bubble = document.querySelector(`.bubble[data-mid="${mid}"]`);
            let finalMsg = oldMsg;

            if (bubble) {
                const reExtracted = extractMessageText(bubble);
                if (reExtracted) finalMsg = reExtracted;
            } else if (downloadedFilesMap.has(mid)) {
                const storedFiles = downloadedFilesMap.get(mid);
                let filesList = Array.isArray(storedFiles) ? storedFiles : [storedFiles];

                const missingFiles = filesList.filter(f => !oldMsg.line.includes(f));

                if (missingFiles.length > 0) {
                     const timePart = oldMsg.timeStr ? `[${oldMsg.timeStr}]` : '';
                     const filesBlock = missingFiles.map(f => `📎 ${f}`).join(' /');

                     let cleanOldLine = oldMsg.line.replace(timePart, '').trim();
                     cleanOldLine = cleanTextLines(cleanOldLine);

                     if (cleanOldLine) {
                         finalMsg.line = `${cleanOldLine} /${filesBlock}`;
                     } else {
                         finalMsg.line = `${filesBlock}`;
                     }
                }
            }

            if (finalMsg.line) {
                 finalMsg.line = finalMsg.line.replace(/file_(\d+)\.bin/gi, 'photo_$1_y.jpg');
                 finalMsg.line = finalMsg.line.replace(/(voice_\d{2}-\d{2}-\d{4}_\d{2}-\d{2}-\d{2})(?!\.)/gi, '$1.ogg');
            }

            messages.push(finalMsg);
        });

        messages.sort((a, b) => a.midNumber - b.midNumber);

        // Нумерация 1) 2) ...
        const lines = messages.map((msg, index) => `${index + 1}) ${msg.line}`);

        const fullText = lines.join('\n__________________________\n\n');

        const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const chatName = getChatTitle();
        a.download = `${chatName}.txt`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        status.innerText = `TXT Saved!`;
    }

    async function runFullMode() {
        const status = document.getElementById('saver-status');
        const fullBtn = document.getElementById('saver-full-btn');

        isFullMode = true;
        fullBtn.disabled = true;

        selectLastMessage();
        await new Promise(r => setTimeout(r, 1000));

        toggleScroll();
        await new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (!isRunning) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 1000);
        });

        await new Promise(r => setTimeout(r, 2000));

        await downloadSelected();

        const msgs = await unsafeWindow.appImManager.chat.selection.getSelectedMessages();
        const filesCount = msgs.filter(m => m.media).length;
        await new Promise(r => setTimeout(r, filesCount * 250 + 3000));

        exportTXT();

        playCompletionSound();

        setTimeout(() => {
            fullBtn.disabled = false;
            isFullMode = false;
            hideProgress();
            status.innerText = 'Ready';
        }, 3000);
    }

    // Запуск панели
    const observer = new MutationObserver(() => {
        createPanel();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(createPanel, 2000);

})();