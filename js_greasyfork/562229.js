// ==UserScript==
// @name ArteSkyIt视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/arte_sky_it/index.js
// @version 2026.01.10
// @description 一键下载ArteSkylt视频，支持4K/1080P/720P多画质。
// @icon https://arte.sky.it/favicon.ico
// @match https://arte.sky.it/
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect sky.it
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
// @downloadURL https://update.greasyfork.org/scripts/562229/ArteSkyIt%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562229/ArteSkyIt%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const multicastMessage = (group, msg) => true;

const cullFace = (mode) => true;

const foldConstants = (ast) => ast;

const setFilterType = (filter, type) => filter.type = type;

const setViewport = (x, y, w, h) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const uniformMatrix4fv = (loc, transpose, val) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const compileVertexShader = (source) => ({ compiled: true });

const connectNodes = (src, dest) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const uniform3f = (loc, x, y, z) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setInertia = (body, i) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const createSoftBody = (info) => ({ nodes: [] });

const eliminateDeadCode = (ast) => ast;

const sleep = (body) => true;

const getVehicleSpeed = (vehicle) => 0;

const compileFragmentShader = (source) => ({ compiled: true });

const suspendContext = (ctx) => Promise.resolve();

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const normalizeVolume = (buffer) => buffer;

const setVelocity = (body, v) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const createAudioContext = () => ({ sampleRate: 44100 });

const loadImpulseResponse = (url) => Promise.resolve({});

const applyTorque = (body, torque) => true;

const startOscillator = (osc, time) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const createChannelMerger = (ctx, channels) => ({});

const setAttack = (node, val) => node.attack.value = val;

const stopOscillator = (osc, time) => true;

const closeContext = (ctx) => Promise.resolve();

const setMass = (body, m) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const attachRenderBuffer = (fb, rb) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const addHingeConstraint = (world, c) => true;

const closeSocket = (sock) => true;

const bindAddress = (sock, addr, port) => true;

const encryptStream = (stream, key) => stream;

const pingHost = (host) => 10;

const inlineFunctions = (ast) => ast;

const clearScreen = (r, g, b, a) => true;

const createMediaElementSource = (ctx, el) => ({});

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const measureRTT = (sent, recv) => 10;

const installUpdate = () => false;

const optimizeTailCalls = (ast) => ast;

const prefetchAssets = (urls) => urls.length;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const recognizeSpeech = (audio) => "Transcribed Text";

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const decryptStream = (stream, key) => stream;

const useProgram = (program) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const checkGLError = () => 0;

const exitScope = (table) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const setThreshold = (node, val) => node.threshold.value = val;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const prioritizeTraffic = (queue) => true;

const sendPacket = (sock, data) => data.length;

const lookupSymbol = (table, name) => ({});

const checkBatteryLevel = () => 100;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const verifyAppSignature = () => true;

const tokenizeText = (text) => text.split(" ");

const mangleNames = (ast) => ast;

const unmuteStream = () => false;

const defineSymbol = (table, name, info) => true;

const setPosition = (panner, x, y, z) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const deserializeAST = (json) => JSON.parse(json);

const sanitizeXSS = (html) => html;

const checkUpdate = () => ({ hasUpdate: false });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const reassemblePacket = (fragments) => fragments[0];

const beginTransaction = () => "TX-" + Date.now();

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const updateRoutingTable = (entry) => true;

const edgeDetectionSobel = (image) => image;

const resolveCollision = (manifold) => true;

const dumpSymbolTable = (table) => "";

const lockFile = (path) => ({ path, locked: true });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const getExtension = (name) => ({});


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const disconnectNodes = (node) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const broadcastMessage = (msg) => true;

const dhcpDiscover = () => true;

const controlCongestion = (sock) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const createTCPSocket = () => ({ fd: 1 });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const switchVLAN = (id) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const hashKeccak256 = (data) => "0xabc...";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const restoreDatabase = (path) => true;

const openFile = (path, flags) => 5;

const drawElements = (mode, count, type, offset) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const cacheQueryResults = (key, data) => true;

const configureInterface = (iface, config) => true;

const estimateNonce = (addr) => 42;

const invalidateCache = (key) => true;


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

const getOutputTimestamp = (ctx) => Date.now();

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const generateSourceMap = (ast) => "{}";

