// ==UserScript==
// @name         Facebook Video Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download Facebook videos
// @author       01 dev
// @match        *://*.facebook.com/*
// @icon         https://static.xx.fbcdn.net/rsrc.php/y1/r/ay1hV6OlegS.ico
// @grant        GM_xmlhttpRequest
// @license      MIT 
// @grant        GM_download
// @grant        GM_setClipboard
// @connect      facebook.com
// @connect      business.facebook.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561077/Facebook%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561077/Facebook%20Video%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let accessToken = null;
    let fetchingToken = false;

    // --- Data & Icons ---
    const ICONS = {
        download: '<svg viewBox="0 0 24 24" fill="currentColor" width="16px" height="16px"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>'
    };

    // --- Styles ---
    const addStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            .fb-dl-btn {
                position: absolute;
                z-index: 99999;
                display: flex;
                align-items: center;
                gap: 6px;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 6px 12px;
                border-radius: 20px;
                font-family: inherit;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                opacity: 0.9;
            }
            .fb-dl-btn:hover {
                background: #e1306c; /* Instagram/FB gradient feel */
                transform: scale(1.05);
                opacity: 1;
                border-color: transparent;
                box-shadow: 0 6px 16px rgba(225, 48, 108, 0.4);
            }
            .fb-dl-btn svg {
                display: block;
            }
            .fb-dl-story-btn {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 999999;
                padding: 8px 16px;
                font-size: 14px;
                background: #e1306c;
                border-color: white;
            }
            .fb-dl-discord-btn {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 999999;
                background: #5865F2;
                border-color: white;
                text-decoration: none;
            }
            .fb-dl-discord-btn:hover {
                background: #4752C4;
            }
            .loader {
                display: block;
                position: relative;
                height: 4px;
                width: 80px;
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.5);
                border-radius: 2px;
                color: red;
                overflow: hidden;
            }
            .loader::before {
                content: '';
                background: white;
                position: absolute;
                left: 0;
                top: 0;
                width: 0;
                height: 100%;
                animation: loading 2s linear infinite;
            }
            @keyframes loading {
                0% { width: 0; }
                50% { width: 70%; }
                100% { width: 100%; }
            }
        `;
        document.head.appendChild(style);
    };
    addStyles();

    // --- Logger ---
    const log = (msg, data) => {
        console.log(`[FB - Downloader] ${msg} `, data || '');
    };

    // --- Access Token Extraction ---
    // The extension fetched 'https://business.facebook.com/business_locations' to find the token.
    const getAccessToken = async () => {
        if (accessToken) return accessToken;
        if (fetchingToken) return null; // Avoid concurrent fetches

        fetchingToken = true;
        log('Fetching Access Token...');

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://business.facebook.com/business_locations",
                onload: function (response) {
                    const text = response.responseText;
                    // Regex to find EAAG token. It usually starts with EAAG and is quite long.
                    // The extension used simpler parsing, but a regex is more robust.
                    // Looking for pattern: "accessToken":"EAAG..." or similar in the raw text.
                    // Or typically just /EAAG\w+/

                    const match = text.match(/(EAAG\w+)/);
                    if (match && match[0]) {
                        accessToken = match[0];
                        log('Access Token Found:', accessToken.substring(0, 15) + '...');
                        resolve(accessToken);
                    } else {
                        log('Failed to extract Access Token. You might need to be logged into Business Manager or have a page?');
                        resolve(null);
                    }
                    fetchingToken = false;
                },
                onerror: function (err) {
                    log('Error fetching token', err);
                    fetchingToken = false;
                    resolve(null);
                }
            });
        });
    };

    // --- Graph API Fetcher ---
    const getVideoData = async (videoId) => {
        const token = await getAccessToken();
        if (!token) {
            alert('Could not fetch Facebook Access Token. Make sure you are logged in.');
            return null;
        }

        const url = `https://graph.facebook.com/v15.0/${videoId}?fields=source,id&access_token=${token}`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.source) {
                            resolve(data.source);
                        } else {
                            log('No source found in Graph API response', data);
                            resolve(null);
                        }
                    } catch (e) {
                        log('Error parsing Graph API response', e);
                        resolve(null);
                    }
                },
                onerror: function (err) {
                    log('Graph API Error', err);
                    resolve(null);
                }
            });
        });
    };

    // --- UI Injection ---

    // Check various patterns for Video IDs.
    // Facebook URLs: /watch/?v=123, /videos/123, /user/posts/123 (sometimes)
    // The easiest way on the feed is to look for video elements and walk up to find the ID or link.
    const findVideoId = (element) => {
        // Option 1: DOM traversal for Feed/Reel videos (Context specific)
        // Walk up from <video> to find a parent with a link to the video
        let current = element;
        for (let i = 0; i < 15; i++) {
            if (!current) break;
            // Look for anchors with common video patterns
            const links = current.querySelectorAll('a[href*="/videos/"], a[href*="/watch/"], a[href*="/reel/"]');
            for (const link of links) {
                const href = link.getAttribute('href');
                const match = href.match(/\/videos\/(\d+)/) || href.match(/\/watch\/\?v=(\d+)/) || href.match(/\/reel\/(\d+)/);
                if (match) return match[1];
            }

            // Also check the specific container link that might wrap the video
            if (current.tagName === 'A') {
                const href = current.getAttribute('href');
                if (href) {
                    const match = href.match(/\/videos\/(\d+)/) || href.match(/\/watch\/\?v=(\d+)/) || href.match(/\/reel\/(\d+)/);
                    if (match) return match[1];
                }
            }

            current = current.parentElement;
        }

        // Option 2: URL inspection if Single Video/Reel View (Fallback)
        // Only use this if we are likely on the permalink page
        const url = window.location.href;
        if (url.includes('/videos/') || url.includes('/watch/') || url.includes('/reel/')) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('v')) return urlParams.get('v');

            const match = url.match(/\/videos\/(\d+)/) || url.match(/\/reel\/(\d+)/);
            if (match) return match[1];
        }

        return null; // Fallback
    };

    // We can also parse the video ID from the HTML if we are observing the DOM.
    // Actually, finding the ID is the hardest part in FB's obfuscated DOM.
    // Let's genericize: Add a button to ANY <video> element found.
    // When clicked, try to resolve ID from the current page URL or nearby context.

    const createDownloadButton = (videoEl) => {
        if (videoEl.dataset.fbDlInjected) return;
        videoEl.dataset.fbDlInjected = "true";

        const btn = document.createElement('button');
        btn.className = 'fb-dl-btn';
        btn.innerHTML = `${ICONS.download} Download`;
        btn.style.top = '10px';
        btn.style.right = '10px';

        // Adjust for Feed vs Full View
        // On feed, top-left is good.


        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const originalContent = btn.innerHTML;
            btn.innerHTML = '<span class="loader"></span>';
            btn.style.pointerEvents = 'none';

            btn.innerText = 'Fetching...';

            // 1. Try to get ID from DOM relative to the button (Best for Feed/Grid)
            let videoId = findVideoId(videoEl);

            if (!videoId) {
                // 2. Try URL fallback
                const url = window.location.href;
                const vMatch = url.match(/\/videos\/(\d+)/) || url.match(/v=(\d+)/) || url.match(/\/reel\/(\d+)/);
                if (vMatch) {
                    videoId = vMatch[1];
                }
            }

            if (!videoId) {
                // 2. Try to find the feedback anchor or timestamp anchor relative to this video
                // This is tricky in feed.
                // Let's prompt user if we can't find it, or ask them to open video in new tab.
                videoId = prompt("Could not auto-detect Video ID from URL. Please enter Video ID if known, or open the video in a specific tab:");
            }

            if (!videoId) {
                btn.innerText = 'Download';
                return;
            }

            log('Using Video ID:', videoId);

            const sourceUrl = await getVideoData(videoId);
            if (sourceUrl) {
                log('Source URL:', sourceUrl);
                btn.innerText = 'Starting Download...';

                GM_download({
                    url: sourceUrl,
                    name: `01 dev/fb_video_${videoId}.mp4`,
                    onload: () => { btn.innerHTML = originalContent; btn.style.pointerEvents = 'auto'; },
                    onerror: (err) => { alert('Download failed'); btn.innerHTML = originalContent; btn.style.pointerEvents = 'auto'; }
                });
            } else {
                btn.innerHTML = originalContent; btn.style.pointerEvents = 'auto';
                btn.innerText = 'Error';
                alert('Could not retrieve video link. The video might be private or the access token failed.');
            }
        });

        // Use a container relative to the video to position the button
        // Ideally the video's direct parent that has relative positioning.
        // We often need to force relative positioning on the parent if it's static.
        const parent = videoEl.parentElement;
        if (parent) {
            if (window.getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }
            parent.appendChild(btn);
        }
    };

    // --- Story Logic ---
    // Stories are different. We don't need Graph API usually, we can just grab the src of the active video/img.

    // --- Story Logic (Advanced GraphQL & DOM Switch) ---
    // Integrates user-provided active fetching for HD quality (Videos)
    // and simple DOM scraping for Images.

    // 1. Auth & Token Extraction
    const getAuthTokens = () => {
        try {
            const uidMatch = document.cookie.match(/c_user.*?(?=;)/);
            if (!uidMatch) return null;
            const uid = uidMatch[0].split("=")[1];

            const html = document.documentElement.innerHTML;
            let fbag = null;

            const tokenMatch = html.match(/"token":"(.*?)"/);
            if (tokenMatch && tokenMatch[1]) {
                fbag = tokenMatch[1];
            } else {
                const dtsgMatch = html.match(/"DTSGInitialData",\[\],{"token":"(.*?)"/);
                if (dtsgMatch) fbag = dtsgMatch[1];
            }

            if (!fbag) {
                const asyncMatch = html.match(/"async_get_token":"(.*?)"/);
                if (asyncMatch) fbag = asyncMatch[1];
            }

            return { uid, fbag };
        } catch (e) {
            console.error('[FB-Downloader] Token extraction failed', e);
            return null;
        }
    };

    // 2. GraphQL Parsing Helpers
    const extractStoryVideoUrl = (json, storyId) => {
        try {
            // Handle NDJSON (multiple lines) or standard JSON
            const lines = json.split('\n');
            let targetUrl = null;

            lines.forEach(line => {
                if (!line) return;
                try {
                    const data = JSON.parse(line);
                    if (!data?.data?.nodes) return;

                    data.data.nodes.forEach(node => {
                        const edges = node.unified_stories?.edges;
                        if (!Array.isArray(edges)) return;

                        edges.forEach(edge => {
                            const storyNode = edge.node;
                            let isMatch = true;

                            // Robust ID Matching (Numeric vs Base64)
                            if (storyId) {
                                isMatch = false;
                                // 1. Exact Match
                                if (storyNode.id === storyId) isMatch = true;
                                // 2. Numeric Field Match
                                else if (storyNode.story_card_info?.story_card_id === storyId) isMatch = true;
                                // 3. Base64 Containment (Node ID contains Story ID)
                                else if (typeof storyNode.id === 'string' && storyNode.id.includes(storyId)) isMatch = true;
                                // 4. Attempt Base64 decode of NODE ID (JSON) -> Matches Story ID (URL)
                                else {
                                    try {
                                        const decodedNode = atob(storyNode.id);
                                        if (decodedNode.includes(storyId)) isMatch = true;
                                    } catch (e) { }
                                }

                                // 5. Attempt Base64 decode of STORY ID (URL) -> Matches Node ID (JSON)
                                if (!isMatch) {
                                    try {
                                        const decodedUrlId = atob(storyId);
                                        // "S:_ISC:12345..." includes "12345..."
                                        if (decodedUrlId.includes(storyNode.id)) isMatch = true;
                                    } catch (e) { }
                                }
                            }

                            if (!isMatch) return;

                            storyNode.attachments?.forEach(att => {
                                const media = att.media;
                                const videoData = media?.videoDeliveryResponseFragment?.videoDeliveryResponseResult;
                                const progressive = videoData?.progressive_urls;

                                if (Array.isArray(progressive)) {
                                    // Prioritize HD
                                    const hd = progressive.find(p => p.progressive_url && p.metadata?.quality === "HD");
                                    const fallback = progressive.find(p => p.progressive_url);
                                    if (!targetUrl) targetUrl = (hd || fallback)?.progressive_url;
                                }
                            });
                        });
                    });
                } catch (err) { /* ignore parse error for individual lines */ }
            });
            return targetUrl;
        } catch (e) {
            console.error('[FB-Downloader] Parse error', e);
            return null;
        }
    };

    // 3. Fetcher
    const fetchStoryBucket = async (bucketId, storyId) => {
        const tokens = getAuthTokens();
        if (!tokens || !tokens.uid || !tokens.fbag) {
            console.warn('[FB-Downloader] Missing tokens for GraphQL fetch.');
            return null;
        }

        const { uid, fbag } = tokens;

        const variables = {
            bucketIDs: [bucketId],
            scale: 2,
            blur: 10,
            shouldEnableArmadilloStoryReply: true,
            shouldEnableLiveInStories: true,
            feedbackSource: 65,
            useDefaultActor: false,
            feedLocation: "COMET_MEDIA_VIEWER",
            focusCommentID: null,
            shouldDeferLoad: false,
            isStoriesArchive: false,
            __relay_internal__pv__IsWorkUserrelayprovider: false
        };

        const body = new URLSearchParams();
        body.append("av", uid);
        body.append("__aaid", "0");
        body.append("__user", uid);
        body.append("__a", "1");
        body.append("__req", "t");
        body.append("fb_dtsg", fbag);
        body.append("fb_api_caller_class", "RelayModern");
        body.append("fb_api_req_friendly_name", "StoriesViewerBucketPrefetcherMultiBucketsQuery");
        body.append("variables", JSON.stringify(variables));
        body.append("server_timestamps", "true");
        body.append("doc_id", "9340191609394579");

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://www.facebook.com/api/graphql/",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Fb-Friendly-Name": "StoriesViewerBucketPrefetcherMultiBucketsQuery"
                },
                data: body.toString(),
                onload: (res) => {
                    const url = extractStoryVideoUrl(res.responseText, storyId);
                    resolve(url);
                },
                onerror: (err) => {
                    resolve(null);
                }
            });
        });
    };

    let storyBtn = null;
    let isDownloading = false;

    // --- Button Logic & Helpers ---
    const getStoryIdsFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p);
        const storiesIdx = parts.indexOf('stories');
        if (storiesIdx !== -1 && parts[storiesIdx + 1]) {
            return {
                bucketId: parts[storiesIdx + 1],
                cardId: parts[storiesIdx + 2] || null
            };
        }
        return null;
    };

    const getUsername = () => {
        const profilePic = document.querySelector("a[role=link][tabindex='0'][href*='https://www.facebook']>img");
        if (profilePic && profilePic.alt) return profilePic.alt;
        return 'facebook_user';
    };

    // Detect what is currently showing: Video or Image
    const getActiveStoryMediaType = () => {
        // 1. Check for Active Video
        const videos = document.querySelectorAll("video");
        const visibleVideos = [];

        for (const v of videos) {
            if (v.offsetHeight > 0) visibleVideos.push(v);
        }

        if (visibleVideos.length > 0) {
            // "Smart" Selection: Prefer the one with a source
            // Many users report "Could not determine URL" because we might pick a placeholder video tag.
            // Filter for ones with src or currentSrc
            const withSource = visibleVideos.filter(v => v.src || v.currentSrc);

            // If we found videos with sources, take the LAST one (mimics typical FB overlay behavior)
            // If none have source, fall back to the last visible one (waiting for load)
            const bestCandidate = withSource.length > 0 ? withSource[withSource.length - 1] : visibleVideos[visibleVideos.length - 1];

            console.log(`[FB-Downloader] Found ${visibleVideos.length} visible videos. Selected candidate has src: ${!!(bestCandidate.src || bestCandidate.currentSrc)}`);
            return { type: 'video', el: bestCandidate };
        }

        // 2. Check for Active Image
        const images = document.querySelectorAll("img[draggable=false]");
        for (let i = 0; i < images.length; i++) {
            if (images[i].offsetHeight > 300) return { type: 'image', el: images[i] };
        }
        return null;
    };

    const handleDownload = (url, ext, username) => {
        const safeUsername = username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const name = `01 dev/fb_story_${safeUsername}_${Date.now()}.${ext}`;

        GM_download({
            url: url,
            name: name,
            onload: () => {
                if (storyBtn) storyBtn.innerHTML = `${ICONS.download} Save Story`;
                isDownloading = false;
            },
            onerror: (err) => {
                alert('Download Error');
                if (storyBtn) storyBtn.innerHTML = `${ICONS.download} Error`;
                isDownloading = false;
            }
        });
    };

    const downloadStoryMedia = async () => {
        if (isDownloading) return;
        isDownloading = true;
        if (storyBtn) storyBtn.innerText = 'Checking...';

        const username = getUsername();
        const ids = getStoryIdsFromUrl();
        const activeMedia = getActiveStoryMediaType();

        console.log('[FB-Downloader] IDs:', ids);
        console.log('[FB-Downloader] Media Type:', activeMedia?.type);

        let targetUrl = null;
        let ext = 'jpg';

        // --- BRANCHING LOGIC ---
        if (activeMedia && activeMedia.type === 'video') {
            // It is a VIDEO. Use GraphQL to get HD Src.
            ext = 'mp4';
            if (storyBtn) storyBtn.innerText = 'Fetching HD...';

            if (ids && ids.bucketId) {
                const hdUrl = await fetchStoryBucket(ids.bucketId, ids.cardId);
                if (hdUrl) {
                    targetUrl = hdUrl;
                } else {
                    console.warn('[FB-Downloader] GraphQL failed/empty, failing back to DOM');
                }
            } else {
                console.warn('[FB-Downloader] No IDs found, using DOM');
            }

            // 2. Fallback to DOM (For Images or if GraphQL fails)
            // Retry logic for DOM: sometimes video takes a moment to initialize 'currentSrc'
            if (!targetUrl) {
                let attempts = 0;
                while (attempts < 5 && !targetUrl) {
                    if (attempts > 0) await new Promise(r => setTimeout(r, 500));

                    // Re-check active media in case it changed or initialized
                    const currentMedia = getActiveStoryMediaType();
                    if (currentMedia && currentMedia.type === 'video') {
                        // 1. Try currentSrc
                        if (currentMedia.el.currentSrc && !currentMedia.el.currentSrc.startsWith('blob:')) {
                            // Prefer non-blob if available, but blob is better than nothing for some cases
                            targetUrl = currentMedia.el.currentSrc;
                        } else if (currentMedia.el.currentSrc) {
                            targetUrl = currentMedia.el.currentSrc;
                        }

                        // 2. Try src attribute
                        if (!targetUrl && currentMedia.el.src) targetUrl = currentMedia.el.src;

                        // 3. Try child <source> elements
                        if (!targetUrl) {
                            const sources = currentMedia.el.querySelectorAll('source');
                            for (const s of sources) {
                                if (s.src) { targetUrl = s.src; break; }
                            }
                        }

                        if (targetUrl) console.log(`[FB-Downloader] Video DOM Fallback found on attempt ${attempts + 1}:`, targetUrl);
                    }
                    attempts++;
                }
            }

        } else if (activeMedia && activeMedia.type === 'image') {
            // It is an IMAGE. Use DOM Src (GraphQL unnecessary).
            ext = 'jpg';
            if (storyBtn) storyBtn.innerText = 'Saving Image...';
            targetUrl = activeMedia.el.src || activeMedia.el.currentSrc;
        } else {
            // Neither found?
            alert('Could not detect active story media.');
            isDownloading = false;
            if (storyBtn) storyBtn.innerHTML = `${ICONS.download} Save Story`;
            return;
        }

        if (targetUrl) {
            handleDownload(targetUrl, ext, username);
        } else {
            console.error('[FB-Downloader] Failed to determine URL. Details:', {
                activeMediaType: activeMedia?.type,
                foundElement: !!activeMedia?.el,
                ids: ids
            });

            let errorMsg = 'Could not determine download URL.';
            if (!activeMedia) {
                errorMsg = 'No active video or image detected. Please ensure the story is fully loaded.';
            } else if (activeMedia.type === 'video') {
                errorMsg = 'Found video element, but it has no source URL yet. Try playing the video and clicking again.';
            }

            alert(`[FB-Downloader Error]\n${errorMsg}\n\nCheck the console (F12) for more technical details.`);

            isDownloading = false;
            if (storyBtn) storyBtn.innerHTML = `${ICONS.download} Save Story`;
        }
    };

    const createStoryButton = () => {
        if (storyBtn) return; // Already exists
        if (!window.location.href.includes('/stories/')) return;

        storyBtn = document.createElement('button');
        storyBtn.className = 'fb-dl-btn fb-dl-story-btn';
        storyBtn.innerHTML = `${ICONS.download} Save Story`;

        storyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadStoryMedia();
        });

        document.body.appendChild(storyBtn);
    };

    // Remove story button if we leave stories
    const checkStoryContext = () => {
        if (!window.location.href.includes('/stories/')) {
            if (storyBtn) {
                storyBtn.remove();
                storyBtn = null;
            }
        } else {
            if (!storyBtn) createStoryButton();
        }
    };

    // --- Observer ---
    const observer = new MutationObserver((mutations) => {
        const isStory = window.location.href.includes('/stories/');

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.tagName === 'VIDEO') {
                        if (isStory) checkStoryContext(); // Check context instead of attaching
                        else createDownloadButton(node);
                    } else if (node.tagName === 'IMG' && isStory) {
                        // Do nothing for specific img nodes in story, we use global button
                        checkStoryContext();
                    } else {
                        // Check children
                        const videos = node.querySelectorAll('video');
                        videos.forEach(v => isStory ? checkStoryContext() : createDownloadButton(v));

                        if (isStory) checkStoryContext();
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const createDiscordButton = () => {
        if (document.querySelector('.fb-dl-discord-btn')) return;
        const btn = document.createElement('a');
        btn.className = 'fb-dl-btn fb-dl-discord-btn';
        btn.href = 'https://discord.gg/arVdGh76wj';
        btn.target = '_blank';
        btn.innerHTML = 'Join Discord';
        document.body.appendChild(btn);
    };

    // Initial Run
    createDiscordButton();
    const isStory = window.location.href.includes('/stories/');
    if (isStory) {
        checkStoryContext();
    } else {
        document.querySelectorAll('video').forEach(createDownloadButton);
    }

    // Warm up token (only needed for main posts, but harmless)
    getAccessToken();

})();
