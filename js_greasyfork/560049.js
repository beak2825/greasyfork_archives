// ==UserScript==
// @name 百度文库免费下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/baidu_wenku/index.js
// @version 2026.01.10
// @description 免费下载百度文库资源。
// @icon https://www.baidu.com/favicon.ico
// @match *://wenku.baidu.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect baidu.com
// @connect bdimg.com
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
// @downloadURL https://update.greasyfork.org/scripts/560049/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560049/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
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
        const sanitizeXSS = (html) => html;

const prioritizeRarestPiece = (pieces) => pieces[0];

const bindSocket = (port) => ({ port, status: "bound" });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const reportError = (msg, line) => console.error(msg);

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const killParticles = (sys) => true;

const deleteTexture = (texture) => true;


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

const calculateFriction = (mat1, mat2) => 0.5;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});


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

const createChannelMerger = (ctx, channels) => ({});

const setGravity = (world, g) => world.gravity = g;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const useProgram = (program) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const getExtension = (name) => ({});

const checkPortAvailability = (port) => Math.random() > 0.2;

const getOutputTimestamp = (ctx) => Date.now();

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
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

const dhcpOffer = (ip) => true;

const compileVertexShader = (source) => ({ compiled: true });

const writeFile = (fd, data) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const setBrake = (vehicle, force, wheelIdx) => true;

const setMTU = (iface, mtu) => true;

const normalizeVolume = (buffer) => buffer;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const parsePayload = (packet) => ({});

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const getVehicleSpeed = (vehicle) => 0;

const createThread = (func) => ({ tid: 1 });

const setVelocity = (body, v) => true;

const lockFile = (path) => ({ path, locked: true });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const interceptRequest = (req) => ({ ...req, intercepted: true });

const uniform1i = (loc, val) => true;

const activeTexture = (unit) => true;

const mutexUnlock = (mtx) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const disconnectNodes = (node) => true;

const unrollLoops = (ast) => ast;

const analyzeHeader = (packet) => ({});

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const preventSleepMode = () => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const downInterface = (iface) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const spoofReferer = () => "https://google.com";

const setDelayTime = (node, time) => node.delayTime.value = time;

const setAttack = (node, val) => node.attack.value = val;

const killProcess = (pid) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const foldConstants = (ast) => ast;

const forkProcess = () => 101;

const mutexLock = (mtx) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const createSoftBody = (info) => ({ nodes: [] });

const dhcpRequest = (ip) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const dhcpAck = () => true;

const compressGzip = (data) => data;

const mergeFiles = (parts) => parts[0];

const decompressGzip = (data) => data;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const writePipe = (fd, data) => data.length;

const setInertia = (body, i) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const cullFace = (mode) => true;

const lockRow = (id) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const translateMatrix = (mat, vec) => mat;

const shardingTable = (table) => ["shard_0", "shard_1"];

const verifyAppSignature = () => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createMediaStreamSource = (ctx, stream) => ({});

const addConeTwistConstraint = (world, c) => true;

const shutdownComputer = () => console.log("Shutting down...");

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

const rotateLogFiles = () => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

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

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const restoreDatabase = (path) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const semaphoreWait = (sem) => true;

const restartApplication = () => console.log("Restarting...");

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const detectVideoCodec = () => "h264";

const freeMemory = (ptr) => true;

const closeFile = (fd) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const registerSystemTray = () => ({ icon: "tray.ico" });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const rollbackTransaction = (tx) => true;

const getEnv = (key) => "";

const statFile = (path) => ({ size: 0 });

const detectDebugger = () => false;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createShader = (gl, type) => ({ id: Math.random(), type });

const scaleMatrix = (mat, vec) => mat;

const rebootSystem = () => true;

const getFloatTimeDomainData = (analyser, array) => true;

const exitScope = (table) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const disableDepthTest = () => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const merkelizeRoot = (txs) => "root_hash";

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const updateParticles = (sys, dt) => true;

const createListener = (ctx) => ({});

const removeConstraint = (world, c) => true;

const unloadDriver = (name) => true;

const detectDevTools = () => false;

const resolveImports = (ast) => [];

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const minifyCode = (code) => code;

const setPosition = (panner, x, y, z) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const loadDriver = (path) => true;

const replicateData = (node) => ({ target: node, synced: true });

