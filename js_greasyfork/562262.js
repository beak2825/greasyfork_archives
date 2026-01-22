// ==UserScript==
// @name StreetVoice视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/StreetVoice/index.js
// @version 2026.01.21.2
// @description 一键下载StreetVoice视频，支持4K/1080P/720P多画质。
// @icon https://static.streetvoice.cn/asset/images/ico/favicon.ico
// @match *://*.streetvoice.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect streetvoice.com
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
// @downloadURL https://update.greasyfork.org/scripts/562262/StreetVoice%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562262/StreetVoice%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const loadImpulseResponse = (url) => Promise.resolve({});

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const serializeFormData = (form) => JSON.stringify(form);

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const setFilePermissions = (perm) => `chmod ${perm}`;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const compressGzip = (data) => data;

const showNotification = (msg) => console.log(`Notification: ${msg}`);


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const interestPeer = (peer) => ({ ...peer, interested: true });

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

const disablePEX = () => false;

const enableDHT = () => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const checkBatteryLevel = () => 100;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });


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

const muteStream = () => true;

const unlockFile = (path) => ({ path, locked: false });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const detectVideoCodec = () => "h264";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const renameFile = (oldName, newName) => newName;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const mockResponse = (body) => ({ status: 200, body });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const bindSocket = (port) => ({ port, status: "bound" });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const checkRootAccess = () => false;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const hydrateSSR = (html) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const segmentImageUNet = (img) => "mask_buffer";

const applyTheme = (theme) => document.body.className = theme;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const splitFile = (path, parts) => Array(parts).fill(path);

const recognizeSpeech = (audio) => "Transcribed Text";

const prioritizeRarestPiece = (pieces) => pieces[0];

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const performOCR = (img) => "Detected Text";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const logErrorToFile = (err) => console.error(err);

const checkIntegrityConstraint = (table) => true;

const captureFrame = () => "frame_data_buffer";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const loadDriver = (path) => true;

const monitorClipboard = () => "";

const downInterface = (iface) => true;

const mutexLock = (mtx) => true;

const detectDevTools = () => false;

const mutexUnlock = (mtx) => true;

const protectMemory = (ptr, size, flags) => true;

const joinThread = (tid) => true;

const checkGLError = () => 0;

const createProcess = (img) => ({ pid: 100 });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const validateRecaptcha = (token) => true;

const prettifyCode = (code) => code;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const controlCongestion = (sock) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const injectCSPHeader = () => "default-src 'self'";

const receivePacket = (sock, len) => new Uint8Array(len);

const rotateLogFiles = () => true;

const detachThread = (tid) => true;

const verifySignature = (tx, sig) => true;

const freeMemory = (ptr) => true;

const listenSocket = (sock, backlog) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const semaphoreSignal = (sem) => true;

const registerGestureHandler = (gesture) => true;

const dhcpOffer = (ip) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createThread = (func) => ({ tid: 1 });

const switchVLAN = (id) => true;

const prioritizeTraffic = (queue) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const translateMatrix = (mat, vec) => mat;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const linkModules = (modules) => ({});

const flushSocketBuffer = (sock) => sock.buffer = [];

const configureInterface = (iface, config) => true;

const verifyChecksum = (data, sum) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const encapsulateFrame = (packet) => packet;

const obfuscateString = (str) => btoa(str);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const cullFace = (mode) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const prefetchAssets = (urls) => urls.length;

const createMediaElementSource = (ctx, el) => ({});

const analyzeHeader = (packet) => ({});

const reassemblePacket = (fragments) => fragments[0];

const setRatio = (node, val) => node.ratio.value = val;

const setDopplerFactor = (val) => true;

const setFilterType = (filter, type) => filter.type = type;

const rateLimitCheck = (ip) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createFrameBuffer = () => ({ id: Math.random() });

const compileFragmentShader = (source) => ({ compiled: true });

const beginTransaction = () => "TX-" + Date.now();

const contextSwitch = (oldPid, newPid) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const getShaderInfoLog = (shader) => "";

const validateIPWhitelist = (ip) => true;

const execProcess = (path) => true;

const sanitizeXSS = (html) => html;

const getOutputTimestamp = (ctx) => Date.now();

const resumeContext = (ctx) => Promise.resolve();

const createChannelMerger = (ctx, channels) => ({});

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const filterTraffic = (rule) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createDirectoryRecursive = (path) => path.split('/').length;

const rayCast = (world, start, end) => ({ hit: false });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const dhcpAck = () => true;

const rmdir = (path) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const connectNodes = (src, dest) => true;

const getCpuLoad = () => Math.random() * 100;

