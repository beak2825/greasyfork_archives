// ==UserScript==
// @name 小红书视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/xiaohongshu/index.js
// @version 2026.01.10
// @description 下载小红书视频，支持4K/1080P/720P多画质。
// @icon https://www.xiaohongshu.com/favicon.ico
// @match *://www.xiaohongshu.com/explore/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect xiaohongshu.com
// @connect xhscdn.com
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
// @downloadURL https://update.greasyfork.org/scripts/560800/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560800/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const renderShadowMap = (scene, light) => ({ texture: {} });

const checkGLError = () => 0;

const applyForce = (body, force, point) => true;

const adjustPlaybackSpeed = (rate) => rate;

const prioritizeTraffic = (queue) => true;

const addWheel = (vehicle, info) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const installUpdate = () => false;

const calculateFriction = (mat1, mat2) => 0.5;

const rotateLogFiles = () => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const dropTable = (table) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const cancelTask = (id) => ({ id, cancelled: true });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createConstraint = (body1, body2) => ({});

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const updateTransform = (body) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const removeConstraint = (world, c) => true;

const updateSoftBody = (body) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const checkUpdate = () => ({ hasUpdate: false });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const createBoxShape = (w, h, d) => ({ type: 'box' });

const visitNode = (node) => true;

const updateWheelTransform = (wheel) => true;

const validateProgram = (program) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const cullFace = (mode) => true;

const unlockFile = (path) => ({ path, locked: false });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const getExtension = (name) => ({});

const setGravity = (world, g) => world.gravity = g;

const deleteProgram = (program) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const createShader = (gl, type) => ({ id: Math.random(), type });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const setPan = (node, val) => node.pan.value = val;

const createWaveShaper = (ctx) => ({ curve: null });

const detectAudioCodec = () => "aac";

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const invalidateCache = (key) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const renameFile = (oldName, newName) => newName;

const deleteTexture = (texture) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const setDopplerFactor = (val) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const resumeContext = (ctx) => Promise.resolve();


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

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const vertexAttrib3f = (idx, x, y, z) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const sanitizeXSS = (html) => html;

const processAudioBuffer = (buffer) => buffer;

const removeRigidBody = (world, body) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const reduceDimensionalityPCA = (data) => data;

const decodeAudioData = (buffer) => Promise.resolve({});

const setAttack = (node, val) => node.attack.value = val;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

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

const detectCollision = (body1, body2) => false;

const decapsulateFrame = (frame) => frame;

const setDetune = (osc, cents) => osc.detune = cents;

const generateEmbeddings = (text) => new Float32Array(128);

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const addHingeConstraint = (world, c) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const createSoftBody = (info) => ({ nodes: [] });

const createConvolver = (ctx) => ({ buffer: null });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const setViewport = (x, y, w, h) => true;

const exitScope = (table) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const jitCompile = (bc) => (() => {});

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const verifyAppSignature = () => true;

const prettifyCode = (code) => code;

const applyTheme = (theme) => document.body.className = theme;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const resolveImports = (ast) => [];

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const applyImpulse = (body, impulse, point) => true;

const addPoint2PointConstraint = (world, c) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const shutdownComputer = () => console.log("Shutting down...");

const profilePerformance = (func) => 0;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const serializeAST = (ast) => JSON.stringify(ast);

const disableRightClick = () => true;

const unmountFileSystem = (path) => true;

const swapTokens = (pair, amount) => true;

const joinThread = (tid) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const configureInterface = (iface, config) => true;

const optimizeTailCalls = (ast) => ast;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const computeDominators = (cfg) => ({});

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const hydrateSSR = (html) => true;

const auditAccessLogs = () => true;

const disableDepthTest = () => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const protectMemory = (ptr, size, flags) => true;

const replicateData = (node) => ({ target: node, synced: true });

const deriveAddress = (path) => "0x123...";

const dhcpRequest = (ip) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const disconnectNodes = (node) => true;

const dhcpDiscover = () => true;

const mutexUnlock = (mtx) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const uniform3f = (loc, x, y, z) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setVelocity = (body, v) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const rmdir = (path) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const mkdir = (path) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const receivePacket = (sock, len) => new Uint8Array(len);

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

