// ==UserScript==
// @name blerp视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/blerp/index.js
// @version 2026.01.10
// @description 一键下载blerp视频，支持4K/1080P/720P多画质。
// @icon https://blerp.com/favicon.ico
// @match *://blerp.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect blerp.com
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
// @downloadURL https://update.greasyfork.org/scripts/562238/blerp%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562238/blerp%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const normalizeVolume = (buffer) => buffer;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });


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

const mergeFiles = (parts) => parts[0];

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const preventSleepMode = () => true;

const translateMatrix = (mat, vec) => mat;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const auditAccessLogs = () => true;

const enableBlend = (func) => true;

const bufferData = (gl, target, data, usage) => true;

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

const splitFile = (path, parts) => Array(parts).fill(path);

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const createShader = (gl, type) => ({ id: Math.random(), type });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const rollbackTransaction = (tx) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const invalidateCache = (key) => true;

const obfuscateString = (str) => btoa(str);

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const deobfuscateString = (str) => atob(str);

const createChannelMerger = (ctx, channels) => ({});

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const validatePieceChecksum = (piece) => true;

const compileVertexShader = (source) => ({ compiled: true });

const processAudioBuffer = (buffer) => buffer;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createFrameBuffer = () => ({ id: Math.random() });

const stepSimulation = (world, dt) => true;

const segmentImageUNet = (img) => "mask_buffer";

const createIndexBuffer = (data) => ({ id: Math.random() });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const setPosition = (panner, x, y, z) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const detectDarkMode = () => true;

const remuxContainer = (container) => ({ container, status: "done" });

const attachRenderBuffer = (fb, rb) => true;

const getBlockHeight = () => 15000000;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const checkIntegrityToken = (token) => true;

const computeLossFunction = (pred, actual) => 0.05;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const resampleAudio = (buffer, rate) => buffer;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const instrumentCode = (code) => code;


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

const downInterface = (iface) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const blockMaliciousTraffic = (ip) => true;

const suspendContext = (ctx) => Promise.resolve();

const shardingTable = (table) => ["shard_0", "shard_1"];

const dhcpOffer = (ip) => true;

const applyTorque = (body, torque) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const allocateMemory = (size) => 0x1000;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const synthesizeSpeech = (text) => "audio_buffer";

const analyzeHeader = (packet) => ({});

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const cullFace = (mode) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const decapsulateFrame = (frame) => frame;

const scheduleProcess = (pid) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const mountFileSystem = (dev, path) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const semaphoreSignal = (sem) => true;

const rotateLogFiles = () => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const getFloatTimeDomainData = (analyser, array) => true;

const getMediaDuration = () => 3600;

const closeFile = (fd) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const handleInterrupt = (irq) => true;

const restoreDatabase = (path) => true;

const performOCR = (img) => "Detected Text";

const serializeFormData = (form) => JSON.stringify(form);

const verifySignature = (tx, sig) => true;

const visitNode = (node) => true;

const estimateNonce = (addr) => 42;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const resolveSymbols = (ast) => ({});

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const serializeAST = (ast) => JSON.stringify(ast);

const writeFile = (fd, data) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const checkBalance = (addr) => "10.5 ETH";

const openFile = (path, flags) => 5;

const deriveAddress = (path) => "0x123...";

const spoofReferer = () => "https://google.com";

const seekFile = (fd, offset) => true;

const checkUpdate = () => ({ hasUpdate: false });

const optimizeTailCalls = (ast) => ast;

const setRelease = (node, val) => node.release.value = val;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const scaleMatrix = (mat, vec) => mat;

const repairCorruptFile = (path) => ({ path, repaired: true });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const setDopplerFactor = (val) => true;

const prettifyCode = (code) => code;

const addRigidBody = (world, body) => true;

const systemCall = (num, args) => 0;

const clearScreen = (r, g, b, a) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const addWheel = (vehicle, info) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const captureFrame = () => "frame_data_buffer";

const connectNodes = (src, dest) => true;

const verifyAppSignature = () => true;

const parseLogTopics = (topics) => ["Transfer"];

const decompressGzip = (data) => data;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createSymbolTable = () => ({ scopes: [] });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const rebootSystem = () => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

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

const renameFile = (oldName, newName) => newName;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const calculateCRC32 = (data) => "00000000";

