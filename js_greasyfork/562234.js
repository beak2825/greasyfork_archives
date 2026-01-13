// ==UserScript==
// @name BanBye视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/BanBye/index.js
// @version 2026.01.10
// @description 一键下载BanBye视频，支持4K/1080P/720P多画质。
// @icon https://banbye.com/_nuxt/icons/icon_64x64.5406dd.png
// @match *://banbye.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
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
        const lazyLoadComponent = (name) => ({ name, loaded: false });

const interpretBytecode = (bc) => true;

const decapsulateFrame = (frame) => frame;

const unlinkFile = (path) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const renderShadowMap = (scene, light) => ({ texture: {} });

const uniform1i = (loc, val) => true;

const scheduleProcess = (pid) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const deleteBuffer = (buffer) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const preventSleepMode = () => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const dhcpDiscover = () => true;

const cleanOldLogs = (days) => days;

const upInterface = (iface) => true;

const disableDepthTest = () => true;

const setAttack = (node, val) => node.attack.value = val;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const setDetune = (osc, cents) => osc.detune = cents;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const mutexUnlock = (mtx) => true;

const getUniformLocation = (program, name) => 1;

const validateIPWhitelist = (ip) => true;

const parseLogTopics = (topics) => ["Transfer"];

const encapsulateFrame = (packet) => packet;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const claimRewards = (pool) => "0.5 ETH";

const prefetchAssets = (urls) => urls.length;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const setPosition = (panner, x, y, z) => true;

const dhcpRequest = (ip) => true;

const downInterface = (iface) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const setViewport = (x, y, w, h) => true;

const createListener = (ctx) => ({});

const auditAccessLogs = () => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const unlockRow = (id) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const semaphoreWait = (sem) => true;

const getProgramInfoLog = (program) => "";

const closeContext = (ctx) => Promise.resolve();

const tokenizeText = (text) => text.split(" ");

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const setQValue = (filter, q) => filter.Q = q;

const createIndexBuffer = (data) => ({ id: Math.random() });

const execProcess = (path) => true;

const createMediaStreamSource = (ctx, stream) => ({});


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

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const contextSwitch = (oldPid, newPid) => true;


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

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const configureInterface = (iface, config) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const chownFile = (path, uid, gid) => true;

const registerISR = (irq, func) => true;

const createPipe = () => [3, 4];

const rebootSystem = () => true;

const setFilterType = (filter, type) => filter.type = type;

const protectMemory = (ptr, size, flags) => true;

const semaphoreSignal = (sem) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const invalidateCache = (key) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const encodeABI = (method, params) => "0x...";

const clusterKMeans = (data, k) => Array(k).fill([]);

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const useProgram = (program) => true;

const mutexLock = (mtx) => true;

const resumeContext = (ctx) => Promise.resolve();

const clearScreen = (r, g, b, a) => true;

const monitorClipboard = () => "";

const setPan = (node, val) => node.pan.value = val;

const switchVLAN = (id) => true;

const getEnv = (key) => "";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const gaussianBlur = (image, radius) => image;

const getByteFrequencyData = (analyser, array) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const subscribeToEvents = (contract) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const cullFace = (mode) => true;

const swapTokens = (pair, amount) => true;

const translateMatrix = (mat, vec) => mat;

const setOrientation = (panner, x, y, z) => true;

const createChannelSplitter = (ctx, channels) => ({});

const setMTU = (iface, mtu) => true;

const compressGzip = (data) => data;

const edgeDetectionSobel = (image) => image;

const calculateRestitution = (mat1, mat2) => 0.3;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const systemCall = (num, args) => 0;

const addWheel = (vehicle, info) => true;

const performOCR = (img) => "Detected Text";

const suspendContext = (ctx) => Promise.resolve();

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const forkProcess = () => 101;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const disconnectNodes = (node) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const uniform3f = (loc, x, y, z) => true;

const getOutputTimestamp = (ctx) => Date.now();

const killProcess = (pid) => true;

const classifySentiment = (text) => "positive";

const createShader = (gl, type) => ({ id: Math.random(), type });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createFrameBuffer = () => ({ id: Math.random() });

const addPoint2PointConstraint = (world, c) => true;

const setEnv = (key, val) => true;

const allocateMemory = (size) => 0x1000;

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

const detectDarkMode = () => true;

