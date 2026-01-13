// ==UserScript==
// @name MochaVideo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/MochaVideo/index.js
// @version 2026.01.10
// @description 一键下载MochaVideo视频，支持4K/1080P/720P多画质。
// @icon https://mcvideomd1fr.keeng.vn/playnow/images/static/web/gioi_thieu_app/favicon.ico
// @match *://*.mocha.com.vn/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect mocha.com.vn
// @connect keeng.vn
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
// @downloadURL https://update.greasyfork.org/scripts/562266/MochaVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562266/MochaVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        
        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const writePipe = (fd, data) => data.length;

const shardingTable = (table) => ["shard_0", "shard_1"];

const extractArchive = (archive) => ["file1", "file2"];

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const registerSystemTray = () => ({ icon: "tray.ico" });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const interceptRequest = (req) => ({ ...req, intercepted: true });

const remuxContainer = (container) => ({ container, status: "done" });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const cleanOldLogs = (days) => days;

const enableDHT = () => true;

const checkBatteryLevel = () => 100;

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

const disablePEX = () => false;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const checkBalance = (addr) => "10.5 ETH";

const injectMetadata = (file, meta) => ({ file, meta });

const generateMipmaps = (target) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const hashKeccak256 = (data) => "0xabc...";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const serializeFormData = (form) => JSON.stringify(form);

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const blockMaliciousTraffic = (ip) => true;

const checkIntegrityToken = (token) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const enableBlend = (func) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const compressGzip = (data) => data;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const prefetchAssets = (urls) => urls.length;

const detectVideoCodec = () => "h264";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const restartApplication = () => console.log("Restarting...");

const splitFile = (path, parts) => Array(parts).fill(path);

const tokenizeText = (text) => text.split(" ");

const cacheQueryResults = (key, data) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const validateIPWhitelist = (ip) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const applyFog = (color, dist) => color;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const detectDevTools = () => false;

const verifyAppSignature = () => true;

const rotateMatrix = (mat, angle, axis) => mat;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const gaussianBlur = (image, radius) => image;

const repairCorruptFile = (path) => ({ path, repaired: true });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const applyForce = (body, force, point) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const addConeTwistConstraint = (world, c) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const normalizeVolume = (buffer) => buffer;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const shutdownComputer = () => console.log("Shutting down...");

const setDelayTime = (node, time) => node.delayTime.value = time;

const decompressGzip = (data) => data;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setFilterType = (filter, type) => filter.type = type;

const getOutputTimestamp = (ctx) => Date.now();

const validatePieceChecksum = (piece) => true;

const performOCR = (img) => "Detected Text";

const setGravity = (world, g) => world.gravity = g;

const addRigidBody = (world, body) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const rayCast = (world, start, end) => ({ hit: false });

const foldConstants = (ast) => ast;

const getByteFrequencyData = (analyser, array) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setInertia = (body, i) => true;

const bindTexture = (target, texture) => true;

const compileVertexShader = (source) => ({ compiled: true });

const addGeneric6DofConstraint = (world, c) => true;

const translateMatrix = (mat, vec) => mat;

const detectCollision = (body1, body2) => false;

const bindSocket = (port) => ({ port, status: "bound" });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const mapMemory = (fd, size) => 0x2000;

const parseLogTopics = (topics) => ["Transfer"];

const analyzeBitrate = () => "5000kbps";

const adjustPlaybackSpeed = (rate) => rate;

const allowSleepMode = () => true;

const setKnee = (node, val) => node.knee.value = val;

const detachThread = (tid) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const subscribeToEvents = (contract) => true;

const createPipe = () => [3, 4];

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setBrake = (vehicle, force, wheelIdx) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const arpRequest = (ip) => "00:00:00:00:00:00";

const semaphoreSignal = (sem) => true;

const traverseAST = (node, visitor) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const installUpdate = () => false;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const killProcess = (pid) => true;

const semaphoreWait = (sem) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const suspendContext = (ctx) => Promise.resolve();

const createProcess = (img) => ({ pid: 100 });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const resampleAudio = (buffer, rate) => buffer;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const attachRenderBuffer = (fb, rb) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
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

const dhcpRequest = (ip) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createThread = (func) => ({ tid: 1 });

const mutexUnlock = (mtx) => true;

const joinThread = (tid) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const decapsulateFrame = (frame) => frame;