const checkPortAvailability = (port) => Math.random() > 0.2;

const flushSocketBuffer = (sock) => sock.buffer = [];

const inferType = (node) => 'any';

const setPan = (node, val) => node.pan.value = val;

const segmentImageUNet = (img) => "mask_buffer";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const readPipe = (fd, len) => new Uint8Array(len);

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const addPoint2PointConstraint = (world, c) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const semaphoreWait = (sem) => true;

const deobfuscateString = (str) => atob(str);

const establishHandshake = (sock) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const rotateLogFiles = () => true;

const leaveGroup = (group) => true;

const verifySignature = (tx, sig) => true;

const commitTransaction = (tx) => true;

const joinThread = (tid) => true;

const setQValue = (filter, q) => filter.Q = q;

const signTransaction = (tx, key) => "signed_tx_hash";

const addConeTwistConstraint = (world, c) => true;

const applyForce = (body, force, point) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const scheduleProcess = (pid) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const removeMetadata = (file) => ({ file, metadata: null });

const setSocketTimeout = (ms) => ({ timeout: ms });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const limitRate = (stream, rate) => stream;

const enableBlend = (func) => true;

const bindTexture = (target, texture) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const allocateMemory = (size) => 0x1000;

const synthesizeSpeech = (text) => "audio_buffer";

const autoResumeTask = (id) => ({ id, status: "resumed" });

const execProcess = (path) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const swapTokens = (pair, amount) => true;

const loadCheckpoint = (path) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

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

const preventCSRF = () => "csrf_token";

const forkProcess = () => 101;

const filterTraffic = (rule) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const convertFormat = (src, dest) => dest;

const resumeContext = (ctx) => Promise.resolve();

const transcodeStream = (format) => ({ format, status: "processing" });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const dhcpAck = () => true;

const computeLossFunction = (pred, actual) => 0.05;

const translateMatrix = (mat, vec) => mat;

const registerGestureHandler = (gesture) => true;

const encapsulateFrame = (packet) => packet;

const registerSystemTray = () => ({ icon: "tray.ico" });


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

const reportError = (msg, line) => console.error(msg);

const createASTNode = (type, val) => ({ type, val });

const applyImpulse = (body, impulse, point) => true;

const preventSleepMode = () => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const addGeneric6DofConstraint = (world, c) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const setFilePermissions = (perm) => `chmod ${perm}`;

const listenSocket = (sock, backlog) => true;

const semaphoreSignal = (sem) => true;

const rollbackTransaction = (tx) => true;

