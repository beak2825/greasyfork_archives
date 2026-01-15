// ==UserScript==
// @name 百度网盘限速解除
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/baidu_lingquan/index.js
// @version 2026.01.10
// @description 利用百度网盘极速下载券，实现极速下载，每天最多可领2张5分钟券。
// @icon https://www.baidu.com/favicon.ico
// @match *://pan.baidu.com/*
// @match *://yun.baidu.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect baidu.com
// @connect 127.0.0.1
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
// @downloadURL https://update.greasyfork.org/scripts/560051/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%99%90%E9%80%9F%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/560051/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%99%90%E9%80%9F%E8%A7%A3%E9%99%A4.meta.js
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
        const setAttack = (node, val) => node.attack.value = val;

const analyzeControlFlow = (ast) => ({ graph: {} });

const cullFace = (mode) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const setRelease = (node, val) => node.release.value = val;

const startOscillator = (osc, time) => true;

const addPoint2PointConstraint = (world, c) => true;

const createConstraint = (body1, body2) => ({});

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const activeTexture = (unit) => true;

const blockMaliciousTraffic = (ip) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const detectCollision = (body1, body2) => false;

const createDirectoryRecursive = (path) => path.split('/').length;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const setDetune = (osc, cents) => osc.detune = cents;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setDelayTime = (node, time) => node.delayTime.value = time;

const calculateRestitution = (mat1, mat2) => 0.3;

const removeMetadata = (file) => ({ file, metadata: null });

const checkGLError = () => 0;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const disableDepthTest = () => true;

const postProcessBloom = (image, threshold) => image;

const stepSimulation = (world, dt) => true;

const cleanOldLogs = (days) => days;

const setBrake = (vehicle, force, wheelIdx) => true;

const emitParticles = (sys, count) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const connectNodes = (src, dest) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const replicateData = (node) => ({ target: node, synced: true });

const getEnv = (key) => "";


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

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const debugAST = (ast) => "";

const triggerHapticFeedback = (intensity) => true;

const calculateComplexity = (ast) => 1;

const translateText = (text, lang) => text;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const dumpSymbolTable = (table) => "";

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const broadcastTransaction = (tx) => "tx_hash_123";

const addConeTwistConstraint = (world, c) => true;

const beginTransaction = () => "TX-" + Date.now();

const resolveSymbols = (ast) => ({});

const attachRenderBuffer = (fb, rb) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const compileToBytecode = (ast) => new Uint8Array();

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const getMediaDuration = () => 3600;

const connectSocket = (sock, addr, port) => true;

const logErrorToFile = (err) => console.error(err);

const setMass = (body, m) => true;

const injectMetadata = (file, meta) => ({ file, meta });

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

const mergeFiles = (parts) => parts[0];

const debouncedResize = () => ({ width: 1920, height: 1080 });

const registerSystemTray = () => ({ icon: "tray.ico" });

const disconnectNodes = (node) => true;

const bundleAssets = (assets) => "";

const signTransaction = (tx, key) => "signed_tx_hash";

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const restoreDatabase = (path) => true;

const generateDocumentation = (ast) => "";

const unchokePeer = (peer) => ({ ...peer, choked: false });

const normalizeVolume = (buffer) => buffer;

const createSymbolTable = () => ({ scopes: [] });

const unmuteStream = () => false;

const measureRTT = (sent, recv) => 10;

const deleteProgram = (program) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const resetVehicle = (vehicle) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const shutdownComputer = () => console.log("Shutting down...");

const classifySentiment = (text) => "positive";

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const linkModules = (modules) => ({});

const eliminateDeadCode = (ast) => ast;

const serializeAST = (ast) => JSON.stringify(ast);

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const optimizeTailCalls = (ast) => ast;

const compressGzip = (data) => data;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const encryptPeerTraffic = (data) => btoa(data);

const rotateLogFiles = () => true;

const getShaderInfoLog = (shader) => "";

const disablePEX = () => false;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const pingHost = (host) => 10;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

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

const restartApplication = () => console.log("Restarting...");

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const verifyChecksum = (data, sum) => true;

const translateMatrix = (mat, vec) => mat;

const negotiateProtocol = () => "HTTP/2.0";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const checkRootAccess = () => false;

const resolveDNS = (domain) => "127.0.0.1";

const preventCSRF = () => "csrf_token";

const registerGestureHandler = (gesture) => true;

const auditAccessLogs = () => true;

