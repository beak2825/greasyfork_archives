// ==UserScript==
// @name         色々サムネイル表示
// @namespace    ワイ
// @version      5.2
// @license	CC0-1.0
// @description  各種画像サイトのリンクをLightboxで表示。
// @match        https://*.open2ch.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/563586/%E8%89%B2%E3%80%85%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/563586/%E8%89%B2%E3%80%85%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    let imageDatabase = new Map();
    let imageCounter = 0;
    let globalEscHandler = null;
 
    // GIFの共通サイズ設定
    const GIF_DISPLAY_SIZE = '300px';
 
    function debugLog(message, data = null) {
        console.log(`[Imgur GIF Debug] ${message}`, data || '');
    }
 
    class ThumbnailCache {
        constructor() {
            this.CACHE_DURATION = 10 * 24 * 60 * 60 * 1000; // 10日間（ミリ秒）
            this.CACHE_PREFIX = 'thumb_cache_';
            this.cleanupOldEntries();
        }
 
        cleanupOldEntries() {
            try {
                const keys = GM_listValues();
                const now = Date.now();
                keys.forEach(key => {
                    if (key.startsWith(this.CACHE_PREFIX)) {
                        try {
                            const data = JSON.parse(GM_getValue(key, '{}'));
                            if (!data.timestamp || (now - data.timestamp) > this.CACHE_DURATION) {
                                GM_deleteValue(key);
                            }
                        } catch (e) {
                            GM_deleteValue(key);
                        }
                    }
                });
            } catch (e) {
                console.warn('Cache cleanup failed:', e);
            }
        }
 
        generateKey(url) {
            let hash = 0;
            for (let i = 0; i < url.length; i++) {
                const char = url.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return this.CACHE_PREFIX + Math.abs(hash).toString(36);
        }
 
        get(url) {
            try {
                const key = this.generateKey(url);
                const cached = GM_getValue(key, null);
                if (!cached) return null;
                const data = JSON.parse(cached);
                if (!data.timestamp || (Date.now() - data.timestamp) > this.CACHE_DURATION) {
                    GM_deleteValue(key);
                    return null;
                }
                // base64データまたはURLを返す
                return data.base64Data || data.imageUrl;
            } catch (e) {
                console.warn('Cache get failed:', e);
                return null;
            }
        }
 
        // 画像本体をbase64で保存
        setWithBase64(url, base64Data) {
            try {
                if (/imgur/i.test(url)) return;
                const key = this.generateKey(url);
                const data = { base64Data: base64Data, timestamp: Date.now(), originalUrl: url };
                GM_setValue(key, JSON.stringify(data));
            } catch (e) {
                console.warn('Cache set failed:', e);
            }
        }
 
        set(url, imageUrl) {
            try {
                if (/imgur/i.test(url)) return;
                const key = this.generateKey(url);
                const data = { imageUrl: imageUrl, timestamp: Date.now(), originalUrl: url };
                GM_setValue(key, JSON.stringify(data));
            } catch (e) {
                console.warn('Cache set failed:', e);
            }
        }
 
        shouldCache(url) {
            return /tadaup\.jp|ul\.h3z\.jp|ibb\.co|postimg\.cc|freeimage\.host|iili\.io|funakamome\.com/i.test(url) && !/imgur/i.test(url);
        }
    }
 
    const thumbnailCache = new ThumbnailCache();
 
    function closeLightbox(e) {
        if (e) e.preventDefault();
        const existingLightbox = document.getElementById('lightbox');
        if (existingLightbox) existingLightbox.remove();
        const existingOverlay = document.getElementById('lightboxOverlay');
        if (existingOverlay) existingOverlay.remove();
        if (globalEscHandler) {
            document.removeEventListener('keydown', globalEscHandler);
            globalEscHandler = null;
        }
    }
 
    function generatePostLink(postNumber) {
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.split('#')[0];
        return `${baseUrl}#${postNumber}`;
    }
 
    function addCustomCSS() {
        if (document.getElementById('custom-lb-styles')) return;
        const style = document.createElement('style');
        style.id = 'custom-lb-styles';
        style.textContent = `
            .lightboxOverlay { position: absolute; top: 0; left: 0; z-index: 99990; background-color: black; opacity: 0.85; display: none; }
            #lightbox { position: absolute; left: 0; width: 100%; z-index: 99991; text-align: center; line-height: 0; font-family: "Lucida Grande", sans-serif; }
            .gm-no-tooltip { position: relative; }
            .gm-no-tooltip::before, .gm-no-tooltip::after { display: none !important; }
            /* 画像表示時の白い枠を完全に消す */
            .gm-media-embed-container,
            .gm-media-embed-container.lp-card,
            a.lp-card.gm-media-embed-container,
            .gm-media-embed-container[class*="lp-"] {
                background: transparent !important;
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                outline: none !important;
            }
            /* 親要素urlタグのスタイルもリセット */
            url:has(.gm-media-embed-container) {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            .gm-imgur-gif-container { display: inline-block; position: relative; }
            .gm-imgur-gif-wrapper { position: relative; display: inline-block; }
            .gm-thumbnail-button {
                position: absolute;
                bottom: 5px;
                right: 5px;
                width: 24px;
                height: 24px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                transition: opacity 0.2s;
                padding: 0;
                line-height: 1;
                z-index: 10;
            }
            .gm-thumbnail-button:hover {
                opacity: 0.7;
                background: rgba(0, 0, 0, 0.9);
            }
            .gm-thumbnail-button:active {
                opacity: 0.5;
            }
            .gm-media-wrapper {
                display: inline-flex;
                align-items: flex-start;
                gap: 10px;
                vertical-align: top;
            }
            .gm-thumbnail-container {
                display: inline-block;
                margin-left: 10px;
                vertical-align: middle;
            }
            .gm-thumbnail-img {
                object-fit: contain;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
            }
            /* 連続画像の横並び表示用 */
            .gm-image-row {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                align-items: flex-start;
                margin: 10px 0;
            }
            .gm-image-row .gm-media-wrapper,
            .gm-image-row .gm-media-embed-container {
                display: inline-flex;
                vertical-align: top;
            }
            /* 取得エラー表示用 */
            .gm-fetch-error {
                color: #cc0000;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }
 
    function showLightbox(imageIndex) {
        const imageData = imageDatabase.get(imageIndex);
        if (!imageData) return;
        const { imageUrl, postNumber, originalUrl } = imageData;
 
        closeLightbox();
 
        const isImgur = /imgur/i.test(originalUrl);
        let serviceName = 'image';
        if (isImgur) serviceName = 'imgur';
        else if (originalUrl.includes('ibb.co')) serviceName = 'img.bb';
        else if (originalUrl.includes('tadaup.jp')) serviceName = 'tadaup';
        else if (originalUrl.includes('ul.h3z.jp')) serviceName = 'h3z.jp';
        else if (originalUrl.includes('postimg.cc')) serviceName = 'postimg.cc';
        else if (originalUrl.includes('freeimage.host') || originalUrl.includes('iili.io')) serviceName = 'freeimage.host';
        else if (originalUrl.includes('funakamome.com')) serviceName = 'funakamome.com';
 
        const overlay = document.createElement('div');
        overlay.id = 'lightboxOverlay';
        overlay.className = 'lightboxOverlay';
        overlay.style.width = '100%';
        overlay.style.height = document.documentElement.scrollHeight + 'px';
        overlay.style.display = 'block';
        document.body.appendChild(overlay);
 
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.style.display = 'none';
 
        let detailsHTML;
        if (isImgur) {
            let board = 'unknown', threadId = '0';
            const urlMatch = window.location.href.match(/test\/read\.cgi\/([^\/]+)\/(\d+)/);
            if (urlMatch) { board = urlMatch[1]; threadId = urlMatch[2]; }
            const pid = `${board}-${threadId}-${postNumber}`;
            const imgurPageUrl = imageUrl.replace(/\.(jpe?g|png|gif)$/i, '');
            const twitterPostUrl = `https://${window.location.hostname}/test/read.cgi/${board}/${threadId}/${postNumber}-`;
            detailsHTML = `
                <div class="lb-details" style="min-width:300px">
                    <span class="lb-caption" style="display: inline; cursor: pointer;">
                        <u class="lb-ank" resnum="${postNumber}" href="#">&gt;&gt;${postNumber}</u>
                    </span>
                    <span class="lb-number" style="">全${imageDatabase.size}件中、${imageIndex}件目</span>
                    <span style="clear: left;display: block;" class="lb-save">
                        <div>
                            <a n="${postNumber}" pid="${pid}" class="lb-korabo-link gm-no-tooltip" href="${imageUrl}"><font size="2" color="white">コラボ</font></a>
                            <a class="lb-icon gm-no-tooltip" href="${imageUrl}"><font size="2" color="white">アイコン</font></a>
                            <a class="lb-search gm-no-tooltip" href="https://lens.google.com/uploadbyurl?hl=ja&url=${encodeURIComponent(imageUrl)}"><font size="2" color="white">画像検索</font></a>
                            <a class="lb-open-link gm-no-tooltip" href="${imageUrl}"><font size="2" color="white">直URL</font></a>
                            <a class="lb-open-link gm-no-tooltip" href="${imgurPageUrl}"><font size="2" color="white">imgur</font></a>
                        </div>
                        <div style="margin-top:5px">
                            <a class="lb-twiter gm-no-tooltip" url="${twitterPostUrl}" href="#"><font size="2" color="white">Twitterに貼る</font></a>
                        </div>
                    </span>
                    <span class="lb-korabo"></span>
                </div>
            `;
        } else {
            detailsHTML = `
                <div class="lb-details" style="min-width:300px">
                    <span class="lb-caption" style="display: inline; cursor: pointer;">
                        <u class="lb-ank" resnum="${postNumber}" href="#">&gt;&gt;${postNumber}</u>
                    </span>
                    <span style="clear: left;display: block;" class="lb-save">
                        <div>
                            <a class="lb-search gm-no-tooltip" href="https://lens.google.com/uploadbyurl?hl=ja&url=${encodeURIComponent(imageUrl)}"><font size="2" color="white">画像検索</font></a>
                            <a class="lb-open-link gm-no-tooltip" href="${imageUrl}"><font size="2" color="white">直URL</font></a>
                            <a class="lb-service-link gm-no-tooltip" href="${originalUrl}"><font size="2" color="white">${serviceName}</font></a>
                        </div>
                    </span>
                    <span class="lb-korabo"></span>
                </div>
            `;
        }
 
        lightbox.innerHTML = `
            <div class="lb-outerContainer">
                <div class="lb-container">
                    <img class="lb-image" src="">
                    <div class="lb-nav">
                        <a class="lb-prev" href=""></a>
                        <a class="lb-next" href=""></a>
                    </div>
                    <div class="lb-loader" style="display: none;"><a class="lb-cancel"></a></div>
                </div>
            </div>
            <div class="lb-dataContainer">
                <div class="lb-data">
                    ${detailsHTML}
                    <div class="lb-closeContainer"><a class="lb-close"></a></div>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
 
        const outerContainer = lightbox.querySelector('.lb-outerContainer');
        const dataContainer = lightbox.querySelector('.lb-dataContainer');
        const imageEl = lightbox.querySelector('.lb-image');
        const prevLink = lightbox.querySelector('.lb-prev');
        const nextLink = lightbox.querySelector('.lb-next');
        const closeButton = lightbox.querySelector('.lb-close');
        const loader = lightbox.querySelector('.lb-loader');
        const ankLink = lightbox.querySelector('.lb-ank');
 
        globalEscHandler = (e) => {
            if (e.key === 'Escape') { closeLightbox(e); }
        };
        document.addEventListener('keydown', globalEscHandler);
 
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });
        ankLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
            window.location.href = generatePostLink(postNumber);
        });
 
        lightbox.addEventListener('click', e => {
            if (e.target.id === 'lightbox') {
                 e.stopPropagation();
                 closeLightbox();
            } else {
                 e.stopPropagation();
            }
        });
 
        lightbox.querySelectorAll('.lb-save a').forEach(a => {
            if (a.href && a.getAttribute('href') !== '#') {
                a.target = '_blank'; a.rel = 'noopener noreferrer';
            }
            a.removeAttribute('title'); a.title = '';
            a.addEventListener('mouseenter', (e) => {
                e.target.removeAttribute('title'); e.target.title = '';
            });
        });
 
        if (imageIndex > 1) {
            prevLink.style.display = 'block';
            prevLink.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showLightbox(imageIndex - 1); };
        } else {
            prevLink.style.display = 'none';
        }
 
        if (imageIndex < imageDatabase.size) {
            nextLink.style.display = 'block';
            nextLink.onclick = (e) => { e.preventDefault(); e.stopPropagation(); showLightbox(imageIndex + 1); };
        } else {
            nextLink.style.display = 'none';
        }
 
        loader.style.display = 'block';
 
        const tempImg = new Image();
        tempImg.onload = function() {
            const maxWidth = document.documentElement.clientWidth * 0.9;
            const maxHeight = document.documentElement.clientHeight * 0.9 - 80;
            let imgWidth = this.naturalWidth; let imgHeight = this.naturalHeight;
            const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);
            imgWidth = Math.round(imgWidth * ratio);
            imgHeight = Math.round(imgHeight * ratio);
            const framePadding = 8;
            outerContainer.style.width = `${imgWidth + framePadding}px`;
            outerContainer.style.height = `${imgHeight + framePadding}px`;
            dataContainer.style.width = `${imgWidth + framePadding}px`;
            imageEl.style.width = `${imgWidth}px`;
            imageEl.style.height = `${imgHeight}px`;
            imageEl.src = imageUrl;
            imageEl.style.display = 'block';
            lightbox.querySelector('.lb-nav').style.display = 'block';
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            let top = scrollTop + (clientHeight - (imgHeight + framePadding + dataContainer.offsetHeight)) / 2;
            if (top < scrollTop + 10) top = scrollTop + 10;
            lightbox.style.top = `${top}px`;
            lightbox.style.left = `0px`;
            loader.style.display = 'none';
            lightbox.style.display = 'block';
        };
        tempImg.onerror = function() {
            loader.textContent = '画像の読み込みに失敗しました。';
            loader.style.color = '#ff8a8a';
            loader.style.display = 'block';
        };
        tempImg.src = imageUrl;
    }
 
    function getPostNumber(element) {
        const postContainerSelectors = [
            'article[id]', 'div.post[id]', 'div[data-res-id]', 'dl[val]',
            'div.thread-post', '.post-container', '.message',
        ];
        const postBlock = element.closest(postContainerSelectors.join(', '));
        if (postBlock) {
            const dataAttributes = ['data-res-id', 'data-res', 'data-num', 'data-id'];
            for (const attr of dataAttributes) {
                if (postBlock.hasAttribute(attr)) return postBlock.getAttribute(attr);
            }
            if (postBlock.id) {
                const match = postBlock.id.match(/\d+/);
                if (match) return match[0];
            }
            if (postBlock.hasAttribute('val')) return postBlock.getAttribute('val');
            const numElementSelectors = ['.post-number', '.res-number', '.post-id', 'a.num', '.num b'];
            const numElement = postBlock.querySelector(numElementSelectors.join(', '));
            if (numElement) {
                const match = numElement.textContent.match(/\d+/);
                if (match) return match[0];
            }
        }
        const ddElement = element.closest('dd[rnum]');
        if (ddElement && ddElement.hasAttribute('rnum')) return ddElement.getAttribute('rnum');
        const dtElement = element.closest('dl')?.querySelector('dt[res]');
        if (dtElement && dtElement.hasAttribute('res')) return dtElement.getAttribute('res');
        const hash = window.location.hash.match(/\d+/);
        return hash ? hash[0] : 'N/A';
    }
 
    function bindLightboxOnClick(imageElement, imageUrl, originalUrl) {
        if (imageElement.dataset.gmlbProcessed) return;
        imageCounter++;
        const currentImageIndex = imageCounter;
        const postNumber = getPostNumber(imageElement) || currentImageIndex;
        imageDatabase.set(currentImageIndex, { imageUrl, postNumber, originalUrl });
        imageElement.addEventListener('click', (e) => {
            e.stopPropagation(); e.preventDefault();
            showLightbox(currentImageIndex);
        }, true);
        imageElement.dataset.gmlbProcessed = '1';
    }
 
    // lp-cardクラスを完全に除去する関数
    function removeLpCardStyles(element) {
        // lp-cardクラスを削除
        element.classList.remove('lp-card');
        // lp-で始まる全てのクラスを削除
        const classesToRemove = [];
        element.classList.forEach(cls => {
            if (cls.startsWith('lp-')) {
                classesToRemove.push(cls);
            }
        });
        classesToRemove.forEach(cls => element.classList.remove(cls));
        
        // インラインスタイルで強制的に透明にする
        element.style.setProperty('background', 'transparent', 'important');
        element.style.setProperty('background-color', 'transparent', 'important');
        element.style.setProperty('border', 'none', 'important');
        element.style.setProperty('box-shadow', 'none', 'important');
        element.style.setProperty('padding', '0', 'important');
        element.style.setProperty('margin', '0', 'important');
        element.style.setProperty('outline', 'none', 'important');
        
        // 親要素のurlタグもスタイルをリセット
        const parentUrl = element.closest('url');
        if (parentUrl) {
            parentUrl.style.setProperty('background', 'transparent', 'important');
            parentUrl.style.setProperty('border', 'none', 'important');
            parentUrl.style.setProperty('box-shadow', 'none', 'important');
            parentUrl.style.setProperty('padding', '0', 'important');
            parentUrl.style.setProperty('margin', '0', 'important');
        }
    }
 
    // 取得エラーを表示する関数
    function showFetchError(linkElement, originalUrl) {
        const errorLink = document.createElement('a');
        errorLink.href = originalUrl;
        errorLink.target = '_blank';
        errorLink.rel = 'noopener noreferrer';
        errorLink.className = 'gm-fetch-error';
        errorLink.textContent = '取得エラー';
        
        linkElement.innerHTML = '';
        linkElement.appendChild(errorLink);
        linkElement.style.display = 'inline';
        linkElement.onclick = null;
    }
 
    function insertThumbnail(linkElement, imageUrl, originalUrl, isFromCache = false) {
        linkElement.classList.add('gm-media-embed-container');
        removeLpCardStyles(linkElement);
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = `max-width:${GIF_DISPLAY_SIZE}; max-height:${GIF_DISPLAY_SIZE}; object-fit:contain; cursor:pointer; border:1px solid #ddd; border-radius:4px;`;
        img.alt = "thumbnail";
        img.onerror = () => { 
            showFetchError(linkElement, originalUrl);
        };
        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.appendChild(img);
 
        linkElement.innerHTML = '';
        linkElement.appendChild(container);
        linkElement.style.display = 'inline-block';
        linkElement.onclick = e => e.preventDefault();
        linkElement.removeAttribute('title');
        linkElement.onmouseover = (e) => {
            e.stopPropagation(); e.target.removeAttribute('title');
            return false;
        };
        bindLightboxOnClick(img, imageUrl, originalUrl);
    }
 
    // 画像URLが有効な拡張子を持っているかチェック
    function hasValidImageExtension(url) {
        return /\.(jpe?g|png|gif|webp)$/i.test(url);
    }
 
    // ギャラリーページとして処理すべきかチェック（postimg.cc, freeimage.host）
    function isGalleryPage(url) {
        return /^https?:\/\/postimg\.cc\/[0-9A-Za-z]+/.test(url) ||
               /^https?:\/\/freeimage\.host\/i\/[0-9A-Za-z]+/.test(url);
    }
 
    // 画像をbase64として取得してキャッシュに保存
    function fetchAndCacheImage(imageUrl, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: imageUrl,
            responseType: "blob",
            onload: (res) => {
                if (res.status === 200 && res.response) {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        const base64Data = reader.result;
                        thumbnailCache.setWithBase64(imageUrl, base64Data);
                        callback(base64Data);
                    };
                    reader.onerror = function() {
                        // base64変換に失敗した場合はURLを使用
                        thumbnailCache.set(imageUrl, imageUrl);
                        callback(imageUrl);
                    };
                    reader.readAsDataURL(res.response);
                } else {
                    callback(null);
                }
            },
            onerror: () => {
                callback(null);
            }
        });
    }
 
    function expandGalleryLink(a) {
        const servicePageUrl = a.href;
        const cachedImage = thumbnailCache.get(servicePageUrl);
        if (cachedImage) {
            insertThumbnail(a, cachedImage, servicePageUrl, true);
            return;
        }
        GM_xmlhttpRequest({
            method: "GET", url: servicePageUrl,
            onload: (res) => {
                if (res.status === 200) {
                    const match = res.responseText.match(/<meta property="og:image" content="([^"]+)"/);
                    if (match) {
                        const imgUrl = match[1];
                        // 画像本体をbase64で取得してキャッシュ
                        fetchAndCacheImage(imgUrl, (base64Data) => {
                            if (base64Data) {
                                insertThumbnail(a, base64Data, servicePageUrl);
                            } else {
                                showFetchError(a, servicePageUrl);
                            }
                        });
                    } else {
                        showFetchError(a, servicePageUrl);
                    }
                } else {
                    showFetchError(a, servicePageUrl);
                }
            },
            onerror: () => {
                showFetchError(a, servicePageUrl);
            }
        });
    }
 
    function expandDirectLink(a) {
        const imgUrl = a.href;
        const cachedImage = thumbnailCache.get(imgUrl);
        if (cachedImage) {
            insertThumbnail(a, cachedImage, imgUrl, true);
            return;
        }
        // 画像本体をbase64で取得してキャッシュ
        fetchAndCacheImage(imgUrl, (base64Data) => {
            if (base64Data) {
                insertThumbnail(a, base64Data, imgUrl);
            } else {
                showFetchError(a, imgUrl);
            }
        });
    }
 
    function expandTadaupLink(a) {
        const originalUrl = a.href;
        
        // 拡張子がない場合は処理しない
        if (!hasValidImageExtension(originalUrl)) {
            a.dataset.gmlbProcessed = '1';
            return;
        }
        
        const existingImg = a.querySelector('img');
        if (existingImg && /tadaup\.jp/i.test(existingImg.src) && /\.(jpg|jpeg|png|gif)$/i.test(existingImg.src)) {
            bindLightboxOnClick(existingImg, existingImg.src, originalUrl);
            a.onclick = e => e.preventDefault();
            return;
        }
        if (/\.(jpg|jpeg|png|gif)$/i.test(originalUrl)) {
            expandDirectLink(a);
        }
    }
 
    function embedImgurMp4(element) {
        if (element.dataset.mp4Processed) return;
        element.dataset.mp4Processed = '1';
 
        const directUrl = element.href;
        const imgurPageUrl = directUrl.replace(/\.mp4$/i, '');
 
        const container = document.createElement('div');
        container.className = 'gm-media-embed-container';
        container.style.cssText = 'display: inline-flex; align-items: center; gap: 10px; vertical-align: middle;';
 
        const video = document.createElement('video');
        video.src = directUrl;
        video.style.cssText = 'max-width:350px; max-height:350px; object-fit:contain; border:1px solid #ddd; border-radius:4px;';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
video.playsInline = true;
video.controls = true;
video.onerror = () => { 
    console.error('Failed to load video:', directUrl); };
    const linkContainer = document.createElement('div');
    linkContainer.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start; font-size: 12px;';

    const directLink = document.createElement('a');
    directLink.href = directUrl;
    directLink.textContent = '直URL';
    directLink.target = '_blank';
    directLink.rel = 'noopener noreferrer';
    directLink.addEventListener('click', (e) => e.stopPropagation());

    const imgurLink = document.createElement('a');
    imgurLink.href = imgurPageUrl;
    imgurLink.textContent = 'imgur';
    imgurLink.target = '_blank';
    imgurLink.rel = 'noopener noreferrer';
    imgurLink.addEventListener('click', (e) => e.stopPropagation());

    linkContainer.appendChild(directLink);
    linkContainer.appendChild(imgurLink);
    container.appendChild(video);
    container.appendChild(linkContainer);

    if (element.parentNode) {
        element.parentNode.insertBefore(container, element);
        element.remove();
    }
}

