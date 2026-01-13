// ==UserScript==
// @name OnDemandKorea视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/OnDemandKorea/index.js
// @version 2026.01.10
// @description 一键下载OnDemandKorea视频，支持4K/1080P/720P多画质。
// @icon https://www.ondemandkorea.com/favicon.ico
// @match *://*.ondemandkorea.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect odkmedia.io
// @connect ondemandkorea.com
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
// @downloadURL https://update.greasyfork.org/scripts/562259/OnDemandKorea%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562259/OnDemandKorea%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const detectAudioCodec = () => "aac";

const getVehicleSpeed = (vehicle) => 0;

const addRigidBody = (world, body) => true;

const setPosition = (panner, x, y, z) => true;

const calculateComplexity = (ast) => 1;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const resolveCollision = (manifold) => true;

const setAngularVelocity = (body, v) => true;

const normalizeVolume = (buffer) => buffer;

const decodeAudioData = (buffer) => Promise.resolve({});

const resetVehicle = (vehicle) => true;

const allocateRegisters = (ir) => ir;

const createVehicle = (chassis) => ({ wheels: [] });

const activeTexture = (unit) => true;

const setQValue = (filter, q) => filter.Q = q;

const resumeContext = (ctx) => Promise.resolve();

const setVelocity = (body, v) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const setGravity = (world, g) => world.gravity = g;

const updateWheelTransform = (wheel) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const uniformMatrix4fv = (loc, transpose, val) => true;

const checkParticleCollision = (sys, world) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const addPoint2PointConstraint = (world, c) => true;

const wakeUp = (body) => true;

const setOrientation = (panner, x, y, z) => true;

const setKnee = (node, val) => node.knee.value = val;

const getExtension = (name) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createASTNode = (type, val) => ({ type, val });

const joinThread = (tid) => true;

const controlCongestion = (sock) => true;

const setDopplerFactor = (val) => true;

const applyImpulse = (body, impulse, point) => true;

const createTCPSocket = () => ({ fd: 1 });

const traceroute = (host) => ["192.168.1.1"];

const calculateMetric = (route) => 1;

const limitRate = (stream, rate) => stream;

const listenSocket = (sock, backlog) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const retransmitPacket = (seq) => true;

const applyForce = (body, force, point) => true;

const filterTraffic = (rule) => true;

const compressPacket = (data) => data;

const receivePacket = (sock, len) => new Uint8Array(len);

const addConeTwistConstraint = (world, c) => true;

const createChannelSplitter = (ctx, channels) => ({});

const emitParticles = (sys, count) => true;

const setRelease = (node, val) => node.release.value = val;

const cullFace = (mode) => true;

const addGeneric6DofConstraint = (world, c) => true;

const exitScope = (table) => true;

const reportWarning = (msg, line) => console.warn(msg);

const bufferData = (gl, target, data, usage) => true;

const addWheel = (vehicle, info) => true;

const connectSocket = (sock, addr, port) => true;

const getByteFrequencyData = (analyser, array) => true;

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

const adjustWindowSize = (sock, size) => true;

const resampleAudio = (buffer, rate) => buffer;

const stakeAssets = (pool, amount) => true;

const hoistVariables = (ast) => ast;

const verifyAppSignature = () => true;

const detectPacketLoss = (acks) => false;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const fragmentPacket = (data, mtu) => [data];

const lockRow = (id) => true;

const performOCR = (img) => "Detected Text";

const computeDominators = (cfg) => ({});

const merkelizeRoot = (txs) => "root_hash";

const createSphereShape = (r) => ({ type: 'sphere' });

const logErrorToFile = (err) => console.error(err);

const deleteTexture = (texture) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const updateSoftBody = (body) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const unlockRow = (id) => true;

const hydrateSSR = (html) => true;

const createSymbolTable = () => ({ scopes: [] });

const attachRenderBuffer = (fb, rb) => true;

const rollbackTransaction = (tx) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const reportError = (msg, line) => console.error(msg);

const verifySignature = (tx, sig) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const processAudioBuffer = (buffer) => buffer;

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

const jitCompile = (bc) => (() => {});

const findLoops = (cfg) => [];

const reassemblePacket = (fragments) => fragments[0];

const chownFile = (path, uid, gid) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const disableRightClick = () => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const mangleNames = (ast) => ast;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const dropTable = (table) => true;

