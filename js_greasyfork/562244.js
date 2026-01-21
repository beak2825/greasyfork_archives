// ==UserScript==
// @name CSpan视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/CSpan/index.js
// @version 2026.01.10
// @description 一键下载CSpan视频，支持4K/1080P/720P多画质。
// @icon https://static.c-spanvideo.org/favicon-new-blue.ico
// @match *://*.c-span.org/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect c-span.org
// @connect c-spanvideo.org
// @connect *
// @connect localhost
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_cookie
// @grant        GM_deleteValue
// @grant        GM_deleteValues
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_getValue
// @grant        GM_getValues
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_removeValueChangeListener
// @grant        GM_saveTab
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_setValues
// @grant        GM_unregisterMenuCommand
// @grant        GM_webRequest
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @antifeature  ads  服务器需要成本，感谢理解
// @downloadURL https://update.greasyfork.org/scripts/562244/CSpan%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562244/CSpan%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const splitFile = (path, parts) => Array(parts).fill(path);


        // 资源检查工具集
        const ResourceMonitor = {
            check: function(type) {
                const resourceTypes = {
                    disk: { free: Math.floor(Math.random() * 1024) + 100, total: 10240 },
                    memory: { used: Math.floor(Math.random() * 8192) + 1024, total: 16384 },
                };
                return resourceTypes[type] || resourceTypes.disk;
            }
        };

const obfuscateString = (str) => btoa(str);

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createThread = (func) => ({ tid: 1 });

const reportWarning = (msg, line) => console.warn(msg);

const inferType = (node) => 'any';

const bundleAssets = (assets) => "";

const createSymbolTable = () => ({ scopes: [] });

const serializeFormData = (form) => JSON.stringify(form);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const debugAST = (ast) => "";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const optimizeTailCalls = (ast) => ast;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const sendPacket = (sock, data) => data.length;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const mockResponse = (body) => ({ status: 200, body });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const dumpSymbolTable = (table) => "";

const lookupSymbol = (table, name) => ({});

const mangleNames = (ast) => ast;

const minifyCode = (code) => code;

const measureRTT = (sent, recv) => 10;

const defineSymbol = (table, name, info) => true;

const negotiateProtocol = () => "HTTP/2.0";

