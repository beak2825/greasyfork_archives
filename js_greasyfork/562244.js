// ==UserScript==
// @name CSpan视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/CSpan/index.js
// @version 2026.01.10
// @description 一键下载CSpan视频，支持4K/1080P/720P多画质。
// @icon https://static.c-spanvideo.org/favicon-new-blue.ico
// @match *://*.c-span.org/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect c-span.org
// @connect c-spanvideo.org
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
// @downloadURL https://update.greasyfork.org/scripts/562244/CSpan%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562244/CSpan%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const installUpdate = () => false;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const addConeTwistConstraint = (world, c) => true;

const createChannelSplitter = (ctx, channels) => ({});

const leaveGroup = (group) => true;

const compileVertexShader = (source) => ({ compiled: true });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const vertexAttrib3f = (idx, x, y, z) => true;

const foldConstants = (ast) => ast;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const processAudioBuffer = (buffer) => buffer;

const emitParticles = (sys, count) => true;

const attachRenderBuffer = (fb, rb) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const anchorSoftBody = (soft, rigid) => true;

const deleteBuffer = (buffer) => true;

const addSliderConstraint = (world, c) => true;

const pingHost = (host) => 10;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const merkelizeRoot = (txs) => "root_hash";

const createListener = (ctx) => ({});

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const measureRTT = (sent, recv) => 10;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const setKnee = (node, val) => node.knee.value = val;

const limitRate = (stream, rate) => stream;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const cullFace = (mode) => true;

const checkIntegrityConstraint = (table) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const blockMaliciousTraffic = (ip) => true;

const getShaderInfoLog = (shader) => "";

const calculateCRC32 = (data) => "00000000";

const splitFile = (path, parts) => Array(parts).fill(path);

const muteStream = () => true;

const swapTokens = (pair, amount) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const filterTraffic = (rule) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const calculateComplexity = (ast) => 1;

const generateDocumentation = (ast) => "";

const setViewport = (x, y, w, h) => true;

const disableRightClick = () => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const updateTransform = (body) => true;

const addWheel = (vehicle, info) => true;

const decompressPacket = (data) => data;

const interpretBytecode = (bc) => true;

const commitTransaction = (tx) => true;

const disablePEX = () => false;

const deobfuscateString = (str) => atob(str);


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

const validatePieceChecksum = (piece) => true;

const validateIPWhitelist = (ip) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const analyzeControlFlow = (ast) => ({ graph: {} });

const decryptStream = (stream, key) => stream;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const jitCompile = (bc) => (() => {});

const uniform3f = (loc, x, y, z) => true;

const eliminateDeadCode = (ast) => ast;

const decompressGzip = (data) => data;

const validateProgram = (program) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
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

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const addRigidBody = (world, body) => true;

const addGeneric6DofConstraint = (world, c) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const receivePacket = (sock, len) => new Uint8Array(len);

const resolveDNS = (domain) => "127.0.0.1";

const detectDevTools = () => false;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const registerGestureHandler = (gesture) => true;

const deserializeAST = (json) => JSON.parse(json);

const checkParticleCollision = (sys, world) => true;

const multicastMessage = (group, msg) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const setRelease = (node, val) => node.release.value = val;

const setDopplerFactor = (val) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const exitScope = (table) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const createSoftBody = (info) => ({ nodes: [] });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setRatio = (node, val) => node.ratio.value = val;

const retransmitPacket = (seq) => true;

const listenSocket = (sock, backlog) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const createASTNode = (type, val) => ({ type, val });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const hoistVariables = (ast) => ast;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const rotateLogFiles = () => true;

const broadcastMessage = (msg) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const findLoops = (cfg) => [];

const createChannelMerger = (ctx, channels) => ({});


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const resolveSymbols = (ast) => ({});

const detectVirtualMachine = () => false;

const cacheQueryResults = (key, data) => true;

const cleanOldLogs = (days) => days;

const createWaveShaper = (ctx) => ({ curve: null });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const lockRow = (id) => true;

const rollbackTransaction = (tx) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const resolveImports = (ast) => [];

const scaleMatrix = (mat, vec) => mat;

const createVehicle = (chassis) => ({ wheels: [] });

const compressGzip = (data) => data;