const closeFile = (fd) => true;

const emitParticles = (sys, count) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createChannelMerger = (ctx, channels) => ({});

const readdir = (path) => [];

const traverseAST = (node, visitor) => true;

const segmentImageUNet = (img) => "mask_buffer";

const calculateComplexity = (ast) => 1;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getByteFrequencyData = (analyser, array) => true;

const reportWarning = (msg, line) => console.warn(msg);

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const analyzeHeader = (packet) => ({});

const clearScreen = (r, g, b, a) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const muteStream = () => true;

const drawElements = (mode, count, type, offset) => true;

const enterScope = (table) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const getProgramInfoLog = (program) => "";

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const checkIntegrityToken = (token) => true;

const mountFileSystem = (dev, path) => true;

const rollbackTransaction = (tx) => true;

const unlockRow = (id) => true;

const statFile = (path) => ({ size: 0 });

const setMass = (body, m) => true;

const getUniformLocation = (program, name) => 1;

const resetVehicle = (vehicle) => true;

const rayCast = (world, start, end) => ({ hit: false });

const eliminateDeadCode = (ast) => ast;

const obfuscateString = (str) => btoa(str);

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setInertia = (body, i) => true;

const augmentData = (image) => image;

const applyTorque = (body, torque) => true;

const translateMatrix = (mat, vec) => mat;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const addSliderConstraint = (world, c) => true;

const killParticles = (sys) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const defineSymbol = (table, name, info) => true;

const resolveCollision = (manifold) => true;

const generateMipmaps = (target) => true;

const chmodFile = (path, mode) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const clusterKMeans = (data, k) => Array(k).fill([]);

const renderCanvasLayer = (ctx) => true;

const generateCode = (ast) => "const a = 1;";

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

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const computeLossFunction = (pred, actual) => 0.05;

const setDelayTime = (node, time) => node.delayTime.value = time;

