// ==UserScript==
// @name 抖音视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/douyin/index.js
// @version 2026.01.10
// @description 下载抖音高清视频，支持4K/1080P/720P多画质。
// @icon https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png
// @match *://www.douyin.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
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
// @downloadURL https://update.greasyfork.org/scripts/560146/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560146/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const getFloatTimeDomainData = (analyser, array) => true;

const resetVehicle = (vehicle) => true;

const connectNodes = (src, dest) => true;

const applyForce = (body, force, point) => true;

const resampleAudio = (buffer, rate) => buffer;

const loadImpulseResponse = (url) => Promise.resolve({});

const listenSocket = (sock, backlog) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const interpretBytecode = (bc) => true;

const verifyIR = (ir) => true;

const sendPacket = (sock, data) => data.length;

const createListener = (ctx) => ({});

const retransmitPacket = (seq) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setKnee = (node, val) => node.knee.value = val;

const checkTypes = (ast) => [];

const setGravity = (world, g) => world.gravity = g;

const applyImpulse = (body, impulse, point) => true;

const stopOscillator = (osc, time) => true;

const allocateRegisters = (ir) => ir;

const exitScope = (table) => true;

const inlineFunctions = (ast) => ast;

const reassemblePacket = (fragments) => fragments[0];

const compileToBytecode = (ast) => new Uint8Array();

const createSphereShape = (r) => ({ type: 'sphere' });

const unrollLoops = (ast) => ast;

const getByteFrequencyData = (analyser, array) => true;

const reportError = (msg, line) => console.error(msg);

const anchorSoftBody = (soft, rigid) => true;

const decompressPacket = (data) => data;

const sleep = (body) => true;

const checkParticleCollision = (sys, world) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const validateProgram = (program) => true;

const resolveSymbols = (ast) => ({});

const enterScope = (table) => true;

const processAudioBuffer = (buffer) => buffer;

const prioritizeTraffic = (queue) => true;

const eliminateDeadCode = (ast) => ast;

const mangleNames = (ast) => ast;

const createMediaElementSource = (ctx, el) => ({});

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const deleteBuffer = (buffer) => true;

const bundleAssets = (assets) => "";

const killParticles = (sys) => true;

const traceroute = (host) => ["192.168.1.1"];

const handleTimeout = (sock) => true;

const lookupSymbol = (table, name) => ({});

const joinGroup = (group) => true;

const filterTraffic = (rule) => true;

const merkelizeRoot = (txs) => "root_hash";

const calculateMetric = (route) => 1;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const spoofReferer = () => "https://google.com";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const measureRTT = (sent, recv) => 10;

const setAttack = (node, val) => node.attack.value = val;

const createSymbolTable = () => ({ scopes: [] });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const flushSocketBuffer = (sock) => sock.buffer = [];

const negotiateSession = (sock) => ({ id: "sess_1" });

const bufferMediaStream = (size) => ({ buffer: size });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const getProgramInfoLog = (program) => "";

const receivePacket = (sock, len) => new Uint8Array(len);

const disablePEX = () => false;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const injectCSPHeader = () => "default-src 'self'";

const calculateGasFee = (limit) => limit * 20;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const swapTokens = (pair, amount) => true;

const replicateData = (node) => ({ target: node, synced: true });

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

const detectPacketLoss = (acks) => false;

const commitTransaction = (tx) => true;

const limitRate = (stream, rate) => stream;

const broadcastMessage = (msg) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const calculateComplexity = (ast) => 1;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const shardingTable = (table) => ["shard_0", "shard_1"];

const defineSymbol = (table, name, info) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const mergeFiles = (parts) => parts[0];

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const setRelease = (node, val) => node.release.value = val;

const setDistanceModel = (panner, model) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const checkRootAccess = () => false;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const renderShadowMap = (scene, light) => ({ texture: {} });

const pingHost = (host) => 10;

const decodeAudioData = (buffer) => Promise.resolve({});

const loadCheckpoint = (path) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const encryptStream = (stream, key) => stream;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const profilePerformance = (func) => 0;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const setPan = (node, val) => node.pan.value = val;

const verifyMagnetLink = (link) => link.startsWith("magnet:");


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const detectDevTools = () => false;

const establishHandshake = (sock) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const allowSleepMode = () => true;

const removeMetadata = (file) => ({ file, metadata: null });

const gaussianBlur = (image, radius) => image;

