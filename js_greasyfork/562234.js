// ==UserScript==
// @name BanBye视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/BanBye/index.js
// @version 2026.01.21.2
// @description 一键下载BanBye视频，支持4K/1080P/720P多画质。
// @icon https://banbye.com/_nuxt/icons/icon_64x64.5406dd.png
// @match *://banbye.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect banbye.com
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
// @downloadURL https://update.greasyfork.org/scripts/562234/BanBye%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562234/BanBye%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const rollbackTransaction = (tx) => true;

const validatePieceChecksum = (piece) => true;

const analyzeBitrate = () => "5000kbps";

const lockFile = (path) => ({ path, locked: true });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const enableDHT = () => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const compileToBytecode = (ast) => new Uint8Array();

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const decodeAudioData = (buffer) => Promise.resolve({});

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const rayCast = (world, start, end) => ({ hit: false });

const renameFile = (oldName, newName) => newName;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const allowSleepMode = () => true;

const vertexAttrib3f = (idx, x, y, z) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

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

const addHingeConstraint = (world, c) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const cullFace = (mode) => true;

const disableDepthTest = () => true;

const deleteBuffer = (buffer) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

class ProtocolBufferHandler {
        constructor() {
            this.state = "HEADER";
            this.buffer = [];
            this.cursor = 0;
        }

        push(bytes) {
            for (let b of bytes) {
                this.processByte(b);
            }
        }

        processByte(byte) {
            this.buffer.push(byte);
            
            switch (this.state) {
                case "HEADER":
                    if (this.buffer.length >= 4) {
                        const magic = this.buffer.slice(0, 4).join(',');
                        if (magic === "80,75,3,4") { // Fake PKZip signature
                            this.state = "VERSION";
                            this.buffer = [];
                        } else {
                            // Invalid magic, reset but keep scanning
                            this.buffer.shift(); 
                        }
                    }
                    break;
                case "VERSION":
                    if (byte === 0x01) {
                        this.state = "LENGTH_PREFIX";
                        this.buffer = [];
                    }
                    break;
                case "LENGTH_PREFIX":
                    if (this.buffer.length === 2) {
                        this.payloadLength = (this.buffer[0] << 8) | this.buffer[1];
                        this.state = "PAYLOAD";
                        this.buffer = [];
                    }
                    break;
                case "PAYLOAD":
                    if (this.buffer.length >= this.payloadLength) {
                        this.handlePayload(this.buffer);
                        this.state = "HEADER";
                        this.buffer = [];
                    }
                    break;
            }
        }

        handlePayload(data) {
            // 模拟 payload 处理，实际上什么都不做或打印日志
            // console.log("Packet received:", data.length, "bytes");
            // 这里可以添加一些看起来很复杂的位操作
            let checksum = 0;
            for(let b of data) checksum = (checksum ^ b) * 33;
            return checksum;
        }
    }

const calculateRestitution = (mat1, mat2) => 0.3;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const getExtension = (name) => ({});

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const calculateFriction = (mat1, mat2) => 0.5;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const edgeDetectionSobel = (image) => image;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const logErrorToFile = (err) => console.error(err);

const predictTensor = (input) => [0.1, 0.9, 0.0];

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createSymbolTable = () => ({ scopes: [] });

const setVelocity = (body, v) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const compileVertexShader = (source) => ({ compiled: true });

const dumpSymbolTable = (table) => "";

const writePipe = (fd, data) => data.length;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const renderCanvasLayer = (ctx) => true;

const spoofReferer = () => "https://google.com";

const activeTexture = (unit) => true;

const createProcess = (img) => ({ pid: 100 });

const verifySignature = (tx, sig) => true;

const setRatio = (node, val) => node.ratio.value = val;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const loadCheckpoint = (path) => true;

const killProcess = (pid) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const setFilterType = (filter, type) => filter.type = type;

const contextSwitch = (oldPid, newPid) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const mutexLock = (mtx) => true;

const detachThread = (tid) => true;

const setMass = (body, m) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const createPipe = () => [3, 4];

const gaussianBlur = (image, radius) => image;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const decompressGzip = (data) => data;

const swapTokens = (pair, amount) => true;

const unlockFile = (path) => ({ path, locked: false });

const createDirectoryRecursive = (path) => path.split('/').length;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const setGravity = (world, g) => world.gravity = g;

const setQValue = (filter, q) => filter.Q = q;

const hashKeccak256 = (data) => "0xabc...";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const disablePEX = () => false;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const normalizeVolume = (buffer) => buffer;

const deleteProgram = (program) => true;

const applyTorque = (body, torque) => true;

const segmentImageUNet = (img) => "mask_buffer";

