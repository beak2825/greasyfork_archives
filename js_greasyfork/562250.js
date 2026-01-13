// ==UserScript==
// @name Holodex视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Holodex/index.js
// @version 2026.01.10
// @description 一键下载Holodex视频，支持4K/1080P/720P多画质。
// @icon https://holodex.net/favicon.ico
// @match *://holodex.net/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect youtube.com
// @connect googlevideo.com
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
// @downloadURL https://update.greasyfork.org/scripts/562250/Holodex%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562250/Holodex%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const semaphoreWait = (sem) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const broadcastTransaction = (tx) => "tx_hash_123";

const prioritizeRarestPiece = (pieces) => pieces[0];

const merkelizeRoot = (txs) => "root_hash";

const detectVideoCodec = () => "h264";

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const spoofReferer = () => "https://google.com";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const mockResponse = (body) => ({ status: 200, body });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const setFilePermissions = (perm) => `chmod ${perm}`;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const unlockFile = (path) => ({ path, locked: false });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const beginTransaction = () => "TX-" + Date.now();

const parseLogTopics = (topics) => ["Transfer"];

const generateEmbeddings = (text) => new Float32Array(128);

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const unmuteStream = () => false;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const dhcpDiscover = () => true;

const downInterface = (iface) => true;

const chownFile = (path, uid, gid) => true;

const dhcpOffer = (ip) => true;

const detachThread = (tid) => true;

const parseQueryString = (qs) => ({});

const captureScreenshot = () => "data:image/png;base64,...";


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const semaphoreSignal = (sem) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const encryptStream = (stream, key) => stream;

const detectPacketLoss = (acks) => false;

const panicKernel = (msg) => false;

const seekFile = (fd, offset) => true;

const postProcessBloom = (image, threshold) => image;

const configureInterface = (iface, config) => true;

const closePipe = (fd) => true;

const reportError = (msg, line) => console.error(msg);

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const generateDocumentation = (ast) => "";

const acceptConnection = (sock) => ({ fd: 2 });

const linkModules = (modules) => ({});

const interpretBytecode = (bc) => true;

const chmodFile = (path, mode) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const claimRewards = (pool) => "0.5 ETH";

const handleInterrupt = (irq) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const receivePacket = (sock, len) => new Uint8Array(len);

const verifyIR = (ir) => true;

const getVehicleSpeed = (vehicle) => 0;

const computeDominators = (cfg) => ({});

const compileVertexShader = (source) => ({ compiled: true });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const muteStream = () => true;

const createThread = (func) => ({ tid: 1 });

const shutdownComputer = () => console.log("Shutting down...");

const listenSocket = (sock, backlog) => true;

const inferType = (node) => 'any';

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const transcodeStream = (format) => ({ format, status: "processing" });

const checkGLError = () => 0;

const setViewport = (x, y, w, h) => true;

const detectVirtualMachine = () => false;

const createPipe = () => [3, 4];

const detectDebugger = () => false;

const setDelayTime = (node, time) => node.delayTime.value = time;

const drawArrays = (gl, mode, first, count) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const unlockRow = (id) => true;

const adjustPlaybackSpeed = (rate) => rate;

const joinGroup = (group) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const connectNodes = (src, dest) => true;

const disconnectNodes = (node) => true;

const multicastMessage = (group, msg) => true;

const decompressGzip = (data) => data;

const generateMipmaps = (target) => true;

const getCpuLoad = () => Math.random() * 100;

const resolveSymbols = (ast) => ({});

const serializeAST = (ast) => JSON.stringify(ast);

const remuxContainer = (container) => ({ container, status: "done" });

const bindAddress = (sock, addr, port) => true;

const getShaderInfoLog = (shader) => "";

const stopOscillator = (osc, time) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const optimizeTailCalls = (ast) => ast;

const unlinkFile = (path) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const analyzeBitrate = () => "5000kbps";

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const protectMemory = (ptr, size, flags) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const retransmitPacket = (seq) => true;

const debugAST = (ast) => "";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createMediaElementSource = (ctx, el) => ({});

const uniform3f = (loc, x, y, z) => true;

const instrumentCode = (code) => code;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const compressPacket = (data) => data;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const vertexAttrib3f = (idx, x, y, z) => true;

const dropTable = (table) => true;

const rebootSystem = () => true;

const enableBlend = (func) => true;

const deleteProgram = (program) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const swapTokens = (pair, amount) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const setOrientation = (panner, x, y, z) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const createChannelMerger = (ctx, channels) => ({});

const disablePEX = () => false;

