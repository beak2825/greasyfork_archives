// ==UserScript==
// @name mixch视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/mixch/index.js
// @version 2026.01.10
// @description 一键下载mixch视频，支持4K/1080P/720P多画质。
// @icon https://d2uqarpmf42qy0.cloudfront.net/torte_web/_next/static/img/icon/apple-icon.png
// @match *://mixch.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect mixch.tv
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
// @downloadURL https://update.greasyfork.org/scripts/562254/mixch%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562254/mixch%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const emitParticles = (sys, count) => true;

const detectPacketLoss = (acks) => false;

const setViewport = (x, y, w, h) => true;

const createMediaElementSource = (ctx, el) => ({});

const createSoftBody = (info) => ({ nodes: [] });

const setDelayTime = (node, time) => node.delayTime.value = time;

const activeTexture = (unit) => true;

const getByteFrequencyData = (analyser, array) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const suspendContext = (ctx) => Promise.resolve();

const allocateRegisters = (ir) => ir;

const addConeTwistConstraint = (world, c) => true;

const setAttack = (node, val) => node.attack.value = val;

const chmodFile = (path, mode) => true;

const openFile = (path, flags) => 5;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const uniform3f = (loc, x, y, z) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const resetVehicle = (vehicle) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const analyzeHeader = (packet) => ({});

const dhcpAck = () => true;

const parsePayload = (packet) => ({});

const setDetune = (osc, cents) => osc.detune = cents;

const protectMemory = (ptr, size, flags) => true;

const unmountFileSystem = (path) => true;

const killProcess = (pid) => true;

const setOrientation = (panner, x, y, z) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const addSliderConstraint = (world, c) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const addHingeConstraint = (world, c) => true;

const chdir = (path) => true;

const processAudioBuffer = (buffer) => buffer;

const addGeneric6DofConstraint = (world, c) => true;

const setAngularVelocity = (body, v) => true;

const traverseAST = (node, visitor) => true;

const unmuteStream = () => false;

const splitFile = (path, parts) => Array(parts).fill(path);

const repairCorruptFile = (path) => ({ path, repaired: true });

const injectMetadata = (file, meta) => ({ file, meta });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const contextSwitch = (oldPid, newPid) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const adjustWindowSize = (sock, size) => true;

const getFloatTimeDomainData = (analyser, array) => true;


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

const unchokePeer = (peer) => ({ ...peer, choked: false });

const enableDHT = () => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const syncAudioVideo = (offset) => ({ offset, synced: true });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const extractArchive = (archive) => ["file1", "file2"];

const createConvolver = (ctx) => ({ buffer: null });

const dhcpOffer = (ip) => true;

const muteStream = () => true;

const panicKernel = (msg) => false;

const encapsulateFrame = (packet) => packet;

const prioritizeRarestPiece = (pieces) => pieces[0];

const unlockFile = (path) => ({ path, locked: false });

const setPan = (node, val) => node.pan.value = val;

const negotiateProtocol = () => "HTTP/2.0";

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const unlinkFile = (path) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const killParticles = (sys) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const interestPeer = (peer) => ({ ...peer, interested: true });

const optimizeTailCalls = (ast) => ast;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const applyImpulse = (body, impulse, point) => true;

const decompressGzip = (data) => data;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const mountFileSystem = (dev, path) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const renameFile = (oldName, newName) => newName;

const preventSleepMode = () => true;

const compressGzip = (data) => data;

const setKnee = (node, val) => node.knee.value = val;

const mutexLock = (mtx) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const generateSourceMap = (ast) => "{}";

const analyzeControlFlow = (ast) => ({ graph: {} });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const transcodeStream = (format) => ({ format, status: "processing" });

const spoofReferer = () => "https://google.com";

const getCpuLoad = () => Math.random() * 100;

const setBrake = (vehicle, force, wheelIdx) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const wakeUp = (body) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const allowSleepMode = () => true;

const mergeFiles = (parts) => parts[0];

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const resampleAudio = (buffer, rate) => buffer;

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

const useProgram = (program) => true;

const inlineFunctions = (ast) => ast;

const enableInterrupts = () => true;

const adjustPlaybackSpeed = (rate) => rate;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const calculateGasFee = (limit) => limit * 20;

const injectCSPHeader = () => "default-src 'self'";

const filterTraffic = (rule) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const closePipe = (fd) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const debouncedResize = () => ({ width: 1920, height: 1080 });