const interceptRequest = (req) => ({ ...req, intercepted: true });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const bindTexture = (target, texture) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const registerSystemTray = () => ({ icon: "tray.ico" });

const setPan = (node, val) => node.pan.value = val;

const reportError = (msg, line) => console.error(msg);

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const createAudioContext = () => ({ sampleRate: 44100 });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const mockResponse = (body) => ({ status: 200, body });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const gaussianBlur = (image, radius) => image;

const wakeUp = (body) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const applyImpulse = (body, impulse, point) => true;

const updateRoutingTable = (entry) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const prioritizeTraffic = (queue) => true;

const createProcess = (img) => ({ pid: 100 });

const bufferMediaStream = (size) => ({ buffer: size });

const createConvolver = (ctx) => ({ buffer: null });

const chmodFile = (path, mode) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const rayCast = (world, start, end) => ({ hit: false });

const adjustPlaybackSpeed = (rate) => rate;

const setKnee = (node, val) => node.knee.value = val;

const hydrateSSR = (html) => true;

const postProcessBloom = (image, threshold) => image;

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

const linkModules = (modules) => ({});

const protectMemory = (ptr, size, flags) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const validateIPWhitelist = (ip) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const chokePeer = (peer) => ({ ...peer, choked: true });

const validateFormInput = (input) => input.length > 0;

const removeRigidBody = (world, body) => true;

const cacheQueryResults = (key, data) => true;


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

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const syncAudioVideo = (offset) => ({ offset, synced: true });

const checkBatteryLevel = () => 100;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const addSliderConstraint = (world, c) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const applyFog = (color, dist) => color;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

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

const statFile = (path) => ({ size: 0 });

const sendPacket = (sock, data) => data.length;

const getByteFrequencyData = (analyser, array) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const debugAST = (ast) => "";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const resolveCollision = (manifold) => true;

const createListener = (ctx) => ({});

const createDirectoryRecursive = (path) => path.split('/').length;

const decodeAudioData = (buffer) => Promise.resolve({});

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const subscribeToEvents = (contract) => true;