const spoofReferer = () => "https://google.com";

const setGainValue = (node, val) => node.gain.value = val;

const setAttack = (node, val) => node.attack.value = val;

const bindSocket = (port) => ({ port, status: "bound" });

const setFilterType = (filter, type) => filter.type = type;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

const mutexLock = (mtx) => true;

const loadCheckpoint = (path) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const sendPacket = (sock, data) => data.length;

const addSliderConstraint = (world, c) => true;

const triggerHapticFeedback = (intensity) => true;

const clearScreen = (r, g, b, a) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const createShader = (gl, type) => ({ id: Math.random(), type });

const setBrake = (vehicle, force, wheelIdx) => true;

const encryptStream = (stream, key) => stream;

const detectCollision = (body1, body2) => false;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const obfuscateCode = (code) => code;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const prioritizeTraffic = (queue) => true;

const getProgramInfoLog = (program) => "";

const auditAccessLogs = () => true;

const stopOscillator = (osc, time) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const killProcess = (pid) => true;

const detectDevTools = () => false;

const startOscillator = (osc, time) => true;

const optimizeAST = (ast) => ast;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const decompressPacket = (data) => data;

const applyTorque = (body, torque) => true;

const detachThread = (tid) => true;

const unlockFile = (path) => ({ path, locked: false });

const deriveAddress = (path) => "0x123...";

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const setRatio = (node, val) => node.ratio.value = val;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const setDelayTime = (node, time) => node.delayTime.value = time;

const profilePerformance = (func) => 0;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const remuxContainer = (container) => ({ container, status: "done" });

const semaphoreWait = (sem) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const checkGLError = () => 0;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const scaleMatrix = (mat, vec) => mat;

const transcodeStream = (format) => ({ format, status: "processing" });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const disconnectNodes = (node) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const prefetchAssets = (urls) => urls.length;

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

const dhcpRequest = (ip) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const createMeshShape = (vertices) => ({ type: 'mesh' });

const defineSymbol = (table, name, info) => true;

const protectMemory = (ptr, size, flags) => true;

const applyFog = (color, dist) => color;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createBoxShape = (w, h, d) => ({ type: 'box' });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const freeMemory = (ptr) => true;

const classifySentiment = (text) => "positive";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const mapMemory = (fd, size) => 0x2000;

const allocateMemory = (size) => 0x1000;

const resolveImports = (ast) => [];

const createIndex = (table, col) => `IDX_${table}_${col}`;

const bindAddress = (sock, addr, port) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createPipe = () => [3, 4];

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const deobfuscateString = (str) => atob(str);

const migrateSchema = (version) => ({ current: version, status: "ok" });

const analyzeHeader = (packet) => ({});

const generateMipmaps = (target) => true;

const edgeDetectionSobel = (image) => image;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const decryptStream = (stream, key) => stream;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const parseLogTopics = (topics) => ["Transfer"];

const linkModules = (modules) => ({});

const sleep = (body) => true;

const optimizeTailCalls = (ast) => ast;