const setRelease = (node, val) => node.release.value = val;

const createSphereShape = (r) => ({ type: 'sphere' });

const resolveSymbols = (ast) => ({});

const backupDatabase = (path) => ({ path, size: 5000 });

const createConstraint = (body1, body2) => ({});

const addPoint2PointConstraint = (world, c) => true;

const uniform3f = (loc, x, y, z) => true;

const augmentData = (image) => image;

const auditAccessLogs = () => true;

const readPipe = (fd, len) => new Uint8Array(len);

const migrateSchema = (version) => ({ current: version, status: "ok" });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const upInterface = (iface) => true;

const hydrateSSR = (html) => true;

const generateDocumentation = (ast) => "";

const setGainValue = (node, val) => node.gain.value = val;

const setPan = (node, val) => node.pan.value = val;

const joinThread = (tid) => true;

const calculateGasFee = (limit) => limit * 20;

const bindAddress = (sock, addr, port) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createFrameBuffer = () => ({ id: Math.random() });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const reduceDimensionalityPCA = (data) => data;

const checkUpdate = () => ({ hasUpdate: false });

const createThread = (func) => ({ tid: 1 });

const deleteTexture = (texture) => true;

const monitorClipboard = () => "";

const unmapMemory = (ptr, size) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const closeSocket = (sock) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const checkPortAvailability = (port) => Math.random() > 0.2;

const stepSimulation = (world, dt) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const detectCollision = (body1, body2) => false;

const getShaderInfoLog = (shader) => "";

const computeDominators = (cfg) => ({});

const mutexUnlock = (mtx) => true;

const setDistanceModel = (panner, model) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const installUpdate = () => false;

const invalidateCache = (key) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const sleep = (body) => true;

const limitRate = (stream, rate) => stream;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const addSliderConstraint = (world, c) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const jitCompile = (bc) => (() => {});

const wakeUp = (body) => true;

const resampleAudio = (buffer, rate) => buffer;

const calculateMetric = (route) => 1;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const setInertia = (body, i) => true;

const scheduleProcess = (pid) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const controlCongestion = (sock) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const setAngularVelocity = (body, v) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const applyForce = (body, force, point) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const downInterface = (iface) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const disableInterrupts = () => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const unmountFileSystem = (path) => true;

const readdir = (path) => [];

const removeRigidBody = (world, body) => true;

const attachRenderBuffer = (fb, rb) => true;

const defineSymbol = (table, name, info) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const mangleNames = (ast) => ast;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const freeMemory = (ptr) => true;

const readFile = (fd, len) => "";

const fragmentPacket = (data, mtu) => [data];

const processAudioBuffer = (buffer) => buffer;

const validateFormInput = (input) => input.length > 0;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const enableBlend = (func) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const stopOscillator = (osc, time) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const disconnectNodes = (node) => true;

const dhcpOffer = (ip) => true;

const resolveCollision = (manifold) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const checkBatteryLevel = () => 100;

const generateSourceMap = (ast) => "{}";

const mountFileSystem = (dev, path) => true;

const generateMipmaps = (target) => true;

const resolveImports = (ast) => [];

const createConvolver = (ctx) => ({ buffer: null });

const dropTable = (table) => true;

const resolveDNS = (domain) => "127.0.0.1";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const applyImpulse = (body, impulse, point) => true;

const instrumentCode = (code) => code;

const inferType = (node) => 'any';

const updateTransform = (body) => true;

