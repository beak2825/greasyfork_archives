// ==UserScript==
// @name Bigo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Bigo/index.js
// @version 2026.01.10
// @description 一键下载Bigo视频，支持4K/1080P/720P多画质。
// @icon https://www.bigo.tv/favicon.ico
// @match *://*.bigo.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect bigo.tv
// @connect cubetecn.com
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
// @downloadURL https://update.greasyfork.org/scripts/562236/Bigo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562236/Bigo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const configureInterface = (iface, config) => true;

const backpropagateGradient = (loss) => true;

const parseQueryString = (qs) => ({});

const checkIntegrityConstraint = (table) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const detectDarkMode = () => true;

const dropTable = (table) => true;

const beginTransaction = () => "TX-" + Date.now();

const enableBlend = (func) => true;

const logErrorToFile = (err) => console.error(err);

const tokenizeText = (text) => text.split(" ");

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

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

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const checkGLError = () => 0;

const computeLossFunction = (pred, actual) => 0.05;

const shutdownComputer = () => console.log("Shutting down...");

const rotateLogFiles = () => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const setDelayTime = (node, time) => node.delayTime.value = time;

const foldConstants = (ast) => ast;

const drawArrays = (gl, mode, first, count) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const rollbackTransaction = (tx) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const sleep = (body) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const rayCast = (world, start, end) => ({ hit: false });

const calculateFriction = (mat1, mat2) => 0.5;

const validateProgram = (program) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const processAudioBuffer = (buffer) => buffer;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const uniform3f = (loc, x, y, z) => true;

const eliminateDeadCode = (ast) => ast;

const injectCSPHeader = () => "default-src 'self'";

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const cacheQueryResults = (key, data) => true;

const addWheel = (vehicle, info) => true;

const findLoops = (cfg) => [];

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const jitCompile = (bc) => (() => {});

const closeSocket = (sock) => true;

const defineSymbol = (table, name, info) => true;

const allocateRegisters = (ir) => ir;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const optimizeAST = (ast) => ast;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const updateParticles = (sys, dt) => true;

const deleteProgram = (program) => true;

const reduceDimensionalityPCA = (data) => data;

const deleteTexture = (texture) => true;

const scaleMatrix = (mat, vec) => mat;

const createAudioContext = () => ({ sampleRate: 44100 });

const registerGestureHandler = (gesture) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const profilePerformance = (func) => 0;

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

const resolveImports = (ast) => [];

const generateDocumentation = (ast) => "";

const calculateRestitution = (mat1, mat2) => 0.3;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const bufferData = (gl, target, data, usage) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const addConeTwistConstraint = (world, c) => true;

const fragmentPacket = (data, mtu) => [data];

const generateMipmaps = (target) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const broadcastMessage = (msg) => true;

const exitScope = (table) => true;

const validatePieceChecksum = (piece) => true;

const linkModules = (modules) => ({});

const triggerHapticFeedback = (intensity) => true;

const inlineFunctions = (ast) => ast;

const dhcpRequest = (ip) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const createProcess = (img) => ({ pid: 100 });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const inferType = (node) => 'any';

const unmapMemory = (ptr, size) => true;

const decapsulateFrame = (frame) => frame;

const sendPacket = (sock, data) => data.length;

const detachThread = (tid) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const arpRequest = (ip) => "00:00:00:00:00:00";

const splitFile = (path, parts) => Array(parts).fill(path);

const updateSoftBody = (body) => true;

const unrollLoops = (ast) => ast;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const pingHost = (host) => 10;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const replicateData = (node) => ({ target: node, synced: true });

const detectAudioCodec = () => "aac";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const compileFragmentShader = (source) => ({ compiled: true });

const restoreDatabase = (path) => true;

const connectNodes = (src, dest) => true;

const reassemblePacket = (fragments) => fragments[0];

const announceToTracker = (url) => ({ url, interval: 1800 });

const unlockFile = (path) => ({ path, locked: false });

const resampleAudio = (buffer, rate) => buffer;

const serializeFormData = (form) => JSON.stringify(form);

const updateTransform = (body) => true;

const parsePayload = (packet) => ({});

const contextSwitch = (oldPid, newPid) => true;

const addPoint2PointConstraint = (world, c) => true;

