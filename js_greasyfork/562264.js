// ==UserScript==
// @name ShowRoomLive视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/ShowRoomLive/index.js
// @version 2026.01.10
// @description 一键下载ShowRoomLive视频，支持4K/1080P/720P多画质。
// @icon https://www.showroom-live.com/favicon.ico
// @match *://*.showroom-live.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect showroom-live.com
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
// @downloadURL https://update.greasyfork.org/scripts/562264/ShowRoomLive%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562264/ShowRoomLive%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const getEnv = (key) => "";

const enableBlend = (func) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
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

const unlockRow = (id) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const detectVirtualMachine = () => false;

const negotiateProtocol = () => "HTTP/2.0";

const mockResponse = (body) => ({ status: 200, body });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const estimateNonce = (addr) => 42;

const applyFog = (color, dist) => color;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

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

const invalidateCache = (key) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const bindSocket = (port) => ({ port, status: "bound" });

const auditAccessLogs = () => true;

const generateMipmaps = (target) => true;

const dropTable = (table) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const detectDarkMode = () => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const disableRightClick = () => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const deriveAddress = (path) => "0x123...";

const blockMaliciousTraffic = (ip) => true;

const checkIntegrityConstraint = (table) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const performOCR = (img) => "Detected Text";

const deleteProgram = (program) => true;

const resampleAudio = (buffer, rate) => buffer;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const createASTNode = (type, val) => ({ type, val });

const createSphereShape = (r) => ({ type: 'sphere' });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setInertia = (body, i) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const updateTransform = (body) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const calculateMetric = (route) => 1;

const checkTypes = (ast) => [];

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const createConstraint = (body1, body2) => ({});

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const verifyIR = (ir) => true;

const minifyCode = (code) => code;

const addRigidBody = (world, body) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const findLoops = (cfg) => [];

const applyTheme = (theme) => document.body.className = theme;

const controlCongestion = (sock) => true;

const detectCollision = (body1, body2) => false;

const limitRate = (stream, rate) => stream;

const hydrateSSR = (html) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const createMeshShape = (vertices) => ({ type: 'mesh' });

const cleanOldLogs = (days) => days;

const rayCast = (world, start, end) => ({ hit: false });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const addHingeConstraint = (world, c) => true;

const restoreDatabase = (path) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const closeSocket = (sock) => true;

const verifyProofOfWork = (nonce) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const adjustWindowSize = (sock, size) => true;

const inferType = (node) => 'any';

const sendPacket = (sock, data) => data.length;

const applyImpulse = (body, impulse, point) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const stepSimulation = (world, dt) => true;

const rotateLogFiles = () => true;

const sleep = (body) => true;

const prefetchAssets = (urls) => urls.length;

const setAngularVelocity = (body, v) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const sanitizeXSS = (html) => html;

const wakeUp = (body) => true;

const joinGroup = (group) => true;

const applyForce = (body, force, point) => true;

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

const addSliderConstraint = (world, c) => true;

const connectNodes = (src, dest) => true;

const disconnectNodes = (node) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const normalizeVolume = (buffer) => buffer;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const traceroute = (host) => ["192.168.1.1"];

const exitScope = (table) => true;

const spoofReferer = () => "https://google.com";

const enterScope = (table) => true;

const computeDominators = (cfg) => ({});

const analyzeControlFlow = (ast) => ({ graph: {} });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const listenSocket = (sock, backlog) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const establishHandshake = (sock) => true;

const applyTorque = (body, torque) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const instrumentCode = (code) => code;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const removeRigidBody = (world, body) => true;

const deserializeAST = (json) => JSON.parse(json);

const mutexUnlock = (mtx) => true;

const parseQueryString = (qs) => ({});

const debouncedResize = () => ({ width: 1920, height: 1080 });

const dhcpDiscover = () => true;

const postProcessBloom = (image, threshold) => image;

const encapsulateFrame = (packet) => packet;

const leaveGroup = (group) => true;

const contextSwitch = (oldPid, newPid) => true;

const attachRenderBuffer = (fb, rb) => true;

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

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const addPoint2PointConstraint = (world, c) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const dhcpAck = () => true;

