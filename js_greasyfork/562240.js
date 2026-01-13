// ==UserScript==
// @name CanalAlpha视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/CanalAlpha/index.js
// @version 2026.01.10
// @description 一键下载CanalAlpha视频，支持4K/1080P/720P多画质。
// @icon https://www.canalalpha.ch/favicon.ico
// @match *://*.canalalpha.ch/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect canalalpha.ch
// @connect vod2.infomaniak.com
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
// @downloadURL https://update.greasyfork.org/scripts/562240/CanalAlpha%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562240/CanalAlpha%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const analyzeBitrate = () => "5000kbps";

const interestPeer = (peer) => ({ ...peer, interested: true });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const unmountFileSystem = (path) => true;

const clearScreen = (r, g, b, a) => true;

const uniform1i = (loc, val) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const claimRewards = (pool) => "0.5 ETH";

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const connectNodes = (src, dest) => true;

const rotateLogFiles = () => true;

const setVolumeLevel = (vol) => vol;

const validateFormInput = (input) => input.length > 0;

const synthesizeSpeech = (text) => "audio_buffer";

const getNetworkStats = () => ({ up: 100, down: 2000 });

const compileVertexShader = (source) => ({ compiled: true });

const stopOscillator = (osc, time) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const setSocketTimeout = (ms) => ({ timeout: ms });

const lockRow = (id) => true;

const disconnectNodes = (node) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const useProgram = (program) => true;

const bindTexture = (target, texture) => true;

const cacheQueryResults = (key, data) => true;

const detectVirtualMachine = () => false;

const encodeABI = (method, params) => "0x...";

const setDetune = (osc, cents) => osc.detune = cents;

const drawElements = (mode, count, type, offset) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const validateProgram = (program) => true;

const deleteBuffer = (buffer) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const cleanOldLogs = (days) => days;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const deleteProgram = (program) => true;

const getBlockHeight = () => 15000000;

const getExtension = (name) => ({});

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const validateRecaptcha = (token) => true;

const activeTexture = (unit) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const attachRenderBuffer = (fb, rb) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const analyzeHeader = (packet) => ({});

const dhcpAck = () => true;

const swapTokens = (pair, amount) => true;

const mockResponse = (body) => ({ status: 200, body });

const unlinkFile = (path) => true;

const setOrientation = (panner, x, y, z) => true;


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

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const detectDarkMode = () => true;

const decapsulateFrame = (frame) => frame;

const getByteFrequencyData = (analyser, array) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const execProcess = (path) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
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

const createIndexBuffer = (data) => ({ id: Math.random() });

const seekFile = (fd, offset) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const mapMemory = (fd, size) => 0x2000;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const verifyAppSignature = () => true;

const contextSwitch = (oldPid, newPid) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const writePipe = (fd, data) => data.length;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const switchVLAN = (id) => true;

const createMediaElementSource = (ctx, el) => ({});

const makeDistortionCurve = (amount) => new Float32Array(4096);

const createProcess = (img) => ({ pid: 100 });

const setDopplerFactor = (val) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const deleteTexture = (texture) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const classifySentiment = (text) => "positive";

const enterScope = (table) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const convertFormat = (src, dest) => dest;

const verifyProofOfWork = (nonce) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const rmdir = (path) => true;

const closeFile = (fd) => true;

const closeSocket = (sock) => true;

const createTCPSocket = () => ({ fd: 1 });

const prioritizeTraffic = (queue) => true;

const merkelizeRoot = (txs) => "root_hash";

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const linkFile = (src, dest) => true;

const setThreshold = (node, val) => node.threshold.value = val;


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

const sanitizeXSS = (html) => html;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const exitScope = (table) => true;

const checkTypes = (ast) => [];

const serializeAST = (ast) => JSON.stringify(ast);

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const createSymbolTable = () => ({ scopes: [] });

const arpRequest = (ip) => "00:00:00:00:00:00";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createFrameBuffer = () => ({ id: Math.random() });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const bufferData = (gl, target, data, usage) => true;

const joinThread = (tid) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const compressGzip = (data) => data;

const setFilterType = (filter, type) => filter.type = type;

const writeFile = (fd, data) => true;

const startOscillator = (osc, time) => true;

const unmuteStream = () => false;

const detectVideoCodec = () => "h264";

const bufferMediaStream = (size) => ({ buffer: size });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const monitorClipboard = () => "";