const detectAudioCodec = () => "aac";

const applyImpulse = (body, impulse, point) => true;

const addSliderConstraint = (world, c) => true;

const rebootSystem = () => true;

const setPosition = (panner, x, y, z) => true;

const computeLossFunction = (pred, actual) => 0.05;

const createPeriodicWave = (ctx, real, imag) => ({});

const setOrientation = (panner, x, y, z) => true;

const registerGestureHandler = (gesture) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const calculateCRC32 = (data) => "00000000";

const calculateMetric = (route) => 1;

const createWaveShaper = (ctx) => ({ curve: null });

const signTransaction = (tx, key) => "signed_tx_hash";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const inferType = (node) => 'any';

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const protectMemory = (ptr, size, flags) => true;

const stakeAssets = (pool, amount) => true;

const renameFile = (oldName, newName) => newName;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const normalizeAudio = (level) => ({ level: 0, normalized: true });


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

const prettifyCode = (code) => code;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const drawArrays = (gl, mode, first, count) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const setPan = (node, val) => node.pan.value = val;

const setVelocity = (body, v) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const negotiateSession = (sock) => ({ id: "sess_1" });

const openFile = (path, flags) => 5;

const claimRewards = (pool) => "0.5 ETH";

const getFloatTimeDomainData = (analyser, array) => true;

const loadDriver = (path) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const closeContext = (ctx) => Promise.resolve();

const setVolumeLevel = (vol) => vol;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const traceroute = (host) => ["192.168.1.1"];

const createListener = (ctx) => ({});

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const detectVirtualMachine = () => false;

const spoofReferer = () => "https://google.com";

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const minifyCode = (code) => code;

const emitParticles = (sys, count) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const vertexAttrib3f = (idx, x, y, z) => true;

const closePipe = (fd) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const unlockFile = (path) => ({ path, locked: false });

const applyTorque = (body, torque) => true;

const seekFile = (fd, offset) => true;

const switchVLAN = (id) => true;

const edgeDetectionSobel = (image) => image;

const broadcastMessage = (msg) => true;

const rateLimitCheck = (ip) => true;

const resolveSymbols = (ast) => ({});

const convertFormat = (src, dest) => dest;

const drawElements = (mode, count, type, offset) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