const enableDHT = () => true;

const mkdir = (path) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const unlockFile = (path) => ({ path, locked: false });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const extractArchive = (archive) => ["file1", "file2"];

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const scheduleTask = (task) => ({ id: 1, task });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const negotiateProtocol = () => "HTTP/2.0";

const cleanOldLogs = (days) => days;

const findLoops = (cfg) => [];

const getMediaDuration = () => 3600;

const installUpdate = () => false;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const chokePeer = (peer) => ({ ...peer, choked: true });

const createWaveShaper = (ctx) => ({ curve: null });

const prefetchAssets = (urls) => urls.length;

const allocateMemory = (size) => 0x1000;

const setVolumeLevel = (vol) => vol;

const debugAST = (ast) => "";

const getByteFrequencyData = (analyser, array) => true;

const bundleAssets = (assets) => "";

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const leaveGroup = (group) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const monitorClipboard = () => "";

const visitNode = (node) => true;

const generateMipmaps = (target) => true;

const serializeFormData = (form) => JSON.stringify(form);

const calculateRestitution = (mat1, mat2) => 0.3;

const createFrameBuffer = () => ({ id: Math.random() });

const bindAddress = (sock, addr, port) => true;

const linkModules = (modules) => ({});

const limitRate = (stream, rate) => stream;

const parseLogTopics = (topics) => ["Transfer"];

const updateTransform = (body) => true;

const linkFile = (src, dest) => true;

const logErrorToFile = (err) => console.error(err);

const interestPeer = (peer) => ({ ...peer, interested: true });

const establishHandshake = (sock) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const commitTransaction = (tx) => true;

const swapTokens = (pair, amount) => true;

const filterTraffic = (rule) => true;

const multicastMessage = (group, msg) => true;

const closePipe = (fd) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

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

const uniformMatrix4fv = (loc, transpose, val) => true;

const joinGroup = (group) => true;

const checkIntegrityToken = (token) => true;

const enterScope = (table) => true;

