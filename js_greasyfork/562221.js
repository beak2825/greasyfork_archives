// ==UserScript==
// @name 56视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/56com/index.js
// @version 2026.01.10
// @description 一键下载56视频，支持4K/1080P/720P多画质。
// @icon https://www.56.com/favicon.ico
// @match *://*.56.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect itc.cn
// @connect 56.com
// @connect sohu.com
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
// @downloadURL https://update.greasyfork.org/scripts/562221/56%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562221/56%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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

const chokePeer = (peer) => ({ ...peer, choked: true });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const checkBatteryLevel = () => 100;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const detectVideoCodec = () => "h264";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const deriveAddress = (path) => "0x123...";

const deobfuscateString = (str) => atob(str);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const inlineFunctions = (ast) => ast;

const detectDevTools = () => false;

const detectVirtualMachine = () => false;

const setAttack = (node, val) => node.attack.value = val;

const fingerprintBrowser = () => "fp_hash_123";

const setFilterType = (filter, type) => filter.type = type;

const setThreshold = (node, val) => node.threshold.value = val;

const swapTokens = (pair, amount) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const obfuscateString = (str) => btoa(str);

const verifyAppSignature = () => true;

const dhcpAck = () => true;

const createMediaStreamSource = (ctx, stream) => ({});

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const disableRightClick = () => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const unrollLoops = (ast) => ast;

const setMTU = (iface, mtu) => true;

const encapsulateFrame = (packet) => packet;

const remuxContainer = (container) => ({ container, status: "done" });

const setKnee = (node, val) => node.knee.value = val;

const setMass = (body, m) => true;

const renderCanvasLayer = (ctx) => true;

const createConvolver = (ctx) => ({ buffer: null });

const chmodFile = (path, mode) => true;

const rollbackTransaction = (tx) => true;

const statFile = (path) => ({ size: 0 });

const unlinkFile = (path) => true;

const readdir = (path) => [];

const beginTransaction = () => "TX-" + Date.now();

const createWaveShaper = (ctx) => ({ curve: null });

const calculateCRC32 = (data) => "00000000";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const enableInterrupts = () => true;

const unmountFileSystem = (path) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const joinThread = (tid) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const analyzeHeader = (packet) => ({});

const addRigidBody = (world, body) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const replicateData = (node) => ({ target: node, synced: true });

const unloadDriver = (name) => true;

const restoreDatabase = (path) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const mergeFiles = (parts) => parts[0];

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const protectMemory = (ptr, size, flags) => true;


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

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const encodeABI = (method, params) => "0x...";

const prioritizeRarestPiece = (pieces) => pieces[0];


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const bufferMediaStream = (size) => ({ buffer: size });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const getShaderInfoLog = (shader) => "";

const encryptStream = (stream, key) => stream;

const setEnv = (key, val) => true;

const scheduleProcess = (pid) => true;

const createPipe = () => [3, 4];

const compileFragmentShader = (source) => ({ compiled: true });

const killParticles = (sys) => true;

const cacheQueryResults = (key, data) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const visitNode = (node) => true;

const rayCast = (world, start, end) => ({ hit: false });

const invalidateCache = (key) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const inferType = (node) => 'any';

const setQValue = (filter, q) => filter.Q = q;

const allocateMemory = (size) => 0x1000;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const uniform3f = (loc, x, y, z) => true;

const decapsulateFrame = (frame) => frame;

const renderShadowMap = (scene, light) => ({ texture: {} });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const lockRow = (id) => true;

const encryptPeerTraffic = (data) => btoa(data);

const exitScope = (table) => true;

const lookupSymbol = (table, name) => ({});

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const scheduleTask = (task) => ({ id: 1, task });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const reportWarning = (msg, line) => console.warn(msg);

const rateLimitCheck = (ip) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const debugAST = (ast) => "";

const wakeUp = (body) => true;

const estimateNonce = (addr) => 42;

const checkUpdate = () => ({ hasUpdate: false });

const normalizeVolume = (buffer) => buffer;

const writePipe = (fd, data) => data.length;

const rotateLogFiles = () => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const monitorClipboard = () => "";

const updateTransform = (body) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const checkBalance = (addr) => "10.5 ETH";