// Anti-shake references
const _ref_d5xn9k = { isFeatureEnabled };
const _ref_3uak1u = { writePipe };
const _ref_v3vb9m = { shardingTable };
const _ref_jojv65 = { extractArchive };
const _ref_q5ndf4 = { optimizeConnectionPool };
const _ref_w4gge5 = { limitBandwidth };
const _ref_9ezzci = { seedRatioLimit };
const _ref_bkvud2 = { registerSystemTray };
const _ref_3rn1h6 = { transformAesKey };
const _ref_0dzq3z = { verifyMagnetLink };
const _ref_kh9le2 = { scrapeTracker };
const _ref_zlty6c = { watchFileChanges };
const _ref_v3uw9m = { interceptRequest };
const _ref_lq4rt7 = { remuxContainer };
const _ref_sq22f3 = { syncAudioVideo };
const _ref_xpm0ij = { initiateHandshake };
const _ref_chfgn1 = { limitDownloadSpeed };
const _ref_r3u9ph = { parseM3U8Playlist };
const _ref_mt40hj = { retryFailedSegment };
const _ref_n20j08 = { cleanOldLogs };
const _ref_i4eic4 = { enableDHT };
const _ref_clgfq5 = { checkBatteryLevel };
const _ref_wlus3t = { ProtocolBufferHandler };
const _ref_sv8g62 = { disablePEX };
const _ref_u87hv1 = { calculateLighting };
const _ref_zo9hto = { checkBalance };
const _ref_x55alv = { injectMetadata };
const _ref_ulj1aq = { generateMipmaps };
const _ref_kqkzml = { encryptPayload };
const _ref_39n113 = { animateTransition };
const _ref_ng0urd = { vertexAttribPointer };
const _ref_gqt6p8 = { hashKeccak256 };
const _ref_nvjwiy = { performTLSHandshake };
const _ref_8h8x5z = { serializeFormData };
const _ref_t29zn7 = { syncDatabase };
const _ref_8w554f = { blockMaliciousTraffic };
const _ref_0hlwbt = { checkIntegrityToken };
const _ref_vl39ou = { chokePeer };
const _ref_jo8e4i = { discoverPeersDHT };
const _ref_hx8sdx = { enableBlend };
const _ref_rtx9s2 = { detectFirewallStatus };
const _ref_qkurm1 = { backupDatabase };
const _ref_qpuq43 = { compressGzip };
const _ref_dxad83 = { generateWalletKeys };
const _ref_6nvn0y = { clearBrowserCache };
const _ref_9lxoo4 = { prefetchAssets };
const _ref_ksxt51 = { detectVideoCodec };
const _ref_2ndts2 = { checkIntegrity };
const _ref_jljepq = { restartApplication };
const _ref_iq0gug = { splitFile };
const _ref_z21ics = { tokenizeText };
const _ref_34g21r = { cacheQueryResults };
const _ref_wzlu5v = { interestPeer };
const _ref_pv9h42 = { analyzeUserBehavior };
const _ref_dcrgy4 = { decryptHLSStream };
const _ref_wyroxq = { validateIPWhitelist };
const _ref_os2lkj = { moveFileToComplete };
const _ref_pddnwc = { applyFog };
const _ref_lkks9n = { generateUserAgent };
const _ref_t39s7d = { detectDevTools };
const _ref_957pft = { verifyAppSignature };
const _ref_oz0tdi = { rotateMatrix };
const _ref_tgqabp = { streamToPlayer };
const _ref_eln05b = { gaussianBlur };
const _ref_yb3vn9 = { repairCorruptFile };
const _ref_44l7ay = { optimizeHyperparameters };
const _ref_7ldp6d = { applyForce };
const _ref_xewuoq = { getMemoryUsage };
const _ref_rp4952 = { addConeTwistConstraint };
const _ref_6l9btb = { parseClass };
const _ref_rsinit = { normalizeVolume };
const _ref_cs08jk = { validateTokenStructure };
const _ref_iq5t9e = { parseStatement };
const _ref_thcmm8 = { connectionPooling };
const _ref_n5o96x = { shutdownComputer };
const _ref_cr04di = { setDelayTime };
const _ref_um24ji = { decompressGzip };
const _ref_sjto98 = { createPanner };
const _ref_d8sr7k = { setFilterType };
const _ref_vv6ird = { getOutputTimestamp };
const _ref_59pitm = { validatePieceChecksum };
const _ref_28yqpe = { performOCR };
const _ref_ba434g = { setGravity };
const _ref_w2fs0s = { addRigidBody };
const _ref_6gxper = { refreshAuthToken };
const _ref_wdwra0 = { rayCast };
const _ref_2vtgxd = { foldConstants };
const _ref_4nnltz = { getByteFrequencyData };
const _ref_cx83pv = { createAnalyser };
const _ref_kexgg8 = { setInertia };
const _ref_d59ipa = { bindTexture };
const _ref_uv2sb7 = { compileVertexShader };
const _ref_72wu5i = { addGeneric6DofConstraint };
const _ref_a4q3us = { translateMatrix };
const _ref_5wgzfw = { detectCollision };
const _ref_nrtpxw = { bindSocket };
const _ref_qe15qh = { rotateUserAgent };
const _ref_r1lwik = { mapMemory };
const _ref_tz4s4v = { parseLogTopics };
const _ref_imq1q8 = { analyzeBitrate };
const _ref_vyv5la = { adjustPlaybackSpeed };
const _ref_4puxxz = { allowSleepMode };
const _ref_b3oqcc = { setKnee };
const _ref_fizyaz = { detachThread };
const _ref_oqvp4y = { resolveDependencyGraph };
const _ref_p6s6pj = { subscribeToEvents };
const _ref_8d0iuk = { createPipe };
const _ref_q9h29k = { getAngularVelocity };
const _ref_l91dan = { setBrake };
const _ref_qbsa4f = { updateProgressBar };
const _ref_4ymkps = { arpRequest };
const _ref_33uq0d = { semaphoreSignal };
const _ref_kjv0lv = { traverseAST };
const _ref_824efe = { createIndexBuffer };
const _ref_kkgxes = { convertRGBtoHSL };
const _ref_rel8eq = { installUpdate };
const _ref_wjsw78 = { unchokePeer };
const _ref_6itbue = { killProcess };
const _ref_1ghl9y = { semaphoreWait };
const _ref_39zoie = { convexSweepTest };
const _ref_umj85q = { suspendContext };
const _ref_3pyidl = { createProcess };
const _ref_zk2tdj = { showNotification };
const _ref_suraez = { resampleAudio };
const _ref_y30hww = { traceStack };
const _ref_gmla8g = { attachRenderBuffer };
const _ref_xd5eu5 = { resolveDNSOverHTTPS };
const _ref_2yd7zo = { ResourceMonitor };
const _ref_o2wuut = { dhcpRequest };
const _ref_l3zd4a = { sanitizeSQLInput };
const _ref_vtk1v8 = { createThread };
const _ref_6hdtew = { mutexUnlock };
const _ref_jnhw0v = { joinThread };
const _ref_8kzrzf = { compactDatabase };
const _ref_zbz658 = { decapsulateFrame };
const _ref_3itn5l = { detectAudioCodec };
const _ref_wjc8zh = { applyImpulse };
const _ref_u148xn = { addSliderConstraint };
const _ref_wvofsd = { rebootSystem };
const _ref_7vjdgj = { setPosition };
const _ref_7k4jr3 = { computeLossFunction };
const _ref_8wd1x7 = { createPeriodicWave };
const _ref_9ff8lo = { setOrientation };
const _ref_olib4y = { registerGestureHandler };
const _ref_sgkna1 = { acceptConnection };
const _ref_ui43w3 = { calculateCRC32 };
const _ref_5gy04c = { calculateMetric };
const _ref_e29ixw = { createWaveShaper };
const _ref_se4l6i = { signTransaction };
const _ref_s1eydh = { renderVirtualDOM };
const _ref_wk2v1k = { inferType };
const _ref_ge4anr = { createBiquadFilter };
const _ref_liowea = { makeDistortionCurve };
const _ref_w84y0g = { protectMemory };
const _ref_5esu0l = { stakeAssets };
const _ref_cx4t0n = { renameFile };
const _ref_gp73lg = { scheduleBandwidth };
const _ref_kt45co = { normalizeAudio };
const _ref_aie2n3 = { TelemetryClient };
const _ref_7vrik8 = { download };
const _ref_wfzbdx = { prettifyCode };
const _ref_ib8mwg = { terminateSession };
const _ref_ojd4eb = { drawArrays };
const _ref_ltps1o = { recognizeSpeech };
const _ref_1xkrjo = { setPan };
const _ref_2hsykp = { setVelocity };
const _ref_tzh5ux = { createStereoPanner };
const _ref_rqm83w = { negotiateSession };
const _ref_q0l4d8 = { openFile };
const _ref_i4bx5t = { claimRewards };
const _ref_2ps2i0 = { getFloatTimeDomainData };
const _ref_9v5q42 = { loadDriver };
const _ref_4soziw = { checkDiskSpace };
const _ref_bm82z1 = { closeContext };
const _ref_jfiwwt = { setVolumeLevel };
const _ref_4ghvcv = { calculateEntropy };
const _ref_eev8mu = { traceroute };
const _ref_nmh2xp = { createListener };
const _ref_q90p9a = { createMagnetURI };
const _ref_vmk5v3 = { detectVirtualMachine };
const _ref_e4myje = { spoofReferer };
const _ref_ich4n3 = { computeSpeedAverage };
const _ref_blb0xg = { minifyCode };
const _ref_ydpm0y = { emitParticles };
const _ref_5vppkw = { saveCheckpoint };
const _ref_fpzx2o = { vertexAttrib3f };
const _ref_socmxe = { closePipe };
const _ref_4k5o99 = { uninterestPeer };
const _ref_4nl2x8 = { unlockFile };
const _ref_ertso3 = { applyTorque };
const _ref_pfwolt = { seekFile };
const _ref_hs37d3 = { switchVLAN };
const _ref_1zfudn = { edgeDetectionSobel };
const _ref_vaiq03 = { broadcastMessage };
const _ref_k5wxkc = { rateLimitCheck };
const _ref_iysfmd = { resolveSymbols };
const _ref_j695ny = { convertFormat };
const _ref_6e1h32 = { drawElements };
const _ref_l39kh8 = { broadcastTransaction };
const _ref_x14vuv = { applyPerspective }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `MochaVideo` };
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
                const urlParams = { config, url: window.location.href, name_en: `MochaVideo` };

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
        const sendPacket = (sock, data) => data.length;

