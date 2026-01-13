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
// @license      MIT
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
        const checkUpdate = () => ({ hasUpdate: false });

const generateSourceMap = (ast) => "{}";

const updateRoutingTable = (entry) => true;

const resolveSymbols = (ast) => ({});

const switchVLAN = (id) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const decapsulateFrame = (frame) => frame;

const addWheel = (vehicle, info) => true;

const generateCode = (ast) => "const a = 1;";

const findLoops = (cfg) => [];

const updateWheelTransform = (wheel) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const multicastMessage = (group, msg) => true;

const joinThread = (tid) => true;

const getShaderInfoLog = (shader) => "";

const defineSymbol = (table, name, info) => true;

const createSoftBody = (info) => ({ nodes: [] });

const calculateComplexity = (ast) => 1;

const interpretBytecode = (bc) => true;

const prioritizeTraffic = (queue) => true;

const createSymbolTable = () => ({ scopes: [] });

const resetVehicle = (vehicle) => true;

const compressPacket = (data) => data;

const removeConstraint = (world, c) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const prettifyCode = (code) => code;

const addGeneric6DofConstraint = (world, c) => true;

const compileVertexShader = (source) => ({ compiled: true });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const computeLossFunction = (pred, actual) => 0.05;

const handleTimeout = (sock) => true;


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

const getMediaDuration = () => 3600;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const dhcpDiscover = () => true;

const shutdownComputer = () => console.log("Shutting down...");

const syncAudioVideo = (offset) => ({ offset, synced: true });

const scheduleProcess = (pid) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
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

const createChannelMerger = (ctx, channels) => ({});

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const obfuscateCode = (code) => code;

const closeSocket = (sock) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const createMediaElementSource = (ctx, el) => ({});

const analyzeHeader = (packet) => ({});

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const allocateMemory = (size) => 0x1000;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const verifyChecksum = (data, sum) => true;

const generateMipmaps = (target) => true;

const killParticles = (sys) => true;

const unrollLoops = (ast) => ast;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const restoreDatabase = (path) => true;

const checkGLError = () => 0;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const hydrateSSR = (html) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const unmountFileSystem = (path) => true;

const encryptPeerTraffic = (data) => btoa(data);

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const debugAST = (ast) => "";

const loadImpulseResponse = (url) => Promise.resolve({});

const addConeTwistConstraint = (world, c) => true;

const unmuteStream = () => false;

const compileToBytecode = (ast) => new Uint8Array();

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

const mountFileSystem = (dev, path) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const triggerHapticFeedback = (intensity) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });


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

const allocateRegisters = (ir) => ir;

const panicKernel = (msg) => false;

const verifyAppSignature = () => true;

const resumeContext = (ctx) => Promise.resolve();

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const installUpdate = () => false;

const adjustPlaybackSpeed = (rate) => rate;

const startOscillator = (osc, time) => true;

const resolveImports = (ast) => [];

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const statFile = (path) => ({ size: 0 });

const deserializeAST = (json) => JSON.parse(json);

const clusterKMeans = (data, k) => Array(k).fill([]);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createAudioContext = () => ({ sampleRate: 44100 });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const systemCall = (num, args) => 0;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const renameFile = (oldName, newName) => newName;

const bundleAssets = (assets) => "";

const captureScreenshot = () => "data:image/png;base64,...";

const pingHost = (host) => 10;

const checkParticleCollision = (sys, world) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const bindAddress = (sock, addr, port) => true;

const checkRootAccess = () => false;

const lockRow = (id) => true;

const getUniformLocation = (program, name) => 1;

const getVehicleSpeed = (vehicle) => 0;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const generateEmbeddings = (text) => new Float32Array(128);

const muteStream = () => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createPipe = () => [3, 4];

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const segmentImageUNet = (img) => "mask_buffer";

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

const setEnv = (key, val) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const semaphoreSignal = (sem) => true;

const getOutputTimestamp = (ctx) => Date.now();

const updateParticles = (sys, dt) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const replicateData = (node) => ({ target: node, synced: true });

const establishHandshake = (sock) => true;

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

const deleteTexture = (texture) => true;

const subscribeToEvents = (contract) => true;

const dropTable = (table) => true;

const drawElements = (mode, count, type, offset) => true;

