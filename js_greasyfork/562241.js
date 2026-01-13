// ==UserScript==
// @name Canalsurmas视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Canalsurmas/index.js
// @version 2026.01.10
// @description 一键下载Canalsurmas视频，支持4K/1080P/720P多画质。
// @icon https://www.canalsurmas.es/favicon.ico
// @match *://*.canalsurmas.es/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect canalsurmas.es
// @connect interactvty.com
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
// @downloadURL https://update.greasyfork.org/scripts/562241/Canalsurmas%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562241/Canalsurmas%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
 * 查看许可（Viewing License）
 *
 * 版权声明
 * 版权所有 [大角牛软件科技]。保留所有权利。
 *
 * 许可证声明
 * 本协议适用于 [大角牛下载助手] 及其所有相关文件和代码（以下统称“软件”）。软件以开源形式提供，但仅允许查看，禁止使用、修改或分发。
 *
 * 授权条款
 * 1. 查看许可：任何人可以查看本软件的源代码，但仅限于个人学习和研究目的。
 * 2. 禁止使用：未经版权所有者（即 [你的名字或组织名称]）的明确书面授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 3. 明确授权：任何希望使用、修改或分发本软件的个人或组织，必须向版权所有者提交书面申请，说明使用目的、范围和方式。版权所有者有权根据自身判断决定是否授予授权。
 *
 * 限制条款
 * 1. 禁止未经授权的使用：未经版权所有者明确授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 2. 禁止商业使用：未经版权所有者明确授权，任何人或组织不得将本软件用于商业目的，包括但不限于在商业网站、应用程序或其他商业服务中使用。
 * 3. 禁止分发：未经版权所有者明确授权，任何人或组织不得将本软件或其任何修改版本分发给第三方。
 * 4. 禁止修改：未经版权所有者明确授权，任何人或组织不得对本软件进行任何形式的修改。
 *
 * 法律声明
 * 1. 版权保护：本软件受版权法保护。未经授权的使用、复制、修改或分发将构成侵权行为，版权所有者有权依法追究侵权者的法律责任。
 * 2. 免责声明：本软件按“原样”提供，不提供任何形式的明示或暗示的保证，包括但不限于对适销性、特定用途的适用性或不侵权的保证。在任何情况下，版权所有者均不对因使用或无法使用本软件而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
 *
 * 附加条款
 * 1. 协议变更：版权所有者有权随时修改本协议的条款。任何修改将在版权所有者通知后立即生效。
 * 2. 解释权：本协议的最终解释权归版权所有者所有。
 */

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const createThread = (func) => ({ tid: 1 });

const closeFile = (fd) => true;

const semaphoreWait = (sem) => true;

const encapsulateFrame = (packet) => packet;

const contextSwitch = (oldPid, newPid) => true;

const decapsulateFrame = (frame) => frame;

const arpRequest = (ip) => "00:00:00:00:00:00";

const switchVLAN = (id) => true;

const semaphoreSignal = (sem) => true;

const analyzeHeader = (packet) => ({});

const jitCompile = (bc) => (() => {});

const dhcpOffer = (ip) => true;

const createPipe = () => [3, 4];

const lookupSymbol = (table, name) => ({});

const forkProcess = () => 101;

const hoistVariables = (ast) => ast;

const defineSymbol = (table, name, info) => true;

const parsePayload = (packet) => ({});

const generateSourceMap = (ast) => "{}";

const execProcess = (path) => true;

const findLoops = (cfg) => [];

const scheduleProcess = (pid) => true;

const configureInterface = (iface, config) => true;

const resolveSymbols = (ast) => ({});

const getMACAddress = (iface) => "00:00:00:00:00:00";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const inferType = (node) => 'any';

const enterScope = (table) => true;

const resolveImports = (ast) => [];

const setMTU = (iface, mtu) => true;

const freeMemory = (ptr) => true;

const controlCongestion = (sock) => true;

const closePipe = (fd) => true;

const adjustPlaybackSpeed = (rate) => rate;

const closeSocket = (sock) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const setRatio = (node, val) => node.ratio.value = val;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const profilePerformance = (func) => 0;

const unloadDriver = (name) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const gaussianBlur = (image, radius) => image;

const rotateLogFiles = () => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const allocateMemory = (size) => 0x1000;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const interestPeer = (peer) => ({ ...peer, interested: true });

const retransmitPacket = (seq) => true;

const optimizeTailCalls = (ast) => ast;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const extractArchive = (archive) => ["file1", "file2"];

const seedRatioLimit = (ratio) => ratio >= 2.0;

const deobfuscateString = (str) => atob(str);