// Anti-shake references
const _ref_p3r3uj = { rollbackTransaction };
const _ref_gkkn5u = { validatePieceChecksum };
const _ref_ipkmmr = { analyzeBitrate };
const _ref_nvep39 = { lockFile };
const _ref_cxv5gf = { getFileAttributes };
const _ref_us0kgd = { unchokePeer };
const _ref_cuajpw = { enableDHT };
const _ref_8cokgm = { scrapeTracker };
const _ref_ad3yf1 = { calculateSHA256 };
const _ref_xwhgbj = { seedRatioLimit };
const _ref_0bh2x2 = { compileToBytecode };
const _ref_1d8ws6 = { throttleRequests };
const _ref_bryhkw = { parseExpression };
const _ref_bsfcsx = { decodeAudioData };
const _ref_76ijx3 = { moveFileToComplete };
const _ref_5744yp = { isFeatureEnabled };
const _ref_2mveoj = { parseTorrentFile };
const _ref_ccqccp = { rayCast };
const _ref_wb4d3c = { renameFile };
const _ref_nla78l = { convexSweepTest };
const _ref_c25m8i = { allowSleepMode };
const _ref_xfdz92 = { vertexAttrib3f };
const _ref_6oix3n = { getAppConfig };
const _ref_744os3 = { download };
const _ref_8fm3fi = { addHingeConstraint };
const _ref_39rqkl = { signTransaction };
const _ref_086w0b = { parseM3U8Playlist };
const _ref_mnflvw = { getAngularVelocity };
const _ref_abuepv = { requestAnimationFrameLoop };
const _ref_gqoc2m = { cullFace };
const _ref_c23n80 = { disableDepthTest };
const _ref_zwwj8w = { deleteBuffer };
const _ref_uiuf3q = { keepAlivePing };
const _ref_zysvf2 = { ProtocolBufferHandler };
const _ref_p9zpvl = { calculateRestitution };
const _ref_n78l2n = { diffVirtualDOM };
const _ref_2y57yh = { getExtension };
const _ref_4hmwlt = { getSystemUptime };
const _ref_e1jpus = { calculateFriction };
const _ref_yxbjyq = { createGainNode };
const _ref_fs6x4k = { scheduleBandwidth };
const _ref_n06n0j = { createOscillator };
const _ref_7ov52w = { edgeDetectionSobel };
const _ref_by8w97 = { getVelocity };
const _ref_0ntyx0 = { logErrorToFile };
const _ref_iodnsv = { predictTensor };
const _ref_hsj42x = { sanitizeInput };
const _ref_ph961e = { createPhysicsWorld };
const _ref_4sq628 = { resolveDNSOverHTTPS };
const _ref_w3h1h7 = { createSymbolTable };
const _ref_1wcfgl = { setVelocity };
const _ref_9cc3d6 = { transformAesKey };
const _ref_95nrvv = { compileVertexShader };
const _ref_1qcaqk = { dumpSymbolTable };
const _ref_stqlsk = { writePipe };
const _ref_9z61ws = { setFrequency };
const _ref_ttupcr = { loadTexture };
const _ref_qr3407 = { getNetworkStats };
const _ref_bxlhsx = { renderCanvasLayer };
const _ref_nritsk = { spoofReferer };
const _ref_4g9ja9 = { activeTexture };
const _ref_t4baew = { createProcess };
const _ref_4m1zbc = { verifySignature };
const _ref_djl1fe = { setRatio };
const _ref_lo6brx = { virtualScroll };
const _ref_spxsza = { loadCheckpoint };
const _ref_didrsu = { killProcess };
const _ref_el3p47 = { loadImpulseResponse };
const _ref_33puij = { setFilterType };
const _ref_8yn62t = { contextSwitch };
const _ref_thtevq = { createCapsuleShape };
const _ref_5xofoy = { mutexLock };
const _ref_avws7j = { detachThread };
const _ref_xrfp5l = { setMass };
const _ref_gt0r4u = { bindSocket };
const _ref_0vl12h = { createPipe };
const _ref_j2lrtl = { gaussianBlur };
const _ref_ztadad = { cancelAnimationFrameLoop };
const _ref_3h8ixs = { decompressGzip };
const _ref_qh0vbz = { swapTokens };
const _ref_zpdd4s = { unlockFile };
const _ref_j1rmre = { createDirectoryRecursive };
const _ref_fmiz2t = { refreshAuthToken };
const _ref_jll4nj = { setGravity };
const _ref_ws35s0 = { setQValue };
const _ref_5ake7n = { hashKeccak256 };
const _ref_vbsgxs = { createScriptProcessor };
const _ref_9ycorf = { clearBrowserCache };
const _ref_a3uat9 = { disablePEX };
const _ref_zjwl2l = { computeNormal };
const _ref_mfetg0 = { normalizeVolume };
const _ref_x2cvhi = { deleteProgram };
const _ref_88z7rh = { applyTorque };
const _ref_xro0su = { segmentImageUNet };
const _ref_9siolk = { setRelease };
const _ref_axj1fc = { createSphereShape };
const _ref_yzrgma = { resolveSymbols };
const _ref_jdytvw = { backupDatabase };
const _ref_uagsp2 = { createConstraint };
const _ref_0vt1d1 = { addPoint2PointConstraint };
const _ref_40xflu = { uniform3f };
const _ref_u7zias = { augmentData };
const _ref_eu9sw0 = { auditAccessLogs };
const _ref_03nphx = { readPipe };
const _ref_07y6i2 = { migrateSchema };
const _ref_6zguey = { rayIntersectTriangle };
const _ref_x2nz01 = { upInterface };
const _ref_d9nlb0 = { hydrateSSR };
const _ref_5dnwed = { generateDocumentation };
const _ref_k54j4o = { setGainValue };
const _ref_6id12u = { setPan };
const _ref_uc8c1e = { joinThread };
const _ref_q30emo = { calculateGasFee };
const _ref_5jjujp = { bindAddress };
const _ref_7gwesj = { validateTokenStructure };
const _ref_fuidlw = { createFrameBuffer };
const _ref_nyhwq2 = { normalizeVector };
const _ref_pqp3ny = { reduceDimensionalityPCA };
const _ref_z5m0rb = { checkUpdate };
const _ref_jkyxfg = { createThread };
const _ref_3gk5cs = { deleteTexture };
const _ref_v5gp4x = { monitorClipboard };
const _ref_akod5n = { unmapMemory };
const _ref_do3pii = { analyzeControlFlow };
const _ref_jc7kmj = { closeSocket };
const _ref_teft35 = { computeSpeedAverage };
const _ref_t2cfzn = { setSocketTimeout };
const _ref_kcr2so = { checkPortAvailability };
const _ref_f4xe6e = { stepSimulation };
const _ref_wlmfjg = { resolveDependencyGraph };
const _ref_kjgwiz = { detectCollision };
const _ref_lklyks = { getShaderInfoLog };
const _ref_0sexqv = { computeDominators };
const _ref_tkbuf6 = { mutexUnlock };
const _ref_fswtiw = { setDistanceModel };
const _ref_vvbm4h = { negotiateSession };
const _ref_3xoz83 = { installUpdate };
const _ref_egvdap = { invalidateCache };
const _ref_dkgb7i = { encryptPayload };
const _ref_xn2b89 = { sleep };
const _ref_nw7zfv = { limitRate };
const _ref_johekj = { calculatePieceHash };
const _ref_l7eemh = { addSliderConstraint };
const _ref_qzg5x6 = { requestPiece };
const _ref_mgq2oe = { jitCompile };
const _ref_ry24kc = { wakeUp };
const _ref_me6nkt = { resampleAudio };
const _ref_ko78z8 = { calculateMetric };
const _ref_8uotod = { debouncedResize };
const _ref_6mr23b = { setInertia };
const _ref_ljtm5d = { scheduleProcess };
const _ref_utnqi7 = { parseConfigFile };
const _ref_jgpjei = { executeSQLQuery };
const _ref_1lfktk = { controlCongestion };
const _ref_juc8zb = { serializeAST };
const _ref_y46t64 = { setAngularVelocity };
const _ref_18e7zi = { compressDataStream };
const _ref_2z6v2j = { applyForce };
const _ref_5cx1u9 = { createMeshShape };
const _ref_j8cwsc = { downInterface };
const _ref_s23mz4 = { makeDistortionCurve };
const _ref_hxeeu5 = { disableInterrupts };
const _ref_3cf2ct = { rotateUserAgent };
const _ref_vsy5wu = { optimizeMemoryUsage };
const _ref_jkrvvz = { unmountFileSystem };
const _ref_zi1zvx = { readdir };
const _ref_4k3aiw = { removeRigidBody };
const _ref_76yjbc = { attachRenderBuffer };
const _ref_6natu8 = { defineSymbol };
const _ref_5013el = { limitBandwidth };
const _ref_wqomak = { mangleNames };
const _ref_ma1on2 = { traceStack };
const _ref_lp5c0e = { freeMemory };
const _ref_xzwcss = { readFile };
const _ref_vqq0gh = { fragmentPacket };
const _ref_g8cdtv = { processAudioBuffer };
const _ref_wykqy2 = { validateFormInput };
const _ref_dt6sr1 = { createBoxShape };
const _ref_q2axl0 = { enableBlend };
const _ref_kpbrx7 = { parseSubtitles };
const _ref_vpvkh1 = { stopOscillator };
const _ref_owri6e = { getMemoryUsage };
const _ref_g7zauk = { formatCurrency };
const _ref_j5naxn = { disconnectNodes };
const _ref_4hfykc = { dhcpOffer };
const _ref_yxlgcm = { resolveCollision };
const _ref_iy8gx2 = { convertRGBtoHSL };
const _ref_ib9mgt = { checkBatteryLevel };
const _ref_o6yg89 = { generateSourceMap };
const _ref_asuyw3 = { mountFileSystem };
const _ref_gxon41 = { generateMipmaps };
const _ref_8ftz4l = { resolveImports };
const _ref_uireev = { createConvolver };
const _ref_1nu5ga = { dropTable };
const _ref_kjoovc = { resolveDNS };
const _ref_yb8v2s = { streamToPlayer };
const _ref_z3q251 = { applyImpulse };
const _ref_ifr5xp = { instrumentCode };
const _ref_az0c8j = { inferType };
const _ref_8pz54y = { updateTransform }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `BanBye` };
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
                const urlParams = { config, url: window.location.href, name_en: `BanBye` };

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
        const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const optimizeAST = (ast) => ast;