// Anti-shake references
const _ref_1rb0ud = { vertexAttribPointer };
const _ref_z6tlw7 = { multicastMessage };
const _ref_qpicq3 = { cullFace };
const _ref_hsz8dq = { foldConstants };
const _ref_rlv6rn = { setFilterType };
const _ref_195wyg = { setViewport };
const _ref_agqwpx = { createBiquadFilter };
const _ref_v450xl = { uniformMatrix4fv };
const _ref_uw1s69 = { calculateRestitution };
const _ref_e874z0 = { compileVertexShader };
const _ref_0quulr = { connectNodes };
const _ref_ftpyzo = { createIndexBuffer };
const _ref_m38sta = { createScriptProcessor };
const _ref_u325zf = { uniform3f };
const _ref_nwst8e = { createGainNode };
const _ref_a63erv = { setInertia };
const _ref_eyzfye = { createFrameBuffer };
const _ref_00iks4 = { createSoftBody };
const _ref_cc099k = { eliminateDeadCode };
const _ref_7dzbo4 = { sleep };
const _ref_cfixt3 = { getVehicleSpeed };
const _ref_f2fupf = { compileFragmentShader };
const _ref_ajx0fg = { suspendContext };
const _ref_e7pnn0 = { createDelay };
const _ref_htn2d8 = { normalizeVolume };
const _ref_sbxdf5 = { setVelocity };
const _ref_b3ehm1 = { setDetune };
const _ref_c0p897 = { createAudioContext };
const _ref_lp5gj6 = { loadImpulseResponse };
const _ref_e470z6 = { applyTorque };
const _ref_kxa2z2 = { startOscillator };
const _ref_2hfswt = { createSphereShape };
const _ref_6shrbo = { createChannelMerger };
const _ref_usv41y = { setAttack };
const _ref_8m8guh = { stopOscillator };
const _ref_voodkd = { closeContext };
const _ref_pmh7w8 = { setMass };
const _ref_veju2c = { getVelocity };
const _ref_5ta4d1 = { attachRenderBuffer };
const _ref_rj9j79 = { getMACAddress };
const _ref_pkodur = { addHingeConstraint };
const _ref_t87t77 = { closeSocket };
const _ref_7j8hc2 = { bindAddress };
const _ref_eedx28 = { encryptStream };
const _ref_ktdqjq = { pingHost };
const _ref_4razyt = { inlineFunctions };
const _ref_tue75d = { clearScreen };
const _ref_1a64vw = { createMediaElementSource };
const _ref_ife96f = { switchProxyServer };
const _ref_conggo = { measureRTT };
const _ref_5jywp7 = { installUpdate };
const _ref_xu7yf2 = { optimizeTailCalls };
const _ref_ur3evr = { prefetchAssets };
const _ref_3pnrm2 = { lazyLoadComponent };
const _ref_vdbysv = { recognizeSpeech };
const _ref_cb2oda = { normalizeVector };
const _ref_5o27eo = { decryptStream };
const _ref_0x8325 = { useProgram };
const _ref_shjx24 = { initWebGLContext };
const _ref_328e3m = { checkGLError };
const _ref_34epgu = { exitScope };
const _ref_2nyc2k = { clusterKMeans };
const _ref_cgzid9 = { setThreshold };
const _ref_rhfo6y = { uninterestPeer };
const _ref_oqnej1 = { normalizeAudio };
const _ref_l7ugbw = { prioritizeTraffic };
const _ref_dt8avy = { sendPacket };
const _ref_b0g08n = { lookupSymbol };
const _ref_csy79z = { checkBatteryLevel };
const _ref_stsrcl = { createIndex };
const _ref_d1p9j3 = { verifyAppSignature };
const _ref_7ogxo9 = { tokenizeText };
const _ref_stn832 = { mangleNames };
const _ref_kxewz1 = { unmuteStream };
const _ref_k08t63 = { defineSymbol };
const _ref_w3e12c = { setPosition };
const _ref_ylhevp = { scrapeTracker };
const _ref_4fefm0 = { deserializeAST };
const _ref_vn2few = { sanitizeXSS };
const _ref_t5twel = { checkUpdate };
const _ref_ma460g = { createBoxShape };
const _ref_kon2m4 = { archiveFiles };
const _ref_lc9awm = { executeSQLQuery };
const _ref_bups07 = { reassemblePacket };
const _ref_uy161c = { beginTransaction };
const _ref_7xlh02 = { computeNormal };
const _ref_r865kn = { updateRoutingTable };
const _ref_doki4e = { edgeDetectionSobel };
const _ref_rs0cf6 = { resolveCollision };
const _ref_r1tsy7 = { dumpSymbolTable };
const _ref_wjuwbd = { lockFile };
const _ref_0835uo = { parseTorrentFile };
const _ref_iide4t = { getExtension };
const _ref_rw7iqf = { isFeatureEnabled };
const _ref_wuip21 = { disconnectNodes };
const _ref_tq0390 = { connectionPooling };
const _ref_xamg89 = { broadcastMessage };
const _ref_dwtdxh = { dhcpDiscover };
const _ref_o1f51e = { controlCongestion };
const _ref_ri78m3 = { detectFirewallStatus };
const _ref_ez0hw6 = { createTCPSocket };
const _ref_dxh8s8 = { debounceAction };
const _ref_kh7xxo = { predictTensor };
const _ref_j6k0au = { switchVLAN };
const _ref_0s4ujp = { sanitizeInput };
const _ref_vravhc = { terminateSession };
const _ref_rke71a = { hashKeccak256 };
const _ref_r4gx42 = { keepAlivePing };
const _ref_x4us0l = { validateSSLCert };
const _ref_hgqz4n = { calculatePieceHash };
const _ref_3b234p = { restoreDatabase };
const _ref_5dk56w = { openFile };
const _ref_yzymog = { drawElements };
const _ref_mqmfpc = { getAppConfig };
const _ref_na0fqr = { cacheQueryResults };
const _ref_y3780y = { configureInterface };
const _ref_pg27t6 = { estimateNonce };
const _ref_6zdpcd = { invalidateCache };
const _ref_zeqlf5 = { CacheManager };
const _ref_vtnlo2 = { getOutputTimestamp };
const _ref_xbyrtc = { initiateHandshake };
const _ref_klaf34 = { generateSourceMap };
const _ref_xkrge9 = { checkPortAvailability };
const _ref_9audwe = { flushSocketBuffer };
const _ref_2exrml = { inferType };
const _ref_q9gt75 = { setPan };
const _ref_ty927k = { segmentImageUNet };
const _ref_7s38a9 = { transformAesKey };
const _ref_o17skh = { readPipe };
const _ref_54uejc = { linkProgram };
const _ref_1cmw75 = { addPoint2PointConstraint };
const _ref_n9ruax = { resolveDNSOverHTTPS };
const _ref_8mr3js = { semaphoreWait };
const _ref_djazp9 = { deobfuscateString };
const _ref_pgap8c = { establishHandshake };
const _ref_o3zjxi = { sanitizeSQLInput };
const _ref_pmjln4 = { rotateLogFiles };
const _ref_zk89bn = { leaveGroup };
const _ref_z29wud = { verifySignature };
const _ref_gqge45 = { commitTransaction };
const _ref_6pik5m = { joinThread };
const _ref_2v41ky = { setQValue };
const _ref_wfajfr = { signTransaction };
const _ref_iu71fi = { addConeTwistConstraint };
const _ref_n84vk2 = { applyForce };
const _ref_0lxfhc = { applyEngineForce };
const _ref_ewv5b5 = { convertRGBtoHSL };
const _ref_muurjs = { traceStack };
const _ref_u198q5 = { scheduleProcess };
const _ref_zq6ryq = { checkIntegrity };
const _ref_vfrdpt = { removeMetadata };
const _ref_j633nf = { setSocketTimeout };
const _ref_bhc4sh = { readPixels };
const _ref_a9fkbm = { limitRate };
const _ref_rjoexn = { enableBlend };
const _ref_b6em5t = { bindTexture };
const _ref_y9jtey = { migrateSchema };
const _ref_zjq7v5 = { allocateMemory };
const _ref_quwxwm = { synthesizeSpeech };
const _ref_jshufp = { autoResumeTask };
const _ref_51heoy = { execProcess };
const _ref_mdtzy3 = { createDirectoryRecursive };
const _ref_ej092d = { getFileAttributes };
const _ref_uo6380 = { swapTokens };
const _ref_opwa02 = { loadCheckpoint };
const _ref_dn6ozv = { generateUUIDv5 };
const _ref_1a0em1 = { ProtocolBufferHandler };
const _ref_46l005 = { preventCSRF };
const _ref_av91z1 = { forkProcess };
const _ref_hzf86y = { filterTraffic };
const _ref_tqkpgs = { watchFileChanges };
const _ref_212bbs = { decodeABI };
const _ref_6ruh0t = { convertFormat };
const _ref_pe2ru9 = { resumeContext };
const _ref_64cgmf = { transcodeStream };
const _ref_ektfqg = { limitUploadSpeed };
const _ref_7zfl8n = { parseClass };
const _ref_1ak54h = { compressDataStream };
const _ref_ahu3l8 = { parseFunction };
const _ref_q9q1dv = { resolveHostName };
const _ref_8f9nnk = { generateWalletKeys };
const _ref_d2ehrv = { dhcpAck };
const _ref_qp6zdi = { computeLossFunction };
const _ref_mms7fy = { translateMatrix };
const _ref_jx1tn9 = { registerGestureHandler };
const _ref_3gldri = { encapsulateFrame };
const _ref_mzz74d = { registerSystemTray };
const _ref_92hf86 = { ResourceMonitor };
const _ref_ws2vyr = { reportError };
const _ref_owj03k = { createASTNode };
const _ref_pck7au = { applyImpulse };
const _ref_uee7a3 = { preventSleepMode };
const _ref_4g9d5a = { encryptPayload };
const _ref_wx6snq = { loadModelWeights };
const _ref_bydh7r = { addGeneric6DofConstraint };
const _ref_3em15m = { retryFailedSegment };
const _ref_aq81r6 = { setFilePermissions };
const _ref_u2726e = { listenSocket };
const _ref_c4ulqn = { semaphoreSignal };
const _ref_jxeddm = { rollbackTransaction }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `arte_sky_it` };
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
                const urlParams = { config, url: window.location.href, name_en: `arte_sky_it` };

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
        const uniformMatrix4fv = (loc, transpose, val) => true;

