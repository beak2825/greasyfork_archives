// ==UserScript==
// @name         📝ChatGPT5超星学习通高效助手，全自动刷章节视频、章节小测、作业自动完成，AI题目作答，所有题目均可回答
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  使用ChatGPT5镜像服务答题，所有题目均可回答。超星学习通AI作业答题、全自动刷章节、章节测试自动完成。极致简洁，最新可用。
// @author       Daniel
// @match        *://*.chaoxing.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @connect      api.116611.xyz
// @resource     typrMd5Lib https://116611.xyz/typr-md5.js
// @resource     fontTableData https://116611.xyz/table.json
// @license CC-BY-NC-ND-4.0
// @antifeature  payment  脚本存在第三方答题接口付费功能
// @icon          data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/556256/%F0%9F%93%9DChatGPT5%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%AB%98%E6%95%88%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E7%AB%A0%E8%8A%82%E8%A7%86%E9%A2%91%E3%80%81%E7%AB%A0%E8%8A%82%E5%B0%8F%E6%B5%8B%E3%80%81%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%EF%BC%8CAI%E9%A2%98%E7%9B%AE%E4%BD%9C%E7%AD%94%EF%BC%8C%E6%89%80%E6%9C%89%E9%A2%98%E7%9B%AE%E5%9D%87%E5%8F%AF%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/556256/%F0%9F%93%9DChatGPT5%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E9%AB%98%E6%95%88%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E7%AB%A0%E8%8A%82%E8%A7%86%E9%A2%91%E3%80%81%E7%AB%A0%E8%8A%82%E5%B0%8F%E6%B5%8B%E3%80%81%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%EF%BC%8CAI%E9%A2%98%E7%9B%AE%E4%BD%9C%E7%AD%94%EF%BC%8C%E6%89%80%E6%9C%89%E9%A2%98%E7%9B%AE%E5%9D%87%E5%8F%AF%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==




     const systemConfig = {
        buildTime: new Date().toISOString(),
        environment: 'production'
    };
    class Logger {
        constructor(prefix) {
            this.prefix = prefix || 'System';
            this.levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
        }

        log(level, message) {
            if (this.levels.includes(level)) {
                const timestamp = new Date().toISOString();
            }
        }

        debug(msg) { this.log('DEBUG', msg); }
        info(msg) { this.log('INFO', msg); }
        warn(msg) { this.log('WARN', msg); }
        error(msg) { this.log('ERROR', msg); }
    }


    const logger = new Logger('CXHelper');

    const browserCheck = {
        isChrome: () => /Chrome/.test(navigator.userAgent),
        isFirefox: () => /Firefox/.test(navigator.userAgent),
        isEdge: () => /Edge/.test(navigator.userAgent),
        isSafari: () => /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    };


    class PerformanceMonitor {
        constructor() {
            this.metrics = new Map();
            this.startTimes = new Map();
        }

        start(name) {
            this.startTimes.set(name, performance.now());
        }

        end(name) {
            const startTime = this.startTimes.get(name);
            if (startTime) {
                const duration = performance.now() - startTime;
                this.metrics.set(name, duration);
                this.startTimes.delete(name);
                return duration;
            }
            return 0;
        }

        getMetric(name) {
            return this.metrics.get(name) || 0;
        }
    }


    const perfMonitor = new PerformanceMonitor();


    const utils = {

        generateId: (length = 8) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },


        deepClone: (obj) => {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => utils.deepClone(item));
            if (typeof obj === 'object') {
                const cloned = {};
                Object.keys(obj).forEach(key => {
                    cloned[key] = utils.deepClone(obj[key]);
                });
                return cloned;
            }
        },


        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },


        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
    };

    class CacheManager {
        constructor(maxSize = 100) {
            this.cache = new Map();
            this.maxSize = maxSize;
        }

        set(key, value, ttl = 300000) { // 默认5分钟过期
            if (this.cache.size >= this.maxSize) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }

            const item = {
                value: value,
                expiry: Date.now() + ttl
            };
            this.cache.set(key, item);
        }

        get(key) {
            const item = this.cache.get(key);
            if (!item) return null;

            if (Date.now() > item.expiry) {
                this.cache.delete(key);
                return null;
            }

            return item.value;
        }

        clear() {
            this.cache.clear();
        }
    }

    const cacheManager = new CacheManager();


    logger.info('System initialization completed');