const hashKeccak256 = (data) => "0xabc...";

const getExtension = (name) => ({});

const closeContext = (ctx) => Promise.resolve();

const optimizeAST = (ast) => ast;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const disableRightClick = () => true;

const getFloatTimeDomainData = (analyser, array) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const foldConstants = (ast) => ast;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const validatePieceChecksum = (piece) => true;

const reassemblePacket = (fragments) => fragments[0];

const filterTraffic = (rule) => true;

const reportError = (msg, line) => console.error(msg);


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

const rotateMatrix = (mat, angle, axis) => mat;

const setFilterType = (filter, type) => filter.type = type;

const setPan = (node, val) => node.pan.value = val;

const getProgramInfoLog = (program) => "";

const createThread = (func) => ({ tid: 1 });

const checkTypes = (ast) => [];

const dhcpAck = () => true;

const updateSoftBody = (body) => true;

const deleteProgram = (program) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const negotiateSession = (sock) => ({ id: "sess_1" });

const normalizeVolume = (buffer) => buffer;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const createFrameBuffer = () => ({ id: Math.random() });

const setMTU = (iface, mtu) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const mockResponse = (body) => ({ status: 200, body });

const lockFile = (path) => ({ path, locked: true });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const injectCSPHeader = () => "default-src 'self'";

const downInterface = (iface) => true;

const applyForce = (body, force, point) => true;

const dhcpRequest = (ip) => true;

const registerGestureHandler = (gesture) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const createTCPSocket = () => ({ fd: 1 });

const protectMemory = (ptr, size, flags) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const setGainValue = (node, val) => node.gain.value = val;

const connectNodes = (src, dest) => true;

const renderCanvasLayer = (ctx) => true;

const verifyProofOfWork = (nonce) => true;

const bufferData = (gl, target, data, usage) => true;

const disconnectNodes = (node) => true;

const scheduleTask = (task) => ({ id: 1, task });

const deobfuscateString = (str) => atob(str);

const verifyIR = (ir) => true;

const preventSleepMode = () => true;

const backpropagateGradient = (loss) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const disableInterrupts = () => true;

const createMediaStreamSource = (ctx, stream) => ({});

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

const broadcastTransaction = (tx) => "tx_hash_123";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const processAudioBuffer = (buffer) => buffer;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

