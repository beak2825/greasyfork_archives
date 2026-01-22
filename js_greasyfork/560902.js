// ==UserScript==
// @name 微博视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/weibo/index.js
// @version 2026.01.21.2
// @description 一键下载微博视频
// @icon https://m.weibo.cn/favicon.ico
// @match *://weibo.com/tv/show/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect weibocdn.com
// @connect weibo.com
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
// @downloadURL https://update.greasyfork.org/scripts/560902/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560902/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const extractArchive = (archive) => ["file1", "file2"];

const setDelayTime = (node, time) => node.delayTime.value = time;

const setPan = (node, val) => node.pan.value = val;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const exitScope = (table) => true;

const interpretBytecode = (bc) => true;

const minifyCode = (code) => code;

const closePipe = (fd) => true;

const generateDocumentation = (ast) => "";

const reportError = (msg, line) => console.error(msg);

const detectPacketLoss = (acks) => false;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const captureFrame = () => "frame_data_buffer";

const dropTable = (table) => true;

const encryptPeerTraffic = (data) => btoa(data);

const shardingTable = (table) => ["shard_0", "shard_1"];

const updateTransform = (body) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const findLoops = (cfg) => [];

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

const cancelTask = (id) => ({ id, cancelled: true });

const compressPacket = (data) => data;

const setGravity = (world, g) => world.gravity = g;

const getBlockHeight = () => 15000000;

const mockResponse = (body) => ({ status: 200, body });

const closeSocket = (sock) => true;

const computeDominators = (cfg) => ({});

const installUpdate = () => false;

const deriveAddress = (path) => "0x123...";

const dumpSymbolTable = (table) => "";

const renameFile = (oldName, newName) => newName;

const resolveImports = (ast) => [];

const setSocketTimeout = (ms) => ({ timeout: ms });

const flushSocketBuffer = (sock) => sock.buffer = [];

const obfuscateCode = (code) => code;

const broadcastMessage = (msg) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const triggerHapticFeedback = (intensity) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const deleteProgram = (program) => true;

const calculateGasFee = (limit) => limit * 20;

const checkTypes = (ast) => [];

const compileVertexShader = (source) => ({ compiled: true });

const logErrorToFile = (err) => console.error(err);

const calculateComplexity = (ast) => 1;

const claimRewards = (pool) => "0.5 ETH";

const invalidateCache = (key) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const interestPeer = (peer) => ({ ...peer, interested: true });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const optimizeTailCalls = (ast) => ast;

const updateSoftBody = (body) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const setFilterType = (filter, type) => filter.type = type;

const deobfuscateString = (str) => atob(str);

const profilePerformance = (func) => 0;

const serializeFormData = (form) => JSON.stringify(form);

const adjustWindowSize = (sock, size) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const resolveDNS = (domain) => "127.0.0.1";

const verifyProofOfWork = (nonce) => true;

const controlCongestion = (sock) => true;

const unlockFile = (path) => ({ path, locked: false });

const scheduleTask = (task) => ({ id: 1, task });

const attachRenderBuffer = (fb, rb) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const checkIntegrityConstraint = (table) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const checkBalance = (addr) => "10.5 ETH";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const clearScreen = (r, g, b, a) => true;

const limitRate = (stream, rate) => stream;

const unlockRow = (id) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const fingerprintBrowser = () => "fp_hash_123";

const checkPortAvailability = (port) => Math.random() > 0.2;

const getcwd = () => "/";

const renderCanvasLayer = (ctx) => true;

const seekFile = (fd, offset) => true;

const encodeABI = (method, params) => "0x...";

const beginTransaction = () => "TX-" + Date.now();

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const semaphoreWait = (sem) => true;

const stepSimulation = (world, dt) => true;

const instrumentCode = (code) => code;

const commitTransaction = (tx) => true;

const detectDevTools = () => false;

const connectSocket = (sock, addr, port) => true;

const updateRoutingTable = (entry) => true;

const getMediaDuration = () => 3600;

const calculateRestitution = (mat1, mat2) => 0.3;

const serializeAST = (ast) => JSON.stringify(ast);

const encapsulateFrame = (packet) => packet;

const createMediaStreamSource = (ctx, stream) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createFrameBuffer = () => ({ id: Math.random() });

const hoistVariables = (ast) => ast;

const rmdir = (path) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const replicateData = (node) => ({ target: node, synced: true });