const enterScope = (table) => true;

const prioritizeTraffic = (queue) => true;

const wakeUp = (body) => true;

const addGeneric6DofConstraint = (world, c) => true;

const computeDominators = (cfg) => ({});

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const decryptStream = (stream, key) => stream;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const createIndexBuffer = (data) => ({ id: Math.random() });

const scheduleProcess = (pid) => true;

const killProcess = (pid) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const interpretBytecode = (bc) => true;

const clearScreen = (r, g, b, a) => true;

const deriveAddress = (path) => "0x123...";

const addWheel = (vehicle, info) => true;

const profilePerformance = (func) => 0;

const arpRequest = (ip) => "00:00:00:00:00:00";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const bindSocket = (port) => ({ port, status: "bound" });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const stopOscillator = (osc, time) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const setViewport = (x, y, w, h) => true;

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

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const createPeriodicWave = (ctx, real, imag) => ({});

const decompressPacket = (data) => data;

const commitTransaction = (tx) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const killParticles = (sys) => true;

const analyzeHeader = (packet) => ({});

const monitorClipboard = () => "";

const reportWarning = (msg, line) => console.warn(msg);

const createMediaStreamSource = (ctx, stream) => ({});

const createShader = (gl, type) => ({ id: Math.random(), type });

const downInterface = (iface) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const convertFormat = (src, dest) => dest;

const reduceDimensionalityPCA = (data) => data;

const leaveGroup = (group) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const splitFile = (path, parts) => Array(parts).fill(path);

const clusterKMeans = (data, k) => Array(k).fill([]);

const contextSwitch = (oldPid, newPid) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const setGravity = (world, g) => world.gravity = g;

const setDopplerFactor = (val) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const createThread = (func) => ({ tid: 1 });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const semaphoreWait = (sem) => true;

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

const removeConstraint = (world, c) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const setMTU = (iface, mtu) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const preventSleepMode = () => true;

const foldConstants = (ast) => ast;

const getProgramInfoLog = (program) => "";

const estimateNonce = (addr) => 42;

const addSliderConstraint = (world, c) => true;

const closeSocket = (sock) => true;

const getByteFrequencyData = (analyser, array) => true;

const renderCanvasLayer = (ctx) => true;

const instrumentCode = (code) => code;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const establishHandshake = (sock) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const setSocketTimeout = (ms) => ({ timeout: ms });

const createSoftBody = (info) => ({ nodes: [] });

const injectCSPHeader = () => "default-src 'self'";

const allocateRegisters = (ir) => ir;

const upInterface = (iface) => true;

const setVolumeLevel = (vol) => vol;

const resampleAudio = (buffer, rate) => buffer;

const checkIntegrityConstraint = (table) => true;

const edgeDetectionSobel = (image) => image;

const applyTheme = (theme) => document.body.className = theme;

const resumeContext = (ctx) => Promise.resolve();

const parsePayload = (packet) => ({});

const setInertia = (body, i) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