const addRigidBody = (world, body) => true;

const getEnv = (key) => "";

const getUniformLocation = (program, name) => 1;

const updateParticles = (sys, dt) => true;

const broadcastMessage = (msg) => true;

const beginTransaction = () => "TX-" + Date.now();

const calculateMetric = (route) => 1;

const disableInterrupts = () => true;

const decapsulateFrame = (frame) => frame;

const verifyIR = (ir) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const registerISR = (irq, func) => true;

const checkIntegrityConstraint = (table) => true;

const postProcessBloom = (image, threshold) => image;

const decodeAudioData = (buffer) => Promise.resolve({});

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const monitorClipboard = () => "";

const deserializeAST = (json) => JSON.parse(json);

const detectCollision = (body1, body2) => false;

const invalidateCache = (key) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const preventCSRF = () => "csrf_token";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const validatePieceChecksum = (piece) => true;

const restartApplication = () => console.log("Restarting...");

const createIndexBuffer = (data) => ({ id: Math.random() });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const setFilterType = (filter, type) => filter.type = type;

const setInertia = (body, i) => true;

const handleInterrupt = (irq) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const getMediaDuration = () => 3600;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const setVolumeLevel = (vol) => vol;

const execProcess = (path) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const foldConstants = (ast) => ast;

const obfuscateString = (str) => btoa(str);

const createIndex = (table, col) => `IDX_${table}_${col}`;

const unmapMemory = (ptr, size) => true;

const createASTNode = (type, val) => ({ type, val });

const createThread = (func) => ({ tid: 1 });

const setRelease = (node, val) => node.release.value = val;

const measureRTT = (sent, recv) => 10;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const getcwd = () => "/";

const estimateNonce = (addr) => 42;

const connectNodes = (src, dest) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const verifyAppSignature = () => true;

const handleTimeout = (sock) => true;

const mapMemory = (fd, size) => 0x2000;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const hoistVariables = (ast) => ast;

const sendPacket = (sock, data) => data.length;


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

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const closeSocket = (sock) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const traceroute = (host) => ["192.168.1.1"];

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);


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

const replicateData = (node) => ({ target: node, synced: true });

const translateMatrix = (mat, vec) => mat;

const jitCompile = (bc) => (() => {});

const validateIPWhitelist = (ip) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const controlCongestion = (sock) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const attachRenderBuffer = (fb, rb) => true;

const setGravity = (world, g) => world.gravity = g;

