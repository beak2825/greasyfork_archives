// ==UserScript==
// @name         Adobe Firefly Auto-Clicker Pro v5.6
// @version      5.6
// @description  Standard / Fixed-time / Timer Replay (auto-capture) with CN UI.
// @author       VoidMuser
// @license      MIT
// @match        https://firefly.adobe.com/generate/image*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adobe.com
// @run-at       document-start
// @grant        none
// @namespace    
// @downloadURL https://update.greasyfork.org/scripts/557799/Adobe%20Firefly%20Auto-Clicker%20Pro%20v56.user.js
// @updateURL https://update.greasyfork.org/scripts/557799/Adobe%20Firefly%20Auto-Clicker%20Pro%20v56.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VERSION = '5.6';
    const LOG = (msg, ...args) => console.log(`[Firefly Clicker Pro] v${VERSION} ${msg}`, ...args);
    const WARN = (msg, ...args) => console.warn(`[Firefly Clicker Pro] v${VERSION} ${msg}`, ...args);
    const ERR = (msg, ...args) => console.error(`[Firefly Clicker Pro] v${VERSION} ${msg}`, ...args);

    LOG('Loaded');

    let state = {
        isRunning: false,
        clickCount: 0,
        targetClicks: 50,
        soundEnabled: true,
        startTime: null,
        isCollapsed: false,
        mode: 'standard',
        successCount: 0,
        failCount: 0,
        cleanupEnabled: true,
        knownBatchIds: new Set(),

        stdInterval: 3000,
        stdDelay: 2500,
        isWaitingForClick: false,

        fixedStartStr: '12:00:00',
        fixedStepSeconds: 30,
        fixedProcessTotal: 3,
        fixedProcessId: 1,
        fixedSchedule: [],

        // ========= 定时回放模式 =========
        replayTotal: 0,
        replayIntervalMs: 0,
        replayWaitingCapture: false,
        replayStopOnConsecutiveFail: true,
        replayConsecutiveFail: 0,
        replayRequestFailCount: 0,
        replayLastStatus: null,
        replayLastError: '',
        replayLastSentIds: [], // [{ at, requestId, clientRequestId, seed, fingerprint }]
        capturedPayload: null, // { url, headers, bodyTemplate, credentials, mode, referrer, referrerPolicy, capturedAt }
        lastGeneratePayload: null, // 最近一次“生成”请求快照（用于回放抓包兜底）
        replaySending: false, // 发送回放请求中（避免被抓包逻辑误抓到自身请求）

        // 回放时间信息
        replayStartAt: null, // 回放开始时间（用于 ETA）
        replayNextAt: null,  // 下一次回放计划时间
        replayEndAt: null,   // 预计结束时间（最后一次回放发送时刻）
        replayClockId: null, // 倒计时刷新计时器（独立于主 loop）

        timerId: null,
        attemptedClickTimes: [],
        effectiveClickTimes: [],

        isProcessingLoop: false,

        generateBtnCache: null,
        generateBtnCacheAt: 0,
        generateBtnCacheTTL: 8000,

        sessionTotals: { attempted: 0, effective: 0, success: 0, fail: 0, runs: 0 },
        lastRun: null,

        autoCaptureInFlight: false
    };

    let ui = {};

    const FIXED_RECAPTURE_MS = 40 * 60 * 1000;

    function clearMainTimer() {
        if (state.timerId) {
            clearTimeout(state.timerId);
            clearInterval(state.timerId);
            state.timerId = null;
        }
    }

    function clearReplayClock() {
        if (state.replayClockId) {
            clearInterval(state.replayClockId);
            state.replayClockId = null;
        }
    }

    function startReplayClock() {
        clearReplayClock();
        state.replayClockId = setInterval(() => {
            if (!state.isRunning || state.mode !== 'replay') {
                clearReplayClock();
                return;
            }
            try { updateReplayPanelUI(); } catch (_) { }
        }, 500);
    }

    async function copyText(text) {
        const t = String(text ?? '');
        if (!t) return false;
        try {
            await navigator.clipboard.writeText(t);
            return true;
        } catch (_) {
            try {
                const ta = document.createElement('textarea');
                ta.value = t;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                ta.style.top = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(ta);
                return !!ok;
            } catch (_) {
                return false;
            }
        }
    }

    // ========= 小工具 =========
    function formatTime(date) { return date.toTimeString().split(' ')[0]; }
    function formatDuration(ms) {
        if (ms < 0) return '00:00';
        const s = Math.floor(ms / 1000);
        return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    }
    function parseTimeStr(str) {
        const d = new Date();
        const [h, m, s] = (str || '').split(':').map(Number);
        d.setHours(h || 0, m || 0, s || 0, 0);
        return d;
    }
    function calcAvgInterval(times) {
        if (times.length < 2) return 'N/A';
        let sum = 0;
        for (let i = 1; i < times.length; i++) sum += times[i] - times[i - 1];
        return (sum / (times.length - 1) / 1000).toFixed(2) + 's';
    }

    function randomUUID() {
        try {
            if (crypto?.randomUUID) return crypto.randomUUID();
        } catch (_) { }
        const hex = [];
        for (let i = 0; i < 16; i++) hex.push(Math.floor(Math.random() * 256));
        hex[6] = (hex[6] & 0x0f) | 0x40;
        hex[8] = (hex[8] & 0x3f) | 0x80;
        const b = hex.map(x => x.toString(16).padStart(2, '0')).join('');
        return `${b.slice(0, 8)}-${b.slice(8, 12)}-${b.slice(12, 16)}-${b.slice(16, 20)}-${b.slice(20)}`;
    }

    function randomSeedInt() {
        try {
            const buf = new Uint32Array(1);
            crypto.getRandomValues(buf);
            return Number(buf[0]) % 2147483647;
        } catch (_) {
            return Math.floor(Math.random() * 2147483647);
        }
    }

    function normalizeHeaders(h) {
        const out = {};
        try {
            if (!h) return out;
            if (typeof Headers !== 'undefined' && h instanceof Headers) {
                h.forEach((v, k) => { out[String(k)] = String(v); });
                return out;
            }
            if (Array.isArray(h)) {
                for (const p of h) {
                    if (Array.isArray(p) && p.length >= 2) out[String(p[0])] = String(p[1]);
                }
                return out;
            }
            if (typeof h === 'object') {
                for (const k of Object.keys(h)) out[String(k)] = String(h[k]);
                return out;
            }
        } catch (_) { }
        return out;
    }

    function isReplayMarked(headersObj) {
        try {
            for (const k of Object.keys(headersObj || {})) {
                if (String(k).toLowerCase() === 'x-firefly-clicker-pro-replay') return true;
            }
        } catch (_) { }
        return false;
    }

    function safeShortId(v) {
        const s = String(v || '').trim();
        if (!s) return '';
        return s.length <= 10 ? s : `${s.slice(0, 8)}…`;
    }

    function maskSensitive(v) {
        const s = String(v || '');
        if (!s) return '';
        if (s.length <= 12) return `${s.slice(0, 2)}...${s.slice(-2)}`;
        return `${s.slice(0, 6)}...${s.slice(-4)}`;
    }

    function getHeaderInsensitive(headersObj, key) {
        const target = String(key || '').toLowerCase();
        for (const k of Object.keys(headersObj || {})) {
            if (String(k).toLowerCase() === target) return headersObj[k];
        }
        return undefined;
    }

    function normalizeKeyName(key) {
        return String(key || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    }

    function hashFNV1a32(input) {
        const s = String(input ?? '');
        let h = 0x811c9dc5;
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 0x01000193);
        }
        return (h >>> 0).toString(16).padStart(8, '0');
    }

    function findFirstValueByNormalizedKeys(root, normalizedTargets, maxDepth = 10) {
        try {
            const targets = new Set(Array.isArray(normalizedTargets) ? normalizedTargets.filter(Boolean) : []);
            if (!targets.size) return null;

            const queue = [{ v: root, d: 0 }];
            const seen = new Set();

            while (queue.length) {
                const { v, d } = queue.shift();
                if (!v || typeof v !== 'object') continue;
                if (seen.has(v)) continue;
                seen.add(v);

                if (!Array.isArray(v)) {
                    for (const k of Object.keys(v)) {
                        if (targets.has(normalizeKeyName(k))) return v[k];
                    }
                }
                if (d >= maxDepth) continue;

                if (Array.isArray(v)) {
                    for (const item of v) queue.push({ v: item, d: d + 1 });
                } else {
                    for (const k of Object.keys(v)) queue.push({ v: v[k], d: d + 1 });
                }
            }
        } catch (_) { }
        return null;
    }

    function extractCaptureIds(bodyTemplate) {
        try {
            const txt = String(bodyTemplate || '').trim();
            if (!txt) return {};
            const obj = JSON.parse(txt);
            const requestId = findFirstValueByNormalizedKeys(obj, ['requestId', 'request_id'].map(normalizeKeyName));
            const clientRequestId = findFirstValueByNormalizedKeys(obj, ['clientRequestId', 'client_request_id'].map(normalizeKeyName));
            let seed = findFirstValueByNormalizedKeys(obj, ['seed', 'randomSeed', 'random_seed'].map(normalizeKeyName));
            if (seed === null || seed === undefined) {
                const seeds = findFirstValueByNormalizedKeys(obj, ['seeds'].map(normalizeKeyName));
                if (Array.isArray(seeds) && seeds.length) seed = seeds[0];
                else if (typeof seeds === 'number' || (typeof seeds === 'string' && /^\d+$/.test(seeds.trim()))) seed = seeds;
            }
            return { requestId, clientRequestId, seed, fingerprint: hashFNV1a32(txt) };
        } catch (_) {
            return {};
        }
    }

    // v4.0：UI 上只显示精简 1 行，详细信息走 Copy
    function safeCaptureSummary(payload) {
        if (!payload) return '';
        const t = formatTime(new Date(payload.capturedAt || Date.now()));
        try {
            const url = String(payload.url || '');
            let hostPath = url;
            try {
                const u = new URL(url, location.href);
                hostPath = `${u.host}${u.pathname}`;
            } catch (_) { }

            const bodyLen = payload.bodyTemplate ? String(payload.bodyTemplate).length : 0;
            const ids = extractCaptureIds(payload.bodyTemplate);
            const reqPart = ids.requestId ? ` | req=${safeShortId(ids.requestId)}` : '';

            return `捕获成功 ${t} | ${hostPath} | body=${bodyLen}${reqPart}`;
        } catch (_) {
            return `捕获成功 ${t}`;
        }
    }

    function buildCaptureCopyText(payload) {
        if (!payload) return '';
        try {
            const t = formatTime(new Date(payload.capturedAt || Date.now()));
            const url = String(payload.url || '');
            const body = String(payload.bodyTemplate || '');
            const bodyLen = body.length;
            const ids = extractCaptureIds(payload.bodyTemplate);
            const headersObj = payload.headers || {};
            const auth = getHeaderInsensitive(headersObj, 'authorization');
            const cookie = getHeaderInsensitive(headersObj, 'cookie');

            const headerLines = [];
            try {
                const keys = Object.keys(headersObj || {});
                keys.sort((a, b) => String(a).localeCompare(String(b)));
                for (const k of keys) {
                    const lk = String(k).toLowerCase();
                    const v = headersObj[k];
                    if (lk === 'authorization') headerLines.push(`${k}: ${maskSensitive(v)}`);
                    else if (lk === 'cookie') headerLines.push(`${k}: ${maskSensitive(v)}`);
                    else headerLines.push(`${k}: ${String(v)}`);
                }
            } catch (_) { }

            const preview = bodyLen > 400 ? body.slice(0, 400) + '…' : body;

            return [
                `[Firefly Clicker Pro v${VERSION}] Capture Snapshot`,
                `CapturedAt: ${t}`,
                `URL: ${url}`,
                `Credentials: ${payload.credentials ?? ''}`,
                `Mode: ${payload.mode ?? ''}`,
                `Referrer: ${payload.referrer ?? ''}`,
                `ReferrerPolicy: ${payload.referrerPolicy ?? ''}`,
                `IDs: requestId=${ids.requestId ?? ''} | clientRequestId=${ids.clientRequestId ?? ''} | seed=${ids.seed ?? ''} | hash=${ids.fingerprint ?? ''}`,
                `Authorization(masked): ${auth ? maskSensitive(auth) : ''}`,
                `Cookie(masked): ${cookie ? maskSensitive(cookie) : ''}`,
                `BodyLength: ${bodyLen}`,
                `BodyPreview(<=400): ${preview}`,
                `Headers:`,
                ...headerLines
            ].join('\n');
        } catch (e) {
            return `[Firefly Clicker Pro v${VERSION}] Capture Snapshot (failed): ${String(e?.message || e || '')}`;
        }
    }

    function updateReplayPanelUI() {
        if (!ui.replayPanel) return;

        if (ui.replayCaptureStatus) {
            if (state.capturedPayload) {
                ui.replayCaptureStatus.innerText = safeCaptureSummary(state.capturedPayload);
                ui.replayCaptureStatus.style.color = '#81c784';
            } else if (state.replayWaitingCapture) {
                ui.replayCaptureStatus.innerText = '等待捕获...';
                ui.replayCaptureStatus.style.color = '#ffb74d';
            } else {
                ui.replayCaptureStatus.innerText = '尚未捕获';
                ui.replayCaptureStatus.style.color = '#aaa';
            }
        }

        if (ui.btnCopyCapture) {
            const ok = !!state.capturedPayload;
            ui.btnCopyCapture.disabled = !ok;
            ui.btnCopyCapture.style.opacity = ok ? '1' : '0.45';
        }

        if (ui.replayProgress) {
            const done = state.clickCount || 0;
            const total = state.targetClicks || 0;

            let nextCd = '--:--';
            let nextAbs = '--:--:--';
            let endAbs = '--:--:--';

            if (state.mode === 'replay' && state.isRunning && total > 0 && state.replayIntervalMs > 0) {
                if (typeof state.replayEndAt === 'number' && Number.isFinite(state.replayEndAt)) {
                    endAbs = formatTime(new Date(state.replayEndAt));
                }
                if (!state.replayWaitingCapture && typeof state.replayNextAt === 'number' && Number.isFinite(state.replayNextAt) && done < total) {
                    const diff = state.replayNextAt - Date.now();
                    nextCd = formatDuration(diff);
                    nextAbs = formatTime(new Date(state.replayNextAt));
                } else if (state.replayWaitingCapture) {
                    nextCd = '--:--';
                    nextAbs = '等待捕获';
                }
            }

            const st = (state.replayLastStatus === null || state.replayLastStatus === undefined) ? '-' : state.replayLastStatus;
            const fail = state.replayRequestFailCount || 0;
            const consec = state.replayConsecutiveFail || 0;

            ui.replayProgress.innerText = `进度: ${done}/${total} | 下次: ${nextCd}(${nextAbs}) | 结束: ${endAbs} | HTTP:${st} 失败${fail} 连败${consec}`;
        }

        if (ui.replayDedup) {
            const a = state.replayLastSentIds?.[0];
            const b = state.replayLastSentIds?.[1];

            const fmt = (o) => {
                if (!o) return '-';
                const req = o?.requestId ? safeShortId(o.requestId) : '-';
                const cli = o?.clientRequestId ? safeShortId(o.clientRequestId) : '-';
                const seed = (o?.seed !== null && o?.seed !== undefined) ? safeShortId(o.seed) : '-';
                const fp = o?.fingerprint ? safeShortId(o.fingerprint) : '-';
                return `req=${req} cli=${cli} seed=${seed} hash=${fp}`;
            };

            if (!a && !b) {
                ui.replayDedup.innerHTML = '';
            } else {
                ui.replayDedup.innerHTML = `
                    <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">最近1次: ${fmt(a)}</div>
                    <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">最近2次: ${fmt(b)}</div>
                `;
            }
        }

        if (ui.replayError) {
            if (state.replayLastError) {
                ui.replayError.style.display = 'block';
                ui.replayError.innerText = `错误: ${state.replayLastError}`;
            } else {
                ui.replayError.style.display = 'none';
                ui.replayError.innerText = '';
            }
        }

        // 状态区 ETA：回放模式显示倒计时/完结时间
        try {
            if (ui.etaDisplay && state.mode === 'replay') {
                if (!state.isRunning || state.targetClicks <= 0 || state.replayIntervalMs <= 0) {
                    ui.etaDisplay.innerText = '';
                } else {
                    const done = state.clickCount || 0;
                    const total = state.targetClicks || 0;
                    const endAbs = (typeof state.replayEndAt === 'number' && Number.isFinite(state.replayEndAt))
                        ? formatTime(new Date(state.replayEndAt))
                        : '--:--:--';

                    if (state.replayWaitingCapture) {
                        ui.etaDisplay.innerText = `下次: --:--(等待捕获) | 结束: ${endAbs}`;
                    } else {
                        const nextCd = (typeof state.replayNextAt === 'number' && Number.isFinite(state.replayNextAt) && done < total)
                            ? formatDuration(state.replayNextAt - Date.now())
                            : '--:--';
                        const nextAbs = (typeof state.replayNextAt === 'number' && Number.isFinite(state.replayNextAt))
                            ? formatTime(new Date(state.replayNextAt))
                            : '--:--:--';
                        ui.etaDisplay.innerText = `下次: ${nextCd}(${nextAbs}) | 结束: ${endAbs}`;
                    }
                }
            }
        } catch (_) { }
    }

    function deepReplaceReplayFields(value) {
        if (Array.isArray(value)) return value.map(deepReplaceReplayFields);
        if (!value || typeof value !== 'object') return value;

        for (const k of Object.keys(value)) {
            const nk = normalizeKeyName(k);
            if (nk === 'requestid' || nk === 'clientrequestid') {
                value[k] = randomUUID();
                continue;
            }
            if (nk === 'seed' || nk === 'randomseed') {
                const v = value[k];
                if (typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v.trim()))) {
                    value[k] = randomSeedInt();
                }
                continue;
            }
            if (nk === 'seeds') {
                const v = value[k];
                if (Array.isArray(v)) {
                    value[k] = v.map((item) => {
                        if (typeof item === 'number' || (typeof item === 'string' && /^\d+$/.test(String(item).trim()))) return randomSeedInt();
                        return deepReplaceReplayFields(item);
                    });
                } else if (typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v.trim()))) {
                    value[k] = randomSeedInt();
                } else {
                    value[k] = deepReplaceReplayFields(v);
                }
                continue;
            }
            value[k] = deepReplaceReplayFields(value[k]);
        }
        return value;
    }

    function buildReplayBody(bodyTemplate) {
        const txt = String(bodyTemplate || '').trim();
        if (!txt) throw new Error('Body 为空，无法回放。');
        let obj;
        try {
            obj = JSON.parse(txt);
        } catch (_) {
            throw new Error('Body 不是合法 JSON，无法回放。');
        }
        deepReplaceReplayFields(obj);
        return JSON.stringify(obj);
    }

    function shouldSniffGenerateRequest(url, method, headersObj, bodyTemplate) {
        try {
            const rawUrl = String(url || '');
            const u = rawUrl.toLowerCase();
            const m = String(method || '').toUpperCase();
            if (m !== 'POST') return false;
            if (isReplayMarked(headersObj)) return false;

            // 过滤明显噪声（统计/上报/追踪等）
            if (
                u.includes('doubleclick.net') ||
                u.includes('googleads') ||
                u.includes('googletagmanager') ||
                u.includes('sentry') ||
                u.includes('nr-data') ||
                u.includes('experienceedge') ||
                u.includes('cc-api-data.adobe.io') ||
                u.includes('/ingest') ||
                u.includes('/collect') ||
                u.includes('/log') ||
                u.includes('oobesaas')
            ) return false;

            let host = '';
            let path = '';
            try {
                const parsed = new URL(rawUrl, location.href);
                host = String(parsed.host || '').toLowerCase();
                path = String(parsed.pathname || '').toLowerCase();
            } catch (_) { }

            const hostOk =
                (host && (host.includes('adobe.io') || host.includes('ff.adobe.io'))) ||
                u.includes('adobe.io') ||
                u.includes('ff.adobe.io') ||
                // Firefly 近期可能变更生成接口 host：兜底接受 firefly/adobe.com
                host.includes('adobe.com') ||
                u.includes('adobe.com') ||
                host.includes('firefly') ||
                u.includes('firefly');
            if (!hostOk) return false;

            const p = path || u;
            // 旧版：.../generate/images 或 .../images/generate
            if (p.includes('generate/images') || p.includes('images/generate')) return true;

            // 新版：.../v2/3p-images/generate-async（以及类似路径）
            if (
                p.includes('generate-async') ||
                p.includes('/3p-images/generate') ||
                p.includes('/2p-images/generate') ||
                p.includes('images/generate-async')
            ) return true;

            // 兼容：jobs 风格提交（排除结果轮询）
            if (p.includes('/v2/jobs') && !p.includes('/result')) return true;

            // 最后兜底：看 body 特征（仅在等待捕获时才会执行到这里）
            const b = String(bodyTemplate || '').trim();
            if (!b) return false;
            const bl = b.toLowerCase();
            if (
                bl.includes('\"prompt\"') ||
                bl.includes('\"seeds\"') ||
                bl.includes('\"referenceblobs\"') ||
                bl.includes('\"modelid\"') ||
                bl.includes('\"size\"')
            ) return true;

            try {
                const obj = JSON.parse(b);
                if (!obj || typeof obj !== 'object') return false;
                if ('prompt' in obj || 'seeds' in obj || 'seed' in obj || 'referenceBlobs' in obj || 'modelId' in obj) return true;
            } catch (_) { }

            return false;
        } catch (_) {
            return false;
        }
    }

    async function extractFetchSnapshot(input, init) {
        let url = '';
        let method = 'GET';
        let headersObj = {};
        let bodyTemplate = '';
        let credentials;
        let mode;
        let referrer;
        let referrerPolicy;

        try {
            if (typeof Request !== 'undefined' && input instanceof Request) {
                url = input.url || '';
                method = (init?.method || input.method || 'GET');
                headersObj = normalizeHeaders(init?.headers || input.headers);
                credentials = init?.credentials ?? input.credentials;
                mode = init?.mode ?? input.mode;
                referrer = init?.referrer ?? input.referrer;
                referrerPolicy = init?.referrerPolicy ?? input.referrerPolicy;

                try {
                    const cloned = input.clone();
                    bodyTemplate = await cloned.text();
                } catch (_) {
                    bodyTemplate = '';
                }
            } else {
                url = String(input || '');
                method = (init?.method || 'GET');
                headersObj = normalizeHeaders(init?.headers);
                credentials = init?.credentials;
                mode = init?.mode;
                referrer = init?.referrer;
                referrerPolicy = init?.referrerPolicy;

                const b = init?.body;
                if (typeof b === 'string') bodyTemplate = b;
                else if (b && typeof b === 'object') {
                    try { bodyTemplate = JSON.stringify(b); } catch (_) { bodyTemplate = ''; }
                } else bodyTemplate = '';
            }
        } catch (_) { }

        return { url, method, headersObj, bodyTemplate, credentials, mode, referrer, referrerPolicy };
    }

    function installFetchHookOnce() {
        try {
            if (window.__firefly_clicker_pro_fetch_hook_installed) return;
            window.__firefly_clicker_pro_fetch_hook_installed = true;
        } catch (_) { return; }

        const originalFetch = window.fetch;
        if (typeof originalFetch !== 'function') return;

        window.fetch = function (input, init) {
            try {
                // 兜底：无论是否在“回放/固定”运行中，都尽量记录最近一次真实“生成”请求，便于后续回放复用。
                // 避免回放自身请求污染抓包。
                if (!state.replaySending && !state.replayWaitingCapture) {
                    try {
                        let fastUrl = '';
                        let fastMethod = 'GET';
                        let fastHeaders = {};

                        if (typeof Request !== 'undefined' && input instanceof Request) {
                            fastUrl = input.url || '';
                            fastMethod = String(init?.method || input.method || 'GET');
                            fastHeaders = normalizeHeaders(init?.headers || input.headers);
                        } else {
                            fastUrl = String(input || '');
                            fastMethod = String(init?.method || 'GET');
                            fastHeaders = normalizeHeaders(init?.headers);
                        }

                        // 先用 url/method/header 快速判断（不依赖 body），避免无意义 clone/text。
                        if (shouldSniffGenerateRequest(fastUrl, fastMethod, fastHeaders, '')) {
                            const snapPromise2 = extractFetchSnapshot(input, init);
                            Promise.resolve(snapPromise2).then((snap2) => {
                                try {
                                    if (!shouldSniffGenerateRequest(snap2.url, snap2.method, snap2.headersObj, snap2.bodyTemplate)) return;
                                    state.lastGeneratePayload = {
                                        url: snap2.url,
                                        headers: snap2.headersObj,
                                        bodyTemplate: snap2.bodyTemplate,
                                        credentials: snap2.credentials,
                                        mode: snap2.mode,
                                        referrer: snap2.referrer,
                                        referrerPolicy: snap2.referrerPolicy,
                                        capturedAt: Date.now()
                                    };
                                } catch (_) { }
                            }).catch(() => { });
                        }
                    } catch (_) { }
                }

                if (state.replayWaitingCapture && (state.mode === 'replay' || state.mode === 'fixed') && state.isRunning) {
                    const snapPromise = extractFetchSnapshot(input, init);
                    Promise.resolve(snapPromise).then((snap) => {
                        try {
                            if (!state.replayWaitingCapture) return;
                            if (!(state.mode === 'replay' || state.mode === 'fixed')) return;
                            if (!state.isRunning) return;
                            if (!shouldSniffGenerateRequest(snap.url, snap.method, snap.headersObj, snap.bodyTemplate)) return;

                            state.capturedPayload = {
                                url: snap.url,
                                headers: snap.headersObj,
                                bodyTemplate: snap.bodyTemplate,
                                credentials: snap.credentials,
                                mode: snap.mode,
                                referrer: snap.referrer,
                                referrerPolicy: snap.referrerPolicy,
                                capturedAt: Date.now()
                            };
                            state.lastGeneratePayload = state.capturedPayload;

                            state.replayWaitingCapture = false;
                            state.replayLastError = '';
                            updateReplayPanelUI();

                            if (state.mode === 'replay') {
                                updateUI(`捕获成功，已进入回放倒计时...`, '#81c784');
                                startReplayLoop();
                            } else if (state.mode === 'fixed') {
                                updateUI(`捕获成功，已进入固定时间排程...`, '#81c784');
                            }
                        } catch (e) {
                            state.replayLastError = String(e?.message || e || '捕获失败');
                            updateReplayPanelUI();
                        }
                    }).catch((e) => {
                        state.replayLastError = String(e?.message || e || '捕获失败');
                        updateReplayPanelUI();
                    });
                }
            } catch (_) { }

            return originalFetch.apply(this, arguments);
        };
    }

    function extractXhrBodyTemplate(body) {
        try {
            if (typeof body === 'string') return body;
            if (!body) return '';
            if (typeof FormData !== 'undefined' && body instanceof FormData) {
                const pairs = [];
                for (const [k, v] of body.entries()) {
                    if (typeof v === 'string') pairs.push([k, v]);
                    else if (v && typeof v === 'object' && 'name' in v) pairs.push([k, `[file:${String(v.name || '')}]`]);
                    else pairs.push([k, String(v)]);
                }
                return JSON.stringify(Object.fromEntries(pairs));
            }
            if (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) return body.toString();
            if (typeof body === 'object') return JSON.stringify(body);
            return String(body);
        } catch (_) {
            return '';
        }
    }

    function installXhrHookOnce() {
        try {
            if (window.__firefly_clicker_pro_xhr_hook_installed) return;
            window.__firefly_clicker_pro_xhr_hook_installed = true;
        } catch (_) { return; }

        const XHR = window.XMLHttpRequest;
        if (!XHR || !XHR.prototype) return;

        const originalOpen = XHR.prototype.open;
        const originalSend = XHR.prototype.send;
        const originalSetHeader = XHR.prototype.setRequestHeader;

        XHR.prototype.open = function (method, url) {
            try {
                this.__ffcp_method = method;
                this.__ffcp_url = url;
                this.__ffcp_headers = {};
            } catch (_) { }
            return originalOpen.apply(this, arguments);
        };

        XHR.prototype.setRequestHeader = function (k, v) {
            try {
                if (!this.__ffcp_headers) this.__ffcp_headers = {};
                this.__ffcp_headers[String(k)] = String(v);
            } catch (_) { }
            return originalSetHeader.apply(this, arguments);
        };

        XHR.prototype.send = function (body) {
            try {
                // 兜底：记录最近一次真实“生成”请求，便于回放复用（避免回放自身请求污染抓包）。
                if (!state.replaySending && !state.replayWaitingCapture) {
                    try {
                        const snap2 = {
                            url: this.__ffcp_url || '',
                            method: this.__ffcp_method || 'POST',
                            headersObj: normalizeHeaders(this.__ffcp_headers),
                            bodyTemplate: extractXhrBodyTemplate(body),
                            credentials: undefined,
                            mode: undefined,
                            referrer: undefined,
                            referrerPolicy: undefined
                        };

                        if (shouldSniffGenerateRequest(snap2.url, snap2.method, snap2.headersObj, snap2.bodyTemplate)) {
                            state.lastGeneratePayload = {
                                url: snap2.url,
                                headers: snap2.headersObj,
                                bodyTemplate: snap2.bodyTemplate,
                                credentials: snap2.credentials,
                                mode: snap2.mode,
                                referrer: snap2.referrer,
                                referrerPolicy: snap2.referrerPolicy,
                                capturedAt: Date.now()
                            };
                        }
                    } catch (_) { }
                }

                if (state.replayWaitingCapture && (state.mode === 'replay' || state.mode === 'fixed') && state.isRunning) {
                    const snap = {
                        url: this.__ffcp_url || '',
                        method: this.__ffcp_method || 'POST',
                        headersObj: normalizeHeaders(this.__ffcp_headers),
                        bodyTemplate: extractXhrBodyTemplate(body),
                        credentials: undefined,
                        mode: undefined,
                        referrer: undefined,
                        referrerPolicy: undefined
                    };

                    if (shouldSniffGenerateRequest(snap.url, snap.method, snap.headersObj, snap.bodyTemplate)) {
                        state.capturedPayload = {
                            url: snap.url,
                            headers: snap.headersObj,
                            bodyTemplate: snap.bodyTemplate,
                            credentials: snap.credentials,
                            mode: snap.mode,
                            referrer: snap.referrer,
                            referrerPolicy: snap.referrerPolicy,
                            capturedAt: Date.now()
                        };
                        state.lastGeneratePayload = state.capturedPayload;

                        state.replayWaitingCapture = false;
                        state.replayLastError = '';
                        updateReplayPanelUI();
                        if (state.mode === 'replay') {
                            updateUI(`捕获成功，已进入回放倒计时...`, '#81c784');
                            startReplayLoop();
                        } else if (state.mode === 'fixed') {
                            updateUI(`捕获成功，已进入固定时间排程...`, '#81c784');
                        }
                    }
                }
            } catch (_) { }

            return originalSend.apply(this, arguments);
        };
    }

    function bumpTotal(field, delta = 1) {
        try {
            state.sessionTotals[field] = (Number(state.sessionTotals[field]) || 0) + delta;
        } catch (_) { }
    }

    function setLastRun(reason) {
        try {
            if (!state.startTime) return;
            const endedAt = Date.now();
            state.lastRun = {
                reason: String(reason || ''),
                mode: state.mode,
                startTime: state.startTime,
                endTime: endedAt,
                targetClicks: state.targetClicks,
                clickCount: state.clickCount,
                successCount: state.successCount,
                failCount: state.failCount,
                avgAttempt: calcAvgInterval(state.attemptedClickTimes),
                avgEffective: calcAvgInterval(state.effectiveClickTimes)
            };
            bumpTotal('runs', 1);
        } catch (_) { }
    }

    function getBatchId(batch) {
        const id = batch?.getAttribute?.('batchid');
        if (id === null || id === undefined) return null;
        const trimmed = String(id).trim();
        return trimmed ? trimmed : null;
    }
    function safeNumFromBatchId(batch) {
        const id = getBatchId(batch);
        return Number(id) || 0;
    }

    // ========= 1) 核心查找：Shadow DOM 穿透批次容器 =========
    function findAllContainers() {
        try {
            const gen = document.querySelector('firefly-image-generation');
            if (!gen || !gen.shadowRoot) return [];

            let panelParent = gen.shadowRoot;
            const tabContents = gen.shadowRoot.querySelector('firefly-image-generation-generate-tab-contents');
            if (tabContents && tabContents.shadowRoot) {
                panelParent = tabContents.shadowRoot;
            }

            const panel = panelParent.querySelector('firefly-image-generation-images-panel');
            if (!panel || !panel.shadowRoot) return [];

            const listHost = panel.shadowRoot.querySelector('firefly-image-generation-batch-list');
            if (!listHost) return [];

            let batches = [];

            if (listHost.shadowRoot) {
                const shadowBatches = listHost.shadowRoot.querySelectorAll('firefly-image-generation-batch');
                if (shadowBatches.length > 0) batches = Array.from(shadowBatches);
            }

            if (batches.length === 0) {
                const lightBatches = listHost.querySelectorAll('firefly-image-generation-batch');
                if (lightBatches.length > 0) batches = Array.from(lightBatches);
            }

            return batches;
        } catch (e) {
            WARN('Error finding containers:', e);
            return [];
        }
    }

    // ========= 2) 统计逻辑 =========
    function checkNewResults() {
        const currentContainers = findAllContainers();

        const newContainers = currentContainers.filter(batch => {
            const id = getBatchId(batch);
            return id && !state.knownBatchIds.has(id);
        });

        if (newContainers.length > 0) {
            LOG(`发现 ${newContainers.length} 个新结果`);
            newContainers.forEach(batch => {
                const batchId = getBatchId(batch);
                if (!batchId) return;

                let isFail = false;
                if (batch.shadowRoot) {
                    const grid = batch.shadowRoot.querySelector('firefly-collapsible-batch-grid');
                    if (grid && grid.hasAttribute('error')) isFail = true;

                    if (!isFail) {
                        const errEl = batch.shadowRoot.querySelector('[class*="error"], [class*="Error"]');
                        if (errEl) isFail = true;
                    }
                }

                if (isFail) {
                    state.failCount++;
                    bumpTotal('fail', 1);
                    LOG(`[Stats] Batch ${batchId} marked as FAILED`);
                } else {
                    state.successCount++;
                    bumpTotal('success', 1);
                    LOG(`[Stats] Batch ${batchId} marked as SUCCESS`);
                }

                state.knownBatchIds.add(batchId);
            });
            updateStatsUI();
        }
    }

    // ========= 3) 清理逻辑 =========
    function performCleanup() {
        const allContainers = findAllContainers();
        allContainers.sort((a, b) => safeNumFromBatchId(a) - safeNumFromBatchId(b));

        // 标准/回放保留3（便于观察）；固定时间全自动只保留1
        const keepRecentCount = state.mode === 'fixed' ? 1 : 3;

        if (allContainers.length > keepRecentCount) {
            const removeCount = allContainers.length - keepRecentCount;
            for (let i = 0; i < removeCount; i++) {
                const batch = allContainers[i];
                if (batch && batch.isConnected) {
                    try {
                        const batchId = getBatchId(batch);
                        if (batchId) state.knownBatchIds.delete(batchId);
                        batch.remove();
                    } catch (e) {
                        WARN('Failed to remove container', e);
                    }
                }
            }
        }
    }

    function initDOMTracker() {
        LOG('Initializing DOM Tracker...');
        const currentContainers = findAllContainers();
        currentContainers.forEach(batch => {
            const id = getBatchId(batch);
            if (id) state.knownBatchIds.add(id);
        });
        LOG(`Initial known batch IDs: ${state.knownBatchIds.size}`);
    }

    // ========= 音效 =========
    function playSuccessSound() {
        if (!state.soundEnabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);

            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 1.0);

            setTimeout(() => {
                try { ctx.close(); } catch (_) { }
            }, 1200);
        } catch (e) {
            ERR('Sound error:', e);
        }
    }

    // ========= 生成按钮查找（缓存 + Shadow 深搜） =========
    function invalidateGenerateBtnCache() {
        state.generateBtnCache = null;
        state.generateBtnCacheAt = 0;
    }
    function getCachedGenerateBtn() {
        const el = state.generateBtnCache;
        if (!el) return null;
        if (!el.isConnected) { invalidateGenerateBtnCache(); return null; }
        if (Date.now() - state.generateBtnCacheAt > state.generateBtnCacheTTL) { invalidateGenerateBtnCache(); return null; }
        return el;
    }

    function deepShadowFind(startRoot, selectors, maxDepth = 6, maxShadowRoots = 120) {
        const queue = [{ root: startRoot, depth: 0 }];
        const seen = new Set();
        let expanded = 0;

        while (queue.length) {
            const { root, depth } = queue.shift();
            if (!root || seen.has(root)) continue;
            seen.add(root);

            for (const sel of selectors) {
                try {
                    const el = root.querySelector?.(sel);
                    if (el) return el;
                } catch (_) { }
            }

            if (depth >= maxDepth) continue;

            let els = [];
            try { els = root.querySelectorAll ? root.querySelectorAll('*') : []; } catch (_) { els = []; }

            for (const el of els) {
                if (el && el.shadowRoot) {
                    queue.push({ root: el.shadowRoot, depth: depth + 1 });
                    expanded++;
                    if (expanded >= maxShadowRoots) return null;
                }
            }
        }
        return null;
    }

    function normalizeText(str) {
        return String(str || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function isProbablyVisible(el) {
        try {
            if (!el || !el.isConnected) return false;
            const style = window.getComputedStyle?.(el);
            if (style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) return false;
            const rects = el.getClientRects?.();
            return !!(rects && rects.length > 0);
        } catch (_) {
            return true;
        }
    }

    function getElementLabel(el) {
        try {
            const parts = [];
            const attrs = ['aria-label', 'title', 'data-testid', 'id', 'name'];
            for (const a of attrs) {
                const v = el?.getAttribute?.(a);
                if (v) parts.push(v);
            }
            const txt = el?.innerText || el?.textContent;
            if (txt) parts.push(txt);
            return parts.join(' ').trim();
        } catch (_) {
            return '';
        }
    }

    function scoreGenerateCandidate(el) {
        if (!el || !el.isConnected) return -1;
        const label = normalizeText(getElementLabel(el));
        if (!label) return -1;

        let score = 0;

        try {
            const hasIcon = !!(el.querySelector?.('firefly-icon-ai-generate') || el.shadowRoot?.querySelector?.('firefly-icon-ai-generate'));
            if (hasIcon) score += 30;
        } catch (_) { }

        if (label.includes('generate-image-generate-button')) return 200;
        if (label.includes('generate-button')) return 180;

        const positives = [
            'generate image', 'generate', 'regenerate', 're-generate', 'create',
            '生成图像', '生成图片', '生成', '创建', '生成影像'
        ];

        const negatives = [
            'download', 'share', 'cancel', 'close', 'remove', 'delete', 'edit',
            '下载', '分享', '取消', '关闭', '移除', '删除', '编辑',
            'batch', 'select batch', 'choose batch', 'batch selection', 'select a batch',
            '选择批次', '选择批量', '批次'
        ];

        for (const p of positives) if (label.includes(normalizeText(p))) score += 40;
        for (const n of negatives) if (label.includes(normalizeText(n))) score -= 45;

        if (label.includes('generating') || label.includes('生成中')) score += 15;

        const tag = (el.tagName || '').toLowerCase();
        if (tag === 'sp-button') score += 10;
        if (tag === 'button') score += 4;

        if (!isProbablyVisible(el)) score -= 25;
        return score;
    }

    function deepShadowFindAll(startRoot, selector, maxDepth = 7, maxShadowRoots = 240, maxResults = 30) {
        const queue = [{ root: startRoot, depth: 0 }];
        const seen = new Set();
        let expanded = 0;
        const results = [];

        while (queue.length) {
            const { root, depth } = queue.shift();
            if (!root || seen.has(root)) continue;
            seen.add(root);

            try {
                const found = root.querySelectorAll?.(selector);
                if (found?.length) {
                    for (const el of found) {
                        results.push(el);
                        if (results.length >= maxResults) return results;
                    }
                }
            } catch (_) { }

            if (depth >= maxDepth) continue;

            let els = [];
            try { els = root.querySelectorAll ? root.querySelectorAll('*') : []; } catch (_) { els = []; }

            for (const el of els) {
                if (el && el.shadowRoot) {
                    queue.push({ root: el.shadowRoot, depth: depth + 1 });
                    expanded++;
                    if (expanded >= maxShadowRoots) return results;
                }
            }
        }
        return results;
    }

    function resolveClickableFromNode(node, maxHops = 14) {
        let cur = node;
        for (let i = 0; i < maxHops && cur; i++) {
            try {
                if (cur instanceof Element) {
                    if (cur.matches?.('sp-button, sp-action-button, button, [role="button"]')) return cur;
                    const c = cur.closest?.('sp-button, sp-action-button, button, [role="button"]');
                    if (c) return c;
                }
            } catch (_) { }

            try {
                const root = cur.getRootNode?.();
                if (root && root instanceof ShadowRoot && root.host) {
                    cur = root.host;
                    continue;
                }
            } catch (_) { }

            cur = cur.parentElement;
        }
        return null;
    }

    function findGenerateButtonByIcon() {
        try {
            const icons = deepShadowFindAll(document, 'firefly-icon-ai-generate', 7, 260, 40);
            if (!icons.length) return null;

            let best = null;
            let bestScore = -Infinity;

            for (const icon of icons) {
                const btn = resolveClickableFromNode(icon, 18);
                if (!btn) continue;
                if (!isProbablyVisible(btn)) continue;

                const s = scoreGenerateCandidate(btn);
                if (s > bestScore) {
                    best = btn;
                    bestScore = s;
                }
            }

            return bestScore >= 60 ? best : null;
        } catch (_) {
            return null;
        }
    }

    function isLikelyGenerateButton(el) {
        try { return scoreGenerateCandidate(el) >= 60; } catch (_) { return false; }
    }

    function getLikelyRoots() {
        const roots = [];
        try {
            const gen = document.querySelector('firefly-image-generation');
            if (gen?.shadowRoot) roots.push(gen.shadowRoot);
            const tabContents = gen?.shadowRoot?.querySelector?.('firefly-image-generation-generate-tab-contents');
            if (tabContents?.shadowRoot) roots.push(tabContents.shadowRoot);
        } catch (_) { }

        try {
            const frames = document.querySelectorAll('iframe');
            frames.forEach(f => {
                try {
                    const doc = f.contentDocument;
                    if (doc) roots.push(doc);
                } catch (_) { }
            });
        } catch (_) { }

        roots.push(document);
        return roots;
    }

    function deepShadowFindBestGenerateButton(startRoot, maxDepth = 6, maxShadowRoots = 180, maxButtons = 800) {
        const queue = [{ root: startRoot, depth: 0 }];
        const seen = new Set();
        let expanded = 0;
        let scannedButtons = 0;

        let best = null;
        let bestScore = -Infinity;

        while (queue.length) {
            const { root, depth } = queue.shift();
            if (!root || seen.has(root)) continue;
            seen.add(root);

            let btns = [];
            try {
                btns = root.querySelectorAll ? root.querySelectorAll('sp-button, sp-action-button, button, [role="button"]') : [];
            } catch (_) {
                btns = [];
            }

            for (const el of btns) {
                const s = scoreGenerateCandidate(el);
                if (s > bestScore) {
                    best = el;
                    bestScore = s;
                    if (bestScore >= 160) return best;
                }
                scannedButtons++;
                if (scannedButtons >= maxButtons && bestScore >= 80) return best;
            }

            if (depth >= maxDepth) continue;

            let els = [];
            try { els = root.querySelectorAll ? root.querySelectorAll('*') : []; } catch (_) { els = []; }

            for (const el of els) {
                if (el && el.shadowRoot) {
                    queue.push({ root: el.shadowRoot, depth: depth + 1 });
                    expanded++;
                    if (expanded >= maxShadowRoots) break;
                }
            }
        }

        return bestScore >= 70 ? best : null;
    }

    function findGenerateButton(root = document) {
        const cached = getCachedGenerateBtn();
        if (cached) return cached;

        const selectors = [
            'sp-button[data-testid="generate-image-generate-button"]',
            'sp-button#generate-button',
            '[data-testid="generate-image-generate-button"]',
            'sp-button[data-testid*="generate"]',
            'button[data-testid*="generate"]',
            'sp-action-button[data-testid*="generate"]',
            'button[aria-label*="Generate"]',
            'sp-button[aria-label*="Generate"]',
            'button[aria-label*="生成"]',
            'sp-button[aria-label*="生成"]'
        ];

        for (const sel of selectors) {
            try {
                const el = root.querySelector(sel);
                if (el && isLikelyGenerateButton(el)) {
                    state.generateBtnCache = el;
                    state.generateBtnCacheAt = Date.now();
                    return el;
                }
            } catch (_) { }
        }

        const likelyRoots = getLikelyRoots();
        for (const r of [root, ...likelyRoots]) {
            for (const sel of selectors) {
                try {
                    const el = r.querySelector(sel);
                    if (el && isLikelyGenerateButton(el)) {
                        state.generateBtnCache = el;
                        state.generateBtnCacheAt = Date.now();
                        return el;
                    }
                } catch (_) { }
            }
        }

        const byIcon = findGenerateButtonByIcon();
        if (byIcon) {
            state.generateBtnCache = byIcon;
            state.generateBtnCacheAt = Date.now();
            return byIcon;
        }

        const found = deepShadowFind(document, selectors, 6, 120);
        if (found && isLikelyGenerateButton(found)) {
            state.generateBtnCache = found;
            state.generateBtnCacheAt = Date.now();
            return found;
        }

        const fuzzy = deepShadowFindBestGenerateButton(document, 6, 180, 800);
        if (fuzzy) {
            state.generateBtnCache = fuzzy;
            state.generateBtnCacheAt = Date.now();
            return fuzzy;
        }

        return null;
    }

    function waitForGenerateButton(timeoutMs = 1800) {
        const start = Date.now();
        return new Promise(resolve => {
            let done = false;
            const finish = (btn) => {
                if (done) return;
                done = true;
                try { if (timer) clearInterval(timer); } catch (_) { }
                try { if (obs) obs.disconnect(); } catch (_) { }
                resolve(btn || null);
            };

            const tick = () => {
                const btn = findGenerateButton();
                if (btn) return finish(btn);
                if (Date.now() - start >= timeoutMs) return finish(null);
            };

            let timer = null;
            let obs = null;
            try { timer = setInterval(tick, 120); } catch (_) { }
            try {
                obs = new MutationObserver(tick);
                obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
            } catch (_) { }
            tick();
        });
    }

    // ========= UI 更新 =========
    function updateStandardETA() {
        if (!state.isRunning || state.clickCount === 0) return;
        const now = Date.now();
        const elapsed = now - state.startTime;
        const etaMs = (elapsed / state.clickCount) * (state.targetClicks - state.clickCount);
        const etaTime = new Date(now + etaMs);
        ui.etaDisplay.innerHTML = `剩余: ${formatDuration(etaMs)} <span style="color:#888">|</span> 结束: ${formatTime(etaTime)}`;
    }

    function updateStatsUI() {
        if (ui.successStats) {
            const count = state.clickCount > 0 ? state.clickCount : 0;
            const success = state.successCount;
            const rate = count > 0 ? ((success / count) * 100).toFixed(1) : 0;
            ui.successStats.innerHTML = `
                <div>尝试: ${count} | 成功: <b style="color:#4caf50">${success}</b> (${rate}%)</div>
                ${state.failCount > 0 ? `<div style="color:#ff5252; font-size:10px;">失败/错误: ${state.failCount}</div>` : ''}
            `;
        }
        if (ui.totalStats) {
            const t = state.sessionTotals || { attempted: 0, effective: 0, success: 0, fail: 0, runs: 0 };
            ui.totalStats.innerHTML = `累计: 尝试 ${t.attempted} | 有效点击 ${t.effective} | 成功 ${t.success} | 失败 ${t.fail} | 运行 ${t.runs}`;
        }
        if (ui.lastStats) {
            const lr = state.lastRun;
            if (!lr) {
                ui.lastStats.innerHTML = '';
            } else {
                const dur = (Number(lr.endTime) && Number(lr.startTime)) ? formatDuration(Number(lr.endTime) - Number(lr.startTime)) : '';
                ui.lastStats.innerHTML = `上次: ${lr.mode || ''} ${dur ? `(${dur})` : ''} | ${lr.clickCount || 0}/${lr.targetClicks || 0} | 成功 ${lr.successCount || 0} 失败 ${lr.failCount || 0}`;
            }
        }

        // 回放模式隐藏“平均尝试/平均有效”
        if (ui.avgDisplay) {
            if (state.mode === 'replay') {
                ui.avgDisplay.style.display = 'none';
            } else {
                ui.avgDisplay.style.display = 'block';
                ui.avgDisplay.innerHTML = `平均尝试: ${calcAvgInterval(state.attemptedClickTimes)} | 平均有效: ${calcAvgInterval(state.effectiveClickTimes)}`;
            }
        }

        updateReplayPanelUI();
    }

    function updateStatus(text, color = '#ddd') {
        if (ui.statusMsg) {
            ui.statusMsg.innerText = text;
            ui.statusMsg.style.color = color;
        }
    }

    function updateUI(statusMsg, colorCode) {
        const statusLabel = state.isRunning ? '运行中' : '待机';
        const statusColor = colorCode || (state.isRunning ? '#4caf50' : '#888');

        if (ui.statusHeader) {
            ui.statusHeader.innerHTML = `● ${statusLabel}`;
            ui.statusHeader.style.color = statusColor;
        }
        if (ui.countDisplay) ui.countDisplay.innerHTML = `<b style="color:#fff">${state.clickCount}</b> / ${state.targetClicks}`;
        if (statusMsg) updateStatus(statusMsg, colorCode);

        if (state.isRunning) {
            ui.startBtn.disabled = true; ui.startBtn.style.opacity = '0.5';
            ui.stopBtn.disabled = false; ui.stopBtn.style.opacity = '1';
            toggleInputs(true);
        } else {
            ui.startBtn.disabled = false; ui.startBtn.style.opacity = '1';
            ui.stopBtn.disabled = true; ui.stopBtn.style.opacity = '0.5';
            toggleInputs(false);
        }
        updateStatsUI();
    }

    function toggleInputs(disabled) {
        const inputs = ui.mainContent.querySelectorAll('input, select');
        inputs.forEach(el => el.disabled = disabled);

        ui.modeStd.disabled = disabled;
        ui.modeFix.disabled = disabled;
        if (ui.modeReplay) ui.modeReplay.disabled = disabled;

        if (ui.procContainer) {
            Array.from(ui.procContainer.children).forEach(btn => btn.disabled = disabled);
        }
        if (ui.btnNextMin) ui.btnNextMin.disabled = disabled;
        if (ui.btnCopyTime) ui.btnCopyTime.disabled = disabled;
        if (ui.btnManualCleanup) ui.btnManualCleanup.disabled = disabled;
        if (ui.btnClearCapture) ui.btnClearCapture.disabled = disabled;
    }

    // ========= 点击前例程 =========
    function executePreClickRoutine() {
        updateStatus('准备中... (清理/同步)', '#9c27b0');
        checkNewResults();
        if (state.cleanupEnabled) performCleanup();
        updateStatsUI();
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    // ========= 统一点击方法 =========
    function triggerGenerateClick(el) {
        if (!el) return false;

        const mkPointer = (type) => {
            try {
                return new PointerEvent(type, {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    pointerId: 1,
                    pointerType: 'mouse',
                    isPrimary: true,
                    button: 0,
                    buttons: 1,
                    view: window
                });
            } catch (_) { return null; }
        };

        const mkMouse = (type) => {
            try {
                return new MouseEvent(type, {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    button: 0,
                    buttons: 1,
                    view: window
                });
            } catch (_) { return null; }
        };

        const fireSeq = (target) => {
            if (!target) return;

            try { target.focus?.(); } catch (_) { }
            try { const ev = mkPointer('pointerdown'); if (ev) target.dispatchEvent(ev); } catch (_) { }
            try { const ev = mkMouse('mousedown'); if (ev) target.dispatchEvent(ev); } catch (_) { }
            try { const ev = mkPointer('pointerup'); if (ev) target.dispatchEvent(ev); } catch (_) { }
            try { const ev = mkMouse('mouseup'); if (ev) target.dispatchEvent(ev); } catch (_) { }
            try { target.click?.(); } catch (_) { }
            try { const ev = mkMouse('click'); if (ev) target.dispatchEvent(ev); } catch (_) { }
        };

        try { el.scrollIntoView?.({ block: 'center', inline: 'center' }); } catch (_) { }
        try { el.focus?.(); } catch (_) { }

        fireSeq(el);

        try {
            const inner = el.shadowRoot?.querySelector?.('button, [role="button"]');
            if (inner) fireSeq(inner);
        } catch (_) { }

        return true;
    }

    function isButtonDisabledOrPending(btn) {
        try {
            if (!btn) return true;

            const ariaDisabled = String(btn.getAttribute?.('aria-disabled') || '').toLowerCase() === 'true';
            const disabled = !!(btn.disabled || btn.hasAttribute?.('disabled') || ariaDisabled);

            const pending = !!(btn.hasAttribute?.('pending') || btn.getAttribute?.('pending') === '' ||
                String(btn.getAttribute?.('data-pending') || '').toLowerCase() === 'true');

            let innerDisabled = false;
            try {
                const inner = btn.shadowRoot?.querySelector?.('button, [role="button"]');
                if (inner) {
                    const innerAria = String(inner.getAttribute?.('aria-disabled') || '').toLowerCase() === 'true';
                    innerDisabled = !!(inner.disabled || inner.hasAttribute?.('disabled') || innerAria);
                }
            } catch (_) { }

            return disabled || pending || innerDisabled;
        } catch (_) {
            return false;
        }
    }

    // ========= 标准模式 =========
    async function performStandardClick() {
        if (!state.isRunning || state.isWaitingForClick) return;
        if (state.clickCount >= state.targetClicks) {
            playSuccessSound();
            stopAutoClick('任务完成');
            return;
        }

        let button = findGenerateButton();
        if (!button) {
            updateStatus('未找到生成按钮，等待页面渲染...', '#ff9800');
            button = await waitForGenerateButton(1800);
        }

        if (button) {
            if (!isButtonDisabledOrPending(button)) {
                state.attemptedClickTimes.push(Date.now());
                bumpTotal('attempted', 1);
                state.isWaitingForClick = true;

                const delaySecs = state.stdDelay / 1000;
                updateStatus(`CD中... ${delaySecs}s 后点击`, '#ffeb3b');

                setTimeout(async () => {
                    if (!state.isRunning) return;

                    await executePreClickRoutine();

                    const freshBtn = findGenerateButton();
                    if (freshBtn && !isButtonDisabledOrPending(freshBtn)) {
                        triggerGenerateClick(freshBtn);
                        state.effectiveClickTimes.push(Date.now());
                        bumpTotal('effective', 1);
                        state.clickCount++;
                        updateUI(`已点击 (标准模式)`);
                        updateStandardETA();
                        updateStatsUI();
                    } else {
                        updateStatus('跳过 (按钮状态改变)');
                    }
                    state.isWaitingForClick = false;
                }, state.stdDelay);

            } else {
                updateStatus('等待生成/按钮不可用');
            }
        } else {
            updateStatus('未找到按钮', '#f44336');
            invalidateGenerateBtnCache();
        }
    }

    async function standardMainLoop() {
        if (!state.isRunning || state.mode !== 'standard') return;
        await performStandardClick();
        if (!state.isRunning) return;
        state.timerId = setTimeout(standardMainLoop, state.stdInterval);
    }

    // ========= 固定模式 =========
    function recalcFixedSchedule() {
        const startStr = ui.fixedStartInput.value || formatTime(new Date());
        const stepSec = parseInt(ui.fixedStepInput.value, 10) || 30;
        const totalProc = parseInt(ui.fixedProcTotalInput.value, 10) || 3;

        // 修复 fixedProcessId 越界导致排程偏移
        state.fixedProcessId = Math.min(Math.max(1, state.fixedProcessId), totalProc);

        const currentProc = state.fixedProcessId;
        const totalClicks = parseInt(ui.countInput.value, 10) || 50;

        state.fixedStartStr = startStr;
        state.fixedStepSeconds = stepSec;
        state.fixedProcessTotal = totalProc;

        let baseTime = parseTimeStr(startStr).getTime();

        const now = Date.now();
        if (baseTime < now - 3000) {
            baseTime += 24 * 60 * 60 * 1000;
        }

        const offsetMs = (currentProc - 1) * (stepSec * 1000);
        const loopDurationMs = totalProc * stepSec * 1000;

        state.fixedSchedule = [];
        for (let i = 0; i < totalClicks; i++) {
            state.fixedSchedule.push(baseTime + offsetMs + (i * loopDurationMs));
        }

        if (state.fixedSchedule.length > 0 && !state.isRunning) {
            const firstTime = new Date(state.fixedSchedule[0]);
            const lastTime = new Date(state.fixedSchedule[state.fixedSchedule.length - 1]);
            ui.fixedStats.innerHTML = `
                <div style="display:flex; justify-content:space-between; color:#4fc3f7;">
                    <span>首刀: ${formatTime(firstTime)}</span>
                    <span>完工: ${formatTime(lastTime)}</span>
                </div>
            `;
        }
    }

    function calcFixedNextDelay() {
        const now = Date.now();
        const target = state.fixedSchedule[state.clickCount];
        if (!target) return 500;

        const diff = target - now;

        if (diff <= -5000) return 0;
        if (diff > 30000) return 1000;
        if (diff > 8000) return 300;
        if (diff > 2000) return 120;
        return 50;
    }

    async function runFixedTimeOnce() {
        if (state.isProcessingLoop) return;

        const now = Date.now();
        const target = state.fixedSchedule[state.clickCount];

        if (state.clickCount >= state.targetClicks) {
            playSuccessSound();
            stopAutoClick('任务完成 (固定模式)');
            return;
        }
        if (!target) {
            stopAutoClick('固定计划为空/无效');
            return;
        }

        if (target > now) {
            const diff = Math.ceil((target - now) / 1000);
            updateStatus(`等待锁定时间... ${diff}s`, '#2196f3');
            ui.etaDisplay.innerText = `下一次: ${formatTime(new Date(target))}`;
            return;
        }

        const timeWindow = 3000;
        if (now > target + timeWindow) {
            LOG(`[Fixed] Missed window for click #${state.clickCount + 1}. Skipping.`);
            state.clickCount++;
            updateUI('过时不候 (跳过)', '#ff9800');
            return;
        }

        state.isProcessingLoop = true;
        try {
            if (!state.capturedPayload || (Date.now() - state.capturedPayload.capturedAt >= FIXED_RECAPTURE_MS)) {
                state.capturedPayload = null;
                state.replayWaitingCapture = true;
                autoCaptureFromGenerateClickOnce();
                return;
            }

            state.attemptedClickTimes.push(now);
            bumpTotal('attempted', 1);
            await executePreClickRoutine();

            await sendReplayRequestOnce('Fixed');
            if (state.replayLastStatus && state.replayLastStatus >= 200 && state.replayLastStatus < 300) {
                state.effectiveClickTimes.push(Date.now());
                bumpTotal('effective', 1);
            }

            if (state.replayLastStatus === 401 || state.replayLastStatus === 403) {
                state.capturedPayload = null;
                state.replayWaitingCapture = true;
                autoCaptureFromGenerateClickOnce();
                updateUI('鉴权失效，重新捕获中...', '#ff9800');
            }

            LOG(`[Fixed] Clicked #${state.clickCount + 1} at ${formatTime(new Date())}`);
            state.clickCount++;
            updateUI('命中时间窗口!', '#4caf50');
            updateStatsUI();
        } finally {
            state.isProcessingLoop = false;
        }
    }

    async function fixedMainLoop() {
        if (!state.isRunning || state.mode !== 'fixed') return;

        await runFixedTimeOnce();

        if (!state.isRunning) return;
        const delay = calcFixedNextDelay();
        state.timerId = setTimeout(fixedMainLoop, delay);
    }

    // ========= 定时回放模式 =========
    function readReplaySettingsFromUI() {
        const total = parseInt(ui.replayCountInput?.value, 10) || 0;
        const intervalSec = parseFloat(ui.replayIntervalInput?.value) || 0;
        state.replayTotal = Math.max(0, total);
        state.replayIntervalMs = Math.max(0, intervalSec * 1000);
        state.replayStopOnConsecutiveFail = !!ui.replayStopOnFailCheck?.checked;
        state.targetClicks = state.replayTotal;
    }

    function resetReplayRuntime() {
        state.replayWaitingCapture = false;
        state.replayConsecutiveFail = 0;
        state.replayRequestFailCount = 0;
        state.replayLastStatus = null;
        state.replayLastError = '';
        state.replayLastSentIds = [];

        state.replayStartAt = null;
        state.replayNextAt = null;
        state.replayEndAt = null;
    }

    function buildReplayHeaders(headersObj) {
        const src = headersObj || {};
        const out = {};

        // Firefly generate endpoints are cross-site and currently only allow a small
        // set of request headers in CORS preflight (typically: authorization,
        // content-type, x-api-key). Adding custom headers (e.g. a replay marker)
        // can break the request.
        for (const k of Object.keys(src)) {
            const lk = String(k).toLowerCase();
            const v = src[k];
            if (v === undefined || v === null) continue;

            if (lk === 'authorization') out['authorization'] = String(v);
            else if (lk === 'x-api-key') out['x-api-key'] = String(v);
            else if (lk === 'content-type') out['content-type'] = String(v);
        }

        if (!out['content-type']) out['content-type'] = 'application/json';
        return out;
    }

    function safeFetchInitForReplay(payload, body) {
        const init = {
            method: 'POST',
            headers: buildReplayHeaders(payload?.headers),
            body: body
        };
        const cred = payload?.credentials;
        if (cred === 'include' || cred === 'omit' || cred === 'same-origin') init.credentials = cred;

        const mode = payload?.mode;
        if (mode === 'cors' || mode === 'no-cors' || mode === 'same-origin') init.mode = mode;

        const referrer = payload?.referrer;
        if (typeof referrer === 'string' && referrer.length) init.referrer = referrer;

        const refPol = payload?.referrerPolicy;
        if (typeof refPol === 'string' && refPol.length) init.referrerPolicy = refPol;

        return init;
    }

    async function sendReplayRequestOnce(contextLabel) {
        try {
            // buildReplayBody 失败为“致命错误”，直接停止避免无限循环报错
            let body = '';
            try {
                body = buildReplayBody(state.capturedPayload.bodyTemplate);
            } catch (e) {
                state.replaySending = false;
                state.replayLastStatus = null;
                state.replayLastError = String(e?.message || e || 'Body 构建失败');
                updateReplayPanelUI();
                stopAutoClick(`回放失败：${state.replayLastError}`);
                return;
            }

            try {
                const ids = extractCaptureIds(body);
                state.replayLastSentIds.unshift({ at: Date.now(), ...ids });
                state.replayLastSentIds = state.replayLastSentIds.slice(0, 3);
            } catch (_) { }

            const init = safeFetchInitForReplay(state.capturedPayload, body);

            let res = null;
            try {
                state.replaySending = true;
                res = await fetch(state.capturedPayload.url, init);
                state.replaySending = false;
                state.replayLastStatus = res?.status;
                if (!res || !res.ok) {
                    state.replayRequestFailCount += 1;
                    state.replayConsecutiveFail += 1;
                    state.replayLastError = `HTTP ${res?.status || 'ERR'}（第${state.replayRequestFailCount}次失败）`;
                } else {
                    state.replayConsecutiveFail = 0;
                    state.replayLastError = '';
                }
            } catch (e) {
                state.replayLastStatus = null;
                state.replayRequestFailCount += 1;
                state.replayConsecutiveFail += 1;
                state.replayLastError = String(e?.message || e || '请求异常');
            }

            updateReplayPanelUI();
        } catch (e) {
            state.replayLastError = String(e?.message || e || '回放失败');
            updateReplayPanelUI();
        }
    }

    async function runReplayOnce() {
        if (!state.isRunning || state.mode !== 'replay') return;
        if (state.isProcessingLoop) return;

        if (!state.capturedPayload) {
            state.replayWaitingCapture = true;
            updateReplayPanelUI();
            updateUI('等待捕获...', '#ffb74d');
            return;
        }

        state.isProcessingLoop = true;
        try {
            state.attemptedClickTimes.push(Date.now());
            bumpTotal('attempted', 1);

            try { checkNewResults(); } catch (_) { }
            try { performCleanup(); } catch (_) { }

            await sendReplayRequestOnce('Replay');

            state.clickCount += 1;

            // 回放中 token 可能会被刷新：遇到 401/403 立即重新抓包并暂停回放，等抓包完成后自动恢复。
            if (state.replayLastStatus === 401 || state.replayLastStatus === 403) {
                state.capturedPayload = null;
                state.replayWaitingCapture = true;
                autoCaptureFromGenerateClickOnce();
                updateUI('閴存潈澶辨晥锛岄噸鏂版崟鑾蜂腑...', '#ff9800');
                updateReplayPanelUI();
                return;
            }

            if (state.replayStopOnConsecutiveFail && state.replayConsecutiveFail > 10) {
                stopAutoClick('连续失败过多，已停止（可取消“连续失败>10自动停止”）');
                return;
            }

            updateUI(`定时回放中... (${state.clickCount}/${state.targetClicks})`, '#03a9f4');
            updateStatsUI();
        } catch (e) {
            state.replayLastError = String(e?.message || e || '回放失败');
            updateReplayPanelUI();
        } finally {
            state.isProcessingLoop = false;
        }
    }

    async function replayMainLoop() {
        if (!state.isRunning || state.mode !== 'replay') return;

        if (state.clickCount >= state.targetClicks) {
            playSuccessSound();
            stopAutoClick('任务完成 (定时回放)');
            return;
        }

        await runReplayOnce();

        if (!state.isRunning || state.mode !== 'replay') return;
        if (state.replayWaitingCapture) return;

        if (state.clickCount >= state.targetClicks) {
            playSuccessSound();
            stopAutoClick('任务完成 (定时回放)');
            return;
        }

        // 按“计划时间”累加，避免漂移
        if (typeof state.replayNextAt !== 'number' || !Number.isFinite(state.replayNextAt)) {
            state.replayNextAt = Date.now() + state.replayIntervalMs;
        } else {
            state.replayNextAt += state.replayIntervalMs;
        }

        const delay = Math.max(0, state.replayNextAt - Date.now());
        state.timerId = setTimeout(replayMainLoop, delay);
    }

    function startReplayLoop() {
        if (!state.isRunning || state.mode !== 'replay') return;
        clearMainTimer();

        if (!state.capturedPayload) {
            state.replayWaitingCapture = true;
            updateReplayPanelUI();
            updateUI('等待捕获...', '#ffb74d');
            return;
        }

        if (!state.targetClicks || !state.replayIntervalMs) {
            updateUI('请设置“回放次数”和“间隔秒数”', '#ff9800');
            return;
        }

        // 回放时间信息初始化（按“每 interval 一次”，首发在 interval 后）
        state.replayStartAt = Date.now();
        state.replayNextAt = state.replayStartAt + state.replayIntervalMs;
        state.replayEndAt = state.replayStartAt + state.replayIntervalMs * state.targetClicks;

        state.replayWaitingCapture = false;
        startReplayClock();
        updateReplayPanelUI();

        updateUI('定时回放倒计时中...', '#03a9f4');

        const firstDelay = Math.max(0, state.replayNextAt - Date.now());
        state.timerId = setTimeout(replayMainLoop, firstDelay);
    }

    async function autoCaptureFromGenerateClickOnce(timeoutMs = 15000) {
        if (state.autoCaptureInFlight) return;
        state.autoCaptureInFlight = true;

        try {
            if (!state.isRunning || !(state.mode === 'replay' || state.mode === 'fixed')) return;
            if (!state.replayWaitingCapture) return;
            if (state.capturedPayload) return;

            const start = Date.now();
            let clicked = false;

            while (Date.now() - start < timeoutMs) {
                if (!state.isRunning || !(state.mode === 'replay' || state.mode === 'fixed')) return;
                if (!state.replayWaitingCapture) return;
                if (state.capturedPayload) return;

                let btn = findGenerateButton();
                if (!btn) {
                    btn = await waitForGenerateButton(1200);
                }

                if (!state.isRunning || !(state.mode === 'replay' || state.mode === 'fixed')) return;
                if (!state.replayWaitingCapture) return;
                if (state.capturedPayload) return;

                if (btn && !isButtonDisabledOrPending(btn)) {
                    triggerGenerateClick(btn);
                    clicked = true;
                    updateUI('已自动触发“生成”，等待捕获...', '#ffb74d');
                    updateReplayPanelUI();
                    break;
                }

                await new Promise(r => setTimeout(r, 500));
            }

            if (!clicked && state.isRunning && (state.mode === 'replay' || state.mode === 'fixed') && state.replayWaitingCapture && !state.capturedPayload) {
                updateUI('自动捕获未触发（按钮可能忙）。如长时间无捕获，可手动点一次“生成”。', '#ff9800');
                updateReplayPanelUI();
            }
        } finally {
            state.autoCaptureInFlight = false;
        }
    }

    // ========= 启停 =========
    function startAutoClick() {
        clearMainTimer();
        clearReplayClock();
        invalidateGenerateBtnCache();

        state.targetClicks = parseInt(ui.countInput.value, 10) || 1;
        state.soundEnabled = ui.soundCheck.checked;

        // 清理开关按模式处理：标准模式可关闭；固定/回放始终自动清理
        state.cleanupEnabled = (state.mode === 'standard') ? ui.cleanupCheck.checked : true;

        state.clickCount = 0;
        state.successCount = 0;
        state.failCount = 0;
        state.startTime = Date.now();
        state.isRunning = true;

        state.attemptedClickTimes = [];
        state.effectiveClickTimes = [];
        state.knownBatchIds.clear();
        state.isProcessingLoop = false;
        state.isWaitingForClick = false;
        resetReplayRuntime();

        initDOMTracker();
        updateStatsUI();

        if (state.mode === 'standard') {
            state.stdInterval = parseFloat(ui.intervalInput.value) * 1000 || 3000;
            state.stdDelay = parseFloat(ui.delayInput.value) * 1000 || 2500;

            updateUI('标准模式运行中...', '#4caf50');
            standardMainLoop();
        } else if (state.mode === 'fixed') {
            recalcFixedSchedule();

            // v4.0：每次开始“定时回放”都强制重新抓包，避免复用上次捕获数据
            state.capturedPayload = null;

            state.replayWaitingCapture = true;
            updateReplayPanelUI();
            updateUI('自动捕获中：准备触发一次“生成”...', '#ffb74d');

            // FIXED in v5.6: 移除自动复用 lastGeneratePayload 逻辑，强制重新捕获，确保使用最新 Prompt
            // if (!state.capturedPayload && state.lastGeneratePayload && (Date.now() - state.lastGeneratePayload.capturedAt < FIXED_RECAPTURE_MS)) {
            //    state.capturedPayload = state.lastGeneratePayload;
            // }
            if (!state.capturedPayload) autoCaptureFromGenerateClickOnce().catch(() => { });
            fixedMainLoop();
        } else {
            // replay
            readReplaySettingsFromUI();
            if (state.replayTotal <= 0 || state.replayIntervalMs <= 0) {
                state.isRunning = false;
                updateUI('请先设置“回放次数”和“间隔秒数”再开始', '#ff9800');
                updateStatsUI();
                return;
            }

            // v4.0：每次开始“定时回放”都强制重新抓包，避免复用上次捕获数据
            state.capturedPayload = null;

            // 启动后即可计算完结时间（等待捕获期间也能显示 ETA）
            state.replayStartAt = Date.now();
            state.replayNextAt = state.replayStartAt + state.replayIntervalMs;
            state.replayEndAt = state.replayStartAt + state.replayIntervalMs * state.targetClicks;

            startReplayClock();
            updateReplayPanelUI();

            state.replayWaitingCapture = true;
            updateReplayPanelUI();
            updateUI('自动捕获中：准备触发一次“生成”...', '#ffb74d');

            // FIXED in v5.6: 移除自动复用 lastGeneratePayload 逻辑（定时回放模式），强制用户点击一次“生成”以捕获最新数据
            // if (!state.capturedPayload && state.lastGeneratePayload && (Date.now() - state.lastGeneratePayload.capturedAt < FIXED_RECAPTURE_MS)) {
            //    state.capturedPayload = state.lastGeneratePayload;
            // }
            if (state.capturedPayload) {
                state.replayWaitingCapture = false;
                updateReplayPanelUI();
                updateUI('Captured from last generate. Starting replay...', '#81c784');
                startReplayLoop();
                return;
            }

            autoCaptureFromGenerateClickOnce().catch(() => { });
            return;
        }
    }

    function stopAutoClick(msg) {
        try { setLastRun(msg || '已停止'); } catch (_) { }

        state.isRunning = false;
        state.isWaitingForClick = false;
        state.isProcessingLoop = false;
        state.replayWaitingCapture = false;
        state.autoCaptureInFlight = false;

        clearMainTimer();
        clearReplayClock();

        updateUI(msg || '用户停止');
        if (ui.etaDisplay) ui.etaDisplay.innerText = '';
        updateStatsUI();

        if (state.mode === 'fixed' && state.startTime) {
            const endTime = Date.now();
            const totalDuration = endTime - state.startTime;
            ui.fixedStats.innerHTML = `
                <div style="display:flex; justify-content:space-between; color:#4fc3f7;">
                    <span>总时长: ${formatDuration(totalDuration)}</span>
                    <span>完成: ${state.clickCount}/${state.targetClicks}</span>
                </div>
                <div style="color:#4fc3f7; text-align:center;">结束: ${formatTime(new Date(endTime))}</div>
            `;
        }
    }

    // ========= 进程按钮 =========
    function createProcessButtons(container) {
        container.innerHTML = '';
        const count = parseInt(ui.fixedProcTotalInput.value, 10) || 3;

        if (state.fixedProcessId < 1) state.fixedProcessId = 1;
        if (state.fixedProcessId > count) state.fixedProcessId = 1;

        for (let i = 1; i <= count; i++) {
            const btn = document.createElement('button');
            btn.innerText = `[ ${i} ]`;
            btn.style.cssText = `background: ${state.fixedProcessId === i ? '#2fa34e' : '#333'}; color: #fff; border: 1px solid #555; padding: 4px 8px; cursor: pointer; font-size: 12px; border-radius: 4px;`;
            btn.onclick = () => {
                state.fixedProcessId = i;
                Array.from(container.children).forEach(b => b.style.background = '#333');
                btn.style.background = '#2fa34e';
                recalcFixedSchedule();
            };
            container.appendChild(btn);
        }
    }

    // ========= UI =========
    function createUI() {
        const existing = document.getElementById('firefly-pro-ui');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'firefly-pro-ui';
        container.style.cssText = `position: fixed; top: 80px; right: 20px; width: 230px; background: rgba(25, 25, 25, 0.95); color: #fff; border-radius: 8px; z-index: 99999; font-family: 'Segoe UI', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.7); border: 1px solid #444; backdrop-filter: blur(5px); font-size: 13px;`;

        const header = document.createElement('div');
        header.style.cssText = 'padding: 8px 12px; background: #333; cursor: move; display: flex; justify-content: space-between; border-bottom: 1px solid #444; border-radius: 8px 8px 0 0;';
        header.innerHTML = `<span style="font-weight:bold;">Firefly Pro v${VERSION} 中文版</span>`;

        const toggleBtn = document.createElement('span');
        toggleBtn.innerText = '-';
        toggleBtn.style.cssText = 'cursor: pointer; font-weight: bold; padding: 0 5px;';
        header.appendChild(toggleBtn);

        container.appendChild(header);

        const main = document.createElement('div');
        main.style.padding = '12px';
        ui.mainContent = main;

        const modeRow = document.createElement('div');
        modeRow.style.marginBottom = '10px';
        modeRow.innerHTML = `<div style="display:flex; background:#222; border-radius:4px; padding:2px; gap:2px;"><button id="mode-std" style="flex:1; background:#444; border:none; color:#fff; padding:4px; border-radius:3px; cursor:pointer; font-size:12px;">标准模式</button><button id="mode-fix" style="flex:1; background:transparent; border:none; color:#888; padding:4px; border-radius:3px; cursor:pointer; font-size:12px;">固定时间</button><button id="mode-replay" style="flex:1; background:transparent; border:none; color:#888; padding:4px; border-radius:3px; cursor:pointer; font-size:12px;">定时回放</button></div>`;
        main.appendChild(modeRow);

        const commonRow = document.createElement('div');
        commonRow.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;';
        commonRow.innerHTML = `<span>总点击数:</span> <input type="number" id="inp-count" value="50" style="width:50px; background:#222; border:1px solid #555; color:#fff; text-align:center;">`;
        main.appendChild(commonRow);
        ui.countInput = commonRow.querySelector('#inp-count');
        ui.commonRow = commonRow;

        const stdPanel = document.createElement('div');
        stdPanel.innerHTML = `<div style="display:flex; gap:5px; margin-bottom:8px;"><div style="flex:1;"><span style="color:#aaa; font-size:11px;">轮询(s)</span><input type="number" id="inp-interval" value="2.0" step="0.5" style="width:100%; background:#222; border:1px solid #555; color:#fff; text-align:center;"></div><div style="flex:1;"><span style="color:#aaa; font-size:11px;">延迟(s)</span><input type="number" id="inp-delay" value="2.5" step="0.1" style="width:100%; background:#222; border:1px solid #555; color:#fff; text-align:center;"></div></div><div style="margin-bottom:8px; font-size:12px; display:flex; justify-content:space-between; align-items:center;"><label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="chk-cleanup" checked style="margin-right:5px;"> 自动清理(保留3)</label><button id="btn-manual-cleanup" style="background:#555; color:#fff; border:none; padding:2px 6px; border-radius:3px; font-size:10px; cursor:pointer;">立即清理</button></div>`;
        main.appendChild(stdPanel);
        ui.intervalInput = stdPanel.querySelector('#inp-interval');
        ui.delayInput = stdPanel.querySelector('#inp-delay');
        ui.cleanupCheck = stdPanel.querySelector('#chk-cleanup');
        ui.btnManualCleanup = stdPanel.querySelector('#btn-manual-cleanup');
        ui.btnManualCleanup.onclick = performCleanup;

        const fixPanel = document.createElement('div');
        fixPanel.style.display = 'none';
        fixPanel.style.borderTop = '1px dashed #444';
        fixPanel.style.paddingTop = '8px';
        fixPanel.style.marginTop = '8px';

        const fixRow1 = document.createElement('div');
        fixRow1.style.marginBottom = '5px';
        fixRow1.style.display = 'flex';
        fixRow1.style.gap = '5px';
        fixRow1.style.alignItems = 'center';

        const nextMinTime = new Date();
        nextMinTime.setMinutes(nextMinTime.getMinutes() + 1);
        nextMinTime.setSeconds(0);

        fixRow1.innerHTML = `<span style="font-size:12px;">起始:</span><input type="text" id="inp-start" value="${formatTime(nextMinTime)}" style="flex:1; min-width:60px; background:#222; border:1px solid #555; color:#81c784; text-align:center; font-family:monospace;"><button id="btn-next-min" style="background:#333; border:1px solid #555; color:#fff; cursor:pointer; font-size:10px; padding:2px 5px;" title="设置为下一分钟00秒">整分</button><button id="btn-copy-time" style="background:#333; border:1px solid #555; color:#aaa; cursor:pointer; font-size:10px; padding:2px 5px;" title="复制时间">复制</button>`;
        fixPanel.appendChild(fixRow1);

        ui.fixedStartInput = fixRow1.querySelector('#inp-start');
        ui.btnNextMin = fixRow1.querySelector('#btn-next-min');
        ui.btnCopyTime = fixRow1.querySelector('#btn-copy-time');

        ui.btnNextMin.onclick = () => {
            const d = new Date();
            d.setMinutes(d.getMinutes() + 1);
            d.setSeconds(0);
            ui.fixedStartInput.value = formatTime(d);
            recalcFixedSchedule();
        };

        ui.btnCopyTime.onclick = function () {
            navigator.clipboard.writeText(ui.fixedStartInput.value).then(() => {
                const originalText = this.innerText;
                this.innerText = '成功';
                this.style.color = '#4caf50';
                setTimeout(() => { this.innerText = originalText; this.style.color = '#aaa'; }, 1000);
            }).catch(() => {
                this.innerText = '失败';
                this.style.color = '#ff5252';
                setTimeout(() => { this.innerText = '复制'; this.style.color = '#aaa'; }, 1000);
            });
        };

        const fixRow2 = document.createElement('div');
        fixRow2.style.cssText = 'display:flex; gap:5px; margin-bottom:8px;';
        fixRow2.innerHTML = `<div style="flex:1;"><span style="color:#aaa; font-size:11px;">单号间隔(s)</span><input type="number" id="inp-step" value="30" style="width:100%; background:#222; border:1px solid #555; color:#fff; text-align:center;"></div><div style="flex:1;"><span style="color:#aaa; font-size:11px;">进程总数</span><input type="number" id="inp-proc-total" value="3" min="1" style="width:100%; background:#222; border:1px solid #555; color:#fff; text-align:center;"></div>`;
        fixPanel.appendChild(fixRow2);

        ui.fixedStepInput = fixRow2.querySelector('#inp-step');
        ui.fixedProcTotalInput = fixRow2.querySelector('#inp-proc-total');

        const procContainer = document.createElement('div');
        procContainer.style.cssText = 'display:flex; gap:4px; justify-content:center; margin-bottom:8px; flex-wrap:wrap;';
        fixPanel.appendChild(procContainer);
        ui.procContainer = procContainer;

        ui.fixedStats = document.createElement('div');
        ui.fixedStats.style.fontSize = '11px';
        ui.fixedStats.style.marginBottom = '5px';
        ui.fixedStats.style.background = '#222';
        ui.fixedStats.style.padding = '4px';
        ui.fixedStats.style.borderRadius = '4px';
        fixPanel.appendChild(ui.fixedStats);

        main.appendChild(fixPanel);

        // ========= 回放面板（压缩 UI） =========
        const replayPanel = document.createElement('div');
        replayPanel.style.display = 'none';
        replayPanel.style.borderTop = '1px dashed #444';
        replayPanel.style.paddingTop = '8px';
        replayPanel.style.marginTop = '8px';
        replayPanel.innerHTML = `
            <div style="display:flex; gap:5px; margin-bottom:8px;">
              <div style="flex:1;">
                <span style="color:#aaa; font-size:11px;">回放次数</span>
                <input type="number" id="inp-replay-count" value="50" min="0" style="width:100%; background:#222; border:1px solid #555; color:#fff; text-align:center;">
              </div>
              <div style="flex:1;">
                <span style="color:#aaa; font-size:11px;">间隔(s)</span>
                <input type="number" id="inp-replay-interval" value="20" min="0" step="0.1" style="width:100%; background:#222; border:1px solid #555; color:#fff; text-align:center;">
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
              <div id="replay-capture-status" style="flex:1; font-size:11px; color:#aaa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">尚未捕获</div>
              <button id="btn-copy-capture" style="background:#333; border:1px solid #555; color:#fff; cursor:pointer; font-size:11px; padding:2px 6px; border-radius:4px; opacity:0.45;" disabled>Copy</button>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-bottom:8px;">
              <label style="cursor:pointer; display:flex; align-items:center; font-size:12px; color:#ddd;">
                <input type="checkbox" id="chk-replay-stopfail" checked style="margin-right:5px;"> 连续失败>10自动停止
              </label>
              <button id="btn-clear-capture" style="background:#333; border:1px solid #555; color:#fff; cursor:pointer; font-size:11px; padding:2px 6px; border-radius:4px;">清空捕获</button>
            </div>

            <div id="replay-progress" style="font-size:10px; color:#ddd; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              进度: 0/0 | 下次: --:--(--:--:--) | 结束: --:--:--
            </div>

            <div id="replay-dedup" style="font-size:10px; color:#aaa; margin-bottom:4px;"></div>
            <div id="replay-error" style="font-size:10px; color:#ff5252; display:none;"></div>
        `;
        main.appendChild(replayPanel);

        ui.replayPanel = replayPanel;
        ui.replayCountInput = replayPanel.querySelector('#inp-replay-count');
        ui.replayIntervalInput = replayPanel.querySelector('#inp-replay-interval');
        ui.replayCaptureStatus = replayPanel.querySelector('#replay-capture-status');
        ui.replayStopOnFailCheck = replayPanel.querySelector('#chk-replay-stopfail');
        ui.replayProgress = replayPanel.querySelector('#replay-progress');
        ui.replayDedup = replayPanel.querySelector('#replay-dedup');
        ui.replayError = replayPanel.querySelector('#replay-error');

        ui.btnCopyCapture = replayPanel.querySelector('#btn-copy-capture');
        ui.btnCopyCapture.onclick = async function () {
            if (!state.capturedPayload) return;
            const txt = buildCaptureCopyText(state.capturedPayload);
            const ok = await copyText(txt);
            const originalText = this.innerText;
            this.innerText = ok ? '已复制' : '失败';
            this.style.color = ok ? '#4caf50' : '#ff5252';
            setTimeout(() => {
                this.innerText = originalText;
                this.style.color = '#fff';
            }, 900);
        };

        ui.btnClearCapture = replayPanel.querySelector('#btn-clear-capture');
        ui.btnClearCapture.onclick = () => {
            state.capturedPayload = null;
            state.replayLastStatus = null;
            state.replayLastError = '';
            state.replayConsecutiveFail = 0;
            state.replayRequestFailCount = 0;
            state.replayLastSentIds = [];
            updateReplayPanelUI();
            updateUI('已清空捕获数据', '#888');
        };

        [ui.fixedStartInput, ui.fixedStepInput, ui.fixedProcTotalInput, ui.countInput].forEach(el => {
            el.onchange = () => { createProcessButtons(procContainer); recalcFixedSchedule(); };
            el.oninput = el.onchange;
        });

        const btnStd = modeRow.querySelector('#mode-std');
        const btnFix = modeRow.querySelector('#mode-fix');
        const btnReplay = modeRow.querySelector('#mode-replay');
        ui.modeStd = btnStd;
        ui.modeFix = btnFix;
        ui.modeReplay = btnReplay;

        function switchMode(m) {
            state.mode = m;
            if (m === 'standard') {
                stdPanel.style.display = 'block';
                fixPanel.style.display = 'none';
                replayPanel.style.display = 'none';
                commonRow.style.display = 'flex';
                btnStd.style.background = '#444'; btnStd.style.color = '#fff';
                btnFix.style.background = 'transparent'; btnFix.style.color = '#888';
                btnReplay.style.background = 'transparent'; btnReplay.style.color = '#888';
            } else if (m === 'fixed') {
                stdPanel.style.display = 'none';
                fixPanel.style.display = 'block';
                replayPanel.style.display = 'none';
                commonRow.style.display = 'flex';
                btnFix.style.background = '#2196f3'; btnFix.style.color = '#fff';
                btnStd.style.background = 'transparent'; btnStd.style.color = '#888';
                btnReplay.style.background = 'transparent'; btnReplay.style.color = '#888';
                if (procContainer.children.length === 0) createProcessButtons(procContainer);
                recalcFixedSchedule();
            } else {
                stdPanel.style.display = 'none';
                fixPanel.style.display = 'none';
                replayPanel.style.display = 'block';
                commonRow.style.display = 'none';
                btnReplay.style.background = '#03a9f4'; btnReplay.style.color = '#fff';
                btnStd.style.background = 'transparent'; btnStd.style.color = '#888';
                btnFix.style.background = 'transparent'; btnFix.style.color = '#888';
                updateReplayPanelUI();
            }
            updateStatsUI();
        }

        btnStd.onclick = () => switchMode('standard');
        btnFix.onclick = () => switchMode('fixed');
        btnReplay.onclick = () => switchMode('replay');

        const soundRow = document.createElement('div');
        soundRow.style.cssText = 'display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; font-size:12px; border-top:1px solid #444; padding-top:8px;';
        soundRow.innerHTML = `<label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="chk-sound" checked style="margin-right:5px;"> 音效</label><button id="btn-test-sound" style="background:transparent; border:1px solid #555; color:#aaa; font-size:10px; cursor:pointer; padding:2px 6px; border-radius:3px;">测试音效</button>`;
        main.appendChild(soundRow);

        ui.soundCheck = soundRow.querySelector('#chk-sound');
        soundRow.querySelector('#btn-test-sound').onclick = () => playSuccessSound();

        const actionRow = document.createElement('div');
        actionRow.style.display = 'flex';
        actionRow.style.gap = '10px';
        main.appendChild(actionRow);

        try {
            actionRow.innerHTML = '';

            const startBtn = document.createElement('button');
            startBtn.id = 'btn-start';
            startBtn.textContent = '开始';
            startBtn.style.cssText = 'flex:1; background:#2fa34e; color:#fff; border:none; padding:8px; border-radius:4px; font-weight:bold; cursor:pointer;';

            const stopBtn = document.createElement('button');
            stopBtn.id = 'btn-stop';
            stopBtn.textContent = '停止';
            stopBtn.disabled = true;
            stopBtn.style.cssText = 'flex:1; background:#d32f2f; color:#fff; border:none; padding:8px; border-radius:4px; font-weight:bold; cursor:pointer; opacity:0.5;';

            actionRow.appendChild(startBtn);
            actionRow.appendChild(stopBtn);
        } catch (_) { }

        ui.startBtn = actionRow.querySelector('#btn-start');
        ui.stopBtn = actionRow.querySelector('#btn-stop');

        ui.startBtn.onclick = startAutoClick;
        ui.stopBtn.onclick = () => stopAutoClick('手动停止');

        const statusArea = document.createElement('div');
        statusArea.style.cssText = 'margin-top:10px; background:#222; padding:8px; border-radius:4px; border:1px solid #444; font-size:12px;';
        statusArea.innerHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span id="st-header" style="color:#888;">● 待机</span><span id="st-count">0 / 0</span></div><div id="st-msg" style="color:#ddd; height:1.4em; overflow:hidden;">准备就绪</div><div id="st-eta" style="color:#888; font-size:10px; margin-top:4px; border-top:1px solid #333; padding-top:2px;"></div><div id="st-avg" style="color:#888; font-size:10px; margin-top:4px; border-top:1px solid #333; padding-top:2px;">平均尝试: N/A | 平均有效: N/A</div><div id="st-success" style="color:#ddd; font-size:11px; margin-top:4px; border-top:1px solid #333; padding-top:2px;">尝试: 0 | 成功: 0 (0%)</div>`;
        main.appendChild(statusArea);
        statusArea.insertAdjacentHTML('beforeend', `<div id="st-total" style="color:#bbb; font-size:10px; margin-top:4px; border-top:1px solid #333; padding-top:2px;"></div><div id="st-last" style="color:#888; font-size:10px; margin-top:4px;"></div>`);

        ui.statusHeader = statusArea.querySelector('#st-header');
        ui.countDisplay = statusArea.querySelector('#st-count');
        ui.statusMsg = statusArea.querySelector('#st-msg');
        ui.etaDisplay = statusArea.querySelector('#st-eta');
        ui.avgDisplay = statusArea.querySelector('#st-avg');
        ui.successStats = statusArea.querySelector('#st-success');
        ui.totalStats = statusArea.querySelector('#st-total');
        ui.lastStats = statusArea.querySelector('#st-last');

        container.appendChild(main);
        document.body.appendChild(container);

        toggleBtn.onclick = () => {
            state.isCollapsed = !state.isCollapsed;
            main.style.display = state.isCollapsed ? 'none' : 'block';
            toggleBtn.innerText = state.isCollapsed ? '+' : '-';
        };

        // 拖拽
        let isDragging = false, startX, startY, initLeft, initTop;
        header.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            const rect = container.getBoundingClientRect();
            initLeft = rect.left; initTop = rect.top;
            container.style.right = 'auto';
            container.style.left = initLeft + 'px';
            container.style.top = initTop + 'px';

            document.onmousemove = (ev) => {
                if (!isDragging) return;
                container.style.left = (initLeft + ev.clientX - startX) + 'px';
                container.style.top = (initTop + ev.clientY - startY) + 'px';
            };
            document.onmouseup = () => {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        updateUI();
    }

    function waitForBody(timeoutMs = 20000) {
        if (document.body) return Promise.resolve(true);
        return new Promise(resolve => {
            const start = Date.now();
            const timer = setInterval(() => {
                if (document.body) {
                    clearInterval(timer);
                    resolve(true);
                    return;
                }
                if (Date.now() - start > timeoutMs) {
                    clearInterval(timer);
                    resolve(false);
                }
            }, 50);
        });
    }

    setTimeout(async () => {
        try { await waitForBody(20000); } catch (_) { }
        initDOMTracker();
        createUI();
    }, 2000);

    // 初始化即安装 fetch hook（用于“定时回放”抓包）
    try { installFetchHookOnce(); } catch (_) { }
    try { installXhrHookOnce(); } catch (_) { }

})();