const restoreDatabase = (path) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const unrollLoops = (ast) => ast;

const minifyCode = (code) => code;

const triggerHapticFeedback = (intensity) => true;

const updateWheelTransform = (wheel) => true;

const unlockFile = (path) => ({ path, locked: false });

const compressPacket = (data) => data;

const anchorSoftBody = (soft, rigid) => true;

const resumeContext = (ctx) => Promise.resolve();

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const replicateData = (node) => ({ target: node, synced: true });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const sleep = (body) => true;

const exitScope = (table) => true;

const encryptPeerTraffic = (data) => btoa(data);

const addPoint2PointConstraint = (world, c) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const classifySentiment = (text) => "positive";

const eliminateDeadCode = (ast) => ast;

const setDetune = (osc, cents) => osc.detune = cents;

const fragmentPacket = (data, mtu) => [data];

const instrumentCode = (code) => code;

const allowSleepMode = () => true;

const applyTorque = (body, torque) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const signTransaction = (tx, key) => "signed_tx_hash";

const removeRigidBody = (world, body) => true;

const verifyProofOfWork = (nonce) => true;

const lockRow = (id) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const negotiateSession = (sock) => ({ id: "sess_1" });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const shutdownComputer = () => console.log("Shutting down...");

const detectVideoCodec = () => "h264";

const decryptStream = (stream, key) => stream;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const verifyAppSignature = () => true;

const updateSoftBody = (body) => true;

const clearScreen = (r, g, b, a) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const sanitizeXSS = (html) => html;

const disableRightClick = () => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const subscribeToEvents = (contract) => true;

const linkModules = (modules) => ({});

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const detectDebugger = () => false;

const monitorClipboard = () => "";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const rateLimitCheck = (ip) => true;

const readFile = (fd, len) => "";

const analyzeControlFlow = (ast) => ({ graph: {} });

const checkBalance = (addr) => "10.5 ETH";

const clusterKMeans = (data, k) => Array(k).fill([]);

const vertexAttrib3f = (idx, x, y, z) => true;

const compileVertexShader = (source) => ({ compiled: true });

const removeMetadata = (file) => ({ file, metadata: null });

const chmodFile = (path, mode) => true;

const linkFile = (src, dest) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const verifySignature = (tx, sig) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const prettifyCode = (code) => code;

const compressGzip = (data) => data;

const merkelizeRoot = (txs) => "root_hash";

const dumpSymbolTable = (table) => "";

const renderParticles = (sys) => true;

const bindTexture = (target, texture) => true;

const setDopplerFactor = (val) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const analyzeBitrate = () => "5000kbps";

const logErrorToFile = (err) => console.error(err);

const commitTransaction = (tx) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const verifyIR = (ir) => true;

const claimRewards = (pool) => "0.5 ETH";

const attachRenderBuffer = (fb, rb) => true;

const setGainValue = (node, val) => node.gain.value = val;

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

const computeDominators = (cfg) => ({});

const detectDevTools = () => false;

const calculateGasFee = (limit) => limit * 20;

const setPan = (node, val) => node.pan.value = val;

const disableInterrupts = () => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const addGeneric6DofConstraint = (world, c) => true;

const compileToBytecode = (ast) => new Uint8Array();

const createConvolver = (ctx) => ({ buffer: null });

const multicastMessage = (group, msg) => true;


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

const registerISR = (irq, func) => true;

const rayCast = (world, start, end) => ({ hit: false });

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

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const emitParticles = (sys, count) => true;

const createASTNode = (type, val) => ({ type, val });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const calculateCRC32 = (data) => "00000000";

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const enableDHT = () => true;

const establishHandshake = (sock) => true;

const unlockRow = (id) => true;

const hashKeccak256 = (data) => "0xabc...";

const parseLogTopics = (topics) => ["Transfer"];

const renderShadowMap = (scene, light) => ({ texture: {} });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const createSphereShape = (r) => ({ type: 'sphere' });

const getEnv = (key) => "";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const augmentData = (image) => image;

const upInterface = (iface) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const repairCorruptFile = (path) => ({ path, repaired: true });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const splitFile = (path, parts) => Array(parts).fill(path);

const getBlockHeight = () => 15000000;

const createFrameBuffer = () => ({ id: Math.random() });

const stepSimulation = (world, dt) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const preventCSRF = () => "csrf_token";

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const activeTexture = (unit) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const setDistanceModel = (panner, model) => true;

const detectAudioCodec = () => "aac";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const dhcpAck = () => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const createChannelMerger = (ctx, channels) => ({});

const readPipe = (fd, len) => new Uint8Array(len);

const injectCSPHeader = () => "default-src 'self'";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const processAudioBuffer = (buffer) => buffer;