const joinThread = (tid) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const analyzeHeader = (packet) => ({});

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const execProcess = (path) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const writePipe = (fd, data) => data.length;

const closePipe = (fd) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const rotateMatrix = (mat, angle, axis) => mat;

const setDetune = (osc, cents) => osc.detune = cents;

const injectMetadata = (file, meta) => ({ file, meta });

const compressPacket = (data) => data;

const setVelocity = (body, v) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const chownFile = (path, uid, gid) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const encryptLocalStorage = (key, val) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const parsePayload = (packet) => ({});

const hashKeccak256 = (data) => "0xabc...";

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const detectVideoCodec = () => "h264";

const resolveDNS = (domain) => "127.0.0.1";

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const forkProcess = () => 101;

const compileFragmentShader = (source) => ({ compiled: true });

const translateMatrix = (mat, vec) => mat;

const createVehicle = (chassis) => ({ wheels: [] });

const bufferData = (gl, target, data, usage) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createSoftBody = (info) => ({ nodes: [] });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const allocateMemory = (size) => 0x1000;

const getExtension = (name) => ({});

const injectCSPHeader = () => "default-src 'self'";

const deleteTexture = (texture) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const unlinkFile = (path) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const unrollLoops = (ast) => ast;

const traverseAST = (node, visitor) => true;

const encryptPeerTraffic = (data) => btoa(data);

const adjustPlaybackSpeed = (rate) => rate;

const switchVLAN = (id) => true;

const dhcpRequest = (ip) => true;

const updateRoutingTable = (entry) => true;

const jitCompile = (bc) => (() => {});

const createFrameBuffer = () => ({ id: Math.random() });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const mergeFiles = (parts) => parts[0];

const calculateRestitution = (mat1, mat2) => 0.3;

const serializeFormData = (form) => JSON.stringify(form);

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const semaphoreWait = (sem) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const decompressPacket = (data) => data;