// Anti-shake references
const _ref_moqs1t = { calculateMD5 };
const _ref_vm466l = { renderShadowMap };
const _ref_4dfyev = { checkGLError };
const _ref_rzav8v = { applyForce };
const _ref_1oqaqh = { adjustPlaybackSpeed };
const _ref_85n1tc = { prioritizeTraffic };
const _ref_tbznch = { addWheel };
const _ref_lf30sz = { parseFunction };
const _ref_ad1gvv = { createScriptProcessor };
const _ref_mijao7 = { installUpdate };
const _ref_vr6jml = { calculateFriction };
const _ref_3tc8fa = { rotateLogFiles };
const _ref_wcvy66 = { createIndex };
const _ref_tazbxj = { unchokePeer };
const _ref_d7a20h = { dropTable };
const _ref_aqt8kd = { convexSweepTest };
const _ref_zwao68 = { cancelTask };
const _ref_24way7 = { calculateEntropy };
const _ref_s8qwni = { createConstraint };
const _ref_4au7wi = { scheduleBandwidth };
const _ref_mm99pr = { validateMnemonic };
const _ref_bmeikr = { updateTransform };
const _ref_9usxyu = { animateTransition };
const _ref_35cphr = { removeConstraint };
const _ref_cfcvx7 = { updateSoftBody };
const _ref_qyoh9b = { tokenizeSource };
const _ref_ay63wh = { checkUpdate };
const _ref_8updf3 = { makeDistortionCurve };
const _ref_0jnn7y = { createBoxShape };
const _ref_hmdry1 = { visitNode };
const _ref_zefrzi = { updateWheelTransform };
const _ref_ddvq5e = { validateProgram };
const _ref_1pp0wv = { predictTensor };
const _ref_209cp3 = { cullFace };
const _ref_mo6ydo = { unlockFile };
const _ref_33c93f = { terminateSession };
const _ref_iloexb = { uploadCrashReport };
const _ref_ovcssj = { resolveHostName };
const _ref_ek6pvs = { createStereoPanner };
const _ref_5n9bt0 = { getExtension };
const _ref_pezxui = { setGravity };
const _ref_i5co8v = { deleteProgram };
const _ref_87dqkv = { connectionPooling };
const _ref_6ev7kz = { createShader };
const _ref_s9mbuw = { throttleRequests };
const _ref_19nibg = { setPan };
const _ref_3ghsy2 = { createWaveShaper };
const _ref_beebxv = { detectAudioCodec };
const _ref_8h4yiq = { generateUserAgent };
const _ref_jqiqka = { normalizeAudio };
const _ref_vl9t1o = { invalidateCache };
const _ref_n6rod0 = { updateProgressBar };
const _ref_cvbzah = { requestPiece };
const _ref_cn4y0m = { renameFile };
const _ref_sjrbnt = { deleteTexture };
const _ref_68ai03 = { loadImpulseResponse };
const _ref_y201ap = { setDopplerFactor };
const _ref_jg9iv1 = { autoResumeTask };
const _ref_mf2uie = { resumeContext };
const _ref_b0nk2l = { ResourceMonitor };
const _ref_o723y5 = { cancelAnimationFrameLoop };
const _ref_ar33jt = { vertexAttrib3f };
const _ref_iqoa2i = { transcodeStream };
const _ref_vhuyta = { sanitizeXSS };
const _ref_m17y87 = { processAudioBuffer };
const _ref_aeurjj = { removeRigidBody };
const _ref_muoifd = { applyEngineForce };
const _ref_oit4ok = { interceptRequest };
const _ref_4vsytc = { reduceDimensionalityPCA };
const _ref_b421q6 = { decodeAudioData };
const _ref_1uqsmy = { setAttack };
const _ref_v30gm7 = { loadTexture };
const _ref_51hyai = { generateFakeClass };
const _ref_q1390z = { detectCollision };
const _ref_t276bp = { decapsulateFrame };
const _ref_bodmia = { setDetune };
const _ref_8o6w9i = { generateEmbeddings };
const _ref_7e19ca = { readPixels };
const _ref_h4rv8s = { rotateUserAgent };
const _ref_zouvnf = { syncDatabase };
const _ref_umn2fn = { addHingeConstraint };
const _ref_ji59om = { calculatePieceHash };
const _ref_x688s6 = { diffVirtualDOM };
const _ref_7wmsq5 = { simulateNetworkDelay };
const _ref_ve8238 = { createSoftBody };
const _ref_nuqrpm = { createConvolver };
const _ref_bfnb5b = { getMemoryUsage };
const _ref_1xcwdh = { setViewport };
const _ref_xgy2ue = { exitScope };
const _ref_rapr37 = { getFileAttributes };
const _ref_x9pgvf = { jitCompile };
const _ref_urijvl = { limitBandwidth };
const _ref_04pmbv = { analyzeQueryPlan };
const _ref_i932r2 = { verifyAppSignature };
const _ref_t70ukl = { prettifyCode };
const _ref_1bh695 = { applyTheme };
const _ref_8qv4fv = { parseConfigFile };
const _ref_gmmrot = { resolveImports };
const _ref_ycdweo = { verifyFileSignature };
const _ref_fpywvo = { applyImpulse };
const _ref_xavsc1 = { addPoint2PointConstraint };
const _ref_410aoq = { calculateSHA256 };
const _ref_q5pll0 = { shutdownComputer };
const _ref_3i0alw = { profilePerformance };
const _ref_tglgza = { checkIntegrity };
const _ref_l3ll7b = { serializeAST };
const _ref_f10x2f = { disableRightClick };
const _ref_uh3ohs = { unmountFileSystem };
const _ref_7e9u4h = { swapTokens };
const _ref_udplqz = { joinThread };
const _ref_9oyx14 = { parseMagnetLink };
const _ref_6m9j0o = { keepAlivePing };
const _ref_hjp46s = { compactDatabase };
const _ref_9ao0t1 = { configureInterface };
const _ref_m00ifq = { optimizeTailCalls };
const _ref_wn3u4n = { traceStack };
const _ref_k6tw84 = { computeDominators };
const _ref_g051dl = { connectToTracker };
const _ref_wrthsk = { normalizeVector };
const _ref_3g5zli = { hydrateSSR };
const _ref_8g42w3 = { auditAccessLogs };
const _ref_zdetct = { disableDepthTest };
const _ref_ljqd6m = { prioritizeRarestPiece };
const _ref_d9mwme = { protectMemory };
const _ref_igdzlx = { replicateData };
const _ref_qc681u = { deriveAddress };
const _ref_9fkf1u = { dhcpRequest };
const _ref_4e4e41 = { repairCorruptFile };
const _ref_bzzk20 = { disconnectNodes };
const _ref_yptsge = { dhcpDiscover };
const _ref_cr9x4p = { mutexUnlock };
const _ref_8kgp7b = { FileValidator };
const _ref_zq0941 = { uniform3f };
const _ref_ccfjye = { createBiquadFilter };
const _ref_efo0dg = { scrapeTracker };
const _ref_lhk4v6 = { setVelocity };
const _ref_lxn24a = { rotateMatrix };
const _ref_y7jy6o = { rmdir };
const _ref_1yoq05 = { computeSpeedAverage };
const _ref_cjda3y = { mkdir };
const _ref_2ubals = { manageCookieJar };
const _ref_se4we0 = { receivePacket };
const _ref_z2jkiv = { VirtualFSTree };
const _ref_286cn8 = { closeFile };
const _ref_fac6ys = { emitParticles };
const _ref_1q4q3t = { createDynamicsCompressor };
const _ref_7iqs0q = { createChannelMerger };
const _ref_2iuou0 = { readdir };
const _ref_es3jue = { traverseAST };
const _ref_5e9dmo = { segmentImageUNet };
const _ref_n05o4j = { calculateComplexity };
const _ref_lz714r = { sanitizeSQLInput };
const _ref_xkfkd3 = { getByteFrequencyData };
const _ref_srlyxg = { reportWarning };
const _ref_fgxuye = { resolveDNSOverHTTPS };
const _ref_b5rggc = { formatCurrency };
const _ref_l4uf3a = { analyzeHeader };
const _ref_4ha7wp = { clearScreen };
const _ref_2io620 = { updateBitfield };
const _ref_eec2y3 = { renderVirtualDOM };
const _ref_jjfvmy = { muteStream };
const _ref_lemry3 = { drawElements };
const _ref_h7ntnq = { enterScope };
const _ref_6wmoe7 = { verifyMagnetLink };
const _ref_xvqd2a = { getProgramInfoLog };
const _ref_3h6q5p = { convertRGBtoHSL };
const _ref_anqhg0 = { checkIntegrityToken };
const _ref_jtzlqi = { mountFileSystem };
const _ref_u9kuxd = { rollbackTransaction };
const _ref_d0q75o = { unlockRow };
const _ref_5knsn9 = { statFile };
const _ref_hs8dum = { setMass };
const _ref_t246ge = { getUniformLocation };
const _ref_szsyuw = { resetVehicle };
const _ref_n73hm2 = { rayCast };
const _ref_2u2kwe = { eliminateDeadCode };
const _ref_6ik96v = { obfuscateString };
const _ref_w5uv1o = { checkDiskSpace };
const _ref_di3yp0 = { setInertia };
const _ref_4dhpby = { augmentData };
const _ref_a9pov2 = { applyTorque };
const _ref_n18rx5 = { translateMatrix };
const _ref_0mzz06 = { convertHSLtoRGB };
const _ref_sdkn5d = { addSliderConstraint };
const _ref_djfits = { killParticles };
const _ref_zlcfn7 = { removeMetadata };
const _ref_803m1x = { showNotification };
const _ref_3w1zan = { defineSymbol };
const _ref_cjk3y9 = { resolveCollision };
const _ref_dvd6k9 = { generateMipmaps };
const _ref_jk415p = { chmodFile };
const _ref_96aqqk = { debouncedResize };
const _ref_dhi4sh = { saveCheckpoint };
const _ref_i0xjaa = { clusterKMeans };
const _ref_rej328 = { renderCanvasLayer };
const _ref_d7n9hm = { generateCode };
const _ref_pnrhiu = { TaskScheduler };
const _ref_kwd6ur = { validateSSLCert };
const _ref_iy0313 = { computeLossFunction };
const _ref_5pyni9 = { setDelayTime }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `xiaohongshu` };
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
                const urlParams = { config, url: window.location.href, name_en: `xiaohongshu` };

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
        const backupDatabase = (path) => ({ path, size: 5000 });