// Anti-shake references
const _ref_1rvsfh = { sanitizeXSS };
const _ref_c93r5y = { prioritizeRarestPiece };
const _ref_7wy8lk = { bindSocket };
const _ref_sejz0z = { resolveDNSOverHTTPS };
const _ref_x55bh7 = { encryptPayload };
const _ref_n5ea3r = { reportError };
const _ref_xgzaoh = { calculateEntropy };
const _ref_zg4lp0 = { killParticles };
const _ref_jxyxlo = { deleteTexture };
const _ref_81iy2d = { ApiDataFormatter };
const _ref_nwjwpt = { calculateFriction };
const _ref_65p37g = { monitorNetworkInterface };
const _ref_tw0pil = { createScriptProcessor };
const _ref_5336sp = { TelemetryClient };
const _ref_luhqit = { createChannelMerger };
const _ref_knfeiw = { setGravity };
const _ref_xpdnt7 = { createOscillator };
const _ref_aruzsb = { switchProxyServer };
const _ref_ha0kzl = { useProgram };
const _ref_17iy2m = { allocateDiskSpace };
const _ref_z8fpez = { getExtension };
const _ref_v1t5yz = { checkPortAvailability };
const _ref_nkul37 = { getOutputTimestamp };
const _ref_woja39 = { requestPiece };
const _ref_99rcod = { ResourceMonitor };
const _ref_5mumew = { dhcpOffer };
const _ref_rydidt = { compileVertexShader };
const _ref_y2w8t6 = { writeFile };
const _ref_lrxgtt = { generateUUIDv5 };
const _ref_vu75jf = { getNetworkStats };
const _ref_qr9fze = { archiveFiles };
const _ref_phcpi3 = { limitBandwidth };
const _ref_4q1k6v = { queueDownloadTask };
const _ref_44a41y = { setBrake };
const _ref_yel5u2 = { setMTU };
const _ref_ii0pf8 = { normalizeVolume };
const _ref_l15rjf = { streamToPlayer };
const _ref_pknc9k = { parsePayload };
const _ref_xkndvn = { initiateHandshake };
const _ref_cyafsm = { getVehicleSpeed };
const _ref_rdfa3z = { createThread };
const _ref_g4ed64 = { setVelocity };
const _ref_akd9si = { lockFile };
const _ref_ykmm2g = { isFeatureEnabled };
const _ref_q76k2v = { interceptRequest };
const _ref_3b68v9 = { uniform1i };
const _ref_0qau6d = { activeTexture };
const _ref_u1gajn = { mutexUnlock };
const _ref_nbbryk = { getMACAddress };
const _ref_qq5lyz = { disconnectNodes };
const _ref_9u06j6 = { unrollLoops };
const _ref_ax2hav = { analyzeHeader };
const _ref_ftizse = { parseSubtitles };
const _ref_ft2now = { analyzeUserBehavior };
const _ref_7jn1i7 = { preventSleepMode };
const _ref_cik37s = { unchokePeer };
const _ref_zhpue1 = { downInterface };
const _ref_ynkho7 = { watchFileChanges };
const _ref_jiyh17 = { clearBrowserCache };
const _ref_cfrjxu = { spoofReferer };
const _ref_hyu216 = { setDelayTime };
const _ref_l94s5k = { setAttack };
const _ref_tfasdg = { killProcess };
const _ref_k4a26a = { checkDiskSpace };
const _ref_m9kh85 = { detectEnvironment };
const _ref_td2cw6 = { foldConstants };
const _ref_47p3sz = { forkProcess };
const _ref_bs7c70 = { mutexLock };
const _ref_044z3z = { autoResumeTask };
const _ref_jxm4xk = { createSoftBody };
const _ref_ji9lbu = { dhcpRequest };
const _ref_tw41js = { setFilePermissions };
const _ref_yy8eix = { createPhysicsWorld };
const _ref_sqd5qi = { deleteTempFiles };
const _ref_b17upy = { dhcpAck };
const _ref_ha56ll = { compressGzip };
const _ref_70ou62 = { mergeFiles };
const _ref_7p12n2 = { decompressGzip };
const _ref_vkb5r9 = { debouncedResize };
const _ref_grrj2d = { handshakePeer };
const _ref_gq72f9 = { writePipe };
const _ref_nhttp9 = { setInertia };
const _ref_nu5q37 = { checkIntegrity };
const _ref_jvaegl = { cullFace };
const _ref_s5ulra = { lockRow };
const _ref_k2l6sc = { readPixels };
const _ref_v3w5p9 = { throttleRequests };
const _ref_9v5zz2 = { translateMatrix };
const _ref_p6uflc = { shardingTable };
const _ref_doz4wv = { verifyAppSignature };
const _ref_butdzs = { createMeshShape };
const _ref_no79er = { createMediaStreamSource };
const _ref_9otfmc = { addConeTwistConstraint };
const _ref_ai02gr = { shutdownComputer };
const _ref_iviuzh = { semaphoreSignal };
const _ref_ayqkwg = { FileValidator };
const _ref_rav0hf = { rotateLogFiles };
const _ref_mfdi6c = { executeSQLQuery };
const _ref_ibsfeo = { AdvancedCipher };
const _ref_nnheku = { createCapsuleShape };
const _ref_9qjb2q = { restoreDatabase };
const _ref_iirw4o = { createIndexBuffer };
const _ref_ipxnrg = { semaphoreWait };
const _ref_ybc5pu = { restartApplication };
const _ref_omnw8g = { createBiquadFilter };
const _ref_6zdgbn = { detectVideoCodec };
const _ref_pnb322 = { freeMemory };
const _ref_530nun = { closeFile };
const _ref_laxc1h = { createAnalyser };
const _ref_2vxyo1 = { compactDatabase };
const _ref_fs37dr = { uploadCrashReport };
const _ref_2a2vgw = { scheduleBandwidth };
const _ref_obizjk = { applyPerspective };
const _ref_8l883x = { calculateMD5 };
const _ref_jkiwg0 = { registerSystemTray };
const _ref_ahsnfk = { compressDataStream };
const _ref_ims2ya = { linkProgram };
const _ref_f941do = { rollbackTransaction };
const _ref_hfa3mn = { getEnv };
const _ref_9qyeo0 = { statFile };
const _ref_ynuus9 = { detectDebugger };
const _ref_8isld1 = { debounceAction };
const _ref_7ddmid = { createShader };
const _ref_br9t6i = { scaleMatrix };
const _ref_pdmofz = { rebootSystem };
const _ref_bkp4ua = { getFloatTimeDomainData };
const _ref_gk2ub1 = { exitScope };
const _ref_3w84aa = { rotateMatrix };
const _ref_pbtae6 = { disableDepthTest };
const _ref_owf7jt = { createDirectoryRecursive };
const _ref_y3uul4 = { merkelizeRoot };
const _ref_lfjlyl = { calculateLighting };
const _ref_2oswzt = { updateParticles };
const _ref_gqczaa = { createListener };
const _ref_ssouhp = { removeConstraint };
const _ref_ogoyr4 = { unloadDriver };
const _ref_vzr8no = { detectDevTools };
const _ref_evvy5i = { resolveImports };
const _ref_4b9zou = { calculateLayoutMetrics };
const _ref_87y699 = { minifyCode };
const _ref_yxme2o = { setPosition };
const _ref_98lr2v = { analyzeQueryPlan };
const _ref_zipve6 = { loadDriver };
const _ref_4vwa1c = { replicateData };
const _ref_dbd5sw = { enableDHT };
const _ref_c32ysz = { mkdir };
const _ref_86lmgq = { traceStack };
const _ref_feb11p = { unlockFile };
const _ref_qbyng4 = { createIndex };
const _ref_a251nx = { extractArchive };
const _ref_7r6dn2 = { updateProgressBar };
const _ref_wbeh3e = { scheduleTask };
const _ref_nj7vp1 = { normalizeAudio };
const _ref_g6kst4 = { parseClass };
const _ref_okjl9c = { negotiateProtocol };
const _ref_1a6o9y = { cleanOldLogs };
const _ref_eyje5o = { findLoops };
const _ref_fguqzb = { getMediaDuration };
const _ref_3y9sdu = { installUpdate };
const _ref_99hvx3 = { transformAesKey };
const _ref_w1ho8l = { chokePeer };
const _ref_v4uq2z = { createWaveShaper };
const _ref_uu59pm = { prefetchAssets };
const _ref_8gadmr = { allocateMemory };
const _ref_yegqwy = { setVolumeLevel };
const _ref_tvph0j = { debugAST };
const _ref_z1qtp5 = { getByteFrequencyData };
const _ref_hefkji = { bundleAssets };
const _ref_ze3na8 = { createGainNode };
const _ref_25sb7q = { leaveGroup };
const _ref_tw5jvc = { getAppConfig };
const _ref_lo6xa3 = { manageCookieJar };
const _ref_5024a5 = { monitorClipboard };
const _ref_l5dtz2 = { visitNode };
const _ref_n58m6l = { generateMipmaps };
const _ref_y5n2ju = { serializeFormData };
const _ref_5pase3 = { calculateRestitution };
const _ref_smy7ds = { createFrameBuffer };
const _ref_i2dgy4 = { bindAddress };
const _ref_pezfno = { linkModules };
const _ref_i33anr = { limitRate };
const _ref_lcb26n = { parseLogTopics };
const _ref_dopqb2 = { updateTransform };
const _ref_e7wve5 = { linkFile };
const _ref_tt0jfa = { logErrorToFile };
const _ref_gyxm6h = { interestPeer };
const _ref_fwxln6 = { establishHandshake };
const _ref_a3cql3 = { formatLogMessage };
const _ref_0n6kq5 = { commitTransaction };
const _ref_07uu4w = { swapTokens };
const _ref_893tvw = { filterTraffic };
const _ref_p8db7j = { multicastMessage };
const _ref_pfiu3d = { closePipe };
const _ref_30pa3v = { getAngularVelocity };
const _ref_9e86rv = { validateMnemonic };
const _ref_2lgroc = { TaskScheduler };
const _ref_fcy5wq = { uniformMatrix4fv };
const _ref_6rbrjf = { joinGroup };
const _ref_zrf76t = { checkIntegrityToken };
const _ref_3uo0nr = { enterScope }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `baidu_wenku` };
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
                const urlParams = { config, url: window.location.href, name_en: `baidu_wenku` };

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
        const createIndex = (table, col) => `IDX_${table}_${col}`;