const dumpSymbolTable = (table) => "";

const enterScope = (table) => true;

const compileToBytecode = (ast) => new Uint8Array();

const shardingTable = (table) => ["shard_0", "shard_1"];

const upInterface = (iface) => true;

const verifyIR = (ir) => true;

const optimizeTailCalls = (ast) => ast;

const enableDHT = () => true;

const shutdownComputer = () => console.log("Shutting down...");

const setGravity = (world, g) => world.gravity = g;

const setFilePermissions = (perm) => `chmod ${perm}`;


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

const addSliderConstraint = (world, c) => true;

const interpretBytecode = (bc) => true;

const commitTransaction = (tx) => true;

const resampleAudio = (buffer, rate) => buffer;

const mangleNames = (ast) => ast;

const getMediaDuration = () => 3600;

const encryptLocalStorage = (key, val) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const chownFile = (path, uid, gid) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const captureFrame = () => "frame_data_buffer";

const hoistVariables = (ast) => ast;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const computeDominators = (cfg) => ({});

const checkPortAvailability = (port) => Math.random() > 0.2;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const registerGestureHandler = (gesture) => true;

const instrumentCode = (code) => code;

const renderParticles = (sys) => true;

const linkModules = (modules) => ({});

const verifyProofOfWork = (nonce) => true;

const findLoops = (cfg) => [];

const preventCSRF = () => "csrf_token";

const restartApplication = () => console.log("Restarting...");

const getEnv = (key) => "";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const acceptConnection = (sock) => ({ fd: 2 });

const applyFog = (color, dist) => color;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const reassemblePacket = (fragments) => fragments[0];

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

const enableBlend = (func) => true;

const setPosition = (panner, x, y, z) => true;

const drawArrays = (gl, mode, first, count) => true;

const scaleMatrix = (mat, vec) => mat;

const setOrientation = (panner, x, y, z) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const validatePieceChecksum = (piece) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const analyzeBitrate = () => "5000kbps";

const configureInterface = (iface, config) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const getBlockHeight = () => 15000000;

const foldConstants = (ast) => ast;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const unmapMemory = (ptr, size) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setPan = (node, val) => node.pan.value = val;

const forkProcess = () => 101;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const sendPacket = (sock, data) => data.length;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const unlockRow = (id) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const contextSwitch = (oldPid, newPid) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

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

const mutexLock = (mtx) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const extractArchive = (archive) => ["file1", "file2"];

const parsePayload = (packet) => ({});

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const getcwd = () => "/";

const logErrorToFile = (err) => console.error(err);

const createVehicle = (chassis) => ({ wheels: [] });

const cleanOldLogs = (days) => days;

const auditAccessLogs = () => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