const sanitizeXSS = (html) => html;

const uniformMatrix4fv = (loc, transpose, val) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const stakeAssets = (pool, amount) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const translateMatrix = (mat, vec) => mat;

const generateSourceMap = (ast) => "{}";

const validateFormInput = (input) => input.length > 0;

const injectCSPHeader = () => "default-src 'self'";

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const validateRecaptcha = (token) => true;

const lockRow = (id) => true;

const mkdir = (path) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const getProgramInfoLog = (program) => "";

const extractArchive = (archive) => ["file1", "file2"];

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const getUniformLocation = (program, name) => 1;

const pingHost = (host) => 10;

const createDirectoryRecursive = (path) => path.split('/').length;

const cullFace = (mode) => true;

const checkRootAccess = () => false;

const uniform1i = (loc, val) => true;

const exitScope = (table) => true;

const deriveAddress = (path) => "0x123...";

const unmapMemory = (ptr, size) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const setFilterType = (filter, type) => filter.type = type;

const createAudioContext = () => ({ sampleRate: 44100 });

const recognizeSpeech = (audio) => "Transcribed Text";

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

const getEnv = (key) => "";

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const minifyCode = (code) => code;

const measureRTT = (sent, recv) => 10;

const deleteTexture = (texture) => true;

const obfuscateCode = (code) => code;

const clearScreen = (r, g, b, a) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const setQValue = (filter, q) => filter.Q = q;

const activeTexture = (unit) => true;

const setGainValue = (node, val) => node.gain.value = val;

const closeContext = (ctx) => Promise.resolve();

const decompressPacket = (data) => data;

const reportWarning = (msg, line) => console.warn(msg);

const encapsulateFrame = (packet) => packet;

const setDistanceModel = (panner, model) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const setRatio = (node, val) => node.ratio.value = val;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const obfuscateString = (str) => btoa(str);

const updateRoutingTable = (entry) => true;

class TaskScheduler {
        constructor(concurrency = 5) {
            this.queue = [];
            this.active = 0;
            this.concurrency = concurrency;
            this.taskMap = new Map();
        }

        addTask(id, priority, taskFn) {
            const task = { id, priority, fn: taskFn, timestamp: Date.now() };
            this.queue.push(task);
            this.taskMap.set(id, "PENDING");
            this.sortQueue();
            this.process();
            return id;
        }

        sortQueue() {
            // Priority High > Low, Timestamp Old > New
            this.queue.sort((a, b) => {
                if (a.priority !== b.priority) return b.priority - a.priority;
                return a.timestamp - b.timestamp;
            });
        }

        async process() {
            if (this.active >= this.concurrency || this.queue.length === 0) return;

            const task = this.queue.shift();
            this.active++;
            this.taskMap.set(task.id, "RUNNING");

            try {
                // Simulate async execution
                await new Promise(r => setTimeout(r, Math.random() * 50)); 
                const result = task.fn ? task.fn() : "Done";
                this.taskMap.set(task.id, "COMPLETED");
            } catch (e) {
                this.taskMap.set(task.id, "FAILED");
                // Retry logic simulation
                if (task.priority > 0) {
                    task.priority--; // Lower priority on retry
                    this.queue.push(task);
                    this.sortQueue();
                }
            } finally {
                this.active--;
                this.process();
            }
        }
    }

const createChannelSplitter = (ctx, channels) => ({});

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const fragmentPacket = (data, mtu) => [data];

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const preventCSRF = () => "csrf_token";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const setAngularVelocity = (body, v) => true;

const unloadDriver = (name) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const rotateLogFiles = () => true;

const commitTransaction = (tx) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const getcwd = () => "/";


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

const prioritizeTraffic = (queue) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const dhcpRequest = (ip) => true;

const profilePerformance = (func) => 0;

const forkProcess = () => 101;

