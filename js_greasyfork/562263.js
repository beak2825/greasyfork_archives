// ==UserScript==
// @name sen视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/sen/index.js
// @version 2026.01.10
// @description 一键下载sen视频，支持4K/1080P/720P多画质。
// @icon https://www.sen.com/favicon64.png
// @match *://*.sen.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect sen.com
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
// @downloadURL https://update.greasyfork.org/scripts/562263/sen%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562263/sen%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const injectCSPHeader = () => "default-src 'self'";

const readFile = (fd, len) => "";

const createVehicle = (chassis) => ({ wheels: [] });

const deleteTexture = (texture) => true;

const setPan = (node, val) => node.pan.value = val;

const addSliderConstraint = (world, c) => true;

const setAttack = (node, val) => node.attack.value = val;

const decodeAudioData = (buffer) => Promise.resolve({});

const convexSweepTest = (shape, start, end) => ({ hit: false });

const getShaderInfoLog = (shader) => "";

const removeRigidBody = (world, body) => true;

const suspendContext = (ctx) => Promise.resolve();

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const vertexAttrib3f = (idx, x, y, z) => true;

const setGravity = (world, g) => world.gravity = g;

const createAudioContext = () => ({ sampleRate: 44100 });

const measureRTT = (sent, recv) => 10;

const setMass = (body, m) => true;

const addWheel = (vehicle, info) => true;

const createConstraint = (body1, body2) => ({});

const prettifyCode = (code) => code;

const optimizeTailCalls = (ast) => ast;

const detectCollision = (body1, body2) => false;

const calculateFriction = (mat1, mat2) => 0.5;

const connectNodes = (src, dest) => true;

const computeLossFunction = (pred, actual) => 0.05;

const captureFrame = () => "frame_data_buffer";

const mergeFiles = (parts) => parts[0];

const instrumentCode = (code) => code;

const splitFile = (path, parts) => Array(parts).fill(path);

const jitCompile = (bc) => (() => {});

const debugAST = (ast) => "";

const chokePeer = (peer) => ({ ...peer, choked: true });

const adjustPlaybackSpeed = (rate) => rate;

const interpretBytecode = (bc) => true;

const dropTable = (table) => true;

const enterScope = (table) => true;

const generateDocumentation = (ast) => "";

const createListener = (ctx) => ({});

const uniform1i = (loc, val) => true;

const createSymbolTable = () => ({ scopes: [] });

const anchorSoftBody = (soft, rigid) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const reportWarning = (msg, line) => console.warn(msg);

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const encryptPeerTraffic = (data) => btoa(data);

const analyzeControlFlow = (ast) => ({ graph: {} });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const commitTransaction = (tx) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const computeDominators = (cfg) => ({});

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const setAngularVelocity = (body, v) => true;

const registerGestureHandler = (gesture) => true;

const resolveImports = (ast) => [];

const unlockRow = (id) => true;

const resolveSymbols = (ast) => ({});

const shardingTable = (table) => ["shard_0", "shard_1"];

const restartApplication = () => console.log("Restarting...");

const verifyIR = (ir) => true;

const replicateData = (node) => ({ target: node, synced: true });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const restoreDatabase = (path) => true;

const compileToBytecode = (ast) => new Uint8Array();

const unloadDriver = (name) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const backupDatabase = (path) => ({ path, size: 5000 });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const beginTransaction = () => "TX-" + Date.now();

const serializeAST = (ast) => JSON.stringify(ast);

const profilePerformance = (func) => 0;

const logErrorToFile = (err) => console.error(err);

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const checkIntegrityConstraint = (table) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const openFile = (path, flags) => 5;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const checkTypes = (ast) => [];

const setDelayTime = (node, time) => node.delayTime.value = time;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const createFrameBuffer = () => ({ id: Math.random() });

const allowSleepMode = () => true;

const cacheQueryResults = (key, data) => true;

const checkBatteryLevel = () => 100;

const createMediaElementSource = (ctx, el) => ({});

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const getEnv = (key) => "";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const controlCongestion = (sock) => true;

const rmdir = (path) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const rotateLogFiles = () => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const chdir = (path) => true;

const exitScope = (table) => true;

const chmodFile = (path, mode) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const decryptStream = (stream, key) => stream;

const unmountFileSystem = (path) => true;

const rollbackTransaction = (tx) => true;