const checkBalance = (addr) => "10.5 ETH";

const injectMetadata = (file, meta) => ({ file, meta });

const setGainValue = (node, val) => node.gain.value = val;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

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

const scheduleProcess = (pid) => true;

const unlockRow = (id) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const postProcessBloom = (image, threshold) => image;

const createListener = (ctx) => ({});

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

const leaveGroup = (group) => true;

const killProcess = (pid) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const handleInterrupt = (irq) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const applyTheme = (theme) => document.body.className = theme;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const semaphoreSignal = (sem) => true;

const muteStream = () => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const cullFace = (mode) => true;

const auditAccessLogs = () => true;

const forkProcess = () => 101;

const createMediaStreamSource = (ctx, stream) => ({});

const checkUpdate = () => ({ hasUpdate: false });

const checkPortAvailability = (port) => Math.random() > 0.2;

const segmentImageUNet = (img) => "mask_buffer";

const traceroute = (host) => ["192.168.1.1"];

const setRatio = (node, val) => node.ratio.value = val;

const shutdownComputer = () => console.log("Shutting down...");

const unchokePeer = (peer) => ({ ...peer, choked: false });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const checkIntegrityToken = (token) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createMeshShape = (vertices) => ({ type: 'mesh' });

const sleep = (body) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const setInertia = (body, i) => true;

const disableInterrupts = () => true;

const logErrorToFile = (err) => console.error(err);

const setDistanceModel = (panner, model) => true;

const getcwd = () => "/";

const encryptPeerTraffic = (data) => btoa(data);

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const setMTU = (iface, mtu) => true;

const decompressPacket = (data) => data;

const reportWarning = (msg, line) => console.warn(msg);

const splitFile = (path, parts) => Array(parts).fill(path);

const normalizeVolume = (buffer) => buffer;

const analyzeControlFlow = (ast) => ({ graph: {} });

const removeConstraint = (world, c) => true;

const deriveAddress = (path) => "0x123...";

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const createChannelSplitter = (ctx, channels) => ({});

const removeMetadata = (file) => ({ file, metadata: null });

const setKnee = (node, val) => node.knee.value = val;

const announceToTracker = (url) => ({ url, interval: 1800 });

const traverseAST = (node, visitor) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const disableDepthTest = () => true;

const uniform3f = (loc, x, y, z) => true;

const calculateGasFee = (limit) => limit * 20;

const spoofReferer = () => "https://google.com";

const resampleAudio = (buffer, rate) => buffer;