// Anti-shake references
const _ref_9kx1mt = { normalizeVolume };
const _ref_o6dfhd = { diffVirtualDOM };
const _ref_q50fdc = { ApiDataFormatter };
const _ref_oevy8s = { mergeFiles };
const _ref_8zqz2f = { refreshAuthToken };
const _ref_dcpi83 = { preventSleepMode };
const _ref_8dpbvn = { translateMatrix };
const _ref_a1s1ul = { virtualScroll };
const _ref_hc6v03 = { debouncedResize };
const _ref_k7q9he = { auditAccessLogs };
const _ref_xpolao = { enableBlend };
const _ref_5bzgon = { bufferData };
const _ref_feyx59 = { VirtualFSTree };
const _ref_b1rxug = { splitFile };
const _ref_hfgt97 = { loadTexture };
const _ref_ldmpxd = { createShader };
const _ref_o1csyz = { showNotification };
const _ref_u3x6kt = { convertRGBtoHSL };
const _ref_ud98dl = { tunnelThroughProxy };
const _ref_l9uarq = { rollbackTransaction };
const _ref_bbg16r = { traceStack };
const _ref_h5v6p7 = { invalidateCache };
const _ref_3jrce1 = { obfuscateString };
const _ref_1eal77 = { verifyFileSignature };
const _ref_01xzus = { getMemoryUsage };
const _ref_kk4kqf = { deobfuscateString };
const _ref_c45gnh = { createChannelMerger };
const _ref_gnxraa = { createScriptProcessor };
const _ref_dcmr1v = { applyPerspective };
const _ref_w9rfxv = { validatePieceChecksum };
const _ref_s85jtx = { compileVertexShader };
const _ref_n48stm = { processAudioBuffer };
const _ref_4lzo3c = { createOscillator };
const _ref_y6w9bu = { createMeshShape };
const _ref_knxpom = { createFrameBuffer };
const _ref_vw15ta = { stepSimulation };
const _ref_9q05ga = { segmentImageUNet };
const _ref_nv6tb9 = { createIndexBuffer };
const _ref_x4ty02 = { getVelocity };
const _ref_3d5lyp = { connectToTracker };
const _ref_xo3zla = { setPosition };
const _ref_j5zanh = { validateTokenStructure };
const _ref_ia222x = { detectDarkMode };
const _ref_a39m9b = { remuxContainer };
const _ref_cez1h6 = { attachRenderBuffer };
const _ref_be6e12 = { getBlockHeight };
const _ref_1rv55o = { decodeABI };
const _ref_v7xz7b = { watchFileChanges };
const _ref_xthbgc = { checkIntegrityToken };
const _ref_vnq44p = { computeLossFunction };
const _ref_ov95y1 = { switchProxyServer };
const _ref_p67y84 = { resampleAudio };
const _ref_k95ej9 = { simulateNetworkDelay };
const _ref_josk77 = { instrumentCode };
const _ref_2x830l = { ResourceMonitor };
const _ref_3v7l6v = { downInterface };
const _ref_q2zlae = { createBiquadFilter };
const _ref_y67m3j = { blockMaliciousTraffic };
const _ref_pu26hs = { suspendContext };
const _ref_1ctf0m = { shardingTable };
const _ref_s3dmnm = { dhcpOffer };
const _ref_gu8nax = { applyTorque };
const _ref_dfud19 = { initiateHandshake };
const _ref_1hmxfg = { saveCheckpoint };
const _ref_vc1esn = { createBoxShape };
const _ref_75fe9p = { allocateMemory };
const _ref_jeitbv = { unchokePeer };
const _ref_4paa64 = { synthesizeSpeech };
const _ref_9jw9v7 = { analyzeHeader };
const _ref_0rpozo = { createMagnetURI };
const _ref_c79j3j = { cullFace };
const _ref_wj3ndg = { parseSubtitles };
const _ref_d0i70g = { decapsulateFrame };
const _ref_8qoeof = { scheduleProcess };
const _ref_xxvnyz = { checkDiskSpace };
const _ref_e8x0of = { mountFileSystem };
const _ref_5q2drd = { generateEmbeddings };
const _ref_7600mj = { semaphoreSignal };
const _ref_6oz5hf = { rotateLogFiles };
const _ref_iuqtgn = { calculateEntropy };
const _ref_w5ugbe = { terminateSession };
const _ref_pmshmx = { getFloatTimeDomainData };
const _ref_d8niqx = { getMediaDuration };
const _ref_m61ht8 = { closeFile };
const _ref_nnp58h = { queueDownloadTask };
const _ref_jdqmup = { handleInterrupt };
const _ref_788uf8 = { restoreDatabase };
const _ref_4dmxya = { performOCR };
const _ref_884hvd = { serializeFormData };
const _ref_9rwatp = { verifySignature };
const _ref_76p0l6 = { visitNode };
const _ref_42f0az = { estimateNonce };
const _ref_nvkera = { normalizeVector };
const _ref_bdfeuo = { resolveSymbols };
const _ref_8ixasm = { getAngularVelocity };
const _ref_7b8hnj = { serializeAST };
const _ref_oly2jd = { writeFile };
const _ref_jdlgig = { vertexAttrib3f };
const _ref_7g5yed = { checkBalance };
const _ref_dye74y = { openFile };
const _ref_s28u0m = { deriveAddress };
const _ref_ll20w5 = { spoofReferer };
const _ref_joifth = { seekFile };
const _ref_xtg35j = { checkUpdate };
const _ref_lsade4 = { optimizeTailCalls };
const _ref_ngfgaa = { setRelease };
const _ref_g72ok3 = { resolveHostName };
const _ref_uiq6un = { rotateUserAgent };
const _ref_06z6qd = { scaleMatrix };
const _ref_v71t75 = { repairCorruptFile };
const _ref_h18jbc = { encryptPayload };
const _ref_w57akd = { signTransaction };
const _ref_5cmgws = { createIndex };
const _ref_o8d78z = { setDopplerFactor };
const _ref_5i87w3 = { prettifyCode };
const _ref_8cycg7 = { addRigidBody };
const _ref_a3x684 = { systemCall };
const _ref_hivk64 = { clearScreen };
const _ref_4vr2is = { setSocketTimeout };
const _ref_xhjnbg = { addWheel };
const _ref_6zia17 = { handshakePeer };
const _ref_h4ssbn = { captureFrame };
const _ref_s0keyo = { connectNodes };
const _ref_i6n9yr = { verifyAppSignature };
const _ref_1tt798 = { parseLogTopics };
const _ref_ep477c = { decompressGzip };
const _ref_d4i9bl = { createPhysicsWorld };
const _ref_881jcg = { createSymbolTable };
const _ref_3v194m = { parseTorrentFile };
const _ref_zr1sah = { cancelAnimationFrameLoop };
const _ref_smv1h6 = { rebootSystem };
const _ref_nj43yr = { analyzeControlFlow };
const _ref_rius3i = { ProtocolBufferHandler };
const _ref_o7qgzw = { renameFile };
const _ref_5g1wu0 = { getMACAddress };
const _ref_ij0h76 = { calculateCRC32 };
const _ref_ouollm = { interceptRequest };
const _ref_wbr3np = { connectionPooling };
const _ref_1844k1 = { bindTexture };
const _ref_kux6xs = { loadModelWeights };
const _ref_l7p3bp = { registerSystemTray };
const _ref_3xnnhf = { setPan };
const _ref_v553v8 = { reportError };
const _ref_0fjb9i = { verifyMagnetLink };
const _ref_m0wpvb = { clearBrowserCache };
const _ref_iena15 = { createAudioContext };
const _ref_shy7fd = { parseM3U8Playlist };
const _ref_b6ngru = { mockResponse };
const _ref_d2u6t1 = { createStereoPanner };
const _ref_dpm5tl = { gaussianBlur };
const _ref_ljfxm6 = { wakeUp };
const _ref_luqo2u = { decryptHLSStream };
const _ref_bhkwt3 = { applyImpulse };
const _ref_dnjoic = { updateRoutingTable };
const _ref_23ptzr = { calculateLighting };
const _ref_nr392c = { prioritizeTraffic };
const _ref_i5f1y7 = { createProcess };
const _ref_qdyihu = { bufferMediaStream };
const _ref_qbcd9d = { createConvolver };
const _ref_180e4z = { chmodFile };
const _ref_zxgkjp = { rotateMatrix };
const _ref_bb80kv = { rayCast };
const _ref_cx9sw5 = { adjustPlaybackSpeed };
const _ref_djnwbd = { setKnee };
const _ref_mg1u2u = { hydrateSSR };
const _ref_d5g069 = { postProcessBloom };
const _ref_hsdx7v = { AdvancedCipher };
const _ref_ljld93 = { linkModules };
const _ref_mzvgdo = { protectMemory };
const _ref_dkjqlf = { migrateSchema };
const _ref_j9q23d = { validateIPWhitelist };
const _ref_aaayer = { convexSweepTest };
const _ref_hcq4bp = { chokePeer };
const _ref_ur5cxl = { validateFormInput };
const _ref_tszmpi = { removeRigidBody };
const _ref_ouhv97 = { cacheQueryResults };
const _ref_stwq9z = { TelemetryClient };
const _ref_5a60n3 = { discoverPeersDHT };
const _ref_yeqs4n = { syncAudioVideo };
const _ref_hj3yna = { checkBatteryLevel };
const _ref_t4b8sx = { getSystemUptime };
const _ref_sithmi = { transformAesKey };
const _ref_0vpocx = { addSliderConstraint };
const _ref_lc7m6r = { broadcastTransaction };
const _ref_8cb3i3 = { applyFog };
const _ref_vzxh9q = { compactDatabase };
const _ref_8trth6 = { download };
const _ref_9dlsm1 = { statFile };
const _ref_en8evz = { sendPacket };
const _ref_pc05mk = { getByteFrequencyData };
const _ref_z7r2c7 = { captureScreenshot };
const _ref_ins0wz = { scheduleBandwidth };
const _ref_7dzz9y = { debugAST };
const _ref_bt1h2l = { limitUploadSpeed };
const _ref_oyu3tl = { resolveCollision };
const _ref_y4zcun = { createListener };
const _ref_hvjoc5 = { createDirectoryRecursive };
const _ref_m8n3ja = { decodeAudioData };
const _ref_8m2m7p = { initWebGLContext };
const _ref_cuwr1i = { subscribeToEvents }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `blerp` };
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
                const urlParams = { config, url: window.location.href, name_en: `blerp` };

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
        const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const spoofReferer = () => "https://google.com";