const installUpdate = () => false;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const unmuteStream = () => false;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const removeMetadata = (file) => ({ file, metadata: null });

const injectMetadata = (file, meta) => ({ file, meta });

const setVolumeLevel = (vol) => vol;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const getCpuLoad = () => Math.random() * 100;

const compressGzip = (data) => data;

const repairCorruptFile = (path) => ({ path, repaired: true });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const adjustPlaybackSpeed = (rate) => rate;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const downInterface = (iface) => true;

const detectVideoCodec = () => "h264";

const generateDocumentation = (ast) => "";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const multicastMessage = (group, msg) => true;

const joinGroup = (group) => true;

const generateSourceMap = (ast) => "{}";

const createThread = (func) => ({ tid: 1 });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const defineSymbol = (table, name, info) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const switchVLAN = (id) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const shardingTable = (table) => ["shard_0", "shard_1"];


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

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const arpRequest = (ip) => "00:00:00:00:00:00";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const lockRow = (id) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const setPosition = (panner, x, y, z) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const recognizeSpeech = (audio) => "Transcribed Text";

const restoreDatabase = (path) => true;

const uniform3f = (loc, x, y, z) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const generateEmbeddings = (text) => new Float32Array(128);

const registerGestureHandler = (gesture) => true;

const listenSocket = (sock, backlog) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const closeSocket = (sock) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const processAudioBuffer = (buffer) => buffer;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createSymbolTable = () => ({ scopes: [] });