const unmapMemory = (ptr, size) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const setBrake = (vehicle, force, wheelIdx) => true;

const writePipe = (fd, data) => data.length;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const unlockFile = (path) => ({ path, locked: false });

const validateProgram = (program) => true;

const createParticleSystem = (count) => ({ particles: [] });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const resolveSymbols = (ast) => ({});

const loadImpulseResponse = (url) => Promise.resolve({});

const linkModules = (modules) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const applyFog = (color, dist) => color;

const setFilePermissions = (perm) => `chmod ${perm}`;

const addSliderConstraint = (world, c) => true;

const generateDocumentation = (ast) => "";

const dhcpOffer = (ip) => true;

const blockMaliciousTraffic = (ip) => true;


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

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
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

const obfuscateString = (str) => btoa(str);

const hashKeccak256 = (data) => "0xabc...";

const setDopplerFactor = (val) => true;

const handleTimeout = (sock) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const visitNode = (node) => true;

const calculateCRC32 = (data) => "00000000";

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const rotateLogFiles = () => true;

const readPipe = (fd, len) => new Uint8Array(len);

const hydrateSSR = (html) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const parsePayload = (packet) => ({});

const optimizeTailCalls = (ast) => ast;

const injectCSPHeader = () => "default-src 'self'";

const createASTNode = (type, val) => ({ type, val });

const checkPortAvailability = (port) => Math.random() > 0.2;

const resetVehicle = (vehicle) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const pingHost = (host) => 10;

const serializeAST = (ast) => JSON.stringify(ast);

const flushSocketBuffer = (sock) => sock.buffer = [];

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const setDistanceModel = (panner, model) => true;

const checkUpdate = () => ({ hasUpdate: false });

const compileToBytecode = (ast) => new Uint8Array();

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const seedRatioLimit = (ratio) => ratio >= 2.0;

const prioritizeRarestPiece = (pieces) => pieces[0];

const emitParticles = (sys, count) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

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

const getVehicleSpeed = (vehicle) => 0;

const removeRigidBody = (world, body) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const stopOscillator = (osc, time) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const interestPeer = (peer) => ({ ...peer, interested: true });

const rateLimitCheck = (ip) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const findLoops = (cfg) => [];

const unmountFileSystem = (path) => true;

const prioritizeTraffic = (queue) => true;

const muteStream = () => true;

const renderCanvasLayer = (ctx) => true;

const limitRate = (stream, rate) => stream;

const augmentData = (image) => image;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const checkIntegrityToken = (token) => true;