// Anti-shake references
const _ref_d1gc8h = { checkUpdate };
const _ref_nvjclg = { generateSourceMap };
const _ref_bs6ak3 = { updateRoutingTable };
const _ref_vkz9ry = { resolveSymbols };
const _ref_3e9hne = { switchVLAN };
const _ref_1ht28o = { compileFragmentShader };
const _ref_jxknf7 = { decapsulateFrame };
const _ref_x6eh6c = { addWheel };
const _ref_jni962 = { generateCode };
const _ref_38xufe = { findLoops };
const _ref_gp3ftk = { updateWheelTransform };
const _ref_pvusae = { parseStatement };
const _ref_knjjj2 = { multicastMessage };
const _ref_lrvhck = { joinThread };
const _ref_tcm5gc = { getShaderInfoLog };
const _ref_nhpxlk = { defineSymbol };
const _ref_i7a68k = { createSoftBody };
const _ref_oxw0l6 = { calculateComplexity };
const _ref_c8rwdg = { interpretBytecode };
const _ref_yew6c9 = { prioritizeTraffic };
const _ref_5l4m3i = { createSymbolTable };
const _ref_9iogm8 = { resetVehicle };
const _ref_h9q5f3 = { compressPacket };
const _ref_y9yyhl = { removeConstraint };
const _ref_ntgg6z = { uniformMatrix4fv };
const _ref_i6n52x = { prettifyCode };
const _ref_mg1s3b = { addGeneric6DofConstraint };
const _ref_3i6q97 = { compileVertexShader };
const _ref_ynfg39 = { manageCookieJar };
const _ref_sh5nxg = { connectToTracker };
const _ref_741ww3 = { computeLossFunction };
const _ref_5pkx9l = { handleTimeout };
const _ref_8ji8ir = { TelemetryClient };
const _ref_0wm3oq = { getMediaDuration };
const _ref_faaonh = { calculateSHA256 };
const _ref_a9agtv = { dhcpDiscover };
const _ref_50thwx = { shutdownComputer };
const _ref_luu9xo = { syncAudioVideo };
const _ref_rgayq9 = { scheduleProcess };
const _ref_3hq4fd = { transformAesKey };
const _ref_cr85d5 = { calculateEntropy };
const _ref_v9n1i2 = { createChannelMerger };
const _ref_hmxbhe = { throttleRequests };
const _ref_5od5mv = { obfuscateCode };
const _ref_e9n0n0 = { closeSocket };
const _ref_f8633m = { resolveDependencyGraph };
const _ref_n2bm1h = { createMediaElementSource };
const _ref_muzn2k = { analyzeHeader };
const _ref_qfbpiz = { createBiquadFilter };
const _ref_yz0mw3 = { allocateMemory };
const _ref_t6yehs = { debounceAction };
const _ref_1gjc8q = { verifyChecksum };
const _ref_6cmbd1 = { generateMipmaps };
const _ref_f5kqjk = { killParticles };
const _ref_hj9ddk = { unrollLoops };
const _ref_xysp6e = { parseClass };
const _ref_x2evc9 = { restoreDatabase };
const _ref_0y4c3h = { checkGLError };
const _ref_hqsjuv = { verifyMagnetLink };
const _ref_i2cvfv = { hydrateSSR };
const _ref_z5trwc = { decodeAudioData };
const _ref_47scyb = { parseTorrentFile };
const _ref_vs9deh = { unmountFileSystem };
const _ref_50hbdw = { encryptPeerTraffic };
const _ref_hqheu8 = { setFrequency };
const _ref_xunhvh = { debugAST };
const _ref_klbkms = { loadImpulseResponse };
const _ref_ulmgmd = { addConeTwistConstraint };
const _ref_lwwkbr = { unmuteStream };
const _ref_lc7g9z = { compileToBytecode };
const _ref_10ipl9 = { download };
const _ref_vp770h = { mountFileSystem };
const _ref_uvbmat = { readPixels };
const _ref_ynivp9 = { triggerHapticFeedback };
const _ref_7n5h0o = { createOscillator };
const _ref_deppx6 = { getMemoryUsage };
const _ref_36bxmd = { CacheManager };
const _ref_ettoj5 = { allocateRegisters };
const _ref_1wkuxm = { panicKernel };
const _ref_jsypqp = { verifyAppSignature };
const _ref_mn5e5i = { resumeContext };
const _ref_ct05k0 = { updateBitfield };
const _ref_fyq0sp = { installUpdate };
const _ref_6wpmyy = { adjustPlaybackSpeed };
const _ref_naxmh0 = { startOscillator };
const _ref_onkr8q = { resolveImports };
const _ref_dv93uq = { simulateNetworkDelay };
const _ref_yacsjg = { statFile };
const _ref_eqbpzj = { deserializeAST };
const _ref_rzsi6t = { clusterKMeans };
const _ref_nyb8vc = { executeSQLQuery };
const _ref_c0rsn0 = { createAudioContext };
const _ref_8hoz6z = { parseConfigFile };
const _ref_opzm2s = { getAppConfig };
const _ref_w7ipsn = { systemCall };
const _ref_7unth0 = { createPanner };
const _ref_i7bb5n = { renameFile };
const _ref_j0dalm = { bundleAssets };
const _ref_34c10j = { captureScreenshot };
const _ref_kgjkfd = { pingHost };
const _ref_yc4wsa = { checkParticleCollision };
const _ref_ssbx60 = { predictTensor };
const _ref_rigvsj = { FileValidator };
const _ref_bupgsv = { bindAddress };
const _ref_d0d46h = { checkRootAccess };
const _ref_wchrrc = { lockRow };
const _ref_9k7qxz = { getUniformLocation };
const _ref_gnzfku = { getVehicleSpeed };
const _ref_fhfi30 = { calculatePieceHash };
const _ref_64p7fy = { generateEmbeddings };
const _ref_hn2b4v = { muteStream };
const _ref_13z5p4 = { parseMagnetLink };
const _ref_vlovpr = { createPipe };
const _ref_f2upne = { createMagnetURI };
const _ref_ngtn9g = { segmentImageUNet };
const _ref_yu43ti = { VirtualFSTree };
const _ref_37iep9 = { setEnv };
const _ref_zlb9yc = { createShader };
const _ref_5r0ora = { connectionPooling };
const _ref_6m1wkb = { renderVirtualDOM };
const _ref_oiipjb = { semaphoreSignal };
const _ref_vbfnh7 = { getOutputTimestamp };
const _ref_qtxsp8 = { updateParticles };
const _ref_a3p5nr = { receivePacket };
const _ref_s3libv = { replicateData };
const _ref_bd0ofr = { establishHandshake };
const _ref_y7unb6 = { generateFakeClass };
const _ref_3s4t4v = { deleteTexture };
const _ref_vaj1q0 = { subscribeToEvents };
const _ref_dzebd0 = { dropTable };
const _ref_b57k1s = { drawElements };
const _ref_tbb365 = { hashKeccak256 };
const _ref_ts0l21 = { getExtension };
const _ref_bv5inf = { closeContext };
const _ref_e7260b = { optimizeAST };
const _ref_ausgxe = { limitUploadSpeed };
const _ref_ajiu8j = { decodeABI };
const _ref_7o81sv = { disableRightClick };
const _ref_xtnxls = { getFloatTimeDomainData };
const _ref_e31khi = { createDynamicsCompressor };
const _ref_otp9z7 = { foldConstants };
const _ref_jvpp8z = { traceStack };
const _ref_3d3gn4 = { validatePieceChecksum };
const _ref_4qv1i0 = { reassemblePacket };
const _ref_ss4ixh = { filterTraffic };
const _ref_w5ltb9 = { reportError };
const _ref_obkyyu = { ApiDataFormatter };
const _ref_mpwb4k = { rotateMatrix };
const _ref_fnkr9t = { setFilterType };
const _ref_nuto1q = { setPan };
const _ref_x66blf = { getProgramInfoLog };
const _ref_osh5y4 = { createThread };
const _ref_tgwege = { checkTypes };
const _ref_wgacmh = { dhcpAck };
const _ref_jx5su9 = { updateSoftBody };
const _ref_yz5v9p = { deleteProgram };
const _ref_595wrp = { getMACAddress };
const _ref_js8er7 = { negotiateSession };
const _ref_hbulgp = { normalizeVolume };
const _ref_5a51p3 = { tunnelThroughProxy };
const _ref_fw7w9l = { autoResumeTask };
const _ref_693cx4 = { generateWalletKeys };
const _ref_7x0o3k = { createFrameBuffer };
const _ref_gruwyd = { setMTU };
const _ref_x9indg = { readPipe };
const _ref_mvfi2r = { mockResponse };
const _ref_tmy5b7 = { lockFile };
const _ref_chxq47 = { archiveFiles };
const _ref_ne55ma = { injectCSPHeader };
const _ref_ws0tah = { downInterface };
const _ref_3dbl0b = { applyForce };
const _ref_msqtku = { dhcpRequest };
const _ref_xh183r = { registerGestureHandler };
const _ref_mk66rc = { optimizeMemoryUsage };
const _ref_6zsnk2 = { createTCPSocket };
const _ref_3mawz2 = { protectMemory };
const _ref_db9vgm = { playSoundAlert };
const _ref_z36spc = { setGainValue };
const _ref_qydlxj = { connectNodes };
const _ref_xm2fq0 = { renderCanvasLayer };
const _ref_yhhw26 = { verifyProofOfWork };
const _ref_vbr60w = { bufferData };
const _ref_wcrhxg = { disconnectNodes };
const _ref_lyzxcp = { scheduleTask };
const _ref_lugqrv = { deobfuscateString };
const _ref_y1b199 = { verifyIR };
const _ref_3odrea = { preventSleepMode };
const _ref_846ini = { backpropagateGradient };
const _ref_u46j65 = { queueDownloadTask };
const _ref_zskt5x = { getSystemUptime };
const _ref_cy5f2r = { disableInterrupts };
const _ref_a88fn3 = { createMediaStreamSource };
const _ref_3m6qpi = { AdvancedCipher };
const _ref_40sei3 = { broadcastTransaction };
const _ref_pngv77 = { uploadCrashReport };
const _ref_hhebz5 = { cancelAnimationFrameLoop };
const _ref_ce2zke = { rotateUserAgent };
const _ref_8i6zla = { processAudioBuffer };
const _ref_ankppx = { encryptPayload };
const _ref_peal7a = { handshakePeer }; 
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
        const bindTexture = (target, texture) => true;

