// ==UserScript==
// @name PearVideo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/PearVideo/index.js
// @version 2026.01.10
// @description 一键下载PearVideo视频，支持4K/1080P/720P多画质。
// @icon https://page.pearvideo.com/webres/img/favicon.ico
// @match *://*.pearvideo.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect pearvideo.com
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
// @downloadURL https://update.greasyfork.org/scripts/562260/PearVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562260/PearVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const exitScope = (table) => true;

const getCpuLoad = () => Math.random() * 100;

const disableRightClick = () => true;

const detectVideoCodec = () => "h264";

const preventSleepMode = () => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const announceToTracker = (url) => ({ url, interval: 1800 });

const enableDHT = () => true;

const checkBatteryLevel = () => 100;

const calculateFriction = (mat1, mat2) => 0.5;

const attachRenderBuffer = (fb, rb) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const setQValue = (filter, q) => filter.Q = q;

const uniformMatrix4fv = (loc, transpose, val) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const clearScreen = (r, g, b, a) => true;

const activeTexture = (unit) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const setVolumeLevel = (vol) => vol;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const disconnectNodes = (node) => true;

const suspendContext = (ctx) => Promise.resolve();

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const unlockFile = (path) => ({ path, locked: false });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const eliminateDeadCode = (ast) => ast;

const removeRigidBody = (world, body) => true;

const estimateNonce = (addr) => 42;

const generateCode = (ast) => "const a = 1;";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const setPosition = (panner, x, y, z) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const remuxContainer = (container) => ({ container, status: "done" });

const getFloatTimeDomainData = (analyser, array) => true;

const addPoint2PointConstraint = (world, c) => true;

const deleteBuffer = (buffer) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const getExtension = (name) => ({});

const getProgramInfoLog = (program) => "";

const computeLossFunction = (pred, actual) => 0.05;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setFilePermissions = (perm) => `chmod ${perm}`;

const repairCorruptFile = (path) => ({ path, repaired: true });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const generateEmbeddings = (text) => new Float32Array(128);

const createPeriodicWave = (ctx, real, imag) => ({});

const blockMaliciousTraffic = (ip) => true;

const validateProgram = (program) => true;

const getByteFrequencyData = (analyser, array) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const addWheel = (vehicle, info) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const chmodFile = (path, mode) => true;

const scaleMatrix = (mat, vec) => mat;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const profilePerformance = (func) => 0;

const enterScope = (table) => true;

const encryptLocalStorage = (key, val) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const acceptConnection = (sock) => ({ fd: 2 });

const mangleNames = (ast) => ast;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const rotateMatrix = (mat, angle, axis) => mat;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const generateSourceMap = (ast) => "{}";

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const broadcastMessage = (msg) => true;

const applyTheme = (theme) => document.body.className = theme;

const detachThread = (tid) => true;

const createASTNode = (type, val) => ({ type, val });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setDetune = (osc, cents) => osc.detune = cents;

const encryptPeerTraffic = (data) => btoa(data);

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const createSymbolTable = () => ({ scopes: [] });

const setBrake = (vehicle, force, wheelIdx) => true;

const unmuteStream = () => false;

const broadcastTransaction = (tx) => "tx_hash_123";

const reportError = (msg, line) => console.error(msg);

const stepSimulation = (world, dt) => true;

const handleTimeout = (sock) => true;

const traverseAST = (node, visitor) => true;

const checkIntegrityConstraint = (table) => true;

const checkBalance = (addr) => "10.5 ETH";

const controlCongestion = (sock) => true;

const encapsulateFrame = (packet) => packet;

const computeDominators = (cfg) => ({});

const joinGroup = (group) => true;

const createSoftBody = (info) => ({ nodes: [] });

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

const cleanOldLogs = (days) => days;

const injectMetadata = (file, meta) => ({ file, meta });

const disableDepthTest = () => true;

const classifySentiment = (text) => "positive";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const installUpdate = () => false;

const setMTU = (iface, mtu) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const protectMemory = (ptr, size, flags) => true;

const detectDarkMode = () => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const checkGLError = () => 0;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const postProcessBloom = (image, threshold) => image;

const preventCSRF = () => "csrf_token";

const reassemblePacket = (fragments) => fragments[0];

