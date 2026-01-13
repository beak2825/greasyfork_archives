// ==UserScript==
// @name BitChute视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/BitChute/index.js
// @version 2026.01.10
// @description 一键下载BitChute视频，支持4K/1080P/720P多画质。
// @icon https://www.bitchute.com/static/icons/favicon-128x128.png
// @match *://*.bitchute.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect bitchute.com
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
// @downloadURL https://update.greasyfork.org/scripts/562237/BitChute%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562237/BitChute%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const getNetworkStats = () => ({ up: 100, down: 2000 });

const getUniformLocation = (program, name) => 1;

const encodeABI = (method, params) => "0x...";

const validateIPWhitelist = (ip) => true;

const spoofReferer = () => "https://google.com";

const validateFormInput = (input) => input.length > 0;

const defineSymbol = (table, name, info) => true;

const attachRenderBuffer = (fb, rb) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createMeshShape = (vertices) => ({ type: 'mesh' });

const auditAccessLogs = () => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const adjustPlaybackSpeed = (rate) => rate;

const createSphereShape = (r) => ({ type: 'sphere' });

const setMass = (body, m) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const detectDarkMode = () => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const validateProgram = (program) => true;

const unmuteStream = () => false;

const replicateData = (node) => ({ target: node, synced: true });

const uniform3f = (loc, x, y, z) => true;

const wakeUp = (body) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const resolveCollision = (manifold) => true;

const applyFog = (color, dist) => color;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const setAngularVelocity = (body, v) => true;

const uniform1i = (loc, val) => true;

const applyForce = (body, force, point) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const interestPeer = (peer) => ({ ...peer, interested: true });

const stopOscillator = (osc, time) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const getExtension = (name) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const processAudioBuffer = (buffer) => buffer;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const convexSweepTest = (shape, start, end) => ({ hit: false });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const resetVehicle = (vehicle) => true;

const applyTorque = (body, torque) => true;

const configureInterface = (iface, config) => true;

const prettifyCode = (code) => code;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const activeTexture = (unit) => true;

const exitScope = (table) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const removeMetadata = (file) => ({ file, metadata: null });

const unrollLoops = (ast) => ast;

const addGeneric6DofConstraint = (world, c) => true;

const generateSourceMap = (ast) => "{}";

const updateTransform = (body) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const compileToBytecode = (ast) => new Uint8Array();

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const installUpdate = () => false;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const generateDocumentation = (ast) => "";

const getBlockHeight = () => 15000000;

const verifyProofOfWork = (nonce) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const checkTypes = (ast) => [];

const allowSleepMode = () => true;

const minifyCode = (code) => code;

const resolveSymbols = (ast) => ({});

const registerSystemTray = () => ({ icon: "tray.ico" });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const deleteTexture = (texture) => true;

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

const createFrameBuffer = () => ({ id: Math.random() });

const verifySignature = (tx, sig) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const scheduleTask = (task) => ({ id: 1, task });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const jitCompile = (bc) => (() => {});

const checkUpdate = () => ({ hasUpdate: false });

const disableRightClick = () => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const createAudioContext = () => ({ sampleRate: 44100 });

const connectSocket = (sock, addr, port) => true;

const getProgramInfoLog = (program) => "";

const deleteProgram = (program) => true;

const triggerHapticFeedback = (intensity) => true;

const setViewport = (x, y, w, h) => true;

const encryptStream = (stream, key) => stream;

const updateParticles = (sys, dt) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const checkBatteryLevel = () => 100;

const getShaderInfoLog = (shader) => "";

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const updateRoutingTable = (entry) => true;

const setMTU = (iface, mtu) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const rateLimitCheck = (ip) => true;

const findLoops = (cfg) => [];

const decodeAudioData = (buffer) => Promise.resolve({});

const registerGestureHandler = (gesture) => true;

const getVehicleSpeed = (vehicle) => 0;

const visitNode = (node) => true;

const blockMaliciousTraffic = (ip) => true;

const protectMemory = (ptr, size, flags) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const prefetchAssets = (urls) => urls.length;

const unmapMemory = (ptr, size) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const subscribeToEvents = (contract) => true;

const mutexUnlock = (mtx) => true;

const checkParticleCollision = (sys, world) => true;

const obfuscateString = (str) => btoa(str);