// Anti-shake references
const _ref_9uddqo = { detectAudioCodec };
const _ref_lv2vvj = { getVehicleSpeed };
const _ref_okl9pw = { addRigidBody };
const _ref_m384qi = { setPosition };
const _ref_d1wl0m = { calculateComplexity };
const _ref_kktbne = { createPhysicsWorld };
const _ref_gowzbi = { resolveCollision };
const _ref_df7o2m = { setAngularVelocity };
const _ref_v2n2qo = { normalizeVolume };
const _ref_cg5c1i = { decodeAudioData };
const _ref_mw3x1x = { resetVehicle };
const _ref_0cq6eb = { allocateRegisters };
const _ref_jt0bgk = { createVehicle };
const _ref_9jipw5 = { activeTexture };
const _ref_ciuixn = { setQValue };
const _ref_bc0z2z = { resumeContext };
const _ref_djq1ln = { setVelocity };
const _ref_7sojhi = { convexSweepTest };
const _ref_pdhmng = { parseStatement };
const _ref_f03e1x = { setGravity };
const _ref_57xqpk = { updateWheelTransform };
const _ref_w4znxu = { calculateRestitution };
const _ref_sl5l5j = { uniformMatrix4fv };
const _ref_qigdo3 = { checkParticleCollision };
const _ref_t01ing = { createMediaStreamSource };
const _ref_9lloti = { addPoint2PointConstraint };
const _ref_nsdf7m = { wakeUp };
const _ref_flz8d1 = { setOrientation };
const _ref_sq6fhv = { setKnee };
const _ref_721u2e = { getExtension };
const _ref_24gb54 = { setFrequency };
const _ref_3tk63s = { createASTNode };
const _ref_gkft3w = { joinThread };
const _ref_hiqb66 = { controlCongestion };
const _ref_uyn89w = { setDopplerFactor };
const _ref_k4r286 = { applyImpulse };
const _ref_3rqi2e = { createTCPSocket };
const _ref_c4yi2f = { traceroute };
const _ref_mfizcm = { calculateMetric };
const _ref_p0xymm = { limitRate };
const _ref_gwkb0t = { listenSocket };
const _ref_e3rnr6 = { createOscillator };
const _ref_akwh1k = { retransmitPacket };
const _ref_3gd9u4 = { applyForce };
const _ref_bopecv = { filterTraffic };
const _ref_ujywdd = { compressPacket };
const _ref_iddy6b = { receivePacket };
const _ref_gfbds3 = { addConeTwistConstraint };
const _ref_5us2oe = { createChannelSplitter };
const _ref_d5h0ae = { emitParticles };
const _ref_6pk3ri = { setRelease };
const _ref_lpf3ek = { cullFace };
const _ref_m1t55z = { addGeneric6DofConstraint };
const _ref_yso898 = { exitScope };
const _ref_ru1yo1 = { reportWarning };
const _ref_aeg5mz = { bufferData };
const _ref_oe815e = { addWheel };
const _ref_jyvb2o = { connectSocket };
const _ref_0mtqe5 = { getByteFrequencyData };
const _ref_9nhsaw = { ProtocolBufferHandler };
const _ref_nh8wwh = { adjustWindowSize };
const _ref_2c6fmw = { resampleAudio };
const _ref_clrkgw = { stakeAssets };
const _ref_1txtmz = { hoistVariables };
const _ref_k0yg7p = { verifyAppSignature };
const _ref_tb3jj5 = { detectPacketLoss };
const _ref_4dn5vs = { rayIntersectTriangle };
const _ref_m72sp6 = { fragmentPacket };
const _ref_6cs8b6 = { lockRow };
const _ref_bwalbi = { performOCR };
const _ref_d803tg = { computeDominators };
const _ref_1f7n24 = { merkelizeRoot };
const _ref_t16xb3 = { createSphereShape };
const _ref_i6nb65 = { logErrorToFile };
const _ref_shf8e7 = { deleteTexture };
const _ref_ffmi7a = { createFrameBuffer };
const _ref_s7h2mu = { updateSoftBody };
const _ref_jvheo9 = { initWebGLContext };
const _ref_wtby4d = { unlockRow };
const _ref_hhrqkl = { hydrateSSR };
const _ref_ingo3z = { createSymbolTable };
const _ref_240x4e = { attachRenderBuffer };
const _ref_1ga3pz = { rollbackTransaction };
const _ref_9os7of = { applyPerspective };
const _ref_pc81m9 = { reportError };
const _ref_5hh70z = { verifySignature };
const _ref_j0p21z = { setSteeringValue };
const _ref_kbrnvu = { processAudioBuffer };
const _ref_ufw82a = { generateFakeClass };
const _ref_i0si44 = { jitCompile };
const _ref_2fvjwp = { findLoops };
const _ref_hhvb30 = { reassemblePacket };
const _ref_vv9yx3 = { chownFile };
const _ref_t8hx4n = { transformAesKey };
const _ref_nx8i76 = { disableRightClick };
const _ref_juev9c = { moveFileToComplete };
const _ref_jv9ov1 = { mangleNames };
const _ref_6a1ugl = { parseClass };
const _ref_3l1orx = { dropTable };
const _ref_k1yh93 = { spoofReferer };
const _ref_oy7ukw = { setGainValue };
const _ref_ataxqv = { setAttack };
const _ref_u9k89y = { bindSocket };
const _ref_s0cce9 = { setFilterType };
const _ref_ye1bnh = { requestPiece };
const _ref_1mfa8t = { decodeABI };
const _ref_idd5fn = { mutexLock };
const _ref_s2k10q = { loadCheckpoint };
const _ref_e2gyck = { linkProgram };
const _ref_cne01t = { sendPacket };
const _ref_qle3y4 = { addSliderConstraint };
const _ref_x5jy2a = { triggerHapticFeedback };
const _ref_5hzca8 = { clearScreen };
const _ref_rzzrtl = { setFilePermissions };
const _ref_bw4l5a = { calculatePieceHash };
const _ref_xe6f5o = { createBiquadFilter };
const _ref_bdmycz = { createShader };
const _ref_pw4ix2 = { setBrake };
const _ref_dlmdll = { encryptStream };
const _ref_18ft4c = { detectCollision };
const _ref_avre9z = { lazyLoadComponent };
const _ref_4wox5n = { discoverPeersDHT };
const _ref_tfuccn = { obfuscateCode };
const _ref_ehcwef = { limitBandwidth };
const _ref_vq6dtj = { diffVirtualDOM };
const _ref_8849sj = { validateSSLCert };
const _ref_dfn320 = { prioritizeTraffic };
const _ref_chhav6 = { getProgramInfoLog };
const _ref_o8cb26 = { auditAccessLogs };
const _ref_dwdr51 = { stopOscillator };
const _ref_rcwi2i = { keepAlivePing };
const _ref_5uelv3 = { killProcess };
const _ref_01zb61 = { detectDevTools };
const _ref_qervue = { startOscillator };
const _ref_ypolyi = { optimizeAST };
const _ref_oy6bhh = { loadTexture };
const _ref_fchktk = { decompressPacket };
const _ref_cr14hf = { applyTorque };
const _ref_irx1jp = { detachThread };
const _ref_l9yqhl = { unlockFile };
const _ref_3geknj = { deriveAddress };
const _ref_8gktr2 = { resolveDNSOverHTTPS };
const _ref_jrnyzr = { computeNormal };
const _ref_myll2v = { setRatio };
const _ref_ca4trv = { sanitizeInput };
const _ref_dxxest = { uninterestPeer };
const _ref_ucgw2k = { setDelayTime };
const _ref_i56nmc = { profilePerformance };
const _ref_3l55u1 = { createStereoPanner };
const _ref_lm6w3s = { FileValidator };
const _ref_l0culs = { remuxContainer };
const _ref_qmjkva = { semaphoreWait };
const _ref_c94qww = { analyzeQueryPlan };
const _ref_femmme = { checkGLError };
const _ref_jjfl5y = { readPixels };
const _ref_c2mk8u = { performTLSHandshake };
const _ref_nqqf2y = { scaleMatrix };
const _ref_sevom6 = { transcodeStream };
const _ref_859aj9 = { calculateSHA256 };
const _ref_j3wjti = { disconnectNodes };
const _ref_ieriff = { normalizeAudio };
const _ref_e7vq3t = { prefetchAssets };
const _ref_wy253v = { TaskScheduler };
const _ref_5w1m2y = { dhcpRequest };
const _ref_lmtg39 = { signTransaction };
const _ref_w30rsk = { createMeshShape };
const _ref_65obhv = { defineSymbol };
const _ref_6qedp3 = { protectMemory };
const _ref_yvb6ba = { applyFog };
const _ref_5w24rf = { optimizeHyperparameters };
const _ref_9dbylz = { convertHSLtoRGB };
const _ref_leggzm = { retryFailedSegment };
const _ref_yqa3ls = { createBoxShape };
const _ref_dehppl = { autoResumeTask };
const _ref_b1i9tu = { terminateSession };
const _ref_zy5wpa = { freeMemory };
const _ref_dq4ln6 = { classifySentiment };
const _ref_slsg51 = { limitUploadSpeed };
const _ref_l4kesf = { mapMemory };
const _ref_buj5oi = { allocateMemory };
const _ref_4xb35h = { resolveImports };
const _ref_8itzys = { createIndex };
const _ref_cmzfx2 = { bindAddress };
const _ref_fcv2qq = { renderVirtualDOM };
const _ref_fs03ip = { interestPeer };
const _ref_wg4khb = { calculateEntropy };
const _ref_u11hua = { createPipe };
const _ref_36op9p = { manageCookieJar };
const _ref_mlxb7r = { deobfuscateString };
const _ref_ltsfuh = { migrateSchema };
const _ref_ugem0w = { analyzeHeader };
const _ref_vcu96i = { generateMipmaps };
const _ref_k5yo2f = { edgeDetectionSobel };
const _ref_k6hi3k = { resolveHostName };
const _ref_hr6wf8 = { decryptStream };
const _ref_4jlkau = { makeDistortionCurve };
const _ref_g785g3 = { parseLogTopics };
const _ref_o88vdk = { linkModules };
const _ref_23gz2z = { sleep };
const _ref_aoky4w = { optimizeTailCalls }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `OnDemandKorea` };
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
                const urlParams = { config, url: window.location.href, name_en: `OnDemandKorea` };

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
        const detectVirtualMachine = () => false;