const createSoftBody = (info) => ({ nodes: [] });

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

const linkFile = (src, dest) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const setMass = (body, m) => true;

const checkUpdate = () => ({ hasUpdate: false });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const lockFile = (path) => ({ path, locked: true });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const addRigidBody = (world, body) => true;

const parsePayload = (packet) => ({});

const rotateLogFiles = () => true;


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

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const cacheQueryResults = (key, data) => true;

const decryptStream = (stream, key) => stream;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const bufferData = (gl, target, data, usage) => true;

const resumeContext = (ctx) => Promise.resolve();

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const addConeTwistConstraint = (world, c) => true;

const translateMatrix = (mat, vec) => mat;

const pingHost = (host) => 10;

const activeTexture = (unit) => true;

const detectCollision = (body1, body2) => false;

const createChannelMerger = (ctx, channels) => ({});

const verifySignature = (tx, sig) => true;

const createThread = (func) => ({ tid: 1 });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const enableDHT = () => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const inferType = (node) => 'any';

const lockRow = (id) => true;

const emitParticles = (sys, count) => true;

const rebootSystem = () => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const bindTexture = (target, texture) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const stakeAssets = (pool, amount) => true;

const validateProgram = (program) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const receivePacket = (sock, len) => new Uint8Array(len);

const restartApplication = () => console.log("Restarting...");

const handleInterrupt = (irq) => true;

const setAngularVelocity = (body, v) => true;

const joinThread = (tid) => true;

const dhcpOffer = (ip) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const rateLimitCheck = (ip) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const registerGestureHandler = (gesture) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const allocateRegisters = (ir) => ir;

const switchVLAN = (id) => true;

const connectNodes = (src, dest) => true;

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

const addGeneric6DofConstraint = (world, c) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const setDistanceModel = (panner, model) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const decompressGzip = (data) => data;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const subscribeToEvents = (contract) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const writePipe = (fd, data) => data.length;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const jitCompile = (bc) => (() => {});

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const splitFile = (path, parts) => Array(parts).fill(path);

const cleanOldLogs = (days) => days;

const readdir = (path) => [];

const getUniformLocation = (program, name) => 1;

const openFile = (path, flags) => 5;

const unrollLoops = (ast) => ast;

const setAttack = (node, val) => node.attack.value = val;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const execProcess = (path) => true;

const unmapMemory = (ptr, size) => true;

const setViewport = (x, y, w, h) => true;