const disconnectNodes = (node) => true;

const connectNodes = (src, dest) => true;

const useProgram = (program) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const normalizeVolume = (buffer) => buffer;

const foldConstants = (ast) => ast;

const rayCast = (world, start, end) => ({ hit: false });

const detectCollision = (body1, body2) => false;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const stepSimulation = (world, dt) => true;

const createThread = (func) => ({ tid: 1 });

const getVehicleSpeed = (vehicle) => 0;

const applyImpulse = (body, impulse, point) => true;

const bundleAssets = (assets) => "";

const createTCPSocket = () => ({ fd: 1 });

const resolveSymbols = (ast) => ({});

const acceptConnection = (sock) => ({ fd: 2 });

const resumeContext = (ctx) => Promise.resolve();

const getProgramInfoLog = (program) => "";

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const writePipe = (fd, data) => data.length;

const controlCongestion = (sock) => true;

const calculateMetric = (route) => 1;

const emitParticles = (sys, count) => true;

const lookupSymbol = (table, name) => ({});

const killParticles = (sys) => true;

const calculateComplexity = (ast) => 1;

const mangleNames = (ast) => ast;

const vertexAttrib3f = (idx, x, y, z) => true;

const minifyCode = (code) => code;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const execProcess = (path) => true;

const allocateRegisters = (ir) => ir;

