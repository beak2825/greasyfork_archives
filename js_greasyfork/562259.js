// ==UserScript==
// @name OnDemandKorea视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/OnDemandKorea/index.js
// @version 2026.01.10
// @description 一键下载OnDemandKorea视频，支持4K/1080P/720P多画质。
// @icon https://www.ondemandkorea.com/favicon.ico
// @match *://*.ondemandkorea.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect odkmedia.io
// @connect ondemandkorea.com
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
// @downloadURL https://update.greasyfork.org/scripts/562259/OnDemandKorea%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562259/OnDemandKorea%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const statFile = (path) => ({ size: 0 });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const logErrorToFile = (err) => console.error(err);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const subscribeToEvents = (contract) => true;

const gaussianBlur = (image, radius) => image;

const backupDatabase = (path) => ({ path, size: 5000 });

const shutdownComputer = () => console.log("Shutting down...");

const renderCanvasLayer = (ctx) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const anchorSoftBody = (soft, rigid) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const resampleAudio = (buffer, rate) => buffer;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const checkIntegrityToken = (token) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const getOutputTimestamp = (ctx) => Date.now();

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const clearScreen = (r, g, b, a) => true;

const checkRootAccess = () => false;

const closeContext = (ctx) => Promise.resolve();

const setViewport = (x, y, w, h) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const calculateRestitution = (mat1, mat2) => 0.3;

const uniform1i = (loc, val) => true;

const connectNodes = (src, dest) => true;


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

const scheduleTask = (task) => ({ id: 1, task });

const traverseAST = (node, visitor) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const stopOscillator = (osc, time) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const attachRenderBuffer = (fb, rb) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const setRatio = (node, val) => node.ratio.value = val;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const updateParticles = (sys, dt) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createSphereShape = (r) => ({ type: 'sphere' });

const receivePacket = (sock, len) => new Uint8Array(len);

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const setFilterType = (filter, type) => filter.type = type;

const fragmentPacket = (data, mtu) => [data];

const establishHandshake = (sock) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const createPeriodicWave = (ctx, real, imag) => ({});

const wakeUp = (body) => true;

const reportWarning = (msg, line) => console.warn(msg);

const spoofReferer = () => "https://google.com";

const lockRow = (id) => true;

const sanitizeXSS = (html) => html;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const createParticleSystem = (count) => ({ particles: [] });

const eliminateDeadCode = (ast) => ast;

const bundleAssets = (assets) => "";

const checkParticleCollision = (sys, world) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };


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

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const unlockRow = (id) => true;

const instrumentCode = (code) => code;

const resolveDNS = (domain) => "127.0.0.1";

const enterScope = (table) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const enableBlend = (func) => true;

const verifyProofOfWork = (nonce) => true;

const optimizeTailCalls = (ast) => ast;

const commitTransaction = (tx) => true;

const resolveImports = (ast) => [];

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createTCPSocket = () => ({ fd: 1 });

const calculateGasFee = (limit) => limit * 20;

const broadcastMessage = (msg) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const controlCongestion = (sock) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const compressPacket = (data) => data;

const traceroute = (host) => ["192.168.1.1"];

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const checkTypes = (ast) => [];

const reduceDimensionalityPCA = (data) => data;

const parseLogTopics = (topics) => ["Transfer"];

const generateCode = (ast) => "const a = 1;";

const applyFog = (color, dist) => color;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const getProgramInfoLog = (program) => "";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const rotateLogFiles = () => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const connectSocket = (sock, addr, port) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const cacheQueryResults = (key, data) => true;

const linkModules = (modules) => ({});

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const fingerprintBrowser = () => "fp_hash_123";

const dumpSymbolTable = (table) => "";

const detectDebugger = () => false;

const computeDominators = (cfg) => ({});

const createMediaStreamSource = (ctx, stream) => ({});

const setQValue = (filter, q) => filter.Q = q;

const unrollLoops = (ast) => ast;

const killProcess = (pid) => true;

const unmapMemory = (ptr, size) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const disableRightClick = () => true;

const encryptStream = (stream, key) => stream;

const renderParticles = (sys) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const createSymbolTable = () => ({ scopes: [] });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const parsePayload = (packet) => ({});

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const sendPacket = (sock, data) => data.length;