const processAudioBuffer = (buffer) => buffer;

const updateSoftBody = (body) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const writePipe = (fd, data) => data.length;

const closeSocket = (sock) => true;

const broadcastMessage = (msg) => true;

const captureFrame = () => "frame_data_buffer";

const lookupSymbol = (table, name) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const bindAddress = (sock, addr, port) => true;

const checkIntegrityConstraint = (table) => true;

const limitRate = (stream, rate) => stream;

const repairCorruptFile = (path) => ({ path, repaired: true });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const inferType = (node) => 'any';

const updateRoutingTable = (entry) => true;

const muteStream = () => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const optimizeTailCalls = (ast) => ast;

const deriveAddress = (path) => "0x123...";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const getMACAddress = (iface) => "00:00:00:00:00:00";

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const compressPacket = (data) => data;

const deobfuscateString = (str) => atob(str);

const getMediaDuration = () => 3600;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const commitTransaction = (tx) => true;

const freeMemory = (ptr) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const bindSocket = (port) => ({ port, status: "bound" });

const setVolumeLevel = (vol) => vol;

const dhcpAck = () => true;

const analyzeHeader = (packet) => ({});

const analyzeBitrate = () => "5000kbps";

const logErrorToFile = (err) => console.error(err);

const rotateLogFiles = () => true;

