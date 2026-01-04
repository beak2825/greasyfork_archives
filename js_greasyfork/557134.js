// ==UserScript==
// @name         CCFOLIA Chat Log Exporter
// @namespace    http://tampermonkey.net/
// @version      70.2
// @description  ココフォリアのログ保存ツール。画像はWebP(100%)で保存、アイコンは角丸四角・上トリミングで表示します。
// @author       むらひと
// @match        https://ccfolia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccfolia.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557134/CCFOLIA%20Chat%20Log%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/557134/CCFOLIA%20Chat%20Log%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 設定 & 定数
    // ==========================================
    const CONFIG = {
        SCROLL_DEBOUNCE: 100,      // スクロール後の安定待機時間
        DOM_QUIET_TIMEOUT: 150,    // DOM変化が落ち着いたとみなす時間
        DATA_LOAD_TIMEOUT: 4000,   // データロード最大待ち時間
        SPINNER_WAIT_LIMIT: 30000,
        BUTTON_ID: 'ccfolia-log-export-btn',
        CONCURRENCY_LIMIT: 8
    };

    const BLANK_GIF = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

    // ==========================================
    // Core: Web Worker & Visibility Spoofing
    // ==========================================

    const workerBlob = new Blob([`
        self.onmessage = function(e) {
            setTimeout(function() { self.postMessage('tick'); }, e.data);
        };
    `], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(workerBlob);
    const timerWorker = new Worker(workerUrl);

    const wait = (ms) => new Promise(resolve => {
        const handler = () => {
            timerWorker.removeEventListener('message', handler);
            resolve();
        };
        timerWorker.addEventListener('message', handler);
        timerWorker.postMessage(ms);
    });

    function spoofVisibility() {
        try {
            Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            const blockEvent = (e) => e.stopImmediatePropagation();
            document.addEventListener('visibilitychange', blockEvent, true);
            document.addEventListener('webkitvisibilitychange', blockEvent, true);
            window.addEventListener('blur', blockEvent, true);
        } catch (e) {
            console.warn("Visibility spoofing warning:", e);
        }
    }

    // ==========================================
    // UIスタイル定義
    // ==========================================
    const SAVE_ICON_SVG = `
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: inherit;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    `;

    function createStyles() {
        if (document.getElementById('ccfolia-exporter-style')) return;
        const style = document.createElement('style');
        style.id = 'ccfolia-exporter-style';
        style.innerHTML = `
            #${CONFIG.BUTTON_ID} {
                background: transparent; border: none; cursor: pointer; padding: 8px;
                color: rgba(255, 255, 255, 0.6); transition: all 0.2s ease;
                display: flex; align-items: center; justify-content: center;
            }
            #${CONFIG.BUTTON_ID}:hover { color: #fff; transform: scale(1.1); }

            #ccfolia-export-modal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(18, 18, 18, 0.92); z-index: 10000;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                color: #ececec; font-family: "Helvetica Neue", Arial, sans-serif;
                backdrop-filter: blur(4px);
            }
            .ccfolia-modal-content {
                background: #252525; padding: 32px; border-radius: 12px;
                max-width: 500px; width: 90%;
                box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                border: 1px solid #333;
                display: flex; flex-direction: column; max-height: 90vh;
            }
            .ccfolia-modal-header {
                font-size: 1.4em; font-weight: 600; margin-bottom: 20px;
                border-bottom: 1px solid #3a3a3a; padding-bottom: 15px;
                text-align: center; letter-spacing: 0.05em; color: #fff;
            }
            .ccfolia-toolbar {
                width: 100%; display: flex; gap: 20px; margin-bottom: 12px; font-size: 0.85em; justify-content: flex-end;
            }
            .ccfolia-link {
                cursor: pointer; color: #8ab4f8; text-decoration: none; transition: color 0.2s;
            }
            .ccfolia-link:hover { color: #d2e3fc; text-decoration: underline; }

            .ccfolia-list-container {
                display: flex; flex-direction: column; gap: 6px;
                overflow-y: auto; flex-grow: 1; margin-bottom: 16px;
                background: #1e1e1e; padding: 12px; border-radius: 6px;
                border: 1px solid #333; min-height: 150px; max-height: 400px;
            }
            .ccfolia-list-item {
                display: flex; align-items: center; padding: 8px 12px;
                background: #2c2c2c; border-radius: 4px; cursor: pointer;
                transition: background 0.2s; user-select: none;
            }
            .ccfolia-list-item:hover { background: #383838; }
            .ccfolia-list-item input { margin-right: 14px; transform: scale(1.2); accent-color: #8ab4f8; }
            .ccfolia-list-item span { font-size: 0.95em; }

            .ccfolia-footer {
                display: flex; justify-content: flex-end; gap: 16px; margin-top: auto; width: 100%;
            }
            .ccfolia-btn {
                padding: 10px 24px; border-radius: 6px; border: none; cursor: pointer;
                font-weight: 600; font-size: 0.9em; transition: all 0.2s;
            }
            .ccfolia-btn-secondary { background: #444; color: #ccc; }
            .ccfolia-btn-secondary:hover { background: #555; color: #fff; }
            .ccfolia-btn-primary { background: #1a73e8; color: white; box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3); }
            .ccfolia-btn-primary:hover { background: #1557b0; box-shadow: 0 4px 12px rgba(26, 115, 232, 0.5); }
            .ccfolia-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(100%); }

            .ccfolia-status-box {
                margin-top: 10px; margin-bottom: 10px; padding: 10px; background: #1a1a1a; border-radius: 6px;
                color: #a8d1ff; font-size: 0.85em; text-align: center; min-height: 20px;
                border-left: 3px solid #1a73e8; display: flex; align-items: center; justify-content: center;
                line-height: 1.4; white-space: pre-wrap;
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // Image Registry
    // ==========================================
    class ImageRegistry {
        constructor() {
            this.urlToInfo = new Map();
            this.counter = 0;
        }

        registerUrl(url) {
            if (!url || url.startsWith('data:')) return null;
            url = url.replace(/^url\(['"]?(.+?)['"]?\)$/, '$1');

            if (this.urlToInfo.has(url)) return this.urlToInfo.get(url).id;

            const id = 'asset_' + (this.counter++).toString(36);
            // デフォルトはwebpとして扱う
            const ext = 'webp';

            this.urlToInfo.set(url, { id, blob: null, ext, status: 'pending' });
            return id;
        }

        getId(url) {
            if (!url) return null;
            url = url.replace(/^url\(['"]?(.+?)['"]?\)$/, '$1');
            const info = this.urlToInfo.get(url);
            return info ? info.id : null;
        }

        getFileName(url) {
            url = url.replace(/^url\(['"]?(.+?)['"]?\)$/, '$1');
            const info = this.urlToInfo.get(url);
            return info ? `${info.id}.${info.ext}` : null;
        }

        async fetchOne(url) {
             const info = this.urlToInfo.get(url);
             if(!info) return;
             try {
                // 画像をフェッチ
                const response = await fetch(url, {
                    cache: 'force-cache',
                    mode: 'cors',
                    credentials: 'omit'
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const originalBlob = await response.blob();

                // WebPへの変換処理
                // ImageBitmapを作成してからCanvasに描画し、toBlobでWebP化する
                const bitmap = await createImageBitmap(originalBlob);

                const canvas = document.createElement('canvas');
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(bitmap, 0, 0);

                // WebP品質100%でBlob化
                const webpBlob = await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/webp', 1.0);
                });

                info.blob = webpBlob;
                info.ext = 'webp';
                info.status = 'loaded';

            } catch (e) {
                console.warn(`Failed to load or convert: ${url}`, e);
                info.status = 'error';
                info.blob = await (await fetch(BLANK_GIF)).blob();
                info.ext = 'gif'; // エラー時は透明GIF
            }
        }

        async fetchAll(statusCallback) {
            const urls = Array.from(this.urlToInfo.keys());
            const total = urls.length;
            let finished = 0;

            for (let i = 0; i < total; i += CONFIG.CONCURRENCY_LIMIT) {
                const chunk = urls.slice(i, i + CONFIG.CONCURRENCY_LIMIT);
                const promises = chunk.map(async (url) => {
                    const info = this.urlToInfo.get(url);
                    if(info.status === 'pending') {
                        await this.fetchOne(url);
                    }
                    finished++;
                    if (statusCallback) statusCallback(finished, total);
                });
                await Promise.all(promises);
            }
        }

        addToZip(zip) {
            const folder = zip.folder("images");
            for (const [url, info] of this.urlToInfo) {
                if (info.blob) {
                    folder.file(`${info.id}.${info.ext}`, info.blob);
                }
            }
        }
    }

    // ==========================================
    // DOM Helper & HTML Generator
    // ==========================================
    function getTabElements() {
        const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        if (tabs.length > 1) {
            return tabs.filter(t => t.innerText && t.innerText.trim() !== '');
        }
        return tabs;
    }

    function getRoomName() {
        const headerTitle = document.querySelector('header h6');
        return headerTitle ? headerTitle.innerText.trim().replace(/\n/g, ' ') : 'CCFOLIA Log';
    }

    function detectScrollContainer() {
        const muiList = document.querySelector('ul.MuiList-root');
        if (muiList) {
            let current = muiList;
            while(current && current !== document.body) {
                const style = window.getComputedStyle(current);
                if (['auto', 'scroll', 'overlay'].includes(style.overflowY)) {
                    return current;
                }
                current = current.parentElement;
            }
            return muiList;
        }
        return document.querySelector('[data-testid="chat-list"]');
    }

    function hasLoadingSpinner(container) {
        return container.querySelector('.MuiCircularProgress-root') !== null ||
               container.querySelector('[role="progressbar"]') !== null;
    }

    function getFirstItemIdentifier(container) {
        const targetRoot = container.querySelector('.MuiList-root') || container;
        const item = targetRoot.querySelector('.MuiListItem-root');
        if (!item) return null;
        return item.innerText.slice(0, 100) + (item.querySelector('img')?.src || '');
    }

    function waitForListUpdate(container, prevFirstId, prevScrollHeight) {
        return new Promise((resolve) => {
            let timeoutId = null;
            let quietId = null;
            let hasChanged = false;

            const targetRoot = container.querySelector('.MuiList-root') || container;

            const cleanup = () => {
                observer.disconnect();
                if (timeoutId) clearTimeout(timeoutId);
                if (quietId) clearTimeout(quietId);
            };

            const checkState = () => {
                const currentFirstId = getFirstItemIdentifier(container);
                const currentScrollHeight = container.scrollHeight;

                // IDが変わったか、高さが増えていればロード成功とみなす
                if (currentFirstId !== prevFirstId || currentScrollHeight > prevScrollHeight) {
                    return true;
                }
                return false;
            };

            const onQuiet = () => {
                cleanup();
                if (checkState()) {
                    resolve('updated');
                } else {
                    resolve('timeout');
                }
            };

            const observer = new MutationObserver(() => {
                if (hasLoadingSpinner(container)) return;
                // 変更を検知したら、少し待って（quiet wait）から確定させる
                hasChanged = true;
                if (quietId) clearTimeout(quietId);
                quietId = setTimeout(onQuiet, CONFIG.DOM_QUIET_TIMEOUT);
            });

            observer.observe(targetRoot, { childList: true, subtree: true });

            // 初期チェック（既に変わっている場合）
            if (!hasLoadingSpinner(container) && checkState()) {
                hasChanged = true;
                quietId = setTimeout(onQuiet, CONFIG.DOM_QUIET_TIMEOUT);
                return;
            }

            timeoutId = setTimeout(() => {
                if (!hasChanged) {
                    cleanup();
                    resolve('timeout');
                }
            }, CONFIG.DATA_LOAD_TIMEOUT);
        });
    }

    async function waitForSpinnerDisappearance(container) {
        if (!hasLoadingSpinner(container)) return;
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                if (!hasLoadingSpinner(container)) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(container, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                resolve();
            }, CONFIG.SPINNER_WAIT_LIMIT);
        });
    }

    async function waitForImagesToLoad(container) {
        const start = Date.now();
        while (Date.now() - start < 1500) {
            const imgs = Array.from(container.querySelectorAll('img'));
            if (imgs.length === 0) break;
            const allLoaded = imgs.every(img => img.complete && img.naturalWidth > 0);
            if (allLoaded) break;
            await wait(100);
        }
    }

    function forceScroll(container) {
        // スクロールイベントを確実に発火させるための「ゆさぶり」
        if(container.scrollTop === 0) {
            container.scrollTop = 50;
        }
        container.scrollTop = 0;
        container.dispatchEvent(new Event('scroll', { bubbles: true }));
    }

    async function processTab(tabName, tabElement, statusEl, imageRegistry) {
        statusEl.textContent = `タブ「${tabName}」準備中...`;
        tabElement.click();
        await wait(500);

        let container = detectScrollContainer();
        if (!container) {
            await wait(1000);
            container = detectScrollContainer();
        }
        if (!container) {
            console.error("Scroll container not found");
            return [];
        }

        const originalScrollBehavior = container.style.scrollBehavior;
        container.style.scrollBehavior = 'auto';

        statusEl.textContent = `「${tabName}」ログ取得開始...`;

        const collectedMap = new Map();
        const orderedKeys = [];

        await waitForImagesToLoad(container);
        captureSnapshot(container, collectedMap, orderedKeys);

        let isEnd = false;
        let retryCount = 0;
        const MAX_STUCK_RETRIES = 3;

        while (!isEnd) {
            const prevFirstId = getFirstItemIdentifier(container);
            const prevScrollHeight = container.scrollHeight;

            if (hasLoadingSpinner(container)) {
                statusEl.textContent = "読み込み中...";
                await waitForSpinnerDisappearance(container);
            }

            forceScroll(container);

            const result = await waitForListUpdate(container, prevFirstId, prevScrollHeight);

            if (result === 'updated') {
                retryCount = 0;
                // DOMが落ち着いた直後なので即座にキャプチャ
                await waitForImagesToLoad(container);
                captureSnapshot(container, collectedMap, orderedKeys);
                statusEl.textContent = `収集中... (${orderedKeys.length}件)`;
            } else {
                if (retryCount < MAX_STUCK_RETRIES) {
                    retryCount++;
                    statusEl.textContent = `終端確認中... (${retryCount}/${MAX_STUCK_RETRIES})`;
                    // リトライ時は少し長めに待機して再度ゆさぶる
                    await wait(200);
                    forceScroll(container);
                } else {
                    isEnd = true;
                }
            }
            if (orderedKeys.length > 50000) isEnd = true;
        }

        container.style.scrollBehavior = originalScrollBehavior || '';

        const logs = [];
        const uniqueKeys = Array.from(new Set(orderedKeys)).reverse();

        uniqueKeys.forEach(key => {
            const item = collectedMap.get(key);
            if (!item) return;
            if (item.avatarUrl) imageRegistry.registerUrl(item.avatarUrl);

            let tempContent = item.htmlContent;
            if (tempContent.includes('<img')) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = item.htmlContent;
                let changedImg = false;
                tempDiv.querySelectorAll('img').forEach(img => {
                    if (img.src && !img.src.startsWith('data:')) {
                        imageRegistry.registerUrl(img.src);
                        img.setAttribute('data-original-src', img.src);
                        img.setAttribute('data-img-target', 'true');
                        img.src = BLANK_GIF;
                        img.removeAttribute('srcset');
                        changedImg = true;
                    }
                });
                if (changedImg) tempContent = tempDiv.innerHTML;
            }

            logs.push({
                name: item.name || "Unknown",
                color: item.color || "#bbb",
                bodyColor: item.bodyColor || "",
                avatarUrlOriginal: item.avatarUrl,
                timestamp: item.timestamp || "",
                htmlContent: tempContent
            });
        });
        return logs;
    }

    function captureSnapshot(container, map, keys) {
        let targetRoot = container.querySelector('.MuiList-root') || container;
        const listItems = Array.from(targetRoot.querySelectorAll('.MuiListItem-root'));

        for (let i = listItems.length - 1; i >= 0; i--) {
            const item = listItems[i];
            let name = "Unknown";
            let timestamp = "";
            let bodyText = "";
            let imgSrc = "";
            let avatarUrl = null;

            const primaryText = item.querySelector('.MuiListItemText-primary');
            if (primaryText) {
                const caption = primaryText.querySelector('.MuiTypography-caption');
                if (caption) {
                    timestamp = caption.innerText.replace(/^[-\s]+/, '');
                    const fullText = primaryText.innerText;
                    name = fullText.replace(timestamp, '').trim();
                } else {
                    name = primaryText.innerText.trim();
                }
            }

            const secondaryText = item.querySelector('.MuiListItemText-secondary');
            let contentHtml = "";
            let bodyColor = "";

            if (secondaryText) {
                bodyText = secondaryText.innerText;
                contentHtml = secondaryText.innerHTML;
                const innerImg = secondaryText.querySelector('img');
                if(innerImg) imgSrc = innerImg.src;
                if(secondaryText.style.color) bodyColor = secondaryText.style.color;
            } else {
                bodyText = item.innerText;
                contentHtml = item.innerHTML;
            }

            const avatarContainer = item.querySelector('.MuiListItemAvatar-root');
            if (avatarContainer) {
                const img = avatarContainer.querySelector('img');
                if (img && img.src && !img.src.includes('blank.gif')) {
                    avatarUrl = img.src;
                }
            }

            const uniqueId = `${timestamp}::${name}::${bodyText.slice(0, 50)}::${imgSrc.slice(-30)}`;

            if (!map.has(uniqueId)) {
                let color = "#bbb";
                if (primaryText && primaryText.style.color) {
                    color = primaryText.style.color;
                }
                map.set(uniqueId, { name, color, bodyColor, timestamp, avatarUrl, htmlContent: contentHtml });
                keys.push(uniqueId);
            }
        }
    }

    function processOneTabLogs(tabData, imageRegistry) {
        const processedLogs = tabData.logs.map(l => {
            let avatarSrc = null;
            if (l.avatarUrlOriginal) {
                const filename = imageRegistry.getFileName(l.avatarUrlOriginal);
                if (filename) avatarSrc = `images/${filename}`;
            }

            let content = l.htmlContent;
            if (content.includes('data-img-target')) {
                const div = document.createElement('div');
                div.innerHTML = content;
                div.querySelectorAll('img[data-img-target]').forEach(img => {
                    const originalSrc = img.getAttribute('data-original-src');
                    const filename = imageRegistry.getFileName(originalSrc);
                    if (filename) {
                        img.src = `images/${filename}`;
                    } else {
                        img.src = BLANK_GIF;
                    }
                    img.removeAttribute('data-img-target');
                    img.removeAttribute('data-original-src');
                    img.loading = "lazy";
                    img.style.maxWidth = "100%";
                    img.style.borderRadius = "4px";
                    img.style.display = "block";
                });
                content = div.innerHTML;
            }

            return {
                name: l.name,
                color: l.color,
                bodyColor: l.bodyColor,
                timestamp: l.timestamp,
                avatarSrc: avatarSrc,
                htmlContent: content
            };
        });
        return { name: tabData.name, logs: processedLogs };
    }

    function generateViewerHTML(roomName, scriptTagsArray) {
        const dateStr = new Date().toISOString().slice(0,10);
        const titleName = roomName || "CCFOLIA Log";
        const scriptTagsHtml = scriptTagsArray.join('\n    ');
        const css = `
            :root { --bg-primary: #313338; --bg-secondary: #2b2d31; --bg-tertiary: #1e1f22; --text-normal: #dbdee1; --text-muted: #949ba4; --header-primary: #f2f3f5; --accent: #5865f2; --message-hover: #2e3035; --divider: #3f4147; }
            * { box-sizing: border-box; }
            body { background-color: var(--bg-primary); color: var(--text-normal); font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; margin: 0; padding: 0; height: 100vh; display: flex; overflow: hidden; }
            .sidebar { width: 260px; background: var(--bg-secondary); display: flex; flex-direction: column; flex-shrink: 0; border-right: 1px solid var(--divider); }
            .sidebar-header { padding: 16px; font-weight: bold; color: var(--header-primary); border-bottom: 1px solid var(--divider); font-size:1.1em; overflow-wrap: break-word;}
            .tab-list { flex-grow: 1; overflow-y: auto; padding: 8px; }
            .tab-btn { display: block; width: 100%; text-align: left; padding: 10px 12px; margin-bottom: 4px; background: transparent; border: none; border-radius: 4px; color: var(--text-muted); cursor: pointer; font-weight: 500; font-size: 0.95em; }
            .tab-btn:hover { background: var(--message-hover); color: var(--text-normal); }
            .tab-btn.active { background: #404249; color: #fff; }
            .count-badge { float: right; font-size: 11px; background: var(--bg-tertiary); padding: 2px 6px; border-radius: 10px; min-width: 20px; text-align: center;}
            .main { flex-grow: 1; display: flex; flex-direction: column; background: var(--bg-primary); overflow: hidden; position: relative; }
            .tab-pane { display: none; width: 100%; height: 100%; flex-direction: column; }
            .tab-pane.active { display: flex; }
            .chat-header { height: 48px; border-bottom: 1px solid var(--divider); display: flex; align-items: center; padding: 0 16px; font-weight: bold; color: var(--header-primary); box-shadow: 0 1px 2px rgba(0,0,0,0.2); z-index: 10; flex-shrink: 0; font-size: 1.1em; }
            .scroll-area { flex-grow: 1; overflow-y: auto; padding: 16px 0; min-height: 0; }
            .message { display: flex; padding: 2px 16px; margin-top: 0px; min-height: 2.75rem; border-bottom: 1px solid rgba(255,255,255,0.03); position: relative; }
            .message:hover { background-color: var(--message-hover); }
            .avatar-column { width: 60px; flex-shrink: 0; margin-top: 4px; text-align: center; }
            .avatar { width: 45px; height: 45px; border-radius: 6px; object-fit: cover; object-position: top; background-color: var(--bg-tertiary); }
            .no-avatar { width: 45px; height: 45px; }
            .content-column { flex-grow: 1; min-width: 0; padding-left: 0px; }
            .msg-header { display: flex; align-items: baseline; margin-bottom: 2px; }
            .username { font-weight: 600; font-size: 1rem; margin-right: 8px; cursor: pointer; }
            .username:hover { text-decoration: underline; }
            .timestamp { font-size: 0.75rem; color: var(--text-muted); margin-left: 0px; }
            .msg-body { font-size: 1rem; line-height: 1.4; color: var(--text-normal); white-space: pre-wrap; overflow-wrap: break-word; }
            .msg-body img { max-width: 400px; max-height: 400px; border-radius: 4px; margin-top: 4px; cursor: pointer; display: block;}
            @media (max-width: 768px) {
                body { flex-direction: column; }
                .sidebar { width: 100%; height: auto; min-height: 50px; flex-direction: row; align-items: center; overflow-x: auto; flex-shrink: 0; border-bottom: 1px solid var(--divider); }
                .sidebar-header { border-bottom: none; border-right: 1px solid var(--divider); padding: 10px; font-size: 1em; white-space: nowrap; margin-right: 4px; }
                .tab-list { display: flex; flex-direction: row; gap: 4px; padding: 4px; overflow-x: auto; }
                .tab-btn { width: auto; margin: 0; white-space: nowrap; padding: 6px 12px; font-size: 0.9em; }
                .count-badge { display: none; }
                .main { height: calc(100vh - 54px); }
                .chat-header { height: 40px; font-size: 1em; }
                .scroll-area { padding: 8px 0; }
                .message { padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .avatar-column { width: 40px; margin-right: 8px; }
                .avatar, .no-avatar { width: 36px; height: 36px; }
                .username { font-size: 0.95em; }
                .msg-body { font-size: 0.95em; }
                .msg-body img { max-width: 100%; height: auto; }
            }
        `;
        const script = `
            document.addEventListener('DOMContentLoaded', () => {
                const data = window.CCFOLIA_LOG_DATA || [];
                const tabListEl = document.getElementById('tab-list');
                const mainEl = document.getElementById('main-content');
                let buttonsHtml = ''; let panesHtml = '';
                data.forEach((tab, idx) => {
                    const activeClass = idx === 0 ? 'active' : '';
                    const tabId = 'tab-' + idx;
                    buttonsHtml += \`<button class="tab-btn \${activeClass}" onclick="switchTab('\${tabId}')" id="btn-\${tabId}">\${escapeHtml(tab.name)} <span class="count-badge">\${tab.logs.length}</span></button>\`;
                    const logsHtml = tab.logs.map(l => {
                        let avatarHtml = '<div class="no-avatar"></div>';
                        if (l.avatarSrc) avatarHtml = \`<img src="\${l.avatarSrc}" class="avatar" loading="lazy">\`;
                        const bodyStyle = l.bodyColor ? \`style="color: \${l.bodyColor}"\` : '';
                        return \`<div class="message"><div class="avatar-column">\${avatarHtml}</div><div class="content-column"><div class="msg-header"><span class="username" style="color:\${l.color}">\${escapeHtml(l.name)}</span><span class="timestamp">\${escapeHtml(l.timestamp)}</span></div><div class="msg-body" \${bodyStyle}>\${l.htmlContent}</div></div></div>\`;
                    }).join('');
                    panesHtml += \`<div id="\${tabId}" class="tab-pane \${activeClass}"><div class="chat-header"># \${escapeHtml(tab.name)}</div><div class="scroll-area">\${logsHtml}</div></div>\`;
                });
                tabListEl.innerHTML = buttonsHtml; mainEl.innerHTML = panesHtml;
            });
            function switchTab(id) {
                document.querySelectorAll('.tab-pane').forEach(e => e.classList.remove('active'));
                document.querySelectorAll('.tab-btn').forEach(e => e.classList.remove('active'));
                document.getElementById(id).classList.add('active');
                document.getElementById('btn-'+id).classList.add('active');
            }
            function escapeHtml(str) {
                if(!str) return '';
                return str.replace(/[&<>"']/g, function(m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]; });
            }
        `;
        return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titleName} - ${dateStr}</title><style>${css}</style></head><body><div class="sidebar"><div class="sidebar-header">${titleName}</div><div class="tab-list" id="tab-list"></div></div><div class="main" id="main-content"></div><script>window.CCFOLIA_LOG_DATA = [];</script>${scriptTagsHtml}<script>${script}</script></body></html>`;
    }

    // ==========================================
    // UI Handling
    // ==========================================
    function showModal() {
        const existing = document.getElementById('ccfolia-export-modal');
        if (existing) existing.remove();
        const tabs = getTabElements();
        const roomName = getRoomName();

        const modal = document.createElement('div');
        modal.id = 'ccfolia-export-modal';
        let listHtml = '';
        if(tabs.length === 0) listHtml = '<div style="color:#aaa; text-align:center;">タブが見つかりません（Mainタブを保存します）</div>';
        else tabs.forEach((t, i) => listHtml += `<label class="ccfolia-list-item"><input type="checkbox" value="${i}" checked><span>${t.innerText || 'タブ'+(i+1)}</span></label>`);

        modal.innerHTML = `
            <div class="ccfolia-modal-content">
                <div class="ccfolia-modal-header">${roomName} - ログ保存</div>
                <div class="ccfolia-toolbar">
                    <span id="btn-select-all" class="ccfolia-link">全選択</span>
                    <span id="btn-deselect-all" class="ccfolia-link">全解除</span>
                </div>
                <div class="ccfolia-list-container">${listHtml}</div>
                <div class="ccfolia-status-box" id="ccfolia-export-status">待機中...</div>
                <div class="ccfolia-footer">
                    <button class="ccfolia-btn ccfolia-btn-secondary" id="ccfolia-cancel-btn">キャンセル</button>
                    <button class="ccfolia-btn ccfolia-btn-primary" id="ccfolia-exec-btn">ZIP保存開始</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 共通で使用するImageRegistry（チャットアイコン・画像用）
        const imageRegistry = new ImageRegistry();

        const cancelBtn = document.getElementById('ccfolia-cancel-btn');
        const execBtn = document.getElementById('ccfolia-exec-btn');

        cancelBtn.onclick = () => modal.remove();
        document.getElementById('btn-select-all').onclick = () => modal.querySelectorAll('.ccfolia-list-container input').forEach(c => c.checked = true);
        document.getElementById('btn-deselect-all').onclick = () => modal.querySelectorAll('.ccfolia-list-container input').forEach(c => c.checked = false);

        execBtn.onclick = async () => {
            const statusEl = document.getElementById('ccfolia-export-status');
            const checks = modal.querySelectorAll('.ccfolia-list-container input:checked');
            const indices = Array.from(checks).map(c => parseInt(c.value));

            spoofVisibility();
            execBtn.disabled = true;
            cancelBtn.style.display = 'none';

            const results = [];

            try {
                // ==========================================
                // ログの保存
                // ==========================================
                if (indices.length > 0) {
                    for (let idx of indices) {
                        const t = tabs[idx];
                        const name = t.innerText || `Tab ${idx}`;
                        const logs = await processTab(name, t, statusEl, imageRegistry);
                        results.push({ name, logs });
                    }
                }

                // ==========================================
                // ZIP生成・ダウンロード
                // ==========================================
                const hasLogs = results.some(r => r.logs.length > 0);

                if (hasLogs) {
                    statusEl.textContent = "画像をWebP変換・ダウンロード中...";
                    await imageRegistry.fetchAll((current, total) => {
                        statusEl.textContent = `画像をダウンロード中... (${current}/${total})`;
                    });

                    statusEl.textContent = "ZIPファイルを生成中...";
                    const zip = new JSZip();
                    const logsFolder = zip.folder("logs");
                    const scriptTags = [];

                    results.forEach((tabData, index) => {
                        const processedTab = processOneTabLogs(tabData, imageRegistry);
                        const jsContent = `window.CCFOLIA_LOG_DATA.push(${JSON.stringify(processedTab)});`;
                        const fileName = `log_${index}.js`;
                        logsFolder.file(fileName, jsContent);
                        scriptTags.push(`<script src="logs/${fileName}"></script>`);
                    });

                    const html = generateViewerHTML(roomName, scriptTags);
                    zip.file("index.html", html);
                    imageRegistry.addToZip(zip);

                    const zipBlob = await zip.generateAsync({type:"blob"});
                    const url = URL.createObjectURL(zipBlob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${roomName}_log_${Date.now()}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    statusEl.textContent = "完了！";
                    setTimeout(() => modal.remove(), 2000);
                } else {
                    statusEl.textContent = "対象が選択されていません。";
                    execBtn.disabled = false;
                    cancelBtn.style.display = 'block';
                }
            } catch(e) {
                console.error(e);
                statusEl.textContent = "エラー: " + e.message;
                execBtn.disabled = false;
                cancelBtn.style.display = 'block';
            }
        };
    }

    function init() {
        createStyles();
        const obs = new MutationObserver(() => {
            if(document.getElementById(CONFIG.BUTTON_ID)) return;
            const menu = document.querySelector('button[aria-label="チャットメニュー"]') || document.querySelector('button[aria-label*="メニュー"]');
            if(menu && menu.parentNode) {
                const b = document.createElement('button');
                b.id = CONFIG.BUTTON_ID;
                b.innerHTML = SAVE_ICON_SVG;
                b.title = "チャットログ保存";
                b.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showModal(); };
                menu.parentNode.insertBefore(b, menu);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }
    init();
})();