const translateMatrix = (mat, vec) => mat;

const sendPacket = (sock, data) => data.length;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const setFilterType = (filter, type) => filter.type = type;

const setAttack = (node, val) => node.attack.value = val;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const semaphoreWait = (sem) => true;

const setInertia = (body, i) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const stepSimulation = (world, dt) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const stopOscillator = (osc, time) => true;

const unlockRow = (id) => true;

const hashKeccak256 = (data) => "0xabc...";

const compileToBytecode = (ast) => new Uint8Array();

const detectPacketLoss = (acks) => false;

const resetVehicle = (vehicle) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
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

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createConstraint = (body1, body2) => ({});

const optimizeTailCalls = (ast) => ast;

const readFile = (fd, len) => "";

const openFile = (path, flags) => 5;

const fingerprintBrowser = () => "fp_hash_123";

const getVehicleSpeed = (vehicle) => 0;

const verifyIR = (ir) => true;

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

const deleteProgram = (program) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const parsePayload = (packet) => ({});

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const optimizeAST = (ast) => ast;

const traceroute = (host) => ["192.168.1.1"];

const mkdir = (path) => true;

const negotiateProtocol = () => "HTTP/2.0";

const auditAccessLogs = () => true;

const cancelTask = (id) => ({ id, cancelled: true });

const applyForce = (body, force, point) => true;

const normalizeVolume = (buffer) => buffer;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const logErrorToFile = (err) => console.error(err);

const reassemblePacket = (fragments) => fragments[0];

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const renderCanvasLayer = (ctx) => true;

const suspendContext = (ctx) => Promise.resolve();

const analyzeBitrate = () => "5000kbps";

const linkModules = (modules) => ({});

const checkRootAccess = () => false;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const getUniformLocation = (program, name) => 1;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const getMediaDuration = () => 3600;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const backupDatabase = (path) => ({ path, size: 5000 });

const mountFileSystem = (dev, path) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const injectMetadata = (file, meta) => ({ file, meta });

const debugAST = (ast) => "";

const validateFormInput = (input) => input.length > 0;

const rebootSystem = () => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

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

const normalizeFeatures = (data) => data.map(x => x / 255);

const renderShadowMap = (scene, light) => ({ texture: {} });

const checkBalance = (addr) => "10.5 ETH";

const hydrateSSR = (html) => true;

const enableBlend = (func) => true;

const writeFile = (fd, data) => true;

const scheduleProcess = (pid) => true;