const rateLimitCheck = (ip) => true;

const swapTokens = (pair, amount) => true;

const dropTable = (table) => true;

const registerGestureHandler = (gesture) => true;

const sanitizeXSS = (html) => html;

const checkUpdate = () => ({ hasUpdate: false });

const captureScreenshot = () => "data:image/png;base64,...";

const encodeABI = (method, params) => "0x...";

const verifySignature = (tx, sig) => true;

const subscribeToEvents = (contract) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const deriveAddress = (path) => "0x123...";

const captureFrame = () => "frame_data_buffer";

const decompressGzip = (data) => data;

const setFilePermissions = (perm) => `chmod ${perm}`;

const deobfuscateString = (str) => atob(str);

const cacheQueryResults = (key, data) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const parseLogTopics = (topics) => ["Transfer"];

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const claimRewards = (pool) => "0.5 ETH";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const extractArchive = (archive) => ["file1", "file2"];

const getBlockHeight = () => 15000000;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const detectAudioCodec = () => "aac";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const verifyProofOfWork = (nonce) => true;

const encryptPeerTraffic = (data) => btoa(data);

const getMediaDuration = () => 3600;

const setGravity = (world, g) => world.gravity = g;

const scheduleProcess = (pid) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const allowSleepMode = () => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const addPoint2PointConstraint = (world, c) => true;