const restartApplication = () => console.log("Restarting...");

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const beginTransaction = () => "TX-" + Date.now();

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const disablePEX = () => false;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const enableDHT = () => true;

const detectDevTools = () => false;

const cacheQueryResults = (key, data) => true;

const addConeTwistConstraint = (world, c) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const calculateGasFee = (limit) => limit * 20;

const getByteFrequencyData = (analyser, array) => true;

const detectVideoCodec = () => "h264";

const claimRewards = (pool) => "0.5 ETH";

const mutexUnlock = (mtx) => true;

const hoistVariables = (ast) => ast;

const verifyProofOfWork = (nonce) => true;

const triggerHapticFeedback = (intensity) => true;

const resolveSymbols = (ast) => ({});

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const connectSocket = (sock, addr, port) => true;

const disableRightClick = () => true;

const closeSocket = (sock) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const findLoops = (cfg) => [];

const checkIntegrityToken = (token) => true;

const hashKeccak256 = (data) => "0xabc...";

const retransmitPacket = (seq) => true;

const createSymbolTable = () => ({ scopes: [] });

const subscribeToEvents = (contract) => true;

const encodeABI = (method, params) => "0x...";

const pingHost = (host) => 10;

const fingerprintBrowser = () => "fp_hash_123";

const mangleNames = (ast) => ast;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const computeDominators = (cfg) => ({});

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const jitCompile = (bc) => (() => {});