// Anti-shake references
const _ref_vj5fi2 = { installUpdate };
const _ref_0wgayk = { createBoxShape };
const _ref_p7z5vq = { addConeTwistConstraint };
const _ref_okjpe0 = { createChannelSplitter };
const _ref_cdik2s = { leaveGroup };
const _ref_midttu = { compileVertexShader };
const _ref_33byq1 = { createGainNode };
const _ref_ujh9fb = { vertexAttrib3f };
const _ref_g7gi09 = { foldConstants };
const _ref_t1xzd4 = { createBiquadFilter };
const _ref_5vbj0b = { processAudioBuffer };
const _ref_pogeke = { emitParticles };
const _ref_ueq08q = { attachRenderBuffer };
const _ref_z0g1y3 = { createFrameBuffer };
const _ref_wvpeev = { anchorSoftBody };
const _ref_4p2vzj = { deleteBuffer };
const _ref_p7nsum = { addSliderConstraint };
const _ref_4sskbb = { pingHost };
const _ref_9cy6hs = { parseStatement };
const _ref_5euj2j = { merkelizeRoot };
const _ref_4s0chg = { createListener };
const _ref_6blqq8 = { optimizeHyperparameters };
const _ref_adlsyp = { convexSweepTest };
const _ref_l2hphw = { animateTransition };
const _ref_wjzekg = { measureRTT };
const _ref_a8gimr = { generateWalletKeys };
const _ref_3x0r2p = { setKnee };
const _ref_gcdhoa = { limitRate };
const _ref_hrbzce = { scheduleBandwidth };
const _ref_fsro2w = { cullFace };
const _ref_rpb7k1 = { checkIntegrityConstraint };
const _ref_msojmq = { getSystemUptime };
const _ref_2spupp = { blockMaliciousTraffic };
const _ref_gg4ka6 = { getShaderInfoLog };
const _ref_w4eogf = { calculateCRC32 };
const _ref_41giqb = { splitFile };
const _ref_9soxos = { muteStream };
const _ref_wuzjcd = { swapTokens };
const _ref_ecxbyo = { parseFunction };
const _ref_a9dsaj = { filterTraffic };
const _ref_f86ec7 = { compileFragmentShader };
const _ref_zocqcg = { calculateComplexity };
const _ref_9chx17 = { generateDocumentation };
const _ref_cl302c = { setViewport };
const _ref_aabb5v = { disableRightClick };
const _ref_tiniv1 = { extractThumbnail };
const _ref_4bdfu4 = { analyzeQueryPlan };
const _ref_318pa3 = { updateTransform };
const _ref_nn2v6a = { addWheel };
const _ref_d96z3s = { decompressPacket };
const _ref_4xc8e0 = { interpretBytecode };
const _ref_1j10xh = { commitTransaction };
const _ref_cncrhq = { disablePEX };
const _ref_waeyh8 = { deobfuscateString };
const _ref_cw9yml = { ApiDataFormatter };
const _ref_v8lfbs = { validatePieceChecksum };
const _ref_c49svk = { validateIPWhitelist };
const _ref_lhs2o3 = { createAudioContext };
const _ref_nroi95 = { createIndexBuffer };
const _ref_g029ap = { analyzeControlFlow };
const _ref_mdr995 = { decryptStream };
const _ref_brh6yg = { verifyMagnetLink };
const _ref_e7h6ru = { executeSQLQuery };
const _ref_duy5zr = { jitCompile };
const _ref_gc9oza = { uniform3f };
const _ref_608qj9 = { eliminateDeadCode };
const _ref_ilyg9k = { decompressGzip };
const _ref_x1seei = { validateProgram };
const _ref_nz2bip = { signTransaction };
const _ref_6lumrd = { optimizeConnectionPool };
const _ref_0o62tt = { calculateEntropy };
const _ref_czrffl = { handshakePeer };
const _ref_0qx5mh = { addRigidBody };
const _ref_9ugnjv = { addGeneric6DofConstraint };
const _ref_4epjv1 = { validateMnemonic };
const _ref_yre4qd = { uploadCrashReport };
const _ref_ex2cjm = { receivePacket };
const _ref_7z4uuc = { resolveDNS };
const _ref_p7akzr = { detectDevTools };
const _ref_8r8g4n = { rayIntersectTriangle };
const _ref_66d4rm = { registerGestureHandler };
const _ref_ma6dh2 = { deserializeAST };
const _ref_1g7a1z = { checkParticleCollision };
const _ref_9wfyl5 = { multicastMessage };
const _ref_fwzy7r = { analyzeUserBehavior };
const _ref_z600ib = { setRelease };
const _ref_nlvb43 = { setDopplerFactor };
const _ref_bml5vg = { loadImpulseResponse };
const _ref_9s8f0a = { parseTorrentFile };
const _ref_p7jhb2 = { exitScope };
const _ref_o6ovsb = { remuxContainer };
const _ref_3xey42 = { createSoftBody };
const _ref_ivo7qm = { streamToPlayer };
const _ref_0nv8eo = { simulateNetworkDelay };
const _ref_ddsfth = { createCapsuleShape };
const _ref_9pqb8h = { setRatio };
const _ref_qafrre = { retransmitPacket };
const _ref_xae2jc = { listenSocket };
const _ref_8eyc4d = { setDetune };
const _ref_7yvbww = { createASTNode };
const _ref_35o96c = { optimizeMemoryUsage };
const _ref_eamz4b = { hoistVariables };
const _ref_55s8mu = { setSteeringValue };
const _ref_slkpo1 = { rotateLogFiles };
const _ref_asrrt0 = { broadcastMessage };
const _ref_rusn9k = { linkProgram };
const _ref_smy4f0 = { uninterestPeer };
const _ref_dvuqqj = { findLoops };
const _ref_vdfv87 = { createChannelMerger };
const _ref_2a4ekq = { getAppConfig };
const _ref_4tx2hx = { discoverPeersDHT };
const _ref_zwmgd4 = { resolveSymbols };
const _ref_qrm6f7 = { detectVirtualMachine };
const _ref_o1p0ld = { cacheQueryResults };
const _ref_5x2e3e = { cleanOldLogs };
const _ref_03rkt0 = { createWaveShaper };
const _ref_xrqvv1 = { calculateLayoutMetrics };
const _ref_ixl7sg = { parseSubtitles };
const _ref_fyjnu4 = { lockRow };
const _ref_zlpfij = { rollbackTransaction };
const _ref_yqf72n = { bufferMediaStream };
const _ref_dk9tem = { resolveImports };
const _ref_xzfxf5 = { scaleMatrix };
const _ref_cj9az2 = { createVehicle };
const _ref_w79ds7 = { compressGzip };
const _ref_ul6rps = { translateMatrix };
const _ref_08ck91 = { sendPacket };
const _ref_b9pfc6 = { detectEnvironment };
const _ref_lrh0s7 = { setFilterType };
const _ref_rnmcjd = { setAttack };
const _ref_90nfrw = { refreshAuthToken };
const _ref_fj3g12 = { semaphoreWait };
const _ref_51ewl6 = { setInertia };
const _ref_aig8zy = { readPixels };
const _ref_ijgfmg = { stepSimulation };
const _ref_pnr167 = { detectFirewallStatus };
const _ref_vdybo2 = { encryptPayload };
const _ref_qgn9vk = { stopOscillator };
const _ref_4q48x2 = { unlockRow };
const _ref_dwp0h9 = { hashKeccak256 };
const _ref_eik19i = { compileToBytecode };
const _ref_k007k8 = { detectPacketLoss };
const _ref_0e5mh5 = { resetVehicle };
const _ref_9pbikg = { limitBandwidth };
const _ref_z61yry = { FileValidator };
const _ref_ymad6w = { keepAlivePing };
const _ref_y17apn = { connectionPooling };
const _ref_17yl9o = { createConstraint };
const _ref_2yfyz8 = { optimizeTailCalls };
const _ref_f1id8f = { readFile };
const _ref_mlnxxj = { openFile };
const _ref_3cbk8z = { fingerprintBrowser };
const _ref_t66m6d = { getVehicleSpeed };
const _ref_6szqht = { verifyIR };
const _ref_nvevp2 = { VirtualFSTree };
const _ref_4qao9r = { deleteProgram };
const _ref_8jq5cq = { getAngularVelocity };
const _ref_4vwo6f = { parsePayload };
const _ref_x8deyl = { deleteTempFiles };
const _ref_82ytwp = { optimizeAST };
const _ref_5lpwuk = { traceroute };
const _ref_cm3l0x = { mkdir };
const _ref_u1hqze = { negotiateProtocol };
const _ref_yirrhl = { auditAccessLogs };
const _ref_ct91iq = { cancelTask };
const _ref_94eg7x = { applyForce };
const _ref_xbjzf0 = { normalizeVolume };
const _ref_8yq4ni = { showNotification };
const _ref_g3a72w = { logErrorToFile };
const _ref_o0v9ze = { reassemblePacket };
const _ref_w9fny8 = { debounceAction };
const _ref_oluz9h = { renderCanvasLayer };
const _ref_gllwl7 = { suspendContext };
const _ref_yifcbp = { analyzeBitrate };
const _ref_j9aev9 = { linkModules };
const _ref_iozrsr = { checkRootAccess };
const _ref_t2i1up = { loadTexture };
const _ref_iydpm5 = { scrapeTracker };
const _ref_7u675p = { getUniformLocation };
const _ref_bt53th = { performTLSHandshake };
const _ref_9040sh = { getMediaDuration };
const _ref_ondm1x = { decodeABI };
const _ref_m8hkzg = { backupDatabase };
const _ref_n126rx = { mountFileSystem };
const _ref_h8vjlw = { checkPortAvailability };
const _ref_vhlutw = { debouncedResize };
const _ref_sws2ma = { injectMetadata };
const _ref_j7vq9h = { debugAST };
const _ref_4wvru2 = { validateFormInput };
const _ref_rbypyx = { rebootSystem };
const _ref_dyoy3q = { negotiateSession };
const _ref_dcgk3o = { calculateMD5 };
const _ref_2dd5ez = { ProtocolBufferHandler };
const _ref_1kktk0 = { normalizeFeatures };
const _ref_7vgxla = { renderShadowMap };
const _ref_04nqgh = { checkBalance };
const _ref_molqdb = { hydrateSSR };
const _ref_bczomf = { enableBlend };
const _ref_nvet3f = { writeFile };
const _ref_shyy4p = { scheduleProcess }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `CSpan` };
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
                const urlParams = { config, url: window.location.href, name_en: `CSpan` };

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
        const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const setVolumeLevel = (vol) => vol;

