// ==UserScript==
// @name         BiliSub - 哔哩哔哩字幕下载工具
// @namespace    https://github.com/ShinoharaHaruna/bilisub
// @version      1.1.1
// @description  在哔哩哔哩页面直接下载字幕，支持AI字幕和普通字幕
// @author       Shinohara Haruna
// @match        *://*.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect      api.bilibili.com
// @connect      aisubtitle.hdslb.com
// @connect      *.hdslb.com
// @connect      *.bilivideo.com
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562552/BiliSub%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/562552/BiliSub%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
// 工具函数
function sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*]/g, "_").trim();
}
function extractBVID(input) {
    const match = input.match(/BV[a-zA-Z0-9]+/);
    return match ? match[0] : "";
}
function md5(input) {
    function rotateLeft(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
    }
    function addUnsigned(x, y) {
        const x4 = x & 0x40000000;
        const y4 = y & 0x40000000;
        const x8 = x & 0x80000000;
        const y8 = y & 0x80000000;
        const result = (x & 0x3fffffff) + (y & 0x3fffffff);
        if (x4 & y4) {
            return result ^ 0x80000000 ^ x8 ^ y8;
        }
        if (x4 | y4) {
            if (result & 0x40000000) {
                return result ^ 0xc0000000 ^ x8 ^ y8;
            }
            return result ^ 0x40000000 ^ x8 ^ y8;
        }
        return result ^ x8 ^ y8;
    }
    function F(x, y, z) {
        return (x & y) | (~x & z);
    }
    function G(x, y, z) {
        return (x & z) | (y & ~z);
    }
    function H(x, y, z) {
        return x ^ y ^ z;
    }
    function I(x, y, z) {
        return y ^ (x | ~z);
    }
    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function convertToWordArray(str) {
        const msgLength = str.length;
        const wordArray = [];
        let i;
        for (i = 0; i < msgLength; i++) {
            const byte = str.charCodeAt(i);
            wordArray[i >> 2] = wordArray[i >> 2] || 0;
            wordArray[i >> 2] |= byte << ((i % 4) * 8);
        }
        wordArray[i >> 2] = wordArray[i >> 2] || 0;
        wordArray[i >> 2] |= 0x80 << ((i % 4) * 8);
        wordArray[(((msgLength + 64) >>> 9) << 4) + 14] = msgLength * 8;
        wordArray[(((msgLength + 64) >>> 9) << 4) + 15] = 0;
        return wordArray;
    }
    function wordToHex(value) {
        let hex = "";
        for (let i = 0; i <= 3; i++) {
            const byte = (value >>> (i * 8)) & 255;
            const temp = "0" + byte.toString(16);
            hex += temp.slice(temp.length - 2);
        }
        return hex;
    }
    function utf8Encode(str) {
        return unescape(encodeURIComponent(str));
    }
    const x = convertToWordArray(utf8Encode(input));
    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;
    for (let k = 0; k < x.length; k += 16) {
        const aa = a;
        const bb = b;
        const cc = c;
        const dd = d;
        a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478);
        d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
        c = FF(c, d, a, b, x[k + 2], 17, 0x242070db);
        b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
        a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
        d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a);
        c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613);
        b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
        a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8);
        d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
        c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
        b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
        a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122);
        d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193);
        c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e);
        b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);
        a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562);
        d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340);
        c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51);
        b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
        a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d);
        d = GG(d, a, b, c, x[k + 10], 9, 0x02441453);
        c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
        b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
        a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
        d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6);
        c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
        b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
        a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
        d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
        c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9);
        b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);
        a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942);
        d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681);
        c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
        b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
        a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44);
        d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
        c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
        b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
        a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
        d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
        c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
        b = HH(b, c, d, a, x[k + 6], 23, 0x04881d05);
        a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
        d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
        c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
        b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);
        a = II(a, b, c, d, x[k + 0], 6, 0xf4292244);
        d = II(d, a, b, c, x[k + 7], 10, 0x432aff97);
        c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7);
        b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
        a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3);
        d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
        c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d);
        b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
        a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
        d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
        c = II(c, d, a, b, x[k + 6], 15, 0xa3014314);
        b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
        a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82);
        d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235);
        c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
        b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);
        a = addUnsigned(a, aa);
        b = addUnsigned(b, bb);
        c = addUnsigned(c, cc);
        d = addUnsigned(d, dd);
    }
    return (wordToHex(a) +
        wordToHex(b) +
        wordToHex(c) +
        wordToHex(d)).toLowerCase();
}
// B站 API 客户端
class BilibiliAPI {
    static async getVideoInfo(bvid) {
        const url = `${this.BASE_URL}/x/web-interface/view?bvid=${bvid}`;
        const data = await this.requestJson(url);
        if (data.code !== 0) {
            throw new Error(`API错误: ${data.message}`);
        }
        return {
            bvid: data.data.bvid,
            title: data.data.title,
            cid: data.data.cid,
            duration: data.data.duration,
            pages: data.data.pages,
        };
    }
    static async getSubtitle(subtitleURL, sessdata) {
        const url = subtitleURL.startsWith("//")
            ? `https:${subtitleURL}`
            : subtitleURL;
        const host = (() => {
            try {
                return new URL(url).hostname;
            }
            catch {
                return url;
            }
        })();
        if (typeof GM_xmlhttpRequest === "function") {
            return new Promise((resolve, reject) => {
                let settled = false;
                const finish = (handler) => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    clearTimeout(timer);
                    handler();
                };
                const timer = window.setTimeout(() => {
                    finish(() => reject(new Error(`请求 ${host} 超时或被拦截，请确认脚本已允许访问该域名（@connect）。`)));
                }, 10000);
                try {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url,
                        headers: {
                            "User-Agent": this.USER_AGENT,
                            Referer: "https://www.bilibili.com",
                            Accept: "application/json",
                            ...(sessdata ? { Cookie: `SESSDATA=${sessdata}` } : {}),
                        },
                        responseType: "text",
                        onload: (response) => {
                            finish(() => {
                                if (response.status >= 200 && response.status < 300) {
                                    try {
                                        const parsed = JSON.parse(response.responseText);
                                        resolve(parsed);
                                    }
                                    catch (error) {
                                        reject(error);
                                    }
                                }
                                else {
                                    reject(new Error(`请求失败，状态码：${response.status} ${response.statusText}`));
                                }
                            });
                        },
                        onerror: (response) => {
                            finish(() => reject(new Error(`请求失败，状态码：${response.status} ${response.statusText || ""}`.trim())));
                        },
                        ontimeout: () => {
                            finish(() => reject(new Error("请求超时")));
                        },
                    });
                }
                catch (error) {
                    finish(() => reject(new Error(`Tampermonkey 拒绝访问 ${host}，请在脚本头部添加对应 @connect 并重新安装。原始错误: ${error instanceof Error ? error.message : String(error)}`)));
                }
            });
        }
        const response = await this.fetchWithHeaders(url, sessdata);
        const data = await response.json();
        return data;
    }
    static async getAvailableSubtitles(cid, bvid, sessdata) {
        const url = await this.buildWbiUrl("/x/player/wbi/v2", { cid, bvid }, sessdata);
        const data = await this.requestJson(url, sessdata);
        if (data.code !== 0) {
            throw new Error(`API错误: ${data.message}`);
        }
        return data.data.subtitle.subtitles;
    }
    static async buildWbiUrl(path, params, sessdata) {
        const query = await this.getSignedQuery(params, sessdata);
        return `${this.BASE_URL}${path}?${query}`;
    }
    static async fetchWithHeaders(url, sessdata) {
        const headers = {
            "User-Agent": this.USER_AGENT,
            Referer: "https://www.bilibili.com",
        };
        if (sessdata) {
            headers["Cookie"] = `SESSDATA=${sessdata}`;
        }
        return fetch(url, {
            headers,
            credentials: "include",
        });
    }
    static async requestJson(url, sessdata) {
        const headers = {
            "User-Agent": this.USER_AGENT,
            Referer: "https://www.bilibili.com",
            Accept: "application/json",
        };
        if (typeof GM_xmlhttpRequest === "function") {
            return new Promise((resolve, reject) => {
                const gmHeaders = { ...headers };
                if (sessdata) {
                    gmHeaders["Cookie"] = `SESSDATA=${sessdata}`;
                }
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    headers: gmHeaders,
                    responseType: "text",
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const parsed = JSON.parse(response.responseText);
                                resolve(parsed);
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                        else {
                            reject(new Error(`请求失败，状态码：${response.status} ${response.statusText}`));
                        }
                    },
                    onerror: (response) => {
                        reject(new Error(`请求失败，状态码：${response.status} ${response.statusText || ""}`.trim()));
                    },
                    ontimeout: () => {
                        reject(new Error("请求超时"));
                    },
                });
            });
        }
        const response = await fetch(url, {
            headers,
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
        }
        return (await response.json());
    }
    static sanitizeParamValue(value) {
        return String(value).replace(/[!'()*]/g, "");
    }
    static async getSignedQuery(params, sessdata) {
        const mixinKey = await this.ensureWbiMixinKey(sessdata);
        const entries = Object.entries(params).map(([key, value]) => [key, this.sanitizeParamValue(value)]);
        entries.push(["wts", String(Math.floor(Date.now() / 1000))]);
        entries.sort((a, b) => a[0].localeCompare(b[0]));
        const query = entries
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join("&");
        const wRid = md5(query + mixinKey);
        return `${query}&w_rid=${wRid}`;
    }
    static async ensureWbiMixinKey(sessdata) {
        const now = Date.now();
        if (this.wbiMixinKey &&
            now - this.wbiMixinKeyFetchedAt < this.WBI_CACHE_TTL) {
            return this.wbiMixinKey;
        }
        const navResp = await this.requestJson(`${this.BASE_URL}/x/web-interface/nav`, sessdata);
        const imgKey = this.extractKeyFromUrl(navResp.data.wbi_img?.img_url);
        const subKey = this.extractKeyFromUrl(navResp.data.wbi_img?.sub_url);
        if (!imgKey || !subKey) {
            throw new Error("无法获取 WBI 密钥，请稍后重试");
        }
        const rawKey = `${imgKey}${subKey}`;
        const mixinKey = this.deriveMixinKey(rawKey);
        this.wbiMixinKey = mixinKey;
        this.wbiMixinKeyFetchedAt = now;
        return mixinKey;
    }
    static deriveMixinKey(rawKey) {
        const chars = this.MIXIN_KEY_ENC_TAB.map((idx) => rawKey[idx] || "").join("");
        return chars.slice(0, 32);
    }
    static extractKeyFromUrl(url) {
        if (!url) {
            return null;
        }
        const match = url.match(/\/([^/]+)\.(?:png|jpg|jpeg)$/i);
        return match ? match[1] : null;
    }
}
BilibiliAPI.BASE_URL = "https://api.bilibili.com";
BilibiliAPI.USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
BilibiliAPI.MIXIN_KEY_ENC_TAB = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
    33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
    61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
    36, 20, 34, 44, 52,
];
BilibiliAPI.wbiMixinKey = null;
BilibiliAPI.wbiMixinKeyFetchedAt = 0;
BilibiliAPI.WBI_CACHE_TTL = 10 * 60 * 1000;
class BiliSub {
    constructor() {
        this.videoInfo = null;
        this.bvid = "";
        this.cid = 0;
        this.downloadBtn = null;
        this.toolbarEntryId = "bilisub-toolbar-entry";
        this.sessdataStorageKey = "bilisub_sessdata";
        this.subtitlePanel = null;
        this.subtitleTracksContainer = null;
        this.subtitleTimelineContainer = null;
        this.actionDownloadBtn = null;
        this.actionSummaryBtn = null;
        this.actionRefreshBtn = null;
        this.subtitleCache = new Map();
        this.availableSubtitles = [];
        this.currentSubtitleItem = null;
        this.currentSubtitleData = null;
        this.locationSignature = "";
        this.videoChangeWatcher = null;
        this.isHandlingVideoChange = false;
        this.isRefreshingSubtitles = false;
        this.uiScheduleTimer = null;
        this.uiScheduled = false;
        this.entryAttachTimer = null;
        this.entryAttachAttempts = 0;
        this.maxEntryAttachAttempts = 12;
        this.pageWindow =
            typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
        this.locationSignature = this.buildVideoSignature();
        this.registerSessdataBridge();
        this.init();
    }
    async init() {
        this.bvid = extractBVID(window.location.href);
        if (!this.bvid) {
            console.error("无法获取BV号");
            return;
        }
        this.sessdata = this.getSessdata();
        const p = this.getCurrentP();
        try {
            this.videoInfo = await BilibiliAPI.getVideoInfo(this.bvid);
            this.cid = p
                ? this.videoInfo.pages[p - 1]?.cid || this.videoInfo.cid
                : this.videoInfo.cid;
        }
        catch (error) {
            console.error("获取视频信息失败:", error);
            return;
        }
        this.scheduleUI();
        this.startVideoChangeWatcher();
    }
    scheduleUI() {
        if (this.uiScheduled) {
            return;
        }
        this.uiScheduled = true;
        const run = () => {
            if (this.uiScheduleTimer !== null) {
                window.clearTimeout(this.uiScheduleTimer);
                this.uiScheduleTimer = null;
            }
            // Delay a bit more to avoid interfering with Bilibili's Vue mount during page bootstrap.
            this.uiScheduleTimer = window.setTimeout(() => {
                this.setupUI();
            }, 1200);
        };
        if (document.readyState === "complete") {
            run();
            return;
        }
        window.addEventListener("load", () => {
            run();
        }, { once: true });
    }
    getSessdata() {
        const stored = this.getStoredSessdata();
        if (stored) {
            return stored;
        }
        const cookies = document.cookie.split(";").map((c) => c.trim().split("="));
        const sessdata = cookies.find(([name]) => name === "SESSDATA")?.[1];
        return sessdata;
    }
    getStoredSessdata() {
        try {
            if (typeof GM_getValue === "function") {
                const value = GM_getValue(this.sessdataStorageKey, undefined);
                if (value) {
                    return value;
                }
            }
        }
        catch (error) {
            console.warn("读取 GM 存储失败:", error);
        }
        const fallback = localStorage.getItem(this.sessdataStorageKey);
        return fallback ?? undefined;
    }
    saveSessdata(value) {
        const normalized = value.trim();
        if (!normalized) {
            throw new Error("SESSDATA 不能为空");
        }
        try {
            if (typeof GM_setValue === "function") {
                GM_setValue(this.sessdataStorageKey, normalized);
            }
            else {
                localStorage.setItem(this.sessdataStorageKey, normalized);
            }
        }
        catch (error) {
            console.error("保存 SESSDATA 失败:", error);
            throw error;
        }
    }
    registerSessdataBridge() {
        this.pageWindow.__BILISUB_SET_SESSDATA = (value) => {
            if (!value) {
                this.showToast("未输入 SESSDATA，已取消保存。");
                return;
            }
            try {
                this.saveSessdata(value);
                this.sessdata = value.trim();
                this.showToast("SESSDATA 已保存，请重新点击下载按钮。");
            }
            catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                this.showToast("保存 SESSDATA 失败: " + errMsg);
            }
        };
    }
    promptSessdataGuide() {
        const existing = document.getElementById("bilisub-sessdata-guide");
        if (existing) {
            existing.remove();
        }
        const overlay = document.createElement("div");
        overlay.id = "bilisub-sessdata-guide";
        overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    `;
        const panel = document.createElement("div");
        panel.style.cssText = `
      width: min(480px, 90vw);
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      padding: 24px;
      color: #222;
    `;
        const title = document.createElement("h3");
        title.textContent = "设置 SESSDATA 以下载字幕";
        title.style.cssText = "margin: 0 0 12px;font-size:18px;";
        const desc = document.createElement("ol");
        desc.style.cssText = "margin:0 0 16px 16px;padding:0;line-height:1.6;";
        desc.innerHTML = `
      <li>打开 DevTools → Application → Cookies → https://www.bilibili.com</li>
      <li>找到名为 <strong>SESSDATA</strong> 的条目，复制 Value</li>
      <li>在控制台执行下面这条命令，并把复制的值粘贴到引号里</li>
    `;
        const command = "window.__BILISUB_SET_SESSDATA('在此粘贴 SESSDATA');";
        const textarea = document.createElement("textarea");
        textarea.value = command;
        textarea.readOnly = true;
        textarea.style.cssText = `
      width: 100%;
      min-height: 80px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      resize: none;
      background: #f7f7f7;
      color: #333;
      box-sizing: border-box;
      margin-bottom: 12px;
    `;
        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex;gap:12px;justify-content:flex-end;";
        const copyBtn = document.createElement("button");
        copyBtn.textContent = "复制命令";
        copyBtn.style.cssText =
            "padding:8px 16px;border:none;border-radius:6px;background:#00aeec;color:#fff;cursor:pointer;";
        copyBtn.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(command);
                copyBtn.textContent = "已复制";
                setTimeout(() => (copyBtn.textContent = "复制命令"), 1500);
            }
            catch {
                textarea.focus();
                textarea.select();
                document.execCommand("copy");
                copyBtn.textContent = "已复制";
                setTimeout(() => (copyBtn.textContent = "复制命令"), 1500);
            }
        });
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "知道了";
        closeBtn.style.cssText =
            "padding:8px 16px;border:none;border-radius:6px;background:#666;color:#fff;cursor:pointer;";
        closeBtn.addEventListener("click", () => overlay.remove());
        btnRow.appendChild(copyBtn);
        btnRow.appendChild(closeBtn);
        panel.appendChild(title);
        panel.appendChild(desc);
        panel.appendChild(textarea);
        panel.appendChild(btnRow);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }
    ensureSessdataAvailable() {
        if (this.sessdata) {
            return true;
        }
        const stored = this.getStoredSessdata();
        if (stored) {
            this.sessdata = stored;
            return true;
        }
        return false;
    }
    showToast(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 18px;
      background: rgba(0,0,0,0.8);
      color: #fff;
      border-radius: 999px;
      font-size: 14px;
      z-index: 1000000;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => (toast.style.opacity = "1"));
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 200);
        }, 2000);
    }
    getCurrentP() {
        const url = new URL(window.location.href);
        const p = url.searchParams.get("p");
        return p ? parseInt(p) : null;
    }
    setupUI() {
        // Ensure we only ever have one toolbar entry in DOM.
        const existing = document.getElementById(this.toolbarEntryId);
        if (existing) {
            this.downloadBtn = existing;
        }
        else {
            this.downloadBtn = this.createDownloadButtonWrap();
        }
        // Clean up any unexpected duplicates (e.g. DOM cloned by SPA/player reload).
        const duplicates = Array.from(document.querySelectorAll(`#${this.toolbarEntryId}`));
        if (duplicates.length > 1) {
            duplicates.slice(1).forEach((el) => el.remove());
        }
        if (this.tryAttachEntryToPlayer()) {
            this.stopEntryAttachTimer();
            return;
        }
        // Fallback: keep a floating entry available.
        this.applyEntryMode("floating");
        if (this.downloadBtn.parentElement !== document.body) {
            document.body.appendChild(this.downloadBtn);
        }
        this.startEntryAttachTimer();
    }
    startEntryAttachTimer() {
        if (this.entryAttachTimer !== null) {
            return;
        }
        this.entryAttachAttempts = 0;
        this.entryAttachTimer = window.setInterval(() => {
            this.entryAttachAttempts += 1;
            if (this.tryAttachEntryToPlayer()) {
                this.stopEntryAttachTimer();
                return;
            }
            if (this.entryAttachAttempts >= this.maxEntryAttachAttempts) {
                this.stopEntryAttachTimer();
            }
        }, 800);
    }
    stopEntryAttachTimer() {
        if (this.entryAttachTimer === null) {
            return;
        }
        window.clearInterval(this.entryAttachTimer);
        this.entryAttachTimer = null;
    }
    tryAttachEntryToPlayer() {
        if (!this.downloadBtn) {
            return false;
        }
        if (this.tryAttachEntryToSubtitleMenu()) {
            return true;
        }
        // Fallback: attach next to the native subtitle control in bpx player.
        const subtitleBtn = document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-subtitle");
        if (!subtitleBtn) {
            return false;
        }
        const container = subtitleBtn.parentElement;
        if (!container) {
            return false;
        }
        this.applyEntryMode("player");
        if (this.downloadBtn.parentElement !== container) {
            container.insertBefore(this.downloadBtn, subtitleBtn.nextSibling);
        }
        return true;
    }
    tryAttachEntryToSubtitleMenu() {
        if (!this.downloadBtn) {
            return false;
        }
        const menuOrigin = document.querySelector(".bpx-player-ctrl-subtitle-menu-origin");
        if (!menuOrigin) {
            return false;
        }
        const anchor = menuOrigin.querySelector(".bpx-player-ctrl-subtitle-setting");
        if (!anchor || !anchor.parentElement) {
            return false;
        }
        const menuItem = anchor.cloneNode(true) || null;
        if (!menuItem) {
            return false;
        }
        menuItem.id = this.toolbarEntryId;
        menuItem.classList.add("bilisub-menu-entry");
        menuItem.setAttribute("aria-label", "BiliSub 字幕下载");
        menuItem.tabIndex = 0;
        const text = menuItem.querySelector(".bpx-player-ctrl-subtitle-setting-text");
        if (text) {
            text.textContent = "字幕下载";
        }
        else {
            menuItem.textContent = "字幕下载";
        }
        menuItem.addEventListener("click", (event) => {
            event.stopPropagation();
            this.toggleSubtitlePanel();
        });
        if (this.downloadBtn !== menuItem) {
            this.downloadBtn.replaceWith(menuItem);
            this.downloadBtn = menuItem;
        }
        if (this.downloadBtn.parentElement !== anchor.parentElement) {
            anchor.parentElement.insertBefore(this.downloadBtn, anchor);
        }
        const panelWrap = menuOrigin.closest(".bui-panel-wrap");
        if (panelWrap && panelWrap.dataset.bilisubExpanded !== "1") {
            panelWrap.dataset.bilisubExpanded = "1";
            const currentHeight = panelWrap.style.height;
            const match = currentHeight.match(/^(\d+(?:\.\d+)?)px$/);
            if (match) {
                const next = Math.round(Number(match[1]) + 40);
                panelWrap.style.height = `${next}px`;
                const panelItem = panelWrap.querySelector(".bui-panel-item.bui-panel-item-active");
                if (panelItem) {
                    panelItem.style.height = `${next}px`;
                }
            }
        }
        return true;
    }
    applyEntryMode(mode) {
        if (!this.downloadBtn) {
            return;
        }
        const button = this.downloadBtn.querySelector(".bilisub-entry");
        const icon = this.downloadBtn.querySelector(".bilisub-entry-icon");
        const text = this.downloadBtn.querySelector(".bilisub-entry-text");
        if (mode === "menu") {
            this.downloadBtn.className =
                "bpx-player-ctrl-subtitle-setting bilisub-menu-entry";
            this.downloadBtn.removeAttribute("style");
            this.downloadBtn.setAttribute("aria-label", "BiliSub 字幕下载");
            this.downloadBtn.tabIndex = 0;
            if (button) {
                button.style.cssText = "display:flex;align-items:center;width:100%;";
            }
            if (icon) {
                icon.style.display = "none";
            }
            if (text) {
                text.textContent = "字幕下载";
                text.style.cssText = "color:#fff;";
            }
            return;
        }
        if (mode === "player") {
            this.downloadBtn.className = "bpx-player-ctrl-btn bilisub-player-entry";
            this.downloadBtn.removeAttribute("style");
            this.downloadBtn.setAttribute("aria-label", "BiliSub 字幕下载");
            this.downloadBtn.tabIndex = 0;
            if (button) {
                button.removeAttribute("style");
            }
            if (icon) {
                icon.style.removeProperty("display");
            }
            if (text) {
                text.textContent = "字幕";
                text.removeAttribute("style");
            }
            return;
        }
        this.downloadBtn.className = "bilisub-floating-entry";
        this.downloadBtn.style.cssText = `
      position: fixed;
      right: 24px;
      bottom: 120px;
      z-index: 1000000;
    `;
        this.downloadBtn.removeAttribute("aria-label");
        this.downloadBtn.tabIndex = -1;
        if (button) {
            button.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(19, 21, 25, 0.92);
        color: #fff;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 10px 24px rgba(0,0,0,0.28);
        font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        font-size: 13px;
      `;
        }
        if (icon) {
            icon.style.removeProperty("display");
        }
        if (text) {
            text.textContent = "字幕";
            text.removeAttribute("style");
        }
    }
    createDownloadButtonWrap() {
        const wrap = document.createElement("div");
        wrap.id = this.toolbarEntryId;
        wrap.className = "bilisub-floating-entry";
        const button = document.createElement("div");
        button.title = "字幕面板";
        // Avoid Bilibili native classes (e.g. video-download) to prevent shortcut/event collisions.
        button.className = "bilisub-entry";
        button.addEventListener("click", (event) => {
            // Keep subtitle menu stable; only handle our action.
            event.stopPropagation();
            this.toggleSubtitlePanel();
        });
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("width", "28");
        icon.setAttribute("height", "28");
        icon.setAttribute("viewBox", "0 0 28 28");
        icon.setAttribute("class", "bilisub-entry-icon");
        icon.innerHTML =
            '<path d="M14 2C7.37 2 2 7.37 2 14s5.37 12 12 12 12-5.37 12-12S20.63 2 14 2zm-1 16l-4-4h3V9h2v5h3l-4 4z" fill="currentColor"/>';
        const text = document.createElement("span");
        text.className = "bilisub-entry-text";
        text.textContent = "字幕";
        button.appendChild(icon);
        button.appendChild(text);
        wrap.appendChild(button);
        this.downloadBtn = wrap;
        this.applyEntryMode("floating");
        return wrap;
    }
    delay(ms) {
        return new Promise((resolve) => {
            window.setTimeout(resolve, ms);
        });
    }
    startVideoChangeWatcher() {
        if (this.videoChangeWatcher !== null) {
            return;
        }
        this.videoChangeWatcher = window.setInterval(() => {
            const currentSignature = this.buildVideoSignature();
            if (currentSignature !== this.locationSignature) {
                this.locationSignature = currentSignature;
                this.handleVideoChange();
            }
        }, 1500);
    }
    buildVideoSignature() {
        return `${window.location.pathname}${window.location.search}`;
    }
    async handleVideoChange() {
        if (this.isHandlingVideoChange) {
            return;
        }
        this.isHandlingVideoChange = true;
        try {
            const newBvid = extractBVID(window.location.href);
            if (!newBvid) {
                console.warn("[BiliSub] 无法从当前 URL 解析 BV 号，跳过字幕刷新");
                return;
            }
            const partIndex = this.getCurrentP();
            const bvidChanged = newBvid !== this.bvid;
            this.bvid = newBvid;
            if (bvidChanged || !this.videoInfo || this.videoInfo.bvid !== this.bvid) {
                this.videoInfo = await this.getVideoInfo();
            }
            if (!this.videoInfo) {
                return;
            }
            this.cid = partIndex
                ? this.videoInfo.pages[partIndex - 1]?.cid || this.videoInfo.cid
                : this.videoInfo.cid;
            this.subtitleCache.clear();
            this.availableSubtitles = [];
            this.currentSubtitleItem = null;
            this.currentSubtitleData = null;
            const panelVisible = this.subtitlePanel?.classList.contains("bilisub-panel-visible") ??
                false;
            if (panelVisible) {
                await this.refreshSubtitles(false);
                this.showToast("检测到视频切换，字幕已刷新");
            }
        }
        catch (error) {
            console.error("处理视频切换失败:", error);
        }
        finally {
            this.isHandlingVideoChange = false;
        }
    }
    async toggleSubtitlePanel() {
        if (!this.ensureSessdataAvailable()) {
            this.promptSessdataGuide();
            return;
        }
        if (!this.subtitlePanel) {
            this.createSubtitlePanel();
        }
        if (!this.subtitlePanel) {
            return;
        }
        const isVisible = this.subtitlePanel.classList.contains("bilisub-panel-visible");
        if (isVisible) {
            this.subtitlePanel.classList.remove("bilisub-panel-visible");
            return;
        }
        this.subtitlePanel.classList.add("bilisub-panel-visible");
        await this.refreshSubtitles(false);
    }
    ensurePanelStyles() {
        if (document.getElementById("bilisub-panel-styles")) {
            return;
        }
        const style = document.createElement("style");
        style.id = "bilisub-panel-styles";
        style.textContent = `
      .bilisub-panel {
        position: fixed;
        top: 90px;
        right: 24px;
        width: 360px;
        height: min(70vh, 520px);
        background: rgba(19, 21, 25, 0.96);
        color: #f5f5f5;
        border-radius: 16px;
        box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35);
        transform: translateX(110%);
        opacity: 0;
        transition: transform 0.25s ease, opacity 0.25s ease;
        display: flex;
        flex-direction: column;
        z-index: 1000000;
        backdrop-filter: blur(10px);
      }
      .bilisub-panel-visible {
        transform: translateX(0);
        opacity: 1;
      }
      .bilisub-panel-header {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 16px;
        font-weight: 600;
      }
      .bilisub-panel-actions button {
        margin-left: 8px;
        background: rgba(255, 255, 255, 0.08);
        border: none;
        color: #fff;
        border-radius: 999px;
        padding: 6px 14px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s ease;
      }
      .bilisub-panel-actions button:hover {
        background: rgba(255, 255, 255, 0.18);
      }
      .bilisub-close-btn {
        font-size: 18px;
        line-height: 1;
      }
      .bilisub-panel-content {
        flex: 1;
        display: grid;
        grid-template-columns: 140px 1fr;
        overflow: hidden;
      }
      .bilisub-tracks {
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 12px;
        overflow-y: auto;
      }
      .bilisub-track-item {
        display: block;
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 8px;
        border-radius: 10px;
        border: 1px solid transparent;
        background: rgba(255, 255, 255, 0.05);
        color: inherit;
        text-align: left;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
      }
      .bilisub-track-item:hover {
        background: rgba(255, 255, 255, 0.12);
      }
      .bilisub-track-item.active {
        border-color: #00aeec;
        background: rgba(0, 174, 236, 0.15);
      }
      .bilisub-timeline {
        padding: 12px 18px 18px;
        overflow-y: auto;
      }
      .bilisub-line {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .bilisub-line-time {
        font-size: 12px;
        color: #8aa0b8;
        margin-bottom: 4px;
        letter-spacing: 0.5px;
      }
      .bilisub-line-text {
        font-size: 14px;
        line-height: 1.5;
        color: #f2f2f2;
      }
      .bilisub-empty {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
        margin-top: 20px;
      }
    `;
        document.head.appendChild(style);
    }
    createSubtitlePanel() {
        this.ensurePanelStyles();
        const panel = document.createElement("div");
        panel.id = "bilisub-panel";
        panel.className = "bilisub-panel";
        const header = document.createElement("div");
        header.className = "bilisub-panel-header";
        const title = document.createElement("span");
        title.textContent = "字幕";
        const actions = document.createElement("div");
        actions.className = "bilisub-panel-actions";
        this.actionRefreshBtn = document.createElement("button");
        this.actionRefreshBtn.textContent = "刷新";
        this.actionRefreshBtn.addEventListener("click", () => this.refreshSubtitles(true));
        this.actionSummaryBtn = document.createElement("button");
        this.actionSummaryBtn.textContent = "AI 总结";
        this.actionSummaryBtn.addEventListener("click", () => this.showSummaryPlaceholder());
        this.actionDownloadBtn = document.createElement("button");
        this.actionDownloadBtn.textContent = "下载";
        this.actionDownloadBtn.addEventListener("click", () => this.downloadCurrentSubtitle());
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.className = "bilisub-close-btn";
        closeBtn.addEventListener("click", () => {
            panel.classList.remove("bilisub-panel-visible");
        });
        actions.appendChild(this.actionRefreshBtn);
        actions.appendChild(this.actionSummaryBtn);
        actions.appendChild(this.actionDownloadBtn);
        actions.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(actions);
        const content = document.createElement("div");
        content.className = "bilisub-panel-content";
        this.subtitleTracksContainer = document.createElement("div");
        this.subtitleTracksContainer.className = "bilisub-tracks";
        this.subtitleTimelineContainer = document.createElement("div");
        this.subtitleTimelineContainer.className = "bilisub-timeline";
        content.appendChild(this.subtitleTracksContainer);
        content.appendChild(this.subtitleTimelineContainer);
        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);
        this.subtitlePanel = panel;
    }
    async refreshSubtitles(showToastOnSuccess) {
        if (!this.subtitlePanel || this.isRefreshingSubtitles) {
            if (this.isRefreshingSubtitles && showToastOnSuccess) {
                this.showToast("字幕刷新中，请稍候...");
            }
            return;
        }
        this.isRefreshingSubtitles = true;
        if (this.actionRefreshBtn) {
            this.actionRefreshBtn.disabled = true;
            this.actionRefreshBtn.textContent = "刷新中...";
        }
        try {
            if (!this.videoInfo || this.videoInfo.bvid !== this.bvid) {
                this.videoInfo = await this.getVideoInfo();
            }
            if (!this.videoInfo) {
                throw new Error("无法获取视频信息");
            }
            const partIndex = this.getCurrentP();
            this.cid = partIndex
                ? this.videoInfo.pages[partIndex - 1]?.cid || this.videoInfo.cid
                : this.videoInfo.cid;
            this.subtitleCache.clear();
            await this.loadSubtitlePanelData();
            if (showToastOnSuccess) {
                this.showToast("字幕已刷新");
            }
        }
        catch (error) {
            console.error("刷新字幕失败:", error);
            this.showToast("刷新字幕失败，请稍后重试");
        }
        finally {
            this.isRefreshingSubtitles = false;
            if (this.actionRefreshBtn) {
                this.actionRefreshBtn.disabled = false;
                this.actionRefreshBtn.textContent = "刷新";
            }
        }
    }
    async loadSubtitlePanelData() {
        if (!this.subtitleTracksContainer || !this.subtitleTimelineContainer) {
            return;
        }
        this.subtitleTracksContainer.innerHTML =
            '<div class="bilisub-empty">加载字幕列表...</div>';
        const subtitles = await this.getSubtitleList();
        if (subtitles.length === 0) {
            this.subtitleTracksContainer.innerHTML =
                '<div class="bilisub-empty">未找到可用字幕</div>';
            this.subtitleTimelineContainer.innerHTML =
                '<div class="bilisub-empty">无法展示字幕内容</div>';
            return;
        }
        this.renderSubtitleTracks(subtitles);
        const previousSelectedId = this.currentSubtitleItem?.id;
        const defaultSubtitle = (previousSelectedId &&
            subtitles.find((s) => s.id === previousSelectedId)) ??
            subtitles.find((s) => s.lan === "ai-zh") ??
            subtitles[0];
        if (!defaultSubtitle) {
            this.subtitleTimelineContainer.innerHTML =
                '<div class="bilisub-empty">暂无字幕内容</div>';
            return;
        }
        await this.selectSubtitleTrack(defaultSubtitle);
    }
    renderSubtitleTracks(subtitles) {
        if (!this.subtitleTracksContainer) {
            return;
        }
        this.subtitleTracksContainer.innerHTML = "";
        subtitles.forEach((subtitle) => {
            const button = document.createElement("button");
            button.className = "bilisub-track-item";
            button.dataset.subtitleId = String(subtitle.id);
            const isAI = subtitle.lan === "ai-zh";
            button.textContent = `${subtitle.lan_doc || subtitle.lan}${isAI ? " · AI" : ""}`;
            if (this.currentSubtitleItem?.id === subtitle.id) {
                button.classList.add("active");
            }
            button.addEventListener("click", () => this.selectSubtitleTrack(subtitle));
            this.subtitleTracksContainer?.appendChild(button);
        });
    }
    async selectSubtitleTrack(subtitle) {
        this.currentSubtitleItem = subtitle;
        if (this.subtitleTracksContainer) {
            this.subtitleTracksContainer
                .querySelectorAll(".bilisub-track-item")
                .forEach((el) => {
                const button = el;
                button.classList.toggle("active", button.dataset.subtitleId === String(subtitle.id));
            });
        }
        if (this.subtitleTimelineContainer) {
            this.subtitleTimelineContainer.innerHTML =
                '<div class="bilisub-empty">加载字幕内容...</div>';
        }
        const cacheKey = subtitle.subtitle_url;
        if (this.subtitleCache.has(cacheKey)) {
            this.currentSubtitleData = this.subtitleCache.get(cacheKey);
            this.renderSubtitleTimeline();
            return;
        }
        try {
            const data = await BilibiliAPI.getSubtitle(subtitle.subtitle_url, this.sessdata);
            this.subtitleCache.set(cacheKey, data);
            this.currentSubtitleData = data;
            this.renderSubtitleTimeline();
        }
        catch (error) {
            console.error("加载字幕失败:", error, "url:", subtitle.subtitle_url, "lan:", subtitle.lan);
            if (this.subtitleTimelineContainer) {
                this.subtitleTimelineContainer.innerHTML =
                    '<div class="bilisub-empty">加载失败，请重试</div>';
            }
        }
    }
    renderSubtitleTimeline() {
        if (!this.subtitleTimelineContainer) {
            return;
        }
        if (!this.currentSubtitleData || !this.currentSubtitleData.body.length) {
            this.subtitleTimelineContainer.innerHTML =
                '<div class="bilisub-empty">暂无字幕内容</div>';
            return;
        }
        this.subtitleTimelineContainer.innerHTML = "";
        const fragment = document.createDocumentFragment();
        this.currentSubtitleData.body.forEach((line) => {
            const row = document.createElement("div");
            row.className = "bilisub-line";
            const time = document.createElement("div");
            time.className = "bilisub-line-time";
            time.textContent = `${this.formatTime(line.from)} → ${this.formatTime(line.to)}`;
            const text = document.createElement("div");
            text.className = "bilisub-line-text";
            text.textContent = line.content.trim() || "（空）";
            row.appendChild(time);
            row.appendChild(text);
            fragment.appendChild(row);
        });
        this.subtitleTimelineContainer.appendChild(fragment);
    }
    formatTime(seconds) {
        const totalSeconds = Math.floor(seconds);
        const mins = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, "0");
        const secs = Math.floor(totalSeconds % 60)
            .toString()
            .padStart(2, "0");
        return `${mins}:${secs}`;
    }
    async downloadCurrentSubtitle() {
        if (!this.videoInfo) {
            alert("获取视频信息失败");
            return;
        }
        if (!this.currentSubtitleItem || !this.currentSubtitleData) {
            this.showToast("请先选择一个字幕轨道");
            return;
        }
        try {
            const content = this.formatSubtitleContent(this.currentSubtitleData);
            if (!content) {
                alert("该字幕轨道暂无内容");
                return;
            }
            const filename = `${sanitizeFilename(this.videoInfo.title)}_${this.currentSubtitleItem.lan_doc || this.currentSubtitleItem.lan}.txt`;
            this.downloadFile(filename, content);
            this.showToast("字幕下载完成");
        }
        catch (error) {
            console.error("下载字幕失败:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            alert("下载字幕失败: " + errorMessage);
        }
    }
    showSummaryPlaceholder() {
        this.showToast("AI 总结开发中，敬请期待");
    }
    async getVideoInfo() {
        try {
            return await BilibiliAPI.getVideoInfo(this.bvid);
        }
        catch (error) {
            console.error("获取视频信息失败:", error);
            return null;
        }
    }
    async getSubtitleList() {
        try {
            const list = await BilibiliAPI.getAvailableSubtitles(this.cid, this.bvid, this.sessdata);
            this.availableSubtitles = list;
            return list;
        }
        catch (error) {
            console.error("获取字幕列表失败:", error);
            return [];
        }
    }
    formatSubtitleContent(subtitle) {
        if (!subtitle.body || subtitle.body.length === 0) {
            return "";
        }
        return subtitle.body
            .map((line) => line.content.trim())
            .filter((content) => content !== "")
            .join("\n");
    }
    downloadFile(filename, content) {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
(() => {
    if (window.top !== window.self) {
        return;
    }
    const globalObj = typeof unsafeWindow !== "undefined"
        ? unsafeWindow
        : window;
    if (globalObj.__BILISUB_INITIALIZED__) {
        return;
    }
    globalObj.__BILISUB_INITIALIZED__ = true;
    new BiliSub();
})();
