// ==UserScript==
// @name         Universal Video Downloader
// @namespace    http://tampermonkey.net/
// @version      19.0
// @description  Download videos. Supports M3U8. Twitter API integration. Works everywhere.
// @author       Minoa
// @license      MIT
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/m3u8-parser@4.7.1/dist/m3u8-parser.min.js
// @require      https://cdn.jsdelivr.net/npm/@warren-bank/ffmpeg@0.12.10-wasmbinary.3/dist/umd/ffmpeg.js
// @resource     classWorkerURL  https://cdn.jsdelivr.net/npm/@warren-bank/ffmpeg@0.12.10-wasmbinary.3/dist/umd/258.ffmpeg.js
// @resource     coreURL         https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js
// @resource     wasmURL         https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      twitter.com
// @connect      x.com
// @connect      api.twitter.com
// @connect      api.x.com
// @connect      video.twimg.com
// @connect      pbs.twimg.com
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554755/Universal%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/554755/Universal%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // ICONS (UNICODE ONLY - NO EMOJIS)
    // ==========================================
    const ICONS = {
        down: '\u2193',
        menu: '\u2630',
        check: '\u2713',
        cross: '\u2715',
        info: '\u2139',
        eye: '\u2299',
        reload: '\u21BB',
        share: '\u2197',
        copy: '\u2398'
    };

    // ==========================================
    // CONFIGURATION
    // ==========================================
    let floatingButton = null;
    let hiddenToggle = null;

    let isHidden = GM_getValue('uvs_hidden', false);
    let pressStartTime = 0;
    let actionCycleIndex = 0;

    const detectedUrls = new Set();
    const allDetectedVideos = new Map();
    const downloadedBlobs = new Map();

    // Twitter video cache: tweetId -> video URLs
    const twitterVideoCache = new Map();

    const CONCURRENCY = 3;
    const MAX_RETRIES = 3;

    const checkMobile = (a) => {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));
    };
    const isMobile = checkMobile(navigator.userAgent || navigator.vendor || window.opera);
    const isTwitter = location.hostname.includes('twitter.com') || location.hostname.includes('x.com');

    const THEME = {
        bg: 'rgba(20, 20, 20, 0.75)',
        modalBg: 'rgba(30, 30, 30, 0.85)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        subText: '#aaaaaa',
        accent: '#d4a373',
        success: '#4ade80',
        error: '#f87171',
        info: '#60a5fa'
    };

    // ==========================================
    // STYLES
    // ==========================================
    GM_addStyle(`
        #uvs-container { position: fixed; top: 15px; left: 15px; width: 46px; height: 46px; z-index: 2147483647; isolation: isolate; pointer-events: auto; transition: opacity 0.3s; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        #uvs-float { position: absolute; top: 3px; left: 3px; width: 40px; height: 40px; background: ${THEME.bg}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); color: ${THEME.accent}; border: 1px solid ${THEME.border}; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s, background 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.3); user-select: none; }
        #uvs-float:hover { transform: scale(1.05); background: rgba(50, 50, 50, 0.9); }
        #uvs-svg { position: absolute; top: 0; left: 0; pointer-events: none; transform: rotate(-90deg); }

        #uvs-hidden-toggle {
            position: fixed; top: 10px; right: 10px; width: 18px; height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.4); background: rgba(0, 0, 0, 0.3);
            z-index: 2147483647; cursor: pointer; opacity: 0.5;
            transition: all 0.2s; border-radius: 4px;
        }
        #uvs-hidden-toggle:hover { opacity: 1; background: ${THEME.success}; border-color: #fff; transform: scale(1.1); }

        .uvs-notification { position: fixed; top: 75px; left: 15px; background: ${THEME.bg}; backdrop-filter: blur(12px); color: ${THEME.text}; padding: 10px 16px; border-radius: 12px; border: 1px solid ${THEME.border}; font-size: 13px; font-weight: 500; z-index: 2147483646; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.25); animation: uvs-slide-in 0.3s ease-out; }
        @keyframes uvs-slide-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

        #uvs-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
            z-index: 2147483645; display: flex; align-items: center; justify-content: center;
            opacity: 0; animation: uvs-fade-in 0.2s forwards;
        }
        @keyframes uvs-fade-in { to { opacity: 1; } }

        #uvs-modal {
            background: ${THEME.modalBg}; border: 1px solid ${THEME.border};
            border-radius: 16px; width: 550px; max-width: 90%; max-height: 80vh;
            display: flex; flex-direction: column;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            transform: scale(0.95); animation: uvs-scale-in 0.2s forwards;
        }
        @keyframes uvs-scale-in { to { transform: scale(1); } }

        .uvs-header {
            padding: 16px 20px; border-bottom: 1px solid ${THEME.border};
            display: flex; justify-content: space-between; align-items: center;
        }
        .uvs-title { font-size: 16px; font-weight: 600; color: ${THEME.text}; letter-spacing: 0.5px; }
        .uvs-close {
            background: transparent; border: none; color: ${THEME.subText};
            font-size: 20px; cursor: pointer; padding: 4px; line-height: 1;
            transition: color 0.2s;
        }
        .uvs-close:hover { color: ${THEME.text}; }

        .uvs-list { overflow-y: auto; padding: 0; margin: 0; }
        .uvs-item {
            padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05);
            cursor: pointer; display: flex; justify-content: space-between; align-items: center;
            transition: background 0.2s;
        }
        .uvs-item:hover { background: rgba(255,255,255,0.08); }
        .uvs-item:last-child { border-bottom: none; }

        .uvs-info { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; margin-right: 15px; }
        .uvs-filename {
            font-size: 14px; color: ${THEME.text}; font-weight: 500;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .uvs-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

        .uvs-badge {
            font-size: 10px; padding: 3px 6px; border-radius: 4px;
            background: rgba(255,255,255,0.1); color: ${THEME.subText};
            font-weight: 600; letter-spacing: 0.3px;
        }
        .uvs-badge.hd { background: rgba(96, 165, 250, 0.2); color: ${THEME.info}; }
        .uvs-badge.size { background: rgba(74, 222, 128, 0.2); color: ${THEME.success}; }
        .uvs-badge.fmt { background: rgba(212, 163, 115, 0.2); color: ${THEME.accent}; }

        .uvs-action {
            width: 32px; height: 32px; border-radius: 50%;
            background: rgba(255,255,255,0.05); display: flex;
            align-items: center; justify-content: center;
            color: ${THEME.text}; font-size: 16px;
            transition: all 0.2s;
        }
        .uvs-item:hover .uvs-action { background: ${THEME.accent}; color: #000; }

        /* Twitter Button Styles */
        .uvs-tw-btn {
            display: flex; align-items: center; justify-content: center;
            width: 34px; height: 34px; border-radius: 999px; cursor: pointer;
            color: rgb(113, 118, 123); transition: 0.2s;
            background: transparent; border: none; padding: 0;
        }
        .uvs-tw-btn:hover { background: rgba(29, 155, 240, 0.1); color: rgb(29, 155, 240); }
        .uvs-tw-btn svg { width: 18.75px; height: 18.75px; fill: currentColor; }
        .uvs-tw-btn.loading svg { animation: uvs-spin 1s linear infinite; }
        .uvs-tw-btn.success { color: ${THEME.success}; }
        .uvs-tw-btn.error { color: ${THEME.error}; }
        @keyframes uvs-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `);

    // ==========================================
    // HELPERS
    // ==========================================
    const VIDEO_EXT = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m4v'];

    function sanitizeFilename(name) {
        return (name || 'video').replace(/[<>:"\/\\|?*\x00-\x1F]/g, '').replace(/\s+/g, '_').substring(0, 150);
    }

    function getFilenameFromUrl(url) {
        try {
            const pathname = new URL(url).pathname;
            const name = pathname.substring(pathname.lastIndexOf('/') + 1);
            return decodeURIComponent(name) || 'video.mp4';
        } catch(e) { return 'video.mp4'; }
    }

    function resolveUrl(baseUrl, relativeUrl) {
        try { return new URL(relativeUrl, baseUrl).href; } catch (e) { return relativeUrl; }
    }

    function formatBytes(bytes, decimals = 1) {
        if (!bytes) return '';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function formatDuration(seconds) {
        if (!seconds) return '';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : '';
    }

    // ==========================================
    // TWITTER VIDEO INTERCEPTION
    // ==========================================
    if (isTwitter) {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            try {
                const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;

                if (url && (url.includes('/TweetDetail') || url.includes('/TweetResultByRestId') ||
                    url.includes('/HomeTimeline') || url.includes('/UserTweets') ||
                    url.includes('/SearchTimeline') || url.includes('/ListLatestTweetsTimeline'))) {
                    const clone = response.clone();
                    clone.json().then(data => {
                        extractVideosFromAPIResponse(data);
                    }).catch(() => {});
                }
            } catch(e) {}

            return response;
        };

        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalXHROpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            this.addEventListener('load', function() {
                try {
                    if (this._url && (this._url.includes('/TweetDetail') || this._url.includes('/TweetResultByRestId') ||
                        this._url.includes('/HomeTimeline') || this._url.includes('/UserTweets'))) {
                        const data = JSON.parse(this.responseText);
                        extractVideosFromAPIResponse(data);
                    }
                } catch(e) {}
            });
            return originalXHRSend.apply(this, arguments);
        };
    }

    function extractVideosFromAPIResponse(data) {
        try {
            findVideosRecursively(data);
        } catch(e) {
            console.error('Error extracting videos:', e);
        }
    }

    function findVideosRecursively(obj, depth = 0) {
        if (depth > 20 || !obj) return;

        if (Array.isArray(obj)) {
            obj.forEach(item => findVideosRecursively(item, depth + 1));
            return;
        }

        if (typeof obj !== 'object') return;

        if (obj.rest_id && obj.legacy?.extended_entities?.media) {
            const tweetId = obj.rest_id;
            const media = obj.legacy.extended_entities.media;

            const videos = [];
            for (const m of media) {
                if ((m.type === 'video' || m.type === 'animated_gif') && m.video_info?.variants) {
                    const mp4s = m.video_info.variants.filter(v => v.content_type === 'video/mp4');
                    if (mp4s.length > 0) {
                        const best = mp4s.reduce((a, b) => (a.bitrate || 0) > (b.bitrate || 0) ? a : b);
                        videos.push({
                            url: best.url,
                            bitrate: best.bitrate || 0,
                            type: m.type
                        });
                    }
                }
            }

            if (videos.length > 0) {
                twitterVideoCache.set(tweetId, videos);
            }
        }

        if (obj.tweet?.rest_id) {
            findVideosRecursively(obj.tweet, depth + 1);
        }

        for (const key of Object.keys(obj)) {
            findVideosRecursively(obj[key], depth + 1);
        }
    }

    // ==========================================
    // TWITTER API INTEGRATION (FALLBACK)
    // ==========================================
    const TWITTER_BEARER = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

    function createTwitterHeaders() {
        return {
            'authorization': `Bearer ${TWITTER_BEARER}`,
            'x-csrf-token': getCookie('ct0'),
            'x-twitter-auth-type': 'OAuth2Session',
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': 'en',
            'content-type': 'application/json'
        };
    }

    async function fetchTweetDataGraphQL(tweetId) {
        const queryIds = [
            'xOhkmRac04YFZmOzU9PJHg',
            'B9_KmbkLhXt6jRwGjJrweg',
            'DJS3BdhUhcaEpZ7B7irJDg',
        ];

        const features = {
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "c9s_tweet_anatomy_moderator_badge_enabled": true,
            "tweetypie_unmention_optimization_enabled": true,
            "responsive_web_edit_tweet_api_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "view_counts_everywhere_api_enabled": true,
            "longform_notetweets_consumption_enabled": true,
            "responsive_web_twitter_article_tweet_consumption_enabled": true,
            "tweet_awards_web_tipping_enabled": false,
            "responsive_web_home_pinned_timelines_enabled": true,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "standardized_nudges_misinfo": true,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "longform_notetweets_rich_text_read_enabled": true,
            "longform_notetweets_inline_media_enabled": true,
            "responsive_web_graphql_exclude_directive_enabled": true,
            "verified_phone_label_enabled": false,
            "responsive_web_media_download_video_enabled": false,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "responsive_web_graphql_timeline_navigation_enabled": true,
            "responsive_web_enhance_cards_enabled": false
        };

        const variables = {
            "tweetId": tweetId,
            "withCommunity": false,
            "includePromotedContent": false,
            "withVoice": false
        };

        const fieldToggles = {
            "withArticleRichContentState": true,
            "withArticlePlainText": false,
            "withGrokAnalyze": false,
            "withDisallowedReplyControls": false
        };

        for (const queryId of queryIds) {
            try {
                const url = `https://x.com/i/api/graphql/${queryId}/TweetResultByRestId?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}&fieldToggles=${encodeURIComponent(JSON.stringify(fieldToggles))}`;

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: createTwitterHeaders(),
                        responseType: 'json',
                        onload: (res) => {
                            if (res.status >= 200 && res.status < 300 && res.response?.data) {
                                resolve(res.response);
                            } else {
                                reject(new Error(`Status ${res.status}`));
                            }
                        },
                        onerror: reject
                    });
                });

                return result;
            } catch(e) {
                console.log(`Query ${queryId} failed:`, e.message);
                continue;
            }
        }

        throw new Error('All GraphQL queries failed');
    }

    async function fetchTweetDataLegacy(tweetId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}&tweet_mode=extended&include_entities=true`,
                headers: createTwitterHeaders(),
                responseType: 'json',
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300 && res.response) {
                        resolve({ legacy: res.response });
                    } else {
                        reject(new Error(`Legacy API: ${res.status}`));
                    }
                },
                onerror: reject
            });
        });
    }

    function extractVideoUrlFromTweet(tweetData) {
        try {
            let result = tweetData?.data?.tweetResult?.result;
            if (!result) {
                result = tweetData;
            }

            const tweet = result?.tweet || result;
            const legacy = tweet?.legacy || tweet;
            const extendedEntities = legacy?.extended_entities || tweet?.extended_entities;

            if (!extendedEntities?.media) return null;

            const videos = [];
            for (const media of extendedEntities.media) {
                if (media.type === 'video' || media.type === 'animated_gif') {
                    const variants = media.video_info?.variants || [];
                    const mp4Variants = variants.filter(v => v.content_type === 'video/mp4');
                    if (mp4Variants.length > 0) {
                        const best = mp4Variants.reduce((a, b) => (a.bitrate || 0) > (b.bitrate || 0) ? a : b);
                        videos.push({
                            url: best.url,
                            type: media.type === 'animated_gif' ? 'gif' : 'video',
                            width: media.original_info?.width || 0,
                            height: media.original_info?.height || 0,
                            duration: media.video_info?.duration_millis ? media.video_info.duration_millis / 1000 : 0
                        });
                    }
                }
            }
            return videos.length > 0 ? videos : null;
        } catch (e) {
            console.error('Error extracting video URL:', e);
            return null;
        }
    }

    function getTweetIdFromElement(tweet) {
        const links = tweet.querySelectorAll('a[href*="/status/"]');
        for (const link of links) {
            const match = link.href.match(/\/status\/(\d+)/);
            if (match) return match[1];
        }

        const timeLink = tweet.querySelector('time')?.parentElement;
        if (timeLink?.href) {
            const match = timeLink.href.match(/\/status\/(\d+)/);
            if (match) return match[1];
        }

        const article = tweet.closest('article');
        if (article) {
            const allLinks = article.querySelectorAll('a');
            for (const link of allLinks) {
                const match = link.href?.match(/\/status\/(\d+)/);
                if (match) return match[1];
            }
        }

        return null;
    }

    function getUserIdFromTweet(tweet) {
        const userLink = tweet.querySelector('a[href^="/"][role="link"] span');
        if (userLink) {
            const text = userLink.textContent;
            if (text?.startsWith('@')) return text.substring(1);
        }

        const links = tweet.querySelectorAll('a[href^="/"]');
        for (const link of links) {
            const match = link.href.match(/^https?:\/\/[^\/]+\/([^\/\?]+)$/);
            if (match && !['home', 'explore', 'notifications', 'messages', 'i', 'settings'].includes(match[1])) {
                return match[1];
            }
        }

        return 'video';
    }

    // ==========================================
    // DETECTION LOGIC (ALL SITES)
    // ==========================================
    function scanDOM() {
        const elements = document.querySelectorAll('video, audio, source');
        elements.forEach(el => {
            const src = el.src || el.currentSrc;
            if (src && !src.startsWith('blob:') && !src.startsWith('data:')) {
                let width = 0, height = 0, duration = 0;
                if (el.tagName === 'VIDEO') {
                    width = el.videoWidth; height = el.videoHeight; duration = el.duration;
                } else if (el.tagName === 'SOURCE' && el.parentElement?.tagName === 'VIDEO') {
                    width = el.parentElement.videoWidth; height = el.parentElement.videoHeight; duration = el.parentElement.duration;
                }
                registerVideo({ type: 'direct', url: src, width, height, duration, source: 'DOM' });
            }
        });
    }

    function isM3U8(url) { return url && (url.includes('.m3u8') || url.includes('.m3u')); }
    function isVideoUrl(url) {
        if (!url || url.startsWith('blob:') || url.startsWith('data:')) return false;
        const clean = url.split('?')[0].toLowerCase();
        return VIDEO_EXT.some(ext => clean.endsWith(ext));
    }

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
        const response = await originalFetch.apply(this, args);
        if (url) {
            if (isM3U8(url)) {
                const clone = response.clone();
                clone.text().then(text => handleM3U8(url, text)).catch(() => {});
            } else if (isVideoUrl(url)) {
                registerVideo({ type: 'direct', url: url, source: 'Network' });
            }
        }
        return response;
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            try {
                if (url && isVideoUrl(url)) registerVideo({ type: 'direct', url: url, source: 'XHR' });
                if (url && (!this.responseType || this.responseType === 'text')) {
                    if (isM3U8(url) || (this.responseText && this.responseText.trim().startsWith('#EXTM3U'))) {
                        handleM3U8(url, this.responseText);
                    }
                }
            } catch(e) {}
        });
        return originalOpen.apply(this, arguments);
    };

    // ==========================================
    // REGISTRY
    // ==========================================
    function registerVideo(data) {
        const fullUrl = resolveUrl(location.href, data.url);
        if (allDetectedVideos.has(fullUrl)) {
            const existing = allDetectedVideos.get(fullUrl);
            if (!existing.width && data.width) existing.width = data.width;
            if (!existing.height && data.height) existing.height = data.height;
            if (!existing.duration && data.duration) existing.duration = data.duration;
            return;
        }
        if (data.url.includes('preview') && data.url.includes('.jpg')) return;

        const videoObj = {
            url: fullUrl,
            type: data.type,
            filename: getFilenameFromUrl(fullUrl),
            width: data.width || 0,
            height: data.height || 0,
            duration: data.duration || 0,
            size: data.size || 0,
            timestamp: Date.now(),
            manifest: data.manifest || null
        };
        allDetectedVideos.set(fullUrl, videoObj);
        updateButtonState();
    }

    function handleM3U8(url, content) {
        const fullUrl = resolveUrl(location.href, url);
        if (detectedUrls.has(fullUrl)) return;
        detectedUrls.add(fullUrl);

        try {
            const parser = new m3u8Parser.Parser();
            parser.push(content);
            parser.end();
            const manifest = parser.manifest;

            if (manifest.playlists && manifest.playlists.length > 0) return;

            let duration = 0;
            if (manifest.segments) manifest.segments.forEach(s => duration += s.duration);

            registerVideo({
                type: 'm3u8',
                url: fullUrl,
                manifest: manifest,
                duration: duration,
                size: 0,
                source: 'M3U8'
            });
        } catch(e) {}
    }

    // ==========================================
    // CLEAN UP DEAD VIDEOS
    // ==========================================
    function cleanupDeadVideos() {
        const currentVideos = new Set();
        
        // Check which video/source elements still exist
        document.querySelectorAll('video, source').forEach(el => {
            const src = el.src || el.currentSrc;
            if (src) currentVideos.add(src);
        });

        // Remove videos that no longer exist in the DOM
        for (const [url, video] of allDetectedVideos.entries()) {
            if (video.type === 'direct') {
                const stillExists = currentVideos.has(url) || 
                                   document.querySelector(`video[src="${url}"], source[src="${url}"]`);
                if (!stillExists) {
                    allDetectedVideos.delete(url);
                }
            }
        }
    }

    // ==========================================
    // SORTING & UI
    // ==========================================
    function getSortedVideos() {
        // Clean up before showing menu
        cleanupDeadVideos();
        
        return Array.from(allDetectedVideos.values()).sort((a, b) => {
            if (a.size > 0 || b.size > 0) return b.size - a.size;
            const resA = (a.width || 0) * (a.height || 0);
            const resB = (b.width || 0) * (b.height || 0);
            if (resB !== resA) return resB - resA;
            const durA = a.duration || 0;
            const durB = b.duration || 0;
            if (durB !== durA) return durB - durA;
            if (a.type === 'm3u8' && b.type !== 'm3u8') return -1;
            if (b.type === 'm3u8' && a.type !== 'm3u8') return 1;
            return b.timestamp - a.timestamp;
        });
    }

    function createUI() {
        if (floatingButton) return;

        hiddenToggle = document.createElement('div');
        hiddenToggle.id = 'uvs-hidden-toggle';
        hiddenToggle.title = 'Show Video Downloader (Alt+Shift+V)';
        if (!isHidden) hiddenToggle.style.display = 'none';
        hiddenToggle.onclick = () => toggleStealthMode(false);
        document.body.appendChild(hiddenToggle);

        const container = document.createElement('div');
        container.id = 'uvs-container';
        if (isHidden) container.style.display = 'none';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '46'); svg.setAttribute('height', '46');
        svg.id = 'uvs-svg';

        const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        track.setAttribute('cx', '23'); track.setAttribute('cy', '23');
        track.setAttribute('r', '21'); track.setAttribute('fill', 'none');
        track.setAttribute('stroke', THEME.success);
        track.setAttribute('stroke-width', '2');
        track.setAttribute('stroke-opacity', '0.25');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '23'); circle.setAttribute('cy', '23');
        circle.setAttribute('r', '21'); circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', THEME.success);
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('stroke-dasharray', '132');
        circle.setAttribute('stroke-dashoffset', '132');
        circle.setAttribute('stroke-linecap', 'round');

        svg.appendChild(track);
        svg.appendChild(circle);
        container.appendChild(svg);

        const btn = document.createElement('div');
        btn.id = 'uvs-float';
        btn.innerHTML = ICONS.down;
        btn.progressCircle = circle;

        let pressInterval;
        const startPress = (e) => {
            if (e.button !== 0 && e.type !== 'touchstart') return;
            pressStartTime = Date.now();
            pressInterval = setInterval(() => {
                const duration = Date.now() - pressStartTime;
                if (duration > 5000) btn.innerHTML = ICONS.eye;
            }, 100);
        };

        const endPress = (e) => {
            clearInterval(pressInterval);
            const duration = Date.now() - pressStartTime;
            updateButtonState();
            if (duration > 5000) toggleStealthMode(true);
            else if (duration < 500) handleClick();
        };

        btn.addEventListener('mousedown', startPress);
        btn.addEventListener('mouseup', endPress);
        btn.addEventListener('touchstart', startPress);
        btn.addEventListener('touchend', endPress);

        container.appendChild(btn);
        document.body.appendChild(container);
        floatingButton = btn;
    }

    function toggleStealthMode(hide) {
        if (hide === undefined) hide = !isHidden;
        isHidden = hide;
        GM_setValue('uvs_hidden', isHidden);
        const container = document.getElementById('uvs-container');
        if (hiddenToggle) hiddenToggle.style.display = isHidden ? 'block' : 'none';
        if (container) container.style.display = isHidden ? 'none' : 'block';
        if (!isHidden) notify('Restored');
    }

    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && (e.key === 'V' || e.key === 'v')) toggleStealthMode();
    });

    function handleClick() {
        const videos = getSortedVideos();
        if (videos.length === 0) notify(ICONS.cross + ' No videos', 'error');
        else if (videos.length === 1) processVideo(videos[0]);
        else showPopup(videos);
    }

    function updateButtonState() {
        if (allDetectedVideos.size > 0 && !floatingButton) createUI();
        if (floatingButton) floatingButton.innerHTML = allDetectedVideos.size > 1 ? ICONS.menu : ICONS.down;
    }

    function updateProgress(percent) {
        if (!floatingButton) return;
        floatingButton.progressCircle.setAttribute('stroke-dashoffset', 132 - (132 * percent / 100));
    }

    function notify(msg, type = 'info') {
        if (isHidden) return;
        const div = document.createElement('div');
        div.className = 'uvs-notification';
        let icon = ICONS.info;
        if (type === 'success') { div.style.borderColor = THEME.success; div.style.color = THEME.success; icon = ICONS.check; }
        if (type === 'error') { div.style.borderColor = THEME.error; div.style.color = THEME.error; icon = ICONS.cross; }

        div.innerHTML = `<span style="font-size:16px">${icon}</span> <span>${msg}</span>`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3500);
    }

    function showPopup(videos) {
        document.getElementById('uvs-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'uvs-overlay';

        const modal = document.createElement('div');
        modal.id = 'uvs-modal';

        const header = document.createElement('div');
        header.className = 'uvs-header';
        header.innerHTML = `
            <span class="uvs-title">Media Selection</span>
            <button class="uvs-close">${ICONS.cross}</button>
        `;
        header.querySelector('.uvs-close').onclick = () => overlay.remove();
        modal.appendChild(header);

        const list = document.createElement('div');
        list.className = 'uvs-list';

        videos.forEach(v => {
            const item = document.createElement('div');
            item.className = 'uvs-item';

            let badges = '';
            if (v.type === 'm3u8') badges += `<span class="uvs-badge fmt">STREAM</span>`;
            else badges += `<span class="uvs-badge fmt">MP4</span>`;

            if (v.width && v.height) {
                const isHD = v.width >= 1280 || v.height >= 720;
                badges += `<span class="uvs-badge ${isHD ? 'hd' : ''}">${v.width}x${v.height}</span>`;
            }
            if (v.duration) badges += `<span class="uvs-badge">${formatDuration(v.duration)}</span>`;
            if (v.size) badges += `<span class="uvs-badge size">${formatBytes(v.size)}</span>`;

            item.innerHTML = `
                <div class="uvs-info">
                    <div class="uvs-filename" title="${v.filename}">${v.filename}</div>
                    <div class="uvs-meta">${badges}</div>
                </div>
                <div class="uvs-action">${ICONS.down}</div>
            `;
            item.onclick = () => { overlay.remove(); processVideo(v); };
            list.appendChild(item);
        });

        modal.appendChild(list);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };
    }

    // ==========================================
    // DOWNLOAD LOGIC
    // ==========================================
    let ffmpegInstance = null;
    let ffmpegLoaded = false;
    let wasmBinaryCache = null;

    async function initFFmpeg() {
        if (ffmpegLoaded && ffmpegInstance) return ffmpegInstance;
        notify(ICONS.reload + ' Loading Engine...');
        try {
            if (!wasmBinaryCache) {
                const wasmURL = GM_getResourceURL('wasmURL', false);
                const resp = await fetch(wasmURL);
                wasmBinaryCache = await resp.arrayBuffer();
            }
            ffmpegInstance = new window.FFmpegWASM.FFmpeg();
            ffmpegInstance.on('progress', ({ progress }) => updateProgress(Math.round(progress * 100)));
            await ffmpegInstance.load({
                classWorkerURL: GM_getResourceURL('classWorkerURL', false),
                coreURL: GM_getResourceURL('coreURL', false),
                wasmBinary: wasmBinaryCache,
            });
            ffmpegLoaded = true;
            notify('Engine Ready', 'success');
            return ffmpegInstance;
        } catch(e) { notify('Engine Failed', 'error'); throw e; }
    }

    async function convertToMP4(tsBlob, filename) {
        const ffmpeg = await initFFmpeg();
        const inputName = 'input.ts';
        const outputName = filename.endsWith('.mp4') ? filename : filename + '.mp4';
        notify(ICONS.reload + ' Converting...');
        try {
            await ffmpeg.writeFile(inputName, new Uint8Array(await tsBlob.arrayBuffer()));
            await ffmpeg.exec(['-i', inputName, '-c', 'copy', '-movflags', 'faststart', outputName]);
            const data = await ffmpeg.readFile(outputName);
            await ffmpeg.deleteFile(inputName);
            await ffmpeg.deleteFile(outputName);
            return new Blob([data.buffer], { type: 'video/mp4' });
        } catch(e) { notify('Conversion Failed', 'error'); throw e; }
    }

    async function processVideo(video, customName = null) {
        const filename = customName || sanitizeFilename(document.title);
        if (video.type === 'direct') {
            handleFinalOutput(null, video.url, filename);
        } else {
            downloadM3U8(video, filename);
        }
    }

    async function downloadM3U8(video, filename) {
        if (downloadedBlobs.has(video.url)) return handleFinalOutput(downloadedBlobs.get(video.url), null, filename);

        notify(ICONS.reload + ' Downloading...');
        updateProgress(0);

        try {
            const segments = video.manifest.segments;
            const baseUrl = video.url;
            const results = new Array(segments.length);
            let completed = 0;
            let currentIndex = 0;
            let hasError = false;

            const worker = async () => {
                while (currentIndex < segments.length && !hasError) {
                    const i = currentIndex++;
                    const segUrl = resolveUrl(baseUrl, segments[i].uri);
                    let attempts = 0;
                    let success = false;
                    while(attempts < MAX_RETRIES && !success) {
                        try {
                            const res = await fetch(segUrl);
                            if (!res.ok) throw new Error(`Status ${res.status}`);
                            results[i] = await res.arrayBuffer();
                            success = true;
                        } catch(e) {
                            attempts++;
                            if (attempts === MAX_RETRIES) { hasError = true; throw e; }
                            await new Promise(r => setTimeout(r, 1000));
                        }
                    }
                    completed++;
                    updateProgress(Math.round((completed / segments.length) * 100));
                }
            };

            const workers = [];
            for (let k = 0; k < CONCURRENCY; k++) workers.push(worker());
            await Promise.all(workers);

            if (hasError) throw new Error("Network errors");

            notify(ICONS.reload + ' Stitching...');
            const mergedBlob = new Blob(results, { type: 'video/mp2t' });
            const mp4Blob = await convertToMP4(mergedBlob, filename);
            downloadedBlobs.set(video.url, mp4Blob);

            handleFinalOutput(mp4Blob, null, filename);
            updateProgress(0);
            notify('Complete', 'success');
        } catch(e) {
            notify('Error: ' + e.message, 'error');
            updateProgress(0);
        }
    }

    function handleFinalOutput(blob, url, filename) {
        const finalName = filename.endsWith('.mp4') ? filename : filename + '.mp4';

        const modes = isMobile
            ? ['share', 'copy', 'download']
            : ['copy', 'share', 'download'];

        const currentMode = modes[actionCycleIndex % 3];
        actionCycleIndex++;

        if (currentMode === 'share') {
            if (!navigator.share) {
                notify('Share not supported', 'error');
                return;
            }

            const shareData = { title: finalName };
            if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], finalName, { type: 'video/mp4' })] })) {
                shareData.files = [new File([blob], finalName, { type: 'video/mp4' })];
            } else {
                shareData.text = url || "Video File";
            }

            const startTime = Date.now();
            navigator.share(shareData)
                .then(() => notify('Shared', 'success'))
                .catch((err) => {
                    const elapsed = Date.now() - startTime;
                    if (elapsed < 300) {
                        notify('Share Error', 'error');
                    }
                });
            return;
        }

        if (currentMode === 'copy') {
            const textToCopy = url || "Video Blob (Cannot copy blob URL)";
            navigator.clipboard.writeText(textToCopy)
                .then(() => notify('Link Copied', 'success'))
                .catch(() => notify('Copy Failed', 'error'));
            return;
        }

        if (currentMode === 'download') {
            try {
                const downloadUrl = blob ? URL.createObjectURL(blob) : url;
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = finalName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    if(blob) URL.revokeObjectURL(downloadUrl);
                }, 1000);
                notify('Saved to Disk', 'success');
            } catch(e) {
                notify('Download Error', 'error');
            }
            return;
        }
    }

    // ==========================================
    // TWITTER DOWNLOAD FUNCTION
    // ==========================================
    async function downloadTwitterVideo(btn, tweetId, userId) {
        btn.classList.add('loading');
        btn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

        try {
            let videos = null;

            if (twitterVideoCache.has(tweetId)) {
                console.log('Using cached video URL');
                videos = twitterVideoCache.get(tweetId);
            }

            if (!videos) {
                try {
                    console.log('Trying GraphQL API...');
                    const tweetData = await fetchTweetDataGraphQL(tweetId);
                    videos = extractVideoUrlFromTweet(tweetData);
                } catch(e) {
                    console.log('GraphQL failed:', e.message);
                }
            }

            if (!videos) {
                try {
                    console.log('Trying Legacy API...');
                    const legacyData = await fetchTweetDataLegacy(tweetId);
                    videos = extractVideoUrlFromTweet(legacyData);
                } catch(e) {
                    console.log('Legacy API failed:', e.message);
                }
            }

            if (!videos) {
                console.log('Trying page scrape...');
                videos = findVideoInPage(tweetId);
            }

            if (!videos || videos.length === 0) {
                throw new Error('No video found');
            }

            const video = videos[0];
            const filename = `${userId}_${tweetId}.mp4`;

            let videoUrl = video.url;
            if (videoUrl.includes('?')) {
                const urlObj = new URL(videoUrl);
                videoUrl = urlObj.origin + urlObj.pathname;
            }

            const response = await fetch(videoUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();

            handleFinalOutput(blob, videoUrl, filename);

            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`;
            setTimeout(() => {
                btn.classList.remove('success');
                btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 16l5.7-5.7-1.41-1.42L13 12.17V4h-2v8.17L7.71 8.88 6.3 10.3 12 16zm9-1l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg>`;
            }, 2000);

        } catch (e) {
            console.error('Twitter download error:', e);
            btn.classList.remove('loading');
            btn.classList.add('error');
            btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
            setTimeout(() => {
                btn.classList.remove('error');
                btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 16l5.7-5.7-1.41-1.42L13 12.17V4h-2v8.17L7.71 8.88 6.3 10.3 12 16zm9-1l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg>`;
            }, 2000);
        }
    }

    function findVideoInPage(tweetId) {
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            const src = video.src || video.currentSrc;
            if (src && src.includes('video.twimg.com') && src.includes('.mp4')) {
                const tweet = video.closest('article[data-testid="tweet"]');
                if (tweet) {
                    const id = getTweetIdFromElement(tweet);
                    if (id === tweetId) {
                        return [{ url: src, type: 'video' }];
                    }
                }
            }
        }

        const sources = document.querySelectorAll('source');
        for (const source of sources) {
            const src = source.src;
            if (src && src.includes('video.twimg.com')) {
                const tweet = source.closest('article[data-testid="tweet"]');
                if (tweet) {
                    const id = getTweetIdFromElement(tweet);
                    if (id === tweetId) {
                        return [{ url: src, type: 'video' }];
                    }
                }
            }
        }

        return null;
    }

    // ==========================================
    // TWITTER BUTTON INJECTION
    // ==========================================
    function hasVideoContent(tweet) {
        if (tweet.querySelector('div[data-testid="videoPlayer"]')) return true;
        if (tweet.querySelector('video')) return true;
        const images = tweet.querySelectorAll('img[src*="tweet_video_thumb"]');
        if (images.length > 0) return true;
        const videoThumbs = tweet.querySelectorAll('img[src*="ext_tw_video_thumb"], img[src*="amplify_video_thumb"]');
        if (videoThumbs.length > 0) return true;
        return false;
    }

    function addTwitterDownloadButtons() {
        const tweets = document.querySelectorAll('article[data-testid="tweet"]');

        tweets.forEach(tweet => {
            const actionGroup = tweet.querySelector('div[role="group"]');
            if (!actionGroup || actionGroup.querySelector('.uvs-tw-btn')) return;

            if (!hasVideoContent(tweet)) return;

            const tweetId = getTweetIdFromElement(tweet);
            const userId = getUserIdFromTweet(tweet);

            if (!tweetId) return;

            const btn = document.createElement('button');
            btn.className = 'uvs-tw-btn';
            btn.title = 'Download Video';
            btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 16l5.7-5.7-1.41-1.42L13 12.17V4h-2v8.17L7.71 8.88 6.3 10.3 12 16zm9-1l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg>`;

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!btn.classList.contains('loading')) {
                    downloadTwitterVideo(btn, tweetId, userId);
                }
            };

            actionGroup.appendChild(btn);
        });
    }

    // ==========================================
    // INIT
    // ==========================================
    setInterval(scanDOM, 2000);
    const obs = new MutationObserver(scanDOM);
    
    const startObserver = () => {
        if (document.body) {
            obs.observe(document.body, { childList: true, subtree: true });
            scanDOM();
        } else {
            setTimeout(startObserver, 100);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

    if (isTwitter) {
        const twitterObserver = new MutationObserver(() => {
            addTwitterDownloadButtons();
        });

        const startTwitterObserver = () => {
            if (document.body) {
                twitterObserver.observe(document.body, { childList: true, subtree: true });
                addTwitterDownloadButtons();
            } else {
                setTimeout(startTwitterObserver, 100);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startTwitterObserver);
        } else {
            startTwitterObserver();
        }
    }

})();