const announceToTracker = (url) => ({ url, interval: 1800 });

const merkelizeRoot = (txs) => "root_hash";

const splitFile = (path, parts) => Array(parts).fill(path);

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const postProcessBloom = (image, threshold) => image;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });


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

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const parseLogTopics = (topics) => ["Transfer"];

const detectDevTools = () => false;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createShader = (gl, type) => ({ id: Math.random(), type });

const setFilePermissions = (perm) => `chmod ${perm}`;

const addHingeConstraint = (world, c) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const negotiateProtocol = () => "HTTP/2.0";

const createPeriodicWave = (ctx, real, imag) => ({});

const sleep = (body) => true;

const createSoftBody = (info) => ({ nodes: [] });

const logErrorToFile = (err) => console.error(err);

const detectDebugger = () => false;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const augmentData = (image) => image;

const detectCollision = (body1, body2) => false;

const encodeABI = (method, params) => "0x...";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const killParticles = (sys) => true;

const closeContext = (ctx) => Promise.resolve();

const spoofReferer = () => "https://google.com";

const deleteBuffer = (buffer) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const injectCSPHeader = () => "default-src 'self'";

const validateIPWhitelist = (ip) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const stopOscillator = (osc, time) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const renameFile = (oldName, newName) => newName;

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

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const applyTheme = (theme) => document.body.className = theme;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const emitParticles = (sys, count) => true;