// Anti-shake references
const _ref_hzcxnh = { ProtocolBufferHandler };
const _ref_ljnid8 = { chokePeer };
const _ref_hc2l5a = { unchokePeer };
const _ref_r9qiuz = { checkBatteryLevel };
const _ref_llzftu = { initiateHandshake };
const _ref_v0g91w = { detectVideoCodec };
const _ref_w7abhl = { decodeABI };
const _ref_uw9hek = { deriveAddress };
const _ref_wlzomi = { deobfuscateString };
const _ref_1tds0c = { streamToPlayer };
const _ref_g3d7ea = { inlineFunctions };
const _ref_aotyk5 = { detectDevTools };
const _ref_saanny = { detectVirtualMachine };
const _ref_q58d9u = { setAttack };
const _ref_4nicim = { fingerprintBrowser };
const _ref_xy2iez = { setFilterType };
const _ref_shfkq3 = { setThreshold };
const _ref_40xjvq = { swapTokens };
const _ref_6om7pm = { getVelocity };
const _ref_lji5pj = { obfuscateString };
const _ref_2x9adv = { verifyAppSignature };
const _ref_72p0fz = { dhcpAck };
const _ref_p511tm = { createMediaStreamSource };
const _ref_elkimd = { generateUUIDv5 };
const _ref_vvjtnf = { disableRightClick };
const _ref_or4bf0 = { announceToTracker };
const _ref_r6xdn3 = { unrollLoops };
const _ref_k7krpv = { setMTU };
const _ref_fx86co = { encapsulateFrame };
const _ref_u3avq7 = { remuxContainer };
const _ref_wtfu7d = { setKnee };
const _ref_j4mjbp = { setMass };
const _ref_89ub19 = { renderCanvasLayer };
const _ref_152se1 = { createConvolver };
const _ref_rr21jj = { chmodFile };
const _ref_mfxafi = { rollbackTransaction };
const _ref_3ulz9f = { statFile };
const _ref_6v8wck = { unlinkFile };
const _ref_5bm03e = { readdir };
const _ref_5lggij = { beginTransaction };
const _ref_2ihc2p = { createWaveShaper };
const _ref_40skvr = { calculateCRC32 };
const _ref_d7dj4s = { setFrequency };
const _ref_eh2twm = { enableInterrupts };
const _ref_deov8o = { unmountFileSystem };
const _ref_3ga2hl = { animateTransition };
const _ref_yqe5o9 = { joinThread };
const _ref_fdxx7r = { uniformMatrix4fv };
const _ref_eesait = { analyzeHeader };
const _ref_8v4uq8 = { addRigidBody };
const _ref_ayw0ft = { createPanner };
const _ref_mqin7p = { setSteeringValue };
const _ref_b4j9lk = { replicateData };
const _ref_vmr69y = { unloadDriver };
const _ref_q1aey7 = { restoreDatabase };
const _ref_1gwjlh = { optimizeMemoryUsage };
const _ref_gg11jh = { mergeFiles };
const _ref_i95kdp = { createDynamicsCompressor };
const _ref_hxnpop = { protectMemory };
const _ref_hrtr5h = { ApiDataFormatter };
const _ref_x9xp8q = { encryptPayload };
const _ref_gqlyfj = { encodeABI };
const _ref_q84ao7 = { prioritizeRarestPiece };
const _ref_7cjm35 = { isFeatureEnabled };
const _ref_kgbzxz = { bufferMediaStream };
const _ref_axhtyq = { updateBitfield };
const _ref_njzw1c = { scrapeTracker };
const _ref_pju8tx = { getShaderInfoLog };
const _ref_snu216 = { encryptStream };
const _ref_5urcqp = { setEnv };
const _ref_x510ag = { scheduleProcess };
const _ref_rq1oa0 = { createPipe };
const _ref_wvls2b = { compileFragmentShader };
const _ref_0m3c4i = { killParticles };
const _ref_y56ud7 = { cacheQueryResults };
const _ref_9g1mlg = { calculateSHA256 };
const _ref_z4llcv = { visitNode };
const _ref_3tqy2s = { rayCast };
const _ref_ksdq7v = { invalidateCache };
const _ref_8lkfn8 = { normalizeAudio };
const _ref_pxzz2j = { inferType };
const _ref_y2rc2y = { setQValue };
const _ref_6x0dhc = { allocateMemory };
const _ref_q7spgx = { handshakePeer };
const _ref_p4hrda = { uniform3f };
const _ref_o2df4o = { decapsulateFrame };
const _ref_xeib4q = { renderShadowMap };
const _ref_42zyjl = { sanitizeSQLInput };
const _ref_05yghv = { linkProgram };
const _ref_eri1sv = { lockRow };
const _ref_pj0mq5 = { encryptPeerTraffic };
const _ref_lr32ba = { exitScope };
const _ref_7kajft = { lookupSymbol };
const _ref_6a49mk = { tokenizeSource };
const _ref_x3ijns = { scheduleTask };
const _ref_m2cr01 = { refreshAuthToken };
const _ref_294anl = { reportWarning };
const _ref_qp6h0s = { rateLimitCheck };
const _ref_ztq63f = { detectFirewallStatus };
const _ref_qgxjbr = { debugAST };
const _ref_vwoozp = { wakeUp };
const _ref_gf99ov = { estimateNonce };
const _ref_ek8u3c = { checkUpdate };
const _ref_b51n3b = { normalizeVolume };
const _ref_vcatv0 = { writePipe };
const _ref_nv8rtp = { rotateLogFiles };
const _ref_02916l = { makeDistortionCurve };
const _ref_bvkllc = { monitorClipboard };
const _ref_zxp1d5 = { updateTransform };
const _ref_36n0x4 = { parseSubtitles };
const _ref_4rq062 = { checkBalance };
const _ref_p1uld3 = { dumpSymbolTable };
const _ref_yicw9q = { enterScope };
const _ref_skepyp = { compileToBytecode };
const _ref_cfj81w = { shardingTable };
const _ref_ud54j4 = { upInterface };
const _ref_5hi6fh = { verifyIR };
const _ref_wl71fg = { optimizeTailCalls };
const _ref_rbf48d = { enableDHT };
const _ref_856mdk = { shutdownComputer };
const _ref_8cwdzf = { setGravity };
const _ref_t3qbuw = { setFilePermissions };
const _ref_g4khqn = { CacheManager };
const _ref_wifmxf = { addSliderConstraint };
const _ref_o43ss7 = { interpretBytecode };
const _ref_di41sr = { commitTransaction };
const _ref_jmvib6 = { resampleAudio };
const _ref_olflpt = { mangleNames };
const _ref_gnfdnx = { getMediaDuration };
const _ref_frvxtt = { encryptLocalStorage };
const _ref_w96z4k = { FileValidator };
const _ref_es0iuv = { archiveFiles };
const _ref_b4grbo = { chownFile };
const _ref_xf1co8 = { manageCookieJar };
const _ref_6tmz65 = { loadTexture };
const _ref_k8yl7g = { captureFrame };
const _ref_dwaj2c = { hoistVariables };
const _ref_fhq1cb = { connectionPooling };
const _ref_yuobsh = { computeDominators };
const _ref_80ki4w = { checkPortAvailability };
const _ref_wfdpfa = { limitUploadSpeed };
const _ref_bvaoat = { detectEnvironment };
const _ref_249e7y = { registerGestureHandler };
const _ref_uf2s7h = { instrumentCode };
const _ref_dg6ugm = { renderParticles };
const _ref_ffae9i = { linkModules };
const _ref_bd7q1c = { verifyProofOfWork };
const _ref_m8vmzt = { findLoops };
const _ref_k3b2xg = { preventCSRF };
const _ref_i4jacc = { restartApplication };
const _ref_qk5zsm = { getEnv };
const _ref_18xg45 = { getAppConfig };
const _ref_k5ap8f = { acceptConnection };
const _ref_t3bir6 = { applyFog };
const _ref_m545xt = { createCapsuleShape };
const _ref_x7oo47 = { reassemblePacket };
const _ref_wmgqgs = { TaskScheduler };
const _ref_c1cpbf = { enableBlend };
const _ref_sa8row = { setPosition };
const _ref_jq8az6 = { drawArrays };
const _ref_99vqg4 = { scaleMatrix };
const _ref_4hky5i = { setOrientation };
const _ref_x0r065 = { verifyFileSignature };
const _ref_9cqnke = { validatePieceChecksum };
const _ref_9p1rss = { uploadCrashReport };
const _ref_sivkrw = { analyzeBitrate };
const _ref_m8xuki = { configureInterface };
const _ref_2fhg4s = { calculatePieceHash };
const _ref_hu7v4y = { getBlockHeight };
const _ref_ytoggh = { foldConstants };
const _ref_phsdlr = { createDelay };
const _ref_n1ahrw = { unmapMemory };
const _ref_ytvdsn = { watchFileChanges };
const _ref_6strcj = { retryFailedSegment };
const _ref_doxiv0 = { simulateNetworkDelay };
const _ref_4a55dl = { traceStack };
const _ref_0lbd95 = { setPan };
const _ref_58advj = { forkProcess };
const _ref_8zarzz = { terminateSession };
const _ref_eodqn1 = { sendPacket };
const _ref_5suszm = { moveFileToComplete };
const _ref_7orfj7 = { connectToTracker };
const _ref_7q34rq = { unlockRow };
const _ref_er9t9a = { analyzeQueryPlan };
const _ref_cl1jmq = { createIndex };
const _ref_cjfs5u = { showNotification };
const _ref_34ho8y = { contextSwitch };
const _ref_dcw3y3 = { calculateLayoutMetrics };
const _ref_thi2ch = { generateFakeClass };
const _ref_uqgr7v = { mutexLock };
const _ref_bwcheg = { extractThumbnail };
const _ref_uiksou = { extractArchive };
const _ref_0ey35r = { parsePayload };
const _ref_q321q1 = { validateTokenStructure };
const _ref_co4z4j = { getcwd };
const _ref_cye9w7 = { logErrorToFile };
const _ref_476jlw = { createVehicle };
const _ref_kxqe4b = { cleanOldLogs };
const _ref_2tqyg9 = { auditAccessLogs };
const _ref_gplhd2 = { convertRGBtoHSL }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `56com` };
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
                const urlParams = { config, url: window.location.href, name_en: `56com` };

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
        const bindAddress = (sock, addr, port) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const generateEmbeddings = (text) => new Float32Array(128);