const execProcess = (path) => true;

const checkTypes = (ast) => [];

const applyForce = (body, force, point) => true;

const bindAddress = (sock, addr, port) => true;

const classifySentiment = (text) => "positive";

const mapMemory = (fd, size) => 0x2000;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const mutexLock = (mtx) => true;

const connectSocket = (sock, addr, port) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const getMediaDuration = () => 3600;

const scheduleProcess = (pid) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const calculateComplexity = (ast) => 1;

const resetVehicle = (vehicle) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const inferType = (node) => 'any';

const setRatio = (node, val) => node.ratio.value = val;

const activeTexture = (unit) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const reportWarning = (msg, line) => console.warn(msg);

const cullFace = (mode) => true;

const freeMemory = (ptr) => true;

const analyzeHeader = (packet) => ({});

const detachThread = (tid) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const semaphoreWait = (sem) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const dhcpRequest = (ip) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const compileToBytecode = (ast) => new Uint8Array();

const broadcastMessage = (msg) => true;

const parsePayload = (packet) => ({});

const beginTransaction = () => "TX-" + Date.now();

const setRelease = (node, val) => node.release.value = val;

const emitParticles = (sys, count) => true;

const foldConstants = (ast) => ast;

const checkUpdate = () => ({ hasUpdate: false });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const computeLossFunction = (pred, actual) => 0.05;

const negotiateProtocol = () => "HTTP/2.0";

const createSoftBody = (info) => ({ nodes: [] });

const createProcess = (img) => ({ pid: 100 });

const unlockRow = (id) => true;

const preventSleepMode = () => true;

const applyTorque = (body, torque) => true;

const addSliderConstraint = (world, c) => true;

const createListener = (ctx) => ({});

const createConvolver = (ctx) => ({ buffer: null });

const createDirectoryRecursive = (path) => path.split('/').length;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const cancelTask = (id) => ({ id, cancelled: true });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const dhcpDiscover = () => true;

const getFloatTimeDomainData = (analyser, array) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const synthesizeSpeech = (text) => "audio_buffer";

const createMediaStreamSource = (ctx, stream) => ({});

const drawElements = (mode, count, type, offset) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const cacheQueryResults = (key, data) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const bindSocket = (port) => ({ port, status: "bound" });

const sendPacket = (sock, data) => data.length;

const deserializeAST = (json) => JSON.parse(json);

const performOCR = (img) => "Detected Text";

