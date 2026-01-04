// ==UserScript==
// @name         Twitter/X 无损媒体快捷下载
// @name:en      Twitter/X Media Downloader
// @namespace    http://tampermonkey.net/
// @version      3.5.10
// @description  单击图片放大，双击图片点赞并下载；额外新增独立下载按钮。自动获取最高画质图片/视频下载。文件名包含完整的秒级时间戳和图片序号，确保唯一性。
// @description:en Single-click zoom, double-click like & download. Plus a dedicated download button. Both use 1.4MB HQ image processing and full timestamp naming.
// @author       原作者 + Gemini (优化)
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_addStyle
// @grant        GM_download
// @connect      twitter.com
// @connect      x.com
// @connect      pbs.twimg.com
// @connect      video.twimg.com
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557229/TwitterX%20%E6%97%A0%E6%8D%9F%E5%AA%92%E4%BD%93%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/557229/TwitterX%20%E6%97%A0%E6%8D%9F%E5%AA%92%E4%BD%93%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // ================= 配置区域 =================
    const GRAPHQL_ID = 'zAz9764BcLZOJ0JU2wrd1A';
    const API_BASE = `https://x.com/i/api/graphql/${GRAPHQL_ID}/TweetResultByRestId`;
    const MAX_FILENAME_LENGTH = 200;

    console.log('🚀 Twitter Media Enhancer v3.5.10 Loaded (Single-Click Zoom / Double-Click Like & Download)');

    // ================= 图标与样式定义 (按钮样式 + 旧交互样式) =================

    // 下载图标 (箭头)
    const ICON_DOWNLOAD = `<svg viewBox="0 0 24 24" class="xmd-icon-main"><path d="M12 15.586l-4.293-4.293-1.414 1.414L12 18.414l5.707-5.707-1.414-1.414z"></path><path d="M11 2h2v14h-2z"></path><path d="M5 20h14v2H5z"></path></svg>`;

    // 加载中圆环 (用于动画)
    const ICON_LOADING_RING = `
        <svg viewBox="0 0 24 24" class="xmd-ring-svg">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#00ba7c" stroke-width="2.5" stroke-linecap="round"></circle>
        </svg>
    `;

    // 成功图标 (钩)
    const ICON_SUCCESS = `<svg viewBox="0 0 24 24" class="xmd-icon-result"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>`;

    // 失败图标 (叉)
    const ICON_ERROR = `<svg viewBox="0 0 24 24" class="xmd-icon-result"><path d="M13.414 12l4.293-4.293-1.414-1.414L12 10.586 7.707 6.293 6.293 7.707 10.586 12l-4.293 4.293 1.414 1.414L12 13.414l4.293 4.293 1.414-1.414L13.414 12z"></path></svg>`;

    GM_addStyle(`
        /* 图片点击交互样式 */
        [data-testid="tweetPhoto"] img {
            cursor: pointer !important;
            transition: transform 0.2s !important;
        }
        [data-testid="tweetPhoto"] img:hover {
            transform: scale(1.02);
        }
        @keyframes likeAnimation { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .wb-like-animation { animation: likeAnimation 0.3s ease !important; }

        /* Toast 提示框 (用于点赞下载的临时提示) */
        #wb-download-toast {
            position: fixed; bottom: 20px; right: 20px; background: #1d9bf0; color: white;
            padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 999999; font-size: 14px; display: none; max-width: 300px; line-height: 1.4;
            pointer-events: none;
        }
        #wb-download-toast.show { display: block; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* --- 新增下载按钮样式 --- */
        .xmd-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            color: rgb(113, 118, 123);
            margin-left: 2px;
            overflow: hidden;
        }
        .xmd-btn:hover:not(.xmd-loading):not(.xmd-success):not(.xmd-error) {
            background-color: rgba(29, 155, 240, 0.1);
            color: rgb(29, 155, 240);
        }
        .xmd-btn svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
            transition: opacity 0.2s;
        }

        /* 状态：加载中 */
        .xmd-btn.xmd-loading { pointer-events: none; }
        .xmd-btn.xmd-loading .xmd-icon-main { opacity: 0.3; color: rgb(180, 180, 180); }
        .xmd-ring-svg {
            position: absolute; top: 0; left: 0; width: 100% !important; height: 100% !important;
            transform: rotate(-90deg); opacity: 0; pointer-events: none;
        }
        .xmd-btn.xmd-loading .xmd-ring-svg { opacity: 1; }
        .xmd-btn.xmd-loading circle {
            stroke-dasharray: 63;
            stroke-dashoffset: 63;
            animation: xmd-fill-circle 1.5s ease-in-out infinite;
        }
        @keyframes xmd-fill-circle { 0% { stroke-dashoffset: 63; } 100% { stroke-dashoffset: 0; } }

        /* 状态：成功 */
        .xmd-btn.xmd-success { background-color: rgb(0, 186, 124) !important; color: white !important; transform: scale(1.1); }
        /* 状态：失败 */
        .xmd-btn.xmd-error { background-color: rgb(249, 24, 128) !important; color: white !important; transform: scale(1.1); }

        /* 结果图标动画 */
        .xmd-icon-result { animation: xmd-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes xmd-pop { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
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

    function sanitize(str) {
        return str.replace(/[\\/:*?"<>|]/g, '_').substring(0, 30).trim();
    }

    function formatTweetDate(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hour}${minute}${second}`; // YYYYMMDDHHMMSS
    }

    // ================= API 请求与解析 (核心) =================

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
            if (!response.ok) {
                 console.error(`Twitter API 请求失败，状态码: ${response.status}. 请检查控制台中的 network 标签页，并考虑更新 GraphQL ID。`);
                 throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return parseTweetData(data, tweetId);
        } catch (error) {
            console.error('Fetch Tweet Data 失败:', error);
            return null;
        }
    };

    const extractMedia = (legacy) => {
        if (!legacy) return [];
        const mediaEntities = legacy.extended_entities?.media || legacy.entities?.media || [];
        return mediaEntities.flatMap((item) => {
            if (item.type === 'photo') {
                return [item.media_url_https + '?name=4096x4096'];
            }
            if (item.type === 'video' || item.type === 'animated_gif') {
                const variants = item.video_info?.variants || [];
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
        if (!rootTweet) {
            const instructions = data?.data?.threaded_conversation_with_injections_v2?.instructions || [];
            const tweetEntry = instructions[0]?.entries?.find(e => e.entryId === `tweet-${inputTweetId}`);
            rootTweet = tweetEntry?.content?.itemContent?.tweet_results?.result;
        }
        if (!rootTweet) return null;

        const outerCore = rootTweet.core || rootTweet.tweet?.core;
        const outerLegacy = rootTweet.legacy || rootTweet.tweet?.legacy;

        const getTweetInfo = (core, legacy) => ({
            nick: core.user_results?.result?.legacy?.name || 'unknown',
            id: core.user_results?.result?.legacy?.screen_name || 'unknown',
            tweetId: legacy.id_str || inputTweetId,
            hashtags: (legacy.entities?.hashtags || []).map(t => t.text).join('-'),
            createdAt: legacy.created_at
        });

        if (outerLegacy && outerCore && extractMedia(outerLegacy).length > 0) {
            return { mediaUrls: extractMedia(outerLegacy), via: null, origin: getTweetInfo(outerCore, outerLegacy) };
        }

        let innerTweet = rootTweet.legacy?.retweeted_status_result?.result || rootTweet.quoted_status_result?.result;
        if (innerTweet) {
            const innerCore = innerTweet.core || innerTweet.tweet?.core;
            const innerLegacy = innerTweet.legacy || innerTweet.tweet?.legacy;
            if (innerCore && innerLegacy && extractMedia(innerLegacy).length > 0) {
                return {
                    mediaUrls: extractMedia(innerLegacy),
                    via: {
                        nick: outerCore?.user_results?.result?.legacy?.name || 'unknown',
                        id: outerCore?.user_results?.result?.legacy?.screen_name || 'unknown',
                        tweetId: outerLegacy?.id_str || inputTweetId
                    },
                    origin: getTweetInfo(innerCore, innerLegacy)
                };
            }
        }
        return null;
    };

    // ================= 核心下载执行函数 (GM_download & 1.4MB HQ JPG) =================

    function triggerGMDownload(url, filename) {
        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: filename,
                saveAs: false,
                onload: resolve,
                onerror: reject
            });
        });
    }

    function reprocessAndDownload(imageUrl, filenameBase) {
        return new Promise((resolve, reject) => {
            fetch(imageUrl)
                .then(res => res.blob())
                .then(blob => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';

                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);

                        canvas.toBlob(hqBlob => {
                            if (hqBlob) {
                                const finalFilename = filenameBase + '.jpg';
                                GM_download({
                                    url: hqBlob,
                                    name: finalFilename,
                                    saveAs: false,
                                    onload: resolve,
                                    onerror: reject
                                });
                            } else {
                                reject(new Error('Canvas to Blob failed.'));
                            }
                        }, 'image/jpeg', 1.0);
                    };
                    img.onerror = () => reject(new Error('Image load failed.'));
                    img.src = URL.createObjectURL(blob);
                })
                .catch(reject);
        });
    }

    async function executeDownloadAndRename(domData) {
        const { id: domTweetId } = domData;

        if (downloadedTweets.has(domTweetId)) {
            console.log(`Tweet ID ${domTweetId} recently processed.`);
            return true;
        }

        const apiResult = await fetchTweetData(domTweetId);

        if (!apiResult || apiResult.mediaUrls.length === 0) {
            return false;
        }

        downloadedTweets.add(domTweetId);
        setTimeout(() => downloadedTweets.delete(domTweetId), 5000);

        const { mediaUrls, via, origin } = apiResult;
        const formattedDateTime = formatTweetDate(origin.createdAt);
        const downloadTasks = [];
        let count = 0;

        for (const url of mediaUrls) {
            count++;
            const isPhoto = !url.includes('.mp4') && !url.includes('.gif');
            const baseExt = isPhoto ? 'jpg' : 'mp4';
            const indexStr = mediaUrls.length > 1 ? `_${count}` : '';

            let prefix = '';
            if (via) {
                const safeViaNick = sanitize(via.nick);
                const safeViaId = sanitize(via.id);
                prefix = `RT ${safeViaNick}-${safeViaId} - `;
            }

            const safeOrgNick = sanitize(origin.nick);
            const safeOrgId = sanitize(origin.id);
            const tagStr = origin.hashtags ? `-${origin.hashtags}` : '';

            let filenameBase = `${prefix}${safeOrgNick}-${safeOrgId}-${formattedDateTime}${tagStr}${indexStr}`;

            if (filenameBase.length > MAX_FILENAME_LENGTH) {
                filenameBase = filenameBase.substring(0, MAX_FILENAME_LENGTH);
            }

            if (isPhoto) {
                downloadTasks.push(reprocessAndDownload(url, filenameBase));
            } else {
                downloadTasks.push(triggerGMDownload(url, filenameBase + '.' + baseExt));
            }
        }

        await Promise.all(downloadTasks);
        return true;
    }

    // ================= 旧功能：点击图片交互 (已调整交互逻辑) =================
    const clickTimers = new WeakMap();

    async function downloadMediaWithToast(domData) {
        showToast('🔍 正在分析媒体并下载...');
        try {
            const success = await executeDownloadAndRename(domData);
            if (success) {
                showToast(`✅ 下载完成! (${domData.id})`);
            } else {
                 showToast('⚠️ 无法获取媒体或 API 失败');
            }
        } catch (error) {
            console.error('Download error:', error);
            showToast('❌ 下载失败。');
        }
    }

    function handleImageClick(event) {
        const img = event.target;
        if (img.tagName !== 'IMG' || !img.closest('[data-testid="tweetPhoto"]')) return;

        event.preventDefault();
        event.stopPropagation();

        const domData = getTweetIdFromDom(img);
        if (!domData) return;

        if (clickTimers.has(img)) {
            // 双击：清除计时器，执行点赞和下载
            clearTimeout(clickTimers.get(img));
            clickTimers.delete(img);

            const likeButton = domData.article.querySelector('[data-testid="like"], [data-testid="unlike"]');
            if (likeButton) {
                const isLiked = likeButton.getAttribute('data-testid') === 'unlike';
                likeButton.click(); // 点赞

                img.classList.add('wb-like-animation');
                setTimeout(() => img.classList.remove('wb-like-animation'), 300);

                // 点赞后自动下载
                if (!isLiked) downloadMediaWithToast(domData);
                else showToast('💔 取消点赞');
            }

        } else {
            // 单击：设置计时器，如果 250ms 内没有再次点击，则执行放大图片
            const timer = setTimeout(() => {
                clickTimers.delete(img);

                // 单击逻辑：触发原生点击事件（放大图片）
                const link = img.closest('a');
                if (link) link.click();
            }, 250);
            clickTimers.set(img, timer);
        }
    }

    function setupLikeButtonListener() {
        document.addEventListener('click', (event) => {
            const likeButton = event.target.closest('[data-testid="like"]');
            // 只要点的不是图片（防止双重触发），点爱心就尝试下载
            if (likeButton && !event.target.closest('[data-testid="tweetPhoto"]')) {
                const domData = getTweetIdFromDom(likeButton);
                if (domData) setTimeout(() => downloadMediaWithToast(domData), 100);
            }
        }, true);
    }

    // ================= 新功能：独立下载按钮 UI 与状态管理 =================

    async function handleDownloadButton(article, btn) {
        if (btn.classList.contains('xmd-loading')) return;

        const domData = getTweetIdFromDom(article);
        if (!domData) {
            console.error("未能从文章中提取推文 ID。");
            return;
        }

        // 1. 切换到【加载中】状态
        btn.classList.add('xmd-loading');
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const minLoadTime = wait(600);

        try {
            // 2. 执行核心下载逻辑
            const success = await executeDownloadAndRename(domData);
            await minLoadTime;

            if (!success) {
                throw new Error("No media found or download failed.");
            }

            // 3. 切换到【成功】状态
            btn.classList.remove('xmd-loading');
            btn.classList.add('xmd-success');
            btn.innerHTML = ICON_SUCCESS;
            console.log('✅ 媒体下载成功!');

        } catch (err) {
            console.error('下载失败:', err);
            // 3. 切换到【失败】状态
            await minLoadTime;
            btn.classList.remove('xmd-loading');
            btn.classList.add('xmd-error');
            btn.innerHTML = ICON_ERROR;
        }

        // 4. 【恢复】状态
        await wait(1500);
        btn.classList.remove('xmd-success', 'xmd-error');
        btn.innerHTML = ICON_DOWNLOAD + ICON_LOADING_RING;
    }

    function initArticle(article) {
        article.setAttribute('data-xmd-init', 'true');

        const isActionGroup = article.querySelector('[role="group"]');
        if (!isActionGroup) return;

        const group = article.querySelector('div[role="group"]');
        if (!group || group.querySelector('.xmd-btn')) return;

        const hasMedia = article.querySelector('[data-testid="videoPlayer"], [data-testid="tweetPhoto"], [role="link"][href*="/status/"]');
        if (!hasMedia) return;

        const btn = document.createElement('div');
        btn.className = 'xmd-btn';
        btn.title = "下载推文中的所有媒体 (图片/视频)";

        btn.innerHTML = ICON_DOWNLOAD + ICON_LOADING_RING;

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDownloadButton(article, btn);
        };

        group.appendChild(btn);
    }

    function observeArticles() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    document.querySelectorAll('article:not([data-xmd-init])').forEach(initArticle);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ================= 启动 =================

    function init() {
        createToast();

        // 1. 旧功能：点击图片和点赞监听（已调整交互逻辑）
        document.addEventListener('click', handleImageClick, true);
        setupLikeButtonListener();

        // 2. 新功能：按钮 UI 注入监听
        setTimeout(observeArticles, 500);

        console.log('✅ Twitter Enhancer v3.5.10 Ready');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    else setTimeout(init, 500);
})();