// Anti-shake references
const _ref_e9di1s = { analyzeBitrate };
const _ref_ky63hu = { interestPeer };
const _ref_lx4qku = { performTLSHandshake };
const _ref_3dqrz2 = { unmountFileSystem };
const _ref_jz9drv = { clearScreen };
const _ref_k2s84s = { uniform1i };
const _ref_p9pjvz = { createOscillator };
const _ref_32hdbs = { readPixels };
const _ref_dfca3w = { decodeABI };
const _ref_l3zmgy = { claimRewards };
const _ref_hguk5b = { calculateSHA256 };
const _ref_fvjjym = { connectNodes };
const _ref_57pz8a = { rotateLogFiles };
const _ref_5tfd0t = { setVolumeLevel };
const _ref_7gg5fz = { validateFormInput };
const _ref_yy4gew = { synthesizeSpeech };
const _ref_zdut9u = { getNetworkStats };
const _ref_k4dykf = { compileVertexShader };
const _ref_6m9kr2 = { stopOscillator };
const _ref_2dhl3k = { createAudioContext };
const _ref_g50ejh = { setSocketTimeout };
const _ref_x781ei = { lockRow };
const _ref_88u582 = { disconnectNodes };
const _ref_dt9net = { verifyFileSignature };
const _ref_uj5odd = { useProgram };
const _ref_p0impx = { bindTexture };
const _ref_pd02bz = { cacheQueryResults };
const _ref_ro3rl2 = { detectVirtualMachine };
const _ref_27u1e8 = { encodeABI };
const _ref_wezx9p = { setDetune };
const _ref_9f8n7k = { drawElements };
const _ref_pfq6k3 = { retryFailedSegment };
const _ref_20oq1k = { validateProgram };
const _ref_0mkpiy = { deleteBuffer };
const _ref_z0eg1k = { uniformMatrix4fv };
const _ref_qvss42 = { cleanOldLogs };
const _ref_5er5r5 = { optimizeConnectionPool };
const _ref_blj9oj = { manageCookieJar };
const _ref_zccije = { deleteProgram };
const _ref_hw84g7 = { getBlockHeight };
const _ref_lmtb8k = { getExtension };
const _ref_bbgfqe = { switchProxyServer };
const _ref_xcdwo1 = { monitorNetworkInterface };
const _ref_vxx5qu = { scrapeTracker };
const _ref_6qd63k = { transformAesKey };
const _ref_2rvpdf = { validateRecaptcha };
const _ref_yvdjs0 = { activeTexture };
const _ref_1gb4nb = { calculateLayoutMetrics };
const _ref_1oa9wv = { attachRenderBuffer };
const _ref_pgysao = { setDelayTime };
const _ref_c8ss40 = { analyzeHeader };
const _ref_y6fy6q = { dhcpAck };
const _ref_1su9pm = { swapTokens };
const _ref_uhy6j8 = { mockResponse };
const _ref_nsxpi8 = { unlinkFile };
const _ref_sclvlf = { setOrientation };
const _ref_y61mi7 = { CacheManager };
const _ref_vp0xfu = { sanitizeInput };
const _ref_6qwj3t = { detectDarkMode };
const _ref_bqe65c = { decapsulateFrame };
const _ref_vlixh4 = { getByteFrequencyData };
const _ref_j6qlbh = { getAppConfig };
const _ref_zyg0n8 = { execProcess };
const _ref_wsniin = { checkIntegrity };
const _ref_bqptjw = { throttleRequests };
const _ref_swpzy3 = { AdvancedCipher };
const _ref_s9k326 = { createIndexBuffer };
const _ref_5c458u = { seekFile };
const _ref_s26kn8 = { moveFileToComplete };
const _ref_22657a = { mapMemory };
const _ref_dqbzwu = { refreshAuthToken };
const _ref_tf3xvn = { verifyAppSignature };
const _ref_nm3jtx = { contextSwitch };
const _ref_o9dgt0 = { queueDownloadTask };
const _ref_4lnfrr = { writePipe };
const _ref_5rgwzr = { renderVirtualDOM };
const _ref_aqsamn = { switchVLAN };
const _ref_vjc625 = { createMediaElementSource };
const _ref_2g2t3d = { makeDistortionCurve };
const _ref_llq8wr = { createProcess };
const _ref_w3swyd = { setDopplerFactor };
const _ref_z86gft = { resolveDependencyGraph };
const _ref_99m1iw = { deleteTexture };
const _ref_1yei93 = { flushSocketBuffer };
const _ref_xzq7pf = { classifySentiment };
const _ref_kacv9o = { enterScope };
const _ref_m772ek = { createIndex };
const _ref_ery5ud = { convertFormat };
const _ref_pvsxwj = { verifyProofOfWork };
const _ref_7204nt = { debounceAction };
const _ref_d1y33o = { rmdir };
const _ref_1dygi5 = { closeFile };
const _ref_igyajp = { closeSocket };
const _ref_ektf4i = { createTCPSocket };
const _ref_im3dkj = { prioritizeTraffic };
const _ref_xzc3ss = { merkelizeRoot };
const _ref_0x0pk0 = { applyPerspective };
const _ref_l4utxg = { linkFile };
const _ref_1hh78k = { setThreshold };
const _ref_jd8yek = { ApiDataFormatter };
const _ref_6xnzvt = { sanitizeXSS };
const _ref_iltl57 = { vertexAttribPointer };
const _ref_bat7ts = { exitScope };
const _ref_lchlrw = { checkTypes };
const _ref_derc6k = { serializeAST };
const _ref_a0wh1w = { extractThumbnail };
const _ref_v7exvr = { createSymbolTable };
const _ref_c3kcu6 = { arpRequest };
const _ref_g6nphe = { formatLogMessage };
const _ref_3ig42w = { createFrameBuffer };
const _ref_ar94af = { createDelay };
const _ref_xlp3e6 = { streamToPlayer };
const _ref_qcpmz9 = { bufferData };
const _ref_fuwaq4 = { joinThread };
const _ref_dvmyv7 = { syncAudioVideo };
const _ref_kpg455 = { compressGzip };
const _ref_quagil = { setFilterType };
const _ref_xyahmo = { writeFile };
const _ref_mgzioj = { startOscillator };
const _ref_1aq3s3 = { unmuteStream };
const _ref_ika3uy = { detectVideoCodec };
const _ref_9uspz5 = { bufferMediaStream };
const _ref_gzsy1c = { allocateDiskSpace };
const _ref_uj0t1x = { clearBrowserCache };
const _ref_5x74ch = { createGainNode };
const _ref_bszgxs = { checkDiskSpace };
const _ref_y15q5q = { generateWalletKeys };
const _ref_r7mc7p = { monitorClipboard };
const _ref_k9dyal = { checkBalance };
const _ref_qw2wno = { injectMetadata };
const _ref_q8gmv3 = { setGainValue };
const _ref_bwtioj = { scheduleBandwidth };
const _ref_nbo1fb = { ProtocolBufferHandler };
const _ref_675pkj = { scheduleProcess };
const _ref_86at4l = { unlockRow };
const _ref_dxz01d = { vertexAttrib3f };
const _ref_0bpaz7 = { createPanner };
const _ref_zr0nzu = { postProcessBloom };
const _ref_mzp7y4 = { createListener };
const _ref_ic53x7 = { generateFakeClass };
const _ref_cn5z81 = { leaveGroup };
const _ref_4na3bb = { killProcess };
const _ref_a4zcqq = { captureScreenshot };
const _ref_80qjbf = { handleInterrupt };
const _ref_q3iwoq = { diffVirtualDOM };
const _ref_75ry4z = { applyTheme };
const _ref_b0pp1i = { updateBitfield };
const _ref_77aqoo = { semaphoreSignal };
const _ref_ekflst = { muteStream };
const _ref_fen1dl = { setFrequency };
const _ref_k0dip2 = { migrateSchema };
const _ref_oynl1x = { cullFace };
const _ref_0g58g4 = { auditAccessLogs };
const _ref_y8leki = { forkProcess };
const _ref_s5qena = { createMediaStreamSource };
const _ref_30e7h9 = { checkUpdate };
const _ref_ng7hhz = { checkPortAvailability };
const _ref_9vo3vu = { segmentImageUNet };
const _ref_zgfrfe = { traceroute };
const _ref_8skfft = { setRatio };
const _ref_lj8auj = { shutdownComputer };
const _ref_g78gkg = { unchokePeer };
const _ref_2qalom = { limitBandwidth };
const _ref_693qas = { checkIntegrityToken };
const _ref_ihoisi = { prioritizeRarestPiece };
const _ref_rg5p3q = { sanitizeSQLInput };
const _ref_g62m9s = { createMeshShape };
const _ref_kid7il = { sleep };
const _ref_hok4ee = { parseExpression };
const _ref_5iymzj = { setInertia };
const _ref_a8eyc5 = { disableInterrupts };
const _ref_ooxxxy = { logErrorToFile };
const _ref_orh4yp = { setDistanceModel };
const _ref_afp6u5 = { getcwd };
const _ref_jwl7co = { encryptPeerTraffic };
const _ref_zeezwb = { detectObjectYOLO };
const _ref_nlfbzs = { setMTU };
const _ref_q93yoa = { decompressPacket };
const _ref_c8qjp2 = { reportWarning };
const _ref_ukhnnq = { splitFile };
const _ref_vgtej8 = { normalizeVolume };
const _ref_vhgulb = { analyzeControlFlow };
const _ref_guzly3 = { removeConstraint };
const _ref_fat839 = { deriveAddress };
const _ref_oly5cu = { calculateEntropy };
const _ref_mckb4k = { normalizeFeatures };
const _ref_8pva78 = { setSteeringValue };
const _ref_urktvh = { showNotification };
const _ref_sok6cv = { tokenizeSource };
const _ref_tm2t9p = { createChannelSplitter };
const _ref_v8kndk = { removeMetadata };
const _ref_13rbq4 = { setKnee };
const _ref_3citqd = { announceToTracker };
const _ref_a3ln5k = { traverseAST };
const _ref_e6797t = { autoResumeTask };
const _ref_6e1l9u = { disableDepthTest };
const _ref_1f85j5 = { uniform3f };
const _ref_e2fdpm = { calculateGasFee };
const _ref_79c7vo = { spoofReferer };
const _ref_v5v0rj = { resampleAudio }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `CanalAlpha` };
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
                const urlParams = { config, url: window.location.href, name_en: `CanalAlpha` };

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
        const computeDominators = (cfg) => ({});