const loadCheckpoint = (path) => true;

const wakeUp = (body) => true;

const compileVertexShader = (source) => ({ compiled: true });

const leaveGroup = (group) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const swapTokens = (pair, amount) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const enableBlend = (func) => true;

const parsePayload = (packet) => ({});

const resolveCollision = (manifold) => true;

const setDistanceModel = (panner, model) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const lookupSymbol = (table, name) => ({});

const updateWheelTransform = (wheel) => true;

const setViewport = (x, y, w, h) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const serializeAST = (ast) => JSON.stringify(ast);

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const listenSocket = (sock, backlog) => true;

const verifyChecksum = (data, sum) => true;

const semaphoreWait = (sem) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const normalizeVolume = (buffer) => buffer;

const createConvolver = (ctx) => ({ buffer: null });

const interpretBytecode = (bc) => true;

const setFilterType = (filter, type) => filter.type = type;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const createVehicle = (chassis) => ({ wheels: [] });

const mergeFiles = (parts) => parts[0];

const bindTexture = (target, texture) => true;

const visitNode = (node) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const calculateRestitution = (mat1, mat2) => 0.3;

const execProcess = (path) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const negotiateSession = (sock) => ({ id: "sess_1" });

const contextSwitch = (oldPid, newPid) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const configureInterface = (iface, config) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const rotateLogFiles = () => true;

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

const extractArchive = (archive) => ["file1", "file2"];

const writeFile = (fd, data) => true;

const minifyCode = (code) => code;

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

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const forkProcess = () => 101;

const bundleAssets = (assets) => "";

const systemCall = (num, args) => 0;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const detectAudioCodec = () => "aac";

const prefetchAssets = (urls) => urls.length;

const deriveAddress = (path) => "0x123...";

const setOrientation = (panner, x, y, z) => true;

const checkIntegrityToken = (token) => true;

const processAudioBuffer = (buffer) => buffer;

const createSphereShape = (r) => ({ type: 'sphere' });

const encodeABI = (method, params) => "0x...";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const stakeAssets = (pool, amount) => true;

const removeConstraint = (world, c) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const createFrameBuffer = () => ({ id: Math.random() });

const tokenizeText = (text) => text.split(" ");

const augmentData = (image) => image;

const commitTransaction = (tx) => true;

const uniform3f = (loc, x, y, z) => true;

const spoofReferer = () => "https://google.com";

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const decompressPacket = (data) => data;

const getOutputTimestamp = (ctx) => Date.now();

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const calculateGasFee = (limit) => limit * 20;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const compileToBytecode = (ast) => new Uint8Array();

const freeMemory = (ptr) => true;

const analyzeHeader = (packet) => ({});