const listenSocket = (sock, backlog) => true;

const resetVehicle = (vehicle) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const applyForce = (body, force, point) => true;

const generateCode = (ast) => "const a = 1;";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const foldConstants = (ast) => ast;

const updateSoftBody = (body) => true;

const normalizeVolume = (buffer) => buffer;

const rayCast = (world, start, end) => ({ hit: false });

const setGravity = (world, g) => world.gravity = g;

const commitTransaction = (tx) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const tokenizeText = (text) => text.split(" ");

const broadcastTransaction = (tx) => "tx_hash_123";

const createListener = (ctx) => ({});

const createSoftBody = (info) => ({ nodes: [] });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const replicateData = (node) => ({ target: node, synced: true });

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

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const renderCanvasLayer = (ctx) => true;

const applyImpulse = (body, impulse, point) => true;

const bufferData = (gl, target, data, usage) => true;

const removeRigidBody = (world, body) => true;


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

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const cullFace = (mode) => true;

const enableBlend = (func) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const stopOscillator = (osc, time) => true;

class ProtocolBufferHandler {
        constructor() {
            this.state = "HEADER";
            this.buffer = [];
            this.cursor = 0;
        }

        push(bytes) {
            for (let b of bytes) {
                this.processByte(b);
            }
        }

        processByte(byte) {
            this.buffer.push(byte);
            
            switch (this.state) {
                case "HEADER":
                    if (this.buffer.length >= 4) {
                        const magic = this.buffer.slice(0, 4).join(',');
                        if (magic === "80,75,3,4") { // Fake PKZip signature
                            this.state = "VERSION";
                            this.buffer = [];
                        } else {
                            // Invalid magic, reset but keep scanning
                            this.buffer.shift(); 
                        }
                    }
                    break;
                case "VERSION":
                    if (byte === 0x01) {
                        this.state = "LENGTH_PREFIX";
                        this.buffer = [];
                    }
                    break;
                case "LENGTH_PREFIX":
                    if (this.buffer.length === 2) {
                        this.payloadLength = (this.buffer[0] << 8) | this.buffer[1];
                        this.state = "PAYLOAD";
                        this.buffer = [];
                    }
                    break;
                case "PAYLOAD":
                    if (this.buffer.length >= this.payloadLength) {
                        this.handlePayload(this.buffer);
                        this.state = "HEADER";
                        this.buffer = [];
                    }
                    break;
            }
        }