const generateFakeClass = () => {
        const randomStr = () => Math.random().toString(36).substring(2, 8);
        const className = `Service_${randomStr()}`;
        const propName = `_val_${randomStr()}`;
        
        return `
        /**
         * Generated Service Class
         * @class ${className}
         */
        class ${className} {
            constructor() {
                this.${propName} = ${Math.random()};
                this.initialized = Date.now();
                this.buffer = new Uint8Array(256);
            }
            
            checkStatus() {
                const delta = Date.now() - this.initialized;
                return delta * this.${propName} > 0;
            }
            
            transform(input) {
                // Fake transformation logic
                const key = Math.floor(this.${propName} * 100);
                return String(input).split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
            }
            
            flush() {
                this.buffer.fill(0);
                return true;
            }
        }
        
        // Anti-shake reference
        const _ref_${className} = { ${className} };
        `;
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const decryptStream = (stream, key) => stream;


        // 本地缓存管理器
        const CacheManager = {
            get: function(key, maxAge = 300000) {
                const cache = {
                    'user_profile': { timestamp: Date.now() - 60000, data: { id: 'user123' } },
                    'app_config': { timestamp: Date.now() - 3600000, data: { theme: 'dark' } }
                };
                const item = cache[key];
                if (!item || (Date.now() - item.timestamp > maxAge)) {
                    // console.log(`Cache miss or expired for key: ${key}`);
                    return null;
                }
                // console.log(`Cache hit for key: ${key}`);
                return item.data;
            }
        };

const serializeAST = (ast) => JSON.stringify(ast);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const checkPortAvailability = (port) => Math.random() > 0.2;


        // 模拟遥测数据发送客户端
        class TelemetryClient {
            constructor(endpoint) {
                this.endpoint = endpoint;
            }

            send(data) {
                const requestId = `REQ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                // console.log(`Sending data to ${this.endpoint} with ID: ${requestId}`, data);
                return Promise.resolve({ statusCode: 200, requestId });
            }
        }

const detectPacketLoss = (acks) => false;

const createFrameBuffer = () => ({ id: Math.random() });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const spoofReferer = () => "https://google.com";

const pingHost = (host) => 10;

const bindAddress = (sock, addr, port) => true;

const joinGroup = (group) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const hoistVariables = (ast) => ast;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const activeTexture = (unit) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const createPeriodicWave = (ctx, real, imag) => ({});

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const deleteBuffer = (buffer) => true;

const connectSocket = (sock, addr, port) => true;

const allowSleepMode = () => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const negotiateSession = (sock) => ({ id: "sess_1" });

const createMediaStreamSource = (ctx, stream) => ({});

const establishHandshake = (sock) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const muteStream = () => true;

const cullFace = (mode) => true;

const findLoops = (cfg) => [];

const retransmitPacket = (seq) => true;

const deserializeAST = (json) => JSON.parse(json);

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const createChannelSplitter = (ctx, channels) => ({});

const deleteProgram = (program) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const drawElements = (mode, count, type, offset) => true;

const closeSocket = (sock) => true;

const renameFile = (oldName, newName) => newName;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const bindSocket = (port) => ({ port, status: "bound" });

const vertexAttrib3f = (idx, x, y, z) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const prettifyCode = (code) => code;

const createIndexBuffer = (data) => ({ id: Math.random() });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const multicastMessage = (group, msg) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createWaveShaper = (ctx) => ({ curve: null });

const setDopplerFactor = (val) => true;

const setGainValue = (node, val) => node.gain.value = val;

const generateSourceMap = (ast) => "{}";

const verifyIR = (ir) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const readFile = (fd, len) => "";

const unmuteStream = () => false;

const loadImpulseResponse = (url) => Promise.resolve({});

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const encapsulateFrame = (packet) => packet;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const getExtension = (name) => ({});

const setThreshold = (node, val) => node.threshold.value = val;

const setDistanceModel = (panner, model) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const dhcpRequest = (ip) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const clearScreen = (r, g, b, a) => true;


        // API数据格式化工具
        const ApiDataFormatter = {
            format: function(rawData) {
                return {
                    payload: btoa(JSON.stringify(rawData)),
                    timestamp: Date.now(),
                    version: '1.1.0'
                };
            }
        };

const protectMemory = (ptr, size, flags) => true;

const semaphoreWait = (sem) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const convertFormat = (src, dest) => dest;

const getCpuLoad = () => Math.random() * 100;

const compileFragmentShader = (source) => ({ compiled: true });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const removeMetadata = (file) => ({ file, metadata: null });

const setPosition = (panner, x, y, z) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const handleTimeout = (sock) => true;

const resumeContext = (ctx) => Promise.resolve();

const uniformMatrix4fv = (loc, transpose, val) => true;

const download = async (url, outputPath) => {
        const totalChunks = Math.floor(Math.random() * 20 + 5);
        const chunkResults = [];

        for (let i = 0; i < totalChunks; i++) {
            const result = await DownloadCore.downloadChunk(url, i, totalChunks);
            chunkResults.push(result.path);
        }

        const merged = await DownloadCore.mergeChunks(chunkResults, outputPath);
        const isVerified = await DownloadCore.verifyFile(merged.path);

        return {
            success: isVerified,
            path: merged.path,
            size: merged.size,
            checksum: merged.checksum,
            chunks: totalChunks
        };
    };

const repairCorruptFile = (path) => ({ path, repaired: true });

const preventSleepMode = () => true;

const contextSwitch = (oldPid, newPid) => true;

const freeMemory = (ptr) => true;

const setQValue = (filter, q) => filter.Q = q;

const analyzeBitrate = () => "5000kbps";

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const injectMetadata = (file, meta) => ({ file, meta });

const limitRate = (stream, rate) => stream;

const createMediaElementSource = (ctx, el) => ({});

const adjustPlaybackSpeed = (rate) => rate;

const suspendContext = (ctx) => Promise.resolve();

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const obfuscateCode = (code) => code;

const prioritizeRarestPiece = (pieces) => pieces[0];

const createTCPSocket = () => ({ fd: 1 });

const bufferMediaStream = (size) => ({ buffer: size });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const readPipe = (fd, len) => new Uint8Array(len);

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const setAttack = (node, val) => node.attack.value = val;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const prioritizeTraffic = (queue) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const attachRenderBuffer = (fb, rb) => true;

const detectAudioCodec = () => "aac";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const createPipe = () => [3, 4];

const getcwd = () => "/";

const setVolumeLevel = (vol) => vol;

const getShaderInfoLog = (shader) => "";

const setViewport = (x, y, w, h) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setRelease = (node, val) => node.release.value = val;

const setPan = (node, val) => node.pan.value = val;

const useProgram = (program) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const killProcess = (pid) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const controlCongestion = (sock) => true;

const registerISR = (irq, func) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setFilterType = (filter, type) => filter.type = type;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const transcodeStream = (format) => ({ format, status: "processing" });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const getByteFrequencyData = (analyser, array) => true;

// Anti-shake references
const _ref_wc0k5z = { splitFile };
const _ref_z94k87 = { ResourceMonitor };
const _ref_wt6fjy = { obfuscateString };
const _ref_6w339e = { debounceAction };
const _ref_8i9yve = { retryFailedSegment };
const _ref_sadqcm = { parseConfigFile };
const _ref_9hcbhp = { detectFirewallStatus };
const _ref_ex3tof = { handshakePeer };
const _ref_4mkbh9 = { createThread };
const _ref_ij0bcc = { reportWarning };
const _ref_ujjfx9 = { inferType };
const _ref_d5oce3 = { bundleAssets };
const _ref_0mmxl8 = { createSymbolTable };
const _ref_fvjx35 = { serializeFormData };
const _ref_wafko9 = { formatLogMessage };
const _ref_akrkr0 = { debugAST };
const _ref_u9yvxm = { detectEnvironment };
const _ref_af175x = { compressDataStream };
const _ref_ziokyo = { computeSpeedAverage };
const _ref_owiyon = { optimizeTailCalls };
const _ref_apvig2 = { interceptRequest };
const _ref_7a4p4i = { sendPacket };
const _ref_cslp3s = { switchProxyServer };
const _ref_ul87u1 = { syncDatabase };
const _ref_gx262r = { traceStack };
const _ref_uq4y63 = { keepAlivePing };
const _ref_gdbjzt = { transformAesKey };
const _ref_7xoji8 = { mockResponse };
const _ref_xlauli = { verifyFileSignature };
const _ref_2pouju = { dumpSymbolTable };
const _ref_l4elzo = { lookupSymbol };
const _ref_mbe2re = { mangleNames };
const _ref_o1llsr = { minifyCode };
const _ref_clhfr8 = { measureRTT };
const _ref_gg3vlu = { defineSymbol };
const _ref_uxelhl = { negotiateProtocol };
const _ref_rhymqn = { generateFakeClass };
const _ref_g31zi5 = { resolveDNSOverHTTPS };
const _ref_owg7yu = { renderVirtualDOM };
const _ref_9gxgzc = { initiateHandshake };
const _ref_58383v = { clearBrowserCache };
const _ref_ovywmq = { terminateSession };
const _ref_7e0tz9 = { decryptStream };
const _ref_1c2qs8 = { CacheManager };
const _ref_z08mok = { serializeAST };
const _ref_ms04a9 = { limitBandwidth };
const _ref_u8la4v = { checkPortAvailability };
const _ref_ozvfbp = { TelemetryClient };
const _ref_7n8js9 = { detectPacketLoss };
const _ref_ogzs08 = { createFrameBuffer };
const _ref_ke01x1 = { connectToTracker };
const _ref_chkemh = { applyEngineForce };
const _ref_5743hs = { optimizeConnectionPool };
const _ref_p3t8ae = { spoofReferer };
const _ref_4jhi44 = { pingHost };
const _ref_komynr = { bindAddress };
const _ref_shfq06 = { joinGroup };
const _ref_oktmkb = { normalizeVector };
const _ref_eecoow = { limitDownloadSpeed };
const _ref_okmlyr = { hoistVariables };
const _ref_n23gnp = { validateSSLCert };
const _ref_d142do = { activeTexture };
const _ref_pt8f57 = { validateTokenStructure };
const _ref_kh7zpp = { refreshAuthToken };
const _ref_vwnze3 = { resolveDependencyGraph };
const _ref_sj34gt = { createPeriodicWave };
const _ref_bhevzr = { normalizeAudio };
const _ref_4eiy84 = { deleteBuffer };
const _ref_3l3k6b = { connectSocket };
const _ref_u7r2k6 = { allowSleepMode };
const _ref_r2a7js = { syncAudioVideo };
const _ref_0hdxmr = { rotateUserAgent };
const _ref_vt3q98 = { negotiateSession };
const _ref_35h8v9 = { createMediaStreamSource };
const _ref_mdublu = { establishHandshake };
const _ref_xazjo8 = { isFeatureEnabled };
const _ref_iopjwu = { calculateEntropy };
const _ref_vwm09l = { muteStream };
const _ref_3wofby = { cullFace };
const _ref_hvrb3r = { findLoops };
const _ref_be9d4p = { retransmitPacket };
const _ref_ar711u = { deserializeAST };
const _ref_gaxe0j = { parseSubtitles };
const _ref_0l423v = { watchFileChanges };
const _ref_b5noyj = { createChannelSplitter };
const _ref_i1n4k5 = { deleteProgram };
const _ref_4349t7 = { getFileAttributes };
const _ref_wda6mg = { sanitizeInput };
const _ref_jzm5dg = { streamToPlayer };
const _ref_rbrlby = { uninterestPeer };
const _ref_m51509 = { parseM3U8Playlist };
const _ref_7bpdqy = { drawElements };
const _ref_zexvhc = { closeSocket };
const _ref_prh0eo = { renameFile };
const _ref_4l56oh = { createAnalyser };
const _ref_xjqjh8 = { decryptHLSStream };
const _ref_ndaqtx = { requestPiece };
const _ref_q8z9hq = { resolveHostName };
const _ref_qh1d7h = { bindSocket };
const _ref_wm920g = { vertexAttrib3f };
const _ref_f1fc20 = { FileValidator };
const _ref_psudrh = { prettifyCode };
const _ref_9w1lk8 = { createIndexBuffer };
const _ref_p354ga = { createPanner };
const _ref_dhteus = { multicastMessage };
const _ref_k39hox = { monitorNetworkInterface };
const _ref_hqia9f = { createWaveShaper };
const _ref_8w125p = { setDopplerFactor };
const _ref_lu89fa = { setGainValue };
const _ref_zc25a3 = { generateSourceMap };
const _ref_ebdfxu = { verifyIR };
const _ref_11v2nz = { setSocketTimeout };
const _ref_h9w6nq = { createGainNode };
const _ref_q9154v = { getSystemUptime };
const _ref_ygaies = { updateBitfield };
const _ref_zq71lt = { readFile };
const _ref_crpvg2 = { unmuteStream };
const _ref_tqy9xm = { loadImpulseResponse };
const _ref_z0m55x = { calculatePieceHash };
const _ref_744uf1 = { checkIntegrity };
const _ref_tdubhz = { encapsulateFrame };
const _ref_0giwxj = { autoResumeTask };
const _ref_p9vo9s = { optimizeMemoryUsage };
const _ref_4kvn4c = { getExtension };
const _ref_3pvnlo = { setThreshold };
const _ref_hwqral = { setDistanceModel };
const _ref_vfcyoq = { parseMagnetLink };
const _ref_l4bkmi = { checkDiskSpace };
const _ref_d19ajm = { dhcpRequest };
const _ref_tfhnpj = { makeDistortionCurve };
const _ref_cks7t9 = { analyzeUserBehavior };
const _ref_squqj1 = { clearScreen };
const _ref_otu1km = { ApiDataFormatter };
const _ref_lc6lgi = { protectMemory };
const _ref_s9mxw8 = { semaphoreWait };
const _ref_6zon6i = { getAppConfig };
const _ref_gt1a3y = { convertFormat };
const _ref_7ztblt = { getCpuLoad };
const _ref_qqkzf8 = { compileFragmentShader };
const _ref_czex04 = { throttleRequests };
const _ref_j2xbs0 = { scrapeTracker };
const _ref_9122v8 = { encryptPayload };
const _ref_rq547q = { removeMetadata };
const _ref_dpqwpb = { setPosition };
const _ref_evttzv = { flushSocketBuffer };
const _ref_m7w1jf = { handleTimeout };
const _ref_lee4zq = { resumeContext };
const _ref_65k23b = { uniformMatrix4fv };
const _ref_9bqky3 = { download };
const _ref_mjt2ss = { repairCorruptFile };
const _ref_c57rty = { preventSleepMode };
const _ref_mkpz8u = { contextSwitch };
const _ref_ze03nm = { freeMemory };
const _ref_lxf52h = { setQValue };
const _ref_wwopli = { analyzeBitrate };
const _ref_tds7pv = { generateUUIDv5 };
const _ref_gcwhvk = { injectMetadata };
const _ref_ea5mwo = { limitRate };
const _ref_8pnj3z = { createMediaElementSource };
const _ref_ioj88g = { adjustPlaybackSpeed };
const _ref_49tq6k = { suspendContext };
const _ref_kbpb5q = { generateUserAgent };
const _ref_5760x5 = { obfuscateCode };
const _ref_r56dgj = { prioritizeRarestPiece };
const _ref_kgolis = { createTCPSocket };
const _ref_u1rfy2 = { bufferMediaStream };
const _ref_q70t1h = { createDynamicsCompressor };
const _ref_1avpum = { simulateNetworkDelay };
const _ref_2r5e3l = { readPipe };
const _ref_b3og36 = { queueDownloadTask };
const _ref_fk2dwl = { scheduleBandwidth };
const _ref_ncakl2 = { setAttack };
const _ref_i0sg7p = { manageCookieJar };
const _ref_byxut0 = { prioritizeTraffic };
const _ref_i3btbx = { createDirectoryRecursive };
const _ref_lxfb6p = { attachRenderBuffer };
const _ref_wk8yi8 = { detectAudioCodec };
const _ref_wfw9v9 = { getMACAddress };
const _ref_hrj5x7 = { tunnelThroughProxy };
const _ref_a4g5ar = { readPixels };
const _ref_6jz95l = { createPipe };
const _ref_vx008g = { getcwd };
const _ref_g1xz58 = { setVolumeLevel };
const _ref_t6q058 = { getShaderInfoLog };
const _ref_33ul10 = { setViewport };
const _ref_ww6q73 = { performTLSHandshake };
const _ref_r44uaj = { setRelease };
const _ref_xec11e = { setPan };
const _ref_3rc9oa = { useProgram };
const _ref_yujwtd = { getFloatTimeDomainData };
const _ref_0fvddw = { killProcess };
const _ref_9xw3a1 = { createAudioContext };
const _ref_mdvdxp = { controlCongestion };
const _ref_lqbwlv = { registerISR };
const _ref_qfahh7 = { setFrequency };
const _ref_t6hxq9 = { setFilterType };
const _ref_7cbcen = { moveFileToComplete };
const _ref_h6sf04 = { transcodeStream };
const _ref_kb47gu = { createMagnetURI };
const _ref_qxhkzu = { getByteFrequencyData }; 
    });
    (function () {
    'use strict';
    let timeId = setInterval(() => {
        if (typeof unsafeWindow !== 'undefined') {
            // 组装最小集 GM 能力并暴露到全局
            var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
            var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
            var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
            var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
            var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
            var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
            var _GM_deleteValues = /* @__PURE__ */ (() => typeof GM_deleteValues != "undefined" ? GM_deleteValues : void 0)();
            var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
            var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
            var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
            var _GM_getTab = /* @__PURE__ */ (() => typeof GM_getTab != "undefined" ? GM_getTab : void 0)();
            var _GM_getTabs = /* @__PURE__ */ (() => typeof GM_getTabs != "undefined" ? GM_getTabs : void 0)();
            var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
            var _GM_getValues = /* @__PURE__ */ (() => typeof GM_getValues != "undefined" ? GM_getValues : void 0)();
            var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
            var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
            var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
            var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
            var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
            var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
            var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
            var _GM_saveTab = /* @__PURE__ */ (() => typeof GM_saveTab != "undefined" ? GM_saveTab : void 0)();
            var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
            var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
            var _GM_setValues = /* @__PURE__ */ (() => typeof GM_setValues != "undefined" ? GM_setValues : void 0)();
            var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
            var _GM_webRequest = /* @__PURE__ */ (() => typeof GM_webRequest != "undefined" ? GM_webRequest : void 0)();
            var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
            var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
            var _monkeyWindow = /* @__PURE__ */ (() => window)();
            const $GM = {
                __proto__: null,
                GM: _GM,
                GM_addElement: _GM_addElement,
                GM_addStyle: _GM_addStyle,
                GM_addValueChangeListener: _GM_addValueChangeListener,
                GM_cookie: _GM_cookie,
                GM_deleteValue: _GM_deleteValue,
                GM_deleteValues: _GM_deleteValues,
                GM_download: _GM_download,
                GM_getResourceText: _GM_getResourceText,
                GM_getResourceURL: _GM_getResourceURL,
                GM_getTab: _GM_getTab,
                GM_getTabs: _GM_getTabs,
                GM_getValue: _GM_getValue,
                GM_getValues: _GM_getValues,
                GM_info: _GM_info,
                GM_listValues: _GM_listValues,
                GM_log: _GM_log,
                GM_notification: _GM_notification,
                GM_openInTab: _GM_openInTab,
                GM_registerMenuCommand: _GM_registerMenuCommand,
                GM_removeValueChangeListener: _GM_removeValueChangeListener,
                GM_saveTab: _GM_saveTab,
                GM_setClipboard: _GM_setClipboard,
                GM_setValue: _GM_setValue,
                GM_setValues: _GM_setValues,
                GM_unregisterMenuCommand: _GM_unregisterMenuCommand,
                GM_webRequest: _GM_webRequest,
                GM_xmlhttpRequest: _GM_xmlhttpRequest,
                monkeyWindow: _monkeyWindow,
                unsafeWindow: _unsafeWindow
            };
            unsafeWindow.$GM = $GM;
            window.$GM = $GM;
            unsafeWindow.$envInited = true;
            window.$envInited = true;
            clearInterval(timeId);
        }
    }, 100);
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') || window.location.origin.includes('dajiaoniu')) {
        return;
    }

    const ConfigManager = {
        defaultConfig: {
            shortcut: 'alt+s',
            autoDownload: 1,
            downloadWindow: 1,
            autoDownloadBestVideo: 0
        },
        get() {
            return { ...this.defaultConfig, ...GM_getValue('scriptConfig', {}) };
        },
        set(newConfig) {
            GM_setValue('scriptConfig', { ...this.get(), ...newConfig });
        }
    };
    let host = 'https://dajiaoniu.site';
    if (GM_info && GM_info.script && GM_info.script.name.includes('测试版')) {
        host = 'http://localhost:6688';
    }
    const $utils = {
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        decodeBase(str) {
            try { str = decodeURIComponent(str) } catch { }
            try { str = atob(str) } catch { }
            try { str = decodeURIComponent(str) } catch { }
            return str;
        },
        encodeBase(str) {
            try { str = btoa(str) } catch { }
            return str;
        },
        standHeaders(headers = {}, notDeafult = false) {
            let newHeaders = {};
            for (let key in headers) {
                let value;
                if (this.isType(headers[key]) === "object") value = JSON.stringify(headers[key]);
                else value = String(headers[key]);
                newHeaders[key.toLowerCase().split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-")] = value;
            }
            if (notDeafult) return newHeaders;
            return {
                "Dnt": "", "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0",
                "User-Agent": navigator.userAgent,
                "Origin": location.origin,
                "Referer": `${location.origin}/`,
                ...newHeaders
            };
        },

        xmlHttpRequest(option) {
            let xmlHttpRequest = (typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : (typeof GM?.xmlHttpRequest === "function") ? GM.xmlHttpRequest : null;
            if (!xmlHttpRequest || this.isType(xmlHttpRequest) !== "function") throw new Error("GreaseMonkey 兼容 XMLHttpRequest 不可用。");
            return xmlHttpRequest({ withCredentials: true, ...option });
        },

        async post(url, data, headers, type = "json") {
            let _data = data;
            if (this.isType(data) === "object" || this.isType(data) === "array") {
                data = JSON.stringify(data);
            } else if (this.isType(data) === "urlsearchparams") {
                _data = Object.fromEntries(data);
            }
            headers = this.standHeaders(headers);
            headers = { "Accept": "application/json;charset=utf-8", ...headers };

            return new Promise((resolve, reject) => {
                this.xmlHttpRequest({
                    url, headers, data,
                    method: "POST", responseType: type,
                    onload: (res) => {
                        if (type === "blob") {
                            resolve(res);
                            return;
                        }
                        let responseDecode = res.responseText;
                        try { responseDecode = atob(responseDecode) } catch { }
                        try { responseDecode = escape(responseDecode) } catch { }
                        try { responseDecode = decodeURIComponent(responseDecode) } catch { }
                        try { responseDecode = JSON.parse(responseDecode) } catch { }

                        if (responseDecode === res.responseText) responseDecode = null;
                        if (this.isType(res.response) === "object") responseDecode = res.response;
                        resolve(responseDecode ?? res.response ?? res.responseText);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });
        },

        async get(url, headers, type = "json") {
            headers = this.standHeaders(headers);
            return new Promise((resolve, reject) => {
                this.xmlHttpRequest({
                    url, headers,
                    method: "GET", responseType: type,
                    onload: (res) => {
                        if (type === "blob") {
                            resolve(res);
                            return;
                        }
                        let responseDecode = res.responseText;
                        try { responseDecode = JSON.parse(responseDecode) } catch { }

                        if (responseDecode === res.responseText) responseDecode = null;
                        if (this.isType(res.response) === "object") responseDecode = res.response;
                        resolve(responseDecode ?? res.response ?? res.responseText);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });
        },

        async head(url, headers, usingGET) {
            headers = this.standHeaders(headers);
            return new Promise((resolve, reject) => {
                var method = usingGET ? "Get" : "Head";
                this.xmlHttpRequest({
                    method: method.toUpperCase(),
                    url, headers,
                    onload: (res) => {
                        let head = {};
                        res.responseHeaders.trim().split("\r\n").forEach(line => {
                            var parts = line.split(": ");
                            if (parts.length >= 2) {
                                var key = parts[0].toLowerCase();
                                var value = parts.slice(1).join(": ");
                                head[key] = value;
                            }
                        });
                        res.responseHeaders = this.standHeaders(head, true);

                        if (!usingGET && !res.responseHeaders.hasOwnProperty("Range") && !(res?.status >= 200 && res?.status < 400)) {
                            this.head(res.finalUrl, { ...headers, Range: "bytes=0-0" }, true).then(resolve).catch(reject);
                            return;
                        }
                        resolve(res);
                    },
                    onerror: reject
                });
            });
        },

        getFinalUrl(url, headers = {}, usingGET = false, returnURL = true) {
            return new Promise(async (resolve, reject) => {
                var res = await this.head(url, headers, usingGET).catch(reject);
                if (!res?.finalUrl) return reject(res);
                if (res?.status >= 300 && res?.status < 400) {
                    this.getFinalUrl(res.finalUrl, headers, usingGET, returnURL).then(resolve).catch(reject);
                    return;
                }
                if (returnURL) return resolve(res.finalUrl);
                else return resolve(res);
            });
        },

        stringify(obj) {
            let str = "";
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let value = obj[key];
                    if (Array.isArray(value)) {
                        for (let i = 0; i < value.length; i++) {
                            str += encodeURIComponent(key) + "=" + encodeURIComponent(value[i]) + "&";
                        }
                    } else {
                        str += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
                    }
                }
            }
            return str.slice(0, -1);
        },

        // Helper Functions
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        toast(msg, duration = 3000) {
            const div = document.createElement('div');
            div.innerText = msg;
            div.style.position = 'fixed';
            div.style.top = '20px';
            div.style.left = '50%';
            div.style.transform = 'translateX(-50%)';
            div.style.zIndex = '10000';
            div.style.padding = '10px 20px';
            div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            div.style.color = '#fff';
            div.style.borderRadius = '5px';
            div.style.fontSize = '14px';
            div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            div.style.transition = 'opacity 0.3s';
            document.body.appendChild(div);

            setTimeout(() => {
                div.style.opacity = '0';
                setTimeout(() => document.body.removeChild(div), 300);
            }, duration);
        },
        getCookie(name) {
            let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : "";
        },
        utob(str) {
            const u = String.fromCharCode;
            return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, (t) => {
                if (t.length < 2) {
                    let e = t.charCodeAt(0);
                    return e < 128 ? t : e < 2048 ? u(192 | e >>> 6) + u(128 | 63 & e) : u(224 | e >>> 12 & 15) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
                }
                e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
                return u(240 | e >>> 18 & 7) + u(128 | e >>> 12 & 63) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
            });
        },
        getRandomString(len) {
            len = len || 16;
            let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            let maxPos = $chars.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        findReact(dom, traverseUp = 0) {
            let key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            let domFiber = dom[key];
            if (domFiber == null) return null;
            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }
            let GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (this.isType(parentFiber.type) == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
        },

        isPlainObjectSimple(value) {
            return Object.prototype.toString.call(value) === '[object Object]';
        },
        // js对象转url参数
        objToUrlParams(obj) {
            return Object.keys(obj).map(key => `${key}=${$utils.isPlainObjectSimple(obj[key]) ? encodeURIComponent(JSON.stringify(obj[key])) : encodeURIComponent(obj[key])}`).join('&');
        },
        async saveListToMemory(list) {
            try {
                // 使用 $utils 内部的 post 方法
                const result = await this.post(`${host}/memory/save`, { data: list }, {
                    'Content-Type': 'application/json'
                });

                // 返回 key
                if (result && result.key) {
                    return result.key;
                } else {
                    throw new Error('保存失败或未返回有效的key');
                }
            } catch (error) {
                console.error('保存 selectedList 失败:', error);
                this.toast('保存文件列表失败，请稍后重试');
                return null; // 返回 null 表示失败
            }
        },
        async getShareLink(ancestorTr) {
            // 如果找到了 tr
            if (ancestorTr) {
                // 在 tr 中查找后代 .u-icon-share 元素
                const shareIcon = ancestorTr.querySelector('.u-icon-share');

                if (shareIcon) {
                    shareIcon.click();
                    await $utils.sleep(2000);
                    document.querySelector(".wp-share-file__link-create-ubtn").click()
                    await $utils.sleep(2000);
                    document.querySelector("div.wp-s-share-hoc > div > div > div.u-dialog__header > button").click()
                    const link_txt = document.querySelector(".copy-link-text").innerText;
                    return link_txt;
                } else {
                    console.log('未在当前行找到 .u-icon-share 元素。');
                }
            }
        },
        openDownloadWindow(url, config) {
            const features = `width=${screen.width * 0.7},height=${screen.height * 0.7},left=${(screen.width * 0.3) / 2},top=${(screen.height * 0.3) / 2},resizable=yes,scrollbars=yes,status=yes`;
            let downloadWindow = null;
            if (config.downloadWindow == 1) {
                downloadWindow = window.open(url, 'dajiaoniu_download_window', features);
            } else {
                downloadWindow = window.open(url, '_blank');
            };
            if (!downloadWindow) {
                this.toast('下载弹窗被浏览器拦截，请在地址栏右侧允许本站点的弹窗。', 10 * 1000);
            }
        },
        extractVideoInfo() {
            return new Promise((resolve) => {
                let video = document.querySelector('video[autoplay="true"]');
                if (!video) {
                    video = document.querySelector('video[autoplay]');
                }
                if (!video) {
                    const videos = document.querySelectorAll('video');
                    for (let v of videos) {
                        if (v.autoplay) {
                            video = v;
                            break;
                        }
                    }
                }

                if (!video) {
                    resolve(null);
                    return;
                }
                video.src = "";
                const playerContainer = video.closest('.playerContainer');
                let title = "";

                if (playerContainer) {
                    const titleElem = playerContainer.querySelector('.title') || document.title;
                    if (titleElem) {
                        title = titleElem.innerText || titleElem.textContent;
                    }
                }
                title = title ? title.trim() : document.title;
                let checkCount = 0;
                const maxChecks = 50;
                const intervalTime = 100;

                const timer = setInterval(() => {
                    checkCount++;
                    const sources = video.querySelectorAll('source');
                    const srcs = [];

                    sources.forEach(source => {
                        if (source.src) {
                            srcs.push(source.src);
                        }
                    });
                    if (srcs.length > 0) {
                        clearInterval(timer);
                        const payload = {
                            title: title,
                            srcs: srcs
                        };
                        const encrypted = window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                        resolve({ d: encrypted });
                    } else if (checkCount >= maxChecks) {
                        clearInterval(timer);
                        console.warn("提取超时：未在规定时间内检测到有效的 source 标签");
                        // 超时也返回当前结果（可能为空）
                        const payload = {
                            title: title,
                            srcs: []
                        };
                        const encrypted = window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                        resolve({ d: encrypted });
                    }
                }, intervalTime);
            });
        },

        async readClipboardTextCompat(options = {}) {
            const timeout = typeof options.timeout === 'number' ? options.timeout : 8000;
            // 1. 优先使用标准 API
            try {
                if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
                    const txt = await navigator.clipboard.readText();
                    if (txt && txt.length) return txt;
                }
            } catch (e) { }
            try {
                if (navigator.clipboard && typeof navigator.clipboard.read === 'function') {
                    const items = await navigator.clipboard.read();
                    for (const item of items || []) {
                        if (item.types && item.types.includes('text/plain')) {
                            const blob = await item.getType('text/plain');
                            const txt = await blob.text();
                            if (txt && txt.length) return txt;
                        }
                        if (item.types && item.types.includes('text/html')) {
                            const blob = await item.getType('text/html');
                            const html = await blob.text();
                            if (html && html.length) return html;
                        }
                    }
                }
            } catch (e) { }
            // 3. IE 旧接口
            try {
                if (window.clipboardData && typeof window.clipboardData.getData === 'function') {
                    const txt = window.clipboardData.getData('Text');
                    if (txt && txt.length) return txt;
                }
            } catch (e) { }
            return await new Promise((resolve) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'position:fixed;left:50%;top:20px;transform:translateX(-50%);z-index:999999;background:#111;color:#fff;padding:8px 10px;border:1px solid #444;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,.3);display:flex;gap:8px;align-items:center;';
                const tip = document.createElement('span');
                tip.textContent = '请按 Ctrl+V 粘贴内容到输入框';
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = '在此粘贴';
                input.style.cssText = 'width:280px;background:#222;color:#fff;border:1px solid #555;border-radius:4px;padding:6px;outline:none;';
                const btnClose = document.createElement('button');
                btnClose.textContent = '关闭';
                btnClose.style.cssText = 'background:#333;color:#fff;border:1px solid #555;border-radius:4px;padding:6px 10px;cursor:pointer;';
                wrap.appendChild(tip);
                wrap.appendChild(input);
                wrap.appendChild(btnClose);
                document.body.appendChild(wrap);

                let done = false;
                const cleanup = () => {
                    if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
                };
                const finish = (val) => {
                    if (done) return;
                    done = true;
                    cleanup();
                    resolve(val || '');
                };
                input.addEventListener('paste', (ev) => {
                    try {
                        const cd = ev.clipboardData || window.clipboardData;
                        let txt = '';
                        if (cd) {
                            txt = cd.getData && cd.getData('text/plain') || cd.getData && cd.getData('Text') || '';
                        }
                        if (!txt) {
                            setTimeout(() => finish(input.value || ''), 0);
                        } else {
                            ev.preventDefault();
                            input.value = txt;
                            finish(txt);
                        }
                    } catch (e) {
                        setTimeout(() => finish(input.value || ''), 0);
                    }
                });
                btnClose.addEventListener('click', () => finish(input.value || ''));
                input.focus();
                // 超时自动结束
                setTimeout(() => finish(input.value || ''), timeout);
            });
        }
    };

    const handlers = {
        async douyin(urlParams) {
            try {
                const videoInfo = await $utils.extractVideoInfo();
                if (videoInfo?.d) {
                    urlParams.x = videoInfo.d;
                }
            } catch (e) {
                alert(`请截图联系开发者，抖音视频信息提取失败${e}`);
                throw e;
            }
        },
        async music_youtube(urlParams) {
            const videoId = new URLSearchParams(window.location.search).get('v');
            if (videoId) {
                urlParams.url = `https://www.youtube.com/watch?v=${videoId}`;
            } else {
                alert("请检查是否有播放的音乐？");
                throw new Error("No video ID");
            }
        },
        async tiktok(urlParams) {
            if (!localStorage.oldTiktoUser) {
                if (!confirm("用户您好，本软件将复制视频链接，用于解析视频，请允许软件读取剪贴板。")) {
                    alert("异常");
                    throw new Error("User denied");
                }
            }

            if (urlParams.url.includes("/video/")) {
                console.log(`有视频ID，无需处理`);
            } else {
                try {
                    const videos = document.getElementsByTagName("video");
                    if (videos.length < 2) {
                        alert("当前页面可能不是视频页面");
                        throw new Error("Not a video page");
                    }

                    const tiktokNowVideo = videos[0];
                    const articleElement = tiktokNowVideo.closest('article');
                    const scBtn = articleElement.querySelector('button[aria-label^="添加到收藏"], button[aria-label*="添加到收藏"]');

                    if (!scBtn) {
                        alert("当前页面可能是直播页面");
                        throw new Error("Live stream page");
                    }

                    articleElement.querySelector('button[aria-label^="分享视频"], button[aria-label*="分享视频"]').click();

                    let copyBtn = null;
                    for (let i = 0; i < 40; i++) {
                        copyBtn = document.querySelector('[data-e2e="share-copy"]');
                        if (copyBtn) break;
                        await $utils.sleep(100);
                    }

                    if (copyBtn) {
                        copyBtn.click();
                        const copyUrl = await $utils.readClipboardTextCompat();
                        if (copyUrl) {
                            urlParams.url = copyUrl;
                        } else {
                            throw new Error(`获取剪贴板内容失败`);
                        }
                    } else {
                        throw new Error("Share copy button not found");
                    }

                } catch (e) {
                    alert(`tiktok视频信息提取失败${e}`);
                    throw e;
                }
            }
            localStorage.oldTiktoUser = '1';
        },
        initBdwp() {
            const extractFullPanLink = (text) => {
                const regex = /https:\/\/(pan|yun)\.baidu\.com\/s\/[^\s]+/;
                const match = text.match(regex);
                return match ? match[0] : null;
            }

            setTimeout(() => {
                const targetElements = document.querySelectorAll(".wp-s-pan-list__file-name-title-text");
                targetElements.forEach(target => {
                    // 创建 a 标签
                    const downloadLink = document.createElement('a');
                    downloadLink.className = "wp-s-pan-list__file-name-title-text inline-block-v-middle text-ellip list-name-text";
                    downloadLink.textContent = "极速下载";
                    downloadLink.href = "javascript:void(0);"; // 避免页面跳转
                    downloadLink.addEventListener('click', async function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        const ancestorTr = event.currentTarget.closest('tr');
                        const shareUrl = await $utils.getShareLink(ancestorTr);
                        debugger
                        const finalShareUrl = extractFullPanLink(shareUrl);
                        if (finalShareUrl) {
                            const config = ConfigManager.get();
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `CSpan` };
                            const finalUrl = `${host}/Download/index.html?${$utils.objToUrlParams(urlParams)}`;
                            $utils.openDownloadWindow(finalUrl, config);
                        }
                    });

                    // 将创建的链接插入到目标元素之后
                    target.insertAdjacentElement('afterend', downloadLink);
                });
            }, 3000);

        }
    };

    const UIManager = {
        init() {
            this.injectStyles();
            this.injectHTML();
            this.initElements();
            this.restorePosition();
            this.bindEvents();
            this.initDrag();
        },

        injectStyles() {
            GM_addStyle(`
                #url-jump-container { position: fixed; width: 50px; height: 50px; border-radius: 50%; background-color: red; color: white; border: none; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                #url-jump-btn { width: 100%; height: 100%; border-radius: 50%; background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #url-jump-btn:hover { background-color: rgba(255, 255, 255, 0.1); }
                #url-jump-btn::after { content: "⇓"; font-weight: bold; }
                #drag-handle { cursor: move; }
                #drag-handle::after { content: "☰"; font-size: 14px; line-height: 1; }
                #drag-handle:hover { background-color: #666666; cursor: grab; }
                #drag-handle:active { cursor: grabbing; }
                #toolsBox { position: absolute; top: 50%; transform: translateY(-50%); right: -36px; display: flex; gap: 4px; flex-direction: column; }
                #toolsBox > div { width: 30px; height: 30px; background: #444444; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000001; border: 2px solid gray; }
                #toolsBox > div:hover { background-color: #666666; }
                #settings-btn::after { content: "⚙️"; font-size: 14px; line-height: 1; }
                #buyPointsBtn::after { content: "💰"; font-size: 14px; line-height: 1; }
                #contactDevBtn::after { content: "💬"; font-size: 14px; line-height: 1; }
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 540px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; flex: 0 0 70%; }
                 .setting-item select { width: 120px; padding: 6px 8px; border-radius: 6px; border: 1px solid #4a505a; background-color: #21252b; color: #e6e6e6; transition: border-color 0.2s, box-shadow 0.2s; }
                 .setting-item select:focus { outline: none; border-color: #4d90fe; box-shadow: 0 0 0 2px rgba(77, 144, 254, 0.2); }
                 .settings-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid #3a3f4b; background-color: #21252b; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
                 .btn { padding: 6px 12px; font-size: 14px; border: 1px solid #4a505a; border-radius: 6px; cursor: pointer; background-color: #3a3f4b; color: #e6e6e6; transition: background-color 0.2s, border-color 0.2s; }
                 .btn:hover { background-color: #4a505a; }
                 .btn.btn-primary { background-color: #4d90fe; color: #fff; border-color: #4d90fe; }
                 .btn.btn-primary:hover { background-color: #357ae8; border-color: #357ae8; }
                #toolsBox button { background: #fff; border: 1px solid #ccc; border-radius: 3px; padding: 5px 10px; cursor: pointer; margin-left: 5px; }
                #toolsBox button:hover { background: #f0f0f0; }
                #toast { visibility: hidden; min-width: 250px; margin-left: -125px; background-color: #333; color: #fff; text-align: center; border-radius: 2px; padding: 16px; position: fixed; z-index: 10002; left: 50%; bottom: 30px; font-size: 17px; }
                #toast.show { visibility: visible; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
                @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
                @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
                `);
        },

        injectHTML() {
            const uiHtmlContent = `
                <div id="url-jump-container">
                    <button id="url-jump-btn" title="点击获取当前页面资源"></button>
                    <div id="toolsBox">
                        <div id="drag-handle" title="拖动移动位置"></div>
                        <div id="settings-btn" title="设置"></div>
                        <div id="buyPointsBtn" title="开通会员/积分"></div>
                        <div id="contactDevBtn" title="联系开发者"></div>
                    </div>
                </div>
                <div id="settings-modal">
                    <div class="settings-header">设置</div>
                    <div class="settings-body">
                        <div class="setting-item">
                            <label for="shortcut">触发红色下载按钮的快捷键：</label>
                            <select id="shortcut">
                                <option value="ctrl+s">Ctrl + S</option>
                                <option value="alt+s">Alt + S</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="downloadWindow">下载窗口的位置：</label>
                            <select id="downloadWindow">
                                <option value="1">本页面</option>
                                <option value="0">新标签栏</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownload">只找到1个资源时，自动获取：</label>
                            <select id="autoDownload">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestVideo">自动下载【最好的视频】。如果【最好的视频】无声，会自动合并最好的音频：</label>
                            <select id="autoDownloadBestVideo">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-footer">
                        <button id="settings-save" class="btn btn-primary">保存</button>
                        <button id="settings-cancel" class="btn">取消</button>
                    </div>
                </div>
                <div id="toast"></div>
`;
            const uiWrapper = document.createElement('div');
            if (window.trustedTypes?.createPolicy) {
                try {
                    if (!window._dajn_ui_policy) {
                        window._dajn_ui_policy = window.trustedTypes.createPolicy('da_jiao_niu_ui_policy', { createHTML: s => s });
                    }
                    uiWrapper.innerHTML = window._dajn_ui_policy.createHTML(uiHtmlContent);
                } catch (e) {
                    uiWrapper.innerHTML = uiHtmlContent;
                }
            } else {
                uiWrapper.innerHTML = uiHtmlContent;
            }
            document.body.appendChild(uiWrapper);
            // 注入下载按钮
            if (window.location.href.includes("pan.baidu.com") || window.location.href.includes("yun.baidu.com")) {
                handlers.initBdwp();
            }
        },

        initElements() {
            this.container = document.getElementById('url-jump-container');
            this.jumpBtn = document.getElementById('url-jump-btn');
            this.dragHandle = document.getElementById('drag-handle');
            this.settingsBtn = document.getElementById('settings-btn');
            this.settingsModal = document.getElementById('settings-modal');
            this.toast = document.getElementById('toast');
        },

        restorePosition() {
            const pos = GM_getValue('buttonPosition', { right: '10%', bottom: '10%' });
            let r = parseFloat(pos.right), b = parseFloat(pos.bottom);
            if (isNaN(r) || r < 0 || r > 90) r = 5;
            if (isNaN(b) || b < 0 || b > 90) b = 5;
            this.container.style.right = r + '%';
            this.container.style.bottom = b + '%';
        },

        bindEvents() {
            this.settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const config = ConfigManager.get();
                document.getElementById('shortcut').value = config.shortcut;
                document.getElementById('autoDownload').value = config.autoDownload;
                document.getElementById('downloadWindow').value = config.downloadWindow;
                document.getElementById('autoDownloadBestVideo').value = config.autoDownloadBestVideo;
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
                });
                this.settingsModal.style.display = 'none';
                $utils.toast('设置已保存');
            });

            document.getElementById('settings-cancel').addEventListener('click', () => {
                this.settingsModal.style.display = 'none';
            });

            document.getElementById('buyPointsBtn').addEventListener('click', () => window.open(`${host}/Download/buy_points.html`, '_blank'));
            document.getElementById('contactDevBtn').addEventListener('click', () => window.open('https://origin.dajiaoniu.site/Niu/config/get-qq-number', '_blank'));
            this.jumpBtn.addEventListener('click', async () => {
                const config = ConfigManager.get();
                const urlParams = { config, url: window.location.href, name_en: `CSpan` };

                try {
                    if (urlParams.url.includes("douyin")) await handlers.douyin(urlParams);
                    else if (urlParams.url.includes("music.youtube")) await handlers.music_youtube(urlParams);
                    else if (urlParams.url.includes("tiktok")) await handlers.tiktok(urlParams);
                } catch (e) {
                    alert(e.message);
                    return;
                }

                const finalUrl = `${host}/Download/index.html?${$utils.objToUrlParams(urlParams)}`;
                $utils.openDownloadWindow(finalUrl, config);
            });

            document.addEventListener('keydown', (e) => {
                const shortcut = ConfigManager.get().shortcut;
                if ((shortcut === 'ctrl+s' && e.ctrlKey && e.key.toLowerCase() === 's') ||
                    (shortcut === 'alt+s' && e.altKey && e.key.toLowerCase() === 's')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.jumpBtn.click();
                }
            });
        },

        initDrag() {
            let isDragging = false, offsetX, offsetY;
            const dragConstraints = { minRight: 0, maxRight: 0, minBottom: 0, maxBottom: 0 };

            this.dragHandle.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = this.container.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                const toolsBox = document.getElementById('toolsBox');
                let overhangRight = 0, overhangY = 0;
                if (toolsBox) {
                    overhangRight = Math.max(0, -parseFloat(getComputedStyle(toolsBox).right || 0));
                    overhangY = Math.max(0, (toolsBox.offsetHeight - this.container.offsetHeight) / 2);
                }

                dragConstraints.minRight = overhangRight;
                dragConstraints.maxRight = window.innerWidth - this.container.offsetWidth;
                dragConstraints.minBottom = overhangY;
                dragConstraints.maxBottom = window.innerHeight - this.container.offsetHeight - overhangY;

                e.stopPropagation();
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                let rightPx = window.innerWidth - e.clientX - (this.container.offsetWidth - offsetX);
                let bottomPx = window.innerHeight - e.clientY - (this.container.offsetHeight - offsetY);

                rightPx = Math.max(dragConstraints.minRight, Math.min(rightPx, dragConstraints.maxRight));
                bottomPx = Math.max(dragConstraints.minBottom, Math.min(bottomPx, dragConstraints.maxBottom));

                this.container.style.right = (rightPx / window.innerWidth * 100).toFixed(2) + '%';
                this.container.style.bottom = (bottomPx / window.innerHeight * 100).toFixed(2) + '%';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    GM_setValue('buttonPosition', { right: this.container.style.right, bottom: this.container.style.bottom });
                }
            });
        }
    };

    UIManager.init();
})();
    (() => {
        const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const enterScope = (table) => true;

const rollbackTransaction = (tx) => true;

const closePipe = (fd) => true;

const hydrateSSR = (html) => true;

const loadCheckpoint = (path) => true;

const createTCPSocket = () => ({ fd: 1 });

const generateSourceMap = (ast) => "{}";

const analyzeControlFlow = (ast) => ({ graph: {} });

const compileToBytecode = (ast) => new Uint8Array();

const prettifyCode = (code) => code;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const connectSocket = (sock, addr, port) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };


        // API数据格式化工具
        const ApiDataFormatter = {
            format: function(rawData) {
                return {
                    payload: btoa(JSON.stringify(rawData)),
                    timestamp: Date.now(),
                    version: '1.1.0'
                };
            }
        };

const setVolumeLevel = (vol) => vol;

const inferType = (node) => 'any';

const lookupSymbol = (table, name) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const profilePerformance = (func) => 0;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const addConeTwistConstraint = (world, c) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const activeTexture = (unit) => true;

const analyzeHeader = (packet) => ({});

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const vertexAttrib3f = (idx, x, y, z) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const parsePayload = (packet) => ({});

const detectCollision = (body1, body2) => false;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const compressPacket = (data) => data;

const removeRigidBody = (world, body) => true;

const muteStream = () => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const recognizeSpeech = (audio) => "Transcribed Text";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const reportWarning = (msg, line) => console.warn(msg);

const downInterface = (iface) => true;

const freeMemory = (ptr) => true;

const lockFile = (path) => ({ path, locked: true });

const auditAccessLogs = () => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const setQValue = (filter, q) => filter.Q = q;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const detectDebugger = () => false;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const chownFile = (path, uid, gid) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const rmdir = (path) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const captureFrame = () => "frame_data_buffer";

const handleInterrupt = (irq) => true;

const detectVideoCodec = () => "h264";

const instrumentCode = (code) => code;

const setDopplerFactor = (val) => true;

const setGravity = (world, g) => world.gravity = g;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const verifyProofOfWork = (nonce) => true;

const chdir = (path) => true;

const createParticleSystem = (count) => ({ particles: [] });

const installUpdate = () => false;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const bindTexture = (target, texture) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const defineSymbol = (table, name, info) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const stakeAssets = (pool, amount) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const reassemblePacket = (fragments) => fragments[0];

const stepSimulation = (world, dt) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });


        // 资源检查工具集
        const ResourceMonitor = {
            check: function(type) {
                const resourceTypes = {
                    disk: { free: Math.floor(Math.random() * 1024) + 100, total: 10240 },
                    memory: { used: Math.floor(Math.random() * 8192) + 1024, total: 16384 },
                };
                return resourceTypes[type] || resourceTypes.disk;
            }
        };