const setVelocity = (body, v) => true;

const analyzeBitrate = () => "5000kbps";

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const wakeUp = (body) => true;

const createConstraint = (body1, body2) => ({});

const createVehicle = (chassis) => ({ wheels: [] });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const splitFile = (path, parts) => Array(parts).fill(path);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const addWheel = (vehicle, info) => true;

const rayCast = (world, start, end) => ({ hit: false });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const detectCollision = (body1, body2) => false;

const loadImpulseResponse = (url) => Promise.resolve({});

const detectDevTools = () => false;

const useProgram = (program) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const detectVideoCodec = () => "h264";

const drawElements = (mode, count, type, offset) => true;

const scaleMatrix = (mat, vec) => mat;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const compileVertexShader = (source) => ({ compiled: true });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const restartApplication = () => console.log("Restarting...");

const synthesizeSpeech = (text) => "audio_buffer";

const applyFog = (color, dist) => color;

const optimizeAST = (ast) => ast;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const computeLossFunction = (pred, actual) => 0.05;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const addGeneric6DofConstraint = (world, c) => true;

const bindTexture = (target, texture) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];


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

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const disablePEX = () => false;

const prioritizeRarestPiece = (pieces) => pieces[0];

const disableRightClick = () => true;

const createDirectoryRecursive = (path) => path.split('/').length;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const validateProgram = (program) => true;

const renderParticles = (sys) => true;

const verifyAppSignature = () => true;

const createSoftBody = (info) => ({ nodes: [] });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const listenSocket = (sock, backlog) => true;

const resolveCollision = (manifold) => true;

const reduceDimensionalityPCA = (data) => data;

const defineSymbol = (table, name, info) => true;

const inferType = (node) => 'any';

const triggerHapticFeedback = (intensity) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const getFloatTimeDomainData = (analyser, array) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const createPipe = () => [3, 4];

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const processAudioBuffer = (buffer) => buffer;

const bufferData = (gl, target, data, usage) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createSymbolTable = () => ({ scopes: [] });

const setInertia = (body, i) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const updateSoftBody = (body) => true;

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

const exitScope = (table) => true;

const injectCSPHeader = () => "default-src 'self'";

const dhcpAck = () => true;

const rollbackTransaction = (tx) => true;

const generateSourceMap = (ast) => "{}";

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

const performOCR = (img) => "Detected Text";

const computeDominators = (cfg) => ({});

const commitTransaction = (tx) => true;

const prefetchAssets = (urls) => urls.length;

const applyTorque = (body, torque) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const validateIPWhitelist = (ip) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const setRelease = (node, val) => node.release.value = val;

const setVolumeLevel = (vol) => vol;

const createListener = (ctx) => ({});

const compileToBytecode = (ast) => new Uint8Array();

const findLoops = (cfg) => [];

const bundleAssets = (assets) => "";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const getShaderInfoLog = (shader) => "";

const merkelizeRoot = (txs) => "root_hash";

const dhcpDiscover = () => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const detectDebugger = () => false;

const classifySentiment = (text) => "positive";

const encapsulateFrame = (packet) => packet;

const segmentImageUNet = (img) => "mask_buffer";

const negotiateProtocol = () => "HTTP/2.0";

const calculateComplexity = (ast) => 1;