const upInterface = (iface) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const mutexLock = (mtx) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const joinThread = (tid) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setGainValue = (node, val) => node.gain.value = val;

const cullFace = (mode) => true;

const mapMemory = (fd, size) => 0x2000;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const readFile = (fd, len) => "";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const encryptStream = (stream, key) => stream;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const gaussianBlur = (image, radius) => image;

const edgeDetectionSobel = (image) => image;

const disconnectNodes = (node) => true;

const cleanOldLogs = (days) => days;

const preventSleepMode = () => true;

const getByteFrequencyData = (analyser, array) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const limitRate = (stream, rate) => stream;

const chokePeer = (peer) => ({ ...peer, choked: true });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setKnee = (node, val) => node.knee.value = val;

const createParticleSystem = (count) => ({ particles: [] });

const detectDebugger = () => false;

const killProcess = (pid) => true;

const listenSocket = (sock, backlog) => true;

const adjustWindowSize = (sock, size) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const encapsulateFrame = (packet) => packet;

const instrumentCode = (code) => code;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const unlinkFile = (path) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setQValue = (filter, q) => filter.Q = q;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const augmentData = (image) => image;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const invalidateCache = (key) => true;

const validateRecaptcha = (token) => true;

const captureFrame = () => "frame_data_buffer";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const resolveSymbols = (ast) => ({});

const createDirectoryRecursive = (path) => path.split('/').length;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const getNetworkStats = () => ({ up: 100, down: 2000 });

const stakeAssets = (pool, amount) => true;

const disableRightClick = () => true;


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

const closePipe = (fd) => true;

const createThread = (func) => ({ tid: 1 });

const setDistanceModel = (panner, model) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const controlCongestion = (sock) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const computeDominators = (cfg) => ({});

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const synthesizeSpeech = (text) => "audio_buffer";

const detectVideoCodec = () => "h264";

const cancelTask = (id) => ({ id, cancelled: true });

const transcodeStream = (format) => ({ format, status: "processing" });

const setViewport = (x, y, w, h) => true;

const createConstraint = (body1, body2) => ({});

const bufferMediaStream = (size) => ({ buffer: size });

const auditAccessLogs = () => true;

const createConvolver = (ctx) => ({ buffer: null });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const renderParticles = (sys) => true;

const enableDHT = () => true;

const resumeContext = (ctx) => Promise.resolve();

const filterTraffic = (rule) => true;