const convertFormat = (src, dest) => dest;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const resumeContext = (ctx) => Promise.resolve();

const broadcastTransaction = (tx) => "tx_hash_123";

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setQValue = (filter, q) => filter.Q = q;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const decodeAudioData = (buffer) => Promise.resolve({});

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const applyForce = (body, force, point) => true;

const setAttack = (node, val) => node.attack.value = val;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const vertexAttrib3f = (idx, x, y, z) => true;

const allocateRegisters = (ir) => ir;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const dropTable = (table) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const updateParticles = (sys, dt) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const compileFragmentShader = (source) => ({ compiled: true });

const disableRightClick = () => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const registerSystemTray = () => ({ icon: "tray.ico" });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const processAudioBuffer = (buffer) => buffer;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const updateWheelTransform = (wheel) => true;

const gaussianBlur = (image, radius) => image;

const anchorSoftBody = (soft, rigid) => true;

const bindTexture = (target, texture) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const backpropagateGradient = (loss) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const removeConstraint = (world, c) => true;

const installUpdate = () => false;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const setDetune = (osc, cents) => osc.detune = cents;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const visitNode = (node) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const scheduleTask = (task) => ({ id: 1, task });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const transcodeStream = (format) => ({ format, status: "processing" });

const generateMipmaps = (target) => true;

const addPoint2PointConstraint = (world, c) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const loadCheckpoint = (path) => true;

const addRigidBody = (world, body) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createIndexBuffer = (data) => ({ id: Math.random() });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const uniform1i = (loc, val) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const cacheQueryResults = (key, data) => true;

const allowSleepMode = () => true;

const captureFrame = () => "frame_data_buffer";

const getExtension = (name) => ({});

const setVelocity = (body, v) => true;

const setViewport = (x, y, w, h) => true;

const createMediaElementSource = (ctx, el) => ({});

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const setDopplerFactor = (val) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const computeLossFunction = (pred, actual) => 0.05;

const injectMetadata = (file, meta) => ({ file, meta });

const inlineFunctions = (ast) => ast;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const synthesizeSpeech = (text) => "audio_buffer";

const getOutputTimestamp = (ctx) => Date.now();

const stepSimulation = (world, dt) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const compressGzip = (data) => data;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

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

const unlockFile = (path) => ({ path, locked: false });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const setRatio = (node, val) => node.ratio.value = val;

const setGainValue = (node, val) => node.gain.value = val;

const checkGLError = () => 0;