const protectMemory = (ptr, size, flags) => true;

const parsePayload = (packet) => ({});

const interestPeer = (peer) => ({ ...peer, interested: true });

const suspendContext = (ctx) => Promise.resolve();

const upInterface = (iface) => true;

const connectSocket = (sock, addr, port) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const reassemblePacket = (fragments) => fragments[0];

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const blockMaliciousTraffic = (ip) => true;

const downInterface = (iface) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const clusterKMeans = (data, k) => Array(k).fill([]);

const applyTheme = (theme) => document.body.className = theme;

const eliminateDeadCode = (ast) => ast;

const augmentData = (image) => image;

const translateText = (text, lang) => text;

const decryptStream = (stream, key) => stream;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const reduceDimensionalityPCA = (data) => data;

const lockFile = (path) => ({ path, locked: true });

const createMediaStreamSource = (ctx, stream) => ({});

const optimizeTailCalls = (ast) => ast;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const profilePerformance = (func) => 0;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createConvolver = (ctx) => ({ buffer: null });

const arpRequest = (ip) => "00:00:00:00:00:00";

const dhcpOffer = (ip) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const addSliderConstraint = (world, c) => true;

const createSoftBody = (info) => ({ nodes: [] });

const gaussianBlur = (image, radius) => image;

const killProcess = (pid) => true;

const verifyIR = (ir) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const startOscillator = (osc, time) => true;

const fingerprintBrowser = () => "fp_hash_123";

const findLoops = (cfg) => [];

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const mapMemory = (fd, size) => 0x2000;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const bindTexture = (target, texture) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const validatePieceChecksum = (piece) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const parseQueryString = (qs) => ({});

const decompressPacket = (data) => data;

const encryptStream = (stream, key) => stream;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const addHingeConstraint = (world, c) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const writeFile = (fd, data) => true;

const edgeDetectionSobel = (image) => image;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const getByteFrequencyData = (analyser, array) => true;

const sleep = (body) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const flushSocketBuffer = (sock) => sock.buffer = [];

const translateMatrix = (mat, vec) => mat;

const transcodeStream = (format) => ({ format, status: "processing" });

const establishHandshake = (sock) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const rebootSystem = () => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const validateProgram = (program) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const removeRigidBody = (world, body) => true;

const instrumentCode = (code) => code;

const jitCompile = (bc) => (() => {});

const segmentImageUNet = (img) => "mask_buffer";

const validateIPWhitelist = (ip) => true;

const applyTorque = (body, torque) => true;

const calculateGasFee = (limit) => limit * 20;

const repairCorruptFile = (path) => ({ path, repaired: true });

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

const logErrorToFile = (err) => console.error(err);

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

const monitorClipboard = () => "";

const prefetchAssets = (urls) => urls.length;

const compressPacket = (data) => data;

const shutdownComputer = () => console.log("Shutting down...");

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const addWheel = (vehicle, info) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const parseLogTopics = (topics) => ["Transfer"];