const setDistanceModel = (panner, model) => true;


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

const setSocketTimeout = (ms) => ({ timeout: ms });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };


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

const spoofReferer = () => "https://google.com";

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const getUniformLocation = (program, name) => 1;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
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

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const classifySentiment = (text) => "positive";

const setAngularVelocity = (body, v) => true;

const downInterface = (iface) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const semaphoreSignal = (sem) => true;


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


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const sanitizeXSS = (html) => html;

const verifySignature = (tx, sig) => true;

const decapsulateFrame = (frame) => frame;

const createPipe = () => [3, 4];

const encapsulateFrame = (packet) => packet;

const unmapMemory = (ptr, size) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const segmentImageUNet = (img) => "mask_buffer";

const parseQueryString = (qs) => ({});

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const detectDarkMode = () => true;

const configureInterface = (iface, config) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setAttack = (node, val) => node.attack.value = val;

const closeContext = (ctx) => Promise.resolve();

const dhcpAck = () => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const shardingTable = (table) => ["shard_0", "shard_1"];

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const rotateLogFiles = () => true;

const compileFragmentShader = (source) => ({ compiled: true });

const bindTexture = (target, texture) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const negotiateProtocol = () => "HTTP/2.0";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const resolveCollision = (manifold) => true;

const disableRightClick = () => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const getOutputTimestamp = (ctx) => Date.now();