// Anti-shake references
const _ref_o73spa = { playSoundAlert };
const _ref_7s62pl = { createPanner };
const _ref_2mad4p = { emitParticles };
const _ref_wnlfyn = { detectPacketLoss };
const _ref_7kkhl1 = { setViewport };
const _ref_q9sokt = { createMediaElementSource };
const _ref_142i2s = { createSoftBody };
const _ref_08da6h = { setDelayTime };
const _ref_qhclvu = { activeTexture };
const _ref_d12dmf = { getByteFrequencyData };
const _ref_n4ca3y = { createPeriodicWave };
const _ref_i2llhs = { suspendContext };
const _ref_y77wh6 = { allocateRegisters };
const _ref_wc1c81 = { addConeTwistConstraint };
const _ref_ncqk9n = { setAttack };
const _ref_tuqiow = { chmodFile };
const _ref_w18xg6 = { openFile };
const _ref_201qcy = { applyEngineForce };
const _ref_z7zgo1 = { uniform3f };
const _ref_t3ftpu = { setFrequency };
const _ref_zjcy8d = { resetVehicle };
const _ref_bdbseh = { loadImpulseResponse };
const _ref_gk2p9p = { analyzeHeader };
const _ref_q08lum = { dhcpAck };
const _ref_9izvog = { parsePayload };
const _ref_20fxhd = { setDetune };
const _ref_pqzp7e = { protectMemory };
const _ref_3i246u = { unmountFileSystem };
const _ref_tgurza = { killProcess };
const _ref_xahk3c = { setOrientation };
const _ref_ztklyg = { createMeshShape };
const _ref_m0vjhb = { createScriptProcessor };
const _ref_7qfkux = { addSliderConstraint };
const _ref_k3khou = { createFrameBuffer };
const _ref_gumeh9 = { addHingeConstraint };
const _ref_rt1wpq = { chdir };
const _ref_jhwnub = { processAudioBuffer };
const _ref_6eksio = { addGeneric6DofConstraint };
const _ref_zf22gk = { setAngularVelocity };
const _ref_icwh4i = { traverseAST };
const _ref_vzz2zt = { unmuteStream };
const _ref_miza6l = { splitFile };
const _ref_or2kal = { repairCorruptFile };
const _ref_n2yjdl = { injectMetadata };
const _ref_pygm9i = { sanitizeInput };
const _ref_x7d7w1 = { contextSwitch };
const _ref_iy5ea5 = { announceToTracker };
const _ref_5bfg2u = { detectFirewallStatus };
const _ref_qaezmg = { encryptPayload };
const _ref_gj1tzi = { adjustWindowSize };
const _ref_og7vbf = { getFloatTimeDomainData };
const _ref_qu0bit = { ApiDataFormatter };
const _ref_rc4swd = { unchokePeer };
const _ref_a4pjjp = { enableDHT };
const _ref_1spzpl = { updateBitfield };
const _ref_yooskz = { syncAudioVideo };
const _ref_x6koyh = { seedRatioLimit };
const _ref_k6psrz = { normalizeVector };
const _ref_ppr4kb = { extractArchive };
const _ref_6uvl9w = { createConvolver };
const _ref_xpkjwf = { dhcpOffer };
const _ref_662u07 = { muteStream };
const _ref_7vqtcs = { panicKernel };
const _ref_qt7all = { encapsulateFrame };
const _ref_h9pjrn = { prioritizeRarestPiece };
const _ref_z9rvii = { unlockFile };
const _ref_j1rh06 = { setPan };
const _ref_74c2r5 = { negotiateProtocol };
const _ref_4tsxrs = { terminateSession };
const _ref_ch9trr = { unlinkFile };
const _ref_6l4qhk = { createBiquadFilter };
const _ref_hclsev = { getAppConfig };
const _ref_ksouxq = { syncDatabase };
const _ref_97juyy = { killParticles };
const _ref_akve92 = { parseSubtitles };
const _ref_yextzq = { interestPeer };
const _ref_3acsxo = { optimizeTailCalls };
const _ref_b18pe8 = { verifyMagnetLink };
const _ref_jpmcu8 = { extractThumbnail };
const _ref_x7n6xy = { createDynamicsCompressor };
const _ref_x9bzhg = { applyImpulse };
const _ref_v3tafp = { decompressGzip };
const _ref_dj8uhg = { simulateNetworkDelay };
const _ref_fbt5rd = { mountFileSystem };
const _ref_9lls8j = { setSocketTimeout };
const _ref_tjtltc = { createAnalyser };
const _ref_9wy3it = { renameFile };
const _ref_lp2v4y = { preventSleepMode };
const _ref_se2jem = { compressGzip };
const _ref_6fys64 = { setKnee };
const _ref_ytj9cc = { mutexLock };
const _ref_uq30le = { createSphereShape };
const _ref_l6sm58 = { generateSourceMap };
const _ref_fh0j8c = { analyzeControlFlow };
const _ref_pxxk07 = { interceptRequest };
const _ref_6m42g9 = { transcodeStream };
const _ref_tk7r8x = { spoofReferer };
const _ref_25ywrc = { getCpuLoad };
const _ref_luzmmb = { setBrake };
const _ref_sibvot = { generateUserAgent };
const _ref_c85469 = { traceStack };
const _ref_5jj6t4 = { wakeUp };
const _ref_wdieku = { generateUUIDv5 };
const _ref_ctfk0b = { showNotification };
const _ref_czzygo = { formatLogMessage };
const _ref_w5ybzp = { allowSleepMode };
const _ref_r9se03 = { mergeFiles };
const _ref_sdh9ws = { computeSpeedAverage };
const _ref_6u6fw2 = { manageCookieJar };
const _ref_3m334i = { resampleAudio };
const _ref_1jju88 = { download };
const _ref_cuofyt = { useProgram };
const _ref_1d2f6w = { inlineFunctions };
const _ref_ay46ij = { enableInterrupts };
const _ref_us2l0u = { adjustPlaybackSpeed };
const _ref_9m8anr = { createMagnetURI };
const _ref_ft6grt = { calculateGasFee };
const _ref_qe1sfd = { injectCSPHeader };
const _ref_e0c0j3 = { filterTraffic };
const _ref_b4vea8 = { initiateHandshake };
const _ref_7u6jak = { closePipe };
const _ref_qxbj1e = { watchFileChanges };
const _ref_c6idyg = { debouncedResize };
const _ref_e4i7t3 = { addRigidBody };
const _ref_as6kf1 = { getEnv };
const _ref_4q7dr0 = { getUniformLocation };
const _ref_to1py1 = { updateParticles };
const _ref_03pq7x = { broadcastMessage };
const _ref_8kvfh4 = { beginTransaction };
const _ref_ieqoao = { calculateMetric };
const _ref_zdf5g5 = { disableInterrupts };
const _ref_debnge = { decapsulateFrame };
const _ref_p5m7s7 = { verifyIR };
const _ref_7u6282 = { switchProxyServer };
const _ref_37mibt = { registerISR };
const _ref_226qvn = { checkIntegrityConstraint };
const _ref_zuv2gy = { postProcessBloom };
const _ref_xiavic = { decodeAudioData };
const _ref_yngzug = { createOscillator };
const _ref_3frlpo = { optimizeConnectionPool };
const _ref_miasar = { monitorClipboard };
const _ref_3xlfau = { deserializeAST };
const _ref_3n7fpq = { detectCollision };
const _ref_4ocxit = { invalidateCache };
const _ref_akxu4c = { performTLSHandshake };
const _ref_3zskog = { requestPiece };
const _ref_ekigj7 = { preventCSRF };
const _ref_zg52h6 = { uploadCrashReport };
const _ref_lgkqwd = { scheduleBandwidth };
const _ref_uc322k = { validatePieceChecksum };
const _ref_zmig0v = { restartApplication };
const _ref_feljbs = { createIndexBuffer };
const _ref_8fgybq = { FileValidator };
const _ref_jsorbr = { setFilterType };
const _ref_9b58ol = { setInertia };
const _ref_o9skix = { handleInterrupt };
const _ref_ybkgop = { handshakePeer };
const _ref_hm15et = { getMediaDuration };
const _ref_xro39t = { limitBandwidth };
const _ref_woxg12 = { uninterestPeer };
const _ref_s8tfh2 = { setVolumeLevel };
const _ref_284srq = { execProcess };
const _ref_712mx0 = { resolveDNSOverHTTPS };
const _ref_flvudv = { optimizeMemoryUsage };
const _ref_6nsueu = { foldConstants };
const _ref_ka0pgc = { obfuscateString };
const _ref_ixnpg0 = { createIndex };
const _ref_cnse3k = { unmapMemory };
const _ref_s0vnxg = { createASTNode };
const _ref_yd1qpl = { createThread };
const _ref_krwgyd = { setRelease };
const _ref_k309tm = { measureRTT };
const _ref_vunmwe = { createStereoPanner };
const _ref_twu2l2 = { getcwd };
const _ref_cl48f7 = { estimateNonce };
const _ref_2oe6mi = { connectNodes };
const _ref_ydvme2 = { getMemoryUsage };
const _ref_1nwh58 = { verifyAppSignature };
const _ref_j8kcu3 = { handleTimeout };
const _ref_he0i98 = { mapMemory };
const _ref_unobpf = { decryptHLSStream };
const _ref_sfof0u = { loadModelWeights };
const _ref_9e7ftx = { hoistVariables };
const _ref_uwbns3 = { sendPacket };
const _ref_ij21h5 = { TelemetryClient };
const _ref_pzsw9j = { moveFileToComplete };
const _ref_7vbtrc = { closeSocket };
const _ref_63lmbo = { getFileAttributes };
const _ref_xjflng = { traceroute };
const _ref_eqnpbo = { readPixels };
const _ref_m4dfi3 = { CacheManager };
const _ref_wbv1v3 = { replicateData };
const _ref_6q067o = { translateMatrix };
const _ref_w0rwod = { jitCompile };
const _ref_uct77q = { validateIPWhitelist };
const _ref_l6nepq = { createCapsuleShape };
const _ref_thwex8 = { controlCongestion };
const _ref_3hnwk7 = { rotateMatrix };
const _ref_jjfp32 = { attachRenderBuffer };
const _ref_mqwaug = { setGravity }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `mixch` };
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
                const urlParams = { config, url: window.location.href, name_en: `mixch` };

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
        const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const closeSocket = (sock) => true;