// Anti-shake references
const _ref_z0m5uy = { exitScope };
const _ref_0wa825 = { getCpuLoad };
const _ref_ia9cw8 = { disableRightClick };
const _ref_qz5kt7 = { detectVideoCodec };
const _ref_6jcy1p = { preventSleepMode };
const _ref_ak8q6j = { discoverPeersDHT };
const _ref_o0u1pr = { announceToTracker };
const _ref_8i775k = { enableDHT };
const _ref_hq5il6 = { checkBatteryLevel };
const _ref_wnq8xg = { calculateFriction };
const _ref_l90xns = { attachRenderBuffer };
const _ref_oer0nq = { splitFile };
const _ref_6361dl = { setQValue };
const _ref_w6w39e = { uniformMatrix4fv };
const _ref_pyefxm = { loadImpulseResponse };
const _ref_wza889 = { clearScreen };
const _ref_b18c9m = { activeTexture };
const _ref_tob0gs = { createWaveShaper };
const _ref_j4dqnb = { setVolumeLevel };
const _ref_38l62m = { getSystemUptime };
const _ref_778bgb = { parseSubtitles };
const _ref_zlg7au = { disconnectNodes };
const _ref_3bxshk = { suspendContext };
const _ref_h4wkgm = { createScriptProcessor };
const _ref_b9vtxv = { unlockFile };
const _ref_4powiw = { createBoxShape };
const _ref_dth5mz = { createDynamicsCompressor };
const _ref_o5rg4y = { eliminateDeadCode };
const _ref_3r2bzq = { removeRigidBody };
const _ref_v96yew = { estimateNonce };
const _ref_rxyu1x = { generateCode };
const _ref_3sokle = { normalizeAudio };
const _ref_hae0p0 = { loadModelWeights };
const _ref_x42oeb = { setPosition };
const _ref_t85uul = { parseStatement };
const _ref_ijrgth = { remuxContainer };
const _ref_ehbqvc = { getFloatTimeDomainData };
const _ref_5xq7dg = { addPoint2PointConstraint };
const _ref_y0a6pt = { deleteBuffer };
const _ref_ow2maq = { diffVirtualDOM };
const _ref_9k2mcd = { getExtension };
const _ref_lcx5tz = { getProgramInfoLog };
const _ref_5pbmbn = { computeLossFunction };
const _ref_xyb2jj = { createAnalyser };
const _ref_7yw8xt = { setFilePermissions };
const _ref_vw6xs2 = { repairCorruptFile };
const _ref_la5okp = { setFrequency };
const _ref_zma5nl = { generateEmbeddings };
const _ref_wa3bdi = { createPeriodicWave };
const _ref_3oxl43 = { blockMaliciousTraffic };
const _ref_9b1zwp = { validateProgram };
const _ref_tos6s2 = { getByteFrequencyData };
const _ref_xhsjn2 = { flushSocketBuffer };
const _ref_dxz4mj = { linkProgram };
const _ref_1dseoj = { addWheel };
const _ref_gbrz70 = { virtualScroll };
const _ref_btggja = { chmodFile };
const _ref_f9wjgx = { scaleMatrix };
const _ref_dmatr7 = { verifyFileSignature };
const _ref_li4qhi = { profilePerformance };
const _ref_8owgqc = { enterScope };
const _ref_cl7svk = { encryptLocalStorage };
const _ref_uikl5t = { executeSQLQuery };
const _ref_r2amlt = { acceptConnection };
const _ref_53b4sn = { mangleNames };
const _ref_ef5fk5 = { checkDiskSpace };
const _ref_j5n2tq = { rotateMatrix };
const _ref_2xrym1 = { limitBandwidth };
const _ref_hnij4j = { generateSourceMap };
const _ref_h9rhgq = { moveFileToComplete };
const _ref_0kbji7 = { broadcastMessage };
const _ref_q3ldl4 = { applyTheme };
const _ref_qba7oc = { detachThread };
const _ref_3foj7j = { createASTNode };
const _ref_ekx9um = { createPanner };
const _ref_hg6980 = { setDetune };
const _ref_jgsqw2 = { encryptPeerTraffic };
const _ref_pasa6b = { compactDatabase };
const _ref_w6klw2 = { checkPortAvailability };
const _ref_7dqxbu = { createSymbolTable };
const _ref_gie3yv = { setBrake };
const _ref_unjj75 = { unmuteStream };
const _ref_fytm09 = { broadcastTransaction };
const _ref_vasoka = { reportError };
const _ref_9o8xtt = { stepSimulation };
const _ref_6q54hk = { handleTimeout };
const _ref_s8koom = { traverseAST };
const _ref_foi2us = { checkIntegrityConstraint };
const _ref_fftrfb = { checkBalance };
const _ref_0jw105 = { controlCongestion };
const _ref_k66hpb = { encapsulateFrame };
const _ref_hk6qh1 = { computeDominators };
const _ref_01hbcs = { joinGroup };
const _ref_moqmtp = { createSoftBody };
const _ref_mrk6z5 = { ProtocolBufferHandler };
const _ref_yye40r = { cleanOldLogs };
const _ref_pxx7il = { injectMetadata };
const _ref_r43c2y = { disableDepthTest };
const _ref_kuubb8 = { classifySentiment };
const _ref_f6lufu = { resolveDependencyGraph };
const _ref_20mdxx = { installUpdate };
const _ref_vujk1h = { setMTU };
const _ref_9lxxlt = { computeNormal };
const _ref_n79zcm = { protectMemory };
const _ref_my74qa = { detectDarkMode };
const _ref_wt1dqr = { analyzeControlFlow };
const _ref_g22106 = { parseExpression };
const _ref_811k89 = { checkGLError };
const _ref_k3spr0 = { calculateLayoutMetrics };
const _ref_9dtcdv = { postProcessBloom };
const _ref_iqbuqr = { preventCSRF };
const _ref_i0pphz = { reassemblePacket };
const _ref_8ysch1 = { loadCheckpoint };
const _ref_hooqm5 = { wakeUp };
const _ref_5va9ix = { compileVertexShader };
const _ref_iik43g = { leaveGroup };
const _ref_100gdj = { seedRatioLimit };
const _ref_ludjaj = { makeDistortionCurve };
const _ref_51b7dl = { uninterestPeer };
const _ref_c1tv4j = { swapTokens };
const _ref_dds9vd = { getVelocity };
const _ref_p5d5xx = { setSteeringValue };
const _ref_5286xe = { enableBlend };
const _ref_l33l78 = { parsePayload };
const _ref_gv12gp = { resolveCollision };
const _ref_576qde = { setDistanceModel };
const _ref_03c4qr = { readPipe };
const _ref_2r7za1 = { calculateSHA256 };
const _ref_viy6ks = { lookupSymbol };
const _ref_p2x2h1 = { updateWheelTransform };
const _ref_wuasqx = { setViewport };
const _ref_ojr0e7 = { lazyLoadComponent };
const _ref_jdkct9 = { serializeAST };
const _ref_sqo7sl = { refreshAuthToken };
const _ref_e54h0z = { readPixels };
const _ref_2fjrx2 = { listenSocket };
const _ref_bwyffz = { verifyChecksum };
const _ref_gf15ke = { semaphoreWait };
const _ref_rwbvmy = { scheduleBandwidth };
const _ref_ggfsqo = { normalizeVolume };
const _ref_p2vjre = { createConvolver };
const _ref_af2kd2 = { interpretBytecode };
const _ref_noo0fh = { setFilterType };
const _ref_41x1w3 = { decryptHLSStream };
const _ref_p91gz5 = { createVehicle };
const _ref_sxcuuw = { mergeFiles };
const _ref_k95asu = { bindTexture };
const _ref_13a5ou = { visitNode };
const _ref_pk8ykw = { parseFunction };
const _ref_laodaw = { convexSweepTest };
const _ref_u8nfax = { calculateRestitution };
const _ref_crd9oy = { execProcess };
const _ref_2o9aml = { validateTokenStructure };
const _ref_e589jg = { parseTorrentFile };
const _ref_40usfr = { negotiateSession };
const _ref_xw2tbv = { contextSwitch };
const _ref_7k0ol4 = { vertexAttrib3f };
const _ref_fwwkru = { configureInterface };
const _ref_ynqcdu = { calculatePieceHash };
const _ref_38wj6z = { validateSSLCert };
const _ref_4ho5x2 = { rotateLogFiles };
const _ref_qu1ctr = { download };
const _ref_6awddj = { extractArchive };
const _ref_x9fvmr = { writeFile };
const _ref_1v0pbo = { minifyCode };
const _ref_l4k10q = { TaskScheduler };
const _ref_rtde0a = { compressDataStream };
const _ref_h3xeya = { forkProcess };
const _ref_orodzz = { bundleAssets };
const _ref_pbskhq = { systemCall };
const _ref_naibzy = { FileValidator };
const _ref_ndxem3 = { detectAudioCodec };
const _ref_20n7zx = { prefetchAssets };
const _ref_9t2wak = { deriveAddress };
const _ref_7zqdvl = { setOrientation };
const _ref_nxmjmq = { checkIntegrityToken };
const _ref_y9g91o = { processAudioBuffer };
const _ref_9w8x5u = { createSphereShape };
const _ref_f34uhm = { encodeABI };
const _ref_10kkag = { validateMnemonic };
const _ref_okjeb2 = { stakeAssets };
const _ref_oggosv = { removeConstraint };
const _ref_gqrmkm = { shardingTable };
const _ref_2pawzl = { computeSpeedAverage };
const _ref_e2rs5u = { createFrameBuffer };
const _ref_lkwrm8 = { tokenizeText };
const _ref_wmjlhc = { augmentData };
const _ref_qpgprc = { commitTransaction };
const _ref_m357n4 = { uniform3f };
const _ref_kxifdc = { spoofReferer };
const _ref_5dxpbh = { monitorNetworkInterface };
const _ref_ainvwa = { decompressPacket };
const _ref_kmbf9j = { getOutputTimestamp };
const _ref_2l50pa = { clearBrowserCache };
const _ref_avewp9 = { convertRGBtoHSL };
const _ref_l903s6 = { calculateGasFee };
const _ref_xyddep = { updateBitfield };
const _ref_ace3km = { compileToBytecode };
const _ref_o10x1o = { freeMemory };
const _ref_66xdtk = { analyzeHeader }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `PearVideo` };
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
                const urlParams = { config, url: window.location.href, name_en: `PearVideo` };

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
        const validatePieceChecksum = (piece) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const beginTransaction = () => "TX-" + Date.now();

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const createDirectoryRecursive = (path) => path.split('/').length;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const setDopplerFactor = (val) => true;