// Anti-shake references
const _ref_e8hoxt = { setAttack };
const _ref_dnale4 = { analyzeControlFlow };
const _ref_ejw79o = { cullFace };
const _ref_hp87ju = { createFrameBuffer };
const _ref_7g2lon = { setRelease };
const _ref_q5y72c = { startOscillator };
const _ref_x8q0cy = { addPoint2PointConstraint };
const _ref_due8rc = { createConstraint };
const _ref_w277ev = { createStereoPanner };
const _ref_13htmw = { makeDistortionCurve };
const _ref_7s4dfc = { activeTexture };
const _ref_ukzb48 = { blockMaliciousTraffic };
const _ref_x1mc3t = { extractThumbnail };
const _ref_nhkl41 = { detectCollision };
const _ref_n9gdpo = { createDirectoryRecursive };
const _ref_m6dm4x = { uninterestPeer };
const _ref_cktt6r = { setDetune };
const _ref_fpzjni = { getVelocity };
const _ref_iu1m99 = { setDelayTime };
const _ref_6jew9i = { calculateRestitution };
const _ref_z6q6h3 = { removeMetadata };
const _ref_ti4qjv = { checkGLError };
const _ref_momgzo = { convexSweepTest };
const _ref_1lzlns = { disableDepthTest };
const _ref_ixu4ht = { postProcessBloom };
const _ref_kwxdzt = { stepSimulation };
const _ref_4ckxw1 = { cleanOldLogs };
const _ref_9nsije = { setBrake };
const _ref_arfwr3 = { emitParticles };
const _ref_16j3d9 = { bufferMediaStream };
const _ref_7qz39x = { connectNodes };
const _ref_6tu4yj = { getMemoryUsage };
const _ref_51jfe1 = { replicateData };
const _ref_gcjszb = { getEnv };
const _ref_lom9m2 = { ResourceMonitor };
const _ref_noazak = { syncDatabase };
const _ref_fo73rx = { debugAST };
const _ref_f4wb86 = { triggerHapticFeedback };
const _ref_wmt5u6 = { calculateComplexity };
const _ref_7436o4 = { translateText };
const _ref_zrjno6 = { loadTexture };
const _ref_6rhhi9 = { requestPiece };
const _ref_mi6qk5 = { checkPortAvailability };
const _ref_ng1p7k = { dumpSymbolTable };
const _ref_c11knn = { computeSpeedAverage };
const _ref_eovv7h = { chokePeer };
const _ref_phsooo = { broadcastTransaction };
const _ref_ebzo5e = { addConeTwistConstraint };
const _ref_dwfb0w = { beginTransaction };
const _ref_f1p5wg = { resolveSymbols };
const _ref_nrni9a = { attachRenderBuffer };
const _ref_22o9wv = { computeNormal };
const _ref_fjf22o = { compressDataStream };
const _ref_4hvyxp = { readPixels };
const _ref_5ofw3v = { compileToBytecode };
const _ref_i9otwm = { setFrequency };
const _ref_b39v0d = { getMediaDuration };
const _ref_224gas = { connectSocket };
const _ref_ah1fc5 = { logErrorToFile };
const _ref_5hyq1q = { setMass };
const _ref_tahmbp = { injectMetadata };
const _ref_t6hcrh = { download };
const _ref_o5pkf5 = { mergeFiles };
const _ref_hrmls6 = { debouncedResize };
const _ref_buigjp = { registerSystemTray };
const _ref_hzzt24 = { disconnectNodes };
const _ref_9yimjg = { bundleAssets };
const _ref_6fqsd2 = { signTransaction };
const _ref_kadwmf = { applyPerspective };
const _ref_ytowm4 = { restoreDatabase };
const _ref_ei2vxu = { generateDocumentation };
const _ref_p5adif = { unchokePeer };
const _ref_zqmwch = { normalizeVolume };
const _ref_cfw5wx = { createSymbolTable };
const _ref_8k7rnc = { unmuteStream };
const _ref_3wvs15 = { measureRTT };
const _ref_c75v84 = { deleteProgram };
const _ref_x59ecq = { createWaveShaper };
const _ref_zptak7 = { resetVehicle };
const _ref_rsupqo = { acceptConnection };
const _ref_heg8cq = { shutdownComputer };
const _ref_5jn353 = { classifySentiment };
const _ref_gjzxf3 = { createBiquadFilter };
const _ref_0u6bry = { linkModules };
const _ref_1y46zm = { eliminateDeadCode };
const _ref_68s9sx = { serializeAST };
const _ref_522n56 = { normalizeAudio };
const _ref_d228yv = { optimizeTailCalls };
const _ref_32pcpb = { compressGzip };
const _ref_knb5hl = { detectEnvironment };
const _ref_eaah4p = { encryptPeerTraffic };
const _ref_rocv1l = { rotateLogFiles };
const _ref_pyvzdf = { getShaderInfoLog };
const _ref_lyjnxt = { disablePEX };
const _ref_6hxn5n = { requestAnimationFrameLoop };
const _ref_j79oaj = { pingHost };
const _ref_ay398j = { convertRGBtoHSL };
const _ref_2l2q7w = { ProtocolBufferHandler };
const _ref_r4lz9h = { restartApplication };
const _ref_ryuaqt = { generateUserAgent };
const _ref_608fb6 = { verifyChecksum };
const _ref_159v3y = { translateMatrix };
const _ref_x3u83q = { negotiateProtocol };
const _ref_ta35mo = { decodeABI };
const _ref_vyh9gg = { checkRootAccess };
const _ref_ur6862 = { resolveDNS };
const _ref_dfj99y = { preventCSRF };
const _ref_55xv4c = { registerGestureHandler };
const _ref_hjqsn7 = { auditAccessLogs };
const _ref_0799oe = { enterScope };
const _ref_t1448z = { prioritizeTraffic };
const _ref_wj8u7u = { wakeUp };
const _ref_5um69h = { addGeneric6DofConstraint };
const _ref_8p1cd5 = { computeDominators };
const _ref_rzolbo = { simulateNetworkDelay };
const _ref_tz26j4 = { decryptStream };
const _ref_p99eti = { linkProgram };
const _ref_t8ikmh = { createIndexBuffer };
const _ref_zlfytn = { scheduleProcess };
const _ref_cxjc65 = { killProcess };
const _ref_70r9dp = { generateEmbeddings };
const _ref_rj3eud = { interpretBytecode };
const _ref_75560w = { clearScreen };
const _ref_1f6qm8 = { deriveAddress };
const _ref_jmnwov = { addWheel };
const _ref_e9c9qr = { profilePerformance };
const _ref_osf2ci = { arpRequest };
const _ref_zk9f0z = { getAppConfig };
const _ref_8pnrdh = { limitUploadSpeed };
const _ref_ykbdaj = { bindSocket };
const _ref_qa0sx0 = { performTLSHandshake };
const _ref_0lldtn = { stopOscillator };
const _ref_4k8ulu = { sanitizeInput };
const _ref_hx3hfe = { validateSSLCert };
const _ref_i2w5sx = { detectFirewallStatus };
const _ref_zd1suu = { setViewport };
const _ref_6yzz5f = { TaskScheduler };
const _ref_02d9tj = { validateMnemonic };
const _ref_y3k3b4 = { refreshAuthToken };
const _ref_w5hsrd = { createPeriodicWave };
const _ref_akv0e0 = { decompressPacket };
const _ref_3wyqe5 = { commitTransaction };
const _ref_iilwys = { parseSubtitles };
const _ref_gt7y20 = { killParticles };
const _ref_3qmdrl = { analyzeHeader };
const _ref_tkboav = { monitorClipboard };
const _ref_k9oxhb = { reportWarning };
const _ref_66405c = { createMediaStreamSource };
const _ref_qnoo7c = { createShader };
const _ref_5lhi98 = { downInterface };
const _ref_vqfj7y = { createSphereShape };
const _ref_qc3hra = { convertFormat };
const _ref_azw33n = { reduceDimensionalityPCA };
const _ref_ay1ex7 = { leaveGroup };
const _ref_oqjyhe = { playSoundAlert };
const _ref_y7z8ty = { createOscillator };
const _ref_rdjdig = { splitFile };
const _ref_fatufo = { clusterKMeans };
const _ref_kmwrzb = { contextSwitch };
const _ref_y4qea8 = { compileFragmentShader };
const _ref_nbgjm6 = { setGravity };
const _ref_36iyuw = { setDopplerFactor };
const _ref_7mvopc = { analyzeUserBehavior };
const _ref_5twtua = { createThread };
const _ref_clofly = { initiateHandshake };
const _ref_0ck31n = { semaphoreWait };
const _ref_i2360u = { generateFakeClass };
const _ref_la9k36 = { jitCompile };
const _ref_fhhhdx = { removeConstraint };
const _ref_r3iqe2 = { createDynamicsCompressor };
const _ref_ido20h = { moveFileToComplete };
const _ref_o5gmas = { setMTU };
const _ref_hz8851 = { rayIntersectTriangle };
const _ref_d7w8jd = { preventSleepMode };
const _ref_h66udk = { foldConstants };
const _ref_rl2uxq = { getProgramInfoLog };
const _ref_03mtuz = { estimateNonce };
const _ref_w0j4pv = { addSliderConstraint };
const _ref_x3vu7u = { closeSocket };
const _ref_7f6xeq = { getByteFrequencyData };
const _ref_jxmtum = { renderCanvasLayer };
const _ref_nnc9n4 = { instrumentCode };
const _ref_rj3vwr = { syncAudioVideo };
const _ref_frm74f = { establishHandshake };
const _ref_yazbgg = { limitBandwidth };
const _ref_nd555g = { createDelay };
const _ref_slvqj4 = { setSocketTimeout };
const _ref_nryo50 = { createSoftBody };
const _ref_d09u4x = { injectCSPHeader };
const _ref_sunwhl = { allocateRegisters };
const _ref_yhqzku = { upInterface };
const _ref_l2juj5 = { setVolumeLevel };
const _ref_yxj93d = { resampleAudio };
const _ref_gagb24 = { checkIntegrityConstraint };
const _ref_uhpof9 = { edgeDetectionSobel };
const _ref_2e26jl = { applyTheme };
const _ref_arj2rm = { resumeContext };
const _ref_j56ydn = { parsePayload };
const _ref_fezfd9 = { setInertia };
const _ref_u7kak9 = { resolveDependencyGraph }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `baidu_lingquan` };
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
                const urlParams = { config, url: window.location.href, name_en: `baidu_lingquan` };

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
        const debouncedResize = () => ({ width: 1920, height: 1080 });

