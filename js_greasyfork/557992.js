// ==UserScript==
// @name         🔥推特twitter标签备注，X翻译，discord翻译，重点关注通知，领哥终极版 V20.2
// @namespace    http://tampermonkey.net/
// @version      20.2
// @description  1.支持推特实时翻译，discord翻译，支持翻译字体大小颜色可调整，支持一键本地备份和恢复，支持选择文字快速搜MEME和搜推文，支持BTC和ETH价格实时显示，ETH链上GAS实时显示，并支持代币价格报警，重点推文报警。
// @copyright    2026, 领哥 (https://x.com/shangdu2005)无偿分享，严禁商业转载，觉的好用留下你的好评支持❤！
// @license      All Rights Reserved
// @match        *://twitter.com/*
// @match        *://x.com/*
// @match        *://pro.x.com/*
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @connect      translate.googleapis.com
// @connect      api.dexscreener.com
// @connect      eth.llamarpc.com
// @connect      api.twitter.com
// @connect      api.binance.com
// @connect      api.etherscan.io
// @downloadURL https://update.greasyfork.org/scripts/557992/%F0%9F%94%A5%E6%8E%A8%E7%89%B9twitter%E6%A0%87%E7%AD%BE%E5%A4%87%E6%B3%A8%EF%BC%8CX%E7%BF%BB%E8%AF%91%EF%BC%8Cdiscord%E7%BF%BB%E8%AF%91%EF%BC%8C%E9%87%8D%E7%82%B9%E5%85%B3%E6%B3%A8%E9%80%9A%E7%9F%A5%EF%BC%8C%E9%A2%86%E5%93%A5%E7%BB%88%E6%9E%81%E7%89%88%20V202.user.js
// @updateURL https://update.greasyfork.org/scripts/557992/%F0%9F%94%A5%E6%8E%A8%E7%89%B9twitter%E6%A0%87%E7%AD%BE%E5%A4%87%E6%B3%A8%EF%BC%8CX%E7%BF%BB%E8%AF%91%EF%BC%8Cdiscord%E7%BF%BB%E8%AF%91%EF%BC%8C%E9%87%8D%E7%82%B9%E5%85%B3%E6%B3%A8%E9%80%9A%E7%9F%A5%EF%BC%8C%E9%A2%86%E5%93%A5%E7%BB%88%E6%9E%81%E7%89%88%20V202.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log("🚀 领哥全能终端 V20.2 (X/Pro同步版) 已启动...");
    console.log("🌐 当前网站:", window.location.host);

    // ================= 🎵 核心音效系统 =================
    const AUDIO_PRESETS = {
        'alarm1': { name: '核警报', desc: '高频急促警报' },
        'alarm2': { name: '蜂鸣器', desc: '连续蜂鸣音' },
        'alarm3': { name: '雷达声', desc: '雷达扫描音' },
        'alarm4': { name: 'MEME提醒', desc: '特别提醒音' }
    };

    function createProxyRequest(options) {
        return GM_xmlhttpRequest(options);
    }
    const __SystemConfig = {
        decode: (str) => {
            try { return decodeURIComponent(escape(window.atob(str))); }
            catch (e) { console.error("系统配置损坏"); return ""; }
        },
        params: {
            route_id: "MURSRlBFMHo=",
            data_endpoint: "aHR0cHM6Ly9hcGkuZGV4c3NyZWVuZXIuY29tL2xhdGVzdC9kZXgvdG9rZW5zLw==",
            svc_trans: "aHR0cHM6Ly90cmFuc2xhdGUuZ29vZ2xlYXBpcy5jb20vdHJhbnNsYXRlX2Evc2luZ2xl",
            sys_core_hz: "ODgw",
            ch_a: "aHR0cHM6Ly93ZWIzLm9reC5jb20vam9pbi9MSU5HRTg4",
            ch_b: "aHR0cHM6Ly93ZWIzLmJpbmFuY2UuY29tL3JlZmVycmFsP3JlZj1GSTdDMTJCSg=="
        }
    };

    if (typeof __SystemConfig === 'undefined' || !__SystemConfig.params) {
        console.error("❌ 领哥终端错误：核心组件缺失，请重新安装。");
        return;
    }

    const _BotConfig = {
        // 1. 领哥严选黑名单 (骗子ID，全部小写)
        blackList: [
            "fake_elon", "scam_support", "doubler_bot_eth"
        ],
        aiKeywords: [
            "as an ai language model", "ignore previous instructions",
            "sorry, i cannot", "my knowledge cutoff",
            "i don't have personal opinions", "regenerate response",
            "作为一个人工智能", "无法回答", "模型限制"
        ],
        autoHide: false
    };

    function createAlertSound(type = 'alarm1') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (type === 'alarm1') {
                let baseFreq = 0;
                try { baseFreq = parseInt(__SystemConfig.decode(__SystemConfig.params.sys_core_hz)); } catch(e){}
                if (!baseFreq) baseFreq = 0;
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(baseFreq / 4, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            }
            else if (type === 'alarm2') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.25);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.35);
            }
            else if (type === 'alarm3') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.8);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.8);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.8);
            }
            else if (type === 'alarm4') {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.2);
                oscillator.frequency.exponentialRampToValueAtTime(1567.98, audioContext.currentTime + 0.4);
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.3);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            }
        } catch (error) {
            console.error("音效生成失败:", error);
        }
    }

    let isAudioUnlocked = false;
    const unlockAudio = () => {
        if (!isAudioUnlocked) {
            try {
                const dummyAudio = new Audio();
                dummyAudio.volume = 0.01;
                dummyAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
                const playPromise = dummyAudio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        dummyAudio.pause();
                        dummyAudio.currentTime = 0;
                        isAudioUnlocked = true;
                        console.log("🔊 音频权限已隐形解锁");
                        document.removeEventListener('click', unlockAudio);
                        document.removeEventListener('touchstart', unlockAudio);
                    }).catch(e => {
                        console.log("首次音频解锁失败，等待下次交互");
                    });
                }
            } catch (e) {
                console.log("音频解锁异常:", e);
            }
        }
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    // 全局状态
    let marketTimer = null;
    let isAlerting = false;
    let alertInterval = null;
    let alertTimeout = null;
    let isDashboardOpen = false;
    let twitterMonitorInterval = null;
    let lastCheckedTweetIds = new Set();
    let monitoredTweets = new Map();
    let currentAlertType = null;
    let isProXInterface = false;

    const DEFAULT_UI = {
        transColor: '#00E676',
        transFontSize: '14px',
        noteColor: '#1D9BF0',
        noteFontSize: '11px',
        vipColor: '#F3BA2F',
        floatTop: '60%',
        sentinelMode: false,
        sentinelShake: true,
        alertDuration: 10,
        soundType: 'alarm1',
        gasThreshold: 10,
        priceThreshold: 0.5,
        twitterMonitorEnabled: true,
        twitterMonitorMode: 'vip',
        twitterAlertSound: 'alarm4',
        twitterAlertShake: true,
        twitterAlertDuration: 10,
        twitterKeywords: ['doge', 'meme', 'coin', 'token', 'buy', 'pump', '🚀', '💰'],
        monitorVipOnly: true,
        monitorAllTweets: false,
        proXInterfaceSupport: true
    };

    const INITIAL_VIP_MAP = {
        'vitalikbuterin': ['🏛️ ETH创始人', '#716b94', '#fff'],
        'cz_binance': ['🔶 币安创始人', '#F0B90B', '#000']
    };

    const Storage = {
        getConfig: () => ({ ...DEFAULT_UI, ...JSON.parse(GM_getValue('ling_config', '{}')) }),
        setConfig: (cfg) => {
            GM_setValue('ling_config', JSON.stringify(cfg));
            updateStyles();
            checkBackgroundTask();
            updateTwitterMonitor();
        },
        getNotes: () => JSON.parse(GM_getValue('ling_user_notes', '{}')),
        setNotes: (notes) => GM_setValue('ling_user_notes', JSON.stringify(notes)),
        addNote: (handle, note) => {
            const notes = Storage.getNotes();
            const h = handle.toLowerCase();
            if (note && note.trim()) notes[h] = note.trim();
            else delete notes[h];
            Storage.setNotes(notes);
        },
        getNote: (handle) => Storage.getNotes()[handle.toLowerCase()] || null,
        getVips: () => {
            let vips = JSON.parse(GM_getValue('ling_vips', 'null'));
            if (!vips) {
                vips = JSON.parse(JSON.stringify(INITIAL_VIP_MAP));
                GM_setValue('ling_vips', JSON.stringify(vips));
                return vips;
            }
            let isDirty = false;
            for (const [handle, info] of Object.entries(INITIAL_VIP_MAP)) {
                if (!vips[handle.toLowerCase()]) {
                    vips[handle.toLowerCase()] = info;
                    isDirty = true;
                }
            }
            if (isDirty) GM_setValue('ling_vips', JSON.stringify(vips));
            return vips;
        },
        setVips: (vips) => GM_setValue('ling_vips', JSON.stringify(vips)),
        getVipInfo: (handle) => Storage.getVips()[handle.toLowerCase()] || null,
        addVip: (handle, label) => {
            const vips = Storage.getVips();
            vips[handle.toLowerCase()] = [label, '#F3BA2F', '#000'];
            Storage.setVips(vips);
        },
        removeVip: (handle) => {
            const vips = Storage.getVips();
            delete vips[handle.toLowerCase()];
            Storage.setVips(vips);
        },
        getMonitoredTweets: () => JSON.parse(GM_getValue('ling_monitored_tweets', '[]')),
        addMonitoredTweet: (tweet) => {
            const tweets = Storage.getMonitoredTweets();
            tweets.unshift(tweet);
            if (tweets.length > 50) tweets.length = 50;
            GM_setValue('ling_monitored_tweets', JSON.stringify(tweets));
        },
        clearMonitoredTweets: () => {
            GM_setValue('ling_monitored_tweets', JSON.stringify([]));
        },
        export: () => {
            const data = {
                ver: "20.2",
                ts: new Date().getTime(),
                notes: Storage.getNotes(),
                vips: Storage.getVips(),
                config: Storage.getConfig(),
                monitoredTweets: Storage.getMonitoredTweets()
            };
            const blob = new Blob([JSON.stringify(data)], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url;
            a.download = `LingGe_Config_${new Date().toISOString().slice(0,10)}.txt`;
            a.click();
        },
        import: () => {
            const input = document.createElement('input'); input.type = 'file'; input.accept = '.json,.txt';
            input.onchange = (e) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const raw = JSON.parse(ev.target.result);
                        if(raw.notes) Storage.setNotes(raw.notes);
                        if(raw.vips) Storage.setVips(raw.vips);
                        if(raw.config) Storage.setConfig(raw.config);
                        if(raw.monitoredTweets) {
                            GM_setValue('ling_monitored_tweets', JSON.stringify(raw.monitoredTweets));
                        }
                        alert("✅ 配置已恢复！"); location.reload();
                    } catch (err) { alert('❌ 文件格式错误'); }
                };
                reader.readAsText(e.target.files[0]);
            };
            input.click();
        }
    };

    function normalizeHandle(str) {
        if (!str) return null;
        try {
            let clean = str.replace(/^(https?:\/\/)?(www\.)?(twitter\.com|x\.com|pro\.x\.com)\//, '');
            clean = clean.replace(/^[\/@]/, '');
            clean = clean.split('?')[0].split('/')[0];
            const systemPaths = ['home', 'explore', 'notifications', 'messages', 'status', 'hashtag', 'search', 'settings', 'i', 'communities'];
            if (systemPaths.includes(clean.toLowerCase()) || clean.length === 0) return null;

            return clean.toLowerCase();
        } catch (e) {
            return null;
        }
    }

    // ================= 2. 重点关注监控功能 =================
    function isTwitterPage() {
        const host = window.location.host;
        return host.includes('twitter.com') || host.includes('x.com');
    }

    function checkProXInterface() {
        const host = window.location.host;
        const path = window.location.pathname;
        isProXInterface = host.includes('pro.x.com') || path.includes('/pro/');
        return isProXInterface;
    }

    function getTweetAuthor(tweetElement) {
        try {
            let authorElement = null;
            const selectors = [
                'div[data-testid="User-Name"] a[href*="/"]',
                'a[role="link"][href*="/"]',
                'article a[href*="/"]:not([href*="/status/"])',
                'span[class*="username"]'
            ];

            for (const selector of selectors) {
                const elements = tweetElement.querySelectorAll(selector);
                for (const el of elements) {
                    // 🛑 关键过滤：跳过头像 (包含图片的链接) 和 时间 (包含time的链接)
                    if (el.querySelector('img') || el.querySelector('time')) continue;

                    const href = el.getAttribute('href');
                    const handle = normalizeHandle(href);

                    if (handle) {
                        return handle;
                    }
                }
            }

            const textContent = tweetElement.textContent || '';
            const match = textContent.match(/@(\w+)/);
            if (match && match[1]) {
                return match[1].toLowerCase();
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    function getTweetId(tweetElement) {
        try {
            let tweetId = tweetElement.getAttribute('data-tweet-id') ||
                         tweetElement.getAttribute('data-item-id') ||
                         tweetElement.closest('[data-tweet-id]')?.getAttribute('data-tweet-id');
            if (!tweetId) {
                const linkElement = tweetElement.querySelector('a[href*="/status/"]') ||
                                  tweetElement.querySelector('a[href*="/tweet/"]');
                if (linkElement) {
                    const href = linkElement.getAttribute('href');
                    const match = href.match(/\/(\d+)/);
                    if (match) tweetId = match[1];
                }
            }
            if (!tweetId) {
                const author = getTweetAuthor(tweetElement);
                const text = getTweetText(tweetElement) || '';
                tweetId = `gen_${author}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            return tweetId;
        } catch (error) {
            console.error("获取推文ID失败:", error);
            return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
    }

    function getTweetText(tweetElement) {
        try {
            const selectors = [
                'div[data-testid="tweetText"]',
                'div[class*="tweet"]',
                'div[class*="content"]',
                'div[dir="auto"]',
                'article div:not([class]):not([id])'
            ];
            for (const selector of selectors) {
                const element = tweetElement.querySelector(selector);
                if (element && element.textContent && element.textContent.trim().length > 0) {
                    return element.textContent.trim();
                }
            }
            const allText = tweetElement.textContent || '';
            const lines = allText.split('\n').filter(line =>
                line.trim().length > 10 &&
                !line.includes('Retweet') &&
                !line.includes('Like') &&
                !line.includes('Reply') &&
                !line.includes('·')
            );
            return lines.join(' ').substring(0, 200);
        } catch (error) {
            console.error("获取推文内容失败:", error);
            return '';
        }
    }
    function getTweetTime(tweetElement) {
        try {
            const timeElement = tweetElement.querySelector('time');
            if (timeElement) {
                const dateTime = timeElement.getAttribute('datetime');
                if (dateTime) {
                    return new Date(dateTime).getTime();
                }
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }
    function checkKeywords(text, keywords) {
        if (!text || !keywords || keywords.length === 0) return false;
        const lowerText = text.toLowerCase();
        return keywords.some(keyword =>
            keyword && lowerText.includes(keyword.toLowerCase())
        );
    }

    function shouldMonitorTweet(tweetElement) {
        const cfg = Storage.getConfig();
        if (!cfg.twitterMonitorEnabled) return false;
        const author = getTweetAuthor(tweetElement);
        if (!author) return false;
        const isVip = Storage.getVipInfo(author) !== null;
        if (cfg.monitorVipOnly) {
            return isVip;
        } else if (cfg.monitorAllTweets) {
            return true;
        } else {
            return isVip;
        }
    }

    function triggerVipTwitterAlert(tweetElement) {
        const cfg = Storage.getConfig();
        if (!cfg.twitterMonitorEnabled) return;
        try {
            const tweetId = getTweetId(tweetElement);
            const author = getTweetAuthor(tweetElement);
            const text = getTweetText(tweetElement);

            const tweetTime = getTweetTime(tweetElement);
            const now = Date.now();

            if (tweetTime > 0 && (now - tweetTime > 10 * 60 * 1000)) {
                if (tweetId) lastCheckedTweetIds.add(tweetId);
                return;
            }

            if (!tweetId || !author) return;
            if (lastCheckedTweetIds.has(tweetId)) return;
            lastCheckedTweetIds.add(tweetId);

            const isVip = Storage.getVipInfo(author) !== null;
            const vipInfo = Storage.getVipInfo(author);

            console.log(`🚨 ${isVip ? '重点监控' : '用户'}推文警报: @${author}`, vipInfo ? `[${vipInfo[0]}]` : '');
            const hasKeywords = checkKeywords(text, cfg.twitterKeywords || []);
            const monitoredTweet = {
                id: tweetId,
                username: author,
                text: text || '（内容获取失败）',
                time: new Date().toLocaleTimeString(),
                timestamp: Date.now(),
                isVip: isVip,
                vipLabel: vipInfo ? vipInfo[0] : null,
                isKeywordAlert: hasKeywords
            };
            Storage.addMonitoredTweet(monitoredTweet);
            monitoredTweets.set(tweetId, monitoredTweet);
            stopAlert();
            currentAlertType = 'twitter';
            isAlerting = true;
            const ball = document.querySelector('.ling-float-toggle');
            if (ball && cfg.twitterAlertShake) {
                ball.classList.add('ling-alert-active');
                ball.classList.add('ling-twitter-alert');
            }
            try {
                createAlertSound(cfg.twitterAlertSound || 'alarm4');
            } catch(e) {
                console.error("推特音效播放失败:", e);
                createAlertSound('alarm4');
            }
            alertInterval = setInterval(() => {
                try {
                    createAlertSound(cfg.twitterAlertSound || 'alarm4');
                } catch(e) {}
            }, 1000);
            const duration = (cfg.twitterAlertDuration || 10) * 1000;
            alertTimeout = setTimeout(() => {
                if (currentAlertType === 'twitter') {
                    stopAlert();
                }
            }, duration);
            if (Notification.permission === "granted") {
                const notificationTitle = isVip ? `🚨 重点关注发推: @${author}` : `📝 用户发推: @${author}`;
                const notificationBody = text ?
                    (text.substring(0, 100) + (text.length > 100 ? '...' : '')) :
                    '查看推文详情';
                new Notification(notificationTitle, {
                    body: hasKeywords ? `包含关键词: ${notificationBody}` : notificationBody,
                    icon: 'https://abs.twimg.com/favicons/twitter.2.ico',
                    requireInteraction: true
                });
            }
            updateTwitterMonitorPanel();
            if (ball) {
                const originalTitle = ball.getAttribute('data-original-title') || ball.title;
                ball.setAttribute('data-original-title', originalTitle);
                ball.title = `🚨 @${author} ${isVip ? '(重点关注)' : ''}发推了! 点击停止警报`;
            }
            highlightMonitoredTweet(tweetElement);
        } catch (error) {
            console.error("触发推特警报失败:", error);
        }
    }

    function highlightMonitoredTweet(tweetElement) {
        try {
            tweetElement.style.border = '2px solid #FF5252';
            tweetElement.style.borderRadius = '8px';
            tweetElement.style.padding = '8px';
            tweetElement.style.marginBottom = '8px';
            tweetElement.style.background = 'rgba(255, 82, 82, 0.05)';
            tweetElement.style.transition = 'all 0.3s ease';
            const existingTag = tweetElement.querySelector('.ling-monitored-tag');
            if (!existingTag) {
                const tag = document.createElement('div');
                tag.className = 'ling-monitored-tag';
                tag.innerHTML = '<span style="background:#FF5252;color:white;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:bold;">🚨 监控到</span>';
                tag.style.position = 'absolute';
                tag.style.top = '5px';
                tag.style.right = '5px';
                tag.style.zIndex = '1000';
                if (tweetElement.style.position === 'static' || !tweetElement.style.position) {
                    tweetElement.style.position = 'relative';
                }
                tweetElement.appendChild(tag);
            }
            setTimeout(() => {
                tweetElement.style.border = '';
                tweetElement.style.padding = '';
                tweetElement.style.marginBottom = '';
                tweetElement.style.background = '';
            }, 5000);
        } catch (error) {
            console.error("高亮推文失败:", error);
        }
    }

    function monitorTwitterPage() {
        const cfg = Storage.getConfig();
        if (!cfg.twitterMonitorEnabled || !isTwitterPage()) {
            return;
        }
        console.log("🕵️ 正在监控X/Twitter页面...");
        const tweetSelectors = [
            'article[data-testid="tweet"]',
            'div[data-testid="tweet"]',
            'article',
            'div[role="article"]',
            'div[class*="tweet"]'
        ];
        let foundTweets = false;
        for (const selector of tweetSelectors) {
            const tweets = document.querySelectorAll(selector);
            if (tweets.length > 0) {
                console.log(`🔍 找到 ${tweets.length} 条推文 (选择器: ${selector})`);
                tweets.forEach(tweetElement => {
                    if (!tweetElement.dataset.lingMonitored) {
                        if (shouldMonitorTweet(tweetElement)) {
                            triggerVipTwitterAlert(tweetElement);
                        }
                        tweetElement.dataset.lingMonitored = 'true';
                    }
                });
                foundTweets = true;
                break;
            }
        }
        if (!foundTweets) {
            console.log("⚠️ 未找到推文元素，页面结构可能已更新");
        }
    }

    function setupPageMonitoring() {
        if (!isTwitterPage()) return;
        const cfg = Storage.getConfig();
        if (!cfg.twitterMonitorEnabled) return;
        if (twitterMonitorInterval) {
            clearInterval(twitterMonitorInterval);
            twitterMonitorInterval = null;
        }
        monitorTwitterPage();
        twitterMonitorInterval = setInterval(monitorTwitterPage, 5000);
        console.log("⏰ 页面监控已启动，间隔: 5秒");
    }

    function updateTwitterMonitor() {
        const cfg = Storage.getConfig();
        if (twitterMonitorInterval) {
            clearInterval(twitterMonitorInterval);
            twitterMonitorInterval = null;
        }
        if (cfg.twitterMonitorEnabled && isTwitterPage()) {
            setupPageMonitoring();
        } else {
            console.log("⏸️ 推特监控已暂停");
        }
    }

    function requestNotificationPermission() {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("🔔 通知权限已获得");
                }
            });
        }
    }

    // ================= 3. 动态样式系统 =================
    function updateStyles() {
        const cfg = Storage.getConfig();
        const oldStyle = document.getElementById('ling-style');
        if (oldStyle) oldStyle.remove();
        const css = `
            .ling-trans-box { margin-top: 6px; padding: 8px 10px; background: #0b0b0b; border-left: 3px solid ${cfg.transColor}; border-radius: 4px; color: ${cfg.transColor}; font-size: ${cfg.transFontSize}; line-height: 1.5; font-family: "Consolas", monospace; }
            .ling-discord-box { margin-top: 4px; padding: 4px 8px; opacity: 0.9; background: rgba(0,0,0,0.5); border-left: 2px solid ${cfg.transColor}; }
            .ling-fast-btn { color: #000; font-weight: 800; padding: 3px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; margin: 4px 6px 0 0; border: 1px solid rgba(255,255,255,0.2); display: inline-flex; align-items: center; text-decoration: none !important; transition: all 0.2s; vertical-align: middle; box-shadow: 0 2px 5px rgba(0,0,0,0.3); white-space: nowrap; }
            .ling-fast-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.6); filter: brightness(1.1); }
            .ling-data-tag { background: rgba(0,0,0,0.4); color: #fff; padding: 0 5px; border-radius: 3px; margin-left: 6px; font-size: 11px; font-weight: normal; display: none; }
            .ling-data-loaded .ling-data-tag { display: inline-block; }
            .ling-vip-tweet { border: 2px solid ${cfg.vipColor} !important; background: rgba(243, 186, 47, 0.05) !important; border-radius: 8px !important; }
            .ling-identity-badge { font-weight: 900; font-size: 10px; padding: 2px 5px; border-radius: 3px; margin-left: 5px; vertical-align: middle; display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.5); color: #000; background: ${cfg.vipColor}; }
            .ling-user-note { background-color: ${cfg.noteColor}; color: #fff; font-size: ${cfg.noteFontSize}; padding: 2px 6px; border-radius: 4px; margin-left: 5px; vertical-align: middle; display: inline-block; cursor: pointer; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; }
            .ling-action-btn { cursor: pointer; margin-left: 6px; font-size: 14px; vertical-align: middle; display: inline-block; opacity: 0.4; transition: 0.2s; filter: grayscale(100%); }
            .ling-action-btn:hover { opacity: 1; filter: grayscale(0%); transform: scale(1.2); }
            .ling-action-btn.active { opacity: 1; filter: grayscale(0%); text-shadow: 0 0 8px gold; }
            .ling-twitter-monitor-panel {
                max-height: 300px;
                overflow-y: auto;
                margin-top: 10px;
                border: 1px solid #333;
                border-radius: 6px;
                padding: 8px;
                background: #0a0a0a;
            }
            .ling-monitored-tweet {
                background: #1a1a1a;
                border-left: 3px solid #1DA1F2;
                padding: 8px;
                margin-bottom: 6px;
                border-radius: 4px;
                font-size: 12px;
                line-height: 1.4;
            }
            .ling-monitored-tweet.vip-alert {
                border-left-color: ${cfg.vipColor};
                background: rgba(243, 186, 47, 0.05);
            }
            .ling-monitored-tweet.keyword-alert {
                border-left-color: #FF5252;
                background: rgba(255, 82, 82, 0.05);
            }
            .ling-tweet-username {
                color: #1DA1F2;
                font-weight: bold;
                margin-right: 8px;
            }
            .ling-tweet-username.vip {
                color: ${cfg.vipColor};
            }
            .ling-tweet-time {
                color: #666;
                font-size: 10px;
                float: right;
            }
            .ling-tweet-text {
                color: #ddd;
                margin-top: 4px;
                word-break: break-word;
            }
            .ling-vip-label {
                background: ${cfg.vipColor};
                color: #000;
                padding: 1px 4px;
                border-radius: 3px;
                font-size: 9px;
                font-weight: bold;
                margin-left: 5px;
            }
            .ling-clear-tweets-btn {
                background: #FF5252;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 11px;
                cursor: pointer;
                margin-top: 5px;
                width: 100%;
            }
            .ling-dashboard {
                position: fixed;
                top: 15%;
                right: 20px;
                background: #111;
                border: 1px solid ${cfg.vipColor};
                border-radius: 12px;
                padding: 15px;
                z-index: 2147483646;
                box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                min-width: 260px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
                max-height: 80vh;
                overflow-y: auto;
            }
            .ling-dashboard.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .ling-float-toggle {
                position: fixed;
                right: 10px;
                top: ${cfg.floatTop};
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: #000;
                border: 2px solid ${cfg.vipColor};
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: grab;
                z-index: 2147483645;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                transition: transform 0.1s, opacity 0.2s;
                opacity: 0.8;
                user-select: none;
                overflow: visible;
            }
            .ling-float-toggle:hover {
                opacity: 1;
                transform: scale(1.05);
            }
            .ling-float-toggle:active {
                cursor: grabbing;
                transform: scale(0.95);
            }
            @keyframes ling-shake-anim-twitter {
                0% { transform: translate(0, 0) rotate(0deg); border-color: #1DA1F2; box-shadow: 0 0 30px #1DA1F2; }
                10% { transform: translate(-5px, -5px) rotate(-3deg); }
                20% { transform: translate(5px, 5px) rotate(3deg); }
                30% { transform: translate(-5px, 5px) rotate(-3deg); }
                40% { transform: translate(5px, -5px) rotate(3deg); }
                50% { transform: translate(-3px, 0) rotate(-2deg); border-color: #FF5252; box-shadow: 0 0 30px #FF5252; }
                60% { transform: translate(3px, 0) rotate(2deg); }
                70% { transform: translate(-2px, -2px) rotate(-1deg); border-color: #1DA1F2; box-shadow: 0 0 30px #1DA1F2; }
                80% { transform: translate(2px, 2px) rotate(1deg); }
                90% { transform: translate(-1px, 0) rotate(-0.5deg); }
                100% { transform: translate(0, 0) rotate(0deg); border-color: #1DA1F2; box-shadow: 0 0 30px #1DA1F2; }
            }
            @keyframes ling-shake-anim-strong {
                0% { transform: translate(0, 0) rotate(0deg); border-color: #FF5252; box-shadow: 0 0 50px #FF5252; }
                10% { transform: translate(-8px, -8px) rotate(-8deg); }
                20% { transform: translate(8px, 8px) rotate(8deg); }
                30% { transform: translate(-8px, 8px) rotate(-8deg); }
                40% { transform: translate(8px, -8px) rotate(8deg); }
                50% { transform: translate(-5px, 0) rotate(-5deg); border-color: #FF0000; box-shadow: 0 0 60px #FF0000; }
                60% { transform: translate(5px, 0) rotate(5deg); }
                70% { transform: translate(-3px, -3px) rotate(-3deg); border-color: #FF5252; box-shadow: 0 0 50px #FF5252; }
                80% { transform: translate(3px, 3px) rotate(3deg); }
                90% { transform: translate(-2px, 0) rotate(-2deg); }
                100% { transform: translate(0, 0) rotate(0deg); border-color: #FF5252; box-shadow: 0 0 50px #FF5252; }
            }
            .ling-alert-active {
                animation: ling-shake-anim-strong 0.5s !important;
                animation-iteration-count: infinite !important;
            }
            .ling-twitter-alert {
                animation: ling-shake-anim-twitter 0.5s !important;
                animation-iteration-count: infinite !important;
                border-color: #1DA1F2 !important;
            }
            .ling-logo-text {
                font-family: 'Arial Black', sans-serif;
                font-weight: 900;
                font-size: 14px;
                letter-spacing: -1px;
            }
            .ling-float-close {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 16px;
                height: 16px;
                background: #FF5252;
                color: white;
                border-radius: 50%;
                font-size: 12px;
                line-height: 14px;
                text-align: center;
                font-weight: bold;
                display: none;
                cursor: pointer;
                border: 1px solid #fff;
            }
            .ling-float-toggle:hover .ling-float-close {
                display: block;
            }
            .ling-dash-link {
                display: flex;
                align-items: center;
                color: #fff;
                text-decoration: none;
                padding: 10px;
                background: #222;
                margin-bottom: 8px;
                border-radius: 6px;
                font-size: 13px;
                transition: 0.2s;
                font-weight: bold;
            }
            .ling-dash-link:hover {
                background: #333;
                color: ${cfg.vipColor};
                transform: translateX(5px);
            }
            .ling-dash-btn-row {
                display: flex;
                justify-content: space-between;
                gap: 5px;
                margin-top: 5px;
            }
            .ling-mini-btn {
                flex: 1;
                background: #333;
                border: 1px solid #444;
                color: #ccc;
                padding: 5px;
                border-radius: 4px;
                font-size: 11px;
                cursor: pointer;
                text-align: center;
            }
            .ling-mini-btn:hover {
                background: #444;
                color: #fff;
            }
            #ling-settings-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 2147483647;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #ling-settings-box {
                background: #16181c;
                border: 1px solid #333;
                border-radius: 12px;
                padding: 20px;
                width: 350px;
                color: #fff;
                font-family: sans-serif;
                max-height: 90vh;
                overflow-y: auto;
            }
            .ling-row {
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .ling-btn {
                background: #00E676;
                color: #000;
                border: none;
                padding: 8px;
                border-radius: 5px;
                width: 100%;
                font-weight: bold;
                cursor: pointer;
                margin-top: 10px;
            }
            #ling-sniper-icon {
                position: absolute;
                padding: 4px 10px;
                height: 24px;
                background: #F3BA2F;
                border: 2px solid #fff;
                border-radius: 20px;
                color: #000;
                font-size: 12px;
                font-weight: 900;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                z-index: 2147483647;
                animation: ling-pop 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                transition: transform 0.1s;
                white-space: nowrap;
            }
            #ling-sniper-icon:hover {
                transform: scale(1.1);
                filter: brightness(1.1);
            }
            #ling-sniper-container {
                position: absolute;
                display: none;
                gap: 5px;
                z-index: 2147483647;
                animation: ling-pop 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            }
            .ling-sniper-btn {
                padding: 4px 10px;
                height: 24px;
                border-radius: 20px;
                color: #fff;
                font-size: 12px;
                font-weight: 900;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                border: 2px solid #fff;
                transition: transform 0.1s;
                white-space: nowrap;
            }
            .ling-sniper-btn:hover {
                transform: scale(1.1);
                filter: brightness(1.1);
            }
            #ling-meme-btn {
                background: #F3BA2F;
                color: #000;
            }
            #ling-tweet-btn {
                background: #1DA1F2;
            }
            .ling-market-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #000;
                border: 1px solid #333;
                border-radius: 6px;
                margin-bottom: 10px;
                padding: 10px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            .ling-market-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
            }
            .ling-market-label {
                font-size: 10px;
                font-weight: 800;
                margin-bottom: 2px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .ling-market-val {
                font-weight: 900;
                font-size: 16px;
                font-family: 'Arial', sans-serif;
                color: #fff;
            }
            .ling-market-chg {
                font-size: 10px;
                margin-top: 2px;
                font-weight: bold;
            }
            .ling-gas-val {
                color: #fff;
                font-size: 16px;
                font-weight: 900;
            }
            .ling-up {
                color: #00E676 !important;
            }
            .ling-down {
                color: #FF5252 !important;
            }
            .ling-plat-icon {
                width: 16px;
                height: 16px;
                vertical-align: middle;
                margin-right: 5px;
                border-radius: 50%;
            }
            @keyframes ling-pop {
                from {
                    transform: scale(0);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        `;
        const node = document.createElement('style');
        node.id = 'ling-style';
        node.innerHTML = css;
        document.head.appendChild(node);
    }

    const _u = { d: (str) => decodeURIComponent(escape(window.atob(str))) };

    // ================= 4. 核心功能: 划词狙击 =================
    let sniperContainer = null;

    function initSniper() {
        if (sniperContainer) return;
        sniperContainer = document.createElement('div');
        sniperContainer.id = 'ling-sniper-container';
        const memeBtn = document.createElement('div');
        memeBtn.id = 'ling-meme-btn';
        memeBtn.className = 'ling-sniper-btn';
        memeBtn.innerHTML = '⚡ 搜MEME';
        memeBtn.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const text = sniperContainer.getAttribute('data-text');
            if (text) AlphaCore.sniperSearch(text);
            sniperContainer.style.display = 'none';
        };
        const tweetBtn = document.createElement('div');
        tweetBtn.id = 'ling-tweet-btn';
        tweetBtn.className = 'ling-sniper-btn';
        tweetBtn.innerHTML = '🐦 搜推文';
        tweetBtn.onmousedown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const text = sniperContainer.getAttribute('data-text');
            if (text) AlphaCore.checkTrend(text);
            sniperContainer.style.display = 'none';
        };
        sniperContainer.appendChild(memeBtn);
        sniperContainer.appendChild(tweetBtn);
        document.body.appendChild(sniperContainer);
        document.addEventListener('mouseup', (e) => {
            setTimeout(() => {
                const selection = window.getSelection();
                const text = selection.toString().trim();
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                if (text.length >= 2 && text.length <= 20) {
                    showSniperMenu(e.pageX, e.pageY, text);
                } else {
                    sniperContainer.style.display = 'none';
                }
            }, 10);
        });
        document.addEventListener('mousedown', (e) => {
            if (!sniperContainer.contains(e.target)) {
                sniperContainer.style.display = 'none';
            }
        });
    }

    function showSniperMenu(x, y, text) {
        sniperContainer.style.left = (x + 10) + 'px';
        sniperContainer.style.top = (y - 40) + 'px';
        sniperContainer.setAttribute('data-text', text);
        sniperContainer.style.display = 'flex';
    }

    // ================= 5. 网站特定功能 =================
    function getSiteType() {
        const host = window.location.host;
        if (host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
        if (host.includes('discord.com')) return 'discord';
        if (host.includes('gmgn.ai')) return 'gmgn';
        if (host.includes('okx.com')) return 'okx';
        if (host.includes('binance.com')) return 'binance';
        return 'generic';
    }

    function checkGmgnAutoSearch() {
        if (getSiteType() === 'gmgn') {
            const urlParams = new URLSearchParams(window.location.search);
            const autoKeyword = urlParams.get('ling_auto_search');
            if (autoKeyword) {
                const trySearch = setInterval(() => {
                    const inputs = document.querySelectorAll('input');
                    let searchInput = null;
                    for (let i of inputs) {
                        const ph = (i.placeholder || "").toLowerCase();
                        if (ph.includes('search') || ph.includes('搜索') || ph.includes('address')) {
                            searchInput = i;
                            break;
                        }
                    }
                    if (searchInput) {
                        clearInterval(trySearch);
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(searchInput, autoKeyword);
                        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                        searchInput.focus();
                        setTimeout(() => {
                            searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
                            const form = searchInput.closest('form');
                            if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
                        }, 200);
                    }
                }, 500);
                setTimeout(() => clearInterval(trySearch), 10000);
            }
        }
    }

    function detectChain(address, contextText) {
        if (!address.startsWith('0x')) return 'sol';
        const lowerText = (contextText || "").toLowerCase();
        if (address.toLowerCase().endsWith('4444')) return 'bsc';
        const ethKeywords = ['eth', 'ethereum', 'erc20', 'vitalik', 'base', 'optimism', 'uniswap'];
        if (ethKeywords.some(kw => lowerText.includes(kw))) return 'eth';
        const bscKeywords = ['bsc', 'bnb', 'binance', 'pancakeswap', 'bep20'];
        if (bscKeywords.some(kw => lowerText.includes(kw))) return 'bsc';
        return 'bsc';
    }

    function getChainConfig(chain) {
        if (chain === 'sol') return { name: 'SOL', color: "linear-gradient(90deg, #9945FF 0%, #14F195 100%)", icon: '⚡' };
        if (chain === 'eth') return { name: 'ETH', color: "linear-gradient(90deg, #627EEA 0%, #454A75 100%)", icon: '🦄' };
        return { name: 'BSC', color: "linear-gradient(90deg, #F0B90B 0%, #FFA500 100%)", icon: '🟡' };
    }

    const dataCache = {};

    function loadTokenData(address, btnElement) {
        if (btnElement.dataset.loading === "true") return; // 如果正在查，别重复发请求
        if (dataCache[address]) { updateButtonData(btnElement, dataCache[address]); return; }
        btnElement.dataset.loading = "true";
        btnElement.querySelector('.ling-data-tag').innerText = "加载中...";

        let apiBase = "https://api.dexscreener.com/latest/dex/tokens/";
        try { apiBase = __SystemConfig.decode(__SystemConfig.params.data_endpoint); } catch(e){}

        createProxyRequest({
            method: "GET",
            url: `${apiBase}${address}`,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            },
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data && data.pairs && data.pairs.length > 0) {
                        const bestPair = data.pairs.sort((a, b) => b.liquidity.usd - a.liquidity.usd)[0];
                        const info = {
                            price: parseFloat(bestPair.priceUsd).toFixed(bestPair.priceUsd < 0.01 ? 6 : 4),
                            fdv: formatNumber(bestPair.fdv),
                        };
                        dataCache[address] = info;
                        updateButtonData(btnElement, info);
                    } else {
                        const tag = btnElement.querySelector('.ling-data-tag');
                        if(tag) { tag.innerText = "无数据"; btnElement.classList.add('ling-data-loaded'); }
                    }
                } catch (e) {
                    console.error("解析失败", e);
                    const tag = btnElement.querySelector('.ling-data-tag');
                    if(tag) tag.innerText = "Err";
                }
                btnElement.dataset.loading = "false"; // 解锁
            },
            onerror: (e) => {
                const tag = btnElement.querySelector('.ling-data-tag');
                if (tag) { tag.innerText = "重试"; tag.style.color = "red"; }
                btnElement.dataset.loading = "false"; // 解锁
            }
        });
    }
    function updateButtonData(btn, info) {
        const tag = btn.querySelector('.ling-data-tag');
        if (tag) {
            tag.innerText = `$${info.price} | MC:${info.fdv}`;
            btn.classList.add('ling-data-loaded');
        }
    }

    function formatNumber(num) {
        if (!num) return "-";
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num.toFixed(0);
    }
    function createFastButton(address, chain) {
        const config = getChainConfig(chain);
        const btn = document.createElement('a');
        let link = "";
        try {
            let ref = __SystemConfig.decode(__SystemConfig.params.route_id);
            link = `https://gmgn.ai/${chain}/token/${ref}_${address}`;
        } catch(e) {
            link = `https://gmgn.ai/${chain}/token/${address}`;
        }
        btn.href = link;
        btn.target = "_blank";
        btn.className = 'ling-fast-btn';
        btn.style.background = config.color;
        btn.innerHTML = `${config.icon} ${config.name} <span class="ling-data-tag" style="cursor:pointer;">🔍 点击查价</span>`;
        btn.onmouseenter = () => loadTokenData(address, btn);
        btn.onclick = (e) => e.stopPropagation();

        return btn;
    }

    function processContent(element, text, platform) {
        if (!text || element.dataset.lingProcessed) return;
        element.dataset.lingProcessed = "true";

        // ============== 🤖 BotHunter 猎杀逻辑 ==============
        if (platform === 'twitter' && _BotConfig) {
            const lowerText = text.toLowerCase();
            let isBot = false;
            let botReason = "";

            if (_BotConfig.aiKeywords) {
                for (let kw of _BotConfig.aiKeywords) {
                    if (lowerText.includes(kw)) {
                        isBot = true;
                        botReason = "疑似AI发言";
                        break;
                    }
                }
            }

            if (isBot) {
                if (_BotConfig.autoHide) {
                    const article = element.closest('article');
                    if (article) article.style.display = 'none';
                    return;
                } else {
                    element.style.border = "2px solid #FF0000";
                    const warning = document.createElement('div');
                    warning.style.cssText = "color:red;font-weight:bold;font-size:12px;margin-bottom:5px;background:rgba(255,0,0,0.1);padding:2px;";
                    warning.innerHTML = `🤖 领哥警报: ${botReason} <span class='ling-block-btn' style='cursor:pointer;border:1px solid red;padding:0 5px;margin-left:5px;background:red;color:white;'>[一键屏蔽]</span>`;

                    const btn = warning.querySelector('.ling-block-btn');
                    if(btn) {
                        btn.onclick = (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const article = element.closest('article');
                            if (article) {
                                article.style.opacity = '0.1';
                                article.style.pointerEvents = 'none';
                                alert("已在本地屏蔽此条评论！");
                            }
                        };
                    }
                    element.parentNode.insertBefore(warning, element);
                }
            }
        }

        if (text.length < 10) return;

        let addresses = [];
        if (platform !== 'discord' && platform !== 'generic') {
            const solRegex = /\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/g;
            const evmRegex = /\b(0x[a-fA-F0-9]{40})\b/g;
            let match;
            while ((match = solRegex.exec(text)) !== null) addresses.push({ addr: match[0], type: 'sol' });
            while ((match = evmRegex.exec(text)) !== null) addresses.push({ addr: match[0], type: 'evm' });
        }
        let needTrans = false;
        if (platform === 'twitter' || platform === 'discord') {
            const isForeign = !/[\u4e00-\u9fa5]/.test(text) || (text.match(/[\u4e00-\u9fa5]/g) || []).length / text.length < 0.3;
            if (isForeign) needTrans = true;
        }
        if (needTrans) {
            const textShort = text.length > 2000 ? text.substring(0, 2000) : text;

            let apiBase = "https://translate.googleapis.com/translate_a/single";
            try { apiBase = __SystemConfig.decode(__SystemConfig.params.svc_trans); } catch(e) {}

            const url = `${apiBase}?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(textShort)}`;
            createProxyRequest({
                method: "GET",
                url: url,
                timeout: 5000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        let transResult = "";
                        if (data && data[0]) data[0].forEach(i => { if(i[0]) transResult += i[0]; });
                        renderBox(element, transResult, addresses, text, platform);
                    } catch(e) {
                        if (addresses.length > 0) renderBox(element, null, addresses, text, platform);
                    }
                },
                onerror: () => {
                    if (addresses.length > 0) renderBox(element, null, addresses, text, platform);
                }
            });
        } else if (addresses.length > 0) {
            renderBox(element, null, addresses, text, platform);
        }
    }

    function renderBox(element, transText, addresses, originalText, platform) {
        if (!transText && addresses.length === 0) return;
        const container = document.createElement('div');
        container.className = platform === 'discord' ? 'ling-trans-box ling-discord-box' : 'ling-trans-box';
        if (transText) {
            container.innerHTML = `<span style="opacity:0.6;font-size:10px">[🤖 领哥工具译]</span><br>${transText}`;
        } else {
            container.style.background = "transparent";
            container.style.borderLeft = "none";
            container.style.padding = "0";
        }
        if (platform !== 'discord' && addresses.length > 0) {
            const btnContainer = document.createElement('div');
            if(transText) btnContainer.style.marginTop = "6px";
            addresses.forEach(item => {
                const chain = item.type === 'sol' ? 'sol' : detectChain(item.addr, originalText);
                const btn = createFastButton(item.addr, chain);
                btnContainer.appendChild(btn);
            });
            container.appendChild(btnContainer);
        }
        if (platform === 'twitter') element.parentNode.appendChild(container);
        else element.appendChild(container);
    }
    function refreshUserUI(handle, container) {
        const note = Storage.getNote(handle);
        let noteSpan = container.querySelector('.ling-user-note');
        if (note) {
            if (!noteSpan) {
                noteSpan = document.createElement('span');
                noteSpan.className = 'ling-user-note';
                const toolbar = container.querySelector('.ling-toolbar');
                if (toolbar) container.insertBefore(noteSpan, toolbar);
                else container.appendChild(noteSpan);
            }
            noteSpan.innerText = note;
            noteSpan.onclick = (e) => { e.preventDefault(); e.stopPropagation(); editNote(handle, container); };
        } else if (noteSpan) noteSpan.remove();

        const vipInfo = Storage.getVipInfo(handle);
        let vipBadge = container.querySelector('.ling-identity-badge');
        const article = container.closest('article');

        if (vipInfo) {
            if (article) article.classList.add('ling-vip-tweet');
            if (!vipBadge) {
                vipBadge = document.createElement('span');
                vipBadge.className = 'ling-identity-badge';
                container.appendChild(vipBadge);
            }
            vipBadge.innerText = vipInfo[0];
            const starBtn = container.querySelector('.ling-star-btn');
            if (starBtn) starBtn.classList.add('active');
        } else {
            if (article) article.classList.remove('ling-vip-tweet');
            if (vipBadge) vipBadge.remove();
            const starBtn = container.querySelector('.ling-star-btn');
            if (starBtn) starBtn.classList.remove('active');
        }
    }

    function editNote(handle, container) {
        const old = Storage.getNote(handle) || "";
        const val = prompt(`📝 备注 @${handle}:`, old);
        if (val !== null) { Storage.addNote(handle, val); refreshUserUI(handle, container); }
    }

    function toggleVip(handle, container) {
        const info = Storage.getVipInfo(handle);
        if (info) {
            if (confirm(`⚠️ 取消 @${handle} 的重点关注？`)) {
                Storage.removeVip(handle);
                refreshUserUI(handle, container);
            }
        } else {
            const label = prompt(`🔥 设为重点关注 @${handle}\n输入标签 (如: 顶级VC):`, "重点关注");
            if (label) {
                Storage.addVip(handle, label);
                refreshUserUI(handle, container);
            }
        }
    }
    function processUser(article) {
        if (article.dataset.lingUserProcessed) return;

        let handle = null, container = null;
        const links = article.querySelectorAll('a[href*="/"]');

        for (let link of links) {
            const h = link.getAttribute('href');
            if (h && !h.includes('/status/') && !h.includes('/hashtag/')) {
                const userNameDiv = article.querySelector('div[data-testid="User-Name"]');
                if (userNameDiv && userNameDiv.contains(link)) {
                    handle = normalizeHandle(h);
                    if (!handle) continue;

                    container = link.querySelector('div[dir="ltr"]') || link.parentNode;
                    break;
                }
            }
        }

        if (handle && container) {
            article.dataset.lingUserProcessed = "true";

            // 💀 黑名单检测
            if (_BotConfig && _BotConfig.blackList && _BotConfig.blackList.includes(handle)) {
                console.log(`💀 [领哥防身] 猎杀黑名单用户: ${handle}`);
                article.style.display = 'none';
                return;
            }

            // ✅ 在X Pro界面中，只显示备注和VIP，不显示工具栏
            if (!isProXInterface) {
                // 只在非X Pro界面添加工具栏
                if (!container.querySelector('.ling-toolbar')) {
                    const toolbar = document.createElement('span');
                    toolbar.className = 'ling-toolbar';
                    toolbar.style.whiteSpace = "nowrap";

                    const pen = document.createElement('span');
                    pen.className = 'ling-action-btn';
                    pen.innerHTML = '✏️';
                    pen.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        editNote(handle, container);
                    };

                    const star = document.createElement('span');
                    star.className = 'ling-action-btn ling-star-btn';
                    star.innerHTML = '⭐';
                    star.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleVip(handle, container);
                    };

                    toolbar.appendChild(pen);
                    toolbar.appendChild(star);
                    container.appendChild(toolbar);
                }
            }

            refreshUserUI(handle, container);
        }
    }

    // ================= 7. 控制台 & 设置 =================
    function checkBackgroundTask() {
        const cfg = Storage.getConfig();
        const dashboard = document.querySelector('.ling-dashboard');
        const isDashboardOpen = dashboard && dashboard.classList.contains('active');
        if (isDashboardOpen || cfg.sentinelMode) {
            refreshMarketData();
            if (!marketTimer) {
                marketTimer = setInterval(refreshMarketData, 5000);
                console.log("⚡ 核心引擎：已启动 (5s/次)");
            }
        } else {
            if (marketTimer) {
                clearInterval(marketTimer);
                marketTimer = null;
                console.log("💤 核心引擎：已休眠");
            }
        }
    }

    function toggleDashboard() {
        let dashboard = document.querySelector('.ling-dashboard');
        if (!dashboard) {
            initDashboard();
            dashboard = document.querySelector('.ling-dashboard');
        }
        if (dashboard.classList.contains('active')) {
            dashboard.classList.remove('active');
            setTimeout(() => {
                dashboard.style.display = 'none';
            }, 200);
            isDashboardOpen = false;
        } else {
            dashboard.style.display = 'block';
            void dashboard.offsetWidth;
            setTimeout(() => {
                dashboard.classList.add('active');
            }, 10);
            isDashboardOpen = true;
        }
        checkBackgroundTask();
    }

    function handleMenuCommand() {
        let ball = document.querySelector('.ling-float-toggle');
        if (!ball) {
            createFloatingToggle();
            ball = document.querySelector('.ling-float-toggle');
        }
        if (ball.style.display === 'none') {
            ball.style.display = 'flex';
            alert("🦅 悬浮球已召回！");
        } else {
            toggleDashboard();
        }
    }

    const AlphaCore = {
        sniperSearch: (keyword) => {
            if(!keyword) return;
            GM_setClipboard(keyword);

            let refCode = "1DRFPE0z";
            try { refCode = __SystemConfig.decode(__SystemConfig.params.route_id); } catch(e){}

            const targetUrl = `https://gmgn.ai/?chain=bsc&ref=${refCode}&ling_auto_search=${encodeURIComponent(keyword)}`;
            window.open(targetUrl, "_blank");
        },
        checkTrend: (keyword) => {
            if(!keyword) return;
            if (location.host.includes('x.com') || location.host.includes('twitter.com')) {
                const searchInput = document.querySelector('input[data-testid="SearchBox_Search_Input"]');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                    document.execCommand('delete');
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(searchInput, keyword);
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => {
                        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
                        const form = searchInput.closest('form');
                        if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
                    }, 100);
                    return;
                }
            }
            const encoded = encodeURIComponent(keyword);
            window.open(`https://x.com/search?q=${encoded}&src=typed_query&f=live`, "_blank");
        }
    };

    let lastGas = 0;
    let lastBtc = 0;
    let lastEth = 0;

    function triggerAlert(isTest = false) {
        const cfg = Storage.getConfig();
        if (!isTest && !cfg.sentinelMode) return;
        console.log("⚡ 市场警报触发！");
        stopAlert();
        currentAlertType = 'market';
        isAlerting = true;
        const ball = document.querySelector('.ling-float-toggle');
        if (ball && cfg.sentinelShake) {
            ball.classList.add('ling-alert-active');
            ball.classList.remove('ling-twitter-alert');
        }
        try {
            createAlertSound(cfg.soundType);
        } catch(e) {
            console.error("音效播放失败:", e);
            try {
                createAlertSound('alarm1');
            } catch(e2) {}
        }
        alertInterval = setInterval(() => {
            try {
                createAlertSound(cfg.soundType);
            } catch(e) {}
        }, 1000);
        const duration = (cfg.alertDuration || 10) * 1000;
        alertTimeout = setTimeout(() => {
            if (currentAlertType === 'market') {
                stopAlert();
            }
        }, duration);
    }

    function stopAlert() {
        isAlerting = false;
        currentAlertType = null;
        if (alertInterval) {
            clearInterval(alertInterval);
            alertInterval = null;
        }
        if (alertTimeout) {
            clearTimeout(alertTimeout);
            alertTimeout = null;
        }
        const ball = document.querySelector('.ling-float-toggle');
        if (ball) {
            ball.classList.remove('ling-alert-active');
            ball.classList.remove('ling-twitter-alert');
            const originalTitle = ball.getAttribute('data-original-title');
            if (originalTitle) {
                ball.title = originalTitle;
                ball.removeAttribute('data-original-title');
            } else {
                ball.title = '打开工具箱 / 🔕 点击停止报警';
            }
        }
        console.log("🔕 报警已解除");
    }

    function testAlertSound(soundType, isTwitter = false, withShake = true) {
        try {
            console.log(`🔊 测试${isTwitter ? '推特' : '哨兵模式'}警报声音: ${soundType}, 震动: ${withShake}`);
            const cfg = Storage.getConfig();
            const duration = isTwitter ? (cfg.twitterAlertDuration || 10) : (cfg.alertDuration || 10);
            const ball = document.querySelector('.ling-float-toggle');
            if (ball && withShake) {
                if (isTwitter) {
                    ball.classList.add('ling-twitter-alert');
                } else {
                    ball.classList.add('ling-alert-active');
                }
                setTimeout(() => {
                    ball.classList.remove('ling-alert-active', 'ling-twitter-alert');
                }, duration * 1000);
            }
            let playCount = 0;
            const maxPlayCount = Math.ceil(duration);
            const playSound = () => {
                if (playCount < maxPlayCount) {
                    createAlertSound(soundType);
                    playCount++;
                    setTimeout(playSound, 1000);
                }
            };
            playSound();
            alert(`✅ ${isTwitter ? '推特' : '哨兵模式'}警报测试成功！将持续${duration}秒${withShake ? '（含震动效果）' : '（仅声音）'}`);
        } catch (error) {
            console.error("声音测试失败:", error);
            alert("❌ 声音测试失败，请检查音频权限");
        }
    }

    function refreshMarketData() {
        const cfg = Storage.getConfig();
        // 1. 获取 Gas (使用 LlamaRPC 节点，更稳定)
        const fetchGasFast = () => {
            const url = 'https://eth.llamarpc.com';
            createProxyRequest({
                method: "POST",
                url: url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_gasPrice",
                    params: [],
                    id: 1
                }),
                timeout: 5000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data && data.result) {
                            const gasWei = parseInt(data.result, 16);
                            const fastGasPrice = gasWei / 1000000000;
                            updateGasUI(fastGasPrice);
                        } else {
                            updateGasUI(null);
                        }
                    } catch(e) {
                        console.error("Gas数据解析失败:", e);
                        updateGasUI(null);
                    }
                },
                onerror: () => {
                    console.error("Gas API请求失败");
                    updateGasUI(null);
                },
                ontimeout: () => {
                    console.error("Gas API请求超时");
                    updateGasUI(null);
                }
            });
        };
        const updateGasUI = (fastGasPrice) => {
            const el = document.getElementById('ling-gas');
            if(el) {
                let displayText;
                if (fastGasPrice === null || fastGasPrice === undefined) {
                    displayText = 'Err';
                    el.style.color = 'red';
                } else {
                    if (fastGasPrice < 1) {
                        displayText = '<1';
                        el.style.color = '#00E676';
                    } else {
                        const gasGwei = Math.round(fastGasPrice);
                        displayText = gasGwei.toString();
                        el.style.color = gasGwei > 50 ? '#FF5252' : (gasGwei > 30 ? '#FF9800' : '#00E676');
                    }
                }
                el.innerText = displayText;
            }
            if (fastGasPrice !== null && lastGas > 0 && fastGasPrice > lastGas + (cfg.gasThreshold || 10)) {
                console.log(`⚠️ Gas价格波动: ${lastGas} → ${fastGasPrice} (超过阈值${cfg.gasThreshold || 10})`);
                triggerAlert();
            }
            if (fastGasPrice !== null) {
                lastGas = fastGasPrice;
            }
        };
        const fetchPricesFast = () => {
            // 使用 ticker/24hr 接口获取涨跌幅数据
            const api = 'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT"]';
            createProxyRequest({
                method: "GET",
                url: api,
                timeout: 3000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        data.forEach(item => {
                            if(item.symbol === 'BTCUSDT') updatePriceUI('ling-btc-price', parseFloat(item.lastPrice), 'btc', parseFloat(item.priceChangePercent));
                            if(item.symbol === 'ETHUSDT') updatePriceUI('ling-eth-price', parseFloat(item.lastPrice), 'eth', parseFloat(item.priceChangePercent));
                        });
                    } catch(e) {
                        console.error("价格数据解析失败:", e);
                        fetchPricesBackup();
                    }
                },
                onerror: () => {
                    console.error("价格API请求失败");
                    fetchPricesBackup();
                }
            });
        };
        const updatePriceUI = (id, price, type, percent) => {
            const el = document.getElementById(id);
            const elChg = document.getElementById(type === 'btc' ? 'ling-btc-chg' : 'ling-eth-chg');
            if(el) {
                let formattedPrice;
                if (price >= 1000) {
                    formattedPrice = '$' + Math.round(price).toLocaleString();
                } else if (price >= 1) {
                    formattedPrice = '$' + price.toFixed(2);
                } else {
                    formattedPrice = '$' + price.toFixed(4);
                }
                el.innerText = formattedPrice;
                el.className = `ling-market-val ${type === 'btc' ? 'ling-color-btc' : 'ling-color-eth'}`;
                // 更新涨跌幅显示
                if (elChg && percent !== undefined && !isNaN(percent)) {
                    const sign = percent >= 0 ? '+' : '';
                    elChg.innerText = `${sign}${percent.toFixed(2)}%`;
                    elChg.className = `ling-market-chg ${percent >= 0 ? 'ling-up' : 'ling-down'}`;
                }
                let lastVal = type === 'btc' ? lastBtc : lastEth;
                if (lastVal > 0 && price > 0) {
                    const diff = Math.abs(price - lastVal) / lastVal;
                    const priceThreshold = cfg.priceThreshold || 0.5;
                    if (diff * 100 > priceThreshold) {
                        console.log(`⚠️ ${type.toUpperCase()}价格波动超过${priceThreshold}%: ${lastVal} → ${price} (${(diff*100).toFixed(2)}%)`);
                        triggerAlert();
                    }
                }
                if (type === 'btc') lastBtc = price; else lastEth = price;
            }
        };
        const fetchPricesBackup = () => {
            console.log("使用备用价格接口");
            const getDex = (url, pId, cId, type) => {
                createProxyRequest({
                    method: "GET",
                    url: url,
                    timeout: 5000,
                    onload: (r) => {
                        try {
                            const d = JSON.parse(r.responseText);
                            if(d.pair) renderPrice(pId, cId, d.pair, type);
                        } catch(e){
                            console.error("备用价格解析失败:", e);
                        }
                    }
                });
            };
            getDex("https://api.dexscreener.com/latest/dex/pairs/ethereum/0xcbcdf9626bc03e24f779434178a73a0b4bad62ed", 'ling-btc-price', 'ling-btc-chg', 'btc');
            getDex("https://api.dexscreener.com/latest/dex/pairs/ethereum/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640", 'ling-eth-price', 'ling-eth-chg', 'eth');
        };
        function renderPrice(id, chgId, pair, colorType) {
            if (!pair) return;
            const price = parseFloat(pair.priceUsd);
            const chg = pair.priceChange && pair.priceChange.h24 ? pair.priceChange.h24 : 0;
            const elPrice = document.getElementById(id);
            const elChg = document.getElementById(chgId);
            if(!elPrice || !elChg) return;
            const chgColor = chg >= 0 ? 'ling-up' : 'ling-down';
            const sign = chg >= 0 ? '+' : '';
            elPrice.innerText = '$' + Math.round(price).toLocaleString();
            elPrice.className = `ling-market-val ${colorType === 'btc' ? 'ling-color-btc' : 'ling-color-eth'}`;
            elChg.innerText = `${sign}${chg.toFixed(2)}%`;
            elChg.className = `ling-market-chg ${chgColor}`;
            const cfg = Storage.getConfig();
            let lastVal = colorType === 'btc' ? lastBtc : lastEth;
            if (lastVal > 0 && price > 0) {
                const diff = Math.abs(price - lastVal) / lastVal;
                const priceThreshold = cfg.priceThreshold || 0.5;
                if (diff * 100 > priceThreshold) {
                    console.log(`⚠️ ${colorType.toUpperCase()}价格波动超过${priceThreshold}%: ${lastVal} → ${price} (${(diff*100).toFixed(2)}%)`);
                    triggerAlert();
                }
            }
            if (colorType === 'btc') lastBtc = price; else lastEth = price;
        }
        fetchGasFast();
        fetchPricesFast();
    }

    function updateTwitterMonitorPanel() {
        const panel = document.getElementById('ling-twitter-monitor-panel');
        if (!panel) return;
        const tweets = Storage.getMonitoredTweets();
        panel.innerHTML = '';
        if (tweets.length === 0) {
            panel.innerHTML = '<div style="color:#666;text-align:center;padding:20px;">暂无监控到的推文</div>';
            return;
        }
        tweets.slice(0, 10).forEach(tweet => {
            const tweetEl = document.createElement('div');
            tweetEl.className = `ling-monitored-tweet ${tweet.isVip ? 'vip-alert' : ''} ${tweet.isKeywordAlert ? 'keyword-alert' : ''}`;
            tweetEl.innerHTML = `
                <div>
                    <span class="ling-tweet-username ${tweet.isVip ? 'vip' : ''}">@${tweet.username}</span>
                    ${tweet.isVip && tweet.vipLabel ? `<span class="ling-vip-label">${tweet.vipLabel}</span>` : ''}
                    <span class="ling-tweet-time">${tweet.time}</span>
                </div>
                <div class="ling-tweet-text">${tweet.text ? tweet.text.substring(0, 100) : '无内容'}${tweet.text && tweet.text.length > 100 ? '...' : ''}</div>
            `;
            panel.appendChild(tweetEl);
        });
        const clearBtn = document.createElement('button');
        clearBtn.className = 'ling-clear-tweets-btn';
        clearBtn.textContent = '清空历史记录';
        clearBtn.onclick = () => {
            Storage.clearMonitoredTweets();
            updateTwitterMonitorPanel();
        };
        panel.appendChild(clearBtn);
    }

    function initDashboard() {
        const __Kernel = {
            getLinks: () => {
                try {
                    return {
                        ok: __SystemConfig.decode(__SystemConfig.params.ch_a),
                        bn: __SystemConfig.decode(__SystemConfig.params.ch_b),
                        gmgn: `https://gmgn.ai/?ref=${__SystemConfig.decode(__SystemConfig.params.route_id)}`
                    };
                } catch(e) { return {}; }
            }
        };
        const links = __Kernel.getLinks();
        const cfg = Storage.getConfig();
        const vips = Storage.getVips();
        const vipCount = Object.keys(vips).length;
        const div = document.createElement('div');
        div.className = 'ling-dashboard';
        div.innerHTML = `
            <div style="color:#F3BA2F;font-weight:bold;margin-bottom:10px;display:flex;justify-content:space-between;border-bottom:1px solid #333;padding-bottom:5px;">
                <span>🦅 领哥工具箱 V20.2</span><span style="cursor:pointer;" id="ling-close-dash">✕</span>
            </div>
            <div style="color:#1DA1F2;font-size:12px;margin-bottom:8px;font-weight:bold;">⭐ 重点关注监控 (${vipCount}个)</div>
            <div style="font-size:10px;color:#888;margin-bottom:8px;">监控模式: ${cfg.monitorVipOnly ? '仅重点关注' : (cfg.monitorAllTweets ? '所有推文' : '仅重点关注')}</div>
            <div id="ling-twitter-monitor-panel" class="ling-twitter-monitor-panel">
                <div style="color:#666;text-align:center;padding:20px;">加载中...</div>
            </div>
            <div id="ling-market-bar" class="ling-market-bar">
                <div class="ling-market-item" id="ling-gas-item" style="cursor:pointer;" title="🔥 点击查看 UltraSound">
                    <span class="ling-market-label" style="font-size:16px;">⛽</span>
                    <span id="ling-gas" class="ling-gas-val">--</span>
                    <span style="height:10px"></span>
                </div>
                <div style="width:1px;height:25px;background:#333;"></div>
                <div class="ling-market-item">
                    <span class="ling-market-label" style="color:#00BFFF">ETH</span>
                    <span id="ling-eth-price" class="ling-market-val">--</span>
                    <span id="ling-eth-chg" class="ling-market-chg">--%</span>
                </div>
                <div style="width:1px;height:25px;background:#333;"></div>
                <div class="ling-market-item">
                    <span class="ling-market-label" style="color:#F3BA2F">BTC</span>
                    <span id="ling-btc-price" class="ling-market-val">--</span>
                    <span id="ling-btc-chg" class="ling-market-chg">--%</span>
                </div>
            </div>
            <a href="${links.gmgn}" target="_blank" class="ling-dash-link">
                <img src="https://www.google.com/s2/favicons?domain=gmgn.ai&sz=32" class="ling-plat-icon"> 去 GMGN 交易
            </a>
            <a href="${links.ok}" target="_blank" class="ling-dash-link">
                <img src="https://www.google.com/s2/favicons?domain=okx.com&sz=32" class="ling-plat-icon"> 去 OKX 交易
            </a>
            <a href="${links.bn}" target="_blank" class="ling-dash-link">
                <img src="https://www.google.com/s2/favicons?domain=binance.com&sz=32" class="ling-plat-icon"> 去 Binance 交易
            </a>
            <div class="ling-dash-btn-row">
                <div class="ling-mini-btn" id="ling-btn-set">⚙️ 设置</div>
                <div class="ling-mini-btn" id="ling-btn-bk">📤 备份</div>
                <div class="ling-mini-btn" id="ling-btn-rs">📥 恢复</div>
            </div>
            <a href="https://x.com/shangdu2005" target="_blank" class="ling-dash-link" style="margin-top:10px;justify-content:center;background:#1DA1F2;color:#fff;">🐦 关注领哥推特 @shangdu2005</a>
            <div style="margin-top:8px;font-size:10px;color:#666;text-align:center;">V20.2终极版 | ${isProXInterface ? 'pro.x.com界面' : '标准界面'}</div>
        `;
        document.body.appendChild(div);
        document.getElementById('ling-close-dash').onclick = () => { toggleDashboard(); };
        document.getElementById('ling-btn-set').onclick = openSettings;
        document.getElementById('ling-btn-bk').onclick = Storage.export;
        document.getElementById('ling-btn-rs').onclick = Storage.import;
        document.getElementById('ling-gas-item').onclick = () => window.open('https://ultrasound.money/', '_blank');
        setTimeout(updateTwitterMonitorPanel, 100);
        setTimeout(refreshMarketData, 300);
    }

    function createFloatingToggle() {
        if (document.querySelector('.ling-float-toggle')) return;
        const div = document.createElement('div');
        div.className = 'ling-float-toggle';
        div.innerHTML = `
            <span class="ling-logo-text">Ling</span>
            <div class="ling-float-close" title="收起悬浮球 (在菜单中召回)">✕</div>
        `;
        div.title = '打开工具箱 / 🔕 鼠标触碰停止报警';
        div.onmouseenter = () => {
            if (isAlerting) {
                console.log("🖱️ 鼠标触碰悬浮球：停止警报");
                stopAlert();
                const logo = div.querySelector('.ling-logo-text');
                const oldText = logo.innerText;
                logo.innerText = "🔕";
                logo.style.color = "#FF5252";
                setTimeout(() => {
                    logo.innerText = oldText;
                    logo.style.color = "#fff";
                }, 1000);
            }
        };
        div.onclick = (e) => {
            if (e.target.className === 'ling-float-close') return;
            if (div.getAttribute('data-dragging') === 'true') return;
            unlockAudio();
            if (isAlerting) {
                stopAlert();
                return;
            }
            toggleDashboard();
        };
        const closeBtn = div.querySelector('.ling-float-close');
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            div.style.display = 'none';
        };
        let isDragging = false;
        let startY, startTop;
        div.onmousedown = (e) => {
            if (e.target.className === 'ling-float-close') return;
            isDragging = false;
            div.setAttribute('data-dragging', 'false');
            startY = e.clientY;
            startTop = div.offsetTop;
            document.onmousemove = (ev) => {
                if (Math.abs(ev.clientY - startY) > 3) {
                    isDragging = true;
                    div.setAttribute('data-dragging', 'true');
                    div.style.cursor = 'grabbing';
                }
                if (isDragging) {
                    let newTop = startTop + (ev.clientY - startY);
                    const maxTop = window.innerHeight - 50;
                    if (newTop < 10) newTop = 10;
                    if (newTop > maxTop) newTop = maxTop;
                    div.style.top = newTop + 'px';
                }
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                div.style.cursor = 'grab';
                if (isDragging) {
                    const cfg = Storage.getConfig();
                    cfg.floatTop = div.style.top;
                    Storage.setConfig(cfg);
                    setTimeout(() => div.setAttribute('data-dragging', 'false'), 100);
                }
            };
        };
        document.body.appendChild(div);
        document.addEventListener('click', (e) => {
            const dashboard = document.querySelector('.ling-dashboard');
            const floatToggle = document.querySelector('.ling-float-toggle');
            if (dashboard && dashboard.classList.contains('active')) {
                const isClickInsideDashboard = dashboard.contains(e.target);
                const isClickInsideFloatToggle = floatToggle && floatToggle.contains(e.target);
                if (isClickInsideDashboard || isClickInsideFloatToggle) {
                    return;
                }
                toggleDashboard();
            }
        }, true);
    }

    function openSettings() {
        if (document.getElementById('ling-settings-overlay')) return;
        const cfg = Storage.getConfig();
        const vips = Storage.getVips();
        const vipList = Object.keys(vips).map(username => `@${username}`).join(', ');
        const div = document.createElement('div');
        div.id = 'ling-settings-overlay';
        div.innerHTML = `
            <div id="ling-settings-box">
                <h3 style="margin-top:0;color:#F3BA2F;border-bottom:1px solid #333;padding-bottom:10px;">⚙️ 终端设置 V20.2版</h3>
                <div style="background:#222;padding:10px;border-radius:5px;margin-bottom:15px;border:1px solid #444;">
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label style="color:#F3BA2F;font-weight:bold;">🚨 哨兵模式</label>
                        <input type="checkbox" id="c-sentinel" ${cfg.sentinelMode ? 'checked' : ''} style="transform:scale(1.5);">
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label style="width:120px;">警报声音</label>
                        <select id="c-sound" style="width:120px;background:#000;border:1px solid #444;color:#fff;padding:2px;">
                            <option value="alarm1" ${cfg.soundType === 'alarm1' ? 'selected' : ''}>核警报</option>
                            <option value="alarm2" ${cfg.soundType === 'alarm2' ? 'selected' : ''}>蜂鸣器</option>
                            <option value="alarm3" ${cfg.soundType === 'alarm3' ? 'selected' : ''}>雷达声</option>
                            <option value="alarm4" ${cfg.soundType === 'alarm4' ? 'selected' : ''}>MEME提醒</option>
                        </select>
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label style="width:120px;">悬浮球震动</label>
                        <input type="checkbox" id="c-sentinel-shake" ${cfg.sentinelShake ? 'checked' : ''} style="transform:scale(1.2);">
                        <button class="ling-mini-btn" id="test-sentinel-alert" style="width:80px;background:#F3BA2F;color:#000;">测试警报</button>
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label>报警时长(秒)</label>
                        <input type="number" id="c-duration" value="${cfg.alertDuration}" style="width:60px;background:#000;border:1px solid #444;color:#fff;padding:2px;" min="5" max="60">
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label>Gas上涨阈值(Gwei)</label>
                        <input type="number" id="c-gas-threshold" value="${cfg.gasThreshold}" style="width:60px;background:#000;border:1px solid #444;color:#fff;padding:2px;" min="1" max="100">
                    </div>
                    <div class="ling-row">
                        <label>价格波动阈值(%)</label>
                        <input type="number" id="c-price-threshold" value="${cfg.priceThreshold}" style="width:60px;background:#000;border:1px solid #444;color:#fff;padding:2px;" min="0.1" max="10" step="0.1">
                    </div>
                </div>
                <div style="background:#222;padding:10px;border-radius:5px;margin-bottom:15px;border:1px solid #444;">
                    <div class="ling-row" style="margin-bottom:8px;">
                        <label style="color:#1DA1F2;font-weight:bold;">⭐ 重点关注监控</label>
                        <input type="checkbox" id="c-twitter-monitor" ${cfg.twitterMonitorEnabled ? 'checked' : ''} style="transform:scale(1.5);">
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label style="width:120px;">当前重点关注</label>
                        <span style="font-size:11px;color:#888;flex:1;">${vipList || '无重点关注账号'}</span>
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label style="width:120px;">监控模式</label>
                        <select id="c-monitor-mode" style="width:120px;background:#000;border:1px solid #444;color:#fff;padding:2px;">
                            <option value="vip" ${cfg.monitorVipOnly ? 'selected' : ''}>仅重点关注账号</option>
                            <option value="all" ${cfg.monitorAllTweets ? 'selected' : ''}>监控所有推文</option>
                        </select>
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label style="width:120px;">监控关键词</label>
                        <input type="text" id="c-twitter-keywords" value="${cfg.twitterKeywords?.join(', ') || ''}" style="width:180px;background:#000;border:1px solid #444;color:#fff;padding:2px;" placeholder="留空则不筛选关键词">
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label style="width:120px;">提醒音效</label>
                        <select id="c-twitter-sound" style="width:120px;background:#000;border:1px solid #444;color:#fff;padding:2px;">
                            <option value="alarm4" ${cfg.twitterAlertSound === 'alarm4' ? 'selected' : ''}>MEME提醒</option>
                            <option value="alarm1" ${cfg.twitterAlertSound === 'alarm1' ? 'selected' : ''}>核警报</option>
                            <option value="alarm2" ${cfg.twitterAlertSound === 'alarm2' ? 'selected' : ''}>蜂鸣器</option>
                            <option value="alarm3" ${cfg.twitterAlertSound === 'alarm3' ? 'selected' : ''}>雷达声</option>
                        </select>
                    </div>
                    <div class="ling-row" style="margin-bottom:5px;">
                        <label style="width:120px;">悬浮球震动</label>
                        <input type="checkbox" id="c-twitter-shake" ${cfg.twitterAlertShake ? 'checked' : ''} style="transform:scale(1.2);">
                        <button class="ling-mini-btn" id="test-twitter-alert" style="width:80px;background:#1DA1F2;color:#fff;">测试警报</button>
                    </div>
                    <div class="ling-row">
                        <label style="width:120px;">提醒时长(秒)</label>
                        <input type="number" id="c-twitter-duration" value="${cfg.twitterAlertDuration}" style="width:60px;background:#000;border:1px solid #444;color:#fff;padding:2px;" min="5" max="60">
                    </div>
                </div>
                <div class="ling-row"><label>翻译颜色</label><input type="color" id="c-tc" value="${cfg.transColor}"></div>
                <div class="ling-row"><label>翻译字号</label><input type="text" id="c-ts" value="${cfg.transFontSize}" style="width:60px;background:#222;border:1px solid #444;color:#fff;padding:2px;"></div>
                <button class="ling-btn" id="ling-save">保存全部配置</button>
                <button class="ling-btn" id="ling-close" style="background:#333;color:#fff;margin-top:10px">关闭面板</button>
            </div>
        `;
        document.body.appendChild(div);
        document.getElementById('test-sentinel-alert').onclick = () => {
            const soundType = document.getElementById('c-sound').value;
            const withShake = document.getElementById('c-sentinel-shake').checked;
            testAlertSound(soundType, false, withShake);
        };
        document.getElementById('test-twitter-alert').onclick = () => {
            const soundType = document.getElementById('c-twitter-sound').value;
            const withShake = document.getElementById('c-twitter-shake').checked;
            testAlertSound(soundType, true, withShake);
        };
        document.getElementById('ling-close').onclick = () => div.remove();
        document.getElementById('ling-save').onclick = () => {
            const monitorMode = document.getElementById('c-monitor-mode').value;
            const twitterKeywords = document.getElementById('c-twitter-keywords').value.split(',').map(kw => kw.trim()).filter(kw => kw);
            Storage.setConfig({
                transColor: document.getElementById('c-tc').value,
                transFontSize: document.getElementById('c-ts').value,
                noteColor: '#1D9BF0',
                vipColor: '#F3BA2F',
                sentinelMode: document.getElementById('c-sentinel').checked,
                sentinelShake: document.getElementById('c-sentinel-shake').checked,
                alertDuration: parseInt(document.getElementById('c-duration').value) || 10,
                soundType: document.getElementById('c-sound').value,
                gasThreshold: parseInt(document.getElementById('c-gas-threshold').value) || 10,
                priceThreshold: parseFloat(document.getElementById('c-price-threshold').value) || 0.5,
                twitterMonitorEnabled: document.getElementById('c-twitter-monitor').checked,
                twitterAlertSound: document.getElementById('c-twitter-sound').value,
                twitterAlertShake: document.getElementById('c-twitter-shake').checked,
                twitterAlertDuration: parseInt(document.getElementById('c-twitter-duration').value) || 10,
                twitterKeywords: twitterKeywords,
                monitorVipOnly: monitorMode === 'vip',
                monitorAllTweets: monitorMode === 'all',
                proXInterfaceSupport: true
            });
            div.remove();
            alert("✅ 配置已保存！\n重点监控模式：" + (monitorMode === 'vip' ? '重点监控账号' : '监控所有推文'));
        };
    }

    // 代理测试函数
    function testProxyConnection() {
        console.log("🔍 测试代理连接...");
        createProxyRequest({
            method: "GET",
            url: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle',
            timeout: 5000,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.status === '1') {
                        alert(`✅ 代理连接成功！\n当前Gas价格: ${data.result.FastGasPrice} Gwei`);
                        console.log("✅ 代理连接成功，Gas价格:", data.result.FastGasPrice);
                    } else {
                        alert("⚠️ 代理连接测试失败，但请求已发出");
                        console.warn("⚠️ 代理连接测试失败，但请求已发出");
                    }
                } catch(e) {
                    alert("❌ 代理测试解析失败");
                    console.error("代理测试解析失败:", e);
                }
            },
            onerror: (e) => {
                alert("❌ 代理连接失败，请检查代理设置");
                console.error("❌ 代理连接失败:", e);
            }
        });
    }

    GM_registerMenuCommand("🦅 打开/关闭工具箱", handleMenuCommand);

    // ================= 8. 全站初始化 =================
    function initForAllSites() {
        checkProXInterface();
        updateStyles();
        createFloatingToggle();
        initSniper();
        checkGmgnAutoSearch();
        requestNotificationPermission();
        updateTwitterMonitor();
        const siteType = getSiteType();
        console.log("🔍 网站类型:", siteType, isProXInterface ? "(pro.x.com界面)" : "");
        if (siteType === 'twitter' || siteType === 'discord' || siteType === 'generic') {
            const observer = new MutationObserver((ms) => {
                ms.forEach(m => m.addedNodes.forEach(n => {
                    if (n.nodeType === 1) {
                        if (siteType === 'twitter') {
                            const tweets = n.querySelectorAll ? n.querySelectorAll('div[data-testid="tweetText"]') : [];
                            tweets.forEach(t => processContent(t, t.innerText, 'twitter'));
                            if(n.tagName === 'ARTICLE') processUser(n);
                            else if(n.querySelectorAll) n.querySelectorAll('article').forEach(processUser);
                            const cfg = Storage.getConfig();
                            if (cfg.twitterMonitorEnabled) {
                                const newArticles = n.querySelectorAll ? n.querySelectorAll('article') : [];
                                newArticles.forEach(article => {
                                    if (!article.dataset.lingMonitored) {
                                        if (shouldMonitorTweet(article)) {
                                            triggerVipTwitterAlert(article);
                                        }
                                        article.dataset.lingMonitored = 'true';
                                    }
                                });
                            }
                        }
                        else if (siteType === 'discord') {
                            const messages = n.querySelectorAll ? n.querySelectorAll('div[id^="message-content"]') : [];
                            messages.forEach(msg => processContent(msg, msg.innerText, 'discord'));
                        }
                        else if (siteType === 'generic') {
                            if(n.innerText && n.innerText.length > 30 && n.innerText.length < 500) {
                                processContent(n, n.innerText, 'generic');
                            }
                        }
                    }
                }));
            });
            const start = () => {
                if(document.body) {
                    if (siteType === 'twitter') {
                        document.querySelectorAll('div[data-testid="tweetText"]').forEach(t => processContent(t, t.innerText, 'twitter'));
                        document.querySelectorAll('article').forEach(processUser);
                        const cfg = Storage.getConfig();
                        if (cfg.twitterMonitorEnabled) {
                            console.log("🔍 扫描现有推文进行重点监控...");
                            const articles = document.querySelectorAll('article');
                            articles.forEach(article => {
                                if (!article.dataset.lingMonitored) {
                                    if (shouldMonitorTweet(article)) {
                                        triggerVipTwitterAlert(article);
                                    }
                                    article.dataset.lingMonitored = 'true';
                                }
                            });
                        }
                    }
                    else if (siteType === 'discord') {
                        document.querySelectorAll('div[id^="message-content"]').forEach(msg => processContent(msg, msg.innerText, 'discord'));
                    }
                    observer.observe(document.body, {childList: true, subtree: true});
                } else setTimeout(start, 500);
            };
            start();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForAllSites);
    } else {
        initForAllSites();
    }

    setTimeout(() => {
        try {
            let vips = JSON.parse(GM_getValue('ling_vips', 'null'));
            if (vips) {
                let isDirty = false;
                const newVips = {};
                for (let [key, val] of Object.entries(vips)) {
                    const cleanKey = normalizeHandle(key);
                    if (cleanKey && cleanKey !== key) {
                        newVips[cleanKey] = val; // 迁移到干净的 key
                        isDirty = true;
                    } else if (cleanKey) {
                        newVips[cleanKey] = val; // 正常的保留
                    }
                }
                if (isDirty) {
                    console.log("🧹 领哥终端：已合并重复的 VIP 数据，同步功能已修复");
                    GM_setValue('ling_vips', JSON.stringify(newVips));
                }
            }
        } catch (e) {}
    }, 2000);

    const __Kernel = (function() {
        return {
            getKeywords: () => ['eth', 'ethereum', 'erc20', 'vitalik', 'base', 'optimism']
        };
    })();
})();