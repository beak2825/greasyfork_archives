// ==UserScript==
// @name         Markdown Image Renderer for Google AI Studio
// @namespace    https://rentry.co/3bnuvgwu
// @license      MIT
// @version      5.3
// @description  AI StudioでMarkdown画像が表示できるようになります（:character記法、クリック時に別ウィンドウ対応）
// @author       ForeverPWA
// @match        *://aistudio.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/553022/Markdown%20Image%20Renderer%20for%20Google%20AI%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/553022/Markdown%20Image%20Renderer%20for%20Google%20AI%20Studio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = "🖼️ MIR:";
    console.log(LOG_PREFIX, "v5.3 started");

    // =========================================
    // IndexedDB（image-manager.user.jsと同じDB）
    // =========================================
    const DB_NAME = 'ImageManagerDB';
    const DB_VERSION = 1;

    // キャッシュ: `:character/キャラ名/衣装名/表情名` → { data, mimeType }
    let imageCache = {};
    let cacheReady = false;

    function openDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
        });
    }

    // IndexedDBから全データを読み込んで :character/... 形式でキャッシュ
    async function loadImageCache() {
        try {
            const db = await openDB();

            // キャラクター一覧
            const characters = await getAll(db, 'characters');
            // 衣装一覧
            const outfits = await getAll(db, 'outfits');
            // 画像一覧
            const images = await getAll(db, 'characterImages');

            db.close();

            // キャラクターIDマップ
            const charMap = {};
            characters.forEach(c => { charMap[c.id] = c.name; });

            // 衣装IDマップ (outfitId → { charName, outfitName })
            const outfitMap = {};
            outfits.forEach(o => {
                outfitMap[o.id] = {
                    charName: charMap[o.characterId] || 'unknown',
                    outfitName: o.name
                };
            });

            // 画像をキャッシュに登録
            images.forEach(img => {
                const outfit = outfitMap[img.outfitId];
                if (outfit) {
                    const key = `:character/${outfit.charName}/${outfit.outfitName}/${img.name}`;
                    imageCache[key] = {
                        data: img.data,  // base64文字列
                        mimeType: img.mimeType
                    };
                }
            });

            cacheReady = true;
            console.log(LOG_PREFIX, `Loaded ${images.length} images, cache keys:`, Object.keys(imageCache).slice(0, 5));
        } catch (e) {
            console.warn(LOG_PREFIX, "IndexedDB error:", e);
            cacheReady = true;
        }
    }

    function getAll(db, storeName) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    // =========================================
    // URL画像取得（従来通り）
    // =========================================
    function fetchImageAsBlob(url, callback) {
        if (url.startsWith(window.location.origin) || url.startsWith('/')) {
            fetch(url)
                .then(r => r.ok ? r.blob() : Promise.reject())
                .then(callback)
                .catch(() => callback(null));
            return;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: (r) => callback(r.status >= 200 && r.status < 300 ? r.response : null),
            onerror: () => callback(null)
        });
    }

    // =========================================
    // pre要素処理
    // =========================================
    function processPreElement(pre) {
        if (pre.dataset.mir) return;

        const text = pre.textContent || '';
        const match = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (!match) return;

        const [, alt, src] = match;
        pre.dataset.mir = '1';

        // :character/パスの場合 → キャッシュから取得
        if (src.startsWith(':character/')) {
            if (!cacheReady) return;

            // 拡張子なしで検索
            const pathNoExt = src.replace(/\.[^/.]+$/, '');
            const imgData = imageCache[pathNoExt] || imageCache[src];

            if (imgData) {
                console.log(LOG_PREFIX, `✓ Found: ${src}`);

                const img = document.createElement('img');
                // data は既にbase64文字列
                img.src = imgData.data;
                img.alt = alt || src;
                img.style.cssText = "max-width:100%;height:auto;display:block;margin:10px 0;border-radius:8px;cursor:pointer;";
                img.title = src;
                img.onclick = () => {
                    // base64の場合はBlobURLに変換して開く
                    if (imgData.data.startsWith('data:')) {
                        try {
                            const [header, base64Data] = imgData.data.split(',');
                            const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/png';
                            const byteCharacters = atob(base64Data);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: mimeType });
                            const blobUrl = URL.createObjectURL(blob);
                            window.open(blobUrl, 'imagePreviewWindow');
                        } catch (err) {
                            console.error(LOG_PREFIX, '画像を開けませんでした:', err);
                        }
                    } else {
                        window.open(imgData.data, 'imagePreviewWindow');
                    }
                };

                pre.style.display = 'none';
                pre.parentNode?.insertBefore(img, pre.nextSibling);
            } else {
                console.log(LOG_PREFIX, `✗ Not found: ${src} (keys: ${Object.keys(imageCache).length})`);
            }
            return;
        }

        // URL画像の場合 → 従来通りfetch
        console.log(LOG_PREFIX, `Fetch: ${src}`);

        const img = document.createElement('img');
        img.alt = alt || 'Loading...';
        img.style.cssText = "max-width:100%;height:auto;display:block;margin:10px 0;border-radius:8px;background:#f0f0f0;min-height:50px;cursor:pointer;";
        img.title = src;
        img.onclick = () => window.open(src, 'imagePreviewWindow');

        pre.style.display = 'none';
        pre.parentNode?.insertBefore(img, pre.nextSibling);

        fetchImageAsBlob(src, (blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                img.src = url;
                img.alt = alt;
                img.onload = () => URL.revokeObjectURL(url);
            } else {
                img.alt = `[Failed] ${alt}`;
                img.style.border = "2px dashed #d93025";
            }
        });
    }

    function scan() {
        document.querySelectorAll('ms-chat-turn pre, .prompt-textarea pre').forEach(processPreElement);
    }

    // =========================================
    // 初期化
    // =========================================
    let timer = null;
    new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(scan, 300);
    }).observe(document.body, { childList: true, subtree: true });

    loadImageCache().then(() => {
        setTimeout(scan, 500);
    });

})();