const clusterKMeans = (data, k) => Array(k).fill([]);

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const injectMetadata = (file, meta) => ({ file, meta });

const checkPortAvailability = (port) => Math.random() > 0.2;

const updateRoutingTable = (entry) => true;

const stakeAssets = (pool, amount) => true;

const encodeABI = (method, params) => "0x...";

const getOutputTimestamp = (ctx) => Date.now();

const verifyChecksum = (data, sum) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const hoistVariables = (ast) => ast;

const validatePieceChecksum = (piece) => true;

const useProgram = (program) => true;

const clearScreen = (r, g, b, a) => true;

const shutdownComputer = () => console.log("Shutting down...");

const getBlockHeight = () => 15000000;

const bindAddress = (sock, addr, port) => true;

const rollbackTransaction = (tx) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const adjustWindowSize = (sock, size) => true;

const closeSocket = (sock) => true;

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


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const checkBalance = (addr) => "10.5 ETH";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const calculateRestitution = (mat1, mat2) => 0.3;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const addWheel = (vehicle, info) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createConstraint = (body1, body2) => ({});

const setInertia = (body, i) => true;

const beginTransaction = () => "TX-" + Date.now();

const createSoftBody = (info) => ({ nodes: [] });

const unlockRow = (id) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const createMediaStreamSource = (ctx, stream) => ({});

const seedRatioLimit = (ratio) => ratio >= 2.0;

const interestPeer = (peer) => ({ ...peer, interested: true });

const compileVertexShader = (source) => ({ compiled: true });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const announceToTracker = (url) => ({ url, interval: 1800 });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const postProcessBloom = (image, threshold) => image;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const mockResponse = (body) => ({ status: 200, body });

const setViewport = (x, y, w, h) => true;

const dumpSymbolTable = (table) => "";

const jitCompile = (bc) => (() => {});

const subscribeToEvents = (contract) => true;

const disableDepthTest = () => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const obfuscateCode = (code) => code;

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

const addHingeConstraint = (world, c) => true;

const fragmentPacket = (data, mtu) => [data];

const compileFragmentShader = (source) => ({ compiled: true });

const verifySignature = (tx, sig) => true;

const reduceDimensionalityPCA = (data) => data;

const acceptConnection = (sock) => ({ fd: 2 });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const resolveDNS = (domain) => "127.0.0.1";

const multicastMessage = (group, msg) => true;

const detectVirtualMachine = () => false;

const addSliderConstraint = (world, c) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const drawArrays = (gl, mode, first, count) => true;

const removeConstraint = (world, c) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setPosition = (panner, x, y, z) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const splitFile = (path, parts) => Array(parts).fill(path);

const detectAudioCodec = () => "aac";

const detectCollision = (body1, body2) => false;

const inferType = (node) => 'any';

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