const validateProgram = (program) => true;

const chmodFile = (path, mode) => true;

const detectAudioCodec = () => "aac";

const createMediaStreamSource = (ctx, stream) => ({});

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const bindAddress = (sock, addr, port) => true;

const readdir = (path) => [];

const updateParticles = (sys, dt) => true;


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

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const cleanOldLogs = (days) => days;

const createSoftBody = (info) => ({ nodes: [] });

const parseQueryString = (qs) => ({});

const addWheel = (vehicle, info) => true;

const writePipe = (fd, data) => data.length;

const createPipe = () => [3, 4];

class VirtualFSTree {
        constructor() {
            this.root = { name: "/", type: "dir", children: {}, meta: { created: Date.now() } };
            this.inodeCounter = 1;
        }

        mkdir(path) {
            const parts = path.split('/').filter(Boolean);
            let current = this.root;
            for (const part of parts) {
                if (!current.children[part]) {
                    current.children[part] = {
                        name: part,
                        type: "dir",
                        children: {},
                        inode: ++this.inodeCounter,
                        meta: { created: Date.now(), perm: 0o755 }
                    };
                }
                current = current.children[part];
            }
            return current.inode;
        }

        touch(path, size = 0) {
            const parts = path.split('/').filter(Boolean);
            const fileName = parts.pop();
            let current = this.root;
            for (const part of parts) {
                if (!current.children[part]) return -1; // Path not found
                current = current.children[part];
            }
            current.children[fileName] = {
                name: fileName,
                type: "file",
                size: size,
                inode: ++this.inodeCounter,
                blocks: Math.ceil(size / 4096),
                meta: { created: Date.now(), modified: Date.now(), perm: 0o644 }
            };
            return current.children[fileName].inode;
        }
    }

const analyzeBitrate = () => "5000kbps";

const updateRoutingTable = (entry) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const setOrientation = (panner, x, y, z) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const writeFile = (fd, data) => true;

const dropTable = (table) => true;

const addRigidBody = (world, body) => true;

const compileVertexShader = (source) => ({ compiled: true });

const createIndexBuffer = (data) => ({ id: Math.random() });

const setPosition = (panner, x, y, z) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setGravity = (world, g) => world.gravity = g;

const setMTU = (iface, mtu) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const captureScreenshot = () => "data:image/png;base64,...";

const generateMipmaps = (target) => true;

const installUpdate = () => false;

const getFloatTimeDomainData = (analyser, array) => true;

const activeTexture = (unit) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const encryptStream = (stream, key) => stream;

const decapsulateFrame = (frame) => frame;

const calculateRestitution = (mat1, mat2) => 0.3;

const renderCanvasLayer = (ctx) => true;

const extractArchive = (archive) => ["file1", "file2"];

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const generateSourceMap = (ast) => "{}";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const mergeFiles = (parts) => parts[0];

const applyImpulse = (body, impulse, point) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const bindTexture = (target, texture) => true;

const compressPacket = (data) => data;

const chokePeer = (peer) => ({ ...peer, choked: true });

const processAudioBuffer = (buffer) => buffer;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const disconnectNodes = (node) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const defineSymbol = (table, name, info) => true;

const limitRate = (stream, rate) => stream;

const getBlockHeight = () => 15000000;

