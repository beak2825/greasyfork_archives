// ==UserScript==
// @name         Twitter/X Media Downloader (Button Fixed)
// @name:zh-CN   Twitter/X 推特媒体下载
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Adds a download button next to the share icon. Downloads images and videos with auto-renaming (Account-ID-TweetID).
// @description:zh-CN 在推文分享按钮旁边添加一个独立的下载按钮。支持图片和视频下载，自动按“账号-ID-推文ID”重命名。
// @author       Gemini
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559131/TwitterX%20Media%20Downloader%20%28Button%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559131/TwitterX%20Media%20Downloader%20%28Button%20Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    // 注意：GraphQL ID 可能会随推特更新而变化，如果下载失败需更新此 ID
    const GRAPHQL_ID = 'zAz9764BcLZOJ0JU2wrd1A';
    const API_BASE = `https://x.com/i/api/graphql/${GRAPHQL_ID}/TweetResultByRestId`;
    const MAX_FILENAME_LENGTH = 200;

    console.log('🚀 Twitter Media Downloader v4.2 (Button Fix) Loaded');

    // ================= 样式注入 =================
    GM_addStyle(`
        /* Toast 提示框 */
        #wb-download-toast {
            position: fixed; bottom: 20px; right: 20px; background: #1d9bf0; color: white;
            padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 999999; font-size: 14px; display: none; max-width: 300px; line-height: 1.4;
            pointer-events: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #wb-download-toast.show { display: block; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* 下载按钮样式 - 模仿推特原生样式 */
        .wb-download-btn-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 19%; /* 动态调整宽度以适应操作栏 */
            min-width: 34px;
            height: 34.75px;
            box-sizing: border-box;
            margin-left: -8px; /* 微调位置 */
        }
        .wb-download-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34.75px;
            height: 34.75px;
            border-radius: 9999px;
            transition: background-color 0.2s;
            cursor: pointer;
            color: rgb(113, 118, 123);
        }
        .wb-download-btn:hover {
            background-color: rgba(29, 155, 240, 0.1);
            color: rgb(29, 155, 240);
        }
        .wb-download-btn svg {
            width: 19px; /*稍微调小图标以匹配新版UI*/
            height: 19px;
            fill: currentColor;
        }
    `);

    // ================= 工具函数 =================
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
        for (const link of links) {
            const href = link.getAttribute('href');
            if (href && href.includes('/status/')) {
                tweetUrl = 'https://x.com' + href;
                break;
            }
        }
        if (!tweetUrl) return null;
        const match = tweetUrl.match(/\/status\/(\d+)/);
        return match ? { id: match[1], article: tweetArticle, fallbackUrl: tweetUrl } : null;
    }

    function formatTwitterDate(dateStr) {
        if (!dateStr) return '00000000-000000';
        const date = new Date(dateStr);
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hour = pad(date.getHours());
        const minute = pad(date.getMinutes());
        const second = pad(date.getSeconds());
        return `${year}${month}${day}-${hour}${minute}${second}`;
    }

    // ================= API 请求构建 =================
    const createTweetUrl = (tweetId) => {
        const variables = { tweetId, with_rux_injections: false, rankingMode: 'Relevance', includePromotedContent: true, withCommunity: true, withQuickPromoteEligibilityTweetFields: true, withBirdwatchNotes: true, withVoice: true };
        const features = { "articles_preview_enabled": true, "c9s_tweet_anatomy_moderator_badge_enabled": true, "communities_web_enable_tweet_community_results_fetch": false, "creator_subscriptions_quote_tweet_preview_enabled": false, "creator_subscriptions_tweet_preview_api_enabled": false, "freedom_of_speech_not_reach_fetch_enabled": true, "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true, "longform_notetweets_consumption_enabled": false, "longform_notetweets_inline_media_enabled": true, "longform_notetweets_rich_text_read_enabled": false, "premium_content_api_read_enabled": false, "profile_label_improvements_pcf_label_in_post_enabled": true, "responsive_web_edit_tweet_api_enabled": false, "responsive_web_enhance_cards_enabled": false, "responsive_web_graphql_exclude_directive_enabled": false, "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false, "responsive_web_graphql_timeline_navigation_enabled": false, "responsive_web_grok_analysis_button_from_backend": false, "responsive_web_grok_analyze_button_fetch_trends_enabled": false, "responsive_web_grok_analyze_post_followups_enabled": false, "responsive_web_grok_image_annotation_enabled": false, "responsive_web_grok_share_attachment_enabled": false, "responsive_web_grok_show_grok_translated_post": false, "responsive_web_jetfuel_frame": false, "responsive_web_media_download_video_enabled": false, "responsive_web_twitter_article_tweet_consumption_enabled": true, "rweb_tipjar_consumption_enabled": true, "rweb_video_screen_enabled": false, "standardized_nudges_misinfo": true, "tweet_awards_web_tipping_enabled": false, "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true, "tweetypie_unmention_optimization_enabled": false, "verified_phone_label_enabled": false, "view_counts_everywhere_api_enabled": true };
        const fieldToggles = { withArticleRichContentState: true, withArticlePlainText: false, withGrokAnalyze: false, withDisallowedReplyControls: false };
        return `${API_BASE}?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}&fieldToggles=${encodeURIComponent(JSON.stringify(fieldToggles))}`;
    };

    const fetchTweetData = async (tweetId) => {
        const url = createTweetUrl(tweetId);
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
                // 优先下载 bitrate 最高的 mp4
                const mp4s = variants.filter(v => v.content_type === 'video/mp4');
                if (mp4s.length === 0) return [];
                
                mp4s.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
                return mp4s[0].url ? [mp4s[0].url] : [];
            }
            return [];
        });
    };

    const parseTweetData = (data, inputTweetId) => {
        let rootTweet = data?.data?.tweetResult?.result;
        // 兼容详情页的 conversation 结构
        if (!rootTweet) {
            const instructions = data?.data?.threaded_conversation_with_injections_v2?.instructions || [];
            const tweetEntry = instructions[0]?.entries?.find(e => e.entryId === `tweet-${inputTweetId}`);
            rootTweet = tweetEntry?.content?.itemContent?.tweet_results?.result;
        }
        if (!rootTweet) return null;

        const outerCore = rootTweet.core || rootTweet.tweet?.core;
        const outerLegacy = rootTweet.legacy || rootTweet.tweet?.legacy;

        // 1. 优先检查外层 (原创/引用)
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
                        createdAt: outerLegacy.created_at
                    }
                };
            }
        }

        // 2. 检查内层 (转发) - 如果外层没媒体，可能是纯文字转发带媒体的推文
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
                            createdAt: innerLegacy.created_at
                        }
                    };
                }
            }
        }
        return null;
    };

    // ================= 下载核心逻辑 =================
    async function downloadMedia(domData) {
        const { id: domTweetId, article } = domData;
        if (downloadedTweets.has(domTweetId)) return;

        downloadedTweets.add(domTweetId);
        setTimeout(() => downloadedTweets.delete(domTweetId), 2000);

        showToast('🔍 正在解析...');
        const apiResult = await fetchTweetData(domTweetId);

        if (!apiResult || apiResult.mediaUrls.length === 0) {
            showToast('⚠️ 此推文无媒体或解析失败');
            return;
        }

        const { mediaUrls, origin } = apiResult;
        showToast(`📥 开始下载 ${mediaUrls.length} 个文件...`);

        let count = 0;
        for (const url of mediaUrls) {
            count++;
            const isVideo = url.includes('.mp4');
            const ext = isVideo ? 'mp4' : 'jpg';
            const typeStr = isVideo ? 'video' : 'photo';
            const indexStr = mediaUrls.length > 1 ? `_${count}` : '';
            
            const safeNick = sanitize(origin.nick);
            const safeId = sanitize(origin.id);
            const dateStr = formatTwitterDate(origin.createdAt);

            let filename = `twitter_${safeNick}(@${safeId})_${dateStr}_${origin.tweetId}_${typeStr}${indexStr}.${ext}`;
            if (filename.length > MAX_FILENAME_LENGTH) {
                filename = `twitter_@${safeId}_${dateStr}_${origin.tweetId}_${indexStr}.${ext}`;
            }

            triggerDownload(url, filename);
        }
    }

    function sanitize(str) {
        return str.replace(/[\\/:*?"<>|]/g, '_').substring(0, 30);
    }

    function triggerDownload(url, filename) {
        fetch(url).then(res => res.blob()).then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
        }).catch(err => {
            console.error('Download Failed', err);
            showToast('❌ 下载请求被拦截或失败');
        });
    }

    // ================= UI 注入逻辑 (已移除不稳定的 hasMedia 检查) =================
    function addDownloadButton(group) {
        if (group.classList.contains('wb-download-added')) return;

        // 确保这是一个推文的操作栏
        const tweetArticle = group.closest('article[data-testid="tweet"]');
        if (!tweetArticle) return;

        // 修正：移除前端媒体检测。因为推文加载时 DOM 结构变化太快，
        // 前端检测容易因为图片/视频还没渲染出来而误判，导致按钮不显示。
        // 现在对所有推文显示按钮，点击后再由 API 判断是否有媒体。

        // 创建下载按钮容器
        const container = document.createElement('div');
        container.className = 'wb-download-btn-container';

        const btn = document.createElement('div');
        btn.className = 'wb-download-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('title', '下载媒体');
        btn.setAttribute('aria-label', 'Download Media');

        // SVG 图标 (向下箭头)
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 15.586l-4.293-4.293-1.414 1.414L12 18.414l5.707-5.707-1.414-1.414z"></path>
                <path d="M11 6h2v10h-2z"></path>
                <path d="M5 19h14v2H5z"></path>
            </svg>
        `;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const domData = getTweetIdFromDom(btn);
            if (domData) {
                downloadMedia(domData);
            } else {
                showToast('❌ 无法定位推文ID');
            }
        });

        container.appendChild(btn);
        group.appendChild(container);
        group.classList.add('wb-download-added');
    }

    function observeTweets() {
        const observer = new MutationObserver((mutations) => {
            // 查找所有操作栏 (role="group")
            const actionGroups = document.querySelectorAll('div[role="group"]:not(.wb-download-added)');
            actionGroups.forEach(group => {
                addDownloadButton(group);
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ================= 初始化 =================
    function init() {
        createToast();
        observeTweets();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();