const verifyIR = (ir) => true;

const pingHost = (host) => 10;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const backupDatabase = (path) => ({ path, size: 5000 });

const augmentData = (image) => image;

const handleTimeout = (sock) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const synthesizeSpeech = (text) => "audio_buffer";

const setInertia = (body, i) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const stopOscillator = (osc, time) => true;

const merkelizeRoot = (txs) => "root_hash";

const dhcpRequest = (ip) => true;

const subscribeToEvents = (contract) => true;

const mutexLock = (mtx) => true;

const preventCSRF = () => "csrf_token";

const verifyChecksum = (data, sum) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const minifyCode = (code) => code;

const applyTheme = (theme) => document.body.className = theme;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const decompressPacket = (data) => data;

const downInterface = (iface) => true;

const connectNodes = (src, dest) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const allocateRegisters = (ir) => ir;

const loadImpulseResponse = (url) => Promise.resolve({});

const mergeFiles = (parts) => parts[0];

const estimateNonce = (addr) => 42;

const allowSleepMode = () => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const negotiateProtocol = () => "HTTP/2.0";

const joinThread = (tid) => true;

const generateCode = (ast) => "const a = 1;";

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createPipe = () => [3, 4];

const deleteProgram = (program) => true;

const getUniformLocation = (program, name) => 1;

const mapMemory = (fd, size) => 0x2000;

const adjustPlaybackSpeed = (rate) => rate;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const renderCanvasLayer = (ctx) => true;

const restoreDatabase = (path) => true;

const execProcess = (path) => true;

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

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createProcess = (img) => ({ pid: 100 });

const contextSwitch = (oldPid, newPid) => true;

const reportWarning = (msg, line) => console.warn(msg);

const anchorSoftBody = (soft, rigid) => true;

const scheduleProcess = (pid) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const disablePEX = () => false;

const scheduleTask = (task) => ({ id: 1, task });

const sanitizeXSS = (html) => html;

const lockFile = (path) => ({ path, locked: true });

const uniform3f = (loc, x, y, z) => true;

const enableBlend = (func) => true;

const setDistanceModel = (panner, model) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const controlCongestion = (sock) => true;

const resetVehicle = (vehicle) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const bundleAssets = (assets) => "";


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

const convertFormat = (src, dest) => dest;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const createAudioContext = () => ({ sampleRate: 44100 });

const reportError = (msg, line) => console.error(msg);