const deobfuscateString = (str) => atob(str);

const estimateNonce = (addr) => 42;

const verifySignature = (tx, sig) => true;

const checkRootAccess = () => false;

const calculateMetric = (route) => 1;

const enterScope = (table) => true;

const dumpSymbolTable = (table) => "";

const detectDebugger = () => false;

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

const scaleMatrix = (mat, vec) => mat;

const enableBlend = (func) => true;

const traceroute = (host) => ["192.168.1.1"];

const deserializeAST = (json) => JSON.parse(json);

const obfuscateString = (str) => btoa(str);

const disableInterrupts = () => true;

const adjustWindowSize = (sock, size) => true;

const calculateCRC32 = (data) => "00000000";

const checkBatteryLevel = () => 100;

const mergeFiles = (parts) => parts[0];

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createSymbolTable = () => ({ scopes: [] });

const registerSystemTray = () => ({ icon: "tray.ico" });

const sanitizeXSS = (html) => html;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const setFilterType = (filter, type) => filter.type = type;

const signTransaction = (tx, key) => "signed_tx_hash";

const encryptLocalStorage = (key, val) => true;

const retransmitPacket = (seq) => true;

const resetVehicle = (vehicle) => true;

const checkBalance = (addr) => "10.5 ETH";

const detectDevTools = () => false;

