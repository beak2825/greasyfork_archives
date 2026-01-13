// ==UserScript==
// @name asobichannel视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/asobichannel/index.js
// @version 2026.01.10
// @description 一键下载asobichannel视频，支持4K/1080P/720P多画质。
// @icon https://asobichannel.asobistore.jp/favicon.ico
// @match *://asobichannel.asobistore.jp/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect asobistore.jp
// @connect microcms.io
// @connect or.jp
// @connect cloudfront.net
// @connect channel.or.jp
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
// @downloadURL https://update.greasyfork.org/scripts/562232/asobichannel%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562232/asobichannel%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const resolveCollision = (manifold) => true;

const statFile = (path) => ({ size: 0 });

const normalizeVolume = (buffer) => buffer;

const closeContext = (ctx) => Promise.resolve();

const addPoint2PointConstraint = (world, c) => true;

const setInertia = (body, i) => true;

const attachRenderBuffer = (fb, rb) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const processAudioBuffer = (buffer) => buffer;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const rayCast = (world, start, end) => ({ hit: false });

const resetVehicle = (vehicle) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const unrollLoops = (ast) => ast;

const createAudioContext = () => ({ sampleRate: 44100 });

const resampleAudio = (buffer, rate) => buffer;

const createSphereShape = (r) => ({ type: 'sphere' });

const wakeUp = (body) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const clearScreen = (r, g, b, a) => true;

const updateTransform = (body) => true;

const setDopplerFactor = (val) => true;

const applyTorque = (body, torque) => true;

const createSoftBody = (info) => ({ nodes: [] });

const useProgram = (program) => true;

const generateSourceMap = (ast) => "{}";

const detectCollision = (body1, body2) => false;

const createPeriodicWave = (ctx, real, imag) => ({});

const establishHandshake = (sock) => true;

const cullFace = (mode) => true;

const checkBatteryLevel = () => 100;

const sanitizeXSS = (html) => html;

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

const signTransaction = (tx, key) => "signed_tx_hash";

const drawArrays = (gl, mode, first, count) => true;

const disableRightClick = () => true;

const resolveImports = (ast) => [];


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const encryptStream = (stream, key) => stream;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const uniform3f = (loc, x, y, z) => true;

const disconnectNodes = (node) => true;

const dhcpAck = () => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const activeTexture = (unit) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createTCPSocket = () => ({ fd: 1 });

const handleTimeout = (sock) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const detectVirtualMachine = () => false;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const emitParticles = (sys, count) => true;

const encodeABI = (method, params) => "0x...";

const addRigidBody = (world, body) => true;

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

const profilePerformance = (func) => 0;

const getExtension = (name) => ({});

const setMTU = (iface, mtu) => true;

const checkBalance = (addr) => "10.5 ETH";

const foldConstants = (ast) => ast;

const uniformMatrix4fv = (loc, transpose, val) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const analyzeHeader = (packet) => ({});

const getShaderInfoLog = (shader) => "";

const bufferMediaStream = (size) => ({ buffer: size });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const stepSimulation = (world, dt) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const auditAccessLogs = () => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const visitNode = (node) => true;

const scaleMatrix = (mat, vec) => mat;

const joinThread = (tid) => true;

const lockRow = (id) => true;

const downInterface = (iface) => true;

const triggerHapticFeedback = (intensity) => true;

const mockResponse = (body) => ({ status: 200, body });

const fragmentPacket = (data, mtu) => [data];

const vertexAttrib3f = (idx, x, y, z) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const detectDevTools = () => false;

const restartApplication = () => console.log("Restarting...");

const dhcpRequest = (ip) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const validateIPWhitelist = (ip) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const encryptPeerTraffic = (data) => btoa(data);

const removeConstraint = (world, c) => true;

const createParticleSystem = (count) => ({ particles: [] });

const deleteTexture = (texture) => true;

const verifyChecksum = (data, sum) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const claimRewards = (pool) => "0.5 ETH";

const allowSleepMode = () => true;

const protectMemory = (ptr, size, flags) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const contextSwitch = (oldPid, newPid) => true;

const allocateMemory = (size) => 0x1000;

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

const setBrake = (vehicle, force, wheelIdx) => true;

const createChannelSplitter = (ctx, channels) => ({});

const forkProcess = () => 101;

const translateText = (text, lang) => text;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const optimizeAST = (ast) => ast;