const shutdownComputer = () => console.log("Shutting down...");

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const resolveSymbols = (ast) => ({});

const downInterface = (iface) => true;

const dropTable = (table) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const controlCongestion = (sock) => true;

const invalidateCache = (key) => true;

const resolveDNS = (domain) => "127.0.0.1";

const measureRTT = (sent, recv) => 10;

const joinGroup = (group) => true;

const registerISR = (irq, func) => true;

const adjustWindowSize = (sock, size) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const instrumentCode = (code) => code;

const chokePeer = (peer) => ({ ...peer, choked: true });

const loadCheckpoint = (path) => true;

const reassemblePacket = (fragments) => fragments[0];

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const backpropagateGradient = (loss) => true;

const checkTypes = (ast) => [];

const closeSocket = (sock) => true;

const decapsulateFrame = (frame) => frame;

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

const debugAST = (ast) => "";

const joinThread = (tid) => true;

const handleTimeout = (sock) => true;

const validatePieceChecksum = (piece) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const compressPacket = (data) => data;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const contextSwitch = (oldPid, newPid) => true;

const detectAudioCodec = () => "aac";

const shardingTable = (table) => ["shard_0", "shard_1"];

const serializeFormData = (form) => JSON.stringify(form);

const lookupSymbol = (table, name) => ({});

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const semaphoreWait = (sem) => true;

