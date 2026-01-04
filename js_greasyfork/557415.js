// ==UserScript==
// @name        Chinese spyware
// @namespace   lilith is a whore lil
// @match       https://x.com/*
// @match       https://twitter.com/*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      Lizzy, Lily
// @description for faggots n faggots only :3
// @require     https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js
// @require     https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js
// @require     https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/utc.js
// @connect     raw.githubusercontent.com
// @connect     twitter.com
// @connect     x.com
// @connect     pbs.twimg.com
// @connect     video.twimg.com
// @downloadURL https://update.greasyfork.org/scripts/557415/Chinese%20spyware.user.js
// @updateURL https://update.greasyfork.org/scripts/557415/Chinese%20spyware.meta.js
// ==/UserScript==

(function() {
    "use strict";
    function faggotmenu() {
        let root = document.body.querySelector('[id="react-root"]');
        if (!root) return;
        let layers = root.firstChild.firstChild.querySelector('[id="layers"]');
        if (!layers) return;
        let group = layers.lastChild.firstChild.firstChild.firstChild.querySelector('[role="group"]');
        group?.firstChild?.firstChild?.click();
    }

    function clipboardz(url) {
        navigator.clipboard.writeText(url);
        faggotmenu();
    }


    const lilyisawhorepleaseputthemdowntheyareanastymutt = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.firstChild?.lastChild?.matches('[data-testid="Dropdown"]')) {
                    AddToDropdown(node.firstChild.lastChild);
                }
            });
        });
    });

    lilyisawhorepleaseputthemdowntheyareanastymutt.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: ["style"]
    });

    dayjs.extend(dayjs_plugin_utc);

dayjs.extend(dayjs_plugin_utc);