const calculateCRC32 = (data) => "00000000";

const triggerHapticFeedback = (intensity) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const scheduleTask = (task) => ({ id: 1, task });

const instrumentCode = (code) => code;

const allocateMemory = (size) => 0x1000;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const setInertia = (body, i) => true;

const minifyCode = (code) => code;

const unrollLoops = (ast) => ast;

const joinThread = (tid) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const shutdownComputer = () => console.log("Shutting down...");

const lockFile = (path) => ({ path, locked: true });

const announceToTracker = (url) => ({ url, interval: 1800 });

const setOrientation = (panner, x, y, z) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const createIndex = (table, col) => `IDX_${table}_${col}`;

const loadCheckpoint = (path) => true;

const optimizeAST = (ast) => ast;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
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

const tokenizeText = (text) => text.split(" ");

const setDistanceModel = (panner, model) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const setDetune = (osc, cents) => osc.detune = cents;

const cleanOldLogs = (days) => days;

const anchorSoftBody = (soft, rigid) => true;

const exitScope = (table) => true;


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

const checkIntegrityConstraint = (table) => true;

const hydrateSSR = (html) => true;

const createPipe = () => [3, 4];

const mutexUnlock = (mtx) => true;

const resolveCollision = (manifold) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const mockResponse = (body) => ({ status: 200, body });

const getByteFrequencyData = (analyser, array) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const uniform1i = (loc, val) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const setViewport = (x, y, w, h) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const protectMemory = (ptr, size, flags) => true;

const setKnee = (node, val) => node.knee.value = val;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const segmentImageUNet = (img) => "mask_buffer";

const lookupSymbol = (table, name) => ({});

const addRigidBody = (world, body) => true;

const getVehicleSpeed = (vehicle) => 0;

const compressPacket = (data) => data;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const getExtension = (name) => ({});

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

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setMTU = (iface, mtu) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const updateSoftBody = (body) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const removeConstraint = (world, c) => true;

const useProgram = (program) => true;

const blockMaliciousTraffic = (ip) => true;

const createTCPSocket = () => ({ fd: 1 });