// Anti-shake references
const _ref_s4y9n2 = { extractArchive };
const _ref_ulqmpl = { setDelayTime };
const _ref_pfagu3 = { setPan };
const _ref_abywcg = { createStereoPanner };
const _ref_srxzwo = { exitScope };
const _ref_l6099g = { interpretBytecode };
const _ref_kh6vj5 = { minifyCode };
const _ref_6gy652 = { closePipe };
const _ref_xqweil = { generateDocumentation };
const _ref_6xncpf = { reportError };
const _ref_59gjj9 = { detectPacketLoss };
const _ref_66yxd6 = { renderVirtualDOM };
const _ref_ln9362 = { captureFrame };
const _ref_c91u9v = { dropTable };
const _ref_cmiaa9 = { encryptPeerTraffic };
const _ref_p1hpa7 = { shardingTable };
const _ref_jku2jx = { updateTransform };
const _ref_38zy98 = { analyzeQueryPlan };
const _ref_oxf0m5 = { findLoops };
const _ref_7jm4ji = { TaskScheduler };
const _ref_wlpwqj = { cancelTask };
const _ref_2divrk = { compressPacket };
const _ref_d7kywm = { setGravity };
const _ref_xj7abv = { getBlockHeight };
const _ref_9kotfo = { mockResponse };
const _ref_plh7de = { closeSocket };
const _ref_eqp89e = { computeDominators };
const _ref_ybfaae = { installUpdate };
const _ref_vbc542 = { deriveAddress };
const _ref_tuhe79 = { dumpSymbolTable };
const _ref_s1s26m = { renameFile };
const _ref_qwbvda = { resolveImports };
const _ref_flrus0 = { setSocketTimeout };
const _ref_fqwfej = { flushSocketBuffer };
const _ref_thzvba = { obfuscateCode };
const _ref_5gaugi = { broadcastMessage };
const _ref_nh9g7h = { generateWalletKeys };
const _ref_xqqzpz = { triggerHapticFeedback };
const _ref_g19p99 = { deleteTempFiles };
const _ref_deutct = { deleteProgram };
const _ref_z1ellj = { calculateGasFee };
const _ref_hmd5ua = { checkTypes };
const _ref_a4436r = { compileVertexShader };
const _ref_g2etxr = { logErrorToFile };
const _ref_5lr4x9 = { calculateComplexity };
const _ref_23zgc8 = { claimRewards };
const _ref_9cmucn = { invalidateCache };
const _ref_wfxnxr = { transcodeStream };
const _ref_4v0l4q = { tunnelThroughProxy };
const _ref_0p7m03 = { interestPeer };
const _ref_95o5db = { readPixels };
const _ref_9vepih = { optimizeTailCalls };
const _ref_8zq48r = { updateSoftBody };
const _ref_rge33s = { retryFailedSegment };
const _ref_v8wep3 = { setFilterType };
const _ref_k2aefs = { deobfuscateString };
const _ref_asa86r = { profilePerformance };
const _ref_cihmew = { serializeFormData };
const _ref_8l1jd9 = { adjustWindowSize };
const _ref_39w6f2 = { setBrake };
const _ref_rlfo4a = { parseConfigFile };
const _ref_uhb0de = { getNetworkStats };
const _ref_w5e9e5 = { resolveDNS };
const _ref_ynnpan = { verifyProofOfWork };
const _ref_2j08mn = { controlCongestion };
const _ref_h4ysk7 = { unlockFile };
const _ref_7jfe85 = { scheduleTask };
const _ref_wbw8fj = { attachRenderBuffer };
const _ref_w6x5o2 = { createAudioContext };
const _ref_ws80y3 = { checkIntegrityConstraint };
const _ref_pyn4qg = { calculateSHA256 };
const _ref_ojkhjc = { detectEnvironment };
const _ref_6h3k65 = { uploadCrashReport };
const _ref_yhqyzp = { checkBalance };
const _ref_nb6gcm = { calculatePieceHash };
const _ref_rkdyim = { clearScreen };
const _ref_793jbh = { limitRate };
const _ref_tgws6y = { unlockRow };
const _ref_34f0wx = { signTransaction };
const _ref_scjmdc = { generateUserAgent };
const _ref_7l1v3z = { fingerprintBrowser };
const _ref_jmlvrg = { checkPortAvailability };
const _ref_z4nj1a = { getcwd };
const _ref_2mip8j = { renderCanvasLayer };
const _ref_vmjn94 = { seekFile };
const _ref_vumj2g = { encodeABI };
const _ref_j3ij2a = { beginTransaction };
const _ref_xes5na = { compactDatabase };
const _ref_o1pyll = { parseExpression };
const _ref_v3zxgd = { semaphoreWait };
const _ref_czmkkr = { stepSimulation };
const _ref_is8ww6 = { instrumentCode };
const _ref_fvjudu = { commitTransaction };
const _ref_k04hq1 = { detectDevTools };
const _ref_qakgog = { connectSocket };
const _ref_bgx9gm = { updateRoutingTable };
const _ref_819m6z = { getMediaDuration };
const _ref_jxue9t = { calculateRestitution };
const _ref_svvfi8 = { serializeAST };
const _ref_pg0sd6 = { encapsulateFrame };
const _ref_4ro4sy = { createMediaStreamSource };
const _ref_62qlvv = { setFrequency };
const _ref_frxbg5 = { createFrameBuffer };
const _ref_xb1e0f = { hoistVariables };
const _ref_hmmrfp = { rmdir };
const _ref_hduble = { createSphereShape };
const _ref_3kszaw = { replicateData };
const _ref_h47cy0 = { createSoftBody };
const _ref_e6lf5k = { VirtualFSTree };
const _ref_g7bn5a = { linkFile };
const _ref_q479ut = { unchokePeer };
const _ref_rivp7e = { setMass };
const _ref_vwyhs8 = { checkUpdate };
const _ref_usfr14 = { switchProxyServer };
const _ref_1ktppb = { generateUUIDv5 };
const _ref_fwbwx1 = { lockFile };
const _ref_8f2p9j = { keepAlivePing };
const _ref_5vi7ua = { addRigidBody };
const _ref_l4b86y = { parsePayload };
const _ref_3w9leb = { rotateLogFiles };
const _ref_mv1jp9 = { TelemetryClient };
const _ref_iien5g = { createAnalyser };
const _ref_pwea8a = { cacheQueryResults };
const _ref_ff1k6u = { decryptStream };
const _ref_x55q4f = { scheduleBandwidth };
const _ref_qlwzuy = { detectFirewallStatus };
const _ref_vdpug5 = { limitUploadSpeed };
const _ref_mdcxtb = { parseTorrentFile };
const _ref_fmmr1v = { bufferData };
const _ref_sps45j = { resumeContext };
const _ref_75cohq = { rotateUserAgent };
const _ref_kclfqp = { addConeTwistConstraint };
const _ref_m3lgsm = { translateMatrix };
const _ref_ozsfsn = { pingHost };
const _ref_g8dkh3 = { activeTexture };
const _ref_r78nzj = { detectCollision };
const _ref_phui1r = { createChannelMerger };
const _ref_lmofsw = { verifySignature };
const _ref_02fj6t = { createThread };
const _ref_m70gxy = { parseM3U8Playlist };
const _ref_322l01 = { calculateMD5 };
const _ref_xo8c8f = { handshakePeer };
const _ref_n1tuur = { enableDHT };
const _ref_h1wesp = { connectToTracker };
const _ref_7o0wuw = { discoverPeersDHT };
const _ref_oyhjqr = { inferType };
const _ref_kwko2o = { lockRow };
const _ref_vvecjh = { emitParticles };
const _ref_rze8vk = { rebootSystem };
const _ref_jynm7n = { connectionPooling };
const _ref_u208q2 = { bindTexture };
const _ref_lw5htg = { setFilePermissions };
const _ref_dj8unn = { stakeAssets };
const _ref_kvnutb = { validateProgram };
const _ref_ouot8v = { calculateLighting };
const _ref_w6kpvf = { receivePacket };
const _ref_q3m51q = { restartApplication };
const _ref_klqvsl = { handleInterrupt };
const _ref_ux7de3 = { setAngularVelocity };
const _ref_buf6xp = { joinThread };
const _ref_iu6nbv = { dhcpOffer };
const _ref_ywjuki = { createMeshShape };
const _ref_tj48bn = { rateLimitCheck };
const _ref_ugahva = { decryptHLSStream };
const _ref_r0vnuc = { checkIntegrity };
const _ref_bx17l8 = { registerGestureHandler };
const _ref_4u9go1 = { moveFileToComplete };
const _ref_b7ddgp = { createBiquadFilter };
const _ref_3c7b77 = { allocateRegisters };
const _ref_21hgol = { switchVLAN };
const _ref_pvrq4c = { connectNodes };
const _ref_h5de6x = { ProtocolBufferHandler };
const _ref_hafr6i = { addGeneric6DofConstraint };
const _ref_jo4l73 = { performTLSHandshake };
const _ref_szzxw3 = { createPanner };
const _ref_2ymwjb = { resolveDNSOverHTTPS };
const _ref_leu1lq = { createOscillator };
const _ref_do8hwe = { setDistanceModel };
const _ref_eu5aho = { calculateFriction };
const _ref_ed4y78 = { decompressGzip };
const _ref_b1h8uv = { streamToPlayer };
const _ref_fc1s78 = { subscribeToEvents };
const _ref_0jlo3y = { repairCorruptFile };
const _ref_3w0np0 = { writePipe };
const _ref_if4y8x = { throttleRequests };
const _ref_l3xkmk = { vertexAttrib3f };
const _ref_9cbe2j = { jitCompile };
const _ref_r54ybr = { sanitizeSQLInput };
const _ref_bmqqnh = { calculateEntropy };
const _ref_alu845 = { splitFile };
const _ref_9zji0y = { cleanOldLogs };
const _ref_4mwwm8 = { readdir };
const _ref_vg96zs = { getUniformLocation };
const _ref_eyh10m = { openFile };
const _ref_k60wwb = { unrollLoops };
const _ref_6k87uz = { setAttack };
const _ref_bo82n5 = { archiveFiles };
const _ref_m08glx = { execProcess };
const _ref_n9vitv = { unmapMemory };
const _ref_8lic80 = { setViewport }; 
    });
    (function () {
    'use strict';
    // iframe不执行，例如formats.html
    try {
        const inFrame = window.top !== window.self;
        if (inFrame) {
            if (!window.location.pathname.includes('formats')) {
                return;
            }
        }
    } catch (e) { }
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
            autoDownloadBestVideo: 1
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `weibo` };
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
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 540px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; flex: 0 0 70%; }
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
                            <label for="autoDownloadBestVideo">自动下载最好的视频（如果否，可以手动选择不同的视频格式）：</label>
                            <select id="autoDownloadBestVideo">
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
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
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
                const urlParams = { config, url: window.location.href, name_en: `weibo` };

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
        const createGainNode = (ctx) => ({ gain: { value: 1 } });