const processAudioBuffer = (buffer) => buffer;


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

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const optimizeAST = (ast) => ast;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const addConeTwistConstraint = (world, c) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const applyImpulse = (body, impulse, point) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const setVelocity = (body, v) => true;

const addSliderConstraint = (world, c) => true;

const deleteProgram = (program) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const getShaderInfoLog = (shader) => "";

const calculateRestitution = (mat1, mat2) => 0.3;

const getByteFrequencyData = (analyser, array) => true;

const mutexUnlock = (mtx) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const updateParticles = (sys, dt) => true;

const renderParticles = (sys) => true;

const writePipe = (fd, data) => data.length;

const monitorClipboard = () => "";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createChannelSplitter = (ctx, channels) => ({});

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const closePipe = (fd) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const dhcpOffer = (ip) => true;

const freeMemory = (ptr) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const setPosition = (panner, x, y, z) => true;

const setEnv = (key, val) => true;

const decapsulateFrame = (frame) => frame;

const getProgramInfoLog = (program) => "";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const killParticles = (sys) => true;

const rotateLogFiles = () => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const readFile = (fd, len) => "";

const registerISR = (irq, func) => true;

const blockMaliciousTraffic = (ip) => true;

const mkdir = (path) => true;

const negotiateProtocol = () => "HTTP/2.0";