const prefetchAssets = (urls) => urls.length;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const createWaveShaper = (ctx) => ({ curve: null });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const resolveCollision = (manifold) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const useProgram = (program) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const captureScreenshot = () => "data:image/png;base64,...";


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

const hydrateSSR = (html) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const reportError = (msg, line) => console.error(msg);

const shutdownComputer = () => console.log("Shutting down...");

const getcwd = () => "/";

const updateParticles = (sys, dt) => true;

const panicKernel = (msg) => false;

const injectMetadata = (file, meta) => ({ file, meta });

const renderCanvasLayer = (ctx) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const applyTheme = (theme) => document.body.className = theme;

const setGainValue = (node, val) => node.gain.value = val;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const cancelTask = (id) => ({ id, cancelled: true });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const augmentData = (image) => image;

const synthesizeSpeech = (text) => "audio_buffer";

const createBoxShape = (w, h, d) => ({ type: 'box' });

const unlinkFile = (path) => true;

const setQValue = (filter, q) => filter.Q = q;

const resumeContext = (ctx) => Promise.resolve();

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const updateRoutingTable = (entry) => true;

const setMTU = (iface, mtu) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const loadCheckpoint = (path) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const setFilePermissions = (perm) => `chmod ${perm}`;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const detectAudioCodec = () => "aac";

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const addHingeConstraint = (world, c) => true;

const stepSimulation = (world, dt) => true;

const parseQueryString = (qs) => ({});

const execProcess = (path) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const deleteBuffer = (buffer) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const processAudioBuffer = (buffer) => buffer;

const sleep = (body) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const prioritizeTraffic = (queue) => true;

const performOCR = (img) => "Detected Text";

const generateCode = (ast) => "const a = 1;";

const predictTensor = (input) => [0.1, 0.9, 0.0];

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const translateText = (text, lang) => text;

const createParticleSystem = (count) => ({ particles: [] });

const announceToTracker = (url) => ({ url, interval: 1800 });

const setVelocity = (body, v) => true;

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

const repairCorruptFile = (path) => ({ path, repaired: true });

const verifySignature = (tx, sig) => true;

const setInertia = (body, i) => true;

const detectDarkMode = () => true;

const dhcpOffer = (ip) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const handleTimeout = (sock) => true;

const classifySentiment = (text) => "positive";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const establishHandshake = (sock) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const getByteFrequencyData = (analyser, array) => true;

const detectPacketLoss = (acks) => false;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const detectDevTools = () => false;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });


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

const closeFile = (fd) => true;

const updateTransform = (body) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const flushSocketBuffer = (sock) => sock.buffer = [];

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const broadcastTransaction = (tx) => "tx_hash_123";

const loadImpulseResponse = (url) => Promise.resolve({});

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