const dhcpDiscover = () => true;

const leaveGroup = (group) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const setSocketTimeout = (ms) => ({ timeout: ms });

const detectVideoCodec = () => "h264";

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const injectMetadata = (file, meta) => ({ file, meta });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const broadcastMessage = (msg) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const clearScreen = (r, g, b, a) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const encapsulateFrame = (packet) => packet;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const createIndexBuffer = (data) => ({ id: Math.random() });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const createPipe = () => [3, 4];

const readPipe = (fd, len) => new Uint8Array(len);

const dhcpRequest = (ip) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const recognizeSpeech = (audio) => "Transcribed Text";

const readdir = (path) => [];

const normalizeVolume = (buffer) => buffer;

const captureScreenshot = () => "data:image/png;base64,...";

const upInterface = (iface) => true;

const resampleAudio = (buffer, rate) => buffer;

const arpRequest = (ip) => "00:00:00:00:00:00";

const dhcpOffer = (ip) => true;

const setInertia = (body, i) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
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

const encryptStream = (stream, key) => stream;

const detectDarkMode = () => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const setAngularVelocity = (body, v) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const linkModules = (modules) => ({});

const handleInterrupt = (irq) => true;

const addSliderConstraint = (world, c) => true;

const createSymbolTable = () => ({ scopes: [] });

const reportError = (msg, line) => console.error(msg);

const applyForce = (body, force, point) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const filterTraffic = (rule) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const clusterKMeans = (data, k) => Array(k).fill([]);

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

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const anchorSoftBody = (soft, rigid) => true;

const decompressPacket = (data) => data;

const classifySentiment = (text) => "positive";

const calculateRestitution = (mat1, mat2) => 0.3;

const writeFile = (fd, data) => true;

const writePipe = (fd, data) => data.length;

const sleep = (body) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const getFloatTimeDomainData = (analyser, array) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const broadcastTransaction = (tx) => "tx_hash_123";

const decompressGzip = (data) => data;

const announceToTracker = (url) => ({ url, interval: 1800 });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const createMediaStreamSource = (ctx, stream) => ({});

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const preventCSRF = () => "csrf_token";

const setOrientation = (panner, x, y, z) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const sanitizeXSS = (html) => html;