const addRigidBody = (world, body) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setMTU = (iface, mtu) => true;

const generateSourceMap = (ast) => "{}";

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const performOCR = (img) => "Detected Text";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const injectCSPHeader = () => "default-src 'self'";

const generateDocumentation = (ast) => "";

const hydrateSSR = (html) => true;

const bufferData = (gl, target, data, usage) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const checkRootAccess = () => false;

const updateTransform = (body) => true;

const signTransaction = (tx, key) => "signed_tx_hash";


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

const checkTypes = (ast) => [];

const parsePayload = (packet) => ({});

const deserializeAST = (json) => JSON.parse(json);

const prefetchAssets = (urls) => urls.length;

const edgeDetectionSobel = (image) => image;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const setRatio = (node, val) => node.ratio.value = val;

const bindAddress = (sock, addr, port) => true;

const installUpdate = () => false;

const getShaderInfoLog = (shader) => "";

const deleteProgram = (program) => true;

const setVelocity = (body, v) => true;

const setInertia = (body, i) => true;

const disconnectNodes = (node) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const getByteFrequencyData = (analyser, array) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const applyFog = (color, dist) => color;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

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

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const enterScope = (table) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const convexSweepTest = (shape, start, end) => ({ hit: false });

const validateIPWhitelist = (ip) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const detectCollision = (body1, body2) => false;

const synthesizeSpeech = (text) => "audio_buffer";

const useProgram = (program) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const sleep = (body) => true;

const jitCompile = (bc) => (() => {});

const traceroute = (host) => ["192.168.1.1"];

const removeRigidBody = (world, body) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const deleteBuffer = (buffer) => true;

const semaphoreWait = (sem) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const resampleAudio = (buffer, rate) => buffer;

const freeMemory = (ptr) => true;

const deleteTexture = (texture) => true;

const dhcpDiscover = () => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
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

const cacheQueryResults = (key, data) => true;

const restoreDatabase = (path) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

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

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const receivePacket = (sock, len) => new Uint8Array(len);

const joinThread = (tid) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const swapTokens = (pair, amount) => true;

const tokenizeText = (text) => text.split(" ");

const createConstraint = (body1, body2) => ({});

const createSphereShape = (r) => ({ type: 'sphere' });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const uniform3f = (loc, x, y, z) => true;