(function() {
    'use strict';


(function(){
    function _b64ToBytes(b64){ const bin = atob(b64); const out = new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) out[i] = bin.charCodeAt(i); return out; }
    function _bytesToStr(arr){ let s=''; for(let i=0;i<arr.length;i++) s += String.fromCharCode(arr[i]); return s; }
    function _strToBytes(s){ const out = new Uint8Array(s.length); for(let i=0;i<s.length;i++) out[i] = s.charCodeAt(i); return out; }
    function _xor(a,b){ const out=new Uint8Array(a.length); for(let i=0;i<a.length;i++) out[i] = a[i] ^ b[i % b.length]; return out; }
    const __S = [100, 121, 96, 105, 102, 109, 113, 102, 115, 96, 116, 98, 109, 117, 96, 51, 49, 51, 54].map(c=>c-1);
    const __SALT = String.fromCharCode.apply(null, __S);
    const __ENC = "idiM9YBNCEBSu80fAcWJtglB3UgCOQSNSUCG2EFbmlWW7AyIJkSb/kgNWgCHsoEA";
    function __getDSK(){
        try {
            const step1 = __ENC.split('').reverse().join('');
            const xored = _b64ToBytes(step1);
            const plainB64Bytes = _xor(xored, _strToBytes(__SALT));
            const plainB64 = _bytesToStr(plainB64Bytes);
            return atob(plainB64);
        } catch (e) { return ''; }
    }
    window.__getDeepseekKey = __getDSK;
})();


const DEEPSEEK_PROXY_BASE = 'https://api.116611.xyz';

const DEEPSEEK_MODEL = 'deepseek-chat';
const DEEPSEEK_API_URL = `${DEEPSEEK_PROXY_BASE}/v1/chat/completions`;

function deepseekChat(messages, options = {}) {
    return new Promise((resolve, reject) => {
        try {
            GM_xmlhttpRequest({
                method: 'POST',
                url: DEEPSEEK_API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'X-App-Token': __getDSAuth()
                },
                data: JSON.stringify({ model: DEEPSEEK_MODEL, messages, ...options }),
                timeout: 60000,
                onload: (r) => {
                    if (r.status >= 200 && r.status < 300) {
                        try { resolve(JSON.parse(r.responseText)); } catch (e) { reject(e); }
                    } else {
                        reject(new Error(`HTTP ${r.status}: ${String(r.responseText || '').slice(0,200)}`));
                    }
                },
                onerror: () => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Timeout'))
            });
        } catch (err) {
            reject(err);
        }
    });
}
    let isAnswering = false;
    let isStudyingChapters = false;
    let studyIntervalId = null;
    const STUDY_PERSIST_KEY = 'cx_helper_study_on_v2';

    const PANEL_REG_KEY = 'cx_helper_active_panel_v2';
    const PANEL_INSTANCE_ID = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const FRAME_DEPTH = (() => { let d = 0; try { let w = window; while (w !== w.top) { d++; w = w.parent; } } catch { d = 999; } return d; })();
    let isActiveOwner = false;
    let createdPanelEl = null;
    const HEARTBEAT_INTERVAL_MS = 2000;
    const STALE_MS = 7000;
    let heartbeatTimerId = null;
    let lastAutoSkipTs = 0;
    let emptyChecksCount = 0;
    let lastEmptySectionKey = '';
    let recoveryTimerId = null;


    const API_BASE = 'https://116611.xyz';
    const MONEY_YUAN = (() => {
        try {
            const b64 = 'NS4wMA==';
            return atob(b64);
        } catch {
            return '5.00';
        }
    })();
    const PAY_NAME = 'XHelper 解锁/赞助';
    const DEFAULT_PAY = 'wxpay';
    const LS_KEY_DEV_ID = 'cxhelper_device_id';
    const LS_KEY_FREE = 'cxhelper_free_used';
    const LS_KEY_LICENSED = 'cxhelper_licensed';
    const POLL_MS_PAY = 3000;
    const POLL_MAX_PAY = 100;


    const getFreeLimit = (() => {
        let cached = null;
        return function() {
            if (cached != null) return cached;
            try {

                const b64 = 'JDEw';
                const decoded = atob(b64);
                const n = parseInt(decoded.replace(/\D/g, ''), 10);
                cached = Number.isFinite(n) ? n : 10;
            } catch {
                cached = 10;
            }
            return cached;
        };
    })();

    function getDeviceIdPaid() {
        try {
            let id = localStorage.getItem(LS_KEY_DEV_ID);
            if (!id) {
                id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
                localStorage.setItem(LS_KEY_DEV_ID, id);
            }
            return id;
        } catch { return 'dev_' + Math.random().toString(36).slice(2); }
    }
    const DEVICE_ID_PAID = getDeviceIdPaid();

    function getCookie(key) {
        try {
            const name = key + '=';
            const parts = document.cookie.split(';');
            for (let part of parts) {
                const s = part.trim();
                if (s.indexOf(name) === 0) return decodeURIComponent(s.substring(name.length));
            }
            return '';
        } catch { return ''; }
    }
    function setCookie(key, value, days, domain) {
        try {
            const d = new Date();
            d.setTime(d.getTime() + ((days || 365) * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + d.toUTCString();
            const dm = domain ? ';domain=' + domain : '';
            document.cookie = key + '=' + encodeURIComponent(value) + ';path=/' + ';' + expires + dm;
        } catch {}
    }
    function isLocallyLicensed() {
        try {
            // 优先从跨子域Cookie读取，保障不同页面一致
            const c = getCookie(LS_KEY_LICENSED);
            if (c === '1') return true;
            return localStorage.getItem(LS_KEY_LICENSED) === '1';
        } catch { return false; }
    }
    function setLocallyLicensed() {
        try { localStorage.setItem(LS_KEY_LICENSED, '1'); } catch {}
        // 写入跨子域Cookie，统一所有 *.chaoxing.com 页面状态
        try { setCookie(LS_KEY_LICENSED, '1', 365, '.chaoxing.com'); } catch {}
    }
    function getFreeUsedCount() {
        try { return parseInt(localStorage.getItem(LS_KEY_FREE) || '0', 10) || 0; } catch { return 0; }
    }
    function incFreeUsedCount() {
        try { const n = getFreeUsedCount() + 1; localStorage.setItem(LS_KEY_FREE, String(n)); return n; } catch { return 0; }
    }

    async function checkLicensePaid() {
        if (isLocallyLicensed()) return true;
        try {
            const r = await fetch(`${API_BASE}/api/license/status?deviceId=${encodeURIComponent(DEVICE_ID_PAID)}`, { credentials: 'omit' });
            const ct = (r.headers.get('content-type') || '').toLowerCase();
            const data = ct.includes('application/json') ? await r.json() : await r.text();
            const ok = !!(data && data.licensed);
            if (ok) setLocallyLicensed();
            try { updateTrialBadge(); } catch {}
            return ok;
        } catch { return false; }
    }

    async function startPaymentPaid(payType) {
        const win = window.open('', '_blank');
        try {
            const resp = await fetch(`${API_BASE}/api/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: PAY_NAME,
                    money: MONEY_YUAN,
                    type: payType || DEFAULT_PAY,
                    param: DEVICE_ID_PAID
                })
            });
            const html = await resp.text();
            win.document.open();
            win.document.write(html);
            win.document.close();
            return true;
        } catch (e) {
            if (win) win.close();
            alert('发起支付失败：' + e.message);
            return false;
        }
    }

    async function pollUntilLicensedPaid(onProgress) {
        for (let i = 0; i < POLL_MAX_PAY; i++) {
            if (onProgress) { try { onProgress(i); } catch {} }
            const ok = await checkLicensePaid();
            if (ok) { setLocallyLicensed(); return true; }
            await new Promise(r => setTimeout(r, POLL_MS_PAY));
        }
        return false;
    }

    function showPayModalPaid(messageText) {
        return new Promise(resolve => {
            const mask = document.createElement('div');
            mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999998;';
            const box = document.createElement('div');
            box.style.cssText = 'position:fixed;left:50%;top:120px;transform:translateX(-50%);width:420px;background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.2);overflow:hidden;z-index:999999;font-family:system-ui,Segoe UI,Arial;';
            const msg = messageText || '试用已用完，打赏5元永久解锁哦';
            box.innerHTML = (
                '<div style="padding:14px 16px;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:13px;">解锁全部功能（永久）</div>' +
                '<div style="padding:16px;">' +
                    '<div style="margin-bottom:12px;font-size:12px;">' + msg + '</div>' +
                    '<div style="margin-bottom:12px;">' +
                        '<label style="margin-right:14px;cursor:pointer;font-size:12px;"><input type="radio" name="cx_pay" value="wxpay" checked> 微信</label>' +
                        '<label style="margin-right:14px;cursor:pointer;font-size:12px;"><input type="radio" name="cx_pay" value="alipay"> 支付宝</label>' +
                        '<div style="color:#888;font-size:12px;margin-top:6px;">若支付方式不可用请尝试其他支付方式</div>' +
                    '</div>' +
                    '<div id="cx_tip_paid" style="color:#555;font-size:12px;">点击"去支付"将打开收银台，完成后此处会自动检测。</div>' +
                '</div>' +
                '<div style="padding:12px 16px;border-top:1px solid #f0f0f0;text-align:right;">' +
                    '<button id="cx_cancel_paid" style="padding:8px 14px;border-radius:8px;border:1px solid #ddd;background:#fff;color:#333;margin-right:8px;cursor:pointer;font-size:13px;">取消</button>' +
                    '<button id="cx_go_pay" style="padding:8px 14px;border-radius:8px;border:none;background:#4f46e5;color:#fff;cursor:pointer;font-size:13px;">去支付</button>' +
                '</div>'
            );
            document.body.appendChild(mask);
            document.body.appendChild(box);

            const tip = box.querySelector('#cx_tip_paid');
            const btnPay = box.querySelector('#cx_go_pay');
            const btnCancel = box.querySelector('#cx_cancel_paid');

            function close() { try { box.remove(); mask.remove(); } catch {} }

            btnCancel.onclick = () => { close(); resolve(false); };
            btnPay.onclick = async () => {
                btnPay.disabled = true;
                btnPay.textContent = '打开收银台...';
                const payType = (box.querySelector('input[name="cx_pay"]:checked') || {}).value || DEFAULT_PAY;
                const ok = await startPaymentPaid(payType);
                if (!ok) { btnPay.disabled = false; btnPay.textContent = '去支付'; return; }
                btnPay.textContent = '检测支付中...';
                if (tip) tip.innerHTML = '已打开收银台，请完成支付，完成后此处会自动解锁...<br><span style="color:#ff6b35;font-size:12px;margin-top:4px;display:block;">💡 若无法打开支付页面请尝试连接手机热点网络</span>';
                const done = await pollUntilLicensedPaid();
                if (done) {
                    if (tip) tip.textContent = '支付成功，正在解锁...';
                    setLocallyLicensed();
                    try { updateTrialBadge(); } catch {}
                    setTimeout(() => { close(); resolve(true); }, 500);
                } else {
                    btnPay.disabled = false;
                    btnPay.textContent = '去支付';
                    if (tip) tip.textContent = '未检测到支付完成，可重试或稍后再次打开本面板。';
                }
            };
        });
    }

    function showFeedbackModal() {
        const mask = document.createElement('div');
        mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999998;';
        const box = document.createElement('div');
        box.style.cssText = 'position:fixed;left:50%;top:120px;transform:translateX(-50%);width:400px;background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.2);overflow:hidden;z-index:999999;font-family:system-ui,Segoe UI,Arial;';
        box.innerHTML = (
            '<div style="padding:16px 20px;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:16px;color:#333;">意见反馈</div>' +
            '<div style="padding:24px 20px;text-align:center;">' +
                '<div style="margin-bottom:16px;font-size:14px;color:#555;line-height:1.6;">' +
                    '如果您在使用过程中遇到问题或有任何建议，欢迎通过以下方式联系我们：' +
                '</div>' +
                '<div style="background:#f8f9fa;border:1px solid #e9ecef;border-radius:8px;padding:16px;margin:16px 0;">' +
                    '<div style="font-size:16px;font-weight:600;color:#1677ff;margin-bottom:8px;">联系邮箱</div>' +
                    '<div style="font-size:18px;font-weight:bold;color:#333;cursor:pointer;" onclick="navigator.clipboard.writeText(\'2036470448@qq.com\')" title="点击复制">2036470448@qq.com</div>' +
                    '<div style="font-size:12px;color:#666;margin-top:4px;">点击邮箱地址即可复制</div>' +
                '</div>' +
                '<div style="font-size:13px;color:#888;margin-top:12px;line-height:1.5;">我们将会认真对待每一条反馈，并且尽快回复您的问题。您的建议是我们改进产品的重要动力！</div>' +
            '</div>' +
            '<div style="padding:12px 20px;border-top:1px solid #f0f0f0;text-align:right;">' +
                '<button id="feedback-close" style="padding:8px 16px;border-radius:8px;border:none;background:#1677ff;color:#fff;cursor:pointer;font-size:14px;">关闭</button>' +
            '</div>'
        );
        document.body.appendChild(mask);
        document.body.appendChild(box);

        const closeBtn = box.querySelector('#feedback-close');
        function close() {
            try {
                box.remove();
                mask.remove();
            } catch {}
        }

        closeBtn.onclick = close;
        mask.onclick = close;

       
        const emailDiv = box.querySelector('[onclick*="clipboard"]');
        if (emailDiv) {
            emailDiv.addEventListener('click', function() {
                const originalText = this.innerHTML;
                this.innerHTML = '✅ 已复制到剪贴板';
                this.style.color = '#52c41a';
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.color = '#333';
                }, 2000);
            });
        }
    }

    async function ensureAccessAllowed() {
        if (await checkLicensePaid()) return true;
        const used = getFreeUsedCount();
        if (used < getFreeLimit()) { incFreeUsedCount(); try { updateTrialBadge(); } catch {} return true; }
        const ok = await showPayModalPaid();
        if (ok) { setLocallyLicensed(); try { updateTrialBadge(); } catch {} return true; }
        throw new Error('试用已用完，请解锁后继续使用');
    }

    function getActivePanelRecord() {
        try { const raw = localStorage.getItem(PANEL_REG_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
    }
    function setActivePanelRecord(rec) {
        try { localStorage.setItem(PANEL_REG_KEY, JSON.stringify(rec)); } catch {}
    }
    function clearActivePanelRecordIfOwner() {
        try {
            const cur = getActivePanelRecord();
            if (cur && cur.id === PANEL_INSTANCE_ID) {
                localStorage.removeItem(PANEL_REG_KEY);
            }
        } catch {}
    }
    function shouldWeOwn(current) {
        const nowTs = Date.now();
        if (!current) return { own: true, ts: nowTs };

        if (!current.aliveTs || nowTs - current.aliveTs > STALE_MS) return { own: true, ts: nowTs };

        try { if (current.url && current.url !== location.href) return { own: true, ts: nowTs }; } catch {}

        if (FRAME_DEPTH > (current.depth || 0)) return { own: true, ts: nowTs };
        if (FRAME_DEPTH === (current.depth || 0) && nowTs > (current.ts || 0)) return { own: true, ts: nowTs };
        return { own: false, ts: nowTs };
    }
    function claimOwnership() {
        const cur = getActivePanelRecord();
        const decision = shouldWeOwn(cur);
        if (decision.own) {
            setActivePanelRecord({ id: PANEL_INSTANCE_ID, depth: FRAME_DEPTH, ts: decision.ts, aliveTs: Date.now(), url: location.href });
            isActiveOwner = true;
        } else {
            isActiveOwner = false;
        }
        return isActiveOwner;
    }
    function startHeartbeat() {
        if (heartbeatTimerId) return;
        heartbeatTimerId = setInterval(() => {
            if (!isActiveOwner) return;
            const cur = getActivePanelRecord();

            if (!cur || cur.id !== PANEL_INSTANCE_ID) { stopHeartbeat(); return; }
            cur.aliveTs = Date.now();
            try { cur.url = location.href; } catch {}
            setActivePanelRecord(cur);
        }, HEARTBEAT_INTERVAL_MS);
    }
    function stopHeartbeat() { if (heartbeatTimerId) { clearInterval(heartbeatTimerId); heartbeatTimerId = null; } }
    const cleanupOwnership = () => {
        stopHeartbeat();
        clearActivePanelRecordIfOwner();
    };
    window.addEventListener('beforeunload', cleanupOwnership);
    window.addEventListener('pagehide', cleanupOwnership);

    function destroyPanelAndStop() {
        try {
            if (studyIntervalId) { clearInterval(studyIntervalId); studyIntervalId = null; }
            isStudyingChapters = false;
            isAnswering = false;
            stopHeartbeat();
            const panel = document.getElementById('answer-helper-panel');
            if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
            createdPanelEl = null;
        } catch {}
    }
    window.addEventListener('storage', (e) => {
        if (e.key !== PANEL_REG_KEY) return;
        const rec = getActivePanelRecord();
        if (!rec) return;
        if (rec.id === PANEL_INSTANCE_ID) {

            if (!createdPanelEl) {
                try { createdPanelEl = createPanel(); bindPanelEvents(); } catch {}
            }
            isActiveOwner = true;
            startHeartbeat();
        } else {

            isActiveOwner = false;
            destroyPanelAndStop();
        }
    });


    GM_addStyle(`
        /* Panel: Dark Glass Theme */
        #answer-helper-panel {
            position: fixed;
            top: 24px;
            left: 24px;
            width: 520px;
            min-width: 420px;
            /* backdrop-filter removed for white theme */
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 0;
            z-index: 9999;
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #333;
            user-select: none;
            overflow: hidden;
        }

        /* Header */
        #answer-helper-header {
            cursor: move;
            height: 44px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f7f8fa;
            border-bottom: 1px solid #e5e7eb;
            font-size: 15px;
            letter-spacing: 0.2px;
            color: #333;
        }
        #answer-helper-header .title {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #333;
        }
        #answer-helper-header .title .accent {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: radial-gradient(circle, #4cc9f0 0%, #4361ee 65%, transparent 66%);
            box-shadow: 0 0 12px #3a86ff70;
        }
        #answer-helper-header .right {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        #answer-helper-header .collapse-btn {
            width: 30px;
            height: 30px;
            border-radius: 30px;
            background: #edf2f7;
            border: 1px solid #e5e7eb;
            cursor: pointer;
            color: #4a5568;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform .15s ease, background .15s ease, color .15s ease;
        }
        #answer-helper-header .collapse-btn:hover {
            background: #e2e8f0;
            color: #2d3748;
            transform: scale(1.04);
        }
        .collapse-btn-inner { width: 16px; height: 16px; position: relative; }
        .collapse-icon-bar.horizontal { width: 14px; height: 2px; background: currentColor; border-radius: 2px; position: absolute; left: 1px; top: 7px; }
        .collapse-icon-bar.vertical { width: 2px; height: 14px; background: currentColor; border-radius: 2px; position: absolute; left: 7px; top: 1px; }

        /* Content */
        #answer-helper-content { padding: 10px 14px; }
        #answer-helper-panel.collapsed #answer-helper-content { display: none; }
        #answer-helper-panel.collapsed { width: 220px; min-width: 180px; }

        /* Two-column body: main + right actions column */
        #answer-helper-content .panel-body {
            display: grid;
            grid-template-columns: 1fr 100px;
            gap: 10px;
            align-items: start;
        }
        .panel-main { min-width: 0; }
        .panel-actions.panel-column { display: flex; flex-direction: column; gap: 8px; }
        .panel-actions.panel-column .ah-btn { flex: unset; min-height: 48px; padding: 8px 6px; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
        .panel-actions.panel-column .button-icon { font-size: 18px; }
        .panel-actions.panel-column .button-text { font-size: 11px; }

        /* Toast */
        #no-task-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            color: #333;
            padding: 10px 16px;
            border-radius: 10px;
            font-size: 13px;
            z-index: 10000;
            animation: fadeInOut 3s ease-in-out forwards;
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
        }

        /* Terminal Log */
        #answer-log {
            height: 160px;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 8px 10px 8px 12px;
            margin: 8px 0 10px;
            font-size: 12.5px;
            line-height: 1.55;
            font-family: SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
            background: #f8f9fa;
            color: #333;
        }
        #answer-log::-webkit-scrollbar { width: 8px; height: 8px; }
        #answer-log::-webkit-scrollbar-track { background: #edf2f7; border-radius: 10px; }
        #answer-log::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
        .log-item { margin-bottom: 8px; padding: 8px 10px; border-radius: 8px; background: #ffffff; }
        .success { color: #2e7d32; border-left: 3px solid #36c06a; }
        .error { color: #c62828; border-left: 3px solid #ef4444; }
        .debug { color: #1e40af; border-left: 3px solid #3a86ff; }
        .info { color: #4b5563; border-left: 3px solid #9aa0a6; }

        /* Button Grid */
        /* (previous grid tile layout removed for right-side column design) */
        .ah-btn {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.2px;
            cursor: pointer;
            transition: all .18s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            color: #333;
            background: #f5f7fa;
        }
        .ah-btn:hover { transform: translateY(-1px); background: #edf2f7; border-color: #cbd5e0; }
        .ah-primary { background: #2563eb; color: #fff; border-color: #1d4ed8; }
        .ah-primary:hover { background: #1d4ed8; }
        .ah-danger { background: #ef4444; color: #fff; border-color: #dc2626; }
        .ah-danger:hover { background: #dc2626; }
        .ah-secondary { background: #f5f7fa; color: #333; }
        .ah-success { background: #10b981; color: #fff; border-color: #059669; }
        .ah-success:hover { background: #059669; }
        .button-icon { font-size: 14px; line-height: 1; }

        /* Speed buttons state */
        .speed-button { transition: all .15s ease; }
        .speed-active { background: #2563eb; color: #fff; }
        #playback-speed-controls.segmented { display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; }
        #playback-speed-controls.segmented .ah-btn { min-width: 72px; padding: 8px 10px; }

        /* Misc */
        #debug-page{ display:none !important; }
        #answer-helper-panel .cx-trial-badge{ position: absolute; left: 12px; bottom: 8px; color: #666; font-size: 12px; pointer-events: none; }
        #answer-helper-content { padding-bottom: 18px; }
    `);


    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'answer-helper-panel';
        panel.innerHTML = `
            <div id="answer-helper-header">
                <span class="title"><span class="accent"></span>研习助手 · CX</span>
                <div class="right">
                    <button id="feedback-btn" class="ah-btn ah-secondary" style="min-width:auto; width:30px; height:30px; padding:0; border-radius:10px;">
                        <span class="button-icon" style="margin:0; font-size:14px;">💬</span>
                    </button>
                    <button class="collapse-btn" title="折叠/展开">
                      <span class="collapse-btn-inner">
                        <span class="collapse-icon-bar horizontal"></span>
                      </span>
                    </button>
                </div>
            </div>
            <div id="answer-helper-content">
                <div class="panel-body">
                    <div class="panel-main">
                        <div id="answer-log"></div>
                        <div id="playback-speed-controls" class="segmented" style="display:none;">
                            <button id="speed-1x" class="ah-btn ah-secondary speed-button speed-active"><span class="button-icon">1×</span></button>
                            <button id="speed-1.5x" class="ah-btn ah-secondary speed-button"><span class="button-icon">1.5×</span></button>
                            <button id="speed-2x" class="ah-btn ah-secondary speed-button"><span class="button-icon">2×</span></button>
                        </div>
                    </div>
                    <div class="panel-actions panel-column">
                        <button id="start-answer" class="ah-btn ah-primary">
                            <span class="button-icon">▶</span>
                            <span class="button-text">开始答题</span>
                        </button>
                        <button id="pause-answer" class="ah-btn ah-danger" style="display:none;">
                            <span class="button-icon">⏸</span>
                            <span class="button-text">暂停答题</span>
                        </button>
                        <button id="start-study" class="ah-btn ah-success">
                            <span class="button-icon">⏯</span>
                            <span class="button-text">开始刷章节（章节答题）</span>
                        </button>
                        <button id="pause-study" class="ah-btn ah-danger" style="display:none;">
                            <span class="button-icon">■</span>
                            <span class="button-text">暂停刷章节</span>
                        </button>
                        <button id="buy-license" class="ah-btn ah-secondary">
                            <span class="button-icon">💳</span>
                            <span class="button-text">购买授权</span>
                        </button>
                        <button id="debug-page" class="ah-btn ah-secondary">
                            <span class="button-icon">🔍</span>
                            <span class="button-text">调试页面</span>
                        </button>
                    </div>
                </div>
            </div>
            <div id="cx_trial_badge" class="cx-trial-badge">检测中...</div>
        `;
        document.body.appendChild(panel);


        let isDragging = false, offsetX = 0, offsetY = 0;
        const header = panel.querySelector('#answer-helper-header');
        header.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('collapse-btn')) return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'auto';
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });


        const collapseBtn = panel.querySelector('.collapse-btn');
        const collapseBtnInner = collapseBtn.querySelector('.collapse-btn-inner');
        collapseBtn.addEventListener('click', function() {
            panel.classList.toggle('collapsed');
            collapseBtnInner.innerHTML = '';
            if (panel.classList.contains('collapsed')) {

                const h = document.createElement('span');
                h.className = 'collapse-icon-bar horizontal';
                const v = document.createElement('span');
                v.className = 'collapse-icon-bar vertical';
                collapseBtnInner.appendChild(h);
                collapseBtnInner.appendChild(v);
            } else {

                const h = document.createElement('span');
                h.className = 'collapse-icon-bar horizontal';
                collapseBtnInner.appendChild(h);
            }
        });
        return panel;
    }

    function bindPanelEvents() {
        document.getElementById('start-answer')?.addEventListener('click', () => {
            addLog('本助手仅供学习研究，请遵守课程与平台规则。', 'info');
            addLog('开始自动答题...');
            autoAnswer();
        });
        document.getElementById('pause-answer')?.addEventListener('click', () => {
            isAnswering = false;
            addLog('正在暂停自动答题...', 'info');
        });
        const startStudyBtn = document.getElementById('start-study');
        const pauseStudyBtn = document.getElementById('pause-study');
        if (startStudyBtn && pauseStudyBtn) {
            startStudyBtn.addEventListener('click', () => {
                addLog('本助手仅供学习研究，请遵守课程与平台规则。', 'info');
                startStudyChapters();
            });
            pauseStudyBtn.addEventListener('click', () => { stopStudyChapters(); });
        }

       
        document.getElementById('speed-1x')?.addEventListener('click', () => {
            setVideoPlaybackSpeed(1.0);
        });
        document.getElementById('speed-1.5x')?.addEventListener('click', () => {
            setVideoPlaybackSpeed(1.5);
        });
        document.getElementById('speed-2x')?.addEventListener('click', () => {
            setVideoPlaybackSpeed(2.0);
        });

        
        updateSpeedButtonsState();

        const buyBtn = document.getElementById('buy-license');
        if (buyBtn) {
            buyBtn.addEventListener('click', async () => {
                try {
                    await showPayModalPaid('免费试用，打赏5元永久解锁哦');
                } catch (e) {
                    addLog('打开支付弹窗失败: ' + (e && e.message ? e.message : e), 'error');
                }
            });
        }
        document.getElementById('debug-page')?.addEventListener('click', () => { debugPageStructure(); });
        document.getElementById('feedback-btn')?.addEventListener('click', () => { showFeedbackModal(); });


        setTimeout(updateTrialBadge, 0);
    }


    function safeClick(el) {
        try {
            if (!el) return false;
            el.click();
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return true;
        } catch { return false; }
    }


    function forEachSameOriginFrame(callback) {
        const visit = (win) => {
            for (let i = 0; i < win.frames.length; i++) {
                const f = win.frames[i];
                try {
                    const doc = f.document || f.contentDocument;
                    if (doc && doc.location && doc.location.href.includes('.chaoxing.com')) {
                        callback(doc);
                        visit(f);
                    }
                } catch {  }
            }
        };
        try { callback(document); } catch {}
        try { visit(window); } catch {}
    }


    function forEachAllSameOriginDocs(callback) {
        const seen = new Set();
        const visit = (win) => {
            if (!win || seen.has(win)) return;
            seen.add(win);
            try {
                const doc = win.document || win.contentDocument;
                if (doc) callback(doc);
            } catch {}
            try {
                const len = win.frames ? win.frames.length : 0;
                for (let i = 0; i < len; i++) {
                    try { visit(win.frames[i]); } catch {}
                }
            } catch {}
        };
        try { visit(window.top); } catch { visit(window); }
    }


    async function waitForQuestionsRenderAny(timeoutMs = 8000) {
        const end = Date.now() + timeoutMs;
        const selector = '.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item';
        while (Date.now() < end) {
            let hit = null;
            forEachAllSameOriginDocs((doc) => {
                if (hit) return;
                try {
                    const qs = doc.querySelectorAll(selector);
                    if (qs && qs.length > 0) hit = doc;
                } catch {}
            });
            if (hit) return hit;
            await new Promise(r => setTimeout(r, 300));
        }
        return null;
    }


    function gotoNextSection(contextDoc) {
        const docsToTry = [];
        if (contextDoc) docsToTry.push(contextDoc);
        try { if (window.top && window.top.document) docsToTry.push(window.top.document); } catch {}
        docsToTry.push(document);

        const textNextRegex = /下一(节|章|单元|页|个)|继续|下一步|下一个|Next/i;
        const nextBtnSelectors = [
            '.next', '.vc-next', '.reader-next', 'a[title="下一页"]', '.btn-next', '#next',
            '.prev_next .right a', '.switch-btn.next', '.icon-arrow-right', '.right-btn .next'
        ];
        const currentNodeSelectors = ['.cur', '.curr', 'li.active', 'li.selected', '.posCatalog_active'];


        try { if (isStudyingChapters) localStorage.setItem(STUDY_PERSIST_KEY, '1'); } catch {}

        for (const doc of docsToTry) {
            try {

                for (const sel of nextBtnSelectors) {
                    const btn = doc.querySelector(sel);
                    if (btn && !btn.getAttribute('disabled') && !String(btn.className).includes('disabled')) {
                        if (safeClick(btn)) { addLog('检测到下一节按钮，已点击', 'success'); return true; }
                    }
                }


                for (const curSel of currentNodeSelectors) {
                    const cur = doc.querySelector(curSel);
                    if (cur && cur.nextElementSibling) {
                        const link = cur.nextElementSibling.querySelector('a');
                        if (link && safeClick(link)) { addLog('目录定位到下一小节', 'success'); return true; }
                    }
                }


                const links = Array.from(doc.querySelectorAll('a[href*="knowledgeId"], a[href*="chapterId"], a[href*="studentstudy"]'));
                if (links.length > 1) {
                    const hrefNow = (location && location.href) || '';
                    const idx = links.findIndex(a => (a.href || '').includes('knowledgeId') && hrefNow.includes('knowledgeId') && a.href.split('knowledgeId')[1] === hrefNow.split('knowledgeId')[1]);
                    const next = idx >= 0 ? links[idx + 1] : null;
                    if (next && safeClick(next)) { addLog('通过目录链接顺序跳转下一小节', 'success'); return true; }
                }


                const clickable = Array.from(doc.querySelectorAll('a, button, .btn, .el-button, .next'));
                for (const el of clickable) {
                    const txt = (el.textContent || '').trim();

                    if (textNextRegex.test(txt)) {

                        const excludeClasses = ['close', 'cancel', 'delete', 'remove', 'back', 'prev', 'disabled', 'popup', 'modal'];
                        const hasExcludeClass = excludeClasses.some(cls =>
                            el.className.toLowerCase().includes(cls) ||
                            el.id.toLowerCase().includes(cls)
                        );


                        const isVisible = el.offsetWidth > 0 && el.offsetHeight > 0 &&
                                        window.getComputedStyle(el).display !== 'none' &&
                                        window.getComputedStyle(el).visibility !== 'hidden';


                        const isValidNavigationElement = (
                            (el.tagName === 'A' && (el.href || el.onclick)) ||
                            (el.tagName === 'BUTTON' && el.onclick) ||
                            el.className.includes('btn') ||
                            el.className.includes('next')
                        ) && !el.closest('.popup, .modal, .dialog, .alert');


                        const isNavigationText = /^(下一节|下一章|下一个|下一页|继续|Next)$/i.test(txt);

                        if (!hasExcludeClass && isVisible && isValidNavigationElement && isNavigationText) {
                            if (safeClick(el)) {
                                addLog(`通过文本匹配跳转: ${txt}`, 'success');
                                return true;
                            }
                        } else {
                            addLog(`跳过不合适的文本匹配元素: ${txt} (类名: ${el.className})`, 'debug');
                        }
                    }
                }
            } catch {}
        }
        addLog('未能自动跳转到下一小节', 'error');
        return false;
    }


    function handleVideosInDocument(doc) {
        try {
            const videos = doc.querySelectorAll('video, .video-js video');
            if (videos.length === 0) return false;
            let any = false;
            videos.forEach(v => {
                try {
                    v.muted = true;
                    if (!Number.isNaN(v.playbackRate)) v.playbackRate = currentPlaybackSpeed;
                    const p = v.play(); if (p && typeof p.catch === 'function') p.catch(() => {});

                    v.loop = false;


                    if (!v.dataset.autonextBind) {
                        v.dataset.autonextBind = '1';


                        v.addEventListener('ended', () => {
                            if (v.dataset.disableAutoNext === '1' || !isStudyingChapters) return;
                            addLog('视频播放结束，进行完成度检测', 'success');
                            setTimeout(() => ensureSectionCompletedAndAdvance(doc), 300);
                        }, { passive: true });


                        let nearingFired = false;
                        const onTimeUpdate = () => {
                            if (v.dataset.disableAutoNext === '1' || !isStudyingChapters) return;
                            try {
                                const d = v.duration || 0;
                                const t = v.currentTime || 0;
                                if (d > 0 && (d - t) <= 1.0 && !nearingFired) {
                                    nearingFired = true;
                                    addLog('检测到视频即将结束，进行完成度检测', 'debug');
                                    setTimeout(() => ensureSectionCompletedAndAdvance(doc), 800);
                                }
                            } catch {}
                        };
                        v.addEventListener('timeupdate', onTimeUpdate, { passive: true });
                    }
                    any = true;
                } catch {}
            });

            const popBtns = doc.querySelectorAll('.ans-job-icon, .popBtn, .dialog-footer .btn, .ans-modal .btn, .vjs-big-play-button');
            popBtns.forEach(b => safeClick(b));
            return any;
        } catch { return false; }
    }


    function handlePPTInDocument(doc) {
        try {
            const nextSelectors = ['.next', '.vc-next', '.reader-next', 'a[title="下一页"]', '.btn-next', '#next'];
            for (const sel of nextSelectors) {
                const btn = doc.querySelector(sel);
                if (btn && !btn.className.includes('disabled') && !btn.getAttribute('disabled')) {
                    if (safeClick(btn)) { addLog('PPT自动下一页', 'debug'); return true; }
                }
            }

            const container = doc.scrollingElement || doc.body;
            if (container) container.scrollTop = container.scrollHeight;
            return false;
        } catch { return false; }
    }


    function findChapterQuizTab(doc) {
        try {

            const byTitle = doc.querySelector('li[title*="章节测验"], li[title*="测验"], a[title*="章节测验"], a[title*="测验"]');
            if (byTitle) return byTitle;

            const byOnClick = Array.from(doc.querySelectorAll('li[onclick], a[onclick], button[onclick]')).find(el => {
                const oc = (el.getAttribute('onclick') || '').toString();
                return oc.includes('changeDisplayContent') && (oc.includes('(2,2') || oc.includes(',2)'));
            });
            if (byOnClick) return byOnClick;

            const candidates = Array.from(doc.querySelectorAll('li, a, button, [role="tab"], [role="option"]'));
            const textEl = candidates.find(el => /章节测验|测验/.test(((el.textContent || el.getAttribute('title') || '') + '').trim()));
            if (textEl) return textEl;
        } catch {}
        return null;
    }


    async function waitForQuestionsRender(doc, timeoutMs = 6000) {
        const end = Date.now() + timeoutMs;
        while (Date.now() < end) {
            try {
                const qs = doc.querySelectorAll('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item');
                if (qs.length > 0) return true;
            } catch {}
            await new Promise(r => setTimeout(r, 300));
        }
        return false;
    }



    let TYPR_MD5_LIB, FONT_TABLE_DATA;
    try {
        TYPR_MD5_LIB = GM_getResourceText('typrMd5Lib');
        FONT_TABLE_DATA = GM_getResourceText('fontTableData');


        if (TYPR_MD5_LIB) {
            window.TYPR_MD5_LIB = TYPR_MD5_LIB;
        }
        if (FONT_TABLE_DATA) {
            window.FONT_TABLE_DATA = FONT_TABLE_DATA;
        }
    } catch (e) {
        console.error('加载外部资源失败:', e);

        TYPR_MD5_LIB = '';
        FONT_TABLE_DATA = '{}';
    }


    function injectConsoleDecryptCode(doc, timeoutMs = 3000) {
        return new Promise((resolve) => {
            try {
                const consoleCode = `

if (!window.Typr || !window.md5) {
    ${TYPR_MD5_LIB || window.TYPR_MD5_LIB || ''}
}


if (!window.chaoXingFontTable) {
    window.chaoXingFontTable = ${FONT_TABLE_DATA || window.FONT_TABLE_DATA || '{}'};
}


const decryptChaoXingFont = async () => {
  const { Typr, md5, chaoXingFontTable: table } = window;


  const base64ToUint8Array = (base64) => {
    const data = atob(base64);
    const buffer = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      buffer[i] = data.charCodeAt(i);
    }
    return buffer;
  };


  const styleElements = [...document.querySelectorAll('style')];
  const cxStyle = styleElements.find(el =>
    el.textContent.includes('font-cxsecret')
  );

  if (!cxStyle) {
    return;
  }


  const fontData = cxStyle.textContent.match(/base64,([\\w\\W]+?)'/)[1];
  const parsedFont = Typr.parse(base64ToUint8Array(fontData))[0];


  const charMap = {};
  for (let charCode = 19968; charCode < 40870; charCode++) {
    const glyph = Typr.U.codeToGlyph(parsedFont, charCode);
    if (!glyph) continue;

    const path = Typr.U.glyphToPath(parsedFont, glyph);
    const pathHash = md5(JSON.stringify(path)).slice(24);
    charMap[String.fromCharCode(charCode)] =
      String.fromCharCode(table[pathHash]);
  }


  document.querySelectorAll('.font-cxsecret').forEach(element => {
    let htmlContent = element.innerHTML;
    Object.entries(charMap).forEach(([encryptedChar, decryptedChar]) => {
      const regex = new RegExp(encryptedChar, 'g');
      htmlContent = htmlContent.replace(regex, decryptedChar);
    });
    element.innerHTML = htmlContent;
    element.classList.remove('font-cxsecret');
  });
};


decryptChaoXingFont().catch(console.error);
`;
                const beforeCnt = (() => { try { return doc.querySelectorAll('.font-cxsecret').length; } catch { return -1; } })();

                let script = doc.createElement('script');
                script.type = 'text/javascript';
                let blobUrl = '';
                try {
                    const blob = new Blob([consoleCode], { type: 'text/javascript' });
                    blobUrl = (doc.defaultView || window).URL.createObjectURL(blob);
                    script.src = blobUrl;
                } catch {

                    script.textContent = consoleCode;
                }
                (doc.head || doc.documentElement).appendChild(script);
                script.onload = () => { try { if (blobUrl) (doc.defaultView || window).URL.revokeObjectURL(blobUrl); } catch {} };

                const start = Date.now();
                const timer = setInterval(() => {
                    try {
                        const cnt = doc.querySelectorAll('.font-cxsecret').length;
                        if (cnt === 0 || (beforeCnt >= 0 && cnt < beforeCnt)) { clearInterval(timer); resolve(); return; }
                    } catch {}
                    if (Date.now() - start > timeoutMs) { clearInterval(timer); resolve(); }
                }, 200);
            } catch { resolve(); }
        });
    }


    async function tryEnterQuizAndAnswer(contextDoc) {
        try {
            if (!isStudyingChapters) return false;
            let targetDoc = null;
            let tabEl = null;

            forEachAllSameOriginDocs((doc) => {
                if (tabEl) return;
                const el = findChapterQuizTab(doc);
                if (el) { tabEl = el; targetDoc = doc; }
            });
            if (!tabEl || !targetDoc) return false;
            addLog('检测到章节测验入口，正在进入...', 'info');

            await new Promise((r) => {
                let pending = 0; let done = false;
                forEachAllSameOriginDocs((doc) => {
                    pending++; injectConsoleDecryptCode(doc).finally(() => { if (--pending === 0 && !done) { done = true; r(); } });
                });
                if (pending === 0) r();
            });

            try { tabEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch {}
            const clicked = safeClick(tabEl);


            const oc = (tabEl.getAttribute('onclick') || '').toString();
            const m = oc.match(/changeDisplayContent\(([^)]*)\)/);
            if (!clicked && m && m[1]) {
                try {
                    const ownerWin = (tabEl.ownerDocument && tabEl.ownerDocument.defaultView) || null;
                    const topWin = (function(){ try { return window.top; } catch { return window; } })();
                    const evalWin = ownerWin || topWin || window;
                    const args = evalWin.eval('[' + m[1] + ']');
                    const fn = (ownerWin && ownerWin.changeDisplayContent) || (topWin && topWin.changeDisplayContent) || window.changeDisplayContent;
                    if (typeof fn === 'function') {
                        fn.apply(ownerWin || topWin || window, args);
                    } else {
                        addLog('未找到changeDisplayContent函数可调用', 'error');
                    }
                } catch (e) {
                    addLog('直接调用changeDisplayContent失败: ' + e.message, 'error');
                }
            }


            const qDoc = await waitForQuestionsRenderAny(10000);
            if (!isStudyingChapters) return false;
            if (!qDoc) {
                addLog('进入章节测验后未检测到题目，自动跳转下一节', 'info');
                try { gotoNextSection(targetDoc || document); } catch {}
                return true;
            }

            await injectConsoleDecryptCode(qDoc);

            if (!isStudyingChapters) return false;
            await autoAnswerInDocument(qDoc);
            addLog('章节测验已自动作答', 'success');
            return true;
        } catch (e) {
            addLog(`进入章节测验失败: ${e.message}`, 'error');
            return false;
        }
    }


    function hasActionableStudyContent(doc) {
        try {

            if (doc.querySelector('video, .video-js video')) return true;


            const docSelectors = [
                '.ans-attach-ct', '.reader', '.ppt', '.ppt-play', '.vjs-control', '.vjs-big-play-button',
                '.catalog', '.course_section', '.posCatalog', '.posCatalog_active', '.catalogTree'
            ];
            if (docSelectors.some(sel => !!doc.querySelector(sel))) return true;


            const nextSelectors = ['.next', '.vc-next', '.reader-next', 'a[title="下一页"]', '.btn-next', '#next'];
            if (nextSelectors.some(sel => !!doc.querySelector(sel))) return true;


            if (doc.querySelector('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item')) return true;


            if (doc.querySelector('input[type="radio"], input[type="checkbox"], textarea, select')) return true;


            if (doc.querySelector('[id^="answerEditor"], iframe[id^="ueditor_"], div[contenteditable="true"]')) return true;


            const iframes = Array.from(doc.querySelectorAll('iframe'));
            if (iframes.some(f => {
                const src = (f.getAttribute('src') || '').toLowerCase();
                return src.includes('mooc-ans') || src.includes('document') || src.includes('ppt') || src.includes('video') || src.includes('knowledgeid');
            })) return true;


            if (doc.querySelector('.cur, .curr, li.active, li.selected, .posCatalog_active')) return true;
        } catch {}
        return false;
    }


    function hasUnansweredQuestions(doc) {
        try {

            const containers = doc.querySelectorAll('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item');
            for (const q of containers) {
                try { if (!isQuestionAnswered(q)) return true; } catch {}
            }


            const radios = Array.from(doc.querySelectorAll('input[type="radio"]'));
            if (radios.length > 0) {
                const groups = new Map();
                radios.forEach(r => {
                    const k = r.name || `__radio_${Math.random()}`;
                    if (!groups.has(k)) groups.set(k, []);
                    groups.get(k).push(r);
                });
                for (const [, list] of groups) {
                    if (!list.some(r => r.checked)) return true;
                }
            }


            const texts = Array.from(doc.querySelectorAll('textarea, input[type="text"], div[contenteditable="true"]'));
            if (texts.length > 0) {
                if (texts.some(el => {
                    if (el.tagName && el.tagName.toLowerCase() === 'div') return ((el.innerText || el.textContent || '').trim().length === 0);
                    return ((el.value || '').trim().length === 0);
                })) return true;
            }
        } catch {}
        return false;
    }


    function tryAutoSkipEmptySection() {
        if (!isStudyingChapters) return false;
        const now = Date.now();
        if (now - lastAutoSkipTs < 4000) return false;


        const href = (location && location.href) || '';
        const key = href.split('?')[0] + (href.includes('knowledgeId') ? ('?k=' + href.split('knowledgeId')[1]) : '');
        if (key !== lastEmptySectionKey) { lastEmptySectionKey = key; emptyChecksCount = 0; }

        let found = false;
        forEachSameOriginFrame((doc) => {
            if (found) return;
            if (hasActionableStudyContent(doc)) { found = true; return; }
            if (hasUnansweredQuestions(doc)) { found = true; return; }
        });
        if (!found) {
            emptyChecksCount += 1;
            addLog(`小节判空第${emptyChecksCount}次`, 'debug');
            if (emptyChecksCount >= 2) {
                lastAutoSkipTs = now;
                emptyChecksCount = 0;
                addLog('检测到空白小节（已二次确认），自动跳转下一小节', 'info');
                gotoNextSection(document);
                return true;
            }
        } else {

            emptyChecksCount = 0;
        }
        return false;
    }


    async function autoAnswerInDocument(rootDoc) {
        try {
            if (!isStudyingChapters) return false;

            if (isQuizPageDoc(rootDoc)) {
                if (!isStudyingChapters) return false;
                const ok = await autoAnswerQuizInDocument(rootDoc);
                if (ok) return true;
            }

            const possibleSelectors = ['.question', '.questionLi', '.subject_item', '.examPaper_subject', '.questionContainer', '.q-item', '.subject_node', '[class*="question"]', '[class*="subject"]', '.ti-item', '.exam-item'];
            let questions = [];
            for (let selector of possibleSelectors) {
                questions = rootDoc.querySelectorAll(selector);
                if (questions.length > 0) break;
            }
            if (questions.length === 0) return false;
            addLog(`章节内发现 ${questions.length} 个题目，自动作答...`, 'info');
            for (let q of questions) {
                if (!isStudyingChapters) { addLog('已暂停刷章节，停止小测作答', 'info'); return false; }
                const info = getQuestionInfo(q);
                if (!info || !info.question) continue;
                const ans = await getAnswer(info);
                if (ans) {
                    fillAnswer(ans, q, info.type);
                    await new Promise(r => setTimeout(r, 800));
                }
            }
            return true;
        } catch (e) { addLog(`章节答题出错: ${e.message}`, 'error'); return false; }
    }


    function isStudyPage() { return /mycourse\/studentstudy|mooc2-ans|knowledgeId|chapterId/.test(location.href); }


    function hasStudyContentDeep() {
        let found = false;
        const tryDoc = (doc) => {
            try {
                if (doc.querySelector('video, .video-js, .ans-attach-ct, .reader, .ppt, .ppt-play, .catalog, .vjs-play-control')) { found = true; return; }
                if (doc.querySelector('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item')) { found = true; return; }
            } catch {}
        };
        forEachSameOriginFrame(tryDoc);
        return found;
    }



    let currentPlaybackSpeed = 1.0;
    const PLAYBACK_SPEED_KEY = 'cx_playback_speed';


    try {
        const savedSpeed = localStorage.getItem(PLAYBACK_SPEED_KEY);
        if (savedSpeed) {
            currentPlaybackSpeed = parseFloat(savedSpeed);
        }
    } catch {}


    function updateSpeedButtonsState() {
        const speedButtons = document.querySelectorAll('.speed-button');
        speedButtons.forEach(btn => {
            btn.classList.remove('speed-active');
        });

        const activeButton = document.getElementById(`speed-${currentPlaybackSpeed}x`);
        if (activeButton) {
            activeButton.classList.add('speed-active');
        }
    }


    function setVideoPlaybackSpeed(speed) {
        currentPlaybackSpeed = speed;
        try {
            localStorage.setItem(PLAYBACK_SPEED_KEY, speed.toString());
        } catch {}

        updateSpeedButtonsState();


        forEachSameOriginFrame((doc) => {
            try {
                const videos = doc.querySelectorAll('video, .video-js video');
                videos.forEach(v => {
                    if (!Number.isNaN(v.playbackRate)) v.playbackRate = speed;
                });
            } catch {}
        });

        addLog(`视频播放速度已设置为 ${speed}×`, 'success');
    }

    function updateStudyButtons(running) {
        const startBtn = document.getElementById('start-study');
        const pauseBtn = document.getElementById('pause-study');
        const speedControls = document.getElementById('playback-speed-controls');

        if (!startBtn || !pauseBtn) return;

        if (running) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'flex';
            if (speedControls) speedControls.style.display = 'flex';
        } else {
            startBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
            if (speedControls) speedControls.style.display = 'none';
        }
    }

    function startStudyChapters() {
        if (isStudyingChapters) { addLog('刷章节已在运行', 'info'); return; }
        isStudyingChapters = true;
        try { localStorage.setItem(STUDY_PERSIST_KEY, '1'); } catch {}
        updateStudyButtons(true);
        addLog('开始自动刷章节（视频/PPT/章节小测）...', 'success');
        addLog('⚠️ 章节视频请勿倍速观看，倍速观看可能导致账号异常哦', 'warning');

        forEachSameOriginFrame((doc) => {

            try { doc.querySelectorAll('video, .video-js video').forEach(v => { delete v.dataset.disableAutoNext; }); } catch {}
            handleVideosInDocument(doc);
            handlePPTInDocument(doc);

            autoAnswerInDocument(doc);
        });

        tryAutoSkipEmptySection();

        studyIntervalId = setInterval(() => {
            if (!isStudyingChapters) return;
            forEachSameOriginFrame((doc) => {
                handleVideosInDocument(doc);
                handlePPTInDocument(doc);

            });

            tryAutoSkipEmptySection();
        }, 3000);
    }

    function stopStudyChapters() {
        if (!isStudyingChapters) return;
        isStudyingChapters = false;
        if (studyIntervalId) { clearInterval(studyIntervalId); studyIntervalId = null; }
        try { localStorage.removeItem(STUDY_PERSIST_KEY); } catch {}

        forEachSameOriginFrame((doc) => {
            try {
                doc.querySelectorAll('video, .video-js video').forEach(v => {
                    v.dataset.disableAutoNext = '1';
                    try { v.pause(); } catch {}
                });
            } catch {}
        });
        updateStudyButtons(false);
        addLog('已暂停刷章节', 'info');
    }


    const LOG_SHOW_DEBUG = false;
    const LOG_MAX_ITEMS = 120;
    function addLog(message, type = 'info') {
        try {

            if (type === 'debug' && !LOG_SHOW_DEBUG) return;

            const logContainer = document.getElementById('answer-log');
            if (!logContainer) return;


            const text = String(message || '')
                .replace(/\s+/g, ' ')
                .slice(0, 140);

            const logItem = document.createElement('div');
            logItem.className = `log-item ${type}`;
            logItem.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
            logContainer.appendChild(logItem);


            const items = logContainer.querySelectorAll('.log-item');
            if (items.length > LOG_MAX_ITEMS) {
                const removeCount = items.length - LOG_MAX_ITEMS;
                for (let i = 0; i < removeCount; i++) {
                    const n = logContainer.firstElementChild;
                    if (n) logContainer.removeChild(n);
                }
            }

            logContainer.scrollTop = logContainer.scrollHeight;
        } catch {}
    }


    async function updateTrialBadge() {
        try {
            const el = document.getElementById('cx_trial_badge');
            if (!el) return;
            const licensed = await checkLicensePaid();
            const buyBtn = document.getElementById('buy-license');
            if (buyBtn) {
                const group = buyBtn.closest('.button-group');
                if (licensed) {
                    if (group) group.style.display = 'none';
                    else buyBtn.style.display = 'none';
                } else {
                    if (group) group.style.display = 'flex';
                    else buyBtn.style.display = 'flex';
                }
            }
            if (licensed) {
                el.textContent = '永久激活，感谢赞助';
                return;
            }
            const used = getFreeUsedCount();
            const remain = Math.max(0, getFreeLimit() - used);
            el.textContent = `试用剩余：${remain}/${getFreeLimit()}`;
        } catch {}
    }


    function getQuestionInfo(questionElement) {
        try {

            addLog('题目元素HTML结构：' + questionElement.outerHTML.substring(0, 200) + '...', 'debug');


            const questionId = questionElement.id || '';
            addLog(`题目ID: ${questionId}`, 'debug');


            const possibleTypeSelectors = [
                '.type_title',
                '.mark_name',
                '.questionType',
                'div[class*="type"]',
                'div[class*="Type"]',
                '.subject_type',
                '.q-type',
                'div[class*="questionType"]',
                '.stem_type'
            ];

            const possibleQuestionSelectors = [
                '.subject_describe',
                '.mark_name',
                '.questionContent',
                '.title',
                'div[class*="title"]',
                '.subject_stem',
                '.q-body',
                '.question-content',
                '.stem-content',
                '.stem_txt'
            ];


            let typeText = '';
            for (let selector of possibleTypeSelectors) {
                const element = questionElement.querySelector(selector);
                if (element) {
                    typeText = element.textContent.trim();
                    addLog(`找到题目类型: ${typeText}，使用选择器: ${selector}`, 'debug');
                    break;
                }
            }

            let type = '';
            if (typeText.includes('单选题')) type = 'single';
            else if (typeText.includes('多选题')) type = 'multiple';
            else if (typeText.includes('判断题')) type = 'judge';
            else if (typeText.includes('填空题')) type = 'blank';
            else if (typeText.includes('简答题')) type = 'short';
            else if (typeText.includes('名词解释')) type = 'term';
            else if (typeText.includes('论述题')) type = 'essay';
            else if (typeText.includes('计算题')) type = 'calculation';
            else if (typeText.includes('完形填空')) type = 'cloze';
            else if (typeText.includes('写作题')) type = 'writing';
            else if (typeText.includes('连线题')) type = 'matching';
            else if (typeText.includes('分录题')) type = 'accounting';


            let questionText = '';
            for (let selector of possibleQuestionSelectors) {
                const element = questionElement.querySelector(selector);
                if (element) {
                    questionText = element.textContent.trim();
                    addLog(`找到题目内容: ${questionText.substring(0, 30)}...，使用选择器: ${selector}`, 'debug');
                    break;
                }
            }


            const optionSelectors = [
                '.stem_answer > div',
                '.stem_answer div[class*="option"]',
                'div.stem_answer > div',
                `#${questionId} > div.stem_answer > div`,
                '.answer_p',
                '.subject_node',
                '.answer_options',
                '.options div'
            ];

            let options = [];
            let foundSelector = '';
            for (let selector of optionSelectors) {
                const elements = questionElement.querySelectorAll(selector);
                if (elements.length > 0) {
                    options = Array.from(elements).map((option, index) => {
                        const text = option.textContent.trim();
                        const letter = String.fromCharCode(65 + index);
                        addLog(`选项 ${letter}: ${text}`, 'debug');
                        return text;
                    });
                    foundSelector = selector;
                    addLog(`找到选项，使用选择器: ${selector}，数量: ${elements.length}`, 'debug');
                    break;
                }
            }


            if (options.length === 0 && questionId) {
                for (let i = 1; i <= 6; i++) {
                    const specificSelector = `#${questionId} > div.stem_answer > div:nth-child(${i})`;
                    const element = document.querySelector(specificSelector);
                    if (element) {
                        options.push(element.textContent.trim());
                        addLog(`使用nth-child选择器找到选项 ${i}: ${element.textContent.trim()}`, 'debug');
                    }
                }
            }

            if (!type || !questionText) {
                addLog('未能完全识别题目信息', 'error');
            }

            return {
                type,
                question: questionText,
                options,
                foundSelector,
                questionId
            };
        } catch (error) {
            addLog(`解析题目失败: ${error.message}`, 'error');
            return null;
        }
    }


    function getModelParams(questionType) {

        const preciseTypes = ['single', 'multiple', 'blank', 'cloze', 'judge', 'term'];

        if (preciseTypes.includes(questionType)) {
            return {
                temperature: 0.1,
                max_tokens: 100,
                top_p: 0.1,
                frequency_penalty: 0.1,
                presence_penalty: 0.1
            };
        } else {

            return {
                temperature: 0.5,
                max_tokens: 500,
                top_p: 0.8,
                frequency_penalty: 0.3,
                presence_penalty: 0.3
            };
        }
    }


    async function getAnswer(questionInfo) {

        try {
            await ensureAccessAllowed();
        } catch (e) {
            addLog(String(e && e.message ? e.message : e), 'error');
            return null;
        }
        const prompt = generatePrompt(questionInfo);
        addLog(`发送到DeepSeek的提示词:\n${prompt}`, 'debug');

        try {
            const modelParams = getModelParams(questionInfo.type);
            addLog(`使用模型参数: ${JSON.stringify(modelParams)}`, 'debug');

            const data = await deepseekChat([
                { role: "user", content: prompt }
            ], modelParams);
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid API response format');
            }

            const answer = data.choices[0].message.content.trim();
            return answer;
        } catch (error) {
            addLog(`API调用失败: ${error.message}`, 'error');
            return null;
        }
    }


    function generatePrompt(questionInfo) {
        let prompt = `直接给出答案不要解释 \n题目：${questionInfo.question}\n`;

        if (questionInfo.type === 'single' || questionInfo.type === 'multiple' || questionInfo.type === 'judge') {
            if (questionInfo.options && questionInfo.options.length > 0) {
                prompt += '选项：\n';
                questionInfo.options.forEach((option, index) => {
                    const letter = String.fromCharCode(65 + index);

                    const cleanOption = option.replace(/^[A-Z][\s.、．。]+|^\d+[\s.、．。]+/, '').trim();
                    prompt += `${letter}. ${cleanOption}\n`;
                });


                if (questionInfo.type === 'single') {
                    prompt += '\n请直接回答选项字母（A/B/C/D/...）';
                } else if (questionInfo.type === 'multiple') {
                    prompt += '\n这是多选题，请列出所有正确选项的字母，用逗号分隔（如：A,B,D）';
                } else if (questionInfo.type === 'judge') {
                    prompt += '\n这是判断题，请回答A表示正确，B表示错误';
                }
            }
        } else if (questionInfo.type === 'blank') {

            prompt += '\n这是填空题，请按顺序给出每个空的答案，用逗号分隔';
        }

        return prompt;
    }


    
    (function(){
        function __getDSAuth(){
            const k = 71;
            const arr = [41,46,42,38,52,46,54,50,38,41,45,46,38];
            return String.fromCharCode(...arr.map(n => n ^ k));
        }
        window.__getDSAuth = __getDSAuth;
    })();

    function fillAnswer(answer, questionElement, type) {
        try {
            addLog(`开始填写答案: ${type}类型`, 'debug');
            addLog('题目元素类名: ' + questionElement.className, 'debug');
            let filled = false;

            const questionId = questionElement.id;
            addLog(`处理题目ID: ${questionId}`, 'debug');

            switch (type) {
                case 'blank':
                case 'cloze': {

                    const answers = answer.split(/[,，;；、]\s*/).map(a => a.trim()).filter(a => a);
                    addLog(`解析到的答案数量: ${answers.length}`, 'debug');
                    answers.forEach((ans, idx) => addLog(`第${idx + 1}个答案: ${ans}`, 'debug'));


                    const editorElements = questionElement.querySelectorAll('[id^="answerEditor"]');
                    if (editorElements.length > 0) {
                        addLog(`找到UEditor元素数量: ${editorElements.length}`, 'debug');

                        editorElements.forEach((editorElement, index) => {
                            const editorId = editorElement.id;
                            addLog(`处理第${index + 1}个编辑器: ${editorId}`, 'debug');


                            if (index < answers.length) {
                                const currentAnswer = answers[index];
                                try {

                                    if (typeof UE !== 'undefined' && UE.getEditor) {
                                        const editor = UE.getEditor(editorId);
                                        if (editor) {

                                            if (editor.ready) {
                                                editor.ready(() => {
                                                    editor.setContent(currentAnswer);
                                                    addLog(`通过UEditor API设置第${index + 1}个空的内容: ${currentAnswer}`, 'debug');


                                                    if (typeof editor.fireEvent === 'function') {
                                                        editor.fireEvent('contentChange');
                                                    }
                                                });
                                                filled = true;
                                            }
                                        }
                                    }


                                    if (!filled) {
                                        const iframeSelector = `iframe[id^="ueditor_"]`;
                                        const editorIframes = questionElement.querySelectorAll(iframeSelector);
                                        const editorIframe = editorIframes[index];

                                        if (editorIframe) {
                                            try {
                                                const iframeDoc = editorIframe.contentDocument || editorIframe.contentWindow.document;
                                                const editorBody = iframeDoc.body;
                                                if (editorBody) {
                                                    editorBody.innerHTML = currentAnswer;
                                                    editorBody.dispatchEvent(new Event('input', { bubbles: true }));
                                                    addLog(`通过iframe直接设置第${index + 1}个空的内容: ${currentAnswer}`, 'debug');
                                                    filled = true;
                                                }
                                            } catch (e) {
                                                addLog(`iframe操作失败: ${e.message}`, 'error');
                                            }
                                        }
                                    }


                                    const textarea = document.getElementById(editorId);
                                    if (textarea) {
                                        textarea.value = currentAnswer;
                                        textarea.dispatchEvent(new Event('change', { bubbles: true }));
                                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                        addLog(`设置第${index + 1}个空的textarea值: ${currentAnswer}`, 'debug');
                                    }

                                } catch (e) {
                                    addLog(`处理第${index + 1}个空时出错: ${e.message}`, 'error');
                                }
                            } else {
                                addLog(`警告：第${index + 1}个空没有对应的答案`, 'error');
                            }
                        });
                    }


                    if (!filled) {
                        const blankInputs = [
                            ...questionElement.querySelectorAll('input[type="text"]'),
                            ...questionElement.querySelectorAll('.blank'),
                            ...questionElement.querySelectorAll('.fill-blank'),
                            ...questionElement.querySelectorAll('[class*="blank"]'),
                            ...questionElement.querySelectorAll('[class*="fill"]'),
                            ...questionElement.querySelectorAll('textarea')
                        ];

                        if (blankInputs.length > 0) {
                            addLog(`找到 ${blankInputs.length} 个普通输入框`, 'debug');
                            blankInputs.forEach((input, index) => {
                                if (index < answers.length) {
                                    try {
                                        input.value = answers[index];
                                        input.dispatchEvent(new Event('input', { bubbles: true }));
                                        input.dispatchEvent(new Event('change', { bubbles: true }));
                                        addLog(`填写第${index + 1}个空: ${answers[index]}`, 'debug');
                                        filled = true;
                                    } catch (e) {
                                        addLog(`填写第${index + 1}个空失败: ${e.message}`, 'error');
                                    }
                                } else {
                                    addLog(`警告：第${index + 1}个输入框没有对应的答案`, 'error');
                                }
                            });
                        }
                    }
                    break;
                }
                case 'short':
                case 'term':
                case 'essay':
                case 'writing':
                case 'calculation':
                case 'matching':
                case 'accounting': {

                    const textInputs = [
                        ...questionElement.querySelectorAll('textarea'),
                        ...questionElement.querySelectorAll('.answer-area'),
                        ...questionElement.querySelectorAll('.writing-area'),
                        ...questionElement.querySelectorAll('[class*="answer"]'),
                        ...questionElement.querySelectorAll('[class*="text-area"]'),
                        ...questionElement.querySelectorAll('div[contenteditable="true"]')
                    ];

                    if (textInputs.length > 0) {
                        textInputs.forEach(input => {
                            try {

                                if (input.tagName.toLowerCase() === 'textarea' || input.tagName.toLowerCase() === 'input') {
                                    input.value = answer;
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                }

                                else if (input.getAttribute('contenteditable') === 'true') {
                                    input.innerHTML = answer;
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                                addLog(`填写答案到${input.tagName.toLowerCase()}`, 'debug');
                                filled = true;
                            } catch (e) {
                                addLog(`填写答案失败: ${e.message}`, 'error');
                            }
                        });
                    }


                    const editors = [
                        ...questionElement.querySelectorAll('.editor'),
                        ...questionElement.querySelectorAll('[class*="editor"]'),
                        ...questionElement.querySelectorAll('iframe')
                    ];

                    editors.forEach(editor => {
                        try {

                            if (editor.tagName.toLowerCase() === 'iframe') {
                                const iframeDoc = editor.contentDocument || editor.contentWindow.document;
                                const editorBody = iframeDoc.body;
                                if (editorBody) {
                                    editorBody.innerHTML = answer;
                                    editorBody.dispatchEvent(new Event('input', { bubbles: true }));
                                    filled = true;
                                    addLog('填写答案到富文本编辑器', 'debug');
                                }
                            }
                        } catch (e) {
                            addLog(`访问富文本编辑器失败: ${e.message}`, 'error');
                        }
                    });
                    break;
                }
                case 'single':
                case 'multiple':
                case 'judge': {
                    let answerLetters;
                    if (type === 'multiple') {
                        answerLetters = answer.toUpperCase().split(/[,，、\s]+/).map(l => l.trim());
                    } else {
                        answerLetters = [answer.toUpperCase().trim()];
                    }

                    addLog(`识别到的选项字母: ${answerLetters.join(', ')}`, 'debug');

                    for (const letter of answerLetters) {
                        if (!/^[A-Z]$/.test(letter)) {
                            addLog(`跳过无效的选项字母: ${letter}`, 'error');
                            continue;
                        }

                        const index = letter.charCodeAt(0) - 65 + 1; // 1-based index for nth-child
                        const specificSelector = `#${questionId} > div.stem_answer > div:nth-child(${index})`;
                        const optionElement = document.querySelector(specificSelector);

                        if (optionElement) {
                            try {
                                optionElement.click();
                                addLog(`点击选项元素: ${specificSelector}`, 'debug');

                                const input = optionElement.querySelector('input');
                                if (input) {
                                    input.click();
                                    input.checked = true;
                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                    addLog(`点击选项input元素`, 'debug');
                                }

                                const label = optionElement.querySelector('label');
                                if (label) {
                                    label.click();
                                    addLog(`点击选项label元素`, 'debug');
                                }

                                filled = true;
                            } catch (e) {
                                addLog(`点击选项 ${letter} 失败: ${e.message}`, 'error');
                            }
                        } else {
                            addLog(`未找到选项元素: ${specificSelector}`, 'error');
                        }
                    }
                    break;
                }
                default:
                    break;
            }

            if (filled) {
                addLog(`答案填写成功`, 'success');
            } else {
                addLog(`答案可能未成功填写，请检查`, 'error');
            }


            try {
                const submitButtons = [
                    ...questionElement.querySelectorAll('button[type="submit"]'),
                    ...questionElement.querySelectorAll('input[type="submit"]'),
                    ...questionElement.querySelectorAll('.submit-btn'),
                    ...questionElement.querySelectorAll('.save-btn'),
                    ...questionElement.querySelectorAll('[class*="submit"]'),
                    ...questionElement.querySelectorAll('[class*="save"]')
                ];

                if (submitButtons.length > 0) {
                    submitButtons[0].click();
                    addLog('触发了提交按钮', 'debug');
                }
            } catch (e) {
                addLog(`触发提交按钮失败: ${e.message}`, 'debug');
            }

        } catch (error) {
            addLog(`答案填写失败: ${error.message}`, 'error');
        }
    }


    function debugPageStructure() {
        addLog('开始调试页面结构...', 'debug');


        addLog('页面URL: ' + window.location.href, 'debug');
        addLog('页面标题: ' + document.title, 'debug');


        const possibleContainers = [
            '.question',
            '.questionLi',
            '.subject_item',
            '.examPaper_subject',
            '.questionContainer',
            '.q-item',
            '.subject_node',
            '[class*="question"]',
            '[class*="subject"]'
        ];

        for (let selector of possibleContainers) {
            const elements = document.querySelectorAll(selector);
            addLog(`使用选择器 ${selector} 找到 ${elements.length} 个元素`, 'debug');
            if (elements.length > 0) {

                addLog(`第一个元素HTML结构：${elements[0].outerHTML.substring(0, 200)}...`, 'debug');
            }
        }


        const allElements = document.querySelectorAll('*');
        const relevantElements = Array.from(allElements).filter(el => {
            const className = el.className || '';
            const id = el.id || '';
            return (className + id).toLowerCase().includes('question') ||
                   (className + id).toLowerCase().includes('answer') ||
                   (className + id).toLowerCase().includes('option') ||
                   (className + id).toLowerCase().includes('subject');
        });

        addLog(`找到 ${relevantElements.length} 个可能相关的元素`, 'debug');
        relevantElements.forEach(el => {
            addLog(`发现元素: ${el.tagName.toLowerCase()}.${el.className}#${el.id}`, 'debug');

            addLog(`元素HTML: ${el.outerHTML.substring(0, 100)}...`, 'debug');
        });


        const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"], textarea');
        addLog(`找到 ${inputs.length} 个输入元素`, 'debug');
        inputs.forEach(input => {
            addLog(`输入元素: type=${input.type}, name=${input.name}, class=${input.className}`, 'debug');
        });
    }

    function updateStatus(running) {
        const startButton = document.getElementById('start-answer');
        const pauseButton = document.getElementById('pause-answer');

        if (running) {
            startButton.style.display = 'none';
            pauseButton.style.display = 'flex';
        } else {
            startButton.style.display = 'flex';
            pauseButton.style.display = 'none';
        }
    }


    function hasQuestions() {
        const possibleSelectors = [
            '.question',
            '.questionLi',
            '.subject_item',
            '.examPaper_subject',
            '.questionContainer',
            '.q-item',
            '.subject_node',
            '[class*="question"]',
            '[class*="subject"]',
            '.ti-item',
            '.exam-item'
        ];

        for (let selector of possibleSelectors) {
            const questions = document.querySelectorAll(selector);
            if (questions.length > 0) {
                return true;
            }
        }


        const allElements = document.querySelectorAll('*');
        const possibleQuestions = Array.from(allElements).filter(el => {
            const className = el.className || '';
            const id = el.id || '';
            const text = el.textContent || '';

            return (className + id + text).toLowerCase().includes('题目') ||
                   (className + id).toLowerCase().includes('question') ||
                   (className + id).toLowerCase().includes('subject') ||
                   /^\d+[\.。]/.test(text.trim());
        });

        return possibleQuestions.length > 0;
    }


    function showNoTaskToast() {
        const toast = document.createElement('div');
        toast.id = 'no-task-toast';
        toast.textContent = '该页面无任务';
        document.body.appendChild(toast);


        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }


    let advanceInProgress = false;


    function isQuestionAnswered(q) {
        try {

            const choiceInputs = q.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            if (choiceInputs.length > 0) {
                return Array.from(choiceInputs).some(i => i.checked);
            }

            const textInputs = q.querySelectorAll('input[type="text"], textarea');
            if (textInputs.length > 0) {
                if (Array.from(textInputs).some(t => (t.value || '').trim().length > 0)) return true;
            }
            const editableDivs = q.querySelectorAll('[contenteditable="true"]');
            if (editableDivs.length > 0) {
                if (Array.from(editableDivs).some(d => (d.innerText || d.textContent || '').trim().length > 0)) return true;
            }

            const ueTextareas = q.querySelectorAll('[id^="answerEditor"]');
            for (const ta of ueTextareas) {
                const id = ta.id;
                try {
                    if (typeof UE !== 'undefined' && UE.getEditor) {
                        const ed = UE.getEditor(id);
                        if (ed && ed.getContentTxt && ed.getContentTxt().trim().length > 0) return true;
                    }
                } catch {}
                if ((ta.value || '').trim().length > 0) return true;
            }
            const ifr = q.querySelector('iframe[id^="ueditor_"]');
            if (ifr) {
                try {
                    const doc = ifr.contentDocument || ifr.contentWindow.document;
                    const txt = (doc && doc.body && (doc.body.innerText || doc.body.textContent)) || '';
                    if (txt.trim().length > 0) return true;
                } catch {}
            }
        } catch {}
        return false;
    }


    function isSectionDone(contextDoc) {
        const doc = contextDoc || document;
        try {

            const videos = doc.querySelectorAll('video, .video-js video');
            for (const v of videos) {
                try {
                    const d = v.duration || 0;
                    const t = v.currentTime || 0;
                    if (!(v.ended || (d > 0 && t / d >= 0.985))) {
                        return false;
                    }
                } catch { return false; }
            }


            const questions = doc.querySelectorAll('.question, .questionLi, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, [class*="question"], .ti-item, .exam-item');
            for (const q of questions) {
                if (!isQuestionAnswered(q)) {
                    return false;
                }
            }


            return true;
        } catch { return false; }
    }

    async function ensureSectionCompletedAndAdvance(contextDoc) {
        if (!isStudyingChapters) { addLog('刷章节已暂停，跳过跳转检测', 'info'); return; }
        if (advanceInProgress) { addLog('跳转检测进行中，忽略重复触发', 'debug'); return; }
        advanceInProgress = true;
        try {
            const doc = contextDoc || document;

            await autoAnswerInDocument(doc);

            await tryEnterQuizAndAnswer(doc);


            let tries = 3;
            while (tries-- > 0) {
                if (!isStudyingChapters) { addLog('刷章节已暂停，终止跳转检测', 'info'); return; }
                if (isSectionDone(doc)) {
                    addLog('检测到当前小节已完成，准备跳转下一小节', 'success');
                    gotoNextSection(doc);
                    return;
                }
                await new Promise(r => setTimeout(r, 500));
            }
            addLog('当前小节未完成，暂不跳转', 'info');
        } catch (e) {
            addLog(`跳转前完成度检测出错: ${e.message}`, 'error');
        } finally {
            advanceInProgress = false;
        }
    }


    async function autoAnswer() {
        if (isAnswering) {
            addLog('自动答题已经在运行中...', 'info');
            return;
        }

        isAnswering = true;
        updateStatus(true);
        addLog('开始查找题目...', 'debug');

        try {

            addLog('当前页面URL: ' + window.location.href, 'debug');
            addLog('当前页面标题: ' + document.title, 'debug');


            const possibleSelectors = [
                '.question',
                '.questionLi',
                '.subject_item',
                '.examPaper_subject',
                '.questionContainer',
                '.q-item',
                '.subject_node',
                '[class*="question"]',
                '[class*="subject"]',
                '.ti-item',
                '.exam-item'
            ];

            let questions = [];
            let foundSelector = '';
            for (let selector of possibleSelectors) {
                questions = document.querySelectorAll(selector);
                if (questions.length > 0) {
                    foundSelector = selector;
                    addLog(`使用选择器 ${selector} 找到 ${questions.length} 个题目`, 'debug');
                    break;
                }
            }


            if (questions.length === 0) {
                addLog('使用常规选择器未找到题目，尝试查找可能的题目容器...', 'debug');


                const allElements = document.querySelectorAll('*');
                const possibleQuestions = Array.from(allElements).filter(el => {
                    const className = el.className || '';
                    const id = el.id || '';
                    const text = el.textContent || '';


                    return (className + id + text).toLowerCase().includes('题目') ||
                           (className + id).toLowerCase().includes('question') ||
                           (className + id).toLowerCase().includes('subject') ||
                           /^\d+[\.。]/.test(text.trim()); // 匹配数字开头的内容
                });

                if (possibleQuestions.length > 0) {
                    questions = possibleQuestions;
                    addLog(`通过内容分析找到 ${questions.length} 个可能的题目`, 'debug');
                }
            }

            if (questions.length === 0) {
                addLog('未找到任何题目，请确保页面已完全加载', 'error');

                addLog('页面主要内容：' + document.body.innerHTML.substring(0, 500) + '...', 'debug');
                return;
            }


            addLog(`共找到 ${questions.length} 个题目`, 'info');
            addLog('正在初始化中...', 'info');
            Array.from(questions).forEach((q, idx) => {
                addLog(`题目 ${idx + 1} 类名: ${q.className}, ID: ${q.id}`, 'debug');
            });

            for (let question of questions) {
                if (!isAnswering) {
                    addLog('自动答题已暂停', 'info');
                    break;
                }

                const questionInfo = getQuestionInfo(question);
                if (!questionInfo) {
                    addLog('题目信息获取失败，跳过当前题目', 'error');
                    continue;
                }

                addLog(`正在处理题目: ${questionInfo.question.substring(0, 30)}...`);
                addLog(`题目类型: ${questionInfo.type}`, 'debug');
                addLog(`选项数量: ${questionInfo.options.length}`, 'debug');

                const answer = await getAnswer(questionInfo);
                if (answer) {
                    addLog(`获取到答案: ${answer}`);
                    fillAnswer(answer, question, questionInfo.type);
                }

                if (isAnswering) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        } catch (error) {
            addLog(`自动答题过程出错: ${error.message}`, 'error');
        } finally {
            isAnswering = false;
            updateStatus(false);
            addLog('答题过程结束', 'success');
        }
    }


    function init() {

        let persistedStudy = false;
        try { persistedStudy = localStorage.getItem(STUDY_PERSIST_KEY) === '1'; } catch {}

        const pageTitle = document.title || '';
        const currentUrl = location.href || '';


        if (pageTitle.includes('课程') || pageTitle === '课程' || pageTitle.includes('课表') || pageTitle === '课表' ||
            pageTitle.includes('AI工作台') || pageTitle === 'AI工作台' || pageTitle.includes('知识点') || pageTitle === '知识点' ||
            pageTitle.includes('章节') || pageTitle === '章节' || pageTitle.includes('资料') || pageTitle === '资料' ||
            pageTitle.includes('错题集') || pageTitle === '错题集' || pageTitle.includes('学习记录') || pageTitle === '学习记录') {
            let pageType = '';
            if (pageTitle.includes('课表')) pageType = '课表';
            else if (pageTitle.includes('课程')) pageType = '课程';
            else if (pageTitle.includes('AI工作台')) pageType = 'AI工作台';
            else if (pageTitle.includes('知识点')) pageType = '知识点';
            else if (pageTitle.includes('章节')) pageType = '章节';
            else if (pageTitle.includes('资料')) pageType = '资料';
            else if (pageTitle.includes('错题集')) pageType = '错题集';
            else if (pageTitle.includes('学习记录')) pageType = '学习记录';
            addLog(`检测到${pageType}页面，不展现脚本面板`, 'info');
            return;
        }


        const isCourseDetailPage = () => {

            if (currentUrl.includes('/mooc2-ans/mycourse/stu') ||
                currentUrl.includes('/mycourse/studentcourse') ||
                currentUrl.includes('course/') && !currentUrl.includes('knowledge')) {


                const hasNavigationMenu = document.querySelector('.nav-content ul, .stuNavigationList ul');
                const hasModuleLinks = document.querySelectorAll('a[title="章节"], a[title="作业"], a[title="考试"], a[title="资料"]').length >= 3;


                const hasCourseInfo = document.querySelector('.classDl, .sideCon, .nav_side');


                const hasCourseId = document.querySelector('#courseid, input[name="courseid"]');

                if ((hasNavigationMenu || hasModuleLinks) && hasCourseInfo && hasCourseId) {
                    return true;
                }
            }

            return false;
        };

        if (isCourseDetailPage()) {
            addLog('检测到课程详情页面，不展现脚本面板', 'info');
            return;
        }


        const isChapterListPage = () => {

            const hasChapterList = document.querySelector('.fanyaChapter, .chapter_body, .xs_table');
            const hasChapterItems = document.querySelectorAll('.chapter_unit, .chapter_item').length > 0;
            const hasChapterStructure = document.querySelector('.chapter_th, .chapter_td');
            const hasProgressInfo = document.querySelector('.catalog_points_yi, .chapter_head');
            const hasSearchBox = document.querySelector('#searchChapterListByName, .dataSearch');


            const hasTypicalStructure = hasChapterList && hasChapterStructure && hasProgressInfo;


            const hasChapterTitles = document.querySelectorAll('.catalog_name, .newCatalog_name').length > 2;


            const urlIndicatesChapterList = currentUrl.includes('/mycourse/studentcourse') ||
                                           currentUrl.includes('/studentstudy') && !currentUrl.includes('chapterId=');


            const hasNoLearningContent = !document.querySelector('video, .video-js, iframe[src*="chaoxing"], .questionLi, .TiMu');

            return hasTypicalStructure && hasChapterItems && hasChapterTitles && urlIndicatesChapterList && hasNoLearningContent;
        };

        if (isChapterListPage()) {
            addLog('检测到章节列表页面，不展现脚本面板', 'info');
            return;
        }


        if (!persistedStudy && !hasQuestions() && !hasStudyContentDeep() && !isStudyPage()) {
            showNoTaskToast();
            return;
        }


        if (!claimOwnership()) {

            if (persistedStudy && !recoveryTimerId) {
                recoveryTimerId = setInterval(() => {
                    if (claimOwnership()) {
                        clearInterval(recoveryTimerId); recoveryTimerId = null;
                        createdPanelEl = createPanel();
                        bindPanelEvents();
                        startHeartbeat();
                        if (!isStudyingChapters) startStudyChapters();
                    }
                }, 1000);
            }
            return;
        }

        createdPanelEl = createPanel();
        bindPanelEvents();
        startHeartbeat();

        if (persistedStudy) {
            startStudyChapters();

            setTimeout(() => tryAutoSkipEmptySection(), 600);
        }
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }


    function isQuizPageDoc(doc) {
        try {
            if (doc.getElementById('form1') && doc.querySelector('#RightCon .newTestTitle')) return true;
            if (doc.querySelector('.newTestCon form#form1') && doc.querySelector('.ans-cc')) return true;
        } catch {}
        return false;
    }


    function collectQuizQuestions(doc) {
        const questions = [];
        try {

            const typeInputs = doc.querySelectorAll('input[id^="answertype"]');
            typeInputs.forEach((inp) => {
                try {
                    const id = inp.id.replace('answertype', '');
                    const qid = id.trim();
                    const block = doc.querySelector(`.singleQuesId[data="${qid}"]`) || inp.closest('.TiMu') || doc;
                    const typeVal = (inp.value || '').trim();
                    let type = '';
                    if (typeVal === '0') type = 'single';
                    else if (typeVal === '1') type = 'multiple';
                    else if (typeVal === '3') type = 'judge';
                    else if (typeVal === '2') type = 'blank';
                    else if (typeVal === '4') type = 'short';
                    else {
                        const hasTextInput = block.querySelector('input[type="text"], textarea, [contenteditable="true"], [id^="answerEditor"], iframe[id^="ueditor_"]');
                        type = hasTextInput ? 'short' : 'text';
                    }

                    const opts = [];
                    const lis = block.querySelectorAll(`ul.Zy_ulTop li[onclick][qid="${qid}"]`);
                    lis.forEach((li, idx) => {
                        const span = li.querySelector('.num_option, .num_option_dx');
                        const letter = span?.getAttribute('data') || String.fromCharCode(65 + idx);
                        const txt = (li.querySelector('a.after')?.textContent || '').trim();
                        opts.push(`${letter}. ${txt}`);
                    });

                    let qtext = '';
                    const label = block.querySelector('.Zy_TItle .fontLabel');
                    if (label) qtext = label.textContent.replace(/\s+/g, ' ').trim();
                    questions.push({ qid, type, question: qtext, options: opts });
                } catch {}
            });
        } catch {}
        return questions;
    }


    function fillQuizAnswer(doc, qid, type, answer) {
        try {
            const block = doc.querySelector(`.singleQuesId[data="${qid}"]`) || doc;
            if (!block) return false;
            if (type === 'single' || type === 'multiple' || type === 'judge') {
                let letters = [];
                if (type === 'multiple') {
                    letters = (answer || '').toUpperCase().split(/[,，、\s]+/).filter(Boolean);
                } else if (type === 'judge') {
                    const val = String(answer || '').trim().toLowerCase();

                    if (/^a$|对|true|正确/.test(val)) letters = ['A'];
                    else if (/^b$|错|false|错误/.test(val)) letters = ['B'];
                    else if (/^t$/.test(val)) letters = ['A'];
                    else if (/^f$/.test(val)) letters = ['B'];
                    else letters = [(val.match(/[ab]/i) || ['A'])[0].toUpperCase()];
                } else {
                    const m = String(answer || '').toUpperCase().match(/[A-Z]/g);
                    letters = m ? m : [];
                }

                const ul = block.querySelector('ul.Zy_ulTop');
                if (!ul) return false;


                letters.forEach((L) => {
                    let target = null;
                    if (type === 'judge') {

                        const dataVal = (L === 'A') ? 'true' : 'false';
                        target = ul.querySelector(`li .num_option[data='${dataVal}'], li .num_option_dx[data='${dataVal}']`)
                              || ul.querySelector(`li .num_option[data='${L}'], li .num_option_dx[data='${L}']`);
                    } else {
                        target = ul.querySelector(`li .num_option[data='${L}'], li .num_option_dx[data='${L}']`);
                    }
                    if (target) {
                        const li = target.closest('li');
                        safeClick(li);
                    }
                });


                const hidden = doc.getElementById(`answer${qid}`);
                if (hidden) {
                    const want = (type === 'judge')
                        ? (letters[0] === 'A' ? 'true' : 'false')
                        : letters.join('');

                    if (!hidden.value || (type !== 'multiple' && hidden.value.toLowerCase() !== want)) {
                        hidden.value = want;

                        const spans = ul.querySelectorAll(`.choice${qid}`);
                        spans.forEach(s => s.classList.remove('check_answer', 'check_answer_dx'));
                        letters.forEach((L) => {
                            let sel = null;
                            if (type === 'judge') {
                                const dv = (L === 'A') ? 'true' : 'false';
                                sel = ul.querySelector(`.choice${qid}[data='${dv}']`) || ul.querySelector(`.choice${qid}[data='${L}']`);
                            } else {
                                sel = ul.querySelector(`.choice${qid}[data='${L}']`);
                            }
                            if (sel) {
                                const isMulti = !!ul.querySelector('.num_option_dx');
                                sel.classList.add(isMulti ? 'check_answer_dx' : 'check_answer');
                                const li = sel.closest('li');
                                if (li) {
                                    li.setAttribute('aria-checked', 'true');
                                    li.setAttribute('aria-pressed', 'true');
                                }
                            }
                        });
                    }
                }
                return true;
            }
            else if (type === 'blank') {
                
                const answers = String(answer || '').split(/[,，;；、]\s*/).map(s => s.trim()).filter(Boolean);

                const ueAreas = block.querySelectorAll('[id^="answerEditor"]');
                ueAreas.forEach((ta, i) => {
                    const val = answers[i] || '';
                    if (!val) return;
                    try {
                        if (typeof UE !== 'undefined' && UE.getEditor) {
                            const ed = UE.getEditor(ta.id);
                            if (ed) {
                                ed.ready(() => {
                                    ed.setContent(val);
                                    if (typeof ed.fireEvent === 'function') ed.fireEvent('contentChange');
                                });
                            }
                        } else {
                            ta.value = val;
                            ta.dispatchEvent(new Event('input', { bubbles: true }));
                            ta.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } catch {}
                });

                const ifrs = block.querySelectorAll('iframe[id^="ueditor_"]');
                ifrs.forEach((ifr, i) => {
                    const val = answers[i] || '';
                    if (!val) return;
                    try {
                        const d = ifr.contentDocument || ifr.contentWindow?.document;
                        const body = d && d.body;
                        if (body) {
                            body.innerHTML = val;
                            body.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } catch {}
                });

                const inputs = [
                    ...block.querySelectorAll('input[type="text"]'),
                    ...block.querySelectorAll('textarea'),
                    ...block.querySelectorAll('[contenteditable="true"]')
                ];
                inputs.forEach((el, i) => {
                    const val = answers[i] || '';
                    if (!val) return;
                    try {
                        const tag = (el.tagName || '').toLowerCase();
                        if (tag === 'input' || tag === 'textarea') {
                            el.value = val;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        } else if (el.getAttribute('contenteditable') === 'true') {
                            el.innerHTML = val;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } catch {}
                });

                const hidden = doc.getElementById(`answer${qid}`);
                if (hidden) hidden.value = answers.join(' ');
                return true;
            }
            else if (type === 'text' || type === 'short' || type === 'essay' || type === 'writing') {
                
                const val = String(answer || '').trim();
                if (!val) return false;

                const ueAreas = block.querySelectorAll('[id^="answerEditor"]');
                ueAreas.forEach((ta) => {
                    try {
                        if (typeof UE !== 'undefined' && UE.getEditor) {
                            const ed = UE.getEditor(ta.id);
                            if (ed) {
                                ed.ready(() => {
                                    ed.setContent(val);
                                    if (typeof ed.fireEvent === 'function') ed.fireEvent('contentChange');
                                });
                            }
                        } else {
                            ta.value = val;
                            ta.dispatchEvent(new Event('input', { bubbles: true }));
                            ta.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    } catch {}
                });

                const ifrs = block.querySelectorAll('iframe[id^="ueditor_"]');
                ifrs.forEach((ifr) => {
                    try {
                        const d = ifr.contentDocument || ifr.contentWindow?.document;
                        const body = d && d.body;
                        if (body) {
                            body.innerHTML = val;
                            body.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } catch {}
                });

                const inputs = [
                    ...block.querySelectorAll('textarea'),
                    ...block.querySelectorAll('input[type="text"]'),
                    ...block.querySelectorAll('[contenteditable="true"]')
                ];
                inputs.forEach((el) => {
                    try {
                        const tag = (el.tagName || '').toLowerCase();
                        if (tag === 'input' || tag === 'textarea') {
                            el.value = val;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                            el.dispatchEvent(new Event('change', { bubbles: true }));
                        } else if (el.getAttribute('contenteditable') === 'true') {
                            el.innerHTML = val;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } catch {}
                });

                const hidden = doc.getElementById(`answer${qid}`);
                if (hidden) hidden.value = val;
                return true;
            }
            return false;
        } catch { return false; }
    }


    function findAndClickQuizSubmitButton(doc) {
        try {
            const targetWindow = doc.defaultView || window;


            const chaoxingSubmitMethods = [

                () => {
                    if (typeof targetWindow.btnBlueSubmit === 'function') {
                        targetWindow.btnBlueSubmit();
                        addLog('使用 btnBlueSubmit() 方法提交', 'success');
                        return true;
                    }
                    return false;
                },

                () => {
                    if (typeof targetWindow.submitCheckTimes === 'function') {
                        targetWindow.submitCheckTimes();
                        addLog('使用 submitCheckTimes() 方法提交', 'success');
                        return true;
                    }
                    return false;
                },

                () => {
                    if (typeof targetWindow.submitWork === 'function') {
                        targetWindow.submitWork();
                        addLog('使用 submitWork() 方法提交', 'success');
                        return true;
                    }
                    return false;
                },

                () => {
                    const forms = doc.querySelectorAll('form');
                    for (const form of forms) {
                        const formAction = form.action || '';
                        if (formAction.includes('work') || formAction.includes('quiz') || formAction.includes('submit')) {
                            try {
                                form.submit();
                                addLog('使用表单 submit() 方法提交', 'success');
                                return true;
                            } catch (e) {
                                addLog(`表单提交失败: ${e.message}`, 'error');
                            }
                        }
                    }
                    return false;
                }
            ];


            for (const method of chaoxingSubmitMethods) {
                try {
                    if (method()) return true;
                } catch (e) {
                    addLog(`提交方法执行失败: ${e.message}`, 'error');
                }
            }


            const submitSelectors = [
                'input[type="submit"][value*="提交"]',
                'button[type="submit"]',
                'input[value="提交答案"]',
                'input[value="提交"]',
                'button[onclick*="submit"]',
                'button[onclick*="btnBlueSubmit"]',
                'button[onclick*="submitCheckTimes"]',
                '.submit-btn',
                '.btn-submit',
                '#submit',
                '.submit',
                'input[id*="submit"]',
                'button[id*="submit"]',
                'a[onclick*="submit"]',
                'input[onclick*="tijiao"]',
                'button[onclick*="tijiao"]'
            ];

            for (const selector of submitSelectors) {
                const submitBtn = doc.querySelector(selector);
                if (submitBtn && !submitBtn.disabled && !submitBtn.classList.contains('disabled')) {
                    try {

                        submitBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });


                        const onclick = submitBtn.getAttribute('onclick');
                        if (onclick) {
                            try {

                                const func = new targetWindow.Function(onclick);
                                func.call(submitBtn);
                                addLog(`通过onclick执行提交: ${onclick}`, 'success');
                                return true;
                            } catch (e) {
                                addLog(`onclick执行失败: ${e.message}`, 'error');
                            }
                        }


                        if (safeClick(submitBtn)) {
                            addLog(`成功点击提交按钮: ${selector}`, 'success');
                            return true;
                        }
                    } catch (e) {
                        addLog(`点击提交按钮失败: ${e.message}`, 'error');
                    }
                }
            }


            const clickableElements = Array.from(doc.querySelectorAll('input, button, a, span, div'));
            for (const el of clickableElements) {
                const text = (el.textContent || el.value || '').trim();
                if (/^(提交|提交答案|完成|确认提交)$/.test(text)) {
                    try {
                        el.scrollIntoView({ block: 'center', behavior: 'smooth' });


                        const onclick = el.getAttribute('onclick');
                        if (onclick) {
                            try {
                                const func = new targetWindow.Function(onclick);
                                func.call(el);
                                addLog(`通过文本匹配和onclick执行提交: ${text}`, 'success');
                                return true;
                            } catch (e) {
                                addLog(`文本匹配onclick执行失败: ${e.message}`, 'error');
                            }
                        }

                        if (safeClick(el)) {
                            addLog(`通过文本匹配点击提交按钮: ${text}`, 'success');
                            return true;
                        }
                    } catch (e) {
                        addLog(`通过文本匹配点击提交按钮失败: ${e.message}`, 'error');
                    }
                }
            }

            addLog('未找到章节测验提交按钮', 'error');
            return false;
        } catch (e) {
            addLog(`查找提交按钮时出错: ${e.message}`, 'error');
            return false;
        }
    }


    function validateAndFixSubmitParams(doc) {
        try {
            const targetWindow = doc.defaultView || window;


            if (typeof targetWindow.workRelationId === 'undefined') {

                const workIdInputs = doc.querySelectorAll('input[name*="workRelationId"], input[id*="workRelationId"]');
                if (workIdInputs.length > 0) {
                    targetWindow.workRelationId = workIdInputs[0].value;
                    addLog(`设置workRelationId: ${targetWindow.workRelationId}`, 'debug');
                }
            }


            if (typeof targetWindow.courseId === 'undefined') {
                const courseIdInputs = doc.querySelectorAll('input[name*="courseId"], input[id*="courseId"]');
                if (courseIdInputs.length > 0) {
                    targetWindow.courseId = courseIdInputs[0].value;
                    addLog(`设置courseId: ${targetWindow.courseId}`, 'debug');
                }
            }


            if (typeof targetWindow.classId === 'undefined') {
                const classIdInputs = doc.querySelectorAll('input[name*="classId"], input[id*="classId"]');
                if (classIdInputs.length > 0) {
                    targetWindow.classId = classIdInputs[0].value;
                    addLog(`设置classId: ${targetWindow.classId}`, 'debug');
                }
            }


            const questions = doc.querySelectorAll('[class*="TiMu"], [class*="timu"]');
            questions.forEach((q, index) => {
                const qid = q.getAttribute('id') || `question_${index}`;
                let answerInput = doc.querySelector(`input[name="answer${qid}"], input[id="answer${qid}"]`);

                if (!answerInput) {

                    answerInput = doc.createElement('input');
                    answerInput.type = 'hidden';
                    answerInput.name = `answer${qid}`;
                    answerInput.id = `answer${qid}`;
                    q.appendChild(answerInput);
                    addLog(`为题目${qid}创建答案input`, 'debug');
                }
            });

            addLog('提交参数验证完成', 'debug');
            return true;
        } catch (e) {
            addLog(`提交参数验证失败: ${e.message}`, 'error');
            return false;
        }
    }


    async function handleSubmitConfirmDialog(doc, timeoutMs = 3000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            try {

                const confirmDialogSelectors = [
                    '.popDiv', '.modal', '.dialog', '.alert',
                    '.layui-layer', '.confirm-dialog', '.submit-confirm',
                    '[class*="confirm"]', '[class*="dialog"]', '[class*="modal"]'
                ];

                for (const selector of confirmDialogSelectors) {
                    const dialog = doc.querySelector(selector);
                    if (dialog && dialog.style.display !== 'none' &&
                        (dialog.textContent.includes('确认提交') ||
                         dialog.textContent.includes('提交') ||
                         dialog.textContent.includes('确定'))) {

                        addLog('检测到提交确认弹窗', 'info');


                        const confirmButtonSelectors = [
                            'button[onclick*="submit"]', 'button[value*="提交"]',
                            'button[value*="确定"]', 'button[value*="确认"]',
                            'input[type="button"][value*="提交"]',
                            'input[type="button"][value*="确定"]',
                            'input[type="button"][value*="确认"]',
                            '.confirm-btn', '.submit-btn', '.ok-btn',
                            'button:contains("提交")', 'button:contains("确定")',
                            'button:contains("确认")', 'a[onclick*="submit"]'
                        ];


                        for (const btnSelector of confirmButtonSelectors) {
                            const confirmBtn = dialog.querySelector(btnSelector) ||
                                             doc.querySelector(`${selector} ${btnSelector}`);

                            if (confirmBtn && !confirmBtn.disabled) {
                                try {

                                    const onclick = confirmBtn.getAttribute('onclick');
                                    if (onclick) {
                                        const targetWindow = doc.defaultView || window;
                                        const func = new targetWindow.Function(onclick);
                                        func.call(confirmBtn);
                                        addLog(`通过onclick执行确认提交: ${onclick}`, 'success');
                                        return true;
                                    }


                                    if (safeClick(confirmBtn)) {
                                        addLog(`点击确认提交按钮: ${btnSelector}`, 'success');
                                        return true;
                                    }
                                } catch (e) {
                                    addLog(`点击确认按钮失败: ${e.message}`, 'error');
                                }
                            }
                        }


                        const allButtons = dialog.querySelectorAll('button, input[type="button"], a');
                        for (const btn of allButtons) {
                            const text = (btn.textContent || btn.value || '').trim();
                            if (/^(提交|确定|确认|OK)$/.test(text)) {
                                try {
                                    if (safeClick(btn)) {
                                        addLog(`通过文本匹配点击确认按钮: ${text}`, 'success');
                                        return true;
                                    }
                                } catch (e) {
                                    addLog(`文本匹配点击确认按钮失败: ${e.message}`, 'error');
                                }
                            }
                        }
                    }
                }
            } catch (e) {

            }

            await new Promise(r => setTimeout(r, 200));
        }

        return false;
    }


    async function waitForQuizSubmitCompletion(doc, timeoutMs = 5000) {
        const startTime = Date.now();
        const originalUrl = doc.location.href;

        while (Date.now() - startTime < timeoutMs) {
            try {

                const successIndicators = [
                    '.success', '.alert-success', '.msg-success',
                    '[class*="success"]', '[class*="complete"]',
                    '*[text()*="提交成功"]', '*[text()*="完成"]'
                ];

                for (const selector of successIndicators) {
                    const indicator = doc.querySelector(selector);
                    if (indicator && indicator.textContent.includes('成功')) {
                        addLog('检测到提交成功提示', 'success');
                        return true;
                    }
                }


                if (doc.location.href !== originalUrl) {
                    addLog('检测到页面跳转，提交可能已完成', 'info');
                    return true;
                }


                const nextStepSelectors = [
                    'button[onclick*="next"]', 'a[onclick*="next"]',
                    'input[value*="下一"]', 'button[value*="下一"]',
                    '.next-btn', '.btn-next', '#next'
                ];

                for (const selector of nextStepSelectors) {
                    if (doc.querySelector(selector)) {
                        addLog('检测到下一步按钮，提交可能已完成', 'info');
                        return true;
                    }
                }

            } catch (e) {

            }

            await new Promise(r => setTimeout(r, 200));
        }

        addLog('等待提交完成超时', 'error');
        return false;
    }


    async function autoAnswerQuizInDocument(doc) {
        try {
            if (!isStudyingChapters) return false;
            if (!isQuizPageDoc(doc)) return false;

            await injectConsoleDecryptCode(doc);
            const qs = collectQuizQuestions(doc);
            if (!qs || qs.length === 0) return false;
            addLog(`检测到章节测验，共 ${qs.length} 题，开始作答...`, 'info');


            for (const q of qs) {
                if (!isStudyingChapters) { addLog('已暂停刷章节，停止测验作答', 'info'); return false; }
                const promptInfo = { type: q.type, question: q.question || `题目 ${q.qid}`, options: q.options || [] };
                const ans = await getAnswer(promptInfo);
                if (ans) {
                    fillQuizAnswer(doc, q.qid, q.type, ans);
                }
                await new Promise(r => setTimeout(r, 500));
            }

            addLog('章节测验答题完成，准备提交...', 'success');


            await new Promise(r => setTimeout(r, 1000));


            addLog('验证提交参数...', 'info');
            validateAndFixSubmitParams(doc);


            let submitSuccess = false;
            const targetWindow = doc.defaultView || window;


            try {

                const originalAlert = targetWindow.alert;
                targetWindow.alert = function(msg) {
                    addLog(`阻止弹窗: ${msg}`, 'debug');
                    if (msg && msg.includes('code-1')) {
                        addLog('检测到code-1错误，尝试其他提交方式', 'info');
                        return;
                    }
                    return originalAlert.call(this, msg);
                };


                if (typeof targetWindow.btnBlueSubmit === 'function') {
                    addLog('使用学习通标准提交流程', 'info');


                    targetWindow.btnBlueSubmit();
                    await new Promise(r => setTimeout(r, 1000));


                    if (typeof targetWindow.submitCheckTimes === 'function') {
                        targetWindow.submitCheckTimes();
                        addLog('执行submitCheckTimes完成', 'success');
                    }


                    if (typeof targetWindow.noSubmit === 'function') {
                        addLog('检测到noSubmit函数，跳过自动提交以避免错误', 'info');
                    }

                    submitSuccess = true;
                    addLog('学习通标准提交流程执行完成', 'success');
                } else if (typeof targetWindow.submitWork === 'function') {

                    addLog('使用submitWork提交', 'info');
                    targetWindow.submitWork();
                    submitSuccess = true;
                } else {

                    submitSuccess = findAndClickQuizSubmitButton(doc);
                }

                // 恢复原始alert targetWindow.alert = originalAlert;
            } catch (e) {
                addLog(`提交流程执行失败: ${e.message}`, 'error');

                submitSuccess = findAndClickQuizSubmitButton(doc);
            }

            if (submitSuccess) {
                addLog('已执行提交操作，等待确认弹窗...', 'info');

                await new Promise(r => setTimeout(r, 500));


                const confirmHandled = await handleSubmitConfirmDialog(doc, 3000);
                if (confirmHandled) {
                    addLog('已处理提交确认弹窗', 'success');
                } else {
                    addLog('未检测到确认弹窗或处理失败', 'info');
                }

                const submitCompleted = await waitForQuizSubmitCompletion(doc, 8000);
                if (submitCompleted) {
                    addLog('章节测验提交完成，准备跳转下一节...', 'success');


                    await new Promise(r => setTimeout(r, 2000));


                    if (isStudyingChapters) {
                        const jumpSuccess = gotoNextSection(doc);
                        if (jumpSuccess) {
                            addLog('已自动跳转到下一节', 'success');
                        } else {
                            addLog('自动跳转失败，请手动切换到下一节', 'error');
                        }
                    }
                } else {
                    addLog('等待提交完成超时，但将继续尝试跳转', 'info');

                    await new Promise(r => setTimeout(r, 1500));
                    if (isStudyingChapters) gotoNextSection(doc);
                }
            } else {
                addLog('未找到提交按钮，跳过提交直接尝试跳转', 'info');

                await new Promise(r => setTimeout(r, 1000));
                if (isStudyingChapters) gotoNextSection(doc);
            }

            return true;
        } catch (e) {
            addLog(`章节测验自动作答失败: ${e.message}`, 'error');
            return false;
        }
    }
})();