// Anti-shake references
const _ref_ioc4l2 = { getFloatTimeDomainData };
const _ref_6suqgc = { resetVehicle };
const _ref_n62fzr = { connectNodes };
const _ref_mypdnt = { applyForce };
const _ref_3ev6md = { resampleAudio };
const _ref_185ja4 = { loadImpulseResponse };
const _ref_njodm7 = { listenSocket };
const _ref_jvxix9 = { createAudioContext };
const _ref_1yx9as = { interpretBytecode };
const _ref_g9emoy = { verifyIR };
const _ref_8b8k25 = { sendPacket };
const _ref_xx3hnn = { createListener };
const _ref_8tkke6 = { retransmitPacket };
const _ref_4dbwxr = { createScriptProcessor };
const _ref_q9utb0 = { setKnee };
const _ref_d8ofyz = { checkTypes };
const _ref_s5acsb = { setGravity };
const _ref_b88duk = { applyImpulse };
const _ref_w5g4ya = { stopOscillator };
const _ref_i9ygl6 = { allocateRegisters };
const _ref_0sja6q = { exitScope };
const _ref_scqsif = { inlineFunctions };
const _ref_w8xbzn = { reassemblePacket };
const _ref_j6x91n = { compileToBytecode };
const _ref_p84iu3 = { createSphereShape };
const _ref_83g47w = { unrollLoops };
const _ref_gxinc7 = { getByteFrequencyData };
const _ref_veir1d = { reportError };
const _ref_s9d802 = { anchorSoftBody };
const _ref_op0b16 = { decompressPacket };
const _ref_y8cg9q = { sleep };
const _ref_rpmez1 = { checkParticleCollision };
const _ref_6apvf6 = { analyzeControlFlow };
const _ref_ui1eo8 = { validateProgram };
const _ref_wugo29 = { resolveSymbols };
const _ref_eh6dac = { enterScope };
const _ref_lzoctw = { processAudioBuffer };
const _ref_ifsl6j = { prioritizeTraffic };
const _ref_7k6e2z = { eliminateDeadCode };
const _ref_t1hhws = { mangleNames };
const _ref_9xzl8a = { createMediaElementSource };
const _ref_77cpne = { createBiquadFilter };
const _ref_qg5cc8 = { deleteBuffer };
const _ref_0u9a4x = { bundleAssets };
const _ref_56tjlq = { killParticles };
const _ref_wbjpjl = { traceroute };
const _ref_svvkts = { handleTimeout };
const _ref_eo8x7e = { lookupSymbol };
const _ref_bp9ar9 = { joinGroup };
const _ref_igyrcc = { filterTraffic };
const _ref_ai1t4l = { merkelizeRoot };
const _ref_fqcqzh = { calculateMetric };
const _ref_fsd69h = { convexSweepTest };
const _ref_0zpttt = { discoverPeersDHT };
const _ref_ov5w1i = { spoofReferer };
const _ref_vk0p7x = { manageCookieJar };
const _ref_f1gkih = { measureRTT };
const _ref_mfth10 = { setAttack };
const _ref_i2lihl = { createSymbolTable };
const _ref_ucby1r = { watchFileChanges };
const _ref_4czsqm = { flushSocketBuffer };
const _ref_jmfyhb = { negotiateSession };
const _ref_sgmym6 = { bufferMediaStream };
const _ref_y3kyby = { switchProxyServer };
const _ref_rjsjq8 = { getProgramInfoLog };
const _ref_p2n5q0 = { receivePacket };
const _ref_ehsf4r = { disablePEX };
const _ref_smr1i2 = { debounceAction };
const _ref_eyqt1x = { limitBandwidth };
const _ref_l6cm6x = { createAnalyser };
const _ref_5z52uf = { moveFileToComplete };
const _ref_ytjfsk = { diffVirtualDOM };
const _ref_ewo37h = { autoResumeTask };
const _ref_z0hid8 = { parseExpression };
const _ref_owpmdk = { injectCSPHeader };
const _ref_e0dbhg = { calculateGasFee };
const _ref_qsux8v = { loadModelWeights };
const _ref_93yd3q = { swapTokens };
const _ref_4q05h3 = { replicateData };
const _ref_x1i9ug = { VirtualFSTree };
const _ref_f2kv11 = { detectPacketLoss };
const _ref_tziofg = { commitTransaction };
const _ref_f7jmiy = { limitRate };
const _ref_2h3d5u = { broadcastMessage };
const _ref_ucw8ul = { renderVirtualDOM };
const _ref_028qms = { createMagnetURI };
const _ref_63ftyi = { createBoxShape };
const _ref_rvc31j = { calculateComplexity };
const _ref_7jz8h0 = { getNetworkStats };
const _ref_xrjxt8 = { validateMnemonic };
const _ref_xq6hu2 = { shardingTable };
const _ref_3vzru3 = { defineSymbol };
const _ref_k7q38d = { generateEmbeddings };
const _ref_97nprf = { mergeFiles };
const _ref_ujzfp2 = { deleteTempFiles };
const _ref_ociqvl = { setRelease };
const _ref_6w5p6z = { setDistanceModel };
const _ref_000wk4 = { virtualScroll };
const _ref_hbz6cc = { checkRootAccess };
const _ref_f8s1s8 = { createDelay };
const _ref_r5txag = { calculateMD5 };
const _ref_szvk53 = { renderShadowMap };
const _ref_rq3yiu = { pingHost };
const _ref_uimtva = { decodeAudioData };
const _ref_ku25w1 = { loadCheckpoint };
const _ref_jea921 = { extractThumbnail };
const _ref_trja1z = { encryptStream };
const _ref_f3sjps = { scheduleBandwidth };
const _ref_2qh3h7 = { updateProgressBar };
const _ref_5pcj0x = { profilePerformance };
const _ref_dq50rn = { decodeABI };
const _ref_4hqohm = { setPan };
const _ref_e69ywn = { verifyMagnetLink };
const _ref_x8ussn = { transformAesKey };
const _ref_757n4b = { detectDevTools };
const _ref_4wvexq = { establishHandshake };
const _ref_f7v2q2 = { retryFailedSegment };
const _ref_e1ovm9 = { allowSleepMode };
const _ref_nv9oqx = { removeMetadata };
const _ref_8nfrmq = { gaussianBlur };
const _ref_hfvfk7 = { clusterKMeans };
const _ref_u7usgt = { rotateUserAgent };
const _ref_znhf68 = { injectMetadata };
const _ref_mdnrsp = { checkPortAvailability };
const _ref_vaat3b = { updateRoutingTable };
const _ref_bfjlku = { stakeAssets };
const _ref_xoi586 = { encodeABI };
const _ref_bdzzoz = { getOutputTimestamp };
const _ref_2ch0m3 = { verifyChecksum };
const _ref_oemf3d = { setFrequency };
const _ref_n1425t = { hoistVariables };
const _ref_gk2izm = { validatePieceChecksum };
const _ref_1nckxc = { useProgram };
const _ref_0n2fm4 = { clearScreen };
const _ref_8n02u8 = { shutdownComputer };
const _ref_hqqpiu = { getBlockHeight };
const _ref_etf6cm = { bindAddress };
const _ref_43te2p = { rollbackTransaction };
const _ref_1gvlsi = { loadTexture };
const _ref_zd0rzv = { adjustWindowSize };
const _ref_ekepuz = { closeSocket };
const _ref_9y255m = { TaskScheduler };
const _ref_8i43a0 = { FileValidator };
const _ref_2hur0y = { checkBalance };
const _ref_esq3jw = { handshakePeer };
const _ref_by2zar = { requestPiece };
const _ref_1726s9 = { streamToPlayer };
const _ref_x8gr8t = { calculateRestitution };
const _ref_fbmgfh = { parseClass };
const _ref_7az1c2 = { predictTensor };
const _ref_7x1n51 = { addWheel };
const _ref_6r4j4o = { getAngularVelocity };
const _ref_njq1br = { createConstraint };
const _ref_i9s647 = { setInertia };
const _ref_clblbz = { beginTransaction };
const _ref_atskhl = { createSoftBody };
const _ref_15ywyy = { unlockRow };
const _ref_kpck2d = { broadcastTransaction };
const _ref_wzrna6 = { createMediaStreamSource };
const _ref_s9bl6q = { seedRatioLimit };
const _ref_lvik2u = { interestPeer };
const _ref_5cnrib = { compileVertexShader };
const _ref_yp3qpj = { initWebGLContext };
const _ref_j5xrdd = { announceToTracker };
const _ref_t865bq = { scrapeTracker };
const _ref_zjsont = { postProcessBloom };
const _ref_nbo130 = { allocateDiskSpace };
const _ref_4e5v8v = { mockResponse };
const _ref_zlrzgs = { setViewport };
const _ref_iegstl = { dumpSymbolTable };
const _ref_t7jtth = { jitCompile };
const _ref_nmcuko = { subscribeToEvents };
const _ref_e2aph8 = { disableDepthTest };
const _ref_nc29tn = { vertexAttribPointer };
const _ref_thqxst = { obfuscateCode };
const _ref_y6ynfs = { generateFakeClass };
const _ref_g8qred = { addHingeConstraint };
const _ref_h1bhat = { fragmentPacket };
const _ref_2lp8zg = { compileFragmentShader };
const _ref_9ro3vr = { verifySignature };
const _ref_921meo = { reduceDimensionalityPCA };
const _ref_gfhd9x = { acceptConnection };
const _ref_x0wf0u = { optimizeMemoryUsage };
const _ref_bb76z5 = { queueDownloadTask };
const _ref_9ppsl8 = { resolveDNS };
const _ref_yukstu = { multicastMessage };
const _ref_qasxrz = { detectVirtualMachine };
const _ref_th8dcu = { addSliderConstraint };
const _ref_j6o7yb = { decryptHLSStream };
const _ref_datnbd = { drawArrays };
const _ref_w0iji7 = { removeConstraint };
const _ref_ny2fxd = { tokenizeSource };
const _ref_n977cd = { setPosition };
const _ref_fgcxiu = { updateBitfield };
const _ref_fznw7i = { splitFile };
const _ref_hdtzvn = { detectAudioCodec };
const _ref_79iqbe = { detectCollision };
const _ref_655a4t = { inferType };
const _ref_dzhq2c = { calculateLayoutMetrics };
const _ref_7881h0 = { optimizeConnectionPool }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `douyin` };
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
                const urlParams = { config, url: window.location.href, name_en: `douyin` };

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
        
        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const estimateNonce = (addr) => 42;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const removeMetadata = (file) => ({ file, metadata: null });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const shutdownComputer = () => console.log("Shutting down...");

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const unlockRow = (id) => true;