const findLoops = (cfg) => [];

const uniform1i = (loc, val) => true;

const reassemblePacket = (fragments) => fragments[0];

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const enableBlend = (func) => true;

const broadcastMessage = (msg) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const establishHandshake = (sock) => true;

const cullFace = (mode) => true;

const obfuscateString = (str) => btoa(str);

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const activeTexture = (unit) => true;

const rateLimitCheck = (ip) => true;

const setRelease = (node, val) => node.release.value = val;

const stepSimulation = (world, dt) => true;

const subscribeToEvents = (contract) => true;

const analyzeHeader = (packet) => ({});

const calculateRestitution = (mat1, mat2) => 0.3;

const validateFormInput = (input) => input.length > 0;

const createThread = (func) => ({ tid: 1 });

const checkIntegrityToken = (token) => true;

const disableDepthTest = () => true;

const processAudioBuffer = (buffer) => buffer;

const createProcess = (img) => ({ pid: 100 });

const stopOscillator = (osc, time) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
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

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const normalizeVolume = (buffer) => buffer;

const dhcpOffer = (ip) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const scaleMatrix = (mat, vec) => mat;

const logErrorToFile = (err) => console.error(err);

const allocateMemory = (size) => 0x1000;

const createFrameBuffer = () => ({ id: Math.random() });

const setFilterType = (filter, type) => filter.type = type;

const estimateNonce = (addr) => 42;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const syncAudioVideo = (offset) => ({ offset, synced: true });

const dropTable = (table) => true;

const createListener = (ctx) => ({});

const unchokePeer = (peer) => ({ ...peer, choked: false });

const extractArchive = (archive) => ["file1", "file2"];

const setMass = (body, m) => true;

const calculateGasFee = (limit) => limit * 20;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const readPipe = (fd, len) => new Uint8Array(len);

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const resolveDNS = (domain) => "127.0.0.1";

const forkProcess = () => 101;

const createIndex = (table, col) => `IDX_${table}_${col}`;