const switchVLAN = (id) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const validateProgram = (program) => true;

const drawElements = (mode, count, type, offset) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const detectCollision = (body1, body2) => false;

const getExtension = (name) => ({});

const setVelocity = (body, v) => true;

const attachRenderBuffer = (fb, rb) => true;

const stopOscillator = (osc, time) => true;

const addConeTwistConstraint = (world, c) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const checkParticleCollision = (sys, world) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const calculateGasFee = (limit) => limit * 20;

const lockRow = (id) => true;

const eliminateDeadCode = (ast) => ast;

const createAudioContext = () => ({ sampleRate: 44100 });

const updateParticles = (sys, dt) => true;

const beginTransaction = () => "TX-" + Date.now();

const detectPacketLoss = (acks) => false;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const filterTraffic = (rule) => true;

const obfuscateCode = (code) => code;

const killParticles = (sys) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const cacheQueryResults = (key, data) => true;

const restoreDatabase = (path) => true;

const compressGzip = (data) => data;

const generateSourceMap = (ast) => "{}";

const closeSocket = (sock) => true;

const spoofReferer = () => "https://google.com";

const receivePacket = (sock, len) => new Uint8Array(len);

const createFrameBuffer = () => ({ id: Math.random() });

const inferType = (node) => 'any';

const multicastMessage = (group, msg) => true;