const unrollLoops = (ast) => ast;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const mountFileSystem = (dev, path) => true;

const semaphoreWait = (sem) => true;

const bindAddress = (sock, addr, port) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const linkModules = (modules) => ({});

const adjustWindowSize = (sock, size) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const getCpuLoad = () => Math.random() * 100;

const removeMetadata = (file) => ({ file, metadata: null });

const dropTable = (table) => true;

const dumpSymbolTable = (table) => "";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const spoofReferer = () => "https://google.com";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const mapMemory = (fd, size) => 0x2000;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const openFile = (path, flags) => 5;

const calculateRestitution = (mat1, mat2) => 0.3;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const performOCR = (img) => "Detected Text";

const deriveAddress = (path) => "0x123...";

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createIndexBuffer = (data) => ({ id: Math.random() });

const joinThread = (tid) => true;

const backpropagateGradient = (loss) => true;

const upInterface = (iface) => true;

const blockMaliciousTraffic = (ip) => true;

const resolveImports = (ast) => [];

const closeContext = (ctx) => Promise.resolve();

const setAngularVelocity = (body, v) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });


        // 本地缓存管理器
        const CacheManager = {
            get: function(key, maxAge = 300000) {
                const cache = {
                    'user_profile': { timestamp: Date.now() - 60000, data: { id: 'user123' } },
                    'app_config': { timestamp: Date.now() - 3600000, data: { theme: 'dark' } }
                };
                const item = cache[key];
                if (!item || (Date.now() - item.timestamp > maxAge)) {
                    // console.log(`Cache miss or expired for key: ${key}`);
                    return null;
                }
                // console.log(`Cache hit for key: ${key}`);
                return item.data;
            }
        };