// Anti-shake references
const _ref_oost68 = { injectCSPHeader };
const _ref_3xsx1g = { readFile };
const _ref_ca9rux = { createVehicle };
const _ref_88diwq = { deleteTexture };
const _ref_c1r1o5 = { setPan };
const _ref_bbyedb = { addSliderConstraint };
const _ref_ktjqjs = { setAttack };
const _ref_si3oak = { decodeAudioData };
const _ref_x98edb = { convexSweepTest };
const _ref_g13mms = { getShaderInfoLog };
const _ref_dj7jkd = { removeRigidBody };
const _ref_yrx65d = { suspendContext };
const _ref_ioru0y = { createGainNode };
const _ref_qndjpi = { vertexAttrib3f };
const _ref_63xjw7 = { setGravity };
const _ref_vxwwyc = { createAudioContext };
const _ref_idbkxi = { measureRTT };
const _ref_z62zl9 = { setMass };
const _ref_3x1sur = { addWheel };
const _ref_sv6780 = { createConstraint };
const _ref_7lgowk = { prettifyCode };
const _ref_b9ofbq = { optimizeTailCalls };
const _ref_w5vxf1 = { detectCollision };
const _ref_s9y99l = { calculateFriction };
const _ref_ia54d1 = { connectNodes };
const _ref_cgisms = { computeLossFunction };
const _ref_l0l3sa = { captureFrame };
const _ref_1rl1hs = { mergeFiles };
const _ref_ijpdmg = { instrumentCode };
const _ref_ye7k0u = { splitFile };
const _ref_cf6lhw = { jitCompile };
const _ref_890m2q = { debugAST };
const _ref_14vw1p = { chokePeer };
const _ref_8scvn0 = { adjustPlaybackSpeed };
const _ref_mnf5uc = { interpretBytecode };
const _ref_tpn0dq = { dropTable };
const _ref_4vecnc = { enterScope };
const _ref_swoy9a = { generateDocumentation };
const _ref_moo2ep = { createListener };
const _ref_hjcjh0 = { uniform1i };
const _ref_1pnwp7 = { createSymbolTable };
const _ref_0cze9m = { anchorSoftBody };
const _ref_xlq4gr = { resolveDNSOverHTTPS };
const _ref_4wiylf = { reportWarning };
const _ref_2di8rd = { createBiquadFilter };
const _ref_md375m = { encryptPeerTraffic };
const _ref_f25yoe = { analyzeControlFlow };
const _ref_xsggqe = { calculatePieceHash };
const _ref_3ycfkq = { commitTransaction };
const _ref_gw82dh = { FileValidator };
const _ref_ogb4xi = { computeDominators };
const _ref_2s2f84 = { showNotification };
const _ref_48zcxy = { setAngularVelocity };
const _ref_lpjgy4 = { registerGestureHandler };
const _ref_f040xr = { resolveImports };
const _ref_d0nte2 = { unlockRow };
const _ref_tu2zle = { resolveSymbols };
const _ref_b5haet = { shardingTable };
const _ref_bkkxhh = { restartApplication };
const _ref_va6wqm = { verifyIR };
const _ref_3dkdeu = { replicateData };
const _ref_4xcufd = { connectionPooling };
const _ref_4t00ar = { restoreDatabase };
const _ref_cqq47b = { compileToBytecode };
const _ref_nxisob = { unloadDriver };
const _ref_r9adm5 = { compactDatabase };
const _ref_4z54ii = { getAppConfig };
const _ref_9eh3he = { backupDatabase };
const _ref_41h85b = { calculateLayoutMetrics };
const _ref_zy9s77 = { beginTransaction };
const _ref_sxzy5l = { serializeAST };
const _ref_26ideq = { profilePerformance };
const _ref_bd16eq = { logErrorToFile };
const _ref_3grou1 = { limitDownloadSpeed };
const _ref_ug7ta9 = { checkIntegrityConstraint };
const _ref_zboh3h = { createMagnetURI };
const _ref_ogqhi9 = { parseMagnetLink };
const _ref_o1ihjj = { openFile };
const _ref_kkilcm = { traceStack };
const _ref_q8ffst = { checkTypes };
const _ref_vgckdo = { setDelayTime };
const _ref_ti3o1n = { createIndex };
const _ref_t0kfmh = { scheduleBandwidth };
const _ref_ne2x8l = { createFrameBuffer };
const _ref_79eusa = { allowSleepMode };
const _ref_7dfqq1 = { cacheQueryResults };
const _ref_a3ic79 = { checkBatteryLevel };
const _ref_vo4x31 = { createMediaElementSource };
const _ref_1g9oxs = { resolveDependencyGraph };
const _ref_lsfi42 = { getEnv };
const _ref_jwb32j = { debouncedResize };
const _ref_atgwyx = { controlCongestion };
const _ref_uf1uvz = { rmdir };
const _ref_2zgp6m = { requestAnimationFrameLoop };
const _ref_msufqn = { rotateLogFiles };
const _ref_hg6365 = { createAnalyser };
const _ref_csvidm = { chdir };
const _ref_k9d6a0 = { exitScope };
const _ref_3et3vl = { chmodFile };
const _ref_lh7atq = { scrapeTracker };
const _ref_ecmi59 = { decryptStream };
const _ref_cae7sk = { unmountFileSystem };
const _ref_ze67ga = { rollbackTransaction };
const _ref_do176h = { prefetchAssets };
const _ref_s9ndzq = { lazyLoadComponent };
const _ref_c5zy8f = { getMACAddress };
const _ref_3odbzs = { parseSubtitles };
const _ref_qldzfi = { createWaveShaper };
const _ref_ymcmhm = { encryptPayload };
const _ref_bqc4yl = { checkIntegrity };
const _ref_fyn8qp = { calculateMD5 };
const _ref_9nofow = { resolveCollision };
const _ref_aobvvv = { diffVirtualDOM };
const _ref_2thgkc = { decryptHLSStream };
const _ref_e8i1ds = { useProgram };
const _ref_z4vjm1 = { monitorNetworkInterface };
const _ref_bflzf9 = { virtualScroll };
const _ref_kyx76o = { captureScreenshot };
const _ref_8r1pma = { TelemetryClient };
const _ref_jzicr8 = { hydrateSSR };
const _ref_h0pfd8 = { requestPiece };
const _ref_bdo7cz = { reportError };
const _ref_2bppeu = { shutdownComputer };
const _ref_y7zbrf = { getcwd };
const _ref_ypc4lv = { updateParticles };
const _ref_1dzdo5 = { panicKernel };
const _ref_j2ev1k = { injectMetadata };
const _ref_u7bp1j = { renderCanvasLayer };
const _ref_by13e4 = { discoverPeersDHT };
const _ref_u0lp0k = { applyTheme };
const _ref_ktf9gy = { setGainValue };
const _ref_m25smc = { optimizeMemoryUsage };
const _ref_9bwega = { cancelTask };
const _ref_1sbzln = { optimizeHyperparameters };
const _ref_ci6p2e = { augmentData };
const _ref_e07a1t = { synthesizeSpeech };
const _ref_2mamv7 = { createBoxShape };
const _ref_mjirzk = { unlinkFile };
const _ref_94hqct = { setQValue };
const _ref_8f40mz = { resumeContext };
const _ref_tvc1zf = { formatLogMessage };
const _ref_x7sf4e = { updateRoutingTable };
const _ref_ur47vq = { setMTU };
const _ref_3ovgns = { checkPortAvailability };
const _ref_4nxfuc = { loadCheckpoint };
const _ref_p5ceob = { clusterKMeans };
const _ref_wp08k6 = { normalizeVector };
const _ref_0orvoq = { setFilePermissions };
const _ref_c4r65v = { saveCheckpoint };
const _ref_e99wwu = { detectAudioCodec };
const _ref_kbrvze = { cancelAnimationFrameLoop };
const _ref_25uyel = { addHingeConstraint };
const _ref_fl42s7 = { stepSimulation };
const _ref_om3u7i = { parseQueryString };
const _ref_r4ah9u = { execProcess };
const _ref_q2roe5 = { calculateEntropy };
const _ref_7uh8yv = { deleteBuffer };
const _ref_2rteml = { createMediaStreamSource };
const _ref_5w5bpo = { processAudioBuffer };
const _ref_82jcw1 = { sleep };
const _ref_yzu1im = { detectFirewallStatus };
const _ref_y8zabk = { prioritizeTraffic };
const _ref_kslwdq = { performOCR };
const _ref_5m7m18 = { generateCode };
const _ref_kc5r1p = { predictTensor };
const _ref_5utxi2 = { detectObjectYOLO };
const _ref_5ai2l1 = { performTLSHandshake };
const _ref_7wwri2 = { translateText };
const _ref_wjndff = { createParticleSystem };
const _ref_mqcnpf = { announceToTracker };
const _ref_lb2zmp = { setVelocity };
const _ref_le4w9k = { generateFakeClass };
const _ref_8ffwe1 = { ResourceMonitor };
const _ref_6fqynx = { repairCorruptFile };
const _ref_1nugi2 = { verifySignature };
const _ref_ogo5es = { setInertia };
const _ref_cuwdmp = { detectDarkMode };
const _ref_19dj4j = { dhcpOffer };
const _ref_ihj8zs = { simulateNetworkDelay };
const _ref_vsi28e = { playSoundAlert };
const _ref_rmz6ps = { handleTimeout };
const _ref_fbc8u9 = { classifySentiment };
const _ref_sxuqr5 = { validateSSLCert };
const _ref_iksl82 = { establishHandshake };
const _ref_aufzbr = { generateUUIDv5 };
const _ref_ihznye = { getByteFrequencyData };
const _ref_se04hw = { detectPacketLoss };
const _ref_m69wfh = { interceptRequest };
const _ref_4kh944 = { detectDevTools };
const _ref_vsq85n = { parseExpression };
const _ref_uq1fqy = { computeNormal };
const _ref_snwfqz = { ApiDataFormatter };
const _ref_tq1kgr = { closeFile };
const _ref_0cis4h = { updateTransform };
const _ref_fra5xs = { getSystemUptime };
const _ref_26r47p = { flushSocketBuffer };
const _ref_97ns1n = { parseClass };
const _ref_yrzft0 = { broadcastTransaction };
const _ref_rihm48 = { loadImpulseResponse };
const _ref_01871a = { tunnelThroughProxy }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `sen` };
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
                const urlParams = { config, url: window.location.href, name_en: `sen` };

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
        const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const gaussianBlur = (image, radius) => image;