const verifySignature = (tx, sig) => true;

const dhcpAck = () => true;

const reduceDimensionalityPCA = (data) => data;

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

const eliminateDeadCode = (ast) => ast;

const rollbackTransaction = (tx) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const calculateGasFee = (limit) => limit * 20;

const chdir = (path) => true;

const logErrorToFile = (err) => console.error(err);

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const prefetchAssets = (urls) => urls.length;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createVehicle = (chassis) => ({ wheels: [] });


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

const detachThread = (tid) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const scheduleTask = (task) => ({ id: 1, task });

const chmodFile = (path, mode) => true;

const rateLimitCheck = (ip) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const disconnectNodes = (node) => true;

const unlinkFile = (path) => true;

const semaphoreSignal = (sem) => true;

const checkRootAccess = () => false;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const foldConstants = (ast) => ast;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const connectNodes = (src, dest) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const lazyLoadComponent = (name) => ({ name, loaded: false });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const validateRecaptcha = (token) => true;

const handleInterrupt = (irq) => true;

const chownFile = (path, uid, gid) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const detectDebugger = () => false;

const protectMemory = (ptr, size, flags) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const restartApplication = () => console.log("Restarting...");

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const hashKeccak256 = (data) => "0xabc...";

const deobfuscateString = (str) => atob(str);

const rayCast = (world, start, end) => ({ hit: false });

const compileVertexShader = (source) => ({ compiled: true });

const killProcess = (pid) => true;

const drawElements = (mode, count, type, offset) => true;

const getBlockHeight = () => 15000000;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const gaussianBlur = (image, radius) => image;

const dhcpDiscover = () => true;

const createListener = (ctx) => ({});

const encapsulateFrame = (packet) => packet;

const checkBatteryLevel = () => 100;

const wakeUp = (body) => true;

const postProcessBloom = (image, threshold) => image;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const rmdir = (path) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const addHingeConstraint = (world, c) => true;

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

const sanitizeXSS = (html) => html;

const setMTU = (iface, mtu) => true;

const stakeAssets = (pool, amount) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const registerSystemTray = () => ({ icon: "tray.ico" });