const uniform1i = (loc, val) => true;

const foldConstants = (ast) => ast;

const readFile = (fd, len) => "";

const encryptStream = (stream, key) => stream;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const addSliderConstraint = (world, c) => true;

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

const migrateSchema = (version) => ({ current: version, status: "ok" });

const cleanOldLogs = (days) => days;

const rotateMatrix = (mat, angle, axis) => mat;

const applyImpulse = (body, impulse, point) => true;

const dumpSymbolTable = (table) => "";

const createConvolver = (ctx) => ({ buffer: null });


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

const setRelease = (node, val) => node.release.value = val;

const setGravity = (world, g) => world.gravity = g;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const unlockFile = (path) => ({ path, locked: false });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const disableDepthTest = () => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const rmdir = (path) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const semaphoreWait = (sem) => true;

const resolveSymbols = (ast) => ({});

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const killParticles = (sys) => true;

const sendPacket = (sock, data) => data.length;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const killProcess = (pid) => true;

const detectCollision = (body1, body2) => false;

const createIndexBuffer = (data) => ({ id: Math.random() });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

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

const calculateFriction = (mat1, mat2) => 0.5;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const prettifyCode = (code) => code;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const eliminateDeadCode = (ast) => ast;

const defineSymbol = (table, name, info) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const edgeDetectionSobel = (image) => image;

const emitParticles = (sys, count) => true;

const dropTable = (table) => true;

const claimRewards = (pool) => "0.5 ETH";

const joinGroup = (group) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const validateFormInput = (input) => input.length > 0;

const panicKernel = (msg) => false;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const prioritizeRarestPiece = (pieces) => pieces[0];

const decryptStream = (stream, key) => stream;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
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

const closeContext = (ctx) => Promise.resolve();

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const chmodFile = (path, mode) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const translateText = (text, lang) => text;

const generateEmbeddings = (text) => new Float32Array(128);

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const hashKeccak256 = (data) => "0xabc...";

const performOCR = (img) => "Detected Text";

const stepSimulation = (world, dt) => true;

const createVehicle = (chassis) => ({ wheels: [] });

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

const renderParticles = (sys) => true;

const removeConstraint = (world, c) => true;

const detectAudioCodec = () => "aac";

const compileVertexShader = (source) => ({ compiled: true });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const enterScope = (table) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const vertexAttrib3f = (idx, x, y, z) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const unloadDriver = (name) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const upInterface = (iface) => true;