const panicKernel = (msg) => false;

const connectNodes = (src, dest) => true;

const clearScreen = (r, g, b, a) => true;

const setViewport = (x, y, w, h) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const drawElements = (mode, count, type, offset) => true;

const attachRenderBuffer = (fb, rb) => true;

const setQValue = (filter, q) => filter.Q = q;

const setFilterType = (filter, type) => filter.type = type;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const getShaderInfoLog = (shader) => "";

const stopOscillator = (osc, time) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setDopplerFactor = (val) => true;

const setRelease = (node, val) => node.release.value = val;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const deleteProgram = (program) => true;

const resumeContext = (ctx) => Promise.resolve();

const controlCongestion = (sock) => true;

const exitScope = (table) => true;

const bundleAssets = (assets) => "";

const reportError = (msg, line) => console.error(msg);

const setPosition = (panner, x, y, z) => true;

const createChannelSplitter = (ctx, channels) => ({});

const checkIntegrityConstraint = (table) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const useProgram = (program) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const setPan = (node, val) => node.pan.value = val;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const generateSourceMap = (ast) => "{}";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const linkModules = (modules) => ({});

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const inlineFunctions = (ast) => ast;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const verifyIR = (ir) => true;

const removeRigidBody = (world, body) => true;

const enterScope = (table) => true;