const applyForce = (body, force, point) => true;

// Anti-shake references
const _ref_oqtmwj = { createThread };
const _ref_ux5zu3 = { closeFile };
const _ref_xa3ptj = { semaphoreWait };
const _ref_00rv6a = { encapsulateFrame };
const _ref_37rufa = { contextSwitch };
const _ref_te3p7q = { decapsulateFrame };
const _ref_fci0xt = { arpRequest };
const _ref_x7awo5 = { switchVLAN };
const _ref_9z2ptr = { semaphoreSignal };
const _ref_f3smfj = { analyzeHeader };
const _ref_a8097e = { jitCompile };
const _ref_sgej6k = { dhcpOffer };
const _ref_zhc5f3 = { createPipe };
const _ref_0w0c0y = { lookupSymbol };
const _ref_qaoln7 = { forkProcess };
const _ref_r7zxl7 = { hoistVariables };
const _ref_tifuxk = { defineSymbol };
const _ref_dtwe2z = { parsePayload };
const _ref_vyt8my = { generateSourceMap };
const _ref_nvm4cr = { execProcess };
const _ref_frtl1p = { findLoops };
const _ref_p1xx2u = { scheduleProcess };
const _ref_2nrzyp = { configureInterface };
const _ref_6v8d3k = { resolveSymbols };
const _ref_uxd5ms = { getMACAddress };
const _ref_mjieo1 = { virtualScroll };
const _ref_m429eo = { getAppConfig };
const _ref_qccb4f = { inferType };
const _ref_o4ciss = { enterScope };
const _ref_paauc9 = { resolveImports };
const _ref_8q6vtv = { setMTU };
const _ref_65nbii = { freeMemory };
const _ref_qjyivu = { controlCongestion };
const _ref_7857sf = { closePipe };
const _ref_ocvve8 = { adjustPlaybackSpeed };
const _ref_qkhtd2 = { closeSocket };
const _ref_wg2vlx = { receivePacket };
const _ref_4najfl = { setRatio };
const _ref_bt5idg = { switchProxyServer };
const _ref_8ignmj = { profilePerformance };
const _ref_15req2 = { unloadDriver };
const _ref_oomogg = { createDelay };
const _ref_76wukq = { gaussianBlur };
const _ref_m21i9u = { rotateLogFiles };
const _ref_wa6zgx = { analyzeUserBehavior };
const _ref_5fkncm = { sanitizeInput };
const _ref_t05t39 = { allocateMemory };
const _ref_19p96g = { transformAesKey };
const _ref_t3v1hw = { interestPeer };
const _ref_luudto = { retransmitPacket };
const _ref_cv5hex = { optimizeTailCalls };
const _ref_z62ri7 = { syncDatabase };
const _ref_buusqk = { extractArchive };
const _ref_xsa9jv = { seedRatioLimit };
const _ref_0t5lxz = { deobfuscateString };
const _ref_2llksq = { restoreDatabase };
const _ref_rmbo73 = { archiveFiles };
const _ref_7k863l = { validateSSLCert };
const _ref_zbp736 = { getAngularVelocity };
const _ref_civpl0 = { cancelAnimationFrameLoop };
const _ref_0m3sn4 = { unrollLoops };
const _ref_ykh3ez = { minifyCode };
const _ref_oljwwu = { triggerHapticFeedback };
const _ref_zwh066 = { updateWheelTransform };
const _ref_i2rcea = { unlockFile };
const _ref_pkz6z6 = { compressPacket };
const _ref_g6pm7y = { anchorSoftBody };
const _ref_4iq4n3 = { resumeContext };
const _ref_0oxpbg = { generateWalletKeys };
const _ref_60hdg6 = { interceptRequest };
const _ref_pmnbkv = { replicateData };
const _ref_7n4n3i = { monitorNetworkInterface };
const _ref_gu1gnr = { sleep };
const _ref_kmcg9t = { exitScope };
const _ref_pmctp6 = { encryptPeerTraffic };
const _ref_84917p = { addPoint2PointConstraint };
const _ref_2oiczr = { traceStack };
const _ref_6zhltv = { getNetworkStats };
const _ref_tinwbd = { classifySentiment };
const _ref_xttoca = { eliminateDeadCode };
const _ref_jpocw1 = { setDetune };
const _ref_pib7h9 = { fragmentPacket };
const _ref_bfa09a = { instrumentCode };
const _ref_c2k85e = { allowSleepMode };
const _ref_u4mgsg = { applyTorque };
const _ref_bngip5 = { shardingTable };
const _ref_jq7ljj = { signTransaction };
const _ref_u7n08m = { removeRigidBody };
const _ref_tcamiv = { verifyProofOfWork };
const _ref_af0lty = { lockRow };
const _ref_3umgj5 = { createMeshShape };
const _ref_b5w5a5 = { lazyLoadComponent };
const _ref_7p6f1b = { negotiateSession };
const _ref_kyxjhn = { decodeABI };
const _ref_65znx6 = { compressDataStream };
const _ref_v6dbef = { shutdownComputer };
const _ref_ly3gzm = { detectVideoCodec };
const _ref_4oyi8w = { decryptStream };
const _ref_33vogz = { diffVirtualDOM };
const _ref_050q6j = { formatLogMessage };
const _ref_c24l88 = { verifyAppSignature };
const _ref_v6b37s = { updateSoftBody };
const _ref_o389a4 = { clearScreen };
const _ref_rik3o3 = { uploadCrashReport };
const _ref_6hyift = { sanitizeXSS };
const _ref_ocfrd4 = { disableRightClick };
const _ref_zvautu = { createIndex };
const _ref_0dpahq = { subscribeToEvents };
const _ref_8ldkrx = { linkModules };
const _ref_i4e3d9 = { calculateLayoutMetrics };
const _ref_64cx80 = { detectDebugger };
const _ref_xefpw2 = { monitorClipboard };
const _ref_vlbyp8 = { executeSQLQuery };
const _ref_2mdusf = { rateLimitCheck };
const _ref_l300j7 = { readFile };
const _ref_15ife2 = { analyzeControlFlow };
const _ref_uw3yno = { checkBalance };
const _ref_ct657n = { clusterKMeans };
const _ref_sffp1k = { vertexAttrib3f };
const _ref_yk7ps5 = { compileVertexShader };
const _ref_pvyxsl = { removeMetadata };
const _ref_x2gmnu = { chmodFile };
const _ref_ao04xf = { linkFile };
const _ref_oqlq8d = { setDelayTime };
const _ref_cet5nt = { verifySignature };
const _ref_s1n8v6 = { broadcastTransaction };
const _ref_hmfjxz = { resolveHostName };
const _ref_t0pmkq = { prettifyCode };
const _ref_ex5axl = { compressGzip };
const _ref_d6d8zq = { merkelizeRoot };
const _ref_urgmld = { dumpSymbolTable };
const _ref_ilg9yj = { renderParticles };
const _ref_0rd7h2 = { bindTexture };
const _ref_rvwwwl = { setDopplerFactor };
const _ref_if10th = { moveFileToComplete };
const _ref_ys24b6 = { analyzeBitrate };
const _ref_gn0tet = { logErrorToFile };
const _ref_scb4vd = { commitTransaction };
const _ref_b41ixw = { rotateUserAgent };
const _ref_8cd703 = { verifyIR };
const _ref_56k85y = { claimRewards };
const _ref_ib23or = { attachRenderBuffer };
const _ref_dp0vtn = { setGainValue };
const _ref_fnwue9 = { download };
const _ref_6b2qcm = { computeDominators };
const _ref_ni3ly3 = { detectDevTools };
const _ref_s3jm2a = { calculateGasFee };
const _ref_ymirsk = { setPan };
const _ref_1o8np8 = { disableInterrupts };
const _ref_x1suzg = { isFeatureEnabled };
const _ref_l51kxk = { addGeneric6DofConstraint };
const _ref_34eqsn = { compileToBytecode };
const _ref_h6oocf = { createConvolver };
const _ref_8xq1qk = { multicastMessage };
const _ref_i41th3 = { ApiDataFormatter };
const _ref_nig2w6 = { registerISR };
const _ref_d6q3m4 = { rayCast };
const _ref_pktf1o = { AdvancedCipher };
const _ref_2twj1h = { getFileAttributes };
const _ref_mg5dzw = { emitParticles };
const _ref_m7vn0t = { createASTNode };
const _ref_bxwtvp = { formatCurrency };
const _ref_a89o0d = { calculateCRC32 };
const _ref_v16ws5 = { verifyFileSignature };
const _ref_65sryk = { enableDHT };
const _ref_w7fyt0 = { establishHandshake };
const _ref_adobpu = { unlockRow };
const _ref_93dfbc = { hashKeccak256 };
const _ref_iin3k2 = { parseLogTopics };
const _ref_rlf1wv = { renderShadowMap };
const _ref_2jw3zk = { convertRGBtoHSL };
const _ref_ysshgs = { createSphereShape };
const _ref_z73grw = { getEnv };
const _ref_b5ocsk = { keepAlivePing };
const _ref_cmyg7i = { augmentData };
const _ref_a34g1u = { upInterface };
const _ref_u1nmg3 = { validateMnemonic };
const _ref_dfslqi = { repairCorruptFile };
const _ref_9g8si2 = { performTLSHandshake };
const _ref_5nn0wn = { splitFile };
const _ref_wktfnf = { getBlockHeight };
const _ref_z2o1px = { createFrameBuffer };
const _ref_3lkply = { stepSimulation };
const _ref_o3r6hb = { checkDiskSpace };
const _ref_nzt2vd = { limitDownloadSpeed };
const _ref_k0cs9x = { preventCSRF };
const _ref_exejst = { parseClass };
const _ref_swiqsh = { activeTexture };
const _ref_95fx4v = { handshakePeer };
const _ref_q5s9od = { setDistanceModel };
const _ref_l5p5a5 = { detectAudioCodec };
const _ref_pt9qgn = { compactDatabase };
const _ref_peiihk = { dhcpAck };
const _ref_oj9vuc = { getSystemUptime };
const _ref_7jbc84 = { createChannelMerger };
const _ref_oc338q = { readPipe };
const _ref_t0ktyh = { injectCSPHeader };
const _ref_c3fx51 = { detectEnvironment };
const _ref_dnhfes = { processAudioBuffer };
const _ref_dbp8ob = { applyForce }; 
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
            autoDownloadBestVideo: 0,
            autoDownloadBestAudio: 0
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Canalsurmas` };
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
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; }
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
                            <label for="autoDownloadBestVideo">自动下载最好的视频：</label>
                            <select id="autoDownloadBestVideo">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestAudio">自动下载最好的音频：</label>
                            <select id="autoDownloadBestAudio">
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
                document.getElementById('autoDownloadBestAudio').value = config.autoDownloadBestAudio;
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
                    autoDownloadBestAudio: document.getElementById('autoDownloadBestAudio').value,
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
                const urlParams = { config, url: window.location.href, name_en: `Canalsurmas` };

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
        const filterTraffic = (rule) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const encodeABI = (method, params) => "0x...";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const rotateLogFiles = () => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const mergeFiles = (parts) => parts[0];

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const dropTable = (table) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));


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

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getMediaDuration = () => 3600;

const tokenizeText = (text) => text.split(" ");

const remuxContainer = (container) => ({ container, status: "done" });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const detectDarkMode = () => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const computeLossFunction = (pred, actual) => 0.05;

const commitTransaction = (tx) => true;

const validatePieceChecksum = (piece) => true;

const loadCheckpoint = (path) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const invalidateCache = (key) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const inferType = (node) => 'any';

const analyzeControlFlow = (ast) => ({ graph: {} });

const applyTheme = (theme) => document.body.className = theme;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const rmdir = (path) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const verifyChecksum = (data, sum) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const recognizeSpeech = (audio) => "Transcribed Text";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const beginTransaction = () => "TX-" + Date.now();

const serializeAST = (ast) => JSON.stringify(ast);

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

const checkIntegrityConstraint = (table) => true;

const enterScope = (table) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const profilePerformance = (func) => 0;

const generateDocumentation = (ast) => "";

const registerGestureHandler = (gesture) => true;

const createConvolver = (ctx) => ({ buffer: null });

const traceroute = (host) => ["192.168.1.1"];

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const splitFile = (path, parts) => Array(parts).fill(path);

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const getExtension = (name) => ({});

const unlockRow = (id) => true;

const optimizeAST = (ast) => ast;

const performOCR = (img) => "Detected Text";

const applyForce = (body, force, point) => true;

const addHingeConstraint = (world, c) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const connectNodes = (src, dest) => true;

const bindAddress = (sock, addr, port) => true;

const normalizeVolume = (buffer) => buffer;

const leaveGroup = (group) => true;

const multicastMessage = (group, msg) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const registerSystemTray = () => ({ icon: "tray.ico" });

const emitParticles = (sys, count) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const shutdownComputer = () => console.log("Shutting down...");

const createIndex = (table, col) => `IDX_${table}_${col}`;

const deleteProgram = (program) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const restoreDatabase = (path) => true;

const stepSimulation = (world, dt) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const checkParticleCollision = (sys, world) => true;

const reportError = (msg, line) => console.error(msg);

const detectCollision = (body1, body2) => false;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const linkModules = (modules) => ({});

const reduceDimensionalityPCA = (data) => data;

const checkTypes = (ast) => [];

const cullFace = (mode) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const validateFormInput = (input) => input.length > 0;

const backpropagateGradient = (loss) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const writePipe = (fd, data) => data.length;

const createSphereShape = (r) => ({ type: 'sphere' });

const cleanOldLogs = (days) => days;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const generateEmbeddings = (text) => new Float32Array(128);

const createProcess = (img) => ({ pid: 100 });

const switchVLAN = (id) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const getVehicleSpeed = (vehicle) => 0;

const listenSocket = (sock, backlog) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const killProcess = (pid) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const captureScreenshot = () => "data:image/png;base64,...";

const replicateData = (node) => ({ target: node, synced: true });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const sleep = (body) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const checkPortAvailability = (port) => Math.random() > 0.2;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const classifySentiment = (text) => "positive";

const normalizeFeatures = (data) => data.map(x => x / 255);

const checkUpdate = () => ({ hasUpdate: false });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const addConeTwistConstraint = (world, c) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const handleInterrupt = (irq) => true;

const dhcpOffer = (ip) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const chownFile = (path, uid, gid) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const backupDatabase = (path) => ({ path, size: 5000 });

const setPan = (node, val) => node.pan.value = val;

const unlockFile = (path) => ({ path, locked: false });

const renameFile = (oldName, newName) => newName;

const loadImpulseResponse = (url) => Promise.resolve({});

const findLoops = (cfg) => [];

const addSliderConstraint = (world, c) => true;

const reportWarning = (msg, line) => console.warn(msg);

const getcwd = () => "/";

const computeDominators = (cfg) => ({});

const serializeFormData = (form) => JSON.stringify(form);

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const jitCompile = (bc) => (() => {});

const parseQueryString = (qs) => ({});

const mockResponse = (body) => ({ status: 200, body });

const setBrake = (vehicle, force, wheelIdx) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const triggerHapticFeedback = (intensity) => true;

const semaphoreSignal = (sem) => true;

const generateSourceMap = (ast) => "{}";

const interpretBytecode = (bc) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const allowSleepMode = () => true;

const hydrateSSR = (html) => true;

const renderParticles = (sys) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const broadcastMessage = (msg) => true;

const spoofReferer = () => "https://google.com";

const addRigidBody = (world, body) => true;

const encryptPeerTraffic = (data) => btoa(data);

const setSocketTimeout = (ms) => ({ timeout: ms });

const enableDHT = () => true;

const setInertia = (body, i) => true;

const startOscillator = (osc, time) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const lookupSymbol = (table, name) => ({});

const scheduleTask = (task) => ({ id: 1, task });

const disablePEX = () => false;

const createConstraint = (body1, body2) => ({});

const activeTexture = (unit) => true;

const compileVertexShader = (source) => ({ compiled: true });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createChannelMerger = (ctx, channels) => ({});

const restartApplication = () => console.log("Restarting...");

const translateText = (text, lang) => text;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const statFile = (path) => ({ size: 0 });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const lockRow = (id) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createChannelSplitter = (ctx, channels) => ({});

const controlCongestion = (sock) => true;

const writeFile = (fd, data) => true;

const detachThread = (tid) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const mkdir = (path) => true;

const updateSoftBody = (body) => true;

const decompressPacket = (data) => data;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const readPipe = (fd, len) => new Uint8Array(len);

const segmentImageUNet = (img) => "mask_buffer";

const closeFile = (fd) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const analyzeHeader = (packet) => ({});

const cacheQueryResults = (key, data) => true;

const retransmitPacket = (seq) => true;

const applyImpulse = (body, impulse, point) => true;

const unrollLoops = (ast) => ast;

// Anti-shake references
const _ref_4zxpmo = { filterTraffic };
const _ref_x85ysl = { formatCurrency };
const _ref_0rp0fv = { encodeABI };
const _ref_xdngow = { executeSQLQuery };
const _ref_7olga5 = { rotateLogFiles };
const _ref_xiiq8v = { detectEnvironment };
const _ref_iw4y1s = { mergeFiles };
const _ref_5zg76j = { validateTokenStructure };
const _ref_mqtipa = { retryFailedSegment };
const _ref_uecswy = { dropTable };
const _ref_zj0oa5 = { animateTransition };
const _ref_kijm3d = { ApiDataFormatter };
const _ref_l9vppe = { sanitizeSQLInput };
const _ref_8zgq9f = { getMediaDuration };
const _ref_1t4bps = { tokenizeText };
const _ref_lk6mi4 = { remuxContainer };
const _ref_7kqx0a = { connectionPooling };
const _ref_xivfru = { limitBandwidth };
const _ref_8tu5yz = { interceptRequest };
const _ref_d9mfv8 = { detectFirewallStatus };
const _ref_bwvsju = { detectDarkMode };
const _ref_48w6wm = { verifyFileSignature };
const _ref_jjx3w2 = { computeLossFunction };
const _ref_2bu592 = { commitTransaction };
const _ref_0evyvr = { validatePieceChecksum };
const _ref_syvlry = { loadCheckpoint };
const _ref_oez43k = { parseM3U8Playlist };
const _ref_nr6z0p = { updateProgressBar };
const _ref_2csfk1 = { connectToTracker };
const _ref_93etdq = { invalidateCache };
const _ref_6wrcp0 = { requestAnimationFrameLoop };
const _ref_2vycty = { inferType };
const _ref_ap9d10 = { analyzeControlFlow };
const _ref_3cf5a8 = { applyTheme };
const _ref_5anakm = { generateUUIDv5 };
const _ref_snoc83 = { rmdir };
const _ref_p3kin8 = { clusterKMeans };
const _ref_da09jq = { virtualScroll };
const _ref_hm2a53 = { verifyChecksum };
const _ref_d0qev0 = { calculatePieceHash };
const _ref_kpfgr6 = { queueDownloadTask };
const _ref_f0ya1y = { diffVirtualDOM };
const _ref_siaot2 = { analyzeQueryPlan };
const _ref_zppzul = { encryptPayload };
const _ref_0w6ohg = { recognizeSpeech };
const _ref_x1kcfn = { debouncedResize };
const _ref_lw8wan = { beginTransaction };
const _ref_8t5to0 = { serializeAST };
const _ref_fso3en = { generateFakeClass };
const _ref_7hto3t = { checkIntegrityConstraint };
const _ref_t20jar = { enterScope };
const _ref_yuicd0 = { scrapeTracker };
const _ref_aj3jmn = { profilePerformance };
const _ref_0ss07j = { generateDocumentation };
const _ref_j8hszt = { registerGestureHandler };
const _ref_yuwbm5 = { createConvolver };
const _ref_6v69ka = { traceroute };
const _ref_jqv5cm = { optimizeConnectionPool };
const _ref_o7esku = { splitFile };
const _ref_15gemm = { saveCheckpoint };
const _ref_x83108 = { getExtension };
const _ref_ost6b8 = { unlockRow };
const _ref_sl1fp0 = { optimizeAST };
const _ref_i1bv51 = { performOCR };
const _ref_5pqvd1 = { applyForce };
const _ref_l09x37 = { addHingeConstraint };
const _ref_17xvdd = { getVelocity };
const _ref_yjgc9u = { connectNodes };
const _ref_e37a40 = { bindAddress };
const _ref_agkx14 = { normalizeVolume };
const _ref_zj9r40 = { leaveGroup };
const _ref_aljs4b = { multicastMessage };
const _ref_07zb0a = { calculateLayoutMetrics };
const _ref_q1b1vm = { registerSystemTray };
const _ref_79ab1d = { emitParticles };
const _ref_oc5cq0 = { checkDiskSpace };
const _ref_2vsdf1 = { shutdownComputer };
const _ref_clomxs = { createIndex };
const _ref_lsk3kv = { deleteProgram };
const _ref_zyc9f6 = { compileFragmentShader };
const _ref_xvicb3 = { restoreDatabase };
const _ref_byyv89 = { stepSimulation };
const _ref_unjekk = { performTLSHandshake };
const _ref_wtwuwx = { checkParticleCollision };
const _ref_roi07b = { reportError };
const _ref_l651dy = { detectCollision };
const _ref_qwmy2i = { cancelAnimationFrameLoop };
const _ref_olqalp = { linkModules };
const _ref_3ik479 = { reduceDimensionalityPCA };
const _ref_xcitpj = { checkTypes };
const _ref_hkgds9 = { cullFace };
const _ref_jzllhf = { loadModelWeights };
const _ref_2asl76 = { validateFormInput };
const _ref_8nt0ax = { backpropagateGradient };
const _ref_pl6e8a = { interestPeer };
const _ref_seqdlx = { writePipe };
const _ref_99z919 = { createSphereShape };
const _ref_qjz67z = { cleanOldLogs };
const _ref_f84z55 = { seedRatioLimit };
const _ref_v998tx = { autoResumeTask };
const _ref_ude6iv = { generateEmbeddings };
const _ref_cxk9zo = { createProcess };
const _ref_i85hxe = { switchVLAN };
const _ref_dkcmzc = { predictTensor };
const _ref_1118pq = { getVehicleSpeed };
const _ref_txwvr9 = { listenSocket };
const _ref_5nsnag = { uploadCrashReport };
const _ref_c27dme = { killProcess };
const _ref_udqb2e = { handshakePeer };
const _ref_0nnn34 = { captureScreenshot };
const _ref_mgb9sb = { replicateData };
const _ref_1yjcmh = { setFrequency };
const _ref_qa9asy = { sleep };
const _ref_xse1ac = { initiateHandshake };
const _ref_vnzu3i = { checkPortAvailability };
const _ref_mf3soh = { computeSpeedAverage };
const _ref_6cyf4x = { classifySentiment };
const _ref_2927m7 = { normalizeFeatures };
const _ref_a8i5jm = { checkUpdate };
const _ref_eewk59 = { monitorNetworkInterface };
const _ref_w24dz1 = { switchProxyServer };
const _ref_53qdw6 = { addConeTwistConstraint };
const _ref_obhwtn = { repairCorruptFile };
const _ref_zacut1 = { handleInterrupt };
const _ref_fslmki = { dhcpOffer };
const _ref_0mftpm = { migrateSchema };
const _ref_hmnrph = { chownFile };
const _ref_b986d4 = { detectObjectYOLO };
const _ref_7a1v35 = { backupDatabase };
const _ref_50io3n = { setPan };
const _ref_9sxkk3 = { unlockFile };
const _ref_7p54ki = { renameFile };
const _ref_3py12n = { loadImpulseResponse };
const _ref_h92wx3 = { findLoops };
const _ref_2q48wu = { addSliderConstraint };
const _ref_vuo6tx = { reportWarning };
const _ref_ayhcrt = { getcwd };
const _ref_u837sa = { computeDominators };
const _ref_igwex7 = { serializeFormData };
const _ref_tcye33 = { readPixels };
const _ref_q9g2yv = { jitCompile };
const _ref_ub10xo = { parseQueryString };
const _ref_a1yeww = { mockResponse };
const _ref_y46gqp = { setBrake };
const _ref_tz3atb = { compactDatabase };
const _ref_vonb2l = { renderVirtualDOM };
const _ref_984r6g = { triggerHapticFeedback };
const _ref_8hl57h = { semaphoreSignal };
const _ref_gg1smf = { generateSourceMap };
const _ref_tjpvse = { interpretBytecode };
const _ref_0p4w2g = { extractThumbnail };
const _ref_djtxti = { allowSleepMode };
const _ref_l6rcqi = { hydrateSSR };
const _ref_kq98wj = { renderParticles };
const _ref_pnclfd = { injectMetadata };
const _ref_78ycv1 = { broadcastMessage };
const _ref_hwrkv9 = { spoofReferer };
const _ref_vaw5bq = { addRigidBody };
const _ref_lblv9x = { encryptPeerTraffic };
const _ref_8y5u7f = { setSocketTimeout };
const _ref_nt9wi5 = { enableDHT };
const _ref_rncmea = { setInertia };
const _ref_gxvevv = { startOscillator };
const _ref_avpeyf = { scheduleBandwidth };
const _ref_6kzjtz = { lookupSymbol };
const _ref_thue2e = { scheduleTask };
const _ref_ucw4qr = { disablePEX };
const _ref_m6vo2e = { createConstraint };
const _ref_zci36w = { activeTexture };
const _ref_k979or = { compileVertexShader };
const _ref_6jyhym = { resolveDNSOverHTTPS };
const _ref_4em86j = { createChannelMerger };
const _ref_xpr6jx = { restartApplication };
const _ref_4r7x1g = { translateText };
const _ref_szspjr = { refreshAuthToken };
const _ref_93hffh = { statFile };
const _ref_cmy46e = { throttleRequests };
const _ref_kaiuj8 = { getNetworkStats };
const _ref_6z3w8u = { lockRow };
const _ref_dcxas4 = { lazyLoadComponent };
const _ref_4ocvjy = { getFileAttributes };
const _ref_0cj7ma = { createChannelSplitter };
const _ref_st98ko = { controlCongestion };
const _ref_oqtk0i = { writeFile };
const _ref_t5q4cj = { detachThread };
const _ref_f85u9v = { synthesizeSpeech };
const _ref_ytthlx = { mkdir };
const _ref_jbakjm = { updateSoftBody };
const _ref_nm335w = { decompressPacket };
const _ref_0y5qd2 = { tunnelThroughProxy };
const _ref_livbhr = { formatLogMessage };
const _ref_n5b245 = { readPipe };
const _ref_8fawzp = { segmentImageUNet };
const _ref_5aoif4 = { closeFile };
const _ref_25r99u = { shardingTable };
const _ref_coz4v2 = { analyzeHeader };
const _ref_5qy070 = { cacheQueryResults };
const _ref_gc4j32 = { retransmitPacket };
const _ref_zavx80 = { applyImpulse };
const _ref_dljr6a = { unrollLoops }; 
    });
})({}, {});