// Anti-shake references
const _ref_fhovhk = { lazyLoadComponent };
const _ref_btf8hh = { interpretBytecode };
const _ref_sfmluq = { decapsulateFrame };
const _ref_32q2cv = { unlinkFile };
const _ref_e3o0tg = { calculateLighting };
const _ref_uk59na = { debouncedResize };
const _ref_4sg0zq = { debounceAction };
const _ref_svdsqk = { renderShadowMap };
const _ref_p6oezm = { uniform1i };
const _ref_01coob = { scheduleProcess };
const _ref_m0qilp = { createStereoPanner };
const _ref_dw4u9b = { deleteBuffer };
const _ref_nm8fa4 = { convertRGBtoHSL };
const _ref_dedsr8 = { preventSleepMode };
const _ref_l6aai3 = { computeSpeedAverage };
const _ref_30rg5j = { dhcpDiscover };
const _ref_r7cd6p = { cleanOldLogs };
const _ref_82wom3 = { upInterface };
const _ref_l9u3qb = { disableDepthTest };
const _ref_icw9hh = { setAttack };
const _ref_n90d0p = { createAnalyser };
const _ref_75iuug = { getMACAddress };
const _ref_dkia9c = { setDetune };
const _ref_dk79uw = { convertHSLtoRGB };
const _ref_zjegqg = { mutexUnlock };
const _ref_n7qo9r = { getUniformLocation };
const _ref_17o1oz = { validateIPWhitelist };
const _ref_meg7nf = { parseLogTopics };
const _ref_27eosi = { encapsulateFrame };
const _ref_8oobky = { moveFileToComplete };
const _ref_c7e4r1 = { claimRewards };
const _ref_9yacjy = { prefetchAssets };
const _ref_phvfer = { resolveDNSOverHTTPS };
const _ref_xecu54 = { setPosition };
const _ref_g6m8nv = { dhcpRequest };
const _ref_a1a6v8 = { downInterface };
const _ref_5p2kzc = { switchProxyServer };
const _ref_uqb025 = { setViewport };
const _ref_k2dals = { createListener };
const _ref_4006co = { auditAccessLogs };
const _ref_dcm434 = { linkProgram };
const _ref_xvqz2x = { unlockRow };
const _ref_w538lx = { retryFailedSegment };
const _ref_y0aokh = { createBiquadFilter };
const _ref_9txx13 = { semaphoreWait };
const _ref_s9q9qp = { getProgramInfoLog };
const _ref_qi0f56 = { closeContext };
const _ref_b6diep = { tokenizeText };
const _ref_4cr7iq = { requestPiece };
const _ref_ut1tfs = { chokePeer };
const _ref_6nvgm3 = { setQValue };
const _ref_myubhi = { createIndexBuffer };
const _ref_g06y1a = { execProcess };
const _ref_frnavf = { createMediaStreamSource };
const _ref_70yp02 = { ResourceMonitor };
const _ref_t8c14y = { calculateLayoutMetrics };
const _ref_kj7jlw = { contextSwitch };
const _ref_4uumhe = { ApiDataFormatter };
const _ref_e411rl = { requestAnimationFrameLoop };
const _ref_yhw4g6 = { configureInterface };
const _ref_rvqw2n = { manageCookieJar };
const _ref_e3r99r = { chownFile };
const _ref_y8x21z = { registerISR };
const _ref_wvzzl1 = { createPipe };
const _ref_ybju85 = { rebootSystem };
const _ref_vpt7td = { setFilterType };
const _ref_rqd4at = { protectMemory };
const _ref_fdfpmq = { semaphoreSignal };
const _ref_f4d1gn = { getAppConfig };
const _ref_q8tl7x = { invalidateCache };
const _ref_zwxlcp = { performTLSHandshake };
const _ref_qmzgrq = { syncDatabase };
const _ref_31l597 = { loadModelWeights };
const _ref_dilmfn = { encodeABI };
const _ref_bpwjc7 = { clusterKMeans };
const _ref_oxcbkl = { createGainNode };
const _ref_3l9gxz = { useProgram };
const _ref_jxgn1p = { mutexLock };
const _ref_p2xsgc = { resumeContext };
const _ref_umzq1z = { clearScreen };
const _ref_nqgbj4 = { monitorClipboard };
const _ref_qgcsn8 = { setPan };
const _ref_dyy6va = { switchVLAN };
const _ref_bab7mm = { getEnv };
const _ref_oukxc5 = { createDelay };
const _ref_ty8dxa = { gaussianBlur };
const _ref_h8vls1 = { getByteFrequencyData };
const _ref_v4j4eh = { executeSQLQuery };
const _ref_hh3yyk = { FileValidator };
const _ref_mybt9o = { subscribeToEvents };
const _ref_78ibz7 = { getSystemUptime };
const _ref_tn2z1b = { cullFace };
const _ref_kox4yl = { swapTokens };
const _ref_abnlnz = { translateMatrix };
const _ref_9tj2hl = { setOrientation };
const _ref_mrim8w = { createChannelSplitter };
const _ref_dntmm5 = { setMTU };
const _ref_ckae8r = { compressGzip };
const _ref_cpnpnd = { edgeDetectionSobel };
const _ref_m32n3s = { calculateRestitution };
const _ref_fsrt4t = { validateSSLCert };
const _ref_5drsef = { allocateDiskSpace };
const _ref_e090io = { systemCall };
const _ref_wx7n71 = { addWheel };
const _ref_1hheha = { performOCR };
const _ref_n3nrpq = { suspendContext };
const _ref_9dewsj = { generateUserAgent };
const _ref_6pw3c4 = { keepAlivePing };
const _ref_e9qnr7 = { convexSweepTest };
const _ref_qm4vxe = { forkProcess };
const _ref_tlp96a = { applyPerspective };
const _ref_f83v6q = { disconnectNodes };
const _ref_yhnbt7 = { normalizeVector };
const _ref_6yar00 = { uniform3f };
const _ref_052vza = { getOutputTimestamp };
const _ref_svyljd = { killProcess };
const _ref_o5i4nq = { classifySentiment };
const _ref_62hwue = { createShader };
const _ref_mgt0a1 = { limitUploadSpeed };
const _ref_jbxnbc = { createFrameBuffer };
const _ref_50xuiy = { addPoint2PointConstraint };
const _ref_4pkeda = { setEnv };
const _ref_2zztoe = { allocateMemory };
const _ref_y3n215 = { VirtualFSTree };
const _ref_tp56mz = { detectDarkMode };
const _ref_vx5ups = { unmapMemory };
const _ref_5wo7ov = { simulateNetworkDelay };
const _ref_u3osok = { setBrake };
const _ref_de2osf = { writePipe };
const _ref_sp7bx0 = { optimizeMemoryUsage };
const _ref_q0c5az = { unlockFile };
const _ref_6fzxsd = { validateProgram };
const _ref_n5faog = { createParticleSystem };
const _ref_9w0pys = { validateTokenStructure };
const _ref_38ijpe = { resolveSymbols };
const _ref_p0zxe1 = { loadImpulseResponse };
const _ref_foibik = { linkModules };
const _ref_bkocrz = { decodeABI };
const _ref_337ozu = { applyFog };
const _ref_m065id = { setFilePermissions };
const _ref_ydpkp0 = { addSliderConstraint };
const _ref_z9w821 = { generateDocumentation };
const _ref_57gye3 = { dhcpOffer };
const _ref_sk2lz8 = { blockMaliciousTraffic };
const _ref_yjyzdc = { TelemetryClient };
const _ref_kjktli = { validateMnemonic };
const _ref_43ss4z = { parseFunction };
const _ref_6194ht = { renderVirtualDOM };
const _ref_hrjwpk = { limitBandwidth };
const _ref_vlp2jk = { CacheManager };
const _ref_xq2cq0 = { obfuscateString };
const _ref_0q38qt = { hashKeccak256 };
const _ref_mwf7qk = { setDopplerFactor };
const _ref_sgg3qz = { handleTimeout };
const _ref_7svafg = { shardingTable };
const _ref_66eegf = { visitNode };
const _ref_veuz5w = { calculateCRC32 };
const _ref_ilz5t8 = { archiveFiles };
const _ref_i7llh9 = { rotateLogFiles };
const _ref_8qfw9w = { readPipe };
const _ref_zmcnwh = { hydrateSSR };
const _ref_2ov8yh = { terminateSession };
const _ref_kqv3t6 = { parsePayload };
const _ref_4iqutd = { optimizeTailCalls };
const _ref_5d54mz = { injectCSPHeader };
const _ref_kbuq36 = { createASTNode };
const _ref_3c3gh1 = { checkPortAvailability };
const _ref_m08o9g = { resetVehicle };
const _ref_gthx9q = { receivePacket };
const _ref_okv7ot = { pingHost };
const _ref_59dd7f = { serializeAST };
const _ref_9wx8oo = { flushSocketBuffer };
const _ref_3ijp2n = { checkIntegrity };
const _ref_fclb6g = { setDistanceModel };
const _ref_qm847z = { checkUpdate };
const _ref_vxy8r8 = { compileToBytecode };
const _ref_19fvhn = { discoverPeersDHT };
const _ref_zuy91b = { seedRatioLimit };
const _ref_93i1v0 = { prioritizeRarestPiece };
const _ref_e28zdd = { emitParticles };
const _ref_p6ktom = { resolveDependencyGraph };
const _ref_0swqmh = { AdvancedCipher };
const _ref_zexwog = { getVehicleSpeed };
const _ref_4t2ud7 = { removeRigidBody };
const _ref_mu9nfg = { splitFile };
const _ref_pvuc57 = { stopOscillator };
const _ref_hi4axy = { calculateSHA256 };
const _ref_jws3so = { interestPeer };
const _ref_3x8u1m = { rateLimitCheck };
const _ref_lpqpi4 = { showNotification };
const _ref_sxi5nm = { createDynamicsCompressor };
const _ref_ef8imd = { findLoops };
const _ref_v0vaup = { unmountFileSystem };
const _ref_c7luyy = { prioritizeTraffic };
const _ref_li4y6y = { muteStream };
const _ref_88aq3j = { renderCanvasLayer };
const _ref_atobzi = { limitRate };
const _ref_jc9yyu = { augmentData };
const _ref_c5u7il = { compressDataStream };
const _ref_lyswzq = { checkIntegrityToken }; 
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
        const encryptStream = (stream, key) => stream;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const cancelTask = (id) => ({ id, cancelled: true });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const parseQueryString = (qs) => ({});

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const sanitizeXSS = (html) => html;