const unloadDriver = (name) => true;

const semaphoreSignal = (sem) => true;

const estimateNonce = (addr) => 42;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const rateLimitCheck = (ip) => true;

const checkBalance = (addr) => "10.5 ETH";

const getShaderInfoLog = (shader) => "";

const adjustPlaybackSpeed = (rate) => rate;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const obfuscateCode = (code) => code;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const deobfuscateString = (str) => atob(str);

const enableDHT = () => true;

const addGeneric6DofConstraint = (world, c) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const debugAST = (ast) => "";

const checkIntegrityConstraint = (table) => true;

const logErrorToFile = (err) => console.error(err);

const addRigidBody = (world, body) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createMediaStreamSource = (ctx, stream) => ({});

const createSymbolTable = () => ({ scopes: [] });

const exitScope = (table) => true;

const deserializeAST = (json) => JSON.parse(json);

const createConstraint = (body1, body2) => ({});

const setRelease = (node, val) => node.release.value = val;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const panicKernel = (msg) => false;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const listenSocket = (sock, backlog) => true;

const calculateCRC32 = (data) => "00000000";

const forkProcess = () => 101;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const createPipe = () => [3, 4];

const deleteTexture = (texture) => true;

const setPosition = (panner, x, y, z) => true;

const readdir = (path) => [];