// Anti-shake references
const _ref_25cyr7 = { configureInterface };
const _ref_vy55gp = { backpropagateGradient };
const _ref_uyiicr = { parseQueryString };
const _ref_t6njk4 = { checkIntegrityConstraint };
const _ref_06zbma = { connectionPooling };
const _ref_i46pkw = { detectDarkMode };
const _ref_o15gum = { dropTable };
const _ref_3amrnm = { beginTransaction };
const _ref_hf1dpq = { enableBlend };
const _ref_swgwly = { logErrorToFile };
const _ref_c94y76 = { tokenizeText };
const _ref_nplbk4 = { convertRGBtoHSL };
const _ref_j5ap9b = { AdvancedCipher };
const _ref_p6i7dp = { virtualScroll };
const _ref_tdvdwl = { computeNormal };
const _ref_iakntz = { checkGLError };
const _ref_y1hink = { computeLossFunction };
const _ref_dcgej5 = { shutdownComputer };
const _ref_f2rpxs = { rotateLogFiles };
const _ref_g6wd3f = { loadModelWeights };
const _ref_2lu8z6 = { setDelayTime };
const _ref_u1zi3z = { foldConstants };
const _ref_wslcxx = { drawArrays };
const _ref_cfzzby = { uniformMatrix4fv };
const _ref_pvakax = { rollbackTransaction };
const _ref_uiq2a1 = { extractThumbnail };
const _ref_yrkb60 = { sanitizeSQLInput };
const _ref_adgqsa = { sleep };
const _ref_6sn3wt = { createScriptProcessor };
const _ref_o84xle = { discoverPeersDHT };
const _ref_mhsb39 = { rayCast };
const _ref_fklfpl = { calculateFriction };
const _ref_qxbsr6 = { validateProgram };
const _ref_1mer5e = { throttleRequests };
const _ref_7tvn4s = { processAudioBuffer };
const _ref_43awjj = { compressDataStream };
const _ref_mx32r9 = { uniform3f };
const _ref_38y3vl = { eliminateDeadCode };
const _ref_p33khp = { injectCSPHeader };
const _ref_cu49hn = { connectToTracker };
const _ref_mxhwb6 = { cacheQueryResults };
const _ref_azeai7 = { addWheel };
const _ref_snofv4 = { findLoops };
const _ref_strlzn = { parseConfigFile };
const _ref_eybzzd = { createOscillator };
const _ref_kprdca = { jitCompile };
const _ref_6zbuj5 = { closeSocket };
const _ref_402njn = { defineSymbol };
const _ref_dis504 = { allocateRegisters };
const _ref_pizv2w = { checkIntegrity };
const _ref_q27saw = { optimizeAST };
const _ref_xs0024 = { analyzeUserBehavior };
const _ref_yypr1e = { analyzeControlFlow };
const _ref_lgiibg = { convexSweepTest };
const _ref_bh21cr = { updateParticles };
const _ref_uy92up = { deleteProgram };
const _ref_hlfxb3 = { reduceDimensionalityPCA };
const _ref_ml70o6 = { deleteTexture };
const _ref_6iea0j = { scaleMatrix };
const _ref_prqpcn = { createAudioContext };
const _ref_pfpiyc = { registerGestureHandler };
const _ref_buh3ux = { generateUserAgent };
const _ref_2co0ci = { renderVirtualDOM };
const _ref_566b0g = { profilePerformance };
const _ref_zx7bgx = { VirtualFSTree };
const _ref_hz1qxr = { resolveImports };
const _ref_poxin1 = { generateDocumentation };
const _ref_d5u6c7 = { calculateRestitution };
const _ref_bbv1xi = { optimizeConnectionPool };
const _ref_59ryu0 = { diffVirtualDOM };
const _ref_yl1km5 = { bufferData };
const _ref_4hqbd9 = { resolveDNSOverHTTPS };
const _ref_qjxckm = { addConeTwistConstraint };
const _ref_p5w16f = { fragmentPacket };
const _ref_bp7ode = { generateMipmaps };
const _ref_g79yb1 = { tunnelThroughProxy };
const _ref_zy2fy7 = { broadcastMessage };
const _ref_rdapwc = { exitScope };
const _ref_a93h7l = { validatePieceChecksum };
const _ref_l1v4tf = { linkModules };
const _ref_96q6cs = { triggerHapticFeedback };
const _ref_70zdrr = { inlineFunctions };
const _ref_8b5pjp = { dhcpRequest };
const _ref_z1mwcy = { createVehicle };
const _ref_9i8wrv = { createProcess };
const _ref_q6m9up = { createDelay };
const _ref_exs1eg = { inferType };
const _ref_gj8zf7 = { unmapMemory };
const _ref_1pa26t = { decapsulateFrame };
const _ref_8e5zqj = { sendPacket };
const _ref_z5kfh6 = { detachThread };
const _ref_n0zatj = { getFileAttributes };
const _ref_bylou3 = { arpRequest };
const _ref_sthfd5 = { splitFile };
const _ref_ekqwu4 = { updateSoftBody };
const _ref_a8qn6b = { unrollLoops };
const _ref_1ale4y = { syncAudioVideo };
const _ref_7ut1vn = { pingHost };
const _ref_kvlkrm = { applyPerspective };
const _ref_y72eqx = { replicateData };
const _ref_cqbvsv = { detectAudioCodec };
const _ref_ph8mrz = { scheduleBandwidth };
const _ref_ybsblt = { compileFragmentShader };
const _ref_panvbx = { restoreDatabase };
const _ref_f6ct23 = { connectNodes };
const _ref_joh62e = { reassemblePacket };
const _ref_fcwdwd = { announceToTracker };
const _ref_wbwoip = { unlockFile };
const _ref_x3p57t = { resampleAudio };
const _ref_udpmvl = { serializeFormData };
const _ref_f9ybr9 = { updateTransform };
const _ref_c2cmog = { parsePayload };
const _ref_7lfq3o = { contextSwitch };
const _ref_35rved = { addPoint2PointConstraint };
const _ref_9qfa3r = { upInterface };
const _ref_coxvj3 = { resolveHostName };
const _ref_sszsrp = { mutexLock };
const _ref_sj9ogk = { repairCorruptFile };
const _ref_nevby0 = { joinThread };
const _ref_dsob4t = { createCapsuleShape };
const _ref_634lhp = { setGainValue };
const _ref_r1ydrj = { cullFace };
const _ref_42srdg = { mapMemory };
const _ref_5ne0ag = { saveCheckpoint };
const _ref_39ya8p = { readFile };
const _ref_dfid1a = { transformAesKey };
const _ref_wwziut = { encryptStream };
const _ref_tf10ou = { updateBitfield };
const _ref_hf5ql5 = { detectEnvironment };
const _ref_hddaa7 = { gaussianBlur };
const _ref_wc6932 = { edgeDetectionSobel };
const _ref_53r95c = { disconnectNodes };
const _ref_mc412f = { cleanOldLogs };
const _ref_itpna4 = { preventSleepMode };
const _ref_x7q7tm = { getByteFrequencyData };
const _ref_4bsith = { getVelocity };
const _ref_qkzf42 = { limitRate };
const _ref_aumhdg = { chokePeer };
const _ref_uzr8yu = { tokenizeSource };
const _ref_wmpclc = { setKnee };
const _ref_ro92my = { createParticleSystem };
const _ref_hic38q = { detectDebugger };
const _ref_6ajh9a = { killProcess };
const _ref_januz7 = { listenSocket };
const _ref_67s4m5 = { adjustWindowSize };
const _ref_2c3m2n = { handshakePeer };
const _ref_aj2l6x = { sanitizeInput };
const _ref_9dl1vk = { applyEngineForce };
const _ref_90oi1u = { normalizeAudio };
const _ref_s0bwnr = { encapsulateFrame };
const _ref_tbdljk = { instrumentCode };
const _ref_uefgiq = { generateWalletKeys };
const _ref_cp2v6u = { requestPiece };
const _ref_se075i = { unlinkFile };
const _ref_k626q4 = { limitUploadSpeed };
const _ref_w3do6f = { createPanner };
const _ref_4mjfht = { createBoxShape };
const _ref_wm04p9 = { unchokePeer };
const _ref_zq6pas = { calculateLayoutMetrics };
const _ref_8n1chb = { setQValue };
const _ref_k748ib = { readPixels };
const _ref_s8toez = { augmentData };
const _ref_2gt3oj = { uploadCrashReport };
const _ref_nxam2h = { invalidateCache };
const _ref_n7fx0h = { validateRecaptcha };
const _ref_qbb7ni = { captureFrame };
const _ref_vac9cr = { lazyLoadComponent };
const _ref_mmj4z7 = { resolveSymbols };
const _ref_cyf407 = { createDirectoryRecursive };
const _ref_rkks4f = { updateProgressBar };
const _ref_jmqoa1 = { validateTokenStructure };
const _ref_rb9cda = { backupDatabase };
const _ref_px1mui = { terminateSession };
const _ref_80vvbo = { getNetworkStats };
const _ref_erdmba = { stakeAssets };
const _ref_c2k87q = { disableRightClick };
const _ref_olbh7l = { ResourceMonitor };
const _ref_seck8i = { closePipe };
const _ref_untlfo = { createThread };
const _ref_5wxghn = { setDistanceModel };
const _ref_mi603t = { interceptRequest };
const _ref_31d6dz = { controlCongestion };
const _ref_n51vip = { resolveDependencyGraph };
const _ref_vld2m3 = { computeDominators };
const _ref_2691fv = { rotateUserAgent };
const _ref_j4ltu4 = { synthesizeSpeech };
const _ref_k8xvpx = { detectVideoCodec };
const _ref_ip9ku1 = { cancelTask };
const _ref_0ros31 = { transcodeStream };
const _ref_bmr3o1 = { setViewport };
const _ref_2pqy4v = { createConstraint };
const _ref_2gu2bd = { bufferMediaStream };
const _ref_nmsj5s = { auditAccessLogs };
const _ref_xty6d9 = { createConvolver };
const _ref_t0fr02 = { optimizeMemoryUsage };
const _ref_u4u448 = { syncDatabase };
const _ref_lhwk4z = { renderParticles };
const _ref_va6not = { enableDHT };
const _ref_we7c75 = { resumeContext };
const _ref_cemix5 = { filterTraffic }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Bigo` };
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
                const urlParams = { config, url: window.location.href, name_en: `Bigo` };

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
        const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const execProcess = (path) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const chokePeer = (peer) => ({ ...peer, choked: true });

const renderCanvasLayer = (ctx) => true;

const rollbackTransaction = (tx) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const generateEmbeddings = (text) => new Float32Array(128);

const dropTable = (table) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createListener = (ctx) => ({});

const migrateSchema = (version) => ({ current: version, status: "ok" });

const parseQueryString = (qs) => ({});

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const setAngularVelocity = (body, v) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const extractArchive = (archive) => ["file1", "file2"];

const bufferMediaStream = (size) => ({ buffer: size });

const addHingeConstraint = (world, c) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const scheduleTask = (task) => ({ id: 1, task });

const activeTexture = (unit) => true;


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

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const checkIntegrityConstraint = (table) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const processAudioBuffer = (buffer) => buffer;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const decompressGzip = (data) => data;

const calculateFriction = (mat1, mat2) => 0.5;

const synthesizeSpeech = (text) => "audio_buffer";

const gaussianBlur = (image, radius) => image;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const estimateNonce = (addr) => 42;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const setVelocity = (body, v) => true;

const cullFace = (mode) => true;

const computeLossFunction = (pred, actual) => 0.05;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const beginTransaction = () => "TX-" + Date.now();

const swapTokens = (pair, amount) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const uniform1i = (loc, val) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const compileVertexShader = (source) => ({ compiled: true });

const disconnectNodes = (node) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const lockRow = (id) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const validateFormInput = (input) => input.length > 0;


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

const clearScreen = (r, g, b, a) => true;

const addRigidBody = (world, body) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const rayCast = (world, start, end) => ({ hit: false });

const getExtension = (name) => ({});

const setDetune = (osc, cents) => osc.detune = cents;

const setViewport = (x, y, w, h) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const deleteTexture = (texture) => true;

const addPoint2PointConstraint = (world, c) => true;

const setRelease = (node, val) => node.release.value = val;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const tokenizeText = (text) => text.split(" ");

const setFilterType = (filter, type) => filter.type = type;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const getUniformLocation = (program, name) => 1;

const applyImpulse = (body, impulse, point) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const verifyChecksum = (data, sum) => true;

const setInertia = (body, i) => true;

const checkBatteryLevel = () => 100;

const convertFormat = (src, dest) => dest;

const closeSocket = (sock) => true;

const reassemblePacket = (fragments) => fragments[0];

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const resolveCollision = (manifold) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const unmuteStream = () => false;

const setSocketTimeout = (ms) => ({ timeout: ms });

const receivePacket = (sock, len) => new Uint8Array(len);

const getCpuLoad = () => Math.random() * 100;

const inferType = (node) => 'any';

const interestPeer = (peer) => ({ ...peer, interested: true });

const prefetchAssets = (urls) => urls.length;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const setFilePermissions = (perm) => `chmod ${perm}`;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const rotateLogFiles = () => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const createDirectoryRecursive = (path) => path.split('/').length;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const enableDHT = () => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const cancelTask = (id) => ({ id, cancelled: true });

const pingHost = (host) => 10;

const bundleAssets = (assets) => "";

const decodeAudioData = (buffer) => Promise.resolve({});

const generateCode = (ast) => "const a = 1;";

const getOutputTimestamp = (ctx) => Date.now();

const decompressPacket = (data) => data;

const setMass = (body, m) => true;

const checkTypes = (ast) => [];

const deserializeAST = (json) => JSON.parse(json);

const leaveGroup = (group) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const createASTNode = (type, val) => ({ type, val });

const detectPacketLoss = (acks) => false;

const measureRTT = (sent, recv) => 10;

const visitNode = (node) => true;

const bindTexture = (target, texture) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

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

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const generateSourceMap = (ast) => "{}";

const logErrorToFile = (err) => console.error(err);

const resolveSymbols = (ast) => ({});

const detectCollision = (body1, body2) => false;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const merkelizeRoot = (txs) => "root_hash";

const setQValue = (filter, q) => filter.Q = q;

const checkGLError = () => 0;

const auditAccessLogs = () => true;

const shutdownComputer = () => console.log("Shutting down...");

const forkProcess = () => 101;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const createShader = (gl, type) => ({ id: Math.random(), type });

const setGravity = (world, g) => world.gravity = g;

const mapMemory = (fd, size) => 0x2000;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const loadCheckpoint = (path) => true;

const stepSimulation = (world, dt) => true;

const subscribeToEvents = (contract) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const createSymbolTable = () => ({ scopes: [] });

const signTransaction = (tx, key) => "signed_tx_hash";

const validatePieceChecksum = (piece) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const addWheel = (vehicle, info) => true;

const dhcpRequest = (ip) => true;

const analyzeHeader = (packet) => ({});

const handleInterrupt = (irq) => true;

const rateLimitCheck = (ip) => true;

const killProcess = (pid) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const freeMemory = (ptr) => true;

const negotiateProtocol = () => "HTTP/2.0";

const sanitizeXSS = (html) => html;

const createChannelMerger = (ctx, channels) => ({});

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const suspendContext = (ctx) => Promise.resolve();

const scaleMatrix = (mat, vec) => mat;

const upInterface = (iface) => true;

const restartApplication = () => console.log("Restarting...");

const applyForce = (body, force, point) => true;

const claimRewards = (pool) => "0.5 ETH";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const createProcess = (img) => ({ pid: 100 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const classifySentiment = (text) => "positive";

const resampleAudio = (buffer, rate) => buffer;

const createThread = (func) => ({ tid: 1 });

const allocateMemory = (size) => 0x1000;

const detectDevTools = () => false;

const augmentData = (image) => image;

const multicastMessage = (group, msg) => true;

const unmapMemory = (ptr, size) => true;

const translateMatrix = (mat, vec) => mat;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const commitTransaction = (tx) => true;

const hoistVariables = (ast) => ast;

const dhcpDiscover = () => true;

const configureInterface = (iface, config) => true;

const validateProgram = (program) => true;

const mutexLock = (mtx) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const removeMetadata = (file) => ({ file, metadata: null });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const setDopplerFactor = (val) => true;

const createMediaElementSource = (ctx, el) => ({});

const verifyAppSignature = () => true;

const fragmentPacket = (data, mtu) => [data];

const disableInterrupts = () => true;

const injectCSPHeader = () => "default-src 'self'";

const createFrameBuffer = () => ({ id: Math.random() });

const setGainValue = (node, val) => node.gain.value = val;

// Anti-shake references
const _ref_kex2cd = { calculateSHA256 };
const _ref_yh9kpu = { execProcess };
const _ref_0f3h5b = { convertHSLtoRGB };
const _ref_gslcun = { chokePeer };
const _ref_lwuya9 = { renderCanvasLayer };
const _ref_ge6v7t = { rollbackTransaction };
const _ref_vm400r = { throttleRequests };
const _ref_hauhmb = { updateProgressBar };
const _ref_7wndt3 = { saveCheckpoint };
const _ref_u0a5so = { uploadCrashReport };
const _ref_u7vomq = { generateEmbeddings };
const _ref_sana55 = { dropTable };
const _ref_que2q6 = { transformAesKey };
const _ref_7rvi5g = { createListener };
const _ref_9j1isj = { migrateSchema };
const _ref_iz0wzj = { parseQueryString };
const _ref_igzow3 = { optimizeHyperparameters };
const _ref_6a4qrw = { setAngularVelocity };
const _ref_dka93o = { uniformMatrix4fv };
const _ref_mcjw01 = { extractArchive };
const _ref_38gg7l = { bufferMediaStream };
const _ref_ntex4r = { addHingeConstraint };
const _ref_dv0ztc = { calculateLayoutMetrics };
const _ref_qngb5h = { scheduleTask };
const _ref_2wenkn = { activeTexture };
const _ref_qi3c1h = { TelemetryClient };
const _ref_n4l60z = { detectEnvironment };
const _ref_ziplpg = { checkIntegrityConstraint };
const _ref_i9q2l0 = { getNetworkStats };
const _ref_r1te7b = { processAudioBuffer };
const _ref_1nqd7k = { limitBandwidth };
const _ref_yn9gk9 = { createAudioContext };
const _ref_gjqjwv = { decompressGzip };
const _ref_nml3cy = { calculateFriction };
const _ref_gyzc0n = { synthesizeSpeech };
const _ref_q2hhak = { gaussianBlur };
const _ref_tnanb7 = { readPixels };
const _ref_06896s = { estimateNonce };
const _ref_ybwne3 = { autoResumeTask };
const _ref_g8g8ev = { setVelocity };
const _ref_cibumt = { cullFace };
const _ref_9u4z51 = { computeLossFunction };
const _ref_ntu92j = { sanitizeSQLInput };
const _ref_us4umu = { beginTransaction };
const _ref_htq28i = { swapTokens };
const _ref_9u3frn = { createOscillator };
const _ref_cwcotz = { resolveDependencyGraph };
const _ref_uzgqgh = { uniform1i };
const _ref_km8bcu = { createScriptProcessor };
const _ref_99r1gr = { compileVertexShader };
const _ref_6qfqz3 = { disconnectNodes };
const _ref_yljzky = { convexSweepTest };
const _ref_xoy68t = { linkProgram };
const _ref_5ku5m9 = { resolveDNSOverHTTPS };
const _ref_0aiwjj = { createBiquadFilter };
const _ref_t2g9et = { lockRow };
const _ref_jv90cp = { vertexAttrib3f };
const _ref_gvo33d = { validateFormInput };
const _ref_haeqpe = { ResourceMonitor };
const _ref_kkl5nf = { clearScreen };
const _ref_br6cpr = { addRigidBody };
const _ref_d35g0m = { checkDiskSpace };
const _ref_p4bkti = { rayCast };
const _ref_852tyv = { getExtension };
const _ref_yy7sv0 = { setDetune };
const _ref_lpe698 = { setViewport };
const _ref_hpib37 = { loadTexture };
const _ref_9al0ee = { executeSQLQuery };
const _ref_wgq4xg = { deleteTexture };
const _ref_lrh7ha = { addPoint2PointConstraint };
const _ref_vvz3cn = { setRelease };
const _ref_7009mg = { generateWalletKeys };
const _ref_i6vuj0 = { tokenizeText };
const _ref_8o4acd = { setFilterType };
const _ref_euz0r2 = { createCapsuleShape };
const _ref_alc71d = { getUniformLocation };
const _ref_06glve = { applyImpulse };
const _ref_9ji7px = { createMeshShape };
const _ref_e9pmjd = { verifyChecksum };
const _ref_eubmp3 = { setInertia };
const _ref_wo8u4o = { checkBatteryLevel };
const _ref_lzlxjg = { convertFormat };
const _ref_g38ehj = { closeSocket };
const _ref_i5anmm = { reassemblePacket };
const _ref_x3ysr0 = { monitorNetworkInterface };
const _ref_s908ii = { resolveCollision };
const _ref_big0p1 = { registerSystemTray };
const _ref_z2acso = { analyzeQueryPlan };
const _ref_eimxbc = { unmuteStream };
const _ref_ldnvfy = { setSocketTimeout };
const _ref_sknjgb = { receivePacket };
const _ref_139w9x = { getCpuLoad };
const _ref_vs6k4b = { inferType };
const _ref_xlmzyz = { interestPeer };
const _ref_5krmze = { prefetchAssets };
const _ref_2nbsvq = { resolveHostName };
const _ref_hats2c = { setFilePermissions };
const _ref_7ct7r7 = { calculateLighting };
const _ref_spn80e = { rotateLogFiles };
const _ref_eox3nd = { repairCorruptFile };
const _ref_v868j4 = { showNotification };
const _ref_lsetmq = { createDirectoryRecursive };
const _ref_cmss0k = { rayIntersectTriangle };
const _ref_yawpqm = { enableDHT };
const _ref_7ylg1f = { initWebGLContext };
const _ref_l7g0f7 = { cancelTask };
const _ref_9xsmdq = { pingHost };
const _ref_m40yfn = { bundleAssets };
const _ref_3bylic = { decodeAudioData };
const _ref_398r3m = { generateCode };
const _ref_ybka8z = { getOutputTimestamp };
const _ref_dwqxnq = { decompressPacket };
const _ref_d1bdyy = { setMass };
const _ref_hxp0ok = { checkTypes };
const _ref_2n7otc = { deserializeAST };
const _ref_dyhxq6 = { leaveGroup };
const _ref_uttfzh = { checkPortAvailability };
const _ref_45zf5y = { createASTNode };
const _ref_r7ybmq = { detectPacketLoss };
const _ref_cuy5t7 = { measureRTT };
const _ref_b2jex7 = { visitNode };
const _ref_bper8p = { bindTexture };
const _ref_49vdbk = { scrapeTracker };
const _ref_oqfvyk = { deleteTempFiles };
const _ref_j4nauy = { download };
const _ref_oj4g6z = { setFrequency };
const _ref_9eerxx = { generateSourceMap };
const _ref_9v5h9p = { logErrorToFile };
const _ref_ca3p3k = { resolveSymbols };
const _ref_zzc17o = { detectCollision };
const _ref_ib8f95 = { calculateMD5 };
const _ref_28zyac = { merkelizeRoot };
const _ref_2duvmg = { setQValue };
const _ref_vjp6he = { checkGLError };
const _ref_ng31ot = { auditAccessLogs };
const _ref_hf208d = { shutdownComputer };
const _ref_z2vwtp = { forkProcess };
const _ref_ckqh5b = { rotateUserAgent };
const _ref_lont5r = { createShader };
const _ref_wzh4ss = { setGravity };
const _ref_v6begg = { mapMemory };
const _ref_3g7weu = { detectFirewallStatus };
const _ref_csxoop = { loadCheckpoint };
const _ref_23zwy4 = { stepSimulation };
const _ref_9tv92m = { subscribeToEvents };
const _ref_p0rl9s = { unchokePeer };
const _ref_jktykm = { createSymbolTable };
const _ref_pozrec = { signTransaction };
const _ref_l6xw5a = { validatePieceChecksum };
const _ref_adj3hd = { createDelay };
const _ref_x7kk1g = { addWheel };
const _ref_glts0y = { dhcpRequest };
const _ref_iiuak7 = { analyzeHeader };
const _ref_tv3gxb = { handleInterrupt };
const _ref_e6x2v4 = { rateLimitCheck };
const _ref_ybzdxa = { killProcess };
const _ref_k6aenu = { diffVirtualDOM };
const _ref_z5lxa1 = { createGainNode };
const _ref_ja54l6 = { freeMemory };
const _ref_mi93qb = { negotiateProtocol };
const _ref_lighsb = { sanitizeXSS };
const _ref_uxxrgb = { createChannelMerger };
const _ref_hvwinp = { applyEngineForce };
const _ref_k75tqx = { suspendContext };
const _ref_znul1s = { scaleMatrix };
const _ref_qiic70 = { upInterface };
const _ref_6sugl4 = { restartApplication };
const _ref_591p2g = { applyForce };
const _ref_jwerik = { claimRewards };
const _ref_a6lb17 = { keepAlivePing };
const _ref_ml2vs4 = { syncAudioVideo };
const _ref_ib8sx4 = { createProcess };
const _ref_875q9f = { FileValidator };
const _ref_yhcjrw = { classifySentiment };
const _ref_rb1ejo = { resampleAudio };
const _ref_5a9jqa = { createThread };
const _ref_fm5d7s = { allocateMemory };
const _ref_oy6kw9 = { detectDevTools };
const _ref_ojah0o = { augmentData };
const _ref_7e5ohf = { multicastMessage };
const _ref_xrevor = { unmapMemory };
const _ref_jrxsim = { translateMatrix };
const _ref_qlvubg = { allocateDiskSpace };
const _ref_jibu5r = { commitTransaction };
const _ref_qxftd3 = { hoistVariables };
const _ref_90gfrc = { dhcpDiscover };
const _ref_a51kjd = { configureInterface };
const _ref_i44xyd = { validateProgram };
const _ref_77atmg = { mutexLock };
const _ref_rqn6u7 = { moveFileToComplete };
const _ref_9y578x = { removeMetadata };
const _ref_bcyeqw = { animateTransition };
const _ref_764p58 = { setDopplerFactor };
const _ref_vssooj = { createMediaElementSource };
const _ref_455wli = { verifyAppSignature };
const _ref_owyu6n = { fragmentPacket };
const _ref_3vk756 = { disableInterrupts };
const _ref_l0zcy9 = { injectCSPHeader };
const _ref_7zuu3z = { createFrameBuffer };
const _ref_f3efuy = { setGainValue }; 
    });
})({}, {});