const allocateRegisters = (ir) => ir;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const eliminateDeadCode = (ast) => ast;

const signTransaction = (tx, key) => "signed_tx_hash";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const connectNodes = (src, dest) => true;

const resampleAudio = (buffer, rate) => buffer;

const rollbackTransaction = (tx) => true;

const createThread = (func) => ({ tid: 1 });

const edgeDetectionSobel = (image) => image;

const logErrorToFile = (err) => console.error(err);

const addPoint2PointConstraint = (world, c) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const hashKeccak256 = (data) => "0xabc...";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const getEnv = (key) => "";

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const unlinkFile = (path) => true;

const backpropagateGradient = (loss) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const renderParticles = (sys) => true;

const validateRecaptcha = (token) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const deserializeAST = (json) => JSON.parse(json);

const prioritizeTraffic = (queue) => true;

const lookupSymbol = (table, name) => ({});

const setEnv = (key, val) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const dumpSymbolTable = (table) => "";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const translateMatrix = (mat, vec) => mat;

const panicKernel = (msg) => false;

const chownFile = (path, uid, gid) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createVehicle = (chassis) => ({ wheels: [] });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const deriveAddress = (path) => "0x123...";

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const detectDebugger = () => false;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const compileFragmentShader = (source) => ({ compiled: true });

const dhcpDiscover = () => true;

const bindSocket = (port) => ({ port, status: "bound" });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const calculateMetric = (route) => 1;

const retransmitPacket = (seq) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const sendPacket = (sock, data) => data.length;

const detachThread = (tid) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const disablePEX = () => false;

const rayCast = (world, start, end) => ({ hit: false });

const reportError = (msg, line) => console.error(msg);