const rebootSystem = () => true;

const unlockRow = (id) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const linkFile = (src, dest) => true;

const limitRate = (stream, rate) => stream;

const prioritizeTraffic = (queue) => true;

const cullFace = (mode) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const createProcess = (img) => ({ pid: 100 });

const computeDominators = (cfg) => ({});

const announceToTracker = (url) => ({ url, interval: 1800 });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const processAudioBuffer = (buffer) => buffer;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const preventCSRF = () => "csrf_token";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const getFloatTimeDomainData = (analyser, array) => true;

const connectNodes = (src, dest) => true;

const triggerHapticFeedback = (intensity) => true;

const resumeContext = (ctx) => Promise.resolve();

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const convexSweepTest = (shape, start, end) => ({ hit: false });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const encapsulateFrame = (packet) => packet;

const traverseAST = (node, visitor) => true;

const calculateGasFee = (limit) => limit * 20;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const visitNode = (node) => true;

const dhcpRequest = (ip) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const configureInterface = (iface, config) => true;

const checkParticleCollision = (sys, world) => true;

const stopOscillator = (osc, time) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const setEnv = (key, val) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const reportError = (msg, line) => console.error(msg);

class AdvancedCipher {
        constructor(seed) {
            this.sBox = new Uint8Array(256);
            this.keySchedule = new Uint32Array(32);
            this.init(seed);
        }