function replaceImgurGifWithNativeCompatibility(a) {
    if (a.dataset.gifProcessed) return;
    a.dataset.gifProcessed = '1';

    const originalHref = a.href;

    const flexContainer = document.createElement('div');
    flexContainer.className = 'gm-media-wrapper';
    flexContainer.style.cssText = 'display: inline-flex; align-items: flex-start; vertical-align: top;';

    const wrapper = document.createElement('div');
    wrapper.className = 'gm-imgur-gif-wrapper';
    wrapper.style.cssText = 'display: inline-block; position: relative;';

    const autoplayImg = document.createElement('img');
    autoplayImg.src = originalHref;
    autoplayImg.style.cssText = `max-width:${GIF_DISPLAY_SIZE}; max-height:${GIF_DISPLAY_SIZE}; object-fit:contain; border:1px solid #ddd; border-radius:4px; display: block;`;
    autoplayImg.alt = "Imgur GIF (Auto-playing)";

    const thumbnailButton = document.createElement('button');
    thumbnailButton.className = 'gm-thumbnail-button';
    thumbnailButton.textContent = '📦';
    thumbnailButton.type = 'button';
    thumbnailButton.title = 'サムネイル表示';

    const thumbnailContainer = document.createElement('div');
    thumbnailContainer.className = 'gm-thumbnail-container';
    thumbnailContainer.style.display = 'none';

    let thumbnailLoaded = false;

    thumbnailButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (thumbnailContainer.style.display === 'none') {
            if (!thumbnailLoaded) {
                const thumbnailUrl = originalHref.replace(/\.gif$/i, 'm.gif');
                const thumbLink = document.createElement('a');
                thumbLink.href = originalHref;

                thumbLink.addEventListener('click', (clickEvent) => {
                    clickEvent.preventDefault();
                    clickEvent.stopPropagation();
                }, true);

                const thumbnailImg = document.createElement('img');
                thumbnailImg.className = 'gm-thumbnail-img';
                thumbnailImg.src = thumbnailUrl;
                thumbnailImg.alt = 'サムネイル';
                thumbnailImg.style.cssText = `max-width:${GIF_DISPLAY_SIZE}; max-height:${GIF_DISPLAY_SIZE}; object-fit:contain; border:1px solid #ddd; border-radius:4px; cursor:pointer;`;
                thumbnailImg.onerror = () => {
                    console.error('Failed to load thumbnail:', thumbnailUrl);
                    thumbnailImg.alt = 'サムネイル読み込み失敗';
                };

                bindLightboxOnClick(thumbnailImg, originalHref, originalHref);

                thumbLink.appendChild(thumbnailImg);
                thumbnailContainer.appendChild(thumbLink);
                thumbnailLoaded = true;
            }

            thumbnailContainer.style.display = 'inline-block';
            thumbnailButton.textContent = '📁';
            thumbnailButton.title = 'サムネイル非表示';
        } else {
            thumbnailContainer.style.display = 'none';
            thumbnailButton.textContent = '📦';
            thumbnailButton.title = 'サムネイル表示';
        }
    });

    wrapper.appendChild(autoplayImg);
    wrapper.appendChild(thumbnailButton);

    flexContainer.appendChild(wrapper);
    flexContainer.appendChild(thumbnailContainer);

    if (a.parentNode) {
        a.parentNode.insertBefore(flexContainer, a);
        a.remove();
    } else {
        return;
    }

    bindLightboxOnClick(autoplayImg, originalHref, originalHref);
}