const checkIntegrityToken = (token) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const normalizeFeatures = (data) => data.map(x => x / 255);

const uniform3f = (loc, x, y, z) => true;

const deleteBuffer = (buffer) => true;

const merkelizeRoot = (txs) => "root_hash";

const checkIntegrityConstraint = (table) => true;

const unlockFile = (path) => ({ path, locked: false });

const dumpSymbolTable = (table) => "";

const foldConstants = (ast) => ast;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createVehicle = (chassis) => ({ wheels: [] });

const checkRootAccess = () => false;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const computeDominators = (cfg) => ({});

const clearScreen = (r, g, b, a) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const removeMetadata = (file) => ({ file, metadata: null });

const checkPortAvailability = (port) => Math.random() > 0.2;

const allocateRegisters = (ir) => ir;

const dropTable = (table) => true;

const renderCanvasLayer = (ctx) => true;

const setViewport = (x, y, w, h) => true;

const triggerHapticFeedback = (intensity) => true;

const logErrorToFile = (err) => console.error(err);

const installUpdate = () => false;

const leaveGroup = (group) => true;

const translateMatrix = (mat, vec) => mat;

const connectNodes = (src, dest) => true;

const generateCode = (ast) => "const a = 1;";

const reportError = (msg, line) => console.error(msg);

const establishHandshake = (sock) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const createConstraint = (body1, body2) => ({});

const parseLogTopics = (topics) => ["Transfer"];

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const setDetune = (osc, cents) => osc.detune = cents;

const checkBalance = (addr) => "10.5 ETH";

const bundleAssets = (assets) => "";

const exitScope = (table) => true;

const scaleMatrix = (mat, vec) => mat;

const traceroute = (host) => ["192.168.1.1"];

const checkUpdate = () => ({ hasUpdate: false });

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const enableBlend = (func) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const createSphereShape = (r) => ({ type: 'sphere' });

const compileToBytecode = (ast) => new Uint8Array();

const rateLimitCheck = (ip) => true;

const claimRewards = (pool) => "0.5 ETH";

const preventCSRF = () => "csrf_token";

const verifyIR = (ir) => true;

const deserializeAST = (json) => JSON.parse(json);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const useProgram = (program) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createTCPSocket = () => ({ fd: 1 });

const captureFrame = () => "frame_data_buffer";

const vertexAttrib3f = (idx, x, y, z) => true;

const calculateComplexity = (ast) => 1;

const addGeneric6DofConstraint = (world, c) => true;

const detectDebugger = () => false;

const createDirectoryRecursive = (path) => path.split('/').length;

const monitorClipboard = () => "";