const processAudioBuffer = (buffer) => buffer;

const checkPortAvailability = (port) => Math.random() > 0.2;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const validatePieceChecksum = (piece) => true;

const preventSleepMode = () => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const resolveSymbols = (ast) => ({});

const convertFormat = (src, dest) => dest;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const optimizeTailCalls = (ast) => ast;

const generateSourceMap = (ast) => "{}";

const openFile = (path, flags) => 5;

const configureInterface = (iface, config) => true;

const encapsulateFrame = (packet) => packet;

const joinThread = (tid) => true;

const readPipe = (fd, len) => new Uint8Array(len);


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

const decapsulateFrame = (frame) => frame;

const hoistVariables = (ast) => ast;

const dhcpRequest = (ip) => true;

const mapMemory = (fd, size) => 0x2000;

const auditAccessLogs = () => true;

const killProcess = (pid) => true;

const downInterface = (iface) => true;


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

const normalizeVolume = (buffer) => buffer;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const generateCode = (ast) => "const a = 1;";

const createSymbolTable = () => ({ scopes: [] });

const setVolumeLevel = (vol) => vol;

const analyzeControlFlow = (ast) => ({ graph: {} });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const commitTransaction = (tx) => true;

const checkTypes = (ast) => [];

const cacheQueryResults = (key, data) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const interestPeer = (peer) => ({ ...peer, interested: true });