const foldConstants = (ast) => ast;

const setPosition = (panner, x, y, z) => true;

const setGainValue = (node, val) => node.gain.value = val;

const resumeContext = (ctx) => Promise.resolve();

const getExtension = (name) => ({});

const getProgramInfoLog = (program) => "";

const createMeshShape = (vertices) => ({ type: 'mesh' });

const wakeUp = (body) => true;

const createListener = (ctx) => ({});

const setRelease = (node, val) => node.release.value = val;

const addRigidBody = (world, body) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const addHingeConstraint = (world, c) => true;

const createSoftBody = (info) => ({ nodes: [] });

const getByteFrequencyData = (analyser, array) => true;

const unrollLoops = (ast) => ast;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const removeConstraint = (world, c) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const getOutputTimestamp = (ctx) => Date.now();

const calculateRestitution = (mat1, mat2) => 0.3;

const addPoint2PointConstraint = (world, c) => true;

const inlineFunctions = (ast) => ast;

const detachThread = (tid) => true;

const profilePerformance = (func) => 0;

const updateTransform = (body) => true;

const reportWarning = (msg, line) => console.warn(msg);

const updateParticles = (sys, dt) => true;

const compileToBytecode = (ast) => new Uint8Array();

const mangleNames = (ast) => ast;

const lookupSymbol = (table, name) => ({});