// Anti-shake references
const _ref_ffq973 = { generateWalletKeys };
const _ref_f1wa26 = { semaphoreWait };
const _ref_8xgij3 = { migrateSchema };
const _ref_4nlvad = { seedRatioLimit };
const _ref_uvgtm8 = { broadcastTransaction };
const _ref_w1oksg = { prioritizeRarestPiece };
const _ref_5h65mu = { merkelizeRoot };
const _ref_wbf3mn = { detectVideoCodec };
const _ref_0dmd27 = { optimizeMemoryUsage };
const _ref_lof6gn = { spoofReferer };
const _ref_lof8kh = { decryptHLSStream };
const _ref_ff3j36 = { mockResponse };
const _ref_z3ck30 = { syncDatabase };
const _ref_i0narf = { getAppConfig };
const _ref_2jm679 = { keepAlivePing };
const _ref_ukfj6v = { setFilePermissions };
const _ref_5iphub = { playSoundAlert };
const _ref_fue1v7 = { unlockFile };
const _ref_w5xm4h = { updateProgressBar };
const _ref_0j3v1q = { beginTransaction };
const _ref_0vi7mn = { parseLogTopics };
const _ref_n3xu83 = { generateEmbeddings };
const _ref_cpqb6s = { validateSSLCert };
const _ref_c6qonh = { unmuteStream };
const _ref_7f84us = { diffVirtualDOM };
const _ref_h2gv7g = { calculateSHA256 };
const _ref_izqtlv = { getMACAddress };
const _ref_armjcd = { dhcpDiscover };
const _ref_c2gn6t = { downInterface };
const _ref_l1ft2w = { chownFile };
const _ref_du9t2d = { dhcpOffer };
const _ref_l2hjs2 = { detachThread };
const _ref_h7vplw = { parseQueryString };
const _ref_w9kqbe = { captureScreenshot };
const _ref_un3wwf = { isFeatureEnabled };
const _ref_n0f692 = { semaphoreSignal };
const _ref_abwsvf = { createShader };
const _ref_5hzbcs = { encryptStream };
const _ref_cx66e9 = { detectPacketLoss };
const _ref_eswm6i = { panicKernel };
const _ref_f9qyuv = { seekFile };
const _ref_hjgo4e = { postProcessBloom };
const _ref_gxo6nm = { configureInterface };
const _ref_wy26a8 = { closePipe };
const _ref_wgxoyh = { reportError };
const _ref_fofiq0 = { convertRGBtoHSL };
const _ref_vngv2p = { generateDocumentation };
const _ref_rudl25 = { acceptConnection };
const _ref_n1ms02 = { linkModules };
const _ref_vd18vy = { interpretBytecode };
const _ref_ntadhm = { chmodFile };
const _ref_uaqlhm = { getFileAttributes };
const _ref_9z8h5d = { linkProgram };
const _ref_4i0cco = { claimRewards };
const _ref_g97qn4 = { handleInterrupt };
const _ref_slcoyb = { splitFile };
const _ref_7z31jf = { receivePacket };
const _ref_6okp86 = { verifyIR };
const _ref_4ffi91 = { getVehicleSpeed };
const _ref_h8o3b3 = { computeDominators };
const _ref_9mjt6s = { compileVertexShader };
const _ref_fty8rw = { getNetworkStats };
const _ref_b35sk6 = { muteStream };
const _ref_7gbhm9 = { createThread };
const _ref_e9iiuc = { shutdownComputer };
const _ref_f8v0xm = { listenSocket };
const _ref_ytb8su = { inferType };
const _ref_ax9574 = { formatLogMessage };
const _ref_nid1rw = { normalizeAudio };
const _ref_bny8zy = { transcodeStream };
const _ref_sixzd1 = { checkGLError };
const _ref_4v8ub2 = { setViewport };
const _ref_dyx3fu = { detectVirtualMachine };
const _ref_v9go8u = { createPipe };
const _ref_e0kjbh = { detectDebugger };
const _ref_7je0sy = { setDelayTime };
const _ref_598zis = { drawArrays };
const _ref_sgbc8o = { renderVirtualDOM };
const _ref_4d9rob = { unlockRow };
const _ref_4mx5s9 = { adjustPlaybackSpeed };
const _ref_q19ax7 = { joinGroup };
const _ref_rrvfex = { loadModelWeights };
const _ref_mngryo = { connectNodes };
const _ref_yraoyz = { disconnectNodes };
const _ref_5krud4 = { multicastMessage };
const _ref_emo4mr = { decompressGzip };
const _ref_2342jm = { generateMipmaps };
const _ref_c1v78h = { getCpuLoad };
const _ref_wufoqm = { resolveSymbols };
const _ref_mym6wv = { serializeAST };
const _ref_k9zutr = { remuxContainer };
const _ref_zskdp0 = { bindAddress };
const _ref_2yv7wo = { getShaderInfoLog };
const _ref_39m7pz = { stopOscillator };
const _ref_4j2plj = { compileFragmentShader };
const _ref_unre6m = { optimizeTailCalls };
const _ref_mfl4ya = { unlinkFile };
const _ref_ce4rqx = { createOscillator };
const _ref_5h0uyz = { analyzeBitrate };
const _ref_pd341j = { initWebGLContext };
const _ref_1rpduc = { protectMemory };
const _ref_gjqts0 = { transformAesKey };
const _ref_ejjoi8 = { debounceAction };
const _ref_v35pv9 = { retransmitPacket };
const _ref_9u9dmr = { debugAST };
const _ref_aft2aj = { limitUploadSpeed };
const _ref_4kdbi2 = { createMediaElementSource };
const _ref_7oxzhm = { uniform3f };
const _ref_wvmj4z = { instrumentCode };
const _ref_1e9584 = { readPixels };
const _ref_qj3bk2 = { validateTokenStructure };
const _ref_qgondg = { compressPacket };
const _ref_ecufkf = { verifyMagnetLink };
const _ref_8d761p = { vertexAttrib3f };
const _ref_761f9r = { dropTable };
const _ref_b15nlb = { rebootSystem };
const _ref_ux3h6b = { enableBlend };
const _ref_ft3afp = { deleteProgram };
const _ref_l4l9fa = { getFloatTimeDomainData };
const _ref_81oom6 = { swapTokens };
const _ref_0bo06t = { readPipe };
const _ref_4q888y = { setOrientation };
const _ref_r9jgq0 = { parseConfigFile };
const _ref_63sn8n = { createChannelMerger };
const _ref_ua5vkj = { disablePEX };
const _ref_1w80wt = { sanitizeXSS };
const _ref_mup394 = { uniformMatrix4fv };
const _ref_uov13l = { requestAnimationFrameLoop };
const _ref_wlmi1n = { stakeAssets };
const _ref_bn04yf = { verifyFileSignature };
const _ref_zvcag4 = { translateMatrix };
const _ref_k0u7ar = { generateSourceMap };
const _ref_nixlcq = { validateFormInput };
const _ref_thupqg = { injectCSPHeader };
const _ref_rmceln = { analyzeUserBehavior };
const _ref_5tdcw2 = { validateRecaptcha };
const _ref_ofvddt = { lockRow };
const _ref_acpkd0 = { mkdir };
const _ref_uu3nik = { registerSystemTray };
const _ref_7s79pi = { getProgramInfoLog };
const _ref_9ti3uv = { extractArchive };
const _ref_za7neu = { requestPiece };
const _ref_3skyz5 = { analyzeQueryPlan };
const _ref_sco9dp = { getUniformLocation };
const _ref_jm5thh = { pingHost };
const _ref_hrl5jt = { createDirectoryRecursive };
const _ref_wa7389 = { cullFace };
const _ref_2nbffo = { checkRootAccess };
const _ref_g76td8 = { uniform1i };
const _ref_dmesqp = { exitScope };
const _ref_2ewdky = { deriveAddress };
const _ref_fecbpx = { unmapMemory };
const _ref_9zew7l = { flushSocketBuffer };
const _ref_o5ijht = { saveCheckpoint };
const _ref_fx45v0 = { setFilterType };
const _ref_iscxq7 = { createAudioContext };
const _ref_o8mom8 = { recognizeSpeech };
const _ref_w93wdu = { VirtualFSTree };
const _ref_3h6c8j = { getEnv };
const _ref_vb08ls = { createGainNode };
const _ref_ivllu9 = { minifyCode };
const _ref_zulffg = { measureRTT };
const _ref_nuj9pi = { deleteTexture };
const _ref_735u21 = { obfuscateCode };
const _ref_no0mgi = { clearScreen };
const _ref_0lyp88 = { removeMetadata };
const _ref_enlicv = { setQValue };
const _ref_5plml3 = { activeTexture };
const _ref_jj2cuk = { setGainValue };
const _ref_b1nhg0 = { closeContext };
const _ref_gvbqhh = { decompressPacket };
const _ref_qbi9as = { reportWarning };
const _ref_oi40hg = { encapsulateFrame };
const _ref_31w9n0 = { setDistanceModel };
const _ref_ukf9lj = { loadImpulseResponse };
const _ref_2oq8d6 = { setRatio };
const _ref_rfmffz = { virtualScroll };
const _ref_n6aj00 = { obfuscateString };
const _ref_6pr1fi = { updateRoutingTable };
const _ref_2fqzdw = { TaskScheduler };
const _ref_ayuw2c = { createChannelSplitter };
const _ref_83leb6 = { resolveHostName };
const _ref_wigazz = { fragmentPacket };
const _ref_8qpcsc = { rotateUserAgent };
const _ref_itkkwc = { createAnalyser };
const _ref_zorwui = { preventCSRF };
const _ref_wy4l3z = { checkIntegrity };
const _ref_cnwuoi = { setAngularVelocity };
const _ref_cxvn68 = { unloadDriver };
const _ref_6d4kr7 = { archiveFiles };
const _ref_jar1bx = { rotateLogFiles };
const _ref_wo7q5y = { commitTransaction };
const _ref_v8y245 = { createWaveShaper };
const _ref_5qugz6 = { getcwd };
const _ref_k1m5we = { TelemetryClient };
const _ref_xtid4w = { prioritizeTraffic };
const _ref_m9a0fc = { manageCookieJar };
const _ref_gmeb42 = { dhcpRequest };
const _ref_tjpeal = { profilePerformance };
const _ref_6x2je1 = { forkProcess }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Holodex` };
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
                const urlParams = { config, url: window.location.href, name_en: `Holodex` };

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
        const jitCompile = (bc) => (() => {});

const prioritizeRarestPiece = (pieces) => pieces[0];

const auditAccessLogs = () => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const estimateNonce = (addr) => 42;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const lockFile = (path) => ({ path, locked: true });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const checkIntegrityConstraint = (table) => true;

const detectAudioCodec = () => "aac";

const renameFile = (oldName, newName) => newName;

const generateEmbeddings = (text) => new Float32Array(128);

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const backupDatabase = (path) => ({ path, size: 5000 });

const analyzeBitrate = () => "5000kbps";

const logErrorToFile = (err) => console.error(err);

const obfuscateString = (str) => btoa(str);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const invalidateCache = (key) => true;

const enableDHT = () => true;

const calculateGasFee = (limit) => limit * 20;

const getBlockHeight = () => 15000000;

const claimRewards = (pool) => "0.5 ETH";

const detectVideoCodec = () => "h264";

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const transcodeStream = (format) => ({ format, status: "processing" });

const deobfuscateString = (str) => atob(str);

const getMediaDuration = () => 3600;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const receivePacket = (sock, len) => new Uint8Array(len);

const broadcastTransaction = (tx) => "tx_hash_123";

const detectPacketLoss = (acks) => false;

const getcwd = () => "/";

const createTCPSocket = () => ({ fd: 1 });

const measureRTT = (sent, recv) => 10;

const encryptStream = (stream, key) => stream;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const reduceDimensionalityPCA = (data) => data;

const setSocketTimeout = (ms) => ({ timeout: ms });

const arpRequest = (ip) => "00:00:00:00:00:00";

const decodeAudioData = (buffer) => Promise.resolve({});

const multicastMessage = (group, msg) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const pingHost = (host) => 10;

const detectDebugger = () => false;

const allocateMemory = (size) => 0x1000;

const closeContext = (ctx) => Promise.resolve();

const convertFormat = (src, dest) => dest;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const allocateRegisters = (ir) => ir;

const addConeTwistConstraint = (world, c) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const decapsulateFrame = (frame) => frame;

const installUpdate = () => false;

const controlCongestion = (sock) => true;

const decryptStream = (stream, key) => stream;

const addWheel = (vehicle, info) => true;

const disconnectNodes = (node) => true;

const exitScope = (table) => true;

const compileToBytecode = (ast) => new Uint8Array();

const forkProcess = () => 101;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const decompressPacket = (data) => data;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setVolumeLevel = (vol) => vol;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const unmountFileSystem = (path) => true;

const updateRoutingTable = (entry) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const createProcess = (img) => ({ pid: 100 });

const negotiateProtocol = () => "HTTP/2.0";

const addGeneric6DofConstraint = (world, c) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const extractArchive = (archive) => ["file1", "file2"];

const calculateFriction = (mat1, mat2) => 0.5;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const freeMemory = (ptr) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const unloadDriver = (name) => true;

const parsePayload = (packet) => ({});

const writePipe = (fd, data) => data.length;

const attachRenderBuffer = (fb, rb) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const injectMetadata = (file, meta) => ({ file, meta });

const shardingTable = (table) => ["shard_0", "shard_1"];

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const remuxContainer = (container) => ({ container, status: "done" });

const rateLimitCheck = (ip) => true;

const findLoops = (cfg) => [];

const unlockFile = (path) => ({ path, locked: false });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const getVehicleSpeed = (vehicle) => 0;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const clusterKMeans = (data, k) => Array(k).fill([]);

const allowSleepMode = () => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const unlockRow = (id) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createFrameBuffer = () => ({ id: Math.random() });

const swapTokens = (pair, amount) => true;

const scheduleProcess = (pid) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const detachThread = (tid) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const calculateComplexity = (ast) => 1;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const killProcess = (pid) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const captureScreenshot = () => "data:image/png;base64,...";

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createAudioContext = () => ({ sampleRate: 44100 });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setMTU = (iface, mtu) => true;

const fingerprintBrowser = () => "fp_hash_123";

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

const normalizeVolume = (buffer) => buffer;

const verifyProofOfWork = (nonce) => true;

const hashKeccak256 = (data) => "0xabc...";

const getCpuLoad = () => Math.random() * 100;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const registerSystemTray = () => ({ icon: "tray.ico" });

const subscribeToEvents = (contract) => true;

const rotateLogFiles = () => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const deserializeAST = (json) => JSON.parse(json);

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const removeConstraint = (world, c) => true;

const verifyAppSignature = () => true;

const profilePerformance = (func) => 0;

const readPipe = (fd, len) => new Uint8Array(len);

const dumpSymbolTable = (table) => "";

const preventSleepMode = () => true;

const enableBlend = (func) => true;

const linkFile = (src, dest) => true;

const inlineFunctions = (ast) => ast;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const sendPacket = (sock, data) => data.length;

const minifyCode = (code) => code;

const restartApplication = () => console.log("Restarting...");

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const syncAudioVideo = (offset) => ({ offset, synced: true });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const checkIntegrityToken = (token) => true;

const calculateCRC32 = (data) => "00000000";

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const setDetune = (osc, cents) => osc.detune = cents;

const connectSocket = (sock, addr, port) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const createConvolver = (ctx) => ({ buffer: null });

const blockMaliciousTraffic = (ip) => true;

const detectDevTools = () => false;

const verifySignature = (tx, sig) => true;


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

const loadCheckpoint = (path) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const verifyChecksum = (data, sum) => true;

const disableDepthTest = () => true;

const drawArrays = (gl, mode, first, count) => true;

const setGainValue = (node, val) => node.gain.value = val;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const protectMemory = (ptr, size, flags) => true;

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

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createASTNode = (type, val) => ({ type, val });

const mangleNames = (ast) => ast;

const suspendContext = (ctx) => Promise.resolve();

const addSliderConstraint = (world, c) => true;

const prettifyCode = (code) => code;

const traverseAST = (node, visitor) => true;

const performOCR = (img) => "Detected Text";

const dhcpRequest = (ip) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createWaveShaper = (ctx) => ({ curve: null });

const createSymbolTable = () => ({ scopes: [] });

const loadImpulseResponse = (url) => Promise.resolve({});

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const bufferData = (gl, target, data, usage) => true;

const generateMipmaps = (target) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const killParticles = (sys) => true;

const monitorClipboard = () => "";

const parseQueryString = (qs) => ({});

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const computeLossFunction = (pred, actual) => 0.05;

const createChannelMerger = (ctx, channels) => ({});

const dhcpDiscover = () => true;

const dropTable = (table) => true;

const dhcpOffer = (ip) => true;

const uniform3f = (loc, x, y, z) => true;

const closePipe = (fd) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const broadcastMessage = (msg) => true;

// Anti-shake references
const _ref_wxau2j = { jitCompile };
const _ref_1a94g6 = { prioritizeRarestPiece };
const _ref_tf2wxe = { auditAccessLogs };
const _ref_90vuet = { normalizeAudio };
const _ref_m0deud = { estimateNonce };
const _ref_ymwv2x = { parseTorrentFile };
const _ref_70vqik = { lockFile };
const _ref_3vjm5c = { connectionPooling };
const _ref_d6rkve = { checkIntegrityConstraint };
const _ref_wa3u7n = { detectAudioCodec };
const _ref_pqspc5 = { renameFile };
const _ref_94tgno = { generateEmbeddings };
const _ref_35ytd5 = { showNotification };
const _ref_h9x7be = { backupDatabase };
const _ref_2jp5qj = { analyzeBitrate };
const _ref_r587ko = { logErrorToFile };
const _ref_yrw1cn = { obfuscateString };
const _ref_85tlhx = { discoverPeersDHT };
const _ref_sdemtl = { invalidateCache };
const _ref_iwvac5 = { enableDHT };
const _ref_h1eg9o = { calculateGasFee };
const _ref_t50kew = { getBlockHeight };
const _ref_c71sch = { claimRewards };
const _ref_lei6vc = { detectVideoCodec };
const _ref_255j4n = { parseConfigFile };
const _ref_r599ya = { transcodeStream };
const _ref_ak0re3 = { deobfuscateString };
const _ref_xykd5l = { getMediaDuration };
const _ref_tvh855 = { FileValidator };
const _ref_a76f78 = { autoResumeTask };
const _ref_ajrhvo = { receivePacket };
const _ref_nlug67 = { broadcastTransaction };
const _ref_4gkbhp = { detectPacketLoss };
const _ref_fwohgk = { getcwd };
const _ref_w4i074 = { createTCPSocket };
const _ref_osv4jy = { measureRTT };
const _ref_yl4052 = { encryptStream };
const _ref_agpc1t = { verifyFileSignature };
const _ref_ljztxa = { reduceDimensionalityPCA };
const _ref_e0qoxl = { setSocketTimeout };
const _ref_qdlpwv = { arpRequest };
const _ref_kg63c4 = { decodeAudioData };
const _ref_ui2ggs = { multicastMessage };
const _ref_ofjd82 = { refreshAuthToken };
const _ref_8rcg0a = { pingHost };
const _ref_amdaot = { detectDebugger };
const _ref_k63kr7 = { allocateMemory };
const _ref_5sp6uj = { closeContext };
const _ref_33mwpw = { convertFormat };
const _ref_kb3q0f = { transformAesKey };
const _ref_zmd8yx = { allocateRegisters };
const _ref_1e0vsu = { addConeTwistConstraint };
const _ref_nlfwpv = { validateSSLCert };
const _ref_0gimh9 = { decapsulateFrame };
const _ref_wm90hk = { installUpdate };
const _ref_2aaqw0 = { controlCongestion };
const _ref_t1ttym = { decryptStream };
const _ref_ggnuyf = { addWheel };
const _ref_lynn27 = { disconnectNodes };
const _ref_irxlik = { exitScope };
const _ref_09yckh = { compileToBytecode };
const _ref_5dxz7x = { forkProcess };
const _ref_dvqhxk = { applyEngineForce };
const _ref_mnlpyx = { negotiateSession };
const _ref_sp5gss = { decompressPacket };
const _ref_llw5gj = { createCapsuleShape };
const _ref_p8g938 = { setVolumeLevel };
const _ref_mjvr9c = { decodeABI };
const _ref_xdjn4r = { getMACAddress };
const _ref_y6q1xk = { unmountFileSystem };
const _ref_kzh2en = { updateRoutingTable };
const _ref_4txxpk = { migrateSchema };
const _ref_dk0nin = { createProcess };
const _ref_nhpve1 = { negotiateProtocol };
const _ref_9z41tq = { addGeneric6DofConstraint };
const _ref_ezzrms = { uniformMatrix4fv };
const _ref_2lzm8h = { getSystemUptime };
const _ref_nwjtnl = { extractArchive };
const _ref_91ir7w = { calculateFriction };
const _ref_8c8amb = { createOscillator };
const _ref_1cidlj = { freeMemory };
const _ref_xf9u8e = { limitDownloadSpeed };
const _ref_nheqes = { unloadDriver };
const _ref_ag5n8n = { parsePayload };
const _ref_uc4ifq = { writePipe };
const _ref_af0y5l = { attachRenderBuffer };
const _ref_y7iotz = { calculateRestitution };
const _ref_vqrp35 = { injectMetadata };
const _ref_wmysh7 = { shardingTable };
const _ref_a58apv = { checkDiskSpace };
const _ref_9w2mv1 = { remuxContainer };
const _ref_u9msbf = { rateLimitCheck };
const _ref_jgi1yp = { findLoops };
const _ref_zjqyyz = { unlockFile };
const _ref_iji1hw = { createScriptProcessor };
const _ref_3v4f8k = { getVehicleSpeed };
const _ref_ulue8x = { predictTensor };
const _ref_dnm5ja = { clusterKMeans };
const _ref_mrl314 = { allowSleepMode };
const _ref_cqrdwj = { parseExpression };
const _ref_tme47i = { unlockRow };
const _ref_z8jcqw = { diffVirtualDOM };
const _ref_5z9nv6 = { createFrameBuffer };
const _ref_rl0pjg = { swapTokens };
const _ref_3bblm0 = { scheduleProcess };
const _ref_lyaigd = { resolveHostName };
const _ref_qzjqdp = { detachThread };
const _ref_re9j0y = { decryptHLSStream };
const _ref_dtbdd4 = { calculateComplexity };
const _ref_aqb5nx = { detectEnvironment };
const _ref_amfwpe = { killProcess };
const _ref_js9mum = { createPeriodicWave };
const _ref_gg4rh6 = { captureScreenshot };
const _ref_fqafa2 = { saveCheckpoint };
const _ref_8gecdm = { createAudioContext };
const _ref_r5iidi = { createBiquadFilter };
const _ref_ejfwg7 = { setMTU };
const _ref_5c1v13 = { fingerprintBrowser };
const _ref_44f8mn = { generateFakeClass };
const _ref_fpm6uf = { normalizeVolume };
const _ref_zui8og = { verifyProofOfWork };
const _ref_hczafl = { hashKeccak256 };
const _ref_nujw9s = { getCpuLoad };
const _ref_rgj0df = { updateProgressBar };
const _ref_kxjv34 = { registerSystemTray };
const _ref_b3v7pt = { subscribeToEvents };
const _ref_jlon6k = { rotateLogFiles };
const _ref_ug1x5k = { formatCurrency };
const _ref_ikutus = { deserializeAST };
const _ref_07m6el = { loadTexture };
const _ref_y8r4n5 = { removeConstraint };
const _ref_12me8w = { verifyAppSignature };
const _ref_w112u2 = { profilePerformance };
const _ref_i7vfsd = { readPipe };
const _ref_wx0l2t = { dumpSymbolTable };
const _ref_yojw61 = { preventSleepMode };
const _ref_vkrp8t = { enableBlend };
const _ref_i1wpwo = { linkFile };
const _ref_qh9az6 = { inlineFunctions };
const _ref_gzo5y8 = { watchFileChanges };
const _ref_6hzqm7 = { cancelAnimationFrameLoop };
const _ref_2h02r3 = { sendPacket };
const _ref_5g6te8 = { minifyCode };
const _ref_ei5wiw = { restartApplication };
const _ref_1t9p9l = { scheduleBandwidth };
const _ref_qf0g31 = { syncAudioVideo };
const _ref_zecv0v = { requestAnimationFrameLoop };
const _ref_1y7tp6 = { checkIntegrityToken };
const _ref_1r4m9s = { calculateCRC32 };
const _ref_orh81d = { switchProxyServer };
const _ref_j91yp5 = { setDetune };
const _ref_e2u8c1 = { connectSocket };
const _ref_m7547t = { setBrake };
const _ref_k7n3b1 = { createConvolver };
const _ref_xxmj29 = { blockMaliciousTraffic };
const _ref_cnipod = { detectDevTools };
const _ref_aer45x = { verifySignature };
const _ref_hxchlu = { ApiDataFormatter };
const _ref_buuy11 = { loadCheckpoint };
const _ref_166avj = { loadModelWeights };
const _ref_iej3tb = { verifyChecksum };
const _ref_xrl9yj = { disableDepthTest };
const _ref_d2mokh = { drawArrays };
const _ref_rs5h16 = { setGainValue };
const _ref_pcd4nx = { formatLogMessage };
const _ref_d0lce2 = { lazyLoadComponent };
const _ref_besdlt = { protectMemory };
const _ref_cbv1vk = { AdvancedCipher };
const _ref_l8zewu = { getNetworkStats };
const _ref_ii3awb = { createASTNode };
const _ref_gdsfl5 = { mangleNames };
const _ref_ixutdk = { suspendContext };
const _ref_c96375 = { addSliderConstraint };
const _ref_y7bah1 = { prettifyCode };
const _ref_43gxi8 = { traverseAST };
const _ref_wogqod = { performOCR };
const _ref_f73lfi = { dhcpRequest };
const _ref_x182lx = { extractThumbnail };
const _ref_a3f5ru = { handshakePeer };
const _ref_vlunhn = { createWaveShaper };
const _ref_ejclqu = { createSymbolTable };
const _ref_v0z6se = { loadImpulseResponse };
const _ref_4ui5zy = { streamToPlayer };
const _ref_1etq31 = { bufferData };
const _ref_a337mi = { generateMipmaps };
const _ref_dkofh0 = { rayIntersectTriangle };
const _ref_xk9ova = { killParticles };
const _ref_g6nsaf = { monitorClipboard };
const _ref_ontx7h = { parseQueryString };
const _ref_7s8a7c = { parseClass };
const _ref_j7iw8f = { createPanner };
const _ref_ogq9ln = { computeLossFunction };
const _ref_1tm5ce = { createChannelMerger };
const _ref_otstwo = { dhcpDiscover };
const _ref_mbahf5 = { dropTable };
const _ref_t7dum5 = { dhcpOffer };
const _ref_1s2oxl = { uniform3f };
const _ref_7s9o2f = { closePipe };
const _ref_tx235i = { limitBandwidth };
const _ref_gpfk1p = { broadcastMessage }; 
    });
})({}, {});