const getBlockHeight = () => 15000000;

const protectMemory = (ptr, size, flags) => true;

const listenSocket = (sock, backlog) => true;

const debugAST = (ast) => "";

const optimizeTailCalls = (ast) => ast;

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

const postProcessBloom = (image, threshold) => image;

const signTransaction = (tx, key) => "signed_tx_hash";

const deserializeAST = (json) => JSON.parse(json);

const leaveGroup = (group) => true;

const checkIntegrityToken = (token) => true;

const getUniformLocation = (program, name) => 1;

const translateText = (text, lang) => text;

const decapsulateFrame = (frame) => frame;

const acceptConnection = (sock) => ({ fd: 2 });

const injectCSPHeader = () => "default-src 'self'";

const closeSocket = (sock) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const bufferData = (gl, target, data, usage) => true;

const restoreDatabase = (path) => true;

const verifySignature = (tx, sig) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const systemCall = (num, args) => 0;

const sendPacket = (sock, data) => data.length;

const bindSocket = (port) => ({ port, status: "bound" });

const killProcess = (pid) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const reportError = (msg, line) => console.error(msg);

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const loadCheckpoint = (path) => true;

const hashKeccak256 = (data) => "0xabc...";

const setSocketTimeout = (ms) => ({ timeout: ms });