function groupConsecutiveImages() {
    const links = document.querySelectorAll('a[href]');
    const imagePattern = /\.(jpe?g|png|gif|webp)$/i;
    const servicePattern = /imgur|tadaup\.jp|ul\.h3z\.jp|ibb\.co|postimg\.cc|freeimage\.host|iili\.io|funakamome\.com/i;

    let consecutiveGroups = [];
    let currentGroup = [];

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.href;

        if (link.closest('#lightbox, #lightboxOverlay, .lb-dataContainer, .gm-media-embed-container, .gm-imgur-gif-wrapper, .gm-image-row')
            || link.dataset.gmlbProcessed) {
            if (currentGroup.length > 1) {
                consecutiveGroups.push([...currentGroup]);
            }
            currentGroup = [];
            continue;
        }

        const isImageUrl = imagePattern.test(href) || servicePattern.test(href);

        if (isImageUrl) {
            if (currentGroup.length === 0) {
                currentGroup.push(link);
            } else {
                const lastLink = currentGroup[currentGroup.length - 1];

                if (isConsecutiveImage(lastLink, link)) {
                    currentGroup.push(link);
                } else {
                    if (currentGroup.length > 1) {
                        consecutiveGroups.push([...currentGroup]);
                    }
                    currentGroup = [link];
                }
            }
        } else {
            if (currentGroup.length > 1) {
                consecutiveGroups.push([...currentGroup]);
            }
            currentGroup = [];
        }
    }

    if (currentGroup.length > 1) {
        consecutiveGroups.push(currentGroup);
    }

    consecutiveGroups.forEach(group => {
        if (group.length > 1) {
            createImageRow(group);
        }
    });
}
function isConsecutiveImage(elem1, elem2) {
    if (areAdjacentInDOM(elem1, elem2)) {
        return true;
    }

    const distance = getElementDistance(elem1, elem2);
    if (distance < 100) {
        return true;
    }

    if (areInSameParagraph(elem1, elem2)) {
        return true;
    }

    return false;
}