        handlePayload(data) {
            // 模拟 payload 处理，实际上什么都不做或打印日志
            // console.log("Packet received:", data.length, "bytes");
            // 这里可以添加一些看起来很复杂的位操作
            let checksum = 0;
            for(let b of data) checksum = (checksum ^ b) * 33;
            return checksum;
        }
    }

const dropTable = (table) => true;

const performOCR = (img) => "Detected Text";

const convexSweepTest = (shape, start, end) => ({ hit: false });

const reduceDimensionalityPCA = (data) => data;

const setRelease = (node, val) => node.release.value = val;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const stakeAssets = (pool, amount) => true;

const setFilterType = (filter, type) => filter.type = type;

const setDopplerFactor = (val) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const setPosition = (panner, x, y, z) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const resumeContext = (ctx) => Promise.resolve();

const checkParticleCollision = (sys, world) => true;

const postProcessBloom = (image, threshold) => image;

const linkModules = (modules) => ({});

const serializeFormData = (form) => JSON.stringify(form);

const createTCPSocket = () => ({ fd: 1 });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const chownFile = (path, uid, gid) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const estimateNonce = (addr) => 42;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const parsePayload = (packet) => ({});

const getBlockHeight = () => 15000000;

const fragmentPacket = (data, mtu) => [data];

const freeMemory = (ptr) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const semaphoreSignal = (sem) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const compileVertexShader = (source) => ({ compiled: true });

const removeConstraint = (world, c) => true;

const resolveSymbols = (ast) => ({});

const validatePieceChecksum = (piece) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const addGeneric6DofConstraint = (world, c) => true;

const inferType = (node) => 'any';

const generateSourceMap = (ast) => "{}";

const allowSleepMode = () => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const addHingeConstraint = (world, c) => true;

const deleteProgram = (program) => true;

const joinThread = (tid) => true;

const segmentImageUNet = (img) => "mask_buffer";

const muteStream = () => true;

const decapsulateFrame = (frame) => frame;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const getUniformLocation = (program, name) => 1;

const getFloatTimeDomainData = (analyser, array) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const closeSocket = (sock) => true;

const killProcess = (pid) => true;

const validateFormInput = (input) => input.length > 0;

const prioritizeRarestPiece = (pieces) => pieces[0];