const getEnv = (key) => "";

const downInterface = (iface) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const scheduleProcess = (pid) => true;

const semaphoreWait = (sem) => true;

const adjustWindowSize = (sock, size) => true;

const updateSoftBody = (body) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const detectVirtualMachine = () => false;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const performOCR = (img) => "Detected Text";

const analyzeBitrate = () => "5000kbps";

const cleanOldLogs = (days) => days;

const deleteTexture = (texture) => true;

const auditAccessLogs = () => true;

const applyFog = (color, dist) => color;

const getExtension = (name) => ({});

const rotateMatrix = (mat, angle, axis) => mat;

const loadCheckpoint = (path) => true;

const dhcpRequest = (ip) => true;

const detectAudioCodec = () => "aac";

const spoofReferer = () => "https://google.com";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setRelease = (node, val) => node.release.value = val;

const createMediaElementSource = (ctx, el) => ({});

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const checkIntegrityToken = (token) => true;

const connectSocket = (sock, addr, port) => true;

const lockRow = (id) => true;

const addGeneric6DofConstraint = (world, c) => true;

const statFile = (path) => ({ size: 0 });

const validateFormInput = (input) => input.length > 0;

const setDelayTime = (node, time) => node.delayTime.value = time;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const anchorSoftBody = (soft, rigid) => true;

const swapTokens = (pair, amount) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const deriveAddress = (path) => "0x123...";

const signTransaction = (tx, key) => "signed_tx_hash";

const commitTransaction = (tx) => true;

const registerGestureHandler = (gesture) => true;

const preventSleepMode = () => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setInertia = (body, i) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const configureInterface = (iface, config) => true;

const createChannelMerger = (ctx, channels) => ({});

const createBoxShape = (w, h, d) => ({ type: 'box' });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const hydrateSSR = (html) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const injectMetadata = (file, meta) => ({ file, meta });

const segmentImageUNet = (img) => "mask_buffer";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const detectDarkMode = () => true;