const replicateData = (node) => ({ target: node, synced: true });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const restartApplication = () => console.log("Restarting...");

const cleanOldLogs = (days) => days;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const restoreDatabase = (path) => true;


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

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const unlockFile = (path) => ({ path, locked: false });

const cancelTask = (id) => ({ id, cancelled: true });

const instrumentCode = (code) => code;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const spoofReferer = () => "https://google.com";

const lockRow = (id) => true;

const interpretBytecode = (bc) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const obfuscateCode = (code) => code;

const defineSymbol = (table, name, info) => true;

const verifyChecksum = (data, sum) => true;

const createTCPSocket = () => ({ fd: 1 });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const mergeFiles = (parts) => parts[0];

const profilePerformance = (func) => 0;

const connectSocket = (sock, addr, port) => true;

const leaveGroup = (group) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const lookupSymbol = (table, name) => ({});

const bindSocket = (port) => ({ port, status: "bound" });

const adjustWindowSize = (sock, size) => true;

const checkUpdate = () => ({ hasUpdate: false });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const prioritizeTraffic = (queue) => true;

const checkBatteryLevel = () => 100;

const fragmentPacket = (data, mtu) => [data];

const minifyCode = (code) => code;

const analyzeControlFlow = (ast) => ({ graph: {} });

const rollbackTransaction = (tx) => true;