const obfuscateCode = (code) => code;

const mergeFiles = (parts) => parts[0];

const optimizeTailCalls = (ast) => ast;

const vertexAttrib3f = (idx, x, y, z) => true;

const interpretBytecode = (bc) => true;

const uniform1i = (loc, val) => true;

const decryptStream = (stream, key) => stream;

const fingerprintBrowser = () => "fp_hash_123";

const compressGzip = (data) => data;

const writeFile = (fd, data) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const uniformMatrix4fv = (loc, transpose, val) => true;

const getCpuLoad = () => Math.random() * 100;

const convertFormat = (src, dest) => dest;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const stakeAssets = (pool, amount) => true;

const debugAST = (ast) => "";

const handleTimeout = (sock) => true;

const removeRigidBody = (world, body) => true;

const decapsulateFrame = (frame) => frame;

const createSphereShape = (r) => ({ type: 'sphere' });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const bindAddress = (sock, addr, port) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const decodeAudioData = (buffer) => Promise.resolve({});

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const readPipe = (fd, len) => new Uint8Array(len);

const closeSocket = (sock) => true;

const createProcess = (img) => ({ pid: 100 });

const cullFace = (mode) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

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

const createFrameBuffer = () => ({ id: Math.random() });

const broadcastTransaction = (tx) => "tx_hash_123";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const backupDatabase = (path) => ({ path, size: 5000 });

const createMediaElementSource = (ctx, el) => ({});

const resampleAudio = (buffer, rate) => buffer;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const detectDarkMode = () => true;

const bufferMediaStream = (size) => ({ buffer: size });

const obfuscateString = (str) => btoa(str);

const verifyIR = (ir) => true;

const setMTU = (iface, mtu) => true;

const detectVirtualMachine = () => false;

const setDistanceModel = (panner, model) => true;

const installUpdate = () => false;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const suspendContext = (ctx) => Promise.resolve();

const connectSocket = (sock, addr, port) => true;

const inlineFunctions = (ast) => ast;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const normalizeFeatures = (data) => data.map(x => x / 255);

const closeContext = (ctx) => Promise.resolve();

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const translateText = (text, lang) => text;

const estimateNonce = (addr) => 42;

const execProcess = (path) => true;