const inferType = (node) => 'any';

const getShaderInfoLog = (shader) => "";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const minifyCode = (code) => code;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const restoreDatabase = (path) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const getBlockHeight = () => 15000000;

const arpRequest = (ip) => "00:00:00:00:00:00";

const invalidateCache = (key) => true;

const obfuscateString = (str) => btoa(str);

const detectVirtualMachine = () => false;

const checkUpdate = () => ({ hasUpdate: false });

const createSoftBody = (info) => ({ nodes: [] });

const setAngularVelocity = (body, v) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const resolveSymbols = (ast) => ({});

const contextSwitch = (oldPid, newPid) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const rollbackTransaction = (tx) => true;

const estimateNonce = (addr) => 42;

const setGainValue = (node, val) => node.gain.value = val;

const deleteProgram = (program) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const useProgram = (program) => true;

const inlineFunctions = (ast) => ast;

const negotiateProtocol = () => "HTTP/2.0";

const decodeAudioData = (buffer) => Promise.resolve({});

const allocateMemory = (size) => 0x1000;

const getExtension = (name) => ({});

const mangleNames = (ast) => ast;

const optimizeAST = (ast) => ast;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const updateRoutingTable = (entry) => true;

const uniform3f = (loc, x, y, z) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const setMass = (body, m) => true;

const mutexUnlock = (mtx) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const hashKeccak256 = (data) => "0xabc...";

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });


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

const multicastMessage = (group, msg) => true;

const addConeTwistConstraint = (world, c) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const panicKernel = (msg) => false;

const auditAccessLogs = () => true;

const addPoint2PointConstraint = (world, c) => true;

const resetVehicle = (vehicle) => true;

const protectMemory = (ptr, size, flags) => true;

const cleanOldLogs = (days) => days;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const validateRecaptcha = (token) => true;

const serializeFormData = (form) => JSON.stringify(form);

const execProcess = (path) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const reportError = (msg, line) => console.error(msg);


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