const parsePayload = (packet) => ({});

const bindTexture = (target, texture) => true;

const setPan = (node, val) => node.pan.value = val;


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

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const setGainValue = (node, val) => node.gain.value = val;

const announceToTracker = (url) => ({ url, interval: 1800 });

const fingerprintBrowser = () => "fp_hash_123";

const logErrorToFile = (err) => console.error(err);

const compressPacket = (data) => data;

const prioritizeRarestPiece = (pieces) => pieces[0];

const gaussianBlur = (image, radius) => image;

const monitorClipboard = () => "";

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const enableBlend = (func) => true;

const disablePEX = () => false;

const closeFile = (fd) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const unlinkFile = (path) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const loadDriver = (path) => true;

const hoistVariables = (ast) => ast;

const transcodeStream = (format) => ({ format, status: "processing" });

const setKnee = (node, val) => node.knee.value = val;

const createConstraint = (body1, body2) => ({});

const calculateCRC32 = (data) => "00000000";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const limitRate = (stream, rate) => stream;

const getOutputTimestamp = (ctx) => Date.now();

const createBoxShape = (w, h, d) => ({ type: 'box' });

const lookupSymbol = (table, name) => ({});

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const encryptLocalStorage = (key, val) => true;

const setQValue = (filter, q) => filter.Q = q;

const connectSocket = (sock, addr, port) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const makeDistortionCurve = (amount) => new Float32Array(4096);

const extractArchive = (archive) => ["file1", "file2"];

const createPipe = () => [3, 4];

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const encapsulateFrame = (packet) => packet;

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

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const killProcess = (pid) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const unmountFileSystem = (path) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const reassemblePacket = (fragments) => fragments[0];

const receivePacket = (sock, len) => new Uint8Array(len);

const getFloatTimeDomainData = (analyser, array) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const setGravity = (world, g) => world.gravity = g;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const defineSymbol = (table, name, info) => true;

const beginTransaction = () => "TX-" + Date.now();

const mountFileSystem = (dev, path) => true;

const updateWheelTransform = (wheel) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const optimizeTailCalls = (ast) => ast;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const inferType = (node) => 'any';

const acceptConnection = (sock) => ({ fd: 2 });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const shardingTable = (table) => ["shard_0", "shard_1"];

const dhcpDiscover = () => true;

const deobfuscateString = (str) => atob(str);

const obfuscateString = (str) => btoa(str);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createDirectoryRecursive = (path) => path.split('/').length;

const drawElements = (mode, count, type, offset) => true;

const checkIntegrityToken = (token) => true;

const parseQueryString = (qs) => ({});

const arpRequest = (ip) => "00:00:00:00:00:00";

const updateSoftBody = (body) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const registerGestureHandler = (gesture) => true;