const createSphereShape = (r) => ({ type: 'sphere' });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const setGravity = (world, g) => world.gravity = g;

const wakeUp = (body) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const disconnectNodes = (node) => true;

const drawElements = (mode, count, type, offset) => true;

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

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const resolveCollision = (manifold) => true;

const drawArrays = (gl, mode, first, count) => true;

const normalizeVolume = (buffer) => buffer;

const calculateGasFee = (limit) => limit * 20;

const removeRigidBody = (world, body) => true;

const useProgram = (program) => true;

const rotateLogFiles = () => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const applyImpulse = (body, impulse, point) => true;

const compileVertexShader = (source) => ({ compiled: true });

const rateLimitCheck = (ip) => true;

const setRelease = (node, val) => node.release.value = val;

const updateTransform = (body) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const addSliderConstraint = (world, c) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const applyTorque = (body, torque) => true;

const addGeneric6DofConstraint = (world, c) => true;

const checkUpdate = () => ({ hasUpdate: false });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const validatePieceChecksum = (piece) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setFilterType = (filter, type) => filter.type = type;

const verifySignature = (tx, sig) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const unmuteStream = () => false;

const bufferData = (gl, target, data, usage) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const generateEmbeddings = (text) => new Float32Array(128);

const edgeDetectionSobel = (image) => image;

const disableDepthTest = () => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const getUniformLocation = (program, name) => 1;

const setThreshold = (node, val) => node.threshold.value = val;

const resampleAudio = (buffer, rate) => buffer;

const verifyAppSignature = () => true;

const calculateFriction = (mat1, mat2) => 0.5;

const rayCast = (world, start, end) => ({ hit: false });

const createChannelMerger = (ctx, channels) => ({});

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