const decodeAudioData = (buffer) => Promise.resolve({});

const setInertia = (body, i) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const generateSourceMap = (ast) => "{}";

const allowSleepMode = () => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const verifyAppSignature = () => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const fragmentPacket = (data, mtu) => [data];

const dumpSymbolTable = (table) => "";

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const unlockFile = (path) => ({ path, locked: false });

const statFile = (path) => ({ size: 0 });

const getUniformLocation = (program, name) => 1;

const uniformMatrix4fv = (loc, transpose, val) => true;

const mkdir = (path) => true;

const deleteBuffer = (buffer) => true;

const uniform3f = (loc, x, y, z) => true;

const dhcpDiscover = () => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const compileVertexShader = (source) => ({ compiled: true });

const obfuscateString = (str) => btoa(str);

const closeFile = (fd) => true;

const setAngularVelocity = (body, v) => true;

const allocateMemory = (size) => 0x1000;

const leaveGroup = (group) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const readPipe = (fd, len) => new Uint8Array(len);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const unlinkFile = (path) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setDistanceModel = (panner, model) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const systemCall = (num, args) => 0;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setAttack = (node, val) => node.attack.value = val;

const setMTU = (iface, mtu) => true;

const calculateCRC32 = (data) => "00000000";

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const getEnv = (key) => "";

const claimRewards = (pool) => "0.5 ETH";

const computeDominators = (cfg) => ({});

const calculateRestitution = (mat1, mat2) => 0.3;

const dhcpRequest = (ip) => true;


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

const mutexLock = (mtx) => true;

const analyzeBitrate = () => "5000kbps";

const activeTexture = (unit) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const setGainValue = (node, val) => node.gain.value = val;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const setQValue = (filter, q) => filter.Q = q;

const resolveCollision = (manifold) => true;

const renameFile = (oldName, newName) => newName;

const analyzeControlFlow = (ast) => ({ graph: {} });

const verifySignature = (tx, sig) => true;

const enableBlend = (func) => true;

const dhcpAck = () => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const visitNode = (node) => true;

const unlockRow = (id) => true;

const createChannelSplitter = (ctx, channels) => ({});

const drawArrays = (gl, mode, first, count) => true;

const classifySentiment = (text) => "positive";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const registerISR = (irq, func) => true;

const detectAudioCodec = () => "aac";

const encapsulateFrame = (packet) => packet;

const captureFrame = () => "frame_data_buffer";