const createChannelSplitter = (ctx, channels) => ({});

const acceptConnection = (sock) => ({ fd: 2 });

const createSoftBody = (info) => ({ nodes: [] });

const splitFile = (path, parts) => Array(parts).fill(path);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const muteStream = () => true;

const resumeContext = (ctx) => Promise.resolve();

const foldConstants = (ast) => ast;

const getOutputTimestamp = (ctx) => Date.now();

const joinGroup = (group) => true;

const inlineFunctions = (ast) => ast;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createDirectoryRecursive = (path) => path.split('/').length;

const analyzeBitrate = () => "5000kbps";

const dropTable = (table) => true;

const applyImpulse = (body, impulse, point) => true;

const defineSymbol = (table, name, info) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const restartApplication = () => console.log("Restarting...");

const translateMatrix = (mat, vec) => mat;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setThreshold = (node, val) => node.threshold.value = val;

const handleTimeout = (sock) => true;

const createConstraint = (body1, body2) => ({});

const fragmentPacket = (data, mtu) => [data];

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

const setKnee = (node, val) => node.knee.value = val;

const segmentImageUNet = (img) => "mask_buffer";

const createTCPSocket = () => ({ fd: 1 });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const closeContext = (ctx) => Promise.resolve();

const killParticles = (sys) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const loadImpulseResponse = (url) => Promise.resolve({});

const compressGzip = (data) => data;

const serializeAST = (ast) => JSON.stringify(ast);

const decompressGzip = (data) => data;

const sendPacket = (sock, data) => data.length;

const remuxContainer = (container) => ({ container, status: "done" });

const reduceDimensionalityPCA = (data) => data;

const linkModules = (modules) => ({});

const rotateMatrix = (mat, angle, axis) => mat;

const measureRTT = (sent, recv) => 10;

const augmentData = (image) => image;

const createListener = (ctx) => ({});

const adjustPlaybackSpeed = (rate) => rate;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const getFloatTimeDomainData = (analyser, array) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const getMACAddress = (iface) => "00:00:00:00:00:00";

const createChannelMerger = (ctx, channels) => ({});


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

const loadCheckpoint = (path) => true;

const processAudioBuffer = (buffer) => buffer;

const negotiateProtocol = () => "HTTP/2.0";

const killProcess = (pid) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const logErrorToFile = (err) => console.error(err);

const announceToTracker = (url) => ({ url, interval: 1800 });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const sleep = (body) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const triggerHapticFeedback = (intensity) => true;

const deriveAddress = (path) => "0x123...";

const classifySentiment = (text) => "positive";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const preventCSRF = () => "csrf_token";

const decryptStream = (stream, key) => stream;

const rotateLogFiles = () => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const bufferMediaStream = (size) => ({ buffer: size });

const transcodeStream = (format) => ({ format, status: "processing" });

const scheduleProcess = (pid) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const dhcpOffer = (ip) => true;

const detachThread = (tid) => true;

const stakeAssets = (pool, amount) => true;

const broadcastMessage = (msg) => true;

const rollbackTransaction = (tx) => true;

const extractArchive = (archive) => ["file1", "file2"];

const getNetworkStats = () => ({ up: 100, down: 2000 });