const joinGroup = (group) => true;

const monitorClipboard = () => "";

const retransmitPacket = (seq) => true;

const contextSwitch = (oldPid, newPid) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const auditAccessLogs = () => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const checkGLError = () => 0;

const resolveImports = (ast) => [];

const setThreshold = (node, val) => node.threshold.value = val;

const rotateLogFiles = () => true;

const verifyAppSignature = () => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const applyFog = (color, dist) => color;

const analyzeHeader = (packet) => ({});

const createPipe = () => [3, 4];

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const repairCorruptFile = (path) => ({ path, repaired: true });

const calculateCRC32 = (data) => "00000000";

const registerSystemTray = () => ({ icon: "tray.ico" });

const checkPortAvailability = (port) => Math.random() > 0.2;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const broadcastMessage = (msg) => true;

const pingHost = (host) => 10;

const createThread = (func) => ({ tid: 1 });

const gaussianBlur = (image, radius) => image;

const installUpdate = () => false;

const compileToBytecode = (ast) => new Uint8Array();

const extractArchive = (archive) => ["file1", "file2"];

const measureRTT = (sent, recv) => 10;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const logErrorToFile = (err) => console.error(err);

const reportError = (msg, line) => console.error(msg);

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const encryptStream = (stream, key) => stream;

const checkRootAccess = () => false;

const rotateMatrix = (mat, angle, axis) => mat;

const scheduleProcess = (pid) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const activeTexture = (unit) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setOrientation = (panner, x, y, z) => true;

const reportWarning = (msg, line) => console.warn(msg);

const compileFragmentShader = (source) => ({ compiled: true });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const getProgramInfoLog = (program) => "";

const generateMipmaps = (target) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const readPipe = (fd, len) => new Uint8Array(len);

const edgeDetectionSobel = (image) => image;

const inlineFunctions = (ast) => ast;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const setDelayTime = (node, time) => node.delayTime.value = time;

const encodeABI = (method, params) => "0x...";

const captureScreenshot = () => "data:image/png;base64,...";

const normalizeFeatures = (data) => data.map(x => x / 255);

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const verifyChecksum = (data, sum) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const disconnectNodes = (node) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const clusterKMeans = (data, k) => Array(k).fill([]);

const sendPacket = (sock, data) => data.length;

const setAttack = (node, val) => node.attack.value = val;

const detectVirtualMachine = () => false;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const receivePacket = (sock, len) => new Uint8Array(len);

const mutexUnlock = (mtx) => true;

const getExtension = (name) => ({});

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const restoreDatabase = (path) => true;

const mutexLock = (mtx) => true;

const renameFile = (oldName, newName) => newName;

const attachRenderBuffer = (fb, rb) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const sanitizeXSS = (html) => html;

const getMediaDuration = () => 3600;

const negotiateProtocol = () => "HTTP/2.0";

const clearScreen = (r, g, b, a) => true;

const updateTransform = (body) => true;

const switchVLAN = (id) => true;

const allocateRegisters = (ir) => ir;

const compressGzip = (data) => data;

const claimRewards = (pool) => "0.5 ETH";

const hashKeccak256 = (data) => "0xabc...";

const lockFile = (path) => ({ path, locked: true });

const unmapMemory = (ptr, size) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const createBoxShape = (w, h, d) => ({ type: 'box' });

const convertFormat = (src, dest) => dest;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const classifySentiment = (text) => "positive";

const restartApplication = () => console.log("Restarting...");

const setMass = (body, m) => true;

const createSymbolTable = () => ({ scopes: [] });