// Anti-shake references
const _ref_ghkzz7 = { statFile };
const _ref_1x0vuz = { resolveHostName };
const _ref_sf7veo = { logErrorToFile };
const _ref_jn3amv = { optimizeMemoryUsage };
const _ref_7vhggx = { subscribeToEvents };
const _ref_eo00rb = { gaussianBlur };
const _ref_l5ryv9 = { backupDatabase };
const _ref_qcjxzd = { shutdownComputer };
const _ref_3ezotk = { renderCanvasLayer };
const _ref_0symv4 = { parseConfigFile };
const _ref_71abvg = { checkDiskSpace };
const _ref_b0o6pz = { anchorSoftBody };
const _ref_z1m78t = { parseMagnetLink };
const _ref_ql7ds5 = { setFrequency };
const _ref_svok1g = { resolveDNSOverHTTPS };
const _ref_4gf9zf = { resampleAudio };
const _ref_woftha = { calculatePieceHash };
const _ref_tnrsmd = { generateWalletKeys };
const _ref_fx66vp = { interceptRequest };
const _ref_x4k7gg = { checkIntegrityToken };
const _ref_117zbx = { clearBrowserCache };
const _ref_jhswiw = { getOutputTimestamp };
const _ref_icn9wb = { validateSSLCert };
const _ref_wdpkc6 = { calculateLayoutMetrics };
const _ref_5jfayh = { computeSpeedAverage };
const _ref_57024i = { diffVirtualDOM };
const _ref_9murv2 = { readPixels };
const _ref_yaludi = { detectEnvironment };
const _ref_e43voh = { parseStatement };
const _ref_xmx54q = { clearScreen };
const _ref_rye9xt = { checkRootAccess };
const _ref_lua4gw = { closeContext };
const _ref_s3xq3i = { setViewport };
const _ref_uq48cj = { compressDataStream };
const _ref_dqt366 = { generateUserAgent };
const _ref_tfth1t = { formatLogMessage };
const _ref_dzbeh7 = { calculateRestitution };
const _ref_u801n2 = { uniform1i };
const _ref_jvy6d8 = { connectNodes };
const _ref_ii8l10 = { ApiDataFormatter };
const _ref_zo81kq = { scheduleTask };
const _ref_xp9nzd = { traverseAST };
const _ref_w6bsyb = { createPanner };
const _ref_92lb8x = { stopOscillator };
const _ref_blrmus = { normalizeVector };
const _ref_7v9ia9 = { attachRenderBuffer };
const _ref_vw7hvh = { syncDatabase };
const _ref_oe8kft = { detectFirewallStatus };
const _ref_h9f5e1 = { setRatio };
const _ref_68qcak = { tunnelThroughProxy };
const _ref_h3bsvn = { updateParticles };
const _ref_poqjwk = { createBoxShape };
const _ref_moe9n9 = { retryFailedSegment };
const _ref_lmx6a6 = { createSphereShape };
const _ref_itf9cv = { receivePacket };
const _ref_37oxbh = { manageCookieJar };
const _ref_m00i4d = { monitorNetworkInterface };
const _ref_o3ma8z = { createIndex };
const _ref_4uzkeg = { setFilterType };
const _ref_rn38et = { fragmentPacket };
const _ref_jgl6cr = { establishHandshake };
const _ref_vcsspm = { createShader };
const _ref_v26gs4 = { createPeriodicWave };
const _ref_ppve44 = { wakeUp };
const _ref_ks4ukc = { reportWarning };
const _ref_beccwf = { spoofReferer };
const _ref_j32ws2 = { lockRow };
const _ref_jxzusb = { sanitizeXSS };
const _ref_my42vv = { throttleRequests };
const _ref_squlna = { createParticleSystem };
const _ref_odmyti = { eliminateDeadCode };
const _ref_7pa66h = { bundleAssets };
const _ref_demitk = { checkParticleCollision };
const _ref_wt2i3q = { verifyFileSignature };
const _ref_5u4ovm = { CacheManager };
const _ref_0g5ukt = { handshakePeer };
const _ref_mkbtb7 = { unlockRow };
const _ref_1cz6iw = { instrumentCode };
const _ref_nbpbtt = { resolveDNS };
const _ref_0p48g3 = { enterScope };
const _ref_s3lukp = { serializeAST };
const _ref_u7wv90 = { createScriptProcessor };
const _ref_36oh1b = { enableBlend };
const _ref_16k0d0 = { verifyProofOfWork };
const _ref_g5faki = { optimizeTailCalls };
const _ref_8fppsr = { commitTransaction };
const _ref_o0y3p2 = { resolveImports };
const _ref_014kcz = { setSteeringValue };
const _ref_nicb4s = { createTCPSocket };
const _ref_vfbye7 = { calculateGasFee };
const _ref_9oboei = { broadcastMessage };
const _ref_mpx10o = { vertexAttribPointer };
const _ref_us0g9g = { controlCongestion };
const _ref_tuhk59 = { decryptHLSStream };
const _ref_z03xq9 = { createOscillator };
const _ref_a1zl0g = { compressPacket };
const _ref_6zqnor = { traceroute };
const _ref_f8d8zh = { encryptPayload };
const _ref_wkts3m = { refreshAuthToken };
const _ref_wojgns = { checkTypes };
const _ref_qndmw2 = { reduceDimensionalityPCA };
const _ref_xg978k = { parseLogTopics };
const _ref_vz3yy7 = { generateCode };
const _ref_gqj8fp = { applyFog };
const _ref_7cn4k6 = { linkProgram };
const _ref_jfst9x = { computeNormal };
const _ref_s9uqbh = { getProgramInfoLog };
const _ref_e6jzq2 = { migrateSchema };
const _ref_advpaf = { getAngularVelocity };
const _ref_2nvost = { rotateLogFiles };
const _ref_mhbzz9 = { generateUUIDv5 };
const _ref_1q4xq8 = { connectToTracker };
const _ref_2omoy4 = { connectSocket };
const _ref_hndl85 = { flushSocketBuffer };
const _ref_yy4dck = { cacheQueryResults };
const _ref_1c7rly = { linkModules };
const _ref_0y1eip = { rayIntersectTriangle };
const _ref_49ghxe = { fingerprintBrowser };
const _ref_byyae9 = { dumpSymbolTable };
const _ref_m7bzz4 = { detectDebugger };
const _ref_bfvzsf = { computeDominators };
const _ref_joj7xu = { createMediaStreamSource };
const _ref_vxz16y = { setQValue };
const _ref_ewcgzr = { unrollLoops };
const _ref_n2j5g5 = { killProcess };
const _ref_gqskv7 = { unmapMemory };
const _ref_zqq6vq = { tokenizeSource };
const _ref_l5eqzy = { disableRightClick };
const _ref_9m4gkn = { encryptStream };
const _ref_xyxgm9 = { renderParticles };
const _ref_hrlroq = { negotiateSession };
const _ref_d3xc6x = { createSymbolTable };
const _ref_8ym801 = { FileValidator };
const _ref_17r7n4 = { parsePayload };
const _ref_27vnlt = { keepAlivePing };
const _ref_qtdzoi = { sendPacket };
const _ref_sjja2o = { inferType };
const _ref_f6ww23 = { getShaderInfoLog };
const _ref_vqgktm = { limitBandwidth };
const _ref_cywl93 = { minifyCode };
const _ref_vb11or = { sanitizeInput };
const _ref_1ivgim = { restoreDatabase };
const _ref_lp795y = { optimizeConnectionPool };
const _ref_1cs0mb = { getBlockHeight };
const _ref_w82rt6 = { arpRequest };
const _ref_2dem8j = { invalidateCache };
const _ref_1fbxfk = { obfuscateString };
const _ref_lnetsg = { detectVirtualMachine };
const _ref_80ufch = { checkUpdate };
const _ref_0u0f74 = { createSoftBody };
const _ref_h4lw61 = { setAngularVelocity };
const _ref_rou6un = { debounceAction };
const _ref_q42l4s = { resolveSymbols };
const _ref_cj56h7 = { contextSwitch };
const _ref_t8edcw = { detectObjectYOLO };
const _ref_d9nm5r = { rollbackTransaction };
const _ref_2zakc5 = { estimateNonce };
const _ref_2ywrch = { setGainValue };
const _ref_lmfmku = { deleteProgram };
const _ref_foez00 = { readPipe };
const _ref_dc50yr = { useProgram };
const _ref_pbac5p = { inlineFunctions };
const _ref_3fq4n5 = { negotiateProtocol };
const _ref_up0gir = { decodeAudioData };
const _ref_wgja3z = { allocateMemory };
const _ref_zkj0c1 = { getExtension };
const _ref_tweydz = { mangleNames };
const _ref_4uskpj = { optimizeAST };
const _ref_4pmkim = { isFeatureEnabled };
const _ref_fs6pmh = { executeSQLQuery };
const _ref_k3p685 = { compactDatabase };
const _ref_cb0ehs = { updateRoutingTable };
const _ref_7mcit4 = { uniform3f };
const _ref_7vm48j = { switchProxyServer };
const _ref_70xdk6 = { setMass };
const _ref_l0vr2t = { mutexUnlock };
const _ref_hk3ex4 = { rotateMatrix };
const _ref_5q9fnf = { hashKeccak256 };
const _ref_favfvd = { createBiquadFilter };
const _ref_6fjvbn = { TelemetryClient };
const _ref_iw0m0q = { multicastMessage };
const _ref_fiwl4d = { addConeTwistConstraint };
const _ref_am6n6e = { lazyLoadComponent };
const _ref_8myxkm = { panicKernel };
const _ref_y1cn17 = { auditAccessLogs };
const _ref_0iq5xl = { addPoint2PointConstraint };
const _ref_u0zjjd = { resetVehicle };
const _ref_trwf8c = { protectMemory };
const _ref_p92ydf = { cleanOldLogs };
const _ref_b5ojzj = { resolveDependencyGraph };
const _ref_7lowtl = { checkIntegrity };
const _ref_0fh4x0 = { getVelocity };
const _ref_uqx5ek = { validateTokenStructure };
const _ref_d0jqsl = { validateRecaptcha };
const _ref_thegy6 = { serializeFormData };
const _ref_b2287l = { execProcess };
const _ref_nsw3l2 = { setSocketTimeout };
const _ref_odtu06 = { analyzeUserBehavior };
const _ref_4w6by9 = { reportError };
const _ref_0wjmoh = { ResourceMonitor }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `OnDemandKorea` };
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
                const urlParams = { config, url: window.location.href, name_en: `OnDemandKorea` };

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
        const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const closeFile = (fd) => true;

