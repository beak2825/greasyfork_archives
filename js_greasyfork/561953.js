// ==UserScript==
// @name         X/Twitter 纯净浏览 & 一键下载
// @name:zh-CN   X/Twitter 纯净浏览 & 一键下载
// @name:zh-TW   X/Twitter 純淨瀏覽 & 一鍵下載
// @name:en      X/Twitter Pure Experience & Downloader
// @name:ja      X/Twitter きれいな閲覧体験＆ワンクリックダウンローダー
// @version      8.9.1
// @description  无损性能！在时间线实现完美的“纯净浏览”体验（去广告、去侧边栏、宽屏），同时提供邦邦硬的“媒体一键下载”功能（视频/图片/GIF）。完美适配手机端，解决下载卡顿问题。
// @description:zh-CN 无损性能！在时间线实现完美的“纯净浏览”体验（去广告、去侧边栏、宽屏），同时提供邦邦硬的“媒体一键下载”功能（视频/图片/GIF）。完美适配手机端，解决下载卡顿问题。
// @description:zh-TW 無損效能！在時間線實現完美的「純淨瀏覽」體驗（去廣告、去側邊欄、寬螢幕），同時提供強大的「媒體一鍵下載」功能（影片/圖片/GIF）。完美適配手機端。
// @description:en     No Lag! Achieve a perfect "Pure Experience" on X timeline (Block ads/sidebar/widescreen), with a rock-solid "One-Click Media Downloader" (Video/Image/GIF). Optimized for mobile.
// @description:ja     ラグなし！Xのタイムラインで完璧な「ピュア体験」（広告ブロック、サイドバー削除、ワイド画面）を実現し、強力な「ワンクリックメディアダウンローダー」（動画/画像/GIF）を提供します。モバイル端末に最適化。
// @license      MIT
// @author       movwei (Pure & Fast)
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js
// @connect      raw.githubusercontent.com
// @connect      twitter.com
// @connect      x.com
// @connect      pbs.twimg.com
// @connect      video.twimg.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @namespace    https://greasyfork.org/users/1041101
// @downloadURL https://update.greasyfork.org/scripts/561953/XTwitter%20%E7%BA%AF%E5%87%80%E6%B5%8F%E8%A7%88%20%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/561953/XTwitter%20%E7%BA%AF%E5%87%80%E6%B5%8F%E8%A7%88%20%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/* V8.9 移植修复说明:
   1. 核心 API 移植：直接使用了 "X Likes 下载器 v2.1.16" 中验证有效的 Query ID (2ICDjqPd...) 和完整参数列表。
   2. 解决了因接口哈希变更导致的 HTTP 400 问题。
*/

