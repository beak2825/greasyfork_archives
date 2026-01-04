// ==UserScript==
// @name        Make Bilibili Great Than Ever Before
// @description A fork of @kookxiang's userscript "Make Bilibili Great Again", but with many experimental features
// @namespace   https://skk.moe
// @run-at      document-start
// @match       https://www.bilibili.com/*
// @match       https://t.bilibili.com/*
// @match       https://live.bilibili.com/*
// @match       https://space.bilibili.com/*
// @version     1.6.0+av1
// @author      SukkaW <https://skk.moe>
// @grant       unsafeWindow
// @grant       GM.notification
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547935/Make%20Bilibili%20Great%20Than%20Ever%20Before.user.js
// @updateURL https://update.greasyfork.org/scripts/547935/Make%20Bilibili%20Great%20Than%20Ever%20Before.meta.js
// ==/UserScript==

(function () {
    'use strict'; const o$1 = () => { }, r = () => true, e$2 = () => false; Promise.resolve(); new Promise(o$1);/* eslint-disable no-restricted-globals -- logger */ const consoleLog = unsafeWindow.console.log;
    const consoleError = unsafeWindow.console.error;
    const consoleWarn = unsafeWindow.console.warn;
    const consoleInfo = unsafeWindow.console.info;
    const consoleDebug = unsafeWindow.console.debug;
    const consoleTrace = unsafeWindow.console.trace;
    const consoleGroup = unsafeWindow.console.group;
    const consoleGroupCollapsed = unsafeWindow.console.groupCollapsed;
    const consoleGroupEnd = unsafeWindow.console.groupEnd;
    const logger = {
        log: consoleLog.bind(console, '[make-bilibili-great-than-ever-before]'),
        error: consoleError.bind(console, '[make-bilibili-great-than-ever-before]'),
        warn: consoleWarn.bind(console, '[make-bilibili-great-than-ever-before]'),
        info: consoleInfo.bind(console, '[make-bilibili-great-than-ever-before]'),
        debug: consoleDebug.bind(console, '[make-bilibili-great-than-ever-before]'),
        trace(...args) {
            consoleGroupCollapsed.bind(console, '[make-bilibili-great-than-ever-before]')(...args);
            consoleTrace(...args);
            consoleGroupEnd();
        },
        group: consoleGroup.bind(console, '[make-bilibili-great-than-ever-before]'),
        groupCollapsed: consoleGroupCollapsed.bind(console, '[make-bilibili-great-than-ever-before]'),
        groupEnd: consoleGroupEnd.bind(console)
    }; function getUrlFromRequest(request) {
        if (typeof request === 'string') {
            return request;
        }
        if ('href' in request) {
            return request.href;
        }
        if ('url' in request) {
            return request.url;
        }
        logger.error('Invalid requestInfo', request);
        return null;
    } function createMockClass(className, instanceMethods = {}, staticMethods = {}) {
        const fakeClassInstance = new Proxy(o$1, {
            get(target, prop) {
                if (prop in instanceMethods) {
                    return instanceMethods[prop];
                }
                return (...args) => {
                    logger.log(`(new ${className})[${String(prop)}] called with arguments:`, args);
                };
            }
        });
        return new Proxy(class {
        }, {
            construct() {
                return fakeClassInstance;
            },
            get(target, prop) {
                if (prop in staticMethods) {
                    return staticMethods[prop];
                }
                return (...args) => {
                    logger.log(`window.${className}[${String(prop)}] called with arguments:`, args);
                };
            }
        });
    } function defineReadonlyProperty(target, key, value, enumerable = true) {
        Object.defineProperty(target, key, {
            get() {
                return value;
            },
            set: o$1,
            configurable: false,
            enumerable
        });
    } const n = new Set([".", "?", "*", "+", "^", "$", "|", "(", ")", "{", "}", "[", "]", "\\"]); function e$1(t, o = false) { const r = {}, i = (t, n) => { let e; let o = r; for (let r = 0, i = t.length; r < i; ++r)(e = t.charAt(r)) in o || (o[e] = n ? { "": "" } : {}), o = o[e]; o[""] = ""; }; for (let n = 0, e = t.length; n < e; ++n)i(t[n], o); const l = () => (function t(e) { let o, r, i = false, l = false; const c = [], s = []; for (const o in e) { if (!o) { i = true; continue } ((r = t(e[o])) ? c : s).push(("-" === o ? "\\x2d" : n.has(o) ? "\\" + o : o) + r); } return i && null == r ? "" : (l = !c.length, s.length && c.push(s[1] ? "[" + s.join("") + "]" : s[0]), o = c[1] ? "(?:" + c.join("|") + ")" : c[0], i && (o = l ? o + "?" : "(?:" + o + ")?"), o || "") })(r); return { tree: r, add: i, toString: l, toRe: () => new RegExp((o ? "^" : "") + l()) } } function o(n, r = false) { if (0 === n.length) return e$2; const i = e$1(n, r).toRe(); return i.test.bind(i) } const shouldDefuseUrl = o([
        'data.bilibili.com',
        'cm.bilibili.com',
        'api.bilibili.com/x/internal/gaia-gateway/ExClimbWuzhi'
    ]);
    const defuseSpyware = {
        name: 'defuse-spyware',
        description: '禁用叔叔日志上报和用户跟踪的无限请求风暴',
        any({ onBeforeFetch, onXhrOpen }) {
            defineReadonlyProperty(unsafeWindow.navigator, 'sendBeacon', r);
            const SentryHub = createMockClass('SentryHub');
            const fakeSentry = {
                SDK_NAME: 'sentry.javascript.browser',
                SDK_VERSION: '0.0.1145141919810',
                BrowserClient: createMockClass('Sentry.BrowserClient'),
                Hub: SentryHub,
                Integrations: {
                    Vue: createMockClass('Sentry.Integrations.Vue'),
                    GlobalHandlers: createMockClass('Sentry.Integrations.GlobalHandlers'),
                    InboundFilters: createMockClass('Sentry.Integrations.InboundFilters')
                },
                init: o$1,
                configureScope: o$1,
                getCurrentHub: () => new SentryHub(),
                setContext: o$1,
                setExtra: o$1,
                setExtras: o$1,
                setTag: o$1,
                setTags: o$1,
                setUser: o$1,
                wrap: o$1
            };
            defineReadonlyProperty(unsafeWindow, 'Sentry', fakeSentry);
            defineReadonlyProperty(unsafeWindow, 'MReporter', createMockClass('MReporter'));
            defineReadonlyProperty(unsafeWindow, 'ReporterPb', createMockClass('ReporterPb'));
            defineReadonlyProperty(unsafeWindow, '__biliUserFp__', {
                init: o$1,
                queryUserLog() {
                    return [];
                }
            });
            defineReadonlyProperty(unsafeWindow, '__USER_FP_CONFIG__', undefined);
            defineReadonlyProperty(unsafeWindow, '__MIRROR_CONFIG__', undefined);
            onBeforeFetch((fetchArgs) => {
                const url = getUrlFromRequest(fetchArgs[0]);
                if (typeof url === 'string' && shouldDefuseUrl(url)) {
                    return new Response();
                }
                return fetchArgs;
            });
            onXhrOpen((args) => {
                let url = args[1];
                if (typeof url !== 'string') {
                    url = url.href;
                }
                if (shouldDefuseUrl(url)) {
                    return null;
                }
                return args;
            });
        }
    }; class ListNode {
        timestamp;
        next;
        prev;
        constructor(timestamp) {
            this.timestamp = timestamp;
            this.next = null;
            this.prev = null;
        }
    }
    class ErrorCounter {
        timeWindow;
        head;
        tail;
        intervalId;
        $size;
        constructor(timeWindow = 10000) {
            this.timeWindow = timeWindow;
            this.head = null;
            this.tail = null;
            this.$size = 0;
            this.intervalId = self.setInterval(() => this.cleanup(), 1000);
        }
        recordError() {
            const now = Date.now();
            const newNode = new ListNode(now);
            if (this.tail) {
                this.tail.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            } else {
                this.head = newNode;
                this.tail = newNode;
            }
            this.$size++;
        }
        getErrorCount() {
            this.cleanup();
            return this.$size;
            // let count = 0;
            // let current = this.head;
            // while (current) {
            //   count++;
            //   current = current.next;
            // }
            // return count;
        }
        cleanup() {
            const now = Date.now();
            while (this.head && now - this.head.timestamp > this.timeWindow) {
                this.head = this.head.next;
                if (this.head) {
                    this.head.prev = null;
                } else {
                    this.tail = null;
                }
                this.$size--;
            }
        }
        stop() {
            clearInterval(this.intervalId);
        }
    } function e(r, ...t) { return r.reduce((e, r, n) => e + r + (t[n] ?? ""), "") } function flru(max) {
        var num, curr, prev;
        var limit = max;

        function keep(key, value) {
            if (++num > limit) {
                prev = curr;
                reset(1);
                ++num;
            }
            curr[key] = value;
        }

        function reset(isPartial) {
            num = 0;
            curr = Object.create(null);
            isPartial || (prev = Object.create(null));
        }

        reset();

        return {
            clear: reset,
            has: function (key) {
                return curr[key] !== void 0 || prev[key] !== void 0;
            },
            get: function (key) {
                var val = curr[key];
                if (val !== void 0) return val;
                if ((val = prev[key]) !== void 0) {
                    keep(key, val);
                    return val;
                }
            },
            set: function (key, value) {
                if (curr[key] !== void 0) {
                    curr[key] = value;
                } else {
                    keep(key, value);
                }
            }
        };
    }// const mcdnRegexp = /[\dxy]+\.mcdn\.bilivideo\.cn:\d+/;
    const qualityRegexp = /(live-bvc\/\d+\/live_\d+_\d+)_\w+/;
    const hevcRegexp = /(\d+)_(?:mini|pro)hevc/g;
    const smtcdnsRegexp = /[\w.]+\.smtcdns.net\/([\w-]+\.bilivideo.com\/)/;
    const liveCdnUrlKwFilter = o([
        '.bilivideo.',
        '.m3u8',
        '.m4s',
        '.flv'
    ]);
    const enhanceLive = {
        name: 'enhance-live',
        description: '增强直播（原画画质、其他修复）',
        onLive({ addStyle, onBeforeFetch, onResponse }) {
            let forceHighestQuality = true;
            const urlMap = flru(300);
            // 还得帮叔叔修 bug，唉
            addStyle(e`div[data-cy=EvaRenderer_LayerWrapper]:has(.player) { z-index: 999999; }`);
            // 干掉些直播间没用的东西
            addStyle(e`#welcome-area-bottom-vm, .web-player-icon-roomStatus { display: none !important; }`);
            // 修复直播画质
            onBeforeFetch((fetchArgs) => {
                if (!forceHighestQuality) {
                    return fetchArgs;
                }
                try {
                    const url = getUrlFromRequest(fetchArgs[0]);
                    if (url == null) {
                        return fetchArgs;
                    }
                    let finalUrl = url;
                    // if (mcdnRegexp.test(url) && disableMcdn) {
                    //   return Promise.reject();
                    // }
                    if (qualityRegexp.test(url)) {
                        finalUrl = url.replace(qualityRegexp, '$1').replaceAll(hevcRegexp, '$1');
                        logger.info('force quality', url, '->', finalUrl);
                        urlMap.set(finalUrl, url);
                    }
                    if (smtcdnsRegexp.test(finalUrl)) {
                        finalUrl = finalUrl.replace(smtcdnsRegexp, '$1');
                        logger.info('drop smtcdns', url, '->', finalUrl);
                    }
                    fetchArgs[0] = finalUrl;
                    return fetchArgs;
                } catch {
                    return fetchArgs;
                }
            });
            const errorCounter = new ErrorCounter(1000 * 30);
            onResponse((resp, fetchArgs, $fetch) => {
                if (liveCdnUrlKwFilter(resp.url) && !resp.ok) {
                    logger.error('force quality fail', resp.url, resp.status);
                    errorCounter.recordError();
                    if (forceHighestQuality && errorCounter.getErrorCount() >= 5) {
                        forceHighestQuality = false;
                        logger.error('Force quality failed! Falling back');
                        GM.notification('[Make Bilibili Great Then Ever Before] 已为您自动切换至播放器上选择的清晰度.', '最高清晰度可能不可用');
                    }
                    // If we have old url, we fetch old quality again
                    if (urlMap.has(resp.url)) {
                        const oldUrl = urlMap.get(resp.url);
                        logger.warn('');
                        return $fetch(oldUrl, fetchArgs[1]);
                    }
                }
                return resp;
            });
        }
    }; const fixCopyInCV = {
        name: 'fix-copy-in-cv',
        description: '修复文章复制功能',
        onCV() {
            if ('original' in unsafeWindow) {
                defineReadonlyProperty(unsafeWindow.original, 'reprint', '1');
            }
            const holder = document.querySelector('.article-holder');
            if (holder) {
                holder.classList.remove('unable-reprint');
                holder.addEventListener('copy', (e) => e.stopImmediatePropagation(), true);
            }
        }
    }; const noAd = {
        name: 'no-ad',
        description: '防止叔叔通过广告给自己赚棺材钱',
        any({ addStyle }) {
        // 去广告
        /**
     * 下面是叔叔家的垃圾前端在 computed 里写副作用检测 AdBlock 是否启用：

    u = () => {
      var A;
      if (!h.value)
        return !1;
      const _ = "cm."
        , v = "bilibili.com"
        , f = ((A = h.value) == null ? void 0 : A.querySelectorAll(`a[href*="${_}${v}"]`)) || [];
      for (let y = 0; y < f.length; y++)
        if (window.getComputedStyle(f[y]).display == "none")
          return !0;
      return !1

      我们只要 display 不是 none 就行了
    }
     */ addStyle(e`
      .adblock-tips,
      .feed-card:has(.bili-video-card>div:empty),
      a[href*="cm.bilibili.com"],
      .desktop-download-tip,
      .ad-report {
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border-width: 0 !important;
      }
    `);
            if (unsafeWindow.__INITIAL_STATE__?.adData) {
                for (const key in unsafeWindow.__INITIAL_STATE__.adData) {
                    if (!Array.isArray(unsafeWindow.__INITIAL_STATE__.adData[key])) continue;
                    for (const item of unsafeWindow.__INITIAL_STATE__.adData[key]) {
                        item.name = 'B 站未来有可能会倒闭，但绝不会变质';
                        item.pic = 'https://static.hdslb.com/images/transparent.gif';
                        item.url = 'https://space.bilibili.com/208259';
                    }
                }
            }
            if (unsafeWindow.__INITIAL_STATE__?.elecFullInfo) {
                unsafeWindow.__INITIAL_STATE__.elecFullInfo.list = [];
            }
        }
    }; const rBackupCdn = /(?:up|cn-)[\w-]+\.bilivideo\.com/g;
    let prevLocationHref = '';
    let prevCdnDomains = [];
    function getCDNDomain() {
        if (prevLocationHref !== unsafeWindow.location.href || prevCdnDomains.length === 0) {
            try {
                const matched = Array.from(new Set(Array.from(document.head.innerHTML.matchAll(rBackupCdn), (match) => match[0])));
                if (matched.length > 0) {
                    prevLocationHref = unsafeWindow.location.href;
                    prevCdnDomains = matched;
                    logger.info('Get CDN domains from <head />', {
                        matched
                    });
                } else {
                    logger.warn('Failed to get CDN domains from document.head.innerHTML, fallback to default CDN domain');
                    prevLocationHref = unsafeWindow.location.href;
                    prevCdnDomains = [
                        'upos-sz-mirrorcoso1.bilivideo.com'
                    ];
                    return 'upos-sz-mirrorcoso1.bilivideo.com';
                }
            } catch (e) {
                logger.error('Failed to get CDN domains from document.head.innerHTML, fallback to default CDN domain', e);
                prevLocationHref = unsafeWindow.location.href;
                prevCdnDomains = [
                    'upos-sz-mirrorcoso1.bilivideo.com'
                ];
                return 'upos-sz-mirrorcoso1.bilivideo.com';
            }
        }
        return prevCdnDomains.length === 1 ? prevCdnDomains[0] : prevCdnDomains[Math.floor(Math.random() * prevCdnDomains.length)];
    }
    const isP2PCDN = o([
        '.mcdn.bilivideo.cn',
        '.szbdyd.com'
    ]);
    const noP2P = {
        name: 'no-p2p',
        description: '防止叔叔用 P2P CDN 省下纸钱',
        any({ onXhrOpen, onBeforeFetch, onXhrResponse }) {
            class MockPCDNLoader {
            }
            class MockBPP2PSDK {
                on = o$1;
            }
            class MockSeederSDK {
            }
            defineReadonlyProperty(unsafeWindow, 'PCDNLoader', MockPCDNLoader);
            defineReadonlyProperty(unsafeWindow, 'BPP2PSDK', MockBPP2PSDK);
            defineReadonlyProperty(unsafeWindow, 'SeederSDK', MockSeederSDK);
            // Patch new Native Player
            (function (HTMLMediaElementPrototypeSrcDescriptor) {
                Object.defineProperty(unsafeWindow.HTMLMediaElement.prototype, 'src', {
                    ...HTMLMediaElementPrototypeSrcDescriptor,
                    set(value) {
                        if (typeof value !== 'string') {
                            value = String(value);
                        }
                        try {
                            const result = replaceP2P(value, getCDNDomain, 'HTMLMediaElement.prototype.src');
                            value = typeof result === 'string' ? result : result.href;
                        } catch (e) {
                            logger.error('Failed to handle HTMLMediaElement.prototype.src setter', e, {
                                value
                            });
                        }
                        HTMLMediaElementPrototypeSrcDescriptor?.set?.call(this, value);
                    }
                });
            })(Object.getOwnPropertyDescriptor(unsafeWindow.HTMLMediaElement.prototype, 'src'));
            onXhrOpen((xhrOpenArgs) => {
                try {
                    xhrOpenArgs[1] = replaceP2P(xhrOpenArgs[1], getCDNDomain, 'XMLHttpRequest.prototype.open');
                } catch (e) {
                    logger.error('Failed to replace P2P for XMLHttpRequest.prototype.open', e, {
                        xhrUrl: xhrOpenArgs[1]
                    });
                }
                return xhrOpenArgs;
            });
            onXhrResponse((_method, url, response, _xhr) => {
                if (typeof response === 'string' && url.toString().includes('api.bilibili.com/x/player/wbi/playurl')) {
                    try {
                        const json = JSON.parse(response);
                        const cdnDomains = new Set();
                        function addCDNFromUrl(url) {
                            if (typeof url === 'string' && !isP2PCDN(url)) {
                                try {
                                    cdnDomains.add(new URL(url).hostname);
                                } catch { }
                            }
                        }
                        function extractCDNFromVideoOrAudio(data) {
                            if (Array.isArray(data)) {
                                for (const videoOrAudio of data) {
                                    if ('baseUrl' in videoOrAudio && typeof videoOrAudio.baseUrl === 'string') {
                                        addCDNFromUrl(videoOrAudio.baseUrl);
                                    } else if ('base_url' in videoOrAudio && typeof videoOrAudio.base_url === 'string') {
                                        addCDNFromUrl(videoOrAudio.base_url);
                                    }
                                    if ('backupUrl' in videoOrAudio && Array.isArray(videoOrAudio.backupUrl)) {
                                        videoOrAudio.backupUrl.forEach(addCDNFromUrl);
                                    } else if ('backup_url' in videoOrAudio && Array.isArray(videoOrAudio.backup_url)) {
                                        videoOrAudio.backup_url.forEach(addCDNFromUrl);
                                    }
                                }
                            }
                        }
                        if ('data' in json && typeof json.data === 'object' && json.data && 'dash' in json.data && typeof json.data.dash === 'object' && json.data.dash) {
                            if ('video' in json.data.dash) {
                                extractCDNFromVideoOrAudio(json.data.dash.video);
                            }
                            if ('audio' in json.data.dash) {
                                extractCDNFromVideoOrAudio(json.data.dash.audio);
                            }
                        }
                        logger.info('Get CDN domains from Bilibili API', {
                            json,
                            cdnDomains
                        });
                        if (cdnDomains.size > 0) {
                            prevLocationHref = unsafeWindow.location.href;
                            prevCdnDomains = Array.from(cdnDomains);
                        }
                    } catch { }
                }
                return response;
            });
            onBeforeFetch((fetchArgs) => {
                let input = fetchArgs[0];
                if (typeof input === 'string' || 'href' in input) {
                    input = replaceP2P(input, getCDNDomain, 'fetch');
                } else if ('url' in input) {
                    input = new Request(replaceP2P(input.url, getCDNDomain, 'fetch'), input);
                } else;
                fetchArgs[0] = input;
                return fetchArgs;
            });
        }
    };
    function replaceP2P(url, cdnDomainGetter, meta = '') {
        try {
            if (typeof url === 'string') {
                // early bailout for better performance
                if (!isP2PCDN(url)) {
                    return url;
                }
                if (url.startsWith('//')) {
                    url = unsafeWindow.location.protocol + url;
                }
                url = new URL(url, unsafeWindow.location.href);
            }
            const hostname = url.hostname;
            if (hostname.endsWith('.mcdn.bilivideo.cn')) {
                const cdn = cdnDomainGetter();
                url.hostname = cdn;
                url.port = '443';
                logger.info(`P2P replaced: ${hostname} -> ${cdn}`, {
                    meta
                });
            } else if (hostname.endsWith('.szbdyd.com')) {
                const xy_usource = url.searchParams.get('xy_usource');
                if (xy_usource) {
                    url.hostname = xy_usource;
                    url.port = '443';
                    logger.info(`P2P replaced: ${hostname} -> ${xy_usource}`, {
                        meta
                    });
                }
            }
            return url;
        } catch (e) {
            logger.error(`Failed to replace P2P for URL (${url}):`, e);
            return url;
        }
    } const neverResolvedPromise = new Promise(o$1);
    const noopNeverResolvedPromise = () => neverResolvedPromise;
    // based on uBlock Origin's no-webrtc
    // https://github.com/gorhill/uBlock/blob/6c228a8bfdcfc14140cdd3967270df28598c1aaf/src/js/resources/scriptlets.js#L2216
    const noWebRTC = {
        name: 'no-webrtc',
        description: '通过禁用 WebRTC 防止叔叔省下棺材钱',
        any() {
            const rtcPcNames = [];
            if ('RTCPeerConnection' in unsafeWindow) {
                rtcPcNames.push('RTCPeerConnection');
            }
            if ('webkitRTCPeerConnection' in unsafeWindow) {
                rtcPcNames.push('webkitRTCPeerConnection');
            }
            if ('mozRTCPeerConnection' in unsafeWindow) {
                rtcPcNames.push('mozRTCPeerConnection');
            }
            const rtcDcNames = [];
            if ('RTCDataChannel' in unsafeWindow) {
                rtcDcNames.push('RTCDataChannel');
            }
            if ('webkitRTCDataChannel' in unsafeWindow) {
                rtcDcNames.push('webkitRTCDataChannel');
            }
            if ('mozRTCDataChannel' in unsafeWindow) {
                rtcDcNames.push('mozRTCDataChannel');
            }
            class MockDataChannel {
                static {
                    this.prototype.close = o$1;
                    this.prototype.send = o$1;
                    this.prototype.addEventListener = o$1;
                    this.prototype.removeEventListener = o$1;
                    this.prototype.onbufferedamountlow = o$1;
                    // eslint-disable-next-line sukka/unicorn/prefer-add-event-listener -- mock
                    this.prototype.onclose = o$1;
                    // eslint-disable-next-line sukka/unicorn/prefer-add-event-listener -- mock
                    this.prototype.onerror = o$1;
                    // eslint-disable-next-line sukka/unicorn/prefer-add-event-listener -- mock
                    this.prototype.onmessage = o$1;
                }
                toString() {
                    return '[object RTCDataChannel]';
                }
            }
            class MockRTCSessionDescription {
                type;
                sdp;
                constructor(init) {
                    this.type = init.type;
                    this.sdp = init.sdp || '';
                }
                toJSON() {
                    return {
                        type: this.type,
                        sdp: this.sdp
                    };
                }
                toString() {
                    return '[object RTCSessionDescription]';
                }
            }
            const mockedRtcSessionDescription = new MockRTCSessionDescription({
                type: 'offer',
                sdp: ''
            });
            class MockRTCPeerConnection {
                createDataChannel() {
                    return new MockDataChannel();
                }
                static {
                    this.prototype.close = o$1;
                    this.prototype.createOffer = noopNeverResolvedPromise;
                    this.prototype.setLocalDescription = o$1;
                    this.prototype.setRemoteDescription = o$1;
                    this.prototype.addEventListener = o$1;
                    this.prototype.removeEventListener = o$1;
                    this.prototype.addIceCandidate = o$1;
                    this.prototype.setConfiguration = o$1;
                    this.prototype.localDescription = mockedRtcSessionDescription;
                    this.prototype.createAnswer = noopNeverResolvedPromise;
                    this.prototype.onicecandidate = o$1;
                }
                toString() {
                    return '[object RTCPeerConnection]';
                }
            }
            for (const rtc of rtcPcNames) {
                defineReadonlyProperty(unsafeWindow, rtc, MockRTCPeerConnection);
            }
            for (const dc of rtcDcNames) {
                defineReadonlyProperty(unsafeWindow, dc, MockDataChannel);
            }
            defineReadonlyProperty(unsafeWindow, 'RTCSessionDescription', MockRTCSessionDescription);
        }
    }; const optimizeHomepage = {
        name: 'optimize-homepage',
        description: '首页广告去除和样式优化',
        any({ addStyle }) {
            addStyle(e`
      .feed2 .feed-card:has(a[href*="cm.bilibili.com"]),
      .feed2 .feed-card:has(.bili-video-card:empty) {
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border-width: 0 !important;
      }

      .feed2 .container > * {
        margin-top: 0 !important
      }
    `);
        }
    }; function onDOMContentLoaded(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, {
                once: true
            });
        } else {
            callback();
        }
    }
    function onLoaded(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            // eslint-disable-next-line no-restricted-globals -- use sandboxed event handler
            window.addEventListener('load', callback, {
                once: true
            });
        }
    } const optimizeStory = {
        name: 'optimize-story',
        description: '动态页面优化',
        onStory({ addStyle }) {
            addStyle(e`
      html[wide] #app { display: flex; }
      html[wide] .bili-dyn-home--member { box-sizing: border-box;padding: 0 10px;width: 100%;flex: 1; }
      html[wide] .bili-dyn-content { width: initial; }
      html[wide] main { margin: 0 8px;flex: 1;overflow: hidden;width: initial; }
      #wide-mode-switch { margin-left: 0;margin-right: 20px; }
      .bili-dyn-list__item:has(.bili-dyn-card-goods), .bili-dyn-list__item:has(.bili-rich-text-module.goods) { display: none !important }
    `);
            if (!localStorage.WIDE_OPT_OUT) {
                document.documentElement.setAttribute('wide', 'wide');
            }
            onLoaded(() => {
                const tabContainer = document.querySelector('.bili-dyn-list-tabs__list');
                const placeHolder = document.createElement('div');
                placeHolder.style.flex = '1';
                const switchButton = document.createElement('a');
                switchButton.id = 'wide-mode-switch';
                switchButton.className = 'bili-dyn-list-tabs__item';
                switchButton.textContent = '宽屏模式';
                switchButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (localStorage.WIDE_OPT_OUT) {
                        localStorage.removeItem('WIDE_OPT_OUT');
                        document.documentElement.setAttribute('wide', 'wide');
                    } else {
                        localStorage.setItem('WIDE_OPT_OUT', '1');
                        document.documentElement.removeAttribute('wide');
                    }
                });
                tabContainer?.appendChild(placeHolder);
                tabContainer?.appendChild(switchButton);
            });
        }
    }; function toggleMode(enabled) {
        if (enabled) {
            document.body.setAttribute('video-fit', '');
        } else {
            document.body.removeAttribute('video-fit');
        }
    }
    const playerVideoFit = {
        name: 'player-video-fit',
        description: '播放器视频裁切模式',
        onVideo({ addStyle }) {
            addStyle(e`body[video-fit] #bilibili-player video { object-fit: cover; } .bpx-player-ctrl-setting-fit-mode { display: flex;width: 100%;height: 32px;line-height: 32px; } .bpx-player-ctrl-setting-box .bui-panel-wrap, .bpx-player-ctrl-setting-box .bui-panel-item { min-height: 172px !important; }`);
            let timer;
            function injectButton() {
                if (!document.querySelector('.bpx-player-ctrl-setting-menu-left')) {
                    return;
                }
                self.clearInterval(timer);
                const parent = document.querySelector('.bpx-player-ctrl-setting-menu-left');
                const item = document.createElement('div');
                item.className = 'bpx-player-ctrl-setting-fit-mode bui bui-switch';
                item.innerHTML = '<input class="bui-switch-input" type="checkbox"><label class="bui-switch-label"><span class="bui-switch-name">裁切模式</span><span class="bui-switch-body"><span class="bui-switch-dot"><span></span></span></span></label>';
                parent?.insertBefore(item, document.querySelector('.bpx-player-ctrl-setting-more'));
                document.querySelector('.bpx-player-ctrl-setting-fit-mode input')?.addEventListener('change', (e) => toggleMode(e.target.checked));
                const panelItem = document.querySelector('.bpx-player-ctrl-setting-box .bui-panel-item');
                if (panelItem) {
                    panelItem.style.height = '';
                }
            }
            timer = self.setInterval(injectButton, 200);
        }
    }; const removeBlackBackdropFilter = {
        name: 'remove-black-backdrop-filter',
        description: '去除叔叔去世时的全站黑白效果',
        any({ addStyle }) {
            addStyle(e`html, body { -webkit-filter: none !important; filter: none !important; }`);
        }
    }; const uselessUrlParams = [
        'buvid',
        'is_story_h5',
        'launch_id',
        'live_from',
        'mid',
        'session_id',
        'timestamp',
        'up_id',
        'vd_source',
        /^share/,
        /^spm/
    ];
    const removeUselessUrlParams = {
        name: 'remove-useless-url-params',
        description: '清理 URL 中的无用参数',
        any() {
            unsafeWindow.history.replaceState(undefined, '', removeTracking(location.href));
            // eslint-disable-next-line @typescript-eslint/unbound-method -- called with Reflect.apply
            const pushState = unsafeWindow.history.pushState;
            unsafeWindow.history.pushState = function (state, unused, url) {
                return Reflect.apply(pushState, this, [
                    state,
                    unused,
                    removeTracking(url)
                ]);
            };
            // eslint-disable-next-line @typescript-eslint/unbound-method -- called with Reflect.apply
            const replaceState = unsafeWindow.history.replaceState;
            unsafeWindow.history.replaceState = function (state, unused, url) {
                return Reflect.apply(replaceState, this, [
                    state,
                    unused,
                    removeTracking(url)
                ]);
            };
        }
    };
    function removeTracking(url) {
        if (!url) return url;
        try {
            if (typeof url === 'string') url = new URL(url, unsafeWindow.location.href);
            if (!url.search) return url;
            const keys = Array.from(url.searchParams.keys());
            for (const key of keys) {
                for (const item of uselessUrlParams) {
                    if (typeof item === 'string') {
                        if (item === key) url.searchParams.delete(key);
                    } else if ('test' in item && item.test(key)) {
                        url.searchParams.delete(key);
                    }
                    ;
                }
                ;
            }
            return url.href;
        } catch (e) {
            logger.error('Failed to remove useless urlParams', e);
            return url;
        }
    }// 去除鸿蒙字体，强制使用系统默认字体
    const useSystemFonts = {
        name: 'use-system-fonts',
        description: '去除鸿蒙字体，强制使用系统默认字体',
        any({ addStyle }) {
            document.querySelectorAll('link[href*="/jinkela/long/font/"]').forEach((x) => x.remove());
            addStyle(e`html, body { font-family: system-ui !important; }`);
        }
    }; const messages = {
        AbortError: "A request was aborted, for example through a call to IDBTransaction.abort.",
        ConstraintError: "A mutation operation in the transaction failed because a constraint was not satisfied. For example, an object such as an object store or index already exists and a request attempted to create a new one.",
        DataError: "Data provided to an operation does not meet requirements.",
        InvalidAccessError: "An invalid operation was performed on an object. For example transaction creation attempt was made, but an empty scope was provided.",
        InvalidStateError: "An operation was called on an object on which it is not allowed or at a time when it is not allowed. Also occurs if a request is made on a source object that has been deleted or removed. Use TransactionInactiveError or ReadOnlyError when possible, as they are more specific variations of InvalidStateError.",
        NotFoundError: "The operation failed because the requested database object could not be found. For example, an object store did not exist but was being opened.",
        ReadOnlyError: 'The mutating operation was attempted in a "readonly" transaction.',
        TransactionInactiveError: "A request was placed against a transaction which is currently not active, or which is finished.",
        VersionError: "An attempt was made to open a database using a lower version than the existing version."
    };
    class AbortError extends DOMException {
        constructor(message = messages.AbortError) {
            super(message, "AbortError");
        }
    }
    class ConstraintError extends DOMException {
        constructor(message = messages.ConstraintError) {
            super(message, "ConstraintError");
        }
    }
    class DataError extends DOMException {
        constructor(message = messages.DataError) {
            super(message, "DataError");
        }
    }
    class InvalidAccessError extends DOMException {
        constructor(message = messages.InvalidAccessError) {
            super(message, "InvalidAccessError");
        }
    }
    class InvalidStateError extends DOMException {
        constructor(message = messages.InvalidStateError) {
            super(message, "InvalidStateError");
        }
    }
    class NotFoundError extends DOMException {
        constructor(message = messages.NotFoundError) {
            super(message, "NotFoundError");
        }
    }
    class ReadOnlyError extends DOMException {
        constructor(message = messages.ReadOnlyError) {
            super(message, "ReadOnlyError");
        }
    }
    class TransactionInactiveError extends DOMException {
        constructor(message = messages.TransactionInactiveError) {
            super(message, "TransactionInactiveError");
        }
    }
    class VersionError extends DOMException {
        constructor(message = messages.VersionError) {
            super(message, "VersionError");
        }
    }// https://w3c.github.io/IndexedDB/#convert-value-to-key
    const valueToKey = (input, seen) => {
        if (typeof input === "number") {
            if (isNaN(input)) {
                throw new DataError();
            }
            return input;
        } else if (Object.prototype.toString.call(input) === "[object Date]") {
            const ms = input.valueOf();
            if (isNaN(ms)) {
                throw new DataError();
            }
            return new Date(ms);
        } else if (typeof input === "string") {
            return input;
        } else if (input instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && input instanceof SharedArrayBuffer || typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView && ArrayBuffer.isView(input)) {
            let arrayBuffer;
            let offset = 0;
            let length = 0;
            if (input instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && input instanceof SharedArrayBuffer) {
                arrayBuffer = input;
                length = input.byteLength;
            } else {
                arrayBuffer = input.buffer;
                offset = input.byteOffset;
                length = input.byteLength;
            }
            if (arrayBuffer.detached) {
                return new ArrayBuffer(0);
            }
            return arrayBuffer.slice(offset, offset + length);
        } else if (Array.isArray(input)) {
            if (seen === undefined) {
                seen = new Set();
            } else if (seen.has(input)) {
                throw new DataError();
            }
            seen.add(input);
            const keys = [];
            for (let i = 0; i < input.length; i++) {
                const hop = Object.hasOwn(input, i);
                if (!hop) {
                    throw new DataError();
                }
                const entry = input[i];
                const key = valueToKey(entry, seen);
                keys.push(key);
            }
            return keys;
        } else {
            throw new DataError();
        }
    }; const getType = x => {
        if (typeof x === "number") {
            return "Number";
        }
        if (x instanceof Date) {
            return "Date";
        }
        if (Array.isArray(x)) {
            return "Array";
        }
        if (typeof x === "string") {
            return "String";
        }
        if (x instanceof ArrayBuffer) {
            return "Binary";
        }
        throw new DataError();
    };

    // https://w3c.github.io/IndexedDB/#compare-two-keys
    const cmp = (first, second) => {
        if (second === undefined) {
            throw new TypeError();
        }
        first = valueToKey(first);
        second = valueToKey(second);
        const t1 = getType(first);
        const t2 = getType(second);
        if (t1 !== t2) {
            if (t1 === "Array") {
                return 1;
            }
            if (t1 === "Binary" && (t2 === "String" || t2 === "Date" || t2 === "Number")) {
                return 1;
            }
            if (t1 === "String" && (t2 === "Date" || t2 === "Number")) {
                return 1;
            }
            if (t1 === "Date" && t2 === "Number") {
                return 1;
            }
            return -1;
        }
        if (t1 === "Binary") {
            first = new Uint8Array(first);
            second = new Uint8Array(second);
        }
        if (t1 === "Array" || t1 === "Binary") {
            const length = Math.min(first.length, second.length);
            for (let i = 0; i < length; i++) {
                const result = cmp(first[i], second[i]);
                if (result !== 0) {
                    return result;
                }
            }
            if (first.length > second.length) {
                return 1;
            }
            if (first.length < second.length) {
                return -1;
            }
            return 0;
        }
        if (t1 === "Date") {
            if (first.getTime() === second.getTime()) {
                return 0;
            }
        } else {
            if (first === second) {
                return 0;
            }
        }
        return first > second ? 1 : -1;
    };// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#range-concept
    class FDBKeyRange {
        static only(value) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            value = valueToKey(value);
            return new FDBKeyRange(value, value, false, false);
        }
        static lowerBound(lower, open = false) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            lower = valueToKey(lower);
            return new FDBKeyRange(lower, undefined, open, true);
        }
        static upperBound(upper, open = false) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            upper = valueToKey(upper);
            return new FDBKeyRange(undefined, upper, true, open);
        }
        static bound(lower, upper, lowerOpen = false, upperOpen = false) {
            if (arguments.length < 2) {
                throw new TypeError();
            }
            const cmpResult = cmp(lower, upper);
            if (cmpResult === 1 || cmpResult === 0 && (lowerOpen || upperOpen)) {
                throw new DataError();
            }
            lower = valueToKey(lower);
            upper = valueToKey(upper);
            return new FDBKeyRange(lower, upper, lowerOpen, upperOpen);
        }
        constructor(lower, upper, lowerOpen, upperOpen) {
            this.lower = lower;
            this.upper = upper;
            this.lowerOpen = lowerOpen;
            this.upperOpen = upperOpen;
        }

        // https://w3c.github.io/IndexedDB/#dom-idbkeyrange-includes
        includes(key) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            key = valueToKey(key);
            if (this.lower !== undefined) {
                const cmpResult = cmp(this.lower, key);
                if (cmpResult === 1 || cmpResult === 0 && this.lowerOpen) {
                    return false;
                }
            }
            if (this.upper !== undefined) {
                const cmpResult = cmp(this.upper, key);
                if (cmpResult === -1 || cmpResult === 0 && this.upperOpen) {
                    return false;
                }
            }
            return true;
        }
        toString() {
            return "[object IDBKeyRange]";
        }
    }// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-extracting-a-key-from-a-value-using-a-key-path
    const extractKey = (keyPath, value) => {
        if (Array.isArray(keyPath)) {
            const result = [];
            for (let item of keyPath) {
                // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same
                // comment in validateKeyPath)
                if (item !== undefined && item !== null && typeof item !== "string" && item.toString) {
                    item = item.toString();
                }
                result.push(valueToKey(extractKey(item, value)));
            }
            return result;
        }
        if (keyPath === "") {
            return value;
        }
        let remainingKeyPath = keyPath;
        let object = value;
        while (remainingKeyPath !== null) {
            let identifier;
            const i = remainingKeyPath.indexOf(".");
            if (i >= 0) {
                identifier = remainingKeyPath.slice(0, i);
                remainingKeyPath = remainingKeyPath.slice(i + 1);
            } else {
                identifier = remainingKeyPath;
                remainingKeyPath = null;
            }
            if (object === undefined || object === null || !Object.hasOwn(object, identifier)) {
                return;
            }
            object = object[identifier];
        }
        return object;
    }; const getEffectiveObjectStore = cursor => {
        if (cursor.source instanceof FDBObjectStore) {
            return cursor.source;
        }
        return cursor.source.objectStore;
    };

    // This takes a key range, a list of lower bounds, and a list of upper bounds and combines them all into a single key
    // range. It does not handle gt/gte distinctions, because it doesn't really matter much anyway, since for next/prev
    // cursor iteration it'd also have to look at values to be precise, which would be complicated. This should get us 99%
    // of the way there.
    const makeKeyRange = (range, lowers, uppers) => {
        // Start with bounds from range
        let lower = range !== undefined ? range.lower : undefined;
        let upper = range !== undefined ? range.upper : undefined;

        // Augment with values from lowers and uppers
        for (const lowerTemp of lowers) {
            if (lowerTemp === undefined) {
                continue;
            }
            if (lower === undefined || cmp(lower, lowerTemp) === 1) {
                lower = lowerTemp;
            }
        }
        for (const upperTemp of uppers) {
            if (upperTemp === undefined) {
                continue;
            }
            if (upper === undefined || cmp(upper, upperTemp) === -1) {
                upper = upperTemp;
            }
        }
        if (lower !== undefined && upper !== undefined) {
            return FDBKeyRange.bound(lower, upper);
        }
        if (lower !== undefined) {
            return FDBKeyRange.lowerBound(lower);
        }
        if (upper !== undefined) {
            return FDBKeyRange.upperBound(upper);
        }
    };

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#cursor
    class FDBCursor {
        _gotValue = false;
        _position = undefined; // Key of previously returned record
        _objectStorePosition = undefined;
        _keyOnly = false;
        _key = undefined;
        _primaryKey = undefined;
        constructor(source, range, direction = "next", request, keyOnly = false) {
            this._range = range;
            this._source = source;
            this._direction = direction;
            this._request = request;
            this._keyOnly = keyOnly;
        }

        // Read only properties
        get source() {
            return this._source;
        }
        set source(val) {
            /* For babel */
        }
        get request() {
            return this._request;
        }
        set request(val) {
            /* For babel */
        }
        get direction() {
            return this._direction;
        }
        set direction(val) {
            /* For babel */
        }
        get key() {
            return this._key;
        }
        set key(val) {
            /* For babel */
        }
        get primaryKey() {
            return this._primaryKey;
        }
        set primaryKey(val) {
            /* For babel */
        }

        // https://w3c.github.io/IndexedDB/#iterate-a-cursor
        _iterate(key, primaryKey) {
            const sourceIsObjectStore = this.source instanceof FDBObjectStore;

            // Can't use sourceIsObjectStore because TypeScript
            const records = this.source instanceof FDBObjectStore ? this.source._rawObjectStore.records : this.source._rawIndex.records;
            let foundRecord;
            if (this.direction === "next") {
                const range = makeKeyRange(this._range, [key, this._position], []);
                for (const record of records.values(range)) {
                    const cmpResultKey = key !== undefined ? cmp(record.key, key) : undefined;
                    const cmpResultPosition = this._position !== undefined ? cmp(record.key, this._position) : undefined;
                    if (key !== undefined) {
                        if (cmpResultKey === -1) {
                            continue;
                        }
                    }
                    if (primaryKey !== undefined) {
                        if (cmpResultKey === -1) {
                            continue;
                        }
                        const cmpResultPrimaryKey = cmp(record.value, primaryKey);
                        if (cmpResultKey === 0 && cmpResultPrimaryKey === -1) {
                            continue;
                        }
                    }
                    if (this._position !== undefined && sourceIsObjectStore) {
                        if (cmpResultPosition !== 1) {
                            continue;
                        }
                    }
                    if (this._position !== undefined && !sourceIsObjectStore) {
                        if (cmpResultPosition === -1) {
                            continue;
                        }
                        if (cmpResultPosition === 0 && cmp(record.value, this._objectStorePosition) !== 1) {
                            continue;
                        }
                    }
                    if (this._range !== undefined) {
                        if (!this._range.includes(record.key)) {
                            continue;
                        }
                    }
                    foundRecord = record;
                    break;
                }
            } else if (this.direction === "nextunique") {
                // This could be done without iterating, if the range was defined slightly better (to handle gt/gte cases).
                // But the performance difference should be small, and that wouldn't work anyway for directions where the
                // value needs to be used (like next and prev).
                const range = makeKeyRange(this._range, [key, this._position], []);
                for (const record of records.values(range)) {
                    if (key !== undefined) {
                        if (cmp(record.key, key) === -1) {
                            continue;
                        }
                    }
                    if (this._position !== undefined) {
                        if (cmp(record.key, this._position) !== 1) {
                            continue;
                        }
                    }
                    if (this._range !== undefined) {
                        if (!this._range.includes(record.key)) {
                            continue;
                        }
                    }
                    foundRecord = record;
                    break;
                }
            } else if (this.direction === "prev") {
                const range = makeKeyRange(this._range, [], [key, this._position]);
                for (const record of records.values(range, "prev")) {
                    const cmpResultKey = key !== undefined ? cmp(record.key, key) : undefined;
                    const cmpResultPosition = this._position !== undefined ? cmp(record.key, this._position) : undefined;
                    if (key !== undefined) {
                        if (cmpResultKey === 1) {
                            continue;
                        }
                    }
                    if (primaryKey !== undefined) {
                        if (cmpResultKey === 1) {
                            continue;
                        }
                        const cmpResultPrimaryKey = cmp(record.value, primaryKey);
                        if (cmpResultKey === 0 && cmpResultPrimaryKey === 1) {
                            continue;
                        }
                    }
                    if (this._position !== undefined && sourceIsObjectStore) {
                        if (cmpResultPosition !== -1) {
                            continue;
                        }
                    }
                    if (this._position !== undefined && !sourceIsObjectStore) {
                        if (cmpResultPosition === 1) {
                            continue;
                        }
                        if (cmpResultPosition === 0 && cmp(record.value, this._objectStorePosition) !== -1) {
                            continue;
                        }
                    }
                    if (this._range !== undefined) {
                        if (!this._range.includes(record.key)) {
                            continue;
                        }
                    }
                    foundRecord = record;
                    break;
                }
            } else if (this.direction === "prevunique") {
                let tempRecord;
                const range = makeKeyRange(this._range, [], [key, this._position]);
                for (const record of records.values(range, "prev")) {
                    if (key !== undefined) {
                        if (cmp(record.key, key) === 1) {
                            continue;
                        }
                    }
                    if (this._position !== undefined) {
                        if (cmp(record.key, this._position) !== -1) {
                            continue;
                        }
                    }
                    if (this._range !== undefined) {
                        if (!this._range.includes(record.key)) {
                            continue;
                        }
                    }
                    tempRecord = record;
                    break;
                }
                if (tempRecord) {
                    foundRecord = records.get(tempRecord.key);
                }
            }
            let result;
            if (!foundRecord) {
                this._key = undefined;
                if (!sourceIsObjectStore) {
                    this._objectStorePosition = undefined;
                }

                // "this instanceof FDBCursorWithValue" would be better and not require (this as any), but causes runtime
                // error due to circular dependency.
                if (!this._keyOnly && this.toString() === "[object IDBCursorWithValue]") {
                    this.value = undefined;
                }
                result = null;
            } else {
                this._position = foundRecord.key;
                if (!sourceIsObjectStore) {
                    this._objectStorePosition = foundRecord.value;
                }
                this._key = foundRecord.key;
                if (sourceIsObjectStore) {
                    this._primaryKey = structuredClone(foundRecord.key);
                    if (!this._keyOnly && this.toString() === "[object IDBCursorWithValue]") {
                        this.value = structuredClone(foundRecord.value);
                    }
                } else {
                    this._primaryKey = structuredClone(foundRecord.value);
                    if (!this._keyOnly && this.toString() === "[object IDBCursorWithValue]") {
                        if (this.source instanceof FDBObjectStore) {
                            // Can't use sourceIsObjectStore because TypeScript
                            throw new Error("This should never happen");
                        }
                        const value = this.source.objectStore._rawObjectStore.getValue(foundRecord.value);
                        this.value = structuredClone(value);
                    }
                }
                this._gotValue = true;
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                result = this;
            }
            return result;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-update-IDBRequest-any-value
        update(value) {
            if (value === undefined) {
                throw new TypeError();
            }
            const effectiveObjectStore = getEffectiveObjectStore(this);
            const effectiveKey = Object.hasOwn(this.source, "_rawIndex") ? this.primaryKey : this._position;
            const transaction = effectiveObjectStore.transaction;
            if (transaction._state !== "active") {
                throw new TransactionInactiveError();
            }
            if (transaction.mode === "readonly") {
                throw new ReadOnlyError();
            }
            if (effectiveObjectStore._rawObjectStore.deleted) {
                throw new InvalidStateError();
            }
            if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
                throw new InvalidStateError();
            }
            if (!this._gotValue || !Object.hasOwn(this, "value")) {
                throw new InvalidStateError();
            }
            const clone = structuredClone(value);
            if (effectiveObjectStore.keyPath !== null) {
                let tempKey;
                try {
                    tempKey = extractKey(effectiveObjectStore.keyPath, clone);
                } catch (err) {
                    /* Handled immediately below */
                }
                if (cmp(tempKey, effectiveKey) !== 0) {
                    throw new DataError();
                }
            }
            const record = {
                key: effectiveKey,
                value: clone
            };
            return transaction._execRequestAsync({
                operation: effectiveObjectStore._rawObjectStore.storeRecord.bind(effectiveObjectStore._rawObjectStore, record, false, transaction._rollbackLog),
                source: this
            });
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-advance-void-unsigned-long-count
        advance(count) {
            if (!Number.isInteger(count) || count <= 0) {
                throw new TypeError();
            }
            const effectiveObjectStore = getEffectiveObjectStore(this);
            const transaction = effectiveObjectStore.transaction;
            if (transaction._state !== "active") {
                throw new TransactionInactiveError();
            }
            if (effectiveObjectStore._rawObjectStore.deleted) {
                throw new InvalidStateError();
            }
            if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
                throw new InvalidStateError();
            }
            if (!this._gotValue) {
                throw new InvalidStateError();
            }
            if (this._request) {
                this._request.readyState = "pending";
            }
            transaction._execRequestAsync({
                operation: () => {
                    let result;
                    for (let i = 0; i < count; i++) {
                        result = this._iterate();

                        // Not sure why this is needed
                        if (!result) {
                            break;
                        }
                    }
                    return result;
                },
                request: this._request,
                source: this.source
            });
            this._gotValue = false;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-continue-void-any-key
        continue(key) {
            const effectiveObjectStore = getEffectiveObjectStore(this);
            const transaction = effectiveObjectStore.transaction;
            if (transaction._state !== "active") {
                throw new TransactionInactiveError();
            }
            if (effectiveObjectStore._rawObjectStore.deleted) {
                throw new InvalidStateError();
            }
            if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
                throw new InvalidStateError();
            }
            if (!this._gotValue) {
                throw new InvalidStateError();
            }
            if (key !== undefined) {
                key = valueToKey(key);
                const cmpResult = cmp(key, this._position);
                if (cmpResult <= 0 && (this.direction === "next" || this.direction === "nextunique") || cmpResult >= 0 && (this.direction === "prev" || this.direction === "prevunique")) {
                    throw new DataError();
                }
            }
            if (this._request) {
                this._request.readyState = "pending";
            }
            transaction._execRequestAsync({
                operation: this._iterate.bind(this, key),
                request: this._request,
                source: this.source
            });
            this._gotValue = false;
        }

        // hthttps://w3c.github.io/IndexedDB/#dom-idbcursor-continueprimarykey
        continuePrimaryKey(key, primaryKey) {
            const effectiveObjectStore = getEffectiveObjectStore(this);
            const transaction = effectiveObjectStore.transaction;
            if (transaction._state !== "active") {
                throw new TransactionInactiveError();
            }
            if (effectiveObjectStore._rawObjectStore.deleted) {
                throw new InvalidStateError();
            }
            if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
                throw new InvalidStateError();
            }
            if (this.source instanceof FDBObjectStore || this.direction !== "next" && this.direction !== "prev") {
                throw new InvalidAccessError();
            }
            if (!this._gotValue) {
                throw new InvalidStateError();
            }

            // Not sure about this
            if (key === undefined || primaryKey === undefined) {
                throw new DataError();
            }
            key = valueToKey(key);
            const cmpResult = cmp(key, this._position);
            if (cmpResult === -1 && this.direction === "next" || cmpResult === 1 && this.direction === "prev") {
                throw new DataError();
            }
            const cmpResult2 = cmp(primaryKey, this._objectStorePosition);
            if (cmpResult === 0) {
                if (cmpResult2 <= 0 && this.direction === "next" || cmpResult2 >= 0 && this.direction === "prev") {
                    throw new DataError();
                }
            }
            if (this._request) {
                this._request.readyState = "pending";
            }
            transaction._execRequestAsync({
                operation: this._iterate.bind(this, key, primaryKey),
                request: this._request,
                source: this.source
            });
            this._gotValue = false;
        }
        delete() {
            const effectiveObjectStore = getEffectiveObjectStore(this);
            const effectiveKey = Object.hasOwn(this.source, "_rawIndex") ? this.primaryKey : this._position;
            const transaction = effectiveObjectStore.transaction;
            if (transaction._state !== "active") {
                throw new TransactionInactiveError();
            }
            if (transaction.mode === "readonly") {
                throw new ReadOnlyError();
            }
            if (effectiveObjectStore._rawObjectStore.deleted) {
                throw new InvalidStateError();
            }
            if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
                throw new InvalidStateError();
            }
            if (!this._gotValue || !Object.hasOwn(this, "value")) {
                throw new InvalidStateError();
            }
            return transaction._execRequestAsync({
                operation: effectiveObjectStore._rawObjectStore.deleteRecord.bind(effectiveObjectStore._rawObjectStore, effectiveKey, transaction._rollbackLog),
                source: this
            });
        }
        toString() {
            return "[object IDBCursor]";
        }
    } class FDBCursorWithValue extends FDBCursor {
        value = undefined;
        constructor(source, range, direction, request) {
            super(source, range, direction, request);
        }
        toString() {
            return "[object IDBCursorWithValue]";
        }
    } const stopped = (event, listener) => {
        return event.immediatePropagationStopped || event.eventPhase === event.CAPTURING_PHASE && listener.capture === false || event.eventPhase === event.BUBBLING_PHASE && listener.capture === true;
    };

    // http://www.w3.org/TR/dom/#concept-event-listener-invoke
    const invokeEventListeners = (event, obj) => {
        event.currentTarget = obj;

        // The callback might cause obj.listeners to mutate as we traverse it.
        // Take a copy of the array so that nothing sneaks in and we don't lose
        // our place.
        for (const listener of obj.listeners.slice()) {
            if (event.type !== listener.type || stopped(event, listener)) {
                continue;
            }

            // @ts-ignore
            listener.callback.call(event.currentTarget, event);
        }
        const typeToProp = {
            abort: "onabort",
            blocked: "onblocked",
            complete: "oncomplete",
            error: "onerror",
            success: "onsuccess",
            upgradeneeded: "onupgradeneeded",
            versionchange: "onversionchange"
        };
        const prop = typeToProp[event.type];
        if (prop === undefined) {
            throw new Error(`Unknown event type: "${event.type}"`);
        }
        const callback = event.currentTarget[prop];
        if (callback) {
            const listener = {
                callback,
                capture: false,
                type: event.type
            };
            if (!stopped(event, listener)) {
                // @ts-ignore
                listener.callback.call(event.currentTarget, event);
            }
        }
    };
    class FakeEventTarget {
        listeners = [];

        // These will be overridden in individual subclasses and made not readonly

        addEventListener(type, callback, capture = false) {
            this.listeners.push({
                callback,
                capture,
                type
            });
        }
        removeEventListener(type, callback, capture = false) {
            const i = this.listeners.findIndex(listener => {
                return listener.type === type && listener.callback === callback && listener.capture === capture;
            });
            this.listeners.splice(i, 1);
        }

        // http://www.w3.org/TR/dom/#dispatching-events
        dispatchEvent(event) {
            if (event.dispatched || !event.initialized) {
                throw new InvalidStateError("The object is in an invalid state.");
            }
            event.isTrusted = false;
            event.dispatched = true;
            event.target = this;
            // NOT SURE WHEN THIS SHOULD BE SET        event.eventPath = [];

            event.eventPhase = event.CAPTURING_PHASE;
            for (const obj of event.eventPath) {
                if (!event.propagationStopped) {
                    invokeEventListeners(event, obj);
                }
            }
            event.eventPhase = event.AT_TARGET;
            if (!event.propagationStopped) {
                invokeEventListeners(event, event.target);
            }
            if (event.bubbles) {
                event.eventPath.reverse();
                event.eventPhase = event.BUBBLING_PHASE;
                for (const obj of event.eventPath) {
                    if (!event.propagationStopped) {
                        invokeEventListeners(event, obj);
                    }
                }
            }
            event.dispatched = false;
            event.eventPhase = event.NONE;
            event.currentTarget = null;
            if (event.canceled) {
                return false;
            }
            return true;
        }
    } class FDBRequest extends FakeEventTarget {
        _result = null;
        _error = null;
        source = null;
        transaction = null;
        readyState = "pending";
        onsuccess = null;
        onerror = null;
        get error() {
            if (this.readyState === "pending") {
                throw new InvalidStateError();
            }
            return this._error;
        }
        set error(value) {
            this._error = value;
        }
        get result() {
            if (this.readyState === "pending") {
                throw new InvalidStateError();
            }
            return this._result;
        }
        set result(value) {
            this._result = value;
        }
        toString() {
            return "[object IDBRequest]";
        }
    }// https://heycam.github.io/webidl/#EnforceRange

    const enforceRange = (num, type) => {
        const min = 0;
        const max = type === "unsigned long" ? 4294967295 : 9007199254740991;
        if (isNaN(num) || num < min || num > max) {
            throw new TypeError();
        }
        if (num >= 0) {
            return Math.floor(num);
        }
    }; class FakeDOMStringList extends Array {
        contains(value) {
            for (const value2 of this) {
                if (value === value2) {
                    return true;
                }
            }
            return false;
        }
        item(i) {
            if (i < 0 || i >= this.length) {
                return null;
            }
            return this[i];
        }

        // Used internally, should not be used by others. I could maybe get rid of these and replace rather than mutate, but too lazy to check the spec.
        _push(...values) {
            return Array.prototype.push.call(this, ...values);
        }
        _sort(...values) {
            return Array.prototype.sort.call(this, ...values);
        }
    }// http://w3c.github.io/IndexedDB/#convert-a-value-to-a-key-range
    const valueToKeyRange = (value, nullDisallowedFlag = false) => {
        if (value instanceof FDBKeyRange) {
            return value;
        }
        if (value === null || value === undefined) {
            if (nullDisallowedFlag) {
                throw new DataError();
            }
            return new FDBKeyRange(undefined, undefined, false, false);
        }
        const key = valueToKey(value);
        return FDBKeyRange.only(key);
    }; const confirmActiveTransaction$1 = index => {
        if (index._rawIndex.deleted || index.objectStore._rawObjectStore.deleted) {
            throw new InvalidStateError();
        }
        if (index.objectStore.transaction._state !== "active") {
            throw new TransactionInactiveError();
        }
    };

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#idl-def-IDBIndex
    class FDBIndex {
        constructor(objectStore, rawIndex) {
            this._rawIndex = rawIndex;
            this._name = rawIndex.name;
            this.objectStore = objectStore;
            this.keyPath = rawIndex.keyPath;
            this.multiEntry = rawIndex.multiEntry;
            this.unique = rawIndex.unique;
        }
        get name() {
            return this._name;
        }

        // https://w3c.github.io/IndexedDB/#dom-idbindex-name
        set name(name) {
            const transaction = this.objectStore.transaction;
            if (!transaction.db._runningVersionchangeTransaction) {
                throw new InvalidStateError();
            }
            if (transaction._state !== "active") {
                throw new TransactionInactiveError();
            }
            if (this._rawIndex.deleted || this.objectStore._rawObjectStore.deleted) {
                throw new InvalidStateError();
            }
            name = String(name);
            if (name === this._name) {
                return;
            }
            if (this.objectStore.indexNames.contains(name)) {
                throw new ConstraintError();
            }
            const oldName = this._name;
            const oldIndexNames = [...this.objectStore.indexNames];
            this._name = name;
            this._rawIndex.name = name;
            this.objectStore._indexesCache.delete(oldName);
            this.objectStore._indexesCache.set(name, this);
            this.objectStore._rawObjectStore.rawIndexes.delete(oldName);
            this.objectStore._rawObjectStore.rawIndexes.set(name, this._rawIndex);
            this.objectStore.indexNames = new FakeDOMStringList(...Array.from(this.objectStore._rawObjectStore.rawIndexes.keys()).filter(indexName => {
                const index = this.objectStore._rawObjectStore.rawIndexes.get(indexName);
                return index && !index.deleted;
            }).sort());
            transaction._rollbackLog.push(() => {
                this._name = oldName;
                this._rawIndex.name = oldName;
                this.objectStore._indexesCache.delete(name);
                this.objectStore._indexesCache.set(oldName, this);
                this.objectStore._rawObjectStore.rawIndexes.delete(name);
                this.objectStore._rawObjectStore.rawIndexes.set(oldName, this._rawIndex);
                this.objectStore.indexNames = new FakeDOMStringList(...oldIndexNames);
            });
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openCursor-IDBRequest-any-range-IDBCursorDirection-direction
        openCursor(range, direction) {
            confirmActiveTransaction$1(this);
            if (range === null) {
                range = undefined;
            }
            if (range !== undefined && !(range instanceof FDBKeyRange)) {
                range = FDBKeyRange.only(valueToKey(range));
            }
            const request = new FDBRequest();
            request.source = this;
            request.transaction = this.objectStore.transaction;
            const cursor = new FDBCursorWithValue(this, range, direction, request);
            return this.objectStore.transaction._execRequestAsync({
                operation: cursor._iterate.bind(cursor),
                request,
                source: this
            });
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openKeyCursor-IDBRequest-any-range-IDBCursorDirection-direction
        openKeyCursor(range, direction) {
            confirmActiveTransaction$1(this);
            if (range === null) {
                range = undefined;
            }
            if (range !== undefined && !(range instanceof FDBKeyRange)) {
                range = FDBKeyRange.only(valueToKey(range));
            }
            const request = new FDBRequest();
            request.source = this;
            request.transaction = this.objectStore.transaction;
            const cursor = new FDBCursor(this, range, direction, request, true);
            return this.objectStore.transaction._execRequestAsync({
                operation: cursor._iterate.bind(cursor),
                request,
                source: this
            });
        }
        get(key) {
            confirmActiveTransaction$1(this);
            if (!(key instanceof FDBKeyRange)) {
                key = valueToKey(key);
            }
            return this.objectStore.transaction._execRequestAsync({
                operation: this._rawIndex.getValue.bind(this._rawIndex, key),
                source: this
            });
        }

        // http://w3c.github.io/IndexedDB/#dom-idbindex-getall
        getAll(query, count) {
            if (arguments.length > 1 && count !== undefined) {
                count = enforceRange(count, "unsigned long");
            }
            confirmActiveTransaction$1(this);
            const range = valueToKeyRange(query);
            return this.objectStore.transaction._execRequestAsync({
                operation: this._rawIndex.getAllValues.bind(this._rawIndex, range, count),
                source: this
            });
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-getKey-IDBRequest-any-key
        getKey(key) {
            confirmActiveTransaction$1(this);
            if (!(key instanceof FDBKeyRange)) {
                key = valueToKey(key);
            }
            return this.objectStore.transaction._execRequestAsync({
                operation: this._rawIndex.getKey.bind(this._rawIndex, key),
                source: this
            });
        }

        // http://w3c.github.io/IndexedDB/#dom-idbindex-getallkeys
        getAllKeys(query, count) {
            if (arguments.length > 1 && count !== undefined) {
                count = enforceRange(count, "unsigned long");
            }
            confirmActiveTransaction$1(this);
            const range = valueToKeyRange(query);
            return this.objectStore.transaction._execRequestAsync({
                operation: this._rawIndex.getAllKeys.bind(this._rawIndex, range, count),
                source: this
            });
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-count-IDBRequest-any-key
        count(key) {
            confirmActiveTransaction$1(this);
            if (key === null) {
                key = undefined;
            }
            if (key !== undefined && !(key instanceof FDBKeyRange)) {
                key = FDBKeyRange.only(valueToKey(key));
            }
            return this.objectStore.transaction._execRequestAsync({
                operation: () => {
                    return this._rawIndex.count(key);
                },
                source: this
            });
        }
        toString() {
            return "[object IDBIndex]";
        }
    }// http://w3c.github.io/IndexedDB/#check-that-a-key-could-be-injected-into-a-value
    const canInjectKey = (keyPath, value) => {
        if (Array.isArray(keyPath)) {
            throw new Error("The key paths used in this section are always strings and never sequences, since it is not possible to create a object store which has a key generator and also has a key path that is a sequence.");
        }
        const identifiers = keyPath.split(".");
        if (identifiers.length === 0) {
            throw new Error("Assert: identifiers is not empty");
        }
        identifiers.pop();
        for (const identifier of identifiers) {
            if (typeof value !== "object" && !Array.isArray(value)) {
                return false;
            }
            const hop = Object.hasOwn(value, identifier);
            if (!hop) {
                return true;
            }
            value = value[identifier];
        }
        return typeof value === "object" || Array.isArray(value);
    };/**
 * Classic binary search implementation. Returns the index where the key
 * should be inserted, assuming the records list is ordered.
 */
    function binarySearch(records, key) {
        let low = 0;
        let high = records.length;
        let mid;
        while (low < high) {
            mid = low + high >>> 1; // like Math.floor((low + high) / 2) but fast
            if (cmp(records[mid].key, key) < 0) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }

    /**
     * Equivalent to `records.findIndex(record => cmp(record.key, key) === 0)`
     */
    function getIndexByKey(records, key) {
        const idx = binarySearch(records, key);
        const record = records[idx];
        if (record && cmp(record.key, key) === 0) {
            return idx;
        }
        return -1;
    }

    /**
     * Equivalent to `records.find(record => cmp(record.key, key) === 0)`
     */
    function getByKey(records, key) {
        const idx = getIndexByKey(records, key);
        return records[idx];
    }

    /**
     * Equivalent to `records.findIndex(record => key.includes(record.key))`
     */
    function getIndexByKeyRange(records, keyRange) {
        const lowerIdx = typeof keyRange.lower === "undefined" ? 0 : binarySearch(records, keyRange.lower);
        const upperIdx = typeof keyRange.upper === "undefined" ? records.length - 1 : binarySearch(records, keyRange.upper);
        for (let i = lowerIdx; i <= upperIdx; i++) {
            const record = records[i];
            if (record && keyRange.includes(record.key)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Equivalent to `records.find(record => key.includes(record.key))`
     */
    function getByKeyRange(records, keyRange) {
        const idx = getIndexByKeyRange(records, keyRange);
        return records[idx];
    }

    /**
     * Equivalent to `records.findIndex(record => cmp(record.key, key) >= 0)`
     */
    function getIndexByKeyGTE(records, key) {
        const idx = binarySearch(records, key);
        const record = records[idx];
        if (record && cmp(record.key, key) >= 0) {
            return idx;
        }
        return -1;
    } class RecordStore {
        records = [];
        get(key) {
            if (key instanceof FDBKeyRange) {
                return getByKeyRange(this.records, key);
            }
            return getByKey(this.records, key);
        }
        add(newRecord) {
            // Find where to put it so it's sorted by key
            let i;
            if (this.records.length === 0) {
                i = 0;
            } else {
                i = getIndexByKeyGTE(this.records, newRecord.key);
                if (i === -1) {
                    // If no matching key, add to end
                    i = this.records.length;
                } else {
                    // If matching key, advance to appropriate position based on value (used in indexes)
                    while (i < this.records.length && cmp(this.records[i].key, newRecord.key) === 0) {
                        if (cmp(this.records[i].value, newRecord.value) !== -1) {
                            // Record value >= newRecord value, so insert here
                            break;
                        }
                        i += 1; // Look at next record
                    }
                }
            }
            this.records.splice(i, 0, newRecord);
        }
        delete(key) {
            const deletedRecords = [];
            const isRange = key instanceof FDBKeyRange;
            while (true) {
                const idx = isRange ? getIndexByKeyRange(this.records, key) : getIndexByKey(this.records, key);
                if (idx === -1) {
                    break;
                }
                deletedRecords.push(this.records[idx]);
                this.records.splice(idx, 1);
            }
            return deletedRecords;
        }
        deleteByValue(key) {
            const range = key instanceof FDBKeyRange ? key : FDBKeyRange.only(key);
            const deletedRecords = [];
            this.records = this.records.filter(record => {
                const shouldDelete = range.includes(record.value);
                if (shouldDelete) {
                    deletedRecords.push(record);
                }
                return !shouldDelete;
            });
            return deletedRecords;
        }
        clear() {
            const deletedRecords = this.records.slice();
            this.records = [];
            return deletedRecords;
        }
        values(range, direction = "next") {
            return {
                [Symbol.iterator]: () => {
                    let i;
                    if (direction === "next") {
                        i = 0;
                        if (range !== undefined && range.lower !== undefined) {
                            while (this.records[i] !== undefined) {
                                const cmpResult = cmp(this.records[i].key, range.lower);
                                if (cmpResult === 1 || cmpResult === 0 && !range.lowerOpen) {
                                    break;
                                }
                                i += 1;
                            }
                        }
                    } else {
                        i = this.records.length - 1;
                        if (range !== undefined && range.upper !== undefined) {
                            while (this.records[i] !== undefined) {
                                const cmpResult = cmp(this.records[i].key, range.upper);
                                if (cmpResult === -1 || cmpResult === 0 && !range.upperOpen) {
                                    break;
                                }
                                i -= 1;
                            }
                        }
                    }
                    return {
                        next: () => {
                            let done;
                            let value;
                            if (direction === "next") {
                                value = this.records[i];
                                done = i >= this.records.length;
                                i += 1;
                                if (!done && range !== undefined && range.upper !== undefined) {
                                    const cmpResult = cmp(value.key, range.upper);
                                    done = cmpResult === 1 || cmpResult === 0 && range.upperOpen;
                                    if (done) {
                                        value = undefined;
                                    }
                                }
                            } else {
                                value = this.records[i];
                                done = i < 0;
                                i -= 1;
                                if (!done && range !== undefined && range.lower !== undefined) {
                                    const cmpResult = cmp(value.key, range.lower);
                                    done = cmpResult === -1 || cmpResult === 0 && range.lowerOpen;
                                    if (done) {
                                        value = undefined;
                                    }
                                }
                            }

                            // The weird "as IteratorResult<Record>" is needed because of
                            // https://github.com/Microsoft/TypeScript/issues/11375 and
                            // https://github.com/Microsoft/TypeScript/issues/2983
                            return {
                                done,
                                value
                            };
                        }
                    };
                }
            };
        }
    }// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-index
    class Index {
        deleted = false;
        // Initialized should be used to decide whether to throw an error or abort the versionchange transaction when there is a
        // constraint
        initialized = false;
        records = new RecordStore();
        constructor(rawObjectStore, name, keyPath, multiEntry, unique) {
            this.rawObjectStore = rawObjectStore;
            this.name = name;
            this.keyPath = keyPath;
            this.multiEntry = multiEntry;
            this.unique = unique;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-index
        getKey(key) {
            const record = this.records.get(key);
            return record !== undefined ? record.value : undefined;
        }

        // http://w3c.github.io/IndexedDB/#retrieve-multiple-referenced-values-from-an-index
        getAllKeys(range, count) {
            if (count === undefined || count === 0) {
                count = Infinity;
            }
            const records = [];
            for (const record of this.records.values(range)) {
                records.push(structuredClone(record.value));
                if (records.length >= count) {
                    break;
                }
            }
            return records;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#index-referenced-value-retrieval-operation
        getValue(key) {
            const record = this.records.get(key);
            return record !== undefined ? this.rawObjectStore.getValue(record.value) : undefined;
        }

        // http://w3c.github.io/IndexedDB/#retrieve-multiple-referenced-values-from-an-index
        getAllValues(range, count) {
            if (count === undefined || count === 0) {
                count = Infinity;
            }
            const records = [];
            for (const record of this.records.values(range)) {
                records.push(this.rawObjectStore.getValue(record.value));
                if (records.length >= count) {
                    break;
                }
            }
            return records;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-storing-a-record-into-an-object-store (step 7)
        storeRecord(newRecord) {
            let indexKey;
            try {
                indexKey = extractKey(this.keyPath, newRecord.value);
            } catch (err) {
                if (err.name === "DataError") {
                    // Invalid key is not an actual error, just means we do not store an entry in this index
                    return;
                }
                throw err;
            }
            if (!this.multiEntry || !Array.isArray(indexKey)) {
                try {
                    valueToKey(indexKey);
                } catch (e) {
                    return;
                }
            } else {
                // remove any elements from index key that are not valid keys and remove any duplicate elements from index
                // key such that only one instance of the duplicate value remains.
                const keep = [];
                for (const part of indexKey) {
                    if (keep.indexOf(part) < 0) {
                        try {
                            keep.push(valueToKey(part));
                        } catch (err) {
                            /* Do nothing */
                        }
                    }
                }
                indexKey = keep;
            }
            if (!this.multiEntry || !Array.isArray(indexKey)) {
                if (this.unique) {
                    const existingRecord = this.records.get(indexKey);
                    if (existingRecord) {
                        throw new ConstraintError();
                    }
                }
            } else {
                if (this.unique) {
                    for (const individualIndexKey of indexKey) {
                        const existingRecord = this.records.get(individualIndexKey);
                        if (existingRecord) {
                            throw new ConstraintError();
                        }
                    }
                }
            }
            if (!this.multiEntry || !Array.isArray(indexKey)) {
                this.records.add({
                    key: indexKey,
                    value: newRecord.key
                });
            } else {
                for (const individualIndexKey of indexKey) {
                    this.records.add({
                        key: individualIndexKey,
                        value: newRecord.key
                    });
                }
            }
        }
        initialize(transaction) {
            if (this.initialized) {
                throw new Error("Index already initialized");
            }
            transaction._execRequestAsync({
                operation: () => {
                    try {
                        // Create index based on current value of objectstore
                        for (const record of this.rawObjectStore.records.values()) {
                            this.storeRecord(record);
                        }
                        this.initialized = true;
                    } catch (err) {
                        // console.error(err);
                        transaction._abort(err.name);
                    }
                },
                source: null
            });
        }
        count(range) {
            let count = 0;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const record of this.records.values(range)) {
                count += 1;
            }
            return count;
        }
    }// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-valid-key-path
    const validateKeyPath = (keyPath, parent) => {
        // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same
        // comment in extractKey)
        if (keyPath !== undefined && keyPath !== null && typeof keyPath !== "string" && keyPath.toString && (parent === "array" || !Array.isArray(keyPath))) {
            keyPath = keyPath.toString();
        }
        if (typeof keyPath === "string") {
            if (keyPath === "" && parent !== "string") {
                return;
            }
            try {
                // https://mathiasbynens.be/demo/javascript-identifier-regex for ECMAScript 5.1 / Unicode v7.0.0, with
                // reserved words at beginning removed
                const validIdentifierRegex =
                    // eslint-disable-next-line no-misleading-character-class
                    /^(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])(?:[$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])*$/;
                if (keyPath.length >= 1 && validIdentifierRegex.test(keyPath)) {
                    return;
                }
            } catch (err) {
                throw new SyntaxError(err.message);
            }
            if (keyPath.indexOf(" ") >= 0) {
                throw new SyntaxError("The keypath argument contains an invalid key path (no spaces allowed).");
            }
        }
        if (Array.isArray(keyPath) && keyPath.length > 0) {
            if (parent) {
                // No nested arrays
                throw new SyntaxError("The keypath argument contains an invalid key path (nested arrays).");
            }
            for (const part of keyPath) {
                validateKeyPath(part, "array");
            }
            return;
        } else if (typeof keyPath === "string" && keyPath.indexOf(".") >= 0) {
            keyPath = keyPath.split(".");
            for (const part of keyPath) {
                validateKeyPath(part, "string");
            }
            return;
        }
        throw new SyntaxError();
    }; const confirmActiveTransaction = objectStore => {
        if (objectStore._rawObjectStore.deleted) {
            throw new InvalidStateError();
        }
        if (objectStore.transaction._state !== "active") {
            throw new TransactionInactiveError();
        }
    };
    const buildRecordAddPut = (objectStore, value, key) => {
        confirmActiveTransaction(objectStore);
        if (objectStore.transaction.mode === "readonly") {
            throw new ReadOnlyError();
        }
        if (objectStore.keyPath !== null) {
            if (key !== undefined) {
                throw new DataError();
            }
        }
        const clone = structuredClone(value);
        if (objectStore.keyPath !== null) {
            const tempKey = extractKey(objectStore.keyPath, clone);
            if (tempKey !== undefined) {
                valueToKey(tempKey);
            } else {
                if (!objectStore._rawObjectStore.keyGenerator) {
                    throw new DataError();
                } else if (!canInjectKey(objectStore.keyPath, clone)) {
                    throw new DataError();
                }
            }
        }
        if (objectStore.keyPath === null && objectStore._rawObjectStore.keyGenerator === null && key === undefined) {
            throw new DataError();
        }
        if (key !== undefined) {
            key = valueToKey(key);
        }
        return {
            key,
            value: clone
        };
    };

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#object-store
    class FDBObjectStore {
        _indexesCache = new Map();
        constructor(transaction, rawObjectStore) {
            this._rawObjectStore = rawObjectStore;
            this._name = rawObjectStore.name;
            this.keyPath = rawObjectStore.keyPath;
            this.autoIncrement = rawObjectStore.autoIncrement;
            this.transaction = transaction;
            this.indexNames = new FakeDOMStringList(...Array.from(rawObjectStore.rawIndexes.keys()).sort());
        }
        get name() {
            return this._name;
        }

        // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-name
        set name(name) {
            const transaction = this.transaction;
            if (!transaction.db._runningVersionchangeTransaction) {
                throw new InvalidStateError();
            }
            confirmActiveTransaction(this);
            name = String(name);
            if (name === this._name) {
                return;
            }
            if (this._rawObjectStore.rawDatabase.rawObjectStores.has(name)) {
                throw new ConstraintError();
            }
            const oldName = this._name;
            const oldObjectStoreNames = [...transaction.db.objectStoreNames];
            this._name = name;
            this._rawObjectStore.name = name;
            this.transaction._objectStoresCache.delete(oldName);
            this.transaction._objectStoresCache.set(name, this);
            this._rawObjectStore.rawDatabase.rawObjectStores.delete(oldName);
            this._rawObjectStore.rawDatabase.rawObjectStores.set(name, this._rawObjectStore);
            transaction.db.objectStoreNames = new FakeDOMStringList(...Array.from(this._rawObjectStore.rawDatabase.rawObjectStores.keys()).filter(objectStoreName => {
                const objectStore = this._rawObjectStore.rawDatabase.rawObjectStores.get(objectStoreName);
                return objectStore && !objectStore.deleted;
            }).sort());
            const oldScope = new Set(transaction._scope);
            const oldTransactionObjectStoreNames = [...transaction.objectStoreNames];
            this.transaction._scope.delete(oldName);
            transaction._scope.add(name);
            transaction.objectStoreNames = new FakeDOMStringList(...Array.from(transaction._scope).sort());
            transaction._rollbackLog.push(() => {
                this._name = oldName;
                this._rawObjectStore.name = oldName;
                this.transaction._objectStoresCache.delete(name);
                this.transaction._objectStoresCache.set(oldName, this);
                this._rawObjectStore.rawDatabase.rawObjectStores.delete(name);
                this._rawObjectStore.rawDatabase.rawObjectStores.set(oldName, this._rawObjectStore);
                transaction.db.objectStoreNames = new FakeDOMStringList(...oldObjectStoreNames);
                transaction._scope = oldScope;
                transaction.objectStoreNames = new FakeDOMStringList(...oldTransactionObjectStoreNames);
            });
        }
        put(value, key) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            const record = buildRecordAddPut(this, value, key);
            return this.transaction._execRequestAsync({
                operation: this._rawObjectStore.storeRecord.bind(this._rawObjectStore, record, false, this.transaction._rollbackLog),
                source: this
            });
        }
        add(value, key) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            const record = buildRecordAddPut(this, value, key);
            return this.transaction._execRequestAsync({
                operation: this._rawObjectStore.storeRecord.bind(this._rawObjectStore, record, true, this.transaction._rollbackLog),
                source: this
            });
        }
        delete(key) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            confirmActiveTransaction(this);
            if (this.transaction.mode === "readonly") {
                throw new ReadOnlyError();
            }
            if (!(key instanceof FDBKeyRange)) {
                key = valueToKey(key);
            }
            return this.transaction._execRequestAsync({
                operation: this._rawObjectStore.deleteRecord.bind(this._rawObjectStore, key, this.transaction._rollbackLog),
                source: this
            });
        }
        get(key) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            confirmActiveTransaction(this);
            if (!(key instanceof FDBKeyRange)) {
                key = valueToKey(key);
            }
            return this.transaction._execRequestAsync({
                operation: this._rawObjectStore.getValue.bind(this._rawObjectStore, key),
                source: this
            });
        }

        // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getall
        getAll(query, count) {
            if (arguments.length > 1 && count !== undefined) {
                count = enforceRange(count, "unsigned long");
            }
            confirmActiveTransaction(this);
            const range = valueToKeyRange(query);
            return this.transaction._execRequestAsync({
                operation: this._rawObjectStore.getAllValues.bind(this._rawObjectStore, range, count),
                source: this
            });
        }

        // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getkey
        getKey(key) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            confirmActiveTransaction(this);
            if (!(key instanceof FDBKeyRange)) {
                key = valueToKey(key);
            }
            return this.transaction._execRequestAsync({
                operation: this._rawObjectStore.getKey.bind(this._rawObjectStore, key),
                source: this
            });
        }

        // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getallkeys
        getAllKeys(query, count) {
            if (arguments.length > 1 && count !== undefined) {
                count = enforceRange(count, "unsigned long");
            }
            confirmActiveTransaction(this);
            const range = valueToKeyRange(query);
            return this.transaction._execRequestAsync({
                operation: this._rawObjectStore.getAllKeys.bind(this._rawObjectStore, range, count),
                source: this
            });
        }
        clear() {
            confirmActiveTransaction(this);
            if (this.transaction.mode === "readonly") {
                throw new ReadOnlyError();
            }
            return this.transaction._execRequestAsync({
                operation: this._rawObjectStore.clear.bind(this._rawObjectStore, this.transaction._rollbackLog),
                source: this
            });
        }
        openCursor(range, direction) {
            confirmActiveTransaction(this);
            if (range === null) {
                range = undefined;
            }
            if (range !== undefined && !(range instanceof FDBKeyRange)) {
                range = FDBKeyRange.only(valueToKey(range));
            }
            const request = new FDBRequest();
            request.source = this;
            request.transaction = this.transaction;
            const cursor = new FDBCursorWithValue(this, range, direction, request);
            return this.transaction._execRequestAsync({
                operation: cursor._iterate.bind(cursor),
                request,
                source: this
            });
        }
        openKeyCursor(range, direction) {
            confirmActiveTransaction(this);
            if (range === null) {
                range = undefined;
            }
            if (range !== undefined && !(range instanceof FDBKeyRange)) {
                range = FDBKeyRange.only(valueToKey(range));
            }
            const request = new FDBRequest();
            request.source = this;
            request.transaction = this.transaction;
            const cursor = new FDBCursor(this, range, direction, request, true);
            return this.transaction._execRequestAsync({
                operation: cursor._iterate.bind(cursor),
                request,
                source: this
            });
        }

        // tslint:-next-line max-line-length
        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-createIndex-IDBIndex-DOMString-name-DOMString-sequence-DOMString--keyPath-IDBIndexParameters-optionalParameters
        createIndex(name, keyPath, optionalParameters = {}) {
            if (arguments.length < 2) {
                throw new TypeError();
            }
            const multiEntry = optionalParameters.multiEntry !== undefined ? optionalParameters.multiEntry : false;
            const unique = optionalParameters.unique !== undefined ? optionalParameters.unique : false;
            if (this.transaction.mode !== "versionchange") {
                throw new InvalidStateError();
            }
            confirmActiveTransaction(this);
            if (this.indexNames.contains(name)) {
                throw new ConstraintError();
            }
            validateKeyPath(keyPath);
            if (Array.isArray(keyPath) && multiEntry) {
                throw new InvalidAccessError();
            }

            // The index that is requested to be created can contain constraints on the data allowed in the index's
            // referenced object store, such as requiring uniqueness of the values referenced by the index's keyPath. If the
            // referenced object store already contains data which violates these constraints, this MUST NOT cause the
            // implementation of createIndex to throw an exception or affect what it returns. The implementation MUST still
            // create and return an IDBIndex object. Instead the implementation must queue up an operation to abort the
            // "versionchange" transaction which was used for the createIndex call.

            const indexNames = [...this.indexNames];
            this.transaction._rollbackLog.push(() => {
                const index2 = this._rawObjectStore.rawIndexes.get(name);
                if (index2) {
                    index2.deleted = true;
                }
                this.indexNames = new FakeDOMStringList(...indexNames);
                this._rawObjectStore.rawIndexes.delete(name);
            });
            const index = new Index(this._rawObjectStore, name, keyPath, multiEntry, unique);
            this.indexNames._push(name);
            this.indexNames._sort();
            this._rawObjectStore.rawIndexes.set(name, index);
            index.initialize(this.transaction); // This is async by design

            return new FDBIndex(this, index);
        }

        // https://w3c.github.io/IndexedDB/#dom-idbobjectstore-index
        index(name) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            if (this._rawObjectStore.deleted || this.transaction._state === "finished") {
                throw new InvalidStateError();
            }
            const index = this._indexesCache.get(name);
            if (index !== undefined) {
                return index;
            }
            const rawIndex = this._rawObjectStore.rawIndexes.get(name);
            if (!this.indexNames.contains(name) || rawIndex === undefined) {
                throw new NotFoundError();
            }
            const index2 = new FDBIndex(this, rawIndex);
            this._indexesCache.set(name, index2);
            return index2;
        }
        deleteIndex(name) {
            if (arguments.length === 0) {
                throw new TypeError();
            }
            if (this.transaction.mode !== "versionchange") {
                throw new InvalidStateError();
            }
            confirmActiveTransaction(this);
            const rawIndex = this._rawObjectStore.rawIndexes.get(name);
            if (rawIndex === undefined) {
                throw new NotFoundError();
            }
            this.transaction._rollbackLog.push(() => {
                rawIndex.deleted = false;
                this._rawObjectStore.rawIndexes.set(name, rawIndex);
                this.indexNames._push(name);
                this.indexNames._sort();
            });
            this.indexNames = new FakeDOMStringList(...Array.from(this.indexNames).filter(indexName => {
                return indexName !== name;
            }));
            rawIndex.deleted = true; // Not sure if this is supposed to happen synchronously

            this.transaction._execRequestAsync({
                operation: () => {
                    const rawIndex2 = this._rawObjectStore.rawIndexes.get(name);

                    // Hack in case another index is given this name before this async request is processed. It'd be better
                    // to have a real unique ID for each index.
                    if (rawIndex === rawIndex2) {
                        this._rawObjectStore.rawIndexes.delete(name);
                    }
                },
                source: this
            });
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-count-IDBRequest-any-key
        count(key) {
            confirmActiveTransaction(this);
            if (key === null) {
                key = undefined;
            }
            if (key !== undefined && !(key instanceof FDBKeyRange)) {
                key = FDBKeyRange.only(valueToKey(key));
            }
            return this.transaction._execRequestAsync({
                operation: () => {
                    return this._rawObjectStore.count(key);
                },
                source: this
            });
        }
        toString() {
            return "[object IDBObjectStore]";
        }
    } class Event {
        eventPath = [];
        NONE = 0;
        CAPTURING_PHASE = 1;
        AT_TARGET = 2;
        BUBBLING_PHASE = 3;

        // Flags
        propagationStopped = false;
        immediatePropagationStopped = false;
        canceled = false;
        initialized = true;
        dispatched = false;
        target = null;
        currentTarget = null;
        eventPhase = 0;
        defaultPrevented = false;
        isTrusted = false;
        timeStamp = Date.now();
        constructor(type, eventInitDict = {}) {
            this.type = type;
            this.bubbles = eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
            this.cancelable = eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
        }
        preventDefault() {
            if (this.cancelable) {
                this.canceled = true;
            }
        }
        stopPropagation() {
            this.propagationStopped = true;
        }
        stopImmediatePropagation() {
            this.propagationStopped = true;
            this.immediatePropagationStopped = true;
        }
    }// When running within Node.js (including jsdom), we want to use setImmediate
    // (which runs immediately) rather than setTimeout (which enforces a minimum
    // delay of 1ms, and on Windows only has a resolution of 15ms or so).  jsdom
    // doesn't provide setImmediate (to better match the browser environment) and
    // sandboxes scripts, but its sandbox is by necessity imperfect, so we can break
    // out of it:
    //
    // - https://github.com/jsdom/jsdom#executing-scripts
    // - https://github.com/jsdom/jsdom/issues/2729
    // - https://github.com/scala-js/scala-js-macrotask-executor/pull/17
    function getSetImmediateFromJsdom() {
        if (typeof navigator !== "undefined" && /jsdom/.test(navigator.userAgent)) {
            const outerRealmFunctionConstructor = Node.constructor;
            return new outerRealmFunctionConstructor("return setImmediate")();
        } else {
            return undefined;
        }
    }

    // Schedules a task to run later.  Use Node.js's setImmediate if available and
    // setTimeout otherwise.  Note that options like process.nextTick or
    // queueMicrotask will likely not work: IndexedDB semantics require that
    // transactions are marked as not active when the event loop runs. The next
    // tick queue and microtask queue run within the current event loop macrotask,
    // so they'd process database operations too quickly.
    const queueTask = fn => {
        const setImmediate = globalThis.setImmediate || getSetImmediateFromJsdom() || (fn => setTimeout(fn, 0));
        setImmediate(fn);
    };// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#transaction
    class FDBTransaction extends FakeEventTarget {
        _state = "active";
        _started = false;
        _rollbackLog = [];
        _objectStoresCache = new Map();
        error = null;
        onabort = null;
        oncomplete = null;
        onerror = null;
        _requests = [];
        constructor(storeNames, mode, db) {
            super();
            this._scope = new Set(storeNames);
            this.mode = mode;
            this.db = db;
            this.objectStoreNames = new FakeDOMStringList(...Array.from(this._scope).sort());
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-aborting-a-transaction
        _abort(errName) {
            for (const f of this._rollbackLog.reverse()) {
                f();
            }
            if (errName !== null) {
                const e = new DOMException(undefined, errName);
                this.error = e;
            }

            // Should this directly remove from _requests?
            for (const {
                request
            } of this._requests) {
                if (request.readyState !== "done") {
                    request.readyState = "done"; // This will cancel execution of this request's operation
                    if (request.source) {
                        request.result = undefined;
                        request.error = new AbortError();
                        const event = new Event("error", {
                            bubbles: true,
                            cancelable: true
                        });
                        event.eventPath = [this.db, this];
                        request.dispatchEvent(event);
                    }
                }
            }
            queueTask(() => {
                const event = new Event("abort", {
                    bubbles: true,
                    cancelable: false
                });
                event.eventPath = [this.db];
                this.dispatchEvent(event);
            });
            this._state = "finished";
        }
        abort() {
            if (this._state === "committing" || this._state === "finished") {
                throw new InvalidStateError();
            }
            this._state = "active";
            this._abort(null);
        }

        // http://w3c.github.io/IndexedDB/#dom-idbtransaction-objectstore
        objectStore(name) {
            if (this._state !== "active") {
                throw new InvalidStateError();
            }
            const objectStore = this._objectStoresCache.get(name);
            if (objectStore !== undefined) {
                return objectStore;
            }
            const rawObjectStore = this.db._rawDatabase.rawObjectStores.get(name);
            if (!this._scope.has(name) || rawObjectStore === undefined) {
                throw new NotFoundError();
            }
            const objectStore2 = new FDBObjectStore(this, rawObjectStore);
            this._objectStoresCache.set(name, objectStore2);
            return objectStore2;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-asynchronously-executing-a-request
        _execRequestAsync(obj) {
            const source = obj.source;
            const operation = obj.operation;
            let request = Object.hasOwn(obj, "request") ? obj.request : null;
            if (this._state !== "active") {
                throw new TransactionInactiveError();
            }

            // Request should only be passed for cursors
            if (!request) {
                if (!source) {
                    // Special requests like indexes that just need to run some code
                    request = new FDBRequest();
                } else {
                    request = new FDBRequest();
                    request.source = source;
                    request.transaction = source.transaction;
                }
            }
            this._requests.push({
                operation,
                request
            });
            return request;
        }
        _start() {
            this._started = true;

            // Remove from request queue - cursor ones will be added back if necessary by cursor.continue and such
            let operation;
            let request;
            while (this._requests.length > 0) {
                const r = this._requests.shift();

                // This should only be false if transaction was aborted
                if (r && r.request.readyState !== "done") {
                    request = r.request;
                    operation = r.operation;
                    break;
                }
            }
            if (request && operation) {
                if (!request.source) {
                    // Special requests like indexes that just need to run some code, with error handling already built into
                    // operation
                    operation();
                } else {
                    let defaultAction;
                    let event;
                    try {
                        const result = operation();
                        request.readyState = "done";
                        request.result = result;
                        request.error = undefined;

                        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-a-success-event
                        if (this._state === "inactive") {
                            this._state = "active";
                        }
                        event = new Event("success", {
                            bubbles: false,
                            cancelable: false
                        });
                    } catch (err) {
                        request.readyState = "done";
                        request.result = undefined;
                        request.error = err;

                        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-an-error-event
                        if (this._state === "inactive") {
                            this._state = "active";
                        }
                        event = new Event("error", {
                            bubbles: true,
                            cancelable: true
                        });
                        defaultAction = this._abort.bind(this, err.name);
                    }
                    try {
                        event.eventPath = [this.db, this];
                        request.dispatchEvent(event);
                    } catch (err) {
                        if (this._state !== "committing") {
                            this._abort("AbortError");
                        }
                        throw err;
                    }

                    // Default action of event
                    if (!event.canceled) {
                        if (defaultAction) {
                            defaultAction();
                        }
                    }
                }

                // Give it another chance for new handlers to be set before finishing
                queueTask(this._start.bind(this));
                return;
            }

            // Check if transaction complete event needs to be fired
            if (this._state !== "finished") {
                // Either aborted or committed already
                this._state = "finished";
                if (!this.error) {
                    const event = new Event("complete");
                    this.dispatchEvent(event);
                }
            }
        }
        commit() {
            if (this._state !== "active") {
                throw new InvalidStateError();
            }
            this._state = "committing";
        }
        toString() {
            return "[object IDBRequest]";
        }
    } const MAX_KEY = 9007199254740992;
    class KeyGenerator {
        // This is kind of wrong. Should start at 1 and increment only after record is saved
        num = 0;
        next() {
            if (this.num >= MAX_KEY) {
                throw new ConstraintError();
            }
            this.num += 1;
            return this.num;
        }

        // https://w3c.github.io/IndexedDB/#possibly-update-the-key-generator
        setIfLarger(num) {
            const value = Math.floor(Math.min(num, MAX_KEY)) - 1;
            if (value >= this.num) {
                this.num = value + 1;
            }
        }
    }// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-object-store
    class ObjectStore {
        deleted = false;
        records = new RecordStore();
        rawIndexes = new Map();
        constructor(rawDatabase, name, keyPath, autoIncrement) {
            this.rawDatabase = rawDatabase;
            this.keyGenerator = autoIncrement === true ? new KeyGenerator() : null;
            this.deleted = false;
            this.name = name;
            this.keyPath = keyPath;
            this.autoIncrement = autoIncrement;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-object-store
        getKey(key) {
            const record = this.records.get(key);
            return record !== undefined ? structuredClone(record.key) : undefined;
        }

        // http://w3c.github.io/IndexedDB/#retrieve-multiple-keys-from-an-object-store
        getAllKeys(range, count) {
            if (count === undefined || count === 0) {
                count = Infinity;
            }
            const records = [];
            for (const record of this.records.values(range)) {
                records.push(structuredClone(record.key));
                if (records.length >= count) {
                    break;
                }
            }
            return records;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-object-store
        getValue(key) {
            const record = this.records.get(key);
            return record !== undefined ? structuredClone(record.value) : undefined;
        }

        // http://w3c.github.io/IndexedDB/#retrieve-multiple-values-from-an-object-store
        getAllValues(range, count) {
            if (count === undefined || count === 0) {
                count = Infinity;
            }
            const records = [];
            for (const record of this.records.values(range)) {
                records.push(structuredClone(record.value));
                if (records.length >= count) {
                    break;
                }
            }
            return records;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-storing-a-record-into-an-object-store
        storeRecord(newRecord, noOverwrite, rollbackLog) {
            if (this.keyPath !== null) {
                const key = extractKey(this.keyPath, newRecord.value);
                if (key !== undefined) {
                    newRecord.key = key;
                }
            }
            if (this.keyGenerator !== null && newRecord.key === undefined) {
                if (rollbackLog) {
                    const keyGeneratorBefore = this.keyGenerator.num;
                    rollbackLog.push(() => {
                        if (this.keyGenerator) {
                            this.keyGenerator.num = keyGeneratorBefore;
                        }
                    });
                }
                newRecord.key = this.keyGenerator.next();

                // Set in value if keyPath defiend but led to no key
                // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-to-assign-a-key-to-a-value-using-a-key-path
                if (this.keyPath !== null) {
                    if (Array.isArray(this.keyPath)) {
                        throw new Error("Cannot have an array key path in an object store with a key generator");
                    }
                    let remainingKeyPath = this.keyPath;
                    let object = newRecord.value;
                    let identifier;
                    let i = 0; // Just to run the loop at least once
                    while (i >= 0) {
                        if (typeof object !== "object") {
                            throw new DataError();
                        }
                        i = remainingKeyPath.indexOf(".");
                        if (i >= 0) {
                            identifier = remainingKeyPath.slice(0, i);
                            remainingKeyPath = remainingKeyPath.slice(i + 1);
                            if (!Object.hasOwn(object, identifier)) {
                                object[identifier] = {};
                            }
                            object = object[identifier];
                        }
                    }
                    identifier = remainingKeyPath;
                    object[identifier] = newRecord.key;
                }
            } else if (this.keyGenerator !== null && typeof newRecord.key === "number") {
                this.keyGenerator.setIfLarger(newRecord.key);
            }
            const existingRecord = this.records.get(newRecord.key);
            if (existingRecord) {
                if (noOverwrite) {
                    throw new ConstraintError();
                }
                this.deleteRecord(newRecord.key, rollbackLog);
            }
            this.records.add(newRecord);
            if (rollbackLog) {
                rollbackLog.push(() => {
                    this.deleteRecord(newRecord.key);
                });
            }

            // Update indexes
            for (const rawIndex of this.rawIndexes.values()) {
                if (rawIndex.initialized) {
                    rawIndex.storeRecord(newRecord);
                }
            }
            return newRecord.key;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-deleting-records-from-an-object-store
        deleteRecord(key, rollbackLog) {
            const deletedRecords = this.records.delete(key);
            if (rollbackLog) {
                for (const record of deletedRecords) {
                    rollbackLog.push(() => {
                        this.storeRecord(record, true);
                    });
                }
            }
            for (const rawIndex of this.rawIndexes.values()) {
                rawIndex.records.deleteByValue(key);
            }
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-clearing-an-object-store
        clear(rollbackLog) {
            const deletedRecords = this.records.clear();
            if (rollbackLog) {
                for (const record of deletedRecords) {
                    rollbackLog.push(() => {
                        this.storeRecord(record, true);
                    });
                }
            }
            for (const rawIndex of this.rawIndexes.values()) {
                rawIndex.records.clear();
            }
        }
        count(range) {
            let count = 0;

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const record of this.records.values(range)) {
                count += 1;
            }
            return count;
        }
    } const confirmActiveVersionchangeTransaction = database => {
        if (!database._runningVersionchangeTransaction) {
            throw new InvalidStateError();
        }

        // Find the latest versionchange transaction
        const transactions = database._rawDatabase.transactions.filter(tx => {
            return tx.mode === "versionchange";
        });
        const transaction = transactions[transactions.length - 1];
        if (!transaction || transaction._state === "finished") {
            throw new InvalidStateError();
        }
        if (transaction._state !== "active") {
            throw new TransactionInactiveError();
        }
        return transaction;
    };

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-closing-steps
    const closeConnection = connection => {
        connection._closePending = true;
        const transactionsComplete = connection._rawDatabase.transactions.every(transaction => {
            return transaction._state === "finished";
        });
        if (transactionsComplete) {
            connection._closed = true;
            connection._rawDatabase.connections = connection._rawDatabase.connections.filter(otherConnection => {
                return connection !== otherConnection;
            });
        } else {
            queueTask(() => {
                closeConnection(connection);
            });
        }
    };

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-interface
    class FDBDatabase extends FakeEventTarget {
        _closePending = false;
        _closed = false;
        _runningVersionchangeTransaction = false;
        constructor(rawDatabase) {
            super();
            this._rawDatabase = rawDatabase;
            this._rawDatabase.connections.push(this);
            this.name = rawDatabase.name;
            this.version = rawDatabase.version;
            this.objectStoreNames = new FakeDOMStringList(...Array.from(rawDatabase.rawObjectStores.keys()).sort());
        }

        // http://w3c.github.io/IndexedDB/#dom-idbdatabase-createobjectstore
        createObjectStore(name, options = {}) {
            if (name === undefined) {
                throw new TypeError();
            }
            const transaction = confirmActiveVersionchangeTransaction(this);
            const keyPath = options !== null && options.keyPath !== undefined ? options.keyPath : null;
            const autoIncrement = options !== null && options.autoIncrement !== undefined ? options.autoIncrement : false;
            if (keyPath !== null) {
                validateKeyPath(keyPath);
            }
            if (this._rawDatabase.rawObjectStores.has(name)) {
                throw new ConstraintError();
            }
            if (autoIncrement && (keyPath === "" || Array.isArray(keyPath))) {
                throw new InvalidAccessError();
            }
            const objectStoreNames = [...this.objectStoreNames];
            transaction._rollbackLog.push(() => {
                const objectStore = this._rawDatabase.rawObjectStores.get(name);
                if (objectStore) {
                    objectStore.deleted = true;
                }
                this.objectStoreNames = new FakeDOMStringList(...objectStoreNames);
                transaction._scope.delete(name);
                this._rawDatabase.rawObjectStores.delete(name);
            });
            const rawObjectStore = new ObjectStore(this._rawDatabase, name, keyPath, autoIncrement);
            this.objectStoreNames._push(name);
            this.objectStoreNames._sort();
            transaction._scope.add(name);
            this._rawDatabase.rawObjectStores.set(name, rawObjectStore);
            transaction.objectStoreNames = new FakeDOMStringList(...this.objectStoreNames);
            return transaction.objectStore(name);
        }
        deleteObjectStore(name) {
            if (name === undefined) {
                throw new TypeError();
            }
            const transaction = confirmActiveVersionchangeTransaction(this);
            const store = this._rawDatabase.rawObjectStores.get(name);
            if (store === undefined) {
                throw new NotFoundError();
            }
            this.objectStoreNames = new FakeDOMStringList(...Array.from(this.objectStoreNames).filter(objectStoreName => {
                return objectStoreName !== name;
            }));
            transaction.objectStoreNames = new FakeDOMStringList(...this.objectStoreNames);
            transaction._rollbackLog.push(() => {
                store.deleted = false;
                this._rawDatabase.rawObjectStores.set(name, store);
                this.objectStoreNames._push(name);
                this.objectStoreNames._sort();
            });
            store.deleted = true;
            this._rawDatabase.rawObjectStores.delete(name);
            transaction._objectStoresCache.delete(name);
        }
        transaction(storeNames, mode) {
            mode = mode !== undefined ? mode : "readonly";
            if (mode !== "readonly" && mode !== "readwrite" && mode !== "versionchange") {
                throw new TypeError("Invalid mode: " + mode);
            }
            const hasActiveVersionchange = this._rawDatabase.transactions.some(transaction => {
                return transaction._state === "active" && transaction.mode === "versionchange" && transaction.db === this;
            });
            if (hasActiveVersionchange) {
                throw new InvalidStateError();
            }
            if (this._closePending) {
                throw new InvalidStateError();
            }
            if (!Array.isArray(storeNames)) {
                storeNames = [storeNames];
            }
            if (storeNames.length === 0 && mode !== "versionchange") {
                throw new InvalidAccessError();
            }
            for (const storeName of storeNames) {
                if (!this.objectStoreNames.contains(storeName)) {
                    throw new NotFoundError("No objectStore named " + storeName + " in this database");
                }
            }
            const tx = new FDBTransaction(storeNames, mode, this);
            this._rawDatabase.transactions.push(tx);
            this._rawDatabase.processTransactions(); // See if can start right away (async)

            return tx;
        }
        close() {
            closeConnection(this);
        }
        toString() {
            return "[object IDBDatabase]";
        }
    } class FDBOpenDBRequest extends FDBRequest {
        onupgradeneeded = null;
        onblocked = null;
        toString() {
            return "[object IDBOpenDBRequest]";
        }
    } class FDBVersionChangeEvent extends Event {
        constructor(type, parameters = {}) {
            super(type);
            this.newVersion = parameters.newVersion !== undefined ? parameters.newVersion : null;
            this.oldVersion = parameters.oldVersion !== undefined ? parameters.oldVersion : 0;
        }
        toString() {
            return "[object IDBVersionChangeEvent]";
        }
    }// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-database
    class Database {
        deletePending = false;
        transactions = [];
        rawObjectStores = new Map();
        connections = [];
        constructor(name, version) {
            this.name = name;
            this.version = version;
            this.processTransactions = this.processTransactions.bind(this);
        }
        processTransactions() {
            queueTask(() => {
                const anyRunning = this.transactions.some(transaction => {
                    return transaction._started && transaction._state !== "finished";
                });
                if (!anyRunning) {
                    const next = this.transactions.find(transaction => {
                        return !transaction._started && transaction._state !== "finished";
                    });
                    if (next) {
                        next.addEventListener("complete", this.processTransactions);
                        next.addEventListener("abort", this.processTransactions);
                        next._start();
                    }
                }
            });
        }
    } const waitForOthersClosedDelete = (databases, name, openDatabases, cb) => {
        const anyOpen = openDatabases.some(openDatabase2 => {
            return !openDatabase2._closed && !openDatabase2._closePending;
        });
        if (anyOpen) {
            queueTask(() => waitForOthersClosedDelete(databases, name, openDatabases, cb));
            return;
        }
        databases.delete(name);
        cb(null);
    };

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-deleting-a-database
    const deleteDatabase = (databases, name, request, cb) => {
        try {
            const db = databases.get(name);
            if (db === undefined) {
                cb(null);
                return;
            }
            db.deletePending = true;
            const openDatabases = db.connections.filter(connection => {
                return !connection._closed && !connection._closePending;
            });
            for (const openDatabase2 of openDatabases) {
                if (!openDatabase2._closePending) {
                    const event = new FDBVersionChangeEvent("versionchange", {
                        newVersion: null,
                        oldVersion: db.version
                    });
                    openDatabase2.dispatchEvent(event);
                }
            }
            const anyOpen = openDatabases.some(openDatabase3 => {
                return !openDatabase3._closed && !openDatabase3._closePending;
            });
            if (request && anyOpen) {
                const event = new FDBVersionChangeEvent("blocked", {
                    newVersion: null,
                    oldVersion: db.version
                });
                request.dispatchEvent(event);
            }
            waitForOthersClosedDelete(databases, name, openDatabases, cb);
        } catch (err) {
            cb(err);
        }
    };

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-running-a-versionchange-transaction
    const runVersionchangeTransaction = (connection, version, request, cb) => {
        connection._runningVersionchangeTransaction = true;
        const oldVersion = connection.version;
        const openDatabases = connection._rawDatabase.connections.filter(otherDatabase => {
            return connection !== otherDatabase;
        });
        for (const openDatabase2 of openDatabases) {
            if (!openDatabase2._closed && !openDatabase2._closePending) {
                const event = new FDBVersionChangeEvent("versionchange", {
                    newVersion: version,
                    oldVersion
                });
                openDatabase2.dispatchEvent(event);
            }
        }
        const anyOpen = openDatabases.some(openDatabase3 => {
            return !openDatabase3._closed && !openDatabase3._closePending;
        });
        if (anyOpen) {
            const event = new FDBVersionChangeEvent("blocked", {
                newVersion: version,
                oldVersion
            });
            request.dispatchEvent(event);
        }
        const waitForOthersClosed = () => {
            const anyOpen2 = openDatabases.some(openDatabase2 => {
                return !openDatabase2._closed && !openDatabase2._closePending;
            });
            if (anyOpen2) {
                queueTask(waitForOthersClosed);
                return;
            }

            // Set the version of database to version. This change is considered part of the transaction, and so if the
            // transaction is aborted, this change is reverted.
            connection._rawDatabase.version = version;
            connection.version = version;

            // Get rid of this setImmediate?
            const transaction = connection.transaction(connection.objectStoreNames, "versionchange");
            request.result = connection;
            request.readyState = "done";
            request.transaction = transaction;
            transaction._rollbackLog.push(() => {
                connection._rawDatabase.version = oldVersion;
                connection.version = oldVersion;
            });
            const event = new FDBVersionChangeEvent("upgradeneeded", {
                newVersion: version,
                oldVersion
            });
            request.dispatchEvent(event);
            transaction.addEventListener("error", () => {
                connection._runningVersionchangeTransaction = false;
                // throw arguments[0].target.error;
                // console.log("error in versionchange transaction - not sure if anything needs to be done here", e.target.error.name);
            });
            transaction.addEventListener("abort", () => {
                connection._runningVersionchangeTransaction = false;
                request.transaction = null;
                queueTask(() => {
                    cb(new AbortError());
                });
            });
            transaction.addEventListener("complete", () => {
                connection._runningVersionchangeTransaction = false;
                request.transaction = null;
                // Let other complete event handlers run before continuing
                queueTask(() => {
                    if (connection._closePending) {
                        cb(new AbortError());
                    } else {
                        cb(null);
                    }
                });
            });
        };
        waitForOthersClosed();
    };

    // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-opening-a-database
    const openDatabase = (databases, name, version, request, cb) => {
        let db = databases.get(name);
        if (db === undefined) {
            db = new Database(name, 0);
            databases.set(name, db);
        }
        if (version === undefined) {
            version = db.version !== 0 ? db.version : 1;
        }
        if (db.version > version) {
            return cb(new VersionError());
        }
        const connection = new FDBDatabase(db);
        if (db.version < version) {
            runVersionchangeTransaction(connection, version, request, err => {
                if (err) {
                    // DO THIS HERE: ensure that connection is closed by running the steps for closing a database connection before these
                    // steps are aborted.
                    return cb(err);
                }
                cb(null, connection);
            });
        } else {
            cb(null, connection);
        }
    };
    class FDBFactory {
        cmp = cmp;
        _databases = new Map();

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-deleteDatabase-IDBOpenDBRequest-DOMString-name
        deleteDatabase(name) {
            const request = new FDBOpenDBRequest();
            request.source = null;
            queueTask(() => {
                const db = this._databases.get(name);
                const oldVersion = db !== undefined ? db.version : 0;
                deleteDatabase(this._databases, name, request, err => {
                    if (err) {
                        request.error = new DOMException(err.message, err.name);
                        request.readyState = "done";
                        const event = new Event("error", {
                            bubbles: true,
                            cancelable: true
                        });
                        event.eventPath = [];
                        request.dispatchEvent(event);
                        return;
                    }
                    request.result = undefined;
                    request.readyState = "done";
                    const event2 = new FDBVersionChangeEvent("success", {
                        newVersion: null,
                        oldVersion
                    });
                    request.dispatchEvent(event2);
                });
            });
            return request;
        }

        // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-open-IDBOpenDBRequest-DOMString-name-unsigned-long-long-version
        open(name, version) {
            if (arguments.length > 1 && version !== undefined) {
                // Based on spec, not sure why "MAX_SAFE_INTEGER" instead of "unsigned long long", but it's needed to pass
                // tests
                version = enforceRange(version, "MAX_SAFE_INTEGER");
            }
            if (version === 0) {
                throw new TypeError();
            }
            const request = new FDBOpenDBRequest();
            request.source = null;
            queueTask(() => {
                openDatabase(this._databases, name, version, request, (err, connection) => {
                    if (err) {
                        request.result = undefined;
                        request.readyState = "done";
                        request.error = new DOMException(err.message, err.name);
                        const event = new Event("error", {
                            bubbles: true,
                            cancelable: true
                        });
                        event.eventPath = [];
                        request.dispatchEvent(event);
                        return;
                    }
                    request.result = connection;
                    request.readyState = "done";
                    const event2 = new Event("success");
                    event2.eventPath = [];
                    request.dispatchEvent(event2);
                });
            });
            return request;
        }

        // https://w3c.github.io/IndexedDB/#dom-idbfactory-databases
        databases() {
            return new Promise(resolve => {
                const result = [];
                for (const [name, database] of this._databases) {
                    result.push({
                        name,
                        version: database.version
                    });
                }
                resolve(result);
            });
        }
        toString() {
            return "[object IDBFactory]";
        }
    } const fakeIndexedDB = new FDBFactory();// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- any function
    function createFakeNativeFunction(cb) {
        const fnName = cb.name || '';
        const toStringFn = () => `function ${fnName}() { [native code] }`;
        Object.defineProperty(cb, 'toString', {
            value: toStringFn,
            writable: true,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(cb, 'toLocaleString', {
            value: toStringFn,
            writable: true,
            configurable: false,
            enumerable: false
        });
        return cb;
    } const DEFUSED_INDEXEDDB = new Set([
        'PLAYER__LOG',
        'MIRROR_TRACK_V2',
        'pbp3',
        'BILI_MIRROR_REPORT_POOL',
        'BILI_MIRROR_RESOURCE_TIME',
        'bp_nc_loader_config'
    ]);
    const defusedPatterm = e$1([
        'MIRROR_TRACK',
        '__LOG',
        'BILI_MIRROR_REPORT_POOL',
        'BILI_MIRROR_RESOURCE_TIME',
        'reporter-pb',
        'pbp3',
        'pcdn',
        'nc_loader',
        'iconify'
    ]).toRe();
    function hook() {
        if (localStorage.getItem('bilibili_player_force_DolbyAtmos&8K&HDR') !== '1') {
            localStorage.setItem('bilibili_player_force_DolbyAtmos&8K&HDR', '1');
        }
        if (localStorage.getItem('bilibili_player_force_hdr') !== '1') {
            localStorage.setItem('bilibili_player_force_hdr', '1');
        }
        ((sessionStorageGetItem) => {
            sessionStorage.getItem = function (key) {
                // 部分視頻解碼錯誤後會強制全局回退，禁用所有HEVC內容
                // 此hook禁用對應邏輯
                if (key === 'enableHEVCError') {
                    return null;
                }
                return Reflect.apply(sessionStorageGetItem, this, [
                    key
                ]);
            };
            // eslint-disable-next-line @typescript-eslint/unbound-method -- cache origin method
        })(sessionStorage.getItem);
        // Bilibili use User-Agent to determine if the 4K should be avaliable, we simply overrides UA
        defineReadonlyProperty(unsafeWindow.navigator, 'userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15');
    }
    const forceEnable4K = {
        name: 'force-enable-4k',
        description: '强制启用 4K 播放',
        onVideo: hook,
        onBangumi: hook,
        onLive: hook
    }; ((unsafeWindow1) => {
        const modules = [
            defuseSpyware,
            enhanceLive,
            fixCopyInCV,
            forceEnable4K,
            noAd,
            noP2P,
            noWebRTC,
            optimizeHomepage,
            optimizeStory,
            playerVideoFit,
            removeBlackBackdropFilter,
            removeUselessUrlParams,
            useSystemFonts
        ];
        const styles = [];
        const onBeforeFetchHooks = new Set();
        const onResponseHooks = new Set();
        const onXhrOpenHooks = new Set();
        const onAfterXhrOpenHooks = new Set();
        const onXhrResponseHooks = new Set();
        const fnWs = new WeakSet();
        function onlyCallOnce(fn) {
            if (fnWs.has(fn)) {
                return;
            }
            fnWs.add(fn);
            fn();
        }
        const hook = {
            addStyle(style) {
                styles.push(style);
            },
            onBeforeFetch(cb) {
                onBeforeFetchHooks.add(cb);
            },
            onResponse(cb) {
                onResponseHooks.add(cb);
            },
            onXhrOpen(cb) {
                onXhrOpenHooks.add(cb);
            },
            onAfterXhrOpen(cb) {
                onAfterXhrOpenHooks.add(cb);
            },
            onXhrResponse(cb) {
                onXhrResponseHooks.add(cb);
            },
            onlyCallOnce
        };
        const hostname = unsafeWindow1.location.hostname;
        const pathname = unsafeWindow1.location.pathname;
        for (const module of modules) {
            if (module.any) {
                logger.log(`[${module.name}] "any" ${unsafeWindow1.location.href}`);
                module.any(hook);
            }
            switch (hostname) {
                case 'www.bilibili.com':
                    {
                        if (pathname.startsWith('/read/cv')) {
                            if (module.onCV) {
                                logger.log(`[${module.name}] "onCV" ${unsafeWindow1.location.href}`);
                                module.onCV(hook);
                            }
                        } else if (pathname.startsWith('/video/')) {
                            if (module.onVideo) {
                                logger.log(`[${module.name}] "onVideo" ${unsafeWindow1.location.href}`);
                                module.onVideo(hook);
                            }
                            if (module.onVideoOrBangumi) {
                                logger.log(`[${module.name}] "onVideoOrBangumi" ${unsafeWindow1.location.href}`);
                                module.onVideoOrBangumi(hook);
                            }
                        } else if (pathname.startsWith('/bangumi/play/')) {
                            if (module.onVideo) {
                                logger.log(`[${module.name}] "onVideo" ${unsafeWindow1.location.href}`);
                                module.onVideo(hook);
                            }
                            if (module.onBangumi) {
                                logger.log(`[${module.name}] "onBangumi" ${unsafeWindow1.location.href}`);
                                module.onBangumi(hook);
                            }
                            if (module.onVideoOrBangumi) {
                                logger.log(`[${module.name}] "onVideoOrBangumi" ${unsafeWindow1.location.href}`);
                                module.onVideoOrBangumi(hook);
                            }
                        }
                        break;
                    }
                case 'live.bilibili.com':
                    {
                        if (module.onLive) {
                            logger.log(`[${module.name}] "onLive" ${unsafeWindow1.location.href}`);
                            module.onLive(hook);
                        }
                        break;
                    }
                case 't.bilibili.com':
                    {
                        if (module.onStory) {
                            logger.log(`[${module.name}] "onStory" ${unsafeWindow1.location.href}`);
                            module.onStory(hook);
                        }
                        break;
                    }
            }
        }
        // Add Style
        onDOMContentLoaded(() => {
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = styles.join('\n');
            head.appendChild(style);
        });
        // Override fetch
        (($fetch) => {
            unsafeWindow1.fetch = async function (...$fetchArgs) {
                let abortFetch = false;
                let fetchArgs = $fetchArgs;
                let mockResponse = null;
                for (const obBeforeFetch of onBeforeFetchHooks) {
                    try {
                        fetchArgs = obBeforeFetch($fetchArgs);
                        if (fetchArgs === null) {
                            abortFetch = true;
                            break;
                        } else if ('body' in fetchArgs) {
                            abortFetch = true;
                            mockResponse = fetchArgs;
                            break;
                        }
                    } catch (e) {
                        logger.error('Failed to replace fetcherArgs', e, {
                            fetchArgs: $fetchArgs
                        });
                    }
                }
                if (abortFetch) {
                    logger.log('Fetch aborted', {
                        fetchArgs: $fetchArgs,
                        mockResponse
                    });
                    return mockResponse ?? new Response();
                }
                let response = await Reflect.apply($fetch, this, $fetchArgs);
                for (const onResponse of onResponseHooks) {
                    // eslint-disable-next-line no-await-in-loop -- hook
                    response = await onResponse(response, $fetchArgs, $fetch);
                }
                return response;
            };
        })(unsafeWindow1.fetch);
        const xhrInstances = new WeakMap();
        const XHRBefore = unsafeWindow1.XMLHttpRequest.prototype;
        unsafeWindow1.XMLHttpRequest = class extends unsafeWindow1.XMLHttpRequest {
            open(...$args) {
                const method = $args[0];
                const url = $args[1];
                const xhrDetails = {
                    method,
                    url,
                    response: null,
                    lastResponseLength: null
                };
                let xhrArgs = $args;
                for (const onXhrOpen of onXhrOpenHooks) {
                    try {
                        if (xhrArgs === null) {
                            break;
                        }
                        xhrArgs = onXhrOpen(xhrArgs, this);
                    } catch (e) {
                        logger.error('Failed to replace P2P for XMLHttpRequest.prototype.open', e);
                    }
                }
                if (xhrArgs === null) {
                    logger.log('XHR aborted', {
                        $args
                    });
                    this.send = o$1;
                    this.setRequestHeader = o$1;
                    return;
                }
                xhrInstances.set(this, xhrDetails);
                super.open(...xhrArgs);
                for (const onAfterXhrOpen of onAfterXhrOpenHooks) {
                    try {
                        onAfterXhrOpen(this);
                    } catch (e) {
                        logger.error('Failed to call onAfterXhrOpen', e);
                    }
                }
            }
            get response() {
                const originalResponse = super.response;
                if (!xhrInstances.has(this)) {
                    return originalResponse;
                }
                const xhrDetails = xhrInstances.get(this);
                const responseLength = typeof originalResponse === 'string' ? originalResponse.length : null;
                if (xhrDetails.lastResponseLength !== responseLength) {
                    xhrDetails.response = null;
                    xhrDetails.lastResponseLength = responseLength;
                }
                if (xhrDetails.response !== null) {
                    return xhrDetails.response;
                }
                let finalResponse = originalResponse;
                for (const onXhrResponse of onXhrResponseHooks) {
                    try {
                        finalResponse = onXhrResponse(xhrDetails.method, xhrDetails.url, finalResponse, this);
                    } catch (e) {
                        logger.error('Failed to call onXhrResponse', e);
                    }
                }
                xhrDetails.response = finalResponse;
                return finalResponse;
            }
            get responseText() {
                const response = this.response;
                return typeof response === 'string' ? response : super.responseText;
            }
        };
        unsafeWindow1.XMLHttpRequest.prototype.open.toString = function () {
            return XHRBefore.open.toString();
        };
        unsafeWindow1.XMLHttpRequest.prototype.send.toString = function () {
            return XHRBefore.send.toString();
        };
        // unsafeWindow.XMLHttpRequest.prototype.getResponseHeader.toString = function () {
        //   return XHRBefore.getResponseHeader.toString();
        // };
        // unsafeWindow.XMLHttpRequest.prototype.getAllResponseHeaders.toString = function () {
        //   return XHRBefore.getAllResponseHeaders.toString();
        // };
    })(unsafeWindow);
})();