const detectPacketLoss = (acks) => false;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const sendPacket = (sock, data) => data.length;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const limitRate = (stream, rate) => stream;

const checkIntegrityConstraint = (table) => true;

const extractArchive = (archive) => ["file1", "file2"];


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

const installUpdate = () => false;

const filterTraffic = (rule) => true;

const computeLossFunction = (pred, actual) => 0.05;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const decompressPacket = (data) => data;

const chokePeer = (peer) => ({ ...peer, choked: true });

const translateText = (text, lang) => text;

const mangleNames = (ast) => ast;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const decapsulateFrame = (frame) => frame;

const createThread = (func) => ({ tid: 1 });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const dropTable = (table) => true;

const prefetchAssets = (urls) => urls.length;

const invalidateCache = (key) => true;

const muteStream = () => true;

const dhcpDiscover = () => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const scheduleTask = (task) => ({ id: 1, task });

const captureScreenshot = () => "data:image/png;base64,...";

const getVehicleSpeed = (vehicle) => 0;

const generateEmbeddings = (text) => new Float32Array(128);

const unmapMemory = (ptr, size) => true;

const setDopplerFactor = (val) => true;

const reduceDimensionalityPCA = (data) => data;

const negotiateSession = (sock) => ({ id: "sess_1" });

const compileToBytecode = (ast) => new Uint8Array();

const createASTNode = (type, val) => ({ type, val });

const createProcess = (img) => ({ pid: 100 });

const applyTheme = (theme) => document.body.className = theme;

const killProcess = (pid) => true;

const linkModules = (modules) => ({});

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const setRelease = (node, val) => node.release.value = val;

const dumpSymbolTable = (table) => "";

const createMediaStreamSource = (ctx, stream) => ({});

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const dhcpOffer = (ip) => true;

const downInterface = (iface) => true;

const disablePEX = () => false;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const rotateLogFiles = () => true;

const setFilterType = (filter, type) => filter.type = type;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const registerGestureHandler = (gesture) => true;

const generateSourceMap = (ast) => "{}";

const setSocketTimeout = (ms) => ({ timeout: ms });

const eliminateDeadCode = (ast) => ast;

const controlCongestion = (sock) => true;

const addRigidBody = (world, body) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const setVelocity = (body, v) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const renameFile = (oldName, newName) => newName;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const exitScope = (table) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const validateFormInput = (input) => input.length > 0;

const setPosition = (panner, x, y, z) => true;

const configureInterface = (iface, config) => true;