const listenSocket = (sock, backlog) => true;

const compileToBytecode = (ast) => new Uint8Array();

const updateRoutingTable = (entry) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const suspendContext = (ctx) => Promise.resolve();

const muteStream = () => true;


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

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const calculateCRC32 = (data) => "00000000";

const generateSourceMap = (ast) => "{}";

const decodeAudioData = (buffer) => Promise.resolve({});

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const checkRootAccess = () => false;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const setOrientation = (panner, x, y, z) => true;

const dropTable = (table) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const getShaderInfoLog = (shader) => "";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const parseLogTopics = (topics) => ["Transfer"];

const compileVertexShader = (source) => ({ compiled: true });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const logErrorToFile = (err) => console.error(err);

const setRelease = (node, val) => node.release.value = val;

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

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const cleanOldLogs = (days) => days;

const setGainValue = (node, val) => node.gain.value = val;

const resampleAudio = (buffer, rate) => buffer;

const calculateMetric = (route) => 1;

const validatePieceChecksum = (piece) => true;

const restoreDatabase = (path) => true;

const verifySignature = (tx, sig) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const createListener = (ctx) => ({});

const injectMetadata = (file, meta) => ({ file, meta });

const rollbackTransaction = (tx) => true;

const obfuscateString = (str) => btoa(str);

const broadcastTransaction = (tx) => "tx_hash_123";

const interpretBytecode = (bc) => true;

const sanitizeXSS = (html) => html;

const checkUpdate = () => ({ hasUpdate: false });

const rmdir = (path) => true;

const contextSwitch = (oldPid, newPid) => true;

const filterTraffic = (rule) => true;

const calculateComplexity = (ast) => 1;

const normalizeVolume = (buffer) => buffer;

const startOscillator = (osc, time) => true;

const bindAddress = (sock, addr, port) => true;

const monitorClipboard = () => "";

const vertexAttrib3f = (idx, x, y, z) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const decapsulateFrame = (frame) => frame;

const checkIntegrityConstraint = (table) => true;

const prioritizeTraffic = (queue) => true;

const cullFace = (mode) => true;

const execProcess = (path) => true;

const invalidateCache = (key) => true;

const applyForce = (body, force, point) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const createProcess = (img) => ({ pid: 100 });

const preventCSRF = () => "csrf_token";

const addWheel = (vehicle, info) => true;

const visitNode = (node) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const stakeAssets = (pool, amount) => true;

const validateRecaptcha = (token) => true;

const generateDocumentation = (ast) => "";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createThread = (func) => ({ tid: 1 });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const processAudioBuffer = (buffer) => buffer;

const joinThread = (tid) => true;

const merkelizeRoot = (txs) => "root_hash";

const getBlockHeight = () => 15000000;

const sendPacket = (sock, data) => data.length;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const dhcpAck = () => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const lockRow = (id) => true;

const disconnectNodes = (node) => true;

const mockResponse = (body) => ({ status: 200, body });

const inlineFunctions = (ast) => ast;

const activeTexture = (unit) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const createTCPSocket = () => ({ fd: 1 });

const bufferMediaStream = (size) => ({ buffer: size });