const setPan = (node, val) => node.pan.value = val;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const resolveDNS = (domain) => "127.0.0.1";

const encapsulateFrame = (packet) => packet;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const decapsulateFrame = (frame) => frame;

const setAngularVelocity = (body, v) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const commitTransaction = (tx) => true;

const findLoops = (cfg) => [];

const verifyIR = (ir) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const normalizeVolume = (buffer) => buffer;

const configureInterface = (iface, config) => true;

const calculateGasFee = (limit) => limit * 20;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const negotiateSession = (sock) => ({ id: "sess_1" });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const calculateFriction = (mat1, mat2) => 0.5;

const dhcpRequest = (ip) => true;

const filterTraffic = (rule) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const createParticleSystem = (count) => ({ particles: [] });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const createConvolver = (ctx) => ({ buffer: null });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const performOCR = (img) => "Detected Text";

const getByteFrequencyData = (analyser, array) => true;

const switchVLAN = (id) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const encryptStream = (stream, key) => stream;

const checkIntegrityToken = (token) => true;

const bindAddress = (sock, addr, port) => true;

const addPoint2PointConstraint = (world, c) => true;

const reportError = (msg, line) => console.error(msg);

const cullFace = (mode) => true;

const getUniformLocation = (program, name) => 1;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createPipe = () => [3, 4];


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

const listenSocket = (sock, backlog) => true;

const validateRecaptcha = (token) => true;

const deleteProgram = (program) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const setMTU = (iface, mtu) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const rayCast = (world, start, end) => ({ hit: false });

const mapMemory = (fd, size) => 0x2000;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const mutexLock = (mtx) => true;

const invalidateCache = (key) => true;

const debugAST = (ast) => "";

const makeDistortionCurve = (amount) => new Float32Array(4096);

const checkParticleCollision = (sys, world) => true;

const inferType = (node) => 'any';

const analyzeHeader = (packet) => ({});

const compileVertexShader = (source) => ({ compiled: true });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const parsePayload = (packet) => ({});

const obfuscateCode = (code) => code;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const hoistVariables = (ast) => ast;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const convexSweepTest = (shape, start, end) => ({ hit: false });

const readPipe = (fd, len) => new Uint8Array(len);

const shutdownComputer = () => console.log("Shutting down...");

const createFrameBuffer = () => ({ id: Math.random() });

const pingHost = (host) => 10;

const addRigidBody = (world, body) => true;

const establishHandshake = (sock) => true;

const disableRightClick = () => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const bufferData = (gl, target, data, usage) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const emitParticles = (sys, count) => true;

const addConeTwistConstraint = (world, c) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