// Anti-shake references
const _ref_fr002m = { getEnv };
const _ref_nbwhln = { enableBlend };
const _ref_kliqyh = { transformAesKey };
const _ref_qjjj93 = { generateUserAgent };
const _ref_8znr46 = { CacheManager };
const _ref_c7y1uj = { TaskScheduler };
const _ref_7hd3lx = { unlockRow };
const _ref_3acs3d = { terminateSession };
const _ref_wpg7vd = { resolveHostName };
const _ref_drqmk6 = { detectVirtualMachine };
const _ref_opf4x6 = { negotiateProtocol };
const _ref_kz47ui = { mockResponse };
const _ref_yqn4uz = { resolveDNSOverHTTPS };
const _ref_tnw7pk = { estimateNonce };
const _ref_t2ygcm = { applyFog };
const _ref_tvt7i1 = { keepAlivePing };
const _ref_5gj048 = { requestAnimationFrameLoop };
const _ref_ihn7a2 = { updateProgressBar };
const _ref_fmzj3b = { download };
const _ref_q5i437 = { invalidateCache };
const _ref_9tlw6z = { decryptHLSStream };
const _ref_hx6ez7 = { normalizeFeatures };
const _ref_zqg76z = { resolveDependencyGraph };
const _ref_9xys7e = { bindSocket };
const _ref_ucpdbo = { auditAccessLogs };
const _ref_siymlz = { generateMipmaps };
const _ref_s7ek7n = { dropTable };
const _ref_n0yxge = { requestPiece };
const _ref_l3nvf2 = { detectDarkMode };
const _ref_e0igxf = { broadcastTransaction };
const _ref_1qlq3r = { parseM3U8Playlist };
const _ref_4lhy6b = { sanitizeInput };
const _ref_cn4n5z = { getAppConfig };
const _ref_fbs566 = { limitBandwidth };
const _ref_gmhivl = { disableRightClick };
const _ref_3195b8 = { renderShadowMap };
const _ref_7jz4me = { debounceAction };
const _ref_nwbc95 = { refreshAuthToken };
const _ref_gfhkkr = { deriveAddress };
const _ref_h6cgs9 = { blockMaliciousTraffic };
const _ref_rbhqcx = { checkIntegrityConstraint };
const _ref_yeoqhf = { sanitizeSQLInput };
const _ref_uga18x = { performOCR };
const _ref_7mhhue = { deleteProgram };
const _ref_t9c2je = { resampleAudio };
const _ref_zae1l5 = { initWebGLContext };
const _ref_aswnyg = { createASTNode };
const _ref_ddhldy = { createSphereShape };
const _ref_svcg7q = { tunnelThroughProxy };
const _ref_x7zei2 = { getAngularVelocity };
const _ref_53thhw = { syncDatabase };
const _ref_x3wev1 = { getVelocity };
const _ref_4u17z4 = { setInertia };
const _ref_39i1q8 = { normalizeVector };
const _ref_rkwv3y = { createScriptProcessor };
const _ref_v0spnn = { updateTransform };
const _ref_i0sg2o = { optimizeMemoryUsage };
const _ref_t03fhx = { calculateMetric };
const _ref_yjx781 = { checkTypes };
const _ref_7cot46 = { manageCookieJar };
const _ref_rc7bfv = { createConstraint };
const _ref_vu690d = { calculatePieceHash };
const _ref_vsdix1 = { verifyIR };
const _ref_gzn65f = { minifyCode };
const _ref_sler6j = { addRigidBody };
const _ref_et4cuk = { computeNormal };
const _ref_0i41sv = { findLoops };
const _ref_ipe6wn = { applyTheme };
const _ref_5cvfgb = { controlCongestion };
const _ref_kou6l7 = { detectCollision };
const _ref_2xgsaf = { limitRate };
const _ref_wjg27m = { hydrateSSR };
const _ref_w2dbe6 = { applyPerspective };
const _ref_annk1z = { createMeshShape };
const _ref_5xlex7 = { cleanOldLogs };
const _ref_4ucaox = { rayCast };
const _ref_yvw45s = { createBoxShape };
const _ref_1l02hg = { addHingeConstraint };
const _ref_mo08fz = { restoreDatabase };
const _ref_5o0opz = { formatCurrency };
const _ref_cw1hv8 = { detectEnvironment };
const _ref_1hj9y6 = { closeSocket };
const _ref_xb7n2j = { verifyProofOfWork };
const _ref_31eowy = { createPhysicsWorld };
const _ref_fowd1o = { adjustWindowSize };
const _ref_3uulmx = { inferType };
const _ref_okh48e = { sendPacket };
const _ref_w1v13l = { applyImpulse };
const _ref_qfech8 = { clearBrowserCache };
const _ref_3aww2x = { stepSimulation };
const _ref_fh014w = { rotateLogFiles };
const _ref_e9mv7t = { sleep };
const _ref_edicqs = { prefetchAssets };
const _ref_i2lspm = { setAngularVelocity };
const _ref_vk5ud6 = { acceptConnection };
const _ref_l7relq = { sanitizeXSS };
const _ref_dnrygn = { wakeUp };
const _ref_th3i2d = { joinGroup };
const _ref_m7xrq8 = { applyForce };
const _ref_sdhbfk = { resolveCollision };
const _ref_2oqxvg = { ResourceMonitor };
const _ref_ihfqcw = { addSliderConstraint };
const _ref_8jy5h0 = { connectNodes };
const _ref_unplls = { disconnectNodes };
const _ref_h0lwe3 = { generateWalletKeys };
const _ref_74ja3k = { normalizeVolume };
const _ref_feq232 = { detectFirewallStatus };
const _ref_oze5gd = { traceroute };
const _ref_zcemcc = { exitScope };
const _ref_ipn1n3 = { spoofReferer };
const _ref_7ay5f4 = { enterScope };
const _ref_5pbfuc = { computeDominators };
const _ref_4cpeny = { analyzeControlFlow };
const _ref_p4vvst = { watchFileChanges };
const _ref_g4ynds = { listenSocket };
const _ref_a84d77 = { createGainNode };
const _ref_2u7amm = { establishHandshake };
const _ref_945lan = { applyTorque };
const _ref_vdikdx = { handshakePeer };
const _ref_k6ur0i = { instrumentCode };
const _ref_ayynya = { retryFailedSegment };
const _ref_c0lf93 = { removeRigidBody };
const _ref_nz5h15 = { deserializeAST };
const _ref_phv54l = { mutexUnlock };
const _ref_6jetjo = { parseQueryString };
const _ref_q55hqi = { debouncedResize };
const _ref_llkkt5 = { dhcpDiscover };
const _ref_5fyyv1 = { postProcessBloom };
const _ref_ongvng = { encapsulateFrame };
const _ref_cna49c = { leaveGroup };
const _ref_qrk2x0 = { contextSwitch };
const _ref_zjvbn6 = { attachRenderBuffer };
const _ref_5z8n3q = { VirtualFSTree };
const _ref_sea2px = { validateTokenStructure };
const _ref_vmi0kx = { addPoint2PointConstraint };
const _ref_q5wbba = { createAudioContext };
const _ref_iugwid = { rotateUserAgent };
const _ref_fz3eox = { dhcpAck };
const _ref_88w6je = { joinThread };
const _ref_9gkzg2 = { switchProxyServer };
const _ref_apbk2r = { analyzeHeader };
const _ref_junax7 = { animateTransition };
const _ref_cwljmy = { execProcess };
const _ref_8c1jd7 = { setSocketTimeout };
const _ref_duyeqm = { setFrequency };
const _ref_z94g8p = { writePipe };
const _ref_jv3hw7 = { closePipe };
const _ref_6xdfdc = { normalizeAudio };
const _ref_b7o78z = { rotateMatrix };
const _ref_ob5plw = { setDetune };
const _ref_nhv49z = { injectMetadata };
const _ref_fs5rlc = { compressPacket };
const _ref_pcykdl = { setVelocity };
const _ref_n3al79 = { convexSweepTest };
const _ref_zln474 = { chownFile };
const _ref_crmt28 = { createCapsuleShape };
const _ref_k326cl = { checkDiskSpace };
const _ref_7ocnxf = { encryptLocalStorage };
const _ref_zwbmha = { optimizeHyperparameters };
const _ref_8i4g9e = { parsePayload };
const _ref_s6agmj = { hashKeccak256 };
const _ref_b31lu9 = { calculateEntropy };
const _ref_ql0xrb = { detectVideoCodec };
const _ref_2j7uwv = { resolveDNS };
const _ref_jucmev = { cancelAnimationFrameLoop };
const _ref_6rjuqq = { forkProcess };
const _ref_1tb77f = { compileFragmentShader };
const _ref_i2wqll = { translateMatrix };
const _ref_n6cvfp = { createVehicle };
const _ref_qamn8l = { bufferData };
const _ref_uvvd7h = { parseMagnetLink };
const _ref_mwgjad = { createSoftBody };
const _ref_zhvwtr = { queueDownloadTask };
const _ref_2adh2j = { throttleRequests };
const _ref_daghij = { allocateMemory };
const _ref_jo8xf4 = { getExtension };
const _ref_8cavcg = { injectCSPHeader };
const _ref_ptl4lx = { deleteTexture };
const _ref_ng85nv = { performTLSHandshake };
const _ref_ho8iou = { unlinkFile };
const _ref_f0uyq9 = { initiateHandshake };
const _ref_3p8pz2 = { tokenizeSource };
const _ref_iv9uqb = { createOscillator };
const _ref_c1o567 = { unrollLoops };
const _ref_olk7y5 = { traverseAST };
const _ref_hs82qk = { encryptPeerTraffic };
const _ref_6h1k1m = { adjustPlaybackSpeed };
const _ref_2ffdg1 = { switchVLAN };
const _ref_xo9dk3 = { dhcpRequest };
const _ref_4nb9qn = { updateRoutingTable };
const _ref_torvoi = { jitCompile };
const _ref_0g3jpx = { createFrameBuffer };
const _ref_82ytwb = { unchokePeer };
const _ref_ef6y6w = { mergeFiles };
const _ref_x9k61q = { calculateRestitution };
const _ref_xiyibo = { serializeFormData };
const _ref_mhpbhl = { simulateNetworkDelay };
const _ref_t4a6uq = { semaphoreWait };
const _ref_m2gv98 = { formatLogMessage };
const _ref_75b8zv = { decompressPacket }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `ShowRoomLive` };
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
                const urlParams = { config, url: window.location.href, name_en: `ShowRoomLive` };

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
        const uniform1i = (loc, val) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const seedRatioLimit = (ratio) => ratio >= 2.0;