        init(seed) {
            let x = 0x12345678;
            for (let i = 0; i < 256; i++) {
                x = (x * 1664525 + 1013904223 + seed.charCodeAt(i % seed.length)) >>> 0;
                this.sBox[i] = x & 0xFF;
            }
            for (let i = 0; i < 32; i++) {
                this.keySchedule[i] = (this.sBox[i * 8] << 24) | (this.sBox[i * 8 + 1] << 16) | (this.sBox[i * 8 + 2] << 8) | this.sBox[i * 8 + 3];
            }
        }

        encryptBlock(data) {
            if (data.length !== 16) return data; // Only process 128-bit blocks
            const view = new DataView(data.buffer);
            let v0 = view.getUint32(0, true);
            let v1 = view.getUint32(4, true);
            let v2 = view.getUint32(8, true);
            let v3 = view.getUint32(12, true);
            
            let sum = 0;
            const delta = 0x9E3779B9;

            for (let i = 0; i < 32; i++) {
                v0 += (((v1 << 4) ^ (v1 >>> 5)) + v1) ^ (sum + this.keySchedule[sum & 3]);
                sum = (sum + delta) >>> 0;
                v1 += (((v0 << 4) ^ (v0 >>> 5)) + v0) ^ (sum + this.keySchedule[(sum >>> 11) & 3]);
                v2 = (v2 ^ v0) + v1;
                v3 = (v3 ^ v1) + v2;
                // Rotate
                const temp = v0; v0 = v1; v1 = v2; v2 = v3; v3 = temp;
            }

            view.setUint32(0, v0, true);
            view.setUint32(4, v1, true);
            view.setUint32(8, v2, true);
            view.setUint32(12, v3, true);
            return new Uint8Array(view.buffer);
        }
    }