const inferType = (node) => 'any';

const rotateMatrix = (mat, angle, axis) => mat;

const estimateNonce = (addr) => 42;

const verifySignature = (tx, sig) => true;

const reportWarning = (msg, line) => console.warn(msg);

const defineSymbol = (table, name, info) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const computeDominators = (cfg) => ({});

const mangleNames = (ast) => ast;

const setInertia = (body, i) => true;

const createSymbolTable = () => ({ scopes: [] });

const dumpSymbolTable = (table) => "";

const suspendContext = (ctx) => Promise.resolve();

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const deleteTexture = (texture) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const invalidateCache = (key) => true;

const addRigidBody = (world, body) => true;

const injectCSPHeader = () => "default-src 'self'";

const validateIPWhitelist = (ip) => true;

const uniform1i = (loc, val) => true;

const wakeUp = (body) => true;

const detectPacketLoss = (acks) => false;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createConstraint = (body1, body2) => ({});

const rotateLogFiles = () => true;

const setGainValue = (node, val) => node.gain.value = val;

const backupDatabase = (path) => ({ path, size: 5000 });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const compressGzip = (data) => data;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const analyzeBitrate = () => "5000kbps";

const applyTheme = (theme) => document.body.className = theme;

const setAngularVelocity = (body, v) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const decryptStream = (stream, key) => stream;

const createParticleSystem = (count) => ({ particles: [] });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const validateFormInput = (input) => input.length > 0;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const blockMaliciousTraffic = (ip) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createPeriodicWave = (ctx, real, imag) => ({});

const augmentData = (image) => image;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const checkUpdate = () => ({ hasUpdate: false });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const serializeFormData = (form) => JSON.stringify(form);

const auditAccessLogs = () => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const encryptLocalStorage = (key, val) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const cacheQueryResults = (key, data) => true;

const setVolumeLevel = (vol) => vol;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const getUniformLocation = (program, name) => 1;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const encryptPeerTraffic = (data) => btoa(data);

const prefetchAssets = (urls) => urls.length;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const normalizeVolume = (buffer) => buffer;

const chmodFile = (path, mode) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const negotiateSession = (sock) => ({ id: "sess_1" });

const dropTable = (table) => true;

const loadDriver = (path) => true;

const monitorClipboard = () => "";

const renderShadowMap = (scene, light) => ({ texture: {} });

const convertFormat = (src, dest) => dest;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const acceptConnection = (sock) => ({ fd: 2 });

const getByteFrequencyData = (analyser, array) => true;

const restartApplication = () => console.log("Restarting...");

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const linkFile = (src, dest) => true;

const lookupSymbol = (table, name) => ({});

const chownFile = (path, uid, gid) => true;