const calculateCRC32 = (data) => "00000000";

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const debouncedResize = () => ({ width: 1920, height: 1080 });

const validateIPWhitelist = (ip) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const scheduleTask = (task) => ({ id: 1, task });

const recognizeSpeech = (audio) => "Transcribed Text";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const lockRow = (id) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const bindSocket = (port) => ({ port, status: "bound" });

const flushSocketBuffer = (sock) => sock.buffer = [];

const decompressGzip = (data) => data;

const shutdownComputer = () => console.log("Shutting down...");

const setSocketTimeout = (ms) => ({ timeout: ms });

const enableDHT = () => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
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

const validateFormInput = (input) => input.length > 0;

const drawArrays = (gl, mode, first, count) => true;

const auditAccessLogs = () => true;

const registerGestureHandler = (gesture) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const hydrateSSR = (html) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const createShader = (gl, type) => ({ id: Math.random(), type });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const createIndexBuffer = (data) => ({ id: Math.random() });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const encodeABI = (method, params) => "0x...";

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const deleteBuffer = (buffer) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const unlockRow = (id) => true;

const createListener = (ctx) => ({});

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const detectVirtualMachine = () => false;

const translateText = (text, lang) => text;

const vertexAttrib3f = (idx, x, y, z) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createFrameBuffer = () => ({ id: Math.random() });