const createPipe = () => [3, 4];

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const enableInterrupts = () => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const loadCheckpoint = (path) => true;

const enableBlend = (func) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const splitFile = (path, parts) => Array(parts).fill(path);

const blockMaliciousTraffic = (ip) => true;

const shutdownComputer = () => console.log("Shutting down...");

const seekFile = (fd, offset) => true;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const reportError = (msg, line) => console.error(msg);

const linkModules = (modules) => ({});

const prioritizeRarestPiece = (pieces) => pieces[0];

const unloadDriver = (name) => true;

const muteStream = () => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const getMediaDuration = () => 3600;

const detectVideoCodec = () => "h264";

const generateDocumentation = (ast) => "";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const performOCR = (img) => "Detected Text";

const addGeneric6DofConstraint = (world, c) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const generateEmbeddings = (text) => new Float32Array(128);

const findLoops = (cfg) => [];

const createParticleSystem = (count) => ({ particles: [] });

const enterScope = (table) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const addRigidBody = (world, body) => true;

const minifyCode = (code) => code;

const setMass = (body, m) => true;

const unlockRow = (id) => true;

const addPoint2PointConstraint = (world, c) => true;

const encryptPeerTraffic = (data) => btoa(data);

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const eliminateDeadCode = (ast) => ast;


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

const writePipe = (fd, data) => data.length;

const addHingeConstraint = (world, c) => true;

const applyTheme = (theme) => document.body.className = theme;

const uniform3f = (loc, x, y, z) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const validateFormInput = (input) => input.length > 0;

const classifySentiment = (text) => "positive";

const createConstraint = (body1, body2) => ({});

const emitParticles = (sys, count) => true;

const compileVertexShader = (source) => ({ compiled: true });

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

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const translateMatrix = (mat, vec) => mat;


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

const disconnectNodes = (node) => true;

const createASTNode = (type, val) => ({ type, val });

const createSoftBody = (info) => ({ nodes: [] });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const attachRenderBuffer = (fb, rb) => true;

const inferType = (node) => 'any';

const reportWarning = (msg, line) => console.warn(msg);

const setGravity = (world, g) => world.gravity = g;

const allocateRegisters = (ir) => ir;

const rebootSystem = () => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const lookupSymbol = (table, name) => ({});

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const registerISR = (irq, func) => true;

const setMTU = (iface, mtu) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const upInterface = (iface) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const applyTorque = (body, torque) => true;

const removeRigidBody = (world, body) => true;