function areAdjacentInDOM(elem1, elem2) {
    let current = elem1.nextSibling;
    let textOnlyBetween = true;

    while (current && current !== elem2) {
        if (current.nodeType === Node.TEXT_NODE) {
            if (current.textContent.trim() !== '') {
                textOnlyBetween = false;
                break;
            }
        } else if (current.nodeType === Node.ELEMENT_NODE) {
            if (current.tagName === 'BR' ||
                (current.textContent && current.textContent.trim() === '')) {
            } else {
                textOnlyBetween = false;
                break;
            }
        }
        current = current.nextSibling;
    }

    return current === elem2 && textOnlyBetween;
}

function areInSameParagraph(elem1, elem2) {
    const para1 = elem1.closest('p, dd, div.message, .post-content');
    const para2 = elem2.closest('p, dd, div.message, .post-content');

    return para1 && para2 && para1 === para2;
}

function getElementDistance(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    const verticalDistance = Math.abs(rect2.top - rect1.bottom);

    return verticalDistance;
}

function createImageRow(imageLinks) {
    if (imageLinks.length < 2) return;

    const firstLink = imageLinks[0];
    const rowContainer = document.createElement('div');
    rowContainer.className = 'gm-image-row';

    firstLink.parentNode.insertBefore(rowContainer, firstLink);

    imageLinks.forEach(link => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display: inline-block; vertical-align: top;';
        wrapper.appendChild(link);
        rowContainer.appendChild(wrapper);
    });
}