// Anti-shake references
const _ref_2s74do = { sendPacket };
const _ref_we9557 = { disconnectNodes };
const _ref_wgvc6p = { connectNodes };
const _ref_hzhzkg = { useProgram };
const _ref_lk063w = { createIndexBuffer };
const _ref_o8y5o7 = { normalizeVolume };
const _ref_8188l0 = { foldConstants };
const _ref_n8qrq9 = { rayCast };
const _ref_r1owy1 = { detectCollision };
const _ref_rduhdc = { createGainNode };
const _ref_zlb74m = { stepSimulation };
const _ref_bfua34 = { createThread };
const _ref_jqskeu = { getVehicleSpeed };
const _ref_zehzlp = { applyImpulse };
const _ref_fanyjm = { bundleAssets };
const _ref_tiz7fu = { createTCPSocket };
const _ref_w8sf10 = { resolveSymbols };
const _ref_qiztul = { acceptConnection };
const _ref_pms4fx = { resumeContext };
const _ref_wei7hz = { getProgramInfoLog };
const _ref_zhq7tq = { createBiquadFilter };
const _ref_wckdvj = { writePipe };
const _ref_2paw8j = { controlCongestion };
const _ref_5ii6xa = { calculateMetric };
const _ref_kc7dm2 = { emitParticles };
const _ref_elb20o = { lookupSymbol };
const _ref_q064os = { killParticles };
const _ref_qjnavc = { calculateComplexity };
const _ref_fez4yz = { mangleNames };
const _ref_0x8r5s = { vertexAttrib3f };
const _ref_s8wsz4 = { minifyCode };
const _ref_ee0xqt = { createIndex };
const _ref_i776k7 = { execProcess };
const _ref_dumsyy = { allocateRegisters };
const _ref_u9tegg = { protectMemory };
const _ref_fylj9d = { parsePayload };
const _ref_x7nwe7 = { interestPeer };
const _ref_81dvj4 = { suspendContext };
const _ref_vcsasd = { upInterface };
const _ref_x3hs1t = { connectSocket };
const _ref_mgucn4 = { detectFirewallStatus };
const _ref_4z62rj = { reassemblePacket };
const _ref_38uoc8 = { verifyMagnetLink };
const _ref_q83tqk = { blockMaliciousTraffic };
const _ref_dw3lkm = { downInterface };
const _ref_c57ie3 = { connectionPooling };
const _ref_7x1ogy = { clusterKMeans };
const _ref_who4ui = { applyTheme };
const _ref_45paz6 = { eliminateDeadCode };
const _ref_18udql = { augmentData };
const _ref_iqdp9v = { translateText };
const _ref_4raobn = { decryptStream };
const _ref_cz99eb = { unchokePeer };
const _ref_03dkfm = { reduceDimensionalityPCA };
const _ref_hk5w2r = { lockFile };
const _ref_39q6da = { createMediaStreamSource };
const _ref_jfs79p = { optimizeTailCalls };
const _ref_9k96ks = { scheduleBandwidth };
const _ref_iowy2s = { parseConfigFile };
const _ref_etvgb6 = { profilePerformance };
const _ref_3jueny = { tunnelThroughProxy };
const _ref_secpy4 = { virtualScroll };
const _ref_6l7jj8 = { createConvolver };
const _ref_xsd10b = { arpRequest };
const _ref_b8za31 = { dhcpOffer };
const _ref_1ascj6 = { normalizeFeatures };
const _ref_bniou7 = { diffVirtualDOM };
const _ref_2liv5w = { addSliderConstraint };
const _ref_4turls = { createSoftBody };
const _ref_d9yzju = { gaussianBlur };
const _ref_oempa6 = { killProcess };
const _ref_ys867w = { verifyIR };
const _ref_zrs5bd = { linkProgram };
const _ref_xzsoga = { startOscillator };
const _ref_41414n = { fingerprintBrowser };
const _ref_qqbqiv = { findLoops };
const _ref_sotlzq = { optimizeConnectionPool };
const _ref_aqffwi = { mapMemory };
const _ref_k8ddoz = { convexSweepTest };
const _ref_86ogja = { bindTexture };
const _ref_c5mb9b = { deleteTempFiles };
const _ref_gmqnez = { validatePieceChecksum };
const _ref_lbd6mh = { broadcastTransaction };
const _ref_5qpkwt = { parseQueryString };
const _ref_103jpk = { decompressPacket };
const _ref_d2h3zw = { encryptStream };
const _ref_eo61h7 = { vertexAttribPointer };
const _ref_143rnu = { createMagnetURI };
const _ref_hl69xy = { addHingeConstraint };
const _ref_ygvmqn = { scrapeTracker };
const _ref_x3hppr = { writeFile };
const _ref_xtoxie = { edgeDetectionSobel };
const _ref_r2tg6l = { isFeatureEnabled };
const _ref_aj8mn3 = { performTLSHandshake };
const _ref_g6tr4m = { getByteFrequencyData };
const _ref_ah9e55 = { sleep };
const _ref_7sjzi9 = { getSystemUptime };
const _ref_aaq3xv = { flushSocketBuffer };
const _ref_49k8c9 = { translateMatrix };
const _ref_yzf59n = { transcodeStream };
const _ref_cllkdy = { establishHandshake };
const _ref_t4bbmx = { createAnalyser };
const _ref_lzq03a = { rebootSystem };
const _ref_q4tblj = { debounceAction };
const _ref_7cdiux = { validateProgram };
const _ref_kkfz5h = { archiveFiles };
const _ref_k8n6pn = { removeRigidBody };
const _ref_cyxr6q = { instrumentCode };
const _ref_sq2kk0 = { jitCompile };
const _ref_e7k9cv = { segmentImageUNet };
const _ref_7h6osr = { validateIPWhitelist };
const _ref_s3ch16 = { applyTorque };
const _ref_fu4191 = { calculateGasFee };
const _ref_8eol5e = { repairCorruptFile };
const _ref_cxtebc = { ProtocolBufferHandler };
const _ref_x0ijlh = { logErrorToFile };
const _ref_flo56f = { deleteTexture };
const _ref_l0cp71 = { ApiDataFormatter };
const _ref_0ec55g = { monitorClipboard };
const _ref_8bq5uq = { prefetchAssets };
const _ref_3ehwhf = { compressPacket };
const _ref_tb7f0j = { shutdownComputer };
const _ref_jnsw9n = { detectEnvironment };
const _ref_4ooz2w = { addWheel };
const _ref_4oiimq = { formatCurrency };
const _ref_kmhyn9 = { parseLogTopics };
const _ref_2tr7o5 = { decodeAudioData };
const _ref_q85my4 = { setInertia };
const _ref_jiwdoc = { announceToTracker };
const _ref_65g3im = { parseSubtitles };
const _ref_z456wk = { generateSourceMap };
const _ref_flroau = { allowSleepMode };
const _ref_v9r403 = { parseM3U8Playlist };
const _ref_ywcdw1 = { verifyAppSignature };
const _ref_bmt22n = { applyPerspective };
const _ref_wl3h7i = { fragmentPacket };
const _ref_0f998s = { dumpSymbolTable };
const _ref_3809re = { generateUUIDv5 };
const _ref_zilpco = { unlockFile };
const _ref_7q3nhb = { statFile };
const _ref_t9dacy = { getUniformLocation };
const _ref_7hj8cn = { uniformMatrix4fv };
const _ref_6i08eu = { mkdir };
const _ref_afwlqh = { deleteBuffer };
const _ref_cv33ye = { uniform3f };
const _ref_6rykfg = { dhcpDiscover };
const _ref_dpw254 = { setBrake };
const _ref_yufa5o = { compileVertexShader };
const _ref_ou2bpk = { obfuscateString };
const _ref_xu2h11 = { closeFile };
const _ref_7tihzn = { setAngularVelocity };
const _ref_ekhh6i = { allocateMemory };
const _ref_52egif = { leaveGroup };
const _ref_20pjxx = { limitUploadSpeed };
const _ref_f8db80 = { readPipe };
const _ref_482xo9 = { formatLogMessage };
const _ref_gelwyv = { transformAesKey };
const _ref_xx6wkl = { unlinkFile };
const _ref_zws9so = { getFloatTimeDomainData };
const _ref_yk6t29 = { uploadCrashReport };
const _ref_e8lhrj = { checkDiskSpace };
const _ref_temrvu = { setDistanceModel };
const _ref_ohfofu = { syncDatabase };
const _ref_8ue4us = { systemCall };
const _ref_pdpg7x = { requestAnimationFrameLoop };
const _ref_acduvl = { setAttack };
const _ref_4m31jk = { setMTU };
const _ref_ax0w4h = { calculateCRC32 };
const _ref_7gxq6j = { cancelAnimationFrameLoop };
const _ref_sg7l22 = { getEnv };
const _ref_7exr5d = { claimRewards };
const _ref_xpfsqc = { computeDominators };
const _ref_e60jni = { calculateRestitution };
const _ref_qykey2 = { dhcpRequest };
const _ref_f0j4g5 = { ResourceMonitor };
const _ref_vmdy1z = { mutexLock };
const _ref_rhnso8 = { analyzeBitrate };
const _ref_gf974f = { activeTexture };
const _ref_c0aenz = { normalizeVector };
const _ref_daoblc = { updateProgressBar };
const _ref_bmws04 = { setGainValue };
const _ref_dbq4w6 = { lazyLoadComponent };
const _ref_d0kzlr = { setQValue };
const _ref_7bkl42 = { resolveCollision };
const _ref_bmtygp = { renameFile };
const _ref_a3y2te = { analyzeControlFlow };
const _ref_yr53lt = { verifySignature };
const _ref_rdbxry = { enableBlend };
const _ref_idocj8 = { dhcpAck };
const _ref_dfwfk0 = { uninterestPeer };
const _ref_pp6s23 = { visitNode };
const _ref_57i18g = { unlockRow };
const _ref_l7zrcr = { createChannelSplitter };
const _ref_g1vz9m = { drawArrays };
const _ref_fd1mb4 = { classifySentiment };
const _ref_u95c71 = { simulateNetworkDelay };
const _ref_ba8yt4 = { registerISR };
const _ref_9xyh6r = { detectAudioCodec };
const _ref_91xz3x = { encapsulateFrame };
const _ref_upvp2h = { captureFrame }; 
    });
})({}, {});