const emitParticles = (sys, count) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const debouncedResize = () => ({ width: 1920, height: 1080 });

const stakeAssets = (pool, amount) => true;

const broadcastMessage = (msg) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const profilePerformance = (func) => 0;

const jitCompile = (bc) => (() => {});

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const commitTransaction = (tx) => true;

const loadCheckpoint = (path) => true;

const writeFile = (fd, data) => true;

const shutdownComputer = () => console.log("Shutting down...");

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const multicastMessage = (group, msg) => true;

const computeLossFunction = (pred, actual) => 0.05;

const interpretBytecode = (bc) => true;

const visitNode = (node) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const addHingeConstraint = (world, c) => true;

const uniform3f = (loc, x, y, z) => true;

const measureRTT = (sent, recv) => 10;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const closeSocket = (sock) => true;

const disconnectNodes = (node) => true;

const createMediaElementSource = (ctx, el) => ({});

const activeTexture = (unit) => true;

const lockRow = (id) => true;

const encryptStream = (stream, key) => stream;

const renderCanvasLayer = (ctx) => true;

const cullFace = (mode) => true;

const setMass = (body, m) => true;

const detectDarkMode = () => true;

const spoofReferer = () => "https://google.com";

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const allocateRegisters = (ir) => ir;

const addWheel = (vehicle, info) => true;

const gaussianBlur = (image, radius) => image;

const calculateFriction = (mat1, mat2) => 0.5;

const reassemblePacket = (fragments) => fragments[0];

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const bufferMediaStream = (size) => ({ buffer: size });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const mockResponse = (body) => ({ status: 200, body });

const applyTorque = (body, torque) => true;

const startOscillator = (osc, time) => true;

const disablePEX = () => false;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const registerISR = (irq, func) => true;

const dhcpAck = () => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const vertexAttrib3f = (idx, x, y, z) => true;

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

const setOrientation = (panner, x, y, z) => true;

const translateMatrix = (mat, vec) => mat;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const hydrateSSR = (html) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const getExtension = (name) => ({});

const clusterKMeans = (data, k) => Array(k).fill([]);

const parseQueryString = (qs) => ({});

const unrollLoops = (ast) => ast;

const removeConstraint = (world, c) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const splitFile = (path, parts) => Array(parts).fill(path);