const rollbackTransaction = (tx) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const preventSleepMode = () => true;

const removeMetadata = (file) => ({ file, metadata: null });

const createSoftBody = (info) => ({ nodes: [] });

const detectVideoCodec = () => "h264";

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const parseQueryString = (qs) => ({});

const createParticleSystem = (count) => ({ particles: [] });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const commitTransaction = (tx) => true;

const cleanOldLogs = (days) => days;

const normalizeVolume = (buffer) => buffer;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const resolveImports = (ast) => [];

const setInertia = (body, i) => true;

const unmapMemory = (ptr, size) => true;

const analyzeBitrate = () => "5000kbps";

const setViewport = (x, y, w, h) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const exitScope = (table) => true;

const jitCompile = (bc) => (() => {});

const setPosition = (panner, x, y, z) => true;

const translateText = (text, lang) => text;

const rotateLogFiles = () => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const renameFile = (oldName, newName) => newName;

const unlockFile = (path) => ({ path, locked: false });

const setRelease = (node, val) => node.release.value = val;

const calculateCRC32 = (data) => "00000000";

const detectDevTools = () => false;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const deriveAddress = (path) => "0x123...";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const cacheQueryResults = (key, data) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const computeLossFunction = (pred, actual) => 0.05;

const encryptPeerTraffic = (data) => btoa(data);