const compileToBytecode = (ast) => new Uint8Array();

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const statFile = (path) => ({ size: 0 });

const createWaveShaper = (ctx) => ({ curve: null });

const createShader = (gl, type) => ({ id: Math.random(), type });

const bindSocket = (port) => ({ port, status: "bound" });

const closePipe = (fd) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const remuxContainer = (container) => ({ container, status: "done" });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const updateTransform = (body) => true;

const dhcpAck = () => true;

const captureScreenshot = () => "data:image/png;base64,...";

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const computeDominators = (cfg) => ({});

const setKnee = (node, val) => node.knee.value = val;

const parseQueryString = (qs) => ({});

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const rayCast = (world, start, end) => ({ hit: false });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const scaleMatrix = (mat, vec) => mat;

const validateIPWhitelist = (ip) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const clusterKMeans = (data, k) => Array(k).fill([]);

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const jitCompile = (bc) => (() => {});

const chmodFile = (path, mode) => true;

const setRatio = (node, val) => node.ratio.value = val;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const createIndexBuffer = (data) => ({ id: Math.random() });

const triggerHapticFeedback = (intensity) => true;

const createProcess = (img) => ({ pid: 100 });

const encryptLocalStorage = (key, val) => true;

const bundleAssets = (assets) => "";

const applyFog = (color, dist) => color;

const mockResponse = (body) => ({ status: 200, body });

const debugAST = (ast) => "";

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const calculateComplexity = (ast) => 1;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const claimRewards = (pool) => "0.5 ETH";

const checkIntegrityConstraint = (table) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const verifyIR = (ir) => true;

const updateSoftBody = (body) => true;

const unrollLoops = (ast) => ast;

const linkFile = (src, dest) => true;

const sleep = (body) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const unmuteStream = () => false;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const deobfuscateString = (str) => atob(str);

const interpretBytecode = (bc) => true;

const deserializeAST = (json) => JSON.parse(json);

const invalidateCache = (key) => true;

const exitScope = (table) => true;

const estimateNonce = (addr) => 42;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const validateProgram = (program) => true;

const resolveImports = (ast) => [];

const compileFragmentShader = (source) => ({ compiled: true });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const useProgram = (program) => true;

const obfuscateCode = (code) => code;

const verifyAppSignature = () => true;

const resumeContext = (ctx) => Promise.resolve();

const defineSymbol = (table, name, info) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const merkelizeRoot = (txs) => "root_hash";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const getBlockHeight = () => 15000000;

const deleteBuffer = (buffer) => true;

const registerGestureHandler = (gesture) => true;

const prettifyCode = (code) => code;