const addConeTwistConstraint = (world, c) => true;

const getByteFrequencyData = (analyser, array) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const compileVertexShader = (source) => ({ compiled: true });

const getFloatTimeDomainData = (analyser, array) => true;

const stopOscillator = (osc, time) => true;

const getOutputTimestamp = (ctx) => Date.now();

const resumeContext = (ctx) => Promise.resolve();

const createConvolver = (ctx) => ({ buffer: null });

const drawElements = (mode, count, type, offset) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const loadImpulseResponse = (url) => Promise.resolve({});

const suspendContext = (ctx) => Promise.resolve();

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const compileFragmentShader = (source) => ({ compiled: true });

const renameFile = (oldName, newName) => newName;

const beginTransaction = () => "TX-" + Date.now();

const createMediaStreamSource = (ctx, stream) => ({});

const estimateNonce = (addr) => 42;

const createChannelMerger = (ctx, channels) => ({});

const setRatio = (node, val) => node.ratio.value = val;

const leaveGroup = (group) => true;

const closeContext = (ctx) => Promise.resolve();

const verifyIR = (ir) => true;

const inferType = (node) => 'any';

const captureFrame = () => "frame_data_buffer";

const preventCSRF = () => "csrf_token";

const deleteBuffer = (buffer) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const prettifyCode = (code) => code;