const defineSymbol = (table, name, info) => true;

const inferType = (node) => 'any';

const stopOscillator = (osc, time) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const deserializeAST = (json) => JSON.parse(json);

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const updateWheelTransform = (wheel) => true;

const addConeTwistConstraint = (world, c) => true;

const loadCheckpoint = (path) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const verifyIR = (ir) => true;

const checkTypes = (ast) => [];

const enableDHT = () => true;

const segmentImageUNet = (img) => "mask_buffer";

const killParticles = (sys) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const disableRightClick = () => true;

const bundleAssets = (assets) => "";

const createSphereShape = (r) => ({ type: 'sphere' });

const readFile = (fd, len) => "";

const announceToTracker = (url) => ({ url, interval: 1800 });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const mutexUnlock = (mtx) => true;

const dhcpRequest = (ip) => true;

const findLoops = (cfg) => [];

const reportWarning = (msg, line) => console.warn(msg);

const loadImpulseResponse = (url) => Promise.resolve({});

const dhcpDiscover = () => true;

const detectCollision = (body1, body2) => false;

const switchVLAN = (id) => true;

const triggerHapticFeedback = (intensity) => true;

const estimateNonce = (addr) => 42;

const serializeFormData = (form) => JSON.stringify(form);

const unrollLoops = (ast) => ast;

const statFile = (path) => ({ size: 0 });

const allocateRegisters = (ir) => ir;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const traverseAST = (node, visitor) => true;

const negotiateProtocol = () => "HTTP/2.0";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const stakeAssets = (pool, amount) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const unloadDriver = (name) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const createProcess = (img) => ({ pid: 100 });

const anchorSoftBody = (soft, rigid) => true;

const enterScope = (table) => true;

const linkFile = (src, dest) => true;

const chmodFile = (path, mode) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const encodeABI = (method, params) => "0x...";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const signTransaction = (tx, key) => "signed_tx_hash";

const calculateComplexity = (ast) => 1;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const verifyProofOfWork = (nonce) => true;

const validateRecaptcha = (token) => true;

const validatePieceChecksum = (piece) => true;

const obfuscateCode = (code) => code;


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

const chdir = (path) => true;

const getcwd = () => "/";