function processLinks() {
    const links = document.querySelectorAll('a[href]');
    const baseDomainsToIgnore = ['ul.h3z.jp', 'tadaup.jp', 'ibb.co', 'i.ibb.co', 'i.postimg.cc', 'postimg.cc', 'freeimage.host', 'iili.io', 'funakamome.com'];

    links.forEach(a => {
        if (a.closest('#lightbox, #lightboxOverlay, .lb-dataContainer, .gm-media-embed-container, .gm-imgur-gif-wrapper, .gm-thumbnail-button, .gm-image-row') || a.dataset.gmlbProcessed) return;
        const innerImg = a.querySelector('img');
        if (innerImg && innerImg.dataset.gmlbProcessed) return;
        const href = a.href;
        try {
            const url = new URL(href);
            if (baseDomainsToIgnore.includes(url.hostname) && (url.pathname === '/' || url.pathname === '')) {
                a.dataset.gmlbProcessed = '1'; return;
            }
        } catch (e) { return; }

        const existingImg = a.querySelector('img');

        if ((existingImg && /imgur/i.test(existingImg.className) && /\.gif/i.test(href)) || /i\.imgur\.com\/[0-9A-Za-z]+\.gif/i.test(href)) {
            replaceImgurGifWithNativeCompatibility(a);
            return;
        }

        if (!existingImg && /i\.imgur\.com\/[0-9A-Za-z]+\.mp4/i.test(href)) {
            embedImgurMp4(a); return;
        }
        if (existingImg && /i\.imgur\.com\//.test(href) && /\.(jpe?g|png)$/i.test(href)) {
            bindLightboxOnClick(existingImg, href, href);
            a.onclick = e => e.preventDefault(); a.dataset.gmlbProcessed = '1'; return;
        }

        const isTadaup = /tadaup\.jp/.test(href) || (existingImg && /tadaup\.jp/.test(existingImg.src));
        const isH3z = /ul\.h3z\.jp/.test(href);
        const isIbbDirect = /^https?:\/\/i\.ibb\.co\//.test(href);
        const isPostimgDirect = /i\.postimg\.cc/.test(href);
        const isIilioDirect = /iili\.io/.test(href);
        const isFunakamome = /funakamome\.com/.test(href);
        const isIbbGallery = /^https?:\/\/ibb\.co\/[0-9A-Za-z]+/.test(href);
        const isPostimgGallery = /^https?:\/\/postimg\.cc\/[0-9A-Za-z]+/.test(href);
        const isFreeimageGallery = /^https?:\/\/freeimage\.host\/i\/[0-9A-Za-z]+/.test(href);

        // ギャラリーページ（postimg.cc, freeimage.host）は拡張子なしでもOK
        if (isPostimgGallery || isFreeimageGallery) {
            expandGalleryLink(a);
            a.dataset.gmlbProcessed = '1';
            return;
        }
        
        // ibb.coギャラリーページも拡張子なしでもOK
        if (isIbbGallery) {
            expandGalleryLink(a);
            a.dataset.gmlbProcessed = '1';
            return;
        }

        // 直接リンクの場合は拡張子チェックを行う
        if (isIbbDirect || isPostimgDirect || isH3z || isIilioDirect) {
            if (hasValidImageExtension(href)) {
                expandDirectLink(a);
            }
            // 拡張子がない場合は何もしない（白い枠も消さない）
            a.dataset.gmlbProcessed = '1';
            return;
        }
        
        // funakamome.comは拡張子チェックを行う
        if (isFunakamome) {
            if (hasValidImageExtension(href)) {
                expandDirectLink(a);
            }
            // 拡張子がない場合は何もしない（白い枠も消さない）
            a.dataset.gmlbProcessed = '1';
            return;
        }
        
        // tadaupも拡張子チェックを行う
        if (isTadaup) {
            if (hasValidImageExtension(href)) {
                expandTadaupLink(a);
            }
            // 拡張子がない場合は何もしない
            a.dataset.gmlbProcessed = '1';
            return;
        }

        a.dataset.gmlbProcessed = '1';
    });

    setTimeout(() => {
        groupConsecutiveImages();
    }, 500);
}

function disableTooltips() {
    document.addEventListener('mouseover', function(e) {
        if (e.target.matches('.lb-save a, .gm-no-tooltip, .gm-media-embed-container a, .gm-thumbnail-button')) {
            e.target.removeAttribute('title'); e.target.title = '';
        }
    }, true);
    setTimeout(() => {
        document.querySelectorAll('.lb-save a, .gm-no-tooltip, .gm-thumbnail-button').forEach(el => {
            el.removeAttribute('title'); el.title = '';
        });
    }, 100);
}

function enhanceSiteCompatibility() {
    const observer = new MutationObserver((mutations) => {
        let needsProcessing = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('a[href]') || node.querySelector('a[href]')) {
                            needsProcessing = true;
                        }
                    }
                });
            }
        });

        if (needsProcessing) {
            setTimeout(processLinks, 200);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function init() {
    addCustomCSS();
    processLinks();
    disableTooltips();
    enhanceSiteCompatibility();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
})();