// Anti-shake references
const _ref_2bduq4 = { resolveCollision };
const _ref_l2q792 = { statFile };
const _ref_37qnhv = { normalizeVolume };
const _ref_90rw32 = { closeContext };
const _ref_1cszil = { addPoint2PointConstraint };
const _ref_cruxkn = { setInertia };
const _ref_fwe53y = { attachRenderBuffer };
const _ref_0ttvu8 = { createFrameBuffer };
const _ref_yg6pbc = { getVelocity };
const _ref_jh4vd6 = { processAudioBuffer };
const _ref_z6uy3w = { createOscillator };
const _ref_4ag91w = { rayCast };
const _ref_bfxanx = { resetVehicle };
const _ref_twfze1 = { applyEngineForce };
const _ref_t66dj5 = { createGainNode };
const _ref_lil0qe = { unrollLoops };
const _ref_5h8nll = { createAudioContext };
const _ref_ebp26e = { resampleAudio };
const _ref_b8lo10 = { createSphereShape };
const _ref_jms6nf = { wakeUp };
const _ref_ysu8y9 = { setDelayTime };
const _ref_xmvypd = { clearScreen };
const _ref_5dczhm = { updateTransform };
const _ref_bi9kv3 = { setDopplerFactor };
const _ref_mxklj1 = { applyTorque };
const _ref_q0jt8n = { createSoftBody };
const _ref_ua3v78 = { useProgram };
const _ref_pjlmdk = { generateSourceMap };
const _ref_puntxw = { detectCollision };
const _ref_xxujst = { createPeriodicWave };
const _ref_626pm4 = { establishHandshake };
const _ref_8evu3z = { cullFace };
const _ref_5eg1vb = { checkBatteryLevel };
const _ref_geszvn = { sanitizeXSS };
const _ref_q4dkyj = { VirtualFSTree };
const _ref_veg8mk = { signTransaction };
const _ref_55sb0r = { drawArrays };
const _ref_ehso8w = { disableRightClick };
const _ref_qwr2ul = { resolveImports };
const _ref_2xfta7 = { getAppConfig };
const _ref_ccsg5q = { encryptStream };
const _ref_y7qce7 = { computeNormal };
const _ref_hebl34 = { resolveDependencyGraph };
const _ref_tcxl0n = { uniform3f };
const _ref_3is01y = { disconnectNodes };
const _ref_26rypd = { dhcpAck };
const _ref_frmfzo = { calculateRestitution };
const _ref_0isgyp = { activeTexture };
const _ref_9c7b9y = { transformAesKey };
const _ref_h0hk4v = { createTCPSocket };
const _ref_h159b0 = { handleTimeout };
const _ref_pts2tt = { decodeABI };
const _ref_2775in = { verifyFileSignature };
const _ref_2ftiwg = { detectVirtualMachine };
const _ref_u7pchf = { archiveFiles };
const _ref_s8zskx = { emitParticles };
const _ref_jfto2g = { encodeABI };
const _ref_ethkuk = { addRigidBody };
const _ref_25y1ip = { download };
const _ref_tuw5jh = { profilePerformance };
const _ref_21wild = { getExtension };
const _ref_kkmg8w = { setMTU };
const _ref_m5c73d = { checkBalance };
const _ref_dclukw = { foldConstants };
const _ref_fixcxn = { uniformMatrix4fv };
const _ref_7bmyyy = { scheduleBandwidth };
const _ref_31fr13 = { switchProxyServer };
const _ref_dz0uja = { checkIntegrity };
const _ref_uoz13h = { analyzeHeader };
const _ref_lkju65 = { getShaderInfoLog };
const _ref_uxei0f = { bufferMediaStream };
const _ref_em1dyd = { parseTorrentFile };
const _ref_g1lfnc = { setFrequency };
const _ref_io8qck = { stepSimulation };
const _ref_4y49xf = { bindSocket };
const _ref_03z5cc = { auditAccessLogs };
const _ref_hvhbv8 = { initWebGLContext };
const _ref_lwyv8h = { visitNode };
const _ref_64a7r9 = { scaleMatrix };
const _ref_lms374 = { joinThread };
const _ref_1iyia1 = { lockRow };
const _ref_sgrczn = { downInterface };
const _ref_k5u4u7 = { triggerHapticFeedback };
const _ref_2pgjxd = { mockResponse };
const _ref_k9af16 = { fragmentPacket };
const _ref_s15kd2 = { vertexAttrib3f };
const _ref_x5p50d = { convertHSLtoRGB };
const _ref_mqbdgr = { detectDevTools };
const _ref_bdlsr3 = { restartApplication };
const _ref_8ta1jd = { dhcpRequest };
const _ref_g1j2tb = { discoverPeersDHT };
const _ref_q0z6sq = { validateIPWhitelist };
const _ref_o2moni = { convexSweepTest };
const _ref_e4ymnn = { analyzeUserBehavior };
const _ref_ukxc9t = { formatLogMessage };
const _ref_ha9vju = { uploadCrashReport };
const _ref_flhpwq = { encryptPeerTraffic };
const _ref_burbut = { removeConstraint };
const _ref_291cor = { createParticleSystem };
const _ref_z7hyac = { deleteTexture };
const _ref_sx2xly = { verifyChecksum };
const _ref_z6dcg8 = { optimizeMemoryUsage };
const _ref_nc7jh0 = { claimRewards };
const _ref_4ilkrx = { allowSleepMode };
const _ref_agade5 = { protectMemory };
const _ref_oavkzk = { getAngularVelocity };
const _ref_t9nglf = { contextSwitch };
const _ref_0gupc0 = { allocateMemory };
const _ref_3plvus = { AdvancedCipher };
const _ref_7fdqh3 = { setBrake };
const _ref_zhvc2b = { createChannelSplitter };
const _ref_9deyin = { forkProcess };
const _ref_4ij63o = { translateText };
const _ref_sz4rb6 = { applyPerspective };
const _ref_o647bu = { optimizeAST };
const _ref_kemu86 = { parsePayload };
const _ref_z5lopw = { bindTexture };
const _ref_hvnngx = { setPan };
const _ref_govnb5 = { TelemetryClient };
const _ref_1glrhv = { compressDataStream };
const _ref_xgngdx = { setGainValue };
const _ref_ozm9ny = { announceToTracker };
const _ref_w45ibp = { fingerprintBrowser };
const _ref_qw37gt = { logErrorToFile };
const _ref_jb86li = { compressPacket };
const _ref_r4uja2 = { prioritizeRarestPiece };
const _ref_plfb2m = { gaussianBlur };
const _ref_4y1s4k = { monitorClipboard };
const _ref_bw83we = { calculateLighting };
const _ref_jx5xhu = { enableBlend };
const _ref_bru78u = { disablePEX };
const _ref_pyi89v = { closeFile };
const _ref_ib6tye = { readPixels };
const _ref_4a5s1q = { unlinkFile };
const _ref_bc7a8o = { deleteTempFiles };
const _ref_5jl07w = { loadDriver };
const _ref_wxb44f = { hoistVariables };
const _ref_qchmq5 = { transcodeStream };
const _ref_dy9w88 = { setKnee };
const _ref_rqlb3c = { createConstraint };
const _ref_dshu3f = { calculateCRC32 };
const _ref_ck1rkk = { seedRatioLimit };
const _ref_8zozyg = { limitRate };
const _ref_0gpnb4 = { getOutputTimestamp };
const _ref_zuqzvl = { createBoxShape };
const _ref_28h1mb = { lookupSymbol };
const _ref_klw0bg = { keepAlivePing };
const _ref_2sxvgj = { encryptLocalStorage };
const _ref_vvj7uz = { setQValue };
const _ref_d0pjnt = { connectSocket };
const _ref_9igmdt = { generateEmbeddings };
const _ref_4ta955 = { parseFunction };
const _ref_hsa8ch = { analyzeQueryPlan };
const _ref_ah7kea = { makeDistortionCurve };
const _ref_l2iwvt = { extractArchive };
const _ref_nlw0ln = { createPipe };
const _ref_2opeds = { uninterestPeer };
const _ref_tz3pty = { encapsulateFrame };
const _ref_yk45lk = { generateFakeClass };
const _ref_1x2ves = { parseClass };
const _ref_c934op = { FileValidator };
const _ref_kp738e = { killProcess };
const _ref_crj2fj = { createIndexBuffer };
const _ref_qagukh = { throttleRequests };
const _ref_gwwoz6 = { unmountFileSystem };
const _ref_r5d6g2 = { backupDatabase };
const _ref_kx1j6g = { reassemblePacket };
const _ref_1lwtq4 = { receivePacket };
const _ref_6h615z = { getFloatTimeDomainData };
const _ref_9bixbt = { limitDownloadSpeed };
const _ref_4mcutu = { calculateSHA256 };
const _ref_pohybx = { setGravity };
const _ref_i6j0yl = { tunnelThroughProxy };
const _ref_tlknyj = { defineSymbol };
const _ref_wg4vfs = { beginTransaction };
const _ref_1zyfmk = { mountFileSystem };
const _ref_pj70op = { updateWheelTransform };
const _ref_lqij1s = { simulateNetworkDelay };
const _ref_68etmq = { decryptHLSStream };
const _ref_5p46jp = { optimizeTailCalls };
const _ref_q8zf9b = { calculateMD5 };
const _ref_is73fn = { inferType };
const _ref_t4x0f3 = { acceptConnection };
const _ref_v3621d = { rayIntersectTriangle };
const _ref_gaong7 = { shardingTable };
const _ref_8pqrbl = { dhcpDiscover };
const _ref_xzt6ff = { deobfuscateString };
const _ref_fj2s58 = { obfuscateString };
const _ref_uvaj27 = { executeSQLQuery };
const _ref_76nc6f = { createDirectoryRecursive };
const _ref_0k47l7 = { drawElements };
const _ref_o1jowx = { checkIntegrityToken };
const _ref_229maf = { parseQueryString };
const _ref_hq9m56 = { arpRequest };
const _ref_f0iob8 = { updateSoftBody };
const _ref_2fvjge = { generateUserAgent };
const _ref_lffvhc = { connectToTracker };
const _ref_xle3qy = { createCapsuleShape };
const _ref_go6pb4 = { parseConfigFile };
const _ref_veadfh = { registerGestureHandler }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `asobichannel` };
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
                const urlParams = { config, url: window.location.href, name_en: `asobichannel` };

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
        const unmountFileSystem = (path) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const createIndex = (table, col) => `IDX_${table}_${col}`;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const dropTable = (table) => true;