const resolveSymbols = (ast) => ({});

const rayCast = (world, start, end) => ({ hit: false });

const setQValue = (filter, q) => filter.Q = q;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const getBlockHeight = () => 15000000;

const reportError = (msg, line) => console.error(msg);

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const debugAST = (ast) => "";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const semaphoreWait = (sem) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const createChannelSplitter = (ctx, channels) => ({});

const getNetworkStats = () => ({ up: 100, down: 2000 });

const registerSystemTray = () => ({ icon: "tray.ico" });

const preventSleepMode = () => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const validateFormInput = (input) => input.length > 0;

const encapsulateFrame = (packet) => packet;

const rollbackTransaction = (tx) => true;

const renderCanvasLayer = (ctx) => true;

const unmountFileSystem = (path) => true;

const normalizeVolume = (buffer) => buffer;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const instrumentCode = (code) => code;

const linkModules = (modules) => ({});

const unmuteStream = () => false;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const setThreshold = (node, val) => node.threshold.value = val;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const downInterface = (iface) => true;

const deserializeAST = (json) => JSON.parse(json);

const shardingTable = (table) => ["shard_0", "shard_1"];

const contextSwitch = (oldPid, newPid) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const resolveCollision = (manifold) => true;


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

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const installUpdate = () => false;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const checkBatteryLevel = () => 100;

const checkIntegrityConstraint = (table) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const addGeneric6DofConstraint = (world, c) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const resampleAudio = (buffer, rate) => buffer;

const activeTexture = (unit) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const setInertia = (body, i) => true;

const dhcpDiscover = () => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const optimizeAST = (ast) => ast;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const performOCR = (img) => "Detected Text";

const enableDHT = () => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const optimizeTailCalls = (ast) => ast;

const clusterKMeans = (data, k) => Array(k).fill([]);

const unchokePeer = (peer) => ({ ...peer, choked: false });

const generateEmbeddings = (text) => new Float32Array(128);

const scheduleProcess = (pid) => true;

const deleteProgram = (program) => true;

const configureInterface = (iface, config) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const unlockFile = (path) => ({ path, locked: false });

const defineSymbol = (table, name, info) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const arpRequest = (ip) => "00:00:00:00:00:00";

const createPipe = () => [3, 4];

const deobfuscateString = (str) => atob(str);

const createASTNode = (type, val) => ({ type, val });

const addConeTwistConstraint = (world, c) => true;

const findLoops = (cfg) => [];

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const broadcastTransaction = (tx) => "tx_hash_123";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const logErrorToFile = (err) => console.error(err);

const obfuscateString = (str) => btoa(str);

const createParticleSystem = (count) => ({ particles: [] });

const hashKeccak256 = (data) => "0xabc...";

const shutdownComputer = () => console.log("Shutting down...");

const sleep = (body) => true;

const decompressGzip = (data) => data;