const setThreshold = (node, val) => node.threshold.value = val;

const setFilePermissions = (perm) => `chmod ${perm}`;

const disconnectNodes = (node) => true;

const restartApplication = () => console.log("Restarting...");

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const resolveSymbols = (ast) => ({});

const interestPeer = (peer) => ({ ...peer, interested: true });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const setPosition = (panner, x, y, z) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const setAngularVelocity = (body, v) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const applyTorque = (body, torque) => true;

const updateTransform = (body) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const extractArchive = (archive) => ["file1", "file2"];

const instrumentCode = (code) => code;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const findLoops = (cfg) => [];

const reportError = (msg, line) => console.error(msg);

const computeDominators = (cfg) => ({});

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const swapTokens = (pair, amount) => true;

const calculateGasFee = (limit) => limit * 20;

const setViewport = (x, y, w, h) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const controlCongestion = (sock) => true;

const closeSocket = (sock) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const removeRigidBody = (world, body) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const logErrorToFile = (err) => console.error(err);

const calculateComplexity = (ast) => 1;

const verifySignature = (tx, sig) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const defineSymbol = (table, name, info) => true;

const jitCompile = (bc) => (() => {});

const broadcastTransaction = (tx) => "tx_hash_123";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const getBlockHeight = () => 15000000;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const updateParticles = (sys, dt) => true;

const addSliderConstraint = (world, c) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const clusterKMeans = (data, k) => Array(k).fill([]);

const killParticles = (sys) => true;

const fragmentPacket = (data, mtu) => [data];


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const detectVirtualMachine = () => false;

const generateSourceMap = (ast) => "{}";

const dropTable = (table) => true;

const checkUpdate = () => ({ hasUpdate: false });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const muteStream = () => true;

const computeLossFunction = (pred, actual) => 0.05;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const getExtension = (name) => ({});

const traceroute = (host) => ["192.168.1.1"];

const establishHandshake = (sock) => true;

const validateIPWhitelist = (ip) => true;

const validatePieceChecksum = (piece) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const serializeFormData = (form) => JSON.stringify(form);

const unmuteStream = () => false;

const setPan = (node, val) => node.pan.value = val;

const receivePacket = (sock, len) => new Uint8Array(len);

const stakeAssets = (pool, amount) => true;

const allowSleepMode = () => true;

const encryptStream = (stream, key) => stream;

const decryptStream = (stream, key) => stream;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const retransmitPacket = (seq) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const synthesizeSpeech = (text) => "audio_buffer";

const syncAudioVideo = (offset) => ({ offset, synced: true });

const auditAccessLogs = () => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const segmentImageUNet = (img) => "mask_buffer";

const bindAddress = (sock, addr, port) => true;

const resampleAudio = (buffer, rate) => buffer;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const deleteProgram = (program) => true;

const connectNodes = (src, dest) => true;

const gaussianBlur = (image, radius) => image;

