// ==UserScript==
// @name        X Media Downloader
// @namespace   http://tampermonkey.net/
// @version     1.5
// @author      Ksanadu
// @match       https://twitter.com/*
// @match       https://x.com/*
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @license     MIT
// @description Download media content (images, videos) from Twitter/X posts with one click.
// @downloadURL https://update.greasyfork.org/scripts/560556/X%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560556/X%20Media%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLASS_NAME = 'x-batch-downloader';
    const SVG_ICON = `
        <svg viewBox="0 0 24 24" style="width: 100%; height: 100%; display: block;">
            <path d="M3,14 v5 q0,2 2,2 h14 q2,0 2,-2 v-5 M7,10 l4,4 q1,1 2,0 l4,-4 M12,3 v11"
                  fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
        </svg>
    `;

    const style = document.createElement('style');
    style.innerHTML = `
        .${CLASS_NAME} {
            position: absolute !important;
            bottom: 6px !important;
            left: 6px !important;
            z-index: 2147483647 !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 28px !important;
            height: 28px !important;
            padding: 5px !important;
            box-sizing: border-box !important;
            border-radius: 4px !important;

            background-color: rgba(0, 0, 0, 0.6) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: #ffffff !important;

            cursor: pointer !important;
            pointer-events: auto !important;
            transition: transform 0.2s !important;
        }

        /* [NEW] 媒体网格页专用：左上角 */
        .${CLASS_NAME}.x-pos-top-left {
            top: 6px !important;
            left: 6px !important;
            bottom: auto !important;
        }

        .${CLASS_NAME}:hover {
            background-color: rgba(29, 161, 242, 0.9) !important;
            transform: scale(1.1);
        }
        .x-batch-loading {
            opacity: 0.7;
            animation: x-spin 1s linear infinite;
        }
        @keyframes x-spin { 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    function globalScan() {
        document.querySelectorAll('video').forEach(video => {
            const container = video.closest('div[data-testid="videoComponent"]') ||
                              video.closest('div[data-testid="videoPlayer"]') ||
                              video.parentNode;
            injectButton(container);
        });

        document.querySelectorAll('img[src*="format"]').forEach(img => {
            if (img.src.includes('/profile_images/') || img.src.includes('emoji')) return;

            let container = img.closest('div[data-testid="tweetPhoto"]');

            if (!container) {
                const link = img.closest('a[href*="/status/"]');
                if (link) container = img.parentNode;
            }

            if (!container && img.naturalWidth > 50) container = img.parentNode;

            if (container) injectButton(container);
        });
    }

    function injectButton(container) {
        if (!container || container.querySelector(`.${CLASS_NAME}`)) return;

        const rect = container.getBoundingClientRect();
        if (rect.width < 50 || rect.height < 50) return;

        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.position === 'static') container.style.position = 'relative';

        const btn = document.createElement('div');
        btn.className = CLASS_NAME;
        btn.innerHTML = SVG_ICON;
        btn.title = isMediaPage() ? 'Download All Media in Post' : 'Download This Media';

        // [修改点] 如果是媒体页，添加左上角样式类
        if (isMediaPage()) {
            btn.classList.add('x-pos-top-left');
        }

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            startDownload(btn, container);
        };

        container.appendChild(btn);
    }

    function isMediaPage() {
        const path = window.location.pathname;
        return path.endsWith('/media') || path.includes('/media/');
    }

    setInterval(globalScan, 1500);
    const observer = new MutationObserver(() => globalScan());
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });

    async function startDownload(btn, container) {
        const svg = btn.querySelector('svg');
        svg.classList.add('x-batch-loading');

        try {
            let statusId = 'unknown';
            let userName = 'twitter';

            let article = container.closest('article');
            let link = container.closest('a[href*="/status/"]');

            if (article) {
                const idLink = article.querySelector('a[href*="/status/"]');
                if (idLink) statusId = idLink.href.split('/status/').pop().split('/')[0];
                const userEl = article.querySelector('div[data-testid="User-Name"] a');
                if (userEl) userName = userEl.getAttribute('href').replace('/', '');
            } else if (link) {
                const parts = link.href.split('/');
                const statusIndex = parts.indexOf('status');
                if (statusIndex > -1) {
                    statusId = parts[statusIndex + 1];
                    userName = parts[statusIndex - 1];
                }
            }

            // URL 兜底
            if (statusId === 'unknown' || userName === 'twitter') {
                const path = window.location.pathname;
                const parts = path.split('/');
                const statusIndex = parts.indexOf('status');
                if (statusIndex > -1 && parts[statusIndex + 1]) {
                    userName = parts[statusIndex - 1];
                    statusId = parts[statusIndex + 1];
                }
            }

            let mediaList = getFullTweetMedia(container) ||
                            getFullTweetMedia(link) ||
                            getFullTweetMedia(article);

            if (!mediaList || mediaList.length === 0) {
                mediaList = tryExtractFromDOM(container);
            }

            if (mediaList && mediaList.length > 0) {
                // [关键修改] 逻辑分流
                if (isMediaPage()) {
                    // 情况A：在媒体页 -> 直接下载该帖子的所有媒体
                    // 去除重复链接（如果有）
                    const uniqueList = mediaList.filter((v,i,a)=>a.findIndex(t=>(t.url===v.url))===i);
                    await downloadBatchFallback(uniqueList, statusId, userName);
                } else {
                    // 情况B：其他页面 -> 尝试匹配特定媒体并下载
                    const targetMedia = filterMediaForContainer(mediaList, container);

                    if (targetMedia) {
                        let finalIndex = mediaList.indexOf(targetMedia) + 1;
                        if (finalIndex === 0) finalIndex = 1;

                        // Photo Viewer 索引修复
                        if (window.location.pathname.includes('/photo/')) {
                            const pathParts = window.location.pathname.split('/');
                            const photoIdx = pathParts.indexOf('photo');
                            if (photoIdx > -1 && pathParts[photoIdx + 1]) {
                                const urlIndex = parseInt(pathParts[photoIdx + 1], 10);
                                if (!isNaN(urlIndex)) finalIndex = urlIndex;
                            }
                        }

                        const fileName = `twitter_${userName}_${statusId}_${finalIndex}.${targetMedia.ext}`;
                        await downloadAsBlob(targetMedia.url, fileName);
                    } else {
                         // 匹配失败兜底
                         const uniqueList = mediaList.filter((v,i,a)=>a.findIndex(t=>(t.url===v.url))===i);
                         await downloadBatchFallback(uniqueList, statusId, userName);
                    }
                }
            } else {
                alert('No media found.');
            }

        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        } finally {
            svg.classList.remove('x-batch-loading');
        }
    }

    function filterMediaForContainer(mediaList, container) {
        const img = container.querySelector('img[src*="format"]');
        const video = container.querySelector('video');

        let targetId = null;

        if (img) {
            const urlParts = img.src.split('/media/');
            if (urlParts.length > 1) {
                targetId = urlParts[1].split('?')[0].split('.')[0];
            }
        } else if (video) {
            if (video.poster) {
                if (video.poster.includes('/media/')) {
                    targetId = video.poster.split('/media/')[1].split('.')[0];
                } else if (video.poster.includes('/tweet_video_thumb/')) {
                    targetId = video.poster.split('/tweet_video_thumb/')[1].split('.')[0];
                }
            }
        }

        if (targetId) {
            return mediaList.find(m => m.url.includes(targetId) || (m.poster && m.poster.includes(targetId)));
        }
        return null;
    }

    function getFullTweetMedia(domNode) {
        if (!domNode) return null;
        const key = Object.keys(domNode).find(k => k.startsWith('__reactFiber$'));
        if (!key) return null;

        let fiber = domNode[key];
        let attempts = 0;
        let foundMedia = null;

        while (fiber && attempts < 40) {
            const props = fiber.memoizedProps;

            if (props?.tweet?.extended_entities?.media) {
                return parseMedia(props.tweet.extended_entities.media);
            }
            if (props?.data?.tweet?.extended_entities?.media) {
                return parseMedia(props.data.tweet.extended_entities.media);
            }
            if (props?.item?.content?.tweet?.extended_entities?.media) {
                 return parseMedia(props.item.content.tweet.extended_entities.media);
            }
            if (props?.source?.tweet?.extended_entities?.media) {
                return parseMedia(props.source.tweet.extended_entities.media);
            }

            if (!foundMedia && props?.media?.media_url_https) {
                foundMedia = parseMedia([props.media]);
            }

            fiber = fiber.return;
            attempts++;
        }

        return foundMedia;
    }

    function parseMedia(mediaArray) {
        return mediaArray.map(media => {
            if (media.type === 'photo') {
                return {
                    url: media.media_url_https + ':orig',
                    ext: 'jpg',
                    poster: media.media_url_https
                };
            } else if (media.type === 'video' || media.type === 'animated_gif') {
                const variants = media.video_info.variants
                    .filter(n => n.content_type === 'video/mp4')
                    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

                if (variants.length > 0) {
                    return {
                        url: variants[0].url,
                        ext: 'mp4',
                        poster: media.media_url_https
                    };
                }
            }
            return null;
        }).filter(Boolean);
    }

    function tryExtractFromDOM(container) {
        const results = [];
        container.querySelectorAll('img[src*="format"]').forEach(img => {
            const u = new URL(img.src);
            if (u.pathname.includes('/media/')) {
                const format = u.searchParams.get('format') || 'jpg';
                results.push({
                    url: `${u.origin}${u.pathname}?format=${format}&name=orig`,
                    ext: format
                });
            }
        });
        container.querySelectorAll('video').forEach(v => {
            if (v.src && v.src.startsWith('http')) results.push({ url: v.src, ext: 'mp4' });
        });
        return results;
    }

    async function downloadBatchFallback(list, id, user) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const name = `twitter_${user}_${id}_${i+1}.${item.ext}`;
            await downloadAsBlob(item.url, name);
        }
    }

    function downloadAsBlob(url, filename) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url, responseType: "blob",
                onload: res => {
                    if (res.status === 200) {
                        const u = URL.createObjectURL(res.response);
                        const a = document.createElement('a');
                        a.href = u; a.download = filename;
                        document.body.appendChild(a); a.click(); document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(u), 1000); resolve();
                    } else reject(new Error(res.status));
                }, onerror: reject
            });
        });
    }

})();