// Anti-shake references
const _ref_gskjzx = { bindTexture };
const _ref_seb3fu = { panicKernel };
const _ref_jw4p88 = { connectNodes };
const _ref_fbunot = { clearScreen };
const _ref_7kex5v = { setViewport };
const _ref_fvmk6z = { setFrequency };
const _ref_6pnsix = { drawElements };
const _ref_z5zfur = { attachRenderBuffer };
const _ref_lsfxax = { setQValue };
const _ref_ic7s17 = { setFilterType };
const _ref_arxm4a = { createPanner };
const _ref_m9mwu5 = { getShaderInfoLog };
const _ref_ifoldz = { stopOscillator };
const _ref_ps8nrn = { createGainNode };
const _ref_eso53c = { setDopplerFactor };
const _ref_ulpy0t = { setRelease };
const _ref_b1yjb1 = { readPixels };
const _ref_fk7gv6 = { deleteProgram };
const _ref_vkbs5h = { resumeContext };
const _ref_9rx3yx = { controlCongestion };
const _ref_ph4i78 = { exitScope };
const _ref_929mnh = { bundleAssets };
const _ref_3sho3l = { reportError };
const _ref_hqn1ch = { setPosition };
const _ref_ihtvfy = { createChannelSplitter };
const _ref_i69vo2 = { checkIntegrityConstraint };
const _ref_23leb3 = { compressDataStream };
const _ref_z66a3f = { useProgram };
const _ref_4ad2tj = { createDirectoryRecursive };
const _ref_cf4vxr = { setPan };
const _ref_yltfs9 = { sanitizeSQLInput };
const _ref_qvuzyo = { calculateMD5 };
const _ref_5bbfxu = { generateSourceMap };
const _ref_zts4zl = { queueDownloadTask };
const _ref_s0w85i = { linkModules };
const _ref_txxv8p = { allocateDiskSpace };
const _ref_oagkz1 = { inlineFunctions };
const _ref_v85hxo = { unchokePeer };
const _ref_ug6i91 = { createMeshShape };
const _ref_y10af7 = { verifyIR };
const _ref_63prd6 = { removeRigidBody };
const _ref_zzq487 = { enterScope };
const _ref_69og9x = { inferType };
const _ref_vyhhj9 = { rotateMatrix };
const _ref_2kd7zm = { estimateNonce };
const _ref_iq449g = { verifySignature };
const _ref_89iptu = { reportWarning };
const _ref_gf1hh0 = { defineSymbol };
const _ref_lxyudr = { createCapsuleShape };
const _ref_xwyxch = { computeDominators };
const _ref_fg31uf = { mangleNames };
const _ref_po93u8 = { setInertia };
const _ref_4i33x7 = { createSymbolTable };
const _ref_8jd2m4 = { dumpSymbolTable };
const _ref_fb1d5l = { suspendContext };
const _ref_2ll2uj = { discoverPeersDHT };
const _ref_xhfu4z = { deleteTexture };
const _ref_f9lpvt = { createSphereShape };
const _ref_b5pd56 = { invalidateCache };
const _ref_qeu1dp = { addRigidBody };
const _ref_v9nuuh = { injectCSPHeader };
const _ref_98ypbx = { validateIPWhitelist };
const _ref_4l4eih = { uniform1i };
const _ref_ftb26p = { wakeUp };
const _ref_2dj22j = { detectPacketLoss };
const _ref_f5cv68 = { checkIntegrity };
const _ref_brfari = { calculateSHA256 };
const _ref_hk7drk = { createConstraint };
const _ref_1zobe9 = { rotateLogFiles };
const _ref_hkfr29 = { setGainValue };
const _ref_eprfdz = { backupDatabase };
const _ref_n55izd = { createPhysicsWorld };
const _ref_lcbdc9 = { compressGzip };
const _ref_qtvzz7 = { getMemoryUsage };
const _ref_y147ra = { analyzeBitrate };
const _ref_5wgl1f = { applyTheme };
const _ref_kdynie = { setAngularVelocity };
const _ref_54pt4n = { receivePacket };
const _ref_iujohn = { decryptStream };
const _ref_swpg49 = { createParticleSystem };
const _ref_6r6ire = { manageCookieJar };
const _ref_qzs54s = { connectionPooling };
const _ref_i41pj0 = { validateFormInput };
const _ref_bbk284 = { resolveDependencyGraph };
const _ref_z426cg = { blockMaliciousTraffic };
const _ref_gqwj96 = { requestPiece };
const _ref_9ilbxq = { calculateEntropy };
const _ref_rav9a1 = { createPeriodicWave };
const _ref_o6c20y = { augmentData };
const _ref_ttnnjk = { detectEnvironment };
const _ref_ido5dp = { checkUpdate };
const _ref_pry6l4 = { optimizeHyperparameters };
const _ref_wzon1o = { FileValidator };
const _ref_hevbqr = { serializeFormData };
const _ref_uo5h11 = { auditAccessLogs };
const _ref_98chry = { handshakePeer };
const _ref_odq81k = { encryptLocalStorage };
const _ref_1c9bpy = { transcodeStream };
const _ref_qdgna3 = { autoResumeTask };
const _ref_20pe0t = { cacheQueryResults };
const _ref_5g69gu = { setVolumeLevel };
const _ref_6pe622 = { detectFirewallStatus };
const _ref_c2ipf7 = { getUniformLocation };
const _ref_65jzim = { initiateHandshake };
const _ref_vcx3p6 = { encryptPeerTraffic };
const _ref_zellj3 = { prefetchAssets };
const _ref_5zqfk1 = { detectObjectYOLO };
const _ref_y2fbbt = { traceStack };
const _ref_1sohws = { decryptHLSStream };
const _ref_rcqiv4 = { generateUUIDv5 };
const _ref_1hd3cu = { deleteTempFiles };
const _ref_0vhhcm = { normalizeVolume };
const _ref_if1sru = { chmodFile };
const _ref_e6n6li = { getVelocity };
const _ref_5s2r42 = { negotiateSession };
const _ref_yyyues = { dropTable };
const _ref_nuf1o1 = { loadDriver };
const _ref_z4qi16 = { monitorClipboard };
const _ref_v6zgly = { renderShadowMap };
const _ref_5rww4g = { convertFormat };
const _ref_d5piys = { encryptPayload };
const _ref_iu4b0j = { acceptConnection };
const _ref_ifzbfi = { getByteFrequencyData };
const _ref_bc2vrp = { restartApplication };
const _ref_m7lxvf = { formatLogMessage };
const _ref_7oi9di = { linkFile };
const _ref_vm3y2d = { lookupSymbol };
const _ref_di3n39 = { chownFile };
const _ref_xfrzhb = { emitParticles };
const _ref_lzunoo = { getAppConfig };
const _ref_yd4vuz = { debouncedResize };
const _ref_mg4vv9 = { stakeAssets };
const _ref_2qg0e6 = { broadcastMessage };
const _ref_jt0i8d = { parseM3U8Playlist };
const _ref_chibey = { profilePerformance };
const _ref_bjoa3v = { jitCompile };
const _ref_p2r0x4 = { compactDatabase };
const _ref_66s70a = { transformAesKey };
const _ref_hk51le = { parseConfigFile };
const _ref_uwwxvz = { executeSQLQuery };
const _ref_rpi9ym = { commitTransaction };
const _ref_bcn6sd = { loadCheckpoint };
const _ref_xfrcnw = { writeFile };
const _ref_azca9s = { shutdownComputer };
const _ref_x9b7t0 = { saveCheckpoint };
const _ref_mdmgun = { multicastMessage };
const _ref_1u3did = { computeLossFunction };
const _ref_gvplah = { interpretBytecode };
const _ref_azd4k8 = { visitNode };
const _ref_l4vaic = { limitUploadSpeed };
const _ref_zof73t = { vertexAttribPointer };
const _ref_mde599 = { setSocketTimeout };
const _ref_zuyskc = { addHingeConstraint };
const _ref_s7wqwy = { uniform3f };
const _ref_qagy6z = { measureRTT };
const _ref_spxkod = { lazyLoadComponent };
const _ref_5nk4tm = { closeSocket };
const _ref_bh44lp = { disconnectNodes };
const _ref_q2gv4x = { createMediaElementSource };
const _ref_jpvl4k = { activeTexture };
const _ref_hm2f39 = { lockRow };
const _ref_jaoqc5 = { encryptStream };
const _ref_j5hljj = { renderCanvasLayer };
const _ref_xzhx7j = { cullFace };
const _ref_cdtq3o = { setMass };
const _ref_pvl350 = { detectDarkMode };
const _ref_cft3pu = { spoofReferer };
const _ref_f1ox46 = { debounceAction };
const _ref_hcle8r = { allocateRegisters };
const _ref_ku996b = { addWheel };
const _ref_bi4b2u = { gaussianBlur };
const _ref_8ts5b1 = { calculateFriction };
const _ref_0xwa8a = { reassemblePacket };
const _ref_f0xajs = { createDelay };
const _ref_q2q3iz = { bufferMediaStream };
const _ref_20uzg8 = { limitBandwidth };
const _ref_jldyvv = { mockResponse };
const _ref_q3kzgn = { applyTorque };
const _ref_7f4va7 = { startOscillator };
const _ref_vsx48y = { disablePEX };
const _ref_uy9wry = { decodeABI };
const _ref_ngumv1 = { moveFileToComplete };
const _ref_okmk8z = { registerISR };
const _ref_2v4i5u = { dhcpAck };
const _ref_tzkdbh = { predictTensor };
const _ref_xydkf5 = { vertexAttrib3f };
const _ref_7af203 = { AdvancedCipher };
const _ref_h3heey = { setOrientation };
const _ref_q0dyj8 = { translateMatrix };
const _ref_9bg014 = { getSystemUptime };
const _ref_tpo805 = { hydrateSSR };
const _ref_fei34n = { announceToTracker };
const _ref_hoextg = { normalizeAudio };
const _ref_r1iz70 = { getExtension };
const _ref_dqv1bq = { clusterKMeans };
const _ref_gudabb = { parseQueryString };
const _ref_80te0a = { unrollLoops };
const _ref_9hhnrz = { removeConstraint };
const _ref_hbpjp0 = { monitorNetworkInterface };
const _ref_a26j3z = { splitFile }; 
    });
})({}, {});