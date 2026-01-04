// ==UserScript==
// @name         Grok Imagine Downloader - Bulk Save High-Quality Media
// @namespace    https://grok.com
// @version      2025-11-18
// @description  This script allows to download all videos and photos (including from child posts) from your Image Favorites page.
// @author       Mykyta Shcherbyna
// @match        https://grok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @license      MIT
// @grant        GM_download
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      assets.grok.com
// @connect      imagine-public.x.ai
// @downloadURL https://update.greasyfork.org/scripts/556188/Grok%20Imagine%20Downloader%20-%20Bulk%20Save%20High-Quality%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/556188/Grok%20Imagine%20Downloader%20-%20Bulk%20Save%20High-Quality%20Media.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CARD_SELECTOR = '.group\\/media-post-masonry-card:not([data-downloader-added])';
    const BUTTON_CONTAINER_SELECTOR = '.absolute.bottom-2.right-2';
    const BUTTON_CLASSES = 'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 select-none rounded-full overflow-hidden h-10 w-10 p-2 bg-black/25 hover:bg-white/10 border border-white/15 text-white text-xs font-bold';
    const DOWNLOAD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`;

    const mediaDatabase = new Map();

    function extractPostIdFromUrl(url) {
        if (!url) return null;
        const matches = [...url.matchAll(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g)];
        return matches.length > 0 ? matches[matches.length - 1][0] : null;
    }

    function sanitizeForFilename(str) {
        return (str || '').replace(/[/\\?%*:|"<>]/g, '_').replace(/\s+/g, '_');
    }

    function buildFilename(item) {
        const time = item.createTime ? item.createTime.slice(0, 19).replace(/:/g, '-') : 'unknown';
        const model = item.modelName ? `_${sanitizeForFilename(item.modelName)}` : '';
        let prompt = item.prompt ? `_${sanitizeForFilename(item.prompt)}` : '';

        if (prompt.length > 180) prompt = prompt.slice(0, 177) + '...';

        let ext = item.isVideo ? 'mp4' : 'jpg';
        if (item.mimeType) {
            if (item.mimeType === 'video/mp4') ext = 'mp4';
            else if (item.mimeType === 'image/png') ext = 'png';
            else if (item.mimeType === 'image/jpeg') ext = 'jpg';
        }

        return `${time}_${item.id}${model}${prompt}.${ext}`;
    }

    function downloadFile(item, onComplete) {
        GM_download({
            url: item.url,
            name: item.filename,
            onload: onComplete,
            onerror: onComplete,
            ontimeout: onComplete
        });
    }

    function startDownloads(media, postId, button) {
        const all = media.object;
        if (all.length === 0) return;

        let completed = 0;
        let failed = 0;
        const total = all.length;

        button.textContent = `0/${total}`;
        button.style.pointerEvents = 'none';
        button.disabled = true;

        const onComplete = () => {
            completed++;
            button.textContent = `${completed}/${total}`;
            if ((completed + failed) === total) {
                button.disabled = failed === 0;
                setTimeout(() => {
                    button.textContent = failed > 0 ? 'ERR' : 'OK!';
                }, 500);
            }
        };

        all.forEach(item => {
            downloadFile(item, onComplete);
        });
    }

    function createMediaObject(source, fallbackParent) {
        const isVideo = source.mediaType === 'MEDIA_POST_TYPE_VIDEO';
        const url = isVideo && source.hdMediaUrl ? source.hdMediaUrl : source.mediaUrl;

        let item = {
            id: source.id,
            url: url,
            createTime: source.createTime || fallbackParent?.createTime || '',
            modelName: source.modelName || fallbackParent?.modelName || '',
            prompt: (source.originalPrompt || source.prompt || fallbackParent?.originalPrompt || fallbackParent?.prompt || '').trim(),
            isVideo: isVideo,
            mimeType: source.mimeType
        };

        const filename = buildFilename(item);

        return {
            id: item.id,
            url: item.url,
            createTime: item.createTime,
            modelName: item.modelName,
            prompt: item.prompt,
            filename: filename
        };
    }

    function processApiData(apiData) {
        if (!apiData?.posts) return;

        for (const post of apiData.posts) {
            if (!post.id) continue;

            let media = mediaDatabase.get(post.id);
            if (!media) {
                media = {id: post.id, object: []};
            }

            if (post.mediaUrl) {
                const item = createMediaObject(post, null);
                media.object.push(item);
            }

            if (post.childPosts?.length) {
                for (const child of post.childPosts) {
                    const item = createMediaObject(child, post);
                    media.object.push(item);
                }
            }

            if (media.object.length > 0) {
                mediaDatabase.set(post.id, media);
            }
        }
    }

    function processCards() {
        const cards = document.querySelectorAll(CARD_SELECTOR);

        for (const card of cards) {
            const container = card.querySelector(BUTTON_CONTAINER_SELECTOR);
            if (!container) {
                console.error("No button container found!", card);
                continue;
            }

            const img = card.querySelector('img');
            const video = card.querySelector('video');
            const src = img?.src || img?.dataset?.src || img?.dataset?.lazy ||
                video?.poster || video?.dataset?.src || video?.dataset?.lazy || '';

            const postId = extractPostIdFromUrl(src);
            if (!postId) continue;

            const media = mediaDatabase.get(postId);
            if (!media) continue;

            card.setAttribute('data-downloader-added', 'true');

            const btn = document.createElement('button');
            btn.innerHTML = DOWNLOAD_ICON;
            btn.className = BUTTON_CLASSES;
            btn.title = `Download ${media.object.length} media files`;
            btn.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                startDownloads(media, postId, btn);
            });

            container.prepend(btn);
        }
    }

    const origFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function (url, options) {
        const resp = await origFetch(url, options);
        if (typeof url === 'string' && url.includes('/rest/media/post/list')) {
            try {
                const clone = resp.clone();
                const data = await clone.json();
                processApiData(data);
                debouncedProcessCards();
            } catch (e) {
                console.error('API intercept error:', e);
            }
        }
        return resp;
    };

    let debounceTimer;
    const debouncedProcessCards = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processCards, 120);
    };

    const observer = new MutationObserver(debouncedProcessCards);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'data-src', 'data-lazy', 'poster']
    });

    debouncedProcessCards();
})();