const generateMipmaps = (target) => true;

const createChannelMerger = (ctx, channels) => ({});

const deleteProgram = (program) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const setGainValue = (node, val) => node.gain.value = val;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const subscribeToEvents = (contract) => true;

const compileVertexShader = (source) => ({ compiled: true });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const loadImpulseResponse = (url) => Promise.resolve({});

const cleanOldLogs = (days) => days;

const setDelayTime = (node, time) => node.delayTime.value = time;

const connectNodes = (src, dest) => true;

const createConvolver = (ctx) => ({ buffer: null });

const uniform3f = (loc, x, y, z) => true;

const encryptPeerTraffic = (data) => btoa(data);

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setDopplerFactor = (val) => true;

const analyzeBitrate = () => "5000kbps";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const setQValue = (filter, q) => filter.Q = q;

const closeContext = (ctx) => Promise.resolve();

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const closeSocket = (sock) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const useProgram = (program) => true;

const establishHandshake = (sock) => true;

const fragmentPacket = (data, mtu) => [data];

const clusterKMeans = (data, k) => Array(k).fill([]);

const resumeContext = (ctx) => Promise.resolve();

const getByteFrequencyData = (analyser, array) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createWaveShaper = (ctx) => ({ curve: null });

const checkBatteryLevel = () => 100;

const disconnectNodes = (node) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const setPosition = (panner, x, y, z) => true;

const enterScope = (table) => true;

const injectCSPHeader = () => "default-src 'self'";

const validateProgram = (program) => true;

const installUpdate = () => false;

const synthesizeSpeech = (text) => "audio_buffer";

const setDetune = (osc, cents) => osc.detune = cents;

const createProcess = (img) => ({ pid: 100 });

const multicastMessage = (group, msg) => true;

const clearScreen = (r, g, b, a) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const systemCall = (num, args) => 0;

const suspendContext = (ctx) => Promise.resolve();

const setOrientation = (panner, x, y, z) => true;

const setFilterType = (filter, type) => filter.type = type;

const merkelizeRoot = (txs) => "root_hash";

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const convertFormat = (src, dest) => dest;

const attachRenderBuffer = (fb, rb) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const calculateGasFee = (limit) => limit * 20;

const cacheQueryResults = (key, data) => true;

const joinGroup = (group) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const signTransaction = (tx, key) => "signed_tx_hash";

const validateRecaptcha = (token) => true;

const exitScope = (table) => true;

const restoreDatabase = (path) => true;

const reportWarning = (msg, line) => console.warn(msg);

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const controlCongestion = (sock) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const unlockFile = (path) => ({ path, locked: false });

const negotiateSession = (sock) => ({ id: "sess_1" });