(function () {
    "use strict";

    const enableDownloadHistorykSync = false;
    const generateFilename = (filenameElements, mediaTypeLabel, index, ext) => {
        const { userId, userName, postId, postTime } = filenameElements;
        const formattedPostTime = dayjs(postTime).format('YYYYMMDD_HHmmss');
        return `${userId}-${postId}-${mediaTypeLabel}${index}.${ext}`;
    };

    const gmFetch = (infoOrUrl, options = {}) =>
        new Promise((resolve, reject) => {
            const info = typeof infoOrUrl === 'string' ? { url: infoOrUrl } : { ...infoOrUrl };

            info.method = options.method || info.method || 'GET';
            info.headers = options.headers || info.headers || {};
            if (options.body) info.data = options.body;
            info.responseType = options.responseType;

            info.onload = res => {
                resolve({
                    ok:       res.status >= 200 && res.status < 300,
                    status:   res.status,
                    response: res.response,
                    json:     () => Promise.resolve(res.response),
                    text:     () => Promise.resolve(
                         typeof res.response === 'string' ? res.response : JSON.stringify(res.response)
                       ),
                    blob:     () => Promise.resolve(new Blob([res.response]))
                });
            };
            info.onerror = (error) => {
                console.error("GM_xmlhttpRequest error:", error);
                reject(new Error(`GM_xmlhttpRequest failed: status=${error.status}, statusText=${error.statusText || 'N/A'}`));
            };
            info.onabort = () => reject(new Error('GM_xmlhttpRequest aborted'));
            info.ontimeout = () => reject(new Error('GM_xmlhttpRequest timed out'));

            GM_xmlhttpRequest(info);
        });

    const API_INFO_STORAGE_KEY = 'twitterInternalApiInfo';
    const LAST_UPDATE_DATE_STORAGE_KEY = 'twitterApiInfoLastUpdateDate';
    const API_DOC_URL = 'https://raw.githubusercontent.com/fa0311/TwitterInternalAPIDocument/refs/heads/master/docs/json/API.json';

    let currentApiInfo = null;

    const loadApiInfoFromLocalStorage = () => {
        const savedApiInfoJson = localStorage.getItem(API_INFO_STORAGE_KEY);
        if (savedApiInfoJson) {
            try {
                const savedInfo = JSON.parse(savedApiInfoJson);
                return savedInfo;
            } catch (e) {
                localStorage.removeItem(API_INFO_STORAGE_KEY);
            }
        }
        return null;
    };

    const fetchAndSaveApiInfo = async (currentDateString) => {
        try {
            const response = await gmFetch(API_DOC_URL, {
                method: "GET",
                responseType: "json"
            });

            if (response.ok) {
                const apiDoc = response.response;

                const tweetResultByRestIdInfo = apiDoc.graphql?.TweetResultByRestId;
                const bookmarkSearchTimelineInfo = apiDoc.graphql?.BookmarkSearchTimeline;
                const bearerTokenFromDoc = apiDoc.header?.authorization;

                if (tweetResultByRestIdInfo?.url && tweetResultByRestIdInfo?.features &&
                    bookmarkSearchTimelineInfo?.url && bookmarkSearchTimelineInfo?.features &&
                    bearerTokenFromDoc) {

                    const extractedApiInfo = {
                        TweetResultByRestId: tweetResultByRestIdInfo,
                        BookmarkSearchTimeline: bookmarkSearchTimelineInfo,
                        bearerToken: bearerTokenFromDoc
                    };

                    currentApiInfo = extractedApiInfo;
                    localStorage.setItem(API_INFO_STORAGE_KEY, JSON.stringify(currentApiInfo));
                    localStorage.setItem(LAST_UPDATE_DATE_STORAGE_KEY, currentDateString);

                } else {
                    const savedInfoBeforeFetch = loadApiInfoFromLocalStorage();
                    if(savedInfoBeforeFetch) currentApiInfo = savedInfoBeforeFetch;
                }
            } else {
                const savedInfoBeforeFetch = loadApiInfoFromLocalStorage();
                if(savedInfoBeforeFetch) currentApiInfo = savedInfoBeforeFetch;
            }
        } catch (error) {
             const savedInfoBeforeFetch = loadApiInfoFromLocalStorage();
             if(savedInfoBeforeFetch) currentApiInfo = savedInfoBeforeFetch;
        }
    };

    const initializeApiInfo = () => {
        const lastUpdateDate = localStorage.getItem(LAST_UPDATE_DATE_STORAGE_KEY);
        const today = dayjs().format('YYYY-MM-DD');

        const savedApiInfo = loadApiInfoFromLocalStorage();

        if (lastUpdateDate !== today || !savedApiInfo) {
            if(savedApiInfo){
                 currentApiInfo = savedApiInfo;
             } else {}
            fetchAndSaveApiInfo(today);
        } else {
            currentApiInfo = savedApiInfo;
        }
    };

    initializeApiInfo();

    const DB_NAME = 'DownloadHistoryDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'downloadedPosts';

    let dbPromise = null;
    let downloadedPostsCache = new Set();

    const openDB = () => {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = function(event) {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'postId' });
                }
            };
            request.onsuccess = function() {
                resolve(request.result);
            };
            request.onerror = function() {
                reject(request.error);
            };
        });
        return dbPromise;
    };

    const loadDownloadedPostsCache = () => {
        getDownloadedPostIdsIndexedDB()
          .then(ids => {
              downloadedPostsCache = new Set(ids);
          })
          .catch(err => console.error("IndexedDB 読み込みエラー:", err));
    };

    const getDownloadedPostIdsIndexedDB = () => {
        return openDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.getAllKeys();
                request.onsuccess = function() {
                    resolve(request.result);
                };
                request.onerror = function() {
                    reject(request.error);
                };
            });
        });
    };

    const markPostAsDownloadedIndexedDB = (postId) => {
        return openDB().then(db => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ postId: postId });
                request.onsuccess = function() {
                    downloadedPostsCache.add(postId);
                    resolve();
                };
                request.onerror = function() {
                    reject(request.error);
                };
            });
        });
    };

    loadDownloadedPostsCache();

    const isMobile = /android|iphone|ipad|mobile/.test(navigator.userAgent.toLowerCase());
    const isAppleMobile = /iphone|ipad/.test(navigator.userAgent.toLowerCase());
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36';
//userAgent is a faggot
    const createApiHeaders = () => {
        const GUEST_AUTHORIZATION = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

        const headers = {
            'authorization':            GUEST_AUTHORIZATION,
            'x-csrf-token':             getCookie('ct0'),
            'x-twitter-client-language': 'en',
            'x-twitter-active-user':     'yes',
            'content-type':              'application/json'
        };

        const guestToken = getCookie('gt');
        if (guestToken) {
            headers['x-guest-token'] = guestToken;
        } else {
            headers['x-twitter-auth-type'] = 'OAuth2Session';
        }

        return headers;
    };

    const getCurrentLanguage = () => document.documentElement.lang || 'en';
    const getMainTweetUrl = (cell) => {
        let timeEl = cell.querySelector('article[data-testid="tweet"] a[href*="/status/"][role="link"] time');
        if (timeEl && timeEl.parentElement) return timeEl.parentElement.href;
        return cell.querySelector('article[data-testid="tweet"] a[href*="/status/"]')?.href || "";
    };
    const getCookie = (name) => {
        const cookies = Object.fromEntries(document.cookie.split(';').filter(n => n.includes('=')).map(n => n.split('=').map(decodeURIComponent).map(s => s.trim())));
        return name ? cookies[name] : cookies;
    };
    const getMediaInfoFromUrl = (url) => {
        if (url.includes('pbs.twimg.com/media/')) {
            const extMatch = url.match(/format=([a-zA-Z0-9]+)/);
            const ext = extMatch ? extMatch[1] : 'jpg';
            return { ext: ext, typeLabel: 'img' };
        } else if (url.includes('video.twimg.com/ext_tw_video/') || url.includes('video.twimg.com/tweet_video/') || url.includes('video.twimg.com/amplify_video/')) {
            let ext = 'mp4';
            if (!url.includes('pbs.twimg.com/tweet_video/')) {
                const pathMatch = url.split('?')[0].match(/\.([a-zA-Z0-9]+)$/);
                if (pathMatch) ext = pathMatch[1];
            }
            const typeLabel = url.includes('tweet_video') ? 'gif' : 'video';
            return { ext: ext, typeLabel: typeLabel };
        }
        return { ext: 'jpg', typeLabel: 'img' };
    };

   const fetchTweetDetailWithGraphQL = async (postId) => {
       const TWEET_RESULT_BY_REST_ID_QUERY_ID = "zAz9764BcLZOJ0JU2wrd1A";

       const TWEET_DETAIL_FEATURES = {
           "creator_subscriptions_tweet_preview_api_enabled": true, "premium_content_api_read_enabled": false,
           "communities_web_enable_tweet_community_results_fetch": true, "c9s_tweet_anatomy_moderator_badge_enabled": true,
           "responsive_web_grok_analyze_button_fetch_trends_enabled": false, "responsive_web_grok_analyze_post_followups_enabled": false,
           "responsive_web_jetfuel_frame": false, "responsive_web_grok_share_attachment_enabled": true,
           "articles_preview_enabled": true, "responsive_web_edit_tweet_api_enabled": true,
           "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "view_counts_everywhere_api_enabled": true,
           "longform_notetweets_consumption_enabled": true, "responsive_web_twitter_article_tweet_consumption_enabled": true,
           "tweet_awards_web_tipping_enabled": false, "responsive_web_grok_show_grok_translated_post": false,
           "responsive_web_grok_analysis_button_from_backend": false, "creator_subscriptions_quote_tweet_preview_enabled": false,
           "freedom_of_speech_not_reach_fetch_enabled": true, "standardized_nudges_misinfo": true,
           "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "longform_notetweets_rich_text_read_enabled": true,
           "longform_notetweets_inline_media_enabled": true, "profile_label_improvements_pcf_label_in_post_enabled": true,
           "rweb_tipjar_consumption_enabled": true, "verified_phone_label_enabled": false,
           "responsive_web_grok_image_annotation_enabled": true, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
           "responsive_web_graphql_timeline_navigation_enabled": true, "responsive_web_enhance_cards_enabled": false
       };

       const TWEET_DETAIL_FIELD_TOGGLES = {
           "withArticleRichContentState": true, "withArticlePlainText": false,
           "withGrokAnalyze": false, "withDisallowedReplyControls": false
       };

       const variables = {
           "tweetId": postId, "withCommunity": false,
           "includePromotedContent": false, "withVoice": false
       };

       const urlBase = `https://x.com/i/api/graphql/${TWEET_RESULT_BY_REST_ID_QUERY_ID}/TweetResultByRestId`;
       const urlObj = new URL(urlBase);
       urlObj.searchParams.set("variables", JSON.stringify(variables));
       urlObj.searchParams.set("features", JSON.stringify(TWEET_DETAIL_FEATURES));
       urlObj.searchParams.set("fieldToggles", JSON.stringify(TWEET_DETAIL_FIELD_TOGGLES));
       const url = urlObj.toString();

       const headers = createApiHeaders();
       if (!headers) {
           throw new Error('API headers not available.');
       }

       const res = await gmFetch(url, { headers, responseType: 'json' });
       if (!res.ok) throw new Error(`TweetDetail failed: ${res.status}`);

       return res.json();
   };

   const fetchBookmarkSearchTimeline = async (userId, postTime) => {
        const BOOKMARK_SEARCH_TIMELINE_QUERY_ID = "6u3VcFdASPZrP2wkuU3C3A";

        const BOOKMARK_SEARCH_FEATURES = {
            "rweb_video_screen_enabled": false,
            "payments_enabled": false,
            "profile_label_improvements_pcf_label_in_post_enabled": true,
            "rweb_tipjar_consumption_enabled": true,
            "verified_phone_label_enabled": false,
            "creator_subscriptions_tweet_preview_api_enabled": true,
            "responsive_web_graphql_timeline_navigation_enabled": true,
            "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
            "premium_content_api_read_enabled": false,
            "communities_web_enable_tweet_community_results_fetch": true,
            "c9s_tweet_anatomy_moderator_badge_enabled": true,
            "responsive_web_grok_analyze_button_fetch_trends_enabled": false,
            "responsive_web_grok_analyze_post_followups_enabled": true,
            "responsive_web_jetfuel_frame": true,
            "responsive_web_grok_share_attachment_enabled": true,
            "articles_preview_enabled": true,
            "responsive_web_edit_tweet_api_enabled": true,
            "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
            "view_counts_everywhere_api_enabled": true,
            "longform_notetweets_consumption_enabled": true,
            "responsive_web_twitter_article_tweet_consumption_enabled": true,
            "tweet_awards_web_tipping_enabled": false,
            "responsive_web_grok_show_grok_translated_post": false,
            "responsive_web_grok_analysis_button_from_backend": false,
            "creator_subscriptions_quote_tweet_preview_enabled": false,
            "freedom_of_speech_not_reach_fetch_enabled": true,
            "standardized_nudges_misinfo": true,
            "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
            "longform_notetweets_rich_text_read_enabled": true,
            "longform_notetweets_inline_media_enabled": true,
            "responsive_web_grok_image_annotation_enabled": true,
            "responsive_web_grok_community_note_auto_translation_is_enabled": false,
            "responsive_web_enhance_cards_enabled": false
        };

        const headers = createApiHeaders();
        if (!headers) {
             return null;
        }

        const formattedSinceTime = dayjs(postTime).utc().format('YYYY-MM-DD_HH:mm:ss_UTC');
        const formattedUntilTime = dayjs(postTime).utc().add(1, 'second').format('YYYY-MM-DD_HH:mm:ss_UTC');
        const rawQuery = `from:${userId} since:${formattedSinceTime} until:${formattedUntilTime}`;
        const variables = { "rawQuery": rawQuery, "count":20 };

        const apiUrl = `https://x.com/i/api/graphql/${BOOKMARK_SEARCH_TIMELINE_QUERY_ID}/BookmarkSearchTimeline`;
        const url = encodeURI(`${apiUrl}?variables=${JSON.stringify(variables)}&features=${JSON.stringify(BOOKMARK_SEARCH_FEATURES)}`);

        return gmFetch(url, { headers, responseType: 'json' }).then(res => res.json());
    };

    const twdlcss = `
　　 span[id^="ezoic-pub-ad-placeholder-"], .ez-sidebar-wall, span[data-ez-ph-id], .ez-sidebar-wall-ad, .ez-sidebar-wall {display:none !important}
    .tmd-down {margin-left: 2px !important; order: 99; justify-content: inherit; display: inline-grid; transform: rotate(0deg) scale(1) translate3d(0px, 0px, 0px);}
    .tmd-down:hover > div > div > div > div {color: rgba(29, 161, 242, 1.0);}
    .tmd-down:hover > div > div > div > div > div {background-color: rgba(29, 161, 242, 0.1);}
    .tmd-down:active > div > div > div > div > div {background-color: rgba(29, 161, 242, 0.2);}
    .tmd-down:hover svg {color: rgba(29, 161, 242, 1.0);}
    .tmd-down:hover div:first-child:not(:last-child) {background-color: rgba(29, 161, 242, 0.1);}
    .tmd-down:active div:first-child:not(:last-child) {background-color: rgba(29, 161, 242, 0.2);}
    .tmd-down g {display: none;}
    .tmd-down.download g.download, .tmd-down.loading g.loading, .tmd-down.failed g.failed, .tmd-down.completed g.completed {display: unset;}
    .tmd-down.loading svg g.loading {animation: spin 1s linear infinite !important; transform-box: fill-box; transform-origin: center;}
    @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);} }
    .tweet-detail-action-item {width: 20% !important;}
    `;
    const newStyle = document.createElement('style');
    newStyle.id = 'twdlcss';
    newStyle.innerHTML = twdlcss;
    document.head.parentNode.insertBefore(newStyle, document.head);

    const getNoImageMessage = () => {
        const lang = getCurrentLanguage();
        return lang === 'ja' ? "このツイートには画像または動画がありません！" : "There is no image or video in this tweet!";
    };

    const getAlreadyBookmarkedMessage = () => {
        const lang = getCurrentLanguage();
        if (lang === 'ja') {
            return window.confirm(
                'この投稿は既にダウンロードされています。\nダウンロードを続行しますか？'
            );
        } else {
            return window.confirm(
                'This post is already downloaded.\nDo you want to continue downloading?'
            );
        }
    };

    const status = (btn, css) => {
        btn.classList.remove('download', 'loading', 'failed', 'completed');
        if (css) btn.classList.add(css);
    };

    const getValidMediaElements = (cell) => {
        let validImages = [], validVideos = [], validGifs = [];

        validImages = Array.from(cell.querySelectorAll("img[src^='https://pbs.twimg.com/media/']"))
            .filter(img => (
                !img.closest("div[tabindex='0'][role='link']") &&
                !img.closest("div[data-testid='previewInterstitial']")
            ));

        const videoCandidates_videoTag = Array.from(cell.querySelectorAll("video"));
        videoCandidates_videoTag.forEach(video => {
            if (video.closest("div[tabindex='0'][role='link']")) return;
            if (!video.closest("div[data-testid='videoPlayer']")) return;
            if (video.src?.startsWith("https://video.twimg.com/tweet_video")) {
                validGifs.push(video);
            } else if (video.poster?.includes("/ext_tw_video_thumb/") || video.poster?.includes("/amplify_tw_video_thumb/") || video.poster?.includes("/amplify_video_thumb/") || video.poster?.includes("/media/")) {
                validVideos.push(video);
            }
        });

        const videoCandidates_imgTag = Array.from(cell.querySelectorAll("img[src]"));
        videoCandidates_imgTag.forEach(img => {
            if (img.closest("div[tabindex='0'][role='link']")) return;
            if (!img.closest("div[data-testid='previewInterstitial']")) return;
            if (img.src.startsWith("https://pbs.twimg.com/tweet_video_thumb/")) {
                validGifs.push(img);
            } else if (img.src.includes("/ext_tw_video_thumb/") ||img.src.includes("/amplify_tw_video_thumb/") || img.src.includes("/amplify_video_thumb/") || img.src.includes("/media/")) {
                validVideos.push(img);
            }
        });
        return { images: validImages, videos: validVideos, gifs: validGifs };
    };

    const getTweetFilenameElements = (url, cell) => {
        const match = url.match(/^https?:\/\/(?:twitter\.com|x\.com)\/([^\/]+)\/status\/(\d+)/);
        if (!match) return null;

        const userNameContainer = cell.querySelector("div[data-testid='User-Name'] div[dir='ltr'] span");
        const postTimeElement = cell.querySelector("article[data-testid='tweet'] a[href*='/status/'][role='link'] time");

        let userName = 'unknown';
        if (userNameContainer) {
            userName = '';
            userNameContainer.querySelectorAll('*').forEach(el => {
                userName += el.nodeName === 'IMG' ? el.alt : (el.nodeName === 'SPAN' ? el.textContent : '');
            });
            userName = userName.trim();
        }

        return {
            userId: match[1],
            userName: userName || 'unknown',
            postId: match[2],
            postTime: postTimeElement?.getAttribute('datetime') || 'unknown'
        };
    };

    const getMediaURLs = async (cell, filenameElements) => {
        const mediaElems = getValidMediaElements(cell);
        const imageURLs = mediaElems.images.map(img => img.src.includes("name=") ? img.src.replace(/name=.*/ig, 'name=4096x4096') : img.src);
        let gifURLs = mediaElems.gifs.map(gif => gif.src);
        let videoURLs = [];

        gifURLs = gifURLs.map(gifURL => {
            if (gifURL.startsWith("https://pbs.twimg.com/tweet_video_thumb/")) {
                const gifIdBaseUrl = gifURL.split('?')[0];
                const gifId = gifIdBaseUrl.split('/').pop();
                return `https://video.twimg.com/tweet_video/${gifId}.mp4`;
            }
            return gifURL;
        });

        if (mediaElems.videos.length > 0) {
            const tweet_res = await fetchTweetDetailWithGraphQL(filenameElements.postId);
            if (!tweet_res.data) return { imageURLs: [], gifURLs: [], videoURLs: [] };
            const tweet_result = tweet_res.data.tweetResult.result;
            const tweet_obj = tweet_result.tweet || tweet_result;
            tweet_obj.extended_entities = tweet_obj.extended_entities || tweet_obj.legacy?.extended_entities;
            const extEntities = tweet_obj.extended_entities;

            if (extEntities?.media) {
                videoURLs = extEntities.media
                    .filter(media => media.type === 'video' && media.video_info?.variants)
                    .map(media => media.video_info.variants.filter(variant => variant.content_type === 'video/mp4').reduce((prev, current) => (prev.bitrate > current.bitrate) ? prev : current, media.video_info.variants[0])?.url)
                    .filter(url => url);
            } else if (tweet_obj.card?.legacy?.binding_values) {
                const unifiedCardBinding = tweet_obj.card.legacy.binding_values.find(bv => bv.key === 'unified_card');
                if (unifiedCardBinding?.value?.string_value) {
                    try {
                        const unifiedCard = JSON.parse(unifiedCardBinding.value.string_value);
                        if (unifiedCard.media_entities) {
                            videoURLs = Object.values(unifiedCard.media_entities)
                                .filter(media => media.type === 'video' && media.video_info?.variants)
                                .map(media => media.video_info.variants.filter(variant => variant.content_type === 'video/mp4').reduce((prev, current) => (prev.bitrate > current.bitrate) ? prev : current, media.video_info.variants[0])?.url)
                                .filter(url => url);
                        }
                    } catch (e) {
                        console.error("Error parsing unified_card JSON:", e);
                    }
                }
            }
        }
        return { imageURLs: imageURLs, gifURLs: gifURLs, videoURLs: videoURLs };
    };

    const checkBookmarkStatus = async (userId, postId, postTime) => {
        if (!enableDownloadHistorykSync) {
            return false;
        }
        try {
            const bookmarkData = await fetchBookmarkSearchTimeline(userId, postTime);
            if (!bookmarkData.data) {
                console.log("ブックマーク状態の確認に失敗　APIなし");
                return false;}
            const instructions = bookmarkData.data.search_by_raw_query.bookmarks_search_timeline.timeline.instructions;
            if (!instructions) return false;

            for (const instruction of instructions) {
                if (instruction.type === 'TimelineAddEntries' && instruction.entries) {
                    for (const entry of instruction.entries) {
                        if (entry.entryId && entry.entryId === `tweet-${postId}`) {
                            return true;
                        }
                    }
                }
            }
            return false;
        } catch (error) {
            console.error("ブックマーク状態の確認に失敗:", error);
            return false;
        }
    };

    const clickBookmarkButton = (cell) => {
        if (!enableDownloadHistorykSync) {
            return;
        }
        const btn_group = cell.querySelector('div[role="group"]:last-of-type, ul.tweet-actions, ul.tweet-detail-actions');
        if (btn_group) {
            const bookmarkButton = btn_group.querySelector('button[data-testid="bookmark"]');
            if (bookmarkButton) {
                bookmarkButton.click();
            }
        }
    };

    const waitForBookmarkStateChange = (cell) => {
        return new Promise(resolve => {
            if (!enableDownloadHistorykSync && !isAppleMobile) {
                resolve();
                return;
            }
            const btn_group = cell.querySelector('div[role="group"]:last-of-type, ul.tweet-actions, ul.tweet-detail-actions');
            const bookmarkButton = btn_group ? btn_group.querySelector('button[data-testid="bookmark"]') : null;
            if (!bookmarkButton) {
                resolve();
                return;
            }
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-testid') {
                        if (bookmarkButton.dataset.testid === 'removeBookmark') {
                            observer.disconnect();
                            setTimeout(() => resolve(), 500);
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        });
    };

    const downloadZipArchive = async (blobs, filenameElements, mediaURLs, cell, bookmarkPromise) => {
        const files = {};
        const filenames = blobs.map((_, index) => {
            const mediaInfo = getMediaInfoFromUrl(mediaURLs[index]);
            const ext = mediaInfo.ext;
            const typeLabel = mediaInfo.typeLabel;
            return generateFilename(filenameElements, typeLabel, index + 1, ext);
        });
        const uint8Arrays = await Promise.all(blobs.map(blob => blobToUint8Array(blob)));
        uint8Arrays.forEach((uint8Array, index) => {
            files[filenames[index]] = uint8Array;
        });

        const zipData = await new Promise((resolve, reject) => {
            fflate.zip(files, { level: 0 }, (err, zipData) => {
                if (err) {
                    console.error("ZIP archive creation failed:", err);
                    alert("ZIPファイルの作成に失敗しました。");
                    reject(err);
                } else {
                    resolve(zipData);
                }
            });
        });

        const zipBlob = new Blob([zipData], { type: 'application/zip' });
        const zipDataUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        const zipFilename = generateFilename(filenameElements, 'medias', '', 'zip');
        a.download = zipFilename;
        a.href = zipDataUrl;

        if (enableDownloadHistorykSync && isAppleMobile) {
            clickBookmarkButton(cell);
            await bookmarkPromise;
        }

        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(zipDataUrl);
    };

    const downloadBlobAsFile = async (blob, filename, cell, bookmarkPromise) => {
        const dataUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = filename;
        a.href = dataUrl;

        if (enableDownloadHistorykSync && isAppleMobile) {
            clickBookmarkButton(cell);
            await bookmarkPromise;
        }

        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(dataUrl);
    };

    const blobToUint8Array = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();

        let pureArrayBuffer;
        try {
            pureArrayBuffer = structuredClone(arrayBuffer);
            console.log("structuredClone による複製に成功");
        } catch (e) {
            console.warn("structuredClone に失敗、元の ArrayBuffer を使用します:", e);
            pureArrayBuffer = arrayBuffer;
        }
        return new Uint8Array(pureArrayBuffer);
    };

    const downloadMediaWithFetchStream = async (mediaSrcURL) => {
        const headers = { 'User-Agent': userAgent };
        try {
            const res = await gmFetch(mediaSrcURL, { headers, responseType: 'blob' });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            return await res.blob();

        } catch (error) {
            return null;
        }
    };

    const downloadMedia = async (imageURLs, gifURLs, videoURLs, filenameElements, btn_down, allMediaURLs, cell, bookmarkPromise) => {
        const mediaCount = imageURLs.length + gifURLs.length + videoURLs.length;

        if (mediaCount === 1) {
            let mediaURL;
            if (imageURLs.length === 1) mediaURL = imageURLs[0];
            else if (gifURLs.length === 1) mediaURL = gifURLs[0];
            else mediaURL = videoURLs[0];
            const blob = await downloadMediaWithFetchStream(mediaURL);
            if (blob) {
                const mediaInfo = getMediaInfoFromUrl(mediaURL);
                const ext = mediaInfo.ext;
                const typeLabel = mediaInfo.typeLabel;
                const filename = generateFilename(filenameElements, typeLabel, 1, ext);
                await downloadBlobAsFile(blob, filename, cell, bookmarkPromise);
                markPostAsDownloadedIndexedDB(filenameElements.postId);
                setTimeout(() => {
                    status(btn_down, 'completed');
                    if (enableDownloadHistorykSync && !isAppleMobile) clickBookmarkButton(cell);
                }, 300);
            } else {
                status(btn_down, 'failed');
                setTimeout(() => status(btn_down, 'download'), 3000);
            }
        } else if (mediaCount > 1) {
            const downloadPromises = [...imageURLs, ...gifURLs, ...videoURLs].map(url => downloadMediaWithFetchStream(url));
            const blobs = (await Promise.all(downloadPromises)).filter(blob => blob);

            if (blobs.length === mediaCount) {
                if (isMobile) {
                    await downloadZipArchive(blobs, filenameElements, allMediaURLs, cell, bookmarkPromise);
                } else {
                    for (const [index, blob] of blobs.entries()) {
                    const mediaURL = allMediaURLs[index];
                    const mediaInfo = getMediaInfoFromUrl(mediaURL);
                    const ext = mediaInfo.ext;
                    const typeLabel = mediaInfo.typeLabel;
                    const filename = generateFilename(filenameElements, typeLabel, index + 1, ext);
                    await downloadBlobAsFile(blob, filename, cell, bookmarkPromise);
                    }
                }
                markPostAsDownloadedIndexedDB(filenameElements.postId);
                setTimeout(() => {
                    status(btn_down, 'completed');
                    if (enableDownloadHistorykSync && !isAppleMobile) clickBookmarkButton(cell);
                }, 300);
            } else {
                status(btn_down, 'failed');
                setTimeout(() => status(btn_down, 'download'), 3000);
            }
        }
    };

    const createDownloadButton = async (cell) => {

        let btn_group = cell.querySelector('div[role="group"]:last-of-type, ul.tweet-actions, ul.tweet-detail-actions');
        if (!btn_group) return;
        let btn_share = Array.from(btn_group.querySelectorAll(':scope>div>div, li.tweet-action-item>a, li.tweet-detail-action-item>a')).pop().parentNode;
        if (!btn_share) return;

        let btn_bookmark = btn_share.previousElementSibling;
        let isBookmarked = false;
        if (enableDownloadHistorykSync) {
            if (btn_bookmark) {
                const bookmarkButtonTestId = btn_bookmark.querySelector('button[data-testid="bookmark"], button[data-testid="removeBookmark"]')?.dataset.testid;
                isBookmarked = bookmarkButtonTestId === 'removeBookmark';
            }
        }

        let btn_down = btn_share.cloneNode(true);
        btn_down.classList.add('tmd-down', 'download');
        const btnElem = btn_down.querySelector('button');
        if (btnElem) btnElem.removeAttribute('disabled');

         const lang = getCurrentLanguage();
        if (btn_down.querySelector('button')) btn_down.querySelector('button').title = lang === 'ja' ? '画像と動画をダウンロード' : 'Download images and videos';

        btn_down.querySelector('svg').innerHTML = `
            <g class="download"><path d="M12 16 17.7 10.3 16.29 8.88 13 12.18 V2.59 h-2 v9.59 L7.7 8.88 6.29 10.3 Z M21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" fill="currentColor" stroke="currentColor" stroke-width="0.20" stroke-linecap="round" /></g>
            <g class="loading"><circle cx="12" cy="12" r="10" fill="none" stroke="#1DA1F2" stroke-width="4" opacity="0.4" /><path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="#1DA1F2" stroke-width="4" stroke-linecap="round" /></g>
            <g class="failed"><circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8" /><path d="M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4" fill="#fff" stroke="none" /></g>
            <g class="completed"><path d="M21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z M 7 10 l 3 4 q 1 1 2 0 l 8 -11 l -1.65 -1.2 l -7.35 10.1063 l -2.355 -3.14" fill="rgba(29, 161, 242, 1)" stroke="#1DA1F2" stroke-width="0.20" stroke-linecap="round" /></g>
        `;

        const filenameElements = getTweetFilenameElements(getMainTweetUrl(cell), cell);
        if (filenameElements) {
             if (downloadedPostsCache.has(filenameElements.postId)) {
                 status(btn_down, 'completed');
             }
             else if (enableDownloadHistorykSync && isBookmarked) {
                 status(btn_down, 'completed');
                 markPostAsDownloadedIndexedDB(filenameElements.postId);
             }
        }

        btn_down.onclick = async () => {
            if (btn_down.classList.contains('loading')) return;

            let buttonStateBeforeClick = '';
            if (btn_down.classList.contains('completed')) {
                buttonStateBeforeClick = 'completed';
            } else {
                buttonStateBeforeClick = 'download';
            }

            status(btn_down, 'loading');

            const mainTweetUrl = getMainTweetUrl(cell);
            const filenameElements = getTweetFilenameElements(mainTweetUrl, cell);
            if (!filenameElements) {
                alert("ツイート情報を取得できませんでした。");
                status(btn_down, 'download');
                return;
            }

            if (enableDownloadHistorykSync && buttonStateBeforeClick !== 'completed') {
                const isAlreadyBookmarked = await checkBookmarkStatus(filenameElements.userId, filenameElements.postId, filenameElements.postTime);
                if (isAlreadyBookmarked) {
                    const shouldProceed = getAlreadyBookmarkedMessage();
                    if (!shouldProceed) {
                        status(btn_down, 'completed');
                        markPostAsDownloadedIndexedDB(filenameElements.postId);
                        return;
                    }
                }
            }

            const bookmarkPromise = waitForBookmarkStateChange(cell);

            const mediaData = await getMediaURLs(cell, filenameElements);
            const imageURLs = mediaData.imageURLs;
            const gifURLs = mediaData.gifURLs;
            const videoURLs = mediaData.videoURLs;
            const mediaCount = imageURLs.length + gifURLs.length + videoURLs.length;
            const mediaUrls = [...imageURLs, ...gifURLs, ...videoURLs];

            if (mediaCount === 0) {
                alert(getNoImageMessage());
                status(btn_down, 'download');
                return;
            }
            downloadMedia(imageURLs, gifURLs, videoURLs, filenameElements, btn_down, mediaUrls, cell, bookmarkPromise);
        };
        if (btn_group) btn_group.insertBefore(btn_down, btn_share.nextSibling);

        try {
          function createInlineEmbedBtn(label, testid, urlPrefix) {
    const iconBtn = btn_share.cloneNode(true);
    iconBtn.classList.add("tmd-down");

    const btnElement = iconBtn.querySelector("button");
    if (btnElement) btnElement.removeAttribute("disabled");
    if (btnElement) btnElement.title = label;

    const span = iconBtn.querySelector("span");
    if (span) span.textContent = "";

    const svgElem = iconBtn.querySelector("svg");
      if (svgElem) {
    svgElem.setAttribute("viewBox", "0 0 24 24");
    svgElem.innerHTML = `
        <g class="embed-icon">
            <path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path>
        </g>
    `;
}
const styleFix = document.createElement("style");
styleFix.innerHTML = `
    .tmd-down g.embed-icon {
        display: unset !important;
    }
`;
document.head.appendChild(styleFix);

    iconBtn.setAttribute("data-testid", testid);

    iconBtn.onclick = () => {
        const mainTweetUrlLocal = getMainTweetUrl(cell);
        if (!mainTweetUrlLocal) return;

        try {
            const u = new URL(mainTweetUrlLocal, location.href);
            let path = (u.pathname || "") + (u.search || "");
            path = path.replace(/^\/+/, "");
            if (urlPrefix.endsWith("/")) urlPrefix = urlPrefix.slice(0, -1);
            const embedUrl = urlPrefix + "/" + path;
            clipboardz(embedUrl);
        } catch (e) {
            let ct = mainTweetUrlLocal;
            ct = ct.replace(/^https?:\/\//, "");
            if (urlPrefix.endsWith("/")) urlPrefix = urlPrefix.slice(0, -1);
            const embedUrl = urlPrefix + "/" + ct.replace(/^\/+/, "");
            clipboardz(embedUrl);
        }
    };

    return iconBtn;
}

const fxInlineBtn = createInlineEmbedBtn(
    "Copy as fxtwitter embed",
    "fxtwitterEmbedInline",
    "https://fxtwitter.com"
);

const gcxInlineBtn = createInlineEmbedBtn(
    "Copy as girlcockx embed",
    "girlcockxEmbedInline",
    "https://girlcockx.com"
);

if (btn_group) {
    btn_group.insertBefore(fxInlineBtn, btn_down.nextSibling);
    btn_group.insertBefore(gcxInlineBtn, fxInlineBtn.nextSibling);
}

        } catch (err) {
            console.error('something got fucked up at:', err);
        }

    };

    const processArticles = () => {
        const cells = document.querySelectorAll('[data-testid="cellInnerDiv"]');
        cells.forEach(cell => {
            const mainTweet = cell.querySelector('article[data-testid="tweet"]');
            if (!mainTweet) return;
            const tweetUrl = getMainTweetUrl(cell);
            if (!getTweetFilenameElements(tweetUrl, cell)) return;
            const mediaElems = getValidMediaElements(cell);
            const mediaCount = mediaElems.images.length + mediaElems.videos.length + mediaElems.gifs.length;
            if (!cell.querySelector('.tmd-down') && mediaCount > 0) createDownloadButton(cell);
        });
    };

    const observer = new MutationObserver(processArticles);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', processArticles);
    window.addEventListener('popstate', processArticles);
    window.addEventListener('hashchange', processArticles);

})();

})();