const rotateLogFiles = () => true;

const decryptStream = (stream, key) => stream;

const mutexLock = (mtx) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const findLoops = (cfg) => [];

const createThread = (func) => ({ tid: 1 });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const blockMaliciousTraffic = (ip) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const muteStream = () => true;

const enterScope = (table) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const updateTransform = (body) => true;

const getCpuLoad = () => Math.random() * 100;

const lookupSymbol = (table, name) => ({});

const activeTexture = (unit) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const createASTNode = (type, val) => ({ type, val });

const writePipe = (fd, data) => data.length;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const getMediaDuration = () => 3600;

const addSliderConstraint = (world, c) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const interestPeer = (peer) => ({ ...peer, interested: true });

const getProgramInfoLog = (program) => "";

const protectMemory = (ptr, size, flags) => true;

const createProcess = (img) => ({ pid: 100 });

const deleteProgram = (program) => true;

const getShaderInfoLog = (shader) => "";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const extractArchive = (archive) => ["file1", "file2"];

const execProcess = (path) => true;

const invalidateCache = (key) => true;

const disconnectNodes = (node) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const calculateCRC32 = (data) => "00000000";

const verifyChecksum = (data, sum) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const encryptStream = (stream, key) => stream;

const checkBatteryLevel = () => 100;

const negotiateProtocol = () => "HTTP/2.0";

const disablePEX = () => false;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const shutdownComputer = () => console.log("Shutting down...");

const obfuscateString = (str) => btoa(str);

const adjustPlaybackSpeed = (rate) => rate;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const addHingeConstraint = (world, c) => true;

const dhcpDiscover = () => true;

const uniform1i = (loc, val) => true;

const startOscillator = (osc, time) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const unlockRow = (id) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const allocateMemory = (size) => 0x1000;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const verifySignature = (tx, sig) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const verifyProofOfWork = (nonce) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const registerGestureHandler = (gesture) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const decapsulateFrame = (frame) => frame;

const cullFace = (mode) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const optimizeTailCalls = (ast) => ast;

const listenSocket = (sock, backlog) => true;

const addWheel = (vehicle, info) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const dhcpOffer = (ip) => true;

const createParticleSystem = (count) => ({ particles: [] });

const generateMipmaps = (target) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const reassemblePacket = (fragments) => fragments[0];

const linkModules = (modules) => ({});

const handleTimeout = (sock) => true;

const anchorSoftBody = (soft, rigid) => true;

const decompressGzip = (data) => data;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const encryptLocalStorage = (key, val) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const checkTypes = (ast) => [];

const compileVertexShader = (source) => ({ compiled: true });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