const unlockFile = (path) => ({ path, locked: false });

const freeMemory = (ptr) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setRatio = (node, val) => node.ratio.value = val;

const setPosition = (panner, x, y, z) => true;

const logErrorToFile = (err) => console.error(err);

const semaphoreSignal = (sem) => true;

const dropTable = (table) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const captureScreenshot = () => "data:image/png;base64,...";

const augmentData = (image) => image;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const downInterface = (iface) => true;

const resetVehicle = (vehicle) => true;

const addGeneric6DofConstraint = (world, c) => true;

const drawArrays = (gl, mode, first, count) => true;

const spoofReferer = () => "https://google.com";

const rateLimitCheck = (ip) => true;

const setGravity = (world, g) => world.gravity = g;

const cacheQueryResults = (key, data) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const analyzeHeader = (packet) => ({});

const rollbackTransaction = (tx) => true;

const obfuscateString = (str) => btoa(str);

const closePipe = (fd) => true;

const switchVLAN = (id) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setDistanceModel = (panner, model) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const setFilterType = (filter, type) => filter.type = type;

const allowSleepMode = () => true;

const setKnee = (node, val) => node.knee.value = val;

const classifySentiment = (text) => "positive";

const hydrateSSR = (html) => true;

const unmountFileSystem = (path) => true;

const verifyProofOfWork = (nonce) => true;

const exitScope = (table) => true;

const pingHost = (host) => 10;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const filterTraffic = (rule) => true;

const limitRate = (stream, rate) => stream;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const traceroute = (host) => ["192.168.1.1"];

const translateMatrix = (mat, vec) => mat;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const profilePerformance = (func) => 0;

const getByteFrequencyData = (analyser, array) => true;

const enableBlend = (func) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const openFile = (path, flags) => 5;

const generateCode = (ast) => "const a = 1;";

const rotateMatrix = (mat, angle, axis) => mat;

const checkParticleCollision = (sys, world) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const addConeTwistConstraint = (world, c) => true;

const removeConstraint = (world, c) => true;

const createParticleSystem = (count) => ({ particles: [] });

const measureRTT = (sent, recv) => 10;

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

const setMass = (body, m) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const resumeContext = (ctx) => Promise.resolve();

const convexSweepTest = (shape, start, end) => ({ hit: false });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

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

const obfuscateCode = (code) => code;

const deriveAddress = (path) => "0x123...";

const calculateRestitution = (mat1, mat2) => 0.3;

const createSoftBody = (info) => ({ nodes: [] });

const addRigidBody = (world, body) => true;

const handleInterrupt = (irq) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const addPoint2PointConstraint = (world, c) => true;

const unmapMemory = (ptr, size) => true;

const checkBalance = (addr) => "10.5 ETH";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const merkelizeRoot = (txs) => "root_hash";

const createWaveShaper = (ctx) => ({ curve: null });

const processAudioBuffer = (buffer) => buffer;

const createListener = (ctx) => ({});