const createTCPSocket = () => ({ fd: 1 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const setGainValue = (node, val) => node.gain.value = val;

const prefetchAssets = (urls) => urls.length;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const unlockRow = (id) => true;

const broadcastMessage = (msg) => true;

const writeFile = (fd, data) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const applyForce = (body, force, point) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const filterTraffic = (rule) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const compileVertexShader = (source) => ({ compiled: true });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const joinGroup = (group) => true;

const drawElements = (mode, count, type, offset) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const restartApplication = () => console.log("Restarting...");

const receivePacket = (sock, len) => new Uint8Array(len);

const auditAccessLogs = () => true;

const closeContext = (ctx) => Promise.resolve();

const negotiateSession = (sock) => ({ id: "sess_1" });

const sleep = (body) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const blockMaliciousTraffic = (ip) => true;

const profilePerformance = (func) => 0;

const limitRate = (stream, rate) => stream;

const reassemblePacket = (fragments) => fragments[0];

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const verifyChecksum = (data, sum) => true;

const setEnv = (key, val) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const validateProgram = (program) => true;

const dhcpAck = () => true;

const addHingeConstraint = (world, c) => true;

const enableInterrupts = () => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const eliminateDeadCode = (ast) => ast;

const checkUpdate = () => ({ hasUpdate: false });

const downInterface = (iface) => true;

const writePipe = (fd, data) => data.length;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createWaveShaper = (ctx) => ({ curve: null });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const addRigidBody = (world, body) => true;

const configureInterface = (iface, config) => true;

const resolveDNS = (domain) => "127.0.0.1";

const shardingTable = (table) => ["shard_0", "shard_1"];

const getNetworkStats = () => ({ up: 100, down: 2000 });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const setDopplerFactor = (val) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const claimRewards = (pool) => "0.5 ETH";

const setMTU = (iface, mtu) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const calculateMetric = (route) => 1;

const pingHost = (host) => 10;

const checkBalance = (addr) => "10.5 ETH";

const renderCanvasLayer = (ctx) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const createShader = (gl, type) => ({ id: Math.random(), type });

const validateFormInput = (input) => input.length > 0;

const fingerprintBrowser = () => "fp_hash_123";

const decapsulateFrame = (frame) => frame;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const mockResponse = (body) => ({ status: 200, body });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const multicastMessage = (group, msg) => true;

const detectVirtualMachine = () => false;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const resampleAudio = (buffer, rate) => buffer;

const createSymbolTable = () => ({ scopes: [] });

const listenSocket = (sock, backlog) => true;

const suspendContext = (ctx) => Promise.resolve();

// Anti-shake references
const _ref_684xxz = { uniform1i };
const _ref_fxkx5r = { discoverPeersDHT };
const _ref_4a228q = { seedRatioLimit };
const _ref_5fjjdk = { rollbackTransaction };
const _ref_e5wmjv = { generateWalletKeys };
const _ref_5j0pe3 = { watchFileChanges };
const _ref_hyghzr = { preventSleepMode };
const _ref_z4is42 = { removeMetadata };
const _ref_ll59ln = { createSoftBody };
const _ref_9eov3m = { detectVideoCodec };
const _ref_ofg4lu = { initWebGLContext };
const _ref_gicfw4 = { parseQueryString };
const _ref_xembqu = { createParticleSystem };
const _ref_cvsphy = { loadModelWeights };
const _ref_10y1jj = { commitTransaction };
const _ref_1u5yza = { cleanOldLogs };
const _ref_vert1q = { normalizeVolume };
const _ref_xgczp4 = { createPanner };
const _ref_kxkffv = { initiateHandshake };
const _ref_caplrc = { resolveImports };
const _ref_5lgrv7 = { setInertia };
const _ref_j6rxx6 = { unmapMemory };
const _ref_mpsu0i = { analyzeBitrate };
const _ref_rm095j = { setViewport };
const _ref_0m0a1n = { analyzeControlFlow };
const _ref_tj84ym = { exitScope };
const _ref_6tpcj6 = { jitCompile };
const _ref_imo7md = { setPosition };
const _ref_7lw2uu = { translateText };
const _ref_z7fbvz = { rotateLogFiles };
const _ref_f84hc1 = { keepAlivePing };
const _ref_7rpy79 = { renameFile };
const _ref_uax0xn = { unlockFile };
const _ref_1wi4io = { setRelease };
const _ref_x358ki = { calculateCRC32 };
const _ref_ay0yak = { detectDevTools };
const _ref_unoe69 = { diffVirtualDOM };
const _ref_zqy896 = { calculateEntropy };
const _ref_pi8jq6 = { deriveAddress };
const _ref_7ar6rr = { getMemoryUsage };
const _ref_5z7q4b = { cacheQueryResults };
const _ref_8i03pz = { createPeriodicWave };
const _ref_82mh91 = { computeLossFunction };
const _ref_ab9trc = { encryptPeerTraffic };
const _ref_q1jas3 = { defineSymbol };
const _ref_ihmt9k = { inferType };
const _ref_b07810 = { stopOscillator };
const _ref_jx0sqp = { requestPiece };
const _ref_vq12ri = { deserializeAST };
const _ref_yd6qjt = { parseConfigFile };
const _ref_vg35d1 = { uninterestPeer };
const _ref_e9260k = { updateWheelTransform };
const _ref_25fk4k = { addConeTwistConstraint };
const _ref_q9e82n = { loadCheckpoint };
const _ref_1b7ord = { sanitizeSQLInput };
const _ref_hxc4v8 = { streamToPlayer };
const _ref_9tmg54 = { verifyIR };
const _ref_8kb0gp = { checkTypes };
const _ref_yexaok = { enableDHT };
const _ref_3pptf7 = { segmentImageUNet };
const _ref_59fr9k = { killParticles };
const _ref_jf2fzl = { convexSweepTest };
const _ref_6fcph6 = { disableRightClick };
const _ref_humipp = { bundleAssets };
const _ref_cyn9x7 = { createSphereShape };
const _ref_3e46jo = { readFile };
const _ref_oa0gju = { announceToTracker };
const _ref_zzk8kc = { switchProxyServer };
const _ref_ro3smh = { clearBrowserCache };
const _ref_lem8ym = { mutexUnlock };
const _ref_oo3cqo = { dhcpRequest };
const _ref_owbqou = { findLoops };
const _ref_thi6zt = { reportWarning };
const _ref_hwqwo5 = { loadImpulseResponse };
const _ref_bxv6xy = { dhcpDiscover };
const _ref_8d58t1 = { detectCollision };
const _ref_6wvnv9 = { switchVLAN };
const _ref_v5q0tm = { triggerHapticFeedback };
const _ref_n3pes9 = { estimateNonce };
const _ref_ttj95h = { serializeFormData };
const _ref_upp3d0 = { unrollLoops };
const _ref_od509l = { statFile };
const _ref_07ieo6 = { allocateRegisters };
const _ref_dkejh1 = { applyEngineForce };
const _ref_gvkoj0 = { uniformMatrix4fv };
const _ref_bqmm0x = { traverseAST };
const _ref_yco591 = { negotiateProtocol };
const _ref_6aif09 = { createPhysicsWorld };
const _ref_ijm8qw = { setSteeringValue };
const _ref_34uw41 = { createCapsuleShape };
const _ref_wmzesz = { stakeAssets };
const _ref_vyslkk = { transformAesKey };
const _ref_im3675 = { unloadDriver };
const _ref_3mvasl = { updateProgressBar };
const _ref_c66ggh = { createProcess };
const _ref_89loi7 = { anchorSoftBody };
const _ref_bb3cb0 = { enterScope };
const _ref_odjd2t = { linkFile };
const _ref_ew6cns = { chmodFile };
const _ref_uk044n = { createIndex };
const _ref_fn4ubo = { parseFunction };
const _ref_7l0hz3 = { validateSSLCert };
const _ref_fohkdb = { detectEnvironment };
const _ref_xjm8r0 = { encodeABI };
const _ref_me262b = { createStereoPanner };
const _ref_zf39jl = { setFrequency };
const _ref_gempr6 = { calculateMD5 };
const _ref_u2fgad = { signTransaction };
const _ref_evoks2 = { calculateComplexity };
const _ref_mmpmwr = { limitBandwidth };
const _ref_g0jihq = { verifyProofOfWork };
const _ref_kjk1a7 = { validateRecaptcha };
const _ref_bfo538 = { validatePieceChecksum };
const _ref_cdl3ui = { obfuscateCode };
const _ref_bqrsg5 = { ApiDataFormatter };
const _ref_4om9b2 = { closeFile };
const _ref_km945b = { chdir };
const _ref_hb7mx9 = { getcwd };
const _ref_nce0hd = { createTCPSocket };
const _ref_5x6uma = { connectToTracker };
const _ref_yj09fm = { setGainValue };
const _ref_a466n0 = { prefetchAssets };
const _ref_oabe1c = { traceStack };
const _ref_tzadob = { unlockRow };
const _ref_e511vv = { broadcastMessage };
const _ref_am0uer = { writeFile };
const _ref_8yk5b2 = { createDelay };
const _ref_zlp9lv = { applyForce };
const _ref_45fbld = { migrateSchema };
const _ref_tyvc22 = { filterTraffic };
const _ref_a5aiuw = { checkPortAvailability };
const _ref_wq1wyf = { compileVertexShader };
const _ref_sl1o07 = { predictTensor };
const _ref_8w0n01 = { joinGroup };
const _ref_ig16q8 = { drawElements };
const _ref_pk3ny2 = { parseTorrentFile };
const _ref_95khfm = { restartApplication };
const _ref_b1zvwp = { receivePacket };
const _ref_zza2j9 = { auditAccessLogs };
const _ref_qn3w5y = { closeContext };
const _ref_pecaie = { negotiateSession };
const _ref_qv9nfc = { sleep };
const _ref_cuydz7 = { cancelTask };
const _ref_e0zfge = { createBiquadFilter };
const _ref_l966es = { normalizeVector };
const _ref_7giig2 = { blockMaliciousTraffic };
const _ref_4vb2ya = { profilePerformance };
const _ref_s6883n = { limitRate };
const _ref_ljdhoe = { reassemblePacket };
const _ref_9hzpii = { animateTransition };
const _ref_hxb7ll = { verifyChecksum };
const _ref_ynivhz = { setEnv };
const _ref_9c3yns = { calculateSHA256 };
const _ref_ylto3w = { scrapeTracker };
const _ref_4vjnin = { validateProgram };
const _ref_63kyyx = { dhcpAck };
const _ref_3xr90z = { addHingeConstraint };
const _ref_78v84c = { enableInterrupts };
const _ref_1p0w12 = { connectionPooling };
const _ref_9fz4g6 = { eliminateDeadCode };
const _ref_dryq7a = { checkUpdate };
const _ref_3cxvto = { downInterface };
const _ref_dtgccw = { writePipe };
const _ref_e7yvkl = { updateBitfield };
const _ref_7ebyjn = { createWaveShaper };
const _ref_qip9as = { encryptPayload };
const _ref_ney2sm = { addRigidBody };
const _ref_138ldo = { configureInterface };
const _ref_52jnqj = { resolveDNS };
const _ref_m9b0n1 = { shardingTable };
const _ref_aq3qyz = { getNetworkStats };
const _ref_bwyyy0 = { parseSubtitles };
const _ref_o6olfx = { setDopplerFactor };
const _ref_gspmmp = { uploadCrashReport };
const _ref_zlmb07 = { claimRewards };
const _ref_txwz3e = { setMTU };
const _ref_25oxzu = { retryFailedSegment };
const _ref_0c07x4 = { calculateMetric };
const _ref_ipqmbw = { pingHost };
const _ref_w2qsll = { checkBalance };
const _ref_urxfu5 = { renderCanvasLayer };
const _ref_efg7d3 = { applyPerspective };
const _ref_m0lwej = { createShader };
const _ref_75nzsm = { validateFormInput };
const _ref_l2uuw0 = { fingerprintBrowser };
const _ref_lrmmp7 = { decapsulateFrame };
const _ref_gvl6me = { detectObjectYOLO };
const _ref_or86zw = { mockResponse };
const _ref_v3a7i6 = { syncAudioVideo };
const _ref_1sm9xj = { rotateUserAgent };
const _ref_pd5svf = { interceptRequest };
const _ref_d31wxi = { createMagnetURI };
const _ref_4800z6 = { multicastMessage };
const _ref_72wo3d = { detectVirtualMachine };
const _ref_shvebr = { queueDownloadTask };
const _ref_oqmbah = { createDynamicsCompressor };
const _ref_a7i8ja = { resampleAudio };
const _ref_k196ym = { createSymbolTable };
const _ref_zkck61 = { listenSocket };
const _ref_5uiqlf = { suspendContext }; 
    });
})({}, {});