const protectMemory = (ptr, size, flags) => true;

const detectDebugger = () => false;

const semaphoreSignal = (sem) => true;

const renderCanvasLayer = (ctx) => true;

const mapMemory = (fd, size) => 0x2000;

const interestPeer = (peer) => ({ ...peer, interested: true });

const killProcess = (pid) => true;

const setVolumeLevel = (vol) => vol;

const freeMemory = (ptr) => true;

const deleteProgram = (program) => true;

const upInterface = (iface) => true;

const analyzeBitrate = () => "5000kbps";

const createIndexBuffer = (data) => ({ id: Math.random() });

const flushSocketBuffer = (sock) => sock.buffer = [];

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const deserializeAST = (json) => JSON.parse(json);

const measureRTT = (sent, recv) => 10;

const signTransaction = (tx, key) => "signed_tx_hash";

const uniform3f = (loc, x, y, z) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const writePipe = (fd, data) => data.length;

const addPoint2PointConstraint = (world, c) => true;

const unlockRow = (id) => true;

const registerGestureHandler = (gesture) => true;

const stepSimulation = (world, dt) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const backupDatabase = (path) => ({ path, size: 5000 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const getExtension = (name) => ({});

const setKnee = (node, val) => node.knee.value = val;

const allocateRegisters = (ir) => ir;

const switchVLAN = (id) => true;

const checkBalance = (addr) => "10.5 ETH";

const setBrake = (vehicle, force, wheelIdx) => true;

const minifyCode = (code) => code;

const validateProgram = (program) => true;

const createMediaElementSource = (ctx, el) => ({});

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const deobfuscateString = (str) => atob(str);

const createConvolver = (ctx) => ({ buffer: null });

const deleteTexture = (texture) => true;

const checkTypes = (ast) => [];

const setViewport = (x, y, w, h) => true;

const closeContext = (ctx) => Promise.resolve();

const rateLimitCheck = (ip) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;


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

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const encryptPeerTraffic = (data) => btoa(data);

const loadImpulseResponse = (url) => Promise.resolve({});

const detectVirtualMachine = () => false;


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

const leaveGroup = (group) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const unlinkFile = (path) => true;

const setAttack = (node, val) => node.attack.value = val;

const unmapMemory = (ptr, size) => true;

const installUpdate = () => false;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const connectNodes = (src, dest) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const replicateData = (node) => ({ target: node, synced: true });

// Anti-shake references
const _ref_3qmadm = { limitDownloadSpeed };
const _ref_kbzx8l = { spoofReferer };
const _ref_sskvnj = { restartApplication };
const _ref_l0m4x7 = { parseConfigFile };
const _ref_5nkf1q = { beginTransaction };
const _ref_06r17q = { loadTexture };
const _ref_41hmia = { compressDataStream };
const _ref_nyr9gk = { disablePEX };
const _ref_wr2gy9 = { validateMnemonic };
const _ref_mozisg = { checkIntegrity };
const _ref_k6sb4a = { sanitizeSQLInput };
const _ref_y7opd3 = { enableDHT };
const _ref_95xbic = { detectDevTools };
const _ref_rvdfjs = { cacheQueryResults };
const _ref_bw2avm = { addConeTwistConstraint };
const _ref_yyg0l5 = { createAudioContext };
const _ref_jd9wnm = { archiveFiles };
const _ref_7clyub = { calculateGasFee };
const _ref_lv4je7 = { getByteFrequencyData };
const _ref_nisfze = { detectVideoCodec };
const _ref_lc2vgh = { claimRewards };
const _ref_w8h8ve = { mutexUnlock };
const _ref_7zxtjp = { hoistVariables };
const _ref_jcrvre = { verifyProofOfWork };
const _ref_z0r04p = { triggerHapticFeedback };
const _ref_anx0tu = { resolveSymbols };
const _ref_dttgmz = { optimizeConnectionPool };
const _ref_bfayb5 = { connectSocket };
const _ref_7indmc = { disableRightClick };
const _ref_r7frsu = { closeSocket };
const _ref_szvn42 = { decodeABI };
const _ref_aw7zkn = { optimizeMemoryUsage };
const _ref_07ljt4 = { formatLogMessage };
const _ref_usyhpp = { watchFileChanges };
const _ref_itm55w = { findLoops };
const _ref_rp6oxo = { checkIntegrityToken };
const _ref_84jobg = { hashKeccak256 };
const _ref_cbrp7b = { retransmitPacket };
const _ref_5j7x29 = { createSymbolTable };
const _ref_hk8y6n = { subscribeToEvents };
const _ref_up6rsb = { encodeABI };
const _ref_oranne = { pingHost };
const _ref_qst0g7 = { fingerprintBrowser };
const _ref_1piu4r = { mangleNames };
const _ref_2i72kj = { refreshAuthToken };
const _ref_9xelau = { computeDominators };
const _ref_c38hec = { getSystemUptime };
const _ref_q2lzbr = { jitCompile };
const _ref_gsbson = { listenSocket };
const _ref_9hrka1 = { compileToBytecode };
const _ref_jshit0 = { updateRoutingTable };
const _ref_4q9egm = { receivePacket };
const _ref_p35fzi = { suspendContext };
const _ref_heirl2 = { muteStream };
const _ref_1qhuwn = { ApiDataFormatter };
const _ref_5rzg39 = { monitorNetworkInterface };
const _ref_wjxmef = { calculateCRC32 };
const _ref_7716u0 = { generateSourceMap };
const _ref_0iovaf = { decodeAudioData };
const _ref_bf6fb2 = { requestPiece };
const _ref_pyg339 = { checkRootAccess };
const _ref_91zon5 = { resolveDNSOverHTTPS };
const _ref_urzesq = { setOrientation };
const _ref_jvtcqv = { dropTable };
const _ref_7lmyjx = { scheduleBandwidth };
const _ref_0h5cgj = { getShaderInfoLog };
const _ref_qpftgx = { detectEnvironment };
const _ref_kxltlm = { parseLogTopics };
const _ref_0lgb6z = { compileVertexShader };
const _ref_06377p = { syncAudioVideo };
const _ref_86ahmf = { logErrorToFile };
const _ref_bynbz5 = { setRelease };
const _ref_9bo9we = { download };
const _ref_kaimiu = { createPanner };
const _ref_shdygg = { cleanOldLogs };
const _ref_u1ml5o = { setGainValue };
const _ref_9vvqo7 = { resampleAudio };
const _ref_2vfew1 = { calculateMetric };
const _ref_tqm5g7 = { validatePieceChecksum };
const _ref_cxtzn4 = { restoreDatabase };
const _ref_hhymmf = { verifySignature };
const _ref_viv97w = { analyzeQueryPlan };
const _ref_s5waph = { createListener };
const _ref_im4mvp = { injectMetadata };
const _ref_bim82x = { rollbackTransaction };
const _ref_w7tnzh = { obfuscateString };
const _ref_s8u5my = { broadcastTransaction };
const _ref_damzq9 = { interpretBytecode };
const _ref_23q9ey = { sanitizeXSS };
const _ref_6bzaqr = { checkUpdate };
const _ref_ma95mj = { rmdir };
const _ref_aeitg2 = { contextSwitch };
const _ref_pb5t5d = { filterTraffic };
const _ref_ou5998 = { calculateComplexity };
const _ref_gs9gyj = { normalizeVolume };
const _ref_zx9pni = { startOscillator };
const _ref_znxn97 = { bindAddress };
const _ref_43t832 = { monitorClipboard };
const _ref_h19uk4 = { vertexAttrib3f };
const _ref_vb125n = { throttleRequests };
const _ref_d3wbdr = { decapsulateFrame };
const _ref_qspxen = { checkIntegrityConstraint };
const _ref_vj6nj8 = { prioritizeTraffic };
const _ref_88nmb4 = { cullFace };
const _ref_qcn2xj = { execProcess };
const _ref_4e451m = { invalidateCache };
const _ref_23l0ez = { applyForce };
const _ref_eb5opm = { discoverPeersDHT };
const _ref_1o90jm = { createProcess };
const _ref_budiw2 = { preventCSRF };
const _ref_2r9n5u = { addWheel };
const _ref_wbdlva = { visitNode };
const _ref_u3j21t = { splitFile };
const _ref_dgdewm = { stakeAssets };
const _ref_zbgq84 = { validateRecaptcha };
const _ref_uiqwd8 = { generateDocumentation };
const _ref_7vt4gz = { executeSQLQuery };
const _ref_ci2yfy = { createThread };
const _ref_1ul0ta = { connectionPooling };
const _ref_tff02z = { processAudioBuffer };
const _ref_ouyv33 = { joinThread };
const _ref_txfu9l = { merkelizeRoot };
const _ref_gbnum5 = { getBlockHeight };
const _ref_j1wtnb = { sendPacket };
const _ref_t6k8a7 = { setSteeringValue };
const _ref_dcs1dv = { dhcpAck };
const _ref_upx2t7 = { animateTransition };
const _ref_reb9kr = { lockRow };
const _ref_uglnu9 = { disconnectNodes };
const _ref_f3hipw = { mockResponse };
const _ref_w47ojd = { inlineFunctions };
const _ref_uqngho = { activeTexture };
const _ref_bd27tm = { announceToTracker };
const _ref_acwz96 = { createTCPSocket };
const _ref_ds9fwa = { bufferMediaStream };
const _ref_crn5yn = { protectMemory };
const _ref_edn6bt = { detectDebugger };
const _ref_jps5uh = { semaphoreSignal };
const _ref_s8il3i = { renderCanvasLayer };
const _ref_pao5jo = { mapMemory };
const _ref_dnpl61 = { interestPeer };
const _ref_8l9a1d = { killProcess };
const _ref_sgiuw5 = { setVolumeLevel };
const _ref_kqj6b0 = { freeMemory };
const _ref_9pd6as = { deleteProgram };
const _ref_fx21s8 = { upInterface };
const _ref_q3ftbd = { analyzeBitrate };
const _ref_g26jhn = { createIndexBuffer };
const _ref_f9sidk = { flushSocketBuffer };
const _ref_jreslq = { generateWalletKeys };
const _ref_qhy5op = { validateSSLCert };
const _ref_dorp5p = { deserializeAST };
const _ref_qgs7zj = { measureRTT };
const _ref_ce5zh7 = { signTransaction };
const _ref_93vx0c = { uniform3f };
const _ref_3l0tea = { playSoundAlert };
const _ref_cudyhj = { writePipe };
const _ref_5jfkzu = { addPoint2PointConstraint };
const _ref_kocqtw = { unlockRow };
const _ref_5af7uy = { registerGestureHandler };
const _ref_93x2px = { stepSimulation };
const _ref_mspcsw = { setSocketTimeout };
const _ref_z7y4tc = { backupDatabase };
const _ref_zizuh1 = { compactDatabase };
const _ref_3gbzkb = { getExtension };
const _ref_tn9ub1 = { setKnee };
const _ref_tu58by = { allocateRegisters };
const _ref_m5ok46 = { switchVLAN };
const _ref_mwupw8 = { checkBalance };
const _ref_w2wkq8 = { setBrake };
const _ref_ou3w4v = { minifyCode };
const _ref_xzjj0k = { validateProgram };
const _ref_hrvokw = { createMediaElementSource };
const _ref_xm9ajl = { calculateLayoutMetrics };
const _ref_2fd67e = { deobfuscateString };
const _ref_64cu9o = { createConvolver };
const _ref_5t02bh = { deleteTexture };
const _ref_mamuk0 = { checkTypes };
const _ref_4rh3ke = { setViewport };
const _ref_pqtsdj = { closeContext };
const _ref_wh9k1a = { rateLimitCheck };
const _ref_hxwhkj = { createMagnetURI };
const _ref_auai2e = { FileValidator };
const _ref_03lkwf = { autoResumeTask };
const _ref_axr3rd = { decryptHLSStream };
const _ref_19nqsm = { encryptPeerTraffic };
const _ref_dk8sib = { loadImpulseResponse };
const _ref_iy2qzx = { detectVirtualMachine };
const _ref_yjc78l = { ResourceMonitor };
const _ref_ykmney = { leaveGroup };
const _ref_6d5glc = { keepAlivePing };
const _ref_rciapd = { unlinkFile };
const _ref_1vejbd = { setAttack };
const _ref_x4w6xf = { unmapMemory };
const _ref_cnan2f = { installUpdate };
const _ref_mwl0qb = { uploadCrashReport };
const _ref_w5p5gr = { migrateSchema };
const _ref_yf6x3o = { connectNodes };
const _ref_0szds5 = { createPeriodicWave };
const _ref_7hercv = { replicateData }; 
    });
})({}, {});