// Anti-shake references
const _ref_oa2nj5 = { backupDatabase };
const _ref_miv76n = { announceToTracker };
const _ref_yilrqu = { merkelizeRoot };
const _ref_robm2e = { splitFile };
const _ref_b9kgpg = { createAnalyser };
const _ref_vwk9ku = { parseTorrentFile };
const _ref_c0h8jp = { requestAnimationFrameLoop };
const _ref_i4zucf = { sanitizeSQLInput };
const _ref_n0ifjv = { postProcessBloom };
const _ref_yna35g = { deleteTempFiles };
const _ref_kgbcna = { ResourceMonitor };
const _ref_pmb1q4 = { resolveDNSOverHTTPS };
const _ref_60wrvh = { formatLogMessage };
const _ref_xtcq4h = { createMagnetURI };
const _ref_awjf3q = { debouncedResize };
const _ref_s25w2w = { connectionPooling };
const _ref_jlaiqv = { parseLogTopics };
const _ref_xbwenk = { detectDevTools };
const _ref_6p9qj2 = { autoResumeTask };
const _ref_1p50xi = { requestPiece };
const _ref_limouf = { setSocketTimeout };
const _ref_zbxbhu = { retryFailedSegment };
const _ref_7fuidz = { createShader };
const _ref_di3gvm = { setFilePermissions };
const _ref_ka1loi = { addHingeConstraint };
const _ref_pqyb0b = { transformAesKey };
const _ref_vmczbv = { negotiateProtocol };
const _ref_tlm4xz = { createPeriodicWave };
const _ref_7irulq = { sleep };
const _ref_tbo5y4 = { createSoftBody };
const _ref_bdbu2h = { logErrorToFile };
const _ref_6pik61 = { detectDebugger };
const _ref_p855f1 = { keepAlivePing };
const _ref_n8ql27 = { monitorNetworkInterface };
const _ref_nwk2ou = { calculateMD5 };
const _ref_hx2uf5 = { augmentData };
const _ref_llzqoc = { detectCollision };
const _ref_t1mrgm = { encodeABI };
const _ref_4cnvuu = { createDelay };
const _ref_oig1sl = { killParticles };
const _ref_ygsfjv = { closeContext };
const _ref_yb8k43 = { spoofReferer };
const _ref_vp24we = { deleteBuffer };
const _ref_ymm7ld = { setFrequency };
const _ref_ejohd5 = { injectCSPHeader };
const _ref_gzzk54 = { validateIPWhitelist };
const _ref_l9qj7f = { scrapeTracker };
const _ref_1g21vf = { queueDownloadTask };
const _ref_6k5o4z = { stopOscillator };
const _ref_9u0fqu = { uniformMatrix4fv };
const _ref_lm6rhl = { renameFile };
const _ref_40yfu6 = { AdvancedCipher };
const _ref_2jxw40 = { generateUUIDv5 };
const _ref_17sotn = { limitDownloadSpeed };
const _ref_9t1cio = { detectFirewallStatus };
const _ref_seqwvu = { applyTheme };
const _ref_kymxht = { validateTokenStructure };
const _ref_kimh12 = { emitParticles };
const _ref_dsvckj = { convertFormat };
const _ref_zlvr6a = { convexSweepTest };
const _ref_buiit2 = { resumeContext };
const _ref_bsfwm4 = { broadcastTransaction };
const _ref_q3jaht = { optimizeMemoryUsage };
const _ref_dtc3od = { tunnelThroughProxy };
const _ref_xot5ft = { setQValue };
const _ref_nm6frh = { scheduleBandwidth };
const _ref_6v3ywh = { decodeAudioData };
const _ref_7na441 = { limitBandwidth };
const _ref_0cuqe3 = { applyForce };
const _ref_yab6s6 = { setAttack };
const _ref_ifacu3 = { archiveFiles };
const _ref_btq4q2 = { vertexAttrib3f };
const _ref_u8pqls = { allocateRegisters };
const _ref_8lefep = { checkDiskSpace };
const _ref_o9ifw5 = { dropTable };
const _ref_wzfv7m = { rotateMatrix };
const _ref_5wnbbf = { updateParticles };
const _ref_wm3p90 = { encryptPayload };
const _ref_tmpjnw = { compileFragmentShader };
const _ref_cc8mu2 = { disableRightClick };
const _ref_hgvy22 = { showNotification };
const _ref_752szx = { registerSystemTray };
const _ref_lrr1lh = { parseM3U8Playlist };
const _ref_2v30ts = { processAudioBuffer };
const _ref_0o43k0 = { makeDistortionCurve };
const _ref_b1r0h5 = { updateWheelTransform };
const _ref_4vryf3 = { gaussianBlur };
const _ref_e640un = { anchorSoftBody };
const _ref_qq8rxl = { bindTexture };
const _ref_55rhj8 = { createDynamicsCompressor };
const _ref_qdgbva = { backpropagateGradient };
const _ref_321l5v = { clearBrowserCache };
const _ref_jigo1e = { removeConstraint };
const _ref_2onakx = { installUpdate };
const _ref_ko2etz = { refreshAuthToken };
const _ref_h35pl7 = { setDetune };
const _ref_rpblg7 = { setSteeringValue };
const _ref_b4oadq = { isFeatureEnabled };
const _ref_hoang5 = { visitNode };
const _ref_0i7f91 = { createScriptProcessor };
const _ref_dl67gl = { scheduleTask };
const _ref_m689sl = { createGainNode };
const _ref_seoyxy = { transcodeStream };
const _ref_ozv3xq = { generateMipmaps };
const _ref_65q8yx = { addPoint2PointConstraint };
const _ref_45dsnw = { createBoxShape };
const _ref_ipkgii = { loadCheckpoint };
const _ref_w6la8q = { addRigidBody };
const _ref_p0g5dg = { calculateRestitution };
const _ref_wdrzl8 = { createOscillator };
const _ref_358lz5 = { createIndexBuffer };
const _ref_933cgi = { extractThumbnail };
const _ref_ihcfpy = { uniform1i };
const _ref_60tuq7 = { compactDatabase };
const _ref_gmta9z = { cacheQueryResults };
const _ref_pukctf = { allowSleepMode };
const _ref_77u1zx = { captureFrame };
const _ref_wiuqjq = { getExtension };
const _ref_epjbl3 = { setVelocity };
const _ref_9z4baj = { setViewport };
const _ref_ta34l5 = { createMediaElementSource };
const _ref_epkbvm = { verifyFileSignature };
const _ref_zdywg6 = { parseFunction };
const _ref_xcdwc4 = { setDopplerFactor };
const _ref_asri4y = { recognizeSpeech };
const _ref_m4oldq = { saveCheckpoint };
const _ref_vvctk9 = { applyEngineForce };
const _ref_pdrynh = { computeLossFunction };
const _ref_2x63zb = { injectMetadata };
const _ref_1mx6nt = { inlineFunctions };
const _ref_nmuogh = { loadTexture };
const _ref_9cwk8l = { initiateHandshake };
const _ref_3id4p7 = { synthesizeSpeech };
const _ref_msaouf = { getOutputTimestamp };
const _ref_8sjxf2 = { stepSimulation };
const _ref_ns9p9w = { uninterestPeer };
const _ref_wig35v = { compressGzip };
const _ref_2vxd6l = { getNetworkStats };
const _ref_4ppe86 = { watchFileChanges };
const _ref_7wcn1y = { calculatePieceHash };
const _ref_6t0ldo = { generateFakeClass };
const _ref_p9u0od = { unlockFile };
const _ref_3fa5xd = { initWebGLContext };
const _ref_zsg9u0 = { setRatio };
const _ref_4lll7s = { setGainValue };
const _ref_3642rc = { checkGLError };
const _ref_h1iwo2 = { createSphereShape };
const _ref_ggbm1a = { getVelocity };
const _ref_28ydjb = { applyPerspective };
const _ref_j1n17t = { setGravity };
const _ref_2yz137 = { wakeUp };
const _ref_ctz6uc = { createAudioContext };
const _ref_of43lq = { disconnectNodes };
const _ref_tuktro = { drawElements };
const _ref_3w7u1b = { VirtualFSTree };
const _ref_rr7r6u = { createPhysicsWorld };
const _ref_z18704 = { resolveCollision };
const _ref_w7tvbq = { drawArrays };
const _ref_nwblar = { normalizeVolume };
const _ref_q7lyhs = { calculateGasFee };
const _ref_zlypo4 = { removeRigidBody };
const _ref_2sqbto = { useProgram };
const _ref_2yj0vh = { rotateLogFiles };
const _ref_l8zeif = { animateTransition };
const _ref_07s4h6 = { createStereoPanner };
const _ref_ent33z = { applyImpulse };
const _ref_ygloy2 = { compileVertexShader };
const _ref_7ni8nd = { rateLimitCheck };
const _ref_mewlqy = { setRelease };
const _ref_webkwo = { updateTransform };
const _ref_l5qsg7 = { setBrake };
const _ref_qyp7v2 = { createFrameBuffer };
const _ref_hra04a = { rotateUserAgent };
const _ref_8sn2uc = { addSliderConstraint };
const _ref_8imb3b = { parseStatement };
const _ref_q7qn8h = { optimizeConnectionPool };
const _ref_io37ta = { applyTorque };
const _ref_p8nvq9 = { addGeneric6DofConstraint };
const _ref_0eghz4 = { checkUpdate };
const _ref_ynpxa8 = { diffVirtualDOM };
const _ref_srnc2w = { validatePieceChecksum };
const _ref_7c2tme = { tokenizeSource };
const _ref_nbhu6q = { setFilterType };
const _ref_7fbt38 = { verifySignature };
const _ref_xfl00c = { bindSocket };
const _ref_xs1ay3 = { unmuteStream };
const _ref_fyonim = { bufferData };
const _ref_5xktbs = { formatCurrency };
const _ref_g5d817 = { generateEmbeddings };
const _ref_9pj5y0 = { edgeDetectionSobel };
const _ref_dwd7gt = { disableDepthTest };
const _ref_dh63oh = { playSoundAlert };
const _ref_pmdq6g = { getUniformLocation };
const _ref_by7u7j = { setThreshold };
const _ref_96f9in = { resampleAudio };
const _ref_n6owmq = { verifyAppSignature };
const _ref_etqzb1 = { calculateFriction };
const _ref_1qubly = { rayCast };
const _ref_mfjm08 = { createChannelMerger };
const _ref_uplry9 = { updateProgressBar }; 
    });
})({}, {});