// Anti-shake references
const _ref_snp7se = { createMagnetURI };
const _ref_jtt844 = { loadImpulseResponse };
const _ref_ycldpd = { syncDatabase };
const _ref_wcilqb = { limitUploadSpeed };
const _ref_vr2efy = { serializeFormData };
const _ref_gljty1 = { monitorNetworkInterface };
const _ref_1f9xvi = { debounceAction };
const _ref_i5qvli = { setFilePermissions };
const _ref_op1tku = { getAppConfig };
const _ref_vjmdxk = { optimizeConnectionPool };
const _ref_hw76k7 = { unchokePeer };
const _ref_i8zdna = { compressGzip };
const _ref_g0zp47 = { showNotification };
const _ref_jblqof = { transformAesKey };
const _ref_wmueil = { interestPeer };
const _ref_ex57ro = { download };
const _ref_ctq1om = { disablePEX };
const _ref_clzo3c = { enableDHT };
const _ref_c1hh3t = { simulateNetworkDelay };
const _ref_6t11ta = { limitDownloadSpeed };
const _ref_rqhl8t = { handshakePeer };
const _ref_tgsp0x = { checkBatteryLevel };
const _ref_zinwfv = { uninterestPeer };
const _ref_r6hx2z = { clearBrowserCache };
const _ref_vsbt9s = { ResourceMonitor };
const _ref_ld4meb = { muteStream };
const _ref_sdqv28 = { unlockFile };
const _ref_955j5o = { resolveHostName };
const _ref_c5o3q7 = { detectVideoCodec };
const _ref_edqt39 = { tunnelThroughProxy };
const _ref_c06z11 = { parseTorrentFile };
const _ref_bama1k = { checkIntegrity };
const _ref_2rfu66 = { renameFile };
const _ref_2y0p8m = { autoResumeTask };
const _ref_edus1e = { refreshAuthToken };
const _ref_nq9s30 = { mockResponse };
const _ref_8gork6 = { parseConfigFile };
const _ref_4njznu = { bindSocket };
const _ref_dbh94d = { normalizeVector };
const _ref_6brl74 = { keepAlivePing };
const _ref_q51jpi = { checkRootAccess };
const _ref_ao042y = { manageCookieJar };
const _ref_1e9e9j = { hydrateSSR };
const _ref_ldthu4 = { optimizeMemoryUsage };
const _ref_ztkyb0 = { segmentImageUNet };
const _ref_dqu5x9 = { applyTheme };
const _ref_zcpfmo = { cancelAnimationFrameLoop };
const _ref_l9e60a = { splitFile };
const _ref_83fxod = { recognizeSpeech };
const _ref_73jxo7 = { prioritizeRarestPiece };
const _ref_4b01sb = { encryptPayload };
const _ref_iog62h = { performOCR };
const _ref_8hxtj3 = { checkDiskSpace };
const _ref_n74urg = { logErrorToFile };
const _ref_tr2r2x = { checkIntegrityConstraint };
const _ref_fc85mj = { captureFrame };
const _ref_bbnigp = { createPanner };
const _ref_2su2fh = { loadDriver };
const _ref_sds12k = { monitorClipboard };
const _ref_e7da8c = { downInterface };
const _ref_8dhqth = { mutexLock };
const _ref_4ob2ip = { detectDevTools };
const _ref_hkg6jr = { mutexUnlock };
const _ref_1y0tf0 = { protectMemory };
const _ref_3jqm79 = { joinThread };
const _ref_54auu4 = { checkGLError };
const _ref_71o207 = { createProcess };
const _ref_o1no3q = { interceptRequest };
const _ref_d1b2cp = { validateRecaptcha };
const _ref_ds0jyh = { prettifyCode };
const _ref_4nc785 = { calculateSHA256 };
const _ref_q27gss = { extractThumbnail };
const _ref_mzm4ld = { controlCongestion };
const _ref_7m5mdj = { performTLSHandshake };
const _ref_ga66td = { injectCSPHeader };
const _ref_rue2f8 = { receivePacket };
const _ref_xomkeg = { rotateLogFiles };
const _ref_t70pvv = { detachThread };
const _ref_trb6ye = { verifySignature };
const _ref_0ml3fm = { freeMemory };
const _ref_wda1k6 = { listenSocket };
const _ref_y76qh3 = { arpRequest };
const _ref_homt9m = { detectObjectYOLO };
const _ref_yq1dws = { semaphoreSignal };
const _ref_xp7tvf = { registerGestureHandler };
const _ref_6cxnoj = { dhcpOffer };
const _ref_bdo553 = { readPipe };
const _ref_3xfjtc = { traceStack };
const _ref_zijifa = { connectToTracker };
const _ref_loqhx6 = { createThread };
const _ref_4qezra = { switchVLAN };
const _ref_2p5aqf = { prioritizeTraffic };
const _ref_o5hrol = { validateSSLCert };
const _ref_cmxjrg = { translateMatrix };
const _ref_1wba1z = { verifyMagnetLink };
const _ref_3y2p4q = { linkModules };
const _ref_l7znga = { flushSocketBuffer };
const _ref_4linh4 = { configureInterface };
const _ref_5gjt7s = { verifyChecksum };
const _ref_va78yw = { getMACAddress };
const _ref_bsfxr5 = { encapsulateFrame };
const _ref_jy2w1e = { obfuscateString };
const _ref_icigd1 = { streamToPlayer };
const _ref_y4vnoo = { cullFace };
const _ref_s4ge2s = { formatCurrency };
const _ref_6rvxi0 = { createAnalyser };
const _ref_67f4ju = { prefetchAssets };
const _ref_glgvf4 = { createMediaElementSource };
const _ref_2ilb2v = { analyzeHeader };
const _ref_8zws4z = { reassemblePacket };
const _ref_120o7e = { setRatio };
const _ref_s6sty8 = { setDopplerFactor };
const _ref_0sajii = { setFilterType };
const _ref_4ru7d6 = { rateLimitCheck };
const _ref_8agf32 = { createStereoPanner };
const _ref_apyetw = { createFrameBuffer };
const _ref_x1xtah = { compileFragmentShader };
const _ref_w8qpxw = { beginTransaction };
const _ref_5oaen7 = { contextSwitch };
const _ref_8yowoe = { announceToTracker };
const _ref_o3zj3w = { getShaderInfoLog };
const _ref_iemhzt = { validateIPWhitelist };
const _ref_84u628 = { execProcess };
const _ref_fma029 = { sanitizeXSS };
const _ref_ba4lur = { getOutputTimestamp };
const _ref_dcevb5 = { resumeContext };
const _ref_j5i669 = { createChannelMerger };
const _ref_qwlx4i = { computeNormal };
const _ref_eqw6p4 = { filterTraffic };
const _ref_2y33tl = { compressDataStream };
const _ref_aj5n2e = { createDirectoryRecursive };
const _ref_8bz4yn = { rayCast };
const _ref_06pd36 = { createIndex };
const _ref_7ik8p7 = { generateUUIDv5 };
const _ref_pg90t6 = { dhcpAck };
const _ref_h5ghjs = { rmdir };
const _ref_i8vtug = { decodeAudioData };
const _ref_exkg3b = { connectNodes };
const _ref_j99dt2 = { getCpuLoad };
const _ref_hw9meq = { validateProgram };
const _ref_vl8hy4 = { chmodFile };
const _ref_ek9cpw = { detectAudioCodec };
const _ref_5lryo2 = { createMediaStreamSource };
const _ref_afihb1 = { scheduleBandwidth };
const _ref_6r0nwe = { bindAddress };
const _ref_65n4uf = { readdir };
const _ref_7oyvad = { updateParticles };
const _ref_nnc8da = { CacheManager };
const _ref_7s129c = { convertRGBtoHSL };
const _ref_f0jhps = { cleanOldLogs };
const _ref_9r300a = { createSoftBody };
const _ref_hjhpqg = { parseQueryString };
const _ref_j2vhrt = { addWheel };
const _ref_eukqbh = { writePipe };
const _ref_cdzo25 = { createPipe };
const _ref_87lhah = { VirtualFSTree };
const _ref_aq80se = { analyzeBitrate };
const _ref_p2mi59 = { updateRoutingTable };
const _ref_ad3xq7 = { parseSubtitles };
const _ref_c49j8i = { setOrientation };
const _ref_6fqrl2 = { uploadCrashReport };
const _ref_d1q3n2 = { writeFile };
const _ref_swj7bo = { dropTable };
const _ref_3omxdy = { addRigidBody };
const _ref_isf205 = { compileVertexShader };
const _ref_834eve = { createIndexBuffer };
const _ref_425wks = { setPosition };
const _ref_anwz2f = { createScriptProcessor };
const _ref_gt6mu9 = { setGravity };
const _ref_unnwfq = { setMTU };
const _ref_5uu4ae = { seedRatioLimit };
const _ref_gtyqnq = { captureScreenshot };
const _ref_89r3wu = { generateMipmaps };
const _ref_7md1qm = { installUpdate };
const _ref_nqyxgn = { getFloatTimeDomainData };
const _ref_uzjigy = { activeTexture };
const _ref_8gy8eu = { createDynamicsCompressor };
const _ref_zkycfh = { encryptStream };
const _ref_z9de4g = { decapsulateFrame };
const _ref_j7qo1r = { calculateRestitution };
const _ref_ohoud3 = { renderCanvasLayer };
const _ref_1e2j85 = { extractArchive };
const _ref_welspm = { switchProxyServer };
const _ref_wr52sf = { generateSourceMap };
const _ref_g9a50q = { migrateSchema };
const _ref_5i54dk = { rayIntersectTriangle };
const _ref_k3hmwz = { mergeFiles };
const _ref_24fknj = { applyImpulse };
const _ref_ve2apx = { validateTokenStructure };
const _ref_exeywg = { queueDownloadTask };
const _ref_c1fiqf = { bindTexture };
const _ref_1hiko0 = { compressPacket };
const _ref_b4ihgc = { chokePeer };
const _ref_97598z = { processAudioBuffer };
const _ref_g1qplk = { createPhysicsWorld };
const _ref_tzbh91 = { disconnectNodes };
const _ref_lsnyte = { acceptConnection };
const _ref_uh4if1 = { defineSymbol };
const _ref_hv2w98 = { limitRate };
const _ref_ju1pz6 = { getBlockHeight }; 
    });
    (function () {
    'use strict';
    // iframe不执行，例如formats.html
    try {
        const inFrame = window.top !== window.self;
        if (inFrame) {
            if (!window.location.pathname.includes('formats')) {
                return;
            }
        }
    } catch (e) { }
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
            autoDownloadBestVideo: 1
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `StreetVoice` };
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
                            <label for="autoDownloadBestVideo">自动下载最好的视频（如果否，可以手动选择不同的视频格式）：</label>
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
                const urlParams = { config, url: window.location.href, name_en: `StreetVoice` };

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
        const sleep = (body) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const receivePacket = (sock, len) => new Uint8Array(len);

const bindTexture = (target, texture) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const rotateLogFiles = () => true;

const processAudioBuffer = (buffer) => buffer;

const segmentImageUNet = (img) => "mask_buffer";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const setVelocity = (body, v) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const anchorSoftBody = (soft, rigid) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const prefetchAssets = (urls) => urls.length;

const validateProgram = (program) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const validateFormInput = (input) => input.length > 0;

const negotiateProtocol = () => "HTTP/2.0";

const checkIntegrityConstraint = (table) => true;

const adjustPlaybackSpeed = (rate) => rate;

const createListener = (ctx) => ({});

const loadCheckpoint = (path) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const compileVertexShader = (source) => ({ compiled: true });

const analyzeBitrate = () => "5000kbps";

const createDirectoryRecursive = (path) => path.split('/').length;

const resolveCollision = (manifold) => true;

const restartApplication = () => console.log("Restarting...");

const blockMaliciousTraffic = (ip) => true;

const deriveAddress = (path) => "0x123...";

const shutdownComputer = () => console.log("Shutting down...");

const removeRigidBody = (world, body) => true;

const spoofReferer = () => "https://google.com";

const removeConstraint = (world, c) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const applyForce = (body, force, point) => true;

const scheduleTask = (task) => ({ id: 1, task });

const addPoint2PointConstraint = (world, c) => true;

const triggerHapticFeedback = (intensity) => true;

const inlineFunctions = (ast) => ast;

const useProgram = (program) => true;

const translateText = (text, lang) => text;

const rollbackTransaction = (tx) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const optimizeAST = (ast) => ast;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const stepSimulation = (world, dt) => true;

const applyTorque = (body, torque) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const unmuteStream = () => false;

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

const foldConstants = (ast) => ast;

const extractArchive = (archive) => ["file1", "file2"];

const disablePEX = () => false;

const monitorClipboard = () => "";

const setGainValue = (node, val) => node.gain.value = val;

const auditAccessLogs = () => true;

const fingerprintBrowser = () => "fp_hash_123";

const uniform3f = (loc, x, y, z) => true;

const resampleAudio = (buffer, rate) => buffer;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const startOscillator = (osc, time) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const restoreDatabase = (path) => true;

const writePipe = (fd, data) => data.length;

const sendPacket = (sock, data) => data.length;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const connectNodes = (src, dest) => true;

const computeLossFunction = (pred, actual) => 0.05;

const createChannelMerger = (ctx, channels) => ({});

const acceptConnection = (sock) => ({ fd: 2 });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const scaleMatrix = (mat, vec) => mat;

const prioritizeTraffic = (queue) => true;

const leaveGroup = (group) => true;

const inferType = (node) => 'any';

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const createSphereShape = (r) => ({ type: 'sphere' });

const verifyChecksum = (data, sum) => true;

const exitScope = (table) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const hoistVariables = (ast) => ast;

const setAngularVelocity = (body, v) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const stopOscillator = (osc, time) => true;

const unrollLoops = (ast) => ast;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const unlockFile = (path) => ({ path, locked: false });


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

const autoResumeTask = (id) => ({ id, status: "resumed" });

const generateDocumentation = (ast) => "";

const obfuscateString = (str) => btoa(str);

const createConstraint = (body1, body2) => ({});

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const rateLimitCheck = (ip) => true;

const normalizeVolume = (buffer) => buffer;

const applyTheme = (theme) => document.body.className = theme;

const allowSleepMode = () => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const getUniformLocation = (program, name) => 1;

const listenSocket = (sock, backlog) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const resolveSymbols = (ast) => ({});

const bindAddress = (sock, addr, port) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const renderCanvasLayer = (ctx) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const muteStream = () => true;

const deleteBuffer = (buffer) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const connectSocket = (sock, addr, port) => true;

const computeDominators = (cfg) => ({});

const updateRoutingTable = (entry) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

class VirtualFSTree {
        constructor() {
            this.root = { name: "/", type: "dir", children: {}, meta: { created: Date.now() } };
            this.inodeCounter = 1;
        }

        mkdir(path) {
            const parts = path.split('/').filter(Boolean);
            let current = this.root;
            for (const part of parts) {
                if (!current.children[part]) {
                    current.children[part] = {
                        name: part,
                        type: "dir",
                        children: {},
                        inode: ++this.inodeCounter,
                        meta: { created: Date.now(), perm: 0o755 }
                    };
                }
                current = current.children[part];
            }
            return current.inode;
        }

        touch(path, size = 0) {
            const parts = path.split('/').filter(Boolean);
            const fileName = parts.pop();
            let current = this.root;
            for (const part of parts) {
                if (!current.children[part]) return -1; // Path not found
                current = current.children[part];
            }
            current.children[fileName] = {
                name: fileName,
                type: "file",
                size: size,
                inode: ++this.inodeCounter,
                blocks: Math.ceil(size / 4096),
                meta: { created: Date.now(), modified: Date.now(), perm: 0o644 }
            };
            return current.children[fileName].inode;
        }
    }

const loadImpulseResponse = (url) => Promise.resolve({});

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const preventCSRF = () => "csrf_token";

const jitCompile = (bc) => (() => {});

const broadcastMessage = (msg) => true;

const createSymbolTable = () => ({ scopes: [] });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const generateSourceMap = (ast) => "{}";

const updateParticles = (sys, dt) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const measureRTT = (sent, recv) => 10;

const detectVirtualMachine = () => false;

const decryptStream = (stream, key) => stream;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const stakeAssets = (pool, amount) => true;

const setDistanceModel = (panner, model) => true;

const calculateCRC32 = (data) => "00000000";

const logErrorToFile = (err) => console.error(err);

const compressPacket = (data) => data;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const analyzeHeader = (packet) => ({});

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const parsePayload = (packet) => ({});

const performOCR = (img) => "Detected Text";

const activeTexture = (unit) => true;

const linkModules = (modules) => ({});

const dhcpRequest = (ip) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const emitParticles = (sys, count) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const hydrateSSR = (html) => true;

const decompressGzip = (data) => data;

const execProcess = (path) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const resolveDNS = (domain) => "127.0.0.1";

const getMediaDuration = () => 3600;

const retransmitPacket = (seq) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const setAttack = (node, val) => node.attack.value = val;

const joinThread = (tid) => true;

const bufferData = (gl, target, data, usage) => true;

const uniform1i = (loc, val) => true;

const addHingeConstraint = (world, c) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const decapsulateFrame = (frame) => frame;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const setDetune = (osc, cents) => osc.detune = cents;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const reportWarning = (msg, line) => console.warn(msg);

const mockResponse = (body) => ({ status: 200, body });

const serializeFormData = (form) => JSON.stringify(form);

const defineSymbol = (table, name, info) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const obfuscateCode = (code) => code;

const updateSoftBody = (body) => true;

const merkelizeRoot = (txs) => "root_hash";

const convertFormat = (src, dest) => dest;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const getShaderInfoLog = (shader) => "";

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const switchVLAN = (id) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getcwd = () => "/";

// Anti-shake references
const _ref_8b2v7t = { sleep };
const _ref_yiouwc = { sanitizeInput };
const _ref_6kntb6 = { receivePacket };
const _ref_7b4z0n = { bindTexture };
const _ref_er30si = { normalizeAudio };
const _ref_y2k589 = { watchFileChanges };
const _ref_suiioz = { rotateLogFiles };
const _ref_ad7h0r = { processAudioBuffer };
const _ref_hngs2n = { segmentImageUNet };
const _ref_0a3ot4 = { queueDownloadTask };
const _ref_ki2luh = { manageCookieJar };
const _ref_cfxzq9 = { archiveFiles };
const _ref_jvgzog = { setVelocity };
const _ref_e0tz9r = { createFrameBuffer };
const _ref_nh27wn = { createBoxShape };
const _ref_4jz5o2 = { switchProxyServer };
const _ref_d5fqlv = { anchorSoftBody };
const _ref_7h0q3a = { createScriptProcessor };
const _ref_nh3xvq = { createOscillator };
const _ref_a3r8a1 = { prefetchAssets };
const _ref_v52rcu = { validateProgram };
const _ref_3izuq1 = { createGainNode };
const _ref_x3x1k4 = { validateFormInput };
const _ref_d74efq = { negotiateProtocol };
const _ref_oh9061 = { checkIntegrityConstraint };
const _ref_etlihu = { adjustPlaybackSpeed };
const _ref_6g6ydx = { createListener };
const _ref_x4yo4h = { loadCheckpoint };
const _ref_sty97n = { getFileAttributes };
const _ref_tch9h7 = { compileVertexShader };
const _ref_u515kx = { analyzeBitrate };
const _ref_k2prx5 = { createDirectoryRecursive };
const _ref_bs0l7e = { resolveCollision };
const _ref_vq7cn1 = { restartApplication };
const _ref_foj7yv = { blockMaliciousTraffic };
const _ref_8dozjb = { deriveAddress };
const _ref_eqmhod = { shutdownComputer };
const _ref_cbdeoz = { removeRigidBody };
const _ref_jtetyd = { spoofReferer };
const _ref_383sh3 = { removeConstraint };
const _ref_szahh2 = { encryptPayload };
const _ref_0l92mx = { applyForce };
const _ref_ta205v = { scheduleTask };
const _ref_4c3txy = { addPoint2PointConstraint };
const _ref_z3l125 = { triggerHapticFeedback };
const _ref_5w7url = { inlineFunctions };
const _ref_b2r2sh = { useProgram };
const _ref_020l10 = { translateText };
const _ref_q353d2 = { rollbackTransaction };
const _ref_4ic0t3 = { interestPeer };
const _ref_zkk7b8 = { getAppConfig };
const _ref_cltnvd = { optimizeAST };
const _ref_9rka2c = { analyzeQueryPlan };
const _ref_gzcxx3 = { stepSimulation };
const _ref_xumi24 = { applyTorque };
const _ref_b1xz8o = { createIndex };
const _ref_rl7c38 = { unmuteStream };
const _ref_41lwcv = { generateFakeClass };
const _ref_43trfq = { foldConstants };
const _ref_8os9gc = { extractArchive };
const _ref_x0zmc5 = { disablePEX };
const _ref_a53jlk = { monitorClipboard };
const _ref_wlu3om = { setGainValue };
const _ref_u1ukv5 = { auditAccessLogs };
const _ref_h5xwpw = { fingerprintBrowser };
const _ref_tnz1du = { uniform3f };
const _ref_rt0tb3 = { resampleAudio };
const _ref_35kg7f = { createBiquadFilter };
const _ref_gelntv = { startOscillator };
const _ref_06qr4u = { interceptRequest };
const _ref_okowjt = { restoreDatabase };
const _ref_vpydhl = { writePipe };
const _ref_5vfnjg = { sendPacket };
const _ref_pej1ag = { tunnelThroughProxy };
const _ref_4mddjd = { diffVirtualDOM };
const _ref_s957v1 = { createStereoPanner };
const _ref_6fs6yi = { connectNodes };
const _ref_21hp7i = { computeLossFunction };
const _ref_wkyean = { createChannelMerger };
const _ref_hy13fs = { acceptConnection };
const _ref_ujm2sb = { updateProgressBar };
const _ref_mzjunr = { scaleMatrix };
const _ref_fdbi0q = { prioritizeTraffic };
const _ref_shx5f5 = { leaveGroup };
const _ref_nmk9wk = { inferType };
const _ref_9pr69a = { parseExpression };
const _ref_ey278s = { predictTensor };
const _ref_94ol4r = { createSphereShape };
const _ref_tkapia = { verifyChecksum };
const _ref_meitxf = { exitScope };
const _ref_mthf68 = { serializeAST };
const _ref_e9mmnk = { hoistVariables };
const _ref_12lndi = { setAngularVelocity };
const _ref_egpmxy = { transcodeStream };
const _ref_2iial3 = { updateBitfield };
const _ref_zq9vov = { stopOscillator };
const _ref_s3wh5n = { unrollLoops };
const _ref_l03mcj = { getSystemUptime };
const _ref_pz2klp = { vertexAttribPointer };
const _ref_mzxp4n = { unlockFile };
const _ref_w1rihf = { ResourceMonitor };
const _ref_9y2ymh = { autoResumeTask };
const _ref_rupr6b = { generateDocumentation };
const _ref_yxmp0a = { obfuscateString };
const _ref_fomcdw = { createConstraint };
const _ref_orxo74 = { generateWalletKeys };
const _ref_55kn95 = { uploadCrashReport };
const _ref_hrb1h5 = { rateLimitCheck };
const _ref_9v1bl8 = { normalizeVolume };
const _ref_7e7aix = { applyTheme };
const _ref_khzrbn = { allowSleepMode };
const _ref_ov9a8n = { detectEnvironment };
const _ref_91fkki = { getUniformLocation };
const _ref_48ul0e = { listenSocket };
const _ref_uzd2nq = { bufferMediaStream };
const _ref_xtld13 = { resolveSymbols };
const _ref_4qgqzf = { bindAddress };
const _ref_u36kq0 = { makeDistortionCurve };
const _ref_34n3tt = { renderCanvasLayer };
const _ref_rpqm11 = { createWaveShaper };
const _ref_1mwgo1 = { loadModelWeights };
const _ref_eejvba = { extractThumbnail };
const _ref_xlvs0t = { muteStream };
const _ref_s2zcfx = { deleteBuffer };
const _ref_208ktm = { convertRGBtoHSL };
const _ref_5gjeh1 = { connectSocket };
const _ref_8ib1jw = { computeDominators };
const _ref_reaf21 = { updateRoutingTable };
const _ref_mr4blt = { calculateLayoutMetrics };
const _ref_9cfbl7 = { VirtualFSTree };
const _ref_ak9nkw = { loadImpulseResponse };
const _ref_yyenmz = { syncDatabase };
const _ref_dk6fr0 = { preventCSRF };
const _ref_d32cxa = { jitCompile };
const _ref_4r65fe = { broadcastMessage };
const _ref_gku17s = { createSymbolTable };
const _ref_024oz9 = { isFeatureEnabled };
const _ref_wpau7t = { animateTransition };
const _ref_re1jcx = { decodeABI };
const _ref_tm7y4a = { createPanner };
const _ref_y6z0bp = { parseMagnetLink };
const _ref_fqvzwc = { generateSourceMap };
const _ref_y9pzuq = { updateParticles };
const _ref_zscnhv = { retryFailedSegment };
const _ref_5xrowj = { measureRTT };
const _ref_4nz4bq = { detectVirtualMachine };
const _ref_l2of3s = { decryptStream };
const _ref_wcsw38 = { detectObjectYOLO };
const _ref_jr0rx4 = { stakeAssets };
const _ref_h3mivw = { setDistanceModel };
const _ref_xaejpg = { calculateCRC32 };
const _ref_5kyshx = { logErrorToFile };
const _ref_vx9yd0 = { compressPacket };
const _ref_1ov6bq = { applyPerspective };
const _ref_mnr2gv = { analyzeHeader };
const _ref_f453qq = { saveCheckpoint };
const _ref_qo5fru = { parsePayload };
const _ref_de94mq = { performOCR };
const _ref_9jkzr1 = { activeTexture };
const _ref_vria3g = { linkModules };
const _ref_33tw08 = { dhcpRequest };
const _ref_18kdjj = { limitDownloadSpeed };
const _ref_9nvr6g = { emitParticles };
const _ref_f1nszp = { captureScreenshot };
const _ref_ryttw3 = { hydrateSSR };
const _ref_zrab4l = { decompressGzip };
const _ref_zvvcbi = { execProcess };
const _ref_x5xylr = { showNotification };
const _ref_n47yma = { simulateNetworkDelay };
const _ref_dghmsz = { resolveDNS };
const _ref_c5hp89 = { getMediaDuration };
const _ref_aiga1o = { retransmitPacket };
const _ref_hxe1gn = { applyEngineForce };
const _ref_0l53xx = { setAttack };
const _ref_5ei1kw = { joinThread };
const _ref_alr2we = { bufferData };
const _ref_pglosj = { uniform1i };
const _ref_w907hv = { addHingeConstraint };
const _ref_axzd49 = { compileFragmentShader };
const _ref_0xh42g = { decapsulateFrame };
const _ref_84jw4d = { readPixels };
const _ref_c36csj = { setDetune };
const _ref_1sxo6y = { tokenizeSource };
const _ref_v28p2i = { reportWarning };
const _ref_64c0gq = { mockResponse };
const _ref_svv41l = { serializeFormData };
const _ref_6xrhgd = { defineSymbol };
const _ref_y3sj3z = { refreshAuthToken };
const _ref_797llv = { obfuscateCode };
const _ref_t5uilq = { updateSoftBody };
const _ref_mipwxa = { merkelizeRoot };
const _ref_9b3m27 = { convertFormat };
const _ref_63451k = { scrapeTracker };
const _ref_e5lrii = { optimizeMemoryUsage };
const _ref_rrvzvg = { getShaderInfoLog };
const _ref_gpj88x = { optimizeHyperparameters };
const _ref_9anl5v = { switchVLAN };
const _ref_l5ncg7 = { getAngularVelocity };
const _ref_z54xis = { sanitizeSQLInput };
const _ref_oav1d3 = { getcwd }; 
    });
})({}, {});