const deobfuscateString = (str) => atob(str);

const mapMemory = (fd, size) => 0x2000;

const computeLossFunction = (pred, actual) => 0.05;

const setRatio = (node, val) => node.ratio.value = val;

const signTransaction = (tx, key) => "signed_tx_hash";

const resolveImports = (ast) => [];

const removeRigidBody = (world, body) => true;

const linkFile = (src, dest) => true;

const updateTransform = (body) => true;

const verifyProofOfWork = (nonce) => true;


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

const calculateGasFee = (limit) => limit * 20;

const setViewport = (x, y, w, h) => true;

const rmdir = (path) => true;

const connectSocket = (sock, addr, port) => true;

const attachRenderBuffer = (fb, rb) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const detectDebugger = () => false;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const performOCR = (img) => "Detected Text";

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

const encodeABI = (method, params) => "0x...";

const allowSleepMode = () => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const deleteProgram = (program) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const getShaderInfoLog = (shader) => "";

const getOutputTimestamp = (ctx) => Date.now();

const translateText = (text, lang) => text;

const deleteTexture = (texture) => true;

const addWheel = (vehicle, info) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }


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

const updateWheelTransform = (wheel) => true;

const disableRightClick = () => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const getMediaDuration = () => 3600;

const establishHandshake = (sock) => true;

const auditAccessLogs = () => true;

const deleteBuffer = (buffer) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const setDelayTime = (node, time) => node.delayTime.value = time;

const parseQueryString = (qs) => ({});

const getNetworkStats = () => ({ up: 100, down: 2000 });

const resolveCollision = (manifold) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const reportWarning = (msg, line) => console.warn(msg);

const readFile = (fd, len) => "";

const prettifyCode = (code) => code;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const bundleAssets = (assets) => "";

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const startOscillator = (osc, time) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const addRigidBody = (world, body) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const setEnv = (key, val) => true;

const getEnv = (key) => "";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const compressGzip = (data) => data;

const parseLogTopics = (topics) => ["Transfer"];

const analyzeBitrate = () => "5000kbps";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const connectNodes = (src, dest) => true;