const createMediaElementSource = (ctx, el) => ({});

const dhcpRequest = (ip) => true;

const extractArchive = (archive) => ["file1", "file2"];

const interestPeer = (peer) => ({ ...peer, interested: true });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const cullFace = (mode) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const muteStream = () => true;

const updateRoutingTable = (entry) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const killProcess = (pid) => true;

const activeTexture = (unit) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const reportError = (msg, line) => console.error(msg);

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

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

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const getShaderInfoLog = (shader) => "";

const spoofReferer = () => "https://google.com";

const dropTable = (table) => true;

const bindTexture = (target, texture) => true;

const getOutputTimestamp = (ctx) => Date.now();

const prettifyCode = (code) => code;

const deleteTexture = (texture) => true;

const scaleMatrix = (mat, vec) => mat;

const setViewport = (x, y, w, h) => true;

const setKnee = (node, val) => node.knee.value = val;

const computeLossFunction = (pred, actual) => 0.05;

const negotiateProtocol = () => "HTTP/2.0";

const repairCorruptFile = (path) => ({ path, repaired: true });

const bundleAssets = (assets) => "";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const broadcastMessage = (msg) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const dhcpAck = () => true;

const compileFragmentShader = (source) => ({ compiled: true });

const checkBalance = (addr) => "10.5 ETH";

const rotateMatrix = (mat, angle, axis) => mat;

const getExtension = (name) => ({});

const generateEmbeddings = (text) => new Float32Array(128);

const receivePacket = (sock, len) => new Uint8Array(len);

const setDistanceModel = (panner, model) => true;

const postProcessBloom = (image, threshold) => image;

const verifyIR = (ir) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const getProgramInfoLog = (program) => "";

const interpretBytecode = (bc) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const dhcpOffer = (ip) => true;

const disablePEX = () => false;

const captureScreenshot = () => "data:image/png;base64,...";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const calculateComplexity = (ast) => 1;

const beginTransaction = () => "TX-" + Date.now();

const rollbackTransaction = (tx) => true;

const uniform1i = (loc, val) => true;

const rotateLogFiles = () => true;

const setRatio = (node, val) => node.ratio.value = val;

const parsePayload = (packet) => ({});

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const encryptLocalStorage = (key, val) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const startOscillator = (osc, time) => true;

const setAttack = (node, val) => node.attack.value = val;