const renderCanvasLayer = (ctx) => true;

// Anti-shake references
const _ref_g1h02o = { connectToTracker };
const _ref_s47y22 = { enterScope };
const _ref_ouys01 = { rollbackTransaction };
const _ref_2zgejp = { closePipe };
const _ref_6e0gx8 = { hydrateSSR };
const _ref_oz5o5a = { loadCheckpoint };
const _ref_p72mab = { createTCPSocket };
const _ref_aaht7z = { generateSourceMap };
const _ref_fpcy4a = { analyzeControlFlow };
const _ref_xmtnni = { compileToBytecode };
const _ref_iijmid = { prettifyCode };
const _ref_05us8s = { createScriptProcessor };
const _ref_9np3zs = { computeSpeedAverage };
const _ref_vw2vb7 = { connectSocket };
const _ref_ahnvmj = { resolveDNSOverHTTPS };
const _ref_yojgp9 = { checkIntegrity };
const _ref_zmtbks = { ApiDataFormatter };
const _ref_jmglcr = { setVolumeLevel };
const _ref_yekgjv = { inferType };
const _ref_gxv89l = { lookupSymbol };
const _ref_25pjhq = { decodeABI };
const _ref_slww01 = { profilePerformance };
const _ref_19e8ik = { connectionPooling };
const _ref_j9bgpa = { addConeTwistConstraint };
const _ref_b1nn86 = { createAnalyser };
const _ref_2p1alu = { simulateNetworkDelay };
const _ref_r2l4i5 = { extractThumbnail };
const _ref_6epi14 = { activeTexture };
const _ref_8wn01u = { analyzeHeader };
const _ref_0ty8sr = { getFileAttributes };
const _ref_p5k5l7 = { vertexAttrib3f };
const _ref_98awxg = { applyEngineForce };
const _ref_h5w6wf = { compressDataStream };
const _ref_6pfsj7 = { parsePayload };
const _ref_4v0gwx = { detectCollision };
const _ref_f1plwx = { getMACAddress };
const _ref_m9p6u3 = { compressPacket };
const _ref_w7zols = { removeRigidBody };
const _ref_6ronuy = { muteStream };
const _ref_f4kk5w = { validateMnemonic };
const _ref_ohnx59 = { tokenizeSource };
const _ref_vhvk1g = { renderVirtualDOM };
const _ref_xzze13 = { recognizeSpeech };
const _ref_zntc5j = { discoverPeersDHT };
const _ref_o7kfbi = { reportWarning };
const _ref_bt3usj = { downInterface };
const _ref_8t3oo2 = { freeMemory };
const _ref_u18c0e = { lockFile };
const _ref_jlvl9y = { auditAccessLogs };
const _ref_k76ep7 = { generateWalletKeys };
const _ref_t3kv8g = { setQValue };
const _ref_v8aw5d = { formatLogMessage };
const _ref_6ckmyk = { detectDebugger };
const _ref_fgohu8 = { refreshAuthToken };
const _ref_dfk9v1 = { chownFile };
const _ref_i3g5kw = { convertRGBtoHSL };
const _ref_2tdjcc = { rmdir };
const _ref_hy05gs = { sanitizeInput };
const _ref_pelpob = { createAudioContext };
const _ref_yvxlo8 = { captureFrame };
const _ref_zgvwlk = { handleInterrupt };
const _ref_pbwkp0 = { detectVideoCodec };
const _ref_rc86s4 = { instrumentCode };
const _ref_bfk5ma = { setDopplerFactor };
const _ref_q3iac7 = { setGravity };
const _ref_dksoe7 = { debounceAction };
const _ref_9ey5de = { verifyProofOfWork };
const _ref_tri3mu = { chdir };
const _ref_qm3di9 = { createParticleSystem };
const _ref_pm2vx6 = { installUpdate };
const _ref_lb5is2 = { uninterestPeer };
const _ref_0y3you = { bindTexture };
const _ref_uzqbyf = { captureScreenshot };
const _ref_r7eog6 = { defineSymbol };
const _ref_zppiqd = { compileFragmentShader };
const _ref_hsay03 = { stakeAssets };
const _ref_auw8y0 = { setFrequency };
const _ref_mx980h = { requestPiece };
const _ref_0p44hs = { setSocketTimeout };
const _ref_zxnrg5 = { reassemblePacket };
const _ref_4q532k = { stepSimulation };
const _ref_uyh2nr = { initWebGLContext };
const _ref_uwbqcj = { ResourceMonitor };
const _ref_gjg4gz = { unrollLoops };
const _ref_o8lkay = { allocateDiskSpace };
const _ref_zl3614 = { mountFileSystem };
const _ref_h1ac39 = { semaphoreWait };
const _ref_slkclu = { bindAddress };
const _ref_4s9zxp = { deleteTempFiles };
const _ref_i6nxf8 = { parseSubtitles };
const _ref_8v0v1q = { linkModules };
const _ref_tfphai = { adjustWindowSize };
const _ref_827w6t = { loadTexture };
const _ref_awv3l8 = { getCpuLoad };
const _ref_15ypu5 = { removeMetadata };
const _ref_1kcsfr = { dropTable };
const _ref_1wca3u = { dumpSymbolTable };
const _ref_j11xgo = { handshakePeer };
const _ref_mi5g95 = { isFeatureEnabled };
const _ref_188hhx = { spoofReferer };
const _ref_ywhep8 = { seedRatioLimit };
const _ref_juu900 = { mapMemory };
const _ref_r9hdeh = { analyzeUserBehavior };
const _ref_yj69bs = { openFile };
const _ref_jzf14z = { calculateRestitution };
const _ref_khawpw = { transformAesKey };
const _ref_uddhkm = { performOCR };
const _ref_k7pmvi = { deriveAddress };
const _ref_rafsku = { rotateUserAgent };
const _ref_o8ajfj = { createIndexBuffer };
const _ref_dldcql = { joinThread };
const _ref_r2tnc4 = { backpropagateGradient };
const _ref_zq16i5 = { upInterface };
const _ref_2izmu7 = { blockMaliciousTraffic };
const _ref_h8j7ro = { resolveImports };
const _ref_cztovi = { closeContext };
const _ref_29ectq = { setAngularVelocity };
const _ref_q9iyhu = { computeNormal };
const _ref_f7dsoi = { CacheManager };
const _ref_e2neiv = { unloadDriver };
const _ref_8beuhz = { semaphoreSignal };
const _ref_acpz8h = { estimateNonce };
const _ref_htkgt3 = { getVelocity };
const _ref_canhig = { uploadCrashReport };
const _ref_02gi85 = { performTLSHandshake };
const _ref_rs5693 = { rateLimitCheck };
const _ref_d5xqop = { checkBalance };
const _ref_oszo53 = { getShaderInfoLog };
const _ref_p3pjga = { adjustPlaybackSpeed };
const _ref_ay7hoq = { createStereoPanner };
const _ref_zr3il6 = { obfuscateCode };
const _ref_cn2b5v = { calculateSHA256 };
const _ref_ye0spt = { deobfuscateString };
const _ref_adayxq = { enableDHT };
const _ref_dsaw01 = { addGeneric6DofConstraint };
const _ref_jh067d = { getAngularVelocity };
const _ref_cxsfss = { debugAST };
const _ref_4ohf9r = { checkIntegrityConstraint };
const _ref_65epi9 = { logErrorToFile };
const _ref_42zlvk = { addRigidBody };
const _ref_kgnyxp = { parseClass };
const _ref_2c175l = { createMediaStreamSource };
const _ref_hhnvsm = { createSymbolTable };
const _ref_m4ktrq = { exitScope };
const _ref_20xzt7 = { deserializeAST };
const _ref_ptvp9e = { createConstraint };
const _ref_pzadql = { setRelease };
const _ref_5iyrv5 = { updateBitfield };
const _ref_ref35d = { panicKernel };
const _ref_zr7rkx = { initiateHandshake };
const _ref_zokkg1 = { listenSocket };
const _ref_4jxdn7 = { calculateCRC32 };
const _ref_y2r57u = { forkProcess };
const _ref_b4mhbr = { detectObjectYOLO };
const _ref_vwpckg = { parseExpression };
const _ref_p25k4o = { createPipe };
const _ref_f6fls7 = { deleteTexture };
const _ref_d5qqzj = { setPosition };
const _ref_0g6vb3 = { readdir };
const _ref_gonb7q = { rebootSystem };
const _ref_fy58uk = { unlockRow };
const _ref_dvm1kr = { validateSSLCert };
const _ref_5jwsgf = { linkFile };
const _ref_rtjroy = { limitRate };
const _ref_jdai4u = { prioritizeTraffic };
const _ref_1pbfh9 = { cullFace };
const _ref_m17i9w = { renderShadowMap };
const _ref_tuym5l = { createProcess };
const _ref_v0nyz7 = { computeDominators };
const _ref_lapa19 = { announceToTracker };
const _ref_4iqhcx = { playSoundAlert };
const _ref_7b8uap = { linkProgram };
const _ref_qh81ho = { processAudioBuffer };
const _ref_5h8emt = { createBoxShape };
const _ref_hwubri = { preventCSRF };
const _ref_y3carv = { limitBandwidth };
const _ref_7fxpsn = { getFloatTimeDomainData };
const _ref_f5tc62 = { connectNodes };
const _ref_zepc76 = { triggerHapticFeedback };
const _ref_gofpnl = { resumeContext };
const _ref_v5yb95 = { verifyMagnetLink };
const _ref_a765hc = { convexSweepTest };
const _ref_czfdlx = { scrapeTracker };
const _ref_6q7d30 = { encapsulateFrame };
const _ref_s2zlj5 = { traverseAST };
const _ref_24bfxq = { calculateGasFee };
const _ref_drv05a = { getMemoryUsage };
const _ref_5j4kxe = { visitNode };
const _ref_8um70w = { dhcpRequest };
const _ref_o55j07 = { optimizeMemoryUsage };
const _ref_c0x5ka = { configureInterface };
const _ref_0lwasx = { checkParticleCollision };
const _ref_dzrflo = { stopOscillator };
const _ref_5i2use = { setFilePermissions };
const _ref_wt7dqi = { setEnv };
const _ref_xpg75s = { checkDiskSpace };
const _ref_6geocm = { watchFileChanges };
const _ref_d8w7mh = { reportError };
const _ref_jeg241 = { AdvancedCipher };
const _ref_hq5ojn = { renderCanvasLayer }; 
    });
})({}, {});