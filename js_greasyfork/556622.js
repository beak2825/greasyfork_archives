// ==UserScript==
// @name         雀魂リソース置き換えツール
// @namespace    torokesou
// @author       torokesou
// @version      2.0.0
// @description  雀魂の画像・音声を置き換えるModツール。
// @match        https://game.mahjongsoul.com/*
// @match        https://*.mahjongsoul.com/*
// @license      MIT
// @icon         https://play-lh.googleusercontent.com/wkDkKPpHGk5xQl6BjraYNxJ5Wj5mirCP9mnbQpoeAjcxye5oB8l-vo9i2UQfFmsW54c
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556622/%E9%9B%80%E9%AD%82%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E7%BD%AE%E3%81%8D%E6%8F%9B%E3%81%88%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/556622/%E9%9B%80%E9%AD%82%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E7%BD%AE%E3%81%8D%E6%8F%9B%E3%81%88%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class AudioResourceTracker {
        constructor() {
            this.sizeToUrlMap = new Map();
            this.hashToUrlMap = new Map();
        }

        registerBySize(size, url) {
            if (!this.sizeToUrlMap.has(size)) {
                this.sizeToUrlMap.set(size, []);
            }
            const urls = this.sizeToUrlMap.get(size);
            if (!urls.includes(url)) {
                urls.push(url);
            }
        }

        async computeHash(arrayBuffer) {
            try {
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                return Array.from(new Uint8Array(hashBuffer))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('')
                    .slice(0, 16);
            } catch (e) {
                return null;
            }
        }

        async registerByHash(arrayBuffer, url) {
            const hash = await this.computeHash(arrayBuffer);
            if (hash) {
                this.hashToUrlMap.set(hash, url);
                return hash;
            }
            return null;
        }

        getUrlsBySize(size) {
            return this.sizeToUrlMap.get(size) || [];
        }

        getUrlByHash(hash) {
            return this.hashToUrlMap.get(hash);
        }

        generateKey(size, hash = null) {
            if (hash) {
                return `AUDIO_${size}_${hash}`;
            }
            return `AUDIO_SIZE_${size}`;
        }
    }

    class BlobRegistry {
        constructor() {
            this.registry = new Map();
            this.cleanupInterval = 60000;
            this.startCleanup();
        }

        register(url, blob) {
            this.registry.set(url, {
                size: blob.size,
                type: blob.type,
                timestamp: Date.now()
            });
        }

        get(url) {
            return this.registry.get(url);
        }

        startCleanup() {
            setInterval(() => {
                const now = Date.now();
                const timeout = 300000;
                for (const [url, info] of this.registry.entries()) {
                    if (now - info.timestamp > timeout) {
                        this.registry.delete(url);
                    }
                }
            }, this.cleanupInterval);
        }

        generateKey(size, type) {
            const typePrefix = type.startsWith('audio') ? 'AUDIO' : 'IMAGE';
            return `BLOB_${typePrefix}_${size}`;
        }
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    const audioTracker = new AudioResourceTracker();
    const blobRegistry = new BlobRegistry();
    let currentAudio = null;
    let replacements = GM_getValue('replacements', {});
    let capturedResources = [];
    let favorites = GM_getValue('favorites', []);
    let selectedSourceUrl = null;
    let selectedSourceKey = null;
    let replacedUrls = new Set();
    let currentFilter = '';
    let currentTypeFilter = 'all';
    let showFavoritesOnly = false;
    let displayLimit = 100;

    for (const [key, value] of Object.entries(replacements)) {
        if (typeof value === 'string') {
            replacements[key] = { newUrl: value, enabled: true, id: generateId(), oldUrl: key };
        } else if (!value.id) {
            value.id = generateId();
            value.oldUrl = key;
        }
        replacedUrls.add(replacements[key].newUrl);
    }
    GM_setValue('replacements', replacements);

    function toggleFavorite(url) {
        const index = favorites.indexOf(url);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(url);
        }
        GM_setValue('favorites', favorites);
    }

    function isFavorite(url) {
        return favorites.includes(url);
    }

    function playAudioInPanel(url) {
        const player = document.getElementById('mjs-panel-player');
        if (!player) return;
        player.style.display = 'block';
        const audio = player.querySelector('audio');
        if (audio) {
            audio.src = url;
            audio.volume = 0.5;
            audio.play().catch(e => {
                updateStatus('音声再生エラー: ' + e.message, 'error');
            });
            currentAudio = audio;
        }
    }

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._mjs_url = url;
        if (url) {
            captureResourceUrl(url);
        }
        originalXHROpen.apply(this, arguments);
    };

    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', async () => {
            if (this._mjs_url) {
                captureResourceUrl(this._mjs_url);
            }
            if (this.response && this.response instanceof ArrayBuffer) {
                if (this._mjs_url) {
                    const size = this.response.byteLength;
                    audioTracker.registerBySize(size, this._mjs_url);
                    await audioTracker.registerByHash(this.response, this._mjs_url);
                }
            }
        });
        originalXHRSend.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url);
        if (url) {
            captureResourceUrl(url);
        }
        return originalFetch.apply(this, args);
    };

    const originalDecodeAudioData = AudioContext.prototype.decodeAudioData;
    AudioContext.prototype.decodeAudioData = function(audioData, successCallback, errorCallback) {
        const size = audioData.byteLength;
        const processReplacement = async () => {
            const hash = await audioTracker.computeHash(audioData);
            let key = null;
            let replacementData = null;
            if (hash) {
                const url = audioTracker.getUrlByHash(hash);
                if (url) {
                    key = audioTracker.generateKey(size, hash);
                    captureResourceUrl(key, url);
                    replacementData = getReplacementUrl(key);
                    if (!replacementData) {
                        replacementData = getReplacementUrl(url);
                    }
                }
            }
            if (!replacementData) {
                const urls = audioTracker.getUrlsBySize(size);
                if (urls.length > 0) {
                    const sizeKey = audioTracker.generateKey(size);
                    captureResourceUrl(sizeKey);
                    replacementData = getReplacementUrl(sizeKey);
                    if (!replacementData && urls.length === 1) {
                        replacementData = getReplacementUrl(urls[0]);
                    }
                }
            }
            if (replacementData) {
                try {
                    const response = await fetch(replacementData);
                    const newBuffer = await response.arrayBuffer();
                    return originalDecodeAudioData.call(this, newBuffer, successCallback, errorCallback);
                } catch (e) {
                    updateStatus('音声置き換えエラー: ' + e.message, 'error');
                    return originalDecodeAudioData.call(this, audioData, successCallback, errorCallback);
                }
            }
            return originalDecodeAudioData.call(this, audioData, successCallback, errorCallback);
        };
        return processReplacement();
    };

    const originalCreateObjectURL = window.URL.createObjectURL;
    window.URL.createObjectURL = function(obj) {
        const url = originalCreateObjectURL.call(window.URL, obj);
        if (obj instanceof Blob) {
            blobRegistry.register(url, obj);
        }
        return url;
    };

    function getResourceType(url) {
        if (!url) return 'unknown';
        if (url.startsWith('AUDIO_SIZE_') || url.startsWith('AUDIO_')) return 'audio';
        if (url.startsWith('BLOB_AUDIO_')) return 'audio';
        if (url.startsWith('BLOB_IMAGE_')) return 'image';
        if (url.startsWith('data:audio')) return 'audio';
        if (url.startsWith('data:image')) return 'image';
        if (url.startsWith('blob:')) {
            const info = blobRegistry.get(url);
            if (info && info.type.startsWith('audio')) return 'audio';
            if (info && info.type.startsWith('image')) return 'image';
            return 'unknown';
        }
        const lower = url.toLowerCase();
        if (lower.match(/\.(mp3|wav|ogg|m4a|aac|flac|webm|opus)(\?|$|#)/)) return 'audio';
        if (lower.match(/\.(png|jpg|jpeg|webp|gif|bmp|svg|ico)(\?|$|#)/)) return 'image';
        if (lower.includes('/audio/') || lower.includes('/sound/') || lower.includes('/music/') || lower.includes('/voice/') || lower.includes('/bgm/') || lower.includes('/se/') || lower.includes('/sfx/')) return 'audio';
        if (lower.includes('/image/') || lower.includes('/img/') || lower.includes('/picture/') || lower.includes('/photo/') || lower.includes('/sprite/') || lower.includes('/texture/')) return 'image';
        return 'unknown';
    }

    function getReplacementUrl(key) {
        const enabledRules = Object.values(replacements).filter(rule => rule.enabled && rule.oldUrl && key.includes(rule.oldUrl));
        if (enabledRules.length > 0) {
            const rule = enabledRules[0];
            replacedUrls.add(rule.newUrl);
            return rule.newUrl;
        }
        return null;
    }

    function updateStatus(text, type = 'success') {
        const statusEl = document.getElementById('mjs-status-text');
        if (statusEl) {
            statusEl.textContent = text;
            const statusDiv = document.getElementById('mjs-status');
            if (statusDiv) {
                statusDiv.style.background = type === 'success' ? '#e8f5e9' : '#ffebee';
                statusDiv.style.borderColor = type === 'success' ? '#4CAF50' : '#f44336';
            }
        }
    }

    function createPreviewElement(url, type, displayUrl = null) {
        const actualUrl = displayUrl || url;
        if (url.startsWith('AUDIO_SIZE_') || url.startsWith('AUDIO_')) {
            return `<div style="width:150px;height:100px;background:#e3f2fd;display:flex;align-items:center;justify-content:center;border:2px solid #2196F3;border-radius:4px;margin:5px auto;color:#1976D2;font-size:11px;text-align:center;font-weight:bold;">🎵 WebAudio<br><span style="font-size:9px;color:#666;">(プレビュー不可)</span></div>`;
        }
        if (type === 'audio') {
            return `<audio controls src="${actualUrl}" style="width:180px; margin:10px auto; display:block;" class="mjs-no-replace"></audio>`;
        } else if (type === 'image') {
            return `<div style="position:relative;display:inline-block;"><div class="mjs-fallback-icon" style="display:none;width:150px;height:150px;background:#f5f5f5;align-items:center;justify-content:center;border:1px solid #ddd;color:#999;font-size:11px;border-radius:4px;">画像読込失敗</div><img src="${actualUrl}" onerror="this.style.display='none';this.previousElementSibling.style.display='flex';" class="mjs-preview-img" data-url="${actualUrl}" style="max-width:150px;max-height:150px;display:block;margin:0 auto;cursor:pointer;border-radius:4px;"></div>`;
        }
        return `<div style="width:150px;height:100px;background:#fafafa;display:flex;align-items:center;justify-content:center;border:1px solid #ddd;border-radius:4px;color:#999;">プレビューなし</div>`;
    }

    function updatePreview() {
        const previewArea = document.getElementById('mjs-preview-area');
        const oldUrlInput = document.getElementById('mjs-old');
        const oldVal = oldUrlInput.value.trim();
        const newUrl = document.getElementById('mjs-new').value.trim();
        const file = document.getElementById('mjs-file').files[0];
        if (!previewArea) return;
        if (oldVal || newUrl || file) {
            previewArea.className = 'mjs-preview-area active';
            let previewHtml = '<div class="mjs-preview-container">';
            if (oldVal) {
                const type = getResourceType(oldVal);
                const displayUrl = selectedSourceUrl || oldVal;
                previewHtml += `<div class="mjs-preview-box"><div class="label">置き換え前</div>${createPreviewElement(oldVal, type, displayUrl)}</div><div class="mjs-arrow">→</div>`;
            }
            if (file) {
                const isAudio = file.type.startsWith('audio');
                const reader = new FileReader();
                reader.onload = e => {
                    const container = document.querySelector('.mjs-preview-area .mjs-preview-box:last-child .mjs-preview-content');
                    if (container) {
                        if (isAudio) {
                            container.innerHTML = `<audio controls src="${e.target.result}" style="width:180px;" class="mjs-no-replace"></audio>`;
                        } else {
                            container.innerHTML = `<img src="${e.target.result}" class="mjs-preview-img" data-url="${e.target.result}" style="max-width:150px;max-height:150px;cursor:pointer;border-radius:4px;">`;
                            const img = container.querySelector('img');
                            img.addEventListener('click', function() { showModal(this.getAttribute('data-url')); });
                        }
                    }
                };
                reader.readAsDataURL(file);
                previewHtml += `<div class="mjs-preview-box"><div class="label">置き換え後</div><div class="mjs-preview-content"><div style="color:#999;font-style:italic;">読込中...</div></div></div>`;
            } else if (newUrl) {
                const type = getResourceType(newUrl);
                previewHtml += `<div class="mjs-preview-box"><div class="label">置き換え後</div><div class="mjs-preview-content">${createPreviewElement(newUrl, type)}</div></div>`;
            }
            previewHtml += '</div>';
            previewArea.innerHTML = previewHtml;
            const previewImgs = previewArea.querySelectorAll('.mjs-preview-img');
            previewImgs.forEach(img => {
                const dataUrl = img.getAttribute('data-url');
                if (dataUrl) {
                    img.addEventListener('click', function() {
                        showModal(dataUrl);
                    });
                }
            });
        } else {
            previewArea.className = 'mjs-preview-area';
            previewArea.innerHTML = '';
        }
    }

    function replaceUrl(url) {
        if (typeof url !== 'string') return url;
        const matchingRules = Object.values(replacements).filter(rule => rule.enabled && rule.oldUrl && url.includes(rule.oldUrl));
        if (matchingRules.length > 0) {
            const rule = matchingRules[0];
            replacedUrls.add(rule.newUrl);
            return rule.newUrl;
        }
        if (url.startsWith('blob:')) {
            const info = blobRegistry.get(url);
            if (info) {
                const blobKey = blobRegistry.generateKey(info.size, info.type);
                const blobRules = Object.values(replacements).filter(rule => rule.enabled && rule.oldUrl === blobKey);
                if (blobRules.length > 0) {
                    replacedUrls.add(blobRules[0].newUrl);
                    return blobRules[0].newUrl;
                }
            }
        }
        return url;
    }

    function captureResourceUrl(url, originalUrl = null) {
        if (!url || typeof url !== 'string') return;
        if (url.startsWith('data:')) return;
        if (url.length > 2000) return;
        if (replacedUrls.has(url)) return;
        if (capturedResources.includes(url)) return;
        const type = getResourceType(url);
        if (type === 'audio' || type === 'image' || url.startsWith('blob:') || url.startsWith('AUDIO_')) {
            capturedResources.push(url);
            return;
        }
        const lower = url.toLowerCase();
        if (lower.includes('.mp3') || lower.includes('.wav') || lower.includes('.ogg') || lower.includes('.m4a') || lower.includes('.aac') || lower.includes('.flac') || lower.includes('.webm') || lower.includes('.opus') || lower.includes('.png') || lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.webp') || lower.includes('.gif') || lower.includes('.bmp')) {
            capturedResources.push(url);
        }
    }

    const imgDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (imgDescriptor && imgDescriptor.set) {
        const originalImgSet = imgDescriptor.set;
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            get: imgDescriptor.get,
            set: function(value) {
                captureResourceUrl(value);
                if (this.classList.contains('mjs-no-replace')) {
                    originalImgSet.call(this, value);
                    return;
                }
                const newValue = replaceUrl(value);
                originalImgSet.call(this, newValue);
            },
            configurable: true,
            enumerable: true
        });
    }

    const mediaDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
    if (mediaDescriptor && mediaDescriptor.set) {
        const originalMediaSet = mediaDescriptor.set;
        Object.defineProperty(HTMLMediaElement.prototype, 'src', {
            get: mediaDescriptor.get,
            set: function(value) {
                captureResourceUrl(value);
                if (this.classList.contains('mjs-no-replace')) {
                    originalMediaSet.call(this, value);
                    return;
                }
                const newValue = replaceUrl(value);
                originalMediaSet.call(this, newValue);
            },
            configurable: true,
            enumerable: true
        });
    }

    function loadExistingResources() {
        try {
            const resources = performance.getEntriesByType('resource');
            resources.forEach(resource => {
                captureResourceUrl(resource.name);
            });
            document.querySelectorAll('img').forEach(img => {
                if (img.src) captureResourceUrl(img.src);
                if (img.currentSrc) captureResourceUrl(img.currentSrc);
            });
            document.querySelectorAll('audio, video').forEach(media => {
                if (media.src) captureResourceUrl(media.src);
                if (media.currentSrc) captureResourceUrl(media.currentSrc);
                media.querySelectorAll('source').forEach(source => {
                    if (source.src) captureResourceUrl(source.src);
                });
            });
        } catch (e) {}
    }

    setTimeout(loadExistingResources, 2000);
    setInterval(loadExistingResources, 10000);
    setInterval(() => {
        const countSpan = document.getElementById('mjs-resource-count');
        if (countSpan && countSpan.textContent != capturedResources.length) {
            countSpan.textContent = capturedResources.length;
        }
    }, 2000);

    GM_addStyle(`.mjs-panel{position:fixed;top:100px;right:20px;background:white;border:2px solid #333;border-radius:8px;z-index:999999;max-width:700px;width:700px;box-shadow:0 4px 20px rgba(0,0,0,0.3);font-family:sans-serif}.mjs-panel *{user-select:text}.mjs-header{background:#333;color:white;padding:10px 15px;border-radius:6px 6px 0 0;cursor:move;display:flex;justify-content:space-between;align-items:center;user-select:none!important}.mjs-header *{user-select:none!important;cursor:move}.mjs-header h2{margin:0;font-size:16px}.mjs-header-buttons{display:flex;gap:5px}.mjs-header-btn{background:rgba(255,255,255,0.2);border:none;color:white;width:24px;height:24px;border-radius:4px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}.mjs-header-btn:hover{background:rgba(255,255,255,0.3)}.mjs-content{max-height:80vh;overflow-y:auto;padding:15px}.mjs-content.minimized{display:none}.mjs-btn{padding:6px 12px;margin:3px;border:none;border-radius:4px;cursor:pointer;font-size:13px;user-select:none!important}.mjs-btn-primary{background:#4CAF50;color:white}.mjs-btn-danger{background:#f44336;color:white}.mjs-btn-secondary{background:#2196F3;color:white}.mjs-btn-info{background:#9C27B0;color:white}.mjs-btn-success{background:#009688;color:white}.mjs-btn-warning{background:#FF9800;color:white}.mjs-btn-small{padding:4px 8px;margin:2px;font-size:11px}.mjs-input{width:100%;padding:6px;margin:5px 0;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:13px}.mjs-rule{background:#f5f5f5;padding:10px;margin:10px 0;border-radius:4px;border:2px solid #4CAF50;position:relative}.mjs-rule.disabled{border-color:#999;opacity:0.6}.mjs-rule-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.mjs-rule-title{display:flex;align-items:center;gap:8px}.mjs-rule-buttons{display:flex;gap:5px}.mjs-rule-images{display:flex;gap:15px;align-items:center}.mjs-rule-image-box{flex:1;text-align:center}.mjs-rule-image-box img{max-width:120px;max-height:120px;border:1px solid #ddd;border-radius:4px;display:block;margin:5px auto;background:#fff;cursor:pointer}.mjs-rule-image-box .label{font-weight:bold;font-size:12px;color:#666;margin-bottom:5px;user-select:none}.mjs-rule-url{font-size:11px;color:#666;word-break:break-all;margin-top:5px;max-height:60px;overflow-y:auto}.mjs-arrow{font-size:24px;color:#4CAF50;user-select:none!important}.mjs-section{margin:15px 0;padding:12px;border:1px solid #ddd;border-radius:4px}.mjs-section h3{margin-top:0;font-size:14px;user-select:none}.mjs-list{max-height:400px;overflow-y:auto;border:1px solid #ddd;padding:8px;margin:8px 0;background:#fafafa}.mjs-item{padding:8px;margin:5px 0;background:white;border-radius:4px;border:1px solid #eee;display:flex;gap:10px;align-items:center;position:relative}.mjs-item:hover{background:#e3f2fd;border-color:#2196F3}.mjs-item.selected{background:#c8e6c9;border:2px solid #4CAF50}.mjs-item.favorited{border-left:4px solid #FF9800}.mjs-item-icon{width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:#e3f2fd;border:2px solid #2196F3;border-radius:4px;flex-shrink:0;cursor:pointer;font-size:20px;text-align:center;color:#1976D2;user-select:none!important;font-weight:bold}.mjs-item-image{width:60px;height:60px;object-fit:contain;border:1px solid #ddd;border-radius:4px;background:#fff;flex-shrink:0;cursor:pointer;user-select:none!important}.mjs-item-url{font-size:11px;word-break:break-all;flex:1;cursor:pointer}.mjs-item-buttons{display:flex;gap:5px;flex-shrink:0;flex-wrap:wrap}.mjs-notice{background:#fff3cd;border:1px solid #ffc107;padding:8px;border-radius:4px;margin:8px 0;font-size:12px}.mjs-warning{background:#ffebee;border:1px solid #f44336;padding:8px;border-radius:4px;margin:8px 0;font-size:12px;color:#c62828}.mjs-status{background:#e8f5e9;border:1px solid #4CAF50;padding:8px;border-radius:4px;margin:8px 0;font-size:12px}.mjs-filter-group{display:flex;gap:5px;align-items:center;margin:5px 0;flex-wrap:wrap}.mjs-filter{flex:1;min-width:150px;padding:6px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:12px}.mjs-type-filter{padding:6px 10px;border:1px solid #ddd;border-radius:4px;font-size:12px;background:white;cursor:pointer}.mjs-loading{color:#999;font-style:italic;user-select:none}.mjs-toggle{position:relative;display:inline-block;width:44px;height:24px;vertical-align:middle;user-select:none!important}.mjs-toggle input{opacity:0;width:0;height:0}.mjs-toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.2s;border-radius:24px;user-select:none!important}.mjs-toggle-slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background-color:white;transition:.2s;border-radius:50%}.mjs-toggle input:checked+.mjs-toggle-slider{background-color:#4CAF50}.mjs-toggle input:checked+.mjs-toggle-slider:before{transform:translateX(20px)}.mjs-mode-banner{background:#9C27B0;color:white;padding:10px;border-radius:4px;margin:10px 0;text-align:center;font-weight:bold;user-select:none}.mjs-preview-area{display:none;margin:10px 0;padding:10px;background:#f5f5f5;border-radius:4px;border:2px solid #4CAF50}.mjs-preview-area.active{display:block}.mjs-preview-container{display:flex;gap:15px;align-items:center;justify-content:center;flex-wrap:wrap}.mjs-preview-box{text-align:center;min-width:150px}.mjs-preview-box .label{font-weight:bold;font-size:12px;color:#666;margin-bottom:5px}.mjs-modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:1000000;align-items:center;justify-content:center}.mjs-modal.active{display:flex}.mjs-modal-content{max-width:90vw;max-height:90vh;position:relative}.mjs-modal-content img{max-width:100%;max-height:90vh;object-fit:contain;border:2px solid white;border-radius:4px}.mjs-modal-close{position:absolute;top:-40px;right:0;background:white;border:none;color:#333;width:32px;height:32px;border-radius:4px;cursor:pointer;font-size:20px;font-weight:bold}.mjs-modal-close:hover{background:#f44336;color:white}.mjs-type-badge{display:inline-block;padding:2px 6px;border-radius:3px;font-size:10px;font-weight:bold;margin-right:5px}.mjs-type-audio{background:#e3f2fd;color:#1976D2}.mjs-type-image{background:#e8f5e9;color:#2e7d32}.mjs-type-blob{background:#fce4ec;color:#c2185b}.mjs-type-webaudio{background:#f3e5f5;color:#7b1fa2}.mjs-panel-player{background:#f5f5f5;border-top:2px solid #ddd;padding:10px;margin-top:15px;border-radius:0 0 6px 6px;display:none}.mjs-panel-player-title{font-size:12px;font-weight:bold;color:#666;margin-bottom:8px}.mjs-show-more{text-align:center;padding:10px;margin:10px 0}.mjs-favorite-btn.active{background:#FF9800!important;color:white!important}`);

    function createPanel() {
        if (!document.body) {
            setTimeout(createPanel, 100);
            return;
        }
        const existing = document.getElementById('mjs-panel');
        if (existing) existing.remove();
        const panel = document.createElement('div');
        panel.id = 'mjs-panel';
        panel.className = 'mjs-panel';
        panel.innerHTML = `<div class="mjs-header" id="mjs-header"><h2>雀魂リソース置き換えツール <span style="font-size: 11px; font-weight: normal; opacity: 0.8;">by torokesou</span></h2><div class="mjs-header-buttons"><button class="mjs-header-btn" id="mjs-minimize" title="最小化">_</button><button class="mjs-header-btn" id="mjs-close" title="閉じる">×</button></div></div><div class="mjs-content" id="mjs-content"><div class="mjs-status" id="mjs-status"><span>ステータス: <span id="mjs-status-text">起動完了</span></span></div><div id="mjs-mode-banner"></div><div class="mjs-section"><h3>登録済みルール (${Object.keys(replacements).length}件)</h3><div id="mjs-rules"></div></div><div class="mjs-section"><h3>記録されたリソース (<span id="mjs-resource-count">${capturedResources.length}</span>件)</h3><div class="mjs-filter-group"><input type="text" class="mjs-filter" id="mjs-filter" placeholder="フィルター (URLの一部を入力)"><select class="mjs-type-filter" id="mjs-type-filter"><option value="all">すべて</option><option value="image">画像のみ</option><option value="audio">音声のみ</option></select><label style="display:flex;align-items:center;gap:5px;white-space:nowrap;"><input type="checkbox" id="mjs-favorites-filter"> お気に入り</label></div><button class="mjs-btn mjs-btn-secondary" id="mjs-refresh">再取得</button><button class="mjs-btn mjs-btn-secondary" id="mjs-clear">クリア</button><div class="mjs-list" id="mjs-list"></div><div id="mjs-show-more" class="mjs-show-more" style="display:none;"><button class="mjs-btn mjs-btn-secondary">さらに表示 (残り <span id="mjs-remaining-count">0</span>件)</button></div></div><div class="mjs-section"><h3>新規ルール追加</h3><div id="mjs-preview-area"></div><label>置き換え前のリソース:</label><div style="display: flex; gap: 5px;"><input type="text" class="mjs-input" id="mjs-old" placeholder="リストから選択または手動入力" style="flex: 1;" readonly><button class="mjs-btn mjs-btn-secondary" id="mjs-clear-old" style="padding: 6px 12px;">クリア</button></div><label>置き換え後のURL:</label><div style="display: flex; gap: 5px;"><input type="text" class="mjs-input" id="mjs-new" placeholder="https://example.com/sound.mp3 または画像URL" style="flex: 1;"><button class="mjs-btn mjs-btn-secondary" id="mjs-clear-new" style="padding: 6px 12px;">クリア</button></div><label>またはローカルファイル:</label><div style="display: flex; gap: 5px; align-items: center;"><input type="file" class="mjs-input" id="mjs-file" accept="image/*,audio/*" style="flex: 1;"><button class="mjs-btn mjs-btn-secondary" id="mjs-clear-file" style="padding: 6px 12px;">クリア</button></div><div id="mjs-add-warning" style="display:none;" class="mjs-warning"></div><div style="margin-top: 10px;"><button class="mjs-btn mjs-btn-primary" id="mjs-add">追加</button><button class="mjs-btn mjs-btn-secondary" id="mjs-reset">リセット</button></div></div><div class="mjs-panel-player" id="mjs-panel-player"><div class="mjs-panel-player-title">音声プレイヤー</div><audio controls style="width:100%;" class="mjs-no-replace"></audio></div><div style="text-align:right; margin-top:15px;"><button class="mjs-btn mjs-btn-primary" id="mjs-apply" style="margin-right: 10px;">保存して適用 (リロード)</button><button class="mjs-btn mjs-btn-danger" id="mjs-clearall">全削除</button></div></div>`;
        document.body.appendChild(panel);
        const modal = document.createElement('div');
        modal.id = 'mjs-modal';
        modal.className = 'mjs-modal';
        modal.innerHTML = `<div class="mjs-modal-content"><button class="mjs-modal-close">×</button><img id="mjs-modal-img" src="" class="mjs-no-replace"></div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'mjs-modal-close') {
                modal.classList.remove('active');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
        let isDragging = false;
        let offsetX, offsetY;
        const header = document.getElementById('mjs-header');
        header.addEventListener('mousedown', e => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => { isDragging = false; });
        let isMinimized = false;
        document.getElementById('mjs-minimize').onclick = () => {
            isMinimized = !isMinimized;
            const content = document.getElementById('mjs-content');
            content.classList.toggle('minimized', isMinimized);
            document.getElementById('mjs-minimize').textContent = isMinimized ? '□' : '_';
        };
        document.getElementById('mjs-close').onclick = () => panel.remove();
        document.getElementById('mjs-refresh').onclick = () => {
            loadExistingResources();
            displayLimit = 100;
            updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
            updateStatus('リソースを再取得しました', 'success');
        };
        document.getElementById('mjs-clear').onclick = () => {
            if (confirm('記録されたリストをクリアしますか？')) {
                capturedResources = [];
                displayLimit = 100;
                updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
                updateStatus('リストをクリアしました', 'success');
            }
        };
        document.getElementById('mjs-add').onclick = add;
        document.getElementById('mjs-reset').onclick = resetSelection;
        document.getElementById('mjs-apply').onclick = () => {
            GM_setValue('replacements', replacements);
            updateStatus('保存しました。リロード中...', 'success');
            setTimeout(() => location.reload(), 500);
        };
        document.getElementById('mjs-clearall').onclick = clearAll;
        document.getElementById('mjs-clear-old').onclick = () => {
            document.getElementById('mjs-old').value = '';
            selectedSourceUrl = null;
            selectedSourceKey = null;
            updateModeBanner();
            updatePreview();
            updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
        };
        document.getElementById('mjs-clear-new').onclick = () => {
            document.getElementById('mjs-new').value = '';
            updatePreview();
        };
        document.getElementById('mjs-clear-file').onclick = () => {
            document.getElementById('mjs-file').value = '';
            updatePreview();
        };
        document.getElementById('mjs-filter').addEventListener('input', e => {
            currentFilter = e.target.value;
            displayLimit = 100;
            updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
        });
        document.getElementById('mjs-type-filter').addEventListener('change', e => {
            currentTypeFilter = e.target.value;
            displayLimit = 100;
            updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
        });
        document.getElementById('mjs-favorites-filter').addEventListener('change', e => {
            showFavoritesOnly = e.target.checked;
            displayLimit = 100;
            updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
        });
        document.getElementById('mjs-old').addEventListener('input', updatePreview);
        document.getElementById('mjs-new').addEventListener('input', updatePreview);
        document.getElementById('mjs-file').addEventListener('change', updatePreview);
        updateRules();
        updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
        updateModeBanner();
        updateStatus(`${capturedResources.length}件のリソースを監視中`, 'success');
    }

    function updateModeBanner() {
        const banner = document.getElementById('mjs-mode-banner');
        if (!banner) return;
        if (selectedSourceUrl) {
            let displayUrl = selectedSourceUrl;
            let typeInfo = '';
            if (selectedSourceUrl.startsWith('blob:')) {
                const info = blobRegistry.get(selectedSourceUrl);
                const typeLabel = (info && info.type.startsWith('audio')) ? '音声Blob' : '画像Blob';
                displayUrl = `${typeLabel} (${info ? info.size : '不明'} bytes)`;
                typeInfo = '<span class="mjs-type-badge mjs-type-blob">BLOB</span>';
            } else if (selectedSourceUrl.startsWith('AUDIO_SIZE_')) {
                displayUrl = `WebAudio (${selectedSourceUrl.replace('AUDIO_SIZE_', '')} bytes)`;
                typeInfo = '<span class="mjs-type-badge mjs-type-webaudio">WebAudio</span>';
            } else if (selectedSourceUrl.startsWith('AUDIO_')) {
                const parts = selectedSourceUrl.split('_');
                displayUrl = `WebAudio (${parts[1]} bytes, Hash: ${parts[2]})`;
                typeInfo = '<span class="mjs-type-badge mjs-type-webaudio">WebAudio+</span>';
            }
            banner.innerHTML = `${typeInfo}選択中: <span style="font-size:11px;">${displayUrl}</span><br>置き換え後のファイルを選択してください`;
            banner.style.display = 'block';
        } else {
            banner.style.display = 'none';
        }
    }

    function resetSelection() {
        selectedSourceUrl = null;
        selectedSourceKey = null;
        currentFilter = '';
        currentTypeFilter = 'all';
        document.getElementById('mjs-old').value = '';
        document.getElementById('mjs-new').value = '';
        document.getElementById('mjs-file').value = '';
        const filterEl = document.getElementById('mjs-filter');
        if (filterEl) filterEl.value = '';
        const typeFilterEl = document.getElementById('mjs-type-filter');
        if (typeFilterEl) typeFilterEl.value = 'all';
        const warningEl = document.getElementById('mjs-add-warning');
        if (warningEl) warningEl.style.display = 'none';
        updateModeBanner();
        updatePreview();
        displayLimit = 100;
        updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
        updateStatus('選択をリセットしました', 'success');
    }

    function updateRules() {
        const el = document.getElementById('mjs-rules');
        if (!el) return;
        if (Object.keys(replacements).length === 0) {
            el.innerHTML = '<p style="color:#999;">ルールなし</p>';
            return;
        }
        el.innerHTML = '';
        const groupedRules = {};
        for (const [ruleId, data] of Object.entries(replacements)) {
            const oldUrl = data.oldUrl || ruleId;
            if (!groupedRules[oldUrl]) {
                groupedRules[oldUrl] = [];
            }
            groupedRules[oldUrl].push({ id: ruleId, ...data });
        }
        for (const [oldUrl, rules] of Object.entries(groupedRules)) {
            const isBlobRule = oldUrl.startsWith('BLOB_');
            const isAudioRule = oldUrl.startsWith('AUDIO_');
            let displayOld = oldUrl;
            let oldPreviewHtml = '';
            let typeBadge = '';
            if (isBlobRule) {
                const parts = oldUrl.split('_');
                const blobType = parts[1];
                const size = parts.slice(2).join('_');
                displayOld = `Blob${blobType === 'AUDIO' ? '音声' : '画像'} (${size} bytes)`;
                typeBadge = '<span class="mjs-type-badge mjs-type-blob">BLOB</span>';
                oldPreviewHtml = `<div style="width:120px;height:100px;background:#fce4ec;display:flex;align-items:center;justify-content:center;margin:5px auto;font-size:11px;color:#c2185b;border:2px solid #f06292;border-radius:4px;font-weight:bold;">🔗 Blob<br>(期限切れ)</div>`;
            } else if (isAudioRule) {
                const parts = oldUrl.split('_');
                if (parts.length > 3) {
                    displayOld = `WebAudio+ (${parts[1]} bytes, ${parts[2].slice(0, 8)}...)`;
                    typeBadge = '<span class="mjs-type-badge mjs-type-webaudio">WebAudio+</span>';
                } else {
                    displayOld = `WebAudio (${parts[2]} bytes)`;
                    typeBadge = '<span class="mjs-type-badge mjs-type-webaudio">WebAudio</span>';
                }
                oldPreviewHtml = `<div style="width:120px;height:100px;background:#f3e5f5;display:flex;align-items:center;justify-content:center;margin:5px auto;font-size:11px;color:#7b1fa2;border:2px solid #ba68c8;border-radius:4px;font-weight:bold;">🎵 WebAudio<br>(プレビュー不可)</div>`;
            } else {
                const type = getResourceType(oldUrl);
                if (type === 'audio') {
                    typeBadge = '<span class="mjs-type-badge mjs-type-audio">AUDIO</span>';
                    oldPreviewHtml = `<audio controls src="${oldUrl}" style="width:120px;margin:10px auto;display:block;" class="mjs-no-replace"></audio>`;
                } else {
                    typeBadge = '<span class="mjs-type-badge mjs-type-image">IMAGE</span>';
                    oldPreviewHtml = `<img src="${oldUrl}" onerror="this.style.display='none';" class="mjs-rule-img" data-url="${oldUrl}" style="max-width:120px;max-height:120px;cursor:pointer;border-radius:4px;">`;
                }
            }
            const groupDiv = document.createElement('div');
            groupDiv.style.marginBottom = '20px';
            const groupHeader = document.createElement('div');
            groupHeader.style.cssText = 'background:#e0e0e0;padding:8px;border-radius:4px;margin-bottom:5px;font-weight:bold;font-size:12px;';
            groupHeader.innerHTML = `${typeBadge} ${displayOld} <span style="color:#666;">(${rules.length}件のルール)</span>`;
            groupDiv.appendChild(groupHeader);
            const previewDiv = document.createElement('div');
            previewDiv.style.cssText = 'text-align:center;margin-bottom:10px;';
            previewDiv.innerHTML = oldPreviewHtml;
            groupDiv.appendChild(previewDiv);
            rules.forEach((rule, index) => {
                const disabledClass = rule.enabled ? '' : 'disabled';
                const newType = getResourceType(rule.newUrl);
                let newPreviewHtml = '';
                if (newType === 'audio') {
                    newPreviewHtml = `<audio controls src="${rule.newUrl}" style="width:120px;margin:5px auto;display:block;" class="mjs-no-replace"></audio>`;
                } else {
                    newPreviewHtml = `<img src="${rule.newUrl}" onerror="this.style.display='none';" class="mjs-rule-img" data-url="${rule.newUrl}" style="max-width:80px;max-height:80px;cursor:pointer;border-radius:4px;">`;
                }
                const ruleDiv = document.createElement('div');
                ruleDiv.className = `mjs-rule ${disabledClass}`;
                ruleDiv.style.marginLeft = '20px';
                ruleDiv.innerHTML = `<div class="mjs-rule-header"><div class="mjs-rule-title"><label class="mjs-toggle"><input type="checkbox" ${rule.enabled ? 'checked' : ''} data-id="${rule.id}" class="mjs-toggle-input"><span class="mjs-toggle-slider"></span></label><strong style="font-size: 12px;">ルール #${index + 1}</strong>${rules.length > 1 && index === 0 ? ' <span style="color:#FF9800;font-size:10px;">(有効)</span>' : ''}</div><div class="mjs-rule-buttons"><button class="mjs-btn mjs-btn-danger mjs-btn-small mjs-delete-btn" data-id="${rule.id}">削除</button></div></div><div style="text-align:center;">${newPreviewHtml}<div class="mjs-rule-url">${rule.newUrl.startsWith('data:') ? '[ローカルデータ]' : rule.newUrl}</div></div>`;
                groupDiv.appendChild(ruleDiv);
                const toggleInput = ruleDiv.querySelector('.mjs-toggle-input');
                toggleInput.addEventListener('change', function() {
                    const id = this.getAttribute('data-id');
                    if (replacements[id]) {
                        const sameOldUrlRules = Object.values(replacements).filter(r => r.oldUrl === replacements[id].oldUrl);
                        if (this.checked && sameOldUrlRules.length > 1) {
                            sameOldUrlRules.forEach(r => {
                                if (r.id !== id) {
                                    const ruleKey = Object.keys(replacements).find(k => replacements[k].id === r.id);
                                    if (ruleKey) replacements[ruleKey].enabled = false;
                                }
                            });
                        }
                        replacements[id].enabled = this.checked;
                        GM_setValue('replacements', replacements);
                        updateRules();
                    }
                });
                const deleteBtn = ruleDiv.querySelector('.mjs-delete-btn');
                deleteBtn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    delete replacements[id];
                    GM_setValue('replacements', replacements);
                    updateRules();
                    updateStatus('ルールを削除しました', 'success');
                });
                const ruleImgs = ruleDiv.querySelectorAll('.mjs-rule-img');
                ruleImgs.forEach(img => {
                    img.addEventListener('click', function() {
                        showModal(this.getAttribute('data-url'));
                    });
                });
            });
            el.appendChild(groupDiv);
        }
    }

    function clearAll() {
        if (confirm('全ルールを削除しますか？')) {
            replacements = {};
            GM_setValue('replacements', replacements);
            updateRules();
            updateStatus('全ルールを削除しました。', 'success');
        }
    }

    function updateList(filterText = '', typeFilter = 'all', favoritesOnly = false) {
        const el = document.getElementById('mjs-list');
        if (!el) return;
        let filtered = capturedResources.filter(url => {
            if (favoritesOnly && !isFavorite(url)) return false;
            if (typeFilter !== 'all') {
                const urlType = getResourceType(url);
                if (urlType !== typeFilter) return false;
            }
            if (!filterText) return true;
            const lower = filterText.toLowerCase();
            if (url.toLowerCase().includes(lower)) return true;
            if (url.startsWith('blob:') && 'blob'.includes(lower)) return true;
            if (url.startsWith('AUDIO_') && ('audio'.includes(lower) || 'webaudio'.includes(lower))) return true;
            return false;
        });
        const showMoreDiv = document.getElementById('mjs-show-more');
        const remainingCount = document.getElementById('mjs-remaining-count');
        if (filtered.length > displayLimit) {
            if (showMoreDiv) {
                showMoreDiv.style.display = 'block';
                if (remainingCount) {
                    remainingCount.textContent = filtered.length - displayLimit;
                }
                const btn = showMoreDiv.querySelector('button');
                if (btn) {
                    btn.onclick = () => {
                        displayLimit += 100;
                        updateList(filterText, typeFilter, favoritesOnly);
                    };
                }
            }
            filtered = filtered.slice(0, displayLimit);
        } else {
            if (showMoreDiv) showMoreDiv.style.display = 'none';
        }
        if (filtered.length === 0) {
            el.innerHTML = '<p style="color:#999;">リソースなし</p>';
            return;
        }
        el.innerHTML = '';
        filtered.forEach(url => {
            const selectedClass = selectedSourceUrl === url ? 'selected' : '';
            const favoritedClass = isFavorite(url) ? 'favorited' : '';
            const isBlob = url.startsWith('blob:');
            const isWebAudio = url.startsWith('AUDIO_');
            const type = getResourceType(url);
            let infoHtml = '';
            let isAudio = false;
            let thumbHtml = '';
            let typeBadge = '';
            if (isBlob) {
                const info = blobRegistry.get(url);
                const blobType = (info && info.type.startsWith('audio')) ? '音声' : '画像';
                if (blobType === '音声') isAudio = true;
                const size = info ? info.size : '不明';
                typeBadge = '<span class="mjs-type-badge mjs-type-blob">BLOB</span>';
                infoHtml = `${typeBadge}<strong>Blob${blobType}</strong> (${size} bytes)`;
                if (blobType === '画像') {
                    thumbHtml = `<div class="mjs-item-icon" style="display:none;background:#fce4ec;color:#c2185b;border-color:#f06292;">📦</div><img class="mjs-item-image" src="${url}" onerror="this.style.display='none'; this.previousElementSibling.style.display='flex';">`;
                } else {
                    thumbHtml = `<div class="mjs-item-icon" style="background:#fce4ec;color:#c2185b;border-color:#f06292;">🎵</div>`;
                }
            } else if (isWebAudio) {
                isAudio = true;
                const parts = url.split('_');
                if (parts.length > 3) {
                    const size = parts[1];
                    const hash = parts[2].slice(0, 8);
                    typeBadge = '<span class="mjs-type-badge mjs-type-webaudio">WebAudio+</span>';
                    infoHtml = `${typeBadge}<strong>WebAudio+</strong> (${size} bytes, ${hash}...)`;
                } else {
                    const size = parts[2];
                    typeBadge = '<span class="mjs-type-badge mjs-type-webaudio">WebAudio</span>';
                    infoHtml = `${typeBadge}<strong>WebAudio</strong> (${size} bytes)`;
                }
                thumbHtml = `<div class="mjs-item-icon" style="background:#f3e5f5;color:#7b1fa2;border-color:#ba68c8;">🎵</div>`;
            } else if (type === 'audio') {
                isAudio = true;
                typeBadge = '<span class="mjs-type-badge mjs-type-audio">AUDIO</span>';
                infoHtml = `${typeBadge}<strong>音声ファイル</strong>`;
                thumbHtml = `<div class="mjs-item-icon">🎵</div>`;
            } else {
                typeBadge = '<span class="mjs-type-badge mjs-type-image">IMAGE</span>';
                infoHtml = `${typeBadge}<strong>画像ファイル</strong>`;
                thumbHtml = `<img class="mjs-item-image" src="${url}" onerror="this.style.display='none';">`;
            }
            let playBtnHtml = '';
            if (isAudio && !isWebAudio) {
                playBtnHtml = `<button class="mjs-btn mjs-btn-success mjs-btn-small mjs-play-btn" data-url="${url}" title="再生">▶</button>`;
            }
            const favoriteIcon = isFavorite(url) ? '★' : '☆';
            const itemDiv = document.createElement('div');
            itemDiv.className = `mjs-item ${selectedClass} ${favoritedClass}`;
            itemDiv.innerHTML = `${thumbHtml}<div class="mjs-item-url">${infoHtml}<br><span style="font-size:10px;color:#999;">${url}</span></div><div class="mjs-item-buttons"><button class="mjs-btn mjs-btn-warning mjs-btn-small mjs-favorite-btn ${isFavorite(url) ? 'active' : ''}" data-url="${url}" title="お気に入り">${favoriteIcon}</button>${playBtnHtml}<button class="mjs-btn mjs-btn-secondary mjs-btn-small mjs-dl-btn" data-url="${url}" title="ダウンロード">DL</button><button class="mjs-btn mjs-btn-info mjs-btn-small mjs-source-btn" data-url="${url}" title="この項目を選択">追加</button></div>`;
            el.appendChild(itemDiv);
            const img = itemDiv.querySelector('.mjs-item-image');
            if (img) {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showModal(url);
                });
            }
            const icon = itemDiv.querySelector('.mjs-item-icon');
            if (icon) {
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    setAsSource(url);
                });
            }
            const urlDiv = itemDiv.querySelector('.mjs-item-url');
            urlDiv.addEventListener('click', () => setAsSource(url));
            const favoriteBtn = itemDiv.querySelector('.mjs-favorite-btn');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const btnUrl = e.target.getAttribute('data-url');
                toggleFavorite(btnUrl);
                updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
            });
            const playBtn = itemDiv.querySelector('.mjs-play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const playUrl = e.target.getAttribute('data-url');
                    playAudioInPanel(playUrl);
                    updateStatus('音声を再生中...', 'success');
                });
            }
            const dlBtn = itemDiv.querySelector('.mjs-dl-btn');
            dlBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const a = document.createElement('a');
                a.href = url;
                let ext = 'dat';
                if (type === 'image') ext = 'png';
                if (type === 'audio') ext = 'mp3';
                if (isBlob) {
                    const info = blobRegistry.get(url);
                    if (info && info.type.includes('/')) {
                        ext = info.type.split('/')[1];
                    }
                }
                a.download = isBlob || isWebAudio ? `resource_${Date.now()}.${ext}` : (url.split('/').pop().split('?')[0] || `file.${ext}`);
                a.click();
            });
            const sourceBtn = itemDiv.querySelector('.mjs-source-btn');
            sourceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setAsSource(url);
            });
        });
        const section = el.closest('.mjs-section');
        if (section) {
            const h3 = section.querySelector('h3');
            const countSpan = document.getElementById('mjs-resource-count');
            if (countSpan) {
                countSpan.textContent = capturedResources.length;
            }
            if (h3) {
                const totalFiltered = capturedResources.filter(url => {
                    if (favoritesOnly && !isFavorite(url)) return false;
                    if (typeFilter !== 'all') {
                        const urlType = getResourceType(url);
                        if (urlType !== typeFilter) return false;
                    }
                    if (!filterText) return true;
                    const lower = filterText.toLowerCase();
                    if (url.toLowerCase().includes(lower)) return true;
                    if (url.startsWith('blob:') && 'blob'.includes(lower)) return true;
                    if (url.startsWith('AUDIO_') && ('audio'.includes(lower) || 'webaudio'.includes(lower))) return true;
                    return false;
                }).length;
                const audioCount = capturedResources.filter(u => getResourceType(u) === 'audio').length;
                const imageCount = capturedResources.filter(u => getResourceType(u) === 'image').length;
                h3.innerHTML = `記録されたリソース (<span id="mjs-resource-count">${capturedResources.length}</span>件) <span style="font-size:11px;color:#666;">- 画像:${imageCount} / 音声:${audioCount}</span>${filterText || typeFilter !== 'all' ? ` / 表示: ${totalFiltered}件` : ''}${favoritesOnly ? ' / お気に入りのみ' : ''}`;
            }
        }
    }

    function setAsSource(url) {
        selectedSourceUrl = url;
        const warningEl = document.getElementById('mjs-add-warning');
        if (url.startsWith('blob:')) {
            const info = blobRegistry.get(url);
            if (info) {
                selectedSourceKey = blobRegistry.generateKey(info.size, info.type);
                document.getElementById('mjs-old').value = selectedSourceKey;
                if (warningEl) {
                    warningEl.innerHTML = '⚠️ <strong>Blob警告:</strong> このリソースは一時的です。ページをリロードすると無効になる可能性があります。';
                    warningEl.style.display = 'block';
                }
            } else {
                selectedSourceKey = url;
                document.getElementById('mjs-old').value = url;
                if (warningEl) {
                    warningEl.innerHTML = '⚠️ <strong>Blob警告:</strong> Blob情報が取得できませんでした。';
                    warningEl.style.display = 'block';
                }
            }
        } else {
            selectedSourceKey = url;
            document.getElementById('mjs-old').value = url;
            if (warningEl) warningEl.style.display = 'none';
        }
        document.getElementById('mjs-new').value = '';
        document.getElementById('mjs-file').value = '';
        updateModeBanner();
        updatePreview();
        updateList(currentFilter, currentTypeFilter, showFavoritesOnly);
    }

    function showModal(url) {
        const modal = document.getElementById('mjs-modal');
        const img = document.getElementById('mjs-modal-img');
        if (modal && img) {
            img.src = url;
            modal.classList.add('active');
        }
    }

    function add() {
        let keyToSave = selectedSourceKey;
        if (!keyToSave) {
            const inputVal = document.getElementById('mjs-old').value.trim();
            if (!inputVal) {
                updateStatus('置き換え元のリソースを選択してください', 'error');
                return;
            }
            keyToSave = inputVal;
        }
        const newUrl = document.getElementById('mjs-new').value.trim();
        const file = document.getElementById('mjs-file').files[0];
        const saveRule = (targetNew) => {
            const ruleId = generateId();
            const existingRules = Object.values(replacements).filter(r => r.oldUrl === keyToSave);
            const newRule = {
                oldUrl: keyToSave,
                newUrl: targetNew,
                enabled: existingRules.length === 0,
                id: ruleId
            };
            if (existingRules.length > 0) {
                existingRules.forEach(r => {
                    const key = Object.keys(replacements).find(k => replacements[k].id === r.id);
                    if (key) replacements[key].enabled = false;
                });
                updateStatus(`同じリソースに複数ルール。新しいルールを有効化しました。`, 'success');
            }
            replacements[ruleId] = newRule;
            replacedUrls.add(targetNew);
            GM_setValue('replacements', replacements);
            updateRules();
            resetSelection();
            if (existingRules.length === 0) {
                updateStatus('ルールを追加しました。「保存して適用」で反映されます。', 'success');
            }
        };
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                saveRule(e.target.result);
            };
            reader.onerror = () => {
                updateStatus('ファイル読み込みエラー', 'error');
            };
            reader.readAsDataURL(file);
        } else if (newUrl) {
            saveRule(newUrl);
        } else {
            updateStatus('置き換え後のリソースを指定してください', 'error');
        }
    }

    GM_registerMenuCommand('リソース置き換え設定を開く', createPanel);
})();