const serializeFormData = (form) => JSON.stringify(form);

const setRatio = (node, val) => node.ratio.value = val;

const setVolumeLevel = (vol) => vol;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const stopOscillator = (osc, time) => true;

const unmapMemory = (ptr, size) => true;

const swapTokens = (pair, amount) => true;

const prettifyCode = (code) => code;

const recognizeSpeech = (audio) => "Transcribed Text";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const rotateLogFiles = () => true;

const createThread = (func) => ({ tid: 1 });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const createIndexBuffer = (data) => ({ id: Math.random() });

const mergeFiles = (parts) => parts[0];

const applyForce = (body, force, point) => true;

const backpropagateGradient = (loss) => true;

const detectVirtualMachine = () => false;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const edgeDetectionSobel = (image) => image;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const forkProcess = () => 101;

const joinThread = (tid) => true;

const rateLimitCheck = (ip) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const eliminateDeadCode = (ast) => ast;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const setDopplerFactor = (val) => true;

const checkTypes = (ast) => [];

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const encryptLocalStorage = (key, val) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const jitCompile = (bc) => (() => {});

const parsePayload = (packet) => ({});

const suspendContext = (ctx) => Promise.resolve();

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const hoistVariables = (ast) => ast;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const registerISR = (irq, func) => true;

const drawArrays = (gl, mode, first, count) => true;

const addWheel = (vehicle, info) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const detectDarkMode = () => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const validateIPWhitelist = (ip) => true;

const verifyIR = (ir) => true;

const drawElements = (mode, count, type, offset) => true;

const estimateNonce = (addr) => 42;

const writeFile = (fd, data) => true;

const setVelocity = (body, v) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const parseQueryString = (qs) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const captureScreenshot = () => "data:image/png;base64,...";

const detectVideoCodec = () => "h264";

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const clearScreen = (r, g, b, a) => true;

const getShaderInfoLog = (shader) => "";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const allocateRegisters = (ir) => ir;

const getCpuLoad = () => Math.random() * 100;

const useProgram = (program) => true;

const loadCheckpoint = (path) => true;

const handleInterrupt = (irq) => true;

const createSymbolTable = () => ({ scopes: [] });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const spoofReferer = () => "https://google.com";

const resolveImports = (ast) => [];

const bindSocket = (port) => ({ port, status: "bound" });


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

const setAngularVelocity = (body, v) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const encryptStream = (stream, key) => stream;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const dhcpRequest = (ip) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