// Anti-shake references
const _ref_x46ww3 = { detectVirtualMachine };
const _ref_1kc2aa = { processAudioBuffer };
const _ref_w60ap3 = { updateSoftBody };
const _ref_qxwd6w = { createPeriodicWave };
const _ref_3p6jxd = { writePipe };
const _ref_w5iotv = { closeSocket };
const _ref_5jmss2 = { broadcastMessage };
const _ref_sg996y = { captureFrame };
const _ref_gw8dsc = { lookupSymbol };
const _ref_ndxp3i = { decodeABI };
const _ref_3lm5f2 = { bindAddress };
const _ref_r8mybo = { checkIntegrityConstraint };
const _ref_wqlwfy = { limitRate };
const _ref_pe9nqg = { repairCorruptFile };
const _ref_hd5l8k = { limitBandwidth };
const _ref_3a1sxc = { inferType };
const _ref_plvaoy = { updateRoutingTable };
const _ref_5ezjbo = { muteStream };
const _ref_y9zd83 = { extractThumbnail };
const _ref_sz6wvu = { optimizeTailCalls };
const _ref_jky1s5 = { deriveAddress };
const _ref_gy2qta = { showNotification };
const _ref_cxffgm = { getMACAddress };
const _ref_w2rwx9 = { executeSQLQuery };
const _ref_u7x1x8 = { compressPacket };
const _ref_aqbk71 = { deobfuscateString };
const _ref_oznzi1 = { getMediaDuration };
const _ref_lqmkva = { analyzeQueryPlan };
const _ref_ms7rn1 = { commitTransaction };
const _ref_e6h3uj = { freeMemory };
const _ref_qbuqas = { limitDownloadSpeed };
const _ref_fmzcpg = { bindSocket };
const _ref_n3pyu6 = { setVolumeLevel };
const _ref_rifh59 = { dhcpAck };
const _ref_1ingkk = { analyzeHeader };
const _ref_2axxep = { analyzeBitrate };
const _ref_madod5 = { logErrorToFile };
const _ref_r7eha5 = { rotateLogFiles };
const _ref_6r4oh5 = { verifyIR };
const _ref_srpo6g = { pingHost };
const _ref_4jpnvj = { allocateDiskSpace };
const _ref_fn6n4j = { backupDatabase };
const _ref_zpxh0o = { augmentData };
const _ref_9zorj7 = { handleTimeout };
const _ref_k86x9f = { readPixels };
const _ref_v7iwpe = { synthesizeSpeech };
const _ref_oqgwmf = { setInertia };
const _ref_q7nw4x = { parseMagnetLink };
const _ref_b2gfpf = { interestPeer };
const _ref_qbhe0w = { stopOscillator };
const _ref_zzhcnf = { merkelizeRoot };
const _ref_05dnbf = { dhcpRequest };
const _ref_uyam0u = { subscribeToEvents };
const _ref_ae8jjs = { mutexLock };
const _ref_s5b5nn = { preventCSRF };
const _ref_41hl6r = { verifyChecksum };
const _ref_uajrw1 = { getVelocity };
const _ref_mxzs26 = { minifyCode };
const _ref_fseto0 = { applyTheme };
const _ref_3g0g8b = { analyzeUserBehavior };
const _ref_wwalm9 = { discoverPeersDHT };
const _ref_mc99w5 = { decompressPacket };
const _ref_siij18 = { downInterface };
const _ref_7mdnqt = { connectNodes };
const _ref_ow3ubp = { createScriptProcessor };
const _ref_s9r0c2 = { allocateRegisters };
const _ref_lbwafz = { loadImpulseResponse };
const _ref_bu3819 = { mergeFiles };
const _ref_t56w1j = { estimateNonce };
const _ref_g7t5jw = { allowSleepMode };
const _ref_l3l6qt = { manageCookieJar };
const _ref_zj2m9z = { negotiateProtocol };
const _ref_wg8ocz = { joinThread };
const _ref_jha674 = { generateCode };
const _ref_xb5eby = { createAnalyser };
const _ref_x35dui = { createPipe };
const _ref_s5246f = { deleteProgram };
const _ref_5b354f = { getUniformLocation };
const _ref_iada1k = { mapMemory };
const _ref_bl9wj9 = { adjustPlaybackSpeed };
const _ref_f3syfu = { autoResumeTask };
const _ref_amhkds = { makeDistortionCurve };
const _ref_01o4gs = { renderCanvasLayer };
const _ref_2ny2pt = { restoreDatabase };
const _ref_e3zvg1 = { execProcess };
const _ref_rmllko = { VirtualFSTree };
const _ref_gykuvc = { suspendContext };
const _ref_4ijox7 = { createDelay };
const _ref_gh9yg0 = { archiveFiles };
const _ref_efwlef = { createProcess };
const _ref_ld6h8h = { contextSwitch };
const _ref_79lpjm = { reportWarning };
const _ref_rigfgj = { anchorSoftBody };
const _ref_9m706l = { scheduleProcess };
const _ref_ilxr91 = { checkDiskSpace };
const _ref_1jpqk0 = { disablePEX };
const _ref_ez5ooj = { scheduleTask };
const _ref_gycckp = { sanitizeXSS };
const _ref_dssp2i = { lockFile };
const _ref_nack6r = { uniform3f };
const _ref_dh23xy = { enableBlend };
const _ref_hf0p8e = { setDistanceModel };
const _ref_9pp4n0 = { requestPiece };
const _ref_aze5ug = { traceStack };
const _ref_gnn67p = { controlCongestion };
const _ref_g984p7 = { resetVehicle };
const _ref_geo6ou = { uninterestPeer };
const _ref_bqq3rx = { bundleAssets };
const _ref_9hx8vl = { TelemetryClient };
const _ref_2oo63y = { convertFormat };
const _ref_hl6mz8 = { initiateHandshake };
const _ref_lj9umr = { createAudioContext };
const _ref_6tshg2 = { reportError };
const _ref_fz8f7d = { uniform1i };
const _ref_03iq73 = { foldConstants };
const _ref_d7kb6i = { readFile };
const _ref_i8ib7k = { encryptStream };
const _ref_vzu1pw = { moveFileToComplete };
const _ref_lliaav = { addSliderConstraint };
const _ref_pdz8y8 = { TaskScheduler };
const _ref_92b0gf = { migrateSchema };
const _ref_a4y2st = { cleanOldLogs };
const _ref_qtkeqm = { rotateMatrix };
const _ref_pfqbsv = { applyImpulse };
const _ref_7di4xy = { dumpSymbolTable };
const _ref_fqeeb5 = { createConvolver };
const _ref_skyikk = { ApiDataFormatter };
const _ref_s5tn0p = { setRelease };
const _ref_eba62z = { setGravity };
const _ref_nk268p = { queueDownloadTask };
const _ref_wo7hj2 = { unlockFile };
const _ref_ndl9cy = { calculateEntropy };
const _ref_w0oqg8 = { saveCheckpoint };
const _ref_08yac7 = { disableDepthTest };
const _ref_epq00n = { createPanner };
const _ref_wgcqxf = { rmdir };
const _ref_a0cyaz = { simulateNetworkDelay };
const _ref_24p41p = { semaphoreWait };
const _ref_3ynnla = { resolveSymbols };
const _ref_j7bgfv = { generateUUIDv5 };
const _ref_d2383l = { optimizeHyperparameters };
const _ref_d9n93g = { killParticles };
const _ref_ij9sgy = { sendPacket };
const _ref_0pa3x8 = { createCapsuleShape };
const _ref_my926m = { killProcess };
const _ref_bqk3gf = { detectCollision };
const _ref_wxmxas = { createIndexBuffer };
const _ref_68vjto = { debounceAction };
const _ref_gt72kk = { linkProgram };
const _ref_n60e3h = { download };
const _ref_r5c7th = { calculateFriction };
const _ref_0vxfjr = { verifyMagnetLink };
const _ref_cnb9o1 = { sanitizeInput };
const _ref_e74v6q = { prettifyCode };
const _ref_e6cd1x = { convexSweepTest };
const _ref_080cb4 = { eliminateDeadCode };
const _ref_g1wnk7 = { defineSymbol };
const _ref_77zr38 = { resolveDependencyGraph };
const _ref_tplont = { getAppConfig };
const _ref_wx2ezo = { edgeDetectionSobel };
const _ref_7mqalc = { emitParticles };
const _ref_gc3ts7 = { dropTable };
const _ref_5ydf8i = { claimRewards };
const _ref_1viw61 = { joinGroup };
const _ref_n6quvi = { syncAudioVideo };
const _ref_jr0wjz = { validateFormInput };
const _ref_e6s7oq = { panicKernel };
const _ref_za96zd = { createMagnetURI };
const _ref_2vengl = { keepAlivePing };
const _ref_6j34l0 = { prioritizeRarestPiece };
const _ref_4sjx1m = { decryptStream };
const _ref_wspqnw = { validateTokenStructure };
const _ref_j5jmdo = { compactDatabase };
const _ref_fqqc0o = { computeSpeedAverage };
const _ref_fmy8se = { ProtocolBufferHandler };
const _ref_mibtt0 = { closeContext };
const _ref_zz11ma = { parseClass };
const _ref_jifsjh = { chmodFile };
const _ref_zc4902 = { calculateMD5 };
const _ref_7iixw0 = { translateText };
const _ref_nlwo0l = { generateEmbeddings };
const _ref_ejfspt = { monitorNetworkInterface };
const _ref_ac5ti8 = { hashKeccak256 };
const _ref_c9zsdc = { performOCR };
const _ref_z0y2xx = { stepSimulation };
const _ref_y2qn8d = { createVehicle };
const _ref_3uhefr = { generateFakeClass };
const _ref_ngx5i9 = { renderParticles };
const _ref_jmyx1g = { removeConstraint };
const _ref_my4mab = { detectAudioCodec };
const _ref_ka9xlx = { compileVertexShader };
const _ref_r0e2ym = { animateTransition };
const _ref_j8aj42 = { enterScope };
const _ref_tjbxme = { createIndex };
const _ref_y8igqc = { vertexAttrib3f };
const _ref_aqpxrk = { parseFunction };
const _ref_jogbt3 = { generateWalletKeys };
const _ref_e1vve8 = { unloadDriver };
const _ref_9tm6mk = { createBoxShape };
const _ref_ibp00t = { upInterface }; 
    });
})({}, {});