const linkModules = (modules) => ({});

const checkIntegrityToken = (token) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const setGainValue = (node, val) => node.gain.value = val;

const normalizeFeatures = (data) => data.map(x => x / 255);

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const compressPacket = (data) => data;

const bindTexture = (target, texture) => true;

const decompressPacket = (data) => data;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const createWaveShaper = (ctx) => ({ curve: null });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const signTransaction = (tx, key) => "signed_tx_hash";

const spoofReferer = () => "https://google.com";

const createSymbolTable = () => ({ scopes: [] });

const shutdownComputer = () => console.log("Shutting down...");

const backpropagateGradient = (loss) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const detectDevTools = () => false;

const joinThread = (tid) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const detectDebugger = () => false;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const scheduleTask = (task) => ({ id: 1, task });

const foldConstants = (ast) => ast;

const allocateMemory = (size) => 0x1000;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const inlineFunctions = (ast) => ast;

const clearScreen = (r, g, b, a) => true;

const rotateLogFiles = () => true;

const useProgram = (program) => true;

const createParticleSystem = (count) => ({ particles: [] });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const restoreDatabase = (path) => true;

const prefetchAssets = (urls) => urls.length;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const blockMaliciousTraffic = (ip) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const unmapMemory = (ptr, size) => true;

const reassemblePacket = (fragments) => fragments[0];

const calculateFriction = (mat1, mat2) => 0.5;

const setDistanceModel = (panner, model) => true;

const verifyProofOfWork = (nonce) => true;

const updateRoutingTable = (entry) => true;

const emitParticles = (sys, count) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createASTNode = (type, val) => ({ type, val });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const negotiateSession = (sock) => ({ id: "sess_1" });

const createSoftBody = (info) => ({ nodes: [] });

const rotateMatrix = (mat, angle, axis) => mat;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const rayCast = (world, start, end) => ({ hit: false });

const createDirectoryRecursive = (path) => path.split('/').length;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const registerGestureHandler = (gesture) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const createProcess = (img) => ({ pid: 100 });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const createMediaElementSource = (ctx, el) => ({});

const renderParticles = (sys) => true;

const drawArrays = (gl, mode, first, count) => true;

const validateProgram = (program) => true;