// Anti-shake references
const _ref_rztvhf = { encryptStream };
const _ref_l4iy91 = { optimizeConnectionPool };
const _ref_nnq1ze = { uninterestPeer };
const _ref_p4d81r = { cancelTask };
const _ref_citjtw = { showNotification };
const _ref_kfdutu = { parseQueryString };
const _ref_vu150p = { applyPerspective };
const _ref_4bhzs8 = { sanitizeXSS };
const _ref_tzl0hn = { calculateCRC32 };
const _ref_i2kb08 = { refreshAuthToken };
const _ref_t3a0cv = { predictTensor };
const _ref_jsro85 = { debouncedResize };
const _ref_og195q = { validateIPWhitelist };
const _ref_1palfi = { createIndex };
const _ref_6ttxga = { scheduleTask };
const _ref_uyjujo = { recognizeSpeech };
const _ref_b1vaaw = { extractThumbnail };
const _ref_owg4e2 = { lockRow };
const _ref_rbdm2v = { executeSQLQuery };
const _ref_i295a9 = { bindSocket };
const _ref_l3lcon = { flushSocketBuffer };
const _ref_q3t9w0 = { decompressGzip };
const _ref_zhszda = { shutdownComputer };
const _ref_dmun4b = { setSocketTimeout };
const _ref_pb6wya = { enableDHT };
const _ref_e5lnfx = { FileValidator };
const _ref_t28v5c = { CacheManager };
const _ref_uh2mb8 = { validateFormInput };
const _ref_npgxhn = { drawArrays };
const _ref_og3kx6 = { auditAccessLogs };
const _ref_kpc4sd = { registerGestureHandler };
const _ref_8ryd1f = { requestAnimationFrameLoop };
const _ref_hrow0p = { tunnelThroughProxy };
const _ref_clxcjb = { hydrateSSR };
const _ref_2371y4 = { parseExpression };
const _ref_79d84k = { readPixels };
const _ref_8xd9cr = { computeSpeedAverage };
const _ref_wnf5q3 = { createShader };
const _ref_uzf1uh = { createDynamicsCompressor };
const _ref_cwmhfx = { detectObjectYOLO };
const _ref_01hb9r = { createIndexBuffer };
const _ref_6mg0ms = { getMemoryUsage };
const _ref_fjizxf = { validateTokenStructure };
const _ref_kulzk0 = { encodeABI };
const _ref_cbbjy7 = { createGainNode };
const _ref_en2drf = { deleteBuffer };
const _ref_9p335x = { rayIntersectTriangle };
const _ref_goohwh = { unlockRow };
const _ref_1fligr = { createListener };
const _ref_dhz8so = { parseMagnetLink };
const _ref_35dy70 = { detectVirtualMachine };
const _ref_g473qj = { translateText };
const _ref_moigvh = { vertexAttrib3f };
const _ref_ei9g5a = { createAnalyser };
const _ref_2iwen1 = { createFrameBuffer };
const _ref_n3zeaq = { generateMipmaps };
const _ref_xuvobp = { createChannelMerger };
const _ref_omhw0i = { deleteProgram };
const _ref_otpnjv = { cancelAnimationFrameLoop };
const _ref_9kdl22 = { limitBandwidth };
const _ref_jrfnf1 = { diffVirtualDOM };
const _ref_70c9uj = { detectFirewallStatus };
const _ref_ug7k8o = { allocateDiskSpace };
const _ref_8odvse = { decodeABI };
const _ref_5n8i1b = { setGainValue };
const _ref_vlzq0z = { calculateMD5 };
const _ref_offsdn = { subscribeToEvents };
const _ref_5qip5k = { compileVertexShader };
const _ref_ok0ff3 = { generateWalletKeys };
const _ref_7xhc8t = { loadImpulseResponse };
const _ref_yobol4 = { cleanOldLogs };
const _ref_u63x7r = { setDelayTime };
const _ref_5pu4vu = { connectNodes };
const _ref_74yqdf = { createConvolver };
const _ref_x0ni2p = { uniform3f };
const _ref_0mgs7m = { encryptPeerTraffic };
const _ref_jc3j6q = { createPanner };
const _ref_cb1ks3 = { setDopplerFactor };
const _ref_f8jd5i = { analyzeBitrate };
const _ref_9p3w78 = { createDelay };
const _ref_izx5ue = { setQValue };
const _ref_rs4rq6 = { closeContext };
const _ref_qzhw9g = { scheduleBandwidth };
const _ref_hx70ax = { closeSocket };
const _ref_e4sg8o = { createMediaStreamSource };
const _ref_cjuwjo = { useProgram };
const _ref_6u425r = { establishHandshake };
const _ref_wln6uy = { fragmentPacket };
const _ref_ct58z9 = { clusterKMeans };
const _ref_bvhtv3 = { resumeContext };
const _ref_s3v4fe = { getByteFrequencyData };
const _ref_wxbdpd = { performTLSHandshake };
const _ref_sml4tg = { createWaveShaper };
const _ref_euls9u = { checkBatteryLevel };
const _ref_clw5t7 = { disconnectNodes };
const _ref_5s7w6g = { virtualScroll };
const _ref_19022o = { setPosition };
const _ref_c7fwmy = { enterScope };
const _ref_n6xpg2 = { injectCSPHeader };
const _ref_5salfv = { validateProgram };
const _ref_v6ci8a = { installUpdate };
const _ref_t239y2 = { synthesizeSpeech };
const _ref_sff5xl = { setDetune };
const _ref_8a3psl = { createProcess };
const _ref_ah4st8 = { multicastMessage };
const _ref_k1nrvb = { clearScreen };
const _ref_gkdma4 = { isFeatureEnabled };
const _ref_0xe106 = { updateBitfield };
const _ref_2e2jos = { systemCall };
const _ref_qmphax = { suspendContext };
const _ref_1lqgiu = { setOrientation };
const _ref_q7g7vm = { setFilterType };
const _ref_4blpl4 = { merkelizeRoot };
const _ref_qyqtl4 = { retryFailedSegment };
const _ref_720im5 = { convertFormat };
const _ref_a71n9w = { attachRenderBuffer };
const _ref_ea5qzi = { initWebGLContext };
const _ref_jg40ax = { calculateGasFee };
const _ref_zebsxq = { cacheQueryResults };
const _ref_ma2slu = { joinGroup };
const _ref_wuz0p0 = { setThreshold };
const _ref_dmkxwy = { signTransaction };
const _ref_ohcr4q = { validateRecaptcha };
const _ref_gwdif7 = { exitScope };
const _ref_v3kbia = { restoreDatabase };
const _ref_6a0jvp = { reportWarning };
const _ref_flhbgg = { createBiquadFilter };
const _ref_grdfeq = { controlCongestion };
const _ref_oiqenr = { createOscillator };
const _ref_lrskcg = { unlockFile };
const _ref_lf7mmy = { negotiateSession };
const _ref_y7yidl = { createMediaElementSource };
const _ref_ywq3wm = { dhcpRequest };
const _ref_hv0hlo = { extractArchive };
const _ref_5dn26b = { interestPeer };
const _ref_sxmv3q = { resolveHostName };
const _ref_lvv8jb = { cullFace };
const _ref_fu273r = { getFloatTimeDomainData };
const _ref_pxbk4k = { muteStream };
const _ref_p9qfa3 = { updateRoutingTable };
const _ref_4ngqmd = { normalizeAudio };
const _ref_2s48ug = { killProcess };
const _ref_zmmsf8 = { activeTexture };
const _ref_pl0cxr = { animateTransition };
const _ref_pz2nt7 = { reportError };
const _ref_08ocai = { verifyMagnetLink };
const _ref_fklp7t = { optimizeMemoryUsage };
const _ref_xg49so = { VirtualFSTree };
const _ref_lnzrk3 = { generateUserAgent };
const _ref_qk914y = { normalizeVector };
const _ref_m6a10g = { monitorNetworkInterface };
const _ref_19viad = { getShaderInfoLog };
const _ref_g6jrpj = { spoofReferer };
const _ref_cvx5r3 = { dropTable };
const _ref_yfiwmd = { bindTexture };
const _ref_dfwhx7 = { getOutputTimestamp };
const _ref_pe5fv5 = { prettifyCode };
const _ref_ykvghj = { deleteTexture };
const _ref_6chydx = { scaleMatrix };
const _ref_fuerps = { setViewport };
const _ref_e5h9d5 = { setKnee };
const _ref_kofm9k = { computeLossFunction };
const _ref_14jgux = { negotiateProtocol };
const _ref_yqrykw = { repairCorruptFile };
const _ref_tve35w = { bundleAssets };
const _ref_8kn6dl = { loadModelWeights };
const _ref_xpd8ti = { broadcastMessage };
const _ref_zbeshl = { chokePeer };
const _ref_8xk8vc = { simulateNetworkDelay };
const _ref_snqa4c = { dhcpAck };
const _ref_ss5b0d = { compileFragmentShader };
const _ref_zvcsls = { checkBalance };
const _ref_7u3xkj = { rotateMatrix };
const _ref_jtqj55 = { getExtension };
const _ref_d64otv = { generateEmbeddings };
const _ref_gxfu61 = { receivePacket };
const _ref_uho3hp = { setDistanceModel };
const _ref_rd45g4 = { postProcessBloom };
const _ref_66al67 = { verifyIR };
const _ref_ndivca = { parseM3U8Playlist };
const _ref_loggfn = { getProgramInfoLog };
const _ref_i6kzkj = { interpretBytecode };
const _ref_h0gycd = { lazyLoadComponent };
const _ref_bbgwxy = { unchokePeer };
const _ref_wcb0nr = { dhcpOffer };
const _ref_ocklbu = { disablePEX };
const _ref_n23udh = { captureScreenshot };
const _ref_ahqztk = { setFrequency };
const _ref_ov28lv = { calculateComplexity };
const _ref_p0uj95 = { beginTransaction };
const _ref_shguwy = { rollbackTransaction };
const _ref_mebhsq = { uniform1i };
const _ref_hu8rf3 = { rotateLogFiles };
const _ref_aqyj5y = { setRatio };
const _ref_wby7jp = { parsePayload };
const _ref_uknwrd = { uploadCrashReport };
const _ref_edu5lx = { encryptLocalStorage };
const _ref_2216cr = { debounceAction };
const _ref_7rynax = { startOscillator };
const _ref_nnpx3i = { setAttack }; 
    });
})({}, {});