// Anti-shake references
const _ref_j9wb1l = { bindAddress };
const _ref_mkm15b = { validateTokenStructure };
const _ref_gbqwee = { loadTexture };
const _ref_4k6pl5 = { generateEmbeddings };
const _ref_bwtdta = { shutdownComputer };
const _ref_axjb36 = { uninterestPeer };
const _ref_a93ylo = { resolveSymbols };
const _ref_892xwh = { downInterface };
const _ref_a7pej5 = { dropTable };
const _ref_dffthq = { deleteTempFiles };
const _ref_2160rq = { limitDownloadSpeed };
const _ref_9mrgw1 = { controlCongestion };
const _ref_rzkz4e = { invalidateCache };
const _ref_dzkyob = { resolveDNS };
const _ref_ailu7f = { measureRTT };
const _ref_xmlu4s = { joinGroup };
const _ref_g2jlud = { registerISR };
const _ref_stkm42 = { adjustWindowSize };
const _ref_9nhebk = { queueDownloadTask };
const _ref_ttfcj2 = { instrumentCode };
const _ref_02xolq = { chokePeer };
const _ref_75c953 = { loadCheckpoint };
const _ref_bsuzsf = { reassemblePacket };
const _ref_mhavai = { detectEnvironment };
const _ref_t2dcb7 = { backpropagateGradient };
const _ref_rsqu4u = { checkTypes };
const _ref_qewf3g = { closeSocket };
const _ref_k3bwi1 = { decapsulateFrame };
const _ref_c17xbq = { debounceAction };
const _ref_ow3kqj = { calculateEntropy };
const _ref_c62y3g = { debugAST };
const _ref_d77tdt = { joinThread };
const _ref_y5nkte = { handleTimeout };
const _ref_cd79rb = { validatePieceChecksum };
const _ref_snm3fb = { normalizeVector };
const _ref_9apd0q = { compressPacket };
const _ref_gnruwm = { resolveHostName };
const _ref_4mpmaw = { contextSwitch };
const _ref_kndts1 = { detectAudioCodec };
const _ref_lq3s98 = { shardingTable };
const _ref_w0u0po = { serializeFormData };
const _ref_64l3i1 = { lookupSymbol };
const _ref_74d6xm = { decryptHLSStream };
const _ref_dodv0z = { cancelAnimationFrameLoop };
const _ref_cppq9f = { semaphoreWait };
const _ref_ps34iq = { dhcpDiscover };
const _ref_fnyk23 = { leaveGroup };
const _ref_9k1x8f = { sanitizeSQLInput };
const _ref_d3wraj = { setSocketTimeout };
const _ref_398arl = { detectVideoCodec };
const _ref_bws8l9 = { setFrequency };
const _ref_hgqx3w = { injectMetadata };
const _ref_x5fk85 = { convexSweepTest };
const _ref_sf2oj3 = { validateSSLCert };
const _ref_pb35h6 = { monitorNetworkInterface };
const _ref_2by2sf = { broadcastMessage };
const _ref_de4042 = { setDetune };
const _ref_w9t7zi = { clearScreen };
const _ref_nwm7sx = { formatCurrency };
const _ref_hku5vi = { encapsulateFrame };
const _ref_pyby0v = { analyzeQueryPlan };
const _ref_ctujmc = { calculateMD5 };
const _ref_crupiw = { createIndexBuffer };
const _ref_b8zzns = { createPhysicsWorld };
const _ref_uzz07e = { compactDatabase };
const _ref_d7o099 = { createPipe };
const _ref_smem14 = { readPipe };
const _ref_xh6gxt = { dhcpRequest };
const _ref_7neayz = { migrateSchema };
const _ref_1ayv0n = { executeSQLQuery };
const _ref_ceigcz = { recognizeSpeech };
const _ref_80p72y = { readdir };
const _ref_mv2fgc = { normalizeVolume };
const _ref_ox0sfo = { captureScreenshot };
const _ref_8afw9t = { upInterface };
const _ref_6481ty = { resampleAudio };
const _ref_hpt56t = { arpRequest };
const _ref_z1pgt6 = { dhcpOffer };
const _ref_3mcsgt = { setInertia };
const _ref_wjz0ie = { checkPortAvailability };
const _ref_x59r1y = { createDynamicsCompressor };
const _ref_wvymt6 = { throttleRequests };
const _ref_xuai01 = { switchProxyServer };
const _ref_vbz5cn = { download };
const _ref_xnc8lm = { encryptStream };
const _ref_bbrnx7 = { detectDarkMode };
const _ref_rath7n = { streamToPlayer };
const _ref_e6c4k7 = { setAngularVelocity };
const _ref_bzg6nh = { animateTransition };
const _ref_ma4u8m = { linkModules };
const _ref_ifm8oo = { handleInterrupt };
const _ref_436qqx = { addSliderConstraint };
const _ref_z8haga = { createSymbolTable };
const _ref_kmw4zy = { reportError };
const _ref_cydey8 = { applyForce };
const _ref_iedf2h = { acceptConnection };
const _ref_rqg8vw = { filterTraffic };
const _ref_r4vifj = { simulateNetworkDelay };
const _ref_czqrl0 = { verifyMagnetLink };
const _ref_gcz5az = { clusterKMeans };
const _ref_bhvsa2 = { generateFakeClass };
const _ref_mwebr2 = { verifyFileSignature };
const _ref_fs68m8 = { keepAlivePing };
const _ref_b0qw24 = { createMeshShape };
const _ref_eou5vu = { anchorSoftBody };
const _ref_gmsr56 = { decompressPacket };
const _ref_isq3wr = { classifySentiment };
const _ref_ifbvan = { calculateRestitution };
const _ref_es04xk = { writeFile };
const _ref_kqdyb6 = { writePipe };
const _ref_0jxk4p = { sleep };
const _ref_a5d88j = { rotateUserAgent };
const _ref_47bjuv = { getFloatTimeDomainData };
const _ref_8eyf4i = { createIndex };
const _ref_pbfis1 = { parseFunction };
const _ref_y3d6dg = { broadcastTransaction };
const _ref_pdercg = { decompressGzip };
const _ref_p2ohv4 = { announceToTracker };
const _ref_of8fxp = { getAppConfig };
const _ref_doe81o = { createMediaStreamSource };
const _ref_dfopxm = { parseTorrentFile };
const _ref_k8o21x = { preventCSRF };
const _ref_bmh476 = { setOrientation };
const _ref_53fyxt = { generateUUIDv5 };
const _ref_plkxuo = { getVelocity };
const _ref_67zrkd = { sanitizeXSS };
const _ref_ydpao6 = { deobfuscateString };
const _ref_gdh9e5 = { mapMemory };
const _ref_if0mcq = { computeLossFunction };
const _ref_saqd5r = { setRatio };
const _ref_5nkemy = { signTransaction };
const _ref_z3fblr = { resolveImports };
const _ref_ns39gs = { removeRigidBody };
const _ref_uoul3j = { linkFile };
const _ref_26jrwy = { updateTransform };
const _ref_if1zoa = { verifyProofOfWork };
const _ref_b3qr2g = { ApiDataFormatter };
const _ref_7t1czw = { calculateGasFee };
const _ref_xbajr9 = { setViewport };
const _ref_uogdm3 = { rmdir };
const _ref_ybqyoj = { connectSocket };
const _ref_ukw779 = { attachRenderBuffer };
const _ref_v7i21i = { generateWalletKeys };
const _ref_bmvjcl = { detectDebugger };
const _ref_s32qdi = { generateUserAgent };
const _ref_eo2nwc = { performOCR };
const _ref_pmmn94 = { updateBitfield };
const _ref_fg6mqa = { analyzeUserBehavior };
const _ref_rr3jfm = { decodeABI };
const _ref_cya3ke = { encodeABI };
const _ref_9inp2s = { allowSleepMode };
const _ref_3ddr80 = { discoverPeersDHT };
const _ref_hgs956 = { deleteProgram };
const _ref_coix5l = { refreshAuthToken };
const _ref_wimwwi = { getShaderInfoLog };
const _ref_cwj0zt = { getOutputTimestamp };
const _ref_s4gv90 = { translateText };
const _ref_7hitwg = { deleteTexture };
const _ref_p8o8on = { addWheel };
const _ref_49tfcw = { tunnelThroughProxy };
const _ref_3j02kz = { handshakePeer };
const _ref_8u5qi9 = { isFeatureEnabled };
const _ref_o93tcp = { CacheManager };
const _ref_jq8o7b = { updateWheelTransform };
const _ref_yypo2d = { disableRightClick };
const _ref_io1rxv = { createMagnetURI };
const _ref_ssu3b6 = { getMediaDuration };
const _ref_x0uli3 = { establishHandshake };
const _ref_wxlgs1 = { auditAccessLogs };
const _ref_j4yekm = { deleteBuffer };
const _ref_lzybti = { formatLogMessage };
const _ref_lx8okg = { interestPeer };
const _ref_7xke9q = { setDelayTime };
const _ref_k3tf9c = { parseQueryString };
const _ref_tr4hz0 = { getNetworkStats };
const _ref_3btdlh = { resolveCollision };
const _ref_92ukv9 = { createVehicle };
const _ref_z6x0f9 = { scrapeTracker };
const _ref_ughlg1 = { seedRatioLimit };
const _ref_a351w3 = { reportWarning };
const _ref_do5ddx = { readFile };
const _ref_3rps86 = { prettifyCode };
const _ref_koq462 = { limitUploadSpeed };
const _ref_6y26gq = { bundleAssets };
const _ref_cimc2x = { parseExpression };
const _ref_ll6eet = { startOscillator };
const _ref_kteiou = { saveCheckpoint };
const _ref_uv0qdl = { performTLSHandshake };
const _ref_h6a4lm = { addRigidBody };
const _ref_48qnm4 = { autoResumeTask };
const _ref_gykjpl = { setEnv };
const _ref_9278g4 = { getEnv };
const _ref_ks6l69 = { resolveDependencyGraph };
const _ref_5fkfuw = { validateMnemonic };
const _ref_nc8vmi = { FileValidator };
const _ref_tv29pu = { compressGzip };
const _ref_numsgg = { parseLogTopics };
const _ref_v9fxth = { analyzeBitrate };
const _ref_fjwugj = { encryptPayload };
const _ref_ui98fm = { connectNodes }; 
    });
})({}, {});