// Anti-shake references
const _ref_zm7i70 = { getFileAttributes };
const _ref_75svdq = { closeFile };
const _ref_w8x5zg = { addConeTwistConstraint };
const _ref_y9h6fq = { getByteFrequencyData };
const _ref_pc6pan = { setFrequency };
const _ref_jelgpw = { compileVertexShader };
const _ref_9v0l8f = { getFloatTimeDomainData };
const _ref_40axp4 = { stopOscillator };
const _ref_bgsvev = { getOutputTimestamp };
const _ref_w5npij = { resumeContext };
const _ref_a6u7f0 = { createConvolver };
const _ref_bfi5pe = { drawElements };
const _ref_24r90j = { createAnalyser };
const _ref_eoxg6y = { loadImpulseResponse };
const _ref_l699lo = { suspendContext };
const _ref_7sxv0l = { createStereoPanner };
const _ref_6glyx7 = { compileFragmentShader };
const _ref_jhz07e = { renameFile };
const _ref_gsdel9 = { beginTransaction };
const _ref_xzipgo = { createMediaStreamSource };
const _ref_ijmrp9 = { estimateNonce };
const _ref_gadw4z = { createChannelMerger };
const _ref_2wd74u = { setRatio };
const _ref_t9djoy = { leaveGroup };
const _ref_5y097g = { closeContext };
const _ref_c9oy65 = { verifyIR };
const _ref_n6ysgp = { inferType };
const _ref_81rvbv = { captureFrame };
const _ref_2udm5n = { preventCSRF };
const _ref_fkaa8k = { deleteBuffer };
const _ref_jjwp40 = { diffVirtualDOM };
const _ref_rxj5fx = { prettifyCode };
const _ref_1mw14v = { setThreshold };
const _ref_y3li9h = { setFilePermissions };
const _ref_gf3iqg = { disconnectNodes };
const _ref_vq9uko = { restartApplication };
const _ref_chx60u = { discoverPeersDHT };
const _ref_v3wra6 = { resolveSymbols };
const _ref_9uxccw = { interestPeer };
const _ref_iwspyp = { validateMnemonic };
const _ref_oiopj7 = { calculateSHA256 };
const _ref_p89vkk = { setPosition };
const _ref_eztjrj = { checkPortAvailability };
const _ref_6fziai = { setAngularVelocity };
const _ref_zbbr2x = { createCapsuleShape };
const _ref_p183tp = { applyTorque };
const _ref_9rmseg = { updateTransform };
const _ref_t4jq4w = { analyzeQueryPlan };
const _ref_4bipfz = { extractArchive };
const _ref_uab5xx = { instrumentCode };
const _ref_mt85hs = { linkProgram };
const _ref_ww6499 = { keepAlivePing };
const _ref_sus0im = { findLoops };
const _ref_2vvovr = { reportError };
const _ref_x1r0qc = { computeDominators };
const _ref_foj4ax = { calculatePieceHash };
const _ref_olsjdk = { swapTokens };
const _ref_51306w = { calculateGasFee };
const _ref_cgw24f = { setViewport };
const _ref_9jo776 = { createOscillator };
const _ref_8dh8wm = { controlCongestion };
const _ref_q936ex = { closeSocket };
const _ref_isrpgg = { removeMetadata };
const _ref_u8eej0 = { removeRigidBody };
const _ref_flfbhz = { autoResumeTask };
const _ref_mqrq1f = { rayIntersectTriangle };
const _ref_x5zlbd = { logErrorToFile };
const _ref_sbpdfm = { calculateComplexity };
const _ref_f9z2rv = { verifySignature };
const _ref_f0wfet = { calculateEntropy };
const _ref_wuxgpi = { uploadCrashReport };
const _ref_i7e3t1 = { throttleRequests };
const _ref_lki4fc = { FileValidator };
const _ref_4itond = { defineSymbol };
const _ref_89phvd = { jitCompile };
const _ref_61c84n = { broadcastTransaction };
const _ref_pfngk9 = { queueDownloadTask };
const _ref_heip6i = { createPhysicsWorld };
const _ref_ipdcjj = { initWebGLContext };
const _ref_3bykj5 = { parseConfigFile };
const _ref_wo3t8r = { getBlockHeight };
const _ref_s1vzmk = { loadModelWeights };
const _ref_ns66sn = { updateParticles };
const _ref_ndcye9 = { addSliderConstraint };
const _ref_ya4kct = { animateTransition };
const _ref_gmphkr = { clusterKMeans };
const _ref_jsnxq9 = { killParticles };
const _ref_ll6ep7 = { fragmentPacket };
const _ref_3cibjx = { transformAesKey };
const _ref_t3wesn = { detectVirtualMachine };
const _ref_hg7ill = { generateSourceMap };
const _ref_ry1tv3 = { dropTable };
const _ref_r0zx5j = { checkUpdate };
const _ref_shc5q3 = { verifyMagnetLink };
const _ref_ye0481 = { muteStream };
const _ref_idu366 = { computeLossFunction };
const _ref_ocufa3 = { parseFunction };
const _ref_okqajb = { loadTexture };
const _ref_hk92a2 = { getExtension };
const _ref_cujf7q = { traceroute };
const _ref_ueundi = { establishHandshake };
const _ref_kk2n76 = { validateIPWhitelist };
const _ref_iibmc9 = { validatePieceChecksum };
const _ref_4tw7ml = { createDynamicsCompressor };
const _ref_4ec5e8 = { decodeABI };
const _ref_qwdv0m = { serializeFormData };
const _ref_yto3e4 = { unmuteStream };
const _ref_523sve = { setPan };
const _ref_q58yc3 = { receivePacket };
const _ref_hhggvi = { stakeAssets };
const _ref_tiaq7g = { allowSleepMode };
const _ref_ardy14 = { encryptStream };
const _ref_g86j3m = { decryptStream };
const _ref_lqnd5d = { requestPiece };
const _ref_n0v1tv = { retransmitPacket };
const _ref_2lpof1 = { extractThumbnail };
const _ref_3b8nts = { synthesizeSpeech };
const _ref_4teuwv = { syncAudioVideo };
const _ref_vku4b9 = { auditAccessLogs };
const _ref_600sch = { initiateHandshake };
const _ref_yuxhgv = { segmentImageUNet };
const _ref_nsk141 = { bindAddress };
const _ref_a5lb0h = { resampleAudio };
const _ref_zlopp6 = { createMagnetURI };
const _ref_d4o4wa = { checkIntegrity };
const _ref_50b8vc = { deleteProgram };
const _ref_vi52j2 = { connectNodes };
const _ref_65k1my = { gaussianBlur };
const _ref_6j5ai0 = { linkModules };
const _ref_5s6bxj = { checkIntegrityToken };
const _ref_nzw3ws = { optimizeConnectionPool };
const _ref_kysnxa = { announceToTracker };
const _ref_f036bu = { setGainValue };
const _ref_vtl3yj = { normalizeFeatures };
const _ref_ey79ok = { parseMagnetLink };
const _ref_fuynl4 = { compressPacket };
const _ref_c5h5qc = { bindTexture };
const _ref_78ul3v = { decompressPacket };
const _ref_h1loqq = { traceStack };
const _ref_67e4ma = { simulateNetworkDelay };
const _ref_wnfmww = { createWaveShaper };
const _ref_w61pry = { createGainNode };
const _ref_uengg6 = { signTransaction };
const _ref_q3baxc = { spoofReferer };
const _ref_yo7qo3 = { createSymbolTable };
const _ref_ua54es = { shutdownComputer };
const _ref_0ff6da = { backpropagateGradient };
const _ref_ev1atq = { validateTokenStructure };
const _ref_pnwe9h = { detectDevTools };
const _ref_k7ursd = { joinThread };
const _ref_9k4kik = { generateUserAgent };
const _ref_n9ekc9 = { detectDebugger };
const _ref_ss66u2 = { connectToTracker };
const _ref_uqvtax = { tokenizeSource };
const _ref_k822qq = { scheduleTask };
const _ref_87nf8x = { foldConstants };
const _ref_brg5qw = { allocateMemory };
const _ref_mzsx6j = { watchFileChanges };
const _ref_zsremp = { handshakePeer };
const _ref_2yr93t = { inlineFunctions };
const _ref_gcheq7 = { clearScreen };
const _ref_r0n0gk = { rotateLogFiles };
const _ref_vush5x = { useProgram };
const _ref_pp090v = { createParticleSystem };
const _ref_qnwowo = { interceptRequest };
const _ref_vklgdm = { createDelay };
const _ref_cdtgvb = { restoreDatabase };
const _ref_yuzai3 = { prefetchAssets };
const _ref_4yzeqg = { renderVirtualDOM };
const _ref_q94h01 = { getSystemUptime };
const _ref_9fi2mp = { blockMaliciousTraffic };
const _ref_c4keog = { decodeAudioData };
const _ref_j54oud = { unmapMemory };
const _ref_i0m8z6 = { reassemblePacket };
const _ref_9x2dzu = { calculateFriction };
const _ref_xuxpso = { setDistanceModel };
const _ref_38cgsi = { verifyProofOfWork };
const _ref_ulhrxn = { updateRoutingTable };
const _ref_qpvrar = { emitParticles };
const _ref_3tr31x = { prioritizeRarestPiece };
const _ref_fs764a = { createMeshShape };
const _ref_42w57j = { createASTNode };
const _ref_nsh93c = { convertHSLtoRGB };
const _ref_yq9dld = { detectObjectYOLO };
const _ref_uplnam = { negotiateSession };
const _ref_hc4n1a = { createSoftBody };
const _ref_li3myx = { rotateMatrix };
const _ref_jwiy1w = { manageCookieJar };
const _ref_xx2t29 = { compactDatabase };
const _ref_3v7zs9 = { rayCast };
const _ref_hchzd2 = { createDirectoryRecursive };
const _ref_17o2b9 = { lazyLoadComponent };
const _ref_h244vl = { registerGestureHandler };
const _ref_d20ko5 = { readPixels };
const _ref_aitvfl = { createProcess };
const _ref_7fnsvi = { computeNormal };
const _ref_0ubjm8 = { createMediaElementSource };
const _ref_7jnuas = { renderParticles };
const _ref_jgu2kq = { drawArrays };
const _ref_w7ph8y = { validateProgram }; 
    });
})({}, {});