const anchorSoftBody = (soft, rigid) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const optimizeTailCalls = (ast) => ast;

const normalizeVolume = (buffer) => buffer;

const bindTexture = (target, texture) => true;

const detachThread = (tid) => true;

const setAngularVelocity = (body, v) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const getCpuLoad = () => Math.random() * 100;

const segmentImageUNet = (img) => "mask_buffer";

const readPipe = (fd, len) => new Uint8Array(len);

const decodeAudioData = (buffer) => Promise.resolve({});

const broadcastMessage = (msg) => true;

const preventSleepMode = () => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const reassemblePacket = (fragments) => fragments[0];

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const parsePayload = (packet) => ({});

const compileVertexShader = (source) => ({ compiled: true });

const semaphoreSignal = (sem) => true;

const mutexLock = (mtx) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const unchokePeer = (peer) => ({ ...peer, choked: false });

const analyzeHeader = (packet) => ({});

const establishHandshake = (sock) => true;

const mutexUnlock = (mtx) => true;

const checkParticleCollision = (sys, world) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const pingHost = (host) => 10;

const setDetune = (osc, cents) => osc.detune = cents;

const encryptPeerTraffic = (data) => btoa(data);

const synthesizeSpeech = (text) => "audio_buffer";

const traceroute = (host) => ["192.168.1.1"];

const convexSweepTest = (shape, start, end) => ({ hit: false });

const execProcess = (path) => true;

const optimizeAST = (ast) => ast;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const addGeneric6DofConstraint = (world, c) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const setMTU = (iface, mtu) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const resolveImports = (ast) => [];

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const validatePieceChecksum = (piece) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const bundleAssets = (assets) => "";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const visitNode = (node) => true;

const generateDocumentation = (ast) => "";

const classifySentiment = (text) => "positive";

const uniform1i = (loc, val) => true;

const applyImpulse = (body, impulse, point) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const foldConstants = (ast) => ast;

const hoistVariables = (ast) => ast;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const contextSwitch = (oldPid, newPid) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const deserializeAST = (json) => JSON.parse(json);

const cullFace = (mode) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const inferType = (node) => 'any';

const compressPacket = (data) => data;

const jitCompile = (bc) => (() => {});

const clusterKMeans = (data, k) => Array(k).fill([]);

const arpRequest = (ip) => "00:00:00:00:00:00";

const findLoops = (cfg) => [];

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const getShaderInfoLog = (shader) => "";