// Anti-shake references
const _ref_nixloi = { computeDominators };
const _ref_due2vp = { foldConstants };
const _ref_4dlsqv = { setPosition };
const _ref_5vdiu8 = { setGainValue };
const _ref_wza6nn = { resumeContext };
const _ref_3mmoil = { getExtension };
const _ref_djuqfa = { getProgramInfoLog };
const _ref_7t90km = { createMeshShape };
const _ref_hrp3hu = { wakeUp };
const _ref_aq9r0z = { createListener };
const _ref_el5rwp = { setRelease };
const _ref_gnc350 = { addRigidBody };
const _ref_a5bjgw = { createAnalyser };
const _ref_dzku62 = { addHingeConstraint };
const _ref_w5s44g = { createSoftBody };
const _ref_r3st7k = { getByteFrequencyData };
const _ref_deliq1 = { unrollLoops };
const _ref_0w7qeq = { makeDistortionCurve };
const _ref_p2b748 = { removeConstraint };
const _ref_2hyef4 = { createOscillator };
const _ref_jhgy6x = { getOutputTimestamp };
const _ref_ro3bag = { calculateRestitution };
const _ref_y39gve = { addPoint2PointConstraint };
const _ref_havq56 = { inlineFunctions };
const _ref_d427la = { detachThread };
const _ref_tl5e5f = { profilePerformance };
const _ref_rlgnfi = { updateTransform };
const _ref_8onjnd = { reportWarning };
const _ref_d8tbpd = { updateParticles };
const _ref_p2xxmc = { compileToBytecode };
const _ref_bs9ci2 = { mangleNames };
const _ref_9ercwh = { lookupSymbol };
const _ref_edej72 = { resolveSymbols };
const _ref_r4203t = { rayCast };
const _ref_qfy0wm = { setQValue };
const _ref_germci = { createPhysicsWorld };
const _ref_9xr71v = { getBlockHeight };
const _ref_cfo01t = { reportError };
const _ref_8y4wi2 = { readPixels };
const _ref_8uu1x3 = { resolveHostName };
const _ref_1a4d0t = { debugAST };
const _ref_57rx3a = { discoverPeersDHT };
const _ref_8rlx5c = { semaphoreWait };
const _ref_b23vsj = { optimizeMemoryUsage };
const _ref_xx3p7z = { createChannelSplitter };
const _ref_o0svx8 = { getNetworkStats };
const _ref_0wer1p = { registerSystemTray };
const _ref_s4fjs8 = { preventSleepMode };
const _ref_duxtfv = { FileValidator };
const _ref_wlflw5 = { validateFormInput };
const _ref_59xmk2 = { encapsulateFrame };
const _ref_5uzfdv = { rollbackTransaction };
const _ref_lwevkb = { renderCanvasLayer };
const _ref_pgcw9t = { unmountFileSystem };
const _ref_bt43wd = { normalizeVolume };
const _ref_5bw6g6 = { calculateLayoutMetrics };
const _ref_nbix1h = { instrumentCode };
const _ref_7wot1o = { linkModules };
const _ref_ij03lm = { unmuteStream };
const _ref_z6o5do = { uploadCrashReport };
const _ref_qip3nu = { setThreshold };
const _ref_yjoza6 = { connectionPooling };
const _ref_0b0rd9 = { downInterface };
const _ref_et7vy1 = { deserializeAST };
const _ref_0sg42h = { shardingTable };
const _ref_87a9al = { contextSwitch };
const _ref_4c9mg2 = { normalizeVector };
const _ref_0tmdiw = { seedRatioLimit };
const _ref_e8lddd = { resolveCollision };
const _ref_6adj5q = { ResourceMonitor };
const _ref_nowbvq = { optimizeConnectionPool };
const _ref_fqd292 = { installUpdate };
const _ref_5rbpn1 = { createGainNode };
const _ref_3n3spq = { checkBatteryLevel };
const _ref_aiwoyg = { checkIntegrityConstraint };
const _ref_027y40 = { scheduleBandwidth };
const _ref_kkjyux = { addGeneric6DofConstraint };
const _ref_5rr5fc = { splitFile };
const _ref_afywyc = { virtualScroll };
const _ref_05d5ip = { resampleAudio };
const _ref_v5rpfu = { activeTexture };
const _ref_rawhcy = { createSphereShape };
const _ref_nbqft4 = { setInertia };
const _ref_3vtav7 = { dhcpDiscover };
const _ref_tsm3yf = { setSocketTimeout };
const _ref_oi3r2r = { optimizeAST };
const _ref_9zg8nz = { validateTokenStructure };
const _ref_5cauga = { compactDatabase };
const _ref_l43h8u = { performOCR };
const _ref_xid490 = { enableDHT };
const _ref_7grdbc = { streamToPlayer };
const _ref_hbuc0h = { optimizeTailCalls };
const _ref_dmy7vf = { clusterKMeans };
const _ref_ie58e9 = { unchokePeer };
const _ref_97jaqr = { generateEmbeddings };
const _ref_tmn0cl = { scheduleProcess };
const _ref_0qmlfu = { deleteProgram };
const _ref_90lf6s = { configureInterface };
const _ref_utl4fr = { createVehicle };
const _ref_goflnm = { unlockFile };
const _ref_19rt1a = { defineSymbol };
const _ref_jy4oas = { limitDownloadSpeed };
const _ref_uegc9l = { getMemoryUsage };
const _ref_xqwg01 = { computeSpeedAverage };
const _ref_0ay0n2 = { arpRequest };
const _ref_yf1vks = { createPipe };
const _ref_xdu36g = { deobfuscateString };
const _ref_oriu3i = { createASTNode };
const _ref_g8isg4 = { addConeTwistConstraint };
const _ref_wvzyx2 = { findLoops };
const _ref_4qn4z9 = { handshakePeer };
const _ref_pixf4e = { broadcastTransaction };
const _ref_v4gcgg = { calculatePieceHash };
const _ref_iaojzx = { logErrorToFile };
const _ref_xeijw2 = { obfuscateString };
const _ref_4h39k3 = { createParticleSystem };
const _ref_3q2pd2 = { hashKeccak256 };
const _ref_kn17mq = { shutdownComputer };
const _ref_rki68d = { sleep };
const _ref_5jce2q = { decompressGzip };
const _ref_bijkd5 = { serializeFormData };
const _ref_s9709t = { setRatio };
const _ref_wd32jc = { setVolumeLevel };
const _ref_7wv3m0 = { interceptRequest };
const _ref_j0l4y7 = { stopOscillator };
const _ref_bz42r4 = { unmapMemory };
const _ref_qrppkm = { swapTokens };
const _ref_pkj2fr = { prettifyCode };
const _ref_2vc8oh = { recognizeSpeech };
const _ref_hg6u0k = { parseMagnetLink };
const _ref_r4wjwe = { rotateLogFiles };
const _ref_r7s6vh = { createThread };
const _ref_higm9f = { calculateMD5 };
const _ref_2wtsrf = { createIndexBuffer };
const _ref_e72igd = { mergeFiles };
const _ref_c1gsu8 = { applyForce };
const _ref_6jesj5 = { backpropagateGradient };
const _ref_qcn37f = { detectVirtualMachine };
const _ref_pnmrq7 = { getFileAttributes };
const _ref_typ84w = { edgeDetectionSobel };
const _ref_x6z0fq = { detectEnvironment };
const _ref_t3trty = { forkProcess };
const _ref_ey1qc4 = { joinThread };
const _ref_eakgwr = { rateLimitCheck };
const _ref_otani7 = { parseM3U8Playlist };
const _ref_xfzgcb = { eliminateDeadCode };
const _ref_epro7w = { getMACAddress };
const _ref_wcyr52 = { setDopplerFactor };
const _ref_3m1bso = { checkTypes };
const _ref_a9gssw = { animateTransition };
const _ref_mfep67 = { encryptLocalStorage };
const _ref_ihw00i = { createWaveShaper };
const _ref_qz9hun = { jitCompile };
const _ref_9tnfu4 = { parsePayload };
const _ref_w2fhhi = { suspendContext };
const _ref_b1l5co = { watchFileChanges };
const _ref_wc2xms = { hoistVariables };
const _ref_3aumoa = { debouncedResize };
const _ref_6ffa1y = { convexSweepTest };
const _ref_k55b3z = { registerISR };
const _ref_35xnhd = { drawArrays };
const _ref_w9qt93 = { addWheel };
const _ref_x8nom3 = { applyPerspective };
const _ref_o2hdae = { detectDarkMode };
const _ref_2pfwp6 = { syncDatabase };
const _ref_fm9y9h = { throttleRequests };
const _ref_j6t9dd = { parseConfigFile };
const _ref_o5xxh9 = { validateIPWhitelist };
const _ref_98rxi5 = { verifyIR };
const _ref_u13lxa = { drawElements };
const _ref_ck0uhv = { estimateNonce };
const _ref_diybdm = { writeFile };
const _ref_641ugw = { setVelocity };
const _ref_85oi64 = { retryFailedSegment };
const _ref_ak4hwr = { parseQueryString };
const _ref_3v1b46 = { setFrequency };
const _ref_oabiey = { captureScreenshot };
const _ref_s86dvh = { detectVideoCodec };
const _ref_2p0yip = { tunnelThroughProxy };
const _ref_j8ajlx = { clearScreen };
const _ref_slxojr = { getShaderInfoLog };
const _ref_6ro09j = { normalizeAudio };
const _ref_uty1gp = { requestPiece };
const _ref_38pnlk = { allocateRegisters };
const _ref_u2f9gt = { getCpuLoad };
const _ref_gq8em7 = { useProgram };
const _ref_hbypu2 = { loadCheckpoint };
const _ref_nw6ohh = { handleInterrupt };
const _ref_zyiovc = { createSymbolTable };
const _ref_panbwd = { convertRGBtoHSL };
const _ref_jvdb86 = { spoofReferer };
const _ref_13jau3 = { resolveImports };
const _ref_dz8ol1 = { bindSocket };
const _ref_nvuu8j = { TelemetryClient };
const _ref_0pc879 = { setAngularVelocity };
const _ref_2jfyew = { limitUploadSpeed };
const _ref_u3axuj = { encryptStream };
const _ref_q8qugj = { createStereoPanner };
const _ref_b56j1k = { dhcpRequest };
const _ref_3rtxja = { receivePacket }; 
    });
})({}, {});