// Anti-shake references
const _ref_ab638e = { validatePieceChecksum };
const _ref_8sxc08 = { acceptConnection };
const _ref_va008l = { rotateUserAgent };
const _ref_nw9443 = { parseMagnetLink };
const _ref_q7wypj = { requestPiece };
const _ref_lvj29d = { beginTransaction };
const _ref_8uq6x0 = { calculateMD5 };
const _ref_3w7b35 = { createDirectoryRecursive };
const _ref_4p7ry8 = { connectToTracker };
const _ref_pdwq74 = { getAppConfig };
const _ref_wj5bl8 = { discoverPeersDHT };
const _ref_lx0oor = { setDopplerFactor };
const _ref_i2iih0 = { processAudioBuffer };
const _ref_8i46hm = { ApiDataFormatter };
const _ref_8hh886 = { resolveDNSOverHTTPS };
const _ref_i8ntyn = { limitBandwidth };
const _ref_mgv25x = { diffVirtualDOM };
const _ref_mocaf2 = { optimizeAST };
const _ref_cpea9o = { limitUploadSpeed };
const _ref_0i00b0 = { addConeTwistConstraint };
const _ref_uw0lrn = { getSystemUptime };
const _ref_iajohi = { normalizeVector };
const _ref_d7f0c0 = { applyImpulse };
const _ref_6a9kj1 = { renderVirtualDOM };
const _ref_i2oq46 = { manageCookieJar };
const _ref_n8m0b0 = { makeDistortionCurve };
const _ref_hhgyzi = { setVelocity };
const _ref_fdyy3g = { addSliderConstraint };
const _ref_bb4er4 = { deleteProgram };
const _ref_5b4as8 = { loadImpulseResponse };
const _ref_v64o6h = { getShaderInfoLog };
const _ref_6gja9r = { calculateRestitution };
const _ref_j1ow6r = { getByteFrequencyData };
const _ref_1nn9pn = { mutexUnlock };
const _ref_kycqa3 = { updateProgressBar };
const _ref_9znoxa = { updateParticles };
const _ref_oqwx87 = { renderParticles };
const _ref_biixo2 = { writePipe };
const _ref_igi7fa = { monitorClipboard };
const _ref_rmdl4l = { tunnelThroughProxy };
const _ref_1lauth = { createChannelSplitter };
const _ref_hj02w6 = { createPhysicsWorld };
const _ref_qusy5u = { closePipe };
const _ref_9rz0zt = { compressDataStream };
const _ref_5tukwn = { dhcpOffer };
const _ref_0cxgzi = { freeMemory };
const _ref_iei3qb = { analyzeUserBehavior };
const _ref_fslgbj = { setPosition };
const _ref_xyqwiy = { setEnv };
const _ref_mmsr8n = { decapsulateFrame };
const _ref_17xxi2 = { getProgramInfoLog };
const _ref_p4mqch = { syncDatabase };
const _ref_io8la2 = { killParticles };
const _ref_imfvji = { rotateLogFiles };
const _ref_kpnpgr = { createOscillator };
const _ref_b7ga08 = { readFile };
const _ref_399n68 = { registerISR };
const _ref_ayfdrf = { blockMaliciousTraffic };
const _ref_n9kvpp = { mkdir };
const _ref_pq25x7 = { negotiateProtocol };
const _ref_tu80s0 = { verifySignature };
const _ref_c8alty = { dhcpAck };
const _ref_yniaeq = { reduceDimensionalityPCA };
const _ref_juj9hp = { download };
const _ref_yur10j = { eliminateDeadCode };
const _ref_yqtwa9 = { rollbackTransaction };
const _ref_8h4lnt = { computeSpeedAverage };
const _ref_5o6d10 = { calculateGasFee };
const _ref_fsq87d = { chdir };
const _ref_1rjq5m = { logErrorToFile };
const _ref_4wc3ff = { retryFailedSegment };
const _ref_379nxo = { allocateDiskSpace };
const _ref_licm83 = { FileValidator };
const _ref_cwcfpp = { prefetchAssets };
const _ref_oyv6dy = { sanitizeInput };
const _ref_mh61vj = { createAnalyser };
const _ref_fbyr9y = { createVehicle };
const _ref_uebw1p = { TelemetryClient };
const _ref_e3two9 = { detachThread };
const _ref_9t9qkw = { parseConfigFile };
const _ref_mjo95b = { getMACAddress };
const _ref_uto4vv = { scheduleTask };
const _ref_vmyl68 = { chmodFile };
const _ref_x7pp6e = { rateLimitCheck };
const _ref_2ecwnm = { terminateSession };
const _ref_zyf6ht = { disconnectNodes };
const _ref_hsnikn = { unlinkFile };
const _ref_mmfqpn = { semaphoreSignal };
const _ref_p8th4r = { checkRootAccess };
const _ref_3p5jub = { archiveFiles };
const _ref_9x71ic = { foldConstants };
const _ref_hpm8ne = { checkIntegrity };
const _ref_g31g21 = { connectNodes };
const _ref_36gqxp = { normalizeFeatures };
const _ref_zj0yb3 = { lazyLoadComponent };
const _ref_b32za2 = { verifyMagnetLink };
const _ref_ef9d6m = { validateRecaptcha };
const _ref_p2f9ma = { handleInterrupt };
const _ref_1ch7fn = { chownFile };
const _ref_4t7igg = { generateWalletKeys };
const _ref_xcqgd0 = { detectDebugger };
const _ref_pdr0r2 = { protectMemory };
const _ref_abo53e = { shardingTable };
const _ref_h4c2th = { createBiquadFilter };
const _ref_3hfh6b = { restartApplication };
const _ref_hio0ac = { detectObjectYOLO };
const _ref_woknjg = { hashKeccak256 };
const _ref_8xybji = { deobfuscateString };
const _ref_jr627f = { rayCast };
const _ref_xoqtz5 = { compileVertexShader };
const _ref_fsvvkk = { killProcess };
const _ref_9mtbbi = { drawElements };
const _ref_35gl2q = { getBlockHeight };
const _ref_esryf6 = { setSteeringValue };
const _ref_0sb72u = { gaussianBlur };
const _ref_27gf7y = { dhcpDiscover };
const _ref_o3vbx0 = { createListener };
const _ref_cr04jc = { encapsulateFrame };
const _ref_tsomzz = { checkBatteryLevel };
const _ref_gdrqa5 = { wakeUp };
const _ref_9gz2zo = { postProcessBloom };
const _ref_qosqj8 = { checkDiskSpace };
const _ref_6b292g = { rmdir };
const _ref_m4vjtr = { flushSocketBuffer };
const _ref_od10lk = { addHingeConstraint };
const _ref_6bgfav = { TaskScheduler };
const _ref_w2enb4 = { VirtualFSTree };
const _ref_qwxbzz = { sanitizeXSS };
const _ref_6gjumb = { setMTU };
const _ref_03arxq = { stakeAssets };
const _ref_su9z95 = { calculateSHA256 };
const _ref_qhbzsw = { registerSystemTray };
const _ref_kgm9if = { getEnv };
const _ref_ot7lcs = { downInterface };
const _ref_jpobos = { migrateSchema };
const _ref_93cx7g = { getVelocity };
const _ref_bssw2j = { virtualScroll };
const _ref_isc7xx = { scheduleProcess };
const _ref_sggob4 = { semaphoreWait };
const _ref_x2rn3v = { adjustWindowSize };
const _ref_dguytz = { updateSoftBody };
const _ref_p3q7er = { debouncedResize };
const _ref_9h4oz4 = { detectVirtualMachine };
const _ref_plssvl = { syncAudioVideo };
const _ref_0ze34f = { performOCR };
const _ref_t0vwu7 = { analyzeBitrate };
const _ref_08p29o = { cleanOldLogs };
const _ref_8pe2oj = { deleteTexture };
const _ref_o4gdd3 = { auditAccessLogs };
const _ref_e4v008 = { applyFog };
const _ref_sy2n13 = { getExtension };
const _ref_l1bamu = { rotateMatrix };
const _ref_5mu6zd = { loadCheckpoint };
const _ref_cgdu70 = { dhcpRequest };
const _ref_f0e9xl = { detectAudioCodec };
const _ref_scqd8a = { spoofReferer };
const _ref_t05lcu = { getAngularVelocity };
const _ref_ikmuv6 = { setRelease };
const _ref_9hbr4t = { createMediaElementSource };
const _ref_ytbdug = { playSoundAlert };
const _ref_kjuzpe = { checkIntegrityToken };
const _ref_flc7c0 = { connectSocket };
const _ref_63z4ih = { lockRow };
const _ref_5o1j1q = { addGeneric6DofConstraint };
const _ref_ltisew = { statFile };
const _ref_mykxum = { validateFormInput };
const _ref_oucash = { setDelayTime };
const _ref_7mmeup = { getFileAttributes };
const _ref_d3jkn2 = { anchorSoftBody };
const _ref_jgo4ys = { swapTokens };
const _ref_18hum5 = { generateUUIDv5 };
const _ref_72r6ir = { moveFileToComplete };
const _ref_x5s8jv = { animateTransition };
const _ref_n6od62 = { queueDownloadTask };
const _ref_sgcetg = { parseSubtitles };
const _ref_00rk06 = { optimizeConnectionPool };
const _ref_v3icu5 = { formatCurrency };
const _ref_8q4vk3 = { deriveAddress };
const _ref_r3cmix = { signTransaction };
const _ref_7br3aj = { commitTransaction };
const _ref_wf3lli = { registerGestureHandler };
const _ref_0ixetx = { preventSleepMode };
const _ref_vmplw3 = { initiateHandshake };
const _ref_5sgy33 = { streamToPlayer };
const _ref_f7ezwj = { createDynamicsCompressor };
const _ref_q0iwjk = { requestAnimationFrameLoop };
const _ref_xn8syg = { setInertia };
const _ref_cgwnsi = { optimizeHyperparameters };
const _ref_spc9cy = { configureInterface };
const _ref_usu8oo = { createChannelMerger };
const _ref_ab9jyn = { createBoxShape };
const _ref_9wddom = { parseClass };
const _ref_cae7xh = { transformAesKey };
const _ref_khe6yx = { hydrateSSR };
const _ref_9j1e4s = { createFrameBuffer };
const _ref_tk08ad = { extractThumbnail };
const _ref_3vrwf5 = { injectMetadata };
const _ref_lhup0x = { segmentImageUNet };
const _ref_xdwpcl = { createPanner };
const _ref_tjl9t8 = { detectDarkMode }; 
    });
})({}, {});