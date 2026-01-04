// ==UserScript==
// @name        Twitter/X 推特媒体下载交互优化（点击图点赞并下载、据id链接标签重命名，指定文件夹）
// @name:en     Twitter/X Media Downloader（Click images,download renaming based on ID, URL, hashtags，Custom Folder）
// @namespace   http://tampermonkey.net/
// @version     4.1
// @description 单击图片点赞并下载，支持自定义文件夹归档（需要开启油猴高级设置在下载选项中打开浏览器api）。双击查看原图。
// @description:en Click images to like & download with auto-renaming and custom folder support (Requires enabling "Browser API" in Tampermonkey settings)
// @author      Gemini (Based on previous versions)
// @match       https://x.com/*
// @match       https://twitter.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant       GM_addStyle
// @grant       GM_download
// @grant       GM_info
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/556412/TwitterX%20%E6%8E%A8%E7%89%B9%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96%EF%BC%88%E7%82%B9%E5%87%BB%E5%9B%BE%E7%82%B9%E8%B5%9E%E5%B9%B6%E4%B8%8B%E8%BD%BD%E3%80%81%E6%8D%AEid%E9%93%BE%E6%8E%A5%E6%A0%87%E7%AD%BE%E9%87%8D%E5%91%BD%E5%90%8D%EF%BC%8C%E6%8C%87%E5%AE%9A%E6%96%87%E4%BB%B6%E5%A4%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556412/TwitterX%20%E6%8E%A8%E7%89%B9%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96%EF%BC%88%E7%82%B9%E5%87%BB%E5%9B%BE%E7%82%B9%E8%B5%9E%E5%B9%B6%E4%B8%8B%E8%BD%BD%E3%80%81%E6%8D%AEid%E9%93%BE%E6%8E%A5%E6%A0%87%E7%AD%BE%E9%87%8D%E5%91%BD%E5%90%8D%EF%BC%8C%E6%8C%87%E5%AE%9A%E6%96%87%E4%BB%B6%E5%A4%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= CONFIGURATION / 配置区域 =================

    // 1. Enable folder organization? (true: ON, false: OFF)
    //    If enabled, files will be saved to: Browser Default Download Folder / Your Folder Name /
    // 1. 是否开启文件夹归档功能？ (true: 开启, false: 关闭)
    //    开启后，文件会下载到：浏览器默认下载目录 / 你的文件夹名 / 下
    const ENABLE_FOLDER = true;

    // 2. Custom folder name (Supports English and Chinese)
    //    Example: 'Twitter_Images'
    //    Note: Do not use special characters like \ / : * ? " < > |
    // 2. 自定义文件夹名称 (支持中文)
    //    注意：不要包含 \ / : * ? " < > | 等特殊符号
    const FOLDER_NAME = 'twitter';

    // 3. API Configuration (Do not modify unless Twitter updates)
    // 3. API 配置 (无需修改，除非推特更新了接口)
    const GRAPHQL_ID = 'zAz9764BcLZOJ0JU2wrd1A';
    const API_BASE = `https://x.com/i/api/graphql/${GRAPHQL_ID}/TweetResultByRestId`;
    const MAX_FILENAME_LENGTH = 200;

    // ================= END CONFIGURATION / 配置结束 =================

    console.log(`🚀 Twitter Enhancer v4.1 Loaded | Folder Mode: ${ENABLE_FOLDER ? 'ON (' + FOLDER_NAME + ')' : 'OFF'}`);

    // ================= 样式注入 (Styles) =================
    GM_addStyle(`
        /* Cursor pointer for images */
        [data-testid="tweetPhoto"] img {
            cursor: pointer !important;
            transition: transform 0.2s !important;
        }
        [data-testid="tweetPhoto"] img:hover {
            transform: scale(1.02);
        }

        /* Like Animation */
        @keyframes likeAnimation { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .wb-like-animation { animation: likeAnimation 0.3s ease !important; }

        /* Toast Notification */
        #wb-download-toast {
            position: fixed; bottom: 20px; right: 20px; background: #1d9bf0; color: white;
            padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 999999; font-size: 14px; display: none; max-width: 300px; line-height: 1.4;
            pointer-events: none;
        }
        #wb-download-toast.show { display: block; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    `);

    // ================= 工具函数 (Utils) =================
    let downloadToast = null;
    const downloadedTweets = new Set();

    function createToast() {
        if (document.getElementById('wb-download-toast')) return;
        downloadToast = document.createElement('div');
        downloadToast.id = 'wb-download-toast';
        document.body.appendChild(downloadToast);
    }

    function showToast(message, duration = 3000) {
        if (!downloadToast) createToast();
        downloadToast.innerHTML = message.replace(/\n/g, '<br>');
        downloadToast.classList.add('show');
        setTimeout(() => downloadToast.classList.remove('show'), duration);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    }

    function getTweetIdFromDom(element) {
        const tweetArticle = element.closest('article[data-testid="tweet"]');
        if (!tweetArticle) return null;

        const links = tweetArticle.querySelectorAll('a[href*="/status/"]');
        let tweetUrl = null;
        let mainId = null;

        for (const link of links) {
            const href = link.getAttribute('href');
            if (href && href.includes('/status/') && !href.includes('/i/status/')) {
                tweetUrl = 'https://x.com' + href;
                const match = href.match(/\/status\/(\d+)/);
                if (match) mainId = match[1];
                break;
            }
        }

        const sourceLink = tweetArticle.querySelector('a[href*="/i/status/"]');
        let sourceId = null;
        if (sourceLink) {
            const sourceMatch = sourceLink.getAttribute('href').match(/\/status\/(\d+)/);
            if (sourceMatch) {
                sourceId = sourceMatch[1];
            }
        }

        if (!mainId) return null;

        return {
            id: mainId,
            sourceId: sourceId,
            article: tweetArticle,
            fallbackUrl: tweetUrl
        };
    }

    // ================= API Logic =================
    const createTweetUrl = (tweetId) => {
        const variables = { tweetId, with_rux_injections: false, rankingMode: 'Relevance', includePromotedContent: true, withCommunity: true, withQuickPromoteEligibilityTweetFields: true, withBirdwatchNotes: true, withVoice: true };
        const features = { "articles_preview_enabled": true, "c9s_tweet_anatomy_moderator_badge_enabled": true, "communities_web_enable_tweet_community_results_fetch": false, "creator_subscriptions_quote_tweet_preview_enabled": false, "creator_subscriptions_tweet_preview_api_enabled": false, "freedom_of_speech_not_reach_fetch_enabled": true, "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "longform_notetweets_consumption_enabled": false, "longform_notetweets_inline_media_enabled": true, "longform_notetweets_rich_text_read_enabled": false, "premium_content_api_read_enabled": false, "profile_label_improvements_pcf_label_in_post_enabled": true, "responsive_web_edit_tweet_api_enabled": false, "responsive_web_enhance_cards_enabled": false, "responsive_web_graphql_exclude_directive_enabled": false, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false, "responsive_web_graphql_timeline_navigation_enabled": false, "responsive_web_grok_analysis_button_from_backend": false, "responsive_web_grok_analyze_button_fetch_trends_enabled": false, "responsive_web_grok_analyze_post_followups_enabled": false, "responsive_web_grok_image_annotation_enabled": false, "responsive_web_grok_share_attachment_enabled": false, "responsive_web_grok_show_grok_translated_post": false, "responsive_web_jetfuel_frame": false, "responsive_web_media_download_video_enabled": false, "responsive_web_twitter_article_tweet_consumption_enabled": true, "rweb_tipjar_consumption_enabled": true, "rweb_video_screen_enabled": false, "standardized_nudges_misinfo": true, "tweet_awards_web_tipping_enabled": false, "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "tweetypie_unmention_optimization_enabled": false, "verified_phone_label_enabled": false, "view_counts_everywhere_api_enabled": true };
        const fieldToggles = { withArticleRichContentState: true, withArticlePlainText: false, withGrokAnalyze: false, withDisallowedReplyControls: false };
        return `${API_BASE}?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}&fieldToggles=${encodeURIComponent(JSON.stringify(fieldToggles))}`;
    };

    const fetchTweetData = async (tweetId) => {
        const url = createTweetUrl(tweetId);
        // Using common public bearer token for Twitter Web Client
        const headers = {
            authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
            'x-twitter-active-user': 'yes',
            'x-twitter-client-language': getCookie('lang') || 'en',
            'x-csrf-token': getCookie('ct0') || ''
        };
        try {
            const response = await fetch(url, { method: 'GET', headers });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return parseTweetData(data, tweetId);
        } catch (error) {
            console.error('Fetch Error:', error);
            return null;
        }
    };

    const extractMedia = (legacy) => {
        if (!legacy) return [];
        const mediaEntities = legacy.extended_entities?.media || legacy.entities?.media || [];

        return mediaEntities.flatMap((item) => {
            if (item.type === 'photo') {
                return [item.media_url_https + '?name=orig'];
            }
            if (item.type === 'video' || item.type === 'animated_gif') {
                const variants = item.video_info?.variants || [];
                const mp4s = variants.filter(v => v.content_type === 'video/mp4');
                if (mp4s.length === 0) return [];
                if (item.type === 'animated_gif') {
                    return mp4s[0].url ? [mp4s[0].url] : [];
                } else {
                    mp4s.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                    return mp4s[0].url ? [mp4s[0].url] : [];
                }
            }
            return [];
        });
    };

    const parseTweetData = (data, inputTweetId) => {
        let rootTweet = data?.data?.tweetResult?.result;
        if (!rootTweet) {
            const instructions = data?.data?.threaded_conversation_with_injections_v2?.instructions || [];
            const tweetEntry = instructions[0]?.entries?.find(e => e.entryId === `tweet-${inputTweetId}`);
            rootTweet = tweetEntry?.content?.itemContent?.tweet_results?.result;
        }
        if (!rootTweet) return null;

        const outerCore = rootTweet.core || rootTweet.tweet?.core;
        const outerLegacy = rootTweet.legacy || rootTweet.tweet?.legacy;

        if (outerLegacy && outerCore) {
            const outerMedia = extractMedia(outerLegacy);
            if (outerMedia.length > 0) {
                return {
                    mediaUrls: outerMedia,
                    via: null,
                    origin: {
                        nick: outerCore.user_results?.result?.legacy?.name || 'unknown',
                        id: outerCore.user_results?.result?.legacy?.screen_name || 'unknown',
                        tweetId: outerLegacy.id_str || inputTweetId,
                        hashtags: (outerLegacy.entities?.hashtags || []).map(t => t.text).join('-')
                    }
                };
            }
        }

        let innerTweet = null;
        if (rootTweet.legacy && rootTweet.legacy.retweeted_status_result) {
            innerTweet = rootTweet.legacy.retweeted_status_result.result;
        } else if (rootTweet.quoted_status_result) {
            innerTweet = rootTweet.quoted_status_result.result;
        }

        if (innerTweet) {
            const innerCore = innerTweet.core || innerTweet.tweet?.core;
            const innerLegacy = innerTweet.legacy || innerTweet.tweet?.legacy;
            if (innerCore && innerLegacy) {
                const innerMedia = extractMedia(innerLegacy);
                if (innerMedia.length > 0) {
                    return {
                        mediaUrls: innerMedia,
                        via: {
                            nick: outerCore?.user_results?.result?.legacy?.name || 'unknown',
                            id: outerCore?.user_results?.result?.legacy?.screen_name || 'unknown',
                            tweetId: outerLegacy?.id_str || inputTweetId
                        },
                        origin: {
                            nick: innerCore.user_results?.result?.legacy?.name || 'unknown',
                            id: innerCore.user_results?.result?.legacy?.screen_name || 'unknown',
                            tweetId: innerLegacy.id_str || inputTweetId,
                            hashtags: (innerLegacy.entities?.hashtags || []).map(t => t.text).join('-')
                        }
                    };
                }
            }
        }
        return null;
    };

    // ================= Download Logic =================
    async function downloadMedia(domData) {
        const { id: domTweetId, sourceId } = domData;
        const targetId = sourceId || domTweetId;

        if (downloadedTweets.has(targetId)) return;
        downloadedTweets.add(targetId);
        setTimeout(() => downloadedTweets.delete(targetId), 5000);

        showToast('🔍 Analyzing...');
        const apiResult = await fetchTweetData(targetId);

        if (!apiResult || apiResult.mediaUrls.length === 0) {
            showToast('⚠️ No media found');
            return;
        }

        const { mediaUrls, via, origin } = apiResult;
        showToast(`📥 Downloading ${mediaUrls.length} items...`);

        let count = 0;
        for (const url of mediaUrls) {
            count++;
            const ext = url.includes('.mp4') ? 'mp4' : 'jpg';
            const indexStr = mediaUrls.length > 1 ? `_${count}` : '';

            let prefix = '';
            if (via && !sourceId) {
                const safeViaNick = sanitize(via.nick);
                prefix = `RT [${safeViaNick}-${via.id}] - `;
            }

            const safeOrgNick = sanitize(origin.nick);
            const tagStr = origin.hashtags ? `-${origin.hashtags}` : '';

            let filename = `${prefix}[${safeOrgNick}-${origin.id}-${origin.tweetId}${tagStr}]${indexStr}.${ext}`;

            if (filename.length > MAX_FILENAME_LENGTH) {
                filename = `${prefix}[${safeOrgNick}-${origin.id}-${origin.tweetId}]${indexStr}.${ext}`;
            }

            triggerDownload(url, filename);
        }
    }

    function sanitize(str) {
        return str.replace(/[\\/:*?"<>|]/g, '_').substring(0, 30);
    }

    // ⬇️ Core Download Function using GM_download
    function triggerDownload(url, filename) {
        let finalPath = filename;

        // Apply folder path if enabled
        if (ENABLE_FOLDER && FOLDER_NAME) {
            finalPath = `${FOLDER_NAME}/${filename}`;
        }

        // Use GM_download if available
        if (typeof GM_download === 'function') {
            GM_download({
                url: url,
                name: finalPath,
                saveAs: false,
                onerror: (err) => {
                    console.error('GM_download Error:', err);
                    showToast('❌ GM_download Error (Check Tampermonkey Settings)');
                    fallbackDownload(url, filename);
                },
                onload: () => {
                    // console.log('Download complete');
                }
            });
        } else {
            // Fallback for missing permissions or incompatible managers
            fallbackDownload(url, filename);
        }
    }

    // Fallback method (No folder support)
    function fallbackDownload(url, filename) {
        fetch(url).then(res => res.blob()).then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
        }).catch(err => {
            console.error('Fallback Download Failed', err);
            showToast('❌ Download Failed');
        });
    }

    // ================= Event Listeners =================
    const clickTimers = new WeakMap();

    function handleImageClick(event) {
        const img = event.target;
        if (img.tagName !== 'IMG' || !img.closest('[data-testid="tweetPhoto"]')) return;

        event.preventDefault();
        event.stopPropagation();

        const domData = getTweetIdFromDom(img);
        if (!domData) return;

        if (clickTimers.has(img)) {
            clearTimeout(clickTimers.get(img));
            clickTimers.delete(img);
            const link = img.closest('a');
            if (link) link.click();
        } else {
            const timer = setTimeout(() => {
                clickTimers.delete(img);
                const likeButton = domData.article.querySelector('[data-testid="like"], [data-testid="unlike"]');
                if (likeButton) {
                    const isLiked = likeButton.getAttribute('data-testid') === 'unlike';
                    likeButton.click();
                    img.classList.add('wb-like-animation');
                    setTimeout(() => img.classList.remove('wb-like-animation'), 300);
                    if (!isLiked) downloadMedia(domData);
                    else showToast('💔 Like Removed');
                }
            }, 250);
            clickTimers.set(img, timer);
        }
    }

    function setupLikeButtonListener() {
        document.addEventListener('click', (event) => {
            const likeButton = event.target.closest('[data-testid="like"]');
            if (likeButton && !event.target.closest('[data-testid="tweetPhoto"]')) {
                const domData = getTweetIdFromDom(likeButton);
                if (domData) setTimeout(() => downloadMedia(domData), 100);
            }
        }, true);
    }

    function init() {
        createToast();
        document.addEventListener('click', handleImageClick, true);
        setupLikeButtonListener();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    else setTimeout(init, 500);
})();