// Anti-shake references
const _ref_u3cgpo = { sanitizeSQLInput };
const _ref_0ohku0 = { setVolumeLevel };
const _ref_y3k0kx = { setDistanceModel };
const _ref_9byr8c = { TelemetryClient };
const _ref_8lnixt = { setSocketTimeout };
const _ref_17bg0g = { decryptHLSStream };
const _ref_fzshwj = { computeSpeedAverage };
const _ref_8a1iic = { keepAlivePing };
const _ref_nxuorq = { normalizeVector };
const _ref_w8p8ir = { rotateUserAgent };
const _ref_4ias4h = { traceStack };
const _ref_54dtam = { ApiDataFormatter };
const _ref_n80pyk = { spoofReferer };
const _ref_us44mu = { validateTokenStructure };
const _ref_ww3ly7 = { getUniformLocation };
const _ref_r3szr3 = { retryFailedSegment };
const _ref_j7t4k9 = { formatLogMessage };
const _ref_ky1o6l = { checkPortAvailability };
const _ref_fy67da = { uploadCrashReport };
const _ref_rptldb = { resolveDNSOverHTTPS };
const _ref_4x6hb1 = { VirtualFSTree };
const _ref_k1y164 = { calculatePieceHash };
const _ref_amyxs2 = { classifySentiment };
const _ref_51b405 = { setAngularVelocity };
const _ref_4v2tz4 = { downInterface };
const _ref_1e0cwo = { createShader };
const _ref_y9gp5p = { semaphoreSignal };
const _ref_3pam7r = { FileValidator };
const _ref_pb0zqt = { killProcess };
const _ref_te27hr = { getAppConfig };
const _ref_u4dt0k = { verifyFileSignature };
const _ref_4c5u32 = { monitorNetworkInterface };
const _ref_ttsdt5 = { sanitizeXSS };
const _ref_kjogh9 = { verifySignature };
const _ref_k03hxy = { decapsulateFrame };
const _ref_xzov37 = { createPipe };
const _ref_xkbnr6 = { encapsulateFrame };
const _ref_6l2idc = { unmapMemory };
const _ref_oidco7 = { virtualScroll };
const _ref_3dsp2t = { segmentImageUNet };
const _ref_baqn1i = { parseQueryString };
const _ref_03t00p = { renderVirtualDOM };
const _ref_pbc0at = { detectDarkMode };
const _ref_n9634l = { configureInterface };
const _ref_41gdfc = { tunnelThroughProxy };
const _ref_x32yaw = { setAttack };
const _ref_vc0tp1 = { closeContext };
const _ref_yk8u3k = { dhcpAck };
const _ref_tmkb80 = { isFeatureEnabled };
const _ref_2fm43z = { shardingTable };
const _ref_5cuua7 = { applyPerspective };
const _ref_735mru = { rotateLogFiles };
const _ref_u1y6gu = { compileFragmentShader };
const _ref_x3mjfy = { bindTexture };
const _ref_m8fpy2 = { calculateLighting };
const _ref_1b2lpc = { negotiateProtocol };
const _ref_8cmgyr = { getMACAddress };
const _ref_myqedf = { resolveCollision };
const _ref_u4cqw4 = { disableRightClick };
const _ref_xu5tix = { handshakePeer };
const _ref_njrlwm = { getOutputTimestamp };
const _ref_gzm38z = { addRigidBody };
const _ref_stjz8l = { checkDiskSpace };
const _ref_y7dlsn = { setMTU };
const _ref_z4qn9e = { generateSourceMap };
const _ref_ctpsyv = { createPanner };
const _ref_4hbcy3 = { performOCR };
const _ref_3dxchu = { getAngularVelocity };
const _ref_tmblfu = { injectCSPHeader };
const _ref_pnwr02 = { generateDocumentation };
const _ref_dy0asz = { hydrateSSR };
const _ref_bbauo2 = { bufferData };
const _ref_qlsvk2 = { bindSocket };
const _ref_8kesdk = { checkRootAccess };
const _ref_kho6os = { updateTransform };
const _ref_vz0lc1 = { signTransaction };
const _ref_lo46as = { ResourceMonitor };
const _ref_ddii9t = { checkTypes };
const _ref_42oos9 = { parsePayload };
const _ref_wabpqf = { deserializeAST };
const _ref_dgiqd8 = { prefetchAssets };
const _ref_tyfrgx = { edgeDetectionSobel };
const _ref_20lwu6 = { executeSQLQuery };
const _ref_ulvq1x = { setRatio };
const _ref_3miur1 = { bindAddress };
const _ref_hgqllc = { installUpdate };
const _ref_etzcy2 = { getShaderInfoLog };
const _ref_n8v407 = { deleteProgram };
const _ref_01000r = { setVelocity };
const _ref_e1odx1 = { setInertia };
const _ref_0zdnsl = { disconnectNodes };
const _ref_rzf7i7 = { calculateFriction };
const _ref_q5zfmc = { getByteFrequencyData };
const _ref_qdm1fi = { captureScreenshot };
const _ref_mc7r9o = { applyFog };
const _ref_zybjwz = { initWebGLContext };
const _ref_41u8vk = { generateFakeClass };
const _ref_0ixo95 = { analyzeUserBehavior };
const _ref_l169w3 = { predictTensor };
const _ref_pr2djl = { enterScope };
const _ref_3wpsxn = { requestAnimationFrameLoop };
const _ref_yo8i1w = { convexSweepTest };
const _ref_qf5he6 = { validateIPWhitelist };
const _ref_3ov14a = { detectObjectYOLO };
const _ref_aumzf4 = { detectCollision };
const _ref_ewinhq = { synthesizeSpeech };
const _ref_pcwt53 = { useProgram };
const _ref_0ft4a5 = { updateBitfield };
const _ref_8hida5 = { sleep };
const _ref_h8wh8t = { jitCompile };
const _ref_r8x7ci = { traceroute };
const _ref_mv6qan = { removeRigidBody };
const _ref_j065nf = { generateUserAgent };
const _ref_v6jeua = { lazyLoadComponent };
const _ref_dlato4 = { deleteBuffer };
const _ref_gj91uo = { semaphoreWait };
const _ref_i0nph8 = { decodeAudioData };
const _ref_daku33 = { resampleAudio };
const _ref_lzto30 = { freeMemory };
const _ref_dqbb2w = { deleteTexture };
const _ref_5nhbln = { dhcpDiscover };
const _ref_m3oa85 = { simulateNetworkDelay };
const _ref_20wrbk = { CacheManager };
const _ref_52d4ws = { cacheQueryResults };
const _ref_pqzjiy = { restoreDatabase };
const _ref_f9tqan = { clearBrowserCache };
const _ref_3wuqfu = { download };
const _ref_ovh8i3 = { linkProgram };
const _ref_ujck1d = { syncDatabase };
const _ref_vi2uf8 = { receivePacket };
const _ref_5tptyn = { joinThread };
const _ref_lpm0kh = { loadTexture };
const _ref_t49rdu = { encryptPayload };
const _ref_de2agc = { swapTokens };
const _ref_n1p1tw = { tokenizeText };
const _ref_oguwft = { createConstraint };
const _ref_dza255 = { createSphereShape };
const _ref_egpx2z = { calculateLayoutMetrics };
const _ref_5wqdsm = { flushSocketBuffer };
const _ref_anjona = { uniform3f };
const _ref_lx0rj3 = { findLoops };
const _ref_elolcl = { uniform1i };
const _ref_scu916 = { reassemblePacket };
const _ref_ds11f6 = { optimizeHyperparameters };
const _ref_mz03nu = { enableBlend };
const _ref_eqloxh = { broadcastMessage };
const _ref_qsroir = { limitBandwidth };
const _ref_y9uj6h = { interceptRequest };
const _ref_uebf3z = { makeDistortionCurve };
const _ref_950tfb = { switchProxyServer };
const _ref_xwh4hi = { createAudioContext };
const _ref_n1kat7 = { getVelocity };
const _ref_s8m44u = { establishHandshake };
const _ref_9iqmf9 = { cullFace };
const _ref_pxba39 = { obfuscateString };
const _ref_ng55zb = { terminateSession };
const _ref_tdnzzd = { activeTexture };
const _ref_g0t2xx = { rateLimitCheck };
const _ref_yo3fn7 = { setRelease };
const _ref_1mber4 = { stepSimulation };
const _ref_jaand1 = { subscribeToEvents };
const _ref_3s8jv0 = { analyzeHeader };
const _ref_95es9u = { calculateRestitution };
const _ref_fn99rq = { validateFormInput };
const _ref_rwssbp = { createThread };
const _ref_38bodu = { checkIntegrityToken };
const _ref_7q5us0 = { disableDepthTest };
const _ref_ljca8h = { processAudioBuffer };
const _ref_hy3sq2 = { createProcess };
const _ref_ngz6z7 = { stopOscillator };
const _ref_uzh24g = { diffVirtualDOM };
const _ref_mfyesh = { optimizeMemoryUsage };
const _ref_7sdoj3 = { calculateEntropy };
const _ref_q6ykd6 = { manageCookieJar };
const _ref_fwk2py = { normalizeVolume };
const _ref_lqjfxa = { dhcpOffer };
const _ref_l7jn6z = { repairCorruptFile };
const _ref_i5qlar = { scaleMatrix };
const _ref_kke5cv = { logErrorToFile };
const _ref_mgh6hf = { allocateMemory };
const _ref_ryt71j = { createFrameBuffer };
const _ref_a3exu5 = { setFilterType };
const _ref_9ekcud = { estimateNonce };
const _ref_q9usqf = { parseM3U8Playlist };
const _ref_pv8i9y = { createPhysicsWorld };
const _ref_s39nk3 = { calculateSHA256 };
const _ref_osijkc = { syncAudioVideo };
const _ref_khwoef = { dropTable };
const _ref_t8lesk = { createListener };
const _ref_k9qc13 = { unchokePeer };
const _ref_rt55bi = { extractArchive };
const _ref_5bvdju = { setMass };
const _ref_fqul3b = { calculateGasFee };
const _ref_5jr1gt = { initiateHandshake };
const _ref_au15iw = { readPipe };
const _ref_9by93n = { createMagnetURI };
const _ref_51zn1z = { scrapeTracker };
const _ref_frbsai = { resolveDNS };
const _ref_8nsv97 = { forkProcess };
const _ref_92q2sj = { createIndex }; 
    });
})({}, {});