(function() {
    'use strict';

    // =========================================================================
    // 🟢 核心工具
    // =========================================================================
    const Utils = {
        formatDate: (dateStr) => {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return 'unknown';
            const pad = n => n.toString().padStart(2, '0');
            return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
        },
        getSafeText: (el) => {
            if (!el) return '';
            let text = el.textContent;
            const imgs = el.querySelectorAll('img[alt]');
            for (const img of imgs) text += ' ' + img.alt;
            return text.toLowerCase();
        },
        escapeRegex: (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        downloadFile: (url, filename) => {
            return new Promise((resolve, reject) => {
                if (typeof GM_download === 'function') {
                    GM_download({
                        url: url,
                        name: filename,
                        saveAs: false,
                        onload: () => resolve(),
                        onerror: (err) => reject(new Error('GM_download error: ' + JSON.stringify(err)))
                    });
                } else {
                    Utils.gmFetch(url, { responseType: 'blob' }).then(res => {
                        res.blob().then(blob => {
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(a.href);
                            resolve();
                        });
                    }).catch(reject);
                }
            });
        },
        gmFetch: (infoOrUrl, options = {}) => new Promise((resolve, reject) => {
            const info = typeof infoOrUrl === 'string' ? { url: infoOrUrl } : { ...infoOrUrl };
            info.method = options.method || 'GET';
            info.headers = options.headers || {};
            info.responseType = options.responseType;
            info.onload = res => resolve({ 
                ok: res.status >= 200 && res.status < 300, 
                status: res.status,
                response: res.response,
                blob: () => Promise.resolve(res.response instanceof Blob ? res.response : new Blob([res.response]))
            });
            info.onerror = reject;
            GM_xmlhttpRequest(info);
        })
    };

    // =========================================================================
    // ⚙️ 配置管理
    // =========================================================================
    const Config = {
        layout: {
            hideGrok: GM_getValue('hideGrok', true),
            hidePremium: GM_getValue('hidePremiumSignUp', true),
            hideSelectors: GM_getValue('hideSelectors', true),
            hideVerifiedOrgs: GM_getValue('hideVerifiedOrgs', true),
            hideOther: GM_getValue('hideother', true),
            hideExplore: GM_getValue('hideExplore', false),
            hideCommunities: GM_getValue('hideCommunities', false),
            hideRightColumn: GM_getValue('hideRightColumn', false),
            hideRetweets: GM_getValue('hideRetweets', false),
            useLargerCSS: GM_getValue('useLargerCSS', false),
            alignLeft: GM_getValue('alignLeft', false),
            cssWidth: GM_getValue('cssWidth', 680),
        },
        blocker: {
            keywords: new Set((GM_getValue('blockedKeywords') || [
                '男娘', '伪娘', '药娘', '男同', 'mtf', '🏳️‍⚧️', '🏳️‍🌈', '跨性别', '扶她', 'futa',
                '性转', 'LGBT', '🍥', 'furry', '男童', '福瑞', '僞娘', '同性戀', '同性恋', '藥娘',
                '南娘', '男の娘', 'femboy', '三性', '#TS', '雌堕', '南梁', '女装', 'otokonoko',
                '木桶饭', '酷儿', '⚧️', 'lesbian', '＃gay', '人妖', '补佳乐', '雌激素', '糖糖',
                '色普隆', 'trap', 'sissy', 'crossdresser', '扶他', 'boylove', 'twink', '#CD'
            ]).map(k => k.trim().toLowerCase()).filter(Boolean)),
            regex: null
        },
        init() { this.updateRegex(); },
        updateRegex() {
            if (this.blocker.keywords.size === 0) { this.blocker.regex = null; return; }
            this.blocker.regex = new RegExp(Array.from(this.blocker.keywords).map(Utils.escapeRegex).join('|'), 'i');
        },
        saveLayout() {
            for (let key in this.layout) {
                let storeKey = key === 'hidePremium' ? 'hidePremiumSignUp' : (key === 'hideOther' ? 'hideother' : key);
                GM_setValue(storeKey, this.layout[key]);
            }
        },
        saveKeywords(arr) {
            const unique = [...new Set(arr.map(k => k.trim().toLowerCase()).filter(Boolean))];
            GM_setValue('blockedKeywords', unique);
            this.blocker.keywords = new Set(unique);
            this.updateRegex();
        }
    };

    // =========================================================================
    // 🟡 模块 1: CSS 魔法师
    // =========================================================================
    const ModuleLayout = {
        init() {
            let css = '';
            const s = Config.layout;
            if (s.hideGrok) css += `a[href="/i/grok"], [data-testid="grokImgGen"] { display: none !important; }`;
            if (s.hidePremium) css += `a[href="/i/premium_sign_up"] { display: none !important; }`;
            if (s.hideVerifiedOrgs) css += `a[href="/i/verified-orgs-signup"] { display: none !important; }`;
            if (s.hideExplore) css += `a[href="/explore"] { display: none !important; }`;
            if (s.hideCommunities) css += `a[href*="/communities"] { display: none !important; }`;
            if (s.hideRightColumn) css += `[data-testid="sidebarColumn"] { display: none !important; }`;
            if (s.hideOther) css += `a[href*="ads.twitter.com"], [data-testid="trend"] { opacity: 0.8; }`;
            if (s.hideSelectors) css += `div[data-testid="super-upsell-UpsellCardRenderProperties"], div[data-testid="verified_profile_upsell"] { display: none !important; }`;
            if (s.hideRetweets) {
                css += `div[data-testid="cellInnerDiv"]:has([data-testid="socialContext"] path[d^="M4.75"]) { display: none !important; }`;
            }
            if (s.useLargerCSS) {
                css += `div[data-testid="sidebarColumn"] { padding-left: 20px; }`;
                if (s.alignLeft) {
                    css += `.r-1ye8kvj { max-width: 100% !important; margin-left: 0 !important; justify-content: flex-start !important; } [data-testid="primaryColumn"] { max-width: ${s.cssWidth}px !important; width: 100% !important; } header[role="banner"] { flex-grow: 0 !important; width: auto !important; }`;
                } else {
                    css += `.r-1ye8kvj { max-width: ${s.cssWidth}px !important; }`;
                }
            }
            GM_addStyle(css);
            if (window.innerWidth > 600) this.createMenu();
        },
        createMenu() {
            GM_registerMenuCommand(Config.layout.hideRightColumn ? '显示右侧栏' : '隐藏右侧栏', () => {
                 Config.layout.hideRightColumn = !Config.layout.hideRightColumn;
                 Config.saveLayout(); location.reload();
            });
        }
    };

    // =========================================================================
    // 🔴 模块 2: 屏蔽器
    // =========================================================================
    const ModuleBlocker = {
        init() {
            GM_addStyle(`#blocker-float-btn { position: fixed; bottom: 150px; right: 28px; width: 36px; height: 36px; background: #1d9bf0; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 99998; box-shadow: 0 4px 10px rgba(0,0,0,0.2); opacity: 0.8; }`);
            const btn = document.createElement('div');
            btn.id = 'blocker-float-btn'; btn.innerText = '🛡️'; btn.onclick = () => this.showPanel();
            document.body.appendChild(btn);
        },
        showPanel() {
            if (document.getElementById('blocker-settings-panel')) return;
            const p = document.createElement('div');
            p.id = 'blocker-settings-panel';
            p.innerHTML = `
                <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:85%; max-width:320px; background:white; padding:15px; border-radius:12px; box-shadow:0 0 20px rgba(0,0,0,0.4); z-index:100000; color:black;">
                    <h3 style="margin-top:0;">屏蔽词管理</h3>
                    <div id="kw-list" style="max-height:150px; overflow-y:auto; border:1px solid #eee; padding:5px; margin-bottom:10px;"></div>
                    <div style="display:flex; gap:5px;">
                        <input type="text" id="kw-input" placeholder="输入词..." style="flex:1; padding:5px;">
                        <button id="kw-add" style="padding:5px 10px;">添加</button>
                    </div>
                    <div style="margin-top:15px; text-align:right;">
                        <button id="kw-save" style="background:#1d9bf0; color:white; border:none; padding:6px 15px; border-radius:4px;">保存</button>
                        <button id="kw-close" style="background:#ddd; border:none; padding:6px 15px; border-radius:4px; margin-left:10px;">关闭</button>
                    </div>
                </div>
            `;
            document.body.appendChild(p);
            const render = () => {
                const list = document.getElementById('kw-list'); list.innerHTML = '';
                Config.blocker.keywords.forEach(k => {
                    const tag = document.createElement('span'); tag.style.cssText = 'display:inline-block; background:#f0f0f0; padding:2px 6px; margin:2px; border-radius:4px; font-size:12px;';
                    tag.innerHTML = `${k} <span style="color:red;cursor:pointer;margin-left:4px;">&times;</span>`; tag.querySelector('span').onclick = () => tag.remove(); list.appendChild(tag);
                });
            };
            render();
            document.getElementById('kw-close').onclick = () => p.remove();
            document.getElementById('kw-add').onclick = () => {
                const val = document.getElementById('kw-input').value.trim();
                if(val) { const t=document.createElement('span'); t.textContent=val; document.getElementById('kw-list').innerHTML+=`<span style="display:inline-block; background:#f0f0f0; padding:2px 6px; margin:2px; border-radius:4px; font-size:12px;">${t.innerHTML} <span style="color:red;cursor:pointer;margin-left:4px;" onclick="this.parentNode.remove()">&times;</span></span>`; document.getElementById('kw-input').value=''; }
            };
            document.getElementById('kw-save').onclick = () => {
                const newKws = Array.from(document.querySelectorAll('#kw-list > span')).map(el => el.childNodes[0].textContent.trim());
                Config.saveKeywords(newKws); p.remove(); location.reload();
            };
        },
        checkAndHide(tweetNode) {
            if (tweetNode.dataset.xChecked) return tweetNode.dataset.xBlocked === 'true';
            if (Config.blocker.regex) {
                const text = Utils.getSafeText(tweetNode.querySelector('[data-testid="tweetText"]'));
                const user = Utils.getSafeText(tweetNode.querySelector('[data-testid="User-Name"]'));
                if (Config.blocker.regex.test(text + ' ' + user)) {
                    const cell = tweetNode.closest('[data-testid="cellInnerDiv"]');
                    if(cell) cell.style.display = 'none'; else tweetNode.style.display = 'none';
                    tweetNode.dataset.xChecked = 'true'; tweetNode.dataset.xBlocked = 'true';
                    return true;
                }
            }
            tweetNode.dataset.xChecked = 'true'; tweetNode.dataset.xBlocked = 'false';
            return false;
        }
    };

    // =========================================================================
    // 🔵 模块 3: 下载器
    // =========================================================================
    const ModuleDownloader = {
        init() { GM_addStyle(`.tmd-down { display:inline-grid; margin-left:2px; cursor:pointer; } .tmd-down:hover svg { color:#1d9bf0; } .tmd-loading svg { animation:spin 1s linear infinite; } @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`); },
        inject(tweetNode) {
            const group = tweetNode.querySelector('[role="group"]');
            if (!group || group.querySelector('.tmd-down')) return;
            if (!tweetNode.querySelector('img[src*="pbs.twimg.com/media"], video')) return;

            const shareBtn = group.lastElementChild;
            if (!shareBtn) return;

            const btn = document.createElement('div');
            btn.className = 'tmd-down';
            btn.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;transition:0.2s;"><svg viewBox="0 0 24 24" style="width:19px;height:19px;fill:currentColor;"><path d="M12 16L17.7 10.3L16.3 8.9L13 12.2V2.6H11V12.2L7.7 8.9L6.3 10.3L12 16ZM21 15V18.5C21 19.9 19.9 21 18.5 21H5.5C4.1 21 3 19.9 3 18.5V15H5V18.5H19V15H21Z"></path></svg></div>`;
            const timeEl = tweetNode.querySelector('time');
            const tweetLink = timeEl ? timeEl.closest('a').href : window.location.href;
            btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); this.download(btn, tweetLink, tweetNode); };
            group.appendChild(btn);
        },
        async download(btn, url, tweetNode) {
            if (btn.classList.contains('tmd-loading')) return;
            btn.classList.add('tmd-loading');
            try {
                const match = url.match(/\/status\/(\d+)/);
                const pid = match ? match[1] : Date.now();
                const userEl = tweetNode.querySelector('[data-testid="User-Name"]');
                const user = userEl ? userEl.innerText.split('\n')[0] : 'user';
                const timeStr = tweetNode.querySelector('time')?.getAttribute('datetime');
                const date = Utils.formatDate(timeStr);

                let media = [];
                tweetNode.querySelectorAll('img[src*="pbs.twimg.com/media"]').forEach(img => {
                    media.push({ url: img.src.replace(/name=[^&]+/, 'name=large'), ext: 'jpg' });
                });

                if (tweetNode.querySelector('video')) {
                    const apiData = await this.fetchAPI(pid);
                    if (!apiData) throw new Error("Fetch API Failed");
                    
                    const result = apiData.data?.tweetResult?.result;
                    const legacy = result?.tweet?.legacy || result?.legacy;
                    const ents = legacy?.extended_entities?.media || [];
                    
                    ents.forEach(m => {
                        if (m.type === 'video' || m.type === 'animated_gif') {
                            const v = m.video_info.variants.filter(x=>x.content_type==='video/mp4').sort((a,b)=>(b.bitrate||0)-(a.bitrate||0))[0];
                            if(v) media.push({ url: v.url, ext: 'mp4' });
                        }
                    });
                }

                if (media.length === 0) throw new Error('No media found');

                if (media.length === 1) {
                    await Utils.downloadFile(media[0].url, `${user}_${date}_${pid}_1.${media[0].ext}`);
                } else {
                    for (let i = 0; i < media.length; i++) {
                         const res = await Utils.gmFetch(media[i].url, { responseType: 'blob' });
                         const blob = await res.blob();
                         const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                         a.download = `${user}_${date}_${pid}_${i+1}.${media[i].ext}`;
                         document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
                    }
                }
                
                btn.style.color = '#00ba7c'; setTimeout(() => { btn.style.color = ''; }, 2000);
            } catch (e) { 
                console.error(e); 
                btn.style.color = '#f4212e';
                alert(`Download Failed!\nError: ${e.message}`);
            } finally { 
                btn.classList.remove('tmd-loading'); 
            }
        },
        async fetchAPI(pid) {
            const headers = { 
                'authorization': "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA", 
                'x-twitter-active-user': 'yes', 
                'content-type': 'application/json' 
            };
            const getCookie = (name) => document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))?.[1];
            const gt = getCookie('gt');
            const ct0 = getCookie('ct0');
            
            if (gt) headers['x-guest-token'] = gt;
            if (ct0) { headers['x-csrf-token'] = ct0; } else { headers['x-twitter-auth-type'] = 'OAuth2Session'; }

            // ✅ 核心修复：直接使用 "X Likes 下载器" 的 Query ID 和完整参数
            const variables = {
                'tweetId': pid,
                'with_rux_injections': false,
                'includePromotedContent': true,
                'withCommunity': true,
                'withQuickPromoteEligibilityTweetFields': true,
                'withBirdwatchNotes': true,
                'withVoice': true,
                'withV2Timeline': true
            };

            const features = {
                'articles_preview_enabled': true,
                'c9s_tweet_anatomy_moderator_badge_enabled': true,
                'communities_web_enable_tweet_community_results_fetch': false,
                'creator_subscriptions_quote_tweet_preview_enabled': false,
                'creator_subscriptions_tweet_preview_api_enabled': false,
                'freedom_of_speech_not_reach_fetch_enabled': true,
                'graphql_is_translatable_rweb_tweet_is_translatable_enabled': true,
                'longform_notetweets_consumption_enabled': false,
                'longform_notetweets_inline_media_enabled': true,
                'longform_notetweets_rich_text_read_enabled': false,
                'premium_content_api_read_enabled': false,
                'profile_label_improvements_pcf_label_in_post_enabled': true,
                'responsive_web_edit_tweet_api_enabled': false,
                'responsive_web_enhance_cards_enabled': false,
                'responsive_web_graphql_exclude_directive_enabled': false,
                'responsive_web_graphql_skip_user_profile_image_extensions_enabled': false,
                'responsive_web_graphql_timeline_navigation_enabled': false,
                'responsive_web_media_download_video_enabled': false,
                'responsive_web_twitter_article_tweet_consumption_enabled': true,
                'rweb_tipjar_consumption_enabled': true,
                'rweb_video_screen_enabled': false,
                'standardized_nudges_misinfo': true,
                'tweet_awards_web_tipping_enabled': false,
                'tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled': true,
                'tweetypie_unmention_optimization_enabled': false,
                'verified_phone_label_enabled': false,
                'view_counts_everywhere_api_enabled': true
            };

            // 注意：这里的 Hash ID 改成了 "2ICDjqPd..."
            const url = `https://x.com/i/api/graphql/2ICDjqPd81tulZcYrtpTuQ/TweetResultByRestId?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;
            
            try { 
                const res = await Utils.gmFetch(url, { headers, responseType: 'json' }); 
                if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
                return res.response; 
            } catch (e) { 
                console.error("API Fetch Error:", e);
                throw e; 
            }
        }
    };

    const CoreObserver = {
        start() {
            Config.init(); ModuleLayout.init(); ModuleBlocker.init(); ModuleDownloader.init();
            this.processList(document.querySelectorAll('article[data-testid="tweet"]'));
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (!mutation.addedNodes.length) continue;
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        const parentTweet = node.closest('article[data-testid="tweet"]');
                        if (parentTweet) { this.processOne(parentTweet); }
                        else if (node.querySelectorAll) {
                            const tweets = node.querySelectorAll('article[data-testid="tweet"]');
                            if (tweets.length > 0) this.processList(tweets);
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },
        processList(list) { for (let i = 0; i < list.length; i++) this.processOne(list[i]); },
        processOne(tweet) {
            if (ModuleBlocker.checkAndHide(tweet)) return;
            ModuleDownloader.inject(tweet);
        }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => CoreObserver.start());
    else CoreObserver.start();

})();