// Anti-shake references
const _ref_g26ymh = { createGainNode };
const _ref_19hjik = { switchVLAN };
const _ref_vyz3by = { readPixels };
const _ref_8flyra = { validateProgram };
const _ref_4jq8pz = { drawElements };
const _ref_tc63la = { compileFragmentShader };
const _ref_4ptzev = { detectCollision };
const _ref_9nlcmm = { getExtension };
const _ref_zctg1c = { setVelocity };
const _ref_kwb0i1 = { attachRenderBuffer };
const _ref_2uy96m = { stopOscillator };
const _ref_tc4dtq = { addConeTwistConstraint };
const _ref_vasy3o = { setFrequency };
const _ref_zpsjvc = { checkParticleCollision };
const _ref_xr5wsz = { createOscillator };
const _ref_u8z5cw = { calculateGasFee };
const _ref_i4ofyx = { lockRow };
const _ref_mpap9b = { eliminateDeadCode };
const _ref_iv9xnb = { createAudioContext };
const _ref_2qw876 = { updateParticles };
const _ref_ltbp55 = { beginTransaction };
const _ref_ur07lt = { detectPacketLoss };
const _ref_y7jqq8 = { animateTransition };
const _ref_7m892n = { filterTraffic };
const _ref_2bg0xv = { obfuscateCode };
const _ref_mi42vc = { killParticles };
const _ref_kt0tw9 = { connectToTracker };
const _ref_a264hh = { uploadCrashReport };
const _ref_2lqf63 = { cacheQueryResults };
const _ref_ff7wf9 = { restoreDatabase };
const _ref_k1rz8b = { compressGzip };
const _ref_7fuqwc = { generateSourceMap };
const _ref_k2li2y = { closeSocket };
const _ref_snfk5u = { spoofReferer };
const _ref_1dwom0 = { receivePacket };
const _ref_ictne8 = { createFrameBuffer };
const _ref_qzgpuw = { inferType };
const _ref_lutv26 = { multicastMessage };
const _ref_1u9taz = { checkIntegrityToken };
const _ref_xg8d5n = { unchokePeer };
const _ref_kh4ckv = { normalizeFeatures };
const _ref_df6rw5 = { uniform3f };
const _ref_fxo3p5 = { deleteBuffer };
const _ref_92x5k0 = { merkelizeRoot };
const _ref_fori7e = { checkIntegrityConstraint };
const _ref_1vykke = { unlockFile };
const _ref_1q3i97 = { dumpSymbolTable };
const _ref_il3zrg = { foldConstants };
const _ref_wihgm9 = { sanitizeSQLInput };
const _ref_jdd1qk = { createVehicle };
const _ref_26h2s8 = { checkRootAccess };
const _ref_39z1yi = { decodeABI };
const _ref_kk5lm5 = { computeDominators };
const _ref_6rcl1w = { clearScreen };
const _ref_c97zc5 = { scrapeTracker };
const _ref_z5d4jk = { removeMetadata };
const _ref_1tm3mw = { checkPortAvailability };
const _ref_jsc54z = { allocateRegisters };
const _ref_vhetex = { dropTable };
const _ref_uyitfw = { renderCanvasLayer };
const _ref_ffgof7 = { setViewport };
const _ref_3dgmo9 = { triggerHapticFeedback };
const _ref_qwguzp = { logErrorToFile };
const _ref_sao2oy = { installUpdate };
const _ref_8swzav = { leaveGroup };
const _ref_ml8ce4 = { translateMatrix };
const _ref_gxln91 = { connectNodes };
const _ref_q11d66 = { generateCode };
const _ref_5aha7i = { reportError };
const _ref_r9k08o = { establishHandshake };
const _ref_qwkp9j = { decodeAudioData };
const _ref_9ohbtw = { createConstraint };
const _ref_l4qww4 = { parseLogTopics };
const _ref_j4jxqz = { switchProxyServer };
const _ref_l0mboj = { setDetune };
const _ref_pn2i7l = { checkBalance };
const _ref_eeealy = { bundleAssets };
const _ref_62s9lm = { exitScope };
const _ref_roy6z6 = { scaleMatrix };
const _ref_qnbmj8 = { traceroute };
const _ref_a91loj = { checkUpdate };
const _ref_b61qmq = { allocateDiskSpace };
const _ref_y6r20k = { enableBlend };
const _ref_x0aaf2 = { verifyMagnetLink };
const _ref_6vs5me = { createSphereShape };
const _ref_3xpzid = { compileToBytecode };
const _ref_zi7dr9 = { rateLimitCheck };
const _ref_zwqv29 = { claimRewards };
const _ref_2o1jsw = { preventCSRF };
const _ref_pwm2ak = { verifyIR };
const _ref_s2qobb = { deserializeAST };
const _ref_7z110h = { performTLSHandshake };
const _ref_yvfqij = { useProgram };
const _ref_opk361 = { bindSocket };
const _ref_qu84c7 = { analyzeQueryPlan };
const _ref_xipg9z = { requestPiece };
const _ref_luddf5 = { createTCPSocket };
const _ref_smfvdg = { captureFrame };
const _ref_dur4a4 = { vertexAttrib3f };
const _ref_ip546q = { calculateComplexity };
const _ref_5lj1j5 = { addGeneric6DofConstraint };
const _ref_tpj922 = { detectDebugger };
const _ref_7om4vy = { createDirectoryRecursive };
const _ref_7gt2hi = { monitorClipboard };
const _ref_vshlav = { rotateLogFiles };
const _ref_yfq8os = { decryptStream };
const _ref_5namet = { mutexLock };
const _ref_lstngd = { keepAlivePing };
const _ref_a2vwty = { findLoops };
const _ref_zns7yw = { createThread };
const _ref_8c7sqi = { initWebGLContext };
const _ref_xe7mc9 = { blockMaliciousTraffic };
const _ref_okhhkl = { debounceAction };
const _ref_mvscbu = { muteStream };
const _ref_3oagl8 = { enterScope };
const _ref_om6ayr = { rotateUserAgent };
const _ref_8iua85 = { FileValidator };
const _ref_i1j190 = { updateTransform };
const _ref_tz1f58 = { getCpuLoad };
const _ref_9c9cjd = { lookupSymbol };
const _ref_paze1d = { activeTexture };
const _ref_z7lxb5 = { calculateRestitution };
const _ref_z0k1j3 = { createASTNode };
const _ref_5kgvuy = { writePipe };
const _ref_vd5d3x = { computeNormal };
const _ref_7lhgq0 = { getMediaDuration };
const _ref_44aj5j = { addSliderConstraint };
const _ref_qyiwyl = { shardingTable };
const _ref_pl2d5z = { compactDatabase };
const _ref_faqyiw = { interestPeer };
const _ref_lzl5jg = { getProgramInfoLog };
const _ref_afqmrw = { protectMemory };
const _ref_gx8yw5 = { createProcess };
const _ref_284z6s = { deleteProgram };
const _ref_vj2d2q = { getShaderInfoLog };
const _ref_c76jb4 = { migrateSchema };
const _ref_n8e26v = { extractArchive };
const _ref_gp783g = { execProcess };
const _ref_udtpa8 = { invalidateCache };
const _ref_a1r9ru = { disconnectNodes };
const _ref_wx8jl4 = { transcodeStream };
const _ref_aywgm7 = { createBiquadFilter };
const _ref_tzvfki = { traceStack };
const _ref_e2j3t5 = { calculateCRC32 };
const _ref_m3x31v = { verifyChecksum };
const _ref_u956gv = { uniformMatrix4fv };
const _ref_eq2ynv = { terminateSession };
const _ref_5jn0qk = { encryptStream };
const _ref_dht24p = { checkBatteryLevel };
const _ref_n03kts = { negotiateProtocol };
const _ref_duh25n = { disablePEX };
const _ref_nnq5h4 = { generateUUIDv5 };
const _ref_t8omcb = { shutdownComputer };
const _ref_1csotb = { obfuscateString };
const _ref_t0uo3g = { adjustPlaybackSpeed };
const _ref_71rtje = { parseStatement };
const _ref_bwppsn = { addHingeConstraint };
const _ref_9so3c0 = { dhcpDiscover };
const _ref_2ykozi = { uniform1i };
const _ref_4xw7iv = { startOscillator };
const _ref_aex24i = { computeSpeedAverage };
const _ref_zf2zqn = { unlockRow };
const _ref_he5zud = { backupDatabase };
const _ref_dvztfm = { createMeshShape };
const _ref_hgfhh1 = { allocateMemory };
const _ref_tjk977 = { calculateSHA256 };
const _ref_tbnez1 = { verifySignature };
const _ref_sh8ozb = { signTransaction };
const _ref_kvfl1p = { vertexAttribPointer };
const _ref_64lzhk = { verifyProofOfWork };
const _ref_xrafaa = { connectionPooling };
const _ref_o40a2v = { registerGestureHandler };
const _ref_z6tlh4 = { parseExpression };
const _ref_zh5v00 = { decapsulateFrame };
const _ref_phodqg = { cullFace };
const _ref_8e3ooi = { createPhysicsWorld };
const _ref_8wfbpp = { convexSweepTest };
const _ref_dgsbwb = { optimizeTailCalls };
const _ref_i7zz9o = { listenSocket };
const _ref_qvooki = { addWheel };
const _ref_rid48o = { captureScreenshot };
const _ref_b4uad0 = { calculateLayoutMetrics };
const _ref_hib14h = { dhcpOffer };
const _ref_1oqg7z = { createParticleSystem };
const _ref_draw0j = { generateMipmaps };
const _ref_h12857 = { lazyLoadComponent };
const _ref_ros3sl = { reassemblePacket };
const _ref_tix56o = { linkModules };
const _ref_zd8ci7 = { handleTimeout };
const _ref_cedus6 = { anchorSoftBody };
const _ref_gbexlx = { decompressGzip };
const _ref_m7e518 = { getAppConfig };
const _ref_0lfiwu = { encryptLocalStorage };
const _ref_43pf0c = { prioritizeRarestPiece };
const _ref_9hwe8h = { checkTypes };
const _ref_pi48f8 = { compileVertexShader };
const _ref_nx8oru = { setSteeringValue };
const _ref_rxigyg = { createMediaStreamSource };
const _ref_n7ve6b = { parseSubtitles };
const _ref_ybok5e = { throttleRequests }; 
    });
})({}, {});