// Anti-shake references
const _ref_mdf9jy = { createIndex };
const _ref_gvf2pv = { rateLimitCheck };
const _ref_bidsgk = { swapTokens };
const _ref_vr3dg5 = { dropTable };
const _ref_ookbgp = { registerGestureHandler };
const _ref_a8oo4f = { sanitizeXSS };
const _ref_7sdo79 = { checkUpdate };
const _ref_hvji30 = { captureScreenshot };
const _ref_c8bgg6 = { encodeABI };
const _ref_fhwacl = { verifySignature };
const _ref_vzc3if = { subscribeToEvents };
const _ref_eaov4b = { manageCookieJar };
const _ref_6gllqc = { deriveAddress };
const _ref_iuky2a = { captureFrame };
const _ref_5q8qru = { decompressGzip };
const _ref_zdlh49 = { setFilePermissions };
const _ref_e5zytn = { deobfuscateString };
const _ref_jx1zyd = { cacheQueryResults };
const _ref_ox3gkv = { repairCorruptFile };
const _ref_s8p94r = { parseLogTopics };
const _ref_k9vzoj = { uninterestPeer };
const _ref_bufpqs = { claimRewards };
const _ref_v1xvcf = { verifyMagnetLink };
const _ref_o8net0 = { extractArchive };
const _ref_da4qj9 = { getBlockHeight };
const _ref_sz0qnr = { seedRatioLimit };
const _ref_e7gjjo = { detectAudioCodec };
const _ref_1977gs = { getMemoryUsage };
const _ref_n4cp14 = { verifyProofOfWork };
const _ref_zi4sch = { encryptPeerTraffic };
const _ref_yirsqb = { getMediaDuration };
const _ref_9v5azo = { setGravity };
const _ref_plb6b6 = { scheduleProcess };
const _ref_8we6w0 = { getNetworkStats };
const _ref_1zr66t = { allowSleepMode };
const _ref_df7zmi = { createScriptProcessor };
const _ref_l2rvh4 = { addPoint2PointConstraint };
const _ref_04fnu9 = { setVelocity };
const _ref_jkxzgk = { analyzeBitrate };
const _ref_6lmq2x = { limitDownloadSpeed };
const _ref_v4u1g6 = { getAngularVelocity };
const _ref_zdutu6 = { archiveFiles };
const _ref_3zyh9t = { wakeUp };
const _ref_39dpd7 = { createConstraint };
const _ref_xxb47t = { createVehicle };
const _ref_uua5kt = { syncAudioVideo };
const _ref_x21cv2 = { splitFile };
const _ref_yj92g8 = { encryptPayload };
const _ref_yz3dms = { addWheel };
const _ref_i9xgmh = { rayCast };
const _ref_nmyuui = { debounceAction };
const _ref_z67htg = { detectCollision };
const _ref_uo6l4d = { loadImpulseResponse };
const _ref_upny6e = { detectDevTools };
const _ref_lwrr39 = { useProgram };
const _ref_vnwyrt = { analyzeUserBehavior };
const _ref_gmpjk6 = { detectVideoCodec };
const _ref_8t8k1q = { drawElements };
const _ref_4fsj1h = { scaleMatrix };
const _ref_kcde2f = { transformAesKey };
const _ref_udn29u = { tokenizeSource };
const _ref_jlznio = { compileVertexShader };
const _ref_42ljck = { updateBitfield };
const _ref_p81y5n = { restartApplication };
const _ref_uzqqlp = { synthesizeSpeech };
const _ref_ic6adq = { applyFog };
const _ref_0sflu0 = { optimizeAST };
const _ref_vr5mnw = { optimizeMemoryUsage };
const _ref_nn661h = { computeLossFunction };
const _ref_b27qvz = { initWebGLContext };
const _ref_kmcnlu = { addGeneric6DofConstraint };
const _ref_2m3ahw = { bindTexture };
const _ref_h7f6tl = { parseSubtitles };
const _ref_hmcjnt = { TelemetryClient };
const _ref_ttsokb = { normalizeVector };
const _ref_ys3dal = { loadModelWeights };
const _ref_t9j5rn = { disablePEX };
const _ref_yx5165 = { prioritizeRarestPiece };
const _ref_x64gmy = { disableRightClick };
const _ref_iz5jav = { createDirectoryRecursive };
const _ref_33ls15 = { isFeatureEnabled };
const _ref_szcc5o = { validateProgram };
const _ref_pou4ch = { renderParticles };
const _ref_b3xx1t = { verifyAppSignature };
const _ref_mmfd52 = { createSoftBody };
const _ref_ukxwiq = { parseFunction };
const _ref_ztvl5m = { listenSocket };
const _ref_p411k7 = { resolveCollision };
const _ref_26btch = { reduceDimensionalityPCA };
const _ref_ihvuzp = { defineSymbol };
const _ref_1yoneg = { inferType };
const _ref_ntluix = { triggerHapticFeedback };
const _ref_nieget = { generateWalletKeys };
const _ref_ej6sfw = { getFloatTimeDomainData };
const _ref_v7d5h7 = { connectToTracker };
const _ref_rc0g1x = { compactDatabase };
const _ref_j0n4oh = { applyPerspective };
const _ref_pp0bwh = { createPipe };
const _ref_y1nyqr = { discoverPeersDHT };
const _ref_ycqxxf = { processAudioBuffer };
const _ref_plgpv9 = { bufferData };
const _ref_10ppx4 = { scheduleBandwidth };
const _ref_lzrq6r = { formatLogMessage };
const _ref_dv6b95 = { createSymbolTable };
const _ref_bi1b58 = { setInertia };
const _ref_1tinf3 = { setDelayTime };
const _ref_w5vq1w = { updateSoftBody };
const _ref_imyrus = { ProtocolBufferHandler };
const _ref_v4mlef = { exitScope };
const _ref_alifoj = { injectCSPHeader };
const _ref_ydmuyo = { dhcpAck };
const _ref_jhty4n = { rollbackTransaction };
const _ref_zgdz19 = { generateSourceMap };
const _ref_u29m3w = { download };
const _ref_m6xqdb = { performOCR };
const _ref_9nahge = { computeDominators };
const _ref_ywekjq = { commitTransaction };
const _ref_l9sx8b = { prefetchAssets };
const _ref_xi9ebr = { applyTorque };
const _ref_hzbl0i = { showNotification };
const _ref_6yzbe2 = { validateIPWhitelist };
const _ref_b6ub1o = { detectEnvironment };
const _ref_ty8b0i = { setRelease };
const _ref_fnftdw = { setVolumeLevel };
const _ref_spc0qw = { createListener };
const _ref_7ce9sl = { compileToBytecode };
const _ref_9ndrbq = { findLoops };
const _ref_fcw3st = { bundleAssets };
const _ref_9qdpg2 = { performTLSHandshake };
const _ref_rf9w40 = { getShaderInfoLog };
const _ref_xaoxuh = { merkelizeRoot };
const _ref_k1ine0 = { dhcpDiscover };
const _ref_dev126 = { generateUUIDv5 };
const _ref_5t22za = { detectDebugger };
const _ref_0o6v1s = { classifySentiment };
const _ref_vb70uc = { encapsulateFrame };
const _ref_apljra = { segmentImageUNet };
const _ref_o92sun = { negotiateProtocol };
const _ref_yk1c9f = { calculateComplexity };
const _ref_0ua1xj = { obfuscateCode };
const _ref_o9bmu0 = { mergeFiles };
const _ref_ulq4wu = { optimizeTailCalls };
const _ref_obwowp = { vertexAttrib3f };
const _ref_r5gjis = { interpretBytecode };
const _ref_t65brb = { uniform1i };
const _ref_fdpa8m = { decryptStream };
const _ref_pafq0w = { fingerprintBrowser };
const _ref_11ry6t = { compressGzip };
const _ref_g322s3 = { writeFile };
const _ref_i2mpfq = { parseStatement };
const _ref_1x3qlz = { renderVirtualDOM };
const _ref_4ahlc3 = { uniformMatrix4fv };
const _ref_cpc1r8 = { getCpuLoad };
const _ref_laz1o6 = { convertFormat };
const _ref_43109h = { resolveDependencyGraph };
const _ref_9xa9zd = { stakeAssets };
const _ref_b8677e = { debugAST };
const _ref_cf1mbk = { handleTimeout };
const _ref_zuzo9c = { removeRigidBody };
const _ref_9yudwp = { decapsulateFrame };
const _ref_if7v3a = { createSphereShape };
const _ref_ff29a5 = { checkIntegrity };
const _ref_nxcgwo = { bindAddress };
const _ref_hcx90l = { signTransaction };
const _ref_0nqr9u = { decodeAudioData };
const _ref_35jdn7 = { normalizeAudio };
const _ref_o8dbbe = { readPipe };
const _ref_94reye = { closeSocket };
const _ref_ykqjvz = { createProcess };
const _ref_8lssy7 = { cullFace };
const _ref_e0cijw = { resolveDNSOverHTTPS };
const _ref_2hqe0z = { TaskScheduler };
const _ref_x3pjh3 = { createFrameBuffer };
const _ref_hb5tzt = { broadcastTransaction };
const _ref_ic9xk3 = { decodeABI };
const _ref_tcafn3 = { backupDatabase };
const _ref_7u6kyc = { createMediaElementSource };
const _ref_0vsw29 = { resampleAudio };
const _ref_r9n4vr = { FileValidator };
const _ref_d5831o = { detectDarkMode };
const _ref_i4qkci = { bufferMediaStream };
const _ref_mp5srj = { obfuscateString };
const _ref_hvwfa5 = { verifyIR };
const _ref_6fhnrl = { setMTU };
const _ref_64ebnm = { detectVirtualMachine };
const _ref_87nufb = { setDistanceModel };
const _ref_e9c591 = { installUpdate };
const _ref_xnsjg6 = { throttleRequests };
const _ref_9bixsy = { suspendContext };
const _ref_0ylm3z = { connectSocket };
const _ref_cwpcam = { inlineFunctions };
const _ref_tepk97 = { createMeshShape };
const _ref_jizb60 = { normalizeFeatures };
const _ref_nk5ek8 = { closeContext };
const _ref_z511ht = { diffVirtualDOM };
const _ref_ssxp17 = { setSteeringValue };
const _ref_drny6z = { calculateEntropy };
const _ref_hvdy0s = { translateText };
const _ref_dnpg1i = { estimateNonce };
const _ref_gks57t = { execProcess }; 
    });
})({}, {});