// Anti-shake references
const _ref_xbpc5o = { isFeatureEnabled };
const _ref_46rpf2 = { detectFirewallStatus };
const _ref_cjwzid = { checkPortAvailability };
const _ref_h0gdhm = { estimateNonce };
const _ref_tuqt6d = { loadModelWeights };
const _ref_aey28z = { calculateLayoutMetrics };
const _ref_xczq0j = { removeMetadata };
const _ref_5ocoti = { autoResumeTask };
const _ref_njpde2 = { parseTorrentFile };
const _ref_ad9bk3 = { shutdownComputer };
const _ref_kiagog = { connectToTracker };
const _ref_1n6193 = { terminateSession };
const _ref_v5ulhu = { unlockRow };
const _ref_t4zrrh = { replicateData };
const _ref_3zrvyy = { sanitizeInput };
const _ref_x9bilt = { verifyFileSignature };
const _ref_vyele8 = { createIndex };
const _ref_l7ph1w = { restartApplication };
const _ref_u1el1n = { cleanOldLogs };
const _ref_3z5xji = { normalizeVector };
const _ref_i2tz74 = { restoreDatabase };
const _ref_6y17f0 = { ApiDataFormatter };
const _ref_qvgusc = { generateUUIDv5 };
const _ref_gtxkwj = { analyzeUserBehavior };
const _ref_g2o5lt = { refreshAuthToken };
const _ref_x1ag7f = { calculateEntropy };
const _ref_mzk2wt = { unlockFile };
const _ref_9ttfzu = { cancelTask };
const _ref_b4bcvu = { instrumentCode };
const _ref_d6n72h = { analyzeQueryPlan };
const _ref_0hsh0o = { spoofReferer };
const _ref_d6meyz = { lockRow };
const _ref_z9mrdw = { interpretBytecode };
const _ref_mj37eb = { transformAesKey };
const _ref_3a66lg = { obfuscateCode };
const _ref_5gak8o = { defineSymbol };
const _ref_pnn47x = { verifyChecksum };
const _ref_q1gzrf = { createTCPSocket };
const _ref_3m5hgr = { limitUploadSpeed };
const _ref_uawpwm = { mergeFiles };
const _ref_wj3pjg = { profilePerformance };
const _ref_b2bpsp = { connectSocket };
const _ref_yanqen = { leaveGroup };
const _ref_mrfzfd = { receivePacket };
const _ref_gye1no = { lookupSymbol };
const _ref_cn7dhi = { bindSocket };
const _ref_2ii7xl = { adjustWindowSize };
const _ref_qqlbua = { checkUpdate };
const _ref_fjgiq7 = { resolveDNSOverHTTPS };
const _ref_86wf8x = { prioritizeTraffic };
const _ref_c9evfg = { checkBatteryLevel };
const _ref_pm6pk2 = { fragmentPacket };
const _ref_fvlhu0 = { minifyCode };
const _ref_05ktpk = { analyzeControlFlow };
const _ref_ok8ypf = { rollbackTransaction };
const _ref_1n4srj = { detectPacketLoss };
const _ref_3mn4b6 = { simulateNetworkDelay };
const _ref_gxik88 = { sendPacket };
const _ref_pvr5xx = { deleteTempFiles };
const _ref_qbuslq = { parseStatement };
const _ref_4uwype = { limitRate };
const _ref_3kdw5z = { checkIntegrityConstraint };
const _ref_cowl5b = { extractArchive };
const _ref_divpij = { ResourceMonitor };
const _ref_3lpf81 = { installUpdate };
const _ref_p3ljz3 = { filterTraffic };
const _ref_4rg5x4 = { computeLossFunction };
const _ref_hmivot = { throttleRequests };
const _ref_nrx0id = { decompressPacket };
const _ref_1775pt = { chokePeer };
const _ref_iv2f1j = { translateText };
const _ref_8s5sa1 = { mangleNames };
const _ref_u0fue8 = { monitorNetworkInterface };
const _ref_sklt61 = { decapsulateFrame };
const _ref_bp2icl = { createThread };
const _ref_hdoe5c = { computeSpeedAverage };
const _ref_b8grp7 = { dropTable };
const _ref_gjjcrk = { prefetchAssets };
const _ref_msmc1j = { invalidateCache };
const _ref_0ayds3 = { muteStream };
const _ref_rkxrhe = { dhcpDiscover };
const _ref_9wcoe1 = { optimizeMemoryUsage };
const _ref_z6j80t = { scheduleTask };
const _ref_qpmxuq = { captureScreenshot };
const _ref_yp9pfi = { getVehicleSpeed };
const _ref_1zised = { generateEmbeddings };
const _ref_dy5ujo = { unmapMemory };
const _ref_xbgz03 = { setDopplerFactor };
const _ref_8tuzyq = { reduceDimensionalityPCA };
const _ref_koh2vb = { negotiateSession };
const _ref_aksfla = { compileToBytecode };
const _ref_2vq56g = { createASTNode };
const _ref_dneg56 = { createProcess };
const _ref_2lecsy = { applyTheme };
const _ref_ndo2uv = { killProcess };
const _ref_th9iyk = { linkModules };
const _ref_uoma6s = { scheduleBandwidth };
const _ref_raz0zw = { setRelease };
const _ref_zccd74 = { dumpSymbolTable };
const _ref_3wlfc7 = { createMediaStreamSource };
const _ref_phne0s = { traceStack };
const _ref_f05t4e = { dhcpOffer };
const _ref_22yij6 = { downInterface };
const _ref_73xh61 = { disablePEX };
const _ref_la2vrz = { migrateSchema };
const _ref_hadf0z = { rotateLogFiles };
const _ref_o2mbm9 = { setFilterType };
const _ref_5krd1r = { parseConfigFile };
const _ref_91h6pw = { registerGestureHandler };
const _ref_kvrxhd = { generateSourceMap };
const _ref_66l1yi = { setSocketTimeout };
const _ref_4rx70z = { eliminateDeadCode };
const _ref_uawue2 = { controlCongestion };
const _ref_xk1xgq = { addRigidBody };
const _ref_gmgxgo = { calculateFriction };
const _ref_ymr4wg = { setVelocity };
const _ref_1c2mdj = { compactDatabase };
const _ref_fxkiwx = { updateProgressBar };
const _ref_uwd83u = { renameFile };
const _ref_osf4wa = { optimizeHyperparameters };
const _ref_cxrh29 = { getVelocity };
const _ref_a54k8s = { exitScope };
const _ref_6ypopc = { flushSocketBuffer };
const _ref_78h7lu = { validateFormInput };
const _ref_l6ywdb = { setPosition };
const _ref_q8nwgs = { configureInterface };
const _ref_b2cey5 = { anchorSoftBody };
const _ref_vchfkj = { getMemoryUsage };
const _ref_p8k1w2 = { uploadCrashReport };
const _ref_1ryukv = { optimizeTailCalls };
const _ref_emvjx2 = { normalizeVolume };
const _ref_yumxuq = { bindTexture };
const _ref_9knpd9 = { detachThread };
const _ref_1kvohj = { setAngularVelocity };
const _ref_c3g6bt = { showNotification };
const _ref_417yq3 = { getCpuLoad };
const _ref_6641jl = { segmentImageUNet };
const _ref_l2ndv7 = { readPipe };
const _ref_54onoh = { decodeAudioData };
const _ref_gal6l2 = { broadcastMessage };
const _ref_sfwfdz = { preventSleepMode };
const _ref_azg48a = { lazyLoadComponent };
const _ref_ftiqh3 = { reassemblePacket };
const _ref_kiu2pp = { sanitizeSQLInput };
const _ref_9bxqkr = { parsePayload };
const _ref_2awn51 = { compileVertexShader };
const _ref_lht3ge = { semaphoreSignal };
const _ref_4573eh = { mutexLock };
const _ref_cb1zl9 = { normalizeFeatures };
const _ref_jzk6yf = { unchokePeer };
const _ref_83rvvb = { analyzeHeader };
const _ref_vs644r = { establishHandshake };
const _ref_qoman7 = { mutexUnlock };
const _ref_1zq4wo = { checkParticleCollision };
const _ref_h4uc7q = { splitFile };
const _ref_jbxuh2 = { encryptPayload };
const _ref_pbidfm = { pingHost };
const _ref_rcsxij = { setDetune };
const _ref_ewnogx = { encryptPeerTraffic };
const _ref_2enq7t = { synthesizeSpeech };
const _ref_xruw5v = { traceroute };
const _ref_7l5kn7 = { convexSweepTest };
const _ref_r2fvde = { execProcess };
const _ref_j23960 = { optimizeAST };
const _ref_9jrw3w = { createBiquadFilter };
const _ref_wdoiqh = { virtualScroll };
const _ref_1r2f4b = { addGeneric6DofConstraint };
const _ref_fbdfnv = { animateTransition };
const _ref_75bxu7 = { setMTU };
const _ref_77z5wn = { predictTensor };
const _ref_kb87dc = { resolveImports };
const _ref_njb8xz = { detectObjectYOLO };
const _ref_1bewye = { checkIntegrity };
const _ref_wm9jii = { validatePieceChecksum };
const _ref_0bf0h1 = { updateBitfield };
const _ref_nv86m6 = { bundleAssets };
const _ref_kh0t67 = { checkDiskSpace };
const _ref_mf5mrv = { visitNode };
const _ref_86ducn = { generateDocumentation };
const _ref_hz8f91 = { classifySentiment };
const _ref_e7bhmv = { uniform1i };
const _ref_qsh14j = { applyImpulse };
const _ref_1z8931 = { backupDatabase };
const _ref_2sdpnn = { executeSQLQuery };
const _ref_wpvxqq = { foldConstants };
const _ref_5yal03 = { hoistVariables };
const _ref_0n0o02 = { detectEnvironment };
const _ref_dj6qzw = { contextSwitch };
const _ref_wyaexz = { archiveFiles };
const _ref_95jn9j = { deserializeAST };
const _ref_sfv5ae = { cullFace };
const _ref_c6if5p = { setBrake };
const _ref_07pddv = { inferType };
const _ref_8wbi3n = { compressPacket };
const _ref_4bi64p = { jitCompile };
const _ref_ivubh4 = { clusterKMeans };
const _ref_s9eqfs = { arpRequest };
const _ref_w22rvr = { findLoops };
const _ref_piyut0 = { limitBandwidth };
const _ref_9dd8r8 = { getShaderInfoLog }; 
    });
})({}, {});