// Anti-shake references
const _ref_9bkax9 = { validateMnemonic };
const _ref_g5gyv9 = { closeSocket };
const _ref_0dpe2m = { deobfuscateString };
const _ref_ehkrme = { estimateNonce };
const _ref_l72ish = { verifySignature };
const _ref_lov33e = { checkRootAccess };
const _ref_cw2qf5 = { calculateMetric };
const _ref_q4777l = { enterScope };
const _ref_9uobyu = { dumpSymbolTable };
const _ref_z7xi5l = { detectDebugger };
const _ref_evck40 = { AdvancedCipher };
const _ref_wkpqhc = { scaleMatrix };
const _ref_s2c7hy = { enableBlend };
const _ref_bvsz0x = { traceroute };
const _ref_mk4dxw = { deserializeAST };
const _ref_l8znhi = { obfuscateString };
const _ref_qx1p6u = { disableInterrupts };
const _ref_6u283f = { adjustWindowSize };
const _ref_y97bwm = { calculateCRC32 };
const _ref_a3m87o = { checkBatteryLevel };
const _ref_5fpuln = { mergeFiles };
const _ref_ohrqgy = { decodeABI };
const _ref_7tg4js = { createSymbolTable };
const _ref_m7ask9 = { registerSystemTray };
const _ref_dltcj9 = { sanitizeXSS };
const _ref_ubtjdm = { loadTexture };
const _ref_wb9c17 = { setFilterType };
const _ref_qd1hqx = { signTransaction };
const _ref_l4i9t8 = { encryptLocalStorage };
const _ref_lr5ziq = { retransmitPacket };
const _ref_rvmne3 = { resetVehicle };
const _ref_7q69ap = { checkBalance };
const _ref_8uh432 = { detectDevTools };
const _ref_iaxtaq = { createChannelSplitter };
const _ref_gbyg6u = { acceptConnection };
const _ref_z4y9mm = { createSoftBody };
const _ref_rqbyjp = { splitFile };
const _ref_gr134i = { discoverPeersDHT };
const _ref_ww5tle = { muteStream };
const _ref_wlkebw = { resumeContext };
const _ref_ed2ahk = { foldConstants };
const _ref_j3itkr = { getOutputTimestamp };
const _ref_b4ey19 = { joinGroup };
const _ref_rbhst5 = { inlineFunctions };
const _ref_jmn5xc = { diffVirtualDOM };
const _ref_pwgk6x = { createDirectoryRecursive };
const _ref_n5b4sf = { analyzeBitrate };
const _ref_91z75v = { dropTable };
const _ref_q5u7dx = { applyImpulse };
const _ref_ay32zm = { defineSymbol };
const _ref_8ase3v = { setFilePermissions };
const _ref_c72kmm = { restartApplication };
const _ref_gmh3mn = { translateMatrix };
const _ref_toz4jj = { createAnalyser };
const _ref_aedjf5 = { setThreshold };
const _ref_sbkp7g = { handleTimeout };
const _ref_2jiihe = { createConstraint };
const _ref_f4drh6 = { fragmentPacket };
const _ref_ngooob = { ProtocolBufferHandler };
const _ref_n8u5id = { setKnee };
const _ref_sgwy3s = { segmentImageUNet };
const _ref_wxa0np = { createTCPSocket };
const _ref_shj78g = { tokenizeSource };
const _ref_q3v3cf = { loadModelWeights };
const _ref_4oy0ey = { closeContext };
const _ref_ypb2u1 = { killParticles };
const _ref_mla8w7 = { linkProgram };
const _ref_5zv81b = { loadImpulseResponse };
const _ref_vm3xhm = { compressGzip };
const _ref_qc1x31 = { serializeAST };
const _ref_76u9u4 = { decompressGzip };
const _ref_z2xcqs = { sendPacket };
const _ref_sxm2ym = { remuxContainer };
const _ref_ivn1jj = { reduceDimensionalityPCA };
const _ref_tr94hu = { linkModules };
const _ref_ho94ns = { rotateMatrix };
const _ref_ot55r8 = { measureRTT };
const _ref_2flz19 = { augmentData };
const _ref_94lcw2 = { createListener };
const _ref_i4hs4r = { adjustPlaybackSpeed };
const _ref_ess23z = { convertHSLtoRGB };
const _ref_r8zprw = { getFloatTimeDomainData };
const _ref_7yf16e = { updateProgressBar };
const _ref_2clm8u = { getMACAddress };
const _ref_sor0s1 = { createChannelMerger };
const _ref_h9rzss = { ResourceMonitor };
const _ref_szeo2m = { loadCheckpoint };
const _ref_zvwk2m = { processAudioBuffer };
const _ref_phrate = { negotiateProtocol };
const _ref_bb5eyo = { killProcess };
const _ref_5m63gv = { validateSSLCert };
const _ref_9qjkft = { logErrorToFile };
const _ref_4clv0i = { announceToTracker };
const _ref_c4084t = { autoResumeTask };
const _ref_k2kkra = { sleep };
const _ref_0o4nuc = { requestPiece };
const _ref_8rz30c = { triggerHapticFeedback };
const _ref_cnag6r = { deriveAddress };
const _ref_nws8sk = { classifySentiment };
const _ref_f2o0r1 = { calculatePieceHash };
const _ref_vauxsc = { preventCSRF };
const _ref_esi8jv = { decryptStream };
const _ref_hgs6va = { rotateLogFiles };
const _ref_s6120a = { rotateUserAgent };
const _ref_xw5zem = { bufferMediaStream };
const _ref_uca5lt = { transcodeStream };
const _ref_vu25zd = { scheduleProcess };
const _ref_k8xuuw = { parseMagnetLink };
const _ref_idjhkw = { dhcpOffer };
const _ref_b57z4m = { detachThread };
const _ref_q0j01g = { stakeAssets };
const _ref_rdg1am = { broadcastMessage };
const _ref_x6i45i = { rollbackTransaction };
const _ref_0w537v = { extractArchive };
const _ref_p0h3x7 = { getNetworkStats };
const _ref_08hijp = { setPan };
const _ref_2ztkc1 = { parseClass };
const _ref_kijlgd = { resolveDNS };
const _ref_7wu5wi = { encapsulateFrame };
const _ref_6ekebu = { formatCurrency };
const _ref_okvu7f = { rayIntersectTriangle };
const _ref_26u3jo = { decapsulateFrame };
const _ref_hpse1n = { setAngularVelocity };
const _ref_0ual6b = { archiveFiles };
const _ref_pr60fe = { commitTransaction };
const _ref_5a3lsj = { findLoops };
const _ref_a7406q = { verifyIR };
const _ref_w8o6hr = { calculateEntropy };
const _ref_8iwkq3 = { checkPortAvailability };
const _ref_3ciyc6 = { normalizeVolume };
const _ref_jnhkoi = { configureInterface };
const _ref_fql0dq = { calculateGasFee };
const _ref_07p1ff = { createDelay };
const _ref_vptgqo = { transformAesKey };
const _ref_jehao6 = { negotiateSession };
const _ref_ed594y = { computeNormal };
const _ref_fwo47m = { calculateFriction };
const _ref_s5aotl = { dhcpRequest };
const _ref_nf9tol = { filterTraffic };
const _ref_99amto = { setDelayTime };
const _ref_j5nmrz = { createParticleSystem };
const _ref_k8eszs = { requestAnimationFrameLoop };
const _ref_28bzfi = { createConvolver };
const _ref_2uxhrs = { normalizeVector };
const _ref_yi2nre = { performOCR };
const _ref_9161ms = { getByteFrequencyData };
const _ref_l4jej1 = { switchVLAN };
const _ref_j9wzla = { cancelTask };
const _ref_etaz8m = { encryptStream };
const _ref_1pt0q8 = { checkIntegrityToken };
const _ref_w9pkls = { bindAddress };
const _ref_pfflsd = { addPoint2PointConstraint };
const _ref_fm8u3k = { reportError };
const _ref_yifvqx = { cullFace };
const _ref_j5bn7u = { getUniformLocation };
const _ref_6aou80 = { limitDownloadSpeed };
const _ref_rcqvb8 = { createPipe };
const _ref_cj6j8x = { TelemetryClient };
const _ref_dggz4a = { listenSocket };
const _ref_ibxm5b = { validateRecaptcha };
const _ref_lbws4u = { deleteProgram };
const _ref_u8898x = { getMemoryUsage };
const _ref_c8q5ft = { setMTU };
const _ref_0lg01t = { limitBandwidth };
const _ref_e1npdg = { rayCast };
const _ref_q6izhq = { mapMemory };
const _ref_tqymnv = { checkDiskSpace };
const _ref_ft6glt = { vertexAttrib3f };
const _ref_cgtpnn = { mutexLock };
const _ref_5w3bf6 = { invalidateCache };
const _ref_zs8hk9 = { debugAST };
const _ref_40mp63 = { makeDistortionCurve };
const _ref_llklan = { checkParticleCollision };
const _ref_zy6w1v = { inferType };
const _ref_0v2avr = { analyzeHeader };
const _ref_hblitz = { compileVertexShader };
const _ref_xw6lvw = { getAppConfig };
const _ref_me75uz = { parsePayload };
const _ref_9ucfe2 = { obfuscateCode };
const _ref_md22fh = { keepAlivePing };
const _ref_0q2zi1 = { hoistVariables };
const _ref_nt9nj7 = { compactDatabase };
const _ref_42jnqy = { sanitizeInput };
const _ref_1va2w0 = { convexSweepTest };
const _ref_vdh5qz = { readPipe };
const _ref_kdv7d6 = { shutdownComputer };
const _ref_r83hqw = { createFrameBuffer };
const _ref_gb2br7 = { pingHost };
const _ref_l217vc = { addRigidBody };
const _ref_e40ja4 = { establishHandshake };
const _ref_sp1ohc = { disableRightClick };
const _ref_1z0n4z = { syncAudioVideo };
const _ref_oepxc5 = { queueDownloadTask };
const _ref_6do2tp = { formatLogMessage };
const _ref_ox8pyo = { bufferData };
const _ref_vb5qga = { virtualScroll };
const _ref_d09o4e = { parseFunction };
const _ref_zo1tms = { emitParticles };
const _ref_ebv57h = { addConeTwistConstraint };
const _ref_po34lm = { shardingTable }; 
    });
})({}, {});