const debouncedResize = () => ({ width: 1920, height: 1080 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const remuxContainer = (container) => ({ container, status: "done" });


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

const beginTransaction = () => "TX-" + Date.now();

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const disconnectNodes = (node) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const broadcastTransaction = (tx) => "tx_hash_123";

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

const enableInterrupts = () => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const getcwd = () => "/";

const hoistVariables = (ast) => ast;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const forkProcess = () => 101;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const compileVertexShader = (source) => ({ compiled: true });

const mockResponse = (body) => ({ status: 200, body });

const traceroute = (host) => ["192.168.1.1"];

const statFile = (path) => ({ size: 0 });

// Anti-shake references
const _ref_93s57x = { getNetworkStats };
const _ref_q3tr5w = { getUniformLocation };
const _ref_z79flf = { encodeABI };
const _ref_4e1l38 = { validateIPWhitelist };
const _ref_hos9xc = { spoofReferer };
const _ref_pdzeyo = { validateFormInput };
const _ref_433fdn = { defineSymbol };
const _ref_5tzf1f = { attachRenderBuffer };
const _ref_fxivsh = { createScriptProcessor };
const _ref_dgtlhf = { createMeshShape };
const _ref_ljzbtf = { auditAccessLogs };
const _ref_bg9kxu = { createIndexBuffer };
const _ref_usjxma = { adjustPlaybackSpeed };
const _ref_fcz3h9 = { createSphereShape };
const _ref_4nkonz = { setMass };
const _ref_9txvz1 = { uninterestPeer };
const _ref_tsyi47 = { detectDarkMode };
const _ref_cadu73 = { convertRGBtoHSL };
const _ref_1awh2h = { validateProgram };
const _ref_nfxf7k = { unmuteStream };
const _ref_5w1fq0 = { replicateData };
const _ref_30maox = { uniform3f };
const _ref_x491wy = { wakeUp };
const _ref_3xjb9l = { detectObjectYOLO };
const _ref_g1kmk1 = { showNotification };
const _ref_v07z5k = { resolveCollision };
const _ref_3fbelj = { applyFog };
const _ref_raqpwn = { normalizeVector };
const _ref_u6wts2 = { setAngularVelocity };
const _ref_fboubc = { uniform1i };
const _ref_7a5mpi = { applyForce };
const _ref_jfnjvc = { createShader };
const _ref_0hkg0w = { interestPeer };
const _ref_4bupbz = { stopOscillator };
const _ref_oovtn9 = { calculateFriction };
const _ref_pscoej = { getExtension };
const _ref_saw9b9 = { setFrequency };
const _ref_ho4jg2 = { processAudioBuffer };
const _ref_fr0ozc = { terminateSession };
const _ref_hujtiv = { convexSweepTest };
const _ref_rtorjy = { executeSQLQuery };
const _ref_y21rt3 = { resetVehicle };
const _ref_c9klc0 = { applyTorque };
const _ref_qnp3fo = { configureInterface };
const _ref_rd588v = { prettifyCode };
const _ref_28imkz = { monitorNetworkInterface };
const _ref_k3b4j8 = { activeTexture };
const _ref_dk9t3i = { exitScope };
const _ref_6azk59 = { simulateNetworkDelay };
const _ref_bs3axj = { removeMetadata };
const _ref_oxm489 = { unrollLoops };
const _ref_ml3grz = { addGeneric6DofConstraint };
const _ref_38rd2r = { generateSourceMap };
const _ref_lxmx9o = { updateTransform };
const _ref_dbhe8l = { createDirectoryRecursive };
const _ref_uvl72c = { compileToBytecode };
const _ref_n876ir = { verifyFileSignature };
const _ref_4jkxdv = { installUpdate };
const _ref_50wxz8 = { performTLSHandshake };
const _ref_iy5smz = { generateDocumentation };
const _ref_0jenwc = { getBlockHeight };
const _ref_rqnbeg = { verifyProofOfWork };
const _ref_rod7ti = { getVelocity };
const _ref_z0w7vo = { checkTypes };
const _ref_qzfj2j = { allowSleepMode };
const _ref_v00htv = { minifyCode };
const _ref_l8wh2i = { resolveSymbols };
const _ref_0j0unw = { registerSystemTray };
const _ref_bdf1lz = { decodeABI };
const _ref_jt8aiv = { deleteTexture };
const _ref_pak9vs = { AdvancedCipher };
const _ref_jnn3x6 = { createFrameBuffer };
const _ref_10fxx2 = { verifySignature };
const _ref_wmiiwe = { compressDataStream };
const _ref_48wgw0 = { scheduleTask };
const _ref_57vbkv = { compactDatabase };
const _ref_4s2fqj = { jitCompile };
const _ref_20eg8m = { checkUpdate };
const _ref_pkfyyj = { disableRightClick };
const _ref_gbxudc = { chokePeer };
const _ref_iwi3kd = { createAudioContext };
const _ref_2v0trr = { connectSocket };
const _ref_nyvij7 = { getProgramInfoLog };
const _ref_mug4hb = { deleteProgram };
const _ref_nc0qqe = { triggerHapticFeedback };
const _ref_kiap3v = { setViewport };
const _ref_jhdwdu = { encryptStream };
const _ref_k8ndlq = { updateParticles };
const _ref_lgr1h4 = { optimizeHyperparameters };
const _ref_2jd8yj = { checkBatteryLevel };
const _ref_4dvhoq = { getShaderInfoLog };
const _ref_39j3m9 = { cancelAnimationFrameLoop };
const _ref_cvmrdb = { updateRoutingTable };
const _ref_7ul960 = { setMTU };
const _ref_h1nlm4 = { unchokePeer };
const _ref_t9ssw6 = { rateLimitCheck };
const _ref_uhkvga = { findLoops };
const _ref_nqmdr0 = { decodeAudioData };
const _ref_g8y3fp = { registerGestureHandler };
const _ref_05v3ji = { getVehicleSpeed };
const _ref_h8v3c9 = { visitNode };
const _ref_0gb2xj = { blockMaliciousTraffic };
const _ref_qq0fk0 = { protectMemory };
const _ref_t1gmve = { generateUUIDv5 };
const _ref_o3wsf6 = { retryFailedSegment };
const _ref_v66ho0 = { prefetchAssets };
const _ref_we360l = { unmapMemory };
const _ref_xii1qs = { createOscillator };
const _ref_qdddnw = { subscribeToEvents };
const _ref_4c2r77 = { mutexUnlock };
const _ref_5s6575 = { checkParticleCollision };
const _ref_alc4pi = { obfuscateString };
const _ref_dawuor = { allocateRegisters };
const _ref_uj3vk1 = { checkIntegrity };
const _ref_uue15s = { clearBrowserCache };
const _ref_xvvubu = { eliminateDeadCode };
const _ref_5244t4 = { signTransaction };
const _ref_ntst60 = { parseM3U8Playlist };
const _ref_kilgg4 = { connectNodes };
const _ref_gwkq0t = { resampleAudio };
const _ref_b0eqz2 = { rollbackTransaction };
const _ref_dkll2f = { createThread };
const _ref_83xqy9 = { edgeDetectionSobel };
const _ref_ql28xy = { logErrorToFile };
const _ref_lgd7m2 = { addPoint2PointConstraint };
const _ref_7spxr2 = { renderShadowMap };
const _ref_0dy2x6 = { hashKeccak256 };
const _ref_yv5l1p = { transformAesKey };
const _ref_vifnuo = { getEnv };
const _ref_b7pxsr = { analyzeQueryPlan };
const _ref_8fa5ty = { unlinkFile };
const _ref_rk5z7y = { backpropagateGradient };
const _ref_ci7e04 = { setDetune };
const _ref_7jzwq0 = { linkProgram };
const _ref_xb3uvb = { renderParticles };
const _ref_i29idn = { validateRecaptcha };
const _ref_b6zbh5 = { calculateLighting };
const _ref_hdmf14 = { calculateLayoutMetrics };
const _ref_bsrcrj = { interceptRequest };
const _ref_238ttg = { deserializeAST };
const _ref_6y6j6j = { prioritizeTraffic };
const _ref_875bmp = { lookupSymbol };
const _ref_kdgs1s = { setEnv };
const _ref_ngxuhd = { validateTokenStructure };
const _ref_5l8pdh = { dumpSymbolTable };
const _ref_uji11g = { detectFirewallStatus };
const _ref_f3ectg = { translateMatrix };
const _ref_i7qs0i = { panicKernel };
const _ref_h9emym = { chownFile };
const _ref_od6tha = { parseMagnetLink };
const _ref_oi6flm = { createVehicle };
const _ref_urjjwa = { switchProxyServer };
const _ref_j6jjs7 = { getAngularVelocity };
const _ref_eyhdyk = { connectionPooling };
const _ref_ujpsqe = { deriveAddress };
const _ref_54w7s9 = { parseConfigFile };
const _ref_130nmn = { detectDebugger };
const _ref_q7ywjo = { analyzeUserBehavior };
const _ref_g8ap8t = { calculateMD5 };
const _ref_gz4n1k = { initWebGLContext };
const _ref_5os6rj = { initiateHandshake };
const _ref_c3mdrk = { compileFragmentShader };
const _ref_fsxu1o = { dhcpDiscover };
const _ref_ggiv6a = { bindSocket };
const _ref_5wxrw7 = { connectToTracker };
const _ref_fizwc9 = { applyEngineForce };
const _ref_cy0qm4 = { createGainNode };
const _ref_8s3huv = { computeSpeedAverage };
const _ref_lsb1my = { calculateMetric };
const _ref_eaqlk4 = { retransmitPacket };
const _ref_1jds59 = { requestAnimationFrameLoop };
const _ref_anskmp = { vertexAttribPointer };
const _ref_myxxji = { sendPacket };
const _ref_i5fpmn = { detachThread };
const _ref_3kr8ni = { getAppConfig };
const _ref_lstmsu = { disablePEX };
const _ref_rse6rd = { rayCast };
const _ref_jikxjr = { reportError };
const _ref_cx9dp8 = { debouncedResize };
const _ref_60463k = { rotateUserAgent };
const _ref_a60xvi = { remuxContainer };
const _ref_37qlgw = { TelemetryClient };
const _ref_hwfz10 = { beginTransaction };
const _ref_pqjr4w = { createBiquadFilter };
const _ref_31k5px = { disconnectNodes };
const _ref_ur7gqa = { bufferMediaStream };
const _ref_kj3hu0 = { validateSSLCert };
const _ref_qct4w0 = { broadcastTransaction };
const _ref_k0d4b0 = { TaskScheduler };
const _ref_t5e74i = { enableInterrupts };
const _ref_aszfll = { uniformMatrix4fv };
const _ref_xs1sfa = { getcwd };
const _ref_vnn2io = { hoistVariables };
const _ref_y22gk0 = { throttleRequests };
const _ref_uogr6o = { forkProcess };
const _ref_tvmpoe = { updateBitfield };
const _ref_cgonbm = { compileVertexShader };
const _ref_e31lcc = { mockResponse };
const _ref_kixhnf = { traceroute };
const _ref_wv8al0 = { statFile }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `BitChute` };
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
                const urlParams = { config, url: window.location.href, name_en: `BitChute` };

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
        const dhcpAck = () => true;

const addWheel = (vehicle, info) => true;

const getByteFrequencyData = (analyser, array) => true;

const createMediaElementSource = (ctx, el) => ({});

const setInertia = (body, i) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const setGravity = (world, g) => world.gravity = g;

const setDelayTime = (node, time) => node.delayTime.value = time;

const stepSimulation = (world, dt) => true;

const anchorSoftBody = (soft, rigid) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const uniformMatrix4fv = (loc, transpose, val) => true;

const createChannelSplitter = (ctx, channels) => ({});

const createChannelMerger = (ctx, channels) => ({});

const setRelease = (node, val) => node.release.value = val;

const encryptStream = (stream, key) => stream;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setPosition = (panner, x, y, z) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const compileToBytecode = (ast) => new Uint8Array();

const reportError = (msg, line) => console.error(msg);

const checkTypes = (ast) => [];

const validateProgram = (program) => true;

const hoistVariables = (ast) => ast;

const jitCompile = (bc) => (() => {});

const createAudioContext = () => ({ sampleRate: 44100 });

const checkParticleCollision = (sys, world) => true;

const optimizeTailCalls = (ast) => ast;

const linkModules = (modules) => ({});

const normalizeVolume = (buffer) => buffer;

const inferType = (node) => 'any';

const setDistanceModel = (panner, model) => true;

const resolveImports = (ast) => [];

const resumeContext = (ctx) => Promise.resolve();

const serializeAST = (ast) => JSON.stringify(ast);

const setThreshold = (node, val) => node.threshold.value = val;

const instrumentCode = (code) => code;

const reportWarning = (msg, line) => console.warn(msg);

const defineSymbol = (table, name, info) => true;

const verifyIR = (ir) => true;

const deleteTexture = (texture) => true;

const minifyCode = (code) => code;

const profilePerformance = (func) => 0;

const lookupSymbol = (table, name) => ({});

const resampleAudio = (buffer, rate) => buffer;

const interpretBytecode = (bc) => true;

const updateRoutingTable = (entry) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const listenSocket = (sock, backlog) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const mapMemory = (fd, size) => 0x2000;

const createMediaStreamSource = (ctx, stream) => ({});

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const semaphoreSignal = (sem) => true;

const createASTNode = (type, val) => ({ type, val });

const decompressPacket = (data) => data;

const setPan = (node, val) => node.pan.value = val;

const openFile = (path, flags) => 5;

const analyzeHeader = (packet) => ({});

const rmdir = (path) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const inlineFunctions = (ast) => ast;

const parsePayload = (packet) => ({});

const calculateRestitution = (mat1, mat2) => 0.3;

const measureRTT = (sent, recv) => 10;

const getFloatTimeDomainData = (analyser, array) => true;

const computeDominators = (cfg) => ({});

const validateRecaptcha = (token) => true;

const renderParticles = (sys) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const processAudioBuffer = (buffer) => buffer;

const renameFile = (oldName, newName) => newName;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const tokenizeText = (text) => text.split(" ");

const shutdownComputer = () => console.log("Shutting down...");

const resolveCollision = (manifold) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const enableDHT = () => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const beginTransaction = () => "TX-" + Date.now();

const mkdir = (path) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const decryptStream = (stream, key) => stream;

const adjustWindowSize = (sock, size) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const decompressGzip = (data) => data;

const invalidateCache = (key) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
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

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const renderCanvasLayer = (ctx) => true;

const allocateMemory = (size) => 0x1000;

const rayCast = (world, start, end) => ({ hit: false });

const setOrientation = (panner, x, y, z) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const repairCorruptFile = (path) => ({ path, repaired: true });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const readFile = (fd, len) => "";

const createIndexBuffer = (data) => ({ id: Math.random() });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const commitTransaction = (tx) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const triggerHapticFeedback = (intensity) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const dropTable = (table) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const mangleNames = (ast) => ast;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const augmentData = (image) => image;

const drawElements = (mode, count, type, offset) => true;

const cleanOldLogs = (days) => days;

const closeSocket = (sock) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const clusterKMeans = (data, k) => Array(k).fill([]);

const scheduleTask = (task) => ({ id: 1, task });

const calculateFriction = (mat1, mat2) => 0.5;

const createPipe = () => [3, 4];

const createFrameBuffer = () => ({ id: Math.random() });

const unloadDriver = (name) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const detectVideoCodec = () => "h264";

const backpropagateGradient = (loss) => true;

const protectMemory = (ptr, size, flags) => true;

const bindAddress = (sock, addr, port) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const rotateLogFiles = () => true;

const registerGestureHandler = (gesture) => true;

const closeContext = (ctx) => Promise.resolve();

const mutexUnlock = (mtx) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const generateDocumentation = (ast) => "";

const vertexAttrib3f = (idx, x, y, z) => true;

const hydrateSSR = (html) => true;

const setAngularVelocity = (body, v) => true;

const rollbackTransaction = (tx) => true;

const broadcastMessage = (msg) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const limitRate = (stream, rate) => stream;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setGainValue = (node, val) => node.gain.value = val;

const resolveDNS = (domain) => "127.0.0.1";

const auditAccessLogs = () => true;

const exitScope = (table) => true;

const extractArchive = (archive) => ["file1", "file2"];

const unlinkFile = (path) => true;

const setQValue = (filter, q) => filter.Q = q;

const calculateCRC32 = (data) => "00000000";

const remuxContainer = (container) => ({ container, status: "done" });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const enterScope = (table) => true;

const getOutputTimestamp = (ctx) => Date.now();

const allowSleepMode = () => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const setKnee = (node, val) => node.knee.value = val;

const spoofReferer = () => "https://google.com";

const validatePieceChecksum = (piece) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const serializeFormData = (form) => JSON.stringify(form);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const checkBatteryLevel = () => 100;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const muteStream = () => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const chmodFile = (path, mode) => true;

const getProgramInfoLog = (program) => "";

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const dhcpOffer = (ip) => true;


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

const setDopplerFactor = (val) => true;

const updateWheelTransform = (wheel) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const mutexLock = (mtx) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const subscribeToEvents = (contract) => true;

const updateTransform = (body) => true;

const restartApplication = () => console.log("Restarting...");

const useProgram = (program) => true;

const analyzeBitrate = () => "5000kbps";

const applyImpulse = (body, impulse, point) => true;

// Anti-shake references
const _ref_myi5zu = { dhcpAck };
const _ref_t1ddgq = { addWheel };
const _ref_w1mkvf = { getByteFrequencyData };
const _ref_qelq40 = { createMediaElementSource };
const _ref_hmr29h = { setInertia };
const _ref_hdt1wo = { createDynamicsCompressor };
const _ref_24eaog = { setGravity };
const _ref_3060zk = { setDelayTime };
const _ref_yb12uz = { stepSimulation };
const _ref_tt51oi = { anchorSoftBody };
const _ref_kuz19c = { readPixels };
const _ref_9y0f47 = { uniformMatrix4fv };
const _ref_tayd9b = { createChannelSplitter };
const _ref_ypfot6 = { createChannelMerger };
const _ref_ddkx1a = { setRelease };
const _ref_ach58f = { encryptStream };
const _ref_hh1kko = { createPhysicsWorld };
const _ref_u290bw = { setPosition };
const _ref_l7c8g0 = { loadImpulseResponse };
const _ref_vnznvs = { compileToBytecode };
const _ref_mpum8q = { reportError };
const _ref_jxav26 = { checkTypes };
const _ref_dox6kt = { validateProgram };
const _ref_5row55 = { hoistVariables };
const _ref_bfahtd = { jitCompile };
const _ref_2cxzna = { createAudioContext };
const _ref_5534fb = { checkParticleCollision };
const _ref_40avyn = { optimizeTailCalls };
const _ref_elq7jo = { linkModules };
const _ref_ywhtr9 = { normalizeVolume };
const _ref_wyrk0q = { inferType };
const _ref_stiej7 = { setDistanceModel };
const _ref_is3hli = { resolveImports };
const _ref_87ud4r = { resumeContext };
const _ref_kf7dwn = { serializeAST };
const _ref_ktbmyf = { setThreshold };
const _ref_t4her8 = { instrumentCode };
const _ref_6pzj7k = { reportWarning };
const _ref_ereshg = { defineSymbol };
const _ref_921r00 = { verifyIR };
const _ref_2ug701 = { deleteTexture };
const _ref_yuomxo = { minifyCode };
const _ref_a4k6tm = { profilePerformance };
const _ref_51ibfs = { lookupSymbol };
const _ref_7xr7yo = { resampleAudio };
const _ref_20qdj6 = { interpretBytecode };
const _ref_9h1hln = { updateRoutingTable };
const _ref_7ykms8 = { createDelay };
const _ref_lbecwv = { setSteeringValue };
const _ref_hbo706 = { listenSocket };
const _ref_f762ig = { createVehicle };
const _ref_7z5te0 = { mapMemory };
const _ref_qvj1g5 = { createMediaStreamSource };
const _ref_o7zl8s = { parseClass };
const _ref_1u9yav = { semaphoreSignal };
const _ref_7kdwo5 = { createASTNode };
const _ref_yjevaj = { decompressPacket };
const _ref_h2d7ky = { setPan };
const _ref_2188jj = { openFile };
const _ref_jb1mrl = { analyzeHeader };
const _ref_z30ivs = { rmdir };
const _ref_25smtc = { analyzeControlFlow };
const _ref_7s18vv = { inlineFunctions };
const _ref_xxo5b3 = { parsePayload };
const _ref_srmnf0 = { calculateRestitution };
const _ref_dt1j7s = { measureRTT };
const _ref_0r4zev = { getFloatTimeDomainData };
const _ref_gzz2au = { computeDominators };
const _ref_6k4bt3 = { validateRecaptcha };
const _ref_hibt02 = { renderParticles };
const _ref_zav6e5 = { getMemoryUsage };
const _ref_ex2c88 = { processAudioBuffer };
const _ref_69g6ak = { renameFile };
const _ref_w0pthl = { unchokePeer };
const _ref_mjlxft = { createMagnetURI };
const _ref_une7zf = { tokenizeText };
const _ref_u95fku = { shutdownComputer };
const _ref_o95amp = { resolveCollision };
const _ref_er36x7 = { deleteTempFiles };
const _ref_21hzzt = { enableDHT };
const _ref_nikvf5 = { migrateSchema };
const _ref_1gxhap = { beginTransaction };
const _ref_46i5qg = { mkdir };
const _ref_fu16ih = { switchProxyServer };
const _ref_ec5ao9 = { getFileAttributes };
const _ref_jrpl1q = { decryptStream };
const _ref_b0z173 = { adjustWindowSize };
const _ref_7at4jk = { uploadCrashReport };
const _ref_bv28vq = { decompressGzip };
const _ref_xqkvox = { invalidateCache };
const _ref_h3x6nt = { debounceAction };
const _ref_yrajxd = { calculateEntropy };
const _ref_p029wa = { parseConfigFile };
const _ref_toly4t = { updateBitfield };
const _ref_ghrcc0 = { renderCanvasLayer };
const _ref_zantu2 = { allocateMemory };
const _ref_aw852w = { rayCast };
const _ref_ltuabk = { setOrientation };
const _ref_cjsops = { createAnalyser };
const _ref_mc44o4 = { autoResumeTask };
const _ref_q6px3k = { animateTransition };
const _ref_gtyh0d = { repairCorruptFile };
const _ref_tet4pp = { compressDataStream };
const _ref_h1k187 = { readFile };
const _ref_d6ev96 = { createIndexBuffer };
const _ref_08zmda = { executeSQLQuery };
const _ref_y0y4vk = { commitTransaction };
const _ref_hc15oa = { backupDatabase };
const _ref_n18nct = { playSoundAlert };
const _ref_mcnk1h = { triggerHapticFeedback };
const _ref_h764pq = { loadModelWeights };
const _ref_9m1fxx = { dropTable };
const _ref_h17r0c = { setFrequency };
const _ref_jm361u = { renderVirtualDOM };
const _ref_15vbsq = { scrapeTracker };
const _ref_kfodrw = { mangleNames };
const _ref_e4kw05 = { sanitizeSQLInput };
const _ref_g3xtmb = { showNotification };
const _ref_43qe5k = { syncDatabase };
const _ref_zoc229 = { augmentData };
const _ref_u1sqjb = { drawElements };
const _ref_yf90f4 = { cleanOldLogs };
const _ref_ldimrq = { closeSocket };
const _ref_f5ui33 = { decodeAudioData };
const _ref_obttwb = { clusterKMeans };
const _ref_cva9bi = { scheduleTask };
const _ref_g15yk9 = { calculateFriction };
const _ref_yumgw5 = { createPipe };
const _ref_qt7wc2 = { createFrameBuffer };
const _ref_pui656 = { unloadDriver };
const _ref_25n44h = { readPipe };
const _ref_uz1fba = { applyEngineForce };
const _ref_jd13xv = { detectVideoCodec };
const _ref_5481z2 = { backpropagateGradient };
const _ref_tgls7o = { protectMemory };
const _ref_8tawyx = { bindAddress };
const _ref_a0qjty = { lazyLoadComponent };
const _ref_ye3ev9 = { rotateLogFiles };
const _ref_i2j1jc = { registerGestureHandler };
const _ref_2eo2ys = { closeContext };
const _ref_72woj7 = { mutexUnlock };
const _ref_fveb3c = { saveCheckpoint };
const _ref_xyl9mw = { diffVirtualDOM };
const _ref_mjggyg = { generateDocumentation };
const _ref_em10jw = { vertexAttrib3f };
const _ref_u1w08p = { hydrateSSR };
const _ref_kdd8t7 = { setAngularVelocity };
const _ref_fz0wkl = { rollbackTransaction };
const _ref_xf83lj = { broadcastMessage };
const _ref_a0rvbp = { setDetune };
const _ref_655rkr = { limitRate };
const _ref_qofan6 = { requestAnimationFrameLoop };
const _ref_r8aw05 = { setGainValue };
const _ref_b4e5b0 = { resolveDNS };
const _ref_wu30ke = { auditAccessLogs };
const _ref_fegc0q = { exitScope };
const _ref_kqt997 = { extractArchive };
const _ref_jdyw4v = { unlinkFile };
const _ref_walw7t = { setQValue };
const _ref_3imyeg = { calculateCRC32 };
const _ref_aw2fu2 = { remuxContainer };
const _ref_ii51vu = { validateTokenStructure };
const _ref_xp7z85 = { verifyMagnetLink };
const _ref_n6bd3l = { enterScope };
const _ref_5kj77k = { getOutputTimestamp };
const _ref_ggnvwl = { allowSleepMode };
const _ref_iuwd4r = { transformAesKey };
const _ref_ngxa47 = { generateUserAgent };
const _ref_jdawss = { setKnee };
const _ref_2o5ase = { spoofReferer };
const _ref_3gpq79 = { validatePieceChecksum };
const _ref_ouvt80 = { archiveFiles };
const _ref_b6955z = { serializeFormData };
const _ref_6v1yad = { optimizeMemoryUsage };
const _ref_8jzonh = { checkBatteryLevel };
const _ref_npnojl = { performTLSHandshake };
const _ref_1typqp = { normalizeVector };
const _ref_vyhurn = { checkIntegrity };
const _ref_tg0yx5 = { createPanner };
const _ref_6d1o87 = { parseMagnetLink };
const _ref_j0orxa = { muteStream };
const _ref_8ahwmv = { analyzeUserBehavior };
const _ref_m8eg73 = { chmodFile };
const _ref_xx5y2u = { getProgramInfoLog };
const _ref_a7khim = { getSystemUptime };
const _ref_tlwbjb = { dhcpOffer };
const _ref_4ax8k4 = { ResourceMonitor };
const _ref_4pftnr = { setDopplerFactor };
const _ref_lb8smu = { updateWheelTransform };
const _ref_7f1gn4 = { connectToTracker };
const _ref_x2fiqr = { generateUUIDv5 };
const _ref_x7oief = { mutexLock };
const _ref_22mx3t = { setSocketTimeout };
const _ref_p757nv = { monitorNetworkInterface };
const _ref_eoyhlq = { subscribeToEvents };
const _ref_j5vyxz = { updateTransform };
const _ref_quewpi = { restartApplication };
const _ref_53ua52 = { useProgram };
const _ref_tag1yz = { analyzeBitrate };
const _ref_iutmxz = { applyImpulse }; 
    });
})({}, {});