const deobfuscateString = (str) => atob(str);

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const setSocketTimeout = (ms) => ({ timeout: ms });

const triggerHapticFeedback = (intensity) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const replicateData = (node) => ({ target: node, synced: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
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

const lockFile = (path) => ({ path, locked: true });

const edgeDetectionSobel = (image) => image;

const processAudioBuffer = (buffer) => buffer;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const disablePEX = () => false;

const createSoftBody = (info) => ({ nodes: [] });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const chokePeer = (peer) => ({ ...peer, choked: true });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const cullFace = (mode) => true;

const resetVehicle = (vehicle) => true;

const gaussianBlur = (image, radius) => image;

const spoofReferer = () => "https://google.com";

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const enableDHT = () => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const invalidateCache = (key) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const setDetune = (osc, cents) => osc.detune = cents;

const getShaderInfoLog = (shader) => "";

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const checkParticleCollision = (sys, world) => true;

const addConeTwistConstraint = (world, c) => true;

const preventCSRF = () => "csrf_token";

const setBrake = (vehicle, force, wheelIdx) => true;

const createMediaElementSource = (ctx, el) => ({});

const unrollLoops = (ast) => ast;

const installUpdate = () => false;

const setGravity = (world, g) => world.gravity = g;

const stakeAssets = (pool, amount) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const setAngularVelocity = (body, v) => true;

const merkelizeRoot = (txs) => "root_hash";

const shutdownComputer = () => console.log("Shutting down...");

const signTransaction = (tx, key) => "signed_tx_hash";

const bufferMediaStream = (size) => ({ buffer: size });

const rollbackTransaction = (tx) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const logErrorToFile = (err) => console.error(err);

const unlinkFile = (path) => true;

const restartApplication = () => console.log("Restarting...");

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const unloadDriver = (name) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const linkFile = (src, dest) => true;

const createSymbolTable = () => ({ scopes: [] });

const rateLimitCheck = (ip) => true;

const setGainValue = (node, val) => node.gain.value = val;

const getBlockHeight = () => 15000000;

const scheduleProcess = (pid) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const freeMemory = (ptr) => true;

const establishHandshake = (sock) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const createTCPSocket = () => ({ fd: 1 });

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

const createFrameBuffer = () => ({ id: Math.random() });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const compileToBytecode = (ast) => new Uint8Array();


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

const dhcpDiscover = () => true;

const mangleNames = (ast) => ast;

const instrumentCode = (code) => code;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const updateRoutingTable = (entry) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

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

const suspendContext = (ctx) => Promise.resolve();

const monitorClipboard = () => "";

const restoreDatabase = (path) => true;

const createThread = (func) => ({ tid: 1 });

const setMass = (body, m) => true;

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

const cacheQueryResults = (key, data) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createPipe = () => [3, 4];

const setPan = (node, val) => node.pan.value = val;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const injectCSPHeader = () => "default-src 'self'";

const applyForce = (body, force, point) => true;

const validatePieceChecksum = (piece) => true;

const validateIPWhitelist = (ip) => true;

const renameFile = (oldName, newName) => newName;

const encodeABI = (method, params) => "0x...";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const setDopplerFactor = (val) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const addGeneric6DofConstraint = (world, c) => true;

const cancelTask = (id) => ({ id, cancelled: true });


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

const analyzeHeader = (packet) => ({});

const mountFileSystem = (dev, path) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const obfuscateString = (str) => btoa(str);

const closeContext = (ctx) => Promise.resolve();

const semaphoreWait = (sem) => true;

const resumeContext = (ctx) => Promise.resolve();

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const estimateNonce = (addr) => 42;

const leaveGroup = (group) => true;

const detachThread = (tid) => true;

const checkUpdate = () => ({ hasUpdate: false });

const adjustWindowSize = (sock, size) => true;

const convertFormat = (src, dest) => dest;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const clusterKMeans = (data, k) => Array(k).fill([]);

const reportWarning = (msg, line) => console.warn(msg);

const computeDominators = (cfg) => ({});

const syncAudioVideo = (offset) => ({ offset, synced: true });

const applyFog = (color, dist) => color;

const hydrateSSR = (html) => true;

const createChannelMerger = (ctx, channels) => ({});

const optimizeAST = (ast) => ast;

const verifyIR = (ir) => true;

const applyImpulse = (body, impulse, point) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const setEnv = (key, val) => true;

const chmodFile = (path, mode) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const getFloatTimeDomainData = (analyser, array) => true;

const connectSocket = (sock, addr, port) => true;

const broadcastMessage = (msg) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const decapsulateFrame = (frame) => frame;

const unlockRow = (id) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const removeConstraint = (world, c) => true;

const deleteTexture = (texture) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const remuxContainer = (container) => ({ container, status: "done" });

const transcodeStream = (format) => ({ format, status: "processing" });

const chdir = (path) => true;

const rotateLogFiles = () => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const setRelease = (node, val) => node.release.value = val;

const forkProcess = () => 101;

const setThreshold = (node, val) => node.threshold.value = val;

const normalizeVolume = (buffer) => buffer;

const chownFile = (path, uid, gid) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const extractArchive = (archive) => ["file1", "file2"];

const negotiateSession = (sock) => ({ id: "sess_1" });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const protectMemory = (ptr, size, flags) => true;

const checkTypes = (ast) => [];

const resolveDNS = (domain) => "127.0.0.1";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getByteFrequencyData = (analyser, array) => true;

const compileVertexShader = (source) => ({ compiled: true });

const prioritizeTraffic = (queue) => true;

const getOutputTimestamp = (ctx) => Date.now();

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const validateRecaptcha = (token) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const switchVLAN = (id) => true;

const detectDevTools = () => false;

const cleanOldLogs = (days) => days;

const getVehicleSpeed = (vehicle) => 0;

const mapMemory = (fd, size) => 0x2000;

const scheduleTask = (task) => ({ id: 1, task });

const verifyProofOfWork = (nonce) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const announceToTracker = (url) => ({ url, interval: 1800 });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const postProcessBloom = (image, threshold) => image;

const createDirectoryRecursive = (path) => path.split('/').length;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

// Anti-shake references
const _ref_h7axfe = { unmountFileSystem };
const _ref_13hvva = { shardingTable };
const _ref_c6q64s = { createIndex };
const _ref_z2phgt = { unchokePeer };
const _ref_1f2l6k = { dropTable };
const _ref_k7p0zn = { deobfuscateString };
const _ref_qckhed = { tunnelThroughProxy };
const _ref_eu2oy1 = { archiveFiles };
const _ref_nffecq = { setSocketTimeout };
const _ref_et2hxl = { triggerHapticFeedback };
const _ref_k5c4an = { vertexAttribPointer };
const _ref_t4g6zb = { discoverPeersDHT };
const _ref_hgzf1t = { replicateData };
const _ref_viopgu = { formatLogMessage };
const _ref_emm3cu = { initiateHandshake };
const _ref_5hbeyk = { calculatePieceHash };
const _ref_yn8xvr = { FileValidator };
const _ref_apu7bb = { lockFile };
const _ref_14pynu = { edgeDetectionSobel };
const _ref_3d0gcp = { processAudioBuffer };
const _ref_sxf08d = { generateUUIDv5 };
const _ref_b8qkxn = { updateBitfield };
const _ref_kgmlkc = { disablePEX };
const _ref_58imra = { createSoftBody };
const _ref_f6zibb = { convertHSLtoRGB };
const _ref_2ta7pz = { chokePeer };
const _ref_yfa808 = { calculateEntropy };
const _ref_ihdww4 = { uninterestPeer };
const _ref_cczjoc = { cullFace };
const _ref_ia2rlg = { resetVehicle };
const _ref_7lwmwv = { gaussianBlur };
const _ref_iayuan = { spoofReferer };
const _ref_hpii8a = { parseTorrentFile };
const _ref_axf8f0 = { enableDHT };
const _ref_sduqv8 = { parseSubtitles };
const _ref_yu68r1 = { invalidateCache };
const _ref_asgei8 = { parseFunction };
const _ref_9b3071 = { setDetune };
const _ref_9rke5j = { getShaderInfoLog };
const _ref_4btdzb = { normalizeVector };
const _ref_43ugrk = { checkDiskSpace };
const _ref_cpx4fa = { createDelay };
const _ref_hvqg7j = { resolveHostName };
const _ref_chv32q = { autoResumeTask };
const _ref_ozf2tn = { checkParticleCollision };
const _ref_l6cmne = { addConeTwistConstraint };
const _ref_dlp5gn = { preventCSRF };
const _ref_mnoul3 = { setBrake };
const _ref_pl5ts2 = { createMediaElementSource };
const _ref_qcax3k = { unrollLoops };
const _ref_xnjnxe = { installUpdate };
const _ref_cplaa9 = { setGravity };
const _ref_7hv9ko = { stakeAssets };
const _ref_cx88vo = { linkProgram };
const _ref_vx6swv = { setAngularVelocity };
const _ref_w32yot = { merkelizeRoot };
const _ref_x5qxiq = { shutdownComputer };
const _ref_1xmr6n = { signTransaction };
const _ref_abazvu = { bufferMediaStream };
const _ref_vw3vcn = { rollbackTransaction };
const _ref_t4m29k = { executeSQLQuery };
const _ref_5b2gwa = { logErrorToFile };
const _ref_yoxem5 = { unlinkFile };
const _ref_jnavjw = { restartApplication };
const _ref_jy9lp6 = { parseMagnetLink };
const _ref_iyl7uz = { parseClass };
const _ref_bo702u = { unloadDriver };
const _ref_ei5464 = { watchFileChanges };
const _ref_lxjkmw = { linkFile };
const _ref_gl6n11 = { createSymbolTable };
const _ref_aysbec = { rateLimitCheck };
const _ref_tazea3 = { setGainValue };
const _ref_ezaiw4 = { getBlockHeight };
const _ref_mme9uh = { scheduleProcess };
const _ref_7hkl1g = { convexSweepTest };
const _ref_2ygzqf = { freeMemory };
const _ref_z9hclx = { establishHandshake };
const _ref_l3015c = { serializeAST };
const _ref_a1sxw2 = { createTCPSocket };
const _ref_4aocgc = { download };
const _ref_m3hkjh = { createFrameBuffer };
const _ref_mjxm96 = { limitBandwidth };
const _ref_aufx7i = { compileToBytecode };
const _ref_1oujx4 = { TelemetryClient };
const _ref_wbxvhs = { dhcpDiscover };
const _ref_68e3r5 = { mangleNames };
const _ref_nt81wj = { instrumentCode };
const _ref_md8auj = { traceStack };
const _ref_ixpvfb = { updateRoutingTable };
const _ref_t8eo3n = { createSphereShape };
const _ref_u2anqt = { VirtualFSTree };
const _ref_t68uxv = { suspendContext };
const _ref_bgdnn8 = { monitorClipboard };
const _ref_jjrh4k = { restoreDatabase };
const _ref_m6jrwx = { createThread };
const _ref_aezqu8 = { setMass };
const _ref_250xcy = { generateFakeClass };
const _ref_y78lh8 = { checkIntegrityConstraint };
const _ref_cuodfs = { cacheQueryResults };
const _ref_z4pcim = { getAngularVelocity };
const _ref_nuonz1 = { createPipe };
const _ref_p0839d = { setPan };
const _ref_9gp12p = { moveFileToComplete };
const _ref_ct9ldm = { injectCSPHeader };
const _ref_wlijk5 = { applyForce };
const _ref_ywa2e5 = { validatePieceChecksum };
const _ref_6nyy0c = { validateIPWhitelist };
const _ref_czxqpe = { renameFile };
const _ref_gx0cey = { encodeABI };
const _ref_e4g72d = { parseM3U8Playlist };
const _ref_to3gtt = { setDopplerFactor };
const _ref_jggy58 = { migrateSchema };
const _ref_t0711p = { addGeneric6DofConstraint };
const _ref_kivf75 = { cancelTask };
const _ref_gh48lz = { ResourceMonitor };
const _ref_lxqqos = { analyzeHeader };
const _ref_uvmdbv = { mountFileSystem };
const _ref_ao4mwf = { uploadCrashReport };
const _ref_yylxtr = { getFileAttributes };
const _ref_3y8xv5 = { obfuscateString };
const _ref_8qnib3 = { closeContext };
const _ref_xuhoo1 = { semaphoreWait };
const _ref_4x09x6 = { resumeContext };
const _ref_px5xil = { verifyFileSignature };
const _ref_nfc86h = { estimateNonce };
const _ref_6igaxz = { leaveGroup };
const _ref_6a0ew9 = { detachThread };
const _ref_b4zrlr = { checkUpdate };
const _ref_z4zfzf = { adjustWindowSize };
const _ref_fnt2ax = { convertFormat };
const _ref_142uhx = { virtualScroll };
const _ref_vzaidv = { clusterKMeans };
const _ref_d85syp = { reportWarning };
const _ref_uvyxh8 = { computeDominators };
const _ref_xv9xca = { syncAudioVideo };
const _ref_rd7yb3 = { applyFog };
const _ref_dzm7m4 = { hydrateSSR };
const _ref_yispwc = { createChannelMerger };
const _ref_nymtl0 = { optimizeAST };
const _ref_b9c9ic = { verifyIR };
const _ref_z8zm49 = { applyImpulse };
const _ref_kc1uaz = { makeDistortionCurve };
const _ref_gtr4o4 = { normalizeAudio };
const _ref_ptrgiu = { setEnv };
const _ref_zx8y87 = { chmodFile };
const _ref_ybjye4 = { interceptRequest };
const _ref_2l4ocl = { getFloatTimeDomainData };
const _ref_492bj6 = { connectSocket };
const _ref_27sctw = { broadcastMessage };
const _ref_vv7vb8 = { decryptHLSStream };
const _ref_wugcfh = { queueDownloadTask };
const _ref_5uebrs = { decapsulateFrame };
const _ref_gyb0ug = { unlockRow };
const _ref_20r0m6 = { createVehicle };
const _ref_wqvlit = { removeConstraint };
const _ref_0a9hkx = { deleteTexture };
const _ref_hu5gke = { createBiquadFilter };
const _ref_wcftm5 = { remuxContainer };
const _ref_fonmmx = { transcodeStream };
const _ref_9lvu25 = { chdir };
const _ref_mw2egv = { rotateLogFiles };
const _ref_v5k4gl = { rotateUserAgent };
const _ref_p37o7n = { setRelease };
const _ref_sbi7dc = { forkProcess };
const _ref_x09l1b = { setThreshold };
const _ref_asfzvx = { normalizeVolume };
const _ref_piq1c7 = { chownFile };
const _ref_6pgdib = { connectionPooling };
const _ref_4si53j = { keepAlivePing };
const _ref_1jupg3 = { extractArchive };
const _ref_jsmal2 = { negotiateSession };
const _ref_1gbqsp = { createMagnetURI };
const _ref_yv0961 = { protectMemory };
const _ref_zv9i2u = { checkTypes };
const _ref_hnppj6 = { resolveDNS };
const _ref_efjs0n = { performTLSHandshake };
const _ref_a9qdb9 = { decodeABI };
const _ref_i8veaz = { createPhysicsWorld };
const _ref_52ki1v = { getByteFrequencyData };
const _ref_msb5vk = { compileVertexShader };
const _ref_hbm45h = { prioritizeTraffic };
const _ref_39bfnb = { getOutputTimestamp };
const _ref_vst03t = { createAnalyser };
const _ref_e6eusr = { checkIntegrity };
const _ref_7lpvfv = { validateRecaptcha };
const _ref_k3fz90 = { compileFragmentShader };
const _ref_2kpsuy = { switchVLAN };
const _ref_xtb2gh = { detectDevTools };
const _ref_titnee = { cleanOldLogs };
const _ref_h1ary2 = { getVehicleSpeed };
const _ref_ithbbt = { mapMemory };
const _ref_82xf7n = { scheduleTask };
const _ref_3qvdh3 = { verifyProofOfWork };
const _ref_y2hvyv = { createIndexBuffer };
const _ref_09e1wp = { announceToTracker };
const _ref_l71z23 = { monitorNetworkInterface };
const _ref_5c2pau = { connectToTracker };
const _ref_r9ogu6 = { postProcessBloom };
const _ref_jv21p8 = { createDirectoryRecursive };
const _ref_jcwatu = { scheduleBandwidth }; 
    });
})({}, {});