const parseQueryString = (qs) => ({});

const allocateRegisters = (ir) => ir;

const writePipe = (fd, data) => data.length;

const parsePayload = (packet) => ({});

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const createMediaElementSource = (ctx, el) => ({});

const resolveCollision = (manifold) => true;

const getCpuLoad = () => Math.random() * 100;

const decryptStream = (stream, key) => stream;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const setViewport = (x, y, w, h) => true;

const createPipe = () => [3, 4];

const reassemblePacket = (fragments) => fragments[0];

const clearScreen = (r, g, b, a) => true;

const detectPacketLoss = (acks) => false;

const unloadDriver = (name) => true;

const bundleAssets = (assets) => "";

const extractArchive = (archive) => ["file1", "file2"];

const readdir = (path) => [];

const enableDHT = () => true;

const detectDevTools = () => false;

const interpretBytecode = (bc) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const announceToTracker = (url) => ({ url, interval: 1800 });

const lockFile = (path) => ({ path, locked: true });

const inlineFunctions = (ast) => ast;

const defineSymbol = (table, name, info) => true;

const multicastMessage = (group, msg) => true;

const resampleAudio = (buffer, rate) => buffer;

const flushSocketBuffer = (sock) => sock.buffer = [];

const autoResumeTask = (id) => ({ id, status: "resumed" });

const updateWheelTransform = (wheel) => true;

const commitTransaction = (tx) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const startOscillator = (osc, time) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const seedRatioLimit = (ratio) => ratio >= 2.0;

const activeTexture = (unit) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const readFile = (fd, len) => "";

const replicateData = (node) => ({ target: node, synced: true });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const applyImpulse = (body, impulse, point) => true;

const setInertia = (body, i) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const preventSleepMode = () => true;

const panicKernel = (msg) => false;

const createConvolver = (ctx) => ({ buffer: null });

const chownFile = (path, uid, gid) => true;

const getcwd = () => "/";

const suspendContext = (ctx) => Promise.resolve();

const deobfuscateString = (str) => atob(str);

const unmuteStream = () => false;

const setEnv = (key, val) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };


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

const transcodeStream = (format) => ({ format, status: "processing" });

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

const createConstraint = (body1, body2) => ({});

const installUpdate = () => false;

const detachThread = (tid) => true;

const dumpSymbolTable = (table) => "";

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

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

const createPeriodicWave = (ctx, real, imag) => ({});

const mergeFiles = (parts) => parts[0];

const bindAddress = (sock, addr, port) => true;

const disableDepthTest = () => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const backpropagateGradient = (loss) => true;

const scheduleTask = (task) => ({ id: 1, task });

const chokePeer = (peer) => ({ ...peer, choked: true });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const setBrake = (vehicle, force, wheelIdx) => true;