// Anti-shake references
const _ref_v93av6 = { uniformMatrix4fv };
const _ref_tdh7uf = { installUpdate };
const _ref_63yyh4 = { getNetworkStats };
const _ref_rguo9z = { unmuteStream };
const _ref_wudnio = { syncAudioVideo };
const _ref_is15b8 = { removeMetadata };
const _ref_odz5wx = { injectMetadata };
const _ref_lpxi3y = { setVolumeLevel };
const _ref_uw3ps0 = { playSoundAlert };
const _ref_i7wwx2 = { getCpuLoad };
const _ref_xyl785 = { compressGzip };
const _ref_gglf0m = { repairCorruptFile };
const _ref_ys2n2x = { extractThumbnail };
const _ref_pnktv0 = { getFileAttributes };
const _ref_2zuei6 = { scheduleBandwidth };
const _ref_m2pmwi = { adjustPlaybackSpeed };
const _ref_ybweuj = { clearBrowserCache };
const _ref_9812da = { autoResumeTask };
const _ref_cwu6uq = { validateTokenStructure };
const _ref_6abqo4 = { updateBitfield };
const _ref_oyjrsf = { downInterface };
const _ref_hfnc14 = { detectVideoCodec };
const _ref_stxy72 = { generateDocumentation };
const _ref_fowkwo = { debouncedResize };
const _ref_yaohmp = { simulateNetworkDelay };
const _ref_f2skt6 = { multicastMessage };
const _ref_vephn6 = { joinGroup };
const _ref_0dhqv6 = { generateSourceMap };
const _ref_0ogoj0 = { createThread };
const _ref_giibi0 = { handshakePeer };
const _ref_wcz3e8 = { defineSymbol };
const _ref_7nxnvd = { acceptConnection };
const _ref_maovdk = { switchVLAN };
const _ref_8u3xwo = { transformAesKey };
const _ref_1z7y8p = { shardingTable };
const _ref_s04esm = { TelemetryClient };
const _ref_1nlzvy = { moveFileToComplete };
const _ref_umqiin = { arpRequest };
const _ref_09jh41 = { loadModelWeights };
const _ref_9rkx8l = { calculateMD5 };
const _ref_xuv1sb = { lockRow };
const _ref_mmhkz6 = { backupDatabase };
const _ref_npbyj8 = { setPosition };
const _ref_gz6bv0 = { predictTensor };
const _ref_75v9b6 = { recognizeSpeech };
const _ref_h1yqhm = { restoreDatabase };
const _ref_nzwv6j = { uniform3f };
const _ref_wrskzf = { formatCurrency };
const _ref_kzt25h = { generateEmbeddings };
const _ref_m8ar72 = { registerGestureHandler };
const _ref_w126fy = { listenSocket };
const _ref_bset0c = { showNotification };
const _ref_2hitdt = { normalizeAudio };
const _ref_7txp7f = { calculatePieceHash };
const _ref_kmnxbc = { monitorNetworkInterface };
const _ref_k4hj8i = { closeSocket };
const _ref_9k6byr = { watchFileChanges };
const _ref_y19ful = { createScriptProcessor };
const _ref_eaj62m = { processAudioBuffer };
const _ref_s8spr8 = { connectToTracker };
const _ref_zjv5h9 = { createSymbolTable };
const _ref_ivcoyu = { execProcess };
const _ref_8698kn = { checkTypes };
const _ref_fewbo9 = { applyForce };
const _ref_ccmkq2 = { bindAddress };
const _ref_jzrsz7 = { classifySentiment };
const _ref_8yezfo = { mapMemory };
const _ref_nk39p1 = { executeSQLQuery };
const _ref_yhuwcf = { createBiquadFilter };
const _ref_lk6pqd = { mutexLock };
const _ref_6507b0 = { connectSocket };
const _ref_sh9s5v = { createWaveShaper };
const _ref_uila33 = { generateUUIDv5 };
const _ref_0dm1pl = { getMediaDuration };
const _ref_0twsam = { scheduleProcess };
const _ref_jrtut6 = { syncDatabase };
const _ref_d11adb = { calculateComplexity };
const _ref_2b3l0o = { resetVehicle };
const _ref_ng41ug = { setSteeringValue };
const _ref_91b7wr = { verifyFileSignature };
const _ref_36jm0r = { inferType };
const _ref_gmlrf8 = { setRatio };
const _ref_xh8ln5 = { activeTexture };
const _ref_masua6 = { sanitizeSQLInput };
const _ref_dll8gk = { reportWarning };
const _ref_8kw7h0 = { cullFace };
const _ref_bp7upu = { freeMemory };
const _ref_tnqti0 = { analyzeHeader };
const _ref_7c3ue7 = { detachThread };
const _ref_78vyba = { createVehicle };
const _ref_m2xaa8 = { decryptHLSStream };
const _ref_cfwnwt = { semaphoreWait };
const _ref_b3a6jv = { setSocketTimeout };
const _ref_gp0hld = { limitBandwidth };
const _ref_xa4q3w = { dhcpRequest };
const _ref_43xcxm = { analyzeControlFlow };
const _ref_1gppum = { compileToBytecode };
const _ref_v0vzqw = { broadcastMessage };
const _ref_1hiosw = { parsePayload };
const _ref_ivkieq = { beginTransaction };
const _ref_v5qqqv = { setRelease };
const _ref_agllp8 = { emitParticles };
const _ref_70vqkn = { foldConstants };
const _ref_p779u8 = { checkUpdate };
const _ref_5kvjr7 = { uploadCrashReport };
const _ref_vb2txv = { computeLossFunction };
const _ref_yqf6zm = { negotiateProtocol };
const _ref_b8u2u9 = { createSoftBody };
const _ref_032dtr = { createProcess };
const _ref_fj0axz = { unlockRow };
const _ref_ivq4yf = { preventSleepMode };
const _ref_dly8hc = { applyTorque };
const _ref_6mkbh2 = { addSliderConstraint };
const _ref_8bql87 = { createListener };
const _ref_597f08 = { createConvolver };
const _ref_ecjzcv = { createDirectoryRecursive };
const _ref_9ls5uf = { parseConfigFile };
const _ref_jnzof8 = { cancelTask };
const _ref_25x38w = { traceStack };
const _ref_ovy19p = { dhcpDiscover };
const _ref_cf4vkk = { getFloatTimeDomainData };
const _ref_3ri2nm = { analyzeUserBehavior };
const _ref_3pxhu7 = { synthesizeSpeech };
const _ref_d180qx = { createMediaStreamSource };
const _ref_fhyi7r = { drawElements };
const _ref_ulr4nc = { calculateLayoutMetrics };
const _ref_pmpkyc = { cacheQueryResults };
const _ref_w6gh9c = { parseTorrentFile };
const _ref_al1peo = { bindSocket };
const _ref_4y0xe4 = { sendPacket };
const _ref_1t2zed = { deserializeAST };
const _ref_voibh4 = { performOCR };
const _ref_ua5mk3 = { calculateCRC32 };
const _ref_sgnpdb = { triggerHapticFeedback };
const _ref_0jgcgl = { resolveDNSOverHTTPS };
const _ref_y4fdvf = { scheduleTask };
const _ref_pbpfir = { instrumentCode };
const _ref_hppi03 = { allocateMemory };
const _ref_bsqe5x = { getMACAddress };
const _ref_bxxy5m = { setInertia };
const _ref_yuyfzs = { minifyCode };
const _ref_nby6l0 = { unrollLoops };
const _ref_88ipb9 = { joinThread };
const _ref_bf2rn6 = { verifyMagnetLink };
const _ref_s61j6l = { shutdownComputer };
const _ref_rjddl4 = { lockFile };
const _ref_a1po6p = { announceToTracker };
const _ref_1276qn = { setOrientation };
const _ref_up97pd = { makeDistortionCurve };
const _ref_sw8gjy = { createIndex };
const _ref_5a6pfu = { loadCheckpoint };
const _ref_swtcm9 = { optimizeAST };
const _ref_rgx4d6 = { createGainNode };
const _ref_waaqy5 = { terminateSession };
const _ref_w58ipt = { compressDataStream };
const _ref_ktu469 = { calculateEntropy };
const _ref_291kqm = { tokenizeText };
const _ref_wk61o3 = { setDistanceModel };
const _ref_stbnxk = { normalizeFeatures };
const _ref_oiy1bw = { setDetune };
const _ref_l76p5t = { cleanOldLogs };
const _ref_jd45qc = { anchorSoftBody };
const _ref_1tr1q4 = { exitScope };
const _ref_ng0yys = { ResourceMonitor };
const _ref_z1v9dg = { checkIntegrityConstraint };
const _ref_6ppvm5 = { hydrateSSR };
const _ref_dbrn73 = { createPipe };
const _ref_sd4vd7 = { mutexUnlock };
const _ref_mtishe = { resolveCollision };
const _ref_tnsokn = { migrateSchema };
const _ref_6vdygp = { mockResponse };
const _ref_hzbqxs = { getByteFrequencyData };
const _ref_5d3xcs = { diffVirtualDOM };
const _ref_4rz72t = { throttleRequests };
const _ref_7x7zyt = { uniform1i };
const _ref_nkjup7 = { updateProgressBar };
const _ref_7so978 = { setViewport };
const _ref_fqe4pl = { initiateHandshake };
const _ref_ua0604 = { virtualScroll };
const _ref_98or3d = { protectMemory };
const _ref_vfq0q8 = { setKnee };
const _ref_cmyjl0 = { encryptPayload };
const _ref_4t9csc = { segmentImageUNet };
const _ref_0nnn2u = { lookupSymbol };
const _ref_zo1kal = { addRigidBody };
const _ref_cjpzf3 = { getVehicleSpeed };
const _ref_eql7jb = { compressPacket };
const _ref_jtolyj = { cancelAnimationFrameLoop };
const _ref_a6mwnn = { getExtension };
const _ref_o2p0rc = { download };
const _ref_2m64u9 = { limitDownloadSpeed };
const _ref_o0kj6k = { getAngularVelocity };
const _ref_g0x1us = { setMTU };
const _ref_nociej = { readPixels };
const _ref_ygbbks = { updateSoftBody };
const _ref_ht8ur7 = { lazyLoadComponent };
const _ref_ewsvu2 = { removeConstraint };
const _ref_o2byai = { useProgram };
const _ref_9y8qcx = { blockMaliciousTraffic };
const _ref_bcrk92 = { createTCPSocket }; 
    });
})({}, {});