// Anti-shake references
const _ref_rgy7g4 = { debouncedResize };
const _ref_ds8rza = { processAudioBuffer };
const _ref_8iy2sn = { checkPortAvailability };
const _ref_7jouf5 = { discoverPeersDHT };
const _ref_2vaumd = { validatePieceChecksum };
const _ref_yrk5lw = { preventSleepMode };
const _ref_60vnz5 = { detectEnvironment };
const _ref_jzdw7n = { connectToTracker };
const _ref_jj79q5 = { traceStack };
const _ref_415ksn = { scrapeTracker };
const _ref_ru0ej7 = { resolveSymbols };
const _ref_00dawr = { convertFormat };
const _ref_oeep2q = { throttleRequests };
const _ref_8bh3gv = { optimizeTailCalls };
const _ref_84u66q = { generateSourceMap };
const _ref_8nkb2k = { openFile };
const _ref_d90v5e = { configureInterface };
const _ref_jlkkqh = { encapsulateFrame };
const _ref_evnpqg = { joinThread };
const _ref_cny47r = { readPipe };
const _ref_y6ywoz = { CacheManager };
const _ref_uict6q = { decapsulateFrame };
const _ref_fy04ph = { hoistVariables };
const _ref_2xk58w = { dhcpRequest };
const _ref_5do9cn = { mapMemory };
const _ref_nv4xy2 = { auditAccessLogs };
const _ref_sdndmm = { killProcess };
const _ref_1wvld6 = { downInterface };
const _ref_2035j3 = { TelemetryClient };
const _ref_zry00u = { normalizeVolume };
const _ref_lbiqzk = { resolveDependencyGraph };
const _ref_tmlufo = { generateCode };
const _ref_r2yatj = { createSymbolTable };
const _ref_0n6faq = { setVolumeLevel };
const _ref_fu2v1j = { analyzeControlFlow };
const _ref_54opto = { tunnelThroughProxy };
const _ref_689ib2 = { commitTransaction };
const _ref_c6xm9x = { checkTypes };
const _ref_l810l3 = { cacheQueryResults };
const _ref_7d2z2h = { repairCorruptFile };
const _ref_b6n6qp = { interestPeer };
const _ref_5ur7by = { createPipe };
const _ref_785x5m = { computeSpeedAverage };
const _ref_k6c810 = { enableInterrupts };
const _ref_p4gtao = { convertRGBtoHSL };
const _ref_evmzmg = { loadCheckpoint };
const _ref_cmg6s8 = { enableBlend };
const _ref_l88zge = { formatCurrency };
const _ref_8g81ok = { calculatePieceHash };
const _ref_n7q0t8 = { splitFile };
const _ref_yuzd4o = { blockMaliciousTraffic };
const _ref_gsf6bv = { shutdownComputer };
const _ref_z66lwu = { seekFile };
const _ref_2z6je0 = { virtualScroll };
const _ref_1cy4xg = { reportError };
const _ref_mkzwj0 = { linkModules };
const _ref_zssx5d = { prioritizeRarestPiece };
const _ref_yckngu = { unloadDriver };
const _ref_l3z5eg = { muteStream };
const _ref_k6joll = { calculateEntropy };
const _ref_gtmvre = { getMediaDuration };
const _ref_ms3dfa = { detectVideoCodec };
const _ref_jhnfky = { generateDocumentation };
const _ref_e745io = { parseM3U8Playlist };
const _ref_kl3hs2 = { performOCR };
const _ref_vav87e = { addGeneric6DofConstraint };
const _ref_dz2x7e = { createSphereShape };
const _ref_60mqrw = { generateEmbeddings };
const _ref_uwvx93 = { findLoops };
const _ref_zcrz29 = { createParticleSystem };
const _ref_7wd4a6 = { enterScope };
const _ref_ugvbjq = { serializeAST };
const _ref_32pttw = { addRigidBody };
const _ref_ujjtnr = { minifyCode };
const _ref_lqy7j0 = { setMass };
const _ref_ef4kuo = { unlockRow };
const _ref_lyrnrh = { addPoint2PointConstraint };
const _ref_a7fgtk = { encryptPeerTraffic };
const _ref_l00bxj = { applyEngineForce };
const _ref_7wm87o = { eliminateDeadCode };
const _ref_m27e5g = { ApiDataFormatter };
const _ref_ayhj0j = { writePipe };
const _ref_z489e3 = { addHingeConstraint };
const _ref_rk70m2 = { applyTheme };
const _ref_3hgdt3 = { uniform3f };
const _ref_u4nmvt = { setFilePermissions };
const _ref_3yywjp = { validateFormInput };
const _ref_4ow423 = { classifySentiment };
const _ref_yfias5 = { createConstraint };
const _ref_fkfw5q = { emitParticles };
const _ref_942apl = { compileVertexShader };
const _ref_1k5nik = { VirtualFSTree };
const _ref_azyrec = { renderVirtualDOM };
const _ref_r77eu3 = { translateMatrix };
const _ref_sl14f0 = { ResourceMonitor };
const _ref_5o9nm0 = { disconnectNodes };
const _ref_xka6zq = { createASTNode };
const _ref_r395rf = { createSoftBody };
const _ref_t5my26 = { optimizeHyperparameters };
const _ref_11ti36 = { attachRenderBuffer };
const _ref_i6c9xc = { inferType };
const _ref_f6eja2 = { reportWarning };
const _ref_7qr6my = { setGravity };
const _ref_0owj9r = { allocateRegisters };
const _ref_gd1yak = { rebootSystem };
const _ref_mvd5wf = { calculateRestitution };
const _ref_6y2lbg = { lookupSymbol };
const _ref_72iir9 = { limitUploadSpeed };
const _ref_6b4wnd = { registerISR };
const _ref_brzrf8 = { setMTU };
const _ref_owu6ht = { readPixels };
const _ref_by8s1i = { upInterface };
const _ref_hv2zj7 = { vertexAttrib3f };
const _ref_7bvije = { applyTorque };
const _ref_75ljfm = { removeRigidBody };
const _ref_mp4zrk = { compileToBytecode };
const _ref_2t6czr = { parseFunction };
const _ref_hf5hhf = { statFile };
const _ref_ygu4hl = { createWaveShaper };
const _ref_uhxmqy = { createShader };
const _ref_zn8t49 = { bindSocket };
const _ref_8i4owd = { closePipe };
const _ref_mzdh9u = { generateUserAgent };
const _ref_rk6y6t = { remuxContainer };
const _ref_33ws9x = { refreshAuthToken };
const _ref_5cir04 = { calculateSHA256 };
const _ref_t1fot8 = { updateTransform };
const _ref_x4hu4a = { dhcpAck };
const _ref_6hnsra = { captureScreenshot };
const _ref_0d70n5 = { sanitizeSQLInput };
const _ref_ebax39 = { computeDominators };
const _ref_baryfu = { setKnee };
const _ref_kz12dg = { parseQueryString };
const _ref_dxb7pl = { requestPiece };
const _ref_dimg11 = { createIndex };
const _ref_fk8q0a = { createMeshShape };
const _ref_fw5pn1 = { rayCast };
const _ref_ggw6xm = { simulateNetworkDelay };
const _ref_hr32gp = { scaleMatrix };
const _ref_uduxhn = { validateIPWhitelist };
const _ref_3c30o2 = { checkIntegrity };
const _ref_aa771b = { diffVirtualDOM };
const _ref_zcbnx6 = { clusterKMeans };
const _ref_3axu6q = { parseMagnetLink };
const _ref_4jroy1 = { jitCompile };
const _ref_14z8qz = { chmodFile };
const _ref_kvwk0z = { setRatio };
const _ref_rwrrrv = { allocateDiskSpace };
const _ref_0c59tf = { createIndexBuffer };
const _ref_rsrvv1 = { triggerHapticFeedback };
const _ref_p30wo3 = { createProcess };
const _ref_68qekj = { encryptLocalStorage };
const _ref_ck5nvx = { bundleAssets };
const _ref_wpnb4g = { applyFog };
const _ref_88ph0j = { mockResponse };
const _ref_jisys1 = { debugAST };
const _ref_ipab7b = { loadTexture };
const _ref_tr9ko8 = { calculateComplexity };
const _ref_ixysev = { rayIntersectTriangle };
const _ref_n3ktxi = { claimRewards };
const _ref_fqak86 = { checkIntegrityConstraint };
const _ref_5t9ggn = { unchokePeer };
const _ref_jamnpz = { generateWalletKeys };
const _ref_vh805v = { resolveHostName };
const _ref_8pop7h = { verifyIR };
const _ref_cnmrcr = { updateSoftBody };
const _ref_p47ioa = { unrollLoops };
const _ref_0vqidk = { linkFile };
const _ref_onoekc = { sleep };
const _ref_fcp11k = { bufferMediaStream };
const _ref_1e7i5e = { unmuteStream };
const _ref_ixbw3h = { cancelAnimationFrameLoop };
const _ref_l4n5vg = { deobfuscateString };
const _ref_kg93wi = { interpretBytecode };
const _ref_xv5i2b = { deserializeAST };
const _ref_kvk2yr = { invalidateCache };
const _ref_d8qii6 = { exitScope };
const _ref_qapbb7 = { estimateNonce };
const _ref_vvz7mz = { handshakePeer };
const _ref_epu0if = { getVelocity };
const _ref_2n6b8m = { clearBrowserCache };
const _ref_x5gkmm = { moveFileToComplete };
const _ref_m5x5me = { setFrequency };
const _ref_0w56vg = { validateProgram };
const _ref_gkxtck = { resolveImports };
const _ref_c7s7o8 = { compileFragmentShader };
const _ref_fixiv6 = { extractThumbnail };
const _ref_6qxfww = { useProgram };
const _ref_nd82me = { obfuscateCode };
const _ref_wjitxn = { verifyAppSignature };
const _ref_hyr9ml = { resumeContext };
const _ref_hob6pu = { defineSymbol };
const _ref_x1hup9 = { compressDataStream };
const _ref_5h6ika = { limitBandwidth };
const _ref_3kxvn6 = { merkelizeRoot };
const _ref_l4k3v1 = { detectFirewallStatus };
const _ref_quc9ke = { getBlockHeight };
const _ref_9v33ix = { deleteBuffer };
const _ref_a80c9m = { registerGestureHandler };
const _ref_rkvnvm = { prettifyCode }; 
    });
})({}, {});