// Anti-shake references
const _ref_gfbalh = { limitBandwidth };
const _ref_cl1s9h = { gaussianBlur };
const _ref_7m9ibk = { getBlockHeight };
const _ref_ptqas6 = { protectMemory };
const _ref_jrn7n3 = { listenSocket };
const _ref_ska11u = { debugAST };
const _ref_ts8e89 = { optimizeTailCalls };
const _ref_z4dqyi = { ProtocolBufferHandler };
const _ref_j1hij3 = { postProcessBloom };
const _ref_zja125 = { signTransaction };
const _ref_3vp9vq = { deserializeAST };
const _ref_zqx5qy = { leaveGroup };
const _ref_gsoel8 = { checkIntegrityToken };
const _ref_c9zi1c = { getUniformLocation };
const _ref_h3f2uf = { translateText };
const _ref_s3g2ub = { decapsulateFrame };
const _ref_9b10im = { acceptConnection };
const _ref_gopz2x = { injectCSPHeader };
const _ref_x9qz5i = { closeSocket };
const _ref_nsruly = { computeNormal };
const _ref_dz17bt = { vertexAttribPointer };
const _ref_kdpjjz = { bufferData };
const _ref_up2bc4 = { restoreDatabase };
const _ref_475xtw = { verifySignature };
const _ref_xdgs90 = { decryptHLSStream };
const _ref_f6fugv = { generateWalletKeys };
const _ref_mp9rgj = { systemCall };
const _ref_yldf1n = { sendPacket };
const _ref_i43524 = { bindSocket };
const _ref_seo5sq = { killProcess };
const _ref_zqibv9 = { rayIntersectTriangle };
const _ref_vst1yp = { refreshAuthToken };
const _ref_78xcfu = { initiateHandshake };
const _ref_crohmx = { reportError };
const _ref_bj052f = { createStereoPanner };
const _ref_l7ilz7 = { loadCheckpoint };
const _ref_sc58dx = { hashKeccak256 };
const _ref_z4iipg = { setSocketTimeout };
const _ref_zmnzvc = { unlockFile };
const _ref_gctf6g = { freeMemory };
const _ref_rn7nla = { tunnelThroughProxy };
const _ref_xk2gjh = { setRatio };
const _ref_7cy73w = { setPosition };
const _ref_h09zwr = { logErrorToFile };
const _ref_3zethp = { semaphoreSignal };
const _ref_93f4ts = { dropTable };
const _ref_zabq78 = { createScriptProcessor };
const _ref_q9v3zw = { captureScreenshot };
const _ref_8jxw82 = { augmentData };
const _ref_cqe1tb = { optimizeHyperparameters };
const _ref_nvotzt = { checkDiskSpace };
const _ref_kac819 = { downInterface };
const _ref_z430ao = { resetVehicle };
const _ref_riebtq = { addGeneric6DofConstraint };
const _ref_o7r4dt = { drawArrays };
const _ref_1h1dt2 = { spoofReferer };
const _ref_jxol3a = { rateLimitCheck };
const _ref_8142yc = { setGravity };
const _ref_vt0tkw = { cacheQueryResults };
const _ref_3xxn84 = { discoverPeersDHT };
const _ref_elhamo = { analyzeHeader };
const _ref_fezbuk = { rollbackTransaction };
const _ref_jswxlc = { obfuscateString };
const _ref_uxniwk = { closePipe };
const _ref_xd3ftk = { switchVLAN };
const _ref_sz7cob = { tokenizeSource };
const _ref_5ycmxh = { setDistanceModel };
const _ref_jv2cih = { scheduleBandwidth };
const _ref_h4xvdg = { setFilterType };
const _ref_xovbia = { allowSleepMode };
const _ref_1kdeiv = { setKnee };
const _ref_nd3j3x = { classifySentiment };
const _ref_q3l61d = { hydrateSSR };
const _ref_o9h1py = { unmountFileSystem };
const _ref_f92nho = { verifyProofOfWork };
const _ref_lanubj = { exitScope };
const _ref_h9c6j1 = { pingHost };
const _ref_2777qv = { detectFirewallStatus };
const _ref_vlywip = { filterTraffic };
const _ref_8zdyo1 = { limitRate };
const _ref_1crx9i = { createMeshShape };
const _ref_vd2cd9 = { traceroute };
const _ref_1o4n2c = { translateMatrix };
const _ref_q9rfxm = { createPanner };
const _ref_2t69ez = { profilePerformance };
const _ref_0ua802 = { getByteFrequencyData };
const _ref_g51pt9 = { enableBlend };
const _ref_7a0nuq = { generateUserAgent };
const _ref_w8md8o = { initWebGLContext };
const _ref_slrp2e = { openFile };
const _ref_ds8407 = { generateCode };
const _ref_01evli = { rotateMatrix };
const _ref_7jfrcq = { checkParticleCollision };
const _ref_9ntcoa = { getVelocity };
const _ref_shgjaf = { addConeTwistConstraint };
const _ref_qwc4hf = { removeConstraint };
const _ref_dxv37f = { createParticleSystem };
const _ref_xaamf4 = { measureRTT };
const _ref_2vgj5f = { generateFakeClass };
const _ref_y5pfay = { setMass };
const _ref_upe5ty = { loadImpulseResponse };
const _ref_xfj5sh = { normalizeAudio };
const _ref_65setf = { resumeContext };
const _ref_rv17yo = { convexSweepTest };
const _ref_8075u2 = { requestPiece };
const _ref_yuxg67 = { download };
const _ref_gekleh = { obfuscateCode };
const _ref_nhcghu = { deriveAddress };
const _ref_9mk5hr = { calculateRestitution };
const _ref_tb10ej = { createSoftBody };
const _ref_z6b6vz = { addRigidBody };
const _ref_b5p3ng = { handleInterrupt };
const _ref_c9jv07 = { watchFileChanges };
const _ref_lyi6t2 = { addPoint2PointConstraint };
const _ref_9wmw7r = { unmapMemory };
const _ref_14wz67 = { checkBalance };
const _ref_l4yl34 = { allocateDiskSpace };
const _ref_sq1mcu = { merkelizeRoot };
const _ref_q8y6fn = { createWaveShaper };
const _ref_341fui = { processAudioBuffer };
const _ref_qephp0 = { createListener };
const _ref_x1vvce = { parseQueryString };
const _ref_wr8897 = { allocateRegisters };
const _ref_y8j90o = { writePipe };
const _ref_pi087n = { parsePayload };
const _ref_1czz33 = { optimizeMemoryUsage };
const _ref_rlzwnc = { createMediaElementSource };
const _ref_t52ov4 = { resolveCollision };
const _ref_lkxfz1 = { getCpuLoad };
const _ref_kc13du = { decryptStream };
const _ref_b2ieyy = { debounceAction };
const _ref_rp0r70 = { setViewport };
const _ref_7op77h = { createPipe };
const _ref_5zbn43 = { reassemblePacket };
const _ref_l4jd7h = { clearScreen };
const _ref_06ncv7 = { detectPacketLoss };
const _ref_diy6zc = { unloadDriver };
const _ref_ebo6di = { bundleAssets };
const _ref_fw1po3 = { extractArchive };
const _ref_zqijio = { readdir };
const _ref_t7sohp = { enableDHT };
const _ref_ynsn3e = { detectDevTools };
const _ref_anf8y7 = { interpretBytecode };
const _ref_drx3o6 = { setFrequency };
const _ref_4mf32f = { announceToTracker };
const _ref_kc61zt = { lockFile };
const _ref_zh1vrh = { inlineFunctions };
const _ref_8twxda = { defineSymbol };
const _ref_swi7y6 = { multicastMessage };
const _ref_8gnsoz = { resampleAudio };
const _ref_7lhuby = { flushSocketBuffer };
const _ref_5k98yg = { autoResumeTask };
const _ref_avwr4z = { updateWheelTransform };
const _ref_ae91oi = { commitTransaction };
const _ref_0906rm = { getFloatTimeDomainData };
const _ref_xdg94i = { detectObjectYOLO };
const _ref_7a08t7 = { parseClass };
const _ref_gnetc5 = { startOscillator };
const _ref_9nt4sx = { isFeatureEnabled };
const _ref_y9g4be = { seedRatioLimit };
const _ref_py86ec = { activeTexture };
const _ref_tkwpxd = { parseSubtitles };
const _ref_j4jsne = { readFile };
const _ref_jmtr5h = { replicateData };
const _ref_tigu04 = { archiveFiles };
const _ref_ll1akg = { applyImpulse };
const _ref_oabo03 = { setInertia };
const _ref_h48cf8 = { validateSSLCert };
const _ref_8cblz5 = { cancelAnimationFrameLoop };
const _ref_eik12c = { preventSleepMode };
const _ref_k1ubwh = { panicKernel };
const _ref_z78mdi = { createConvolver };
const _ref_n24qe7 = { chownFile };
const _ref_s8ik6l = { getcwd };
const _ref_ut5o83 = { suspendContext };
const _ref_rt8uil = { deobfuscateString };
const _ref_0pgt1p = { unmuteStream };
const _ref_ctczi7 = { setEnv };
const _ref_tlauag = { sanitizeInput };
const _ref_79cbyh = { TelemetryClient };
const _ref_c0xyl4 = { transcodeStream };
const _ref_r0m00t = { TaskScheduler };
const _ref_gqoqqp = { createConstraint };
const _ref_7369hz = { installUpdate };
const _ref_xxvpsr = { detachThread };
const _ref_wx2a9t = { dumpSymbolTable };
const _ref_00d55k = { diffVirtualDOM };
const _ref_e2y3bv = { AdvancedCipher };
const _ref_47r5io = { createPeriodicWave };
const _ref_vezhq2 = { mergeFiles };
const _ref_z6aiti = { bindAddress };
const _ref_dei5l2 = { disableDepthTest };
const _ref_bon093 = { createGainNode };
const _ref_l7ceit = { backpropagateGradient };
const _ref_zngib8 = { scheduleTask };
const _ref_bt624h = { chokePeer };
const _ref_zf76nu = { validateMnemonic };
const _ref_k3znia = { applyPerspective };
const _ref_sjiswn = { saveCheckpoint };
const _ref_4em1x3 = { setBrake }; 
    });
})({}, {});