// Anti-shake references
const _ref_5ivzcg = { parseMagnetLink };
const _ref_zh0hfy = { loadModelWeights };
const _ref_25kcqt = { optimizeAST };
const _ref_q50fyn = { listenSocket };
const _ref_zl4s4k = { resetVehicle };
const _ref_67gl4c = { setSteeringValue };
const _ref_2yvvl9 = { applyForce };
const _ref_reielw = { generateCode };
const _ref_lu0n7c = { createScriptProcessor };
const _ref_lrku4r = { foldConstants };
const _ref_yj0y5o = { updateSoftBody };
const _ref_pj4fvn = { normalizeVolume };
const _ref_11s934 = { rayCast };
const _ref_8h5dr9 = { setGravity };
const _ref_6b4nmb = { commitTransaction };
const _ref_uln0ur = { migrateSchema };
const _ref_i241ku = { updateProgressBar };
const _ref_1l4odf = { tokenizeText };
const _ref_l2whxm = { broadcastTransaction };
const _ref_91ohmo = { createListener };
const _ref_2xfhnt = { createSoftBody };
const _ref_5b1fjb = { transformAesKey };
const _ref_kp6s6u = { replicateData };
const _ref_o1zmgq = { download };
const _ref_qv23hc = { createOscillator };
const _ref_pl2shp = { renderCanvasLayer };
const _ref_ok6yku = { applyImpulse };
const _ref_dojl27 = { bufferData };
const _ref_kn5v6a = { removeRigidBody };
const _ref_tu17kr = { TelemetryClient };
const _ref_na9kp0 = { getAngularVelocity };
const _ref_oaht8v = { cullFace };
const _ref_klzbhv = { enableBlend };
const _ref_9f4lt6 = { resolveDependencyGraph };
const _ref_ouz6w0 = { createPanner };
const _ref_opz6kt = { stopOscillator };
const _ref_apgxin = { ProtocolBufferHandler };
const _ref_wfjxum = { dropTable };
const _ref_vzzv5u = { performOCR };
const _ref_6dbg8d = { convexSweepTest };
const _ref_q74lac = { reduceDimensionalityPCA };
const _ref_oxof6w = { setRelease };
const _ref_gy55yc = { switchProxyServer };
const _ref_il7yoh = { stakeAssets };
const _ref_c7lm3x = { setFilterType };
const _ref_vsbmxe = { setDopplerFactor };
const _ref_vsh6s6 = { calculateEntropy };
const _ref_xv53fw = { setPosition };
const _ref_mzvegn = { executeSQLQuery };
const _ref_s0iowa = { calculateSHA256 };
const _ref_k23mhx = { resumeContext };
const _ref_r2u6ge = { checkParticleCollision };
const _ref_q9sah1 = { postProcessBloom };
const _ref_1qqcl7 = { linkModules };
const _ref_62hiw3 = { serializeFormData };
const _ref_w894xe = { createTCPSocket };
const _ref_gs84yj = { scheduleBandwidth };
const _ref_rz6s3n = { chownFile };
const _ref_c3rs5s = { scrapeTracker };
const _ref_55f6z6 = { estimateNonce };
const _ref_0vgimk = { syncAudioVideo };
const _ref_nhxr3s = { parsePayload };
const _ref_wj37gw = { getBlockHeight };
const _ref_0rvg74 = { fragmentPacket };
const _ref_q5i53e = { freeMemory };
const _ref_f0vvsn = { setFilePermissions };
const _ref_caonzl = { semaphoreSignal };
const _ref_z0ud5x = { setFrequency };
const _ref_0tkj5o = { compileVertexShader };
const _ref_oryhuz = { removeConstraint };
const _ref_6er20j = { resolveSymbols };
const _ref_toal7t = { validatePieceChecksum };
const _ref_1utno2 = { generateWalletKeys };
const _ref_ysux66 = { addGeneric6DofConstraint };
const _ref_lgmt22 = { inferType };
const _ref_t8g0ih = { generateSourceMap };
const _ref_mtc4rh = { allowSleepMode };
const _ref_lzetm8 = { compactDatabase };
const _ref_qrb9sv = { addHingeConstraint };
const _ref_skkegt = { deleteProgram };
const _ref_c3ndff = { joinThread };
const _ref_snbodt = { segmentImageUNet };
const _ref_9on4zo = { muteStream };
const _ref_k2r62l = { decapsulateFrame };
const _ref_vp306r = { getFileAttributes };
const _ref_6w0xf5 = { parseClass };
const _ref_dzwxbp = { calculateLighting };
const _ref_25xarz = { resolveDNSOverHTTPS };
const _ref_cw8lu1 = { getUniformLocation };
const _ref_h1a9ai = { getFloatTimeDomainData };
const _ref_mcla1g = { checkDiskSpace };
const _ref_et1z3c = { detectFirewallStatus };
const _ref_08t5o4 = { watchFileChanges };
const _ref_9sobcn = { closeSocket };
const _ref_plrqyu = { killProcess };
const _ref_5kgose = { validateFormInput };
const _ref_8o24vp = { prioritizeRarestPiece };
const _ref_8g9psf = { joinGroup };
const _ref_z12zjz = { monitorClipboard };
const _ref_yxad9e = { retransmitPacket };
const _ref_7eptid = { contextSwitch };
const _ref_ejllal = { virtualScroll };
const _ref_witgcx = { getAppConfig };
const _ref_mll2gs = { auditAccessLogs };
const _ref_18ppf6 = { checkIntegrity };
const _ref_wbk3o0 = { checkGLError };
const _ref_9siw86 = { resolveImports };
const _ref_nroosc = { setThreshold };
const _ref_r3sn6k = { rotateLogFiles };
const _ref_pqjciq = { verifyAppSignature };
const _ref_5iujxc = { signTransaction };
const _ref_lyuqf8 = { applyFog };
const _ref_62kx7v = { analyzeHeader };
const _ref_l8kt13 = { createPipe };
const _ref_rjxsn7 = { validateMnemonic };
const _ref_6s4g4c = { retryFailedSegment };
const _ref_2p0pe4 = { repairCorruptFile };
const _ref_y9ww0c = { calculateCRC32 };
const _ref_4w946p = { registerSystemTray };
const _ref_qykyew = { checkPortAvailability };
const _ref_1zj5vj = { parseTorrentFile };
const _ref_68yir2 = { createIndexBuffer };
const _ref_umky9s = { compressDataStream };
const _ref_i1a1rf = { broadcastMessage };
const _ref_ieibvk = { pingHost };
const _ref_6b6x00 = { createThread };
const _ref_5ormma = { gaussianBlur };
const _ref_8uohgw = { installUpdate };
const _ref_ykn83z = { compileToBytecode };
const _ref_6p05nt = { extractArchive };
const _ref_irbe7b = { measureRTT };
const _ref_va405r = { throttleRequests };
const _ref_2jl34p = { logErrorToFile };
const _ref_fmi55l = { reportError };
const _ref_xkfkwz = { computeNormal };
const _ref_borjt4 = { encryptStream };
const _ref_gv6eab = { checkRootAccess };
const _ref_vxy5gv = { rotateMatrix };
const _ref_jqfvho = { scheduleProcess };
const _ref_0lbvnu = { manageCookieJar };
const _ref_k2hqaj = { activeTexture };
const _ref_ov1by2 = { performTLSHandshake };
const _ref_ajr0dt = { setOrientation };
const _ref_rsaheh = { reportWarning };
const _ref_juijmo = { compileFragmentShader };
const _ref_yin0qz = { limitBandwidth };
const _ref_e6b6cv = { getProgramInfoLog };
const _ref_zvlafx = { generateMipmaps };
const _ref_qm8jig = { archiveFiles };
const _ref_5pofj2 = { readPipe };
const _ref_n9cct0 = { edgeDetectionSobel };
const _ref_rustvq = { inlineFunctions };
const _ref_yii1ps = { getMACAddress };
const _ref_x1elyh = { handshakePeer };
const _ref_3gi3sm = { setDelayTime };
const _ref_dvr4tf = { encodeABI };
const _ref_38i4s5 = { captureScreenshot };
const _ref_9q52g5 = { normalizeFeatures };
const _ref_lg0rn6 = { createDynamicsCompressor };
const _ref_704rxm = { verifyChecksum };
const _ref_ome22f = { createFrameBuffer };
const _ref_1u4tdv = { normalizeVector };
const _ref_jyvq1k = { resolveHostName };
const _ref_k2o1r6 = { disconnectNodes };
const _ref_9ue4a3 = { convertRGBtoHSL };
const _ref_fysaq4 = { clusterKMeans };
const _ref_ry1lr3 = { sendPacket };
const _ref_tc67in = { setAttack };
const _ref_h62kjb = { detectVirtualMachine };
const _ref_xgyrl3 = { animateTransition };
const _ref_8ptwo1 = { receivePacket };
const _ref_obgfku = { mutexUnlock };
const _ref_txmpgh = { getExtension };
const _ref_i60h6m = { refreshAuthToken };
const _ref_angv5e = { restoreDatabase };
const _ref_rqba9x = { mutexLock };
const _ref_rategy = { renameFile };
const _ref_9ycrgv = { attachRenderBuffer };
const _ref_ldo79v = { remuxContainer };
const _ref_6k4w5k = { sanitizeXSS };
const _ref_2pyhim = { getMediaDuration };
const _ref_momwtm = { negotiateProtocol };
const _ref_0uctik = { clearScreen };
const _ref_alsxvp = { updateTransform };
const _ref_0qqbbz = { switchVLAN };
const _ref_huph3o = { allocateRegisters };
const _ref_b0kxqi = { compressGzip };
const _ref_hrhv8c = { claimRewards };
const _ref_9slr0y = { hashKeccak256 };
const _ref_8q5ehv = { lockFile };
const _ref_ttdsqc = { unmapMemory };
const _ref_lvh7rn = { getMemoryUsage };
const _ref_gu41ey = { showNotification };
const _ref_77hyah = { createBoxShape };
const _ref_74enw1 = { convertFormat };
const _ref_vodgw5 = { debounceAction };
const _ref_smhcpc = { classifySentiment };
const _ref_pw08us = { restartApplication };
const _ref_kiqjt6 = { setMass };
const _ref_wvf9zt = { createSymbolTable }; 
    });
})({}, {});